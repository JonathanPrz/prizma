const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const leer=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const opciones=[...leer('index.html').split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m=>({value:m[1]}));
const almacen=new Map();
const c=vm.createContext({document:{querySelector:()=>({options:opciones}),querySelectorAll:()=>[]},localStorage:{getItem:k=>almacen.get(k),setItem:(k,v)=>almacen.set(k,v)}});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);
const e=s=>JSON.parse(JSON.stringify(vm.runInContext(s,c)));
vm.runInContext(`catalogo=${leer('data/recomendaciones.json')}; necesidades=${leer('data/necesidades.json')}`,c);
for(const viejo of ['media-ch','media-tp']){
 assert.equal(e(`normalizarPerfil({nivel:'${viejo}'}).nivel`),'media');
 const datos={app:'prizma',version:1,perfil:{nivel:viejo},estudiante:{practica:true},seleccion:{}};
 almacen.set('prizma.v1',JSON.stringify(datos));vm.runInContext('cargar();guardar()',c);
 assert.equal(e('estado.perfil.nivel'),'media');assert.equal(e('estado.perfil.practica'),true);assert.equal(e('Object.hasOwn(estudianteActual(),"practica")'),false);
 c.datos=datos;assert.equal(e('validarRespaldo(datos).perfil.practica'),true);assert.equal(e('validarRespaldo(datos).perfil.nivel'),'media');
}
assert.equal(e('normalizarPerfil({practica:false},true).practica'),false);
for(const v of ['"true"','1','null','{}','[]'])assert.equal(e(`normalizarPerfil({practica:${v}},true).practica`),false);
assert.equal(e('normalizarPerfil({},true).practica'),true);assert.equal(e('normalizarPerfil({}).practica'),false);
vm.runInContext('estado.perfil=normalizarPerfil({nivel:"media"}); estado.pestana="dua"',c);
assert.equal(e('voc("clase")'),'clase');assert.equal(e('voc("curso")'),'curso');
for(const pestana of ['dua','apoyos']){
 vm.runInContext(`estado.pestana='${pestana}'; estado.perfil.practica=false`,c);assert(!e('practicaActiva()'));vm.runInContext('estado.perfil.practica=true',c);assert(e('practicaActiva()'));
}
for(const nivel of ['basica','media','superior']){vm.runInContext(`estado.perfil.nivel='${nivel}'; estudianteActual().dimensiones={2:3}`,c);assert.equal(e('hayPracticas()'),true);assert.equal(e('practicasVisibles().length'),e('catalogo.filter(r=>r.tipo==="acceso"&&aplica(r)&&esPractica(r)&&puntaje(r)>0).length'));assert(e('practicasVisibles().every(r=>puntaje(r)>0)'));assert.equal(e('visibles().length'),36);assert(e('documento().resumen.flat().join(". ")').includes('Clase con taller, laboratorio o terreno'));}
vm.runInContext('estado.perfil.nivel="parvularia"',c);assert.equal(e('hayPracticas()'),false);assert.equal(e('practicaActiva()'),false);assert.equal(e('practicasVisibles().length'),0);assert(!e('documento().resumen.flat().join(". ")').includes('Clase con taller'));
vm.runInContext(`var original=catalogo;var modelo=catalogo.find(r=>r.tipo==='dua');catalogo=catalogo.filter(r=>r.tipo!=='dua').concat([
 {...modelo,id:'sim-practica',consideracion:'1.1',contextos:['practica'],destacada:false},
 {...modelo,id:'sim-necesidad',consideracion:'4.1',contextos:[],destacada:false},
 {...modelo,id:'sim-detalles',consideracion:'1.2',contextos:['crear','grupo'],destacada:false},
 {...modelo,id:'sim-destacada',consideracion:'1.3',contextos:[],destacada:true}
]);estado.perfil={nivel:'media',practica:true,actividad:['crear'],evidencia:['grupo'],meta:''};estado.necesidades=['evaluar'];estado.momentos=[];estado.propositos=[]`,c);
assert.deepEqual(e('visibles().map(r=>r.id)'),['sim-necesidad','sim-practica','sim-detalles','sim-destacada']);
vm.runInContext('estado.perfil.practica=false',c);assert.deepEqual(e('visibles().map(r=>r.id)'),['sim-necesidad','sim-detalles','sim-destacada','sim-practica']);
vm.runInContext('catalogo=original; estado.perfil.practica=true; sincronizarPerfil=()=>{};pintarControles=()=>{};pintarTarjetas=()=>{};actualizarRespaldo=()=>{};borradorDua={perfil:{...estado.perfil},necesidades:[]};limpiarClase()',c);assert.equal(e('estado.perfil.practica'),true);
console.log('Correcto: migración CH/TP y práctica antigua, precedencia y validación booleanas, 36 DUA/prácticas pertinentes, prioridad necesidades > práctica > detalles > destacadas, práctica y limpieza independientes.');
