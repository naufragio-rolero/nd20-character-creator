'use strict';
/* Fase 5 (#143): contrato auditable de las rutas modulares, la lista blanca,
 * la procedencia DRS y los medallones. No accede a red ni publica nada.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=ruta=>fs.readFileSync(path.join(raiz,ruta),'utf8');
const json=ruta=>JSON.parse(leer(ruta));

const portal=leer('index.html');
const personajes=leer('characters/index.html');
const antiguo=leer('characters-nd20/index.html');
const conjuros=leer('spells/index.html');
assert.match(portal,/href="characters\/"/,'El Hub abre la ruta canónica');
assert.match(portal,/href="spells\/"/);
assert.doesNotMatch(portal,/href="characters-nd20\//,'La portada no debe emitir enlaces antiguos');
assert.match(personajes,/<base href="\.\.\/">/);
assert.match(conjuros,/<base href="\.\.\/">/);
assert.equal((personajes.match(/<script defer src="assets\/app\.js"><\/script>/g)||[]).length,1,
  'Solo el HTML nuevo incorpora el motor principal');
assert.ok(personajes.includes('data-juego="nd20"')&&personajes.includes('data-juego="dh"'));
assert.ok(personajes.includes('id="tab-criaturas"'));
assert.ok(antiguo.length<3000,'La ruta antigua debe ser una página mínima');
for(const fragmento of [
  "new URL('../characters/'","endsWith('/index.html')",
  'destino.search=actual.search','destino.hash=actual.hash',
  'window.location.replace(destino.href)'
])assert.ok(antiguo.includes(fragmento),'Redirección incompleta: '+fragmento);
assert.doesNotMatch(antiguo,/src="assets\/app\.js"|src="assets\/rules\.js"|<base\b/,
  'La redirección no puede ejecutar un segundo generador');

// Ningún módulo activo puede volver a fabricar enlaces al directorio legado.
// Se comprueban todos los .js y .css de assets, no solo los módulos conocidos.
for(const archivo of fs.readdirSync(path.join(raiz,'assets'))){
  if(!/\.(?:js|css)$/.test(archivo))continue;
  const fuente=leer('assets/'+archivo);
  assert.ok(!fuente.includes('characters-nd20'),
    'Referencia activa a ruta heredada en assets/'+archivo);
}
for(const [archivo,texto] of [['index.html',portal],['characters/index.html',personajes],
  ['spells/index.html',conjuros]]){
  assert.ok(!texto.includes('characters-nd20'),
    'Enlace legado dentro del HTML activo '+archivo);
}
for(const archivo of ['assets/app.js','assets/creatures-ui.js']){
  const fuente=leer(archivo);
  for(const fragmento of ["'characters/index.html'","'characters/'",
    "location.pathname.endsWith('/index.html')"])
    assert.ok(fuente.includes(fragmento),
      archivo+': enlaces compartidos deben soportar Pages y proxy externo');
}
const enlace=leer('assets/share-links.js');
assert.match(enlace,/u\.hash='share='\+token/,'El fragmento no cambia de formato');
assert.match(enlace,/location\.hash\.match\(\/\^#share=/,
  'Los enlaces heredados siguen siendo decodificables');

// Tanto el constructor del paquete como su guardia conservan la nueva página,
// el redireccionador y solo los recursos SVG de las seis Escuelas.
const creador=leer('scripts/crear-paquete-drs.js');
const guardia=leer('scripts/comprobar-publicacion-drs.js');
const rutas=['index.html','characters/index.html','characters-nd20/index.html','spells/index.html'];
for(const script of [creador,guardia]){
  for(const ruta of rutas)assert.ok(script.includes("'"+ruta+"'"),
    'Falta ruta pública '+ruta);
  assert.match(script,/iconosEscuelas\.map\(id=>'assets\/icons\/escuela-'\+id\+'\.svg'\)/,
    'El paquete y la guardia deben enumerar las seis Escuelas');
}
assert.ok(creador.includes("ruta==='characters/index.html'"),
  'El filtrado editorial debe operar sobre la ruta canónica');
assert.ok(!creador.includes("ruta==='characters-nd20/index.html'"),
  'No aplicar filtrado de generador a la redirección');
assert.ok(guardia.includes("destino.hash=actual.hash"),
  'El guardia de publicación verifica el enlace antiguo');
const flujo=leer('.github/workflows/forja-preview.yml');
for(const ruta of rutas)assert.ok(flujo.includes(ruta),'PREVIEW omite '+ruta);
assert.ok(flujo.includes('forja-preview-pr142'));
assert.ok(!flujo.includes('deploy-pages@'),
  'PREVIEW no puede usar despliegue Pages');
assert.ok(flujo.includes("href=\"characters/index.html\""),
  'PREVIEW necesita navegación a ficheros explícitos');

// Contrastar la identidad de las 64 fichas DRS con el catálogo de origen,
// sin añadir reglas ni convertir la simbología de interfaz en dato normativo.
const drs=json('data/conjuros-drs-fichas.json').conjuros;
const origen=json('data/catalogo-poderes.json').conjuros.filter(c=>c.origen==='Nd20');
assert.equal(drs.length,64);
assert.equal(origen.length,64);
assert.equal(new Set(drs.map(s=>s.id)).size,64);
const porId=new Map(origen.map(s=>[s.id,s]));
const escuelas=['Arcana','Divina','Nigromancia','Elemental','Demonología','Naturaleza'];
const cantidades={Arcana:18,Divina:12,Nigromancia:10,Elemental:9,Demonología:8,Naturaleza:7};
const circulos={1:12,2:10,3:10,4:10,5:8,6:6,7:4,8:4};
for(const ficha of drs){
  const original=porId.get(ficha.id);
  assert.ok(original,'Identificador DRS ajeno: '+ficha.id);
  assert.equal(original.nombre,ficha.nombre);
  assert.equal(original.circulo,ficha.circulo);
  assert.deepEqual(original.escuelas,[ficha.escuela]);
  assert.ok(escuelas.includes(ficha.escuela));
  assert.ok(Number.isInteger(ficha.circulo)&&ficha.circulo>=1&&ficha.circulo<=8);
}
assert.deepEqual(Object.fromEntries(escuelas.map(s=>[s,drs.filter(c=>c.escuela===s).length])),
  cantidades,'La repartición oficial de Escuelas no puede cambiar');
assert.deepEqual(Object.fromEntries(Object.keys(circulos).map(n=>
  [n,drs.filter(c=>c.circulo===Number(n)).length])),circulos);
const iconos=leer('assets/spell-lists-simple.js');
for(const escuela of escuelas){
  const archivo='escuela-'+escuela.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()+'.svg';
  assert.ok(iconos.includes("'"+escuela+"':'"+archivo+"'"),
    'Escuela sin correspondencia iconográfica '+escuela);
  const svg=leer('assets/icons/'+archivo);
  assert.match(svg,/viewBox="0 0 24 24"/,'Lado del medallón');
  assert.ok(!/<script\b|<foreignObject\b|\bon[a-z]+\s*=|\bhref\s*=/i.test(svg),
    'SVG activo o externo: '+archivo);
}
assert.ok(iconos.includes("li.appendChild(crear('span','',presentarConjuro(s)))"),
  'La lista debe conservar el texto DRS sin iconos en el span');
assert.ok(iconos.includes("lineas.push('- '+presentarConjuro(s))"),
  'La copia sigue siendo texto plano');
console.log('OK · Fase 5: rutas y proxy, redirección, enlaces, paquete aislado, 64 fichas y seis medallones.');
