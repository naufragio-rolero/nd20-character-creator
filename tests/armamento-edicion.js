'use strict';
/* Regresiones de intercambio inicial y compras adicionales DRS. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const load=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',n),'utf8'));
const api=require('../assets/equipment.js');
const pdf=require('../assets/pdf-export-v2.js');
const cat=load('equipo-inicial.json'),oc=load('ocupaciones.json'),esp=load('especies.json');
const humano=esp['Humano común'],guerrero=oc.Guerrero;
assert.equal(cat.equivalencias.mc,0.01);
assert.equal(cat.armas.find(x=>x.nombre==='Dardo').precio,0.05);
assert.equal(cat.armas.find(x=>x.nombre==='Dardo').precio_editorial,'5 mc');
// Forzar Bastón y Pechera en el azar usando el catálogo DRS restringido.
const inicialReducido={...cat,
  armas:cat.armas.filter(x=>x.nombre==='Bastón'),
  armaduras:cat.armaduras.filter(x=>x.nombre==='Pechera de algodón'),
  escudos:[]};
const compra=api.compraInicial(guerrero,'Guerrero','nd20',
  inicialReducido,100,()=>0,1,humano);
assert.equal(compra.equipo[0],'Bastón');
assert.equal(compra.equipo[1],'Pechera de algodón');
assert.deepEqual(compra.compras_iniciales_intercambiables.map(x=>x.indice),[0,1]);
const pj={juego:'Naufragio d20 · Fantasía',equipo:compra.equipo.slice(),
  saldo_mo:compra.restante,
  compras_iniciales_intercambiables:compra.compras_iniciales_intercambiables};
// Sustitución íntegra: devolver 0,20 mo, comprar por 1,00 mo.
const lanza=api.intercambiarEquipoInicial(pj,cat,guerrero,1,humano,
  {indice:0,grupo:'armas',nombre:'Lanza'});
assert.equal(lanza.reembolso,0.2);
assert.equal(lanza.coste,1);
assert.equal(lanza.diferencia,0.8);
assert.equal(lanza.restante,Math.round((pj.saldo_mo-0.8)*100)/100);
assert.equal(lanza.equipo[0],'Lanza');
assert.ok(pj.equipo.includes('Bastón'),'La previsualización no muta la ficha');
const pjLanza={...pj,equipo:lanza.equipo,saldo_mo:lanza.restante,
  compras_iniciales_intercambiables:lanza.compras_iniciales_intercambiables};
const piel=api.intercambiarEquipoInicial(pjLanza,cat,guerrero,1,humano,
  {indice:1,grupo:'armaduras',nombre:'Armadura de cuero'});
assert.equal(piel.diferencia,9.5);
assert.equal(piel.equipo[1],'Armadura de cuero');
// Intercambiar más de una vez no genera mo gratis: el registro se actualiza.
const retorno=api.intercambiarEquipoInicial(pjLanza,cat,guerrero,1,humano,
  {indice:0,grupo:'armas',nombre:'Bastón'});
assert.equal(retorno.diferencia,-0.8);
assert.equal(retorno.restante,pj.saldo_mo);
// Objetos de paquetes y recuerdos no son reembolsables.
assert.throws(()=>api.intercambiarEquipoInicial(pj,cat,guerrero,1,humano,
  {indice:2,grupo:'armas',nombre:'Dardo'}),/no procede de una compra inicial/);
assert.throws(()=>api.intercambiarEquipoInicial(pj,cat,guerrero,1,humano,
  {indice:0,grupo:'armaduras',nombre:'Armadura de tela'}),/mantener la clase/);
const fraud={...pj,compras_iniciales_intercambiables:
  pj.compras_iniciales_intercambiables.map(x=>({...x,precio:1000}))};
assert.throws(()=>api.intercambiarEquipoInicial(fraud,cat,guerrero,1,humano,
  {indice:0,grupo:'armas',nombre:'Lanza'}),/no coincide/);
// Comprar un arma secundaria y su munición, sin vender la inicial.
const extra=api.comprarArmamentoFantasia(pj,cat,guerrero,1,humano,[
  {grupo:'armas',nombre:'Arco corto'},
  {grupo:'municion',nombre:'Flechas'}
]);
assert.equal(extra.gastado,27);
assert.equal(extra.equipo.at(-2),'Arco corto');
assert.equal(extra.equipo.at(-1),'Flechas');
assert.equal(pj.equipo.includes('Arco corto'),false);
assert.throws(()=>api.comprarArmamentoFantasia(pj,cat,guerrero,1,humano,[
  {grupo:'armas',nombre:'Armadura de tela'}]),/no disponible/);
assert.throws(()=>api.comprarArmamentoFantasia(
  {...pj,saldo_mo:1},cat,guerrero,1,humano,[
    {grupo:'armas',nombre:'Arco corto'}]),/supera el saldo/);
// Dardo, fracciones de 1 mo y no redondeos a cero.
const p05={...pj,saldo_mo:0.05};
const dardo=api.comprarArmamentoFantasia(p05,cat,guerrero,1,humano,[
  {grupo:'armas',nombre:'Dardo'}
]);
assert.equal(dardo.gastado,0.05);
assert.equal(dardo.restante,0);
assert.throws(()=>api.comprarArmamentoFantasia(
  {...pj,saldo_mo:0.04},cat,guerrero,1,humano,[
    {grupo:'armas',nombre:'Dardo'}]),/supera el saldo/);
assert.throws(()=>api.comprarArmamentoFantasia(pj,cat,guerrero,1,humano,[
  {grupo:'municion',nombre:'Flechas',cantidad:0}]),/cantidad/);
// Varitas solo para las Ocupaciones con competencia explícita y Nivel.
const opciones=(personaje,nivel,especie=humano)=>
  api.informacionEquipo(cat,oc[personaje],nivel,especie);
assert.equal(opciones('Guerrero',1).some(x=>x.grupo==='varitas_defensa'),false);
assert.equal(opciones('Mago',1).filter(x=>x.grupo==='varitas_defensa').length,4);
assert.equal(opciones('Ladrón',5).some(x=>x.grupo==='varitas_defensa'),false);
assert.equal(opciones('Ladrón',6).filter(x=>x.grupo==='varitas_defensa').length,4);
assert.throws(()=>api.comprarArmamentoFantasia(pj,cat,guerrero,1,humano,[
  {grupo:'varitas_defensa',nombre:'Varita de cerezo'}]),/no disponible/);
// Baja estatura impide escudos medianos y grandes; equipo sin competencia avisa.
assert.deepEqual(opciones('Guerrero',1,esp['Gnomo urbano'])
  .filter(x=>x.grupo==='escudos').map(x=>x.nombre),['Escudo pequeño']);
assert.ok(opciones('Mago',1).find(x=>x.nombre==='Espadón').advertencia);
// Protecciones disponibles: solo son equipables las que siguen en el inventario.
const defensa=api.blindajeFicha({...pjLanza,
  protecciones_equipadas:{armadura:'Pechera de algodón',escudo:''}},cat);
assert.equal(defensa.valor,'1');
assert.equal(api.blindajeFicha({...pjLanza,equipo:piel.equipo,
  protecciones_equipadas:{armadura:'Pechera de algodón',escudo:''}},cat).valor,
  'Sin armadura');
// Consulta y PDF de munición, varitas y compras múltiples.
assert.match(pdf.detalleEquipo('Flechas ×2',cat),/DU d8/);
assert.match(pdf.detalleEquipo('Varita de cerezo',cat),/Munición DU d6/);
assert.match(pdf.detalleEquipo('Lanza',cat),/Daño 1d6/);
console.log('OK · Intercambios iniciales, 5 mc, compras, Competencias, Blindaje y PDF.');
