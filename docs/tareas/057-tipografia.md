# Tarea 057 · Public Sans como letra de la interfaz

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/057-tipografia` · Pull request con destino `main`

## Para qué
El dueño eligió Public Sans el 20-11-2026, después de comparar 8 letras con el texto real de Prizma y de dos revisiones adversariales. La razón: con la letra del sistema, cada equipo ve una letra distinta (Segoe UI, SF, Roboto…), y la jerarquía de la tarea 053 no se ve igual en todos. Public Sans tiene un tono institucional y cercano.

El archivo ya está en el repositorio: `vendor/fuentes/public-sans-latin.woff2`, una fuente variable de 25 KB con todos los pesos, junto con `OFL.txt` y `README.md`. **No descargues nada ni agregues otras fuentes.**

**No cambies `data/`, `docs/fuentes/` ni `.claude/`. La hoja del documento (`.hoja`) y el PDF siguen en Roboto.**

## Cambios
1. **`@font-face`** en `styles.css`:
   - `font-family: "Public Sans"`, con `src: url("vendor/fuentes/public-sans-latin.woff2") format("woff2")`;
   - `font-weight: 100 900` y `font-display: swap`.
2. **Respaldo calibrado,** para que el texto no salte al cargar la fuente: agrega `@font-face` llamado `"Public Sans respaldo"`, con `src: local("Segoe UI"), local("Arial"), local("Helvetica")`. Ajusta `size-adjust`, `ascent-override` y `descent-override` para que los anchos y altos se parezcan a Public Sans. Mídelo en Chromium con un párrafo de prueba y anota los valores en un comentario.
3. **`--fuente`:** `"Public Sans", "Public Sans respaldo", system-ui, -apple-system, "Segoe UI", sans-serif`. Fuera de `.hoja`, todo debe usar `var(--fuente)`, incluidos los botones, los campos (`font: inherit`) y los diálogos.
4. **Precarga** en `index.html`: `<link rel="preload" href="vendor/fuentes/public-sans-latin.woff2" as="font" type="font/woff2" crossorigin>`.
5. **Espaciado entre letras:** quita todo `letter-spacing` negativo, por ejemplo en `.marca`, `h1`, `h2` y los títulos de tarjeta.
6. **Números tabulares** (`font-variant-numeric: tabular-nums`) en `.n-sel`, `.conteo`, `#continuar-conteo` y las fechas de los resúmenes.
7. **Pesos:** se mantienen los de la tarea 053, con el título en 800.
8. Agrega `vendor/fuentes/` a la tabla de archivos de `AGENTS.md`: «Fuente Public Sans (OFL)», no se edita.

## Pruebas
- Las pruebas actuales siguen pasando, incluida la que verifica que la página no pide nada a otros sitios (tarea 046).
- Agrégalas a `scripts/probar_sistema_visual.cjs`:
  - `document.fonts.check('16px "Public Sans"')` es verdadero después de `document.fonts.ready`;
  - el título, un botón, un campo y el texto de una tarjeta usan Public Sans según `getComputedStyle`. `.hoja` sigue con Roboto;
  - la única petición de fuente es a `vendor/fuentes/public-sans-latin.woff2`, del mismo origen;
  - sin desplazamiento horizontal a 390 px, y ningún título de tarjeta pasa de 4 líneas a 390 px.
- En el pull request, agrega dos capturas de «Para un estudiante» con resultados, antes y después, a 390 y 1280 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La interfaz usa Public Sans desde el propio sitio, con respaldo calibrado.
- [ ] Sin `letter-spacing` negativo, con cifras tabulares en conteos y fechas.
- [ ] `.hoja` y el PDF no cambian.
- [ ] Pasan el validador y todas las pruebas.
