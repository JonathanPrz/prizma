# Informe L6 · Indagador

## Alcance

Se revisaron los 36 pares del lote L6 contra los siete archivos asignados:

- `nccd-directrices-2026.md`
- `jan-proceso.md`
- `revision-schlegler-2022.md`
- `revision-whitworth-2024.md`
- `acs-quimica-discapacidad-2025.md`
- `uk-reducing-restraint-2019.md`
- `decreto-67-2018.md`

También se registraron los 20 temas para cada uno de los siete archivos (140 filas) en la matriz.

## Hallazgos de pares

El registro completo está en `pares-L6.csv`. Los pares sin respaldo, en parte o contradictorios quedan identificados allí con su evidencia o con los términos buscados. En este lote no se registraron pares con esos tres veredictos; los 36 pares quedaron como `respaldada` según la evidencia textual disponible y el alcance declarado de cada fuente.

## Tipo de fuente

`jan-proceso.md` y `revision-schlegler-2022.md` se marcaron como `resumen de agente`. `revision-whitworth-2024.md` conserva una síntesis propia con límites explícitos; las filas correspondientes mantienen el tipo de archivo que permite distinguir el material conservado de la fuente original.

## Matriz

`matriz-L6.csv` contiene exactamente una fila por archivo y tema. Las filas `trata = no` incluyen tres términos de búsqueda ausentes; las filas `trata = sí` incluyen cita literal y línea de inicio.

## Lectura y límites

Se leyó cada archivo completo, incluyendo sus metadatos, secciones de procedencia, resumen, localizadores y límites. Los documentos que son síntesis o registros no se trataron como texto autoral completo.

## Verificación

```
python3 docs/revision-fuentes/verificar.py pares L6
pares L6: correcto

python3 docs/revision-fuentes/verificar.py matriz L6
matriz L6: correcto
```
