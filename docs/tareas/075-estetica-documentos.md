# Tarea 075 · Estética del plan completo y del resumen para la familia

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/075-estetica-documentos` · Pull request con destino `main`

**Hazla después de integrar la tarea 074.** Toca las mismas funciones.

## Para qué
Lo decidió el mismo consejo de la tarea 074, a partir de la propuesta de diseño de documentos, y el dueño lo aprobó.

En los PDF de hoy todo es negro y gris, y los títulos casi no se distinguen del texto. Roboto, la fuente de pdfmake, hace débil la negrita, así que **la jerarquía se marca con tamaño, color y filetes, no con negrita**. El resumen para la familia deja media hoja en blanco y sus secciones no tienen aire.

No cambies `data/`, `docs/fuentes/` ni `.claude/`, y no agregues fuentes ni dependencias. **Solo cambia el estilo:** el contenido y el orden quedan como los dejó la tarea 074.

## 1. Plan completo (`definicionPdf()`)
- **Márgenes:** 51 pt a los lados, 60 arriba y 54 abajo.
- **Cuerpo:** 10,5 pt, color #1a2134, `lineHeight` 1,15.
- **h1:** 22 pt. Debajo, un filete #2456d6 de 1,5 pt de grosor y 40 pt de largo (un `canvas` con una línea).
- **h2:** 15 pt, color #2456d6, margen [0, 14, 0, 6].
- **h3:** 11,5 pt, color #1a2134.
- **Todos los títulos** llevan `keepWithNext`, para que nunca queden solos al final de una página.
- **Línea del dato:** 8,5 pt, color #4f586e.
- **Tablas:**
  - encabezado con fondo #e8eefc;
  - líneas #c9d0e0;
  - `headerRows: 1`, para que el encabezado se repita si la tabla sigue en otra página.
- **«Mi nota»:** fondo #f2f2f2 y un borde izquierdo azul de 2 pt.
- **Espacio entre fichas:** 9 pt, hoy 12.
- **Blanco y negro:** el azul de los títulos debe seguir leyéndose. #2456d6 sobre blanco tiene un contraste mayor que 4,5:1.

## 2. Vista `#hoja`
Aplica la misma jerarquía en `styles.css`, en las clases de la hoja: filete bajo el h1, h2 en el color de acento y encabezados de tabla con fondo suave.
- **Usa los tokens existentes** (`--acento`, `--acento-suave`, `--tinta`, `--tenue`). Si no hay uno adecuado, agrega uno en `:root`, en modo claro y oscuro.
- **En `@media print`,** la hoja se imprime con los colores del modo claro.

## 3. Resumen para la familia (`pdfResumenFamilia()` y su vista)
- **Márgenes:** 51 pt.
- **Cuerpo:** 12 pt, `lineHeight` 1,25.
- **Título** («Apoyos para SP»): 24 pt, color #2456d6.
- **Secciones:** 14 pt, con 16 pt de aire arriba.
- **La aclaración de la tarea 073:** 10 pt, color #4f586e.
- **«Lo que acordamos para la casa»:** si van líneas en blanco, son trazos de 0,5 pt, separados 22 pt, del ancho del texto.
- **Cuadro final:** «Próxima conversación» y «Qué esperamos ver» van en un cuadro con fondo #f4f6fc y borde #2456d6 de 1 pt.
- **El caso de referencia de la tarea 074,** con 6 apoyos visibles, sigue cabiendo en **1 página**.

## Pruebas
Ajusta las pruebas de estructura del PDF (`scripts/probar_estudiantes.cjs` y otras) sin debilitarlas. Agrega en `scripts/probar_acuerdos.cjs`, o en una prueba nueva:
- los márgenes y tamaños de la definición coinciden con esta tarea;
- los h2 usan #2456d6;
- los títulos tienen `keepWithNext`;
- las tablas tienen `headerRows: 1`;
- el resumen para la familia del caso de referencia tiene 1 página;
- el plan del caso de referencia no tiene más páginas que después de la tarea 074. Informa ambos números en el pull request.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, adjunta imágenes del plan (páginas 1 y 2) y del resumen, en color y convertidas a escala de grises.

## Criterios de aceptación
- [ ] El plan y el resumen tienen jerarquía clara con tamaño, color y filetes, y se leen bien en blanco y negro.
- [ ] La vista `#hoja` sigue la misma jerarquía con los tokens de la web.
- [ ] El resumen del caso de referencia sigue en 1 página, y el plan no crece.
- [ ] Pasan el validador y todas las pruebas.
