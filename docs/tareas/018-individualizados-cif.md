# Tarea 018 · Apoyos individualizados, ejemplos por asignatura, actividades prácticas y resumen CIF

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/018-individualizados-cif`

## Para qué

El dueño pidió cuatro cambios:
- un nombre más claro para la segunda pestaña;
- ejemplos de adecuaciones en los objetivos por asignatura (Claude ya los agregó al catálogo);
- apoyos propios para talleres, laboratorios y terreno, porque los desafíos de la formación técnica no son iguales a los de la universidad;
- que el enfoque CIF se vea en el resultado.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.** Claude escribe el contenido.

## Cambios

1. **Nombre de la pestaña:**
   - En la escuela, la pestaña se llama «Apoyos individualizados» y el `h1` dice «Apoyos individualizados para un estudiante».
   - En superior no cambia nada: se mantiene el término legal de la Ley 21.091, «Ajustes razonables», en la pestaña, el `h1`, las tarjetas, el aviso y el PDF.
   - Ajusta las pruebas que comprueban estos textos.
2. **Adecuaciones en los objetivos, agrupadas:**
   - Dentro del bloque «Si los apoyos de acceso no bastan», agrupa las fichas por tipo, con un `h3` por tipo (`TIPOS_OBJETIVOS`).
   - En cada grupo va primero la ficha general (sin campo `asignatura`) y después los ejemplos.
   - Agrega un selector «Asignatura» al inicio del bloque, con las opciones Todas, Lenguaje, Matemática, Ciencias e Historia. Muestra los ejemplos de esa asignatura y los que tienen `asignatura: ""` (sirven para todas). Las fichas generales se ven siempre.
   - Valida el valor guardado.
3. **Actividades prácticas:**
   - En los filtros de la pestaña de apoyos, después de las situaciones, agrega una casilla: «Tiene talleres, laboratorios o actividades en terreno».
   - Muéstrala solo si el catálogo tiene, para el nivel actual, fichas de acceso con `"practica"` en `contextos`. Hoy no hay ninguna, así que no se verá hasta que Claude las agregue. Prueba con una ficha simulada en la prueba, no en `data/`.
   - Si está marcada, muestra esas fichas en un grupo propio, «En talleres, laboratorios y terreno», después de los 4 tipos de acceso. Ordénalas por coincidencia con las situaciones marcadas. Cada tarjeta dice «Porque marcaste: actividades prácticas» y suma las situaciones que coincidan.
   - Si no está marcada, esas fichas no aparecen en los grupos de acceso.
   - Se guarda en `estado.estudiante.practica` (booleano validado), va en el respaldo y cuenta en «Filtros (n)».
4. **Resumen CIF en el PDF y la vista previa:**
   - En la sección del estudiante, antes de los apoyos, agrega una tabla «Barreras y facilitadores (enfoque CIF)», con 3 columnas: Situación, Frecuencia y Apoyos elegidos para esa situación (títulos de las fichas elegidas que tienen esa dimensión, o «Sin apoyo elegido»).
   - Debajo de la tabla van «Le ayuda» y «¿Qué dicen el estudiante y su familia?», si tienen texto.
   - Una línea bajo el título: «Las situaciones describen barreras del entorno, no rasgos del estudiante (CIF, OMS 2001)».
   - Hazlo en `armarHoja()` y en `definicionPdf()` (tabla de pdfmake), con encabezado de tabla accesible en HTML (`th` con `scope`).

## Lo que no cambia
Las fichas, las fuentes, «Mi mochila», la pestaña DUA, los temas y el logo.

## Criterios de aceptación
- [ ] En la escuela, la pestaña y el `h1` dicen «Apoyos individualizados». En superior siguen diciendo «Ajustes razonables».
- [ ] Las adecuaciones en los objetivos aparecen agrupadas por tipo, y el selector filtra los ejemplos sin ocultar las fichas generales.
- [ ] La casilla de actividades prácticas no aparece mientras no haya fichas con `practica`. Con una ficha simulada, la casilla aparece y el grupo funciona.
- [ ] El PDF y la vista previa muestran la tabla CIF con las situaciones marcadas, y la tabla funciona con lector de pantalla.
- [ ] Respaldos antiguos sin `practica` ni asignatura cargan sin errores.
- [ ] No hay desplazamiento horizontal a 390 px. La tabla cabe o se desplaza dentro de su contenedor.
- [ ] Capturas en `docs/marca/018-individualizados/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`.
