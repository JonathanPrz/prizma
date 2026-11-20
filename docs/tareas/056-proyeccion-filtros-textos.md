# Tarea 056 · Proyección visible, filtros DUA más claros y textos ordenados

Estado: **integrada** (PR #76) · Asignada a: Codex · Rama: `codex/056-proyeccion-filtros` · Pull request con destino `main`

## Para qué
Son decisiones del dueño del 20-11-2026, tomadas después de una revisión adversarial. Son cinco cambios pequeños en «Para el curso (DUA)» y en algunos textos.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Modo proyección que se note, en pantalla completa
Hoy «Proyectar al curso» solo oculta la mochila y los avisos de apoyos individuales. Sin estudiantes cargados no cambia nada visible, y parece que no funciona.

Al presionarlo:
- **Pide pantalla completa** con `document.documentElement.requestFullscreen()`, dentro de `try/catch`. Si falla o no existe (por ejemplo, en iPhone), el modo funciona igual, sin pantalla completa.
- **Muestra solo las acciones DUA** que están visibles con los filtros actuales: título, «Qué busca», principio y pasos.
- **Oculta:**
  - la cabecera, el selector de nivel y las pestañas;
  - el indicador de pasos, el paso 1, los filtros y la barra de abajo;
  - los botones «Elegir» y «Agregar al curso», y «Por qué funciona y fuentes»;
  - la mochila y todo lo que hoy ya oculta: conteos y avisos de estudiantes.
- **Agranda la letra** un 25 %, con `font-size: 125%` en `html.proyectando`. Así se lee desde el fondo de la sala.
- **Muestra una franja fija arriba**, con el texto «Modo proyección: se ocultan los datos de estudiantes» y el botón «Salir de proyección». El foco va a ese botón.
- **Para salir:** con el botón o con Esc. Si la persona sale de pantalla completa con Esc, también se sale del modo: escucha `fullscreenchange`. Al salir, el foco vuelve a «Proyectar al curso».
- Respeta `prefers-reduced-motion`: sin animaciones.

## 2. Filtro «Momento» como línea de tiempo y sin conteos
- **Distribución:** «Antes», «Durante» y «Después» van en una fila de tres columnas iguales. Debajo, «En toda la clase» ocupa el ancho de las tres, porque dura toda la clase. A 390 px se mantiene la misma distribución: si no cabe, los tres botones bajan su relleno, nunca su alto mínimo de 44 px.
- **Quita los conteos** de los botones de momento, por ejemplo «(11)» y «· 3 coincide». El número ya está en el título de cada grupo.
- El `aria-label` queda solo con el nombre del momento.
- Quita la ayuda «"Coincide" cuenta las acciones…» (`#momento-ayuda`) y su referencia en `aria-describedby`.

## 3. «Consideración 7.1» en vez de «DUA 7.1» y de «DUA 3.0, consideración…»
DUA 3.0 ya se dice en las fuentes. En la tarjeta DUA (`tarjeta()` en `app.js`):
- la etiqueta de arriba (`abbr.t-dua`) dice «Consideración 7.1». Su `title` sigue con el nombre completo de la consideración;
- la línea `t-que-busca` dice solo «Qué busca: …»;
- el documento PDF no cambia: sigue citando «DUA 3.0, consideración 7.1».

## 4. Triángulo de color en el filtro «Para qué»
- Cada botón de `#propositos` lleva el mismo triángulo (`span.tri`, `aria-hidden="true"`) que las tarjetas, antes del nombre del principio y con su color: `--compromiso`, `--representacion` o `--accion`.
- Agrega en `styles.css` las reglas `.chip.motivar .tri`, `.chip.presentar .tri` y `.chip.mostrar .tri`, junto a las de `.t-proposito`.
- El nombre del principio sigue escrito: el color no basta para distinguir el morado del azul petróleo con daltonismo.

## 5. Textos ordenados
| Dónde | Hoy | Queda |
|---|---|---|
| `index.html` y `app.js` (`#agregar-estudiante`, `#agregar-trabajador`) | «+ Agregar otro caso» | «Agregar otro caso». Si se quiere el signo, va en un `span` con `aria-hidden="true"` |
| `index.html` (`#limpiar-filtros`) | «Limpiar filtros» | «Quitar filtros», igual que el botón de `app.js` |
| `index.html` (`#quitar-trabajador`, texto inicial) | «Quitar caso» | «Quitar a Persona 1», igual que lo que pone `app.js` |
| `index.html` (`#respaldo-ayuda`) | «El respaldo incluye todos los datos de Educación y Trabajo en un solo archivo. Sirve para no perderlos o pasarlos a otro computador.» | «El respaldo guarda los datos de Educación y de Práctica y trabajo en un archivo. Úsalo para no perderlos o pasarlos a otro computador.» |
| `index.html` (ayuda bajo `#pdf`) | «Revisa tu documento y después descárgalo en PDF o imprímelo.» | «Revisa el documento y descárgalo en PDF o imprímelo.» |

«Mi mochila» no cambia.

## Pruebas
- Las pruebas actuales siguen pasando. Ajusta solo las que comparan los textos o conteos que cambian, sin debilitarlas.
- Agrégalas a `scripts/probar_pagina.cjs` o crea `scripts/probar_proyeccion.cjs`:
  - al proyectar, `html` tiene `proyectando`, la cabecera, los filtros, la barra y los botones «Elegir» no se ven, y el foco está en «Salir de proyección»;
  - Esc y «Salir de proyección» quitan el modo y devuelven el foco a «Proyectar al curso»;
  - si `requestFullscreen` falla, el modo se activa igual. Simúlalo con un reemplazo que rechace;
  - los botones de momento no tienen números, y «En toda la clase» mide lo mismo que la fila de los otros tres, con 2 px de tolerancia, a 390 y 1280 px;
  - una tarjeta DUA muestra «Consideración » seguido del número, y su «Qué busca» no contiene «DUA 3.0»;
  - cada botón de `#propositos` tiene un `.tri` con un color de fondo distinto de transparente;
  - sin desplazamiento horizontal a 390 px, también en modo proyección.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La proyección se nota, usa pantalla completa cuando se puede y se sale con Esc.
- [ ] El momento se ve como línea de tiempo, sin conteos.
- [ ] Las tarjetas dicen «Consideración 7.1» y «Qué busca: …».
- [ ] Los filtros «Para qué» tienen su triángulo de color.
- [ ] Los textos de la tabla cambiaron.
- [ ] Pasan el validador y todas las pruebas.
