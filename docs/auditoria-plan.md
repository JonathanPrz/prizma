# Auditoría del diseño de Prizma

Revisión de `docs/diseno.md` (versión 0.1) contra las fuentes.
Fecha: 15 de noviembre de 2026.

**Base de la revisión**
- **Verificada:** DUA 3.0 y CIF, leídas en la fuente. Ver `fuentes/dua-3.0.md` y `fuentes/cif.md`.
- **Preliminar:** normativa chilena, revisada de memoria. Falta confirmar con el texto. Ver `fuentes/README.md`.

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

## C. Normativa chilena (preliminar, falta verificar)

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| C1 | El Decreto 83 ordena 3 pasos: DUA para todos, luego adecuaciones de acceso y al final adecuaciones en los objetivos. El diseño ya sigue ese orden. | Mantener el orden y citar el decreto en la ayuda. | Alta |
| C2 | Según recuerdo, el Decreto 83 define 4 tipos de adecuación de acceso: presentación de la información, formas de respuesta, entorno, y organización del tiempo y el horario. También define 5 tipos de adecuación en los objetivos: graduación de la complejidad, priorización, temporalización, enriquecimiento y eliminación, que es el último recurso. | Usar esos tipos oficiales como categorías del catálogo. Así Prizma habla el mismo idioma que el PIE. | Alta |
| C3 | Las adecuaciones en los objetivos se formalizan en un PACI, el Plan de Adecuaciones Curriculares Individualizado. Se decide con el equipo y la familia, después de una evaluación. | Prizma no genera un PACI. Su PDF dice "Propuesta para conversar con el equipo de apoyo". | Alta |
| C4 | El Decreto 83 rige para parvularia y básica. Media se rige por la evaluación diversificada del Decreto 67 y por el PIE del Decreto 170. En superior no existe la "adecuación curricular" en el mismo sentido: rigen los **ajustes razonables** de la CDPD y la Ley 20.422. | El Tiempo 2 cambia según el nivel. En superior, la sección se llama "Ajustes razonables" y oculta las adecuaciones de objetivos. | Alta |
| C5 | Falta la Convención sobre los Derechos de las Personas con Discapacidad (ONU, 2006), que Chile ratificó en 2008. Define los ajustes razonables (art. 2) y el derecho a la educación inclusiva (art. 24). | Agregarla como fuente. | Media |
| C6 | La Ley 21.545 pide que los establecimientos tengan protocolos para las desregulaciones. El protocolo es del establecimiento, no de Prizma. | En desregulación, Prizma da solo prevención y orientaciones generales tomadas de documentos oficiales. Cada ficha termina con "Sigue el protocolo de tu establecimiento". Nunca da instrucciones de contención física. | Alta |
| C7 | El Decreto 170 define las categorías de NEE para el PIE. | La lista de "condición como atajo" usa esas categorías y no se guarda. | Media |
| C8 | Datos personales. Un informe psicopedagógico tiene datos sensibles de salud. La Ley 21.719 de protección de datos (2024) entra en vigencia en diciembre de 2026, según recuerdo. | Agregar la Ley 21.719 como fuente a revisar. Prizma no sube informes y guarda solo iniciales. En computadores compartidos debe avisar y ofrecer "Borrar al salir". | Media |

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
