# Síntesis · Consejo 078: nivel del caso y panel «Lo que elegiste»

Fecha: 21-11-2026. Moderación: GPT-6, nueve perfiles simulados en turnos; no hubo subagentes independientes.

## 1. Consenso

Se conservan dos niveles con responsabilidades distintas: el general configura «Para el curso (DUA)» y proporciona el valor inicial de casos; cada caso con información conserva su nivel propio. La interfaz debe decirlo, no exigir que la persona descubra esa diferencia por ensayo y error. El caso verdaderamente vacío acompaña el cambio del nivel general hasta que se ingrese información propia. Esto corrige el desajuste observado cuando el primer caso aparece en básica y se cambia el selector superior antes de comenzar.

El panel «Lo que elegiste» merece ampliarse a más pasos y ámbitos, pero debe resumir el trabajo del contexto activo, no duplicar la mochila ni añadir una segunda navegación. La columna principal de 46 rem no se reduce. El diseño sigue siendo de una columna en teléfono, sin desplazamiento horizontal a 390 px.

## 2. Desacuerdos resueltos

**¿Un solo nivel o dos?** Se rechaza volver a un nivel único: impediría trabajar con casos de distintos niveles. La decisión previa de la tarea 069 es antecedente útil, no veto. Se resuelve la confusión con etiquetas, estado visible y sincronización provisional de casos vacíos.

**¿Qué es un caso vacío?** No basta con iniciales vacías: hay que revisar situaciones, descripción, elecciones, acuerdos y otros campos persistidos. La función debe definirse desde el modelo de datos, probarse con datos importados y nunca tratar como vacío un caso con trabajo significativo. El nivel general nunca reescribe silenciosamente casos con datos.

**¿Qué ocurre con apoyos que dejan de aplicar?** Permanecen guardados y ocultos, con aviso comprensible y conteo si es posible; un acuerdo anterior queda «Por revisar» cuando corresponda. No se borran decisiones ni se cambia el vocabulario de un caso solo porque cambió el selector general.

**¿Panel permanente?** No como copia de la mochila. Aparece desde el paso 1 en escritorio cuando exista espacio real; en el paso 1 presenta contexto y estado vacío útil, en el 2 selección, en el 3 selección y acuerdo. En ámbitos individuales resume solo el caso activo. El panel no debe introducir controles redundantes.

**¿Ancho y punto de quiebre?** Se propone probar 20 rem en vez de 17 rem. La suma nominal de columna, panel y separación es 67,5 rem, más márgenes; el punto de activación no se fija solo por aritmética. Hay que medir en navegador a 390, 1280 y anchos mayores, con zoom, texto ampliado y modos claro/oscuro. Si no cabe sin reducir 46 rem, no se muestra. No se presentan cifras del catálogo sin medición.

## 3. Solución final: jerarquía y textos

- **Para el curso (DUA)**
  - Selector visible: «Nivel para el curso». Ayuda: «Define los apoyos para todo el curso. Los casos con información mantienen su propio nivel».
  - Paso 1 «Describe»: panel «Lo que elegiste»; «Nivel del curso: [nivel]»; «Actividad: [resumen]» y «Evidencia: [resumen]», si existen; si no, «Todavía no elegiste acciones para el curso».
  - Paso 2 «Elige»: «[N] elegidas para el curso»; grupos «Antes», «Durante», «Después», «En toda la clase»; acción «Ir a tu selección».
  - Paso 3 «Acuerda»: selección agrupada y «Ver documento».
- **Para un estudiante**
  - Encabezado del caso: «[Nombre del caso] · Nivel: [nivel]».
  - Paso 1 «Describe»: selector «Nivel de este estudiante»; ayuda «Este nivel determina los apoyos y las palabras de este caso»; panel «Situaciones marcadas: [N]» y nivel.
  - Paso 2 «Elige»: panel «Apoyos elegidos: [N]», por tipo, sin listar información sensible innecesaria.
  - Paso 3 «Acuerda»: panel «Estado del acuerdo: Por completar / Por revisar / Completo»; enlace a documento solo si la acción corresponde al estado.
- **Práctica y trabajo**
  - Paso 1: «Situaciones marcadas: [N]» y etapa del caso.
  - Paso 2: «Apoyos elegidos: [N]», agrupados según el ámbito.
  - Paso 3: «Estado del acuerdo: [estado]»; conservar la denominación «Ver documento para el centro» cuando corresponda.
- **Al cambiar el nivel general**
  - Caso sin información: actualizar provisionalmente su nivel; avisar solo si hace falta para comprender el cambio.
  - Caso con información: conservar nivel y mostrar «Este caso sigue en [nivel]. Puedes cambiarlo dentro del caso».
- **Al cambiar el nivel del caso**
  - «Cambiaste el nivel de este caso a [nivel]».
  - Si hay apoyos incompatibles: «[N] apoyos guardados no se muestran en este nivel. Puedes revisarlos al volver al nivel anterior».
  - Si había acuerdo: «Acuerdo por revisar».
- **Navegación**
  - Panel visible en escritorio: contiene una única acción principal contextual y reemplaza la barra inferior cuando esta deba desaparecer.
  - Panel oculto por falta de espacio: permanece la barra inferior existente.
  - Mochila: conserva su función de almacenamiento y consulta; no se replica completa dentro del panel.

## 4. Regla para la docente

**El nivel del curso orienta los apoyos generales; cada caso con información mantiene su propio nivel, y solo los casos vacíos siguen los cambios del nivel general.**

## 5. Decisiones para el dueño

1. **Sincronización provisional:** aprobar que los casos realmente vacíos sigan el nivel general, sin modificar los que contienen información. **Recomendación: aprobar.**
2. **Panel contextual:** aprobar su aparición desde el paso 1 y en «Para un estudiante» y «Práctica y trabajo», con contenidos distintos por paso y sin duplicar acciones. **Recomendación: aprobar.**
3. **Ancho de escritorio:** probar 20 rem manteniendo 46 rem de contenido y activar solo cuando las mediciones de ancho, zoom y foco lo permitan. **Recomendación: aprobar como hipótesis verificable, no como breakpoint definitivo.**

## 6. Cambios de código propuestos, no ejecutados

En `index.html`: revisar etiquetas y ayudas de `#nivel` y `#nivel-estudiante`, y regiones del panel. En `app.js`: definir caso realmente vacío, revisar oyentes y sincronización, usar `nivelCaso` para todos los textos del caso, ampliar `pintarPanelElegidas` por ámbito y paso, conservar elecciones y estados. En `styles.css`: ensayar panel de 20 rem, mantener columna de 46 rem, respetar zoom, foco y teléfono. No agregar dependencias, analítica ni diagnósticos.

## 7. Tabla de votos

Cada perfil otorgó 3, 2 y 1 punto a propuestas ajenas. Total esperado y obtenido: 9 × 6 = **54**.

| Propuesta | Perfil | Puntos |
|---|---|---:|
| P1 | Docente de aula | 5 |
| P2 | Inclusión superior | 1 |
| P3 | Diseño UX | 23 |
| P4 | Diseño UI | 3 |
| P5 | Accesibilidad | 6 |
| P6 | Redacción UX | 7 |
| P7 | Frontend | 6 |
| P8 | Analista de datos | 3 |
| P9 | Abogado del diablo | 0 |
| **Total** | | **54** |

Las críticas están en `critica-01.md` a `critica-09.md`; las propuestas en `propuesta-01.md` a `propuesta-09.md`. El voto orienta; la decisión final corresponde al dueño.

## 8. Verificación y límites

La descripción de comportamiento actual se contrastó con `app.js`, `index.html`, `styles.css`, `docs/bitacora.md` y `contexto.md`. Las referencias normativas de la descripción proceden del contexto y deben contrastarse con sus fuentes antes de implementar cualquier afirmación jurídica nueva. No se ejecutaron pruebas de navegador ni mediciones de Playwright; 20 rem es propuesta, no resultado empírico. La simulación no equivale a nueve especialistas externos.
