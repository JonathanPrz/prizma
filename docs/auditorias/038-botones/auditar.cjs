// Solo escribe evidencia aquí. Las mutaciones de estado ocurren en contextos de prueba aislados.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), cp = require('node:child_process'), crypto = require('node:crypto'), assert = require('node:assert/strict');
let chromium; try { ({chromium} = require('playwright')); } catch { ({chromium} = require('/opt/codex/cua_node/lib/node_modules/playwright')); }
const raiz = path.resolve(__dirname, '../../..');
const guardar = (p, d) => fs.writeFileSync(path.join(__dirname, p), typeof d === 'string' ? d : JSON.stringify(d, null, 2) + '\n');
const leer = p => fs.readFileSync(path.join(raiz, p), 'utf8');
const catalogo = JSON.parse(leer('data/recomendaciones.json'));
const esc = x => String(x ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
const tabla = (h, filas) => '| ' + h.join(' | ') + ' |\n| ' + h.map(() => '---').join(' | ') + ' |\n' + filas.map(f => '| ' + f.map(esc).join(' | ') + ' |').join('\n') + '\n';
const protegidos = ['AGENTS.md', 'docs/tareas/038-auditoria-botones.md', 'app.js', 'index.html', 'styles.css', 'docs/arquitectura.md', 'data/recomendaciones.json', 'data/fuentes.json', 'data/necesidades.json'];
const huellas = () => Object.fromEntries(protegidos.map(p => [p, crypto.createHash('sha256').update(leer(p)).digest('hex')]));
const original = huellas(), inventario = new Map(), recorridos = [];
let base;
async function pagina(b, ancho = 1280) {
  const p = await b.newPage({viewport: {width: ancho, height: 900}, colorScheme: 'light', reducedMotion: 'reduce'});
  await p.addInitScript(() => {
    window.__avisos = []; window.__impresiones = [];
    const nativo = window.print.bind(window);
    window.print = () => { window.__impresiones.push({evento: 'llamada-window.print'}); return nativo(); };
    for (const evento of ['beforeprint', 'afterprint']) addEventListener(evento, () => window.__impresiones.push({evento}));
    addEventListener('DOMContentLoaded', () => new MutationObserver(ms => {
      for (const m of ms) { const n = m.target.nodeType === 1 ? m.target : m.target.parentElement; const c = n?.closest('[aria-live], [role="status"], [role="alert"]'); if(c) window.__avisos.push({id:c.id,rol:c.getAttribute('role'),live:c.getAttribute('aria-live'),visible:c.checkVisibility(),texto:c.textContent.trim()}); }
    }).observe(document.body, {subtree: true, childList: true, characterData: true}));
  });
  await p.goto(base); await p.waitForFunction(n => catalogo.length === n, catalogo.length);
  return p;
}
async function inventariar(p, muestra) {
  const c = await p.context().newCDPSession(p); await c.send('DOM.enable');
  const {nodes} = await c.send('DOM.getFlattenedDocument', {depth: -1});
  const {nodes: ax} = await c.send('Accessibility.getFullAXTree');
  const nombres = new Map(ax.filter(n => !n.ignored && n.backendDOMNodeId).map(n => [n.backendDOMNodeId, n.name?.value || '']));
  const porId = new Map(nodes.map(n => [n.nodeId,n])), hijos = new Map();
  for(const n of nodes) if(n.nodeType === 1) { if(!hijos.has(n.parentId)) hijos.set(n.parentId,[]); hijos.get(n.parentId).push(n); }
  function selector(n) { const a = n.attributes || [], i=a.indexOf('id'); if(i>=0) return '#'+a[i+1]; const padre=porId.get(n.parentId); return (padre?.nodeType===1?selector(padre)+' > ':'')+n.nodeName.toLowerCase()+':nth-child('+((hijos.get(n.parentId)||[]).indexOf(n)+1)+')'; }
  const mapa = Object.fromEntries(nodes.filter(n => nombres.has(n.backendNodeId)).map(n=>[selector(n),nombres.get(n.backendNodeId)]));
  const filas = await p.evaluate(mapa => {
    const ruta = n => n.id ? '#'+n.id : (n.parentElement?ruta(n.parentElement)+' > ':'')+n.tagName.toLowerCase()+':nth-child('+([...(n.parentElement?.children||[n])].indexOf(n)+1)+')';
    const texto = n => { if(!n) return ''; const c=n.cloneNode(true); c.querySelectorAll('[hidden], .solo-lectores').forEach(x=>x.remove()); return c.textContent.replace(/\s+/g,' ').trim(); };
    return [...document.querySelectorAll('button,input,textarea,select,summary,a')].map(n=>{
      const s=ruta(n), campo=n.closest('fieldset'), tarjeta=n.closest('.tarjeta'), id=tarjeta?.querySelector('button[id^="elegir-"]')?.id.slice(7);
      return {selector:s,tag:n.tagName.toLowerCase(),tipo:n.type||'',texto:!n.matches('input,textarea,select')?texto(n):'',nombreAccesible:mapa[s]??null,etiqueta:n.labels?[...n.labels].map(texto).join(' / '):'',ayuda:[n.getAttribute('aria-describedby')?.split(' ').map(id=>texto(document.getElementById(id))).join(' '),texto(campo?.querySelector('legend')),n.getAttribute('placeholder')].filter(Boolean).join(' / '),valor:n.matches('input,textarea,select')?n.value:'',disabled:n.disabled===true,visible:!!n.getClientRects().length,tarjeta:id||'',zona:n.closest('dialog')?.id||n.closest('.paso')?.id||n.closest('[role="tabpanel"]')?.id||(n.closest('footer')?'pie':'cabecera/contexto'),href:n.getAttribute('href')||''};
    });
  }, mapa);
  for(const r of filas) {
    if(!r.visible || r.nombreAccesible===null) continue;
    const clave=JSON.stringify({...r,valor:undefined,visible:undefined,disabled:undefined});
    if(!inventario.has(clave)) inventario.set(clave,{...r,muestras:[],deshabilitadoEn:[]});
    const v=inventario.get(clave);v.muestras.push(muestra);if(r.disabled)v.deshabilitadoEn.push(muestra);
  }
  await c.detach();
}
async function observar(p) {
  return p.evaluate(()=>({estado:JSON.parse(JSON.stringify(estado)),borrador:borradorDua?JSON.parse(JSON.stringify(borradorDua)):null,scroll:{ventana:Math.round(scrollY),dialogos:Object.fromEntries([...document.querySelectorAll('dialog[open]')].map(d=>[d.id,Math.round(d.scrollTop)]))},foco:{id:document.activeElement?.id,tag:document.activeElement?.tagName,texto:document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent?.trim().slice(0,180)},avisos:window.__avisos.splice(0),conteos:{dua:visibles().length,acceso:accesosVisibles().length,taller:practicasVisibles().length},botonesElegidos:document.querySelector('#n-sel').textContent,errores:[...document.querySelectorAll('[role="alert"]')].map(n=>n.textContent).filter(Boolean)}));
}
async function recorrido(b, tipo, ancho) {
  const p=await pagina(b,ancho), errores=[], acciones=[], fotos=[];p.on('pageerror',e=>errores.push(e.message));
  const prefijo=tipo+'-'+ancho;
  async function accion(operacion,selector,esperaria,valor) {
    const antes=await observar(p);
    let problema=null;
    try {
      const l=p.locator(selector);
      if(operacion==='click')await l.click();
      if(operacion==='fill')await l.fill(valor);
      if(operacion==='check')await l.check();
      if(operacion==='select')await l.selectOption(valor);
      if(operacion==='uncheck')await l.uncheck();
      if(operacion==='escape')await p.keyboard.press('Escape');
      await p.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
    } catch(e) {problema=e.message;}
    const despues=await observar(p);
    acciones.push({numero:acciones.length+1,operacion,selector,esperaria,valor,antes,despues,desplazamiento:Math.abs(despues.scroll.ventana-antes.scroll.ventana),problema});
    if(problema)throw Error(prefijo+' '+selector+' '+problema);
  }
  async function foto(etapa) {const nombre='capturas/'+prefijo+'-'+etapa+'.png';await p.screenshot({path:path.join(__dirname,nombre)});fotos.push(nombre);await inventariar(p,prefijo+'-'+etapa);}
  async function elegir(id) {
    const grupos=await p.locator('#elegir-'+id).evaluate(n=>{const ds=[];for(let d=n.parentElement;d;d=d.parentElement)if(d.matches('details')&&!d.open)ds.unshift(d.id?'#'+d.id+' > summary':'details[data-grupo='+JSON.stringify(d.dataset.grupo)+'] > summary');return ds;});
    for(const s of grupos)await accion('click',s,'Abrir el grupo para ver sus apoyos.');
    if(await p.locator('#elegir-'+id).getAttribute('aria-pressed')!=='true')await accion('click','#elegir-'+id,'Agregar esta opción a mi selección.');
  }
  async function iniciales(valor) {await accion('fill','#iniciales','Identificar el caso solo por iniciales.',valor);if(await p.locator('#aviso-privacidad').evaluate(n=>n.open))await accion('click','#privacidad-entendido','Confirmar que entiendo qué datos puedo escribir.');}
  async function acuerdo(superior) {
    await accion('click','#ir-acuerdos','Continuar a los acuerdos del caso.');
    await accion('check','input[name="rol-acuerdo"][value="estudiante"]','Registrar participación del estudiante.');
    await accion('check',`input[name="rol-acuerdo"][value="${superior?'inclusion':'familia'}"]`,'Registrar al otro participante del acuerdo.');
    await accion('fill','#fecha-acuerdo','Fecha del acuerdo.','2026-11-16');await accion('fill','#revision-acuerdo','Fecha posterior para revisar.','2026-12-01');
    await accion('click','#guardar-acuerdos','Guardar los acuerdos y completar el caso.');
  }
  async function documento(sufijo) {
    await p.waitForSelector('#vista[open]');await foto('vista-'+sufijo);
    const texto=await p.locator('#hoja').innerText();guardar(prefijo+'-'+sufijo+'-vista.txt',texto);
    const modelo=await p.evaluate(()=>modeloDocumento());guardar(prefijo+'-'+sufijo+'-modelo.json',modelo);
    const d=p.waitForEvent('download');await accion('click','#descargar','Descargar el PDF con lo que muestra la vista previa.');await (await d).saveAs(path.join(__dirname,prefijo+'-'+sufijo+'.pdf'));
    await accion('click','#imprimir','Abrir el diálogo de impresión, sin confirmar un envío.');
    const impresion=await p.evaluate(()=>window.__impresiones);guardar(prefijo+'-'+sufijo+'-intento-impresion.json',impresion);
    await p.emulateMedia({media:'print'});await p.screenshot({path:path.join(__dirname,'capturas/'+prefijo+'-css-impresion-'+sufijo+'.png')});
    await p.pdf({path:path.join(__dirname,prefijo+'-'+sufijo+'-impresion-css.pdf'),format:'A4',printBackground:true});
    await p.emulateMedia({media:'screen'});
    await accion('click','#cerrar','Cerrar la vista y volver al origen.');
  }
  try {
    await foto('inicio');await accion('click','#elegir-educacion','Entrar a Educación.');
    await accion('select','#nivel','Elegir el nivel del curso.',tipo==='superior'?'superior':'basica');
    if(tipo==='dua') {
      await accion('fill','#meta','Describir lo que quiero que aprendan.','Interpretar un gráfico de barras.');
      await accion('click','#necesidad-tareas-largas','Priorizar tareas largas.');await accion('check','#practica','Indicar que hay taller, laboratorio o terreno.');await foto('paso-1');
      await accion('click','#guardar-clase','Guardar la descripción y ver acciones.');await foto('paso-2');
      await accion('click','#m-durante','Recorrer solo acciones de Durante.');await accion('click','#proposito-motivar','Recorrer acciones para motivar.');await foto('filtros');await accion('click','#limpiar-filtros','Volver a recorrer todos los momentos.');
      const ids=await p.evaluate(()=>MOMENTOS.map(([m])=>visibles().find(r=>r.momento===m).id));
      for(const id of ids)await elegir(id);
      await accion('fill','#dua-seleccion > li:first-child textarea','Anotar cómo usaré la acción.','NOTA_DUA: usar tarjetas con ejemplos.');
      if(await p.locator('#aviso-privacidad').evaluate(n=>n.open))await accion('click','#privacidad-entendido','Entender la privacidad de las notas.');
      await accion('fill','#reflexion','Registrar qué funcionó después de la clase.','REFLEXION_DUA: los ejemplos ayudaron.');await foto('seleccion');
      await accion('click','#abrir-mochila','Revisar mis cuatro acciones.');await foto('mochila-4');
      await accion('click','#quitar-'+ids[3],'Quitar una acción conservando las demás.');await foto('mochila-3');
      await accion('click','#pdf','Preparar documento.');await foto('incluir');await accion('click','#generar-documento','Ver solo el curso, opción marcada.');await documento('curso');
    } else {
      const sup=tipo==='superior', repetido=sup?'sup-anticipar':'acc-1-agenda';
      await accion('click','#tab-apoyos','Abrir los apoyos de un estudiante.');await iniciales(sup?'IP':'JP');
      await accion('check','#area-0','Abrir Cognición y aprendizaje.');await accion('check','input[name="dimension-1"][value="3"]','Indicar atención y organización casi siempre.');await accion('check','input[name="dimension-2"][value="2"]','Indicar lectura/escritura seguido.');
      if(sup)await accion('check','#practica-profesional','Este estudiante realizará práctica profesional.');
      await accion('fill','#estudiante-ayuda','Anotar qué le ayuda.','APOYO: lista visible.');await accion('fill','#estudiante-voz','Registrar la voz del estudiante.','VOZ: decide compartir instrucciones por pasos.');await foto('descripcion');
      await accion('click','#guardar-descripcion','Guardar las dos situaciones.');await foto('sugeridos');
      const primera=await p.locator('#apoyos-resultados section[aria-labelledby="t-para-empezar"] button[id^="elegir-"]').first().getAttribute('id');await elegir(primera.slice(7));
      await elegir(repetido);await elegir(sup?'sup-digital':'acc-1-partes');
      const version=sup?'sup-digital':'acc-1-partes';await accion('click','#curso-'+version,'Ofrecer la versión de este apoyo a todo el curso.');
      if(!sup){await elegir('obj-graduacion');await elegir('dec-antes-gatillantes');}
      else {await elegir('pp-plan-superior');await elegir('pp-c-pasos');await elegir('pp-e-compartir');}
      await foto('apoyos-elegidos');await acuerdo(sup);await foto('acuerdos');
      const primero=await p.evaluate(()=>estado.estudianteActivo);
      await accion('click','#agregar-estudiante','Crear otro caso sin borrar el primero.');await iniciales(sup?'IP2':'JP2');
      await accion('check','#area-0','Abrir Cognición para el segundo caso.');await accion('check','input[name="dimension-1"][value="3"]','Registrar la misma situación.');await accion('check','input[name="dimension-2"][value="2"]','Registrar una segunda situación.');
      await accion('click','#guardar-descripcion','Guardar el segundo caso.');await elegir(repetido);await foto('apoyo-repetido');
      await accion('click',(sup?'#curso-':'#individual-')+repetido,sup?'Agregar al curso la versión que necesitan dos estudiantes.':'Mantener el apoyo individual pese a la coincidencia.');
      await acuerdo(sup);await foto('segundo-completo');
      await accion('click','#documento-estudiante','Preparar documento de ambos casos.');await accion('check',`input[name="incluir"][value="alumno:${primero}"]`,'Incluir también el primer estudiante.');await foto('incluir');await accion('click','#generar-documento','Ver el curso y ambos estudiantes.');await documento('plan');
      if(sup) {
        await accion('click','#estudiante-'+primero,'Volver al caso que hará práctica.');
        await accion('click','#preparar-centro','Preparar solo lo que el estudiante decide compartir.');await foto('centro-decision');
        await accion('check','#decision-centro','Confirmar que el estudiante revisó y decidió compartir.');await accion('click','#ver-centro','Ver documento para el centro, sin notas personales.');await documento('centro');
      }
    }
    await inventariar(p,prefijo+'-final');
    recorridos.push({tipo,ancho,acciones,fotos,errores,desplazamientoTotal:acciones.reduce((n,a)=>n+a.desplazamiento,0),impresionNativa:'Bloqueada por políticas del navegador; no se confirmó impresión.'});
  } finally {guardar('recorridos-parciales.json',recorridos.concat([{tipo,ancho,acciones,fotos,errores}]));await p.close();}
}
async function muestrasInventario(b) {
  for(const ancho of [1280,390]) {
  const p=await pagina(b,ancho);await p.click('#elegir-educacion');
  for(const nivel of ['basica','superior']) {
    await p.evaluate(nivel=>{
      estado=normalizarDatos({ambito:'educacion',perfil:{nivel,practica:true,meta:'Meta ficticia'},estudiantes:[{id:'caso1',iniciales:'AA',dimensiones:Object.fromEntries(DIMENSIONES.map((_,i)=>[i+1,3])),descripcionGuardada:true,practicaProfesional:true,seleccion:{}},{id:'caso2',iniciales:'BB',dimensiones:{1:2},descripcionGuardada:true,seleccion:{'acc-1-agenda':''}}]});
      estado.estudiantes[0].seleccion=Object.fromEntries(catalogo.filter(r=>r.tipo!=='dua'&&r.tipo!=='trabajo'&&aplica(r)).map(r=>[r.id,'Nota ficticia']));
      borradorDua=null;sincronizarPerfil();sincronizarEstudiante();pintarControles();pintarTarjetas();mostrarPestana('dua');
    },nivel);
    await p.evaluate(()=>{document.querySelectorAll('#panel-dua details').forEach(d=>d.open=true);});await inventariar(p,nivel+'-'+ancho+'-dua-todos');
    await p.locator('#panel-dua .enlace-guia-dua').click();await inventariar(p,nivel+'-'+ancho+'-guia-dua');await p.keyboard.press('Escape');
    await p.click('#tab-apoyos');await p.evaluate(()=>{abrirPaso('paso-descripcion',true);abrirPaso('paso-acuerdos',true);document.querySelectorAll('#panel-apoyos details').forEach(d=>d.open=true);});await inventariar(p,nivel+'-'+ancho+'-estudiante-todos');
    await p.locator('#panel-apoyos .enlace-guia-apoyos').click();await inventariar(p,nivel+'-'+ancho+'-guia-apoyos');await p.keyboard.press('Escape');
    if(nivel==='superior'){await p.click('#enlace-guia-practica');await inventariar(p,'superior-'+ancho+'-guia-practica');await p.keyboard.press('Escape');await p.click('#preparar-centro');await inventariar(p,'superior-'+ancho+'-opciones-centro');await p.keyboard.press('Escape');}
    await p.click('#privacidad');await inventariar(p,nivel+'-'+ancho+'-privacidad');await p.keyboard.press('Escape');
    await p.click('#abrir-mochila');await inventariar(p,nivel+'-'+ancho+'-mochila');await p.click('#cerrar-mochila');
    await p.evaluate(()=>{estado.seleccion=Object.fromEntries(visibles().map(r=>[r.id,'Nota curso']));pintarTarjetas();pintarApoyos();pintarSeleccion();document.querySelectorAll('#panel-apoyos details').forEach(d=>d.open=true);});await inventariar(p,nivel+'-'+ancho+'-versiones-ya-curso');
  }
  await p.close();
  }
}
function efecto(r) {
 const id=r.selector, tipo=r.tag, ficha=catalogo.find(f=>f.id===r.tarjeta), texto=r.texto;
 if(r.tarjeta) {
  if(id.includes('#elegir-'))return ['Alterna '+(ficha.tipo==='dua'?'estado.seleccion':'selección del estudiante activo')+'['+ficha.id+']; actualiza Elegida, mochila y documento. No crea acuerdos.','Sí; elegir no equivale a acordar.'];
  if(id.includes('#curso-'))return ['Agrega la versión DUA al curso; conserva la selección individual.','En parte: cambia otra pestaña; el efecto se refleja en avisos y mochila.'];
  if(id.includes('#individual-'))return ['Registra mantenerIndividual para este ID y oculta la pregunta; no quita el apoyo individual.','Sí; no vuelve a preguntar por ese ID.'];
  if(tipo==='summary')return ['Abre las fuentes de '+ficha.id+'; no cambia selección ni documento.','Sí.'];
  if(tipo==='a')return ['Abre fuente externa en otra pestaña: '+r.href+'; no cambia datos.','Sí por código; no se visitó cada destino.'];
 }
 if(id.startsWith('#barrera-'))return ['Marca una necesidad en el borrador DUA y enfoca Guardar; no actualiza acciones hasta guardar.','En parte: Ver acciones para esto lleva a editar la clase, sin resultado nuevo inmediato.'];
 if(id.startsWith('#m-')||id.startsWith('#proposito-'))return ['Filtra de inmediato momentos/propósitos de estado, guarda y repinta acciones/conteo. No modifica la descripción ni las elegidas.','Sí; selección múltiple y vacío = todos.'];
 if(id.startsWith('#necesidad-'))return ['Alterna necesidades del borrador; solo Guardar cambia prioridad/razones. No excluye acciones.','Sí, con guardado diferido indicado en el paso 1.'];
 if(id==='#nivel')return ['Cambia nivel global educativo y elegibilidad, vocabulario y roles; confirma si hay casos con datos. No elimina selecciones almacenadas.','En parte: global para todos los casos.'];
 if(id==='#practica')return ['Activa taller global: prioriza DUA y habilita accesos de práctica que coincidan con las situaciones; afecta resumen del documento.','En parte: efecto sobre casos no se explica en esta casilla.'];
 if(id==='#practica-profesional')return ['Activa práctica profesional solo del estudiante, en media/superior. No activa taller global.','Sí; no son la misma práctica.'];
 if(id==='#asignatura')return ['Filtra únicamente objetivos aplicables por asignatura; genéricos permanecen.','Sí; no filtra acceso ni DUA.'];
 if(id.startsWith('#area-')||/name/.test(id)&&r.tipo==='radio'||r.tipo==='radio')return ['Área abre dimensiones; desmarcar elimina sus frecuencias. Radio guarda la frecuencia del caso y cambia acceso/prioridad; No aplica la elimina.','En parte: cerrar un área borra valores, no solo pliega.'];
 if(id==='#meta')return ['Escribe meta en borrador de perfil; después de Guardar va al resumen/PDF. No lee su significado para filtrar.','Sí; no es un filtro semántico.'];
 if(id==='#estudiante-ayuda'||id==='#estudiante-voz')return ['Guarda facilitadores/voz del caso de inmediato; aparece en resumen/PDF y marca acuerdo Por revisar si estaba completo. No filtra ni prioriza.','Sí; texto personal, no consulta al catálogo.'];
 if(id==='#iniciales')return ['Valida/guarda iniciales del caso, renombra su selector y documento; puede abrir privacidad.','Sí; no altera recomendaciones.'];
 if(r.tipo==='date'||id.startsWith('#roles-acuerdo'))return ['Guarda fecha o rol del acuerdo; valida fecha posterior al guardar; no altera catálogo.','Sí.'];
 if(id==='#reflexion')return ['Guarda reflexión de curso y documento; no prioriza opciones; puede abrir privacidad.','Sí.'];
 if(tipo==='textarea')return ['Nota por ID de acción/apoyo; se sincroniza en selección/mochila y se imprime en el documento general. No va al centro.','Sí; quitar la opción quita también su nota.'];
 if(r.tipo==='checkbox'&&id.includes('#perfil'))return ['Actividad/evidencia del borrador; Guardar ordena por coincidencia, sin ocultar opciones.','En parte: es prioridad, no un filtro de exclusión.'];
 if(id.includes('#opciones-documento'))return ['Elige qué curso/casos incluir; modifica el modelo documental, no la selección almacenada.','Sí.'];
 if(id.includes('#opciones-centro')||id==='#decision-centro')return ['Elige solo ajustes del centro y confirma decisión del estudiante; habilita Ver documento.','Sí; predeterminadas las opciones y no confirmada la decisión.'];
 if(id.startsWith('#quitar-clase-')||id.startsWith('#quitar-')&&!['#quitar-estudiante','#quitar-trabajador'].includes(id))return ['Quita opción y nota de la selección correspondiente; actualiza mochila y documento.','Sí; no la elimina del catálogo.'];
 if(id.startsWith('#estudiante-')&&tipo==='button')return ['Cambia estudiante activo, formulario, sugerencias y acuerdos; no mezcla casos.','Sí.'];
 if(id==='#agregar-estudiante')return ['Crea un caso solo si los anteriores tienen acuerdos completos; máximo diez.','Sí; bloqueo explicado en ayuda.'];
 if(id==='#quitar-estudiante')return ['Pide confirmación y quita el caso activo completo; conserva al menos un caso vacío.','Sí.'];
 if(id==='#limpiar-clase')return ['Vacía meta/necesidades/actividad/evidencia del borrador; no cambia filtros ni resultados hasta Guardar; conserva taller global.','En parte: Limpiar respuestas no limpia la casilla de taller.'];
 if(id==='#limpiar-filtros')return ['Limpia solo momentos/propósitos de inmediato.','Sí.'];
 if(id==='#guardar-clase')return ['Confirma borrador de clase; prioriza acciones, pliega paso y enfoca resultados; conserva filtros.','Sí.'];
 if(id==='#guardar-descripcion')return ['Exige situación positiva, marca descripción guardada, pliega formulario y habilita resultados/acuerdos.','Sí.'];
 if(id==='#guardar-acuerdos')return ['Valida descripción, elección, rol y fechas; marca acuerdos completos, habilita siguiente caso.','Sí.'];
 if(id==='#ir-acuerdos')return ['Abre paso 3 y enfoca roles; no guarda acuerdos por sí mismo.','Sí.'];
 if(id==='#continuar')return ['Paso 1 envía formulario; paso 2 va al 3; paso 3 pide documento/guarda acuerdos según pestaña.','En parte: mismo texto para tres efectos.'];
 if(id.startsWith('#indicador-pasos'))return ['Abre/enfoca el paso enlazado y desplaza a él; sin guardar al recorrer DUA.','Sí.'];
 if(id.includes('-toggle')||id.includes('-editar'))return ['Abre/cierra o edita ese paso; no borra su estado ni guarda por sí mismo.','Sí.'];
 if(id==='#tab-dua'||id==='#tab-apoyos')return ['Cambia pestaña educativa/hash y foco, conservando los datos.','Sí.'];
 if(id==='#elegir-educacion'||id==='#elegir-trabajo'||texto==='Cambiar ámbito')return ['Elige ámbito o vuelve al inicio; cambia navegación, privacidad, mochila y pie.','Sí.'];
 if(id==='#tema')return ['Alterna claro/oscuro y guarda preferencia; no cambia selecciones ni PDF.','Sí; nombre accesible indica la acción.'];
 if(id==='#abrir-mochila'||id==='#cerrar-mochila')return ['Abre/cierra mochila del ámbito; restaura foco en el botón de cabecera.','Sí.'];
 if(id==='#guardar-respaldo')return ['Descarga JSON conjunto de Educación y Trabajo; no equivale al documento PDF.','Sí; alcance global declarado en ayuda.'];
 if(id==='#abrir-respaldo')return ['Valida JSON v1/v2 y pide confirmar reemplazo de todos los datos; restaura ámbito.','Sí por código; no se probaron todos los archivos dañados.'];
 if(id==='#borrar')return ['Confirma borrado del ámbito actual; conserva el otro; recarga.','Sí por código; no se ejerció en los recorridos.'];
 if(id==='#pdf'||id==='#documento-clase'||id==='#documento-estudiante')return ['Abre selector de inclusión: curso y caso activo con datos predeterminados. No exige acuerdos completos; puede ser borrador.','En parte: distintas entradas tienen el mismo selector general.'];
 if(id==='#generar-documento')return ['Construye vista previa/PDF según opciones, no añade acuerdos ni guarda nuevas elecciones.','Sí.'];
 if(id==='#preparar-centro')return ['Abre revisión de ajustes del centro seleccionados; omite notas y datos personales del caso.','Sí; requiere al menos un ajuste del centro.'];
 if(id==='#ver-centro')return ['Genera documento específico si hay ajustes marcados y decisión confirmada.','Sí.'];
 if(id==='#descargar')return ['Descarga PDF pdfmake local del modelo de la vista; no abre impresión.','Sí, probado con descargas.'];
 if(id==='#imprimir')return ['Llama window.print con CSS de impresión; la política del entorno bloquea el diálogo.','No verificable el diálogo aquí; llamada observada.'];
 if(id==='#cerrar'||id.startsWith('#cancelar-'))return ['Cierra vista/selector y devuelve foco al origen; no quita datos guardados.','Sí.'];
 if(id.includes('entendido')||id==='#guia-empezar')return ['Cierra guía/aviso; privacidad recuerda aceptación, guías no se aceptan permanentemente; Empezar vuelve al paso 1.','Sí.'];
 if(r.href.startsWith('#guia-')||r.href==='#aviso-privacidad')return ['Abre guía o privacidad manual; no cambia la selección. Escape cierra y devuelve foco.','Sí por código/apertura observada.'];
 if(tipo==='summary')return ['Abre/cierra el grupo, sus instrucciones o fuentes; no filtra IDs ni selecciona.','Sí; es recorrido, no exclusión.'];
 if(tipo==='a'&&r.href.startsWith('http'))return ['Abre el destino indicado: '+r.href+'.','Destino inventariado; no se visitó cada enlace externo.'];
 if(tipo==='a'&&r.texto==='Ir al contenido')return ['Enfoca panel activo o inicio.','Sí por código.'];
 return ['Revisar caso específico en el código: '+id,'Pendiente de clasificación'];
}
(async()=>{
  const servidor=http.createServer((req,res)=>{
    const archivo=path.resolve(raiz,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
    if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
    fs.readFile(archivo,(e,c)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(archivo)]||'application/octet-stream');res.end(c);});
  });
  await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));base='http://127.0.0.1:'+servidor.address().port;
  const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
    for(const tipo of ['dua','basica','superior'])for(const ancho of [1280,390]){console.log('Recorrido',tipo,ancho);await recorrido(b,tipo,ancho);}
    console.log('Inventario');await muestrasInventario(b);
    guardar('recorridos.json',recorridos);guardar('inventario.json',[...inventario.values()]);
    console.log('Filtros');const p=await pagina(b);await p.click('#elegir-educacion');const filtros=await require('./medir_filtros.cjs')(p,guardar,tabla);await p.close();
    guardar('recorridos.json',recorridos);guardar('inventario.json',[...inventario.values()]);
    guardar('inventario.md','# Inventario de cada control observado\n\nNombres accesibles obtenidos del árbol Accessibility de Chromium, enlazados al DOM por backendNodeId. Texto normalizado en espacios; «muestras» identifica recorrido o fixture. Se incluyen variantes y tarjetas individuales; no se afirma haber pulsado cada control. Los efectos no ejercitados se trazaron en app.js.\n\n'+tabla(['Selector','Control visible / nombre accesible','Zona / ayuda','Muestras','Qué hace realmente','Coincide'],[...inventario.values()].map(r=>[r.selector,(r.texto||r.etiqueta)+' / '+r.nombreAccesible,r.zona+' / '+r.ayuda,r.muestras.join(', '),...efecto(r)])));
    for(const r of recorridos)guardar(r.tipo+'-'+r.ancho+'-acciones.md','# Recorrido '+r.tipo+' a '+r.ancho+' px\n\nExpectativas: inferencias de inspección, no testimonios de usuarios. «Anuncio» es el texto mutado de regiones ARIA, no audio de un lector. Distancia = suma de cambios absolutos de scrollY por acción; no gestos humanos. Estado completo antes/después en recorridos.json.\n\n'+tabla(['Paso','Acción / expectativa','Qué pasó','Foco después','Texto anunciado por regiones ARIA','Desplazamiento px'],r.acciones.map(a=>[a.numero,a.operacion+' '+a.selector+' / '+a.esperaria,a.problema||`Mochila ${a.antes.botonesElegidos}→${a.despues.botonesElegidos}; lista DUA ${a.antes.conteos.dua}→${a.despues.conteos.dua}; acceso ${a.antes.conteos.acceso}→${a.despues.conteos.acceso}`,JSON.stringify(a.despues.foco),[...new Set(a.despues.avisos.filter(m=>m.visible).map(m=>m.texto))].join(' / ')||'Sin cambio de texto en región ARIA',a.desplazamiento])));
    assert.deepEqual(huellas(),original);
    guardar('metodo.json',{corte:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:raiz,encoding:'utf8'}).trim(),fecha:new Date().toISOString(),chromium:b.version(),huellas:original,recorridos:recorridos.map(r=>({tipo:r.tipo,ancho:r.ancho,acciones:r.acciones.length,desplazamientoTotal:r.desplazamientoTotal,errores:r.errores})),controles:[...inventario.values()].length,filtros:filtros.length});
    if(fs.existsSync(path.join(__dirname,'recorridos-parciales.json')))fs.unlinkSync(path.join(__dirname,'recorridos-parciales.json'));
    console.log('Completado',JSON.stringify({recorridos:recorridos.length,controles:inventario.size,filtros:filtros.length}));
  } finally {await b.close();await new Promise(ok=>servidor.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
