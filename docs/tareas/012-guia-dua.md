# Tarea 012 · Aviso emergente «Cómo usar el DUA en tu clase»

Estado: **integrada** · Asignada a: Codex · Rama: `codex/012-guia-dua` · Hazla **después** de integrar la tarea 011.

## Para qué

Explica en 30 segundos cómo se usa el DUA y por qué Prizma parte con «¿Qué quieres resolver?». El texto se basa en CAST (2024), preguntas frecuentes de DUA 3.0 (`docs/fuentes/dua-3.0.md`, sección 2). **Usa el texto exacto. No lo cambies.**

## Qué hacer

1. Crea un `<dialog>` con el mismo patrón y estilo que el aviso de privacidad: el foco va al título al abrir, se cierra con Escape y devuelve el foco al elemento de origen.
2. **Cuándo se muestra:**
   - la primera vez que alguien abre la página. Si en esa visita también aparece el aviso de privacidad, muestra primero este;
   - siempre con el enlace «¿Cómo usar el DUA?», que va junto a la leyenda «¿Qué quieres resolver en esta clase?»;
   - y con un enlace igual en el pie de página, junto a «Privacidad».
3. Al apretar «Empezar», guárdalo en `localStorage` con try/catch para no mostrarlo otra vez de forma automática, y lleva el foco al primer botón de «¿Qué quieres resolver?».

## Texto exacto

Título: **Cómo usar el DUA en tu clase**

Lista numerada:
1. Parte por la meta: ¿qué quieres que aprendan?
2. Piensa qué podría impedir que algunos lo logren. Eso es una barrera.
3. Elige qué quieres resolver. Prizma te mostrará primero las acciones que responden a eso.
4. Elige pocas acciones. El DUA es un menú: no necesitas usarlas todas.
5. Quita las barreras, no el desafío. Lo que quieres que aprendan se mantiene.
6. Después de la clase, mira qué funcionó y ajusta.

Nota pequeña al final: «Basado en las Pautas DUA 3.0 de CAST (2024).»

Botón: **Empezar**

## Criterios de aceptación
- [ ] Aparece en la primera visita, antes que el aviso de privacidad.
- [ ] Después de apretar «Empezar» no vuelve a aparecer solo, ni al recargar.
- [ ] Se abre desde los 2 enlaces y devuelve el foco al enlace al cerrarse.
- [ ] El texto es exacto, se usa con teclado y funciona en tema claro y oscuro, y a 390 px sin desplazamiento horizontal.
- [ ] Pasan las pruebas de `scripts/`. No hay cambios en `data/`, `docs/fuentes/` ni `.claude/`.
