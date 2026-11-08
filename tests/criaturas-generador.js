'use strict';
/* Reglas de procedencia y determinismo del generador de adversarios. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const modelo=require('../assets/creatures.js');
const componentes=require('../assets/creatures-components.js');
const motor=require('../assets/creatures-random.js');
const leer=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'../data',n),'utf8'));
const drs=leer('adversarios-drs.json');
const fuente={info:{id:'drs',titulo:'Naufragio d20 - Épica',origen:'DRS'},
  registros:drs.registros};
const catalogo=componentes.crearCatalogo([fuente],{ataques:[],talentos:[]},
  leer('adversarios-relaciones-drs.json'),[],leer('adversarios-talentos-indice-drs.json'));
const antes=JSON.stringify(drs);
const originales=new Map(drs.registros.map(r=>['drs|'+r.id,r.ficha]));
const cfg={nivelMin:12,nivelMax:12,categorias:['Dragón'],modo:'libre',
  acciones:6,talentos:6,conector:'o',semilla:'dragon-robot-12'};
const generado=motor.generar(catalogo,[fuente],[],cfg);
assert.deepEqual(generado,motor.generar(catalogo,[fuente],[],cfg),
  'La misma semilla y el mismo catálogo producen un JSON idéntico.');
assert.equal(generado.ficha.categoria,'Dragón');
assert.equal(generado.ficha.puntuaciones.nivel,12);
assert.equal(generado.ficha.puntuaciones.salud,48,
  'Solo se aplica la media DRS, no un escalado de acciones.');
assert.equal(generado.ficha.saludModo,'automatico');
assert.equal(generado.ficha.saludAjuste,0);
for(const clave of ['blindaje','movimiento','tamano'])
  assert.equal(generado.ficha.puntuaciones[clave],null,
    'No inventar la puntuación '+clave);
assert.equal(modelo.revisar(generado.ficha,{paraExportar:true}).valida,true);
assert.equal(generado.ficha.ataques.length,6);
assert.equal(generado.ficha.talentos.length,6);
assert.equal(new Set(generado.componentes.ataques).size,6);
assert.equal(new Set(generado.componentes.talentos).size,6);
for(let i=0;i<6;i++){
  const ata=generado.ficha.ataques[i],original=catalogo.obtener(ata.catalogoId);
  assert.ok(original,'Acción de la biblioteca original');
  assert.equal(ata.danoLiteral,original.dato.danoLiteral);
  assert.equal(ata.danoNumerico,original.dato.danoNumerico);
  assert.equal(ata.cantidad,original.dato.cantidad);
  assert.equal(ata.segmentoOriginal,original.dato.segmentoOriginal);
  assert.equal(ata.fuenteId,original.fuenteId);
  assert.equal(ata.conectorAnterior,i===0?'Inicio':'o');
  assert.equal(ata.id,'ataque-generado-'+(i+1));
}
for(const talento of generado.ficha.talentos){
  const original=catalogo.obtener(talento.catalogoId);
  assert.ok(original);
  assert.equal(talento.descripcion,original.dato.descripcion);
  assert.equal(talento.textoOriginal,original.dato.textoOriginal);
  assert.equal(talento.referencia,original.dato.referencia);
}
assert.ok(generado.componentes.ataques.some(id=>{
  const e=catalogo.obtener(id);
  return originales.get(e.fuenteId+'|'+e.criaturaId).categoria!=='Dragón';
}), 'La mezcla libre cruza categorías de forma efectiva.');
assert.match(generado.ficha.notas,/semilla: dragon-robot-12/);
assert.equal(JSON.stringify(drs),antes,'Ninguna ficha DRS se modifica.');
const opcionesRestringidas={...cfg,modo:'restringido',acciones:1,talentos:1,conector:'y'};
const restringido=motor.generar(catalogo,[fuente],[],opcionesRestringidas);
for(const tipo of ['ataques','talentos']){
  for(const id of restringido.componentes[tipo]){
    const entrada=catalogo.obtener(id);
    assert.equal(originales.get(entrada.fuenteId+'|'+entrada.criaturaId).categoria,
      'Dragón','Modo restringido: misma categoría de origen.');
  }
}
const automata=motor.generar(catalogo,[fuente],[],{...cfg,categorias:['Autómata'],
  acciones:1,talentos:0});
assert.equal(automata.ficha.puntuaciones.moral,null,
  'Autómata sin Moral: no extrapolar de otra criatura.');
const muerto=motor.generar(catalogo,[fuente],[],{...cfg,categorias:['Muerto viviente'],
  acciones:1,talentos:0});
assert.equal(muerto.ficha.puntuaciones.moral,null);
const rango=motor.generar(catalogo,[fuente],[],{...cfg,nivelMin:1,nivelMax:100});
assert.ok(rango.ficha.puntuaciones.nivel>=1&&rango.ficha.puntuaciones.nivel<=100);
assert.equal(rango.ficha.puntuaciones.salud,
  modelo.saludMedia(rango.ficha.puntuaciones.nivel,0));
for(const entradas of [
  {...cfg,nivelMin:13,nivelMax:12},
  {...cfg,nivelMin:-1},
  {...cfg,nivelMax:101},
  {...cfg,categorias:[]},
  {...cfg,categorias:['Dinosaurio']},
  {...cfg,categorias:['Dragón','Dragón']},
  {...cfg,modo:'inventado'},
  {...cfg,acciones:9},
  {...cfg,acciones:0,talentos:0},
  {...cfg,conector:','},
  {...cfg,semilla:''}
])assert.throws(()=>motor.generar(catalogo,[fuente],[],entradas));
assert.throws(()=>motor.generar(catalogo,[fuente],[],{
  ...cfg,modo:'restringido',categorias:['Dragón'],acciones:8,talentos:8
}),/suficientes Acciones y Talentos/);
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'../assets/creatures-ui.js'),'utf8');
for(const id of ['criaturas-generar-panel','criaturas-generar-dialogo',
  'criaturas-generar-min','criaturas-generar-max','criaturas-generar-modo',
  'criaturas-generar-conector','criaturas-generar-acciones',
  'criaturas-generar-talentos','criaturas-generar-semilla',
  'criaturas-generar-categorias','criaturas-generar-ejecutar']){
  assert.ok(html.includes('id="'+id+'"'),'Interfaz accesible: '+id);
}
assert.match(ui,/asegurarBibliotecaComponentes\(\)/);
assert.match(ui,/renderizarFicha\(resultado\.ficha,null\)/);
assert.match(ui,/cambios=true;/);
assert.doesNotMatch(ui,/Math\.random/);
console.log('OK · generación aleatoria con semilla, procedencia, categorías y límites.');
