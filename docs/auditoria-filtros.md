# Auditoría de filtros y catálogo

Revisión de Prizma después de la tarea 016 (pestañas y filtros laterales).
Fecha: 15 de noviembre de 2026. Base: `docs/fuentes/dua-3.0.md`, `docs/fuentes/cif.md`, Decreto 83 y sus orientaciones (2017), y el catálogo en `data/`.

**Prioridad:** alta = cambia lo que la persona ve o crea un error; media = mejora clara; baja = detalle.

## Resumen

La estructura sigue siendo válida: DUA para todo el curso primero y apoyos específicos después, como pide el Decreto 83.
Pero al sumar cosas aparecieron 4 problemas de prioridad alta:

1. **"¿Cuándo?" esconde acciones.** Siempre filtra y parte en "Antes". Si eliges "Quiero evaluar de formas distintas", no cambia nada arriba: sus 4 acciones están en Durante y Después.
2. **El orden de los filtros no sigue DUA 3.0.** CAST parte por la meta y después busca las barreras. Hoy la meta va segunda.
3. **El título general habla de "todo tu curso" también en la pestaña de apoyos**, que son para un estudiante.
4. **Hay situaciones sin apoyos.** En educación superior, "Identidad, lengua y pertenencia" y "Espacio, tiempo y actitudes" no tienen ningún ajuste. En parvularia, "Lectura, escritura y cálculo" tampoco. La página no avisa.

## A. Pestaña DUA

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| A1 | "¿Cuándo?" filtra siempre y parte en "Antes". Se ven 11 de 36 acciones sin que la persona lo haya elegido. Choca con la ayuda "Si no eliges, verás todas las acciones". | Hacer "¿Cuándo?" opcional y de selección múltiple, como "¿Para qué?". Sin elegir, mostrar las 36 agrupadas por momento: Antes, Durante, Después, En toda la clase. | Alta |
| A2 | Las necesidades solo reordenan dentro del momento elegido. "Evaluar" tiene 0 acciones en "Antes"; "Lengua y cultura" y "Clima" casi no tienen. | Se resuelve con A1. Dentro de cada momento, las acciones que responden a la necesidad van primero. | Alta |
| A3 | CAST pide definir primero la meta de aprendizaje: sin meta no se distingue una barrera de un desafío deseable (ver `auditoria-plan.md`, A1). Hoy la meta va después de las necesidades. | Orden: 1) ¿Qué quieres que aprendan? 2) ¿Qué quieres resolver? 3) ¿Cuándo? 4) ¿Para qué? 5) Más detalles. | Alta |
| A4 | El título "Acciones para que todo tu curso pueda aprender" está fuera de las pestañas y también se ve en Apoyos. | Cada pestaña lleva su título. DUA: el actual. Apoyos: "Apoyos específicos para un estudiante". | Alta |
| A5 | La pregunta "¿Qué quieres resolver en esta clase?" no cambia en parvularia ("experiencia de aprendizaje"). El resto sí. | Usar `data-voc` también ahí. | Media |
| A6 | La etiqueta "Mostrar lo aprendido" cubre el principio Acción y expresión (pautas 4, 5 y 6). La pauta 6 es de funciones ejecutivas: metas, agenda, organización. Una ficha sobre anticipar la agenda queda rotulada "Mostrar lo aprendido". | Cambiar a **"Expresarse y organizarse"**. | Media |
| A7 | La meta no cambia los resultados; solo va al PDF. Está bien: Prizma no planifica. | Mantener. La ayuda "Quita las barreras, no el desafío de aprender esto" ya explica para qué sirve. | — |
| A8 | Cada nivel tiene las 36 consideraciones, una acción por cada una. Las 8 necesidades cubren 31 de las 36. | Mantener. Ampliar con una 2.ª acción por consideración más adelante (catálogo, no código). | Baja |

## B. Pestaña Apoyos

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| B1 | El nombre "Apoyos adicionales" no se distingue bien del DUA. | Renombrar la pestaña a **"Apoyos específicos"**. En superior sigue "Ajustes razonables". | Media |
| B2 | El orden es correcto según la CIF: áreas → situaciones (barreras) → qué le ayuda (facilitadores). Los resultados van de acceso a objetivos y desregulación, como pide el Decreto 83 (los objetivos solo si el acceso no basta). | Mantener. | — |
| B3 | Falta la voz del estudiante y la familia. El Decreto 83 pide considerar lo que aportan la familia y el propio estudiante (cap. evaluación diagnóstica). La auditoría anterior (A7) la pidió para la etapa 2. | Agregar un campo opcional: "¿Qué dicen el estudiante y su familia?". Va al PDF. Sin diagnósticos. | Alta |
| B4 | Si marcas una situación sin apoyos en ese nivel, no aparece nada y no se explica. | Avisar: "Aún no hay apoyos para esta situación en este nivel. Revisa las acciones DUA". | Alta |
| B5 | "¿Qué le ayuda?" no cambia los resultados; solo va al PDF. | Mantener. | — |

## C. Catálogo (repositorio de adecuaciones)

Estado actual, por nivel:

| | Parvularia | Básica y media | Superior |
|---|---|---|---|
| Acciones DUA | 36 | 36 | 36 |
| Adecuaciones de acceso o ajustes | 19 | 22 | 9 |
| Adecuaciones en los objetivos | 0 (no corresponde) | 5 | 0 (no corresponde) |
| Desregulación | 9 | 9 | 0 (se remite al protocolo) |

Fichas de acceso por situación: entre 0 y 4. Es poco para un repositorio con filtros.

| # | Observación | Propuesta | Prioridad |
|---|---|---|---|
| C1 | Hay situaciones sin ningún apoyo: superior 10 y 11, parvularia 2. | Escribir al menos 2 fichas para cada vacío, con fuente. | Alta |
| C2 | Las adecuaciones en los objetivos son 5 fichas genéricas, una por tipo, sin ejemplos. | Agregar ejemplos por tipo y asignatura (lenguaje, matemática, ciencias, historia), basados en el Decreto 83 y sus orientaciones. | Media |
| C3 | Cada situación tiene 2 a 4 adecuaciones de acceso. | Llegar a 4 o más por situación y nivel, cubriendo los 4 tipos del Decreto 83. | Media |
| C4 | El contenido del catálogo lo escribe Claude con la skill `asesor-inclusion`; Codex no edita `data/`. | Hacer C1–C3 como tarea de contenido aparte, después de la 017. | — |

## Decisiones

- Tarea 017 (código, Codex): A1–A6, B1, B3 y B4.
- Tarea de contenido (Claude): C1, después C2 y C3.
