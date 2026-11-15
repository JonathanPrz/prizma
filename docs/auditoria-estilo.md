# Auditoría de accesibilidad y estilo de Prizma

Fecha: 15 de noviembre de 2026. Página auditada: https://jonathanprz.github.io/prizma/. Base local: `1c30404` (main al comenzar). Alcance: página de selección publicada y su vista previa; revisión de `AGENTS.md`, `docs/diseno.md`, HTML, CSS y eventos que reconstruyen los controles. La implementación final usa la dirección **B · Panel de trabajo**, elegida por el dueño. Conserva el logo de teselas, los tres propósitos y todos los textos y opciones existentes.

Se distinguen hallazgos de accesibilidad de decisiones visuales. Una preferencia estética no es un incumplimiento WCAG. La sección de perfil de `docs/diseno.md` está desactualizada frente a la tarea 002 integrada, cuyas preguntas actuales se conservan.

## Método y límites

- Chromium, escritorio 1440 × 1100 y teléfono 390 × 1000 para capturas. La medición inicial de posiciones usó 1440 × 1000 y 390 × 844. Contexto limpio: sin perfil ni selección, momento «Antes», los tres propósitos disponibles, catálogo de 42 registros y 11 acciones visibles al iniciar.
- Página publicada real para el «antes», no una recreación. Propuestas locales con el mismo catálogo y estado. Se verificó igualdad del texto del DOM, descontando los nuevos enlaces de navegación y el selector de tema.
- axe-core 4.14.0, etiquetas WCAG 2 A/AA, 2.1 A/AA y 2.2 AA; pruebas manuales de teclado y medición de contraste sRGB. El análisis automático no reemplaza la revisión manual ni acredita conformidad completa.
- Se probaron ambos temas, reflujo a 320/390/768/1024/1440 px, vocabulario de parvularia, texto al 200 %, espaciado de texto y descarga de documentos. A 320 px se aproxima la anchura CSS exigida por reflujo; no se presenta como una prueba completa de todos los escenarios de zoom al 400 %.
- Las fuentes externas preexistentes necesitaron `ignoreHTTPSErrors` en el navegador de pruebas por el certificado del entorno. No se agregó ninguna fuente, dependencia ni script remoto a la aplicación; axe se ejecutó como herramienta temporal externa al repositorio.

## A. Accesibilidad WCAG 2.2 AA

Hallazgos ordenados por impacto en el uso. Referencia: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

### A1 · Alta · El foco desaparece al activar filtros y elegir acciones

**Evidencia.** En la página publicada, enfocar el primer propósito con teclado y pulsar Enter deja `document.activeElement` en `BODY`. El Tab siguiente vuelve al primer filtro en vez de continuar al siguiente. «Elegir» también elimina el botón enfocado al reconstruir las tarjetas; «Quitar» reconstruye la selección. Se verificó el flujo de los eventos, no solo el estilo del foco.

**Criterios afectados:** 2.4.3 (orden del foco) y continuidad del indicador de 2.4.7. Los controles sí se pueden activar con teclado; no se etiqueta el problema como una ausencia total de soporte de teclado.

**Corrección aplicada.** Identificadores estables para los botones y recuperación del foco después del renderizado. Al quitar una acción se enfoca otro «Quitar» disponible; si no quedan acciones, el título «Mi selección». Los destinos de navegación admiten foco programático con `tabindex="-1"`, sin añadirlos al recorrido normal de Tab. Cambio pequeño y localizado en `app.js`.

### A2 · Alta · Los límites personalizados de los campos no llegan a 3:1

**Evidencia.** El borde `#d6dbe8` de `select` y `textarea` frente a blanco tiene **1,39:1**. En oscuro, `#2c3558` frente a `#171d36` también tiene **1,39:1**. El interior y el entorno no aportan una separación de 3:1. Los bordes fueron personalizados por el autor; no se trata de controles íntegramente sin modificar del navegador.

**Criterio:** 1.4.11 (contraste no textual). La observación se refiere a límites necesarios para identificar campos, no a todas las líneas decorativas de la página.

**Corrección aplicada.** Variable independiente `--borde-control`: **3,80:1** frente a blanco y **5,00:1** frente a la superficie oscura. Se usa también en momentos, filtros y controles secundarios. Las líneas decorativas mantienen un peso menor. Las variantes B conservan el mismo borde y se comprobaron sobre sus fondos propios.

### A3 · Media · La navegación a «Mi selección» exige recorrer todo el catálogo en teléfono

**Evidencia.** Con 390 × 844 y estado limpio, «Mi selección» comienza aproximadamente a **6.869 px** del inicio. Solo existe un salto hacia las acciones. No hay un atajo visible hacia lo elegido. Esto es una barrera de uso y recorrido repetido; por sí sola, la distancia no demuestra incumplimiento WCAG.

**Corrección aplicada.** Navegación con enlaces nativos a perfil, acciones y selección. En teléfono permanece visible al pie; se reserva espacio para que no tape el contenido y se comprueba el foco frente a la barra (2.4.11). En escritorio queda en la cabecera. No se altera el orden del catálogo ni se oculta contenido.

### A4 · Media · La adaptación de tema no admite preferencia explícita

**Evidencia.** La página publicada sigue únicamente `prefers-color-scheme`. No permite que una persona elija claro u oscuro sin cambiar la configuración del equipo. Es una mejora de personalización solicitada, no un fallo WCAG independiente.

**Corrección aplicada.** Selector nativo con etiqueta «Tema» y opciones «Claro», «Oscuro» y «Según mi dispositivo» (por defecto). La preferencia se guarda aparte del perfil bajo `prizma.tema`, con `try/catch`. Un script breve en el head valida la preferencia y establece `data-tema` antes de cargar las hojas de estilo. Las consultas de sistema siguen funcionando al volver al modo automático, también sin recargar.

### Comprobaciones sin hallazgos en el alcance revisado

- La página tiene `lang="es"`, encabezados, regiones, etiquetas y fieldsets. Las tarjetas usan botones reales con `aria-pressed`; los mensajes de conteo y respaldo conservan `aria-live`.
- El SVG decorativo está oculto al árbol accesible. Los propósitos tienen nombres y los estados elegidos no dependen solo del color: el botón cambia de texto/estado y en la propuesta el filtro también usa subrayado y borde.
- Los botones principales son de al menos 44 px de alto. Las etiquetas de casillas aportan áreas activas de al menos 32 px en escritorio y 40 px en teléfono; el control de archivo conserva etiqueta y foco visible. No se cuenta solo el dibujo de la casilla.
- En las capturas iniciales axe no encontró infracciones automáticas; los problemas A1 y A2 requirieron pruebas manuales. En A y B tampoco encontró infracciones automáticas en los cuatro estados de captura de cada dirección. La vista previa de B se comprobó además con selección y notas.
- El contraste de texto y los colores de propósito se comprobó también con los filtros activos. Las exenciones de controles desactivados no se usaron para justificar texto activo.

### Contraste de la propuesta elegida

Ratios calculados con luminancia relativa sRGB, redondeados a dos decimales. Texto normal: mínimo 4,5:1; indicador/límite necesario: mínimo 3:1. Se mantienen los tres colores de propósito originales y sus variantes oscuras.

| Uso | Claro: par medido | Ratio | Oscuro: par medido | Ratio |
|---|---|---:|---|---:|
| Texto principal | `#18213f` / `#ffffff` | 15,81 | `#e8ecf8` / `#192133` | 13,61 |
| Texto secundario sobre fondo | `#4a5372` / `#eef1f7` | 6,70 | `#b6bfd5` / `#0d1424` | 9,98 |
| Motivar | `#b0145a` / `#ffffff` | 6,79 | `#ff7fb0` / `#192133` | 6,82 |
| Presentar | `#00727d` / `#ffffff` | 5,67 | `#4fd1dc` / `#192133` | 8,79 |
| Mostrar | `#5a33a8` / `#ffffff` | 8,49 | `#b79cff` / `#192133` | 7,05 |
| Borde de campo | `#7b8395` / `#ffffff` | 3,80 | `#8490a8` / `#192133` | 5,00 |

La tabla corresponde a B, la implementación final. A queda como referencia visual de la primera propuesta y mantiene su registro de comprobación. El foco conserva la variable original de enfoque en ambos temas.

## B. Calidad visual

### V1 · Alta · El formulario no distingue grupos de decisión

**Evidencia.** «Nivel» ocupa solo la mitad de la retícula original y las casillas se distribuyen como texto corrido en todo el ancho. Las dos preguntas quedan una debajo de otra, con líneas de distinta longitud. Falta un contenedor que distinga la preparación de la clase del catálogo.

**Corrección aplicada en B.** Perfil en un panel propio a la izquierda, acciones en el centro y selección a la derecha. Las casillas se alinean en filas dentro del perfil. En pantallas intermedias se usan dos columnas y en teléfono una, con áreas táctiles cómodas. No se vuelve obligatorio ni se colapsa el formulario.

### V2 · Alta · La pregunta de la meta se fragmenta en filas artificiales

**Evidencia.** `.meta` usa `display:grid`, pero «clase», marcada con `data-voc`, es un hijo directo del label. La pregunta, la palabra variable y el signo de cierre se convierten en elementos de retícula distintos. La etiqueta mide cerca de 197 px en la base y presenta huecos que parecen contenido incompleto.

**Corrección aplicada.** Agrupar solo el texto de la pregunta en un span, dejando la palabra variable dentro. La pregunta queda unida, la etiqueta sigue asociada al textarea y el vocabulario de parvularia se conserva. No se reescribe ningún texto.

### V3 · Media · Hay poca diferencia entre niveles de lectura

**Evidencia.** La misma familia pesada aparece en marca, titular y encabezados. «Tu clase» y los títulos de acciones compiten sin una separación editorial clara. En escritorio, la bajada queda siempre debajo del titular, dejando una zona derecha sin función.

**Corrección aplicada en B.** Atkinson en toda la interfaz, con una cabecera compacta y una escala menor en títulos auxiliares. La jerarquía se apoya en paneles y columnas funcionales. La alternativa A usa Georgia en títulos; se conserva únicamente en sus capturas de comparación.

### V4 · Media · El ritmo de las tarjetas y los filtros parece uniforme

**Evidencia.** Bordes de poco contraste se repiten en filtros, controles, evidencias y contenedores. Las tarjetas densas juntan pasos, explicación y acciones con pesos similares. La condición de selección se reconoce, pero la lectura interna puede jerarquizarse mejor.

**Corrección aplicada.** Distinguir borde de control y línea decorativa; más separación entre pasos; título más reconocible, metadatos pequeños pero legibles, evidencia en una etiqueta discreta y fuentes tras una separación. Los tres colores identifican propósitos, sin convertirlos en fondos de secciones ni decorar toda la pantalla.

### V5 · Media · La selección parece un bloque de controles sin estructura

**Evidencia.** Exportación, respaldo y borrado aparecen con la misma proximidad. El panel blanco se parece a otra tarjeta. En escritorio tiene scroll propio; en móvil se pierde al final del contenido.

**Corrección aplicada.** Panel con encabezado y borde superior, botón del documento con mayor peso, borrado separado y textos de ayuda con medida acotada. El scroll propio queda solo en escritorio, con espacio para foco; en teléfono el panel fluye y se alcanza desde la navegación fija.

### V6 · Baja · El fondo frío y la tipografía crean un tono genérico de formulario

**Evidencia.** La base usa un fondo azulado y numerosas superficies de borde similar. Es coherente, pero comunica una utilidad técnica más que una herramienta docente de lectura y elección. Es una valoración de diseño, no una prueba de usabilidad con docentes.

**Respuesta visual elegida.** El dueño prefirió B: fondo gris azulado y enfoque operativo, con retícula compacta y menos peso de cabecera. A ofrece la alternativa de papel cálido y títulos editoriales. La preferencia del dueño decide entre ambas; no se presenta como una conclusión de usabilidad con docentes.

## Dos direcciones y decisión

| Dimensión | A · Cuaderno editorial | B · Panel de trabajo |
|---|---|---|
| Carácter | Cálido, sereno, lectura pedagógica | Preciso, operativo, consulta rápida |
| Tipografía | Georgia en títulos; Atkinson en uso y contenido | Atkinson en toda la interfaz |
| Escritorio | Perfil en dos columnas, catálogo de dos tarjetas, selección lateral | Perfil estrecho a la izquierda, catálogo central de una columna, selección derecha |
| Color | Fondo papel cálido y superficies blancas | Fondo gris azulado, superficies rectas |
| Densidad | Separación por bloques y ritmo de lectura | Más información simultánea, mayor densidad |
| Teléfono | Una columna, navegación accesible al pie | Una columna y navegación al pie; pierde parte de su ventaja de panel |
| Riesgo | Más recorrido vertical; los atajos no sustituyen una futura prueba de uso | Tres columnas cargan el campo visual; perfil más estrecho |

**Elección final: B, indicada por el dueño.** Perfil, catálogo y selección quedan visibles a la vez en escritorio. Se mantiene Atkinson en toda la interfaz y una cabecera compacta. Solo B se carga como implementación; A queda como referencia visual. No hay interruptor A/B.

**Ajustes solicitados:** los tres filtros de «¿Para qué?» son botones compactos en una fila cuando hay espacio, con `flex-wrap` para pasar a otra línea. A 390 px se apilan; a 1440 px comparten fila, también cuando están activos. El logo de la cabecera mide **2,75 rem (44 px con la raíz de 16 px)** en todos los tamaños, sin alterar su geometría ni los colores.

Las casillas legibles requieren espacio en teléfono; el acceso a la selección se mantiene mediante navegación persistente. Se conservan el selector de tema, la restauración de foco, los datos, respaldos y PDF.

### Capturas

Se conservan ocho imágenes por estado/dirección: entrada y zona de acciones, escritorio/teléfono, claro/oscuro. Sin datos personales ni selección predefinida.

| Estado | Escritorio claro | Teléfono claro | Escritorio oscuro | Teléfono oscuro |
|---|---|---|---|---|
| Publicado, antes | [Entrada](marca/antes/escritorio.png) | [Entrada](marca/antes/telefono.png) | [Entrada](marca/antes/escritorio-oscuro.png) | [Entrada](marca/antes/telefono-oscuro.png) |
| A, referencia | [Entrada](marca/direccion-a/escritorio.png) | [Entrada](marca/direccion-a/telefono.png) | [Entrada](marca/direccion-a/escritorio-oscuro.png) | [Entrada](marca/direccion-a/telefono-oscuro.png) |
| B, implementada | [Entrada](marca/direccion-b/escritorio.png) | [Entrada](marca/direccion-b/telefono.png) | [Entrada](marca/direccion-b/escritorio-oscuro.png) | [Entrada](marca/direccion-b/telefono-oscuro.png) |

Las capturas de tarjetas y filtros usan el prefijo `acciones-` en las mismas carpetas. Se incluyen fichas con los tres colores de propósito en el catálogo; las imágenes no sustituyen el recorrido completo de teclado.

## Implementación, pruebas y revisión

- `styles.css`: dirección B, retícula adaptable, contraste, foco, navegación móvil, temas explícitos/automático y conservación de la hoja blanca para impresión. Variables de colores y fuentes en `:root`; paleta del logo sin cambios.
- `index.html`: envoltorios mínimos de cabecera y pregunta de la meta, enlaces de sección, selector etiquetado y lectura temprana de tema. Los IDs usados por el resto de la aplicación se conservan.
- `app.js`: únicamente selección/persistencia del tema y restauración de foco tras reconstruir botones. Sin cambios en filtrado, datos, contenido, respaldo o PDF.
- Prueba de 10 combinaciones entre dispositivo claro/oscuro y preferencia ausente/clara/oscura/automática/inválida. Verificación del atributo antes de solicitar CSS, persistencia tras recarga y adaptación del sistema en vivo. Lectura y escritura de localStorage bloqueadas sin romper la página.
- Pruebas de teclado: skip link, enlaces a selección, filtros, elegir/quitar y selector nativo. Controles revisados frente a la barra inferior para que el foco no quede tapado. Comprobación de estilos con colores forzados y movimiento reducido.
- Notas, exportación JSON, vista previa, descarga PDF y estilos de impresión comprobados en Chromium. Se mantuvieron catálogo y textos, comprobados contra el DOM publicado. Validador de catálogo y prueba existente de singular/fecha local correctos.
- B se volvió a capturar directamente desde su implementación en `styles.css`, sin estilos temporales, en claro/oscuro y escritorio/teléfono. Los tres filtros comparten fila a 1440 px, envuelven a 800 px y se apilan a 390 px; logo calculado de 44 × 44 px en ambos temas. A conserva las capturas de la alternativa original.

**Revisión `ponytail-review`:** se leyeron diff, selectores, consumidores de IDs y funciones que reconstruyen controles. Se revisaron recorrido de teclado, preferencia guardada como entrada externa y usos de los estilos de impresión. Se corrigió la pérdida de foco detectada en la base y se evitó una barra de diálogo fija en teléfono. La revisión final se repitió sobre B: se eliminaron la tipografía editorial y una regla móvil de tamaño de logo redundante, se revisaron los puntos de cambio de retícula y se verificaron filtros activos, tema, foco e impresión. No quedaron hallazgos nuevos que bloquearan el PR. Carga supuesta: usuarios independientes de una página estática; no hay estado de tema compartido entre procesos.

### Qué no se probó

Lectores de pantalla reales, Safari, Firefox, dispositivos físicos, impresión en papel, zoom del navegador en todas sus combinaciones ni una prueba de usabilidad con docentes. No se certifica conformidad completa WCAG 2.2 AA. No se publicó el rediseño ni se integró a main; la evaluación del antes corresponde a la página publicada durante esta consulta.
