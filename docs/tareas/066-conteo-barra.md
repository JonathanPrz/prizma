# Tarea 066 · La barra dice «elegidas», no «acciones»

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/066-conteo-barra` · Pull request con destino `main`

## Para qué
Es un detalle de la revisión del PR #86. En DUA, la barra de abajo dice «0 acciones», o «0 acciones para el curso» en el computador, mientras el conteo de los resultados dice «36 acciones». Se lee como si no hubiera acciones, cuando significa que aún no se elige ninguna. En «Para un estudiante» y en Trabajo ya dice «elegidos».

Es un cambio pequeño: no toques nada más. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambio
En `actualizarContinuar()` (`app.js`, cerca de la línea 1234), en DUA, el texto de `#continuar-cantidad` pasa de `plural(cantidad, "acción", "acciones")` a `plural(cantidad, "elegida", "elegidas")`. Por ejemplo, «0 elegidas» o «1 elegida». El resto queda igual:
- `#continuar-caso` sigue diciendo « para el curso», con el `voc` de curso;
- en el teléfono se sigue ocultando visualmente, como en la tarea 060;
- se mantienen las reglas de cuándo se oculta el conteo.

## Pruebas
- Ajusta, sin debilitarlas, las pruebas que esperan «acciones» en la barra de DUA.
- Agrégala a `scripts/probar_pagina.cjs`: en DUA, en el paso 2 con 0 elegidas, `#continuar-conteo` contiene «0 elegidas» y no contiene «acciones». Tras elegir una acción, dice «1 elegida».

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La barra de DUA dice «N elegidas».
- [ ] Pasan el validador y todas las pruebas.
