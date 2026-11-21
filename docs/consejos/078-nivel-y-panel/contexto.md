# Consejo de inclusión · Nivel del caso frente al nivel general, y panel «Lo que elegiste»

Fecha: 21-11-2026. Lo prepara Claude, para correr el consejo en Codex o Gemini.

## Base
Lee `AGENTS.md`, `docs/bitacora.md` (estado actual de cada decisión) y la skill `.claude/skills/consejo-inclusion/SKILL.md`, que define el método.

**Las decisiones anteriores son antecedentes, no vetos.**

Escribe solo en esta carpeta. No cambies código, `data/`, `docs/fuentes/` ni `.claude/`.

Para mirar la página:
- inicia `python3 -m http.server 8000` y abre `http://localhost:8000`;
- si tienes Playwright, mide a 390 y 1280 px.

## Tema 1 · El nivel del caso y el nivel general confunden
**Cómo funciona hoy** (tareas 069 y 071; `app.js`: `nivelCaso`, `esSuperior` y el oyente de `#nivel`):
- **El nivel general** (`#nivel`, arriba) sirve para «Para el curso (DUA)» y como valor inicial de los casos nuevos. En «Para un estudiante» se oculta.
- **Cada caso tiene su propio nivel** (`#nivel-estudiante`, en el paso 1 del caso, dentro de «Describe la situación»). Cambiar el nivel general **no cambia** los casos existentes.
- **En superior,** el caso usa «Ajustes razonables» en el título, la pestaña, los grupos y el documento. En los demás niveles dice «Apoyos para un estudiante» y «Adecuaciones de acceso».

**Lo que vivió el dueño, con sus palabras:** «si inicialmente pongo educación superior y comienzo a seleccionar cosas, pero después cambio a, digamos, educación parvularia, sigue todo el rato como ajuste razonable».

Cambió el nivel general, pero su caso seguía en superior, y Prizma no le dijo que hay dos niveles.

**Error relacionado, medido por Claude:** con datos limpios, el primer caso se crea en básica al cargar la página. Si la persona elige «superior» arriba antes de escribir nada en el caso, el caso sigue en básica. El caso vacío no sigue al nivel general.

**Preguntas:**
1. ¿Cómo hacer visible que el caso tiene su propio nivel? Por ejemplo:
   - mostrarlo junto al nombre del caso;
   - avisar al cambiar el nivel general si hay casos de otro nivel, con un botón para cambiarlos;
   - que el caso siga al nivel general mientras no tenga datos;
   - volver a un solo nivel.
2. ¿Qué pasa con lo ya elegido al cambiar? Hoy se conserva oculto y se marca «Por revisar» si había acuerdo.

## Tema 2 · El panel «Lo que elegiste»
**Cómo funciona hoy** (tarea 076, PR #97; `index.html` `#panel-elegidas`; `app.js` `pintarPanelElegidas`; `styles.css`):
- solo en escritorio, desde 80 rem (~1280 px);
- solo en «Para el curso (DUA)», en los pasos 2 y 3;
- mide 17 rem de ancho, junto a una columna de 46 rem;
- muestra:
  - «N elegidas para el curso»;
  - los títulos por momento, cortados a 2 líneas;
  - el botón «Ir a tu selección» (en el paso 3, «Ver documento»);
- mientras está a la vista, reemplaza a la barra de continuar de abajo.

En el consejo anterior ganó esta versión limitada: D 15 puntos, A (sin panel) 12, B (panel siempre) 9 y C (tarjetas en 2 columnas) 0. Las críticas al panel siempre visible fueron que duplica la barra y la mochila.

**Lo que pidió el dueño, con sus palabras:** «me gustó bastante la incorporación de "Lo que elegiste", siento que se podría mejorar (por ejemplo, más espacio, aparecer desde el comienzo, e incluirlo en la parte de ajustes individuales)».

**Preguntas:**
3. **¿Más ancho?** ¿Cuánto, sin achicar la columna de 46 rem? ¿Desde qué ancho de pantalla?
4. **¿Desde el paso 1?** ¿Qué muestra si todavía no hay nada elegido? Por ejemplo, el nivel, lo marcado en el paso 1 o un estado vacío útil.
5. **¿En «Para un estudiante»?** ¿Qué muestra?
   - El nivel del caso, que conecta con el tema 1.
   - Las situaciones marcadas.
   - Los apoyos elegidos por tipo.
   - El estado del acuerdo.
   ¿Y en «Práctica y trabajo»?
6. **¿Qué pasa con la mochila y la barra de continuar** si el panel crece? ¿Se fusionan, se reemplazan o conviven?

## Hechos verificados
- **Ajustes razonables:**
  - la Convención sobre los Derechos de las Personas con Discapacidad los define (art. 2, `docs/fuentes/normativa/cdpd.md`, línea 93);
  - la misma Convención los exige en la educación en general (art. 24.2.c, línea 447);
  - en la escuela chilena, los apoyos de acceso se llaman «adecuaciones de acceso» (Decreto 83), y Prizma usa ese término en parvularia, básica y media.
- **El Decreto 67, art. 5,** remite a los decretos 83 y 170 (`decreto-67-2018.md`, líneas 280-281).
