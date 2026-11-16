const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const app = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const cabeza = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const control = app.slice(app.indexOf('  const tema = $("#tema");'), app.indexOf('  prepararAvisos(); prepararPracticaProfesional();'));
for (const oscuro of [false, true]) for (const guardado of [null, 'sistema', 'dispositivo', 'invalido', 'claro', 'oscuro', 'bloqueado']) {
  let memoria = guardado, click;
  const boton = {setAttribute(k,v){this[k]=v;},addEventListener(k,f){assert.equal(k,'click');click=f;}};
  const document = {documentElement:{dataset:{}}};
  const c = vm.createContext({document, window:{matchMedia:()=>({matches:oscuro})},
    localStorage:{getItem(){if(guardado==='bloqueado')throw Error();return memoria;},setItem(k,v){assert.equal(k,'prizma.tema');if(guardado==='bloqueado')throw Error();memoria=v;}}, $:()=>boton});
  vm.runInContext(cabeza,c);
  const inicial = ['claro','oscuro'].includes(guardado) ? guardado : oscuro ? 'oscuro':'claro';
  assert.equal(document.documentElement.dataset.tema,inicial);
  vm.runInContext(control,c);
  for (let i=0;i<2;i++) {
    const siguiente = document.documentElement.dataset.tema==='claro'?'oscuro':'claro';
    assert.equal(boton['aria-label'],'Cambiar a modo '+siguiente);assert.equal(boton.title,boton['aria-label']);
    click();assert.equal(document.documentElement.dataset.tema,siguiente);
    if(guardado!=='bloqueado')assert.equal(memoria,siguiente);
  }
}
assert(!html.includes('<select id="tema"'));
for(const clase of ['icono-sol','icono-luna'])assert(html.includes('class="'+clase+'"'));
assert(html.includes('class="mochila-texto solo-lectores">Mi mochila</span>'));
console.log('Correcto: tema antes de pintar, dispositivo/elección/legado/almacenamiento bloqueado, alternancia y nombres accesibles; mochila conserva texto accesible.');
