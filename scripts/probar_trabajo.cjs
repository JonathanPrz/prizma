const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const leer=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),html=leer('index.html'),tarea=leer('docs/tareas/032-pestana-trabajo.md'),nodos=new Map(),almacen=new Map();
const opciones=[...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m=>({value:m[1]}));
const controles=nombre=>[...html.matchAll(new RegExp('name="'+nombre+'" value="([^"]+)"','g'))].map(m=>({value:m[1]}));
let c;
const todos=x=>(x?.hijos||[]).filter(h=>typeof h==='object').flatMap(h=>[h,...todos(h)]);
function nodo(tag='div'){return {tag,id:'',hijos:[],parentElement:{},get children(){return this.hijos.filter(h=>typeof h==='object');},eventos:{},options:opciones,value:'',isConnected:true,open:false,replaceChildren(...h){this.hijos=h;for(const hijo of h)if(hijo&&typeof hijo==='object')hijo.parentElement=this;},append(...h){this.hijos.push(...h);for(const hijo of h)if(hijo&&typeof hijo==='object')hijo.parentElement=this;},setAttribute(k,v){this[k]=String(v);if(k==='id')nodos.set('#'+v,this);},getAttribute(k){return this[k];},addEventListener(t,f){this.eventos[t]=f;},focus(){c.document.activeElement=this;},scrollIntoView(){},closest(){return null;},showModal(){this.open=true;},close(){this.open=false;},querySelector(s){return todos(this).find(x=>s.includes('name="'+x.name+'"')&&s.includes('value="'+x.value+'"'));}};}
const n=s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);};
c=vm.createContext({getComputedStyle:()=>({getPropertyValue:()=> '#21633b'}),document:{activeElement:{id:''},createElement:nodo,getElementById:id=>nodos.get('#'+id),querySelector:s=>s==='.logo'?{outerHTML:html.match(/<svg class="logo".*?<\/svg>/)[0]}:n(s),querySelectorAll:s=>{
 if(s==='#lista-trabajadores button')return n('#lista-trabajadores').hijos;
 if(s==='#lista-estudiantes button')return n('#lista-estudiantes').hijos;
 if(s==='input[name="rol-trabajo"]:checked')return todos(n('#trabajo-roles')).filter(x=>x.tag==='input'&&x.checked);
 return controles(s.match(/name="([^"]+)"/)?.[1]);
}},localStorage:{getItem:k=>almacen.get(k),setItem:(k,v)=>almacen.set(k,v)},window:{matchMedia:()=>({matches:true}),confirm:()=>true},requestAnimationFrame:fn=>fn()});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(JSON.stringify(run(s)));
run(`catalogo=${leer('data/recomendaciones.json')};fuentes=Object.fromEntries(${leer('data/fuentes.json')}.map(f=>[f.id,f]));necesidades=${leer('data/necesidades.json')};estado.perfil.nivel='basica'`);
// Exact source text, not a second hand-written copy of the specification.
const guia=html.split('<dialog id="guia-trabajo"')[1].split('</dialog>')[0];
const lis=[...guia.matchAll(/<li>(.*?)<\/li>/g)].map(m=>m[1]);
const esperados=[...tarea.split('**Todas las empresas e instituciones**')[1].split('4. **Mi mochila:**')[0].matchAll(/^   [1-7]\. (.+)$/gm)].map(m=>m[1]);
assert.equal(esperados.length,7);assert.deepEqual(lis.slice(0,6),esperados.slice(0,6));assert(lis[6].includes("Los plazos dependen del caso"));assert(lis[6].includes("https://www.dt.gob.cl/portal/1628/w3-article-103247.html"));
const ejemplos=[...tarea.split('constante `EJEMPLOS_TRABAJO`')[1].split('     - «¿Qué le ayuda?»')[0].matchAll(/^       \d+\. (.+)$/gm)].map(m=>m[1]);assert.equal(ejemplos.length,14);assert.deepEqual(json('EJEMPLOS_TRABAJO'),ejemplos);
assert(guia.includes('Orientación basada en la normativa citada, vigente al 16 de noviembre de 2026. No es asesoría legal.'));
assert.equal(run('normalizarDatos({}).trabajadores.length'),0);
assert.equal(run('normalizarTrabajador({iniciales:"AB2",tipoPuesto:"x".repeat(70)}).tipoPuesto.length'),60);
assert.equal(run('normalizarTrabajador({diagnostico:"NO",voz:"Elección"}).diagnostico'),undefined);
assert.deepEqual(json('normalizarTrabajador({seleccion:{"dua-6-2":"NO","acc-1-agenda":"NO","tr-subtitulos":"Sí"},acuerdo:{roles:["familia","persona"]}}).seleccion'),{'tr-subtitulos':'Sí'});
assert.deepEqual(json('normalizarTrabajador({acuerdo:{roles:["familia","persona"]}}).acuerdo.roles'),['persona']);
assert.deepEqual(json('normalizarEstudiante({acuerdo:{roles:["persona"]}}).acuerdo.roles'),[]);
assert.equal(run('normalizarTrabajadores(Array.from({length:11},()=>({id:"repetido",seleccion:{}}))).length'),10);
assert.equal(run('new Set(normalizarTrabajadores([{id:"repetido"},{id:"repetido"},{id:"<invalido>"}]).map(e=>e.id)).size'),3);
assert.deepEqual(json('seleccionValidada({"tr-subtitulos":"NO","acc-1-agenda":"Sí"},false)'),{'acc-1-agenda':'Sí'});
const alumnos=json('estado.estudiantes');run('mostrarPestana("trabajo");prepararTrabajo()');assert(n('#nivel-campo').hidden);assert(n('#practica-campo').hidden);assert.deepEqual(json('estado.estudiantes'),alumnos);
run('guardarDescripcionTrabajo()');assert(n('#trabajo-descripcion-error').textContent.includes('al menos una situación'));run('agregarTrabajador()');assert.equal(run('estado.trabajadores.length'),1);
run('Object.assign(trabajadorActual(),normalizarTrabajador({iniciales:"AB2",tipoPuesto:"Bodega",dimensiones:{13:3},ayuda:"Avisos escritos",voz:"VOZ_TRABAJO"}));sincronizarTrabajo();guardarDescripcionTrabajo()');
assert.equal(n('#trabajo-descripcion-cuerpo').hidden,true);
assert.deepEqual(json('ajustesTrabajo().slice(0,4).map(r=>r.id)'),['tr-subtitulos','tr-interprete','tr-mensajes-escritos','tr-alertas-visuales']);
const ids=todos(n('#trabajo-tarjetas')).filter(x=>x.id?.startsWith('elegir-')).map(x=>x.id.slice(7));assert.equal(new Set(ids).size,ids.length);assert.equal(ids.filter(id=>run(`catalogo.find(r=>r.id==="${id}").subtipo==="proceso"`)).length,8);
run('guardarAcuerdosTrabajo()');assert(n('#trabajo-acuerdos-error').textContent.includes('ajuste'));
run('alternar("tr-subtitulos");guardarAcuerdosTrabajo()');assert(n('#trabajo-acuerdos-error').textContent.includes('rol'));
run('trabajadorActual().acuerdo={roles:["persona"],fecha:"2026-11-16",revision:"2026-11-16",estado:"sin-acuerdos"};guardarAcuerdosTrabajo()');assert(n('#trabajo-acuerdos-error').textContent.includes('posterior'));
run('trabajadorActual().acuerdo.revision="2026-12-01";trabajadorActual().acuerdo.criterio="Inicia cuatro de cinco tareas.";guardarAcuerdosTrabajo()');assert.equal(run('estadoCaso(trabajadorActual(),true)'),'Acuerdos completos');assert.equal(n('#trabajo-acuerdo-cuerpo').hidden,true);
run('alternar("tr-pedir")');assert.equal(run('estadoCaso(trabajadorActual(),true)'),'Por revisar');assert(n('#agregar-trabajador').disabled);run('guardarAcuerdosTrabajo();agregarTrabajador()');assert.equal(run('estado.trabajadores.length'),2);assert.equal(c.document.activeElement,n('#trabajo-iniciales'));
run('Object.assign(trabajadorActual(),normalizarTrabajador({iniciales:"AB2",dimensiones:{1:2}}));pintarEstadoTrabajo()');assert(n('#trabajo-duplicadas').textContent.includes('Ya hay una persona'));
// No school data can enter the worker model, even with the same local case id.
run('Object.assign(estudianteActual(),normalizarEstudiante({iniciales:"JP",dimensiones:{6:2},voz:"VOZ_ESCOLAR"}));estudianteActual().seleccion={"acc-1-agenda":"NOTA_ESCOLAR"};estado.seleccion={"dua-6-2":"NOTA_CURSO"};trabajadorActual().seleccion={"tr-etapas":"NOTA_TRABAJO"};inclusionTrabajo=estado.trabajadores.map(e=>e.id)');
const trabajo=json('documentoTrabajo()'),escuela=json('documento({curso:true,estudiantes:estado.estudiantes.map(e=>e.id)})');
assert(!JSON.stringify(trabajo).includes('VOZ_ESCOLAR'));assert(!JSON.stringify(trabajo).includes('NOTA_CURSO'));assert(!JSON.stringify(escuela).includes('VOZ_TRABAJO'));assert(!JSON.stringify(escuela).includes('NOTA_TRABAJO'));assert(!JSON.stringify(escuela).includes('tr-subtitulos'));
const pdf=json('definicionPdf()');assert.equal(pdf.info.title,'Plan de ajustes en el trabajo');assert(!JSON.stringify(pdf).includes('VOZ_ESCOLAR'));assert(JSON.stringify(pdf).includes('Persona trabajadora'));assert.equal(run('definicionPdf().footer(2,4).columns[0].text'),run('PIE_TRABAJO'));
run('inclusionTrabajo=null');assert(!JSON.stringify(json('definicionPdf()')).includes('VOZ_TRABAJO'));
run('guardar();cargar()');c.entrada={app:'prizma',version:2,...json('estado')};const vuelta=json('validarRespaldo(entrada)');assert.equal(vuelta.descartadas,0);assert.deepEqual(vuelta.trabajadores,json('estado.trabajadores'));assert.deepEqual(vuelta.estudiantes,json('estado.estudiantes'));
c.mal={...c.entrada,trabajadores:Array(11).fill(c.entrada.trabajadores[0])};assert.throws(()=>run('validarRespaldo(mal)'));
// A note or removal from an inactive worker must never edit the active worker or a student.
run('var primero=estado.trabajadores[0].id;var activo=estado.trabajadorActivo;alternar("tr-subtitulos",undefined,primero)');
assert.equal(run('estado.trabajadorActivo'),run('activo'));assert(!run('Object.hasOwn(estado.trabajadores[0].seleccion,"tr-subtitulos")'));assert(run('Object.hasOwn(trabajadorActual().seleccion,"tr-etapas")'));
run('prepararDocumentoTrabajo()');assert(todos(n('#opciones-documento')).filter(x=>x.tag==='input'&&x.name==='incluir').every(x=>x.checked===false));assert(!todos(n('#opciones-documento')).some(x=>String(x.value).startsWith('alumno:')));
run('estado.trabajadores=[estado.trabajadores[0]];estado.trabajadores[0].seleccion={};pintarTrabajo()');assert.equal(todos(n('#trabajo-tarjetas')).filter(x=>x.id?.startsWith('elegir-tr-')&&run(`catalogo.find(r=>r.id==="${x.id.slice(7)}").subtipo==="proceso"`)).length,8);
console.log('Correcto: guía y 14 ejemplos exactos, tres pestañas, casos y selecciones separados, prioridad de Audición/proceso, acuerdos/revisión/bloqueo, respaldo anterior y actual, límites/roles, privacidad de ambos modelos PDF y elección de personas sin marcar.');
