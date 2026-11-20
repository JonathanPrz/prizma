# Tarea 051 · «Práctica y paso al trabajo» como nivel, sin modo Trabajo aparte

Estado: **v1, pendiente de revisión adversarial y aprobación del dueño** · Asignada a: Codex · Rama: `codex/051-practica-trabajo` · Pull request con destino `main`

## Para qué
Decisión del dueño (20-11-2026): Prizma tiene demasiados modos. El modo «Para el trabajo» se integra como un **nivel más**, con la práctica profesional:

> Nivel: Parvularia · Básica · Media · Superior · **Práctica y paso al trabajo**

Así desaparece la pantalla «¿Dónde quieres apoyar?» y la práctica deja de estar escondida en una casilla. Los ajustes laborales encajan en el grupo del centro de práctica o del empleador.

Esto cambia la arquitectura aprobada el 16-11-2026 (`docs/arquitectura.md`, decisiones 1 y 3). Actualiza ese documento con una sección «Ajuste del dueño (20-11-2026)».

**No cambies `data/recomendaciones.json` ni `docs/fuentes/`**, salvo lo que diga esta tarea.

## Cómo queda

### 1. Entrada y nivel
- Se elimina la pantalla de inicio de ámbito y el botón «Cambiar ámbito». Al entrar, se ve directamente Prizma con el selector de nivel.
- El selector suma la opción **«Práctica y paso al trabajo»** (valor `practica-trabajo`), con la ayuda: «Para preparar la práctica profesional y el ingreso a un empleo, con el liceo o la institución, el centro o el empleador y la persona».
- Con ese nivel, la pestaña «Para el curso (DUA)» no aparece: solo hay casos de personas.
- Cambiar de nivel con casos guardados pide confirmación, como hoy.

### 2. Casos en «Práctica y paso al trabajo»
Usan el modelo de casos de trabajo que ya existe (`estado.trabajadores`, `trabajadorActual()`), con estos cambios:
- **Título del paso 1:** «Describe la situación de la persona». La ayuda aclara que puede ser un estudiante en práctica o una persona que entra a trabajar.
- **Pregunta nueva:** «¿En qué etapa está?», con las opciones «Prepara su práctica», «Está en práctica» y «Está entrando o ya está en un trabajo».
- **Apoyos sugeridos, en 3 grupos:**
  - *Lo que hace el liceo o la institución:* fichas `practica-profesional` con subtipo `institucion`;
  - *Lo que hace el centro o el empleador:* fichas `practica-profesional` con subtipo `centro`, más las fichas `trabajo`, agrupadas como hoy por información, comunicación, puesto, tiempo y proceso;
  - *Lo que hace la persona:* fichas `practica-profesional` con subtipo `estudiante`.
- **Según la etapa:**
  - con «Prepara su práctica» o «Está en práctica», los grupos de práctica van primero;
  - con «Está entrando o ya está en un trabajo», los ajustes de trabajo van primero y los de la institución quedan plegados.
- **Roles del acuerdo:** se suman «Liceo o institución (profesor tutor)» y «Centro de práctica». Se mantienen los de trabajo.
- Las fichas de práctica deben aplicar en este nivel: agrega `practica-trabajo` a la lista de niveles válidos en el validador y en `aplica()`. Las fichas no se editan.

### 3. Lo que sale de media y superior
- La casilla «Este estudiante hará su práctica profesional» se quita de media y superior.
- En su lugar, en media y superior va una línea con enlace: «¿Hará su práctica o va a entrar a trabajar? Usa el nivel Práctica y paso al trabajo».

### 4. Documentos, mochila, privacidad y guías
- **Documentos:**
  - el documento de trabajo, con sus secciones elegibles (tarea 046);
  - el documento para el centro de práctica, en el que el estudiante decide qué compartir.

  Los dos van en este nivel.
- **Mochila y «Borrar los datos»:** «Borrar los datos de Trabajo» pasa a «Borrar los datos de práctica y trabajo». El respaldo sigue siendo uno solo.
- **Aviso de privacidad:** en este nivel se usa el aviso de trabajo (Código del Trabajo, art. 154 ter: reserva de datos) y se le suma la frase «En la práctica, el estudiante decide qué contar al centro».
- **Guías:** la guía de este nivel une «Apoyos para la práctica» y «¿Qué son los ajustes en el trabajo y qué exige la ley?», sin repetir contenido.

### 5. Datos guardados (migración)
- Si `estado.ambito === "trabajo"`, el nivel pasa a `practica-trabajo`. Los casos de trabajo se conservan.
- Si un caso de estudiante tenía `practicaProfesional: true`, se conserva su selección de apoyos de práctica. La primera vez se muestra el aviso: «La práctica profesional ahora está en el nivel Práctica y paso al trabajo. Tus apoyos elegidos siguen guardados».
- El respaldo antiguo se puede restaurar sin errores.

### 6. Textos y documentos del proyecto
Actualiza `AGENTS.md` («Qué es Prizma»), el subtítulo, el pie de página y `docs/arquitectura.md`. Ya no hay «tres partes» en dos ámbitos: hay un selector de nivel con cinco opciones.

## Pruebas
- Actualiza las pruebas que usan la pantalla de inicio, `elegir-educacion` y `elegir-trabajo`.
- Prueba nueva, `scripts/probar_practica_trabajo.cjs`:
  - el nivel nuevo muestra los 3 grupos y no la pestaña DUA;
  - la etapa cambia el orden;
  - el documento de trabajo y el del centro funcionan;
  - migración: un estado antiguo con `ambito: "trabajo"` y otro con `practicaProfesional: true` cargan sin perder datos;
  - no hay desplazamiento horizontal a 390 px.
- `validar_catalogo.py` y todas las pruebas pasan. La regla de «4 ajustes por situación» de trabajo se mantiene.

## Criterios de aceptación
- [ ] No hay pantalla de ámbito. El nivel «Práctica y paso al trabajo» reúne práctica y trabajo en 3 grupos.
- [ ] Media y superior ya no tienen la casilla de práctica, y enlazan al nivel nuevo.
- [ ] Los datos antiguos de trabajo y de práctica se conservan.
- [ ] Documentos, privacidad, guías y `AGENTS.md` actualizados.
- [ ] Pasan el validador y todas las pruebas.
