# Consejo de inclusión · Paso 3 «Acuerdos»: qué medir y qué hacer en casa

Fecha: 21-11-2026. Lo prepara Claude, para que Codex corra el consejo.

## Prizma y sus reglas
Lee `AGENTS.md` y `docs/diseno.md`. Las reglas que no se rompen:
- privacidad: sin servidor, todo queda en `localStorage`;
- nunca se registran diagnósticos, solo iniciales, barreras y situaciones;
- WCAG 2.2 AA y uso a 390 px;
- español de Chile, con tuteo y lenguaje claro;
- no copiar textos de CAST, la OMS ni la EEF;
- no agregar dependencias.

## Cómo está hoy
**«Para un estudiante», paso 3 «Acuerdos»** (`index.html`, alrededor de la línea 203; `app.js`, `erroresAcuerdo`, alrededor de la línea 301):
- «¿Con quiénes se acordó?»: casillas de roles (estudiante, familia, equipo de apoyo, PIE…);
- «Fecha del acuerdo» y «Próxima revisión»: fechas obligatorias;
- «¿Cómo sabremos que funciona?»: un cuadro de texto obligatorio, de hasta 200 caracteres, **sin ayuda ni ejemplo**;
- [Guardar acuerdos].

**«Práctica y trabajo», paso 3:** tiene los mismos campos y además «¿Qué decidió compartir la persona y con quién?».

**Dónde sale lo que se escribe:**
- **Plan completo:** el bloque «Acuerdos (para completar en la reunión)», con líneas en blanco si falta un dato.
- **Resumen para la familia** (tareas 072 y 073; no existe en superior ni en trabajo):
  - «Lo que acordamos para la casa», con **3 líneas en blanco que hoy solo se llenan a mano**, porque no existe un campo en Prizma;
  - «Próxima conversación»;
  - «¿Cómo sabremos que funciona?».

## Lo que observó el dueño
- «Lo que acordamos para la casa, ¿dónde se llena?» No hay dónde.
- «En ¿Cómo sabremos que funciona? tampoco supe qué poner.»

## Propuesta inicial de Claude (para criticar, no es la decisión)
1. **Agregar un campo opcional** «¿Qué acordaron para la casa?» en el paso 3, solo en parvularia, básica y media.
   - Ayuda: «Lo acuerdan con la familia. Sale en el resumen para la familia.»
   - Si está escrito, reemplaza las líneas en blanco del resumen y también sale en «Acuerdos» del plan completo. Si está vacío, siguen las líneas.
2. **Dar ayuda y ejemplos** a «¿Cómo sabremos que funciona?».
   - Ayuda: «Algo que puedan ver o contar en la próxima revisión. Piensa en lo que hoy le cuesta.»
   - Placeholder: «Termina 3 de cada 4 guías con la tarea dividida en partes.»
   - Debajo, una línea con las situaciones del caso, ordenadas por frecuencia: «Le cuesta más: …».
   - En Práctica y trabajo, la ayuda se adapta y el ejemplo cambia: «Completa los turnos de la semana sin perder instrucciones.»

## Hechos verificados (no inventes otros)
- El Decreto 83 pide que el PACI incluya, entre sus mínimos, «Estrategias de seguimiento y evaluación de las medidas», «Evaluación de resultados de aprendizaje» y «Revisión y ajustes del Plan». También pide la participación de los estudiantes y sus familias, y que el plan esté a disposición de la familia (`docs/fuentes/normativa/decreto-83-2015.md`, líneas 469-497).
- El Decreto 170, art. 6, dice que los diagnósticos y expedientes son confidenciales (`docs/fuentes/normativa/decreto-170-2009.md`, líneas 283-289).

Si citas normativa, usa `docs/fuentes/` con archivo y línea. Si algo no está ahí, dilo.

## Preguntas abiertas
1. **«¿Cómo sabremos que funciona?»:**
   - ¿Ayuda, ejemplos, una lista de criterios para elegir o una plantilla («Al [fecha], [qué hace] [cuánto]»)?
   - ¿Sigue siendo obligatorio?
   - ¿El ejemplo cambia según las situaciones o los apoyos elegidos?
   - ¿Cambia el nombre de la pregunta?
2. **«Para la casa»:**
   - ¿Hace falta un campo, o bastan las líneas a mano?
   - ¿Qué riesgos tiene: cargar a la familia, o que la docente escriba sin acordar?
   - ¿Cómo se redacta?
   - ¿Va también en superior o en trabajo?
3. **¿Falta algo más en el paso 3,** por ejemplo quién es responsable de cada apoyo, que el Decreto 83 pide como mínimo? ¿O sobra algo?
