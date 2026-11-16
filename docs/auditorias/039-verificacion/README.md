# Tarea 039 · Verificación antes y después

16 de noviembre de 2026. Rama `codex/039-correcciones-botones`, destino `main`. Base `503db21`. Se aplicaron las siete correcciones aprobadas, sin cambiar el catálogo, las fuentes, arquitectura ni `.claude/`.

## Comparación P1–P8 y pie

El antes es la [auditoría 038](../038-botones/README.md). Se verificó que las huellas de `app.js`, `index.html` y `styles.css` de aquella ejecución coinciden con los archivos de main al iniciar esta tarea. Sus resultados históricos se conservan; los scripts se adaptaron a los nuevos botones de área y al guardado de taller. El después usa los mismos casos, niveles, anchos y escenarios.

| Punto | Antes | Después comprobado | Evidencia |
| --- | --- | --- | --- |
| P1 · Áreas | Desmarcar Cognición borraba situaciones 1 y 2: básica 34→22, media 32→21, superior 9→0; Trabajo 24→8 fichas ofrecidas. | Botones con `aria-expanded`; cerrar/abrir conserva el caso completo, incluidas frecuencias y acuerdos. Ahora 34→34, 32→32, 9→9 y 24→24. Al recuperar un caso, áreas con situaciones aparecen abiertas; encabezado «2 marcadas». Solo «No aplica» quita una situación. Sin migración: las áreas no se almacenan. | [Pares antes](../038-botones/filtros.json), [después](despues/filtros.json), [regresión con teclado](regresion.json). |
| P2 · Imprimir | Usaba `window.print()` sobre HTML; cuatro planes CSS tenían primera página sin texto y faltaban acciones del curso. | Imprimir usa `pdfMake.createPdf(definicionPdf()).print()`, la misma definición que Descargar, en curso, centro y Trabajo. Ventana bloqueada muestra el texto exacto solicitado. CSS ancla el diálogo al origen de la página: ocho salidas sin páginas vacías ni títulos de acciones ausentes. | [Comparación antes](../038-botones/comparacion-documentos.json), [después](despues/comparacion-documentos.json), [regresión de definición compartida/bloqueo](regresion.json), [capturas comparativas](capturas.md). |
| P3 · Taller | Cambiaba perfil global y resultados inmediatamente. El efecto sobre los casos no estaba explicado. | Solo cambia borrador; Guardar confirma y actualiza también apoyos. La ayuda exacta explica prioridad DUA y apoyos de taller para estudiantes. El alcance global se conserva. | [Cruces](despues/cruces.json), [regresión](regresion.json), [recorrido DUA](despues/dua-390-acciones.md), [pares después](despues/filtros.json). |
| P4 · Limpiar respuestas | Conservaba taller en el borrador. | Desmarca taller junto con meta, necesidades, actividad y evidencia; los resultados confirmados siguen hasta Guardar. Guardar desactiva taller. | [Antes](../038-botones/cruces.json), [después](despues/cruces.json), [regresión](regresion.json). |
| P5 · Ver acciones para esto | Solo preparaba borrador y enfocaba Guardar. | Marca la necesidad, guarda y actualiza resultados inmediatamente, enfocando Para empezar. Si los filtros de vista impiden que ese grupo exista, se limpian para mostrar los resultados de la necesidad; no se exige un segundo gesto. | [Después](despues/cruces.json), [regresión con Después + Presentar activos](regresion.json). |
| P6 · Para empezar | Título con número; definición genérica DUA repetida bajo los momentos. | Título sin número en DUA, estudiante y Trabajo. Las tres líneas son las de la tarea. DUA conserva la definición solo en la introducción; los `summary` restantes conservan conteos. | [Escenarios repetidos](despues/para-empezar.json), [inventario](despues/inventario.md), [capturas](capturas.md). |
| P7 · Desplazamientos largos | Superior a 390 px acumuló 51.948 px en un recorrido de dos casos. | Sigue siendo una observación: la tarea no prescribe una corrección específica para P7. Se repitió la medida sin presentarla como resuelta. La tabla de recorridos siguiente registra el nuevo valor. No se cambia el flujo entre casos fuera de las siete correcciones. | [Recorrido antes](../038-botones/superior-390-acciones.md), [después](despues/superior-390-acciones.md). |
| P8 · Continuar | Mismo texto para guardar, recorrer y preparar documento. | Paso 1: «Guardar y ver acciones» o «Guardar y ver apoyos»; paso 2: «Ir a tu selección (N elegidas)» o «Ir a acuerdos (N elegidos)»; paso 3: «Ver documento». Texto del botón sin un `aria-label` alternativo. En escritorio la barra conserva su visibilidad original; la navegación por pasos permanece. | [Regresión](regresion.json), [inventario](despues/inventario.md), [capturas](capturas.md). |
| Pie | Repetía guías y Cambiar ámbito. | Mantiene la frase de orientación de cada ámbito, Privacidad y «Proyecto personal sin fines de lucro. Código y fuentes.». Guías y cambio de ámbito siguen arriba. | [Regresión](regresion.json), [capturas de Trabajo](capturas.md). |


## Recorridos repetidos

| Recorrido | Ancho | Acciones | Desplazamiento acumulado | Registro | PDF descargado |
| --- | ---: | ---: | ---: | --- | --- |
| dua | 1280 | 25 | 6,600 px | [Acciones](despues/dua-1280-acciones.md) | [PDF](despues/dua-1280-curso.pdf) |
| dua | 390 | 25 | 16,235 px | [Acciones](despues/dua-390-acciones.md) | [PDF](despues/dua-390-curso.pdf) |
| basica | 1280 | 49 | 24,983 px | [Acciones](despues/basica-1280-acciones.md) | [PDF](despues/basica-1280-plan.pdf) |
| basica | 390 | 49 | 42,999 px | [Acciones](despues/basica-390-acciones.md) | [PDF](despues/basica-390-plan.pdf) |
| superior | 1280 | 58 | 28,555 px | [Acciones](despues/superior-1280-acciones.md) | [PDF](despues/superior-1280-plan.pdf) |
| superior | 390 | 58 | 53,920 px | [Acciones](despues/superior-390-acciones.md) | [PDF](despues/superior-390-plan.pdf) |

Superior también genera [centro a 1280](despues/superior-1280-centro.pdf) y [centro a 390](despues/superior-390-centro.pdf).

## Pruebas y reproducción

- `python3 scripts/validar_catalogo.py`: 240 recomendaciones, 36/36 consideraciones DUA, catálogo correcto.
- Los **20** `scripts/probar_*.cjs` terminaron con código 0: [registro completo](pruebas.json). Se actualizaron las dos expectativas que cambiaron por especificación (título sin número y una sola entrada de guía DUA).
- [Nueva regresión](../../../scripts/probar_correcciones_botones.cjs): estudiante y trabajador, Space/Enter para cerrar y abrir, caso completo intacto, No aplica, conteo y recarga; taller diferido y limpieza; barrera repetida con filtros restrictivos; textos, definición compartida para imprimir/descargar en las tres salidas y ventana bloqueada. Se ejecuta a 1280/390, claro/oscuro, sin errores JS ni desborde horizontal en las pantallas comprobadas.
- Scripts 038 repetidos: seis recorridos, inventario de 1.501 registros/variantes y 145 pares; [metadatos y huellas](despues/metodo.json). Cero errores de página en los seis recorridos. Los eventos `pdfmake.print` constan en `*-intento-impresion.json`; los eventos beforeprint/afterprint de esos archivos también pueden proceder del renderizado CSS instrumental, no prueban una impresora.
- [Comparador de los ocho PDF](despues/comparacion-documentos.json): todos los títulos del modelo presentes en vista, descarga y CSS; ninguna página CSS sin texto. Nota y reflexión DUA conservadas; los documentos del centro no contienen las iniciales ficticias IP/IP2.
- [Capturas de escritorio y teléfono, claro/oscuro y antes/después CSS](capturas.md), guardadas en `docs/marca/039-correcciones/`.

Para repetir sin sobrescribir la evidencia histórica:

```bash
export AUDITORIA_SALIDA="$PWD/docs/auditorias/039-verificacion/despues"
node docs/auditorias/038-botones/auditar.cjs
node docs/auditorias/038-botones/comprobar_cruces.cjs
python3 docs/auditorias/038-botones/comparar_documentos.py
# Con pantalla gráfica; no envía un trabajo a impresora:
DISPLAY=:39 node docs/auditorias/038-botones/probar-impresion.cjs
node scripts/probar_correcciones_botones.cjs
python3 scripts/validar_catalogo.py
```

`medir_filtros.cjs` es un módulo ejecutado por `auditar.cjs`. Se utiliza Playwright, Chromium y PyMuPDF ya instalados; no se agregan dependencias a la página. La prueba gráfica usa una pantalla virtual Xorg con la configuración de 038; la salida va a esta carpeta. No se modificaron las políticas del navegador.

## Límites y revisión

[Prueba nativa repetida](despues/impresion-nativa.json): `PrintingEnabled: false`, `DisablePrintPreview: true`. La descarga, la llamada real a pdfmake y el contenido CSS se comprobaron; no se pudo verificar el diálogo nativo ni una impresora física. La simulación de ventana bloqueada sí comprueba el mensaje exacto. Los PDF CSS no son capturas de un diálogo de impresión.

No se probó audio de lector de pantalla, otros motores, dispositivos físicos ni certificación de PDF etiquetado. Las distancias son cambios absolutos de `scrollY` automatizados, no esfuerzo humano ni altura total de página. La comprobación de títulos no es una comparación palabra por palabra de todos los PDF. Se conserva la separación entre estudiante y trabajador y la decisión del estudiante para compartir con el centro.

Revisión con [ponytail-review](../../../.agents/skills/ponytail-review/SKILL.md): [informe](revision-ponytail.md). Destino del PR: main, sin integrar.
