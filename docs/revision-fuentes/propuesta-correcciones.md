# Propuesta de correcciones al catálogo (tarea 043)

Claude · a partir de `resumen-riesgo.md` y de la hoja de control. **Nada se cambia en `data/` hasta que el dueño apruebe.**

Son 28 fichas. Cada una tiene al menos una fuente que no dice lo que la ficha le atribuye.

**Corrección a la propia revisión:** al preparar esta propuesta, Claude encontró que el revisor del grupo R3 se equivocó en `acc-10-cultura`. El Decreto 83 **sí** propone materiales con contenidos culturales de los pueblos originarios como forma de presentar la información (línea 263, una línea muy larga). El veredicto se corrigió en `riesgo-R3.csv`. Las otras dos fichas que dicen «sin respaldo» en el Decreto 83 se revisaron otra vez, buscando en todo el texto, y se confirman.

## Grupo A · Quitar una fuente que no respalda (17 fichas)
La ficha conserva otra fuente que sí la respalda, y el texto no cambia.

| Ficha | Quitar | Queda respaldada por |
|---|---|---|
| `acc-1-organizador` | `ccsso-2016` | Decreto 83 |
| `acc-1-partes` | `decreto-83` | Mineduc autismo 2025 (líneas 436 y 714) |
| `acc-2-tiempo` | `ccsso-2016` | Decreto 83 y Ofqual 2025 |
| `acc-8-teclado` | `ccsso-2016` | Decreto 83 |
| `acc-8-transcribe` | `ccsso-2016` | Decreto 83 |
| `acc-9-plazos` | `decreto-83` | Ley 20.422, art. 40 |
| `acc-10-cultura` | `mineduc-extranjeros-2017` | Decreto 83 (línea 263) |
| `acc-11-recursos` | `cast-dua-3` | Decreto 67 (sobrecarga y vida familiar), en parte |
| `acc-14-extension` | `cast-dua-3` | Decreto 83 |
| `obj-eliminacion`, `obj-enriquecimiento`, `obj-graduacion`, `obj-priorizacion`, `obj-temporalizacion` | `decreto-67` | Decreto 83 (el 67 solo remite al 83 y al 170) |
| `pp-plan` | `ley-20422` | Decreto 2.516 |
| `sup-digital` | `ley-20422` | Wood 2018 y guía Mineduc Ley 20.422 |
| `sup-profundizar` | `cast-dua-3` | Ley 21.091, art. 1 (talentos) |

## Grupo B · Corregir lo que la ficha afirma (5 fichas)

| Ficha | Problema | Cambio propuesto |
|---|---|---|
| `sup-tiempo` | La Ley 21.091 no trata el tiempo adicional. «La evidencia muestra beneficios» no tiene fuente: Ofqual dice que no hay base para una cifra fija. | Quitar `ley-21091`. Respaldo: de `investigacion-moderada` a `orientacion-oficial`. Por qué: «Cuando la rapidez no es lo que se evalúa, el tiempo adicional permite mostrar lo aprendido. No hay una cifra que sirva a todos». El 50 % del Mineduc se mantiene: está en su guía, línea 1254. |
| `sup-plazos` | Las leyes 21.091 y 20.422 no regulan plazos ni ausencias por salud en superior. | Quitar `ley-21091` y `ley-20422`. Respaldo: de `norma-legal` a `orientacion-oficial`. Quedan la guía del Mineduc y la CDPD, art. 24.5. |
| `tr-rechazo` | Las fuentes no traen los arts. 485 y 486. El resumen del Código no menciona la tutela. | Quitar `codigo-trabajo`. Por qué: «Si cree que hubo discriminación, la persona puede denunciar ante la Inspección del Trabajo o el juzgado». Respaldo: `orientacion-oficial`. |
| `tr-decidir` | Ni el Código ni la OIT hablan del «gestor de inclusión» ni de la responsabilidad del empleador. | Quitar `codigo-trabajo`. Por qué: «Saber quién decide, quién lo hace y cuándo se revisa evita que la solicitud quede sin respuesta». Respaldo: `orientacion-oficial` (OIT). |
| `tr-formacion-equipo` | El ORD. 693/26 no trata la capacitación. El Código la exige solo a algunas empresas (art. 157 quáter). | Quitar `dt-693-26`. Respaldo: de `norma-legal` a `consenso-expertos`. |

## Grupo C · «Investigación sólida» sin el informe original (6 fichas)
`dua-3-2`, `dua-4-2`, `dua-5-3-andamiaje-lista`, `dua-5-3-parv`, `dua-8-3` y `dua-9-3-reflexion-cierre` declaran investigación sólida. Se apoyan solo en un análisis propio del informe de la EEF (`internacional/README.md`), que nombra las estrategias pero no muestra la evidencia.

- **Opción 1 (recomendada ahora):** bajar el respaldo a `consenso-expertos`. En `dua-9-3-reflexion-cierre`, el por qué pasa a decir: «Pensar sobre cómo se aprende ayuda a elegir qué hacer la próxima vez».
- **Opción 2 (después):** el dueño consigue el informe de la EEF *Special Educational Needs in Mainstream Schools* (2020, gratuito), se agrega a `docs/fuentes/` y se verifica cada ficha. Las que se confirmen recuperan «investigación sólida».

## Grupo D · Sin ninguna fuente (1 ficha)
`sup-recursos` («Asegura que las tareas se puedan hacer con los recursos de la institución»): ni la Ley 21.091 ni el análisis DUA respaldan la ficha. La guía del Mineduc habla de equipos con lector de pantalla para estudiantes con discapacidad, no de recursos para todos.

- **Opción 1 (recomendada):** retirarla hasta tener una fuente.
- **Opción 2:** mantenerla como `consenso-expertos` y buscar una fuente en una tarea aparte.

## Pendiente que no se resuelve aquí
`docs/fuentes/dua-3.0.md`, que citan unas 60 fichas como «CAST», solo tiene los títulos de las 36 consideraciones, no su contenido. Hay que completarlo con una descripción propia de cada consideración, leída de las Pautas DUA 3.0, sin copiar a CAST. Será una tarea aparte.

## Cómo se aplica
Claude hace los cambios en `data/recomendaciones.json` en una rama y corre `validar_catalogo.py` y las pruebas. El dueño aprueba antes de integrar.
