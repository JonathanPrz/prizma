const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const raiz = path.resolve(__dirname, '..');
const salida = path.join(raiz, 'docs/marca/046-correcciones');
const servidor = http.createServer((req, res) => {
  const archivo = path.resolve(raiz, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!archivo.startsWith(raiz + path.sep)) return res.writeHead(403).end();
  fs.readFile(archivo, (error, datos) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.html': 'text/html' }[path.extname(archivo)] || 'application/octet-stream');
    res.end(datos);
  });
});
(async () => {
  await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined, args: ['--no-sandbox'] });
  fs.mkdirSync(salida, { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const externos = [], errores = [];
    const origen = 'http://127.0.0.1:' + servidor.address().port;
    page.on('request', r => { if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== origen) externos.push(r.url()); });
    page.on('pageerror', e => errores.push(e.message));
    await page.goto(origen);
    await page.waitForFunction(() => catalogo.length);
    await page.evaluate(() => {
      estado = normalizarDatos({ ambito: 'educacion', pestana: 'dua', perfil: { nivel: 'basica' }, seleccion: { 'dua-1-1': '', 'dua-6-2': '' }, estudiantes: [{ id: 'uno', iniciales: 'AB', dimensiones: { 2: 3 }, descripcionGuardada: true, protocolo: true, voz: 'VOZ_PRIVADA', seleccion: { 'obj-eliminacion': '' } }] });
      mostrarPestana('dua'); sincronizarPerfil(); pintarTarjetas(); pintarSeleccion();
    });
    const migrado = await page.evaluate(() => normalizarEstudiante({ protocolo: true }));
    assert(migrado.revisarInstrumentos); assert(!migrado.paci && !migrado.paec && !migrado.dec);
    // Selection removal keeps the keyboard in the visible list.
    await page.focus('#quitar-clase-dua-6-2');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 't-seleccion-dua');
    await page.click('#documento-clase');
    assert.deepEqual(await page.locator('input[name="incluir"]:checked').evaluateAll(ns => ns.map(n => n.value)), ['curso']);
    await page.check('input[value="alumno:uno"]');
    assert((await page.locator('#error-documento').innerText()).includes('Incluirás datos'));
    await page.uncheck('input[value="alumno:uno"]');
    await page.click('#generar-documento');
    await page.waitForSelector('#vista[open]');
    assert(!(await page.locator('#hoja').innerText()).includes('VOZ_PRIVADA'));
    await page.click('#cerrar');
    const acuerdos = await page.evaluate(() => {
      const e = estudianteActual(); const r = catalogo.find(r => r.tipo === 'objetivos');
      e.seleccion = { [r.id]: '' }; e.acuerdo = { roles: ['docente'], fecha: '2026-11-19', revision: '2026-12-01', criterio: 'Reconoce las señales.', estado: 'completo' };
      const faltan = erroresAcuerdo(e); e.acuerdo.roles = ['familia', 'equipo']; const generico = erroresAcuerdo(e);
      e.acuerdo.roles = ['familia', 'pie']; return { faltan, generico, completo: erroresAcuerdo(e) };
    });
    assert(acuerdos.faltan.some(t => t.includes('Decreto 83'))); assert(acuerdos.generico.some(t => t.includes('Decreto 83'))); assert.deepEqual(acuerdos.completo, []);
    assert((await page.locator('#elegir-dua-1-1').getAttribute('aria-label')).startsWith('Elegida: '));
    assert((await page.locator('#quitar-clase-dua-1-1').getAttribute('aria-label')).endsWith(', del curso'));
    await page.evaluate(() => {
      estado.estudiantes.push({ ...estudianteActual(), id: 'dos', iniciales: 'EF' }); pintarRepeticiones();
    });
    assert(await page.locator('#barreras-repetidas').isVisible());
    await page.click('#proyectar');
    assert(!(await page.locator('#barreras-repetidas').isVisible()));
    assert(!(await page.locator('#abrir-mochila').isVisible()));
    assert.equal(await page.locator('#panel-dua .aviso-cruzado:visible').count(), 0);
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.screenshot({ path: path.join(salida, `proyeccion-${width}.png`) });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('#salir-proyeccion'); assert(await page.locator('#abrir-mochila').isVisible());
    // Walk every visible keyboard destination, including expanded groups and agreements.
    async function teclado(pestana) {
      await page.evaluate(pestana => {
        mostrarPestana(pestana);
        if (pestana === 'trabajo') { prepararTrabajo(); sincronizarTrabajo(); pintarTrabajo(); } else { sincronizarEstudiante(); pintarApoyos(); }
        document.querySelectorAll('#panel-' + pestana + ' details').forEach(d => { d.open = true; });
        document.querySelectorAll('#panel-' + pestana + ' [hidden]').forEach(n => { if (n.id.endsWith('cuerpo')) n.hidden = false; });
      }, pestana);
      await page.locator('.saltar').focus();
      const vistos = new Set();
      for (let i = 0; i < 700; i++) {
        await page.keyboard.press('Tab');
        const dato = await page.evaluate(() => {
          const n = document.activeElement, r = n.getBoundingClientRect(), b = document.querySelector('#barra-continuar');
          return { id: n.id || n.name || n.tagName, barra: b.getClientRects().length && !b.contains(n), bottom: r.bottom, top: b.getBoundingClientRect().top, dentro: !!n.closest('#panel-apoyos, #panel-trabajo') };
        });
        if (dato.barra && dato.id !== "BODY") assert(dato.bottom <= dato.top - 1, JSON.stringify(dato));
        if (dato.dentro) vistos.add(dato.id);
        if (i > 20 && dato.id === 'BODY') break;
      }
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.locator('#panel-' + pestana).scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(salida, `${pestana}-${width}.png`) });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      assert(vistos.size > 10, pestana + ': recorrido insuficiente');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      return vistos.size;
    }
    const estudiantes = await teclado('apoyos');
    await page.evaluate(() => {
      estado.trabajadores = normalizarTrabajadores([{ id: 'trabajador', iniciales: 'CD', dimensiones: { 13: 3 }, descripcionGuardada: true, voz: 'VOZ_PRIVADA', ayuda: 'AYUDA_PRIVADA', compartir: 'COMPARTIR_PRIVADO', seleccion: { 'tr-subtitulos': 'NOTA_AJUSTE' } }]); estado.trabajadorActivo = 'trabajador';
    });
    const trabajadores = await teclado('trabajo');
    await page.evaluate(() => prepararDocumentoTrabajo());
    assert.deepEqual(await page.locator('input[name="seccion-trabajo"]:checked').evaluateAll(ns => ns.map(n => n.value)), ['ajustes']);
    await page.check('input[value="trabajo:trabajador"]'); await page.click('#generar-documento'); await page.waitForSelector('#vista[open]');
    assert(!(await page.locator('#hoja').innerText()).includes('PRIVAD'));
    assert((await page.locator('#hoja').innerText()).includes('NOTA_AJUSTE'));
    assert(!(await page.evaluate(() => JSON.stringify(definicionPdf()))).includes('PRIVAD'));
    const download = page.waitForEvent('download'); await page.click('#descargar');
    const pdf = await download; await pdf.saveAs(path.join(salida, 'trabajo.pdf'));
    assert(/\/Lang\s*\(es-CL\)/.test(fs.readFileSync(path.join(salida, 'trabajo.pdf')).toString('latin1')));
    const contrastes = [];
    for (const tema of ['claro', 'oscuro']) {
      await page.evaluate(t => { document.documentElement.dataset.tema = t; }, tema);
      const colores = await page.locator('#hoja .aviso-apoyos').evaluate(n => { const s = getComputedStyle(n); return [s.color, s.backgroundColor]; });
      const lum = c => c.match(/\d+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
      const ls = colores.map(lum).sort((a, b) => b - a), contraste = (ls[0] + .05) / (ls[1] + .05);
      assert(contraste >= 4.5); contrastes.push({ tema, contraste });
    }
    for (const width of [390, 1280]) { await page.setViewportSize({ width, height: 844 }); await page.screenshot({ path: path.join(salida, `documento-${width}.png`) }); }
    await page.click('#cerrar');
    // Each independent combination is filtered in the shared HTML/PDF model.
    for (const barreras of [false, true]) for (const voz of [false, true]) for (const ajustes of [false, true]) {
      const resultado = await page.evaluate(opciones => {
        seccionesTrabajo = opciones; inclusionTrabajo = ['trabajador']; armarHoja();
        return { html: document.querySelector('#hoja').textContent, pdf: JSON.stringify(definicionPdf()) };
      }, { barreras, voz, ajustes });
      for (const texto of Object.values(resultado)) { assert.equal(texto.includes('VOZ_PRIVADA'), voz); assert.equal(texto.includes('Audición'), barreras); assert.equal(texto.includes('NOTA_AJUSTE'), ajustes); }
    }
    await page.evaluate(() => {
      const respaldo = JSON.parse(localStorage.getItem(CLAVE));
      respaldo.estudiantes[0].protocolo = true;
      localStorage.setItem(CLAVE, JSON.stringify(respaldo));
    });
    await page.reload(); await page.waitForFunction(() => catalogo.length);
    assert(await page.locator('#instrumentos-aviso').isVisible());
    assert(await page.evaluate(() => !estudianteActual().paci && !estudianteActual().paec && !estudianteActual().dec));
    await page.reload(); await page.waitForFunction(() => catalogo.length);
    assert(!(await page.locator('#instrumentos-aviso').isVisible()));
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error('Cuota'); }; guardar(); guardar(); });
    assert.equal(await page.locator('#persistencia-aviso button').count(), 1);
    assert((await page.locator('#persistencia-aviso').innerText()).includes('No se pudo guardar'));
    assert.deepEqual(externos, []); assert.deepEqual(errores, []);
    fs.writeFileSync(path.join(salida, 'resultados.json'), JSON.stringify({ externos, errores, estudiantes, trabajadores, contrastes, idiomaPdf: 'es-CL', combinaciones: 8 }, null, 2) + '\n');
    console.log('Correcto: privacidad, selección HTML/PDF, acuerdos, migración, proyección, foco móvil, contraste, idioma y persistencia.');
  } finally { await browser.close(); servidor.close(); }
})().catch(e => { console.error(e); servidor.close(); process.exitCode = 1; });
