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
// Las 111 glosas ya aprobadas mantienen su cobertura íntegra; las cuatro
// entradas de Iluminación aportan únicamente texto literal del DRS.
const iluminacion=eq.utiles_fantasia.iluminacion;
assert.deepEqual(iluminacion.map(x=>x.nombre),
  ['Antorcha','Lámpara de aceite','Linterna','Vela']);
assert.deepEqual(new Set(eqNombres),
  new Set([...nombres,...iluminacion.map(x=>x.nombre)]),
  'Todos los objetos tienen ficha literal o glosa autorizada');

const i=api.indice({fantasia:{especies:cargar('especies.json'),
  ocupaciones:cargar('ocupaciones.json')},catalogo:cargar('catalogo-poderes.json'),
  equipo:eq,tecnicasDRS:tecnica,glosasEquipoDRS:objetos,
  glosasTalentosDRS:glosas,talentosDRS:canon,
  aclaracionesTalentosDRS:cargar('aclaraciones-talentos-drs.json'),
  descripciones:cargar('fichas-documentales.json'),
  danioCompuesto:cargar('conjuros-danio-compuesto.json'),
  magnitudes:cargar('conjuros-magnitudes-literales.json'),
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
// Tabla «Iluminación» del DRS: precios convertidos a mo, sin inferencias.
for(const [nombre,precio,descripcion,du] of [
  ['Antorcha',0.1,'Ilumina 6 metros alrededor con luz amarillenta.','d6'],
  ['Lámpara de aceite',2,'Ilumina 4 metros alrededor.','d6 (aceite)'],
  ['Linterna',10,'Ilumina 8 metros alrededor.','d6 (aceite)'],
  ['Vela',0.01,'Alumbra 2 metros alrededor con luz amarillenta y tenue.','d4']
]){
  const objeto=iluminacion.find(x=>x.nombre===nombre);
  assert.equal(objeto.precio,precio,'Precio documentado de '+nombre);
  assert.equal(objeto.detalle,descripcion,'Alcance de luz documentado '+nombre);
  assert.equal(objeto.du,du,'DU documentado de '+nombre);
  const nombreEnInventario=['Antorcha','Vela'].includes(nombre)?
    nombre+' (DU '+du+')':nombre;
  const ficha=api.buscar(i,nombreEnInventario,'equipo','nd20');
  assert.ok(ficha&&ficha.fuente==='Naufragio d20 DRS · Herramientas',
    'El paquete resuelve la ficha oficial de '+nombre);
  assert.equal(ficha.descripcion,descripcion);
  assert.equal(api.presentarEquipo(ficha).categoria,'Iluminación');
  assert.equal(new Map(api.presentarEquipo(ficha).primarios).get('Dado de Uso'),
    'DU '+du);
}
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
// Verificación de fichas contra tablas del DOCX DRS, sin calcular combate.
const estadisticas=[
  [eq.armas,[
    ['Daga','Daño','1d4'],['Daga','Penetración','1'],['Daga','Durabilidad','d8'],
    ['Arco corto','Alcance','48 m'],['Arco corto','Daño','1d6'],
    ['Cerbatana','Penetración','0'],['Espadón','Daño','1d12'],
    ['Martillo de guerra','Durabilidad','d10']]],
  [eq.varitas_defensa,[
    ['Varita de cerezo','Alcance','12 m'],['Varita de cerezo','Daño','1d3'],
    ['Varita de cerezo','Penetración','1'],['Varita de cerezo','Durabilidad','d4'],
    ['Varita de cerezo','Munición','DU d6']]],
  [eq.armaduras,[
    ['Armadura de tela','Blindaje','d4'],['Armadura de tela','Durabilidad','—'],
    ['Armadura de pieles','Blindaje','d6'],['Armadura de pieles','Durabilidad','d6'],
    ['Cota de mallas','Blindaje','d10'],['Cota de mallas','Durabilidad','d8']]],
  [eq.escudos,[
    ['Escudo pequeño','Blindaje','+1'],['Escudo pequeño','Durabilidad','d6'],
    ['Escudo pequeño','Daño','d3']]]
];
const consultaCampos=nombre=>{
  const info=api.buscar(i,nombre,'equipo','nd20');
  assert.ok(info,'Sin entrada de Equipo '+nombre);
  const ui=api.presentarEquipo(info);
  return new Map(ui.primarios);
};
for(const [familia,filas] of estadisticas){
  for(const [nombre,clave,esperado] of filas)
    assert.equal(consultaCampos(nombre).get(clave),esperado,
      'Transcripción DRS de '+nombre+'/'+clave);
}
assert.deepEqual([eq.armas.length,eq.armaduras.length,eq.escudos.length,
  eq.varitas_defensa.length],[38,14,3,4]);
// Todas las filas oficiales con atributos de combate se pueden consultar;
// el literal «—» no se convierte en un supuesto dado de Durabilidad.
for(const objeto of [...eq.armas,...eq.armaduras,...eq.escudos,...eq.varitas_defensa]){
  const fields=consultaCampos(objeto.nombre);
  for(const [origen,vista] of [
    ['dano','Daño'],['blindaje','Blindaje'],
    ['penetracion','Penetración'],['durabilidad','Durabilidad'],
    ['alcance','Alcance']]){
    if(!Object.hasOwn(objeto,origen))continue;
    assert.ok(fields.has(vista),
      objeto.nombre+' debe ofrecer '+vista);
    assert.equal(fields.get(vista),
      objeto[origen]==null||objeto[origen]==='-'?'—':String(objeto[origen]),
      objeto.nombre+'/'+vista+' muestra el literal DRS');
  }
}
const aguijon=api.buscarPorId(i,'conjuro-0','poder','nd20');
assert.ok(aguijon);
const vistaAguijon=api.presentarPoder(aguijon);
assert.deepEqual(vistaAguijon.primarios.filter(p=>p[0]==='Alcance'),
  [['Alcance','20 m']],'Aguijón impío solo muestra un Alcance DRS');
assert.deepEqual(vistaAguijon.primarios.filter(p=>p[0]==='Daño'),
  [['Daño','1d6 (veneno e impío)']],
  'Dado y tipos simultáneos explícitos, sin cálculo automatizado');
assert.match(aguijon.descripcion,/1d6 de daño por veneno e impío/);

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
// Inventario ≠ equipo activo. Nunca atribuir Blindaje por compra automática.
const equipoApi=require('../assets/equipment.js');
const pjProtecciones={
  juego:'Naufragio d20 · Fantasía',
  equipo:['Armadura de tela','Armadura de pieles','Escudo pequeño','Daga',
    'Recuerdo: Escudo grande']
};
assert.deepEqual(
  equipoApi.proteccionesDisponibles(pjProtecciones,eq).armaduras.map(x=>x.nombre),
  ['Armadura de tela','Armadura de pieles']);
assert.deepEqual(
  equipoApi.proteccionesDisponibles(pjProtecciones,eq).escudos.map(x=>x.nombre),
  ['Escudo pequeño']);
assert.deepEqual(equipoApi.blindajeFicha(pjProtecciones,eq),{
  valor:'Sin armadura',armadura:null,escudo:null,bonoEscudo:null,natural:null
},'Comprar armadura no la equipa automáticamente');
pjProtecciones.protecciones_equipadas={
  armadura:'Armadura de pieles',escudo:'Escudo pequeño'};
let defensa=equipoApi.blindajeFicha(pjProtecciones,eq);
assert.equal(defensa.valor,'d6');
assert.equal(defensa.bonoEscudo,'+1','El escudo solo aporta bono al bloquear');
assert.equal(defensa.armadura,'Armadura de pieles');
pjProtecciones.protecciones_equipadas.armadura='Armadura de tela';
assert.equal(equipoApi.blindajeFicha(pjProtecciones,eq).valor,'d4');
pjProtecciones.protecciones_equipadas.armadura='Armadura completa de placas';
assert.equal(equipoApi.blindajeFicha(pjProtecciones,eq).valor,'Sin armadura',
  'Nunca se atribuye Blindaje de equipo que no consta en inventario');
pjProtecciones.protecciones_equipadas={armadura:'',escudo:'Escudo grande'};
assert.equal(equipoApi.blindajeFicha(pjProtecciones,eq).bonoEscudo,null,
  'Un Recuerdo no autoriza equipar un Escudo grande');
pjProtecciones.blindaje_natural='d6';
assert.equal(equipoApi.blindajeFicha(pjProtecciones,eq).valor,'Sin armadura',
  'No se aplica ninguna protección natural sin fuente documental');
pjProtecciones.blindaje_natural_fuente='Referencia de prueba DRS';
assert.equal(equipoApi.blindajeFicha(pjProtecciones,eq).valor,'d6');
delete pjProtecciones.blindaje_natural_fuente;
delete pjProtecciones.blindaje_natural;
pjProtecciones.equipo.push('Armadura de pieles ×2');
pjProtecciones.equipo=['Armadura de pieles ×2'];
assert.deepEqual(
  equipoApi.proteccionesDisponibles(pjProtecciones,eq).armaduras.map(x=>x.nombre),
  ['Armadura de pieles'],'La cantidad no altera el nombre documentado');

console.log('OK · 10 Técnicas literales, 24 categorías oficiales trazables, 111 objetos categorizados, escuelas y Círculos cotejados; efectos originales preservados.');
