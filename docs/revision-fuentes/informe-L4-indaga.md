# Informe L4 · Indagador

## Alcance

Leí los ocho archivos completos del lote L4 y revisé las 81 afirmaciones ficha–fuente de `pares.csv`, incluyendo sus apartados «cómo» y «por qué». No realicé la Parte B: `matriz-L4.csv` fue eliminada porque corresponde a otra ronda.

## Resultado de los pares

- `en parte`: 71 pares.
- `sin respaldo`: 10 pares: P078, P080, P103, P154, P215, P231, P350, P353, P363 y P364.
- `respaldada`: 0.
- `contradice`: 0.

Los pares `en parte` tienen citas tomadas de pasajes de contenido de su propia fuente y notas específicas sobre lo que el pasaje sí cubre y lo que la ficha agrega. No usé títulos ni metadatos como evidencia.

Los pares `sin respaldo` son aquellos en que no localicé apoyo suficiente para la afirmación completa. P078 y P080 quedaron marcados honestamente como `no leído` según la regla de la tarea; en los otros ocho se anotaron términos concretos de la afirmación que no encontré al revisar el archivo.

## Fuentes y límites

`ccsso-accesibilidad-2016-resumen.md`, `revision-wood-lectura-2018.md`, `chile-servicio-civil-adp.md`, `jan-sensorial.md` y `jan-vision.md` son resúmenes o síntesis propias de documentos externos. El Decreto 83, el informe Ofqual y las orientaciones Mineduc contienen texto extenso de sus documentos fuente. Las notas distinguen orientación técnica, evidencia y alcance normativo, sin convertir ejemplos en obligaciones generales.

## Verificación

`python3 docs/revision-fuentes/verificar.py pares L4` → `pares L4: correcto`.

No quedó ningún archivo fuera de `docs/revision-fuentes/` modificado intencionalmente.
