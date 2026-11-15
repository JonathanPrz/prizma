# Tarea 018 · Apoyos individualizados y resumen CIF

Base: `c3521ee`. Rama: `codex/018-individualizados-cif`.

La escuela usa «Apoyos individualizados»; superior conserva «Ajustes razonables», también en el título de su sección del documento. Los objetivos se agrupan por los cinco tipos, con la ficha general primero. El selector de asignatura conserva las generales y los ejemplos con asignatura vacía, además de los propios de la asignatura elegida. Su valor se valida y se guarda en navegador y respaldo.

La casilla de actividades prácticas solo se muestra si existen fichas de acceso aplicables con el contexto `practica`. Se valida como booleano, se respalda y suma al contador cuando corresponde al nivel. Sus fichas se excluyen siempre de los grupos ordinarios y aparecen en un grupo propio al marcarla, ordenadas por situaciones coincidentes. Si se cambia a un nivel sin esas fichas, la elección queda guardada, pero no aparece un filtro activo invisible. El catálogo real todavía no tiene estas fichas.

El documento incluye situaciones, frecuencias y títulos de apoyos elegidos que coinciden con cada dimensión; si no hay ninguno, indica «Sin apoyo elegido». También incluye las barreras cuando solo se eligieron acciones DUA. La tabla HTML tiene caption, encabezados con scope de columna/fila y una región enfocable con desplazamiento horizontal propio. El título y la explicación CIF quedan fuera del área que se desplaza, para poder leerlos completos en teléfono. Debajo aparecen facilitadores y voz. El PDF usa tabla de tres columnas con encabezado repetido.

No se modifican `data/`, `docs/fuentes/`, `.claude/`, el logo ni los temas. Sin dependencias nuevas.

## Capturas

Ejemplos ficticios, iniciales AB. Las dos capturas llamadas «simulada» usan una respuesta de red de prueba: no son fichas agregadas al catálogo.

| Vista | Escritorio | Teléfono |
|---|---|---|
| Objetivos, claro | [Captura](objetivos-1280-claro.png) | [Captura](objetivos-390-claro.png) |
| Objetivos, oscuro | [Captura](objetivos-1280-oscuro.png) | [Captura](objetivos-390-oscuro.png) |
| Tabla CIF en vista previa | [Captura](cif-1280.png) | [Captura](cif-390.png) |
| Actividades prácticas simuladas | [Grupo](practica-simulada-1280.png) | [Casilla](practica-simulada-390.png) |

## Pruebas

- `node --check app.js`, `git diff --check`, todas las pruebas `scripts/*.cjs` y `python3 scripts/validar_catalogo.py`: correctos. Catálogo real: 101 recomendaciones y 36/36 consideraciones DUA.
- Nueva prueba `probar_individualizados.cjs`: asignaturas válidas/incorrectas, generales primero, ejemplos comunes, práctica estrictamente booleana, simulación de fichas y filtrado por nivel, separación de grupos, respaldos antiguos y datos de la tabla CIF.
- Chromium/Playwright: 13 objetivos en Todas y 8 en Matemática; cinco grupos; persistencia; casilla ausente en catálogo real y grupo funcional con ficha simulada en la respuesta de red. Seleccionar/deseleccionar no mezcla fichas prácticas con los cuatro grupos ordinarios.
- Tabla HTML con tres encabezados de columna y encabezados de fila, árbol accesible capturado y región desplazable con teclado. PDF real descargado y texto extraído: título CIF, referencia, situaciones, frecuencias y casos sin apoyo. Superior conserva el término legal y no incluye Decreto 83.
- JSON descargado con asignatura/práctica y apertura de respaldo antiguo sin estos campos. Ambos temas, 390 px sin desbordamiento de página y texto al 200 %. axe sin infracciones automáticas en cuatro combinaciones de objetivos (dos anchos y dos temas).

## ponytail-review

What this change does: It groups objective adjustments by type and subject, and prepares a separate practical-activity group without adding catalog content. It adds an ICF barrier and support table to the preview and PDF, and keeps the higher-education wording.

Looks good. Ship.

Checked the filter callers, general-first ordering, saved values, legacy backups, practical-card isolation and level changes. Checked the shared document data, HTML table headers, PDF generation, mobile overflow and current tests. The expected load is one browser with the existing small catalog. Simulation stays in tests and no dependency is added.

Not checked: real screen readers, PDF/UA tagging, physical phones, Safari/Firefox and physical printing. The HTML accessibility tree and table structure were checked; the PDF was checked through its definition, generation and extracted text.
