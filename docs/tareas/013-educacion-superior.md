# Tarea 013 · Nivel «Educación superior»

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/013-educacion-superior`

## Para qué

El catálogo ya tiene contenido para educación superior: `"niveles": ["superior"]`. Son 9 ajustes razonables de `"tipo": "acceso"` y 1 de `"tipo": "adicional"` (`sup-coordinar`). Además, las 36 acciones DUA aplican también a este nivel. Las adecuaciones escolares (Decreto 83), las de objetivos y los apoyos de desregulación **no** aplican a superior. **No cambies `data/`.**

## Qué hacer

1. **Nivel:** agrega `<option value="superior">Educación superior (universidad, IP o CFT)</option>` al final del selector y en `NIVELES` de `app.js`. El respaldo debe aceptar `superior`.
2. **Vocabulario en superior:** `clase` → «clase», `curso` → «curso», `estudiantes` → «estudiantes». Son los mismos de básica.
3. **Sección «Un estudiante» en superior:**
   - El título cambia a «Ajustes razonables para un estudiante».
   - Muestra primero la entrada `sup-coordinar` (`tipo` adicional), destacada, antes de los grupos de acceso.
   - Reemplaza el aviso del PACI por: «Los ajustes razonables se acuerdan con el estudiante y la unidad de inclusión de tu institución (Ley 21.091, art. 2 e; Ley 20.422, art. 39).»
   - En el bloque de objetivos, en vez de las 5 adecuaciones, muestra: «En educación superior no se adecuan los objetivos de aprendizaje: se hacen ajustes razonables que mantienen los resultados de aprendizaje.»
   - Oculta el bloque «Si se desregula». En su lugar muestra: «Si un estudiante vive una crisis, sigue el protocolo de tu institución y contacta a su unidad de bienestar o de inclusión.»
4. **Documento y PDF en superior:** el subtítulo de la sección individual cambia a «Propuesta para acordar con el estudiante y la unidad de inclusión». Las entradas se rotulan «Ajuste razonable: [tipo]», sin «(Decreto 83)».
5. Si el catálogo incluye entradas `"tipo": "adicional"` en otros niveles, muéstralas igual que `sup-coordinar`, al inicio de la sección.

## Criterios de aceptación
- [ ] Con «Educación superior», marcar «Lectura, escritura y cálculo» muestra `sup-coordinar` primero y después los ajustes de superior que coinciden. No aparece ninguna adecuación escolar `acc-…`.
- [ ] En superior se ven los 3 mensajes del punto 3 y no aparecen las adecuaciones de objetivos ni las de desregulación.
- [ ] «Mi clase» en superior muestra las 36 acciones DUA.
- [ ] El PDF en superior usa el subtítulo y los rótulos del punto 4.
- [ ] Los demás niveles no cambian. Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`.
- [ ] Teclado, tema claro y oscuro, y 390 px sin desplazamiento horizontal. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
