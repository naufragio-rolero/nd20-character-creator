'use strict';
/* Pruebas locales sin npm: node tests/smoke.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reglas = require('../assets/rules.js');
const leer = (nombre) => JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',nombre),'utf8'));
const fantasia = {especies:leer('especies.json'), ocupaciones:leer('ocupaciones.json')};
const cifi = {especies:leer('especies_cifi.json'), ocupaciones:leer('ocupaciones_cifi.json')};
const dh = leer('dungeon-hack.json');
let total=0;

function comprobar(p, n, tipo) {
  assert.equal(p.nivel,n,tipo+' nivel');
  assert.equal(p.atributos.length,6,tipo+' atributos');
  assert.ok(p.nombre && p.descripcion,tipo+' ficha');
  assert.ok(p.atributos.every((a)=>a.dificultad+a.valor===20),tipo+' VA + DA = 20');
  total++;
}

for(const [tipo, data] of [['nd20',fantasia],['nd20_cifi',cifi]]) {
  for(let n=1;n<=30;n++) {
    const cfg={nivel:n,juego:tipo};
    const a=reglas.crearNd20(data,cfg,reglas.aleatorioSemilla(tipo+'-'+n));
    const b=reglas.crearNd20(data,cfg,reglas.aleatorioSemilla(tipo+'-'+n));
    comprobar(a,n,tipo);
    assert.deepEqual(a,b,'Reproducibilidad con semilla');
    assert.ok(a.atributos.every((x)=>x.valor>=4&&x.valor<=18),'VA válido');
    const es=Number(a.recursos.find((x)=>x[0]==='Esfuerzo')[1]);
    assert.ok(es<=9 && es>=0,'Esfuerzo válido');
    if(tipo==='nd20_cifi') assert.ok(a.notas.some((s)=>s.includes('créditos')),'Sin invención de riqueza');
  }
}

for(let n=1;n<=36;n++) {
  const cfg={nivel:n,juego:'dh',origenes:[0,1,2,3,4],conEspecie:true};
  const a=reglas.eleccionDH(dh,cfg,reglas.aleatorioSemilla('dh-'+n));
  const b=reglas.eleccionDH(dh,cfg,reglas.aleatorioSemilla('dh-'+n));
  comprobar(a,n,'Dungeon Hack');
  assert.deepEqual(a,b,'Reproducibilidad Dungeon Hack');
}
for(let n=1;n<=30;n++) {
  const seg=reglas.seguidorDH(dh,{nivel:n,origenes:[0,1,2,3,4]},reglas.aleatorioSemilla('seg-'+n));
  assert.equal(seg.nivel,n);
  assert.equal(seg.atributos.length,2);
  total++;
}
const matriz = reglas.matriz({juego:'dh'},reglas.aleatorioSemilla('matriz'));
assert.equal(matriz.atributos.length,6);
const mapa = reglas.mazmorra({ancho:6,alto:6},reglas.aleatorioSemilla('mapa'));
assert.equal(mapa.length,8);
assert.ok(mapa.every((f)=>f.length===8));
assert.ok(mapa[0].every((x)=>x==='wall'));
total+=2;
console.log('OK · '+total+' comprobaciones de generación superadas.');
