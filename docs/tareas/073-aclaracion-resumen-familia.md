# Tarea 073 · Aclaración en «Qué haremos en el colegio» del resumen para la familia

Estado: **integrada** (PR #94) · Asignada a: Codex · Rama: `codex/073-aclaracion-familia` · Pull request con destino `main`

## Para qué
En el resumen para la familia (tarea 072), los títulos de los apoyos son instrucciones para la docente, por ejemplo: «Lee en voz alta los enunciados o entrégalos en audio». Leídos por la familia, parecen órdenes dirigidas a ellos. No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## Cambio
En `resumenFamilia()`, `armarResumenFamilia()` y `pdfResumenFamilia()`, agrega justo bajo el título «Qué haremos en el colegio», antes de la lista, esta línea en texto normal:

> Estas son las indicaciones para el equipo del colegio. No tienen que hacerlas en casa.

- La línea debe aparecer igual en la vista `#hoja` y en el PDF.
- Solo aparece si esa sección existe, es decir, si hay apoyos.
- No cambies los títulos de los apoyos.

## Pruebas
En `scripts/probar_resumen_familia.cjs`:
- la vista y el PDF contienen la línea, entre «Qué haremos en el colegio» y el primer apoyo;
- sin apoyos elegidos, la línea no aparece;
- el caso de referencia (6 situaciones y 8 apoyos) sigue en 1 página.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La aclaración aparece bajo «Qué haremos en el colegio», en la vista y en el PDF.
- [ ] El caso de referencia sigue ocupando 1 página.
- [ ] Pasan el validador y todas las pruebas.
