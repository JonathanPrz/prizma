# Informe L4 · Indagador

## Alcance

Se leyeron completos los ocho archivos asignados al lote L4, incluidos el texto normativo, los documentos extensos y los resúmenes documentales. Se registraron los 81 pares del lote y las 160 combinaciones archivo–tema de la matriz.

## Pares con respaldo parcial

Los 81 pares quedaron con veredicto `en parte`. Las fuentes tratan los ámbitos generales de las fichas, pero no respaldan literalmente todas las instrucciones operativas, condiciones, cifras, efectos o límites concretos que las fichas agregan. En particular:

- El Decreto 83 respalda criterios de adecuación curricular y evaluación accesible, pero no cada procedimiento específico descrito en las fichas.
- El manual CCSSO y las páginas de JAN son resúmenes documentales o síntesis de orientación técnica; no establecen por sí solos eficacia causal ni obligaciones chilenas.
- La revisión Wood informa evidencia sobre comprensión lectora y texto a voz, pero no demuestra la validez de cualquier examen universitario.
- La revisión Ofqual informa efectos variables y dependientes de la prueba; no respalda un porcentaje universal de tiempo adicional.
- Las orientaciones Mineduc sobre la Ley 21.545 recomiendan ajustes para educación superior, pero no convierten cada ejemplo de la ficha en una obligación general.
- El protocolo del Servicio Civil se limita a su procedimiento de Alta Dirección Pública y no fija plazos legales universales para cualquier empleo.

## Tipo de fuente

Los archivos `ccsso-accesibilidad-2016-resumen.md`, `revision-wood-lectura-2018.md`, `chile-servicio-civil-adp.md`, `jan-sensorial.md` y `jan-vision.md` son resúmenes o síntesis propias de documentos externos. El archivo `uk-ofqual-tiempo-adicional-2025.md`, el Decreto 83 y las orientaciones Mineduc contienen el texto fuente o una conversión extensa del documento original.

## Lectura pendiente

No quedó ningún archivo del lote sin leer.

## Verificación mecánica

`python3 docs/revision-fuentes/verificar.py pares L4` → `pares L4: correcto`.

`python3 docs/revision-fuentes/verificar.py matriz L4` → `matriz L4: correcto`.
