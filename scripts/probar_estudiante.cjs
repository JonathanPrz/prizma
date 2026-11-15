const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const contexto = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''), contexto);
const ejecutar = codigo => JSON.parse(JSON.stringify(vm.runInContext(codigo, contexto)));
assert.deepEqual(ejecutar('normalizarEstudiante({ iniciales: "A1", dimensiones: {1: 3, 6: 2, 0: 1, 12: 2, "01": 1, 3: "2", 4: 4}, ayuda: "x".repeat(301) })'), { iniciales: '', dimensiones: {1: 3, 6: 2}, ayuda: 'x'.repeat(300), voz: '' });
for (const valor of ['ABCDE', '<svg>', '12', null]) assert.equal(ejecutar(`normalizarEstudiante({iniciales: ${JSON.stringify(valor)}}).iniciales`), '');
assert.equal(ejecutar('normalizarEstudiante({iniciales: "ÁÑ"}).iniciales'), 'ÁÑ');
assert.deepEqual(ejecutar('normalizarEstudiante()'), {iniciales: '', dimensiones: {}, ayuda: '', voz: ''});
vm.runInContext(`catalogo = ${fs.readFileSync(path.join(__dirname, '../data/recomendaciones.json'), 'utf8')}; estado.estudiante = normalizarEstudiante({dimensiones: {1: 2, 6: 3}});`, contexto);
const apoyos = ejecutar('accesosVisibles().map(r => ({id: r.id, puntos: puntaje(r), dimensiones: r.dimensiones}))');
assert.ok(apoyos.filter(r => r.dimensiones.includes(6)).length >= 2);
assert.ok(apoyos.every((r, i) => !i || apoyos[i - 1].puntos >= r.puntos));
vm.runInContext('estado.estudiante.dimensiones[2] = 1;', contexto);
assert.ok(ejecutar('accesosVisibles().some(r => r.id === "acc-2-audio")'));
vm.runInContext('estado.perfil.nivel = "parvularia";', contexto);
assert.equal(ejecutar('accesosVisibles().some(r => r.id === "acc-2-audio")'), false);
console.log('Correcto: validación del estudiante, puntaje, visión y audición y exclusión por nivel.');

contexto.document = {
  querySelector: () => ({ options: [{value: ""}, {value: "basica"}, {value: "parvularia"}] }),
  querySelectorAll: () => [],
};
assert.deepEqual(ejecutar('validarRespaldo({app: "prizma", version: 1, perfil: {}, seleccion: {}}).estudiante'), {iniciales: '', dimensiones: {}, ayuda: '', voz: ''});
assert.deepEqual(ejecutar('validarRespaldo({app: "prizma", version: 1, perfil: {}, seleccion: {}, estudiante: {iniciales: "AB12", dimensiones: {6: 3, 12: 2}, ayuda: "x".repeat(301)}}).estudiante'), {iniciales: '', dimensiones: {6: 3}, ayuda: 'x'.repeat(300), voz: ''});
vm.runInContext('estado.estudiante.iniciales = "ÁÑ"; estado.estudiante.ayuda = "Apoyos visuales"; estado.seleccion = {"acc-1-partes": "Una nota"}; fuentes = Object.fromEntries(catalogo.flatMap(r => r.fuentes).map(id => [id, {cita: id, url: "https://example.org"}]));', contexto);
const doc = ejecutar('documento()');
assert.equal(doc.grupos.length, 1);
assert.equal(doc.grupos[0].nombre, 'Apoyos para ÁÑ');
assert.equal(doc.grupos[0].subtitulo, 'Propuesta para conversar con el equipo de apoyo');
assert.equal(doc.grupos[0].ayuda, 'Le ayuda: Apoyos visuales');
assert.match(doc.grupos[0].acciones[0].dato, /Adecuación de acceso: Organización del tiempo y el horario \(Decreto 83\)/);
assert.ok(ejecutar('JSON.stringify(definicionPdf())').includes('Apoyos para ÁÑ'));
console.log('Correcto: respaldo antiguo y validado, documento separado y definición PDF con tipos oficiales.');

vm.runInContext('estado.perfil.nivel = "basica";', contexto);
assert.deepEqual([...new Set(ejecutar('objetivosVisibles().map(r => r.subtipo)'))], ['graduacion', 'priorizacion', 'temporalizacion', 'enriquecimiento', 'eliminacion']);
vm.runInContext('estado.perfil.nivel = "parvularia";', contexto);
assert.deepEqual(ejecutar('objetivosVisibles()'), []);
for (const nivel of ['', 'parvularia', 'basica', 'media']) {
  vm.runInContext(`estado.perfil.nivel = ${JSON.stringify(nivel)};`, contexto);
  assert.deepEqual(ejecutar('Object.keys(MOMENTOS_DEC).map(subtipo => catalogo.filter(r => r.tipo === "desregulacion" && r.subtipo === subtipo && aplica(r)).length)'), [3, 3, 3]);
}
vm.runInContext('estado.perfil.nivel = "basica"; estado.seleccion = {"obj-eliminacion": "Última", "obj-priorizacion": "Equipo", "dec-durante-validar": "Protocolo", "acc-1-partes": "Acceso"};', contexto);
const ampliado = ejecutar('documento()');
assert.deepEqual(ampliado.grupos[0].acciones.map(a => a.grupo), ['Adecuaciones de acceso', 'Adecuaciones en los objetivos', 'Adecuaciones en los objetivos', 'Apoyos ante desregulación']);
assert.match(ampliado.grupos[0].acciones[1].dato, /Adecuación en los objetivos: Priorización \(Decreto 83\)/);
assert.match(ampliado.grupos[0].acciones[3].dato, /Apoyo ante desregulación: Durante: acompañar/);
assert.deepEqual(ejecutar('Object.keys(validarRespaldo({app: "prizma", version: 1, perfil: {}, seleccion: estado.seleccion}).seleccion).sort()'), ['acc-1-partes', 'dec-durante-validar', 'obj-eliminacion', 'obj-priorizacion']);
for (const nombre of ['Adecuaciones de acceso', 'Adecuaciones en los objetivos', 'Apoyos ante desregulación']) assert.ok(ejecutar('JSON.stringify(definicionPdf())').includes(nombre));
console.log('Correcto: objetivos por nivel y orden, nueve apoyos DEC, selección, respaldo y tres grupos PDF.');
vm.runInContext('estado.seleccion[catalogo.find(r => r.tipo === "dua").id] = "Curso";', contexto);
assert.equal(ejecutar('documento().grupos.length'), 2);
assert.ok(ejecutar('documento().grupos[0].acciones[0].dato').includes('DUA 3.0'));
console.log('Correcto: acciones DUA y apoyos individuales conviven en el documento.');

assert.equal(ejecutar('normalizarEstudiante({voz:"x".repeat(301)}).voz.length'), 300);
for (const valor of ['null', '42', 'true', '[]', '{}']) assert.equal(ejecutar(`normalizarEstudiante({voz:${valor}}).voz`), '');
assert.equal(ejecutar('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{},estudiante:{voz:"Prefiere explicar con dibujos"}}).estudiante.voz'), 'Prefiere explicar con dibujos');
assert.equal(ejecutar('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{},estudiante:{voz:{texto:"No es texto"}}}).estudiante.voz'), '');
vm.runInContext('estado.estudiante.ayuda="Apoyos visuales"; estado.estudiante.voz="Prefiere explicar con dibujos";', contexto);
const conVoz = ejecutar('documento()');
assert.equal(conVoz.grupos.at(-1).voz, '¿Qué dicen el estudiante y su familia? Prefiere explicar con dibujos');
assert.equal(conVoz.grupos.at(-1).ayuda, 'Le ayuda: Apoyos visuales');
assert.ok(ejecutar('JSON.stringify(definicionPdf())').includes('Prefiere explicar con dibujos'));
vm.runInContext('estado.seleccion = Object.fromEntries([[catalogo.find(r=>r.tipo==="dua").id, ""]]);', contexto);
assert.equal(ejecutar('documento().grupos.at(-1).voz'), '¿Qué dicen el estudiante y su familia? Prefiere explicar con dibujos');
assert.equal(ejecutar('documento().grupos.at(-1).acciones.length'), 0);
// Sin vacíos en el catálogo actual; se simula uno para probar el aviso sin depender del contenido.
for (const nivel of ['parvularia', 'basica', 'superior']) {
  vm.runInContext(`estado.perfil.nivel="${nivel}"; estado.estudiante=normalizarEstudiante({dimensiones:{1:1,2:2,10:2,11:3}})`, contexto);
  assert.deepEqual(ejecutar('situacionesSinApoyos()'), [], nivel);
}
vm.runInContext('var catalogoReal = catalogo; catalogo = catalogo.filter(r => !(r.tipo === "acceso" && r.dimensiones.includes(11)))', contexto);
assert.deepEqual(ejecutar('situacionesSinApoyos()'), [11]);
vm.runInContext('catalogo = catalogoReal', contexto);
console.log('Correcto: voz validada y respaldada, PDF con voz incluso sin fichas individuales, y vacíos por situación/nivel.');
const pasosOriginales = ejecutar('catalogo.find(r=>r.id===Object.keys(estado.seleccion)[0]).como');
vm.runInContext('definicionPdf().content.find(b=>b.stack?.some(n=>n.ol)).stack.find(n=>n.ol).ol[0]={text:"Objeto que inserta pdfmake"}', contexto);
assert.deepEqual(ejecutar('catalogo.find(r=>r.id===Object.keys(estado.seleccion)[0]).como'), pasosOriginales);
console.log('Correcto: la transformación de listas por pdfmake no modifica los pasos del catálogo.');
