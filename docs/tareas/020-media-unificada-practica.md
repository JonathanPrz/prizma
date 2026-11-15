# Tarea 020 · Unificar educación media y llevar «clase práctica» junto al nivel

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/020-media-unificada`

## Para qué

La media CH y la TP muestran las mismas fichas, y en superior la universidad, los IP y los CFT tienen el mismo marco legal. Lo que de verdad cambia las barreras es el tipo de actividad: un taller, un laboratorio o el trabajo en terreno. Por eso el dueño decidió:
- unificar media en un solo nivel;
- convertir la casilla de actividades prácticas en un filtro general, junto al nivel, que afecte a las dos pestañas.

Claude ya agregó al catálogo:
- 9 fichas de acceso con `"practica"` en `contextos` (`prac-*`), para básica, media y superior;
- `"practica"` en 8 acciones DUA.

## Permiso especial sobre `data/`
Esta tarea te autoriza **solo** a reemplazar en `data/recomendaciones.json` los niveles `media-ch` y `media-tp` por `media`, con un script, sin duplicados y sin tocar nada más del archivo. Muestra en el pull request el script y el conteo antes y después. No cambies `data/fuentes.json` ni `docs/fuentes/`.

## Cambios
1. **Nivel único de media:**
   - En `NIVELES`, cambia `media-ch` y `media-tp` por `media: "Educación media (CH y TP)"`. Superior queda como está.
   - Actualiza `scripts/validar_catalogo.py`, `index.html` y las pruebas que usan esos valores.
   - **Migración:** al cargar `localStorage` o un respaldo, `media-ch` y `media-tp` pasan a `media`.
2. **«Mi clase incluye taller, laboratorio o terreno»:**
   - Mueve la casilla de la pestaña de apoyos a la barra de contexto, junto al selector de nivel, y cámbiale el texto a «Mi clase incluye taller, laboratorio o terreno».
   - Se guarda en `estado.perfil.practica` (booleano validado). Migra `estado.estudiante.practica` si existe en datos antiguos.
   - Muéstrala solo si el nivel actual tiene fichas con `practica`. En parvularia no hay.
   - No cuenta en «Filtros (n)», igual que el nivel.
   - **En la pestaña DUA:** si está marcada, las acciones con `"practica"` en `contextos` suben dentro de cada grupo de momento, después de las que responden a las necesidades y antes de las de «Más detalles». Cada una dice «Recomendada porque marcaste: taller, laboratorio o terreno».
   - **En la pestaña de apoyos:** si está marcada, se ve el grupo «En talleres, laboratorios y terreno», que ya existe. Si no, esas fichas no aparecen.
   - **En el PDF:** si está marcada, agrega «Clase con taller, laboratorio o terreno» junto al nivel.
3. **Vocabulario:** en media, el texto sigue diciendo «clase» y «curso», como hoy.

## Lo que no cambia
Las fichas (salvo los niveles), las fuentes, «Mi mochila», la tabla CIF, los temas y el logo.

## Criterios de aceptación
- [ ] El selector muestra 4 niveles: parvularia, básica, media (CH y TP) y superior.
- [ ] Un respaldo o `localStorage` con `media-tp` o con `estudiante.practica: true` se carga como `media`, con la casilla marcada.
- [ ] En básica, media y superior aparece la casilla junto al nivel. En parvularia no.
- [ ] Con la casilla marcada, en DUA suben las acciones prácticas con su razón, y en apoyos aparece el grupo práctico. Sin marcarla, no.
- [ ] `data/recomendaciones.json` solo cambia en los niveles de media. El script y los conteos van en el pull request.
- [ ] No hay desplazamiento horizontal a 390 px. La casilla tiene etiqueta, foco visible y objetivo táctil de al menos 24 px.
- [ ] Capturas en `docs/marca/020-media/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`.
