# Tarea 067 · Resultados DUA en carpetas por momento, con lo que responde primero

Estado: **integrada** (PR #88) · Asignada a: Codex · Rama: `codex/067-resultados-momento` · Pull request con destino `main`

## Para qué
El dueño marcó «laboratorio» y el filtro «Antes». El conteo decía «Antes: 1 de 11 acciones responde», pero aparecieron las 11 abiertas en una lista plana. Esperaba una carpeta «Antes» con lo que responde distinguido.

Un debate de 10 especialistas, con críticas cruzadas, votación y un moderador (20-11-2026), llegó a esta solución, y el dueño la aprobó. Se descartan:
- la lista plana con filtro de momento;
- la sección «Recomendadas para tu clase» y su tope de 6. Con un contexto todas las acciones empatan, así que su «orden de prioridad» era casi falso, el mismo error de «Empieza por».

Esta tarea reemplaza la forma de los resultados DUA de la tarea 065. **No cambies `data/`, `docs/fuentes/` ni `.claude/`.** Adecuaciones y trabajo no cambian.

**La regla para el docente:** «Tu clase se ve por momentos. En cada uno van primero las acciones que responden a lo que marcaste. Los filtros solo dejan lo que elijas.»

## 1. Una sola forma: carpetas por momento
`pintarTarjetas` queda con dos ramas: **necesidades** («Para lo que marcaste», sin cambios) y **carpetas**. Se borran `seccionRecomendadas`, `recomendadasDua` y la rama de lista plana.

Las carpetas van en orden de clase: Antes, Durante, Después y En toda la clase. Los filtros (Momento y Para qué) solo quitan carpetas o tarjetas. «Responder» es `respondeAlContexto(r)`.

**Cada carpeta (`carpetaMomento`, que reemplaza a `grupoPlegado` en DUA):**
- **Título:**
  - sin contexto: «Antes (11)»;
  - con contexto: «Antes (11 · 1 responde)», «Durante (14 · 6 responden)» o «Después (4 · ninguna responde)».
- **Se abre sola si:**
  - su momento está elegido en el filtro;
  - hay filtro «Para qué»;
  - o tiene acciones que responden.

  Si no, queda plegada. La persona puede abrirla o cerrarla, y se respeta lo que elija mientras no cambien los filtros ni el paso 1.
- **Contenido, con contexto y acciones que responden:**
  - hasta **3** tarjetas que responden, abiertas, con «Responde a lo que marcaste: …»;
  - debajo, un `details` nativo plegado: «Ver las otras N de Antes». Dentro van primero las que responden que no cupieron y luego las demás.
- **Sin contexto, o una carpeta elegida con 0 que responden:** todas sus tarjetas a la vista, sin el `details` interno.

**Orden dentro de cada carpeta:** `compararPertinenciaDua`. **Cambia su desempate:** después de las coincidencias, ordena por principio (Compromiso, Representación, Acción y expresión) y luego por número de pauta. Hoy, el número deja a Compromiso siempre al final.

## 2. Aviso cuando no responde ninguna
Si hay contexto y un momento elegido, o el cruce de filtros, no tiene ninguna acción que responda, arriba de las carpetas va un aviso (`.aviso-apoyos`, ícono «!», `role="status"`):
- «Ninguna acción de Antes responde a lo que marcaste. Responden en: [Durante (3)]». Hay un botón por cada momento con coincidencias, que **reemplaza el filtro de momento** por ese y lleva el foco al `summary` de su carpeta.
- Si el cruce incluye «Para qué» y no hay ningún momento con coincidencias para ese principio, nombra los principios que sí tienen, con un botón por cada uno: «Ninguna acción de Compromiso responde a lo que marcaste. Responden en: [Representación (3)] [Acción y expresión (1)]».
- Sin filtros, no hay aviso: las carpetas sin coincidencias solo dicen «· ninguna responde».

Usa la misma forma, con `.aviso-apoyos` y «Quitar filtros», para el grupo vacío de necesidades que ya existe.

## 3. Conteo
`#conteo` se ubica justo bajo los chips de filtros, antes de las carpetas. Mantiene los textos de la tarea 066: «8 de 36 acciones responden a lo que marcaste» y «Antes: 1 de 11 acciones responde a lo que marcaste».

## 4. Casos de referencia (básica)
- **Nada marcado:** «36 acciones para todo el curso». Antes (11), Durante (14), Después (4) y En toda la clase (7), plegadas.
- **Taller, sin filtros:**
  - Antes (11 · 1 responde), abierta: 1 tarjeta + «Ver las otras 10 de Antes».
  - Durante (14 · 6 responden), abierta: 3 tarjetas + «Ver las otras 11 de Durante».
  - Después (4 · ninguna responde), plegada.
  - En toda la clase (7 · 1 responde), abierta: 1 tarjeta + «Ver las otras 6».
- **Taller + Antes:** solo Antes (11 · 1 responde), abierta: 1 tarjeta + «Ver las otras 10 de Antes».
- **Taller + Antes + Compromiso:** ninguna responde. Aviso con [Durante (1)] y [En toda la clase (1)], y Antes (4 · ninguna responde) abierta con las 4.
- **Moverse + Antes:** aviso «… Responden en: [Durante (3)]», y Antes (11 · ninguna responde) abierta con las 11.
- **Solo Antes, sin paso 1:** Antes (11), abierta, con las 11.
- **Solo Compromiso, sin paso 1:** las 4 carpetas con sus acciones de Compromiso, abiertas.
- **Con necesidades:** igual que hoy. «Las demás acciones» usan carpetas por momento con esta misma regla.

## 5. Proyección
Por ahora, proyecta lo que se ve: las carpetas, desplegadas, con todas sus tarjetas, incluidas las de «Ver las otras». Proyectar lo elegido en la mochila queda para una tarea aparte.

## Pruebas
- Reescribe, sin debilitarlas, las pruebas de la tarea 065 que esperan la lista plana, «Recomendadas para tu clase» o `#t-dua-recomendadas`. `guardarClase` (o lo que la reemplace) lleva el foco a `#t-dua-marcadas` o a `#acciones`.
- Agrega una prueba para cada caso de referencia de la sección 4: títulos, qué carpetas se ven abiertas, cuántas tarjetas abiertas tiene cada una y si existe «Ver las otras N».
- Además:
  - nunca hay más de 3 tarjetas abiertas por carpeta fuera de su `details` cuando hay contexto;
  - el desempate pone una acción de Compromiso antes que una de Representación con las mismas coincidencias;
  - el botón del aviso cambia el filtro y deja el foco en el `summary` de la carpeta nueva;
  - a 390 px, con taller y sin filtros, mide el alto de los resultados e infórmalo en el pull request (sin umbral);
  - sin desplazamiento horizontal a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas a 390 y 1280 px de: nada marcado, taller sin filtros, taller + Antes y moverse + Antes.

## Criterios de aceptación
- [ ] Una sola forma, con carpetas por momento en orden de clase. No hay lista plana ni «Recomendadas».
- [ ] Lo que responde va primero y abierto, hasta 3 por carpeta, y el resto queda en «Ver las otras N».
- [ ] Los títulos dicen cuántas responden. Cuando no responde ninguna, el aviso indica dónde sí hay.
- [ ] Desempate por principio.
- [ ] Pasan el validador y todas las pruebas.
