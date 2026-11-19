# Fase 1 cerrada antes de abrir los casos de Claude

Revisión sobre `ec27a958941c2744bbd4c4272f8ae05fb3d6f457`, 19 de noviembre de 2026. Escribí los 15 relatos y sus elecciones en `casos-propios.json` tras leer el catálogo y fuentes locales. No abrí ni ejecuté lecturas de `docs/casos/` durante esta fase. Sí leí el código de una prueba existente, `scripts/probar_preguntas_clave.cjs`, que referencia esos archivos: no la ejecuté. Por ello la separación es respecto del contenido de los nueve casos, no respecto de todo el historial técnico de Prizma.

Los casos son de elaboración propia; no podía comprobar que fueran distintos de los de Claude sin romper la condición a ciegas. La comparación posterior debe reconocer posibles coincidencias temáticas.

`node docs/revision-adversarial/medir-casos.cjs` ejecuta las funciones reales de selección en VM y entrega `resultados-casos.json`. Las listas son mediciones, no juicios generados. El DOM mínimo permite filtros; no demuestra visibilidad, teclado ni comprensión de la interfaz. Los casos laborales no tienen una recomendación DUA: ese módulo se dirige al curso, y forzarla al empleo sería un error de alcance.

## Contraste leído caso por caso

- **A1:** aparecen CAA y tiempo. Las tres primeras DUA incluyen 4.1, pero no 5.4. El selector no resuelve el desacuerdo con la familia: la permanencia del dispositivo requiere conversación, no contar coincidencias.
- **A2:** están audición, rótulos y evacuación. No falta el acceso esperado. La selección por frecuencia puede añadir apoyos motores; hay que elegirlos según la tarea, sin inferir necesidad de señas.
- **A3:** aparecen CAA, luz y ambas DUA. Es una respuesta de acceso pertinente. Que el panel de objetivos exista no demuestra que corresponda reducirlos.
- **A4:** están digital y visión. Entre las primeras DUA se ofrece lectura en voz alta; no reemplaza una descripción de un gráfico que permita razonar sin pistas.
- **A5:** están lengua y comunicación familiar. Las tres primeras DUA reconocen cultura y sesgos. Prizma no pregunta quién traduce ni cómo protege al menor frente al conflicto adulto.
- **A6:** falta `prac-evaluar`: sus dimensiones omiten salud y energía. Activar laboratorio y marcar fatiga no basta para ofrecer la evaluación práctica equivalente. No recomendaría convertir íntegramente el laboratorio en actividad remota.
- **A7:** aparecen compactación y agenda. La primera terna DUA se concentra en organización: ninguna de las tres conserva explícitamente el mayor desafío. No es ausencia del catálogo; sí un límite de la priorización.
- **A8:** aparecen plan, instrucciones escritas y decisión sobre información. Que exista la ficha de privacidad no demuestra que el documento respete esa decisión: se comprobará por separado.
- **A9:** están protección y alertas. La elección no valida que las alarmas se perciban en el puesto real; no autorizaría tapones solo por aparecer en el catálogo.
- **A10:** aparecen interpretación, señales y lenguaje claro. No falta una ficha esperada. El flujo de inclusión no debe convertir la barrera lingüística en diagnóstico.
- **A11:** aparecen acceso y movilidad y se conserva la alternativa de ampliación. También se ofrece `tr-alertas-visuales` por visión/movilidad: comprobar la vía vibratoria es crítico; una luz no resuelve todos estos perfiles.
- **A12:** aparecen CAA y formatos. Falta 5.4 en la terna inicial, aunque permanece en el listado. La rúbrica del examen, no la frecuencia de habla, determina la equivalencia.
- **A13:** no se ofrece `acc-9-rutina` porque está restringida a parvularia. Mi elección supera el alcance declarado de esa ficha, pero el D83 sí permite organizar tiempos en básica. Hay cuidados y plazos; falta una opción explícita de rutina energética de básica.
- **A14:** aparecen familia y explicación al curso. La terna inicial privilegia diversidad cultural; no incluye 6.5 ni 7.4 pese al hostigamiento. El patrón por necesidades no distingue entre convivencia insegura y simple diversidad.
- **A15:** aparecen autonomía, escritura y privacidad. La asociación descrita por Schlegler no demuestra que más responsabilidad o mentoría funcione para esta persona. Las opciones requieren preferencia y evaluación del puesto.

No convierto cada diferencia con mis elecciones en un defecto. La ausencia de una ficha en las primeras tres no equivale a ocultarla; las objeciones finales distinguirán selección, redacción y aplicación real.
