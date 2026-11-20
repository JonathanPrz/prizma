# Tarea 050 · Auditoría de la interfaz de Prizma en 4 pilares

Estado: **integrada** (PR #70) · Asignada a: Codex · Rama: `codex/050-auditoria-interfaz` · Pull request con destino `main`

## Para qué
El dueño quiere saber cómo está Prizma frente a 4 pilares de diseño: núcleo visual, heurísticas, componentes y redacción en español. El método y los criterios están en la skill `auditoria-ui` (`.agents/skills/auditoria-ui/SKILL.md`). **Síguela completa.**

**Solo auditoría:** crea archivos solo en `docs/auditorias/050-interfaz/`. No cambies la página, `data/`, `docs/fuentes/` ni `.claude/`. No corrijas nada; Claude propone los cambios y el dueño decide.

## Prioridad del dueño: jerarquía y pulcritud
El valor de Prizma no está en una letra grande, sino en que quien entra a hacer adecuaciones **no se pierda**. Por eso, al ordenar los hallazgos:
1. **Primero, la jerarquía:** ¿se entiende en 5 segundos qué es lo principal de cada pantalla, cuál es el paso actual y cuál es la siguiente acción? Busca títulos, botones y avisos que pesen lo mismo y compitan entre sí.
2. **Después, la pulcritud visual:** alineación, espaciado regular, menos bordes y cajas, pocos tamaños de letra y una paleta contenida.
3. **El tamaño de letra se puede flexibilizar.** WCAG 2.2 no fija un mínimo. Si bajar tamaños mejora la jerarquía o la densidad, propónlo, siempre que se mantengan el contraste AA, el zoom al 200 % sin pérdida (1.4.4 y 1.4.10) y los objetivos táctiles de 24 px o más. Como referencia, el texto de lectura no baja de 16 px en el teléfono, y el texto secundario puede ir a 13 o 14 px.

Para cada pantalla principal, agrega una línea que diga qué ve primero una persona nueva y si eso es lo correcto.

## Qué revisar
- Las 3 partes: «Para el curso (DUA)», «Para un estudiante» (en básica y en superior) y «Para el trabajo».
- La pantalla de inicio, Mi mochila, la vista previa del documento y los diálogos.
- 390, 768 y 1280 px, en tema claro y oscuro.

## Reglas del proyecto que mandan sobre la skill
- `AGENTS.md`: WCAG 2.2 AA, objetivos táctiles de al menos 24 px, sin dependencias nuevas, textos en español de Chile con tuteo.
- `docs/arquitectura.md`: el glosario fijo y las decisiones ya aprobadas por el dueño. Si un criterio choca con una decisión aprobada, anótalo como observación, no como error.
- Prizma usa a propósito la letra del sistema, sin fuentes externas, por privacidad (tarea 046). No propongas fuentes de Google ni de otros servidores.

## Entrega
`docs/auditorias/050-interfaz/README.md` con lo que pide la skill:
- el resumen;
- la tabla de hallazgos con los ID de criterio (V0 a V8, H1 a H13, C1 a C7, E1 a E8);
- las mediciones;
- las capturas;
- lo que no pudiste revisar.

Agrega también el script de medición.

No generes hallazgos con plantillas: cada uno con su evidencia propia. Si un criterio se cumple, dilo en una línea con su medición.

## Criterios de aceptación
- [ ] Los 37 criterios de la skill (V0 a V8, H1 a H13, C1 a C7, E1 a E8) tienen un resultado: cumple, no cumple o no aplica, con su evidencia.
- [ ] Las mediciones de tipografía, color, espaciado y objetivos táctiles salen del navegador, no de suposiciones.
- [ ] Hay capturas a 390 y 1280 px.
- [ ] Ningún cambio fuera de `docs/auditorias/050-interfaz/`.
