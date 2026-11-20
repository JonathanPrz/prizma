# Tarea 068 · Paso 1 «Describe tu clase»: al instante, sin «Guardar» y con lo que ordena a la vista

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/068-describe-clase` · Pull request con destino `main`

## Para qué
El dueño marcó el taller, no presionó «Guardar» y creyó que Prizma lo ignoraba. El aviso de la tarea 066 solo parcha ese problema. Además, en el teléfono:
- el paso 1 mide 1.334 px (1.902 px con «Más detalles» abierto);
- las necesidades ocupan 702 px;
- lo único que ordena las acciones, actividad y evidencia, queda plegado a unos 1.170 px del título.

Un segundo debate de 10 especialistas, con moderador (20-11-2026), llegó a esta versión, y el dueño la aprobó.

**Solo en esta tarea puedes cambiar `data/necesidades.json`, y solo para agregar el campo `corto` de la sección 3.** No cambies `docs/fuentes/` ni `.claude/`.

## 1. Se aplica al instante
- Se quitan `#guardar-clase`, `borradorDua`, `actualizarAvisoBorradorDua`, `#aviso-borrador-dua` y `#guardar-borrador-dua`.
- Un solo oyente `change`/`input` en `#perfil` escribe en `estado.perfil` y `estado.necesidades`, y luego:
  - llama a `guardar()`, `pintarTarjetas()`, `pintarApoyos()` y `resumenClase()`;
  - actualiza la línea viva.
- **El foco se queda donde está y la página no salta** (tarea 062).
- `estado.claseGuardada` queda en `true` en cuanto hay alguna respuesta, para que el indicador de pasos siga funcionando.
- **«Limpiar respuestas»** pasa a ser «Borrar respuestas»: borra las respuestas del paso 1 y deja el foco en la primera casilla.

## 2. Orden y textos del paso 1
```
1. Describe tu clase
   Ayuda: «Todo es opcional. Lo que marques ordena al instante las acciones del paso 2. No oculta ninguna.»

   ¿Qué harán principalmente?   (fieldset; casillas nativas en 2 columnas)
     Ayuda: «Puedes marcar varias.»
     Escuchar o leer · Conversar o debatir · Experimentar o manipular · Crear algo · Moverse en la sala
     ── línea ──  (solo si el nivel tiene taller, como hoy)
     ☐ La clase es en taller, laboratorio o terreno
       Ayuda: «También suma apoyos de taller en "Para un estudiante".»

   ¿Cómo mostrarán lo que aprendieron?   (fieldset; casillas en 2 columnas)
     Escribiendo · Hablando o explicando · Haciendo o demostrando · En grupo · Observaré mientras trabajan

   Línea viva  (#conteo-paso1, role="status", espera de unos 400 ms)
     Sin marcas: «Marca lo que harán para ver primero lo que responde.»
     Con marcas: «8 de 36 acciones responden a lo que marcaste · [Ver acciones]»
       (el enlace lleva el foco al título del paso 2)
     Si hay casos de estudiantes y cambia el taller, agrega:
       «También cambian los apoyos de taller en tus N casos.»

   ▸ ¿Hay algo puntual que quieras resolver? (opcional)   (details)
     Si hay alguna marcada, se abre solo y el resumen dice «(N elegidas)».
     Ayuda: «Elige una o más. Las acciones se agrupan arriba por lo que elijas.»
     Casillas con la etiqueta corta (campo `corto`) y la frase completa
     (campo `texto`) como ayuda debajo, unida con aria-describedby.

   [Borrar respuestas]
```
- Los valores internos de actividad y evidencia **no cambian**; solo cambian las etiquetas visibles («Experimentar o manipular», «Crear algo» y «Moverse en la sala»).
- Las necesidades pasan de botones `aria-pressed` a casillas nativas.
- **La línea viva y `#conteo` del paso 2 salen de la misma función (`conteoDua`),** así que siempre dicen lo mismo.

## 3. Etiquetas cortas de las necesidades
En `data/necesidades.json`, agrega a cada necesidad el campo `corto`, con estos valores, en el orden actual:
1. Falta interés o un propósito claro
2. Se explica de una sola forma
3. Tareas largas sin pasos visibles
4. Se participa de una sola forma
5. Materiales en un solo formato
6. Una sola forma de mostrar lo aprendido
7. Una sola lengua y cultura
8. Ambiente con tensión o distracciones
9. Un solo nivel de desafío

`validarNecesidades` acepta `corto` como texto opcional. Si falta, usa `texto`. «Para lo que marcaste» del paso 2 sigue usando el `texto` completo como título de grupo.

## 4. La meta pasa al paso 3
- `#meta`, «¿Qué quieres que aprendan en esta clase?», pasa a ser la **primera pregunta del paso 3**, antes de la selección. Ayuda: «Quita las barreras, no el desafío. Va a tu documento.»
- Se guarda al escribir, como hoy, y sigue apareciendo en el documento.
- `estado.perfil.meta` no cambia, así que no hay que migrar datos.

## Pruebas
- Reescribe, sin debilitarlas, las pruebas de las tareas 039, 047 y 066 que usan `#guardar-clase`, el borrador o su aviso.
- Agrégalas a `scripts/probar_pagina.cjs` o a `scripts/probar_filtros_vista.cjs`:
  - al marcar taller sin presionar nada más, el conteo del paso 2 y la línea viva dicen «8 de 36 acciones responden a lo que marcaste» (básica). No existe `#guardar-clase`;
  - el foco se queda en la casilla marcada, y `scrollY` no cambia;
  - a 390 px, con las necesidades plegadas, el paso 1 mide **600 px o menos**;
  - las necesidades son casillas con su etiqueta corta, y su frase completa está asociada con `aria-describedby`. Con una marcada, al recargar, el `details` está abierto y dice «(1 elegida)»;
  - con un caso de estudiante, cambiar el taller agrega «También cambian los apoyos de taller en tus 1 casos» a la línea. Ajusta el plural: «en tu caso» con 1;
  - «Borrar respuestas» deja el paso 1 vacío y el conteo en «36 acciones para todo el curso»;
  - la meta está en el paso 3, se guarda y sale en el documento;
  - sin desplazamiento horizontal a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas del paso 1 a 390 y 1280 px, antes y después.

## Criterios de aceptación
- [ ] No hay botón «Guardar»: todo se aplica al marcar, sin mover el foco.
- [ ] Actividad y evidencia quedan a la vista. El taller va separado y dice que afecta a «Para un estudiante».
- [ ] La línea viva confirma el efecto y coincide con el conteo del paso 2.
- [ ] Las necesidades van plegadas, con etiqueta corta, y se abren si hay alguna marcada.
- [ ] La meta está en el paso 3.
- [ ] El paso 1 mide 600 px o menos a 390 px.
- [ ] Pasan el validador y todas las pruebas.
