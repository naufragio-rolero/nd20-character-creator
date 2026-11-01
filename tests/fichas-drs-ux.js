'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.join(__dirname,'..','data');
const cargar=(nombre)=>JSON.parse(fs.readFileSync(path.join(base,nombre),'utf8'));
const api=require('../assets/tooltips.js');
const eq=cargar('equipo-inicial.json');
const tecnica=cargar('tecnicas-drs-literales.json');
const glosas=cargar('glosas-talentos-drs.json');
const objetos=cargar('glosas-equipo-drs.json');
const canon=cargar('talentos-drs-literales.json');
assert.equal(tecnica.registros.length,10);
assert.equal(glosas.registros.length,24);
assert.equal(glosas.registros.filter(x=>x.tipo_origen==='Especie').length,15);
assert.ok(canon.registros.filter(x=>x.tipo_origen==='Especie').every(x=>
  x.activacion_literal===null),
  'La fuente DRS no etiqueta activación/pasiva en los Talentos de Especie');
assert.equal(objetos.registros.length,111);
const nombres=new Set();
for(const x of objetos.registros){
  assert.ok(x.descripcion_editorial.trim(),x.nombre+' tiene descripción');
  assert.ok(!nombres.has(x.nombre),'No duplicar '+x.nombre);
  nombres.add(x.nombre);
}
const eqNombres=[...eq.armas,...eq.armaduras,...eq.escudos,
  ...eq.municion,...eq.paquetes,...Object.values(eq.utiles_fantasia).flat(),
  ...eq.focos_conjuros_con_precio,...eq.varitas_defensa].map(x=>x.nombre);
assert.deepEqual(new Set(eqNombres),nombres,'111 elementos con cobertura completa');
const i=api.indice({fantasia:{especies:cargar('especies.json'),
  ocupaciones:cargar('ocupaciones.json')},catalogo:cargar('catalogo-poderes.json'),
  equipo:eq,tecnicasDRS:tecnica,glosasEquipoDRS:objetos,
  glosasTalentosDRS:glosas,talentosDRS:canon,
  aclaracionesTalentosDRS:cargar('aclaraciones-talentos-drs.json')});
for(const x of tecnica.registros){
  const ficha=api.buscar(i,x.nombre,'poder','nd20');
  assert.ok(ficha,'Falta Técnica '+x.nombre);
  assert.equal(ficha.descripcion,x.efecto_literal,'Efecto literal: '+x.nombre);
}
assert.match(api.buscar(i,'Disparo aturdidor','poder','nd20').descripcion,
  /no se podrá mover durante su próximo Turno/);
for(const x of objetos.registros){
  const ficha=api.buscar(i,x.nombre,'equipo','nd20');
  assert.ok(ficha,'Falta equipo '+x.nombre);
  assert.equal(ficha.descripcion,x.descripcion_editorial,'Descripción: '+x.nombre);
  const vista=api.presentarEquipo(ficha);
  assert.ok(vista&&vista.categoria,'El objeto tiene categoría documentada: '+x.nombre);
  assert.ok(vista.primarios.every(par=>par[0]!=='Categoría'),
    'No duplicar la categoría en el detalle: '+x.nombre);
}
const varita=api.buscar(i,'Varita de cerezo','equipo','nd20');
assert.equal(api.presentarEquipo(varita).categoria,'Varita');
assert.match(varita.descripcion,/Tirada de Mente/);
assert.match(varita.descripcion,/una vez al día/);
assert.doesNotMatch(varita.descripcion,/según el DRS|texto nuevo|descripción contextual/i);
assert.equal(api.presentarEquipo(api.buscar(i,'Daga','equipo','nd20')).categoria,'Arma ligera');
assert.equal(api.presentarEquipo(api.buscar(i,'Armadura de cuero','equipo','nd20')).categoria,
  'Armadura ligera');
assert.equal(api.presentarEquipo(api.buscar(i,'Escudo grande','equipo','nd20')).categoria,'Escudo');
assert.equal(api.presentarEquipo(api.buscar(i,'Flechas','equipo','nd20')).categoria,'Munición');
const catalogo=cargar('catalogo-poderes.json');
const seis=new Set(['Arcana','Demonología','Divina','Elemental','Naturaleza','Nigromancia']);
const encontradas=new Set();
for(const conjuro of catalogo.conjuros){
  const ficha=api.buscarPorId(i,conjuro.id,'poder','nd20');
  assert.ok(ficha,'Conjuro indexado '+conjuro.id);
  const vista=api.presentarPoder(ficha);
  assert.deepEqual(vista.escuelas,conjuro.escuelas,'Escuelas de '+conjuro.nombre);
  assert.equal(vista.circulo,conjuro.circulo,'Círculo de '+conjuro.nombre);
  conjuro.escuelas.forEach(x=>encontradas.add(x));
}
assert.deepEqual(encontradas,seis,'Las escuelas reales del catálogo son las seis del DRS');
for(const x of glosas.registros){
  const ficha=api.buscar(i,x.nombre,'talento','nd20',
    x.tipo_origen+': '+x.propietario);
  assert.ok(ficha,'Falta Talento '+x.id_talento);
  const presentacion=api.presentarTalento(ficha);
  assert.ok(presentacion,'Falta presentación '+x.nombre);
  assert.equal(presentacion.categoria,x.categoria);
  assert.equal(presentacion.fuente_categoria,x.fuente_categoria);
  assert.ok(['Acción','Especial','Mejora','Pasiva','Reacción'].includes(x.categoria));
  if(x.tipo_origen==='Especie'){
    assert.equal(x.estado_categoria,'propuesta_para_edicion_DRS');
  }else{
    assert.equal(x.estado_categoria,'formal_original_DRS');
  }
  assert.equal(ficha.descripcion,canon.registros.find(y=>y.id===x.id_talento).efecto_literal,
    'No cambiar el efecto literal de '+x.nombre);
}
assert.equal(api.presentarTalento(api.buscar(i,'Ira interna','talento','nd20',
  'Especie: Orco común')).categoria,'Reacción');
assert.equal(api.presentarTalento(api.buscar(i,'Rapidez','talento','nd20',
  'Especie: Elfo agreste')).categoria,'Mejora');
assert.equal(api.presentarTalento(api.buscar(i,'Corpulencia','talento','nd20',
  'Especie: Enano montañés')).categoria,'Mejora');
assert.equal(api.presentarTalento(api.buscar(i,'Recuperación','talento','nd20',
  'Ocupación: Guerrero')).categoria,'Pasiva');
assert.equal(api.presentarTalento(api.buscar(i,'¡Sálvese quien pueda!','talento',
  'nd20','Especie: Mediano amable')).categoria,'Reacción');
console.log('OK · 10 Técnicas literales, 24 categorías oficiales trazables, 111 objetos categorizados, escuelas y Círculos cotejados; efectos originales preservados.');
