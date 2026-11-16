const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const eventos = {}, nodos = new Map(), almacen = new Map();
const telefono = {matches: false, addEventListener(tipo, fn) {this.cambiar = fn;}};
let areas = [];
const contexto = vm.createContext({
  document: {querySelector: selector => nodos.get(selector), querySelectorAll: selector => selector === '#areas input:checked' ? areas : []},
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
    showModal() {this.open = true; nodos.get('#t-seleccion').focus();},
    close() {this.open = false; this.eventos.close();},
  };
}
for (const id of ['paso-descripcion-toggle','panel-dua','panel-apoyos','tab-dua','tab-apoyos','.saltar','abrir-mochila','cerrar-mochila','mochila','t-seleccion','paso-clase-toggle','paso-clase-cuerpo','paso-clase-resumen'])nodos.set(id===' .saltar'.trim()?id:'#'+id,nodo(id));
const ejecutar = codigo => vm.runInContext(codigo, contexto);
ejecutar(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''));
ejecutar('prepararPestanas()');
assert.equal(contexto.location.hash, '#dua');

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

// Width no longer moves controls into a modal; tabs keep their own inline steps.
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const id of ['filtros-dialogo','abrir-filtros','lugar-filtros-dua','lugar-filtros-apoyos'])assert(!html.includes('id="'+id+'"'),id);
for(const ancho of [390,1280]){
 telefono.matches=ancho===390; ejecutar('mostrarPestana("dua"); abrirPaso("paso-clase",true)');
 assert.equal(nodos.get('#paso-clase-cuerpo').hidden,false);assert.equal(nodos.get('#paso-clase-toggle').atributos['aria-expanded'],'true');
 ejecutar('abrirPaso("paso-clase",false)');assert.equal(nodos.get('#paso-clase-resumen').hidden,false);
}
ejecutar('var pintadas=0;pintarSeleccion=()=>pintadas++');
nodos.get('#abrir-mochila').eventos.click();assert.equal(ejecutar('pintadas'),1);assert(nodos.get('#mochila').open);assert.equal(contexto.document.activeElement.id,'t-seleccion');
nodos.get('#cerrar-mochila').eventos.click();assert.equal(contexto.document.activeElement.id,'abrir-mochila');
ejecutar('estado.perfil={nivel:"basica",practica:true,meta:"Meta",actividad:["crear"],evidencia:["grupo"],reflexion:"Resultado"};estado.necesidades=["a"];estado.seleccion={accion:"Nota"};Object.assign(estudianteActual(),normalizarEstudiante({iniciales:"JP2",dimensiones:{1:2},ayuda:"Visual"}));sincronizarPerfil=()=>{};pintarControles=()=>{};borradorDua={perfil:{...estado.perfil},necesidades:["a"],propositos:["motivar"],momentos:["durante"]};limpiarFiltros()');
assert.equal(ejecutar('estado.necesidades[0]'),'a','Limpiar el borrador no actualiza resultados guardados');
assert.equal(ejecutar('borradorDua.necesidades.length'),0);assert.equal(ejecutar('borradorDua.perfil.actividad.length'),0);
assert.equal(ejecutar('estado.perfil.nivel'),'basica');assert.equal(ejecutar('estado.perfil.practica'),true);assert.equal(ejecutar('estado.perfil.reflexion'),'Resultado');assert.equal(ejecutar('estado.seleccion.accion'),'Nota');assert.equal(ejecutar('estudianteActual().iniciales'),'JP2');
contexto.localStorage.setItem=()=>{throw Error('bloqueado');};assert.doesNotThrow(()=>ejecutar('mostrarPestana("apoyos")'));
console.log('Correcto: hash, historial, pestañas y teclado, foco y persistencia; pasos en ambos anchos sin diálogo ni controles movidos, mochila y limpieza del borrador sin perder clase ni casos, almacenamiento bloqueado.');
