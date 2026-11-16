"use strict";
// Prizma, etapa 1: menú de acciones DUA para todo el curso. Sin servidor: los datos quedan en localStorage.
const CLAVE = "prizma.v1";
const CLAVE_PRIVACIDAD = "prizma.privacidad.v1";
const VERSION_CATALOGO = "2026-11-15";

const MOMENTOS = [
  ["antes", "Antes"], ["durante", "Durante"], ["despues", "Después"], ["toda-la-clase", "En toda la clase"],
];
const PROPOSITOS = {
  motivar: { nombre: "Motivar y sostener el interés", corto: "Motivar", principio: "Compromiso", directrices: ["7", "8", "9"] },
  presentar: { nombre: "Presentar la información", corto: "Presentar", principio: "Representación", directrices: ["1", "2", "3"] },
  mostrar: { nombre: "Expresarse y organizarse", corto: "Expresarse y organizarse", principio: "Acción y expresión", directrices: ["4", "5", "6"] },
};
const RESPALDO = {
  "investigacion-solida": "Investigación sólida",
  "investigacion-moderada": "Investigación moderada",
  "consenso-expertos": "Consenso de expertos",
  "orientacion-oficial": "Orientación oficial",
  "norma-legal": "Norma legal",
};
// Títulos oficiales en español de las consideraciones DUA 3.0 (CAST, 2024), citados como referencia.
const CONSIDERACIONES = {
  "1.1": "Apoyar las oportunidades para personalizar la presentación de información", "1.2": "Apoyar múltiples formas de percibir información", "1.3": "Representar una diversidad de perspectivas e identidades de maneras auténticas",
  "2.1": "Aclarar vocabulario, símbolos y estructuras del lenguaje", "2.2": "Apoyar la decodificación de texto, notación matemática y símbolos", "2.3": "Cultivar la comprensión y el respeto entre lenguas y dialectos", "2.4": "Abordar los sesgos en el uso del lenguaje y los símbolos", "2.5": "Ilustrar a través de múltiples medios",
  "3.1": "Conectar el conocimiento previo con el nuevo aprendizaje", "3.2": "Resaltar y explorar patrones, características críticas, grandes ideas y relaciones", "3.3": "Cultivar múltiples formas de conocer y dar significado", "3.4": "Maximizar la transferencia y la generalización",
  "4.1": "Variar y valorar los métodos de respuesta, navegación y movimiento", "4.2": "Optimizar el acceso a materiales accesibles y a tecnologías y herramientas de asistencia y accesibilidad",
  "5.1": "Usar múltiples medios para la comunicación", "5.2": "Usar múltiples herramientas para la construcción, la composición y la creatividad", "5.3": "Desarrollar fluidez con apoyos graduados para la práctica y el desempeño", "5.4": "Abordar sesgos relacionados con los modos de expresión y comunicación",
  "6.1": "Establecer metas significativas", "6.2": "Anticipar y planificar los desafíos", "6.3": "Organizar la información y los recursos", "6.4": "Ampliar la capacidad para dar seguimiento al progreso", "6.5": "Desafiar las prácticas excluyentes",
  "7.1": "Optimizar la elección y la autonomía", "7.2": "Optimizar la relevancia, el valor y la autenticidad", "7.3": "Fomentar la alegría y el juego", "7.4": "Abordar los sesgos, las amenazas y las distracciones",
  "8.1": "Aclarar el significado y el propósito de las metas", "8.2": "Optimizar los desafíos y el apoyo", "8.3": "Fomentar la colaboración, la interdependencia y el aprendizaje colectivo", "8.4": "Fomentar la pertenencia y la comunidad", "8.5": "Ofrecer retroalimentación orientada a la acción",
  "9.1": "Reconocer expectativas, creencias y motivaciones", "9.2": "Desarrollar la conciencia de sí mismo y de los demás", "9.3": "Promover la reflexión individual y colectiva", "9.4": "Cultivar la empatía y las prácticas restaurativas",
};
const NIVELES = { parvularia: "Educación parvularia", basica: "Educación básica", media: "Educación media (CH y TP)", superior: "Educación superior (universidad, IP o CFT)" };

const AREAS = [
  ["Cognición y aprendizaje", [1, 2, 14]], ["Comunicación e interacción", [3, 12, 4]],
  ["Social, emocional y salud mental", [5]], ["Sensorial y física", [6, 13, 7, 8, 9]],
  ["Contexto e identidad", [10, 11]],
];
const DIMENSIONES = [
  ["Atención y organización", "instrucciones largas, tareas con muchos pasos, empezar una tarea, cambios de actividad"],
  ["Lectura, escritura y cálculo", "textos largos, copiar de la pizarra, escribir a mano, cálculo mental"],
  ["Comprender lo que se dice o se lee", "instrucciones largas o solo orales, lenguaje figurado, vocabulario nuevo"],
  ["Interacción social", "trabajo en grupo, normas que no se dicen, exponer en público"],
  ["Emociones y regulación", "evaluaciones, imprevistos, frustración, desregulación"],
  ["Visión", "ver la pizarra, leer letra pequeña, imágenes y gráficos"],
  ["Sensibilidad sensorial", "ruido, luz, multitudes, texturas, olores"],
  ["Movimiento y motricidad", "escribir, manipular materiales, desplazarse"],
  ["Salud y energía", "fatiga, dolor, ausencias por tratamiento"],
  ["Identidad, lengua y pertenencia", "otra lengua materna, pueblo originario, migración, sentirse parte del curso"],
  ["Espacio, tiempo y actitudes", "sala, tiempos, materiales, tecnología, actitudes de compañeros o adultos, apoyo en casa"],
  // 12 a 14 se agregaron después: los números no se reordenan para no romper datos guardados.
  ["Expresarse oralmente", "responder en voz alta, explicar con palabras, hablar frente a otros"],
  ["Audición", "escuchar al docente, escuchar con ruido, videos sin subtítulos"],
  ["Necesita más desafío", "termina antes, se aburre con la práctica repetida, pide ir más allá"],
];
const FRECUENCIAS = ["No aplica", "A veces", "Seguido", "Casi siempre"];
const TIPOS_ACCESO = { presentacion: "Presentación de la información", respuesta: "Formas de respuesta", entorno: "Entorno", tiempo: "Organización del tiempo y el horario" };
const TIPOS_OBJETIVOS = { graduacion: "Graduación de la complejidad", priorizacion: "Priorización", temporalizacion: "Temporalización", enriquecimiento: "Enriquecimiento", eliminacion: "Eliminación" };
const ASIGNATURAS = ["", "lenguaje", "matematica", "ciencias", "historia"];
const CIF_TITULO = "Barreras y facilitadores (enfoque CIF)";
const CIF_AVISO = "Las situaciones describen barreras del entorno, no rasgos del estudiante (CIF, OMS 2001)";
const CIF_COLUMNAS = ["Situación", "Frecuencia", "Apoyos elegidos para esa situación"];
const MOMENTOS_DEC = { antes: "Antes: prevenir", durante: "Durante: acompañar", despues: "Después: reparar" };
const GRUPOS_APOYOS = { acceso: "Adecuaciones de acceso", objetivos: "Adecuaciones en los objetivos", desregulacion: "Apoyos ante desregulación", adicional: "Apoyos adicionales" };
function normalizarEstudiante(valor) {
  const e = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  const dimensiones = e.dimensiones && typeof e.dimensiones === "object" && !Array.isArray(e.dimensiones) ? e.dimensiones : {};
  return {
    iniciales: typeof e.iniciales === "string" && /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{1,4}$/.test(e.iniciales) ? e.iniciales : "",
    dimensiones: Object.fromEntries(Object.entries(dimensiones).filter(([k, v]) => /^(?:[1-9]|1[0-4])$/.test(k) && Number.isInteger(v) && v >= 1 && v <= 3)),
    ayuda: typeof e.ayuda === "string" ? e.ayuda.slice(0, 300) : "",
    voz: typeof e.voz === "string" ? e.voz.slice(0, 300) : "",
  };
}
let secuenciaEstudiante = 0;
function nuevoIdEstudiante() { return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `estudiante-${++secuenciaEstudiante}`; }
function estudianteActual() { return estado.estudiantes.find((e) => e.id === estado.estudianteActivo) || estado.estudiantes[0]; }
function nombreEstudiante(e) { return e.iniciales || `Estudiante ${estado.estudiantes.indexOf(e) + 1}`; }
function datosEstudiante(e) { return Boolean(e.iniciales || e.ayuda || e.voz || Object.keys(e.dimensiones).length || Object.keys(e.seleccion).length); }
function seleccionValidada(valor, dua) {
  const v = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  return Object.fromEntries(Object.entries(v).filter(([id, nota]) => typeof nota === "string" && catalogo.some((r) => r.id === id && (dua ? r.tipo === "dua" : r.tipo in GRUPOS_APOYOS))).map(([id, nota]) => [id, nota.slice(0, 2000)]));
}
function normalizarDatos(datos) {
  const g = datos && typeof datos === "object" && !Array.isArray(datos) ? datos : {};
  const actuales = Array.isArray(g.estudiantes);
  const lista = actuales ? g.estudiantes.slice(0, 10) : [{ ...normalizarEstudiante(g.estudiante), seleccion: g.seleccion }];
  const ids = new Set();
  const estudiantes = (lista.length ? lista : [{}]).map((e) => {
    let id = typeof e?.id === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(e.id) && !ids.has(e.id) ? e.id : nuevoIdEstudiante();
    while (ids.has(id)) id = nuevoIdEstudiante();
    ids.add(id);
    return { id, ...normalizarEstudiante(e), seleccion: seleccionValidada(e?.seleccion, false) };
  });
  return {
    perfil: normalizarPerfil(g.perfil, g.estudiante?.practica), seleccion: seleccionValidada(g.seleccion, true), estudiantes,
    estudianteActivo: estudiantes.some((e) => e.id === g.estudianteActivo) ? g.estudianteActivo : estudiantes[0].id,
    necesidades: normalizarNecesidades(g.necesidades), momentos: normalizarMomentos(g.momentos), asignatura: normalizarAsignatura(g.asignatura),
    propositos: Array.isArray(g.propositos) ? [...new Set(g.propositos.filter((p) => Object.hasOwn(PROPOSITOS, p)))] : [],
    pestana: g.pestana === "apoyos" ? "apoyos" : "dua",
  };
}
function pintarSelectorEstudiantes() {
  $("#lista-estudiantes").replaceChildren(...estado.estudiantes.map((e) => el("button", {
    type: "button", class: "chip", id: `estudiante-${e.id}`, "aria-pressed": String(e.id === estado.estudianteActivo), text: nombreEstudiante(e),
    onclick: () => {
      estado.estudianteActivo = e.id; guardar(); sincronizarEstudiante(); pintarSeleccion(); actualizarConteoFiltros();
      document.getElementById(`estudiante-${e.id}`).focus();
    },
  })));
  $("#agregar-estudiante").disabled = estado.estudiantes.length >= 10;
  $("#agregar-estudiante").textContent = estado.estudiantes.length >= 10 ? "Máximo 10 estudiantes" : "+ Agregar estudiante";
  $("#quitar-estudiante").textContent = "Quitar a " + nombreEstudiante(estudianteActual());
}
function agregarEstudiante() {
  if (estado.estudiantes.length >= 10) return;
  let id = nuevoIdEstudiante();
  while (estado.estudiantes.some((e) => e.id === id)) id = nuevoIdEstudiante();
  const e = { id, ...normalizarEstudiante(), seleccion: {} };
  estado.estudiantes.push(e); estado.estudianteActivo = e.id;
  guardar(); sincronizarEstudiante(); pintarSeleccion(); actualizarConteoFiltros();
  document.getElementById(`estudiante-${e.id}`).focus();
}
function quitarEstudiante() {
  if (!window.confirm("Se borran sus datos y apoyos de este navegador. ¿Continuar?")) return;
  const indice = estado.estudiantes.findIndex((e) => e.id === estado.estudianteActivo);
  estado.estudiantes.splice(indice, 1);
  if (!estado.estudiantes.length) estado.estudiantes.push({ id: nuevoIdEstudiante(), ...normalizarEstudiante(), seleccion: {} });
  estado.estudianteActivo = estado.estudiantes[Math.min(indice, estado.estudiantes.length - 1)].id;
  guardar(); sincronizarEstudiante(); pintarSeleccion(); pintarTarjetas(); actualizarConteoFiltros();
  document.getElementById(`estudiante-${estado.estudianteActivo}`).focus();
}
function versionCurso(r) { return r.dua ? catalogo.find((a) => a.tipo === "dua" && a.consideracion === r.dua && aplica(a)) : null; }
function barrerasRepetidas() {
  return DIMENSIONES.map(([nombre], i) => ({ dimension: i + 1, nombre, cantidad: estado.estudiantes.filter((e) => e.dimensiones[i + 1]).length }))
    .filter((b) => b.cantidad >= 2);
}
function pintarRepeticiones() {
  const lista = barrerasRepetidas(), caja = $("#barreras-repetidas");
  caja.hidden = !lista.length;
  caja.replaceChildren(el("h3", { text: "Barreras que se repiten en tu curso" }), ...lista.map((b) => {
    const n = necesidades.find((n) => n.dimensiones?.includes(b.dimension));
    return el("div", {}, el("p", { text: `${b.nombre}: ${b.cantidad} estudiantes` }), n ? el("button", {
      type: "button", class: "boton", id: `barrera-${b.dimension}`, text: estado.necesidades.includes(n.id) ? "Ya lo estás considerando" : "Ver acciones para esto",
      "aria-pressed": String(estado.necesidades.includes(n.id)),
      onclick: () => {
        if (!estado.necesidades.includes(n.id)) estado.necesidades.push(n.id);
        guardar(); pintarControles(); pintarTarjetas(); actualizarRespaldo();
        document.getElementById(`barrera-${b.dimension}`).focus();
      },
    }) : null);
  }));
}

function esSuperior() { return estado.perfil.nivel === "superior"; }
function subtituloEstudiante() { return esSuperior() ? "Propuesta para acordar con el estudiante y la unidad de inclusión" : "Propuesta para conversar con el equipo de apoyo"; }
function tituloEstudiante(e = estudianteActual()) { return (esSuperior() ? "Ajustes razonables para " : "Apoyos para ") + (e.iniciales || "un estudiante"); }
function tipoOficial(r) {
  if (esSuperior() && ["acceso", "adicional"].includes(r.tipo)) return `Ajuste razonable: ${TIPOS_ACCESO[r.subtipo] || "Apoyo adicional"}`;
  if (r.tipo === "adicional") return "Apoyo adicional";
  if (r.tipo === "acceso") return `Adecuación de acceso: ${TIPOS_ACCESO[r.subtipo]} (Decreto 83)`;
  if (r.tipo === "objetivos") return `Adecuación en los objetivos: ${TIPOS_OBJETIVOS[r.subtipo]} (Decreto 83)`;
  return `Apoyo ante desregulación: ${MOMENTOS_DEC[r.subtipo]}`;
}
function ordenApoyo(r) {
  if (r.tipo === "adicional") return -1;
  const subtipos = r.tipo === "acceso" ? TIPOS_ACCESO : r.tipo === "objetivos" ? TIPOS_OBJETIVOS : MOMENTOS_DEC;
  return Object.keys(GRUPOS_APOYOS).indexOf(r.tipo) * 10 + Object.keys(subtipos).indexOf(r.subtipo);
}
function objetivosVisibles() {
  return catalogo.filter((r) => r.tipo === "objetivos" && aplica(r) && (!estado.asignatura || !r.asignatura || r.asignatura === estado.asignatura))
    .sort((a, b) => ordenApoyo(a) - ordenApoyo(b) || Number(Object.hasOwn(a, "asignatura")) - Number(Object.hasOwn(b, "asignatura")));
}
function dimensionesCoincidentes(r) { return r.dimensiones.filter((d) => estudianteActual().dimensiones[d]); }
function puntaje(r) { return dimensionesCoincidentes(r).reduce((suma, d) => suma + estudianteActual().dimensiones[d], 0); }
function esPractica(r) { return r.contextos.includes("practica"); }
function hayPracticas() { return catalogo.some((r) => r.tipo === "acceso" && aplica(r) && esPractica(r)); }
function practicaActiva() { return estado.perfil.practica && hayPracticas(); }
function practicasVisibles() {
  return estado.perfil.practica ? catalogo.filter((r) => r.tipo === "acceso" && aplica(r) && esPractica(r)).sort((a, b) => puntaje(b) - puntaje(a)) : [];
}
function accesosVisibles() { return catalogo.filter((r) => r.tipo === "acceso" && aplica(r) && !esPractica(r) && puntaje(r)).sort((a, b) => puntaje(b) - puntaje(a)); }
function situacionesSinApoyos() {
  return Object.keys(estudianteActual().dimensiones).map(Number).filter((d) =>
    !catalogo.some((r) => r.tipo === "acceso" && aplica(r) && (!esPractica(r) || estado.perfil.practica) && r.dimensiones.includes(d)));
}
function pintarTituloApoyos() {
  $("#t-apoyos").textContent = `${esSuperior() ? "Ajustes razonables" : "Apoyos"} para ${estudianteActual().iniciales || "un estudiante"}`;
}
function pintarApoyos() {
  const superior = esSuperior();
  $("#t-estudiante").textContent = superior ? "Ajustes razonables para un estudiante" : "Apoyos individualizados para un estudiante";
  $("#bajada-apoyos").textContent = `Elige los que le sirvan. Prizma no reemplaza ${superior ? "a la unidad de inclusión" : "al equipo de apoyo"}: te ofrece un menú, cada apoyo con su fuente.`;
  pintarTituloApoyos();
  document.querySelectorAll(".enlace-guia-apoyos").forEach((enlace) => {
    enlace.textContent = superior ? "¿Cómo acordar ajustes razonables?" : "¿Cómo usar los apoyos individualizados?";
  });
  $("#aviso-acceso-escolar").hidden = superior;
  $("#aviso-acceso-superior").hidden = !superior;
  $("#objetivos-aviso").hidden = superior;
  $("#objetivos-superior").hidden = !superior;
  $("#desregulacion").hidden = superior;
  $("#crisis-superior").hidden = !superior;
  const adicionales = catalogo.filter((r) => r.tipo === "adicional" && aplica(r));
  $("#apoyos-adicionales").hidden = !adicionales.length;
  $("#apoyos-adicionales").replaceChildren(...adicionales.map(tarjeta));
  $("#apoyos-sin-fichas").replaceChildren(...situacionesSinApoyos().map((d) =>
    el("p", { class: "aviso-apoyos" }, `Aún no hay apoyos para "${DIMENSIONES[d - 1][0]}" en este nivel. `,
      el("a", { href: "#dua", text: "Revisa las acciones DUA." }))));
  const lista = accesosVisibles(), practicas = practicasVisibles();
  $("#apoyos-resultados").replaceChildren(...Object.entries(TIPOS_ACCESO).filter(([tipo]) => lista.some((r) => r.subtipo === tipo)).map(([tipo, nombre]) =>
    el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, lista.filter((r) => r.subtipo === tipo).map(tarjeta)))));
  if (practicas.length) $("#apoyos-resultados").append(el("section", {},
    el("h3", { text: "En talleres, laboratorios y terreno" }), el("ul", { class: "tarjetas" }, practicas.map(tarjeta))));
  const objetivos = objetivosVisibles();
  $("#asignatura-campo").hidden = !catalogo.some((r) => r.tipo === "objetivos" && aplica(r));
  $("#asignatura").value = estado.asignatura;
  $("#objetivos-tarjetas").replaceChildren(...Object.entries(TIPOS_OBJETIVOS).filter(([tipo]) => objetivos.some((r) => r.subtipo === tipo)).map(([tipo, nombre]) =>
    el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, objetivos.filter((r) => r.subtipo === tipo).map(tarjeta)))));
  $("#objetivos-parvularia").hidden = estado.perfil.nivel !== "parvularia";
  $("#desregulacion-resultados").replaceChildren(...Object.entries(MOMENTOS_DEC).map(([subtipo, nombre]) =>
    el("section", {}, el("h3", { text: nombre }), el("ul", { class: "tarjetas" }, catalogo.filter((r) => r.tipo === "desregulacion" && r.subtipo === subtipo && aplica(r)).map(tarjeta)))));
  $("#apoyos-estado").textContent = Object.keys(estudianteActual().dimensiones).length || practicas.length ? plural(lista.length + practicas.length, "apoyo", "apoyos") : "Marca al menos una situación para ver apoyos.";
}
function sincronizarEstudiante() {
  pintarSelectorEstudiantes();
  $("#iniciales").value = estudianteActual().iniciales;
  $("#estudiante-ayuda").value = estudianteActual().ayuda;
  $("#estudiante-voz").value = estudianteActual().voz;
  const areas = $("#areas"); areas.replaceChildren();
  const dimensiones = $("#dimensiones"); dimensiones.replaceChildren();
  AREAS.forEach(([nombre, ids], i) => {
    const grupo = el("div");
    const casilla = el("input", { type: "checkbox", id: `area-${i}`, "aria-controls": `dim-area-${i}` });
    casilla.checked = ids.some((d) => estudianteActual().dimensiones[d]);
    grupo.id = `dim-area-${i}`; grupo.hidden = !casilla.checked;
    casilla.addEventListener("change", () => {
      grupo.hidden = !casilla.checked;
      if (!casilla.checked) {
        ids.forEach((d) => { delete estudianteActual().dimensiones[d]; grupo.querySelector(`input[name="dimension-${d}"][value="0"]`).checked = true; });
        guardar(); pintarApoyos(); pintarRepeticiones(); actualizarRespaldo();
      }
      actualizarConteoFiltros();
    });
    areas.append(el("label", {}, casilla, nombre));
    ids.forEach((d) => {
      const [titulo, ayuda] = DIMENSIONES[d - 1];
      const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": `ayuda-d-${d}` }, el("legend", { text: titulo }), el("p", { class: "ayuda", id: `ayuda-d-${d}`, text: ayuda }));
      FRECUENCIAS.forEach((texto, valor) => {
        const radio = el("input", { type: "radio", name: `dimension-${d}`, value: valor });
        radio.checked = (estudianteActual().dimensiones[d] || 0) === valor;
        radio.addEventListener("change", () => {
          if (valor) estudianteActual().dimensiones[d] = valor; else delete estudianteActual().dimensiones[d];
          guardar(); pintarApoyos(); pintarRepeticiones(); actualizarRespaldo(); actualizarConteoFiltros();
        });
        campo.append(el("label", {}, radio, texto));
      });
      grupo.append(campo);
    });
    dimensiones.append(grupo);
  });
  pintarApoyos();
}
function escucharEstudiante() {
  $("#agregar-estudiante").addEventListener("click", agregarEstudiante);
  $("#quitar-estudiante").addEventListener("click", quitarEstudiante);
  $("#asignatura").addEventListener("change", (evento) => {
    estado.asignatura = normalizarAsignatura(evento.target.value);
    guardar(); pintarApoyos(); pintarRepeticiones(); actualizarRespaldo();
  });
  for (const [id, clave] of [["iniciales", "iniciales"], ["estudiante-ayuda", "ayuda"], ["estudiante-voz", "voz"]]) {
    $("#" + id).addEventListener("input", (evento) => {
      const campo = evento.target, escribio = Boolean(campo.value);
      estudianteActual()[clave] = normalizarEstudiante({ ...estudianteActual(), [clave]: campo.value })[clave];
      campo.value = estudianteActual()[clave];
      guardar(); pintarTituloApoyos(); pintarSelectorEstudiantes(); pintarSeleccion(); actualizarConteoFiltros();
      if (!privacidadAvisada && escribio) mostrarAvisoPrivacidad(campo);
    });
  }
}

const $ = (s) => document.querySelector(s);
const proposito = (r) => Object.keys(PROPOSITOS).find((k) => PROPOSITOS[k].directrices.includes(r.consideracion.split(".")[0]));

let catalogo = [], fuentes = {}, necesidades = [];
let privacidadAvisada = false, origenAvisoPrivacidad = null;
let origenGuiaDUA = null, privacidadPendiente = false;
let origenGuiaApoyos = null, dialogoPrivacidad = null;
const estudianteInicial = { id: nuevoIdEstudiante(), ...normalizarEstudiante(), seleccion: {} };
let estado = { asignatura: "", pestana: "dua", perfil: { nivel: "", practica: false, actividad: [], evidencia: [], meta: "" }, momentos: [], propositos: [], necesidades: [], seleccion: {}, estudiantes: [estudianteInicial], estudianteActivo: estudianteInicial.id };
let inclusionDocumento = null, solicitudDocumento = 0;

function cargar() {
  try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g) estado = normalizarDatos(g); } catch (e) { /* sin almacenamiento: la página funciona igual */ }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* idem */ }
}

function normalizarAsignatura(valor) { return ASIGNATURAS.includes(valor) ? valor : ""; }

function normalizarMomentos(valor) {
  return Array.isArray(valor) ? [...new Set(valor.filter((id) => MOMENTOS.some(([momento]) => momento === id)))] : [];
}

function normalizarPerfil(perfil, practicaAnterior = false) {
  const p = perfil && typeof perfil === "object" && !Array.isArray(perfil) ? perfil : {};
  const lista = (nombre) => {
    const valores = [...document.querySelectorAll(`input[name="${nombre}"]`)].map((c) => c.value);
    return Array.isArray(p[nombre]) ? [...new Set(p[nombre].filter((v) => valores.includes(v)))] : [];
  };
  const nivel = ["media-ch", "media-tp"].includes(p.nivel) ? "media" : p.nivel;
  return {
    nivel: typeof nivel === "string" && [...$("#nivel").options].some((o) => o.value === nivel) ? nivel : "",
    practica: Object.hasOwn(p, "practica") ? p.practica === true : practicaAnterior === true,
    actividad: lista("actividad"), evidencia: lista("evidencia"),
    meta: typeof p.meta === "string" ? p.meta.slice(0, 500) : "",
  };
}

function voc(clave) {
  const palabras = { clase: "experiencia de aprendizaje", curso: "grupo", estudiantes: "niños y niñas" };
  return estado.perfil.nivel === "parvularia" ? palabras[clave] : clave;
}

function aplicarVocabulario() {
  document.querySelectorAll("[data-voc]").forEach((n) => { n.textContent = voc(n.dataset.voc); });
  $("#tab-apoyos").textContent = esSuperior() ? "Ajustes razonables" : "Apoyos individualizados";
}

function mostrarPestana(id, enfocar = false) {
  if (id !== estado.pestana && $("#filtros-dialogo").open) cerrarFiltros(false);
  estado.pestana = id;
  for (const nombre of ["dua", "apoyos"]) {
    $("#panel-" + nombre).hidden = nombre !== id;
    const tab = $("#tab-" + nombre);
    tab.setAttribute("aria-selected", String(nombre === id));
    tab.tabIndex = nombre === id ? 0 : -1;
  }
  $("#panel-" + id + " .acciones-intro").append($("#abrir-filtros"));
  guardar(); actualizarConteoFiltros();
  if (enfocar) $("#tab-" + id).focus();
}

function prepararPestanas() {
  const desdeHash = (enfocar) => {
    const id = ["#dua", "#apoyos"].includes(location.hash) ? location.hash.slice(1) :
      !location.hash && ["dua", "apoyos"].includes(estado.pestana) ? estado.pestana : "dua";
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    mostrarPestana(id, enfocar);
  };
  for (const [indice, id] of ["dua", "apoyos"].entries()) {
    const tab = $("#tab-" + id);
    const activar = (nombre) => {
      if (location.hash === "#" + nombre) mostrarPestana(nombre, true);
      else location.hash = nombre;
    };
    tab.addEventListener("click", () => activar(id));
    tab.addEventListener("keydown", (evento) => {
      const siguiente = { ArrowRight: 1 - indice, ArrowLeft: 1 - indice, Home: 0, End: 1 }[evento.key];
      if (siguiente === undefined) return;
      evento.preventDefault(); activar(["dua", "apoyos"][siguiente]);
    });
  }
  window.addEventListener("hashchange", () => desdeHash(true));
  $(".saltar").addEventListener("click", (evento) => {
    evento.preventDefault(); $("#panel-" + estado.pestana).focus();
  });
  delete estado.paso;
  desdeHash(false);
  $("#abrir-mochila").addEventListener("click", () => $("#mochila").showModal());
  $("#cerrar-mochila").addEventListener("click", () => $("#mochila").close());
  $("#mochila").addEventListener("close", () => $("#abrir-mochila").focus());
}

function cantidadFiltros() {
  if (estado.pestana === "apoyos") return document.querySelectorAll("#areas input:checked").length +
    Object.keys(estudianteActual().dimensiones).length + Number(Boolean(estudianteActual().iniciales)) + Number(Boolean(estudianteActual().ayuda.trim())) + Number(Boolean(estudianteActual().voz.trim()));
  const p = estado.perfil;
  return (Array.isArray(estado.necesidades) ? estado.necesidades.length : 0) + estado.propositos.length + p.actividad.length + p.evidencia.length +
    Number(Boolean(p.meta.trim())) + estado.momentos.length;
}

function actualizarConteoFiltros() {
  $("#abrir-filtros").textContent = `Filtros (${cantidadFiltros()})`;
}

function limpiarFiltros() {
  estado.necesidades = []; estado.propositos = []; estado.momentos = [];
  estado.perfil = { ...estado.perfil, meta: "", actividad: [], evidencia: [] };
  guardar(); sincronizarPerfil(); pintarControles(); pintarTarjetas(); actualizarRespaldo();
}

let devolverFocoFiltros = true;
function devolverFiltros() {
  const filtro = $("#filtros-dialogo-cuerpo .filtros");
  if (filtro) $("#lugar-" + filtro.id).append(filtro);
}
function cerrarFiltros(enfocar = true) {
  devolverFocoFiltros = enfocar;
  devolverFiltros(); $("#filtros-dialogo").close();
}
function abrirFiltros() {
  const dialogo = $("#filtros-dialogo");
  if (dialogo.open) return;
  devolverFocoFiltros = true;
  $("#filtros-dialogo-cuerpo").append($("#filtros-" + estado.pestana));
  dialogo.showModal();
}
function prepararFiltros() {
  const telefono = window.matchMedia("(max-width: 59.999rem)");
  $("#abrir-filtros").addEventListener("click", abrirFiltros);
  $("#ver-resultados").addEventListener("click", () => cerrarFiltros());
  $("#filtros-dialogo").addEventListener("close", () => {
    if ($("#filtros-dialogo").open) return;
    devolverFiltros();
    if (devolverFocoFiltros) $(telefono.matches ? "#abrir-filtros" : "#tab-" + estado.pestana).focus();
  });
  telefono.addEventListener("change", () => {
    if (!telefono.matches && $("#filtros-dialogo").open) cerrarFiltros();
    else if (telefono.matches && (document.activeElement === document.body || document.activeElement.closest(".filtros"))) $("#abrir-filtros").focus();
  });
  $("#limpiar-filtros").addEventListener("click", (evento) => { evento.preventDefault(); limpiarFiltros(); });
}

function nombreMomento(id, nombre) {
  return id === "toda-la-clase" ? `En toda la ${voc("clase")}` : nombre;
}

function nombresMomentos() {
  return Object.fromEntries(MOMENTOS.map(([id, nombre]) => [id, nombreMomento(id, nombre)]));
}

// Oculta lo que no aplica al perfil. Una lista vacía en la ficha significa "aplica siempre".
function aplica(r) {
  const p = estado.perfil;
  // Sin nivel elegido se muestran las acciones de básica y media, para no duplicar las versiones de parvularia.
  const nivel = p.nivel || "basica";
  if (r.niveles.length && !r.niveles.includes(nivel)) return false;
  return true;
}
// Las respuestas de actividad y evidencia no ocultan acciones: ponen primero las que coinciden.
function coincidencias(r) {
  const ctx = [...estado.perfil.actividad, ...estado.perfil.evidencia];
  return r.contextos.filter((c) => ctx.includes(c));
}
function normalizarNecesidades(ids) {
  return Array.isArray(ids) ? [...new Set(ids.filter((id) => typeof id === "string" && necesidades.some((n) => n.id === id)))] : [];
}
function coincidenciasNecesidades(r) {
  return necesidades.filter((n) => estado.necesidades.includes(n.id) && n.consideraciones.includes(r.consideracion));
}
function etiqueta(valor) {
  const casilla = document.querySelector(`input[value="${valor}"]`);
  return casilla ? casilla.closest("label").textContent.trim() : valor;
}
function compararDua(a, b, practica = practicaActiva()) {
  const orden = Object.fromEntries(MOMENTOS.map(([id], i) => [id, i]));
  return (orden[a.momento] - orden[b.momento]) || (coincidenciasNecesidades(b).length - coincidenciasNecesidades(a).length) || (Number(practica && esPractica(b)) - Number(practica && esPractica(a))) || (coincidencias(b).length - coincidencias(a).length) || (b.destacada - a.destacada) || a.consideracion.localeCompare(b.consideracion, "es", { numeric: true });
}
function visibles() {
  const practica = practicaActiva();
  return catalogo.filter((r) => r.tipo === "dua" && (!estado.momentos.length || estado.momentos.includes(r.momento)) && aplica(r))
    .filter((r) => !estado.propositos.length || estado.propositos.includes(proposito(r)))
    .sort((a, b) => compararDua(a, b, practica));
}

function el(tag, attrs = {}, ...hijos) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
  }
  hijos.flat().filter(Boolean).forEach((h) => n.append(h));
  return n;
}

function pintarControles() {
  actualizarConteoFiltros();
  $("#necesidades-campo").hidden = !necesidades.length;
  $("#necesidades").replaceChildren(...necesidades.map((n) => el("button", {
    type: "button", id: "necesidad-" + n.id, class: "chip", "aria-pressed": String(estado.necesidades.includes(n.id)),
    onclick: () => {
      estado.necesidades = estado.necesidades.includes(n.id) ? estado.necesidades.filter((id) => id !== n.id) : [...estado.necesidades, n.id];
      guardar(); pintarControles(); pintarTarjetas(); actualizarRespaldo();
      document.getElementById("necesidad-" + n.id).focus();
    }, text: n.texto,
  })));
  const cont = $("#momentos"); cont.replaceChildren();
  for (const [id, nombre] of MOMENTOS) {
    const acciones = catalogo.filter((r) => r.tipo === "dua" && r.momento === id && aplica(r));
    const conteo = estado.necesidades.length ? `${acciones.length} · ${acciones.filter((r) => coincidenciasNecesidades(r).length).length} para ti` : String(acciones.length);
    cont.append(el("button", { type: "button", id: "m-" + id, class: "chip", "aria-pressed": String(estado.momentos.includes(id)),
      onclick: () => {
        estado.momentos = estado.momentos.includes(id) ? estado.momentos.filter((m) => m !== id) : [...estado.momentos, id];
        guardar(); pintarControles(); pintarTarjetas();
        document.getElementById("m-" + id).focus();
      },
    }, nombreMomento(id, nombre) + " ", el("small", { text: `(${conteo})` })));
  }
  const chips = $("#propositos"); chips.replaceChildren();
  for (const [id, p] of Object.entries(PROPOSITOS)) {
    const b = el("button", { type: "button", id: "proposito-" + id, class: "chip " + id, "aria-pressed": String(estado.propositos.includes(id)), title: "Principio DUA: " + p.principio },
      el("span", { class: "tri", "aria-hidden": "true" }), p.nombre);
    b.addEventListener("click", () => {
      estado.propositos = estado.propositos.includes(id) ? estado.propositos.filter((x) => x !== id) : [...estado.propositos, id];
      guardar(); pintarControles(); pintarTarjetas();
      document.getElementById("proposito-" + id).focus();
    });
    chips.append(b);
  }
}

function tarjeta(r) {
  const dua = r.tipo === "dua", acceso = r.tipo === "acceso", prop = dua ? proposito(r) : null, elegida = r.id in (dua ? estado.seleccion : estudianteActual().seleccion);
  const version = versionCurso(r), ofrecida = version && Object.hasOwn(estado.seleccion, version.id);
  const repetida = estado.estudiantes.filter((e) => Object.hasOwn(e.seleccion, r.id)).length;
  const boton = el("button", { type: "button", id: "elegir-" + r.id, class: "boton", "aria-pressed": String(elegida) }, elegida ? "Elegida" : "Elegir");
  boton.addEventListener("click", () => alternar(r.id));
  return el("li", { class: "tarjeta" + (elegida ? " elegida" : "") },
    el("div", { class: "t-arriba" },
      !dua ? el("span", { class: "t-proposito", text: tipoOficial(r) }) : el("span", { class: "t-proposito " + prop }, el("span", { class: "tri", "aria-hidden": "true" }), PROPOSITOS[prop].corto),
      !dua ? null : el("abbr", { class: "t-dua", title: "Consideración DUA 3.0: " + CONSIDERACIONES[r.consideracion] }, "DUA " + r.consideracion)),
    dua && coincidenciasNecesidades(r).length ? el("p", { class: "t-razon", text: "Responde a: " + coincidenciasNecesidades(r).map((n) => n.texto).join("; ") + "." }) : null,
    dua && practicaActiva() && esPractica(r) ? el("p", { class: "t-razon", text: "Recomendada porque marcaste: taller, laboratorio o terreno." }) : null,
    acceso ? el("p", { class: "t-razon", text: "Porque marcaste: " + (esPractica(r) ? "actividades prácticas" + (dimensionesCoincidentes(r).length ? "; " : "") : "") + dimensionesCoincidentes(r).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[estudianteActual().dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : dua && coincidencias(r).length ? el("p", { class: "t-razon", text: "Recomendada porque marcaste: " + coincidencias(r).map(etiqueta).join(", ") + "." }) : null,
    r.tipo === "objetivos" && r.subtipo === "eliminacion" ? el("strong", { class: "ultimo-recurso", text: "Último recurso" }) : null,
    el(dua || r.tipo === "objetivos" ? "h4" : "h3", { text: r.titulo }),
    el("ol", {}, r.como.map((p) => el("li", { text: p }))),
    version ? el("div", { class: "version-curso", tabindex: "-1" }, el("p", { text: "Versión para todo el curso: " + version.titulo }),
      ofrecida ? el("p", { text: "También ofrecido a todo el curso" }) : null,
      el("button", { type: "button", class: "boton", id: "curso-" + r.id, ...(ofrecida ? { disabled: "" } : {}), text: ofrecida ? "Ya está en el curso" : "Agregar al curso",
        onclick: () => { estado.seleccion[version.id] = ""; guardar(); pintarTarjetas(); pintarApoyos(); pintarSeleccion(); document.getElementById("curso-" + r.id)?.closest(".version-curso").focus(); } })) : null,
    repetida >= 2 ? el("p", { class: "aviso-apoyos", text: `Lo elegiste para ${repetida} estudiantes.` + (version && !ofrecida ? " Considera agregar su versión para todo el curso." : "") }) : null,
    el("p", { class: "t-porque" }, el("strong", { text: "Por qué funciona: " }), r.porque),
    el("div", { class: "t-abajo" },
      el("span", { class: "respaldo " + r.respaldo, text: RESPALDO[r.respaldo] }),
      boton),
    el("details", { class: "fuentes" }, el("summary", { text: "Fuentes" }),
      el("ul", {}, r.fuentes.map((f) => el("li", {}, el("a", { href: fuentes[f].url, rel: "noopener", target: "_blank", text: fuentes[f].cita }))))));
}

function plural(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

function fechaLocal() {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function pintarTarjetas() {
  pintarRepeticiones();
  const lista = visibles();
  $("#tarjetas").replaceChildren(...MOMENTOS.filter(([id]) => lista.some((r) => r.momento === id)).map(([id, nombre]) =>
    el("section", { "aria-labelledby": "t-momento-" + id },
      el("h3", { id: "t-momento-" + id, text: nombreMomento(id, nombre) }),
      el("ul", { class: "tarjetas" }, lista.filter((r) => r.momento === id).map(tarjeta)))));
  $("#conteo").textContent = plural(lista.length, "acción", "acciones");
}

function alternar(id, estudianteId = estado.estudianteActivo) {
  const r = catalogo.find((r) => r.id === id);
  if (!r) return;
  const seleccion = r.tipo === "dua" ? estado.seleccion : estado.estudiantes.find((e) => e.id === estudianteId)?.seleccion;
  if (!seleccion) return;
  const foco = document.activeElement.id;
  const agregada = !Object.hasOwn(seleccion, id);
  if (!agregada) delete seleccion[id]; else seleccion[id] = "";
  guardar(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
  if (agregada) {
    const contador = $("#n-sel");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      contador.getAnimations().forEach((animacion) => animacion.cancel());
      contador.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 250 });
    }
    const aviso = $("#mochila-estado");
    aviso.textContent = "";
    requestAnimationFrame(() => { aviso.textContent = "Agregada a tu mochila"; });
  }
  if (foco.startsWith("elegir-") || foco.startsWith("quitar-")) {
    (document.getElementById(foco) || $("#mochila .quitar") || $("#t-seleccion")).focus();
  }
}

function elegidasOrdenadas(seleccion = estado.seleccion) {
  return catalogo.filter((r) => Object.hasOwn(seleccion, r.id) && aplica(r))
    .sort((a, b) => a.tipo === "dua" && b.tipo === "dua" ? compararDua(a, b) : ordenApoyo(a) - ordenApoyo(b) || a.id.localeCompare(b.id, "es", { numeric: true }));
}
function totalElegidas() { return Object.keys(estado.seleccion).length + estado.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0); }
function pintarSeleccion() {
  const sel = elegidasOrdenadas(), total = totalElegidas();
  $("#n-sel").textContent = total;
  $("#abrir-mochila").setAttribute("aria-label", `Mi mochila: ${plural(total, "elegida", "elegidas")}`);
  $("#sel-curso-titulo").hidden = !sel.length;
  $("#sel-vacia").hidden = total > 0;
  $("#pdf").disabled = !sel.length && !estado.estudiantes.some(datosEstudiante);
  actualizarRespaldo();
  const nombreMomento = nombresMomentos();
  $("#sel-lista").replaceChildren(...sel.map((r) => itemSeleccion(r)));
  $("#sel-estudiantes").replaceChildren(...estado.estudiantes.filter((e) => Object.keys(e.seleccion).length).map((e) =>
    el("section", {}, el("h3", { text: tituloEstudiante(e) }), el("p", { class: "ayuda", text: subtituloEstudiante() }),
      el("ol", { class: "sel-lista" }, elegidasOrdenadas(e.seleccion).map((r) => itemSeleccion(r, e))))));
  function itemSeleccion(r, e) {
    const seleccion = e ? e.seleccion : estado.seleccion;
    const nota = el("textarea", { rows: "2", maxlength: "2000", "aria-label": "Nota para: " + r.titulo + (e ? " · " + nombreEstudiante(e) : " · Curso"), placeholder: "Nota opcional: cómo la usarás" });
    nota.value = seleccion[r.id] || "";
    nota.addEventListener("input", () => {
      seleccion[r.id] = nota.value; guardar();
      if (!privacidadAvisada && nota.value) mostrarAvisoPrivacidad(nota);
    });
    return el("li", {}, el("span", { class: "sel-momento", text: e ? tipoOficial(r) : nombreMomento[r.momento] }),
      el("span", { class: "sel-titulo", text: r.titulo }), nota,
      el("button", { type: "button", class: "quitar", id: "quitar-" + (e ? e.id + "-" : "") + r.id, onclick: () => alternar(r.id, e?.id), text: "Quitar" }));
  }
}

function sincronizarPerfil() {
  const p = estado.perfil;
  $("#nivel").value = p.nivel; $("#meta").value = p.meta;
  $("#practica").checked = p.practica;
  $("#practica-campo").hidden = !hayPracticas();
  for (const nombre of ["actividad", "evidencia"]) {
    document.querySelectorAll(`input[name="${nombre}"]`).forEach((c) => { c.checked = p[nombre].includes(c.value); });
  }
  aplicarVocabulario();
}

function escucharPerfil() {
  const actualizar = () => {
    estado.perfil = {
      nivel: $("#nivel").value, meta: $("#meta").value, practica: $("#practica").checked,
      actividad: [...document.querySelectorAll('input[name="actividad"]:checked')].map((c) => c.value),
      evidencia: [...document.querySelectorAll('input[name="evidencia"]:checked')].map((c) => c.value),
    };
    guardar(); aplicarVocabulario(); pintarControles(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
    $("#practica-campo").hidden = !hayPracticas();
  };
  $("#nivel").addEventListener("change", actualizar);
  $("#practica").addEventListener("change", actualizar);
  $("#perfil").addEventListener("input", (evento) => {
    if (evento.target.matches('#meta, input[name="actividad"], input[name="evidencia"]')) actualizar();
  });
}

function hayDatos() {
  const p = estado.perfil;
  return Boolean(estado.necesidades.length || p.nivel || p.meta || p.actividad.length || p.evidencia.length || totalElegidas() || estado.estudiantes.some(datosEstudiante) || estado.estudiantes.length > 1 || estado.perfil.practica || estado.asignatura || estado.momentos.length);
}

function actualizarRespaldo() {
  $("#guardar-respaldo").disabled = !hayDatos();
}

function guardarRespaldo() {
  const guardado = new Date().toISOString();
  const datos = { app: "prizma", version: 2, catalogo: VERSION_CATALOGO, guardado, perfil: estado.perfil, seleccion: estado.seleccion, estudiantes: estado.estudiantes, estudianteActivo: estado.estudianteActivo, propositos: estado.propositos, necesidades: estado.necesidades, momentos: estado.momentos, asignatura: estado.asignatura };
  const url = URL.createObjectURL(new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" }));
  const enlace = el("a", { href: url, download: `prizma-respaldo-${fechaLocal()}.json` });
  document.body.append(enlace);
  enlace.click(); enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#respaldo-estado").textContent = "Respaldo descargado. Búscalo en tu carpeta de descargas.";
}

function validarRespaldo(datos) {
  const objeto = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  if (!objeto(datos) || datos.app !== "prizma" || ![1, 2].includes(datos.version)) throw new Error("Este archivo no es un respaldo de Prizma.");
  const seleccion = (s) => objeto(s) && Object.values(s).every((nota) => typeof nota === "string");
  if (!objeto(datos.perfil) || !seleccion(datos.seleccion) || (datos.version === 2 &&
    (!Array.isArray(datos.estudiantes) || datos.estudiantes.length > 10 || datos.estudiantes.some((e) => !objeto(e) || !seleccion(e.seleccion))))) {
    throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma.");
  }
  const normal = normalizarDatos(datos);
  const cantidad = Object.keys(datos.seleccion).length + (datos.version === 2 ? datos.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) : 0);
  return { ...normal, descartadas: cantidad - Object.keys(normal.seleccion).length - normal.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) };
}

async function abrirRespaldo(evento) {
  const input = evento.target, archivo = input.files[0], aviso = $("#respaldo-estado");
  if (!archivo) return;
  try {
    // Admite diez selecciones con notas de hasta 2000 caracteres, también en UTF-8.
    if (archivo.size > 12 * 1024 * 1024) throw new Error("El archivo es demasiado grande para ser un respaldo de Prizma.");
    let datos;
    try { datos = JSON.parse(await archivo.text()); }
    catch (e) { throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); }
    const { descartadas, ...normal } = validarRespaldo(datos);
    if (hayDatos() && !window.confirm(`Esto reemplaza los datos de tu ${voc("clase")}, tu selección y todos tus estudiantes por los del respaldo. ¿Continuar?`)) {
      aviso.textContent = "No se abrió el respaldo. Tus datos siguen igual.";
      return;
    }
    estado = { ...normal, pestana: estado.pestana }; inclusionDocumento = null;
    guardar(); sincronizarEstudiante(); sincronizarPerfil(); pintarControles(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
    aviso.textContent = `Respaldo abierto: ${plural(totalElegidas(), "acción", "acciones")}.` +
      (descartadas ? ` ${plural(descartadas, "acción", "acciones")} ${descartadas === 1 ? "ya no está en el catálogo y no se cargó." : "ya no están en el catálogo y no se cargaron."}` : "");
  } catch (e) { aviso.textContent = e.message; }
  finally { input.value = ""; }
}

const AVISO = "Orientación pedagógica. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas.";

// Un solo modelo del documento para la vista previa, la impresión y el PDF descargable.
function prepararDocumento() {
  solicitudDocumento++;
  $("#generar-documento").disabled = false;
  inclusionDocumento = { curso: true, estudiantes: datosEstudiante(estudianteActual()) ? [estado.estudianteActivo] : [] };
  $("#opciones-documento").replaceChildren(...[["curso", "Acciones para todo el curso"], ...estado.estudiantes.filter(datosEstudiante).map((e) => ["alumno:" + e.id, tituloEstudiante(e)])].map(([id, texto]) => {
    const c = el("input", { type: "checkbox", value: id, name: "incluir" });
    c.checked = id === "curso" || id === "alumno:" + estado.estudianteActivo;
    return el("label", {}, c, texto);
  }));
  $("#error-documento").textContent = "";
  $("#mochila").close();
  $("#incluir-documento").showModal(); $("#t-incluir-documento").focus();
}
async function generarDocumento() {
  const ids = [...document.querySelectorAll('input[name="incluir"]:checked')].map((c) => c.value);
  if (!ids.length) { $("#error-documento").textContent = "Elige el curso o al menos un estudiante."; return; }
  inclusionDocumento = { curso: ids.includes("curso"), estudiantes: ids.filter((id) => id.startsWith("alumno:")).map((id) => id.slice(7)) };
  const solicitud = solicitudDocumento;
  const boton = $("#generar-documento");
  boton.disabled = true; $("#error-documento").textContent = "Preparando documento…";
  try { await prepararPdf(); }
  catch (e) { if (solicitud === solicitudDocumento) { $("#error-documento").textContent = "No se pudo preparar el documento. Reintenta."; boton.disabled = false; } return; }
  if (solicitud !== solicitudDocumento) return;
  boton.disabled = false;
  if (!$("#incluir-documento").open) return;
  armarHoja(); $("#incluir-documento").close(); $("#vista-estado").textContent = ""; $("#vista").showModal();
}
function logoDocumento() {
  const svg = typeof document !== "undefined" ? $(".logo")?.outerHTML || "" : "";
  return svg.replace(/currentColor/g, "#18213f").replace(/var\(--motivar\)/g, "#b0145a").replace(/var\(--presentar\)/g, "#00727d").replace(/var\(--mostrar\)/g, "#5a33a8");
}
function documento(opciones = inclusionDocumento || { curso: true, estudiantes: datosEstudiante(estudianteActual()) ? [estado.estudianteActivo] : [] }) {
  const sel = opciones.curso ? elegidasOrdenadas() : [], alumnos = estado.estudiantes.filter((e) => opciones.estudiantes.includes(e.id));
  const usadas = [...sel, ...alumnos.flatMap((e) => elegidasOrdenadas(e.seleccion))];
  const accion = (r, seleccion) => ({ id: r.id, titulo: r.titulo, como: [...r.como], porque: r.porque, nota: (seleccion[r.id] || "").trim(),
    ofrecida: r.tipo !== "dua" && Boolean(versionCurso(r) && Object.hasOwn(estado.seleccion, versionCurso(r).id)),
    dato: (r.tipo === "dua" ? `Acción para todo el curso. DUA 3.0, consideración ${r.consideracion}: ${CONSIDERACIONES[r.consideracion]}.` : tipoOficial(r) + "." + (r.dua ? ` Versión DUA 3.0, consideración ${r.dua}.` : "")) + ` Respaldo: ${RESPALDO[r.respaldo]}.`,
    grupo: r.tipo === "acceso" ? `${esSuperior() ? "Ajustes razonables" : GRUPOS_APOYOS.acceso} · ${TIPOS_ACCESO[r.subtipo]}` : GRUPOS_APOYOS[r.tipo],
  });
  const textos = (nombre) => [...document.querySelectorAll(`input[name="${nombre}"]`)].filter((c) => estado.perfil[nombre].includes(c.value)).map((c) => c.closest("label").textContent.trim()).join(", ");
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
  const titulo = alumnos.length ? "Plan de apoyos para el aprendizaje" : "Acciones para todo el curso";
  const contenido = [opciones.curso ? "Curso" : "", alumnos.length ? plural(alumnos.length, "estudiante", "estudiantes") : ""].filter(Boolean).join(" y ");
  return { titulo, fecha, logo: logoDocumento(), curso: opciones.curso,
    resumen: [["Fecha", fecha], ["Nivel", NIVELES[estado.perfil.nivel] || "Sin indicar"], ...(practicaActiva() ? [["Clase práctica", "Clase con taller, laboratorio o terreno"]] : []),
      ...(estado.perfil.actividad.length ? [["Actividad de la clase", textos("actividad")]] : []),
      ...(estado.perfil.evidencia.length ? [["Cómo mostrarán lo aprendido", textos("evidencia")]] : []),
      ["Meta de aprendizaje", estado.perfil.meta.trim() || "Sin información"],
      ["Qué quiere resolver", necesidades.filter((n) => estado.necesidades.includes(n.id)).map((n) => n.texto).join("; ") || "Sin información"], ["Contenido", contenido]],
    grupos: MOMENTOS.filter(([id]) => sel.some((r) => r.momento === id)).map(([id, nombre]) => ({ nombre: nombreMomento(id, nombre), acciones: sel.filter((r) => r.momento === id).map((r) => accion(r, estado.seleccion)) }))
      .concat(alumnos.map((e) => {
        const apoyos = elegidasOrdenadas(e.seleccion);
        return { estudiante: e.id, nombre: tituloEstudiante(e), subtitulo: subtituloEstudiante(),
          cif: Object.entries(e.dimensiones).map(([d, f]) => [DIMENSIONES[d - 1][0], FRECUENCIAS[f], apoyos.filter((r) => r.dimensiones.includes(Number(d))).map((r) => r.titulo).join("; ") || "Sin apoyo elegido"]),
          ayuda: e.ayuda.trim() || "Sin información", voz: e.voz.trim() || "Sin información", acciones: apoyos.map((r) => accion(r, e.seleccion)),
        };
      })),
    fuentes: [...new Set(usadas.flatMap((r) => r.fuentes))].map((id) => ({ cita: fuentes[id]?.cita || id, url: fuentes[id]?.url || "" })),
  };
}
function armarHoja() {
  const d = documento();
  const tabla = (columnas, filas, clase = "") => el("table", { class: clase }, el("thead", {}, el("tr", {}, columnas.map((t) => el("th", { scope: "col", text: t })))),
    el("tbody", {}, filas.map((fila) => el("tr", {}, fila.map((t, i) => el(i ? "td" : "th", i ? { text: t } : { scope: "row", text: t }))))));
  const ficha = (a) => el("div", { class: "h-accion" }, el("h3", { text: a.titulo }), el("ol", {}, a.como.map((t) => el("li", { text: t }))),
    el("p", {}, el("strong", { text: "Por qué funciona: " }), a.porque), el("p", { class: "h-dato", text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : "") }),
    a.nota ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), a.nota) : null);
  $("#hoja").replaceChildren(...[
    el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })),
    el("h1", { text: d.titulo }), tabla(["Resumen", "Información"], d.resumen, "h-resumen"),
    d.curso ? el("h2", { text: "Acciones para todo el curso" }) : null,
    ...d.grupos.map((g) => el("section", { class: g.estudiante ? "h-estudiante" : "h-momento" },
      el(g.estudiante ? "h2" : "h3", { text: g.nombre }), g.subtitulo ? el("p", { text: g.subtitulo }) : null,
      g.cif ? el("div", {}, el("h3", { text: CIF_TITULO }), el("p", { class: "h-dato", text: CIF_AVISO }),
        el("div", { class: "tabla-cif", tabindex: "0", role: "region", "aria-label": CIF_TITULO }, tabla(CIF_COLUMNAS, g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]], "h-cif")),
        tabla(["Facilitadores y voz", "Información"], [["Le ayuda", g.ayuda], ["Qué dicen el estudiante y su familia", g.voz]], "h-facilitadores")) : null,
      ...g.acciones.flatMap((a, i) => [g.estudiante && a.grupo !== g.acciones[i - 1]?.grupo ? el("h3", { class: "h-grupo", text: a.grupo }) : null, ficha(a)]),
      g.estudiante ? el("div", { class: "h-acuerdos" }, el("h3", { text: "Acuerdos (para completar en la reunión)" }), ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => el("p", { text: t + ": __________________________________" }))) : null)),
    el("section", { class: "h-fuentes-seccion" }, el("h2", { text: "Fuentes" }), el("ol", { class: "h-fuentes" }, d.fuentes.map((f) => el("li", {}, f.cita, el("p", { class: "h-dato", text: f.url })))), el("p", { class: "h-aviso", text: AVISO }))].filter(Boolean));
}
function definicionPdf() {
  const d = documento(), margen = 56.7, ancho = 595.28 - 2 * margen;
  const fino = { hLineWidth: () => .4, vLineWidth: () => .4, hLineColor: () => "#aaaaaa", vLineColor: () => "#aaaaaa", paddingLeft: () => 6, paddingRight: () => 6, paddingTop: () => 5, paddingBottom: () => 5 };
  const ficha = (a) => ({ unbreakable: true, margin: [0, 0, 0, 12], stack: [
    { text: a.titulo, style: "h3" }, { ol: [...a.como], margin: [0, 4, 0, 4] },
    { text: [{ text: "Por qué funciona: ", bold: true }, a.porque] }, { text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : ""), style: "dato", margin: [0, 4, 0, 0] },
    ...(a.nota ? [{ table: { widths: ["*"], body: [[{ text: [{ text: "Mi nota: ", bold: true }, a.nota], fillColor: "#f2f2f2", margin: [5, 5, 5, 5] }]] }, layout: "noBorders", margin: [0, 5, 0, 0] }] : []),
  ] });
  const contenido = [
    { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] },
    { text: d.titulo, style: "h1" },
    { table: { widths: [110, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: { ...fino, vLineWidth: () => 0, hLineWidth: () => .3 }, margin: [0, 8, 0, 14] },
    ...(d.curso && !d.grupos.some((g) => !g.estudiante) ? [{ text: "Acciones para todo el curso", style: "h2", headlineLevel: 1 }] : []),
    ...d.grupos.flatMap((g) => [
      ...(g.estudiante ? [{ id: "alumno-" + g.estudiante, text: g.nombre, style: "h2", headlineLevel: 1, pageBreak: "before", margin: [0, 8, 0, 6] }] : []),
      ...(g.estudiante ? [
        { text: g.subtitulo, italics: true, margin: [0, 0, 0, 8] },
        { text: CIF_TITULO, style: "h3", headlineLevel: 2 }, { text: CIF_AVISO, style: "dato", margin: [0, 3, 0, 5] },
        { table: { headerRows: 1, widths: [ancho * .38 - 13, ancho * .18 - 13, ancho * .44 - 13], body: [CIF_COLUMNAS.map((text) => ({ text, bold: true, fillColor: "#eeeeee" })), ...(g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]])] }, layout: fino, margin: [0, 0, 0, 10] },
        { table: { widths: [125, "*"], body: [[{ text: "Le ayuda", bold: true }, g.ayuda], [{ text: "Qué dicen el estudiante y su familia", bold: true }, g.voz]] }, layout: fino, margin: [0, 0, 0, 12] },
      ] : []),
      ...g.acciones.flatMap((a, i) => !g.estudiante && i === 0 ? [{ unbreakable: true, stack: [
        ...(g === d.grupos[0] ? [{ text: "Acciones para todo el curso", style: "h2" }] : []),
        { text: g.nombre, style: "h3", margin: [0, 8, 0, 6] }, ficha(a),
      ] }] : g.estudiante && a.grupo !== g.acciones[i - 1]?.grupo ? [
        { unbreakable: true, stack: [{ text: a.grupo, style: "h3", margin: [0, 8, 0, 5] }, ficha(a)] },
      ] : [ficha(a)]),
      ...(g.estudiante ? [{ unbreakable: true, margin: [0, 10, 0, 0], stack: [{ text: "Acuerdos (para completar en la reunión)", style: "h3" }, ...["Acordado con", "Fecha", "Próxima revisión"].map((t) => ({ text: t + ": __________________________________________________", margin: [0, 10, 0, 0] }))] }] : []),
    ]),
    { id: "fuentes-documento", text: "Fuentes", style: "h2", pageBreak: "before", headlineLevel: 1 },
    { ol: d.fuentes.map((f) => ({ stack: [{ text: f.cita }, { text: f.url, style: "dato", margin: [0, 2, 0, 8] }] })) },
    { table: { widths: ["*"], body: [[{ text: AVISO, style: "dato", margin: [5, 5, 5, 5] }]] }, layout: fino, margin: [0, 14, 0, 0] },
  ];
  return {
    info: { title: d.titulo, creator: "Prizma" }, pageSize: "A4", pageMargins: [margen, margen, margen, margen], content: contenido,
    pageBreakBefore: (n, siguientes) => Boolean(n.headlineLevel && siguientes.every((n) => n.headlineLevel)),
    header: (actual) => actual === 1 ? null : { margin: [margen, 20, margen, 0], stack: [
      { columns: [{ text: "Prizma · " + d.titulo, width: "*" }, { text: d.fecha, width: 115, alignment: "right" }], fontSize: 8, color: "#555555" },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: ancho, y2: 0, lineWidth: .4, lineColor: "#aaaaaa" }], margin: [0, 5, 0, 0] },
    ] },
    footer: (actual, total) => {
      // pdfmake ya asignó posiciones al contenido antes de dibujar los pies.
      const primera = Math.min(...contenido.filter((n) => n.id?.startsWith("alumno-")).map((n) => n.positions?.[0]?.pageNumber ?? Infinity));
      const fuentes = contenido.find((n) => n.id === "fuentes-documento").positions?.[0]?.pageNumber ?? Infinity;
      return actual === 1 ? null : { columns: [
        { text: actual >= primera && actual < fuentes ? "Contiene datos de un estudiante. Guárdalo de forma segura." : "", width: "*" },
        { text: `Página ${actual} de ${total}`, alignment: "right", width: 95 },
      ], fontSize: 8, color: "#555555", margin: [margen, 20, margen, 0] };
    },
    defaultStyle: { font: "Roboto", fontSize: 10.5, lineHeight: 1.2, color: "#111111" },
    styles: { h1: { fontSize: 20, bold: true }, h2: { fontSize: 14, bold: true, margin: [0, 8, 0, 6] }, h3: { fontSize: 11.5, bold: true }, dato: { fontSize: 8.5, color: "#555555" } },
  };
}

// pdfmake pesa unos 2 MB: se carga al preparar el documento.
function cargarScript(src) {
  return new Promise((ok, mal) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => mal(new Error(src)); document.head.append(s); });
}
let cargaPdf = null;
function prepararPdf() {
  if (!cargaPdf) cargaPdf = (async () => {
    if (!window.pdfMake?.createPdf) await cargarScript("vendor/pdfmake/pdfmake.min.js");
    if (!window.pdfMake.vfs) await cargarScript("vendor/pdfmake/vfs_fonts.js");
    // La vista previa reutiliza las mismas fuentes locales del PDF, sin duplicar archivos.
    if (typeof FontFace !== "undefined") {
      await Promise.all([["Roboto-Regular.ttf", "normal", "400"], ["Roboto-Medium.ttf", "normal", "700"], ["Roboto-Italic.ttf", "italic", "400"], ["Roboto-MediumItalic.ttf", "italic", "700"]].map(async ([archivo, style, weight]) => {
        const fuente = new FontFace("Roboto", `url(data:font/ttf;base64,${window.pdfMake.vfs[archivo]})`, { style, weight });
        document.fonts.add(await fuente.load());
      }));
    }
  })().catch((error) => { cargaPdf = null; throw error; });
  return cargaPdf;
}
async function descargarPdf() {
  const aviso = $("#vista-estado"), boton = $("#descargar");
  boton.disabled = true; aviso.textContent = "Preparando el PDF…";
  try {
    await prepararPdf();
    const fecha = fechaLocal();
    window.pdfMake.createPdf(definicionPdf()).download(`prizma-${documento().grupos.some((g) => g.estudiante) ? "plan" : "curso"}-${fecha}.pdf`);
    aviso.textContent = "PDF descargado. Búscalo en tu carpeta de descargas.";
  } catch (e) {
    aviso.textContent = "No se pudo crear el PDF. Usa «Imprimir» y elige «Guardar como PDF».";
  } finally { boton.disabled = false; }
}

function mostrarGuiaDUA(origen = document.activeElement) {
  const guia = $("#guia-dua");
  if (document.querySelector("dialog[open]")) return;
  origenGuiaDUA = origen;
  guia.returnValue = "";
  guia.showModal();
  $("#t-guia-dua").focus();
}

function prepararGuiaDUA() {
  document.querySelectorAll(".enlace-guia-dua").forEach((enlace) => enlace.addEventListener("click", (evento) => {
    evento.preventDefault(); mostrarGuiaDUA(enlace);
  }));
  $("#guia-empezar").addEventListener("click", () => $("#guia-dua").close("empezar"));
  $("#guia-dua").addEventListener("close", () => {
    if ($("#guia-dua").returnValue === "empezar") {
      if (location.hash !== "#dua") history.pushState(null, "", "#dua");
      mostrarPestana("dua");
      if (window.matchMedia("(max-width: 59.999rem)").matches && !privacidadPendiente) abrirFiltros();
    }
    const destino = $("#guia-dua").returnValue === "empezar" ? ($("#necesidades button") || ($("#filtros-dialogo").open ? $("#t-filtros-dialogo") : $("#t-filtros-dua"))) : origenGuiaDUA;
    if (privacidadPendiente) {
      privacidadPendiente = false;
      mostrarAvisoPrivacidad(origenAvisoPrivacidad);
    } else if (destino?.isConnected) destino.focus();
  });
}

function mostrarAvisoPrivacidad(origen = document.activeElement) {
  const aviso = $("#aviso-privacidad");
  if (aviso.open) return;
  origenAvisoPrivacidad = origen;
  const abierto = document.querySelector("dialog[open]");
  if (abierto) {
    if (origen?.closest("dialog") === abierto && ["filtros-dialogo", "mochila"].includes(abierto.id)) {
      dialogoPrivacidad = abierto;
      abierto.addEventListener("close", () => mostrarAvisoPrivacidad(origen), { once: true });
      abierto.close();
    } else privacidadPendiente = true;
    return;
  }
  aviso.showModal();
  $("#t-privacidad").focus();
  privacidadAvisada = true;
}

function mostrarGuiaApoyos(origen = document.activeElement) {
  if (document.querySelector("dialog[open]")) return;
  origenGuiaApoyos = origen;
  $("#t-guia-apoyos").textContent = esSuperior() ? "Cómo acordar ajustes razonables" : "Cómo usar los apoyos individualizados";
  $("#guia-apoyos-escolar").hidden = esSuperior();
  $("#guia-apoyos-superior").hidden = !esSuperior();
  $("#guia-apoyos").showModal();
  $("#t-guia-apoyos").focus();
}

function prepararAvisos() {
  try { privacidadAvisada = localStorage.getItem(CLAVE_PRIVACIDAD) === "1"; } catch (e) { /* se avisa una vez durante esta visita */ }
  document.querySelectorAll("#privacidad, .enlace-privacidad").forEach((enlace) => enlace.addEventListener("click", (evento) => { evento.preventDefault(); mostrarAvisoPrivacidad(enlace); }));
  $("#privacidad-entendido").addEventListener("click", () => {
    try { localStorage.setItem(CLAVE_PRIVACIDAD, "1"); } catch (e) { /* la confirmación dura esta visita */ }
    $("#aviso-privacidad").close();
  });
  $("#aviso-privacidad").addEventListener("close", () => {
    if (dialogoPrivacidad) {
      const anterior = dialogoPrivacidad;
      dialogoPrivacidad = null;
      if (anterior.id === "filtros-dialogo") abrirFiltros();
      else anterior.showModal();
    }
    if (origenAvisoPrivacidad?.isConnected) origenAvisoPrivacidad.focus();
  });
  prepararGuiaDUA();
  document.querySelectorAll(".enlace-guia-apoyos").forEach((enlace) => enlace.addEventListener("click", (evento) => {
    evento.preventDefault(); mostrarGuiaApoyos(enlace);
  }));
  $("#guia-apoyos-entendido").addEventListener("click", () => $("#guia-apoyos").close());
  $("#guia-apoyos").addEventListener("close", () => {
    if (origenGuiaApoyos?.isConnected) origenGuiaApoyos.focus();
  });
  document.querySelectorAll("dialog").forEach((dialogo) => dialogo.addEventListener("close", () => {
    if (privacidadPendiente && !document.querySelector("dialog[open]")) {
      privacidadPendiente = false;
      mostrarAvisoPrivacidad(origenAvisoPrivacidad);
    }
  }));
}

async function iniciar() {
  new ResizeObserver(([entrada]) => {
    document.documentElement.style.setProperty("--cabecera-alto", `${entrada.target.getBoundingClientRect().height}px`);
  }).observe($(".cabecera"));
  const tema = $("#tema");
  tema.value = document.documentElement.dataset.tema;
  tema.addEventListener("change", () => {
    document.documentElement.dataset.tema = tema.value;
    try { localStorage.setItem("prizma.tema", tema.value); } catch (e) { /* el tema funciona sin almacenamiento */ }
  });
  prepararAvisos();
  const cargaNecesidades = fetch("data/necesidades.json").then((r) => {
    if (!r.ok) throw new Error("necesidades");
    return r.json();
  }).then((datos) => {
    if (!Array.isArray(datos) || datos.some((n) =>
      !n || typeof n.id !== "string" || !n.id.trim() || typeof n.texto !== "string" || !n.texto.trim() ||
      (n.dimensiones !== undefined && (!Array.isArray(n.dimensiones) || n.dimensiones.some((d) => !Number.isInteger(d) || d < 1 || d > 11))) ||
      !Array.isArray(n.consideraciones) || n.consideraciones.some((c) => typeof c !== "string" || !Object.hasOwn(CONSIDERACIONES, c)))) return [];
    return new Set(datos.map((n) => n.id)).size === datos.length ? datos : [];
  }).catch(() => []);
  try {
    const [r, f, n] = await Promise.all([...["data/recomendaciones.json", "data/fuentes.json"].map((u) => fetch(u).then((x) => { if (!x.ok) throw new Error(u); return x.json(); })), cargaNecesidades]);
    catalogo = r; fuentes = Object.fromEntries(f.map((x) => [x.id, x])); necesidades = n;
  } catch (e) {
    $("#guia-empezar").disabled = false;
    $("#conteo").textContent = "No se pudo cargar el catálogo. Recarga la página; si abriste el archivo directamente, usa la versión publicada.";
    return;
  }
  cargar();
  prepararPestanas(); prepararFiltros();
  sincronizarEstudiante(); escucharEstudiante(); sincronizarPerfil(); escucharPerfil(); pintarControles(); pintarTarjetas(); pintarSeleccion();
  $("#guia-empezar").disabled = false;
  window.addEventListener("beforeprint", armarHoja);
  $("#pdf").addEventListener("click", prepararDocumento);
  $("#generar-documento").addEventListener("click", generarDocumento);
  $("#cancelar-documento").addEventListener("click", () => $("#incluir-documento").close());
  $("#incluir-documento").addEventListener("close", () => { if (!$("#vista").open) $("#abrir-mochila").focus(); });
  $("#vista").addEventListener("close", () => $("#abrir-mochila").focus());
  $("#guardar-respaldo").addEventListener("click", guardarRespaldo);
  $("#abrir-respaldo").addEventListener("change", abrirRespaldo);
  $("#descargar").addEventListener("click", descargarPdf);
  $("#imprimir").addEventListener("click", () => window.print());
  $("#cerrar").addEventListener("click", () => $("#vista").close());
  $("#borrar").addEventListener("click", () => {
    if (!window.confirm(`¿Borrar tu ${voc("clase")}, tu selección, tus notas y los datos de todos los estudiantes de este navegador?`)) return;
    try { localStorage.removeItem(CLAVE); } catch (e) { /* idem */ }
    history.replaceState(null, "", "#dua");
    location.reload();
  });
}
iniciar();
