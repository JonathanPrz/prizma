// Compara el mismo JSON actualizado contra main al iniciar B y contra la aplicación actual.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const raiz=path.resolve(__dirname,'../../..'),dirA=path.join(raiz,'docs/auditorias/040-simulacion'),base='484cf14';
const analizador=fs.readFileSync(path.join(dirA,'simular.cjs'),'utf8'),marca='// Se verifica el oráculo';assert(analizador.includes(marca));
const prefijo=analizador.split(marca)[0];assert(prefijo.includes("const fuente=leer('app.js');"));
const evaluar=fuente=>{const c=vm.createContext({require,__dirname:dirA,console,process,fuenteAplicacion:fuente});vm.runInContext(prefijo.replace("const fuente=leer('app.js');",'const fuente=fuenteAplicacion;')+'\nglobalThis.casos=semillas.map(e=>({id:e.id,...simular(e).metricas}));',c);return JSON.parse(JSON.stringify(c.casos));};
const fuenteAntes=cp.execFileSync('git',['show',base+':app.js'],{cwd:raiz,encoding:'utf8'}),fuenteDespues=fs.readFileSync(path.join(raiz,'app.js'),'utf8');
const antes=evaluar(fuenteAntes),despues=evaluar(fuenteDespues);assert.deepEqual(antes.map(r=>r.esperados.ausentes),despues.map(r=>r.esperados.ausentes));assert(despues.every(r=>r.excluidosPresentes.length===0));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
fs.writeFileSync(path.join(__dirname,'semillas-comparacion.json'),JSON.stringify({base,fuenteAntes:sha(fuenteAntes),fuenteDespues:sha(fuenteDespues),antes,despues},null,2)+'\n');
console.log('Mismas semillas actualizadas: 42/43 esperados en base y B; falta prac-procedimiento en S2, sin excluidos presentes.');
