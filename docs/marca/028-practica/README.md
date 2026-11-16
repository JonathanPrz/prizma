# Tarea 028 · Práctica profesional

Datos ficticios. La prueba configura dos estudiantes y notas con marcadores privados para verificar que no lleguen al documento del centro. El PDF solo contiene una de las dos fichas de centro elegidas, tras desmarcar la otra y confirmar la decisión del estudiante.

[PDF de ejemplo para el centro](prizma-practica-ejemplo.pdf).

| Vista | Escritorio claro / oscuro | Teléfono claro / oscuro |
|---|---|---|
| Resultados | [Claro](resultados-1280-claro.png) · [Oscuro](resultados-1280-oscuro.png) | [Claro](resultados-390-claro.png) · [Oscuro](resultados-390-oscuro.png) |
| Guía, media TP | [Claro](guia-1280-claro.png) · [Oscuro](guia-1280-oscuro.png) | [Claro](guia-390-claro.png) · [Oscuro](guia-390-oscuro.png) |
| Decisión de compartir | [Claro](decision-1280-claro.png) · [Oscuro](decision-1280-oscuro.png) | [Claro](decision-390-claro.png) · [Oscuro](decision-390-oscuro.png) |
| Vista del documento | [Claro](documento-1280-claro.png) · [Oscuro](documento-1280-oscuro.png) | [Claro](documento-390-claro.png) · [Oscuro](documento-390-oscuro.png) |

## Comprobaciones

- `node --check app.js`, `python3 scripts/validar_catalogo.py` y todas las `scripts/probar_*.cjs` pasan.
- Nueva prueba: `node scripts/probar_practica_profesional.cjs`. Cubre bandera booleana por estudiante, migración y respaldo, niveles y grupos, coincidencias y orden, texto exacto de la guía y PDF principal.
- Documento del centro: prueba de lista permitida de campos; exclusión de iniciales, situaciones, facilitadores, voz y notas en modelo, vista y definición PDF. Solo incluye fichas de centro seleccionadas y marcadas; no permite generar sin decisión explícita. Cancelar o revocar durante la carga no abre la vista. Cerrar la vista durante la descarga no genera un documento diferente.
- Chromium: 1280 y 390 px, claro/oscuro, grupos en media y superior, aislamiento al cambiar de estudiante, guía manual, foco en título, Escape y devolución del foco, casillas con teclado, restablecimiento de decisión al reabrir y descarga con nombre `prizma-practica-AAAA-MM-DD.pdf`.
- Sin desborde horizontal en página ni hoja. Axe no encontró infracciones WCAG A/AA en el diálogo de decisión de las cuatro combinaciones; no constituye una certificación WCAG completa.
- PDF descargado: una página A4, Roboto, márgenes de 56,7 puntos, campos vacíos, ajuste, acuerdos y pie. Extracción de texto sin marcadores privados; revisión visual de la página.

## ponytail-review

What this change does: It adds professional practice supports for each student. It creates a separate document containing only the centre adjustments the student chose to share.

Looks good. Ship.

Checked: Storage and backup migration, all selection and document callers, level filters, group order, exact guide text and both document paths. The centre model copies only catalogue title, steps and reason. Student notes and profile fields never enter it. Consent is reset on each opening. Tests cover cancellation and revocation during loading, and closing a pending download. Expected use is one teacher with up to ten students. All existing tests pass; no dependency or network data flow was added.

Not checked: Real screen readers, Safari, Firefox, physical phones or a real student review meeting. Chromium and axe do not establish full WCAG compliance. No change to data/, docs/fuentes/ or .claude/.
