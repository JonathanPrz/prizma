# Plantillas de mensajes y rótulos en app.js

Localizadores del corte auditado. Esto es código literal, no una afirmación de que todos los mensajes se hayan disparado. Incluye errores, confirmaciones, pluralización y estados transitorios; las variantes observadas se registran aparte. No propone cambios.

| Línea | Código original |
| --- | --- |
| 62 | const CIF_TITULO = "Barreras y facilitadores (enfoque CIF)"; |
| 63 | const CIF_AVISO = "Las situaciones describen barreras del entorno, no rasgos del estudiante (CIF, OMS 2001)"; |
| 64 | const CIF_COLUMNAS = ["Situación", "Frecuencia", "Apoyos elegidos para esa situación"]; |
| 67 | const PIE_PRACTICA = "Documento preparado con el estudiante. Contiene solo lo que decidió compartir."; |
| 134 | type: "button", class: "chip", id: `estudiante-${e.id}`, "aria-pressed": String(e.id === estado.estudianteActivo), text: nombreEstudiante(e) + " · " + estadoCaso(e), |
| 141 | $("#quitar-estudiante").textContent = "Quitar a " + nombreEstudiante(estudianteActual()); |
| 153 | if (!window.confirm("Se borran sus datos y apoyos de este navegador. ¿Continuar?")) return; |
| 169 | caja.replaceChildren(el("h3", { text: "Barreras que se repiten en tu curso" }), ...lista.map((b) => { |
| 171 | return el("div", {}, el("p", { text: `${b.nombre}: ${b.cantidad} estudiantes` }), n ? el("button", { |
| 172 | type: "button", class: "boton", id: `barrera-${b.dimension}`, text: estado.necesidades.includes(n.id) ? "Ya lo estás considerando" : "Ver acciones para esto", |
| 249 | $("#agregar-estudiante").textContent = estado.estudiantes.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso"; |
| 250 | $("#agregar-caso-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreEstudiante).join(", ") : estado.estudiantes.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso."; |
| 253 | if (caso) b.textContent = nombreEstudiante(caso) + " · " + estadoCaso(caso); |
| 260 | $("#paso-descripcion-texto").textContent = situaciones ? situaciones + (e.ayuda.trim() ? ". Le ayuda: " + e.ayuda.trim() : "") : "Todavía no guardas una situación."; |
| 262 | $("#paso-acuerdos-texto").textContent = a.fecha ? `${estadoCaso(e)} · ${a.roles.map((r) => ROLES_ACUERDO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) \|\| "Sin indicar"}` : "Todavía no guardas acuerdos."; |
| 264 | $("#iniciales-duplicadas").textContent = repetidas ? `Ya hay un estudiante ${e.iniciales}. Agrega un número para distinguirlos` : ""; |
| 277 | $("#acuerdos-error").textContent = ""; $("#descripcion-error").textContent = ""; |
| 280 | if (!Object.keys(estudianteActual().dimensiones).length) { $("#descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; } |
| 282 | $("#descripcion-error").textContent = ""; abrirPaso("paso-descripcion", false); $("#t-apoyos").focus(); actualizarPaso(2); |
| 286 | $("#acuerdos-error").textContent = errores.join(" "); |
| 298 | $("#paso-clase-texto").textContent = detalles.join(" · ") \|\| (estado.propositos.length \|\| estado.perfil.actividad.length \|\| estado.perfil.evidencia.length ? "Guardaste las opciones de tu clase." : "Sin filtros: verás todas las acciones"); |
| 334 | $("#paso-descripcion-toggle").textContent = "1. Describe la situación de " + nombreEstudiante(estudianteActual()); |
| 339 | $("#revision-situaciones-texto").textContent = 'Separamos algunas situaciones: "Visión" y "Audición", y "Comprender" y "Expresarse oralmente". Revisa las situaciones de: ' + pendientes.map(nombreEstudiante).join(", ") + "."; |
| 343 | $("#t-apoyos").textContent = (esSuperior() ? "2. Ajustes razonables sugeridos para " : "2. Apoyos sugeridos para ") + nombreEstudiante(estudianteActual()); |
| 362 | $("#centro-ayuda").textContent = elegidasCentro().length ? "El estudiante decide cuáles ajustes compartir." : "Primero elige los ajustes que puede hacer el centro"; |
| 367 | $("#t-estudiante").textContent = superior ? "Ajustes razonables para un estudiante" : "Apoyos para un estudiante"; |
| 368 | $("#bajada-apoyos").textContent = superior ? "Cambios en la forma de enseñar, evaluar o en el entorno que permiten participar en igualdad, sin bajar los resultados de aprendizaje." : "Cuando las acciones para todo el curso no bastan, un estudiante puede necesitar apoyos propios. Se acuerdan con él, su familia y el equipo."; |
| 369 | $("#voz-etiqueta").textContent = superior ? "¿Qué dice el estudiante?" : "¿Qué dicen el estudiante y su familia?"; |
| 370 | $("#voz-ayuda").textContent = superior ? "Lo que le acomoda, lo que le preocupa o lo que propone. No escribas diagnósticos." : "Lo que les acomoda, lo que les preocupa o lo que proponen. No escribas diagnósticos."; |
| 373 | enlace.textContent = superior ? "¿Qué son los ajustes razonables?" : "¿Qué son los apoyos para un estudiante?"; |
| 387 | el("a", { href: "#dua", text: "Revisa las acciones DUA." })))); |
| 393 | ...(primeras.length ? [el("section", { "aria-labelledby": "t-para-empezar" }, el("h3", { id: "t-para-empezar", text: `Para empezar (${primeras.length})` }), el("p", { class: "ayuda", text: definicionAcceso() }), el("ul", { class: "tarjetas" }, primeras.map(tarjeta)))] : []), |
| 400 | $("#objetivos summary").textContent = `Adecuaciones en los objetivos (${objetivos.length})`; |
| 401 | $("#desregulacion summary").textContent = `Apoyos ante desregulación (${catalogo.filter((r) => r.tipo === "desregulacion" && aplica(r)).length})`; |
| 409 | $("#apoyos-estado").textContent = Object.keys(estudianteActual().dimensiones).length \|\| practicas.length ? `${lista.length + practicas.length} ${superior ? "ajustes razonables sugeridos" : "adecuaciones de acceso sugeridas"}` : "Marca al menos una situación para ver apoyos."; |
| 435 | const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": `ayuda-d-${d}` }, el("legend", { text: titulo }), el("p", { class: "ayuda", id: `ayuda-d-${d}`, text: ayuda })); |
| 502 | const PIE_TRABAJO = "Contiene datos de una persona trabajadora. Guárdalo con reserva (Código del Trabajo, art. 154 ter)."; |
| 503 | const AVISO_TRABAJO = "Orientación pedagógica y laboral. No reemplaza la evaluación de profesionales ni los protocolos de tu empresa o institución, y no es asesoría legal. Sin diagnósticos: la persona decide qué contar y con quién compartir este acuerdo de ajustes."; |
| 538 | $("#agregar-trabajador").textContent = estado.trabajadores.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso"; |
| 539 | $("#trabajo-agregar-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreTrabajador).join(", ") : estado.trabajadores.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso."; |
| 542 | if (caso) b.textContent = nombreTrabajador(caso) + " · " + estadoCaso(caso, true); |
| 544 | $("#trabajo-descripcion-toggle").textContent = "1. Describe la situación de " + nombreTrabajador(e); |
| 545 | $("#quitar-trabajador").textContent = "Quitar a " + nombreTrabajador(e); |
| 550 | $("#trabajo-descripcion-texto").textContent = [e.tipoPuesto, situaciones, e.ayuda.trim() ? "Le ayuda: " + e.ayuda.trim() : ""].filter(Boolean).join(" · ") \|\| "Todavía no guardas una situación."; |
| 552 | $("#trabajo-acuerdo-texto").textContent = a.fecha ? `${estadoCaso(e, true)} · ${a.roles.map((r) => ROLES_TRABAJO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) \|\| "Sin indicar"}` : "Todavía no guardas acuerdos."; |
| 553 | $("#trabajo-duplicadas").textContent = e.iniciales && estado.trabajadores.some((otro) => otro.id !== e.id && otro.iniciales.toUpperCase() === e.iniciales.toUpperCase()) ? `Ya hay una persona ${e.iniciales}. Agrega un número para distinguirlas` : ""; |
| 559 | const grupo = (titulo, fichas) => titulo === "Para empezar" ? el("section", {}, el("h3", { text: `${titulo} (${fichas.length})` }), el("p", { class: "ayuda", text: "Cambio en el puesto, la comunicación, las herramientas o el horario. La ley lo llama «ajuste necesario» (Ley 20.422, art. 8)." }), el("ul", { class: "tarjetas" }, fichas.map((r) => tarjeta(r)))) : grupoPlegado(titulo, fichas, "Cambio en el puesto, la comunicación, las herramientas o el horario. La ley lo llama «ajuste necesario» (Ley 20.422, art. 8)."); |
| 571 | "aria-pressed": String(e.id === estado.trabajadorActivo), text: nombreTrabajador(e) + " · " + estadoCaso(e, true), onclick: () => { |
| 586 | const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": ayudaId }, el("legend", { text: DIMENSIONES[d - 1][0] }), el("p", { id: ayudaId, class: "ayuda", text: EJEMPLOS_TRABAJO[d - 1] })); |
| 603 | $("#trabajo-acuerdos-error").textContent = ""; $("#trabajo-descripcion-error").textContent = ""; |
| 614 | if (!Object.keys(e.dimensiones).length) { $("#trabajo-descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; } |
| 615 | e.descripcionGuardada = true; guardar(); pintarTrabajo(); $("#trabajo-descripcion-error").textContent = ""; |
| 620 | const errores = erroresAcuerdo(e, true); $("#trabajo-acuerdos-error").textContent = errores.join(" "); if (errores.length) return; |
| 633 | if (!window.confirm("Se borran sus datos y ajustes de este navegador. ¿Continuar?")) return; |
| 710 | document.querySelectorAll("[data-voc]").forEach((n) => { n.textContent = voc(n.dataset.voc); }); |
| 711 | $("#tab-apoyos").textContent = esSuperior() ? "Ajustes razonables" : "Para un estudiante"; |
| 817 | !f \|\| typeof f.id !== "string" \|\| !f.id.trim() \|\| typeof f.cita !== "string" \|\| !f.cita.trim() \|\| typeof f.url !== "string" \|\| !/^https?:\/\//.test(f.url))) throw new Error("Fuentes inválidas"); |
| 837 | (r.tipo === "practica-profesional" && !Object.hasOwn(TIPOS_PRACTICA, r.subtipo)))) throw new Error("No se pudo leer el catálogo"); |
| 871 | if (k === "class") n.className = v; else if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v); |
| 884 | el("summary", { text: `${nombre} (${acciones.length})` }), |
| 885 | el("p", { class: "ayuda", text: definicion }), |
| 906 | b.textContent = `Continuar (${Object.keys(seleccion \|\| {}).length} elegidos)`; |
| 943 | const a = el("a", { href: "#" + id, text: textos[i] }); |
| 959 | }, text: n.texto, |
| 971 | }, nombreMomento(id, nombre) + " ", el("small", { text: `(${conteo})` }))); |
| 1006 | !dua ? el("span", { class: "t-proposito", text: tipoOficial(r) }) : el("span", { class: "t-proposito " + prop }, el("span", { class: "tri", "aria-hidden": "true" }), PROPOSITOS[prop].corto), |
| 1008 | dua && destacarMomento ? el("p", { class: "t-momento", text: nombresMomentos()[r.momento] }) : null, |
| 1009 | dua && coincidenciasNecesidades(r).length ? el("p", { class: "t-razon", text: "Responde a: " + coincidenciasNecesidades(r).map((n) => n.texto).join("; ") + "." }) : null, |
| 1010 | dua && practicaActiva() && esPractica(r) ? el("p", { class: "t-razon", text: "Responde a lo que marcaste: taller, laboratorio o terreno." }) : null, |
| 1011 | trabajo && r.dimensiones.length ? el("p", { class: "t-razon", text: "Porque marcaste: " + dimensionesCoincidentes(r, persona).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[persona.dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : null, |
| 1012 | acceso ? el("p", { class: "t-razon", text: "Porque marcaste: " + (esPractica(r) ? "actividades prácticas" + (dimensionesCoincidentes(r).length ? "; " : "") : "") + dimensionesCoincidentes(r).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[estudianteActual().dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : dua && coincidencias(r).length ? el("p", { class: "t-razon", text: "Responde a lo que marcaste: " + coincidencias(r).map(etiqueta).join(", ") + "." }) : null, |
| 1013 | r.tipo === "objetivos" && r.subtipo === "eliminacion" ? el("strong", { class: "ultimo-recurso", text: "Último recurso" }) : null, |
| 1014 | el(dua \|\| trabajo \|\| ["objetivos", "practica-profesional"].includes(r.tipo) ? "h4" : "h3", { text: r.titulo }), |
| 1015 | ofrecida ? el("p", { class: "aviso-cruzado", role: "status", text: "Ya está considerado en el DUA: " + version.titulo }) : null, |
| 1016 | dua && estudiantesCubiertos(r) ? el("p", { class: "aviso-cruzado", role: "status", text: avisoDua(r) }) : null, |
| 1017 | el("ol", {}, r.como.map((p) => el("li", { text: textoPublico(p) }))), |
| 1018 | version ? el("div", { class: "version-curso", id: "version-" + r.id, tabindex: "-1" }, el("p", { text: "Versión para todo el curso: " + version.titulo }), |
| 1019 | preguntar ? el("div", { role: "status" }, el("p", { text: `Este apoyo lo necesitan ${repetida} estudiantes. ¿Quieres agregar su versión a todo el curso?` }), |
| 1021 | el("button", { type: "button", class: "boton", id: "curso-" + r.id, text: "Sí, agregar al curso", onclick: () => agregarVersionCurso(r) }), |
| 1022 | el("button", { type: "button", class: "boton", id: "individual-" + r.id, text: "No, mantener individual", onclick: () => { |
| 1024 | } }))) : el("button", { type: "button", class: "boton", id: "curso-" + r.id, ...(ofrecida ? { disabled: "" } : {}), text: ofrecida ? "Ya está en el curso" : "Agregar al curso", onclick: () => agregarVersionCurso(r) })) : null, |
| 1025 | repetida >= 2 && !version ? el("p", { class: "aviso-apoyos", role: "status", text: `Este apoyo lo eligieron ${repetida} estudiantes` }) : null, |
| 1026 | el("p", { class: "t-porque" }, el("strong", { text: "Por qué funciona: " }), r.porque), |
| 1028 | el("span", { class: "respaldo " + r.respaldo, text: RESPALDO[r.respaldo] }), |
| 1030 | el("details", { class: "fuentes" }, el("summary", { text: "Fuentes" }), |
| 1031 | el("ul", {}, r.fuentes.map((f) => el("li", {}, el("a", { href: fuentes[f].url, rel: "noopener", target: "_blank", text: fuentes[f].cita })))))); |
| 1047 | ...(primeras.length ? [el("section", { "aria-labelledby": "t-dua-empezar" }, el("h3", { id: "t-dua-empezar", text: `Para empezar (${primeras.length})` }), el("p", { class: "ayuda", text: "Algo que haces para todo el curso." }), el("ul", { class: "tarjetas" }, primeras.map((r) => tarjeta(r, true))))] : []), |
| 1050 | $("#conteo").textContent = plural(lista.length, "acción", "acciones"); |
| 1071 | aviso.textContent = ""; |
| 1072 | requestAnimationFrame(() => { aviso.textContent = "Agregada a tu mochila"; }); |
| 1086 | $("#n-sel").textContent = total; |
| 1087 | $("#abrir-mochila").setAttribute("aria-label", `Mi mochila: ${plural(total, "elegida", "elegidas")}`); |
| 1098 | el("section", {}, el("h3", { text: tituloEstudiante(e) }), el("p", { class: "ayuda", text: subtituloEstudiante() }), |
| 1100 | el("div", {}, el("h4", { text: esSuperior() && ["acceso", "adicional"].includes(tipo) ? "Ajustes razonables" : GRUPOS_APOYOS[tipo] }), el("ol", { class: "sel-lista" }, elegidasOrdenadas(e.seleccion).filter((r) => r.tipo === tipo).map((r) => itemSeleccion(r, e)))))))); |
| 1104 | $("#borrar").textContent = trabajo ? "Borrar los datos de Trabajo" : "Borrar los datos de Educación"; |
| 1105 | $("#sel-vacia").textContent = trabajo ? "Todavía no eliges ajustes. Usa el botón «Elegir» de cada ajuste." : "Todavía no eliges acciones ni apoyos. Usa el botón «Elegir»."; |
| 1106 | $("#sel-trabajadores").replaceChildren(...(trabajo ? laborales : []).map((e) => el("section", {}, el("h4", { text: tituloTrabajador(e) }), el("ol", { class: "sel-lista" }, elegidasTrabajo(e).map((r) => itemSeleccion(r, e, "quitar-trabajo-", true)))))); |
| 1110 | const nota = el("textarea", { "data-nota-clave": claveNota, rows: "2", maxlength: "2000", "aria-label": "Nota para: " + r.titulo + (e ? " · " + (trabajo ? nombreTrabajador(e) : nombreEstudiante(e)) : " · Curso"), placeholder: "Nota opcional: cómo la usarás" }); |
| 1119 | return el("li", {}, el("span", { class: "sel-momento", text: e ? tipoOficial(r) : nombreMomento[r.momento] }), |
| 1120 | el("span", { class: "sel-titulo", text: r.titulo }), nota, |
| 1121 | el("button", { type: "button", class: "quitar", id: prefijo + (e ? e.id + "-" : "") + r.id, onclick: () => alternar(r.id, trabajo ? undefined : e?.id, trabajo ? e.id : undefined), text: "Quitar" })); |
| 1138 | if (nivel !== estado.perfil.nivel && cantidad && !window.confirm(`Cambiar el nivel cambia los apoyos sugeridos de tus ${cantidad} casos. Lo que ya elegiste se conserva`)) { $("#nivel").value = estado.perfil.nivel; return; } |
| 1170 | $("#respaldo-estado").textContent = "Respaldo descargado. Búscalo en tu carpeta de descargas."; |
| 1175 | if (!objeto(datos) \|\| datos.app !== "prizma" \|\| ![1, 2].includes(datos.version)) throw new Error("Este archivo no es un respaldo de Prizma."); |
| 1179 | throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); |
| 1181 | if (datos.trabajadores !== undefined && (!Array.isArray(datos.trabajadores) \|\| datos.trabajadores.length > 10 \|\| datos.trabajadores.some((e) => !objeto(e) \|\| !seleccion(e.seleccion)))) throw new Error("El archivo no se pudo leer. Revisa los casos de trabajo del respaldo."); |
| 1192 | if (archivo.size > 12 * 1024 * 1024) throw new Error("El archivo es demasiado grande para ser un respaldo de Prizma."); |
| 1195 | catch (e) { throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); } |
| 1197 | if (hayDatos() && !window.confirm(`Esto reemplaza los datos de tu ${voc("clase")}, tu selección y todos tus estudiantes y los casos de trabajo por los del respaldo. ¿Continuar?`)) { |
| 1198 | aviso.textContent = "No se abrió el respaldo. Tus datos siguen igual."; |
| 1204 | aviso.textContent = `Respaldo abierto: ${plural(totalElegidas(), "acción", "acciones")}.` + |
| 1206 | } catch (e) { aviso.textContent = e.message; } |
| 1215 | $("#t-incluir-documento").textContent = "¿Qué personas incluirás en el documento de trabajo?"; |
| 1217 | el("p", { class: "ayuda", text: "La persona decide qué contar. Revisa con ella los datos, las notas y los ajustes antes de compartir el documento." }), |
| 1222 | $("#error-documento").textContent = ""; $("#mochila").close(); $("#incluir-documento").showModal(); $("#t-incluir-documento").focus(); |
| 1242 | const AVISO = "Orientación pedagógica. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas."; |
| 1246 | inclusionTrabajo = null; $("#t-incluir-documento").textContent = "¿Qué incluirás en el documento?"; |
| 1257 | $("#error-documento").textContent = ""; |
| 1263 | if (!ids.length) { $("#error-documento").textContent = inclusionTrabajo !== null ? "Elige al menos una persona trabajadora." : "Elige el curso o al menos un estudiante."; return; } |
| 1268 | boton.disabled = true; $("#error-documento").textContent = "Preparando documento…"; |
| 1270 | catch (e) { if (solicitud === solicitudDocumento) { $("#error-documento").textContent = "No se pudo preparar el documento. Reintenta."; boton.disabled = false; } return; } |
| 1274 | armarHoja(); $("#incluir-documento").close(); $("#vista-estado").textContent = ""; $("#vista").showModal(); |
| 1286 | $("#decision-centro-ayuda").textContent = !tiene ? "Marca al menos un ajuste para incluir." : !$("#decision-centro").checked ? "Para ver el documento, el estudiante debe revisarlo y decidir compartirlo." : "Se incluirán solo los ajustes marcados, sin datos personales ni notas."; |
| 1299 | $("#error-centro").textContent = ""; actualizarDecisionCentro(); |
| 1308 | $("#ver-centro").disabled = true; $("#error-centro").textContent = "Preparando documento…"; |
| 1310 | catch (e) { if (solicitud === solicitudDocumento) { $("#error-centro").textContent = "No se pudo preparar el documento. Reintenta."; actualizarDecisionCentro(); } return; } |
| 1314 | $("#vista-estado").textContent = ""; $("#vista").showModal(); $("#cerrar").focus(); |
| 1370 | const tabla = (columnas, filas, clase = "") => el("table", { class: clase }, el("thead", {}, el("tr", {}, columnas.map((t) => el("th", { scope: "col", text: t })))), |
| 1371 | el("tbody", {}, filas.map((fila) => el("tr", {}, fila.map((t, i) => el(i ? "td" : "th", i ? { text: t } : { scope: "row", text: t })))))); |
| 1372 | const ficha = (a) => el("div", { class: "h-accion" }, el("h3", { text: a.titulo }), el("ol", {}, a.como.map((t) => el("li", { text: t }))), |
| 1373 | el("p", {}, el("strong", { text: "Por qué funciona: " }), a.porque), el("p", { class: "h-dato", text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : "") }), |
| 1374 | a.nota ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), a.nota) : null); |
| 1377 | el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })), |
| 1378 | el("h1", { text: d.titulo }), ...(d.borrador ? [el("p", { class: "aviso-apoyos", text: "Borrador: acuerdos sin completar" })] : []), tabla(["Campo", "Completar a mano"], d.resumen, "h-resumen"), |
| 1379 | ...d.acciones.map(ficha), el("div", { class: "h-acuerdos" }, el("h2", { text: "Acuerdos (para completar en la reunión)" }), |
| 1380 | ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => el("p", { text: t + ": __________________________________" }))), |
| 1381 | el("p", { class: "h-aviso", text: PIE_PRACTICA }), el("p", { class: "h-aviso", text: AVISO })); |
| 1385 | el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })), |
| 1386 | el("h1", { text: d.titulo }), ...(d.borrador ? [el("p", { class: "aviso-apoyos", text: "Borrador: acuerdos sin completar" })] : []), tabla(["Resumen", "Información"], d.resumen, "h-resumen"), |
| 1387 | d.curso ? el("h2", { text: "Acciones para todo el curso" }) : null, |
| 1389 | el((g.estudiante \|\| g.trabajador) ? "h2" : "h3", { text: g.nombre }), g.subtitulo ? el("p", { text: g.subtitulo }) : null, |
| 1390 | g.cif ? el("div", {}, el("h3", { text: CIF_TITULO }), el("p", { class: "h-dato", text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO }), |
| 1391 | el("div", { class: "tabla-cif", tabindex: "0", role: "region", "aria-label": CIF_TITULO }, tabla(d.trabajo ? ["Situación", "Frecuencia", "Ajustes elegidos para esa situación"] : CIF_COLUMNAS, g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]], "h-cif")), |
| 1393 | g.reflexion ? el("p", { text: g.reflexion }) : null, |
| 1394 | ...g.acciones.flatMap((a, i) => [(g.estudiante \|\| g.trabajador) && a.grupo !== g.acciones[i - 1]?.grupo ? el("h3", { class: "h-grupo", text: a.grupo }) : null, ficha(a)]), |
| 1395 | (g.estudiante \|\| g.trabajador) ? el("div", { class: "h-acuerdos" }, el("h3", { text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)" }), ...datosAcuerdo(g).map((text) => el("p", { text })), g.estadoAcuerdo === "Por revisar" ? el("p", { text: "Por revisar: cambiaste el caso después del acuerdo." }) : null) : null)), |
| 1396 | el("section", { class: "h-fuentes-seccion" }, el("h2", { text: "Fuentes" }), el("ol", { class: "h-fuentes" }, d.fuentes.map((f) => el("li", {}, f.cita, el("p", { class: "h-dato", text: f.url })))), el("p", { class: "h-aviso", text: d.trabajo ? AVISO_TRABAJO : AVISO }))].filter(Boolean)); |
| 1402 | { text: a.titulo, style: "h3" }, { ol: [...a.como], margin: [0, 4, 0, 4] }, |
| 1403 | { text: [{ text: "Por qué funciona: ", bold: true }, a.porque] }, { text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : ""), style: "dato", margin: [0, 4, 0, 0] }, |
| 1404 | ...(a.nota ? [{ table: { widths: ["*"], body: [[{ text: [{ text: "Mi nota: ", bold: true }, a.nota], fillColor: "#f2f2f2", margin: [5, 5, 5, 5] }]] }, layout: "noBorders", margin: [0, 5, 0, 0] }] : []), |
| 1407 | { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] }, |
| 1408 | { text: d.titulo, style: "h1" }, |
| 1409 | ...(d.borrador ? [{ text: "Borrador: acuerdos sin completar", bold: true, margin: [0, 8, 0, 8] }] : []), |
| 1410 | { table: { widths: [150, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: fino, margin: [0, 12, 0, 18] }, |
| 1412 | { unbreakable: true, stack: [{ text: "Acuerdos (para completar en la reunión)", style: "h2" }, ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => ({ text: t + ": __________________________________________________", margin: [0, 12, 0, 0] }))] }, |
| 1413 | { text: PIE_PRACTICA, style: "dato", margin: [0, 18, 0, 0] }, |
| 1414 | { text: AVISO, style: "dato", margin: [0, 14, 0, 0] }, |
| 1416 | { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] }, |
| 1417 | { text: d.titulo, style: "h1" }, |
| 1418 | ...(d.borrador ? [{ text: "Borrador: acuerdos sin completar", bold: true, margin: [0, 8, 0, 8] }] : []), |
| 1419 | { table: { widths: [110, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: { ...fino, vLineWidth: () => 0, hLineWidth: () => .3 }, margin: [0, 8, 0, 14] }, |
| 1420 | ...(d.curso && !d.grupos.some((g) => !(g.estudiante \|\| g.trabajador)) ? [{ text: "Acciones para todo el curso", style: "h2", headlineLevel: 1 }] : []), |
| 1422 | ...(g.reflexion ? [{ unbreakable: true, stack: [{ text: g.nombre, style: "h3" }, { text: g.reflexion, margin: [0, 5, 0, 12] }] }] : []), |
| 1423 | ...((g.estudiante \|\| g.trabajador) ? [{ id: "alumno-" + (g.estudiante \|\| g.trabajador), text: g.nombre, style: "h2", headlineLevel: 1, pageBreak: "before", margin: [0, 8, 0, 6] }] : []), |
| 1425 | { text: g.subtitulo, italics: true, margin: [0, 0, 0, 8] }, |
| 1426 | { text: CIF_TITULO, style: "h3", headlineLevel: 2 }, { text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO, style: "dato", margin: [0, 3, 0, 5] }, |
| 1428 | { table: { widths: [125, "*"], body: [[{ text: "Le ayuda", bold: true }, g.ayuda], [{ text: d.trabajo ? "Qué dice la persona" : (esSuperior() ? "Qué dice el estudiante" : "Qué dicen el estudiante y su familia"), bold: true }, g.voz]] }, layout: fino, margin: [0, 0, 0, 12] }, |
| 1431 | ...(g === d.grupos[0] ? [{ text: "Acciones para todo el curso", style: "h2" }] : []), |
| 1432 | { text: g.nombre, style: "h3", margin: [0, 8, 0, 6] }, ficha(a), |
| 1434 | { unbreakable: true, stack: [{ text: a.grupo, style: "h3", margin: [0, 8, 0, 5] }, ficha(a)] }, |
| 1436 | ...((g.estudiante \|\| g.trabajador) ? [{ unbreakable: true, margin: [0, 10, 0, 0], stack: [{ text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)", style: "h3" }, ...datosAcuerdo(g).map((text) => ({ text, margin: [0, 10, 0, 0] })), ...(g.estadoAcuerdo === "Por revisar" ? [{ text: "Por revisar: cambiaste el caso después del acuerdo.", margin: [0, 8, 0, 0] }] : [])] }] : []), |
| 1438 | { id: "fuentes-documento", text: "Fuentes", style: "h2", pageBreak: "before", headlineLevel: 1 }, |
| 1439 | { ol: d.fuentes.map((f) => ({ stack: [{ text: f.cita }, { text: f.url, style: "dato", margin: [0, 2, 0, 8] }] })) }, |
| 1440 | { table: { widths: ["*"], body: [[{ text: d.trabajo ? AVISO_TRABAJO : AVISO, style: "dato", margin: [5, 5, 5, 5] }]] }, layout: fino, margin: [0, 14, 0, 0] }, |
| 1446 | { columns: [{ text: "Prizma · " + d.titulo, width: "*" }, { text: d.fecha, width: 115, alignment: "right" }], fontSize: 8, color: "#555555" }, |
| 1454 | { text: d.trabajo ? PIE_TRABAJO : actual >= primera && actual < fuentes ? "Contiene datos de un estudiante. Guárdalo de forma segura." : "", width: "*" }, |
| 1455 | { text: `Página ${actual} de ${total}`, alignment: "right", width: 95 }, |
| 1485 | boton.disabled = true; aviso.textContent = "Preparando el PDF…"; |
| 1491 | aviso.textContent = "PDF descargado. Búscalo en tu carpeta de descargas."; |
| 1493 | aviso.textContent = "No se pudo crear el PDF. Usa «Imprimir» y elige «Guardar como PDF»."; |
| 1529 | $("#t-privacidad").textContent = estado.ambito === "trabajo" ? "Cuida los datos de las personas trabajadoras" : "Cuida los datos de tus estudiantes"; |
| 1567 | $("#t-guia-apoyos").textContent = esSuperior() ? "¿Qué son los ajustes razonables?" : "¿Qué son los apoyos para un estudiante?"; |
| 1616 | tema.setAttribute("aria-label", texto); tema.title = texto; |
| 1637 | if (!r.ok) throw new Error("necesidades"); |
| 1641 | if (!validas.length && (!Array.isArray(datos) \|\| datos.length)) throw new Error("Necesidades inválidas"); |
| 1645 | const [r, f, n] = await Promise.all([...["data/recomendaciones.json", "data/fuentes.json"].map((u) => fetch(u).then((x) => { if (!x.ok) throw new Error(u); return x.json(); })), cargaNecesidades]); |
| 1649 | $("#inicio-estado").textContent = $("#conteo").textContent = "No se pudo cargar el catálogo. Recarga la página; si abriste el archivo directamente, usa la versión publicada."; |
| 1652 | $("#inicio-estado").textContent = ""; |
| 1671 | if (!window.confirm(trabajo ? "¿Borrar los datos de Trabajo de este navegador? Los datos de Educación se conservan." : "¿Borrar los datos de Educación de este navegador? Los datos de Trabajo se conservan.")) return; |
