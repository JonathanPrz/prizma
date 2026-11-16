// Pruebas de migración y de los límites entre ámbitos, con el catálogo real.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const raiz = path.join(__dirname, '..'), leer = p => fs.readFileSync(path.join(raiz, p), 'utf8');
const html = leer('index.html');
const opciones = [...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m => ({value: m[1]}));
const c = vm.createContext({document: {querySelector: () => ({options: opciones}), querySelectorAll: () => []}});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/, ''), c);
c.datos = JSON.parse(leer('data/recomendaciones.json'));
const run = s => vm.runInContext(s,c), json = s => JSON.parse(JSON.stringify(run(s)));
run('catalogo=datos');
assert.equal(run('normalizarDatos({}).ambito'), null);
assert.equal(run('normalizarDatos({ambito:"inventado"}).ambito'), null);
assert.equal(run('normalizarDatos({ambito:"trabajo"}).ambito'), 'trabajo');
assert.equal(run('normalizarDatos({estudiante:{iniciales:"JP"}}).ambito'), 'educacion');
assert.equal(run('normalizarDatos({trabajadores:[{iniciales:"AB"}]}).ambito'), 'trabajo');
assert.equal(run('normalizarDatos({estudiante:{iniciales:"JP"},trabajadores:[{iniciales:"AB"}]}).ambito'), 'educacion');
assert.equal(run('validarRespaldo({app:"prizma",version:2,ambito:"trabajo",perfil:{},seleccion:{},estudiantes:[],trabajadores:[{iniciales:"AB",seleccion:{}}]}).ambito'), 'trabajo');
run('estado=normalizarDatos({ambito:"educacion",perfil:{nivel:"superior"},estudiante:{iniciales:"JP",dimensiones:{1:3}}})');
assert.equal(run('modeloDocumento().borrador'), true);
run('estudianteActual().practicaProfesional=true;estudianteActual().seleccion={"pp-c-pasos":"NO COMPARTIR"}');
assert.equal(run('documentoParaCentro(["pp-c-pasos"],false)'),null);
assert.equal(run('documentoParaCentro(["pp-c-pasos"],true).borrador'),true);
assert(!JSON.stringify(json('documentoParaCentro(["pp-c-pasos"],true)')).includes('NO COMPARTIR'));
run('estudianteActual().acuerdo={roles:["estudiante"],fecha:"2026-11-16",revision:"2026-12-01",estado:"completo"}');
assert.equal(run('documentoParaCentro(["pp-c-pasos"],true).borrador'),false);
assert.equal(run('modeloDocumento().borrador'),false);
const prohibidos = [/\bapoyos individualizados\b/i, /\bfichas?\b/i, /\brecomendaci[oó]n(?:es)?\b/i];
// Datos de autoría se conservan; la presentación no llama "ficha" al apoyo.
for (const r of json('catalogo')) {
 const visible = [r.titulo, ...r.como.map(t => run(`textoPublico(${JSON.stringify(t)})`)),r.porque].join(' ');
 for (const termino of prohibidos) assert(!termino.test(visible), r.id+': '+termino);
}
for (const termino of prohibidos) assert(!termino.test(html.replace(/<[^>]+>/g,'')),String(termino));
console.log('Correcto: migración del ámbito y respaldos, borrador general/centro y decisión de compartir, glosario sobre todo el catálogo real y HTML.');

// Navegador real: aislamiento visible, teclado, foco y almacenamiento denegado.
async function navegador() {
  let chromium;
  try { ({chromium} = require('playwright')); } catch { ({chromium} = require('/opt/codex/cua_node/lib/node_modules/playwright')); }
  const http = require('node:http');
  const servidor = http.createServer((req, res) => {
    const archivo = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!archivo.startsWith(raiz + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(archivo, (error, contenido) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(archivo)] || 'application/octet-stream'); res.end(contenido);
    });
  });
  await new Promise(ok => servidor.listen(0,'127.0.0.1',ok));
  const url = 'http://127.0.0.1:' + servidor.address().port;
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_BIN || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),headless:true,args:['--no-sandbox']});
  const capturas = path.join(raiz,'docs/marca/036-arquitectura'); fs.mkdirSync(capturas,{recursive:true});
  try {
    for (const width of [1280,390]) for (const colorScheme of ['light','dark']) {
      const p = await browser.newPage({viewport:{width,height:900},colorScheme,reducedMotion:'reduce'}), errores=[];
      p.on('pageerror', e=>errores.push(e.message));
      await p.goto(url); await p.waitForFunction(()=>catalogo.length===240);
      assert(await p.locator('#inicio').isVisible()); assert(!await p.locator('#abrir-mochila').isVisible());
      await p.locator('#elegir-educacion').focus(); await p.keyboard.press('Enter');
      assert.equal(await p.evaluate(()=>document.activeElement.id),'tab-dua');
      assert.equal(await p.locator('#indicador-pasos [aria-current="step"]').innerText(),'1 Describe');
      await p.selectOption('#nivel','parvularia');
      assert((await p.locator('#paso-clase-toggle').innerText()).includes('experiencia de aprendizaje'));
      await p.locator('#panel-dua .enlace-guia-dua').click();
      assert((await p.locator('#guia-dua').innerText()).includes('El Diseño Universal para el Aprendizaje (DUA)'));
      assert((await p.locator('#guia-dua').innerText()).includes('experiencia de aprendizaje'));
      await p.keyboard.press('Escape');
      assert.equal(await p.evaluate(()=>document.activeElement.className),'enlace-guia-dua');
      await p.selectOption('#nivel','superior');await p.click('#tab-apoyos');
      assert.equal(await p.locator('#voz-etiqueta').innerText(),'¿Qué dice el estudiante?');
      await p.fill('#iniciales','JP');await p.click('#privacidad-entendido');
      p.once('dialog',d=>d.dismiss());await p.selectOption('#nivel','basica');
      assert.equal(await p.locator('#nivel').inputValue(),'superior');
      p.once('dialog',d=>{assert.equal(d.message(),'Cambiar el nivel cambia los apoyos sugeridos de tus 1 casos. Lo que ya elegiste se conserva');d.accept();});await p.selectOption('#nivel','basica');
      await p.evaluate(()=>{Object.assign(estudianteActual(),normalizarEstudiante({iniciales:'JP',dimensiones:{1:3},descripcionGuardada:true}));estudianteActual().seleccion={'acc-1-agenda':'Nota educativa'};sincronizarEstudiante();pintarSeleccion();});
      await p.click('#documento-estudiante');await p.click('#generar-documento');await p.waitForSelector('#vista[open]');
      assert((await p.locator('#hoja').innerText()).includes('Borrador: acuerdos sin completar'));
      const definicion=await p.evaluate(()=>definicionPdf());assert(JSON.stringify(definicion.content.slice(0,4)).includes('Borrador: acuerdos sin completar'));
      await p.keyboard.press('Escape');
      await p.locator('#contexto .cambiar-ambito').click();await p.locator('#elegir-trabajo').focus();await p.keyboard.press('Enter');
      assert(!await p.locator('#nivel').isVisible());assert(!await p.locator('#tab-dua').isVisible());assert(!await p.locator('#pie-educacion').isVisible());
      await p.fill('#trabajo-iniciales','AB');await p.waitForSelector('#aviso-privacidad[open]');
      assert((await p.locator('#aviso-privacidad').innerText()).includes('154 ter'));
      assert(!(await p.locator('#aviso-privacidad').innerText()).includes('estudiantes'));
      await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement.id),'trabajo-iniciales');
      await p.evaluate(()=>{trabajadorActual().seleccion={'tr-subtitulos':'Nota laboral'};pintarSeleccion();});
      await p.click('#abrir-mochila');const mochila=await p.locator('#mochila').innerText();assert(!mochila.includes('JP'));assert(mochila.includes('AB'));assert(mochila.includes('Educación y Trabajo en un solo archivo'));
      await p.click('#cerrar-mochila');await p.reload();await p.waitForFunction(()=>catalogo.length===240);assert.equal(await p.evaluate(()=>estado.ambito),'trabajo');
      const texto=await p.locator('body').innerText();for(const termino of prohibidos)assert(!termino.test(texto));
      assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
      await p.screenshot({path:path.join(capturas,`trabajo-${width}-${colorScheme}.png`)});
      await p.click('#abrir-mochila');p.once('dialog',d=>d.accept());await p.click('#borrar');await p.waitForFunction(()=>catalogo.length===240&&estado.trabajadores.length===1&&!trabajadorActual().iniciales);
      assert.equal(await p.evaluate(()=>estudianteActual().iniciales),'JP');
      await p.locator('#contexto .cambiar-ambito').click();await p.click('#elegir-educacion');await p.click('#tab-apoyos');
      await p.click('#abrir-mochila');assert((await p.locator('#mochila').innerText()).includes('JP'));assert(!await p.locator('#seleccion-trabajo').isVisible());
      p.once('dialog',d=>d.accept());await p.click('#borrar');await p.waitForFunction(()=>catalogo.length===240&&!estudianteActual().iniciales);
      assert.deepEqual(errores,[]);await p.close();
    }
    const p=await browser.newPage();await p.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw Error('bloqueado');};});await p.goto(url+'/#trabajo');await p.waitForFunction(()=>catalogo.length===240);assert(await p.locator('#panel-trabajo').isVisible());await p.close();
    console.log('Correcto: ambos temas/ancho, teclado/foco, guías, confirmación de nivel, borradores, mochila/privacidad/borrado por ámbito, recarga, almacenamiento bloqueado y sin desborde.');
  } finally { await browser.close(); await new Promise(ok=>servidor.close(ok)); }
}
navegador().catch(error=>{console.error(error);process.exitCode=1;});
