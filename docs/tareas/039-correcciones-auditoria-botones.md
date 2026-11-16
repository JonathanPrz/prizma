# Tarea 039 · Correcciones de la auditoría de botones y filtros

Estado: **integrada** (PR #39) · Asignada a: Codex · Rama: `codex/039-correcciones-botones`

## Para qué
La auditoría `docs/auditorias/038-botones/` encontró controles que borran datos sin aviso, una impresión incompleta y textos que no explican lo que pasa. El dueño aprobó estas 7 correcciones.

**No cambies `data/`, `docs/fuentes/`, `docs/arquitectura.md` ni `.claude/`.**

## Cambios
1. **Las áreas no borran datos** [P1]:
   - en «Para un estudiante» y en «Para el trabajo», cada área («Cognición y aprendizaje», etc.) solo abre y cierra sus preguntas;
   - usa un `<details>` o un botón con `aria-expanded`, no una casilla;
   - las frecuencias se conservan siempre. Un área que tiene situaciones marcadas se muestra abierta y su encabezado indica cuántas («2 marcadas»);
   - para quitar una situación se elige «No aplica», como hoy;
   - migración: nada que migrar, porque las áreas no se guardan.
2. **«Imprimir» imprime el mismo PDF que se descarga** [P2]:
   - el botón «Imprimir» de la vista previa usa la definición de pdfmake del documento (por ejemplo, `pdfMake.createPdf(def).print()`), no la impresión de la hoja HTML;
   - si el navegador bloquea la ventana, muestra en `#vista-estado`: «No se pudo abrir la impresión. Descarga el PDF e imprímelo desde tu lector de PDF»;
   - aplica lo mismo a los documentos de práctica (centro) y de trabajo;
   - mantén la hoja de impresión CSS, pero corrige que la primera página quede en blanco y que falten acciones. La auditoría muestra la diferencia en `comparacion-documentos.json`.
3. **Casilla de taller** [P3, P4]:
   - se aplica al **Guardar** del paso 1, como el resto de los campos: mientras no se guarda, solo cambia el borrador;
   - «Limpiar respuestas» la desmarca;
   - su ayuda pasa a decir: «Prizma pondrá primero acciones útiles en talleres y sumará apoyos de taller en los casos de tus estudiantes».
4. **«Para empezar»** [P6]:
   - en DUA y en los casos, el título queda solo como «Para empezar», sin el número;
   - bajo el título va la línea: «Las acciones que mejor responden a lo que describiste.» En estudiante y trabajo: «Los apoyos que mejor responden a las situaciones que marcaste.» y «Los ajustes que mejor responden a las situaciones que marcaste.»;
   - en DUA, la definición «Algo que haces para todo el curso» **no se repite** bajo los grupos por momento: queda solo en la definición breve de la pestaña;
   - los demás grupos conservan su conteo en el `summary`.
5. **«Ver acciones para esto»** [P5]: en el recuadro de barreras repetidas, al presionarlo se marca la necesidad, se guarda el paso 1, se actualizan los resultados y el foco va a «Para empezar». Sin pasos intermedios.
6. **«Continuar» dice adónde lleva** [P8]. Su texto cambia según el paso:
   - paso 1 sin guardar: «Guardar y ver acciones» (DUA) o «Guardar y ver apoyos» (casos);
   - paso 2: «Ir a acuerdos (N elegidos)» en los casos, o «Ir a tu selección (N elegidas)» en DUA;
   - paso 3: «Ver documento».

   El nombre accesible coincide con el texto visible.
7. **Pie de página:**
   - quita el enlace a la guía y «Cambiar ámbito», que ya están arriba;
   - el pie queda con la frase de orientación de cada ámbito, «Privacidad» y «Proyecto personal sin fines de lucro. Código y fuentes.»

## Después de implementar
Vuelve a correr los scripts de `docs/auditorias/038-botones/` y escribe `docs/auditorias/039-verificacion/README.md` con una tabla antes y después de P1–P8 y del pie.

## Criterios de aceptación
- [ ] Cerrar y abrir un área no borra frecuencias. Una prueba lo comprueba en un estudiante y en un trabajador.
- [ ] «Imprimir» usa el PDF de pdfmake. La hoja CSS ya no tiene la primera página en blanco ni pierde acciones (compáralo con el script de la auditoría).
- [ ] La casilla de taller solo cambia los resultados al guardar, y «Limpiar respuestas» la desmarca.
- [ ] «Para empezar» no muestra número y lleva su línea. La definición de acción DUA no se repite bajo los grupos.
- [ ] «Ver acciones para esto» muestra los resultados de inmediato.
- [ ] «Continuar» muestra el destino correcto en cada paso.
- [ ] El pie no repite la guía ni «Cambiar ámbito».
- [ ] Sin desplazamiento horizontal a 390 px. Capturas en `docs/marca/039-correcciones/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. El pull request apunta a `main`.
