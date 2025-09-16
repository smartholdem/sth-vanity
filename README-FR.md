# Générateur d'adresses personnalisées SmartHoldem

Ceci est une application console Node.js pour générer des adresses "personnalisées" (vanity) pour la crypto-monnaie SmartHoldem (STH). Une adresse personnalisée est une adresse qui commence par une séquence spécifique de lettres et de chiffres définie par l'utilisateur.

## Prérequis

*   [Node.js](https://nodejs.org/) (version 12.x ou supérieure)

## Installation

1.  Clonez le dépôt ou téléchargez les fichiers.
2.  Ouvrez un terminal dans le répertoire du projet.
3.  Installez les dépendances en exécutant la commande :
    ```bash
    npm install
    ```

## Utilisation

Pour démarrer le générateur, utilisez la commande suivante :

```bash
node index.js [CHAINE_DE_RECHERCHE] [--mode=MODE] [--threads=N]
```

### Paramètres

*   `[CHAINE_DE_RECHERCHE]` (obligatoire) — la séquence de caractères souhaitée à rechercher. La recherche est insensible à la casse.

*   `--mode=MODE` (facultatif) — le mode de recherche. Peut être l'un des suivants :
    *   `prefix` (par défaut) : recherche `CHAINE_DE_RECHERCHE` au début de l'adresse (immédiatement après `S`).
    *   `suffix`: recherche `CHAINE_DE_RECHERCHE` à la fin de l'adresse.
    *   `contains`: recherche `CHAINE_DE_RECHERCHE` n'importe où dans l'adresse.

*   `--threads=N` (facultatif) — le nombre de threads (cœurs de processeur) à utiliser. S'il n'est pas spécifié, tous les cœurs disponibles sont utilisés.

### Exemples

1.  **Recherche par préfixe (par défaut)**

    Trouver une adresse commençant par `S` + `MONPORTEFEUILLE` :
    ```bash
    node index.js MONPORTEFEUILLE
    # ou explicitement
    node index.js MONPORTEFEUILLE --mode=prefix
    ```

2.  **Recherche par suffixe**

    Trouver une adresse se terminant par `2025` :
    ```bash
    node index.js 2025 --mode=suffix
    ```

3.  **Recherche par sous-chaîne**

    Trouver une adresse contenant le mot `GEMINI` :
    ```bash
    node index.js GEMINI --mode=contains
    ```

4.  **Combinaison de paramètres**

    Trouver une adresse contenant `VIP`, en utilisant only 2 threads :
    ```bash
    node index.js VIP --mode=contains --threads=2
    ```

### Important

*   La recherche est insensible à la casse. `monportefeuillecool` et `MONPORTEFEUILLECOOL` produiront le même résultat.
*   Les adresses SmartHoldem commencent toujours par la lettre `S`. Le script recherche votre préfixe immédiatement après cette lettre.
*   Plus le préfixe est long, plus la recherche prendra de temps.

## Sortie

Pendant son fonctionnement, le script affichera le nombre d'adresses vérifiées. Lorsqu'une adresse appropriée est trouvée, le programme affichera le résultat dans la console et se terminera.

```
Lancement de la recherche d'adresse avec le préfixe : SMONPORTEFEUILLECOOL...

Trouvé en 34.12 secondes !
Tentatives : 845123
--------------------------------------------------
Adresse        : SMonPortefeuilleCoolGf7kvp8vj6yPzCqRj9nBwX
Phrase secrète : mot1 mot2 mot3 ... mot12
--------------------------------------------------
IMPORTANT : Conservez votre phrase secrète dans un endroit sûr !
```

**ATTENTION :** La phrase mnémonique secrète est le seul moyen d'accéder à votre portefeuille. Conservez-la en lieu sûr et ne la partagez jamais avec personne.
