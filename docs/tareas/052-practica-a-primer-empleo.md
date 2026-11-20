# Tarea 052 · De la práctica al primer empleo, conservando la historia

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/052-primer-empleo` · Pull request con destino `main`

## Para qué
Quedó pendiente de la tarea 051. Es para quien acompaña a una persona desde su práctica profesional hasta su primer empleo. El dueño aprobó esta versión el 20-11-2026, después de una revisión adversarial.

Hoy, si cambias la etapa de un caso de «Práctica profesional» a «Primer empleo o trabajo»:
- se borran sin aviso los roles del acuerdo;
- las fichas `pp-*` quedan ocultas en `seleccion`, pero siguen viajando en el respaldo;
- se pierde la historia de la práctica.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.** La guía unificada del nivel queda fuera de esta tarea.

## 1. Botón «Preparar su primer empleo»
- Aparece en un caso con etapa `practica`, junto a «Preparar documento para el centro».
- **Crea un caso nuevo** de etapa `trabajo`, con el campo `origen` igual al `id` del caso de práctica. El caso de práctica no cambia.
- **Copia solo:**
  - `iniciales`;
  - `dimensiones` (situaciones y frecuencias);
  - `ayuda` («¿Qué le ayuda?»);
  - `modalidad`.
- **No copia:**
  - `voz` («¿Qué dice la persona?»), porque la persona adulta debe decirlo de nuevo;
  - `compartir`, porque el centro de práctica no es el empleador;
  - `tipoPuesto`, las fichas, el acuerdo, los roles ni las notas.

  Deja un comentario en el código con el porqué, para que no se «complete» después.
- **El caso nuevo nace con `descripcionGuardada: false`** y el paso 1 abierto, con el aviso: «Revisa estas situaciones con la persona para el nuevo trabajo: pueden ser distintas».
- **Si ya existe un caso con ese `origen`,** el botón lo abre en vez de crear otro.
- **Máximo de 10 casos:** igual que «Preparar su práctica», reutiliza un caso vacío si existe. Si no hay cupo, el botón se deshabilita con la ayuda «Máximo 10 casos en Práctica y trabajo».
- Este botón, como «Preparar su práctica», no exige que los demás casos tengan los acuerdos completos. Es una decisión explícita: anótala en un comentario.

## 2. Bloque «Ajustes acordados en su práctica»
- **Dónde:** en un caso de trabajo con `origen` válido, después de la descripción.
- **Contenido**, en solo lectura:
  - los títulos de las fichas `pp-*` del subtipo `centro` elegidas en la práctica;
  - el estado del acuerdo de la práctica («Acuerdos completos», «Por revisar» o «Sin acuerdos»);
  - el criterio «¿Cómo sabremos que funciona?», si lo hay;
  - un botón «Ver el caso de práctica», que lo abre.
- Una línea de ayuda: «Sirven para conversar los ajustes con la persona. Que se hayan acordado no asegura que hayan funcionado».
- **No entra en ningún documento,** ni en el de trabajo ni en el del centro. Contarle al empleador que hubo apoyos en la práctica revela la discapacidad de forma indirecta.
- Si el caso de práctica ya no existe, el bloque no se muestra, sin errores.

## 3. Cambiar la etapa de un caso con contenido
- **Sin fichas y sin acuerdo:** la etapa se cambia sin preguntar, como hoy.
- **Con fichas o acuerdo:** usa `window.confirm`:
  > Se quitarán N ajustes y los roles que no corresponden a esta etapa. Para conservar la práctica, cancela y usa «Preparar su primer empleo».
  - Si se confirma, **se borran** de `seleccion` las fichas que no aplican a la nueva etapa y los roles que no corresponden. No se esconden.
  - Si se cancela, el selector vuelve a la etapa anterior.

## 4. Datos y casos borde
- `normalizarTrabajador` conserva `origen` si tiene el mismo formato que un `id`. `normalizarTrabajadores` lo acepta solo si apunta a un caso con etapa `practica` de la misma lista. Si no, lo descarta.
- **Iniciales repetidas:** el aviso `#trabajo-duplicadas` no se muestra entre un caso y su `origen`. Con cualquier otro caso con las mismas iniciales, sí.
- **Quitar un caso de práctica que tiene un caso de trabajo vinculado:** la confirmación agrega «Su caso de primer empleo se mantiene». El caso de trabajo pierde el `origen` y su bloque desaparece.
- **Práctica en media:** si el `nivelOrigen` del caso de práctica es `media`, el aviso del caso de trabajo agrega: «Si aún es menor de edad, sus datos tienen protección especial (Ley 21.719) y para trabajar necesita autorización». No se agrega el rol de familia.
- Los respaldos antiguos, sin `origen`, se abren igual.

## Pruebas
Agrégalas a `scripts/probar_practica_trabajo.cjs`:
- «Preparar su primer empleo» crea un caso `trabajo` con `origen`, iniciales, situaciones, ayuda y modalidad. No copia `voz`, `compartir`, `tipoPuesto`, fichas ni acuerdo. Nace con `descripcionGuardada: false` y el aviso visible;
- presionarlo dos veces no duplica el caso: lo abre;
- con 10 casos y ninguno vacío, el botón está deshabilitado con su ayuda;
- el bloque muestra los títulos de las fichas del centro y el estado del acuerdo, y «Ver el caso de práctica» abre la práctica;
- ni el documento de trabajo ni el del centro contienen «Ajustes acordados en su práctica» ni los títulos de las fichas `pp-*`;
- cambiar la etapa de un caso con fichas pide confirmación. Al cancelar, nada cambia. Al aceptar, las fichas y los roles que no aplican ya no están en `estado`;
- el aviso de iniciales repetidas no aparece entre el caso y su origen, y sí con un tercer caso con las mismas iniciales;
- quitar la práctica deja el caso de trabajo sin `origen` y sin bloque;
- con una práctica de media, aparece el aviso para menores de edad;
- el respaldo hace ida y vuelta: guarda, abre y conserva `origen`. Un respaldo con un `origen` que apunta a un caso inexistente o de etapa `trabajo` se abre sin error y sin `origen`;
- sin desplazamiento horizontal a 390 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] La práctica queda intacta y el primer empleo nace vinculado, con solo los datos permitidos.
- [ ] El bloque de la práctica se ve en el caso de trabajo y no sale en ningún documento.
- [ ] Cambiar de etapa con contenido pide confirmación y no deja datos ocultos.
- [ ] `origen` se valida, sobrevive al respaldo y se limpia al quitar la práctica.
- [ ] Pasan el validador y todas las pruebas.
