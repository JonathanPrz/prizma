const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const contexto = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''), contexto);
const ejecutar = codigo => JSON.parse(JSON.stringify(vm.runInContext(codigo, contexto)));
assert.deepEqual(ejecutar('normalizarEstudiante({ iniciales: "A1", dimensiones: {1: 3, 6: 2, 0: 1, 12: 2, "01": 1, 3: "2", 4: 4}, ayuda: "x".repeat(301) })'), { iniciales: '', dimensiones: {1: 3, 6: 2}, ayuda: 'x'.repeat(300) });
for (const valor of ['ABCDE', '<svg>', '12', null]) assert.equal(ejecutar(`normalizarEstudiante({iniciales: ${JSON.stringify(valor)}}).iniciales`), '');
assert.equal(ejecutar('normalizarEstudiante({iniciales: "ÁÑ"}).iniciales'), 'ÁÑ');
assert.deepEqual(ejecutar('normalizarEstudiante()'), {iniciales: '', dimensiones: {}, ayuda: ''});
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
assert.deepEqual(ejecutar('validarRespaldo({app: "prizma", version: 1, perfil: {}, seleccion: {}}).estudiante'), {iniciales: '', dimensiones: {}, ayuda: ''});
assert.deepEqual(ejecutar('validarRespaldo({app: "prizma", version: 1, perfil: {}, seleccion: {}, estudiante: {iniciales: "AB12", dimensiones: {6: 3, 12: 2}, ayuda: "x".repeat(301)}}).estudiante'), {iniciales: '', dimensiones: {6: 3}, ayuda: 'x'.repeat(300)});
vm.runInContext('estado.estudiante.iniciales = "ÁÑ"; estado.estudiante.ayuda = "Apoyos visuales"; estado.seleccion = {"acc-1-partes": "Una nota"}; fuentes = Object.fromEntries(catalogo.flatMap(r => r.fuentes).map(id => [id, {cita: id, url: "https://example.org"}]));', contexto);
const doc = ejecutar('documento()');
assert.equal(doc.grupos.length, 1);
assert.equal(doc.grupos[0].nombre, 'Apoyos para ÁÑ');
assert.equal(doc.grupos[0].subtitulo, 'Propuesta para conversar con el equipo de apoyo');
assert.equal(doc.grupos[0].ayuda, 'Le ayuda: Apoyos visuales');
assert.match(doc.grupos[0].acciones[0].dato, /Adecuación de acceso: Organización del tiempo y el horario \(Decreto 83\)/);
assert.ok(ejecutar('JSON.stringify(definicionPdf())').includes('Apoyos para ÁÑ'));
console.log('Correcto: respaldo antiguo y validado, documento separado y definición PDF con tipos oficiales.');
