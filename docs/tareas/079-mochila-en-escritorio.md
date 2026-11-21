# Tarea 079 · Una sola mochila: panel fijo en escritorio y diálogo en el teléfono

Estado: **integrada** (PR #101) · Asignada a: Codex (lo implementó un agente de Claude) · Rama: `codex/079-mochila-escritorio` · Pull request con destino `main`

## Para qué
El dueño dijo: «siento que la mochila y esta columna nueva cumplen una función similar». Hoy hay dos lugares con lo elegido:
- **el panel «Lo que elegiste»** (tareas 076 y 078): en escritorio, solo con el contexto activo;
- **«Mi mochila»** (tarea 070): un diálogo con todo, más quitar, notas, documento y respaldo.

Un consejo de 4 especialistas (21-11-2026), formado por diseño de experiencia, docente, accesibilidad y abogado del diablo, votó 3 a 1 por fusionarlos. Dos lugares obligan a preguntarse cuál es el de verdad, y para el lector de pantalla son dos listas y dos lugares donde quitar. El dueño aprobó:
1. la fusión;
2. que el botón de avanzar vuelva a la barra de abajo en todos los anchos;
3. un ancho de 24 rem.

**El riesgo que señaló el abogado del diablo:** dos comportamientos según el ancho. Se cubre con un solo render y pruebas en los dos anchos.

No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## 1. Un solo contenido, dos contenedores
- **Desde 80 rem** (`matchMedia("(min-width: 80rem)")`), «Mi mochila» se muestra como panel lateral fijo de **24 rem**, junto a la columna de **46 rem**, que no se achica.
  - Es un `aside` no modal, con `aria-labelledby` a su título «Mi mochila».
  - Va **después** del contenido principal en el DOM y queda a la derecha con grid.
  - No atrapa el foco ni se cierra con Esc.
  - Es `position: sticky`, con altura máxima igual a la de la ventana y su propio desplazamiento interno.
- **Bajo 80 rem,** es el `<dialog id="mochila">` de hoy, con `showModal()`, foco al título, Esc para cerrar y foco de vuelta al botón.
- **El mismo nodo y el mismo render** (`pintarSeleccion`) sirven en los dos anchos, sin ids duplicados. Al cruzar los 80 rem, el nodo se mueve entre los dos contenedores. Si el diálogo estaba abierto, se cierra y el foco vuelve a «Mi mochila (N)».
- **El botón «Mi mochila (N)» de la cabecera:**
  - en escritorio lleva el foco al título del panel y lo desplaza a la vista; se describe con `aria-controls`, sin `aria-haspopup`;
  - en el teléfono abre el diálogo, como hoy, con `aria-haspopup="dialog"`.
- **Se borra el panel «Lo que elegiste»** (`#panel-elegidas`, `pintarPanelElegidas`, `#panel-ir` y sus estilos). Ningún contenido queda duplicado.
- **Desaparece en modo proyección,** como hoy el panel.

## 2. Contenido de la mochila, en orden
```
Mi mochila (N)                                    [Cerrar]   ← «Cerrar» solo en el diálogo
Nivel: Educación básica                                       ← nivel del curso en DUA, o del caso activo
Acuerdo: Por revisar                                          ← solo en un caso (estadoCaso)
── Ámbito activo, abierto ──
  DUA: «Para todo el curso», por momento: título · [Quitar] · «Nota: … · Editar en el paso 3» (como hoy)
  Caso activo: «Apoyos para JP» por tipo: título · [Quitar] · ▸ Agregar nota (como hoy)
── Otros casos del ámbito, plegados ──
  <details> «MA · 3 apoyos» (abre la lista de ese caso, igual que el activo)
[Ver documento]
▸ Datos y respaldo   (plegado; como hoy)
Vacía: «Todavía no eliges nada. Lo que elijas aparece aquí.»
```
- **En DUA,** el curso va abierto y los casos de estudiantes van plegados.
- **En «Para un estudiante»,** el caso activo va abierto, y el curso y los demás casos, plegados.
- **«Práctica y trabajo»** sigue mostrando solo su ámbito, como hoy, con la misma regla.
- **Grupos:** cada uno con un título `h3` (o `h4` dentro de un caso). Objetivos de 24 px o más; de 44 px en el teléfono, como en la tarea 076.

## 3. Quitar y notas
- **Al quitar,** el foco pasa al siguiente «Quitar» del mismo grupo o, si no queda ninguno, al título de la mochila. Una región `aria-live="polite"` dice: «Quitaste <título>. Quedan N.».
- **Las notas** funcionan como hoy. En el panel, el textarea cabe en 24 rem sin desplazamiento horizontal.

## 4. Botón de avanzar
- **La barra de continuar** (`#barra-continuar`) se ve en todos los anchos y pasos, como antes de la tarea 076. Se quita la regla que la ocultaba cuando el panel estaba visible.
- **La mochila no tiene botón de avanzar paso.**

## Pruebas
**Agrega `scripts/probar_mochila_panel.cjs`.**

A 1280 px:
- `#mochila` es visible sin abrirlo, mide 384 px (±2) y no es modal;
- la columna mide 736 px (±2);
- no existe `#panel-elegidas`;
- la barra de continuar es visible;
- «Mi mochila (N)» lleva el foco al título del panel;
- con 2 casos, el activo está abierto y el otro plegado, con «… · N apoyos»;
- quitar una acción mueve el foco y anuncia «Quitaste …»;
- el panel va después del contenido principal en el DOM;
- en modo proyección no se ve.

A 1000 px y a 390 px:
- `#mochila` está cerrado;
- el botón lo abre como diálogo modal;
- Esc lo cierra y devuelve el foco.

Al cambiar el ancho de 1280 a 1000 px con el panel visible, y de 1000 a 1280 px con el diálogo abierto: sin errores, sin ids duplicados y con el foco en un lugar visible.

Sin desplazamiento horizontal a 390, 1000, 1280 y 1920 px.

**Reescribe, sin debilitarlas,** las pruebas de las tareas 070, 076 y 078 que usan `#panel-elegidas`, `#panel-ir` o la barra oculta, y las que abren la mochila con un clic a 1280 px.

**Corre** `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. Antes de cada commit, descarta los archivos que las pruebas antiguas regeneran en `docs/marca/` y `docs/auditorias/`.

**En el pull request,** agrega capturas a 1280 px:
- DUA paso 2 con 3 elegidas;
- «Para un estudiante» con 2 casos;
- en modo oscuro.

Y a 390 px, el diálogo abierto.

## Criterios de aceptación
- [ ] Existe una sola mochila: un panel fijo de 24 rem en escritorio y un diálogo bajo 80 rem, con el mismo contenido y sin duplicados.
- [ ] El ámbito y el caso activos van abiertos; los demás, plegados con su conteo.
- [ ] Quitar mueve el foco y lo anuncia.
- [ ] La barra de avanzar se ve en todos los anchos.
- [ ] Pasan el validador y todas las pruebas.
