# Tarea 064 · Una sola guía para «Práctica y trabajo»

Estado: **integrada** (PR #85) · Asignada a: Codex · Rama: `codex/064-guia-unificada` · Pull request con destino `main`

## Para qué
Quedó pendiente de las tareas 051 y 052. Hoy el nivel «Práctica y trabajo» tiene dos guías separadas, y cada una se ve solo en una etapa:
- **`#guia-trabajo`:** «¿Qué son los ajustes en el trabajo y qué exige la ley?», que se abre con `#enlace-guia-trabajo` y `.enlace-guia-trabajo`. Se oculta en la etapa de práctica.
- **`#guia-practica`:** «¿Quién hace qué en la práctica?», que se abre con `#enlace-guia-practica` y muestra la sección de media o de superior.

Quien acompaña a una persona desde la práctica hasta su primer empleo necesita ver el recorrido completo en un solo lugar. **Los textos legales ya revisados no cambian:** se reordenan en una sola guía y se agrega una sección corta sobre el paso entre las dos etapas.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Un solo diálogo
Reemplaza los dos diálogos por `#guia-nivel`, con el título «Guía de Práctica y trabajo». Lleva:
1. **Un índice** con tres enlaces internos: «En la práctica profesional», «Del paso al primer empleo» y «En el trabajo».
2. **«Antes de empezar»,** para las dos etapas. Va primero y reúne los principios comunes:
   - «La persona decide qué información se comparte y con quién. Pedir un ajuste no autoriza entregar el diagnóstico ni el expediente (Ley 19.628; Ley 21.719 desde el 1 de diciembre de 2026).» Es el texto actual de la guía de práctica;
   - «Escribe solo iniciales y describe situaciones, sin diagnósticos.»
3. **«En la práctica profesional»,** con el contenido actual de `#guia-practica`, sin cambios:
   - la subsección de media técnico-profesional (Decreto 2.516);
   - la subsección de educación superior;
   - el punto de colación y movilización (Código del Trabajo, art. 8).

   Se muestran las dos subsecciones, y la del `nivelOrigen` del caso activo va primero.
4. **«Del paso al primer empleo»,** que es nueva, con este texto:
   - «Lo acordado en la práctica no pasa solo al empleo: la persona decide qué contarle a su nuevo empleador.»
   - «“Preparar su primer empleo” copia las situaciones y lo que le ayuda, para revisarlos con la persona. No copia lo que dijo ni lo que compartió con el centro.»
   - «En el empleo, los ajustes los hace el empleador. Los de la práctica sirven para conversarlos.»
   - «Si aún es menor de edad, para trabajar necesita autorización (Código del Trabajo, art. 13).»
5. **«En el trabajo»,** con el contenido actual de `#guia-trabajo`, sin cambios: qué son los ajustes necesarios, qué exige la ley por tamaño de empresa, el sector público y qué hacer si se rechaza un ajuste, con su enlace a la Dirección del Trabajo.
6. **El cierre de hoy:** «Orientación basada en la normativa citada, vigente al 16 de noviembre de 2026. No es asesoría legal.», y el botón «Entendido».

Los títulos de sección son `h3`, y las subsecciones, `h4`. Mantén `aria-labelledby` hacia el título y el comportamiento del diálogo: foco al abrir y foco de vuelta al cerrar, incluida la lógica de `privacidadPendiente`.

## 2. Un solo enlace, visible en las dos etapas
- En la cabecera de `#panel-trabajo`, un enlace «Guía de Práctica y trabajo» reemplaza a `#enlace-guia-trabajo`, y queda visible también en la etapa de práctica.
- `#enlace-guia-practica` («¿Quién hace qué en la práctica?») se mantiene dentro del bloque de práctica, pero abre la guía unificada en la sección «En la práctica profesional».
- Los demás `.enlace-guia-trabajo` abren la guía en «En el trabajo».
- **Al abrir la guía desde la cabecera,** se desplaza hasta la sección de la etapa del caso activo: práctica o trabajo. El foco va al título del diálogo, como hoy.

## Pruebas
- Ajusta, sin debilitarlas, las pruebas que usan `#guia-trabajo`, `#guia-practica` o `#guia-practica-entendido`. Mantén las comprobaciones de los textos legales y del enlace a la Dirección del Trabajo.
- Agrégalas a `scripts/probar_practica_trabajo.cjs`:
  - hay un solo diálogo de guía en el nivel, y el enlace de la cabecera se ve en las dos etapas;
  - la guía tiene, en orden, «Antes de empezar», «En la práctica profesional», «Del paso al primer empleo» y «En el trabajo», y el índice lleva a cada una;
  - en un caso de práctica de superior, la subsección de superior va antes que la de media;
  - desde la cabecera en un caso de trabajo, la sección «En el trabajo» queda visible al abrir;
  - al cerrar, el foco vuelve al enlace que abrió la guía;
  - los textos de Decreto 2.516, art. 154 ter, 157 bis y Ley 21.719 siguen presentes;
  - sin desplazamiento horizontal a 390 px dentro del diálogo.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] Una sola guía, con el recorrido de la práctica al trabajo, visible desde las dos etapas.
- [ ] Los textos legales no cambian, solo se reordenan.
- [ ] La sección nueva «Del paso al primer empleo» tiene el texto aprobado.
- [ ] Pasan el validador y todas las pruebas.
