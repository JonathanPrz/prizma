# Tarea 021 · Avisos emergentes al entrar a cada pestaña

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/021-avisos-emergentes`

## Para qué

El dueño observó que los avisos importantes no se ven en el momento en que importan:
- La guía «¿Cómo usar el DUA?» aparece en la primera visita, pero debe aparecer **la primera vez que se entra a la pestaña DUA**. Si alguien llega directo a `#apoyos`, nunca la ve antes de usar DUA.
- El aviso de acuerdo («Antes de aplicar un apoyo, conversa con el estudiante y su familia…») es un párrafo que se pasa por alto. El aviso de privacidad aparece solo al escribir. Los dos deben aparecer **al entrar por primera vez a la pestaña de apoyos**, antes de escribir datos.
- La ficha `sup-coordinar` («Acuerda los ajustes con el estudiante y la unidad de inclusión») se puede elegir como si fuera un ajuste. No lo es: es la regla de cómo se acuerdan los ajustes, y debe ir en el aviso.

## Permiso especial sobre `data/`
Esta tarea te autoriza **solo** a eliminar la ficha `sup-coordinar` de `data/recomendaciones.json`, sin tocar nada más. No cambies `data/fuentes.json`, `docs/fuentes/` ni `.claude/`.

## Cambios
1. **Guía DUA por pestaña:**
   - Muestra la guía `#guia-dua` la primera vez que la pestaña DUA queda activa (al cargar en `#dua` o al cambiar de pestaña), no en la primera visita a cualquier pestaña.
   - Usa la misma clave `prizma.guia-dua.v1`. Quien ya la vio no la vuelve a ver.
2. **Aviso «Antes de empezar» en la pestaña de apoyos:**
   - Crea un `<dialog id="aviso-apoyos">` que se abre la primera vez que la pestaña de apoyos queda activa. Se recuerda en `localStorage` con la clave `prizma.aviso-apoyos.v1`, envuelta en `try/catch`.
   - Título: «Antes de empezar». Contenido en dos partes cortas:
     - **Cómo se acuerdan los apoyos.**
       - En la escuela: «Conversa con el estudiante y su familia antes de aplicar un apoyo. Las adecuaciones se acuerdan con el equipo de apoyo y se registran en el PACI.»
       - En superior: «Los ajustes razonables se acuerdan con el estudiante y la unidad de inclusión de tu institución. Pregúntale qué barreras encuentra y qué le ha servido antes, y deja el acuerdo por escrito (Ley 21.091, art. 2 e; Ley 20.422, art. 39).»
     - **Privacidad.** El texto breve del aviso de privacidad actual (solo iniciales, sin diagnósticos, los datos quedan en este navegador) con un enlace a «Ver aviso completo», que abre `#aviso-privacidad`.
   - Botón «Entendido». Al cerrar, marca también el aviso de privacidad como visto (`prizma.privacidad.v1`), para no mostrarlo otra vez al escribir.
   - Si la guía DUA está abierta, espera a que se cierre. Nunca abras dos diálogos a la vez.
   - El foco va al título al abrir. Al cerrar vuelve a la pestaña de apoyos.
3. **En el panel de apoyos:**
   - Reemplaza los dos párrafos largos (`#aviso-acceso-escolar` y `#aviso-acceso-superior`) por una línea corta: «Los apoyos se acuerdan con el estudiante, su familia y el equipo.», con un enlace «Antes de empezar» que vuelve a abrir el diálogo.
   - En superior, la línea dice «…con el estudiante y la unidad de inclusión.»
4. **Quitar `sup-coordinar`:**
   - Elimina la ficha del catálogo y ajusta `probar_superior.cjs` sin debilitar lo que comprueba: usa otra ficha de superior.
   - Un respaldo antiguo que la tenga elegida debe cargar y avisar que una acción ya no está en el catálogo, como ya ocurre.
   - Si el grupo «Apoyos adicionales» queda vacío, no se muestra.

## Lo que no cambia
Las demás fichas, «Mi mochila», el PDF, la tabla CIF, los filtros, los temas y el logo. El aviso de privacidad completo sigue disponible en el pie de página.

## Criterios de aceptación
- [ ] En una visita nueva que entra por `#apoyos`, se ve «Antes de empezar» y no la guía DUA. Al pasar a DUA, se ve la guía.
- [ ] En una visita nueva que entra por `#dua`, se ve la guía. Al pasar a apoyos, se ve «Antes de empezar».
- [ ] Nunca hay dos diálogos abiertos a la vez. Con teclado y lector de pantalla, el foco entra y sale bien.
- [ ] El texto del aviso cambia según el nivel (escuela o superior).
- [ ] Después de «Entendido», escribir las iniciales no vuelve a abrir el aviso de privacidad.
- [ ] `sup-coordinar` ya no existe ni se puede elegir. Un respaldo antiguo con esa ficha carga sin errores.
- [ ] No hay desplazamiento horizontal a 390 px.
- [ ] Capturas en `docs/marca/021-avisos/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. Agrega `scripts/probar_avisos.cjs`.
