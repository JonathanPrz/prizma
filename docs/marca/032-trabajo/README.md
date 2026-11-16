# Tarea 032 · Pestaña Trabajo

Implementada sobre `442365a`, con las 64 fichas de trabajo ya aportadas por Claude. No se modificaron `data/`, `docs/fuentes/` ni `.claude/`. No se agregaron dependencias.

## Recorrido y decisiones

Tres pestañas con teclado, hash e historial. Trabajo oculta nivel y práctica escolar sin cambiar el nivel guardado. Tiene su propia lista `trabajadores`, su caso activo, selección, roles y acuerdos; admite diez personas y bloquea el siguiente caso mientras falten acuerdos. Los respaldos antiguos se normalizan con una lista de trabajadores vacía. Al entrar a Trabajo se crea un primer caso vacío si hace falta; no se convierten estudiantes en trabajadores.

Se reutilizan tarjetas, pasos, puntaje, normalización de textos, validaciones de fechas y motor de documentos. El puntaje conserva frecuencia y proporción de coincidencia. Para cumplir el criterio explícito de Audición, el desempate de Trabajo pone subtítulos, intérprete, mensajes y alertas antes de las otras opciones de igual pertinencia; no altera el orden escolar. Para empezar ofrece hasta cuatro tarjetas, sin repetirlas en grupos. Las ocho fichas de proceso aparecen siempre al final de los resultados, después de guardar la descripción.

La guía y los catorce ejemplos se comparan directamente contra la tarea en `scripts/probar_trabajo.cjs`. No hay campos de diagnóstico ni de empresa; el puesto es opcional y tiene máximo 60 caracteres. La interfaz recuerda que la persona decide qué contar. El documento de Trabajo elige personas explícitamente, con todas las casillas inicialmente desmarcadas; no agrega el curso ni estudiantes a esa elección.

## Capturas

Datos ficticios: AB2 y CD en Trabajo; JP en la parte escolar para probar separación. Capturas de viewport 1280 × 900 y 390 × 900, desplazadas al bloque correspondiente.

| Bloque | Escritorio claro | Escritorio oscuro | Teléfono claro | Teléfono oscuro |
|---|---|---|---|---|
| Pestañas, casos y descripción | [Ver](descripcion-1280-claro.png) | [Ver](descripcion-1280-oscuro.png) | [Ver](descripcion-390-claro.png) | [Ver](descripcion-390-oscuro.png) |
| Ajustes ante Audición | [Ver](ajustes-1280-claro.png) | [Ver](ajustes-1280-oscuro.png) | [Ver](ajustes-390-claro.png) | [Ver](ajustes-390-oscuro.png) |
| Acuerdos y siguiente caso | [Ver](acuerdos-1280-claro.png) | [Ver](acuerdos-1280-oscuro.png) | [Ver](acuerdos-390-claro.png) | [Ver](acuerdos-390-oscuro.png) |

## PDF

[Plan de ajustes en el trabajo, ejemplo de cuatro páginas](prizma-trabajo-ejemplo.pdf): portada con fecha/contenido; una página para AB2 con puesto, tabla, facilitadores, voz, ajuste, ficha de proceso y acuerdos; una para CD; fuentes y aviso. Tiene el pie de reserva solicitado. Los marcadores `VOZ_TRABAJO_032`, `VOZ_ESCOLAR_032` y notas escolares son datos sintéticos de prueba; los escolares no aparecen en el PDF laboral. El nombre real de descarga sigue `prizma-trabajo-AAAA-MM-DD.pdf`, sin iniciales.

Cada persona comienza en página nueva. Si se eligen muchos ajustes o notas extensas, el contenido puede continuar en páginas adicionales: no se corta para forzarlo a caber. El ejemplo comprobado tiene exactamente una página por persona.

## Pruebas

Pasan:

```sh
node --check app.js
python3 scripts/validar_catalogo.py
for prueba in scripts/probar_*.cjs; do node "$prueba" || exit 1; done
git diff --check
```

- Catálogo real: 240 fichas, 57 fuentes y ocho necesidades. `probar_datos_reales.cjs` conserva también las 64 selecciones de trabajo, roles, fechas, puesto y notas en todos los niveles, separadas de las selecciones escolares.
- `probar_trabajo.cjs`: textos exactos, datos válidos/inválidos, máximo diez, IDs únicos, lista antigua vacía, prioridad auditiva, ocho fichas de proceso, acuerdos incompletos, revisión posterior, bloqueo, foco, duplicados, selección de un caso inactivo, respaldo y exclusión mutua de datos en modelos/definiciones PDF.
- `probar_pestanas.cjs`: se amplía la navegación a tres pestañas sin quitar las comprobaciones anteriores de foco, hash, memoria, historial simulado y almacenamiento bloqueado. El navegador comprueba Atrás real.
- `probar_avisos.cjs`: regresión del cierre tardío de privacidad. Antes de corregirlo, el evento close devolvía el foco a iniciales aunque la persona ya estuviera escribiendo en Puesto; la prueba falla con esa versión. La corrección conserva el foco siguiente y mantiene el retorno cuando aún corresponde, incluida la reapertura de la mochila.
- Chromium, cuatro combinaciones de tamaño/tema: navegación con flechas y Atrás, guía/Escape, privacidad al escribir y retorno de foco, validación, acuerdos y revisión, dos casos, notas/mochila separadas, descarga de respaldo, elección de personas sin marcar, PDF laboral, documento escolar y apertura de respaldo antiguo estando en Trabajo. Se comprobó también que al recargar con nivel Media siguen ocultos los controles escolares.
- [Resultados de navegador](pruebas-navegador.json): sin errores de página ni desborde. Axe no encontró infracciones A/AA en las vistas de Trabajo comprobadas. No equivale a certificar toda la aplicación.
- PDF descargado y extraído con PyMuPDF: cuatro páginas, puestos/fechas/roles y aviso; sin marcadores escolares y con pie de reserva en páginas interiores. Revisión visual de la página de persona.

## ponytail-review

What this change does: It adds a separate workplace flow with its own cases, choices, agreements and PDF. It keeps school data separate and asks which people to include before building the work document.

Looks good. Ship.

Checked: Changed functions and their callers, catalog validation, storage, old and new backups, case limits, role and date checks, keyboard navigation, selection notes, both document models and the shared PDF renderer. The review fixed two concrete cases: loading an old backup while on Work could leave the old worker form visible, and a late privacy-close event could move focus out of the next input. Both are covered by checks. Tests also cover removing a choice from an inactive worker and keeping school data out of work documents. All repository tests pass. Expected use: one person on a static page, up to ten student cases and ten worker cases, with the current catalog. Existing helpers and the local PDF library are reused. No pending findings.

Not checked: Safari, Firefox, physical phones, screen readers, paper printing, real employers or the largest possible PDF with all choices and long notes. No legal review of a real workplace agreement. The guide text is kept exactly as requested.
