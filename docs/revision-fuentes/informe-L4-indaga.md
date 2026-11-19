# Informe L4 · Indagador

## Alcance

Leí nuevamente los ocho archivos completos del lote L4, cada ficha completa y el párrafo de la fuente usado como evidencia para los 81 pares. Esta ronda cubre solo la Parte A; `matriz-L4.csv` no forma parte de esta entrega.

## Resultado

- `en parte`: 76 pares.
- `sin respaldo`: 5 pares: P078, P080, P103, P350 y P353.
- `respaldada`: 0.
- `contradice`: 0.
- Pares con la nota `no leído`: 4, dentro del máximo del 10 %: P078, P080, P350 y P353.

En cada par `en parte` la cita proviene de un pasaje de contenido que sí trata una parte identificable de la afirmación. La nota explica, para ese par, qué idea queda respaldada y qué instrucción, condición, cifra o efecto de la ficha no queda demostrado. P103 quedó `sin respaldo` porque sus tres elementos concretos —escribir en computador, dictar y marcar opciones— no aparecen en el resumen revisado.

## Observaciones por fuente

- El Decreto 83 respalda marcos de adecuación curricular, formas de presentación y respuesta, organización del tiempo y profundización, pero no todas las instrucciones operativas que las fichas derivan de esos criterios.
- Las orientaciones Mineduc sobre la Ley 21.545 tratan ajustes y participación en educación superior, pero sus ejemplos no convierten cada condición de una ficha en obligación general.
- Ofqual informa resultados dependientes de la prueba y del grupo; no establece una cifra universal de tiempo adicional.
- Wood informa comprensión lectora y texto a voz, con límites de transferencia a evaluaciones universitarias específicas.
- CCSSO, JAN y el protocolo del Servicio Civil son resúmenes u orientaciones técnicas con límites de alcance, sin demostrar por sí solos eficacia causal ni obligaciones chilenas generales.

## Verificación

`python3 docs/revision-fuentes/verificar.py pares L4` → `pares L4: correcto`.

Los únicos archivos modificados intencionalmente son `pares-L4.csv` e `informe-L4-indaga.md`, ambos dentro de `docs/revision-fuentes/`.
