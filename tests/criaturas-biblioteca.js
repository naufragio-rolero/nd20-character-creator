'use strict';
const assert = require('node:assert/strict');
const modelo = require('../assets/creatures.js');
const api = require('../assets/creatures-library.js');
const mapa = new Map();
const storage = {getItem:k=>mapa.has(k)?mapa.get(k):null,
 setItem:(k,v)=>mapa.set(k,v), removeItem:k=>mapa.delete(k)};
const biblioteca = api.crearBiblioteca(storage);
assert.deepEqual(biblioteca.listar(),[]);
const ficha = modelo.nuevaCriatura({nombre:'Criatura propia',
  puntuaciones:{nivel:3,salud:17},
  ataques:[{nombre:'garra',danoLiteral:'4',danoNumerico:4}],
  talentos:[{nombre:'Rugido',descripcion:'Efecto documentado.',textoOriginal:'Rugido: ...'}],
  origen:{tipo:'texto_pegado',textoOriginal:'Texto original\níntegro'}});
const id = biblioteca.guardar(ficha);
assert.equal(id,'criatura-1');
assert.equal(biblioteca.listar().length,1);
assert.equal(biblioteca.listar()[0].ataques,1);
const cambio=biblioteca.obtener(id);
cambio.nombre='Renombrada';
assert.equal(biblioteca.obtener(id).nombre,'Criatura propia');
assert.equal(biblioteca.guardar(cambio,id),id);
assert.equal(biblioteca.obtener(id).nombre,'Renombrada');
assert.throws(()=>biblioteca.guardar(cambio,'criatura-inexistente'),/ya no existe/);
assert.throws(()=>biblioteca.guardar(modelo.nuevaCriatura()),/necesita un nombre/);
const json = biblioteca.exportarJson();
assert.equal(JSON.parse(json).tipo,api.TIPO);
assert.equal(JSON.parse(biblioteca.exportarJson(id)).origen.textoOriginal,
  'Texto original\níntegro');
const nuevos=biblioteca.importarJson(json);
assert.deepEqual(nuevos,['criatura-2']);
assert.equal(biblioteca.listar().length,2);
assert.deepEqual(biblioteca.importarJson(biblioteca.exportarJson(id)),['criatura-3']);
assert.equal(biblioteca.listar().length,3);
assert.equal(biblioteca.eliminar('ausente'),false);
assert.equal(biblioteca.eliminar(id),true);
assert.equal(biblioteca.obtener(id),null);
const antes=biblioteca.exportarJson();
assert.throws(()=>biblioteca.importarJson('{desconocido'),/JSON válido/);
assert.throws(()=>biblioteca.importarJson('{"version":2,"tipo":"criatura_usuario"}'),
  /criatura no es válida/);
const mal=JSON.parse(antes);
mal.criaturas.push({id:'criatura-99',ficha:modelo.nuevaCriatura()});
assert.throws(()=>biblioteca.importarJson(JSON.stringify(mal)),/necesita un nombre/);
assert.equal(biblioteca.exportarJson(),antes);
const metadatosNoRepresentados=JSON.parse(antes);
metadatosNoRepresentados.origenExterno='sin soporte';
assert.throws(()=>biblioteca.importarJson(JSON.stringify(metadatosNoRepresentados)),
  /Campo JSON desconocido en biblioteca/);
delete metadatosNoRepresentados.origenExterno;
metadatosNoRepresentados.criaturas[0].metadatos='no descartar';
assert.throws(()=>biblioteca.importarJson(JSON.stringify(metadatosNoRepresentados)),
  /Campo JSON desconocido en registro/);
delete metadatosNoRepresentados.criaturas[0].metadatos;
metadatosNoRepresentados.catalogoPersonalizado.departamento='ajeno';
assert.throws(()=>biblioteca.importarJson(JSON.stringify(metadatosNoRepresentados)),
  /Campo JSON desconocido en catálogo/);
assert.equal(biblioteca.exportarJson(),antes,'Ninguna importación incompatible modifica la colección');
const futura=modelo.nuevaCriatura({nombre:'Ficha con datos adicionales'});
futura.desconocido={texto:'no descartar'};
assert.throws(()=>biblioteca.importarJson(JSON.stringify(futura)),/Campo JSON desconocido/);
assert.equal(biblioteca.exportarJson(),antes);
const cuotas=api.crearBiblioteca({getItem:()=>null,
  setItem:()=>{throw Error('QuotaExceededError');},removeItem:()=>{}});
assert.throws(()=>cuotas.guardar(ficha),/No se pudo guardar/);
assert.deepEqual(cuotas.listar(),[]);
assert.deepEqual(biblioteca.importarJson(biblioteca.exportarJson('criatura-2'),
  {reemplazar:true}),['criatura-1']);
assert.equal(biblioteca.listar().length,1);
assert.throws(()=>api.crearBiblioteca({}),/almacenamiento local/);
mapa.set(api.CLAVE,'{texto corrupto}');
assert.throws(()=>biblioteca.listar(),/dañada/);
assert.equal(mapa.get(api.CLAVE),'{texto corrupto}');
console.log('OK · Biblioteca Nd20: CRUD, JSON y persistencia sin pérdida.');
