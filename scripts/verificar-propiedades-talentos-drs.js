'use strict';
/* Validación del índice editorial de propiedades literales DRS.
 * No ejecuta Talentos, no infiere costes/activaciones ausentes. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const json=ruta=>JSON.parse(fs.readFileSync(path.join(root,ruta),'utf8'));
const fuente=json('data/talentos-drs-literales.json');
const huellas=json('docs/enciclopedia/109a-huellas-talentos-drs.json');
const indice=json('docs/enciclopedia/110a-propiedades-literales-drs.json');
const categorias=new Set([
  'inmunidad','ventaja','modificador','ya_aplicado','condicion','gasto_recurso',
  'gasto_accion','efecto','alcance','restriccion','momento_adquisicion',
  'frecuencia','momento_uso','eleccion','probabilidad','efecto_alternativo',
  'duracion','terminacion','progresion','limite','requisito','sustitucion',
  'consecuencia','excepcion'
]);
assert.equal(indice.estado,'preclasificacion_documental_no_validacion_mecanica');
assert.equal(indice.fuente,huellas.fuente);
assert.equal(indice.fuente_documental,'data/talentos-drs-literales.json');
assert.equal(fuente.registros.length,24);
assert.equal(indice.registros.length,24);
assert.equal(indice.cobertura.total_relaciones,24);
assert.equal(Object.keys(huellas.huellas).length,24);
const canon=new Map(fuente.registros.map(r=>[r.id,r]));
const conteo={};let total=0;
const vistos=new Set();
for(const registro of indice.registros){
  const r=canon.get(registro.id_talento);
  assert.ok(r,'Propiedad vinculada a Talento que no existe: '+registro.id_talento);
  assert.ok(!vistos.has(r.id),'Talento duplicado: '+r.id);
  vistos.add(r.id);
  assert.equal(registro.propietario,r.propietario,'Propietario cambiado: '+r.id);
  assert.equal(registro.nombre,r.nombre,'Nombre cambiado: '+r.id);
  assert.equal(registro.fuente_parrafo,r.parrafos_documento.at(-1));
  assert.equal(registro.origen,'cita_literal_DRS');
  const clave=r.propietario+'|'+r.nombre;
  assert.equal(crypto.createHash('sha256').update(r.efecto_literal,'utf8')
    .digest('hex'),huellas.huellas[clave],'Texto fuente alterado: '+clave);
  assert.ok(Array.isArray(registro.fragmentos)&&registro.fragmentos.length>0,
    'Relación sin indicios documentales: '+clave);
  for(const prueba of registro.fragmentos){
    assert.deepEqual(Object.keys(prueba).sort(),['fragmento_literal','tipo'],
      'No incorporar supuestos mecánicos ni valores interpretados: '+clave);
    assert.ok(categorias.has(prueba.tipo),'Categoría no documentada: '+prueba.tipo);
    assert.ok(prueba.fragmento_literal&&
      r.efecto_literal.includes(prueba.fragmento_literal),
      'Fragmento que no aparece literalmente en el DRS: '+clave);
    conteo[prueba.tipo]=(conteo[prueba.tipo]||0)+1;
    total++;
  }
}
assert.equal(vistos.size,24,'Cobertura incompleta');
assert.equal(total,79,'No eliminar silenciosamente fragmentos auditados');
assert.equal(total,indice.cobertura.total_fragmentos);
assert.deepEqual(conteo,indice.cobertura.categorias,
  'Resumen de auditoría inconsistente');
// Una misma condición no puede convertirse en coste reglamentario etiquetado.
const recuperacion=fuente.registros.find(r=>
  r.propietario==='Guerrero'&&r.nombre==='Recuperación');
assert.equal(recuperacion.activacion_literal,'Pasiva');
assert.equal(recuperacion.coste_literal,null);
assert.ok(indice.registros.find(r=>r.id_talento===recuperacion.id).fragmentos
  .some(x=>x.tipo==='gasto_recurso'));
const sacrificio=indice.registros.find(r=>
  r.propietario==='Guerrero'&&r.nombre==='Sacrificio de escudo');
assert.ok(sacrificio.fragmentos.some(x=>x.tipo==='excepcion'&&
  x.fragmento_literal.includes('Durabilidad')));
for(const p of ['Semielfo','Semiorco']){
  assert.equal(indice.registros.filter(r=>
    r.propietario===p&&r.nombre.startsWith('Herencia dual')).length,1);
}
// No se añade este fichero a la web ni al paquete de distribución.
const paquete=fs.readFileSync(path.join(root,'scripts/crear-paquete-drs.js'),'utf8');
assert.ok(!paquete.includes('110a-propiedades-literales-drs.json'),
  'El índice no aprobado nunca debe entrar en la distribución pública');
console.log('OK · 24 Talentos DRS, 79 citas literales, 24 categorías, 0 reglas inferidas.');
