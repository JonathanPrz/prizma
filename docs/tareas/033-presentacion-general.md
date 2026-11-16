# Tarea 033 · Presentación general: aprender y trabajar en igualdad

Estado: **integrada** (PR #33) · Asignada a: Codex · Rama: `codex/033-presentacion`

## Para qué
Prizma ya no es solo para docentes: también sirve a instituciones y empleadores que reciben trabajadores con discapacidad. Los textos generales deben decirlo. Es un cambio solo de textos. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Cambios (usa exactamente estos textos)
1. **Bajo el logo,** en la cabecera, va un subtítulo breve: «Apoyos con fuente para aprender y trabajar en igualdad». En teléfono puede ocultarse si no cabe, pero sin desplazamiento horizontal.
2. **`<title>`:** «Prizma · Apoyos con fuente para aprender y trabajar en igualdad».
3. **`<meta name="description">`:** «Apoyos concretos, con fuente, para que todo el curso aprenda, para cada estudiante y para el trabajo. Basado en DUA 3.0 y la normativa chilena.»
4. **Pestañas:**
   - «DUA» → «Para el curso (DUA)».
   - «Apoyos individualizados» → «Para un estudiante». En superior sigue diciendo «Ajustes razonables», el término legal.
   - «Trabajo» → «Para el trabajo».

   Los `h1` de cada panel no cambian.
5. **Pie de página:**
   - Agrega la línea «Para docentes, instituciones y empleadores en Chile.»
   - Cambia «**Orientación pedagógica.** No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento.» por «**Orientación pedagógica y laboral.** No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento o empresa.»
6. **PDF:** el aviso final de los documentos usa el mismo texto del punto 5.

## Criterios de aceptación
- [ ] Todos los textos aparecen exactamente como están escritos arriba.
- [ ] En superior, la segunda pestaña sigue diciendo «Ajustes razonables».
- [ ] Sin desplazamiento horizontal a 390 px. Capturas de la cabecera y el pie en `docs/marca/033-presentacion/`.
- [ ] Pasan todas las pruebas `scripts/probar_*.cjs`. Ajusta las que comprobaban los nombres antiguos de las pestañas.
