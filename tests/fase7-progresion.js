'use strict';
/* Fase 7.4: progresión por Lista, separada del repertorio y sin reglas implícitas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('../assets/spell-lists.js');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const drs=read('data/conjuros-drs-fichas.json');
const catalogo=api.crearCatalogo(drs,read('data/catalogo-poderes.json'));
const borradores=api.leerBorradores(read('data/listas-conjuros-borradores.json'),catalogo);
const fuente=read('data/progresiones-oficiales.json');
const tablas=api.tablasDRS(fuente);
const originales=JSON.stringify(fuente.fantasia);
for(const ocupacion of ['Mago','Clérigo']){
  const id='drs:'+ocupacion;
  const tabla=tablas[id];
  assert.equal(tabla.niveles.length,30);
  assert.ok(tabla.niveles.every(f=>f.length===8&&f.every(n=>Number.isInteger(n)&&n>=0)));
  assert.deepEqual(tabla.niveles,fuente.fantasia[ocupacion].niveles);
  const oficial=catalogo.oficiales.find(l=>l.id===id);
  assert.deepEqual(api.tablaDeLista(oficial,tablas).niveles,tabla.niveles);
  assert.equal(api.tablaDeLista(oficial,tablas).tipo,'oficial');
}
assert.equal(tablas['drs:Mago'].niveles[0][0],1);
assert.deepEqual(tablas['drs:Clérigo'].niveles[0],[0,0,0,0,0,0,0,0]);
const vacia=api.vacia(catalogo);
let l={id:'usuario:lista12345678',nombre:'Progresión en blanco',
  descripcion:'',maxCirculo:8,conjuros:[catalogo.conjuros[0].id]};
let lib=api.guardarLista(vacia,l,catalogo,borradores);
assert.equal(api.tablaDeLista(lib.listas[0],tablas),null,
  'Sin progresión, el editor no deriva Espacios desde un repertorio.');
assert.ok(!('progresion' in lib.listas[0]),'Los JSON antiguos no adquieren un campo obligatorio.');
const personal=Array.from({length:30},()=>Array(8).fill(0));
personal[0][0]=2;
const prog={tipo:'personal',niveles:personal};
const validada=api.validarTablaDeLista(prog);
assert.notEqual(validada.niveles,personal,'El motor hace copia defensiva de las filas.');
assert.deepEqual(validada.niveles[0],[2,0,0,0,0,0,0,0]);
lib=api.guardarLista(lib,{...l,progresion:prog},catalogo,borradores);
assert.equal(api.tablaDeLista(lib.listas[0],tablas).niveles[0][0],2);
assert.equal(lib.listas[0].conjuros.length,1,'Una tabla no altera el repertorio.');
assert.deepEqual(api.importar(api.exportar(lib,catalogo,borradores),catalogo,borradores),lib,
  'La biblioteca v1 conserva el campo opcional en un ida y vuelta.');
let duplicada=api.duplicarLista(lib,l.id,'usuario:otralista1234','Copia',
  catalogo,borradores);
assert.deepEqual(duplicada.listas[1].progresion,lib.listas[0].progresion);
duplicada.listas[1].progresion.niveles[0][0]=5;
assert.equal(duplicada.listas[0].progresion.niveles[0][0],2,
  'La copia personal no comparte referencias mutables de la tabla original.');
let mag=api.duplicarLista(vacia,'drs:Mago','usuario:copiamago123','Mago clonado',
  catalogo,borradores);
assert.deepEqual(mag.listas[0].progresion,{tipo:'oficial',id:'drs:Mago'});
assert.deepEqual(api.tablaDeLista(mag.listas[0],tablas).niveles,tablas['drs:Mago'].niveles);
assert.throws(()=>api.validarTablaDeLista({tipo:'oficial',id:'drs:Inexistente'}),
  /oficial desconocida/i);
assert.throws(()=>api.validarTablaDeLista({tipo:'personal',niveles:personal.slice(1)}),
  /30 Niveles/i);
for(const mal of [-1,31,1.5,'2',null]){
  const tabla=personal.map(f=>f.slice());tabla[1][2]=mal;
  assert.throws(()=>api.validarTablaDeLista({tipo:'personal',niveles:tabla}),
    /Progresión inválida/i,'Los Espacios inválidos no pueden guardarse.');
}
const x=personal.map(f=>f.slice());x[4]=[1,0];
assert.throws(()=>api.validarTablaDeLista({tipo:'personal',niveles:x}),/Progresión inválida/);
assert.equal(api.tablaDeLista(l,tablas),null);
assert.deepEqual(fuente.fantasia,JSON.parse(originales),'No mutar la progresión oficial.');
console.log('OK · Fase 7.4: tablas DRS de 30x8, personal editable, validación y persistencia sin reglas inventadas.');
