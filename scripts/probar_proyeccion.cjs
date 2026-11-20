const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

async function probar() {
  const servidor = http.createServer(async (req, res) => {
    const ruta = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!ruta.startsWith(raiz + path.sep)) return res.writeHead(403).end();
    try {
      const archivo = await fs.readFile(ruta);
      res.setHeader('Content-Type', tipos[path.extname(ruta)] || 'application/octet-stream');
      res.end(archivo);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
  const url = 'http://127.0.0.1:' + servidor.address().port;
  let navegador;
  try {
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined, args: ['--no-sandbox'] });
    for (const width of [390, 1280]) {
      const pagina = await navegador.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      const errores = [];
      pagina.on('pageerror', error => errores.push(error.message));
      await pagina.addInitScript(rechazar => {
        let elemento = null;
        Object.defineProperty(document, 'fullscreenElement', { get: () => elemento });
        window.solicitudesFullscreen = 0;
        Element.prototype.requestFullscreen = async function () {
          window.solicitudesFullscreen++;
          if (rechazar) throw new Error('Pantalla completa bloqueada');
          elemento = this;
          document.dispatchEvent(new Event('fullscreenchange'));
        };
        document.exitFullscreen = async () => {
          elemento = null;
          document.dispatchEvent(new Event('fullscreenchange'));
        };
      }, width === 390);
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto');
      const nodo = id => pagina.locator('#' + id);
      await nodo('nivel').selectOption('basica');
      await nodo('necesidades-campo').locator('summary').click();
      await nodo('necesidad-tareas-largas').check();

      const momentos = nodo('momentos').locator('button');
      const nombres = ['Antes', 'Durante', 'Después', 'En toda la clase'];
      assert.deepEqual(await momentos.allTextContents(), nombres);
      assert.deepEqual(await momentos.evaluateAll(ns => ns.map(n => n.getAttribute('aria-label'))), nombres);
      const medidas = await momentos.evaluateAll(ns => ns.map(n => {
        const r = n.getBoundingClientRect();
        return { izq: r.left, der: r.right, arriba: r.top, abajo: r.bottom, ancho: r.width, alto: r.height };
      }));
      const [antes, durante, despues, toda] = medidas;
      assert(antes.arriba === durante.arriba && durante.arriba === despues.arriba);
      assert(medidas.every(r => r.alto >= 44));
      assert(Math.abs(antes.ancho - durante.ancho) <= 2 && Math.abs(durante.ancho - despues.ancho) <= 2);
      assert(toda.arriba >= despues.abajo);
      assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert(Math.abs(toda.izq - antes.izq) <= 2 && Math.abs(toda.der - despues.der) <= 2);
      const triangulos = await nodo('propositos').locator('button').evaluateAll(botones => botones.map(b => {
        const tri = b.querySelector('.tri');
        return tri && tri.getAttribute('aria-hidden') === 'true' ? getComputedStyle(tri).backgroundColor : '';
      }));
      assert.equal(triangulos.length, 3);
      assert(triangulos.every(c => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent'));
      assert.equal(new Set(triangulos).size, 3);

      await nodo('m-durante').click();
      const tarjeta = nodo('tarjetas').locator('.tarjeta:has(.t-que-busca)').first();
      assert.match(await tarjeta.locator('abbr.t-dua').innerText(), /^Consideración \d+\.\d+$/);
      assert.match(await tarjeta.locator('abbr.t-dua').getAttribute('title'), /^Consideración DUA 3\.0: .+/);
      assert.match(await tarjeta.locator('.t-que-busca').innerText(), /^Qué busca:/);
      assert.doesNotMatch(await tarjeta.locator('.t-que-busca').innerText(), /DUA 3\.0/);
      const esperadas = await pagina.evaluate(() => visibles().map(r => r.id));
      assert(esperadas.length > 0);
      await nodo('proyectar').click();
      await pagina.waitForSelector('#salir-proyeccion');
      assert(await pagina.locator('html.proyectando').count());
      assert.equal(await pagina.locator('html').evaluate(n => getComputedStyle(n).fontSize), '20px');
      const salida = nodo('salir-proyeccion');
      assert(await salida.evaluate(n => n === document.activeElement));
      assert.equal(await pagina.evaluate(() => window.solicitudesFullscreen), 1);
      assert.equal(await pagina.evaluate(() => Boolean(document.fullscreenElement)), width === 1280);
      for (const selector of ['.cabecera', '#filtros-vista', '#barra-continuar', '#abrir-mochila', '#tarjetas button[id^="elegir-"]']) {
        assert.equal(await pagina.locator(selector + ':visible').count(), 0, selector);
      }
      assert.equal(await nodo('proyeccion').locator('button').count(), 1);
      assert.deepEqual(await nodo('acciones-proyectadas').locator('[data-accion]').evaluateAll(ns => ns.map(n => n.dataset.accion)), esperadas);
      assert(await nodo('acciones-proyectadas').locator('.tarjeta').first().locator('ol li').first().isVisible());
      assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

      async function verificarSalida() {
        await pagina.waitForSelector('#proyectar');
        assert.equal(await pagina.locator('html.proyectando').count(), 0);
        assert(await nodo('proyectar').evaluate(n => n === document.activeElement));
        assert.equal(await pagina.evaluate(() => Boolean(document.fullscreenElement)), false);
      }
      await pagina.keyboard.press('Escape');
      await verificarSalida();
      await nodo('proyectar').click();
      await salida.click();
      await verificarSalida();
      if (width === 1280) {
        await nodo('proyectar').click();
        await pagina.evaluate(() => document.exitFullscreen());
        await verificarSalida();
      }
      assert.deepEqual(errores, []);
      await pagina.close();
    }
    console.log('Correcto: proyección filtrada, salida y foco, rechazo y cambio de pantalla completa, línea de tiempo y tarjetas a 390 y 1280 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}

probar().catch(error => { console.error(error); process.exitCode = 1; });
