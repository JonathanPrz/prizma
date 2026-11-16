// Fase A: motor real en vm, DOM mínimo y archivos locales; sin navegador ni red.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const raiz=path.resolve(__dirname,'../../..'),leer=p=>fs.readFileSync(path.join(raiz,p),'utf8');
const guardar=(n,d)=>{assert.equal(path.basename(n),n);fs.writeFileSync(path.join(__dirname,n),typeof d==='string'?d:JSON.stringify(d,null,2)+'\n');};
const rutas=['AGENTS.md','app.js','index.html','styles.css','data/recomendaciones.json','data/necesidades.json','data/fuentes.json','docs/casos/casos-semilla.json','docs/casos/asesoria-claude.md','docs/marca/040-flujo/flujo.png','docs/tareas/040-simulacion-y-asistente.md','docs/auditorias/040-simulacion/simular.cjs'];
const huellas=()=>Object.fromEntries(rutas.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(path.join(raiz,p))).digest('hex')])),antes=huellas();
const semillas=JSON.parse(leer('docs/casos/casos-semilla.json')),catalogo=JSON.parse(leer('data/recomendaciones.json')),necesidades=JSON.parse(leer('data/necesidades.json')),html=leer('index.html');
const nodos=new Map(),opciones=[...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m=>({value:m[1]}));
function nodo(tag='div'){return {tag,id:'',hijos:[],eventos:{},hidden:false,isConnected:true,options:opciones,textContent:'',value:'',replaceChildren(...h){this.hijos=h;},append(...h){this.hijos.push(...h);},setAttribute(k,v){this[k]=String(v);if(k==='id')nodos.set('#'+v,this);},getAttribute(k){return this[k]??null;},addEventListener(k,f){this.eventos[k]=f;},focus(){},scrollIntoView(){}};}
const n=s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);};
const c=vm.createContext({document:{createElement:nodo,getElementById:id=>nodos.get('#'+id),querySelector:s=>n(s),querySelectorAll:s=>{
 const nombre=s.match(/input\[name="(actividad|evidencia)"\]/)?.[1];return nombre?[...html.matchAll(new RegExp('name="'+nombre+'" value="([^"]+)"','g'))].map(m=>({value:m[1]})):[];
}},localStorage:{getItem:()=>null,setItem:()=>{}},window:{matchMedia:()=>({matches:true})},requestAnimationFrame:f=>f()});
const fuente=leer('app.js');assert(/iniciar\(\);\s*$/.test(fuente));vm.runInContext(fuente.replace(/iniciar\(\);\s*$/,''),c,{timeout:5000});
const run=s=>vm.runInContext(s,c,{timeout:5000}),json=s=>JSON.parse(JSON.stringify(run(s)));
c.catalogoEntrada=catalogo;c.necesidadesEntrada=necesidades;c.fuentesEntrada=JSON.parse(leer('data/fuentes.json'));run('catalogo=catalogoEntrada;necesidades=necesidadesEntrada;fuentes=Object.fromEntries(fuentesEntrada.map(f=>[f.id,f]))');
assert.equal(run('typeof fetch'),'undefined');assert.equal(run('typeof require'),'undefined');
const ids=arbol=>!arbol||arbol.hidden?[]:[...(arbol.id?.startsWith('elegir-')?[arbol.id.slice(7)]:[]),...(arbol.hijos||[]).filter(h=>h&&typeof h==='object').flatMap(ids)];
const unicos=a=>[...new Set(a)],misma=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function empates(lista,clave,corte){
 const grupos=new Map();for(const id of lista){const k=clave(id);if(!grupos.has(k))grupos.set(k,[]);grupos.get(k).push(id);}
 const empatados=[...grupos.values()].filter(g=>g.length>1);return {grupos:empatados,frontera:corte>0&&lista.length>corte&&clave(lista[corte-1])===clave(lista[corte])};
}
function simular(entrada){
 nodos.clear();c.entrada=entrada;
 // El HTML estático enlaza estos contenedores; la vm solo crea su contenido dinámico.
 for(const [padre,hijo] of [['#objetivos','#objetivos-tarjetas'],['#desregulacion','#desregulacion-resultados'],['#bloque-practica-profesional','#practica-profesional-grupos']])n(padre).hijos=[n(hijo)];
 run(`{
 const persona={...entrada,id:'persona',iniciales:'AA',dimensiones:entrada.dimensiones||{},descripcionGuardada:true,seleccion:{}};
 const laboral=entrada.ambito==='trabajo';
 estado=normalizarDatos({ambito:entrada.ambito,perfil:{nivel:laboral?'':entrada.nivel,practica:entrada.practica||false,meta:entrada.meta||'',actividad:[],evidencia:[]},necesidades:entrada.necesidades||[],estudiantes:laboral?[]:[persona],trabajadores:laboral?[persona]:[],estudianteActivo:'persona',trabajadorActivo:'persona',versionSituaciones:2});
 estado.pestana=laboral?'trabajo':'apoyos';borradorDua=null;inclusionDocumento=null;inclusionTrabajo=null;centroDocumento=null;
 }`);
 const laboral=entrada.ambito==='trabajo',personal=laboral||entrada.casoIndividual===true||(entrada.casoIndividual!==false&&Object.keys(entrada.dimensiones||{}).length>0);
 let dua=null,apoyos=null,trabajo=null,primeroDua=[],primeroPersonal=[],nucleo=[];
 if(laboral){run('pintarTrabajo()');trabajo=ids(n('#trabajo-tarjetas'));assert.deepEqual([...trabajo].sort(),json('[...ajustesTrabajo(),...catalogo.filter(r=>r.tipo==="trabajo"&&r.subtipo==="proceso")].map(r=>r.id)').sort());primeroPersonal=ids(n('#trabajo-tarjetas').hijos[0]?.tag==='section'?n('#trabajo-tarjetas').hijos[0]:null);nucleo=json('ajustesTrabajo().map(r=>r.id)');}
 else{
  run('pintarTarjetas()');dua=ids(n('#tarjetas'));primeroDua=ids(n('#tarjetas').hijos[0]?.tag==='section'?n('#tarjetas').hijos[0]:null);
  assert.deepEqual([...dua].sort(),json('visibles().map(r=>r.id)').sort());assert.deepEqual(primeroDua,json('primerasDua().map(r=>r.id)'));
  if(personal){run('pintarApoyos()');primeroPersonal=ids(n('#apoyos-resultados').hijos[0]?.tag==='section'?n('#apoyos-resultados').hijos[0]:null);
   apoyos=['#apoyos-resultados','#objetivos','#desregulacion','#apoyos-adicionales','#bloque-practica-profesional'].flatMap(s=>ids(n(s)));
   // Objetivos/DEC no pertenecen al ranking de acceso; se mantienen en total si el bloque se ofrece.
   const esperadoTotal=json(`(()=>{const sup=esSuperior();return [...accesosVisibles(),...practicasVisibles(),...(!sup&&estado.perfil.nivel!=='parvularia'?objetivosVisibles():[]),...(!sup?catalogo.filter(r=>r.tipo==='desregulacion'&&aplica(r)):[]),...catalogo.filter(r=>r.tipo==='adicional'&&aplica(r)),...(nivelPracticaProfesional()&&estudianteActual().practicaProfesional?Object.keys(TIPOS_PRACTICA).flatMap(fichasPracticaProfesional):[])].map(r=>r.id);})()`);assert.deepEqual([...apoyos].sort(),esperadoTotal.sort(),'Árbol simulado incluye todos los bloques ofrecidos');
   const acceso=json('[...accesosVisibles(),...practicasVisibles()].sort(compararAcceso).map(r=>r.id)');assert.deepEqual(ids(n('#apoyos-resultados')).sort(),[...acceso].sort());assert.deepEqual(primeroPersonal,acceso.length>3?acceso.slice(0,3):[]);
   nucleo=[...acceso,...ids(n('#bloque-practica-profesional'))];
  }
 }
 for(const lista of [dua,apoyos,trabajo])if(lista){assert.equal(lista.length,new Set(lista).size);assert(lista.every(id=>catalogo.some(r=>r.id===id)));}
 const persona=json(laboral?'trabajadorActual()':'estudianteActual()');
 const claves=new Map((laboral?nucleo:(personal?json('[...accesosVisibles(),...practicasVisibles()].sort(compararAcceso).map(r=>r.id)'):[])).map(id=>{c.idConsulta=id;return[id,json(`(()=>{const r=catalogo.find(r=>r.id===idConsulta),e=${laboral?'trabajadorActual()':'estudianteActual()'};return [puntaje(r,e),dimensionesCoincidentes(r,e).length/r.dimensiones.length];})()`)];}));
 const accesoOrden=[...claves.keys()];
 const empatePersonal=empates(accesoOrden,id=>JSON.stringify(claves.get(id)),primeroPersonal.length);
 const clavesDua=new Map((dua||[]).map(id=>{c.idConsulta=id;return[id,json('(()=>{const r=catalogo.find(r=>r.id===idConsulta);return [coincidenciasNecesidades(r).length,Number(practicaActiva()&&esPractica(r)),coincidencias(r).length,r.destacada];})()')];}));
 const total=apoyos||trabajo||[],duacons=id=>catalogo.find(r=>r.id===id).consideracion;
 const hit=(esperados,ofrecidos)=>({encontrados:esperados.filter(id=>ofrecidos.includes(id)),ausentes:esperados.filter(id=>!ofrecidos.includes(id))});
 return {normalizada:{nivel:json('estado.perfil.nivel'),necesidades:json('estado.necesidades'),practica:json('estado.perfil.practica'),practicaProfesional:!!persona.practicaProfesional,dimensiones:persona.dimensiones,meta:json('estado.perfil.meta'),ayuda:persona.ayuda,voz:persona.voz,tipoPuesto:persona.tipoPuesto||null},salidas:{dua,paraEmpezarDua:primeroDua,apoyos,trabajo,paraEmpezarPersonal:primeroPersonal,nucleo:unicos(nucleo)},metricas:{esperados:hit(entrada.incluir||[],total),esperadosPrimero:hit(entrada.incluir||[],primeroPersonal),excluidosPresentes:(entrada.excluir||[]).filter(id=>total.includes(id)),excluidosPrimero:(entrada.excluir||[]).filter(id=>primeroPersonal.includes(id)),dua:hit(entrada.dua||[],unicos((dua||[]).map(duacons))),duaPrimero:hit(entrada.dua||[],unicos(primeroDua.map(duacons)))},empates:{personal:empatePersonal,dua:empates(dua||[],id=>JSON.stringify(clavesDua.get(id)),0)}};
}
// Se verifica el oráculo sin corregir silenciosamente identificadores ni consideraciones.
assert.equal(semillas.length,9);const prosa=new Map([...leer('docs/casos/asesoria-claude.md').matchAll(/^\| (\d+) \| (.*)$/gm)].map(m=>[Number(m[1]),unicos(m[2].match(/\b(?:acc|prac|sup|pp|obj|dec|tr)-[a-z0-9-]+\b/g)||[])]));
const oraculo=semillas.map(s=>({id:s.id,enAsesoriaNoEnIncluir:(prosa.get(s.id)||[]).filter(id=>!s.incluir.includes(id)),enIncluirNoEnAsesoria:s.incluir.filter(id=>!(prosa.get(s.id)||[]).includes(id)),idsInexistentes:[...(s.incluir||[]),...(s.excluir||[])].filter(id=>!catalogo.some(r=>r.id===id)),consideracionesSinCatalogo:(s.dua||[]).filter(k=>!catalogo.some(r=>r.tipo==='dua'&&r.consideracion===k))}));
const resultados=semillas.map(s=>({tipo:'semilla',oraculo:'literalSemilla',id:'S'+s.id,origen:s.id,entrada:s,...simular(s)}));
// LCG fijo: 80 variantes únicas por semilla, de una a tres situaciones con frecuencia positiva.
let aleatorio=400040;const rnd=n=>{aleatorio=(Math.imul(1664525,aleatorio)+1013904223)>>>0;return Math.floor(aleatorio/4294967296*n);};
const niveles=['parvularia','basica','media','superior'],vistas=new Set(semillas.map(s=>JSON.stringify([s.ambito,s.nivel,Object.entries(s.dimensiones).sort((a,b)=>a[0]-b[0]),[...(s.necesidades||[])].sort(),!!s.practica,!!s.practicaProfesional])));
for(const s of semillas){let hechas=0,intentos=0;while(hechas<80){assert(++intentos<20000);const dims={};const candidatas=Object.keys(s.dimensiones).map(Number),cantidad=1+rnd(3);while(Object.keys(dims).length<cantidad){const d=Object.keys(dims).length===0&&candidatas.length&&hechas%2===0?candidatas[rnd(candidatas.length)]:1+rnd(14);dims[d]=1+rnd(3);}
 const nivel=s.ambito==='trabajo'?'trabajo':niveles[rnd(4)],neces= s.ambito==='trabajo'?[]:unicos(Array.from({length:rnd(3)},()=>necesidades[rnd(necesidades.length)].id));
 const e={...s,nivel,dimensiones:dims,necesidades:neces,practica:s.ambito!=='trabajo'&&!!rnd(2),practicaProfesional:s.ambito!=='trabajo'&&['media','superior'].includes(nivel)&&!!rnd(2)};
 const clave=JSON.stringify([e.ambito,e.nivel,Object.entries(dims).sort((a,b)=>a[0]-b[0]),[...neces].sort(),e.practica,e.practicaProfesional]);if(vistas.has(clave))continue;vistas.add(clave);hechas++;
 resultados.push({tipo:'variante',oraculo:'referenciaDelOrigenNoValidada',id:`V${s.id}-${String(hechas).padStart(2,'0')}`,origen:s.id,entrada:e,...simular(e)});
}}
const variantes=resultados.filter(r=>r.tipo==='variante');assert.equal(variantes.length,720);assert.equal(vistas.size,729);
assert(variantes.every(r=>Object.keys(r.entrada.dimensiones).length>=1&&Object.keys(r.entrada.dimensiones).length<=3));
const firma=r=>Object.fromEntries(['dua','apoyos','trabajo','paraEmpezarDua','paraEmpezarPersonal'].map(k=>[k,r.salidas[k]]));
assert.deepEqual(simular(semillas[0]),simular(semillas[0]),'No hay residuos entre casos');
console.log('729 casos calculados; comparaciones pareadas.');
const sinSituaciones=simular({...semillas[0],dimensiones:{},casoIndividual:true});assert(sinSituaciones.salidas.apoyos.includes('obj-graduacion'));assert.equal(sinSituaciones.salidas.nucleo.length,0,'Quitar la última frecuencia conserva el caso y sus bloques generales');
const pares=[],anclas=resultados.filter(r=>r.tipo==='semilla'||Number(r.id.split('-')[1])<=4);
function par(a,nombre,valor){const e={...a.entrada,casoIndividual:a.salidas.apoyos!==null||a.salidas.trabajo!==null,...valor},r=simular(e),antes=firma(a),despues=firma(r);const cambios={};for(const k of Object.keys(antes)){const x=antes[k]||[],y=despues[k]||[];cambios[k]={conjunto:!misma([...x].sort(),[...y].sort()),orden:!misma(x,y),agregados:y.filter(id=>!x.includes(id)),quitados:x.filter(id=>!y.includes(id))};}pares.push({ancla:a.id,entrada:nombre,cambio:valor,cambios});}
for(const a of anclas){const e=a.entrada;
 if(e.ambito!=='trabajo'){
  par(a,'nivel',{nivel:niveles[(niveles.indexOf(e.nivel)+1)%4]});par(a,'taller',{practica:!e.practica});par(a,'practicaProfesional',{practicaProfesional:!e.practicaProfesional});
  for(const n of necesidades)par(a,'necesidad:'+n.id,{necesidades:(e.necesidades||[]).includes(n.id)?e.necesidades.filter(id=>id!==n.id):[...(e.necesidades||[]),n.id]});
 }
 if(a.salidas.apoyos!==null||a.salidas.trabajo!==null)for(let d=1;d<=14;d++){const dims={...e.dimensiones};if(dims[d])delete dims[d];else dims[d]=2;par(a,'situacion:'+d,{dimensiones:dims});}
 const d=Object.keys(e.dimensiones)[0];if(d)par(a,'frecuenciaPrimera',{dimensiones:{...e.dimensiones,[d]:e.dimensiones[d]%3+1}});
 for(const campo of (e.ambito==='trabajo'?['ayuda','voz','tipoPuesto']:['meta','ayuda','voz']))par(a,campo,{[campo]:'Texto de control alternativo.'});
}
const resumenPares=[...new Set(pares.map(p=>p.entrada))].map(nombre=>{const ps=pares.filter(p=>p.entrada===nombre);return {entrada:nombre,pares:ps.length,efectos:Object.fromEntries(Object.keys(ps[0].cambios).map(k=>[k,{conjunto:ps.filter(p=>p.cambios[k].conjunto).length,orden:ps.filter(p=>p.cambios[k].orden).length}]))};});
// Ganancia de información media sobre pertenencia de cada ID; no sobre una firma de alta cardinalidad.
function entropia(xs){const m=new Map();for(const x of xs)m.set(x,(m.get(x)||0)+1);return [...m.values()].reduce((h,n)=>h-(n/xs.length)*Math.log2(n/xs.length),0);}
function informacion(xs,ys){const grupos=new Map();xs.forEach((x,i)=>{if(!grupos.has(x))grupos.set(x,[]);grupos.get(x).push(ys[i]);});return Math.max(0,entropia(ys)-[...grupos.values()].reduce((h,g)=>h+g.length/ys.length*entropia(g),0));}
assert.equal(informacion([0,0,1,1],[0,0,1,1]),1);assert.equal(informacion([0,0,1,1],[0,1,0,1]),0);
const features=[['nivel',e=>e.nivel],['taller',e=>!!e.practica],['practicaProfesional',e=>!!e.practicaProfesional],...Array.from({length:14},(_,i)=>['situacion:'+ (i+1),e=>e.dimensiones[i+1]||0]),...necesidades.map(n=>['necesidad:'+n.id,e=>(e.necesidades||[]).includes(n.id)])];
console.log('Pares calculados; ganancia de información.');
const importancia=[];
for(const canal of ['dua','apoyos','trabajo']){const rs=variantes.filter(r=>r.salidas[canal]!==null),universo=unicos(rs.flatMap(r=>r.salidas[canal]));const primero=canal==='dua'?'paraEmpezarDua':'paraEmpezarPersonal';
 for(const [nombre,fn] of features){const xs=rs.map(r=>fn(r.entrada));importancia.push({canal,entrada:nombre,n:rs.length,ids:universo.length,entropiaEntrada:entropia(xs),gananciaMediaTotal:universo.reduce((s,id)=>s+informacion(xs,rs.map(r=>r.salidas[canal].includes(id))),0)/universo.length,gananciaMediaPrimero:universo.reduce((s,id)=>s+informacion(xs,rs.map(r=>r.salidas[primero].includes(id))),0)/universo.length});}}
// Agrupación exploratoria por representante fijo y Jaccard >= .65; no hay inferencia de diagnósticos.
const jaccard=(a,b)=>{const sa=new Set(a),sb=new Set(b);return !sa.size&&!sb.size?1:[...sa].filter(x=>sb.has(x)).length/new Set([...sa,...sb]).size;};
assert.equal(jaccard(['a'],['a','b']),.5);assert.equal(jaccard([],[]),1);
const grupos=[];for(const r of variantes){let g=grupos.find(g=>g.ambito===r.entrada.ambito&&jaccard(g.nucleo,r.salidas.nucleo)>=.65);if(!g){g={id:'G'+(grupos.length+1),ambito:r.entrada.ambito,representante:r.id,nucleo:r.salidas.nucleo,miembros:[]};grupos.push(g);}g.miembros.push(r.id);}
const agrupos=grupos.map(g=>{const rs=variantes.filter(r=>g.miembros.includes(r.id)),distribucion=campo=>Object.fromEntries([...new Set(rs.map(r=>r.entrada[campo]))].map(x=>[String(x),rs.filter(r=>r.entrada[campo]===x).length]));return {...g,n:g.miembros.length,niveles:distribucion('nivel'),situaciones:Object.fromEntries(Array.from({length:14},(_,i)=>[i+1,rs.filter(r=>r.entrada.dimensiones[i+1]).length]).filter(([,n])=>n))};});
const contrastes=[
 {pregunta:1,caso:1,campo:'meta',a:'Evaluar decodificación lectora.',b:'Evaluar comprensión del contenido, no decodificación.'},
 {pregunta:2,caso:7,dimensiones:{6:3},campo:'ayuda',a:'Usa Braille para acceder al texto.',b:'Usa lupa y ampliación para acceder al texto.'},
 {pregunta:3,caso:5,campo:'ayuda',a:'Ya domina el contenido, comprobado en una tarea.',b:'Todavía no domina el contenido.'},
 {pregunta:4,caso:8,campo:'tipoPuesto',a:'Bodega con grúas horquilla y alarmas solo sonoras.',b:'Oficina sin maquinaria ni alarmas sonoras.'},
 {pregunta:5,caso:3,campo:'ayuda',a:'Existe PAEC y protocolo DEC acordado.',b:'No hay PAEC ni protocolo DEC informado.'},
 {pregunta:6,caso:8,campo:'voz',a:'Decide compartir solo los ajustes con su jefatura.',b:'No autoriza compartir antecedentes.'},
 {pregunta:7,caso:4,campo:'voz',a:'La familia necesita intérprete de creole.',b:'La familia participa en español sin intérprete.'},
 {pregunta:8,caso:1,campo:'ayuda',a:'Criterio: inicia cuatro de cinco tareas sin recordatorio.',b:'Sin criterio de logro acordado.'},
 {pregunta:9,caso:9,campo:'meta',a:'Conflictos sostenidos del curso: revisar el diseño.',b:'Crisis puntual: activar el protocolo DEC.'}
].map(t=>{const base={...semillas.find(s=>s.id===t.caso),...(t.dimensiones?{dimensiones:t.dimensiones}:{})},a=simular({...base,[t.campo]:t.a}),b=simular({...base,[t.campo]:t.b});return {...t,entradaBase:base,normalizadaA:a.normalizada,normalizadaB:b.normalizada,salidasA:a.salidas,salidasB:b.salidas,listasIguales:misma(firma(a),firma(b))};});
assert(contrastes.every(t=>t.listasIguales),'Los contrastes son evidencia del motor actual, no deben fijarse como requisito futuro.');
guardar('contrastes.json',contrastes);
const conteos=resultados.map(r=>({id:r.id,tipo:r.tipo,origen:r.origen,dua:r.salidas.dua?.length??null,primeroDua:r.salidas.paraEmpezarDua.length,personal:(r.salidas.apoyos||r.salidas.trabajo)?.length??null,primeroPersonal:r.salidas.paraEmpezarPersonal.length,nucleo:r.salidas.nucleo.length,empateCorte:r.empates.personal.frontera}));
guardar('resultados.jsonl',resultados.map(r=>JSON.stringify(r)).join('\n')+'\n');guardar('oraculo.json',oraculo);guardar('pares.jsonl',pares.map(r=>JSON.stringify(r)).join('\n')+'\n');guardar('sensibilidad.json',resumenPares);guardar('importancia.json',importancia);guardar('agrupamientos.json',agrupos);guardar('conteos.json',conteos);
const orden=(a,b)=>b.gananciaMediaTotal-a.gananciaMediaTotal;
const esc=s=>String(s??'—').replace(/\|/g,'\\|'),tabla=(h,rs)=>'| '+h.join(' | ')+' |\n| '+h.map(()=> '---').join(' | ')+' |\n'+rs.map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n')+'\n';
guardar('semillas.md','# Resultados de las nueve semillas\n\nCada cobertura expresa encontrados / esperados literales del JSON. Guion = no aplica. No se otorga 100% a un denominador cero. Total incluye grupos ofrecidos aunque estén plegados; Para empezar solo es el ranking de acceso (o ajustes en Trabajo).\n\n'+tabla(['Semilla','Esperados primero','Esperados total','Ausentes total','Excluidos presentes','DUA primero','DUA total','IDs primero'],resultados.slice(0,9).map(r=>{const m=r.metricas,fr=(a,n)=>n?a.length+'/'+n:'—';return[r.id,fr(m.esperadosPrimero.encontrados,r.entrada.incluir.length),fr(m.esperados.encontrados,r.entrada.incluir.length),m.esperados.ausentes.join(', ')||'ninguno',m.excluidosPresentes.join(', ')||'ninguno',fr(m.duaPrimero.encontrados,(r.entrada.dua||[]).length),fr(m.dua.encontrados,(r.entrada.dua||[]).length),r.salidas.paraEmpezarPersonal.join(', ')];})))
 guardar('importancia.md','# Ganancia de información por entrada\n\nExploratoria, calculada solo en las 720 variantes sintéticas. Unidad: bits medios por ID del universo del canal (constantes incluidos). La distribución se fijó para explorar reglas, no representa la población. La ganancia asociativa no mide utilidad pedagógica ni valida preguntas ausentes. Las comparaciones pareadas en sensibilidad.json mantienen el resto de entradas fijo.\n\n'+['dua','apoyos','trabajo'].map(canal=>'## '+canal+'\n\n'+tabla(['Entrada','N','IDs','IG total (bits/ID)','IG Para empezar (bits/ID)'],importancia.filter(r=>r.canal===canal).sort(orden).map(r=>[r.entrada,r.n,r.ids,r.gananciaMediaTotal.toFixed(6),r.gananciaMediaPrimero.toFixed(6)]))).join('\n'));
assert.deepEqual(huellas(),antes);guardar('metodo.json',{base:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:raiz,encoding:'utf8'}).trim(),node:process.version,semillaAleatoria:400040,semillas:9,variantes:720,pares:pares.length,anclas:anclas.length,grupos:grupos.length,huellas:antes,red:'No se importan módulos de red ni se exponen fetch/require a vm; se omite iniciar().',metodoAgrupacion:'Representante fijo, primer grupo compatible, mismo ámbito y Jaccard de núcleo >= .65; orden V1-01…V9-80.'});
console.log(JSON.stringify({semillas:9,variantes:720,pares:pares.length,grupos:grupos.length,anclas:anclas.length}));
