# Tarea 034 · Auditoría de arquitectura de información: qué hay, dónde está y de qué depende

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/034-auditoria-arquitectura`

## Para qué
El dueño quiere separar Prizma en dos mundos, **Educación** y **Trabajo**, y sumar dos explicaciones: «¿Qué es el DUA?» y «¿Qué son los apoyos para un estudiante?». Antes de decidir dónde va cada cosa, Claude necesita un inventario exacto de cómo está hoy.

**Solo auditoría.** Crea archivos solo en `docs/auditorias/034-arquitectura/`. No cambies `app.js`, `index.html`, `styles.css`, `data/`, `docs/fuentes/` ni `.claude/`. **No propongas el diseño nuevo:** eso lo hace Claude. Sí puedes señalar problemas.

## Qué entregar

### 1. Inventario de todo lo que se ve o se usa
Una tabla con cada elemento de la página: controles, pestañas, pasos, guías, avisos, diálogos, botones, enlaces del pie, mochila, documentos PDF, respaldo, tema y privacidad. Por cada uno indica:
- dónde está (cabecera, barra de contexto, pestaña, paso, pie o diálogo);
- en qué niveles aparece y en cuáles no;
- de qué depende (el nivel, la casilla de práctica, el estudiante o la persona activa, el caso guardado, otros);
- si se repite en otro lugar;
- su texto visible exacto.

### 2. Mapa de dependencias del nivel
Para cada nivel (parvularia, básica, media y superior) y para Trabajo, una tabla que diga:
- cuántas fichas aparecen de cada tipo y subtipo: DUA, acceso, objetivos, desregulación, práctica profesional y trabajo;
- qué textos cambian según el nivel (vocabulario, nombres de pestañas, guías, avisos, roles de acuerdo);
- qué se oculta o se muestra.

Distingue lo que depende del **nivel** de lo que depende del **tipo de apoyo**.

### 3. Términos
La lista de todos los términos que usa la página para lo mismo o para cosas parecidas, con dónde aparece cada uno: apoyos, apoyos individualizados, apoyos adicionales, adecuaciones, adecuaciones de acceso, adecuaciones en los objetivos, ajustes, ajustes razonables, ajustes necesarios, acciones, DUA, fichas, recomendaciones. Marca las inconsistencias.

### 4. Recorridos de primera vez
Recorre la página con Playwright, en escritorio y a 390 px, como 3 personas que llegan sin saber nada:
- **Una docente de básica** que quiere apoyar a su curso y a un estudiante.
- **Un docente de un instituto profesional** con un estudiante que hará su práctica.
- **Una persona de recursos humanos** que recibe a un trabajador.

Por cada una:
- qué ve primero;
- qué tiene que entender para avanzar;
- dónde duda o se pierde;
- qué ve que no le corresponde (por ejemplo, el selector de nivel en Trabajo);
- cuántos clics y desplazamientos necesita hasta su primer documento.

Adjunta capturas.

### 5. Problemas encontrados
Una lista priorizada (alta, media, baja), con evidencia:
- elementos fuera de lugar;
- repeticiones;
- términos confusos;
- dependencias ocultas;
- información que falta para entender, como qué es el DUA o qué es una adecuación.

**Sin proponer la solución**.

## Entrega
`docs/auditorias/034-arquitectura/README.md` con las 5 secciones, las capturas y el script que hiciste.

## Criterios de aceptación
- [ ] El inventario cubre todos los elementos visibles y los documentos, con su texto exacto.
- [ ] El mapa de dependencias cubre los 4 niveles y Trabajo, con conteos sacados de `data/` mediante un script.
- [ ] Los 3 recorridos tienen capturas en escritorio y teléfono.
- [ ] Ningún cambio fuera de `docs/auditorias/034-arquitectura/`.
