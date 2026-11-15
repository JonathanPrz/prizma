# Tarea 017 · Ordenar los filtros y mostrar todas las acciones

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/017-orden-filtros`

## Para qué

La auditoría `docs/auditoria-filtros.md` encontró que «¿Cuándo?» esconde acciones sin que nadie lo elija, que el orden de los filtros no sigue DUA 3.0 y que la pestaña de apoyos tiene un título que no le corresponde. Esta tarea corrige los puntos A1–A6, B1, B3 y B4. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios

### Pestaña DUA
1. **Orden de los filtros** (A3): «¿Qué quieres que aprendan?», «¿Qué quieres resolver?», «¿Cuándo?», «¿Para qué?» y «Más detalles (opcional)». El enlace «¿Cómo usar el DUA?» se queda junto a «¿Qué quieres resolver?».
2. **«¿Cuándo?» opcional y de selección múltiple** (A1 y A2):
   - Usa botones con `aria-pressed`, como «¿Para qué?», y conserva el número de acciones de cada momento.
   - Agrega la ayuda «Si no eliges ninguno, se muestran todos».
   - Sin elegir, muestra las acciones de todos los momentos. Con uno o más elegidos, solo las de esos momentos.
   - Agrupa los resultados por momento, con un `h3` por grupo, en este orden: Antes, Durante, Después, En toda la clase. Omite los grupos vacíos.
   - Dentro de cada grupo, mantén el orden actual: primero las que responden a las necesidades marcadas, después las que coinciden con «Más detalles», después las destacadas.
   - Cambia `estado.momento` (texto) por `estado.momentos` (lista). Al cargar `localStorage` o un respaldo antiguo, ignora `momento` y deja la lista vacía. Valida que cada valor exista en `MOMENTOS`.
   - «Filtros (n)» y «Limpiar filtros» usan la lista nueva. Limpiar la deja vacía.
3. **Título por pestaña** (A4): mueve el `h1` y la bajada dentro de cada panel.
   - DUA: el título y la bajada actuales.
   - Apoyos: «Apoyos específicos para un estudiante». Bajada: «Elige los que le sirvan. Prizma no reemplaza al equipo de apoyo: te ofrece un menú, cada apoyo con su fuente.»
   - En superior: «Ajustes razonables para un estudiante», con la misma bajada pero «unidad de inclusión» en vez de «equipo de apoyo».
   - Quita el `h2` que repite el título («Apoyos para un estudiante» o «Ajustes razonables para un estudiante») si queda duplicado. Cuida la jerarquía: un solo `h1` visible.
4. **Vocabulario** (A5): en la pregunta «¿Qué quieres resolver en esta clase?», la palabra «clase» usa `data-voc="clase"`.
5. **Etiqueta del principio 3** (A6): en `PROPOSITOS.mostrar`, `nombre` y `corto` pasan a «Expresarse y organizarse». Revisa que el PDF y las tarjetas la usen.

### Pestaña Apoyos
6. **Nombre** (B1): la pestaña se llama «Apoyos específicos». En superior sigue «Ajustes razonables». Ajusta `probar_superior.cjs` si comprueba el texto.
7. **Voz del estudiante y la familia** (B3): después de «¿Qué le ayuda?», agrega un `textarea` opcional, de máximo 300 caracteres.
   - Etiqueta: «¿Qué dicen el estudiante y su familia?».
   - Ayuda: «Lo que les acomoda, lo que les preocupa o lo que proponen. No escribas diagnósticos».
   - Se guarda en `estado.estudiante.voz`, se valida en `normalizarEstudiante()`, va en el respaldo y en el PDF bajo «¿Qué le ayuda?», y activa el aviso de privacidad como los otros campos.
8. **Situaciones sin apoyos** (B4): si una situación marcada no tiene ninguna ficha de acceso en el nivel actual, muestra en los resultados, una vez por situación: «Aún no hay apoyos para "<situación>" en este nivel. Revisa las acciones DUA.» Con un enlace a `#dua`. Ejemplos para probar: «Identidad, lengua y pertenencia» en superior; «Lectura, escritura y cálculo» en parvularia.

## Lo que no cambia
- Las fichas, las fuentes, las razones de cada tarjeta, «Mi mochila», el PDF (salvo la etiqueta y el campo nuevo), los temas, el logo, la guía DUA y el aviso de privacidad.
- En teléfono, el comportamiento de «Filtros (n)» de la tarea 016.

## Criterios de aceptación
- [ ] Sin elegir momento se ven las 36 acciones del nivel, agrupadas por momento.
- [ ] Al marcar «Quiero evaluar de formas distintas», sus acciones quedan primero en cada grupo donde existan.
- [ ] Un respaldo o `localStorage` antiguo con `momento: "antes"` carga sin errores.
- [ ] La pestaña Apoyos muestra su propio `h1`; hay un solo `h1` visible por pestaña.
- [ ] En parvularia, la pregunta dice «¿Qué quieres resolver en esta experiencia de aprendizaje?».
- [ ] El campo de voz se guarda, se respalda, sale en el PDF y rechaza valores que no sean texto.
- [ ] En superior, marcar «Identidad, lengua y pertenencia» muestra el aviso de que no hay apoyos.
- [ ] Teclado, foco visible y lector de pantalla: los grupos por momento tienen encabezado y el conteo se anuncia.
- [ ] No hay desplazamiento horizontal a 390 px.
- [ ] Capturas de escritorio y teléfono en `docs/marca/017-filtros/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. Agrega una prueba `scripts/probar_momentos.cjs` para los momentos y el respaldo antiguo.
