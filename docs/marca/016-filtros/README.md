# Tarea 016 · Pestañas y filtros laterales

Rama: `codex/016-filtros-laterales`. Base: `1524a5f`. Fecha: 15 de noviembre de 2026.

Los tres pasos se reemplazan por **DUA** y **Apoyos adicionales**. En educación superior, la segunda pestaña se llama **Ajustes razonables**. El selector de nivel es único, está fuera de los paneles y afecta a ambos. La cabecera y el logo M1 permanecen intactos.

Las pestañas usan `tablist`, `tab` y `tabpanel`, con `aria-selected`, controles asociados y un único tabulador activo. Flecha izquierda/derecha activa la otra pestaña; Home/End lleva a la primera/última. Tab sale del grupo y Enter/Espacio usa el botón nativo. Se conserva la pestaña en estado y en `#dua` o `#apoyos`; Atrás/Adelante recupera panel y foco. Una URL sin fragmento recupera la pestaña guardada; un fragmento desconocido vuelve a DUA. Los identificadores de panel son distintos del hash para evitar desplazamientos automáticos al entrar.

## Filtros

En escritorio, la columna de 18 rem queda a la izquierda, sticky bajo la cabecera, con desplazamiento propio. DUA ordena necesidades, meta, momento, propósito y detalles opcionales. Los momentos son radios nativos en una lista vertical. Los resultados cambian inmediatamente. La grilla tiene dos columnas cuando caben y una si el contenedor es angosto.

Los apoyos usan la misma disposición: iniciales, áreas, frecuencias y facilitadores a la izquierda; avisos y apoyos, objetivos y desregulación a la derecha. Se conservan las reglas propias de educación superior.

Bajo 60 rem aparece **Filtros (n)**. El diálogo ocupa la pantalla, tiene desplazamiento interno y mantiene **Ver resultados** accesible fuera del área que se desplaza. Se trasladan los mismos nodos de filtros al diálogo y luego a su lugar: no hay campos duplicados ni copias de valores. Escape y Ver resultados devuelven el foco al botón. Al ampliar a escritorio con el diálogo abierto, se restauran los controles a la columna y el foco vuelve a la pestaña activa.

El contador corresponde a la pestaña activa y excluye el nivel compartido. En DUA suma necesidades, propósitos, actividades y evidencias marcadas, más una unidad por meta no vacía y otra si el momento difiere de «Antes» (valor inicial). En apoyos suma áreas marcadas, dimensiones con frecuencia distinta de «No aplica», iniciales y facilitadores no vacíos. No es un conteo de resultados. **Limpiar filtros** restablece solo los de DUA y conserva nivel, mochila, notas y datos de apoyos.

## Capturas

PNG de viewport en Chromium, con datos ficticios (iniciales CD). Anchos: 1280 y 390 px. La tabla incluye las dos pestañas y sus diálogos de teléfono en ambos temas.

| Vista | Escritorio claro | Escritorio oscuro | Teléfono claro | Teléfono oscuro |
|---|---|---|---|---|
| DUA | [Captura](dua-1280-claro.png) | [Captura](dua-1280-oscuro.png) | [Captura](dua-390-claro.png) | [Captura](dua-390-oscuro.png) |
| Filtros de DUA | En columna | En columna | [Diálogo](filtros-dua-390-claro.png) | [Diálogo](filtros-dua-390-oscuro.png) |
| Apoyos adicionales | [Captura](apoyos-1280-claro.png) | [Captura](apoyos-1280-oscuro.png) | [Captura](apoyos-390-claro.png) | [Captura](apoyos-390-oscuro.png) |
| Filtros de Apoyos adicionales | En columna | En columna | [Diálogo](filtros-apoyos-390-claro.png) | [Diálogo](filtros-apoyos-390-oscuro.png) |

## Comprobaciones

- `node --check app.js`, `git diff --check` y todas las pruebas de `scripts/*.cjs`: correctos. `probar_pasos.cjs` se reemplaza por `probar_pestanas.cjs`, que conserva cobertura de URL, historial, foco, estado, mochila y almacenamiento bloqueado, y agrega teclado, contador, limpieza y traslado de nodos. Se retiran las comprobaciones del resumen eliminado.
- `python3 scripts/validar_catalogo.py`: Catálogo correcto; 88 recomendaciones, 36/36 consideraciones DUA.
- Chromium/Playwright: actualización inmediata, foco del radio de momento conservado, limpieza sin perder nivel/mochila/apoyos, nivel compartido y etiqueta/avisos propios de superior.
- Flechas, Home, End, Tab y Enter; Atrás/Adelante reales, persistencia, URL directa y fragmento desconocido. Entrada desde estado anterior de la tarea 014 y necesidades guardadas como null, sin fallos.
- Apertura/cierre del diálogo, Escape, identidad de los campos antes y después, cambio de ancho y hash con el diálogo abierto. El foco no queda en filtros ocultos al pasar a teléfono.
- Guía en primera visita y desde apoyos; privacidad sobre filtros y sobre mochila; vuelta al campo de origen. Funciona sin el catálogo opcional de necesidades y con localStorage bloqueado.
- Mochila, notas, PDF descargado, impresión a PDF, respaldo JSON descargado y abierto, recarga y borrado. Se comprobó que la impresión contiene notas y no incluye la interfaz de filtros o mochila.
- Sin desplazamiento horizontal entre 320 y 1440 px. Ambos paneles, filtros y temas a 390 px y con fuente raíz al 200 %. Grilla de dos columnas a 1280, una a 1024/390 y una con texto al 200 % a 1280. Desplazamiento independiente de la columna.
- axe-core sin infracciones automáticas en 16 combinaciones: ambos paneles a 1280/390 en ambos temas, ambos diálogos de filtros de teléfono y mochila a ambos anchos y temas. No sustituye una revisión manual completa de WCAG.
- Cabecera y textos de guía/privacidad comparados contra la base. Funciones de recomendación, documento, definición PDF y validación del respaldo sin cambios. `data/`, `docs/fuentes/`, `.claude/` y assets de marca sin cambios. Sin dependencias nuevas.

## ponytail-review

What this change does: It replaces three steps with two accessible tabs and a shared level selector. It puts filters in a sticky sidebar or a full-screen phone dialog, while keeping the same controls, recommendations, backpack and exports.

Looks good. Ship.

Checked the connected input handlers, live updates, tab keyboard controls, real browser history, saved state and filter reset. Checked that moving fields keeps their values and handlers, and that dialogs and viewport changes restore focus. Checked the grid at narrow widths, both themes, larger text, storage failures, optional missing needs, backups, PDF and print. The expected use is one person in a browser with the existing small static catalog. No server or new dependency is added.

Not checked: screen readers, Firefox or Safari, physical phones and safe-area cutouts, or physical printing. The 200% text check changes the root font size; it does not cover every browser or operating-system zoom setting.
