// Prueba de una página; solo abre impresión, nunca confirma ni envía a una impresora.
const fs=require('node:fs'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/usr/bin/chromium',headless:false,env:{...process.env,DISPLAY:process.env.DISPLAY||':38'},args:['--no-sandbox','--window-size=1280,900','--lang=es-CL']});
 try {
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.setContent(fs.readFileSync(path.join(__dirname,'pagina-prueba.html'),'utf8'));
  await p.evaluate(()=>{window.__eventos=[];for(const e of ['beforeprint','afterprint'])addEventListener(e,()=>window.__eventos.push(e));setTimeout(()=>{window.__eventos.push('llamada-window.print');window.print();window.__eventos.push('window.print-retorno');},0);});
  await new Promise(ok=>setTimeout(ok,1000));
  const c=await b.newBrowserCDPSession(), {targetInfos}=await c.send('Target.getTargets');
  const pol='/etc/chromium/policies/managed/misc.json',datos=fs.existsSync(pol)?JSON.parse(fs.readFileSync(pol,'utf8')):{};
  const salida={fecha:new Date().toISOString(),paginaPrueba:'pagina-prueba.html',eventos:await p.evaluate(()=>window.__eventos),politicas:{PrintingEnabled:datos.PrintingEnabled,DisablePrintPreview:datos.DisablePrintPreview},objetivosImpresion:targetInfos.filter(t=>t.url.startsWith('chrome://print')).map(t=>({tipo:t.type,url:t.url})),envioReal:false};
  fs.writeFileSync(path.join(__dirname,'impresion-nativa.json'),JSON.stringify(salida,null,2)+'\n');
  await p.goto('chrome://policy');await p.waitForTimeout(500);
  const filtro=p.locator('input').first();if(await filtro.count()){await filtro.fill('Print');await p.waitForTimeout(600);}
  await p.getByText('PrintingEnabled',{exact:true}).scrollIntoViewIfNeeded();
  await p.screenshot({path:path.join(__dirname,'capturas/politicas-impresion.png')});
  console.log(JSON.stringify(salida));
 } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
