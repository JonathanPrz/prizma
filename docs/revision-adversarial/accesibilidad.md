# Accesibilidad comprobada y alcance de las pruebas

`medir-web.cjs` recorre Prizma con Chromium y Playwright ya instalado, usa datos ficticios y bloquea solicitudes externas. `mediciones-web.json` conserva colores, nombres, foco y geometría; `trabajo.pdf` es la descarga real. La inspección visual confirmó ambas capturas de documento y foco oculto.

Hay **10 manifestaciones reproducibles**, agrupadas en **6 causas**: oclusión móvil, nombres de acciones sin contexto, pérdida de foco, contraste del borrador, falta de estructura PDF y falta de idioma PDF. Cuatro manifestaciones comparten la barra inferior y dos comparten los nombres genéricos. No son diez defectos independientes; si «10 problemas» exige diez causas distintas, ese mínimo **no está alcanzado**. No se rellenó con fallas supuestas.

1. **Editar descripción queda parcialmente tapado.** En 390 × 844, el foco llega a `#trabajo-descripcion-editar`, centro y=778,7; el botón ocupa y=756,7–800,7 y la barra empieza en y=775. `elementFromPoint` devuelve la barra, no el control. Parte del indicador y del objetivo queda cubierta; afecta uso visual del teclado. No afirmo incumplimiento de 2.4.11 por ocultación *total* en esta instancia.
2. **El grupo del proceso laboral queda enteramente tapado al recibir foco.** El `summary` «Cómo pedir, decidir y revisar ajustes (8)» ocupa y=778,5–832,9, dentro de la barra y=775–844. WCAG 2.4.11: el componente enfocado no debe quedar totalmente oculto por contenido creado por el autor.
3. **El rol Recursos humanos queda enteramente tapado.** La casilla enfocada ocupa y=812,5–831,7; la barra tapa su centro y todo su rectángulo. Aunque la etiqueta pueda verse antes, no se ve la casilla ni su foco en ese momento. Mismo criterio 2.4.11 y misma causa que el punto 2.
4. **El documento laboral recibe foco detrás de otro botón.** `#documento-trabajo` ocupa y=796–840; encima aparece `#continuar`. La captura `foco-cubierto-390.png` muestra el botón fijo, mientras el foco registrado corresponde al botón inferior oculto. Esto impide distinguir qué acción activará Enter. Otra manifestación de 2.4.11.
5. **Quitar una acción DUA pierde el foco.** Al activar con Enter el primer `.quitar` de `#dua-seleccion`, `document.activeElement` termina en BODY (`focoQuitar`). `alternar` intenta enfocar el primer `.quitar` de la mochila cerrada. El teclado pierde su posición en el paso de selección; debe ir a la siguiente acción visible o al título del paso. WCAG 2.4.3 es el criterio a contrastar, no un fallo de teclado de todos los controles.
6. **Los botones de elegir no identifican la acción en su nombre accesible.** Por ejemplo `#elegir-dua-1-3` y `#elegir-dua-2-1-vocabulario` tienen solo «Elegir», sin `aria-label` o `aria-labelledby` que incorpore título. El árbol DOM asocia visualmente la tarjeta, pero la lista de botones y el control por voz resultan ambiguos. Es una barrera de navegación y etiquetado (2.4.6); no afirmo que el botón carezca de nombre bajo 4.1.2.
7. **Quitar en mochila tampoco identifica qué se elimina.** La misma mochila contiene `quitar-dua-1-1` y el botón de `acc-2-audio`, ambos «Quitar». Las notas sí incluyen título y persona en `aria-label`: ese mecanismo debería extenderse a quitar. Es el mismo origen de etiquetado genérico, en una acción de eliminación con otra consecuencia.
8. **Borrador casi ilegible en vista oscura.** `#hoja .aviso-apoyos` computa texto `rgb(17,17,17)` sobre `rgb(34,44,64)`: contraste aproximado **1,35:1**, inferior a 4,5:1 para texto normal (WCAG 1.4.3). Se ve en `documento-390.png`. La hoja fija texto negro, pero el aviso hereda el panel oscuro. No se extrapola este defecto al PDF de fondo blanco.
9. **El PDF no tiene estructura etiquetada.** `pdfinfo.txt` dice `Tagged: no`; no aparece `/StructTreeRoot`. Los títulos, listas y encabezados de tabla se dibujan sin estructura semántica accesible en el archivo descargado. La vista HTML sí usa encabezados y tablas; no corrige el documento que se comparte. WCAG 1.3.1 es pertinente. No se probó con un lector de pantalla real y no se afirma que sea imposible extraer texto.
10. **El PDF no declara idioma.** La inspección binaria del PDF no encuentra `/Lang` y la configuración `definicionPdf` solo fija título y creador. Un lector no puede determinar programáticamente español desde el documento (WCAG 3.1.1). Es distinto de añadir etiquetas estructurales: requiere metadato de idioma además de una estructura útil.

## Reproducción

Desde la raíz, con Chromium disponible:

```bash
CHROMIUM_BIN=/usr/bin/chromium node docs/revision-adversarial/medir-web.cjs
pdfinfo docs/revision-adversarial/trabajo.pdf
rg -a '/Lang|/StructTreeRoot|/MarkInfo' docs/revision-adversarial/trabajo.pdf
```

El script usa `CHROMIUM_BIN` si existe; sin ella utiliza el Chromium de Playwright. La ruta anterior es solo el comando usado aquí. Las aperturas instrumentales de `details` sirven para exponer y medir controles; no se cuentan como prueba de navegación natural. La secuencia Tab se ejecuta después de recargar, con el estado persistido, sin alterar el DOM de navegación.

No observé desborde horizontal de la **página** en las mediciones de 320, 390 y 1280 px. Las tablas del documento tienen desplazamiento propio, excepción pertinente para tablas. Los botones elegidos conservaron foco; los diálogos probados lo devolvieron al origen al cancelar. No conté casillas nativas menores de 24 px como fallo de tamaño: las etiquetas amplían el objetivo y hay excepciones de espaciado. No conté el salto h2→h4 por sí solo como incumplimiento sin demostrar pérdida de relaciones.

Faltan NVDA/JAWS/VoiceOver, Safari y Firefox, zoom real de navegador al 400%, navegación táctil y una auditoría completa WCAG. El ancho de 320 px no equivale por sí solo a esa prueba de zoom.
