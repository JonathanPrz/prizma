# Tarea 060 · La barra de continuar no queda encima ni debajo del pie

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/060-barra-continuar` · Pull request con destino `main`

## Para qué
El dueño encontró la barra fija («0 elegidos para Estudiante 1 · Guardar y ver apoyos») «medio bug»: al llegar al final de la página aparece debajo del pie, sobre una franja de fondo gris, y se ve como una pieza suelta. Mediciones en `main` (Chromium, 800 px de alto):

- La barra es `position: fixed`. El `body` reserva su alto con `padding-bottom`, así que al final queda una franja de `--papel` bajo el pie, con la barra flotando encima. En escritorio la barra mide 800 px y el pie ocupa todo el ancho, así que se ve como un parche.
- **En el paso 1, «0 elegidos para Estudiante 1» no aporta nada.** En el teléfono, además, ocupa dos líneas.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios
1. **Barra pegajosa, no fija.** `#barra-continuar` ya está dentro de `main`. Cámbiala a `position: sticky; bottom: 0`:
   - mientras se lee, queda pegada abajo;
   - al llegar al final del contenido, se detiene antes del pie y nunca lo tapa ni queda debajo.
2. **Quita la reserva de espacio** `body:has(#barra-continuar:not([hidden])) { padding-bottom: … }`. Revisa si `--barra-alto` se sigue necesitando para `scroll-padding-bottom` y para que la barra no tape el campo con foco. Mantén lo necesario y quita el resto.
3. **Fondo de ancho completo en escritorio.** La barra pinta `--superficie` de borde a borde, con su línea superior, y el contenido (conteo y botón) va centrado en la columna de 50rem. Por ejemplo, un borde con `box-shadow` hacia los lados o un contenedor interno.
4. **Conteo solo cuando dice algo.** En el paso 1, y con 0 elegidos, el conteo se oculta y el botón queda alineado a la derecha. Desde el paso 2, o con 1 elegido o más, se muestra.
5. **Conteo corto en el teléfono.** Bajo 30rem, muestra solo el número («3 elegidos»), sin el nombre. El nombre sigue en el `aria-label` o en un texto solo para lectores, porque el botón ya está en el caso activo.

## Pruebas
- Las pruebas actuales siguen pasando, incluidas las que verifican que la barra no tape el paso activo ni los errores (tareas 054 y 055).
- Agrégalas a `scripts/probar_pagina.cjs`:
  - a 390 y 1280 px, al desplazarse hasta el final, el borde inferior de la barra queda en o sobre el borde superior de `.pie`, y no hay franja de `--papel` bajo el pie: el `body` no tiene `padding-bottom` reservado;
  - a la mitad de la página, la barra sigue visible y pegada abajo;
  - en el paso 1 con 0 elegidos, `#continuar-conteo` no se ve. Con 1 elegido en el paso 2, sí;
  - a 390 px, el conteo ocupa una sola línea;
  - el foco en el último campo del formulario no queda tapado por la barra.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas del final de la página a 390 y 1280 px, antes y después.

## Criterios de aceptación
- [ ] La barra se detiene antes del pie y no deja una franja bajo él.
- [ ] En escritorio, su fondo cubre todo el ancho.
- [ ] El conteo solo aparece cuando aporta y cabe en una línea en el teléfono.
- [ ] Pasan el validador y todas las pruebas.
