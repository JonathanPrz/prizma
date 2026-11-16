# Tarea 025 · Ordenar por pertinencia, práctica sin relleno y contexto del estudiante

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/025-orden-pertinencia`

## Para qué
Es la fase 2 de `docs/auditorias/024-estudiantes/estrategia.md`. Claude ya pasó las situaciones de 11 a 14 y reetiquetó el catálogo (fase 1). Quedan cuatro problemas de la auditoría 024:
- el orden entierra la ficha pertinente (A4);
- la práctica suma fichas sin relación (M1);
- en el teléfono se pierde qué estudiante se edita (M4);
- los datos guardados con las situaciones antiguas 3 y 6 deben revisarse.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios
1. **Orden por pertinencia de los apoyos de acceso:**
   - Ordena por:
     1. puntaje (como hoy);
     2. proporción de coincidencia: situaciones marcadas que tiene la ficha, divididas por todas sus situaciones;
     3. orden del catálogo.
   - Antes de los grupos por tipo, agrega la sección «Para empezar» con las 3 fichas mejor ordenadas. Esas 3 no se repiten en los grupos de abajo.
   - Si hay 3 apoyos o menos, no muestres la sección: muestra solo los grupos.
2. **Práctica sin relleno:**
   - Con la casilla de práctica marcada, muestra solo las fichas prácticas con puntaje mayor a 0 para el estudiante activo.
   - Ordénalas igual que el punto 1.
3. **Contexto del estudiante:**
   - En la pestaña de apoyos, el título de los filtros dice «Filtros · JP», o «Filtros · Estudiante 2» si no tiene iniciales. Vale para la columna de escritorio y para el diálogo del teléfono.
   - El selector de estudiantes queda arriba y no se mueve.
4. **Revisión de situaciones antiguas:**
   - Agrega `estado.versionSituaciones = 2`.
   - Si al cargar un estudiante tiene marcada la situación 3 o la 6 y los datos no tienen esa versión, muestra **en el panel**, sin ventana, el aviso: «Separamos algunas situaciones: "Visión" y "Audición", y "Comprender" y "Expresarse oralmente". Revisa las situaciones de: JP, AM.».
   - El aviso tiene un botón «Entendido» que guarda la versión.
   - Aplica lo mismo al abrir un respaldo antiguo.

## Criterios de aceptación
- [ ] En básica, con solo «Expresarse oralmente», la primera ficha de «Para empezar» es `acc-3-caa`.
- [ ] Con «Atención y organización» y «Emociones y regulación», las fichas que tienen ambas suben antes que las que tienen una.
- [ ] Con práctica marcada y solo «Lectura, escritura y cálculo», no aparece `prac-asistente` (no comparte situaciones), pero sí `prac-procedimiento`.
- [ ] El título de los filtros muestra al estudiante activo en escritorio y teléfono.
- [ ] Un respaldo antiguo con la situación 6 muestra el aviso una vez. Después de «Entendido» no vuelve.
- [ ] No hay desplazamiento horizontal a 390 px. Las capturas van en `docs/marca/025-orden/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. Agrega `scripts/probar_orden.cjs`.
