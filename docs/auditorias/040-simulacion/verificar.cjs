// Repite la simulación y comprueba evidencia y métricas sin escribir fuera de esta carpeta.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const carpeta=__dirname,raiz=path.resolve(carpeta,'../../..'),leer=n=>JSON.parse(fs.readFileSync(path.join(carpeta,n),'utf8'));
const archivos=['resultados.jsonl','pares.jsonl','conteos.json','oraculo.json','sensibilidad.json','importancia.json','agrupamientos.json','contrastes.json','metodo.json','semillas.md','importancia.md'];
const hashes=()=>Object.fromEntries(archivos.map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(path.join(carpeta,n))).digest('hex')]));
const antes=hashes();cp.execFileSync(process.execPath,[path.join(carpeta,'simular.cjs')],{cwd:raiz,stdio:'inherit'});assert.deepEqual(hashes(),antes,'Repetición idéntica byte a byte');
const rs=fs.readFileSync(path.join(carpeta,'resultados.jsonl'),'utf8').trim().split('\n').map(JSON.parse),semillas=rs.filter(r=>r.tipo==='semilla'),variantes=rs.filter(r=>r.tipo==='variante');
assert.equal(semillas.length,9);assert.equal(variantes.length,720);assert(variantes.every(r=>r.oraculo==='referenciaDelOrigenNoValidada'));
assert.equal(new Set(variantes.map(r=>r.id)).size,720);
const catalogo=JSON.parse(fs.readFileSync(path.join(raiz,'data/recomendaciones.json'),'utf8'));
for(const r of rs){
 for(const [k,lista] of Object.entries(r.salidas))if(lista){assert.equal(lista.length,new Set(lista).size);assert(lista.every(id=>catalogo.some(f=>f.id===id)));}
 const personal=r.salidas.apoyos||r.salidas.trabajo||[];
 assert.deepEqual(r.metricas.esperados.encontrados,r.entrada.incluir.filter(id=>personal.includes(id)));
 assert.deepEqual(r.metricas.excluidosPresentes,r.entrada.excluir.filter(id=>personal.includes(id)));
 assert(r.salidas.paraEmpezarPersonal.every(id=>personal.includes(id)));
 if(r.tipo==='variante'){assert([1,2,3].includes(Object.keys(r.entrada.dimensiones).length));assert(Object.values(r.entrada.dimensiones).every(f=>[1,2,3].includes(f)));assert(!r.entrada.practicaProfesional||['media','superior'].includes(r.entrada.nivel));}
}
const grupos=leer('agrupamientos.json'),porId=new Map(variantes.map(r=>[r.id,r]));assert.equal(grupos.reduce((n,g)=>n+g.n,0),720);assert.equal(new Set(grupos.flatMap(g=>g.miembros)).size,720);
for(const g of grupos)for(const id of g.miembros){const a=new Set(g.nucleo),b=new Set(porId.get(id).salidas.nucleo),union=new Set([...a,...b]);const similitud=union.size?[...a].filter(x=>b.has(x)).length/union.size:1;assert(similitud>=.65);assert.equal(porId.get(id).entrada.ambito,g.ambito);}
const metodo=leer('metodo.json');for(const [p,h] of Object.entries(metodo.huellas))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(raiz,p))).digest('hex'),h);
assert(cp.execFileSync('git',['diff','--name-only','HEAD'],{cwd:raiz,encoding:'utf8'}).trim().split('\n').filter(Boolean).every(p=>p.startsWith('docs/auditorias/040-simulacion/')));
assert(cp.execFileSync('git',['status','--porcelain','-uall'],{cwd:raiz,encoding:'utf8'}).trimEnd().split('\n').filter(Boolean).every(p=>p.slice(3).startsWith('docs/auditorias/040-simulacion/')));
fs.writeFileSync(path.join(carpeta,'validacion.json'),JSON.stringify({reproducible:true,archivosComparados:archivos,semillas:9,variantes:720,pares:metodo.pares,grupos:grupos.length,huellasIntactas:true,metricasRecontadas:true},null,2)+'\n');
console.log('Correcto: 9 semillas, 720 variantes, métricas, agrupamientos y huellas; resultados reproducidos byte a byte.');
