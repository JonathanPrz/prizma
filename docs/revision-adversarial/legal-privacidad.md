# Contraste normativo, privacidad y límites

## Normas solicitadas

La revisión compara las afirmaciones visibles con las copias y síntesis del repositorio al 19-11-2026. Una síntesis no acredita todos los artículos del original. Solo el plazo de tutela y la vigencia diferida de datos se contrastaron además mediante consulta web oficial; no afirmo actualización integral del ordenamiento.

| Norma | Lectura y contraste | Resultado |
|---|---|---|
| Decreto 83 | Art. 1; anexo, acceso, objetivos y proceso cooperativo | Limita su ámbito a parvularia/básica. `tipoOficial` etiqueta también fichas de media como «(Decreto 83)». El uso pedagógico por analogía no es la aplicación directa de la norma. |
| Decreto 67 | Art. 5 y art. 18 d | Diversificar no hace equivalentes todos los formatos. Evitar sobrecarga no ordena prestar computadores: la corrección de `acc-11-recursos` sigue sin fuente específica para ese paso. |
| Decreto 170 | Arts. 1, 4 y pasaje de autorización escrita para evaluación | Su objeto es evaluación diagnóstica para subvención, con profesionales y consentimiento; no es requisito general de certificado para cualquier apoyo. No encontré que Prizma exija ese certificado. La encuesta de frecuencias no debe presentarse como evaluación diagnóstica. |
| Decreto 2.516 | Síntesis local de arts. 2–4, 6–7, 11 y 13 | Bien al no fijar reducción automática de horas ni aplicar el decreto a superior. La guía omite al director en la explicación de firmas del informe; el resumen local incluye representante, tutor y director. Completarlo si se usa como lista de trámites. |
| Ley 20.422 | Arts. 8, 24, 36, 39 y 40 | Art. 24 sí respalda adaptar selección. Art. 39 obliga a mecanismos y materiales accesibles en superior, pero no dice que nunca puedan revisarse objetivos. Art. 40 regula atención escolar por salud; no respalda por sí solo todo plazo o recuperación de prueba. |
| Ley 21.091 | Art. 2 e | Incluye ajustes razonables; no contiene la prohibición categórica «en superior no se adecuan los objetivos» que aparece en la guía. La preservación de resultados esenciales es una decisión académica que requiere fundamento específico y distinguir objetivo esencial de objetivo accesorio. |
| Ley 21.545 | Arts. 18 y 21; Circular 586, acompañamiento | Regula inclusión y ajustes para estudiantes autistas; no es fundamento para tratar todo conflicto de curso como desregulación individual. PAEC, PACI y protocolo general tienen funciones distintas: una casilla que mezcla los tres no verifica la condición de una decisión curricular. |
| Ley 21.015 | Copia aportada y síntesis local, arts. 1–4 y transitorios | La guía diferencia sector público y privado. No computa practicantes curriculares como cuota; no encontré esa falla. Para porcentaje vigente debe usarse el consolidado y la condición posterior de 21.690. |
| Ley 21.275 | Copia y síntesis local: 157 quáter y vigencia | Correcto el umbral de empresas comprendidas en 157 bis para RR. HH. certificado y capacitación. La ficha de capacitación breve no acredita cumplimiento anual; no debe presentarse como certificado de cumplimiento. |
| Ley 21.690 | Síntesis local, transitorios y DT 503 | El repositorio documenta que 2% depende de informe y fecha posterior; la guía conserva 1%. No declaro error ese 1% ni afirmo haber revisado un informe ministerial posterior no incorporado. |
| Ley 19.628 | Síntesis local de arts. 2 g, 4, 7, 9 y 10 | Iniciales y barreras pueden identificar personas. El campo «qué decidió compartir» no opera como filtro y el PDF laboral incluye voz y frecuencia de barreras. La decisión debe tener efecto en los datos exportados, no quedar solo impresa. |
| Ley 21.719 | Texto/síntesis local, vigencia general 01-12-2026 y arts. 16 bis/16 quáter | El aviso no anticipa indebidamente la vigencia general. Su mención a salud y niñez es coherente, pero no garantiza que cada exportación cumpla restricciones. No se validó un formulario de consentimiento ni se habilita cesión clínica con una casilla. |
| Código del Trabajo | Síntesis local de arts. 2, 8, 153–154, 154 ter y 157; consulta DT sobre 486/489 | Umbrales 10/100 bien diferenciados en la guía. «Dentro de 60 días» omite hábiles, punto inicial, suspensión y límite judicial. No es una orientación suficiente para calcular caducidad. Art. 8 se aplica a práctica temporal pertinente; no se presume contrato ni seguro completo por ese artículo. |

La [consulta oficial de la DT sobre denuncia de derechos fundamentales](https://www.dt.gob.cl/portal/1628/w3-article-103247.html) explica días hábiles, suspensión por denuncia administrativa y límite de 90 días hábiles. La [página de Mintrab citada por el catálogo](https://www.mintrab.gob.cl/empleo/derechos-de-los-trabajadores/) conserva esas distinciones; la omisión está en la guía de Prizma. La edición BCN de Ley 19.628 con reforma señala [vigencia diferida al 01-12-2026](https://nuevo.leychile.cl/servicios/Consulta/Exportar?exportar_con_notas_al_pie=True&exportar_con_notas_bcn=True&exportar_con_notas_originales=True&exportar_formato=pdf&hddResultadoExportar=141599.2026-12-01.0.0%23&nombrearchivo=LEY-19628_28-AGO-1999&radioExportar=Normas). Se preserva el límite entre la fecha de este informe y la ley futura.

## Qué se midió en privacidad

**Red:** el navegador intenta solicitar `fonts.googleapis.com` antes de consentimiento. La prueba intercepta y cancela esas solicitudes; demuestra el intento, no una transmisión de expedientes. El HTML contiene además `preconnect` a Google y gstatic. Es incompatible con el absoluto «No envía nada a internet». No observé un envío de campos personales a esa URL ni afirmo que exista.

**Documento laboral:** se grabó `MARCADOR-PRIVADO` como voz y «Solo ajustes, no mi voz ni mis barreras» como decisión. `documentoTrabajo` y `vistaTrabajo` incluyen ambos y las frecuencias de barreras. `trabajo.pdf` permite comprobar el mismo contenido en la descarga real. No hay elección de campos. Es una exposición posible si se comparte confiando en el texto de decisión; la vista previa permite detectarla, pero no la impide.

**Documento desde DUA:** el evento de `#documento-clase` llama a `prepararDocumento`, que marca curso y estudiante activo cuando hay datos. `inclusionDesdeCurso` registra las casillas predeterminadas. La selección de curso no presupone autorización para divulgar un caso individual; deberían empezar sin estudiantes seleccionados al venir del módulo de curso.

**Proyección:** dos casos sintéticos con dimensión 2 producen «Lectura, escritura y cálculo: 2 estudiantes» en DUA (`datosProyeccion`). No aparecen iniciales en ese bloque, pero un curso pequeño puede inferir quiénes son. Hay que ofrecer modo de proyección que quite conteos de casos y acceso a mochila personal. No afirmo que este bloque publique nombres ni que todo curso permita reidentificación.

**Respaldo:** `respaldo-sintetico.json` incluye Educación y Trabajo en texto legible. La interfaz sí avisa explícitamente que incluye ambos ámbitos, por lo que no lo llamo exportación oculta. No cifra ni anonimiza; las iniciales y la voz siguen siendo datos personales. El documento para el centro es más restrictivo: `documentoParaCentro` filtra acciones elegidas y omite notas y voz; no le atribuyo la misma falla laboral sin evidencia.

**Almacenamiento:** `prizma.v1` conserva ambos ámbitos entre recargas sin cifrado ni control de identidad; es el diseño declarado. No lo presento por sí solo como vulnerabilidad de inyección o incumplimiento legal. Sí se comprobó una pérdida silenciosa bajo error de cuota: `guardar` atrapa la excepción, mantiene el estado en memoria y no avisa que no persistió (`falloPersistencia`). El usuario necesita saberlo antes de cerrar.

**Decisiones curriculares:** `objetivosSinFamilia` selecciona `obj-eliminacion` en básica y registra un acuerdo con solo docente, fechas y criterio. Obtiene «Acuerdos completos», sin errores, aunque `protocolo` sea falso. El experimento no demuestra que un docente lo aplicó en la vida real; demuestra que el estado visible de Prizma no distingue esta decisión sin participación de una decisión que sí cumple el proceso cooperativo del D83. El aviso de que no reemplaza un PACI no corrige esa certificación funcional.

**Seguridad de entradas:** se revisó `seleccionValidada`, `normalizarDatos`, `validarRespaldo` y uso de `textContent` en `el`. Hay límites, filtrado de IDs y validación de estructura; no encontré un XSS demostrado. No se hizo fuzzing completo, análisis de dependencias vendorizadas ni prueba de navegador comprometido.

## Copia de texto: resultado limitado

`medir-coincidencias.py` compara título, pasos y porqué de las 239 fichas con los **tres análisis locales**, por secuencias normalizadas de ocho palabras. `coincidencias-locales.json` no registra coincidencias. Eso no certifica ausencia de copia de CAST, OMS o EEF: los análisis no son el corpus original y la traducción puede ocultar una coincidencia literal en inglés.

En las 15 fichas DUA sorteadas se leyó también la consideración original de CAST; no detecté reproducción extensa, y los títulos oficiales usados como referencia están declarados como tales. No revisé todas las fichas contra las versiones originales completas de OMS y EEF ni todas las páginas españolas de CAST. **La verificación exhaustiva solicitada de ausencia de copia queda pendiente**, sin convertir «no detectado» en «no existe».
