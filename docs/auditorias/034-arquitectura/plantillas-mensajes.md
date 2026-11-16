# Plantillas de mensajes y rótulos en app.js

Localizadores del corte auditado. Esto es código literal, no una afirmación de que todos los mensajes se hayan disparado. Incluye errores, confirmaciones, pluralización y estados transitorios; las variantes observadas se registran aparte. No propone cambios.

| Línea | Código original |
| --- | --- |
| 62 | const CIF_TITULO = "Barreras y facilitadores (enfoque CIF)"; |
| 63 | const CIF_AVISO = "Las situaciones describen barreras del entorno, no rasgos del estudiante (CIF, OMS 2001)"; |
| 64 | const CIF_COLUMNAS = ["Situación", "Frecuencia", "Apoyos elegidos para esa situación"]; |
| 67 | const PIE_PRACTICA = "Documento preparado con el estudiante. Contiene solo lo que decidió compartir."; |
| 130 | type: "button", class: "chip", id: `estudiante-${e.id}`, "aria-pressed": String(e.id === estado.estudianteActivo), text: nombreEstudiante(e) + " · " + estadoCaso(e), |
| 137 | $("#quitar-estudiante").textContent = "Quitar a " + nombreEstudiante(estudianteActual()); |
| 149 | if (!window.confirm("Se borran sus datos y apoyos de este navegador. ¿Continuar?")) return; |
| 165 | caja.replaceChildren(el("h3", { text: "Barreras que se repiten en tu curso" }), ...lista.map((b) => { |
| 167 | return el("div", {}, el("p", { text: `${b.nombre}: ${b.cantidad} estudiantes` }), n ? el("button", { |
| 168 | type: "button", class: "boton", id: `barrera-${b.dimension}`, text: estado.necesidades.includes(n.id) ? "Ya lo estás considerando" : "Ver acciones para esto", |
| 245 | $("#agregar-estudiante").textContent = estado.estudiantes.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso"; |
| 246 | $("#agregar-caso-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreEstudiante).join(", ") : estado.estudiantes.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso."; |
| 249 | if (caso) b.textContent = nombreEstudiante(caso) + " · " + estadoCaso(caso); |
| 256 | $("#paso-descripcion-texto").textContent = situaciones ? situaciones + (e.ayuda.trim() ? ". Le ayuda: " + e.ayuda.trim() : "") : "Todavía no guardas una situación."; |
| 258 | $("#paso-acuerdos-texto").textContent = a.fecha ? `${estadoCaso(e)} · ${a.roles.map((r) => ROLES_ACUERDO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) \|\| "Sin indicar"}` : "Todavía no guardas acuerdos."; |
| 260 | $("#iniciales-duplicadas").textContent = repetidas ? `Ya hay un estudiante ${e.iniciales}. Agrega un número para distinguirlos` : ""; |
| 273 | $("#acuerdos-error").textContent = ""; $("#descripcion-error").textContent = ""; |
| 276 | if (!Object.keys(estudianteActual().dimensiones).length) { $("#descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; } |
| 278 | $("#descripcion-error").textContent = ""; abrirPaso("paso-descripcion", false); $("#t-apoyos").focus(); |
| 282 | $("#acuerdos-error").textContent = errores.join(" "); |
| 294 | $("#paso-clase-texto").textContent = detalles.join(" · ") \|\| (estado.propositos.length \|\| estado.perfil.actividad.length \|\| estado.perfil.evidencia.length ? "Guardaste las opciones de tu clase." : "Sin filtros: verás todas las acciones"); |
| 330 | $("#paso-descripcion-toggle").textContent = "1. Describe la situación de " + nombreEstudiante(estudianteActual()); |
| 335 | $("#revision-situaciones-texto").textContent = 'Separamos algunas situaciones: "Visión" y "Audición", y "Comprender" y "Expresarse oralmente". Revisa las situaciones de: ' + pendientes.map(nombreEstudiante).join(", ") + "."; |
| 339 | $("#t-apoyos").textContent = "2. Apoyos sugeridos para " + nombreEstudiante(estudianteActual()); |
| 356 | el("section", {}, el("h3", { text: nombreGrupoPractica(subtipo) }), el("ul", { class: "tarjetas" }, fichasPracticaProfesional(subtipo).map(tarjeta)))) : [])); |
| 358 | $("#centro-ayuda").textContent = elegidasCentro().length ? "El estudiante decide cuáles ajustes compartir." : "Primero elige los ajustes que puede hacer el centro"; |
| 363 | $("#t-estudiante").textContent = superior ? "Ajustes razonables para un estudiante" : "Apoyos individualizados para un estudiante"; |
| 364 | $("#bajada-apoyos").textContent = `Elige los que le sirvan. Prizma no reemplaza ${superior ? "a la unidad de inclusión" : "al equipo de apoyo"}: te ofrece un menú, cada apoyo con su fuente.`; |
| 367 | enlace.textContent = superior ? "¿Cómo acordar ajustes razonables?" : "¿Cómo usar los apoyos individualizados?"; |
| 380 | el("a", { href: "#dua", text: "Revisa las acciones DUA." })))); |
| 386 | ...(primeras.length ? [el("section", { "aria-labelledby": "t-para-empezar" }, el("h3", { id: "t-para-empezar", text: "Para empezar" }), el("ul", { class: "tarjetas" }, primeras.map(tarjeta)))] : []), |
| 390 | el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, resto.filter((r) => r.subtipo === tipo).map(tarjeta))))); |
| 392 | el("h3", { text: "En talleres, laboratorios y terreno" }), el("ul", { class: "tarjetas" }, restoPracticas.map(tarjeta)))); |
| 397 | el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, objetivos.filter((r) => r.subtipo === tipo).map(tarjeta))))); |
| 400 | el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, catalogo.filter((r) => r.tipo === "desregulacion" && r.subtipo === subtipo && aplica(r)).map(tarjeta))))); |
| 401 | $("#apoyos-estado").textContent = Object.keys(estudianteActual().dimensiones).length \|\| practicas.length ? plural(lista.length + practicas.length, "apoyo", "apoyos") : "Marca al menos una situación para ver apoyos."; |
| 427 | const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": `ayuda-d-${d}` }, el("legend", { text: titulo }), el("p", { class: "ayuda", id: `ayuda-d-${d}`, text: ayuda })); |
| 494 | const PIE_TRABAJO = "Contiene datos de una persona trabajadora. Guárdalo con reserva (Código del Trabajo, art. 154 ter)."; |
| 495 | const AVISO_TRABAJO = "Orientación pedagógica y laboral. No reemplaza la evaluación de profesionales ni los protocolos de tu empresa o institución, y no es asesoría legal. Sin diagnósticos: la persona decide qué contar y con quién compartir este acuerdo de ajustes."; |
| 530 | $("#agregar-trabajador").textContent = estado.trabajadores.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso"; |
| 531 | $("#trabajo-agregar-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreTrabajador).join(", ") : estado.trabajadores.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso."; |
| 534 | if (caso) b.textContent = nombreTrabajador(caso) + " · " + estadoCaso(caso, true); |
| 536 | $("#trabajo-descripcion-toggle").textContent = "1. Describe la situación de " + nombreTrabajador(e); |
| 537 | $("#quitar-trabajador").textContent = "Quitar a " + nombreTrabajador(e); |
| 542 | $("#trabajo-descripcion-texto").textContent = [e.tipoPuesto, situaciones, e.ayuda.trim() ? "Le ayuda: " + e.ayuda.trim() : ""].filter(Boolean).join(" · ") \|\| "Todavía no guardas una situación."; |
| 544 | $("#trabajo-acuerdo-texto").textContent = a.fecha ? `${estadoCaso(e, true)} · ${a.roles.map((r) => ROLES_TRABAJO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) \|\| "Sin indicar"}` : "Todavía no guardas acuerdos."; |
| 545 | $("#trabajo-duplicadas").textContent = e.iniciales && estado.trabajadores.some((otro) => otro.id !== e.id && otro.iniciales.toUpperCase() === e.iniciales.toUpperCase()) ? `Ya hay una persona ${e.iniciales}. Agrega un número para distinguirlas` : ""; |
| 551 | const grupo = (titulo, fichas) => el("section", {}, el("h3", { text: titulo }), el("ul", { class: "tarjetas" }, fichas.map((r) => tarjeta(r)))); |
| 563 | "aria-pressed": String(e.id === estado.trabajadorActivo), text: nombreTrabajador(e) + " · " + estadoCaso(e, true), onclick: () => { |
| 578 | const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": ayudaId }, el("legend", { text: DIMENSIONES[d - 1][0] }), el("p", { id: ayudaId, class: "ayuda", text: EJEMPLOS_TRABAJO[d - 1] })); |
| 595 | $("#trabajo-acuerdos-error").textContent = ""; $("#trabajo-descripcion-error").textContent = ""; |
| 606 | if (!Object.keys(e.dimensiones).length) { $("#trabajo-descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; } |
| 607 | e.descripcionGuardada = true; guardar(); pintarTrabajo(); $("#trabajo-descripcion-error").textContent = ""; |
| 612 | const errores = erroresAcuerdo(e, true); $("#trabajo-acuerdos-error").textContent = errores.join(" "); if (errores.length) return; |
| 625 | if (!window.confirm("Se borran sus datos y ajustes de este navegador. ¿Continuar?")) return; |
| 701 | document.querySelectorAll("[data-voc]").forEach((n) => { n.textContent = voc(n.dataset.voc); }); |
| 702 | $("#tab-apoyos").textContent = esSuperior() ? "Ajustes razonables" : "Para un estudiante"; |
| 790 | !f \|\| typeof f.id !== "string" \|\| !f.id.trim() \|\| typeof f.cita !== "string" \|\| !f.cita.trim() \|\| typeof f.url !== "string" \|\| !/^https?:\/\//.test(f.url))) throw new Error("Fuentes inválidas"); |
| 810 | (r.tipo === "practica-profesional" && !Object.hasOwn(TIPOS_PRACTICA, r.subtipo)))) throw new Error("Catálogo inválido"); |
| 844 | if (k === "class") n.className = v; else if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v); |
| 859 | }, text: n.texto, |
| 871 | }, nombreMomento(id, nombre) + " ", el("small", { text: `(${conteo})` }))); |
| 905 | !dua ? el("span", { class: "t-proposito", text: tipoOficial(r) }) : el("span", { class: "t-proposito " + prop }, el("span", { class: "tri", "aria-hidden": "true" }), PROPOSITOS[prop].corto), |
| 907 | dua && destacarMomento ? el("p", { class: "t-momento", text: nombresMomentos()[r.momento] }) : null, |
| 908 | dua && coincidenciasNecesidades(r).length ? el("p", { class: "t-razon", text: "Responde a: " + coincidenciasNecesidades(r).map((n) => n.texto).join("; ") + "." }) : null, |
| 909 | dua && practicaActiva() && esPractica(r) ? el("p", { class: "t-razon", text: "Recomendada porque marcaste: taller, laboratorio o terreno." }) : null, |
| 910 | trabajo && r.dimensiones.length ? el("p", { class: "t-razon", text: "Porque marcaste: " + dimensionesCoincidentes(r, persona).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[persona.dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : null, |
| 911 | acceso ? el("p", { class: "t-razon", text: "Porque marcaste: " + (esPractica(r) ? "actividades prácticas" + (dimensionesCoincidentes(r).length ? "; " : "") : "") + dimensionesCoincidentes(r).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[estudianteActual().dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : dua && coincidencias(r).length ? el("p", { class: "t-razon", text: "Recomendada porque marcaste: " + coincidencias(r).map(etiqueta).join(", ") + "." }) : null, |
| 912 | r.tipo === "objetivos" && r.subtipo === "eliminacion" ? el("strong", { class: "ultimo-recurso", text: "Último recurso" }) : null, |
| 913 | el(dua \|\| trabajo \|\| ["objetivos", "practica-profesional"].includes(r.tipo) ? "h4" : "h3", { text: r.titulo }), |
| 914 | ofrecida ? el("p", { class: "aviso-cruzado", role: "status", text: "Ya está considerado en el DUA: " + version.titulo }) : null, |
| 915 | dua && estudiantesCubiertos(r) ? el("p", { class: "aviso-cruzado", role: "status", text: avisoDua(r) }) : null, |
| 916 | el("ol", {}, r.como.map((p) => el("li", { text: p }))), |
| 917 | version ? el("div", { class: "version-curso", id: "version-" + r.id, tabindex: "-1" }, el("p", { text: "Versión para todo el curso: " + version.titulo }), |
| 918 | preguntar ? el("div", { role: "status" }, el("p", { text: `Este apoyo lo necesitan ${repetida} estudiantes. ¿Quieres agregar su versión a todo el curso?` }), |
| 920 | el("button", { type: "button", class: "boton", id: "curso-" + r.id, text: "Sí, agregar al curso", onclick: () => agregarVersionCurso(r) }), |
| 921 | el("button", { type: "button", class: "boton", id: "individual-" + r.id, text: "No, mantener individual", onclick: () => { |
| 923 | } }))) : el("button", { type: "button", class: "boton", id: "curso-" + r.id, ...(ofrecida ? { disabled: "" } : {}), text: ofrecida ? "Ya está en el curso" : "Agregar al curso", onclick: () => agregarVersionCurso(r) })) : null, |
| 924 | repetida >= 2 && !version ? el("p", { class: "aviso-apoyos", role: "status", text: `Este apoyo lo eligieron ${repetida} estudiantes` }) : null, |
| 925 | el("p", { class: "t-porque" }, el("strong", { text: "Por qué funciona: " }), r.porque), |
| 927 | el("span", { class: "respaldo " + r.respaldo, text: RESPALDO[r.respaldo] }), |
| 929 | el("details", { class: "fuentes" }, el("summary", { text: "Fuentes" }), |
| 930 | el("ul", {}, r.fuentes.map((f) => el("li", {}, el("a", { href: fuentes[f].url, rel: "noopener", target: "_blank", text: fuentes[f].cita })))))); |
| 946 | ...(primeras.length ? [el("section", { "aria-labelledby": "t-dua-empezar" }, el("h3", { id: "t-dua-empezar", text: "Para empezar" }), el("ul", { class: "tarjetas" }, primeras.map((r) => tarjeta(r, true))))] : []), |
| 948 | el("section", { "aria-labelledby": "t-momento-" + id }, el("h3", { id: "t-momento-" + id, text: nombreMomento(id, nombre) }), |
| 950 | $("#conteo").textContent = plural(lista.length, "acción", "acciones"); |
| 971 | aviso.textContent = ""; |
| 972 | requestAnimationFrame(() => { aviso.textContent = "Agregada a tu mochila"; }); |
| 986 | $("#n-sel").textContent = total; |
| 987 | $("#abrir-mochila").setAttribute("aria-label", `Mi mochila: ${plural(total, "elegida", "elegidas")}`); |
| 998 | el("section", {}, el("h3", { text: tituloEstudiante(e) }), el("p", { class: "ayuda", text: subtituloEstudiante() }), |
| 1000 | el("div", {}, el("h4", { text: GRUPOS_APOYOS[tipo] }), el("ol", { class: "sel-lista" }, elegidasOrdenadas(e.seleccion).filter((r) => r.tipo === tipo).map((r) => itemSeleccion(r, e)))))))); |
| 1003 | $("#sel-trabajadores").replaceChildren(...laborales.map((e) => el("section", {}, el("h4", { text: tituloTrabajador(e) }), el("ol", { class: "sel-lista" }, elegidasTrabajo(e).map((r) => itemSeleccion(r, e, "quitar-trabajo-", true)))))); |
| 1007 | const nota = el("textarea", { "data-nota-clave": claveNota, rows: "2", maxlength: "2000", "aria-label": "Nota para: " + r.titulo + (e ? " · " + (trabajo ? nombreTrabajador(e) : nombreEstudiante(e)) : " · Curso"), placeholder: "Nota opcional: cómo la usarás" }); |
| 1016 | return el("li", {}, el("span", { class: "sel-momento", text: e ? tipoOficial(r) : nombreMomento[r.momento] }), |
| 1017 | el("span", { class: "sel-titulo", text: r.titulo }), nota, |
| 1018 | el("button", { type: "button", class: "quitar", id: prefijo + (e ? e.id + "-" : "") + r.id, onclick: () => alternar(r.id, trabajo ? undefined : e?.id, trabajo ? e.id : undefined), text: "Quitar" })); |
| 1065 | $("#respaldo-estado").textContent = "Respaldo descargado. Búscalo en tu carpeta de descargas."; |
| 1070 | if (!objeto(datos) \|\| datos.app !== "prizma" \|\| ![1, 2].includes(datos.version)) throw new Error("Este archivo no es un respaldo de Prizma."); |
| 1074 | throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); |
| 1076 | if (datos.trabajadores !== undefined && (!Array.isArray(datos.trabajadores) \|\| datos.trabajadores.length > 10 \|\| datos.trabajadores.some((e) => !objeto(e) \|\| !seleccion(e.seleccion)))) throw new Error("El archivo no se pudo leer. Revisa los casos de trabajo del respaldo."); |
| 1087 | if (archivo.size > 12 * 1024 * 1024) throw new Error("El archivo es demasiado grande para ser un respaldo de Prizma."); |
| 1090 | catch (e) { throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); } |
| 1092 | if (hayDatos() && !window.confirm(`Esto reemplaza los datos de tu ${voc("clase")}, tu selección y todos tus estudiantes y los casos de trabajo por los del respaldo. ¿Continuar?`)) { |
| 1093 | aviso.textContent = "No se abrió el respaldo. Tus datos siguen igual."; |
| 1099 | aviso.textContent = `Respaldo abierto: ${plural(totalElegidas(), "acción", "acciones")}.` + |
| 1101 | } catch (e) { aviso.textContent = e.message; } |
| 1110 | $("#t-incluir-documento").textContent = "¿Qué personas incluirás en el documento de trabajo?"; |
| 1112 | el("p", { class: "ayuda", text: "La persona decide qué contar. Revisa con ella los datos, las notas y los ajustes antes de compartir el documento." }), |
| 1117 | $("#error-documento").textContent = ""; $("#mochila").close(); $("#incluir-documento").showModal(); $("#t-incluir-documento").focus(); |
| 1134 | const AVISO = "Orientación pedagógica y laboral. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento o empresa. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas."; |
| 1138 | inclusionTrabajo = null; $("#t-incluir-documento").textContent = "¿Qué incluirás en el documento?"; |
| 1149 | $("#error-documento").textContent = ""; |
| 1155 | if (!ids.length) { $("#error-documento").textContent = inclusionTrabajo !== null ? "Elige al menos una persona trabajadora." : "Elige el curso o al menos un estudiante."; return; } |
| 1160 | boton.disabled = true; $("#error-documento").textContent = "Preparando documento…"; |
| 1162 | catch (e) { if (solicitud === solicitudDocumento) { $("#error-documento").textContent = "No se pudo preparar el documento. Reintenta."; boton.disabled = false; } return; } |
| 1166 | armarHoja(); $("#incluir-documento").close(); $("#vista-estado").textContent = ""; $("#vista").showModal(); |
| 1178 | $("#decision-centro-ayuda").textContent = !tiene ? "Marca al menos un ajuste para incluir." : !$("#decision-centro").checked ? "Para ver el documento, el estudiante debe revisarlo y decidir compartirlo." : "Se incluirán solo los ajustes marcados, sin datos personales ni notas."; |
| 1191 | $("#error-centro").textContent = ""; actualizarDecisionCentro(); |
| 1200 | $("#ver-centro").disabled = true; $("#error-centro").textContent = "Preparando documento…"; |
| 1202 | catch (e) { if (solicitud === solicitudDocumento) { $("#error-centro").textContent = "No se pudo preparar el documento. Reintenta."; actualizarDecisionCentro(); } return; } |
| 1206 | $("#vista-estado").textContent = ""; $("#vista").showModal(); $("#cerrar").focus(); |
| 1262 | const tabla = (columnas, filas, clase = "") => el("table", { class: clase }, el("thead", {}, el("tr", {}, columnas.map((t) => el("th", { scope: "col", text: t })))), |
| 1263 | el("tbody", {}, filas.map((fila) => el("tr", {}, fila.map((t, i) => el(i ? "td" : "th", i ? { text: t } : { scope: "row", text: t })))))); |
| 1264 | const ficha = (a) => el("div", { class: "h-accion" }, el("h3", { text: a.titulo }), el("ol", {}, a.como.map((t) => el("li", { text: t }))), |
| 1265 | el("p", {}, el("strong", { text: "Por qué funciona: " }), a.porque), el("p", { class: "h-dato", text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : "") }), |
| 1266 | a.nota ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), a.nota) : null); |
| 1269 | el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })), |
| 1270 | el("h1", { text: d.titulo }), tabla(["Campo", "Completar a mano"], d.resumen, "h-resumen"), |
| 1271 | ...d.acciones.map(ficha), el("div", { class: "h-acuerdos" }, el("h2", { text: "Acuerdos (para completar en la reunión)" }), |
| 1272 | ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => el("p", { text: t + ": __________________________________" }))), |
| 1273 | el("p", { class: "h-aviso", text: PIE_PRACTICA }), el("p", { class: "h-aviso", text: AVISO })); |
| 1277 | el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })), |
| 1278 | el("h1", { text: d.titulo }), tabla(["Resumen", "Información"], d.resumen, "h-resumen"), |
| 1279 | d.curso ? el("h2", { text: "Acciones para todo el curso" }) : null, |
| 1281 | el((g.estudiante \|\| g.trabajador) ? "h2" : "h3", { text: g.nombre }), g.subtitulo ? el("p", { text: g.subtitulo }) : null, |
| 1282 | g.cif ? el("div", {}, el("h3", { text: CIF_TITULO }), el("p", { class: "h-dato", text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO }), |
| 1283 | el("div", { class: "tabla-cif", tabindex: "0", role: "region", "aria-label": CIF_TITULO }, tabla(d.trabajo ? ["Situación", "Frecuencia", "Ajustes elegidos para esa situación"] : CIF_COLUMNAS, g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]], "h-cif")), |
| 1285 | g.reflexion ? el("p", { text: g.reflexion }) : null, |
| 1286 | ...g.acciones.flatMap((a, i) => [(g.estudiante \|\| g.trabajador) && a.grupo !== g.acciones[i - 1]?.grupo ? el("h3", { class: "h-grupo", text: a.grupo }) : null, ficha(a)]), |
| 1287 | (g.estudiante \|\| g.trabajador) ? el("div", { class: "h-acuerdos" }, el("h3", { text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)" }), ...datosAcuerdo(g).map((text) => el("p", { text })), g.estadoAcuerdo === "Por revisar" ? el("p", { text: "Por revisar: cambiaste el caso después del acuerdo." }) : null) : null)), |
| 1288 | el("section", { class: "h-fuentes-seccion" }, el("h2", { text: "Fuentes" }), el("ol", { class: "h-fuentes" }, d.fuentes.map((f) => el("li", {}, f.cita, el("p", { class: "h-dato", text: f.url })))), el("p", { class: "h-aviso", text: d.trabajo ? AVISO_TRABAJO : AVISO }))].filter(Boolean)); |
| 1294 | { text: a.titulo, style: "h3" }, { ol: [...a.como], margin: [0, 4, 0, 4] }, |
| 1295 | { text: [{ text: "Por qué funciona: ", bold: true }, a.porque] }, { text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : ""), style: "dato", margin: [0, 4, 0, 0] }, |
| 1296 | ...(a.nota ? [{ table: { widths: ["*"], body: [[{ text: [{ text: "Mi nota: ", bold: true }, a.nota], fillColor: "#f2f2f2", margin: [5, 5, 5, 5] }]] }, layout: "noBorders", margin: [0, 5, 0, 0] }] : []), |
| 1299 | { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] }, |
| 1300 | { text: d.titulo, style: "h1" }, |
| 1301 | { table: { widths: [150, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: fino, margin: [0, 12, 0, 18] }, |
| 1303 | { unbreakable: true, stack: [{ text: "Acuerdos (para completar en la reunión)", style: "h2" }, ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => ({ text: t + ": __________________________________________________", margin: [0, 12, 0, 0] }))] }, |
| 1304 | { text: PIE_PRACTICA, style: "dato", margin: [0, 18, 0, 0] }, |
| 1305 | { text: AVISO, style: "dato", margin: [0, 14, 0, 0] }, |
| 1307 | { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] }, |
| 1308 | { text: d.titulo, style: "h1" }, |
| 1309 | { table: { widths: [110, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: { ...fino, vLineWidth: () => 0, hLineWidth: () => .3 }, margin: [0, 8, 0, 14] }, |
| 1310 | ...(d.curso && !d.grupos.some((g) => !(g.estudiante \|\| g.trabajador)) ? [{ text: "Acciones para todo el curso", style: "h2", headlineLevel: 1 }] : []), |
| 1312 | ...(g.reflexion ? [{ unbreakable: true, stack: [{ text: g.nombre, style: "h3" }, { text: g.reflexion, margin: [0, 5, 0, 12] }] }] : []), |
| 1313 | ...((g.estudiante \|\| g.trabajador) ? [{ id: "alumno-" + (g.estudiante \|\| g.trabajador), text: g.nombre, style: "h2", headlineLevel: 1, pageBreak: "before", margin: [0, 8, 0, 6] }] : []), |
| 1315 | { text: g.subtitulo, italics: true, margin: [0, 0, 0, 8] }, |
| 1316 | { text: CIF_TITULO, style: "h3", headlineLevel: 2 }, { text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO, style: "dato", margin: [0, 3, 0, 5] }, |
| 1318 | { table: { widths: [125, "*"], body: [[{ text: "Le ayuda", bold: true }, g.ayuda], [{ text: d.trabajo ? "Qué dice la persona" : "Qué dicen el estudiante y su familia", bold: true }, g.voz]] }, layout: fino, margin: [0, 0, 0, 12] }, |
| 1321 | ...(g === d.grupos[0] ? [{ text: "Acciones para todo el curso", style: "h2" }] : []), |
| 1322 | { text: g.nombre, style: "h3", margin: [0, 8, 0, 6] }, ficha(a), |
| 1324 | { unbreakable: true, stack: [{ text: a.grupo, style: "h3", margin: [0, 8, 0, 5] }, ficha(a)] }, |
| 1326 | ...((g.estudiante \|\| g.trabajador) ? [{ unbreakable: true, margin: [0, 10, 0, 0], stack: [{ text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)", style: "h3" }, ...datosAcuerdo(g).map((text) => ({ text, margin: [0, 10, 0, 0] })), ...(g.estadoAcuerdo === "Por revisar" ? [{ text: "Por revisar: cambiaste el caso después del acuerdo.", margin: [0, 8, 0, 0] }] : [])] }] : []), |
| 1328 | { id: "fuentes-documento", text: "Fuentes", style: "h2", pageBreak: "before", headlineLevel: 1 }, |
| 1329 | { ol: d.fuentes.map((f) => ({ stack: [{ text: f.cita }, { text: f.url, style: "dato", margin: [0, 2, 0, 8] }] })) }, |
| 1330 | { table: { widths: ["*"], body: [[{ text: d.trabajo ? AVISO_TRABAJO : AVISO, style: "dato", margin: [5, 5, 5, 5] }]] }, layout: fino, margin: [0, 14, 0, 0] }, |
| 1336 | { columns: [{ text: "Prizma · " + d.titulo, width: "*" }, { text: d.fecha, width: 115, alignment: "right" }], fontSize: 8, color: "#555555" }, |
| 1344 | { text: d.trabajo ? PIE_TRABAJO : actual >= primera && actual < fuentes ? "Contiene datos de un estudiante. Guárdalo de forma segura." : "", width: "*" }, |
| 1345 | { text: `Página ${actual} de ${total}`, alignment: "right", width: 95 }, |
| 1375 | boton.disabled = true; aviso.textContent = "Preparando el PDF…"; |
| 1381 | aviso.textContent = "PDF descargado. Búscalo en tu carpeta de descargas."; |
| 1383 | aviso.textContent = "No se pudo crear el PDF. Usa «Imprimir» y elige «Guardar como PDF»."; |
| 1436 | $("#t-guia-apoyos").textContent = esSuperior() ? "Cómo acordar ajustes razonables" : "Cómo usar los apoyos individualizados"; |
| 1484 | tema.setAttribute("aria-label", texto); tema.title = texto; |
| 1494 | if (!r.ok) throw new Error("necesidades"); |
| 1498 | if (!validas.length && (!Array.isArray(datos) \|\| datos.length)) throw new Error("Necesidades inválidas"); |
| 1502 | const [r, f, n] = await Promise.all([...["data/recomendaciones.json", "data/fuentes.json"].map((u) => fetch(u).then((x) => { if (!x.ok) throw new Error(u); return x.json(); })), cargaNecesidades]); |
| 1506 | $("#conteo").textContent = "No se pudo cargar el catálogo. Recarga la página; si abriste el archivo directamente, usa la versión publicada."; |
| 1525 | if (!window.confirm(`¿Borrar tu ${voc("clase")}, tu selección, tus notas y los datos de todos los estudiantes y personas trabajadoras de este navegador?`)) return; |
