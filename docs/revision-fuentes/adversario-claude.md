# Revisión adversarial de Claude

Se revisaron los 20 pares de `control-codex.csv`, contrastando cada afirmación y el veredicto de riesgo con el párrafo de la fuente indicada. La conclusión se limita a ese archivo, tal como está asignado en `pares.csv`.

## Hallazgos más graves

- **P144 — Claude demasiado generoso.** La guía británica habla de retirar al estudiante a un lugar más seguro; la ficha propone mover al curso. La medida sugerida no está respaldada por ese párrafo, por lo que el veredicto pasa de «en parte» a «sin respaldo».
- **P173 — respaldo legal sobredimensionado.** La Ley 20.422 sí apoya intérpretes en determinados accesos y ámbitos educativos, pero no subtítulos, videos subtitulados ni la coordinación con una unidad de inclusión. «Respaldada» no cubre todas las instrucciones de la ficha; se califica «en parte».
- **P397 — el resumen no sostiene el mandato concreto.** La fuente secundaria dice que el Código protege información privada, pero no que el artículo exija anotar barrera, ajuste, responsable y fechas, ni una regla expresa de «mínimo necesario». «Respaldada» es demasiado fuerte; corresponde «en parte».
- **P066 — exceso de fuerza probatoria.** La nota técnica recomienda pictogramas y agendas para anticipar, pero no avala retirarlos gradualmente ni aporta investigación sólida. El apoyo es parcial, no evidencia sólida para toda la afirmación.

En los demás pares, el veredicto de Claude resulta razonable al distinguir el principio respaldado de los detalles prácticos añadidos. Los cambios se registran con citas y localizadores en `adversario-claude.csv`.
