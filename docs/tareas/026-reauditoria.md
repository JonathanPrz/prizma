# Tarea 026 · Reauditoría: comparar antes y después

Estado: **integrada** (PR #28) · Asignada a: Codex · Rama: `codex/026-reauditoria` (después de integrar la 025)

## Para qué
Es la fase 3 de `docs/auditorias/024-estudiantes/estrategia.md`. Hay que medir con el mismo método si las fases 1 y 2 resolvieron los hallazgos de la auditoría 024.

**Solo auditoría.** Puedes cambiar únicamente `scripts/auditar_estudiantes.cjs` y crear `docs/auditorias/026-reauditoria/`. No cambies la aplicación, `data/` ni la carpeta de la auditoría 024.

## Método
1. Usa los mismos 10 perfiles. Vuelve a marcar sus situaciones con las 14 nuevas, según lo descrito en cada perfil. Por ejemplo:
   - lupa → Visión;
   - lengua de señas → Audición;
   - tablero → Expresarse oralmente;
   - recién llegado → Identidad, lengua y pertenencia, y Comprender;
   - aburrimiento → Necesita más desafío.

   Escribe la tabla de cambios de marcas.
2. Repite los 70 escenarios y la clasificación de pertinencia de cada ficha, en básica y en superior.

## Entrega
`docs/auditorias/026-reauditoria/README.md`, con:
- una tabla **antes / después** por hallazgo de la auditoría 024 (A1–A4, M1–M4, B1–B2): resuelto, parcial o pendiente, con evidencia;
- conteos antes y después de fichas adecuadas, discutibles e inadecuadas por perfil y nivel;
- los pares de estudiantes con listas idénticas, antes y después;
- los hallazgos nuevos, si los hay, priorizados y sin implementar soluciones;
- los datos crudos y el PDF de 10 estudiantes.

## Criterios de aceptación
- [ ] Cada hallazgo de la auditoría 024 tiene un estado con evidencia.
- [ ] Se puede regenerar con el script.
- [ ] No hay cambios fuera de lo permitido.
