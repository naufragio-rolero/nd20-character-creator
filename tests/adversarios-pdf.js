'use strict';
const assert=require('node:assert/strict');
const pdf=require('../assets/adversarios-pdf.js');
assert.equal(pdf.slug('Árbol pugilista'),'arbol-pugilista');
const fuente={widthOfTextAtSize:(x,size)=>x.length*size/2};
const bloques=pdf.lineas('Nombre largo para envolver correctamente',fuente,10,70);
assert.ok(bloques.length>=3);
assert.ok(bloques.every(linea=>fuente.widthOfTextAtSize(linea,10)<=70));
const palabra=pdf.lineas('IncomprensibilisimamenteLargo',fuente,10,25);
assert.ok(palabra.length>2);
assert.equal(palabra.join(''),'IncomprensibilisimamenteLargo');
assert.deepEqual(pdf.lineas('Línea uno\n\nLínea dos',fuente,10,200),
  ['Línea uno','','Línea dos']);
console.log('OK · Composición textual del PDF de Adversarios: palabras y párrafos.');
