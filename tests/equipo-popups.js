'use strict';
/* Consulta informativa de Equipo DRS, recuerdos y catálogos mágicos NO publicados.
 * No se ejecutan Tiradas ni se modifica el inventario. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const index=require('../assets/tooltips.js');
const base=path.join(__dirname,'..');
function leer(ruta){return JSON.parse(fs.readFileSync(path.join(base,ruta),'utf8'));}
const equipo=leer('data/equipo-inicial.json');
const especies=leer('data/especies.json');
const ocupaciones=leer('data/ocupaciones.json');
const consultaDRS=leer('data/equipo-consulta-drs.json');
const fuentes={fantasia:{especies,ocupaciones},equipo,
  equipoConsultaDRS:consultaDRS};
const glosario=index.indice(fuentes);
function ficha(nombre){return index.buscar(glosario,nombre,'equipo','nd20');}
const clases=[
  ['armas','arma'],['armaduras','proteccion'],['escudos','escudo'],
  ['municion','municion'],['varitas_defensa','arma']
];
for(const [tabla,clase] of clases){
  for(const item of equipo[tabla]){
    const f=ficha(item.nombre);
    assert.ok(f,'Sin ficha de catálogo DRS: '+item.nombre);
    assert.equal(f.clase_equipo,clase);
    const vista=index.presentarEquipo(f,item.nombre);
    assert.equal(vista.origen,'Naufragio d20 DRS');
    assert.match(vista.fuente,/NaufragioD20DRS\.docx/);
    if(item.precio!==undefined)
      assert.ok(vista.primarios.some(([k,v])=>k==='Precio'&&v===item.precio+' mo'));
    for(const [clave,etiqueta] of Object.entries({
      dano:'Daño',penetracion:'Penetración',durabilidad:'Durabilidad',
      blindaje:'Blindaje',alcance:'Alcance'})){
      if(item[clave]!==undefined&&item[clave]!==null&&item[clave]!=='' )
        assert.ok(vista.primarios.some(([k,v])=>k===etiqueta&&v===String(item[clave])),
          item.nombre+': '+etiqueta+' exacto');
    }
    if(!item.requisito)
      assert.ok(!vista.primarios.some(([k])=>k==='Requisito'),
        'No deducir competencia/requisito del arma '+item.nombre);
  }
}
const utilidades=Object.values(equipo.utiles_fantasia).flat();
assert.equal(utilidades.length,41);
for(const u of utilidades.concat(equipo.focos_conjuros_con_precio)){
  const f=index.buscarPorId(glosario,u.id,'equipo','nd20');
  assert.ok(f,'Útil con identificador DRS: '+u.id);
  assert.equal(f.descripcion,u.detalle,'Conservar el detalle documentado de '+u.nombre);
  assert.equal(index.presentarEquipo(f).fuente.includes('NaufragioD20DRS.docx'),true);
}
// Tablas 21 y 25 del DRS, no incorporadas al catálogo de compras.
assert.deepEqual(consultaDRS.tablas.map(t=>t.registros.length),[4,6,4,8]);
for(const tabla of consultaDRS.tablas){
  for(const objeto of tabla.registros){
    const f=ficha(objeto.nombre);
    assert.ok(f,'Ficha DRS suplementaria: '+objeto.nombre);
    assert.equal(f.descripcion,objeto.detalle_literal,
      'Texto sin resúmenes ni invenciones: '+objeto.nombre);
    const vista=index.presentarEquipo(f);
    assert.deepEqual(vista.primarios.find(([k])=>k==='Precio'),
      ['Precio',objeto.precio_literal]);
    assert.ok(vista.fuente.includes('Tabla '+tabla.tabla_word));
    if(objeto.du)assert.ok(vista.primarios.some(([k,v])=>
      k==='Dado de Uso'&&v==='DU '+objeto.du));
  }
}
// Fuentes adicionales DRS: monturas/animales (movimiento propio), enseres
// para monturas (incluye precio variable literal) y transportes.
for(const [clave,clase,cantidad] of [
  ['monturas','montura',6],
  ['equipo_para_monturas','equipo_montura',5],
  ['transportes','transporte',4]
]){
  const seccion=consultaDRS[clave];
  assert.equal(seccion.registros.length,cantidad);
  for(const x of seccion.registros){
    const encontrada=ficha(x.nombre);
    assert.ok(encontrada,'Ficha DRS no indexada: '+x.nombre);
    assert.equal(encontrada.clase_equipo,clase);
    assert.equal(encontrada.descripcion,x.detalle_literal||'');
    const vista=index.presentarEquipo(encontrada,x.nombre);
    assert.match(vista.fuente,new RegExp('Tabla '+seccion.tabla_word));
    if(x.precio_literal!=='*'){
      assert.deepEqual(vista.primarios.find(([k])=>k==='Precio'),
        ['Precio',x.precio_literal]);
    }else{
      assert.equal(vista.primarios.some(([k])=>k==='Precio'),false);
      assert.deepEqual(vista.primarios.find(([k])=>k==='Precio variable'),
        ['Precio variable',x.precio_variable_literal]);
      assert.ok(vista.tecnicos.some(([k,v])=>k==='Precio en tabla DRS'&&v==='*'));
    }
    if(x.movimiento)
      assert.deepEqual(vista.primarios.find(([k])=>k==='Movimiento'),
        ['Movimiento',x.movimiento]);
    assert.ok(vista.primarios.every(([k])=>k!=='Competencia'));
  }
}
// Aclaración autoral 01/11: Armadura equina cuesta la base humana DRS ×4.
const equinaFuente=consultaDRS.equipo_para_monturas.registros.find(x=>
  x.nombre==='Armadura equina');
assert.equal(equinaFuente.precio_literal,'*','Preservar asterisco del DRS');
assert.equal(equinaFuente.precio_variable_literal,'Precio x4');
assert.equal(equinaFuente.regla_precio_autoral.estado,'aprobacion_autoral');
assert.equal(equinaFuente.regla_precio_autoral.multiplicador,4);
const equina=index.presentarEquipo(ficha('Armadura equina'));
const opcionesEquinas=equina.opciones_armadura_equina;
assert.equal(opcionesEquinas.length,equipo.armaduras.length);
assert.equal(opcionesEquinas.length,14);
for(let i=0;i<equipo.armaduras.length;i++){
  assert.equal(opcionesEquinas[i].nombre,equipo.armaduras[i].nombre);
  assert.equal(opcionesEquinas[i].precio_base,equipo.armaduras[i].precio);
  assert.equal(opcionesEquinas[i].precio_equina,
    Math.round(equipo.armaduras[i].precio*100)*4/100);
}
assert.deepEqual(opcionesEquinas.find(x=>x.nombre==='Pechera de algodón'),
  {nombre:'Pechera de algodón',precio_base:0.5,precio_equina:2});
assert.deepEqual(opcionesEquinas.find(x=>x.nombre==='Armadura de cuero'),
  {nombre:'Armadura de cuero',precio_base:10,precio_equina:40});
assert.equal(opcionesEquinas.find(x=>x.nombre==='Armadura completa de placas')
  .precio_equina,4000);
assert.equal(equina.primarios.some(([k])=>k==='Precio'),false,
  'No fijar precio antes de elegir base');
// No permitir precios ni fuentes alternativas escondidas en el JSON.
assert.throws(()=>index.indice({...fuentes,
  equipoConsultaDRS:{...consultaDRS,equipo_para_monturas:{
    ...consultaDRS.equipo_para_monturas,
    registros:consultaDRS.equipo_para_monturas.registros.map(x=>
      x.nombre!=='Armadura equina'?x:{...x,regla_precio_autoral:{
        ...x.regla_precio_autoral,multiplicador:3}})}}}),
  /sin autorización o fuente válida/);
// Un servicio por día no es un artículo guardado en el inventario.
assert.equal(ficha('Establos'),null);
assert.equal(ficha('Hospedaje'),null);
assert.ok(consultaDRS.servicios_excluidos_del_equipo.some(x=>x.nombre==='Establos'));
assert.equal(ficha('Arpa').tipo,'Equipo');
assert.equal(ficha('Baraja de cartas').descripcion,
  '52 cartas, 4 palos con 12 figuras.');
assert.equal(ficha('Pipa de tabaco').datos.some(([k,v])=>
  k==='Dado de Uso'&&v==='DU d4'),true);

// La ficha conserva el inventario original: solo se resuelve una referencia.
// No cobrar el precio unitario por todas las raciones de un paquete.
const componentes=equipo.paquetes.flatMap(p=>p.contenido.split(';')
  .map(texto=>texto.trim()));
assert.equal(componentes.length,44);
const resultantes=componentes.map(texto=>index.buscar(glosario,texto,'equipo','nd20'));
assert.ok(resultantes.every(Boolean),'44/44 componentes con ficha DRS identificable');
assert.equal(resultantes.filter(f=>!!f.descripcion).length,44,
  'Las cinco descripciones editoriales completan las 44 apariciones de paquetes');
const comunes=consultaDRS.objetos_comunes_sin_precio;
assert.equal(comunes.length,5);
assert.equal(new Set(comunes.map(x=>x.nombre)).size,5);
assert.equal(consultaDRS.version,4);
for(const item of comunes){
  const encontrado=ficha(item.nombre);
  assert.ok(encontrado,'Útil corriente sin ficha: '+item.nombre);
  assert.equal(encontrado.clase_equipo,'util');
  assert.equal(encontrado.categoria_equipo,'Útiles · Viaje y almacenaje');
  assert.equal(encontrado.descripcion,item.descripcion_editorial);
  assert.ok(item.origen_descripcion.includes('editorial'));
  const vista=index.presentarEquipo(encontrado,item.nombre);
  assert.ok(vista.primarios.every(([k])=>k!=='Precio'&&k!=='Precio unitario'),
    'No hay precio documentado para '+item.nombre);
  assert.ok(vista.primarios.some(([k,v])=>k==='Incluido en'&&v),
    'Conservar procedencia DRS para '+item.nombre);
  assert.ok(vista.tecnicos.some(([k,v])=>k==='Redacción'&&v.includes('editorial')));
  assert.match(vista.fuente,/Descripción editorial, 01\/11\/2026/);
}
assert.equal(componentes.filter(n=>comunes.some(x=>
  index.buscar(glosario,n,'equipo','nd20').nombre===x.nombre)).length,12);
const odre=ficha('odre de agua (DU d6)');
assert.equal(odre.clase_equipo,'util');
assert.ok(index.presentarEquipo(odre).primarios.some(([k,v])=>
  k==='Dado de Uso'&&v==='DU d6'));
assert.ok(!comunes.some(x=>Object.hasOwn(x,'precio')),
  'No debe inventarse un precio de compra para los cinco objetos');
const antorcha=index.presentarEquipo(ficha('antorcha (DU d6)'));
assert.deepEqual(antorcha.primarios.find(([k])=>k==='Precio'),['Precio','10 mc']);
assert.match(ficha('antorcha (DU d6)').descripcion,/Ilumina 6 metros/);
const vela=index.presentarEquipo(ficha('vela (DU d4)'));
assert.deepEqual(vela.primarios.find(([k])=>k==='Precio'),['Precio','1 mc']);
const raciones=index.presentarEquipo(ficha('dos raciones de alimento (DU d6 cada una)'),
  'dos raciones de alimento (DU d6 cada una)');
assert.deepEqual(raciones.primarios.find(([k])=>k==='Precio unitario'),
  ['Precio unitario','0.01 mo']);
assert.ok(raciones.tecnicos.some(([k,v])=>
  k==='Artículo de referencia'&&v==='Ración de alimento'));
assert.equal(ficha('sello de orden sagrada').nombre,'Sello');
assert.equal(ficha('libro de conjuros en blanco').nombre,'Libro de conjuros');
assert.equal(ficha('odre de agua (DU d6)').clase_equipo,'util');
// Un alias no admitido por el documento debe fallar en vez de redirigir a
// una regla inventada o a otro tipo de artículo.
assert.throws(()=>index.indice({...fuentes,
  equipoConsultaDRS:{...consultaDRS,equivalencias_explicitas_paquetes:[
    ...consultaDRS.equivalencias_explicitas_paquetes,
    {inventario:'no existe en los paquetes',articulo:'Espadón'}]}}),
  /Equivalencia DRS ambigua o sin respaldo/);

const martillo=index.presentarEquipo(ficha('Martillo de campamento ×2'));
const almadena=index.presentarEquipo(ficha('Almádena'));
assert.deepEqual(martillo.primarios.find(([k])=>k==='Precio'),['Precio','2 mo']);
assert.deepEqual(almadena.primarios.find(([k])=>k==='Precio'),['Precio','60 mo']);
assert.ok(martillo.tecnicos.some(([k,v])=>k==='Nombre en el DRS'&&v==='Almádena'));
const antidoto=index.presentarEquipo(ficha('Antídoto (Nivel 3)'),'Antídoto (Nivel 3)');
assert.deepEqual(antidoto.primarios.find(([k])=>k==='Precio'),
  ['Precio','150 mo (Nivel 3)']);
const dardo=index.presentarEquipo(ficha('Dardo'));
assert.ok(dardo.tecnicos.some(([k,v])=>k==='Precio 0 mo'&&/autoral/.test(v)));
const recuerdo=ficha('Recuerdo: '+especies['Elfo agreste'].objetos_emocionales[0]);
assert.equal(recuerdo.clase_equipo,'narrativo');
const vistaRecuerdo=index.presentarEquipo(recuerdo);
assert.equal(vistaRecuerdo.tipo,'Recuerdo personal');
assert.deepEqual(vistaRecuerdo.primarios,[]);
assert.deepEqual(vistaRecuerdo.tecnicos,[]);
assert.match(vistaRecuerdo.fuente,/data\/especies\.json/);
// Colisión intencionada en el fixture: un recuerdo de Daga nunca hereda su daño.
const doble=index.indice({
  fantasia:{especies:{'Especie de prueba':{objetos_emocionales:['Daga']}},
    ocupaciones:{}},equipo
});
assert.equal(index.buscar(doble,'Recuerdo: Daga','equipo','nd20').clase_equipo,'narrativo');
assert.equal(index.presentarEquipo(index.buscar(doble,'Recuerdo: Daga','equipo','nd20'))
  .primarios.length,0);
assert.equal(index.buscar(doble,'Daga','equipo','nd20').clase_equipo,'arma');
assert.equal(ficha('Objeto mágico: Manto de Vagryen'),null,
  'El catálogo mágico NO se carga en la versión pública');
// Documentos privados: índice de 28 objetos principales y un ejemplo autorizado,
// sin introducir estas fuentes en el arranque, JSON ni lista blanca pública.
const docs=[
  '65a-objetos-magicos-nasbel-4.json',
  '65b-objetos-magicos-morrotinto-8.json',
  '65c-objetos-magicos-dupovia-1.json',
  '65d-objetos-magicos-dupovia-2.json',
  '65e-objetos-magicos-cajas-y-ejemplo.json'
].map(nombre=>leer('docs/enciclopedia/'+nombre));
const cantidad=docs.reduce((n,d)=>n+d.registros.length,0);
assert.equal(cantidad,28);
const magic=index.indice({...fuentes,objetosMagicos:docs});
let magicosComprobados=0;
for(const doc of docs){
  for(const item of doc.registros){
    const f=index.buscar(magic,'Objeto mágico: '+item.nombre,'equipo','nd20');
    assert.ok(f,'Magia documental no indexada: '+item.nombre);
    assert.equal(f.clase_equipo,'magico');
    assert.equal(f.descripcion,item.texto_original.join('\n\n').trim());
    const vista=index.presentarEquipo(f);
    assert.equal(vista.tipo,'Objeto mágico');
    assert.ok(vista.clasificacion.includes(item.tipo_literal.slice(6)));
    assert.ok(vista.clasificacion.includes(item.rareza_literal.slice(8)));
    assert.equal(vista.primarios.some(([k])=>k==='Precio'),false);
    assert.match(vista.fuente,/Objetos mágicos\.docx/);
    magicosComprobados++;
  }
}
assert.equal(magicosComprobados,28);
const elixir=index.buscar(magic,'Objeto mágico: Elixir de esfuerzo','equipo','nd20');
assert.equal(elixir.descripcion,
  docs[4].ejemplo_apendice.correccion_editorial_aprobada.efecto_vigente_literal);
assert.ok(index.presentarEquipo(elixir).tecnicos.some(([k])=>k==='Naturaleza'));
assert.ok(!index.presentarEquipo(elixir).primarios.some(([k])=>k==='Precio'));
// La interfaz no referencia los JSON de extracción: el paquete no puede pedirlos.
const app=fs.readFileSync(path.join(base,'assets/app.js'),'utf8');
assert.ok(!app.includes('65a-objetos-magicos-nasbel-4.json'));
assert.ok(!app.includes('objetosMagicos:'));
console.log('OK · Consulta Equipo DRS y 41 útiles + 2 focos; recuerdos aislados; 28 objetos mágicos + ejemplo en preparación sin publicación.');
