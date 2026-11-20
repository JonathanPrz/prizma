const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

function medir() {
  const modal = document.querySelector('dialog[open]');
  const raiz = modal || document.body;
  const nombre = e => e.id ? '#' + e.id : e.localName + [...e.classList].map(c => '.' + c).join('');
  const visible = e => e.getClientRects().length && e.checkVisibility({ visibilityProperty: true }) &&
    !e.closest('svg') && !(e.matches('.solo-lectores') && getComputedStyle(e).clipPath !== 'none');
  const px = n => Math.round(n * 100) / 100;
  const rect = e => {
    const { x, y, width, height } = e.getBoundingClientRect();
    return [x, y, width, height].map(px);
  };
  const rgb = valor => valor.match(/[\d.]+/g)?.map(Number);
  const luz = c => c.slice(0, 3).map(n => n / 255)
    .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
    .reduce((s, n, i) => s + n * [.2126, .7152, .0722][i], 0);
  const ratio = (a, b) => {
    const valores = [luz(a), luz(b)].sort((x, y) => y - x);
    return px((valores[0] + .05) / (valores[1] + .05));
  };
  const fondo = e => {
    for (let n = e; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      const c = rgb(s.backgroundColor);
      // shortcut: mide fondos planos opacos; revisar gradientes y superposiciones aparte.
      if (s.backgroundImage !== 'none' || (c.length === 4 && c[3] > 0)) return null;
      if (c.length === 3) return c;
    }
    return [255, 255, 255];
  };
  const textos = {}, paleta = { texto: {}, fondo: {}, borde: {} }, espacios = {}, contrastes = {}, bordes = {};
  const objetivos = [], lectura = [], primeraPantalla = [];
  const sumar = (grupo, clave, selector) => {
    const entrada = grupo[clave] ??= { n: 0, ejemplo: selector };
    entrada.n++;
  };
  const lados = ['Top', 'Right', 'Bottom', 'Left'];
  const props = ['rowGap', 'columnGap', ...lados.map(l => 'padding' + l), ...lados.map(l => 'margin' + l)];
  for (const e of [raiz, ...raiz.querySelectorAll('*')].filter(visible)) {
    const s = getComputedStyle(e);
    const id = nombre(e);
    const caja = rect(e);
    const texto = [...e.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    const control = e.matches('a[href], button, input, select, textarea, summary, label[for].boton');
    if (control) {
      const etiqueta = e.closest('label') || (e.id && document.querySelector('label[for="' + CSS.escape(e.id) + '"]'));
      objetivos.push({ id, caja, etiqueta: etiqueta && rect(etiqueta), deshabilitado: e.matches(':disabled'),
        fondo: fondo(e), borde: s.borderTopColor,
        contrasteBordeExterior: parseFloat(s.borderTopWidth) && fondo(e.parentElement)
          ? ratio(rgb(s.borderTopColor), fondo(e.parentElement)) : null,
        outline: s.outlineStyle, foco: e.matches(':focus-visible') });
    }
    if (caja[1] >= 0 && caja[1] < innerHeight && e.matches('h1,h2,h3,button,legend,[role=status],[aria-current=step]')) {
      primeraPantalla.push({ id, caja, texto: e.innerText.trim(), tipo: [s.fontSize, s.fontWeight, s.color, s.backgroundColor] });
    }
    if (texto.length || e.matches('select,input:not([type=checkbox]):not([type=radio]),textarea')) {
      sumar(textos, s.fontSize, id);
      sumar(paleta.texto, s.color, id);
      const bg = fondo(e);
      const opaco = ![e, ...ancestros(e)].some(n => Number(getComputedStyle(n).opacity) < 1);
      function* ancestros(n) { while ((n = n.parentElement)) yield n; }
      if (bg && opaco) sumar(contrastes, [s.color, bg.join(' '), s.fontSize, s.fontWeight, ratio(rgb(s.color), bg)].join(' | '), id);
    }
    if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') sumar(paleta.fondo, s.backgroundColor, id);
    for (const lado of lados) {
      if (parseFloat(s['border' + lado + 'Width']) > 0) {
        sumar(paleta.borde, s['border' + lado + 'Color'], id);
      }
    }
    if (lados.some(l => parseFloat(s['border' + l + 'Width']) > 0)) sumar(bordes, id, id);
    for (const prop of props) {
      if (s[prop].endsWith('px') && parseFloat(s[prop])) sumar(espacios, s[prop], id + ' ' + prop);
    }
    if (e.matches('p') && e.textContent.length >= 100) {
      const lineas = new Map();
      const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let nodo; (nodo = walker.nextNode());) {
        for (let i = 0; i < nodo.length; i++) {
          range.setStart(nodo, i);
          range.setEnd(nodo, i + 1);
          const caja = range.getBoundingClientRect();
          if (caja.width) {
            const y = Math.round(caja.y);
            lineas.set(y, (lineas.get(y) || '') + nodo.textContent[i]);
          }
        }
      }
      lectura.push({ id, inicio: e.textContent.trim().slice(0, 75), ancho: caja[2],
        caracteres: [...lineas.values()].map(linea => linea.trim().length) });
    }
  }
  const fijo = [...document.querySelectorAll('header,#indicador-pasos,#barra-continuar,.vista-barra')]
    .filter(visible).map(e => ({ id: nombre(e), caja: rect(e), posicion: getComputedStyle(e).position }));
  const activo = document.activeElement;
  const caja = activo.getBoundingClientRect();
  const encima = document.elementFromPoint(caja.x + caja.width / 2, caja.y + caja.height / 2);
  return { ancho: innerWidth, alto: innerHeight, escala: devicePixelRatio, scroll: document.documentElement.scrollWidth, modal: modal?.id,
    desbordeModal: modal ? modal.scrollWidth - modal.clientWidth : null,
    foco: nombre(activo), focoCentroVisible: activo.contains(encima), fijo,
    paso: document.querySelector('[aria-current=step]')?.innerText,
    texto: raiz.innerText, primeraPantalla, textos, paleta, espacios, bordes, contrastes, objetivos, lectura };
}

async function recorrido(p, width, salida) {
  p.setDefaultTimeout(9000);
  const hallado = {}, errores = [];
  p.on('pageerror', e => errores.push(e.message));
  const click = selector => p.locator(selector).first().click();
  const escape = () => p.keyboard.press('Escape');
  const arriba = () => p.evaluate(() => window.scrollTo(0, 0));
  const tomar = async (estado, captura = false) => {
    hallado[estado] = await p.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)))).then(() => p.evaluate(medir));
    if (captura && width !== 768) {
      await p.screenshot({ path: path.join(salida, 'capturas', estado + '.png') });
    }
  };
  const elegir = async selector => {
    const boton = p.locator(selector).first();
    const cerrados = await boton.evaluate(e => {
      const encontrados = [];
      for (let n = e.parentElement; n; n = n.parentElement) {
        if (n.matches('details:not([open])')) encontrados.unshift(n.querySelector('summary'));
      }
      return encontrados.map(n => [...document.querySelectorAll('summary')].indexOf(n));
    });
    for (const i of cerrados) await p.locator('summary').nth(i).click();
    await boton.click();
  };
  const documento = async (selector, nombre) => {
    await click(selector);
    if (await p.locator('#incluir-documento').isVisible()) {
      await tomar('incluir-' + nombre);
      if (nombre === 'trabajo') {
        await click('#generar-documento');
        await tomar('incluir-trabajo-error', true);
        await p.locator('#opciones-documento input[name=incluir]').first().check();
      }
      await click('#generar-documento');
    }
    await p.locator('#vista[open]').waitFor();
    await tomar('documento-' + nombre, true);
    await escape();
  };
  try {
    await p.goto(process.env.PRIZMA_URL || 'http://127.0.0.1:8000');
    await p.locator('#elegir-educacion:enabled').waitFor();
    await tomar('inicio', true);
    await click('#elegir-educacion');
    await p.selectOption('#nivel', 'basica');
    await arriba();
    await tomar('dua', true);
    hallado.teclado = [];
    for (let i = 0; i < 22; i++) {
      await p.keyboard.press('Tab');
      hallado.teclado.push(await p.evaluate(() => {
        const e = document.activeElement;
        const r = e.getBoundingClientRect();
        const encima = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        const s = getComputedStyle(e);
        return { id: e.id || e.innerText.trim().slice(0, 60), centroVisible: e.contains(encima),
          foco: [s.outlineStyle, s.outlineWidth, s.outlineColor],
          cubre: encima?.closest('header,nav,#barra-continuar')?.id || encima?.className || '' };
      }));
    }
    await click('#abrir-mochila');
    await tomar('mochila-vacia');
    await p.locator('#abrir-respaldo').setInputFiles({
      name: 'prueba.json', mimeType: 'application/json', buffer: Buffer.from('{')
    });
    await p.waitForFunction(() => document.querySelector('#respaldo-estado').textContent.trim());
    await tomar('respaldo-error');
    await escape();
    await click('#panel-dua .enlace-guia-dua');
    await tomar('guia-dua');
    await escape();
    await click('#guardar-clase');
    await tomar('dua-acciones', true);
    await elegir('#tarjetas button[id^=elegir-]');
    await tomar('dua-elegida');
    await documento('#documento-clase', 'dua');
    for (const nivel of ['basica', 'superior']) {
      if (nivel === 'superior') {
        p.once('dialog', async d => {
          hallado.confirmacionNivel = d.message();
          await d.accept();
        });
        await p.selectOption('#nivel', nivel);
      }
      await click('#tab-apoyos');
      await arriba();
      await tomar(nivel, true);
      await click('#panel-apoyos .enlace-guia-apoyos');
      await tomar('guia-' + nivel);
      await escape();
      if (nivel === 'superior') {
        if (!await p.locator('#paso-descripcion-cuerpo').isVisible()) await click('#paso-descripcion-editar');
        await click('#practica-profesional');
        if (await p.locator('#aviso-privacidad').isVisible()) await click('#privacidad-entendido');
      }
      await p.fill('#iniciales', 'AB');
      if (await p.locator('#aviso-privacidad').isVisible()) {
        await tomar('privacidad-educacion', true);
        await click('#privacidad-entendido');
      }
      if (nivel === 'basica') {
        await click('#guardar-descripcion');
        await tomar('basica-error', true);
      }
      if (await p.locator('#area-0').getAttribute('aria-expanded') === 'false') await click('#area-0');
      await tomar(nivel + '-area');
      await p.check('input[name=dimension-1][value="3"]');
      await click('#guardar-descripcion');
      await tomar(nivel + '-apoyos');
      if (nivel === 'basica') await elegir('#apoyos-resultados button[id^=elegir-]');
      await documento('#documento-estudiante', nivel);
      if (nivel === 'superior') {
        await click('#enlace-guia-practica');
        await tomar('guia-practica');
        await escape();
        await elegir('#practica-profesional-grupos button[id^=elegir-pp-c]');
        await click('#preparar-centro');
        await tomar('documento-centro', true);
        await p.check('#decision-centro');
        await click('#ver-centro');
        await p.locator('#vista[open]').waitFor();
        await tomar('vista-centro');
        await escape();
      }
    }
    await click('#contexto .cambiar-ambito');
    await click('#elegir-trabajo');
    await arriba();
    await tomar('trabajo', true);

    await click('#enlace-guia-trabajo');
    await tomar('guia-trabajo');
    await escape();
    await p.fill('#trabajo-iniciales', 'CD');
    if (await p.locator('#aviso-privacidad').isVisible()) {
      await tomar('privacidad-trabajo');
      await click('#privacidad-entendido');
    } else {
      await click('#privacidad');
      await tomar('privacidad-trabajo');
      await escape();
    }
    await click('#guardar-descripcion-trabajo');
    await tomar('trabajo-error');
    await click('#trabajo-area-0');
    await p.check('input[name=trabajo-dimension-1][value="3"]');
    await click('#guardar-descripcion-trabajo');
    await tomar('trabajo-ajustes');
    await elegir('#trabajo-tarjetas button[id^=elegir-]');
    await click('#trabajo-ir-acuerdos');
    await click('#guardar-acuerdos-trabajo');
    await tomar('trabajo-acuerdos-error', true);
    await p.locator('#trabajo-roles input').first().check();
    await p.fill('#trabajo-fecha', '2026-11-20');
    await p.fill('#trabajo-revision', '2026-12-04');
    await p.fill('#trabajo-criterio', 'Completa la primera tarea con la pauta.');
    await click('#guardar-acuerdos-trabajo');
    await documento('#documento-trabajo', 'trabajo');
    await click('#abrir-mochila');
    await tomar('mochila', true);
    p.once('dialog', async d => {
      hallado.confirmacionBorrar = d.message();
      await d.dismiss();
    });
    await click('#borrar');
    await escape();
    assert.deepEqual(errores, []);
    assert.equal(hallado.inicio.ancho, width);
    assert.equal(hallado['documento-trabajo'].modal, 'vista');
    return hallado;
  } finally {
    await p.close();
  }
}

async function zoomReal(raiz, zoom, ventana) {
  const perfil = await fs.mkdtemp(path.join(os.tmpdir(), 'prizma-zoom-'));
  let contexto;
  try {
    await fs.mkdir(path.join(perfil, 'Default'));
    // Chromium guarda el zoom de página en pasos de un factor 1,2.
    const preferencias = { partition: { default_zoom_level: { x: Math.log(zoom) / Math.log(1.2) } } };
    await fs.writeFile(path.join(perfil, 'Default', 'Preferences'), JSON.stringify(preferencias));
    contexto = await chromium.launchPersistentContext(perfil, {
      executablePath: process.env.CHROMIUM_BIN, viewport: null, args: ['--window-size=' + ventana + ',844'],
      locale: 'es-CL', reducedMotion: 'reduce', colorScheme: 'light'
    });
    const ancho = Math.round(ventana / zoom);
    const salida = path.join(raiz, 'zoom-' + zoom * 100);
    await fs.mkdir(path.join(salida, 'capturas'), { recursive: true });
    const p = contexto.pages()[0];
    let estados;
    if (zoom === 2) {
      estados = await recorrido(p, ancho, salida);
    } else {
      await p.goto(process.env.PRIZMA_URL || 'http://127.0.0.1:8000');
      await p.locator('#elegir-educacion').click();
      const inicio = await p.evaluate(medir);
      const guia = p.locator('#panel-dua .enlace-guia-dua');
      await guia.evaluate(e => e.scrollIntoView({ block: 'center' }));
      const hit = await guia.evaluate(e => {
        const r = e.getBoundingClientRect();
        const encima = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return { objetivo: e.className, caja: r.toJSON(), encima: encima?.outerHTML.slice(0, 240) };
      });
      await p.screenshot({ path: path.join(salida, 'capturas', 'reflujo-dua.png') });
      estados = { inicio, guia: hit };
    }
    assert.equal(estados.inicio.escala, zoom);
    await fs.writeFile(path.join(salida, 'mediciones.json'), JSON.stringify({ estados }));
    console.log('Zoom', zoom, ancho, Object.keys(estados).length);
  } finally {
    await contexto?.close();
    await fs.rm(perfil, { recursive: true, force: true });
  }
}

async function main() {
  const raiz = process.argv[2] || path.join(os.tmpdir(), 'prizma-050');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN });
  try {
    for (const width of [390, 768, 1280]) for (const tema of ['light', 'dark']) {
      const salida = path.join(raiz, width + '-' + tema);
      await fs.mkdir(path.join(salida, 'capturas'), { recursive: true });
      const p = await browser.newPage({
        viewport: { width, height: 844 }, colorScheme: tema, locale: 'es-CL', reducedMotion: 'reduce'
      });
      const estados = await recorrido(p, width, salida);
      await fs.writeFile(path.join(salida, 'mediciones.json'), JSON.stringify({ chromium: browser.version(), estados }));
      console.log(width, tema, Object.keys(estados).length);
    }
  } finally {
    await browser.close();
  }
  await zoomReal(raiz, 2, 1280);
  await zoomReal(raiz, 4, 1280);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
