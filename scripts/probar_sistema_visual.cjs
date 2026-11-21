const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' };
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

async function verificarRespaldoTipografico(navegador, origen) {
  const pagina = await navegador.newPage();
  try {
    const medir = () => pagina.evaluate(async () => {
      const muestra = document.createElement('p');
      muestra.textContent = 'Apoyos para un estudiante. Marca las situaciones que aparecen y con qué frecuencia. Elige apoyos para organizar los pasos de una tarea y conversar sobre lo que le ayuda.';
      muestra.style.cssText = 'position:absolute; width:max-content; white-space:nowrap; font:400 16px var(--fuente)';
      document.body.append(muestra);
      await document.fonts.ready;
      const resultado = {
        ancho: muestra.getBoundingClientRect().width,
        cargadas: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family)
      };
      muestra.remove();
      return resultado;
    });

    await pagina.goto(origen);
    const principal = await medir();
    assert(principal.cargadas.includes('Public Sans'));
    await pagina.route('**/vendor/fuentes/public-sans-latin.woff2', ruta => ruta.abort());
    await pagina.reload();
    const respaldo = await medir();
    assert(!respaldo.cargadas.includes('Public Sans'));
    if (!respaldo.cargadas.includes('Public Sans respaldo')) {
      console.log('Medición omitida: Chromium no tiene disponible una fuente local del respaldo.');
      return;
    }
    const diferencia = Math.abs(respaldo.ancho - principal.ancho) / principal.ancho;
    assert(diferencia <= .02, `Diferencia de ancho del respaldo: ${(diferencia * 100).toFixed(2)} %`);
    console.log(`Correcto: diferencia de ancho del respaldo con Public Sans bloqueada: ${(diferencia * 100).toFixed(2)} %.`);
  } finally {
    await pagina.close();
  }
}

async function probar() {
  const estilos = await fs.readFile(path.join(raiz, 'styles.css'), 'utf8');
  const respaldo = estilos.match(/@font-face\s*\{[^{}]*font-family:\s*"Public Sans respaldo"[^{}]*\}/)?.[0];
  assert(respaldo, 'Falta la declaración de Public Sans respaldo');
  const src = respaldo.match(/src:\s*([^;]+);/)?.[1];
  assert.equal(src, 'local("Arial"), local("Liberation Sans"), local("Helvetica"), local("Arimo")');
  const favicon = await fs.readFile(path.join(raiz, 'assets/favicon.svg'), 'utf8');
  assert.match(favicon, /<rect width="100" height="100" rx="22" fill="#1a2134"\/>/);
  const icono = await fs.readFile(path.join(raiz, 'assets/apple-touch-icon.png'));
  assert.equal(icono.subarray(12, 16).toString(), 'IHDR');
  assert.deepEqual([icono.readUInt32BE(16), icono.readUInt32BE(20)], [180, 180]);

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
    const origen = 'http://127.0.0.1:' + servidor.address().port;
    await verificarRespaldoTipografico(navegador, origen);
    for (const width of [390, 1280]) for (const colorScheme of ['light', 'dark']) {
      const pagina = await navegador.newPage({ viewport: { width, height: 844 }, colorScheme, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      const errores = [], peticionesFuente = [];
      pagina.on('request', req => {
        if (req.resourceType() === 'font') peticionesFuente.push(req.url());
      });
      pagina.on('pageerror', error => errores.push(error.message));
      await pagina.addInitScript(() => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      });
      await pagina.goto(origen);
      await pagina.waitForSelector('#contexto');
      const logo = await pagina.locator('svg.logo').evaluate(svg => {
        const raiz = getComputedStyle(document.documentElement);
        const prueba = document.createElement('span');
        svg.parentElement.append(prueba);
        const esperados = ['accion', 'compromiso', 'representacion'].map(variable => {
          prueba.style.color = raiz.getPropertyValue('--' + variable);
          return getComputedStyle(prueba).color;
        });
        prueba.remove();
        return {
          circulos: svg.querySelectorAll('circle').length,
          rectangulos: [...svg.querySelectorAll('rect')].map(rect => getComputedStyle(rect).fill),
          persona: getComputedStyle(svg.querySelector('circle')).fill,
          tinta: getComputedStyle(svg).color,
          esperados
        };
      });
      assert.equal(logo.circulos, 1);
      assert.deepEqual(logo.rectangulos, logo.esperados);
      assert.equal(logo.persona, logo.tinta);
      const impreso = await pagina.evaluate(() => logoDocumento());
      assert.doesNotMatch(impreso, /var\(|currentColor/);
      for (const color of ['#1a2134', '#21633b', '#693b97', '#005873']) assert(impreso.includes(color));

      const fuenteCargada = await pagina.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('16px "Public Sans"') &&
          [...document.fonts].some(f => f.family === 'Public Sans' && f.status === 'loaded');
      });
      assert(fuenteCargada);
      for (const selector of ['#panel-dua h1', '#limpiar-clase', '#nivel']) {
        assert.match(await pagina.locator(selector).evaluate(n => getComputedStyle(n).fontFamily), /^"Public Sans",/);
      }
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

      async function verificarTitulos(panel) {
        if (width !== 390) return;
        const titulosLargos = await pagina.locator(panel).evaluate(panel => {
          const plegados = [...panel.querySelectorAll('details:not([open])')].filter(d => !d.closest('.tarjeta'));
          plegados.forEach(d => { d.open = true; });
          const largos = [...panel.querySelectorAll('.tarjeta :is(h3,h4)')].filter(t => t.checkVisibility() &&
            t.getBoundingClientRect().height > parseFloat(getComputedStyle(t).lineHeight) * 4 + 1);
          plegados.forEach(d => { d.open = false; });
          return largos.map(t => t.textContent);
        });
        assert.deepEqual(titulosLargos, []);
      }

      async function verificarCasoActivo(lista) {
        const caso = pagina.locator(lista + ' button[aria-pressed="true"]');
        assert.equal(await caso.innerText(), lista === '#lista-estudiantes' ? 'Estudiante 1' : 'Persona 1');
        const estilo = await caso.evaluate(n => ({
          borde: getComputedStyle(n).borderTopWidth,
          contenido: getComputedStyle(n, '::after').content
        }));
        assert.deepEqual(estilo, { borde: '2px', contenido: 'none' });
        assert.doesNotMatch(await caso.innerText(), /✓/);
      }

      await pagina.selectOption('#nivel', 'basica');
      await pagina.click('#continuar');
      await medir('DUA con resultados');
      await verificarTitulos('#panel-dua');
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
      const imagenDocumento = pagina.locator('#hoja .h-marca img');
      assert(await imagenDocumento.evaluate(async img => { await img.decode(); return img.naturalWidth > 0; }));
      assert.equal(await pagina.evaluate(() => definicionPdf().content[0].columns[0].svg), impreso);
      for (const selector of ['#hoja', '#hoja h2']) {
        assert.match(await pagina.locator(selector).first().evaluate(n => getComputedStyle(n).fontFamily), /^Roboto,/);
      }
      await pagina.click('#cerrar');

      await pagina.click('#tab-apoyos');
      await verificarCasoActivo('#lista-estudiantes');
      await pagina.click('#guardar-descripcion');
      assert.equal(await pagina.locator('.mensaje-error:has(#descripcion-error) [aria-hidden]').innerText(), '✕');
      await pagina.click('#area-0');
      await pagina.check('input[name="dimension-1"][value="2"]');
      await pagina.click('#guardar-descripcion');
      await medir('estudiante con resultados');
      const tarjetaEstudiante = pagina.locator('#panel-apoyos .tarjeta ol li').first();
      assert.match(await tarjetaEstudiante.evaluate(n => getComputedStyle(n).fontFamily), /^"Public Sans",/);
      await verificarTitulos('#panel-apoyos');
      assert.deepEqual(peticionesFuente, [origen + '/vendor/fuentes/public-sans-latin.woff2']);
      await pagina.click('#paso-descripcion-editar');
      await pagina.keyboard.press('Tab');
      await pagina.locator('#nivel-estudiante').focus();
      assert(await pagina.locator('#nivel-estudiante').evaluate(n => n === document.activeElement));
      const foco = await pagina.locator('#nivel-estudiante').evaluate(n => {
        const css = getComputedStyle(n);
        return [css.outlineWidth, css.outlineOffset];
      });
      assert.deepEqual(foco, ['3px', '2px']);

      await pagina.click('#tab-dua');
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
      await verificarTitulos('#panel-trabajo');
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
