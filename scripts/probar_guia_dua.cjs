const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const nodos = new Map();
const almacen = new Map();
const contexto = vm.createContext({window: {matchMedia: () => ({matches: false})}, location: {hash: "#dua"}, history: {pushState() {}}, document: {
  activeElement: null,
  querySelector: selector => selector === "dialog[open]" ? [...nodos.values()].find(n => n.open) || null : nodos.get(selector) || null,
  querySelectorAll: () => enlaces,
}, localStorage: {getItem: clave => almacen.get(clave), setItem: (clave, valor) => almacen.set(clave, valor)}});
function nodo(id) {
  return {id, isConnected: true, open: false, returnValue: '', eventos: {}, closest() {return null;},
    addEventListener(tipo, fn) {this.eventos[tipo] = fn;},
    setAttribute() {},
    append() {},
    focus() {contexto.document.activeElement = this;},
    showModal() {this.open = true; nodos.get(this.id === 'guia-dua' ? '#t-guia-dua' : '#t-privacidad').focus();},
    close(valor) {this.open = false; if (valor !== undefined) this.returnValue = valor; this.eventos.close?.();},
    click() {this.eventos.click({preventDefault() {}, currentTarget: this});},
  };
}
for (const id of ['panel-trabajo','tab-trabajo','nivel-campo','practica-campo','t-filtros-apoyos', 't-filtros-dialogo', 'guia-dua', 't-guia-dua', 'guia-empezar', 'aviso-privacidad', 't-privacidad', 't-filtros-dua', 'filtros-dialogo', 'abrir-filtros', 'panel-dua', 'panel-apoyos', 'tab-dua', 'tab-apoyos','paso-descripcion-toggle','paso-clase-toggle','paso-clase-cuerpo','paso-clase-resumen','meta']) nodos.set('#' + id, nodo(id));
for (const id of ['dua', 'apoyos']) nodos.set('#panel-' + id + ' .acciones-intro', nodo('intro-' + id));
nodos.set('#necesidades button', nodo('primera-necesidad'));
const enlaces = [nodo('enlace-necesidades'), nodo('enlace-pie')];
const archivo = nombre => fs.readFileSync(path.join(__dirname, '..', nombre), 'utf8');
vm.runInContext(archivo('app.js').replace(/iniciar\(\);\s*$/, ''), contexto);
const guia = nodos.get('#guia-dua');
vm.runInContext('prepararGuiaDUA(); mostrarPestana=()=>{estado.ambito="educacion";estado.pestana="dua";}', contexto);
assert.equal(guia.open, false);
vm.runInContext('mostrarGuiaDUA()', contexto);
assert.equal(guia.open, true);
assert.equal(contexto.document.activeElement.id, 't-guia-dua');
nodos.get('#guia-empezar').click();
assert.equal(almacen.has('prizma.guia-dua.v1'), false);
assert.equal(contexto.document.activeElement.id, 'primera-necesidad');
vm.runInContext('prepararGuiaDUA()', contexto);
assert.equal(guia.open, false);
for (const enlace of enlaces) {
  enlace.click();
  assert.equal(guia.returnValue, '');
  guia.close();
  assert.equal(contexto.document.activeElement, enlace);
}
enlaces[0].click();
contexto.origenPrueba = nodo('iniciales');
vm.runInContext('mostrarAvisoPrivacidad(origenPrueba)', contexto);
assert.equal(nodos.get('#aviso-privacidad').open, false);
assert.equal(guia.open, true);
nodos.get('#guia-empezar').click();
assert.equal(nodos.get('#aviso-privacidad').open, true);
assert.equal(vm.runInContext('origenAvisoPrivacidad === origenPrueba && !privacidadPendiente', contexto), true);
nodos.get('#aviso-privacidad').close();
nodos.delete('#necesidades button');
enlaces[1].click();
nodos.get('#guia-empezar').click();
assert.equal(contexto.document.activeElement.id, 'meta');
contexto.localStorage.getItem = contexto.localStorage.setItem = () => {throw new Error('bloqueado');};
vm.runInContext('prepararGuiaDUA(); mostrarGuiaDUA()', contexto);
assert.equal(guia.open, true);
assert.doesNotThrow(() => nodos.get('#guia-empezar').click());
const html = archivo('index.html').split('<dialog id="guia-dua"')[1].split('</dialog>')[0];
assert.ok(html.includes('>¿Qué es el DUA y cómo usarlo?</h2>'));
assert.deepEqual([...html.split('<h3>Cómo usarlo</h3>')[1].matchAll(/<li>(.*?)<\/li>/g)].map(m => m[1].replace(/<[^>]+>/g,'')), [
  'Parte por la meta: ¿qué quieres que aprendan?',
  'Piensa qué podría impedir que algunos lo logren. Eso es una barrera.',
  'Elige qué quieres resolver. Prizma te mostrará primero las acciones que responden a eso.',
  'Elige pocas acciones. El DUA es un menú: no necesitas usarlas todas.',
  'Quita las barreras, no el desafío. Lo que quieres que aprendan se mantiene.',
  'Después de la clase, mira qué funcionó y ajusta.',
]);
assert.ok(html.includes('>Basado en las Pautas DUA 3.0 de CAST (2024).</p>'));
assert.ok(html.includes('>Empezar</button>'));
console.log('Correcto: texto exacto, guía solo manual, Empezar y foco, reapertura, prioridad de privacidad y almacenamiento bloqueado.');
