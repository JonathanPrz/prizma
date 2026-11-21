// Tareas 078 y 079: el nivel del caso a la vista y «Mi mochila» como panel fijo en todos los pasos y ámbitos.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const capturas = process.env.CAPTURAS; // carpeta opcional para las imágenes del pull request

function datos(extra) {
  return { app: 'prizma', version: 2, ambito: 'educacion', perfil: { nivel: 'basica' }, seleccion: {}, ...extra };
}
const jp = (extra) => ({ id: 'jp', iniciales: 'JP', dimensiones: { 1: 3, 2: 2 }, descripcionGuardada: true, seleccion: {}, ...extra });

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
    async function abrir(ancho, guardado) {
      const pagina = await navegador.newPage({ viewport: { width: ancho, height: 900 }, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(8000);
      pagina.on('pageerror', e => errores.push(e.message));
      pagina.on('dialog', d => d.accept());
      await pagina.addInitScript(([g]) => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
        if (g && !localStorage.getItem('prizma.v1')) localStorage.setItem('prizma.v1', JSON.stringify(g));
      }, [guardado]);
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto');
      await pagina.waitForFunction(() => catalogo.length > 0);
      return pagina;
    }
    const foto = async (pagina, nombre) => { if (capturas) await pagina.screenshot({ path: path.join(capturas, nombre) }); };
    const texto = (pagina, id) => pagina.locator('#' + id).innerText();
    const elegirPrimeros = async (pagina, selector, n) => {
      const botones = pagina.locator(selector);
      for (let i = 0; i < n; i++) {
        const b = botones.nth(i);
        await b.evaluate(x => { for (let p = x.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true; });
        await b.click();
      }
    };

    // Niveles con datos limpios: el caso vacío sigue al nivel general.
    {
      const pagina = await abrir(1280);
      assert.equal(await pagina.evaluate(() => estudianteActual().nivel), 'basica');
      await pagina.selectOption('#nivel', 'superior');
      assert.equal(await pagina.evaluate(() => estudianteActual().nivel), 'superior');
      assert.equal(await texto(pagina, 'tab-apoyos'), 'Para un estudiante');
      await pagina.selectOption('#nivel', 'parvularia');
      assert.equal(await pagina.evaluate(() => estudianteActual().nivel), 'parvularia');
      assert.equal(await pagina.locator('#nivel-casos-estado').innerText(), '');
      // Etiquetas y ayudas unidas con aria-describedby.
      assert.equal(await pagina.locator('#nivel-etiqueta').innerText(), 'Nivel para el curso');
      assert.equal(await pagina.locator('#nivel').getAttribute('aria-describedby'), 'nivel-ayuda');
      assert.equal(await texto(pagina, 'nivel-ayuda'), 'Ordena las acciones para todo el curso. Cada estudiante tiene su propio nivel.');
      await pagina.click('#tab-apoyos');
      assert.equal(await pagina.locator('label[for="nivel-estudiante"]').innerText().then(t => t.split('\n')[0].trim()), 'Nivel de este estudiante');
      assert.equal(await pagina.locator('#nivel-estudiante').getAttribute('aria-describedby'), 'nivel-estudiante-ayuda');
      assert.equal(await pagina.locator('#nivel-estudiante').inputValue(), 'parvularia');
      assert.equal(await texto(pagina, 'nivel-caso'), 'Nivel: Educación parvularia');
      await pagina.close();
    }

    // Al cargar, un caso vacío se alinea con el nivel general.
    {
      const pagina = await abrir(1280, datos({ perfil: { nivel: 'media' }, estudiantes: [{ id: 'va', nivel: 'superior', dimensiones: {}, seleccion: {} }], estudianteActivo: 'va' }));
      assert.equal(await pagina.evaluate(() => estudianteActual().nivel), 'media');
      await pagina.close();
    }

    // Un caso con datos conserva su nivel y se avisa.
    {
      const pagina = await abrir(1280, datos({ estudiantes: [jp({ nivel: 'superior' })], estudianteActivo: 'jp' }));
      await pagina.selectOption('#nivel', 'parvularia');
      assert.equal(await pagina.evaluate(() => estudianteActual().nivel), 'superior');
      assert.equal(await pagina.locator('#nivel-casos-estado').getAttribute('role'), 'status');
      assert.equal(await texto(pagina, 'nivel-casos-estado'), 'JP sigue en Educación superior. Puedes cambiarlo dentro del caso.');
      await pagina.click('#tab-apoyos');
      assert.equal(await texto(pagina, 'nivel-caso'), 'Nivel: Educación superior');
      assert.equal(await texto(pagina, 'tab-apoyos'), 'Para un estudiante');
      await pagina.click('#tab-dua');
      await pagina.close();
    }
    {
      const pagina = await abrir(1280, datos({ estudiantes: [jp({ nivel: 'superior' }), jp({ id: 'am', iniciales: 'AM', nivel: 'media' })], estudianteActivo: 'jp' }));
      await pagina.selectOption('#nivel', 'parvularia');
      assert.equal(await texto(pagina, 'nivel-casos-estado'), '2 casos siguen con su propio nivel. Puedes cambiarlo dentro de cada caso.');
      await pagina.close();
    }

    // Cambiar el nivel dentro de un caso con datos conserva el aviso de la tarea 071.
    {
      const pagina = await abrir(1280, datos({ estudiantes: [jp({ seleccion: { 'obj-priorizacion': 'Mantener esta nota' } })], estudianteActivo: 'jp' }));
      await pagina.click('#tab-apoyos');
      await pagina.click('#paso-descripcion-editar');
      await pagina.selectOption('#nivel-estudiante', 'superior');
      assert.equal(await texto(pagina, 'nivel-estudiante-estado'), 'Cambiaste a educación superior: 1 apoyo ya no aplica y queda guardado.');
      assert.equal(await texto(pagina, 'nivel-caso'), 'Nivel: Educación superior');
      assert.equal(await texto(pagina, 'tab-apoyos'), 'Para un estudiante');
      await pagina.close();
    }

    // Mochila en DUA, 1280 px.
    {
      const pagina = await abrir(1280);
      await pagina.check('input[name="actividad"][value="conversar"]');
      const panel = pagina.locator('#mochila');
      assert(await panel.isVisible());
      assert(await pagina.locator('#barra-continuar').isVisible());
      const paso1 = await panel.innerText();
      assert.equal(await texto(pagina, 'sel-nivel'), 'Nivel: Educación básica');
      assert.match(paso1, /Todavía no eliges nada\. Lo que elijas aparece aquí\./);
      assert.doesNotMatch(paso1, /Conversar|actividad|evidencia/i);
      assert.equal(await texto(pagina, 'continuar'), 'Ver acciones');
      assert.equal(await pagina.locator('main .boton-principal:visible').evaluateAll(b => b.map(n => n.id).join()), 'continuar');
      const medidas = await pagina.evaluate(() => ({
        panel: document.querySelector('#mochila').getBoundingClientRect().width,
        columna: document.querySelector('.columna').getBoundingClientRect().width,
        desborde: document.documentElement.scrollWidth - innerWidth
      }));
      assert(Math.abs(medidas.panel - 384) <= 2, 'Panel: ' + medidas.panel);
      assert(Math.abs(medidas.columna - 736) <= 2, 'Columna: ' + medidas.columna);
      assert(medidas.desborde <= 0);
      await foto(pagina, 'dua-paso-1.png');
      await pagina.click('#continuar');
      assert.equal(await texto(pagina, 't-seleccion'), 'Mi mochila (0)');
      await elegirPrimeros(pagina, '#tarjetas button[id^="elegir-"]', 2);
      assert.equal(await texto(pagina, 't-seleccion'), 'Mi mochila (2)');
      assert.equal(await texto(pagina, 'continuar'), 'Ir a tu selección');
      await pagina.click('#continuar');
      assert.equal(await texto(pagina, 'continuar'), 'Ver documento');
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // Mochila en «Para un estudiante», 1280 px.
    {
      const pagina = await abrir(1280, datos({ estudiantes: [jp({ nivel: 'superior' })], estudianteActivo: 'jp', perfil: { nivel: 'superior' } }));
      await pagina.click('#tab-apoyos');
      const panel = pagina.locator('#mochila');
      assert(await panel.isVisible());
      assert(await pagina.locator('#barra-continuar').isVisible());
      assert.equal(await panel.locator('[data-grupo="ejp"] > summary h3').textContent(), 'Ajustes razonables para JP');
      assert.equal(await texto(pagina, 'sel-nivel'), 'Nivel: Educación superior');
      await pagina.click('#continuar');
      await pagina.waitForFunction(() => document.querySelector('#indicador-pasos [aria-current="step"]').textContent.includes('2 Elige'));
      await elegirPrimeros(pagina, '#apoyos-resultados button[id^="elegir-"]', 2);
      assert.equal(await texto(pagina, 't-seleccion'), 'Mi mochila (2)');
      assert.equal(await panel.locator('li').count(), 2);
      assert.equal(await texto(pagina, 'continuar'), 'Ir a acuerdos');
      await foto(pagina, 'estudiante-paso-2.png');
      await pagina.click('#continuar');
      await pagina.waitForFunction(() => document.querySelector('#indicador-pasos [aria-current="step"]').textContent.includes('3 Acuerda'));
      assert.equal(await texto(pagina, 'sel-acuerdo'), 'Acuerdo: Sin acuerdos');
      assert.equal(await texto(pagina, 'continuar'), 'Guardar acuerdos');
      await foto(pagina, 'estudiante-paso-3.png');
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // Mochila en Práctica y trabajo, 1280 px.
    {
      const pagina = await abrir(1280);
      await pagina.selectOption('#nivel', 'practica-trabajo');
      await pagina.click('#trabajo-area-0');
      await pagina.locator('input[name="trabajo-dimension-1"][value="3"]').check();
      await pagina.click('#guardar-descripcion-trabajo');
      await elegirPrimeros(pagina, '#trabajo-tarjetas button[id^="elegir-"]', 1);
      const panel = pagina.locator('#mochila');
      assert(await panel.isVisible());
      assert(await pagina.locator('#barra-continuar').isVisible());
      assert.match(await panel.locator('[data-grupo^="t"] > summary h3').first().textContent(), /^Ajustes para /);
      assert.equal(await texto(pagina, 't-seleccion'), 'Mi mochila (1)');
      assert.equal(await panel.locator('li').count(), 1);
      assert.equal(await pagina.locator('main .boton-principal:visible').evaluateAll(b => b.map(n => n.id).join()), 'continuar');
      await foto(pagina, 'trabajo-paso-2.png');
      assert.deepEqual(errores, []);
      await pagina.close();
    }

    // Bajo 80 rem y en el teléfono: sin panel, con barra y sin desplazamiento horizontal.
    for (const ancho of [1000, 390]) {
      const pagina = await abrir(ancho, datos({ estudiantes: [jp()], estudianteActivo: 'jp' }));
      for (const pestana of ['dua', 'apoyos']) {
        await pagina.click('#tab-' + pestana);
        assert(!await pagina.locator('#mochila').isVisible(), `Panel visible a ${ancho} px`);
        assert(await pagina.locator('#barra-continuar').isVisible(), `Barra oculta a ${ancho} px`);
        assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Desborde a ${ancho} px`);
      }
      await pagina.close();
    }
    assert.deepEqual(errores, []);
    console.log('Correcto: nivel del caso a la vista, avisos de nivel, y «Mi mochila» como panel en DUA, Para un estudiante y Práctica y trabajo.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
