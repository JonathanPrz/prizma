# Tarea 045 · Buscar documentos y estudios que expliquen las consideraciones DUA 3.0

Estado: **pendiente** · Asignada a: Codex (modelo fuerte) · Rama: `codex/045-investigacion-dua` · Pull request con destino `main`

## Para qué
Unas 56 fichas citan las Pautas DUA 3.0 de CAST, pero en el repositorio solo están los títulos de las consideraciones y un resumen de sus cambios. Se necesitan fuentes **abiertas** que expliquen qué propone cada consideración, y estudios sobre si el DUA funciona, para verificar las fichas DUA sin copiar a CAST.

**Solo crea archivos en `docs/fuentes/codex/dua/`.** No cambies `data/`, la página ni otras fuentes.

## Límites
- **No descargues ni recorras `cast.org` ni `udlguidelines.cast.org`.** Sus términos lo prohíben (`docs/fuentes/dua-3.0.md`, sección 1). Puedes **enlazar** sus páginas, pero no leerlas con programas.
- Usa solo fuentes que puedas leer legalmente: acceso abierto, licencias abiertas o publicaciones oficiales. Anota la licencia de cada una.
- **No copies texto.** Cada archivo es un resumen con tus palabras. Solo se permiten citas textuales de hasta 25 palabras, entre comillas y con su página.
- **No inventes fuentes.** Cada fuente necesita un enlace que funcione y, si es un artículo, su DOI. Claude abrirá al azar varios enlaces y DOI para comprobarlos: una sola fuente inventada invalida la entrega.
- Si no encuentras una fuente buena para una consideración, dilo. Es mejor un vacío honesto que un relleno.

## Qué buscar
1. **Documentos que expliquen las consideraciones DUA 3.0 o 2.2**, en español o en inglés. Por ejemplo:
   - guías oficiales de ministerios de educación (Chile, España, Uruguay, Colombia, México);
   - guías universitarias de acceso abierto;
   - libros abiertos sobre DUA.

   Indica si explican la versión 3.0 o la 2.2, porque cambian nombres y enfoques.
2. **Estudios sobre la efectividad del DUA:** revisiones sistemáticas y metanálisis recientes. Para cada uno, anota:
   - qué midió;
   - en qué nivel educativo;
   - el tamaño del efecto si lo hay;
   - la calidad o las limitaciones;
   - qué consideraciones o pautas respalda.
3. **Estudios sobre estrategias concretas** que usan las fichas DUA, cuando una consideración no tenga estudio propio: instrucción explícita, andamiaje, agrupamiento flexible, metacognición, retroalimentación, elección. Prefiere revisiones sistemáticas.

## Entrega
1. **Un archivo por fuente** en `docs/fuentes/codex/dua/`, con:
   - título, autores, año, enlace, DOI y licencia;
   - si es texto completo o solo el resumen;
   - un resumen propio de 150 a 400 palabras;
   - las citas cortas con su página;
   - los límites de la fuente: país, nivel educativo, calidad de la evidencia.
2. **`docs/fuentes/codex/dua/README.md` con una tabla de las 36 consideraciones.** Para cada una:
   - qué fuentes la explican;
   - qué estudios la respaldan;
   - el nivel de evidencia: investigación sólida, moderada, consenso o sin fuente;
   - los vacíos.
3. **Al inicio del pull request:** la lista de los documentos que no pudiste leer (con pago o sin acceso), con su enlace. El dueño decide si los consigue.

## Criterios de aceptación
- [ ] Cada fuente tiene un enlace verificable y su licencia. Las que son artículos también tienen DOI.
- [ ] Los resúmenes son propios. Las citas tienen 25 palabras o menos y llevan página.
- [ ] La tabla cubre las 36 consideraciones, con los vacíos declarados.
- [ ] No hay descargas de `cast.org`. No hay cambios fuera de `docs/fuentes/codex/dua/`.
