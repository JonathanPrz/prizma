# Tarea 022 · Una guía por pestaña, sin ventanas automáticas

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/022-guias-por-pestana`

## Para qué

Después de la tarea 021, el dueño observó cuatro cosas:
1. Que se abran ventanas apenas se carga la página o se cambia de pestaña es invasivo.
2. «¿Cómo usar el DUA?» aparece en 3 lugares y se abre de varias formas. La pestaña de apoyos no tiene una guía equivalente.
3. La privacidad debe aparecer cuando la persona va a escribir datos, o quedar a la vista como una pregunta bajo los campos, no al entrar.
4. DUA tiene el encabezado subrayado «Acciones para todo el curso» sobre los resultados. Apoyos no tiene uno equivalente.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios
1. **Ninguna ventana se abre sola:**
   - Quita la apertura automática de la guía DUA y del aviso «Antes de empezar».
   - Elimina el diálogo `#aviso-apoyos`, sus claves y su lógica. Su contenido pasa a la guía de apoyos (punto 3) y a la privacidad (punto 4).
   - La única ventana que puede abrirse sin un clic es el aviso de privacidad, y solo la primera vez que se escriben datos (punto 4).
2. **Un solo acceso a cada guía en su pestaña:**
   - Bajo la bajada de cada pestaña, junto al botón «Filtros», va un enlace visible:
     - En DUA: «¿Cómo usar el DUA?».
     - En apoyos: «¿Cómo usar los apoyos individualizados?». En superior: «¿Cómo acordar ajustes razonables?».
   - Quita el enlace de la barra superior y el de la pregunta «¿Qué quieres resolver?».
   - En el pie quedan los 2 enlaces, uno por guía, además de «Privacidad».
   - La línea corta del panel de apoyos («Los apoyos se acuerdan…») ahora enlaza a la guía de apoyos.
3. **Guía de apoyos `#guia-apoyos`**, con el mismo formato que `#guia-dua`: título, lista numerada, nota de fuente y botón «Entendido». El texto cambia según el nivel. Usa exactamente este contenido.

   **En la escuela.** Título: «Cómo usar los apoyos individualizados».
   1. Parte por el DUA. Muchas barreras se resuelven con acciones para todo el curso.
   2. Describe la situación, no al estudiante: marca dónde encuentra barreras y con qué frecuencia.
   3. Anota qué le ayuda y qué dicen el estudiante y su familia.
   4. Elige primero adecuaciones de acceso. Las adecuaciones en los objetivos son solo para cuando el acceso no basta.
   5. Acuerda los apoyos con el estudiante, su familia y el equipo de apoyo, y regístralos en el PACI.
   6. Revisa cada cierto tiempo si siguen sirviendo.

   Nota: «Basado en el Decreto 83 (2015) y la CIF (OMS, 2001).»

   **En superior.** Título: «Cómo acordar ajustes razonables».
   1. Parte por el diseño universal. Muchas barreras se resuelven para todo el curso.
   2. Pregúntale al estudiante qué barreras encuentra y qué le ha servido antes.
   3. Marca esas situaciones y con qué frecuencia aparecen.
   4. Elige ajustes que mantengan los resultados de aprendizaje: cambia la forma, no la exigencia.
   5. Acuérdalos con el estudiante y la unidad de inclusión, y déjalos por escrito.
   6. Revisa cada semestre si siguen sirviendo.

   Nota: «Basado en la Ley 21.091, la Ley 20.422 y las orientaciones de la Subsecretaría de Educación Superior.»
4. **Privacidad donde se escribe:**
   - Bajo el campo «Iniciales» agrega el enlace «¿Qué datos puedo escribir?», que abre `#aviso-privacidad`.
   - Vuelve el comportamiento anterior a la tarea 021: el aviso de privacidad se abre una sola vez, la primera vez que la persona escribe en iniciales, «¿Qué le ayuda?», la voz del estudiante o una nota de Mi mochila. Se recuerda con `prizma.privacidad.v1`.
   - El enlace «Privacidad» del pie se mantiene.
5. **Encabezado de resultados en apoyos:**
   - Reemplaza el `h2` oculto «Resultados de apoyos» por un `h2` visible, con el mismo estilo que «Acciones para todo el curso» (línea inferior).
   - Texto: «Apoyos para <iniciales>» o «Apoyos para un estudiante». En superior: «Ajustes razonables para <iniciales>» o «Ajustes razonables para un estudiante». Se actualiza al escribir las iniciales.
   - La línea corta del acuerdo va debajo de ese encabezado.

## Lo que no cambia
El contenido de la guía DUA y su botón «Empezar» (que en teléfono abre los filtros), el aviso de privacidad completo, las fichas, Mi mochila, el PDF, los filtros y los temas.

## Criterios de aceptación
- [ ] En una visita nueva, por `#dua` o por `#apoyos`, no se abre ninguna ventana hasta que la persona hace clic en una guía o escribe datos.
- [ ] Cada pestaña tiene un solo enlace a su guía, en el mismo lugar. El pie tiene los 2 enlaces y «Privacidad».
- [ ] La guía de apoyos muestra el texto de escuela o de superior según el nivel.
- [ ] La primera vez que se escriben iniciales se abre el aviso de privacidad; la segunda, no. «¿Qué datos puedo escribir?» lo abre siempre.
- [ ] El encabezado visible de apoyos cambia con las iniciales y con el nivel.
- [ ] Foco correcto al abrir y cerrar cada guía, con teclado. Nunca hay dos diálogos abiertos.
- [ ] No hay desplazamiento horizontal a 390 px.
- [ ] Capturas en `docs/marca/022-guias/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. Ajusta `probar_avisos.cjs` y `probar_guia_dua.cjs` al nuevo comportamiento.
