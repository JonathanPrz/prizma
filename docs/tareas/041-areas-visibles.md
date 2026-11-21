# Tarea 041 · Áreas: estado visible y frecuencias solo cuando corresponde

Estado: **integrada** (PR #60 y #61) · Asignada a: Codex · Rama: `codex/041-areas` · Pull request con destino `main`

## Para qué
El dueño observó dos problemas en «¿En qué áreas encuentra barreras?», en «Para un estudiante» y en «Para el trabajo»:
1. El título «¿Con qué frecuencia encuentra estas situaciones?» aparece aunque no haya ninguna área abierta.
2. No se ve qué área está abierta o tiene situaciones marcadas: los botones de área no muestran ninguna marca.

**No cambies `data/`, `docs/fuentes/`, `docs/arquitectura.md`, `docs/casos/` ni `.claude/`.**

## Cambios
1. El título de frecuencias y su contenedor se muestran **solo si hay al menos un área abierta**.
2. Cada botón de área muestra su estado **sin depender solo del color**:
   - un ícono «+» cuando está cerrada y «−» cuando está abierta;
   - el fondo y el borde del estado presionado, como los demás botones con `aria-pressed` o `aria-expanded` de la página;
   - el texto «(N marcadas)» cuando tiene situaciones, que ya existe.
3. Las preguntas de frecuencia de cada área aparecen **agrupadas bajo el nombre de su área**, con ese nombre como subtítulo.

## Criterios de aceptación
- [ ] Sin áreas abiertas no aparece el título de frecuencias.
- [ ] Al abrir un área, su botón cambia de forma visible, con ícono y estilo, y sus preguntas aparecen con su subtítulo.
- [ ] Hay contraste AA en los temas claro y oscuro, teclado y foco visible, y no hay desplazamiento horizontal a 390 px.
- [ ] Capturas en `docs/marca/041-areas/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. El pull request apunta a `main`.
