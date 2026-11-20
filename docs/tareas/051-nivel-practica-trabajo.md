# Tarea 051 · «Práctica y trabajo» como nivel, sin modo Trabajo aparte

Estado: **v3, pendiente de una segunda revisión adversarial y de la aprobación del dueño** · Asignada a: Codex · Rama: `codex/051-practica-trabajo` · Pull request con destino `main`

## Para qué
Decisión del dueño (20-11-2026): Prizma tiene demasiados modos. El modo «Para el trabajo» se integra como un nivel más, junto con la práctica profesional:

> Nivel: Parvularia · Básica · Media · Superior · **Práctica y trabajo**

**Por qué es un nivel y no una parte del caso de clase** (aclaración del dueño, 20-11-2026): la práctica no es una asignatura. Quien la usa es la coordinación de práctica, quien acompaña al estudiante en su práctica o primer empleo o, en el futuro, quien asesora en inclusión a una empresa. Para ese rol, las acciones DUA y las adecuaciones de clase no tienen sentido.

**La v1 fue rechazada por la revisión adversarial,** por cuatro razones:
- las fichas de práctica no habrían aparecido, porque sus `niveles` son media o superior;
- un caso de trabajador no puede guardar fichas de práctica;
- el documento para el centro depende del caso de estudiante;
- el aviso de privacidad aplicaba el Código del Trabajo a practicantes sin contrato.

Esta versión es la más pequeña que cumple la decisión. Ordenar los grupos y unir las guías queda para una tarea 052.

Actualiza `docs/arquitectura.md` con la sección «Ajuste del dueño (20-11-2026)». Este ajuste reemplaza las decisiones 1 (pantalla de inicio) y 3 (mochila por ámbito).

**No cambies `data/recomendaciones.json` ni `docs/fuentes/`.**

## Cambios

### 1. Entrada y nivel
- Se eliminan `#inicio` y el botón «Cambiar ámbito». Al entrar se ve Prizma con el selector de nivel.
- El selector `#nivel` suma la opción «Práctica y trabajo» (`practica-trabajo`), con la ayuda «Para coordinar la práctica profesional, acompañar el primer empleo o asesorar a una empresa». Con ella:
  - se ocultan las pestañas de Educación;
  - se muestra `#panel-trabajo`, reutilizando lo que hoy hace `mostrarPestana("trabajo")`.
- Cambiar de nivel con casos guardados pide confirmación, como hoy.

### 2. El caso del nivel nuevo
Usa el modelo de trabajador que ya existe (`estado.trabajadores`), con estos campos nuevos:
- **`etapa`**, con la pregunta «¿En qué etapa está?» y las opciones «Prepara su práctica» (`prepara`), «Está en práctica» (`practica`) y «Primer empleo o trabajo» (`trabajo`). El valor por defecto es `trabajo`, para que los casos antiguos se vean igual.
- **`nivelOrigen`**, con la pregunta «¿Desde qué nivel hace la práctica?» y las opciones «Media técnico-profesional» (`media`) y «Superior (IP, CFT o universidad)» (`superior`). Solo se muestra si la etapa es `prepara` o `practica`.

Con esos campos:
- **`aplica()`:** en este nivel, una ficha `practica-profesional` aplica si su `niveles` incluye el `nivelOrigen` del caso. Así se respeta la diferencia legal entre media (Decreto 2.516) y superior. Las fichas `trabajo` aplican como hoy.
- **Qué se muestra según la etapa, sin duplicados:**
  - con `prepara` o `practica`: los apoyos de práctica en sus 3 grupos de hoy (institución, centro y estudiante). Los ajustes `trabajo` no se muestran;
  - con `trabajo`: los ajustes `trabajo` como hoy. Las fichas de práctica no se muestran.
- **`seleccionValidada`** de los trabajadores acepta los tipos `trabajo` y `practica-profesional`. Una prueba comprueba que una `pp-*` elegida sobrevive a recargar y a restaurar un respaldo.
- **Roles del acuerdo:** agrega a `ROLES_TRABAJO` «Liceo o institución (profesor tutor)» y «Centro de práctica». Con etapa de práctica, el rol de la persona se llama «Estudiante en práctica»; con etapa de trabajo, «Persona trabajadora».

### 3. El documento para el centro y la seguridad
- `elegidasCentro`, `documentoParaCentro`, `verDocumentoCentro` y `seguridadActiva` reciben el caso como parámetro, en vez de leer `estudianteActual()` dentro.
- El documento para el centro se ofrece en el nivel nuevo cuando la etapa es de práctica.
- La regla de siempre se mantiene: el estudiante decide qué ajustes comparte, y el documento no lleva datos personales ni notas.

### 4. Media y superior
- Se quita la casilla «Este estudiante hará su práctica profesional».
- En su lugar va el botón **«Preparar su práctica»**. Crea un caso en el nivel nuevo, copiando las iniciales y las situaciones del estudiante, con etapa `prepara` y `nivelOrigen` igual al nivel actual. Después cambia al nivel nuevo, con confirmación.
- Bajo el botón, la ayuda: «Pasa sus datos al nivel Práctica y trabajo».

### 5. Privacidad
El nivel nuevo tiene su propio aviso, con estas frases:
- «Escribe solo iniciales y describe situaciones, sin diagnósticos.»
- «Si es estudiante, sus datos tienen la protección especial de la Ley 21.719, sobre todo si es menor de edad.»
- «Si tiene contrato de trabajo, rige además la reserva del Código del Trabajo (art. 154 ter).»
- «La persona decide qué contar al centro o al empleador.»

### 6. Mochila y respaldo
- «Borrar los datos de Trabajo» pasa a «Borrar los datos de práctica y trabajo».
- El respaldo sigue siendo uno solo.

### 7. Migración de datos guardados
- **`ambito: "trabajo"`:** el nivel activo pasa a `practica-trabajo`. Si el estado o el respaldo también tiene `perfil.nivel` de educación con casos escolares, ese nivel se guarda en `estado.nivelEducacion` y se recupera al volver a un nivel educativo.
- **Estudiante con `practicaProfesional: true`:** se crea un caso en el nivel nuevo con sus iniciales, sus situaciones y sus `pp-*` elegidas, con etapa `practica` y `nivelOrigen` igual al nivel educativo. El estudiante original conserva lo demás. Se avisa una vez: «La práctica de {iniciales} ahora está en el nivel Práctica y trabajo».
- Los respaldos antiguos se restauran sin errores ni pérdidas.

### 8. Validador y textos
- `validar_catalogo.py`: agrega `practica-trabajo` solo a la comprobación de nivel conocido (línea 32), **no** a la cobertura DUA (líneas 69-71). En `app.js`, lo mismo en `validarCatalogo`.
- Actualiza `AGENTS.md` («Qué es Prizma»), el subtítulo y el pie de página.

## Pruebas
- Reescribe las pruebas que usan `#inicio`, `elegir-educacion`, `elegir-trabajo` o la casilla de práctica, sin debilitar lo que comprueban.
- Prueba nueva, `scripts/probar_practica_trabajo.cjs`:
  - **nivel nuevo:** con etapa `practica` y `nivelOrigen: "media"` aparecen `pp-plan` y `pp-visita`; con `superior` aparece `pp-plan-superior`; con etapa `trabajo` aparecen los ajustes `tr-*` y ninguna `pp-*`;
  - **documento para el centro:** funciona desde un caso del nivel nuevo;
  - **botón «Preparar su práctica»:** crea el caso con las iniciales y las situaciones copiadas;
  - **migración:** un estado con `ambito: "trabajo"` y otro con `practicaProfesional: true` cargan sin perder datos;
  - **aviso de privacidad:** el del nivel nuevo menciona la Ley 21.719 y el art. 154 ter solo con contrato;
  - **ancho:** no hay desplazamiento horizontal a 390 px.

## Fuera de esta tarea (tarea 052)
- Mostrar práctica y trabajo juntos en un caso de transición.
- La guía unificada del nivel.

## Criterios de aceptación
- [ ] Sin pantalla de ámbito. El nivel nuevo muestra práctica o trabajo según la etapa, sin duplicados.
- [ ] Las fichas de práctica respetan media o superior según `nivelOrigen`.
- [ ] El documento para el centro funciona en el nivel nuevo.
- [ ] Los datos antiguos se conservan y se ven.
- [ ] El aviso de privacidad distingue estudiante de trabajador con contrato.
- [ ] Pasan el validador y todas las pruebas.
