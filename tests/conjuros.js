'use strict';
/* Pruebas de integración informativa del Tomo. No evalúan resultados de combate. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.join(__dirname,'..');
const leer=(p)=>JSON.parse(fs.readFileSync(path.join(raiz,p),'utf8'));
const indice=leer('docs/enciclopedia/70a-indice-conjuros-434.json');
const cambios=leer('docs/enciclopedia/78a-correcciones-geometria-conjuros-10.json');
const catalogo=leer('data/catalogo-poderes.json');
const fuentes=Array.from({length:18},(_,i)=>{
  const ini=String(i*25+1).padStart(3,'0');
  const fin=String(Math.min(434,(i+1)*25)).padStart(3,'0');
  return leer('docs/enciclopedia/69'+ 'abcdefghijklmnopqr'[i]+
    '-conjuros-alfabeticos-'+ini+'-'+fin+'.json');
}).flatMap(x=>x.registros);
const revisados=[
  ...leer('data/conjuros-revisados-001-225.json').conjuros,
  ...leer('data/conjuros-revisados-226-434.json').conjuros
];
const porCambio=new Map(cambios.registros.map(x=>[x.numero_tomo,x]));
assert.equal(fuentes.length,434,'434 fuentes originales');
assert.equal(indice.registros.length,434,'434 entradas de índice');
assert.equal(revisados.length,434,'434 textos publicados');
assert.equal(porCambio.size,10,'10 decisiones editoriales aprobadas');
let correcciones=0;
const ids=new Map(catalogo.conjuros.map(x=>[x.id,x]));
for(let i=0;i<434;i++){
  const original=fuentes[i],editado=revisados[i],meta=indice.registros[i],n=i+1;
  assert.equal(original.numero_tomo,n,'ordinal original');
  assert.equal(editado.numero_tomo,n,'ordinal publicado');
  assert.equal(editado.nombre_tomo,original.nombre_literal,'nombre de origen '+n);
  assert.equal(editado.circulo_tomo,meta.circulo_tomo,'círculo fuente '+n);
  assert.equal(editado.escuela_tomo,meta.escuela_literal,'escuela fuente '+n);
  assert.equal(editado.alcance,meta.alcance_literal,'alcance fuente '+n);
  assert.equal(editado.duracion,meta.duracion_literal,'duración fuente '+n);
  assert.equal(editado.lanzamiento,meta.lanzamiento_literal,'lanzamiento fuente '+n);
  assert.equal(editado.requisito,meta.requisito_literal,'requisito fuente '+n);
  assert.ok(ids.has(editado.id_catalogo),'conexión al catálogo en '+n);
  assert.ok(meta.identidades_posibles_catalogo.some(x=>x.id===editado.id_catalogo),
    'identidad de origen no inventada '+n);
  const correccion=porCambio.get(n);
  const esperado=original.parrafos_literal.slice();
  if(correccion){
    assert.equal(esperado[correccion.parrafo_editado],correccion.texto_original,
      'texto a corregir cotejado '+n);
    esperado[correccion.parrafo_editado]=correccion.texto_corregido;
    assert.equal(editado.estado_redaccion,'correccion_editorial_aprobada');
    correcciones++;
  }else{
    assert.equal(editado.estado_redaccion,'literal_cotejado');
  }
  assert.deepEqual(editado.parrafos,esperado,'ningún cambio no autorizado en '+n);
}
assert.equal(correcciones,10);
assert.equal(new Set(revisados.map(x=>x.id_catalogo)).size,433,
  'Arma elemental está duplicada literalmente en el Tomo');
assert.equal(revisados[25].id_catalogo,revisados[28].id_catalogo);
assert.deepEqual(revisados[25].parrafos,revisados[28].parrafos);
assert.equal(revisados[187].id_catalogo,'conjuro-46',
  'Ira celestial documentada solo para Círculo 5');
assert.equal(revisados[172].id_catalogo,'conjuro-292',
  'Glosolalia mayor del Tomo corresponde a la variante † del catálogo');

const tooltip=require('../assets/tooltips.js');
const glosario=tooltip.indice({catalogo,conjurosRevisados:revisados});
const buscar=(nombre)=>tooltip.buscar(glosario,nombre,'poder','nd20');
const cupula=buscar('[C] Cúpula antimagia (C6) · Nd20');
assert.ok(cupula.descripcion.includes('superficie circular de 3 m²'));
assert.ok(!cupula.descripcion.includes('radio de 3m2'));
assert.ok(cupula.datos.some(x=>x[0]==='Redacción'&&x[1].includes('aprobada')));
assert.ok(cupula.datos.some(x=>x[0]==='Automatización'&&x[1].includes('no automatizado')));
assert.ok(buscar('[C] Tromba de meteoritos (C8) · Nd20').descripcion
  .includes('superficie circular de 20 m²'));
assert.ok(buscar('[C] Glosolalia mayor † (C5) · Grimorio de Tuliëlle').descripcion.length>40);
const iraC5=buscar('[C] Ira celestial (C5) · Nd20');
const iraC3=buscar('[C] Ira celestial (C3) · Nd20');
assert.ok(iraC5.descripcion.includes('4d12'),'Círculo 5 usa la ficha del Tomo');
assert.ok(!iraC3.descripcion.includes('4d12'),'Círculo 3 no recibe reglas ajenas');
assert.ok(iraC3.datos.some(x=>x[0]==='Círculo'&&x[1]==='3'));
assert.ok(iraC5.datos.some(x=>x[0]==='Círculo'&&x[1]==='5'));
assert.ok(buscar('[C] Mano de mago (C1) · Nd20').descripcion.length>50);
console.log('OK · 434 fichas de Conjuros cotejadas; 10 correcciones y fichas emergentes verificadas.');
