# Tarea 025 · Orden y pertinencia

Los accesos se ordenan por puntaje, proporción de situaciones coincidentes y posición del catálogo. «Para empezar» reúne las tres mejores fichas del conjunto de accesos normales y prácticos visibles; no se repiten abajo. Con tres o menos solo hay grupos. Las prácticas requieren puntaje positivo.

El título del filtro identifica al estudiante activo en la columna y en el diálogo móvil. Al pasar a DUA el diálogo vuelve a «Filtros». El selector conserva su lugar y el título se actualiza también al editar las iniciales.

Los datos sin versión de situaciones que contienen 3 o 6 se conservan sin reinterpretarlos. Se guarda `versionSituaciones: 1` mientras la revisión está pendiente; «Entendido» la lleva a 2. Los datos nuevos empiezan en 2. La carga local y la importación v1/v2 usan la misma normalización y los respaldos nuevos conservan la versión. Sin almacenamiento, la confirmación dura la visita.

## Evidencia

| Vista | Claro | Oscuro |
|---|---|---|
| Orden a 1280 px | [Ver](orden-1280-claro.png) | [Ver](orden-1280-oscuro.png) |
| Orden a 390 px | [Ver](orden-390-claro.png) | [Ver](orden-390-oscuro.png) |
| Contexto al final de filtros móviles | [Ver](contexto-390-claro.png) | [Ver](contexto-390-oscuro.png) |

[Práctica pertinente](practica-1280-oscuro.png).

## Pruebas

- `node --check app.js`, validador y todas las `scripts/probar_*.cjs` pasan, incluida `probar_orden.cjs`.
- Nueva prueba: CAA primero con solo expresión oral; puntaje, proporción y empate por catálogo; umbral de «Para empezar» y ausencia de duplicados; práctica positiva; versión pendiente desde v1 y v2, recarga y confirmación; títulos por estudiante/nivel de pestaña.
- Chromium: CAA primero, práctica de lectura sin asistente y con procedimiento, teclado y cambio/renombrado de estudiante; aviso antiguo con JP/AM persiste hasta confirmar y no reaparece al recargar; importación de respaldo v1 con situación 6.
- Siete vistas a 1280/390 px, claro/oscuro: sin desborde ni infracciones axe de reglas WCAG A/AA 2.0, 2.1 y 2.2. El título móvil sigue identificando al estudiante al final del formulario.
- Catálogo y rutas protegidas sin cambios. Los casos anteriores de práctica se ajustan a la nueva regla, conservando su aislamiento por nivel.

## ponytail-review

What this change does: It puts the best matching access cards first and removes practical cards with no match. It keeps the active student in the filter title and asks the teacher to review old combined situations without guessing a new answer.

Looks good. Ship.

Checked: Score, matched proportion and catalog tie order; combined top three without duplicate cards; positive matches for practice; all title updates when switching, renaming and opening filters. Old local data and both backup versions use the same review flag. The flag stays pending until confirmation and is included in new backups. The expected load is one teacher and up to ten students. No catalog, dependency or data flow was added.

Not checked: Real screen readers, Safari, Firefox and physical phones. Chromium and axe do not prove full WCAG compliance.
