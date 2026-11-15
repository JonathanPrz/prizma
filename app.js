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
let estado = { perfil: { nivel: "", actividad: [], evidencia: [], meta: "" }, momento: "antes", propositos: [], seleccion: {} };

function cargar() {
  try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g) estado = { ...estado, ...g, perfil: normalizarPerfil(g.perfil) }; } catch (e) { /* sin almacenamiento: la página funciona igual */ }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* idem */ }
}

function normalizarPerfil(perfil) {
  const p = perfil && typeof perfil === "object" && !Array.isArray(perfil) ? perfil : {};
  const lista = (nombre) => {
    const valores = [...document.querySelectorAll(`input[name="${nombre}"]`)].map((c) => c.value);
    return Array.isArray(p[nombre]) ? [...new Set(p[nombre].filter((v) => valores.includes(v)))] : [];
  };
  return {
    nivel: typeof p.nivel === "string" && [...$("#nivel").options].some((o) => o.value === p.nivel) ? p.nivel : "",
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
  if (r.niveles.length && p.nivel && !r.niveles.includes(p.nivel)) return false;
  const ctx = [...p.actividad, ...p.evidencia];
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
    cont.append(el("label", { for: "m-" + id }, input, el("span", {}, nombreMomento(id, nombre) + " ", el("small", { text: `(${n})` }))));
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
  actualizarRespaldo();
  const nombreMomento = nombresMomentos();
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
  $("#nivel").value = p.nivel; $("#meta").value = p.meta;
  for (const nombre of ["actividad", "evidencia"]) {
    document.querySelectorAll(`input[name="${nombre}"]`).forEach((c) => { c.checked = p[nombre].includes(c.value); });
  }
  aplicarVocabulario();
}

function escucharPerfil() {
  $("#perfil").addEventListener("input", () => {
    estado.perfil = {
      nivel: $("#nivel").value, meta: $("#meta").value,
      actividad: [...document.querySelectorAll('input[name="actividad"]:checked')].map((c) => c.value),
      evidencia: [...document.querySelectorAll('input[name="evidencia"]:checked')].map((c) => c.value),
    };
    guardar(); aplicarVocabulario(); pintarControles(); pintarTarjetas(); pintarSeleccion();
  });
}

function hayDatos() {
  const p = estado.perfil;
  return Boolean(p.nivel || p.meta || p.actividad.length || p.evidencia.length || Object.keys(estado.seleccion).length);
}

function actualizarRespaldo() {
  $("#guardar-respaldo").disabled = !hayDatos();
}

function guardarRespaldo() {
  const guardado = new Date().toISOString();
  const datos = { app: "prizma", version: 1, catalogo: VERSION_CATALOGO, guardado, perfil: estado.perfil, seleccion: estado.seleccion };
  const url = URL.createObjectURL(new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" }));
  const enlace = el("a", { href: url, download: `prizma-respaldo-${guardado.slice(0, 10)}.json` });
  document.body.append(enlace);
  enlace.click(); enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#respaldo-estado").textContent = "Respaldo descargado. Búscalo en tu carpeta de descargas.";
}

function validarRespaldo(datos) {
  const objeto = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  if (!objeto(datos) || datos.app !== "prizma" || datos.version !== 1) {
    throw new Error("Este archivo no es un respaldo de Prizma.");
  }
  if (!objeto(datos.perfil) || !objeto(datos.seleccion) || Object.values(datos.seleccion).some((nota) => typeof nota !== "string")) {
    throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma.");
  }
  const perfil = normalizarPerfil(datos.perfil);
  const ids = new Set(catalogo.map((r) => r.id));
  const entradas = Object.entries(datos.seleccion);
  const seleccion = Object.fromEntries(entradas.filter(([id]) => ids.has(id)).map(([id, nota]) => [id, nota.slice(0, 2000)]));
  return { perfil, seleccion, descartadas: entradas.length - Object.keys(seleccion).length };
}

async function abrirRespaldo(evento) {
  const input = evento.target, archivo = input.files[0], aviso = $("#respaldo-estado");
  if (!archivo) return;
  try {
    if (archivo.size > 200 * 1024) throw new Error("El archivo es demasiado grande para ser un respaldo de Prizma.");
    let datos;
    try { datos = JSON.parse(await archivo.text()); }
    catch (e) { throw new Error("El archivo no se pudo leer. Elige un respaldo guardado desde Prizma."); }
    const { perfil, seleccion, descartadas } = validarRespaldo(datos);
    if (hayDatos() && !window.confirm(`Esto reemplaza tu ${voc("clase")} y tu selección actuales por las del respaldo. ¿Continuar?`)) {
      aviso.textContent = "No se abrió el respaldo. Tus datos siguen igual.";
      return;
    }
    estado.perfil = perfil; estado.seleccion = seleccion;
    guardar(); sincronizarPerfil(); pintarControles(); pintarTarjetas(); pintarSeleccion();
    aviso.textContent = `Respaldo abierto: ${Object.keys(seleccion).length} acciones.` +
      (descartadas ? ` ${descartadas} acciones ya no están en el catálogo y no se cargaron.` : "");
  } catch (e) { aviso.textContent = e.message; }
  finally { input.value = ""; }
}

const AVISO = "Orientación pedagógica. No reemplaza la evaluación de profesionales, el PACI, el PAEC ni los protocolos de tu establecimiento. Las acciones están redactadas con palabras propias a partir de las Pautas DUA 3.0 de CAST (2024) y otras fuentes citadas.";

// Un solo modelo del documento para la vista previa, la impresión y el PDF descargable.
function documento() {
  const p = estado.perfil, sel = elegidasOrdenadas(), nombreMomento = nombresMomentos();
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
  const textos = (nombre) => [...document.querySelectorAll(`input[name="${nombre}"]`)]
    .filter((c) => p[nombre].includes(c.value)).map((c) => c.closest("label").textContent.trim()).join(", ");
  const datos = [p.nivel && NIVELES[p.nivel], p.actividad.length && "Harán: " + textos("actividad"),
    p.evidencia.length && "Mostrarán lo aprendido: " + textos("evidencia")].filter(Boolean);
  return {
    fecha: `${fecha}. Generado con Prizma, catálogo del ${VERSION_CATALOGO}.`,
    datos: datos.length ? datos.join(". ") + "." : "",
    meta: p.meta.trim(),
    grupos: MOMENTOS.filter(([id]) => sel.some((r) => r.momento === id)).map(([id]) => ({
      nombre: nombreMomento[id],
      acciones: sel.filter((r) => r.momento === id).map((r) => ({
        titulo: r.titulo, como: r.como, porque: r.porque, nota: (estado.seleccion[r.id] || "").trim(),
        dato: `${PROPOSITOS[proposito(r)].principio}. DUA 3.0, consideración ${r.consideracion}: ${CONSIDERACIONES[r.consideracion]}. Respaldo: ${RESPALDO[r.respaldo]}.`,
      })),
    })),
    fuentes: [...new Set(sel.flatMap((r) => r.fuentes))].map((f) => `${fuentes[f].cita} ${fuentes[f].url}`),
  };
}

function armarHoja() {
  const d = documento();
  const partes = [
    el("h1", { text: `Acciones para mi ${voc("clase")}` }),
    el("p", { class: "h-meta", text: d.fecha }),
    d.datos ? el("p", { text: d.datos }) : null,
    d.meta ? el("p", {}, el("strong", { text: "Meta de aprendizaje: " }), d.meta, el("br"), el("em", { text: "Quita las barreras, no el desafío de aprender esto." })) : null,
    ...d.grupos.flatMap((g) => [
      el("h2", { text: g.nombre }),
      ...g.acciones.map((a) => el("div", { class: "h-accion" },
        el("h3", { text: a.titulo }),
        el("ol", {}, a.como.map((x) => el("li", { text: x }))),
        el("p", {}, el("strong", { text: "Por qué funciona: " }), a.porque),
        el("p", { class: "h-dato", text: a.dato }),
        a.nota ? el("p", { class: "h-nota" }, el("strong", { text: "Mi nota: " }), a.nota) : null)),
    ]),
    el("h2", { text: "Fuentes" }),
    el("ol", { class: "h-fuentes" }, d.fuentes.map((f) => el("li", { text: f }))),
    el("p", { class: "h-aviso", text: AVISO }),
  ];
  $("#hoja").replaceChildren(...partes.filter(Boolean));
}

function definicionPdf() {
  const d = documento();
  const linea = { canvas: [{ type: "line", x1: 0, y1: 0, x2: 505, y2: 0, lineWidth: 0.6, lineColor: "#888888" }], margin: [0, 0, 0, 6] };
  const contenido = [
    { text: `Acciones para mi ${voc("clase")}`, style: "h1" },
    { text: d.fecha, style: "dato", margin: [0, 0, 0, 4] },
    d.datos ? { text: d.datos, margin: [0, 0, 0, 4] } : null,
    d.meta ? { text: [{ text: "Meta de aprendizaje: ", bold: true }, d.meta], margin: [0, 4, 0, 0] } : null,
    d.meta ? { text: "Quita las barreras, no el desafío de aprender esto.", italics: true, margin: [0, 0, 0, 6] } : null,
    ...d.grupos.flatMap((g) => [
      { text: g.nombre, style: "h2" }, linea,
      ...g.acciones.map((a) => ({
        unbreakable: true, margin: [0, 0, 0, 10], stack: [
          { text: a.titulo, style: "h3" },
          { ol: a.como, margin: [0, 2, 0, 2] },
          { text: [{ text: "Por qué funciona: ", bold: true }, a.porque] },
          { text: a.dato, style: "dato", margin: [0, 2, 0, 0] },
          a.nota ? { text: [{ text: "Mi nota: ", bold: true }, a.nota], margin: [0, 3, 0, 0] } : null,
        ].filter(Boolean),
      })),
    ]),
    { text: "Fuentes", style: "h2" }, linea,
    { ol: d.fuentes, style: "dato" },
    { table: { widths: ["*"], body: [[{ text: AVISO, style: "dato", margin: [4, 4, 4, 4] }]] }, layout: { hLineColor: "#888888", vLineColor: "#888888" }, margin: [0, 14, 0, 0] },
  ].filter(Boolean);
  return {
    info: { title: `Acciones para mi ${voc("clase")}`, creator: "Prizma" },
    pageSize: "LETTER", pageMargins: [54, 54, 54, 60],
    content: contenido,
    footer: (actual, total) => ({ text: `Página ${actual} de ${total}`, alignment: "right", fontSize: 8, color: "#555555", margin: [54, 20, 54, 0] }),
    defaultStyle: { fontSize: 10.5, lineHeight: 1.25 },
    styles: { h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 2] }, h2: { fontSize: 13, bold: true, margin: [0, 12, 0, 3] }, h3: { fontSize: 11, bold: true }, dato: { fontSize: 8.5, color: "#444444" } },
  };
}

// pdfmake pesa unos 2 MB: se carga solo cuando alguien pide descargar.
function cargarScript(src) {
  return new Promise((ok, mal) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => mal(new Error(src)); document.head.append(s); });
}
async function descargarPdf() {
  const aviso = $("#vista-estado"), boton = $("#descargar");
  boton.disabled = true; aviso.textContent = "Preparando el PDF…";
  try {
    if (!window.pdfMake) { await cargarScript("vendor/pdfmake/pdfmake.min.js"); await cargarScript("vendor/pdfmake/vfs_fonts.js"); }
    const fecha = new Date().toISOString().slice(0, 10);
    window.pdfMake.createPdf(definicionPdf()).download(`prizma-mi-clase-${fecha}.pdf`);
    aviso.textContent = "PDF descargado. Búscalo en tu carpeta de descargas.";
  } catch (e) {
    aviso.textContent = "No se pudo crear el PDF. Usa «Imprimir» y elige «Guardar como PDF».";
  } finally { boton.disabled = false; }
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
  sincronizarPerfil(); escucharPerfil(); pintarControles(); pintarTarjetas(); pintarSeleccion();
  window.addEventListener("beforeprint", armarHoja);
  $("#pdf").addEventListener("click", () => { armarHoja(); $("#vista-estado").textContent = ""; $("#vista").showModal(); });
  $("#guardar-respaldo").addEventListener("click", guardarRespaldo);
  $("#abrir-respaldo").addEventListener("change", abrirRespaldo);
  $("#descargar").addEventListener("click", descargarPdf);
  $("#imprimir").addEventListener("click", () => window.print());
  $("#cerrar").addEventListener("click", () => $("#vista").close());
  $("#borrar").addEventListener("click", () => {
    if (!window.confirm(`¿Borrar tu ${voc("clase")}, tu selección y tus notas de este navegador?`)) return;
    try { localStorage.removeItem(CLAVE); } catch (e) { /* idem */ }
    location.reload();
  });
}
iniciar();
