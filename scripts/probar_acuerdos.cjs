const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const PREGUNTA = '¿Qué esperamos ver en la próxima revisión?';
const caso = (extra = {}) => ({
  id: 'sp', iniciales: 'SP', nivel: 'parvularia', descripcionGuardada: true, paci: true,
  dimensiones: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 }, ayuda: 'Una agenda con dibujos.', seleccion: {}, ...extra
});
const trabajo = { id: 'tr', iniciales: 'TR', etapa: 'trabajo', descripcionGuardada: true, dimensiones: { 1: 2 }, seleccion: { 'tr-alertas-visuales': '' } };

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
    const errores = [];
    pagina.on('pageerror', e => errores.push(e.message));
    // Cada vez que se carga la página se parte de estos datos, salvo que el caso pida conservar lo guardado.
    let inicial = { perfil: { nivel: 'media' }, estudiantes: [caso()], estudianteActivo: 'sp', trabajadores: [trabajo], trabajadorActivo: 'tr' };
    await pagina.addInitScript(datos => {
      localStorage.setItem('prizma.privacidad.v1', '1');
      localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      if (!sessionStorage.getItem('prueba-inicial')) { sessionStorage.setItem('prueba-inicial', '1'); localStorage.setItem('prizma.v1', JSON.stringify(datos)); }
    }, inicial);
    const cargar = async hash => { await pagina.goto(url + '/' + hash); await pagina.reload(); await pagina.waitForFunction(() => catalogo.length > 0); };
    const nodo = s => pagina.locator(s);
    const sinScroll = async () => assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const abrirPaso3 = async () => { await pagina.evaluate(() => { irPaso(3); abrirPaso('paso-acuerdos', true); }); };
    const guardado = () => pagina.evaluate(() => JSON.parse(localStorage.getItem('prizma.v1')));

    // Estudiante de parvularia: los dos campos nuevos y la ayuda del criterio.
    await cargar('#apoyos');
    await pagina.evaluate(() => { const e = estudianteActual(); for (const r of catalogo.filter(r => r.tipo === 'acceso' && aplica(r, e)).slice(0, 2)) e.seleccion[r.id] = ''; guardar(); });
    await abrirPaso3();
    assert.equal((await nodo('label[for="criterio-acuerdo"]').innerText()).trim(), PREGUNTA);
    const ayudaId = await nodo('#criterio-acuerdo').getAttribute('aria-describedby');
    assert(ayudaId.split(' ').includes('criterio-acuerdo-ayuda'));
    assert.equal(await nodo('#criterio-acuerdo-ayuda').innerText(), 'Algo que puedan ver o contar. Por ejemplo: «Para la próxima revisión, termina 3 de 4 guías con la tarea dividida en partes.»');
    await nodo('#revision-acuerdo').fill('2026-12-15');
    assert.match(await nodo('#criterio-acuerdo-ayuda').innerText(), /«Para el 15 de diciembre, termina 3 de 4 guías/);
    const opciones = await nodo('#coordina-acuerdo option').allTextContents();
    assert.equal(opciones[0], 'Elige una persona');
    assert(!opciones.includes('Estudiante') && !opciones.includes('Familia'));
    assert(opciones.includes('Equipo PIE'));
    assert(await nodo('#casa-acuerdo').isVisible());
    assert.match(await nodo('label[for="coordina-acuerdo"]').innerText(), /\(opcional\)/);
    assert.match(await nodo('label[for="casa-acuerdo"]').innerText(), /\(opcional\)/);
    assert.equal(await nodo('#casa-acuerdo').getAttribute('maxlength'), '300');
    assert.match(await nodo('#casa-acuerdo-ayuda').innerText(), /Acuérdenlo con la familia\. Una o dos ideas\. Sale en el resumen para la familia\./);
    assert((await nodo('#casa-acuerdo').getAttribute('aria-describedby')).includes('casa-acuerdo-ayuda'));
    await sinScroll();

    // Error del criterio vacío; coordina y casa no obligan nada.
    await nodo('#fecha-acuerdo').fill('2026-11-21');
    await nodo('input[name="rol-acuerdo"][value="familia"]').check();
    await nodo('#coordina-acuerdo').selectOption('pie');
    await nodo('#casa-acuerdo').fill('Usar la agenda con dibujos antes de las tareas.');
    await nodo('#guardar-acuerdos').click();
    assert.equal(await nodo('#acuerdo-criterio-error').innerText(), 'Escribe qué esperan ver en la próxima revisión (máximo 200 caracteres).');
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Sin acuerdos');
    await nodo('#criterio-acuerdo').fill('Termina 3 de 4 guías con la tarea dividida.');
    await nodo('#guardar-acuerdos').click();
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Acuerdos completos');
    await sinScroll();

    // Sin coordina ni casa el acuerdo sigue completo.
    await pagina.evaluate(() => { const a = estudianteActual().acuerdo; a.coordina = ''; a.casa = ''; });
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Acuerdos completos');

    // Cambiarlos después de un acuerdo completo marca "Por revisar".
    await pagina.evaluate(() => { guardarAcuerdos(); });
    await abrirPaso3();
    await nodo('#casa-acuerdo').fill('Leer un cuento con pictogramas.');
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Por revisar');
    await nodo('#guardar-acuerdos').click();
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Acuerdos completos');
    await abrirPaso3();
    await nodo('#coordina-acuerdo').selectOption('jefatura');
    assert.equal(await pagina.evaluate(() => estadoCaso(estudianteActual())), 'Por revisar');
    await nodo('#guardar-acuerdos').click();

    // Se guardan, sobreviven a recargar y a un respaldo.
    let acuerdo = (await guardado()).estudiantes[0].acuerdo;
    assert.equal(acuerdo.coordina, 'jefatura');
    assert.equal(acuerdo.casa, 'Leer un cuento con pictogramas.');
    await pagina.reload(); await pagina.waitForFunction(() => catalogo.length > 0);
    await abrirPaso3();
    assert.equal(await nodo('#coordina-acuerdo').inputValue(), 'jefatura');
    assert.equal(await nodo('#casa-acuerdo').inputValue(), 'Leer un cuento con pictogramas.');
    const vuelta = await pagina.evaluate(() => {
      const respaldo = JSON.parse(JSON.stringify(estado));
      return normalizarEstudiante(respaldo.estudiantes[0]).acuerdo;
    });
    assert.equal(vuelta.coordina, 'jefatura');
    assert.equal(vuelta.casa, 'Leer un cuento con pictogramas.');

    // Valores inválidos se descartan; un respaldo antiguo se abre sin errores y sin cambios.
    const normal = await pagina.evaluate(() => [
      normalizarAcuerdo({ coordina: 'familia', casa: 5 }), normalizarAcuerdo({ coordina: 'estudiante' }), normalizarAcuerdo({ coordina: 'x'.repeat(5), casa: 'c'.repeat(400) }),
      normalizarAcuerdo({ roles: ['familia'], fecha: '2026-11-01', revision: '2026-12-01', criterio: 'Algo.', estado: 'completo' })]);
    assert.deepEqual([normal[0].coordina, normal[0].casa, normal[1].coordina, normal[2].coordina], ['', '', '', '']);
    assert.equal(normal[2].casa.length, 300);
    assert.deepEqual([normal[3].coordina, normal[3].casa, normal[3].estado], ['', '', 'completo']);
    assert.deepEqual(errores, []);

    // Superior: no aparece "casa" ni se ofrece a quienes no corresponden.
    await pagina.evaluate(() => { estudianteActual().nivel = 'superior'; guardar(); sincronizarAcuerdos(); });
    assert(!await nodo('#casa-acuerdo').isVisible());
    const superior = await nodo('#coordina-acuerdo option').allTextContents();
    assert(!superior.includes('Estudiante') && !superior.includes('Familia'));
    await pagina.evaluate(() => { estudianteActual().nivel = 'parvularia'; guardar(); sincronizarAcuerdos(); });

    // Práctica y trabajo: solo cambian el nombre y la ayuda.
    await cargar('#trabajo');
    await pagina.evaluate(() => { abrirPaso('trabajo-acuerdo', true); });
    assert.equal((await nodo('label[for="trabajo-criterio"]').innerText()).trim(), PREGUNTA);
    assert((await nodo('#trabajo-criterio').getAttribute('aria-describedby')).split(' ').includes('trabajo-criterio-ayuda'));
    assert.match(await nodo('#trabajo-criterio-ayuda').innerText(), /«Para la próxima revisión, completa los turnos de la semana sin perder instrucciones\.»/);
    await nodo('#trabajo-revision').fill('2026-12-15');
    assert.match(await nodo('#trabajo-criterio-ayuda').innerText(), /«Para el 15 de diciembre, completa los turnos de la semana sin perder instrucciones\.»/);
    assert.equal(await nodo('#acuerdos-trabajo #coordina-acuerdo, #acuerdos-trabajo #casa-acuerdo').count(), 0);
    await sinScroll();
    await nodo('#guardar-acuerdos-trabajo').click();
    assert.equal(await nodo('#trabajo-acuerdo-criterio-error').innerText(), 'Escribe qué esperan ver en la próxima revisión (máximo 200 caracteres).');

    // Documentos con el caso de referencia: parvularia, 5 situaciones, 17 apoyos, curso sin acciones y nivel general media.
    await cargar('#apoyos');
    await pagina.evaluate(async () => {
      const e = estudianteActual();
      for (const r of catalogo.filter(r => r.tipo === 'acceso' && aplica(r, e)).sort((a, b) => puntaje(b, e) - puntaje(a, e)).slice(0, 17)) e.seleccion[r.id] = '';
      e.acuerdo = normalizarAcuerdo({ roles: ['familia', 'equipo'], fecha: '2026-11-21', revision: '2026-12-15', criterio: 'Termina 3 de 4 guías.', coordina: 'pie', casa: 'Usar la agenda con dibujos antes de las tareas.', estado: 'completo' });
      inclusionDocumento = { curso: true, estudiantes: ['sp'] };
      await cargarScript('vendor/pdfmake/pdfmake.min.js'); await cargarScript('vendor/pdfmake/vfs_fonts.js');
    });
    assert.equal(await pagina.evaluate(() => elegidasOrdenadas(estudianteActual().seleccion, estudianteActual()).length), 17);
    const plan = await pagina.evaluate(() => { armarHoja(); return { hoja: $('#hoja').innerText, pdf: JSON.stringify(definicionPdf()), modelo: documento() }; });
    for (const texto of [plan.hoja, plan.pdf]) {
      assert(!texto.includes('Acciones para todo el curso'));
      assert(!texto.includes('Nivel del curso') && texto.includes('Documentos'), 'un curso sin contenido no muestra su nivel');
      assert(!texto.includes('No informado'));
      assert(texto.includes('Apoyos (n.º de ficha)'));
      assert(texto.includes('Coordina: Equipo PIE') && texto.includes('Qué probarán en casa: Usar la agenda'));
      assert(texto.includes(PREGUNTA));
    }
    assert(/Documentos\s*PACI/.test(plan.hoja));
    assert(!plan.hoja.includes('Tiene PACI'));
    const cif = plan.modelo.grupos.at(-1).cif;
    assert.equal(cif.length, 5);
    for (const fila of cif) assert.match(fila[2], /^\d+(, \d+)*$|^Sin apoyo elegido$/);
    assert.equal(plan.modelo.grupos.at(-1).acciones[0].numero, 1);
    assert(plan.hoja.includes('1. ' + plan.modelo.grupos.at(-1).acciones[0].titulo));
    // Cada título de ficha numerado no aparece repetido en la tabla de barreras.
    assert(!cif.some(fila => fila[2].includes(plan.modelo.grupos.at(-1).acciones[0].titulo)));
    const definicion = JSON.parse(plan.pdf);
    const tablas = definicion.content.filter(n => n.table?.headerRows === 1);
    assert(tablas.length >= 2);
    assert.equal(tablas.filter(n => n.table.dontBreakRows).length, 1);
    // Tarea 075: márgenes, tamaños, color de h2, keepWithNext y encabezados de tabla repetidos.
    assert.deepEqual(definicion.pageMargins, [51, 60, 51, 54]);
    assert.deepEqual([definicion.defaultStyle.fontSize, definicion.defaultStyle.color, definicion.defaultStyle.lineHeight], [10.5, '#1a2134', 1.15]);
    const { h1, h2, h3, dato } = definicion.styles;
    assert.deepEqual([h1.fontSize, h2.fontSize, h2.color, h3.fontSize, h3.color, dato.fontSize, dato.color], [22, 15, '#2456d6', 11.5, '#1a2134', 8.5, '#4f586e']);
    assert.deepEqual(h2.margin, [0, 14, 0, 6]);
    for (const e of [h1, h2, h3]) assert.equal(e.keepWithNext, true);
    const filete = definicion.content.find(n => n.canvas?.[0]?.lineColor === '#2456d6');
    assert.deepEqual([filete.canvas[0].x2, filete.canvas[0].lineWidth], [40, 1.5]);
    const todasTablas = definicion.content.filter(n => n.table && n.table.body.length > 1);
    for (const t of todasTablas.filter(n => n.table.widths.length > 1)) assert.equal(t.table.headerRows, 1);
    // Con curso y acciones DUA sí sale el título; y el primer estudiante no empieza hoja nueva si solo hay tabla antes.
    assert(!definicion.content.find(n => n.text === 'Apoyos para SP').pageBreak);
    assert(definicion.content.some(n => n.pageBreak === 'before' && n.text === 'Fuentes'));
    const conCurso = await pagina.evaluate(() => {
      estado.seleccion[catalogo.find(r => r.tipo === 'dua').id] = '';
      const d = JSON.stringify(definicionPdf()); delete estado.seleccion[catalogo.find(r => r.tipo === 'dua').id];
      armarHoja(); return d;
    });
    assert(conCurso.includes('Acciones para todo el curso'));
    assert(JSON.parse(conCurso).content.some(n => n.pageBreak === 'before' && n.text?.startsWith('Apoyos para SP')));
    const paginas = await pagina.evaluate(() => new Promise(resolve => {
      inclusionDocumento = { curso: true, estudiantes: ['sp'] };
      pdfMake.createPdf(definicionPdf()).getBuffer(b => resolve(new TextDecoder('latin1').decode(b).match(/\/Type\s+\/Page\b/g).length));
    }));
    assert(paginas <= 5, 'El plan no debe crecer: tenía 5 páginas tras la tarea 074, tiene ' + paginas);
    console.log('Plan del caso de referencia:', paginas, 'páginas (tras la tarea 074: 5).');

    // Resumen para la familia: 6 viñetas, total, texto de casa o frase de reunión, 1 página.
    const familia = await pagina.evaluate(() => {
      inclusionDocumento = { familia: true, estudiantes: ['sp'] };
      armarHoja();
      const con = { hoja: $('#hoja').innerText, vinetas: [...$('#hoja').querySelectorAll('ul')].map(u => u.querySelectorAll('li').length), pdf: JSON.stringify(definicionPdf()) };
      estudianteActual().acuerdo.casa = '';
      armarHoja();
      const sin = { hoja: $('#hoja').innerText, pdf: JSON.stringify(definicionPdf()) };
      return new Promise(resolve => pdfMake.createPdf(definicionPdf()).getBuffer(b => resolve({ con, sin, paginas: new TextDecoder('latin1').decode(b).match(/\/Type\s+\/Page\b/g).length })));
    });
    assert.deepEqual(familia.con.vinetas, [5, 6]);
    for (const texto of [familia.con.hoja, familia.con.pdf]) {
      assert(texto.includes('El plan completo tiene 17 apoyos.'));
      assert(texto.includes('Usar la agenda con dibujos antes de las tareas.'));
      assert(texto.includes('Qué esperamos ver'));
      assert(!texto.includes('Lo completamos juntos en la reunión.'));
    }
    for (const texto of [familia.sin.hoja, familia.sin.pdf]) {
      assert(texto.includes('Lo completamos juntos en la reunión.'));
      assert(!/Sin información|No informado/.test(texto));
    }
    assert(!familia.con.hoja.includes('¿Cómo sabremos que funciona?'));
    assert.equal(familia.paginas, 1);
    const resumenPdf = JSON.parse(familia.con.pdf);
    assert.deepEqual(resumenPdf.pageMargins, [51, 51, 51, 51]);
    assert.deepEqual([resumenPdf.defaultStyle.fontSize, resumenPdf.defaultStyle.lineHeight], [11.5, 1.15]);
    assert.deepEqual([resumenPdf.styles.seccion.fontSize, resumenPdf.styles.seccion.margin[1], resumenPdf.styles.aclaracion.fontSize, resumenPdf.styles.aclaracion.color], [14, 16, 10, '#4f586e']);
    const tituloFamilia = resumenPdf.content.find(n => n.text === 'Apoyos para SP');
    assert.deepEqual([tituloFamilia.fontSize, tituloFamilia.color], [24, '#2456d6']);
    const cuadro = resumenPdf.content.find(n => n.table);
    assert(JSON.stringify(cuadro).includes('#f4f6fc') && JSON.stringify(cuadro).includes('Próxima conversación'));
    const sinLineas = JSON.parse(familia.sin.pdf).content.filter(n => n.canvas?.[0]?.lineWidth === .5);
    assert.equal(sinLineas.length, 2);
    assert.equal(sinLineas[0].margin[1], 22);
    console.log('Resumen para la familia:', familia.paginas, 'página.');

    assert.deepEqual(errores, []);
    console.log('Acuerdos y contenido de documentos: todo correcto.');
  } finally {
    await navegador?.close();
    servidor.close();
  }
}

probar().catch(error => { console.error(error); process.exit(1); });
