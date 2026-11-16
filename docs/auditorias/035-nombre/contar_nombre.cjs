// Cuenta el corte auditado, excluyendo esta entrega para evitar contarse a sí misma.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const raiz = path.resolve(__dirname,'../../..');
const contar = texto => [...texto.matchAll(/prizma/gi)].length;
assert.equal(contar('Prizma prizma PRIZMA prismA'),3);
const rutas = cp.execFileSync('git',['ls-files','-z'],{cwd:raiz,encoding:'utf8'}).split('\0').filter(Boolean).filter(p=>!p.startsWith('docs/auditorias/035-nombre/'));
const archivos=[],binarios=[],nombres=[],directorios=[];
for(const ruta of rutas) {
  if(contar(ruta))nombres.push(ruta);
  if(fs.lstatSync(path.join(raiz,ruta)).isSymbolicLink() || !fs.statSync(path.join(raiz,ruta)).isFile()){directorios.push(ruta);continue;}
  const bytes=fs.readFileSync(path.join(raiz,ruta));let texto;
  try{texto=new TextDecoder('utf-8',{fatal:true}).decode(bytes);if(texto.includes('\0'))throw Error('binario');}catch{binarios.push(ruta);continue;}
  const cantidad=contar(texto);
  if(cantidad)archivos.push({archivo:ruta,apariciones:cantidad,lineas:texto.split(/\r?\n/).flatMap((t,i)=>contar(t)?[{linea:i+1,apariciones:contar(t)}]:[])});
}
const total=archivos.reduce((n,a)=>n+a.apariciones,0);
assert.equal(total,archivos.flatMap(a=>a.lineas).reduce((n,l)=>n+l.apariciones,0));
const porGrupo={};for(const a of archivos){const grupo=a.archivo.startsWith('docs/auditorias/')?'docs/auditorias/':a.archivo.startsWith('docs/')?'docs/ (resto)':a.archivo.startsWith('scripts/')?'scripts/':'producto y raíz';porGrupo[grupo]=(porGrupo[grupo]||0)+a.apariciones;}
const salida={corte:cp.execFileSync('git',['merge-base','HEAD','origin/main'],{cwd:raiz,encoding:'utf8'}).trim(),metodo:'Subcadena prizma, sin distinguir mayúsculas. Archivos versionados UTF-8 sin NUL. Excluye esta auditoría, .git y archivos no versionados. Binarios no incluidos en total de texto; rutas se cuentan aparte.',total,porGrupo,archivosConApariciones:archivos.length,archivos,archivosConNombrePrizma:nombres,enlacesODirectoriosExcluidos:directorios,binariosExcluidos:binarios};
fs.writeFileSync(path.join(__dirname,'apariciones.json'),JSON.stringify(salida,null,2)+'\n');
const tabla=['# Apariciones de Prizma en el corte auditado','',salida.metodo,'',`Total: **${total} apariciones** en **${archivos.length} archivos de texto**.`,'','| Archivo | Apariciones | Líneas |','| --- | --- | --- |',...archivos.map(a=>`| ${a.archivo} | ${a.apariciones} | ${a.lineas.map(l=>l.linea).join(', ')} |`),'','## Rutas que contienen el nombre','',...nombres.map(p=>'- '+p),'','Los binarios excluidos y el desglose completo están en apariciones.json. No se cuentan glifos dentro de PNG/SVG rasterizados ni texto comprimido de PDF. Su presencia visual se revisa aparte.',''];
fs.writeFileSync(path.join(__dirname,'apariciones.md'),tabla.join('\n'));
console.log(JSON.stringify({total,archivos:archivos.length,porGrupo,nombres:nombres.length,binarios:binarios.length}));
