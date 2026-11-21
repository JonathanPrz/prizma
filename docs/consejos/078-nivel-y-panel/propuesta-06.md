# Propuesta 6 · Redacción UX

## Idea
Dos etiquetas inequívocas: «Nivel para el curso» y «Nivel de este estudiante». Al cambiar: «Este caso sigue en …». Panel «Lo que elegiste» con resumen útil y enlace contextual.

## Solución jerárquica y textos
- Para el curso (DUA)
  - Paso 1 «Describe tu curso»; selector «Nivel para el curso»; panel «Lo que elegiste»: «Todavía no elegiste acciones» y resumen de actividad si existe.
  - Paso 2 «Elige apoyos»; panel: «N elegidas para el curso», agrupadas en «Antes», «Durante», «Después», «En toda la clase»; «Ir a tu selección».
  - Paso 3 «Acuerda»; panel: selección y «Ver documento».
- Para un estudiante
  - Encabezado «Caso: [nombre] · Nivel: [nivel del caso]»; paso 1 «Nivel de este estudiante» y situaciones; panel «Situaciones marcadas: N».
  - Paso 2: panel «Apoyos elegidos: N», por tipo.
  - Paso 3: «Acuerdo: Por completar / Por revisar / Completo»; «Ver documento» solo si corresponde.
- Práctica y trabajo
  - Panel por caso: «Situaciones marcadas», «Apoyos elegidos» y «Estado del acuerdo», con lenguaje propio de práctica o empleo.
- Cambio de nivel
  - Si el caso está vacío, seguir el nivel general; si contiene datos, conservarlo y explicar «Este caso mantiene su nivel. Puedes cambiarlo dentro del caso».
  - Al cambiar nivel del caso, conservar lo seleccionado que deje de aplicar, avisar «Hay apoyos guardados que no se muestran en este nivel» y revisar acuerdos.

## Fundamento y riesgos
«Nivel para el curso» y «Nivel de este estudiante». Al cambiar: «Este caso sigue en …». Panel «Lo que elegiste» con resumen útil y enlace contextual. Riesgos: sincronizar casos con datos por error; un panel demasiado ancho a zoom alto; duplicar acciones con la mochila. Probar los tres ámbitos, múltiples casos, cambios sucesivos, teclado, lector de pantalla, 390 px y 1280 px. Las denominaciones normativas se verifican en fuentes, no se infieren.

## Código propuesto, sin implementarlo
Revisar `#nivel`, `#nivel-estudiante`, `nivelCaso`, `pintarPanelElegidas`, la lógica de caso vacío y los media queries de `styles.css`. Mantener `localStorage` y la columna de 46 rem. No modificar catálogo ni dependencias.
