const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const leer = archivo => fs.readFileSync(path.join(__dirname, '..', archivo), 'utf8');
const opciones = ['', 'parvularia', 'basica', 'media', 'superior'].map(value => ({value}));
const almacen = new Map();
const contexto = vm.createContext({
  document: {querySelector: () => ({options: opciones}), querySelectorAll: () => []},
  localStorage: {getItem: clave => almacen.get(clave), setItem: (clave, valor) => almacen.set(clave, valor)},
});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/, ''), contexto);
const ejecutar = codigo => JSON.parse(JSON.stringify(vm.runInContext(codigo, contexto)));
vm.runInContext(`catalogo=${leer('data/recomendaciones.json')}; necesidades=${leer('data/necesidades.json')}`, contexto);
const momentos = ['antes', 'durante', 'despues', 'toda-la-clase'];
assert.deepEqual(ejecutar('estado.momentos'), []);
assert.deepEqual(ejecutar('normalizarMomentos(["despues", "antes", "despues", 1, {}, null, "inventado"])'), ['despues', 'antes']);
for (const valor of ['null', '{}', '"antes"', '42', 'true']) assert.deepEqual(ejecutar(`normalizarMomentos(${valor})`), []);
for (const nivel of ['', 'parvularia', 'basica', 'media', 'superior']) {
  vm.runInContext(`estado.perfil.nivel=${JSON.stringify(nivel)}; estado.momentos=[]; estado.necesidades=[]; estado.propositos=[]`, contexto);
  assert.equal(ejecutar('visibles().length'), 36, nivel);
  assert.deepEqual(ejecutar('[...new Set(visibles().map(r=>r.momento))]'), momentos);
  vm.runInContext('estado.momentos=["despues","durante"]', contexto);
  const seleccionadas = ejecutar('visibles().map(r=>r.id).sort()');
  assert.deepEqual(ejecutar('[...new Set(visibles().map(r=>r.momento))]'), ['durante', 'despues']);
  assert.deepEqual(seleccionadas, ejecutar('catalogo.filter(r=>r.tipo==="dua"&&aplica(r)&&["durante","despues"].includes(r.momento)).map(r=>r.id).sort()'));
  vm.runInContext('estado.momentos=[]; estado.necesidades=["evaluar"]', contexto);
  assert.equal(ejecutar('visibles().length'), 36);
  for (const momento of momentos) {
    const coincidencias = ejecutar(`visibles().filter(r=>r.momento===${JSON.stringify(momento)}).map(r=>coincidenciasNecesidades(r).length)`);
    assert.ok(coincidencias.every((n,i)=>!i||coincidencias[i-1]>=n), nivel+'/'+momento);
  }
  assert.ok(ejecutar('visibles().some(r=>coincidenciasNecesidades(r).length>0)'), nivel);
}
vm.runInContext('estado.momentos=["durante"]', contexto);
almacen.set('prizma.v1', JSON.stringify({momento:'antes', perfil:{nivel:'basica'}, estudiante:{}, seleccion:{}}));
vm.runInContext('cargar()', contexto);
assert.deepEqual(ejecutar('estado.momentos'), []);
assert.equal(ejecutar('Object.hasOwn(estado,"momento")'), false);
assert.equal(ejecutar('visibles().length'), 36);
almacen.set('prizma.v1', JSON.stringify({momentos:['antes','invalido','antes','despues'], perfil:{}, estudiante:{}, seleccion:{}}));
vm.runInContext('cargar(); guardar()', contexto);
assert.deepEqual(ejecutar('estado.momentos'), ['antes','despues']);
assert.deepEqual(JSON.parse(almacen.get('prizma.v1')).momentos, ['antes','despues']);
assert.deepEqual(ejecutar('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{},momento:"antes"}).momentos'), []);
assert.deepEqual(ejecutar('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{},momentos:["durante","durante",null,"inventado"]}).momentos'), ['durante']);
vm.runInContext('estado.perfil.nivel="basica"; estado.propositos=["mostrar"]; estado.momentos=[]', contexto);
assert.ok(ejecutar('visibles().every(r=>proposito(r)==="mostrar")'));
assert.equal(ejecutar('PROPOSITOS.mostrar.nombre'), 'Expresarse y organizarse');
assert.equal(ejecutar('PROPOSITOS.mostrar.corto'), 'Expresarse y organizarse');
console.log('Correcto: 36 acciones por nivel, momentos múltiples/validados/ordenados, prioridad de necesidades por grupo, persistencia y respaldo antiguo sin filtro implícito.');
