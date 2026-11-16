# Tarea 031 · Tema con sol y luna, e ícono de mochila

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/031-iconos` · **Empieza después de la tarea 029**

## Para qué
El dueño quiere una cabecera más limpia:
- reemplazar el selector de tema («Tema: Según mi dispositivo / Claro / Oscuro») por un botón minimalista con sol y luna, sin la opción del sistema;
- poner un ícono minimalista de mochila en «Mi mochila».

**No cambies `data/`, `docs/fuentes/` ni `.claude/`. No agregues librerías ni fuentes de íconos:** usa SVG en línea.

## Íconos
- Trazo de 2 px, sin relleno, puntas redondeadas (`stroke-linecap` y `stroke-linejoin`: `round`) y color `currentColor`. Así combinan con el logo M1 y cambian con el tema.
- `viewBox="0 0 24 24"`, mostrados a 20 px. Cada SVG lleva `aria-hidden="true"` y `focusable="false"`.
- Úsalos tal cual:

**Sol**
```html
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
```

**Luna**
```html
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
```

**Mochila**
```html
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"/><rect x="5" y="6" width="14" height="15" rx="4"/><path d="M9 13h6v4H9z"/></svg>
```

## Cambios
1. **Botón de tema:**
   - Reemplaza el `<select id="tema">` y su etiqueta por un botón con el mismo estilo y tamaño que los de la cabecera. Objetivo táctil mínimo de 44 × 44 px y foco visible.
   - En modo claro muestra la **luna**, porque al presionarlo pasa a oscuro. En modo oscuro muestra el **sol**.
   - Usa `aria-label` según la acción: «Cambiar a modo oscuro» o «Cambiar a modo claro», y `title` con el mismo texto.
   - Guarda la elección en `localStorage` (`prizma.tema`, valores `claro` y `oscuro`, con `try/catch`).
   - **Primera visita, sin elección guardada:** parte según `prefers-color-scheme`, sin mostrar esa opción. Un valor guardado antiguo como `sistema` cuenta como sin elección.
   - El script del `<head>` que aplica el tema antes de pintar debe seguir evitando el destello.
2. **Mi mochila:**
   - El botón muestra el ícono de mochila y el contador.
   - El texto «Mi mochila» se ve desde 40 rem de ancho. En el teléfono se oculta a la vista con `.solo-lectores`.
   - El `aria-label` sigue diciendo «Mi mochila: N elegidas».
   - El contador conserva su animación y respeta `prefers-reduced-motion`.
3. **Estilo:** solo variables de `:root`. Contraste AA en ambos temas.

## Criterios de aceptación
- [ ] La cabecera ya no tiene el selector de tema. El botón alterna claro y oscuro, recuerda la elección y no produce destello al recargar.
- [ ] Sin elección guardada, el tema inicial sigue al dispositivo. Un `sistema` guardado no rompe nada.
- [ ] Los íconos se ven bien en ambos temas, a 390 px y a 1280 px. La mochila muestra el contador y su texto accesible.
- [ ] Teclado, foco visible, objetivos de 44 px y nombres accesibles correctos.
- [ ] Capturas de la cabecera en claro y oscuro, teléfono y escritorio, en `docs/marca/031-iconos/`.
- [ ] Pasan todas las pruebas `scripts/probar_*.cjs`. Ajusta las que usaban `#tema` como `select`.
