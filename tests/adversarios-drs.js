'use strict';
const assert=require('node:assert/strict');
const catalogo=require('../data/adversarios-drs.json');
const modelo=require('../assets/creatures.js');
assert.equal(catalogo.version,1);
assert.equal(catalogo.fuente,'Naufragio d20 DRS');
assert.equal(catalogo.registros.length,106);
assert.equal(new Set(catalogo.registros.map(x=>x.id)).size,106);
assert.equal(catalogo.registros.reduce((n,x)=>n+x.ficha.ataques.length,0),182);
assert.equal(catalogo.registros.reduce((n,x)=>n+x.ficha.talentos.length,0),179);
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
console.log('OK · 106 adversarios DRS sin suplementos; ataques, Talentos y fuentes completos.');
