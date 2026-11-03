'use strict';
/* Regresiones de semillas y niveles. No introduce reglas de juego. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const reglas=require('../assets/rules.js');
const data=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',n),'utf8'));
const especies=data('especies.json'),ocupaciones=data('ocupaciones.json');
const fantasia={especies,ocupaciones,fuentes:{
  especies:Object.fromEntries(Object.keys(especies).map(k=>[k,'DRS'])),
  ocupaciones:Object.fromEntries(Object.keys(ocupaciones).map(k=>[k,'DRS']))
}};
const dh=data('dungeon-hack.json');
const seed=(s,i)=>reglas.aleatorioSemilla(s+':'+i);
function generarNd20(s,min,max,cantidad){
  return Array.from({length:cantidad},(_,i)=>{
    const rng=seed(s,i);
    const nivel=reglas.nivelAleatorio(min,max,rng,30);
    return reglas.crearNd20(fantasia,{juego:'nd20',nivel,fuentes:['DRS'],
      sexo:'aleatorio',respetarContextoSexo:true},rng);
  });
}
function generarDH(s,min,max,cantidad){
  return Array.from({length:cantidad},(_,i)=>{
    const rng=seed(s,i);
    const nivel=reglas.nivelAleatorio(min,max,rng,36);
    return reglas.eleccionDH(dh,{juego:'dh',nivel,sexo:'aleatorio',
      origenes:dh.origins.map((_,j)=>String(j))},rng);
  });
}
for(const [system,max,crear] of [['Naufragio d20',30,generarNd20],
                                 ['Dungeon Hack',36,generarDH]]){
  const mismo=crear(system+'-fijo',5,5,3);
  assert.deepEqual(mismo,crear(system+'-fijo',5,5,3),'Fijo y reproducible');
  assert.ok(mismo.every(p=>p.nivel===5));
  const primera=crear(system+'-rango',3,Math.min(max,20),12);
  const segunda=crear(system+'-rango',3,Math.min(max,20),12);
  assert.deepEqual(primera,segunda,'Lote reproducible');
  assert.ok(primera.every(p=>p.nivel>=3&&p.nivel<=Math.min(max,20)));
  assert.ok(new Set(primera.map(p=>p.nivel)).size>1,'Nivel por ficha');
  assert.notDeepEqual(primera,crear(system+'-otra',3,Math.min(max,20),12),
    'Otra semilla produce otra secuencia');
  const maximo=crear(system+'-limite',max,max,1)[0];
  assert.equal(maximo.nivel,max,'Respeta el máximo '+system);
  // Independencia: regenerar una posición no depende de haber calculado otras.
  assert.deepEqual(primera[7],crear(system+'-rango',3,Math.min(max,20),12)[7]);
}
assert.equal(reglas.nivelAleatorio(1,1,()=>0.9999,30),1);
assert.equal(reglas.nivelAleatorio(3,10,()=>0,30),3);
assert.equal(reglas.nivelAleatorio(3,10,()=>0.999999,30),10);
for(const [min,max,limite] of [[0,10,30],[1,31,30],[1,37,36],[4,3,30],
                                [1.5,3,30],[1,3.2,30],[NaN,3,30],
                                [1,undefined,30],['',5,30]]){
  assert.throws(()=>reglas.nivelAleatorio(min,max,()=>0.5,limite),/intervalo/);
}
const histogram=new Map();
const rngUniforme=()=>Math.random();
for(let i=0;i<2000;i++){
  const n=reglas.nivelAleatorio(3,10,rngUniforme,30);
  histogram.set(n,(histogram.get(n)||0)+1);
}
assert.deepEqual([...histogram.keys()].sort((a,b)=>a-b),[3,4,5,6,7,8,9,10]);
assert.throws(()=>reglas.crearNd20(fantasia,{nivel:1,juego:'nd20',fuentes:[]},
  seed('fuentes-vacias',0)),/Selecciona al menos una fuente/);
assert.throws(()=>reglas.eleccionDH(dh,{nivel:1,origenes:[]},seed('origenes-vacios',0)),
  /procedencia/);
assert.throws(()=>reglas.crearNd20(fantasia,{nivel:99,juego:'nd20'},
  seed('no-clamp',0)),/Nivel no válido/);
assert.throws(()=>reglas.eleccionDH(dh,{nivel:37},seed('dh-no-clamp',0)),
  /Nivel no válido/);
assert.throws(()=>reglas.crearNd20(fantasia,{nivel:1.2,juego:'nd20'},
  seed('decimal',0)),/Nivel no válido/);
// No se utiliza Math.random como fuente implícita al pasar un RNG semillado.
const original=Math.random;
try {
  Math.random=()=>{throw Error('Azar externo dentro de generación reproducible');};
  generarNd20('solo-semilla',3,7,2);
  generarDH('solo-semilla',3,7,2);
} finally {Math.random=original;}
console.log('OK: semillas, lotes, independencia, rangos, límites y fuentes (Node).');
