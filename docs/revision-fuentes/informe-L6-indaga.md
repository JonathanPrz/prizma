# Informe L6 · Indagador

Se rehízo únicamente la Parte A del lote L6, con 36 pares. La matriz no forma parte de esta ronda y `matriz-L6.csv` permanece eliminada.

## Resultado

`pares-L6.csv` contiene 9 pares `en parte`, 27 `sin respaldo` y ningún `no leído`. Las notas son específicas para cada ficha: indican qué pasaje o alcance sí encontré y qué afirmación, condición o consecuencia no queda demostrada. Las citas se tomaron del cuerpo de los archivos, no de títulos ni metadatos, y no se repiten más de dos veces.

Los pares `en parte` se concentran en el proceso de ajustes de JAN, la guía británica sobre conducta, IPS y la revisión sobre adultos con altas capacidades. En cada uno se distingue el apoyo general de los detalles que la ficha agrega. Los pares `sin respaldo` corresponden a afirmaciones para las que la fuente citada no contiene una disposición o instrucción equivalente; los términos de búsqueda salen de la propia afirmación.

## Fuentes leídas

Se revisaron completos los siete archivos asignados al lote: `nccd-directrices-2026.md`, `jan-proceso.md`, `revision-schlegler-2022.md`, `revision-whitworth-2024.md`, `acs-quimica-discapacidad-2025.md`, `uk-reducing-restraint-2019.md` y `decreto-67-2018.md`. `jan-proceso.md`, `revision-schlegler-2022.md` y `revision-whitworth-2024.md` son síntesis o registros conservados por agentes; se identifican como `resumen de agente` en las filas pertinentes.

## Verificación

```
python3 docs/revision-fuentes/verificar.py pares L6
pares L6: correcto
```
