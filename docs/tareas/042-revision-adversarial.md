# Tarea 042 · Revisión adversarial: busca las fallas de Prizma y de Claude

Estado: **pendiente, después de la tarea 043** · Asignada a: Codex · Rama: `codex/042-adversarial` · Pull request con destino `main`

## Tu papel
Esta vez **no ejecutas lo que Claude pide: te opones.** El dueño detectó que las validaciones anteriores son circulares: Claude definió lo correcto y tú mediste si Prizma coincidía con Claude. Tu trabajo es encontrar dónde Prizma o Claude se equivocan. Una entrega sin objeciones serias es una entrega fallida, salvo que demuestres con evidencia que no las hay.

Reglas:
- Basa cada objeción en evidencia verificable: el texto de una fuente en `docs/fuentes/`, una norma, una prueba reproducible o una captura. Sin evidencia no hay objeción.
- No suavices. Si algo puede dañar a un estudiante o trabajador, o exponer al dueño a un reclamo, dilo con prioridad alta.
- Solo crea archivos en `docs/revision-adversarial/`. No cambies nada más.

## Fase 1 · A ciegas (antes de leer `docs/casos/`)
**No abras `docs/casos/asesoria-claude.md` ni `docs/casos/casos-semilla.json` hasta terminar esta fase.**
1. Escribe 15 casos propios, difíciles y distintos de los de Claude. Incluye casos ambiguos, con barreras que se combinan, con riesgo para la seguridad, con conflicto entre la familia y la escuela, de educación superior y de trabajo.
2. Para cada caso, decide tú qué acciones DUA y qué apoyos recomendarías. Usa solo el catálogo (`data/`) y las fuentes (`docs/fuentes/`), y justifica cada elección con una fuente.
3. Pasa tus casos por Prizma, en `vm` o en la web, y registra dónde Prizma se aleja de tu criterio.

## Fase 2 · Ataque al criterio de Claude
Ahora lee `docs/casos/`. Por cada uno de los 9 casos de Claude, discute:
- recomendaciones que sobran;
- recomendaciones que faltan;
- preguntas clave mal planteadas;
- supuestos sin respaldo.

## Fase 3 · Ataque al catálogo y a la página
1. **Fuentes:** elige al azar 40 fichas y verifica, leyendo el archivo de la fuente citada, si esa fuente realmente respalda lo que dice la ficha y el nivel de respaldo asignado. Marca cada una como respaldada, exagerada o sin respaldo.
2. **Legal:** revisa las afirmaciones legales de las guías, los avisos y las fichas (Decreto 83, 67, 170 y 2.516, leyes 20.422, 21.091, 21.545, 21.015, 21.275, 21.690, 19.628 y 21.719, y el Código del Trabajo). Busca artículos mal citados, obligaciones exageradas y omisiones.
3. **Daño posible:** busca recomendaciones que puedan estigmatizar, sustituir una evaluación profesional, empujar a decisiones sin la familia o el equipo, o funcionar mal en un caso real.
4. **Privacidad y seguridad:** fugas de datos en documentos, respaldos o `localStorage`, y lo que se muestra en la pestaña DUA si se proyecta al curso.
5. **Accesibilidad:** al menos 10 problemas probados, no supuestos.
6. **Copia de texto:** verifica que ninguna ficha copie a CAST, la OMS o la EEF.

## Entrega
`docs/revision-adversarial/README.md` con una tabla de objeciones. Cada una lleva:
- un ID (O1, O2…);
- la prioridad (alta, media o baja);
- la evidencia;
- qué debería cambiar;
- una columna «Respuesta de Claude», vacía.

Agrega los 15 casos y tus recomendaciones en un JSON, y los scripts.

## Cómo se resuelve
1. Claude responde cada objeción: la acepta y la corrige, o la rechaza con evidencia.
2. Tú respondes a cada rechazo en una segunda ronda: lo aceptas o insistes con más evidencia.
3. Lo que siga en desacuerdo lo decide el dueño.

## Criterios de aceptación
- [ ] La fase 1 se hizo antes de leer `docs/casos/`, y eso queda declarado en el informe.
- [ ] 15 casos propios con recomendaciones justificadas por fuente.
- [ ] 40 fichas verificadas contra su fuente.
- [ ] Cada objeción tiene evidencia reproducible.
- [ ] Ningún cambio fuera de `docs/revision-adversarial/`.
