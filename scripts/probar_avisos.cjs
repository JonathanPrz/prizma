const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const leer = ruta => fs.readFileSync(path.join(__dirname, '..', ruta), 'utf8');
function visita(vistos = {}, bloqueado = false) {
  const nodos = new Map(), almacen = new Map(Object.entries(vistos));
  const enlaces = ['reabrir-escolar', 'reabrir-superior'].map(nodo);
  const guias = [nodo('reabrir-guia')];
  const c = vm.createContext({document: {
    activeElement: null,
    querySelector: selector => selector === 'dialog[open]' ? [...nodos.values()].find(n => n.open) || null : nodos.get(selector) || null,
    querySelectorAll: selector => selector === 'dialog' ? dialogos() : selector === '.enlace-aviso-apoyos' ? enlaces : selector === '.enlace-guia-dua' ? guias : [],
  }, localStorage: {
    getItem(k) {if (bloqueado) throw Error('bloqueado'); return almacen.get(k);},
    setItem(k, v) {if (bloqueado) throw Error('bloqueado'); almacen.set(k, v);},
  }, window: {matchMedia: () => ({matches: false})}, location: {hash: '#dua'}, history: {pushState() {}}});
  function nodo(id) {
    return {id, open: false, isConnected: true, eventos: {}, returnValue: '',
      addEventListener(k, fn) {(this.eventos[k] ||= []).push(fn);},
      emit(k) {for (const fn of this.eventos[k] || []) fn({preventDefault() {},currentTarget: this});},
      focus() {c.document.activeElement = this;},
      showModal() {assert.equal(dialogos().filter(n => n.open).length, 0, 'No se superponen diálogos'); this.open = true;},
      close(valor = '') {this.returnValue = valor; this.open = false; this.emit('close');},
      append() {}, setAttribute() {},
    };
  }
  const dialogos = () => ['guia-dua','aviso-apoyos','aviso-privacidad','filtros-dialogo','mochila'].map(id => nodos.get('#'+id));
  for (const id of ['guia-dua','guia-empezar','t-guia-dua','aviso-apoyos','t-aviso-apoyos','acuerdo-escolar','acuerdo-superior','apoyos-entendido','ver-privacidad','aviso-privacidad','privacidad','privacidad-entendido','t-privacidad','filtros-dialogo','mochila','tab-dua','tab-apoyos','panel-dua','panel-apoyos','abrir-filtros','t-filtros-dua']) nodos.set('#'+id,nodo(id));
  for (const id of ['dua','apoyos']) nodos.set('#panel-'+id+' .cabecera-intro',nodo('intro-'+id));
  vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/, ''),c);
  const run = code => vm.runInContext(code,c), n = id => nodos.get('#'+id);
  run('prepararAvisos()');
  return {run,n,almacen,c,enlaces,guias};
}
for (const primero of ['dua','apoyos']) {
  const v = visita(), {run,n,almacen,c} = v;
  run(`mostrarPestana('${primero}')`);
  assert(n(primero === 'dua' ? 'guia-dua' : 'aviso-apoyos').open);
  assert.equal(c.document.activeElement.id, primero === 'dua' ? 't-guia-dua' : 't-aviso-apoyos');
  n(primero === 'dua' ? 'guia-empezar' : 'apoyos-entendido').emit('click');
  const segundo = primero === 'dua' ? 'apoyos' : 'dua';
  run(`mostrarPestana('${segundo}')`);
  assert(n(segundo === 'dua' ? 'guia-dua' : 'aviso-apoyos').open);
  n(segundo === 'dua' ? 'guia-empezar' : 'apoyos-entendido').emit('click');
  assert.equal(almacen.get('prizma.guia-dua.v1'),'1');
  assert.equal(almacen.get('prizma.aviso-apoyos.v1'),'1');
  assert.equal(almacen.get('prizma.privacidad.v1'),'1');
  assert.equal(run('privacidadAvisada'),true);
  run("mostrarPestana('apoyos'); mostrarPestana('dua')");
  assert(!n('aviso-apoyos').open && !n('guia-dua').open);
}
const v = visita(), {run,n,c,almacen} = v;
run("estado.perfil.nivel='superior'; mostrarPestana('apoyos')");
assert(n('acuerdo-escolar').hidden && !n('acuerdo-superior').hidden);
n('ver-privacidad').emit('click');
assert(n('aviso-privacidad').open && !n('aviso-apoyos').open);
assert.equal(almacen.get('prizma.aviso-apoyos.v1'),undefined);
n('aviso-privacidad').close(); // Escape vuelve al aviso pendiente, sin marcarlo como entendido.
assert(n('aviso-apoyos').open);
assert.equal(c.document.activeElement.id,'t-aviso-apoyos');
n('apoyos-entendido').emit('click');
assert.equal(c.document.activeElement.id,'tab-apoyos');
run("estado.perfil.nivel='basica'");v.enlaces[0].emit('click');
assert(!n('acuerdo-escolar').hidden && n('acuerdo-superior').hidden);
n('aviso-apoyos').close();
run("mostrarGuiaDUA(); mostrarPestana('apoyos')");
assert(!n('aviso-apoyos').open);
n('guia-dua').close();
// Un aviso automático pendiente espera también a los otros diálogos de la página.
const cola = visita();cola.n('mochila').showModal();cola.run("mostrarPestana('apoyos')");
assert(!cola.n('aviso-apoyos').open);cola.n('mochila').close();assert(cola.n('aviso-apoyos').open);
const privacidadEnCola = visita({'prizma.guia-dua.v1':'1','prizma.aviso-apoyos.v1':'1'});
privacidadEnCola.n('mochila').showModal();
privacidadEnCola.run('mostrarAvisoPrivacidad()');
assert(!privacidadEnCola.n('aviso-privacidad').open);
privacidadEnCola.n('mochila').close();
assert(privacidadEnCola.n('aviso-privacidad').open);
for (const bloqueado of [false,true]) {
  const w = visita({},bloqueado);w.run("mostrarPestana('dua'); mostrarPestana('apoyos')");
  assert(!w.n('aviso-apoyos').open);w.n('guia-dua').close();assert(w.n('aviso-apoyos').open);
  w.n('aviso-apoyos').close();w.run("mostrarPestana('dua'); mostrarPestana('apoyos')");
  assert(!w.n('aviso-apoyos').open && !w.n('guia-dua').open);
}
const recordada = visita({'prizma.guia-dua.v1':'1','prizma.aviso-apoyos.v1':'1','prizma.privacidad.v1':'1'});
recordada.run("mostrarPestana('dua'); mostrarPestana('apoyos')");assert(!recordada.n('aviso-apoyos').open && !recordada.n('guia-dua').open);
const catalogo = JSON.parse(leer('data/recomendaciones.json'));
assert(!catalogo.some(r => r.id === 'sup-coordinar'));
const html = leer('index.html');
for (const texto of ['Antes de empezar','Cómo se acuerdan los apoyos','Conversa con el estudiante y su familia antes de aplicar un apoyo. Las adecuaciones se acuerdan con el equipo de apoyo y se registran en el PACI.','Los ajustes razonables se acuerdan con el estudiante y la unidad de inclusión de tu institución. Pregúntale qué barreras encuentra y qué le ha servido antes, y deja el acuerdo por escrito (Ley 21.091, art. 2 e; Ley 20.422, art. 39).','Ver aviso completo']) assert(html.includes(texto));
console.log('Correcto: primera entrada por ambas pestañas, memoria y almacenamiento bloqueado, foco, privacidad completa y retorno, textos por nivel, secuencia sin diálogos superpuestos y ficha retirada.');
