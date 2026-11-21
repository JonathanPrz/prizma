# Bitácora de decisiones de Prizma

Esta bitácora muestra cómo están las cosas hoy, no el proceso. El proceso (tareas, pull requests y commits) está en git; si algo se borra, se recupera desde el historial. Solo cuenta lo que las tareas marcan como «integrada». «Decisión del dueño, 2026» indica una decisión que el dueño tomó y no siempre quedó escrita en una tarea.

## Índice

1. [Tipografía](#tipografía)
2. [Color y tema](#color-y-tema)
3. [Marca](#marca)
4. [Flujo y navegación](#flujo-y-navegación)
5. [Documentos e impresión](#documentos-e-impresión)
6. [Textos](#textos)
7. [Accesibilidad](#accesibilidad)
8. [Privacidad](#privacidad)
9. [Catálogo y normativa](#catálogo-y-normativa)

---

## Tipografía

### La interfaz usa Public Sans, autoalojada
- Hoy: `@font-face "Public Sans"` desde `vendor/fuentes/public-sans-latin.woff2` (variable, pesos 100 a 900, subconjunto latino, OFL), con `font-display: swap`. `--fuente` es `"Public Sans", "Public Sans respaldo", system-ui, …`. Todo lo que está fuera de `.hoja` la usa, incluidos botones, campos y diálogos.
- Por qué: con la letra del sistema cada equipo muestra una letra distinta (Segoe UI, SF, Roboto) y la jerarquía visual no se ve igual en todos. El dueño la eligió tras comparar 8 letras con el texto real de Prizma y dos revisiones adversariales.
- No volver a: Atkinson Hyperlegible, que se descartó porque al dueño le pareció fea (decisión del dueño, 2026). Google Fonts o cualquier letra pedida a otro sitio: rompe la regla de privacidad de que nada se pide a terceros.
- Historial: tareas 046 y 057 · PR #58 y #77

### La letra de respaldo está calibrada con métricas de Arial
- Hoy: `"Public Sans respaldo"` usa `local("Arial"), local("Liberation Sans"), local("Helvetica"), local("Arimo")`, con `size-adjust: 102.64%`, `ascent-override: 92.56%`, `descent-override: 21.92%` y `line-gap-override: 0%`.
- Por qué: el texto no debe saltar al cargar la fuente. Los valores se midieron contra las métricas de Arial en Chromium.
- No volver a: `local("Segoe UI")` en el respaldo, porque tiene otras métricas que las calibradas y en Windows desajustaba el cálculo.
- Historial: tareas 057 y 063 · PR #77 y #84

### Espaciado y números de la interfaz
- Hoy: sin `letter-spacing` negativo; `font-variant-numeric: tabular-nums` en `.n-sel`, `.conteo`, `#continuar-conteo` y fechas de los resúmenes. Título de la marca en peso 800.
- Por qué: Razón no registrada.
- Historial: tarea 057 · PR #77

### Los documentos usan Roboto, y la jerarquía va con tamaño y color
- Hoy: el PDF (pdfmake 0.2.10, MIT, en `vendor/pdfmake/`) usa Roboto. En el plan completo: cuerpo 10,5 pt `#1a2134`, h1 de 22 pt con un filete azul `#2456d6`, h2 de 15 pt azul. Los títulos llevan `keepWithNext`.
- Por qué: la negrita de Roboto en pdfmake pesa poco, así que la jerarquía se marca con tamaño, color y filetes. No se agregan fuentes ni dependencias.
- No volver a: confiar en la negrita para distinguir títulos. Tampoco 12 pt en el resumen para la familia, porque el caso denso pasaba a 2 páginas (PR #96).
- Historial: tareas 057 y 075 · PR #77 y #96

## Color y tema

### Base neutra, un solo acento azul y colores de estado
- Hoy: `--acento` `#2456d6` en claro y `#7aa2ff` en oscuro; `--papel` `#f6f7fa`, `--superficie` `#ffffff`, `--tinta` `#1a2134`. El azul marca solo la acción principal, los enlaces, el foco y lo elegido. Rojo (`--error`), verde (`--solida`) y ámbar (`--alerta`) solo comunican estado.
- Por qué: que quien entra a hacer adecuaciones sepa qué mirar primero (hallazgos V1, V3, V4, V5, V8, C1 y H4 de la auditoría de interfaz, tarea 050).
- No volver a: usar color de estado como decoración, ni azul en botones secundarios.
- Historial: tareas 050 y 053 · PR #70 y #73

### Modo oscuro en gris carbón, en tres niveles
- Hoy: página `#16181d`, tarjeta `#1f2229`, diálogo `#2a2e37` (`--elevado`); texto `#e8eaef` y `#adb2bd`; líneas `#363a45`.
- Por qué: tres niveles distinguen página, tarjeta y diálogo sin depender de bordes pesados.
- No volver a: negro puro (se probó y el dueño prefirió el gris carbón, decisión del dueño, 2026) ni azul marino.
- Historial: tarea 053 · PR #73

### El tema se cambia con un botón de sol y luna
- Hoy: un botón con ícono de luna o de sol en SVG en línea (`#tema`). Solo hay claro y oscuro: en la primera visita se sigue el dispositivo y después se guarda la elección en `localStorage` (`prizma.tema`).
- Por qué: cabecera más limpia y sin la opción intermedia «Según mi dispositivo».
- No volver a: un selector con tres opciones («Tema: Según mi dispositivo / Claro / Oscuro»).
- Historial: tarea 031 · PR no registrado en la tarea

### Los colores de los principios DUA van en pequeño y con significado
- Hoy: Compromiso `#21633b`, Representación `#693b97`, Acción y expresión `#005873` en claro; `#8bdaa1`, `#d2afff` y `#76d7ee` en oscuro. Van junto al nombre del principio, nunca en botones.
- Por qué: son la única excepción al acento único porque identifican los tres propósitos. La tarea 047 los ajustó porque los anteriores no correspondían a los de CAST.
- Historial: tareas 047 y 053 · PR #62 y #73

### Lo elegido nunca depende solo del color
- Hoy: lo elegido lleva fondo `--acento-suave` y un ✓ (`aria-hidden`); la tarjeta elegida, además, una barra izquierda de 4 px `--acento` y el botón «✓ Elegida». Cada aviso lleva ícono y texto. El ✓ se reserva para «elegido»: «Acuerdos completos» no lo usa.
- Por qué: WCAG 2.2 AA. Al quitar el visto bueno automático de los botones activos se evitó que todo pareciera elegido. La barra de 4 px reemplaza al borde grueso completo para tener menos cajas.
- No volver a: borde azul grueso alrededor de toda la tarjeta elegida.
- Historial: tareas 053, 058 y 076 · PR #73, #78 y #97

### La hoja del documento es blanca también en modo oscuro
- Hoy: `--hoja-*` valen para ambos modos (`--hoja` `#ffffff`, `--hoja-tinta` `#111111`).
- Por qué: se imprime y se lee como papel.
- Historial: tarea 053 · PR #73

## Marca

### Logo: rejilla 2×2 girada con un círculo arriba y tres cuadrados
- Hoy: SVG en línea (`viewBox 0 0 100 100`), una rejilla 2×2 girada 45° y apoyada en un vértice. Arriba, un círculo en `currentColor` (la persona); izquierda, derecha y abajo, tres cuadrados en los colores de los principios DUA (`--compromiso`, `--representacion`, `--accion`). Sin curvas ni detalles «humanos».
- Por qué: el logo anterior de 8 cuadrados usaba rosado, cian y violeta, que no son los colores de los principios. Aprobado tras dos revisiones adversariales.
- No volver a: el prisma de 9 triángulos (tarea 003) ni los 8 cuadrados (decisión del dueño, 2026).
- Historial: tareas 003 y 059 · PR #79

### El nombre sigue siendo Prizma
- Hoy: título «Prizma · Apoyos con fuente para aprender, hacer la práctica y trabajar en igualdad»; el mismo texto como subtítulo bajo el logo.
- Por qué: Razón no registrada. La auditoría del nombre (tarea 035) comparó seis candidatos y no recomendó ninguno; el dueño siguió con Prizma.
- Historial: tareas 033, 035 y 051 · PR #33, #36 y #71

## Flujo y navegación

### Un solo selector de nivel con cinco opciones
- Hoy: `#nivel` tiene Educación parvularia, básica (por defecto), media (CH y TP), superior (universidad, IP o CFT) y Práctica y trabajo. Siempre está visible. Elegir «Práctica y trabajo» abre el ámbito Trabajo sin tocar el nivel educativo guardado.
- Por qué: menos modos. La práctica es otro rol (coordinación, primer empleo, ajustes en el trabajo) y no una asignatura; las acciones DUA y las adecuaciones de clase no le sirven.
- No volver a: la pantalla «¿Dónde quieres apoyar?» y el botón «Cambiar ámbito» (ya no existen en `index.html` ni `app.js`). Una media separada en CH y TP (tarea 020).
- Historial: tareas 013, 020, 036 y 051 · PR #20, #35 y #71

### «Sin indicar» ya no es un nivel
- Hoy: no hay opción vacía. El selector arranca en básica y se dice a la vista.
- Por qué: «Sin indicar» se trataba como básica sin decirlo (decisión del dueño, 2026).
- No volver a: un nivel vacío con comportamiento oculto.
- Historial: tarea 069 · PR #90

### El nivel es propio de cada estudiante
- Hoy: cada caso guarda su `nivel` y las fichas, el vocabulario y los roles del acuerdo usan el del caso. El nivel general sirve para DUA y como valor inicial de casos nuevos. Cambiar el nivel de un caso no pide confirmación; las fichas que dejan de aplicar quedan guardadas y ocultas, y un aviso las cuenta. Los datos antiguos migran a básica.
- Por qué: una docente con estudiantes de distintos niveles no podía reflejarlo. Decidido por un consejo de 10 especialistas.
- No volver a: un nivel único para todos los casos con confirmación al cambiarlo.
- Historial: tareas 036 y 069 · PR #35 y #90

### Dos pestañas en Educación: «Para el curso (DUA)» y «Para un estudiante»
- Hoy: `role="tab"` con flechas del teclado; la activa se guarda y va en el hash (`#dua`, `#apoyos`). En superior la segunda se llama «Ajustes razonables».
- Por qué: separar lo que se hace para todo el curso de lo que se acuerda para una persona. El nombre «Apoyos individualizados» se cambió porque no se entendía.
- No volver a: «Apoyos adicionales» como pestaña o bloque (no tenía fichas; decisión del dueño, 2026).
- Historial: tareas 016, 018, 036 y 069 · PR #16, #18 y #90

### Cada flujo tiene tres pasos: Describe, Elige, Acuerda
- Hoy: el indicador de pasos son 3 segmentos iguales de 44 px («1 Describe», «2 Elige», «3 …») que llevan a cada paso; el actual tiene fondo `--acento-suave`, negrita y `aria-current="step"`, los hechos llevan «✓» antes del número y los pendientes van en `--tenue`. Es fijo (`sticky`) bajo la cabecera, salvo en pantallas de 40 rem o menos, donde va estático. En «Para un estudiante» y en Práctica y trabajo se trabaja un caso completo antes de agregar el siguiente; hasta 10 casos.
- Por qué: menos desplazamiento y que cada caso reciba su importancia. Los segmentos se leen como pasos y no como enlaces sueltos. Se descartaron los filtros laterales de apoyos (el dueño no los percibía como un flujo claro).
- No volver a: filtros laterales ni los 3 pasos «Tu clase / Para todos / Para un estudiante» de la tarea 014; enlaces subrayados sueltos como indicador; círculos con conectores (no caben bien en el teléfono).
- Historial: tareas 014, 016, 023, 029, 036 y 076 · PR #16, #23, #29, #35 y #97

### El paso 1 de DUA se aplica al instante, sin «Guardar»
- Hoy: un solo oyente en `#perfil` escribe en `estado.perfil` y `estado.necesidades` y repinta resultados. Existe «Borrar respuestas». Una línea viva resume lo marcado.
- Por qué: el dueño marcó taller sin guardar y creyó que Prizma lo ignoraba (decisión del dueño, 2026). El aviso de «cambios sin guardar» de la tarea 066 solo parchaba el problema.
- No volver a: el botón «Guardar» del paso 1 de DUA ni `borradorDua`.
- Historial: tareas 066 y 068 · PR #87 y #89

### «Momento» y «Para qué» son filtros de vista en el paso 2
- Hoy: «Antes», «Durante» y «Después» en una fila de tres columnas, sin fondo gris (los botones conservan el borde de control); «En toda la clase» ocupa el ancho de las tres. Sin conteos en los botones. «Quitar filtros» solo se ve con filtros activos. Funcionan al instante.
- Por qué: no describen la clase; se cambian muchas veces al recorrer las acciones, y en el paso 1 obligaban a guardar y reabrir.
- No volver a: ponerlos en el paso 1.
- Historial: tareas 037, 056 y 076 · PR #37, #76 y #97

### El paso 1 en el teléfono va en una columna, con casillas de 44 px
- Hoy: bajo `30rem`, las casillas de «¿Qué harán principalmente?» y «¿Cómo mostrarán lo que aprendieron?» van en 1 columna y miden 44 px; bajo `34rem`, los pasos (`.paso`) no llevan borde ni fondo y se separan por espacio (`gap: 2rem`). El paso 1 a 390 px, con las necesidades plegadas, mide unos 856 px (límite 860 en las pruebas). En «Para un estudiante» no se reserva el hueco del selector de nivel en el teléfono; en escritorio (desde 48,0625 rem) sí, para que las pestañas no se muevan.
- Por qué: a 390 px las casillas medían de 24 a 34 px y algunas etiquetas se partían. Se mantiene el aire de 16 px bajo la ayuda que pidió la tarea 071, por eso el límite subió de 720 a 860 px (el dueño lo aprobó). El hueco reservado dejaba espacio en blanco sobre las pestañas.
- No volver a: apretar el aire a 2 px para caber en 720 px.
- Historial: tareas 071 y 076 · PR #92 y #97

### Los resultados DUA van en carpetas por momento
- Hoy: carpetas Antes, Durante, Después y En toda la clase. En cada una van primero las acciones que responden a lo marcado; el resto queda en «Ver las otras N». Si hay necesidades marcadas, se muestra «Para lo que marcaste». Los filtros solo quitan carpetas o tarjetas.
- Por qué: con un contexto todas las acciones empatan, así que un «orden de prioridad» era casi falso. Lo decidió un debate de 10 especialistas.
- No volver a: «Empieza por:» en DUA (mostraba las tres primeras acciones del catálogo como «Responden mejor a lo que describiste», que era falso), la lista plana por filtro de momento, ni «Recomendadas para tu clase» con tope de 6. «Empieza por:» se mantiene en adecuaciones y trabajo.
- Historial: tareas 062, 065 y 067 · PR #83, #86 y #88

### El contexto ordena, no excluye
- Hoy: lo marcado en actividad y evidencia sube las acciones que coinciden y la tarjeta dice por qué. Solo el nivel oculta acciones. Ningún cruce de filtros deja la pantalla en cero.
- Por qué: no sesgar la clase y no dejar pantallas vacías.
- Historial: tareas 017, 065 y 067 · PR #17, #86 y #88

### En «Antes» siempre hay una ficha base abierta
- Hoy: `dua-8-1-meta-visible` (y `dua-8-1-parv`) llevan `base: true`; con algo marcado cuentan como «responde» y se muestran abiertas. Si hay meta escrita, la tarjeta dice «Ya escribiste tu meta en el paso 3…». El validador exige que ninguna ficha DUA tenga `contextos` vacío sin ser base y que haya una sola base por nivel.
- Por qué: 4 fichas de «Antes» nunca respondían a lo marcado y quedaban escondidas; en 14 de 35 combinaciones típicas ninguna ficha de «Antes» respondía.
- Historial: tarea 070 · PR #91

### Una columna de 46 rem con tarjetas en lista y un panel de lo elegido solo en escritorio
- Hoy: el contenido, la cabecera, los avisos y el pie comparten una columna de `46rem` (más 48 px de margen). Columna y panel se centran juntos y la columna no se mueve entre pasos ni pestañas; por eso en el paso 1 y en «Para un estudiante» queda corrida a la izquierda en escritorio. `.bajada` y párrafos largos a `70ch`. `.tarjetas` en una columna. Los pasos y avisos de la tarjeta se ven siempre; solo se pliegan «Por qué funciona» y las fuentes. Desde `80rem`, en los pasos 2 y 3 de «Para el curso (DUA)», aparece a la derecha el panel «Lo que elegiste» (`aside`, 17 rem, `position: sticky`): conteo, elegidas por momento (máximo 2 líneas cada una) y un botón («Ir a tu selección»; en el paso 3, «Ver documento»). Va después de la columna en el DOM, así que el orden de foco y de lectura no cambia. Reemplaza a la barra de continuar mientras se ve. Desaparece bajo `80rem`, con zoom alto y en proyección; no existe en «Para un estudiante» ni en Práctica y trabajo.
- Por qué: la gente se perdía (hallazgos H1, V0, V7, C6 y C7 de la auditoría de interfaz) y la jerarquía y la pulcritud mandan sobre el tamaño de letra. A 1280 px el contenido ocupaba unos 500 px y la cabecera todo el ancho; el dueño reabrió la tarea 054 y el consejo de la tarea 076 (6 especialistas) eligió un panel limitado: D (panel limitado) 15 puntos, A (columna sola) 12, B (panel siempre) 9, C (tarjetas en 2 columnas) 0. Las decisiones anteriores son antecedentes, no vetos.
- No volver a: tarjetas en 2 columnas (el orden visual difiere del de foco y lectura, WCAG 1.3.2 y 2.4.3, y las alturas desiguales se leen en zigzag); un panel siempre visible (duplica la barra de continuar y la mochila); esconder los pasos de las tarjetas.
- Historial: tareas 050, 054 y 076 · PR #70, #74 y #97

### La barra de continuar es pegajosa y dice lo que hace
- Hoy: `.barra-continuar` es `position: sticky; bottom: 0`, de ancho completo, y se detiene antes del pie. En DUA se oculta mientras el panel «Lo que elegiste» está a la vista (desde 80 rem); en el teléfono y bajo 80 rem queda como siempre. El conteo se oculta en el paso 1 con 0 elegidos. En DUA dice «N elegidas»; en el paso 3 de estudiante y trabajo dice «Guardar acuerdos» hasta que están completos, y luego «Ver documento» («Ver documento para el centro» en práctica).
- Por qué: la barra fija quedaba bajo el pie como una pieza suelta. «0 acciones» se leía como si no hubiera acciones.
- No volver a: `position: fixed` con `padding-bottom` en el cuerpo.
- Historial: tareas 055, 060, 066 y 076 · PR #75, #80, #87 y #97

### La página no salta al hacer clic
- Hoy: el ajuste de posición del `focusin` solo actúa con foco de teclado (`:focus-visible`). Los botones que cambian de estado se actualizan en su lugar, sin recrearse ni llamar `.focus()`.
- Por qué: al presionar una necesidad la página se movía entre 3 y 27 px.
- Historial: tarea 062 · PR #83

### Áreas como acordeón y frecuencia como control segmentado
- Hoy: cinco áreas en una columna; las situaciones se abren bajo su botón con «+» o «−». Un área con situaciones marcadas se ve elegida («(2 marcadas)») esté abierta o cerrada. La frecuencia (No aplica, A veces, Seguido, Casi siempre) es un control segmentado de radios nativos, de 36 px de alto y letra de 14 px. Abrir o cerrar un área no borra datos.
- Por qué: las cajas de 44 px por opción hacían pesar más las respuestas que la pregunta (12 cajas por área).
- No volver a: un título de frecuencia aparte, ni que abrir un área borre lo marcado.
- Historial: tareas 039, 041, 058 y 061 · PR #39, #78 y #82

### La modalidad de comunicación sube sus apoyos
- Hoy: «¿Qué usa hoy para comunicarse o acceder?» pone primero los apoyos de acceso o ajustes de trabajo que le corresponden.
- Por qué: marcar «Braille» no subía la ficha de Braille. `acc-6-braille` sigue excluida con ampliación.
- Historial: tarea 048 · PR #72

### Los apoyos individuales conversan con el DUA
- Hoy: si una acción DUA elegida cubre un apoyo, la tarjeta del apoyo lo dice, y al revés. Si dos o más estudiantes comparten un apoyo, se ofrece «Agregar al curso». Cada necesidad DUA tiene sus `dimensiones` relacionadas.
- Por qué: una barrera repetida en varios estudiantes suele estar en el diseño de la clase (DUA 3.0).
- Historial: tareas 023 y 029 · PR #23 y #29

### De la práctica al primer empleo se crea un caso nuevo
- Hoy: «Preparar su primer empleo» crea un caso de etapa `trabajo` con `origen` apuntando al de práctica, que no cambia. Copia solo iniciales, situaciones y frecuencias, «¿Qué le ayuda?» y modalidad. No copia la voz, `compartir`, tipo de puesto, fichas, acuerdo, roles ni notas.
- Por qué: cambiar la etapa borraba roles sin aviso y se perdía la historia. La persona adulta debe volver a decir su voz y el centro de práctica no es el empleador.
- No volver a: cambiar la etapa de un caso existente.
- Historial: tarea 052 · PR #81

### Una guía por pestaña, sin ventanas automáticas
- Hoy: cada pestaña abre su guía con un enlace. En Práctica y trabajo hay una sola, «Guía de Práctica y trabajo», con índice, «Antes de empezar» y secciones práctica, paso al primer empleo y trabajo.
- Por qué: las ventanas al cargar o al cambiar de pestaña eran invasivas, y la misma guía aparecía en tres lugares.
- No volver a: avisos emergentes al entrar a una pestaña ni dos guías separadas por etapa.
- Historial: tareas 012, 021, 022 y 064 · PR #21, #22 y #85

### Proyección al curso en pantalla completa
- Hoy: «Proyectar al curso» pide pantalla completa (sigue sin ella si falla), muestra solo las acciones DUA visibles, agranda la letra al 125 % y deja una franja «Modo proyección: se ocultan los datos de estudiantes» con «Salir de proyección». Sale con ese botón o con Esc.
- Por qué: antes, sin estudiantes cargados no cambiaba nada visible y parecía que no funcionaba. Protege los datos de estudiantes frente al curso.
- Historial: tarea 056 · PR #76

### Mi mochila: agrupada, separada por ámbito y sin edición de notas del curso
- Hoy: ícono de mochila en SVG. Las acciones del curso se agrupan por momento y los apoyos por estudiante. La nota de una acción del curso se lee en la mochila pero se edita en el paso 3 («Editar en el paso 3»). Las notas de apoyos y ajustes se escriben en «Agregar nota». Respaldo y borrado están en un `details` «Datos y respaldo». La mochila muestra solo el ámbito activo y «Borrar los datos de Educación» o «de Práctica y trabajo».
- Por qué: con 6 acciones la mochila medía 2.062 px a 390 px y duplicaba la lista del paso 3. La mochila no edita notas del curso (decisión del dueño, 2026). La mezcla de ámbitos exponía datos de uno en el otro.
- No volver a: un `textarea` abierto por acción del curso en la mochila.
- Historial: tareas 014, 031, 036 y 070 · PR #35 y #91

## Documentos e impresión

### Tres documentos, con el diálogo «¿Qué documento necesitas?»
- Hoy: «Guion de clase (1 página)» para usar en la sala; «Plan completo» para la reunión con PIE y familia y para archivar; «Resumen para la familia», solo en Educación. Viene marcado el guion si no hay estudiantes con datos, y el plan completo si los hay.
- Por qué: el documento de un caso real ocupaba 5 páginas y 826 palabras, sin versión breve. El Decreto 83 pide que el plan se elabore con la familia y quede a su disposición.
- Historial: tareas 070 y 072 · PR #91 y #93

### El resumen para la familia es una hoja por estudiante en lenguaje claro
- Hoy:
  - una hoja por estudiante, sin tabla CIF, códigos DUA ni fuentes, y no se ofrece en superior;
  - «Qué haremos en el colegio» muestra como máximo 6 apoyos, los que más responden a sus situaciones, con «El plan completo tiene N apoyos.» y la aclaración «Estas son las indicaciones para el equipo del colegio. No tienen que hacerlas en casa.»;
  - lo acordado para la casa sale escrito; si está vacío, van 2 líneas y «Lo completamos juntos en la reunión.»;
  - el caso denso (6 situaciones y 8 apoyos) cabe en una página.
- Por qué: los títulos de los apoyos son instrucciones para la docente y la familia las leía como órdenes. No reemplaza el plan ni el PACI.
- Historial: tareas 072, 073 y 075 · PR #93, #94 y #96

### El paso 3 «Acuerdos» recoge lo que pide el Decreto 83
- Hoy:
  - «¿Qué esperamos ver en la próxima revisión?» es obligatoria. Su ayuda trae un ejemplo con la fecha de revisión: «Para el 15 de diciembre, termina 3 de 4 guías con la tarea dividida en partes.»
  - «¿Quién coordina estos apoyos?» es opcional y ofrece los roles del acuerdo, salvo estudiante y familia.
  - «¿Qué probarán en casa?» es opcional y no aparece en superior.
  - En el plan completo:
    - no se imprimen filas «No informado»;
    - va «Nivel del curso» solo si el curso tiene contenido;
    - la fila «Documentos» (PACI, PAEC, Protocolo DEC) sale solo si hay alguno;
    - las fichas van numeradas, y la tabla de barreras muestra esos números.
- Por qué: el dueño no supo qué escribir en «¿Cómo sabremos que funciona?» y puso «Falta un mecanismo de progreso.». El Decreto 83 pide, entre los mínimos del PACI, responsables y estrategias de seguimiento (`decreto-83-2015.md`, líneas 469-497). El plan de un caso real tenía 8 páginas, con una página vacía, filas «No informado» y listas repetidas; ahora tiene 5.
- No volver a: un responsable por cada apoyo, porque es demasiado trabajo para la docente. Tampoco botones de ideas para el criterio, porque empujan respuestas genéricas (consejo del 21-11-2026).
- Historial: tareas 055 y 074 · PR #75 y #95

### El plan completo y el resumen tienen estética propia
- Hoy:
  - plan completo: márgenes de 51/60/51/54 pt, títulos azules `#2456d6` con filete, encabezados de tabla `#e8eefc`, línea del dato en `#4f586e` y «Mi nota» con borde azul;
  - resumen para la familia: cuerpo de 11,5 pt con interlineado 1,15, título de 24 pt azul, secciones de 14 pt y un cuadro `#f4f6fc` con la próxima conversación y lo que esperan ver.
- Por qué: en los PDF todo era negro y gris, y los títulos casi no se distinguían. Solo cambió el estilo: el contenido y el orden quedaron como los dejó la tarea 074.
- Historial: tarea 075 · PR #96

### Sin acuerdos completos, el documento va como borrador
- Hoy: el documento (y el del centro de práctica) lleva arriba «Borrador: acuerdos sin completar». Se permite generarlo.
- Por qué: decisión del dueño del 16-11-2026, para no bloquear el trabajo pero dejar claro que falta el paso 3.
- Historial: tarea 036 · PR #35

### Documento para el centro de práctica
- Hoy: en un caso de práctica, el botón dice «Preparar documento para el centro» y el documento nombra roles de la institución, el centro y el estudiante.
- Por qué: la discapacidad no termina al estudiar; el centro necesita saber qué le corresponde (decisión del dueño, 16-11-2026).
- Historial: tarea 028 · PR #27

### El PDF se genera en el navegador y la vista previa es la hoja
- Hoy: pdfmake 0.2.10 (MIT) en `vendor/pdfmake/`, cargado solo al descargar. Texto real, con número de página. «Imprimir» usa la hoja de estilos de impresión. El nombre del archivo usa la fecha local del equipo.
- Por qué: sin servidor y sin enviar datos. Antes la fecha en UTC daba el día siguiente de noche en Chile.
- Historial: tareas 001 y 004 · PR #1 y no registrado

## Textos

### Las situaciones son catorce y describen dónde aparece la barrera
- Hoy: 14 situaciones en 5 áreas, preguntadas como el lugar de la clase donde aparece la barrera, nunca como rasgo del estudiante. Los números no cambian porque los datos guardados los usan.
- Por qué: evitar el lenguaje de déficit y no pedir diagnósticos. Las áreas 1 a 4 siguen el *SEND Code of Practice* que usa la EEF; el área 5 suma contexto de la CIF y la identidad de DUA 3.0. La 14 («Tareas con poco desafío») se sumó en la tarea 025.
- Historial: tareas 025 y 058 · PR #25 y #78

### «¿Qué quieres resolver?» describe el diseño de la clase
- Hoy: nueve opciones (`motivacion`, `comprension`, `tareas-largas`, `participacion`, `lectoescritura`, `evaluar`, `lengua-cultura`, `clima`, `desafio`) redactadas como una barrera del diseño, sin repetir consideraciones ni dimensiones entre ellas. En el paso 1 se muestran con un texto `corto`.
- Por qué: las opciones anteriores ponían el problema en los estudiantes y se pisaban entre sí.
- Historial: tareas 011, 047 y 068 · PR #62 y #89

### Español de Chile, un término por cosa
- Hoy: tuteo y frases cortas; verbos que dicen qué pasa. Glosario fijo: «Acción DUA», «Apoyo», «Adecuación de acceso», «Adecuación en los objetivos», «Ajuste razonable», «Ajuste en el trabajo», «Situación». «Ficha» y «recomendación» no se muestran.
- Por qué: se usaban términos distintos para lo mismo (hallazgo M5 de la auditoría de arquitectura).
- Historial: tarea 036 · PR #35

### El vocabulario sigue al nivel
- Hoy: la página y el documento usan `voc()` con el nivel activo: en parvularia, «experiencia de aprendizaje»; en superior, «Ajustes razonables» y sin familia («¿Qué dice el estudiante?»).
- Por qué: «clase», «curso» y «estudiantes» no calzan en parvularia, y en superior no hay adecuaciones del Decreto 83.
- Historial: tareas 002, 013 y 036 · PR #2, #13 y #35

### El estado «Por revisar» solo aparece si hubo acuerdo
- Hoy: «JP · Por revisar» se escribe en texto visible. Un caso sin acuerdo queda «Sin acuerdos» y no se avisa de un cambio posterior. El aviso de cambio de nivel usa el nombre legible («Cambiaste a educación parvularia.»).
- Por qué: decir «Cambiaste el caso después del acuerdo» sin que hubiera acuerdo era falso.
- Historial: tareas 058 y 071 · PR #78 y #92

## Accesibilidad

### Reglas de WCAG 2.2 AA en toda la página
- Hoy: foco visible de 3 px (`--enfoque`), ningún texto visible bajo 14 px (0,875 rem), objetivos táctiles de al menos 24 px en escritorio y de 44 px en el teléfono (bajo 34 rem) para las casillas del paso 1, «Por qué funciona y fuentes», Elegir, Quitar, Editar y los `summary` de carpetas; sin desplazamiento horizontal a 390 px, `prefers-reduced-motion` respetado.
- Por qué: regla del proyecto (AGENTS.md).
- Historial: tareas 014, 053, 060, 061 y 076 · PR #73, #80, #82 y #97

### Los radios nativos se conservan
- Hoy: las frecuencias son `input type="radio"` ocultos visualmente, no con `display: none`; las flechas del teclado y los lectores de pantalla funcionan.
- Por qué: un control segmentado hecho con botones habría perdido el teclado nativo.
- Historial: tareas 058 y 061 · PR #78 y #82

### Los errores y avisos quedan junto a lo que explican
- Hoy: el error «Elige al menos un rol» va bajo la pregunta, con `aria-describedby` y `aria-invalid`. Los conteos usan `aria-live`.
- Por qué: en el teléfono el error quedaba lejos de la pregunta y la barra de abajo lo tapaba.
- Historial: tarea 055 · PR #75

## Privacidad

### Sin servidor, sin cuentas, sin analítica, y nada se pide a terceros
- Hoy: los datos viven en `localStorage` (siempre con `try/catch`) o en archivos que la persona descarga. Letra, PDF y todo lo demás se sirven desde el repositorio. Una prueba comprueba que la página no pide nada a otros sitios.
- Por qué: regla 1 de AGENTS.md. Una revisión adversarial encontró que Google Fonts pedía recursos a terceros.
- No volver a: scripts desde CDN ni hojas de estilo externas.
- Historial: tarea 046 · PR #58

### Solo iniciales, sin diagnósticos, con un aviso por ámbito
- Hoy: el campo de iniciales acepta 1 a 4 letras y dice «Solo iniciales. No escribas el nombre.». Se describen barreras y tareas, nunca diagnósticos. Educación avisa de estudiantes y de la Ley 21.719; Trabajo avisa de la reserva del Código del Trabajo (art. 154 ter).
- Por qué: el aviso de Educación hablaba de estudiantes dentro de Trabajo (hallazgo A2 de la auditoría de arquitectura).
- Historial: tareas 009, 036 y 064 · PR #35 y #85

### Un solo respaldo en JSON, validado
- Hoy: «Guardar respaldo» descarga `prizma-respaldo-AAAA-MM-DD.json` y «Abrir respaldo» lo valida contra el catálogo y los datos conocidos. Un solo archivo abarca ambos ámbitos y lo dice. Los respaldos antiguos se abren; las fichas que ya no existen se avisan y no se cargan.
- Por qué: si se borran los datos del navegador o se cambia de computador, se pierde todo.
- Historial: tareas 001 y 004 · PR #1

### La persona decide qué se comparte
- Hoy: la guía de práctica y trabajo dice que pedir un ajuste no autoriza entregar el diagnóstico ni el expediente (Ley 19.628; Ley 21.719 desde el 1 de diciembre de 2026). El documento para el centro de práctica y el paso a primer empleo no copian lo que la persona no autorizó.
- Por qué: cuidar la decisión de la persona de contar o no su situación.
- Historial: tareas 028, 052 y 064 · PR #27, #81 y #85

## Catálogo y normativa

### Alcance: educación, práctica profesional y trabajo
- Hoy: parvularia, básica, media (CH y TP), superior (universidad, IP y CFT), práctica profesional y ajustes en el trabajo. Prizma no asesora sobre el cumplimiento de la cuota de la Ley 21.015 ni planifica la clase.
- Por qué: «la discapacidad no termina al estudiar» (decisión del dueño, 16-11-2026 para práctica y trabajo; 15-11-2026 para superior).
- Historial: tareas 013, 028, 032 y 051 · PR #27, #32 y #71

### Superior usa ajustes razonables, no adecuaciones del Decreto 83
- Hoy: sin bloque de objetivos; una línea explica que se hacen ajustes razonables (Ley 21.091 art. 2 e, Ley 20.422 art. 39, Ley 21.545 art. 21, CDPD art. 2 y 24). La ficha `sup-coordinar` no existe como ficha: es la regla de cómo se acuerdan, y va en el aviso.
- Por qué: en superior no rigen las adecuaciones curriculares.
- No volver a: `sup-coordinar` como ficha elegible.
- Historial: tareas 013 y 021 · PR #21

### Las adecuaciones en los objetivos son el último recurso
- Hoy: 13 fichas con los 5 tipos del Decreto 83, dentro de «Si el acceso no basta», con el aviso de que se deciden con el equipo y la familia y se registran en el PACI. La eliminación va al final. En parvularia y superior se muestra una línea en vez del bloque.
- Por qué: el Decreto 83 las ordena después de las de acceso; en parvularia preferentemente no se adecúan.
- Historial: tareas 010, 036 y 069 · PR #35 y #90

### Desregulación: nunca contención física y siempre el protocolo
- Hoy: 9 fichas en antes, durante y después. Cada una termina con «Sigue el protocolo de tu establecimiento». Se muestran siempre, con enlace «Ver apoyos ante una crisis». Prizma nunca da instrucciones de contención física ni recomienda suspender, reducir jornada ni condicionar matrícula.
- Por qué: Circular 586 (Mineduc 2025) y la guía del Reino Unido de 2019. Se quitó la guía británica de `dec-durante-dignidad` porque no respaldaba mover al curso.
- Historial: tareas 010 y 069 · PR #90

### Cada ficha tiene fuente y tipo de respaldo
- Hoy: el catálogo tiene 236 fichas (88 de acceso, 61 de trabajo, 42 DUA, 23 de práctica profesional, 13 de objetivos, 9 de desregulación) y `validar_catalogo.py` exige al menos una fuente por ficha. El respaldo es una etiqueta: investigación sólida, moderada, consenso de expertos, orientación oficial o norma legal. Sin fuente, no entra.
- Por qué: es la promesa de la página («apoyos con fuente») y se verificó ficha por ficha contra su fuente.
- Historial: tareas 018, 019, 027 y 045 · PR #18, #19, #26 y #55

### Una acción DUA por consideración y por nivel
- Hoy: las 36 consideraciones DUA 3.0 tienen una acción cada una en cada nivel (el validador lo exige). La tarjeta muestra la consideración dentro de la acción, con el nombre oficial del principio y «Qué busca» bajo el título.
- Por qué: una tarjeta de consideración con una sola acción adentro no aporta. Se conservaron las acciones, que le gustan al dueño.
- Historial: tarea 047 · PR #62

### No se copia a CAST, a la OMS ni a la EEF
- Hoy: toda ficha y todo texto de DUA se redactan con palabras propias. Ningún agente descarga `cast.org` ni `udlguidelines.cast.org`. Las fuentes abiertas para explicar las consideraciones se reunieron en `docs/fuentes/codex/dua/` (8 fuentes con DOI verificados en Crossref).
- Por qué: los términos de uso de CAST prohíben copiar y recorrer su sitio con programas.
- Historial: tarea 045 · PR #55

### Práctica profesional: tres roles y un solo nivel con el trabajo
- Hoy: 23 fichas `practica-profesional` con subtipos `institucion`, `centro` y `estudiante`, dentro del caso y solo en media y superior; las de trabajo (61 fichas) cubren cuatro subtipos y fichas de proceso. Todo vive bajo el nivel «Práctica y trabajo».
- Por qué: la ley chilena y los referentes internacionales separan lo que hace el liceo o la institución, lo que hace el centro de práctica y lo que prepara el estudiante.
- Historial: tareas 027, 028, 030, 032 y 051 · PR #26, #27, #32 y #71

### «Necesita más desafío» se apoya en fuentes sobre desarrollo laboral
- Hoy: `tr-autonomia`, `tr-responsabilidades`, `tr-desarrollo` y `tr-mentoria-desafio` citan estudios y guías sobre subempleo y desarrollo de carrera de personas trabajadoras con discapacidad.
- Por qué: la fuente anterior era una revisión sobre adultos con altas capacidades, que no trata de discapacidad.
- Historial: tarea 049 · PR #67

### La media CH y TP comparten fichas; la clase práctica se marca aparte
- Hoy: un solo nivel «Educación media (CH y TP)». «La clase es en taller, laboratorio o terreno» es una casilla del paso 1 que afecta a las dos pestañas y sube las fichas `prac-*`.
- Por qué: lo que cambia las barreras es el tipo de actividad, no CH o TP. En la tarea 025 se evitó que la práctica sume fichas sin relación.
- Historial: tareas 018, 019, 020 y 025 · PR #20 y #25
