# Tarea 074 · Paso 3 «Acuerdos» con ayuda, coordinación y casa, y errores de contenido de los documentos

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/074-acuerdos-documentos` · Pull request con destino `main`

## Para qué
Un consejo de 5 especialistas (21-11-2026), con críticas cruzadas y votos, revisó el paso 3 y dos PDF reales del dueño. El dueño aprobó la síntesis.

**El caso de referencia:** «SP», de parvularia, con 5 situaciones «Casi siempre» y 17 apoyos. El nivel general es media.

**Lo que se encontró:**
- **«¿Cómo sabremos que funciona?»** no tiene ayuda. El dueño no supo qué escribir y puso «Falta un mecanismo de progreso.».
- **«Lo que acordamos para la casa»** no se puede llenar en Prizma.
- **El Decreto 83 pide,** entre los mínimos del PACI, los «Responsable(s) de su aplicación y seguimiento» y las «Estrategias de seguimiento y evaluación» (`docs/fuentes/normativa/decreto-83-2015.md`, líneas 469-497).
- **El plan completo tiene 8 páginas,** con estos problemas:
  - la página 1 queda casi vacía;
  - la página 2 solo dice «Acciones para todo el curso», sin acciones;
  - la tabla resumen dice «Nivel: Educación media (CH y TP)» con un estudiante de parvularia;
  - aparecen 3 filas «No informado»;
  - la tabla de barreras repite listas largas de apoyos en cada fila.
- **El resumen para la familia** lista los 17 apoyos.

**Esta tarea arregla el contenido.** El estilo visual va en la tarea 075, que se hace después. No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## 1. Paso 3 «Acuerdos»
### Para un estudiante (`#acuerdos-caso`)
```
¿Con quiénes se acordó?                     (igual)
Fecha del acuerdo · Próxima revisión         (igual)
¿Qué esperamos ver en la próxima revisión?   ← nuevo nombre de #criterio-acuerdo; sigue obligatorio, 200 caracteres
  Ayuda (aria-describedby): «Algo que puedan ver o contar. Por ejemplo: "Para el 15 de diciembre,
  termina 3 de 4 guías con la tarea dividida en partes."»
¿Quién coordina estos apoyos? (opcional)     ← select #coordina-acuerdo
  Opciones: «Elige una persona», más los roles de ROLES_ACUERDO sin «Estudiante» ni «Familia»
¿Qué probarán en casa? (opcional)            ← textarea #casa-acuerdo, 300 caracteres
  Ayuda: «Acuérdenlo con la familia. Una o dos ideas. Sale en el resumen para la familia.»
  Se oculta en superior.
[Guardar acuerdos]
```
- **Fecha del ejemplo:** si «Próxima revisión» tiene una fecha, la ayuda la usa en formato largo («Para el 28 de noviembre, …»). Si no tiene, dice «Para la próxima revisión, …». Se actualiza al cambiar la fecha.
- **El error** de un criterio vacío dice: «Escribe qué esperan ver en la próxima revisión (máximo 200 caracteres).»
- **Los datos:** `acuerdo.coordina` (un rol válido o `""`) y `acuerdo.casa` (texto de hasta 300 caracteres).
  - `normalizarAcuerdo` los valida y, si faltan, los deja vacíos. Los respaldos antiguos se abren sin cambios.
  - Ninguno de los dos es obligatorio ni cambia el estado del acuerdo.
  - Cambiarlos después de un acuerdo completo marca el caso «Por revisar», como los demás campos (`marcarRevision`).

### Práctica y trabajo (`#acuerdos-trabajo`)
- Solo cambian el nombre de la pregunta y la ayuda. El ejemplo dice: «Para el 15 de diciembre, completa los turnos de la semana sin perder instrucciones.»
- Aquí no se agregan «coordina» ni «casa».

### Textos que repiten la pregunta
Cambia «¿Cómo sabremos que funciona?» por «¿Qué esperamos ver en la próxima revisión?» en todas partes: documentos, historial de trabajo y resúmenes de pasos.

## 2. Plan completo (vista `#hoja` y PDF)
- **Curso sin acciones:** si se incluyó el curso pero no hay acciones DUA elegidas ni reflexión, no sale el título «Acciones para todo el curso».
- **Primera página:** el primer estudiante no empieza en página nueva cuando antes solo está la tabla resumen. Los siguientes estudiantes y «Fuentes» sí empiezan en página nueva, como hoy.
- **Nivel:** la fila «Nivel» de la tabla resumen pasa a llamarse «Nivel del curso», y solo aparece si se incluyó el curso. Cada estudiante sigue mostrando su propio nivel.
- **«No informado»:** se quitan las filas «Tiene PACI», «Tiene PAEC» y «Se aplica el protocolo DEC del establecimiento». En su lugar va una fila «Documentos», con los que estén marcados: «PACI», «PAEC» o «Protocolo DEC». Si no hay ninguno, la fila no aparece. Lo mismo para la modalidad: si no aplica, no aparece.
- **Numeración:** las fichas de cada estudiante se numeran en orden: «1. Dale una agenda visual…».
  - La columna de la tabla de barreras pasa a llamarse «Apoyos (n.º de ficha)» y muestra solo los números, por ejemplo «1, 2, 5».
  - Si ninguna ficha responde a esa situación, dice «Sin apoyo elegido».
  - En el PDF, la tabla no corta filas entre páginas (`dontBreakRows: true`).
- **Acuerdos:** agrega «Coordina: <rol>» y «Qué probarán en casa: <texto>», si están escritos. Si no, no aparecen. «¿Qué esperamos ver en la próxima revisión?» mantiene su línea en blanco si falta.

## 3. Resumen para la familia
- **«Qué haremos en el colegio»** muestra como máximo **6 apoyos**: los de mayor `puntaje(r, e)`, y en empate, en el orden de hoy.
  - Si hay más, debajo va «El plan completo tiene 17 apoyos.», con el número real.
  - La aclaración de la tarea 073 sigue arriba.
- **«Lo que acordamos para la casa»:**
  - si `acuerdo.casa` tiene texto, se muestra ese texto;
  - si no, van 2 líneas en blanco y la frase «Lo completamos juntos en la reunión.».
- **«¿Cómo sabremos que funciona?»** pasa a llamarse «Qué esperamos ver».
- **Nunca se imprime** un texto como «Sin información» o «No informado».

## Pruebas
Agrega `scripts/probar_acuerdos.cjs` y ajusta las pruebas que usen los textos anteriores, sin debilitarlas.

**Paso 3:**
- la pregunta se llama «¿Qué esperamos ver en la próxima revisión?» y su ayuda está unida con `aria-describedby`;
- con revisión el 2026-12-15, la ayuda dice «Para el 15 de diciembre»;
- con el criterio vacío, sale el error nuevo;
- `#coordina-acuerdo` no ofrece «Estudiante» ni «Familia»;
- `#casa-acuerdo` no aparece en superior;
- coordina y casa se guardan, sobreviven a recargar y a un respaldo, y un respaldo antiguo sin esos campos se abre sin errores;
- cambiarlos después de un acuerdo completo marca el caso «Por revisar».

**Plan completo** con el caso de referencia (parvularia, 5 situaciones, 17 apoyos de acceso, curso incluido sin acciones, nivel general media):
- no aparece «Acciones para todo el curso»;
- aparecen «Nivel del curso», «Documentos» si corresponde, y no aparece «No informado»;
- la tabla de barreras tiene números y no títulos;
- informa en el pull request las páginas antes (8) y después.

**Resumen para la familia** con 17 apoyos:
- 6 viñetas y la línea «El plan completo tiene 17 apoyos.»;
- con `casa` escrito, aparece el texto; sin él, aparece «Lo completamos juntos en la reunión.»;
- sigue cabiendo en 1 página.

**General:** sin desplazamiento horizontal a 390 px en el paso 3.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, adjunta el PDF del plan y del resumen del caso de referencia, como imágenes.

## Criterios de aceptación
- [ ] La pregunta del criterio tiene nombre nuevo, ayuda y ejemplo con la fecha de revisión.
- [ ] Hay «¿Quién coordina estos apoyos?» y «¿Qué probarán en casa?», opcionales, y salen en los documentos.
- [ ] El plan no tiene páginas ni títulos vacíos, ni «No informado», ni el nivel general confundido con el del estudiante.
- [ ] La tabla de barreras usa números de ficha.
- [ ] El resumen para la familia muestra como máximo 6 apoyos y avisa el total.
- [ ] Pasan el validador y todas las pruebas.
