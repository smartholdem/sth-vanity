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

/**
 * Основная функция поиска, которая запускается в дочерних процессах.
 * @param {string} term - Строка для поиска.
 * @param {'prefix'|'suffix'|'contains'} mode - Режим поиска.
 * @param {number} processId - ID процесса.
 */
function findVanityAddress(term, mode, processId) {
    const upperCaseTerm = term.toUpperCase();
    let attempts = 0;

    while (true) {
        attempts++;
        const wallet = generateWallet();
        const address = wallet.address;
        let isMatch = false;

        switch (mode) {
            case 'suffix':
                isMatch = address.toUpperCase().endsWith(upperCaseTerm);
                break;
            case 'contains':
                isMatch = address.toUpperCase().includes(upperCaseTerm);
                break;
            case 'prefix':
            default:
                isMatch = address.substring(1).toUpperCase().startsWith(upperCaseTerm);
                break;
        }

        if (isMatch) {
            process.send({ found: true, wallet, attempts, pid: processId });
            process.exit(0);
        }

        if (attempts % 2000 === 0) {
            process.send({ found: false, attempts, pid: processId });
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    let searchTerm = args.find(arg => !arg.startsWith('--'));
    const threadsArg = args.find(arg => arg.startsWith('--threads='));
    const modeArg = args.find(arg => arg.startsWith('--mode='));

    // Определение режима поиска
    let mode = 'prefix'; // Режим по умолчанию
    if (modeArg) {
        const requestedMode = modeArg.split('=')[1];
        if (['prefix', 'suffix', 'contains'].includes(requestedMode)) {
            mode = requestedMode;
        }
    }

    if (!searchTerm) {
        if (cluster.isMaster) {
            console.log("Ошибка: Вы не указали строку для поиска.");
            console.log("Пример: node index.js MYPREFIX --mode=prefix --threads=4");
        }
        return;
    }

    if (mode === 'prefix' && searchTerm.toUpperCase().startsWith('S')) {
        searchTerm = searchTerm.substring(1);
    }

    if (cluster.isMaster) {
        let threadsCount = numCPUs;
        if (threadsArg) {
            const specified = parseInt(threadsArg.split('=')[1], 10);
            if (specified > 0) {
                threadsCount = Math.min(specified, numCPUs);
                console.log(`Будет использовано ${threadsCount} потоков (задано пользователем).`);
            } else {
                console.log(`Некорректное значение для --threads. Используем все доступные: ${threadsCount}.`);
            }
        }

        console.log(`Главный процесс ${process.pid} запущен.`);
        console.log(`Режим поиска: '${mode}'. Искомая строка: '${searchTerm}'.`);
        console.log(`Запускаю ${threadsCount} рабочих процессов...`);
        
        const startTime = Date.now();
        let totalAttempts = 0;
        const workers = {};

        for (let i = 0; i < threadsCount; i++) {
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

                for (const id in cluster.workers) {
                    cluster.workers[id].kill();
                }
                process.exit(0);
            } else {
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
        findVanityAddress(searchTerm, mode, process.pid);
    }
}

main();
