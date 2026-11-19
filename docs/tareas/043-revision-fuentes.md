# Tarea 043 · Revisión sistemática de las fuentes: qué dice cada documento sobre cada tema

Estado: **pendiente** · Asignada a: Codex (modelo de bajo consumo) · **Va antes de la tarea 042**

## Para qué
Prizma cita 125 archivos en `docs/fuentes/`. Claude dijo haberlos revisado, pero nadie comprobó que cada documento se leyera entero, ni que lo que dice Prizma esté en ellos. Esta tarea arma una matriz verificable: **cada archivo × cada tema**, con una cita literal que un script comprueba.

Trabajan dos agentes por lote, por separado:
- **Indagador:** lee el archivo completo y llena la matriz.
- **Adversario:** busca lo que el indagador omitió, exageró o leyó mal.

**Solo crea archivos en `docs/revision-fuentes/`.** No cambies `data/`, `docs/fuentes/`, la página ni `.claude/`. No corrijas el catálogo: anota el problema.

## Archivos ya preparados (no los cambies)
- `lotes.csv`: los 125 archivos repartidos en 7 lotes (L1 a L7), con su número de palabras y su id en `data/fuentes.json` («sin id» si el catálogo no lo cita).
- `temas.csv`: los 20 temas (T01 a T20) y qué buscar en cada uno.
- `verificar.py`: revisa la matriz de un lote. Comprueba que estén todas las filas, que cada cita esté de verdad en el archivo y en la línea indicada, y que las fichas existan y citen esa fuente.

## Rol 1 · Indagador (una sesión por lote)
Rama `codex/043-<lote>-indaga`, por ejemplo `codex/043-L2-indaga`. Pull request con destino `main`.

1. **Lee cada archivo del lote completo**, de principio a fin. Si un archivo es muy largo, recórrelo por secciones, pero no te saltes ninguna.
2. Crea `matriz-<lote>.csv`, en UTF-8 con BOM y separado por `;`, para que se abra bien en Excel. Debe tener **una fila por archivo y tema**: 20 filas por archivo. Usa estas columnas en este orden:

| Columna | Qué va |
|---|---|
| `lote`, `archivo`, `id_fuente` | Lo copias de `lotes.csv`. |
| `tipo_archivo` | `texto completo`, `extracto`, `resumen de agente` (lo escribió un agente, no el autor) o `registro` (solo ficha bibliográfica). |
| `tema` | De T01 a T20. |
| `trata` | `sí` o `no`. |
| `dice` | Qué dice sobre el tema, en una o dos frases tuyas. |
| `cita_literal` | Hasta 40 palabras copiadas exactas del archivo, que respalden `dice`. |
| `linea` | El número de línea de la cita. |
| `nivel` | `parvularia`, `básica`, `media`, `TP`, `superior`, `trabajo` o `todos`. |
| `fuerza` | `obligación legal`, `orientación oficial`, `evidencia`, `opinión` o `no aplica`. |
| `fichas_prizma` | Los ids de las fichas de `data/recomendaciones.json` que citan esta fuente y tratan el tema, separados por espacio. |
| `coincide_prizma` | Si esas fichas dicen lo mismo que la fuente: `sí`, `en parte`, `no` o `no aplica`. |
| `terminos_buscados` | Si `trata` = `no`, las palabras que buscaste en el archivo sin encontrarlas. Es obligatorio. |
| `nota` | Cualquier duda o contradicción. |

   Si un archivo trata un tema en varios puntos importantes, agrega más filas con el mismo tema.
3. Corre `python3 docs/revision-fuentes/verificar.py <lote>` hasta que diga «correcto».
4. Escribe `informe-<lote>-indaga.md` con:
   - lo más importante que dice el lote;
   - los casos de `coincide_prizma` en `no` o `en parte`;
   - los archivos que son `resumen de agente` o `registro`, porque Prizma no debería apoyarse solo en ellos;
   - lo que no pudiste leer.

## Rol 2 · Adversario (otra sesión, después de integrar al indagador)
Rama `codex/043-<lote>-adversa`. Pull request con destino `main`. **No eres el indagador y no confías en él.**

1. Corre `verificar.py <lote>`. Si falla, eso ya es una objeción.
2. **Omisiones:** en cada fila `trata` = `no`, busca en el archivo con tus propios sinónimos. Si encuentras el tema, es una objeción.
3. **Fidelidad:** en al menos el 30 % de las filas con `trata` = `sí` (todas, si el lote tiene menos de 100), lee el párrafo completo alrededor de la cita. Marca cada fila como:
   - `fiel`;
   - `exagerada`;
   - `incompleta`, si el contexto la limita o la contradice;
   - `errónea`.
4. **`coincide_prizma`:** revisa todas las filas en `sí` contra el texto de las fichas.
5. **Lo que falta:** busca lo que el archivo destaca y que no quedó en ninguna fila, sobre todo si contradice a Prizma.
6. **El archivo como fuente:** si es `resumen de agente` o `extracto` y tiene URL, intenta abrir el original y compara. Si no puedes, anótalo como «no verificable».
7. Entrega `verificacion-<lote>.csv`, con las columnas `fila` (número en la matriz), `veredicto`, `evidencia` (cita y línea) y `correccion`, y además `informe-<lote>-adversa.md` con las objeciones por prioridad (alta, media o baja).

El adversario **no corrige** la matriz del indagador: solo la objeta.

## Cierre (una sesión, cuando estén los 7 lotes)
Rama `codex/043-cierre`:
- une las matrices en `matriz.csv`;
- arma `resumen.md` con:
  - una tabla de temas × archivos que marque cuáles tratan cada tema;
  - por tema, qué dicen los documentos y dónde se contradicen;
  - la lista de lo que Prizma afirma sin respaldo, o con un respaldo solo de un resumen de agente;
  - el total de objeciones por lote y cuántas quedaron sin resolver.

Claude revisa el resumen y las objeciones, responde cada una y propone los cambios al catálogo. El dueño decide.

## Criterios de aceptación
- [ ] `verificar.py` dice «correcto» en los 7 lotes.
- [ ] Cada fila `trata` = `no` lleva los términos buscados.
- [ ] Cada lote tiene la verificación del adversario y su informe.
- [ ] Las citas son literales y de 40 palabras o menos. Solo se usan en esta revisión, nunca en las fichas (regla 7 de `AGENTS.md`).
- [ ] Ningún cambio fuera de `docs/revision-fuentes/`. Todos los pull requests apuntan a `main`.
