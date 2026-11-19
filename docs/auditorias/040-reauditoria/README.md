# Tarea 040 · Fase C: reauditoría en la web

16 de noviembre de 2026, America/Santiago. Rama `codex/040-reauditoria`, base main `8bd8722cede26d0cbf23eb5f7c192445628c2a22`, con A y B integradas. Solo se crean archivos en esta carpeta; la aplicación y sus datos se mantienen con las huellas del corte auditado.

## Resultado

Se ingresaron por los controles de la página **9 semillas y 30 variantes**, tanto a **1280 como a 390 px: 78 recorridos**. La comparación de cada caso coincide entre ambos anchos. No se observaron errores de JavaScript; las 78 pantallas finales medidas no presentan desbordamiento horizontal.

Con las entradas comparables y las dos limitaciones de control descritas abajo, **C conserva todos los esperados que aparecían en A**, tanto en el total como en «Para empezar». Las semillas mantienen **42/43 esperados en total**, **22/43 entre los primeros**, **0 apariciones en las 13 comprobaciones de exclusión** y **21/21 consideraciones DUA esperadas** en el total, de las cuales siete están entre las primeras. El esperado que falta sigue siendo `prac-procedimiento` en S2. Está ausente en A y C; no se corrigió durante esta auditoría.

En tres variantes aparecen opciones adicionales de seguridad. Entre las referencias heredadas de las treinta variantes, la cobertura total pasa de 42 a 43 coincidencias sobre 124 referencias acumuladas. Esto describe el comportamiento de la oferta; esas variantes no tienen un nuevo juicio experto que permita afirmar una mejora clínica.

**Entrega caso por caso:** [nueve semillas](comparacion-semillas.md) · [treinta variantes](comparacion-variantes.md). Cada fila enlaza un informe individual con los **IDs esperados encontrados y los excluidos presentes antes y después**, las diferencias de la oferta, las acciones realizadas, las capturas de ambos tamaños y los documentos cuando corresponden. Los datos sin abreviar están en [resultados.json](resultados.json).

| Población / medida, un ancho sin duplicar observaciones | A: VM con referencia común | C: web, campos comunes* | C: modalidad explícita, contraste separado |
| --- | ---: | ---: | ---: |
| Semillas: esperados total | 42/43 | 42/43 | 42/43 |
| Semillas: esperados entre primeros | 22/43 | 22/43 | 22/43 |
| Semillas: excluidos presentes | 0 | 0 | 0 |
| Semillas: consideraciones DUA esperadas, total / primero | 21 / 7 | 21 / 7 | 21 / 7 |
| Variantes: coincidencias con esperados heredados, total | 42/124 | 43/124 | 43/124 |
| Variantes: coincidencias con esperados heredados, primero | 14/124 | 14/124 | 14/124 |
| Variantes: apariciones de excluidos heredados, total / primero | 7 / 1 | 7 / 1 | 6 / 0 |
| Variantes: consideraciones DUA heredadas, total / primero | 73 / 9 | 73 / 9 | 73 / 9 |

*Taller en parvularia no está disponible en dos variantes; se registra sin forzarlo.

No se suman dos veces los mismos casos por haberlos observado en dos tamaños. Los valores de las variantes son coincidencias de IDs de referencia, no tasas de acierto pedagógico. «Para empezar» tiene capacidad limitada y no incluye todos los bloques: objetivos, DEC, práctica profesional y proceso laboral se revisan también en el total. No encontrar un esperado entre tres opciones no equivale a que la página lo haya eliminado.

## Método: entradas reales, referencia estable

Se leyeron AGENTS.md, la tarea, la asesoría y el JSON vigente antes de ejecutar. [reauditar.cjs](reauditar.cjs) sirve el repositorio por HTTP local y abre Chromium con Playwright. Cada recorrido empieza en un contexto limpio. Usa `click`, `fill`, `check` y `selectOption`: elige ámbito/nivel, escribe la meta, marca necesidades, taller, áreas y frecuencias, indica práctica profesional y guarda los pasos.

**No importa perfiles ni escribe estado con JavaScript.** `evaluate` lee DOM/estado y el modelo documental, o desplaza la vista para una captura. Los grupos plegados se abren con sus `summary`, como haría una persona. Se leen los IDs ofrecidos y los primeros desde las tarjetas reales. Se comprueba que, tras abrir los grupos, las tarjetas incluidas no estén ocultas por los contenedores de la página. Esto no afirma que estén todas simultáneamente dentro de la pantalla ni comprueba oclusiones por elementos fijos. DUA se registra mientras su pestaña está activa, para que ocultarla al pasar a apoyos no se confunda con una lista vacía.

En las ocho semillas personales se elige un apoyo ofrecido, se comprueba el error si falta criterio de logro, se completan acuerdos con **datos ficticios de prueba** y se descarga el documento revisado. S6 incluye la decisión explícita de compartir y el documento del centro. S9 elige una acción de curso sin crear un caso individual. Las variantes llegan a la oferta y a su contraste de modalidad; no se presentan como treinta acuerdos profesionales completos.

La captura de regiones ARIA del registro es texto visible tras el gesto; no es audio ni una prueba de que un lector lo anunciara. El foco se registra inmediatamente después de cada acción, que puede iniciar preparación asíncrona del documento; un estado transitorio no se clasifica por sí solo como pérdida permanente de foco.

### Qué se compara con A

Se utilizan las **salidas históricas**, conservadas en `docs/auditorias/040-simulacion/resultados.jsonl`. No se vuelve a ejecutar el motor actual simulando que fuera A ni se sobrescribe aquella entrega. Para las nueve semillas se aplica el **JSON vigente de Claude a ambos lados** de la comparación. A archivó originalmente 37 expectativas; el archivo vigente contiene 43. Por eso 42 encontrados ahora no se interpreta como una subida desde 37 debida al algoritmo: cambió el patrón, no necesariamente la oferta.

Para las variantes se conserva su entrada y referencia heredada de A. Al haber cambiado niveles y situaciones respecto de su semilla, esos esperados/excluidos no son un nuevo patrón validado. Las ausencias y exclusiones se muestran completas para revisión, sin etiquetarlas como errores clínicos demostrados.

Se toman, sin elegir por resultado, las primeras cuatro variantes de cada origen 1–3 y las primeras tres de cada origen 4–9: treinta en total. [Manifiesto de entradas](casos.json). Cubren parvularia (6), básica (8), media (5), superior (8) y Trabajo (3), además de las nueve semillas. No son una muestra representativa de la población.

### Campos nuevos: observación separada

Primero se registra cada caso con las entradas comunes a A y la modalidad por defecto. Después se observa la modalidad explícita:

- En S2 se elige lengua de señas y en S4 otra lengua materna, datos que constan en la asesoría.
- En variantes con visión se prueban ampliación o Braille; en otras se prueba señas, CAA u otra lengua cuando procede al contraste técnico fijado en el script. **Son respuestas experimentales, no inferencias sobre una persona** a partir de una situación.
- Se cubren las seis opciones, incluida «No aplica». S9 no tiene modalidad personal.
- Las marcas de protocolo en S3/S5, el criterio y la decisión de compartir usados para probar acuerdos/PDF son datos ficticios de la prueba, no afirmaciones añadidas a la historia del caso.

En V2-04 y V5-03, A pide taller en parvularia, pero la web no ofrece esa casilla. Se deja el valor efectivo en false y se registra `noDisponibles`; no se fuerza un control oculto. En este corte no cambia sus listas, porque no hay accesos de taller aplicables a ese nivel. Es una limitación de equivalencia de entrada que debe acompañar la comparación, no una entrada idéntica fingida.

## Diferencias y mejoras observadas

| Caso(s) | Observación real en la web | Interpretación |
| --- | --- | --- |
| V2-03 | Añade `prac-rotulos` y `prac-evacuacion` frente a A. | La alerta hace disponibles opciones de seguridad con práctica profesional. Recupera una referencia heredada adicional (`prac-rotulos`); no se pierde ninguna previa. |
| V5-02 | Añade `prac-rotulos`. | Revisión de seguridad aun si esa ficha no comparte una dimensión con puntuación positiva. Es una ampliación de oferta, no una selección automática. |
| V7-03 | Añade `prac-evacuacion` y `prac-rotulos`. | Apoyos de seguridad disponibles también por práctica profesional; primeros esperados conservados. |
| V2-04, V3-02, V9-02 | Al elegir ampliación desaparece `acc-6-braille`. | Se comprueba la exclusión de B. Se separa esta prueba de la comparación con los campos comunes de A. En V2-04 sale de los primeros y entra `acc-2-hablado`. |
| S2, V1-04 | Con señas, la primera instrucción de `acc-6-audicion` coordina intérprete. | Cambio de contenido comprobado en las tarjetas; el PDF de S2 también lo conserva. No implica aumentar el número de IDs encontrados. |
| S3, S5 | La respuesta de protocolo se registra en el PDF. | Prueba del control nuevo con un dato técnico declarado; no valida que el protocolo exista en el relato. |
| Ocho semillas personales | Los acuerdos rechazan inicialmente la ausencia de criterio; después se completan y el PDF lo incluye. | Dieciséis comprobaciones por los dos anchos. El criterio de prueba no sustituye una definición de logro acordada por personas reales. |
| S8 | El documento conserva la decisión ficticia de compartir solo ajustes con jefatura. | No se envía ni comparte automáticamente; la inclusión del trabajador se marca explícitamente. |
| S6 | El centro recibe únicamente los ajustes revisados, sin iniciales ni criterio personal copiado automáticamente. | Se comprueba la reserva del documento del centro, además del criterio en el plan general. |

En la observación común no se pierde ningún esperado total ni primero de A. Las listas y los primeros DUA se conservan. No se encontraron cambios de orden sin cambios de conjunto en esos canales. Ningún total estuvo vacío: 35 observaciones DUA, 34 de apoyos y cuatro laborales por ancho. «Para empezar DUA» no aparece en siete casos; eso no significa que falten acciones.

## Errores y mejoras pendientes, por prioridad

| Prioridad | Pendiente | Evidencia / consecuencia |
| --- | --- | --- |
| Alta | S2 sigue sin `prac-procedimiento`, esperado vigente. | El caso marca Audición (13); la ficha declara dimensiones 1, 2, 3 y 5. Está ausente en A y C, en escritorio y teléfono, incluso tras explicitar señas. [Caso S2](casos/S2.md). La auditoría no cambia el catálogo ni inventa una asociación para dar por cumplido el esperado. |
| Media | Las treinta variantes necesitan juicio experto propio para valorar pertinencia. | Se observan siete apariciones de exclusiones heredadas con los campos comunes; al añadir modalidades quedan seis. Cambiar una situación puede hacer pertinente un antiguo excluido. La tabla permite revisar los IDs; no permite certificar precisión ni diagnosticar fallos de esas variantes. |
| Media | Dos entradas de A no se pueden introducir literalmente por la UI. | Taller en parvularia, V2-04/V5-03. Se documenta la proyección a la entrada efectiva; sus listas coinciden. Futuros generadores/comparadores deben mantener visible esta diferencia. |
| Media, preexistente | La página emite una solicitud externa de fuente al abrir. | En los 78 recorridos se registró la URL CSS de Google Fonts presente en `index.html`, líneas 14–16, junto a sus preconexiones. Debe revisarse su relación con la promesa «No envía nada a internet». Se registraron URLs de peticiones, no una inspección exhaustiva de cuerpos ni una prueba de envío de notas. No se atribuye a B una dependencia nueva. |
| Pendiente del alcance funcional futuro | Dominio previo del contenido, lengua específica de la familia y distinción patrón/crisis. | Son decisiones de las nueve preguntas de la asesoría que no tienen una respuesta estructurada propia en los seis puntos implementados por B. Las listas y el texto libre no permiten darlas por resueltas automáticamente. No se amplía el producto en esta entrega de auditoría. |

## Evidencia y reproducción

- [Resultados de los 78 recorridos](resultados.json), [resumen numérico](resumen.json), [corte, navegador y huellas](metodo.json).
- [Semillas, comparación A→C](comparacion-semillas.md); [variantes, comparación A→C](comparacion-variantes.md); cada caso tiene sus IDs, acciones, capturas y documentos.
- 208 capturas ligadas a los recorridos y 20 PDF descargados con sus modelos y texto de vista previa. [Verificación de PDF](pdf.json): todos los títulos elegidos presentes; criterio conservado en planes, protocolo en S3/S5, modalidad/intérprete en S2 y reserva en los documentos del centro.
- [Validación independiente](validacion.json): recuenta métricas desde IDs, coteja entradas realmente guardadas, comprueba el resultado idéntico por ancho, archivos, acuerdos completos y huellas intactas.
- `python3 scripts/validar_catalogo.py`: catálogo correcto, 240 recomendaciones y 36/36 consideraciones DUA.

```bash
node docs/auditorias/040-reauditoria/reauditar.cjs
node docs/auditorias/040-reauditoria/resumir.cjs
python3 docs/auditorias/040-reauditoria/verificar_pdf.py
python3 scripts/validar_catalogo.py
```

Playwright usa `CHROMIUM_BIN` si se proporciona; en caso contrario usa su propio Chromium. La extracción de PDF usa PyMuPDF ya disponible para las auditorías. No se agregan dependencias a la aplicación. La ejecución toma unos minutos; los resultados parciales se guardan para detectar un fallo y la salida definitiva solo se produce al completar ambos anchos. Se escriben únicamente archivos de esta carpeta. No hay imágenes de un diálogo de impresión ni impresiones físicas.

No se repitieron los scripts generales que escriben capturas fuera de la carpeta autorizada; aquí no se modifica código de producto. No se probó lector de pantalla con audio, otros motores, tema oscuro, teléfonos físicos, todos los respaldos o todas las combinaciones. Se usan datos ficticios y roles/acuerdos técnicos; no se valida eficacia pedagógica ni consentimiento real. No se afirma reproducibilidad de UUID, fecha del PDF o píxeles de una fuente externa: se verifican entradas y resultados del corte.

Revisión con [ponytail-review](../../../.agents/skills/ponytail-review/SKILL.md): [informe de revisión](revision-ponytail.md). El PR apunta a main y no se integra automáticamente.
