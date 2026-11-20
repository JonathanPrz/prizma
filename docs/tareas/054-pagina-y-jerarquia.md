# Tarea 054 · Una columna, tarjetas ordenadas y pasos que no se pierden

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/054-pagina-jerarquia` · Pull request con destino `main`

## Para qué
Corrige por qué la gente se pierde hoy (hallazgos H1, V0, V7, C6 y C7 de `docs/auditorias/050-interfaz/README.md`) y ordena la página. El dueño aprobó estas decisiones el 20-11-2026, después de una revisión adversarial:
- **Una sola columna centrada** en todos los anchos, **sin panel lateral**.
- **Recomendaciones en lista,** no en grilla.
- **Las tarjetas muestran siempre** los pasos y los avisos. Solo se pliegan «Por qué funciona» y las fuentes.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Ancho de lectura (V7)
- El flujo de cada panel (`#panel-dua`, `#panel-apoyos`, `#panel-trabajo`) y la barra de contexto (`#contexto`) usan una columna centrada de `max-width: 50rem`.
- La cabecera y el pie pueden seguir más anchos.
- `.bajada` y los párrafos largos llevan `max-width: 70ch`.

## 2. Recomendaciones en lista
`.tarjetas` usa siempre una sola columna (`grid-template-columns: minmax(0, 1fr)`) y `gap: 1rem`. Quita la regla de 2 columnas.

## 3. Orden dentro de la tarjeta (`tarjeta()` en `app.js`)
1. **Arriba:** `t-arriba`, con el tipo y la etiqueta DUA.
2. **Título** (h3 o h4).
3. **Motivo** (`t-razon`: «Porque marcaste…», «Porque usa…» o «Responde a lo que marcaste…»), en `--tenue` y 14 px, no en verde. Va bajo el título.
4. **«Qué busca»,** si está.
5. **Avisos, siempre visibles:** «Último recurso», «¿Lo que se evalúa es esa habilidad?», «Ya está considerado en el DUA», el aviso de estudiantes cubiertos y el de repetidas.
6. **Pasos** (`ol`).
7. **Versión para el curso,** si está.
8. **Pie de la tarjeta (`t-abajo`):** el respaldo a la izquierda y «Elegir» a la derecha, separados del resto por una línea `--linea`.
9. **Un solo `details`** «Por qué funciona y fuentes», cerrado, con el porqué y la lista de fuentes. Reemplaza el párrafo `t-porque` suelto y el `details.fuentes` actual.

- `alternar()` vuelve a dibujar las tarjetas. Conserva abierto ese `details` si estaba abierto: guarda los ids abiertos antes de repintar y ábrelos después, igual que se hace con `details[data-grupo]`.
- El documento PDF no cambia: sigue mostrando el porqué y las fuentes completos.

## 4. Barra de continuar en todos los anchos
- `#barra-continuar` se ve también en escritorio, centrada en la misma columna de 50rem.
- Muestra a la izquierda el conteo del caso o del curso («3 elegidos para JP», «5 acciones para el curso»), y a la derecha `#continuar`.
- **V0 y C6:** la barra nunca tapa el paso activo. Al entrar a un paso o mover el foco, el título del paso y su primer campo quedan visibles sobre la barra y bajo el indicador. Usa el `scroll-padding` que ya existe y ajústalo a la altura real de la barra.
- **Zoom:** con 200 % o más de zoom en 1280 px (640 px CSS o menos), el indicador de pasos deja de ser fijo (`position: static`), para no tapar contenido.

## 5. El indicador de pasos avanza (H1)
- En los tres paneles, `aria-current="step"` y el estilo activo pasan a «2 Elige» al abrir los resultados, y a «3 Acuerda» al abrir los acuerdos.
- Un paso terminado muestra «✓» (`aria-hidden`) antes de su nombre.

## 6. Errores junto a su campo (C7)
- En `guardarAcuerdos()` y `guardarAcuerdosTrabajo()`, cada error se muestra bajo su campo, con `aria-invalid="true"` y `aria-describedby` hacia su mensaje.
- El foco va al primer campo con error.
- El resumen arriba se mantiene, pero sin repetir el texto completo de cada error: «Revisa 3 campos».
- Al corregir un campo, se quitan su `aria-invalid` y su mensaje.

## Pruebas
- Las pruebas actuales siguen pasando. Ajusta solo las que dependen del orden de la tarjeta o de la grilla, sin debilitarlas.
- Prueba nueva, `scripts/probar_pagina.cjs`, con Chromium (`process.env.CHROMIUM_BIN` o el de Playwright):
  - a 1280 px, el ancho del contenido de `#panel-apoyos` es de 800 px o menos, y las tarjetas están en una columna;
  - en una tarjeta con aviso, el aviso y los pasos se ven sin abrir nada, y «Por qué funciona y fuentes» está cerrado;
  - al elegir una tarjeta con ese `details` abierto, sigue abierto;
  - a 390 y 1280 px, tras guardar la descripción, el título «2.» queda visible y no lo tapan la barra ni el indicador;
  - en Práctica y trabajo, tras guardar, `aria-current` está en «2 Elige» (H1);
  - con los acuerdos vacíos, el foco va al primer campo con error, que tiene `aria-invalid="true"` (C7);
  - con un viewport de 640 × 400 px, el indicador no es fijo y no hay desplazamiento horizontal;
  - sin desplazamiento horizontal a 390 px.

## Criterios de aceptación
- [ ] Una columna de hasta 800 px, sin panel lateral, y tarjetas en lista.
- [ ] Pasos y avisos siempre visibles. Solo se pliegan el porqué y las fuentes.
- [ ] La barra muestra el conteo y nunca tapa el paso activo.
- [ ] El indicador avanza en los tres paneles.
- [ ] Los errores van junto a su campo, con el foco en el primero.
- [ ] Pasan `validar_catalogo.py`, todas las pruebas y la prueba nueva.
