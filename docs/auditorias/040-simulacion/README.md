# Tarea 040 · Fase A: simulación sin web

16 de noviembre de 2026. Rama `codex/040-simulacion`, destino `main`. Base `5ed5d0ad8cc53720d42fbce4ab353ad076a02e30`. Solo se agregan archivos en esta carpeta. Las fases B y C no se implementan en esta entrega: cada una depende de la integración de la anterior.

## Resultado principal

Las nueve semillas recuperan **37/37 apoyos esperados en el total** y **0/13 apariciones de los IDs expresamente excluidos**. DUA recupera **21/21 consideraciones esperadas** en el total. En «Para empezar» aparecen 20/37 apoyos y 7/21 consideraciones DUA. [Tabla por semilla](semillas.md), [resultados completos](resultados.jsonl).

Estos resultados comprueban disponibilidad, no suficiencia del asesoramiento. El total incluye grupos plegados y opciones generales; un apoyo no mencionado entre los esperados no es automáticamente incorrecto. La referencia no clasifica todos los resultados. Además, «Para empezar» tiene capacidad limitada y no contiene los grupos de objetivos, desregulación, práctica profesional ni proceso laboral. No corresponde exigir que todos los esperados estén simultáneamente entre tres o cuatro primeras opciones.

Se generaron **720 variantes únicas**, 80 por semilla. El análisis de importancia y los contrastes muestran dos hechos distintos: las entradas actuales sí separan listas por nivel, situaciones y práctica; las nueve preguntas de Claude contienen condiciones que no se resuelven leyendo esas listas. Por ejemplo, escribir «Usa Braille» o «Usa lupa y ampliación» conserva exactamente las mismas opciones, con `acc-6-ampliar` y `acc-6-braille` entre las primeras. Esto no certifica la pertinencia de ambas para una persona que usa lupa.

## Método y alcance

Se leyeron [la asesoría](../../casos/asesoria-claude.md), [las nueve semillas](../../casos/casos-semilla.json) y [el flujo propuesto](../../marca/040-flujo/flujo.png) antes de programar. El flujo sitúa decisiones y confirmaciones de personas entre sugerencias y acuerdos; esta simulación no transforma una lista del catálogo en una decisión tomada con un estudiante o trabajador.

[simular.cjs](simular.cjs) carga `app.js` completo en `node:vm`, omitiendo únicamente la llamada final a `iniciar()`. No expone `fetch` ni `require` al contexto; no inicia navegador, servidor ni conexiones. Usa el catálogo y los normalizadores reales. Un DOM mínimo permite ejecutar `pintarTarjetas()`, `pintarApoyos()` y `pintarTrabajo()` y recuperar sus IDs. Enlaza explícitamente los contenedores estáticos de objetivos, desregulación y práctica que en la página enlaza el HTML. Se comprueba cada conjunto contra las funciones reales de elegibilidad, para no perder grupos por una limitación del DOM simulado.

Se separan los canales DUA, apoyos educativos y Trabajo. «Total» significa todas las tarjetas ofrecidas, incluso plegadas; excluye bloques ocultos por nivel y no incluye versiones DUA como apoyos individuales. DUA se evalúa por consideración única, porque una consideración puede tener más de un ID. Los demás apoyos se evalúan por ID. «Para empezar» se extrae de las secciones construidas por el código: hasta tres en DUA/acceso si el grupo existe y cuatro en Trabajo cuando hay más de cuatro ajustes.

S9 es un curso sin caso individual: su canal de apoyos es **no aplicable**, no una lista individual vacía. Retirar la última frecuencia de un caso existente en los pares conserva ese caso y sus grupos generales. El indicador `casoIndividual` de los pares es un control del adaptador de simulación para conservar esta distinción; no es una nueva entrada de la aplicación.

### Variantes y referencias

Generador reproducible LCG, semilla 400040. Por variante se cambian nivel educativo, una a tres situaciones de las catorce, frecuencia positiva 1–3, cero a dos necesidades, taller y práctica profesional. Esta última solo se activa en media/superior; Trabajo conserva su ámbito y no recibe un nivel educativo. La mitad de los candidatos conserva una situación de la semilla cuando existe; la otra mitad permite combinaciones libres. Se descartan duplicados, incluidas coincidencias con las nueve entradas originales.

Las variantes conservan los IDs de referencia de su origen **solo para medir solapamiento**, marcados `oraculo: referenciaDelOrigenNoValidada`. Cambiar nivel o situaciones puede hacer pertinente un antiguo excluido o irrelevante un antiguo esperado. No hay un nuevo juicio experto para esas 720 entradas: sus diferencias no son falsos positivos o fallos pedagógicos demostrados. Las nueve semillas sí usan el oráculo literal del JSON. No se modificó ese archivo.

Las 1.235 comparaciones pareadas cambian una entrada cada vez sobre 45 anclas: nueve semillas y las primeras cuatro variantes de cada origen. No se aplican controles individuales a S9. Los cambios de frecuencia afectan la primera dimensión por orden numérico, no todas a la vez. Las pruebas de texto se limitan a campos existentes: meta en Educación, ayuda/voz en ambos ámbitos y tipo de puesto en Trabajo. Los [pares](pares.jsonl) y [su resumen](sensibilidad.json) distinguen cambios del conjunto, del orden y de las primeras opciones. Los pares pueden dejar cero o añadir una cuarta situación: son pruebas de sensibilidad fuera de la cohorte de variantes de una a tres situaciones.

El [resumen de variantes](variantes.md) separa vacíos reales de ausencia del primer grupo y muestra la retención de referencias por origen.

## Hallazgos priorizados

| Prioridad | Hallazgo | Evidencia e implicación |
| --- | --- | --- |
| Alta | La modalidad de acceso/comunicación no queda determinada por la situación. | Contraste Q2: Visión, básica, frecuencia 3. Braille y lupa producen las mismas listas y el mismo primer grupo: ampliar, Braille y ubicación. El motor no puede distinguir esa compatibilidad desde el texto de ayuda. [Contrastes](contrastes.json), `accesosVisibles()` y `puntaje()` en app.js. Los cero excluidos de las semillas no evalúan este contraste de visión. |
| Alta | La cobertura total no comprueba las condiciones de evaluación, seguridad o decisión personal. | Los nueve contrastes textuales conservan listas idénticas. Q1 no representa una condición estructurada de habilidad evaluada; Q4 cambia bodega con alarmas por oficina sin maquinaria sin cambiar ajustes; Q6 cambia la decisión expresada sin cambiar el catálogo. Esto describe límites de selección, no un permiso para compartir ni una falla de las salvaguardas del documento del centro. |
| Alta para la comparación futura | La asesoría y el JSON no enumeran exactamente los mismos esperados en cinco casos. | La prosa agrega `prac-procedimiento` (S2), `acc-4-recreo` (S3), `acc-2-pictogramas` (S4), `obj-enriquecimiento-historia` (S5), `sup-tiempo` y `pp-e-acuerdo` (S6). Ningún ID del JSON falta en el catálogo. Se informa el resultado literal del JSON sin completar silenciosamente el patrón; Claude puede revisar esta diferencia antes de comparar fases. [Oráculo](oraculo.json). |
| Media | La frecuencia modifica prioridad, sin cambiar el conjunto mientras siga siendo positiva. | Los 44 pares de frecuencia no cambian ningún conjunto total; sí cambian el orden de apoyos educativos en 23 pares y el conjunto de primeras opciones personales en 15. Un resultado igual no implica que la respuesta se haya perdido. [Sensibilidad](sensibilidad.json). |
| Media | Muchos primeros puestos se deciden tras empates de pertinencia. | Empate antes del desempate final en ocho de las ocho semillas personales; cruza el corte en S1, S6 y S8. En variantes, 719/720 tienen algún empate y 322/720 cruzan el corte. El orden final es determinista: proporción y catálogo; Trabajo incorpora una preferencia auditiva en un caso específico. No es selección al azar ni evidencia de superior eficacia. |
| Media | La asociación estadística puede atribuir importancia a una entrada que no influye en ese canal. | Práctica profesional tiene ganancia de información positiva sobre el total DUA por su asociación con media/superior en la muestra, pero sus 40 pares producen cero cambios DUA. No se propone esa pregunta como filtro DUA basándose en esa asociación. |
| Baja / interpretación | La ausencia de «Para empezar» no equivale a falta de opciones. | 140/640 variantes educativas no crean ese grupo DUA. Tres variantes de Trabajo tampoco lo crean: V8-08, V8-52 y V8-76 tienen cuatro ajustes, más ocho opciones de proceso. Ningún total de la cohorte está vacío. [Conteos](conteos.json). |

## Qué entradas separan las listas

La ganancia de información es la reducción media de incertidumbre, en bits, sobre la pertenencia de cada ID al canal. Se calcula por separado para el total y «Para empezar», sobre las 720 variantes, no sobre los nueve resultados etiquetados. El universo incluye IDs constantes; por eso las cifras de distintos canales tienen denominadores distintos. [Todas las entradas y ambos valores](importancia.md), [valores sin redondear](importancia.json).

| Canal y población | Mayor asociación con el total, bits medios/ID | Qué corroboran los pares |
| --- | --- | --- |
| DUA, 640 variantes educativas, 42 IDs | Nivel 0,235943. El ranking bruto también asigna 0,037143 a práctica profesional. | El nivel cambia elegibilidad; práctica profesional no cambia DUA. Las necesidades cambian prioridad, no el total: lectoescritura cambia el orden en 40/40 y las primeras opciones en 37/40 pares. |
| Apoyos, 640 variantes educativas | Nivel 0,267626; práctica profesional 0,101831; situación 14, desafío, 0,020215; situación 8, movimiento, 0,020101. | Nivel y práctica activan versiones/bloques; situaciones seleccionan acceso. No se deduce dominio previo de la situación 14. |
| Trabajo, 80 variantes | Audición (13) 0,089660; atención/organización (1) 0,080164; sensibilidad sensorial (7) 0,080128; movimiento (8) 0,078666. | Las situaciones cambian ajustes. Tipo de puesto no cambia conjunto ni orden en 5/5 pares; es contexto registrado, no una búsqueda semántica. |

En «Para empezar DUA», las asociaciones principales son lectoescritura (0,033019), comprensión (0,030380) y tareas largas (0,026099). En el total DUA, las necesidades no excluyen opciones; leer solo la columna de cobertura total ocultaría su función real.

Los campos meta (40 pares), ayuda y voz (45 cada uno), y puesto (cinco laborales) no modifican ninguna de las listas medidas. Son campos de contexto/documento, no controles inútiles. No se midió aquí su efecto en el PDF.

Este es un análisis **exploratorio y descriptivo** de reglas deterministas, sin entrenamiento de un modelo predictivo, validación clínica ni estimación de prevalencias. La ganancia no controla todas las asociaciones del generador y favorece entradas que separan más categorías; las comparaciones pareadas sirven para no confundir asociación con dependencia directa. No se puede estimar la importancia de una pregunta ausente asignándole un cero: falta la variable y su referencia de pertinencia.

## Agrupamientos de variantes

Se agrupan por ámbito y similitud de Jaccard de los conjuntos de acceso/práctica, dejando fuera DUA, objetivos/DEC generales y proceso laboral para que esos bloques comunes no dominen la similitud. Cada caso se asigna al primer representante compatible con Jaccard ≥ 0,65; si no existe, crea grupo. El representante no cambia. El orden y el umbral están fijados y registrados. [Miembros, representantes y frecuencias de situaciones](agrupamientos.json).

Se obtuvieron **268 grupos**, de los cuales **110 contienen una sola variante**. Esto indica fragmentación de los conjuntos en esta exploración; no son perfiles diagnósticos ni segmentos validados. El método depende del orden y del umbral, y no mide diferencias de ranking. Los grupos G12 y G51 reúnen doce variantes cada uno, todas de superior, pero con representantes y conjuntos diferentes. Nivel separa grandes familias; dentro de cada una, las situaciones y práctica siguen separando opciones. No surge de estos agrupamientos una clasificación suficiente para decidir modalidad, seguridad o qué compartir.

## Comparación con las nueve preguntas de Claude

[Contrastes reproducibles](contrastes.json): se escriben dos respuestas distintas en los campos de texto existentes y se comparan los mismos canales. Sus listas son idénticas en nueve de nueve contrastes. No se simula que la web ya tenga esas preguntas ni se considera que ignorarlas sea un requisito futuro. La ausencia de efecto en selección no mide utilidad para acuerdos, documentos o decisiones.

| # | Pregunta de la asesoría | Qué distingue hoy el motor / qué queda sin representar | Relación con la fase B especificada |
| --- | --- | --- | --- |
| 1 | ¿Lo que se evalúa es esa habilidad? | Situación 2 selecciona acceso, pero cambiar la meta entre decodificación y comprensión no condiciona opciones. Algunas tarjetas tienen una precaución textual; no es una respuesta estructurada del caso. | Punto B2: aviso visible en apoyos de forma. |
| 2 | ¿Qué usa hoy para comunicarse o acceder? | Situaciones 6, 13 y 12 separan grandes barreras; no separan Braille/lupa o lengua de señas/restos auditivos. El contraste de visión mantiene ambos primeros apoyos. | B1 incorpora modalidades y exclusiones revisadas por Claude. |
| 3 | ¿Ya domina el contenido? | La situación 14 activa apoyos de desafío, pero la respuesta textual sobre dominio no modifica la oferta. No se puede inferir dominio de frecuencia o aburrimiento. | No hay una entrada explícita de dominio en los seis puntos B; no se implementa ni amplía ese alcance aquí. |
| 4 | Alerta de seguridad | Audición, visión/movimiento y taller cambian opciones de acceso; en Trabajo hay fichas de alertas. La presencia de fichas no demuestra una alerta integrada; puesto o alarmas narradas no cambian listas. | B3 prescribe la alerta. La accesibilidad del aviso solo podrá probarse con web. |
| 5 | ¿Existe PAEC, PACI o protocolo DEC? | DEC se ofrece en los niveles escolares correspondientes; responder sí/no en ayuda no selecciona ni condiciona esos bloques. | B4 agrega la casilla y su salida documental. |
| 6 | ¿Qué quiere compartir y con quién? | No cambia pertinencia del catálogo. El código actual sí exige decisión explícita para el documento del centro; no se probó ese flujo en esta fase sin web. Trabajo conserva voz, sin campo estructurado específico de destinatario. | B6 agrega la pregunta en Trabajo. No se confunde selección con consentimiento. |
| 7 | Lengua de la familia | Situación 10 y lengua-cultura aportan opciones; la lengua familiar escrita en voz no distingue necesidad de intérprete. | B1 incluye otra lengua materna, pero no nombra un campo separado para la familia. Diferencia de alcance registrada, sin cambiar la especificación. |
| 8 | ¿Cómo sabremos que funciona? | El acuerdo actual tiene roles y fechas; no un criterio de logro estructurado. La lista no permite medir el éxito posterior. | B5 exige el criterio y lo lleva al PDF. |
| 9 | Distinguir patrón y crisis | Necesidad clima ordena DUA. S9 sigue sin caso individual; cambiar la meta de patrón sostenido a crisis puntual no selecciona una ruta distinta. | No hay una pregunta explícita de patrón/crisis en los seis puntos B. El flujo propuesto contiene esa decisión humana; no se automatizó aquí. |

## Reproducción y comprobaciones

```bash
node docs/auditorias/040-simulacion/simular.cjs
node docs/auditorias/040-simulacion/verificar.cjs
python3 scripts/validar_catalogo.py
```

La primera orden genera la evidencia; la segunda vuelve a ejecutarla y compara once archivos byte a byte. También recuenta métricas, verifica que primeros y totales correspondan, comprueba agrupamientos y huellas y controla el alcance del cambio. [Registro de validación](validacion.json), [entorno y huellas](metodo.json). El script tiene comprobaciones pequeñas del cálculo de información y Jaccard y del caso que pierde su última frecuencia. El validador del catálogo sigue pasando: 240 recomendaciones y 36/36 consideraciones DUA.

No se ejecutaron pruebas que generan capturas fuera de la carpeta autorizada. No hay dependencias nuevas. Se omitió la búsqueda opcional de casos externos para mantener el análisis local solicitado. No se probaron interacción, foco, impresión ni fidelidad de un navegador: eso corresponde a la fase C. El DOM mínimo comprueba conjuntos y el orden de los primeros grupos, no CSS ni tecnología de asistencia.

Revisión con [ponytail-review](../../../.agents/skills/ponytail-review/SKILL.md): [entrega revisada](revision-ponytail.md). Las conclusiones quedan sujetas a la revisión del dueño y de Claude, especialmente el patrón de referencia y las decisiones humanas del flujo. No se integra a main ni se inicia la fase B antes de integrar esta A.
