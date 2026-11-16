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

| Perfil | Antes: situación y frecuencia | Después: situación y frecuencia | Lectura del cambio |
| --- | --- | --- | --- |
| lectura | 2 · Lectura, escritura y cálculo: Casi siempre | 2 · Lectura, escritura y cálculo: Casi siempre | Sin cambio: se mantiene la observación y la frecuencia. |
| vision | 6 · Visión y audición: Casi siempre | 6 · Visión: Casi siempre | Mismo número 6; ahora solo visión. No se añade Braille. |
| senas | 6 · Visión y audición: Casi siempre | 13 · Audición: Casi siempre | Se separa el acceso auditivo del visual; 6 → 13. |
| oral | 3 · Comunicación y lenguaje: Casi siempre | 12 · Expresarse oralmente: Casi siempre | Se separa expresar de comprender; 3 → 12. |
| lengua | 3 · Comunicación y lenguaje: Casi siempre; 10 · Identidad, lengua y pertenencia: Casi siempre | 3 · Comprender lo que se dice o se lee: Casi siempre; 10 · Identidad, lengua y pertenencia: Casi siempre | Conserva 3 y 10; 3 ahora se refiere a comprender las instrucciones. |
| tareas | 1 · Atención y organización: Casi siempre | 1 · Atención y organización: Casi siempre | Sin cambio: se mantiene la observación y la frecuencia. |
| movimiento | 8 · Movimiento y motricidad: Casi siempre | 8 · Movimiento y motricidad: Casi siempre | Sin cambio: se mantiene la observación y la frecuencia. |
| ruido | 5 · Emociones y regulación: Seguido; 7 · Sensibilidad sensorial: Casi siempre | 5 · Emociones y regulación: Seguido; 7 · Sensibilidad sensorial: Casi siempre | Sin cambio: se mantiene la observación y la frecuencia. |
| fatiga | 9 · Salud y energía: Casi siempre | 9 · Salud y energía: Casi siempre | Sin cambio: se mantiene la observación y la frecuencia. |
| desafio | 1 · Atención y organización: A veces | 14 · Necesita más desafío: A veces | Se reemplaza la desconexión por falta de desafío: 1 → 14. Se conserva A veces, sin inventar frecuencia nueva. |


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

| Nivel | Antes total A / D / I | Después total A / D / I | Antes acceso A / D / I | Después acceso A / D / I |
| --- | --- | --- | --- | --- |
| basica | 68 / 289 / 19 | 70 / 222 / 11 | 60 / 87 / 9 | 62 / 20 / 1 |
| superior | 55 / 83 / 9 | 56 / 20 / 0 | 55 / 83 / 9 | 56 / 20 / 0 |


| Perfil | Nivel | Antes A / D / I | Después A / D / I | Acceso antes A / D / I | Acceso después A / D / I |
| --- | --- | --- | --- | --- | --- |
| lectura | basica | 8 / 29 / 0 | 7 / 24 / 0 | 8 / 7 / 0 | 7 / 2 / 0 |
| lectura | superior | 8 / 6 / 0 | 7 / 1 / 0 | 8 / 6 / 0 | 7 / 1 / 0 |
| vision | basica | 6 / 28 / 2 | 6 / 23 / 1 | 6 / 6 / 2 | 6 / 1 / 1 |
| vision | superior | 6 / 6 / 2 | 7 / 1 / 0 | 6 / 6 / 2 | 7 / 1 / 0 |
| senas | basica | 5 / 29 / 2 | 5 / 23 / 0 | 5 / 7 / 2 | 5 / 1 / 0 |
| senas | superior | 5 / 8 / 1 | 5 / 1 / 0 | 5 / 8 / 1 | 5 / 1 / 0 |
| oral | basica | 2 / 33 / 3 | 4 / 23 / 0 | 2 / 11 / 3 | 4 / 1 / 0 |
| oral | superior | 2 / 10 / 3 | 4 / 1 / 0 | 2 / 10 / 3 | 4 / 1 / 0 |
| lengua | basica | 8 / 31 / 1 | 7 / 26 / 0 | 8 / 9 / 1 | 7 / 4 / 0 |
| lengua | superior | 5 / 10 / 2 | 2 / 7 / 0 | 5 / 10 / 2 | 2 / 7 / 0 |
| tareas | basica | 5 / 33 / 0 | 5 / 28 / 0 | 5 / 11 / 0 | 5 / 6 / 0 |
| tareas | superior | 5 / 10 / 0 | 5 / 5 / 0 | 5 / 10 / 0 | 5 / 5 / 0 |
| movimiento | basica | 12 / 25 / 0 | 12 / 22 / 0 | 12 / 3 / 0 | 12 / 0 / 0 |
| movimiento | superior | 10 / 3 / 0 | 10 / 0 / 0 | 10 / 3 / 0 | 10 / 0 / 0 |
| ruido | basica | 16 / 25 / 0 | 14 / 20 / 0 | 9 / 10 / 0 | 7 / 5 / 0 |
| ruido | superior | 9 / 8 / 0 | 7 / 4 / 0 | 9 / 8 / 0 | 7 / 4 / 0 |
| fatiga | basica | 5 / 30 / 0 | 5 / 22 / 0 | 5 / 8 / 0 | 5 / 0 / 0 |
| fatiga | superior | 5 / 8 / 0 | 5 / 0 / 0 | 5 / 8 / 0 | 5 / 0 / 0 |
| desafio | basica | 1 / 26 / 11 | 5 / 11 / 10 | 0 / 15 / 1 | 4 / 0 / 0 |
| desafio | superior | 0 / 14 / 1 | 4 / 0 / 0 | 0 / 14 / 1 | 4 / 0 / 0 |


La reducción de las discutibles también incluye pérdida de opciones adecuadas; no se interpreta automáticamente como mayor calidad. [Comparación completa](comparacion.json) · [clasificación de las 379 combinaciones](clasificacion.md) · [fichas observadas](fichas-observadas.md).

## Pares idénticos y similitud, N=10

Los pares se informan sin orden; los datos crudos también distinguen `mismoOrden`. La lista total tiene los mismos pares idénticos que acceso, aunque el Jaccard total es mayor por opciones condicionales compartidas. Las tablas de los 70 escenarios se enlazan más abajo.

| Nivel | Práctica | Pares idénticos antes | Pares idénticos después | Jaccard acceso antes → después |
| --- | --- | --- | --- | --- |
| parvularia | No | vision / senas; tareas / desafio | — | 0.109 → 0.046 |
| basica | No | vision / senas; tareas / desafio | — | 0.105 → 0.040 |
| basica | Sí | vision / senas; tareas / desafio | — | 0.481 → 0.062 |
| media | No | vision / senas; tareas / desafio | — | 0.103 → 0.040 |
| media | Sí | vision / senas; tareas / desafio | — | 0.489 → 0.062 |
| superior | No | vision / senas; tareas / desafio | — | 0.164 → 0.090 |
| superior | Sí | vision / senas; tareas / desafio | — | 0.555 → 0.095 |


## Hallazgos nuevos, sin implementar soluciones

### N1 · Prioridad media: menor ruido también retira apoyos antes adecuados

Hay trece combinaciones ficha/perfil/nivel que 024 clasificó como adecuadas y ya no aparecen. Por ejemplo, `prac-tiempo` desaparece para lectura, `prac-recorrido` para señas/ruido y `prac-evaluar` para lengua. Estas fichas siguen en el catálogo y son del nivel, pero las marcas no intersectan sus dimensiones; el nuevo requisito de puntaje positivo las excluye. `sup-formatos` también deja de aparecer para lengua tras separar expresión de comprensión.

No se considera que toda opción retirada era innecesaria ni que toda coincidencia positiva sea adecuada. Los 13 casos se mantienen con su justificación original; no se añade una marca no descrita para hacer reaparecer la ficha. Esta es una pérdida de cobertura respecto del criterio editorial anterior, no una demostración clínica ni una propuesta de cambiar el filtro.

| Perfil | Nivel | Ficha antes adecuada que ya no aparece | Justificación conservada de 024 |
| --- | --- | --- | --- |
| lectura | basica | prac-tiempo | Permite tiempo para leer y registrar el trabajo sin reducir su desempeño. |
| senas | basica | prac-recorrido | Acordar cómo se comunicarán y localizar las salidas visualmente es pertinente en la práctica. |
| lengua | basica | prac-evaluar | Permite demostrar el desempeño sin que dominar español sea una exigencia añadida. |
| lengua | basica | prac-recorrido | Permite acordar una vía de comunicación antes de usar equipos; no equivale por sí solo a traducir toda la sesión. |
| ruido | basica | prac-recorrido | Conocer previamente el lugar puede reducir el efecto de cambios inesperados. |
| ruido | basica | prac-procedimiento | La secuencia visible anticipa lo que ocurrirá. |
| lengua | superior | sup-formatos | Glosario/traductor y vías alternativas, cuando el idioma no es lo evaluado, permiten participar con conocimientos en su lengua. |
| lectura | superior | prac-tiempo | Permite tiempo para leer y registrar el trabajo sin reducir su desempeño. |
| senas | superior | prac-recorrido | Acordar cómo se comunicarán y localizar las salidas visualmente es pertinente en la práctica. |
| lengua | superior | prac-evaluar | Permite demostrar el desempeño sin que dominar español sea una exigencia añadida. |
| lengua | superior | prac-recorrido | Permite acordar una vía de comunicación antes de usar equipos; no equivale por sí solo a traducir toda la sesión. |
| ruido | superior | prac-recorrido | Conocer previamente el lugar puede reducir el efecto de cambios inesperados. |
| ruido | superior | prac-procedimiento | La secuencia visible anticipa lo que ocurrirá. |


### N2 · Prioridad media: una ficha nueva de oralidad aparece sin barrera oral declarada

`ruido/superior/sup-oral-progresivo` aparece por la dimensión 5. El caso describe angustia ante ruido y cambios, no dificultad de responder oralmente o exponer. Se clasifica **Discutible**: falta información para aplicar esa exigencia gradual. La separación de 3/12 no evita todos los cruces por otras etiquetas. La ficha sigue siendo pertinente para el perfil oral que sí declara esa barrera.

Los problemas persistentes de Braille, orden parcial y opciones condicionales ya están en A1, A4 y B1; no se cuentan de nuevo como hallazgos nuevos. No se modifica aplicación, catálogo ni diseño.

## PDF y evidencia de interfaz

[PDF de diez estudiantes](prizma-plan-10-estudiantes.pdf) · [texto extraído por el motor PDF](pdf-10-textos.json) · [resultados y 21 mediciones PDF](resultados.json).

La misma regla de selección del ensayo: 12 primeras DUA y hasta cinco primeros accesos por estudiante; sin objetivos ni DEC. No son elecciones automáticas del producto. Cada estudiante inicia página propia; el de diez empieza con lectura en página 4. La estructura correcta no certifica pertinencia. El script conserva comprobaciones de bloques, orden y límites de página.

| N | Nivel | Práctica | Páginas | Fichas incompletas | Grupos huérfanos |
| --- | --- | --- | --- | --- | --- |
| 1 | parvularia | No | 6 | 0 | 0 |
| 1 | basica | No | 6 | 0 | 0 |
| 1 | basica | Sí | 6 | 0 | 0 |
| 1 | media | No | 7 | 0 | 0 |
| 1 | media | Sí | 7 | 0 | 0 |
| 1 | superior | No | 6 | 0 | 0 |
| 1 | superior | Sí | 7 | 0 | 0 |
| 4 | parvularia | No | 12 | 0 | 0 |
| 4 | basica | No | 12 | 0 | 0 |
| 4 | basica | Sí | 13 | 0 | 0 |
| 4 | media | No | 13 | 0 | 0 |
| 4 | media | Sí | 14 | 0 | 0 |
| 4 | superior | No | 13 | 0 | 0 |
| 4 | superior | Sí | 13 | 0 | 0 |
| 10 | parvularia | No | 25 | 0 | 0 |
| 10 | basica | No | 25 | 0 | 0 |
| 10 | basica | Sí | 26 | 0 | 0 |
| 10 | media | No | 26 | 0 | 0 |
| 10 | media | Sí | 27 | 0 | 0 |
| 10 | superior | No | 25 | 0 | 0 |
| 10 | superior | Sí | 25 | 0 | 0 |


| N | Escritorio: resultados / selector | Teléfono: resultados / selector / final |
|---|---|---|
| 4 | [Resultados](n4-1280-resultados.png) · [Selector](n4-1280-selector.png) | [Resultados](n4-390-resultados.png) · [Selector](n4-390-selector.png) · [Final](n4-390-final-filtros.png) |
| 10 | [Resultados](n10-1280-resultados.png) · [Selector](n10-1280-selector.png) | [Resultados](n10-390-resultados.png) · [Selector](n10-390-selector.png) · [Final](n10-390-final-filtros.png) |

DUA sin recuadro repetido: [escritorio](n10-1280-dua.png) · [teléfono](n10-390-dua.png). [Mediciones de interfaz](interfaz.json): teclado, estado activo, orden VM/navegador, título móvil visible, desborde y errores.

## Datos crudos y tablas completas

[Resultados de 70 escenarios](resultados.json) · [antes/después, retiradas, nuevas e inversiones](comparacion.json) · [listas, cinco primeros y empates](listas-y-empates.md) · [versiones DUA](versiones-dua.md).

Al crecer N cambia la composición porque se agrega el siguiente perfil. El script comprueba que cada lista individual no cambia al aumentar N; los promedios no aíslan un efecto causal del número de estudiantes. Se guardan todos los escenarios, no solo básica/superior.

### N = 1

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 4.00 | 13.00 | — | — | — |
| basica | No | 6.00 | 28.00 | — | — | — |
| basica | Sí | 9.00 | 31.00 | — | — | — |
| media | No | 5.00 | 26.00 | — | — | — |
| media | Sí | 8.00 | 29.00 | — | — | — |
| superior | No | 5.00 | 5.00 | — | — | — |
| superior | Sí | 8.00 | 8.00 | — | — | — |

### N = 2

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 4.50 | 13.50 | 0.125 | 0.588 | — |
| basica | No | 5.00 | 27.00 | 0.000 | 0.688 | — |
| basica | Sí | 8.50 | 30.50 | 0.063 | 0.605 | — |
| media | No | 4.50 | 25.50 | 0.000 | 0.700 | — |
| media | Sí | 8.00 | 29.00 | 0.067 | 0.611 | — |
| superior | No | 4.50 | 4.50 | 0.500 | 0.500 | — |
| superior | Sí | 8.00 | 8.00 | 0.333 | 0.333 | — |

### N = 3

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 4.33 | 13.33 | 0.137 | 0.602 | — |
| basica | No | 4.67 | 26.67 | 0.111 | 0.744 | — |
| basica | Sí | 7.67 | 29.67 | 0.178 | 0.686 | — |
| media | No | 4.33 | 25.33 | 0.111 | 0.751 | — |
| media | Sí | 7.33 | 28.33 | 0.181 | 0.688 | — |
| superior | No | 4.33 | 4.33 | 0.256 | 0.256 | — |
| superior | Sí | 7.33 | 7.33 | 0.258 | 0.258 | — |

### N = 4

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 4.50 | 13.50 | 0.089 | 0.561 | — |
| basica | No | 4.50 | 26.50 | 0.056 | 0.731 | — |
| basica | Sí | 7.00 | 29.00 | 0.102 | 0.668 | — |
| media | No | 4.25 | 25.25 | 0.056 | 0.733 | — |
| media | Sí | 6.75 | 27.75 | 0.104 | 0.668 | — |
| superior | No | 4.25 | 4.25 | 0.149 | 0.149 | — |
| superior | Sí | 6.75 | 6.75 | 0.159 | 0.159 | — |

### N = 5

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 5.60 | 14.60 | 0.076 | 0.509 | — |
| basica | No | 5.60 | 27.60 | 0.055 | 0.693 | — |
| basica | Sí | 7.80 | 29.80 | 0.085 | 0.637 | — |
| media | No | 5.20 | 26.20 | 0.050 | 0.695 | — |
| media | Sí | 7.40 | 28.40 | 0.082 | 0.636 | — |
| superior | No | 5.00 | 5.00 | 0.116 | 0.116 | — |
| superior | Sí | 7.20 | 7.20 | 0.122 | 0.122 | — |

### N = 6

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 5.83 | 14.83 | 0.066 | 0.492 | — |
| basica | No | 5.83 | 27.83 | 0.051 | 0.684 | — |
| basica | Sí | 8.33 | 30.33 | 0.087 | 0.626 | — |
| media | No | 5.50 | 26.50 | 0.049 | 0.684 | — |
| media | Sí | 8.00 | 29.00 | 0.087 | 0.624 | — |
| superior | No | 5.17 | 5.17 | 0.118 | 0.118 | — |
| superior | Sí | 7.67 | 7.67 | 0.131 | 0.131 | — |

### N = 7

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 5.71 | 14.71 | 0.070 | 0.499 | — |
| basica | No | 5.86 | 27.86 | 0.057 | 0.685 | — |
| basica | Sí | 8.86 | 30.86 | 0.098 | 0.620 | — |
| media | No | 5.57 | 26.57 | 0.056 | 0.685 | — |
| media | Sí | 8.57 | 29.57 | 0.098 | 0.617 | — |
| superior | No | 5.00 | 5.00 | 0.147 | 0.147 | — |
| superior | Sí | 8.00 | 8.00 | 0.154 | 0.154 | — |

### N = 8

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 6.25 | 15.25 | 0.068 | 0.478 | — |
| basica | No | 6.38 | 28.38 | 0.058 | 0.669 | — |
| basica | Sí | 9.25 | 31.25 | 0.091 | 0.605 | — |
| media | No | 6.13 | 27.13 | 0.058 | 0.667 | — |
| media | Sí | 9.00 | 30.00 | 0.091 | 0.601 | — |
| superior | No | 5.50 | 5.50 | 0.133 | 0.133 | — |
| superior | Sí | 8.38 | 8.38 | 0.139 | 0.139 | — |

### N = 9

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 6.00 | 15.00 | 0.058 | 0.481 | — |
| basica | No | 6.11 | 28.11 | 0.050 | 0.675 | — |
| basica | Sí | 8.78 | 30.78 | 0.078 | 0.611 | — |
| media | No | 5.89 | 26.89 | 0.050 | 0.672 | — |
| media | Sí | 8.56 | 29.56 | 0.078 | 0.607 | — |
| superior | No | 5.33 | 5.33 | 0.113 | 0.113 | — |
| superior | Sí | 8.00 | 8.00 | 0.119 | 0.119 | — |

### N = 10

| Nivel | Práctica | Promedio acceso | Promedio total | Jaccard acceso | Jaccard total | Pares idénticos (acceso y total) |
| --- | --- | --- | --- | --- | --- | --- |
| parvularia | No | 5.80 | 14.80 | 0.046 | 0.481 | — |
| basica | No | 5.90 | 27.90 | 0.040 | 0.678 | — |
| basica | Sí | 8.30 | 30.30 | 0.062 | 0.616 | — |
| media | No | 5.70 | 26.70 | 0.040 | 0.674 | — |
| media | Sí | 8.10 | 29.10 | 0.062 | 0.611 | — |
| superior | No | 5.20 | 5.20 | 0.090 | 0.090 | — |
| superior | Sí | 7.60 | 7.60 | 0.095 | 0.095 | — |



## Revisión ponytail-review y límites

What this change does: It repeats the 024 audit with the updated situations and compares the measured results. It records each old finding, the remaining limits and the support options that disappeared.

Looks good. Ship.

Checked: The audit script, application functions it calls, baseline data, all 24 new access judgements and the unchanged text of the inherited ones. I checked the 70 scenarios, 379 classifications, 21 PDF layouts, source hashes, local links and browser evidence at 1280 and 390 pixels. Only the audit script and the new audit folder change. The expected load is one local audit run for ten fictional students. No runtime or catalogue changes were made.

Not checked: Real students, clinical effectiveness, live teacher workflows, screen readers, Firefox or Safari. The 028 implementation is not part of this audit. New judgement calls are editorial and their reasons are recorded; no independent second reviewer was used. PDF checks cover the stated selection rule, not every possible note or card combination.
