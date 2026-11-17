'use strict';
/* Contrato DRS: fuentes oficiales protegidas y copias personales con procedencia. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=p=>JSON.parse(fs.readFileSync(path.join(raiz,p),'utf8'));
const api=require('../assets/spell-lists.js');
const origen=leer('data/catalogo-poderes.json');
const fichas=leer('data/conjuros-drs-fichas.json');
const catalogo=api.crearCatalogo(fichas,origen);
const borradores=api.leerBorradores(leer('data/listas-conjuros-borradores.json'),catalogo);
const protegidas=JSON.stringify(catalogo.oficiales);
assert.deepEqual(catalogo.oficiales.map(l=>l.id),['drs:Clérigo','drs:Mago']);
const esperados={'drs:Clérigo':34,'drs:Mago':37};
for(const oficial of catalogo.oficiales){
  assert.equal(oficial.conjuros.length,esperados[oficial.id]);
  assert.equal(oficial.tipo,'oficial');
  const nombre=oficial.id.slice(4);
  const nombres=Object.entries(origen.listas_drs[nombre]).flatMap(([,n])=>n);
  const resoluciones=nombres.map(nombre=>{
    const ficha=catalogo.conjuros.find(s=>s.nombre===nombre);
    assert.ok(ficha,'El catálogo debe resolver '+nombre);
    return ficha.id;
  });
  assert.deepEqual(oficial.conjuros,resoluciones,
    'La interfaz no debe reconstruir ni alterar el orden de la lista '+nombre);
}
let biblioteca=api.vacia(catalogo);
const original=catalogo.oficiales.find(l=>l.id==='drs:Mago');
biblioteca=api.duplicarLista(biblioteca,original.id,'usuario:copiamago123',
  'Lista de Conjuros de Mago (copia)',catalogo,borradores);
assert.equal(biblioteca.listas.length,1);
assert.equal(biblioteca.listas[0].derivadaDe,'drs:Mago');
assert.deepEqual(biblioteca.listas[0].conjuros,original.conjuros);
biblioteca=api.guardarLista(biblioteca,{...biblioteca.listas[0],
  conjuros:biblioteca.listas[0].conjuros.slice(1)},catalogo,borradores);
assert.equal(biblioteca.listas[0].conjuros.length,36);
assert.equal(original.conjuros.length,37,'La edición no afecta a la Lista oficial');
const exportado=api.exportar(biblioteca,catalogo,borradores);
assert.deepEqual(api.importar(exportado,catalogo,borradores),biblioteca);
assert.equal(JSON.parse(exportado).listas[0].derivadaDe,'drs:Mago');
assert.doesNotMatch(exportado,/texto_normativo|efectos/,'No duplicar textos del DRS en la exportación');
biblioteca=api.duplicarLista(biblioteca,biblioteca.listas[0].id,
  'usuario:subcopia123','Subcopia del Mago',catalogo,borradores);
assert.equal(biblioteca.listas[1].derivadaDe,'drs:Mago');
assert.throws(()=>api.guardarLista(biblioteca,{
  ...biblioteca.listas[0],id:'drs:Mago'},catalogo,borradores),/personal/i);
assert.throws(()=>api.eliminarLista(biblioteca,'drs:Mago',catalogo,borradores),/personales/i);
assert.throws(()=>api.guardarLista(biblioteca,{
  ...biblioteca.listas[0],derivadaDe:'drs:NoExiste'},catalogo,borradores),
  /procedencia.*oficial/i);
assert.throws(()=>api.importar(JSON.stringify({...biblioteca,listas:[
  {...biblioteca.listas[0],derivadaDe:'usuario:falso'},
  biblioteca.listas[1]]}),catalogo,borradores),/procedencia.*oficial/i);
// Una biblioteca v1 anterior a esta fase no recibe un nuevo campo obligatorio.
const legacy=api.vacia(catalogo);
const legacyLista={id:'usuario:legado123456',nombre:'Lista heredada',
  descripcion:'',maxCirculo:8,conjuros:[original.conjuros[0]]};
const viejo=api.guardarLista(legacy,legacyLista,catalogo,borradores);
assert.ok(!Object.hasOwn(viejo.listas[0],'derivadaDe'));
assert.deepEqual(api.importar(api.exportar(viejo,catalogo,borradores),catalogo,borradores),viejo);
assert.deepEqual(catalogo.oficiales,JSON.parse(protegidas),'Las listas oficiales son inmutables');
console.log('OK · Fase 7.3: 34 Clérigo, 37 Mago, originales protegidos y copia con procedencia v1.');
