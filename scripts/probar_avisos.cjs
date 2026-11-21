const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const leer = ruta => fs.readFileSync(path.join(__dirname, '..', ruta), 'utf8');
function visita(bloqueado = false, confirmada = false) {
  const nodos = new Map(), almacen = new Map(confirmada ? [['prizma.privacidad.v1','1']] : []);
  const guias = [nodo('guia-panel'),nodo('guia-pie')], apoyos = [nodo('apoyos-panel'),nodo('apoyos-pie')], privacidad = [nodo('privacidad'),nodo('datos-permitidos')];
  const ids = ['guia-dua','guia-apoyos','aviso-privacidad','filtros-dialogo','mochila'];
  const abiertos = () => ids.map(id => nodos.get('#'+id)).filter(n => n.open);
  const c = vm.createContext({document: {
    activeElement: null, createElement: tag => nodo(tag),
    querySelector: s => s === 'dialog[open]' ? abiertos()[0] || null : nodos.get(s) || (nodos.set(s,nodo(s.replace(/^#/,''))),nodos.get(s)),
    querySelectorAll: s => s === 'dialog' ? ids.map(id => nodos.get('#'+id)) : s === '.enlace-guia-dua' ? guias : s === '.enlace-guia-apoyos' ? apoyos : s === '#privacidad, .enlace-privacidad' ? privacidad : [],
  },localStorage: {getItem(k) {if(bloqueado)throw Error('bloqueado');return almacen.get(k);},setItem(k,v) {if(bloqueado)throw Error('bloqueado');almacen.set(k,v);}},window:{matchMedia:()=>({matches:false})},location:{hash:'#dua'},history:{pushState(){}}});
  function nodo(id) {
    return {id,open:false,isConnected:true,returnValue:'',eventos:{},value:'',
      closest() {return this.dialogo || null;}, focus(){c.document.activeElement=this;},
      addEventListener(k,fn,opciones) {(this.eventos[k] ||= []).push({fn,once:opciones?.once});},
      emit(k) {for(const e of [...this.eventos[k] || []]) {if(e.once)this.eventos[k]=this.eventos[k].filter(x=>x!==e);e.fn({preventDefault(){},currentTarget:this,target:this});}},
      showModal(){assert.equal(abiertos().length,0,'Un solo diálogo');this.open=true;},
      replaceChildren(){}, close(valor=''){this.returnValue=valor;this.open=false;this.emit('close');},append(){},setAttribute(){},
    };
  }
  for(const id of [...ids,'t-guia-dua','guia-empezar','t-guia-apoyos','guia-apoyos-escolar','guia-apoyos-superior','guia-apoyos-entendido','t-privacidad','privacidad-entendido','tab-dua','tab-apoyos','panel-dua','panel-apoyos','abrir-filtros','t-filtros-dua','agregar-estudiante','quitar-estudiante','t-filtros-apoyos','t-filtros-dialogo','revision-situaciones','revision-situaciones-texto','revision-situaciones-entendido','t-apoyos','iniciales','estudiante-ayuda','estudiante-voz','asignatura','preparar-practica','preparar-practica-campo','preparar-practica-ayuda','paso-descripcion-toggle'])nodos.set('#'+id,nodo(id));
  for(const id of ['dua','apoyos'])nodos.set('#panel-'+id+' .acciones-intro',nodo('intro-'+id));
  vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);
  const run = code => vm.runInContext(code,c), n = id => nodos.get('#'+id);
  run('prepararAvisos(); cargarPrivacidad=()=>{}; pintarSeleccion=()=>{}; prepararIndicador=()=>{}');
  return {run,n,c,almacen,guias,apoyos,privacidad,abiertos,nodo};
}
for(const bloqueado of [false,true]) {
 const v=visita(bloqueado),{run,n,abiertos,c}=v;
 for(const id of ['dua','apoyos','dua','apoyos']){run(`mostrarPestana('${id}')`);assert.equal(abiertos().length,0);}
 for(const superior of [false,true]){
  run(`estudianteActual().nivel='${superior?'superior':'media'}'`);
  for(const enlace of v.apoyos){enlace.emit('click');assert(n('guia-apoyos').open);assert.equal(c.document.activeElement.id,'t-guia-apoyos');assert.equal(n('t-guia-apoyos').textContent,superior?'¿Qué son los ajustes razonables?':'¿Qué son los apoyos para un estudiante?');assert.equal(n('guia-apoyos-escolar').hidden,superior);assert.equal(n('guia-apoyos-superior').hidden,!superior);n('guia-apoyos-entendido').emit('click');assert.equal(c.document.activeElement,enlace);}
 }
 v.guias[0].emit('click');run('mostrarGuiaApoyos()');assert(!n('guia-apoyos').open);n('guia-dua').close();assert.equal(c.document.activeElement,v.guias[0]);
 for(const enlace of v.privacidad){enlace.emit('click');assert(n('aviso-privacidad').open);assert.equal(c.document.activeElement.id,'t-privacidad');n('privacidad-entendido').emit('click');assert.equal(c.document.activeElement,enlace);}
 assert(run('privacidadAvisada'));assert(!v.almacen.has('prizma.aviso-apoyos.v1')&&!v.almacen.has('prizma.guia-dua.v1'));
}
// La privacidad de la primera escritura no depende de haber abierto una guía.
for(const campo of ['iniciales','estudiante-ayuda','estudiante-voz']){
 const v=visita(),{run,n}=v;
 run('pintarSeleccion=()=>{}; pintarSelectorEstudiantes=()=>{}; escucharEstudiante()');
 n(campo).value=campo==='iniciales'?'AB':'Apoyo visual';n(campo).emit('input');assert(n('aviso-privacidad').open);assert.equal(n('t-apoyos').textContent,campo==='iniciales'?'2. Apoyos sugeridos para AB':'2. Apoyos sugeridos para Estudiante 1');n('privacidad-entendido').emit('click');assert.equal(v.almacen.get('prizma.privacidad.v1'),'1');n(campo).emit('input');assert.equal(v.abiertos().length,0);
 run("estudianteActual().nivel='superior'; pintarTituloApoyos()");assert.equal(n('t-apoyos').textContent,campo==='iniciales'?'2. Ajustes razonables sugeridos para AB':'2. Ajustes razonables sugeridos para Estudiante 1');
}
const sinIniciales=visita();sinIniciales.run("estudianteActual().nivel='superior'; pintarTituloApoyos()");assert.equal(sinIniciales.n('t-apoyos').textContent,'2. Ajustes razonables sugeridos para Estudiante 1');
const recordada=visita(false,true);assert(recordada.run('privacidadAvisada'));recordada.privacidad[1].emit('click');assert(recordada.n('aviso-privacidad').open);
const mochila=visita();const nota=mochila.nodo('nota');nota.dialogo=mochila.n('mochila');mochila.c.nota=nota;mochila.n('mochila').showModal();mochila.run('mostrarAvisoPrivacidad(nota)');assert(mochila.n('aviso-privacidad').open&&!mochila.n('mochila').open);mochila.n('privacidad-entendido').emit('click');assert(mochila.n('mochila').open);assert.equal(mochila.c.document.activeElement,nota);
const html=leer('index.html'),tarea=leer('docs/tareas/022-guias-sin-emergentes.md');
for(const tipo of ['escolar','superior']){
 const bloque=html.split('id="guia-apoyos-'+tipo+'"')[1].split('</div>')[0];const lista=[...bloque.split('<ol>')[1].matchAll(/<li>(.*?)<\/li>/g)].map(m=>m[1]);assert.equal(lista.length,6);const inicio=tarea.indexOf(tipo==='escolar'?'**En la escuela.**':'**En superior.**');
 const esperada=[...tarea.slice(inicio).matchAll(/^   \d\. (.*)$/gm)].slice(0,6).map(m=>m[1]);assert.deepEqual(lista,esperada);
 assert(tarea.includes(bloque.match(/<p class="ayuda">(.*?)<\/p>/)[1]));
}
assert(!html.includes('<dialog id="aviso-apoyos"'));assert(!leer('app.js').includes('prizma.aviso-apoyos.v1'));assert.equal((html.match(/class="enlace-guia-dua"/g)||[]).length,1);
console.log('Correcto: ninguna guía automática, aperturas manuales y foco, texto exacto de escuela/superior, privacidad al escribir y memoria, notas sin solapar, encabezados y claves retiradas.');
// El evento close nativo puede llegar después de que la persona enfocó otro campo.
const rapida=visita(),origenRapido=rapida.nodo('trabajo-iniciales'),siguienteCampo=rapida.nodo('trabajo-puesto');
rapida.c.origenRapido=origenRapido;rapida.run('mostrarAvisoPrivacidad(origenRapido)');
rapida.n('aviso-privacidad').open=false;siguienteCampo.focus();rapida.n('aviso-privacidad').emit('close');
assert.equal(rapida.c.document.activeElement,siguienteCampo,'Cerrar privacidad no debe robar el foco del siguiente campo');
