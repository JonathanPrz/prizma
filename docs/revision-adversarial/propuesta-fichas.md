# Fichas del catálogo según la revisión adversarial · propuesta (O9 a O11, O13 a O17)

Claude · **nada se cambia en `data/` sin la aprobación del dueño.**

| Objeción | Ficha | Cambio propuesto | Fuente |
|---|---|---|---|
| O9 | `acc-9-plazos` | Agregar `decreto-67`. Primer paso nuevo: «Revisa qué dice el reglamento de evaluación de tu establecimiento sobre ausencias prolongadas.» Los demás pasos se mantienen como práctica. | Decreto 67, art. 18 l): el reglamento debe tener criterios para las ausencias a clases por períodos prolongados. |
| O10 | `acc-11-recursos` | El paso «Presta materiales o acceso a computador» pasa a «Presta materiales o acceso a computador, según lo que tenga el establecimiento.» | Sigue como consenso de expertos. |
| O11 | `sup-anticipar` | Quitar el enlace `dua: 6.2`. Publicar el programa y las rúbricas ya es una acción para todo el curso, y su «versión para el curso» no era equivalente. | — |
| O11 | `acc-4-normas` | Se mantiene el enlace con la 8.4: la acción del curso incluye ahora 3 acuerdos en positivo, a la vista, que es la versión para todos de explicar las normas. | — |
| O13 | `dua-5-1` | Paso nuevo: «Si la meta es un formato, por ejemplo escribir un texto, ese formato se mantiene.» | CAST 5.1: la variedad de medios vale salvo que el medio sea parte de la meta. |
| O14 | `tr-mensajes-escritos` | «Usa chat o correo para avisos urgentes» pasa a «Usa chat o mensajes para los avisos del día a día.» Paso nuevo: «Para emergencias, acuerda con prevención de riesgos una alarma que pueda ver o sentir; un correo no basta.» | JAN audición (alertas visuales); OIT 2016 sobre riesgos concretos. |
| O15 | `prac-evaluar` | Agregar la dimensión 9 (salud y energía), para que aparezca cuando la fatiga afecta la práctica. | La ficha ya exige mantener el desempeño y la seguridad esenciales. |
| O16 | `acc-9-rutina` | Pasa a parvularia y **básica**, con texto para ambos niveles: «actividades» en vez de «experiencias», y en el «por qué», «cada estudiante». Media no se incluye, porque el Decreto 83 rige para parvularia y básica. | Decreto 83, organización del tiempo y el horario. |

## O17 · Los casos semilla de Claude
Codex tiene razón: los casos semilla (`docs/casos/`) exigen apoyos fijos cuando el caso no da datos suficientes, por ejemplo el teclado o los subtítulos. Se propone agregar en `casos-semilla.json` un campo `condicionales` con esos apoyos y su condición. La prueba `probar_preguntas_clave.cjs` ya no los exigiría: solo comprobaría que estén disponibles si se cumple la condición.

## O11, el resto de los enlaces
Hay más fichas de acceso enlazadas con una acción DUA. Se propone que un subagente revise todos los enlaces (`dua`) y marque los que no son equivalentes, con control a ciegas, como en la tarea 043.

## Resultado de la revisión de enlaces (O11)
Un subagente revisó los 46 apoyos enlazados con una acción DUA (`enlaces-dua.csv`): 27 equivalentes, 18 cercanos y 3 no equivalentes. Otro modelo controló 10 pares a ciegas:
- **Coincide en los 3 no equivalentes:** `acc-4-normas` con `dua-8-4-pertenencia`, y `acc-14-extension` y `sup-profundizar` con `dua-8-2`. En los dos últimos, la acción del curso da apoyo a quien le cuesta, mientras que el apoyo individual da más desafío a quien ya domina.
- **Agrega un cuarto:** `acc-11-curso` (actitudes del curso ante los apoyos) con `dua-8-4-pertenencia`.
- **En el resto, solo hay diferencias entre categorías vecinas,** equivalente o cercana.

Esto corrige la propuesta anterior sobre `acc-4-normas`: su enlace no es equivalente. Se propone quitar los 4 enlaces.
