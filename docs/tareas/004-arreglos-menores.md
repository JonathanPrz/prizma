# Tarea 004 · Arreglos menores: singular y fecha local

Estado: **pendiente** · Asignada a: Codex · Rama: `codex/004-arreglos-menores` · Hazla **después** de integrar la tarea 003.

Detectados en la revisión de la tarea 001 ([JonathanPrz/prizma#1](https://github.com/JonathanPrz/prizma/pull/1)).

## Qué hacer

1. **Singular y plural.** Al abrir un respaldo, los mensajes dicen «1 acciones». Deben decir:
   - «Respaldo abierto: 1 acción.» o «Respaldo abierto: 3 acciones.»
   - «1 acción ya no está en el catálogo y no se cargó.» o «2 acciones ya no están en el catálogo y no se cargaron.»

   Crea una función pequeña para esto, por ejemplo `plural(n, "acción", "acciones")`. Úsala también en el conteo de tarjetas, en `#conteo`, que hoy resuelve el singular a mano.
2. **Fecha local en los nombres de archivo.** El respaldo y el PDF usan `toISOString().slice(0, 10)`, que da la fecha en UTC. De noche en Chile sale la fecha del día siguiente. Crea `fechaLocal()`, que devuelva `AAAA-MM-DD` con la fecha del equipo, y úsala en los 2 nombres de archivo. El campo `guardado` del respaldo sigue en ISO con zona horaria. No lo cambies.

## Criterios de aceptación

- [ ] Los 4 mensajes del punto 1 aparecen en singular o plural según el caso.
- [ ] Con la zona horaria `America/Santiago` y la hora de las 23:30, los 2 nombres de archivo llevan la fecha de ese día.
- [ ] Sin cambios en `data/`, `docs/` ni `.claude/`.
