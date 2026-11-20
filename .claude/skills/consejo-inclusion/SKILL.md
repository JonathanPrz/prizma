---
name: consejo-inclusion
description: >
  Consejo de inclusión: convoca a 10 especialistas (subagentes) con ángulos distintos para que propongan,
  se critiquen, voten y un moderador sintetice la mejor solución a una decisión de diseño, de flujo o de
  contenido de inclusión (DUA 3.0, Decreto 83, Decreto 170, Decreto 67, PIE, PACI, PAEC, protocolo DEC,
  ajustes razonables, práctica profesional e inclusión laboral). Usa la base de conocimiento de la skill
  asesor-inclusion y las fuentes de Prizma. Úsala cuando haya una decisión con varias alternativas
  razonables, cuando el dueño dude o pida contrastar ideas. Triggers: "consejo de inclusión", "que debatan",
  "debate de agentes", "10 agentes", "adversa esto con varios", "busquen la mejor solución".
---

# Consejo de inclusión (Prizma)

Un método probado en tres debates del 20-11-2026:
1. Resultados DUA por momento (tarea 067).
2. El paso «Describe tu clase» (tarea 068).
3. Los niveles y el flujo después del acceso (tarea 069).

Diez especialistas proponen, se critican y votan. Un moderador sintetiza, y el líder (Claude) verifica antes de presentar. El dueño decide.

**Conocimiento:** lee `.claude/skills/asesor-inclusion/SKILL.md` (hechos verificados, dónde buscar y reglas) antes de escribir el contexto. Las fuentes están en `docs/fuentes/`, y las decisiones, en `docs/diseno.md`, `docs/arquitectura.md` y `docs/tareas/`.

## Cuándo convocarlo
- **Sí:** cuando hay una decisión con 2 o más alternativas razonables, afecta a docentes reales, o el dueño duda o pide contrastar ideas.
- **No:** para un error claro, un detalle de una línea o una pregunta con respuesta en las fuentes. Ahí basta una revisión adversarial de un solo agente, o la skill asesor-inclusion.

## Costo
- **Modelo:** por defecto, debatientes y moderador en `sonnet` (parámetro `model` del Agent). Usa el modelo de la sesión solo si el dueño lo pide, o si el tema es normativo delicado y hay que citar fuentes con precisión.
- **Escala:** una ronda de 10 propuestas, una de críticas y un moderador cuestan unas 21 llamadas. Si el tema es acotado, usa 6 debatientes en vez de 10, y dilo al dueño.
- Los agentes corren en segundo plano y en paralelo.

## Paso 0 · Preparar el contexto (lo hace el líder)
Crea `<scratchpad>/consejo/<tema>/contexto.md` con:
- **Qué es Prizma y las reglas** que no se rompen: privacidad, sin diagnósticos, WCAG 2.2 AA, 390 px, no copiar CAST, OMS ni EEF, y el español de Chile.
- **Cómo está hoy la parte en debate:** textos exactos, orden, archivos y funciones del código (`index.html`, `app.js`).
- **Datos medidos** del catálogo (`data/recomendaciones.json`) y, si aplica, del navegador. No supongas números.
- **Lo que observó el dueño,** con sus palabras.
- **Las decisiones previas** que se respetan (enlaza las síntesis anteriores) y las **preguntas abiertas**.
- **Hechos legales verificados,** con su archivo y línea.

## Paso 1 · Elegir los 10 ángulos
Elige según el tema. **Siempre incluye a un abogado del diablo y a un analista de datos.** Banco de ángulos:
- docente de aula (básica o media) con poco tiempo;
- educadora diferencial del PIE;
- especialista en DUA 3.0;
- normativa chilena (debe citar `docs/fuentes/` con archivo y línea);
- educadora de párvulos;
- unidad de inclusión de educación superior;
- jefatura de UTP de un liceo técnico-profesional, con práctica profesional;
- coordinación PIE y codocencia, con el uso proyectado en reunión;
- inclusión laboral y recursos humanos;
- arquitectura de información;
- accesibilidad (WCAG, lector de pantalla y teclado);
- interacción en el teléfono (mide a 390 px con Playwright);
- minimalista radical;
- búsqueda por facetas o catálogos;
- analista de datos (mide con un script sobre el catálogo);
- abogado del diablo (ataca el supuesto de fondo).

## Paso 2 · Ronda 1: propuestas en paralelo
Cada agente:
- lee el contexto;
- escribe `propuesta-NN.md` (máximo 450 a 500 palabras) con:
  1. la idea en una frase;
  2. la solución en **texto plano jerárquico para todos los casos** que el líder enumere;
  3. por qué y los riesgos;
  4. los cambios en el código, en breve;
- no modifica el repositorio;
- responde con 3 líneas.

Ve informando al dueño a medida que llegan las propuestas, en 2 o 3 líneas por cada una, y señalando las coincidencias que aparezcan.

## Paso 3 · Ronda 2: críticas y votos
Reanuda a cada agente con `SendMessage`. Cada uno:
- lee las otras nueve propuestas;
- escribe `critica-NN.md` (máximo 300 palabras) con:
  - una línea por propuesta ajena (lo mejor y lo débil);
  - las 3 mejores ajenas, en orden;
  - qué cede;
  - su postura en cada desacuerdo que el líder enumere.

Al abogado del diablo, pídele que ataque también el consenso. Pide que la respuesta sea solo «Voto: 1.ª Pxx, 2.ª Pxx, 3.ª Pxx · postura: …».

**El conteo** asigna 3, 2 y 1 puntos, y nadie vota por sí mismo. Recuenta desde los mensajes o desde los archivos, y revisa la suma antes de informarla.

## Paso 4 · Moderador
Un agente nuevo, o el mismo moderador si hay varios debates seguidos, lee el contexto, las propuestas, las críticas y los votos. Escribe `sintesis.md` (máximo 750 a 900 palabras) con:
1. el consenso;
2. cada desacuerdo resuelto, con su razón y su evidencia;
3. la solución final en texto plano jerárquico, con los textos exactos;
4. la regla en una frase para el docente;
5. máximo 3 decisiones para el dueño, con una recomendación;
6. los cambios en el código.

El moderador sintetiza: no promedia.

## Paso 5 · Verificar antes de presentar (lo hace el líder)
- **Comprueba en las fuentes toda afirmación legal o pedagógica nueva.** En el tercer debate, el agente de normativa dijo que el Decreto 67 no remitía al Decreto 83 y que el PACI no estaba definido, y las dos cosas eran falsas. Corrige y dilo.
- **Comprueba en el código las afirmaciones sobre comportamiento,** por ejemplo qué hace hoy una función.
- **Si los agentes se cortan por el límite de uso,** lee sus archivos: suelen alcanzar a escribirlos. Si falta alguno, reanuda el agente.

## Paso 6 · Presentar al dueño
En español de Chile, breve:
- **qué se descartó y por qué;**
- **la tabla de votos;**
- **la solución en texto plano jerárquico,** con ejemplos reales del catálogo;
- **las decisiones,** con su recomendación.

Si el dueño duda, ofrece mostrarla en el lienzo de diseño. Si pide otro debate sobre un tema vecino, reutiliza a los mismos agentes, porque ya tienen el contexto.

## Paso 7 · Después de la aprobación
Escribe la tarea en `docs/tareas/NNN-*.md`, al estilo de las tareas anteriores:
- el para qué, citando el debate y los datos;
- las reglas exactas;
- los casos de referencia;
- las pruebas;
- los criterios de aceptación.

Si la tarea toca `data/`, autorízalo explícitamente y limítalo. Si hay tareas que tocan las mismas funciones, ordénalas. Actualiza `docs/diseno.md` cuando el debate cambie una decisión de diseño.

## Reglas
- Ningún agente modifica el repositorio. Solo escriben en el scratchpad.
- Nunca se registran diagnósticos: se describen barreras y situaciones.
- La autoridad es del dueño. Los votos orientan, pero no deciden.
- No inventes citas. Si algo no está en `docs/fuentes/`, dilo.
