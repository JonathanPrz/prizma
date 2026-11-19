# Fichas DUA frente al texto de CAST · propuesta de corrección (tarea 044)

Claude · a partir de `dua-respaldo-A.csv`, `dua-respaldo-B.csv` y del control a ciegas. **Nada se cambia en `data/` sin la aprobación del dueño.**

## Resultado
Se revisaron 56 fichas contra el texto de su consideración:
- 41 respaldadas;
- 12 en parte;
- 3 sin respaldo;
- ninguna contradice a CAST.

**Control a ciegas** (otro modelo, 10 fichas al azar): en las 10, la acción central está en CAST. Fue más estricto que la revisión con los pasos y con el «por qué»: 6 de las fichas «respaldadas» quedan «en parte» porque el «por qué» afirma un efecto que CAST no dice, o porque un paso viene de otra consideración.

**Corrección a la propia revisión:** dos fichas de acceso se revisaron contra la consideración sugerida y no contra la que tienen en su campo `dua`:
- `acc-14-abiertos` está enlazada a la 3.3, no a la 5.2. Contra la 3.3 queda «en parte»: la 3.3 propone modelos que guían la exploración y varias formas de entrar a un tema.
- `sup-proyecto` está enlazada a la 5.1, no a la 8.2.

## Por qué no se mueven fichas de consideración
Las fichas de acceso enlazan con su versión DUA por la consideración (`versionCurso` en `app.js`). Además, el validador exige al menos una acción por consideración en cada nivel. Si `dua-6-2` u otra ficha cambia de consideración, se rompe «Agregar al curso» en varias fichas de acceso, o queda una consideración vacía. Por eso se propone **reescribir las fichas para que respondan a su consideración**, sin cambiar su id ni su enlace.

## A · Reescribir para que calcen con su consideración (2 fichas)

**`dua-6-2` (6.2: anticipar y planificar los desafíos).** Hoy muestra la agenda, que corresponde a la 7.4. La 6.2 incluye planificar los pasos de una tarea y anticipar lo difícil, así que se conserva la agenda como plan de pasos y se suma la anticipación del estudiante. Siguen enlazadas `acc-1-agenda`, `acc-5-anticipar`, `sup-anticipar` y `sup-expectativas`.
- Título: «Muestra los pasos de la clase y anticipen juntos qué puede costar».
- Cómo:
  - «Muestra al inicio los pasos de la clase, con palabras o imágenes.»
  - «Pregunta qué paso creen que les costará más y qué harán si pasa.»
  - «Marca lo que ya hicieron y avisa con tiempo si algo cambia.»
- Por qué: «Planificar los pasos y anticipar lo difícil ayuda a organizarse y a no quedarse detenido.»

**`dua-8-4-pertenencia` (8.4: pertenencia y comunidad).** Hoy acuerda normas, que corresponde a la 8.3 o a la 9.4. La 8.4 propone que el curso diga qué significa sentirse parte y cómo lograrlo. Sigue enlazada `acc-4-normas`.
- Título: «Pregunta al curso qué los hace sentirse parte y acuerden cómo cuidarlo».
- Cómo:
  - «Pregunta qué hace que alguien se sienta parte del curso.»
  - «Elijan juntos 3 acuerdos en positivo, a la vista de todos.»
  - «Revisen cada cierto tiempo si alguien está quedando fuera.»
- Por qué: «Sentirse parte no significa lo mismo para todos; preguntarlo permite cuidar a quien suele quedar fuera.»

## B · Ajustar un paso o el «por qué» (7 fichas)

| Ficha | Problema | Cambio |
|---|---|---|
| `dua-7-3` | Propone «competencia por equipos», y la 8.2 prefiere el proceso y el progreso antes que la competencia. El «por qué» afirma que el juego baja la tensión. | Paso: «Plantea 5 minutos de adivinanza, misterio o desafío en equipo.» Por qué: «El juego y la alegría suman ganas de participar.» |
| `dua-8-1-parv` | «Da seguridad» no está en la 8.1. | Por qué: «Saber qué van a hacer y para qué ayuda a mantener el esfuerzo.» |
| `acc-14-compactar` | «Repetir lo ya aprendido desmotiva» no está en CAST. | Por qué: «Un desafío a su medida sostiene el esfuerzo.» |
| `dua-8-3` | «Sin etiquetar» no está en la 8.3. | Por qué: «Agrupar de distintas formas según la tarea permite aprender unos de otros.» |
| `acc-2-registro` | Afirma un hecho del desarrollo («el trazo todavía se está desarrollando»). | Por qué: «Lo que se busca es que comunique la idea, no cómo la escribe.» |
| `dua-5-2-parv` | El efecto sobre la manipulación no está en la 5.2. | Por qué: «Así la dificultad para manipular no impide crear.» |
| `dua-6-3-parv` | La 6.3 habla de organizar la información para recordarla, no del material. | Por qué: «Las imágenes ayudan a recordar dónde va cada cosa sin tener que preguntar.» |

## C · Sin cambio (12 fichas)
Sus pasos van algo más allá de la consideración, pero son concreciones razonables, de consenso, que caben en consideraciones vecinas. No afirman efectos sin fuente.

`acc-10-responder`, `acc-11-curso`, `acc-12-tiempo`, `acc-14-abiertos`, `acc-14-eleccion`, `dua-1-1-parv`, `dua-2-2-parv`, `dua-2-4`, `dua-5-4`, `dua-8-2`, `dua-9-3-reflexion-cierre`, `sup-proyecto`.

## Cómo se aplica
Claude cambia `data/recomendaciones.json` en una rama y corre el validador y las 21 pruebas. Los ids no cambian, así que las selecciones guardadas y las pruebas que usan `dua-6-2` siguen funcionando. El dueño aprueba antes de integrar.
