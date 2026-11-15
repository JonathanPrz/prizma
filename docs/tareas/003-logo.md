# Tarea 003 · Poner el logo «prisma de teselas» en la página

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/003-logo` · Hazla **después** de integrar la tarea 002.

## Para qué

El dueño eligió el logo C, un prisma armado con 9 triángulos. Está en `docs/marca/logo-teselas.svg`, y las opciones descartadas están en `docs/marca/opciones-logo.png`. Hoy la cabecera muestra un triángulo provisorio hecho con CSS (`.prisma`).

## Qué hacer

1. **Cabecera.** Reemplaza `<span class="prisma">` por el logo como `<svg>` en línea, decorativo (`aria-hidden="true"`, porque al lado ya dice «Prizma»), de unos `2.25rem` de alto. Borra las reglas `.prisma` de `styles.css`.
2. **Modo oscuro.** En el SVG en línea:
   - el triángulo de color tinta (`#18213f`) debe usar `fill="currentColor"`, para que siga a `var(--tinta)`;
   - las separaciones blancas (`stroke="#fff"`) deben usar el color del fondo de la cabecera, `var(--superficie)`.

   Así el logo se ve bien en modo claro y oscuro.
3. **Ícono de la pestaña.**
   - Crea `assets/favicon.svg`: el mismo logo, con los colores fijos del archivo original, sobre fondo transparente.
   - Agrega en el `<head>`: `<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">`.
   - Crea también `assets/apple-touch-icon.png` de 180×180 px: el logo centrado sobre fondo blanco, con margen. Agrega su `<link rel="apple-touch-icon">`.
4. **No cambies** la forma ni los colores del logo. Si algo se ve mal en tamaño pequeño, descríbelo en el pull request en vez de corregirlo.

## Criterios de aceptación

- [ ] La cabecera muestra el logo nuevo junto a «Prizma». No quedan restos de `.prisma`.
- [ ] En modo oscuro el triángulo de tinta se ve claro y las separaciones no quedan blancas.
- [ ] La pestaña del navegador muestra el ícono.
- [ ] El logo no se anuncia dos veces en un lector de pantalla.
- [ ] A 390 px no hay desplazamiento horizontal. No hay errores en la consola.
- [ ] No hay cambios en `data/`, `docs/` ni `.claude/`, salvo lo que pide esta tarea.
