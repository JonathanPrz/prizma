const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const eventos = {}, nodos = new Map(), enlaces = [];
const almacen = new Map();
const contexto = vm.createContext({
  document: {querySelector: selector => nodos.get(selector), querySelectorAll: selector => selector === '.pasos a' || selector === '[data-paso], .saltar' ? enlaces : []},
  location: {hash: ''}, history: {replaceState(a, b, hash) {contexto.location.hash = hash;}},
  window: {addEventListener(tipo, fn) {eventos[tipo] = fn;}},
  localStorage: {setItem(clave, valor) {almacen.set(clave, JSON.parse(valor));}},
});
function nodo(id) {
  return {id, hidden: false, eventos: {}, atributos: {},
    focus() {contexto.document.activeElement = this;},
    scrollIntoView() {contexto.ultimoDesplazamiento = this.id;},
    setAttribute(k, v) {this.atributos[k] = v;}, removeAttribute(k) {delete this.atributos[k];},
    addEventListener(tipo, fn) {this.eventos[tipo] = fn;},
    showModal() {this.open = true; nodos.get('#t-seleccion').focus();},
    close() {this.open = false; this.eventos.close();},
  };
}
for (const id of ['resumen-clase', 'abrir-mochila', 'cerrar-mochila', 'mochila', 't-seleccion']) nodos.set('#' + id, nodo(id));
for (const paso of [1, 2, 3]) {
  nodos.set('#paso-' + paso, nodo('paso-' + paso));
  nodos.set('#paso-' + paso + ' h2', nodo('titulo-' + paso));
  const enlace = nodo('enlace-' + paso); enlace.dataset = {paso: String(paso)}; enlace.hash = '#paso-' + paso; enlaces.push(enlace);
}
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''), contexto);
vm.runInContext('prepararPasos()', contexto);
assert.equal(contexto.location.hash, '#paso-1');
for (const paso of [2, 3, 2, 1]) {
  contexto.location.hash = '#paso-' + paso; eventos.hashchange();
  assert.equal(contexto.document.activeElement.id, 'titulo-' + paso);
  assert.equal(contexto.ultimoDesplazamiento, 'paso-' + paso);
  assert.equal(almacen.get('prizma.v1').paso, paso);
  for (const numero of [1, 2, 3]) {
    assert.equal(nodos.get('#paso-' + numero).hidden, numero !== paso);
    assert.equal(enlaces[numero - 1].atributos['aria-current'], numero === paso ? 'step' : undefined);
  }
}
let prevenido = false;
enlaces[0].eventos.click({preventDefault() {prevenido = true;}});
assert.equal(prevenido, true);
contexto.location.hash = '#paso-99'; eventos.hashchange();
assert.equal(contexto.location.hash, '#paso-1');
vm.runInContext('necesidades = [{id: "tareas", texto: "Tareas largas"}]; estado.perfil.nivel = "basica"; estado.perfil.meta = "Explicar"; estado.necesidades = ["tareas"]; pintarResumen()', contexto);
assert.equal(nodos.get('#resumen-clase').textContent, 'Educación básica · Explicar · Quiere resolver: Tareas largas');
nodos.get('#abrir-mochila').eventos.click();
assert.equal(nodos.get('#mochila').open, true);
assert.equal(contexto.document.activeElement.id, 't-seleccion');
nodos.get('#cerrar-mochila').eventos.click();
assert.equal(nodos.get('#mochila').open, false);
assert.equal(contexto.document.activeElement.id, 'abrir-mochila');
contexto.localStorage.setItem = () => {throw new Error('bloqueado');};
assert.doesNotThrow(() => vm.runInContext('mostrarPaso(3)', contexto));
console.log('Correcto: inicio, hash, cambios de paso y vuelta atrás, paso inválido, foco, resumen, mochila y almacenamiento bloqueado.');
