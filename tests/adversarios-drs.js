'use strict';
const assert=require('node:assert/strict');
const catalogo=require('../data/adversarios-drs.json');
const modelo=require('../assets/creatures.js');
assert.equal(catalogo.version,1);
assert.equal(catalogo.fuente,'Naufragio d20 DRS');
assert.equal(catalogo.registros.length,106);
assert.equal(new Set(catalogo.registros.map(x=>x.id)).size,106);
assert.equal(catalogo.registros.reduce((n,x)=>n+x.ficha.ataques.length,0),182);
assert.equal(catalogo.registros.reduce((n,x)=>n+x.ficha.talentos.length,0),188);
for(const bruto of catalogo.registros){
  const r=modelo.normalizarFuenteDRS(bruto);
  assert.equal(r.fuente,'Naufragio d20 DRS');
  assert.ok(modelo.CATEGORIAS.includes(r.ficha.categoria),'Categoría DRS: '+r.nombre);
  assert.ok(r.ficha.descripcion.trim(),'Descripción completa: '+r.nombre);
  assert.equal(r.ficha.origen.tipo,'drs_oficial');
  assert.ok(r.ficha.origen.textoOriginal.startsWith(r.nombre));
  const revision=modelo.revisar(r.ficha,{paraExportar:true});
  assert.equal(revision.valida,true,r.nombre+': '+JSON.stringify(revision.errores));
}
const catoblepas=modelo.normalizarFuenteDRS(
  catalogo.registros.find(x=>x.nombre==='Catoblepas'));
assert.equal(catoblepas.ficha.saludAjuste,-6);
assert.equal(catoblepas.ficha.puntuaciones.salud,52);
assert.equal(catoblepas.ficha.puntuaciones.blindaje,null);
const arana=catalogo.registros.find(x=>x.nombre==='Araña peluda');
assert.equal(arana.ficha.puntuaciones.salud,12);
assert.deepEqual(arana.ficha.ataques.map(x=>x.conectorAnterior),['Inicio','y']);
assert.ok(catalogo.registros.every(x=>!['Nd20 Ci-Fi','Tomo de Magia','Bestiario de Ylat'].includes(x.fuente)));

/** Regresión documental: las 106 fichas conservan todos los renglones del DRS,
 * sin fundir ataques alternativos ni perder habilidades entre descripción y Talentos.
 * Las categorías se contrastan con la cabecera original, no con la taxonomía
 * auxiliar de la hoja de cálculo. */
for (const registro of catalogo.registros) {
  const f=registro.ficha;
  const lineas=f.origen.textoOriginal.split('\n');
  const fichaFuente=lineas[1].match(/^(.*?)\s+de Nivel (\d+)(?: \[Moral (\d+)\])?, Salud (\d+)/);
  assert.ok(fichaFuente, 'Cabecera DRS: '+registro.nombre);
  assert.equal(f.categoria, fichaFuente[1].trim(), 'Categoría literal DRS: '+registro.nombre);
  assert.equal(f.puntuaciones.nivel, Number(fichaFuente[2]), 'Nivel: '+registro.nombre);
  assert.equal(f.puntuaciones.moral, fichaFuente[3] ? Number(fichaFuente[3]) : null, 'Moral: '+registro.nombre);
  assert.equal(f.puntuaciones.salud, Number(fichaFuente[4]), 'Salud: '+registro.nombre);
  const reconstruirAtaques=f.ataques.map((a,i)=>
    (i===0 ? '' : a.conectorAnterior===',' ? ', ' : ' '+a.conectorAnterior+' ')
    +a.segmentoOriginal).join('');
  assert.equal('Ataques: '+reconstruirAtaques, lineas[2], 'Ataques y conectores: '+registro.nombre);
  const contenido=[...f.talentos.flatMap(t=>t.textoOriginal.split('\n')),...f.descripcion.split('\n')];
  assert.deepEqual(contenido.sort(),lineas.slice(3).sort(),'Capacidades y narración: '+registro.nombre);
}
const exigirTalentos=(id,nombres)=>{
  const ficha=catalogo.registros.find(x=>x.id===id).ficha;
  assert.deepEqual(ficha.talentos.map(x=>x.nombre),nombres,'Talentos: '+id);
  assert.ok(!/^Inmune al|^Veneno:|^Vómito ácido:|^Muerto viviente:/m.test(ficha.descripcion),
    'Las capacidades no quedan en la narración: '+id);
};
exigirTalentos('cara_miseria',['Inmunidad ígnea','Vómito ácido']);
exigirTalentos('guiverna_manto_azur',['Dardos venenosos','Inmunidad tóxica','Veneno']);
exigirTalentos('guiverna_ala_bronce',['Inmunidad tóxica','Veneno']);
exigirTalentos('tirano_espliego',
  ['Toque maldito','Rayo de muerte','Archimago','Llamada de condenación',
    'Muerto viviente','Lívido','Relicario']);
const guiverna=catalogo.registros.find(x=>x.id==='guiverna_manto_azur').ficha;
assert.deepEqual(guiverna.ataques.map(a=>[a.conectorAnterior,a.cantidad,a.danoLiteral]),
  [['Inicio',2,'12'],['o',1,'18']]);
assert.equal(guiverna.puntuaciones.nivel,8);
assert.equal(guiverna.puntuaciones.salud,44);
assert.equal(guiverna.puntuaciones.moral,7);
const tirano=catalogo.registros.find(x=>x.id==='tirano_espliego').ficha;
const llamada=tirano.talentos.find(x=>x.nombre==='Llamada de condenación');
for(let i=1;i<=4;i++)assert.match(llamada.descripcion,new RegExp('(?:^|\\n)'+i+': '));
assert.ok(!tirano.descripcion.includes('1: 1 comensal pálido'));

console.log('OK · 106 adversarios DRS cotejados; 182 ataques y 188 Talentos preservados.');
