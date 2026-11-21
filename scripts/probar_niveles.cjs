const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const casos = [
  { id: 'jp', iniciales: 'JP', dimensiones: { 1: 3, 2: 2, 3: 1 }, descripcionGuardada: true,
    seleccion: { 'obj-priorizacion': 'Mantener esta nota' } },
  { id: 'am', iniciales: 'AM', nivel: 'superior', dimensiones: { 1: 2, 2: 3 }, descripcionGuardada: true, seleccion: {} }
];
const antiguo = { app: 'prizma', version: 2, ambito: 'educacion', perfil: { nivel: '' },
  seleccion: {}, estudiantes: casos, estudianteActivo: 'jp' };

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
    navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || undefined, args: ['--no-sandbox'] });
    const pagina = await navegador.newPage({ viewport: { width: 390, height: 850 }, reducedMotion: 'reduce' });
    pagina.setDefaultTimeout(8000);
    const errores = [];
    pagina.on('pageerror', error => errores.push(error.message));
    const dialogos = [];
    pagina.on('dialog', dialogo => { dialogos.push(dialogo.message()); return dialogo.accept(); });
    await pagina.addInitScript(datos => {
      if (!localStorage.getItem('prizma.v1')) localStorage.setItem('prizma.v1', JSON.stringify(datos));
      localStorage.setItem('prizma.privacidad.v1', '1');
    }, antiguo);
    await pagina.goto(url);
    await pagina.waitForSelector('#contexto');
    const nodo = id => pagina.locator('#' + id);
    const general = nodo('nivel'), nivel = nodo('nivel-estudiante'), resultados = nodo('estudiante');
    const estadoCaso = () => pagina.evaluate(() => estudianteActual());
    assert.equal(await general.inputValue(), 'basica');
    assert.equal(await general.locator('option').count(), 5);
    assert.equal(await pagina.getByRole('option', { name: 'Sin indicar' }).count(), 0);

    await nodo('tab-apoyos').click();
    assert(!await general.isVisible());
    assert.equal(await nivel.inputValue(), 'basica');
    assert.equal(await nivel.locator('option').count(), 4);
    assert.equal(await nodo('apoyos-adicionales').count(), 0);
    assert.match(await nodo('t-apoyos').textContent(), /Apoyos sugeridos/);
    const visibles = await resultados.locator('.aviso-apoyos:visible').count();
    const ayudas = await resultados.locator('.ayuda:visible').count();
    console.log('Avisos visibles en básica a 390 px con tres situaciones: ' + visibles + ' alertas y ' + ayudas + ' ayudas.');
    assert.equal(await nodo('objetivos').locator('summary').first().textContent(), 'Si el acceso no basta (13)');
    assert.equal(await nodo('desregulacion').locator('summary').first().textContent(), 'Si hay una crisis (9)');
    assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

    const paci = pagina.getByRole('checkbox', { name: /^Tiene PACI/ });
    assert.equal(await paci.count(), 1);
    assert.equal(await nodo('objetivos').evaluate(n => n.open), false);
    await paci.check();
    assert.equal(await nodo('objetivos').evaluate(n => n.open), true);
    assert.equal(await nodo('carpetas-estudiante-estado').textContent(), 'Se abrió "Si el acceso no basta"');
    await nodo('objetivos').locator('summary').first().click();
    await pagina.evaluate(() => pintarApoyos());
    assert.equal(await nodo('objetivos').evaluate(n => n.open), false);
    await paci.uncheck();
    await paci.check();
    assert.equal(await nodo('objetivos').evaluate(n => n.open), true);

    await nodo('paso-descripcion-editar').click();
    await nivel.selectOption('media');
    assert.equal(await nodo('nivel-estudiante-estado').textContent(), 'Cambiaste a educación media.');
    assert.match(await nodo('objetivos-media').innerText(), /Decreto 67, art. 5/);
    await nivel.selectOption('basica');
    const situacion5 = pagina.locator('input[name="dimension-5"][value="2"]');
    await situacion5.evaluate(n => { if (n.closest('[hidden]')) n.closest('[hidden]').previousElementSibling.click(); });
    await situacion5.check();
    assert.equal(await nodo('desregulacion').evaluate(n => n.open), true);
    assert.equal(await nodo('carpetas-estudiante-estado').textContent(), 'Se abrió "Si hay una crisis"');
    const crisis = nodo('desregulacion').locator('summary').first();
    await crisis.click();
    await nodo('ir-crisis').click();
    assert(await crisis.evaluate(n => n === document.activeElement && n.parentElement.open));

    await nivel.selectOption('superior');
    assert.equal(await nodo('nivel-estudiante-estado').textContent(), 'Cambiaste a educación superior: 1 apoyo ya no aplica y queda guardado.');
    assert.equal((await estadoCaso()).seleccion['obj-priorizacion'], 'Mantener esta nota');
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Sin acuerdos');
    assert(!await nodo('acuerdos-revisar').isVisible());
    assert.equal(await nodo('n-sel').textContent(), '0');
    const plan = await pagina.evaluate(() => documento({ curso: false, estudiantes: ['jp', 'am'] }));
    assert(plan.grupos.every(g => g.nivel === 'superior'));
    assert(plan.grupos.every(g => g.acciones.every(r => r.id !== 'obj-priorizacion')));
    assert.match(await nodo('t-apoyos').textContent(), /Ajustes razonables/);
    for (const id of ['objetivos','desregulacion','ir-crisis','documentos-estudiante']) assert(!await nodo(id).isVisible(), id);
    assert.match(await nodo('crisis-superior').textContent(), /protocolo de tu institución/);
    const sup = await pagina.evaluate(() => accesosVisibles().map(r => r.id));
    await nivel.selectOption('basica');
    assert.notDeepEqual(await pagina.evaluate(() => accesosVisibles().map(r => r.id)), sup);
    assert.equal(await nodo('elegir-obj-priorizacion').getAttribute('aria-pressed'), 'true');
    assert.equal(await nodo('nivel-estudiante-estado').textContent(), 'Cambiaste a educación básica.');
    await nodo('roles-acuerdo').locator('input[value="familia"]').check();
    await nodo('roles-acuerdo').locator('input[value="pie"]').check();
    await nodo('fecha-acuerdo').fill('2026-11-18');
    await nodo('revision-acuerdo').fill('2026-12-18');
    await nodo('criterio-acuerdo').fill('Resuelve dos ejercicios con el apoyo acordado.');
    await nodo('guardar-acuerdos').click();
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Acuerdos completos');
    await nivel.selectOption('superior');
    assert.equal((await estadoCaso()).acuerdo.estado, 'por-revisar');
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Por revisar');
    assert(await nodo('acuerdos-revisar').isVisible());
    assert.match(await nodo('acuerdos-revisar').textContent(), /Cambiaste el caso después del acuerdo\. Revisa los acuerdos\.$/);
    await nivel.selectOption('basica');
    await nivel.selectOption('parvularia');
    assert.match(await nodo('nivel-estudiante-estado').textContent(), /^Cambiaste a educación parvularia\b.*\.$/);
    assert(!await nodo('objetivos').isVisible());
    assert(await nodo('desregulacion').isVisible());
    assert.match(await nodo('objetivos-parvularia').innerText(), /Decreto 83/);
    await nodo('estudiante-am').click();
    assert.equal(await nivel.inputValue(), 'superior');
    assert.match(await nodo('t-apoyos').textContent(), /Ajustes razonables.*AM/);
    await nodo('tab-dua').click();
    await general.selectOption('media');
    assert.deepEqual(await pagina.evaluate(() => estado.estudiantes.map(e => e.nivel)), ['parvularia', 'superior']);
    assert.deepEqual(dialogos, []);

    await nodo('abrir-mochila').click();
    const respaldo = { ...antiguo, perfil: { nivel: 'media' },
      estudiantes: casos.map(({ nivel, ...caso }) => caso) };
    await nodo('abrir-respaldo').setInputFiles({
      name: 'antiguo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(respaldo))
    });
    await pagina.waitForFunction(() => document.querySelector('#respaldo-estado').textContent.startsWith('Respaldo abierto'));
    assert.deepEqual(await pagina.evaluate(() => estado.estudiantes.map(e => e.nivel)), ['media', 'media']);
    assert.equal((await estadoCaso()).seleccion['obj-priorizacion'], 'Mantener esta nota');
    assert.equal((await estadoCaso()).acuerdo.estado, 'sin-acuerdos');
    assert.deepEqual(errores, []);
    console.log('Correcto: nivel individual, migración y respaldo sin pérdidas, carpetas y foco, y reflujo a 390 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
