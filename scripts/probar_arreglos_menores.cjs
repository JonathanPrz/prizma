const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

process.env.TZ = 'America/Santiago';
const contexto = vm.createContext({ Date: class extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-11-16T02:30:00.000Z'])); }
} });
const codigo = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
vm.runInContext(codigo.replace(/iniciar\(\);\s*$/, ''), contexto);
assert.equal(vm.runInContext('fechaLocal()', contexto), '2026-11-15');
assert.equal(vm.runInContext('new Date().toISOString()', contexto), '2026-11-16T02:30:00.000Z');
for (const [n, texto] of [[0, '0 acciones'], [1, '1 acción'], [3, '3 acciones']]) {
  assert.equal(vm.runInContext(`plural(${n}, "acción", "acciones")`, contexto), texto);
}
console.log('Correcto: singular/plural y fecha local a las 23:30 en Santiago.');
