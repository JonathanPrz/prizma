// Tarea 076: columna de 46 rem, panel de lo elegido, pasos en segmentos, menos cajas y tamaños mínimos.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' };

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

    async function abrir(width, colorScheme = 'light', height = 900) {
      const pagina = await navegador.newPage({ viewport: { width, height }, colorScheme, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      pagina.errores = [];
      pagina.on('pageerror', error => pagina.errores.push(error.message));
      await pagina.addInitScript(() => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      });
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto:not([hidden])');
      await pagina.selectOption('#nivel', 'basica');
      return pagina;
    }
    const caja = (pagina, selector) => pagina.locator(selector).first().evaluate(n => {
      const r = n.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom };
    });
    async function elegir(pagina, cantidad) {
      await pagina.evaluate(() => document.querySelectorAll('#tarjetas details.grupo-apoyos').forEach(d => { d.open = true; }));
      for (let i = 0; i < cantidad; i++) {
        await pagina.locator('#tarjetas .tarjeta:not(.elegida) .t-abajo button:visible').first().click();
      }
    }
    async function sinDesborde(pagina, etiqueta) {
      assert(!await pagina.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Desplazamiento horizontal ' + etiqueta);
    }

    // 1280 px: columna de 46 rem y eje común arriba.
    {
      const pagina = await abrir(1280);
      const columna = await caja(pagina, '.columna');
      assert(columna.w >= 728 && columna.w <= 740, 'Ancho de la columna: ' + columna.w);
      for (const selector of ['.marca .logo', '#nivel-campo', '#indicador-pasos']) {
        const c = await caja(pagina, selector);
        assert(Math.abs(c.x - columna.x) <= 2, `${selector} a ${c.x} px, columna a ${columna.x} px`);
      }
      const tabDua = await caja(pagina, '#tab-dua'), tabApoyos = await caja(pagina, '#tab-apoyos');
      const lista = await caja(pagina, '#pestanas-educacion');
      await pagina.click('#tab-apoyos');
      const columnaApoyos = await caja(pagina, '.columna');
      assert(Math.abs(columnaApoyos.x - columna.x) <= 2 && Math.abs(columnaApoyos.w - columna.w) <= 2);
      for (const selector of ['.marca .logo', '#pestanas-educacion', '#indicador-pasos']) {
        const c = await caja(pagina, selector);
        assert(Math.abs(c.x - columna.x) <= 2 || selector === '#pestanas-educacion', `${selector} en Para un estudiante a ${c.x} px`);
      }
      for (const [selector, antes] of [['#tab-dua', tabDua], ['#tab-apoyos', tabApoyos], ['#pestanas-educacion', lista]]) {
        const despues = await caja(pagina, selector);
        assert(Math.abs(despues.x - antes.x) <= 2 && Math.abs(despues.y - antes.y) <= 2, `${selector} se movió al cambiar de pestaña: ${JSON.stringify([antes, despues])}`);
      }
      assert.equal(await pagina.locator('#nivel-campo').isHidden(), true);
      await sinDesborde(pagina, '1280');
      assert.deepEqual(pagina.errores, []);
      await pagina.close();
    }

    // En el teléfono no se reserva el hueco del nivel oculto: las pestañas suben y no queda un espacio en blanco arriba.
    {
      const pagina = await abrir(390);
      await pagina.click('#tab-apoyos');
      const hueco = await pagina.evaluate(() => document.querySelector('#tab-dua').getBoundingClientRect().top - document.querySelector('.cabecera').getBoundingClientRect().bottom);
      assert(hueco <= 32, 'Espacio en blanco sobre las pestañas a 390 px: ' + hueco);
      await pagina.close();
    }

    // 1280 px: panel de lo elegido, que reemplaza a la barra.
    for (const colorScheme of ['light', 'dark']) {
      const pagina = await abrir(1280, colorScheme);
      assert(await pagina.locator('#barra-continuar').isVisible());
      assert(!await pagina.locator('#panel-elegidas').isVisible(), 'El panel no debe verse en el paso 1');
      await pagina.click('#continuar');
      assert(await pagina.locator('#panel-elegidas').isVisible());
      assert.equal(await pagina.locator('#panel-conteo').textContent(), 'Todavía no eliges acciones.');
      assert(!await pagina.locator('#panel-ir').isVisible());
      await elegir(pagina, 3);
      const panel = pagina.locator('#panel-elegidas');
      assert(await panel.isVisible());
      assert(!await pagina.locator('#barra-continuar').isVisible(), 'La barra debe ocultarse con el panel');
      assert.equal(await panel.getAttribute('aria-labelledby'), 't-panel-elegidas');
      assert.equal(await pagina.locator('#t-panel-elegidas').evaluate(n => n.tagName + ':' + n.textContent), 'H2:Lo que elegiste');
      assert.equal(await pagina.locator('#panel-conteo').textContent(), '3 elegidas para el curso');
      const grupos = await pagina.locator('#panel-grupos section').evaluateAll(s => s.map(g => [g.querySelector('h3').textContent, g.querySelectorAll('li').length]));
      assert.equal(grupos.reduce((n, [, c]) => n + c, 0), 3);
      assert(grupos.every(([nombre]) => ['Antes', 'Durante', 'Después', 'En toda la clase'].includes(nombre)), JSON.stringify(grupos));
      const titulos = await pagina.locator('#panel-grupos li').allInnerTexts();
      const enTarjetas = await pagina.locator('#tarjetas .tarjeta.elegida h4').allInnerTexts();
      assert.deepEqual([...titulos].sort(), [...enTarjetas].sort());
      const medidas = await panel.evaluate(n => {
        const r = n.getBoundingClientRect(), p = getComputedStyle(n);
        const columna = document.querySelector('.columna');
        return {
          ancho: r.width, sticky: p.position, top: p.top,
          despues: Boolean(columna.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) && !columna.contains(n),
          lineas: [...n.querySelectorAll('li > span')].map(s => Math.round(s.getBoundingClientRect().height / parseFloat(getComputedStyle(s).lineHeight)))
        };
      });
      assert(medidas.ancho >= 270 && medidas.ancho <= 274, 'Ancho del panel: ' + medidas.ancho);
      assert.equal(medidas.sticky, 'sticky');
      assert(medidas.despues, 'El panel debe ir después de la columna en el DOM');
      assert(medidas.lineas.every(l => l <= 2), JSON.stringify(medidas.lineas));
      // Un solo botón principal visible: el del panel.
      assert.equal(await pagina.locator('main .boton-principal:visible').evaluateAll(b => b.map(n => n.id).join()), 'panel-ir');
      await pagina.click('#panel-ir');
      assert(await pagina.locator('#t-seleccion-dua').evaluate(n => n === document.activeElement), 'El foco debe llegar al título del paso 3');
      assert.equal(await pagina.locator('#panel-ir').textContent(), 'Ver documento');
      assert(await panel.isVisible());
      await pagina.click('#panel-ir');
      assert(await pagina.locator('#vista[open]').count() === 1 || await pagina.locator('dialog[open]').count() === 1, 'Ver documento debe abrir el diálogo');
      await pagina.keyboard.press('Escape');
      await sinDesborde(pagina, '1280 con panel');

      // Modo proyección: sin panel.
      await pagina.evaluate(() => document.querySelector('#documento-clase').scrollIntoView());
      await pagina.evaluate(() => { document.querySelector('#acciones').scrollIntoView(); });
      await pagina.click('#proyectar');
      assert(!await panel.isVisible(), 'El panel no debe verse en proyección');
      await pagina.click('#salir-proyeccion');
      assert(await panel.isVisible());

      // Al pasar a Para un estudiante, el panel y la barra vuelven a como estaban.
      await pagina.click('#tab-apoyos');
      assert(!await panel.isVisible());
      assert(await pagina.locator('#barra-continuar').isVisible());
      assert.deepEqual(pagina.errores, []);
      await pagina.close();
    }

    // Bajo 80 rem y en el teléfono: sin panel y con barra.
    for (const width of [1000, 1262, 390]) {
      const pagina = await abrir(width);
      await pagina.click('#continuar');
      await elegir(pagina, 3);
      assert(!await pagina.locator('#panel-elegidas').isVisible(), `Panel visible a ${width} px`);
      assert(await pagina.locator('#barra-continuar').isVisible(), `Barra oculta a ${width} px`);
      await sinDesborde(pagina, String(width));
      await pagina.close();
    }
    {
      const pagina = await abrir(1920);
      await pagina.click('#continuar');
      assert(await pagina.locator('#panel-elegidas').isVisible());
      await sinDesborde(pagina, '1920');
      const columna = await caja(pagina, '.columna'), logo = await caja(pagina, '.marca .logo');
      assert(Math.abs(columna.x - logo.x) <= 2 && columna.w >= 728 && columna.w <= 740);
      await pagina.close();
    }

    // Indicador de pasos y tarjeta elegida, en claro y oscuro.
    for (const colorScheme of ['light', 'dark']) {
      const pagina = await abrir(1280, colorScheme);
      const indicador = await pagina.locator('#indicador-pasos a').evaluateAll(enlaces => enlaces.map(a => {
        const r = a.getBoundingClientRect(), e = getComputedStyle(a);
        return {
          actual: a.getAttribute('aria-current'), alto: r.height, ancho: r.width, subrayado: e.textDecorationLine,
          texto: a.innerText.replace(/\s+/g, ' ').trim(), peso: e.fontWeight, color: e.color, fondo: e.backgroundColor
        };
      }));
      assert.equal(indicador.length, 3);
      assert.deepEqual(indicador.map(a => a.actual), ['step', null, null]);
      assert(indicador.every(a => a.alto === 44 && a.subrayado === 'none'), JSON.stringify(indicador));
      assert(indicador.every(a => Math.abs(a.ancho - indicador[0].ancho) <= 1), 'Los segmentos deben ser iguales');
      assert.deepEqual(indicador.map(a => a.texto.replace(/^✓\s*/, '')), ['1 Describe', '2 Elige', '3 Tu selección']);
      assert(Number(indicador[0].peso) >= 700 && indicador[1].fondo === 'rgba(0, 0, 0, 0)');
      const tokens = await pagina.evaluate(() => {
        const prueba = document.createElement('span');
        document.body.append(prueba);
        const leer = (propiedad, variable) => { prueba.style[propiedad] = `var(--${variable})`; return getComputedStyle(prueba)[propiedad]; };
        const r = { suave: leer('backgroundColor', 'acento-suave'), texto: leer('color', 'acento-texto'), tenue: leer('color', 'tenue') };
        prueba.remove();
        return r;
      });
      assert.equal(indicador[0].fondo, tokens.suave);
      assert.equal(indicador[0].color, tokens.texto);
      assert.equal(indicador[1].color, tokens.tenue);
      await pagina.keyboard.press('Tab');
      await pagina.click('#continuar');
      await pagina.waitForFunction(() => document.querySelector('#indicador-pasos [aria-current="step"]')?.textContent.includes('2 Elige'));
      await elegir(pagina, 1);
      const hecho = await pagina.locator('#indicador-pasos a').nth(1).innerText();
      assert.match(hecho, /✓/);

      const tarjeta = await pagina.locator('#tarjetas .tarjeta.elegida').first().evaluate(n => {
        const e = getComputedStyle(n);
        const rgb = texto => texto.match(/[\d.]+/g).slice(0, 4).map(Number);
        const luz = ([r, g, b]) => [r, g, b].map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
          .reduce((suma, c, i) => suma + c * [0.2126, 0.7152, 0.0722][i], 0);
        const fondoTarjeta = rgb(e.backgroundColor);
        const contraste = (a, b) => { const [x, y] = [luz(a), luz(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        const peores = [];
        for (const nodo of n.querySelectorAll('*')) {
          if (![...nodo.childNodes].some(h => h.nodeType === Node.TEXT_NODE && h.textContent.trim()) || !nodo.checkVisibility()) continue;
          const propio = rgb(getComputedStyle(nodo).backgroundColor);
          const fondo = propio[3] === 0 ? fondoTarjeta : propio;
          peores.push([contraste(rgb(getComputedStyle(nodo).color), fondo), nodo.tagName + '.' + nodo.className]);
        }
        return { izquierdo: e.borderLeftWidth, izquierdoEstilo: e.borderLeftStyle, superior: e.borderTopWidth, sombra: e.boxShadow, peores: peores.sort((a, b) => a[0] - b[0]).slice(0, 3), fondo: e.backgroundColor };
      });
      assert.equal(tarjeta.izquierdo, '4px');
      assert.equal(tarjeta.izquierdoEstilo, 'solid');
      assert.equal(tarjeta.superior, '1px');
      assert.equal(tarjeta.sombra, 'none');
      assert.equal(tarjeta.fondo, tokens.suave);
      assert(tarjeta.peores[0][0] >= 4.5, `${colorScheme}: contraste ${JSON.stringify(tarjeta.peores)}`);
      const boton = pagina.locator('#tarjetas .tarjeta.elegida .t-abajo button').first();
      assert.match(await boton.innerText(), /✓ Elegida/);
      // El filtro Momento ya no tiene fondo gris, pero sus botones conservan el borde de control.
      const filtro = await pagina.locator('#filtros-vista').evaluate(n => getComputedStyle(n).backgroundColor);
      assert.equal(filtro, 'rgba(0, 0, 0, 0)');
      const chip = await pagina.locator('#momentos .chip').first().evaluate(n => getComputedStyle(n).borderTopWidth + ' ' + getComputedStyle(n).borderTopColor);
      assert.notEqual(chip.split(' ')[0], '0px');
      await pagina.close();
    }

    // 390 px: paso 1, tamaños mínimos y espacios.
    for (const colorScheme of ['light', 'dark']) {
      const pagina = await abrir(390, colorScheme, 844);
      const espacio = (await caja(pagina, '#panel-dua .cabecera-intro .ayuda')).y - (await caja(pagina, '#indicador-pasos')).b;
      assert(espacio <= 24, 'Espacio bajo el indicador: ' + espacio);
      const paso1 = await pagina.locator('#paso-clase').evaluate(n => ({ alto: n.getBoundingClientRect().height, fondo: getComputedStyle(n).backgroundColor, borde: getComputedStyle(n).borderTopWidth, abierto: document.querySelector('#necesidades-campo').open }));
      assert(!paso1.abierto);
      assert(paso1.alto <= 860, 'Alto del paso 1: ' + paso1.alto);
      assert.equal(paso1.fondo, 'rgba(0, 0, 0, 0)');
      assert.equal(paso1.borde, '0px');
      const casillas = await pagina.locator('#perfil .perfil-rejilla').evaluateAll(rejillas => rejillas.map(r => ({
        columnas: getComputedStyle(r).gridTemplateColumns.split(' ').length,
        etiquetas: [...r.querySelectorAll('label')].map(l => {
          const rango = document.createRange();
          const texto = [...l.childNodes].find(h => h.nodeType === Node.TEXT_NODE && h.textContent.trim());
          rango.selectNodeContents(texto);
          return { alto: l.getBoundingClientRect().height, lineas: new Set([...rango.getClientRects()].map(c => Math.round(c.top))).size };
        })
      })));
      assert.equal(casillas.length, 2);
      for (const rejilla of casillas) {
        assert.equal(rejilla.columnas, 1);
        assert.equal(rejilla.etiquetas.length, 5);
        assert(rejilla.etiquetas.every(e => e.alto >= 44 && e.lineas === 1), JSON.stringify(rejilla.etiquetas));
      }
      assert(await pagina.locator('#practica-campo').isVisible());
      assert((await caja(pagina, '#practica-campo')).h >= 44);
      assert((await caja(pagina, '#necesidades-campo > summary')).h >= 44 || await pagina.locator('#necesidades-campo').isHidden());
      assert((await caja(pagina, '#limpiar-clase')).h >= 24);

      await pagina.locator('#perfil input[name="actividad"]').first().check();
      await pagina.click('#continuar');
      await pagina.evaluate(() => document.querySelectorAll('#tarjetas details').forEach(d => { d.open = true; }));
      const controles = await pagina.evaluate(() => {
        const alto = selector => [...document.querySelectorAll(selector)].filter(n => n.checkVisibility()).map(n => [selector, Math.round(n.getBoundingClientRect().height * 10) / 10]);
        return [
          ...alto('#tarjetas details.fuentes > summary'), ...alto('#tarjetas .t-abajo button'),
          ...alto('#tarjetas details.grupo-apoyos > summary'), ...alto('#perfil .perfil-rejilla label')
        ];
      });
      assert(controles.length > 20);
      assert(controles.every(([, h]) => h >= 44), JSON.stringify(controles.filter(([, h]) => h < 44)));
      assert(new Set(controles.map(([s]) => s)).size === 4);

      // «Quitar» y filtros dentro de la mochila.
      await elegir(pagina, 1);
      await pagina.click('#abrir-mochila');
      const mochila = await pagina.evaluate(() => [...document.querySelectorAll('#mochila .quitar, #mochila summary')].filter(n => n.checkVisibility()).map(n => Math.round(n.getBoundingClientRect().height)));
      assert(mochila.length > 0 && mochila.every(h => h >= 44), JSON.stringify(mochila));
      await pagina.click('#cerrar-mochila');

      // Ningún texto visible de menos de 14 px.
      const chicos = await pagina.evaluate(() => [...document.body.querySelectorAll('*')].filter(n =>
        !n.closest('.hoja, .solo-lectores, svg, script, style') && n.checkVisibility() &&
        [...n.childNodes].some(h => h.nodeType === Node.TEXT_NODE && h.textContent.trim()) && parseFloat(getComputedStyle(n).fontSize) < 14)
        .map(n => (n.id || n.className || n.tagName) + ' ' + getComputedStyle(n).fontSize));
      assert.deepEqual(chicos, []);
      await sinDesborde(pagina, '390 DUA');

      // Para un estudiante: Empieza por, Editar y pasos sin caja.
      await pagina.click('#tab-apoyos');
      await pagina.fill('#iniciales', 'JP');
      await pagina.click('#area-0');
      await pagina.locator('input[name="dimension-1"][value="3"]').check();
      await pagina.locator('input[name="dimension-2"][value="2"]').check();
      await pagina.click('#guardar-descripcion');
      await pagina.waitForSelector('#apoyos-resultados .empieza-por a');
      assert((await caja(pagina, '#paso-descripcion-editar')).h >= 44);
      const quitar = await caja(pagina, '#quitar-estudiante');
      assert(quitar.h >= 44);
      const lista = await pagina.locator('#apoyos-resultados .empieza-por').first().evaluate(seccion => {
        const ul = seccion.querySelector('ul');
        const e = getComputedStyle(ul);
        return {
          estilo: e.listStylePosition, sangria: e.paddingInlineStart, enlace: getComputedStyle(ul.querySelector('a')).display,
          items: [...ul.querySelectorAll('li')].map(li => {
            const a = li.querySelector('a');
            const rango = document.createRange();
            rango.selectNodeContents(a);
            const lineas = [...rango.getClientRects()].sort((p, q) => p.top - q.top);
            const primera = lineas[0], segunda = lineas.find(l => l.top > primera.top + 4);
            const fi = li.getBoundingClientRect(), fa = a.getBoundingClientRect();
            const estilo = getComputedStyle(li);
            const medida = parseFloat(estilo.lineHeight);
            return {
              // El marcador de la viñeta se alinea con la primera línea del texto.
              alturaMarcador: Math.abs((fi.top + medida / 2) - (primera.top + primera.height / 2)),
              inicioPrimera: primera.left, inicioSegunda: segunda ? segunda.left : null, hayDos: lineas.some(l => l.top > primera.top + 4),
              izquierdaEnlace: fa.left, sangria: fa.left - ul.getBoundingClientRect().left
            };
          })
        };
      });
      assert.equal(lista.estilo, 'outside');
      assert.equal(lista.sangria, '20px');
      assert.equal(lista.enlace, 'block', 'El enlace debe ser un bloque para que la viñeta siga a su primera línea');
      assert(lista.items.every(i => i.sangria >= 18 && i.alturaMarcador <= 12), JSON.stringify(lista));
      assert(lista.items.every(i => i.inicioSegunda === null || Math.abs(i.inicioSegunda - i.inicioPrimera) <= 2), JSON.stringify(lista));
      assert(lista.items.some(i => i.hayDos), 'Se esperaba al menos un enlace de dos líneas a 390 px: ' + JSON.stringify(lista));
      const pasoEstudiante = await pagina.locator('#estudiante').evaluate(n => ({ fondo: getComputedStyle(n).backgroundColor, borde: getComputedStyle(n).borderTopWidth }));
      assert.deepEqual(pasoEstudiante, { fondo: 'rgba(0, 0, 0, 0)', borde: '0px' });
      const separacion = await pagina.evaluate(() => {
        const a = document.querySelector('#paso-descripcion').getBoundingClientRect(), b = document.querySelector('#estudiante').getBoundingClientRect();
        return b.top - a.bottom;
      });
      assert(separacion >= 24, 'Separación entre pasos: ' + separacion);
      await sinDesborde(pagina, '390 estudiante');
      assert.deepEqual(pagina.errores, []);
      await pagina.close();
    }

    // En escritorio los pasos siguen con su superficie y la viñeta de «Empieza por» alinea.
    {
      const pagina = await abrir(1280);
      assert.notEqual(await pagina.locator('#paso-clase').evaluate(n => getComputedStyle(n).backgroundColor), 'rgba(0, 0, 0, 0)');
      for (const width of [1000, 1920]) {
        await pagina.setViewportSize({ width, height: 900 });
        await sinDesborde(pagina, String(width));
      }
      await pagina.close();
    }
    console.log('Correcto: columna de 46 rem, panel de lo elegido, pasos en segmentos, tarjeta elegida, paso 1 a 390 px y tamaños mínimos en claro y oscuro.');
  } finally {
    await navegador?.close();
    servidor.close();
  }
}

probar().catch(error => {
  console.error(error);
  process.exit(1);
});
