# Tarea 032 · Pestaña «Trabajo»: ajustes para personas trabajadoras con discapacidad

Estado: **integrada** (PR #32) · Asignada a: Codex · Rama: `codex/032-trabajo`

## Para qué
El dueño decidió que Prizma también sirva a empresas e instituciones que reciben trabajadores con discapacidad. La investigación está en `docs/fuentes/codex/trabajo/README.md`.

Claude agregó al catálogo 64 fichas con `tipo: "trabajo"` y `niveles: ["trabajo"]`, en estos subtipos:
- `informacion`, `comunicacion`, `puesto` y `tiempo`: 56 ajustes, al menos 4 por cada una de las 14 situaciones;
- `proceso`: 8 fichas sin situaciones, sobre cómo pedir, analizar, decidir, documentar y revisar ajustes, qué hacer ante un rechazo, la selección y la privacidad.

`app.js` ya las acepta al validar el catálogo, pero no las muestra.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## Principios que no se rompen
- **Sin diagnósticos.** Se describen tareas y barreras, nunca condiciones de salud. Código del Trabajo, art. 154 ter; Ley 19.628; Ley 21.719 desde el 1 de diciembre de 2026.
- **La persona decide qué contar.** El documento es un acuerdo de ajustes, no un expediente.
- Mismo formato de pasos que DUA y apoyos (tarea 029).

## Cambios
1. **Tercera pestaña «Trabajo»**, después de «Apoyos individualizados», con hash `#trabajo`.
   - En esta pestaña se ocultan el selector de nivel y la casilla de taller, laboratorio o terreno.
   - `h1`: «Ajustes para que cada persona pueda trabajar en igualdad».
   - Bajada: «Elige los que sirvan. Prizma no reemplaza la evaluación de tu equipo: te ofrece un menú, cada ajuste con su fuente.»
2. **Casos de personas trabajadoras**, con el mismo flujo de 3 pasos, «Casos», estados y «+ Agregar otro caso» de la tarea 029. Van en un estado propio, `estado.trabajadores` (máximo 10, validado y respaldado), separado de los estudiantes.
   - **Paso 1, «Describe la situación de <iniciales>»:**
     - iniciales, con la misma regla de la tarea 029;
     - «Tipo de puesto», opcional, de máximo 60 caracteres. Ayuda: «Por ejemplo: administrativo, bodega, atención de público. No escribas el nombre de la empresa»;
     - las 14 situaciones con las mismas etiquetas, pero con estos ejemplos de trabajo (constante `EJEMPLOS_TRABAJO`):
       1. encargos largos, varias tareas a la vez, plazos, interrupciones
       2. manuales, correos largos, formularios, registros escritos
       3. instrucciones verbales, capacitaciones, procedimientos nuevos
       4. reuniones, trabajo en equipo, atención de público, normas que no se dicen
       5. presión de tiempo, cambios imprevistos, conflictos, evaluaciones
       6. pantallas, documentos impresos, señalética
       7. ruido, luz intensa, espacios concurridos, olores
       8. desplazarse, cargar, manipular herramientas, posturas
       9. fatiga, dolor, controles médicos, jornadas largas
       10. otra lengua materna, migración, sentirse parte del equipo
       11. acceso al lugar, horarios, actitudes del equipo o de la jefatura
       12. reuniones, llamadas, presentaciones, atención telefónica
       13. reuniones, llamadas, alarmas, ruido de fondo
       14. tareas repetitivas, pocas responsabilidades, ganas de aprender más
     - «¿Qué le ayuda?» y «¿Qué dice la persona?», con la ayuda «Lo que propone, lo que le preocupa. No escribas diagnósticos».
   - **Paso 2, «Ajustes sugeridos»:**
     - «Para empezar» y grupos por subtipo, con las etiquetas «Información», «Comunicación», «Puesto y entorno» y «Tiempo y organización», ordenados como en apoyos (`compararAcceso`). Muestra solo los ajustes con puntaje mayor a 0.
     - Al final, siempre, el grupo «Cómo pedir, decidir y revisar ajustes», con las 8 fichas `proceso`.
   - **Paso 3, «Acuerdos»:**
     - roles: Persona trabajadora, Jefatura directa, Gestor o gestora de inclusión, Recursos humanos y Prevención de riesgos;
     - las mismas fechas y validaciones de la tarea 029.
   - En `tipoOficial`, el rótulo es «Ajuste en el trabajo: <grupo>».
3. **Guía `#guia-trabajo`**, con el enlace «¿Qué exige la ley?» bajo el título del paso 1. Usa exactamente este texto.

   **Título: ¿Qué exige la ley al empleador?**

   **Todas las empresas e instituciones**
   1. No discriminar por discapacidad y hacer los ajustes necesarios (Ley 20.422, arts. 7 y 8; Código del Trabajo, art. 2).
   2. Adaptar los procesos de selección cuando haya pruebas o requisitos (Ley 20.422, art. 24).
   3. Guardar reserva de los datos privados de cada trabajador (Código del Trabajo, art. 154 ter).

   **Desde 10 trabajadores permanentes**
   4. Incluir la accesibilidad y los ajustes en el reglamento interno (Código del Trabajo, arts. 153 y 154).

   **Desde 100 trabajadores**
   5. Contratar al menos un 1 % de personas con discapacidad, contar con una persona de recursos humanos certificada en inclusión y capacitar al equipo cada año (Código del Trabajo, arts. 157 bis, 157 quáter y 157 quinquies).

   **Sector público**
   6. Selección preferente en igualdad de mérito, y cuota en instituciones con 100 o más funcionarios (Ley 20.422, art. 45).

   **Si se rechaza un ajuste**
   7. La persona puede acudir a la Dirección del Trabajo o pedir tutela laboral, dentro de 60 días (Código del Trabajo, arts. 485 y 486).

   Nota: «Orientación basada en la normativa citada, vigente al 16 de noviembre de 2026. No es asesoría legal.»
4. **Mi mochila:** agrega una sección «Trabajo», con una subsección por persona.
5. **Documento «Plan de ajustes en el trabajo»:**
   - Es aparte del documento escolar. «Ver documento» en la pestaña Trabajo abre la elección de qué personas incluir.
   - Usa el mismo estilo profesional de la tarea 023:
     - portada con «Plan de ajustes en el trabajo», la fecha y el contenido;
     - una página por persona, con el tipo de puesto, la tabla de barreras y facilitadores, «Le ayuda», «Qué dice la persona», los ajustes por grupo, las fichas de proceso elegidas y los acuerdos con roles y fechas;
     - las fuentes y el aviso;
     - el pie «Contiene datos de una persona trabajadora. Guárdalo con reserva (Código del Trabajo, art. 154 ter).»
   - Archivo: `prizma-trabajo-AAAA-MM-DD.pdf`, sin iniciales.
6. **Respaldo:** incluye `trabajadores`. Los respaldos anteriores cargan sin trabajadores.
7. **Privacidad:** el aviso de privacidad se abre la primera vez que se escriben datos de una persona trabajadora, como con los estudiantes.

## Criterios de aceptación
- [ ] Hay 3 pestañas. «Trabajo» funciona con teclado, con el hash y con el botón Atrás, y oculta el nivel.
- [ ] Una persona con «Audición» ve primero subtítulos, intérprete, mensajes escritos y alertas visuales. El grupo de proceso aparece siempre.
- [ ] Los casos de trabajo y los estudiantes no se mezclan en el estado, la mochila, el respaldo ni los documentos.
- [ ] La guía muestra el texto exacto.
- [ ] El PDF de trabajo cumple el punto 5. Una prueba verifica que el documento escolar no incluye datos de trabajo y al revés.
- [ ] Sin desplazamiento horizontal a 390 px. Capturas y un PDF de ejemplo en `docs/marca/032-trabajo/`.
- [ ] Pasan `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`, incluida `probar_datos_reales.cjs`. Agrega `scripts/probar_trabajo.cjs`.
