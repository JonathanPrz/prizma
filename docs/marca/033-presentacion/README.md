# Tarea 033 · Presentación general

Textos exactos de la tarea: subtítulo bajo la marca, título y descripción de página, nombres de pestañas, audiencia y aviso del pie. En superior la segunda pestaña conserva «Ajustes razonables». Los tres h1 de los paneles se contrastaron con main y no cambiaron.

El aviso final solicitado se usa en vista previa y definición PDF de los documentos escolares, laborales y de práctica. En el de práctica se agrega después del texto existente sobre lo que el estudiante decidió compartir. El pie de reserva laboral se conserva.

El subtítulo se oculta por debajo de 40 rem, como permite la tarea. La única adaptación de estructura/estilo es el bloque de marca que contiene esa línea y su regla de visibilidad. No se cambian datos ni flujos.

| Captura | Claro | Oscuro |
|---|---|---|
| Cabecera 1280 px | [Ver](cabecera-1280-claro.png) | [Ver](cabecera-1280-oscuro.png) |
| Cabecera 390 px | [Ver](cabecera-390-claro.png) | [Ver](cabecera-390-oscuro.png) |
| Pie 1280 px | [Ver](pie-1280-claro.png) | [Ver](pie-1280-oscuro.png) |
| Pie 390 px | [Ver](pie-390-claro.png) | [Ver](pie-390-oscuro.png) |

[Comprobaciones en Chromium](comprobaciones.json): textos literales, pestaña de superior y vuelta a básica, aviso en las tres vistas/definiciones PDF, subtítulo visible en escritorio y oculto en teléfono, sin desplazamiento horizontal ni errores de página en las cuatro combinaciones.

Pasan `node --check app.js`, `python3 scripts/validar_catalogo.py`, todas las pruebas `scripts/probar_*.cjs` y `git diff --check`. No se modifican `data/`, `docs/fuentes/` ni `.claude/`.

## ponytail-review

What this change does: It updates the public text to cover learning and work. It uses the same final notice in each document and keeps the legal tab name for higher education.

Looks good. Ship.

Checked: The diff, the tab-name updater and all notice callers in preview and PDF rendering. Exact text checks, unchanged panel headings, existing repository tests and Chromium at 390/1280 px in both themes. Expected use is the existing static page; there is no new data processing or dependency. No pending findings.

Not checked: Other browsers, screen readers, a newly downloaded PDF or paper printing. The three PDF definitions and previews were checked, rather than generating new PDF files for this text change.
