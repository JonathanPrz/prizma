# Tarea 002 · Perfil de la clase y vocabulario según el nivel

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/002-perfil-por-nivel`

## Para qué

El perfil de la clase pregunta «Tipo de clase» (teórica, laboratorio…) y «Evaluación» (escrita, oral…). Esas opciones no tienen sentido en parvularia y dicen poco en los primeros años de básica. Además, la página dice «clase», «curso» y «estudiantes», pero en parvularia se habla de «experiencia de aprendizaje», «grupo» y «niños y niñas».

Esta tarea cambia 2 preguntas por otras que sirven en todos los niveles, y adapta las palabras de la página al nivel elegido. **Todas las decisiones de contenido ya están tomadas aquí. No inventes opciones ni textos nuevos.**

## Qué hacer

### 1. Reemplazar 2 preguntas del perfil (`index.html`)

Quita el `<select id="tipo">` y el `<fieldset class="evaluacion">`. En su lugar pon 2 `<fieldset>` con casillas, con el mismo estilo que tenía «Evaluación»:

**«¿Qué harán principalmente?»** · `name="actividad"` · ayuda: «Puedes marcar varias.»

| value | Texto |
|---|---|
| `escuchar-leer` | Escuchar o leer |
| `conversar` | Conversar o debatir |
| `experimentar` | Experimentar o manipular materiales |
| `crear` | Crear o producir algo |
| `moverse` | Moverse o salir de la sala |

**«¿Cómo mostrarán lo que aprendieron?»** · `name="evidencia"` · ayuda: «Puedes marcar varias.»

| value | Texto |
|---|---|
| `escribiendo` | Escribiendo |
| `hablando` | Hablando o explicando |
| `haciendo` | Haciendo o demostrando |
| `grupo` | En grupo |
| `observacion` | Observaré mientras trabajan |

### 2. Datos (`app.js`)

- `estado.perfil` pasa a ser `{ nivel, actividad: [], evidencia: [], meta }`.
- En `cargar()`, los datos guardados con el formato anterior (`tipo`, `evaluacion`) se descartan sin error. `actividad` y `evidencia` siempre terminan siendo listas.
- En `aplica()`, el contexto pasa a ser `[...actividad, ...evidencia]`.
- Actualiza `hayDatos()`, `sincronizarPerfil()` y `escucharPerfil()`.
- En `validarRespaldo()`, valida `actividad` y `evidencia` igual que validaba `evaluacion`: solo se aceptan los valores conocidos. Un respaldo antiguo, sin estos campos, se abre igual y deja ambas listas vacías. La `version` del respaldo sigue siendo `1`.
- En el documento (vista previa y PDF), la línea de datos queda así, con los textos de las tablas y omitiendo lo que esté vacío:
  `Educación básica. Harán: Conversar o debatir, Crear o producir algo. Mostrarán lo aprendido: Hablando o explicando.`

### 3. Vocabulario según el nivel

| Clave | Básica, media o sin nivel | Parvularia |
|---|---|---|
| `clase` | clase | experiencia de aprendizaje |
| `curso` | curso | grupo |
| `estudiantes` | estudiantes | niños y niñas |

- En `index.html`, marca las palabras con `<span data-voc="clave">…</span>` en estos lugares:
  - el `h1` de la cabecera: «Acciones para que todo tu **curso** pueda aprender»,
  - el `h2` «Tu **clase**»,
  - la etiqueta «¿Qué quieres que aprendan en esta **clase**?»,
  - el `h2` «Acciones para todo el **curso**».
- En `app.js`, crea `voc(clave)` y `aplicarVocabulario()`. Llama a esta última al iniciar y cada vez que cambie el nivel.
- Usa `voc()` en los textos que arma JavaScript:
  - la pestaña «En toda la **clase**»,
  - el título del documento «Acciones para mi **clase**», en la vista previa, el PDF y `info.title`,
  - las confirmaciones de «Borrar todo» y «Abrir respaldo».
- **No cambies el texto de las acciones del catálogo.** Eso lo hace otra tarea.

## Fuera de alcance

- Cambiar `data/recomendaciones.json` o `data/fuentes.json`.
- Ocultar acciones según el nivel. Lo hará el catálogo con su campo `niveles`, que ya se filtra en `aplica()`.

## Criterios de aceptación

- [ ] Ya no aparecen «Tipo de clase» ni «Evaluación». Aparecen las 2 preguntas nuevas, con los `value` y textos exactos de las tablas.
- [ ] Al elegir «Educación parvularia», los 4 lugares de `index.html` y los textos de JavaScript usan el vocabulario de parvularia. Al cambiar a otro nivel, vuelven las palabras por defecto.
- [ ] Un navegador con datos guardados en el formato anterior abre la página sin errores y conserva la selección y las notas.
- [ ] Un respaldo antiguo, con `tipo` y `evaluacion`, se abre sin error.
- [ ] Un respaldo nuevo guarda y restaura `actividad` y `evidencia`.
- [ ] La línea de datos del documento sigue el formato del punto 2.
- [ ] Todo se usa con teclado. A 390 px no hay desplazamiento horizontal, en modo claro ni oscuro.
- [ ] `python3 scripts/validar_catalogo.py` sigue diciendo «Catálogo correcto». No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
