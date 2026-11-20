# Tarea 061 · Selectores de frecuencia más livianos y dos detalles de Práctica y trabajo

Estado: **integrada** (PR #82) · Asignada a: Codex · Rama: `codex/061-selectores-frecuencia` · Pull request con destino `main`

## Para qué
El dueño encontró «muy grandes» los selectores de frecuencia del paso 1. Mediciones en `main` (Chromium):
- cada opción es una caja de 189 × 44 px en escritorio, con borde de 1,5 px `--borde-control` y letra de 16 px;
- con 4 cajas por situación, un área con tres situaciones muestra 12 cajas;
- la jerarquía queda invertida: las respuestas pesan más que el título de la situación, y el botón del área va en 14 px, más chico que sus situaciones (16 px).

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.** Mantén los radios nativos, la navegación con flechas y el comportamiento de la tarea 058.

## 1. Un control segmentado por situación
- `.frecuencias` se ve como **un solo control**:
  - un borde exterior de 1 px `--borde-control` con `border-radius: .5rem`;
  - líneas divisorias de 1 px `--linea` entre opciones;
  - sin bordes propios en cada `label` ni separación (`gap: 0`).
- **Alto 36 px** y letra de 14 px (`.875rem`), peso 600. El objetivo táctil sigue sobre los 24 px que exige el proyecto.
- **Ancho según el contenido:** `display: inline-grid` (o `width: max-content`) con 4 columnas iguales, alineado a la izquierda. Ya no se estira a toda la columna. Cada opción mide al menos 5.5rem.
- **En el teléfono:** una sola fila de 4 si cabe. Bajo unos 22rem de ancho disponible, una grilla de 2×2 compacta con el mismo borde exterior. Sin desplazamiento horizontal a 390 px.
- **Marcado:** fondo `--acento-suave`, texto `--acento-texto` y ✓, sin borde propio para no romper el control; usa `box-shadow: inset 0 0 0 2px var(--acento)`. «No aplica» marcado sigue neutro, con texto `--tinta` en peso 600.
- **Foco:** `:focus-visible` en la celda, con un anillo de 3 px `--enfoque` que no quede cortado por el borde redondeado.

## 2. Jerarquía del acordeón
- El botón de cada área (`.area-descripcion > .boton`) usa el tamaño de subtítulo: 17 px (`1.0625rem`) en peso 700.
- El título de cada situación (`legend`) queda en 16 px y peso 600, y su frase de ejemplo en 14 px `--tenue`.
- Entre una situación y la siguiente hay 16 px de separación, y entre áreas, 24 px.

## 3. Dos detalles de «Práctica y trabajo» (de la revisión del PR #81)
- **Estado en el bloque de la práctica.** En `#trabajo-historia-estado`, el texto pasa de solo el estado («Sin acuerdos») a «Estado del acuerdo de la práctica: Sin acuerdos».
- **Casos con las mismas iniciales.** En `#trabajo-agregar-ayuda` («Completa los acuerdos de: JP, JP»), si dos casos tienen las mismas iniciales, se agrega la etapa entre paréntesis: «JP (práctica), JP (primer empleo)». Usa ese mismo nombre en cualquier lista de casos de Trabajo donde se repitan las iniciales.

## Pruebas
- Las pruebas actuales siguen pasando, incluidas las de la tarea 058 (radios nativos, flechas, «No aplica» neutro y grilla sin desplazamiento).
- Agrégalas a `scripts/probar_pagina.cjs`:
  - una opción de frecuencia mide entre 32 y 40 px de alto y tiene letra de 14 px;
  - a 1280 px, el ancho de `.frecuencias` es de 520 px o menos;
  - los `label` no tienen borde propio, y el contenedor tiene un solo borde exterior;
  - el botón de un área tiene letra mayor que el título de sus situaciones;
  - a 390 px no hay desplazamiento horizontal, y las 4 opciones son visibles sin cortarse;
  - en un caso de trabajo vinculado, `#trabajo-historia-estado` empieza con «Estado del acuerdo de la práctica:»;
  - con una práctica JP y su primer empleo JP pendientes, la ayuda dice «JP (práctica), JP (primer empleo)».

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas de un área abierta a 390 y 1280 px, antes y después, en claro y oscuro.

## Criterios de aceptación
- [ ] Cada situación tiene un control segmentado compacto, que no se estira y pesa menos que su título.
- [ ] El nombre del área se lee por encima de sus situaciones.
- [ ] Los dos detalles de Práctica y trabajo están corregidos.
- [ ] Pasan el validador y todas las pruebas.
