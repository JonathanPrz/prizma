const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = vm.createContext({document: {
  querySelector: () => ({options: [{value: ''}, {value: 'basica'}, {value: 'parvularia'}]}),
  querySelectorAll: () => [],
}});
const leer = archivo => fs.readFileSync(path.join(__dirname, '..', archivo), 'utf8');
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/, ''), contexto);
vm.runInContext(`catalogo = ${leer('data/recomendaciones.json')}; necesidades = ${leer('data/necesidades.json')};`, contexto);
const ejecutar = codigo => JSON.parse(JSON.stringify(vm.runInContext(codigo, contexto)));
assert.deepEqual(ejecutar('normalizarNecesidades(["tareas-largas", "inventada", 1, {}, "tareas-largas"])'), ['tareas-largas']);
for (const invalido of ['null', '{}', '"tareas-largas"', '42']) assert.deepEqual(ejecutar(`normalizarNecesidades(${invalido})`), []);
for (const nivel of ['basica', 'parvularia']) {
  vm.runInContext(`estado.perfil.nivel = "${nivel}"; estado.momentos = ["durante"]; estado.necesidades = [];`, contexto);
  const todos = ejecutar('visibles().map(r => r.id).sort()');
  vm.runInContext('estado.necesidades = ["tareas-largas"];', contexto);
  assert.equal(ejecutar('visibles()[0].consideracion'), '5.3');
  assert.deepEqual(ejecutar('visibles().map(r => r.id).sort()'), todos);
  assert.equal(ejecutar('coincidenciasNecesidades(visibles()[0])[0].texto'), 'Las tareas largas no tienen pasos visibles ni apoyos para organizarse');
}
vm.runInContext('estado.perfil.nivel = "basica"; estado.momentos = ["toda-la-clase"]; estado.necesidades = ["participacion", "clima"]; estado.perfil.actividad = ["conversar"];', contexto);
assert.equal(ejecutar('coincidenciasNecesidades(visibles()[0]).length'), 1);
const puntuaciones = ejecutar('visibles().map(r => coincidenciasNecesidades(r).length)');
assert.ok(puntuaciones.every((n, i) => !i || puntuaciones[i - 1] >= n));
assert.deepEqual(ejecutar('validarRespaldo({app:"prizma", version:1, perfil:{}, seleccion:{}, necesidades:["participacion","inventada","participacion","clima"]}).necesidades'), ['participacion', 'clima']);
assert.deepEqual(ejecutar('validarRespaldo({app:"prizma", version:1, perfil:{}, seleccion:{}}).necesidades'), []);
assert.match(ejecutar('documento().resumen.flat().join(": ")'), /Qué quiere resolver: La participación depende de una sola forma de interactuar; El ambiente de la sala genera tensión, distracciones o frustración/);
assert.ok(ejecutar('JSON.stringify(definicionPdf())').includes('Qué quiere resolver'));
vm.runInContext('necesidades = []; estado.necesidades = normalizarNecesidades(estado.necesidades);', contexto);
assert.deepEqual(ejecutar('estado.necesidades'), []);
assert.ok(ejecutar('visibles().length') > 0);
console.log('Correcto: necesidades válidas, orden sin ocultar, parvularia, coincidencias únicas, respaldo, PDF y catálogo opcional ausente.');
