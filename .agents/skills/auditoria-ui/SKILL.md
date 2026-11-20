---
name: auditoria-ui
description: >
  Audita una página web contra 4 pilares de diseño: núcleo visual, bases cognitivas y heurísticas,
  arquitectura de componentes, y redacción de interfaz en español. Mide con el navegador, entrega
  un informe con evidencia y no corrige nada. Sirve para cualquier sitio, no solo para Prizma.
  Triggers: "auditoría de interfaz", "auditoría UI", "revisa el diseño", "pilares de diseño",
  "heurísticas de Nielsen", "microcopy".
---

# Auditoría de interfaz en 4 pilares

Revisas una página web y entregas un informe con evidencia medible. **No corriges nada:** describes el problema, por qué importa y qué cambiar. Decide el dueño del proyecto.

## Antes de empezar
1. **Lee las reglas del proyecto** (por ejemplo, `AGENTS.md` o `CLAUDE.md`). Si una regla del proyecto choca con esta guía, gana el proyecto.
2. **La accesibilidad gana siempre.** WCAG 2.2 AA está por encima de cualquier preferencia de estilo. Si una recomendación de estilo baja el contraste o el tamaño de un objetivo, se descarta.
3. **No copies texto de las fuentes.** Varios referentes son libros de pago (Refactoring UI, Practical UI, Microcopy). Esta guía resume sus ideas con palabras propias. En el informe, cita la fuente por su nombre y su enlace, sin transcribirla.

## Método
- **Mide con el navegador** (Playwright o similar) en 3 anchos (390, 768 y 1280 px) y en tema claro y oscuro, si existen.
- **Recorre las tareas principales** como lo haría una persona nueva: el primer uso, una tarea completa y un error.
- **Cada hallazgo lleva evidencia reproducible:** el selector, el valor medido y una captura o la línea de código.
- **Usa scripts solo para medir.** El juicio sobre si algo es un problema lo escribes tú, después de mirar.

## Pilar 1 · Núcleo visual

| ID | Qué revisar | Cómo medirlo |
|---|---|---|
| V1 | **Escala tipográfica.** Pocos tamaños, de 5 a 7, con saltos claros entre niveles. Sin tamaños sueltos. | Lista los `font-size` calculados de todos los textos visibles y agrúpalos. |
| V2 | **Jerarquía por peso y color, no solo por tamaño.** Lo secundario usa un tono más suave en vez de un tamaño menor. | Compara los pares título y texto, y etiqueta y valor. |
| V3 | **Paleta acotada.** Una escala de grises con matiz deliberado y un color de acento principal. Los colores de estado (éxito, alerta, error) aparte. | Cuenta los colores distintos calculados en texto, fondo y borde. |
| V4 | **Escala de espaciado.** Los márgenes y separaciones salen de una escala fija (por ejemplo, 4, 8, 12, 16, 24 o 32 px). El espacio agrupa y separa (proximidad). | Lista `gap`, `margin` y `padding` y busca valores fuera de la escala. |
| V5 | **Menos bordes.** Se separa con espacio, fondo o sombra antes que con líneas. Los bordes que quedan cumplen una función. | Cuenta los elementos con borde y anota cuáles sobran. |
| V6 | **Contraste.** Texto normal de 4,5:1 o más, texto grande y componentes de 3:1 o más (WCAG 1.4.3 y 1.4.11). | Mide cada combinación de texto y fondo, en los dos temas. |
| V7 | **Ancho de lectura.** Entre 45 y 75 caracteres por línea en el texto largo. | Mide el ancho de los párrafos en caracteres. |
| V8 | **Tamaño de objetivos táctiles.** Mínimo de 24 × 24 px (WCAG 2.5.8). Recomendado: 44 × 44 px en los controles principales (Apple HIG: 44 pt; Material: 48 dp). | Mide el área de cada control interactivo a 390 px. |

## Pilar 2 · Bases cognitivas y heurísticas

| ID | Qué revisar | Referente |
|---|---|---|
| H1 | **Estado del sistema visible:** la persona sabe qué pasó después de cada acción (guardado, error, carga). | Nielsen #1 |
| H2 | **Lenguaje de la persona,** no del sistema. | Nielsen #2 |
| H3 | **Control y salida:** deshacer, cancelar y volver atrás. Confirmación antes de borrar. | Nielsen #3 |
| H4 | **Consistencia:** el mismo nombre, color y lugar para lo mismo en toda la página. | Nielsen #4 |
| H5 | **Prevención de errores:** valores por defecto seguros y validación antes de enviar. | Nielsen #5 |
| H6 | **Reconocer antes que recordar:** las opciones se ven, no hay que memorizarlas entre pasos. | Nielsen #6 |
| H7 | **Atajos para quien ya conoce,** sin estorbar a quien empieza. | Nielsen #7 |
| H8 | **Diseño mínimo:** cada elemento compite por atención. Nada repetido ni decorativo sin función. | Nielsen #8 |
| H9 | **Errores que explican** qué pasó y cómo seguir. | Nielsen #9 |
| H10 | **Ayuda en contexto,** breve y donde se necesita. | Nielsen #10 |
| H11 | **Pocas opciones a la vez** (ley de Hick): cuenta las opciones visibles en cada decisión y busca grupos de más de 7 sin orden. | Laws of UX |
| H12 | **Proximidad** (Gestalt): lo relacionado está junto y separado de lo demás. | Laws of UX |
| H13 | **Fitts:** las acciones frecuentes o principales son grandes y están cerca. Las destructivas están lejos de las principales. | Laws of UX |

## Pilar 3 · Componentes y sistema de diseño

| ID | Qué revisar |
|---|---|
| C1 | **Variantes de botón con nombre y función:** principal, secundaria, sutil y destructiva. Una sola acción principal por vista. Las variantes se distinguen por algo más que el color. |
| C2 | **Todos los estados:** reposo, hover, foco visible, presionado o seleccionado, deshabilitado y cargando, en botones, campos, selectores y enlaces. El foco tiene un anillo visible y de buen contraste (WCAG 2.4.7 y 2.4.11). |
| C3 | **Tokens de diseño:** colores, tipografía, espaciado y radios definidos como variables, y usados en todo el código. Busca valores sueltos en el CSS. |
| C4 | **Estados vacíos:** cada lista o sección que puede quedar vacía explica qué irá ahí, invita a la primera acción y, si sirve, muestra un ejemplo. |
| C5 | **Selectores y menús desplegables:** el ícono indica si está abierto o cerrado (por ejemplo, un chevron que rota) y el estado se anuncia (`aria-expanded`). |
| C6 | **Navegación en el teléfono:** zonas seguras respetadas (*safe area*), barras fijas que no tapan contenido ni foco, e indicador del lugar activo. |
| C7 | **Formularios:** etiqueta visible sobre el campo, ayuda y errores junto al campo, y el campo con error marcado con algo más que color. |

## Pilar 4 · Redacción de interfaz en español

| ID | Qué revisar | Referente |
|---|---|---|
| E1 | **Botones con verbo y resultado:** «Guardar respaldo», no «Enviar» ni «OK». Mejor si dicen el beneficio. | Microcopy, Mailchimp |
| E2 | **Estados vacíos que explican, invitan y muestran.** | Microcopy |
| E3 | **Una sola voz y un solo tono,** el mismo trato (tú o usted) en toda la página. | Mailchimp |
| E4 | **Sin doble negación,** sobre todo en diálogos de confirmación. La opción que borra dice qué borra. | Mailchimp |
| E5 | **Mayúscula solo al inicio** de títulos y botones (no Title Case del inglés). Meses y días en minúscula. | FundéuRAE |
| E6 | **Frases cortas y lenguaje claro.** Términos iguales para lo mismo (glosario). | Proyecto, Mailchimp |
| E7 | **Errores sin culpa:** qué pasó y cómo seguir, sin «inválido» ni «error de usuario». | Microcopy |
| E8 | **Números, fechas y unidades** con el formato local (por ejemplo, 1.200 y 20-11-2026 en Chile). | FundéuRAE |

## Informe
Crea `docs/auditorias/<número>-interfaz/README.md` (o la ruta que indique la tarea) con:
1. **Resumen de una página:** los 5 problemas más importantes y lo que está bien.
2. **Tabla de hallazgos:** ID del criterio, prioridad (alta = impide una tarea o rompe la accesibilidad; media = confunde o ralentiza; baja = pulido), dónde está, evidencia, por qué importa y cambio propuesto.
3. **Mediciones:** la escala tipográfica real, la paleta real, los espaciados fuera de escala y los objetivos pequeños, con sus valores.
4. **Capturas** a 390 y 1280 px.
5. **Lo que no pudiste revisar** y por qué.

## Referentes
- Refactoring UI, Adam Wathan y Steve Schoger: https://www.refactoringui.com/ (libro de pago).
- Practical UI, Adham Dannaway: https://www.practical-ui.com/ (libro de pago).
- 10 heurísticas de usabilidad, Nielsen Norman Group: https://www.nngroup.com/articles/ten-usability-heuristics/
- Laws of UX, Jon Yablonski: https://lawsofux.com/
- shadcn/ui, componentes: https://ui.shadcn.com/docs/components
- Material Design 3: https://m3.material.io/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Microcopy: The Complete Guide, Kinneret Yifrah: https://www.microcopybook.com/ (libro de pago).
- Mailchimp Content Style Guide: https://styleguide.mailchimp.com/
- FundéuRAE: https://www.fundeu.es/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/ (norma de accesibilidad; manda sobre todo lo anterior).
