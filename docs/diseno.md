# Diseño de Prizma

Versión 0.1 · noviembre 2026 · borrador para validar

## 1. La idea en una frase

El docente cuenta cómo es su clase y qué barreras ve.
Prizma le muestra acciones concretas para reducir esas barreras, con su fuente.
Prizma no planifica la clase.

## 2. Recorrido del usuario

La portada tiene 2 puertas:

| Puerta | Para qué | Resultado |
|---|---|---|
| **Mi clase** | Todo el curso. DUA. | Acciones para antes, durante y después |
| **Un estudiante** | Casos específicos. | Apoyos de acceso, después adecuaciones curriculares, más apoyos adicionales |

Las 2 puertas comparten el **perfil de la clase**: se responde una vez y sirve para las dos.

### 2.1 Perfil de la clase (30 segundos, 3 preguntas)

1. Nivel: parvularia · básica · media · técnico-profesional · superior
2. Tipo de clase: teórica · práctica · taller o laboratorio · en terreno · en línea
3. Evaluación: individual · grupal · escrita · oral · práctica (se pueden marcar varias)

Cada respuesta es opcional. Sin respuesta, no se filtra.

### 2.2 Tiempo 1. Mi clase (DUA)

- Arriba, 3 pestañas: **Antes · Durante · Después**.
- Debajo, 3 propósitos para filtrar, en palabras simples:
  - **Motivar y sostener el interés** (compromiso, red afectiva)
  - **Presentar la información** (representación, red de reconocimiento)
  - **Mostrar lo aprendido** (acción y expresión, red estratégica)
- Cada acción es una tarjeta: verbo + acción, "por qué funciona" en 1 frase, fuente.
- Botón "Elegir". Lo elegido va a **Mi selección**.

Es un menú. No hay mínimo ni puntaje. No hay casillas de "cumple / no cumple".

### 2.3 Tiempo 2. Un estudiante

1. **Iniciales** del estudiante. Nada más que lo identifique.
2. **Perfil de barreras**, con 4 formas de llenarlo (todas opcionales y combinables):
   - **Encuesta breve del docente**: 1 pregunta por dimensión, "¿Qué le cuesta en clase?".
   - **Desde un informe**: el docente traduce un informe psicopedagógico a las mismas dimensiones. El informe no se sube ni se guarda.
   - **Voz del estudiante**: preguntas en lectura fácil, para responder junto al docente o imprimir.
   - **Voz de la familia**: lo mismo, pensado para la familia.
3. **Resultados**, en este orden:
   1. Apoyos de acceso
   2. Adecuaciones curriculares, que se muestran después de los de acceso, con un aviso: "Úsalas cuando los apoyos de acceso no bastan. Requieren acuerdo con el equipo de apoyo."
   3. Apoyos adicionales: desregulación, comunicación con la familia, normativa que respalda
4. Cada resultado dice **por qué aparece**: "Porque marcaste: le cuesta sostener la atención · clase práctica".

### 2.4 Mi selección y PDF

- Reúne lo elegido en los 2 tiempos.
- El docente puede escribir 1 nota por acción.
- "Descargar PDF" genera un documento ordenado: datos de la clase, acciones por momento, apoyos por estudiante (iniciales), fuentes al final y el aviso de responsabilidad.

## 3. Organización de barreras: 9 dimensiones

Basadas en el enfoque de la CIF: se describe lo que cuesta en la actividad y el contexto, no un diagnóstico.

| # | Dimensión | Ejemplos de lo que cuesta |
|---|---|---|
| 1 | Atención y organización | sostener la atención, empezar tareas, planificar, recordar instrucciones |
| 2 | Comunicación y lenguaje | entender instrucciones orales, expresarse, usar comunicación alternativa |
| 3 | Lectura, escritura y cálculo | leer textos largos, escribir a mano, operar con números |
| 4 | Visión y audición | ver la pizarra, escuchar en ruido |
| 5 | Sensibilidad sensorial | ruido, luz, multitudes, texturas |
| 6 | Movimiento y motricidad | escribir, manipular materiales, desplazarse |
| 7 | Emociones y regulación | ansiedad, frustración, desregulación |
| 8 | Interacción social | trabajo en grupo, normas implícitas, exponer en público |
| 9 | Salud y energía | fatiga, dolor, ausencias por tratamiento |

Más una dimensión de **contexto** (factores ambientales de la CIF): espacio físico, tiempos, materiales y tecnología, idioma y cultura, apoyo en casa.

**Intensidad**, en palabras simples: a veces · seguido · casi siempre.

**Condición (opcional).** El docente puede indicar una condición, por ejemplo TEA o TDAH. Funciona como **atajo**: sugiere qué dimensiones revisar y el docente confirma. La condición no se guarda. Se guarda solo el perfil de barreras.

## 4. Ficha de cada recomendación

Cada recomendación es un registro en `data/recomendaciones.json`:

| Campo | Contenido |
|---|---|
| `id` | identificador estable |
| `tipo` | `dua` · `acceso` · `curricular` · `adicional` |
| `titulo` | acción concreta que empieza con verbo |
| `como` | 2 o 3 pasos |
| `porque` | 1 frase: por qué funciona |
| `momento` | antes · durante · después (solo DUA) |
| `principio` | compromiso · representación · acción y expresión (solo DUA) |
| `barreras` | dimensiones que reduce |
| `niveles` | niveles donde aplica (vacío = todos) |
| `contextos` | tipos de clase y evaluación donde aplica (vacío = todos) |
| `evidencia` | investigación sólida · consenso de expertos · norma legal · orientación oficial |
| `fuentes` | ids de `data/fuentes.json` (mínimo 1) |
| `requiere_equipo` | sí en adecuaciones curriculares |

## 5. Cómo se ordenan las recomendaciones

1. **Filtrar (ocultar):** se oculta lo que no aplica al nivel o al contexto marcado.
2. **Priorizar (ordenar):** suben las que reducen más barreras marcadas, pesadas por intensidad.
3. **Explicar:** cada tarjeta muestra las razones que la hicieron aparecer.

Más información da recomendaciones más precisas, pero con poca información la herramienta ya muestra resultados útiles.

## 6. Respaldo y responsabilidad

- Cada recomendación tiene al menos 1 fuente pública y su nivel de evidencia.
- Neurociencia: solo hallazgos con buena evidencia (práctica de recuperación, estudio espaciado, carga cognitiva, emoción y atención) y la relación de DUA 3.0 con las 3 redes cerebrales. Sin neuromitos (estilos de aprendizaje, "10 % del cerebro").
- Desregulación: solo desde orientaciones oficiales. Ante riesgo, siempre "sigue el protocolo de tu establecimiento".
- Aviso visible en la página y en el PDF: "Orientación pedagógica. No reemplaza la evaluación de profesionales ni los protocolos de tu establecimiento."
- Antes de publicar, el contenido lo revisan profesionales: educación diferencial, psicopedagogía, terapia ocupacional.

## 7. Privacidad

- Sin servidor y sin cuentas. Los datos quedan en `localStorage` del navegador.
- Solo iniciales. Sin diagnósticos guardados. Los informes no se suben.
- Exportar e importar un archivo `.json` para respaldo o para cambiar de equipo.
- Botón "Borrar todo".

## 8. Técnica

- Sitio estático en GitHub Pages: `index.html`, `app.js`, `styles.css`, `data/*.json`.
- Sin framework ni compilación.
- PDF con hoja de estilos de impresión ("Guardar como PDF" del navegador).
  shortcut: depende del diálogo de impresión del navegador; si en teléfonos resulta torpe, generar el PDF con una librería.
- Un script de revisión comprueba el catálogo: campos válidos, cada fuente existe, cada recomendación tiene fuente.
- Accesibilidad WCAG 2.2 AA: teclado, foco visible, contraste, objetivos táctiles de 24 px o más, sin depender del color.

## 9. Plan por etapas

| Etapa | Qué se construye | Cómo sabemos que funciona |
|---|---|---|
| 0. Fuentes | `docs/fuentes.md` con enlaces verificados. Copias `.md` de los documentos revisados. Revisión de licencias. | Cada fuente abre y está citada |
| 1. Prototipo | Perfil de la clase + Tiempo 1 (unas 30 acciones DUA) + Mi selección + PDF | 3 a 5 docentes lo usan sin ayuda en menos de 10 minutos |
| 2. Estudiante | Iniciales + encuesta de barreras + unos 40 apoyos de acceso + orden explicado | Los docentes entienden por qué aparece cada apoyo |
| 3. Ampliación | Adecuaciones curriculares, apoyos adicionales, entrada desde informe, voz del estudiante y familia en lectura fácil | Revisión de profesionales |
| 4. Publicación | Auditoría de accesibilidad, revisión de contenido, licencia abierta | Lista de control WCAG 2.2 AA |

## 10. Licencias

Que sea gratis no basta: las licencias igual exigen condiciones.

- **DUA 3.0 (CAST):** se usa con atribución. Si es CC BY-NC-SA, lo que derive de las pautas se comparte con la misma licencia. Se verifica en la Etapa 0.
- **CIF (OMS):** se usan sus conceptos. No se copian códigos ni definiciones textuales.
- **Normativa chilena:** es pública. Se cita con enlace a la Biblioteca del Congreso Nacional (bcn.cl).
- **Propuesta:** el código con licencia MIT y el contenido con licencia CC BY-SA 4.0, o CC BY-NC-SA si DUA 3.0 lo exige.
