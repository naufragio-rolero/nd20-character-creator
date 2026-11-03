'use strict';
/* Dos modos de generación de nombres, sin clonar identidades canónicas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.join(__dirname,'..');
const leer=x=>JSON.parse(fs.readFileSync(path.join(raiz,'data',x),'utf8'));
const nombres=require('../assets/names.js');
const reglas=require('../assets/rules.js');
const banco=leer('nombres-historicos-ylat.json');
const catalogo=leer('componentes-nombres-ylat.json');
const tesauro=leer('tesauro-ylat.json');
const originales=new Set(banco.entradas.map(x=>x.nombre));
assert.equal(originales.size,1422,'Formas históricas únicas del banco genérico');
assert.equal(catalogo.identidades_documentadas.length,262);
assert.equal(catalogo.combinaciones_previas.length,33);
assert.equal(catalogo.nombres.length,255);
assert.equal(catalogo.apellidos.length,133);
assert.ok(catalogo.nombres.every(x=>x.nombre&&Array.isArray(x.fuentes)&&x.fuentes.length));
assert.ok(catalogo.apellidos.every(x=>x.nombre&&x.peso_relativo>0&&
  Array.isArray(x.origenes)&&x.origenes.length));
const surnames=new Map(catalogo.apellidos.map(x=>[x.nombre,x]));
for(const apellido of ['Bronnhum','Shadelgast','Boll','Achgate'])
  assert.equal(surnames.get(apellido)?.peso_relativo,1,
    'Los linajes excepcionales son muy poco probables: '+apellido);
for(const alias of ['Violatesoros','Brasagorda','Shadelgast II','del Atardecer Luciente'])
  assert.ok(!surnames.has(alias),'No convertir apodo, ordinal o convención en apellido: '+alias);
assert.equal(new Set(catalogo.nombres.map(x=>x.nombre)).size,catalogo.nombres.length);
assert.equal(surnames.size,catalogo.apellidos.length);
assert.ok(!/niguac|niguaz/i.test(JSON.stringify(catalogo)));

const formas=[...originales];
for(const semilla of ['nombre-1','nombre-2','nombre-3','nombre-4']){
  const s=reglas.aleatorioSemilla(semilla);
  const historico=nombres.generico(banco,s);
  const [primero,segundo]=historico.split(' ');
  assert.ok(originales.has(primero)&&originales.has(segundo));
  assert.notEqual(primero,segundo,'Dos formas diferentes sin reemplazo');
  assert.equal(historico,nombres.generico(banco,reglas.aleatorioSemilla(semilla)));
}
assert.equal(nombres.generico({entradas:[{nombre:'Ale-skelas'},{nombre:'Straria'}]},()=>0),
  'Ale-skelas Straria');
assert.equal(nombres.generico({entradas:[{nombre:'Solo'}]},()=>0),null);
assert.equal(nombres.generico({entradas:[]},()=>0),null);
let llamados=0;
nombres.generico({entradas:[{nombre:'Uno'},{nombre:'Dos'}]},()=>{llamados++;return 0;});
assert.equal(llamados,2,'Solo dos extracciones; ningún peso oculto');

// Verificar más de mil combinaciones reales y repetibilidad con semillas.
const existentes=new Set(catalogo.identidades_documentadas.concat(catalogo.combinaciones_previas));
const pila=new Set(catalogo.nombres.map(x=>x.nombre));
for(let i=0;i<1200;i++){
  const seed='ylat-'+i, resultado=nombres.ylat(catalogo,reglas.aleatorioSemilla(seed));
  assert.equal(resultado,nombres.ylat(catalogo,reglas.aleatorioSemilla(seed)));
  assert.ok(resultado&&!existentes.has(resultado),'Una combinación nunca clona una ficha real');
  assert.ok([...pila].some(n=>resultado.startsWith(n+' ')),'Nombre inicial procedente del corpus');
  assert.ok([...surnames.keys()].some(s=>resultado.endsWith(' '+s)),'Apellido procedente del corpus');
}
const juego={especies:leer('especies.json'),ocupaciones:leer('ocupaciones.json')};
for(const modoNombre of ['generico','ylat']){
  const cfg={juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Humano común',
    modoNombre,nombresHistoricosYlat:banco,componentesYlat:catalogo,
    catalogoSexo:leer('sexo-personajes.json'),sexo:'femenino',aplazarElecciones:true};
  const a=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla('generador-'+modoNombre));
  const z=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla('generador-'+modoNombre));
  assert.deepEqual(a,z,'Ficha reproducible con semilla fija');
  assert.ok(a.nombre.includes(' '),'Ambos modos generan nombre + apellido');
  const personal=reglas.crearNd20(juego,{...cfg,nombre:'Nombre elegido'},
    reglas.aleatorioSemilla('manual'));
  assert.equal(personal.nombre,'Nombre elegido','La edición manual prevalece');
}
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
assert.ok(html.includes('<option value="generico">Nombres genéricos</option>'));
assert.ok(html.includes('<option value="ylat">Nombres de Ylat</option>'));
assert.ok(!html.includes('<option value="combinado"'));
assert.ok(!html.includes('id="ambito-nombre"'));
assert.ok(!html.includes('id="buscar-nombre-ylat"'));
console.log('OK · Generador genérico 1422 uniformes sin repetición y Ylat 255×133 ponderado.');
