const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
execFileSync('python3', ['scripts/validar_catalogo.py'], { cwd: raiz, stdio: 'inherit' });
execFileSync('python3', ['-c', `
from copy import deepcopy
from runpy import run_path
mod = run_path("scripts/validar_catalogo.py")
fichas = deepcopy(mod["R"])
base = next(r for r in fichas if r["id"] == "dua-8-1-meta-visible")
del base["base"]
assert "dua-8-1-meta-visible: DUA sin contextos y sin base" in mod["validar_bases"](fichas)
base["base"] = True
fichas.append(dict(base, id="otra-base"))
assert "basica: más de una ficha base" in mod["validar_bases"](fichas)
base["base"] = "true"
assert "dua-8-1-meta-visible: base debe ser booleana y solo se admite en DUA de Antes" in mod["validar_bases"](fichas)
`], { cwd: raiz });

async function probar() {
  const servidor = http.createServer(async (req, res) => {
    const ruta = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!ruta.startsWith(raiz + path.sep)) return res.writeHead(403).end();
    try {
      const contenido = await fs.readFile(ruta);
      const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
      res.setHeader('Content-Type', tipos[path.extname(ruta)] || 'application/octet-stream');
      res.end(contenido);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
  let navegador;
  try {
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined });
    const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    pagina.setDefaultTimeout(8000);
    await pagina.addInitScript(() => {
      localStorage.setItem('prizma.privacidad.v1', '1');
      if (localStorage.getItem('prizma.v1')) return;
      localStorage.setItem('prizma.v1', JSON.stringify({
        perfil: { nivel: 'basica' },
        seleccion: { 'dua-8-1-meta-visible': 'Escribir la meta en la pizarra.', 'dua-9-1': '', 'dua-6-2': '', 'dua-3-4': '' },
        estudiantes: [{ id: 'jp', iniciales: 'JP', dimensiones: { 1: 3 }, seleccion: { 'acc-1-agenda': '', 'acc-1-partes': '' } }]
      }));
    });
    const nodo = id => pagina.locator('#' + id);
    await pagina.goto('http://127.0.0.1:' + servidor.address().port + '/#dua');
    await pagina.waitForFunction(() => catalogo.length > 0);
    const antes = nodo('dua-momento-antes');
    const abierta = id => antes.locator(':scope > ul > [data-accion="' + id + '"]');
    const marcar = id => pagina.locator('input[value="' + id + '"]');
    assert.equal(await antes.locator(':scope > summary').textContent(), 'Antes (11)');
    assert(!await pagina.evaluate(() => respondeAlContexto(catalogo.find(r => r.id === 'dua-8-1-meta-visible'))));
    await marcar('experimentar').check();
    assert.match(await abierta('dua-9-1').innerText(), /Anticipa lo que puede costar/);
    assert(await abierta('dua-8-1-meta-visible').isVisible());
    await marcar('experimentar').uncheck();
    await marcar('conversar').check();
    await marcar('escuchar-leer').check();
    assert.equal(await antes.locator(':scope > ul > .tarjeta').nth(2).getAttribute('data-accion'), 'dua-8-1-meta-visible');
    await nodo('meta').fill('Explicar con un ejemplo.');
    assert.match(await abierta('dua-8-1-meta-visible').locator('.meta-ficha-base:visible').textContent(), /Ya escribiste tu meta en el paso 3/);
    await nodo('meta').fill('');
    await nodo('nivel').selectOption('parvularia');
    assert(await abierta('dua-8-1-parv').isVisible());
    await nodo('nivel').selectOption('basica');

    const mochila = nodo('mochila');
    const abrir = () => nodo('abrir-mochila').click();
    const sinDesborde = contenedor => contenedor.evaluate(n =>
      document.documentElement.scrollWidth <= innerWidth && n.scrollWidth <= n.clientWidth);
    await abrir();
    assert.equal(await nodo('t-seleccion').textContent(), 'Mi mochila (6)');
    assert.equal(await nodo('sel-lista').locator('li').count(), 4);
    assert.deepEqual(await nodo('sel-lista').locator('h4').allTextContents(), ['Antes', 'Después']);
    assert.equal(await nodo('sel-lista').locator('textarea').count(), 0);
    const etiquetas = await mochila.locator('.quitar').evaluateAll(botones => botones.map(b => b.getAttribute('aria-label')));
    assert.equal(new Set(etiquetas).size, 6);
    assert(!await nodo('datos-respaldo').evaluate(n => n.open));
    assert(await sinDesborde(mochila));
    console.log('Altura de la mochila a 390 px: ' + await nodo('seleccion').evaluate(n => n.scrollHeight) + ' px.');
    await nodo('abrir-respaldo').setInputFiles({ name: 'invalido.json', mimeType: 'application/json', buffer: Buffer.from('{') });
    await nodo('respaldo-estado').waitFor({ state: 'visible' });
    assert(await nodo('datos-respaldo').evaluate(n => n.open));
    assert.match(await nodo('respaldo-estado').textContent(), /No se pudo leer|no se pudo leer/);
    await mochila.getByRole('link', { name: 'Editar en el paso 3' }).click();
    await pagina.waitForFunction(() => document.activeElement.matches('#dua-seleccion #nota-curso-dua-8-1-meta-visible'));
    await nodo('nota-curso-dua-8-1-meta-visible').fill('Mostrar un ejemplo al comenzar.');
    await abrir();
    assert.match(await nodo('sel-lista').innerText(), /Nota: Mostrar un ejemplo al comenzar/);
    const nota = nodo('sel-estudiantes').locator('details').first();
    await nota.getByText('Agregar nota', { exact: true }).click();
    await nota.locator('textarea').fill('Entregar la agenda al entrar.');
    await pagina.reload();
    await pagina.waitForFunction(() => catalogo.length > 0);
    await abrir();
    assert.equal(await nota.locator('summary').textContent(), 'Nota');
    assert(await nota.evaluate(n => n.open));
    assert.equal(await nota.locator('textarea').inputValue(), 'Entregar la agenda al entrar.');

    await pagina.evaluate(() => {
      const acciones = catalogo.filter(r => r.tipo === 'dua' && aplica(r)).slice(0, 8);
      estado.seleccion = Object.fromEntries(acciones.map(r => [r.id, '']));
      guardar();
      pintarSeleccion();
    });
    await nodo('pdf').click();
    assert(await nodo('formato-plan').isChecked());
    await nodo('formato-guion').check();
    assert(!await nodo('contenido-documento').isVisible());
    await nodo('generar-documento').click();
    await pagina.waitForSelector('#vista[open]');
    const hoja = nodo('hoja');
    assert.match(await hoja.innerText(), /☐/);
    assert.doesNotMatch(await hoja.innerText(), /Fuentes|DUA 3\.0|\bJP\b/);
    assert.equal(await hoja.locator('.h-accion').count(), 8);
    assert(await sinDesborde(nodo('vista')));
    const pdf = await pagina.evaluate(() => new Promise(resolve =>
      pdfMake.createPdf(definicionPdf()).getBuffer(bytes => resolve(Array.from(bytes)))));
    const paginas = (Buffer.from(pdf).toString('latin1').match(/\/Type\s+\/Page\b/g) || []).length;
    assert.equal(paginas, 1);
    console.log('Guion de clase con ocho acciones de básica: ' + paginas + ' página A4.');

    await pagina.keyboard.press('Escape');
    await abrir();
    await nodo('pdf').click();
    assert(await nodo('formato-guion').isChecked());
    await nodo('formato-plan').check();
    await marcar('alumno:jp').check();
    await nodo('generar-documento').click();
    await pagina.waitForSelector('#vista[open]');
    const privacidad = 'Contiene iniciales y situaciones, no diagnósticos.';
    const dato = /DUA 3\.0 · \d+\.\d+ · (Compromiso|Representación|Acción y expresión)/;
    const vista = await hoja.innerText();
    const modeloPdf = await pagina.evaluate(() => JSON.stringify(definicionPdf()));
    for (const texto of [vista, modeloPdf]) {
      assert.doesNotMatch(texto, /Sin información|Le ayuda/);
      assert.match(texto, dato);
      assert(texto.includes(privacidad));
      assert(texto.includes('JP'));
      assert(texto.indexOf(privacidad) < texto.indexOf('Fuentes'));
    }
    assert(await hoja.locator('strong').filter({ hasText: privacidad }).isVisible());
    assert(await sinDesborde(nodo('vista')));
    assert(await pagina.evaluate(() => !Object.hasOwn(JSON.parse(localStorage.getItem('prizma.v1')), 'formatoDocumento')));

    await pagina.keyboard.press('Escape');
    await pagina.reload();
    await pagina.waitForFunction(() => catalogo.length > 0);
    await pagina.evaluate(() => { estado.estudiantes = []; pintarSeleccion(); });
    await abrir();
    await nodo('pdf').click();
    assert(await nodo('formato-guion').isChecked());
    await nodo('cancelar-documento').click();
    await pagina.evaluate(() => { estado.seleccion = {}; pintarSeleccion(); prepararDocumento(); });
    assert(await nodo('formato-guion').isDisabled());
    assert.equal(await nodo('guion-ayuda').textContent(), 'Elige acciones para todo el curso para armar el guion.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
