# SmartHoldem Vanity-Adress generator

Dies ist eine Node.js-Konsolenanwendung zum Generieren von "Vanity"-Adressen für die Kryptowährung SmartHoldem (STH). Eine Vanity-Adresse ist eine Adresse, die mit einer bestimmten, vom Benutzer definierten Folge von Buchstaben und Zahlen beginnt.

## Anforderungen

*   [Node.js](https://nodejs.org/) (Version 12.x oder höher)

## Installation

1.  Klonen Sie das Repository oder laden Sie die Dateien herunter.
2.  Öffnen Sie ein Terminal im Projektverzeichnis.
3.  Installieren Sie die Abhängigkeiten, indem Sie den folgenden Befehl ausführen:
    ```bash
    npm install
    ```

## Verwendung

Um den Generator zu starten, verwenden Sie den folgenden Befehl:

```bash
node index.js [SUCHZEICHENFOLGE] [--mode=MODUS] [--threads=N]
```

### Parameter

*   `[SUCHZEICHENFOLGE]` (erforderlich) — die gewünschte Zeichenfolge, nach der gesucht werden soll. Die Suche ist nicht zwischen Groß- und Kleinschreibung zu unterscheiden.

*   `--mode=MODUS` (optional) — der Suchmodus. Kann einer der folgenden sein:
    *   `prefix` (Standard): sucht nach `SUCHZEICHENFOLGE` am Anfang der Adresse (unmittelbar nach `S`).
    *   `suffix`: sucht nach `SUCHZEICHENFOLGE` am Ende der Adresse.
    *   `contains`: sucht nach `SUCHZEICHENFOLGE` irgendwo in der Adresse.

*   `--threads=N` (optional) — die Anzahl der zu verwendenden Threads (CPU-Kerne). Wenn nicht angegeben, werden alle verfügbaren Kerne verwendet.

### Beispiele

1.  **Suche nach Präfix (Standard)**

    Finden Sie eine Adresse, die mit `S` + `MEINEBRIEFTASCHE` beginnt:
    ```bash
    node index.js MEINEBRIEFTASCHE
    # oder explizit
    node index.js MEINEBRIEFTASCHE --mode=prefix
    ```

2.  **Suche nach Suffix**

    Finden Sie eine Adresse, die auf `2025` endet:
    ```bash
    node index.js 2025 --mode=suffix
    ```

3.  **Suche nach Teilzeichenfolge**

    Finden Sie eine Adresse, die das Wort `GEMINI` enthält:
    ```bash
    node index.js GEMINI --mode=contains
    ```

4.  **Kombination von Parametern**

    Finden Sie eine Adresse, die `VIP` enthält, und verwenden Sie nur 2 Threads:
    ```bash
    node index.js VIP --mode=contains --threads=2
    ```

### Wichtig

*   Die Suche ist nicht zwischen Groß- und Kleinschreibung zu unterscheiden. `meinecoolebrieftasche` und `MEINECOOLEBRIEFTASCHE` führen zum selben Ergebnis.
*   SmartHoldem-Adressen beginnen immer mit dem Buchstaben `S`. Das Skript sucht unmittelbar nach diesem Buchstaben nach Ihrem Präfix.
*   Je länger das Präfix, desto deutlich mehr Zeit wird für die Suche benötigt.

## Ausgabe

Während des Betriebs zeigt das Skript die Anzahl der überprüften Adressen an. Wenn eine passende Adresse gefunden wird, zeigt das Programm das Ergebnis in der Konsole an und wird beendet.

```
Starte Suche nach Adresse mit Präfix: SMEINECOOLEBRIEFTASCHE...

Gefunden in 34.12 Sekunden!
Versuche: 845123
--------------------------------------------------
Adresse        : SMeineCooleBrieftascheGf7kvp8vj6yPzCqRj9nBwX
Geheime Phrase: wort1 wort2 wort3 ... wort12
--------------------------------------------------
WICHTIG: Bewahren Sie Ihre geheime Phrase an einem sicheren Ort auf!
```

**ACHTUNG:** Die geheime mnemonische Phrase ist die einzige Möglichkeit, auf Ihre Brieftasche zuzugreifen. Bewahren Sie sie sicher auf und geben Sie sie niemals an Dritte weiter.
