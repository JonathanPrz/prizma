# Tarea 059 · Logo nuevo: tres principios y una persona

Estado: **lista para Codex** · Asignada a: Codex · Rama: `codex/059-logo` · Pull request con destino `main`

## Para qué
El dueño aprobó el logo «C ajustada» el 20-11-2026, después de dos revisiones adversariales. Es una grilla de 2×2 girada 45°, apoyada sobre un vértice:
- arriba va un círculo en el color del texto, que representa a la persona;
- a la izquierda, abajo y a la derecha van tres cuadrados con los colores de los principios DUA, en su orden: Compromiso, Representación y Acción y expresión.

Reemplaza al logo de 8 cuadrados, que además usaba colores (rosado, cian y violeta) que no son los de los principios.

**No cambies `data/`, `docs/fuentes/` ni `.claude/`.** Mantén la geometría tal cual: sin curvas ni detalles que lo hagan más «humano».

## 1. Logo de la cabecera (`index.html`, `svg.logo`)
Reemplaza el contenido del SVG (se mantiene `viewBox="0 0 100 100"`, `aria-hidden` y `focusable="false"`) por:

```html
<g transform="translate(50 48) rotate(45) scale(.7) translate(-50 -50)">
  <circle cx="25" cy="25" r="21" fill="currentColor"/>
  <rect x="55" y="5" width="40" height="40" rx="5" fill="var(--accion)"/>
  <rect x="5" y="55" width="40" height="40" rx="5" fill="var(--compromiso)"/>
  <rect x="55" y="55" width="40" height="40" rx="5" fill="var(--representacion)"/>
</g>
```

Una vez girado, Compromiso queda a la izquierda, Representación abajo y Acción y expresión a la derecha. En oscuro toma solo los colores claros, a través de las variables. Revisa el centrado óptico junto a «Prizma». Si hace falta, ajusta solo el `vertical-align` o el margen del SVG en CSS, no la geometría.

## 2. Logo del documento (`logoDocumento()` en `app.js`)
Cambia los reemplazos de colores para la versión impresa:
- `currentColor` por `#1a2134`;
- `var(--compromiso)` por `#21633b`;
- `var(--representacion)` por `#693b97`;
- `var(--accion)` por `#005873`.

El documento y el PDF muestran el logo nuevo.

## 3. Ícono de pestaña (`assets/favicon.svg`)
Reemplázalo por la versión sobre placa oscura, que se ve en pestañas claras y oscuras:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#1a2134"/>
  <g transform="translate(50 49) rotate(45) scale(.64) translate(-50 -50)">
    <circle cx="25" cy="25" r="21" fill="#e8eaef"/>
    <rect x="55" y="5" width="40" height="40" rx="5" fill="#76d7ee"/>
    <rect x="5" y="55" width="40" height="40" rx="5" fill="#8bdaa1"/>
    <rect x="55" y="55" width="40" height="40" rx="5" fill="#d2afff"/>
  </g>
</svg>
```

## 4. Ícono para el teléfono (`assets/apple-touch-icon.png`)
Genera un PNG de 180 × 180 a partir del mismo `favicon.svg` con el Chromium de Playwright. Es una herramienta de desarrollo, no una dependencia. Deja el script en `scripts/generar_iconos.cjs`, para poder regenerarlo.

## 5. Limpieza
Si `--motivar`, `--presentar` y `--mostrar` ya no se usan en ningún lugar de `styles.css`, `index.html` ni `app.js`, quítalas de los tres bloques de `:root`. Si se usan, déjalas y dilo en el pull request.

## Pruebas
- Las pruebas actuales siguen pasando.
- Agrégalas a `scripts/probar_sistema_visual.cjs`:
  - el `svg.logo` de la cabecera tiene 1 `circle` y 3 `rect`, y sus `fill` resueltos son los de `--compromiso`, `--representacion` y `--accion`, en claro y en oscuro;
  - `logoDocumento()` no contiene `var(` ni `currentColor`, y sí contiene `#21633b`, `#693b97` y `#005873`;
  - `assets/favicon.svg` tiene la placa `#1a2134`;
  - `assets/apple-touch-icon.png` mide 180 × 180.
- En el pull request, agrega capturas de la cabecera en claro y oscuro a 390 y 1280 px, del logo en la vista del documento y del favicon a 16 y 32 px.

Corre `python3 scripts/validar_catalogo.py` y todas las pruebas `scripts/probar_*.cjs`.

## Criterios de aceptación
- [ ] El logo nuevo se ve en la cabecera, en el documento, en el favicon y en el ícono del teléfono.
- [ ] Los colores son los de los principios y siguen el modo claro u oscuro.
- [ ] Se quitaron las variables que ya no se usan, o se explicó por qué siguen.
- [ ] Pasan el validador y todas las pruebas.
