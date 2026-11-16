# Tarea 023 · Varios estudiantes, y que sus barreras conversen con el DUA

Estado: **integrada** (PR #23) · Asignada a: Codex · Rama: `codex/023-varios-estudiantes`

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
3. **Versión para todo el curso:**
   - Claude agregó a 38 fichas de acceso el campo `dua`, con la consideración DUA que es su versión para todo el curso (por ejemplo, `acc-1-agenda` → `6.2`).
   - La acción DUA es la del nivel actual con esa `consideracion` y que pase `aplica()`. Las fichas sin `dua` no tienen versión para el curso: no muestres nada.
   - Si la ficha tiene `dua`, la tarjeta muestra siempre, bajo los pasos: «Versión para todo el curso: <título de la acción DUA>», con el botón «Agregar al curso». El botón agrega esa acción a `estado.seleccion`, la selección DUA.
   - Si la acción DUA ya está elegida, el botón cambia a «Ya está en el curso» (desactivado), y la tarjeta dice «También ofrecido a todo el curso».
   - **Apoyo repetido:** si la ficha está elegida para 2 o más estudiantes, se destaca un aviso: «Lo elegiste para N estudiantes. Considera agregar su versión para todo el curso.» Si no tiene `dua`, el aviso dice solo «Lo elegiste para N estudiantes.»
   - **Nunca** se quita el apoyo de los estudiantes al agregar la versión DUA: cada estudiante conserva su apoyo para su PACI o acuerdo.
4. **Barreras que se repiten, en la pestaña DUA:**
   - Si 2 o más estudiantes tienen marcada la misma situación (cualquier frecuencia), muestra arriba de los resultados un recuadro «Barreras que se repiten en tu curso».
   - Una línea por situación: «<situación>: N estudiantes».
   - Si hay una necesidad DUA con esa situación en `dimensiones`, agrega un botón «Ver acciones para esto», que marca esa necesidad. Si ya está marcada, muestra «Ya lo estás considerando».
   - Solo muestra conteos, **nunca iniciales**: quien mira la pantalla del curso no debe ver datos de estudiantes.
   - Si no hay repeticiones, el recuadro no aparece.
5. **Mi mochila:** agrupa en «Para todo el curso» y una sección por estudiante con apoyos elegidos («Apoyos para JP»). El contador total suma todo.
6. **PDF y vista previa: claros, ordenados y profesionales.** Antes de generar, pregunta qué incluir con casillas: «Acciones para todo el curso» y una por cada estudiante con datos. Por defecto, el curso y el estudiante activo. El PDF (pdfmake) y la vista previa (`armarHoja`) deben seguir el mismo orden y estilo:
   - **Portada breve en la primera página**, no en una hoja aparte:
     - logo M1 (el SVG de `index.html`, convertido para pdfmake) y «Prizma»;
     - título: «Plan de apoyos para el aprendizaje» si incluye estudiantes, o «Acciones para todo el curso» si es solo el curso;
     - una tabla de resumen sin bordes gruesos: Fecha, Nivel, Clase práctica (si aplica), Meta de aprendizaje, Qué quiere resolver y Contenido (por ejemplo, «Curso y 2 estudiantes»).
   - **Encabezado y pie en todas las páginas desde la segunda:**
     - encabezado: «Prizma · <título del documento>» a la izquierda y la fecha a la derecha, en gris pequeño, con una línea fina;
     - pie: «Página X de Y» a la derecha;
     - en las páginas de estudiantes, el pie dice además a la izquierda: «Contiene datos de un estudiante. Guárdalo de forma segura.»
   - **Sección del curso:** título «Acciones para todo el curso». Grupos por momento (Antes, Durante, Después, En toda la clase), con el mismo orden de la página.
   - **Cada estudiante empieza en una página nueva** (`pageBreak: "before"`), para poder imprimir o entregar su parte por separado. Orden de su sección:
     1. título «Apoyos para JP» (o «Ajustes razonables para JP») y subtítulo del acuerdo;
     2. tabla «Barreras y facilitadores (enfoque CIF)»;
     3. un recuadro con dos filas rotuladas: «Le ayuda» y «Qué dicen el estudiante y su familia», con «Sin información» si están vacías;
     4. los apoyos, agrupados por tipo (acceso por subtipo, objetivos, desregulación);
     5. un bloque final **«Acuerdos (para completar en la reunión)»**, con líneas en blanco para «Acordado con», «Fecha» y «Próxima revisión».
   - **Fichas:** cada una en un bloque que no se corta entre páginas:
     - título en negrita y pasos numerados;
     - «Por qué funciona»;
     - una línea gris con el tipo oficial, la consideración y el respaldo;
     - «Mi nota» en un recuadro suave si existe;
     - en las fichas de estudiante con versión DUA ya agregada: «También ofrecido a todo el curso».
   - **Títulos que no quedan huérfanos:** ningún título de sección o de grupo puede quedar solo al pie de una página. Usa `headlineLevel` y `pageBreakBefore`, o agrupa el título con su primer bloque.
   - **Tabla CIF:** encabezado con fondo gris claro y bordes finos; columnas de 38 %, 18 % y 44 %, para que «Casi siempre» no se corte.
   - **Fuentes:** al final, en una sección propia que empieza en página nueva, numeradas, con URL en gris y letra menor. Después, el recuadro de aviso legal que ya existe.
   - **Tipografía y espacio:** usa una sola familia (Roboto, la de pdfmake) y tres tamaños de título (20, 14, 11,5) más el texto (10,5). Márgenes de 2 cm. Usa los colores del logo solo en el logo y en líneas finas, y nada que dependa del color para entenderse.
   - **Nombre del archivo:** `prizma-plan-AAAA-MM-DD.pdf` o `prizma-curso-AAAA-MM-DD.pdf`, sin iniciales.
7. **Aviso de privacidad:** sigue igual, una sola vez al escribir datos por primera vez, para cualquier estudiante.

## Lo que no cambia
Las fichas, las guías, los filtros DUA, la casilla de práctica, el nivel (es uno para todo el curso), los temas y el logo.

## Criterios de aceptación
- [ ] Con 2 estudiantes, sus situaciones, textos y apoyos no se mezclan al cambiar de uno a otro, ni al recargar la página.
- [ ] `localStorage` y respaldos `version: 1` cargan como un primer estudiante, con sus apoyos separados de las acciones DUA.
- [ ] Un respaldo nuevo guarda y restaura todos los estudiantes.
- [ ] Una ficha con `dua` muestra su versión para el curso y «Agregar al curso» la agrega a la selección DUA sin quitarla a los estudiantes. Elegida para 2 estudiantes, muestra el aviso destacado.
- [ ] Con «Atención y organización» marcada en 2 estudiantes, la pestaña DUA muestra el recuadro, y «Ver acciones para esto» marca «Se pierden en tareas largas o con muchos pasos». El recuadro no muestra iniciales.
- [ ] El PDF incluye solo lo elegido en las casillas. Cada estudiante empieza en página nueva, con su tabla CIF, su recuadro de facilitadores y voz, sus apoyos y el bloque de acuerdos.
- [ ] Ningún título queda solo al pie de una página y ninguna ficha se corta. Pruébalo con un caso largo: el curso con 12 acciones y 2 estudiantes con 6 apoyos cada uno. Adjunta ese PDF de ejemplo en `docs/marca/023-estudiantes/`.
- [ ] La vista previa sigue el mismo orden que el PDF.
- [ ] Máximo 10 estudiantes. Quitar uno pide confirmación.
- [ ] Teclado, foco visible y lector de pantalla en el selector y el recuadro. Sin desplazamiento horizontal a 390 px.
- [ ] Capturas en `docs/marca/023-estudiantes/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. Agrega `scripts/probar_estudiantes.cjs` con la migración, la separación, la repetición y el PDF.
