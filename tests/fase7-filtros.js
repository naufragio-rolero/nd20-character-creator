'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const fuente=fs.readFileSync(path.join(raiz,'assets/spell-lists-simple.js'),'utf8');
const drs=JSON.parse(fs.readFileSync(path.join(raiz,'data/conjuros-drs-fichas.json'),'utf8')).conjuros;
assert.equal(drs.length,64,'La prueba debe utilizar las 64 fichas oficiales');
const inicio=fuente.indexOf('function facetasConjuros(');
const fin=fuente.indexOf('function actualizarOpcionesFiltros(){',inicio);
assert.ok(inicio>=0&&fin>inicio,'Funciones de facetas ausentes de la pantalla');
const normalizar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const {facetasConjuros,filtrarConjuros}=new Function('normalizar',
  fuente.slice(inicio,fin)+'\nreturn {facetasConjuros,filtrarConjuros};')(normalizar);
const escuelas=[...new Set(drs.map(s=>s.escuela))].sort((a,b)=>a.localeCompare(b,'es'));
assert.deepEqual(escuelas,['Arcana','Demonología','Divina','Elemental','Naturaleza','Nigromancia']);
assert.deepEqual(facetasConjuros(drs,0,'').circulos,[1,2,3,4,5,6,7,8]);
assert.deepEqual(facetasConjuros(drs,0,'').escuelas,escuelas);
let combinaciones=0,imposibles=0;
for(const escuela of ['',...escuelas]){
  for(let circulo=0;circulo<=8;circulo++){
    const facetas=facetasConjuros(drs,circulo,escuela);
    const circulosEsperados=[...new Set(drs.filter(s=>!escuela||s.escuela===escuela)
      .map(s=>s.circulo))].sort((a,b)=>a-b);
    const escuelasEsperadas=[...new Set(drs.filter(s=>!circulo||s.circulo===circulo)
      .map(s=>s.escuela))].sort((a,b)=>a.localeCompare(b,'es'));
    assert.deepEqual(facetas.circulos,circulosEsperados,
      'Opciones de Círculo incorrectas para '+escuela);
    assert.deepEqual(facetas.escuelas,escuelasEsperadas,
      'Opciones de Escuela incorrectas para Círculo '+circulo);
    const resultados=filtrarConjuros(drs,'',circulo,escuela);
    const esperados=drs.filter(s=>(!circulo||s.circulo===circulo)&&
      (!escuela||s.escuela===escuela));
    assert.deepEqual(resultados.map(s=>s.id),esperados.map(s=>s.id),
      'El filtro debe ser la intersección de Círculo y Escuela');
    combinaciones++;
    if(!resultados.length)imposibles++;
  }
}
assert.ok(imposibles>0,'Debe haber combinaciones sin Conjuros');
assert.deepEqual(facetasConjuros(drs,0,'Naturaleza').circulos,[2,3,4,6,7]);
assert.deepEqual(facetasConjuros(drs,1,'').escuelas,
  ['Arcana','Divina','Elemental','Nigromancia']);
assert.equal(filtrarConjuros(drs,'dardo igneo',1,'Elemental').length,1,
  'El nombre ignora tildes y mayúsculas');
assert.equal(filtrarConjuros(drs,'dardo igneo',2,'Naturaleza').length,0,
  'La consulta textual combina las tres condiciones');
assert.equal(drs.length,64,'La prueba nunca debe mutar el DRS');
console.log('OK · Fase 7.2: '+combinaciones+' combinaciones, '+imposibles+
  ' sin Conjuros, seis Escuelas, ocho Círculos y búsqueda insensible a tildes.');
