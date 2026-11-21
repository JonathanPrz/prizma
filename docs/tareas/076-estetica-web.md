# Tarea 076 · Estética de la web: columna más ancha, pasos claros, menos cajas y panel de lo elegido en escritorio

Estado: **integrada** (PR #97) · Asignada a: Codex (lo implementó un agente de Claude) · Rama: `codex/076-estetica-web` · Pull request con destino `main`

## Para qué
Lo decidió un consejo de 6 especialistas (21-11-2026), con dos rondas de votos y un debate abierto sobre escritorio. Los especialistas fueron: diseño de interfaz, diseño de experiencia, accesibilidad, teléfono, docente y abogado del diablo. El dueño aprobó todo.

**Lo que se midió:**
- a 1280 px el contenido ocupa unos 500 px, mientras la cabecera ocupa todo el ancho;
- el indicador de pasos parece una fila de enlaces sueltos;
- hay cajas dentro de cajas;
- a 390 px, las casillas del paso 1 miden de 24 a 34 px y algunas etiquetas se parten;
- «Por qué funciona y fuentes» mide 28 px;
- hay textos de 13 px;
- las viñetas de «Empieza por:» no calzan con los enlaces largos;
- hay un espacio muerto bajo el indicador de pasos en el teléfono.

**La tarea 054 decidió una sola columna y sin panel.** El dueño reabrió esa decisión, y el consejo eligió un panel limitado (sección 2), que no duplica la barra.

**Solo cambia lo visual,** sobre todo en `styles.css`. Usa `index.html` y `app.js` solo donde se diga. No cambies `data/`, `docs/fuentes/` ni `.claude/`. Usa solo las variables de `:root`, en claro y oscuro. **No cambies** Public Sans, el acento azul, el gris carbón, el logo, los colores DUA ni la barra de continuar en el teléfono.

## 1. Columna de 46 rem
- El contenido de las pestañas (`.explorador` o equivalente) ocupa como máximo **46 rem** y va centrado.
- **Arriba, todo usa el mismo eje:** logo y botones, selector de nivel, pestañas e indicador de pasos.
- **En «Para un estudiante» la forma no cambia:** donde se oculta el selector de nivel, conserva su espacio o alinea las pestañas igual que en DUA, sin saltos al cambiar de pestaña.
  - No uses `visibility: hidden` en algo que pueda recibir el foco.

## 2. Panel de lo elegido en escritorio
**Solo si el ancho es de 80 rem o más,** y solo en «Para el curso (DUA)» cuando el paso 2 o el paso 3 están a la vista:
```
columna de 46 rem  ·  a la derecha, un panel fijo (position: sticky; top bajo la cabecera) de ~17 rem
Panel (aside aria-labelledby, título h2 «Lo que elegiste»):
  «3 elegidas para el curso»
  Antes · Durante · Después · En toda la clase   (solo los momentos con elegidas; títulos cortos, máximo 2 líneas cada uno)
  [Ir a tu selección]   (lleva el foco al título del paso 3; en el paso 3 dice [Ver documento] y abre el diálogo de documento)
Sin elegidas: «Todavía no eliges acciones.» y sin botón.
```
- **Con 80 rem o más, el panel reemplaza a la barra de continuar** en DUA: la barra se oculta mientras el panel está visible. En cualquier otro caso, la barra queda como hoy.
- **En el código, el panel va después de la columna,** para que el orden de lectura y de foco no cambie.
- **Se actualiza con el mismo render** que la mochila y la barra (`pintarSeleccion` o equivalente), y crea sus nodos con `el()`.
- **Con zoom alto o en ventanas angostas** (bajo 80 rem) desaparece solo.
- **En modo proyección no aparece.**
- No hay panel en «Para un estudiante» ni en «Práctica y trabajo».

## 3. Indicador de pasos en segmentos
- 3 segmentos iguales en una fila, de 44 px de alto, sin subrayado y con el texto «1 Describe», «2 Elige» y «3 Tu selección» (o «3 Acuerda»).
- **Paso actual:** fondo `--acento-suave`, texto en negrita `--acento-texto` y `aria-current="step"`.
- **Pasos hechos:** «✓» como texto antes del número.
- **Pasos pendientes:** texto `--tenue`.
- Siguen siendo enlaces que llevan al paso, con foco visible.
- Sin línea que los una.

## 4. Menos cajas
- **El filtro «Momento»** pierde su fondo gris. Sus botones conservan el borde de control (`--borde-control`), porque un control no puede quedar marcado solo por una superficie.
- **En el teléfono (bajo 34 rem),** los pasos (`.paso`) pierden su borde y su fondo, y se separan por espacio (al menos 24 px) y su título. En escritorio quedan como hoy.
- **La tarjeta elegida:**
  - en vez del borde azul completo y grueso, lleva el borde normal más una barra izquierda de 4 px `--acento` y el fondo `--acento-suave`;
  - el botón sigue diciendo «✓ Elegida»;
  - contraste del texto sobre ese fondo de 4,5:1 o más, en claro y oscuro.

## 5. Paso 1 en el teléfono
- **Bajo 30 rem,** las casillas de «¿Qué harán principalmente?» y «¿Cómo mostrarán lo que aprendieron?» van en 1 columna.
- **Cada casilla** con su etiqueta mide 44 px de alto o más, y ninguna etiqueta se parte en 2 líneas a 390 px.
- **Nuevo límite de altura del paso 1** a 390 px, con las necesidades plegadas: **860 px** (se estimó 720, pero con 16 px de aire bajo la ayuda, como pide la tarea 071, mide 856). El dueño aprobó el cambio.

## 6. Tamaños mínimos
- **Ningún texto visible** mide menos de 14 px (0,875 rem), en ningún ancho. Revisa `.t-arriba`, `.respaldo`, `.sel-momento` y las ayudas.
- **En el teléfono (bajo 34 rem),** miden 44 px de alto o más:
  - las casillas del paso 1;
  - el `summary` «Por qué funciona y fuentes»;
  - los botones «Elegir», «Quitar» y «Editar»;
  - los `summary` de las carpetas.

  En escritorio basta el mínimo de 24 px.

## 7. Errores
- **«Empieza por:»** (en «Para un estudiante»): las viñetas quedan alineadas con la primera línea de cada enlace, y las líneas siguientes empiezan bajo el texto, no bajo la viñeta (sangría con `padding-inline-start` y `list-style-position: outside`).
- **Espacio muerto:** a 390 px, el espacio entre el indicador de pasos y la bajada «Algo que haces para todo el curso.» es como máximo de 24 px.

## Pruebas
- **Reescribe sin debilitarlas** las pruebas de `scripts/probar_sistema_visual.cjs`, `probar_pagina.cjs` y otras que miden estilos que esta tarea cambia.
- **Agrega `scripts/probar_estetica.cjs`:**
  - a 1280 px, el ancho de la columna está entre 728 y 740 px, y el borde izquierdo del logo, del selector de nivel y del indicador está a ±2 px del de la columna. Lo mismo en «Para un estudiante», donde la pestaña activa no se mueve más de 2 px al cambiar de pestaña;
  - a 1280 px, en el paso 2 de DUA con 3 elegidas, el panel es visible, lista las 3 por momento y la barra de continuar está oculta. «Ir a tu selección» lleva el foco al título del paso 3;
  - a 1000 px, el panel no está y la barra sí. En el teléfono, igual;
  - en modo proyección, el panel no está;
  - en el DOM, el panel va después de la columna;
  - el indicador tiene `aria-current="step"` en el paso actual, sin subrayado, con 44 px de alto;
  - la tarjeta elegida tiene `border-left-width` de 4 px y su contraste de texto es de 4,5:1 o más, en claro y oscuro;
  - a 390 px:
    - las casillas del paso 1 tienen 1 columna, miden 44 px o más y ninguna etiqueta tiene 2 líneas;
    - el paso 1 mide 720 px o menos;
    - ningún texto visible mide menos de 14 px;
    - los controles de la sección 6 miden 44 px o más;
    - el espacio bajo el indicador es de 24 px o menos;
  - «Empieza por:»: la viñeta y la primera línea del enlace están alineadas, y la segunda línea empieza a ±2 px del inicio del texto de la primera;
  - sin desplazamiento horizontal a 390, 1000, 1280 y 1920 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

**Antes de cada commit,** descarta los archivos que las pruebas antiguas regeneran en `docs/marca/` y `docs/auditorias/`. En el pull request, agrega capturas antes y después a 390 y 1280 px, en claro y oscuro: DUA paso 1, DUA paso 2 con 3 elegidas y «Para un estudiante».

## Criterios de aceptación
- [ ] La columna mide 46 rem y la parte de arriba está alineada y no cambia de forma entre pestañas.
- [ ] El panel de lo elegido aparece solo desde 80 rem en los pasos 2 y 3 de DUA, y reemplaza a la barra sin duplicarla.
- [ ] El indicador de pasos son segmentos con el paso actual marcado y `aria-current`.
- [ ] Hay menos cajas: sin el gris de «Momento», sin bordes de paso en el teléfono y con la tarjeta elegida con barra izquierda.
- [ ] El paso 1 en el teléfono va en 1 columna, con casillas de 44 px y 720 px como máximo.
- [ ] No hay textos de menos de 14 px. Los controles frecuentes miden 44 px en el teléfono.
- [ ] «Empieza por:» está alineada y no queda el espacio muerto.
- [ ] Pasan el validador y todas las pruebas.
