// Tarea 079: una sola mochila, panel fijo desde 80 rem y diálogo debajo.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const capturas = process.env.CAPTURAS; // carpeta opcional para las imágenes del pull request

const caso = (id, iniciales) => ({ id, iniciales, dimensiones: { 1: 3, 2: 2 }, descripcionGuardada: true, seleccion: {} });
const guardado = {
  app: 'prizma', version: 2, ambito: 'educacion', pestana: 'dua', perfil: { nivel: 'basica' }, seleccion: {},
  estudiantes: [caso('jp', 'JP'), caso('ma', 'MA')], estudianteActivo: 'jp'
};

async function probar() {
  const servidor = http.createServer(async (req, res) => {
    const ruta = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!ruta.startsWith(raiz + path.sep)) return res.writeHead(403).end();
    try {
      const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
      res.setHeader('Content-Type', tipos[path.extname(ruta)] || 'application/octet-stream');
      res.end(await fs.readFile(ruta));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
  const url = 'http://127.0.0.1:' + servidor.address().port;
  let navegador;
  try {
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined, args: ['--no-sandbox'] });
    const errores = [];
    // Tres acciones del curso, 2 apoyos para JP y 3 para MA.
    async function abrir(ancho, { colorScheme = 'light', sembrar = true } = {}) {
      const pagina = await navegador.newPage({ viewport: { width: ancho, height: 900 }, colorScheme, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(8000);
      pagina.on('pageerror', e => errores.push(e.message));
      pagina.on('dialog', d => d.accept());
      await pagina.addInitScript(g => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
        if (!localStorage.getItem('prizma.v1')) localStorage.setItem('prizma.v1', JSON.stringify(g));
      }, guardado);
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto');
      await pagina.waitForFunction(() => catalogo.length > 0);
      if (sembrar) {
        await pagina.evaluate(() => {
          estado.seleccion = Object.fromEntries(catalogo.filter(r => r.tipo === 'dua' && aplica(r)).slice(0, 3).map(r => [r.id, '']));
          const apoyos = (e, n) => Object.fromEntries(catalogo.filter(r => r.tipo !== 'dua' && r.tipo !== 'trabajo' && r.tipo !== 'practica-profesional' && aplica(r, e)).slice(0, n).map(r => [r.id, '']));
          estado.estudiantes[0].seleccion = apoyos(estado.estudiantes[0], 2);
          estado.estudiantes[1].seleccion = apoyos(estado.estudiantes[1], 3);
          guardar(); pintarTarjetas(); pintarApoyos(); pintarSeleccion();
        });
      }
      return pagina;
    }
    const foto = async (pagina, nombre) => { if (capturas) await pagina.screenshot({ path: path.join(capturas, nombre) }); };
    const sinDesborde = (pagina, etiqueta) => pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
      .then(ok => assert(ok, 'Desplazamiento horizontal a ' + etiqueta));
    const idsRepetidos = pagina => pagina.evaluate(() => {
      const vistos = new Set(), repetidos = [];
      for (const n of document.querySelectorAll('[id]')) { if (vistos.has(n.id)) repetidos.push(n.id); vistos.add(n.id); }
      return repetidos;
    });
    const enFoco = pagina => pagina.evaluate(() => document.activeElement.id);
    const sel = (pagina, id) => pagina.locator('#' + id);

    // 1280 px: panel fijo.
    for (const colorScheme of ['light', 'dark']) {
      const pagina = await abrir(1280, { colorScheme });
      const mochila = sel(pagina, 'mochila');
      assert(await mochila.isVisible(), 'El panel se ve sin abrirlo');
      const medidas = await pagina.evaluate(() => {
        const m = document.querySelector('#mochila'), c = document.querySelector('.columna');
        return {
          ancho: m.getBoundingClientRect().width, columna: c.getBoundingClientRect().width,
          modal: m.closest('dialog')?.matches(':modal') ?? false, enDialogo: Boolean(m.closest('dialog')),
          despues: Boolean(c.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING) && !c.contains(m),
          posicion: getComputedStyle(m).position, etiqueta: m.getAttribute('aria-labelledby'), etiquetaTexto: document.getElementById(m.getAttribute('aria-labelledby')).textContent,
          tag: m.tagName
        };
      });
      assert(Math.abs(medidas.ancho - 384) <= 2, 'Panel: ' + medidas.ancho);
      assert(Math.abs(medidas.columna - 736) <= 2, 'Columna: ' + medidas.columna);
      assert.equal(medidas.modal, false);
      assert.equal(medidas.enDialogo, false);
      assert(medidas.despues, 'El panel va después del contenido principal en el DOM');
      assert.equal(medidas.posicion, 'sticky');
      assert.equal(medidas.tag, 'ASIDE');
      assert.equal(medidas.etiqueta, 't-seleccion');
      assert.match(medidas.etiquetaTexto, /^Mi mochila \(8\)$/);
      assert.equal(await pagina.locator('#panel-elegidas').count(), 0);
      assert.equal(await pagina.locator('#panel-ir').count(), 0);
      assert(await sel(pagina, 'barra-continuar').isVisible(), 'La barra de continuar se ve con el panel');
      assert.equal(await sel(pagina, 'abrir-mochila').getAttribute('aria-haspopup'), null);
      assert.equal(await sel(pagina, 'abrir-mochila').getAttribute('aria-controls'), 'mochila');
      assert(!await sel(pagina, 'cerrar-mochila').isVisible(), '«Cerrar» solo existe en el diálogo');
      assert.deepEqual(await idsRepetidos(pagina), []);

      // El botón de la cabecera lleva el foco al título; Esc no cierra nada.
      await sel(pagina, 'abrir-mochila').click();
      assert.equal(await enFoco(pagina), 't-seleccion');
      await pagina.keyboard.press('Escape');
      assert(await mochila.isVisible());
      assert.equal(await enFoco(pagina), 't-seleccion');

      // DUA: el curso va abierto y los casos plegados.
      await pagina.click('#continuar');
      assert.equal(await sel(pagina, 'sel-nivel').innerText(), 'Nivel: Educación básica');
      const abierto = id => mochila.locator(`[data-grupo="${id}"]`).evaluate(n => n.open);
      assert(await abierto('curso'));
      assert(!await abierto('ejp'));
      assert(!await abierto('ema'));
      assert.equal(await mochila.locator('[data-grupo="curso"] > summary h3').innerText(), 'Para todo el curso · 3 acciones');
      assert(await sel(pagina, 'barra-continuar').isVisible());
      await foto(pagina, 'dua-paso-2-' + colorScheme + '.png');
      await sinDesborde(pagina, '1280 DUA');

      // Para un estudiante: el caso activo abierto, el curso y los demás plegados.
      await pagina.click('#tab-apoyos');
      assert(await abierto('ejp'));
      assert(!await abierto('curso'));
      assert(!await abierto('ema'));
      assert.equal(await mochila.locator('[data-grupo="ejp"] > summary h3').innerText(), 'Apoyos para JP');
      assert.equal(await mochila.locator('[data-grupo="ema"] > summary h3').innerText(), 'MA · 3 apoyos');
      assert.equal(await sel(pagina, 'sel-acuerdo').innerText(), 'Acuerdo: Sin acuerdos');
      assert.equal(await mochila.locator('h3').count(), 3);
      assert.equal(await mochila.locator('[data-grupo="ejp"] h4').count() > 0, true);
      assert.equal(await mochila.locator('[data-grupo="ejp"] .quitar').count(), 2);
      assert.equal(await mochila.locator('[data-grupo="curso"] .quitar').count(), 3);
      await foto(pagina, 'estudiante-2-casos-' + colorScheme + '.png');

      // Notas dentro de 24 rem.
      const nota = mochila.locator('[data-grupo="ejp"] .mochila-nota').first();
      await nota.locator('summary').click();
      const cabe = await mochila.evaluate(m => {
        const t = m.querySelector('[data-grupo="ejp"] textarea');
        return m.scrollWidth <= m.clientWidth && t.getBoundingClientRect().right <= m.getBoundingClientRect().right;
      });
      assert(cabe, 'La nota cabe en el panel');
      await nota.locator('textarea').fill('Nota del panel');
      assert.equal(await nota.locator('summary').innerText(), 'Nota');

      // Quitar: el foco pasa al siguiente «Quitar» del grupo y se anuncia.
      const quitar = mochila.locator('[data-grupo="ejp"] .quitar');
      const primero = await quitar.first().getAttribute('aria-label');
      const titulo1 = primero.replace(/^Quitar: /, '').replace(/, JP$/, '');
      await quitar.first().click();
      await pagina.waitForFunction(t => document.querySelector('#mochila-aviso').textContent.startsWith('Quitaste ' + t), titulo1);
      assert.equal(await sel(pagina, 'mochila-aviso').innerText(), `Quitaste ${titulo1}. Quedan 7.`);
      assert.equal(await pagina.evaluate(() => document.activeElement.matches('#mochila [data-grupo="ejp"] .quitar')), true);
      assert.equal(await sel(pagina, 't-seleccion').innerText(), 'Mi mochila (7)');
      await quitar.first().click();
      assert.equal(await enFoco(pagina), 't-seleccion');
      assert.equal(await sel(pagina, 't-seleccion').innerText(), 'Mi mochila (6)');
      assert(await abierto('ejp'), 'El caso activo sigue a la vista aunque no tenga apoyos');
      assert.deepEqual(await idsRepetidos(pagina), []);

      // Modo proyección: sin panel.
      await pagina.click('#tab-dua');
      await pagina.click('#proyectar');
      assert(!await mochila.isVisible(), 'El panel no se ve en proyección');
      await pagina.click('#salir-proyeccion');
      assert(await mochila.isVisible());
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // 1000 y 390 px: diálogo.
    for (const ancho of [1000, 390]) {
      const pagina = await abrir(ancho);
      const dialogo = sel(pagina, 'mochila-dialogo');
      assert(!await sel(pagina, 'mochila').isVisible(), `Mochila visible a ${ancho} px`);
      assert(!await dialogo.evaluate(n => n.open));
      assert(await sel(pagina, 'barra-continuar').isVisible());
      assert.equal(await sel(pagina, 'abrir-mochila').getAttribute('aria-haspopup'), 'dialog');
      await sel(pagina, 'abrir-mochila').click();
      assert(await dialogo.evaluate(n => n.open && n.matches(':modal')), 'Se abre como diálogo modal');
      assert(await sel(pagina, 'mochila').evaluate(n => n.parentElement.id === 'mochila-dialogo'));
      assert.equal(await enFoco(pagina), 't-seleccion');
      assert(await sel(pagina, 'cerrar-mochila').isVisible());
      assert.equal(await sel(pagina, 't-seleccion').innerText(), 'Mi mochila (8)');
      await sinDesborde(pagina, ancho + ' con el diálogo abierto');
      if (ancho === 390) await foto(pagina, 'telefono-dialogo.png');
      await pagina.keyboard.press('Escape');
      assert(!await dialogo.evaluate(n => n.open));
      await pagina.waitForFunction(() => document.activeElement.id === 'abrir-mochila');
      await sel(pagina, 'abrir-mochila').click();
      await sel(pagina, 'cerrar-mochila').click();
      await pagina.waitForFunction(() => document.activeElement.id === 'abrir-mochila');
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // Cambio de ancho con la página abierta.
    {
      const pagina = await abrir(1280);
      await sel(pagina, 'abrir-mochila').click();
      assert.equal(await enFoco(pagina), 't-seleccion');
      await pagina.setViewportSize({ width: 1000, height: 900 });
      await pagina.waitForFunction(() => document.querySelector('#mochila').parentElement.id === 'mochila-dialogo');
      assert(!await sel(pagina, 'mochila').isVisible());
      assert(!await sel(pagina, 'mochila-dialogo').evaluate(n => n.open));
      assert.equal(await sel(pagina, 'abrir-mochila').getAttribute('aria-haspopup'), 'dialog');
      assert.equal(await enFoco(pagina), 'abrir-mochila', 'El foco queda en un lugar visible');
      assert.deepEqual(await idsRepetidos(pagina), []);
      await sel(pagina, 'abrir-mochila').click();
      assert(await sel(pagina, 'mochila-dialogo').evaluate(n => n.open));
      await pagina.setViewportSize({ width: 1280, height: 900 });
      await pagina.waitForFunction(() => !document.querySelector('#mochila-dialogo').open && document.querySelector('#mochila').parentElement.matches('.marco'));
      assert(await sel(pagina, 'mochila').isVisible());
      await pagina.waitForFunction(() => document.activeElement.id === 'abrir-mochila');
      assert.equal(await sel(pagina, 'abrir-mochila').getAttribute('aria-haspopup'), null);
      assert(await pagina.evaluate(() => document.activeElement.checkVisibility()));
      assert.deepEqual(await idsRepetidos(pagina), []);
      assert.equal(await pagina.evaluate(() => document.querySelectorAll('#mochila').length), 1);
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // Sin desplazamiento horizontal.
    for (const ancho of [390, 1000, 1280, 1920]) {
      const pagina = await abrir(ancho);
      for (const pestana of ['dua', 'apoyos']) {
        await pagina.click('#tab-' + pestana);
        await sinDesborde(pagina, `${ancho} en ${pestana}`);
      }
      if (ancho >= 1280) {
        assert(await sel(pagina, 'mochila').evaluate(n => n.scrollWidth <= n.clientWidth), 'Desborde dentro del panel');
        const caja = await pagina.evaluate(() => ({ m: document.querySelector('#mochila').getBoundingClientRect().width, c: document.querySelector('.columna').getBoundingClientRect().width }));
        assert(Math.abs(caja.m - 384) <= 2 && Math.abs(caja.c - 736) <= 2, JSON.stringify(caja));
      }
      await pagina.close();
    }

    assert.deepEqual(errores, []);
    console.log('Correcto: «Mi mochila» como panel fijo de 24 rem desde 80 rem y como diálogo debajo, con un solo contenido, foco y anuncios al quitar, y cambio de ancho sin duplicados.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
