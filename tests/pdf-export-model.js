'use strict';
const assert=require('node:assert/strict');
const modelo=require('../assets/pdf-export-model.js');
function fixture(){
  return {
    juego:'Naufragio d20 · Fantasía',nombre:'Ínara del Bosque',
    descripcion:'Guerrero · Humano común',nivel:1,sexo:'femenino',
    atributos:[
      {nombre:'Fuerza',valor:14,dificultad:6,favorito:true},
      {nombre:'Agilidad',valor:10,dificultad:10,favorito:false}
    ],
    recursos:[['Salud','7 (d6)'],['Esfuerzo',2],['Movimiento','Cerca']],
    equipo:['Armadura de cuero ×1','Escudo pequeño'],
    protecciones_equipadas:{armadura:'Armadura de cuero',escudo:'Escudo pequeño'},
    competencias:['Lanzamiento'],capacidades:['Recuperación'],
    poderes:['Conjuro conocido'],conjuros_preparados:['Conjuro preparado'],
    riqueza:'16 mo restantes',notas:['No se ha añadido ninguna regla']
  };
}
const original=fixture(),antes=JSON.stringify(original);
const result=modelo.preparar(original,{valor:'d6',armadura:'Armadura de cuero',
  escudo:'Escudo pequeño',bonoEscudo:'+1',natural:null});
assert.equal(JSON.stringify(original),antes,'La exportación no puede mutar el personaje');
assert.equal(result.ocupacion,'Guerrero');
assert.equal(result.especie,'Humano común');
assert.equal(result.atributos[0].favorito,true);
assert.equal(result.recursos[0].valor,'7 (d6)');
assert.equal(result.recursos[1].valor,'2');
assert.equal(result.protecciones.armadura,'Armadura de cuero');
assert.equal(result.protecciones.escudo,'Escudo pequeño');
assert.equal(result.protecciones.blindaje,'d6');
assert.equal(result.protecciones.bono_escudo_al_bloquear,'+1');
assert.equal(result.protecciones.natural,'');
assert.equal(result.secciones.find(x=>x.origen==='conjuros_preparados').items[0],
  'Conjuro preparado');
assert.equal(result.secciones.find(x=>x.origen==='riqueza').items[0],
  '16 mo restantes');
const noEquipado=fixture();noEquipado.equipo=[];
assert.equal(modelo.preparar(noEquipado,{valor:'Sin armadura'})
  .protecciones.armadura,'');
assert.equal(modelo.preparar(noEquipado,{valor:'Sin armadura'})
  .protecciones.blindaje,'');
const soloDescripcion=fixture();soloDescripcion.descripcion='Origen sin separador';
const rare=modelo.preparar(soloDescripcion);
assert.equal(rare.descripcion_completa,'Origen sin separador');
assert.equal(rare.ocupacion,'');
assert.equal(rare.especie,'');
assert.throws(()=>modelo.preparar({...original,juego:'Naufragio d20 · CiFi'}),/solo admite/);
assert.throws(()=>modelo.preparar({...original,juego:'Dungeon Hack'}),/solo admite/);
const completo=fixture();
completo.nivel=30;
completo.capacidades=Array.from({length:154},(_,i)=>'Capacidad de prueba '+(i+1));
const extendido=modelo.preparar(completo);
assert.equal(extendido.secciones.find(s=>s.origen==='capacidades').items.length,154);
assert.equal(JSON.stringify(completo).includes('Capacidad de prueba 154'),true);
console.log('OK: modelo PDF A5 puro, protegidas las reglas, 154 entradas intactas.');
