# Tarea 021 · Avisos emergentes

Los avisos automáticos aparecen al activar su pestaña por primera vez. La guía conserva `prizma.guia-dua.v1`; «Antes de empezar» usa `prizma.aviso-apoyos.v1` y marca también `prizma.privacidad.v1` al cerrarse, incluso con Escape. Sin almacenamiento, se recuerdan durante la visita.

«Ver aviso completo» suspende el aviso de apoyos. Al cerrar privacidad, se vuelve al aviso pendiente; esa transición no confirma el aviso de apoyos. Al cerrarlo definitivamente, el foco vuelve a su pestaña. Los avisos esperan mientras otro diálogo está abierto. El aviso completo conserva su texto y el enlace del pie.

## Capturas

Chromium, alto 900 px, sin datos reales de estudiantes.

| Aviso | Escritorio claro | Teléfono claro | Escritorio oscuro | Teléfono oscuro |
|---|---|---|---|---|
| Antes de empezar: escuela | [Ver](escolar-1280-claro.png) | [Ver](escolar-390-claro.png) | [Ver](escolar-1280-oscuro.png) | [Ver](escolar-390-oscuro.png) |
| Antes de empezar: superior | [Ver](superior-1280-claro.png) | [Ver](superior-390-claro.png) | [Ver](superior-1280-oscuro.png) | [Ver](superior-390-oscuro.png) |
| Guía DUA | [Ver](dua-1280-claro.png) | [Ver](dua-390-claro.png) | [Ver](dua-1280-oscuro.png) | [Ver](dua-390-oscuro.png) |

## Pruebas

- Todos los `scripts/*.cjs`, incluido `probar_avisos.cjs`, y `scripts/probar_unificar_media.py` pasan. `node --check app.js` y el validador pasan: 139 recomendaciones, 36/36 consideraciones.
- Navegador: entrada nueva por `#dua` y `#apoyos`; escuela y superior; primer aviso al cambiar de pestaña, persistencia, recarga y almacenamiento bloqueado; apertura manual; privacidad completa y regreso; Escape, título con foco, navegación por teclado y retorno a la pestaña; escribir iniciales tras «Entendido» sin nuevo aviso.
- Se observaron los cambios de apertura de diálogos durante los recorridos: sin solapamientos. «Empezar» conserva la apertura de filtros en teléfono.
- Respaldo antiguo con `sup-coordinar` y `sup-digital`: se conserva la ficha válida y aparece el aviso de una acción retirada. La ficha eliminada no se puede elegir; el grupo adicional vacío se oculta.
- 1280 y 390 px, claro y oscuro: sin desborde horizontal. Aviso de superior con texto al 200 % a 390 px sin desborde del diálogo ni de la página. Axe: cero infracciones de las reglas A/AA de WCAG 2.0, 2.1 y 2.2 en las doce vistas de avisos.
- Catálogo original: 140 fichas. Catálogo resultante: 139. Comparación de bytes: exclusivamente se elimina el objeto `sup-coordinar`; las demás fichas no se reformatean. Sin cambios en ningún otro archivo de `data/`, `docs/fuentes/` ni `.claude/`.
- El PDF y la tabla CIF conservan su implementación y sus pruebas. No se hizo una nueva comprobación visual del PDF descargado.

## ponytail-review

What this change does: It shows each first-use notice when its tab becomes active. It moves the agreement rule into the support notice and removes the rule card from the catalog.

Looks good. Ship.

Checked: Tab entry from both URLs and later changes, all callers of the guide and privacy notice, native dialog close events, focus and Escape, saved keys and blocked storage. The full privacy notice opens after the support notice closes and returns to it. Old backups discard only the missing card and keep valid choices. Tests still check two real higher education cards, school exclusions, PDF labels and saved choices. The catalog diff removes exactly one record and leaves all other bytes unchanged. The expected load is one person using a static page with 139 cards. No new dependency, network data flow or shared service was added.

Not checked: Real screen readers, Safari, Firefox, physical phones and paper printing. Chromium and axe do not prove full WCAG compliance.
