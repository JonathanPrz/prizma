# Tarea 062 · La página no salta al hacer clic, y «Empieza por:» en vez de «Para empezar»

Estado: **integrada** (PR #83) · Asignada a: Codex · Rama: `codex/062-salto-empieza-por` · Pull request con destino `main`

## Para qué
El dueño aprobó dos cambios el 20-11-2026, el segundo después de una revisión adversarial.

1. **La página salta al hacer clic.** Medido en `main`: al presionar una opción de «¿Qué quieres resolver en esta clase?» cerca de la barra de abajo, la página se mueve entre 3 y 27 px, a 390 y a 1280 px. Hay dos causas:
   - el `focusin` de `prepararAvisos()` (app.js, cerca de la línea 2103), que corrige la posición para el teclado, también actúa con el mouse y el dedo;
   - `pintarControles()` vuelve a crear los botones de `#necesidades` con cada clic y luego mueve el foco con `.focus()`.
2. **«Para empezar» le quita su función a las categorías.** La mejor ficha de un grupo («Durante» o «Presentación») se saca de su grupo y va a un bloque aparte, así que el grupo queda incompleto. Pero sin un punto de partida, quien usa la página por primera vez no sabe qué abrir. Abrir todos los grupos con coincidencias tampoco sirve: dejaría entre 15 y 36 tarjetas abiertas.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Sin saltos al hacer clic
- En el `focusin`, corrige la posición **solo cuando el foco viene del teclado:** si `!foco.matches(":focus-visible")`, no hagas nada. Con Tab, el campo debe seguir quedando a la vista, sin taparse con la barra ni con el indicador (tareas 054 y 060).
- **Los botones que cambian de estado al presionarlos** se actualizan en su lugar (`aria-pressed` y clase), sin `replaceChildren` ni `.focus()` posterior:
  - `#necesidades`;
  - `#momentos` y `#propositos` en `pintarFiltrosVista`;
  - cualquier otro grupo de botones que se redibuje y después reciba el foco por código.

  El foco se queda en el botón que se presionó.
- **Al guardar** («Guardar» de la clase, «Guardar descripción» o la barra), se mantiene el salto a los resultados, porque es intencional. Que sea **un solo desplazamiento**: el título del paso 2 queda visible bajo el indicador, sin un segundo ajuste del `focusin`.

## 2. «Empieza por:» en lugar del bloque «Para empezar»
Vale para:
- DUA sin necesidades marcadas;
- adecuaciones, que en superior son ajustes razonables;
- trabajo con etapa `trabajo`.

DUA con necesidades marcadas («Para lo que marcaste») **no cambia**.

- **Se elimina** el bloque de tarjetas abiertas «Para empezar». Ninguna ficha se excluye de su grupo (quita `destacadas` e `ids`), así que cada ficha vive solo en su categoría y los conteos quedan completos.
- **Arriba de los grupos** va un bloque corto:
  - un título `p` con `id` y `tabindex="-1"` que dice «Empieza por:». En DUA, conserva el `id` `t-dua-empezar`, que `probar_correcciones_botones.cjs` usa como foco de respaldo;
  - una lista de 3 enlaces (4 en trabajo) con los títulos de las fichas mejor puntuadas, con el mismo criterio de hoy (`compararAcceso`, o `compararPertinenciaDua` en DUA). Respeta `textoModalidad`;
  - la ayuda «Responden mejor a lo que describiste».
- **Al activar un enlace:**
  - se abre el `details` del grupo que contiene la ficha;
  - el foco va al título de la ficha o a su botón «Elegir», como hace hoy el aviso de seguridad (cerca de la línea 106);
  - la ficha queda visible bajo el indicador.

  Cada enlace mide al menos 24 px de alto y tiene foco visible.
- **Todos los grupos quedan plegados por defecto.** Se mantiene el estado abierto o cerrado que la persona elija. `grupoPlegado` arma hoy su clave con `acciones[0].id`: cámbiala por el nombre del grupo, para que no se pierda cuando cambie el orden.
- **Orden de los grupos:**
  - en DUA, Antes, Durante, Después y En toda la clase;
  - en adecuaciones y trabajo, el orden de hoy, primero el grupo con la ficha más pertinente.
- **Solo en DUA:** si un momento tiene acciones que responden a lo marcado (`coincidencias(r).length > 0`), su título agrega «· N responden a lo que marcaste», por ejemplo «Durante (14) · 3 responden a lo que marcaste». En adecuaciones y trabajo no se agrega, porque ahí responden todas.
- Dentro de cada grupo, las fichas más pertinentes van primero, como hoy. Cada tarjeta conserva su «Porque marcaste…».

## Pruebas
- Ajusta, sin debilitarlas, las pruebas que esperan el bloque «Para empezar» con tarjetas.
- Agrégalas a `scripts/probar_pagina.cjs`:
  - a 390 y 1280 px, al hacer clic en cada opción de `#necesidades`, `#momentos` y `#propositos` cerca de la barra, `scrollY` no cambia, y el foco sigue en el botón presionado;
  - con Tab hasta un campo que queda bajo la barra, la página se desplaza y el campo queda visible;
  - al guardar la clase, `scrollY` cambia una sola vez: mide durante 600 ms y no hay un segundo cambio. «2. Acciones sugeridas» queda bajo el indicador;
  - en adecuaciones, con 2 situaciones marcadas, no hay tarjetas abiertas fuera de los grupos. «Empieza por:» tiene 3 enlaces, y la suma de los conteos de los grupos es igual al total de fichas visibles;
  - al activar el primer enlace de «Empieza por:», se abre su grupo y el foco queda en esa ficha;
  - en DUA sin necesidades y con contexto marcado, el título de al menos un momento contiene «responden a lo que marcaste». En adecuaciones, ningún grupo lo contiene;
  - en DUA con necesidades, «Para lo que marcaste» se ve igual que antes;
  - sin desplazamiento horizontal a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas a 390 y 1280 px de los resultados de adecuaciones y de DUA, antes y después.

## Criterios de aceptación
- [ ] Hacer clic en botones de opción no mueve la página. El teclado sigue llevando el foco a la vista.
- [ ] Guardar hace un solo desplazamiento a los resultados.
- [ ] «Empieza por:» reemplaza al bloque «Para empezar», y las categorías quedan completas y plegadas.
- [ ] DUA con necesidades no cambia.
- [ ] Pasan el validador y todas las pruebas.
