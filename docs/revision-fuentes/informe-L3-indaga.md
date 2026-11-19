# Informe L3 · Indagador

## Alcance

Leí de nuevo la tarea 043 después de actualizar `main`, incluidas las reglas contra atajos. Revisé los 7 archivos del lote completos y contrasté los 23 pares individualmente con la afirmación completa de cada ficha. No quedó ningún par sin leer.

Los archivos de fuente del lote son: `australia-jobaccess.md`, `chile-ley-19628.md`, `chile-ley-21719.md`, `cast-udl-on-campus-assessment.md`, `chile-mintrab-tutela.md`, `jan-interaccion.md` y `unesco-inclusion-tvet-2025.md`.

## Pares sin respaldo

`P161`, `P163`, `P171`, `P208`, `P243`, `P257`, `P282`, `P286`, `P380`, `P398` y `P406` quedaron sin respaldo porque la lectura no encontró la combinación completa de condiciones afirmada por la ficha. En los pares de fuentes inglesas, la cita literal no se usa para una afirmación en español cuando no comparte palabras de contenido; se registran los términos concretos buscados en la afirmación.

## Pares en parte

`P315`, `P316`, `P343`, `P344`, `P369`, `P401` y `P407` tienen respaldo parcial. En cada caso, la columna `nota` identifica la condición, plazo, procedimiento o alcance que la fuente no afirma.

## Pares respaldados

`P298`, `P300`, `P341`, `P342` y `P366` quedaron respaldados por el contenido específico citado. Las citas no se tomaron de títulos ni metadatos, y no se reutilizó una misma cita más de dos veces.

## Tipo de archivo y límites

`cast-udl-on-campus-assessment.md` y `unesco-inclusion-tvet-2025.md` son textos completos. `australia-jobaccess.md`, `chile-ley-19628.md`, `chile-ley-21719.md`, `chile-mintrab-tutela.md` y `jan-interaccion.md` son resúmenes propios de agente; no se trataron como transcripciones completas ni como evidencia experimental. No se modificaron fuentes, catálogo ni archivos de la matriz o de la muestra.

## Verificación

`python3 docs/revision-fuentes/verificar.py pares L3` devuelve `pares L3: correcto`.
