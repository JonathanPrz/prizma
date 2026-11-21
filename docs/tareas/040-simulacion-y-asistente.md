# Tarea 040 · Simulación de casos, preguntas clave y reauditoría en la web

Estado: **integrada** (PR #40, #41 y #42) · Asignada a: Codex · Rama: `codex/040-simulacion` (un pull request por fase, todos con destino `main`)

## Para qué
El dueño quiere que Prizma sea un sistema semiautomático. Claude, como asesor, analizó 9 casos y de ese análisis surgieron preguntas clave y errores. Lee:
- `docs/casos/asesoria-claude.md`: el análisis y lo que emergió;
- `docs/casos/casos-semilla.json`: lo esperado y lo excluido por caso;
- `docs/marca/040-flujo/flujo.png`: el flujo propuesto.

**No cambies `data/`, `docs/fuentes/`, `docs/arquitectura.md`, `docs/casos/` ni `.claude/`.**

## Fase A · Simulación sin web (solo `docs/auditorias/040-simulacion/`)
1. Con Python o Node, sin conexión, carga `app.js` en `vm` (como las pruebas) y pasa los 9 casos semilla.
2. Genera al menos **500 variantes**: cambia frecuencias, niveles, combinaciones de 1 a 3 situaciones, necesidades, taller y práctica.
3. Mide:
   - cuántos esperados aparecen en «Para empezar» y en el total;
   - cuántos excluidos aparecen;
   - listas vacías;
   - empates;
   - qué entradas no cambian nada.
4. Usa ciencia de datos simple: la importancia de cada entrada para la lista resultante (por ejemplo, un árbol de decisión o la ganancia de información) y agrupamientos de casos. El objetivo es encontrar **qué preguntas separan mejor los casos**. Compáralas con las 9 preguntas que emergieron del análisis de Claude.
5. **Opcional:** busca en la web de 3 a 5 casos reales públicos y anonimizados (Mineduc, CAST o universidades), conviértelos al formato semilla y márcalos como «caso externo». No inventes datos de personas reales.
6. Entrega un informe con los hallazgos priorizados. Este pull request es solo de documentación.

## Fase B · Preguntas clave en la web (después de integrar la A)
Implementa, sin romper nada de lo actual:
1. **«¿Qué usa hoy para comunicarse o acceder?»** Va en el paso 1 del caso, con las opciones: no aplica, lengua de señas, Braille, lupa o ampliación, tablero o comunicación aumentativa, otra lengua materna.
   - Filtra las fichas incompatibles. Por ejemplo, con lupa no aparece Braille; con lengua de señas, la ficha de audición pide intérprete.
   - Las fichas solo pueden marcarse con modalidades por medio de una lista de exclusión en `app.js`, revisada por Claude en el pull request. No cambies `data/`.
2. **«¿Lo que se evalúa es esa habilidad?»** En las tarjetas de apoyos de forma (lectura en voz alta, teclado, tiempo, respuesta oral), un aviso visible: «Úsalo solo si esta habilidad no es lo que estás evaluando».
3. **Alerta de seguridad.** Si el caso tiene visión, audición o movimiento, y además taller, práctica o Trabajo, muestra un aviso con las fichas de rótulos, evacuación y alertas.
4. **¿Existe un PAEC, un PACI o el protocolo DEC?** Una casilla en los bloques de objetivos y desregulación, que va al PDF.
5. **Criterio de logro en los acuerdos:** «¿Cómo sabremos que funciona?», texto de máximo 200 caracteres, obligatorio para completar los acuerdos y presente en el PDF.
6. **En Trabajo, «¿Qué decidió compartir la persona y con quién?»**, que va al documento.

Agrega `scripts/probar_preguntas_clave.cjs`. Todas las pruebas existentes deben seguir pasando.

## Fase C · Reauditoría en la web (después de integrar la B)
Con Playwright, ingresa los 9 casos semilla y 30 variantes en la página publicada localmente, como lo haría una persona. Compara los resultados con la fase A y con lo esperado por Claude: deben ser iguales o mejores. Informa las diferencias, errores y mejoras pendientes en `docs/auditorias/040-reauditoria/`.

## Criterios
- [ ] La fase A tiene 9 semillas y 500 o más variantes, la importancia de las entradas y la comparación con las preguntas de Claude.
- [ ] La fase B no rompe ninguna prueba y agrega su prueba.
- [ ] La fase C muestra, caso por caso, los esperados encontrados y los excluidos que aparecen, antes y después.
