# Informe L2 · Indagador

## Alcance

Revisé nuevamente `docs/tareas/043-revision-fuentes.md`, incluidas las reglas contra atajos. Leí los archivos de fuentes asignados a L2 completos y revisé cada una de las 56 fichas del lote contra su afirmación completa. Esta ronda entrega solo la Parte A: `pares-L2.csv`.

## Hallazgos

Las filas marcadas «en parte» contienen una cita específica de contenido y una nota propia que identifica qué condiciones de la ficha no están expresas en la fuente. Las filas «sin respaldo» conservan términos tomados literalmente de la afirmación y la nota `no leído` cuando no encontré una evidencia específica suficiente para ese par; no las presento como respaldadas.

Hay fuentes que son resúmenes o extractos preparados por agentes:

- `docs/fuentes/codex/mineduc-inclusion-extranjeros-2017-resumen.md`: resumen de agente; el propio archivo indica que no es el PDF íntegro.
- `docs/fuentes/codex/practica-laboral/senadis-avanza-2021.md`: resumen de agente del adjunto suministrado.
- `docs/fuentes/codex/trabajo/jan-estres.md`: resumen de agente de la página consultada.
- `docs/fuentes/codex/practica/eeuu-uw-laboratorios-2014.md`: extracto y síntesis propia, no protocolo experimental.

## Lo que no pude leer de verdad

No pude establecer respaldo específico para P205, P239, P237, P308, P310 y P346; se marcaron `sin respaldo` con `no leído` y términos tomados de sus afirmaciones. No se usaron citas de título o metadatos para esas filas.

## Verificación mecánica

`python3 docs/revision-fuentes/verificar.py pares L2` → `pares L2: correcto`.

La matriz L2 fue eliminada porque corresponde a otra ronda, como se solicitó.
