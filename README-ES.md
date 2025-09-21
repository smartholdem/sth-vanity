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

## Seguridad

Este generador se ha creado con la máxima prioridad en la seguridad, utilizando bibliotecas criptográficas estándar de la industria.

*   **Aleatoriedad criptográficamente segura**: La generación del secreto principal de su billetera (la frase mnemónica) se basa en la biblioteca `bip39`, que a su vez utiliza el módulo `crypto.randomBytes` integrado en Node.js. Se trata de un generador de números pseudoaleatorios criptográficamente seguro (CSPRNG), que garantiza que la entropía inicial de su clave sea de alta calidad e impredecible.

*   **Criptografía probada en batalla**: La dirección y el par de claves se derivan de la frase mnemónica utilizando la biblioteca oficial `@smartholdem/crypto`. Esta biblioteca implementa la misma criptografía de curva elíptica `secp256k1` robusta y ampliamente confiable que protege a las principales criptomonedas como Bitcoin y Ethereum.

*   **Sin almacenamiento de datos**: Esta herramienta **no** guarda ni transmite ningún dato. La dirección generada y su correspondiente frase mnemónica secreta solo se muestran en su consola. Usted tiene el control total y es su responsabilidad almacenar la frase secreta en un lugar seguro y sin conexión.

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

    Encuentre una dirección que contenga la palabra `KING`:
    ```bash
    node index.js KING --mode=contains
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
