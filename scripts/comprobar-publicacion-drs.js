'use strict';
/* Guardia de publicación estática de Forja Fantasía DRS.
 * Examina los archivos realmente disponibles en el directorio que se
 * pretende publicar. No inspecciona solo el selector visual.
 *
 * node scripts/comprobar-publicacion-drs.js [DIRECTORIO]
 * node scripts/comprobar-publicacion-drs.js [DIRECTORIO] --report
 *
 * Sin --report, termina con error si hay DLC de Fantasía expuestos.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const args=process.argv.slice(2),report=args.includes('--report');
const argumento=args.find(x=>!x.startsWith('--'));
const raiz=path.resolve(argumento||path.join(__dirname,'..'));
const alertas=[];
function dato(ruta){
  const archivo=path.join(raiz,ruta);
  if(!fs.existsSync(archivo))return null;
  return JSON.parse(fs.readFileSync(archivo,'utf8'));
}
function afirmar(condicion,mensaje){
  if(condicion)alertas.push(mensaje);
}
// Evitar el falso positivo de una carpeta «segura» porque solo contiene
// index.html y faltan todos los archivos que la aplicación necesita cargar.
const requeridos=[
  'index.html','assets/styles.css','assets/icons-forja.svg','assets/equipment.js','assets/sex.js',
  'assets/rules.js','assets/powers.js','assets/spell-magnitudes.js',
  'assets/tooltips.js','assets/tooltip-ui.js','assets/app.js','assets/favicon.svg',
  'data/especies.json','data/ocupaciones.json',
  'data/especies_cifi.json','data/ocupaciones_cifi.json',
  'data/catalogo-ampliado.json','data/tesauro-ylat.json',
  'data/nombres-historicos-ylat.json',
  'data/sexo-personajes.json','data/catalogo-poderes.json',
  'data/conjuros-revisados-001-225.json',
  'data/conjuros-revisados-226-434.json',
  'data/conjuros-magnitudes-literales.json',
  'data/alcance-drs-y-dlc.json','data/conjuros-danio-compuesto.json',
  'data/progresiones-oficiales.json','data/equipo-inicial.json',
  'data/fichas-documentales.json','data/talentos-drs-literales.json',
  'data/dungeon-hack.json'
];
for(const ruta of requeridos)
  if(!fs.existsSync(path.join(raiz,ruta)))
    alertas.push('Falta archivo requerido por el arranque de Forja: '+ruta+
      '. No declarar publicable un paquete incompleto.');
// El lanzamiento público habilita exclusivamente Fantasía DRS y Dungeon Hack.
// No basta ocultar botones por CSS: tampoco deben existir opciones nativas.
const indexHtml=fs.existsSync(path.join(raiz,'index.html'))?
  fs.readFileSync(path.join(raiz,'index.html'),'utf8'):'';
if(indexHtml){
  const botones=[...indexHtml.matchAll(/data-juego="([^"]+)"/g)].map(m=>m[1]);
  const opciones=[...indexHtml.matchAll(/<option value="(nd20(?:_cifi|_nocturna)?|dh)">/g)]
    .map(m=>m[1]);
  afirmar(JSON.stringify(botones)!==JSON.stringify(['nd20','dh']),
    'La selección pública debe mostrar únicamente Fantasía DRS y Dungeon Hack.');
  afirmar(JSON.stringify(opciones)!==JSON.stringify(['nd20','dh']),
    'La selección nativa pública no debe ofrecer CiFi ni Nocturna.');
}
const extras=dato('data/catalogo-ampliado.json');
if(extras){
  const especies=Object.keys(extras.fantasia?.especies||{});
  const ocupaciones=Object.keys(extras.fantasia?.ocupaciones||{});
  afirmar(especies.length>0,'data/catalogo-ampliado.json incluye '+especies.length+
    ' Especies suplementarias de Fantasía accesibles como JSON.');
  afirmar(ocupaciones.length>0,'data/catalogo-ampliado.json incluye '+ocupaciones.length+
    ' Ocupaciones suplementarias de Fantasía accesibles como JSON.');
}
const catalogo=dato('data/catalogo-poderes.json');
const drsIds=new Set((catalogo?.conjuros||[])
  .filter(c=>c.origen==='Nd20').map(c=>c.id));
if(catalogo){
  const noDRS=(catalogo.conjuros||[]).filter(c=>c.origen!=='Nd20');
  afirmar(noDRS.length>0,'data/catalogo-poderes.json incorpora '+
    noDRS.length+' Conjuros ajenos al DRS, aunque el selector oculte DLC.');
  const tecnicas=(catalogo.tecnicas||[]).filter(t=>
    t.fuente==='Naufragio d20 Ocupaciones');
  afirmar(tecnicas.length>0,'data/catalogo-poderes.json incluye '+
    tecnicas.length+' Técnicas del suplemento de Ocupaciones.');
  const especiales=Object.keys(catalogo.especiales||{})
    .filter(k=>!['version','fuente'].includes(k));
  afirmar(especiales.length>0,'data/catalogo-poderes.json expone bloques '+
    'de Poderes especiales no clasificados por fuente DRS: '+especiales.join(', ')+
    '. Auditoría manual necesaria antes de distribuir.');
}
const revisados=['data/conjuros-revisados-001-225.json',
  'data/conjuros-revisados-226-434.json'];
const fichasConjuros=[];
for(const ruta of revisados){
  const d=dato(ruta);
  if(!d)continue;
  const fuera=(d.conjuros||[]).filter(c=>!drsIds.has(c.id_catalogo));
  afirmar(fuera.length>0,ruta+' contiene '+fuera.length+
    ' fichas de Conjuros que no pertenecen al catálogo de 64 del DRS.');
  fichasConjuros.push(...(d.conjuros||[]));
}
// Bloquear también una versión con los nombres correctos pero textos
// retocados: la etiqueta «DRS» no garantiza fidelidad al manual.
const registroHuellas=JSON.parse(fs.readFileSync(
  path.join(__dirname,'..','data','huellas-conjuros-drs.json'),'utf8'));
const huellas=registroHuellas.huellas;
if(drsIds.size!==64||Object.keys(huellas).length!==64)
  alertas.push('Se requieren 64 Conjuros DRS y 64 huellas originales verificadas.');
const apariciones=new Set();
for(const ficha of fichasConjuros){
  if(!drsIds.has(ficha.id_catalogo))continue;
  if(apariciones.has(ficha.id_catalogo)){
    alertas.push('Ficha duplicada del DRS: '+ficha.id_catalogo+
      ' ('+ficha.nombre_tomo+').');
    continue;
  }
  apariciones.add(ficha.id_catalogo);
  if(!Array.isArray(ficha.parrafos)){
    alertas.push('Ficha DRS sin párrafos: '+ficha.id_catalogo);
    continue;
  }
  const digest=crypto.createHash('sha256')
    .update(JSON.stringify(ficha.parrafos.map(x=>x.trim())),'utf8').digest('hex');
  if(digest!==huellas[ficha.id_catalogo])
    alertas.push('Ficha no literal respecto al DOCX DRS: '+ficha.nombre_tomo+
      ' ('+ficha.id_catalogo+').');
}
if(apariciones.size!==64)
  alertas.push('El paquete contiene '+apariciones.size+
    ' fichas DRS únicas; se requieren exactamente 64.');
const prog=dato('data/progresiones-oficiales.json');
if(prog){
  const fantasia=prog.ampliadas?.fantasia;
  if(fantasia&&typeof fantasia==='object')
    afirmar(Object.keys(fantasia).length>0,'data/progresiones-oficiales.json '+
      'incluye progresiones suplementarias de Fantasía.');
}
const meta=dato('data/sexo-personajes.json');
if(meta){
  const basicas=new Set(['Elfo agreste','Enano montañés','Humano común',
    'Mediano amable','Gnomo urbano','Semielfo','Orco común','Semiorco']);
  const cifi=dato('data/especies_cifi.json')||{};
  const otras=(extras?.nocturna?.especies)||{};
  for(const nombre of [...Object.keys(cifi),...Object.keys(otras)])
    basicas.add(nombre);
  const ajenas=Object.keys(meta.femeninos_por_especie||{})
    .filter(x=>!basicas.has(x));
  afirmar(ajenas.length>0,'data/sexo-personajes.json expone nombres '+
    'clasificados de '+ajenas.length+' Especies de Fantasía no publicadas.');
  const neutrales=(meta.sexo_por_especie_neutral||[]).filter(x=>!basicas.has(x));
  afirmar(neutrales.length>0,'data/sexo-personajes.json incluye '+
    neutrales.length+' Especies suplementarias en sexo_por_especie_neutral.');
  const femeninas=Object.keys(meta.ocupaciones_contexto_femenino||{});
  afirmar(femeninas.length>0,'data/sexo-personajes.json expone Ocupaciones '+
    'de Fantasía suplementaria: '+femeninas.length+'.');
}
const magnitudes=dato('data/conjuros-magnitudes-literales.json');
if(magnitudes){
  const extras= (magnitudes.registros||[]).filter(x=>!drsIds.has(x.id_catalogo));
  afirmar(extras.length>0,'data/conjuros-magnitudes-literales.json incluye '+
    extras.length+' magnitudes de Conjuros de suplementos.');
}
const danio=dato('data/conjuros-danio-compuesto.json');
if(danio){
  const extras=(danio.registros||[]).filter(x=>!drsIds.has(x.id_catalogo));
  afirmar(extras.length>0,'data/conjuros-danio-compuesto.json incluye '+
    extras.length+' fichas de daño de Conjuros suplementarios.');
}
const ficha=dato('data/fichas-documentales.json');
if(ficha){
  const extras=Object.values(ficha).filter(x=>
    x.sistema==='nd20'&&!(x.fuente||'').includes('NaufragioD20DRS'));
  afirmar(extras.length>0,'data/fichas-documentales.json contiene '+
    extras.length+' fichas de Fantasía de suplementos no publicados.');
}
const nombresYlat=dato('data/tesauro-ylat.json');
// Los 149 nombres combinados han sido autorizados expresamente;
// las 51 identidades documentadas continúan vetadas en el paquete público.
if(nombresYlat){
  const nombres=nombresYlat.entradas||[];
  const ids=new Set(nombres.map(x=>x.id));
  const literales=new Set(nombres.map(x=>x.nombre));
  afirmar(nombres.length!==149||ids.size!==149||literales.size!==149,
    'data/tesauro-ylat.json debe contener exactamente 149 nombres únicos.');
  const originales=nombres.filter(x=>x.tipo!=='combinado');
  afirmar(originales.length>0,'data/tesauro-ylat.json expone '+
    originales.length+' nombres de personajes documentados o de tipo no autorizado.');
  const sinAmbito=nombres.filter(x=>!['Niguace','Isla Tormenta'].includes(x.ambito));
  afirmar(sinAmbito.length>0,'data/tesauro-ylat.json incluye '+
    sinAmbito.length+' combinaciones sin ámbito documentado.');
  const porAmbito=nombres.reduce((r,x)=>(r[x.ambito]=(r[x.ambito]||0)+1,r),{});
  afirmar(porAmbito.Niguace!==116||porAmbito['Isla Tormenta']!==33,
    'data/tesauro-ylat.json debe preservar 116 combinaciones de Niguace y 33 de Isla Tormenta.');
  const tesauroMaestro=JSON.parse(fs.readFileSync(
    path.join(__dirname,'..','data','tesauro-ylat.json'),'utf8'));
  const autorizados=tesauroMaestro.entradas.filter(x=>x.tipo==='combinado');
  afirmar(JSON.stringify(nombres)!==JSON.stringify(autorizados),
    'Los nombres publicados difieren de las 149 combinaciones originales autorizadas.');
}
// El repertorio histórico es una fuente editorial expresamente autorizada,
// pero el candidato solo sirve 1422 formas únicas (1428 filas en origen).
// Una copia de un archivo incorrecto no puede pasar por una lista aprobada.
const historicos=dato('data/nombres-historicos-ylat.json');
if(historicos){
  const registros=historicos.entradas||[];
  const original=JSON.parse(fs.readFileSync(
    path.join(__dirname,'..','data','nombres-historicos-ylat.json'),'utf8'));
  const vistos=new Set();
  const esperados=original.entradas.filter(x=>{
    if(vistos.has(x.nombre))return false;
    vistos.add(x.nombre);
    return true;
  });
  afirmar(original.entradas.length!==1428||esperados.length!==1422,
    'La fuente histórica de Ylat requiere 1428 filas y 1422 formas únicas.');
  afirmar(registros.length!==1422||
    new Set(registros.map(x=>x.id)).size!==1422||
    new Set(registros.map(x=>x.nombre)).size!==1422,
    'El banco histórico público debe contener 1422 formas/identificadores únicos.');
  afirmar(JSON.stringify(registros)!==JSON.stringify(esperados),
    'El banco histórico público difiere de las formas autorizadas en la fuente original.');
}
if(alertas.length){
  console.error('RIESGO DE PUBLICACIÓN: la selección visual DRS NO aísla estos datos.');
  alertas.forEach((a,i)=>console.error('  '+(i+1)+'. '+a));
  console.error('No desplegar la raíz. Construir y comprobar antes un paquete '+
    'público depurado. Las fuentes privadas permanecen en el repositorio de trabajo.');
  if(!report)process.exitCode=1;
}else{
  console.log('No se detectaron las filtraciones conocidas de DLC Fantasía en: '+raiz);
  console.log('AVISO: este control no sustituye una auditoría de todos los archivos distribuidos.');
}
