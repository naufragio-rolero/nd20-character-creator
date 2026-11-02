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
const revisados=[...cargar('conjuros-revisados-001-225.json').conjuros,
  ...cargar('conjuros-revisados-226-434.json').conjuros];
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
  aclaracionesTalentosDRS:cargar('aclaraciones-talentos-drs.json'),
  conjurosRevisados:revisados});
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
// Auditoría de los 64 Conjuros. El formato debe conservar cada cadena
// original, en el mismo orden y una sola vez. No modificar huellas DRS.
const drsConjuros=catalogo.conjuros.filter(x=>x.origen==='Nd20');
assert.equal(drsConjuros.length,64);
const listaIDs=new Set(['conjuro-8','conjuro-18','conjuro-19',
  'conjuro-45','conjuro-51','conjuro-61']);
const originales=new Map();
for(const r of revisados){
  if(!originales.has(r.id_catalogo))originales.set(r.id_catalogo,r);
}
const quitarCabeceras=x=>x.parrafos.filter(p=>
  !/^(?:Primer|Segundo|Tercer|Cuarto|Quinto|Sexto|Séptimo|Octavo) Círculo$/i.test(p)&&
  !/^(?:Escuela|Alcance|Duración|Lanzamiento|Requisito):/i.test(p));
for(const conjuro of drsConjuros){
  const ficha=api.buscarPorId(i,conjuro.id,'poder','nd20');
  const original=originales.get(conjuro.id);
  assert.ok(original,'Falta transcripción cotejada: '+conjuro.nombre);
  assert.ok(Array.isArray(ficha.bloques_conjuro)&&ficha.bloques_conjuro.length,
    'Todo Conjuro DRS tiene bloques: '+conjuro.nombre);
  const esperado=quitarCabeceras(original);
  assert.equal(ficha.descripcion,esperado.join('\n\n'),
    'Descripción literal sin modificaciones: '+conjuro.nombre);
  const reconstruido=ficha.bloques_conjuro.flatMap(b=>
    b.tipo==='parrafo'?[b.texto]:
    b.tipo==='lista'?b.elementos:b.tipo==='tabla'?
      b.cabeceras.concat(b.filas.flat()):[]);
  assert.deepEqual(reconstruido,esperado,
    'Presentación reversible, sin pérdida ni duplicación: '+conjuro.nombre);
  const tipos=ficha.bloques_conjuro.map(b=>b.tipo);
  if(listaIDs.has(conjuro.id))assert.ok(tipos.includes('lista'),
    conjuro.nombre+' debe contener lista semántica');
  else assert.ok(!tipos.includes('lista'),
    conjuro.nombre+' no tiene enumeración validada');
  if(conjuro.id==='conjuro-14'){
    assert.deepEqual(tipos,['parrafo','parrafo','tabla']);
    const t=ficha.bloques_conjuro[2];
    assert.deepEqual(t.cabeceras,['Turno','Temperatura','Daño']);
    assert.deepEqual(t.filas,[
      ['1','Templada','-'],['2','Caliente','1d6'],
      ['3-4','Ardiente','2d6'],['5','Caliente','1d6'],
      ['6','Templada','-']
    ]);
  }else assert.ok(!tipos.includes('tabla'),
    conjuro.nombre+' no tiene tabla documentada');
}
// El respaldo tampoco interpreta el texto si cambia la estructura fuente.
const originalForja=originales.get('conjuro-45');
const copiaAlterada={...originalForja,parrafos:originalForja.parrafos.concat(
  'Apéndice editorial de prueba, no publicable.')};
const idxAlterado=api.indice({
  catalogo:catalogo,
  conjurosRevisados:revisados.map(x=>x.id_catalogo==='conjuro-45'?
    copiaAlterada:x)
});
const bloquesAlterados=api.buscarPorId(idxAlterado,'conjuro-45','poder','nd20')
  .bloques_conjuro;
assert.ok(bloquesAlterados.every(x=>x.tipo==='parrafo'),
  'Una edición no verificada desactiva la lista y conserva los párrafos');

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
