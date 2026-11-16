# Tarea 037 · Filtros de vista DUA

«Momento» y «Para qué» están arriba de las acciones del paso 2 y actúan al instante. El borrador del paso 1 contiene solo la descripción y las prioridades de la clase; editar, guardar o limpiar sus respuestas conserva los filtros de vista. «Limpiar filtros» limpia únicamente `estado.momentos` y `estado.propositos`.

Se conservan claves, validación, persistencia y respaldo. Los conteos «para ti» usan las necesidades guardadas, no las que todavía se están editando. El resumen de la clase y los datos del curso en el PDF no enumeran estos filtros. Las agrupaciones por momento de las acciones elegidas en el documento siguen teniendo sus encabezados.

«Para empezar» toma las tres acciones más pertinentes del resultado filtrado y desaparece cuando quedan tres o menos. El conteo tiene `aria-live="polite"` y `aria-atomic="true"`. Los botones conservan foco y `aria-pressed`; las filas tienen espacio para el foco y desplazamiento interno en teléfono.

Se corrigió el cálculo del paso actual para que coincida con el desplazamiento real: `scrollIntoView` combina el padding del documento y el margen del paso. También se contempla el final de página, donde el último paso no siempre puede alinearse arriba. La prueba verifica que el indicador permanezca en el paso 2 después del desplazamiento y que la barra inferior avance al 3.

## Capturas

| Tema | Paso 1, escritorio | Paso 2, escritorio | Paso 1, teléfono | Paso 2, teléfono |
| --- | --- | --- | --- | --- |
| Claro | [1280](paso-1-1280-light.png) | [1280](paso-2-1280-light.png) | [390](paso-1-390-light.png) | [390](paso-2-390-light.png) |
| Oscuro | [1280](paso-1-1280-dark.png) | [1280](paso-2-1280-dark.png) | [390](paso-1-390-dark.png) | [390](paso-2-390-dark.png) |

## Verificación

- `python3 scripts/validar_catalogo.py` y los 19 `scripts/probar_*.cjs`.
- Nuevo `scripts/probar_filtros_vista.cjs`: teclado Enter/Espacio y foco, actualización sin guardar, independencia del borrador, limpiezas separadas, resumen/documento, recarga, descarga y validación de respaldo, almacenamiento bloqueado, vocabulario de parvularia y cruces momento/propósito en los cuatro niveles con datos reales.
- Árbol de accesibilidad de los filtros: [390 claro](accesibilidad-390-light.yml), [390 oscuro](accesibilidad-390-dark.yml), [1280 claro](accesibilidad-1280-light.yml), [1280 oscuro](accesibilidad-1280-dark.yml). Se verifican los grupos «Momento»/«Para qué», nombres y estado pulsado.
- Chromium real, ambos temas, 1280 × 900 y 390 × 900; objetivos de al menos 24 px, sin desborde horizontal de página y sin errores JavaScript observados en esos recorridos.
- [Revisión ponytail-review](ponytail-review.md).

No se probó con NVDA/VoiceOver, dispositivos físicos ni otros motores de navegador. Se comprobaron controles semánticos, estados ARIA y foco en Chromium; no se afirma una auditoría WCAG integral. No se modificaron datos, fuentes, arquitectura ni `.claude/`.
