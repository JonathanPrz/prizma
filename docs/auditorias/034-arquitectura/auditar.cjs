// Verificación de la arquitectura 036; conserva la evidencia original de 034.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright'));}
const raiz=path.resolve(__dirname,'../../..'),url=process.env.PRIZMA_URL||'http://127.0.0.1:8036';
const salida=path.join(raiz,'docs/auditorias/036-verificacion'),capturas=path.join(raiz,'docs/marca/036-arquitectura');fs.mkdirSync(salida,{recursive:true});fs.mkdirSync(capturas,{recursive:true});
const leer=p=>fs.readFileSync(path.join(raiz,p),'utf8'),guardar=(p,x)=>fs.writeFileSync(path.join(salida,p),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n');
const esc=s=>String(s??'').replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
const tabla=(titulos,filas)=>'| '+titulos.map(esc).join(' | ')+' |\n| '+titulos.map(()=>'---').join(' | ')+' |\n'+filas.map(f=>'| '+f.map(esc).join(' | ')+' |').join('\n')+'\n';
const recomendaciones=JSON.parse(leer('data/recomendaciones.json')),referencias=JSON.parse(leer('data/fuentes.json')),necesidades=JSON.parse(leer('data/necesidades.json'));
const archivos=['app.js','index.html','styles.css','data/recomendaciones.json','data/fuentes.json','data/necesidades.json'];
const huellas=()=>Object.fromEntries(archivos.map(p=>[p,crypto.createHash('sha256').update(leer(p)).digest('hex')]));
const antes=huellas(),tipos=['dua','acceso','objetivos','desregulacion','adicional','practica-profesional','trabajo'];
const contar=lista=>Object.fromEntries(tipos.map(tipo=>[tipo,{total:lista.filter(r=>r.tipo===tipo).length,subtipos:Object.fromEntries([...new Set(recomendaciones.filter(r=>r.tipo===tipo).map(r=>r.subtipo||'sin subtipo'))].map(subtipo=>[subtipo,lista.filter(r=>r.tipo===tipo&&(r.subtipo||'sin subtipo')===subtipo).length]))} ]));
const idsAgrupados=lista=>Object.fromEntries(tipos.map(t=>[t,lista.filter(r=>r.tipo===t).map(r=>r.id)]));
const datos={global:contar(recomendaciones),niveles:{},referencias:referencias.length,necesidades:necesidades.length};
for(const nivel of ['parvularia','basica','media','superior']){const elegibles=recomendaciones.filter(r=>r.tipo!=='trabajo'&&(!r.niveles.length||r.niveles.includes(nivel)));datos.niveles[nivel]={conteo:contar(elegibles),ids:idsAgrupados(elegibles)};}
const laborales=recomendaciones.filter(r=>r.tipo==='trabajo');datos.niveles.trabajo={conteo:contar(laborales),ids:idsAgrupados(laborales)};
assert.equal(recomendaciones.length,new Set(recomendaciones.map(r=>r.id)).size);assert.equal(laborales.length,64);
const variantes=new Map();
async function inventariar(p,estado){
 const filas=await p.evaluate(()=>{
  const texto=n=>{const c=n.cloneNode(true);c.querySelectorAll('[hidden], .solo-lectores:not(.mochila-texto)').forEach(n=>n.remove());return c.textContent.replace(/\s+/g,' ').trim();};
  const ruta=n=>n.id?'#'+n.id:n.parentElement? ruta(n.parentElement)+' > '+n.tagName.toLowerCase()+':nth-child('+([...n.parentElement.children].indexOf(n)+1)+')':n.tagName.toLowerCase();
  const selector='button,input,select,option,textarea,a,summary,legend,label,h1,h2,h3,h4,p,li,dialog,noscript';
  return [...document.querySelectorAll(selector)].filter(n=>!n.closest('.tarjeta')&&!n.closest('#hoja')).map(n=>({selector:ruta(n),tag:n.tagName.toLowerCase(),tipo:n.getAttribute('type')||'',texto:(!n.matches('input,textarea,dialog')?texto(n):''),etiqueta:n.matches('input,textarea,select')?(n.labels?[...n.labels].map(texto).join(' / '):''):'',aria:n.getAttribute('aria-label')||'',placeholder:n.getAttribute('placeholder')||'',valor:n.matches('input,textarea')?n.value:'',limite:n.getAttribute('maxlength')||'',href:n.getAttribute('href')||'',zona:n.closest('dialog')?.id||n.closest('[role="tabpanel"]')?.id||(n.closest('header')?'cabecera':n.closest('footer')?'pie':'barra de contexto / general'),visibilidad:!!(n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden'&&!n.closest('dialog:not([open])')),deshabilitado:n.disabled===true}));
 });
 for(const r of filas){const clave=JSON.stringify({...r,visibilidad:undefined,deshabilitado:undefined});if(!variantes.has(clave))variantes.set(clave,{...r,estados:[],visibleEn:[],deshabilitadoEn:[]});const v=variantes.get(clave);v.estados.push(estado);if(r.visibilidad)v.visibleEn.push(estado);if(r.deshabilitado)v.deshabilitadoEn.push(estado);}
 return filas;
}
async function pagina(b,ancho=1280){const p=await b.newPage({viewport:{width:ancho,height:900},colorScheme:'light',reducedMotion:'reduce'});await p.goto(url);await p.waitForFunction(()=>catalogo.length===240);p.on('dialog',d=>d.accept());return p;}
async function matriz(b){
 const p=await pagina(b);await p.click('#elegir-educacion');const html=await p.evaluate(()=>new DOMParser().parseFromString(document.documentElement.outerHTML,'text/html').documentElement.outerHTML); // DOM inicial, también controles generados.
 guardar('estructura-inicial.html',html);
 for(const nivel of ['parvularia','basica','media','superior']){
  await p.selectOption('#nivel',nivel);await inventariar(p,nivel+'-contexto');
  datos.niveles[nivel].runtime=await p.evaluate(nivel=>{
   const e=estudianteActual();e.id='auditoria-estudiante-1';estado.estudianteActivo=e.id;e.iniciales='JP';e.dimensiones=Object.fromEntries(DIMENSIONES.map((_,i)=>[i+1,3]));e.descripcionGuardada=true;estado.perfil.practica=false;e.practicaProfesional=false;estado.asignatura='';estado.momentos=[];estado.propositos=[];estado.necesidades=[];borradorDua=null;
   const respuesta={nivel,roles:rolesPermitidos().map(r=>ROLES_ACUERDO[r]),vocabulario:{clase:voc('clase'),curso:voc('curso'),estudiantes:voc('estudiantes')},rótulos:catalogo.filter(r=>r.tipo!=='dua'&&r.tipo!=='trabajo'&&aplica(r)).map(r=>({id:r.id,texto:tipoOficial(r)})),sinPractica:{dua:visibles().map(r=>r.id),acceso:accesosVisibles().map(r=>r.id),objetivos:objetivosVisibles().map(r=>r.id),desregulacion:esSuperior()?[]:catalogo.filter(r=>r.tipo==='desregulacion'&&aplica(r)).map(r=>r.id)}};
   estado.perfil.practica=true;e.practicaProfesional=true;sincronizarPerfil();sincronizarEstudiante();pintarTarjetas();
   respuesta.conPracticas={acceso:practicasVisibles().map(r=>r.id),profesional:Object.fromEntries(Object.keys(TIPOS_PRACTICA).map(t=>[t,fichasPracticaProfesional(t).map(r=>r.id)]))};
   return respuesta;
  },nivel);
  await p.click('#tab-apoyos');await p.waitForFunction(()=>estado.pestana==='apoyos');await p.evaluate(()=>{document.querySelectorAll('#panel-apoyos details').forEach(d=>d.open=true);sincronizarEstudiante();});await inventariar(p,nivel+'-14situaciones-ambasPracticas');
  await p.locator('.enlace-guia-apoyos').first().click();await inventariar(p,nivel+'-guiaApoyos');await p.keyboard.press('Escape');
  if(['media','superior'].includes(nivel)){await p.click('#enlace-guia-practica');await inventariar(p,nivel+'-guiaPractica');await p.keyboard.press('Escape');}
  await p.click('#tab-dua');await p.waitForFunction(()=>estado.pestana==='dua');
 }
 await p.evaluate(()=>{location.hash='#trabajo';});await p.waitForFunction(()=>estado.pestana==='trabajo');
 datos.niveles.trabajo.runtime=await p.evaluate(()=>{const e=trabajadorActual();e.id='auditoria-trabajador-1';estado.trabajadorActivo=e.id;e.iniciales='AB';e.dimensiones=Object.fromEntries(DIMENSIONES.map((_,i)=>[i+1,3]));e.descripcionGuardada=true;sincronizarTrabajo();return {roles:Object.values(ROLES_TRABAJO),ajustes:ajustesTrabajo().map(r=>r.id),proceso:catalogo.filter(r=>r.tipo==='trabajo'&&r.subtipo==='proceso').map(r=>r.id)};});await inventariar(p,'trabajo-14situaciones');await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(capturas,'trabajo-contexto-1280.png')});
 for(const id of ['enlace-guia-trabajo','privacidad']){await p.click('#'+id);await inventariar(p,'trabajo-'+id);await p.keyboard.press('Escape');}
 await p.click('#tema');await inventariar(p,'trabajo-oscuro');
 // Otros estados son fixtures explícitos, separados de los recorridos de primera vez.
 await p.evaluate(()=>{const e=trabajadorActual();e.seleccion={'tr-subtitulos':'Nota ficticia'};e.acuerdo={roles:['persona'],fecha:'2026-11-16',revision:'2026-12-01',estado:'completo'};pintarSeleccion();pintarEstadoTrabajo();});await inventariar(p,'trabajo-acuerdoCompleto');
 await p.evaluate(()=>{marcarRevision(trabajadorActual());pintarEstadoTrabajo();});await inventariar(p,'trabajo-porRevisar');
 await p.click('#documento-trabajo');await inventariar(p,'trabajo-elegirPersonas');await p.keyboard.press('Escape');
 await p.evaluate(()=>{location.hash='#dua';});await p.waitForFunction(()=>estado.pestana==='dua');
 await p.evaluate(()=>{estado.perfil.nivel='basica';estado.seleccion={'dua-1-1':''};estado.estudiantes=[{id:'auditoria-estudiante-1',...normalizarEstudiante({iniciales:'JP',dimensiones:{1:3},descripcionGuardada:true}),seleccion:{'acc-1-agenda':''}},{id:'auditoria-estudiante-2',...normalizarEstudiante({iniciales:'JP',dimensiones:{1:3},descripcionGuardada:true}),seleccion:{'acc-1-agenda':''}}];estado.estudianteActivo=estado.estudiantes[0].id;sincronizarPerfil();sincronizarEstudiante();pintarTarjetas();pintarSeleccion();});await inventariar(p,'basica-apoyoRepetido-duplicado');
 await p.click('#abrir-mochila');await inventariar(p,'mochila-tresAmbitos');await p.click('#pdf');await inventariar(p,'documento-elegirCursoEstudiante');await p.keyboard.press('Escape');
 await p.evaluate(()=>{estado.seleccion={'dua-6-2':''};pintarTarjetas();pintarApoyos();pintarSeleccion();});await inventariar(p,'basica-versionDuaElegida');
 await p.close();
}
async function recorrido(b,persona,ancho){
 const p=await pagina(b,ancho),acciones=[],errores=[];p.on('pageerror',e=>errores.push(e.message));let clicks=0;
 const scroll=()=>p.evaluate(()=>({ventana:Math.round(scrollY),dialogos:Object.fromEntries([...document.querySelectorAll('dialog[open]')].map(d=>[d.id,Math.round(d.scrollTop)]))}));
 async function paso(tipo,selector,descripcion,valor){const antes=await scroll();let n=0;
  if(tipo==='click'){await p.locator(selector).click();n=1;}
  else if(tipo==='check'){n=await p.locator(selector).isChecked()?0:1;await p.locator(selector).check();}
  else if(tipo==='fill'){await p.locator(selector).click();await p.locator(selector).fill(valor);n=1;}
  else if(tipo==='nivel'){await p.selectOption(selector,valor);n=2;}
  clicks+=n;acciones.push({paso:acciones.length+1,tipo,selector,descripcion,clicksEquivalentes:n,antes,despues:await scroll()});
 }
 async function captura(nombre){await inventariar(p,`${persona}-${ancho}-${nombre}`);await p.screenshot({path:path.join(capturas,`${persona}-${ancho}-${nombre}.png`)});}
 await captura('01-inicio');const inicial=await p.locator('body').innerText();
 if(persona==='basica'){
  await paso('click','#elegir-educacion','Elegir Educación');
  await paso('nivel','#nivel','Elegir Educación básica','basica');await paso('click','#panel-dua .enlace-guia-dua','Abrir Cómo usar el DUA');await paso('click','#guia-empezar','Empezar');
  await paso('fill','#meta','Anotar meta','Explicar el ciclo del agua.');await paso('click','#necesidad-tareas-largas','Elegir tareas largas');await paso('click','#guardar-clase','Guardar clase');await paso('click','#elegir-dua-6-2','Elegir agenda para el curso');
  await paso('click','#tab-apoyos','Cambiar a estudiante');await p.waitForFunction(()=>estado.pestana==='apoyos');await paso('fill','#iniciales','Escribir iniciales','JP');await p.waitForSelector('#aviso-privacidad[open]');await captura('02-privacidad');await paso('click','#privacidad-entendido','Entendido');await p.waitForFunction(()=>!document.querySelector('#aviso-privacidad').open);
  await paso('check','#area-0','Abrir Cognición y aprendizaje');await paso('check','input[name="dimension-1"][value="3"]','Atención y organización: Casi siempre');await paso('fill','#estudiante-ayuda','Facilitador','Una agenda visible.');await paso('fill','#estudiante-voz','Voz del caso ficticio','Prefiere saber qué viene después.');await paso('click','#guardar-descripcion','Guardar descripción');await paso('click','#apoyos-resultados details:has(#elegir-acc-1-agenda) > summary','Abrir Presentación de la información');await paso('click','#elegir-acc-1-agenda','Elegir agenda individual ya cubierta por DUA');await captura('03-apoyos');
  await paso('click',ancho===390?'#continuar':'#indicador-pasos a:nth-child(3)','Continuar a acuerdos');await paso('check','input[name="rol-acuerdo"][value="estudiante"]','Rol estudiante');await paso('fill','#fecha-acuerdo','Fecha del acuerdo','2026-11-16');await paso('fill','#revision-acuerdo','Próxima revisión','2026-12-01');await paso('click','#guardar-acuerdos','Guardar acuerdos');
  await paso('click','#documento-estudiante','Ver documento escolar');await paso('click','#generar-documento','Generar curso y estudiante activos');
 }else if(persona==='instituto'){
  await paso('click','#elegir-educacion','Elegir Educación');
  await paso('nivel','#nivel','Elegir Educación superior','superior');await paso('click','#tab-apoyos','Cambiar a Ajustes razonables');await p.waitForFunction(()=>estado.pestana==='apoyos');await paso('click','.enlace-guia-apoyos:first-child','Abrir guía de superior');await paso('click','#guia-apoyos-entendido','Entendido');
  await paso('fill','#iniciales','Iniciales del caso ficticio','IP');await p.waitForSelector('#aviso-privacidad[open]');await paso('click','#privacidad-entendido','Entendido');await p.waitForFunction(()=>!document.querySelector('#aviso-privacidad').open);
  await paso('check','#area-0','Abrir Cognición');await paso('check','input[name="dimension-1"][value="3"]','Atención y organización: Casi siempre');await paso('check','#practica-profesional','Este estudiante hará su práctica profesional');await paso('fill','#estudiante-voz','Voz del estudiante ficticio','Decide compartir instrucciones por pasos.');await paso('click','#guardar-descripcion','Guardar descripción');
  await paso('click','#enlace-guia-practica','Abrir responsabilidades de la práctica');await captura('02-guia-practica');await paso('click','#guia-practica-entendido','Entendido');await paso('click','#practica-profesional-grupos details:has(#elegir-pp-c-pasos) > summary','Abrir apoyos del centro');await paso('click','#elegir-pp-c-pasos','Elegir ajuste que puede hacer el centro');await captura('03-practica');
  await paso('click','#preparar-centro','Preparar documento para el centro');await paso('check','input[name="compartir-centro"][value="pp-c-pasos"]','Elegir solo el ajuste por pasos');await paso('check','#decision-centro','Confirmar decisión del estudiante');await captura('03b-decision-compartir');await paso('click','#ver-centro','Ver documento para el centro');
 }else{
  await paso('click','#elegir-trabajo','Elegir Trabajo');await p.waitForFunction(()=>estado.pestana==='trabajo');await captura('01b-trabajo');await paso('click','#enlace-guia-trabajo','Abrir Qué exige la ley');await paso('click','#guia-trabajo button','Entendido');
  await paso('fill','#trabajo-iniciales','Iniciales del caso ficticio','AB');await p.waitForSelector('#aviso-privacidad[open]');await captura('02-privacidad');await paso('click','#privacidad-entendido','Entendido');await p.waitForFunction(()=>!document.querySelector('#aviso-privacidad').open);
  await paso('fill','#trabajo-puesto','Tipo de puesto','Administrativo');await paso('check','#trabajo-area-3','Abrir Sensorial y física');await paso('check','input[name="trabajo-dimension-13"][value="3"]','Audición: Casi siempre');await paso('fill','#trabajo-ayuda','Facilitador','Mensajes escritos.');await paso('fill','#trabajo-voz','Voz de la persona ficticia','Prefiere subtítulos en reuniones.');await paso('click','#guardar-descripcion-trabajo','Guardar descripción');await paso('click','#elegir-tr-subtitulos','Elegir subtítulos');await captura('03-ajustes');
  await paso('click',ancho===390?'#continuar':'#indicador-pasos a:nth-child(3)','Continuar a acuerdos');await paso('check','input[name="rol-trabajo"][value="persona"]','Rol Persona trabajadora');await paso('fill','#trabajo-fecha','Fecha del acuerdo','2026-11-16');await paso('fill','#trabajo-revision','Próxima revisión','2026-12-01');await paso('click','#guardar-acuerdos-trabajo','Guardar acuerdos');
  await paso('click','#documento-trabajo','Ver documento de trabajo');await paso('check','#opciones-documento input','Elegir explícitamente a AB');await paso('click','#generar-documento','Generar documento laboral');
 }
 await p.waitForSelector('#vista[open]');await captura('04-documento');const clicksHastaVista=clicks;
 const textoDocumento=await p.locator('#hoja').innerText(),modelo=await p.evaluate(()=>modeloDocumento());
 const descargar=p.waitForEvent('download');await paso('click','#descargar','Descargar primer PDF');const pdf=await descargar;await pdf.saveAs(path.join(salida,`${persona}-${ancho}-documento.pdf`));
 const resultado={persona,ancho,inicial,clicksHastaVista,clicksHastaPdf:clicks,acciones,ventanaMovimientos:acciones.filter(a=>a.antes.ventana!==a.despues.ventana).length,distanciaVentanaPx:acciones.reduce((n,a)=>n+Math.abs(a.despues.ventana-a.antes.ventana),0),dialogosMovimientos:acciones.filter(a=>Object.keys(a.antes.dialogos).some(id=>id in a.despues.dialogos&&a.antes.dialogos[id]!==a.despues.dialogos[id])).length,desborde:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),textoDocumento,modelo,errores};
 assert.equal(resultado.desborde,false);assert.deepEqual(errores,[]);await p.close();return resultado;
}
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const p=await pagina(b);await inventariar(p,'primera-visita');await p.close();
  await matriz(b);
  for(const [n,d] of Object.entries(datos.niveles)){
   if(n==='trabajo'){assert.equal(d.runtime.ajustes.length+d.runtime.proceso.length,d.conteo.trabajo.total);continue;}
   const r=d.runtime;
   assert.equal(new Set([...r.sinPractica.acceso,...r.conPracticas.acceso]).size,d.conteo.acceso.total);
   assert.equal(r.sinPractica.acceso.length+r.conPracticas.acceso.length,d.conteo.acceso.total);
   assert.equal(Object.values(r.conPracticas.profesional).flat().length,d.conteo['practica-profesional'].total);
  }
  const recorridos=[];
  for(const persona of ['basica','instituto','rrhh'])for(const ancho of [1280,390]){console.log('Recorrido',persona,ancho);recorridos.push(await recorrido(b,persona,ancho));}
  guardar('conteos.json',datos);
  guardar('conteos.md','# Conteos calculados desde data/ y contrastados con app.js\n\nElegibles no significa visibles a la vez. Los filtros del caso y los pasos plegados se detallan en README.md. Cero no equivale a un control ausente. Trabajo se cuenta por tipo, no como un quinto valor de niveles.\n\n'+tabla(['Tipo / subtipo',...Object.keys(datos.niveles)],tipos.flatMap(t=>[[t+' · total',...Object.values(datos.niveles).map(n=>n.conteo[t].total)],...Object.keys(datos.global[t].subtipos).map(st=>[t+' / '+st,...Object.values(datos.niveles).map(n=>n.conteo[t].subtipos[st])])]))+'\n## Escenario máximo del caso\n\nCatorce situaciones en «Casi siempre», todas las asignaturas, sin filtros de momento ni propósito. Ambas casillas de práctica activadas para medir sus conjuntos; el código comprueba aparte si el nivel permite mostrarlos.\n\n'+tabla(['Nivel','DUA','Acceso sin taller','Acceso taller','Objetivos','Desregulación','Práctica: institución / centro / estudiante'],Object.entries(datos.niveles).filter(([n])=>n!=='trabajo').map(([n,d])=>[n,d.runtime.sinPractica.dua.length,d.runtime.sinPractica.acceso.length,d.runtime.conPracticas.acceso.length,d.runtime.sinPractica.objetivos.length,d.runtime.sinPractica.desregulacion.length,Object.values(d.runtime.conPracticas.profesional).map(a=>a.length).join(' / ')])));
  for(const r of recorridos)guardar(`${r.persona}-${r.ancho}-documento.md`,'# Texto de la vista previa\n\nCaso ficticio. Texto normalizado por el navegador; el PDF correspondiente conserva su presentación.\n\n'+r.textoDocumento+'\n');
  const terminos=['apoyos','apoyos individualizados','apoyos adicionales','adecuaciones','adecuaciones de acceso','adecuaciones en los objetivos','ajustes','ajustes razonables','ajustes necesarios','acciones','DUA','fichas','recomendaciones'];
  guardar('terminos.json',Object.fromEntries(terminos.map(t=>[t,{interfaz:[...variantes.values()].filter(r=>(r.texto+' '+r.etiqueta+' '+r.aria).toLowerCase().includes(t.toLowerCase())).map(r=>({selector:r.selector,zona:r.zona,texto:r.texto||r.etiqueta,visibleEn:r.visibleEn})),fichas:recomendaciones.filter(r=>[r.titulo,...r.como,r.porque].join(' ').toLowerCase().includes(t.toLowerCase())).map(r=>r.id),codigo:leer('app.js').split('\n').map((texto,i)=>({linea:i+1,texto})).filter(r=>r.texto.toLowerCase().includes(t.toLowerCase()))}])));
guardar('recorridos.json',recorridos);guardar('inventario-observado.json',[...variantes.values()]);
  guardar('fichas.md','# Textos de las 240 fichas del catálogo\n\nSe conserva el texto de los campos; los saltos de línea de esta tabla son de presentación. Los controles comunes de tarjeta se documentan en el inventario. No se modificó data/.\n\n'+tabla(['ID','Tipo / subtipo','Niveles (vacío = transversal)','Contextos','Título exacto','Cómo, pasos exactos','Por qué funciona, exacto','Fuentes'],recomendaciones.map(r=>[r.id,r.tipo+' / '+(r.subtipo||'—'),r.niveles.join(', ')||'[]',r.contextos.join(', '),r.titulo,r.como.map((s,i)=>(i+1)+'. '+s).join('\n'),r.porque,r.fuentes.join(', ')])));
  guardar('fuentes-visibles.md','# Textos de los enlaces Fuentes\n\n'+tabla(['ID','Texto exacto del enlace','Destino'],referencias.map(f=>[f.id,f.cita,f.url])));
  const v=[...variantes.values()];guardar('inventario-observado.md','# Inventario de elementos y variantes observadas\n\nTexto DOM normalizado solo en espacios. Las etiquetas de accesibilidad se separan de texto y placeholder. Una fila sin texto puede ser un campo, región o mensaje todavía vacío. Los estados son fixtures, salvo primera-visita; no son recorridos humanos. Visibilidad considera CSS, hidden, details y apertura del diálogo. Repeticiones se listan por selector distinto; los contenidos completos de fichas están en fichas.md.\n\n'+tabla(['Selector','Elemento','Zona','Texto exacto / etiqueta','ARIA / placeholder / límite','Estados observados','Visible en','Deshabilitado en','Mismo texto en'],v.map(r=>[r.selector,r.tag+(r.tipo?' '+r.tipo:''),r.zona,r.texto||r.etiqueta,[r.aria,r.placeholder,r.limite?'Máximo '+r.limite:''].filter(Boolean).join(' / '),r.estados.join(', '),r.visibleEn.join(', ')||'No visible en las muestras',r.deshabilitadoEn.join(', '),[...new Set(v.filter(o=>o.selector!==r.selector&&o.texto&&o.texto===r.texto).map(o=>o.selector))].join(', ')])));
  const lineas=leer('app.js').split('\n');guardar('plantillas-mensajes.md','# Plantillas de mensajes y rótulos en app.js\n\nLocalizadores del corte auditado. Esto es código literal, no una afirmación de que todos los mensajes se hayan disparado. Incluye errores, confirmaciones, pluralización y estados transitorios; las variantes observadas se registran aparte. No propone cambios.\n\n'+tabla(['Línea','Código original'],lineas.map((s,i)=>[i+1,s.trim()]).filter(([i,s])=>/textContent\s*=|text:|throw new Error|window\.confirm|const (AVISO|PIE_|CIF_)|"aria-label"|placeholder:/.test(s))));
  guardar('constantes-y-opciones.json',await (async()=>{const p=await pagina(b);const x=await p.evaluate(()=>({NIVELES,AREAS,DIMENSIONES,EJEMPLOS_TRABAJO,FRECUENCIAS,TIPOS_ACCESO,TIPOS_OBJETIVOS,TIPOS_PRACTICA,TIPOS_TRABAJO,ROLES_ACUERDO,ROLES_TRABAJO,AVISO,AVISO_TRABAJO,PIE_PRACTICA,PIE_TRABAJO,PROPOSITOS,MOMENTOS,necesidades}));await p.close();return x;})());
  assert.deepEqual(huellas(),antes,'La auditoría no debe modificar los archivos de la página ni los datos');
  guardar('metodo.json',{corte:cp.execFileSync('git',['merge-base','HEAD','origin/main'],{cwd:raiz,encoding:'utf8'}).trim(),url,fecha:new Date().toISOString(),hashes:antes,inventarioFilas:v.length,recorridos:recorridos.length,versionChromium:b.version()});
  console.log(JSON.stringify(recorridos.map(r=>({persona:r.persona,ancho:r.ancho,clicks:r.clicksHastaVista,movimientos:r.ventanaMovimientos,px:r.distanciaVentanaPx})),null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1);});
