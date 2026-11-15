# Tarea 022 · Guías por pestaña

Se retiran las aperturas automáticas y el diálogo «Antes de empezar», sus claves y su lógica. Cada cabecera tiene su enlace principal bajo la bajada, junto a Filtros. Se conserva además el acceso contextual desde la línea de acuerdo, pedido por la tarea. El pie contiene las dos guías y Privacidad. Los enlaces de apoyos cambian de nombre en superior.

La guía de apoyos usa exactamente los títulos, listas y notas de la tarea, en el orden indicado. La guía DUA y el aviso completo de privacidad conservan su HTML original. «Empezar» conserva su función, incluida la apertura de filtros en teléfono.

Privacidad aparece al escribir por primera vez en iniciales, ayuda, voz o notas. «Entendido» se guarda con `prizma.privacidad.v1`; sin almacenamiento, la memoria dura esta visita. El enlace «¿Qué datos puedo escribir?» siempre permite abrirla. Si el campo está dentro de filtros móviles o Mi mochila, se cierra temporalmente ese diálogo para mostrar privacidad y se restaura al cerrar, con el foco en el campo. Así no se superponen ventanas. El encabezado de resultados usa el mismo borde inferior que DUA y se actualiza con iniciales y nivel.

## Capturas

Chromium, alto 900 px, sin datos reales de estudiantes.

| Vista | Escritorio claro | Teléfono claro | Escritorio oscuro | Teléfono oscuro |
|---|---|---|---|---|
| Pestaña DUA | [Ver](panel-dua-1280-claro.png) | [Ver](panel-dua-390-claro.png) | [Ver](panel-dua-1280-oscuro.png) | [Ver](panel-dua-390-oscuro.png) |
| Pestaña Apoyos | [Ver](panel-apoyos-1280-claro.png) | [Ver](panel-apoyos-390-claro.png) | [Ver](panel-apoyos-1280-oscuro.png) | [Ver](panel-apoyos-390-oscuro.png) |
| Guía DUA | [Ver](guia-dua-1280-claro.png) | [Ver](guia-dua-390-claro.png) | [Ver](guia-dua-1280-oscuro.png) | [Ver](guia-dua-390-oscuro.png) |
| Guía de apoyos: escuela | [Ver](guia-escolar-1280-claro.png) | [Ver](guia-escolar-390-claro.png) | [Ver](guia-escolar-1280-oscuro.png) | [Ver](guia-escolar-390-oscuro.png) |
| Guía de apoyos: superior | [Ver](guia-superior-1280-claro.png) | [Ver](guia-superior-390-claro.png) | [Ver](guia-superior-1280-oscuro.png) | [Ver](guia-superior-390-oscuro.png) |

## Verificación

- `node --check app.js`, todos los `scripts/*.cjs`, `scripts/probar_unificar_media.py` y `scripts/validar_catalogo.py`: pasan. Catálogo intacto, 139 fichas y 36/36 consideraciones.
- `probar_avisos.cjs`: ninguna guía automática al activar pestañas; aperturas manuales, foco y retorno; comparación exacta y ordenada de listas y notas con la tarea; privacidad al escribir en cada campo de estudiante; memoria y almacenamiento bloqueado; suspensión/restauración de Mi mochila; títulos con iniciales y sin ellas y claves retiradas.
- `probar_guia_dua.cjs`: guía manual, texto original, «Empezar», foco, reapertura, privacidad pendiente y almacenamiento bloqueado. `probar_pestanas.cjs` mantiene sus comprobaciones con la nueva fila de acciones.
- Chromium: entrada nueva por ambos hashes sin ventanas; cambio de pestaña sin ventanas; acceso principal, pie y acceso de privacidad bajo Iniciales; guías por teclado, Escape y Entendido, foco al abrir y volver. Primer ingreso en los cuatro tipos de campo, sin superposición de diálogos y con restauración del campo; segunda escritura sin aviso, persistencia tras recarga y almacenamiento bloqueado. Encabezado por iniciales y nivel, guía superior y «Empezar» en teléfono.
- 1280/390 px y claro/oscuro: veinte vistas, sin desborde horizontal y con cero infracciones axe en reglas A/AA de WCAG 2.0, 2.1 y 2.2. Comprobación adicional de página y guía superior a 390 px con texto al 200 %.
- Sin cambios en `data/`, `docs/fuentes/` ni `.claude/`. Documento/PDF y tabla CIF conservan su implementación y sus pruebas.

## ponytail-review

What this change does: It makes both guides open only from their links. It adds the exact school and higher education guide text, restores privacy at the first data entry, and gives support results a visible heading.

Looks good. Ship.

Checked: Every guide and privacy caller, tab changes and startup, initial entry from both URLs, storage and blocked storage, level and initials updates, dialog close events and focus. Privacy temporarily closes the mobile filters or backpack before opening, then restores that dialog and the field. Tests check the guide lists against the task in order and keep the existing DUA text checks. The full privacy and DUA dialog text is unchanged. The expected load is one person using a static page with 139 cards. Old automatic notice keys and logic are gone. No new dependency or network data flow was added.

Not checked: Real screen readers, Safari, Firefox, physical phones and paper printing. The PDF was not visually checked again; its code and regression tests are unchanged. Chromium and axe do not prove full WCAG compliance.
