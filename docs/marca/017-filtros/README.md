# Tarea 017 · Ordenar los filtros y mostrar todas las acciones

Rama: `codex/017-orden-filtros`. Base: `22ff444`. Fecha: 15 de noviembre de 2026.

Sin elegir momentos se muestran las **36 acciones del nivel**, agrupadas en Antes, Durante, Después y En toda la clase. Los grupos vacíos se omiten. Cada grupo lleva un `h3`, sus tarjetas DUA usan `h4` y el conteo total conserva `aria-live="polite"`. Elegir necesidades prioriza sus acciones dentro de cada grupo; no las oculta ni las deja restringidas a Antes.

## Cambios de la auditoría

- **A1 y A2:** «¿Cuándo?» usa botones multiselección con `aria-pressed`, ayuda y conteos por momento. `estado.momentos` es una lista validada y sin duplicados. La selección múltiple se guarda en navegador y respaldo; el antiguo `momento` se ignora y, si no hay lista nueva, se muestra todo. Limpiar deja la lista vacía; cada momento elegido suma uno a Filtros (n).
- **A3:** meta, necesidades, momentos, propósitos y detalles opcionales, en ese orden. La guía permanece junto a necesidades.
- **A4 y B1:** cada panel contiene su propio `h1` y bajada. «Apoyos específicos» pasa a «Ajustes razonables» en superior, donde la bajada menciona a la unidad de inclusión. Se retira el título visible duplicado de resultados. El botón único de filtros se mantiene debajo de la introducción del panel activo.
- **A5:** la pregunta de necesidades usa el vocabulario del nivel: «¿Qué quieres resolver en esta experiencia de aprendizaje?» en parvularia.
- **A6:** «Expresarse y organizarse» aparece en el filtro, las tarjetas y el documento/PDF, junto al nombre oficial del principio Acción y expresión.
- **B3:** campo opcional de voz del estudiante y su familia. Se limita a 300 caracteres; valores de otro tipo se descartan. Se guarda, se respalda, activa el aviso de privacidad y aparece después de facilitadores en el documento y PDF. No se pierde si solo se eligieron acciones DUA: se incluye un apartado del estudiante aunque no tenga fichas individuales elegidas.
- **B4:** cada situación marcada sin fichas de acceso en el nivel muestra un aviso y enlace a DUA. Se calcula desde el catálogo y se muestra una sola vez por situación, sin modificar las fichas.

Durante la revisión de la descarga se detectó que pdfmake modifica las listas que recibe. Ahora recibe una copia de los pasos de cada acción: generar el PDF deja intacto el catálogo en memoria y las tarjetas posteriores. La prueba de regresión falla al retirar esa copia.

La cabecera, logo, temas, guía y aviso de privacidad se conservan. No se modifican `data/`, `docs/fuentes/`, `.claude/` ni assets. Sin dependencias nuevas.

## Capturas

Datos ficticios, iniciales AB. PNG de viewport, a 1280 y 390 px. Las capturas de las pestañas usan básica; los ejemplos de avisos muestran los niveles indicados. En los diálogos se desplaza el contenido para mostrar los momentos y el campo de voz.

| Vista | Escritorio claro | Escritorio oscuro | Teléfono claro | Teléfono oscuro |
|---|---|---|---|---|
| DUA | [Captura](dua-1280-claro.png) | [Captura](dua-1280-oscuro.png) | [Captura](dua-390-claro.png) | [Captura](dua-390-oscuro.png) |
| Filtros de DUA | En columna | En columna | [Diálogo](filtros-dua-390-claro.png) | [Diálogo](filtros-dua-390-oscuro.png) |
| Apoyos específicos | [Captura](apoyos-1280-claro.png) | [Captura](apoyos-1280-oscuro.png) | [Captura](apoyos-390-claro.png) | [Captura](apoyos-390-oscuro.png) |
| Filtros de Apoyos específicos | En columna | En columna | [Diálogo](filtros-apoyos-390-claro.png) | [Diálogo](filtros-apoyos-390-oscuro.png) |

- Prioridad de «Quiero evaluar de formas distintas»: [Durante en escritorio](evaluar-durante-1280.png) y [Después en teléfono](evaluar-despues-390.png).
- Situaciones sin fichas: [Lectura, escritura y cálculo en parvularia](sin-apoyos-parvularia-1280.png); [Identidad, lengua y pertenencia / Espacio, tiempo y actitudes en superior](sin-apoyos-superior-1280.png).

## Pruebas

- `node --check app.js` y `git diff --check`.
- Todas las pruebas de `scripts/*.cjs`. La nueva `probar_momentos.cjs` verifica 36 acciones en todos los niveles, listas válidas, multiselección, orden por momento, prioridad de necesidades y compatibilidad con almacenamiento/respaldo antiguos.
- Pruebas de estudiante ampliadas: voz de máximo 300 caracteres, rechazo de tipos no textuales, respaldo, inclusión en PDF incluso sin apoyos individuales elegidos y vacíos por nivel. Regresión de mutación de listas por pdfmake, comprobada también retirando la copia en una ejecución aislada: la prueba falla sin ella.
- `python3 scripts/validar_catalogo.py`: catálogo correcto; 88 recomendaciones, 36/36 consideraciones DUA.
- Chromium/Playwright: grupos y conteos, prioridad de evaluar, selección/deselección con teclado y foco conservado, limpieza, vocabulario, títulos y bajadas por nivel, un solo `h1` visible, avisos sin duplicados y enlace de vuelta a DUA.
- Voz: privacidad sobre el diálogo de filtros y devolución del foco, longitud máxima, persistencia tras recarga y respaldo descargado/abierto. Texto HTML tratado como texto, sin crear elementos ni ejecutar código.
- Respaldo antiguo abierto con momentos actuales seleccionados: vuelve a lista vacía y muestra todo. Respaldo nuevo con lista duplicada/desconocida: conserva solo valores válidos. También se probaron estados antiguos o malformados en localStorage.
- Documento, PDF descargado e impresión a PDF contienen la nueva etiqueta y la voz debajo de facilitadores. Texto de los PDF extraído y revisado; sin «[object Object]». El catálogo en memoria coincide antes y después de descargar.
- Ambos temas, escritorio y teléfono: sin desplazamiento horizontal a 390 px, también con fuente raíz al 200 %. Comprobación adicional de escritorio al 200 %.
- axe-core sin infracciones automáticas en 12 combinaciones de paneles y diálogos de filtros, temas y anchos. Se comprobó el árbol accesible: encabezados de grupo de nivel 3, tarjetas de nivel 4 y propiedad nativa `live: polite` del conteo. Esto no sustituye la prueba con un lector de pantalla real.
- 16 PNG y enlaces locales verificados. Cabecera y textos de guía/privacidad comparados con la base; carpetas protegidas intactas.

## ponytail-review

What this change does: It shows all 36 actions by default and groups them by moment, with optional multiple filters. It adds panel titles, student and family input, and messages for situations with no access support in the current level.

Looks good. Ship.

Checked callers, ranking within groups, storage migration, backup validation and round trips, input limits, privacy and document output. Checked the PDF list copy against a failing regression case and a real download. Checked focus, tab history, mobile filter reuse, visible headings, the native accessibility tree, both themes and larger text. Expected use is one person in a browser with the existing small static catalog; rendering 36 actions needs no new dependency.

Not checked: a real screen reader, Firefox or Safari, physical phones and safe-area cutouts, or physical printing. The 200% check changes the root font size; it does not cover every browser or operating-system zoom setting.
