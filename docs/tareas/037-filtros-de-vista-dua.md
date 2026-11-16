# Tarea 037 · DUA: «Momento» y «Para qué» pasan a ser filtros de vista en el paso 2

Estado: **integrada** (PR #37) · Asignada a: Codex · Rama: `codex/037-filtros-vista`

## Para qué
El dueño observó que «¿Cuándo?» y «¿Para qué?» no describen la clase. Son filtros para recorrer las acciones por partes, y se cambian varias veces mientras se planifica. Hoy están en el paso 1, que exige «Guardar», y eso obliga a reabrirlo cada vez. Ver `docs/arquitectura.md`, sección 7.

**No cambies `data/`, `docs/fuentes/`, `docs/arquitectura.md` ni `.claude/`.**

## Cambios
1. **Quita del paso 1 «Describe tu clase»** los campos «¿Cuándo?» (`#momentos`) y «¿Para qué?» (`#propositos`). El paso 1 queda con la meta, «¿Qué quieres resolver?», la casilla de taller y «Más detalles», y se sigue guardando como hoy. Su resumen ya no menciona momentos ni propósitos.
2. **Barra de filtros arriba del paso 2 «Acciones sugeridas»:**
   - **«Momento»:** botones con `aria-pressed` para Antes, Durante, Después y En toda la clase (con `data-voc`), cada uno con su conteo. Si hay necesidades marcadas, el conteo agrega «· N para ti», como hoy.
   - **«Para qué»:** botones con `aria-pressed` para Motivar, Presentar y Expresarse y organizarse.
   - Ayuda única: «Si no eliges ninguno, se muestran todos».
   - El enlace «Limpiar filtros» limpia solo estos dos filtros.
   - **Funcionan al instante**, sin «Guardar». Los resultados y el conteo se actualizan y se anuncian con `aria-live`.
   - Se guardan en `estado.momentos` y `estado.propositos`, como hoy (validados y respaldados).
3. **«Para empezar» respeta los filtros de vista:** las 3 acciones más pertinentes entre las que cumplen el filtro. Si quedan 3 o menos, no se muestra la sección.
4. **Guardar el paso 1 no borra los filtros de vista.** «Limpiar» del paso 1 limpia solo lo del paso 1.
5. **El indicador de pasos y la barra inferior del teléfono** siguen funcionando. En el teléfono, la barra de filtros puede desplazarse horizontalmente dentro de su contenedor, pero la página no.
6. **PDF:** los datos del curso ya no listan momentos ni propósitos como parte de la descripción de la clase.

## Criterios de aceptación
- [ ] El paso 1 ya no contiene «¿Cuándo?» ni «¿Para qué?».
- [ ] En el paso 2, marcar «Durante» filtra al instante, sin guardar, y «Para empezar» muestra acciones de «Durante».
- [ ] Guardar o editar el paso 1 conserva los filtros de vista. «Limpiar filtros» del paso 2 los quita.
- [ ] Teclado, foco visible y lector de pantalla en los botones de filtro. Objetivos de al menos 24 px.
- [ ] Sin desplazamiento horizontal de la página a 390 px. Capturas en `docs/marca/037-filtros/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. Ajusta las que esperaban los filtros en el paso 1.
- [ ] El pull request apunta a `main`.
