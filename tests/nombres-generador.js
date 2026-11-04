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
// La representación editorial conserva todas las claves canónicas y las
// tiradas. Cobertura sobre DRS, Fantasía ampliada, CiFi y Nocturna.
const sexApi=require('../assets/sex.js');
const genero=leer('sexo-personajes.json');
const extras=leer('catalogo-ampliado.json');
const fuentesGenero=[
  ...Object.values(juego.ocupaciones),...Object.values(juego.especies),
  ...Object.values(leer('ocupaciones_cifi.json')),
  ...Object.values(leer('especies_cifi.json')),
  ...['fantasia','nocturna','cifi'].flatMap(x=>[
    ...Object.values(extras[x].ocupaciones||{}),
    ...Object.values(extras[x].especies||{})
  ])
];
const ocupacionesCatalogadas=new Set([
  ...Object.keys(juego.ocupaciones),...Object.keys(leer('ocupaciones_cifi.json')),
  ...Object.keys(extras.fantasia.ocupaciones),
  ...Object.keys(extras.nocturna.ocupaciones)
]);
const especiesCatalogadas=new Set([
  ...Object.keys(juego.especies),...Object.keys(leer('especies_cifi.json')),
  ...['fantasia','nocturna','cifi'].flatMap(x=>Object.keys(extras[x].especies||{}))
]);
assert.deepEqual(new Set(Object.keys(genero.ocupaciones_formas_genero)),ocupacionesCatalogadas);
assert.deepEqual(new Set(Object.keys(genero.especies_formas_genero)),especiesCatalogadas);
const conceptosCanonicos=new Set(fuentesGenero.flatMap(x=>x.conceptos||[]));
assert.equal(conceptosCanonicos.size,927,'Conceptos originales de todas las fuentes');
for(const [original,formas] of Object.entries(genero.conceptos_formas_genero)){
  assert(conceptosCanonicos.has(original),'El Concepto editable existe en su JSON: '+original);
  assert(formas.masculino&&formas.femenino,'Ambas formas documentadas: '+original);
}
for(const [original,formas] of Object.entries(genero.ocupaciones_formas_genero)){
  assert.equal(sexApi.ocupacionVisible(original,'masculino',genero),formas.masculino);
  assert.equal(sexApi.ocupacionVisible(original,'femenino',genero),formas.femenino);
  assert.equal(sexApi.ocupacionVisible(original,'aleatorio',genero),original);
}
for(const [original,formas] of Object.entries(genero.especies_formas_genero)){
  assert.equal(sexApi.especieVisible(original,'masculino',genero),formas.masculino);
  assert.equal(sexApi.especieVisible(original,'femenino',genero),formas.femenino);
}
assert.equal(sexApi.especieVisible('Elfo agreste','femenino',genero),'Elfa agreste');
assert.equal(sexApi.especieVisible('Enano montañés','femenino',genero),'Enana montañesa');
assert.equal(sexApi.especieVisible('Hombre lobo','femenino',genero),'Mujer loba');
assert.equal(sexApi.ocupacionVisible('Guerrero','femenino',genero),'Guerrera');
assert.equal(sexApi.ocupacionVisible('Mago','femenino',genero),'Maga');
assert.equal(sexApi.conceptoVisible('Valiente defensor','femenino',genero),
  'Valiente defensora');
assert.equal(sexApi.conceptoVisible('Maestro de las artes arcanas','femenino',genero),
  'Maestra de las artes arcanas');
assert.equal(sexApi.conceptoVisible('Guardián del bosque','femenino',genero),
  'Guardiana del bosque');
assert.equal(sexApi.conceptoVisible('Héroe del pueblo','femenino',genero),
  'Heroína del pueblo');
assert.equal(sexApi.conceptoVisible('Guía espiritual','femenino',genero),
  'Guía espiritual','Los Conceptos invariables no cambian');
for(const s of ['masculino','femenino']){
  const cfg={juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Elfo agreste',
    modoNombre:'generico',nombresHistoricosYlat:banco,
    catalogoSexo:genero,sexo:s,aplazarElecciones:true};
  for(let i=0;i<18;i++){
    const seed='coherencia-personaje-'+i;
    const r=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla(seed));
    const otra=reglas.crearNd20(juego,cfg,reglas.aleatorioSemilla(seed));
    assert.deepEqual(r,otra,'Reproducción por semilla con género '+s);
    assert.equal(r.descripcion,'Guerrero · Elfo agreste',
      'Las claves de reglas no se flexionan');
    assert.equal(r.descripcion_mostrada,
      (s==='femenino'?'Guerrera · Elfa agreste':'Guerrero · Elfo agreste'));
    assert(conceptosCanonicos.has(r.concepto),
      'El Concepto original sigue siendo una entrada literal de los JSON');
    assert.equal(r.concepto_mostrado,sexApi.conceptoVisible(r.concepto,s,genero));
  }
}
console.log('OK · Género editorial de 51 Ocupaciones, 43 Especies y 927 Conceptos.');
console.log('OK · Generador genérico 1422 uniformes sin repetición y Ylat 255×133 ponderado.');
