# Tarea 050 · Auditoría de la interfaz de Prizma

Base auditada: `d80b6a9`. Chromium 156.0.8078.79, interfaz en español de Chile, datos ficticios y un contexto nuevo por combinación de ancho y tema. La prioridad es que se reconozcan el propósito, el paso actual y la siguiente acción. Evalué la primera impresión con una lectura simulada de cinco segundos sobre la primera pantalla visible.

## Resumen

1. **V0 · El botón para guardar aparece antes que el formulario en el teléfono.** En DUA, Básica, Superior y Trabajo, la barra fija pide guardar mientras el primer paso todavía está fuera de vista o debajo de la propia barra. En los casos, «Casos» y «Quitar» también anteceden a «Describe». Haría visible qué completar junto al paso activo.
2. **H1 · Se pueden ver los ajustes con «1 Describe» todavía activo.** Al guardar un caso, el foco llega a «2. Ajustes sugeridos» en el escenario de Trabajo medido, mientras el indicador y la barra pueden seguir pidiendo guardar la descripción. Vincularía ambos a la etapa que se acaba de abrir.
3. **C7 · Los errores quedan lejos de lo que hay que corregir.** Al guardar acuerdos vacíos, Trabajo enumera cuatro problemas junto al botón final. El usuario debe volver a los roles, las fechas y el criterio por su cuenta.
4. **V5 · Hay demasiados recuadros antes de elegir un apoyo.** DUA tiene 42 elementos con borde en el estado inicial medido a 390 px. La navegación, los pasos, los filtros y las tarjetas usan bordes a la vez. La primera reducción debería ser en bordes de agrupación.
5. **C1 · En la mochila de Trabajo, el documento se pierde entre las acciones de administración.** «Ver documento de trabajo» comparte el estilo de contorno con «Guardar respaldo» y «Abrir respaldo». Agruparía respaldo y borrado, y destacaría la acción para revisar el documento cuando hay ajustes.

Conviene conservar las dos opciones equivalentes del inicio, los recuentos de los grupos plegados, los mensajes de recuperación del respaldo y el borde de foco de 3 px. Las acciones principales muestreadas miden al menos 44 px de alto. El contraste del texto opaco medido supera AA en ambos temas.

## V0 · Primera impresión por pantalla

Medidas verticales desde el borde superior de la ventana. Las capturas muestran el estado al entrar a cada pantalla y el texto visible en ese momento.

| Pantalla | Qué se ve primero y si corresponde |
| --- | --- |
| Inicio | «¿Dónde quieres apoyar?» (34 px, peso 700) y dos destinos de igual peso (20 px, 600). Sí. El título formula la decisión y las dos tarjetas son destinos equivalentes aprobados. |
| Para el curso (DUA) | A 390 px destacan la pestaña rellena y «Guardar y ver acciones». El título explica el propósito, pero «1. Describe tu clase» empieza a y=781 px, debajo del inicio de la barra fija a y=775. No. A 1280 px se ve «Describe» desde y≈640, aunque la acción queda más abajo. |
| Para un estudiante · Básica | Primero la pestaña oscura y el título de 28 px. Después se alcanza a ver «Casos» a y≈714 y el botón fijo promete guardar. Parcial. El propósito es reconocible, pero no la primera tarea del caso sin bajar. |
| Ajustes razonables · Superior | La pestaña y el título identifican bien el ámbito. El título de 28 px ocupa dos líneas y «Casos» arranca a y≈747. Parcial. Se reconoce la variante de Superior, pero cuesta descubrir qué completar antes de guardar. |
| Trabajo | El título de 28 px presenta el propósito. Debajo aparecen «Persona 1» y «Quitar a Persona 1» (y≈698) antes del encabezado de descripción (y≈800). Parcial. La gestión del caso compite con el siguiente paso. |
| Mi mochila | Se perciben «Mi mochila» (20 px, 800), «Cerrar» y el ajuste elegido. Sí para identificar el contenido. La siguiente acción es ambigua: «Ver documento de trabajo» tiene el mismo peso tipográfico y contorno que las acciones de respaldo. |
| Vista previa | Se ven primero «Vista previa» y «Descargar PDF», con «Imprimir» y «Cerrar» en contorno. La prioridad de botones se entiende. En el teléfono la cabecera mide 251 px y el título del documento de Trabajo empieza a y=340. Dado que es una revisión, conviene acercar el inicio del documento sin ocultar la advertencia sobre el PDF. |
| Privacidad | El título recibe foco y «Entendido» es el único botón, de 44 px. Sí. En Educación cabe en la primera pantalla de 844 px. |
| Guías DUA, Básica, Superior, Trabajo y práctica | La pregunta del título (20 px, 800) abre la lectura y la acción de salida queda al final. El propósito está claro. En guías largas la salida requiere desplazamiento o Escape. |
| Contenido del documento y documento para el centro | Primero la pregunta de inclusión o el título del centro y luego las casillas. Sí. En el centro «Ver documento» está deshabilitado hasta confirmar la decisión de compartir. En Trabajo hay que elegir explícitamente a una persona. |

## Hallazgos por criterio

La prioridad alta se reserva para bloqueos o accesibilidad. «Cumple» se refiere a la evidencia de la muestra. Los nombres como `basica-error` identifican estados en el archivo de medición.

| ID | Resultado | Prioridad | Pantalla, evidencia y efecto | Cambio propuesto |
| --- | --- | --- | --- | --- |
| V0 | No cumple | Media | DUA móvil, `#paso-clase-toggle` a y=781 y `#barra-continuar` a y=775. La captura inicial muestra el botón de guardar pero el paso que contiene las preguntas queda tapado o más abajo. La tabla anterior registra el mismo juicio en las demás pantallas. | Compactar el contexto, acercar el paso activo a su primer campo y ajustar el énfasis de la barra según la etapa. |
| V1 | No cumple | Baja | En los estados móviles hay 17 tamaños calculados. En la vista, `.hoja h3` mide 15,33 px, `.h-meta` 13,6 y `.h-fuentes` 13,6. Se suman 19,2 px en títulos de tarjetas y 19,89 px en otros subtítulos. | Consolidar niveles cercanos en 5 a 7 roles, priorizando el texto de lectura en móvil. |
| V2 | Cumple | — | En Superior a 390 px, `#t-estudiante` es 28 px/800 y la bajada 16 px/400. También cambia el tono, de `#18213f` a `#4a5372` en claro y de `#e8ecf8` a `#b6bfd5` en oscuro. | — |
| V3 | No cumple | Baja | En claro aparecen 10 colores de texto, 8 fondos y 4 bordes. Azul identifica enlaces y foco, mientras rosa, cian y violeta codifican DUA. El papel suma su propia paleta. La codificación DUA tiene función y ayuda a reconocer el propósito. | Mantener esos colores en sus etiquetas y reservar un solo acento para navegación y acciones. |
| V4 | No cumple | Baja | En DUA, `.contexto > label` usa 5,6 px de separación, `.perfil-campos > label` 6,4 px y `.boton` 8,8 px verticales. Son tres ritmos cercanos para usos que se repiten. | Usar una escala compartida para separaciones entre etiquetas, entradas y botones. |
| V5 | No cumple | Baja | DUA inicial tiene 42 nodos con borde a 390 px y 40 a 1280. `#filtros-vista`, `#indicador-pasos` y varias `.paso` ya se separan también por fondo o espacio. | Probar la eliminación del contorno de secciones que ya se distinguen por fondo y espacio. Conservar el de los controles que lo requieren. |
| V6 | Cumple | — | En fondos planos opacos, los mínimos son 5,61:1 y 6,64:1 para texto. El borde de `#nivel` contra el fondo exterior dio 3,36:1 y 5,72:1 en claro y oscuro. Alcance y exclusiones en Mediciones. | — |
| V7 | No cumple | Baja | A 1280 px, la bajada de DUA tiene 777,92 px y 104 caracteres en su primera línea. La nota final de la vista previa de Trabajo alcanza 121 caracteres en una línea. | Limitar el ancho de las bajadas y notas largas por separado. Permitir líneas más cortas cuando el teléfono lo requiera. |
| V8 | No cumple | Baja | El enlace independiente `#enlace-guia-practica` mide 250,53 × 23 px a 390. Queda 1 px por debajo del mínimo interno del proyecto. La muestra de botones principales alcanza 44 px de alto. | Dar al enlace de práctica un área de al menos 24 px de alto y mantener la separación. |
| H1 | No cumple | Media | `trabajo-ajustes`: después de guardar, el foco está en `#t-ajustes`, con resultados visibles, pero `aria-current` sigue en «1 Describe» en la medición móvil. `dua-acciones` sí llega a «2 Elige». | Hacer que el indicador de paso y el texto de la barra reflejen el avance al abrir los resultados. |
| H2 | No cumple | Media | `trabajo-acuerdos-error` pide «Elige al menos un rol», aunque la pregunta visible es «¿Con quiénes se acordó?». «Rol» obliga a traducir el mensaje para identificar el control. | Usar «Marca con quiénes se acordó». |
| H3 | No cumple | Media | En la tarjeta `#elegir-dua-1-1` se puede revertir una elección, y «Borrar los datos de Trabajo» pide confirmación y permite cancelar. En la guía de Trabajo, el único botón de cierre queda al final del contenido, bajo el primer pliegue móvil. | Dar a las guías largas un cierre visible cerca del título sin tapar el contenido al desplazarse. |
| H4 | No cumple | Media | `#continuar` dice «Guardar y ver apoyos» en Trabajo, cuyo encabezado de resultados es «2. Ajustes sugeridos». La arquitectura reserva «ajuste en el trabajo» para esta parte. | Usar «Guardar y ver ajustes» en Trabajo. |
| H5 | Cumple | — | En `incluir-trabajo` hay 0 personas seleccionadas por defecto. Intentar continuar muestra «Elige al menos una persona trabajadora». En `documento-centro`, el botón de vista previa queda deshabilitado hasta confirmar la decisión de compartir. | — |
| H6 | Cumple | — | En `trabajo-ajustes` se ven los grupos «Información (1)», «Comunicación (1)», «Puesto y entorno (1)», «Tiempo y organización (3)» y «Cómo pedir, decidir y revisar ajustes (8)». Sus nombres y recuentos permiten anticipar el contenido plegado. | — |
| H7 | Cumple | — | `#indicador-pasos` ofrece 3 enlaces con foco de 3 px en la secuencia de Tab. El acceso a cada paso queda disponible sin recorrer el formulario completo. Escape cerró las guías durante el recorrido. | — |
| H8 | No cumple | Baja | En DUA, «Algo que haces para todo el curso» y «Acciones para que todo tu curso pueda aprender» ocupan dos elementos consecutivos antes del paso 1. La bajada añade un tercer bloque introductorio. | Integrar la definición breve en la bajada y eliminar la línea aislada si la definición queda igual de clara. |
| H9 | Cumple | — | `#respaldo-estado` con un JSON cortado dice «El archivo no se pudo leer. Elige un respaldo guardado desde Prizma». Identifica lo ocurrido y da una acción concreta. | — |
| H10 | Cumple | — | `#trabajo-iniciales` enlaza la ayuda inmediata «Solo iniciales. Si se repiten, agrega un número: JP2». `#trabajo-puesto` también tiene ejemplo junto a la entrada. | — |
| H11 | No cumple | Media | `#necesidades` muestra 9 opciones de igual peso en «¿Qué quieres resolver?». La secuencia de Tab pasa por las nueve antes de «Más detalles». | Agrupar las opciones por propósito en la misma pregunta. Mantener la distinción aprobada entre describir y filtrar. |
| H12 | No cumple | Media | En `trabajo-acuerdos-error`, el texto de cuatro errores se agrupa al final de `#acuerdos-trabajo`. Las indicaciones de roles y fechas quedan separadas de los campos a los que se refieren. | Poner las indicaciones junto a su campo y dejar el resumen para navegación. |
| H13 | No cumple | Media | A 390 px, `#quitar-trabajador` tiene 324 × 44 px y ocupa una fila completa antes de «Describe». Aunque «Guardar y ver apoyos» es grande y accesible, la acción destructiva queda más arriba que el inicio del paso. | Llevar la eliminación a gestión del caso, separada de las entradas de uso frecuente. |
| C1 | No cumple | Media | En `mochila` de Trabajo, `#pdf-trabajo`, `#guardar-respaldo` y la etiqueta de `#abrir-respaldo` son de contorno y 44 px de alto. El PDF de Educación usa `.boton-principal`. | Promover el documento cuando hay ajustes y distinguir la acción destructiva por su texto y agrupación. |
| C2 | No cumple | Baja | El teclado obtiene `outline: solid 3px` en DUA. `#elegir-dua-1-1` cambia a «Elegida», `#ver-centro` se deshabilita y preparar un documento emite estado. La hoja CSS carece de una regla `:hover` de botones; el estado de reposo comparte aspecto con el puntero encima. | Definir una señal discreta al pasar el puntero y preservar foco, selección y estado de carga. |
| C3 | No cumple | Baja | `styles.css` 2–40 centraliza colores y la familia del sistema. `.boton`, `.paso` y `.grupo-apoyos` repiten radios de .35 y .5 rem directamente. Espacios como .35, .4 y .45 rem también se declaran en reglas separadas. | Añadir variables solo para espaciado, radios y tamaños que se repitan como roles. |
| C4 | No cumple | Media | En `mochila-vacia`, `#sel-vacia` explica que se puede elegir desde una tarjeta, pero el panel modal solo permite cerrar para hacerlo y a continuación ofrece opciones de respaldo. | Dar una salida rotulada para volver a las acciones o los apoyos cuando la mochila está vacía. |
| C5 | Cumple | — | En `basica-area`, `#area-0` pasa de «+» a «−» y de `aria-expanded=false` a `true`. `#nivel` es un selector nativo y su lista se expone a través del navegador. | — |
| C6 | No cumple | Alta | A 400 % (320 × 189 CSS), al centrar el enlace de guía de DUA, el punto de pulsación lo ocupa «2 Elige». A 390 px, `#barra-continuar` también se superpone con el encabezado de «Describe» al entrar. | Reservar espacio para el paso activo y revisar los puntos de desplazamiento de la barra y del indicador. |
| C7 | No cumple | Alta | En Trabajo, `#trabajo-acuerdos-error` devuelve cuatro instrucciones seguidas. Las fechas y el criterio tienen etiqueta visible, pero el error no está asociado al campo ni se asigna `aria-invalid` en la validación de `guardarAcuerdosTrabajo()`. | Indicar el error en cada control afectado, asociar el mensaje y llevar el foco al primer error. |
| E1 | No cumple | Baja | `#guardar-clase` dice solo «Guardar» en el formulario de DUA. La barra fija «Guardar y ver acciones» sí anticipa el resultado. | Usar el verbo y el mismo resultado en los dos accesos mientras coexistan. |
| E2 | No cumple | Baja | `#dua-seleccion-vacia` dice «Todavía no eliges acciones DUA». Informa el estado, pero no indica el paso ni el botón que agrega la primera acción. | Invitar a abrir «Acciones sugeridas» y pulsar «Elegir» en una tarjeta. |
| E3 | Cumple | — | Inicio «¿Dónde quieres apoyar?», DUA «¿Qué quieres que aprendan?» y privacidad «Cuida los datos de tus estudiantes» usan el mismo tuteo. Los textos muestreados de las guías mantienen ese tratamiento. | — |
| E4 | Cumple | — | El botón dice «Borrar los datos de Trabajo» y la confirmación pregunta «¿Borrar los datos de Trabajo de este navegador?». Cancelé el diálogo. En el mensaje se explicita que se conservan los datos de Educación. | — |
| E5 | Cumple | — | «Vista previa», «Guardar respaldo» y «Desde 10 trabajadores permanentes» usan mayúscula inicial de frase. «noviembre» aparece en minúscula en la fecha del acuerdo. Como observación de redacción, un párrafo de `#guia-trabajo` abre con «la ley chilena». | — |
| E6 | No cumple | Media | En `incluir-trabajo` la ayuda encadena qué revisar, con quién y cuándo, y «Ajustes acordados» aparece como sección aun si el caso se puede exportar en borrador. «Borrador: acuerdos sin completar» en la vista de Educación aplica una decisión aprobada. | Aclarar el rótulo de sección según el estado del acuerdo y dividir la instrucción de revisión en frases breves. |
| E7 | Cumple | — | `#descripcion-error` dice «Marca al menos una situación para guardar la descripción». `#error-documento` pide «Elige al menos una persona trabajadora». Ambos indican la siguiente acción sin culpar. | — |
| E8 | Cumple | — | En `documento-trabajo`, el resumen usa «20-11-2026» y la fecha del acuerdo se lee «20 de noviembre de 2026». La guía usa «1 %». Los formatos son locales. Como observación de pulcritud, se podría unificar la fecha dentro del documento. | — |

## Mediciones

Las seis combinaciones usaron 844 px de alto. El recorrido pasa por elegir ámbito, describir, ver resultados, elegir una acción o ajuste, abrir las guías, revisar el documento, guardar un acuerdo laboral y provocar errores de descripción, acuerdos, inclusión y respaldo. El archivo por combinación contiene textos observados, estilos calculados, rectángulos `[x, y, ancho, alto]`, recuentos y primer selector de ejemplo. Se mide todo el contenido representado de cada estado recorrido, incluso si queda debajo del pliegue. Cuando hay un diálogo abierto, sus controles se miden por separado del fondo.

| Viewport | Claro | Oscuro |
| --- | --- | --- |
| 390 × 844 | [Datos](mediciones/390-light.json.gz) · [Capturas](capturas/390-light/) | [Datos](mediciones/390-dark.json.gz) · [Capturas](capturas/390-dark/) |
| 768 × 844 | [Datos](mediciones/768-light.json.gz) | [Datos](mediciones/768-dark.json.gz) |
| 1280 × 844 | [Datos](mediciones/1280-light.json.gz) · [Capturas](capturas/1280-light/) | [Datos](mediciones/1280-dark.json.gz) · [Capturas](capturas/1280-dark/) |
| Zoom real 200 %, 640 × 378 CSS | [Datos](mediciones/zoom-200.json.gz) | |
| Zoom real 400 %, 320 px CSS | [Datos](mediciones/zoom-400.json.gz) · [Captura](capturas/reflujo-dua.png) | |

**Tipografía.** A 390 px se midieron 17 valores en los estados recorridos, en ambos temas. En px: 11,67, 13, 13,33, 13,6, 14, 15, 15,33, 16, 17, 18, 18,67, 19,2, 19,89, 20, 26,67, 28 y 34. A 768 y 1280 aparece además 32 px en los títulos de ámbito. El texto general es de 17 px y las bajadas de 16 px. Se puede compactar el texto secundario en roles de 13 o 14 px y reducir la variedad de subtítulos. Antes de adoptar un tamaño menor, validar contraste, zoom y reflujo para esa función. La vista del documento ya usa otra escala por su formato de página.

**Paleta calculada.** Cada lista cuenta colores distintos por uso en el recorrido, aunque un color puede aparecer en más de un uso.

| Uso | Claro | Oscuro |
| --- | --- | --- |
| Texto | `#005873 #0f5132 #111111 #18213f #1d4ed8 #21633b #444444 #4a5372 #693b97 #ffffff` | `#111111 #192133 #444444 #693b97 #76d7ee #8bdaa1 #8fb2ff #a7e3bd #b6bfd5 #d2afff #e8ecf8` |
| Fondo | `#005873 #18213f #21633b #693b97 #e7ebf3 #eef1f7 #f2f2f2 #ffffff` | `#0d1424 #192133 #222c40 #76d7ee #8bdaa1 #d2afff #e8ecf8 #f2f2f2 #ffffff` |
| Borde | `#18213f #7b8395 #888888 #d7d9de` | `#39445b #8490a8 #888888 #e8ecf8` |

**Espaciado y bordes.** Entre los valores de diseño fuera de la escala 4/8/12/16/24/32 se observan 5,6 px (`.contexto > label`, gap), 6,4 px (`label.meta`, gap), 7,2 px en chips, 8,8 px (`#guardar-clase`, padding vertical), 9,6 px en pestañas y 10,4 px (`#abrir-mochila`, padding horizontal móvil). Un margen automático calculado, como los 77 px de `#tema` en móvil, no cuenta como valor de diseño. En los estados iniciales a 390 px hay 42 nodos con borde en DUA, 28 en Básica, 38 en Superior y 26 en Trabajo. Superior aquí conserva el caso creado en Básica, por lo que el conteo incluye el contenido adicional que ese estado muestra.

**Contraste.** El texto más débil medido fue el enlace azul sobre el panel de filtros: claro `#1d4ed8` sobre `#e7ebf3` (5,61:1), oscuro `#8fb2ff` sobre `#222c40` (6,64:1). `#nivel` dio 3,36:1 y 5,72:1 en el borde exterior. Los colores del anillo de foco en DUA coinciden con el acento y dan 6,70:1 y 7,64:1 sobre la superficie de los campos. El script usa luminancia relativa sRGB sobre el fondo opaco más próximo. Registra por separado bordes de controles contra el fondo exterior. El contraste de un borde decorativo carece de relevancia para 1.4.11 si ese borde no comunica información. Las combinaciones con opacidad, fondos con imagen y apariencias nativas requieren inspección aparte.

**Objetivos a 390 px.** `#tema` mide 54 × 44 px, `#nivel` 358 × 44, `#continuar` 366 × 44 y `#descargar` 142,88 × 44. En práctica, el enlace independiente queda en 250,53 × 23 px. El enlace «Código y fuentes» mide 110,72 × 19 px y va dentro de una frase. Las radios de frecuencia tienen caja de 13 × 13 px, pero sus etiquetas clicables miden al menos 86,5 × 40 en el grupo observado. La decisión de compartir tiene caja de 19,19 × 19,19 y etiqueta de 265,03 × 50,19. El selector de archivos de 1 × 1 px se activa mediante «Abrir respaldo» (350 × 44 en móvil).

**Teclado, ampliación y reflujo.** El recorrido de 22 pulsaciones de Tab en DUA conservó el anillo de 3 px en ambos temas. El centro del panel DUA queda fuera del área visible cuando el panel completo recibe foco, por lo que su rectángulo no se interpreta como un control tapado. En los seis cruces a zoom base, la anchura del documento y los diálogos recorridos se ajustó al viewport. En Chromium al 200 % se completó el mismo recorrido en tema claro sin desborde horizontal. Al 400 % (320 × 189 CSS), el centro del enlace «¿Qué es el DUA y cómo usarlo?» quedó en x=160, y≈87 al centrarlo. `elementFromPoint` devolvió «2 Elige» del indicador fijo. Una pulsación normal reprodujo la intercepción en la comprobación inicial. Esto afecta el acceso al enlace en ese punto de desplazamiento aunque el ancho de la página quepa. Se usó el zoom de página de Chromium, con verificación del ancho CSS y del factor del dispositivo.

### Reproducción

Desde la raíz del repositorio, con Playwright y Chromium ya disponibles en el entorno de pruebas:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

En otra terminal:

```bash
node docs/auditorias/050-interfaz/medir.cjs /tmp/prizma-050
gzip -dc docs/auditorias/050-interfaz/mediciones/390-light.json.gz | jq '.estados["trabajo-ajustes"] | {paso, foco, fijo}'
```

Si el navegador viene instalado por el sistema, indicar su ruta con `CHROMIUM_BIN`. Con el Chromium de Playwright basta el comando anterior. `PRIZMA_URL` permite indicar otro origen local para la misma revisión.

## Capturas de referencia

| Pantalla | Móvil claro | Escritorio oscuro |
| --- | --- | --- |
| Inicio | [390 px](capturas/390-light/inicio.png) | [1280 px](capturas/1280-dark/inicio.png) |
| DUA | [390 px](capturas/390-light/dua.png) | [1280 px](capturas/1280-dark/dua.png) |
| Básica | [390 px](capturas/390-light/basica.png) | [1280 px](capturas/1280-dark/basica.png) |
| Superior | [390 px](capturas/390-light/superior.png) | [1280 px](capturas/1280-dark/superior.png) |
| Trabajo | [390 px](capturas/390-light/trabajo.png) | [1280 px](capturas/1280-dark/trabajo.png) |
| Mi mochila | [390 px](capturas/390-light/mochila.png) | [1280 px](capturas/1280-dark/mochila.png) |
| Vista previa de Trabajo | [390 px](capturas/390-light/documento-trabajo.png) | [1280 px](capturas/1280-dark/documento-trabajo.png) |
| Privacidad en Educación | [390 px](capturas/390-light/privacidad-educacion.png) | [1280 px](capturas/1280-dark/privacidad-educacion.png) |
| Error de acuerdos | [390 px](capturas/390-light/trabajo-acuerdos-error.png) | [1280 px](capturas/1280-dark/trabajo-acuerdos-error.png) |
| Documento para el centro | [390 px](capturas/390-light/documento-centro.png) | [1280 px](capturas/1280-dark/documento-centro.png) |

## Límites

- Cinco segundos simulados por una sola persona que ya conoce el recorrido. Falta comprobar la primera impresión con personas nuevas.
- La emulación cubre tamaños CSS en Chromium. Quedan fuera Safari, Firefox y un teléfono con recorte físico o teclado virtual abierto. Se inspeccionó el CSS de las zonas seguras.
- Al 400 % se investigó el enlace de la guía DUA y la superposición del indicador. El recorrido completo a ese aumento y la ampliación de solo texto quedan pendientes.
- Se inspeccionó el foco por teclado en el recorrido descrito y la estructura de los controles. No hubo prueba con lector de pantalla, de impresión física ni del etiquetado del PDF descargado.
- Los colores de estados nativos de formularios y de píxeles con mezcla de transparencias quedan fuera del cálculo. La revisión se limita a los estados recorridos, no a todas las combinaciones de contenido del catálogo.

## Referentes

- Jerarquía y sistema visual. [Refactoring UI](https://www.refactoringui.com/) · [Practical UI](https://www.practical-ui.com/)
- Heurísticas, proximidad y acciones. [Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/) · [Laws of UX](https://lawsofux.com/)
- Componentes y objetivos. [shadcn/ui](https://ui.shadcn.com/docs/components) · [Material Design 3](https://m3.material.io/) · [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- Redacción. [Microcopy, Kinneret Yifrah](https://www.microcopybook.com/) · [Mailchimp](https://styleguide.mailchimp.com/) · [FundéuRAE](https://www.fundeu.es/)
- Norma de accesibilidad. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
