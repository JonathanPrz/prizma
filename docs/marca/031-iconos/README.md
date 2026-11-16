# Tarea 031 · Cabecera

Base: tarea 029 (`a931784`). Se reemplaza el selector por un botón de tema; se usan sin cambios los tres SVG de la tarea 031 publicada en main (`39cc25c`). Sin librerías, fuentes de íconos ni cambios de datos.

| Ancho | Claro | Oscuro |
|---|---|---|
| 390 px | [Cabecera](cabecera-390-claro.png) | [Cabecera](cabecera-390-oscuro.png) |
| 1280 px | [Cabecera](cabecera-1280-claro.png) | [Cabecera](cabecera-1280-oscuro.png) |

Pruebas: `node --check app.js`, `python3 scripts/validar_catalogo.py`, todas las `scripts/probar_*.cjs` y `git diff --check`: pasan. La prueba nueva cubre ambos dispositivos, elección guardada, valores antiguos/desconocidos y almacenamiento bloqueado. El script del head fija el tema antes de cargar las hojas de estilo; no espera al catálogo ni al script diferido.

En Chromium se contrastó el DOM de cada SVG con el SVG exacto de la tarea; se comprobaron Enter/espacio, persistencia y recarga, nombres accesibles, icono según la acción, texto de mochila desde 40 rem, contador real al elegir una acción, apertura/Escape y devolución del foco. Botón de tema: 54 × 44 px; sin desborde a 390 px. Axe no encontró infracciones A/AA en la cabecera. [Resultados](pruebas.json). La animación del contador y su comprobación de movimiento reducido no se alteraron.

## ponytail-review

What this change does: The header gets a theme button and a backpack icon. It keeps a saved light or dark choice and uses the device preference when there is no valid saved choice.

Looks good. Ship.

Checked: The head script, CSS theme rules, button setup and selection-counter callers. Tested both themes, saved and old values, blocked storage, keyboard focus and the current catalog. The SVGs match the task. Existing tests pass. Expected load is one person using the existing static page. No extra dependency or service.

Not checked: Safari, Firefox, physical phones or screen readers. Axe checks cover the header, not a full accessibility certification.
