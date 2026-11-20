// Regresión 039: plegar nunca borra; taller es borrador; imprimir comparte definición.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
const raiz=path.resolve(__dirname,'..'),salida=path.join(raiz,'docs/marca/039-correcciones');fs.mkdirSync(salida,{recursive:true});
(async()=>{
 const servidor=http.createServer((q,r)=>{const archivo=path.resolve(raiz,'.'+new URL(q.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!archivo.startsWith(raiz+path.sep))return r.writeHead(403).end();fs.readFile(archivo,(e,c)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.svg':'image/svg+xml'})[path.extname(archivo)]||'application/octet-stream');r.end(c);});});
 await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,args:['--no-sandbox']});const resultados=[];
 try{
  for(const ancho of [1280,390])for(const tema of ['light','dark']){
   const p=await b.newPage({viewport:{width:ancho,height:900},colorScheme:tema,reducedMotion:'reduce'}),errores=[];p.on('pageerror',e=>errores.push(e.message));
   await p.goto('http://127.0.0.1:'+servidor.address().port);await p.waitForFunction(()=>catalogo.length>0);await p.selectOption('#nivel','basica');await p.click('#tab-apoyos');
   async function sinDesborde(){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sin desplazamiento horizontal');}
   async function foto(nombre){await sinDesborde();await p.screenshot({path:path.join(salida,`${nombre}-${ancho}-${tema}.png`)});}
   async function area(prefijo,modelo){
    const id='#'+prefijo+'area-0',name=prefijo+'dimension-';await p.click(id);await p.check(`input[name="${name}1"][value="3"]`);await p.check(`input[name="${name}2"][value="2"]`);
    const antes=await p.evaluate(modelo=>JSON.stringify((modelo==='trabajo'?trabajadorActual():estudianteActual())),modelo);
    assert.match(await p.locator(id).innerText(),/2 marcadas/);await p.locator(id).focus();await p.keyboard.press('Space');assert.equal(await p.locator(id).getAttribute('aria-expanded'),'false');
    await p.keyboard.press('Enter');assert.equal(await p.locator(id).getAttribute('aria-expanded'),'true');
    assert.equal(await p.evaluate(modelo=>JSON.stringify((modelo==='trabajo'?trabajadorActual():estudianteActual())),modelo),antes,'Cerrar/abrir conserva caso y acuerdos');
    assert(await p.locator(`input[name="${name}1"][value="3"]`).isChecked());
    await p.check(`input[name="${name}1"][value="0"]`);assert.match(await p.locator(id).innerText(),/1 marcada/);
    assert.equal(await p.evaluate(modelo=>(modelo==='trabajo'?trabajadorActual():estudianteActual()).dimensiones[1],modelo),undefined);
    await p.check(`input[name="${name}1"][value="3"]`);
   }
   await area('','estudiante');assert.equal(await p.locator('#t-para-empezar').textContent(),'Para empezar');assert.equal(await p.locator('#t-para-empezar + p').textContent(),'Los apoyos que mejor responden a lo que describiste.');await p.locator('#area-0').evaluate(n=>n.scrollIntoView({block:'center'}));await foto('estudiante');await p.reload();await p.waitForFunction(()=>catalogo.length>0);assert.equal(await p.locator('#area-0').getAttribute('aria-expanded'),'true');assert.match(await p.locator('#area-0').innerText(),/2 marcadas/);
   await p.click('#tab-dua');await p.check('#practica');assert.equal(await p.evaluate(()=>estado.perfil.practica),false);assert.equal(await p.evaluate(()=>borradorDua.perfil.practica),true);await p.click('#guardar-clase');assert.equal(await p.evaluate(()=>estado.perfil.practica),true);
   await p.click('#paso-clase-editar');await p.click('#limpiar-clase');assert(!await p.locator('#practica').isChecked());assert.equal(await p.evaluate(()=>estado.perfil.practica),true);await p.click('#guardar-clase');assert.equal(await p.evaluate(()=>estado.perfil.practica),false);
   await p.evaluate(()=>{estado.estudiantes.push({id:'otro',...normalizarEstudiante({iniciales:'BB',dimensiones:{1:2,2:2}}),seleccion:{}});pintarRepeticiones();});
   await p.click('#m-despues');await p.click('#proposito-presentar');
   await p.click('#barrera-1');assert(await p.evaluate(()=>estado.necesidades.includes('tareas-largas')));assert.equal(await p.evaluate(()=>borradorDua),null);assert.equal(await p.evaluate(()=>document.activeElement.id),'t-dua-marcadas');
   assert.equal(await p.locator('#t-dua-marcadas').innerText(),'Para lo que marcaste');
   assert.deepEqual(await p.evaluate(()=>[estado.momentos,estado.propositos]),[['despues'],['presentar']]);
   await p.getByRole('button',{name:'Quitar filtros'}).click();
   assert.equal(await p.locator('.cabecera-intro').filter({hasText:'Algo que haces para todo el curso.'}).count(),1);
   await p.locator('#tarjetas section button[id^="elegir-"]').first().click();assert.equal(await p.locator('#continuar').innerText(),'Ir a tu selección (1 elegidas)');if(await p.locator('#continuar').isVisible())await p.click('#continuar');else await p.click('#indicador-pasos a[href="#seleccion-dua"]');assert.equal(await p.locator('#continuar').innerText(),'Ver documento');await foto('dua');
   await p.click('#documento-clase');await p.click('#generar-documento');await p.waitForSelector('#vista[open]');
   await p.evaluate(()=>{window.__crearPdfOriginal=pdfMake.createPdf;window.__definiciones=[];pdfMake.createPdf=def=>({print(){window.__definiciones.push(['print',JSON.stringify(def)]);},download(){window.__definiciones.push(['download',JSON.stringify(def)]);}});window.print=()=>{throw Error('No imprimir HTML');};});
   for(const tipo of ['curso','centro','trabajo']){
    await p.evaluate(tipo=>{
     inclusionTrabajo=null;centroDocumento=null;
     if(tipo==='centro'){estado.perfil.nivel='superior';estudianteActual().practicaProfesional=true;estudianteActual().seleccion={'pp-c-pasos':''};centroDocumento=documentoParaCentro(['pp-c-pasos'],true);}
     if(tipo==='trabajo'){estado.trabajadores=[{id:'laboral',...normalizarTrabajador({dimensiones:{1:2},seleccion:{'tr-etapas':''}}),seleccion:{'tr-etapas':''}}];estado.trabajadorActivo='laboral';inclusionTrabajo=['laboral'];}
     window.__definiciones=[];
    },tipo);
    await p.click('#imprimir');await p.click('#descargar');await p.waitForFunction(()=>window.__definiciones.length===2);
    const defs=await p.evaluate(()=>window.__definiciones);assert.equal(defs[0][0],'print');assert.equal(defs[1][0],'download');assert.equal(defs[0][1],defs[1][1],tipo+': misma definición para imprimir y descargar');
   }
   await p.evaluate(()=>{pdfMake.createPdf=window.__crearPdfOriginal;window.open=()=>null;});await p.click('#imprimir');assert.equal(await p.locator('#vista-estado').innerText(),'No se pudo abrir la impresión. Descarga el PDF e imprímelo desde tu lector de PDF');await p.click('#cerrar');
   await p.evaluate(()=>{inclusionTrabajo=null;centroDocumento=null;mostrarPestana('trabajo');trabajadorActual().dimensiones={};sincronizarTrabajo();abrirPaso('trabajo-descripcion',true);});
   await area('trabajo-','trabajo');assert.equal(await p.locator('#trabajo-tarjetas > section h3').textContent(),'Para empezar');assert.equal(await p.locator('#trabajo-tarjetas > section > p').textContent(),'Los ajustes que mejor responden a lo que describiste.');await p.locator('#trabajo-area-0').evaluate(n=>n.scrollIntoView({block:'center'}));await foto('trabajo');
   assert.equal(await p.getByRole('button',{name:'Cambiar ámbito',exact:true}).count(),0);assert.equal(await p.locator('.pie [href^="#guia-"]').count(),0);assert.equal(await p.locator('#continuar').innerText(),'Guardar y ver ajustes');
   assert.deepEqual(errores,[]);resultados.push({ancho,tema,areasConservanDatos:true,tallerDiferido:true,textosExactos:true,impresionComparada:['curso','centro','trabajo'],ventanaBloqueadaExplicada:true,sinDesborde:true,errores});await p.close();
  }
  const dir=path.join(raiz,'docs/auditorias/039-verificacion');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'regresion.json'),JSON.stringify(resultados,null,2)+'\n');console.log('Correcto: áreas con teclado sin pérdida, No aplica, taller diferido, textos, cruces, PDF compartido y ventana bloqueada, pie y 390 px; claro/oscuro.');
 }finally{await b.close();await new Promise(ok=>servidor.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
