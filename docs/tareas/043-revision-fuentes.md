# Tarea 043 · Revisión sistemática de las fuentes: ¿cada ficha dice lo que dice su fuente?

Estado: **pendiente** · Asignada a: Codex (modelo de bajo consumo) · **Va antes de la tarea 042**

## Para qué
Claude dijo haber revisado las fuentes, pero nadie comprobó que lo que afirma cada ficha esté en la fuente que cita. Esta tarea lo comprueba de dos formas:
- **Parte A · Pares (lo principal):** cada uno de los 407 pares ficha-fuente, contra el texto del archivo.
- **Parte B · Matriz:** qué dice cada uno de los 57 archivos citados sobre 20 temas. Se abre en Excel.

Un script comprueba lo que se puede medir sin juicio: que no falte nada, que las citas sean literales y estén en la línea indicada, y que los términos «no encontrados» de verdad no aparezcan.

Trabajan dos agentes por lote, en sesiones distintas:
- **Indagador:** lee y registra.
- **Adversario:** no confía en el indagador y busca lo que omitió, exageró o leyó mal.

**Solo crea archivos en `docs/revision-fuentes/`.** No cambies `data/`, `docs/fuentes/`, la página ni `.claude/`. No corrijas el catálogo: anota el problema.

## Archivos ya preparados (no los cambies)
- `lotes.csv`: los 57 archivos que cita `data/fuentes.json`, en 8 lotes (L1 a L8) equilibrados por palabras y pares.
- `pares.csv`: los 407 pares, con su lote, la ficha, la fuente, el archivo, el tipo, el respaldo que declara la ficha y su afirmación (título, «cómo» y «por qué»).
- `temas.csv`: los 20 temas, con qué entra y qué va en otro tema.
- `sin-id.csv`: los 68 archivos que ninguna ficha cita. Quedan **fuera** de esta tarea, salvo para buscar en el cierre si alguno respalda o contradice una ficha.
- `verificar.py`: la revisión mecánica.

Todos los CSV van en UTF-8 con BOM y separados por `;`.

## Rol 1 · Indagador (una sesión por lote)
Rama `codex/043-<lote>-indaga`, por ejemplo `codex/043-L1-indaga`. Pull request con destino `main`.

1. **Lee cada archivo del lote completo**, por secciones si es largo, sin saltarte ninguna.
2. **Parte A.** Crea `pares-<lote>.csv` con una fila por cada par del lote y estas columnas:
   - `par`;
   - `tipo_archivo`: `texto completo`, `extracto`, `resumen de agente` (lo escribió un agente, no el autor) o `registro` (solo ficha bibliográfica);
   - `veredicto`: `respaldada`, `en parte` (la fuente respalda una parte, o con otra cifra o condición), `sin respaldo` o `contradice`;
   - `cita_literal`: de 6 a 40 palabras copiadas exactas, para `respaldada`, `en parte` y `contradice`;
   - `linea`: el número de línea donde **empieza** la cita;
   - `terminos_buscados`: para `sin respaldo`, al menos 3 términos separados por coma que buscaste y no están;
   - `nota`: obligatoria en `en parte` y `contradice`. Di qué parte falta o qué dice distinto.

   Revisa **toda la afirmación de la ficha**, no solo el tema general. Si la ficha da una cifra, un plazo o una obligación, la fuente debe decir eso mismo. Si la ficha declara `investigacion-solida` y el archivo es un `resumen de agente` o un `registro`, anótalo en `nota`.
3. **Parte B.** Crea `matriz-<lote>.csv` con **exactamente una fila por archivo y tema** y estas columnas:
   - `archivo`, `tema`;
   - `trata`: `sí` o `no`;
   - `dice`: una o dos frases tuyas;
   - `cita_literal` y `linea`, si trata = `sí`;
   - `nivel`: `parvularia`, `básica`, `media`, `TP`, `superior`, `trabajo` o `todos`;
   - `fuerza`: `obligación legal`, `orientación oficial`, `evidencia` u `opinión`;
   - `terminos_buscados`, si trata = `no`, con al menos 3;
   - `nota`.

   Si un archivo tiene varios puntos sobre un tema, resúmelos en `dice` y cita el más importante.
4. Corre `python3 docs/revision-fuentes/verificar.py pares <lote>` y `verificar.py matriz <lote>` hasta que los dos digan «correcto».
5. Escribe `informe-<lote>-indaga.md` con:
   - los pares en `sin respaldo`, `contradice` y `en parte`;
   - los archivos que son `resumen de agente` o `registro`;
   - lo que no pudiste leer.

## Rol 2 · Adversario (otra sesión, después de integrar al indagador)
Rama `codex/043-<lote>-adversa`. Pull request con destino `main`. **No eres el indagador y no confías en él.**

1. Corre los dos `verificar.py`. Si fallan, eso ya es una objeción.
2. Corre `verificar.py muestra <lote>`. Crea `muestra-<lote>.csv` con:
   - todos los pares que no son `respaldada`;
   - todos los pares con `investigacion-solida`;
   - el 30 % al azar del resto, con una semilla fija.

   **Revisa todos los pares de la muestra.** No elijas otros.
3. En cada par de la muestra, lee el párrafo completo alrededor de la cita y la ficha entera, y da tu propio veredicto:
   - en `sin respaldo`, busca con tus propios sinónimos;
   - en `respaldada`, comprueba si el contexto limita o contradice la cita.
4. **Parte B:** en cada fila `trata` = `no`, busca con tus sinónimos. Después busca lo que el archivo destaca y no quedó en la matriz, sobre todo si contradice a una ficha.
5. **El archivo como fuente:** si es `resumen de agente` o `extracto` y tiene URL, intenta abrir el original y compara. Si no puedes, anótalo como «no verificable».
6. Entrega:
   - `verificacion-<lote>.csv`, con las columnas `ref` (par, o archivo y tema), `veredicto_indagador`, `veredicto_adversario`, `evidencia` (cita y línea) y `correccion`;
   - `informe-<lote>-adversa.md`, con las objeciones por prioridad (alta, media o baja).

**No corrijas** los archivos del indagador: solo objétalos.

## Cierre (una sesión, cuando estén los 8 lotes)
Rama `codex/043-cierre`:
- une los archivos en `pares.csv` completo (con veredictos) y `matriz.csv`;
- busca en los archivos de `sin-id.csv` respaldo para los pares en `sin respaldo`, por ejemplo una copia completa de la misma ley;
- arma `resumen.md` con:
  - el conteo de veredictos por tipo de ficha y por fuente;
  - la lista de fichas sin respaldo o que contradicen su fuente, ordenadas por riesgo: primero las afirmaciones legales, las cifras y el respaldo `investigacion-solida`;
  - las fichas que solo se apoyan en un `resumen de agente`;
  - una tabla de temas × archivos;
  - dónde se contradicen los documentos entre sí;
  - las objeciones del adversario resueltas y sin resolver.

Claude responde cada objeción y propone los cambios al catálogo. El dueño decide.

## Criterios de aceptación
- [ ] `verificar.py pares` y `verificar.py matriz` dicen «correcto» en los 8 lotes.
- [ ] Cada lote tiene su muestra, su verificación del adversario y su informe.
- [ ] Las citas son literales, de 6 a 40 palabras. Solo se usan en esta revisión, nunca en las fichas (regla 7 de `AGENTS.md`).
- [ ] Ningún cambio fuera de `docs/revision-fuentes/`. Todos los pull requests apuntan a `main`.
