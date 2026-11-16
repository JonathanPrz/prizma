# Verificación 036 · Educación y Trabajo

Se implementó la especificación completa de [arquitectura](../../arquitectura.md) sobre `main` en `412edd0`. Los archivos de datos, fuentes, arquitectura y `.claude/` permanecen intactos. Esta entrega cambia la navegación y la presentación; conserva las claves de almacenamiento y el formato de respaldo v2, ampliado con `ambito` validado.

## Antes y después por problema

| Código | Antes, auditoría 034 | Después | Evidencia |
| --- | --- | --- | --- |
| [A1] Hecho | Entrada directa al curso y DUA sin definición | Inicio con dos botones de ámbito, elección recordada; definiciones breves y guías con «Qué es»/uso | Capturas `*-01-inicio`, `index.html`, prueba de teclado y migración |
| [A2] Hecho | Aviso de estudiantes al escribir en Trabajo | Aviso por ámbito; Trabajo habla de personas trabajadoras, reserva y art. 154 ter. Reconocimientos separados, manteniendo la clave antigua para Educación | Capturas `rrhh-*-02-privacidad`; prueba de cambio de ámbito después de aceptar privacidad educativa |
| [A3] Hecho | Grupos extensos abiertos, salidas al final | Indicador sticky con enlaces y `aria-current="step"`; barra inferior bajo 40 rem con conteo, espacio libre inferior y movimiento reducido. Grupos plegados con conteo después de «Para empezar» | Tabla de distancias, capturas y `probar_arquitectura.cjs` |
| [M1] Hecho | Dos casillas de práctica separadas sin explicación conjunta | Taller en paso 1 DUA, práctica profesional en caso; ayudas exactas de la especificación | HTML; el recorrido IP sigue sin marcar taller |
| [M2] Hecho | Nivel global sin confirmación | Se mantiene global y visible solo en Educación; confirmación exacta con N casos con datos. Cancelar revierte el selector y conserva el estado | Prueba de cancelar/aceptar. Las selecciones se conservan en el estado; la elegibilidad de lo que se muestra sigue dependiendo del nivel |
| [M3] Hecho | Voz familiar también en superior | «¿Qué dice el estudiante?» y «Qué dice el estudiante» en página y PDF de superior | Pruebas y plantillas de documento |
| [M4] Hecho | Documento incompleto sin señal de borrador | «Borrador: acuerdos sin completar» arriba de vista y primera página PDF cuando un caso incluido no completa acuerdos; también en centro de práctica | PDF IP y pruebas de modelos general/centro completos e incompletos |
| [M5] Hecho | Varios nombres para el mismo tipo | «Apoyos para un estudiante», rótulos de acceso/objetivos/DEC, ajustes razonables en superior y ajustes en Trabajo; términos internos fuera del texto presentado | Lista de términos prohibidos en prueba sobre HTML y las 240 acciones/apoyos/ajustes; modelos PDF |
| [M6] Hecho | Pie educativo en Trabajo | Pie y guías por ámbito, privacidad y «Cambiar ámbito» en barra y pie | Capturas laborales y comprobaciones de visibilidad |
| [M7] Hecho | Conteo de acceso interpretado como total de todo | Conteo en cada grupo; total «N adecuaciones de acceso sugeridas». En superior usa «N ajustes razonables sugeridos», conforme al glosario | Inventario generado, app.js y conteos del catálogo |
| [M8] Hecho | Guía principalmente procedimental | Explicaciones exactas de cada tipo antes de los seis pasos; definición bajo grupos; guía laboral conserva obligaciones vigentes completas | DOM e inventario; pruebas conservan los seis pasos anteriores |
| [B1] Hecho | Paso 1/guía sin adaptación de parvularia | `data-voc` en paso 1 y guía DUA: experiencia de aprendizaje | Prueba real en Chromium |
| [B2] Hecho | Enlaces de guía en distintas posiciones | Una entrada bajo la definición de cada pestaña/ámbito y su pie. Una sola guía de qué es y uso | HTML y pruebas de guías |
| [B3] Hecho | Objetivos plegable sin acciones en P/S | Bloque oculto en P/S y línea exacta de explicación fuera del bloque | Inventario P/S y lógica de nivel |
| [B4] Hecho | Mochila y borrado mezclaban datos | Mochila, contador y borrado por ámbito. Respaldo único lo explica e incluye `ambito`; importar conserva/migra los datos de ambos ámbitos | Pruebas de mochila, recarga y borrado independiente; respaldo anterior y actual |

El glosario se aplica a los textos de la interfaz y documentos, sin modificar `data/`. El paso «No pidas el diagnóstico ni la ficha clínica» del catálogo se presenta como «No pidas el diagnóstico ni los antecedentes clínicos» para evitar «ficha» también en ese texto. No se alteran notas ni citas de las personas usuarias.

## Recorridos comparables

Se volvió a ejecutar [auditar.cjs de 034](../034-arquitectura/auditar.cjs), adaptado a la nueva estructura, con los mismos casos ficticios JP/IP/AB, situaciones, guías, ajustes elegidos y documentos. Escribe la nueva evidencia en esta carpeta y las capturas en `docs/marca/036-arquitectura/`; conserva los resultados originales de 034. Las nuevas entradas de ámbito y aperturas de grupos cuentan como clics reales. En escritorio se usa el indicador para acuerdos; en teléfono, la barra inferior. En básica se usa el acceso documental al final del caso en vez de pasar por la mochila.

La distancia acumulada es la suma de cambios absolutos de `scrollY` entre acciones, igual que en 034: incluye desplazamientos de foco, plegado y Playwright. No mide gestos humanos ni tiempo de una persona. La comparación refleja el recorrido con los nuevos controles, no un ensayo con usuarios ni una estimación de altura de página. Los clics incluyen el enfoque para escribir y dos activaciones para elegir nivel.

| Recorrido | Ancho | Antes px | Después px | Reducción | Clics antes / después hasta vista |
| --- | --- | --- | --- | --- | --- |
| basica | 1280 | 7975 | 6988 | 12.4% | 25 / 26 |
| basica | 390 | 13130 | 11217 | 14.6% | 25 / 26 |
| instituto | 1280 | 9176 | 5761 | 37.2% | 18 / 20 |
| instituto | 390 | 17897 | 10414 | 41.8% | 18 / 20 |
| rrhh | 1280 | 6594 | 4162 | 36.9% | 20 / 20 |
| rrhh | 390 | 12363 | 6804 | 45.0% | 20 / 20 |

Datos de cada acción: [recorridos.json](recorridos.json). [Huellas y método](metodo.json). [Inventario actualizado](inventario-observado.md). [Conteos](conteos.md).

## Capturas y documentos

- basica-1280: [inicio](../../marca/036-arquitectura/basica-1280-01-inicio.png), [documento](../../marca/036-arquitectura/basica-1280-04-documento.png), [PDF](basica-1280-documento.pdf).
- basica-390: [inicio](../../marca/036-arquitectura/basica-390-01-inicio.png), [documento](../../marca/036-arquitectura/basica-390-04-documento.png), [PDF](basica-390-documento.pdf).
- instituto-1280: [inicio](../../marca/036-arquitectura/instituto-1280-01-inicio.png), [documento](../../marca/036-arquitectura/instituto-1280-04-documento.png), [PDF](instituto-1280-documento.pdf).
- instituto-390: [inicio](../../marca/036-arquitectura/instituto-390-01-inicio.png), [documento](../../marca/036-arquitectura/instituto-390-04-documento.png), [PDF](instituto-390-documento.pdf).
- rrhh-1280: [inicio](../../marca/036-arquitectura/rrhh-1280-01-inicio.png), [documento](../../marca/036-arquitectura/rrhh-1280-04-documento.png), [PDF](rrhh-1280-documento.pdf).
- rrhh-390: [inicio](../../marca/036-arquitectura/rrhh-390-01-inicio.png), [documento](../../marca/036-arquitectura/rrhh-390-04-documento.png), [PDF](rrhh-390-documento.pdf).

Las capturas adicionales en `docs/marca/036-arquitectura/` muestran privacidad, práctica, decisión de compartir, resultados laborales y Trabajo en claro/oscuro a ambos anchos.

## Pruebas y límites

- `python3 scripts/validar_catalogo.py`: catálogo correcto, 240 elementos y 36 consideraciones DUA.
- Todos los 18 `scripts/probar_*.cjs`, incluido `probar_datos_reales.cjs` y el nuevo `probar_arquitectura.cjs`: pasan. Se adaptaron los dobles de DOM y las expectativas de navegación/textos de pruebas anteriores a la estructura aprobada; se conserva la comprobación de sus seis instrucciones.
- Seis recorridos completos con descargas PDF, sin errores JavaScript observados ni desborde horizontal a 390/1280. PDF del centro comprobado con borrador en primera página; casos con acuerdos completos sin borrador.
- Navegador real en ambos temas/ancho: inicio con teclado, Escape y retorno del foco, selector de nivel y cancelación, mochila y borrado por ámbito, persistencia al recargar, almacenamiento denegado. Sin dependencias nuevas.
- Revisión [ponytail-review](ponytail-review.md) completada.

No se probó con una persona usando lector de pantalla, otros motores de navegador, dispositivos físicos ni impresión en papel. Se comprobaron controles semánticos, nombres accesibles y foco con Chromium; esto no equivale a una certificación WCAG completa. Tampoco se ejecutó cada ruta posible de error de red/archivos. No se cambió el nombre ni el catálogo.
