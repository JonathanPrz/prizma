# Tarea 055 · Dos detalles del paso 3 «Acuerda»

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/055-detalles-acuerdos` · Pull request con destino `main`

## Para qué
Dos detalles que quedaron de la revisión del PR #74. Son cambios pequeños: no toques nada más.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. El error de roles va bajo la pregunta
Hoy «Elige al menos un rol» aparece después de las 7 opciones. En el teléfono queda lejos de la pregunta y la barra de abajo lo tapa.

- En `index.html`, mueve `#acuerdo-roles-error` y `#trabajo-acuerdo-roles-error` justo después del `legend`, antes de la lista de opciones.
- La asociación con `aria-describedby` y `aria-invalid` sigue igual.

## 2. La barra dice lo que hace en el paso 3
Hoy, en «Para un estudiante» y en «Práctica y trabajo», el botón de la barra dice «Ver documento» aunque los acuerdos no estén completos. Al presionarlo, guarda los acuerdos y solo abre el documento si están completos.

- En `actualizarContinuar()`, con el paso 3 en `apoyos` o `trabajo`:
  - si el caso no está en «Acuerdos completos», el texto es «Guardar acuerdos»;
  - si está completo, el texto es «Ver documento», o «Ver documento para el centro» si el caso es de etapa `practica`.
- Tras guardar con éxito, el texto se actualiza.
- En DUA no cambia nada.

## Pruebas
Agrégalas a `scripts/probar_pagina.cjs`:
- a 390 px, con los acuerdos vacíos, el error de roles queda sobre la primera opción y no lo tapa la barra;
- en el paso 3, con acuerdos incompletos, la barra dice «Guardar acuerdos». Tras completarlos y guardar, dice «Ver documento»;
- en un caso de práctica con acuerdos completos, dice «Ver documento para el centro».

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] El error de roles aparece bajo la pregunta.
- [ ] La barra dice «Guardar acuerdos» hasta que estén completos.
- [ ] Pasan el validador y todas las pruebas.
