# Tarea 010 · Adecuaciones en los objetivos y apoyos ante desregulación

Estado: **integrada** · Asignada a: Codex · Rama: `codex/010-objetivos-desregulacion` · Hazla **después** de integrar la tarea 009.

## Para qué

Completa la sección «Un estudiante» con 2 bloques que ya están en `data/recomendaciones.json`. Ver `docs/diseno.md`, secciones 3.3 y 3.4. **No cambies `data/`.**
- `"tipo": "objetivos"`: 5 entradas, con `subtipo` graduacion, priorizacion, temporalizacion, enriquecimiento o eliminacion.
- `"tipo": "desregulacion"`: 9 entradas, con `subtipo` antes, durante o despues.

## Qué hacer

### 1. Bloque «Si los apoyos de acceso no bastan»
- Va debajo de los resultados de acceso, dentro de un `<details>` cerrado por defecto, con el resumen «Si los apoyos de acceso no bastan: adecuaciones en los objetivos».
- Primero, este aviso fijo: «Úsalas solo si las adecuaciones de acceso no bastan. Se deciden con el equipo de apoyo y la familia, con la participación del estudiante, y se registran en el PACI.»
- Muestra las 5 entradas en este orden: graduación, priorización, temporalización, enriquecimiento y eliminación. La eliminación va última y con el rótulo «Último recurso».
- Usa `aplica()`. En parvularia no aparece ninguna, porque el catálogo las excluye. En ese caso, muestra: «En educación parvularia, preferentemente no se adecuan los objetivos (Decreto 83). Usa los apoyos de acceso.»

### 2. Bloque «Si se desregula»
- Va después del bloque anterior. Se muestra con cualquier nivel, sin depender de las dimensiones marcadas. Si la persona marcó la dimensión 5 (emociones y regulación), puede quedar abierto por defecto.
- Tiene 3 subtítulos: «Antes: prevenir», «Durante: acompañar» y «Después: reparar», con sus entradas.
- Al final, este aviso fijo y destacado: «Sigue el protocolo DEC de tu establecimiento. Si el estudiante es autista, revisa su PAEC. Prizma no reemplaza esos documentos.»

### 3. Selección y documento
- «Elegir» funciona igual que en las demás tarjetas.
- En la vista previa y el PDF, dentro de «Apoyos para [iniciales]», agrupa las entradas en «Adecuaciones de acceso», «Adecuaciones en los objetivos» y «Apoyos ante desregulación». Cada una muestra su tipo oficial, por ejemplo «Adecuación en los objetivos: Priorización (Decreto 83)».

## Criterios de aceptación
- [ ] En básica, el `<details>` muestra las 5 adecuaciones en orden, con la eliminación al final y rotulada.
- [ ] En parvularia aparece el mensaje del Decreto 83 y ninguna adecuación en los objetivos.
- [ ] El bloque de desregulación muestra 3, 3 y 3 entradas y el aviso del protocolo.
- [ ] El PDF agrupa los 3 tipos con sus nombres oficiales.
- [ ] Teclado, tema claro y oscuro, y 390 px sin desplazamiento horizontal.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y `node scripts/probar_arreglos_menores.cjs`. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
