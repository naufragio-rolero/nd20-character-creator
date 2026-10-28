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


/* Validación de contenido ampliado procedente de la Biblioteca de Naufragio d20. */
const catalogo = leer('catalogo-ampliado.json');
const expandir = (base, nuevos) => ({
  especies: Object.assign({}, base.especies, nuevos.especies),
  ocupaciones: Object.assign({}, base.ocupaciones, nuevos.ocupaciones)
});
const fantasiaExtendida = expandir(fantasia,catalogo.fantasia);
const nocturna = catalogo.nocturna;
const cifiExtendida = {
  especies: Object.assign({},cifi.especies),
  ocupaciones: cifi.ocupaciones
};
for(const [nombre,mod] of Object.entries(catalogo.cifi.especies))
  cifiExtendida.especies[nombre]=Object.assign({},cifiExtendida.especies[nombre],mod);

assert.equal(Object.keys(fantasiaExtendida.ocupaciones).length,37,'Ocupaciones Fantasía');
assert.equal(Object.keys(fantasiaExtendida.especies).length,30,'Especies Fantasía');
assert.equal(Object.keys(nocturna.especies).length,8,'Especies Nocturna');
assert.equal(Object.keys(nocturna.ocupaciones).length,8,'Ocupaciones Nocturna');
assert.equal(cifiExtendida.especies['Humano aumentado'].requisitos.length,2,'Requisitos CiFi');

let ampliadas=0;
for(const [juego,datos] of [['nd20',fantasiaExtendida],['nd20_cifi',cifiExtendida],['nd20_nocturna',nocturna]]) {
  for(const especie of Object.keys(datos.especies)){
    for(const nivel of [1,6,12,30]){
      const personaje=reglas.crearNd20(datos,{juego,nivel,especie},reglas.aleatorioSemilla(juego+especie+nivel));
      assert.ok(personaje.descripcion.includes(especie),'Especie respetada');
      assert.equal(personaje.atributos.length,6);
      assert.ok(personaje.atributos.every(a=>a.valor>=4&&a.valor<=18),'VA entre 4 y 18');
      if(juego==='nd20_nocturna')assert.ok(personaje.recursos.some(a=>a[0]==='Esencia'),'Esencia Nocturna');
      ampliadas++;
    }
  }
  for(const ocupacion of Object.keys(datos.ocupaciones)) {
    const p=reglas.crearNd20(datos,{juego,nivel:1,ocupacion},reglas.aleatorioSemilla(ocupacion));
    assert.ok(p.descripcion.startsWith(ocupacion+' ·'),'Ocupación respetada');
    ampliadas++;
  }
}
const aumentado=reglas.crearNd20(cifiExtendida,
  {juego:'nd20_cifi',nivel:1,especie:'Humano aumentado'},reglas.aleatorioSemilla('aumentado'));
assert.ok(aumentado.atributos.find(a=>a.nombre==='Resistencia').valor>=7);
assert.ok(aumentado.atributos.find(a=>a.nombre==='Presencia').valor>=7);
console.log('OK · '+ampliadas+' fichas adicionales con material documental.');
