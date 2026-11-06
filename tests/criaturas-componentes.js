'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const modelo=require('../assets/creatures.js');
const componentes=require('../assets/creatures-components.js');
const bibliotecaApi=require('../assets/creatures-library.js');
const leer=(ruta)=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',ruta),'utf8'));
const drs=leer('data/adversarios-drs.json'),matriz=leer('data/adversarios-relaciones-drs.json');
const indice=leer('data/adversarios-talentos-indice-drs.json');
const info=leer('data/adversarios-fuentes.json').fuentes[0];
const fuentes=[{info,registros:drs.registros}];
assert.equal(drs.registros.length,106);
const c=componentes.crearCatalogo(fuentes,{ataques:[],talentos:[]},matriz,[],indice);
assert.deepEqual(c.resumen(),{ataques:182,talentos:188,relaciones:77});
assert.equal(matriz.relaciones.length,77);
assert.equal(indice.registros.length,188);
assert.equal(new Set(indice.registros.map(r=>r.talentoId+'|'+r.criaturaId)).size,188);
const metaGuiverna=c.obtener('drs:guiverna_manto_azur:talento:veneno');
assert.equal(metaGuiverna.talentoFuenteId,'veneno_184');
assert.equal(metaGuiverna.categoriaEditorial,'Reacción');
assert.ok(c.filtrar('talentos',{categoriaEditorial:'Reacción'})
  .some(r=>r.id===metaGuiverna.id));
assert.equal(c.filtrar('talentos',{texto:'veneno_184'}).some(r=>r.id===metaGuiverna.id),true);
assert.equal(c.obtener('drs:tentacion_alada:talento:demonio').talentoFuenteId,'demonio_199');
assert.equal(c.obtener('drs:hidra_tornasolada:talento:encefalofisura').talentoFuenteId,'encefalofisura_201');
assert.ok(matriz.relaciones.every(r=>r.talentoFuenteId&&
  indice.registros.some(t=>t.criaturaId===r.criaturaId&&t.talentoId===r.talentoFuenteId)));
assert.throws(()=>componentes.crearCatalogo(fuentes,{ataques:[],talentos:[]},matriz,[],
  {...indice,registros:indice.registros.filter(t=>t.criaturaId!=='guiverna_manto_azur')}),
  /sin correspondencia editorial/);
assert.throws(()=>componentes.crearCatalogo(fuentes,{ataques:[],talentos:[]},
  {...matriz,relaciones:matriz.relaciones.map((r,i)=>i===0?
    {...r,talentoFuenteId:'variante_incorrecta'}:r)},[],indice),
  /no apunta al ID de Talento verificado/);
assert.equal(c.listar('ataques').length,182);
assert.equal(c.listar('talentos').length,188);
assert.ok(c.filtrar('talentos',{texto:'resistencia'}).length>0,
  'Búsqueda descriptiva, no solo por nombre');
assert.ok(c.filtrar('ataques',{texto:'dardos venenosos'}).length>0);
assert.equal(c.filtrar('ataques',{origen:'Personal'}).length,0);
assert.equal(c.filtrar('talentos',{soloRelacionados:true}).length>0,true);
const guiverna=drs.registros.find(r=>r.id==='guiverna_manto_azur');
const dardos=c.obtener('drs:atk_guiverna_manto_azur_02');
assert.equal(dardos.dato.danoLiteral,'18');
assert.equal(dardos.dato.cantidad,1);
assert.equal(dardos.dato.conectorAnterior,'o');
assert.deepEqual(c.relacionados(dardos.id).map(x=>x.dato.nombre).sort(),
  ['Dardos venenosos','Veneno']);
const veneno=c.obtener('drs:guiverna_manto_azur:talento:veneno');
assert.ok(c.relacionados(veneno.id).some(x=>x.id===dardos.id),
  'La relación funciona en sentido inverso por ID');
assert.equal(c.preparar(dardos,false).conectorAnterior,'o',
  'El ataque alternativo conserva su conector documentado cuando no es primero');
assert.equal(c.preparar(dardos,true).conectorAnterior,'Inicio',
  'El primer ataque del borrador siempre inicia la expresión');
assert.equal(c.preparar(dardos,false).danoLiteral,'18');
const dardosFicha=c.preparar(dardos,false);
const venenoFicha=c.preparar(veneno,false);
assert.equal(dardosFicha.catalogoId,dardos.id);
assert.equal(dardosFicha.fuenteId,'drs');
assert.equal(venenoFicha.textoOriginal,
  guiverna.ficha.talentos.find(x=>x.nombre==='Veneno').textoOriginal);
assert.ok(c.yaExiste(dardos,[dardosFicha]));
assert.ok(c.yaExiste(veneno,[venenoFicha]));
assert.ok(c.yaExiste(dardos,[modelo.ataque({
  ...dardos.dato,conectorAnterior:'Inicio',id:'ataque-legacy'})]),
  'Las fichas antiguas sin identificador de catálogo evitan duplicados exactos');
assert.equal(c.yaExiste(dardos,[modelo.ataque({
  ...dardos.dato,danoLiteral:'999',danoNumerico:999})]),false,
  'No confundir modificaciones de daño con el componente oficial');
const enredadera=c.obtener('drs:enredadera_sangrienta:talento:agarre');
assert.equal(c.relacionados(enredadera.id).length,2,
  'Un mismo Talento puede documentar varios ataques: no asociar automáticamente todos');
assert.deepEqual(c.relacionados(enredadera.id).map(x=>x.dato.nombre).sort(),
  ['agarre','latigazo']);
const sinRelacion=c.listar('ataques').find(x=>c.relacionados(x.id).length===0);
assert.deepEqual(c.relacionados(sinRelacion.id),[],'No inventar relaciones ausentes');
const roto=JSON.parse(JSON.stringify(matriz));
roto.relaciones[0].evidencia.valor='NO CONSTA EN DRS';
assert.throws(()=>componentes.crearCatalogo(fuentes,{ataques:[],talentos:[]},roto),
  /Evidencia de relación desactualizada/,'Bloquear matrices sin respaldo documental');
const otraFuente={info:{id:'otra',titulo:'Fuente de prueba',origen:'Otra'},
  registros:[{id:'serpiente_venenosa',nombre:'Serpiente de prueba',
    ficha:drs.registros.find(x=>x.id==='serpiente_venenosa').ficha}]};
const futuro=componentes.crearCatalogo(fuentes.concat([otraFuente]),
  {ataques:[],talentos:[]},matriz);
assert.ok(futuro.obtener('otra:atk_serpiente_venenosa_01'));
assert.ok(futuro.obtener('drs:atk_serpiente_venenosa_01'));
assert.notEqual(futuro.obtener('otra:atk_serpiente_venenosa_01').id,
  futuro.obtener('drs:atk_serpiente_venenosa_01').id,
  'Homónimos de distintas fuentes no son la misma identidad');
const personal=modelo.nuevaCriatura({nombre:'Criatura particular',
  ataques:[{nombre:'mordisco',danoLiteral:'11',danoNumerico:11}],
  talentos:[{nombre:'Veneno',descripcion:'Efecto definido por el Cronista'}]});
const mix=componentes.crearCatalogo(fuentes,
  {ataques:[{nombre:'mordisco',danoLiteral:'7',danoNumerico:7}],
   talentos:[{nombre:'Veneno',descripcion:'Efecto personal'}]},matriz,
  [{id:'criatura-9',ficha:personal}]);
assert.equal(mix.resumen().ataques,184);
assert.equal(mix.resumen().talentos,190);
assert.equal(mix.relacionados(mix.listar('ataques').find(x=>!x.oficial).id).length,0);
assert.ok(mix.filtrar('ataques',{fuenteId:'personal'}).length===2);
assert.ok(mix.filtrar('talentos',{origen:'Personal',texto:'cronista'}).length===1);
const almacen=new Map();
const local={getItem:k=>almacen.has(k)?almacen.get(k):null,
  setItem:(k,v)=>almacen.set(k,v),removeItem:k=>almacen.delete(k)};
const biblioteca=bibliotecaApi.crearBiblioteca(local);
const ficha=modelo.nuevaCriatura({nombre:'Editor con componentes DRS',
  categoria:'Dragón',descripcion:'Ficha personal.',
  ataques:[{...c.preparar(dardos,true),id:'ataque-ui-1'}],
  talentos:[c.preparar(veneno,false)]});
const id=biblioteca.guardar(ficha);
const exportada=biblioteca.exportarJson(id);
const recuperadas=biblioteca.importarJson(exportada);
assert.equal(recuperadas.length,1);
const vuelta=biblioteca.obtener(recuperadas[0]);
assert.deepEqual(vuelta.ataques,ficha.ataques);
assert.deepEqual(vuelta.talentos,ficha.talentos);
const anterior=modelo.nuevaCriatura({nombre:'Ficha JSON anterior'});
delete anterior.saludModo;delete anterior.saludAjuste;
assert.equal(modelo.revisar(anterior,{paraExportar:true}).valida,true);
assert.deepEqual(biblioteca.importarJson(JSON.stringify(anterior)).length,1);
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const ui=fs.readFileSync(path.join(__dirname,'..','assets/creatures-ui.js'),'utf8');
for(const idHtml of ['criaturas-componentes-dialogo','criaturas-componentes-busqueda',
  'criaturas-explorar-ataques','criaturas-explorar-talentos',
  'criaturas-componentes-tab-ataques','criaturas-componentes-tab-talentos',
  'criaturas-componentes-solo-relacionados','criaturas-componentes-vinculos']){
  assert.ok(html.includes('id="'+idHtml+'"'),'Control accesible: '+idHtml);
}
assert.match(ui,/mostrarRelacionesComponente/);
assert.match(ui,/incorporarComponente/);
assert.match(ui,/bibliotecaComponentes\.yaExiste/);
assert.match(ui,/bibliotecaComponentes\.relacionados/);
assert.match(ui,/delete fila\.dataset\.catalogoId/);
assert.doesNotMatch(ui,/Math\.random/);
console.log('OK · Componentes DRS y personales: 182 Ataques, 188 Talentos, 77 relaciones, JSON v1.');
