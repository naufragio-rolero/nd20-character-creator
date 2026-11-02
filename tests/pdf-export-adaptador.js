'use strict';
const assert=require('node:assert/strict');
const {prepararDatos}=require('../assets/pdf-export-v2.js');
const p={
  juego:'Naufragio d20 · Fantasía',
  nombre:'Ínara de Sander',
  nivel:1,
  descripcion:'Guerrero · Humano común',
  atributos:[{nombre:'Fuerza',valor:14,dificultad:6,favorito:true}],
  recursos:[['Salud','7 (d6)'],['Esfuerzo',2]],
  equipo:['Armadura de cuero','Escudo pequeño','Cuerda ×2'],
  protecciones_equipadas:{armadura:'Armadura de cuero',escudo:'Escudo pequeño'},
  competencias:['Espadas'],capacidades:['Recuperación'],
  poderes:[],conjuros_preparados:[],notas:[],riqueza:'10 mo'
};
const original=JSON.stringify(p);
const f=prepararDatos(p,{valor:'d6',armadura:'Armadura de cuero',escudo:'Escudo pequeño'});
assert.equal(JSON.stringify(p),original,'No debe cambiar el personaje');
assert.equal(f._ocupacion,'Guerrero');
assert.equal(f._especie,'Humano común');
assert.equal(f._armadura_equ,'Armadura de cuero');
assert.equal(f._escudo_equ,'Escudo pequeño');
assert.equal(f._blindaje,'d6');
assert.equal(f._sections.find(x=>x.source==='riqueza').items[0],'10 mo');
const sin=structuredClone(p);
sin.equipo=[];sin.protecciones_equipadas={armadura:'Armadura de cuero',escudo:'Escudo pequeño'};
const no=prepararDatos(sin,{valor:'Sin armadura'});
assert.equal(no._armadura_equ,'');
assert.equal(no._escudo_equ,'');
assert.equal(no._blindaje,'');
assert.throws(()=>prepararDatos({...p,juego:'Naufragio d20 · CiFi'}),/solo admite/);
console.log('OK: adaptador A5 no mutante, equipo equipado e integridad básica.');
