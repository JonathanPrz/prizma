const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const jp = {
  id: 'jp', iniciales: 'JP', nivel: 'basica', dimensiones: { 1: 1, 2: 3 },
  modalidad: 'ampliacion', ayuda: 'Tener a mano un ejemplo resuelto.', paci: true, paec: true, dec: true,
  seleccion: { 'acc-2-audio': 'Nota privada docente', 'acc-1-partes': '', 'acc-6-braille': '' },
  acuerdo: { revision: '2026-12-15', criterio: 'Completa la primera parte de la tarea.' }
};
const am = { id: 'am', iniciales: 'AM', nivel: 'superior', dimensiones: { 1: 2 } };
const lc = { ...jp, id: 'lc', iniciales: 'LC', nivel: 'media', paci: false, seleccion: {}, acuerdo: {}, voz: 'Prefiere leer con alguien.' };

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
  const url = 'http://127.0.0.1:' + servidor.address().port;
  let navegador;
  try {
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined });
    const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    pagina.setDefaultTimeout(8000);
    await pagina.addInitScript(datos => {
      localStorage.setItem('prizma.privacidad.v1', '1');
      localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      if (!localStorage.getItem('prizma.v1')) localStorage.setItem('prizma.v1', JSON.stringify(datos));
    }, {
      perfil: { nivel: 'basica' }, estudiantes: [jp, am, lc], estudianteActivo: 'jp',
      trabajadores: [{ id: 'pr', iniciales: 'PR', etapa: 'practica', descripcionGuardada: true, dimensiones: { 1: 2 }, seleccion: { 'pp-c-pasos': '' } }], trabajadorActivo: 'pr'
    });
    await pagina.goto(url + '/#dua');
    await pagina.waitForFunction(() => catalogo.length > 0);
    const nodo = id => pagina.locator('#' + id);
    const abrir = async () => { await nodo('abrir-mochila').click(); await nodo('pdf').click(); };
    const generar = async () => { await nodo('generar-documento').click(); await pagina.waitForSelector('#vista[open]'); };
    const hoja = nodo('hoja'), opcion = nodo('formato-familia');
    const casillas = nodo('opciones-familia').getByRole('checkbox');
    const buffer = async () => Buffer.from(await pagina.evaluate(() => new Promise(resolve =>
      pdfMake.createPdf(definicionPdf()).getBuffer(bytes => resolve(Array.from(bytes))))));
    const paginas = bytes => (bytes.toString('latin1').match(/\/Type\s+\/Page\b/g) || []).length;

    await abrir();
    assert(await opcion.isEnabled());
    await opcion.check();
    assert(!await nodo('opciones-documento').isVisible());
    assert.equal(await casillas.count(), 2);
    for (const nombre of ['JP', 'LC']) assert(await nodo('opciones-familia').getByRole('checkbox', { name: nombre }).isChecked());
    assert.equal(await nodo('opciones-familia').getByRole('checkbox', { name: 'AM' }).count(), 0);
    await casillas.nth(0).uncheck();
    await casillas.nth(1).uncheck();
    await nodo('generar-documento').click();
    assert.equal(await nodo('error-documento').textContent(), 'Elige al menos un estudiante.');
    await casillas.nth(0).check();
    await generar();

    const texto = await hoja.innerText();
    const situaciones = await hoja.locator('ul').first().locator('li').allTextContents();
    assert.deepEqual(situaciones, [
      'Cuando debe leer textos largos, copiar de la pizarra, escribir a mano o calcular de memoria.',
      'Cuando hay tareas de muchos pasos, instrucciones largas, cambios de rutina sin aviso o debe empezar una tarea.'
    ]);
    const apoyos = await hoja.locator('ul').nth(1).locator('li').allTextContents();
    assert.equal(apoyos.length, 2);
    assert(apoyos.includes('Lee en voz alta los enunciados o entrégalos en audio'));
    const definicion = await pagina.evaluate(() => definicionPdf());
    const tituloApoyos = 'Qué haremos en el colegio';
    const aclaracion = 'Estas son las indicaciones para el equipo del colegio. No tienen que hacerlas en casa.';
    assert(texto.replace(/\s+/g, ' ').includes([tituloApoyos, aclaracion, apoyos[0]].join(' ')));
    const indiceApoyos = definicion.content.findIndex(n => n.text === tituloApoyos);
    assert(indiceApoyos >= 0);
    assert.deepEqual(definicion.content.slice(indiceApoyos + 1, indiceApoyos + 3), [{ text: aclaracion, style: 'aclaracion', margin: [0, 0, 0, 3] }, { ul: apoyos }]);
    for (const contenido of [texto, JSON.stringify(definicion.content)]) {
      assert.doesNotMatch(contenido, /Lo que nos contaron|Barreras y facilitadores|Adecuaciones de acceso|DUA 3\.0|Fuentes|Nota privada docente|PAEC|\bDEC\b/);
      assert.match(contenido, /Tiene un Plan de Adecuación Curricular Individual \(PACI\)\. Pueden pedir verlo\./);
      assert.match(contenido, /Próxima conversación: 15 de diciembre de 2026/);
      assert.match(contenido, /Tener a mano un ejemplo resuelto/);
    }
    assert(definicion.content.some(n => JSON.stringify(n.ul) === JSON.stringify(situaciones)));
    assert(definicion.content.some(n => JSON.stringify(n.ul) === JSON.stringify(apoyos)));
    assert.equal(definicion.content.filter(n => n.canvas?.[0]?.lineWidth === .5 && n.margin[1] === 22).length, 2);
    assert.equal(await hoja.locator('.h-familia-linea').count(), 2);
    assert.match(texto, /Lo completamos juntos en la reunión\./);
    assert(definicion.defaultStyle.fontSize >= 11.5);
    assert(await nodo('vista').evaluate(n => n.scrollWidth <= n.clientWidth && document.documentElement.scrollWidth <= innerWidth));
    const descarga = pagina.waitForEvent('download');
    await nodo('descargar').click();
    assert.match((await descarga).suggestedFilename(), /^prizma-familia-\d{4}-\d{2}-\d{2}\.pdf$/);
    await pagina.keyboard.press('Escape');

    await abrir();
    assert(await opcion.isChecked());
    await generar();
    assert.equal(paginas(await buffer()), 2);
    const segundaHoja = hoja.locator('.h-familia').nth(1);
    assert.match(await segundaHoja.innerText(), /Apoyos para LC[\s\S]*Lo que nos contaron[\s\S]*Prefiere leer con alguien/);
    assert.doesNotMatch(await segundaHoja.innerText(), /PACI/);
    assert.match(await segundaHoja.innerText(), /Próxima conversación: _+[\s\S]*Qué esperamos ver: _+/);
    assert(!(await segundaHoja.innerText()).includes(aclaracion));
    assert.equal(await segundaHoja.getByRole('heading', { name: tituloApoyos }).count(), 0);
    const contenidoDosCasos = await pagina.evaluate(() => definicionPdf().content);
    assert.equal(contenidoDosCasos.filter(n => n.pageBreak === 'before').length, 1);
    const segundaPagina = contenidoDosCasos.findIndex(n => n.pageBreak === 'before');
    assert(segundaPagina > 0);
    assert(!contenidoDosCasos.slice(segundaPagina).some(n => n.text === aclaracion || n.text === tituloApoyos));
    await pagina.keyboard.press('Escape');

    await pagina.evaluate(() => {
      const caso = estado.estudiantes.find(e => e.id === 'jp');
      caso.dimensiones = { 1: 3, 2: 3, 3: 2, 4: 2, 5: 1, 6: 1 };
      caso.seleccion = Object.fromEntries(catalogo.filter(r => r.tipo === 'acceso' && aplica(r, caso) && compatibleModalidad(r, caso))
        .sort((a, b) => b.titulo.length - a.titulo.length).slice(0, 8).map(r => [r.id, '']));
      caso.voz = 'Le gusta repasar un ejemplo al empezar.';
    });
    await abrir();
    await casillas.nth(1).uncheck();
    await generar();
    assert.equal(await hoja.locator('ul').nth(0).locator('li').count(), 6);
    assert.equal(await hoja.locator('ul').nth(1).locator('li').count(), 6);
    assert.match(await hoja.innerText(), /El plan completo tiene 8 apoyos\./);
    const referencia = await buffer();
    assert.equal(paginas(referencia), 1);
    console.log('Resumen de caso denso: 6 situaciones, 6 de 8 apoyos y', paginas(referencia), 'páginas A4.');
    await pagina.keyboard.press('Escape');

    await pagina.evaluate(() => {
      estado.estudiantes = estado.estudiantes.filter(e => e.id === 'am');
      estado.estudianteActivo = 'am';
      pintarSeleccion();
    });
    await abrir();
    assert(await opcion.isDisabled());
    assert.equal(await nodo('familia-ayuda').textContent(), 'Agrega un caso de parvularia, básica o media para armar el resumen.');
    await nodo('cancelar-documento').click();

    await nodo('nivel').selectOption('practica-trabajo');
    await nodo('abrir-mochila').click();
    await nodo('pdf-trabajo').click();
    assert(!await opcion.isVisible());
    await pagina.keyboard.press('Escape');
    await nodo('preparar-centro').click();
    assert(await nodo('documento-centro').isVisible());
    assert(!await opcion.isVisible());
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
