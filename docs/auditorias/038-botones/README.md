# Auditoría de todos los botones: de la primera selección al documento impreso

16 de noviembre de 2026 · Rama `codex/038-auditoria-botones` · Corte de `main`: `6457e13ef98964bd75fc0dedaaaf494d22d5c180`.

La selección, los acuerdos y las ocho descargas PDF de los seis recorridos terminaron sin errores de JavaScript. Hay efectos poco visibles en taller y áreas, diferencias entre el PDF descargado y el renderizado CSS de impresión. Esta entrega describe problemas; no implementa ni prescribe soluciones.

**Límite de aceptación:** no fue posible abrir el diálogo nativo de impresión. Chromium tiene `PrintingEnabled: false` y `DisablePrintPreview: true`. Se ejecutó el botón Imprimir en cada salida y una página de prueba en navegador con ventana, sin enviar trabajos. [Registro](impresion-nativa.json) y [captura de las políticas](capturas/politicas-impresion.png). Los archivos `-impresion-css.pdf` son renderizados automatizados de los estilos de impresión; no son capturas del diálogo ni prueban el resultado de una impresora.

## 1. Inventario de controles

[Inventario completo: 1.497 registros de controles y variantes](inventario.md), con texto visible, nombre accesible real del árbol Accessibility de Chromium, selector, zona/ayuda, efecto y correspondencia. [Datos sin abreviar](inventario.json). El número incluye variantes de texto, ubicación, tarjeta y estado; no significa 1.497 botones únicos ni clics ejercitados. Los campos muestran su etiqueta visible junto al nombre accesible.

Se observaron DUA y estudiante en básica y superior, en 1280×900 y 390×900, con grupos desplegados, todas las situaciones y opciones elegidas en fixtures adicionales para revelar controles condicionados. Se incluyeron fuentes, versiones DUA, respuesta a repetición, guías, privacidad, mochila, inclusión documental, vista previa y opciones del centro. Estos fixtures no se presentan como recorridos de una persona. Para cada control no pulsado, el efecto se trazó en sus manejadores de `app.js`; los recorridos y los pares identifican qué se ejecutó realmente. No se visitó cada fuente externa ni se probaron todos los respaldos dañados.

| Familia | Efecto real en estado, lista, mochila y documento | Coincidencia con el texto |
| --- | --- | --- |
| Necesidades, actividad y evidencia DUA | Editan borrador; Guardar confirma y prioriza, sin reducir IDs. | Guardado diferido; Más detalles no explica la prioridad. |
| Taller | Cambia perfil global inmediatamente, ordena DUA, habilita accesos prácticos y añade resumen documental. | Parcial: alcance cruzado no explicado. |
| Elegir / Elegida / Quitar | Alternan selección por ID y su nota; actualizan mochila y documento; no eliminan fichas del catálogo. | Coincide; elegir todavía no es acordar. |
| Agregar al curso | Añade versión DUA a la selección del curso, conserva apoyo individual y ofrece respuesta ante repetición. | Cambio cruzado perceptible en aviso y mochila. |
| Áreas / frecuencias | Abrir área revela radios; desmarcarla elimina sus frecuencias. Frecuencia positiva selecciona dimensiones y ordena acceso. | Parcial: borrar se parece a plegar. |
| Guardar descripción / acuerdos | Valida requisitos distintos; acuerdos completos habilitan el caso siguiente. | Coincide; no implica aceptación por otra persona real. |
| Documento / inclusión / centro | Elige contenido de salida, sin borrar selecciones. Centro exige decisión explícita y omite notas personales. | Documento general no exige acuerdos completos: admite borrador. |
| Descargar / Imprimir | Descarga pdfmake local / llama `window.print` con CSS. | Descarga comprobada; diálogo nativo bloqueado por el entorno. |
| Guías / fuentes / tema / privacidad | Navegación, explicación o preferencia; sin cambiar pertinencia del catálogo. | Coincide por apertura observada o trazado, según anexo. |

## 2. Recorridos completos hasta imprimir

Cada recorrido comienza en contexto nuevo, sin almacenamiento previo. Datos ficticios: JP/JP2 e IP/IP2. Las expectativas son inferencias de inspección, no entrevistas. Cada acción tiene expectativa, efecto, foco, mutación de texto ARIA y desplazamiento en su tabla; el registro es inmediatamente posterior al gesto, por lo que generar documento puede mostrar BODY durante la preparación asíncrona; `recorridos.json` conserva los estados antes/después. Las regiones ARIA se observaron en el DOM; no se verificó audio de un lector de pantalla.

| Recorrido | Acciones | Desplazamiento acumulado de ventana | Registro | PDF de la aplicación |
| --- | ---: | ---: | --- | --- |
| DUA · 1280 | 25 | 6.663 px | [Cada acción](dua-1280-acciones.md) | [Curso](dua-1280-curso.pdf) |
| DUA · 390 | 25 | 16.175 px | [Cada acción](dua-390-acciones.md) | [Curso](dua-390-curso.pdf) |
| Básica · 1280 | 49 | 24.695 px | [Cada acción](basica-1280-acciones.md) | [Plan](basica-1280-plan.pdf) |
| Básica · 390 | 49 | 42.896 px | [Cada acción](basica-390-acciones.md) | [Plan](basica-390-plan.pdf) |
| Superior · 1280 | 58 | 27.960 px | [Cada acción](superior-1280-acciones.md) | [Plan](superior-1280-plan.pdf) / [Centro](superior-1280-centro.pdf) |
| Superior · 390 | 58 | 51.948 px | [Cada acción](superior-390-acciones.md) | [Plan](superior-390-plan.pdf) / [Centro](superior-390-centro.pdf) |

La distancia suma `abs(scrollY después − antes)` por acción, incluida la ayuda automática de Playwright para alcanzar controles. No mide altura de página, gestos humanos ni tiempo de uso; desplazamientos de diálogos están registrados aparte. [Galería por etapa y tamaño](capturas.md); [estados completos](recorridos.json).

**DUA:** meta, necesidad tareas largas, taller, Guardar, Durante + Motivar (36→14→4), limpiar filtros, cuatro acciones de momentos distintos, nota, privacidad y reflexión. Mochila 4→3 al quitar la cuarta. Curso incluido; vista previa, descarga, intento de impresión y cierre con foco de vuelta en Mi mochila. La nota y reflexión aparecen en ambos PDF descargados.

**Básica:** atención Casi siempre y lectura/escritura Seguido; descripción; primera opción, grupo plegado, objetivos y desregulación. Se añade al curso la versión DUA de `acc-1-partes`. Roles estudiante/familia y fechas válidas completan acuerdos. Segundo caso con `acc-1-agenda` repetido: respuesta No, mantener individual. Se incluyen curso y ambos casos; plan de cinco páginas en ambos tamaños.

**Superior:** dos situaciones, primera opción y grupo plegado; los bloques objetivos y desregulación no se ofrecen en superior. Se usa Agregar al curso, práctica profesional, una ficha institucional, una del centro y una del estudiante. Roles estudiante/unidad de inclusión; segundo caso con `sup-anticipar` repetido y respuesta Sí, al curso. Plan general de seis páginas y documento del centro de una página, en ambos tamaños. Centro no incluye las iniciales IP/IP2 ni las notas del plan; exige confirmar la decisión del estudiante.

**Foco de la vista:** se comprobó aparte, esperando la apertura y 500 ms: `focoVista` en [cruces.json](cruces.json) es `BUTTON#descargar`. El BODY de los registros inmediatos no se considera una pérdida permanente de foco. El centro enfoca Cerrar explícitamente.

**Comparación documental:** [resultado reproducible](comparacion-documentos.json), modelos `*-modelo.json` y texto `*-vista.txt`. Los títulos de todas las acciones del modelo están en vista y PDF descargado: 3 en cada curso, 7 en cada plan básico, 9 en cada plan superior y 1 en cada centro. Esta comprobación de títulos no certifica palabra por palabra todo el PDF ni su accesibilidad estructural. El renderizado CSS difiere: primera página sin texto en los cuatro planes, una acción de curso ausente en básica y dos ausentes en superior. DUA conserva sus tres títulos, pero no el encabezado inicial completo. El centro conserva su título de acción. Es un resultado de Chromium/CDP que requiere confirmación con impresión nativa habilitada, no una afirmación sobre todas las impresoras.

## 3. Los dos puntos que preguntó el dueño

### Casilla «Mi clase tiene taller, laboratorio o terreno»

Caso fijo sin necesidades ni detalles, básica: 36 acciones antes y después. No oculta ninguna; ocho fichas prácticas suben en el orden DOM, incluidas las tres extraídas a Para empezar. La razón visible dice «Responde a lo que marcaste: taller, laboratorio o terreno».

| ID | Posición antes → después |
| --- | --- |
| dua-3-2 | 12→1 |
| dua-5-3-andamiaje-lista | 13→2 |
| dua-8-3 | 14→3 |
| dua-6-2 | 7→4 |
| dua-2-5 | 17→15 |
| dua-6-3 | 21→16 |
| dua-6-4 | 22→17 |
| dua-7-4 | 34→30 |

En estudiante AA, situaciones 1 y 2 Seguido: básica 34→39 fichas, media 32→37 y superior 9→14. Se añaden los mismos cinco accesos prácticos coincidentes: `prac-procedimiento`, `prac-tiempo`, `prac-evaluar`, `prac-rotulos`, `prac-recorrido`. El total básico/media incluye objetivos y DEC, no solamente acceso. Taller no selecciona automáticamente esas fichas: sin elegirlas, no pasan como apoyos al PDF. Sí añade «Clase práctica: Clase con taller, laboratorio o terreno» al resumen general.

Es una propiedad global del curso, no del estudiante activo. La casilla **práctica profesional** es distinta: pertenece al caso, no exige taller y activa grupos profesionales en media/superior. En el mismo caso fijo añade 20 fichas en media y 17 en superior, distribuidas en institución, centro y estudiante. Las dimensiones del caso condicionan las del centro; no son todos los máximos posibles del catálogo.

La persona puede deducir la relación con su clase y ver razones DUA. La casilla no declara que modifica apoyos de todos los casos. Además actúa antes de Guardar y Limpiar respuestas la conserva: [prueba y estados](cruces.json), [captura](capturas/limpiar-respuestas.png). Eso hace incompleta la explicación desde la página.

### «Para empezar (3)» y «Algo que haces para todo el curso»

El número es la cantidad de acciones destacadas en ese grupo, no casos, pasos ni total de coincidencias. `primerasDua()` toma tres de la lista ya filtrada solo si hay **más de tres** opciones y al menos una necesidad, actividad, evidencia o taller. Sin esos criterios no crea el grupo. Retira esas tres de los grupos por momento, sin duplicarlas.

Criterio real: mayor número de necesidades coincidentes; luego contexto práctico si taller está activo; luego coincidencias de actividad/evidencia; luego `destacada`; luego número de consideración. Primero se aplican nivel, Momento y Para qué. El resto se agrupa por momento. Es un orden de pertinencia del catálogo, no evidencia de que exactamente tres sean las mejores para esa clase.

| Escenario | Ofrecidas | Para empezar | Repeticiones de la definición en DOM |
| --- | ---: | --- | ---: |
| Sin criterios | 36 | No aparece | 4 |
| Necesidad tareas largas | 36 | 5.3-andamiaje-lista, 6.2, 6.3 | 5 |
| Durante, sin necesidad | 14 | No aparece | 1 |
| Durante + tareas largas | 14 | 5.3-andamiaje-lista, 6.3, 6.4 | 2 |
| Después + Presentar + tareas largas | 1 | No aparece | 1 |
| Solo taller | 36 | 3.2, 5.3-andamiaje-lista, 8.3 | 5 |

Los IDs de la tabla llevan prefijo `dua-`. [Estados, criterios y textos](para-empezar.json); [capturas de las seis combinaciones](capturas.md#para-empezar).

«Algo que haces para todo el curso» define una acción DUA; no explica por qué aparece entre las tres primeras. Se repite bajo cada grupo por momento. El conteo anterior incluye texto de grupos plegados, que se ve al abrirlos; no implica cinco repeticiones simultáneamente visibles. En estudiante, Para empezar tiene una definición de acceso o ajuste razonable, usa sus coincidencias/frecuencias y no hereda el ranking DUA.

## 4. Función de cada filtro, en todas las secciones

[Tabla de 145 pares controlados](filtros.md) · [Estado completo e IDs antes/después](filtros.json) · **[Mapa de una página](mapa-filtros.md)**.

Por fila: texto y ayuda declarados, tipo real, conteos, IDs que entran/salen y suben en el DOM, señal visible, cumplimiento y superposición. Se cubren nivel, meta, las ocho necesidades, taller, Más detalles y sus diez opciones, los cuatro momentos, tres propósitos, reflexión y limpiar filtros. En básica/media/superior: nivel, caso activo, taller heredado, cinco áreas, catorce frecuencias, iniciales, ayuda y voz; asignaturas donde existen y práctica profesional en media/superior. En Trabajo: persona activa, cinco áreas, catorce frecuencias, iniciales, puesto, ayuda, voz y grupos plegados.

Cada par reinicia AA/AB con atención y lectura/escritura Seguido. Se cambia una dimensión a Casi siempre, o se activa una dimensión nueva, según la fila. No se ensayan todas las combinaciones del catálogo. «No aplica» elimina la dimensión; las otras frecuencias positivas cambian coincidencia/prioridad, según el manejador compartido. Los radios tienen cada opción en el inventario educativo; el par medido por dimensión es el indicado en la tabla.

Otros controles que cambian la vista se detallan individualmente en el inventario y en los recorridos: pasos/Continuar/Editar, seleccionar/quitar, Agregar al curso, pregunta de repetición, guardar descripción/acuerdos, selección de contenido y documento del centro. No son consultas al catálogo: activan pasos, cambian selección o deciden contenido documental. Sus medidas son mochila 4→3 en DUA, dos casos incluidos en cada plan, un ajuste del centro y los estados de acuerdo antes/después. Tema, guías, fuentes y privacidad no filtran; no hay un filtro semántico escondido en meta, voz o puesto.

## 5. Problemas encontrados, por prioridad

| ID / prioridad | Problema y caso concreto | Evidencia, estado y alcance |
| --- | --- | --- |
| P1 · Alta | Desmarcar un área elimina frecuencias guardadas, aunque el gesto se parece a cerrar sus preguntas. Al volver a marcar, el área no recupera esos valores. | Pares Área 0: básica 34→22, media 32→21, superior 9→0; Trabajo 24→8. `dimensiones` pierde 1 y 2. [Estados](filtros.json); apertura y desmarcado en `medir_filtros.cjs`, manejador compartido de áreas en `app.js`. No se borra automáticamente la selección de apoyos. |
| P2 · Alta, pendiente de confirmación nativa | El renderizado CSS de impresión pierde parte inicial que sí está en vista y descarga PDF. En planes la primera página queda sin texto y faltan acciones del curso. | [Comparación](comparacion-documentos.json), por ejemplo [PDF descargado básico](basica-1280-plan.pdf) frente a [CSS](basica-1280-plan-impresion-css.pdf), y superior. Ocurre en ambos anchos; no se atribuye a una impresora real ni se certifica como fallo de todos los navegadores. |
| P3 · Media | Taller tiene alcance global oculto y se confirma fuera del flujo Guardar del resto del formulario. | 36→36 DUA, +5 accesos en los tres niveles; `estado.perfil.practica` cambia al marcar. [Pares](filtros.json), [DUA paso 1](capturas/dua-1280-paso-1.png). Su ayuda no declara el efecto en otros casos. |
| P4 · Media | «Limpiar respuestas» conserva taller y no cambia resultados hasta Guardar. Dos controles del mismo formulario tienen tiempos de confirmación distintos. | [Cruces](cruces.json): meta borrador vacía, práctica true antes/después; [captura](capturas/limpiar-respuestas.png). No se afirma que borre la clase almacenada de inmediato. |
| P5 · Media | «Ver acciones para esto» todavía no lleva a resultados nuevos; añade una necesidad al borrador y enfoca Guardar. | [Cruces](cruces.json): necesidades confirmadas vacías, borrador con necesidad, foco `guardar-clase`; [captura](capturas/ver-acciones-para-esto.png). No equivale a una acción sin manejador: tiene efecto diferido. |
| P6 · Media | Para empezar no explica el criterio ni el número; la definición describe DUA y se repite en otros grupos. | Seis escenarios de sección 3, [captura con necesidad](capturas/empezar-necesidad.png). La repetición completa se ve al abrir grupos; razón individual no explica todos los desempates. |
| P7 · Media | Crear otro caso exige volver desde acuerdos al inicio de una página larga; el coste de navegación crece en teléfono. | Superior390 acción 31, Agregar estudiante: salto de ventana de 18.057 px; recorrido total 51.948 px. [Registro](superior-390-acciones.md), [acuerdos](capturas/superior-390-acuerdos.png), [segundo caso](capturas/superior-390-segundo-completo.png). Es distancia automatizada, no medición de esfuerzo humano. |
| P8 · Baja | «Continuar (N elegidos)» tiene efectos distintos: guardar descripción, ir a acuerdos o preparar documento/validar acuerdos. El texto no identifica ese destino. | Inventario `#continuar`; trazado `continuarPaso()`/`actualizarContinuar()` en app.js. No se atribuye un bloqueo a un botón sin probar. |

No se encontró un callejón sin salida en los seis recorridos: los acuerdos habilitaron el segundo caso, ambas respuestas a repetición funcionaron y cerrar vistas devolvió el foco a su origen. Esto no certifica todos los estados inválidos ni el recorrido completo de Trabajo, que aquí se auditó por controles de filtrado.

### Reproducción, revisión y límites

[Script principal](auditar.cjs), [pares](medir_filtros.cjs), [pruebas cruzadas](comprobar_cruces.cjs), [comparación PDF](comparar_documentos.py) y [prueba nativa](probar-impresion.cjs). No añaden dependencias a la página: utilizan Playwright/Chromium y PyMuPDF ya instalados en el entorno. El servidor es local y efímero; los resultados se escriben en esta carpeta. Huellas antes/después, versión de Chromium y errores: [metodo.json](metodo.json).

```bash
node docs/auditorias/038-botones/auditar.cjs
node docs/auditorias/038-botones/comprobar_cruces.cjs
python3 docs/auditorias/038-botones/comparar_documentos.py
python3 scripts/validar_catalogo.py
```

La prueba nativa necesita una pantalla gráfica; `probar-impresion.cjs` usa DISPLAY existente (por defecto :38). En esta ejecución se utilizó Xorg con [configuración de pantalla virtual](xorg.conf); la política administrada se leyó sin modificarla. El script principal ya registra el intento en cada salida. No es necesario ejecutar la prueba gráfica para repetir filtros y PDF.

Se aplicó [ponytail-review](../../../.agents/skills/ponytail-review/SKILL.md): [revisión de la entrega](revision-ponytail.md). Se descartó el falso positivo de foco durante la preparación asíncrona, se comprobaron los marcadores exactos de nota/reflexión y se corrigió el inventario para mostrar etiquetas visibles de campos. La medición distingue grupos plegados usando `checkVisibility()`, reiniciando los desplegables por par. No se implementaron correcciones en la aplicación.

Pendiente: diálogo nativo/impresora por política del entorno; audio con lector de pantalla; otros navegadores y dispositivos físicos; certificación WCAG/PDF etiquetado; todos los enlaces externos y respaldos corruptos; todas las combinaciones de frecuencias y recorridos laborales completos. El control de rutas verifica que ningún cambio salga de esta carpeta. No se integra a main.
