'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {prepararDatos,detalleEquipo}=require('../assets/pdf-export-v2.js');
const root=path.join(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/equipo-inicial.json'),'utf8'));
const arma=catalog.armas.find(x=>x.nombre==='Hacha de batalla');
assert.equal(arma.dano,'1d8');
assert.equal(arma.durabilidad,'d10');
assert.equal(detalleEquipo('Hacha de batalla',catalog),
  'Hacha de batalla (Daño 1d8 · Durab. d10)');
assert.equal(detalleEquipo('Hacha de batalla ×2',catalog),
  'Hacha de batalla ×2 (Daño 1d8 · Durab. d10)');
assert.equal(detalleEquipo('Escudo pequeño',catalog),
  'Escudo pequeño (Bloqueo +1 · Durab. d6)');
assert.equal(detalleEquipo('Armadura acolchada',catalog),
  'Armadura acolchada (Blindaje d4 · Durab. d4)');
assert.equal(detalleEquipo('Objeto inventado',catalog),'Objeto inventado',
  'No documentar mecánicas inventadas.');
const p={
  juego:'Naufragio d20 · Fantasía',descripcion:'Guerrero · Humano común',
  equipo:['Hacha de batalla','Armadura acolchada','Escudo pequeño','Objeto inventado'],
  notas:['Observación extensa que debe ir a continuación'],recursos:[],
  competencias:['Armas'],riqueza:'234 mo restantes / 260 mo iniciales'
};
const before=JSON.stringify(p),out=prepararDatos(p,{valor:'d4'},catalog);
assert.equal(JSON.stringify(p),before,'Ninguna mutación de la ficha');
assert.equal(out._notas.length,1);
assert(!out._sections.some(x=>x.source==='notas'),
  'Las observaciones nunca entran en los bloques de la primera página.');
assert.equal(out._sections.find(x=>x.source==='equipo').items[0],
  'Hacha de batalla (Daño 1d8 · Durab. d10)');
const html=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/styles.css'),'utf8');
const bridge=fs.readFileSync(path.join(root,'assets/pdf-export-browser.js'),'utf8');
assert(html.includes('acciones-pie-ficha'));
assert(html.includes('>PDF</button>'));
assert(html.includes('>Útiles</button>'));
assert(html.includes('>Copiar</button>'));
assert(html.indexOf('acciones-pie-ficha')<html.indexOf('fuentes-pie-ficha'));
assert(html.includes('blindajePersonaje(entradaPdf.valor),datos.equipoInicial'));
assert(css.includes('.acciones-pie-ficha'));
assert(bridge.includes("RUTA+'icons/'+id+'.svg"));
assert(bridge.includes('canvas.toBlob'));
console.log('OK: botones arriba, notas separadas, armas/escudo DRS e iconos SVG oficiales.');
