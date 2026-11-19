# Fichas DUA frente al enfoque 3.0 · resultado y propuesta (tarea 044)

Revisión de Claude de las 56 fichas que citan `cast-dua-3` (`dua-pertinencia.csv`), a partir de *UDL Guidelines 3.0: Rationale for Updates* (CAST, 2024), que entregó el dueño. **No verifica evidencia**: solo si cada ficha está en la consideración correcta y respeta los cambios de la versión 3.0.

## Resultado
- 53 fichas, correctas.
- 2 encajan mejor en otra consideración: `dua-3-2` y `dua-2-2-parv`.
- 1 conserva el enfoque 2.2: `dua-9-2`.
- Las 14 fichas de acceso sin consideración tienen una sugerida en el CSV.

## Control a ciegas
Un subagente de otro modelo revisó 13 fichas sin ver los veredictos: 10 al azar, con semilla `044-control`, más las 3 marcadas.
- Coincide en `dua-3-2` (a 5.3), en `dua-2-2-parv` (a 2.5) y en `dua-9-2` (le falta «y de los demás»).
- Encontró además un caso leve: `dua-8-1-parv` solo hace que el adulto anuncie la meta, y la 3.0 pide que la meta tenga sentido para quien aprende.
- En `acc-10-responder` sugiere 5.4, una consideración nueva sobre los sesgos en las formas de expresarse, en vez de 2.3. Las dos son razonables.

## Propuesta (requiere la aprobación del dueño)
No se pueden mover `dua-3-2` ni `dua-2-2-parv` a otra consideración. La 3.2 quedaría sin ninguna acción, y parvularia sin acción en la 2.2, y el validador exige las 36 consideraciones en cada nivel. Por eso se propone reescribirlas para que respondan a su consideración.

1. **`dua-3-2` (3.2: resaltar patrones, ideas clave y relaciones).** El modelado y la práctica guiada ya están en `dua-5-3-andamiaje-lista`.
   - Título: «Destaca las ideas clave y cómo se relacionan».
   - Cómo:
     - «Marca en el material las 2 o 3 ideas centrales.»
     - «Usa un esquema que muestre cómo se conectan.»
     - «Pide que encuentren el mismo patrón en un ejemplo nuevo.»
   - Por qué: «Ver lo esencial y cómo se conecta ayuda a entender y a recordar.»
2. **`dua-2-2-parv` (2.2: decodificar símbolos).** Se agrega enseñar qué significa cada pictograma, porque en parvularia el pictograma es el símbolo que se aprende a leer.
   - Nuevo primer paso: «Antes de usar un pictograma, muestra qué significa con la acción real.»
3. **`dua-9-2` (9.2: conciencia de sí y de los demás).**
   - Se agrega: «Pregunta también cómo creen que se siente un compañero.»
   - Por qué: «Reconocer cómo se siente uno y cómo se sienten los demás ayuda a pedir apoyo y a cuidarse en grupo.»
4. **`dua-8-1-parv` (8.1: que la meta tenga sentido para quien aprende).**
   - Se agrega: «Pregunta qué les gustaría descubrir o hacer.»
5. **`dua-7-1` (7.1, que ya no es solo individual).**
   - Se agrega: «A veces, que el curso elija en conjunto una de las opciones.»
