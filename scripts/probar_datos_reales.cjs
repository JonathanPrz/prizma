const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const leer = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const html = leer('index.html'), recomendaciones = JSON.parse(leer('data/recomendaciones.json')), referencias = JSON.parse(leer('data/fuentes.json')), necesidades = JSON.parse(leer('data/necesidades.json'));
const opciones = [...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m => ({value:m[1]}));
const controles = nombre => [...html.matchAll(new RegExp('name="'+nombre+'" value="([^"]+)"','g'))].map(m => ({value:m[1]}));
const c = vm.createContext({document:{querySelector:()=>({options:opciones}),querySelectorAll:s=>controles(s.match(/name="([^"]+)"/)?.[1])}});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);
const run=s=>vm.runInContext(s,c), dato=s=>JSON.parse(JSON.stringify(run(s)));
c.necesidadesReales=necesidades;c.fuentesReales=referencias;c.catalogoReal=recomendaciones;
// Deliberately check the real need file first: a regression to 11 must fail here.
assert.deepEqual(dato('validarNecesidades(necesidadesReales)'),necesidades,'Se descartaron necesidades reales');
run('necesidades=validarNecesidades(necesidadesReales);fuentes=validarFuentes(fuentesReales);catalogo=validarCatalogo(catalogoReal,fuentes)');
assert.deepEqual(dato('catalogo'),recomendaciones,'Se modificó o descartó una ficha');
assert.deepEqual(dato('Object.values(fuentes)'),referencias,'Se modificó o descartó una fuente');
assert.equal(run('DIMENSIONES.length'),14);
for(const nivel of opciones.map(o=>o.value)){
 c.nivel=nivel;
 run(`var entrada={app:'prizma',version:2,claseGuardada:true,mantenerIndividual:catalogo.filter(r=>r.dua).map(r=>r.id),
 perfil:{nivel,practica:true,actividad:${JSON.stringify(controles('actividad').map(c=>c.value))},evidencia:${JSON.stringify(controles('evidencia').map(c=>c.value))},meta:'m'.repeat(500),reflexion:'r'.repeat(500)},
 necesidades:necesidades.map(n=>n.id),propositos:Object.keys(PROPOSITOS),momentos:MOMENTOS.map(([id])=>id),asignatura:'lenguaje',
 seleccion:Object.fromEntries(catalogo.filter(r=>r.tipo==='dua').map(r=>[r.id,'Nota del curso'])),estudianteActivo:'caso-1',
 estudiantes:[{id:'caso-1',iniciales:'JP2',descripcionGuardada:true,practicaProfesional:true,dimensiones:Object.fromEntries(DIMENSIONES.map((_,i)=>[i+1,3])),ayuda:'a'.repeat(300),voz:'v'.repeat(300),acuerdo:{roles:['estudiante'],fecha:'2026-11-16',revision:'2026-12-01',estado:'completo'},seleccion:Object.fromEntries(catalogo.filter(r=>r.tipo!=='dua').map(r=>[r.id,'n'.repeat(2000)]))}]};var vuelta=validarRespaldo(entrada)`);
 assert.equal(run('vuelta.descartadas'),0);assert.deepEqual(dato('vuelta.estudiantes'),dato('entrada.estudiantes'));
 for(const campo of ['perfil','seleccion','necesidades','momentos','propositos','asignatura','mantenerIndividual','claseGuardada'])assert.deepEqual(dato('vuelta.'+campo),dato('entrada.'+campo),campo);
}
assert.equal(run('validarNecesidades([{...necesidades[0],dimensiones:[15]}]).length'),0);
assert.throws(()=>run('validarFuentes([...fuentesReales,fuentesReales[0]])'));
assert.throws(()=>run('validarCatalogo([{...catalogo[0],fuentes:["no-existe"]}],fuentes)'));
console.log(`Correcto: ${recomendaciones.length} fichas, ${referencias.length} fuentes y ${necesidades.length} necesidades reales pasan por los validadores de la página; nada se descarta, se renomina ni se recorta en el respaldo de todos los niveles.`);
