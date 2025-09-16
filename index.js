const { Identities } = require("@smartholdem/crypto");
const { generateMnemonic } = require("bip39");

/**
 * Генерирует новый случайный кошелек SmartHoldem.
 * @returns {{address: string, secret: string}} Объект с адресом и мнемонической фразой.
 */
function generateWallet() {
    const mnemonic = generateMnemonic();
    // Указываем network, 63 для STH Mainnet
    const address = Identities.Address.fromPassphrase(mnemonic, 63);
    return { address, secret: mnemonic };
}

function findVanityAddress(prefix) {
    console.log(`Начинаю поиск адреса с префиксом: S${prefix}...`);
    let wallet;
    let attempts = 0;
    const startTime = Date.now();

    // Адреса STH начинаются с 'S', поэтому мы ищем префикс после первой буквы.
    // Приводим префикс к верхнему регистру для сравнения.
    const upperCasePrefix = prefix.toUpperCase();

    while (true) {
        attempts++;
        wallet = generateWallet();
        
        // Проверяем, начинается ли адрес (без первой 'S') с нашего префикса
        if (wallet.address.substring(1).startsWith(upperCasePrefix)) {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; // в секундах
            console.log(`
Найдено за ${duration.toFixed(2)} секунд!`);
            console.log(`Попыток: ${attempts}`);
            console.log("--------------------------------------------------");
            console.log(`Адрес        : ${wallet.address}`);
            console.log(`Секретная фраза: ${wallet.secret}`);
            console.log("--------------------------------------------------");
            console.log("ВАЖНО: Сохраните вашу секретную фразу в надежном месте!");
            break;
        }

        // Выводим прогресс каждые 1000 попыток
        if (attempts % 1000 === 0) {
            process.stdout.write(`\rПроверено адресов: ${attempts}...`);
        }
    }
}

function main() {
    // Получаем префикс из аргументов командной строки
    const prefix = process.argv[2];

    if (!prefix) {
        console.log("Ошибка: Вы не указали префикс для поиска.");
        console.log("Пример использования: node index.js MYPREFIX");
        return;
    }

    findVanityAddress(prefix);
}

main();