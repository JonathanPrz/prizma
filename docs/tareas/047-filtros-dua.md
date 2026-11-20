# Tarea 047 · El DUA recomienda consideraciones, con opciones que describen la clase y colores de CAST

Estado: **propuesta v2, pendiente de revisión adversarial y aprobación del dueño** · Asignada a: Codex · Rama: `codex/047-consideraciones` · Pull request con destino `main`

## Para qué
El dueño quiere que, al marcar lo que quiere resolver, Prizma le recomiende **consideraciones DUA que pueda aplicar**, cada una con su forma de hacerlo. Hoy el resultado es una lista de 42 acciones ordenadas. Además:
- las opciones de «¿Qué quieres resolver?» ponen el problema en los estudiantes y se pisan entre sí;
- los colores de los principios no son los de CAST.

La v1 de esta tarea fue rechazada por una revisión adversarial: no cumplía el objetivo, repetía 10 consideraciones entre opciones y asignaba mal algunas.

**Puedes cambiar `data/necesidades.json` y crear `data/consideraciones.json` como indica esta tarea.** No cambies `data/recomendaciones.json`, `docs/fuentes/` ni `.claude/`.

## Cambios

### 1. Opciones de «¿Qué quieres resolver?» (`data/necesidades.json`)
Describen el diseño de la clase, no a los estudiantes. **Ninguna consideración se repite entre opciones.** Se conservan los `id` antiguos. Se agrega una opción nueva, `desafio`.

| id | Texto | Consideraciones | Dimensiones |
|---|---|---|---|
| `motivacion` | Las actividades no conectan con los intereses ni la vida del curso | 7.1, 7.2, 7.3, 8.1 | — |
| `comprension` | La información llega de una sola forma o supone conocimientos que no todos tienen | 1.2, 2.1, 2.5, 3.1 | 3, 6, 13 |
| `tareas-largas` | Las tareas largas no tienen pasos visibles ni apoyos para organizarse | 5.3, 6.2, 6.3, 6.4 | 1 |
| `participacion` | La participación depende de una sola forma de interactuar | 8.3, 8.4, 9.4 | 4, 11 |
| `lectoescritura` | Leer, escribir o manipular es la única vía para aprender o responder | 1.1, 2.2, 4.1, 4.2 | 2, 8 |
| `evaluar` | Hay una sola forma de mostrar lo aprendido | 5.1, 5.2, 5.4, 8.5 | 12 |
| `lengua-cultura` | Los materiales usan una sola lengua y una sola cultura | 1.3, 2.3, 2.4, 3.3 | 10 |
| `clima` | El ambiente de la sala genera tensión, distracciones o frustración | 7.4, 9.1, 9.2 | 5, 7 |
| `desafio` (nueva) | La tarea tiene un solo nivel de desafío | 3.4, 6.1, 8.2 | 14 |

Quedan sin opción 3.2, 6.5 y 9.3, y la dimensión 9. Siguen apareciendo entre «las demás acciones».

**Compatibilidad:** los datos guardados con estos `id` cargan igual, pero `clima` y `evaluar` cambian sus consideraciones. Dilo en el pull request y agrega una prueba de que un estado antiguo carga sin errores.

### 2. Consideraciones arriba (`data/consideraciones.json` y la pestaña DUA)
- Crea `data/consideraciones.json` con las 36 consideraciones: `id`, `principio` (compromiso, representacion, accion), `pauta`, `titulo` (el mismo de `CONSIDERACIONES` en `app.js`) y `que_busca`. Copia «Qué busca» de la sección 8 de `docs/fuentes/dua-3.0.md`: es una síntesis propia de Prizma, no texto de CAST.
- Valida el archivo al cargarlo, como el catálogo. Si falla, la pestaña funciona igual que hoy, sin el bloque de consideraciones.
- Si hay al menos una opción marcada y guardada, el paso 2 empieza con **«Consideraciones para lo que marcaste»**:
  - una tarjeta por consideración que responde, en el orden de la tabla;
  - en cada tarjeta, el número y el título, el color de su principio, el «Qué busca» y debajo sus acciones, con su botón «Elegir» de siempre;
  - respeta los filtros «Momento» y «Para qué»: si una consideración no tiene acciones visibles con el filtro activo, no se muestra;
  - después va «Las demás acciones», con la vista de hoy por momento, sin repetir las que ya aparecieron arriba.
- Sin opciones marcadas, el paso 2 queda como hoy.
- «Para empezar» se mantiene solo cuando no hay opciones marcadas. Con opciones marcadas, su función la cumple el bloque de consideraciones.

### 3. Colores y nombres de los principios
- Los colores siguen a CAST: **verde** para Compromiso, **morado** para Representación y **azul** para Acción y expresión. Cambia los valores de `--motivar`, `--presentar` y `--mostrar` en `styles.css`, en modo claro y oscuro.
- Contraste de 4,5:1 o más sobre `--superficie` y sobre `--panel`, en los dos temas. Una prueba lo mide.
- Los chips de «Para qué» muestran el nombre oficial y, debajo, el nombre simple: «Compromiso · motivar», «Representación · presentar» y «Acción y expresión · expresarse y organizarse».

### 4. «Momento» se mantiene
Sigue como filtro, porque ordena la planificación. Cambia «(11 · 1 para ti)» por «(11 · 1 coincide)». Bajo «Momento» va la línea: «"Coincide" cuenta las acciones que responden a lo que marcaste en el paso 1».

### 5. La meta y «Proyectar al curso»
- Ayuda de la meta: «Quita las barreras, no el desafío de aprender esto. La meta va a tu documento y te ayuda a elegir: Prizma no la usa para ordenar las acciones».
- «Proyectar al curso» pasa al inicio del paso 2. En proyección, el bloque de consideraciones se muestra sin conteos.
- «Moverse o salir de la sala» pasa a «Moverse dentro de la sala».

## Pruebas
- `validar_catalogo.py` revisa que:
  - ninguna consideración se repita entre opciones;
  - cada dimensión de la 1 a la 14, salvo la 9, esté en exactamente una opción;
  - `consideraciones.json` tenga las 36 y coincida con `CONSIDERACIONES`.
- `probar_filtros_vista.cjs`:
  - con una opción marcada aparecen sus consideraciones y sus acciones arriba, y no se repiten abajo;
  - el bloque respeta «Momento» y «Para qué»;
  - el contraste de los tres colores.
- Actualiza los scripts que usan los textos antiguos: `probar_filtros_vista.cjs`, `probar_flujo_avisos.cjs` y otros.
- Capturas en `docs/marca/047-consideraciones/`, a 1280 y 390 px, en tema claro y oscuro.

## Criterios de aceptación
- [ ] Marcar una opción muestra arriba sus consideraciones, cada una con su «Qué busca» y sus acciones.
- [ ] Ninguna consideración ni dimensión se repite entre opciones. Los datos antiguos cargan.
- [ ] Colores de CAST con contraste AA en los dos temas.
- [ ] Pasan el validador y todas las pruebas. No hay desplazamiento horizontal a 390 px.
