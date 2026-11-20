const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const leer=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),html=leer('index.html'),nodos=new Map(),almacen=new Map();
const opciones=[...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m=>({value:m[1]}));
const controles=nombre=>[...html.matchAll(new RegExp('name="'+nombre+'" value="([^"]+)"','g'))].map(m=>({value:m[1]}));
let c;
function nodo(tag='div'){return {tag,id:'',hijos:[],eventos:{},options:opciones,value:'',isConnected:true,open:false,replaceChildren(...h){this.hijos=h;},append(...h){this.hijos.push(...h);},setAttribute(k,v){this[k]=String(v);if(k==='id')nodos.set('#'+v,this);},addEventListener(t,f){this.eventos[t]=f;},focus(){c.document.activeElement=this;},scrollIntoView(){}};}
const n=s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);};
const todos=x=>(x?.hijos||[]).filter(h=>typeof h==='object').flatMap(h=>[h,...todos(h)]);
c=vm.createContext({document:{activeElement:{id:''},createElement:nodo,getElementById:id=>nodos.get('#'+id),querySelector:s=>s==='.logo'?{outerHTML:html.match(/<svg class="logo".*?<\/svg>/)[0]}:n(s),querySelectorAll:s=>{
 if(s==='#lista-estudiantes button')return n('#lista-estudiantes').hijos;
 if(s==='input[name="rol-acuerdo"]:checked')return todos(n('#roles-acuerdo')).filter(x=>x.tag==='input'&&x.checked);
 const name=s.match(/name="([^"]+)"/)?.[1];return name?controles(name):[];
}},localStorage:{getItem:k=>almacen.get(k),setItem:(k,v)=>almacen.set(k,v)},window:{matchMedia:()=>({matches:true})},requestAnimationFrame:fn=>fn()});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(JSON.stringify(run(s)));
run(`catalogo=${leer('data/recomendaciones.json')};fuentes=Object.fromEntries(${leer('data/fuentes.json')}.map(f=>[f.id,f]));necesidades=${leer('data/necesidades.json')};estado.perfil.nivel='basica'`);
const ids=x=>todos(x).filter(x=>x.id?.startsWith("elegir-")).map(x=>x.id.slice(7));
for (const id of ['sup-vision','tr-lector-braille','tr-formularios-voz']) {c.idConsulta=id;assert(!run('textoModalidad(catalogo.find(r=>r.id===idConsulta).titulo,catalogo.find(r=>r.id===idConsulta),{modalidad:"ampliacion"})').includes('Braille'));}
// Normalización, migración aditiva y fronteras de entradas externas.
for(const valor of [null,{},[],true,1,'__proto__','constructor']){c.valor=valor;assert.equal(run('normalizarEstudiante({modalidad:valor}).modalidad'),'');}
assert.equal(run('normalizarEstudiante({modalidad:"ampliacion",protocolo:"true"}).paci'),false);
assert.equal(run('normalizarAcuerdo({roles:["estudiante"],fecha:"2026-11-16",revision:"2026-12-01",estado:"completo"}).estado'),'por-revisar');
assert.equal(run('normalizarAcuerdo({criterio:"x".repeat(201)}).criterio.length'),200);
run('estado=normalizarDatos({ambito:"educacion",perfil:{nivel:"basica"},estudiantes:[{id:"uno",iniciales:"AA",dimensiones:{6:3},modalidad:"ampliacion",paci:true,seleccion:{"acc-6-braille":"NOTA ANTIGUA"},acuerdo:{roles:["estudiante"],fecha:"2026-11-16",revision:"2026-12-01",criterio:"Reconoce cuatro señales.",estado:"completo"}},{id:"dos",dimensiones:{13:3},modalidad:"senas",seleccion:{}}]});');
assert(!run('accesosVisibles().some(r=>r.id==="acc-6-braille")'));assert.equal(run('estudianteActual().seleccion["acc-6-braille"]'),'NOTA ANTIGUA');assert(run('erroresAcuerdo(estudianteActual()).some(x=>x.includes("modalidad"))'));
run('pintarApoyos();pintarSeleccion()');assert(n('#modalidad-revisar').textContent.includes('mochila'));
assert(run('documento({curso:false,estudiantes:["uno"]}).grupos[0].acciones[0].revisionModalidad'));
run('estado.perfil.nivel="superior";estudianteActual().seleccion["sup-vision"]=""');assert(!run('seleccionIncompatible(estudianteActual())'),'Un ID que ya no aplica al nivel no bloquea la modalidad');assert.equal(run('estudianteActual().seleccion["acc-6-braille"]'),'NOTA ANTIGUA');run('estado.perfil.nivel="basica"');
run('estado.estudianteActivo="dos"');assert(run('pasosApoyo(catalogo.find(r=>r.id==="acc-6-audicion"),estudianteActual())[0].includes("intérprete")'));
run('estado.perfil.nivel="superior"');assert(run('pasosApoyo(catalogo.find(r=>r.id==="sup-audicion"),estudianteActual())[0].includes("intérprete")'));
run('estado.perfil.nivel="media";estado.perfil.practica=true;pintarApoyos()');assert.equal(n('#estudiante-seguridad').hidden,false);assert(run('practicasVisibles().some(r=>r.id==="prac-evacuacion")'));
run('estado.estudiantes[1].dimensiones={8:3};pintarApoyos()');assert(run('practicasVisibles().some(r=>r.id==="prac-rotulos")'));
run('estado.estudianteActivo="uno";estado.estudiantes[0].seleccion={"acc-6-ampliar":""};estado.perfil.nivel="basica";inclusionDocumento={curso:false,estudiantes:["uno"]}');
assert.equal(run('documento().grupos[0].paci'),true);assert(JSON.stringify(json('definicionPdf()')).includes('Reconoce cuatro señales.'));
run('estudianteActual().acuerdo.criterio=" ";guardarAcuerdos()');assert(n('#acuerdo-criterio-error').textContent.includes('cómo sabremos'));
run('estudianteActual().acuerdo.criterio="Reconoce cuatro señales.";guardarAcuerdos()');assert.equal(run('estadoCaso(estudianteActual())'),'Acuerdos completos');
run('guardar();cargar()');assert.equal(run('estudianteActual().modalidad'),'ampliacion');assert.equal(run('estudianteActual().paci'),true);assert.equal(run('estudianteActual().acuerdo.criterio'),'Reconoce cuatro señales.');
run('estado.trabajadores=[{id:"laboral",...normalizarTrabajador({dimensiones:{8:3},modalidad:"ampliacion",compartir:"Solo los ajustes con la jefatura",seleccion:{"tr-alertas-visuales":""},acuerdo:{roles:["persona"],fecha:"2026-11-16",revision:"2026-12-01",criterio:"Identifica las alertas.",estado:"completo"}})}];estado.trabajadorActivo="laboral";inclusionTrabajo=["laboral"];');
assert(run('ajustesTrabajo().some(r=>r.id==="tr-alertas-visuales")'));assert(!JSON.stringify(json('definicionPdf()')).includes('Solo los ajustes con la jefatura'));assert(JSON.stringify(json('definicionPdf()')).includes('Identifica las alertas.'));
c.respaldo={app:'prizma',version:2,...json('estado')};assert.deepEqual(json('validarRespaldo(respaldo).trabajadores'),json('estado.trabajadores'));
assert.equal(run('normalizarTrabajador({compartir:"x".repeat(301)}).compartir.length'),300);
run('inclusionTrabajo=null;estado.perfil.nivel="superior";centroDocumento=documentoParaCentro(["pp-c-pasos"],true,normalizarTrabajador({etapa:"practica",nivelOrigen:"superior",seleccion:{"pp-c-pasos":"NOTA RESERVADA"}}))');
assert(!JSON.stringify(json('definicionPdf()')).includes('Reconoce cuatro señales.'));assert(!JSON.stringify(json('definicionPdf()')).includes('NOTA RESERVADA'));assert(JSON.stringify(json('definicionPdf()')).includes('¿Cómo sabremos que funciona?'));
// Referencia actualizada: no se reescribe el patrón de oro ni el archivo de casos.
const semillas=JSON.parse(leer('docs/casos/casos-semilla.json'));let encontrados=0,esperados=0;const referencia=[];
for(const semilla of semillas){c.semilla=semilla;run(`estado=normalizarDatos({ambito:semilla.ambito,perfil:{nivel:semilla.nivel,practica:semilla.practica},necesidades:semilla.necesidades,estudiantes:semilla.ambito==='educacion'?[{id:'a',...semilla,descripcionGuardada:true,seleccion:{}}]:[],trabajadores:semilla.ambito==='trabajo'?[{id:'b',...semilla,seleccion:{}}]:[]});`);
 let ofrecidos=[];if(semilla.ambito==='trabajo'){run('pintarTrabajo()');ofrecidos=ids(n('#trabajo-tarjetas'));}else if(Object.keys(semilla.dimensiones).length){run('pintarApoyos()');ofrecidos=[...ids(n('#apoyos-resultados')),...(n('#objetivos').hidden?[]:ids(n('#objetivos-tarjetas'))),...(n('#desregulacion').hidden?[]:ids(n('#desregulacion-resultados'))),...ids(n('#apoyos-adicionales'))];}
 if(semilla.practicaProfesional){
   run('estado.ambito="trabajo";pintarTrabajo()');
   const practica=ids(n('#practica-profesional-grupos'));
   assert(practica.length && practica.every(id=>id.startsWith('pp-')));
   assert(ofrecidos.every(id=>!id.startsWith('pp-')));
   ofrecidos.push(...practica);
 }
 referencia.push({id:semilla.id,ofrecidos,encontrados:semilla.incluir.filter(id=>ofrecidos.includes(id)),ausentes:semilla.incluir.filter(id=>!ofrecidos.includes(id)),excluidosPresentes:semilla.excluir.filter(id=>ofrecidos.includes(id))});
 for(const x of semilla.condicionales||[])assert(JSON.parse(leer('data/recomendaciones.json')).some(r=>r.id===x.id)&&x.condicion,'Condicional sin ficha o sin condición: '+x.id);const ausentes=semilla.incluir.filter(id=>!ofrecidos.includes(id));assert.deepEqual(ausentes,[], 'Apoyos esperados que no aparecen: S'+semilla.id);for(const id of semilla.incluir){if(ofrecidos.includes(id))encontrados++;esperados++;}assert(semilla.excluir.every(id=>!ofrecidos.includes(id)));
}
const carpetaReferencia=path.resolve(__dirname,'../docs/auditorias/040-preguntas-clave');fs.mkdirSync(carpetaReferencia,{recursive:true});fs.writeFileSync(path.join(carpetaReferencia,'semillas.json'),JSON.stringify(referencia,null,2)+'\n');
console.log(`Correcto: ${encontrados}/${esperados} esperados, exclusiones, modalidades, seguridad, acuerdos y respaldo; PDF comparte contexto.`);

async function navegador(){
 let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
 const http=require('node:http'),raiz=path.resolve(__dirname,'..'),salida=path.join(raiz,'docs/marca/040-preguntas');fs.mkdirSync(salida,{recursive:true});
 const servidor=http.createServer((q,r)=>{const archivo=path.resolve(raiz,'.'+new URL(q.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!archivo.startsWith(raiz+path.sep))return r.writeHead(403).end();fs.readFile(archivo,(e,c)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.svg':'image/svg+xml'})[path.extname(archivo)]||'application/octet-stream');r.end(c);});});
 await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));let b;const resultados=[];
 try{
  b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,headless:true,args:['--no-sandbox']});
  for(const ancho of [1280,390])for(const tema of ['light','dark']){
   const p=await b.newPage({viewport:{width:ancho,height:900},colorScheme:tema,locale:"es-CL",timezoneId:"America/Santiago",reducedMotion:'reduce'}),errores=[];p.on('pageerror',e=>errores.push(e.message));p.on('dialog',d=>d.accept());
   async function privacidad(){if(await p.locator('#aviso-privacidad').evaluate(n=>n.open))await p.click('#privacidad-entendido');}
   async function elegir(id){const grupos=await p.locator('#elegir-'+id).evaluate(n=>{const ds=[];for(let d=n.parentElement;d;d=d.parentElement)if(d.tagName==='DETAILS'&&!d.open)ds.unshift(d.id?'#'+d.id+' > summary':'details[data-grupo='+JSON.stringify(d.dataset.grupo)+'] > summary');return ds;});for(const g of grupos)await p.click(g);await p.click('#elegir-'+id);}
   async function foto(tipo){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:path.join(salida,`${tipo}-${ancho}-${tema}.png`)});}
   async function pdf(tipo){await p.waitForSelector('#vista[open]');const modelo=await p.evaluate(()=>modeloDocumento());assert(JSON.stringify(modelo).includes(tipo==='estudiante'?'Reconoce cuatro de cinco señales.':'Identifica las alertas del puesto.'));if(tipo==='estudiante'){assert.equal(modelo.grupos.filter(g=>g.estudiante)[0].paci,true);}else{assert(!JSON.stringify(modelo).includes('Solo los ajustes con la jefatura.'));assert(!modelo.grupos.some(g=>g.estudiante));}
    const descarga=p.waitForEvent('download');await p.click('#descargar');const archivo=path.join(salida,`${tipo}-${ancho}-${tema}.pdf`);await(await descarga).saveAs(archivo);assert.equal(fs.readFileSync(archivo).subarray(0,4).toString(),'%PDF');await p.click('#cerrar');
   }
   await p.goto('http://127.0.0.1:'+servidor.address().port);await p.waitForFunction(()=>catalogo.length>0);await p.selectOption('#nivel','basica');await p.click('#tab-apoyos');await p.fill('#iniciales','AA');await privacidad();
   await p.locator('#modalidad').focus();for(let i=0;i<3;i++)await p.keyboard.press('ArrowDown');assert.equal(await p.locator('#modalidad').inputValue(),'ampliacion');await p.click('#area-3');await p.check('input[name="dimension-6"][value="3"]');await p.click('#guardar-descripcion');assert.equal(await p.locator('#elegir-acc-6-braille').count(),0);await elegir('acc-6-ampliar');
   await p.click('#desregulacion > summary');await p.check('#paci-dec');assert(await p.locator('#paci-objetivos').isChecked());await p.click('#ir-acuerdos');await p.check('input[name="rol-acuerdo"][value="estudiante"]');await p.fill('#fecha-acuerdo','2026-11-16');await p.fill('#revision-acuerdo','2026-12-01');await p.click('#guardar-acuerdos');assert((await p.locator('#acuerdo-criterio-error').innerText()).includes('cómo sabremos'));
   await p.fill('#criterio-acuerdo','x'.repeat(201));assert.equal((await p.locator('#criterio-acuerdo').inputValue()).length,200);await p.fill('#criterio-acuerdo','Reconoce cuatro de cinco señales.');await p.click('#guardar-acuerdos');assert.equal(await p.evaluate(()=>estadoCaso(estudianteActual())),'Acuerdos completos');await p.click('#documento-estudiante');await p.click('#generar-documento');await pdf('estudiante');
   await p.click('#paso-descripcion-editar');await p.selectOption('#modalidad','senas');await p.check('input[name="dimension-13"][value="3"]');await p.selectOption('#nivel','media');await p.click('#tab-dua');if(!await p.locator('#practica').isVisible())await p.click('#paso-clase-editar');await p.check('#practica');await p.click('#guardar-clase');await p.click('#tab-apoyos');
   assert(await p.locator('#estudiante-seguridad').isVisible());await p.getByRole('button',{name:'Revisar: Planifica la evacuación con el estudiante',exact:true}).click();assert.equal(await p.evaluate(()=>document.activeElement.id),'elegir-prac-evacuacion');assert(await p.locator('#elegir-prac-evacuacion').isVisible());
   const auditiva=p.locator('.tarjeta').filter({has:p.locator('#elegir-acc-6-audicion')});assert((await auditiva.textContent()).includes('Coordina un intérprete de lengua de señas'));await p.locator('#estudiante-seguridad').evaluate(n=>n.scrollIntoView({block:'center'}));await foto('seguridad');
   await p.selectOption('#nivel','practica-trabajo');await p.fill('#trabajo-iniciales','AB');await privacidad();await p.selectOption('#trabajo-modalidad','ampliacion');await p.click('#trabajo-area-3');await p.check('input[name="trabajo-dimension-8"][value="3"]');await p.click('#guardar-descripcion-trabajo');assert(await p.locator('#trabajo-seguridad').isVisible());await p.getByRole('button',{name:'Revisar: Instala alertas visuales o vibratorias de seguridad',exact:true}).click();await p.click('#elegir-tr-alertas-visuales');
   await p.click('#trabajo-ir-acuerdos');await p.check('input[name="rol-trabajo"][value="persona"]');await p.fill('#trabajo-fecha','2026-11-16');await p.fill('#trabajo-revision','2026-12-01');await p.fill('#trabajo-criterio','Identifica las alertas del puesto.');await p.fill('#trabajo-compartir','Solo los ajustes con la jefatura.');await p.click('#guardar-acuerdos-trabajo');assert.equal(await p.evaluate(()=>estadoCaso(trabajadorActual(),true)),'Acuerdos completos');
   await p.click('#documento-trabajo');await p.locator('#opciones-documento input[name="incluir"]').check();await p.click('#generar-documento');await pdf('trabajo');await p.reload();await p.waitForFunction(()=>catalogo.length>0);assert.equal(await p.locator('#trabajo-compartir').inputValue(),'Solo los ajustes con la jefatura.');assert.equal(await p.evaluate(()=>estudianteActual().acuerdo.criterio),'Reconoce cuatro de cinco señales.');await p.click('#trabajo-acuerdo-editar');await p.locator('#trabajo-compartir').evaluate(n=>n.scrollIntoView({block:'center'}));await foto('compartir');
   assert.deepEqual(errores,[]);resultados.push({ancho,tema,modalidad:true,seguridad:true,criterioObligatorio:true,protocoloSincronizado:true,pdf:['estudiante','trabajo'],persistencia:true,sinDesborde:true,errores});await p.close();
  }
  const dir=path.join(raiz,'docs/auditorias/040-preguntas-clave');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'navegador.json'),JSON.stringify(resultados,null,2)+'\n');console.log('Correcto: preguntas clave en navegador, teclado de controles nativos, documentos, persistencia y separación de ámbitos; 1280/390 claro/oscuro.');
 }finally{await b?.close();await new Promise(ok=>servidor.close(ok));}
}
navegador().catch(e=>{console.error(e);process.exitCode=1;});
