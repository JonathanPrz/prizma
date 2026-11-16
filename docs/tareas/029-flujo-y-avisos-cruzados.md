# Tarea 029 · Un estudiante a la vez, prioridad en DUA y avisos cruzados entre DUA y apoyos

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/029-flujo-avisos`

## Para qué
El dueño usó la página y propone cuatro mejoras:
1. **Un estudiante a la vez.** Hoy «+ Agregar estudiante» está arriba, antes de completar al primero. Tiene más sentido completar sus filtros y, al final, agregar otro. Las iniciales aceptan solo 4 letras, y dos estudiantes con iniciales iguales no se distinguen.
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
1. **Flujo de un estudiante a la vez:**
   - Arriba de los filtros de apoyos queda el selector de estudiantes, solo si hay 2 o más, para cambiar de uno a otro. «Quitar a <iniciales>» queda junto al selector.
   - Al final de los filtros, después de la voz y la casilla de práctica, va el botón «+ Agregar otro estudiante».
   - El botón se habilita cuando el estudiante actual tiene al menos una situación marcada. Si no, muestra la ayuda: «Marca al menos una situación de este estudiante antes de agregar otro».
   - Al agregar, el foco va a las iniciales del nuevo estudiante y aparece el selector.
   - Las iniciales aceptan **hasta 4 letras y un número final opcional** (por ejemplo, «JP2»). Ajusta `normalizarEstudiante()`, el `pattern` y la ayuda: «Solo iniciales. Si se repiten, agrega un número: JP2».
   - Si dos estudiantes tienen las mismas iniciales, avisa bajo el campo: «Ya hay un estudiante JP. Agrega un número para distinguirlos».
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
- [ ] Con un estudiante sin situaciones, «+ Agregar otro estudiante» está desactivado y explica por qué. El selector aparece desde el segundo estudiante.
- [ ] «JP2» se acepta. Dos «JP» muestran el aviso.
- [ ] Con «Se pierden en tareas largas» marcada, DUA muestra «Para empezar» con 3 acciones que responden a esa necesidad, sin repetirlas abajo.
- [ ] Elegir `dua-6-2` y después `acc-1-agenda` muestra en el apoyo «Ya está considerado en el DUA: …». La tarjeta de `dua-6-2` dice «Responde también a apoyos individuales de 1 estudiante».
- [ ] Con `acc-1-agenda` elegida para 2 estudiantes y `dua-6-2` sin elegir, aparece la pregunta. «Sí» agrega `dua-6-2` y mantiene los 2 apoyos. «No» oculta la pregunta y lo recuerda al recargar.
- [ ] El PDF muestra las dos observaciones, sin iniciales en la sección del curso.
- [ ] `probar_datos_reales.cjs` falla si se vuelve a introducir el límite de 11 situaciones (compruébalo una vez y explícalo en el pull request).
- [ ] Sin desplazamiento horizontal a 390 px. Capturas en `docs/marca/029-flujo/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.
