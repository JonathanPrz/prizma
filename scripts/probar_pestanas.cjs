const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const eventos = {}, nodos = new Map(), almacen = new Map();
const telefono = {matches: false, addEventListener(tipo, fn) {this.cambiar = fn;}};
let areas = [];
const contexto = vm.createContext({
  document: {createElement: tag => nodo(tag), querySelector: selector => nodos.get(selector), querySelectorAll: selector => selector === '#areas input:checked' ? areas : []},
  location: {hash: ''}, history: {replaceState(a, b, hash) {contexto.location.hash = hash;},pushState(a,b,hash){contexto.location.hash=hash;}},
  window: {addEventListener(tipo, fn) {eventos[tipo] = fn;}, matchMedia: () => telefono},
  localStorage: {setItem(clave, valor) {almacen.set(clave, JSON.parse(valor));}},
});
function nodo(id) {
  return {id, open: false, eventos: {}, atributos: {},
    replaceChildren(){}, focus() {contexto.document.activeElement = this;},
    setAttribute(k, v) {this.atributos[k] = v;},
    addEventListener(tipo, fn) {this.eventos[tipo] = fn;},
    append(hijo) {if (hijo.padre) hijo.padre.hijo = null; this.hijo = hijo; hijo.padre = this;},
    showModal() {this.open = true; nodos.get('#t-seleccion').focus();},
    close() {this.open = false; this.eventos.close();},
  };
}
for (const id of ['persistencia-aviso','panel-trabajo','tab-trabajo','nivel-campo','practica-campo','paso-descripcion-toggle','panel-dua','panel-apoyos','tab-dua','tab-apoyos','.saltar','abrir-mochila','cerrar-mochila','mochila','mochila-dialogo','t-seleccion','paso-clase-toggle','paso-clase-cuerpo','paso-clase-resumen','nivel','nivel-ayuda','nivel-ayudas','nivel-etiqueta','nivel-casos-estado','nivel-caso','nivel-estudiante','panel-nivel','panel-conteo','panel-grupos','panel-ir','t-panel-elegidas','panel-elegidas','preparar-practica-campo','preparar-practica','preparar-practica-ayuda','contexto','pie-educacion','pie-trabajo','pie-ambito','indicador-pasos','barra-continuar','necesidades-campo','pestanas-educacion','continuar','documento-estudiante'])nodos.set(id===' .saltar'.trim()?id:'#'+id,nodo(id));
const ejecutar = codigo => vm.runInContext(codigo, contexto);
ejecutar(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/iniciar\(\);\s*$/, ''));
// The dedicated work-flow test covers rendering; this suite checks tab navigation.
ejecutar('sincronizarTrabajo=()=>{};cargarPrivacidad=()=>{};pintarSeleccion=()=>{};prepararIndicador=()=>{};prepararPestanas()');
assert.equal(nodos.get('#panel-dua').hidden, false);
assert.equal(nodos.get('#abrir-mochila').hidden, false);

for (const id of ['apoyos', 'trabajo', 'dua', 'trabajo', 'apoyos', 'dua']) {
  contexto.location.hash = '#' + id; eventos.hashchange();
  assert.equal(contexto.document.activeElement.id, (id==='trabajo'?'panel-':'tab-') + id);
  assert.equal(almacen.get('prizma.v1').pestana, id);
  assert.equal(nodos.get('#nivel-campo').hidden,id==='apoyos');
  assert.equal(nodos.get('#nivel').value,id==='trabajo'?'practica-trabajo':'basica');
  for (const nombre of ['dua', 'apoyos', 'trabajo']) {
    assert.equal(nodos.get('#panel-' + nombre).hidden, nombre !== id);
    if(nombre==='trabajo')continue;
    assert.equal(nodos.get('#tab-' + nombre).atributos['aria-selected'], String(nombre === id));
    assert.equal(nodos.get('#tab-' + nombre).tabIndex, nombre === id ? 0 : -1);
  }
}
contexto.location.hash = '#inexistente'; eventos.hashchange();
assert.equal(ejecutar('estado.pestana'),'dua');
for (const [tab, tecla, destino] of [['dua', 'ArrowRight', 'apoyos'], ['apoyos', 'ArrowLeft', 'dua'], ['dua', 'End', 'apoyos'], ['apoyos', 'ArrowRight', 'dua'], ['dua', 'ArrowLeft', 'apoyos'], ['apoyos', 'Home', 'dua']]) {
  let prevenido = false;
  nodos.get('#tab-' + tab).eventos.keydown({key: tecla, preventDefault() {prevenido = true;}});
  assert.equal(prevenido, true); assert.equal(contexto.location.hash, '#'+destino);
  contexto.location.hash = '#' + destino; eventos.hashchange();
}
nodos.get('#tab-apoyos').eventos.click(); assert.equal(contexto.location.hash, '#apoyos');
contexto.location.hash = '#apoyos'; eventos.hashchange();
nodos.get('.saltar').eventos.click({preventDefault() {}});
assert.equal(contexto.document.activeElement.id, 'panel-apoyos');
ejecutar('estado.pestana = "apoyos"'); contexto.location.hash = ''; ejecutar('prepararPestanas()');
assert.equal(ejecutar('estado.pestana'), 'apoyos');

// Width no longer moves controls into a modal; tabs keep their own inline steps.
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const id of ['filtros-dialogo','abrir-filtros','lugar-filtros-dua','lugar-filtros-apoyos'])assert(!html.includes('id="'+id+'"'),id);
for(const ancho of [390,1280]){
 telefono.matches=ancho===390; ejecutar('mostrarPestana("dua"); abrirPaso("paso-clase",true)');
 assert.equal(nodos.get('#paso-clase-cuerpo').hidden,false);assert.equal(nodos.get('#paso-clase-toggle').atributos['aria-expanded'],'true');
 ejecutar('abrirPaso("paso-clase",false)');assert.equal(nodos.get('#paso-clase-resumen').hidden,false);
}
ejecutar('var pintadas=0;pintarSeleccion=()=>pintadas++');
nodos.get('#abrir-mochila').eventos.click();assert.equal(ejecutar('pintadas'),1);assert(nodos.get('#mochila-dialogo').open);assert.equal(contexto.document.activeElement.id,'t-seleccion');
nodos.get('#cerrar-mochila').eventos.click();assert.equal(contexto.document.activeElement.id,'abrir-mochila');
ejecutar('estado.perfil={nivel:"basica",practica:true,meta:"Meta",actividad:["crear"],evidencia:["grupo"],reflexion:"Resultado"};estado.necesidades=["a"];estado.seleccion={accion:"Nota"};Object.assign(estudianteActual(),normalizarEstudiante({iniciales:"JP2",dimensiones:{1:2},ayuda:"Visual"}));sincronizarPerfil=()=>{};pintarControles=()=>{};pintarTarjetas=()=>{};pintarApoyos=()=>{};resumenClase=()=>{};actualizarRespaldo=()=>{};limpiarClase()');
assert.equal(ejecutar('estado.necesidades.length'),0);assert.equal(ejecutar('estado.perfil.actividad.length'),0);assert.equal(ejecutar('estado.perfil.meta'),'Meta');
assert.equal(ejecutar('estado.perfil.nivel'),'basica');assert.equal(ejecutar('estado.perfil.practica'),false);assert.equal(ejecutar('estado.perfil.reflexion'),'Resultado');assert.equal(ejecutar('estado.seleccion.accion'),'Nota');assert.equal(ejecutar('estudianteActual().iniciales'),'JP2');
contexto.localStorage.setItem=()=>{throw Error('bloqueado');};assert.doesNotThrow(()=>ejecutar('mostrarPestana("apoyos")'));
console.log('Correcto: hash, historial, pestañas y teclado, foco y persistencia; pasos en ambos anchos sin diálogo ni controles movidos, mochila y borrado de respuestas sin perder clase ni casos, almacenamiento bloqueado.');
