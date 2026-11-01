'use strict';
/* Fase 1: concordancia documental fijada al DRS y al Excel auditados.
 * Este test NO interpreta ni ejecuta mecánicas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const matrix=read('docs/enciclopedia/122a-matriz-talentos-drs-excel.json');
const canon=read('data/talentos-drs-literales.json');
const categorias=read('data/glosas-talentos-drs.json');
const cinco=new Set(['Acción','Especial','Mejora','Pasiva','Reacción']);
assert.deepEqual(new Set(matrix.vocabulario),cinco);
assert.equal(matrix.origen_drs.sha256,
  '2f3447300e58139ce20c8449e12e5b8d3cd3e7435b2995677ed97c6602a23df8');
assert.equal(matrix.relaciones.length,24);
assert.equal(new Set(matrix.relaciones.map(x=>x.id_drs)).size,24);
assert.equal(new Set(matrix.relaciones.map(x=>x.id_excel)).size,22);
assert.equal(categorias.registros.length,24);
assert.equal(matrix.relaciones.filter(x=>x.tipo==='Especie').length,15);
assert.equal(matrix.relaciones.filter(x=>x.tipo==='Ocupación').length,9);
assert.equal(matrix.relaciones.filter(x=>x.compartido).length,2);
assert.equal(matrix.relaciones.filter(x=>x.coincidencia_efecto==='redaccion_diferente').length,7);
const drsPorId=new Map(canon.registros.map(x=>[x.id,x]));
const catPorId=new Map(categorias.registros.map(x=>[x.id_talento,x]));
for(const relacion of matrix.relaciones){
  const literal=drsPorId.get(relacion.id_drs);
  const categoria=catPorId.get(relacion.id_drs);
  assert.ok(literal&&categoria,'Identidad DRS sin fuente y categoría');
  assert.equal(relacion.nombre_excel,literal.nombre);
  assert.equal(relacion.propietario_drs,literal.propietario);
  assert.equal(relacion.efecto_literal_drs,literal.efecto_literal,
    'Ningún efecto DRS puede ser sustituido por texto Excel');
  assert.deepEqual(relacion.parrafos_documento,literal.parrafos_documento);
  assert.ok(cinco.has(relacion.categoria_excel));
  assert.equal(categoria.categoria,relacion.categoria_excel);
  assert.equal(categoria.id_excel,relacion.id_excel);
  assert.equal(categoria.fuente_categoria,relacion.fuente_categoria);
  assert.equal(relacion.aprobacion_nuevo_texto_drs,'no_aprobado');
  if(relacion.tipo==='Especie'){
    assert.equal(literal.activacion_literal,null);
    assert.equal(categoria.estado_categoria,'propuesta_para_edicion_DRS');
  }else{
    assert.equal(literal.activacion_literal,relacion.categoria_excel);
    assert.equal(categoria.estado_categoria,'formal_original_DRS');
  }
}
assert.deepEqual(matrix.relaciones.filter(x=>x.variante).map(x=>x.variante).sort(),
  ['SE','SO']);
assert.deepEqual(new Set(matrix.relaciones.filter(x=>x.compartido)
  .map(x=>x.nombre_drs)),new Set(['Baja estatura','Visión en la oscuridad']));
assert.equal(matrix.cobertura.otros_origenes_sin_integrar,121);
console.log('OK · 22 entradas del Excel, 24 asignaciones DRS, cinco categorías, 15 propuestas y 7 diferencias de redacción.');
