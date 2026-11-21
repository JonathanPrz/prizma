# Tarea 071 · Espacio en el paso 1 y aviso «Por revisar» sin acuerdo

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/071-ajustes-menores` · Pull request con destino `main`

## Para qué
Son tres detalles que vio el dueño o que aparecieron al revisar la tarea 069. No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## 1. Espacio bajo «Todo es opcional…»
En el paso 1 de DUA (`#paso-clase-cuerpo > p.ayuda`), la ayuda queda a **4 px** de «¿Qué harán principalmente?» a 390 px, y a 10 px a 1280 px. Se ve pegada.
- Deja **al menos 16 px** entre esa ayuda y la primera pregunta, en todos los anchos. Usa la escala de espacios que ya existe en `styles.css`.
- Revisa que el espacio entre «¿Qué harán principalmente?» (con su línea de taller) y «¿Cómo mostrarán lo que aprendieron?» sea igual o mayor que ese, para que se lean como dos preguntas.
- No cambies la altura del paso 1 en más de 40 px (hoy debe medir 600 px o menos a 390 px, según la tarea 068).

## 2. «Por revisar» en un caso sin acuerdo
Hoy, al cambiar el nivel de un caso con apoyos que dejan de aplicar, `app.js` (oyente de `#nivel-estudiante`) hace `e.acuerdo.estado = "por-revisar"` **aunque el caso nunca tuvo un acuerdo**. Entonces aparece «Cambiaste el caso después del acuerdo. Revisa los acuerdos», que es falso.
- Cambia esa línea por `marcarRevision(e)`. Un caso con acuerdo completo pasa a «Por revisar». Un caso sin acuerdo queda «Sin acuerdos», y el aviso del cambio de nivel («… 1 apoyo ya no aplica y queda guardado») basta.
- Agrega punto final al aviso en `#acuerdos-revisar` y `#trabajo-revisar`: «Cambiaste el caso después del acuerdo. Revisa los acuerdos.»

## 3. Nombre del nivel en el aviso
El aviso del cambio de nivel usa el valor interno: «Cambiaste a basica». Debe decir el nombre legible, en minúscula y con tilde:
- Cambiaste a educación parvularia.
- Cambiaste a educación básica.
- Cambiaste a educación media.
- Cambiaste a educación superior.

## Pruebas
Ajusta `scripts/probar_niveles.cjs` sin debilitarla:
- Un caso **sin acuerdo**, con una adecuación en los objetivos, que pasa de básica a superior:
  - aparece «Cambiaste a educación superior: 1 apoyo ya no aplica y queda guardado»;
  - el estado del caso sigue en «Sin acuerdos»;
  - `#acuerdos-revisar` sigue oculto.
- El mismo caso **con acuerdo completo** pasa a «Por revisar» y muestra el aviso, que termina en punto.
- Al pasar a básica sin fichas ocultas, el aviso dice «Cambiaste a educación básica.».

Agrega a `scripts/probar_pagina.cjs`: a 390 y 1280 px, la distancia entre la ayuda del paso 1 y la leyenda «¿Qué harán principalmente?» es de 16 px o más.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas del paso 1 a 390 px, antes y después.

## Criterios de aceptación
- [ ] La ayuda del paso 1 tiene al menos 16 px de aire antes de la primera pregunta.
- [ ] Cambiar el nivel de un caso sin acuerdo no lo marca «Por revisar».
- [ ] Los avisos dicen el nombre legible del nivel y terminan en punto.
- [ ] Pasan el validador y todas las pruebas.
