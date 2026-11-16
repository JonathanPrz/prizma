// Auditoría de solo lectura de la aplicación. Salidas limitadas a la carpeta de la tarea.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const raiz = path.resolve(__dirname, '..'), destino = path.join(raiz, 'docs/auditorias/024-estudiantes');
const leer = p => fs.readFileSync(path.join(raiz, p), 'utf8');
const perfiles = JSON.parse(fs.readFileSync(path.join(destino, 'perfiles.json'), 'utf8'));
const revision = JSON.parse(fs.readFileSync(path.join(destino, 'revision-acceso.json'), 'utf8'));
const catalogo = JSON.parse(leer('data/recomendaciones.json')), fuentes = JSON.parse(leer('data/fuentes.json'));
const app = leer('app.js'), html = leer('index.html');
// Fecha y zona fijas para que la tabla de resumen del PDF sea reproducible.
process.env.TZ='America/Santiago';
class FechaPrueba extends Date {constructor(...args){super(...(args.length?args:['2026-11-15T15:00:00-03:00']));}static now(){return new Date('2026-11-15T15:00:00-03:00').getTime();}}
const huellas=()=>Object.fromEntries(['app.js','index.html','styles.css','data/recomendaciones.json','data/necesidades.json','data/fuentes.json','docs/auditorias/024-estudiantes/perfiles.json'].map(p=>[p,crypto.createHash('sha256').update(leer(p)).digest('hex')]));
const opciones = [...html.split('<select id="nivel"')[1].split('</select>')[0].matchAll(/value="([^"]*)"/g)].map(m => ({value:m[1]}));
assert.equal(perfiles.length,10);assert.equal(new Set(perfiles.map(p=>p.id)).size,10);
const nodos = new Map();
function nodo(tag = 'div') { return {tag, hijos:[], atributos:{}, hidden:false, textContent:'', options:opciones,
  append(...h) {this.hijos.push(...h);}, replaceChildren(...h) {this.hijos=h;}, setAttribute(k,v) {this.atributos[k]=String(v);this[k]=v;}, addEventListener(){}, focus(){}}; }
const c = vm.createContext({Date:FechaPrueba,document:{createElement:nodo, querySelector:s=>{if(!nodos.has(s))nodos.set(s,nodo());return nodos.get(s);},querySelectorAll:()=>[]}});
nodos.set('.logo',{outerHTML:html.match(/<svg class="logo".*?<\/svg>/)[0]});
vm.runInContext(app.replace(/iniciar\(\);\s*$/, ''), c, {filename:'app.js'});
const run = s => vm.runInContext(s,c), json = s => JSON.parse(JSON.stringify(run(s)));
c.catalogoEntrada=catalogo;c.fuentesEntrada=fuentes;c.necesidadesEntrada=JSON.parse(leer('data/necesidades.json'));
run('catalogo=catalogoEntrada; fuentes=Object.fromEntries(fuentesEntrada.map(f=>[f.id,f])); necesidades=necesidadesEntrada');
function iniciar(n, nivel, practica) {
  c.entrada={perfil:{nivel,practica},estudiantes:perfiles.slice(0,n).map(p=>({...p,seleccion:{}})),estudianteActivo:perfiles[0].id,seleccion:{}};
  run('estado=normalizarDatos(entrada); inclusionDocumento=null');
}
function ids(n) {return (n?.atributos?.id?.startsWith('elegir-') ? [n.atributos.id.slice(7)] : []).concat((n?.hijos||[]).flatMap(h=>typeof h==='object'?ids(h):[]));}
function lista(p) {
  c.idActivo=p.id;run('estado.estudianteActivo=idActivo; pintarApoyos()');
  const acceso=ids(nodos.get('#apoyos-resultados'));
  const condicional=ids(nodos.get('#objetivos-tarjetas')).concat(ids(nodos.get('#desregulacion-resultados')));
  const adicionales=ids(nodos.get('#apoyos-adicionales'));
  return {acceso,condicional, todos:[...adicionales,...acceso,...condicional]};
}
const media = xs => xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : null;
function comparar(alumnos, campo) {
  const pares=[];
  for(let i=0;i<alumnos.length;i++)for(let j=i+1;j<alumnos.length;j++){
    const a=alumnos[i][campo],b=alumnos[j][campo], union=new Set([...a,...b]), comun=a.filter(id=>b.includes(id));
    pares.push({perfiles:[alumnos[i].perfil,alumnos[j].perfil],jaccard:union.size?comun.length/union.size:1,compartidas:comun.length,union:union.size,identicas:a.length===b.length&&a.every(id=>b.includes(id)),mismoOrden:JSON.stringify(a)===JSON.stringify(b)});
  }
  return {promedio:media(pares.map(p=>p.jaccard)),pares,identicos:pares.filter(p=>p.identicas).map(p=>p.perfiles)};
}
function condicional(p,r) {
  if(r.tipo==='objetivos') {
    if(p.id==='desafio'&&r.id==='obj-enriquecimiento')return {clase:'Adecuada',causa:null,justificacion:'Profundizar objetivos/proyectos responde al dominio rápido y al deseo de mayor desafío. Está en una sección condicional; el ejemplo de Historia requiere que ese sea el contenido trabajado.'};
    if(p.id==='desafio'&&['graduacion','priorizacion','temporalizacion','eliminacion'].includes(r.subtipo))return {clase:'Inadecuada',causa:'falta un dato en el perfil',justificacion:'El perfil ya logra las tareas y pide profundizar: simplificar, postergar o eliminar objetivos no responde a esa barrera. La ficha es una opción condicional, no una aplicación automática, pero no es pertinente para este caso descrito.'};
    return {clase:'Discutible',causa:'falta un dato en el perfil',justificacion:`«${r.titulo}» modifica o amplía el aprendizaje objetivo. El caso describe ${p.titulo.toLowerCase()}, pero no informa un objetivo no logrado pese a acceso ni la asignatura/metas que autoricen esta decisión. Se ofrece en «Si los apoyos de acceso no bastan», no como recomendación individual priorizada.`};
  }
  if(r.tipo==='desregulacion') {
    if(p.id==='ruido'&&!['dec-durante-dignidad','dec-despues-otros'].includes(r.id))return {clase:'Adecuada',causa:null,justificacion:`«${r.titulo}» permite anticipar, acompañar o revisar la angustia ante ruido/cambios ya descrita. Se interpreta según la fase del malestar, no como prueba de un diagnóstico.`};
    return {clase:'Discutible',causa:'falta un dato en el perfil',justificacion:`«${r.titulo}» es un recurso de la sección condicional «Si se desregula». ${p.id==='ruido'?'No se describió un episodio que requiera desplazar al curso o intervenir con quienes lo presenciaron.':'No se describieron episodios de desregulación ni esta fase de intervención.'} Su disponibilidad no significa que el programa haya detectado una crisis.`};
  }
  throw Error('Falta revisión de '+r.id);
}
const escenarios=[], clasificaciones=[];
const combinaciones=[['parvularia',false],...['basica','media','superior'].flatMap(n=>[[n,false],[n,true]])];
for(let n=1;n<=10;n++)for(const [nivel,practica]of combinaciones){
  iniciar(n,nivel,practica);
  const alumnos=perfiles.slice(0,n).map(p=>{
    const l=lista(p), puntajes=l.acceso.map(id=>({id,puntaje:json(`puntaje(catalogo.find(r=>r.id===${JSON.stringify(id)}))`)}));
    const grupos=[...new Set(puntajes.map(r=>r.puntaje))].map(p=>({puntaje:p,ids:puntajes.filter(r=>r.puntaje===p).map(r=>r.id)})).filter(g=>g.ids.length>1);
    const versiones=l.acceso.map(id=>({apoyo:id,version:json(`versionCurso(catalogo.find(r=>r.id===${JSON.stringify(id)}))`)})).filter(r=>r.version).map(r=>({apoyo:r.apoyo,dua:r.version.id,titulo:r.version.titulo,consideracion:r.version.consideracion}));
    return {perfil:p.id,acceso:l.acceso,condicionales:l.condicional,todos:l.todos,cantidadAcceso:l.acceso.length,cantidadTotal:l.todos.length,primerosCinco:l.acceso.slice(0,5),primerosCincoAlDesplegarTodo:l.todos.slice(0,5),puntajes,empates:grupos,versionesDua:versiones};
  });
  const repetidas=json('barrerasRepetidas()').map(b=>({...b,necesidad:json(`necesidades.find(n=>n.dimensiones.includes(${b.dimension})) || null`)}));
  const mensajesRepeticion=[];
  for(const par of comparar(alumnos,'acceso').identicos){
    const id=alumnos.find(a=>a.perfil===par[0]).acceso[0];c.parEntrada=par;c.idFicha=id;
    run('estado.estudiantes.forEach(e=>e.seleccion={}); parEntrada.forEach(id=>estado.estudiantes.find(e=>e.id===id).seleccion[idFicha]=""); estado.estudianteActivo=parEntrada[0]; pintarApoyos()');
    const textos=n=>[...(n?.tag==='p'?[n.textContent+(n.hijos||[]).filter(h=>typeof h==='string').join('')]:[]),...(n?.hijos||[]).filter(h=>typeof h==='object').flatMap(textos)];
    mensajesRepeticion.push({par,ficha:id,mensajes:textos(nodos.get('#apoyos-resultados')).filter(t=>t.startsWith('Lo elegiste para '))});
  }
  escenarios.push({n,nivel,practica,alumnos,mensajesRepeticion,promedioAcceso:media(alumnos.map(a=>a.cantidadAcceso)),promedioTotal:media(alumnos.map(a=>a.cantidadTotal)),similitudAcceso:comparar(alumnos,'acceso'),similitudTotal:comparar(alumnos,'todos'),barrerasRepetidas:repetidas});
  if(n===10&&['basica','superior'].includes(nivel))for(const a of alumnos)for(const id of a.todos){
    if(clasificaciones.some(r=>r.perfil===a.perfil&&r.nivel===nivel&&r.id===id))continue;
    const r=catalogo.find(r=>r.id===id),p=perfiles.find(p=>p.id===a.perfil);
    const juicio=revision[`${p.id}/${nivel}/${id}`]||condicional(p,r);
    assert(['Adecuada','Discutible','Inadecuada'].includes(juicio.clase));assert(juicio.justificacion.length>20);assert(juicio.clase==='Adecuada'||['una etiqueta de situación mal puesta en la ficha','una situación demasiado amplia','un orden poco útil','falta una ficha','falta un dato en el perfil'].includes(juicio.causa));
    clasificaciones.push({perfil:p.id,nivel,id,titulo:r.titulo,tipo:r.tipo,soloConPractica:r.contextos.includes('practica'),seccion:r.tipo==='acceso'?'Acceso':r.tipo==='objetivos'?'Si el acceso no basta':'Si se desregula',...juicio});
  }
}
assert.equal(escenarios.length,70);
for(const e of escenarios){assert.deepEqual(e.similitudAcceso.identicos,e.similitudTotal.identicos);for(const a of e.alumnos)assert.equal(a.todos.length,new Set(a.todos).size);}
assert.deepEqual(new Set(Object.keys(revision)),new Set(clasificaciones.filter(r=>r.tipo==='acceso').map(r=>`${r.perfil}/${r.nivel}/${r.id}`)));
// Contraprueba: cambiar solo los textos no cambia la lista de acceso.
iniciar(1,'basica',false);const antes=lista(perfiles[0]).acceso;run('estudianteActual().ayuda="Ahora ayuda otra cosa"; estudianteActual().voz="Una voz distinta"');const despues=lista(perfiles[0]).acceso;assert.deepEqual(antes,despues);
const pdfMake=require(path.join(raiz,'vendor/pdfmake/pdfmake.min.js'));const fuentesPdf={};vm.runInNewContext(leer('vendor/pdfmake/vfs_fonts.js'),fuentesPdf);pdfMake.vfs=fuentesPdf.pdfMake.vfs;
const norm=t=>t.replace(/\s+/g,' ').trim();
async function pdf(n,nivel,practica){
  iniciar(n,nivel,practica);
  for(const p of perfiles.slice(0,n)){const l=lista(p);c.seleccionEntrada=Object.fromEntries(l.acceso.slice(0,5).map(id=>[id,`Nota de prueba del perfil ${p.id}.`]));run('estudianteActual().seleccion=seleccionEntrada');}
  run('estado.seleccion=Object.fromEntries(visibles().slice(0,12).map(r=>[r.id,""])); inclusionDocumento={curso:true,estudiantes:estado.estudiantes.map(e=>e.id)}');
  const modelo=json('documento()');const paginas=await new Promise(resolve=>pdfMake.createPdf(run('definicionPdf()'))._getPages({},resolve));
  const textos=paginas.map(p=>norm(p.items.filter(i=>i.type==='line').sort((a,b)=>a.item.y-b.item.y||a.item.x-b.item.x).map(i=>i.item.inlines.map(x=>x.text).join('')).join(' ')));
  const fichas=modelo.grupos.flatMap(g=>g.acciones.map(a=>({estudiante:g.estudiante||null,id:a.id,paginas:textos.map((t,i)=>[t,i+1]).filter(([t])=>[a.titulo,...a.como,a.porque,a.dato,a.nota].filter(Boolean).every(x=>t.includes(norm(x)))).map(([,i])=>i)})));
  const inicios=modelo.grupos.filter(g=>g.estudiante).map(g=>({estudiante:g.estudiante,titulo:g.nombre,pagina:textos.findIndex(t=>t.includes(norm(g.nombre)))+1}));
  const grupos=modelo.grupos.flatMap(g=>g.acciones.filter((a,i)=>!g.estudiante?i===0:i===0||a.grupo!==g.acciones[i-1].grupo).map(a=>({titulo:g.estudiante?a.grupo:g.nombre,primeraFicha:a.id,unidos:textos.some(t=>t.includes(norm(g.estudiante?a.grupo:g.nombre))&&t.includes(norm(a.titulo)))})));
  const fuera=paginas.flatMap((p,i)=>p.items.filter(x=>x.type==='line'&&(!Number.isFinite(x.item.y)||x.item.y<0||x.item.y>842||x.item.x<0||x.item.x+x.item.inlineWidths>595.28)).map(()=>i+1));
  const resultado={n,nivel,practica,paginas:paginas.length,ordenEstudiantesCorrecto:inicios.every((e,i)=>e.pagina>0&&(!i||e.pagina>inicios[i-1].pagina)),reglaSeleccion:'12 primeras DUA del orden visible y hasta 5 primeros apoyos de acceso por perfil; sin objetivos ni DEC',inicios,fichas,grupos,fichasSinBloqueCompleto:fichas.filter(f=>!f.paginas.length),gruposHuerfanos:grupos.filter(g=>!g.unidos),lineasFueraDePagina:fuera};
  if(n===10&&nivel==='basica'&&!practica){const buffer=await new Promise(resolve=>pdfMake.createPdf(run('definicionPdf()')).getBuffer(resolve));fs.writeFileSync(path.join(destino,'prizma-plan-10-estudiantes.pdf'),buffer);fs.writeFileSync(path.join(destino,'pdf-10-textos.json'),JSON.stringify(textos,null,2)+'\n');}
  return resultado;
}
async function interfaz() {
  const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const http=require('node:http');
  const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
  const servidor=http.createServer((req,res)=>{
    const ruta=path.resolve(raiz,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));
    if(!ruta.startsWith(raiz+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(ruta,(error,contenido)=>{res.writeHead(error?404:200,{'Content-Type':tipos[path.extname(ruta)]||'application/octet-stream'});res.end(error?'No encontrado':contenido);});
  });
  await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
  let navegador;
  try {
    navegador=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
    const mediciones=[];
    for(const n of [4,10])for(const ancho of [1280,390]){
      const pagina=await navegador.newPage({viewport:{width:ancho,height:900}}),errores=[];
      pagina.on('pageerror',e=>errores.push(e.message));
      const estudiantes=perfiles.slice(0,n).map(p=>({...p,seleccion:{}}));
      await pagina.addInitScript(estudiantes=>{localStorage.setItem('prizma.v1',JSON.stringify({perfil:{nivel:'basica'},estudiantes,estudianteActivo:estudiantes.at(-1).id,seleccion:{}}));localStorage.setItem('prizma.privacidad.v1','1');localStorage.setItem('prizma.tema','claro');},estudiantes);
      await pagina.goto(`http://127.0.0.1:${servidor.address().port}/#apoyos`);
      await pagina.waitForSelector('#lista-estudiantes button',{state:'attached'});
      const renderizada=await pagina.locator('#apoyos-resultados button[id^="elegir-"]').evaluateAll(ns=>ns.map(n=>n.id.slice(7)));
      const esperada=escenarios.find(e=>e.n===n&&e.nivel==='basica'&&!e.practica).alumnos.at(-1).acceso;
      assert.deepEqual(renderizada,esperada);
      await pagina.screenshot({path:path.join(destino,`n${n}-${ancho}-resultados.png`)});
      if(ancho===390)await pagina.click('#abrir-filtros');
      const bot=pagina.locator('#lista-estudiantes button').first();await bot.focus();await pagina.keyboard.press('Enter');
      assert.equal(await pagina.locator('#iniciales').inputValue(),perfiles[0].iniciales);
      const ultimo=pagina.locator('#lista-estudiantes button').last();await ultimo.focus();await pagina.keyboard.press('Space');
      assert.equal(await pagina.locator('#iniciales').inputValue(),perfiles[n-1].iniciales);
      await pagina.screenshot({path:path.join(destino,`n${n}-${ancho}-selector.png`)});
      const medida={n,ancho,activo:perfiles[n-1].id,titulo:await pagina.locator('#t-apoyos').innerText(),presionados:await pagina.locator('#lista-estudiantes button[aria-pressed="true"]').count(),tecladoConservaCampos:true,ordenVmCoincide:true,sinDesborde:await pagina.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),arbolSelector:await pagina.locator('#lista-estudiantes').ariaSnapshot(),errores};
      if(ancho===390){
        await pagina.locator('#filtros-dialogo-cuerpo').evaluate(n=>n.scrollTop=n.scrollHeight);
        medida.contextoAlFinal=await pagina.evaluate(()=>{const visible=s=>{const r=document.querySelector(s).getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;};return {tituloDialogo:document.querySelector('#t-filtros-dialogo').textContent,inicialesEnPantalla:visible('#iniciales'),selectorEnPantalla:visible('#lista-estudiantes')};});
        await pagina.screenshot({path:path.join(destino,`n${n}-390-final-filtros.png`)});
      }
      assert(medida.sinDesborde);assert.equal(medida.presionados,1);assert.deepEqual(errores,[]);if(n===10){
        if(ancho===390)await pagina.click('#ver-resultados');
        await pagina.click('#tab-dua');await pagina.waitForFunction(()=>document.querySelector('#tab-dua').getAttribute('aria-selected')==='true');
        await pagina.locator('#barreras-repetidas').scrollIntoViewIfNeeded();
        medida.recuadroDua=await pagina.locator('#barreras-repetidas').innerText();
        await pagina.screenshot({path:path.join(destino,`n10-${ancho}-dua.png`)});
        await pagina.click('#barrera-1');medida.necesidadMarcada=await pagina.locator('#necesidad-tareas-largas').getAttribute('aria-pressed');assert.equal(medida.necesidadMarcada,'true');
      }
      mediciones.push(medida);await pagina.close();
    }
    const evidencia={entradaSha:huellas(),mediciones};fs.writeFileSync(path.join(destino,'interfaz.json'),JSON.stringify(evidencia,null,2)+'\n');return evidencia;
  } finally {if(navegador)await navegador.close();await new Promise(resolve=>servidor.close(resolve));}
}
const escapar=t=>String(t).replace(/\|/g,'\\|').replace(/\n/g,' '),fila=xs=>'| '+xs.map(escapar).join(' | ')+' |\n';
(async()=>{
  const pdfs=[];for(const n of [1,4,10])for(const [nivel,practica]of combinaciones){pdfs.push(await pdf(n,nivel,practica));console.log('PDF medido',n,nivel,practica?'práctica':'sin práctica');}
  const navegador=process.argv.includes("--interfaz") ? await interfaz() : (fs.existsSync(path.join(destino,"interfaz.json")) ? JSON.parse(fs.readFileSync(path.join(destino,"interfaz.json"),"utf8")) : null);
  const entradaSha=huellas();
  if(navegador)assert.deepEqual(navegador.entradaSha,entradaSha,'La evidencia de interfaz corresponde a otras entradas. Regenera con --interfaz.');
  const resultados={interfaz:navegador,metodo:{fechaPdf:'2026-11-15, America/Santiago, fija en la VM',interfaz:process.argv.includes('--interfaz')?'regenerada':'conservada y verificada por hash de entradas',revisionSha:crypto.createHash('sha256').update(fs.readFileSync(path.join(destino,'revision-acceso.json'))).digest('hex'),escenarios:70,orden:'orden real renderizado por pintarApoyos, no solo el puntaje',similitud:'Jaccard: intersección / unión, sin considerar orden; mismoOrden se informa aparte; N=1 no tiene pares',alcance:'acceso incluye grupo práctico; total añade fichas de secciones condicionales desplegadas; no cuenta DUA como apoyo individual',pertinencia:'juicio explícito por ficha/perfil; unión de práctica apagada y encendida en básica y superior',pdf:'21 casos: 1, 4 y 10 estudiantes por las 7 combinaciones; hasta 5 accesos y 12 DUA'},entradaSha,perfiles,escenarios,clasificaciones,contrapruebaTextos:{antes,despues,identicas:JSON.stringify(antes)===JSON.stringify(despues)},pdfs};
  fs.writeFileSync(path.join(destino,'resultados.json'),JSON.stringify(resultados,null,2)+'\n');
  let listas='# Listas y empates individuales (N = 10)\n\nEstos resultados individuales son iguales en los N anteriores donde ya existe el perfil; el script comprueba esa invariancia. Los cinco primeros son accesos en el orden visible. Los condicionales van aparte en los datos crudos.\n\n'+fila(['Nivel','Práctica','Perfil','Accesos','Total con condicionales','Cinco primeros, en orden','Empates: puntaje e IDs'])+fila(Array(7).fill('---'));
  let versiones='# Versiones DUA ofrecidas\n\nUnión de práctica apagada/encendida por perfil y nivel. La disponibilidad no certifica que la ficha individual sea pertinente. No hay selección DUA inicial en la medición.\n\n'+fila(['Nivel','Perfil','Apoyo','Versión DUA','Consideración','Título'])+fila(Array(6).fill('---'));
  const vistas=new Set();
  for(const e of escenarios.filter(e=>e.n===10))for(const a of e.alumnos){
    listas+=fila([e.nivel,e.practica?'Sí':'No',a.perfil,a.cantidadAcceso,a.cantidadTotal,a.primerosCinco.map(id=>id+' · '+catalogo.find(r=>r.id===id).titulo).join(' → '),a.empates.map(g=>g.puntaje+': '+g.ids.join(', ')).join('; ')||'Sin empates']);
    for(const v of a.versionesDua){const k=[e.nivel,a.perfil,v.apoyo].join('/');if(!vistas.has(k)){vistas.add(k);versiones+=fila([e.nivel,a.perfil,v.apoyo,v.dua,v.consideracion,v.titulo]);}}
  }
  for(const e of escenarios)for(const a of e.alumnos){const final=escenarios.find(f=>f.n===10&&f.nivel===e.nivel&&f.practica===e.practica).alumnos.find(f=>f.perfil===a.perfil);assert.deepEqual(a.todos,final.todos);}
  fs.writeFileSync(path.join(destino,'listas-y-empates.md'),listas);fs.writeFileSync(path.join(destino,'versiones-dua.md'),versiones);
  let clas='# Clasificación completa\n\nCada fila es un juicio del caso descrito, no una afirmación clínica ni una indicación de aplicar el apoyo. «Solo práctica» indica que requiere la casilla general. Las opciones condicionales se identifican explícitamente.\n\n'+fila(['Perfil','Nivel','ID','Ficha','Sección','Solo práctica','Clase','Causa probable','Justificación'])+fila(Array(9).fill('---'));
  for(const r of clasificaciones)clas+=fila([r.perfil,r.nivel,r.id,r.titulo,r.seccion,r.soloConPractica?'Sí':'No',r.clase,r.causa||'—',r.justificacion]);
  fs.writeFileSync(path.join(destino,'clasificacion.md'),clas);
  let observadas='# Fichas inadecuadas y discutibles\n\n';for(const tipo of ['Inadecuada','Discutible']){observadas+='## '+tipo+'\n\n'+fila(['ID','Perfil','Nivel','Sección','Causa probable','Justificación'])+fila(Array(6).fill('---'));for(const r of clasificaciones.filter(r=>r.clase===tipo))observadas+=fila([r.id,r.perfil,r.nivel,r.seccion,r.causa,r.justificacion]);observadas+='\n';}fs.writeFileSync(path.join(destino,'fichas-observadas.md'),observadas);
  let tablas='';for(let n=1;n<=10;n++){tablas+=`### N = ${n}\n\n`+fila(['Nivel','Práctica','Promedio acceso','Promedio total','Jaccard acceso','Jaccard total','Pares idénticos (acceso y total)'])+fila(Array(7).fill('---'));for(const e of escenarios.filter(e=>e.n===n))tablas+=fila([e.nivel,e.practica?'Sí':'No',e.promedioAcceso.toFixed(2),e.promedioTotal.toFixed(2),e.similitudAcceso.promedio===null?'—':e.similitudAcceso.promedio.toFixed(3),e.similitudTotal.promedio===null?'—':e.similitudTotal.promedio.toFixed(3),e.similitudAcceso.identicos.map(p=>p.join(' / ')).join('; ')||'—']);tablas+='\n';}
  let pertinencia=fila(['Perfil','Nivel','Adecuadas','Discutibles','Inadecuadas','Total unión'])+fila(Array(6).fill('---'));for(const p of perfiles)for(const n of ['basica','superior']){const rs=clasificaciones.filter(r=>r.perfil===p.id&&r.nivel===n);pertinencia+=fila([p.id,n,...['Adecuada','Discutible','Inadecuada'].map(t=>rs.filter(r=>r.clase===t).length),rs.length]);}
  let tablaPdf=fila(['N','Nivel','Práctica','Páginas','Fichas incompletas','Grupos huérfanos'])+fila(Array(6).fill('---'));for(const p of pdfs)tablaPdf+=fila([p.n,p.nivel,p.practica?'Sí':'No',p.paginas,p.fichasSinBloqueCompleto.length,p.gruposHuerfanos.length]);
  const descripciones=perfiles.map(p=>`### ${p.orden}. ${p.titulo} (${p.id}, ${p.iniciales})\n\n${p.descripcion}\n\nSituaciones: ${Object.entries(p.dimensiones).map(([d,f])=>`${json('DIMENSIONES')[Number(d)-1][0]}: ${json('FRECUENCIAS')[f]}`).join('; ')}.\n\nLe ayuda: «${p.ayuda}». Voz: «${p.voz}».\n`).join('\n');
  const plantilla=fs.readFileSync(path.join(destino,'informe-base.md'),'utf8');fs.writeFileSync(path.join(destino,'README.md'),plantilla.replace('{{PERFILES}}',descripciones).replace('{{TABLAS_N}}',tablas).replace('{{PERTINENCIA}}',pertinencia).replace('{{OBSERVADAS}}',observadas.replace(/^# .*\n\n/,'').replace(/^## /gm,'### ')).replace('{{PDF}}',tablaPdf));
  console.log('Auditoría completa:',escenarios.length,'escenarios,',clasificaciones.length,'clasificaciones y',pdfs.length,'PDF medidos.');
})().catch(error=>{console.error(error);process.exitCode=1;});
