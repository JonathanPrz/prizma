# Tarea 070 · Acciones de «Antes» sin contexto, mochila agrupada y documento en dos versiones

Estado: **integrada** (PR #91) · Asignada a: Codex · Rama: `codex/070-antes-mochila-documento` · Pull request con destino `main`

## Para qué
Lo decidió un cuarto consejo de inclusión de 10 especialistas, con críticas cruzadas, votación y moderador (21-11-2026), y el dueño lo aprobó. Datos medidos:
- **4 fichas DUA de «Antes» no responden nunca a lo marcado en el paso 1,** porque tienen `contextos: []`. Siempre quedan escondidas en «Ver las otras N»:
  - `dua-8-1-meta-visible`;
  - `dua-8-1-parv`;
  - `dua-6-1`;
  - `dua-9-1`.
- **En 14 de 35 combinaciones típicas del paso 1, ninguna ficha de «Antes» responde.** Si las 4 fichas fueran «base», «Antes» se saturaría en 21 de 35. Si solo lo es la ficha 8.1, «Antes» nunca queda en 0.
- **`dua-9-1` repite el paso de `dua-6-1`:** «Pide a cada uno una meta pequeña para hoy».
- **`dua-6-1` no pertenece a ninguna necesidad.** La consideración 6.1 no está en ningún `consideraciones` de `data/necesidades.json`.
- **A 390 px, la mochila mide 2.062 px** con 6 elegidas: 6 textareas abiertos, y los botones de respaldo y borrar al fondo. Además duplica la lista del paso 3 de DUA.
- **El documento** (4 acciones y 1 estudiante) ocupa 5 páginas de PDF, con 826 palabras. No hay una versión breve para usar en la sala.

**Solo en esta tarea puedes cambiar `data/recomendaciones.json` y `data/necesidades.json`, y solo como dice la sección 1.** No cambies `docs/fuentes/` ni `.claude/`.

## 1. Datos
En `data/recomendaciones.json`:
- `dua-8-1-meta-visible` y `dua-8-1-parv`: agrega `"base": true`. Dejan `contextos: []`.
- `dua-6-1`: `contextos: ["hablando", "haciendo"]`.
- `dua-9-1`: `contextos: ["experimentar", "crear"]`. Quita de `como` el paso «Pide a cada uno una meta pequeña para hoy.».

En `data/necesidades.json`, agrega `"6.1"` a `consideraciones` de `motivacion`.

En `scripts/validar_catalogo.py`:
- acepta `base` como booleano opcional, solo en fichas DUA de momento `antes`;
- marca como error una ficha DUA que tenga `contextos: []` y no tenga `base: true`;
- marca como error un nivel que tenga más de una ficha `base`.

## 2. Ficha base en el paso 2
- `respondeAlContexto(r)` devuelve `true` para una ficha `base` **si hay algo marcado** en el paso 1 (`hayContextoDua()`). Cuenta en «N de 36 responden» y en el título de la carpeta («Antes (11 · 2 responden)»).
- **La ficha base siempre se muestra abierta.** Va después de las que coinciden. Si 3 o más coinciden, ocupa el tercer lugar, y la tercera que coincide pasa a «Ver las otras».
- **Sin nada marcado,** todo sigue como hoy.
- **Si `estado.perfil.meta` tiene texto,** la tarjeta base muestra bajo el título la línea «Ya escribiste tu meta en el paso 3. Dila en voz alta al comenzar.»

## 3. La mochila
```
Mi mochila (N)                                   [Cerrar]
Para todo el curso
  Antes                                          (h4 por momento, en el orden de MOMENTOS)
    Título de la acción                          [Quitar]
    Nota: <texto>  · Editar en el paso 3         (solo si hay nota; solo lectura)
  Durante …
JP                                               (como hoy: iniciales, subtítulo y h4 por tipo)
    Título del apoyo                             [Quitar]
    ▸ Agregar nota                               (details con el textarea de hoy; si ya hay nota,
                                                  el summary dice «Nota» y viene abierto)
[Ver documento]
▸ Datos y respaldo                               (details, cerrado)
    [Guardar respaldo] [Abrir respaldo] + su ayuda
    Tus datos se guardan solo en este navegador. No hay cuentas ni servidor.
    [Borrar los datos de Educación]
```
- **Las acciones del curso ya no tienen textarea en la mochila.** La nota se edita en el paso 3 (`#dua-seleccion`), que no cambia. «Editar en el paso 3» cierra la mochila y lleva el foco al textarea de esa acción en el paso 3.
- **Los apoyos de estudiantes y los ajustes de Práctica y trabajo** conservan su textarea dentro de «Agregar nota», porque la mochila es el único lugar donde se escriben.
- **Cada [Quitar] conserva su `aria-label` único,** como hoy.
- **Si un mensaje de respaldo se muestra** (error o éxito), «Datos y respaldo» se abre.
- **El borrado** mantiene su confirmación actual.

## 4. El documento
El diálogo `#incluir-documento` empieza con un fieldset «¿Qué documento necesitas?»:
- ◉ **Guion de clase (1 página)** · ayuda: «La meta y los pasos de cada acción, por momento. Para imprimir y usar en la sala.»
- ○ **Plan completo** · ayuda: «Incluye estudiantes, acuerdos y fuentes. Para la reunión con PIE y familia, y para archivar.»

**Qué opción viene marcada:**
- el guion, si no hay estudiantes con datos;
- el plan completo, si los hay;
- si no hay acciones del curso, el guion se desactiva y dice «Elige acciones para todo el curso para armar el guion.».

**Las casillas de contenido** («Acciones para todo el curso», «Apoyos para JP»…) solo se ven con «Plan completo». La elección se recuerda en `estado` mientras dure la sesión, sin migración.

**Guion de clase** (vista `#hoja` y PDF):
- logo, «Guion de clase», la fecha y el nivel;
- «Meta: <meta>», solo si existe;
- por momento, un h2 (Antes, Durante, Después, En toda la clase) y, por cada acción elegida, su título en negrita y sus pasos como lista con «☐» delante de cada uno;
- «Mi nota: …», si existe;
- sin dato DUA, «Por qué funciona», fuentes, resumen ni estudiantes;
- pie: «Guion para la sala. No incluye datos de estudiantes.»;
- con 8 acciones de básica, el PDF ocupa **1 página A4**. Si no cabe, reduce márgenes y espaciado; no achiques la letra a menos de 10 pt.

**Plan completo** (el documento de hoy, con cambios):
- **Se omiten las filas que hoy dicen «Sin información»,** en el resumen y en «Facilitadores y voz». Los campos de los acuerdos mantienen sus líneas para completar a mano.
- **El dato de cada ficha queda en una línea corta:** «DUA 3.0 · 7.1 · <principio>» en las acciones del curso, y el tipo oficial más «DUA 3.0 · X.Y», si lo hay, en los apoyos. Se quita el texto largo de la consideración y del respaldo; las fuentes siguen al final.
- **Antes de «Fuentes»,** un aviso en negrita: «Contiene iniciales y situaciones, no diagnósticos. Guárdalo y compártelo solo con quienes participan en los apoyos.»

**Las mismas reglas valen para la vista `#hoja` y el PDF** (`armarHoja()` y `definicionPdf()` deben mostrar lo mismo). El documento de Práctica y trabajo y el de centro de práctica no cambian.

## Pruebas
Agrega `scripts/probar_mochila_documento.cjs`:
- `python3 scripts/validar_catalogo.py` pasa. Una copia del catálogo con una ficha DUA sin contextos y sin `base` hace fallar el validador; prueba la función, sin tocar `data/`.
- **Básica, solo «Experimentar o manipular» marcado:**
  - «Antes» tiene al menos 1 ficha que responde: «Anticipa lo que puede costar…» y «Comparte la meta…»;
  - «Comparte la meta…» está abierta.
- **Con «Conversar o debatir» y «Escuchar o leer»** (más de 3 coinciden en «Antes»), «Comparte la meta…» es la tercera tarjeta abierta.
- **Sin nada marcado,** la ficha base no cuenta como «responde».
- **Con meta escrita,** la tarjeta base muestra «Ya escribiste tu meta en el paso 3…».
- **Parvularia con algo marcado:** «Cuenta al inicio qué harán…» está abierta.
- **Mochila a 390 px** con 4 acciones del curso y 2 apoyos de un estudiante, en básica:
  - no hay textarea visible del curso;
  - las acciones están bajo h4 por momento;
  - «Datos y respaldo» está cerrado;
  - informa la altura en el pull request (hoy mide 2.062 px).
- **«Editar en el paso 3»** deja el foco en el textarea correcto de `#dua-seleccion`. Una nota escrita ahí aparece en la mochila.
- **La nota de un apoyo de estudiante** se edita dentro de «Agregar nota», se guarda y, al recargar, ese `details` viene abierto con «Nota».
- **Guion de clase** con 8 acciones de básica:
  - el PDF tiene 1 página. Para contarlas, genera el buffer con `pdfMake.createPdf(def).getBuffer` y cuenta las apariciones de `/Type /Page` que no sean `/Pages`;
  - la vista `#hoja` no contiene «Fuentes», «DUA 3.0» ni las iniciales de un caso existente;
  - tiene «☐».
- **Plan completo** con un estudiante:
  - sin meta y sin «Le ayuda», no aparece «Sin información»;
  - aparece el aviso de privacidad;
  - el dato DUA de una acción dice «DUA 3.0 · » seguido del número.
- **Sin desplazamiento horizontal** a 390 px, con la mochila abierta y con la vista del documento.

Reescribe, sin debilitarlas, las pruebas existentes que busquen textareas del curso en la mochila, «Sin información» o el texto largo del dato. Corre el validador y todas las pruebas `scripts/probar_*.cjs`.

En el pull request, agrega capturas de la mochila a 390 px, antes y después, y del guion de clase en PDF.

## Criterios de aceptación
- [ ] Las 4 fichas de «Antes» ya no quedan siempre escondidas. La ficha base aparece abierta cuando hay algo marcado, y «Antes» nunca queda en 0.
- [ ] El validador impide fichas DUA sin contexto que no sean base.
- [ ] La mochila agrupa por momento, sin textareas del curso, con «Agregar nota» en los casos y «Datos y respaldo» plegado.
- [ ] El documento ofrece «Guion de clase» de 1 página y «Plan completo» sin «Sin información», con dato corto y aviso de privacidad.
- [ ] La vista y el PDF dicen lo mismo.
- [ ] Pasan el validador y todas las pruebas.
