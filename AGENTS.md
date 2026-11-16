# Instrucciones para agentes (Codex, Claude y otros)

## Qué es Prizma

Página web estática que ofrece apoyos concretos, con fuente, para aprender y trabajar en igualdad. Se basa en DUA 3.0 y en la normativa chilena. Tiene tres partes:
- **Para el curso (DUA):** acciones para todo el curso. Niveles: parvularia, básica, media (CH y TP) y superior (universidad, IP y CFT).
- **Para un estudiante:** adecuaciones (Decreto 83) o, en superior, ajustes razonables. Incluye la práctica profesional.
- **Para el trabajo:** ajustes para empresas e instituciones que reciben trabajadores con discapacidad (Ley 20.422 y Código del Trabajo).

Nunca se registran diagnósticos: se describen barreras y tareas. Diseño completo en `docs/diseno.md`.

## Roles

- **Claude** dirige el proyecto: escribe las tareas, el contenido de inclusión y revisa los pull requests.
- **Codex y otros agentes** ejecutan tareas de código descritas en `docs/tareas/`. Haz solo lo que pide la tarea.
- **El dueño del repositorio** decide qué se integra.

## Archivos

| Ruta | Qué es | ¿Lo puedes editar? |
|---|---|---|
| `index.html`, `app.js`, `styles.css` | La página | Sí, si la tarea lo pide |
| `data/recomendaciones.json`, `data/fuentes.json` | Catálogo de acciones y fuentes | **No**, salvo que la tarea lo diga explícitamente |
| `docs/fuentes/`, `docs/diseno.md`, `docs/auditoria-plan.md` | Fuentes y decisiones | **No** |
| `.claude/skills/` | Skills de Claude | **No** |
| `vendor/pdfmake/` | Librería de terceros (MIT) | No |
| `scripts/validar_catalogo.py` | Revisión del catálogo | Solo si la tarea lo pide |

## Cómo probar

```bash
python3 -m http.server 8000
```
Abre http://localhost:8000. La página carga el catálogo con `fetch`, así que no funciona abriendo `index.html` directo.

```bash
python3 scripts/validar_catalogo.py
```
Debe terminar con "Catálogo correcto".

## Reglas que no se rompen

1. **Privacidad.** Sin servidor, sin cuentas, sin analítica y sin enviar datos a ningún lado. Los datos viven solo en `localStorage` o en archivos que la persona descarga.
2. **Sin dependencias nuevas** ni scripts desde CDN. Si algo parece necesitar una librería, detente y explícalo en el pull request.
3. **Accesibilidad WCAG 2.2 AA:**
   - todo se usa con teclado y tiene foco visible,
   - los controles tienen etiqueta,
   - el contraste es suficiente,
   - los objetivos táctiles miden al menos 24 px,
   - nada depende solo del color,
   - se respeta `prefers-reduced-motion`.
4. **Funciona en teléfono.** Sin desplazamiento horizontal a 390 px de ancho.
5. **Seguridad.** No uses `innerHTML` con datos. Crea los nodos con la función `el()` de `app.js`. Valida todo lo que venga de afuera: archivos, `localStorage`.
6. **Textos en español de Chile, con tuteo y lenguaje claro.** Frases cortas, verbos que dicen qué pasa ("Guardar respaldo", no "Enviar"). Los errores explican qué pasó y cómo seguir.
7. **No copies texto** de CAST, la OMS ni la EEF.

## Estilo de código

- JavaScript sin framework ni compilación. Envuelve `localStorage` en `try/catch`.
- Colores y tipografía solo con las variables de `:root` en `styles.css`, en modo claro y oscuro.
- Cambios pequeños: reutiliza lo que existe (`el()`, `estado`, `guardar()`, la clase `.boton`).
- Comenta solo el porqué que el código no muestra.

## Flujo de trabajo

1. Lee la tarea completa en `docs/tareas/` y este archivo.
2. Crea una rama `codex/<número>-<nombre-corto>`.
3. Haz los commits en español.
4. Antes de abrir el pull request, revisa tu propio cambio con la skill `ponytail-review` (en `.agents/skills/`) y corrige lo que encuentre. Usa `ponytail` para mantener el cambio pequeño.
5. Abre un pull request con el título de la tarea. Incluye:
   - qué cambiaste,
   - cómo lo probaste,
   - qué criterios de aceptación cumpliste,
   - **qué no hiciste o no pudiste probar**.
6. No integres a `main`. Lo revisa Claude y lo aprueba el dueño del repositorio.
