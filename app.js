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
const TIPOS_PRACTICA = { institucion: "Lo que hace la institución", centro: "Lo que puede hacer el centro de práctica", estudiante: "Preparar al estudiante para pedir ajustes" };
const PIE_PRACTICA = "Documento preparado con el estudiante. Contiene solo lo que decidió compartir.";
const GRUPOS_APOYOS = { acceso: "Adecuaciones de acceso", objetivos: "Adecuaciones en los objetivos", desregulacion: "Apoyos ante desregulación", adicional: "Apoyos adicionales", "practica-profesional": "Apoyos para la práctica" };
const ROLES_ACUERDO = { estudiante: "Estudiante", familia: "Familia", equipo: "Equipo de apoyo", diferencial: "Educador diferencial", pie: "Equipo PIE", jefatura: "Jefatura técnica", docente: "Otro docente", inclusion: "Unidad de inclusión" };
const MODALIDADES = { "": "No aplica", senas: "Lengua de señas", braille: "Braille", ampliacion: "Lupa o ampliación", caa: "Tablero o comunicación aumentativa", lengua: "Otra lengua materna" };
// Única exclusión de modalidad: requiere revisión de Claude; las fichas multiformato conservan sus alternativas.
const EXCLUSIONES_MODALIDAD = { ampliacion: ["acc-6-braille"] };
const APOYOS_FORMA = ["acc-2-audio", "acc-8-teclado", "acc-8-transcribe", "acc-2-tiempo", "prac-tiempo", "acc-9-jornada", "acc-12-tiempo", "acc-12-opciones", "acc-2-registro", "acc-1-organizador", "sup-tiempo", "sup-formatos", "sup-caa", "sup-oral-progresivo", "prac-evaluar", "prac-asistente", "tr-respuesta-oral"];
const IDS_SEGURIDAD = ["prac-rotulos", "prac-evacuacion"];
function modalidadValida(valor) { return typeof valor === "string" && Object.hasOwn(MODALIDADES, valor) ? valor : ""; }
function compatibleModalidad(r, e = estudianteActual()) { return !(EXCLUSIONES_MODALIDAD[modalidadValida(e?.modalidad)] || []).includes(r.id); }
function seleccionIncompatible(e, trabajo = false) { return catalogo.some(r => Object.hasOwn(e.seleccion, r.id) && (trabajo ? r.tipo === "trabajo" : aplica(r)) && !compatibleModalidad(r, e)); }
function seguridadActiva(e, trabajo = false) { return Boolean(e && [6, 13, 8].some(d => e.dimensiones[d]) && (trabajo || practicaActiva() || nivelPracticaProfesional() && e.practicaProfesional)); }
function textoModalidad(texto, r, e) {
  if (e?.modalidad !== "ampliacion") return texto;
  // Estas fichas ofrecen formatos alternativos; no se excluye su parte compatible con ampliación.
  if (r.id === "sup-vision") return texto.replace("ampliado, en Braille o", "ampliado o");
  if (r.id === "tr-lector-braille") return texto.replace("lector de pantalla, ampliación o línea Braille", "lector de pantalla o ampliación");
  if (r.id === "tr-formularios-voz") return texto.replace("salida de voz o Braille", "salida de voz");
  return texto;
}
function pasosApoyo(r, e) {
  const pasos = r.como.map(t => textoModalidad(textoPublico(t), r, e));
  return e?.modalidad === "senas" && ["acc-6-audicion", "sup-audicion"].includes(r.id) ? ["Coordina un intérprete de lengua de señas con el estudiante y el equipo de apoyo.", ...pasos] : pasos;
}
function pintarSeguridad(trabajo = false) {
  const e = trabajo ? trabajadorActual() : estudianteActual(), caja = $(trabajo ? "#trabajo-seguridad" : "#estudiante-seguridad");
  const activa = seguridadActiva(e, trabajo); caja.hidden = !activa;
  const fichas = activa ? catalogo.filter(r => trabajo ? r.id === "tr-alertas-visuales" : aplica(r) && (IDS_SEGURIDAD.includes(r.id) || e.practicaProfesional && nivelPracticaProfesional() && r.id === "pp-seguridad")) : [];
  caja.replaceChildren(...(activa ? [el("p", { text: "Revisa rótulos, evacuación y alertas antes de comenzar. Acuerda las medidas con la persona y con quienes están a cargo de la seguridad." }), ...fichas.map(r => el("button", { type: "button", class: "boton", text: "Revisar: " + textoModalidad(r.titulo, r, e), onclick: () => {
    const destino = document.getElementById("elegir-" + r.id); if (!destino) return;
    for (let n = destino.parentElement; n; n = n.parentElement) if (n.tagName === "DETAILS") n.open = true;
    destino.focus(); destino.scrollIntoView({ block: "center" });
  } }))] : []));
}
function fechaValida(valor) {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) && Number.isFinite(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
}
function normalizarAcuerdo(valor, permitidos = ROLES_ACUERDO) {
  const a = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  const roles = Array.isArray(a.roles) ? [...new Set(a.roles.filter((r) => Object.hasOwn(permitidos, r)))] : [];
  const fecha = fechaValida(a.fecha) ? a.fecha : "", revision = fechaValida(a.revision) ? a.revision : "";
  const criterio = typeof a.criterio === "string" ? a.criterio.slice(0, 200) : "";
  const validoBase = roles.length && fecha && revision > fecha;
  const valido = validoBase && criterio.trim();
  return { roles, fecha, revision, criterio, estado: a.estado === "por-revisar" || a.estado === "completo" && validoBase && !criterio.trim() ? "por-revisar" : valido && a.estado === "completo" ? "completo" : "sin-acuerdos" };
}
function normalizarEstudiante(valor) {
  const e = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  const dimensiones = e.dimensiones && typeof e.dimensiones === "object" && !Array.isArray(e.dimensiones) ? e.dimensiones : {};
  return {
    iniciales: typeof e.iniciales === "string" && /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{1,4}[0-9]?$/.test(e.iniciales) ? e.iniciales : "",
    dimensiones: Object.fromEntries(Object.entries(dimensiones).filter(([k, v]) => /^(?:[1-9]|1[0-4])$/.test(k) && Number.isInteger(v) && v >= 1 && v <= 3)),
    ayuda: typeof e.ayuda === "string" ? e.ayuda.slice(0, 300) : "",
    modalidad: modalidadValida(e.modalidad), paci: e.protocolo !== true && e.paci === true, paec: e.protocolo !== true && e.paec === true, dec: e.protocolo !== true && e.dec === true, revisarInstrumentos: e.revisarInstrumentos === true || e.protocolo === true,
    practicaProfesional: e.practicaProfesional === true,
    descripcionGuardada: typeof e.descripcionGuardada === "boolean" ? e.descripcionGuardada : Object.keys(dimensiones).some((k) => /^(?:[1-9]|1[0-4])$/.test(k) && Number.isInteger(dimensiones[k]) && dimensiones[k] >= 1 && dimensiones[k] <= 3),
    acuerdo: normalizarAcuerdo(e.acuerdo),
    voz: typeof e.voz === "string" ? e.voz.slice(0, 300) : "",
  };
}
let secuenciaEstudiante = 0;
function nuevoIdEstudiante() { return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `estudiante-${++secuenciaEstudiante}`; }
function estudianteActual() { return estado.estudiantes.find((e) => e.id === estado.estudianteActivo) || estado.estudiantes[0]; }
function nombreEstudiante(e) { return e.iniciales || `Estudiante ${estado.estudiantes.indexOf(e) + 1}`; }
// Mediodía evita que la zona horaria cambie el día de una fecha AAAA-MM-DD.
function fechaLarga(iso) { return fechaValida(iso) ? new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }) : ""; }
function datosEstudiante(e) { return Boolean(e.modalidad || e.paci || e.paec || e.dec || e.revisarInstrumentos || e.acuerdo?.criterio || e.acuerdo?.roles.length || e.acuerdo?.fecha || e.practicaProfesional || e.iniciales || e.ayuda || e.voz || Object.keys(e.dimensiones).length || Object.keys(e.seleccion).length); }
function seleccionValidada(valor, dua) {
  const v = valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  return Object.fromEntries(Object.entries(v).filter(([id, nota]) => typeof nota === "string" && catalogo.some((r) => r.id === id && (dua === "trabajo" ? r.tipo === "trabajo" : dua ? r.tipo === "dua" : r.tipo in GRUPOS_APOYOS))).map(([id, nota]) => [id, nota.slice(0, 2000)]));
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
  const trabajadores = normalizarTrabajadores(g.trabajadores);
  const perfil = normalizarPerfil(g.perfil, g.estudiante?.practica);
  const escolares = estudiantes.some(datosEstudiante) || Object.keys(seleccionValidada(g.seleccion, true)).length || perfil.nivel || perfil.meta || perfil.reflexion || perfil.practica || perfil.actividad.length || perfil.evidencia.length || normalizarNecesidades(g.necesidades).length || normalizarMomentos(g.momentos).length || (Array.isArray(g.propositos) && g.propositos.some((p) => Object.hasOwn(PROPOSITOS, p)));
  const ambito = ["educacion", "trabajo"].includes(g.ambito) ? g.ambito : escolares ? "educacion" : trabajadores.some(datosTrabajador) ? "trabajo" : null;
  return {
    ambito,
    trabajadores, trabajadorActivo: trabajadores.some((e) => e.id === g.trabajadorActivo) ? g.trabajadorActivo : trabajadores[0]?.id || "",
    versionSituaciones: g.versionSituaciones === 2 || !estudiantes.some((e) => e.dimensiones[3] || e.dimensiones[6]) ? 2 : 1,
    perfil, seleccion: seleccionValidada(g.seleccion, true), estudiantes,
    estudianteActivo: estudiantes.some((e) => e.id === g.estudianteActivo) ? g.estudianteActivo : estudiantes[0].id,
    necesidades: normalizarNecesidades(g.necesidades), momentos: normalizarMomentos(g.momentos), asignatura: normalizarAsignatura(g.asignatura),
    propositos: Array.isArray(g.propositos) ? [...new Set(g.propositos.filter((p) => Object.hasOwn(PROPOSITOS, p)))] : [],
    claseGuardada: g.claseGuardada === true,
    mantenerIndividual: Array.isArray(g.mantenerIndividual) ? [...new Set(g.mantenerIndividual.filter((id) => typeof id === "string" && catalogo.some((r) => r.id === id && r.tipo !== "dua" && r.dua)))] : [],
    pestana: ["apoyos", "trabajo"].includes(g.pestana) ? g.pestana : "dua",
  };
}
function pintarSelectorEstudiantes() {
  $("#lista-estudiantes").replaceChildren(...estado.estudiantes.map((e) => el("button", {
    type: "button", class: "chip", id: `estudiante-${e.id}`, "aria-pressed": String(e.id === estado.estudianteActivo), text: nombreEstudiante(e) + " · " + estadoCaso(e),
    onclick: () => {
      estado.estudianteActivo = e.id; guardar(); sincronizarEstudiante(); pintarSeleccion(); pintarEstadoCasos();
      document.getElementById(`estudiante-${e.id}`).focus();
    },
  })));
  pintarEstadoCasos();
  $("#quitar-estudiante").textContent = "Quitar a " + nombreEstudiante(estudianteActual());
}
function agregarEstudiante() {
  if (estado.estudiantes.length >= 10 || estado.estudiantes.some((e) => estadoCaso(e) !== "Acuerdos completos")) return;
  let id = nuevoIdEstudiante();
  while (estado.estudiantes.some((e) => e.id === id)) id = nuevoIdEstudiante();
  const e = { id, ...normalizarEstudiante(), seleccion: {} };
  estado.estudiantes.push(e); estado.estudianteActivo = e.id;
  guardar(); sincronizarEstudiante(); pintarSeleccion(); pintarEstadoCasos();
  $("#paso-descripcion").scrollIntoView({ block: "start" }); $("#iniciales").focus();
}
function quitarEstudiante() {
  if (!window.confirm("Se borran sus datos y apoyos de este navegador. ¿Continuar?")) return;
  const indice = estado.estudiantes.findIndex((e) => e.id === estado.estudianteActivo);
  estado.estudiantes.splice(indice, 1);
  if (!estado.estudiantes.length) estado.estudiantes.push({ id: nuevoIdEstudiante(), ...normalizarEstudiante(), seleccion: {} });
  estado.estudianteActivo = estado.estudiantes[Math.min(indice, estado.estudiantes.length - 1)].id;
  guardar(); sincronizarEstudiante(); pintarSeleccion(); pintarTarjetas(); pintarEstadoCasos();
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
        if (!borradorDua) editarClase();
        if (!borradorDua.necesidades.includes(n.id)) borradorDua.necesidades.push(n.id);
        guardarClase();
        if (!$("#t-dua-empezar")) limpiarFiltrosVista();
        const destino = $("#t-dua-empezar") || $("#acciones");
        destino.setAttribute("tabindex", "-1"); destino.focus(); destino.scrollIntoView({ block: "start" });
      },
    }) : null);
  }));
}

function esSuperior() { return estado.perfil.nivel === "superior"; }
function subtituloEstudiante() { return esSuperior() ? "Propuesta para acordar con el estudiante y la unidad de inclusión" : "Propuesta para conversar con el equipo de apoyo"; }
function tituloEstudiante(e = estudianteActual()) { return (esSuperior() ? "Ajustes razonables para " : "Apoyos para ") + (e.iniciales || "un estudiante"); }
function nombreGrupoPractica(subtipo) { return subtipo === "institucion" && !esSuperior() ? "Lo que hace el liceo" : TIPOS_PRACTICA[subtipo]; }
function tipoOficial(r) {
  if (r.tipo === "trabajo") return "Ajuste en el trabajo: " + TIPOS_TRABAJO[r.subtipo];
  if (r.tipo === "practica-profesional") return "Apoyo para la práctica: " + nombreGrupoPractica(r.subtipo);
  if (esSuperior() && ["acceso", "adicional"].includes(r.tipo)) return `Ajuste razonable: ${TIPOS_ACCESO[r.subtipo] || "Apoyo adicional"}`;
  if (r.tipo === "adicional") return "Apoyo adicional";
  if (r.tipo === "acceso" && estado.perfil.nivel === "media") return `Adecuación de acceso (criterios del Decreto 83, por remisión del Decreto 67, art. 5): ${TIPOS_ACCESO[r.subtipo]}`;
  if (r.tipo === "acceso") return `Adecuación de acceso: ${TIPOS_ACCESO[r.subtipo]} (Decreto 83)`;
  if (r.tipo === "objetivos") return `Adecuación en los objetivos: ${TIPOS_OBJETIVOS[r.subtipo]} (Decreto 83)`;
  return `Apoyo ante desregulación: ${MOMENTOS_DEC[r.subtipo]}`;
}
function ordenApoyo(r) {
  if (r.tipo === "adicional") return -1;
  if (r.tipo === "practica-profesional") return 40 + Object.keys(TIPOS_PRACTICA).indexOf(r.subtipo);
  const subtipos = r.tipo === "acceso" ? TIPOS_ACCESO : r.tipo === "objetivos" ? TIPOS_OBJETIVOS : MOMENTOS_DEC;
  return Object.keys(GRUPOS_APOYOS).indexOf(r.tipo) * 10 + Object.keys(subtipos).indexOf(r.subtipo);
}
function objetivosVisibles() {
  return catalogo.filter((r) => r.tipo === "objetivos" && aplica(r) && (!estado.asignatura || !r.asignatura || r.asignatura === estado.asignatura))
    .sort((a, b) => ordenApoyo(a) - ordenApoyo(b) || Number(Object.hasOwn(a, "asignatura")) - Number(Object.hasOwn(b, "asignatura")));
}
function dimensionesCoincidentes(r, e = estudianteActual()) { return r.dimensiones.filter((d) => e.dimensiones[d]); }
function puntaje(r, e = estudianteActual()) { return dimensionesCoincidentes(r, e).reduce((suma, d) => suma + e.dimensiones[d], 0); }
function compararAcceso(a, b, e = estudianteActual(), orden = catalogo) {
  const proporcion = (r) => r.dimensiones.length ? dimensionesCoincidentes(r, e).length / r.dimensiones.length : 0;
  return puntaje(b, e) - puntaje(a, e) || proporcion(b) - proporcion(a) || orden.indexOf(a) - orden.indexOf(b);
}
function esPractica(r) { return r.contextos.includes("practica"); }
function hayPracticas() { return catalogo.some((r) => r.tipo === "acceso" && aplica(r) && esPractica(r)); }
function practicaActiva() { return estado.perfil.practica && hayPracticas(); }
function practicasVisibles() {
  return catalogo.filter(r => r.tipo === "acceso" && aplica(r) && esPractica(r) && compatibleModalidad(r) && (estado.perfil.practica && puntaje(r) > 0 || seguridadActiva(estudianteActual()) && IDS_SEGURIDAD.includes(r.id))).sort(compararAcceso);
}
function accesosVisibles() { return catalogo.filter((r) => r.tipo === "acceso" && aplica(r) && !esPractica(r) && compatibleModalidad(r) && puntaje(r)).sort(compararAcceso); }
function situacionesSinApoyos() {
  return Object.keys(estudianteActual().dimensiones).map(Number).filter((d) =>
    !catalogo.some((r) => r.tipo === "acceso" && aplica(r) && (!esPractica(r) || estado.perfil.practica) && r.dimensiones.includes(d)));
}
function rolesPermitidos() { return esSuperior() ? ["estudiante", "inclusion", "docente"] : ["estudiante", "familia", "equipo", "diferencial", "pie", "jefatura", "docente"]; }
function erroresAcuerdo(e, trabajo = false) {
  const a = e.acuerdo || normalizarAcuerdo(), errores = [], roles = trabajo ? Object.keys(ROLES_TRABAJO) : rolesPermitidos();
  if (!e.descripcionGuardada || !Object.keys(e.dimensiones).length) errores.push("Guarda una descripción con al menos una situación.");
  if (!(trabajo ? elegidasTrabajo(e) : elegidasOrdenadas(e.seleccion)).length) errores.push(trabajo ? "Elige al menos un ajuste." : "Elige al menos un apoyo.");
  if (typeof a.criterio !== "string" || !a.criterio.trim() || a.criterio.length > 200) errores.push("Indica cómo sabremos que funciona (máximo 200 caracteres).");
  if (seleccionIncompatible(e, trabajo)) errores.push("Revisa los apoyos elegidos para la modalidad actual en Mi mochila.");
  if (!a.roles.some((r) => roles.includes(r))) errores.push("Elige al menos un rol.");
  if (a.roles.some((r) => !roles.includes(r))) errores.push("Revisa los roles para este nivel.");
  if (!trabajo && catalogo.some(r => r.tipo === "objetivos" && Object.hasOwn(e.seleccion, r.id)) && (!a.roles.includes("familia") || !a.roles.some(r => ["diferencial", "pie", "jefatura"].includes(r)))) errores.push("Una adecuación en los objetivos se decide con la familia y el equipo de apoyo (Decreto 83). Agrega esos roles");
  if (!fechaValida(a.fecha)) errores.push("Indica una fecha del acuerdo válida.");
  if (!fechaValida(a.revision)) errores.push("Indica una próxima revisión válida.");
  else if (a.fecha && a.revision <= a.fecha) errores.push("La revisión debe ser posterior al acuerdo.");
  return errores;
}
function estadoCaso(e, trabajo = false) {
  if (e.acuerdo?.estado === "por-revisar") return "Por revisar";
  if (e.acuerdo?.estado === "completo") return erroresAcuerdo(e, trabajo).length ? "Por revisar" : "Acuerdos completos";
  return "Sin acuerdos";
}
function marcarRevision(e) { if (e.acuerdo?.estado === "completo") e.acuerdo.estado = "por-revisar"; }
function abrirPaso(id, abierto) {
  $("#" + id + "-cuerpo").hidden = !abierto;
  $("#" + id + "-resumen").hidden = abierto;
  $("#" + id + "-toggle").setAttribute("aria-expanded", String(abierto));
}
function pintarEstadoCasos() {
  const e = estudianteActual(), pendientes = estado.estudiantes.filter((e) => estadoCaso(e) !== "Acuerdos completos");
  $("#agregar-estudiante").disabled = pendientes.length > 0 || estado.estudiantes.length >= 10;
  $("#agregar-estudiante").textContent = estado.estudiantes.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso";
  $("#agregar-caso-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreEstudiante).join(", ") : estado.estudiantes.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso.";
  document.querySelectorAll("#lista-estudiantes button").forEach((b) => {
    const caso = estado.estudiantes.find((e) => b.id === `estudiante-${e.id}`);
    if (caso) b.textContent = nombreEstudiante(caso) + " · " + estadoCaso(caso);
  });
  pintarContextoEstudiante();
  $("#estudiante").hidden = !e.descripcionGuardada;
  $("#paso-acuerdos").hidden = !e.descripcionGuardada;
  $("#acuerdos-revisar").hidden = estadoCaso(e) !== "Por revisar";
  const situaciones = Object.entries(e.dimensiones).map(([d, f]) => `${DIMENSIONES[d - 1][0]}: ${FRECUENCIAS[f]}`).join("; ");
  $("#paso-descripcion-texto").textContent = situaciones ? situaciones + (e.ayuda.trim() ? ". Le ayuda: " + e.ayuda.trim() : "") : "Todavía no guardas una situación.";
  const a = e.acuerdo || normalizarAcuerdo();
  $("#paso-acuerdos-texto").textContent = a.fecha ? `${estadoCaso(e)} · ${a.roles.map((r) => ROLES_ACUERDO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) || "Sin indicar"}` : "Todavía no guardas acuerdos.";
  const repetidas = e.iniciales && estado.estudiantes.some((otro) => otro.id !== e.id && otro.iniciales.toUpperCase() === e.iniciales.toUpperCase());
  $("#iniciales-duplicadas").textContent = repetidas ? `Ya hay un estudiante ${e.iniciales}. Agrega un número para distinguirlos` : "";
}
function sincronizarAcuerdos() {
  const e = estudianteActual(), a = e.acuerdo || (e.acuerdo = normalizarAcuerdo());
  $("#roles-acuerdo").replaceChildren(...rolesPermitidos().map((id) => {
    const campo = el("input", { type: "checkbox", name: "rol-acuerdo", value: id }); campo.checked = a.roles.includes(id);
    campo.addEventListener("change", () => {
      marcarRevision(e); a.roles = [...document.querySelectorAll('input[name="rol-acuerdo"]:checked')].map((c) => c.value);
      guardar(); pintarEstadoCasos();
    });
    return el("label", {}, campo, ROLES_ACUERDO[id]);
  }));
  $("#criterio-acuerdo").value = a.criterio;
  $("#fecha-acuerdo").value = a.fecha; $("#revision-acuerdo").value = a.revision;
  $("#acuerdos-error").textContent = ""; $("#descripcion-error").textContent = "";
}
function guardarDescripcion() {
  if (!Object.keys(estudianteActual().dimensiones).length) { $("#descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; }
  estudianteActual().descripcionGuardada = true; guardar(); pintarEstadoCasos(); pintarApoyos();
  $("#descripcion-error").textContent = ""; abrirPaso("paso-descripcion", false); $("#t-apoyos").focus(); actualizarPaso(2);
}
function guardarAcuerdos() {
  const errores = erroresAcuerdo(estudianteActual());
  $("#acuerdos-error").textContent = errores.join(" ");
  if (errores.length) return;
  estudianteActual().acuerdo.estado = "completo"; guardar(); pintarEstadoCasos();
  abrirPaso("paso-acuerdos", false); $("#paso-acuerdos-editar").focus();
}
function abrirClase() {
  if (!borradorDua) borradorDua = { perfil: { ...estado.perfil, actividad: [...estado.perfil.actividad], evidencia: [...estado.perfil.evidencia] }, necesidades: [...estado.necesidades] };
  abrirPaso("paso-clase", true);
}
function editarClase() { abrirClase(); sincronizarPerfil(); pintarControles(); }
function resumenClase() {
  const detalles = [estado.perfil.meta.trim(), ...necesidades.filter((n) => estado.necesidades.includes(n.id)).map((n) => n.texto), ...[...estado.perfil.actividad, ...estado.perfil.evidencia].map(etiqueta), ...(practicaActiva() ? ["Taller, laboratorio o terreno"] : [])].filter(Boolean);
  $("#paso-clase-texto").textContent = detalles.join(" · ") || "Sin detalles de la clase.";
}
function guardarClase() {
  if (borradorDua) {
    estado.perfil = normalizarPerfil({ ...borradorDua.perfil, nivel: estado.perfil.nivel, reflexion: estado.perfil.reflexion });
    estado.necesidades = normalizarNecesidades(borradorDua.necesidades);
  }
  borradorDua = null; estado.claseGuardada = true; guardar(); resumenClase(); abrirPaso("paso-clase", false);
  pintarControles(); pintarTarjetas(); pintarApoyos(); pintarSeleccion(); $("#acciones").focus(); actualizarPaso(2);
}
function prepararPasos() {
  $("#perfil").addEventListener("submit", (evento) => { evento.preventDefault(); guardarClase(); });
  $("#descripcion-caso").addEventListener("submit", (evento) => { evento.preventDefault(); guardarDescripcion(); });
  $("#acuerdos-caso").addEventListener("submit", (evento) => { evento.preventDefault(); guardarAcuerdos(); });
  for (const id of ["paso-clase", "paso-descripcion", "paso-acuerdos"]) {
    $("#" + id + "-toggle").addEventListener("click", () => {
      const abrir = $("#" + id + "-cuerpo").hidden;
      if (id === "paso-clase" && abrir && !borradorDua) editarClase(); else abrirPaso(id, abrir);
    });
    $("#" + id + "-editar").addEventListener("click", () => {
      if (id === "paso-clase") editarClase(); else abrirPaso(id, true);
      $(id === "paso-clase" ? "#meta" : id === "paso-descripcion" ? "#iniciales" : "#roles-acuerdo input").focus();
    });
  }
  $("#ir-acuerdos").addEventListener("click", () => { abrirPaso("paso-acuerdos", true); $("#roles-acuerdo input").focus(); actualizarPaso(3); });
  for (const [id, clave] of [["fecha-acuerdo", "fecha"], ["revision-acuerdo", "revision"]]) $("#" + id).addEventListener("change", (evento) => {
    const e = estudianteActual(); marcarRevision(e); e.acuerdo[clave] = fechaValida(evento.target.value) ? evento.target.value : ""; guardar(); pintarEstadoCasos();
  });
  $("#reflexion").value = estado.perfil.reflexion || "";
  $("#reflexion").addEventListener("input", (evento) => { estado.perfil.reflexion = evento.target.value.slice(0, 500); guardar(); actualizarRespaldo(); $("#documento-clase").disabled = !elegidasOrdenadas().length && !estado.perfil.reflexion; if (!privacidadAvisada && evento.target.value) mostrarAvisoPrivacidad(evento.target); });
  $("#limpiar-clase").addEventListener("click", (evento) => { evento.preventDefault(); limpiarClase(); });
  $("#limpiar-filtros").addEventListener("click", (evento) => { evento.preventDefault(); limpiarFiltrosVista(); });
  $("#documento-clase").addEventListener("click", prepararDocumento);
  if (!estado.claseGuardada) editarClase(); else { abrirPaso("paso-clase", false); resumenClase(); }
}

function pintarContextoEstudiante() {
  $("#paso-descripcion-toggle").textContent = "1. Describe la situación de " + nombreEstudiante(estudianteActual());
}
function pintarRevisionSituaciones() {
  const pendientes = estado.versionSituaciones !== 2 ? estado.estudiantes.filter((e) => e.dimensiones[3] || e.dimensiones[6]) : [];
  $("#revision-situaciones").hidden = !pendientes.length;
  $("#revision-situaciones-texto").textContent = 'Separamos algunas situaciones: "Visión" y "Audición", y "Comprender" y "Expresarse oralmente". Revisa las situaciones de: ' + pendientes.map(nombreEstudiante).join(", ") + ".";
}
function pintarTituloApoyos() {
  pintarContextoEstudiante(); pintarRevisionSituaciones();
  $("#t-apoyos").textContent = (esSuperior() ? "2. Ajustes razonables sugeridos para " : "2. Apoyos sugeridos para ") + nombreEstudiante(estudianteActual());
}
function nivelPracticaProfesional() { return ["media", "superior"].includes(estado.perfil.nivel); }
function fichasPracticaProfesional(subtipo) {
  return catalogo.filter((r) => r.tipo === "practica-profesional" && r.subtipo === subtipo && aplica(r) &&
    (subtipo !== "centro" || !r.dimensiones.length || puntaje(r) > 0)).sort(compararAcceso);
}
function elegidasCentro() {
  return nivelPracticaProfesional() && estudianteActual().practicaProfesional ? elegidasOrdenadas(estudianteActual().seleccion)
    .filter((r) => r.tipo === "practica-profesional" && r.subtipo === "centro") : [];
}
function pintarPracticaProfesional() {
  $("#practica-profesional-campo").hidden = !nivelPracticaProfesional();
  $("#practica-profesional").checked = estudianteActual().practicaProfesional;
  const visible = nivelPracticaProfesional() && estudianteActual().practicaProfesional;
  $("#bloque-practica-profesional").hidden = !visible;
  $("#practica-profesional-grupos").replaceChildren(...(visible ? Object.keys(TIPOS_PRACTICA).map((subtipo) =>
    grupoPlegado(nombreGrupoPractica(subtipo), fichasPracticaProfesional(subtipo), "Lo que hacen el liceo o la institución, el centro y el estudiante.")) : []));
  $("#preparar-centro").disabled = !elegidasCentro().length;
  $("#centro-ayuda").textContent = elegidasCentro().length ? "El estudiante decide cuáles ajustes compartir." : "Primero elige los ajustes que puede hacer el centro";
}
function pintarApoyos() {
  pintarPracticaProfesional(); pintarEstadoCasos();
  const superior = esSuperior();
  $("#t-estudiante").textContent = superior ? "Ajustes razonables para un estudiante" : "Apoyos para un estudiante";
  $("#bajada-apoyos").textContent = superior ? "Cambios en la forma de enseñar, evaluar o en el entorno que permiten participar en igualdad, sin bajar los resultados de aprendizaje." : "Cuando las acciones para todo el curso no bastan, un estudiante puede necesitar apoyos propios. Se acuerdan con él, su familia y el equipo.";
  $("#voz-etiqueta").textContent = superior ? "¿Qué dice el estudiante?" : "¿Qué dicen el estudiante y su familia?";
  $("#voz-ayuda").textContent = superior ? "Lo que le acomoda, lo que le preocupa o lo que propone. No escribas diagnósticos." : "Lo que les acomoda, lo que les preocupa o lo que proponen. No escribas diagnósticos.";
  pintarTituloApoyos();
  document.querySelectorAll(".enlace-guia-apoyos").forEach((enlace) => {
    enlace.textContent = superior ? "¿Qué son los ajustes razonables?" : "¿Qué son los apoyos para un estudiante?";
  });
  $("#aviso-acceso-escolar").hidden = superior;
  $("#aviso-acceso-superior").hidden = !superior;
  $("#objetivos").hidden = superior || estado.perfil.nivel === "parvularia";
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
  const todas = [...lista, ...practicas].sort(compararAcceso), primeras = todas.length > 3 ? todas.slice(0, 3) : [];
  const destacadas = new Set(primeras.map((r) => r.id));
  const resto = lista.filter((r) => !destacadas.has(r.id)), restoPracticas = practicas.filter((r) => !destacadas.has(r.id));
  $("#apoyos-resultados").replaceChildren(
    ...(primeras.length ? [el("section", { "aria-labelledby": "t-para-empezar" }, el("h3", { id: "t-para-empezar", text: "Para empezar" }), el("p", { class: "ayuda", text: "Los apoyos que mejor responden a las situaciones que marcaste." }), el("ul", { class: "tarjetas" }, primeras.map(tarjeta)))] : []),
    ...Object.entries(TIPOS_ACCESO).filter(([tipo]) => resto.some((r) => r.subtipo === tipo))
      // Cada grupo se ubica según su ficha más pertinente; así no queda una buena ficha debajo de grupos peores.
      .sort(([a], [b]) => compararAcceso(resto.find((r) => r.subtipo === a), resto.find((r) => r.subtipo === b))).map(([tipo, nombre]) =>
      grupoPlegado(nombre, resto.filter((r) => r.subtipo === tipo), definicionAcceso())));
  if (restoPracticas.length) $("#apoyos-resultados").append(grupoPlegado("En talleres, laboratorios y terreno", restoPracticas, definicionAcceso()));
  const objetivos = objetivosVisibles();
  $("#objetivos summary").textContent = `Adecuaciones en los objetivos (${objetivos.length})`;
  $("#desregulacion summary").textContent = `Apoyos ante desregulación (${catalogo.filter((r) => r.tipo === "desregulacion" && aplica(r)).length})`;
  $("#asignatura-campo").hidden = !catalogo.some((r) => r.tipo === "objetivos" && aplica(r));
  $("#asignatura").value = estado.asignatura;
  $("#objetivos-tarjetas").replaceChildren(...Object.entries(TIPOS_OBJETIVOS).filter(([tipo]) => objetivos.some((r) => r.subtipo === tipo)).map(([tipo, nombre]) =>
    grupoPlegado(nombre, objetivos.filter((r) => r.subtipo === tipo), "Apoyo que cambia qué aprende o cuándo. Último paso (Decreto 83).")));
  $("#objetivos-parvularia").hidden = estado.perfil.nivel !== "parvularia";
  $("#desregulacion-resultados").replaceChildren(...Object.entries(MOMENTOS_DEC).map(([subtipo, nombre]) =>
    grupoPlegado(nombre, catalogo.filter((r) => r.tipo === "desregulacion" && r.subtipo === subtipo && aplica(r)), "Qué hacer antes, durante y después de una crisis.")));
  for (const campo of ["paci", "paec", "dec"]) for (const lugar of ["objetivos", "dec"]) $("#" + campo + "-" + lugar).checked = estudianteActual()[campo];
  $("#modalidad-revisar").textContent = seleccionIncompatible(estudianteActual()) ? "Revisa los apoyos elegidos para la modalidad actual en Mi mochila." : "";
  pintarSeguridad();
  $("#apoyos-estado").textContent = Object.keys(estudianteActual().dimensiones).length || practicas.length ? `${lista.length + practicas.length} ${superior ? "ajustes razonables sugeridos" : "adecuaciones de acceso sugeridas"}` : "Marca al menos una situación para ver apoyos.";
}
function actualizarArea(boton, nombre, ids, persona) {
  const cantidad = ids.filter((d) => persona.dimensiones[d]).length;
  const icono = boton.getAttribute("aria-expanded") === "true" ? "−" : "+";
  boton.textContent = `${icono} ${nombre}${cantidad ? ` (${plural(cantidad, "marcada", "marcadas")})` : ""}`;
}
function actualizarFrecuencias(contenedor) {
  contenedor.parentElement.hidden = ![...contenedor.children].some((grupo) => !grupo.hidden);
}
function botonArea(nombre, ids, persona, grupo, id) {
  grupo.hidden = !ids.some((d) => persona.dimensiones[d]);
  grupo.append(el("h4", { text: nombre }));
  const boton = el("button", { type: "button", class: "boton", id, "aria-controls": grupo.id, "aria-expanded": String(!grupo.hidden) });
  actualizarArea(boton, nombre, ids, persona);
  boton.addEventListener("click", () => {
    grupo.hidden = !grupo.hidden;
    boton.setAttribute("aria-expanded", String(!grupo.hidden));
    actualizarArea(boton, nombre, ids, persona);
    actualizarFrecuencias(grupo.parentElement);
  });
  return boton;
}
function sincronizarEstudiante() {
  pintarSelectorEstudiantes();
  $("#iniciales").value = estudianteActual().iniciales;
  $("#modalidad").value = estudianteActual().modalidad;
  $("#estudiante-ayuda").value = estudianteActual().ayuda;
  $("#estudiante-voz").value = estudianteActual().voz;
  const areas = $("#areas"); areas.replaceChildren();
  const dimensiones = $("#dimensiones"); dimensiones.replaceChildren();
  AREAS.forEach(([nombre, ids], i) => {
    const grupo = el("div");
    grupo.id = `dim-area-${i}`;
    const boton = botonArea(nombre, ids, estudianteActual(), grupo, `area-${i}`);
    areas.append(boton);
    ids.forEach((d) => {
      const [titulo, ayuda] = DIMENSIONES[d - 1];
      const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": `ayuda-d-${d}` }, el("legend", { text: titulo }), el("p", { class: "ayuda", id: `ayuda-d-${d}`, text: ayuda }));
      FRECUENCIAS.forEach((texto, valor) => {
        const radio = el("input", { type: "radio", name: `dimension-${d}`, value: valor });
        radio.checked = (estudianteActual().dimensiones[d] || 0) === valor;
        radio.addEventListener("change", () => {
          if ((estudianteActual().dimensiones[d] || 0) !== valor) marcarRevision(estudianteActual());
          if (valor) estudianteActual().dimensiones[d] = valor; else delete estudianteActual().dimensiones[d];
          actualizarArea(boton, nombre, ids, estudianteActual());
          guardar(); pintarApoyos(); pintarRepeticiones(); actualizarRespaldo(); pintarEstadoCasos();
        });
        campo.append(el("label", {}, radio, texto));
      });
      grupo.append(campo);
    });
    dimensiones.append(grupo);
  });
  actualizarFrecuencias(dimensiones);
  sincronizarAcuerdos();
  abrirPaso("paso-descripcion", !estudianteActual().descripcionGuardada);
  abrirPaso("paso-acuerdos", estadoCaso(estudianteActual()) !== "Acuerdos completos");
  pintarApoyos();
}
function escucharEstudiante() {
  $("#modalidad").addEventListener("change", ev => { const e = estudianteActual(); marcarRevision(e); e.modalidad = modalidadValida(ev.target.value); guardar(); pintarApoyos(); pintarSeleccion(); });
  for (const campo of ["paci", "paec", "dec"]) for (const lugar of ["objetivos", "dec"]) $("#" + campo + "-" + lugar).addEventListener("change", ev => { const e = estudianteActual(); marcarRevision(e); e[campo] = ev.target.checked; guardar(); pintarApoyos(); });
  $("#criterio-acuerdo").addEventListener("input", ev => { const e = estudianteActual(); marcarRevision(e); e.acuerdo.criterio = ev.target.value.slice(0, 200); guardar(); pintarEstadoCasos(); if (!privacidadAvisada && ev.target.value) mostrarAvisoPrivacidad(ev.target); });

  $("#practica-profesional").addEventListener("change", (evento) => {
    marcarRevision(estudianteActual());
    estudianteActual().practicaProfesional = evento.target.checked === true;
    guardar(); pintarApoyos(); pintarSeleccion(); pintarEstadoCasos();
  });
  $("#revision-situaciones-entendido").addEventListener("click", () => {
    estado.versionSituaciones = 2; guardar(); pintarRevisionSituaciones();
    $("#t-apoyos").focus(); actualizarPaso(2);
  });
  $("#agregar-estudiante").addEventListener("click", agregarEstudiante);
  $("#quitar-estudiante").addEventListener("click", quitarEstudiante);
  $("#asignatura").addEventListener("change", (evento) => {
    estado.asignatura = normalizarAsignatura(evento.target.value);
    guardar(); pintarApoyos(); pintarRepeticiones(); actualizarRespaldo();
  });
  for (const [id, clave] of [["iniciales", "iniciales"], ["estudiante-ayuda", "ayuda"], ["estudiante-voz", "voz"]]) {
    $("#" + id).addEventListener("input", (evento) => {
      const campo = evento.target, escribio = Boolean(campo.value);
      const valor = normalizarEstudiante({ ...estudianteActual(), [clave]: campo.value })[clave];
      if (valor !== estudianteActual()[clave]) marcarRevision(estudianteActual());
      estudianteActual()[clave] = valor;
      campo.value = estudianteActual()[clave];
      guardar(); pintarTituloApoyos(); pintarSelectorEstudiantes(); pintarSeleccion(); pintarEstadoCasos();
      if (!privacidadAvisada && escribio) mostrarAvisoPrivacidad(campo);
    });
  }
}

const TIPOS_TRABAJO = { informacion: "Información", comunicacion: "Comunicación", puesto: "Puesto y entorno", tiempo: "Tiempo y organización", proceso: "Cómo pedir, decidir y revisar ajustes" };
const ROLES_TRABAJO = { persona: "Persona trabajadora", jefatura: "Jefatura directa", gestor: "Gestor o gestora de inclusión", rrhh: "Recursos humanos", prevencion: "Prevención de riesgos" };
const EJEMPLOS_TRABAJO = [
  "encargos largos, varias tareas a la vez, plazos, interrupciones",
  "manuales, correos largos, formularios, registros escritos",
  "instrucciones verbales, capacitaciones, procedimientos nuevos",
  "reuniones, trabajo en equipo, atención de público, normas que no se dicen",
  "presión de tiempo, cambios imprevistos, conflictos, evaluaciones",
  "pantallas, documentos impresos, señalética",
  "ruido, luz intensa, espacios concurridos, olores",
  "desplazarse, cargar, manipular herramientas, posturas",
  "fatiga, dolor, controles médicos, jornadas largas",
  "otra lengua materna, migración, sentirse parte del equipo",
  "acceso al lugar, horarios, actitudes del equipo o de la jefatura",
  "reuniones, llamadas, presentaciones, atención telefónica",
  "reuniones, llamadas, alarmas, ruido de fondo",
  "tareas repetitivas, pocas responsabilidades, ganas de aprender más",
];
const PIE_TRABAJO = "Contiene datos de una persona trabajadora. Guárdalo con reserva (Código del Trabajo, art. 154 ter).";
const AVISO_TRABAJO = "Orientación pedagógica y laboral. No reemplaza la evaluación de profesionales ni los protocolos de tu empresa o institución, y no es asesoría legal. Sin diagnósticos: la persona decide qué contar y con quién compartir este acuerdo de ajustes.";
function normalizarTrabajador(valor) {
  const e = normalizarEstudiante(valor);
  return { iniciales: e.iniciales, dimensiones: e.dimensiones, ayuda: e.ayuda, voz: e.voz, descripcionGuardada: e.descripcionGuardada, modalidad: e.modalidad,
    compartir: typeof valor?.compartir === "string" ? valor.compartir.slice(0, 300) : "",
    tipoPuesto: typeof valor?.tipoPuesto === "string" ? valor.tipoPuesto.slice(0, 60) : "",
    acuerdo: normalizarAcuerdo(valor?.acuerdo, ROLES_TRABAJO), seleccion: seleccionValidada(valor?.seleccion, "trabajo") };
}
function normalizarTrabajadores(lista) {
  const ids = new Set();
  return (Array.isArray(lista) ? lista.slice(0, 10) : []).map((e) => {
    let id = typeof e?.id === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(e.id) && !ids.has(e.id) ? e.id : nuevoIdEstudiante();
    while (ids.has(id)) id = nuevoIdEstudiante();
    ids.add(id); return { id, ...normalizarTrabajador(e) };
  });
}
function trabajadorActual() { return (estado.trabajadores || []).find((e) => e.id === estado.trabajadorActivo) || estado.trabajadores?.[0]; }
function nombreTrabajador(e) { return e.iniciales || `Persona ${estado.trabajadores.indexOf(e) + 1}`; }
function tituloTrabajador(e) { return "Ajustes para " + nombreTrabajador(e); }
function datosTrabajador(e) { return Boolean(e.iniciales || e.tipoPuesto || e.ayuda || e.voz || Object.keys(e.dimensiones).length || Object.keys(e.seleccion).length || e.compartir || e.acuerdo.criterio || e.modalidad || e.acuerdo.roles.length || e.acuerdo.fecha); }
function elegidasTrabajo(e) {
  return catalogo.filter((r) => r.tipo === "trabajo" && Object.hasOwn(e.seleccion, r.id))
    .sort((a, b) => Object.keys(TIPOS_TRABAJO).indexOf(a.subtipo) - Object.keys(TIPOS_TRABAJO).indexOf(b.subtipo) || catalogo.indexOf(a) - catalogo.indexOf(b));
}
function ajustesTrabajo(e = trabajadorActual()) {
  if (!e) return [];
  // La tarea pide estos cuatro primero ante Audición; solo desempata pertinencias iguales.
  const auditivos = ["tr-subtitulos", "tr-interprete", "tr-mensajes-escritos", "tr-alertas-visuales"];
  const orden = Object.keys(e.dimensiones).length === 1 && e.dimensiones[13] ?
    [...auditivos.map((id) => catalogo.find((r) => r.id === id)).filter(Boolean), ...catalogo.filter((r) => !auditivos.includes(r.id))] : catalogo;
  return catalogo.filter((r) => r.tipo === "trabajo" && r.subtipo !== "proceso" && compatibleModalidad(r, e) && (puntaje(r, e) > 0 || seguridadActiva(e, true) && r.id === "tr-alertas-visuales")).sort((a, b) => compararAcceso(a, b, e, orden));
}
function pintarEstadoTrabajo() {
  const e = trabajadorActual(); if (!e) return;
  const pendientes = estado.trabajadores.filter((e) => estadoCaso(e, true) !== "Acuerdos completos");
  $("#agregar-trabajador").disabled = pendientes.length > 0 || estado.trabajadores.length >= 10;
  $("#agregar-trabajador").textContent = estado.trabajadores.length >= 10 ? "Máximo 10 casos" : "+ Agregar otro caso";
  $("#trabajo-agregar-ayuda").textContent = pendientes.length ? "Completa los acuerdos de: " + pendientes.map(nombreTrabajador).join(", ") : estado.trabajadores.length >= 10 ? "Llegaste al máximo de 10 casos." : "Puedes agregar el siguiente caso.";
  document.querySelectorAll("#lista-trabajadores button").forEach((b) => {
    const caso = estado.trabajadores.find((e) => b.id === "trabajador-" + e.id);
    if (caso) b.textContent = nombreTrabajador(caso) + " · " + estadoCaso(caso, true);
  });
  $("#trabajo-descripcion-toggle").textContent = "1. Describe la situación de " + nombreTrabajador(e);
  $("#quitar-trabajador").textContent = "Quitar a " + nombreTrabajador(e);
  $("#trabajo-resultados").hidden = !e.descripcionGuardada;
  $("#trabajo-acuerdo").hidden = !e.descripcionGuardada;
  $("#trabajo-revisar").hidden = estadoCaso(e, true) !== "Por revisar";
  const situaciones = Object.entries(e.dimensiones).map(([d, f]) => `${DIMENSIONES[d - 1][0]}: ${FRECUENCIAS[f]}`).join("; ");
  $("#trabajo-descripcion-texto").textContent = [e.tipoPuesto, situaciones, e.ayuda.trim() ? "Le ayuda: " + e.ayuda.trim() : ""].filter(Boolean).join(" · ") || "Todavía no guardas una situación.";
  const a = e.acuerdo;
  $("#trabajo-acuerdo-texto").textContent = a.fecha ? `${estadoCaso(e, true)} · ${a.roles.map((r) => ROLES_TRABAJO[r]).join(", ")} · Fecha: ${fechaLarga(a.fecha)} · Próxima revisión: ${fechaLarga(a.revision) || "Sin indicar"}` : "Todavía no guardas acuerdos.";
  $("#trabajo-duplicadas").textContent = e.iniciales && estado.trabajadores.some((otro) => otro.id !== e.id && otro.iniciales.toUpperCase() === e.iniciales.toUpperCase()) ? `Ya hay una persona ${e.iniciales}. Agrega un número para distinguirlas` : "";
  $("#documento-trabajo").disabled = !estado.trabajadores.some(datosTrabajador);
}
function pintarTrabajo() {
  const e = trabajadorActual(); if (!e) return;
  const lista = ajustesTrabajo(e), primeras = lista.length > 4 ? lista.slice(0, 4) : [], ids = new Set(primeras.map((r) => r.id));
  const grupo = (titulo, fichas) => titulo === "Para empezar" ? el("section", {}, el("h3", { text: titulo }), el("p", { class: "ayuda", text: "Los ajustes que mejor responden a las situaciones que marcaste." }), el("ul", { class: "tarjetas" }, fichas.map((r) => tarjeta(r)))) : grupoPlegado(titulo, fichas, "Cambio en el puesto, la comunicación, las herramientas o el horario. La ley lo llama «ajuste necesario» (Ley 20.422, art. 8).");
  $("#trabajo-tarjetas").replaceChildren(
    ...(primeras.length ? [grupo("Para empezar", primeras)] : []),
    ...Object.entries(TIPOS_TRABAJO).filter(([id]) => id !== "proceso").map(([id, nombre]) => {
      const fichas = lista.filter((r) => r.subtipo === id && !ids.has(r.id)); return fichas.length ? grupo(nombre, fichas) : null;
    }).filter(Boolean),
    grupo(TIPOS_TRABAJO.proceso, catalogo.filter((r) => r.tipo === "trabajo" && r.subtipo === "proceso")));
  pintarSeguridad(true);
  pintarEstadoTrabajo();
}
function sincronizarTrabajo() {
  const e = trabajadorActual(); if (!e) return;
  $("#lista-trabajadores").replaceChildren(...estado.trabajadores.map((e) => el("button", { type: "button", class: "chip", id: "trabajador-" + e.id,
    "aria-pressed": String(e.id === estado.trabajadorActivo), text: nombreTrabajador(e) + " · " + estadoCaso(e, true), onclick: () => {
      estado.trabajadorActivo = e.id; guardar(); sincronizarTrabajo(); pintarSeleccion(); document.getElementById("trabajador-" + e.id).focus();
    } })));
  for (const [id, clave] of [["iniciales", "iniciales"], ["puesto", "tipoPuesto"], ["ayuda", "ayuda"], ["voz", "voz"], ["compartir", "compartir"]]) $("#trabajo-" + id).value = e[clave];
  $("#trabajo-areas").replaceChildren(); $("#trabajo-dimensiones").replaceChildren();
  AREAS.forEach(([nombre, ids], i) => {
    const grupo = el("div", { id: "trabajo-area-d-" + i });
    const boton = botonArea(nombre, ids, e, grupo, "trabajo-area-" + i);
    $("#trabajo-areas").append(boton);
    ids.forEach((d) => {
      const ayudaId = "trabajo-ayuda-d-" + d;
      const campo = el("fieldset", { class: "perfil-opciones", "aria-describedby": ayudaId }, el("legend", { text: DIMENSIONES[d - 1][0] }), el("p", { id: ayudaId, class: "ayuda", text: EJEMPLOS_TRABAJO[d - 1] }));
      FRECUENCIAS.forEach((texto, valor) => {
        const radio = el("input", { type: "radio", name: "trabajo-dimension-" + d, value: valor }); radio.checked = (e.dimensiones[d] || 0) === valor;
        radio.addEventListener("change", () => {
          if ((e.dimensiones[d] || 0) !== valor) marcarRevision(e);
          if (valor) e.dimensiones[d] = valor; else delete e.dimensiones[d];
          actualizarArea(boton, nombre, ids, e);
          guardar(); pintarTrabajo(); pintarSeleccion();
        }); campo.append(el("label", {}, radio, texto));
      }); grupo.append(campo);
    }); $("#trabajo-dimensiones").append(grupo);
  });
  actualizarFrecuencias($("#trabajo-dimensiones"));
  $("#trabajo-roles").replaceChildren(...Object.entries(ROLES_TRABAJO).map(([id, nombre]) => {
    const campo = el("input", { type: "checkbox", name: "rol-trabajo", value: id }); campo.checked = e.acuerdo.roles.includes(id);
    campo.addEventListener("change", () => { marcarRevision(e); e.acuerdo.roles = [...document.querySelectorAll('input[name="rol-trabajo"]:checked')].map((c) => c.value); guardar(); pintarEstadoTrabajo(); });
    return el("label", {}, campo, nombre);
  }));
  $("#trabajo-modalidad").value = e.modalidad; $("#trabajo-compartir").value = e.compartir; $("#trabajo-criterio").value = e.acuerdo.criterio;
  $("#trabajo-fecha").value = e.acuerdo.fecha; $("#trabajo-revision").value = e.acuerdo.revision;
  $("#trabajo-acuerdos-error").textContent = ""; $("#trabajo-descripcion-error").textContent = "";
  abrirPaso("trabajo-descripcion", !e.descripcionGuardada); abrirPaso("trabajo-acuerdo", estadoCaso(e, true) !== "Acuerdos completos"); pintarTrabajo();
}
function agregarTrabajador() {
  if (estado.trabajadores.length >= 10 || estado.trabajadores.some((e) => estadoCaso(e, true) !== "Acuerdos completos")) return;
  let id = nuevoIdEstudiante(); while (estado.trabajadores.some((e) => e.id === id)) id = nuevoIdEstudiante();
  estado.trabajadores.push({ id, ...normalizarTrabajador() }); estado.trabajadorActivo = id;
  guardar(); sincronizarTrabajo(); pintarSeleccion(); $("#trabajo-descripcion").scrollIntoView({ block: "start" }); $("#trabajo-iniciales").focus();
}
function guardarDescripcionTrabajo() {
  const e = trabajadorActual(); if (!e) return;
  if (!Object.keys(e.dimensiones).length) { $("#trabajo-descripcion-error").textContent = "Marca al menos una situación para guardar la descripción."; return; }
  e.descripcionGuardada = true; guardar(); pintarTrabajo(); $("#trabajo-descripcion-error").textContent = "";
  abrirPaso("trabajo-descripcion", false); $("#t-ajustes").focus(); actualizarPaso(2);
}
function guardarAcuerdosTrabajo() {
  const e = trabajadorActual(); if (!e) return;
  const errores = erroresAcuerdo(e, true); $("#trabajo-acuerdos-error").textContent = errores.join(" "); if (errores.length) return;
  e.acuerdo.estado = "completo"; guardar(); pintarEstadoTrabajo(); abrirPaso("trabajo-acuerdo", false); $("#trabajo-acuerdo-editar").focus();
}
function prepararTrabajo() {
  $("#trabajo-modalidad").addEventListener("change", ev => { const e = trabajadorActual(); marcarRevision(e); e.modalidad = modalidadValida(ev.target.value); guardar(); pintarTrabajo(); pintarSeleccion(); });
  $("#trabajo-criterio").addEventListener("input", ev => { const e = trabajadorActual(); marcarRevision(e); e.acuerdo.criterio = ev.target.value.slice(0, 200); guardar(); pintarEstadoTrabajo(); if (!privacidadAvisada && ev.target.value) mostrarAvisoPrivacidad(ev.target); });

  for (const id of ["trabajo-descripcion", "trabajo-acuerdo"]) {
    $("#" + id + "-toggle").addEventListener("click", () => abrirPaso(id, $("#" + id + "-cuerpo").hidden));
    $("#" + id + "-editar").addEventListener("click", () => { abrirPaso(id, true); $(id === "trabajo-descripcion" ? "#trabajo-iniciales" : "#trabajo-roles input").focus(); });
  }
  $("#descripcion-trabajo").addEventListener("submit", (ev) => { ev.preventDefault(); guardarDescripcionTrabajo(); });
  $("#acuerdos-trabajo").addEventListener("submit", (ev) => { ev.preventDefault(); guardarAcuerdosTrabajo(); });
  $("#trabajo-ir-acuerdos").addEventListener("click", () => { abrirPaso("trabajo-acuerdo", true); $("#trabajo-roles input").focus(); });
  $("#agregar-trabajador").addEventListener("click", agregarTrabajador);
  $("#quitar-trabajador").addEventListener("click", () => {
    if (!window.confirm("Se borran sus datos y ajustes de este navegador. ¿Continuar?")) return;
    estado.trabajadores = estado.trabajadores.filter((e) => e.id !== estado.trabajadorActivo);
    if (!estado.trabajadores.length) estado.trabajadores.push({ id: nuevoIdEstudiante(), ...normalizarTrabajador() });
    estado.trabajadorActivo = estado.trabajadores[0].id; guardar(); sincronizarTrabajo(); pintarSeleccion(); document.getElementById("trabajador-" + estado.trabajadorActivo).focus();
  });
  for (const [id, clave] of [["iniciales", "iniciales"], ["puesto", "tipoPuesto"], ["ayuda", "ayuda"], ["voz", "voz"], ["compartir", "compartir"]]) $("#trabajo-" + id).addEventListener("input", (ev) => {
    const e = trabajadorActual(), campo = ev.target, escribio = Boolean(campo.value); if (!e) return;
    const valor = normalizarTrabajador({ ...e, [clave]: campo.value })[clave]; if (e[clave] !== valor) marcarRevision(e);
    e[clave] = valor; campo.value = valor; guardar(); pintarEstadoTrabajo(); pintarSeleccion();
    if (!privacidadAvisada && escribio) mostrarAvisoPrivacidad(campo);
  });
  for (const [id, clave] of [["fecha", "fecha"], ["revision", "revision"]]) $("#trabajo-" + id).addEventListener("change", (ev) => {
    const e = trabajadorActual(); if (!e) return;
    const valor = fechaValida(ev.target.value) ? ev.target.value : ""; if (e.acuerdo[clave] !== valor) marcarRevision(e);
    e.acuerdo[clave] = valor; guardar(); pintarEstadoTrabajo();
  });
  let origenGuiaTrabajo;
  document.querySelectorAll("#enlace-guia-trabajo, .enlace-guia-trabajo").forEach((enlace) => enlace.addEventListener("click", (ev) => {
    ev.preventDefault(); if (document.querySelector("dialog[open]")) return;
    origenGuiaTrabajo = ev.currentTarget; $("#guia-trabajo").showModal(); $("#t-guia-trabajo").focus();
  }));
  $("#guia-trabajo").addEventListener("close", () => {
    if (privacidadPendiente) { privacidadPendiente = false; mostrarAvisoPrivacidad(origenAvisoPrivacidad); } else origenGuiaTrabajo?.focus();
  });
  for (const id of ["documento-trabajo", "pdf-trabajo"]) $("#" + id).addEventListener("click", prepararDocumentoTrabajo);
  sincronizarTrabajo();
}

const $ = (s) => document.querySelector(s);
const proposito = (r) => Object.keys(PROPOSITOS).find((k) => PROPOSITOS[k].directrices.includes(r.consideracion.split(".")[0]));

let catalogo = [], fuentes = {}, necesidades = [];
const privacidadesSesion = new Set();
let privacidadAvisada = false, origenAvisoPrivacidad = null;
let origenGuiaDUA = null, privacidadPendiente = false;
let origenGuiaApoyos = null, dialogoPrivacidad = null;
const estudianteInicial = { id: nuevoIdEstudiante(), ...normalizarEstudiante(), seleccion: {} };
let estado = { ambito: null, trabajadores: [], trabajadorActivo: "", claseGuardada: false, mantenerIndividual: [], versionSituaciones: 2, asignatura: "", pestana: "dua", perfil: { nivel: "", practica: false, actividad: [], evidencia: [], meta: "", reflexion: "" }, momentos: [], propositos: [], necesidades: [], seleccion: {}, estudiantes: [estudianteInicial], estudianteActivo: estudianteInicial.id };
let inclusionDocumento = null, solicitudDocumento = 0;
let centroDocumento = null, origenCentro = null, origenGuiaPractica = null, origenDocumento = null;
let borradorDua = null;

function cargar() {
  try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g) estado = normalizarDatos(g); } catch (e) { /* sin almacenamiento: la página funciona igual */ }
}
function avisarInstrumentos() {
  if (!estado.estudiantes.some(e => e.revisarInstrumentos)) return;
  $("#instrumentos-aviso").hidden = false;
  estado.estudiantes.forEach(e => { e.revisarInstrumentos = false; }); guardar();
}
let falloGuardadoAvisado = false;
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {
    if (falloGuardadoAvisado) return;
    falloGuardadoAvisado = true;
    const aviso = $("#persistencia-aviso");
    aviso.hidden = false;
    aviso.replaceChildren(el("p", { text: "No se pudo guardar en este navegador. Descarga un respaldo para no perder tu trabajo" }), el("button", { type: "button", class: "boton", text: "Guardar respaldo", onclick: guardarRespaldo }));
  }
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
    reflexion: typeof p.reflexion === "string" ? p.reflexion.slice(0, 500) : "",
  };
}

function voc(clave) {
  const palabras = { clase: "experiencia de aprendizaje", curso: "grupo", estudiantes: "niños y niñas" };
  return estado.perfil.nivel === "parvularia" ? palabras[clave] : clave;
}

function aplicarVocabulario() {
  document.querySelectorAll("[data-voc]").forEach((n) => { n.textContent = voc(n.dataset.voc); });
  $("#tab-apoyos").textContent = esSuperior() ? "Ajustes razonables" : "Para un estudiante";
}

function mostrarInicio(enfocar = false) {
  estado.ambito = null;
  $("#inicio").hidden = false; $("#contexto").hidden = true;
  for (const id of ["dua", "apoyos", "trabajo"]) $("#panel-" + id).hidden = true;
  for (const id of ["pie-educacion", "pie-trabajo", "pie-ambito", "abrir-mochila", "indicador-pasos", "barra-continuar"]) $("#" + id).hidden = true;
  guardar();
  if (enfocar) $("#inicio").focus();
}
function mostrarPestana(id, enfocar = false) {
  estado.pestana = id; estado.ambito = id === "trabajo" ? "trabajo" : "educacion";
  $("#inicio").hidden = true; $("#contexto").hidden = false; $("#abrir-mochila").hidden = false;
  for (const nombre of ["dua", "apoyos", "trabajo"]) {
    $("#panel-" + nombre).hidden = nombre !== id;
    if (nombre !== "trabajo") {
      const tab = $("#tab-" + nombre);
      tab.setAttribute("aria-selected", String(nombre === id)); tab.tabIndex = nombre === id ? 0 : -1;
    }
  }
  $("#nivel-campo").hidden = id === "trabajo";
  $("#pestanas-educacion").hidden = id === "trabajo";
  $("#practica-campo").hidden = estado.pestana !== "dua" || !hayPracticas();
  $("#pie-educacion").hidden = id === "trabajo"; $("#pie-trabajo").hidden = id !== "trabajo"; $("#pie-ambito").hidden = false;
  if (id === "trabajo") {
    if (!estado.trabajadores.length) { const e = { id: nuevoIdEstudiante(), ...normalizarTrabajador() }; estado.trabajadores.push(e); estado.trabajadorActivo = e.id; }
    sincronizarTrabajo();
  }
  cargarPrivacidad(); guardar(); pintarContextoEstudiante(); pintarSeleccion(); prepararIndicador();
  if (enfocar) (id === "trabajo" ? $("#panel-trabajo") : $("#tab-" + id)).focus();
}
function prepararPestanas() {
  const desdeHash = (enfocar) => {
    if (location.hash === "#inicio") return mostrarInicio(enfocar);
    const id = ["#dua", "#apoyos", "#trabajo"].includes(location.hash) ? location.hash.slice(1) :
      estado.ambito === "trabajo" ? "trabajo" : estado.ambito === "educacion" ? (estado.pestana === "apoyos" ? "apoyos" : "dua") : null;
    if (!id) return mostrarInicio(enfocar);
    mostrarPestana(id, enfocar);
  };
  for (const [indice, id] of ["dua", "apoyos"].entries()) {
    const tab = $("#tab-" + id);
    const activar = (nombre) => { history.pushState(null, "", "#" + nombre); mostrarPestana(nombre, true); };
    tab.addEventListener("click", () => activar(id));
    tab.addEventListener("keydown", (evento) => {
      const siguiente = { ArrowRight: 1 - indice, ArrowLeft: 1 - indice, Home: 0, End: 1 }[evento.key];
      if (siguiente === undefined) return;
      evento.preventDefault(); activar(["dua", "apoyos"][siguiente]);
    });
  }
  for (const [id, destino] of [["elegir-educacion", "dua"], ["elegir-trabajo", "trabajo"]]) $("#" + id).addEventListener("click", () => {
    history.pushState(null, "", "#" + destino); mostrarPestana(destino, true); window.scrollTo(0, 0);
  });
  document.querySelectorAll(".cambiar-ambito").forEach((b) => b.addEventListener("click", () => {
    history.pushState(null, "", "#inicio"); mostrarInicio(true); window.scrollTo(0, 0);
  }));
  window.addEventListener("hashchange", () => desdeHash(true));
  window.addEventListener("popstate", () => desdeHash(true));
  $(".saltar").addEventListener("click", (evento) => {
    evento.preventDefault(); (estado.ambito ? $("#panel-" + estado.pestana) : $("#inicio")).focus();
  });
  delete estado.paso; desdeHash(false);
  $("#abrir-mochila").addEventListener("click", () => { pintarSeleccion(); $("#mochila").showModal(); });
  $("#cerrar-mochila").addEventListener("click", () => $("#mochila").close());
  $("#mochila").addEventListener("close", () => $("#abrir-mochila").focus());
  $("#continuar").addEventListener("click", continuarPaso);
  $("#documento-estudiante").addEventListener("click", prepararDocumento);
}

function limpiarClase() {
  if (!borradorDua) editarClase();
  borradorDua.necesidades = [];
  borradorDua.perfil = { ...borradorDua.perfil, meta: "", actividad: [], evidencia: [], practica: false };
  sincronizarPerfil(); pintarControles();
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
function validarNecesidades(datos) {
  if (!Array.isArray(datos) || datos.some((n) =>
    !n || typeof n.id !== "string" || !n.id.trim() || typeof n.texto !== "string" || !n.texto.trim() ||
    (n.dimensiones !== undefined && (!Array.isArray(n.dimensiones) || n.dimensiones.some((d) => !Number.isInteger(d) || d < 1 || d > DIMENSIONES.length))) ||
    !Array.isArray(n.consideraciones) || n.consideraciones.some((c) => typeof c !== "string" || !Object.hasOwn(CONSIDERACIONES, c)))) return [];
  return new Set(datos.map((n) => n.id)).size === datos.length ? datos : [];
}
function validarFuentes(datos) {
  if (!Array.isArray(datos) || new Set(datos.map((f) => f?.id)).size !== datos.length || datos.some((f) =>
    !f || typeof f.id !== "string" || !f.id.trim() || typeof f.cita !== "string" || !f.cita.trim() || typeof f.url !== "string" || !/^https?:\/\//.test(f.url))) throw new Error("Fuentes inválidas");
  return Object.fromEntries(datos.map((f) => [f.id, f]));
}
function validarCatalogo(datos, referencias) {
  const contextos = ["practica", ...["actividad", "evidencia"].flatMap((nombre) => [...document.querySelectorAll(`input[name="${nombre}"]`)].map((c) => c.value))];
  const listaTexto = (v) => Array.isArray(v) && v.every((t) => typeof t === "string" && t.trim());
  if (!Array.isArray(datos) || new Set(datos.map((r) => r?.id)).size !== datos.length || datos.some((r) =>
    !r || typeof r.id !== "string" || !r.id.trim() || !["dua", "trabajo", ...Object.keys(GRUPOS_APOYOS)].includes(r.tipo) ||
    typeof r.titulo !== "string" || !r.titulo.trim() || !listaTexto(r.como) || !r.como.length || typeof r.porque !== "string" || !r.porque.trim() ||
    !listaTexto(r.fuentes) || !r.fuentes.length || r.fuentes.some((id) => !Object.hasOwn(referencias, id)) ||
    !listaTexto(r.niveles) || r.niveles.some((n) => !Object.hasOwn(NIVELES, n) && n !== "trabajo") || !listaTexto(r.contextos) || r.contextos.some((c) => !contextos.includes(c)) ||
    !Array.isArray(r.dimensiones) || r.dimensiones.some((d) => !Number.isInteger(d) || d < 1 || d > DIMENSIONES.length) ||
    typeof r.destacada !== "boolean" || !Object.hasOwn(RESPALDO, r.respaldo) ||
    (r.tipo === "dua" && (!Object.hasOwn(CONSIDERACIONES, r.consideracion) || !MOMENTOS.some(([id]) => id === r.momento))) ||
    (r.dua !== undefined && !Object.hasOwn(CONSIDERACIONES, r.dua)) ||
    // Las fichas de trabajo se validan desde ya, aunque su pestaña aún no existe: nunca aplican a un nivel escolar.
    (r.tipo === "trabajo" && (!["informacion", "comunicacion", "puesto", "tiempo", "proceso"].includes(r.subtipo) || r.niveles.join() !== "trabajo")) ||
    (r.tipo === "acceso" && !Object.hasOwn(TIPOS_ACCESO, r.subtipo)) ||
    (r.tipo === "objetivos" && (!Object.hasOwn(TIPOS_OBJETIVOS, r.subtipo) || (r.asignatura !== undefined && !ASIGNATURAS.includes(r.asignatura)))) ||
    (r.tipo === "desregulacion" && !Object.hasOwn(MOMENTOS_DEC, r.subtipo)) ||
    (r.tipo === "practica-profesional" && !Object.hasOwn(TIPOS_PRACTICA, r.subtipo)))) throw new Error("No se pudo leer el catálogo");
  return datos;
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
function compararPertinenciaDua(a, b, practica = practicaActiva()) {
  return (coincidenciasNecesidades(b).length - coincidenciasNecesidades(a).length) || (Number(practica && esPractica(b)) - Number(practica && esPractica(a))) || (coincidencias(b).length - coincidencias(a).length) || (b.destacada - a.destacada) || a.consideracion.localeCompare(b.consideracion, "es", { numeric: true });
}
function compararDua(a, b, practica = practicaActiva()) {
  const orden = Object.fromEntries(MOMENTOS.map(([id], i) => [id, i]));
  return orden[a.momento] - orden[b.momento] || compararPertinenciaDua(a, b, practica);
}
function primerasDua(lista = visibles()) {
  return lista.length > 3 && (estado.necesidades.length || estado.perfil.actividad.length || estado.perfil.evidencia.length || practicaActiva()) ? [...lista].sort(compararPertinenciaDua).slice(0, 3) : [];
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

function definicionAcceso() {
  return esSuperior() ? "En superior: cambio en la enseñanza, la evaluación o el entorno que mantiene los resultados de aprendizaje (Ley 21.091)." : "Apoyo que cambia cómo recibe la información, cómo responde, el entorno o el tiempo, sin cambiar lo que debe aprender (Decreto 83).";
}
function grupoPlegado(nombre, acciones, definicion) {
  const clave = nombre + ":" + (acciones[0]?.id || "");
  const abierto = [...document.querySelectorAll("details[data-grupo]")].some((d) => d.getAttribute?.("data-grupo") === clave && d.open);
  const grupo = el("details", { class: "grupo-apoyos", "data-grupo": clave },
    el("summary", { text: `${nombre} (${acciones.length})` }),
    definicion ? el("p", { class: "ayuda", text: definicion }) : null,
    el("ul", { class: "tarjetas" }, acciones.map((r) => tarjeta(r))));
  grupo.open = abierto;
  return grupo;
}
let pasoActual = 1;
function pasosActuales() {
  return estado.pestana === "trabajo" ? ["trabajo-descripcion", "trabajo-resultados", "trabajo-acuerdo"] :
    estado.pestana === "apoyos" ? ["paso-descripcion", "estudiante", "paso-acuerdos"] : ["paso-clase", "acciones", "seleccion-dua"];
}
function actualizarPaso(numero) {
  pasoActual = numero;
  document.querySelectorAll("#indicador-pasos a").forEach((a, i) => {
    if (i + 1 === numero) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
  });
  actualizarContinuar();
}
function actualizarContinuar() {
  const b = $("#continuar");
  if (!b?.isConnected) return;
  const seleccion = estado.pestana === "trabajo" ? trabajadorActual()?.seleccion : estado.pestana === "apoyos" ? estudianteActual().seleccion : estado.seleccion;
  const cantidad = Object.keys(seleccion || {}).length;
  b.textContent = pasoActual === 1 ? (estado.pestana === "dua" ? "Guardar y ver acciones" : "Guardar y ver apoyos") :
    pasoActual === 2 ? (estado.pestana === "dua" ? `Ir a tu selección (${cantidad} elegidas)` : `Ir a acuerdos (${cantidad} elegidos)`) : "Ver documento";
}
function irPaso(numero) {
  const personal = estado.pestana !== "dua", trabajo = estado.pestana === "trabajo";
  const caso = trabajo ? trabajadorActual() : estudianteActual();
  if (personal && numero > 1 && !caso.descripcionGuardada) {
    $(trabajo ? "#guardar-descripcion-trabajo" : "#guardar-descripcion").click();
    if (!caso.descripcionGuardada) numero = 1;
  }
  const id = pasosActuales()[numero - 1];
  if (numero === 1) {
    if (!personal) editarClase(); else abrirPaso(id, true);
  } else if (numero === 3 && personal) abrirPaso(id, true);
  actualizarPaso(numero);
  const destino = $("#" + id);
  destino.setAttribute("tabindex", "-1"); destino.focus({ preventScroll: true });
  destino.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
function continuarPaso() {
  if (pasoActual === 1) {
    $(estado.pestana === "dua" ? "#perfil" : estado.pestana === "apoyos" ? "#descripcion-caso" : "#descripcion-trabajo").requestSubmit();
  } else if (pasoActual === 2) irPaso(3);
  else if (estado.pestana === "dua") $("#documento-clase").click();
  else {
    const trabajo = estado.pestana === "trabajo", caso = trabajo ? trabajadorActual() : estudianteActual();
    if (trabajo) guardarAcuerdosTrabajo(); else guardarAcuerdos();
    if (estadoCaso(caso, trabajo) === "Acuerdos completos") {
      if (trabajo) prepararDocumentoTrabajo(); else prepararDocumento();
    }
  }
}
function prepararIndicador() {
  const n = $("#indicador-pasos");
  if (!n?.isConnected) return;
  n.hidden = false; $("#barra-continuar").hidden = false;
  const textos = estado.pestana === "dua" ? ["1 Describe", "2 Elige", "3 Tu selección"] : ["1 Describe", "2 Elige", "3 Acuerda"];
  n.replaceChildren(...pasosActuales().map((id, i) => {
    const a = el("a", { href: "#" + id, text: textos[i] });
    a.addEventListener("click", (e) => { e.preventDefault(); irPaso(i + 1); });
    return a;
  }));
  actualizarPaso(1);
}

function pintarControles() {
  const configuracion = borradorDua || estado;
  $("#necesidades-campo").hidden = !necesidades.length;
  $("#necesidades").replaceChildren(...necesidades.map((n) => el("button", {
    type: "button", id: "necesidad-" + n.id, class: "chip", "aria-pressed": String(configuracion.necesidades.includes(n.id)),
    onclick: () => {
      configuracion.necesidades = configuracion.necesidades.includes(n.id) ? configuracion.necesidades.filter((id) => id !== n.id) : [...configuracion.necesidades, n.id];
      pintarControles();
      document.getElementById("necesidad-" + n.id).focus();
    }, text: n.texto,
  })));
  pintarFiltrosVista();
}

function actualizarVistaDua() {
  guardar(); pintarFiltrosVista(); pintarTarjetas(); actualizarRespaldo();
}
function limpiarFiltrosVista() {
  estado.momentos = []; estado.propositos = [];
  actualizarVistaDua();
}
function pintarFiltrosVista() {
  const cont = $("#momentos"); cont.replaceChildren();
  for (const [id, nombre] of MOMENTOS) {
    const acciones = catalogo.filter((r) => r.tipo === "dua" && r.momento === id && aplica(r));
    const conteo = estado.necesidades.length ? `${acciones.length} · ${acciones.filter((r) => necesidades.some((n) => estado.necesidades.includes(n.id) && n.consideraciones.includes(r.consideracion))).length} para ti` : String(acciones.length);
    cont.append(el("button", { type: "button", id: "m-" + id, class: "chip", "aria-pressed": String(estado.momentos.includes(id)),
      onclick: () => {
        estado.momentos = estado.momentos.includes(id) ? estado.momentos.filter((m) => m !== id) : [...estado.momentos, id];
        actualizarVistaDua();
        document.getElementById("m-" + id).focus();
      },
    }, id === "toda-la-clase" ? el("span", {}, "En toda la ", el("span", { "data-voc": "clase", text: voc("clase") })) : nombre, " ", el("small", { text: `(${conteo})` })));
  }
  const chips = $("#propositos"); chips.replaceChildren();
  for (const [id, p] of Object.entries(PROPOSITOS)) {
    const b = el("button", { type: "button", id: "proposito-" + id, class: "chip " + id, "aria-pressed": String(estado.propositos.includes(id)), title: "Principio DUA: " + p.principio },
      el("span", { class: "tri", "aria-hidden": "true" }), p.corto);
    b.addEventListener("click", () => {
      estado.propositos = estado.propositos.includes(id) ? estado.propositos.filter((x) => x !== id) : [...estado.propositos, id];
      actualizarVistaDua();
      document.getElementById("proposito-" + id).focus();
    });
    chips.append(b);
  }
}

function estudiantesCubiertos(r) {
  return estado.estudiantes.filter((e) => catalogo.some((a) => Object.hasOwn(e.seleccion, a.id) && a.tipo !== "dua" && aplica(a) && versionCurso(a)?.id === r.id)).length;
}
function avisoDua(r) { const n = estudiantesCubiertos(r); return n ? `Responde también a apoyos individuales de ${plural(n, "estudiante", "estudiantes")}` : ""; }
function agregarVersionCurso(r) {
  const version = versionCurso(r); if (!version) return;
  if (!Object.hasOwn(estado.seleccion, version.id)) estado.seleccion[version.id] = "";
  guardar(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
  document.getElementById("version-" + r.id)?.focus();
}
function textoPublico(texto) { return texto.replace(/la ficha clínica/g, "los antecedentes clínicos"); }
function tarjeta(r, destacarMomento = false) {
  const dua = r.tipo === "dua", trabajo = r.tipo === "trabajo", acceso = r.tipo === "acceso", persona = trabajo ? trabajadorActual() : estudianteActual(), prop = dua ? proposito(r) : null, elegida = r.id in (dua ? estado.seleccion : persona.seleccion);
  const version = versionCurso(r), ofrecida = version && Object.hasOwn(estado.seleccion, version.id);
  const repetida = trabajo ? 0 : estado.estudiantes.filter((e) => Object.hasOwn(e.seleccion, r.id)).length;
  const preguntar = repetida >= 2 && version && !ofrecida && !(estado.mantenerIndividual || []).includes(r.id);
  const boton = el("button", { type: "button", id: "elegir-" + r.id, class: "boton", "aria-pressed": String(elegida), "aria-label": (elegida ? "Elegida: " : "Elegir: ") + textoModalidad(r.titulo, r, persona) }, elegida ? "Elegida" : "Elegir");
  boton.addEventListener("click", () => alternar(r.id));
  return el("li", { class: "tarjeta" + (elegida ? " elegida" : "") },
    el("div", { class: "t-arriba" },
      !dua ? el("span", { class: "t-proposito", text: tipoOficial(r) }) : el("span", { class: "t-proposito " + prop }, el("span", { class: "tri", "aria-hidden": "true" }), PROPOSITOS[prop].corto),
      !dua ? null : el("abbr", { class: "t-dua", title: "Consideración DUA 3.0: " + CONSIDERACIONES[r.consideracion] }, "DUA " + r.consideracion)),
    dua && destacarMomento ? el("p", { class: "t-momento", text: nombresMomentos()[r.momento] }) : null,
    dua && coincidenciasNecesidades(r).length ? el("p", { class: "t-razon", text: "Responde a: " + coincidenciasNecesidades(r).map((n) => n.texto).join("; ") + "." }) : null,
    dua && practicaActiva() && esPractica(r) ? el("p", { class: "t-razon", text: "Responde a lo que marcaste: taller, laboratorio o terreno." }) : null,
    trabajo && dimensionesCoincidentes(r, persona).length ? el("p", { class: "t-razon", text: "Porque marcaste: " + dimensionesCoincidentes(r, persona).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[persona.dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : null,
    acceso ? el("p", { class: "t-razon", text: "Porque marcaste: " + (esPractica(r) ? "actividades prácticas" + (dimensionesCoincidentes(r).length ? "; " : "") : "") + dimensionesCoincidentes(r).map((d) => `${DIMENSIONES[d - 1][0]} (${FRECUENCIAS[estudianteActual().dimensiones[d]].toLowerCase()})`).join(", ") + "." }) : dua && coincidencias(r).length ? el("p", { class: "t-razon", text: "Responde a lo que marcaste: " + coincidencias(r).map(etiqueta).join(", ") + "." }) : null,
    r.tipo === "objetivos" && r.subtipo === "eliminacion" ? el("strong", { class: "ultimo-recurso", text: "Último recurso" }) : null,
    !dua && APOYOS_FORMA.includes(r.id) ? el("p", { class: "aviso-apoyos" }, el("strong", { text: "¿Lo que se evalúa es esa habilidad? " }), el("span", { text: "Úsalo solo si esta habilidad no es lo que estás evaluando" })) : null,
    el(dua || trabajo || ["objetivos", "practica-profesional"].includes(r.tipo) ? "h4" : "h3", { text: textoModalidad(r.titulo, r, persona) }),
    ofrecida ? el("p", { class: "aviso-cruzado", role: "status", text: "Ya está considerado en el DUA: " + version.titulo }) : null,
    dua && estudiantesCubiertos(r) ? el("p", { class: "aviso-cruzado", role: "status", text: avisoDua(r) }) : null,
    el("ol", {}, (dua ? r.como.map(textoPublico) : pasosApoyo(r, persona)).map((p) => el("li", { text: p }))),
    version ? el("div", { class: "version-curso", id: "version-" + r.id, tabindex: "-1" }, el("p", { text: "Versión para todo el curso: " + version.titulo }),
      preguntar ? el("div", { role: "status" }, el("p", { text: `Este apoyo lo necesitan ${repetida} estudiantes. ¿Quieres agregar su versión a todo el curso?` }),
        el("div", { class: "acciones-intro" },
          el("button", { type: "button", class: "boton", id: "curso-" + r.id, text: "Sí, agregar al curso", onclick: () => agregarVersionCurso(r) }),
          el("button", { type: "button", class: "boton", id: "individual-" + r.id, text: "No, mantener individual", onclick: () => {
            estado.mantenerIndividual = [...new Set([...(estado.mantenerIndividual || []), r.id])]; guardar(); pintarApoyos(); document.getElementById("version-" + r.id).focus();
          } }))) : el("button", { type: "button", class: "boton", id: "curso-" + r.id, ...(ofrecida ? { disabled: "" } : {}), text: ofrecida ? "Ya está en el curso" : "Agregar al curso", onclick: () => agregarVersionCurso(r) })) : null,
    repetida >= 2 && !version ? el("p", { class: "aviso-apoyos", role: "status", text: `Este apoyo lo eligieron ${repetida} estudiantes` }) : null,
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
  const lista = visibles(), primeras = primerasDua(lista), destacadas = new Set(primeras.map((r) => r.id)), resto = lista.filter((r) => !destacadas.has(r.id));
  $("#tarjetas").replaceChildren(
    ...(primeras.length ? [el("section", { "aria-labelledby": "t-dua-empezar" }, el("h3", { id: "t-dua-empezar", text: "Para empezar" }), el("p", { class: "ayuda", text: "Las acciones que mejor responden a lo que describiste." }), el("ul", { class: "tarjetas" }, primeras.map((r) => tarjeta(r, true))))] : []),
    ...MOMENTOS.filter(([id]) => resto.some((r) => r.momento === id)).map(([id, nombre]) =>
      grupoPlegado(nombreMomento(id, nombre), resto.filter((r) => r.momento === id))));
  $("#conteo").textContent = plural(lista.length, "acción", "acciones");
}

function alternar(id, estudianteId = estado.estudianteActivo, trabajadorId = estado.trabajadorActivo) {
  const r = catalogo.find((r) => r.id === id);
  if (!r) return;
  const trabajo = r.tipo === "trabajo", persona = trabajo ? estado.trabajadores.find((e) => e.id === trabajadorId) : estado.estudiantes.find((e) => e.id === estudianteId);
  const seleccion = r.tipo === "dua" ? estado.seleccion : persona?.seleccion;
  if (!seleccion) return;
  if (r.tipo !== "dua") marcarRevision(persona);
  const foco = document.activeElement.id;
  const siguientes = foco.startsWith("quitar-clase-") ? elegidasOrdenadas().map(r => "quitar-clase-" + r.id) : [];
  const siguiente = siguientes[siguientes.indexOf(foco) + 1];
  const agregada = !Object.hasOwn(seleccion, id);
  if (!agregada) delete seleccion[id]; else seleccion[id] = "";
  guardar(); if (trabajo) pintarTrabajo(); else { pintarTarjetas(); pintarApoyos(); } pintarSeleccion();
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
    (document.getElementById(foco) || (foco.startsWith("quitar-clase-") ? document.getElementById(siguiente) || $("#t-seleccion-dua") : $("#mochila .quitar") || $("#t-seleccion"))).focus();
  }
}

function elegidasOrdenadas(seleccion = estado.seleccion) {
  return catalogo.filter((r) => Object.hasOwn(seleccion, r.id) && aplica(r))
    .sort((a, b) => a.tipo === "dua" && b.tipo === "dua" ? compararDua(a, b) : ordenApoyo(a) - ordenApoyo(b) || a.id.localeCompare(b.id, "es", { numeric: true }));
}
function totalElegidas() { return Object.keys(estado.seleccion).length + estado.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) + (estado.trabajadores || []).reduce((n, e) => n + Object.keys(e.seleccion).length, 0); }
function pintarSeleccion() {
  const trabajo = estado.ambito === "trabajo", sel = trabajo ? [] : elegidasOrdenadas(), total = trabajo ? estado.trabajadores.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) : Object.keys(estado.seleccion).length + estado.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0);
  $("#n-sel").textContent = total;
  $("#abrir-mochila").setAttribute("aria-label", `Mi mochila: ${plural(total, "elegida", "elegidas")}`);
  $("#sel-curso-titulo").hidden = !sel.length;
  $("#sel-vacia").hidden = total > 0;
  $("#pdf").disabled = !sel.length && !estado.estudiantes.some(datosEstudiante);
  actualizarRespaldo(); actualizarContinuar();
  const nombreMomento = nombresMomentos();
  $("#sel-lista").replaceChildren(...sel.map((r) => itemSeleccion(r)));
  $("#dua-seleccion").replaceChildren(...sel.map((r) => itemSeleccion(r, null, "quitar-clase-")));
  $("#dua-seleccion-vacia").hidden = sel.length > 0;
  $("#documento-clase").disabled = !sel.length && !estado.perfil.reflexion;
  $("#sel-estudiantes").replaceChildren(...(trabajo ? [] : estado.estudiantes).filter((e) => Object.keys(e.seleccion).length).map((e) =>
    el("section", {}, el("h3", { text: tituloEstudiante(e) }), el("p", { class: "ayuda", text: subtituloEstudiante() }),
      ...Object.keys(GRUPOS_APOYOS).filter((tipo) => elegidasOrdenadas(e.seleccion).some((r) => r.tipo === tipo)).map((tipo) =>
        el("div", {}, el("h4", { text: esSuperior() && ["acceso", "adicional"].includes(tipo) ? "Ajustes razonables" : GRUPOS_APOYOS[tipo] }), el("ol", { class: "sel-lista" }, elegidasOrdenadas(e.seleccion).filter((r) => r.tipo === tipo).map((r) => itemSeleccion(r, e))))))));
  const laborales = (estado.trabajadores || []).filter((e) => Object.keys(e.seleccion).length);
  $("#seleccion-trabajo").hidden = !trabajo || !laborales.length;
  $("#pdf").hidden = trabajo;
  $("#borrar").textContent = trabajo ? "Borrar los datos de Trabajo" : "Borrar los datos de Educación";
  $("#sel-vacia").textContent = trabajo ? "Todavía no eliges ajustes. Usa el botón «Elegir» de cada ajuste." : "Todavía no eliges acciones ni apoyos. Usa el botón «Elegir».";
  $("#sel-trabajadores").replaceChildren(...(trabajo ? laborales : []).map((e) => el("section", {}, el("h4", { text: tituloTrabajador(e) }), el("ol", { class: "sel-lista" }, elegidasTrabajo(e).map((r) => itemSeleccion(r, e, "quitar-trabajo-", true))))));
  function itemSeleccion(r, e, prefijo = "quitar-", trabajo = false) {
    const seleccion = e ? e.seleccion : estado.seleccion;
    const claveNota = (trabajo ? "trabajo:" + e.id : e ? e.id : "curso") + ":" + r.id;
    const nota = el("textarea", { "data-nota-clave": claveNota, rows: "2", maxlength: "2000", "aria-label": "Nota para: " + textoModalidad(r.titulo, r, e) + (e ? " · " + (trabajo ? nombreTrabajador(e) : nombreEstudiante(e)) : " · Curso"), placeholder: "Nota opcional: cómo la usarás" });
    nota.value = seleccion[r.id] || "";
    nota.addEventListener("input", () => {
      if (e && seleccion[r.id] !== nota.value) marcarRevision(e);
      seleccion[r.id] = nota.value;
      document.querySelectorAll("textarea[data-nota-clave]").forEach((otra) => { if (otra !== nota && otra.getAttribute("data-nota-clave") === claveNota) otra.value = nota.value; });
      guardar(); if (trabajo) pintarEstadoTrabajo(); else pintarEstadoCasos();
      if (!privacidadAvisada && nota.value) mostrarAvisoPrivacidad(nota);
    });
    return el("li", {}, el("span", { class: "sel-momento", text: e ? tipoOficial(r) : nombreMomento[r.momento] }),
      el("span", { class: "sel-titulo", text: textoModalidad(r.titulo, r, e) }), e && !compatibleModalidad(r, e) ? el("p", { class: "aviso-apoyos", text: "Revisa este apoyo: no corresponde a la modalidad actual." }) : null, nota,
      el("button", { type: "button", class: "quitar", id: prefijo + (e ? e.id + "-" : "") + r.id, onclick: () => alternar(r.id, trabajo ? undefined : e?.id, trabajo ? e.id : undefined), "aria-label": "Quitar: " + textoModalidad(r.titulo, r, e) + ", " + (e ? (trabajo ? nombreTrabajador(e) : nombreEstudiante(e)) : "del curso"), text: "Quitar" }));
  }
}

function sincronizarPerfil() {
  const p = borradorDua?.perfil || estado.perfil;
  $("#nivel").value = estado.perfil.nivel; $("#meta").value = p.meta;
  $("#practica").checked = p.practica;
  $("#practica-campo").hidden = estado.pestana !== "dua" || !hayPracticas();
  $("#reflexion").value = estado.perfil.reflexion || "";
  for (const nombre of ["actividad", "evidencia"]) document.querySelectorAll(`input[name="${nombre}"]`).forEach((c) => { c.checked = p[nombre].includes(c.value); });
  aplicarVocabulario();
}
function escucharPerfil() {
  const contexto = () => {
    const nivel = $("#nivel").value;
    const cantidad = estado.estudiantes.filter(datosEstudiante).length;
    if (nivel !== estado.perfil.nivel && cantidad && !window.confirm(`Cambiar el nivel cambia los apoyos sugeridos de tus ${cantidad} casos. Lo que ya elegiste se conserva`)) { $("#nivel").value = estado.perfil.nivel; return; }
    if (nivel !== estado.perfil.nivel) estado.estudiantes.forEach(marcarRevision);
    estado.perfil.nivel = nivel;
    guardar(); aplicarVocabulario(); pintarControles(); pintarTarjetas(); pintarApoyos(); pintarSeleccion(); sincronizarAcuerdos(); resumenClase();
    $("#practica-campo").hidden = estado.pestana !== "dua" || !hayPracticas();
  };
  $("#nivel").addEventListener("change", contexto);
  $("#perfil").addEventListener("input", (evento) => {
    if (!evento.target.matches('#meta, #practica, input[name="actividad"], input[name="evidencia"]')) return;
    if (!borradorDua) abrirClase();
    borradorDua.perfil.meta = $("#meta").value.slice(0, 500);
    borradorDua.perfil.practica = $("#practica").checked;
    for (const nombre of ["actividad", "evidencia"]) borradorDua.perfil[nombre] = [...document.querySelectorAll(`input[name="${nombre}"]:checked`)].map((c) => c.value);
  });
}

function hayDatos() {
  const p = estado.perfil;
  return Boolean(estado.necesidades.length || p.nivel || p.meta || p.actividad.length || p.evidencia.length || totalElegidas() || estado.estudiantes.some(datosEstudiante) || (estado.trabajadores || []).some(datosTrabajador) || estado.estudiantes.length > 1 || estado.perfil.practica || estado.perfil.reflexion || estado.asignatura || estado.momentos.length || estado.propositos.length);
}

function actualizarRespaldo() {
  $("#guardar-respaldo").disabled = !hayDatos();
}

function guardarRespaldo() {
  const guardado = new Date().toISOString();
  const datos = { app: "prizma", version: 2, ambito: estado.ambito, versionSituaciones: estado.versionSituaciones, catalogo: VERSION_CATALOGO, guardado, perfil: estado.perfil, claseGuardada: estado.claseGuardada, mantenerIndividual: estado.mantenerIndividual, seleccion: estado.seleccion, trabajadores: estado.trabajadores, trabajadorActivo: estado.trabajadorActivo, estudiantes: estado.estudiantes, estudianteActivo: estado.estudianteActivo, propositos: estado.propositos, necesidades: estado.necesidades, momentos: estado.momentos, asignatura: estado.asignatura };
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
  if (datos.trabajadores !== undefined && (!Array.isArray(datos.trabajadores) || datos.trabajadores.length > 10 || datos.trabajadores.some((e) => !objeto(e) || !seleccion(e.seleccion)))) throw new Error("El archivo no se pudo leer. Revisa los casos de trabajo del respaldo.");
  const normal = normalizarDatos(datos);
  const cantidad = (datos.trabajadores || []).reduce((n, e) => n + Object.keys(e.seleccion).length, 0) + Object.keys(datos.seleccion).length + (datos.version === 2 ? datos.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) : 0);
  return { ...normal, descartadas: cantidad - normal.trabajadores.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) - Object.keys(normal.seleccion).length - normal.estudiantes.reduce((n, e) => n + Object.keys(e.seleccion).length, 0) };
}

async function abrirRespaldo(evento) {
  const input = evento.target, archivo = input.files[0], aviso = $("#respaldo-estado");
  if (!archivo) return;
  try {
    // Admite el curso y diez casos por ámbito, con notas de hasta 2000 caracteres en UTF-8.
    if (archivo.size > 12 * 1024 * 1024) throw new Error("El archivo es demasiado grande para ser un respaldo de Prizma.");
    let datos;
    try { datos = JSON.parse(await archivo.text()); }
    catch (e) { throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); }
    const { descartadas, ...normal } = validarRespaldo(datos);
    if (hayDatos() && !window.confirm(`Esto reemplaza los datos de tu ${voc("clase")}, tu selección y todos tus estudiantes y los casos de trabajo por los del respaldo. ¿Continuar?`)) {
      aviso.textContent = "No se abrió el respaldo. Tus datos siguen igual.";
      return;
    }
    estado = normal; avisarInstrumentos(); inclusionDocumento = null; inclusionTrabajo = null; borradorDua = null;
    if (!estado.claseGuardada) editarClase(); else abrirPaso("paso-clase", false);
    if (estado.ambito) { history.replaceState(null, "", estado.ambito === "trabajo" ? "#trabajo" : "#dua"); mostrarPestana(estado.ambito === "trabajo" ? "trabajo" : "dua"); } else { history.replaceState(null, "", "#inicio"); mostrarInicio(); } guardar(); sincronizarTrabajo(); sincronizarEstudiante(); sincronizarPerfil(); pintarControles(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
    aviso.textContent = `Respaldo abierto: ${plural(totalElegidas(), "acción", "acciones")}.` +
      (descartadas ? ` ${plural(descartadas, "acción", "acciones")} ${descartadas === 1 ? "ya no está en el catálogo y no se cargó." : "ya no están en el catálogo y no se cargaron."}` : "");
  } catch (e) { aviso.textContent = e.message; }
  finally { input.value = ""; }
}

let inclusionTrabajo = null;
let seccionesTrabajo = { barreras: false, voz: false, ajustes: true };
function prepararDocumentoTrabajo() {
  centroDocumento = null; inclusionDocumento = null; inclusionTrabajo = [];
  seccionesTrabajo = { barreras: false, voz: false, ajustes: true };
  solicitudDocumento++; origenDocumento = document.activeElement?.closest("#mochila") ? $("#abrir-mochila") : document.activeElement;
  $("#generar-documento").disabled = false;
  $("#t-incluir-documento").textContent = "¿Qué personas incluirás en el documento de trabajo?";
  $("#opciones-documento").replaceChildren(
    el("p", { class: "ayuda", text: "La persona decide qué contar. Revisa con ella los datos, las notas y los ajustes antes de compartir el documento." }),
    el("fieldset", {}, el("legend", { text: "Secciones que la persona decide compartir" }), ...[["barreras", "Barreras y situaciones"], ["voz", "Lo que dice la persona"], ["ajustes", "Ajustes acordados"]].map(([id, texto]) => {
      const campo = el("input", { type: "checkbox", name: "seccion-trabajo", value: id }); campo.checked = seccionesTrabajo[id];
      campo.addEventListener("change", () => { seccionesTrabajo[id] = campo.checked; });
      return el("label", {}, campo, texto);
    })),
    ...estado.trabajadores.filter(datosTrabajador).map((e) => {
      const campo = el("input", { type: "checkbox", name: "incluir", value: "trabajo:" + e.id }); campo.checked = false;
      return el("label", {}, campo, tituloTrabajador(e));
    }));
  $("#error-documento").textContent = ""; $("#mochila").close(); $("#incluir-documento").showModal(); $("#t-incluir-documento").focus();
}
function documentoTrabajo(ids = inclusionTrabajo || []) {
  const personas = (estado.trabajadores || []).filter((e) => ids.includes(e.id)), usadas = seccionesTrabajo.ajustes ? personas.flatMap(elegidasTrabajo) : [];
  return { trabajo: true, titulo: "Plan de ajustes en el trabajo", fecha: new Date().toLocaleDateString("es-CL"), logo: logoDocumento(),
    resumen: [["Fecha", new Date().toLocaleDateString("es-CL")], ["Contenido", personas.map(tituloTrabajador).join("; ") || "Sin personas elegidas"]],
    grupos: personas.map((e) => {
      const acciones = seccionesTrabajo.ajustes ? elegidasTrabajo(e) : [];
      return { trabajador: e.id, nombre: tituloTrabajador(e), subtitulo: "Tipo de puesto: " + (e.tipoPuesto.trim() || "Sin indicar"), ...(seccionesTrabajo.voz ? { ayuda: e.ayuda.trim() || "Sin información", voz: e.voz.trim() || "Sin información", modalidad: MODALIDADES[e.modalidad || ""], compartir: (e.compartir || "").trim() || "No informado" } : {}),
        acuerdo: seccionesTrabajo.ajustes ? normalizarAcuerdo(e.acuerdo, ROLES_TRABAJO) : null, estadoAcuerdo: estadoCaso(e, true),
        cif: seccionesTrabajo.barreras ? Object.entries(e.dimensiones).map(([d, f]) => [DIMENSIONES[d - 1][0], FRECUENCIAS[f], acciones.filter((r) => r.dimensiones.includes(Number(d))).map((r) => r.titulo).join("; ") || "Sin ajuste elegido"]) : null,
        acciones: acciones.map((r) => ({ id: r.id, titulo: textoModalidad(r.titulo, r, e), como: pasosApoyo(r, e), porque: r.porque, grupo: TIPOS_TRABAJO[r.subtipo], nota: e.seleccion[r.id].trim(), dato: tipoOficial(r) + ". Respaldo: " + RESPALDO[r.respaldo] + "." })) };
    }),
    fuentes: [...new Set(usadas.flatMap((r) => r.fuentes))].map((id) => ({ cita: fuentes[id].cita, url: fuentes[id].url })) };
}
function modeloDocumento() {
  const d = centroDocumento || (inclusionTrabajo !== null ? documentoTrabajo() : documento());
  return { ...d, borrador: d.centro ? centroDocumento.borrador : d.grupos.some((g) => (g.estudiante || g.trabajador) && g.estadoAcuerdo !== "Acuerdos completos") };
}

const AVISO = "Orientación pedagógica. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas.";

// Un solo modelo del documento para la vista previa, la impresión y el PDF descargable.
function prepararDocumento() {
  inclusionTrabajo = null; $("#t-incluir-documento").textContent = "¿Qué incluirás en el documento?";
  centroDocumento = null;
  solicitudDocumento++;
  origenDocumento = document.activeElement?.closest("#mochila") ? $("#abrir-mochila") : document.activeElement;
  $("#generar-documento").disabled = false;
  inclusionDocumento = { curso: true, estudiantes: estado.pestana !== "dua" && datosEstudiante(estudianteActual()) ? [estado.estudianteActivo] : [] };
  $("#opciones-documento").replaceChildren(...[["curso", "Acciones para todo el curso"], ...estado.estudiantes.filter(datosEstudiante).map((e) => ["alumno:" + e.id, tituloEstudiante(e)])].map(([id, texto]) => {
    const c = el("input", { type: "checkbox", value: id, name: "incluir" });
    c.checked = id === "curso" || inclusionDocumento.estudiantes.includes(id.slice(7));
    c.addEventListener("change", () => { $("#error-documento").textContent = [...document.querySelectorAll('input[name="incluir"]:checked')].some(n => n.value.startsWith("alumno:")) ? "Incluirás datos de un estudiante. Revisa con quién compartirás este documento" : ""; });
    return el("label", {}, c, texto);
  }));
  $("#error-documento").textContent = "";
  $("#mochila").close();
  $("#incluir-documento").showModal(); $("#t-incluir-documento").focus();
}
async function generarDocumento() {
  const ids = [...document.querySelectorAll('input[name="incluir"]:checked')].map((c) => c.value);
  if (!ids.length) { $("#error-documento").textContent = inclusionTrabajo !== null ? "Elige al menos una persona trabajadora." : "Elige el curso o al menos un estudiante."; return; }
  if (inclusionTrabajo !== null) inclusionTrabajo = ids.filter((id) => id.startsWith("trabajo:")).map((id) => id.slice(8));
  else inclusionDocumento = { curso: ids.includes("curso"), estudiantes: ids.filter((id) => id.startsWith("alumno:")).map((id) => id.slice(7)) };
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
function documentoParaCentro(ids, decision) {
  if (decision !== true || !elegidasCentro().length) return null;
  const acciones = elegidasCentro().filter((r) => ids.includes(r.id)).map((r) => ({ titulo: r.titulo, como: r.como.map(textoPublico), porque: r.porque, dato: "" }));
  if (!acciones.length) return null;
  return { centro: true, borrador: estadoCaso(estudianteActual()) !== "Acuerdos completos", titulo: "Ajustes acordados para la práctica", fecha: new Date().toLocaleDateString("es-CL"), logo: logoDocumento(),
    resumen: ["Estudiante", "Centro de práctica", "Profesor tutor o coordinador", "Fecha"].map((t) => [t, "__________________________________"]), acciones };
}
function actualizarDecisionCentro() {
  const tiene = document.querySelectorAll('input[name="compartir-centro"]:checked').length > 0;
  $("#ver-centro").disabled = !tiene || !$("#decision-centro").checked;
  $("#decision-centro-ayuda").textContent = !tiene ? "Marca al menos un ajuste para incluir." : !$("#decision-centro").checked ? "Para ver el documento, el estudiante debe revisarlo y decidir compartirlo." : "Se incluirán solo los ajustes marcados, sin datos personales ni notas.";
}
function prepararCentro() {
  if (!elegidasCentro().length) return;
  inclusionTrabajo = null;
  solicitudDocumento++;
  origenCentro = document.activeElement;
  $("#decision-centro").checked = false;
  $("#opciones-centro").replaceChildren(...elegidasCentro().map((r) => {
    const campo = el("input", { type: "checkbox", name: "compartir-centro", value: r.id });
    campo.checked = true; campo.addEventListener("change", actualizarDecisionCentro);
    return el("label", {}, campo, r.titulo);
  }));
  $("#error-centro").textContent = ""; actualizarDecisionCentro();
  $("#documento-centro").showModal(); $("#t-documento-centro").focus();
}
async function verDocumentoCentro() {
  if (!$("#documento-centro").open) return;
  const ids = [...document.querySelectorAll('input[name="compartir-centro"]:checked')].map((c) => c.value);
  const d = documentoParaCentro(ids, $("#decision-centro").checked), estudiante = estado.estudianteActivo;
  if (!d) return;
  const solicitud = ++solicitudDocumento;
  $("#ver-centro").disabled = true; $("#error-centro").textContent = "Preparando documento…";
  try { await prepararPdf(); }
  catch (e) { if (solicitud === solicitudDocumento) { $("#error-centro").textContent = "No se pudo preparar el documento. Reintenta."; actualizarDecisionCentro(); } return; }
  if (solicitud !== solicitudDocumento || !$("#documento-centro").open || estudiante !== estado.estudianteActivo || !$("#decision-centro").checked ||
      JSON.stringify(ids) !== JSON.stringify([...document.querySelectorAll('input[name="compartir-centro"]:checked')].map((c) => c.value))) return;
  centroDocumento = d; armarHoja(); $("#documento-centro").close();
  $("#vista-estado").textContent = ""; $("#vista").showModal(); $("#cerrar").focus();
}
function prepararPracticaProfesional() {
  $("#enlace-guia-practica").addEventListener("click", (evento) => {
    evento.preventDefault(); origenGuiaPractica = evento.currentTarget;
    $("#guia-practica-media").hidden = esSuperior(); $("#guia-practica-superior").hidden = !esSuperior();
    $("#guia-practica").showModal(); $("#t-guia-practica").focus();
  });
  $("#guia-practica-entendido").addEventListener("click", () => $("#guia-practica").close());
  $("#guia-practica").addEventListener("close", () => origenGuiaPractica?.focus());
  $("#preparar-centro").addEventListener("click", prepararCentro);
  $("#decision-centro").addEventListener("change", actualizarDecisionCentro);
  $("#ver-centro").addEventListener("click", verDocumentoCentro);
  $("#cancelar-centro").addEventListener("click", () => $("#documento-centro").close());
  $("#documento-centro").addEventListener("close", () => { solicitudDocumento++; if (!centroDocumento) origenCentro?.focus(); });
}
function logoDocumento() {
  const svg = typeof document !== "undefined" ? $(".logo")?.outerHTML || "" : "";
  return svg.replace(/currentColor/g, "#18213f").replace(/var\(--motivar\)/g, "#b0145a").replace(/var\(--presentar\)/g, "#00727d").replace(/var\(--mostrar\)/g, "#5a33a8");
}
function documento(opciones = inclusionDocumento || { curso: true, estudiantes: datosEstudiante(estudianteActual()) ? [estado.estudianteActivo] : [] }) {
  const sel = opciones.curso ? elegidasOrdenadas() : [], alumnos = estado.estudiantes.filter((e) => opciones.estudiantes.includes(e.id));
  const usadas = [...sel, ...alumnos.flatMap((e) => elegidasOrdenadas(e.seleccion))];
  const accion = (r, seleccion, persona) => ({ id: r.id, titulo: textoModalidad(r.titulo, r, persona), como: pasosApoyo(r, persona), porque: r.porque, nota: (seleccion[r.id] || "").trim(),
    ofrecida: r.tipo !== "dua" && Boolean(versionCurso(r) && Object.hasOwn(estado.seleccion, versionCurso(r).id)),
    dato: (r.tipo === "dua" ? `Acción para todo el curso. DUA 3.0, consideración ${r.consideracion}: ${CONSIDERACIONES[r.consideracion]}.` : tipoOficial(r) + "." + (r.dua ? ` Versión DUA 3.0, consideración ${r.dua}.` : "")) + ` Respaldo: ${RESPALDO[r.respaldo]}.` + (r.tipo === "dua" && avisoDua(r) ? " " + avisoDua(r) + "." : ""),
    revisionModalidad: Boolean(persona && !compatibleModalidad(r, persona)),
    grupo: r.tipo === "practica-profesional" ? "Práctica profesional · " + nombreGrupoPractica(r.subtipo) : r.tipo === "acceso" ? `${esSuperior() ? "Ajustes razonables" : GRUPOS_APOYOS.acceso} · ${TIPOS_ACCESO[r.subtipo]}` : GRUPOS_APOYOS[r.tipo],
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
      .concat(opciones.curso && estado.perfil.reflexion?.trim() ? [{ nombre: "Después de la clase: ¿qué funcionó?", reflexion: estado.perfil.reflexion.trim(), acciones: [] }] : [])
      .concat(alumnos.map((e) => {
        const apoyos = elegidasOrdenadas(e.seleccion);
        return { estudiante: e.id, acuerdo: normalizarAcuerdo(e.acuerdo), estadoAcuerdo: estadoCaso(e), nombre: tituloEstudiante(e), subtitulo: subtituloEstudiante(),
          cif: Object.entries(e.dimensiones).map(([d, f]) => [DIMENSIONES[d - 1][0], FRECUENCIAS[f], apoyos.filter((r) => r.dimensiones.includes(Number(d))).map((r) => r.titulo).join("; ") || "Sin apoyo elegido"]),
          ayuda: e.ayuda.trim() || "Sin información", voz: e.voz.trim() || "Sin información", modalidad: MODALIDADES[e.modalidad || ""], paci: e.paci, paec: e.paec, dec: e.dec, acciones: apoyos.map((r) => accion(r, e.seleccion, e)),
        };
      })),
    fuentes: [...new Set(usadas.flatMap((r) => r.fuentes))].map((id) => ({ cita: fuentes[id]?.cita || id, url: fuentes[id]?.url || "" })),
  };
}
function datosContexto(g) {
  return [["¿Qué usa hoy para comunicarse o acceder?", g.modalidad || "No aplica"], ...(g.trabajador ? [["¿Qué decidió compartir la persona y con quién?", g.compartir || "No informado"]] : esSuperior() ? [] : [["Tiene PACI", g.paci ? "Sí" : "No informado"], ["Tiene PAEC", g.paec ? "Sí" : "No informado"], ["Se aplica el protocolo DEC del establecimiento", g.dec ? "Sí" : "No informado"]])];
}
function datosAcuerdo(g) {
  const a = g.acuerdo || normalizarAcuerdo(), roles = g.trabajador ? ROLES_TRABAJO : ROLES_ACUERDO;
  return [["Acordado con", a.roles.map((r) => roles[r]).join(", ")], ["Fecha", fechaLarga(a.fecha)], ["Próxima revisión", fechaLarga(a.revision)], ["¿Cómo sabremos que funciona?", a.criterio]].map(([k, v]) => `${k}: ${v || "__________________________________"}`);
}
function armarHoja() {
  const d = modeloDocumento();
  const tabla = (columnas, filas, clase = "") => el("table", { class: clase }, el("thead", {}, el("tr", {}, columnas.map((t) => el("th", { scope: "col", text: t })))),
    el("tbody", {}, filas.map((fila) => el("tr", {}, fila.map((t, i) => el(i ? "td" : "th", i ? { text: t } : { scope: "row", text: t }))))));
  const ficha = (a) => el("div", { class: "h-accion" }, el("h3", { text: a.titulo }), a.revisionModalidad ? el("p", { class: "aviso-apoyos", text: "Revisa este apoyo: no corresponde a la modalidad actual." }) : null, el("ol", {}, a.como.map((t) => el("li", { text: t }))),
    el("p", {}, el("strong", { text: "Por qué funciona: " }), a.porque), el("p", { class: "h-dato", text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : "") }),
    a.nota ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), a.nota) : null);
  if (d.centro) {
    $("#hoja").replaceChildren(
      el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })),
      el("h1", { text: d.titulo }), ...(d.borrador ? [el("p", { class: "aviso-apoyos", text: "Borrador: acuerdos sin completar" })] : []), tabla(["Campo", "Completar a mano"], d.resumen, "h-resumen"),
      ...d.acciones.map(ficha), el("div", { class: "h-acuerdos" }, el("h2", { text: "Acuerdos (para completar en la reunión)" }),
        ...["Acordado con", "Fecha", "Próxima revisión", "¿Cómo sabremos que funciona?"].map((t) => el("p", { text: t + ": __________________________________" }))),
      el("p", { class: "h-aviso", text: PIE_PRACTICA }), el("p", { class: "h-aviso", text: AVISO }));
    return;
  }
  $("#hoja").replaceChildren(...[
    el("div", { class: "h-marca" }, d.logo ? el("img", { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(d.logo), width: "44", height: "44", alt: "" }) : null, el("strong", { text: "Prizma" })),
    el("h1", { text: d.titulo }), ...(d.borrador ? [el("p", { class: "aviso-apoyos", text: "Borrador: acuerdos sin completar" })] : []), tabla(["Resumen", "Información"], d.resumen, "h-resumen"),
    d.curso ? el("h2", { text: "Acciones para todo el curso" }) : null,
    ...d.grupos.map((g) => el("section", { class: (g.estudiante || g.trabajador) ? "h-estudiante" : "h-momento" },
      el((g.estudiante || g.trabajador) ? "h2" : "h3", { text: g.nombre }), g.subtitulo ? el("p", { text: g.subtitulo }) : null,
      g.cif ? el("div", {}, el("h3", { text: CIF_TITULO }), el("p", { class: "h-dato", text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO }),
        el("div", { class: "tabla-cif", tabindex: "0", role: "region", "aria-label": CIF_TITULO }, tabla(d.trabajo ? ["Situación", "Frecuencia", "Ajustes elegidos para esa situación"] : CIF_COLUMNAS, g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]], "h-cif"))) : null,
      g.voz !== undefined ? tabla(["Facilitadores y voz", "Información"], [["Le ayuda", g.ayuda], [d.trabajo ? "Qué dice la persona" : (esSuperior() ? "Qué dice el estudiante" : "Qué dicen el estudiante y su familia"), g.voz], ...datosContexto(g)], "h-facilitadores") : null,
      g.reflexion ? el("p", { text: g.reflexion }) : null,
      ...g.acciones.flatMap((a, i) => [(g.estudiante || g.trabajador) && a.grupo !== g.acciones[i - 1]?.grupo ? el("h3", { class: "h-grupo", text: a.grupo }) : null, ficha(a)]),
      (g.estudiante || g.trabajador && g.acuerdo) ? el("div", { class: "h-acuerdos" }, el("h3", { text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)" }), ...datosAcuerdo(g).map((text) => el("p", { text })), g.estadoAcuerdo === "Por revisar" ? el("p", { text: "Por revisar: cambiaste el caso después del acuerdo." }) : null) : null)),
    el("section", { class: "h-fuentes-seccion" }, el("h2", { text: "Fuentes" }), el("ol", { class: "h-fuentes" }, d.fuentes.map((f) => el("li", {}, f.cita, el("p", { class: "h-dato", text: f.url })))), el("p", { class: "h-aviso", text: d.trabajo ? AVISO_TRABAJO : AVISO }))].filter(Boolean));
}
function definicionPdf() {
  const d = modeloDocumento(), margen = 56.7, ancho = 595.28 - 2 * margen;
  const fino = { hLineWidth: () => .4, vLineWidth: () => .4, hLineColor: () => "#aaaaaa", vLineColor: () => "#aaaaaa", paddingLeft: () => 6, paddingRight: () => 6, paddingTop: () => 5, paddingBottom: () => 5 };
  const ficha = (a) => ({ unbreakable: true, margin: [0, 0, 0, 12], stack: [
    { text: a.titulo, style: "h3" }, ...(a.revisionModalidad ? [{ text: "Revisa este apoyo: no corresponde a la modalidad actual.", bold: true }] : []), { ol: [...a.como], margin: [0, 4, 0, 4] },
    { text: [{ text: "Por qué funciona: ", bold: true }, a.porque] }, { text: a.dato + (a.ofrecida ? " También ofrecido a todo el curso." : ""), style: "dato", margin: [0, 4, 0, 0] },
    ...(a.nota ? [{ table: { widths: ["*"], body: [[{ text: [{ text: "Mi nota: ", bold: true }, a.nota], fillColor: "#f2f2f2", margin: [5, 5, 5, 5] }]] }, layout: "noBorders", margin: [0, 5, 0, 0] }] : []),
  ] });
  const contenido = d.centro ? [
    { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] },
    { text: d.titulo, style: "h1" },
    ...(d.borrador ? [{ text: "Borrador: acuerdos sin completar", bold: true, margin: [0, 8, 0, 8] }] : []),
    { table: { widths: [150, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: fino, margin: [0, 12, 0, 18] },
    ...d.acciones.map(ficha),
    { unbreakable: true, stack: [{ text: "Acuerdos (para completar en la reunión)", style: "h2" }, ...["Acordado con", "Fecha", "Próxima revisión", "¿Cómo sabremos que funciona?"].map((t) => ({ text: t + ": __________________________________________________", margin: [0, 12, 0, 0] }))] },
    { text: PIE_PRACTICA, style: "dato", margin: [0, 18, 0, 0] },
    { text: AVISO, style: "dato", margin: [0, 14, 0, 0] },
  ] : [
    { columns: [...(d.logo ? [{ svg: d.logo, width: 36 }] : []), { text: "Prizma", style: "h1", margin: [6, 6, 0, 0] }], margin: [0, 0, 0, 8] },
    { text: d.titulo, style: "h1" },
    ...(d.borrador ? [{ text: "Borrador: acuerdos sin completar", bold: true, margin: [0, 8, 0, 8] }] : []),
    { table: { widths: [110, "*"], body: d.resumen.map(([k, v]) => [{ text: k, bold: true }, v]) }, layout: { ...fino, vLineWidth: () => 0, hLineWidth: () => .3 }, margin: [0, 8, 0, 14] },
    ...(d.curso && !d.grupos.some((g) => !(g.estudiante || g.trabajador)) ? [{ text: "Acciones para todo el curso", style: "h2", headlineLevel: 1 }] : []),
    ...d.grupos.flatMap((g) => [
      ...(g.reflexion ? [{ unbreakable: true, stack: [{ text: g.nombre, style: "h3" }, { text: g.reflexion, margin: [0, 5, 0, 12] }] }] : []),
      ...((g.estudiante || g.trabajador) ? [{ id: "alumno-" + (g.estudiante || g.trabajador), text: g.nombre, style: "h2", headlineLevel: 1, pageBreak: "before", margin: [0, 8, 0, 6] }] : []),
      ...((g.estudiante || g.trabajador) ? [{ text: g.subtitulo, italics: true, margin: [0, 0, 0, 8] }] : []),
      ...(g.cif ? [
        { text: CIF_TITULO, style: "h3", headlineLevel: 2 }, { text: d.trabajo ? "Las situaciones describen barreras del puesto, no diagnósticos. La persona decide qué contar." : CIF_AVISO, style: "dato", margin: [0, 3, 0, 5] },
        { table: { headerRows: 1, widths: [ancho * .38 - 13, ancho * .18 - 13, ancho * .44 - 13], body: [(d.trabajo ? ["Situación", "Frecuencia", "Ajustes elegidos para esa situación"] : CIF_COLUMNAS).map((text) => ({ text, bold: true, fillColor: "#eeeeee" })), ...(g.cif.length ? g.cif : [["Sin situaciones indicadas", "—", "Sin apoyo elegido"]])] }, layout: fino, margin: [0, 0, 0, 10] },
      ] : []),
      ...(g.voz !== undefined ? [
        { table: { widths: [125, "*"], body: [[{ text: "Le ayuda", bold: true }, g.ayuda], [{ text: d.trabajo ? "Qué dice la persona" : (esSuperior() ? "Qué dice el estudiante" : "Qué dicen el estudiante y su familia"), bold: true }, g.voz], ...datosContexto(g)] }, layout: fino, margin: [0, 0, 0, 12] },
      ] : []),
      ...g.acciones.flatMap((a, i) => !(g.estudiante || g.trabajador) && i === 0 ? [{ unbreakable: true, stack: [
        ...(g === d.grupos[0] ? [{ text: "Acciones para todo el curso", style: "h2" }] : []),
        { text: g.nombre, style: "h3", margin: [0, 8, 0, 6] }, ficha(a),
      ] }] : (g.estudiante || g.trabajador) && a.grupo !== g.acciones[i - 1]?.grupo ? [
        { unbreakable: true, stack: [{ text: a.grupo, style: "h3", margin: [0, 8, 0, 5] }, ficha(a)] },
      ] : [ficha(a)]),
      ...((g.estudiante || g.trabajador && g.acuerdo) ? [{ unbreakable: true, margin: [0, 10, 0, 0], stack: [{ text: d.trabajo ? "Acuerdos" : "Acuerdos (para completar en la reunión)", style: "h3" }, ...datosAcuerdo(g).map((text) => ({ text, margin: [0, 10, 0, 0] })), ...(g.estadoAcuerdo === "Por revisar" ? [{ text: "Por revisar: cambiaste el caso después del acuerdo.", margin: [0, 8, 0, 0] }] : [])] }] : []),
    ]),
    { id: "fuentes-documento", text: "Fuentes", style: "h2", pageBreak: "before", headlineLevel: 1 },
    { ol: d.fuentes.map((f) => ({ stack: [{ text: f.cita }, { text: f.url, style: "dato", margin: [0, 2, 0, 8] }] })) },
    { table: { widths: ["*"], body: [[{ text: d.trabajo ? AVISO_TRABAJO : AVISO, style: "dato", margin: [5, 5, 5, 5] }]] }, layout: fino, margin: [0, 14, 0, 0] },
  ];
  return {
    language: "es-CL", info: { title: d.titulo, creator: "Prizma" }, pageSize: "A4", pageMargins: [margen, margen, margen, margen], content: contenido,
    pageBreakBefore: (n, siguientes) => Boolean(n.headlineLevel && siguientes.every((n) => n.headlineLevel)),
    header: (actual) => actual === 1 ? null : { margin: [margen, 20, margen, 0], stack: [
      { columns: [{ text: "Prizma · " + d.titulo, width: "*" }, { text: d.fecha, width: 115, alignment: "right" }], fontSize: 8, color: "#555555" },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: ancho, y2: 0, lineWidth: .4, lineColor: "#aaaaaa" }], margin: [0, 5, 0, 0] },
    ] },
    footer: (actual, total) => {
      // pdfmake ya asignó posiciones al contenido antes de dibujar los pies.
      const primera = Math.min(...contenido.filter((n) => n.id?.startsWith("alumno-")).map((n) => n.positions?.[0]?.pageNumber ?? Infinity));
      const fuentes = contenido.find((n) => n.id === "fuentes-documento")?.positions?.[0]?.pageNumber ?? Infinity;
      return actual === 1 ? null : { columns: [
        { text: d.trabajo ? PIE_TRABAJO : actual >= primera && actual < fuentes ? "Contiene datos de un estudiante. Guárdalo de forma segura." : "", width: "*" },
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
  const solicitud = solicitudDocumento, centro = centroDocumento;
  boton.disabled = true; aviso.textContent = "Preparando el PDF…";
  try {
    await prepararPdf();
    if (!$("#vista").open || solicitud !== solicitudDocumento || centro !== centroDocumento) return;
    const fecha = fechaLocal();
    window.pdfMake.createPdf(definicionPdf()).download(inclusionTrabajo !== null ? `prizma-trabajo-${fecha}.pdf` : centroDocumento ? `prizma-practica-${fecha}.pdf` : `prizma-${documento().grupos.some((g) => g.estudiante) ? "plan" : "curso"}-${fecha}.pdf`);
    aviso.textContent = "PDF descargado. Búscalo en tu carpeta de descargas.";
  } catch (e) {
    aviso.textContent = "No se pudo crear el PDF. Usa «Imprimir» y elige «Guardar como PDF».";
  } finally { boton.disabled = false; }
}

function imprimirPdf() {
  $("#vista-estado").textContent = "";
  try { window.pdfMake.createPdf(definicionPdf()).print(); }
  catch (e) { $("#vista-estado").textContent = "No se pudo abrir la impresión. Descarga el PDF e imprímelo desde tu lector de PDF"; }
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
      abrirClase();
    }
    const destino = $("#guia-dua").returnValue === "empezar" ? ($("#necesidades button") || $("#meta")) : origenGuiaDUA;
    if (privacidadPendiente) {
      privacidadPendiente = false;
      mostrarAvisoPrivacidad(origenAvisoPrivacidad);
    } else if (destino?.isConnected) destino.focus();
  });
}

function clavePrivacidad() { return estado.ambito === "trabajo" ? CLAVE_PRIVACIDAD + ".trabajo" : CLAVE_PRIVACIDAD; }
function cargarPrivacidad() {
  privacidadAvisada = privacidadesSesion.has(clavePrivacidad());
  try { privacidadAvisada = privacidadAvisada || localStorage.getItem(clavePrivacidad()) === "1"; } catch (e) { /* dura esta visita */ }
  $("#t-privacidad").textContent = estado.ambito === "trabajo" ? "Cuida los datos de las personas trabajadoras" : "Cuida los datos de tus estudiantes";
  const textos = estado.ambito === "trabajo" ? [
    "Prizma guarda todo solo en este navegador. No envía nada a internet ni tiene cuentas.",
    "Usa solo iniciales. No escribas nombres, RUT, diagnósticos ni datos de salud.",
    "La persona decide qué contar. Revisa el contenido con ella antes de compartirlo.",
    "Guarda reserva de los datos de las personas trabajadoras (Código del Trabajo, art. 154 ter).",
    "Si usas un computador compartido, borra los datos de Trabajo al terminar.",
    "Este aviso es una orientación, no una asesoría legal."
  ] : [
    "Prizma guarda todo solo en este navegador. No envía nada a internet ni tiene cuentas.",
    "Usa solo iniciales. No escribas nombres, RUT, diagnósticos ni datos de salud.",
    "Si usas un computador compartido, borra los datos de Educación al terminar.",
    "Desde el 1 de diciembre de 2026 rige la Ley 21.719 de protección de datos personales. Los datos de salud y de niños, niñas y adolescentes tienen protección especial.",
    "Este aviso es una orientación, no una asesoría legal."
  ];
  $("#privacidad-textos").replaceChildren(...textos.map((text) => el("li", { text })));
}
function mostrarAvisoPrivacidad(origen = document.activeElement) {
  const aviso = $("#aviso-privacidad");
  if (aviso.open) return;
  origenAvisoPrivacidad = origen;
  const abierto = document.querySelector("dialog[open]");
  if (abierto) {
    if (origen?.closest("dialog") === abierto && abierto.id === "mochila") {
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
  $("#t-guia-apoyos").textContent = esSuperior() ? "¿Qué son los ajustes razonables?" : "¿Qué son los apoyos para un estudiante?";
  $("#guia-apoyos-escolar").hidden = esSuperior();
  $("#guia-apoyos-superior").hidden = !esSuperior();
  $("#guia-apoyos").showModal();
  $("#t-guia-apoyos").focus();
}

function prepararAvisos() {
  try { privacidadAvisada = localStorage.getItem(CLAVE_PRIVACIDAD) === "1"; } catch (e) { /* se avisa una vez durante esta visita */ }
  document.querySelectorAll("#privacidad, .enlace-privacidad").forEach((enlace) => enlace.addEventListener("click", (evento) => { evento.preventDefault(); mostrarAvisoPrivacidad(enlace); }));
  $("#privacidad-entendido").addEventListener("click", () => {
    privacidadesSesion.add(clavePrivacidad());
    try { localStorage.setItem(clavePrivacidad(), "1"); } catch (e) { /* la confirmación dura esta visita */ }
    $("#aviso-privacidad").close();
  });
  $("#aviso-privacidad").addEventListener("close", () => {
    const foco = document.activeElement;
    // close puede llegar después de que la persona ya enfocó el siguiente campo.
    const devolver = dialogoPrivacidad || !foco || foco === document.body || foco.closest?.("#aviso-privacidad") === $("#aviso-privacidad") || ["t-privacidad", "privacidad-entendido"].includes(foco.id);
    if (dialogoPrivacidad) {
      const anterior = dialogoPrivacidad;
      dialogoPrivacidad = null;
      anterior.showModal();
    }
    if (devolver && origenAvisoPrivacidad?.isConnected) origenAvisoPrivacidad.focus();
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
  new ResizeObserver(([entrada]) => {
    document.documentElement.style.setProperty("--barra-alto", `${entrada.target.getBoundingClientRect().height}px`);
  }).observe($("#barra-continuar"));
  document.addEventListener("focusin", evento => {
    const barra = $("#barra-continuar"), foco = evento.target;
    if (foco.closest("dialog") || barra.contains(foco) || !barra.getClientRects().length) return;
    const limite = barra.getBoundingClientRect().top - 16, rect = foco.getBoundingClientRect();
    if (rect.bottom > limite) window.scrollBy(0, rect.bottom - limite);
  });
  const tema = $("#tema");
  const nombrarTema = () => {
    const texto = "Cambiar a modo " + (document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro");
    tema.setAttribute("aria-label", texto); tema.title = texto;
  };
  nombrarTema();
  tema.addEventListener("click", () => {
    const siguiente = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
    document.documentElement.dataset.tema = siguiente; nombrarTema();
    try { localStorage.setItem("prizma.tema", siguiente); } catch (e) { /* el tema funciona sin almacenamiento */ }
  });
  prepararAvisos(); prepararPracticaProfesional();
  let pendienteScroll = false;
  window.addEventListener("scroll", () => {
    if (pendienteScroll || !estado.ambito) return;
    pendienteScroll = true;
    requestAnimationFrame(() => {
      pendienteScroll = false;
      const borde = $("#indicador-pasos").getBoundingClientRect().bottom + 32;
      // scrollIntoView suma el padding del documento y el margen de cada paso.
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const alFinal = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
      const visibles = pasosActuales().map((id, i) => ({ nodo: $("#" + id), numero: i + 1 })).filter(({ nodo }) => {
        const arriba = nodo.getBoundingClientRect().top;
        const margen = padding + (parseFloat(getComputedStyle(nodo).scrollMarginTop) || 0);
        return !nodo.hidden && (arriba <= Math.max(borde, margen + 1) || alFinal && arriba < window.innerHeight);
      });
      if (visibles.length) actualizarPaso(visibles[visibles.length - 1].numero);
    });
  }, { passive: true });
  const cargaNecesidades = fetch("data/necesidades.json").then((r) => {
    if (!r.ok) throw new Error("necesidades");
    return r.json();
  }).then((datos) => {
    const validas = validarNecesidades(datos);
    if (!validas.length && (!Array.isArray(datos) || datos.length)) throw new Error("Necesidades inválidas");
    return validas;
  }).catch(() => { $("#necesidades-error").hidden = false; return []; });
  try {
    const [r, f, n] = await Promise.all([...["data/recomendaciones.json", "data/fuentes.json"].map((u) => fetch(u).then((x) => { if (!x.ok) throw new Error(u); return x.json(); })), cargaNecesidades]);
    fuentes = validarFuentes(f); catalogo = validarCatalogo(r, fuentes); necesidades = n;
  } catch (e) {
    $("#guia-empezar").disabled = false;
    $("#inicio-estado").textContent = $("#conteo").textContent = "No se pudo cargar el catálogo. Recarga la página; si abriste el archivo directamente, usa la versión publicada.";
    return;
  }
  $("#inicio-estado").textContent = "";
  $("#elegir-educacion").disabled = false; $("#elegir-trabajo").disabled = false;
  cargar();
  avisarInstrumentos();
  $("#proyectar").addEventListener("click", () => {
    const activo = document.documentElement.classList.toggle("proyectando");
    $("#proyectar").textContent = activo ? "Salir de proyección" : "Proyectar al curso";
    $("#proyectar").setAttribute("aria-pressed", String(activo));
  });
  prepararPestanas(); prepararPasos(); prepararTrabajo();
  sincronizarEstudiante(); escucharEstudiante(); sincronizarPerfil(); escucharPerfil(); pintarControles(); pintarTarjetas(); pintarSeleccion();
  $("#guia-empezar").disabled = false;
  window.addEventListener("beforeprint", armarHoja);
  $("#pdf").addEventListener("click", prepararDocumento);
  $("#generar-documento").addEventListener("click", generarDocumento);
  $("#cancelar-documento").addEventListener("click", () => $("#incluir-documento").close());
  $("#incluir-documento").addEventListener("close", () => { if (!$("#vista").open) (origenDocumento || $("#abrir-mochila")).focus(); });
  $("#vista").addEventListener("close", () => { const origen = centroDocumento ? origenCentro : (origenDocumento || $("#abrir-mochila")); centroDocumento = null; origen?.focus(); });
  $("#guardar-respaldo").addEventListener("click", guardarRespaldo);
  $("#abrir-respaldo").addEventListener("change", abrirRespaldo);
  $("#descargar").addEventListener("click", descargarPdf);
  $("#imprimir").addEventListener("click", imprimirPdf);
  $("#cerrar").addEventListener("click", () => $("#vista").close());
  $("#borrar").addEventListener("click", () => {
    const trabajo = estado.ambito === "trabajo";
    if (!window.confirm(trabajo ? "¿Borrar los datos de Trabajo de este navegador? Los datos de Educación se conservan." : "¿Borrar los datos de Educación de este navegador? Los datos de Trabajo se conservan.")) return;
    estado = normalizarDatos(trabajo ? { ...estado, trabajadores: [], trabajadorActivo: "" } : { trabajadores: estado.trabajadores, trabajadorActivo: estado.trabajadorActivo, ambito: "educacion" });
    guardar(); location.reload();
  });
}
iniciar();
