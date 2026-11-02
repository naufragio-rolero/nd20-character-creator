const assert=require('node:assert/strict');
const lib=require('./pdf-export.js');
const p={juego:'Naufragio d20 · Fantasía',nombre:'Pepe',descripcion:'Guerrero · Humano común',nivel:1,
  atributos:[],recursos:[['Salud','7 (d6)']],equipo:['Armadura de cuero','Escudo pequeño'],protecciones_equipadas:{armadura:'Armadura de cuero',escudo:'Escudo pequeño'},
  capacidades:['Suerte'],competencias:[],riqueza:'4 mo'};
const before=JSON.stringify(p);
const o=lib.prepararDatos(p,{valor:'d6',armadura:'Armadura de cuero',escudo:'Escudo pequeño'});
assert.equal(JSON.stringify(p),before,'No debe mutar el personaje');
assert.equal(o._especie,'Humano común');assert.equal(o._ocupacion,'Guerrero');
assert.equal(o._armadura_equ,'Armadura de cuero');assert.equal(o._escudo_equ,'Escudo pequeño');
assert.equal(o._blindaje,'d6');assert.equal(o._sections.length,3);
const p2={...p,equipo:[]};assert.equal(lib.prepararDatos(p2)._armadura_equ,'');
assert.throws(()=>lib.prepararDatos({...p,juego:'Dungeon Hack'}),/solo admite/);
const font={widthOfTextAtSize:(s,sz)=>Array.from(s).length*sz*.53};
assert.deepEqual(lib.wrapText('uno dos tres',100,font,7),['uno dos tres']);
const wrapped=lib.wrapText('reconocimiento-extraordinariamente-largo',42,font,7);
assert.equal(wrapped.join(''),'reconocimiento-extraordinariamente-largo');
console.log('OK: adaptador puro y saltos básicos; NO se ha validado todavía pdf-lib real.');
