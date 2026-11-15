# Tarea 011 · Entrada «¿Qué quieres resolver en esta clase?»

Estado: **integrada** · Asignada a: Codex · Rama: `codex/011-necesidades` · Hazla **después** de integrar la tarea 010.

## Para qué

Así se usa el DUA en la práctica: el docente parte de un problema concreto y busca las consideraciones que lo resuelven. Ver `docs/diseno.md`, sección 3.2. Las 8 necesidades están en `data/necesidades.json`, cada una con sus consideraciones DUA. **No cambies `data/`.**

## Qué hacer

1. **Al inicio de «Acciones para todo el curso»,** antes de «¿Cuándo?», agrega un `<fieldset>` con la leyenda «¿Qué quieres resolver en esta clase?» y la ayuda «Elige una o más. Si no eliges, verás todas las acciones.». Muestra las 8 necesidades como botones `aria-pressed`, con el mismo estilo que los filtros de «¿Para qué?». Carga sus textos desde `data/necesidades.json`.
2. **Ordenar, no ocultar:** una acción DUA **coincide** con una necesidad si su `consideracion` está en la lista de esa necesidad. Esto también vale para las versiones de parvularia. Las acciones que coinciden van primero, ordenadas por cuántas necesidades elegidas responden, y la tarjeta muestra «Responde a: [textos de las necesidades].». Este orden va **antes** del que ya existe por «¿Qué harán?» y «¿Cómo mostrarán?». Si una tarjeta tiene las 2 razones, muestra ambas líneas.
3. **Pestañas:** junto a cada pestaña de «¿Cuándo?», muestra cuántas acciones coincidentes tiene, por ejemplo «Antes (11 · 3 para ti)». Así se sabe dónde buscar.
4. Guarda las necesidades elegidas en `estado.necesidades` como una lista de `id`. Inclúyelas en el respaldo, validando que cada `id` exista en `data/necesidades.json`; los respaldos antiguos se abren igual. En la vista previa y el PDF, agrega la línea «Quiere resolver: …» a los datos de la clase.
5. Si `data/necesidades.json` no carga, la página funciona igual, sin esta sección.

## Criterios de aceptación
- [ ] Elegir «Se pierden en tareas largas o con muchos pasos» pone primero, en «Durante», la acción de la consideración 5.3, con la línea «Responde a: …».
- [ ] Con 2 necesidades elegidas, una acción que responde a ambas va antes que una que responde a una sola.
- [ ] Ninguna acción se oculta por elegir necesidades.
- [ ] Las pestañas muestran el número de acciones coincidentes.
- [ ] El respaldo y el PDF incluyen las necesidades.
- [ ] Teclado, tema claro y oscuro, y 390 px sin desplazamiento horizontal.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y las pruebas de `scripts/`. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
