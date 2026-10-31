'use strict';
/* Prueba del CONTENIDO REAL del paquete candidato, nunca solo de la UI. */
const fs=require('node:fs');
const path=require('node:path');
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
assert.equal(leer(salida,'tesauro-ylat.json').entradas.length,0,
  'El repertorio Ylat externo al DRS requiere decisión de publicación separada');
assert.equal(leer(salida,'alcance-drs-y-dlc.json').paquetes_posteriores,undefined,
  'No se distribuye información interna de paquetes suplementarios');
const equipo=leer(salida,'equipo-inicial.json');
assert.equal(equipo.armas.find(x=>x.nombre==='Dardo').precio,0);
assert.equal(equipo.armas.find(x=>x.nombre==='Almádena').precio,60);
assert.equal(equipo.utiles_fantasia.campamento.find(x=>x.nombre==='Martillo de campamento').precio,2);
const marca=core.conjuros.find(x=>x.nombre==='Marca del dador oscuro');
assert.equal(marca.circulo,5);
assert.ok(core.listas_drs.Clérigo['5'].includes(marca.nombre));
assert.ok(!core.listas_drs.Clérigo['4'].includes(marca.nombre));
const html=fs.readFileSync(path.join(salida,'index.html'),'utf8');
assert.ok(!html.includes('Doncella de la Espada'));
assert.ok(!html.includes('Variantes inspiradas en Ylat'));
assert.ok(html.includes('Repertorio propio de la Especie'));
const rutaData=path.join(salida,'data');
const contenidos=new Set(fs.readdirSync(rutaData));
const esperados=new Set([
  'especies.json','ocupaciones.json','especies_cifi.json','ocupaciones_cifi.json',
  'catalogo-ampliado.json','tesauro-ylat.json','sexo-personajes.json',
  'catalogo-poderes.json','conjuros-revisados-001-225.json',
  'conjuros-revisados-226-434.json','conjuros-magnitudes-literales.json',
  'alcance-drs-y-dlc.json','conjuros-danio-compuesto.json',
  'progresiones-oficiales.json','equipo-inicial.json','fichas-documentales.json',
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
console.log('OK · Paquete público DRS: 64 Conjuros/10 Técnicas básicas, 4 CiFi, Nocturna y DH preservados.');
console.log('OK · DLC Fantasía ausentes físicamente; índice y catálogos, reglas y seguridad de salida verificados.');
