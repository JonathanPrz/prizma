# Tarea 066 · Conteos más claros y aviso de cambios sin guardar en DUA

Estado: **integrada** (PR #87) · Asignada a: Codex · Rama: `codex/066-conteo-barra` · Pull request con destino `main`

## Para qué
Son tres detalles de la revisión del PR #86. El dueño marcó «Mi clase tiene taller…» sin presionar «Guardar», bajó a los resultados y vio «36 acciones para todo el curso»: parecía que Prizma ignoraba lo marcado. Los cambios del paso 1 se aplican al guardar (decisión de la tarea 039), pero nada avisa que hay cambios pendientes.

1. En DUA, la barra de abajo dice «0 acciones», o «0 acciones para el curso» en el computador, mientras el conteo de los resultados dice «36 acciones». Se lee como si no hubiera acciones, cuando significa que aún no se elige ninguna. En «Para un estudiante» y en Trabajo ya dice «elegidos».

2. Nada avisa que el paso 1 tiene cambios sin guardar (`borradorDua`).
3. «36 acciones · 8 responden a lo que marcaste» pone primero el total y no lo pertinente.

Son cambios pequeños: no toques nada más. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. La barra dice «elegidas»
En `actualizarContinuar()` (`app.js`, cerca de la línea 1234), en DUA, el texto de `#continuar-cantidad` pasa de `plural(cantidad, "acción", "acciones")` a `plural(cantidad, "elegida", "elegidas")`. Por ejemplo, «0 elegidas» o «1 elegida». El resto queda igual:
- `#continuar-caso` sigue diciendo « para el curso», con el `voc` de curso;
- en el teléfono se sigue ocultando visualmente, como en la tarea 060;
- se mantienen las reglas de cuándo se oculta el conteo.

## 2. Aviso de cambios sin guardar
- Mientras `borradorDua` tenga diferencias con lo guardado (perfil, taller, actividad, evidencia, necesidades o meta), arriba de los resultados de DUA (antes de `#filtros-vista`) se muestra un aviso ámbar (`.aviso-apoyos` con «!»): «Tienes cambios sin guardar en el paso 1. Las acciones todavía no los consideran», con un botón «Guardar y actualizar» que hace lo mismo que «Guardar» de la clase.
- Si el borrador vuelve a quedar igual a lo guardado, o al guardar o al limpiar, el aviso desaparece.
- El aviso no mueve el foco ni la página al aparecer (`role="status"`).

## 3. Conteo con lo pertinente primero
En `conteoDua()`:
- con contexto y sin filtros: «8 de 36 acciones responden a lo que marcaste» (en vez de «36 acciones · 8 responden…»);
- con filtros y contexto: «Antes y Compromiso: 1 de 4 acciones responde a lo que marcaste»;
- sin contexto, igual que hoy: «36 acciones para todo el curso» o «Antes y Compromiso: 4 acciones».
Respeta singular y plural.

## Pruebas
- Ajusta, sin debilitarlas, las pruebas que esperan «acciones» en la barra de DUA.
- Agrégala a `scripts/probar_pagina.cjs`: en DUA, en el paso 2 con 0 elegidas, `#continuar-conteo` contiene «0 elegidas» y no contiene «acciones». Tras elegir una acción, dice «1 elegida».

- Marcar «taller» sin guardar muestra el aviso; «Guardar y actualizar» lo quita y el conteo pasa a «8 de 36 acciones responden a lo que marcaste» (básica). Desmarcar sin guardar también quita el aviso.
- Con «Antes» y «Compromiso» y contexto, el conteo dice «… de 4 acciones …».

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La barra de DUA dice «N elegidas».
- [ ] Hay un aviso cuando el paso 1 tiene cambios sin guardar, con un botón para guardar.
- [ ] El conteo pone primero las que responden a lo marcado.
- [ ] Pasan el validador y todas las pruebas.
