# B · Panel de trabajo

Dirección elegida por el dueño e implementada en `styles.css`. Cabecera compacta, tipografía Atkinson y tres columnas funcionales en escritorio: perfil, acciones y selección. En pantallas intermedias pasa a dos columnas; en teléfono, a una. Mantiene las mejoras de accesibilidad, navegación y tema.

Los filtros de «¿Para qué?» son compactos y comparten fila cuando caben; pueden envolver y se apilan en teléfono. El logo de la cabecera mide 2,75 rem en escritorio y teléfono. Las capturas se actualizaron desde la página local sin inyectar CSS de prototipo.

Se conserva el logo de teselas y la paleta de los tres propósitos, sin reescribir el catálogo. Capturas del 15 de noviembre de 2026, estado limpio, momento Antes, sin selección. Escritorio 1440 × 1100; teléfono 390 × 1000; Chromium. El selector está en «Según mi dispositivo» y cada pareja simula un dispositivo claro u oscuro.

| Tema / dispositivo | Entrada | Acciones y filtros |
|---|---|---|
| Claro · escritorio | [Captura](escritorio.png) | [Captura](acciones-escritorio.png) |
| Claro · teléfono | [Captura](telefono.png) | [Captura](acciones-telefono.png) |
| Oscuro · escritorio | [Captura](escritorio-oscuro.png) | [Captura](acciones-escritorio-oscuro.png) |
| Oscuro · teléfono | [Captura](telefono-oscuro.png) | [Captura](acciones-telefono-oscuro.png) |

Axe no detectó infracciones automáticas WCAG A/AA en estos cuatro estados. Contraste y límites de la evaluación en [la auditoría](../../auditoria-estilo.md). No es una certificación de conformidad.

La aplicación carga solo esta dirección. A conserva sus capturas de referencia; no hay interruptor A/B ni segunda hoja productiva. Las pruebas confirman una fila de filtros a 1440 px, envoltura a 800 px y columna a 390 px, también conservando los estados activos y el foco.
