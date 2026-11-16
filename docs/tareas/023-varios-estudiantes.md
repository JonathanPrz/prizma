# Tarea 023 · Varios estudiantes, y que sus barreras conversen con el DUA

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/023-varios-estudiantes`

## Para qué

Hoy la página guarda un solo estudiante. Si un docente trabaja con dos, los datos del segundo pisan los del primero. Además, Mi mochila guarda en una sola lista las acciones del curso y los apoyos individuales: los apoyos de un estudiante aparecen en el PDF de otro. En un PACI eso es grave.

El dueño quiere además que los apoyos individuales **conversen con el DUA**: si una barrera se repite en varios estudiantes, es probable que esté en el diseño de la clase, y conviene responderla para todo el curso (DUA 3.0).

Claude agregó a cada necesidad de `data/necesidades.json` el campo `dimensiones`: las situaciones de los estudiantes que se relacionan con esa necesidad del DUA. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Modelo de datos
- `estado.estudiantes`: lista de hasta **10** estudiantes. Cada uno es `{ id, iniciales, dimensiones, ayuda, voz, seleccion }`. `seleccion` tiene solo fichas que no son DUA, con su nota.
- `estado.estudianteActivo`: `id` del estudiante que se edita.
- `estado.seleccion` queda **solo con acciones DUA**.
- El `id` es interno, generado con `crypto.randomUUID()` o un contador. No se muestra.
- Valida todo al cargar, igual que hoy `normalizarEstudiante()`.

**Migración**, al cargar `localStorage` y al abrir un respaldo antiguo:
- Si hay `estado.estudiante` sin `estudiantes`, crea un primer estudiante con esos datos.
- Mueve a su `seleccion` las fichas no DUA de `estado.seleccion`. Las DUA quedan en `estado.seleccion`.
- Un estudiante vacío, sin iniciales ni datos, también vale.
- Los respaldos nuevos usan `version: 2` con `estudiantes`. Se siguen aceptando respaldos `version: 1`.

## Cambios en la página
1. **Selector de estudiantes** al inicio de los filtros de la pestaña de apoyos:
   - Botones con `aria-pressed`, uno por estudiante. Muestran las iniciales, o «Estudiante 1», «Estudiante 2»… si no tienen.
   - El botón «+ Agregar estudiante» crea uno vacío y lo deja activo. Al llegar a 10, se desactiva con el texto «Máximo 10 estudiantes».
   - El botón «Quitar a <iniciales>» pide confirmación («Se borran sus datos y apoyos de este navegador. ¿Continuar?»). Si queda ninguno, se crea uno vacío.
   - Todos los campos, resultados y el encabezado «Apoyos para <iniciales>» corresponden al estudiante activo.
2. **Elegir apoyos:** «Elegir» en una ficha de apoyo la agrega al estudiante activo. El estado «Elegida» de cada tarjeta depende del estudiante activo.
3. **Apoyo repetido:**
   - Si una ficha está elegida para 2 o más estudiantes, la tarjeta lo dice bajo el título: «Lo elegiste para N estudiantes. Si varios lo necesitan, considera ofrecerlo a todo el curso.»
   - Si la ficha es de acceso y alguna necesidad DUA cubre sus situaciones, agrega el enlace «Ver acciones DUA relacionadas», que activa esa necesidad y lleva a la pestaña DUA.
4. **Barreras que se repiten, en la pestaña DUA:**
   - Si 2 o más estudiantes tienen marcada la misma situación (cualquier frecuencia), muestra arriba de los resultados un recuadro «Barreras que se repiten en tu curso».
   - Una línea por situación: «<situación>: N estudiantes».
   - Si hay una necesidad DUA con esa situación en `dimensiones`, agrega un botón «Ver acciones para esto», que marca esa necesidad. Si ya está marcada, muestra «Ya lo estás considerando».
   - Solo muestra conteos, **nunca iniciales**: quien mira la pantalla del curso no debe ver datos de estudiantes.
   - Si no hay repeticiones, el recuadro no aparece.
5. **Mi mochila:** agrupa en «Para todo el curso» y una sección por estudiante con apoyos elegidos («Apoyos para JP»). El contador total suma todo.
6. **PDF y vista previa:**
   - Antes de generar, pregunta qué incluir con casillas: «Acciones para todo el curso» y una por cada estudiante con datos. Por defecto: el curso y el estudiante activo.
   - Cada estudiante incluido tiene su sección completa, como hoy: título, tabla CIF, «Le ayuda», voz y apoyos.
   - El nombre del archivo no lleva iniciales.
7. **Aviso de privacidad:** sigue igual, una sola vez al escribir datos por primera vez, para cualquier estudiante.

## Lo que no cambia
Las fichas, las guías, los filtros DUA, la casilla de práctica, el nivel (es uno para todo el curso), los temas y el logo.

## Criterios de aceptación
- [ ] Con 2 estudiantes, sus situaciones, textos y apoyos no se mezclan al cambiar de uno a otro, ni al recargar la página.
- [ ] `localStorage` y respaldos `version: 1` cargan como un primer estudiante, con sus apoyos separados de las acciones DUA.
- [ ] Un respaldo nuevo guarda y restaura todos los estudiantes.
- [ ] Una ficha elegida para 2 estudiantes muestra el aviso de apoyo repetido.
- [ ] Con «Atención y organización» marcada en 2 estudiantes, la pestaña DUA muestra el recuadro, y «Ver acciones para esto» marca «Se pierden en tareas largas o con muchos pasos». El recuadro no muestra iniciales.
- [ ] El PDF incluye solo lo elegido en las casillas, y cada estudiante en su sección.
- [ ] Máximo 10 estudiantes. Quitar uno pide confirmación.
- [ ] Teclado, foco visible y lector de pantalla en el selector y el recuadro. Sin desplazamiento horizontal a 390 px.
- [ ] Capturas en `docs/marca/023-estudiantes/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. Agrega `scripts/probar_estudiantes.cjs` con la migración, la separación, la repetición y el PDF.
