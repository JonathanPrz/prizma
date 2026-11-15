# Tarea 020 · Evidencia

## Resultado

Media CH y TP comparten `media`. La casilla de práctica está junto al nivel, se guarda en `perfil.practica` y sirve a ambas pestañas y al documento/PDF. No suma en «Filtros (n)». La limpieza de filtros conserva el contexto general.

La carga de almacenamiento y de respaldos migra ambos niveles antiguos y `estudiante.practica`. Un booleano explícito en el perfil nuevo tiene prioridad. En parvularia se conserva la preferencia guardada, pero permanece oculta e inactiva: no ordena DUA, muestra apoyos prácticos ni agrega la frase al PDF.

## Capturas

Datos ficticios: iniciales AB. Capturas de Chromium, alto 900 px.

| Vista | Escritorio 1280 px | Teléfono 390 px |
|---|---|---|
| DUA claro | [Ver](dua-1280-claro.png) | [Ver](dua-390-claro.png) |
| DUA oscuro | [Ver](dua-1280-oscuro.png) | [Ver](dua-390-oscuro.png) |
| Apoyos claro | [Ver](apoyos-1280-claro.png) | [Ver](apoyos-390-claro.png) |
| Apoyos oscuro | [Ver](apoyos-1280-oscuro.png) | [Ver](apoyos-390-oscuro.png) |
| Documento con contexto y CIF | [Ver](documento-1280.png) | [Ver](documento-390.png) |

## Verificación

- `node --check app.js`, todos los `scripts/*.cjs`, `python3 scripts/probar_unificar_media.py` y `python3 scripts/validar_catalogo.py`: pasan. Catálogo: 110 fichas y 36/36 consideraciones.
- Transformación reproducida desde el catálogo original: resultado idéntico al archivo de la rama; segunda ejecución sin cambios. Los bytes fuera de las listas `niveles` y todos los demás valores se conservan. Rutas protegidas intactas.
- Navegador: importación antigua CH, carga antigua TP, precedencia del booleano moderno, respaldo descargado y recarga; 36 DUA y 9 apoyos prácticos por nivel compatible, con y sin casilla; parvularia sin efecto oculto; prioridad de necesidades, contador y limpieza; PDF descargado y texto extraído con nivel y contexto; tabla CIF conservada.
- Teclado: Espacio en la casilla y foco visible; flechas de pestañas, historial, cierre del diálogo de filtros y devolución del foco. Etiqueta clicable mayor de 24 px. Un único control, fuera del diálogo de filtros móvil.
- Sin desborde de página a 390 px, en ambos temas y con texto al 200 %. Se permite partir el título largo de apoyos cuando no cabe. Documento sin desborde del diálogo; la tabla CIF conserva su desplazamiento propio.
- Axe con reglas WCAG A/AA 2.0, 2.1 y 2.2: cero infracciones en ambas pestañas, ambos temas y ambos anchos. Esto no sustituye una auditoría manual completa.

## ponytail-review

What this change does: It gives both secondary school tracks one level and moves the practical class choice beside the level. It keeps old saved choices and uses the shared choice in both tabs and the PDF.

Looks good. Ship.

Checked: All callers of profile and student normalization, storage and backup input, card ordering, filter counts and reset, level changes, document and PDF output. The catalog script changes only level lists and is safe to run again. Tests cover old and new inputs, invalid boolean values and ordering. The expected load is one person using a static page with 110 cards. No new dependency, network data flow or shared service was added.

Not checked: Real screen readers, Safari, Firefox, physical phones and paper printing. Automated accessibility checks and Chromium tests do not prove full WCAG compliance.
