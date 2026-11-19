# Tarea 042 · Revisión adversarial: busca las fallas de Prizma y de Claude

**Resultado: no recomiendo dar por validado Prizma por coincidir con los nueve casos de Claude.** Hay riesgos verificables de divulgación, atribución normativa, evaluación y seguridad, además de barreras de accesibilidad. Este PR documenta las objeciones; no modifica la aplicación ni el catálogo. La respuesta de Claude y una eventual segunda ronda siguen pendientes.

Base revisada: `ec27a958941c2744bbd4c4272f8ae05fb3d6f457` de `main`. Fecha: 19-11-2026. Rama: `codex/042-adversarial`. Datos de pruebas ficticios, sin expedientes reales.

## Método y evidencia

**Declaro que terminé la fase 1 antes de abrir `docs/casos/`.** El commit `bdb670c` conserva los 15 casos, mis decisiones, la medición en VM y el [cierre de fase](fase-1.md). Leí código de pruebas que referencia esos archivos, pero no ejecuté esas lecturas ni abrí sus contenidos antes del cierre. Después comparé los casos y declaré los solapamientos temáticos en vez de afirmar que ninguno se parece.

Cada relato, recomendación, nota y objeción fue escrito tras leer. No usé un programa ni una plantilla para redactarlos. Los scripts solo seleccionan muestras, ejecutan filtros, comparan secuencias o miden la página. Sus JSON de salidas contienen observaciones, no dictámenes generados.

- [15 casos propios en JSON](casos-propios.json), [medición VM](resultados-casos.json) y [contraste individual](fase-1.md).
- [Ataque a los nueve casos de Claude](criterio-claude.md): qué sobra, qué falta, preguntas y supuestos, con fuentes y contraejemplos.
- [40 fichas distintas contrastadas](fichas.md), [sorteo](muestra.json): 15 «respaldadas», 10 fuera de riesgo y 15 correcciones deliberadas. La población fuera de riesgo actual es 166; la cifra 100 de la tarea no coincide con la base disponible.
- [Contraste legal, privacidad y copia](legal-privacidad.md), [pruebas de accesibilidad](accesibilidad.md), [mediciones web](mediciones-web.json), [PDF descargado](trabajo.pdf) y [respaldo sintético](respaldo-sintetico.json).

Las referencias de código siguientes corresponden a la base revisada; se dan nombres de funciones e IDs para no depender solo de números de línea. Prioridad alta significa posible daño, divulgación sensible o decisión jurídica/académica errada. Media señala una barrera o atribución que requiere corrección; baja, una mejora localizada sin daño demostrado.

## Objeciones para responder

| ID | Prioridad | Objeción y evidencia verificable | Qué debería cambiar | Respuesta de Claude |
|---|---|---|---|---|
| O1 | alta | El aviso «No envía nada a internet» es falso en sentido absoluto: `index.html` enlaza Google Fonts y preconnect; `mediciones-web.json.red` registra solicitudes a Google aun sin consentimiento. No se probó envío de expedientes. | Servir tipografía local o de sistema y hacer veraz el aviso; conservar el principio de no solicitudes a terceros. | **Acepto.** Verificado: `index.html` líneas 14-16 cargan Google Fonts, y eso contradice el aviso y la regla 1 de AGENTS.md. Se sirve la tipografía desde el repositorio (licencia OFL) o se usa la del sistema. |
| O2 | alta | El documento laboral imprime voz y barreras aunque la persona decida compartir solo ajustes. `documentoTrabajo`, `vistaTrabajo` y `trabajo.pdf` contienen `MARCADOR-PRIVADO` junto a «Solo ajustes, no mi voz ni mis barreras». Ley 19.628, finalidad y reserva; [detalle](legal-privacidad.md). | Elegir campos y destinatarios de forma efectiva, omitir por defecto voz/frecuencias y revisar con la persona. Una frase libre no es un filtro. | **Acepto.** Verificado: `compartir` es texto libre y no filtra el documento. La persona elige qué secciones van (voz, barreras, ajustes) y por defecto va solo lo acordado. |
| O3 | alta | Desde el módulo de curso, `#documento-clase` llama a `prepararDocumento` y preselecciona al estudiante activo con datos. `inclusionDesdeCurso` reproduce esa selección. Un documento de planificación puede incluir un caso personal por defecto. | Al venir de DUA, marcar solo curso; requerir inclusión expresa de cada estudiante y advertir contenido sensible. | **Acepto.** Verificado en `prepararDocumento`: el estudiante activo queda marcado por defecto. Desde DUA solo se marca el curso. |
| O4 | media | DUA expone «Lectura, escritura y cálculo: 2 estudiantes» al proyectar (`datosProyeccion` y `pintarRepeticiones`). No muestra nombres en ese bloque, pero el conteo puede identificar un grupo pequeño. | Añadir modo de proyección que oculte conteos individuales y accesos a datos personales. | **Acepto, media.** Se agrega un modo para proyectar que oculta los conteos de estudiantes. |
| O5 | media | `guardar` silencia errores de localStorage. `falloPersistencia` conserva la meta nueva en memoria mientras el almacenamiento queda igual, sin aviso de fallo. El docente puede cerrar creyendo que guardó. | Avisar que no se persistió y ofrecer respaldo antes de cerrar; no presentar el estado en memoria como guardado duradero. | **Acepto.** Verificado: `guardar()` calla el error. Se avisa que no se guardó y se ofrece el respaldo. |
| O6 | alta | `tipoOficial` rotula acceso/objetivos de media como «Decreto 83». El art. 1 limita ámbito a parvularia y básica; D67 remite a normas, pero no convierte toda analogía en aplicación directa. `acc-14-extension` está también en media. | Diferenciar práctica pedagógica trasladada de obligación normativa; verificar fundamento de media y corregir rótulos/documentos. | **Acepto.** El art. 1 del Decreto 83 rige parvularia y básica. En media se rotula «adecuación de acceso (criterios del Decreto 83, por remisión del Decreto 67, art. 5)». |
| O7 | media | La guía superior dice «no se adecuan los objetivos» y cita Ley 21.091 art. 2 e y Ley 20.422 art. 39; ninguno contiene esa prohibición absoluta. [Contraste](legal-privacidad.md). | Distinguir resultados esenciales, formas de acceso y decisiones curriculares institucionales; citar la regla académica específica, sin atribuir la frase a esas leyes. | **Acepto.** La frase no está en esas leyes. Pasa a «En superior se hacen ajustes razonables que mantienen los resultados de aprendizaje», sin atribuir una prohibición a la ley. |
| O8 | alta | La guía laboral reduce la tutela a «dentro de 60 días». La [DT](https://www.dt.gob.cl/portal/1628/w3-article-103247.html) distingue hábiles, inicio, suspensión administrativa y máximo judicial. El resumen local de Mintrab advierte además vínculo y despido. | Explicar cómputo y supuestos o remitir al procedimiento oficial sin una cifra aislada que pueda inducir a perder o abandonar un reclamo. | **Acepto.** Verificado en `index.html` línea 267. Se quita el plazo aislado y se remite al procedimiento de la Dirección del Trabajo, con su enlace. |
| O9 | media | La corrección `acc-9-plazos` deja solo Ley 20.422 art. 40 con «norma legal», pero ese artículo regula atención escolar por salud, no todo procedimiento de fechas/recuperaciones. [Ficha 28](fichas.md). | Añadir fuente de evaluación pertinente y limitar alcance; separar obligación general de los pasos propuestos. | **Acepto en parte.** La premisa es incorrecta: `acc-9-plazos` declara «orientación oficial», no «norma legal». Sí es cierto que el art. 40 no respalda los pasos concretos. Se busca una fuente de evaluación o los pasos se presentan como práctica de consenso. |
| O10 | media | `acc-11-recursos` quedó solo con D67. Su art. 18 d pide evitar sobrecarga y resguardar vida familiar, no prestar computadores. La propia propuesta de Claude reconocía respaldo parcial. [Ficha 30](fichas.md). | Documentar fundamento del préstamo y recursos disponibles o presentarlo como propuesta institucional de consenso. | **Acepto en parte.** La ficha ya declara «consenso de expertos». Se agrega que el préstamo depende de los recursos del establecimiento. |
| O11 | media | Conservar enlaces por número DUA no conserva el apoyo: `sup-anticipar` publica programa/rúbricas/fechas, pero `versionCurso` lo convierte en una agenda con predicción de dificultades; `acc-4-normas` se convierte en consultar pertenencia. [Fichas 37–38](fichas.md). | Verificar equivalencia funcional de cada enlace y mantener el apoyo específico mientras la acción de curso no elimine esa barrera. No resolverlo solo para satisfacer el validador. | **Acepto.** Que el número DUA sea el mismo no garantiza que la acción sea equivalente. Se revisa cada enlace de acceso a DUA, empezando por `sup-anticipar` y `acc-4-normas`. |
| O12 | alta | Una eliminación de objetivos de básica queda «Acuerdos completos» con solo rol docente, sin familia/equipo y `protocolo:false`: `objetivosSinFamilia` registra cero errores. Además, una sola casilla mezcla PAEC/PACI/protocolo DEC. D83, proceso cooperativo, exige familia y profesionales para decidir adecuaciones; Circular 586 distingue instrumentos. No basta la advertencia genérica de orientación. | No certificar acuerdos completos de objetivos sin verificar participación y evaluación pertinentes; separar instrumentos y distinguir propuesta de decisión curricular formal. | **Acepto, alta.** Verificado en `erroresAcuerdo`: no exige a la familia ni al equipo. Con adecuaciones en los objetivos, los acuerdos exigen esos roles, y PAEC, PACI y DEC se separan en casillas distintas. |
| O13 | alta | Claude dio por respaldada `dua-5-1`, pero la ficha ofrece formatos alternativos sin la excepción esencial de [CAST 5.1](https://udlguidelines.cast.org/action-expression/expression-communication/multiple-media/). Una maqueta no demuestra composición escrita solo por usar la misma pauta. [Ficha 13](fichas.md). | Incorporar condición de equivalencia y comprobar qué habilidad es esencial antes de sustituir formato. Extender el resguardo a DUA, no solo a apoyos individuales. | **Acepto.** Error mío al dar `dua-5-1` por respaldada. Se agrega: «Si la meta es un formato, por ejemplo escribir, ese formato se mantiene». |
| O14 | alta | `tr-mensajes-escritos` recomienda chat/correo para «avisos urgentes». JAN audición ofrece comunicación y alertas, pero no garantiza recepción urgente de correo en una bodega. OIT p. 27 exige riesgo concreto; casos A9/A11 y Claude 8 lo muestran. | Diferenciar avisos ordinarios de emergencia; validar canales perceptibles y confiables con seguridad y persona, sin sustituir alarmas por correo no comprobado. | **Acepto, alta.** Se distinguen los avisos ordinarios de las emergencias: las alertas de seguridad deben ser perceptibles y acordarse con prevención de riesgos, nunca solo por correo. |
| O15 | media | A6 activa laboratorio y solo salud/energía; `prac-evaluar` no aparece porque sus dimensiones omiten 9. La ficha exige conservar desempeño y seguridad, precisamente relevante al ajustar fatiga. `resultados-casos.json`, A6. | Revisar cobertura de la dimensión y ofrecer evaluación práctica pertinente sin prometer sustitución de competencias esenciales. | **Acepto, media.** Se revisan las dimensiones de `prac-evaluar`. |
| O16 | media | A13 no recibe `acc-9-rutina` porque la ficha solo aplica a parvularia, aunque D83 organización del tiempo también abarca básica. No encontré una opción equivalente de rutina energética en sus sugerencias. | Ofrecer una opción respaldada para básica y revisar pertinencia en cada nivel, sin extender automáticamente toda ficha a todos los contextos. | **Acepto, media.** Se evalúa una versión de `acc-9-rutina` para básica. |
| O17 | media | El «patrón de oro» exige paquetes sin datos suficientes: teclado en Claude 1, recreo en 3, Historia en 5, tiempo extra en 6 y subtítulos en 8. También omite evacuación entre esperados de 2. [Análisis de los nueve casos](criterio-claude.md), D83 evaluación individual, ACS 3.9.3–3.9.4. | Sustituir listas obligatorias por condiciones, alternativas y contraejemplos; citar respaldo por elección y admitir que acertar IDs no valida juicio experto. | **Acepto.** Mis casos semilla exigían paquetes fijos. Se pasan a condiciones y alternativas. |
| O18 | media | En móvil, el centro del botón Editar descripción laboral queda detrás de la barra fija. Coordenadas de `teclado`; [accesibilidad 1](accesibilidad.md). Es ocultación parcial, no la declaro total. | Reservar espacio y margen de desplazamiento para que se vea todo el control y su foco. | **Acepto.** Tiene la misma causa que O19 a O21: la barra fija. Se corrige con `scroll-padding-bottom` y margen. |
| O19 | alta | El `summary` del proceso laboral recibe foco totalmente dentro de la barra fija (y=778,5–832,9; barra desde 775). [Accesibilidad 2](accesibilidad.md); WCAG 2.4.11. | Evitar superposición al navegar con Tab; comprobar el grupo expandible además de botones. Comparte causa con O18/O20/O21. | **Acepto, alta** (WCAG 2.4.11). Misma causa que O18. |
| O20 | alta | La casilla Recursos humanos recibe foco totalmente tapada (y=812,5–831,7). `teclado` conserva etiqueta y elemento superpuesto. [Accesibilidad 3](accesibilidad.md). | Mantener visible la casilla y su foco al llegar a roles; corregir la misma superposición móvil. | **Acepto, alta.** Misma causa que O18. |
| O21 | alta | `#documento-trabajo` queda totalmente oculto por `#continuar` al recibir Tab. [Captura](foco-cubierto-390.png) y [accesibilidad 4](accesibilidad.md): el usuario ve otro botón. | No permitir dos controles superpuestos con acciones/foco indistinguibles; verificar todos los destinos del recorrido. | **Acepto, alta.** Misma causa que O18. |
| O22 | media | Al quitar con Enter una acción de `#dua-seleccion`, el foco termina en BODY (`focoQuitar`). `alternar` intenta enfocar un botón de mochila cerrada. | Enfocar siguiente acción visible o encabezado de selección y conservar posición de teclado. | **Acepto.** Al quitar una acción, el foco va a la siguiente o al título de la selección. |
| O23 | media | Los botones de las tarjetas se llaman solo «Elegir»/«Elegida»; `mediciones-web.json` conserva nombre visible, ARIA y título vacíos. La lista de botones y el control por voz no distinguen acción. | Incluir título en el nombre accesible, manteniendo la palabra visible «Elegir». | **Acepto.** El nombre accesible pasa a «Elegir: <título>» y mantiene la palabra visible. |
| O24 | media | En mochila, el botón de curso y el del estudiante se llaman ambos «Quitar» sin título/persona. Las notas sí tienen esa identificación. [Accesibilidad 7](accesibilidad.md). | Identificar acción y persona en el botón de quitar. Es otra manifestación del etiquetado genérico de O23. | **Acepto.** Mismo cambio que O23: «Quitar: <título>, <persona o curso>». |
| O25 | alta | En vista previa oscura, el aviso de borrador es #111 sobre #222c40: 1,35:1. [Captura](documento-390.png), `avisoOscuro`, WCAG 1.4.3. Se puede pasar por alto que los acuerdos están incompletos. | Usar colores de hoja coherentes o un aviso con contraste ≥4,5:1 dentro de la hoja. | **Acepto, alta.** El aviso de borrador usa los colores de la hoja, con contraste de 4,5:1 o más. |
| O26 | media | La descarga real es PDF sin etiquetas: [pdfinfo.txt](pdfinfo.txt), `Tagged: no`, sin `/StructTreeRoot`. Se pierden relaciones de encabezados/listas/tablas. | Emitir PDF con estructura semántica o proporcionar un documento accesible equivalente claramente disponible. Verificar con tecnología de apoyo. | **Acepto el problema, con límite.** pdfmake no genera PDF etiquetado, y agregar otra librería va contra la regla 2. Se ofrece la vista HTML del documento como versión accesible equivalente y se dice en la página. |
| O27 | media | `trabajo.pdf` no tiene `/Lang`; `definicionPdf` no declara idioma. [Accesibilidad 10](accesibilidad.md), WCAG 3.1.1. | Declarar español en el PDF y comprobar lectura. Corregir idioma además de estructura, no dar una por resuelta al arreglar la otra. | **Acepto.** Se declara el idioma español en el PDF, si pdfmake lo permite (se prueba), y se verifica. |

O18–O27 son diez manifestaciones comprobadas, **no diez causas independientes**. Las causas de barra y etiquetado se agrupan expresamente para evitar inflar el número de defectos. No se obtuvo una auditoría de diez fallas raíz distintas.

## Qué sí pasó y qué queda abierto

- Fase ciega terminada y registrada antes de leer los nueve casos: sí.
- 15 casos con recomendaciones y fuentes: sí; cuatro laborales sin DUA por no corresponder al flujo de curso.
- 40 fichas contrastadas: sí, con límites de originales/síntesis identificados por ficha.
- Objeciones con evidencia y propuestas de cambio: sí. «Respuesta de Claude» queda vacía deliberadamente.
- Cambios solo bajo `docs/revision-adversarial/`: comprobado en el diff.
- Mínimo de diez manifestaciones de accesibilidad: documentado; diez causas distintas: no alcanzado.
- Ausencia de copia contra todo CAST/OMS/EEF: **no certificada**. El cotejo literal local fue negativo; faltan originales completos y cotejo exhaustivo, como declara [el apartado de copia](legal-privacidad.md).

No se corrigieron los defectos, no se integró a `main`, no se simuló la respuesta de Claude y no se ejecutó una segunda ronda antes de tener sus rechazos. No hubo revisión jurídica profesional ni prueba con personas usuarias o lectores de pantalla reales. No se revisaron todas las 239 fichas en profundidad ni todos los artículos de las normas.

## Reproducir y validar la entrega

Desde la raíz del repositorio:

```bash
python3 docs/revision-adversarial/muestrear.py
node docs/revision-adversarial/medir-casos.cjs
CHROMIUM_BIN=/usr/bin/chromium node docs/revision-adversarial/medir-web.cjs
python3 docs/revision-adversarial/medir-coincidencias.py
python3 scripts/validar_catalogo.py
python3 docs/revision-adversarial/validar-entrega.py
```

Chromium puede requerir permiso para ejecutarse y abrir un puerto local; todas las descargas quedan aquí. El script web corta red externa tras registrar sus intentos. El PDF y fechas se regeneran; los IDs sintéticos del navegador pueden variar. Las recomendaciones y objeciones no se regeneran.

Se ejecutaron estas mediciones y el validador del catálogo: **239 recomendaciones, 36/36 consideraciones**. No se ejecutó la batería histórica completa: contiene pruebas que escriben fuera de esta carpeta y pruebas calibradas con los casos de Claude; no se la presenta como validación independiente. Esta entrega añade documentación e instrumentación, sin cambios de producción.

Autorrevisión exigida por `AGENTS.md`: [ponytail-review](revision-ponytail.md). El dueño decide la integración tras las respuestas y eventuales desacuerdos.

## Verificación de la tarea 046

Segunda ronda sobre la implementación de `codex/046-correcciones`, 19-11-2026. Los resultados de la tarea 042, arriba, son históricos. Esta ronda sí modifica la página y ejecuta la batería histórica. No cambia `data/`, `docs/fuentes/` ni `.claude/`; las correcciones del catálogo siguen a cargo de Claude.

### Réplica a las respuestas parciales de Claude

- **O9: acepto la corrección del rótulo e insisto en el respaldo.** En esta base, `acc-9-plazos.respaldo` es `orientacion-oficial`, no `norma-legal`. Retiro esa parte de O9 y de la ficha 28. Sin embargo, `fuentes` contiene solo `ley-20422`, mientras `como` indica acordar fechas, entregar material y priorizar contenidos. El art. 40 trata atención escolar por salud; no establece esos tres pasos para cualquier ausencia. La propia respuesta reconoce ese límite. Sigue pendiente agregar una orientación de evaluación pertinente o identificar los pasos como propuesta de consenso. Cambiar el rótulo no aporta la fuente faltante.
- **O10: acepto que ya dice consenso e insisto en precisar el préstamo.** `acc-11-recursos.respaldo` es `consenso-expertos`: no corresponde acusar que la ficha declara el préstamo como obligación legal. Pero el paso «Presta materiales o acceso a computador» sigue sin condición, y la única fuente es `decreto-67`. El art. 18 d respalda coordinación y evitar sobrecarga; no documenta un deber de préstamo. Acepto la solución propuesta por Claude: explicitar que es una propuesta institucional sujeta a recursos disponibles y no atribuir ese paso al decreto. En el catálogo de esta rama esa condición todavía falta; O10 queda pendiente de su cambio de contenido.
- **O26: acepto el límite técnico y la alternativa HTML, con alcance comprobado.** Se conserva pdfmake y no se agregan bibliotecas. La vista previa muestra los mismos campos seleccionados del modelo compartido, con encabezados y tablas HTML; el aviso bajo la descarga explica expresamente que el PDF carece de etiquetas y remite a esa vista. El PDF real sigue con `Tagged: no` (véase [pdfinfo](../marca/046-correcciones/pdfinfo.txt)). Esto ofrece una alternativa en la página; no convierte el PDF en accesible ni demuestra compatibilidad con todos los lectores. No se hizo una sesión con lector de pantalla real. O27 se verifica por separado: el archivo descargado contiene `/Lang (es-CL)`.

### Antes y después

| Objeción | Antes | Después y evidencia |
|---|---|---|
| `O1` | Google Fonts recibía solicitudes al cargar. | Tipografía del sistema; cero solicitudes HTTP fuera del sitio al cargar y descargar el PDF. `scripts/probar_adversarial.cjs`. |
| `O2` | Voz y barreras se imprimían siempre. | Tres secciones independientes; solo ajustes marcados por defecto. Las ocho combinaciones se verifican en HTML y definición PDF; además se descarga un PDF real. |
| `O3` | DUA preseleccionaba al estudiante activo. | Solo curso marcado desde DUA; inclusión expresa del estudiante muestra la advertencia. |
| `O4` | Proyección exponía conteos y mochila. | «Proyectar al curso» oculta barreras repetidas, avisos individuales y mochila; «Salir de proyección» los restituye. |
| `O5` | Error de guardado silencioso. | Aviso una vez por sesión y botón «Guardar respaldo»; prueba con `setItem` que lanza error. |
| `O6` | Acceso en media rotulado como aplicación directa de D83. | Tarjetas, selección y documentos precisan criterios D83 por remisión D67 art. 5. |
| `O7` | Prohibición absoluta en superior. | Resultados de aprendizaje mantenidos; corregidos aviso y guía. |
| `O8` | Plazo aislado de 60 días. | Texto solicitado y enlace al procedimiento oficial de la DT. |
| `O9`–`O11` | Fuentes o equivalencias cuestionadas del catálogo. | Sin cambios de catálogo; réplica O9/O10 arriba. O11 sigue a cargo de Claude. |
| `O12` | Objetivos completos con solo docente; instrumentos mezclados. | Exige familia y diferencial, PIE o jefatura; equipo genérico no basta. PACI, PAEC y DEC separados y sincronizados. Respuesta antigua marcada migra a tres casillas vacías, con aviso al cargar o importar; no se repite tras guardar y recargar. |
| `O13`–`O17` | Problemas de contenido y casos semilla. | Fuera del cambio de página; siguen a cargo de Claude. No se presentan como resueltos. |
| `O18`–`O21` | Controles parcial o totalmente tras la barra móvil. | `scroll-padding-bottom` con altura observada y margen; corrección de desplazamiento al enfocar. Tab recorre descripción, grupos abiertos y acuerdos de ambos ámbitos a 390 px. Comprueba el borde completo del control sobre la barra. |
| `O22` | Quitar perdía foco en BODY. | Va a la siguiente acción DUA o al título de selección. |
| `O23`–`O24` | Botones genéricos. | Nombre empieza con Elegir/Elegida/Quitar, incluye título y, en selección, curso o persona. |
| `O25` | Aviso oscuro con contraste 1,35:1. | Colores de hoja: contraste medido 16,87:1 en ambos temas. |
| `O26` | PDF sin etiquetas, sin alternativa indicada. | Vista HTML equivalente y aviso visible de la limitación; réplica arriba. |
| `O27` | PDF sin idioma. | `language: "es-CL"`; `/Lang (es-CL)` comprobado en los bytes del PDF descargado. |

### Reproducción y límites

```bash
python3 scripts/validar_catalogo.py
CHROMIUM_BIN=/usr/bin/chromium node scripts/probar_adversarial.cjs
for prueba in scripts/probar_*.cjs; do CHROMIUM_BIN=/usr/bin/chromium node "$prueba"; done
python3 scripts/probar_unificar_media.py
python3 docs/revision-adversarial/muestrear.py
node docs/revision-adversarial/medir-casos.cjs
CHROMIUM_BIN=/usr/bin/chromium node docs/revision-adversarial/medir-web.cjs
python3 docs/revision-adversarial/medir-coincidencias.py
python3 docs/revision-adversarial/validar-entrega.py --correcciones
```

`CHROMIUM_BIN` se puede omitir si está instalado el navegador de Playwright. No se fijan rutas de este entorno en los scripts nuevos. La instrumentación web actualiza la expectativa de O12 a «Por revisar» y el selector de personas para admitir las nuevas casillas. `validar-entrega.py --correcciones` conserva los controles de casos, fichas y objeciones, exige las respuestas de Claude y comprueba las carpetas protegidas; sin la opción mantiene el alcance histórico de la tarea 042.

Salidas de esta ronda: [instrumentación adversarial](../marca/046-correcciones/adversarial/), [resultados nuevos](../marca/046-correcciones/resultados.json), [capturas a 1280 y 390 px](../marca/046-correcciones/). Las mediciones históricas de 042 se conservan en su ubicación original. El catálogo pasa con **239 recomendaciones y 36/36 consideraciones**. Pasan los **22 scripts `scripts/probar_*.cjs`** y `probar_unificar_media.py`; véase [registro de batería](../marca/046-correcciones/bateria.txt). Las pruebas históricas de preguntas clave, persistencia y documentos se actualizan solo donde la tarea cambia el comportamiento esperado; no se suprimen sus recorridos.

No se certifica el contenido pendiente del catálogo ni accesibilidad del PDF etiquetado; no hubo evaluación jurídica profesional o prueba con lectores de pantalla reales. La autorrevisión de código se registra en [revisión 046](../marca/046-correcciones/revision-ponytail.md).
