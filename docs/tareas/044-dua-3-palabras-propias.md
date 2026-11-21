# Tarea 044 · Completar DUA 3.0 con palabras propias y verificar las fichas DUA

Estado: **hecha** (PR #54 y #56), salvo la parte C (opcional) y el permiso de CAST (A.1). El dueño entregó el texto de las 36 consideraciones; las secciones 7 y 8 de `dua-3.0.md` están escritas con palabras propias; las 56 fichas DUA se verificaron con control a ciegas (`dua-respaldo-A.csv`, `dua-respaldo-B.csv`) y se corrigieron en los PR #54 y #56.

## Para qué
Unas 60 fichas citan `cast-dua-3`, cuyo archivo es `docs/fuentes/dua-3.0.md`. Ese archivo solo trae los **títulos** de las 36 consideraciones, no su contenido. Por eso la revisión de la tarea 043 no pudo comprobar si cada ficha DUA dice lo que propone su consideración.

## Límite que manda en toda la tarea
Los términos de uso de CAST dicen que su contenido tiene derechos de autor y prohíben copiarlo sin permiso y recorrer el sitio con programas (`dua-3.0.md`, sección 1). Por eso:
- **Ningún agente descarga páginas de CAST.** El texto de CAST lo lee una persona, a mano, o lo entrega CAST.
- **El texto de CAST no entra al repositorio** ni a la página. Al repositorio solo entra una descripción con palabras propias, breve, que cita la consideración y su enlace.
- Regla 7 de `AGENTS.md`: no se copia texto de CAST.

## Parte A · Dueño
1. **Pedir permiso a CAST** con su formulario (https://www.cast.org/contact/udlg-docs/). Texto sugerido, en inglés:

   > Hello. I run Prizma (https://jonathanprz.github.io/prizma/), a free, non-profit web tool in Spanish that helps teachers in Chile plan inclusive lessons based on UDL 3.0. Each suggested action cites the UDL consideration it comes from (for example, "Based on UDL 3.0, consideration 7.1") and links to your site. We write everything in our own words and do not reproduce your text. We would like to confirm that this use is acceptable, and to ask whether we may include a short paraphrase of each consideration with a link to your site. Thank you.

2. **Mientras CAST no responda, leer a mano.** Abre en el navegador la versión en español de cada consideración (https://udlguidelines.cast.org/es/) y guarda su texto en una carpeta **de tu computador, fuera del repositorio**: un archivo por consideración, por ejemplo `cast-local/7.1.txt`. Son 36 páginas.
3. **Entrega esa carpeta a Claude** en un mensaje de la sesión. No la subas a GitHub.

## Parte B · Claude
1. Escribe en `dua-3.0.md` una sección nueva, «Las 36 consideraciones en palabras propias». Para cada consideración:
   - 2 a 4 frases propias sobre qué propone;
   - qué tipo de acciones caben y cuáles no;
   - el enlace a su página en CAST.
2. **Comprueba que no hay copia:** un script compara cada descripción con el texto local del dueño y falla si comparten una secuencia de 8 o más palabras seguidas. El script va a `scripts/`. El texto de CAST no se guarda.
3. **Verifica las fichas DUA** (todas las que citan `cast-dua-3`) contra el texto de CAST que leyó el dueño, con el mismo método de la tarea 043: veredicto, nota propia y la consideración correcta. Lo hacen subagentes de Claude, y un subagente de otro modelo controla a ciegas 10 al azar.
4. Propone al dueño las correcciones: cambiar de consideración, ajustar el texto o bajar el respaldo. **Nada se cambia en `data/` sin aprobación.**

## Parte C · Codex, adversario (opcional)
Revisa 15 fichas DUA al azar, con una semilla fija, contra la nueva sección. Busca descripciones que exageren o que se acerquen demasiado al texto de CAST. No necesita leer CAST.

## Si CAST da permiso
Se pueden incluir citas cortas y textuales con atribución, y la parte A.2 se simplifica. Guarda su respuesta en `docs/fuentes/` como evidencia.

## Criterios de aceptación
- [ ] Las 36 consideraciones tienen su descripción propia y su enlace.
- [ ] El script de no copia pasa y no deja texto de CAST en el repositorio.
- [ ] Todas las fichas que citan `cast-dua-3` tienen un veredicto contra su consideración.
- [ ] Hay un control a ciegas de 10 fichas, con su resultado.
- [ ] Pasan `validar_catalogo.py` y todas las pruebas.
