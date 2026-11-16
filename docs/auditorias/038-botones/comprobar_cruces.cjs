// Dos efectos que no caben en los recorridos principales. Solo datos ficticios.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
const raiz=path.resolve(__dirname,'../../..');
const salida=process.env.AUDITORIA_SALIDA||__dirname;
fs.mkdirSync(require('node:path').join(salida,'capturas'),{recursive:true});
(async()=>{
 const servidor=http.createServer((q,r)=>{const archivo=path.resolve(raiz,'.'+new URL(q.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!archivo.startsWith(raiz+path.sep))return r.writeHead(403).end();fs.readFile(archivo,(e,c)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.svg':'image/svg+xml'})[path.extname(archivo)]||'application/octet-stream');r.end(c);});});
 await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const p=await b.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:'+servidor.address().port);await p.waitForFunction(()=>catalogo.length===240);await p.click('#elegir-educacion');await p.selectOption('#nivel','basica');
  await p.fill('#meta','Interpretar tablas.');await p.click('#necesidad-tareas-largas');await p.check('#practica');await p.click('#guardar-clase');await p.click('#paso-clase-editar');
  const estadoPrueba=()=>p.evaluate(()=>({perfil:JSON.parse(JSON.stringify(estado.perfil)),necesidades:[...estado.necesidades],borrador:borradorDua?JSON.parse(JSON.stringify(borradorDua)):null,primeras:primerasDua().map(r=>r.id),foco:document.activeElement.id}));
  const limpiar={antes:await estadoPrueba()};await p.click('#limpiar-clase');limpiar.despues=await estadoPrueba();await p.screenshot({path:path.join(salida,'capturas/limpiar-respuestas.png')});assert.equal(limpiar.despues.perfil.practica,true);assert.equal(limpiar.despues.borrador.perfil.practica,false);assert.equal(limpiar.despues.borrador.perfil.meta,'');
  await p.evaluate(()=>{estado=normalizarDatos({ambito:'educacion',perfil:{nivel:'basica'},estudiantes:['uno','dos'].map(id=>({id,iniciales:id==='uno'?'AA':'BB',dimensiones:{1:2,2:2},descripcionGuardada:true,seleccion:{}}))});borradorDua=null;sincronizarPerfil();sincronizarEstudiante();pintarControles();pintarTarjetas();mostrarPestana('dua');});
  const repetida={antes:await estadoPrueba(),texto:await p.locator('#barrera-1').innerText()};await p.click('#barrera-1');repetida.despues=await estadoPrueba();await p.screenshot({path:path.join(salida,'capturas/ver-acciones-para-esto.png')});assert.ok(repetida.despues.necesidades.length);assert.equal(repetida.despues.borrador,null);assert.equal(repetida.despues.foco,'t-dua-empezar');
  await p.evaluate(()=>{estado.seleccion={'dua-6-2':''};pintarTarjetas();pintarSeleccion();});
  await p.click('#documento-clase');await p.click('#generar-documento');await p.waitForSelector('#vista[open]');await p.waitForTimeout(500);
  const focoVista=await p.evaluate(()=>({vistaAbierta:document.querySelector('#vista').open,tag:document.activeElement.tagName,id:document.activeElement.id}));
  fs.writeFileSync(path.join(salida,'cruces.json'),JSON.stringify({limpiar,repetida,focoVista},null,2)+'\n');console.log('Limpiar desmarca taller en borrador; Ver acciones para esto guarda y enfoca Para empezar.');
 }finally{await b.close();await new Promise(ok=>servidor.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
