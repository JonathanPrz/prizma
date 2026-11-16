// Pares controlados: cada cambio parte de nuevo del mismo caso ficticio.
module.exports = async function medir(p, guardar, tabla) {
  const filas=[];
  p.on('dialog', d=>d.accept());
  async function base(ambito,nivel) {
    await p.evaluate(({ambito,nivel})=>{
      document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelectorAll('details').forEach(d=>d.open=false);inclusionDocumento=null;inclusionTrabajo=null;centroDocumento=null;
      const caso={id:'fijo',iniciales:'AA',dimensiones:{1:2,2:2},descripcionGuardada:true,seleccion:{}};
      estado=normalizarDatos({ambito:ambito==='trabajo'?'trabajo':'educacion',perfil:{nivel},estudiantes:[caso],trabajadores:[{...caso,id:'laboral',iniciales:'AB'}]});
      borradorDua=null;privacidadAvisada=true;sincronizarPerfil();sincronizarEstudiante();sincronizarTrabajo();pintarControles();pintarTarjetas();pintarApoyos();mostrarPestana(ambito);
      privacidadAvisada=true;
      if(ambito==='dua')editarClase();else abrirPaso(ambito==='trabajo'?'trabajo-descripcion':'paso-descripcion',true);
      if(ambito==='apoyos'){document.querySelector('#objetivos').open=true;}
    },{ambito,nivel});
  }
  async function fotoEstado() {
    return p.evaluate(()=>{
      const ids=n=>[...document.querySelectorAll(n+' button[id^="elegir-"]')].map(n=>n.id.slice(7));
      const visible=n=>[...document.querySelectorAll(n+' button[id^="elegir-"]')].filter(n=>n.checkVisibility()).map(n=>n.id.slice(7));
      const educativa=[...accesosVisibles(),...practicasVisibles(),...objetivosVisibles(),...(esSuperior()?[]:catalogo.filter(r=>r.tipo==='desregulacion'&&aplica(r))),...(nivelPracticaProfesional()&&estudianteActual().practicaProfesional?Object.keys(TIPOS_PRACTICA).flatMap(fichasPracticaProfesional):[])];
      const doc=estado.pestana==='trabajo'?documentoTrabajo([trabajadorActual().id]):documento({curso:true,estudiantes:[estudianteActual().id]});
      const grupo=estado.pestana==='dua'?'#tarjetas':estado.pestana==='trabajo'?'#trabajo-tarjetas':'#estudiante';
      return {estado:JSON.parse(JSON.stringify(estado)),borrador:borradorDua?JSON.parse(JSON.stringify(borradorDua)):null,ofrecidos:estado.pestana==='dua'?visibles().map(r=>r.id):estado.pestana==='trabajo'?[...ajustesTrabajo(),...catalogo.filter(r=>r.tipo==='trabajo'&&r.subtipo==='proceso')].map(r=>r.id):educativa.map(r=>r.id),acceso:accesosVisibles().map(r=>r.id),taller:practicasVisibles().map(r=>r.id),objetivos:objetivosVisibles().map(r=>r.id),profesional:nivelPracticaProfesional()&&estudianteActual().practicaProfesional?Object.fromEntries(Object.keys(TIPOS_PRACTICA).map(t=>[t,fichasPracticaProfesional(t).map(r=>r.id)])):{},primeras:primerasDua().map(r=>r.id),ordenDOM:ids(grupo),visibles:visible(grupo),documento:doc,razones:[...document.querySelectorAll(grupo+' .t-razon')].map(n=>n.textContent),grupos:[...document.querySelectorAll(grupo+' summary')].map(n=>n.textContent),conteo:document.querySelector(estado.pestana==='dua'?'#conteo':estado.pestana==='trabajo'?'#t-ajustes':'#apoyos-estado').textContent};
    });
  }
  async function par(ambito,nivel,control,selector,operacion,valor,funcion,tipo,notable,cumple,superpone) {
    await base(ambito,nivel);
    if(selector==='#estudiante-otro'||selector==='#trabajador-otro')await p.evaluate(ambito=>{
      if(ambito==='trabajo'){estado.trabajadores.push({id:'otro',...normalizarTrabajador({iniciales:'BB',dimensiones:{13:3},descripcionGuardada:true})});sincronizarTrabajo();abrirPaso('trabajo-descripcion',true);}
      else{estado.estudiantes.push({id:'otro',...normalizarEstudiante({iniciales:'BB',dimensiones:{13:3},descripcionGuardada:true}),seleccion:{}});sincronizarEstudiante();abrirPaso('paso-descripcion',true);}
    },ambito);
    if(selector==='#limpiar-filtros')await p.evaluate(()=>{estado.momentos=['durante'];estado.propositos=['motivar'];pintarFiltrosVista();pintarTarjetas();});
    if(operacion==='radio') {
      const nombre=selector.includes('trabajo-')?'trabajo-':'';
      const area=await p.locator(selector).evaluate(n=>{let d=n;while(d&&!/^dim-area-|^trabajo-area-d-/.test(d.id))d=d.parentElement;return d?.id.match(/(\d+)$/)?.[1];});
      if(area!==undefined)await p.locator('#'+nombre+'area-'+area).check();
    }
    if(selector.includes('#perfil input')&&!await p.locator('#perfil details').evaluate(d=>d.open))await p.locator('#perfil details > summary').click();
    const antes=await fotoEstado();
    const l=p.locator(selector).first(), declarado=await l.evaluate(n=>({texto:n.labels?[...n.labels].map(l=>l.textContent.trim()).join(' / '):n.textContent.trim(),ayuda:n.getAttribute('aria-describedby')?.split(' ').map(id=>document.getElementById(id)?.textContent).join(' ')||n.closest('fieldset')?.querySelector('legend')?.textContent||''}));
    if(selector==='#practica'&&ambito==='apoyos'){await p.click('#tab-dua');await l.check();await p.click('#tab-apoyos');}
    else if(operacion==='check')await l.check();
    if(operacion==='uncheck')await l.uncheck();
    if(operacion==='click')await l.click();
    if(operacion==='fill')await l.fill(valor);
    if(operacion==='select')await l.selectOption(valor);
    if(operacion==='radio')await l.check();
    if(ambito==='dua'&&(operacion==='fill'||selector.startsWith('#necesidad-')||selector.includes('[name=')))await p.click('#guardar-clase');
    const despues=await fotoEstado(), a=antes.ofrecidos,b=despues.ofrecidos;
    const oa=antes.ordenDOM,ob=despues.ordenDOM;
    const suben=ob.flatMap((id,i)=>oa.includes(id)&&oa.indexOf(id)>i?[{id,antes:oa.indexOf(id)+1,despues:i+1}]:[]);
    filas.push({ambito,nivel,control,selector,operacion,valor,declarado,funcion,tipo,notable,cumple,superpone,antes,despues,delta:{antes:a.length,despues:b.length,agregados:b.filter(id=>!a.includes(id)),quitados:a.filter(id=>!b.includes(id)),suben,visiblesAntes:antes.visibles.length,visiblesDespues:despues.visibles.length}});
  }
  const niveles=['basica','media','superior'];
  await par('dua','basica','Nivel','#nivel','select','superior','Elegir nivel educativo.','Mostrar u ocultar','Versiones y conteos cambian; no anuncia la lista de sustituciones.','Sí; afecta todo Educación.','Global, también casos y roles.');
  await par('dua','basica','Meta','#meta','fill','Interpretar gráficos.','Qué quieres que aprendan.','Solo documento','Resumen guardado/PDF; no razón nueva en tarjetas.','Sí; no es buscador por texto.','Más detalles/necesidades sí ordenan, la meta no.');
  const necesidades=await p.evaluate(()=>necesidades.map(n=>({id:n.id,texto:n.texto})));
  for(const n of necesidades)await par('dua','basica','Necesidad: '+n.texto,'#necesidad-'+n.id,'click',null,'Qué quieres resolver.','Priorizar','Razón «Responde a» y grupo Para empezar.','Sí, después de Guardar.','Mayor prioridad que taller y detalles; no excluye.');
  await par('dua','basica','Taller','#practica','check',null,'Mi clase tiene taller, laboratorio o terreno.','Priorizar','Razón específica en acciones prácticas; mismos IDs elegibles.','En parte; no anuncia efecto sobre estudiantes.','Habilita acceso de taller global, distinto de práctica profesional.');
  await par('dua','basica','Más detalles','#perfil details > summary','click',null,'Más detalles (opcional).','Agrupar o recorrer','Abre preguntas; no cambia por sí solo la lista.','Sí.','Sus casillas, no el summary, priorizan.');
  for(const nombre of ['actividad','evidencia']) {
    const opciones=await p.locator('#perfil input[name="'+nombre+'"]').evaluateAll(ns=>ns.map(n=>({valor:n.value,texto:n.closest('label').textContent.trim()})));
    for(const o of opciones)await par('dua','basica',nombre+': '+o.texto,`#perfil input[name="${nombre}"][value="${o.valor}"]`,'check',null,'Puedes marcar varias.','Priorizar','Razón «Responde a lo que marcaste»; activa Para empezar.','En parte; no declara explícitamente que solo ordena.','Necesidades y taller ganan en los desempates.');
  }
  for(const [id,nombre] of await p.evaluate(()=>MOMENTOS))await par('dua','basica','Momento: '+nombre,'#m-'+id,'click',null,'Si no eliges ninguno, se muestran todos.','Mostrar u ocultar','Conteo inmediato y aria-pressed.','Sí.','Intersección con propósitos; selección múltiple es unión dentro de Momento.');
  for(const id of ['motivar','presentar','mostrar'])await par('dua','basica','Para qué: '+id,'#proposito-'+id,'click',null,'Recorrer por propósito.','Mostrar u ocultar','Conteo inmediato y aria-pressed.','Sí.','Intersección con momentos; no cambia acciones ya elegidas.');
  await par('dua','basica','Reflexión','#reflexion','fill','Los ejemplos ayudaron.','Después de la clase: qué funcionó.','Solo documento','Se agrega reflexión al documento, sin filtrar.','Sí.','No consulta el catálogo.');
  await par('dua','basica','Limpiar filtros','#limpiar-filtros','click',null,'Limpiar filtros.','Mostrar u ocultar','Pasa de Durante/Motivar a todos; conserva descripción.','Sí.','Invierte los filtros de Momento y Para qué.');
  await par('dua','basica','Grupo DUA plegado','#tarjetas details > summary','click',null,'Nombre del momento y número.','Agrupar o recorrer','Hace visibles tarjetas sin cambiar el conjunto ofrecido.','Sí.','No equivale a filtrar el momento.');
  for(const nivel of niveles) {
    await par('apoyos',nivel,'Nivel global','#nivel','select',nivel==='basica'?'superior':'basica','Nivel de Educación.','Mostrar u ocultar','Cambia elegibilidad y roles; los IDs elegidos no se borran del estado.','Sí con confirmación.','Es el mismo nivel que usa DUA para todos los casos.');
    await par('apoyos',nivel,'Caso activo','#estudiante-otro','click',null,'Elegir el caso BB con Audición Casi siempre.','Mostrar u ocultar, Agrupar o recorrer','Cambia formulario, lista, selección visible y caso predeterminado del documento.','Sí.','El nivel se conserva; las situaciones son por persona.');
    await par('apoyos',nivel,'Taller heredado del curso','#practica','check',null,'Propiedad de la clase.','Activar una sección, Mostrar u ocultar','El control está en DUA; se mide el efecto en el caso.','En parte; efecto cruzado no explicado.','Distinto de práctica profesional.');
    for(let i=0;i<5;i++) {
      await par('apoyos',nivel,'Área '+i,'#area-'+i,i===0?'uncheck':'check',null,'En qué áreas encuentra barreras.','Activar una sección, Mostrar u ocultar','Marcar abre radios sin agregar situación; desmarcar Cognición elimina sus situaciones y apoyos.','En parte: plegar puede borrar datos.','Frecuencias determinan la lista; las áreas no priorizan por sí mismas.');
    }
    for(let d=1;d<=14;d++)await par('apoyos',nivel,'Situación '+d+' / Casi siempre',`input[name="dimension-${d}"][value="3"]`,'radio',null,'Frecuencia de la situación.','Mostrar u ocultar, Priorizar','Razón y orden por coincidencia; no filtra objetivos ni DEC.','Sí para acceso; alcance parcial entre bloques.','Combinación aditiva de dimensiones y frecuencia.');
    await par('apoyos',nivel,'Iniciales','#iniciales','fill','ZZ','Iniciales para identificar el caso.','Solo documento','Renombra caso y documento; no interpreta iniciales como filtro.','Sí.','Caso activo distinto de nivel global.');
    await par('apoyos',nivel,'Qué le ayuda','#estudiante-ayuda','fill','Lista visual.','Qué le ayuda.','Solo documento','Resumen y documento; no cambia sugerencias.','Sí.','No se analiza texto como dimensión.');
    await par('apoyos',nivel,'Voz','#estudiante-voz','fill','Prefiere instrucciones escritas.','Voz del estudiante/familia según nivel.','Solo documento','Se guarda en documento; no cambia lista.','Sí.','No se analiza texto libre.');
    if(nivel!=='basica')await par('apoyos',nivel,'Práctica profesional','#practica-profesional','check',null,'Este estudiante hará su práctica profesional.','Activar una sección, Mostrar u ocultar','Tres grupos profesionales y salida para el centro.','Sí.','No requiere ni marca taller global.');
    if(nivel!=='superior')for(const asig of ['lenguaje','matematica','ciencias','historia'])await par('apoyos',nivel,'Asignatura '+asig,'#asignatura','select',asig,'Asignatura, Todas.','Mostrar u ocultar','Cambia solo objetivos; genéricos se conservan.','Sí.','No afecta acceso ni DEC.');
    await par('apoyos',nivel,'Grupo de acceso plegado','#apoyos-resultados details > summary','click',null,'Nombre y conteo del grupo.','Agrupar o recorrer','Visibilidad de tarjetas; conjunto ofrecido intacto.','Sí.','No es un filtro excluyente.');
  }
  await par('trabajo','basica','Caso activo laboral','#trabajador-otro','click',null,'Elegir otra persona con Audición Casi siempre.','Mostrar u ocultar, Agrupar o recorrer','Cambia caso laboral activo y sus ajustes; estudiantes intactos.','Sí.','La frecuencia pertenece a la persona, no al tipo de puesto.');
  for(let i=0;i<5;i++)await par('trabajo','basica','Área laboral '+i,'#trabajo-area-'+i,i===0?'uncheck':'check',null,'En qué áreas encuentra barreras.','Activar una sección, Mostrar u ocultar','Misma mecánica que estudiante: abrir no selecciona frecuencia, cerrar elimina las de esa área.','En parte: efecto destructivo no descrito como tal.','Radios laborales filtran realmente.');
  for(let d=1;d<=14;d++)await par('trabajo','basica','Situación laboral '+d,`input[name="trabajo-dimension-${d}"][value="3"]`,'radio',null,'Frecuencia en tareas del trabajo.','Mostrar u ocultar, Priorizar','Razón en tarjetas; ocho de proceso permanecen.','Sí para ajustes; no excluye proceso.','Mismos IDs de dimensiones, estado separado del estudiante.');
  for(const [id,valor] of [['iniciales','ZZ'],['puesto','Bodega'],['ayuda','Mensajes escritos.'],['voz','Prefiere subtítulos.']])await par('trabajo','basica',id,'#trabajo-'+id,'fill',valor,id==='puesto'?'Tipo de puesto, por ejemplo administrativo o bodega.':id==='voz'?'Qué dice la persona.':'Qué le ayuda.','Solo documento','Cambia el documento, no la lista.','Sí como registro; no es buscador de ajustes por puesto.','Solo las situaciones y frecuencias determinan ajustes.');
  await par('trabajo','basica','Grupo laboral plegado','#trabajo-tarjetas details > summary','click',null,'Tipo y número de ajustes.','Agrupar o recorrer','Despliega; no elimina ni prioriza.','Sí.','Para empezar no duplica opciones del resto.');
  const empezar=[];
  for(const [nombre,necesidades,momentos,propositos,practica] of [
    ['sin-criterios',[],[],[],false],['necesidad',['tareas-largas'],[],[],false],['durante-sin-necesidad',[],['durante'],[],false],['durante-con-necesidad',['tareas-largas'],['durante'],[],false],['una-accion',['tareas-largas'],['despues'],['presentar'],false],['solo-taller',[],[],[],true]
  ]){
    await base('dua','basica');await p.evaluate(c=>{estado.necesidades=c.necesidades;estado.momentos=c.momentos;estado.propositos=c.propositos;estado.perfil.practica=c.practica;borradorDua=null;pintarControles();pintarTarjetas();document.querySelector('#acciones').scrollIntoView();},{necesidades,momentos,propositos,practica});
    const e=await fotoEstado();e.nombre=nombre;e.definiciones=await p.locator('#tarjetas .ayuda').allTextContents();empezar.push(e);await p.screenshot({path:require('node:path').join(__dirname,'capturas/empezar-'+nombre+'.png')});
  }
  guardar('para-empezar.json',empezar);
  for(const f of filas)assertDelta(f);
  function assertDelta(f){if(new Set(f.despues.ofrecidos).size!==f.despues.ofrecidos.length)throw Error('IDs repetidos en '+f.control);}
  guardar('filtros.json',filas);
  guardar('filtros.md','# Función de cada filtro: pares controlados\n\nCaso fijo: AA, atención y lectura/escritura Seguido; AB para trabajo. Cada fila se reinicia; no acumula cambios anteriores. «Ofrecidos» incluye tarjetas en grupos plegados; «visibles» distingue lo desplegado. Las áreas/radios se despliegan instrumentalmente para poder accionar el control, sin añadir frecuencias por ello. Los IDs y posiciones completos están en filtros.json.\n\n'+tabla(['Ámbito/nivel','Control y función declarada','Tipo real','Ofrecidos antes → después; visibles','Añade / quita / sube','Se ve','Cumple','Superposición'],filas.map(f=>[f.ambito+'/'+f.nivel,f.control+' · '+f.declarado.texto+' · '+f.declarado.ayuda+' / '+f.funcion,f.tipo,`${f.delta.antes} → ${f.delta.despues}; ${f.delta.visiblesAntes} → ${f.delta.visiblesDespues}`,`+ ${f.delta.agregados.join(', ')||'ninguno'} / − ${f.delta.quitados.join(', ')||'ninguno'} / ↑ ${f.delta.suben.map(x=>x.id+' '+x.antes+'→'+x.despues).join(', ')||'ninguno'}`,f.notable,f.cumple,f.superpone])));
  return filas;
};
