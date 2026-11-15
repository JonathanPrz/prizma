# Auditoría del diseño de Prizma

Revisión de `docs/diseno.md` (versión 0.1) contra las fuentes.
Fecha: 15 de noviembre de 2026.

**Base de la revisión**
- **Verificada:** DUA 3.0 y CIF, leídas en la fuente. Ver `fuentes/dua-3.0.md` y `fuentes/cif.md`.
- **Verificada:** normativa chilena y CDPD, con sus textos en `fuentes/normativa/`.

**Prioridad**
- **Alta:** cambia la estructura o crea un riesgo legal.
- **Media:** mejora clara.
- **Baja:** detalle.

## Resumen

El diseño va bien encaminado. Coincide con DUA 3.0 en lo central:
- es un menú y no una lista de cotejo,
- el foco está en las barreras del ambiente,
- empieza por todo el curso y sigue con casos específicos.

Hay 6 cambios de prioridad alta:
1. Pedir la meta de aprendizaje.
2. Describir las barreras como situaciones y agregar facilitadores.
3. Sumar la dimensión de identidad, lengua y pertenencia.
4. Usar las categorías oficiales del Decreto 83.
5. Cambiar el Tiempo 2 según el nivel educativo.
6. Corregir lo que dije sobre la licencia de CAST.

## A. DUA 3.0 (verificado)

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| A1 | CAST dice que el primer paso es definir una meta de aprendizaje clara. Sin meta no se distingue un desafío deseable de una barrera innecesaria. El diseño no la pide. | Agregar al perfil de la clase 1 campo opcional: "¿Qué quieres que aprendan en esta clase?". Prizma no planifica: solo usa la meta para recordar qué no se debe quitar. | Alta |
| A2 | DUA 3.0 ubica el problema en el diseño, no en el estudiante. La encuesta del diseño pregunta "¿Qué le cuesta?", que mira al estudiante. | Preguntar por situaciones: "¿En qué momentos de la clase encuentra barreras?". Así se registra la barrera y la situación en que aparece. | Alta |
| A3 | La versión 3.0 suma identidad, lengua, cultura y pertenencia (1.3, 2.3, 7.1, 8.4). Las 9 dimensiones del diseño no lo cubren, solo lo menciona el contexto. | Agregar la dimensión 10, **Identidad, lengua y pertenencia**. Es clave en Chile por los estudiantes migrantes, los pueblos originarios y las disidencias. | Alta |
| A4 | Algunas consideraciones no caen antes, durante ni después. Son del ambiente: pertenencia (8.4), prácticas restaurativas (9.4), sesgos (7.4). | Sumar un 4.º grupo: **En toda la clase**. | Media |
| A5 | El diseño propone unas 30 acciones al azar para el prototipo. DUA 3.0 tiene 36 consideraciones. | Prototipo con **36 acciones, 1 por consideración**. Así el menú cubre todo DUA 3.0 y cada acción se rastrea hasta su consideración. | Media |
| A6 | CAST apoya la neurociencia en las 3 redes cerebrales, a nivel de principio. Las referencias de cada consideración son sobre todo de educación y psicología, no de neurociencia. | No decir "respaldado por la neurociencia" en cada acción. Decir de qué tipo es el respaldo: neurociencia, psicología cognitiva, investigación educativa, norma legal u orientación oficial. Así nadie puede acusar a Prizma de exagerar. | Alta |
| A7 | DUA 3.0 usa lenguaje centrado en el estudiante: sus verbos sirven también para que el estudiante los use. | Esto respalda la voz del estudiante. Propongo pasarla de la etapa 3 a la etapa 2. | Media |
| A8 | Vocabulario. En español, CAST dice "directriz" y "consideración", no "pauta". | Usar los términos oficiales en la ayuda y en el PDF, y palabras simples en la interfaz. | Baja |
| A9 | El sitio de CAST no tiene licencia abierta y tiene derechos reservados. El diseño, sección 10, suponía CC BY-NC-SA. Eso es un error mío. | Corregido en `diseno.md`. Las acciones se redactan con palabras propias y citan la consideración. Escribir a CAST para contar del proyecto y pedir su visto bueno. | Alta |

## B. CIF (verificado)

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| B1 | La CIF registra barreras y también **facilitadores**. | Agregar "¿Qué le ayuda?" al perfil del estudiante. Lo que ya funciona sube en las recomendaciones y el PDF lo destaca. | Alta |
| B2 | La CIF distingue desempeño (lo que hace en su contexto real) de capacidad (lo que puede hacer sin ayudas). | Prizma registra el desempeño en la clase actual. Hay que aclararlo en la ayuda. | Baja |
| B3 | La CIF suma las **actitudes** como factor ambiental: de compañeros, docentes y familia. | Incluir las actitudes en la dimensión de contexto. | Media |
| B4 | La escala de la CIF tiene 5 niveles, de 0 a 4. El diseño propone 3. | Mantener 3 niveles en la interfaz: es lo más simple para docentes. | Baja |

## C. Normativa chilena (verificada el 15-nov-2026 con los textos de `fuentes/normativa/`)

| # | Observación | Propuesta | Prioridad | Verificación |
|---|---|---|---|---|
| C1 | El Decreto 83 ordena 2 pasos: DUA y diversificación para todo el curso, y después adecuaciones curriculares para quien las necesite. | Mantener el orden del diseño y citar el decreto. | Alta | Confirmada |
| C2 | Hay 4 tipos de adecuación de acceso (presentación de la información, formas de respuesta, entorno, organización del tiempo y el horario) y 5 tipos en los objetivos (graduación de la complejidad, priorización, temporalización, enriquecimiento y eliminación). La eliminación va solo en última instancia. | Usar estos tipos oficiales como categorías del catálogo. | Alta | Confirmada |
| C3 | **Todas** las adecuaciones curriculares de un estudiante, de acceso y en los objetivos, se registran en el PACI. Se deciden en equipo, con la familia y con la participación del estudiante. | El PDF de Prizma dice "Propuesta para conversar con el equipo de apoyo" en las dos secciones, no solo en la de objetivos. | Alta | Corregida: la versión anterior solo hablaba de objetivos |
| C4 | Los niveles tienen reglas distintas: (a) **parvularia**, preferentemente sin adecuaciones en los objetivos; (b) **básica**, Decreto 83; (c) **media y TP**, el art. 5 del Decreto 67 obliga a diversificar y permite adecuaciones según los Decretos 83 y 170; (d) **superior**, ajustes razonables según la Ley 21.091 (art. 2 e) y la CDPD, y ajustes necesarios según la Ley 20.422 (art. 39) y la Ley 21.545 (art. 21). | El Tiempo 2 se adapta al nivel. En parvularia, los objetivos quedan ocultos por defecto. En superior, la sección se llama "Ajustes razonables". | Alta | Corregida: media sí admite adecuaciones |
| C5 | La CDPD define los ajustes razonables (art. 2) y la educación inclusiva (art. 24). Negar un ajuste razonable es discriminación. | Incluida como fuente. | Media | Confirmada |
| C6 | El art. 18 de la Ley 21.545 pide que los establecimientos ajusten sus reglamentos para abordar las desregulaciones. La ley no trae un protocolo. | Prizma da prevención y orientaciones generales, y remite al protocolo del establecimiento. Faltan las orientaciones de Mineduc. | Alta | Confirmada. Fuente pendiente |
| C7 | Las NEE transitorias (art. 20 del Decreto 170) y las permanentes (lista del Decreto 83) son la base de la "condición como atajo". | Usar esas categorías. No guardarlas. | Media | Confirmada |
| C8 | Datos personales y la Ley 21.719. | Agregar la Ley 21.719 como fuente pendiente. | Media | Pendiente |
| C9 | **Nueva.** El anexo del Decreto 83 habla de "estilos de aprendizaje". La investigación no respalda ajustar la enseñanza a un estilo. | Citar la norma, pero redactar las acciones como "preferencias e intereses", sin prometer que adaptar a un estilo mejore el aprendizaje. | Media | Nueva |
| C10 | **Nueva.** La Ley 21.545 pide "lenguaje claro y sencillo" (art. 3 a) y reconoce la autonomía progresiva (art. 3 b) y la neurodiversidad (art. 3 f). | Respalda la lectura fácil, la voz del estudiante y el lenguaje no deficitario de Prizma. | Media | Nueva |
| C11 | **Nueva.** La definición de ajustes necesarios de la Ley 20.422 (art. 8) incluye el ambiente social y de actitud. | Respalda incluir las actitudes en el contexto (B3). | Baja | Nueva |

## C2. Orientaciones oficiales y fuentes internacionales (agregado el 15-nov-2026)

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| C12 | La Circular 586 obliga a tener un PAEC por cada estudiante autista y un protocolo DEC para todo el estudiantado. | El módulo de desregulación sirve para cualquier estudiante. Si el estudiante es autista, agrega "Revisa su PAEC". Prizma no reemplaza ninguno de los dos documentos. | Alta |
| C13 | La Circular 586 y Mineduc nombran elementos de prevención y estrategias para la crisis. La guía del Reino Unido de 2019 coincide en los principios. | El módulo de desregulación se arma en 3 momentos: antes, durante y después de la crisis. Su respaldo es la Circular 586, Mineduc 2025 y la guía del Reino Unido de 2019. | Alta |
| C14 | La Circular 586 prohíbe suspender, reducir la jornada, condicionar la matrícula y, en parvularia, sancionar. | Prizma nunca recomienda esas medidas. | Alta |
| C15 | Mineduc recomienda decir "estudiante autista", no "estudiante con TEA". | Agregarlo a las reglas de redacción. | Media |
| C16 | Los documentos de Mineduc mezclan prácticas con evidencia sólida y otras con evidencia débil, como los chalecos con peso. | Cada recomendación declara su tipo de respaldo. Las de evidencia débil o dudosa no entran, o entran marcadas como "orientación oficial". | Alta |
| C17 | La EEF y el *SEND Code of Practice* usan 4 grandes áreas de necesidad. | Agrupar las 10 dimensiones en esas 4 áreas, más el contexto, para acortar la encuesta (D1). | Media |
| C18 | La EEF identifica 5 estrategias de enseñanza con buena evidencia: instrucción explícita, estrategias metacognitivas, andamiaje, agrupamiento flexible y tecnología. | Ponerlas como acciones destacadas del Tiempo 1, conectadas con su consideración DUA. | Media |

## D. Experiencia de uso

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| D1 | Con 10 dimensiones y su intensidad, la encuesta puede alargarse. | Hacerla en 2 pasos: primero el docente marca qué dimensiones aplican, con íconos, y después da la intensidad solo de esas. | Media |
| D2 | El PDF lo leen 2 públicos: el docente y el equipo de apoyo. | Interfaz en lenguaje simple. El PDF agrega el código de cada consideración DUA y el tipo de adecuación oficial, para el equipo. | Baja |
| D3 | La voz de la familia y del estudiante necesita su consentimiento. | Antes de usar esas preguntas, mostrar un aviso: "Pide permiso y explica para qué sirve". | Media |

## E. Responsabilidad

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| E1 | Si el contenido cambia, un PDF antiguo puede quedar desactualizado. | El PDF muestra la fecha y la versión del catálogo. | Media |
| E2 | Ya está prevista la revisión de profesionales. | Agregar quién revisó cada ficha y en qué fecha, como campo interno del catálogo. | Media |

## Cambios al plan por etapas

- **Etapa 0:** suma la CDPD, la Ley 20.845, el Decreto 67, la Ley 21.719 y las orientaciones de desregulación.
- **Etapa 1:** 36 acciones, 1 por consideración, más el campo de la meta de aprendizaje.
- **Etapa 2:** suma los facilitadores, la dimensión 10 y la voz del estudiante.
- **Etapa 3:** el Tiempo 2 cambia según el nivel, con ajustes razonables en superior.

Estos cambios no están aplicados en `diseno.md`. Se aplican cuando los apruebes.
La excepción es A9, que corregí porque era un error.
