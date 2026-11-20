# Tarea 048 · «¿Qué usa hoy para comunicarse o acceder?» sugiere sus apoyos

Estado: **integrada** (PR #72) · Asignada a: Codex · Rama: `codex/048-modalidad` · Pull request con destino `main`

## Para qué
Hoy la pregunta de modalidad casi no cambia las sugerencias. Si marcas «Braille», no sube la ficha de Braille. Esta tarea hace que **la modalidad muestre y ponga primero los apoyos de acceso o los ajustes de trabajo que le corresponden**, en «Para un estudiante» y en el nivel «Práctica y trabajo», etapa «Primer empleo o trabajo».

**Lo que corrigió la revisión adversarial de la v1:**
- No se puede guardar la descripción sin al menos una situación, y esa regla se mantiene.
- `acc-6-braille` sigue excluida con ampliación.
- Las adecuaciones en los objetivos y los apoyos de práctica quedan fuera: tienen sus propias reglas.
- Se corrigieron fichas mal asignadas.
- En «otra lengua materna» solo entran apoyos que no suponen que la persona no entiende español.

**Después de la tarea 051:** «Para el trabajo» ahora es el nivel «Práctica y trabajo». Esta tarea aplica solo a los casos con `etapa === "trabajo"`. En los casos con etapa `practica` no cambia nada. `compararAcceso(a, b, e)` y `aplica(r, e)` ya reciben el caso: usa ese `e`, no `estudianteActual()` ni `trabajadorActual()` por defecto.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios

### 1. Tabla `APOYOS_MODALIDAD` en `app.js`
Va junto a `EXCLUSIONES_MODALIDAD`. Solo fichas de acceso (`acceso`) y de trabajo (`trabajo`).

| Modalidad | Fichas |
|---|---|
| `senas` (lengua de señas) | `acc-6-audicion`, `sup-senas`, `sup-audicion`, `tr-lengua-senas`, `tr-interprete` |
| `braille` | `acc-6-braille`, `sup-vision`, `sup-tecnologia`, `tr-lector-braille`, `tr-formularios-voz`, `tr-texto-digital` |
| `ampliacion` (lupa o ampliación) | `acc-6-ampliar`, `sup-vision`, `tr-lector-braille`, `tr-texto-digital` |
| `caa` (tablero o comunicación aumentativa) | `acc-3-caa`, `sup-caa`, `tr-teclear`, `tr-respuesta-escrita` |
| `lengua` (otra lengua materna) | `acc-10-responder`, `sup-lengua` |

`EXCLUSIONES_MODALIDAD` y `textoModalidad` siguen como están.

### 2. Cómo se aplica (cambio pequeño)
- Agrega una función `enModalidad(r, e)`, que dice si la ficha está en la tabla para la modalidad de la persona y es compatible.
- En el filtro de los apoyos de acceso visibles y de los ajustes de trabajo, agrega `|| enModalidad(r, e)`. Así aparecen aunque ninguna situación marcada las active, siempre que la ficha aplique al nivel.
- En `compararAcceso` y en el orden de los ajustes de trabajo, el primer desempate es `enModalidad`: estas fichas van primero, también en «Para empezar».
- No cambian las adecuaciones en los objetivos, la práctica, la desregulación ni la regla de guardar la descripción con al menos una situación.
- La modalidad se aplica al cambiarla, como hoy: ya repinta los resultados.

### 3. Textos
- Motivo en la tarjeta: «Porque usa: Braille». Si además coincide con situaciones, una sola línea: «Porque usa: Braille; y marcaste: Visión (seguido)». Corrige el caso en que hoy queda «Porque marcaste: .» sin coincidencias.
- La línea bajo «Para empezar» pasa a «Los apoyos que mejor responden a lo que describiste». En trabajo: «Los ajustes que mejor responden a lo que describiste».
- Ayuda bajo la pregunta de modalidad: «Prizma pondrá primero los apoyos para esa forma de comunicarse o acceder».

## Pruebas
En `scripts/probar_estudiante.cjs` y `scripts/probar_trabajo.cjs`:
- todos los `id` de `APOYOS_MODALIDAD` existen en el catálogo. Si uno no existe, la prueba falla;
- básica, con «Braille» y una situación ajena (por ejemplo, Atención): `acc-6-braille` aparece primero, con «Porque usa: Braille»;
- con «Lupa o ampliación», aparece `acc-6-ampliar` y **no** aparece `acc-6-braille`;
- superior, con «Otra lengua materna»: aparece `sup-lengua` y no aparece `acc-10-familia`;
- «Práctica y trabajo», etapa trabajo, con «Lengua de señas»: `tr-lengua-senas` y `tr-interprete` van primero;
- etapa práctica, con «Lengua de señas»: las fichas `pp-*` y su orden son iguales a los de hoy;
- sin modalidad, los resultados de un caso fijo son iguales a los de hoy;
- la prueba de los casos semilla (`probar_preguntas_clave.cjs`) sigue en 37 de 37.

## Criterios de aceptación
- [ ] Cada modalidad muestra y pone primero sus apoyos, con el motivo visible.
- [ ] Las exclusiones, los objetivos y la práctica se mantienen como hoy.
- [ ] Sin modalidad, nada cambia.
- [ ] Pasan `validar_catalogo.py` y todas las pruebas.
