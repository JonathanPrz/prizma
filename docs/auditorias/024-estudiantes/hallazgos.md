# Hallazgos priorizados · Auditoría 024

La prioridad expresa el riesgo de interpretar mal un apoyo, no un diagnóstico del estudiante. La evidencia se limita a estos diez casos, al catálogo medido y a las reglas actuales. No se proponen ni implementan soluciones.

## Alta

### A1. La misma situación mezcla acceso visual y acceso al habla

`vision` y `senas` tienen la misma dimensión 6 y reciben listas idénticas, en el mismo orden, en todos los niveles y con ambos estados de práctica. En básica, el perfil que usa señas ve primero `acc-6-ampliar`, después `acc-6-braille`; la ficha pertinente `acc-6-audicion` es tercera. Para quien usa lupa, Braille y la ficha de audición tampoco corresponden a lo descrito. En superior ocurre el mismo cruce con `sup-vision`, `sup-senas` y `sup-audicion`.

Causa probable: una situación demasiado amplia. El criterio no es la mera presencia de la palabra «Braille»: `sup-vision` es adecuada para quien usa lupa porque pide acordar el formato y admite ampliación. `acc-6-braille`, en cambio, pide coordinar transcripción a Braille en su primer paso, pese a que este perfil declara que no lo usa. Véanse las justificaciones completas.

### A2. Expresión oral en español activa traducción y apoyos auditivos

`oral` comprende español y usa un tablero para responder. En básica recibe `acc-10-lengua`, `acc-10-responder` y `acc-6-audicion`. En superior recibe `sup-lengua`, `sup-senas` y `sup-audicion`. La etiqueta 3 comparte expresión, comprensión, otra lengua y acceso al habla. El recién llegado `lengua` también recibe apoyos de señas/audición, aunque se comunica oralmente en su lengua.

Causa probable: etiquetas de situación que no distinguen la barrera concreta. La clasificación no supone que quien necesita traducir español necesite lengua de señas, ni que quien no produce habla no comprenda su lengua materna.

### A3. Falta de desafío recibe la misma lista que dificultad para terminar

`tareas` tiene frecuencia 3 en atención/organización. `desafio` tiene frecuencia 1 porque se desconecta **después** de terminar. Sus listas son idénticas en contenido y orden en las siete combinaciones. Cambiar solo la frecuencia multiplica los puntajes de sus coincidencias, pero no cambia el orden relativo con una única situación.

En básica el caso `desafio` no tiene ningún acceso adecuado entre los que se muestran: agenda, ubicación, luz, fraccionamiento, organizador, movimiento y horario no aportan profundidad. Solo la ficha condicional general de enriquecimiento responde directamente al desafío descrito. En superior no hay una ficha individual de profundización y el caso tampoco obtiene un acceso adecuado. `sup-tiempo` trata tiempo adicional, contrario a la espera por terminar antes.

Causas: falta un dato discriminante en el perfil y falta una ficha específica de profundización en superior. No se afirma que el estudiante tenga una categoría o diagnóstico particular.

### A4. El orden visible puede enterrar el apoyo pertinente

El orden real agrupa primero presentación, luego respuesta, entorno y tiempo. Dentro de cada subtipo mantiene la lista ordenada por puntaje; para empates conserva el orden del catálogo. No es un orden clínico ni de pertinencia textual. Todos los diez perfiles tienen al menos un empate de puntaje en acceso sin práctica.

En básica, para `oral`, los cinco primeros son `acc-3-escrito`, `acc-10-lengua`, `acc-2-pictogramas`, `acc-4-normas` y `acc-6-audicion`: ninguno fue clasificado como adecuado al caso. `acc-3-caa`, que sí responde al tablero, queda **sexto**. En superior los tres primeros para ese perfil son señas, glosario para otra lengua y audición, antes del formato alternativo pertinente.

Causa: orden poco útil, combinado con etiquetas amplias. La captura y la medición de VM coinciden en las listas del cuarto y décimo perfiles. Esto explica por qué observar solo `accesosVisibles()` sin respetar el renderizado habría dado otros cinco primeros.

## Media

### M1. La práctica añade nueve opciones iguales incluso con puntaje cero

En básica, media y superior, la casilla suma exactamente nueve accesos a **cada** perfil. Algunas coinciden con su barrera; otras no. El grupo práctico no exige coincidencia positiva. Para N=10, Jaccard de acceso sube de 0,105 a 0,481 en básica y de 0,164 a 0,555 en superior. Esa mayor similitud no demuestra mejor cobertura.

Ejemplo: `prac-asistente` aparece también para lectura, comunicación o aburrimiento, sin una barrera de manipulación declarada. Se clasifica como discutible, no como una orden equivocada de asignar asistente: la ficha es explícitamente condicional. Las nueve fichas están revisadas para cada perfil en ambos niveles.

Causa: falta información en el perfil que justifique cada opción práctica. No se presenta su utilidad general de seguridad como necesidad individual demostrada.

### M2. El recuadro DUA cuenta bien, pero su interpretación puede confundir

Con N=10 aparecen estas tres líneas: atención/organización, comunicación/lenguaje y visión/audición, con dos estudiantes cada una. No aparecen iniciales. El primer botón activa `tareas-largas` («Se pierden en tareas largas o con muchos pasos»), aunque uno de sus dos casos ya termina rápido. Las dimensiones 3 y 6 conducen a `comprension` («No entienden las explicaciones o las instrucciones»), pese a que el problema puede ser percibir la información o expresarse, con comprensión conservada.

No hay error aritmético: lo que se repite es la casilla, no necesariamente la causa. El recuadro **no escribe** esas frases de necesidad: aparecen al marcar la necesidad asociada. El script registra ambas cosas por separado y el navegador confirma el botón de atención.

Las versiones DUA ofrecidas se registran por ID en cada escenario. La versión disponible cumple el nivel actual; que exista una buena acción universal no vuelve pertinente la ficha individual de la que proviene. En las simulaciones se elige una misma ficha para dos perfiles de lista idéntica: el aviso «Lo elegiste para 2 estudiantes» cuenta correctamente las elecciones. Ese mensaje tampoco acredita que ambos necesiten esa ficha.

Causa: una situación demasiado amplia y falta de un dato discriminante. Véanse [escritorio](n10-1280-dua.png) y [teléfono](n10-390-dua.png).

### M3. «Le ayuda» y la voz no modifican la recomendación

Los textos se conservan y pueden aparecer en el documento. No participan en `puntaje()` ni en la selección de accesos; la contraprueba cambia ambos textos y obtiene los mismos IDs. Dos estudiantes con distinta ayuda escrita pero idénticas situaciones siguen viendo lo mismo. El resultado no demuestra pérdida de datos: demuestra el límite del perfil utilizado por el filtro.

Causa: falta un dato estructurado utilizado por la lógica; el texto libre no se interpreta. No se evaluó ni se propone un mecanismo para interpretarlo.

### M4. El contexto de edición se pierde al desplazarse en filtros móviles

Con cuatro y diez estudiantes, al inicio del diálogo se ve un único botón presionado, el selector funciona con Enter/Espacio y los campos corresponden al activo. Al final del formulario a 390 px, ni el selector ni Iniciales están en pantalla y el título solo dice «Filtros». Por tanto, **no** se sabe siempre quién se está editando a partir de lo visible en ese punto. No se observó que se mezclaran sus datos.

En escritorio, diez estudiantes ocupan diez filas en el selector y desplazan los campos hacia abajo. La captura de cambio mediante teclado muestra la navegación vertical y el foco. Se conservan los datos al alternar entre el primero y el último en las cuatro combinaciones. No hubo desborde horizontal ni errores de JavaScript.

| N | Escritorio: resultados | Escritorio: selector | Teléfono: resultados | Teléfono: selector | Teléfono: final del formulario |
|---|---|---|---|---|---|
| 4 | [Ver](n4-1280-resultados.png) | [Ver](n4-1280-selector.png) | [Ver](n4-390-resultados.png) | [Ver](n4-390-selector.png) | [Ver](n4-390-final-filtros.png) |
| 10 | [Ver](n10-1280-resultados.png) | [Ver](n10-1280-selector.png) | [Ver](n10-390-resultados.png) | [Ver](n10-390-selector.png) | [Ver](n10-390-final-filtros.png) |

Causa: el contexto de identidad no permanece visible durante ese desplazamiento. Es un hallazgo de orientación, no una prueba de confusión real en docentes; no se hizo estudio con usuarios.

## Baja / contexto de interpretación

### B1. Las opciones condicionales elevan la similitud y el número de fichas

En básica, sin elegir asignatura, todos los perfiles tienen trece fichas de objetivos y nueve de desregulación disponibles al desplegar esas secciones: 22 opciones comunes. Parvularia tiene nueve de desregulación y ninguna de objetivos. Media tiene doce de objetivos y nueve de desregulación. Superior no tiene esas secciones con tarjetas aplicables.

No son 22 recomendaciones personales priorizadas por el perfil. La clasificación conserva cada opción, la identifica como condicional y explica qué evidencia falta. Para el caso de mayor desafío, simplificar, postergar o eliminar objetivos se juzga inadecuado a lo descrito, aunque la sección advierta que el acceso debe haberse agotado. El conteo total de discutibles no se interpreta como porcentaje de «errores» del filtro de acceso.

### B2. El PDF conserva el orden y las elecciones, incluidas las poco pertinentes

En los 21 documentos medidos no se detectaron fichas partidas, grupos huérfanos ni líneas fuera de página. El de diez estudiantes adjunto tiene 26 páginas. Lectura empieza en la 4; visión, en la 6; señas, en la 8; comunicación oral, en la 10; otra lengua, en la 12; tareas, en la 14; movimiento, en la 16; ruido, en la 18; fatiga, en la 21; desafío, en la 23. Las fuentes comienzan en la 26. Cada estudiante inicia su propia página.

[Portada](pdf-portada.png) · [Página de baja visión](pdf-vision.png) · [PDF completo](prizma-plan-10-estudiantes.pdf).

El PDF no corrige la pertinencia. Esta auditoría **eligió** los cinco primeros accesos de cada perfil para la prueba; la aplicación no los elige automáticamente. Por eso el documento de CO conserva opciones de traducción/audición y deja fuera CAA. Para FA y MO solo existen cuatro accesos en ciertas combinaciones; se exportan esos cuatro, sin inventar un quinto. El resultado depende de esta selección declarada; no es un ensayo exhaustivo de todas las notas ni de todos los tamaños de ficha posibles.

## Qué cubre y qué falta en cada perfil

La ausencia de una ficha **directa** no se confunde con ausencia de toda ayuda posible.

| Perfil | Básica | Superior | Vacío o límite relevante |
|---|---|---|---|
| lectura | Audio, tiempo y registro alternativo adecuados | Formatos, digital, apuntes y tecnología adecuados | Hay cobertura de acceso al texto/registro; la consolidación de lectura no se evalúa con este perfil ni con estos apoyos. No se demuestra falta de una ficha de acceso para la barrera descrita. |
| vision | Ampliación, ubicación y ayuda técnica adecuadas | Digital, formato visual acordado y tecnología adecuados | Cobertura presente, mezclada con audición/Braille no pertinentes. No hace falta atribuirle otro sistema lector. |
| senas | La ficha de audición permite coordinar intérprete | Intérprete/subtítulos y acceso al discurso adecuados | Cobertura presente; la lista incluye vías visuales no requeridas. La presencia de micrófono no sustituye lengua de señas. |
| oral | CAA responde al tablero, pero queda sexta | Formatos alternativos permiten una vía no oral | En superior no hay una ficha específica que garantice tablero disponible y turnos/tiempo para esa vía expresiva. La ficha genérica podría cubrirlo, pero no lo dice. Se registra como falta de especificidad, no ausencia absoluta de acceso. |
| lengua | Traducción, respuesta en su lengua e imágenes adecuadas | Glosario/traductor y formato alternativo adecuados | Hay cobertura parcial de las instrucciones; no se comprueba comprensión completa solo por disponer de un glosario. El perfil no describe enseñanza de español como objetivo del plan. |
| tareas | Secuencia, bloques y lugar con menos distracción adecuados | Expectativas, material previo y anticipación adecuados | En superior la secuencia paso a paso queda más explícita en `prac-procedimiento`, que solo aparece con práctica. No se afirma que no haya apoyo de organización en la lista general. |
| movimiento | Acceso físico, materiales y registro alternativo adecuados | Espacios, tecnología, apuntes y formatos adecuados | Cobertura presente para lo descrito. No se demuestra falta de una ficha de acceso. |
| ruido | Anticipación, pausas y espacio tranquilo adecuados | Regulación de ruido, pausas y referencia adecuadas | Cobertura presente; no se debe deducir exposición pública o crisis solo de la casilla. |
| fatiga | Plazos, descansos, horario y coordinación adecuados | Plazos, pausas, tiempo acordado y acceso remoto adecuados | Cobertura presente de ausencias/fatiga. La intensidad o pauta exacta no está medida por la auditoría. |
| desafio | Ningún acceso directo adecuado; enriquecimiento general sí es pertinente en una sección condicional | Ningún acceso directo adecuado ni ficha individual de profundización | Es el vacío completo más claro de estos perfiles: seguir aprendiendo con mayor profundidad no se representa en la misma casilla de atención. Causas: falta una ficha en superior y falta un dato que distinga necesidad de desafío. |

Las decisiones completas de cada ficha, incluidas las nueve de práctica para cada perfil, están en [clasificacion.md](clasificacion.md). No se concluye que una ficha sea clínicamente eficaz ni se prescribe un apoyo por pertenecer a un grupo.
