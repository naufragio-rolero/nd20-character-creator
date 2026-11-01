'use strict';
/* Talentos básicos: cotejo documental de 24 relaciones, sin ejecutar efectos. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
const base={especies:read('especies.json'),ocupaciones:read('ocupaciones.json')};
const canon=read('talentos-drs-literales.json');
const aclaraciones=read('aclaraciones-talentos-drs.json');
const clavesAprobadas=[
  'talento-drs-especie-mediano-amable-salvese-quien-pueda',
  'talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes'
];
assert.equal(aclaraciones.estado,'aprobacion_autoral');
assert.equal(aclaraciones.fecha_aprobacion,'2026-11-01');
assert.deepEqual(aclaraciones.registros.map(x=>x.id_talento).sort(),
  clavesAprobadas.slice().sort(),
  'Solo se publican las dos aclaraciones expresamente aprobadas');
const indice=require('../assets/tooltips.js');
const crypto=require('node:crypto');
const huellas=JSON.parse(fs.readFileSync(
  path.join(root,'docs/enciclopedia/109a-huellas-talentos-drs.json'),'utf8'));
assert.equal(huellas.fuente,'NaufragioD20DRS.docx');
assert.equal(Object.keys(huellas.huellas).length,24);
assert.equal(canon.fuente,'NaufragioD20DRS.docx');
assert.equal(canon.registros.length,24);
assert.equal(new Set(canon.registros.map(x=>x.id)).size,24);
assert.equal(canon.registros.filter(x=>x.tipo_origen==='Especie').length,15);
assert.equal(canon.registros.filter(x=>x.tipo_origen==='Ocupación').length,9);
for(const r of canon.registros){
  assert.equal(r.estado,'cotejado_literal_DRS');
  const clave=r.propietario+'|'+r.nombre;
  const huella=crypto.createHash('sha256')
    .update(r.efecto_literal,'utf8').digest('hex');
  assert.equal(huella,huellas.huellas[clave],
    clave+': texto diferente al cotejado directamente en DOCX');
  assert.ok(r.efecto_literal.trim()&&r.parrafos_documento.length);
  const lista=r.tipo_origen==='Especie'?base.especies:base.ocupaciones;
  assert.ok(lista[r.propietario],r.id+' sin propietario DRS');
  assert.ok((lista[r.propietario].talentos||[]).includes(r.nombre),
    r.id+' no figura en Talentos básicos');
}
const idx=indice.indice({fantasia:base,talentosDRS:canon,
  aclaracionesTalentosDRS:aclaraciones,
  descripciones:read('fichas-documentales.json'),catalogo:{},equipo:{}});
for(const r of canon.registros){
  const fuente=r.tipo_origen+': '+r.propietario;
  const x=indice.buscar(idx,r.nombre,'talento','nd20',fuente);
  assert.ok(x,r.id+' sin indexación');
  assert.equal(x.id,r.id,r.id+' identidad');
  assert.equal(x.descripcion,r.efecto_literal,r.id+' no conserva texto literal');
  const pres=indice.presentarTalento(x);
  assert.equal(pres.origen,'Naufragio d20 DRS');
  const editorial=aclaraciones.registros.find(a=>a.id_talento===r.id);
  assert.deepEqual(pres.aclaracion,
    editorial?{texto:editorial.texto,fecha:'2026-11-01',
      fuente:aclaraciones.fuente}:null,
    'Aclaración solo sobre el ID de Talento original autorizado');
  assert.equal(pres.clasificacion,r.tipo_origen+' · '+r.propietario);
  assert.equal(pres.fuente.includes('NaufragioD20DRS.docx'),true);
  const expected=[['Activación',r.activacion_literal],
    ['Atributo',(r.atributo_literal||'').replace(/^Atributo:\s*/,'')],
    ['Coste',(r.coste_literal||'').replace(/^Coste:\s*/,'')]]
    .filter(x=>x[1]);
  assert.deepEqual(pres.primarios,expected,r.id+' campos fuente explícitos');
  assert.equal(indice.buscarPorId(idx,r.id,'talento','nd20'),x);
  assert.equal(indice.buscar(idx,r.nombre,'talento','nd20','Especie: Inventada'),null,
    'No intercambiar homónimos si la procedencia es explícita');
}
const semielfo=indice.buscar(idx,'Herencia dual (SE)','talento','nd20',
  'Especie: Semielfo');
const semiorco=indice.buscar(idx,'Herencia dual (SO)','talento','nd20',
  'Especie: Semiorco');
assert.notEqual(semielfo.descripcion,semiorco.descripcion);
assert.equal(indice.presentarTalento(semielfo).nombre,'Herencia dual');
assert.equal(indice.presentarTalento(semiorco).nombre,'Herencia dual');
const enano=indice.buscar(idx,'Visión en la oscuridad','talento','nd20',
  'Especie: Enano montañés');
const gnomo=indice.buscar(idx,'Visión en la oscuridad','talento','nd20',
  'Especie: Gnomo urbano');
assert.notEqual(enano.id,gnomo.id);
assert.notEqual(enano.descripcion,gnomo.descripcion,
  'Los dos textos originales no son idénticos: preservar procedencia.');
const recuperacion=indice.buscar(idx,'Recuperación','talento','nd20',
  'Ocupación: Guerrero');
assert.equal(indice.presentarTalento(recuperacion).primarios.some(x=>x[0]==='Coste'),false,
  'El coste descrito en prosa no crea una etiqueta literal inexistente.');
assert.ok(recuperacion.descripcion.includes('1 Punto de Esfuerzo'));
assert.equal(indice.presentarTalento({
  nombre:'Copia provisional',grupo:'talento',descripcion:'Prueba'}),null,
  'No presentar glosas de suplementos como Talentos DRS validados');
// Aclaraciones derivadas de decisiones autorales, no de interpretación del índice.
const salvese=aclaraciones.registros.find(x=>x.nombre==='¡Sálvese quien pueda!');
const expulsar=aclaraciones.registros.find(x=>x.nombre==='Expulsar muertos vivientes');
assert.match(salvese.texto,/Parálisis o Miedo/);
assert.match(salvese.texto,/Punto de Esfuerzo/);
assert.match(salvese.texto,/Acción/);
assert.match(salvese.texto,/sin necesidad de Tirada/);
assert.match(expulsar.texto,/Tirada de Probabilidad 15\+/);
assert.match(expulsar.texto,/3 zombis y 2 esqueletos/);
assert.match(expulsar.texto,/2 Tiradas/);
assert.match(expulsar.texto,/criaturas idénticas/);
assert.ok(aclaraciones.registros.every(a=>
  canon.registros.some(r=>r.id===a.id_talento&&r.nombre===a.nombre&&
    r.propietario===a.propietario&&r.tipo_origen===a.tipo_origen)));
assert.ok(canon.registros.every(r=>!Object.hasOwn(r,'aclaracion_autoral')),
  'La fuente literal se mantiene separada de decisiones autorales');
const sinAclaraciones=indice.indice({fantasia:base,talentosDRS:canon,
  descripciones:read('fichas-documentales.json'),catalogo:{},equipo:{}});
assert.equal(indice.presentarTalento(indice.buscarPorId(sinAclaraciones,
  salvese.id_talento,'talento','nd20')).aclaracion,null,
  'No interpolar aclaraciones en el efecto literal cuando no hay fuente aprobada');
assert.throws(()=>indice.indice({fantasia:base,talentosDRS:canon,
  aclaracionesTalentosDRS:{...aclaraciones,registros:[{
    ...salvese,id_talento:'talento-drs-especie-inexistente'
  }]},descripciones:{},catalogo:{},equipo:{}}),/sin Talento único/,
  'Una aclaración nunca debe caer en el Talento de nombre parecido');
console.log('OK · 2 aclaraciones autorales exclusivas; 24 textos DRS inalterados.');
console.log('OK · 24 Talentos DRS: literales, origen, homónimos y campos explícitos.');
