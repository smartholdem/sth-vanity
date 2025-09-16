# Generador de Direcciones Personalizadas de SmartHoldem

Esta es una aplicación de consola de Node.js para generar direcciones "personalizadas" (vanity) para la criptomoneda SmartHoldem (STH). Una dirección personalizada es una dirección que comienza con una secuencia específica de letras y números definida por el usuario.

## Requisitos

*   [Node.js](https://nodejs.org/) (versión 12.x o superior)

## Instalación

1.  Clone el repositorio o descargue los archivos.
2.  Abra una terminal en el directorio del proyecto.
3.  Instale las dependencias ejecutando el comando:
    ```bash
    npm install
    ```

## Uso

Para iniciar el generador, use el siguiente comando:

```bash
node index.js [CADENA_DE_BÚSQUEDA] [--mode=MODO] [--threads=N]
```

### Parámetros

*   `[CADENA_DE_BÚSQUEDA]` (obligatorio) — la secuencia de caracteres deseada para buscar. La búsqueda no distingue entre mayúsculas y minúsculas.

*   `--mode=MODO` (opcional) — el modo de búsqueda. Puede ser uno de los siguientes:
    *   `prefix` (predeterminado): busca `CADENA_DE_BÚSQUEDA` al principio de la dirección (inmediatamente después de `S`).
    *   `suffix`: busca `CADENA_DE_BÚSQUEDA` al final de la dirección.
    *   `contains`: busca `CADENA_DE_BÚSQUEDA` en cualquier parte de la dirección.

*   `--threads=N` (opcional) — el número de hilos (núcleos de CPU) a utilizar. Si no se especifica, se utilizan todos los núcleos disponibles.

### Ejemplos

1.  **Búsqueda por prefijo (predeterminado)**

    Encuentre una dirección que comience con `S` + `MICARTERA`:
    ```bash
    node index.js MICARTERA
    # o explícitamente
    node index.js MICARTERA --mode=prefix
    ```

2.  **Búsqueda por sufijo**

    Encuentre una dirección que termine en `2025`:
    ```bash
    node index.js 2025 --mode=suffix
    ```

3.  **Búsqueda por subcadena**

    Encuentre una dirección que contenga la palabra `GEMINI`:
    ```bash
    node index.js GEMINI --mode=contains
    ```

4.  **Combinación de parámetros**

    Encuentre una dirección que contenga `VIP`, usando solo 2 hilos:
    ```bash
    node index.js VIP --mode=contains --threads=2
    ```

### Importante

*   La búsqueda no distingue entre mayúsculas y minúsculas. `micarteracool` y `MICARTERACOOL` producirán el mismo resultado.
*   Las direcciones de SmartHoldem siempre comienzan con la letra `S`. El script busca su prefijo inmediatamente después de esta letra.
*   Cuanto más largo sea el prefijo, más tiempo llevará la búsqueda.

## Salida

Durante la operación, el script mostrará el número de direcciones verificadas. Cuando se encuentre una dirección adecuada, el programa mostrará el resultado en la consola y finalizará.

```
Iniciando búsqueda de dirección con prefijo: SMICARTERACOOL...

¡Encontrado en 34.12 segundos!
Intentos: 845123
--------------------------------------------------
Dirección      : SMiCarteraCoolGf7kvp8vj6yPzCqRj9nBwX
Frase secreta  : palabra1 palabra2 palabra3 ... palabra12
--------------------------------------------------
IMPORTANTE: ¡Guarde su frase secreta en un lugar seguro!
```

**ATENCIÓN:** La frase mnemotécnica secreta es la única forma de acceder a su billetera. Guárdela en un lugar seguro y nunca la comparta с nadie.
