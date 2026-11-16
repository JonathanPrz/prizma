# Tarea 023 · Varios estudiantes

## Entrega reproducible

- [PDF del caso largo](prizma-plan-2026-11-15.pdf): 12 acciones para el curso y 2 estudiantes ficticios (JP y AM), con 6 apoyos cada uno. **11 páginas**.
- [Respaldo ficticio v2 del mismo caso](ejemplo-respaldo-v2.json). Para reproducir el PDF, ábrelo con «Abrir respaldo», pulsa «Ver documento» y marca el curso y ambos estudiantes.
- [Todas las páginas del PDF](pdf-paginas.png) y [detalle de una página de estudiante](pdf-estudiante.png).
- [Mi mochila con ambos estudiantes](mochila-1280.png) y [casillas para elegir el contenido](contenido-1280-oscuro.png).

## Datos y migración

`estudiantes` contiene de uno a diez registros con identificador interno, datos y selección individual. `estudianteActivo` señala el registro que se edita. `seleccion` solo contiene DUA. La carga del navegador y la importación comparten la normalización. Se espera al catálogo antes de migrar y guardar, para no perder los apoyos del formato antiguo antes de saber qué tipo tiene cada ficha.

El formato antiguo se convierte en un primer estudiante, incluso vacío, conservando sus textos y moviendo a su selección solo las fichas individuales. Las acciones DUA permanecen en el curso. Los respaldos nuevos son v2 y se aceptan v1. Se validan notas, frecuencias, campos, identificadores, estudiante activo y límites. Los respaldos de más de diez estudiantes se rechazan; el tamaño admitido permite las diez selecciones con notas, también en UTF-8.

El contador de Mi mochila suma las selecciones del curso y de todos los estudiantes. El nivel sigue siendo general: se conservan las elecciones de otros niveles, y se muestran/exportan las fichas aplicables al nivel actual, como antes. Agregar una versión DUA no elimina los apoyos individuales. Los conteos de barreras nunca llevan iniciales.

## PDF: sección 6

| Punto de la sección 6 | Implementación y evidencia |
|---|---|
| Qué incluir | Diálogo con curso y estudiantes con datos. Por defecto curso + activo. Comprobados solo AM, solo curso y ambos estudiantes. No se genera un documento sin una opción marcada. |
| Portada breve | Logo M1 convertido desde el SVG existente, Prizma y título en la primera página junto con las primeras fichas. Tabla de fecha, nivel, práctica, meta, necesidades y contenido. Conserva actividad/evidencia cuando se han indicado. |
| Encabezados y pies | Desde la segunda página, título y fecha grises con línea fina, y página X de Y. Advertencia de datos solo en páginas 5–10 del ejemplo, sin ella en curso ni fuentes. |
| Curso | Título y grupos de momentos; mismo comparador de prioridad que la página, sin perder las acciones elegidas que un filtro visual oculta. |
| Cada estudiante | Nueva página: JP en la 5 y AM en la 8. Título/subtítulo, CIF, dos filas de facilitadores y voz, apoyos por subtipo/tipo y acuerdos con tres líneas. |
| Fichas | Título, pasos, explicación, tipo/consideración/respaldo en gris, nota con fondo suave y estado de versión DUA ofrecida. Cada ficha es un bloque indivisible. |
| Encabezados sin huérfanos | Cada momento/subtipo se agrupa con su primera ficha; las secciones de estudiante y fuentes empiezan en página nueva. Se verificó que cada encabezado de grupo comparte página con su primera ficha. |
| CIF | Encabezado gris, bordes finos y proporciones 38/18/44. «Casi siempre» queda en una sola línea. |
| Fuentes | Página nueva: la 11 del ejemplo. Lista numerada, URL gris menor y aviso legal al final. |
| Tipografía y espacio | Roboto incrustada; títulos 20/14/11,5 y cuerpo 10,5; márgenes 56,7 pt ≈ 2 cm; A4. La vista reutiliza las fuentes locales de pdfmake, sin archivos/dependencias nuevos. Color de marca solo en el logo; resto en grises. |
| Nombre | Descarga comprobada como `prizma-plan-2026-11-15.pdf`; el caso solo del curso usa `prizma-curso-AAAA-MM-DD.pdf`. Sin iniciales en el nombre. |

## Capturas

| Vista | Escritorio claro | Teléfono claro | Escritorio oscuro | Teléfono oscuro |
|---|---|---|---|---|
| Selector y datos del estudiante activo | [Ver](selector-1280-claro.png) | [Ver](selector-390-claro.png) | [Ver](selector-1280-oscuro.png) | [Ver](selector-390-oscuro.png) |
| Barreras repetidas sin iniciales | [Ver](repeticiones-1280-claro.png) | [Ver](repeticiones-390-claro.png) | [Ver](repeticiones-1280-oscuro.png) | [Ver](repeticiones-390-oscuro.png) |
| Vista previa del plan largo | [Ver](documento-1280-claro.png) | [Ver](documento-390-claro.png) | [Ver](documento-1280-oscuro.png) | [Ver](documento-390-oscuro.png) |

## Verificación

- Pasan `node --check app.js`, `python3 scripts/validar_catalogo.py`, todos los `scripts/*.cjs` y `scripts/probar_unificar_media.py`. Catálogo sin cambios: 139 fichas, 36/36 consideraciones.
- Nuevo `scripts/probar_estudiantes.cjs`: migración y primer guardado, separación, ida y vuelta v2, datos inválidos, identificadores duplicados, máximo 10, barreras y vínculo DUA, exportación parcial, estructura del PDF y cancelación de generación pendiente. Se ajustaron las pruebas previas al nuevo dueño de cada selección sin quitar sus comprobaciones de filtrado, rótulos y conservación.
- Chromium: dos estudiantes con campos/notas/apoyos distintos, cambio y recarga; el mismo apoyo elegido para ambos y su versión agregada al curso sin quitárselo a nadie; recuadro anónimo que activa «Se pierden en tareas largas o con muchos pasos».
- Mi mochila con secciones y notas independientes; descarga/importación v2; importación v1 con ficha retirada y aviso; confirmación de quitar aceptada y cancelada; llegar a 10 desactiva Agregar; quitar el último crea uno vacío.
- Teclado: Enter/Espacio en el selector, `aria-pressed`, foco visible y árbol accesible del recuadro sin iniciales. Privacidad sigue siendo global, una vez al escribir, también desde filtros móviles con almacenamiento bloqueado. Sin diálogos superpuestos en los recorridos.
- 1280/390 px, claro/oscuro y texto al 200 % en filtros: sin desborde de página. Axe sin infracciones A/AA de WCAG 2.0/2.1/2.2 en 13 vistas (selector, repeticiones, elección de contenido y documento).
- PDF real descargado desde la interfaz y revisado con extracción de texto y renderizado: 11 páginas, 12 acciones DUA y 6 apoyos por estudiante. Se comprobó que título, todos los pasos, explicación, respaldo y nota de cada una de las 24 fichas están en una sola página. También encabezados con primera ficha, márgenes, fuente Roboto incrustada, pies, CIF y ausencia del otro estudiante en exportaciones parciales.
- PDFs adicionales comprobados: solo curso (5 páginas), solo AM (5), estudiante sin apoyos (3, con «Sin información» y acuerdos) y notas de 2.000 caracteres (9, sin cortar fichas). No se adjuntan esos archivos redundantes.
- Cancelar durante la carga de las fuentes no abre la vista más tarde; reintentar funciona. La biblioteca/fuentes se cargan solo al preparar un documento.
- Comparación con la base: `data/`, `docs/fuentes/`, `.claude/` y `vendor/` intactos; los tres diálogos de guías/privacidad mantienen su contenido.

## ponytail-review

What this change does: It keeps each student's data and support choices apart from the course choices. It migrates old saved data and backups, links repeated barriers to course actions, and builds a PDF from only the people and actions the teacher selects.

Looks good. Ship.

Checked: All old student and selection callers, startup before the first save, backup versions 1 and 2, input limits and IDs, active student changes, removal and notes owned by another student. Course actions never move or remove individual supports. The repeated-barrier box contains counts and no initials. The preview and PDF use one document model. Tests cover partial exports, empty supports, long notes, page starts, headers, private page footers, source pages, fonts and unbroken cards. I checked the actual long PDF and its rendered pages. I also checked cancellation while the local PDF fonts load. The expected load is one teacher with up to ten students and a 139-card catalog. The code reuses the existing PDF library and its fonts. No new dependency or network data flow was added.

Not checked: Real screen readers, Safari, Firefox, physical phones and paper printing. Chromium accessibility trees and axe do not prove full WCAG compliance. The HTML preview shares content and order; the attached PDF is the checked paginated output.
