---
name: consejo-inclusion
description: >
  Consejo de inclusión: un moderador propone cuántos especialistas y cuáles (inclusión, educación, diseño UX/UI,
  desarrollo web, contenido, accesibilidad) según el tema; el dueño decide; luego proponen, se critican, votan y
  el moderador sintetiza la mejor solución a una decisión de diseño, de flujo o de contenido de inclusión
  (DUA 3.0, Decreto 83, Decreto 170, Decreto 67, PIE, PACI, PAEC, protocolo DEC, ajustes razonables, práctica
  profesional e inclusión laboral). Lo puede correr Claude (subagentes) o Codex (subagentes o turnos). Usa la base
  de conocimiento de la skill asesor-inclusion y las fuentes de Prizma. Triggers: "consejo de inclusión",
  "que debatan", "debate de agentes", "adversa esto con varios", "busquen la mejor solución".
---

# Consejo de inclusión (Prizma)

El método se probó en cuatro debates del 20 y 21-11-2026 (tareas 067, 068, 069 y 070). Funciona así:
1. Un moderador lee el tema y **propone cuántos especialistas y cuáles**.
2. **El dueño decide.**
3. Los especialistas proponen, se critican y votan.
4. El moderador sintetiza.
5. El líder verifica antes de presentar.

**Conocimiento:** antes de escribir el contexto, lee `.claude/skills/asesor-inclusion/SKILL.md`, que tiene los hechos verificados, dónde buscar y las reglas. Las fuentes están en `docs/fuentes/`. Las decisiones están en `docs/diseno.md`, `docs/arquitectura.md` y `docs/tareas/`.

## Cuándo convocarlo
- **Sí:** cuando hay una decisión con 2 o más alternativas razonables, cuando afecta a docentes reales, o cuando el dueño duda o pide contrastar ideas.
- **No:** para un error claro, un detalle de una línea o una pregunta que ya tiene respuesta en las fuentes. Ahí basta una revisión adversarial de un solo agente, o la skill asesor-inclusion.

## Quién lo corre
- **Claude:**
  - usa subagentes con el parámetro `model` en `sonnet`; usa el modelo de la sesión solo si el dueño lo pide o si el tema es normativo delicado;
  - los agentes corren en segundo plano y en paralelo;
  - los archivos van en `<scratchpad>/consejo/<tema>/`.
- **Codex:**
  - usa el modelo más económico que tenga para los subagentes;
  - si no puede abrir subagentes, hace cada rol por turnos, sin leer las propuestas ajenas antes de escribir la suya;
  - los archivos van en `docs/consejos/<NNN-tema>/`, en una rama `codex/consejo-<tema>`, con un pull request que el dueño decide si integra.

## Paso 0 · Preparar el contexto (lo hace el líder)
Escribe `contexto.md` con:
- **Qué es Prizma y las reglas que no se rompen:** privacidad, sin diagnósticos, WCAG 2.2 AA, 390 px, no copiar CAST, OMS ni EEF, y español de Chile.
- **Cómo está hoy la parte en debate:** textos exactos, orden, archivos y funciones del código (`index.html`, `app.js`).
- **Datos medidos** del catálogo (`data/recomendaciones.json`) y, si aplica, del navegador. No supongas números.
- **Lo que observó el dueño,** con sus palabras.
- **Las decisiones previas** que se respetan, con enlace a las síntesis anteriores, y las **preguntas abiertas**.
- **Hechos legales verificados,** con su archivo y línea.

## Paso 1 · El moderador propone el consejo, y el dueño decide
El moderador lee el contexto y escribe `composicion.md` (máximo 250 palabras) con:
- **El tamaño que recomienda, con su razón:**
  - **3 a 4** para una duda acotada, como un texto o un campo;
  - **5 a 6** para una pantalla o un flujo;
  - **8 a 10** para algo que cruza varias partes o mezcla pedagogía, norma y diseño;
  - **más de 10** solo si el dueño lo pide.
- **Los perfiles elegidos del banco, con una línea por cada uno** que diga qué aporta a este tema. Siempre incluye un **abogado del diablo**. Si el tema toca datos del catálogo o medidas, incluye también un **analista de datos**.
- **Los perfiles que deja fuera** y por qué, en una línea.
- **El costo aproximado:** cerca de 2 llamadas por especialista, más 1 del moderador.

**Se detiene y espera.** El dueño acepta, cambia el tamaño o cambia perfiles. No se lanza nada sin su respuesta.

### Banco de perfiles
**Educación e inclusión**
- docente de aula (básica o media) con poco tiempo;
- educadora diferencial del PIE;
- educadora de párvulos;
- especialista en DUA 3.0;
- normativa chilena (debe citar `docs/fuentes/` con archivo y línea);
- coordinación PIE y codocencia (uso proyectado en reunión);
- jefatura de UTP de un liceo técnico-profesional (práctica profesional);
- unidad de inclusión de educación superior;
- inclusión laboral y recursos humanos;
- comunicación con familias y lectura fácil.

**Producto y web**
- diseño de experiencia (UX): flujos, tareas y carga cognitiva;
- diseño de interfaz (UI): jerarquía visual, espaciado, tipografía y color, dentro de los tokens de `styles.css`;
- redacción de interfaz (UX writing): etiquetas, ayudas, errores y microcopy en español de Chile;
- desarrollo web frontend: viabilidad en JavaScript sin framework, costo de mantener, rendimiento y pruebas;
- arquitectura de información: dónde vive cada cosa, nombres y duplicaciones;
- accesibilidad: WCAG, lector de pantalla y teclado;
- interacción en el teléfono (mide a 390 px con Playwright);
- privacidad y seguridad web: datos en `localStorage`, archivos y documentos que salen;
- investigación con usuarios: qué probar con docentes reales y cómo saber si funcionó;
- búsqueda por facetas o catálogos;
- minimalista radical.

**Siempre disponibles**
- analista de datos (mide con un script sobre el catálogo);
- abogado del diablo (ataca el supuesto de fondo y, en la ronda 2, también el consenso);
- secretario de actas (ver «Paso 8»): no propone ni vota; registra lo que se decidió.

## Paso 2 · Ronda 1: propuestas
Cada especialista:
- lee el contexto;
- escribe `propuesta-NN.md`, de 400 a 500 palabras como máximo, con:
  1. la idea en una frase;
  2. la solución en **texto plano jerárquico para todos los casos** que el líder enumere, con los textos exactos;
  3. por qué y los riesgos;
  4. los cambios en el código, en breve.
- No modifica el código. Solo escribe en la carpeta del consejo.

Claude va informando al dueño a medida que llegan las propuestas, con 2 o 3 líneas por cada una y las coincidencias que aparezcan.

## Paso 3 · Ronda 2: críticas y votos
Cada especialista lee las propuestas ajenas y escribe `critica-NN.md` (máximo 300 palabras) con:
- una línea por cada propuesta ajena, con lo mejor y lo débil;
- su voto, sin votar por sí mismo:
  - con 6 especialistas o más, las 3 mejores, con 3, 2 y 1 punto;
  - con 5 o menos, las 2 mejores, con 2 y 1 punto;
- lo que cede;
- su postura en cada desacuerdo que el líder enumere.

**Antes de informar, recuenta y revisa la suma:** debe dar N × 6 con 3 votos, o N × 3 con 2 votos.

## Paso 4 · Síntesis
El moderador lee todo y escribe `sintesis.md` (de 700 a 900 palabras como máximo) con:
1. el consenso;
2. cada desacuerdo resuelto, con su razón y su evidencia;
3. la solución final en texto plano jerárquico, con los textos exactos;
4. la regla para la docente, en una frase;
5. un máximo de 3 decisiones para el dueño, cada una con su recomendación;
6. los cambios en el código;
7. la tabla de votos.

El moderador sintetiza: no promedia.

## Paso 5 · Verificar antes de presentar (lo hace el líder)
- **Comprueba en las fuentes toda afirmación legal o pedagógica nueva.** En el tercer debate, el agente de normativa afirmó que el Decreto 67 no remitía al 83 y que el PACI no estaba definido. Las dos cosas eran falsas. Si encuentras un error, corrígelo y dilo.
- **Comprueba en el código lo que se afirme sobre cómo funciona Prizma hoy.**
- **Si el consejo lo corrió Codex,** revisa el pull request: que solo toque `docs/consejos/`, que los votos sumen bien y que las citas existan.
- **Si los agentes se cortan por el límite de uso,** lee sus archivos, que suelen quedar escritos. Si falta alguno, reanuda el agente.

## Paso 6 · Presentar al dueño
En español de Chile, breve:
- qué se descartó y por qué;
- la tabla de votos;
- la solución en texto plano jerárquico, con ejemplos reales;
- las decisiones, con su recomendación.

Si el dueño pide otro debate sobre un tema vecino, reutiliza a los mismos agentes, porque ya tienen el contexto.

## Paso 7 · Después de la aprobación
Escribe la tarea en `docs/tareas/NNN-*.md`, al estilo de las anteriores:
- el para qué, citando el debate y los datos;
- las reglas exactas;
- los casos de referencia;
- las pruebas;
- los criterios de aceptación.

Si la tarea toca `data/`, autorízalo de forma explícita y limítalo. Actualiza `docs/diseno.md` cuando el debate cambie una decisión de diseño.

## Paso 8 · Secretario de actas (después de integrar la tarea)
Un agente con el modelo económico actualiza la bitácora de decisiones, `docs/bitacora.md`. No participa en el debate ni vota.

**La bitácora muestra solo cómo están las cosas hoy, no el proceso.** El proceso ya queda guardado en git: tareas, pull requests y commits. Si algo se borra, se recupera desde el historial.

**Qué lee:**
- la síntesis del consejo;
- la tarea integrada y su pull request;
- el código actual (`app.js`, `styles.css`, `index.html`), para comprobar que la entrada describe lo que hay hoy;
- `git log` y `docs/tareas/`, como antecedentes.

**Temas:**
- tipografía;
- color y tema;
- documentos e impresión;
- flujo y navegación;
- textos;
- accesibilidad;
- privacidad;
- catálogo y normativa;
- marca.

**Cada entrada:**
```
### <Qué se decidió, en pocas palabras>
- Hoy: <cómo es ahora, con valores concretos>
- Por qué: <la razón final, con su evidencia>
- No volver a: <alternativas probadas y descartadas, con su razón en una línea; omítelo si no hay>
- Historial: tareas NNN y NNN · PR #N y #N
```

**Reglas:**
- **Si una decisión cambia, reescribe la entrada.** No agrega otra: actualiza «Hoy» y «Por qué», mueve lo anterior a «No volver a» si fue descartado por una razón, y suma la tarea a «Historial».
- **No describe pasos intermedios** ni versiones que nunca se integraron.
- **No inventa razones.** Si no encuentra el porqué, escribe «Razón no registrada».
- **Comprueba en el código** que «Hoy» es cierto.
- **Escribe en español de Chile,** con frases cortas.
- **Solo escribe en `docs/bitacora.md`.** El líder lo revisa y lo sube a `main`.

**La primera vez,** la reconstruye a partir de `docs/tareas/`, `docs/diseno.md`, el código actual y el historial de commits.

## Reglas
- Los especialistas no cambian código, `data/`, `docs/fuentes/` ni `.claude/`. Escriben solo en la carpeta del consejo.
- Nunca se registran diagnósticos: se describen barreras y situaciones.
- El dueño tiene la autoridad, y decide primero el tamaño y los perfiles. Los votos orientan, pero no deciden.
- No inventes citas. Si algo no está en `docs/fuentes/`, dilo.
