# Tarea 024 · Auditoría: de 1 a 10 estudiantes, ¿las recomendaciones son las adecuadas?

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/024-auditoria-estudiantes`

## Para qué

El dueño ingresó 4 estudiantes y sintió que «solo cambian los nombres». Claude lo reprodujo:
- los datos se separan bien;
- el perfil es delgado: dos estudiantes con la misma situación reciben la misma lista;
- hay recomendaciones que no corresponden. Por ejemplo, a un estudiante con dificultades de comunicación le aparece «Entrega las palabras clave también en su lengua»;
- «Visión y audición» es una sola situación;
- con una situación marcada, el orden de las fichas es casi arbitrario.

Esta tarea es **solo de auditoría**. Mide con datos y deja un informe. **No cambies `app.js`, `index.html`, `styles.css`, `data/`, `docs/fuentes/` ni `.claude/`.** Puedes crear solo `scripts/auditar_estudiantes.cjs` y los archivos de `docs/auditorias/024-estudiantes/`.

## Método

### 1. Diez perfiles de prueba
Escríbelos en el informe. Descríbelos por lo que pasa en la sala, sin diagnósticos, igual que un docente los ingresaría en Prizma: qué situaciones marca, con qué frecuencia y qué escribe en «¿Qué le ayuda?» y en la voz. Deben ser distintos entre sí:
- dificultad para leer y escribir;
- baja visión (lee con lupa, no ve la pizarra);
- sordera, usuario de lengua de señas;
- dificultad para comunicarse oralmente, en su lengua materna, que es el español;
- recién llegado que no habla español;
- se distrae, le cuesta empezar y terminar tareas;
- usa silla de ruedas y escribe con dificultad;
- muy sensible al ruido, se angustia con los cambios y los recreos;
- enfermedad crónica con ausencias y fatiga;
- avanza más rápido que el curso y se aburre.

### 2. Escenarios
Con un script en Node que cargue `app.js` en `vm`, como las pruebas existentes:
- **N = 1, 2, 3 … 10 estudiantes**, agregando un perfil por vez en el orden de la lista;
- en **cada nivel**: parvularia, básica, media y superior;
- con la casilla de práctica apagada y encendida (solo básica, media y superior).

### 3. Qué medir en cada escenario
- **Por estudiante:**
  - cuántos apoyos ve;
  - los 5 primeros, en orden;
  - si hay empates en el orden.
- **Entre estudiantes:**
  - cuánto se parecen sus listas, medido por la proporción de fichas compartidas;
  - qué pares tienen listas idénticas.
- **Conversación con el DUA:**
  - qué muestra el recuadro «Barreras que se repiten»;
  - qué versiones DUA se ofrecen;
  - si algún mensaje es incorrecto o confuso.
- **PDF:** con 1, 4 y 10 estudiantes, cuántas páginas tiene y si algo se corta o desordena. Adjunta el PDF de 10 estudiantes.
- **Interfaz con 4 y 10 estudiantes,** en escritorio y a 390 px:
  - ¿se sabe siempre qué estudiante se está editando?
  - ¿se puede cambiar de uno a otro sin perderse?
  - adjunta capturas.

### 4. Pertinencia de cada recomendación
Para cada perfil, en básica y en superior, revisa **todas** las fichas que ve y clasifícalas:
- **Adecuada:** responde a lo que se describió.
- **Discutible:** podría servir, pero no apunta a lo descrito.
- **Inadecuada:** no corresponde o puede confundir. Por ejemplo, una traducción para quien habla español, o Braille para quien no ve bien pero lee con lupa.

En cada **Discutible** e **Inadecuada**, indica la causa probable:
- una etiqueta de situación (`dimensiones`) mal puesta en la ficha;
- una situación demasiado amplia (por ejemplo, «Visión y audición»);
- un orden poco útil;
- falta una ficha;
- falta un dato en el perfil.

Revisa también lo que **falta**: barreras descritas en el perfil que no tienen ningún apoyo adecuado.

## Entrega
`docs/auditorias/024-estudiantes/README.md`, con:
1. un resumen de máximo 15 líneas: ¿la lógica escala de 1 a 10? ¿las recomendaciones son pertinentes?;
2. los 10 perfiles;
3. una tabla por N (1 a 10) con el promedio de apoyos, la similitud promedio entre estudiantes y los pares idénticos;
4. una tabla de pertinencia por perfil y nivel, con los conteos de adecuadas, discutibles e inadecuadas;
5. la lista completa de fichas **inadecuadas** y **discutibles**, con su `id`, el perfil, el nivel y la causa;
6. los hallazgos de interfaz y PDF, con capturas;
7. los hallazgos priorizados (alta, media, baja), **sin implementar soluciones**. Claude planificará la estrategia.

Adjunta además los datos crudos en `resultados.json` y el script que los genera.

## Criterios de aceptación
- [ ] Los 10 perfiles cubren barreras distintas y están descritos sin diagnósticos.
- [ ] Se midieron N = 1 a 10 en los 4 niveles, y los resultados se pueden regenerar con el script.
- [ ] Cada ficha vista por cada perfil, en básica y en superior, está clasificada y justificada.
- [ ] Hay capturas con 4 y 10 estudiantes, en escritorio y teléfono, y el PDF de 10 estudiantes.
- [ ] No hay cambios fuera de `scripts/auditar_estudiantes.cjs` y `docs/auditorias/024-estudiantes/`.
