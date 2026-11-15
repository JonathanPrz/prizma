# Tarea 014 · Reorganizar la página en pasos y «Mi mochila»

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/014-pasos-y-mi-plan`

## Para qué

Al dueño la página le parece desordenada, porque muestra todo a la vez en 3 columnas. La nueva organización muestra **un paso a la vez** y la selección en un **«Mi mochila»** fijo arriba. Es un cambio de **organización**: no cambies textos de contenido, `data/` ni la lógica de recomendación.

## Estructura nueva

1. **Barra superior fija** (`position: sticky`, con la zona segura del teléfono): logo y «Prizma», enlace «¿Cómo usar el DUA?», selector de tema y un botón **«Mi mochila»** con un contador (`aria-label="Mi mochila: 3 elegidas"`).
2. **Pasos:** una navegación de 3 pasos, «1. Tu clase», «2. Para todos» y «3. Para un estudiante (opcional)». Usa `role="tablist"`/`tab` o enlaces con `aria-current="step"`. Se ve **un solo paso a la vez**, con todo el ancho. El paso se guarda en `estado` y en el hash de la URL (`#paso-1`, `#paso-2`, `#paso-3`), para que el botón Atrás funcione. Usa el vocabulario de `voc()`: en parvularia, el paso 2 sigue siendo «Para todos».
3. **Paso 1 · Tu clase:** nivel, «¿Qué quieres que aprendan?» y **«¿Qué quieres resolver en esta clase?»** (se mueve aquí desde las acciones). «¿Qué harán principalmente?» y «¿Cómo mostrarán…?» van dentro de un `<details>` cerrado, con el resumen «Más detalles (opcional)». Al final, un botón «Ver acciones para el curso», que lleva al paso 2.
4. **Paso 2 · Para todos:** arriba, una línea de resumen del paso 1 con el enlace «Cambiar» (por ejemplo «Básica · Quiere resolver: Se pierden en tareas largas»). Debajo van «¿Cuándo?», «¿Para qué?» y las tarjetas, en **2 columnas** en escritorio. Al final, el botón «Agregar apoyos para un estudiante (opcional)», que lleva al paso 3.
5. **Paso 3 · Para un estudiante:** la sección actual, completa.
6. **«Mi mochila»:** un panel lateral `<dialog>`, a la derecha en escritorio y a pantalla completa en teléfono. Tiene la lista de lo elegido, agrupado en «Para todo el curso» y «Para [iniciales]», con sus notas, «Quitar», «Ver documento», «Guardar respaldo», «Abrir respaldo» y «Borrar todo». Se cierra con Escape o con «Cerrar» y devuelve el foco al botón. **Elimina la columna derecha actual.**
7. **Al elegir una acción,** el contador se anima de forma breve (máximo 300 ms, solo si `prefers-reduced-motion` no pide reducir) y se anuncia con `aria-live`: «Agregada a tu mochila».
8. El pie de página (Privacidad, ¿Cómo usar el DUA?, aviso, código y fuentes) se mantiene.

## Lo que no cambia
- Los textos de las acciones, los avisos y las guías, el respaldo, el PDF, los temas y el vocabulario por nivel.
- Todas las pruebas de `scripts/` deben seguir pasando. Actualiza los selectores de las pruebas solo si cambió la estructura, sin debilitar lo que comprueban.

## Criterios de aceptación
- [ ] Al entrar se ve solo el paso 1. Los botones llevan al paso 2 y al paso 3. El hash y el botón Atrás funcionan.
- [ ] «Mi mochila» siempre visible, con el contador correcto. Abre el panel con lo elegido agrupado, y desde ahí funcionan las notas, «Quitar», el documento, el respaldo y «Borrar todo».
- [ ] No queda columna derecha. El paso 2 muestra las tarjetas en 2 columnas en escritorio y en 1 en teléfono.
- [ ] El foco se maneja bien al cambiar de paso (va al título del paso) y al abrir y cerrar «Mi mochila».
- [ ] Funciona con teclado, en tema claro y oscuro, a 390 px sin desplazamiento horizontal y con texto al 200 %.
- [ ] Capturas de antes y después de los 3 pasos y de «Mi mochila», en escritorio y teléfono, en `docs/marca/014-pasos/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.

## Marca

El nombre sigue siendo **Prizma** y el logo es el prisma de teselas triangulares que ya está en la cabecera. No cambies el logo ni el nombre.
