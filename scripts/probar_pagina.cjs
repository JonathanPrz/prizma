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
    for (const width of [390, 1280, 640]) {
      const pagina = await navegador.newPage({ viewport: { width, height: width === 640 ? 400 : 844 }, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      const errores = [];
      pagina.on('pageerror', error => errores.push(error.message));
      await pagina.addInitScript(() => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      });
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto');
      const nodo = id => pagina.locator('#' + id);
      const activo = pagina.locator('#indicador-pasos [aria-current="step"]');
      assert(await nodo('barra-continuar').isVisible());

      async function verificarResultados(titulo, primerControl) {
        await pagina.waitForFunction(() => document.querySelector('#indicador-pasos [aria-current="step"]')?.textContent.includes('2 Elige'));
        assert.match(await nodo(titulo).innerText(), /^2\./);
        const medicion = await pagina.evaluate(({ titulo, primerControl }) => {
          const indicador = document.querySelector('#indicador-pasos');
          const rectTitulo = document.getElementById(titulo).getBoundingClientRect();
          const control = primerControl && document.querySelector(primerControl).getBoundingClientRect();
          return {
            arriba: getComputedStyle(indicador).position === 'static' ?
              document.querySelector('.cabecera').getBoundingClientRect().bottom : indicador.getBoundingClientRect().bottom,
            abajo: document.querySelector('#barra-continuar').getBoundingClientRect().top,
            inicio: rectTitulo.top, fin: rectTitulo.bottom, control: control?.bottom,
            desborde: document.documentElement.scrollWidth > innerWidth
          };
        }, { titulo, primerControl });
        assert(medicion.inicio >= medicion.arriba && medicion.fin <= medicion.abajo, JSON.stringify(medicion));
        if (primerControl) assert(medicion.control <= medicion.abajo, JSON.stringify(medicion));
        assert(!medicion.desborde);
        assert(await nodo('indicador-pasos').locator('.paso-terminado').first().isVisible());
        assert.equal(await nodo('indicador-pasos').locator('.paso-terminado').first().getAttribute('aria-hidden'), 'true');
      }

      await nodo('nivel').selectOption('basica');
      await nodo('guardar-clase').click();
      await verificarResultados('t-acciones', '#proyectar');
      if (width === 640) {
        assert.equal(await nodo('indicador-pasos').evaluate(n => getComputedStyle(n).position), 'static');
        assert.deepEqual(errores, []);
        await pagina.close();
        continue;
      }

      await nodo('tab-apoyos').click();
      await nodo('iniciales').fill('JP');
      await nodo('area-0').click();
      await pagina.locator('input[name="dimension-1"][value="3"]').check();
      await nodo('guardar-descripcion').click();
      await verificarResultados('t-apoyos');
      const medidas = await nodo('panel-apoyos').evaluate(n => ({
        ancho: n.getBoundingClientRect().width,
        columnas: [...n.querySelectorAll('.tarjetas')].filter(l => l.getClientRects().length)
          .map(l => getComputedStyle(l).gridTemplateColumns)
      }));
      assert(medidas.ancho <= 800);
      assert(medidas.columnas.length && medidas.columnas.every(c => /^\d+(\.\d+)?px$/.test(c)));
      const elegir = nodo('elegir-acc-1-organizador'), tarjeta = elegir.locator('xpath=ancestor::li[contains(@class, "tarjeta")]');
      // El grupo que contiene la tarjeta puede estar plegado, independiente de su apartado de fuentes.
      await elegir.evaluate(b => {
        for (let n = b.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
      });
      const detalle = tarjeta.locator('details');
      assert.equal(await detalle.count(), 1);
      assert.equal(await detalle.locator('summary').innerText(), 'Por qué funciona y fuentes');
      assert(!(await detalle.evaluate(d => d.open)));
      assert(await tarjeta.locator('.aviso-apoyos').isVisible());
      assert(await tarjeta.locator(':scope > ol').isVisible());
      assert(await tarjeta.locator('.t-razon').evaluate(razon =>
        Boolean(razon.previousElementSibling?.matches('h3,h4'))));
      await detalle.locator('summary').click();
      await elegir.click();
      assert(await detalle.evaluate(d => d.open));
      assert.equal(await nodo('continuar-conteo').innerText(), '1 elegido para JP');

      async function verificarErrores(trabajo) {
        const prefijo = trabajo ? 'trabajo-acuerdo-' : 'acuerdo-';
        const roles = nodo(trabajo ? 'trabajo-roles' : 'roles-acuerdo').locator('input').first();
        await nodo(trabajo ? 'trabajo-ir-acuerdos' : 'ir-acuerdos').click();
        assert.match(await activo.innerText(), /3 Acuerda/);
        const posicion = await roles.evaluate(input => ({
          arriba: document.querySelector('#indicador-pasos').getBoundingClientRect().bottom,
          titulo: input.closest('section').querySelector('h2').getBoundingClientRect().top,
          control: input.getBoundingClientRect().bottom,
          abajo: document.querySelector('#barra-continuar').getBoundingClientRect().top
        }));
        assert(posicion.titulo >= posicion.arriba && posicion.control < posicion.abajo, JSON.stringify(posicion));
        await nodo(trabajo ? 'guardar-acuerdos-trabajo' : 'guardar-acuerdos').click();
        assert.equal(await roles.evaluate(r => r === document.activeElement), true);
        assert.equal(await roles.getAttribute('aria-invalid'), 'true');
        assert.equal(await roles.getAttribute('aria-describedby'), prefijo + 'roles-error');
        assert.equal(await nodo(trabajo ? 'trabajo-acuerdos-error' : 'acuerdos-error').innerText(), 'Revisa 4 campos.');
        await roles.check();
        assert.equal(await roles.getAttribute('aria-invalid'), null);
        assert.equal(await roles.getAttribute('aria-describedby'), null);
        assert(!(await nodo(prefijo + 'roles-error').isVisible()));
        assert.equal(await nodo(trabajo ? 'trabajo-acuerdos-error' : 'acuerdos-error').innerText(), 'Revisa 3 campos.');
      }
      await verificarErrores(false);

      await nodo('nivel').selectOption('practica-trabajo');
      await nodo('trabajo-area-0').click();
      await pagina.locator('input[name="trabajo-dimension-1"][value="3"]').check();
      await nodo('guardar-descripcion-trabajo').click();
      await verificarResultados('t-ajustes');
      const primerAjuste = nodo('trabajo-tarjetas').locator('button[id^="elegir-"]').first();
      await primerAjuste.evaluate(b => {
        for (let n = b.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
      });
      await primerAjuste.click();
      await verificarErrores(true);
      assert.deepEqual(errores, []);
      await pagina.close();
    }
    console.log('Correcto: columna única, tarjetas y detalles persistentes, barra y pasos visibles, validación junto al campo y reflujo a 390, 640 y 1280 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}

probar().catch(error => { console.error(error); process.exitCode = 1; });
