'use strict';
/* Plazas originales: elegir tras generar, sin añadir poderes, preparar ni duplicar. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const data=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',n),'utf8'));
const powers=require('../assets/powers.js');
const catalogo=data('catalogo-poderes.json'),progresiones=data('progresiones-oficiales.json');
const juego={ocupaciones:data('ocupaciones.json'),especies:data('especies.json')};
function modelo(ocupacion,nivel){
  return {juego:'Naufragio d20 · Fantasía',
    descripcion:ocupacion+' · Humano común',nombre:'Prueba',nivel,
    atributos:[{nombre:'Mente',valor:15},{nombre:'Fuerza',valor:15}],
    capacidades:[],competencias:[],poderes:[],conjuros_preparados:[],
    recursos:[['Potencia',1]],notas:['Nota de generación'],
    equipo:['Daga'],saldo_mo:12.34};
}
function plan(ocupacion,nivel){
  return powers.planificar({juego:'nd20',ocupacion,especie:'Humano común',
    modo:'rapido',nivel,fuentes:['DRS']},juego,catalogo,progresiones);
}
const planM=plan('Mago',2);
const aprende=planM.pasos.filter(x=>x.tipo==='conjuro_conocido');
assert.equal(aprende.length,2,'Mago Nivel 2 tiene dos etapas de grimorio');
const resAuto=powers.resolver(planM,null,()=>0);
const ids=aprende.flatMap(p=>resAuto.decisiones[p.id]);
assert.equal(ids.length,3);
assert.equal(new Set(ids).size,ids.length,'El modo Rápido ya evita duplicados');
assert.ok(!powers.disponibles(aprende[1],resAuto.decisiones)
  .some(x=>resAuto.decisiones[aprende[0].id].includes(x.id)),
  'El selector oculta Conjuros conocidos de niveles previos');
const repetida=structuredClone(resAuto.decisiones);
repetida[aprende[1].id]=[repetida[aprende[0].id][0]];
assert.throws(()=>powers.resolver(planM,repetida,()=>0),
  /fuera de catálogo|ya aprendido/,'La API también rechaza duplicados conocidos');
const preparada=planM.pasos.find(p=>p.tipo==='conjuro_preparado'&&p.dependeGrimorio);
assert.ok(preparada);
const decisiones=structuredClone(resAuto.decisiones);
const anteriorId=decisiones[aprende[0].id][0];
decisiones[preparada.id]=Array(preparada.cantidad).fill(anteriorId);
const inicial=powers.registrar(modelo('Mago',2),planM,
  powers.resolver(planM,decisiones,()=>0));
assert.equal(inicial.elecciones_registradas.decisiones[aprende[0].id][0],anteriorId);
assert.ok(inicial.conjuros_preparados.length>0);
const nuevaOpcion=aprende[0].opciones.find(x=>!ids.includes(x.id));
assert.ok(nuevaOpcion,'Debe existir un Conjuro alternativo documentado');
const propuesta=decisiones[aprende[0].id].slice();
propuesta[0]=nuevaOpcion.id;
inicial.notas.push('Compra adicional de útiles: 2 mo');
inicial.equipo.push('Antorcha (DU d6)');
const revisado=powers.revisar(inicial,{[aprende[0].id]:propuesta});
assert.equal(revisado.personaje.elecciones_registradas.decisiones[aprende[0].id][0],
  nuevaOpcion.id);
assert.equal(revisado.personaje.poderes.length,inicial.poderes.length,
  'Revisar no concede nuevos Conjuros conocidos');
assert.equal(revisado.personaje.equipo.length,2);
assert.equal(revisado.personaje.saldo_mo,12.34);
assert.ok(revisado.personaje.notas.includes('Compra adicional de útiles: 2 mo'));
assert.ok(revisado.preparacionesRetiradas>=1);
assert.ok(!revisado.personaje.conjuros_preparados.some(x=>
  x.includes(aprende[0].opciones.find(y=>y.id===anteriorId).nombre)),
  'Nunca queda preparado un Conjuro dejado de conocer');
assert.throws(()=>powers.revisar(inicial,{
  [aprende[0].id]:[anteriorId,anteriorId]}),/No repitas opciones/);
assert.throws(()=>powers.revisar(inicial,{
  [preparada.id]:decisiones[preparada.id]}),/No se puede cambiar esta plaza/);
assert.equal(inicial.elecciones_registradas.decisiones[aprende[0].id][0],
  anteriorId,'La revisión no muta la ficha original');
const planG=plan('Guerrero',22);
const talento=planG.pasos.find(x=>x.id==='talento-guerrero');
assert.ok(talento);
const decisionesG=structuredClone(powers.resolver(planG,null,()=>0).decisiones);
decisionesG[talento.id]=['Brío musculoso'];
const guerrero=powers.registrar(modelo('Guerrero',22),planG,
  powers.resolver(planG,decisionesG,()=>0));
assert.equal(guerrero.recursos.find(x=>x[0]==='Potencia')[1],3);
const escudo=powers.revisar(guerrero,{[talento.id]:['Sacrificio de escudo']});
assert.equal(escudo.personaje.recursos.find(x=>x[0]==='Potencia')[1],1,
  'Cambiar el Talento recalcula únicamente la Potencia documentada');
assert.ok(!escudo.personaje.capacidades.includes('Brío musculoso'));
assert.ok(escudo.personaje.capacidades.includes('Sacrificio de escudo'));
assert.throws(()=>powers.revisar(guerrero,{[talento.id]:['Talento inventado']}),
  /fuera de catálogo|no disponible/);
assert.equal(powers.opcionesRevisables(modelo('Guerrero',1)).length,0,
  'Ficha sin registro no admite cambios arbitrarios');
const clerigo=powers.registrar(modelo('Clérigo',1),plan('Clérigo',1),
  powers.resolver(plan('Clérigo',1),null,()=>0));
assert.equal(powers.opcionesRevisables(clerigo).length,0,
  'Los Conjuros automáticos del Clérigo no son plazas de elección');
console.log('OK · Elecciones posteriores DRS: Talentos, grimorio único, preparación, economía intacta.');
