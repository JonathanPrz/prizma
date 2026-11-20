const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const pares = [
  ['tinta', 'papel', 4.5], ['tinta', 'superficie', 4.5], ['tenue', 'papel', 4.5],
  ['tenue', 'superficie', 4.5], ['sobre-acento', 'acento', 4.5],
  ['acento-texto', 'acento-suave', 4.5], ['borde-control', 'superficie', 3],
  ['alerta', 'alerta-fondo', 4.5], ['error', 'error-suave', 4.5], ['solida', 'solida-fondo', 4.5]
];
function luminancia(hex) {
  return hex.slice(1).match(/../g).map(s => parseInt(s, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((suma, c, i) => suma + c * [0.2126, 0.7152, 0.0722][i], 0);
}

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
  let navegador;
  try {
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined, args: ['--no-sandbox'] });
    for (const width of [390, 1280]) for (const colorScheme of ['light', 'dark']) {
      const pagina = await navegador.newPage({ viewport: { width, height: 844 }, colorScheme, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      const errores = [];
      pagina.on('pageerror', error => errores.push(error.message));
      await pagina.addInitScript(() => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      });
      await pagina.goto('http://127.0.0.1:' + servidor.address().port);
      await pagina.waitForSelector('#contexto');
      const entorno = width + ' ' + colorScheme;
      const css = await pagina.evaluate(pares => Object.fromEntries([...new Set(pares.flatMap(p => p.slice(0, 2)))]
        .map(variable => [variable, getComputedStyle(document.documentElement).getPropertyValue('--' + variable).trim()])), pares);
      for (const [frente, fondo, minimo] of pares) {
        const [oscuro, claro] = [luminancia(css[frente]), luminancia(css[fondo])].sort((a, b) => a - b);
        assert((claro + 0.05) / (oscuro + 0.05) >= minimo, entorno + ' ' + frente + ' sobre ' + fondo);
      }

      async function medir(pantalla) {
        const resultado = await pagina.evaluate(() => {
          const dialogo = document.querySelector('dialog[open]');
          const raiz = dialogo || document.body;
          const visibles = [...raiz.querySelectorAll('*')].filter(n =>
            n instanceof HTMLElement && !n.closest('.hoja, .solo-lectores') && n.checkVisibility({ opacityProperty: true, visibilityProperty: true }));
          const texto = visibles.filter(n => [...n.childNodes].some(h => h.nodeType === Node.TEXT_NODE && h.textContent.trim()) ||
            n.matches('input, select, textarea, button'));
          return {
            letra: Object.fromEntries(texto.map(n => [getComputedStyle(n).fontSize, n.id || n.tagName])),
            principales: visibles.filter(n => n.matches('.boton-principal')).map(n => n.id),
            desborde: document.documentElement.scrollWidth > innerWidth || Boolean(dialogo && dialogo.scrollWidth > dialogo.clientWidth)
          };
        });
        const contexto = entorno + ' ' + pantalla;
        const escala = width === 390 ? ['13px', '14px', '16px', '17px', '20px', '24px'] : ['13px', '14px', '16px', '17px', '20px', '28px'];
        assert(Object.keys(resultado.letra).every(n => escala.includes(n)), contexto + ' ' + JSON.stringify(resultado.letra));
        assert.equal(resultado.principales.length, 1, contexto + ' ' + resultado.principales.join(', '));
        assert(!resultado.desborde, contexto);
      }

      async function verificarCasoActivo(lista) {
        const caso = pagina.locator(lista + ' button[aria-pressed="true"]');
        assert.match(await caso.innerText(), /Sin acuerdos/);
        const estilo = await caso.evaluate(n => ({
          borde: getComputedStyle(n).borderTopWidth,
          contenido: getComputedStyle(n, '::after').content
        }));
        assert.deepEqual(estilo, { borde: '2px', contenido: 'none' });
        assert.doesNotMatch(await caso.innerText(), /✓/);
      }

      await pagina.selectOption('#nivel', 'basica');
      await pagina.click('#guardar-clase');
      await medir('DUA con resultados');
      const tarjeta = pagina.locator('#elegir-dua-1-1');
      if (!await tarjeta.isVisible()) {
        await tarjeta.evaluate(boton => {
          for (let n = boton.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
        });
      }
      await tarjeta.click();
      assert.equal(await tarjeta.getAttribute('aria-pressed'), 'true');
      assert.match(await tarjeta.innerText(), /✓ Elegida/);
      assert.equal(await tarjeta.locator('[aria-hidden="true"]').textContent(), '✓');
      assert.match(await tarjeta.getAttribute('aria-label'), /^Elegida:/);
      await pagina.click('#abrir-mochila');
      await medir('mochila');
      await pagina.click('#pdf');
      await medir('contenido del documento');
      await pagina.click('#generar-documento');
      await pagina.waitForSelector('#vista[open]');
      await medir('vista previa del documento');
      await pagina.click('#cerrar');

      await pagina.click('#tab-apoyos');
      await verificarCasoActivo('#lista-estudiantes');
      await pagina.click('#guardar-descripcion');
      assert.equal(await pagina.locator('.mensaje-error:has(#descripcion-error) [aria-hidden]').innerText(), '✕');
      await pagina.click('#area-0');
      await pagina.check('input[name="dimension-1"][value="2"]');
      await pagina.click('#guardar-descripcion');
      await medir('estudiante con resultados');
      await pagina.locator('#nivel').focus();
      const foco = await pagina.locator('#nivel').evaluate(n => {
        const css = getComputedStyle(n);
        return [css.outlineWidth, css.outlineOffset];
      });
      assert.deepEqual(foco, ['3px', '2px']);

      await pagina.selectOption('#nivel', 'practica-trabajo');
      await verificarCasoActivo('#lista-trabajadores');
      assert.equal(await pagina.locator('#continuar').textContent(), 'Guardar y ver ajustes');
      await pagina.click('#abrir-mochila');
      await medir('mochila de trabajo vacía');
      await pagina.click('#cerrar-mochila');
      await pagina.click('#trabajo-area-0');
      await pagina.check('input[name="trabajo-dimension-1"][value="2"]');
      await pagina.click('#guardar-descripcion-trabajo');
      await medir('trabajo con resultados');
      const ajuste = pagina.locator('#trabajo-tarjetas [id^="elegir-"]').first();
      await ajuste.evaluate(boton => {
        for (let n = boton.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
      });
      await ajuste.click();
      await pagina.click('#abrir-mochila');
      await medir('mochila de trabajo');
      assert(await pagina.locator('#pdf-trabajo').evaluate(n => n.classList.contains('boton-principal')));
      assert.deepEqual(errores, []);
      await pagina.close();
    }
    console.log('Correcto: escala tipográfica, contrastes, foco, jerarquía, íconos de selección/error y reflujo en claro y oscuro a 390 y 1280 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}

probar().catch(error => { console.error(error); process.exitCode = 1; });
