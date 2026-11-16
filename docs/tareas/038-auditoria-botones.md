# Tarea 038 · Auditoría de todos los botones: de la primera selección al documento impreso

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/038-auditoria-botones`

## Para qué
El dueño quiere saber si cada botón y opción de Educación funciona y se entiende, desde que se arma una selección hasta el documento imprimible, en las dos pestañas: «Para el curso (DUA)» y «Para un estudiante». No le queda claro:
1. **Qué hace la casilla «Mi clase tiene taller, laboratorio o terreno»:** a qué afecta en DUA y en los apoyos de cada estudiante.
2. **La sección «Para empezar (3)» con la línea «Algo que haces para todo el curso»:** qué significa el número y por qué esa definición aparece ahí.

**Solo auditoría.** Crea archivos solo en `docs/auditorias/038-botones/`. No cambies la página, `data/`, `docs/fuentes/`, `docs/arquitectura.md` ni `.claude/`. **No implementes soluciones:** descríbelas como problemas. Claude propone el cambio.

## Método
Con Playwright, en escritorio (1280 px) y teléfono (390 px), con datos limpios.

### 1. Inventario de controles
En «Para el curso (DUA)» y «Para un estudiante», en los niveles básica y superior, lista **cada** control: botones, casillas, enlaces, selectores, campos y `summary`. Por cada uno anota:
- su texto visible y su nombre accesible;
- dónde está (paso, grupo, tarjeta, mochila, diálogo o vista previa);
- **qué hace realmente**: qué cambia en el estado, en la lista, en la mochila y en el documento;
- **qué dice que hace**: su texto y su ayuda;
- si las dos cosas coinciden.

### 2. Recorridos completos hasta imprimir
Simula y registra cada acción, con capturas en cada paso:
- **DUA, docente de básica:**
  1. describir la clase con meta, una necesidad y la casilla de taller;
  2. guardar;
  3. usar los filtros «Momento» y «Para qué»;
  4. elegir 4 acciones de distintos momentos y escribir una nota;
  5. revisar «Tu selección» y la reflexión;
  6. abrir Mi mochila y quitar una acción;
  7. «Ver documento», elegir qué incluir, ver la vista previa, descargar el PDF e imprimir (registra el diálogo de impresión con una página de prueba, sin imprimir de verdad).
- **Para un estudiante, básica:**
  1. crear un caso con 2 situaciones;
  2. guardar;
  3. elegir apoyos de «Para empezar», de un grupo plegado, de objetivos y de desregulación;
  4. usar «Agregar al curso» de una versión DUA;
  5. completar los acuerdos;
  6. agregar un segundo caso con un apoyo repetido y responder la pregunta;
  7. «Ver documento» hasta el PDF.
- **Para un estudiante, superior:** lo mismo, con práctica profesional y el documento para el centro.

Por cada acción, anota:
- qué esperaría una persona sin formación técnica;
- qué pasó;
- dónde quedó el foco;
- qué se anunció;
- cuánto hubo que desplazarse.

### 3. Los dos puntos que preguntó el dueño
- **Casilla de taller:**
  - mide qué cambia al marcarla en DUA: cuántas acciones suben, cuáles y con qué razón;
  - mide qué cambia en «Para un estudiante» y en el PDF;
  - verifica si la persona puede deducir esos efectos desde la página.
- **«Para empezar»:**
  - de dónde sale el número;
  - qué criterio elige las 3 acciones;
  - qué dice la línea bajo el título;
  - cómo se ve con filtros y sin filtros, y con necesidades y sin ellas;
  - si se repite la definición bajo otros grupos.

### 4. Problemas encontrados
Clasifícalos por prioridad (alta, media o baja):
- controles cuyo efecto no coincide con su texto;
- efectos ocultos;
- botones que no hacen nada visible;
- textos repetidos o confusos;
- pasos sin salida clara;
- diferencias entre la vista previa y el PDF;
- problemas de foco o anuncio.

Incluye evidencia (captura, estado y texto) y **sin solución**.

## Entrega
`docs/auditorias/038-botones/README.md` con las 4 secciones, más las capturas, los PDF generados y el script.

## Criterios de aceptación
- [ ] El inventario cubre todos los controles de las dos pestañas en básica y superior, con lo que dicen y lo que hacen.
- [ ] Los 3 recorridos llegan al PDF y al diálogo de impresión, en escritorio y teléfono, con capturas.
- [ ] Los dos puntos del dueño tienen una respuesta medida.
- [ ] Ningún cambio fuera de `docs/auditorias/038-botones/`. El pull request apunta a `main`.
