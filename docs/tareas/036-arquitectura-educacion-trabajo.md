# Tarea 036 · Nueva arquitectura: Educación y Trabajo, con explicaciones y glosario

Estado: **integrada** (PR #35) · Asignada a: Codex · Rama: `codex/036-arquitectura`

## Para qué
El dueño aprobó la propuesta de `docs/arquitectura.md`. **Léela completa: es la especificación de esta tarea.** Resuelve los problemas A1–A3, M1–M8 y B1–B4 de la auditoría `docs/auditorias/034-arquitectura/`.

**No cambies `data/`, `docs/fuentes/`, `docs/arquitectura.md` ni `.claude/`.**

## Qué implementar
1. **Estructura de la sección 2 de `docs/arquitectura.md`:**
   - pantalla de inicio con las 2 tarjetas de ámbito;
   - Educación con el nivel visible y las pestañas «Para el curso (DUA)» y «Para un estudiante»;
   - Trabajo aparte.
   - Guarda el ámbito en `estado.ambito` (`educacion` o `trabajo`), validado y respaldado.
   - Hashes: `#dua`, `#apoyos` y `#trabajo` siguen funcionando y fijan el ámbito. `#inicio` muestra la pantalla de inicio.
   - «Cambiar ámbito» va en la barra de cada ámbito y en su pie.
   - El ámbito se elige con botones o tarjetas reales (`button`), con teclado y foco.
2. **Cada decisión de la tabla de la sección 3,** una por una. En el pull request, marca cada código [A1]…[B4] como hecho o explica por qué no.
3. **Glosario de la sección 4:** revisa todos los textos visibles y de los PDF. «Apoyos individualizados» como título pasa a «Apoyos para un estudiante». «Ficha» y «recomendación» no se muestran.
4. **Textos de la sección 5, exactos:**
   - la definición breve bajo el título de cada pestaña o ámbito;
   - las guías con sus dos partes. Fusiona «¿Cómo usar el DUA?» con «qué es» en una sola guía, «¿Qué es el DUA y cómo usarlo?», y lo mismo en las demás.
5. **Decisiones de la sección 6:**
   - **Nivel:** si hay casos con datos al cambiarlo, pide confirmación con el texto de la sección 3 [M2].
   - **Documento sin acuerdos:** «Borrador: acuerdos sin completar» arriba del documento y en su primera página, también en el documento del centro de práctica [M4].
   - **Grupos plegados** con `<details>` y su conteo en el `summary` [A3].
6. **Indicador de pasos fijo y barra inferior en el teléfono** [A3]:
   - El indicador es `position: sticky`, con enlaces a cada paso y el paso actual con `aria-current="step"`.
   - La barra inferior aparece solo bajo 40 rem, con «Continuar (N elegidos)». No debe tapar contenido: agrega el espacio inferior necesario.
   - Ambos respetan `prefers-reduced-motion` (sin desplazamiento suave si está activo).
7. **Migración:** los datos guardados sin `ambito` cargan en Educación si tienen datos escolares, en Trabajo si solo tienen trabajadores, o muestran el inicio si no tienen nada.

## Después de implementar
Vuelve a correr `docs/auditorias/034-arquitectura/auditar.cjs`, ajustado a la nueva estructura, con los mismos 3 recorridos. Escribe en `docs/auditorias/036-verificacion/README.md` una tabla antes y después por cada problema [A1]…[B4]. Incluye el desplazamiento total en el teléfono de cada recorrido.

## Criterios de aceptación
- [ ] La primera visita muestra el inicio. Tras elegir, la persona nunca ve elementos del otro ámbito: pestañas, nivel, pie, mochila, privacidad ni guías.
- [ ] Cada pestaña y Trabajo muestran su definición breve y su guía con los textos exactos de la sección 5.
- [ ] El glosario se cumple en la página y en los PDF. Agrega a una prueba la lista de términos prohibidos en lo visible.
- [ ] El aviso de privacidad de Trabajo habla de personas trabajadoras y cita el Código del Trabajo, art. 154 ter.
- [ ] Cambiar el nivel con casos guardados pide confirmación.
- [ ] El documento sin acuerdos dice «Borrador».
- [ ] En el teléfono, el desplazamiento total de cada recorrido baja de forma medible frente a la auditoría 034. Informa las cifras.
- [ ] Sin desplazamiento horizontal a 390 px. Teclado, foco y lector de pantalla en el inicio, el indicador y la barra inferior.
- [ ] Capturas en `docs/marca/036-arquitectura/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`, incluida `probar_datos_reales.cjs`. Agrega `scripts/probar_arquitectura.cjs`.
- [ ] El pull request apunta a `main`.
