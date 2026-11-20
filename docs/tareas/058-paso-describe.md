# Tarea 058 · Paso 1 «Describe»: casos, áreas, frecuencia y redacción de las situaciones

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/058-paso-describe` · Pull request con destino `main`

## Para qué
El dueño encontró el paso 1 desordenado y la redacción de las situaciones difícil de entender. Aprobó estos cambios el 20-11-2026, después de dos revisiones adversariales. Valen para «Para un estudiante» y para «Práctica y trabajo», que usan el mismo formulario.

**Solo en esta tarea puedes cambiar `data/recomendaciones.json`, y solo para lo que pide la sección 5.** No cambies `docs/fuentes/` ni `.claude/`.

## 1. Casos
- **Chip de tamaño natural.** El chip del caso deja de ocupar todo el ancho.
- **Sin «Sin acuerdos».** El chip dice solo el nombre («JP»). Si el caso está «Por revisar», dice «JP · Por revisar» en texto visible, sin depender de un ícono. Para «Acuerdos completos» no se agrega nada: el ✓ se reserva para «elegido».
- **«Quitar este caso»** es un botón `.boton-sutil` de 44 px de alto, separado de la fila de chips, con ese texto visible. El `aria-label` agrega a quién: «Quitar este caso: JP». La confirmación (`confirm`) se mantiene.
- **«Agregar otro caso»** queda donde está, con su ayuda.
- Lo mismo vale para `#lista-trabajadores` y `#quitar-trabajador`.

## 2. Áreas como acordeón en una columna
- Las 5 áreas van en **una sola columna**, con botones del mismo ancho (100 %), alineados a la izquierda, también en escritorio.
- **Acordeón real:** las situaciones de cada área se abren **justo debajo de su botón**, no al final de las cinco. Mueve cada grupo de `#dimensiones` dentro de su área (en `sincronizarEstudiante` y en su equivalente de Trabajo). El botón mantiene `aria-expanded` y `aria-controls` hacia su grupo.
- **Abierto o cerrado** se indica solo con «+» o «−».
- **Elegido = tiene situaciones marcadas** (frecuencia distinta de «No aplica»), esté abierta o cerrada. Ese botón usa el estilo de elegido: fondo `--acento-suave`, borde `--acento` y ✓ en un `span` con `aria-hidden`. El texto visible dice «(2 marcadas)». Un área abierta sin nada marcado se ve neutra.
- Quita el título «¿Con qué frecuencia encuentra estas situaciones?» y su `div hidden`. En su lugar, bajo la pregunta de áreas, va una sola ayuda: **«¿Con qué frecuencia tiene dificultades en estas situaciones?»**
- Quita la línea a la derecha de cada situación (`legend`). La única separación es entre áreas.

## 3. Frecuencia como segmentos, con radios nativos
- Mantén los `input type="radio"` nativos, ocultos visualmente pero no con `display: none`, para conservar el teclado (flechas) y el lector de pantalla. Cada `label` se ve como una celda de 44 px.
- Las cuatro opciones van en una fila de 4 columnas iguales. A menos de 30rem, en una grilla de 2×2 alineada.
- **Marcado:** fondo `--acento-suave`, borde `--acento` y ✓ (`aria-hidden`). **Excepción: «No aplica» marcado se ve neutro**, para no llenar la pantalla de azul.
- **Foco:** `:focus-visible` en la celda.

## 4. Redacción de las situaciones
En `DIMENSIONES` (`app.js`), los números no cambian, porque los datos guardados usan números. Cambian el título y la frase. Las frases empiezan con mayúscula y terminan con punto.

| # | Título | Frase en Educación (`DIMENSIONES[n][1]`) |
|---|---|---|
| 1 | Organizarse y mantener la atención | Cuando hay tareas de muchos pasos, instrucciones largas, cambios de rutina sin aviso o debe empezar una tarea. |
| 2 | Lectura, escritura y cálculo | Cuando debe leer textos largos, copiar de la pizarra, escribir a mano o calcular de memoria. |
| 3 | Comprender lo que se dice o se lee | Cuando las instrucciones son solo orales o hay lenguaje figurado o palabras nuevas. |
| 4 | Relacionarse con otros | En trabajos en grupo, recreos, al exponer, con normas que nadie explica o cuando lo molestan. |
| 5 | Manejar las emociones | En evaluaciones, imprevistos, esperas o cuando algo le frustra. |
| 6 | Información que se ve | Cuando debe ver la pizarra, leer letra pequeña o interpretar imágenes y gráficos. |
| 7 | Ruido, luz y otros estímulos | Con ruido, luz fuerte, mucha gente, ciertas texturas u olores. |
| 8 | Moverse y usar las manos | Al escribir a mano, manipular materiales o desplazarse. |
| 9 | Salud y energía | En jornadas largas, con dolor o al volver de ausencias por tratamiento. |
| 10 | Identidad, lengua y pertenencia | Cuando la clase usa solo español, no considera su cultura o no se siente parte del curso. |
| 11 | Lugar, horarios y actitudes | Cuando la sala, los horarios, los materiales o la tecnología no le sirven, o hay actitudes que lo excluyen. |
| 12 | Expresarse oralmente | Cuando debe responder en voz alta, explicar con sus palabras o hablar frente a otros. |
| 13 | Información que se oye | Cuando debe escuchar al docente, oír con ruido de fondo o ver videos sin subtítulos. |
| 14 | Tareas con poco desafío | Cuando termina antes y no hay más, la práctica es repetitiva o no puede profundizar. |

Nueva lista `EJEMPLOS_TRABAJO`, en el mismo orden:
1. Cuando hay encargos largos, varias tareas a la vez, plazos, interrupciones o cambios sin aviso.
2. Cuando debe leer manuales o correos largos, llenar formularios o hacer registros escritos.
3. Cuando las instrucciones son solo verbales, en capacitaciones o con procedimientos nuevos.
4. En reuniones, trabajo en equipo, atención de público, con normas que nadie explica o cuando lo molestan.
5. Con presión de tiempo, cambios imprevistos, conflictos o evaluaciones de desempeño.
6. Cuando debe leer pantallas, documentos impresos o señalética.
7. Con ruido, luz intensa, espacios concurridos u olores.
8. Al desplazarse, cargar, usar herramientas o mantener una postura.
9. En jornadas largas, con dolor o al volver de controles o licencias médicas.
10. Cuando el equipo usa solo español, no considera su cultura o no se siente parte del equipo.
11. Cuando el lugar, el acceso o los horarios no le sirven, o hay actitudes del equipo o la jefatura que lo excluyen.
12. En reuniones, llamadas, presentaciones o atención telefónica.
13. En reuniones y llamadas, con alarmas sonoras o ruido de fondo.
14. Cuando las tareas son repetitivas, tiene pocas responsabilidades o no puede aprender más.

Además:
- **`CIF_AVISO`:** «Las situaciones describen dónde aparecen las barreras, no rasgos del estudiante (CIF, OMS 2001)». En Trabajo, «… no rasgos de la persona …» si hoy hay una versión propia.
- **El aviso de `#revision-situaciones-texto`** nombra «Visión» y «Audición». Cámbialos por «Información que se ve» e «Información que se oye».
- **`scripts/exportar_revision.py`:** actualiza su lista `DIMENSIONES` con los títulos nuevos.

## 5. Catálogo: situaciones de dos fichas de desregulación
Solo cambia el campo `dimensiones` de estas dos fichas en `data/recomendaciones.json`:
- `dec-antes-gatillantes`: `[5, 7, 1, 4]`;
- `dec-antes-demanda`: `[5, 1, 2]`.

La Circular 586 nombra como gatillos las transiciones, la demanda académica y el acoso escolar. Así el motivo «Porque marcaste…» y la tabla del documento quedan correctos. No cambies nada más del catálogo.

## Pruebas
- Ajusta las pruebas que buscan los títulos antiguos, sin debilitarlas: `probar_estudiante.cjs` («Visión (seguido)»), `probar_adversarial.cjs` («Audición») y cualquier otra que falle por los textos.
- **`probar_trabajo.cjs`** compara `EJEMPLOS_TRABAJO` con `docs/tareas/032-pestana-trabajo.md`. Haz que compare con la lista numerada de esta tarea (`docs/tareas/058-paso-describe.md`), sin tocar la tarea 032.
- Agrégalas a `scripts/probar_pagina.cjs`:
  - a 390 px, el chip de un caso nuevo no ocupa todo el ancho y no dice «Sin acuerdos». Uno «Por revisar» lo dice en texto;
  - «Quitar este caso» mide al menos 44 px de alto y su `aria-label` incluye las iniciales;
  - al abrir «Contexto e identidad», su primera situación aparece entre ese botón y el siguiente;
  - un área con una situación en «Seguido» tiene el estilo de elegido y «(1 marcada)», también cerrada. Una abierta sin marcas no lo tiene;
  - las opciones de frecuencia son radios nativos. Con flecha derecha cambia la opción marcada, y «No aplica» marcado no tiene fondo `--acento-suave`;
  - a 390 px, las 4 opciones forman una grilla de 2×2 alineada, sin desplazamiento horizontal;
  - el motivo de una tarjeta dice «Porque marcaste: Información que se ve (seguido)».

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas del paso 1 a 390 y 1280 px, antes y después.

## Criterios de aceptación
- [ ] Chips de caso sin «Sin acuerdos» y «Quitar este caso» como botón sutil.
- [ ] Áreas en una columna, como acordeón real, y «elegido» solo cuando hay marcas.
- [ ] Frecuencia en segmentos con radios nativos, con «No aplica» neutro.
- [ ] Las 14 situaciones y los 14 ejemplos de trabajo con la redacción nueva.
- [ ] Solo cambian las `dimensiones` de las dos fichas de desregulación.
- [ ] Pasan el validador y todas las pruebas.
