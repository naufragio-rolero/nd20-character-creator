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
for(const id of ['tecnica-06','tecnica-09']){
  const publicado=core.tecnicas.find(x=>x.id===id);
  const origen=original.tecnicas.find(x=>x.id===id);
  assert.ok(publicado&&origen,'Técnica DRS presente en ambos catálogos: '+id);
  assert.deepEqual(publicado,origen,
    'Las condiciones estructuradas y el texto original se conservan en el paquete: '+id);
  assert.ok(Array.isArray(publicado.ocupaciones_permitidas)&&
    publicado.ocupaciones_permitidas.length===1,
    'La Ocupación permitida es explícita en el paquete público: '+id);
  assert.ok(Array.isArray(publicado.requisitos_uso),
    'Los requisitos de uso siguen separados de la adquisición: '+id);
}
assert.deepEqual(core.tecnicas.find(x=>x.id==='tecnica-06').requisitos_uso,
  [{tipo:'nivel',minimo:6}],'Nivel 6+ de Rajar disponible como requisito de uso');
assert.deepEqual(core.tecnicas.find(x=>x.id==='tecnica-09').requisitos_uso,[],
  'Ataque sorpresa conserva una lista de requisitos de uso vacía');
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
const formasSeguidorOriginal=leer(raiz,'sexo-personajes.json').seguidores_profesiones_drs;
assert.deepEqual(sexo.seguidores_profesiones_drs,formasSeguidorOriginal,
  'Las formas masculina y femenina de los doce oficios siguen publicadas en el DRS');
assert.equal(Object.keys(sexo.seguidores_profesiones_drs).length,12);
assert.equal(sexo.seguidores_profesiones_drs.Mensajero.femenino,'Mensajera');
// El catálogo editorial no puede adelantar las Ocupaciones, Especies
// ni Conceptos de Fantasía ampliada al paquete público DRS.
const ocupacionesPermitidas=new Set([
  ...Object.keys(leer(salida,'ocupaciones.json')),
  ...Object.keys(leer(salida,'ocupaciones_cifi.json')),
  ...Object.keys(exterior.nocturna.ocupaciones||{})
]);
const conceptosPermitidos=new Set([
  ...Object.values(leer(salida,'ocupaciones.json')),
  ...Object.values(leer(salida,'especies.json')),
  ...Object.values(leer(salida,'ocupaciones_cifi.json')),
  ...Object.values(leer(salida,'especies_cifi.json')),
  ...Object.values(exterior.nocturna.ocupaciones||{}),
  ...Object.values(exterior.nocturna.especies||{})
].flatMap(x=>x.conceptos||[]));
assert.deepEqual(new Set(Object.keys(sexo.ocupaciones_formas_genero)),ocupacionesPermitidas,
  'Solo Ocupaciones autorizadas presentes en el JSON editorial publicado');
assert.deepEqual(new Set(Object.keys(sexo.especies_formas_genero)),especiesPermitidas,
  'Solo Especies autorizadas presentes en el JSON editorial publicado');
assert.ok(Object.keys(sexo.conceptos_formas_genero).every(x=>conceptosPermitidos.has(x)),
  'No filtrar por mero nombre de Concepto: cotejar el catálogo permitido');
assert.equal(sexo.ocupaciones_formas_genero.Guerrero.femenino,'Guerrera');
assert.equal(sexo.especies_formas_genero['Elfo agreste'].femenino,'Elfa agreste');
assert.equal(sexo.conceptos_formas_genero['Valiente defensor'].femenino,
  'Valiente defensora');
assert(!Object.hasOwn(sexo.ocupaciones_formas_genero,'Truhán'),
  'Truhán, de suplemento no publicado, no puede viajar en LIVE');
assert(!Object.hasOwn(sexo.especies_formas_genero,'Dracónido'),
  'Dracónido, de suplemento no publicado, no puede viajar en LIVE');
const fichas=leer(salida,'fichas-documentales.json');
assert.ok(Object.values(fichas).every(x=>x.sistema!=='nd20'||
  (x.fuente||'').includes('NaufragioD20DRS')),
  'No hay documentación de Talentos de Ocupaciones Fantasy futuras');
// Tras excluir el corpus externo a Ylat, quedan 33 combinaciones
// públicas y 19 identidades documentadas que NO pasan a distribución.
const onomastico=leer(salida,'tesauro-ylat.json');
const onomasticoOriginal=leer(raiz,'tesauro-ylat.json');
const combinaciones=onomasticoOriginal.entradas.filter(x=>x.tipo==='combinado');
const documentados=onomasticoOriginal.entradas.filter(x=>x.tipo==='documentado');
assert.equal(combinaciones.length,33);
assert.equal(documentados.length,262);
assert.equal(onomasticoOriginal.entradas.length,295);
assert.deepEqual(onomastico.entradas,onomasticoOriginal.entradas,
  'La distribución pública conserva los 262 documentados y las 33 combinaciones autorizadas');
assert.equal(new Set(onomastico.entradas.map(x=>x.nombre)).size,295);
assert.ok(!/niguac|niguaz/i.test(JSON.stringify(onomastico)));
assert.equal(onomastico.entradas.filter(x=>x.tipo==='documentado').length,262);
assert.equal(onomastico.entradas.filter(x=>x.tipo==='combinado').length,33);
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
const nuevasCategorias=['instrumentos','objetos_varios','monturas',
  'equipo_monturas','vehiculos'];
assert.deepEqual(nuevasCategorias.map(k=>equipo.utiles_fantasia[k].length),
  [4,8,6,6,4], 'El paquete DRS incluye exactamente 28 filas nuevas aprobadas');
const fijo=equipo.utiles_fantasia.equipo_monturas;
assert.equal(fijo.find(x=>x.nombre==='Armadura equina').precio,undefined,
  'Armadura equina no puede disponer de precio fijo ficticio');
assert.equal(fijo.find(x=>x.nombre==='Armadura equina').precio_variable,
  'Precio de la protección corporal ×4');
assert.equal(fijo.find(x=>x.nombre==='Armadura equina').regla_precio_autoral.multiplicador,4,
  'La aclaración autoral está disponible solo para calcular precio informativo');
assert.equal(equipo.componentes_paquetes_editoriales.length,5,
  'El paquete DRS conserva exactamente cinco descripciones de componentes');
assert.deepEqual(equipo.componentes_paquetes_editoriales.map(x=>x.nombre),[
  'Mochila','Bolsa de cuero','Odre de agua',
  'Estuche de pergaminos vacío','Ropa de viaje']);
equipo.componentes_paquetes_editoriales.forEach(x=>{
  assert.ok(x.descripcion_editorial&&/editorial autorizada/.test(x.origen_descripcion),
    'La descripción autoral debe estar identificada');
  assert.equal(x.precio,undefined,'Sin precio suelto de componente de paquete');
});
assert.equal(equipo.componentes_paquetes_editoriales.find(x=>
  x.nombre==='Odre de agua').du,'d6');
assert.equal(fijo.find(x=>x.nombre==='Establos').servicio_por_dia,true);
assert.equal(equipo.utiles_fantasia.objetos_varios.find(x=>x.nombre==='Pipa de tabaco').du,
  'd4 (tabaco)');
const svgEquipo=fs.readFileSync(path.join(salida,'assets/icons/equipo-caballo.svg'),'utf8');
assert.match(svgEquipo,/<svg[^>]+viewBox="0 0 24 24"/,
  'El caballo completo se distribuye como SVG autónomo');
const prendasDRS=equipo.utiles_fantasia.ropa;
assert.deepEqual(prendasDRS.map(x=>[x.nombre,x.precio,x.detalle]),[
  ['Abrigo de piel',20,'Protege del frío por debajo de 0º.'],
  ['Atuendo de noble',30,'De colores vivos, con chorreras y gola.'],
  ['Chaqueta de cuero',10,'Protege del frío por debajo de 10º.'],
  ['Disfraz',5,'Contiene maquillaje, peluca y bigote falso.'],
  ['Traje elegante',15,'Parece de buena calidad.'],
  ['Túnica',1,'De color a elegir. Hecha de tela y esparto.']
], 'El paquete público conserva las seis prendas de la tabla Ropa del DRS');
assert.equal(equipo.utiles_fantasia.ropa.some(x=>x.nombre==='Ropa de viaje'),false,
  'Ropa de viaje solo consta en paquetes, sin ficha individual documentada');
const iluminacionDRS=equipo.utiles_fantasia.iluminacion;
assert.deepEqual(iluminacionDRS.map(x=>[x.nombre,x.precio,x.du]),[
  ['Antorcha',0.1,'d6'],['Lámpara de aceite',2,'d6 (aceite)'],
  ['Linterna',10,'d6 (aceite)'],['Vela',0.01,'d4']
], 'El paquete público incorpora únicamente la iluminación documentada en el DRS');

assert.equal(equipo.armas.find(x=>x.nombre==='Dardo').precio,0.05);
assert.equal(equipo.armas.find(x=>x.nombre==='Almádena').precio,60);
assert.equal(equipo.utiles_fantasia.campamento.find(x=>x.nombre==='Martillo de campamento').precio,2);
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
assert.ok(html.includes('Nombres genéricos')&&html.includes('Nombres de Ylat'));
assert.ok(!html.includes('Históricos de Ylat'));
assert.ok(html.includes('id="selector-visual-especie"'));
assert.ok(html.includes('id="dialogo-especie"'));
assert.ok(html.includes('assets/i18n.js'));
assert.ok(fs.existsSync(path.join(salida,'locales','es.json')));
assert.ok(html.includes('id="selector-visual-ocupacion"'));
assert.ok(html.includes('id="generar-flotante"'));
assert.ok(html.includes('id="abrir-configuracion"'));
assert.ok(html.includes('id="dialogo-configuracion"'));
assert.ok(html.includes('id="resumen-nivel"'));
assert.ok(html.includes('id="informacion-avanzada"'));
assert.ok(html.includes('id="tab-criaturas"'));
for(const modulo of ['creatures.js','creatures-import.js',
  'creatures-library.js','creatures-components.js','creatures-ui.js']){
  const ruta='assets/'+modulo;
  assert.ok(html.includes(ruta),'El HTML incluye '+ruta);
  assert.ok(fs.existsSync(path.join(salida,ruta)),'El paquete sirve '+ruta);
}
const fuentesPublicas=leer(salida,'adversarios-fuentes.json');
assert.equal(fuentesPublicas.sistema,'nd20');
assert.equal(fuentesPublicas.fuentes.length,1);
assert.equal(fuentesPublicas.fuentes[0].id,'drs');
assert.equal(fuentesPublicas.fuentes[0].total,106);
const catalogoOficial=leer(salida,'adversarios-drs.json');
const relacionesPublicas=leer(salida,'adversarios-relaciones-drs.json');
assert.deepEqual(relacionesPublicas,leer(raiz,'adversarios-relaciones-drs.json'),
  'El paquete DRS contiene exclusivamente los vínculos oficiales verificados.');
assert.equal(relacionesPublicas.relaciones.length,77);
const componentesPublicos=require(path.join(salida,'assets','creatures-components.js'));
const componentesDRS=componentesPublicos.crearCatalogo([{
  info:fuentesPublicas.fuentes[0],registros:leer(salida,'adversarios-drs.json').registros
}],{ataques:[],talentos:[]},relacionesPublicas);
assert.deepEqual(componentesDRS.resumen(),{ataques:182,talentos:188,relaciones:77},
  'Ninguna expansión entra en la biblioteca pública DRS.');

assert.equal(catalogoOficial.fuente,'Naufragio d20 DRS');
assert.equal(catalogoOficial.registros.length,106,
  'El nuevo encargo autoriza solo los 106 adversarios documentados del DRS');
assert.equal(new Set(catalogoOficial.registros.map(x=>x.id)).size,106);
assert.ok(catalogoOficial.registros.every(x=>x.fuente==='Naufragio d20 DRS'));
assert.deepEqual(fs.readdirSync(path.join(salida,'data'))
  .filter(nombre=>/^(?:criaturas|bestiario)/i.test(nombre)),[],
  'No publicar otros bestiarios ni volcados de auditoría externos.');
// El PDF A5 se distribuye completo con el paquete DRS; no depende de CDN ni del árbol de desarrollo.
const pdfA5=[
  'assets/pdf-export-v2.js','assets/pdf-export-browser.js',
  'assets/pdf-a5/forja-fantasia-epica-a5.pdf',
  'assets/pdf-a5/forja-continuacion-a5.pdf',
  'assets/pdf-a5/campos-ficha-a5.json',
  'assets/pdf-a5/SourceSerif4_400Regular.ttf',
  'assets/pdf-a5/SourceSerif4_700Bold.ttf',
  'assets/pdf-a5/OFL-SourceSerif4.txt',
  'assets/vendor/pdf-lib.min.js','assets/vendor/fontkit.umd.min.js',
  'assets/vendor/LICENSE-pdf-lib.txt','assets/vendor/LICENSE-fontkit.txt'
];
for(const file of pdfA5){
  assert(fs.existsSync(path.join(salida,file)),
    'La exportación A5 requiere el activo local '+file);
  assert(fs.statSync(path.join(salida,file)).size>100,file+': archivo insuficiente');
}
const publicPdfIndex=fs.readFileSync(path.join(salida,'index.html'),'utf8');
const publicPdfApp=fs.readFileSync(path.join(salida,'assets/app.js'),'utf8');
assert(publicPdfIndex.includes('assets/pdf-export-browser.js'));
assert(publicPdfApp.includes('exportar-pdf-ficha'));
assert(!fs.readFileSync(path.join(salida,'assets/pdf-export-browser.js'),'utf8').includes('https://')&&
  !fs.readFileSync(path.join(salida,'assets/pdf-export-browser.js'),'utf8').includes('http://'),
  'El motor de descarga PDF no puede cargar bibliotecas CDN');
const templateA5=fs.readFileSync(path.join(salida,'assets/pdf-a5/forja-fantasia-epica-a5.pdf'));
assert.equal(templateA5.subarray(0,5).toString('ascii'),'%PDF-');
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(salida,'assets/pdf-a5/campos-ficha-a5.json'))).campos_fijos.length,32);
const iconosPublicos=fs.readdirSync(path.join(salida,'assets','icons'))
  .filter(nombre=>nombre.endsWith('.svg'));
assert.equal(iconosPublicos.length,40,'El paquete contiene exactamente 40 SVG (35 + 5 acciones)');
const cssAcciones=fs.readFileSync(path.join(salida,'assets/styles.css'),'utf8');
for(const nombre of ['accion-equipo','accion-talentos','accion-pdf',
  'accion-semilla','accion-copiar']){
  const fichero=nombre+'.svg';
  assert.ok(iconosPublicos.includes(fichero),nombre+': icono del pie publicado');
  assert.ok(cssAcciones.includes('url(icons/'+fichero+')'),nombre+': mascara CSS en el paquete');
}
const licenciaTabler=fs.readFileSync(
  path.join(salida,'assets/icons/LICENCIA-TABLER.txt'),'utf8');
assert.match(licenciaTabler,/MIT License/);
assert.match(licenciaTabler,/Copyright \(c\) 2020-2026 Paweł Kuna/);
assert.ok(html.includes('assets/icons/LICENCIA-TABLER.txt'),'Licencia MIT enlazada en público');
assert.ok(!html.includes('id="generar-mazmorra"'),'Sin herramienta legacy en DRS');
// Logos de identidad de sistema: exactamente dos WebP locales, sin DLC.
// Cada archivo distribuido debe ser idéntico al aprobado en la rama.
const logosWebp=['sistema-nd20-faep.webp','sistema-dh.webp'];
const logosPublicos=fs.readdirSync(path.join(salida,'assets','icons'))
  .filter(nombre=>nombre.endsWith('.webp')).sort();
assert.deepEqual(logosPublicos,logosWebp.slice().sort());
for(const nombre of logosWebp){
  const ruta='assets/icons/'+nombre;
  const publicado=fs.readFileSync(path.join(salida,ruta));
  const original=fs.readFileSync(path.join(raiz,ruta));
  assert.ok(publicado.length>1000&&publicado.length<80000,nombre+': tamaño WebP razonable');
  assert.equal(publicado.toString('ascii',0,4),'RIFF',nombre+': contenedor RIFF');
  assert.equal(publicado.toString('ascii',8,12),'WEBP',nombre+': formato WebP real');
  assert.deepEqual(publicado,original,nombre+': logo original sin transformación');
  assert.ok(html.includes('src="'+ruta+'"'),nombre+': logo referenciado desde HTML');
}
assert.ok(!html.includes('>Nd20F</strong>')&&!html.includes('>DH</strong>'),
  'El selector ya no usa glifos ni abreviaturas en lugar de los logotipos.');
for(const nombre of iconosPublicos){
  const svg=fs.readFileSync(path.join(salida,'assets','icons',nombre),'utf8');
  assert.match(svg,/viewBox="0 0 24 24"/,nombre+': lienzo cuadrado');
  assert.ok(!svg.includes('<symbol'),nombre+': sin dependencia del sprite');
}
assert.ok(!fs.existsSync(path.join(salida,'assets','icons-forja.svg')),
  'El antiguo sprite no debe distribuirse');
assert.ok(html.includes('<option value="generico">Nombres genéricos</option>'),
  'Generador genérico accesible en el paquete');
assert.ok(html.includes('<option value="ylat">Nombres de Ylat</option>'),
  'Generador Ylat accesible en el paquete');
assert.ok(html.indexOf('value="generico"')<html.indexOf('value="ylat"'));
assert.ok(!html.includes('value="historico"')&&!html.includes('value="combinado"')&&
  !html.includes('value="documentado"'),'No hay modos anteriores en el selector');
assert.ok(!html.includes('id="buscar-nombre-ylat"')&&
  !html.includes('id="ambito-nombre"'),'Sin buscador ni lista separada de Isla Tormenta');
assert.ok(html.includes('assets/names.js'),'El motor modular debe cargarse');
assert.ok(!/niguac|niguaz/i.test(html),
  'No debe existir un selector del ámbito excluido');
const componentes=leer(salida,'componentes-nombres-ylat.json');
const componentesDev=leer(raiz,'componentes-nombres-ylat.json');
assert.deepEqual(componentes,componentesDev);
assert.equal(componentes.nombres.length,255);
assert.equal(componentes.apellidos.length,133);
for(const casa of ['Shadelgast','Bronnhum','Boll'])
  assert.equal(componentes.apellidos.find(x=>x.nombre===casa).peso_relativo,1);
assert.ok(fs.existsSync(path.join(salida,'assets/names.js')));
assert.ok(!html.includes('Procedencia del nombre de Ylat'),
  'No presentar agrupaciones documentales como culturas de nacimiento');
// Los tres catálogos de consulta publicados deben coincidir físicamente
// con sus fuentes aprobadas de esta revisión, sin registros de suplementos.
for(const [archivo,cantidad] of [
  ['tecnicas-drs-literales.json',10],
  ['glosas-talentos-drs.json',24],
  ['glosas-equipo-drs.json',111]
]){
  const publicado=leer(salida,archivo);
  const desarrollo=leer(raiz,archivo);
  assert.deepEqual(publicado,desarrollo,'Fuente pública idéntica: '+archivo);
  assert.equal(publicado.registros.length,cantidad,'Cobertura: '+archivo);
}
const glosasTalentosPublicas=leer(salida,'glosas-talentos-drs.json');
assert.equal(glosasTalentosPublicas.registros.filter(x=>x.tipo_origen==='Especie').length,15);
const catalogoEquipoPublicado=leer(salida,'glosas-equipo-drs.json');
assert.equal(new Set(catalogoEquipoPublicado.registros.map(x=>x.nombre)).size,111);
assert.ok(catalogoEquipoPublicado.registros.every(x=>
  typeof x.descripcion_editorial==='string'&&x.descripcion_editorial.trim()));
const rutaData=path.join(salida,'data');
const contenidos=new Set(fs.readdirSync(rutaData));
const esperados=new Set([
  'especies.json','ocupaciones.json','especies_cifi.json','ocupaciones_cifi.json',
  'catalogo-ampliado.json','tesauro-ylat.json','nombres-historicos-ylat.json',
  'componentes-nombres-ylat.json',
  'sexo-personajes.json',
  'catalogo-poderes.json','conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json','conjuros-magnitudes-literales.json',
  'alcance-drs-y-dlc.json','conjuros-danio-compuesto.json',
  'progresiones-oficiales.json','equipo-inicial.json','fichas-documentales.json',
  'talentos-drs-literales.json','aclaraciones-talentos-drs.json',
  'tecnicas-drs-literales.json','glosas-talentos-drs.json',
  'glosas-equipo-drs.json',
  'adversarios-drs.json','adversarios-fuentes.json',
  'dungeon-hack.json'
]);
assert.deepEqual(contenidos,esperados,
  'La distribución solo contiene archivos JSON explícitamente autorizados');
const iconosAdversarios=JSON.parse(fs.readFileSync(
  path.join(salida,'assets/adversarios-iconos.json'),'utf8'));
const iconosOrigen=JSON.parse(fs.readFileSync(
  path.join(raiz,'assets/adversarios-iconos.json'),'utf8'));
assert.deepEqual(iconosAdversarios,iconosOrigen,
  'La publicación no altera las asignaciones de SVG de la galería.');
const iconosEsperados=new Set(Object.values(iconosAdversarios.iconos));
const directorioIconos=path.join(salida,'assets/adversarios/iconos');
const iconosPresentes=fs.existsSync(directorioIconos)?
  new Set(fs.readdirSync(directorioIconos).filter(x=>x.endsWith('.svg'))):new Set();
assert.deepEqual(iconosPresentes,iconosEsperados,
  'Solo se publican los SVG registrados, ningún archivo extra.');

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
  const moduloCriaturas=path.join(temporal,'assets','creatures-ui.js');
  fs.rmSync(moduloCriaturas);
  const sinEditor=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(sinEditor.status,1,'Un Editor incompleto bloquea el paquete DRS');
  assert.match(sinEditor.stderr,/Falta archivo requerido.*creatures-ui\.js/);
  fs.copyFileSync(path.join(salida,'assets','creatures-ui.js'),moduloCriaturas);
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
  // Guardia negativa: ni fuentes externas ni sustituciones arbitrarias.
  const archivoYlat=path.join(temporal,'data','tesauro-ylat.json');
  const originalYlat=fs.readFileSync(archivoYlat,'utf8');
  const externo=JSON.parse(originalYlat);
  externo.entradas.push({id:'externo-niguace',nombre:'Propuesta externa',
    tipo:'combinado',ambito:'Niguace'});
  fs.writeFileSync(archivoYlat,JSON.stringify(externo));
  const rechazado=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(rechazado.status,1,'El corpus externo jamás se publica');
  assert.match(rechazado.stderr,/295 nombres|corpus ajeno|repertorio onomástico/);
  fs.writeFileSync(archivoYlat,originalYlat);
  const cambiado=JSON.parse(originalYlat);
  cambiado.entradas[0].nombre='Nombre inventado no aprobado';
  fs.writeFileSync(archivoYlat,JSON.stringify(cambiado));
  const nombreDistinto=spawnSync(process.execPath,[scriptGuardia,temporal],
    {encoding:'utf8'});
  assert.equal(nombreDistinto.status,1,'Un cambio no autorizado en nombres invalida el paquete');
  assert.match(nombreDistinto.stderr,/295 formas originales autorizadas/);
  fs.writeFileSync(archivoYlat,originalYlat);
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
