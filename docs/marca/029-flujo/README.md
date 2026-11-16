# Tarea 029 · Evidencia posterior

Implementación de la versión de la tarea que incluye **1b**. La [auditoría previa](../../auditorias/029-flujos/README.md) se hizo primero y quedó en el commit `9a0648f`, antes de tocar la aplicación. Datos de prueba ficticios: JP y JP2. No se modificaron `data/`, `docs/fuentes/` ni `.claude/`.

## Capturas

Capturas de Chromium con viewport de 1280 × 900 y 390 × 900. Cada captura se desplaza al bloque que demuestra; no pretende ser una imagen de la página completa.

| Bloque | Escritorio claro | Escritorio oscuro | Teléfono claro | Teléfono oscuro |
|---|---|---|---|---|
| DUA: prioridad entre momentos, sin columna lateral | [Ver](dua-1280-claro.png) | [Ver](dua-1280-oscuro.png) | [Ver](dua-390-claro.png) | [Ver](dua-390-oscuro.png) |
| Acuerdos guardados, resumen y siguiente caso | [Ver](acuerdos-1280-claro.png) | [Ver](acuerdos-1280-oscuro.png) | [Ver](acuerdos-390-claro.png) | [Ver](acuerdos-390-oscuro.png) |
| Pregunta explícita ante apoyo repetido | [Ver](pregunta-1280-claro.png) | [Ver](pregunta-1280-oscuro.png) | [Ver](pregunta-390-claro.png) | [Ver](pregunta-390-oscuro.png) |
| Selección DUA, notas, reflexión y documento | [Ver](seleccion-1280-claro.png) | [Ver](seleccion-1280-oscuro.png) | [Ver](seleccion-390-claro.png) | [Ver](seleccion-390-oscuro.png) |

[PDF de ejemplo, cuatro páginas](prizma-plan-ejemplo.pdf): curso con el aviso numérico y reflexión; JP y JP2 con sus apoyos, observación de oferta al curso y acuerdos; fuentes. La marca ficticia `VOZ_PRIVADA_029` aparece solo en la sección del estudiante. No aparece en la sección del curso.

## Comprobaciones

```sh
node --check app.js
python3 scripts/validar_catalogo.py
for prueba in scripts/probar_*.cjs; do node "$prueba" || exit 1; done
git diff --check
```

Todas pasan. `probar_datos_reales.cjs` ejecuta los mismos validadores de la página con los tres JSON reales y contrasta el respaldo normalizado en todos los niveles: no pierde fichas, fuentes, necesidades, dimensiones, selecciones, textos válidos ni campos nuevos. `probar_flujo_avisos.cjs` comprueba guardado diferido, prioridad global sin duplicados, descripción mínima, acuerdos, revisión posterior, bloqueo del siguiente caso, foco, JP2/duplicados, memoria de No, Sí sin quitar apoyos, conteo único, PDF y respaldo. Las pruebas previas conservan sus comprobaciones de privacidad, migraciones, navegación y documento separado para el centro.

Se comprobó **una vez** la regresión solicitada: con un preloader temporal fuera del repositorio, se reemplazó únicamente `d > DIMENSIONES.length` por `d > 11` dentro de `validarNecesidades` al leer `app.js`. `node -r /workspace/work/029/mutar-limite.cjs scripts/probar_datos_reales.cjs` terminó con código **1** y `AssertionError: Se descartaron necesidades reales`: devolvió cero necesidades frente a las ocho esperadas. El archivo de aplicación no se modificó para esta prueba; el límite final sigue siendo las 14 dimensiones reales.

En navegador se repitieron los recorridos en las cuatro combinaciones de ancho y tema. Se verificaron apertura y plegado de pasos, cambios DUA solo al guardar, prioridad, privacidad y devolución del foco, errores de acuerdos, invalidación posterior, siguiente caso, duplicados, Sí/No y recarga, sincronización de notas entre selección y mochila, roles de superior, vista previa y descarga real del PDF. [Resultados](pruebas-navegador.json): sin errores de página ni desplazamiento horizontal. Axe no encontró infracciones de sus reglas WCAG A/AA en la pestaña DUA al finalizar el recorrido; esto no equivale a certificar toda la aplicación.

## Revisión ponytail-review

What this change does: Both tabs use full-width steps. Each student has saved agreements, and shared supports are linked to course actions without putting student initials in course notices.

Looks good. Ship.

Checked: State loading, old backups, new backup fields, validators and their callers, choices in both tabs, repeated supports, note edits, preview and PDF output. The review found that the two course-note editors could show different text; this was fixed by updating the matching editor, and checked in Chromium. All repository tests pass. The expected load is one teacher, up to ten cases, and the current catalog of 176 cards. No new dependency or shared service was added. Removed filter-dialog code and reused the existing card, storage and document helpers.

Not checked: Safari, Firefox, physical phones, screen readers, printed paper output or sessions with real teachers. Automated accessibility checks do not replace those checks. Existing restoration limits for malformed or oversized external data are documented in the prior audit.
