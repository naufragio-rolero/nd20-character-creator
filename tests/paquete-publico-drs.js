'use strict';
/* Prueba del CONTENIDO REAL del paquete candidato, nunca solo de la UI. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..');
const salida=path.join(raiz,'dist','public-drs');
function leer(base,ruta){
  return JSON.parse(fs.readFileSync(path.join(base,'data',ruta),'utf8'));
}
if(!fs.existsSync(path.join(salida,'index.html')))
  throw Error('Primero ejecutar node scripts/crear-paquete-drs.js');
const core=leer(salida,'catalogo-poderes.json');
const original=leer(raiz,'catalogo-poderes.json');
assert.equal(core.conjuros.length,64);
assert.ok(core.conjuros.every(x=>x.origen==='Nd20'));
assert.deepEqual(core.conjuros,
  original.conjuros.filter(x=>x.origen==='Nd20'),
  'Ningún Conjuro básico se pierde ni se modifica en el paquete público');
assert.equal(core.tecnicas.length,14);
assert.ok(core.tecnicas.every(x=>['Naufragio d20 DRS',
  'Naufragio d20 CiFi'].includes(x.fuente)));
assert.deepEqual(Object.keys(core.especiales),['version'],
  'Los Poderes específicos de DLC de Fantasía no se distribuyen');
const exterior=leer(salida,'catalogo-ampliado.json');
const exteriorOrigen=leer(raiz,'catalogo-ampliado.json');
assert.deepEqual(exterior.fantasia,{especies:{},ocupaciones:{}});
assert.deepEqual(exterior.nocturna,exteriorOrigen.nocturna,
  'Nocturna debe conservar todas sus fichas');
assert.deepEqual(exterior.cifi,exteriorOrigen.cifi,
  'CiFi debe conservar sus fichas y ampliaciones propias');
assert.deepEqual(leer(salida,'especies_cifi.json'),leer(raiz,'especies_cifi.json'));
assert.deepEqual(leer(salida,'ocupaciones_cifi.json'),leer(raiz,'ocupaciones_cifi.json'));
assert.deepEqual(leer(salida,'dungeon-hack.json'),leer(raiz,'dungeon-hack.json'));
assert.deepEqual(leer(salida,'especies.json'),leer(raiz,'especies.json'));
assert.deepEqual(leer(salida,'ocupaciones.json'),leer(raiz,'ocupaciones.json'));
const publico=leer(salida,'progresiones-oficiales.json');
const progresoOrigen=leer(raiz,'progresiones-oficiales.json');
assert.deepEqual(publico.fantasia,progresoOrigen.fantasia);
assert.deepEqual(publico.cifi,progresoOrigen.cifi);
assert.deepEqual(publico.nocturna,progresoOrigen.nocturna);
assert.deepEqual(publico.ampliadas.nocturna,progresoOrigen.ampliadas.nocturna);
assert.deepEqual(publico.ampliadas.fantasia,{});
const ids=new Set(core.conjuros.map(x=>x.id));
for(const archivo of ['conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json']){
  const contenido=leer(salida,archivo);
  assert.ok(contenido.conjuros.length>0);
  assert.ok(contenido.conjuros.every(x=>ids.has(x.id_catalogo)),
    'No hay fichas de Conjuros ampliados en '+archivo);
}
// Las huellas se calcularon directamente a partir del DOCX DRS de 2026-10-31:
 // cada ficha incluye todas las líneas de su bloque, y Calentar metal añade
 // las 18 celdas de la tabla oficial en orden por filas.
const origenLiteral=leer(raiz,'huellas-conjuros-drs.json');
assert.equal(Object.keys(origenLiteral.huellas).length,64);
const revisadosCotejados=['conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json']
  .flatMap(archivo=>leer(salida,archivo).conjuros);
assert.equal(revisadosCotejados.length,64,
  'Una y solo una ficha textual por cada Conjuro DRS');
assert.equal(new Set(revisadosCotejados.map(x=>x.id_catalogo)).size,64);
for(const ficha of revisadosCotejados){
  const huella=crypto.createHash('sha256')
    .update(JSON.stringify(ficha.parrafos.map(x=>x.trim())),'utf8')
    .digest('hex');
  assert.equal(huella,origenLiteral.huellas[ficha.id_catalogo],
    'Fidelidad literal DRS: '+ficha.nombre_tomo);
}
const forja=revisadosCotejados.find(x=>x.id_catalogo==='conjuro-45');
assert.ok(forja.parrafos.some(x=>x.includes('ese objeto obtiene:')));
assert.ok(!forja.parrafos.some(x=>x.includes('ese objeto mundano obtiene:')),
  'Forja arcana no añade una restricción a objetos mundanos ajena al DRS');
const originalForja=['conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json']
  .flatMap(archivo=>leer(raiz,archivo).conjuros)
  .find(x=>x.id_catalogo==='conjuro-45');
assert.ok(originalForja.parrafos.some(x=>x.includes('ese objeto mundano obtiene:')),
  'El Tomo de trabajo debe permanecer intacto en el repositorio de desarrollo');
const calentar=revisadosCotejados.find(x=>x.id_catalogo==='conjuro-14');
assert.deepEqual(calentar.parrafos.slice(-18),
  ['Turno','Temperatura','Daño','1','Templada','-','2','Caliente','1d6',
    '3-4','Ardiente','2d6','5','Caliente','1d6','6','Templada','-'],
  'La tabla de Calentar metal forma parte del DRS aunque no sea párrafo de Word');
for(const archivo of ['conjuros-magnitudes-literales.json','conjuros-danio-compuesto.json']){
  const contenido=leer(salida,archivo);
  assert.ok(contenido.registros.every(x=>ids.has(x.id_catalogo)),
    'No hay magnitudes o daños de Conjuros ampliados en '+archivo);
}
const sexo=leer(salida,'sexo-personajes.json');
const especiesPermitidas=new Set([...Object.keys(leer(salida,'especies.json')),
  ...Object.keys(leer(salida,'especies_cifi.json')),
  ...Object.keys(exterior.nocturna.especies||{})]);
assert.ok(Object.keys(sexo.femeninos_por_especie).every(x=>especiesPermitidas.has(x)));
assert.deepEqual(sexo.ocupaciones_contexto_femenino,{});
assert.deepEqual(sexo.especies_preferencia_femenino,{});
const fichas=leer(salida,'fichas-documentales.json');
assert.ok(Object.values(fichas).every(x=>x.sistema!=='nd20'||
  (x.fuente||'').includes('NaufragioD20DRS')),
  'No hay documentación de Talentos de Ocupaciones Fantasy futuras');
// El autor ha autorizado las 149 combinaciones como nombres posibles,
 // pero los 51 personajes documentados NO forman parte de la distribución.
const onomastico=leer(salida,'tesauro-ylat.json');
const onomasticoOriginal=leer(raiz,'tesauro-ylat.json');
const combinaciones=onomasticoOriginal.entradas.filter(x=>x.tipo==='combinado');
const documentados=onomasticoOriginal.entradas.filter(x=>x.tipo==='documentado');
assert.equal(combinaciones.length,149);
assert.equal(documentados.length,51);
assert.deepEqual(onomastico.entradas,combinaciones,
  'Se publica el conjunto de 149 combinaciones exactas, sin inventar ni alterar nombres');
assert.equal(new Set(onomastico.entradas.map(x=>x.nombre)).size,149);
assert.equal(onomastico.entradas.filter(x=>x.ambito==='Niguace').length,116);
assert.equal(onomastico.entradas.filter(x=>x.ambito==='Isla Tormenta').length,33);
assert.ok(onomastico.entradas.every(x=>x.tipo==='combinado'));
assert.ok(!onomastico.entradas.some(x=>
  documentados.some(y=>y.nombre===x.nombre)),
  'Ningún personaje documentado puede convertirse en un nombre aleatorio público');
const historicosDev=leer(raiz,'nombres-historicos-ylat.json');
const historicosPublico=leer(salida,'nombres-historicos-ylat.json');
const vistosHistoricos=new Set();
const historicosAutorizados=historicosDev.entradas.filter(x=>{
  if(vistosHistoricos.has(x.nombre))return false;
  vistosHistoricos.add(x.nombre);return true;
});
assert.equal(historicosDev.entradas.length,1428);
assert.equal(historicosAutorizados.length,1422);
assert.deepEqual(historicosPublico.entradas,historicosAutorizados,
  'El paquete contiene exactamente las 1422 formas históricas autorizadas, sin duplicados');
assert.equal(new Set(historicosPublico.entradas.map(x=>x.nombre)).size,1422);
assert.equal(leer(salida,'alcance-drs-y-dlc.json').paquetes_posteriores,undefined,
  'No se distribuye información interna de paquetes suplementarios');
const equipo=leer(salida,'equipo-inicial.json');
assert.equal(equipo.armas.find(x=>x.nombre==='Dardo').precio,0);
assert.equal(equipo.armas.find(x=>x.nombre==='Almádena').precio,60);
assert.equal(equipo.utiles_fantasia.campamento.find(x=>x.nombre==='Martillo de campamento').precio,2);
const consultaPublica=leer(salida,'equipo-consulta-drs.json');
const consultaFuente=leer(raiz,'equipo-consulta-drs.json');
assert.deepEqual(consultaPublica,consultaFuente,
  'El catálogo de consulta DRS distribuido coincide íntegramente con la fuente');
assert.equal(consultaPublica.tablas.reduce((n,t)=>n+t.registros.length,0),10);
assert.equal(consultaPublica.equivalencias_explicitas_paquetes.length,5);
assert.equal(consultaPublica.objetos_comunes_sin_precio.length,5);
assert.equal(consultaPublica.version,2);
assert.ok(consultaPublica.objetos_comunes_sin_precio.every(x=>
  x.descripcion_editorial&&/editorial/.test(x.origen_descripcion)));
assert.ok(consultaPublica.objetos_comunes_sin_precio.every(x=>
  x.precio===undefined&&x.precio_literal===undefined),
  'No inventar precios para los cinco artículos normales de viaje');
assert.ok(!JSON.stringify(consultaPublica).includes('Manto de Vagryen'),
  'No distribuir Objetos mágicos suplementarios con el equipo DRS');
const marca=core.conjuros.find(x=>x.nombre==='Marca del dador oscuro');
assert.equal(marca.circulo,5);
assert.ok(core.listas_drs.Clérigo['5'].includes(marca.nombre));
assert.ok(!core.listas_drs.Clérigo['4'].includes(marca.nombre));
const talentosPublicos=leer(salida,'talentos-drs-literales.json');
const talentosDev=leer(raiz,'talentos-drs-literales.json');
assert.deepEqual(talentosPublicos,talentosDev,
  'El catálogo público conserva exactamente el texto del DRS sin suplementos.');
assert.equal(talentosPublicos.registros.length,24);
assert.equal(talentosPublicos.registros.filter(x=>x.tipo_origen==='Especie').length,15);
assert.equal(talentosPublicos.registros.filter(x=>x.tipo_origen==='Ocupación').length,9);
assert.equal(new Set(talentosPublicos.registros.map(x=>x.id)).size,24);
assert.ok(talentosPublicos.registros.every(x=>
  x.estado==='cotejado_literal_DRS'&&x.efecto_literal&&
  x.id.startsWith('talento-drs-')&&x.parrafos_documento.length));
const aclaracionesPublicas=leer(salida,'aclaraciones-talentos-drs.json');
const aclaracionesDev=leer(raiz,'aclaraciones-talentos-drs.json');
assert.deepEqual(aclaracionesPublicas,aclaracionesDev,
  'No perder ni alterar aclaraciones autorales aprobadas en el paquete DRS');
assert.equal(aclaracionesPublicas.estado,'aprobacion_autoral');
assert.equal(aclaracionesPublicas.registros.length,2);
assert.deepEqual(aclaracionesPublicas.registros.map(x=>x.id_talento).sort(),[
  'talento-drs-especie-mediano-amable-salvese-quien-pueda',
  'talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes'
].sort(),'Prohibida la entrada de aclaraciones ajenas a los dos Talentos ratificados');
assert.ok(aclaracionesPublicas.registros.every(a=>
  talentosPublicos.registros.some(r=>r.id===a.id_talento&&
    r.propietario===a.propietario&&r.nombre===a.nombre)));
assert.ok(aclaracionesPublicas.registros.find(a=>a.nombre==='Expulsar muertos vivientes')
  .texto.includes('3 zombis y 2 esqueletos'));
assert.ok(aclaracionesPublicas.registros.find(a=>a.nombre==='¡Sálvese quien pueda!')
  .texto.includes('Parálisis o Miedo'));
const html=fs.readFileSync(path.join(salida,'index.html'),'utf8');
assert.ok(!html.includes('Doncella de la Espada'));
assert.ok(html.includes('class="juegos-compactos juegos-publicos"'));
assert.ok(html.includes('data-juego="nd20"'));
assert.ok(html.includes('data-juego="dh"'));
assert.ok(!html.includes('data-juego="nd20_cifi"'));
assert.ok(!html.includes('data-juego="nd20_nocturna"'));
assert.ok(!html.includes('<option value="nd20_cifi">'));
assert.ok(!html.includes('<option value="nd20_nocturna">'));
assert.ok(html.includes('Históricos de Ylat'));
assert.ok(html.includes('id="selector-visual-especie"'));
assert.ok(html.includes('id="dialogo-especie"'));
assert.ok(html.includes('assets/i18n.js'));
assert.ok(fs.existsSync(path.join(salida,'locales','es.json')));
assert.ok(html.includes('id="selector-visual-ocupacion"'));
assert.ok(html.includes('id="generar-flotante"'));
assert.ok(html.includes('id="informacion-avanzada"'));
assert.ok(fs.existsSync(path.join(salida,'assets','icons-forja.svg')));
assert.equal((fs.readFileSync(path.join(salida,'assets','icons-forja.svg'),'utf8')
  .match(/<symbol id=/g)||[]).length,12,
  'Se distribuyen exactamente 8 pictogramas de Especie y 4 de Ocupación');
assert.ok(html.indexOf('value="historico"')<html.indexOf('value="combinado"'),
  'El banco histórico debe ser el modo predeterminado en la distribución');
assert.ok(html.includes('Variantes de Ylat'));
assert.ok(html.includes('Según Especie'));
assert.ok(!html.includes('value="documentado"'),
  'El paquete no debe permitir seleccionar personajes documentados');
assert.ok(!html.includes('Personajes documentados (51)'),
  'No mostrar los 51 nombres de PNJ en el selector público');
assert.ok(html.includes('id="ambito-nombre"'));
assert.ok(html.includes('<option value="Niguace">Niguace</option>'));
assert.ok(html.includes('<option value="Isla Tormenta">Isla Tormenta</option>'));
assert.ok(html.includes('Origen de las variantes'));
assert.ok(html.includes('Los nombres sugeridos no determinan el origen ni la historia del personaje.'));
assert.ok(!html.includes('Procedencia del nombre de Ylat'),
  'No presentar agrupaciones documentales como culturas de nacimiento');
const rutaData=path.join(salida,'data');
const contenidos=new Set(fs.readdirSync(rutaData));
const esperados=new Set([
  'especies.json','ocupaciones.json','especies_cifi.json','ocupaciones_cifi.json',
  'catalogo-ampliado.json','tesauro-ylat.json','nombres-historicos-ylat.json',
  'sexo-personajes.json',
  'catalogo-poderes.json','conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json','conjuros-magnitudes-literales.json',
  'alcance-drs-y-dlc.json','conjuros-danio-compuesto.json',
  'progresiones-oficiales.json','equipo-inicial.json','equipo-consulta-drs.json','fichas-documentales.json',
  'talentos-drs-literales.json','aclaraciones-talentos-drs.json',
  'dungeon-hack.json'
]);
assert.deepEqual(contenidos,esperados,
  'La distribución solo contiene archivos JSON explícitamente autorizados');
// El build debe fallar en lugar de destruir por error un directorio fuente.
const {spawnSync}=require('node:child_process');
for(const directorio of ['data','assets','.']){
  const resultado=spawnSync(process.execPath,
    [path.join(raiz,'scripts','crear-paquete-drs.js'),path.join(raiz,directorio)],
    {encoding:'utf8'});
  assert.notEqual(resultado.status,0,
    'El generador jamás debe poder limpiar '+directorio);
}
// El guardia debe rechazar no solo DLC externos: también una ficha DRS
// modificada después de construir y un duplicado introducido en el ZIP.
const temporal=fs.mkdtempSync(
  path.join(require('node:os').tmpdir(),'forja-paquete-falsificado-'));
try{
  fs.cpSync(salida,temporal,{recursive:true});
  const scriptGuardia=path.join(raiz,'scripts','comprobar-publicacion-drs.js');
  const archivoUno=path.join(temporal,'data','conjuros-revisados-001-225.json');
  const originalUno=fs.readFileSync(archivoUno,'utf8');
  const mutado=JSON.parse(originalUno);
  const editar=mutado.conjuros.find(x=>x.id_catalogo==='conjuro-45')||
    mutado.conjuros.find(x=>x.id_catalogo==='conjuro-14');
  assert.ok(editar,'La prueba de falsificación requiere un Conjuro DRS');
  editar.parrafos[editar.parrafos.length-1]+=' CAMBIO NO AUTORIZADO';
  fs.writeFileSync(archivoUno,JSON.stringify(mutado));
  const alterado=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(alterado.status,1,'Una ficha editada invalida el paquete');
  assert.match(alterado.stderr,/Ficha no literal respecto al DOCX DRS/);
  fs.writeFileSync(archivoUno,originalUno);
  const duplicado=JSON.parse(originalUno);
  duplicado.conjuros.push(structuredClone(duplicado.conjuros[0]));
  fs.writeFileSync(archivoUno,JSON.stringify(duplicado));
  const repetido=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(repetido.status,1,'Un duplicado invalida el paquete');
  assert.match(repetido.stderr,/Ficha duplicada del DRS/);
  // Tampoco se puede publicar una identidad documental entre los nombres
  // propuestos o sustituir arbitrariamente uno de los 149 autorizados.
  const archivoYlat=path.join(temporal,'data','tesauro-ylat.json');
  const originalYlat=fs.readFileSync(archivoYlat,'utf8');
  const colado=JSON.parse(originalYlat);
  colado.entradas.push(documentados[0]);
  fs.writeFileSync(archivoYlat,JSON.stringify(colado));
  const publicoColado=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(publicoColado.status,1,'Un PNJ documentado invalida el paquete');
  assert.match(publicoColado.stderr,/nombres de personajes documentados/);
  fs.writeFileSync(archivoYlat,originalYlat);
  const cambiado=JSON.parse(originalYlat);
  cambiado.entradas[0].nombre='Nombre inventado no aprobado';
  fs.writeFileSync(archivoYlat,JSON.stringify(cambiado));
  const nombreDistinto=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(nombreDistinto.status,1,'Un cambio no autorizado en nombres invalida el paquete');
  assert.match(nombreDistinto.stderr,/149 combinaciones originales autorizadas/);
  const archivoHistorico=path.join(temporal,'data','nombres-historicos-ylat.json');
  const originalHistorico=fs.readFileSync(archivoHistorico,'utf8');
  const falso=JSON.parse(originalHistorico);
  falso.entradas[0].nombre='Forma no autorizada';
  fs.writeFileSync(archivoHistorico,JSON.stringify(falso));
  const respuesta=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(respuesta.status,1,'Una forma histórica alterada invalida el paquete');
  assert.match(respuesta.stderr,/difiere de las formas autorizadas/);
  fs.writeFileSync(archivoHistorico,originalHistorico);
}finally{
  fs.rmSync(temporal,{recursive:true,force:true});
}
console.log('OK · Paquete público DRS: 64 Conjuros/10 Técnicas básicas, 4 CiFi, Nocturna y DH preservados.');
console.log('OK · DLC Fantasía ausentes físicamente; índice y catálogos, reglas y seguridad de salida verificados.');
