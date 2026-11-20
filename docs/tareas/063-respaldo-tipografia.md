# Tarea 063 · Letra de respaldo calibrada con la fuente correcta

Estado: **integrada** (PR #84) · Asignada a: Codex · Rama: `codex/063-respaldo-tipografia` · Pull request con destino `main`

## Para qué
Es un detalle de la revisión del PR #77 (tarea 057). La letra de respaldo `"Public Sans respaldo"` se calibró con las medidas de Arial (Liberation Sans): `size-adjust`, `ascent-override` y `descent-override`. Pero su `src` pide primero `local("Segoe UI")`. En Windows se usa Segoe UI con ajustes pensados para Arial, así que mientras carga Public Sans el texto puede saltar de tamaño o de línea.

Es un cambio pequeño: no toques nada más.

**No cambies `data/`, `docs/fuentes/`, `.claude/` ni `vendor/fuentes/`.**

## Cambio
En `styles.css`, en el `@font-face` de `"Public Sans respaldo"`:
- **`src` queda así:** `local("Arial"), local("Liberation Sans"), local("Helvetica"), local("Arimo")`. Todas tienen las métricas de Arial, que son las que se calibraron. Quita `local("Segoe UI")`.
- **No cambies** `size-adjust`, `ascent-override`, `descent-override` ni `line-gap-override`.
- **Actualiza el comentario** para que diga por qué solo van fuentes con métricas de Arial.

`--fuente` no cambia: `"Public Sans", "Public Sans respaldo", system-ui, …`.

## Pruebas
- Las pruebas actuales siguen pasando.
- Agrégala a `scripts/probar_sistema_visual.cjs`: lee `styles.css` y verifica que el `src` de `"Public Sans respaldo"` no contiene `Segoe UI` y empieza con `local("Arial")`.
- Si puedes, en Chromium:
  - bloquea la carga de `vendor/fuentes/public-sans-latin.woff2` (con `page.route`);
  - mide el ancho de un párrafo de prueba con la letra de respaldo;
  - compáralo con el ancho del mismo párrafo con Public Sans: la diferencia debe ser de 2 % o menos.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La letra de respaldo usa solo fuentes con métricas de Arial.
- [ ] Los valores de calibración no cambian.
- [ ] Pasan el validador y todas las pruebas.
