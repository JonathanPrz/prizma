const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const eventos = {}, nodos = new Map(), almacen = new Map();
const telefono = {matches: false, addEventListener(tipo, fn) {this.cambiar = fn;}};
let areas = [];
const contexto = vm.createContext({
  document: {querySelector: selector => selector === '#filtros-dialogo-cuerpo .filtros' ? nodos.get('#filtros-dialogo-cuerpo').hijo : nodos.get(selector), querySelectorAll: selector => selector === '#areas input:checked' ? areas : []},
  location: {hash: ''}, history: {replaceState(a, b, hash) {contexto.location.hash = hash;}},
  window: {addEventListener(tipo, fn) {eventos[tipo] = fn;}, matchMedia: () => telefono},
  localStorage: {setItem(clave, valor) {almacen.set(clave, JSON.parse(valor));}},
});
function nodo(id) {
  return {id, open: false, eventos: {}, atributos: {},
    focus() {contexto.document.activeElement = this;},
    setAttribute(k, v) {this.atributos[k] = v;},
    addEventListener(tipo, fn) {this.eventos[tipo] = fn;},
    append(hijo) {if (hijo.padre) hijo.padre.hijo = null; this.hijo = hijo; hijo.padre = this;},
    showModal() {this.open = true; nodos.get(this.id === 'mochila' ? '#t-seleccion' : '#t-filtros-dialogo').focus();},
    close() {this.open = false; this.eventos.close();},
  };
}
for (const id of ['panel-dua', 'panel-apoyos', 'tab-dua', 'tab-apoyos', '.saltar', 'abrir-filtros', 'filtros-dialogo', 'filtros-dialogo-cuerpo', 'ver-resultados', 't-filtros-dialogo', 'limpiar-filtros', 'abrir-mochila', 'cerrar-mochila', 'mochila', 't-seleccion']) nodos.set(id === '.saltar' ? id : '#' + id, nodo(id));
for (const id of ['dua', 'apoyos']) {
  nodos.set('#panel-' + id + ' .acciones-intro', nodo('intro-' + id));
  nodos.set('#filtros-' + id, nodo('filtros-' + id));
  nodos.set('#lugar-filtros-' + id, nodo('lugar-filtros-' + id));
  nodos.get('#lugar-filtros-' + id).append(nodos.get('#filtros-' + id));
}
const ejecutar = codigo => vm.runInContext(codigo, contexto);
ejecutar(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''));
ejecutar('prepararPestanas(); prepararFiltros()');
assert.equal(contexto.location.hash, '#dua');
ejecutar('estado.necesidades=null'); assert.equal(ejecutar('cantidadFiltros()'), 0); ejecutar('estado.necesidades=[]');
for (const id of ['apoyos', 'dua', 'apoyos', 'dua']) {
  contexto.location.hash = '#' + id; eventos.hashchange();
  assert.equal(contexto.document.activeElement.id, 'tab-' + id);
  assert.equal(almacen.get('prizma.v1').pestana, id);
  for (const nombre of ['dua', 'apoyos']) {
    assert.equal(nodos.get('#panel-' + nombre).hidden, nombre !== id);
    assert.equal(nodos.get('#tab-' + nombre).atributos['aria-selected'], String(nombre === id));
    assert.equal(nodos.get('#tab-' + nombre).tabIndex, nombre === id ? 0 : -1);
  }
}
contexto.location.hash = '#inexistente'; eventos.hashchange();
assert.equal(contexto.location.hash, '#dua');
for (const [tab, tecla, destino] of [['dua', 'ArrowRight', 'apoyos'], ['apoyos', 'ArrowLeft', 'dua'], ['dua', 'End', 'apoyos'], ['apoyos', 'Home', 'dua']]) {
  let prevenido = false;
  nodos.get('#tab-' + tab).eventos.keydown({key: tecla, preventDefault() {prevenido = true;}});
  assert.equal(prevenido, true); assert.equal(contexto.location.hash, destino);
  contexto.location.hash = '#' + destino; eventos.hashchange();
}
nodos.get('#tab-apoyos').eventos.click(); assert.equal(contexto.location.hash, 'apoyos');
contexto.location.hash = '#apoyos'; eventos.hashchange();
nodos.get('.saltar').eventos.click({preventDefault() {}});
assert.equal(contexto.document.activeElement.id, 'panel-apoyos');
ejecutar('estado.pestana = "apoyos"'); contexto.location.hash = ''; ejecutar('prepararPestanas()');
assert.equal(contexto.location.hash, '#apoyos');
telefono.matches = true;
nodos.get('#abrir-filtros').eventos.click();
const original = nodos.get('#filtros-apoyos');
assert.equal(nodos.get('#filtros-dialogo-cuerpo').hijo, original);
assert.equal(contexto.document.activeElement.id, 't-filtros-dialogo');
nodos.get('#ver-resultados').eventos.click();
assert.equal(nodos.get('#lugar-filtros-apoyos').hijo, original);
assert.equal(contexto.document.activeElement.id, 'abrir-filtros');
nodos.get('#abrir-filtros').eventos.click(); telefono.matches = false; telefono.cambiar();
assert.equal(nodos.get('#filtros-dialogo').open, false);
assert.equal(contexto.document.activeElement.id, 'tab-apoyos');
nodos.get('#abrir-mochila').eventos.click(); assert.equal(nodos.get('#mochila').open, true);
assert.equal(contexto.document.activeElement.id, 't-seleccion');
nodos.get('#cerrar-mochila').eventos.click(); assert.equal(contexto.document.activeElement.id, 'abrir-mochila');
ejecutar('estado.pestana="dua"; estado.necesidades=["a"]; estado.propositos=["motivar"]; estado.momentos=["durante"]; estado.perfil={nivel:"basica", meta:"Meta", actividad:["crear"], evidencia:["grupo"]}; estado.seleccion={accion:"Nota"}; Object.assign(estudianteActual(), normalizarEstudiante({iniciales:"AB", dimensiones:{1:2}, ayuda:"Visual"}))');
assert.equal(ejecutar('cantidadFiltros()'), 6);
areas = [{checked: true}]; ejecutar('estado.pestana="apoyos"'); assert.equal(ejecutar('cantidadFiltros()'), 4);
ejecutar('estado.pestana="dua"; sincronizarPerfil=()=>{}; pintarControles=actualizarConteoFiltros; pintarTarjetas=()=>{}; actualizarRespaldo=()=>{}; limpiarFiltros()');
assert.equal(ejecutar('cantidadFiltros()'), 0);
assert.equal(ejecutar('estado.perfil.nivel'), 'basica');
assert.equal(ejecutar('estado.seleccion.accion'), 'Nota');
assert.equal(ejecutar('estudianteActual().iniciales'), 'AB');
assert.equal(ejecutar('estudianteActual().dimensiones[1]'), 2);
assert.equal(ejecutar('estado.momentos.length'), 0);
contexto.localStorage.setItem = () => {throw new Error('bloqueado');};
assert.doesNotThrow(() => ejecutar('mostrarPestana("apoyos")'));
console.log('Correcto: inicio, hash e historial, pestañas y teclado, foco, estado, filtros sin duplicación, cambio de ancho, contador, limpieza sin perder nivel/mochila y almacenamiento bloqueado.');
