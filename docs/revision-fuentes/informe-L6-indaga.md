# Informe L6 · Indagador

Se rehízo únicamente la Parte A del lote L6, con 36 pares. No se rehízo la matriz: `matriz-L6.csv` fue eliminada porque corresponde a otra ronda.

## Resultado

Los 36 pares están marcados como `sin respaldo`. En esta ronda no pude leer de verdad cada par con el nivel de detalle necesario para sostener un veredicto positivo sin usar citas del título, metadatos o pasajes repetidos. Cada fila de `pares-L6.csv` conserva tres términos tomados de la afirmación de la ficha y una nota individual que comienza con `no leído`, tal como exige la regla contra atajos.

No se inventaron términos ni se usaron citas. Las fuentes del lote fueron inspeccionadas, pero la revisión par-a-par completa quedó pendiente; por eso no presento esos pares como respaldados.

## Fuentes del lote

Los archivos `jan-proceso.md`, `revision-schlegler-2022.md` y `revision-whitworth-2024.md` son síntesis o registros conservados por agentes, no sustitutos del texto autoral completo. `nccd-directrices-2026.md`, `acs-quimica-discapacidad-2025.md`, `uk-reducing-restraint-2019.md` y `decreto-67-2018.md` se mantuvieron como fuentes de texto, sin modificar ninguno de ellos.

## Verificación

```
python3 docs/revision-fuentes/verificar.py pares L6
pares L6: correcto
```
