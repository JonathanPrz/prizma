# Tarea 078 · El nivel del caso a la vista, y el panel «Lo que elegiste» en todos los pasos y ámbitos

Estado: **integrada** (PR #100) · Asignada a: Codex (lo implementó un agente de Claude) · Rama: `codex/078-nivel-y-panel` · Pull request con destino `main`

## Para qué
**El problema que vivió el dueño:** «si inicialmente pongo educación superior y comienzo a seleccionar cosas, pero después cambio a, digamos, educación parvularia, sigue todo el rato como ajuste razonable».
- Hay **dos niveles**: el general (`#nivel`) y el de cada caso (`#nivel-estudiante`). Cambiar el general no toca los casos existentes, y Prizma no lo dice.
- **Error medido:** con datos limpios, el primer caso nace en básica. Si la persona elige «superior» arriba antes de escribir nada en el caso, el caso sigue en básica.
- **Con un caso en superior,** la pestaña dice «Ajustes razonables» aunque se esté en DUA con otro nivel.

**Al dueño también le gustó el panel «Lo que elegiste»** (tarea 076) y pidió más espacio, que aparezca desde el comienzo y que esté también en los apoyos individuales.

**Lo decidió el consejo 078** (`docs/consejos/078-nivel-y-panel/sintesis.md`). El dueño lo aprobó con tres ajustes del líder:
1. en el paso 1 de DUA, el panel no repite lo que se marca al lado;
2. el paso 3 de DUA se llama «Tu selección»;
3. la pestaña siempre dice «Para un estudiante».

No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## 1. Los niveles
**Caso vacío.** Un caso está vacío si `datosEstudiante(e)` (o `datosTrabajador(e)` en Práctica y trabajo) es `false`.
- **Al cambiar el nivel general,** todo caso educativo vacío toma ese nivel, sin aviso.
- **Al cargar la página,** un caso vacío se alinea con el nivel general.
- **No cambia** a los casos con datos.

**Casos con datos.** Al cambiar el nivel general, si hay casos con datos de otro nivel, aparece junto a `#nivel` un aviso `role="status"`:
- 1 caso: «JP sigue en Educación superior. Puedes cambiarlo dentro del caso.».
- Varios casos: «2 casos siguen con su propio nivel. Puedes cambiarlo dentro de cada caso.».

Sin botón de cambio masivo.

**Textos:**
- **`#nivel`:** su etiqueta pasa a «Nivel para el curso». Ayuda: «Ordena las acciones para todo el curso. Cada estudiante tiene su propio nivel.».
- **`#nivel-estudiante`:** su etiqueta pasa a «Nivel de este estudiante». La ayuda no cambia.
- **Encabezado del caso:** junto al título del caso («Apoyos para JP» o «Ajustes razonables para JP»), una línea visible: «Nivel: Educación superior», con el nombre de `NIVELES`.
- **Pestaña `#tab-apoyos`:** siempre «Para un estudiante». Se quita el cambio a «Ajustes razonables» en `app.js`, cerca de la línea 1052. Dentro del caso, los títulos siguen usando `nivelCaso(e)`.
- **El aviso al cambiar el nivel de un caso** (tarea 071) no cambia.

## 2. Panel «Lo que elegiste»
**Medidas.** El panel mide **20 rem** (hoy 17) y la columna sigue en **46 rem**.
- Aparece desde **80 rem** de ancho de ventana, como hoy. Si con 20 rem no cabe sin desplazamiento horizontal ni sin achicar la columna, sube el punto de quiebre y dilo en el pull request.
- Sigue después de la columna en el DOM, no aparece en modo proyección y reemplaza a la barra de continuar mientras está a la vista.

**Contenido por ámbito y paso:**
```
Para el curso (DUA)
  Paso 1: «Nivel del curso: Educación básica» · «Todavía no eliges acciones para el curso.» (o «N elegidas para el curso», si ya hay)
          Botón: [Ver acciones]   (misma acción que la barra hoy)
  Paso 2: como hoy (N elegidas, por momento) · [Ir a tu selección]
  Paso 3 «Tu selección»: como hoy · [Ver documento]

Para un estudiante (caso activo)
  Título: «Lo que elegiste para JP»
  «Nivel: Educación superior»
  Paso 1: «Situaciones marcadas: 3» (sin nombrarlas) · [botón principal actual del paso 1]
  Paso 2: «N apoyos elegidos», agrupados por tipo con sus títulos (como en la mochila) · [Ir a acuerdos]
  Paso 3: «Acuerdo: Sin acuerdos / Por revisar / Acuerdos completos» (estadoCaso) · [Guardar acuerdos] o [Ver documento], según corresponda hoy

Práctica y trabajo (caso activo)
  Igual que «Para un estudiante», con «N ajustes elegidos» y los textos y botones propios del ámbito
  («Ver documento para el centro» cuando corresponda).
```
**Reglas:**
- **El botón del panel es el mismo** que el de la barra de continuar (`pintarAccionPrincipal`), con el mismo texto y la misma acción. Nunca hay dos.
- **Sin elecciones** no hay lista: solo el conteo en cero con su texto.
- **La mochila no cambia.**
- **Los nodos se crean con `el()`.** Se vuelve a pintar con el mismo render que hoy, al cambiar de paso, de caso, de nivel o de elección.

## Pruebas
Agrega `scripts/probar_nivel_panel.cjs` y ajusta, sin debilitarlas, las pruebas que esperen 17 rem, la pestaña «Ajustes razonables» o el panel solo en DUA.

**Nivel:**
- con datos limpios, al elegir «superior» arriba, el caso vacío queda en superior;
- en DUA, la pestaña dice «Para un estudiante»;
- con un caso con datos en superior, cambiar el nivel general a parvularia:
  - no cambia el caso;
  - muestra «… sigue en Educación superior …»;
  - y, al volver a la pestaña, el encabezado dice «Nivel: Educación superior»;
- un caso con datos en básica cuyo nivel se cambia a superior conserva el aviso de la tarea 071;
- las etiquetas de `#nivel` y `#nivel-estudiante` son las nuevas, y sus ayudas están unidas con `aria-describedby`.

**Panel, a 1280 px:**
- en el paso 1 de DUA, el panel es visible con «Nivel del curso» y no repite actividad ni evidencia;
- en el paso 2 de DUA, como hoy;
- en «Para un estudiante», con un caso de 2 apoyos, el panel muestra «Nivel: …» y «2 apoyos elegidos» en el paso 2, y el estado del acuerdo en el paso 3;
- en «Práctica y trabajo», el panel muestra los ajustes;
- en todos los casos, la barra de continuar está oculta mientras el panel está visible, y su botón hace lo mismo que el de la barra;
- el panel mide 320 px (±2) y la columna, 736 px (±2);
- a 1000 px y a 390 px no hay panel, sí hay barra, y no hay desplazamiento horizontal.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

**Antes de cada commit,** descarta los archivos que las pruebas antiguas regeneran en `docs/marca/` y `docs/auditorias/`. En el pull request, agrega capturas a 1280 px de:
- DUA, paso 1;
- «Para un estudiante», pasos 2 y 3;
- «Práctica y trabajo», paso 2.

## Criterios de aceptación
- [ ] Un caso vacío sigue al nivel general, y uno con datos conserva el suyo con aviso.
- [ ] El nivel del caso se ve en su encabezado, y la pestaña siempre dice «Para un estudiante».
- [ ] El panel mide 20 rem, aparece desde el paso 1 y en los tres ámbitos, con el contenido de cada paso, y nunca duplica el botón de la barra.
- [ ] Pasan el validador y todas las pruebas.
