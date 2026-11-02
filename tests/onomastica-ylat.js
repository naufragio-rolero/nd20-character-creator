'use strict';
/* Integridad onomástica y ponderación de variantes. node tests/onomastica-ylat.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.join(__dirname,'..');
const leer=ruta=>JSON.parse(fs.readFileSync(path.join(raiz,'data',ruta),'utf8'));
const sexo=require('../assets/sex.js');
const reglas=require('../assets/rules.js');
const archivo=leer('onomastica-ylat.json');
const tesauro=leer('tesauro-ylat.json');

assert.equal(archivo.total_formas,297,'Índice documental íntegro');
assert.equal(archivo.entradas.length,297,'No truncar el índice');
assert.equal(new Set(archivo.entradas.map(e=>e.nombre.toLocaleLowerCase('es'))).size,297,
  'No duplicar formas literales');
assert.ok(archivo.entradas.every(e=>e.id&&e.nombre&&e.clase&&
  Array.isArray(e.fuentes)&&e.fuentes.length),'Cada denominación tiene origen');
assert.ok(!/niguac|niguaz/i.test(archivo.entradas.map(e=>e.nombre).join('\n')),
  'No reintroducir corpus excluido');

const canon=Object.fromEntries(archivo.canon_por_autoria.map(e=>[e.id,e]));
assert.equal(archivo.canon_por_autoria.length,10,'Diez decisiones de grafía e identidad');
assert.equal(canon['ONO-01'].preferida,'Aerandil del Atardecer Brillante');
assert.equal(canon['ONO-03'].preferida,'Vrymmir Borgernstâg');
assert.equal(canon['ONO-08'].preferida,"Car'rt Oq'uatee");
assert.equal(canon['ONO-09'].preferida,'Eomdyn Noreesh');
assert.equal(canon['ONO-10'].preferida,'Leezar Lockbruck');
assert.equal(canon['ONO-11'].preferida,'Alim de Mostáganem');
assert.equal(canon['ONO-12'].preferida,'Janus II Achgate');
assert.equal(canon['ONO-14'].preferida,'Narga Solarys');
const paternidad=archivo.relaciones_canonicas.find(x=>x.id==='ONO-02');
assert.deepEqual([paternidad.sujeto,paternidad.relacion,paternidad.objeto],
  ['Tuliëlle','padre','Dyeld']);
const hermanos=archivo.relaciones_canonicas.find(x=>x.id==='ONO-10');
assert.deepEqual([hermanos.sujeto,hermanos.relacion,hermanos.objeto],
  ['Leezar Lockbruck','hermano','Thingrim Lockbruck']);
assert.match(archivo.politica_generacion['ONO-05'],/mezclar/i);
assert.match(archivo.politica_generacion['ONO-06'],/no usarla/i);
assert.match(archivo.politica_generacion['ONO-13'],/Pietro/);

const documentados=tesauro.entradas.filter(x=>x.tipo==='documentado');
const combinados=tesauro.entradas.filter(x=>x.tipo==='combinado');
assert.equal(documentados.length,19,'Conservar documental actual');
assert.equal(combinados.length,33,'Conservar las combinaciones de Isla Tormenta');
assert.ok(documentados.some(x=>x.nombre==='Máthair Felsaer'));
assert.ok(documentados.some(x=>x.nombre==='Pietro'));
const casas=new Set(['Boll','Shadelgast']);
for(const e of combinados){
  const nobiliario=casas.has(e.semillas?.[1]);
  assert.equal(e.peso_relativo,nobiliario?1:100,
    'Peso editorial explícito y trazable: '+e.nombre);
}
assert.equal(combinados.filter(e=>e.peso_relativo===1).length,7);
assert.equal(combinados.reduce((a,e)=>a+e.peso_relativo,0),2607);

// Un sorteo ponderado consume exactamente un número aleatorio, y no
// descompone nombres completos ni añade un apellido nuevo.
const pareja=[{nombre:'Test noble',peso_relativo:1},{nombre:'Test común',peso_relativo:100}];
let llamadas=0;
assert.equal(sexo.elegirPonderado(pareja,()=>{llamadas++;return 0;}).nombre,'Test noble');
assert.equal(llamadas,1,'El RNG compartido no recibe extracciones nuevas');
assert.equal(sexo.elegirPonderado(pareja,()=>0.5).nombre,'Test común');
assert.equal(sexo.elegirPonderado(pareja,()=>0.999).nombre,'Test común');
assert.equal(sexo.elegirPonderado([],()=>0),null);
assert.equal(sexo.elegirPonderado([{nombre:'Sin peso'}],()=>0).nombre,'Sin peso');
assert.equal(sexo.elegirPonderado([{nombre:'Invalido',peso_relativo:-12}],()=>0).nombre,'Invalido');
// La selección con catálogo de sexo también debe respetar el peso.
const sexDatos={nombres_generales_masculinos:[],nombres_generales_femeninos:[]};
const resultado=sexo.elegirNombre({juego:'nd20',modoNombre:'combinado'},
  'Humano común',[],pareja,'masculino',sexDatos,()=>0.5);
assert.equal(resultado.nombre,'Test común');

// Reproducibilidad con el catálogo real y los dos caminos de selección.
const juego={especies:leer('especies.json'),ocupaciones:leer('ocupaciones.json')};
const base={juego:'nd20',especie:'Humano común',ocupacion:'Guerrero',nivel:1,
  modoNombre:'combinado',tesauroYlat:tesauro,aplazarElecciones:true};
const conSexo={...base,catalogoSexo:leer('sexo-personajes.json'),sexo:'masculino'};
for(const cfg of [base,conSexo]){
  const a=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla('onomastica-combinada'));
  const b=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla('onomastica-combinada'));
  assert.deepEqual(a,b,'Reproducibilidad de ficha bajo ponderación');
  assert.ok(combinados.some(e=>e.nombre===a.nombre),
    'Nombre seleccionado debe proceder de una variante documental');
}
const manual=reglas.crearNd20(juego,{...conSexo,nombre:'Mi nombre elegido'},
  reglas.aleatorioSemilla('onomastica-manual'));
assert.equal(manual.nombre,'Mi nombre elegido','No alterar el nombre manual');

console.log('OK · índice onomástico Ylat (297), canon 14 ONO y pesos 1:100.');
