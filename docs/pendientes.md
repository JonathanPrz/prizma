# Pendientes

Actualizado el 21-11-2026. Retomamos el jueves 26-11-2026.

## Para decidir o revisar
1. **Revisión de fuentes incompleta (tarea 043).**
   - Se integraron los lotes L1 y L3 (PR #49 y #50), la revisión adversarial (PR #52) y las correcciones de 28 fichas (PR #53).
   - Los lotes L2 y L4 a L8 (PR #43 a #48 y #51) se cerraron sin integrar.
   - Hay que confirmar si esas fuentes se revisaron por otra vía o si falta revisarlas. Si falta, se puede usar un agente con el modelo económico, lote por lote.
2. **Dos «Guardar acuerdos»** en el paso 3 de un estudiante: el del formulario y el de la barra de continuar. Viene de antes. Decidir cuál queda; es una tarea chica.
3. **Botón para limpiar o borrar el avance, en un lugar más accesible.** El dueño lo quiere discutir en un consejo.
   - Hoy: el paso 1 de DUA tiene «Borrar respuestas», que borra solo ese paso. Cada caso tiene «Quitar este caso». En la mochila, «Borrar los datos de Educación» o «de Práctica y trabajo» está dentro de «Datos y respaldo», plegado y con confirmación.
   - Preguntas:
     - ¿Qué se borra: el paso, el caso, el curso o todo?
     - ¿Dónde va?
     - ¿Cómo se evita un borrado por error: confirmación, deshacer u ofrecer guardar un respaldo antes?
4. **Probar con docentes reales,** con la guía de `docs/pruebas-usuarios/`. Ninguna tarea probó:
   - la impresión en papel;
   - Safari y Firefox;
   - teléfonos reales;
   - un lector de pantalla real (NVDA o VoiceOver);
   - el zoom sobre 200 %.

## Ideas guardadas
- **El panel lateral se centra junto con la columna.** En escritorio, en el paso 1 y en «Para un estudiante», la columna queda corrida a la izquierda. Se dejó así para que la columna no se mueva entre pasos (tarea 076). Ahora la mochila siempre ocupa ese espacio desde 80 rem, así que puede que ya no se note. Revisarlo.
- **Tarjetas compactas** (solo el título) si los resultados se sienten largos.

## Cómo seguimos trabajando
- **Codex sin créditos:**
  - las tareas las implementa un agente de Claude con el modelo económico (sonnet), en una rama `codex/NNN-*`, y Claude revisa el PR;
  - los consejos se pueden correr en ChatGPT con el bloque de `docs/consejos/`.
- **Después de cada tarea que salga de un consejo,** el secretario de actas actualiza `docs/bitacora.md`.
