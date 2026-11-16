const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
let chromium;
try { ({chromium} = require('playwright')); } catch { ({chromium} = require('/opt/codex/cua_node/lib/node_modules/playwright')); }
const raiz = path.resolve(__dirname, '..');
const catalogoReal = JSON.parse(fs.readFileSync(path.join(raiz, 'data/recomendaciones.json'), 'utf8'));

async function probar() {
  const servidor = http.createServer((req, res) => {
    const archivo = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!archivo.startsWith(raiz + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(archivo, (error, contenido) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', ({'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml'})[path.extname(archivo)] || 'application/octet-stream');
      res.end(contenido);
    });
  });
  await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
  const url = 'http://127.0.0.1:' + servidor.address().port;
  let navegador;
  try {
    navegador = await chromium.launch({executablePath: process.env.CHROMIUM_BIN || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), headless: true, args: ['--no-sandbox']});
    const capturas = path.join(raiz, 'docs/marca/037-filtros'); fs.mkdirSync(capturas, {recursive: true});
    for (const width of [1280, 390]) for (const colorScheme of ['light', 'dark']) {
      const p = await navegador.newPage({viewport: {width, height: 900}, colorScheme, reducedMotion: 'reduce'}), errores = [];
      p.on('pageerror', e => errores.push(e.message));
      await p.goto(url + '/#dua'); await p.waitForFunction(n => catalogo.length === n, catalogoReal.length);
      assert.equal(await p.locator('#paso-clase #momentos, #paso-clase #propositos').count(), 0);
      assert.equal(await p.locator('#acciones #momentos, #acciones #propositos').count(), 2);
      assert.equal(await p.locator('#filtros-vista-ayuda').innerText(), 'Si no eliges ninguno, se muestran todos');
      assert.equal(await p.locator('#proposito-motivar').innerText(), 'Motivar');
      assert.equal(await p.locator('#proposito-presentar').innerText(), 'Presentar');
      await p.fill('#meta', 'Interpretar un gráfico de barras.');
      await p.click('#necesidad-tareas-largas');
      assert.deepEqual(await p.evaluate(() => estado.necesidades), []);
      // El filtro funciona incluso con una descripción todavía sin guardar.
      await p.locator('#m-durante').focus(); await p.keyboard.press('Enter');
      assert.equal(await p.locator('#m-durante').getAttribute('aria-pressed'), 'true');
      assert.equal(await p.evaluate(() => document.activeElement.id), 'm-durante');
      assert(await p.evaluate(() => visibles().every(r => r.momento === 'durante')));
      assert(await p.evaluate(() => borradorDua !== null && !Object.hasOwn(borradorDua, 'momentos') && !Object.hasOwn(borradorDua, 'propositos')));
      await p.click('#guardar-clase');
      assert.deepEqual(await p.evaluate(() => estado.momentos), ['durante']);
      assert.deepEqual(await p.evaluate(() => estado.necesidades), ['tareas-largas']);
      const primeras = await p.evaluate(() => primerasDua().map(r => r.id));
      assert.equal(primeras.length, 3);
      assert(await p.evaluate(() => primerasDua().every(r => r.momento === 'durante')));
      assert.deepEqual(primeras, await p.evaluate(() => [...visibles()].sort(compararPertinenciaDua).slice(0, 3).map(r => r.id)));
      assert((await p.locator('#m-durante').innerText()).includes('para ti'));
      await p.locator('#proposito-motivar').focus(); await p.keyboard.press('Space');
      assert.equal(await p.locator('#proposito-motivar').getAttribute('aria-pressed'), 'true');
      assert.equal(await p.evaluate(() => document.activeElement.id), 'proposito-motivar');
      assert(await p.evaluate(() => visibles().every(r => r.momento === 'durante' && proposito(r) === 'motivar')));
      assert((await p.locator('#conteo').innerText()).startsWith(String(await p.evaluate(() => visibles().length))));
      assert.equal(await p.locator('#conteo').getAttribute('aria-live'), 'polite');
      await p.evaluate(() => { document.querySelector('#acciones').scrollIntoView({block: 'start'}); });
      await p.screenshot({path: path.join(capturas, `paso-2-${width}-${colorScheme}.png`)});
      const accesibilidad = await p.locator('#filtros-vista').ariaSnapshot();
      assert(accesibilidad.includes('group "Momento"'));
      assert(accesibilidad.includes('group "Para qué"'));
      assert(accesibilidad.includes('button "Motivar" [pressed]'));
      fs.writeFileSync(path.join(capturas, `accesibilidad-${width}-${colorScheme}.yml`), accesibilidad + '\n');
      const filtros = await p.evaluate(() => ({momentos: estado.momentos, propositos: estado.propositos}));
      await p.click('#paso-clase-editar'); await p.fill('#meta', 'Comparar dos gráficos.');
      await p.click('#guardar-clase');
      assert.deepEqual(await p.evaluate(() => ({momentos: estado.momentos, propositos: estado.propositos})), filtros);
      const resumen = await p.locator('#paso-clase-texto').innerText();
      assert(resumen.includes('Comparar dos gráficos.')); assert(!resumen.includes('Durante')); assert(!resumen.includes('Motivar'));
      const descripcion = await p.evaluate(() => documento({curso: true, estudiantes: []}).resumen);
      assert(descripcion.some(([k,v]) => k === 'Meta de aprendizaje' && v === 'Comparar dos gráficos.'));
      assert(!descripcion.flat().includes('Durante')); assert(!descripcion.flat().some(t => /motivar|propósito|momento/i.test(t)));
      await p.click('#limpiar-filtros');
      assert.deepEqual(await p.evaluate(() => [estado.momentos, estado.propositos]), [[], []]);
      assert.equal(await p.locator('#limpiar-filtros').evaluate(n => n === document.activeElement), true);
      assert.equal(await p.evaluate(() => estado.perfil.meta), 'Comparar dos gráficos.');
      assert.deepEqual(await p.evaluate(() => estado.necesidades), ['tareas-largas']);
      await p.click('#m-durante'); await p.click('#proposito-presentar');
      await p.click('#paso-clase-editar'); await p.click('#limpiar-clase');
      assert.equal(await p.locator('#meta').inputValue(), '');
      assert.deepEqual(await p.evaluate(() => [estado.momentos, estado.propositos]), [['durante'], ['presentar']]);
      assert.equal(await p.evaluate(() => estado.perfil.meta), 'Comparar dos gráficos.', 'Limpiar respuestas todavía es borrador');
      await p.click('#guardar-clase');
      assert.deepEqual(await p.evaluate(() => [estado.momentos, estado.propositos]), [['durante'], ['presentar']]);
      await p.reload(); await p.waitForFunction(n => catalogo.length === n, catalogoReal.length);
      assert.equal(await p.locator('#m-durante').getAttribute('aria-pressed'), 'true');
      assert.equal(await p.locator('#proposito-presentar').getAttribute('aria-pressed'), 'true');
      // Recarga y respaldo usan los mismos valores validados, sin requerir descripción.
      await p.click('#abrir-mochila');
      assert(!await p.locator('#guardar-respaldo').isDisabled());
      const descarga = p.waitForEvent('download'); await p.click('#guardar-respaldo');
      const archivo = await (await descarga).path(); const respaldo = JSON.parse(fs.readFileSync(archivo, 'utf8'));
      assert.deepEqual(respaldo.momentos, ['durante']); assert.deepEqual(respaldo.propositos, ['presentar']);
      const validado = await p.evaluate(d => validarRespaldo(d), respaldo);
      assert.deepEqual(validado.momentos, ['durante']); assert.deepEqual(validado.propositos, ['presentar']);
      await p.click('#cerrar-mochila');
      await p.click('#limpiar-filtros');
      await p.selectOption('#nivel', 'parvularia');
      assert((await p.locator('#m-toda-la-clase').innerText()).includes('En toda la experiencia de aprendizaje'));
      assert.equal(await p.locator('#m-toda-la-clase [data-voc="clase"]').count(), 1);
      // Catálogo real: todos los cruces, incluidos tres o menos y más de tres resultados.
      let pocos = false, muchos = false;
      for (const nivel of ['parvularia', 'basica', 'media', 'superior']) {
        await p.selectOption('#nivel', nivel);
        for (const momento of ['antes', 'durante', 'despues', 'toda-la-clase']) for (const proposito of ['motivar', 'presentar', 'mostrar']) {
          await p.evaluate(({momento, proposito}) => { estado.momentos = [momento]; estado.propositos = [proposito]; estado.necesidades = ['tareas-largas']; actualizarVistaDua(); }, {momento, proposito});
          const n = await p.evaluate(() => visibles().length), destacadas = await p.locator('#t-dua-empezar').count();
          assert.equal(destacadas, n > 3 ? 1 : 0);
          const ids = await p.locator('#tarjetas button[id^="elegir-"]').evaluateAll(ns => ns.map(n => n.id));
          assert.equal(new Set(ids).size, n);
          if (n > 3) muchos = true; else pocos = true;
        }
      }
      assert(pocos && muchos);
      await p.evaluate(() => { estado.momentos = ['durante']; estado.propositos = []; actualizarVistaDua(); });
      await p.locator('#indicador-pasos a').nth(1).click();
      await p.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))));
      assert.equal(await p.locator('#indicador-pasos [aria-current="step"]').innerText(), '2 Elige');
      if (width === 390) { await p.click('#continuar'); await p.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)))); assert.equal(await p.locator('#indicador-pasos [aria-current="step"]').innerText(), '3 Tu selección'); }
      await p.locator('#indicador-pasos a').first().click();
      await p.screenshot({path: path.join(capturas, `paso-1-${width}-${colorScheme}.png`)});
      const botones = await p.locator('#filtros-vista button').evaluateAll(ns => ns.map(n => { const r = n.getBoundingClientRect(); return {w:r.width, h:r.height}; }));
      assert(botones.every(r => r.w >= 24 && r.h >= 24));
      assert(!await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      assert.deepEqual(errores, []); await p.close();
    }
    const p = await navegador.newPage();
    await p.addInitScript(() => { Storage.prototype.getItem = Storage.prototype.setItem = () => { throw Error('bloqueado'); }; });
    await p.goto(url + '/#dua'); await p.waitForFunction(n => catalogo.length === n, catalogoReal.length);
    await p.click('#proposito-motivar'); assert.equal(await p.locator('#proposito-motivar').getAttribute('aria-pressed'), 'true');
    assert(await p.evaluate(() => hayDatos())); await p.close();
    console.log('Correcto: filtros instantáneos con teclado, borrador independiente, top 3 y cruces reales, limpieza separada, resumen/PDF, recarga/respaldo, ambos temas/ancho y almacenamiento bloqueado.');
  } finally { if (navegador) await navegador.close(); await new Promise(ok => servidor.close(ok)); }
}
probar().catch(e => { console.error(e); process.exitCode = 1; });
