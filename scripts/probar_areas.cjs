const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
const raiz=path.resolve(__dirname,'..'),salida=path.join(raiz,'docs/marca/041-areas');fs.mkdirSync(salida,{recursive:true});
(async()=>{
 const servidor=http.createServer((q,r)=>{const archivo=path.resolve(raiz,'.'+new URL(q.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!archivo.startsWith(raiz+path.sep))return r.writeHead(403).end();fs.readFile(archivo,(e,c)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.svg':'image/svg+xml'})[path.extname(archivo)]||'application/octet-stream');r.end(c);});});
 await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,args:['--no-sandbox']});
 try{
  for(const ancho of [1280,390])for(const tema of ['light','dark']){
   const p=await b.newPage({viewport:{width:ancho,height:900},colorScheme:tema,reducedMotion:'reduce'}),errores=[];p.on('pageerror',e=>errores.push(e.message));
   await p.goto('http://127.0.0.1:'+servidor.address().port);await p.waitForFunction(()=>catalogo.length>0);await p.selectOption('#nivel','basica');await p.click('#tab-apoyos');
   for (const prefijo of ['', 'trabajo-']) {
    if (prefijo) { await p.selectOption('#nivel','practica-trabajo'); }
    const boton=p.locator('#'+prefijo+'area-0');
    const bloque=p.locator('#'+prefijo+'dimensiones').locator('..');
    const grupo=p.locator('#'+await boton.getAttribute('aria-controls'));
    assert(!await bloque.isVisible(), 'Sin áreas abiertas se oculta el título y su contenedor');
    assert.match(await boton.innerText(), /^\+ /);
    const cerrado=await boton.evaluate(n=>getComputedStyle(n).backgroundColor);
    await boton.focus(); await p.keyboard.press('Enter');
    assert.equal(await boton.getAttribute('aria-expanded'),'true');
    assert.match(await boton.innerText(), /^− /);
    assert.match(await boton.locator('span[aria-hidden="true"]').innerText(), /^−/, 'El símbolo no debe leerse');
    assert(!(await boton.evaluate((b) => [...b.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(''))).includes('−'), 'El símbolo queda fuera del texto que se lee');
    assert.notEqual(await boton.evaluate(n=>getComputedStyle(n).backgroundColor),cerrado);
    const contraste=await boton.evaluate(n=>{
     const estilo=getComputedStyle(n);
     const luz=color=>color.match(/\d+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
     const a=luz(estilo.color),b=luz(estilo.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    assert(contraste>=4.5, 'Contraste AA del botón abierto');
    assert(await bloque.isVisible()); assert(await grupo.locator('h4').isVisible());
    assert.equal(await grupo.locator('h4').innerText(),await p.evaluate(()=>AREAS[0][0]));
    await p.check('input[name="'+prefijo+'dimension-1"][value="3"]');
    assert.match(await boton.innerText(), /1 marcada/);
    await p.locator('#'+prefijo+'area-1').click();
    await boton.click(); assert(await bloque.isVisible(), 'Otra área abierta mantiene las frecuencias');
    await p.locator('#'+prefijo+'area-1').click(); assert(!await bloque.isVisible());
    assert.match(await boton.innerText(), /^\+ .*1 marcada/);
    await boton.focus(); await p.keyboard.press('Space');
    assert(await p.locator('input[name="'+prefijo+'dimension-1"][value="3"]').isChecked());
    assert.equal(await boton.evaluate(n=>getComputedStyle(n).outlineStyle),'solid');
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await boton.scrollIntoViewIfNeeded();
    await p.screenshot({path:path.join(salida,`${prefijo||'estudiante-'}${ancho}-${tema}.png`)});
    await p.reload(); await p.waitForFunction(()=>catalogo.length>0);
    assert.equal(await boton.getAttribute('aria-expanded'),'true'); assert(await bloque.isVisible());
   }
   assert.deepEqual(errores,[]); await p.close();
  }
  console.log('Correcto: áreas en estudiante y trabajo, título condicional, íconos, estilo, agrupación, teclado, persistencia y 390/1280 claro/oscuro.');
 }finally{await b.close();await new Promise(ok=>servidor.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
