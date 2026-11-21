# Tarea 072 · Resumen para la familia

Estado: **integrada** (PR #93) · Asignada a: Codex · Rama: `codex/072-resumen-familia` · Pull request con destino `main`

## Para qué
El cuarto consejo de inclusión (21-11-2026) dejó esta versión para una tarea propia, y el dueño la aprobó.

Hoy la familia recibe el «Plan completo», un documento técnico con:
- la tabla CIF;
- tipos oficiales («Adecuaciones de acceso · Presentación de la información»);
- el dato DUA;
- las fuentes.

El Decreto 83 pide que el plan se elabore con la participación de la familia y quede a su disposición (`docs/fuentes/normativa/decreto-83-2015.md`, línea 497). Esta tarea agrega una hoja corta, en lenguaje claro, para entregar o leer con la familia en la reunión. **No reemplaza el plan ni el PACI.**

Depende de la tarea 070 (diálogo «¿Qué documento necesitas?»). No cambies `data/`, `docs/fuentes/` ni `.claude/`.

## 1. Dónde aparece
En `#incluir-documento`, una tercera opción bajo «Plan completo»:
- ○ **Resumen para la familia** · ayuda: «Una hoja por estudiante, en palabras simples. Para leer con la familia.»

Cuándo se muestra:
- Solo en Educación. Se oculta en Práctica y trabajo y en el documento del centro de práctica.
- Se desactiva si no hay casos con datos en parvularia, básica o media. Entonces la ayuda dice: «Agrega un caso de parvularia, básica o media para armar el resumen.»
- **Los casos de superior no se ofrecen:** el estudiante es adulto y decide qué compartir.

Al elegir esta opción, se ven solo las casillas de los estudiantes que cumplen lo anterior (sin «Acciones para todo el curso»). Por defecto vienen todos marcados. Si no queda ninguno marcado, el error dice: «Elige al menos un estudiante.»

## 2. Contenido (una hoja por estudiante)
```
[logo] Prizma
Apoyos para JP
Resumen para la familia · 21 de noviembre de 2026 · Educación básica

Cuándo le cuesta más en el colegio
  • Cuando debe leer textos largos, copiar de la pizarra, escribir a mano o calcular de memoria.
  • …                                   (el segundo texto de DIMENSIONES de cada situación marcada,
                                          ordenadas de mayor a menor frecuencia; sin la frecuencia
                                          ni el título técnico)

Qué le ayuda                            (e.ayuda; se omite si está vacío)
Lo que nos contaron                     (e.voz; se omite si está vacío)

Qué haremos en el colegio
  • Lee en voz alta los enunciados o entrégalos en audio
  • …                                   (títulos de los apoyos elegidos, con textoModalidad;
                                          sin tipo oficial, pasos, «por qué», dato ni notas)

Lo que acordamos para la casa
  ________________________________________________
  ________________________________________________   (3 líneas para completar a mano)

Próxima conversación: 15 de diciembre de 2026        (acuerdo.revision; si falta, línea en blanco)
¿Cómo sabremos que funciona?: <criterio>              (si falta, línea en blanco)

Tiene un Plan de Adecuación Curricular Individual (PACI). Pueden pedir verlo.   (solo si e.paci)

Pie: «Este resumen no es un diagnóstico: describe situaciones del colegio y los apoyos que probaremos.
      Si tienen dudas, conversen con el equipo.»
```

**Reglas:**
- **Cada estudiante empieza en una página nueva.** Con hasta 6 situaciones y 8 apoyos, **cabe en 1 página A4**, con letra de al menos 11 pt.
- **Sin siglas sin explicar.** La única es PACI, con su nombre completo.
- **Sin** tabla CIF, frecuencias, tipos oficiales, dato DUA, fuentes, notas de la docente, PAEC ni DEC. La familia ya conoce el PAEC y el protocolo DEC por otra vía, y aquí podrían alarmar sin contexto.
- **Los apoyos que no corresponden a la modalidad actual** (`compatibleModalidad`) no se incluyen.
- **La vista `#hoja` y el PDF dicen lo mismo.** El archivo se descarga como `prizma-familia-<fecha>.pdf`, igual que los demás y sin iniciales.

## Pruebas
Agrega `scripts/probar_resumen_familia.cjs`:
- **Diálogo:** con un caso de básica con datos, aparece «Resumen para la familia». Al elegirlo, se ve la casilla del caso y no la de «Acciones para todo el curso».
- **Superior:** un caso de superior no aparece como casilla. Si es el único caso, la opción está desactivada con su ayuda.
- **Práctica y trabajo:** la opción no aparece.
- **Contenido** (caso con 2 situaciones de frecuencias distintas, 2 apoyos, `ayuda` llena, `voz` vacía, PACI marcado y fecha de revisión):
  - las situaciones salen en orden de frecuencia, con el texto «Cuando…»;
  - no aparecen «Lo que nos contaron», «Barreras y facilitadores», «Adecuaciones de acceso», «DUA 3.0», «Fuentes» ni las notas;
  - aparece la línea del PACI y la fecha de revisión en formato largo;
  - aparecen 3 líneas en blanco para la casa.
- **Sin PACI,** la línea del PACI no aparece.
- **Páginas:** con 2 casos, el PDF tiene 2 páginas. Con 6 situaciones y 8 apoyos, 1 página por caso. Para contarlas, usa `pdfMake.createPdf(def).getBuffer` y cuenta `/Type /Page` que no sea `/Pages`.
- **Sin desplazamiento horizontal** en la vista a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega una captura del PDF de un resumen.

## Criterios de aceptación
- [ ] El diálogo ofrece «Resumen para la familia» solo cuando hay casos de parvularia, básica o media.
- [ ] Cada estudiante tiene una hoja en lenguaje claro, sin tabla CIF, siglas sin explicar, datos técnicos ni notas.
- [ ] Cabe en 1 página por estudiante en el caso de referencia. La vista y el PDF dicen lo mismo.
- [ ] Pasan el validador y todas las pruebas.
