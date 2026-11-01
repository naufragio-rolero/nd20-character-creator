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
assert.deepEqual(consultaDRS.tablas.map(t=>t.registros.length),[4,6]);
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
// La ficha conserva el inventario original: solo se resuelve una referencia.
// No cobrar el precio unitario por todas las raciones de un paquete.
const componentes=equipo.paquetes.flatMap(p=>p.contenido.split(';')
  .map(texto=>texto.trim()));
assert.equal(componentes.length,44);
const resultantes=componentes.map(texto=>index.buscar(glosario,texto,'equipo','nd20'));
assert.ok(resultantes.every(Boolean),'44/44 componentes con ficha DRS identificable');
assert.equal(resultantes.filter(f=>!!f.descripcion).length,32);
const soloPaquete=resultantes.filter(f=>f.clase_equipo==='componente_paquete');
assert.equal(soloPaquete.length,12);
assert.equal(new Set(soloPaquete.map(f=>f.nombre)).size,5);
for(const fichaComponente of soloPaquete){
  assert.ok(index.presentarEquipo(fichaComponente).primarios.every(([k])=>k!=='Precio'));
  assert.equal(fichaComponente.descripcion,'');
  assert.match(index.presentarEquipo(fichaComponente).fuente,/Paquetes de equipo/);
}
const antorcha=index.presentarEquipo(ficha('antorcha (DU d6)'));
assert.deepEqual(antorcha.primarios.find(([k])=>k==='Precio'),['Precio','10 mc']);
assert.match(ficha('antorcha (DU d6)').descripcion,/Ilumina 6 metros/);
const vela=index.presentarEquipo(ficha('vela (DU d4)'));
assert.deepEqual(vela.primarios.find(([k])=>k==='Precio'),['Precio','1 mc']);
const raciones=index.presentarEquipo(ficha('dos raciones de alimento (DU d6 cada una)'),
  'dos raciones de alimento (DU d6 cada una)');
assert.deepEqual(raciones.primarios.find(([k])=>k==='Precio individual'),
  ['Precio individual','0.01 mo']);
assert.ok(raciones.tecnicos.some(([k,v])=>
  k==='Artículo de referencia'&&v==='Ración de alimento'));
assert.equal(ficha('sello de orden sagrada').nombre,'Sello');
assert.equal(ficha('libro de conjuros en blanco').nombre,'Libro de conjuros');
assert.equal(ficha('odre de agua (DU d6)').clase_equipo,'componente_paquete');
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
