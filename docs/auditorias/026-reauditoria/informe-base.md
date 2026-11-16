# Reauditoría 026 · Comparar antes y después

## Resumen

Se repiten los diez perfiles y los 70 escenarios de la auditoría 024, con las marcas nuevas. Desaparecen los pares idénticos visión/señas y tareas/desafío. En la unión de básica y superior se clasifican 379 combinaciones ficha/perfil/nivel, frente a 523 antes. No se juzga la calidad por cuántas opciones desaparecen ni por un Jaccard menor.

En **acceso**, las inadecuadas pasan de 9 a 1 en básica y de 9 a 0 en superior. Al contar también las opciones condicionales, básica conserva 11 inadecuadas: una de acceso y diez de objetivos para el perfil que pide más desafío. Las secciones condicionales no son recomendaciones personales automáticas.

Se mantienen descripciones, ayudas, voz y frecuencias. Los cambios de marca están documentados; son un remapeo editorial pedido por la tarea, no una inferencia automática ni una migración de datos reales. Las fases 1 y 2 se evalúan juntas: esta comparación no separa causalmente el efecto del catálogo, las marcas y el nuevo orden.

Se observan cinco hallazgos resueltos en estos casos, tres parciales y dos pendientes o límites aceptados. Hay mejoras de precisión y cobertura, pero también trece combinaciones antes adecuadas que ya no aparecen. Se registran sin implementar soluciones.

## Reproducción y alcance

Desde cualquier carpeta del repositorio:

```bash
node scripts/auditar_estudiantes.cjs
```

Para regenerar además las capturas y las mediciones de interfaz, con herramientas ya instaladas:

```bash
PLAYWRIGHT_MODULE=/ruta/al/modulo/playwright CHROMIUM_PATH=/ruta/a/chromium node scripts/auditar_estudiantes.cjs --interfaz
```

No instala paquetes. Node, VM y el pdfmake local producen los 70 escenarios y 21 mediciones PDF (1, 4 y 10 estudiantes, por siete combinaciones). El servidor de navegador escucha solo en 127.0.0.1 y se cierra al terminar. Sin `--interfaz` se reutiliza evidencia de navegador solo si coinciden sus huellas de entrada; si cambia una entrada exige regenerarla. La fecha del modelo PDF sigue fija al 15-11-2026, America/Santiago, para mantener el método anterior.

El script lee perfiles, juicios explícitos y esta plantilla; escribe únicamente en esta carpeta. Compara con `../024-estudiantes/resultados.json` y nunca lo modifica. Los hashes de entradas, revisión y fichas revisadas quedan registrados; un cambio de contenido de ficha exige revisar su juicio, no heredar silenciosamente la etiqueta. `comparacion.json` conserva filas retiradas/nuevas y ambos conteos, no solo el saldo.

**Corte:** `main` en `2519bb5`, después de integrar 025 y 027. La implementación de 028 vive en otro PR y no se incorpora a esta rama. Las 23 fichas `practica-profesional` ya están en el catálogo, pero esta versión de la aplicación no las renderiza: no se confunden con la casilla general de taller/laboratorio/terreno ni se cuentan en estos resultados. Es una comparación de las fases pedidas, no una auditoría de la 028.

Se conserva el mismo método de recogida: tarjetas del árbol producido por `pintarApoyos`, orden visible, diez tamaños N, cuatro niveles y práctica apagada/encendida salvo parvularia. Sin asignatura, necesidades ni selección durante la medición. «Acceso» incluye taller/laboratorio/terreno; «total» añade las secciones condicionales desplegadas. Similitud Jaccard sin orden; se registra por separado si coincide el orden. N=1 no tiene pares.

Para pertinencia se revisa la unión de práctica apagada/encendida en básica y superior. Los 159 juicios de acceso son explícitos: 135 se conservan de 024 para fichas cuyo título, pasos y explicación no cambiaron; 24 combinaciones nuevas se revisaron leyendo su contenido. Se contrastó el catálogo anterior de `c8de472` con la huella de 024 y el catálogo actual. Los 220 juicios condicionales conservan los mismos criterios. «Adecuada» responde a la observación; «Discutible» requiere datos/contexto; «Inadecuada» contradice o no responde a lo descrito. No son diagnósticos ni estimaciones de eficacia clínica.

## Cambios de marcas de los diez perfiles

Se cambia solo lo necesario para expresar la misma observación con las 14 situaciones. En desafío se conserva «A veces» (1): no se inventa una frecuencia mayor. En lengua se mantienen comprensión (3) e identidad/lengua (10). La igualdad de textos y demás campos frente a 024 se verifica en el script.

{{MARCAS}}

Datos de entrada: [perfiles](perfiles.json) · [juicios de acceso con huella de ficha](revision-acceso.json).

## Antes / después por hallazgo de 024

Los estados se limitan a los casos y entradas de este corte. «Resuelto» no equivale a pertinencia garantizada para cualquier estudiante.

| Hallazgo | Estado | Antes | Después y evidencia |
|---|---|---|---|
| A1 · Visión y audición mezcladas | **Parcial** | Visión/señas tenían listas idénticas y cruzaban apoyos visuales/auditivos. | Ya no hay pares idénticos y señas no recibe Braille. Pero `vision/basica/acc-6-braille` sigue inadecuada y aparece segunda; el perfil declara que no lo usa. En superior visión queda sin inadecuadas. Véanse `comparacion.json`, pares, y `clasificacion.md`. |
| A2 · Oralidad activa traducción/audición | **Resuelto en estos casos** | El perfil oral recibía traducción, señas y audición; lengua recibía vías auditivas no descritas. | Esas combinaciones inadecuadas desaparecen. Oral empieza con `acc-3-caa` en básica y `sup-caa` en superior. Lengua conserva sus marcas 3/10 y no activa señas. Persisten opciones discutibles; no se confunden con el cruce concreto anterior. |
| A3 · Desafío recibe la lista de tareas | **Resuelto en estos casos** | Tareas/desafío eran idénticos; ningún acceso adecuado para desafío. | Listas distintas en las siete combinaciones. Desafío tiene cuatro accesos adecuados en básica y cuatro en superior, antes cero. Se conserva frecuencia 1. Los objetivos condicionales se juzgan aparte en B1. |
| A4 · Orden entierra apoyos pertinentes | **Parcial** | CAA quedaba sexta en básica; el agrupamiento precedía al puntaje. | CAA ahora es primera y «Para empezar» reúne tres prioritarias sin duplicados. El resto vuelve a agruparse: para ruido/básica, `acc-1-agenda` y `acc-4-exponer` (2 puntos) anteceden a `acc-7-tranquilo` (3); en superior `sup-pausas` (5) queda después de fichas de 2. `comparacion.json`, `inversiones`, conserva el orden y puntajes. No se exige aquí un algoritmo distinto. |
| M1 · Práctica añade nueve fichas con cero | **Resuelto** | Sumaba nueve a cada perfil compatible, incluso sin coincidencia. | Ningún acceso práctico renderizado tiene puntaje cero. La cantidad ya no es uniforme y desafío no recibe relleno. Las fichas prácticas pertinentes o discutibles con coincidencia siguen revisadas. Algunas antes adecuadas se pierden: hallazgo nuevo N1. |
| M2 · Repetición DUA mezcla causas opuestas | **Resuelto para los diez perfiles** | Tres casillas repetidas mezclaban visión/señas, oralidad/lengua y tareas/desafío. | Con las marcas separadas no hay situaciones repetidas entre estos diez: el recuadro no aparece en N=10 y el navegador registra su ausencia. Esto no demuestra que desaparezca toda ambigüedad en otras combinaciones; no se confunde ausencia del recuadro con una prueba de todos sus posibles botones. |
| M3 · Ayuda y voz no cambian recomendaciones | **Pendiente / límite aceptado** | Cambiar ambos textos no alteraba IDs. | La contraprueba mantiene las mismas listas. La estrategia declaró interpretar texto libre fuera de alcance; los textos se conservan para el acuerdo y PDF. No se informa como pérdida de datos ni se implementa interpretación. |
| M4 · Contexto móvil al desplazarse | **Resuelto en la medición** | Al final del formulario no se veían selector/iniciales y el título decía solo «Filtros». | En 390 px el encabezado visible dice «Filtros · CO» o «Filtros · DE» incluso al final del cuerpo desplazable. Se alternó primero/último con teclado en N=4/10 sin mezclar campos. En escritorio el selector sigue siendo largo, sin desborde ni error de identidad observado. Evidencia en `interfaz.json` y capturas del final del formulario. |
| B1 · Opciones condicionales elevan similitud | **Pendiente / contexto conservado** | Básica ofrecía 13 objetivos y nueve DEC a todos al desplegar. | Siguen las 22 opciones; diez objetivos para desafío permanecen inadecuados a lo descrito. No son 22 recomendaciones priorizadas ni el total discutible una tasa de error del filtro de acceso. Se muestran acceso y total por separado. |
| B2 · PDF conserva elecciones poco pertinentes | **Parcial** | PDF de diez: 26 páginas; conservaba apoyos poco pertinentes elegidos por el ensayo. | PDF de diez: 25 páginas, sin fichas partidas, grupos huérfanos ni líneas fuera de página en los 21 casos. CO incorpora CAA, pero VI aún exporta Braille bajo la misma regla de hasta cinco primeros accesos. El PDF preserva lo elegido, no valida su pertinencia. |

## Conteos antes / después

A / D / I = Adecuadas / Discutibles / Inadecuadas. Se cuentan combinaciones ficha/perfil/nivel, no personas ni fichas únicas. La unión de los dos estados de práctica se deduplica. Se conserva la clasificación de cada opción condicional: no se oculta para mejorar un porcentaje.

{{GLOBAL}}

{{COMPARACION}}

La reducción de las discutibles también incluye pérdida de opciones adecuadas; no se interpreta automáticamente como mayor calidad. [Comparación completa](comparacion.json) · [clasificación de las 379 combinaciones](clasificacion.md) · [fichas observadas](fichas-observadas.md).

## Pares idénticos y similitud, N=10

Los pares se informan sin orden; los datos crudos también distinguen `mismoOrden`. La lista total tiene los mismos pares idénticos que acceso, aunque el Jaccard total es mayor por opciones condicionales compartidas. Las tablas de los 70 escenarios se enlazan más abajo.

{{PARES}}

## Hallazgos nuevos, sin implementar soluciones

### N1 · Prioridad media: menor ruido también retira apoyos antes adecuados

Hay trece combinaciones ficha/perfil/nivel que 024 clasificó como adecuadas y ya no aparecen. Por ejemplo, `prac-tiempo` desaparece para lectura, `prac-recorrido` para señas/ruido y `prac-evaluar` para lengua. Estas fichas siguen en el catálogo y son del nivel, pero las marcas no intersectan sus dimensiones; el nuevo requisito de puntaje positivo las excluye. `sup-formatos` también deja de aparecer para lengua tras separar expresión de comprensión.

No se considera que toda opción retirada era innecesaria ni que toda coincidencia positiva sea adecuada. Los 13 casos se mantienen con su justificación original; no se añade una marca no descrita para hacer reaparecer la ficha. Esta es una pérdida de cobertura respecto del criterio editorial anterior, no una demostración clínica ni una propuesta de cambiar el filtro.

{{RETIRADAS}}

### N2 · Prioridad media: una ficha nueva de oralidad aparece sin barrera oral declarada

`ruido/superior/sup-oral-progresivo` aparece por la dimensión 5. El caso describe angustia ante ruido y cambios, no dificultad de responder oralmente o exponer. Se clasifica **Discutible**: falta información para aplicar esa exigencia gradual. La separación de 3/12 no evita todos los cruces por otras etiquetas. La ficha sigue siendo pertinente para el perfil oral que sí declara esa barrera.

Los problemas persistentes de Braille, orden parcial y opciones condicionales ya están en A1, A4 y B1; no se cuentan de nuevo como hallazgos nuevos. No se modifica aplicación, catálogo ni diseño.

## PDF y evidencia de interfaz

[PDF de diez estudiantes](prizma-plan-10-estudiantes.pdf) · [texto extraído por el motor PDF](pdf-10-textos.json) · [resultados y 21 mediciones PDF](resultados.json).

La misma regla de selección del ensayo: 12 primeras DUA y hasta cinco primeros accesos por estudiante; sin objetivos ni DEC. No son elecciones automáticas del producto. Cada estudiante inicia página propia; el de diez empieza con lectura en página 4. La estructura correcta no certifica pertinencia. El script conserva comprobaciones de bloques, orden y límites de página.

{{PDF}}

| N | Escritorio: resultados / selector | Teléfono: resultados / selector / final |
|---|---|---|
| 4 | [Resultados](n4-1280-resultados.png) · [Selector](n4-1280-selector.png) | [Resultados](n4-390-resultados.png) · [Selector](n4-390-selector.png) · [Final](n4-390-final-filtros.png) |
| 10 | [Resultados](n10-1280-resultados.png) · [Selector](n10-1280-selector.png) | [Resultados](n10-390-resultados.png) · [Selector](n10-390-selector.png) · [Final](n10-390-final-filtros.png) |

DUA sin recuadro repetido: [escritorio](n10-1280-dua.png) · [teléfono](n10-390-dua.png). [Mediciones de interfaz](interfaz.json): teclado, estado activo, orden VM/navegador, título móvil visible, desborde y errores.

## Datos crudos y tablas completas

[Resultados de 70 escenarios](resultados.json) · [antes/después, retiradas, nuevas e inversiones](comparacion.json) · [listas, cinco primeros y empates](listas-y-empates.md) · [versiones DUA](versiones-dua.md).

Al crecer N cambia la composición porque se agrega el siguiente perfil. El script comprueba que cada lista individual no cambia al aumentar N; los promedios no aíslan un efecto causal del número de estudiantes. Se guardan todos los escenarios, no solo básica/superior.

{{TABLAS_N}}

## Revisión ponytail-review y límites

What this change does: It repeats the 024 audit with the updated situations and compares the measured results. It records each old finding, the remaining limits and the support options that disappeared.

Looks good. Ship.

Checked: The audit script, application functions it calls, baseline data, all 24 new access judgements and the unchanged text of the inherited ones. I checked the 70 scenarios, 379 classifications, 21 PDF layouts, source hashes, local links and browser evidence at 1280 and 390 pixels. Only the audit script and the new audit folder change. The expected load is one local audit run for ten fictional students. No runtime or catalogue changes were made.

Not checked: Real students, clinical effectiveness, live teacher workflows, screen readers, Firefox or Safari. The 028 implementation is not part of this audit. New judgement calls are editorial and their reasons are recorded; no independent second reviewer was used. PDF checks cover the stated selection rule, not every possible note or card combination.
