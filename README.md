# SmartHoldem Vanity Address Generator

This is a Node.js console application for generating "vanity" addresses for the SmartHoldem (STH) cryptocurrency. A vanity address is an address that starts with a specific, user-defined sequence of letters and numbers.

## Requirements

*   [Node.js](https://nodejs.org/) (version 12.x or higher)

## Installation

1.  Clone the repository or download the files.
2.  Open a terminal in the project directory.
3.  Install the dependencies by running the command:
    ```bash
    npm install
    ```

## Usage

To start the generator, use the following command:

```bash
node index.js [SEARCH_STRING] [--mode=MODE] [--threads=N]
```

### Parameters

*   `[SEARCH_STRING]` (required) — the desired sequence of characters to search for. The search is case-insensitive.

*   `--mode=MODE` (optional) — the search mode. Can be one of the following:
    *   `prefix` (default): searches for `SEARCH_STRING` at the beginning of the address (immediately after `S`).
    *   `suffix`: searches for `SEARCH_STRING` at the end of the address.
    *   `contains`: searches for `SEARCH_STRING` anywhere in the address.

*   `--threads=N` (optional) — the number of threads (CPU cores) to use. If not specified, all available cores are used.

### Examples

1.  **Search by prefix (default)**

    Find an address starting with `S` + `MYWALLET`:
    ```bash
    node index.js MYWALLET
    # or explicitly
    node index.js MYWALLET --mode=prefix
    ```

2.  **Search by suffix**

    Find an address ending in `2025`:
    ```bash
    node index.js 2025 --mode=suffix
    ```

3.  **Search by substring**

    Find an address that contains the word `GEMINI`:
    ```bash
    node index.js GEMINI --mode=contains
    ```

4.  **Combination of parameters**

    Find an address that contains `VIP`, using only 2 threads:
    ```bash
    node index.js VIP --mode=contains --threads=2
    ```

### Important

*   The search is case-insensitive. `mycoolwallet` and `MYCOOLWALLET` will produce the same result.
*   SmartHoldem addresses always start with the letter `S`. The script searches for your prefix immediately after this letter.
*   The longer the prefix, the significantly more time it will take to search.

## Output

During operation, the script will show the number of checked addresses. When a suitable address is found, the program will display the result in the console and exit.

```
Starting search for address with prefix: SMYCOOLWALLET...

Found in 34.12 seconds!
Attempts: 845123
--------------------------------------------------
Address        : SMyCoolWalletGf7kvp8vj6yPzCqRj9nBwX
Secret phrase: word1 word2 word3 ... word12
--------------------------------------------------
IMPORTANT: Save your secret phrase in a safe place!
```

**ATTENTION:** The secret mnemonic phrase is the only way to access your wallet. Keep it safe and never share it with anyone.
