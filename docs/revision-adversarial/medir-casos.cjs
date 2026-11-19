// Mide ofertas y documentos; no redacta recomendaciones ni objeciones.
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const raiz = path.resolve(__dirname, '../..');
const leer = p => fs.readFileSync(path.join(raiz, p), 'utf8');
const nodos = new Map();
function nodo() { return {value:'', options:['','parvularia','basica','media','superior'].map(value=>({value})), children:[], setAttribute(){}, addEventListener(){}, replaceChildren(...x){this.children=x;}, append(...x){this.children.push(...x);}, focus(){}, scrollIntoView(){}}; }
const c = vm.createContext({document:{querySelector:s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);},querySelectorAll:()=>[],createElement:nodo},window:{matchMedia:()=>({matches:false})},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>f()});
vm.runInContext(leer('app.js').replace(/iniciar\(\);\s*$/, ''), c);
const run = s => vm.runInContext(s,c);
c.datos = JSON.parse(leer('data/recomendaciones.json')); c.ns = JSON.parse(leer('data/necesidades.json'));
run('catalogo=datos; necesidades=ns');
const casos = JSON.parse(fs.readFileSync(path.join(__dirname,'casos-propios.json'),'utf8'));
if (casos.length !== 15 || new Set(casos.map(x=>x.id)).size !== 15) throw Error('Se requieren 15 casos distintos');
const resultados = casos.map(caso=>{
  c.caso=caso;
  run(`estado=normalizarDatos({ambito:caso.ambito||'educacion',perfil:{nivel:caso.nivel,practica:caso.practica||false},necesidades:caso.necesidades,estudiantes:[{...caso,id:'a',descripcionGuardada:true}],trabajadores:[{...caso,id:'b'}]})`);
  const ofrecidos = JSON.parse(JSON.stringify(run(caso.ambito==='trabajo' ? 'ajustesTrabajo().concat(catalogo.filter(r=>r.tipo==="trabajo"&&r.subtipo==="proceso")).map(r=>r.id)' : '[...accesosVisibles(),...practicasVisibles(),...(estudianteActual().practicaProfesional?[...fichasPracticaProfesional("institucion"),...fichasPracticaProfesional("centro"),...fichasPracticaProfesional("estudiante")]:[])].map(r=>r.id)')));
  const dua = caso.ambito==='trabajo'?[]:JSON.parse(JSON.stringify(run('visibles().map(r=>r.id)')));
  const primeras = caso.ambito==='trabajo'?[]:JSON.parse(JSON.stringify(run('primerasDua().map(r=>r.id)')));
  for(const id of [...caso.dua,...caso.apoyos]) if(!c.datos.some(r=>r.id===id))throw Error(id);
  return {id:caso.id,ofrecidos,dua,primeras,ausentes:caso.apoyos.filter(id=>!ofrecidos.includes(id)),duaAusentes:caso.dua.filter(id=>!dua.includes(id))};
});
console.log(JSON.stringify(resultados,null,2));
