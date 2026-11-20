# Tarea 051 · «Práctica y trabajo» como quinta opción del nivel, sin modo Trabajo aparte

Estado: **v4, tras dos revisiones adversariales; pendiente de aprobación del dueño** · Asignada a: Codex · Rama: `codex/051-practica-trabajo` · Pull request con destino `main`

## Para qué
Decisiones del dueño (20-11-2026):
1. **Menos modos.** El selector de nivel tiene 5 opciones: Parvularia, Básica, Media, Superior y **Práctica y trabajo**. Desaparecen la pantalla «¿Dónde quieres apoyar?» y el botón «Cambiar ámbito».
2. **La práctica es otro rol, no una asignatura.** Quien la usa es la coordinación de práctica, quien acompaña un primer empleo o quien hace ajustes en un lugar de trabajo. Para ese rol, las acciones DUA y las adecuaciones de clase no tienen sentido.
3. **Sirve a cualquiera que llegue desde afuera:** otra institución, profesionales de inclusión, recursos humanos o la propia persona. Ningún texto supone quién usa la página.

**Idea central de esta versión:** el nivel nuevo **es el ámbito Trabajo que ya existe por dentro** (`estado.ambito === "trabajo"`, `estado.trabajadores`, `#panel-trabajo`). Solo se muestra como una quinta opción del selector. El nivel educativo (`estado.perfil.nivel`) no se toca. Así, entrar y salir del nivel nuevo no cambia ni marca para revisión los casos de estudiantes.

**No cambies `data/recomendaciones.json`, `data/fuentes.json` ni `docs/fuentes/`.**

## 1. Selector y entrada
- `#nivel` suma la opción «Práctica y trabajo» (valor de interfaz `practica-trabajo`).
- **Al elegirla:** `estado.ambito = "trabajo"` y se muestra `#panel-trabajo`. `estado.perfil.nivel` conserva el nivel educativo anterior.
- **Al elegir un nivel educativo:** `estado.ambito = "educacion"` y se aplica el nivel como hoy.
- **El selector muestra el valor según el ámbito:** si el ámbito es Trabajo, «Práctica y trabajo»; si no, `perfil.nivel`.
- **`#nivel-campo` queda siempre visible,** también en el nivel nuevo. Hoy `mostrarPestana("trabajo")` lo oculta: corrígelo.
- **Entrar al nivel nuevo o salir de él** no pide confirmación ni marca casos para revisión. La confirmación de hoy se mantiene solo entre niveles educativos.
- Se eliminan `#inicio`, «Cambiar ámbito» y su lógica. Si no hay ámbito guardado, se entra a Educación.
- Ayuda del selector, cuando está elegido el nivel nuevo: «Para coordinar la práctica profesional, acompañar un primer empleo o hacer ajustes en un lugar de trabajo».

## 2. El caso del nivel nuevo
Usa `estado.trabajadores`, con dos campos nuevos que valida `normalizarTrabajador`:
- **`etapa`:** `practica` o `trabajo`. Pregunta: «¿Para qué es este caso?», con las opciones «Práctica profesional» y «Primer empleo o trabajo». El valor por defecto es `trabajo`, así los casos antiguos se ven igual.
- **`nivelOrigen`:** `media` o `superior`. Pregunta: «¿Desde qué nivel hace la práctica?», con las opciones «Media técnico-profesional» y «Superior (IP, CFT o universidad)». Solo se muestra con etapa `practica`. Por defecto, `media`.

Con etapa `practica`:
- se muestran solo las fichas `practica-profesional` cuyo `niveles` incluye el `nivelOrigen`, en sus 3 grupos. No se muestra ninguna ficha `trabajo`;
- los grupos se llaman «Lo que hace la institución educativa», «Lo que hace el centro de práctica» y «Lo que prepara la persona». Cambia esos textos en `TIPOS_PRACTICA` y en `nombreGrupoPractica`, que hoy decide con `esSuperior()` y debe decidir con el `nivelOrigen` del caso.

Con etapa `trabajo`:
- se muestran solo las fichas `trabajo`, como hoy;
- bajo el título de los ajustes va la línea: «Los hace el empleador. También sirven para conversarlos con él».

Funciones que deben recibir el caso (`e`) en vez de usar `estudianteActual()` por defecto en este nivel:
- `aplica`, `puntaje`, `compatibleModalidad`;
- `elegidasCentro`, `documentoParaCentro`, `verDocumentoCentro`, `nombreGrupoPractica`;
- `seguridadActiva` y `pintarSeguridad`. Con etapa `practica`, la seguridad muestra `pp-seguridad`; con etapa `trabajo`, `tr-alertas-visuales`.

Guardado y estado del caso:
- **`seleccionValidada`** de los trabajadores acepta `trabajo` y `practica-profesional`.
- **`alternar` y `tarjeta`** guardan una ficha `practica-profesional` en el trabajador activo cuando el ámbito es Trabajo, no en el estudiante.
- **`elegidasTrabajo`** cuenta las fichas `trabajo` y las `practica-profesional` del caso. La usan `erroresAcuerdo`, la mochila y el documento, así que un caso de práctica puede llegar a «Acuerdos completos».

Roles del acuerdo, según la etapa:
- etapa `practica`: «Estudiante en práctica», «Institución educativa (profesor tutor)», «Centro de práctica» y «Familia o apoderado»;
- etapa `trabajo`: los de `ROLES_TRABAJO` de hoy, con «Persona trabajadora».

Agrega los roles nuevos a la validación de `normalizarAcuerdo`, para que no se descarten.

## 3. Documentos y textos según la etapa
- **Etapa `practica`:**
  - documento para el centro, en el que la persona elige qué ajustes compartir y que no lleva datos personales ni notas;
  - título: «Plan de apoyos para la práctica profesional».
- **Etapa `trabajo`:** documento de trabajo con sus secciones elegibles (tarea 046) y el título de hoy.
- **`PIE_TRABAJO`, `AVISO_TRABAJO` y el aviso de privacidad del nivel**, según la etapa:
  - siempre: «Escribe solo iniciales y describe situaciones, sin diagnósticos. La persona decide qué contar y a quién»;
  - etapa `practica`: «Sus datos tienen la protección especial de la Ley 21.719, sobre todo si es menor de edad»;
  - etapa `trabajo`: «Con contrato de trabajo, rige además la reserva del Código del Trabajo (art. 154 ter)». No se menciona el art. 154 ter en la etapa `practica`.
- **Pie de página:** «tu empresa» pasa a «la empresa o institución».

## 4. Media y superior
- Se quita la casilla «Este estudiante hará su práctica profesional» y su bloque.
- En su lugar va el botón **«Preparar su práctica»**. Crea un caso en el nivel nuevo con etapa `practica`, `nivelOrigen` igual al nivel actual, y las iniciales y situaciones del estudiante. Después cambia al nivel nuevo.
  - Si ya existe un caso de práctica con esas iniciales, lo abre en vez de crear otro.
  - Si ya hay 10 casos, el botón se deshabilita con la ayuda «Máximo 10 casos en Práctica y trabajo».

## 5. Migración (en `normalizarDatos`, que también procesa los respaldos)
- `estado.ambito` se conserva tal cual: `trabajo` abre el nivel nuevo.
- **Estudiante con `practicaProfesional: true`:**
  - se crea un caso de práctica con sus iniciales, sus situaciones, sus fichas `pp-*`, etapa `practica` y `nivelOrigen` igual a `perfil.nivel` (si no es media ni superior, `media`);
  - las `pp-*` **se mueven**: se quitan del estudiante;
  - se pone `practicaProfesional: false`, así la migración no se repite;
  - si ya hay 10 trabajadores, no se migra, y se muestra una vez: «No se pudo pasar la práctica de {iniciales}: hay 10 casos en Práctica y trabajo»;
  - si se migra, se muestra una vez: «La práctica de {iniciales} ahora está en el nivel Práctica y trabajo».
- Los respaldos antiguos se restauran sin errores ni pérdidas.

## 6. Mochila y arquitectura
- La mochila sigue separada por ámbito, como hoy. Con el nivel nuevo, «Borrar los datos de Trabajo» pasa a «Borrar los datos de Práctica y trabajo».
- En `docs/arquitectura.md`, agrega «Ajuste del dueño (20-11-2026)»: reemplaza la decisión 1 (pantalla de inicio) y mantiene la decisión 3 (mochila separada).
- Actualiza `AGENTS.md` («Qué es Prizma») y el subtítulo.
- Agrega `practica-trabajo` a la lista de niveles de la interfaz solamente. El validador y el catálogo no cambian.

## Pruebas
- Reescribe sin debilitarlas las pruebas que usan `#inicio`, `elegir-educacion`, `elegir-trabajo`, «Cambiar ámbito» o la casilla de práctica.
- Prueba nueva, `scripts/probar_practica_trabajo.cjs`:
  - elegir «Práctica y trabajo» y volver a «Básica» conserva `perfil.nivel`, la clase DUA y los acuerdos completos de los estudiantes;
  - el selector sigue visible en el nivel nuevo;
  - etapa `practica` con `nivelOrigen: "media"`: aparecen `pp-plan` y `pp-visita` y ninguna `tr-*`; con `superior`, aparece `pp-plan-superior`;
  - etapa `trabajo`: aparecen `tr-*` y ninguna `pp-*`;
  - un caso de práctica con solo fichas `pp-*` llega a «Acuerdos completos» y aparece en la mochila y en el documento;
  - el documento para el centro funciona desde el nivel nuevo, y su texto no menciona el art. 154 ter;
  - «Preparar su práctica» copia los datos, no duplica el caso al presionarlo dos veces y respeta el máximo de 10;
  - migración: un estado con `practicaProfesional: true` se migra una sola vez, aunque se cargue dos veces;
  - no hay desplazamiento horizontal a 390 px.

## Fuera de esta tarea (052)
- Un caso que pase de la práctica al primer empleo conservando su historia.
- La guía unificada del nivel.

## Criterios de aceptación
- [ ] Hay 5 opciones de nivel, sin pantalla de ámbito. El nivel nuevo no altera los casos de Educación.
- [ ] Etapa de práctica o de trabajo, con sus fichas, roles, documentos y avisos, sin mezclar.
- [ ] La práctica migra una vez, sin pérdidas.
- [ ] Ningún texto supone un solo rol.
- [ ] Pasan el validador y todas las pruebas.
