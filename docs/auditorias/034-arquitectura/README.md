# Tarea 034 · Auditoría de arquitectura de información: qué hay, dónde está y de qué depende

Corte: `main` en `ae2cd6cd8ceeecd342bc14c07e036fc01b600582`, 16 de noviembre de 2026. Auditoría del estado actual, sin cambios de producto ni propuesta de diseño. Se inspeccionaron `index.html`, `app.js`, `styles.css` y los tres JSON de `data/`; se ejecutó la página localmente con esos mismos archivos. No se auditó una versión publicada distinta de este corte.

## 1. Inventario de todo lo que se ve o se usa

El inventario tiene dos capas que se leen juntas: la tabla funcional siguiente explica **ubicación, niveles, dependencias y repeticiones**; el [inventario observado](inventario-observado.md), con su [JSON](inventario-observado.json), registra cada selector y variante con **texto exacto**, etiqueta, nombre accesible, placeholder, límite y estados visibles/deshabilitados. Los textos se normalizan solo en espacios. Las variantes de títulos con JP, IP y AB pertenecen a casos ficticios de la auditoría.

Se incluyen también los [textos completos de las 240 fichas](fichas.md), los [57 enlaces de fuentes](fuentes-visibles.md), las [opciones y constantes exactas](constantes-y-opciones.json), las [plantillas de mensajes y documentos](plantillas-mensajes.md) y el [DOM inicial](estructura-inicial.html). Las plantillas identifican mensajes presentes en el código, incluidos errores que **no** se provocaron en los recorridos. Una ausencia en una captura no prueba que un elemento no exista.

Convenciones: **P** parvularia, **B** básica, **M** media, **S** superior; **T** pestaña Trabajo. «Educación» significa las dos pestañas educativas en P/B/M/S. Un diálogo cerrado y el contenido de un paso plegado no son visibles aunque existan en el DOM. Los estados `*-contexto` de la matriz conservan el caso de la iteración anterior; las primeras visitas reales son los seis contextos nuevos de la sección 4.

| Elemento y texto visible exacto o referencia a sus variantes | Dónde | Aparece / no aparece por nivel | Dependencia actual | Repetición |
| --- | --- | --- | --- | --- |
| «Ir al contenido» | Primer enlace, antes de cabecera | P/B/M/S/T; se revela con foco | Teclado; destino `#contenido` | No |
| Logo y «Prizma»; «Apoyos con fuente para aprender y trabajar en igualdad» | Cabecera | P/B/M/S/T; bajada oculta a 390 px | Ancho de pantalla | Marca reaparece en vista previa y PDF |
| Botón de luna/sol; nombres accesibles «Cambiar a modo oscuro» / «Cambiar a modo claro» | Cabecera, `#tema` | P/B/M/S/T | Preferencia del dispositivo al inicio; luego `prizma.tema`, con try/catch. No hay selector de tres opciones en este corte | Uno, común a todo |
| Ícono de mochila y contador; nombre accesible «Mi mochila: {n} elegidas» | Cabecera, `#abrir-mochila` | P/B/M/S/T; texto «Mi mochila» visible en escritorio, solo para lectores a 390 px | Total de selecciones del curso, estudiantes y trabajadores | Abre una única mochila; el contenido también aparece en selecciones y documentos |
| «Nivel» y opciones «Sin indicar», «Educación parvularia», «Educación básica», «Educación media (CH y TP)», «Educación superior (universidad, IP o CFT)» | Barra de contexto, `#nivel` | Educación sí; T no | Un valor global, no un nivel por estudiante. Sin indicar se aplica básica | Se imprime en resumen educativo |
| «Mi clase incluye taller, laboratorio o terreno» | Barra de contexto, `#practica` | B/M/S sí; P/T no, con catálogo actual | Existencia de acceso con contexto `practica` aplicable; valor global `perfil.practica` | No es la casilla personal de práctica profesional |
| «Para el curso (DUA)», «Para un estudiante» / «Ajustes razonables», «Para el trabajo» | Tres pestañas | Siempre las tres; cambia la segunda en S | Nivel educativo para el rótulo; pestaña para contenido. Trabajo no es un valor de Nivel | Rótulos relacionados con títulos interiores, pero no idénticos |
| «Acciones para que todo tu curso pueda aprender»; «Elige las que te sirvan. Prizma no planifica tu clase: te ofrece un menú, cada acción con su fuente.» | Intro DUA | P/B/M/S; no T ni pestaña estudiante | Pestaña activa | Idea de menú con fuentes repetida en intro de estudiante |
| «1. Describe tu clase», «Editar», «Todo es opcional. Guarda para actualizar las acciones sugeridas.» | DUA paso 1 plegable | P/B/M/S; no T | Borrador frente a clase guardada; abrir/editar/guardar cambia cuerpo y resumen | Patrón de pasos reutilizado en estudiante y Trabajo |
| «¿Cómo usar el DUA?» | Bajo título del paso 1 y pie | P/B/M/S/T en pie; en paso solo DUA | Apertura manual de `#guia-dua` | Dos enlaces al mismo diálogo |
| «¿Qué quieres que aprendan en esta clase?»; meta y placeholder exacto en inventario | DUA paso 1 | P/B/M/S; no T | Borrador, hasta 500 caracteres | Resumen y documento educativo |
| «¿Qué quieres resolver en esta clase?» y ocho opciones de necesidades | DUA paso 1, `#necesidades` | P/B/M/S; no T | Carga de necesidades; prioridad, no exclusión de fichas. Opciones exactas en constantes | Necesidad aparece como razón en tarjetas y documento |
| «¿Cuándo?»; «Antes», «Durante», «Después», «En toda la clase» / «En toda la experiencia de aprendizaje» | DUA paso 1, `#momentos` | P/B/M/S; no T | Selección múltiple; vacío muestra todos; momento sí filtra fichas | Encabezados de resultados y documento |
| «¿Para qué?»; «Motivar y sostener el interés», «Presentar la información», «Expresarse y organizarse» | DUA paso 1, `#propositos` | P/B/M/S; no T | Selección múltiple; propósitos sí filtran | Tarjetas usan las variantes cortas «Motivar», «Presentar», «Expresarse y organizarse» |
| «Más detalles (opcional)», «¿Qué harán principalmente?» y «¿Cómo mostrarán lo que aprendieron?»; opciones exactas en inventario | DUA paso 1 | P/B/M/S; no T | Actividad y evidencia priorizan, no excluyen. Ambas admiten varias | Razones en tarjetas; resumen PDF |
| «Limpiar respuestas», «Guardar» | DUA paso 1 | P/B/M/S; no T | Limpiar/guardar borrador; Guardar actualiza sugerencias | «Guardar descripción» y «Guardar acuerdos» son operaciones distintas |
| «2. Acciones sugeridas», conteo; «Para empezar» y grupos por momento | DUA paso 2 | P/B/M/S; no T | Nivel, filtros de momento/propósito; prioridad por necesidades, contexto y práctica. Primeras tres cuando hay criterios | No se duplican fichas entre destacadas y grupos restantes |
| «Barreras que se repiten en tu curso» y aviso de apoyos compartidos | DUA paso 2, `#barreras-repetidas` | P/B/M/S condicionado; no T | Dos o más casos educativos coinciden; selección y equivalencia DUA | Aviso relacionado en ficha individual y ficha DUA |
| Ficha DUA: propósito corto, «DUA {consideración}», título, pasos, «Por qué funciona: », respaldo, «Elegir» / «Elegida», «Fuentes» | DUA paso 2 | P/B/M/S según elegibilidad; no T | ID y contenido del catálogo; elección del curso; razones según criterios. Textos por ID en fichas.md y constantes | Ficha elegida reaparece en selección, mochila y documento |
| «3. Tu selección», «Todavía no eliges acciones DUA.», «Después de la clase: ¿qué funcionó?», «Ver documento» | DUA paso 3 | P/B/M/S; no T | Elegidas y reflexión de 500 caracteres; Ver documento deshabilitado sin contenido educativo suficiente | Mismas acciones en mochila; notas por ficha se comparten, no son otra selección |
| «Apoyos individualizados para un estudiante» / «Ajustes razonables para un estudiante»; bajada y enlace de guía exactos en inventario | Intro estudiante | P/B/M frente a S; no T | Nivel global. En S dice «a la unidad de inclusión» en lugar de «al equipo de apoyo» | Guía también enlazada en pie |
| «Revisa las situaciones guardadas», aviso «Separamos algunas situaciones: …», «Entendido» | Intro estudiante, `#revision-situaciones` | Educación condicionado; no T | Versión anterior de situaciones guardadas; dimensiones antiguas 3 o 6 | No es aviso de privacidad ni acuerdo |
| «Casos», «{nombre} · Sin acuerdos» / «Acuerdos completos» / «Por revisar», «Quitar a {nombre}» | Estudiante, selector de casos | P/B/M/S; no T | Estudiante activo; iniciales y estado; al menos un caso permanece | Trabajo tiene lista separada, mismo patrón |
| «1. Describe la situación de {nombre}», «Editar» | Estudiante paso 1 | P/B/M/S; no T | Caso activo y descripción guardada; se pliega al guardar | Trabajo tiene flujo paralelo |
| «Iniciales», «Solo iniciales. Si se repiten, agrega un número: JP2», mensaje de iniciales duplicadas | Estudiante paso 1 | P/B/M/S; no T | Máximo cinco caracteres; patrón de iniciales; coincidencias entre casos | Trabajo repite etiqueta y ayuda, mantiene sus propios casos |
| «¿Qué datos puedo escribir?» | Estudiante y Trabajo, paso 1 | P/B/M/S/T | Apertura manual de privacidad, aun si ya se entendió | Dos enlaces interiores y otro «Privacidad» en pie |
| «¿En qué áreas encuentra barreras?»; cinco áreas | Estudiante y Trabajo, paso 1 | P/B/M/S/T | Marcar área despliega dimensiones; desmarcar borra sus frecuencias del caso | Mismos nombres de áreas; ejemplos educativos/laborales diferentes |
| «¿Con qué frecuencia encuentra estas situaciones?»; 14 dimensiones; «No aplica», «A veces», «Seguido», «Casi siempre» | Estudiante y Trabajo, paso 1 | P/B/M/S/T | Área desplegada; frecuencias del caso activo. Nombres y ejemplos exactos en constantes | Se imprimen situaciones y frecuencias; no se imprimen diagnósticos |
| «Este estudiante hará su práctica profesional» | Estudiante paso 1, `#practica-profesional` | M/S sí; P/B/T no | Bandera del estudiante activo, independiente de `perfil.practica` | No es la casilla de taller de la barra |
| «¿Qué le ayuda?»; «¿Qué dicen el estudiante y su familia?»; ayudas exactas en inventario | Estudiante paso 1 | P/B/M/S, incluida familia en S; no T | Caso activo; 300 caracteres por campo | Mochila no repite estos campos completos; documento educativo sí |
| «Guardar descripción» y error «Marca al menos una situación para guardar la descripción.» | Estudiante paso 1 | P/B/M/S; no T | Una frecuencia positiva; pliega paso 1 y muestra resultados | Trabajo tiene su propio botón y error |
| «2. Apoyos sugeridos para {nombre}»; «Los apoyos se acuerdan con el estudiante, su familia y el equipo.» / «Los apoyos se acuerdan con el estudiante y la unidad de inclusión.» | Estudiante paso 2 | P/B/M frente a S; no T | Descripción guardada para mostrar paso; texto según nivel | Hay más referencias a participantes en guía, roles y PDF |
| «Marca al menos una situación para ver apoyos.» / «{n} apoyos»; «Aún no hay apoyos para "{situación}" en este nivel. Revisa las acciones DUA.» | Estudiante paso 2 | P/B/M/S condicionado; no T | Coincidencias de dimensiones, nivel y casilla de taller | Enlace vuelve a DUA; conteo no suma objetivos, DEC ni práctica profesional |
| «Para empezar», cuatro grupos de acceso y «En talleres, laboratorios y terreno» | Estudiante paso 2 | P/B/M/S; grupo taller B/M/S condicionado | Acceso requiere puntaje positivo por dimensiones; taller requiere además `perfil.practica`; tres destacadas si hay más de tres | Grupos y destacadas no duplican las mismas tarjetas |
| Rótulos «Adecuación de acceso: {subtipo} (Decreto 83)» / «Ajuste razonable: {subtipo}»; razón «Porque marcaste: …» | Tarjetas de acceso | P/B/M frente a S; no T | Tipo/subtipo, nivel y situaciones; título/pasos/porqué/fuentes por ID | Ficha aparece también en selección personal, mochila y PDF |
| «Versión para todo el curso: {título}», «Agregar al curso», «Ya está en el curso», «Ya está considerado en el DUA: {título}» | Tarjetas individuales con equivalencia | P/B/M/S condicionado; no T | Equivalencia existente, versión DUA aplicable, selección del curso | Tarjeta DUA: «Responde también a apoyos individuales de {n} estudiante(s)» |
| «Este apoyo lo necesitan {n} estudiantes. ¿Quieres agregar su versión a todo el curso?», «Sí, agregar al curso», «No, mantener individual»; o «Este apoyo lo eligieron {n} estudiantes» | Tarjetas individuales repetidas | P/B/M/S condicionado; no T | Mismo apoyo elegido en ≥2 casos; equivalencia DUA y rechazo previo guardado | Avisos compartidos en curso; sin iniciales en esos avisos |
| «Apoyos adicionales» / «Apoyo adicional» | Contenedor y plantilla de tarjeta | Ningún nivel tiene fichas de este tipo hoy; contenedor oculto | Tipo `adicional` en catálogo, actualmente cero | En S la plantilla se rotularía «Ajuste razonable: Apoyo adicional»; no es contenido observado |
| «Adecuaciones en los objetivos», «Asignatura», «Todas», «Lenguaje», «Matemática», «Ciencias», «Historia» | Estudiante paso 2, `#objetivos` plegable | Encabezado P/B/M/S; selector y fichas solo B/M; no T | Abrir details; nivel y asignatura; no puntaje de dimensiones | Rótulo de tipo se repite en fichas y PDF |
| Advertencia PACI; mensajes específicos de P/S; «Último recurso» | Dentro de objetivos | Advertencia escolar P/B/M; mensaje parvularia P; superior S; eliminación B/M | Nivel y subtipo eliminación; textos completos en inventario | PACI reaparece en pie y documentos |
| «Apoyos ante desregulación»; grupos «Antes», «Durante», «Después» | Estudiante paso 2, `#desregulacion` plegable | P/B/M sí; S/T no | Abrir details; nivel, no dimensiones ni práctica | Momentos con iguales palabras en DUA, distinto significado |
| «Si un estudiante vive una crisis, sigue el protocolo de tu institución y contacta a su unidad de bienestar o de inclusión.» | Estudiante paso 2, `#crisis-superior` | S sí; P/B/M/T no | Nivel, reemplaza bloque DEC visible | No ofrece fichas de crisis en superior |
| «Práctica profesional», «¿Quién hace qué en la práctica?», «Lo que hace el liceo» / «Lo que hace la institución», «Lo que puede hacer el centro de práctica», «Preparar al estudiante para pedir ajustes» | Estudiante paso 2 | M/S y casilla personal sí; P/B/T no | Nivel + estudiante activo + `practicaProfesional`. Centro requiere dimensiones coincidentes o ficha sin dimensiones; otros grupos no | Guía de práctica usa mismos participantes; Trabajo es un catálogo separado |
| «Preparar documento para el centro»; «Primero elige los ajustes que puede hacer el centro» / «El estudiante decide cuáles ajustes compartir.» | Final del bloque de práctica | M/S y casilla personal; P/B/T no | Se habilita con ≥1 ficha elegida del subtipo centro | Abre diálogo específico; no es el documento general |
| «Continuar a acuerdos», «3. Acuerdos», «Editar», «¿Con quiénes se acordó?», «Fecha del acuerdo», «Próxima revisión», «Guardar acuerdos» | Estudiante pasos 2 y 3 | P/B/M/S; no T | Caso activo; guardar exige descripción, ≥1 apoyo, rol permitido y fechas válidas, revisión posterior | Trabajo repite estructura, con roles propios |
| Roles «Estudiante», «Familia o apoderado», «Equipo de apoyo», «Otro docente» / en S «Estudiante», «Unidad de inclusión», «Otro docente» | Acuerdos estudiante | Primera lista P/B/M; segunda S; no T | Nivel global | PDF imprime participantes elegidos |
| «Cambiaste el caso después del acuerdo. Revisa los acuerdos», «+ Agregar otro caso», ayudas y confirmación al quitar | Estudiante, después de resultados y acuerdos | P/B/M/S; no T | Cambio posterior deja «Por revisar»; agregar exige todos completos y menos de diez casos | Trabajo tiene estado y límite independientes |
| «Casos», «Quitar caso» / «Quitar a {nombre}», «1. Describe la situación de una persona» / nombre activo | Trabajo, lista y paso 1 | T sí; P/B/M/S no | Trabajador activo, separado de estudiantes | Patrón de estudiante, sin compartir casos |
| «¿Qué exige la ley?» | Trabajo paso 1 | T sí; resto no | Apertura manual de guía laboral | No hay enlace equivalente a esta guía en pie |
| «Iniciales», «Tipo de puesto», «¿Qué le ayuda?», «¿Qué dice la persona?», «Guardar descripción» | Trabajo paso 1 | T sí; resto no | Puesto opcional 60 caracteres, ayuda/voz 300, ≥1 situación para guardar | Iniciales y ayuda son etiquetas compartidas con educación; ejemplos cambian |
| «2. Ajustes sugeridos», «Sin diagnósticos: describe las tareas y las barreras. La persona decide qué contar.» | Trabajo paso 2 | T sí; resto no | Descripción guardada | Principio repetido en guía, documento y selector de personas |
| «Para empezar», «Información», «Comunicación», «Puesto y entorno», «Tiempo y organización», «Cómo pedir, decidir y revisar ajustes» | Trabajo paso 2 | T sí; resto no | 56 ajustes según puntaje y ocho fichas de proceso siempre; cuatro primeras si hay >4 ajustes | Primeras y resto no duplican tarjetas |
| «Ajuste en el trabajo: {subtipo}», «Porque marcaste: …», «Elegir» / «Elegida», «Fuentes» | Fichas Trabajo | T sí; resto no | Dimensiones del trabajador; proceso no exige coincidencia | Selección laboral, mochila y PDF propio |
| «Continuar a acuerdos», «3. Acuerdos», fechas, «Guardar acuerdos», «+ Agregar otro caso», «Ver documento» | Trabajo pasos 2 y 3 y final | T sí; resto no | Misma validación de acuerdos, con roles laborales; documento se habilita con datos, sin exigir acuerdo completo | Mochila tiene «Ver documento de trabajo» |
| «Persona trabajadora», «Jefatura directa», «Gestor o gestora de inclusión», «Recursos humanos», «Prevención de riesgos» | Acuerdos Trabajo | T sí; resto no | Selección por persona, sin dependencia del nivel educativo | PDF imprime participantes elegidos |
| «Mi mochila», «Cerrar», «Todavía no eliges acciones. Usa el botón «Elegir» de cada tarjeta.» | Diálogo mochila | P/B/M/S/T | Apertura por cabecera; contenido y contador global | El mismo diálogo desde las tres pestañas |
| «Para todo el curso» / «Para todo el grupo», grupos «Apoyos para {iniciales}» / «Ajustes razonables para {iniciales}», «Trabajo», «Ajustes para {iniciales}» | Mochila | Todos, condicionado por selecciones | Mezcla visual de tres ámbitos; selecciones educativas filtradas por nivel actual; trabajadores separados | Repite elecciones de cada pestaña |
| «Mi nota:», campos de nota, quitar ficha; títulos y controles exactos en inventario | Selección DUA y mochila | Según selección del curso/estudiante/trabajador | Nota por ID dentro de cada selección; máximo y etiquetas en inventario | Una misma nota de curso tiene dos accesos; aparece en PDF general/laboral |
| «Ver documento», «Ver documento de trabajo» | Mochila | Educativo en todos; laboral cuando hay selección de Trabajo | Abren selectores de contenido distintos; no mezclan trabajadores con estudiantes en PDF | Entrada educativa también al final DUA; laboral al final Trabajo |
| «Guardar respaldo», «Abrir respaldo», explicación del archivo y estados exactos en inventario/plantillas | Mochila | Todos | Datos globales; guardar deshabilitado sin datos. JSON v2, admite v1; máximo 12 MiB; importar requiere confirmar reemplazo | Respalda curso + estudiantes + trabajadores juntos, no por pestaña |
| «Borrar todo» y confirmación | Mochila | Todos | Borra estado de los tres ámbitos; no es quitar una ficha ni un caso. Tema y reconocimiento de privacidad usan claves separadas | Único control global |
| Texto común del pie y «Código y fuentes», «Privacidad», guías DUA y estudiante | Pie | P/B/M/S/T; variante de guía según S | Pie no cambia de ámbito al entrar a Trabajo | Enlaces educativos repetidos con pasos; sin guía laboral en pie |
| «Cómo usar el DUA en tu clase», seis instrucciones, «Basado en las Pautas DUA 3.0 de CAST (2024).», «Empezar» | Diálogo `#guia-dua` | Manual, todos los ámbitos por pie | Guía procedimental; Empezar espera carga de datos; vuelve a DUA paso 1 | Texto exacto de instrucciones en inventario/DOM |
| «Cómo usar los apoyos individualizados» / «Cómo acordar ajustes razonables», instrucciones, «Entendido» | Diálogo `#guia-apoyos` | Variante escolar P/B/M, superior S; también accesible desde pie en T según nivel conservado | Nivel global, no pestaña Trabajo | Enlaces intro y pie al mismo diálogo |
| «¿Quién hace qué en la práctica?», instrucciones media/superior, «Entendido» | Diálogo `#guia-practica` | M/S, por bloque de práctica; no P/B/T | Nivel elige texto; casilla personal da acceso al enlace | No depende de la casilla de taller |
| «¿Qué exige la ley al empleador?», cuatro encabezados de alcance, rechazo, siete puntos normativos y «Entendido» | Diálogo `#guia-trabajo` | T, apertura manual; no desde pestañas educativas | Ninguna pregunta sobre tamaño de empresa: la guía muestra todos sus supuestos | La ficha de proceso cita normativa relacionada; texto íntegro en inventario |
| «Cuida los datos de tus estudiantes», cinco puntos, «Entendido» | Diálogo `#aviso-privacidad` | P/B/M/S/T con idéntico texto | Primera escritura en campos personales/notas; reconocimiento en `prizma.privacidad.v1` con try/catch. Apertura manual siempre disponible; foco y Escape del diálogo | El mismo aviso para estudiantes y trabajadores |
| «¿Qué incluirás en el documento?», «Acciones para todo el curso», títulos de estudiantes, «Ver documento», «Cancelar» | Diálogo `#incluir-documento`, variante educativa | P/B/M/S y acceso mochila en T | Por defecto curso + estudiante activo con datos; se pueden elegir otros. Requiere alguna opción | No es el diálogo del centro |
| «¿Qué personas incluirás en el documento de trabajo?», aviso de decisión, títulos laborales, «Ver documento», «Cancelar» | Mismo diálogo, variante laboral | T y entrada laboral mochila | Todos los trabajadores inicialmente desmarcados; selección explícita de ≥1 | Mismo contenedor, otro modelo y otra validación |
| «Preparar documento para el centro», «Ajustes que el estudiante decide compartir», «El estudiante revisó este documento y decidió compartirlo», «Ver documento», «Cancelar» | Diálogo `#documento-centro` | M/S con práctica personal y fichas centro elegidas | Ajustes elegidos inicialmente marcados; confirmación de decisión inicialmente desmarcada. Requiere ≥1 ajuste marcado y decisión. No exige completar paso 3 | Documento del centro omite notas y datos del caso |
| «Vista previa», «Descargar PDF», «Imprimir», «Cerrar» y mensajes de carga/error | Diálogo `#vista` | Todos, según documento solicitado | Modelo educativo, laboral o centro; PDF local, misma base que vista/impresión | Tres tipos de documento comparten interfaz |
| Errores de carga, almacenamiento, formulario, fechas, respaldo, PDF y confirmaciones de borrado | Inline, regiones status/alert y confirmación nativa | Según operación, no todos a la vez | Catálogo/red/localStorage/archivo/validaciones. Texto literal y línea en plantillas-mensajes.md | No son guías ni avisos de contexto |

**Privacidad, texto íntegro actual:**

> Cuida los datos de tus estudiantes
>
> - Prizma guarda todo solo en este navegador. No envía nada a internet ni tiene cuentas.
> - Usa solo iniciales. No escribas nombres, RUT, diagnósticos ni datos de salud.
> - Si usas un computador compartido, borra tus datos al terminar con «Borrar todo».
> - Desde el 1 de diciembre de 2026 rige la Ley 21.719 de protección de datos personales. Los datos de salud y de niños, niñas y adolescentes tienen protección especial.
> - Este aviso es una orientación, no una asesoría legal.
>
> Entendido

**Pie, texto íntegro actual:**

> Para docentes, instituciones y empleadores en Chile.
>
> Orientación pedagógica y laboral. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento o empresa.
>
> Basado en las Pautas DUA 3.0 de CAST (2024), la normativa chilena y fuentes abiertas, redactado con palabras propias. Proyecto personal sin fines de lucro. Código y fuentes.
>
> Privacidad · ¿Cómo usar el DUA? · ¿Cómo usar los apoyos individualizados?

En S, el último enlace pasa a «¿Cómo acordar ajustes razonables?», incluso dentro de Trabajo si ese nivel quedó guardado.

### Documentos: contenido y dependencia

Los textos completos de las vistas probadas están en los anexos [básica](basica-1280-documento.md), [centro de práctica](instituto-1280-documento.md) y [Trabajo](rrhh-1280-documento.md); sus PDF se enlazan en la sección 4. El texto variable de cualquier otra ficha está en fichas.md. Plantillas-mensajes.md conserva las ramas de documento no activadas en esos tres ejemplos.

| Documento | Título exacto y contenido | Depende de | Exclusiones y repeticiones actuales |
| --- | --- | --- | --- |
| Solo curso | «Acciones para todo el curso» | Contenido educativo elegido; opción curso | Meta, nivel, necesidades, actividad/evidencia, fichas y reflexión; sin trabajadores |
| Curso y/o estudiantes | «Plan de apoyos para el aprendizaje» cuando hay estudiantes | Selector educativo; nivel global; casos incluidos | Resumen, momentos DUA si incluye curso, casos, «Barreras y facilitadores (enfoque CIF)», frecuencia, facilitadores/voz, apoyos/notas, acuerdos y fuentes. Voz conserva «Qué dicen el estudiante y su familia» también en S |
| Centro | «Ajustes acordados para la práctica» | M/S, casilla personal, fichas centro elegidas y decisión confirmada | Campos «Estudiante», «Centro de práctica», «Profesor tutor o coordinador», «Fecha» para completar a mano; solo ajustes compartidos, pasos, porqué y acuerdos en blanco. Sin iniciales, voz, frecuencias ni notas del caso |
| Laboral | «Plan de ajustes en el trabajo» | Trabajadores explícitamente incluidos | Puesto, barreras, frecuencias, voz, notas, ajustes, acuerdos y fuentes laborales. Sin curso, estudiantes ni nivel educativo |

El aviso educativo `AVISO`, el laboral `AVISO_TRABAJO` y los pies específicos `PIE_PRACTICA`/`PIE_TRABAJO` están completos en constantes-y-opciones.json. El PDF del centro hereda el aviso educativo con PACI/PAEC; el PDF laboral tiene aviso propio y pie de reserva de datos. Los generales permiten documentar estados sin acuerdos completos; agregar otro caso sí exige acuerdos completos. Son dependencias distintas, no una sola validación universal.

## 2. Mapa de dependencias del nivel

Los [conteos por tipo y subtipo](conteos.md) y los [IDs que los componen](conteos.json) se calculan desde `data/`, no desde una captura ni una estimación. El catálogo completo contiene **240 fichas**, **57 fuentes** y **8 necesidades**. Una ficha puede aplicar a varios niveles: las columnas no se suman para obtener 240.

| Tipo elegible | P | B | M | S | Trabajo |
| --- | --- | --- | --- | --- | --- |
| DUA | 36 | 36 | 36 | 36 | 0 |
| Acceso, incluido taller | 43 | 54 | 53 | 39 | 0 |
| Objetivos | 0 | 13 | 12 | 0 | 0 |
| Desregulación | 9 | 9 | 9 | 0 | 0 |
| Práctica profesional | 0 | 0 | 22 | 19 | 0 |
| Trabajo | 0 | 0 | 0 | 0 | 64 |
| Adicional | 0 | 0 | 0 | 0 | 0 |
| Total elegible del ámbito | 88 | 112 | 132 | 94 | 64 |

**Estos son máximos elegibles, no el número mostrado en una primera visita.** En una visita limpia hay 36 DUA de básica, sin nivel indicado, y ningún resultado personal hasta guardar una descripción. En el escenario con las 14 situaciones positivas, sin filtro de asignatura, las cantidades de acceso son P 43; B 45 + 9 de taller; M 44 + 9; S 30 + 9. Las nueve de taller solo se muestran con su casilla global. Las 22/19 de práctica profesional solo con la casilla personal. Sin ella son cero en pantalla, aunque sean elegibles. En Trabajo hay como máximo 56 ajustes por situaciones y ocho de proceso; con una sola situación se muestra un subconjunto de los 56 y los ocho de proceso.

| Nivel / ámbito | Textos y guía | Roles del acuerdo | Qué muestra y qué oculta |
| --- | --- | --- | --- |
| P | Sustituciones marcadas con `data-voc`: «experiencia de aprendizaje», «grupo», «niños y niñas»; pestaña «Para un estudiante»; guía escolar | Estudiante, Familia o apoderado, Equipo de apoyo, Otro docente | Sin taller ni práctica profesional; objetivos sigue como bloque con «En educación parvularia, preferentemente no se adecuan los objetivos (Decreto 83). Usa los apoyos de acceso.» y sin fichas/selector; DEC sí |
| B | «clase», «curso», «estudiantes»; pestaña y guía escolar | Estudiante, Familia o apoderado, Equipo de apoyo, Otro docente | Taller disponible; no casilla profesional; acceso, objetivos con asignatura y DEC |
| M | Igual vocabulario y guía escolar; práctica dice «Lo que hace el liceo» y guía media | Estudiante, Familia o apoderado, Equipo de apoyo, Otro docente | Taller y casilla profesional independientes; objetivos/asignatura y DEC sí; práctica profesional según caso |
| S | Pestaña «Ajustes razonables»; título «Ajustes razonables para un estudiante»; guía «Cómo acordar ajustes razonables»; «unidad de inclusión»; práctica dice «Lo que hace la institución» | Estudiante, Unidad de inclusión, Otro docente | Taller y casilla profesional independientes. Sin DEC; aparece mensaje de crisis. Objetivos mantiene encabezado y explicación de que no se adecuan, sin fichas/selector. Familia sigue en etiqueta de voz y documento general |
| T | «persona», «puesto», «ajustes»; guía «¿Qué exige la ley al empleador?»; ejemplos laborales para las mismas 14 dimensiones | Persona trabajadora, Jefatura directa, Gestor o gestora de inclusión, Recursos humanos, Prevención de riesgos | Selector Nivel y casilla de taller ocultos **comprobados**, no solo previstos; ninguna ficha DUA/objetivos/DEC/práctica en resultados. Pie educativo y privacidad de estudiantes permanecen |

Los rótulos de P no sustituyen automáticamente todas las frases: «1. Describe tu clase», algunas preguntas sin marcador y la guía DUA conservan «clase». El catálogo cambia versiones de seis fichas DUA por nivel; sigue habiendo 36 consideraciones elegibles en cada nivel. El campo `subtipo` no existe en DUA: momento y propósito son otras dimensiones, no subtipos. Trabajo no es un quinto nivel: usar `aplica()` sin filtrar tipo incorporaría indebidamente las DUA transversales. El script lo evita contando Trabajo solo por `tipo === 'trabajo'`.

### Nivel frente a tipo de apoyo y estado

| Factor | Efecto comprobado | No depende de ese factor |
| --- | --- | --- |
| Nivel global | Elegibilidad por `niveles`, vocabulario marcado, título/pestaña/guías, roles, existencia de taller, profesional, objetivos y DEC | Trabajadores y sus ajustes; reconocimiento global de privacidad; tema |
| Tipo/subtipo de ficha | Grupo y rótulo, uso de dimensiones, asignatura, versión DUA y salida al centro | No convierte acceso en un tipo llamado «ajuste razonable»: en S sigue siendo `acceso` |
| Situación + frecuencia | Acceso y ajuste laboral necesitan puntaje positivo; frecuencia ordena. Centro profesional filtra por dimensiones o admite ficha sin dimensiones | Objetivos, DEC, grupos profesional institución/estudiante y ocho fichas laborales de proceso no se filtran por puntaje |
| `perfil.practica` | Prioridad DUA y acceso de taller aplicable; resumen «Clase práctica» | No habilita la práctica profesional ni documento del centro |
| `estudiante.practicaProfesional` | Bloque profesional M/S, por estudiante | No activa la casilla global ni los nueve accesos de taller |
| Borrador DUA frente a Guardar | Criterios editados se confirman al guardar para actualizar sugerencias | Las casillas globales nivel/taller se aplican inmediatamente |
| Descripción guardada | Hace visible paso 2 personal y pliega paso 1 | Tener una selección no equivale a acuerdos completos |
| Selección del caso y selección del curso | Mochila, notas, equivalencias, avisos cruzados y opciones documentales | Selecciones de trabajadores no alimentan avisos DUA ni estudiantes |
| Acuerdos completos | Pliega paso 3; habilita siguiente caso si todos completos y hay menos de diez | No es requisito absoluto para generar un documento existente |
| Activo / guardado | Cambia qué iniciales, situaciones, voz y acuerdos se editan; cambiar después marca revisión | No hay un nivel diferente guardado dentro de cada estudiante |
| Datos persistidos / respaldo | Restaura estado y casos; versiones antiguas pueden mostrar aviso de revisión de situaciones | Una visita limpia no reproduce esos avisos de migración |

Comprobaciones de conjuntos: el script verifica IDs únicos; acceso normal y de taller no se solapan y juntos igualan los elegibles; la suma profesional por tres subtipos coincide con el catálogo; Trabajo coincide con 56 + 8. Los controles que se conservan con cero fichas se describen como controles, no se cuentan como apoyos.

## 3. Términos

El [índice de ocurrencias](terminos.json) contiene selectores, textos y estados para cada término solicitado, más IDs de fichas cuyo título/pasos/porqué lo usan. Incluye ocurrencias ocultas; no presenta una plantilla no visible como una ficha existente. Las ubicaciones del código están en plantillas-mensajes.md.

| Término | Dónde se usa hoy | Relación e inconsistencia observada |
| --- | --- | --- |
| apoyos | Título, bajada, resultados, mochila, PDF educativo y algunas fichas | Término paraguas; no siempre indica si habla de acceso, objetivos, DEC o práctica |
| apoyos individualizados | Título y guía de P/B/M, pie mientras no sea S | Misma entrada que la pestaña llama «Para un estudiante»; no hay introducción que distinga el paraguas de sus tipos |
| apoyos adicionales | Nombre accesible de `#apoyos-adicionales` y constantes | **Cero fichas actuales** y contenedor oculto. Es capacidad de la implementación, no otro conjunto disponible |
| adecuaciones | Bloques, advertencias, guías escolares, fichas de acceso/objetivos y PDF | Se usa para una parte de «apoyos»; su relación con DUA se cuenta en instrucciones y equivalencias, sin definición general inicial |
| adecuaciones de acceso | Agrupación y rótulos escolares, guía y PDF | En S el mismo tipo de datos `acceso` cambia a «ajustes razonables»; no es un catálogo totalmente independiente |
| adecuaciones en los objetivos | Bloque plegable, rótulos y PDF | Encabezado permanece en P/S aunque no haya fichas; el texto interior explica la ausencia. No equivale a acceso |
| ajustes | Trabajo, práctica profesional y superior; documentos y algunas fuentes/fichas | Misma palabra en tres ámbitos con participantes y documentos diferentes; no identifica por sí sola el destino |
| ajustes razonables | Pestaña/título/guía/rótulo de S; fuentes y fichas relacionadas | No es un tipo JSON distinto. Familia permanece en voz y PDF general de S pese al cambio de roles |
| ajustes necesarios | Guía «¿Qué exige la ley al empleador?» y textos normativos citados | Lenguaje normativo laboral frente al rótulo genérico «Ajustes sugeridos». La interfaz no explica su relación con «razonables»; esta auditoría no decide equivalencias legales |
| acciones | Intro DUA, «Acciones sugeridas», selección, mochila vacía, documento de curso y textos | La mochila vacía dice «acciones» incluso si se llega por Trabajo; también las recomendaciones del catálogo tienen acciones/pasos |
| DUA | Pestaña, guía, insignias de consideración, avisos cruzados, pie y PDF | La guía explica cómo usarlo, no desarrolla la sigla ni ofrece una definición general de DUA; también visible desde Trabajo |
| fichas | Mensajes de carga/error/respaldo y plantillas; catálogo de tarjetas | Describe unidades que en otros puntos se llaman acciones, apoyos o ajustes. No es el nombre principal de la acción de elegir |
| recomendaciones | Metadatos/validación del catálogo y mensajes de carga/recuperación; no rótulo de pestaña | Es denominación técnica del conjunto, no un tipo adicional. Las tarjetas dicen «Recomendada porque…» para justificar prioridad |

Otros términos que requieren conocimientos previos: «CIF» se expande en documentos como «Barreras y facilitadores (enfoque CIF)», pero la sigla sigue siendo técnica; «PACI», «PAEC», «Decreto 83», «consideración DUA 3.0», «unidad de inclusión» y los cinco subtipos de objetivos aparecen en instrucciones, advertencias, fichas o pie. Las fuentes permiten profundizar, pero abrirlas es una acción aparte. «Antes/Durante/Después» nombra momentos de una clase en DUA y momentos de desregulación en DEC.

## 4. Recorridos de primera vez

**Método:** seis contextos nuevos de Chromium, sin localStorage previo, claro, movimiento reducido, 1280 × 900 y 390 × 900. Casos ficticios. Cada recorrido empieza en la URL raíz, sin enlaces profundos. El script abre una guía y sigue un camino conocido hasta vista previa y descarga real. Las dudas son **inferencias de inspección experta**, no testimonios ni tiempos de usuarios reales.

Un clic equivalente es una activación de botón/casilla o el clic para enfocar y escribir un campo; elegir nivel cuenta dos (abrir y elegir). No se cuentan teclas de escritura ni gestos de calendario: las fechas se rellenan de forma directa. Una casilla ya marcada suma cero. Los desplazamientos son cambios de `window.scrollY` causados por foco, plegado y `scrollIntoView`, incluidos los que hace Playwright al buscar un control: no se contaron gestos de rueda/dedo. La distancia suma el valor absoluto de esos cambios; no es altura total de la página. Son el costo observado de **este** camino asistido, no un mínimo universal ni un estudio de usabilidad. Hay variaciones de pocos píxeles por ajuste de foco. [Registro de cada acción y coordenadas](recorridos.json).

| Persona | Ancho | Clics hasta vista | Hasta descargar PDF | Cambios de desplazamiento de ventana | Distancia acumulada | Desplazamientos internos de diálogo |
| --- | --- | --- | --- | --- | --- | --- |
| basica | 1280 | 25 | 26 | 11 | 7975 | 0 |
| basica | 390 | 25 | 26 | 12 | 13130 | 0 |
| instituto | 1280 | 18 | 19 | 6 | 9176 | 0 |
| instituto | 390 | 18 | 19 | 7 | 17897 | 0 |
| rrhh | 1280 | 20 | 21 | 8 | 6594 | 0 |
| rrhh | 390 | 20 | 21 | 7 | 12363 | 0 |

### Docente de básica: curso y estudiante

Primero ve la entrada DUA, el nivel «Sin indicar», la casilla de taller, las tres pestañas y el paso 1 del curso. En teléfono, el primer campo de meta apenas entra al final de los 900 px; todavía no ve resultados ni la salida documental. La bajada general de cabecera no está en teléfono.

El camino probado fue: básica → guía DUA → meta y necesidad de tareas largas → Guardar → elegir agenda DUA → estudiante JP → privacidad → área cognitiva y atención «Casi siempre» → facilitador y voz → Guardar descripción → agenda individual → acuerdos → mochila → curso y estudiante → vista y PDF. Se entiende primero el menú de curso y después un segundo proceso con caso, áreas, frecuencias y acuerdos.

Posibles dudas: DUA no se desarrolla como sigla; la segunda agenda avisa que ya está considerada en DUA pero se puede elegir igualmente para registrar el caso; «Guardar», «Guardar descripción» y «Guardar acuerdos» guardan cosas distintas. Objetivos y DEC también están disponibles aunque el propósito del caso probado solo era organizar una tarea. La casilla de taller está disponible aunque no se haya mencionado una actividad práctica. Son elementos presentes, no prueba de que toda docente los considere irrelevantes.

| Evidencia | Escritorio | Teléfono |
| --- | --- | --- |
| Primera pantalla | [Inicio 1280](basica-1280-01-inicio.png) | [Inicio 390](basica-390-01-inicio.png) |
| Aviso al escribir | [Privacidad 1280](basica-1280-02-privacidad.png) | [Privacidad 390](basica-390-02-privacidad.png) |
| Apoyo elegido y cruce DUA | [Apoyos 1280](basica-1280-03-apoyos.png) | [Apoyos 390](basica-390-03-apoyos.png) |
| Primer documento | [Vista 1280](basica-1280-04-documento.png), [PDF](basica-1280-documento.pdf) | [Vista 390](basica-390-04-documento.png), [PDF](basica-390-documento.pdf) |

### Docente de instituto profesional: práctica

Primero ve la misma entrada del curso, sin un acceso inicial llamado práctica. Debe identificar su IP dentro de «Educación superior (universidad, IP o CFT)» y reconocer que ahora «Ajustes razonables» es la pestaña que antes decía «Para un estudiante».

Camino: superior → Ajustes razonables → guía superior → IP y privacidad → área cognitiva, atención «Casi siempre» → casilla personal de práctica → voz → Guardar descripción → guía de responsabilidades → ajuste por pasos del centro → Preparar documento para el centro → comprobar ajuste y confirmar decisión del estudiante → vista/PDF. **No se marcó la casilla global de taller ni se completaron acuerdos generales.** La casilla del ajuste ya estaba marcada en el diálogo, por eso comprobarla no suma un clic. Se llegó al documento específico con campos y acuerdos para completar en reunión.

Posibles dudas: hay dos casillas relacionadas con práctica que habilitan contenidos diferentes; el acceso al documento del centro está después de resultados individuales, objetivos sin fichas y explicación de crisis, además de otros grupos profesionales. La etiqueta «¿Qué dicen el estudiante y su familia?» sigue en superior; no coincide con los roles de acuerdo permitidos. La diferencia entre el documento general del estudiante y el que puede compartir con el centro exige entender el alcance de ambos.

| Evidencia | Escritorio | Teléfono |
| --- | --- | --- |
| Primera pantalla | [Inicio 1280](instituto-1280-01-inicio.png) | [Inicio 390](instituto-390-01-inicio.png) |
| Responsabilidades | [Guía 1280](instituto-1280-02-guia-practica.png) | [Guía 390](instituto-390-02-guia-practica.png) |
| Ficha del centro elegida | [Práctica 1280](instituto-1280-03-practica.png) | [Práctica 390](instituto-390-03-practica.png) |
| Decisión de compartir | [Decisión 1280](instituto-1280-03b-decision-compartir.png) | [Decisión 390](instituto-390-03b-decision-compartir.png) |
| Primer documento | [Vista 1280](instituto-1280-04-documento.png), [PDF](instituto-1280-documento.pdf) | [Vista 390](instituto-390-04-documento.png), [PDF](instituto-390-documento.pdf) |

### Recursos humanos: trabajador

Primero ve la misma entrada educativa. Debe escoger «Para el trabajo»; entonces desaparecen Nivel y taller, hay una lista de casos laborales y empieza «1. Describe la situación de una persona». [Comprobación del contexto laboral a 1280](trabajo-contexto-1280.png). No se encontró el ejemplo de error sugerido por la tarea —selector de nivel visible en Trabajo— en este corte.

Camino: Trabajo → guía legal → AB → privacidad → puesto → área sensorial, Audición «Casi siempre» → facilitador y voz → Guardar descripción → subtítulos → acuerdos con persona trabajadora y fechas → Ver documento → elegir AB explícitamente → vista/PDF. Necesita distinguir situación, frecuencia, ajuste y proceso de acuerdo; la guía legal muestra supuestos de todos los tamaños de empleador sin preguntar el tamaño de su empresa.

Posibles dudas: el aviso automático llama «estudiantes» a las personas cuyos datos se cuidan; en el pie permanecen guías DUA/estudiante y siglas escolares. No hay una guía de «qué es un ajuste» equivalente a una explicación conceptual general; sí hay tareas concretas y normativa. Las ocho fichas de proceso se muestran junto con los ajustes pertinentes, y el botón para acuerdos está al final de resultados. El PDF laboral sí queda separado de los estudiantes.

| Evidencia | Escritorio | Teléfono |
| --- | --- | --- |
| Primera pantalla | [Inicio 1280](rrhh-1280-01-inicio.png) | [Inicio 390](rrhh-390-01-inicio.png) |
| Entrada Trabajo | [Contexto 1280](rrhh-1280-01b-trabajo.png) | [Contexto 390](rrhh-390-01b-trabajo.png) |
| Privacidad escolar en Trabajo | [Aviso 1280](rrhh-1280-02-privacidad.png) | [Aviso 390](rrhh-390-02-privacidad.png) |
| Ajuste elegido | [Ajustes 1280](rrhh-1280-03-ajustes.png) | [Ajustes 390](rrhh-390-03-ajustes.png) |
| Primer documento | [Vista 1280](rrhh-1280-04-documento.png), [PDF](rrhh-1280-documento.pdf) | [Vista 390](rrhh-390-04-documento.png), [PDF](rrhh-390-documento.pdf) |

Las seis ejecuciones terminaron sin errores JavaScript observados y sin desbordamiento horizontal al abrir su documento a 390/1280. Esto no sustituye una revisión de toda la página en todos los estados. Los PDF contienen únicamente datos ficticios y fuentes ya públicas del catálogo.

## 5. Problemas encontrados, por prioridad

Las prioridades expresan impacto sobre comprensión y finalización del recorrido. No son un diagnóstico de conformidad legal ni una propuesta de arquitectura futura. Los hallazgos de la interfaz auditada permanecen registrados, sin implementaciones correctivas en esta entrega.

| Prioridad / ID | Problema actual | Evidencia concreta | Efecto sobre el recorrido |
| --- | --- | --- | --- |
| Alta · A1 | La primera entrada presupone DUA y curso para las tres personas | Las seis capturas `01-inicio`; `#tab-dua` seleccionado al inicio, sin nivel indicado. Guía `#guia-dua` con instrucciones de uso, sin desarrollo de la sigla ni definición general | Docente de práctica y RR. HH. deben reconocer otra pestaña antes de empezar; una persona nueva debe inferir el significado y alcance de DUA |
| Alta · A2 | Privacidad llama «estudiantes» a los trabajadores | Capturas `rrhh-*-02-privacidad.png`; `#t-privacidad`; `mostrarAvisoPrivacidad()` compartida por formularios y notas | El aviso aparece exactamente cuando RR. HH. introduce iniciales; su título y referencia a niños no corresponden a la persona laboral que está describiendo |
| Alta · A3 | El recorrido hasta documento implica desplazamientos extensos aun siguiendo un camino conocido | `recorridos.json`: móvil básica ≈13.130 px acumulados; IP ≈17.897; RR. HH. ≈12.363. `#preparar-centro` sigue a los tres grupos profesionales; botones de acuerdos siguen a resultados | La siguiente acción puede quedar lejos de la selección pertinente. No se atribuye esta distancia a un número de gestos humanos ni se confunde con altura de página |
| Media · M1 | Dos controles de práctica tienen alcances diferentes que no se explican juntos | `#practica` global B/M/S frente a `#practica-profesional` del caso M/S; `practicasVisibles()` frente a `pintarPracticaProfesional()`. Recorrido IP sin casilla global y con documento del centro | Marcar uno no habilita el conjunto del otro; la diferencia no se deduce solo de que ambos mencionan actividad práctica |
| Media · M2 | Un único nivel gobierna todos los estudiantes y sus selecciones | `escucharPerfil()`, `aplica()`, `rolesPermitidos()`, `elegidasOrdenadas()`. Estado almacena nivel en perfil global, no por estudiante | Cambiar nivel altera fichas visibles, roles y documentos de todos los casos guardados, aunque la lista de casos sugiera unidades independientes |
| Media · M3 | Superior conserva lenguaje familiar dentro de un flujo de ajustes con unidad de inclusión | `#estudiante-voz`, `armarHoja()`, frente a `rolesPermitidos()` y `#aviso-acceso-superior`; inventario S y plantillas PDF | Cambia quién acuerda, pero no cambia la pregunta sobre quién habla; se mezclan destinatarios escolares y superiores |
| Media · M4 | La salida documental y el estado de acuerdo no comparten la misma condición de finalización | `erroresAcuerdo()`, `prepararDocumento()`, `prepararDocumentoTrabajo()`, `documentoParaCentro()`. Recorrido IP genera documento sin completar paso 3; documento centro trae acuerdos en blanco | «Ver documento» no significa «Acuerdos completos», mientras «Agregar otro caso» sí exige completarlos; es necesario conocer esta diferencia |
| Media · M5 | El mismo conjunto se denomina de formas distintas según la capa | Tabla de términos: «Para un estudiante» → «Apoyos individualizados» → «Adecuación de acceso»; en S «Ajustes razonables» con tipo `acceso`; práctica y Trabajo también usan «ajustes» | Los nombres no permiten deducir por sí solos si se está cambiando de ámbito, grupo o tipo de apoyo |
| Media · M6 | En Trabajo persisten enlaces y referencias educativas del pie | `footer.pie`: DUA, guía de estudiante, PACI y PAEC; la guía laboral solo se enlaza en su paso 1. Inventario estado Trabajo y captura de contexto | Una persona laboral encuentra ayuda que puede cambiarla de recorrido hacia educación, pese a estar en un ámbito separado |
| Media · M7 | La cantidad «{n} apoyos» no representa todos los bloques del paso 2 | `pintarApoyos()` suma solo acceso normal + taller; después muestra objetivos, DEC y práctica profesional según condiciones | La cifra puede leerse como total de opciones del paso, aunque excluye grupos visibles más abajo |
| Media · M8 | No hay una explicación conceptual general de «apoyos/adecuación» antes de elegir tipos | Intro individual ofrece un menú; guía escolar ordena DUA → acceso → objetivos y usa PACI/CIF; en S se conserva bloque objetivos sin fichas | La guía sí indica cómo proceder, pero quien no conoce la diferencia entre tipos tiene que inferirla de advertencias y tarjetas. No se afirma que falten todas las instrucciones |
| Baja · B1 | La adaptación de vocabulario de parvularia es parcial | `voc()` y `[data-voc]` frente a `#paso-clase-toggle` y título de `#guia-dua`; inventario P | «grupo/experiencia» convive con «clase» para el mismo recorrido |
| Baja · B2 | Guías y selecciones tienen varias entradas con nombres cercanos | DUA y estudiante enlazados en paso y pie; selección del curso en paso 3 y mochila; «Ver documento» se repite para tres modelos | Es repetición verificable, sin evidencia de que por sí sola impida completar. El alcance depende del lugar de apertura |
| Baja · B3 | Encabezados de objetivos permanecen en niveles sin fichas de ese tipo | P/S: `#objetivos` y sus mensajes; conteos cero, selector de asignatura oculto | Hay que abrir el bloque para leer por qué no ofrece adecuaciones en objetivos; un cero en catálogo no elimina el elemento de navegación |
| Baja · B4 | La mochila reúne ámbitos aunque los PDF y casos estén separados | `pintarSeleccion()`, diálogo `#mochila` con curso, estudiantes y Trabajo; dos entradas documentales y un respaldo global | Una selección laboral puede convivir con selecciones educativas en el contenedor; respaldo y «Borrar todo» tienen alcance mayor que la pestaña activa |

### Reproducibilidad y límites

Desde la raíz del repositorio, con Playwright disponible y Chromium instalado:

```bash
python3 -m http.server 8034
# En otra terminal:
node docs/auditorias/034-arquitectura/auditar.cjs
python3 scripts/validar_catalogo.py
```

El script usa `playwright` instalado; en el entorno de esta auditoría lo resuelve en `/opt/codex/cua_node/lib/node_modules/playwright` y Chromium en `/usr/bin/chromium`. Admite `PRIZMA_URL` y `CHROMIUM_BIN` para instalaciones diferentes. No instala dependencias ni modifica la página; todos los archivos generados quedan en esta carpeta. Sustituye solamente las evidencias generadas de esta auditoría al repetirlo. No se debe dirigir a un sitio con datos reales: los escenarios de matriz modifican estado **del navegador de prueba**, no archivos. La prueba parte de contextos aislados y usa valores ficticios.

[Script](auditar.cjs) · [Corte, fecha, versión de Chromium y huellas SHA-256](metodo.json) · [Revisión ponytail-review](ponytail-review.md).

Comprobado: seis descargas, IDs y conjuntos del catálogo, variantes de los cuatro niveles y Trabajo, guías, privacidad y documentos; ausencia de errores JavaScript en los recorridos; huellas de página/datos sin cambios. El validador informó «Catálogo correcto: 240 recomendaciones, 36 de 36 consideraciones DUA».

No se hizo: entrevistas o pruebas con personas reales, medición de tiempos o gestos humanos, revisión legal de las fuentes, auditoría WCAG integral, navegadores distintos de Chromium, dispositivos físicos, impresión en papel ni verificación exhaustiva de importación/migraciones, falta de red o almacenamiento lleno. Se inventariaron esas ramas mediante el código, sin declararlas probadas. Se observó la variante oscura en la matriz, pero los seis recorridos y sus capturas usan tema claro. No se definió ni implementó un diseño nuevo.
