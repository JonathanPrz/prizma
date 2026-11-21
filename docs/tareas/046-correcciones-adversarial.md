# Tarea 046 · Corregir la página según la revisión adversarial

Estado: **integrada** (PR #58 y #59) · Asignada a: Codex · Rama: `codex/046-correcciones` · Pull request con destino `main`

## Para qué
La revisión adversarial (`docs/revision-adversarial/README.md`, tarea 042) encontró problemas reales de privacidad, de acuerdos, de textos legales y de accesibilidad. Claude los aceptó en la columna «Respuesta de Claude». Esta tarea corrige **la página**. Claude corrige aparte las fichas del catálogo: O9 a O11, O13 a O17.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.** Las pruebas nuevas van en `scripts/probar_adversarial.cjs`.

## Cambios, por prioridad

### Alta · Privacidad y decisiones
1. **O1 · Nada se pide a terceros.** Quita Google Fonts de `index.html` (`preconnect` y hoja de estilos). Usa la tipografía del sistema o sirve Atkinson Hyperlegible Next desde el repositorio, con su licencia OFL en `vendor/fuentes/`. Una prueba comprueba que, al cargar la página y generar un documento, no hay ninguna solicitud fuera del propio sitio.
2. **O2 · El documento de trabajo respeta lo que la persona decide compartir.** Al preparar el documento de trabajo, agrega una casilla por sección: «Barreras y situaciones», «Lo que dice la persona» y «Ajustes acordados». Por defecto, marca solo «Ajustes acordados». Lo que no se marca no aparece en la vista previa ni en el PDF.
3. **O3 · El documento del curso no incluye estudiantes por defecto.** Al abrirlo desde la pestaña DUA, marca solo «Acciones para todo el curso». Si después se marca un estudiante, avisa: «Incluirás datos de un estudiante. Revisa con quién compartirás este documento».
4. **O12 · Las adecuaciones en los objetivos se acuerdan con la familia y el equipo.**
   - Si el caso tiene una adecuación en los objetivos elegida, los acuerdos exigen los roles «Familia» y uno de «Educador diferencial», «Equipo PIE» o «Jefatura técnica».
   - El error debe decir: «Una adecuación en los objetivos se decide con la familia y el equipo de apoyo (Decreto 83). Agrega esos roles».
   - Cambia la casilla única de PAEC, PACI o DEC por tres casillas: «Tiene PACI», «Tiene PAEC» y «Se aplica el protocolo DEC del establecimiento».
   - Migra las respuestas guardadas: si la casilla antigua estaba marcada, deja las tres sin marcar y muestra una vez el aviso «Revisa qué instrumentos tiene el estudiante».
5. **O5 · Avisar si no se guardó.** Si `localStorage` falla, muestra una vez por sesión: «No se pudo guardar en este navegador. Descarga un respaldo para no perder tu trabajo», con el botón «Guardar respaldo».

### Alta · Accesibilidad
6. **O18 a O21 · La barra fija no tapa el foco.** En el teléfono, ningún control enfocado puede quedar tapado por la barra inferior, ni total ni parcialmente. Usa `scroll-padding-bottom` en el `html`, con la altura de la barra más un margen. Una prueba recorre con Tab los pasos de estudiante y de trabajo, a 390 px, y comprueba que el control enfocado queda completo sobre la barra.
7. **O25 · Contraste del aviso de borrador.** Dentro de la hoja de la vista previa, el aviso usa los colores de la hoja, con contraste de 4,5:1 o más en modo claro y oscuro. Una prueba lo mide.

### Media
8. **O6 · Rótulo legal en media.** En media, las adecuaciones se rotulan «Adecuación de acceso (criterios del Decreto 83, por remisión del Decreto 67, art. 5)». En parvularia y básica no cambian.
9. **O7 · Texto de superior.** Cambia «En superior no se adecuan los objetivos: se hacen ajustes razonables» por «En superior se hacen ajustes razonables que mantienen los resultados de aprendizaje». Haz lo mismo en la guía de superior, sin atribuir a la ley una prohibición.
10. **O8 · Tutela laboral.** Cambia el punto 7 de la guía de trabajo por: «La persona puede consultar a la Dirección del Trabajo o pedir tutela laboral. Los plazos dependen del caso: revísalos en el sitio de la Dirección del Trabajo», con el enlace de la objeción O8.
11. **O4 · Modo para proyectar.** En «Para el curso (DUA)», agrega el botón «Proyectar al curso». Oculta los conteos de estudiantes, los avisos de apoyos individuales y la mochila, hasta que se presione «Salir de proyección».
12. **O22 · Foco al quitar.** Al quitar una acción de «Tu selección», el foco va a la acción siguiente o, si no hay, al título de la selección.
13. **O23 y O24 · Nombres accesibles.** Los botones «Elegir», «Elegida» y «Quitar» llevan en su nombre accesible el título de la acción y, en la mochila, a quién corresponde. Por ejemplo, «Quitar: Muestra los pasos de la clase, del curso». El texto visible no cambia y queda al inicio del nombre (WCAG 2.5.3).
14. **O26 y O27 · PDF.**
    - Declara el idioma español en el PDF si pdfmake lo permite. Compruébalo con `pdfinfo` o leyendo el `/Lang` del PDF.
    - Bajo el botón de descarga, agrega: «Si usas un lector de pantalla, lee el documento en esta vista previa: el PDF no tiene etiquetas de estructura».
    - No agregues librerías (regla 2).

## Después de implementar
- Agrega a `docs/revision-adversarial/README.md` una sección «Verificación de la tarea 046», con una tabla de antes y después por objeción y los scripts de la revisión adversarial corridos de nuevo.
- Capturas en `docs/marca/046-correcciones/`, a 1280 y 390 px.

## Criterios de aceptación
- [ ] No hay ninguna solicitud a terceros. Lo comprueba una prueba.
- [ ] El documento de trabajo y el del curso solo incluyen lo que se marcó.
- [ ] Una adecuación en los objetivos no queda con los acuerdos completos sin la familia y el equipo.
- [ ] La barra fija no tapa ningún control enfocado a 390 px. El contraste del aviso es de 4,5:1 o más.
- [ ] Los textos legales cambian como dicen los puntos 8 a 10.
- [ ] Pasan `validar_catalogo.py` y todas las pruebas, incluida la nueva. Sin desplazamiento horizontal a 390 px.
