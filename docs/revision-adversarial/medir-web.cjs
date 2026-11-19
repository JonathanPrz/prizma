// Instrumentación local. No genera veredictos de accesibilidad.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const raiz=path.resolve(__dirname,'../..');
const servidor=http.createServer((q,r)=>{
 const archivo=path.resolve(raiz,'.'+new URL(q.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
 if(!archivo.startsWith(raiz+path.sep))return r.writeHead(403).end();
 fs.readFile(archivo,(e,c)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',({'.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html'})[path.extname(archivo)]||'application/octet-stream');r.end(c);});
});
(async()=>{
 await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,headless:true,args:['--no-sandbox']});
 const resultados={version:await b.version(),red:[],mediciones:[]};
 try{
 const p=await b.newPage({viewport:{width:390,height:844},locale:'es-CL',reducedMotion:'reduce'});
 await p.route('https://**/*',r=>{resultados.red.push(r.request().url());return r.abort();});
 await p.goto('http://127.0.0.1:'+servidor.address().port);await p.waitForFunction(()=>catalogo.length>0);
 const medir=async nombre=>{resultados.mediciones.push({nombre,datos:await p.evaluate(()=>({foco:document.activeElement.id||document.activeElement.tagName,ancho:innerWidth,scroll:document.documentElement.scrollWidth,controles:[...document.querySelectorAll('button,a,input,select,textarea,summary,abbr')].filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {tag:n.tagName,id:n.id,texto:n.textContent.trim().slice(0,140),aria:n.getAttribute('aria-label'),title:n.title,rol:n.getAttribute('role'),descrito:n.getAttribute('aria-describedby'),labels:n.labels?[...n.labels].map(l=>l.textContent.trim()):null,fg:s.color,bg:s.backgroundColor,borde:s.borderColor,w:r.width,h:r.height,x:r.x,y:r.y,outline:s.outline};})}))});};
 await medir('inicio');await p.click('#elegir-educacion');await p.selectOption('#nivel','basica');await medir('dua-descripcion');
 await p.click('#guardar-clase');await medir('dua-acciones');
 await p.locator('#elegir-dua-1-1').evaluate(n=>{for(let d=n.parentElement;d;d=d.parentElement)if(d.tagName==='DETAILS')d.open=true;});
 await p.locator('#elegir-dua-1-1').click();await medir('dua-elegida');
 await p.click('#tab-apoyos');await p.fill('#iniciales','AB');if(await p.locator('#aviso-privacidad').evaluate(n=>n.open))await p.click('#privacidad-entendido');
 await p.click('#area-0');await p.check('input[name="dimension-2"][value="3"]');await p.click('#guardar-descripcion');await medir('apoyos');
 await p.locator('#apoyos-resultados details').first().locator('summary').click();await medir('apoyos-abiertos');
 await p.locator('#elegir-acc-2-audio').click();await medir('apoyo-elegido');
 await p.click('#abrir-mochila');await medir('mochila');await p.screenshot({path:path.join(__dirname,'mochila-390.png'),fullPage:false});
 await p.click('#cerrar-mochila');await p.click('#ir-acuerdos');await medir('acuerdos');
 await p.click('#documento-estudiante');await medir('incluir-documento');await p.click('#cancelar-documento');
 await p.locator('.cambiar-ambito').click();await p.click('#elegir-trabajo');await p.fill('#trabajo-iniciales','CD');if(await p.locator('#aviso-privacidad').evaluate(n=>n.open))await p.click('#privacidad-entendido');await medir('trabajo-descripcion');
 await p.click('#trabajo-area-3');await p.check('input[name="trabajo-dimension-13"][value="3"]');await p.click('#guardar-descripcion-trabajo');await medir('trabajo-ajustes');
 await p.locator('#trabajo-tarjetas details').evaluateAll(ds=>ds.forEach(d=>d.open=true));
 await medir('trabajo-abiertos');await p.locator('#elegir-tr-subtitulos').click();await medir('trabajo-elegido');
 await p.click('#trabajo-ir-acuerdos');await medir('trabajo-acuerdos');
 await p.click('#abrir-mochila');await medir('mochila-trabajo');await p.click('#cerrar-mochila');
 await p.evaluate(()=>{estado.trabajadores[0].voz='MARCADOR-PRIVADO';estado.trabajadores[0].compartir='Solo ajustes, no mi voz ni mis barreras';guardar();});
 resultados.documentoTrabajo=await p.evaluate(()=>documentoTrabajo([estado.trabajadores[0].id]));
 resultados.almacen=await p.evaluate(()=>localStorage.getItem('prizma.v1'));
 for(const ancho of [320,1280]){await p.setViewportSize({width:ancho,height:844});await medir('trabajo-'+ancho);}
 await p.emulateMedia({colorScheme:'dark'});await p.reload();await p.waitForFunction(()=>catalogo.length>0);await medir('trabajo-oscuro');
 await p.setViewportSize({width:390,height:844});
 resultados.teclado=[];await p.locator('.saltar').focus();
 for(let i=0;i<110;i++){
  await p.keyboard.press('Tab');
  const foco=await p.evaluate(()=>{const n=document.activeElement,r=n.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,encima=document.elementFromPoint(x,y);return {tag:n.tagName,id:n.id,texto:n.textContent.trim().slice(0,90),labels:n.labels?[...n.labels].map(l=>l.textContent.trim()):[],x,y,w:r.width,h:r.height,barra:document.querySelector('#barra-continuar').getBoundingClientRect().toJSON(),encima:encima?.id||encima?.className,cubierto:!!encima&&encima!==n&&!n.contains(encima)};});
  resultados.teclado.push(foco);
  if(foco.cubierto&&foco.id==='documento-trabajo')await p.screenshot({path:path.join(__dirname,'foco-cubierto-390.png')});
 }
 await p.click('#documento-trabajo');await p.locator('#opciones-documento input').check();await p.click('#generar-documento');await p.waitForSelector('#vista[open]');
 resultados.vistaTrabajo=await p.locator('#hoja').innerText();
 resultados.avisoOscuro=await p.locator('#hoja .aviso-apoyos').evaluate(n=>({texto:n.textContent,color:getComputedStyle(n).color,fondo:getComputedStyle(n).backgroundColor}));
 await p.screenshot({path:path.join(__dirname,'documento-390.png')});
 const descarga=p.waitForEvent('download');await p.click('#descargar');await(await descarga).saveAs(path.join(__dirname,'trabajo.pdf'));await p.click('#cerrar');
 await p.click('#abrir-mochila');const respaldo=p.waitForEvent('download');await p.click('#guardar-respaldo');const archivo=await respaldo;await archivo.saveAs(path.join(__dirname,'respaldo-sintetico.json'));await p.click('#cerrar-mochila');
 await p.locator('.cambiar-ambito').click();await p.click('#elegir-educacion');await p.click('#tab-dua');
 await p.evaluate(()=>{estado.estudiantes.push({...estado.estudiantes[0],id:'segundo',iniciales:'EF'});pintarTarjetas();pintarSeleccion();});
 await medir('dua-proyectada');
 await p.locator('#paso-seleccion-toggle').count().then(async n=>{if(n&&await p.locator('#paso-seleccion-toggle').getAttribute('aria-expanded')==='false')await p.click('#paso-seleccion-toggle');});
 const quitar=p.locator('#dua-seleccion .quitar').first();
 if(await quitar.isVisible()){await quitar.focus();await p.keyboard.press('Enter');resultados.focoQuitar=await p.evaluate(()=>({id:document.activeElement.id,tag:document.activeElement.tagName}));}
 resultados.datosProyeccion=await p.evaluate(()=>({repetidas:document.querySelector('#barreras-repetidas').innerText,conteo:avisoDua(catalogo.find(r=>r.id==='dua-1-1'))}));
 resultados.inclusionDesdeCurso=await p.evaluate(()=>{prepararDocumento();return [...document.querySelectorAll('#opciones-documento input')].map(n=>({valor:n.value,marcado:n.checked}));});
 await p.click('#cancelar-documento');
 resultados.falloPersistencia=await p.evaluate(()=>{const anterior=localStorage.getItem('prizma.v1'),set=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Cuota sintética','QuotaExceededError');};estado.perfil.meta='MARCADOR-NO-PERSISTIDO';guardar();Storage.prototype.setItem=set;return {estado:estado.perfil.meta,almacenIgual:localStorage.getItem('prizma.v1')===anterior,alertas:[...document.querySelectorAll('[role="alert"],[role="status"]')].filter(n=>n.checkVisibility()).map(n=>n.textContent)};});
 resultados.objetivosSinFamilia=await p.evaluate(()=>{estado.perfil.nivel='basica';const e=estudianteActual();e.seleccion={'obj-eliminacion':''};e.protocolo=false;e.descripcionGuardada=true;e.acuerdo=normalizarAcuerdo({roles:['docente'],fecha:'2026-11-19',revision:'2026-12-19',criterio:'Participa en la actividad acordada',estado:'completo'});return {estado:estadoCaso(e),errores:erroresAcuerdo(e),roles:e.acuerdo.roles,protocolo:e.protocolo,seleccion:e.seleccion};});
 assert.equal(resultados.objetivosSinFamilia.estado,'Acuerdos completos');
 assert(resultados.mediciones.length>=15);
 fs.writeFileSync(path.join(__dirname,'mediciones-web.json'),JSON.stringify(resultados)+'\n');
 console.log('Mediciones escritas; solicitudes externas: '+resultados.red.length);
 }finally{await b.close();await new Promise(ok=>servidor.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
