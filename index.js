#!/usr/bin/env node
const { Identities } = require("@smartholdem/crypto");
const { generateMnemonic } = require("bip39");
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

/**
 * Generates a new random SmartHoldem wallet.
 * @returns {{address: string, secret: string}} An object containing the address and mnemonic phrase.
 */
function generateWallet() {
    const mnemonic = generateMnemonic();
    const address = Identities.Address.fromPassphrase(mnemonic, 63);
    return { address, secret: mnemonic };
}

/**
 * The main search function that runs in child processes.
 * @param {string} term - The string to search for.
 * @param {'prefix'|'suffix'|'contains'} mode - The search mode.
 * @param {number} processId - The process ID.
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

/**
 * Displays usage help.
 */
function displayHelp() {
    console.log(`
Usage: node index.js [SEARCH_STRING] [--mode=MODE] [--threads=N] [--help]

Parameters:
  [SEARCH_STRING] (required) — The desired sequence of characters to search for. The search is case-insensitive.

  --mode=MODE (optional) — The search mode. Can be one of the following:
    - prefix (default): Searches for SEARCH_STRING at the beginning of the address (immediately after 'S').
    - suffix: Searches for SEARCH_STRING at the end of the address.
    - contains: Searches for SEARCH_STRING anywhere in the address.

  --threads=N (optional) — The number of threads (CPU cores) to use. If not specified, all available cores are used.
  
  --help — Display this help message.

Examples:
  - Find an address starting with 'S' + 'MYWALLET':
    node index.js MYWALLET

  - Find an address ending in '2025':
    node index.js 2025 --mode=suffix

  - Find an address that contains the word 'KING':
    node index.js KING --mode=contains

  - Get help:
    node index.js --help
    `);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help')) {
        displayHelp();
        return;
    }
    let searchTerm = args.find(arg => !arg.startsWith('--'));
    const threadsArg = args.find(arg => arg.startsWith('--threads='));
    const modeArg = args.find(arg => arg.startsWith('--mode='));

    // Determine search mode
    let mode = 'contains'; // Default mode
    if (modeArg) {
        const requestedMode = modeArg.split('=')[1];
        if (['prefix', 'suffix', 'contains'].includes(requestedMode)) {
            mode = requestedMode;
        }
    }

    if (!searchTerm) {
        if (cluster.isMaster) {
            console.log("Error: You did not specify a search string.");
            console.log("Example: sth-vanity MYSTRING --mode=contains --threads=4");
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
                console.log(`Using ${threadsCount} threads (user specified).`);
            } else {
                console.log(`Invalid value for --threads. Using all available: ${threadsCount}.`);
            }
        }

        console.log(`Master process ${process.pid} started.`);
        console.log(`Search mode: '${mode}'. Search term: '${searchTerm}'.`);
        console.log(`Starting ${threadsCount} worker processes...`);
        
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

                console.log(`\n\nWorker process #${workers[worker.process.pid].id} (PID: ${worker.process.pid}) found an address!`);
                console.log(`\nFound in ${duration.toFixed(2)} seconds!`);
                console.log(`Total attempts: ${totalAttempts}`);
                console.log("--------------------------------------------------");
                console.log(`Address        : ${message.wallet.address}`);
                console.log(`Secret phrase: ${message.wallet.secret}`);
                console.log("--------------------------------------------------");

                for (const id in cluster.workers) {
                    cluster.workers[id].kill();
                }
                process.exit(0);
            } else {
                workers[worker.process.pid].attempts = message.attempts;
                totalAttempts = Object.values(workers).reduce((sum, w) => sum + w.attempts, 0);
                const speed = Math.round(totalAttempts / ((Date.now() - startTime) / 1000));
                process.stdout.write(`\rAddresses checked: ${totalAttempts} | Speed: ${speed} addr/sec`);
            }
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log(`\nWorker process ${worker.process.pid} exited.`);
        });

    } else {
        // This is a worker process
        findVanityAddress(searchTerm, mode, process.pid);
    }
}

main();
