const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const leer = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const nodos = new Map(), almacen = new Map();
const opciones = [...leer('index.html').split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m => ({value:m[1]}));
function nodo(tag='div') { return {tag,hijos:[],eventos:{},options:opciones,open:false,
  replaceChildren(...h){this.hijos=h;},append(...h){this.hijos.push(...h);},setAttribute(k,v){this[k]=v;},addEventListener(t,f){this.eventos[t]=f;},focus(){},showModal(){this.open=true;},close(){this.open=false;}}; }
const campos=()=>nodos.get('#opciones-centro')?.hijos.map(n=>n.hijos[0]).filter(n=>n.checked)||[];
const c=vm.createContext({document:{createElement:nodo,querySelector:s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);},querySelectorAll:s=>s==='input[name="compartir-centro"]:checked'?campos():[]},localStorage:{getItem:k=>almacen.get(k),setItem:(k,v)=>almacen.set(k,v)}});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);
const run=s=>vm.runInContext(s,c), json=s=>JSON.parse(JSON.stringify(run(s)));
run(`catalogo=${leer('data/recomendaciones.json')};fuentes=Object.fromEntries(${leer('data/fuentes.json')}.map(f=>[f.id,f]));necesidades=${leer('data/necesidades.json')};`);
for(const valor of [undefined,false,1,'true',{},null]){c.valor=valor;assert.equal(run('normalizarEstudiante({practicaProfesional:valor}).practicaProfesional'),false);}
assert(run('normalizarEstudiante({practicaProfesional:true}).practicaProfesional'));
run("estado.estudiantes=[{id:'a',...normalizarEstudiante({iniciales:'ZZQX',dimensiones:{1:3,12:2},ayuda:'AYUDA_PRIVADA',voz:'VOZ_PRIVADA',practicaProfesional:true}),seleccion:{'pp-plan':'NOTA_PRIVADA','pp-c-pasos':'NOTA_PRIVADA','pp-c-analisis':'NOTA_PRIVADA','pp-e-barrera':''}},{id:'b',...normalizarEstudiante({iniciales:'QQZZ',voz:'OTRA_VOZ'}),seleccion:{'pp-c-puesto':'OTRA_NOTA'}}];estado.estudianteActivo='a';estado.perfil.nivel='media'");
// La entrada educativa solo ofrece el botón. Las tarjetas pertenecen al caso de práctica.
run('var origen=estado.estudiantes[0]; var respaldoAntiguo={app:"prizma",version:2,...JSON.parse(JSON.stringify(estado))};guardar();cargar();estado.ambito="trabajo";var e=trabajadorActual()');
assert.equal(run('e.nivelOrigen'), 'media');assert.equal(run('e.etapa'), 'practica');
assert.equal(run('e.seleccion["pp-c-pasos"]'), 'NOTA_PRIVADA');
assert(!run('estudianteActual().practicaProfesional'));assert(!run('estado.estudiantes[1].practicaProfesional'));
assert.deepEqual(json('estudianteActual().seleccion'),{});assert.equal(run('estado.estudiantes[1].seleccion["pp-c-puesto"]'),'OTRA_NOTA');
assert.equal(run('validarRespaldo(respaldoAntiguo).trabajadores.length'),1);
assert.equal(run('validarRespaldo(respaldoAntiguo).descartadas'),0);
for(const nivel of ['basica','parvularia','','media','superior']){
 c.nivel=nivel;run('estado.perfil.nivel=nivel;pintarPrepararPractica()');
 assert.equal(nodos.get('#preparar-practica-campo').hidden,!['media','superior'].includes(nivel));
}
run('e.nivelOrigen="superior"');
assert(!json('fichasPracticaProfesional("institucion",e).map(r=>r.id)').some(id=>['pp-plan','pp-visita','pp-seguridad','pp-horas'].includes(id)));
assert.equal(run('nombreGrupoPractica("institucion",e)'),'Lo que hace la institución educativa');
run("e.nivelOrigen='media'");assert.equal(run('nombreGrupoPractica("institucion",e)'),'Lo que hace la institución educativa');
let centro=json('fichasPracticaProfesional("centro",e).map(r=>r.id)');assert(centro.includes('pp-c-pasos'));assert(!centro.includes('pp-c-puesto'));assert(centro.includes('pp-c-analisis')&&centro.includes('pp-c-seguimiento'));
run('e.dimensiones={}');assert.deepEqual(json('fichasPracticaProfesional("centro",e).map(r=>r.id)'),['pp-c-analisis','pp-c-seguimiento']);
run('e.dimensiones={1:3,12:2}');
assert.deepEqual(json('fichasPracticaProfesional("centro",e).map(r=>r.id)'),json('catalogo.filter(r=>r.tipo==="practica-profesional"&&r.subtipo==="centro"&&aplica(r,e)&&(!r.dimensiones.length||puntaje(r,e))).sort((a,b)=>compararAcceso(a,b,e)).map(r=>r.id)'));
run('guardar();cargar();e=trabajadorActual()');
assert.equal(run('estado.trabajadores.length'),1);
assert.equal(run('e.seleccion["pp-c-pasos"]'),'NOTA_PRIVADA');
c.viejo={app:'prizma',version:1,perfil:{},estudiante:{practica:true},seleccion:{}};assert(!run('validarRespaldo(viejo).estudiantes[0].practicaProfesional'));
assert.equal(run('documentoParaCentro(["pp-c-pasos"],false,e)'),null);assert.equal(run('documentoParaCentro(["pp-c-pasos"],"true",e)'),null);
assert.equal(run('documentoParaCentro(["pp-plan","pp-c-puesto"],true,e)'),null);
run('centroDocumento=documentoParaCentro(["pp-c-pasos"],true,e);armarHoja()');
function texto(n){return typeof n==='string'?n:[n.textContent||'',...(n.hijos||[]).map(texto)].join(' ');}
const pdf=json('definicionPdf()'), salida=JSON.stringify([json('centroDocumento'),pdf])+texto(nodos.get('#hoja'));
for(const prohibido of ['ZZQX','QQZZ','AYUDA_PRIVADA','VOZ_PRIVADA','NOTA_PRIVADA','OTRA_VOZ','OTRA_NOTA',...json('DIMENSIONES.map(d=>d[0])'),'Barreras y facilitadores','Mi nota:'])assert(!salida.includes(prohibido),prohibido);
for(const obligatorio of ['Plan de apoyos para la práctica profesional','Profesor tutor o coordinador','Por qué funciona:','Acuerdos (para completar en la reunión)','Contiene solo lo que la persona decidió compartir.'])assert(salida.includes(obligatorio),obligatorio);
assert.equal(json('centroDocumento.acciones').length,1);assert(pdf.pageMargins.every(n=>n===56.7));assert.equal(pdf.defaultStyle.font,'Roboto');assert(run("definicionPdf().footer(2,3)"));
run('centroDocumento=null');assert.deepEqual(json('elegidasTrabajo(e).map(r=>r.id).sort()'),['pp-c-analisis','pp-c-pasos','pp-e-barrera','pp-plan']);
assert(!JSON.stringify(json('documento({curso:false,estudiantes:["a"]})')).includes('pp-c-pasos'));
const html=leer('index.html'),tarea=leer('docs/tareas/028-practica-profesional.md');
for(const linea of tarea.split('\n').map(s=>s.trim()).filter(s=>/^\d\. (El liceo|El profesor|El representante|Si hacen|La institución)/.test(s)||s.startsWith('- El estudiante decide')||s.startsWith('- El centro proporciona'))){const exacto=linea.replace(/^(?:\d\.|-) /,'');assert(html.includes('<li>'+exacto+'</li>'),exacto);}
assert(html.includes('Orientación basada en la normativa citada. No es asesoría legal.'));
(async()=>{
 run('prepararCentro()');assert(nodos.get('#ver-centro').disabled);assert(campos().length===2);
 nodos.get('#decision-centro').checked=true;run('actualizarDecisionCentro()');assert(!nodos.get('#ver-centro').disabled);
 run('var terminar;prepararPdf=()=>new Promise(r=>terminar=r)');
 let p=run('verDocumentoCentro(e)');nodos.get('#documento-centro').open=false;run('terminar()');await p;assert.equal(run('centroDocumento'),null);
 run('prepararCentro()');assert(!nodos.get('#decision-centro').checked);
 nodos.get('#decision-centro').checked=true;p=run('verDocumentoCentro(e)');nodos.get('#decision-centro').checked=false;run('terminar()');await p;assert.equal(run('centroDocumento'),null);
 nodos.get('#decision-centro').checked=true;p=run('verDocumentoCentro(e)');run('terminar()');await p;assert(run('centroDocumento.centro'));assert(nodos.get('#vista').open);
 c.window={pdfMake:{createPdf(){throw Error('No debe descargar tras cerrar');}}};
 p=run('descargarPdf()');run('centroDocumento=null');nodos.get('#vista').open=false;run('terminar()');await p;
 assert.equal(nodos.get('#vista-estado').textContent,'Preparando el PDF…');
 console.log('Correcto: botón por nivel, migración y respaldos, grupos/pertinencia/orden, texto exacto y selecciones por ámbito; modelo, vista y PDF del centro sin datos personales, decisión obligatoria y cancelación/revocación durante carga.');
})().catch(e=>{console.error(e);process.exitCode=1;});
