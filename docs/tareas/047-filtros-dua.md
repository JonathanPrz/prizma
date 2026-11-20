# Tarea 047 · El DUA muestra para qué sirve cada acción, con opciones que describen la clase y colores de CAST

Estado: **v3, lista para Codex tras dos revisiones adversariales** · Asignada a: Codex · Rama: `codex/047-consideraciones` · Pull request con destino `main`

## Para qué
El dueño quiere que, al marcar lo que quiere resolver, Prizma le muestre **qué consideraciones DUA aplicar y cómo**, conservando las acciones, que le gustan. Además:
- las opciones de «¿Qué quieres resolver?» ponen el problema en los estudiantes y se pisan entre sí;
- los colores de los principios no son los de CAST.

**Lo que aprendimos de las revisiones:**
- El catálogo tiene **una acción por consideración en cada nivel** (el validador lo exige). Por eso no tiene sentido una tarjeta de consideración con una acción adentro: la consideración va **dentro de cada acción**.
- Con «Momento» o «Para qué» activos, un grupo puede quedar vacío. Por eso se muestra igual, con un aviso.

**Puedes cambiar `data/necesidades.json` y crear `data/consideraciones.json` como indica esta tarea.** No cambies `data/recomendaciones.json`, `docs/fuentes/` ni `.claude/`.

## Cambios

### 1. Opciones de «¿Qué quieres resolver?» (`data/necesidades.json`)
Describen el diseño de la clase. **Ninguna consideración ni dimensión se repite entre opciones.** Se conservan los `id` antiguos y se agrega `desafio`.

| id | Texto | Consideraciones | Dimensiones |
|---|---|---|---|
| `motivacion` | Las actividades no conectan con los intereses ni tienen un propósito claro para el curso | 7.1, 7.2, 7.3, 8.1 | — |
| `comprension` | La información se explica de una sola forma o supone conocimientos que no todos tienen | 1.2, 2.1, 2.5, 3.1 | 3, 13 |
| `tareas-largas` | Las tareas largas no tienen pasos visibles ni apoyos para organizarse | 5.3, 6.2, 6.3, 6.4 | 1 |
| `participacion` | La participación depende de una sola forma de interactuar | 8.3, 8.4 | 4, 11 |
| `lectoescritura` | Los materiales solo se pueden leer, ver o manipular de una forma | 1.1, 2.2, 4.1, 4.2, 5.2 | 2, 6, 8 |
| `evaluar` | Hay una sola forma de mostrar lo aprendido | 5.1, 5.4, 8.5 | 12 |
| `lengua-cultura` | Los materiales usan una sola lengua y una sola cultura | 1.3, 2.3, 2.4, 3.3 | 10 |
| `clima` | El ambiente de la sala genera tensión, distracciones o frustración | 7.4, 9.1, 9.2, 9.4 | 5, 7 |
| `desafio` (nueva) | La tarea tiene un solo nivel de desafío | 8.2, 3.4 | 14 |

Quedan sin opción 3.2, 6.1, 6.5 y 9.3, y la dimensión 9 (salud y energía). Siguen en «Las demás acciones».

**Compatibilidad:** los datos guardados cargan igual, pero cambian las consideraciones de `comprension`, `participacion`, `lectoescritura`, `evaluar` y `clima`. Dilo en el pull request y agrega una prueba de que un estado antiguo carga sin errores.

### 2. Paso 2 con opciones marcadas
- Crea `data/consideraciones.json` con 36 objetos `{ "id": "7.1", "que_busca": "…" }`. Copia «Qué busca» de la sección 8 de `docs/fuentes/dua-3.0.md`: es una síntesis propia, no texto de CAST. El título, el principio y la pauta se siguen obteniendo de `CONSIDERACIONES` y `proposito()` en `app.js`.
- Cárgalo con su propio `.catch`, como `cargaNecesidades`. Si falla, la página funciona sin la línea «Qué busca».
- Si hay al menos una opción marcada y guardada, el paso 2 empieza con **«Para lo que marcaste»** (`id="t-dua-marcadas"`):
  - un grupo por opción marcada, con el texto de la opción como subtítulo (`h3`);
  - dentro de cada grupo, las acciones de sus consideraciones, con la tarjeta de siempre: «Elegir», pasos, «por qué» y fuente;
  - en cada tarjeta, una línea nueva: «DUA 3.0, consideración 8.2 · Qué busca: …»;
  - dentro del grupo, las acciones se ordenan con el criterio actual de `primerasDua`: práctica (taller), actividad y evidencia marcadas;
  - si «Momento» o «Para qué» dejan un grupo sin acciones, el grupo se muestra con «Ninguna acción en este filtro» y un botón «Quitar filtros»;
  - en este bloque no se muestra la línea «Responde a: …», porque repite el subtítulo.
- Después va **«Las demás acciones»**, con la vista de hoy por momento, sin repetir las de arriba.
- «Para empezar» aparece solo cuando no hay opciones marcadas.
- El botón «Ver acciones para esto» de las barreras repetidas lleva el foco a `#t-dua-marcadas`. Si no existe, usa `#t-dua-empezar`, como hoy. Actualiza `probar_correcciones_botones.cjs`, que espera ese id.
- Jerarquía de títulos: «Para lo que marcaste» y «Las demás acciones» son `h3`. Las tarjetas mantienen su `h4`.

### 3. Colores de los principios
- **El logo no cambia.** Crea tres tokens nuevos para los principios: `--compromiso` (verde), `--representacion` (morado) y `--accion` (azul). Úsalos en los chips, las marcas de las tarjetas y el documento. El logo sigue usando `--motivar`, `--presentar` y `--mostrar`.
- El azul de `--accion` debe distinguirse de `--enfoque`, el color del foco y de lo seleccionado: usa un azul verdoso o más oscuro, distinto a simple vista.
- Contraste de 4,5:1 o más sobre `--superficie` y `--panel`, en los tres bloques de color (`:root`, oscuro por atributo y oscuro por preferencia). Una prueba lo mide.
- Los colores de los principios en el documento PDF también cambian a los nuevos, si los usa.
- Los chips de «Para qué» dicen «Compromiso», «Representación» y «Acción y expresión», con el nombre simple debajo en texto pequeño. Comprueba que no se desborden a 390 px.

### 4. «Momento» se mantiene
- El contador visible pasa a «11 · 1 coincide».
- Su nombre accesible es «Antes: 11 acciones, 1 coincide con lo que marcaste».
- Bajo «Momento» va la línea: «"Coincide" cuenta las acciones que responden a lo que marcaste en el paso 1».

### 5. Otros
- Ayuda de la meta: «Quita las barreras, no el desafío de aprender esto. La meta va a tu documento y te ayuda a elegir: Prizma no la usa para ordenar las acciones».
- «Proyectar al curso» pasa al inicio del paso 2.
- «Moverse o salir de la sala» pasa a «Moverse dentro de la sala».

## Pruebas
- `validar_catalogo.py` revisa que:
  - ninguna consideración se repita entre opciones;
  - cada dimensión de la 1 a la 14, salvo la 9, esté en exactamente una opción;
  - `consideraciones.json` tenga las 36 con texto.
- `probar_filtros_vista.cjs` comprueba que:
  - con una opción marcada aparecen arriba sus acciones, con la línea «Qué busca», y no se repiten abajo;
  - con «Momento» en un valor que vacía un grupo aparece el aviso;
  - «Ver acciones para esto» enfoca `#t-dua-marcadas` sin borrar filtros;
  - el contraste de los tres colores.
- Actualiza los scripts que usan los textos antiguos.
- Capturas en `docs/marca/047-consideraciones/`, a 1280 y 390 px, en tema claro y oscuro.

## Criterios de aceptación
- [ ] Marcar una opción muestra arriba sus acciones, cada una con su consideración y su «Qué busca».
- [ ] Ninguna consideración ni dimensión se repite. Los datos antiguos cargan.
- [ ] Colores de CAST con contraste AA en los dos temas, distintos del foco. El logo no cambia.
- [ ] Pasan el validador y todas las pruebas. No hay desplazamiento horizontal a 390 px.
