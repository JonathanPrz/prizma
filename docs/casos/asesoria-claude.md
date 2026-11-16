# Casos semilla analizados por Claude (asesor) · 16-11-2026

Casos ficticios, sin diagnósticos, descritos como los ve un docente o un empleador. Las recomendaciones son el juicio experto de Claude con el catálogo actual. Son el «patrón de oro» contra el que se compara lo que entrega Prizma. DUA se indica por consideración; los apoyos, por `id`. Los esperados y excluidos están en `casos-semilla.json`.

| # | Caso | DUA recomendado | Apoyos específicos | Preguntas que necesité hacer |
|---|---|---|---|---|
| 1 | Básica, 3.°. Meta: comprender un texto informativo. 2 estudiantes leen con mucha dificultad. | 2.2, 2.5, 1.2, 5.3 | acc-2-audio, acc-2-pictogramas, acc-2-tiempo, acc-8-teclado | **¿Lo que evalúas es la lectura misma?** Si sí, no se lee en voz alta en esa evaluación. |
| 2 | Media TP, taller mecánico. Estudiante sordo que usa lengua de señas. | 1.2, 3.2, 2.5 | acc-6-audicion, acc-3-escrito, prac-rotulos, prac-recorrido, prac-procedimiento | **¿Qué forma de comunicarse usa hoy?** (LSCh, restos auditivos o lectura labial). **¿Las alarmas del taller son solo sonoras?** |
| 3 | Parvularia. Niño que se desregula en las transiciones y con el ruido. | 6.2, 7.4, 9.2 | acc-7-transiciones, acc-1-agenda, acc-7-tranquilo, acc-4-recreo, dec-antes-gatillantes, dec-antes-refugio | **¿Qué lo desencadena y qué lo calma?** **¿Existe un PAEC o el protocolo DEC del establecimiento?** |
| 4 | Básica. Estudiante recién llegado, lengua materna creole. | 2.3, 1.3, 2.1 | acc-10-lengua, acc-10-responder, acc-10-familia, acc-10-cultura, acc-2-pictogramas | **¿En qué lengua lee y escribe?** **¿La familia necesita intérprete?** Evaluar contenidos, no el español. |
| 5 | Media CH. Estudiante que termina antes y se aburre. | 8.2, 7.1 | acc-14-extension, acc-14-eleccion, acc-14-compactar, acc-14-pares, obj-enriquecimiento-historia | **¿Ya domina el contenido?** Comprobarlo con una tarea breve antes de compactar. |
| 6 | Superior, IP. Fatiga y ausencias por tratamiento; hará práctica en un hospital. | — | sup-plazos, sup-pausas, sup-remoto, sup-tiempo, pp-plan-superior, pp-c-ambiente, pp-e-compartir, pp-e-acuerdo | **¿Qué tareas de la práctica exigen esfuerzo sostenido?** **¿Qué quiere contar al centro?** |
| 7 | Básica. Estudiante en silla de ruedas; escribe con lentitud. | 4.1, 4.2 | acc-8-accesible, acc-8-desplazamiento, acc-8-teclado, acc-8-transcribe, acc-8-materiales | **¿Qué movimientos le cuestan?** **¿Cómo se evacúa?** |
| 8 | Trabajo, bodega. Trabajador con baja audición. | — | tr-alertas-visuales, tr-mensajes-escritos, tr-subtitulos, tr-analizar, tr-privacidad | **¿Usa lengua de señas?** **¿Hay grúas horquilla o alarmas sonoras?** (seguridad) |
| 9 | Básica. Curso con muchos conflictos, sin un caso individual. | 7.4, 8.4, 9.4, 9.2 | — | **¿Es un patrón del curso o crisis puntuales?** Si son crisis, el protocolo DEC. |

## Lo que emergió (pasos y preguntas clave que Prizma aún no tiene)
1. **¿Lo que se evalúa es esa habilidad?** Es la pregunta esencial para todo apoyo de forma: lectura en voz alta, teclado, tiempo, respuesta oral. Hoy está escondida en un paso de algunas fichas.
2. **¿Qué usa hoy la persona para comunicarse o acceder?** LSCh, Braille, lupa, tablero o su lengua materna. Esta respuesta filtra mejor que la situación: separa Braille de lupa y LSCh de restos auditivos.
3. **¿Ya domina el contenido?** Es una condición para los apoyos de desafío.
4. **Alerta de seguridad automática.** Si hay situaciones de visión, audición o movimiento, y además taller, laboratorio, terreno o trabajo, la página debe mostrar una alerta de alarmas y evacuación.
5. **¿Existe un PAEC, un PACI o el protocolo DEC?** Antes de los apoyos ante desregulación y de las adecuaciones en los objetivos.
6. **¿Qué quiere compartir y con quién?** En la práctica y el trabajo. Ya existe en el documento del centro; falta en Trabajo.
7. **La lengua de la familia,** para comunicar los acuerdos.
8. **«¿Cómo sabremos que funciona?»** Los acuerdos no tienen un **criterio de logro**: solo fechas. Sin criterio, la revisión no tiene contra qué comparar.
9. **Distinguir patrón y crisis** en el curso, para no individualizar lo que es del diseño de la clase.

## Errores o vacíos detectados
- «Visión» sigue mezclando a quien usa Braille con quien usa lupa. La pregunta 2 lo resuelve.
- No hay alerta de seguridad, aunque las fichas de seguridad existen.
- Los acuerdos no tienen criterio de logro.
- Desregulación no pregunta si existe un PAEC o el protocolo.
