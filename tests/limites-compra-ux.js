'use strict';
/* Límites de UX de La Forja, no normas económicas del DRS. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const data=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',name),'utf8'));
const api=require('../assets/equipment.js');
const cat=data('equipo-inicial.json'),ocupaciones=data('ocupaciones.json'),
  especies=data('especies.json');
const pj={juego:'Naufragio d20 · Fantasía',equipo:[],saldo_mo:10000};
const guerrero=ocupaciones.Guerrero,humano=especies['Humano común'];
const clavas=cantidad=>api.comprarArmamentoFantasia(pj,cat,guerrero,30,humano,[
  {grupo:'armas',nombre:'Clava',cantidad}
]);
assert.throws(()=>clavas(70),/Límite de La Forja/,'70 Clavas bloqueadas');
assert.throws(()=>clavas(11),/Límite de La Forja/,'11 Clavas bloqueadas');
const diez=clavas(10);
assert.ok(diez.equipo.includes('Clava ×10'));
assert.equal(api.cupoCompraFantasia(cat,diez.equipo,[],'armas','Clava'),0);
assert.throws(()=>api.comprarArmamentoFantasia(
  {...pj,equipo:diez.equipo},cat,guerrero,30,humano,
  [{grupo:'armas',nombre:'Clava',cantidad:1}]),/Límite de La Forja/,
  'Una compra nueva no salta el límite acumulado');
assert.throws(()=>api.comprarArmamentoFantasia(pj,cat,guerrero,30,humano,[
  {grupo:'armas',nombre:'Clava',cantidad:6},
  {grupo:'armas',nombre:'Clava',cantidad:5}]),/Límite de La Forja/,
  'Dos líneas separadas no eluden el máximo');
assert.equal(api.cupoCompraFantasia(cat,['Clava ×7'],[
  {grupo:'armas',nombre:'Clava',cantidad:2}], 'armas','Clava'),1);
assert.equal(api.cupoCompraFantasia(cat,['Clava','Clava ×2'],[],
  'armas','Clava'),7);
assert.equal(api.cupoCompraFantasia(cat,['Clava ×70'],[],
  'armas','Clava'),0,'Los personajes ya excesivos no pierden equipo pero no compran más');
assert.throws(()=>clavas(0),/cantidad/);
assert.throws(()=>clavas(1.5),/cantidad/);
// Las monturas se limitan globalmente, no solo por cada especie.
const burro='montura-burro-mula',caballo='montura-caballo-monta';
const comprar=(lineas,inventario=[])=>api.compraUtilesFantasia(cat,10000,lineas,inventario);
assert.throws(()=>comprar([{id:burro,cantidad:30}]),/Límite de La Forja/);
assert.throws(()=>comprar([{id:burro,cantidad:6}]),/Límite de La Forja/);
const cinco=comprar([{id:burro,cantidad:5}]);
assert.deepEqual(cinco.equipo,['Burro o mula ×5']);
assert.equal(api.cupoCompraFantasia(cat,cinco.equipo,[],'monturas','Caballo de monta'),0);
assert.throws(()=>comprar([{id:caballo,cantidad:1}],cinco.equipo),
  /Límite de La Forja/,'No compra una sexta montura de otra clase');
assert.throws(()=>comprar([{id:burro,cantidad:3},{id:caballo,cantidad:3}]),
  /Límite de La Forja/,'El carrito mixto tampoco compra seis monturas');
assert.equal(api.cupoCompraFantasia(cat,[],[
  {grupo:'monturas',nombre:'Burro o mula',cantidad:3}],
  'monturas','Caballo de monta'),2);
assert.equal(api.cupoCompraFantasia(cat,['Pony ×2','Burro o mula'],[],
  'monturas','Caballo de guerra'),2);
assert.equal(api.cupoCompraFantasia(cat,['Pony ×2'],[],
  'monturas','Pony'),3);
// Útiles ordinarios, monturas y armamento usan el mismo control acumulativo.
const tiza='aventura-tiza';
assert.throws(()=>comprar([{id:tiza,cantidad:70}]),/Límite de La Forja/);
assert.throws(()=>comprar([{id:tiza,cantidad:6},{id:tiza,cantidad:5}]),
  /Límite de La Forja/);
const utiles=comprar([{id:tiza,cantidad:7}]);
assert.equal(api.cupoCompraFantasia(cat,utiles.equipo,[],'aventura','Tiza'),3);
assert.throws(()=>comprar([{id:tiza,cantidad:4}],utiles.equipo),
  /Límite de La Forja/);
assert.equal(comprar([{id:tiza,cantidad:3}],utiles.equipo).equipo[0],'Tiza ×3');
assert.throws(()=>comprar([{id:tiza,cantidad:1.1}]),/Cantidad incorrecta/);
console.log('OK · Límites por personaje: 70 Clavas y 30 burros rechazados; carritos y recompras controlados.');
