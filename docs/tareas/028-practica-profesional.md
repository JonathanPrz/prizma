# Tarea 028 · Práctica profesional: sección por estudiante, guía y documento para el centro

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/028-practica-profesional`

## Para qué
El dueño quiere apoyar a los estudiantes también en su práctica profesional: «la discapacidad no termina al estudiar». La investigación de la tarea 027 está en `docs/fuentes/codex/practica-laboral/README.md`.

Claude agregó al catálogo 23 fichas con `tipo: "practica-profesional"`, en tres subtipos:
- `institucion`: lo que hace el liceo o la institución;
- `centro`: lo que puede hacer el centro de práctica;
- `estudiante`: preparar al estudiante para pedir ajustes.

Algunas son solo para media o solo para superior. Las de `centro` con `dimensiones` responden a situaciones del estudiante; las que no tienen `dimensiones` sirven siempre.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Principio que no se rompe
**El estudiante decide qué se comparte con el centro.** La investigación lo deja claro: pedir un ajuste no autoriza entregar diagnósticos, el expediente ni el PACI (Ley 19.628 y Ley 21.719). El documento para el centro nunca incluye situaciones, tabla CIF, voz, notas ni iniciales.

## Cambios
1. **Casilla por estudiante:**
   - En los filtros de apoyos, después de las situaciones, va la casilla «Este estudiante hará su práctica profesional». Se muestra solo en media y superior.
   - Se guarda en cada estudiante como `practicaProfesional` (booleano validado) y va en el respaldo.
2. **Bloque «Práctica profesional»** en los resultados, después de desregulación. Aparece solo si la casilla está marcada. Tiene tres grupos con `h3`:
   - «Lo que hace el liceo» (en superior: «Lo que hace la institución»), con las fichas `institucion` del nivel;
   - «Lo que puede hacer el centro de práctica», con las fichas `centro`: las que no tienen `dimensiones` y las que coinciden con alguna situación del estudiante, ordenadas con `compararAcceso`;
   - «Preparar al estudiante para pedir ajustes», con las fichas `estudiante`.

   Las fichas se eligen como cualquier apoyo y quedan en la selección del estudiante activo. En `tipoOficial`, el rótulo es «Práctica profesional: <nombre del grupo>».

   Al inicio del bloque va el enlace «¿Quién hace qué en la práctica?», que abre la guía del punto 3.
3. **Guía `#guia-practica`**, con el mismo formato que las otras guías y botón «Entendido». Usa exactamente este texto.

   **Título: ¿Quién hace qué en la práctica?**

   **En la media técnico-profesional**
   1. El liceo, el estudiante y el centro acuerdan por escrito el plan de práctica: tareas, jornada y ajustes (Decreto 2.516, art. 2).
   2. El profesor tutor supervisa, visita el centro y registra el avance (art. 7).
   3. El representante del centro evalúa las tareas y firma el informe con el tutor (art. 6).
   4. Si hacen falta condiciones excepcionales, el liceo las solicita a la SEREMI (arts. 4 y 13).

   **En la educación superior**
   1. La institución mantiene su deber de hacer ajustes también durante la práctica (Ley 20.422, art. 39; Ley 21.091, art. 2 e).
   2. La institución acuerda con el centro quién implementa cada ajuste, y lo deja por escrito.

   **En ambos casos**
   - El estudiante decide qué información se comparte. Pedir un ajuste no autoriza entregar el diagnóstico ni el expediente (Ley 19.628; Ley 21.719 desde el 1 de diciembre de 2026).
   - El centro proporciona colación y movilización, o una compensación acordada (Código del Trabajo, art. 8).

   Nota: «Orientación basada en la normativa citada. No es asesoría legal.»

   En media muestra solo las secciones «media» y «ambos». En superior, «superior» y «ambos».
4. **Mi mochila y PDF principal:** la sección de cada estudiante agrega el subgrupo «Práctica profesional», con sus fichas elegidas ordenadas por grupo.
5. **Documento «Para el centro de práctica»:**
   - Dentro del bloque, el botón «Preparar documento para el centro» abre un diálogo con:
     - una casilla por cada ficha `centro` elegida para el estudiante, todas marcadas por defecto;
     - una casilla obligatoria: «El estudiante revisó este documento y decidió compartirlo». Sin ella, «Ver documento» queda desactivado y la ayuda explica por qué.
   - El documento (vista previa y PDF, con el mismo estilo profesional de la tarea 023) tiene:
     - título «Ajustes acordados para la práctica»;
     - campos en blanco para completar a mano: Estudiante, Centro de práctica, Profesor tutor o coordinador, Fecha;
     - las fichas marcadas, con título, pasos y «Por qué funciona». Sin «Mi nota»;
     - el bloque «Acuerdos (para completar en la reunión)»;
     - el pie «Documento preparado con el estudiante. Contiene solo lo que decidió compartir.»
   - **No incluye** iniciales, situaciones, tabla CIF, voz, notas ni datos de otros estudiantes.
   - Nombre del archivo: `prizma-practica-AAAA-MM-DD.pdf`.
   - Si el estudiante no tiene fichas `centro` elegidas, el botón explica: «Primero elige los ajustes que puede hacer el centro».

## Criterios de aceptación
- [ ] La casilla aparece solo en media y superior, por estudiante, y se guarda y respalda.
- [ ] Con la casilla marcada se ven los tres grupos. En superior el primer grupo dice «institución» y no aparecen las fichas solo de media (`pp-plan`, `pp-visita`, `pp-seguridad`, `pp-horas`).
- [ ] Una ficha `centro` con situaciones aparece solo si el estudiante tiene alguna de ellas; las que no tienen situaciones aparecen siempre.
- [ ] La guía muestra el texto exacto, según el nivel.
- [ ] El documento para el centro no se puede generar sin la casilla de decisión del estudiante.
- [ ] Una prueba comprueba que su contenido no incluye las iniciales, los nombres de las situaciones, la voz ni las notas.
- [ ] El PDF principal incluye la práctica en la sección del estudiante.
- [ ] Teclado, foco y sin desplazamiento horizontal a 390 px.
- [ ] Capturas y un PDF de ejemplo del documento para el centro en `docs/marca/028-practica/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. Agrega `scripts/probar_practica_profesional.cjs`.
