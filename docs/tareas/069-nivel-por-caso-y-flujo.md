# Tarea 069 · Nivel por estudiante y flujo después de las adecuaciones de acceso

Estado: **integrada** (PR #90) · Asignada a: Codex · Rama: `codex/069-nivel-por-caso` · Pull request con destino `main`

## Para qué
Lo decidió un tercer debate de 10 especialistas, con críticas cruzadas, votación y un moderador (20-11-2026). El dueño aprobó la síntesis completa. Hoy:
- **El nivel es uno solo para todo.** Una docente con estudiantes de distintos niveles no puede reflejarlo.
- **«Sin indicar» se trata como básica sin decirlo** (`aplica()`, `p.nivel || "basica"`).
- **«Tiene PACI / Tiene PAEC / Se aplica el protocolo DEC» aparece dos veces,** en objetivos y en desregulación. Son 6 casillas con solo 3 nombres, que no cambian nada en pantalla.
- **«Apoyos adicionales» (`#apoyos-adicionales`) no tiene ninguna ficha.**
- **A 390 px, el paso 2 de básica con 3 situaciones muestra 23 avisos visibles.**

**Datos del catálogo:**
- básica y media comparten casi todas las fichas;
- ninguna ficha distingue CH de TP, sala cuna de transición, ni universidad de IP o CFT;
- las 13 adecuaciones en los objetivos no responden a ninguna situación;
- las 9 de desregulación responden a la situación 5, y algunas también a la 7.

Hechos verificados:
- el Decreto 67, art. 5, remite a los decretos 83 y 170 (`docs/fuentes/normativa/decreto-67-2018.md`, líneas 280-281);
- el Decreto 83 define el PACI (`decreto-83-2015.md`, línea 300).

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.**

## 1. Niveles
- **Opciones:** Educación parvularia · Educación básica · Educación media (CH y TP) · Educación superior (universidad, IP o CFT) · Práctica y trabajo. **Se quita «Sin indicar»** en todo Prizma. El selector arranca en básica, visible. No se subdivide ningún nivel.
- **El nivel general (arriba)** sirve para «Para el curso (DUA)» y como valor inicial de los casos nuevos. En «Para un estudiante», el selector general se oculta: ahí manda el nivel del caso.
- **Nivel por caso:** cada estudiante tiene `nivel`. En el paso 1, después de las iniciales, va «¿En qué nivel está?», con las 4 opciones educativas. Ayuda: «Cambia los apoyos y las palabras. Es solo de este estudiante.»
- `aplica(r, e)`, `voc()`, `esSuperior()`, `tipoOficial()`, los roles del acuerdo y las secciones visibles usan **el nivel del caso** en «Para un estudiante», y el nivel general en DUA. Se quita `|| "basica"`.
- **Cambiar el nivel de un caso:**
  - no pide confirmación, no toca otros casos y conserva todo lo elegido;
  - las fichas que dejan de aplicar quedan guardadas pero ocultas, y reaparecen si se vuelve al nivel anterior;
  - un aviso `role="status"` las cuenta: «Cambiaste a superior: 2 apoyos ya no aplican y quedan guardados». Si no hay ninguna, dice «Cambiaste a media.»;
  - si quedaron fichas ocultas, el caso queda «por revisar».
- **Cambiar el nivel general** solo afecta a DUA y a los casos nuevos. Se borra la confirmación que hoy marca todos los casos.
- **«Preparar su práctica»** usa el nivel del caso (media o superior).

## 2. Migración
En `normalizarDatos`, que también procesa los respaldos:
- un caso sin `nivel` hereda `perfil.nivel`;
- si este estaba vacío, era «Sin indicar» o era inválido, el caso pasa a `basica`, que es lo que veía;
- no se marca revisión;
- `perfil.nivel` vacío también pasa a `basica`.

## 3. Paso 2 de «Para un estudiante», por nivel
**Básica y media:**
```
[Ver apoyos ante una crisis]          ← enlace fijo bajo el título del paso 2; abre y enfoca la carpeta de crisis
Empieza por: … + carpetas de acceso (como hoy)
Aviso de seguridad (como hoy)

Documentos de este estudiante          ← fieldset; una sola vez
  Ayuda: «Marca los que ya existen. Salen en tu documento.»
  ☐ Tiene PACI (Decreto 83)
  ☐ Tiene PAEC (estudiante autista)
  ☐ Se aplica el protocolo DEC del establecimiento

▸ Si el acceso no basta (13)           ← details
  Ayuda: «Estas adecuaciones cambian qué aprende o cuándo. Son el último paso (Decreto 83).
          Se deciden con el equipo de apoyo y la familia, con la participación del estudiante,
          y se registran en el PACI.»
  En media agrega: «Criterios del Decreto 83, por remisión del Decreto 67, art. 5.»
  Dentro: Asignatura y los grupos de hoy (con «Último recurso»).

▸ Si hay una crisis (9)                ← details
  Ayuda: «Qué hacer antes, durante y después. Sigue el protocolo DEC de tu establecimiento.
          Si el estudiante es autista, revisa su PAEC. Prizma no reemplaza esos documentos.»
  Dentro: Antes: prevenir · Durante: acompañar · Después: reparar.

[Continuar a acuerdos]
```
**Parvularia:** igual, pero en vez de la carpeta «Si el acceso no basta» va la línea «En parvularia preferentemente no se adecuan los objetivos (Decreto 83).» La carpeta de crisis se mantiene completa.

**Superior:**
- el acceso se muestra como ajustes razonables, como hoy;
- no hay enlace de crisis, documentos, objetivos ni carpeta de crisis;
- al final va la línea «Si hay una crisis, sigue el protocolo de tu institución y avisa a la unidad de inclusión.»

**Cuándo se abre cada carpeta:**
- **«Si el acceso no basta»** se abre si «Tiene PACI» está marcada.
- **«Si hay una crisis»** se abre si está marcada la situación 5 o la 7 (con cualquier frecuencia distinta de «No aplica»), o «Tiene PAEC», o «protocolo DEC».

Al marcar una casilla que abre una carpeta, un `role="status"` lo anuncia: «Se abrió "Si hay una crisis"». Nada se cierra solo. Si la persona cierra o abre una carpeta, se respeta hasta que cambie la condición.

**Se borran:** las casillas duplicadas (`paci-objetivos`, `paec-objetivos`, `dec-objetivos`, `paci-dec`, `paec-dec` y `dec-dec`), que se reemplazan por `#paci`, `#paec` y `#dec`, con un solo render y un solo oyente. También se borra `#apoyos-adicionales` y el código que lo llena.

Los datos `e.paci`, `e.paec` y `e.dec` y su salida en el documento no cambian.

## Pruebas
- Reescribe, sin debilitarlas, las pruebas que usan «Sin indicar», los ids duplicados, `#apoyos-adicionales` o la confirmación al cambiar de nivel.
- Agrega `scripts/probar_niveles.cjs`:
  - no existe la opción «Sin indicar». Un estado guardado con `perfil.nivel: ""` abre en básica, y sus casos quedan con `nivel: "basica"`;
  - un respaldo antiguo sin `nivel` en los casos se abre sin errores, y los casos heredan el nivel general;
  - dos casos con niveles distintos (básica y superior) muestran apoyos y vocabulario distintos («Ajustes razonables» en superior);
  - al cambiar un caso de básica a superior con una adecuación en los objetivos elegida, aparece el aviso «… 1 apoyo ya no aplica y queda guardado», el caso queda «por revisar» y, al volver a básica, la ficha reaparece;
  - cambiar el nivel general no cambia el nivel de los casos existentes;
  - hay una sola casilla «Tiene PACI»: marcarla abre «Si el acceso no basta» y lo anuncia;
  - marcar la situación 5 abre «Si hay una crisis». «Ver apoyos ante una crisis» lleva el foco a su `summary`;
  - en parvularia no hay carpeta de objetivos y sí aparece la línea del Decreto 83. En superior no hay documentos ni carpetas de objetivos o crisis, y sí está la línea del protocolo institucional;
  - no existe `#apoyos-adicionales`;
  - a 390 px, con 3 situaciones en básica, cuenta los avisos visibles e infórmalos en el pull request (hoy son 23). Sin desplazamiento horizontal.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`. En el pull request, agrega capturas del paso 2 en básica, parvularia y superior, a 390 px.

## Criterios de aceptación
- [ ] No existe «Sin indicar». El nivel es por caso en «Para un estudiante» y general en DUA.
- [ ] Cambiar el nivel de un caso no pide confirmación, conserva lo elegido y avisa lo que dejó de aplicar.
- [ ] Las casillas PACI, PAEC y DEC aparecen una vez y abren su carpeta.
- [ ] Los objetivos van en «Si el acceso no basta». La crisis va en su carpeta, con un enlace fijo.
- [ ] Ya no existe «Apoyos adicionales».
- [ ] Los datos y respaldos antiguos se abren sin pérdidas.
- [ ] Pasan el validador y todas las pruebas.
