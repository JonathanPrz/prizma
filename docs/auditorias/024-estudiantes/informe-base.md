# Auditoría 024 · De uno a diez estudiantes

## Resumen

La separación de datos escala a diez estudiantes, pero no vuelve más específico el perfil.
Dos situaciones iguales producen listas iguales aunque las barreras y las ayudas escritas sean distintas.
Baja visión y acceso en señas reciben las mismas listas; también atención y falta de desafío.
El texto libre se conserva, pero no interviene en la recomendación.
La dimensión compartida de visión/audición y etiquetas de comunicación producen fichas no pertinentes.
La práctica agrega nueve opciones a todos los perfiles compatibles, aunque su puntaje sea cero.
La interfaz agrupa por subtipo antes de mostrar las fichas: puntaje y orden visible no son equivalentes.
Los conteos del recuadro DUA son correctos, pero una misma situación puede esconder causas opuestas.
Objetivos y DEC son opciones condicionales: su presencia no equivale a una prescripción individual.
Los juicios de pertinencia se refieren a estos casos ficticios, no a diagnósticos ni a eficacia clínica.
No se implementan soluciones. La estrategia posterior queda fuera de esta entrega.

## Método y reproducción

Ejecuta `node scripts/auditar_estudiantes.cjs` desde cualquier carpeta del repositorio. Usa Node, `vm` y el pdfmake ya incluido; no instala dependencias ni modifica la aplicación. Escribe solo en esta carpeta. Lee `perfiles.json`, los juicios explícitos de `revision-acceso.json` y esta plantilla editorial (`informe-base.md`). Genera `resultados.json`, las tablas, la clasificación completa y el PDF adjunto. Los juicios de acceso son revisión editorial explícita, no se deducen de puntajes o palabras clave; los criterios de secciones condicionales están en el script. Para regenerar también la interfaz, usa `--interfaz` con una instalación existente de Playwright y Chromium: `PLAYWRIGHT_MODULE=/ruta/al/modulo/playwright CHROMIUM_PATH=/ruta/a/chromium node scripts/auditar_estudiantes.cjs --interfaz`. Sin esa opción conserva la evidencia de navegador registrada en `interfaz.json`; el script no instala herramientas. La evidencia conservada se verifica con hashes de sus entradas; si cambia la aplicación o los perfiles, exige regenerarla. La VM fija la fecha de los PDF al 15 de noviembre de 2026 en America/Santiago. El servidor temporal escucha solo en 127.0.0.1 y se cierra al terminar. Las dos imágenes renderizadas desde el PDF son evidencia visual conservada.

Son 70 escenarios: diez tamaños, cuatro niveles, práctica apagada y encendida excepto parvularia. Cada escenario agrega el siguiente perfil en el orden de la tarea. Sin asignatura, necesidades ni apoyos elegidos durante la medición de listas. Se llama al código real, incluido `pintarApoyos`, y se recogen las tarjetas de su árbol de nodos. Así los cinco primeros representan el orden mostrado, no un orden alternativo inventado por la auditoría.

«Acceso» incluye el grupo práctico; «total» añade todas las fichas disponibles al desplegar objetivos y desregulación. Estas secciones están cerradas inicialmente. No se cuentan acciones DUA como apoyo individual. Se informan ambas medidas para que las opciones compartidas/condicionales no oculten diferencias de acceso. La similitud es Jaccard (compartidas/unión), sin tener en cuenta el orden. N=1 no tiene pares. Los datos crudos incluyen coincidencias, empates, cinco primeros, versiones DUA y los pares, también con comparación del orden.

La clasificación revisa la unión de fichas con práctica apagada y encendida en básica y superior. «Adecuada» responde a la observación descrita; «Discutible» puede servir, pero exige información o un contexto no declarado; «Inadecuada» no responde o contradice lo observado. No se infiere un diagnóstico ni un déficit a partir de una casilla. La adecuación se justifica por cada combinación de ficha, perfil y nivel, incluida cada opción condicional.

## Los diez perfiles

{{PERFILES}}

## Resultados por N

Al crecer N también cambia la composición de perfiles, porque se agregan en el orden pedido. Los cambios de promedio no aíslan un efecto causal del número de estudiantes. La comparación por persona, conservando nivel y práctica, sí confirma que su lista no cambia con N.

Cada tabla tiene las siete combinaciones comparables. Los pares idénticos de acceso también tienen idéntica la lista total en estas mediciones. No debe interpretarse un Jaccard alto como calidad de recomendación. [Listas individuales, cinco primeros y empates](listas-y-empates.md); el script comprueba que una misma lista no cambia al aumentar N. [Versiones DUA ofrecidas por perfil y nivel](versiones-dua.md).

{{TABLAS_N}}

## Pertinencia por perfil y nivel

Conteos de la unión con práctica encendida/apagada, incluyendo secciones condicionales. Las nueve fichas prácticas se identifican como tales en la clasificación.

{{PERTINENCIA}}

[Clasificación completa, con justificación de cada ficha](clasificacion.md). [Lista completa de inadecuadas y discutibles, con ID, perfil, nivel y causa](fichas-observadas.md). Los mismos registros están en `resultados.json`.

## Lista completa de fichas inadecuadas y discutibles

{{OBSERVADAS}}

## Interfaz, conversación DUA y vacíos

Ver [hallazgos detallados y evidencia de navegador](hallazgos.md). Esta sección distingue el dato medido de su interpretación y describe también lo que el catálogo no cubre adecuadamente para cada perfil. No propone ni implementa correcciones.

## PDF

Se miden 1, 4 y 10 estudiantes en las siete combinaciones: 21 documentos. La selección de prueba es reproducible: 12 primeras acciones DUA del orden visible y hasta cinco primeros accesos por estudiante. No se eligen objetivos ni DEC. No se afirma que estas cinco fichas sean las más pertinentes: precisamente se exporta lo que encabeza la interfaz. Son datos ficticios.

{{PDF}}

[PDF de diez estudiantes, básica sin práctica](prizma-plan-10-estudiantes.pdf). `pdf-10-textos.json` conserva el texto por página. Los datos crudos indican en qué página empieza cada estudiante, las páginas de cada ficha completa y los grupos. Se comprueban el bloque con título/pasos/explicación/respaldo/nota en la misma página y el encabezado de grupo con su primera ficha. Esta comprobación no equivale a una revisión de impresión física ni de todas las combinaciones posibles de notas.

## Límites y revisión

Los perfiles son ficticios; no hubo prueba con docentes ni estudiantes reales. Se revisaron los textos completos de las fichas, pero no se hizo una revisión de evidencia científica de su eficacia. No se usa similitud como sustituto de pertinencia. La prueba de PDF fija una selección y no cubre toda combinación posible. Navegador: Chromium en escritorio y a 390 px; no lectores de pantalla reales, Safari, Firefox ni impresión en papel.

### ponytail-review

What this change does: It measures the existing recommendations for ten classroom profiles across seventy scenarios. It records each card's fit, the repeated-barrier messages, the interface evidence and the PDF output without changing the application.

Looks good. Ship.

Checked: The audit calls the real app functions and reads the rendered card order. It separates access cards from optional objective and regulation sections. Every visible card in the two reviewed levels has a stated judgment and reason. Pair similarity, ties and PDF selection rules are explicit. The script only writes to its own audit folder and uses the bundled PDF library. The expected load is seventy small local scenarios and twenty-one PDF builds.

Not checked: Real screen readers, Safari, Firefox, physical devices and paper printing. The judgments describe these fictional cases and do not establish clinical need or effectiveness.
