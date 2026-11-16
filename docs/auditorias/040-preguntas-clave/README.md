# Tarea 040 · Fase B: preguntas clave

16 de noviembre de 2026. Rama `codex/040-preguntas-clave`, base main `484cf14`. La fase A ya integrada se actualizó por avance rápido antes de crear esta rama. Esta entrega implementa B; la reauditoría C queda pendiente de integrar B.

## Cambios y comprobaciones

| Requisito | Comportamiento entregado | Evidencia |
| --- | --- | --- |
| Modalidad | Selector único en el paso 1 de estudiantes y Trabajo, con las seis opciones de la tarea y «No aplica» por defecto. Se valida contra una lista cerrada, se guarda por persona y viaja en el respaldo y documento. | `probar_preguntas_clave.cjs`: normalización, aislamiento, teclado, persistencia y PDF. |
| Incompatibilidades | Lupa/ampliación excluye `acc-6-braille` de las sugerencias. Las fichas multiformato conservan su alternativa compatible, con título adaptado en tarjeta, mochila y documento. Señas añade coordinación de intérprete a las dos tarjetas educativas de audición. | Pruebas VM y navegador. Lista propuesta para revisión de Claude más abajo. |
| Habilidad evaluada | Las tarjetas de apoyos de forma identificadas en `APOYOS_FORMA` muestran «¿Lo que se evalúa es esa habilidad?» y el aviso exacto «Úsalo solo si esta habilidad no es lo que estás evaluando». No es un diagnóstico ni cambia por sí solo la selección. | Tarjetas construidas con `el()`; lista explícita en app.js. |
| Seguridad | Visión, audición o movimiento, combinados con taller activo, práctica profesional o Trabajo, generan un aviso con botones hacia las fichas pertinentes. Los botones abren el grupo plegado y enfocan Elegir, sin elegir por la persona. | En estudiante: rótulos y evacuación; además seguridad de práctica en media si corresponde. En Trabajo: alertas y revisión del plan del lugar. Pruebas de foco y capturas. |
| PAEC/PACI/DEC | La misma respuesta por estudiante aparece en ambos bloques escolares; marcar una casilla actualiza la otra. Se conserva y aparece una sola vez en el documento general; sin marcar significa «No informado». No se presenta ese campo escolar en el PDF de superior. | Sincronización de casillas y comprobación del texto del PDF. |
| Criterio de logro | «¿Cómo sabremos que funciona?», máximo 200 caracteres, obligatorio para completar acuerdos de Educación y Trabajo. Se registra en ambos documentos generales y en los respaldos. | Caso vacío rechazado, límite y persistencia probados; ocho PDF revisados. |
| Decisión de compartir | «¿Qué decidió compartir la persona y con quién?» en acuerdos de Trabajo, máximo 300 caracteres. Guarda el texto localmente y lo incorpora al documento elegido. No envía ni comparte archivos automáticamente. | PDF laboral, recarga y separación respecto de estudiantes. |

El aviso de seguridad añade las fichas de rótulos/evacuación a la oferta cuando corresponden a la práctica, incluso si taller no está marcado. En Trabajo permite revisar alertas también ante movimiento, aunque la ficha no enumere esa dimensión. No se modifican dimensiones ni otras propiedades del catálogo: son reglas explícitas de la alerta en app.js. Se evita duplicar tarjetas o IDs; el aviso enlaza a su tarjeta única.

## Lista de exclusión propuesta para Claude

```js
const EXCLUSIONES_MODALIDAD = { ampliacion: ["acc-6-braille"] };
```

Esta es la única exclusión por modalidad. No se inventan incompatibilidades para las otras respuestas: conocer una modalidad no demuestra que todas las demás sean inadecuadas. `sup-vision`, `tr-lector-braille` y `tr-formularios-voz` combinan alternativas; bajo ampliación se conserva su parte compatible y no se presenta Braille como opción en sus títulos. Con señas, `acc-6-audicion` y `sup-audicion` incorporan el paso de intérprete, también en el documento general.

La lista queda visible para la revisión de Claude en el PR. No se afirma que esa revisión de contenido ya haya ocurrido. No se agregaron etiquetas a `data/`.

Si un apoyo antes elegido pasa a estar excluido, **se conserva junto con su nota**. La página y la mochila piden revisarlo, no se puede completar el acuerdo con esa incompatibilidad y el documento general lo señala como borrador con un aviso en la acción. La validación considera solo apoyos aplicables al nivel actual: una selección de otro nivel no queda oculta bloqueando el acuerdo. Una prueba conserva ese ID antiguo al pasar de básica a superior. La persona puede quitar un apoyo aplicable desde la mochila. No hay borrado silencioso de datos anteriores.

## Datos anteriores y privacidad

Las nuevas propiedades son aditivas: `modalidad`, `protocolo`, `acuerdo.criterio` y, en Trabajo, `compartir`. Los respaldos v1/v2 siguen entrando por los normalizadores existentes. No se cambia la versión del formato; faltan campos nuevos se interpretan con valores vacíos o «No informado». Los valores se limitan y validan al cargar.

Un acuerdo antiguo con roles y fechas válidos pero sin criterio de logro queda **Por revisar**, conservando roles, fechas, selecciones y notas. No permite agregar el siguiente caso hasta completar y guardar el criterio. Las pruebas anteriores que modelaban acuerdos completos ahora incluyen un criterio; la prueba nueva comprueba por separado esta transición desde un respaldo antiguo.

El documento del centro de práctica conserva la decisión explícita del estudiante y no copia el criterio personal, voz, notas ni otros campos nuevos automáticamente. Agrega la pregunta de criterio con línea en blanco para acordarla allí. Los PDF generales de Educación y Trabajo sí contienen el criterio escrito. Una prueba asegura que el criterio y una nota reservada no se filtren al documento del centro.

Los nuevos textos libres usan el aviso de privacidad existente. Se reutiliza `guardar()` con try/catch; no se añaden cuentas, servicios, dependencias de la aplicación ni transferencias de datos.

## Semillas actualizadas

[Comparación reproducible con la base](semillas-comparacion.json), [salidas actuales por caso](semillas.json). El mismo JSON actualizado devuelve **42/43 apoyos esperados**, sin excluidos presentes, tanto con el app.js de main al iniciar B como con esta implementación sin modalidad informada.

La diferencia es `prac-procedimiento` en S2. La semilla marca solo Audición (13); esa ficha enumera las dimensiones 1, 2, 3 y 5 en el catálogo. El esperado se agregó al JSON después de la fase A. No se altera el catálogo ni la semilla, ni se añade una asociación pedagógica oculta para forzar ese resultado. La prueba registra explícitamente esa diferencia previa; no la presenta como un resultado correcto ni como una regresión nueva.

Esta comparación es de motor en VM con las nueve semillas, no la reauditoría C. La cobertura de la fase A histórica usaba los esperados anteriores: no se interpreta pasar de 37 a 42 encontrados como mejora de precisión, porque cambió el patrón de referencia.

## Validación y evidencia

- Los **21** `scripts/probar_*.cjs` pasan: [registro completo](pruebas.json).
- Nuevo [scripts/probar_preguntas_clave.cjs](../../../scripts/probar_preguntas_clave.cjs): validación de entradas, migración, selección excluida sin pérdida, intérprete en básica/superior, seguridad por práctica y Trabajo, criterio, protocolo, datos compartidos, respaldo y protección del documento del centro.
- Chromium real en 1280/390 px, claro/oscuro y locale es-CL: selector con teclado, criterios, navegación de alerta, recarga y separación de ámbitos, sin errores de página ni desplazamiento horizontal en las pantallas probadas. [Resultados](navegador.json), [capturas](capturas.md).
- Ocho descargas PDF: el texto extraído contiene criterio, modalidad y protocolo/decisión de compartir correspondientes. [Resultado](pdf.json). Esta comprobación normaliza saltos de línea y no certifica PDF etiquetado.
- `python3 scripts/validar_catalogo.py`: catálogo correcto, 240 recomendaciones y 36/36 consideraciones DUA.
- Las pruebas de navegador usan `CHROMIUM_BIN` o el Chromium de Playwright, conforme al AGENTS.md actualizado. Las capturas históricas regeneradas por otras pruebas se restauraron; la evidencia nueva queda en `docs/marca/040-preguntas/`.

```bash
python3 scripts/validar_catalogo.py
node scripts/probar_preguntas_clave.cjs
node docs/auditorias/040-preguntas-clave/comparar_semillas.cjs
python3 docs/auditorias/040-preguntas-clave/comprobar_pdf.py
```

Para usar un Chromium instalado fuera de Playwright, proporciona `CHROMIUM_BIN` al ejecutar las pruebas. El comparador histórico requiere que el checkout conserve el commit base `484cf14`; reutiliza el adaptador VM de A sin sobrescribir sus resultados. La comprobación de texto usa PyMuPDF, ya disponible para las auditorías; no se agrega a la aplicación.

Revisión con [ponytail-review](../../../.agents/skills/ponytail-review/SKILL.md): [informe](revision-ponytail.md). Sin cambios en `data/`, `docs/fuentes/`, `docs/arquitectura.md`, `docs/casos/` ni `.claude/`.

No se probó audio con lector de pantalla, otros motores, impresión física ni accesibilidad estructural del PDF. No se ejecutó la fase C de nueve casos y treinta variantes en la web: depende de integrar B. El PR tiene destino main y no se integra automáticamente.
