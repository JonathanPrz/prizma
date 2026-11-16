# Auditoría 029 · Parte A, antes de implementar

Corte: `0220e2d` (tarea actualizada con 1 y 1b). Se realizó antes de cambiar código de aplicación, en Chromium a 1280 px y con entradas reales. Se usaron dos casos ficticios JP. [Evidencia de los recorridos, modelo y definición del PDF, validaciones y hashes](antes.json). [DUA](antes-dua-1280.png) · [Apoyos](antes-apoyos-1280.png).

## Recorridos de un docente

| Recorrido | Qué muestra este corte | Qué exige la tarea actual | Brecha |
|---|---|---|---|
| Elegir «Se pierden en tareas largas» | Las ocho necesidades aparecen. La primera ficha es `dua-6-2`, pero enseguida hay acciones sin coincidencia del momento Antes. No existe Para empezar global. Los resultados cambian en cada clic. | Tres acciones más pertinentes entre todos los momentos; guardar la descripción opcional antes de actualizar resultados. | El momento precede a la pertinencia global. Falta paso de guardado/resumen. |
| Elegir DUA 6.2 y después agenda individual | La agenda dice «También ofrecido a todo el curso» dentro del bloque inferior de su versión DUA; el botón queda «Ya está en el curso». | Rótulo bajo el título del apoyo, con el título de la acción DUA elegida. | La relación existe en datos, pero no está al inicio ni destaca como confirmación. |
| Elegir agenda y volver a DUA | La acción DUA no anuncia que responde a ese apoyo individual. | Aviso con número de estudiantes, sin iniciales. | Falta la dirección de vuelta y su anuncio accesible. |
| Dos casos con agenda | «Lo elegiste para 2 estudiantes. Considera agregar su versión para todo el curso», con el botón general Agregar al curso. No hay decisión No ni memoria de esa decisión. Se permite agregar casos en cualquier estado. | Pregunta explícita Sí/No, conservar ambas selecciones y recordar No; casos con acuerdos antes de agregar otro. | Falta la decisión, su persistencia y el flujo por caso. |
| PDF después de agregar versión al curso | El apoyo conserva «También ofrecido a todo el curso»; la acción DUA no incluye el número de estudiantes. Acuerdos son líneas vacías. | Ambas observaciones, roles/fechas guardados y reflexión del curso. | Faltan observación inversa y datos de acuerdos/reflexión. |

Los dos botones de casos se llaman JP, sin aviso de duplicado. La entrada está limitada a cuatro letras: `normalizarEstudiante({iniciales:"JP2"})` devuelve cadena vacía. Ambas pestañas conservan filtros laterales y el diálogo móvil; no hay pasos guardados. La 028 ya separa correctamente el documento del centro y exige decisión del estudiante: esa restricción debe conservarse.

## Todas las validaciones frente a los datos reales

El catálogo tiene **176 fichas**: 42 DUA (incluye versiones por nivel), 89 de acceso, 13 de objetivos, nueve de desregulación y 23 de práctica profesional. Hay **39 fuentes y ocho necesidades**. No se toma el contador de 36 acciones por nivel como tamaño del archivo completo.

| Entrada / función actual | Revisión con datos reales y límites | Resultado o descarte silencioso |
|---|---|---|
| Carga de recomendaciones y fuentes | Hoy se cargan sin validador de estructura propio; se transforman fuentes a mapa por ID. Se comprobaron IDs, referencias de todas las fichas, cita y URL de cada fuente. | Ninguna referencia real perdida. Faltan pruebas que pasen archivos reales por la ruta de validación de página; un ID de fuente repetido podría sobrescribirse. |
| Necesidades, validador en `iniciar` | Array; ID/texto no vacíos; IDs únicos; dimensiones enteras 1…`DIMENSIONES.length`; consideraciones oficiales. | Las ocho pasan con 14 dimensiones. La corrección de Claude ya está incluida. Con el límite antiguo 11, los datos que incluyen 12, 13 o 14 invalidaban todo el catálogo opcional. Extraer la función y probar los datos reales. |
| `normalizarNecesidades`, propósitos y momentos | Intersección con IDs reales y valores oficiales, deduplicación. | Todos los IDs reales se conservan. Valores desconocidos se omiten al recuperar estado. Los momentos y propósitos restringen visibilidad; no son el mismo tipo de prioridad que una necesidad. |
| `normalizarPerfil` | Nivel validado contra select; migración CH/TP → media; práctica booleana estricta; actividad/evidencia contra valores de los controles; meta hasta 500. Se contrastaron los contextos de fichas con controles y la casilla de práctica. | No se pierden contextos reales: práctica se procesa aparte. **La meta no tiene maxlength en HTML y el listener guarda texto sin truncarlo; al recargar se corta a 500.** Hay discrepancia entre lo que se permite escribir y lo que se restaura. |
| `normalizarEstudiante` | Iniciales 1–4 letras; dimensiones 1…14, frecuencia entera 1…3; ayuda/voz hasta 300; práctica profesional booleana estricta. | Las 14 dimensiones pasan. `JP2` se descarta y los duplicados no se advierten. Acuerdos y descripción guardada no existen todavía y se eliminarían como campos desconocidos. Ayuda/voz sí tienen maxlength coherente. |
| `seleccionValidada` | ID existente, tipo DUA o de apoyo reconocido, nota string de hasta 2000. | Conserva las 42 selecciones DUA y las 134 individuales al pasar los IDs reales; incluye las 23 profesionales. Omite IDs retirados, notas no textuales y recorta notas largas. La interfaz ya limita notas a 2000. |
| `normalizarDatos`, carga local | Hasta diez estudiantes; IDs válidos y únicos, activo existente; legado de un estudiante; tipos/arrays defensivos. | Datos locales corruptos vuelven al estado inicial sin mensaje; más de diez se recortan. Son límites existentes, no fallos de los archivos del catálogo. Versiones antiguas de situaciones 3/6 tienen aviso de revisión. |
| `validarRespaldo`, importación | app/version 1 o 2, perfil/selecciones objeto, notas string; máximo diez en v2; tamaño máximo 12 MiB; confirmación de reemplazo. | Formato/sobretamaño dan error visible; IDs de fichas retirados se cuentan y avisan. Otras normalizaciones (nivel/contextos desconocidos, iniciales inválidas, textos recortados) no tienen aviso por campo. No confundirlo con garantía de conservación de cualquier archivo arbitrario. |
| Selección, nivel y PDF | `aplica` filtra por nivel; selección de otro nivel se conserva pero no se exporta hasta volver a ese nivel. `versionCurso` busca consideración y nivel reales. | No es pérdida de datos guardados. El PDF conserva selección visible y notas; no valida pertinencia pedagógica. |
| Documento para el centro | Modelo de campos permitidos, IDs solo de centro elegidos, decisión booleana, revisión de cancelación/cambio durante carga. | Mantener intacta la exclusión de iniciales, situaciones, voz, notas y otros casos. No añadir acuerdos personales a ese documento. |
| Tema y confirmación de privacidad | Tema limitado a claro/oscuro/dispositivo; confirmación por clave propia y almacenamiento con try/catch. | Valores desconocidos de tema usan dispositivo; si el almacenamiento falla, la sesión sigue funcionando. No dependen de IDs del catálogo. |

## Decisión para la parte B

Corregir la discrepancia del máximo de meta, introducir validadores compartidos para los tres archivos reales y cubrir acuerdos, decisiones cruzadas, reflexión y migraciones con pruebas. Mantener el propósito de los límites de restauración: no aceptar datos inválidos para evitar un descarte. La prueba de regresión debe fallar al mutar una vez el máximo de dimensiones a 11.

Las observaciones anteriores describen **antes**, no la implementación posterior. No se modificaron datos, fuentes ni .claude/. No se probaron lectores de pantalla ni otros navegadores en esta parte A.
