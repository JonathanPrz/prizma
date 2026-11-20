# Tarea 065 · Resultados DUA: recomendadas arriba, filtros que recortan y sin «Empieza por:»

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/065-resultados-dua` · Pull request con destino `main`

## Para qué
El dueño aprobó esta versión el 20-11-2026, después de dos revisiones adversariales y de una muestra en el lienzo de diseño.

En la página publicada, «Empieza por:» de DUA mostraba las tres primeras acciones del catálogo (1.1, 1.2 y 1.3) con el texto «Responden mejor a lo que describiste», que es falso. `primerasDua` ya no exige contexto, y en DUA las acciones empatan casi siempre: en 41 de 45 pares de contextos, el tercer lugar lo decide el número de la pauta. Además, los enlaces saltaban entre momentos.

El dueño quiere no mostrar todas las acciones siempre y que los filtros recorten de verdad. La revisión cuidó tres cosas:
- que nunca quede una pantalla vacía;
- que el contexto ordene, pero no excluya, para no sesgar la clase;
- que ningún cruce de filtros quede en 0.

**Adecuaciones y trabajo no cambian:** ahí «Empieza por:» se queda. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Reglas de los resultados DUA (`pintarTarjetas`)
Se llama **contexto** a lo marcado en actividad, evidencia o práctica; hay coincidencia cuando `coincidencias(r).length > 0`, o por práctica activa con `esPractica(r)`.

| Situación | Qué se muestra |
|---|---|
| **Sin necesidades, sin contexto y sin filtros** | Los grupos por momento, plegados, con su conteo: Antes, Durante, Después y En toda la clase. Nunca una pantalla vacía. |
| **Sin necesidades, con contexto y sin filtros** | Arriba, la sección **«Recomendadas para tu clase (N)»**, con N igual a las acciones que coinciden. Las 6 primeras van abiertas, ordenadas con `compararPertinenciaDua`. Si hay más, el botón «Ver las N−6 recomendadas restantes» muestra el resto en la misma lista, y luego el foco va a la primera recién mostrada. Debajo, **«Las demás acciones (M)»**, plegadas por momento. Ninguna acción aparece dos veces. |
| **Con necesidades** («¿Qué quieres resolver?») | Igual que hoy: «Para lo que marcaste», por necesidad, y «Las demás acciones». |
| **Con filtro de Momento** (uno o más) | Una **lista plana abierta** con las acciones que pasan los filtros, cruzadas con «Para qué» si hay. El cruce se aplica sobre todas las acciones del nivel, nunca solo sobre las recomendadas. Se ordena por momento y, dentro de cada uno, por pertinencia (`compararDua`). Con más de un momento, cada tarjeta muestra su momento. Las que coinciden con el contexto van primero y llevan su «Responde a lo que marcaste: …». |
| **Solo con filtro «Para qué»** | Grupos por momento **abiertos**, con solo las acciones de esos principios, entre 11 y 13 en total. |
| **Con necesidades y filtros** | Igual que hoy: grupos por necesidad, con «Ninguna acción en este filtro» y «Quitar filtros» si un grupo queda vacío. |

Además:
- **Se elimina «Empieza por:» en DUA:** el bloque, `primerasDua` si queda sin uso y el sufijo «· N responden a lo que marcaste» en los títulos de los momentos. El conteo general lo reemplaza.
- **«Recomendadas para tu clase» lleva un `h3`** con `id="t-dua-recomendadas"` y `tabindex="-1"`, y la ayuda «Responden a lo que marcaste en el paso 1, en orden de prioridad.» `guardarClase` lleva el foco a `#t-dua-marcadas`, a `#t-dua-recomendadas` o a `#acciones`, en ese orden.

## 2. Conteo y ayudas
- **`#conteo`**, que ya es `aria-live`, dice qué se está viendo:
  - sin filtros ni contexto: «36 acciones para todo el curso», con el `voc` de curso;
  - con contexto: «36 acciones · 18 responden a lo que marcaste»;
  - con filtros: «Antes y Compromiso: 4 acciones, 1 responde a lo que marcaste». Usa los nombres visibles de los filtros y omite la segunda parte si no hay contexto. Respeta singular y plural.
- **`#filtros-vista-ayuda`** pasa a «Elige un momento o un principio para ver menos acciones.»
- **`#limpiar-filtros`** («Quitar filtros») se ve solo cuando hay algún filtro activo.
- Al presionar un filtro, el foco se queda en el chip, como en la tarea 062, y la página no salta.

## 3. «Para qué» al mismo ancho que «Momento»
- **`#propositos`** es una grilla. En el teléfono (bajo unos 40rem de ancho del panel) va **en una columna a todo el ancho**: cada chip ocupa la fila, alineado a la izquierda, con el triángulo, el nombre en negrita y el texto corto al lado, en peso normal («▲ Compromiso Motivar»). En el computador va **en 3 columnas iguales**, que se alinean con «Antes», «Durante» y «Después».
- **«En toda la clase»** ya ocupa el ancho de la fila de momentos. Que mantenga el mismo alto y radio que los demás chips.

## 4. Proyección
«Proyectar al curso» muestra exactamente lo que se ve:
- con la sección de recomendadas y sin filtros, proyecta todas las recomendadas, no solo las 6;
- con filtros, proyecta las acciones filtradas;
- sin contexto ni filtros, proyecta todas, agrupadas por momento como hoy.

## 5. Detalle de la guía (de la revisión del PR #85)
En `index.html`, dentro de «En el trabajo» y bajo «Qué son», «la ley chilena los llama…» pasa a «La ley chilena los llama…».

## Pruebas
- Ajusta, sin debilitarlas, las pruebas que esperan la ayuda antigua, `#t-dua-empezar`, el sufijo de los títulos o el bloque «Empieza por» en DUA (`probar_filtros_vista.cjs`, `probar_pagina.cjs`, `probar_correcciones_botones.cjs` y las que fallen). En adecuaciones y trabajo, «Empieza por:» se sigue probando.
- Agrégalas a `scripts/probar_filtros_vista.cjs` o a `scripts/probar_pagina.cjs`:
  - en DUA no hay `.empieza-por`;
  - sin contexto ni filtros: 4 grupos plegados, sin tarjetas abiertas, y el conteo dice «36 acciones para todo el curso»;
  - con escribiendo y conversando: aparece «Recomendadas para tu clase (N)» con 6 tarjetas abiertas y el botón «Ver las N−6 recomendadas restantes». Ninguna recomendada se repite en «Las demás acciones», y la suma de las dos secciones da 36;
  - el botón muestra el resto, y el foco va a la primera recién mostrada;
  - con «Antes» y «Compromiso»: lista plana con 4 acciones, «Quitar filtros» visible y conteo «Antes y Compromiso: 4 acciones, …»;
  - con el contexto «Moverse» y el filtro «Antes», la lista no queda vacía, porque el cruce va sobre todas;
  - solo con «Compromiso»: grupos por momento abiertos con 13 acciones en total;
  - sin filtros, «Quitar filtros» no se ve;
  - a 390 px, los tres chips de `#propositos` miden lo mismo que el ancho de `#momentos`, con 2 px de tolerancia. A 1280 px, los tres miden lo mismo entre sí;
  - al proyectar con la sección de recomendadas, se proyectan las N;
  - el texto de la guía contiene «La ley chilena los llama»;
  - sin desplazamiento horizontal a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas a 390 y 1280 px de los tres estados: sin nada marcado, con contexto y con filtros.

## Criterios de aceptación
- [ ] DUA no tiene «Empieza por:». Con contexto, las recomendadas van arriba y el resto plegado, sin repetir.
- [ ] Los filtros recortan sobre todas las acciones, y ningún cruce queda vacío por culpa del contexto.
- [ ] El conteo dice qué se ve, y «Quitar filtros» aparece solo con filtros activos.
- [ ] «Para qué» tiene el mismo ancho que «Momento».
- [ ] La proyección muestra lo que se ve.
- [ ] Pasan el validador y todas las pruebas.
