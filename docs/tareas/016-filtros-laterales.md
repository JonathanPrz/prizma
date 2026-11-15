# Tarea 016 · Dos pestañas, «DUA» y «Apoyos adicionales», con filtros a la izquierda

Estado: **integrada** (PR #16) · Asignada a: Codex · Rama: `codex/016-filtros-laterales`

## Para qué

Al dueño no le convence separar «Tu clase» de las acciones: esas preguntas son parte del DUA y funcionan como filtros. El modelo son las tiendas en línea, con filtros a la izquierda y resultados a la derecha que cambian al instante. Esto reemplaza los 3 pasos de la tarea 014. **No cambies `data/` ni los textos de contenido.**

## Estructura nueva

1. **Barra superior**, sin cambios: logo, «¿Cómo usar el DUA?», tema y «Mi mochila».
2. **Barra de contexto**, debajo de la barra superior:
   - a la izquierda, el selector **Nivel**, que es único y afecta a las 2 pestañas;
   - a la derecha, 2 pestañas: **«DUA»** y **«Apoyos adicionales»**. Usa `role="tablist"`, `tab` y `tabpanel`, con flechas del teclado. La pestaña activa se guarda en `estado` y en el hash (`#dua` o `#apoyos`), y el botón Atrás funciona.
   - En educación superior, la segunda pestaña se llama **«Ajustes razonables»**.
3. **Pestaña DUA**, en 2 columnas:
   - **Izquierda, «Filtros»**, en una columna fija de unos 18 rem, con `position: sticky` y desplazamiento propio si no cabe. En orden: «¿Qué quieres resolver?», «¿Qué quieres que aprendan?», «¿Cuándo?» (como lista vertical de opciones), «¿Para qué?» y el `<details>` «Más detalles (opcional)». Al final, el enlace «Limpiar filtros», que deja el nivel y la mochila como están.
   - **Derecha:** el conteo («11 acciones») y las tarjetas en 2 columnas, o en 1 si el espacio es angosto. Los resultados cambian al instante, sin botón «Aplicar».
4. **Pestaña Apoyos adicionales**, con la misma disposición:
   - **Izquierda:** las iniciales, «¿En qué áreas encuentra barreras?», las frecuencias de las dimensiones de las áreas marcadas (los radios pueden ir uno debajo del otro en la columna) y «¿Qué le ayuda?».
   - **Derecha:** el aviso del PACI o de la unidad de inclusión según el nivel, los grupos de apoyos, el bloque de objetivos y el de desregulación, tal como funcionan hoy.
5. **En teléfono** (menos de unos 60 rem): la columna de filtros se oculta y aparece un botón **«Filtros (n)»**, donde n es la cantidad de filtros activos. Abre los filtros en un `<dialog>` a pantalla completa, con el botón «Ver resultados». El foco vuelve al botón al cerrar.
6. Quita los pasos 1, 2 y 3, el resumen «Cambiar» y los botones «Ver acciones» y «Agregar apoyos».

## Lo que no cambia
- La lógica de recomendación, el orden y las razones, los avisos (guía DUA y privacidad), «Mi mochila», el respaldo, el PDF, los temas, el vocabulario por nivel y el logo M1.
- Todas las pruebas de `scripts/` deben seguir pasando. Ajusta los selectores de `probar_pasos.cjs` a la nueva estructura, o renómbralo a `probar_pestanas.cjs`, sin debilitar lo que comprueba.

## Criterios de aceptación
- [ ] En escritorio, cada pestaña muestra los filtros a la izquierda y los resultados a la derecha. Cambiar un filtro actualiza los resultados al instante.
- [ ] El nivel está fuera de las pestañas y cambia el contenido de ambas.
- [ ] Las pestañas funcionan con teclado (flechas, Tab y Enter), con el hash y con el botón Atrás.
- [ ] En superior, la segunda pestaña se llama «Ajustes razonables».
- [ ] En teléfono, «Filtros (n)» abre los filtros a pantalla completa y «Ver resultados» los cierra. No hay desplazamiento horizontal a 390 px y funciona con texto al 200 %.
- [ ] Capturas de las 2 pestañas en escritorio y en teléfono, en claro y oscuro, en `docs/marca/016-filtros/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas de `scripts/`. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
