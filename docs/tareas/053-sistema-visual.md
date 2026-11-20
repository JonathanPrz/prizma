# Tarea 053 · Sistema visual: color, letra, espacio y botones

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/053-sistema-visual` · Pull request con destino `main`

## Para qué
El dueño aprobó un sistema visual (20-11-2026) para que quien entra a hacer adecuaciones sepa qué mirar primero. Responde a los hallazgos V1, V3, V4, V5, V8, C1 y H4 de `docs/auditorias/050-interfaz/README.md`. Las reglas:
- **Base neutra, un solo acento y colores de estado.** El azul marca solo la acción principal, los enlaces, el foco y lo elegido. El rojo, el verde y el ámbar solo comunican estado. Los colores DUA de los principios son la excepción con significado: van en pequeño, junto al nombre del principio, nunca en botones.
- **Nada depende solo del color.** Lo elegido lleva borde y ✓, y cada aviso lleva ícono y texto.
- **Modo oscuro en gris carbón,** no azul marino ni negro puro, en 3 niveles: página, tarjeta y diálogo.

Solo cambia la apariencia. El orden de la página, el ancho y las tarjetas son la tarea 054.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`. No cambies el logo, los colores DUA (`--compromiso`, `--representacion`, `--accion` y sus `--hoja-*`) ni la hoja del documento (`.hoja`, `--hoja-*`).**

## 1. Variables de color (`:root` en `styles.css`)
Reemplaza los valores y agrega las variables que faltan. Mantén los nombres que ya existen para no romper reglas.

| Variable | Claro | Oscuro | Uso |
|---|---|---|---|
| `--papel` | `#f6f7fa` | `#16181d` | fondo de la página |
| `--superficie` | `#ffffff` | `#1f2229` | tarjetas y pasos |
| `--elevado` (nueva) | `#ffffff` | `#2a2e37` | diálogos: mochila, documento, avisos |
| `--panel` | `#eceef3` | `#2a2e37` | fondos suaves, deshabilitado |
| `--tinta` | `#1a2134` | `#e8eaef` | texto |
| `--tenue` | `#4f586e` | `#adb2bd` | texto secundario |
| `--linea` | `#dde1e9` | `#363a45` | separadores |
| `--borde-control` | `#7a8396` | `#7f8593` | borde de campos y botones secundarios |
| `--enfoque` | `#2456d6` | `#7aa2ff` | anillo de foco |
| `--acento` (nueva) | `#2456d6` | `#7aa2ff` | fondo del botón principal |
| `--acento-hover` (nueva) | `#1c44b0` | `#a3bfff` | botón principal con el cursor encima |
| `--sobre-acento` (nueva) | `#ffffff` | `#16181d` | texto sobre el acento |
| `--acento-suave` (nueva) | `#eef3ff` | `#22304f` | fondo de lo elegido |
| `--acento-texto` (nueva) | `#1c44b0` | `#e8eaef` | enlaces y texto de lo elegido |
| `--error` (nueva) | `#b3261e` | `#ff8a7e` | errores y acción destructiva |
| `--error-suave` (nueva) | `#fef3f2` | `#3a1d22` | fondo de aviso de error |
| `--solida` | `#17663a` | `#6bd497` | éxito, «Acuerdos completos» |
| `--solida-fondo` | `#edf9f1` | `#15322a` | fondo de aviso de éxito |
| `--alerta` (nueva) | `#8a4b08` | `#f5c04e` | advertencia, «Por revisar» |
| `--alerta-fondo` (nueva) | `#fff7e6` | `#3a2d12` | fondo de advertencia |

- Aplica los mismos valores oscuros en los dos bloques que ya existen: `:root[data-tema="oscuro"]` y `prefers-color-scheme`.
- Busca los colores escritos a mano en `styles.css` (hex o `rgb`) fuera de `.hoja` y del logo, y cámbialos por variables.

## 2. Letra: 6 tamaños fuera del documento
| Rol | Tamaño | Peso |
|---|---|---|
| Título de la página | 28 px (24 px bajo 48rem) | 800 |
| Paso (h2) | 20 px | 700 |
| Subtítulo y título de tarjeta | 17 px | 700 |
| Texto de lectura y campos | 16 px | 400 |
| Secundario y ayuda | 14 px | 400 |
| Etiqueta (tipo de apoyo, respaldo) | 13 px | 600 |

- Usa `rem` (1rem = 16 px). Los valores de hoy, como `.9375rem`, `.875rem`, `1.05rem` o `1.2rem`, pasan al rol más cercano. No toques `.hoja`.
- Quita el `letter-spacing` negativo de los títulos de tarjeta.

## 3. Espacio: una escala
Toda separación (`gap`, `margin`, `padding`) fuera de `.hoja` sale de: 4, 8, 12, 16, 24, 32 y 48 px (`.25rem`, `.5rem`, `.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`). Los valores sueltos, como `.35rem`, `.4rem`, `.55rem`, `.6rem`, `.65rem` o `.9rem`, pasan al más cercano.

## 4. Botones y estados
- **Principal (`.boton-principal`):** fondo `--acento`, texto `--sobre-acento`, sin borde. Con el cursor encima, `--acento-hover`. Hay **una por pantalla o diálogo.**
- **Secundario (`.boton`):** fondo `--superficie`, borde de 1,5 px `--borde-control`, texto `--tinta`. Con el cursor encima, fondo `--papel`.
- **Sutil (`.boton-sutil`, `.quitar`):** sin borde ni fondo, texto `--acento-texto`, subrayado.
- **Destructivo:** agrega `.boton-peligro`, con texto `--error` y borde `--error`. Úsalo en «Quitar caso» y en «Borrar los datos de…». Debe quedar separado de las demás acciones de la mochila (C1).
- **Elegido (`aria-pressed="true"`) y abierto (`aria-expanded="true"`):**
  - fondo `--acento-suave`, borde de 2 px `--acento` y texto `--acento-texto`;
  - el botón «Elegir» elegido muestra «✓ Elegida». El ✓ va en un `span` con `aria-hidden="true"`, y el `aria-label` no cambia;
  - `.tarjeta.elegida` usa `box-shadow: inset 0 0 0 2px var(--acento)` en vez de `--tinta`.
- **Deshabilitado:** fondo `--panel`, texto `--tenue`, sin opacidad. El motivo sigue escrito debajo, como hoy.
- **Foco:** `outline: 3px solid var(--enfoque)` con `outline-offset: 2px` en todos los controles.
- **Alto mínimo** de 44 px en botones. Los enlaces sueltos, como `#enlace-guia-practica`, miden al menos 24 px de alto (V8).
- **En la mochila con ámbito Trabajo,** `#pdf-trabajo` es la acción principal (C1).
- **El texto de `#continuar` en Práctica y trabajo** dice «Guardar y ver ajustes» (H4).

## 5. Menos recuadros (V5)
- `.paso`, `.tarjeta` y `.indicador-pasos` se separan con fondo y espacio, sin borde. Quedan con borde los campos, los botones secundarios y los diálogos.
- `.subtitulo-area` usa una línea de 1 px `--linea`, no 2 px `--tinta`.
- Los avisos (`.aviso-apoyos`, «Por revisar», errores y éxito) usan su fondo suave y su color de texto, sin borde, con un ícono `aria-hidden` (✓, ! o ✕) además del texto.
- Los diálogos usan `--elevado` y una sombra suave.

## Pruebas
- Las pruebas actuales siguen pasando. Ajusta solo las que comparan colores o textos que esta tarea cambia, sin debilitarlas.
- Prueba nueva, `scripts/probar_sistema_visual.cjs`, con Chromium (`process.env.CHROMIUM_BIN` o el de Playwright), en claro y oscuro, a 390 y 1280 px:
  - **tamaños de letra:** como máximo 6 tamaños distintos entre los elementos visibles fuera de `.hoja` (pantallas: «Para un estudiante» con resultados, DUA con resultados y la mochila abierta);
  - **contraste:** al menos 4,5:1 en `--tinta` y `--tenue` sobre `--papel` y `--superficie`, en `--sobre-acento` sobre `--acento` y en `--acento-texto` sobre `--acento-suave`; al menos 3:1 en `--borde-control` sobre `--superficie`;
  - **una sola `.boton-principal` visible** por pantalla y por diálogo abierto;
  - **lo elegido no depende solo del color:** un botón con `aria-pressed="true"` contiene «✓»;
  - **sin desplazamiento horizontal** a 390 px.

## Criterios de aceptación
- [ ] Los colores salen solo de las variables de la tabla, en claro y oscuro.
- [ ] Hay 6 tamaños de letra y una escala de espacio fuera del documento.
- [ ] Los botones y estados siguen la sección 4, con foco visible.
- [ ] Hay menos bordes, y los avisos llevan ícono y texto.
- [ ] Pasan `validar_catalogo.py`, todas las pruebas y la prueba nueva.
