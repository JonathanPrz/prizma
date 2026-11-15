# Tarea 001 · Guardar y abrir un respaldo de Mi selección

Estado: **integrada** · Asignada a: Codex · Rama: `codex/001-respaldo-json`

## Para qué

Los datos de Prizma viven solo en el navegador. Si la persona borra los datos del navegador o cambia de computador, pierde su clase, su selección y sus notas. Esta tarea permite **guardar un respaldo en un archivo** y **abrirlo después**, sin servidor. Viene de `docs/diseno.md`, sección 9.

## Qué hacer

### 1. Dos controles nuevos en «Mi selección»

Van en `index.html`, dentro de `.sel-botones`, debajo de «Ver documento» y antes de «Borrar todo».

- Botón **«Guardar respaldo»**: descarga un archivo `prizma-respaldo-AAAA-MM-DD.json`.
- Control **«Abrir respaldo»**: un `<input type="file" accept=".json,application/json">` con su `<label>`, que se vea como `.boton`.
- Debajo, un texto de ayuda: «El respaldo es un archivo en tu equipo. Sirve para no perder tu trabajo o pasarlo a otro computador.»
- Un párrafo con `aria-live="polite"` para los mensajes de resultado.
- «Guardar respaldo» queda desactivado si no hay ni perfil ni selección. Usa la misma lógica que el botón `#pdf`.

### 2. Formato del archivo

```json
{
  "app": "prizma",
  "version": 1,
  "catalogo": "2026-11-15",
  "guardado": "2026-11-15T12:00:00.000Z",
  "perfil": { "nivel": "", "tipo": "", "evaluacion": [], "meta": "" },
  "seleccion": { "dua-8-1-meta-visible": "nota opcional" }
}
```
- `catalogo` es `VERSION_CATALOGO` de `app.js`.
- No incluyas `momento` ni `propositos`: son preferencias de la vista.
- Genera el archivo con `Blob` y un enlace temporal con `download`. Libera el URL después.

### 3. Al abrir un archivo: validar antes de usar

El archivo viene de afuera, así que valida todo. **Si algo falla, no cambies nada** y muestra el error.

| Comprobación | Si falla |
|---|---|
| Pesa como máximo 200 KB | «El archivo es demasiado grande para ser un respaldo de Prizma.» |
| Es JSON válido | «El archivo no se pudo leer. Elige un respaldo guardado desde Prizma.» |
| `app === "prizma"` y `version === 1` | «Este archivo no es un respaldo de Prizma.» |
| `perfil.nivel` y `perfil.tipo` son textos con un valor de las opciones de los `<select>`, o vacíos | Usa `""` en ese campo |
| `perfil.evaluacion` es una lista con solo los valores de las casillas | Descarta los valores desconocidos |
| `perfil.meta` es texto | Córtalo a 500 caracteres. Si no es texto, usa `""` |
| `seleccion` es un objeto `{ id: texto }` | Descarta los `id` que no estén en el catálogo actual. Corta cada nota a 2000 caracteres |

- Antes de reemplazar los datos actuales, si ya hay perfil o selección, pide confirmación con `window.confirm`: «Esto reemplaza tu clase y tu selección actuales por las del respaldo. ¿Continuar?». Es lo mismo que hace «Borrar todo».
- Si todo sale bien: guarda con `guardar()`, vuelve a pintar el perfil, los controles, las tarjetas y la selección, y muestra «Respaldo abierto: N acciones.». Si se descartaron acciones porque ya no existen, agrega «M acciones ya no están en el catálogo y no se cargaron.».
- Si `catalogo` es distinto de `VERSION_CATALOGO`, carga igual. No es un error.
- Limpia el valor del `<input>` después de leerlo, para poder abrir el mismo archivo otra vez.

### 4. Detalle técnico

`sincronizarPerfil()` hoy agrega el evento `input` además de rellenar el formulario. Sepáralo para poder rellenar el formulario después de abrir un respaldo sin duplicar el evento.

## Fuera de alcance

- Cifrar el archivo.
- Guardar varias clases o varios respaldos dentro de la página.
- Cambiar el diseño de otras partes de la página.

## Criterios de aceptación

- [ ] «Guardar respaldo» descarga un `.json` con el formato del punto 2.
- [ ] Abrir ese mismo archivo en un navegador limpio restaura el perfil, la selección y las notas.
- [ ] Un archivo con JSON roto, otro con `"app": "otra"` y otro de 300 KB muestran su mensaje y no cambian nada.
- [ ] Un respaldo con un `id` inexistente carga el resto y avisa cuántas acciones descartó.
- [ ] Un respaldo con `"nivel": "<img src=x onerror=alert(1)>"` no ejecuta nada y deja el nivel vacío.
- [ ] Todo se usa con teclado. Los mensajes se anuncian con `aria-live`.
- [ ] Funciona en modo claro y oscuro. A 390 px de ancho no hay desplazamiento horizontal.
- [ ] `python3 scripts/validar_catalogo.py` sigue diciendo «Catálogo correcto».
- [ ] No hay dependencias nuevas ni cambios en `data/`, `docs/fuentes/` ni `.claude/`.

## Cómo probar

1. `python3 -m http.server 8000` y abre http://localhost:8000.
2. Completa el perfil, elige 3 acciones con notas y guarda un respaldo.
3. Borra todo y abre el respaldo. Comprueba que vuelve todo.
4. Prueba los 4 archivos con errores de los criterios de aceptación.
5. Si usas Playwright, describe en el pull request qué pasos automatizaste.
