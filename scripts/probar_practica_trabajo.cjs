const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const acuerdo = {
  roles: ['estudiante'], fecha: '2026-11-20', revision: '2026-12-04',
  criterio: 'Completa la tarea con el apoyo elegido.', estado: 'completo'
};
const estudiante = {
  id: 'escolar', iniciales: 'JP', dimensiones: { 1: 3, 13: 2 },
  descripcionGuardada: true, acuerdo, seleccion: { 'acc-1-agenda': 'Nota educativa' }
};
const base = {
  app: 'prizma', version: 2, ambito: 'educacion', pestana: 'apoyos',
  perfil: { nivel: 'basica', meta: 'Meta de la clase', actividad: ['crear'], evidencia: ['grupo'] },
  claseGuardada: true, seleccion: { 'dua-6-2': 'Nota DUA' }, estudiantes: [estudiante]
};
const legado = {
  ...base, ambito: 'trabajo', perfil: { nivel: 'superior' },
  estudiantes: [{
    ...estudiante, ayuda: 'Ayuda reservada', voz: 'Voz reservada', practicaProfesional: true,
    seleccion: { 'sup-tiempo': 'Conservar en Educación', 'pp-c-pasos': 'Nota que se mueve', 'pp-plan-superior': '' }
  }],
  trabajadores: [{ id: 'previo', iniciales: 'AB', seleccion: { 'tr-subtitulos': 'Nota laboral' } }]
};

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
    const errores = [], confirmaciones = [];
    pagina.on('pageerror', error => errores.push(error.message));
    let cancelarConfirmacion = false;
    pagina.on('dialog', dialogo => {
      confirmaciones.push(dialogo.message());
      return cancelarConfirmacion ? dialogo.dismiss() : dialogo.accept();
    });
    const campo = id => pagina.locator('#' + id);
    const listo = () => pagina.waitForFunction(() => catalogo.length && !document.querySelector('#contexto').hidden);
    async function abrir(datos) {
      await pagina.goto(url);
      await listo();
      await pagina.evaluate(datos => {
        localStorage.setItem('prizma.v1', JSON.stringify(datos));
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      }, datos);
      await pagina.reload();
      await listo();
    }
    async function elegir(id) {
      await campo('elegir-' + id).evaluate(boton => {
        for (let nodo = boton.parentElement; nodo; nodo = nodo.parentElement) {
          if (nodo.tagName === 'DETAILS') nodo.open = true;
        }
      });
      await campo('elegir-' + id).click();
    }

    await abrir(base);
    const escuela = () => pagina.evaluate(() => ({
      perfil: estado.perfil, seleccion: estado.seleccion, claseGuardada: estado.claseGuardada,
      estudiantes: estado.estudiantes, acuerdo: estadoCaso(estudianteActual())
    }));
    const antes = await escuela();
    assert.equal(antes.acuerdo, 'Acuerdos completos');
    assert.deepEqual(await campo('nivel').locator('option:not([value=""])').evaluateAll(opciones => opciones.map(o => o.value)),
      ['parvularia', 'basica', 'media', 'superior', 'practica-trabajo']);
    await campo('nivel').selectOption('practica-trabajo');
    assert(await campo('nivel-campo').isVisible());
    assert(await campo('nivel-ayuda').isVisible());
    assert(await campo('panel-trabajo').isVisible());
    assert(!await campo('panel-dua').isVisible());
    assert.deepEqual(await escuela(), antes);
    await campo('nivel').selectOption('basica');
    assert(await campo('panel-dua').isVisible());
    assert.deepEqual(await escuela(), antes);
    assert.deepEqual(confirmaciones, []);

    await campo('nivel').selectOption('practica-trabajo');
    assert.equal(await campo('trabajo-etapa').inputValue(), 'trabajo');
    assert(!await campo('trabajo-nivel-origen-campo').isVisible());
    await campo('trabajo-etapa').selectOption('practica');
    assert(await campo('trabajo-nivel-origen-campo').isVisible());
    await campo('trabajo-iniciales').fill('PQ');
    await campo('trabajo-area-0').click();
    await pagina.locator('input[name="trabajo-dimension-1"][value="3"]').check();
    await campo('trabajo-area-3').click();
    await pagina.locator('input[name="trabajo-dimension-13"][value="2"]').check();
    await campo('guardar-descripcion-trabajo').click();
    assert.equal(await campo('elegir-pp-plan').count(), 1);
    assert.equal(await campo('elegir-pp-visita').count(), 1);
    assert.equal(await pagina.locator('[id^="elegir-tr-"]').count(), 0);
    await campo('trabajo-seguridad').getByRole('button').click();
    assert.equal(await pagina.evaluate(() => document.activeElement.id), 'elegir-pp-seguridad');

    await campo('trabajo-descripcion-editar').click();
    await campo('trabajo-nivel-origen').selectOption('superior');
    assert.equal(await campo('elegir-pp-plan-superior').count(), 1);
    assert.equal(await campo('elegir-pp-plan').count(), 0);
    await campo('trabajo-etapa').selectOption('trabajo');
    assert.equal(await campo('elegir-tr-subtitulos').count(), 1);
    assert.equal(await pagina.locator('[id^="elegir-pp-"]').count(), 0);
    await campo('trabajo-seguridad').getByRole('button').click();
    assert.equal(await pagina.evaluate(() => document.activeElement.id), 'elegir-tr-alertas-visuales');
    await campo('trabajo-etapa').selectOption('practica');
    await elegir('pp-c-pasos');
    await elegir('pp-c-analisis');
    assert.deepEqual(await pagina.evaluate(() => Object.keys(trabajadorActual().seleccion)), ['pp-c-pasos', 'pp-c-analisis']);
    assert.deepEqual(await escuela(), antes);

    await campo('trabajo-ir-acuerdos').click();
    await pagina.getByLabel('Institución educativa (profesor tutor)', { exact: true }).check();
    await campo('trabajo-fecha').fill(acuerdo.fecha);
    await campo('trabajo-revision').fill(acuerdo.revision);
    await campo('trabajo-criterio').fill('Criterio privado del caso');
    await campo('guardar-acuerdos-trabajo').click();
    assert.match(await campo('trabajo-acuerdo-texto').textContent(), /Acuerdos completos/);
    await campo('abrir-mochila').click();
    await campo('sel-trabajadores').locator('textarea').first().fill('Nota privada del caso');
    await campo('cerrar-mochila').click();
    await campo('trabajo-acuerdo-editar').click();
    await campo('guardar-acuerdos-trabajo').click();
    await campo('abrir-mochila').click();
    assert.match(await campo('sel-trabajadores').innerText(), /PQ/);
    assert.equal(await campo('sel-trabajadores').locator('li').count(), 2);
    assert.equal(await campo('borrar').innerText(), 'Borrar los datos de Práctica y trabajo');
    await campo('pdf-trabajo').click();
    assert(await campo('documento-centro').isVisible());
    await pagina.locator('input[name="compartir-centro"][value="pp-c-analisis"]').uncheck();
    assert(await campo('ver-centro').isDisabled());
    await campo('decision-centro').check();
    await campo('ver-centro').click();
    await pagina.waitForSelector('#vista[open]');
    assert.match(await campo('hoja').innerText(), /Plan de apoyos para la práctica profesional/);
    const documento = await pagina.evaluate(() => ({
      modelo: modeloDocumento(), texto: document.querySelector('#hoja').innerText, pdf: definicionPdf()
    }));
    assert.equal(documento.modelo.acciones.length, 1);
    assert.equal(documento.modelo.borrador, false);
    assert.equal(documento.modelo.acciones[0].titulo, await pagina.evaluate(() => catalogo.find(r => r.id === 'pp-c-pasos').titulo));
    assert.match(documento.texto, /Ley 21\.719/);
    for (const privado of ['PQ', 'Criterio privado', 'Nota privada', '154 ter']) assert(!JSON.stringify(documento).includes(privado), privado);
    await campo('cerrar').click();
    await campo('privacidad').click();
    assert.match(await campo('privacidad-textos').innerText(), /Ley 21\.719/);
    assert.doesNotMatch(await campo('privacidad-textos').innerText(), /154 ter/);
    await campo('privacidad-entendido').click();
    await campo('indicador-pasos').getByRole('link', { name: '3 Acuerda' }).click();
    assert.equal(await campo('continuar').innerText(), 'Ver documento para el centro');
    await campo('continuar').click();
    assert(await campo('documento-centro').isVisible());
    await campo('cancelar-centro').click();
    assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await pagina.reload();
    await listo();
    assert.deepEqual(await pagina.evaluate(() => trabajadorActual().acuerdo.roles), ['institucion']);
    assert.match(await campo('trabajo-acuerdo-texto').textContent(), /Acuerdos completos/);

    await campo('trabajo-descripcion-editar').click();
    const practicaAntes = await pagina.evaluate(() => trabajadorActual());
    cancelarConfirmacion = true;
    await campo('trabajo-etapa').selectOption('trabajo');
    assert.match(confirmaciones.at(-1), /Se quitarán 2 ajustes.*Preparar su primer empleo/);
    assert.equal(await campo('trabajo-etapa').inputValue(), 'practica');
    assert.deepEqual(await pagina.evaluate(() => trabajadorActual()), practicaAntes);
    cancelarConfirmacion = false;
    await campo('trabajo-etapa').selectOption('trabajo');
    assert.deepEqual(await pagina.evaluate(() => [trabajadorActual().seleccion, trabajadorActual().acuerdo.roles]), [{}, []]);
    await campo('trabajo-ir-acuerdos').click();
    await pagina.getByLabel('Persona trabajadora', { exact: true }).check();
    await campo('guardar-acuerdos-trabajo').click();
    assert.match(await campo('trabajo-acuerdo-seleccion-error').innerText(), /Elige al menos un ajuste/);
    assert.doesNotMatch(await campo('trabajo-acuerdo-texto').textContent(), /Acuerdos completos/);
    await campo('abrir-mochila').click();
    assert(await campo('sel-vacia').isVisible());
    assert.equal(await campo('n-sel').textContent(), '0');
    await campo('cerrar-mochila').click();

    await elegir('tr-subtitulos');
    await campo('guardar-acuerdos-trabajo').click();
    assert.match(await campo('trabajo-acuerdo-texto').textContent(), /Acuerdos completos/);
    await campo('abrir-mochila').click();
    assert.equal(await campo('sel-trabajadores').locator('li').count(), 1);
    assert.match(await campo('sel-trabajadores').locator('textarea').getAttribute('data-nota-clave'), /tr-subtitulos$/);
    await campo('pdf-trabajo').click();
    await pagina.locator('#opciones-documento input[name="incluir"]').check();
    await campo('generar-documento').click();
    await pagina.waitForSelector('#vista[open]');
    assert.deepEqual(await pagina.evaluate(() => modeloDocumento().grupos[0].acciones.map(r => r.id)), ['tr-subtitulos']);
    await campo('cerrar').click();

    await campo('trabajo-etapa').selectOption('practica');
    assert.match(confirmaciones.at(-1), /Se quitarán 1 ajustes/);
    assert.deepEqual(await pagina.evaluate(() => [trabajadorActual().seleccion, trabajadorActual().acuerdo.roles]), [{}, []]);
    await campo('abrir-mochila').click();
    assert(await campo('sel-vacia').isVisible());
    assert(await campo('pdf-trabajo').isDisabled());
    await campo('cerrar-mochila').click();

    await abrir({ ...base, perfil: { nivel: 'media' } });
    await campo('paso-descripcion-editar').click();
    await campo('preparar-practica').click();
    const caso = () => pagina.evaluate(() => trabajadorActual());
    const creado = await caso();
    assert.equal(creado.etapa, 'practica');
    assert.equal(creado.nivelOrigen, 'media');
    assert.equal(creado.iniciales, estudiante.iniciales);
    assert.deepEqual(creado.dimensiones, estudiante.dimensiones);
    await campo('nivel').selectOption('media');
    await campo('tab-apoyos').click();
    assert(await campo('preparar-practica').isVisible());
    await campo('preparar-practica').click();
    assert.equal((await caso()).id, creado.id);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 1);

    const llenos = Array.from({ length: 10 }, (_, i) => ({ id: 'caso-' + i, iniciales: 'A' + i, seleccion: { 'tr-subtitulos': '' } }));
    await abrir({ ...base, perfil: { nivel: 'superior' }, trabajadores: llenos });
    await campo('paso-descripcion-editar').click();
    assert(await campo('preparar-practica').isDisabled());
    assert.equal(await campo('preparar-practica-ayuda').innerText(), 'Máximo 10 casos en Práctica y trabajo');

    const coincidencia = { ...creado, id: 'practica-existente', iniciales: 'jp' };
    await abrir({ ...base, perfil: { nivel: 'superior' }, trabajadores: [...llenos.slice(0, 9), coincidencia] });
    await campo('paso-descripcion-editar').click();
    assert(await campo('preparar-practica').isEnabled());
    await campo('iniciales').fill('XX');
    assert(await campo('preparar-practica').isDisabled());
    await campo('iniciales').fill('JP');
    await campo('preparar-practica').click();
    assert.equal((await caso()).id, coincidencia.id);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 10);

    await abrir({
      ...base, perfil: { nivel: 'media' }, estudiantes: [{ ...estudiante, iniciales: '' }],
      trabajadores: [{ ...coincidencia, iniciales: '' }]
    });
    await campo('paso-descripcion-editar').click();
    await campo('preparar-practica').click();
    assert.notEqual((await caso()).id, coincidencia.id);
    assert.equal((await caso()).iniciales, '');
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 2);

    await abrir(legado);
    assert.equal(await campo('nivel').inputValue(), 'practica-trabajo');
    assert.match(await campo('migracion-practica').innerText(), /La práctica de JP ahora está/);
    const migrados = await pagina.evaluate(() => estado.trabajadores);
    assert.equal(migrados.length, 2);
    assert.deepEqual(migrados[1].seleccion, { 'pp-c-pasos': 'Nota que se mueve', 'pp-plan-superior': '' });
    assert.equal(migrados[1].nivelOrigen, 'superior');
    assert.equal(migrados[1].ayuda, 'Ayuda reservada');
    assert.equal(migrados[1].voz, 'Voz reservada');
    assert.equal(migrados[0].seleccion['tr-subtitulos'], 'Nota laboral');
    const escolarMigrado = (await escuela()).estudiantes[0];
    assert.equal(escolarMigrado.practicaProfesional, false);
    assert.deepEqual(escolarMigrado.seleccion, { 'sup-tiempo': 'Conservar en Educación' });
    await pagina.reload();
    await listo();
    assert.deepEqual(await pagina.evaluate(() => estado.trabajadores), migrados);
    assert.equal(await campo('migracion-practica').innerText(), '');

    await abrir({ ...legado, trabajadores: llenos });
    assert.match(await campo('migracion-practica').innerText(), /No se pudo pasar la práctica de JP/);
    const pendiente = (await escuela()).estudiantes[0];
    assert.equal(pendiente.practicaProfesional, true);
    assert.deepEqual(pendiente.seleccion, legado.estudiantes[0].seleccion);
    await pagina.reload();
    await listo();
    assert.equal(await campo('migracion-practica').innerText(), '');
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 10);
    assert.deepEqual((await escuela()).estudiantes[0], pendiente);

    await campo('abrir-mochila').click();
    await campo('abrir-respaldo').setInputFiles({
      name: 'respaldo-antiguo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(legado))
    });
    await pagina.waitForFunction(() => document.querySelector('#respaldo-estado').textContent.startsWith('Respaldo abierto'));
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 2);
    assert.equal(await pagina.evaluate(() => estado.trabajadores[1].seleccion['pp-c-pasos']), 'Nota que se mueve');

    await abrir({ ...legado, trabajadores: llenos });
    await campo('quitar-trabajador').click();
    await pagina.reload();
    await listo();
    assert.match(await campo('migracion-practica').innerText(), /La práctica de JP ahora está/);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 10);
    assert.equal(await pagina.evaluate(() => estado.trabajadores[9].seleccion['pp-c-pasos']), 'Nota que se mueve');
    const practica = {
      ...practicaAntes, id: 'practica-pq', nivelOrigen: 'media', ayuda: 'Instrucciones escritas',
      modalidad: 'senas', tipoPuesto: 'Bodega', voz: 'Voz reservada de práctica', compartir: 'Decisión del centro'
    };
    const contextoTrabajo = { ...base, ambito: 'trabajo', trabajadorActivo: practica.id };
    await abrir({ ...contextoTrabajo, trabajadores: [practica, { id: 'vacio', seleccion: {} }, ...llenos.slice(0, 8)] });
    const original = await caso();
    await campo('preparar-primer-empleo').click();
    const empleo = await caso();
    assert.equal(empleo.etapa, 'trabajo');
    assert.equal(empleo.origen, original.id);
    assert.equal(empleo.iniciales, original.iniciales);
    assert.deepEqual(empleo.dimensiones, original.dimensiones);
    assert.equal(empleo.ayuda, original.ayuda);
    assert.equal(empleo.modalidad, original.modalidad);
    assert.deepEqual([empleo.voz, empleo.compartir, empleo.tipoPuesto], ['', '', '']);
    assert.deepEqual(empleo.seleccion, {});
    assert.deepEqual(empleo.acuerdo, { roles: [], fecha: '', revision: '', criterio: '', estado: 'sin-acuerdos' });
    assert.equal(empleo.descripcionGuardada, false);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 10);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.some(e => e.id === 'vacio')), false);
    assert(await campo('trabajo-descripcion-cuerpo').isVisible());
    assert(await campo('primer-empleo-revisar').isVisible());
    assert.match(await campo('primer-empleo-revisar').innerText(), /Revisa estas situaciones.*Si aún es menor de edad.*Ley 21\.719/);
    assert.equal(await pagina.getByLabel('Familia o apoderado').count(), 0);
    assert.equal(await campo('trabajo-duplicadas').textContent(), '');
    assert(await campo('trabajo-historia').isVisible());
    const titulos = await campo('trabajo-historia-fichas').locator('li').allTextContents();
    assert.deepEqual(titulos, await pagina.evaluate(() => elegidasCentro(estado.trabajadores[0]).map(r => r.titulo)));
    assert.equal(titulos.length, 2);
    assert.equal(await campo('trabajo-historia-estado').textContent(), 'Estado del acuerdo de la práctica: Acuerdos completos');
    assert.match(await campo('trabajo-historia-criterio').textContent(), /Criterio privado del caso/);
    assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await campo('ver-caso-practica').click();
    assert.deepEqual(await caso(), original);
    assert.equal(await campo('trabajo-duplicadas').textContent(), '');
    await campo('preparar-primer-empleo').click();
    assert.deepEqual(await caso(), empleo);
    assert.equal(await pagina.evaluate(() => estado.trabajadores.length), 10);
    const modelos = await pagina.evaluate(({ origen, empleo }) => {
      const practica = estado.trabajadores.find(e => e.id === origen);
      const centro = documentoParaCentro(['pp-c-pasos'], true, practica);
      seccionesTrabajo = { barreras: true, voz: true, ajustes: true };
      return { centro, trabajo: documentoTrabajo([empleo]) };
    }, { origen: original.id, empleo: empleo.id });
    for (const modelo of Object.values(modelos)) {
      assert(modelo);
      assert(!JSON.stringify(modelo).includes('Ajustes acordados en su práctica'));
      assert(!JSON.stringify(modelo).includes('Criterio privado del caso'));
    }
    assert.equal(modelos.trabajo.grupos.length, 1);
    assert.equal(modelos.trabajo.grupos[0].trabajador, empleo.id);
    for (const titulo of titulos) assert(!JSON.stringify(modelos.trabajo).includes(titulo), titulo);
    assert.equal(modelos.centro.acciones.length, 1);
    const aprobado = modelos.centro.acciones[0].titulo;
    assert(titulos.includes(aprobado));
    for (const titulo of titulos.filter(titulo => titulo !== aprobado)) {
      assert(!JSON.stringify(modelos.centro).includes(titulo), titulo);
    }

    await campo('abrir-mochila').click();
    const descargado = pagina.waitForEvent('download');
    await campo('guardar-respaldo').click();
    const archivo = await (await descargado).path();
    const respaldo = JSON.parse(await fs.readFile(archivo, 'utf8'));
    assert.equal(respaldo.trabajadores.find(e => e.id === empleo.id).origen, original.id);
    const importar = async datos => {
      await campo('abrir-respaldo').setInputFiles({
        name: 'respaldo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(datos))
      });
      await pagina.waitForFunction(() => document.querySelector('#abrir-respaldo').files.length === 0);
      assert.match(await campo('respaldo-estado').textContent(), /^Respaldo abierto/);
    };
    await importar(respaldo);
    assert.equal((await caso()).origen, original.id);
    await campo('cerrar-mochila').click();
    assert(await campo('trabajo-historia').isVisible());
    await campo('trabajador-caso-0').click();
    await campo('trabajo-iniciales').fill('PQ');
    assert.match(await campo('trabajo-duplicadas').textContent(), /Ya hay una persona PQ/);
    await campo('trabajador-' + empleo.id).click();
    assert.match(await campo('trabajo-duplicadas').textContent(), /Ya hay una persona PQ/);
    await campo('ver-caso-practica').click();
    await campo('quitar-trabajador').click();
    assert.match(confirmaciones.at(-1), /Su caso de primer empleo se mantiene/);
    assert.equal((await caso()).id, empleo.id);
    assert(!Object.hasOwn(await caso(), 'origen'));
    assert(!await campo('trabajo-historia').isVisible());

    await campo('abrir-mochila').click();
    for (const origen of ['inexistente', 'caso-0', '<invalido>', empleo.id]) {
      await importar({ ...respaldo, trabajadores: respaldo.trabajadores.map(e => e.id === empleo.id ? { ...e, origen } : e) });
      assert(!Object.hasOwn(await caso(), 'origen'), origen);
      assert(!await campo('trabajo-historia').isVisible(), origen);
    }
    await campo('cerrar-mochila').click();

    await abrir({ ...contextoTrabajo, trabajadores: [practica, ...llenos.slice(0, 9)] });
    assert(await campo('preparar-primer-empleo').isDisabled());
    assert.equal(await campo('primer-empleo-ayuda').innerText(), 'Máximo 10 casos en Práctica y trabajo');
    assert.deepEqual(errores, []);
    console.log('Correcto: selector, etapas, seguridad, acuerdos, mochila, documento privado, transición al empleo, límite y migración única desde almacenamiento y respaldo, sin desborde a 390 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}

probar().catch(error => { console.error(error); process.exitCode = 1; });
