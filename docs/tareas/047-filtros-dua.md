# Tarea 047 · Preguntas del paso 1 del DUA: enfoque 3.0 y opciones que faltan

Estado: **propuesta, pendiente de aprobación del dueño** · Asignada a: Codex · Rama: `codex/047-filtros-dua` · Pull request con destino `main`

## Para qué
La auditoría 038 midió qué hace cada control, pero no si las preguntas son las adecuadas. Al revisarlas, Claude encontró seis problemas:
1. Las opciones de «¿Qué quieres resolver?» ponen el problema en los estudiantes. DUA 3.0 dice que la barrera está en el diseño de la clase.
2. Faltan situaciones frecuentes: el acceso sensorial y motor, el desafío para quien termina antes y la regulación emocional.
3. «Quiero evaluar de formas distintas» es una meta, no una barrera.
4. La meta de aprendizaje no cambia las sugerencias, pero el texto del paso hace pensar que sí.
5. El contador «(11 · 1 para ti)» no se entiende.
6. «Proyectar al curso» está en el paso 1, y «Moverse o salir de la sala» repite en parte la casilla de taller y terreno.

**Puedes cambiar `data/necesidades.json` como indica esta tarea.** No cambies `data/recomendaciones.json`, `docs/fuentes/` ni `.claude/`.

## Cambios

### 1. Opciones de «¿Qué quieres resolver?»
Los `id` no cambian, para no romper los datos guardados. Cambian el texto, las consideraciones y las dimensiones (situaciones de los casos que se conectan con cada opción), y hay tres opciones nuevas.

| id | Texto nuevo | Consideraciones | Dimensiones |
|---|---|---|---|
| `motivacion` | La clase no logra mantener el interés | 7.1, 7.2, 7.3, 8.1 | — |
| `comprension` | Las explicaciones o las instrucciones no llegan a todos | 1.2, 2.1, 2.5, 3.2 | 3 |
| `tareas-largas` | Las tareas largas o con muchos pasos se vuelven difíciles de seguir | 5.3, 6.2, 6.3, 6.4 | 1 |
| `participacion` | No todos logran participar o trabajar en grupo | 8.3, 8.4, 5.4, 9.2 | 4, 11 |
| `lectoescritura` | Leer o escribir es una barrera para algunos | 2.2, 4.2, 5.2, 1.1 | 2 |
| `evaluar` | Una sola forma de evaluar deja fuera a algunos | 5.1, 4.1, 8.5, 9.3 | 12 |
| `lengua-cultura` | Hay estudiantes de otra lengua o cultura (sin cambio) | 2.3, 1.3, 2.4 | 10 |
| `clima` | La convivencia del curso dificulta aprender | 7.4, 8.4, 9.4 | 7 |
| **`acceso`** (nueva) | Algunos no ven bien, no oyen bien o se mueven con dificultad en la sala | 1.1, 1.2, 4.1, 4.2 | 6, 8, 13 |
| **`desafio`** (nueva) | Algunos terminan antes o necesitan más desafío | 8.2, 7.1, 5.2, 3.3 | 14 |
| **`regulacion`** (nueva) | La frustración o las emociones interrumpen el trabajo | 9.1, 9.2, 7.4, 9.3 | 5 |

Cada dimensión queda en una sola opción, porque el aviso de «barreras repetidas» busca la primera opción que la contiene. La dimensión 9 (salud y energía) sigue sin opción para todo el curso.

### 2. La meta de aprendizaje
Bajo el campo de la meta, cambia la ayuda por: «Quita las barreras, no el desafío de aprender esto. La meta va a tu documento y te ayuda a elegir: Prizma no la usa para ordenar las acciones».

### 3. El contador de «Momento»
- Cambia «(11 · 1 para ti)» por «(11 · 1 coincide)».
- Bajo «Momento», agrega la línea: «"Coincide" cuenta las acciones que responden a lo que marcaste en el paso 1».
- El nombre accesible de cada botón dice todo: «Antes: 11 acciones, 1 coincide con lo que marcaste».

### 4. «Proyectar al curso»
Muévelo del paso 1 al inicio del paso 2, antes de los filtros. Su comportamiento no cambia.

### 5. «Moverse o salir de la sala»
Pasa a «Moverse dentro de la sala». Salir de la sala ya lo cubre la casilla «Mi clase tiene taller, laboratorio o terreno».

## Después de implementar
- `python3 scripts/validar_catalogo.py`: debe seguir correcto. Si el validador revisa las necesidades, comprueba también las tres nuevas.
- Actualiza las pruebas que usan los textos antiguos y agrega a `scripts/probar_filtros_vista.cjs`:
  - que las tres opciones nuevas ordenan primero acciones de sus consideraciones;
  - que ninguna dimensión aparece en más de una opción.
- Capturas en `docs/marca/047-filtros/`, a 1280 y 390 px, en tema claro y oscuro.

## Criterios de aceptación
- [ ] Las 11 opciones tienen el texto y la conexión de la tabla. Los `id` antiguos se conservan.
- [ ] Los datos guardados con las opciones antiguas siguen funcionando.
- [ ] La ayuda de la meta, el contador y «Proyectar al curso» cambian como se indica.
- [ ] Pasan todas las pruebas. No hay desplazamiento horizontal a 390 px.
