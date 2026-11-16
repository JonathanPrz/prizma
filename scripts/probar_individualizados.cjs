const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const leer=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const c=vm.createContext({document:{querySelector:()=>({options:[{value:''},{value:'basica'},{value:'superior'}]}),querySelectorAll:()=>[]},localStorage:{getItem:()=>JSON.stringify({perfil:{},estudiante:{},seleccion:{}})}});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/,''),c);
const e=s=>JSON.parse(JSON.stringify(vm.runInContext(s,c)));
vm.runInContext(`catalogo=${leer('data/recomendaciones.json')}.filter(r=>!r.contextos.includes('practica')); fuentes=Object.fromEntries(catalogo.flatMap(r=>r.fuentes).map(id=>[id,{cita:id,url:'https://example.org'}])); estado.perfil.nivel='basica'`,c);
for(const v of ['null','1','"true"','[]','{}'])assert.equal(e(`normalizarPerfil({practica:${v}}).practica`),false);
assert.equal(e('normalizarPerfil({practica:true}).practica'),true);
for(const v of ['null','1','"inventada"','[]'])assert.equal(e(`normalizarAsignatura(${v})`),'');
for(const asignatura of ['','lenguaje','matematica','ciencias','historia']){
 vm.runInContext(`estado.asignatura=${JSON.stringify(asignatura)}`,c);
 assert.equal(e('objetivosVisibles().filter(r=>!Object.hasOwn(r,"asignatura")).length'),5);
 assert(e('objetivosVisibles().every(r=>!estado.asignatura||!r.asignatura||r.asignatura===estado.asignatura)'));
 for(const tipo of ['graduacion','priorizacion','temporalizacion','enriquecimiento','eliminacion'])assert.equal(e(`Object.hasOwn(objetivosVisibles().find(r=>r.subtipo==='${tipo}'),'asignatura')`),false);
 assert(e('objetivosVisibles().some(r=>r.id==="obj-enriquecimiento-comunicacion")'));
}
assert.equal(e('hayPracticas()'),false);
vm.runInContext(`catalogo=catalogo.concat([{...catalogo.find(r=>r.tipo==='acceso'),id:'sim-practica',contextos:['practica'],dimensiones:[1],niveles:['basica']},{...catalogo.find(r=>r.tipo==='acceso'),id:'sim-practica-otra',contextos:['practica'],dimensiones:[6],niveles:['basica']}]); Object.assign(estudianteActual(), normalizarEstudiante({dimensiones:{1:3}}))`,c);
assert.equal(e('hayPracticas()'),true);assert.deepEqual(e('practicasVisibles()'),[]);assert(!e('accesosVisibles().some(esPractica)'));
vm.runInContext('estado.perfil.practica=true',c);assert.deepEqual(e('practicasVisibles().map(r=>r.id)'),['sim-practica','sim-practica-otra']);assert(!e('accesosVisibles().some(esPractica)'));
vm.runInContext('estado.perfil.nivel="superior"',c);assert.equal(e('hayPracticas()'),false);assert.deepEqual(e('practicasVisibles()'),[]);
assert.equal(e('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{}}).perfil.practica'),false);assert.equal(e('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{}}).asignatura'),'');
assert.equal(e('validarRespaldo({app:"prizma",version:1,perfil:{},seleccion:{},asignatura:"ciencias",estudiante:{practica:true}}).asignatura'),'ciencias');
vm.runInContext('cargar()',c);assert.equal(e('estado.asignatura'),'');assert.equal(e('estado.perfil.practica'),false);
vm.runInContext('estado.perfil.nivel="basica"; Object.assign(estudianteActual(), normalizarEstudiante({dimensiones:{1:2,6:3},ayuda:"Visual",voz:"Prefiere pausas"})); estudianteActual().seleccion={"sim-practica":"", "acc-1-partes":""}',c);
const cif=e('documento().grupos.at(-1).cif');assert.equal(cif.length,2);assert.equal(cif[0][1],'Seguido');assert(cif[0][2].includes(e('catalogo.find(r=>r.id==="sim-practica").titulo')));assert.equal(cif[1][2],'Sin apoyo elegido');
assert(e('JSON.stringify(definicionPdf())').includes('Barreras y facilitadores (enfoque CIF)'));assert(e('definicionPdf().content.some(b=>b.table?.headerRows===1&&b.table.body[0].length===3)'));
vm.runInContext('estado.seleccion=Object.fromEntries([[catalogo.find(r=>r.tipo==="dua").id,""]]); estudianteActual().voz=""',c);assert.equal(e('documento().grupos.at(-1).cif.length'),2);
console.log('Correcto: asignatura validada y generales primero, práctica simulada/aislada por nivel, respaldos antiguos y tabla CIF con apoyos por dimensión y casos sin apoyo.');
