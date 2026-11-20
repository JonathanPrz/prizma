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

      async function verificarClics(id) {
        for (const boton of await nodo(id).getByRole('button').all()) {
          const antes = await boton.evaluate(n => {
            window.opcionProbada = n;
            const barra = document.querySelector('#barra-continuar').getBoundingClientRect();
            window.scrollBy(0, n.getBoundingClientRect().bottom - barra.top + 2);
            const r = n.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2, scroll: scrollY };
          });
          for (const marcado of ['true', 'false']) {
            await pagina.mouse.click(antes.x, antes.y);
            const despues = await pagina.evaluate(async () => {
              await new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)));
              return { scroll: scrollY, foco: document.activeElement === window.opcionProbada };
            });
            assert.deepEqual(despues, { scroll: antes.scroll, foco: true }, await boton.getAttribute('id'));
            assert.equal(await boton.getAttribute('aria-pressed'), marcado);
          }
        }
      }
      await nodo('nivel').selectOption('basica');
      if (width !== 640) {
        await verificarClics('necesidades');
        assert(await nodo('paso-clase-toggle').evaluate(b => {
          const practica = document.querySelector('#practica');
          (practica.getClientRects().length ? practica : b).focus();
          const campo = document.querySelector('#meta'), barra = document.querySelector('#barra-continuar');
          window.scrollBy(0, campo.getBoundingClientRect().bottom - barra.getBoundingClientRect().top - 12);
          window.scrollAntesDeTab = scrollY;
          return campo.getBoundingClientRect().bottom > barra.getBoundingClientRect().top;
        }));
        await pagina.keyboard.press('Tab');
        const teclado = await nodo('meta').evaluate(n => ({
          foco: document.activeElement.id, antes: window.scrollAntesDeTab, despues: scrollY,
          abajo: n.getBoundingClientRect().bottom, barra: document.querySelector('#barra-continuar').getBoundingClientRect().top
        }));
        assert(teclado.foco === 'meta' && teclado.despues > teclado.antes && teclado.abajo <= teclado.barra, JSON.stringify(teclado));
        await pagina.locator('#perfil .mas-detalles summary').click();
        await pagina.locator('input[name="actividad"][value="crear"]').check();
        await nodo('guardar-clase').evaluate(n => n.scrollIntoView({ block: 'center' }));
        await pagina.evaluate(() => {
          window.trayectoriaGuardado = [scrollY];
          addEventListener('scroll', () => trayectoriaGuardado.push(scrollY), { passive: true, signal: (window.finMedicion = new AbortController()).signal });
        });
      }
      await nodo('guardar-clase').click();
      await verificarResultados('t-acciones', '#proyectar');
      if (width !== 640) {
        const trayecto = await pagina.evaluate(async () => {
          await new Promise(ok => setTimeout(ok, 600));
          finMedicion.abort();
          return [...new Set(trayectoriaGuardado)];
        });
        assert.equal(trayecto.length, 2, JSON.stringify(trayecto));
        assert(await nodo('continuar-conteo').isVisible());
        assert.match(await nodo('continuar-conteo').textContent(), /0 elegidas/);
        assert.doesNotMatch(await nodo('continuar-conteo').textContent(), /acciones/);
        assert.match(await nodo('conteo').textContent(), /responden a lo que marcaste/);
        await verificarClics('momentos');
        await verificarClics('propositos');
        await nodo('paso-clase-editar').click();
        await pagina.locator('#necesidades button').first().click();
        await nodo('guardar-clase').click();
        assert.equal(await nodo('t-dua-marcadas').innerText(), 'Para lo que marcaste');
        assert.equal(await nodo('tarjetas').locator('.empieza-por').count(), 0);
        assert((await pagina.locator('#tarjetas .dua-marcadas .tarjeta:visible').count()) > 0);
        const aviso = nodo('aviso-borrador-dua');
        const taller = nodo('practica');
        await nodo('paso-clase-editar').click();
        await nodo('limpiar-clase').click();
        assert(!await aviso.isVisible());
        await nodo('guardar-clase').click();
        assert.equal(await nodo('conteo').textContent(), '36 acciones para todo el curso');
        await nodo('paso-clase-editar').click();
        await taller.check();
        assert(await aviso.isVisible());
        assert(await taller.evaluate(n => n === document.activeElement));
        assert.match(await aviso.getByRole('status').textContent(), /Tienes cambios sin guardar en el paso 1/);
        assert.equal(await nodo('conteo').textContent(), '36 acciones para todo el curso');
        await taller.uncheck();
        assert(!await aviso.isVisible());
        await taller.check();
        await aviso.getByRole('button', { name: 'Guardar y actualizar' }).click();
        assert(!await aviso.isVisible());
        assert.equal(await nodo('conteo').textContent(), '8 de 36 acciones responden a lo que marcaste');
        const primeraDua = pagina.locator('#tarjetas [aria-labelledby="t-dua-recomendadas"] .tarjeta button[id^="elegir-"]').first();
        await primeraDua.click();
        assert.match(await nodo('continuar-conteo').textContent(), /1 elegida/);
        await primeraDua.click();
        await nodo('m-antes').click();
        await nodo('proposito-motivar').click();
        assert.match(await nodo('conteo').textContent(), /^Antes y Compromiso: \d+ de 4 acciones responde/);
        await nodo('limpiar-filtros').click();
        await nodo('paso-clase-editar').click();
        await nodo('limpiar-clase').click();
        await nodo('guardar-clase').click();
      }
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
      const neutra = await radios.first().locator('..').evaluate(n => {
        const css = getComputedStyle(n);
        return { color: css.color, peso: css.fontWeight, fondo: css.backgroundColor, sombra: css.boxShadow };
      });
      const tinta = await pagina.locator('body').evaluate(n => getComputedStyle(n).color);
      assert.deepEqual(neutra, { color: tinta, peso: '600', fondo: 'rgba(0, 0, 0, 0)', sombra: 'none' });
      assert(!(await radios.first().locator('..').locator('[aria-hidden="true"]').count()));
      const borde = await frecuencia.evaluate(n => {
        const css = getComputedStyle(n);
        return [css.borderTopWidth, css.borderRightWidth, css.borderBottomWidth, css.borderLeftWidth, css.borderRadius, css.gap];
      });
      assert.deepEqual(borde, ['1px', '1px', '1px', '1px', '8px', '0px']);
      if (width === 1280) assert((await frecuencia.boundingBox()).width <= 520);
      const fuenteArea = await area.evaluate(n => parseFloat(getComputedStyle(n).fontSize));
      const fuenteSituacion = await grupo.locator('legend').first().evaluate(n => parseFloat(getComputedStyle(n).fontSize));
      assert.equal(fuenteSituacion, 16);
      assert(fuenteArea > fuenteSituacion);
      async function verificarMargenes() {
        const margenes = await frecuencia.locator('label').evaluateAll(celdas => celdas.map(celda => {
          const rango = document.createRange();
          rango.selectNodeContents([...celda.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
          const texto = rango.getBoundingClientRect();
          const borde = celda.getBoundingClientRect();
          return { opcion: rango.toString(), izquierda: texto.left - borde.left, derecha: borde.right - texto.right };
        }));
        assert(margenes.every(m => m.izquierda >= 8 && m.derecha >= 8), JSON.stringify(margenes));
      }
      await verificarMargenes();
      const posiciones = await frecuencia.locator('label').evaluateAll(celdas => celdas.map(celda => {
        const r = celda.getBoundingClientRect();
        const css = getComputedStyle(celda);
        return { x: r.x, y: r.y, ancho: r.width, alto: r.height, letra: css.fontSize,
          bordes: [css.borderTopWidth, css.borderRightWidth, css.borderBottomWidth, css.borderLeftWidth] };
      }));
      assert(posiciones.every(p => p.alto >= 32 && p.alto <= 40 && p.ancho >= 104 && p.ancho === posiciones[0].ancho &&
        p.letra === '14px' && p.bordes.every(borde => borde === '0px')));
      if (width === 390) {
        const [primera, segunda, tercera, cuarta] = posiciones;
        assert(primera.x === tercera.x && segunda.x === cuarta.x && primera.x < segunda.x);
        assert(primera.y === segunda.y && tercera.y === cuarta.y && primera.y < tercera.y);
        assert(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        for (const celda of await frecuencia.locator('label').all()) {
          assert(await celda.isVisible());
          assert(await celda.evaluate(n => {
            const r = n.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && n.scrollWidth <= n.clientWidth;
          }));
        }
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
      const areaMarcada = await area.evaluate(estiloControl);
      assert.equal(areaMarcada.fondo, seleccionada.fondo);
      assert.equal(areaMarcada.texto, seleccionada.texto);
      assert.equal(seleccionada.borde, '0px');
      assert.match(await radios.nth(2).locator('..').evaluate(n => getComputedStyle(n).boxShadow), /0px 0px 0px 2px inset/);
      await area.click();
      assert.equal(await area.getAttribute('aria-expanded'), 'false');
      assert.deepEqual(await area.evaluate(estiloControl), areaMarcada);
      assert.match(await area.innerText(), /\(1 marcada\)/);
      await area.click();
      await pagina.locator('input[name="dimension-1"][value="3"]').check();
      await verificarMargenes();
      await pagina.locator('input[name="dimension-2"][value="2"]').check();
      await nodo('guardar-descripcion').click();
      await verificarResultados('t-apoyos');
      assert(await nodo('continuar-conteo').isVisible());
      assert.equal(await nodo('continuar-conteo').textContent(), '0 elegidos para JP');
      const gruposApoyos = nodo('apoyos-resultados').locator('details[data-grupo]');
      assert.equal(await nodo('apoyos-resultados').locator('.tarjeta:visible').count(), 0);
      assert.equal(await nodo('apoyos-resultados').locator('.tarjeta').count(), await gruposApoyos.locator('li.tarjeta').count());
      const titulosApoyos = await gruposApoyos.locator(':scope > summary').allTextContents();
      assert(titulosApoyos.every(titulo => !titulo.includes('responden a lo que marcaste')));
      assert.equal(titulosApoyos.reduce((total, titulo) => total + Number(titulo.match(/\((\d+)\)$/)[1]), 0),
        await nodo('apoyos-resultados').locator('.tarjeta').count());
      const enlacesApoyos = nodo('apoyos-resultados').locator('.empieza-por a');
      assert.equal(await enlacesApoyos.count(), 3);
      const destino = await enlacesApoyos.first().getAttribute('href');
      assert((await enlacesApoyos.first().boundingBox()).height >= 24);
      await enlacesApoyos.first().focus();
      await pagina.keyboard.press('Enter');
      const fichaEnlazada = await pagina.locator(destino).evaluate(n => {
        const ficha = n.closest('.tarjeta');
        const titulo = ficha.querySelector('h3, h4');
        const indicador = document.querySelector('#indicador-pasos');
        const arriba = getComputedStyle(indicador).position === 'sticky'
          ? indicador.getBoundingClientRect().bottom : document.querySelector('.cabecera').getBoundingClientRect().bottom;
        const abajo = Math.min(innerHeight, document.querySelector('#barra-continuar').getBoundingClientRect().top);
        return {
          enfocada: titulo === document.activeElement && titulo.tabIndex === -1,
          abierta: n.closest('details[data-grupo]').open,
          visible: ficha.getBoundingClientRect().top >= arriba && titulo.getBoundingClientRect().bottom <= abajo
        };
      });
      assert(fichaEnlazada.enfocada && fichaEnlazada.abierta, JSON.stringify(fichaEnlazada));
      if (width === 390) assert(fichaEnlazada.visible, JSON.stringify(fichaEnlazada));
      assert.equal(await gruposApoyos.locator('xpath=self::*[@open]').count(), 1);
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
      const botonElegir = await elegir.elementHandle();
      await elegir.click();
      assert(await botonElegir.evaluate(b => b === document.activeElement && b.getAttribute('aria-pressed') === 'true'));
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
      const confirmacionEtapa = pagina.waitForEvent('dialog').then(async dialogo => {
        await dialogo.accept();
        return dialogo.message();
      });
      await nodo('trabajo-etapa').selectOption('practica');
      assert.match(await confirmacionEtapa, /Se quitarán 1 ajustes/);
      const fichaCentro = nodo('elegir-pp-c-analisis');
      await fichaCentro.evaluate(b => b.closest('details').open = true);
      await fichaCentro.click();
      await nodo('trabajo-ir-acuerdos').click();
      assert.equal(await nodo('continuar').innerText(), 'Guardar acuerdos');
      await nodo('trabajo-roles').locator('input').first().check();
      await nodo('guardar-acuerdos-trabajo').click();
      assert.equal(await nodo('continuar').innerText(), 'Ver documento para el centro');
      await nodo('trabajo-iniciales').fill('JP');
      await nodo('preparar-primer-empleo').click();
      assert(await nodo('trabajo-historia').isVisible());
      assert.match(await nodo('trabajo-historia-estado').textContent(), /^Estado del acuerdo de la práctica:/);
      assert.equal(await nodo('trabajo-agregar-ayuda').textContent(), 'Completa los acuerdos de: JP (práctica), JP (primer empleo)');
      const casos = await nodo('lista-trabajadores').getByRole('button').allTextContents();
      assert.match(casos[0], /^JP \(práctica\)/);
      assert.equal(casos[1], 'JP (primer empleo)');
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
