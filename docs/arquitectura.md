# Arquitectura de información de Prizma · Propuesta para discutir

Versión 0.1 · 16 de noviembre de 2026 · Claude, a partir de la auditoría `docs/auditorias/034-arquitectura/`.
Los códigos entre corchetes, como [A1], remiten a los problemas de esa auditoría.

**Estado: propuesta.** No se implementa hasta que el dueño la apruebe.

## 1. Principios
1. **Primero el ámbito, después el detalle.** Quien llega elige si viene por educación o por trabajo. Nunca ve lo del otro ámbito mientras no cambie. [A1, M6, B4]
2. **Cada parte se explica a sí misma.** Antes de elegir, la persona entiende qué es lo que está eligiendo: qué es el DUA, qué es una adecuación, qué es un ajuste. [A1, M8]
3. **Un término por cosa, siempre el mismo.** [M5]
4. **Nada de lo que cambia todo queda escondido.** El nivel se elige a la vista, y cambiarlo avisa qué afecta. [M2]
5. **Menos desplazamiento:** la siguiente acción queda siempre a mano. [A3]

## 2. Estructura

```
Cabecera: logo · subtítulo · tema · Mi mochila
│
├── Inicio (solo si aún no se eligió ámbito)
│     «¿Dónde quieres apoyar?»  [Educación]  [Trabajo]
│
├── EDUCACIÓN
│     Barra: Nivel (visible siempre) · Cambiar ámbito
│     Pestañas: [Para el curso (DUA)]  [Para un estudiante]  (superior: «Ajustes razonables»)
│     ├── Para el curso (DUA)
│     │     Definición breve + «¿Qué es el DUA y cómo usarlo?»
│     │     1. Describe tu clase (incluye «Mi clase tiene taller, laboratorio o terreno»)
│     │     2. Acciones sugeridas
│     │     3. Tu selección y reflexión → Ver documento
│     └── Para un estudiante
│           Definición breve + «¿Qué son los apoyos para un estudiante?»
│           Casos · 1. Describe · 2. Apoyos sugeridos · 3. Acuerdos → Ver documento
│           (práctica profesional dentro del caso, en media y superior)
│
└── TRABAJO
      Barra: Cambiar ámbito
      Definición breve + «¿Qué son los ajustes en el trabajo y qué exige la ley?»
      Casos · 1. Describe · 2. Ajustes sugeridos · 3. Acuerdos → Ver documento
```

## 3. Decisiones por problema

| Problema | Decisión propuesta |
|---|---|
| **[A1]** Se entra directo a DUA, sin explicar qué es. | **Pantalla de inicio** (no ventana emergente) con 2 tarjetas: «Educación: acciones para todo el curso y apoyos para cada estudiante» y «Trabajo: ajustes para personas trabajadoras con discapacidad». La elección se recuerda; «Cambiar ámbito» la reabre. Cada pestaña empieza con una **definición de una o dos líneas** y su guía. |
| **[A2]** El aviso de privacidad habla de estudiantes en Trabajo. | **Un aviso por ámbito.** Educación: estudiantes, iniciales, sin diagnósticos, Ley 21.719. Trabajo: personas trabajadoras, reserva del Código del Trabajo (art. 154 ter), sin diagnósticos. |
| **[A3]** Mucho desplazamiento hasta el documento. | **Indicador de pasos fijo** en cada caso («1 Describe · 2 Elige · 3 Acuerda»), que lleva a cada paso. En el teléfono, una **barra inferior fija** con «Continuar (N elegidos)». Los grupos después de «Para empezar» se muestran **plegados** con su conteo («Formas de respuesta (4)»). |
| **[M1]** Dos casillas de práctica confusas. | La de **taller, laboratorio o terreno** pasa al paso 1 del DUA: es una propiedad de la clase. La de **práctica profesional** queda en el caso del estudiante. Cada una con una ayuda que la distingue de la otra: «Clase con taller o laboratorio en el liceo o la institución» y «Práctica en una empresa o institución, fuera de las clases». |
| **[M2]** Un nivel gobierna todos los casos. | **Se mantiene un nivel para Educación**, porque un docente suele trabajar en un nivel. Siempre visible. Si hay casos guardados, cambiarlo pide confirmación: «Cambiar el nivel cambia los apoyos sugeridos de tus N casos. Lo que ya elegiste se conserva». |
| **[M3]** En superior se pregunta por la familia. | En superior, «¿Qué dice el estudiante?» (sin familia), en la página y en el PDF. |
| **[M4]** Se puede generar el documento sin acuerdos. | Se permite, pero el documento lleva arriba **«Borrador: acuerdos sin completar»** mientras falte el paso 3. El documento para el centro de práctica también. |
| **[M5]** Términos distintos para lo mismo. | **Glosario fijo** (sección 4). Se elimina «Apoyos individualizados» como título: queda «Apoyos para un estudiante». |
| **[M6]** El pie de Trabajo enlaza a guías educativas. | **Pie por ámbito:** cada ámbito enlaza solo a sus guías, a la privacidad y a «Cambiar ámbito». |
| **[M7]** «N apoyos» no cuenta todo. | Cada grupo muestra su propio conteo. El total se rotula «N adecuaciones de acceso sugeridas». |
| **[M8]** No se explica qué es cada tipo de apoyo. | Guía «¿Qué son los apoyos para un estudiante?» (sección 5) y una línea de definición bajo cada grupo. |
| **[B1]** Vocabulario de parvularia incompleto. | El paso 1 y la guía usan `data-voc`: «Describe tu experiencia de aprendizaje». |
| **[B2]** Entradas repetidas a las guías. | Una entrada por pestaña, bajo la definición, y la del pie del ámbito. |
| **[B3]** Bloque de objetivos vacío en parvularia y superior. | No se muestra el bloque. En su lugar va una línea: «En parvularia preferentemente no se adecuan los objetivos (Decreto 83)» o «En superior no se adecuan los objetivos: se hacen ajustes razonables». |
| **[B4]** La mochila mezcla ámbitos. | **Mochila por ámbito:** en Trabajo solo muestra lo de trabajo. «Borrar todo» pasa a «Borrar los datos de Educación» o «de Trabajo». El respaldo sigue siendo uno solo y lo dice. |

## 4. Glosario (lo que ve la persona)

| Término | Qué es | Dónde se usa |
|---|---|---|
| **Acción DUA** | Algo que haces para todo el curso. | Pestaña «Para el curso (DUA)». |
| **Apoyo** | Término general para lo que necesita un estudiante en particular. | Título de la pestaña y de los grupos escolares. |
| **Adecuación de acceso** | Apoyo que cambia cómo recibe la información, cómo responde, el entorno o el tiempo, sin cambiar lo que debe aprender (Decreto 83). | Grupos de la escuela. |
| **Adecuación en los objetivos** | Apoyo que cambia qué aprende o cuándo. Último paso (Decreto 83). | Bloque de objetivos, básica y media. |
| **Apoyo ante desregulación** | Qué hacer antes, durante y después de una crisis. | Bloque de desregulación, escuela. |
| **Apoyo para la práctica** | Lo que hacen el liceo o la institución, el centro y el estudiante. | Bloque de práctica profesional. |
| **Ajuste razonable** | En superior: cambio en la enseñanza, la evaluación o el entorno que mantiene los resultados de aprendizaje (Ley 21.091). | Toda la pestaña en superior. |
| **Ajuste en el trabajo** | Cambio en el puesto, la comunicación, las herramientas o el horario. La ley lo llama «ajuste necesario» (Ley 20.422, art. 8). | Ámbito Trabajo. |
| **Situación** | Dónde y con qué frecuencia aparece una barrera. Nunca un diagnóstico. | Paso 1 de los casos. |

«Ficha» y «recomendación» son palabras internas: no se muestran.

## 5. Textos explicativos (propuesta, en palabras propias)

### ¿Qué es el DUA y cómo usarlo? (pestaña «Para el curso»)
**Definición breve (bajo el título):** «Planifica tu clase con opciones desde el inicio, para que todo el curso pueda aprender sin esperar a que alguien se quede atrás.»

**Guía, parte 1: qué es.**
El Diseño Universal para el Aprendizaje (DUA) es una forma de planificar. En vez de preparar la clase para un estudiante «promedio» y adaptarla después, se diseña desde el principio con opciones para todos. Se organiza en 3 principios:
- distintas formas de **motivarse** y sostener el interés;
- distintas formas de **recibir la información**;
- distintas formas de **expresarse y organizarse**.

Las Pautas DUA 3.0 (CAST, 2024) los desarrollan en 9 pautas y 36 consideraciones. En Chile, el Decreto 83 (2015) lo presenta como el primer paso para responder a la diversidad, y el Decreto 67 (2018) pide diversificar la enseñanza y la evaluación.

**Parte 2: cómo usarlo.** Los 6 pasos actuales de la guía, sin cambios.

### ¿Qué son los apoyos para un estudiante? (escuela)
**Definición breve:** «Cuando las acciones para todo el curso no bastan, un estudiante puede necesitar apoyos propios. Se acuerdan con él, su familia y el equipo.»

**Guía:**
- **Adecuaciones de acceso.** Cambian cómo recibe la información, cómo responde, el entorno o el tiempo. No cambian lo que debe aprender. Son la primera opción (Decreto 83).
- **Adecuaciones en los objetivos.** Cambian qué aprende o cuándo: graduar, priorizar, dar más tiempo o enriquecer y, solo como último recurso, eliminar. Se deciden con el equipo y la familia y se registran en el PACI (Decreto 83).
- **Apoyos ante desregulación.** Qué hacer antes, durante y después de una crisis, junto al protocolo de tu establecimiento (Circular 586).
- **Apoyos para la práctica profesional,** en media técnico-profesional (Decreto 2.516).

Prizma no parte del diagnóstico. Parte de las situaciones en que el estudiante encuentra barreras, como propone la CIF (OMS, 2001).

Después, los 6 pasos actuales de «Cómo usar los apoyos».

### ¿Qué son los ajustes razonables? (superior)
**Definición breve:** «Cambios en la forma de enseñar, evaluar o en el entorno que permiten participar en igualdad, sin bajar los resultados de aprendizaje.»

**Guía:** en la educación superior no se adecuan los objetivos. Se hacen ajustes razonables, que se acuerdan con el estudiante y la unidad de inclusión (Ley 21.091, art. 2 e; Ley 20.422, art. 39). Después, los 6 pasos actuales de «Cómo acordar ajustes razonables».

### ¿Qué son los ajustes en el trabajo y qué exige la ley? (Trabajo)
**Definición breve:** «Cambios en el puesto, la comunicación, las herramientas o el horario que permiten a una persona con discapacidad trabajar en igualdad.»

**Guía, parte 1:** la ley chilena los llama ajustes necesarios (Ley 20.422, art. 8). Se acuerdan con la persona, a partir de las tareas del cargo y sin pedir diagnósticos.

**Parte 2:** el texto actual de «¿Qué exige la ley al empleador?».

## 6. Preguntas abiertas para el dueño
1. ¿Pantalla de inicio con la elección de ámbito, o dos botones permanentes arriba sin pantalla de inicio?
2. ¿Un nivel para todo Educación con aviso al cambiarlo, o un nivel por estudiante?
3. ¿Mochila separada por ámbito?
4. ¿Documento con «Borrador» cuando faltan acuerdos, o bloquear el documento hasta completarlos?
5. ¿Los grupos después de «Para empezar» se muestran plegados?
