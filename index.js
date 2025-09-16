const { Identities } = require("@smartholdem/crypto");
const { generateMnemonic } = require("bip39");
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

/**
 * Генерирует новый случайный кошелек SmartHoldem.
 * @returns {{address: string, secret: string}} Объект с адресом и мнемонической фразой.
 */
function generateWallet() {
    const mnemonic = generateMnemonic();
    const address = Identities.Address.fromPassphrase(mnemonic, 63);
    return { address, secret: mnemonic };
}

function findVanityAddress(prefix, processId) {
    const upperCasePrefix = prefix.toUpperCase();
    let attempts = 0;

    while (true) {
        attempts++;
        const wallet = generateWallet();
        
        if (wallet.address.substring(1).startsWith(upperCasePrefix)) {
            // Отправляем найденный кошелек главному процессу
            process.send({ found: true, wallet, attempts, pid: processId });
            // Завершаем рабочий процесс
            process.exit(0);
        }

        // Периодически отправляем отчет о проделанной работе
        if (attempts % 2000 === 0) {
            process.send({ found: false, attempts, pid: processId });
        }
    }
}

function main() {
    let prefix = process.argv[2];

    if (!prefix) {
        if (cluster.isMaster) {
            console.log("Ошибка: Вы не указали префикс для поиска.");
            console.log("Пример использования: node index.js MYPREFIX");
        }
        return;
    }

    // Если пользователь по ошибке ввел 'S' в начале, убираем его.
    if (prefix.toUpperCase().startsWith('S')) {
        prefix = prefix.substring(1);
    }

    if (cluster.isMaster) {
        console.log(`Главный процесс ${process.pid} запущен.`);
        console.log(`Запускаю ${numCPUs} рабочих процессов для поиска адреса, начинающегося на: S${prefix}...`);
        
        const startTime = Date.now();
        let totalAttempts = 0;

        const workers = {};

        for (let i = 0; i < numCPUs; i++) {
            const worker = cluster.fork();
            workers[worker.process.pid] = { id: i + 1, attempts: 0 };
        }

        cluster.on('message', (worker, message) => {
            if (message.found) {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                totalAttempts += message.attempts;

                console.log(`\n\nРабочий процесс #${workers[worker.process.pid].id} (PID: ${worker.process.pid}) нашел адрес!`);
                console.log(`\nНайдено за ${duration.toFixed(2)} секунд!`);
                console.log(`Всего попыток: ${totalAttempts}`);
                console.log("--------------------------------------------------");
                console.log(`Адрес        : ${message.wallet.address}`);
                console.log(`Секретная фраза: ${message.wallet.secret}`);
                console.log("--------------------------------------------------");
                console.log("ВАЖНО: Сохраните вашу секретную фразу в надежном месте!");

                // Завершаем все рабочие процессы
                for (const id in cluster.workers) {
                    cluster.workers[id].kill();
                }
                process.exit(0);
            } else {
                // Обновляем счетчик попыток для рабочего процесса
                workers[worker.process.pid].attempts = message.attempts;
                totalAttempts = Object.values(workers).reduce((sum, w) => sum + w.attempts, 0);
                const speed = Math.round(totalAttempts / ((Date.now() - startTime) / 1000));
                process.stdout.write(`\rПроверено адресов: ${totalAttempts} | Скорость: ${speed} адр/сек`);
            }
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log(`\nРабочий процесс ${worker.process.pid} завершил работу.`);
        });

    } else {
        // Это рабочий процесс
        findVanityAddress(prefix, process.pid);
        console.log(`Рабочий процесс ${process.pid} запущен.`);
    }
}

main();
