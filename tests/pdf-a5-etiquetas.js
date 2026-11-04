'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'../assets/pdf-a5');
const svg=fs.readFileSync(path.join(root,'forja-fantasia-epica-a5.svg'),'utf8');
const map=JSON.parse(fs.readFileSync(path.join(root,'campos-ficha-a5.json'),'utf8'));
assert(svg.includes('>ARMA EQUIPADA</text>'),'La etiqueta debe ser ARMA EQUIPADA');
assert(!svg.includes('>DAÑO</text>'),'Daño y Durabilidad se integran en Arma equipada');
assert(!svg.includes('>BLINDAJE</text>')&&!svg.includes('>PROTECCIÓN NATURAL</text>'),
  'El Blindaje y la protección natural ya no ocupan campos propios');
assert(map.campos_fijos.find(x=>x.id==='arma_equipada').mm_superior_izquierda.width===129,
  'La fila del arma utiliza el ancho completo');
assert(map.campos_fijos.some(x=>x.id==='dano_equipado'));
console.log('OK: armas, daño y campos A5 actualizados.');
