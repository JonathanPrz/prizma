# Tarea 029 · Pasos en DUA y apoyos, casos con acuerdos, prioridad y avisos cruzados

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/029-flujo-avisos`

## Para qué
El dueño usó la página y propone cuatro mejoras:
1. **Cada estudiante, un caso completo.** Los filtros laterales de apoyos no convencen al dueño. Propone un recorrido por caso: describir al estudiante, elegir sus apoyos y completar los acuerdos. Solo después se agrega el caso siguiente, para darle a cada caso su importancia. Las iniciales aceptan solo 4 letras, y dos estudiantes con iniciales iguales no se distinguen.
2. **Los filtros deben priorizar, además de ocultar,** también en DUA: primero lo más pertinente.
3. **Avisos cruzados.**
   - Si una acción DUA elegida cubre un apoyo individual, la tarjeta del apoyo debe decirlo.
   - Al revés: la acción DUA debe mostrar si responde a apoyos individuales.
   - Si 2 o más estudiantes tienen el mismo apoyo, se debe preguntar si se agrega a todo el curso.
4. **El PDF** conserva el apoyo individual, con la observación de que también se ofrece al curso.

Parte de esto existe: la versión DUA de cada apoyo, el botón «Agregar al curso» y el aviso de apoyo repetido. Pero el dueño no lo percibe como un flujo claro.

Además, Claude encontró y corrigió un error grave: `app.js` rechazaba `data/necesidades.json` porque validaba las situaciones hasta 11, cuando hay 14. Por eso las necesidades DUA no aparecían. Ninguna prueba lo detectó.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Parte A · Auditoría breve (antes de cambiar código)
Escribe `docs/auditorias/029-flujos/README.md`. Con un script o Playwright, recorre como lo haría un docente:
1. elegir necesidades en DUA y ver si lo más pertinente queda primero;
2. elegir una acción DUA y después, en apoyos, un apoyo cuya versión DUA es esa acción;
3. el caso inverso;
4. 2 estudiantes con el mismo apoyo;
5. el PDF resultante.

Por cada paso anota qué muestra hoy la página, qué esperaría el docente según esta tarea y la brecha. Agrega también cualquier otro dato que la página descarte en silencio, como pasó con las necesidades. Revisa todas las validaciones de `app.js` contra los datos reales.

## Parte B · Cambios
1. **Cada estudiante es un caso, en 3 pasos (reemplaza los filtros laterales en la pestaña de apoyos).** El dueño decidió que en apoyos no haya columna de filtros ni diálogo «Filtros» en el teléfono. La página queda a todo el ancho, en este orden:
   - **Arriba, «Casos»:** un botón por estudiante, con su estado en texto: «Acuerdos completos», «Sin acuerdos» o «Por revisar». Sirve para cambiar de caso. «Quitar a <iniciales>» va junto a la lista.
   - **Paso 1, «Describe la situación de <iniciales>»:**
     - Es un bloque que se despliega con un botón. Contiene las iniciales, las situaciones, «¿Qué le ayuda?», la voz y la casilla de práctica profesional.
     - «Guardar descripción» exige al menos una situación marcada.
     - Al guardar, se pliega y muestra un resumen (situaciones con su frecuencia y qué le ayuda) con el botón «Editar».
   - **Paso 2, «Apoyos sugeridos»:**
     - Aparece después de guardar el paso 1.
     - Muestra los resultados de hoy: «Para empezar», los grupos, los objetivos, la desregulación y la práctica profesional. Se eligen igual que hoy.
   - **Paso 3, «Acuerdos»:**
     - «¿Con quiénes se acordó?»: casillas de roles, no nombres. Son Estudiante, Familia o apoderado, Equipo de apoyo y Otro docente. En superior: Estudiante, Unidad de inclusión y Otro docente.
     - «Fecha del acuerdo» y «Próxima revisión»: campos de fecha. La revisión debe ser posterior al acuerdo.
     - «Guardar acuerdos» exige al menos un apoyo elegido, un rol y las dos fechas, y explica lo que falta.
     - Al guardar, se pliega con un resumen y «Editar».
   - **Cuando el caso cambia después del acuerdo:** si cambian los apoyos elegidos o la descripción, el caso pasa a «Por revisar» y el paso 3 muestra «Cambiaste el caso después del acuerdo. Revisa los acuerdos».
   - **«+ Agregar otro caso»:**
     - Aparece después del paso 3. Se habilita solo si **todos** los casos tienen «Acuerdos completos». Si no, explica cuáles faltan: «Completa los acuerdos de: JP».
     - Al agregar, crea el caso, abre su paso 1, lleva la vista al inicio y pone el foco en las iniciales.
     - El máximo sigue siendo 10.
   - **Datos:** los acuerdos se guardan en cada estudiante como `acuerdo: { roles, fecha, revision, estado }`, validados y respaldados.
     - Los datos antiguos cargan con el paso 1 guardado si tienen situaciones, y con «Sin acuerdos».
     - En el PDF, el bloque «Acuerdos» de cada estudiante muestra los roles y las fechas si existen. Si no, deja las líneas en blanco como hoy.
   - **Iniciales:** aceptan hasta 4 letras y un número final opcional (por ejemplo, «JP2»).
     - Ajusta `normalizarEstudiante()`, el `pattern` y la ayuda: «Solo iniciales. Si se repiten, agrega un número: JP2».
     - Si dos casos tienen las mismas iniciales, avisa bajo el campo: «Ya hay un estudiante JP. Agrega un número para distinguirlos».
   - **Lo que no cambia:** el aviso de privacidad sigue abriéndose la primera vez que se escriben datos. «¿Qué datos puedo escribir?» queda bajo las iniciales.
1b. **La pestaña DUA usa el mismo formato de pasos (también sin filtros laterales).** El dueño prefiere que las dos pestañas funcionen igual. Se eliminan la columna de filtros, el botón «Filtros (n)» y el diálogo `#filtros-dialogo`. El nivel y la casilla de práctica siguen en la barra de contexto.
   - **Paso 1, «Describe tu clase»:**
     - Es un bloque que se despliega con un botón. Contiene, en el orden de hoy, la meta, «¿Qué quieres resolver?», «¿Cuándo?», «¿Para qué?» y «Más detalles».
     - «Guardar» no exige nada: todo es opcional, como hoy.
     - Al guardar, se pliega con un resumen (meta, necesidades y momentos elegidos, o «Sin filtros: verás todas las acciones») y «Editar».
     - En la primera visita aparece desplegado.
   - **Paso 2, «Acciones sugeridas»:** a todo el ancho. Arriba «Para empezar» (punto 2) y después los grupos por momento. Las acciones se eligen como hoy. Los resultados se actualizan al guardar el paso 1, no a cada clic.
   - **Paso 3, «Tu selección»:**
     - Muestra las acciones DUA elegidas, ordenadas por momento, con su nota.
     - Tiene el botón «Ver documento» y una línea opcional: «Después de la clase: ¿qué funcionó?». Es un texto de máximo 500 caracteres, que se guarda en `estado.perfil.reflexion` (validado y respaldado) y va al PDF bajo las acciones del curso.
   - **Estilo común:** usa en las dos pestañas los mismos componentes para paso, resumen y «Editar». La guía «¿Cómo usar el DUA?» queda junto al paso 1.
   - Ajusta las pruebas que dependían del diálogo de filtros o de `#abrir-filtros`, sin debilitar lo que comprueban.
2. **Prioridad en DUA:**
   - Si hay al menos una necesidad, un contexto de «Más detalles» o la casilla de práctica marcados, agrega arriba de los grupos por momento la sección «Para empezar», con las 3 acciones más pertinentes de todos los momentos.
   - Usa el mismo orden de hoy: necesidades, después práctica, contextos y destacadas.
   - Esas 3 no se repiten abajo. Cada una muestra su momento, por ejemplo «Antes».
   - Sin filtros marcados, no hay sección «Para empezar».
3. **Avisos cruzados:**
   - **En la tarjeta de un apoyo individual**, si su versión DUA ya está elegida, muestra al inicio de la tarjeta, bajo el título, un rótulo visible: «Ya está considerado en el DUA: <título de la acción>». Reemplaza el texto «También ofrecido a todo el curso» del bloque inferior.
   - **En la tarjeta de una acción DUA** que es la versión de apoyos elegidos para estudiantes, muestra: «Responde también a apoyos individuales de N estudiantes». **Solo el número, nunca las iniciales**: la pestaña DUA puede proyectarse al curso.
   - **Apoyo repetido:** al elegir para un segundo estudiante un apoyo con versión DUA que aún no está en el curso, la tarjeta muestra la pregunta «Este apoyo lo necesitan N estudiantes. ¿Quieres agregar su versión a todo el curso?», con 2 botones: «Sí, agregar al curso» y «No, mantener individual».
     - «No» oculta la pregunta para ese apoyo y lo guarda en el estado (validado y respaldado).
     - En ningún caso se quita el apoyo a los estudiantes.
     - Si el apoyo no tiene versión DUA, solo dice «Este apoyo lo eligieron N estudiantes».
   - Los rótulos tienen texto, no dependen solo del color y se anuncian a lector de pantalla.
4. **PDF y vista previa:**
   - El apoyo individual mantiene la observación «También ofrecido a todo el curso».
   - La acción DUA correspondiente agrega, en su línea de datos: «Responde también a apoyos individuales de N estudiantes.» Solo el número.
5. **Que no vuelva a pasar:**
   - Lleva la validación de necesidades a una función `validarNecesidades(datos)`.
   - Agrega `scripts/probar_datos_reales.cjs`. Debe cargar `data/recomendaciones.json`, `data/fuentes.json` y `data/necesidades.json` reales, pasarlos por las mismas validaciones de la página y comprobar que no se descarta nada.

## Criterios de aceptación
- [ ] La auditoría de la parte A documenta cada recorrido y las validaciones revisadas.
- [ ] Ninguna pestaña tiene columna de filtros ni diálogo «Filtros». DUA y apoyos usan los mismos componentes de paso, resumen y «Editar».
- [ ] En DUA, el paso 1 se guarda sin exigir nada, se pliega con su resumen y los resultados se actualizan al guardar. El paso 3 muestra la selección y la reflexión, que va al PDF.
- [ ] Un caso recorre los 3 pasos. Cada paso guardado se pliega con un resumen y «Editar».
- [ ] «Guardar acuerdos» no deja guardar sin un apoyo, un rol y las dos fechas válidas, y dice qué falta.
- [ ] «+ Agregar otro caso» está bloqueado mientras algún caso no tenga «Acuerdos completos». Al agregar, la vista vuelve al paso 1.
- [ ] Cambiar los apoyos después del acuerdo deja el caso en «Por revisar».
- [ ] Los acuerdos aparecen en el PDF y en el respaldo. Los datos antiguos cargan como «Sin acuerdos».
- [ ] «JP2» se acepta. Dos «JP» muestran el aviso.
- [ ] Con «Se pierden en tareas largas» marcada, DUA muestra «Para empezar» con 3 acciones que responden a esa necesidad, sin repetirlas abajo.
- [ ] Elegir `dua-6-2` y después `acc-1-agenda` muestra en el apoyo «Ya está considerado en el DUA: …». La tarjeta de `dua-6-2` dice «Responde también a apoyos individuales de 1 estudiante».
- [ ] Con `acc-1-agenda` elegida para 2 estudiantes y `dua-6-2` sin elegir, aparece la pregunta. «Sí» agrega `dua-6-2` y mantiene los 2 apoyos. «No» oculta la pregunta y lo recuerda al recargar.
- [ ] El PDF muestra las dos observaciones, sin iniciales en la sección del curso.
- [ ] `probar_datos_reales.cjs` falla si se vuelve a introducir el límite de 11 situaciones (compruébalo una vez y explícalo en el pull request).
- [ ] Sin desplazamiento horizontal a 390 px. Capturas en `docs/marca/029-flujo/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.
