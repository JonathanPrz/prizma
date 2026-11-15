# Tarea 009 · Sección «Un estudiante»: adecuaciones de acceso

Estado: **integrada** · Asignada a: Codex · Rama: `codex/009-un-estudiante`

## Para qué

Es el Tiempo 2 del diseño (`docs/diseno.md`, secciones 3.3 y 4). El docente describe las barreras de un estudiante y Prizma le muestra adecuaciones de acceso con fuente. El contenido ya está en `data/recomendaciones.json`: son las 22 entradas con `"tipo": "acceso"`. **No cambies `data/`.**

## Qué hacer

### 1. Nueva sección en `index.html`
- Después de «Acciones para todo el curso», agrega `<section id="estudiante">` con el título «Apoyos para un estudiante». Agrega el enlace «Un estudiante» en la navegación de la cabecera.
- **Iniciales:** un campo de texto, de 1 a 4 letras, sin números. Ayuda: «Solo iniciales. No escribas el nombre.»
- **Paso 1: «¿En qué áreas encuentra barreras?»** Son 5 casillas, con los nombres de las áreas de la sección 4 del diseño.
- **Paso 2:** por cada área marcada, se muestran sus dimensiones, con la columna «Ejemplos de situaciones con barreras» de la tabla como ayuda. Cada dimensión tiene 4 radios: «No aplica» (por defecto), «A veces», «Seguido» y «Casi siempre». Usa un `<fieldset>` y una `<legend>` por dimensión.
- **«¿Qué le ayuda?»:** un texto libre de máximo 300 caracteres. Ayuda: «Por ejemplo: apoyos visuales, trabajar con un compañero.»

### 2. Resultados
- Muestra solo las adecuaciones de acceso que aplican al nivel (usa `aplica()`) y cuyas `dimensiones` coinciden con alguna dimensión marcada.
- Agrúpalas en este orden, con estos títulos:
  1. «Presentación de la información» (`presentacion`)
  2. «Formas de respuesta» (`respuesta`)
  3. «Entorno» (`entorno`)
  4. «Organización del tiempo y el horario» (`tiempo`)
- Dentro de cada grupo, ordénalas por puntaje: suma de la frecuencia de cada dimensión que coincide, donde «A veces» vale 1, «Seguido» 2 y «Casi siempre» 3. El puntaje más alto va primero.
- Cada tarjeta usa el mismo formato que las acciones DUA, pero sin el código DUA. Muestra el tipo y la razón: «Porque marcaste: Atención y organización (seguido).»
- Sin dimensiones marcadas, muestra: «Marca al menos una situación para ver apoyos.»
- Encima de los resultados, este aviso fijo: «Antes de aplicar un apoyo, conversa con el estudiante y su familia. Las adecuaciones se acuerdan con el equipo de apoyo y se registran en el PACI.»
- «Elegir» agrega la adecuación a «Mi selección», igual que las acciones DUA.

### 3. Datos, privacidad y documento
- Agrega `estado.estudiante = { iniciales: "", dimensiones: {}, ayuda: "" }`. En `dimensiones`, la clave es el número de dimensión, del 1 al 11, y el valor es la frecuencia, del 1 al 3.
- Llama a `mostrarAvisoPrivacidad()` la primera vez que la persona escribe en las iniciales o en «¿Qué le ayuda?».
- **Respaldo:** incluye `estudiante` y valídalo. Las iniciales deben cumplir `/^[A-Za-zÁÉÍÓÚÑáéíóúñ]{1,4}$/`; si no, quedan vacías. Las dimensiones van del 1 al 11 y las frecuencias del 1 al 3; descarta lo demás. `ayuda` se corta a 300 caracteres. Los respaldos sin `estudiante` se abren igual.
- **«Mi selección», vista previa y PDF:** las adecuaciones van en una sección aparte, «Apoyos para [iniciales]», con el subtítulo «Propuesta para conversar con el equipo de apoyo». Cada una muestra su tipo oficial, por ejemplo «Adecuación de acceso: Entorno (Decreto 83)». Incluye la línea «Le ayuda: …» si hay texto.
- «Borrar todo» también borra `estudiante`.
- Se trabaja con **un solo estudiante** a la vez. Varios estudiantes queda para después.

## Criterios de aceptación
- [ ] Marcar «Visión y audición» en «Casi siempre» muestra al menos las 2 adecuaciones de la dimensión 6, en sus grupos.
- [ ] El orden y la razón respetan el puntaje.
- [ ] En parvularia no aparecen las adecuaciones que excluyen ese nivel. Por ejemplo, `acc-2-audio`.
- [ ] El aviso de privacidad aparece la primera vez que se escribe en las iniciales.
- [ ] Iniciales con números o con más de 4 letras no se aceptan, ni al escribirlas ni al abrir un respaldo.
- [ ] El PDF tiene la sección «Apoyos para …» con su subtítulo y los tipos oficiales.
- [ ] Todo se usa con teclado, en tema claro y oscuro, sin desplazamiento horizontal a 390 px.
- [ ] `python3 scripts/validar_catalogo.py` y `node scripts/probar_arreglos_menores.cjs` siguen pasando.
- [ ] No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
