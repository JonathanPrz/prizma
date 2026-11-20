const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

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
    for (const width of [390, 1280, 640]) {
      const pagina = await navegador.newPage({ viewport: { width, height: width === 640 ? 400 : 844 }, reducedMotion: 'reduce' });
      pagina.setDefaultTimeout(10000);
      const errores = [];
      pagina.on('pageerror', error => errores.push(error.message));
      await pagina.addInitScript(() => {
        localStorage.setItem('prizma.privacidad.v1', '1');
        localStorage.setItem('prizma.privacidad.v1.trabajo', '1');
      });
      await pagina.goto(url);
      await pagina.waitForSelector('#contexto');
      const nodo = id => pagina.locator('#' + id);
      const activo = pagina.locator('#indicador-pasos [aria-current="step"]');
      assert(await nodo('barra-continuar').isVisible());

      async function verificarResultados(titulo, primerControl) {
        await pagina.waitForFunction(() => document.querySelector('#indicador-pasos [aria-current="step"]')?.textContent.includes('2 Elige'));
        assert.match(await nodo(titulo).innerText(), /^2\./);
        const medicion = await pagina.evaluate(({ titulo, primerControl }) => {
          const indicador = document.querySelector('#indicador-pasos');
          const rectTitulo = document.getElementById(titulo).getBoundingClientRect();
          const control = primerControl && document.querySelector(primerControl).getBoundingClientRect();
          return {
            arriba: getComputedStyle(indicador).position === 'static' ?
              document.querySelector('.cabecera').getBoundingClientRect().bottom : indicador.getBoundingClientRect().bottom,
            abajo: document.querySelector('#barra-continuar').getBoundingClientRect().top,
            inicio: rectTitulo.top, fin: rectTitulo.bottom, control: control?.bottom,
            desborde: document.documentElement.scrollWidth > innerWidth
          };
        }, { titulo, primerControl });
        assert(medicion.inicio >= medicion.arriba && medicion.fin <= medicion.abajo, JSON.stringify(medicion));
        if (primerControl) assert(medicion.control <= medicion.abajo, JSON.stringify(medicion));
        assert(!medicion.desborde);
        assert(await nodo('indicador-pasos').locator('.paso-terminado').first().isVisible());
        assert.equal(await nodo('indicador-pasos').locator('.paso-terminado').first().getAttribute('aria-hidden'), 'true');
      }

      await nodo('nivel').selectOption('basica');
      await nodo('guardar-clase').click();
      await verificarResultados('t-acciones', '#proyectar');
      if (width === 640) {
        assert.equal(await nodo('indicador-pasos').evaluate(n => getComputedStyle(n).position), 'static');
        assert.deepEqual(errores, []);
        await pagina.close();
        continue;
      }

      await nodo('tab-apoyos').click();
      await nodo('iniciales').fill('JP');
      assert(!(await nodo('continuar-conteo').isVisible()));
      assert(await nodo('continuar').evaluate(b => {
        const contenido = b.parentElement;
        return Math.abs(contenido.getBoundingClientRect().right -
          parseFloat(getComputedStyle(contenido).paddingRight) - b.getBoundingClientRect().right) <= 1;
      }));
      const area = nodo('area-0');
      const estiloControl = n => {
        const css = getComputedStyle(n);
        return { fondo: css.backgroundColor, borde: css.borderTopWidth, texto: css.color };
      };
      const chip = nodo('lista-estudiantes').locator('button');
      assert.equal(await chip.innerText(), 'JP');
      assert(await chip.evaluate(b => b.getBoundingClientRect().width < b.parentElement.getBoundingClientRect().width));
      const quitar = nodo('quitar-estudiante');
      assert.equal(await quitar.innerText(), 'Quitar este caso');
      assert.equal(await quitar.getAttribute('aria-label'), 'Quitar este caso: JP');
      assert((await quitar.boundingBox()).height >= 44);

      const contexto = nodo('area-4');
      await contexto.click();
      assert.match(await contexto.innerText(), /Contexto e identidad/);
      const grupoContexto = nodo(await contexto.getAttribute('aria-controls'));
      assert.equal(await grupoContexto.locator('legend').first().innerText(), 'Identidad, lengua y pertenencia');
      assert(await grupoContexto.evaluate(g => g.previousElementSibling.id === 'area-4'));
      await contexto.click();

      const areaCerrada = await area.evaluate(estiloControl);
      await area.click();
      await pagina.mouse.move(0, 0);
      assert.equal(await area.getAttribute('aria-expanded'), 'true');
      assert.deepEqual(await area.evaluate(estiloControl), areaCerrada);
      const grupo = nodo(await area.getAttribute('aria-controls'));
      assert(await grupo.evaluate(g => g.previousElementSibling.id === 'area-0' && g.parentElement.nextElementSibling.firstElementChild.id === 'area-1'));
      const frecuencia = grupo.locator('.frecuencias').first();
      const radios = frecuencia.getByRole('radio');
      assert.equal(await radios.count(), 4);
      assert(await radios.first().isChecked());
      assert.equal((await radios.first().locator('..').evaluate(estiloControl)).fondo, areaCerrada.fondo);
      const posiciones = await frecuencia.locator('label').evaluateAll(celdas => celdas.map(celda => {
        const r = celda.getBoundingClientRect();
        return { x: r.x, y: r.y, ancho: r.width, alto: r.height };
      }));
      assert(posiciones.every(p => p.alto >= 44 && p.ancho === posiciones[0].ancho));
      if (width === 390) {
        const [primera, segunda, tercera, cuarta] = posiciones;
        assert(primera.x === tercera.x && segunda.x === cuarta.x && primera.x < segunda.x);
        assert(primera.y === segunda.y && tercera.y === cuarta.y && primera.y < tercera.y);
        assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      } else {
        assert(posiciones.every(p => p.y === posiciones[0].y));
      }
      await radios.first().focus();
      await pagina.keyboard.press('ArrowRight');
      assert(await radios.nth(1).isChecked());
      assert.equal(await radios.nth(1).locator('..').evaluate(n => getComputedStyle(n).outlineWidth), '3px');
      await pagina.keyboard.press('ArrowRight');
      assert(await radios.nth(2).isChecked());
      assert(await radios.nth(2).locator('..').locator('[aria-hidden="true"]').isVisible());
      assert.match(await area.innerText(), /\(1 marcada\)/);
      const seleccionada = await radios.nth(2).locator('..').evaluate(estiloControl);
      assert.notEqual(seleccionada.fondo, areaCerrada.fondo);
      assert.deepEqual(await area.evaluate(estiloControl), seleccionada);
      await area.click();
      assert.equal(await area.getAttribute('aria-expanded'), 'false');
      assert.deepEqual(await area.evaluate(estiloControl), seleccionada);
      assert.match(await area.innerText(), /\(1 marcada\)/);
      await area.click();
      await pagina.locator('input[name="dimension-1"][value="3"]').check();
      await nodo('guardar-descripcion').click();
      await verificarResultados('t-apoyos');
      assert(await nodo('continuar-conteo').isVisible());
      assert.equal(await nodo('continuar-conteo').textContent(), '0 elegidos para JP');
      const medidas = await nodo('panel-apoyos').evaluate(n => ({
        ancho: n.getBoundingClientRect().width,
        columnas: [...n.querySelectorAll('.tarjetas')].filter(l => l.getClientRects().length)
          .map(l => getComputedStyle(l).gridTemplateColumns)
      }));
      assert(medidas.ancho <= 800);
      assert(medidas.columnas.length && medidas.columnas.every(c => /^\d+(\.\d+)?px$/.test(c)));
      const elegir = nodo('elegir-acc-1-organizador'), tarjeta = elegir.locator('xpath=ancestor::li[contains(@class, "tarjeta")]');
      // El grupo que contiene la tarjeta puede estar plegado, independiente de su apartado de fuentes.
      await elegir.evaluate(b => {
        for (let n = b.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
      });
      const detalle = tarjeta.locator('details');
      assert.equal(await detalle.count(), 1);
      assert.equal(await detalle.locator('summary').innerText(), 'Por qué funciona y fuentes');
      assert(!(await detalle.evaluate(d => d.open)));
      assert(await tarjeta.locator('.aviso-apoyos').isVisible());
      assert(await tarjeta.locator(':scope > ol').isVisible());
      assert(await tarjeta.locator('.t-razon').evaluate(razon =>
        Boolean(razon.previousElementSibling?.matches('h3,h4'))));
      await detalle.locator('summary').click();
      await elegir.click();
      assert(await detalle.evaluate(d => d.open));
      assert(await nodo('continuar-conteo').isVisible());
      assert.equal(await nodo('continuar-conteo').textContent(), '1 elegido para JP');
      if (width === 390) {
        assert(await nodo('continuar-conteo').evaluate(n => {
          const caso = n.querySelector('#continuar-caso');
          return n.getBoundingClientRect().height <= parseFloat(getComputedStyle(n).lineHeight) &&
            getComputedStyle(caso).position === 'absolute' && caso.getBoundingClientRect().width === 1;
        }));
      }
      const geometria = await pagina.evaluate(async () => {
        const barra = document.querySelector('#barra-continuar');
        const raiz = document.documentElement;
        const pie = document.querySelector('.pie');
        const posicion = scrollY;
        const fin = raiz.scrollHeight - innerHeight;
        const desplazar = async y => {
          window.scrollTo(0, y);
          await new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)));
          return barra.getBoundingClientRect();
        };
        const mitad = await desplazar(fin / 2);
        const final = await desplazar(fin);
        const medidas = {
          visibleMitad: mitad.top >= 0 && Math.abs(mitad.bottom - innerHeight) <= 1,
          anchoCompleto: mitad.left === 0 && mitad.width === raiz.clientWidth &&
            getComputedStyle(barra).backgroundColor === getComputedStyle(pie).backgroundColor,
          antesPie: Math.abs(final.bottom - pie.getBoundingClientRect().top) <= 1,
          sinFranja: Math.abs(pie.getBoundingClientRect().bottom - innerHeight) <= 1 &&
            getComputedStyle(document.body).paddingBottom === '0px'
        };
        await desplazar(posicion);
        return medidas;
      });
      assert.deepEqual(geometria, { visibleMitad: true, anchoCompleto: true, antesPie: true, sinFranja: true });

      async function verificarErrores(trabajo) {
        const prefijo = trabajo ? 'trabajo-acuerdo-' : 'acuerdo-';
        const roles = nodo(trabajo ? 'trabajo-roles' : 'roles-acuerdo').locator('input').first();
        await nodo(trabajo ? 'trabajo-ir-acuerdos' : 'ir-acuerdos').click();
        assert.match(await activo.innerText(), /3 Acuerda/);
        assert.equal(await nodo('continuar').innerText(), 'Guardar acuerdos');
        const posicion = await roles.evaluate(input => ({
          arriba: document.querySelector('#indicador-pasos').getBoundingClientRect().bottom,
          titulo: input.closest('section').querySelector('h2').getBoundingClientRect().top,
          control: input.getBoundingClientRect().bottom,
          abajo: document.querySelector('#barra-continuar').getBoundingClientRect().top
        }));
        assert(posicion.titulo >= posicion.arriba && posicion.control < posicion.abajo, JSON.stringify(posicion));
        const titulo = nodo(trabajo ? 'trabajo-acuerdo-toggle' : 'paso-acuerdos-toggle');
        assert.equal(await titulo.getAttribute('aria-expanded'), 'true');
        assert.deepEqual(await titulo.evaluate(estiloControl), {
          fondo: 'rgba(0, 0, 0, 0)', borde: '0px', texto: await pagina.locator('body').evaluate(n => getComputedStyle(n).color)
        });
        await pagina.keyboard.press('Tab');
        await titulo.focus();
        assert(await titulo.evaluate(n => n.matches(':focus-visible') && getComputedStyle(n).outlineWidth === '3px'));
        await nodo(trabajo ? 'guardar-acuerdos-trabajo' : 'guardar-acuerdos').click();
        assert.equal(await roles.evaluate(r => r === document.activeElement), true);
        assert.equal(await roles.getAttribute('aria-invalid'), 'true');
        assert.equal(await roles.getAttribute('aria-describedby'), prefijo + 'roles-error');
        if (width === 390) {
          const mensaje = await nodo(prefijo + 'roles-error').evaluate(error => ({
            trasPregunta: error.previousElementSibling?.tagName === 'LEGEND',
            inicio: error.getBoundingClientRect().top,
            fin: error.getBoundingClientRect().bottom,
            primeraOpcion: error.nextElementSibling.getBoundingClientRect().top,
            bordeBarra: document.querySelector('#barra-continuar').getBoundingClientRect().top
          }));
          assert(mensaje.trasPregunta && mensaje.inicio >= 0 && mensaje.fin <= mensaje.primeraOpcion &&
            mensaje.fin <= mensaje.bordeBarra, JSON.stringify(mensaje));
        }
        assert.equal(await nodo(trabajo ? 'trabajo-acuerdos-error' : 'acuerdos-error').innerText(), 'Revisa 4 campos.');
        await roles.check();
        assert.equal(await roles.getAttribute('aria-invalid'), null);
        assert.equal(await roles.getAttribute('aria-describedby'), null);
        assert(!(await nodo(prefijo + 'roles-error').isVisible()));
        assert.equal(await nodo(trabajo ? 'trabajo-acuerdos-error' : 'acuerdos-error').innerText(), 'Revisa 3 campos.');
        await nodo(trabajo ? 'trabajo-fecha' : 'fecha-acuerdo').fill('2026-11-20');
        await nodo(trabajo ? 'trabajo-revision' : 'revision-acuerdo').fill('2026-12-04');
        await nodo(trabajo ? 'trabajo-criterio' : 'criterio-acuerdo').fill('Completa la tarea con el apoyo elegido.');
        assert.equal(await nodo('continuar').innerText(), 'Guardar acuerdos');
        const ultimoCampo = nodo(trabajo ? 'acuerdos-trabajo' : 'acuerdos-caso').locator('textarea').last();
        assert(await ultimoCampo.evaluate(campo => {
          const barra = document.querySelector('#barra-continuar');
          window.scrollBy(0, campo.getBoundingClientRect().bottom - barra.getBoundingClientRect().top - 12);
          const cubierto = campo.getBoundingClientRect().bottom > barra.getBoundingClientRect().top;
          campo.blur();
          campo.focus({ preventScroll: true });
          return cubierto;
        }));
        assert(await ultimoCampo.evaluate(campo => {
          const r = campo.getBoundingClientRect();
          const indicador = document.querySelector('#indicador-pasos');
          const arriba = getComputedStyle(indicador).position === 'sticky' ?
            indicador.getBoundingClientRect().bottom : document.querySelector('.cabecera').getBoundingClientRect().bottom;
          return document.activeElement === campo && r.top >= arriba &&
            r.bottom <= Math.min(innerHeight, document.querySelector('#barra-continuar').getBoundingClientRect().top);
        }));
        await nodo(trabajo ? 'guardar-acuerdos-trabajo' : 'guardar-acuerdos').click();
        assert.equal(await nodo('continuar').innerText(), 'Ver documento');
      }
      await verificarErrores(false);
      assert.equal(await chip.innerText(), 'JP');
      await nodo('paso-descripcion-editar').click();
      await nodo('area-3').click();
      await pagina.locator('input[name="dimension-6"][value="2"]').check();
      assert.equal(await chip.innerText(), 'JP · Por revisar');
      await nodo('guardar-descripcion').click();
      const ampliar = nodo('elegir-acc-6-ampliar').locator('xpath=ancestor::li[contains(@class, "tarjeta")]');
      assert.equal(await ampliar.locator('.t-razon').textContent(), 'Porque marcaste: Información que se ve (seguido).');

      await nodo('nivel').selectOption('practica-trabajo');
      await nodo('trabajo-area-0').click();
      await pagina.locator('input[name="trabajo-dimension-1"][value="3"]').check();
      await nodo('guardar-descripcion-trabajo').click();
      await verificarResultados('t-ajustes');
      const primerAjuste = nodo('trabajo-tarjetas').locator('button[id^="elegir-"]').first();
      await primerAjuste.evaluate(b => {
        for (let n = b.parentElement; n; n = n.parentElement) if (n.tagName === 'DETAILS') n.open = true;
      });
      await primerAjuste.click();
      await verificarErrores(true);

      await nodo('trabajo-descripcion-editar').click();
      await nodo('trabajo-etapa').selectOption('practica');
      const fichaCentro = nodo('elegir-pp-c-analisis');
      await fichaCentro.evaluate(b => b.closest('details').open = true);
      await fichaCentro.click();
      await nodo('trabajo-ir-acuerdos').click();
      assert.equal(await nodo('continuar').innerText(), 'Guardar acuerdos');
      await nodo('trabajo-roles').locator('input').first().check();
      await nodo('guardar-acuerdos-trabajo').click();
      assert.equal(await nodo('continuar').innerText(), 'Ver documento para el centro');
      assert.deepEqual(errores, []);
      await pagina.close();
    }
    console.log('Correcto: columna única, tarjetas y detalles persistentes, barra y pasos visibles, validación junto al campo y reflujo a 390, 640 y 1280 px.');
  } finally {
    await navegador?.close();
    await new Promise(ok => servidor.close(ok));
  }
}

probar().catch(error => { console.error(error); process.exitCode = 1; });
