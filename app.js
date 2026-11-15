"use strict";
// Prizma, etapa 1: menú de acciones DUA para todo el curso. Sin servidor: los datos quedan en localStorage.
const CLAVE = "prizma.v1";
const VERSION_CATALOGO = "2026-11-15";

const MOMENTOS = [
  ["antes", "Antes"], ["durante", "Durante"], ["despues", "Después"], ["toda-la-clase", "En toda la clase"],
];
const PROPOSITOS = {
  motivar: { nombre: "Motivar y sostener el interés", corto: "Motivar", principio: "Compromiso", directrices: ["7", "8", "9"] },
  presentar: { nombre: "Presentar la información", corto: "Presentar", principio: "Representación", directrices: ["1", "2", "3"] },
  mostrar: { nombre: "Mostrar lo aprendido", corto: "Mostrar lo aprendido", principio: "Acción y expresión", directrices: ["4", "5", "6"] },
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
const NIVELES = { parvularia: "Educación parvularia", basica: "Educación básica", "media-ch": "Media científico-humanista", "media-tp": "Media técnico-profesional" };

const $ = (s) => document.querySelector(s);
const proposito = (r) => Object.keys(PROPOSITOS).find((k) => PROPOSITOS[k].directrices.includes(r.consideracion.split(".")[0]));

let catalogo = [], fuentes = {};
let estado = { perfil: { nivel: "", tipo: "", evaluacion: [], meta: "" }, momento: "antes", propositos: [], seleccion: {} };

function cargar() {
  try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g) estado = { ...estado, ...g, perfil: { ...estado.perfil, ...g.perfil } }; } catch (e) { /* sin almacenamiento: la página funciona igual */ }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* idem */ }
}

// Oculta lo que no aplica al perfil. Una lista vacía en la ficha significa "aplica siempre".
function aplica(r) {
  const p = estado.perfil;
  if (r.niveles.length && p.nivel && !r.niveles.includes(p.nivel)) return false;
  const ctx = [p.tipo, ...p.evaluacion].filter(Boolean);
  if (r.contextos.length && ctx.length && !ctx.some((c) => r.contextos.includes(c))) return false;
  return true;
}
function visibles() {
  return catalogo
    .filter((r) => r.tipo === "dua" && r.momento === estado.momento && aplica(r))
    .filter((r) => !estado.propositos.length || estado.propositos.includes(proposito(r)))
    .sort((a, b) => (b.destacada - a.destacada) || a.consideracion.localeCompare(b.consideracion, "es", { numeric: true }));
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
  const cont = $("#momentos"); cont.replaceChildren();
  for (const [id, nombre] of MOMENTOS) {
    const n = catalogo.filter((r) => r.tipo === "dua" && r.momento === id && aplica(r)).length;
    const input = el("input", { type: "radio", name: "momento", value: id, id: "m-" + id });
    input.checked = estado.momento === id;
    input.addEventListener("change", () => { estado.momento = id; guardar(); pintarTarjetas(); });
    cont.append(el("label", { for: "m-" + id }, input, el("span", {}, nombre + " ", el("small", { text: `(${n})` }))));
  }
  const chips = $("#propositos"); chips.replaceChildren();
  for (const [id, p] of Object.entries(PROPOSITOS)) {
    const b = el("button", { type: "button", class: "chip " + id, "aria-pressed": String(estado.propositos.includes(id)), title: "Principio DUA: " + p.principio },
      el("span", { class: "tri", "aria-hidden": "true" }), p.nombre);
    b.addEventListener("click", () => {
      estado.propositos = estado.propositos.includes(id) ? estado.propositos.filter((x) => x !== id) : [...estado.propositos, id];
      guardar(); pintarControles(); pintarTarjetas();
    });
    chips.append(b);
  }
}

function tarjeta(r) {
  const prop = proposito(r), elegida = r.id in estado.seleccion;
  const boton = el("button", { type: "button", class: "boton", "aria-pressed": String(elegida) }, elegida ? "Elegida" : "Elegir");
  boton.addEventListener("click", () => alternar(r.id));
  return el("li", { class: "tarjeta" + (elegida ? " elegida" : "") },
    el("div", { class: "t-arriba" },
      el("span", { class: "t-proposito " + prop }, el("span", { class: "tri", "aria-hidden": "true" }), PROPOSITOS[prop].corto),
      el("abbr", { class: "t-dua", title: "Consideración DUA 3.0: " + CONSIDERACIONES[r.consideracion] }, "DUA " + r.consideracion)),
    el("h3", { text: r.titulo }),
    el("ol", {}, r.como.map((p) => el("li", { text: p }))),
    el("p", { class: "t-porque" }, el("strong", { text: "Por qué funciona: " }), r.porque),
    el("div", { class: "t-abajo" },
      el("span", { class: "respaldo " + r.respaldo, text: RESPALDO[r.respaldo] }),
      boton),
    el("details", { class: "fuentes" }, el("summary", { text: "Fuentes" }),
      el("ul", {}, r.fuentes.map((f) => el("li", {}, el("a", { href: fuentes[f].url, rel: "noopener", target: "_blank", text: fuentes[f].cita }))))));
}

function pintarTarjetas() {
  const lista = visibles();
  $("#tarjetas").replaceChildren(...lista.map(tarjeta));
  $("#conteo").textContent = lista.length === 1 ? "1 acción" : `${lista.length} acciones`;
}

function alternar(id) {
  if (id in estado.seleccion) delete estado.seleccion[id]; else estado.seleccion[id] = "";
  guardar(); pintarTarjetas(); pintarSeleccion();
}

function elegidasOrdenadas() {
  const orden = Object.fromEntries(MOMENTOS.map(([id], i) => [id, i]));
  return catalogo.filter((r) => r.id in estado.seleccion)
    .sort((a, b) => orden[a.momento] - orden[b.momento] || a.consideracion.localeCompare(b.consideracion, "es", { numeric: true }));
}

function pintarSeleccion() {
  const sel = elegidasOrdenadas();
  $("#n-sel").textContent = sel.length;
  $("#sel-vacia").hidden = sel.length > 0;
  $("#pdf").disabled = sel.length === 0;
  const nombreMomento = Object.fromEntries(MOMENTOS);
  $("#sel-lista").replaceChildren(...sel.map((r) => {
    const nota = el("textarea", { rows: "2", "aria-label": "Nota para: " + r.titulo, placeholder: "Nota opcional: cómo la usarás" });
    nota.value = estado.seleccion[r.id] || "";
    nota.addEventListener("input", () => { estado.seleccion[r.id] = nota.value; guardar(); });
    return el("li", {},
      el("span", { class: "sel-momento", text: nombreMomento[r.momento] }),
      el("span", { class: "sel-titulo", text: r.titulo }),
      nota,
      el("button", { type: "button", class: "quitar", onclick: () => alternar(r.id), text: "Quitar" }));
  }));
}

function sincronizarPerfil() {
  const p = estado.perfil;
  $("#nivel").value = p.nivel; $("#tipo").value = p.tipo; $("#meta").value = p.meta;
  document.querySelectorAll('input[name="evaluacion"]').forEach((c) => { c.checked = p.evaluacion.includes(c.value); });
  $("#perfil").addEventListener("input", () => {
    estado.perfil = {
      nivel: $("#nivel").value, tipo: $("#tipo").value, meta: $("#meta").value,
      evaluacion: [...document.querySelectorAll('input[name="evaluacion"]:checked')].map((c) => c.value),
    };
    guardar(); pintarControles(); pintarTarjetas();
  });
}

function armarHoja() {
  const p = estado.perfil, sel = elegidasOrdenadas(), nombreMomento = Object.fromEntries(MOMENTOS);
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
  const usadas = [...new Set(sel.flatMap((r) => r.fuentes))];
  const datos = [p.nivel && NIVELES[p.nivel], p.tipo && $("#tipo").selectedOptions[0].text, p.evaluacion.length && "Evaluación: " + p.evaluacion.join(", ")].filter(Boolean);
  const hoja = $("#hoja");
  const partes = [
    el("h1", { text: "Acciones para mi clase" }),
    el("p", { class: "h-meta", text: `${fecha}. Generado con Prizma, catálogo del ${VERSION_CATALOGO}.` }),
    datos.length ? el("p", { text: datos.join(". ") + "." }) : null,
    p.meta ? el("p", {}, el("strong", { text: "Meta de aprendizaje: " }), p.meta, el("br"), el("em", { text: "Quita las barreras, no el desafío de aprender esto." })) : null,
    ...MOMENTOS.filter(([id]) => sel.some((r) => r.momento === id)).flatMap(([id]) => [
      el("h2", { text: nombreMomento[id] }),
      ...sel.filter((r) => r.momento === id).map((r) => el("div", { class: "h-accion" },
        el("h3", { text: r.titulo }),
        el("ol", {}, r.como.map((x) => el("li", { text: x }))),
        el("p", {}, el("strong", { text: "Por qué funciona: " }), r.porque),
        el("p", { class: "h-dato", text: `${PROPOSITOS[proposito(r)].principio}. DUA 3.0, consideración ${r.consideracion}: ${CONSIDERACIONES[r.consideracion]}. Respaldo: ${RESPALDO[r.respaldo]}.` }),
        estado.seleccion[r.id] ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), estado.seleccion[r.id]) : null)),
    ]),
    el("h2", { text: "Fuentes" }),
    el("ol", { class: "h-fuentes" }, usadas.map((f) => el("li", { text: `${fuentes[f].cita} ${fuentes[f].url}` }))),
    el("p", { class: "h-aviso", text: "Orientación pedagógica. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas." }),
  ];
  hoja.replaceChildren(...partes.filter(Boolean));
}

async function iniciar() {
  cargar();
  try {
    const [r, f] = await Promise.all(["data/recomendaciones.json", "data/fuentes.json"].map((u) => fetch(u).then((x) => { if (!x.ok) throw new Error(u); return x.json(); })));
    catalogo = r; fuentes = Object.fromEntries(f.map((x) => [x.id, x]));
  } catch (e) {
    $("#conteo").textContent = "No se pudo cargar el catálogo. Recarga la página; si abriste el archivo directamente, usa la versión publicada.";
    return;
  }
  estado.seleccion = Object.fromEntries(Object.entries(estado.seleccion).filter(([id]) => catalogo.some((r) => r.id === id)));
  sincronizarPerfil(); pintarControles(); pintarTarjetas(); pintarSeleccion();
  window.addEventListener("beforeprint", armarHoja);
  $("#pdf").addEventListener("click", () => { armarHoja(); window.print(); });
  $("#borrar").addEventListener("click", () => {
    if (!window.confirm("¿Borrar tu clase, tu selección y tus notas de este navegador?")) return;
    try { localStorage.removeItem(CLAVE); } catch (e) { /* idem */ }
    location.reload();
  });
}
iniciar();
