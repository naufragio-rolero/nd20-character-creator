'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const portal=read('index.html'),characters=read('characters/index.html'),spells=read('spells/index.html');
assert.match(portal,/href="characters\/"/);
const redirect=read('characters-nd20/index.html');
assert.match(redirect,/window\.location\.replace\(destino\.href\)/);
assert.match(redirect,/destino\.search=actual\.search/);
assert.match(redirect,/destino\.hash=actual\.hash/);
assert.ok(!redirect.includes('assets/app.js'),'Solo el nuevo módulo carga el motor');
assert.match(portal,/href="spells\/"/);
assert.match(portal,/<circle cx="32" cy="20"/);
assert.match(portal,/M32 52c-7-6/);
assert.match(characters,/<base href="\.\.\/">/);
assert.match(spells,/<base href="\.\.\/">/);
assert.match(characters,/id="tab-criaturas"/);
assert.match(characters,/id="compartir-reproduccion"/);
assert.match(characters,/id="criaturas-ficha-compartir"/);
assert.match(read('assets/creatures-ui.js'),/abrirCompartida/);
assert.match(spells,/id="compartir-listas"/);
assert.match(spells,/id="copiar-lista"/);
assert.match(spells,/id="mostrar-origen"/);
assert.match(spells,/id="mostrar-escuela"/);
for(const documento of [characters,spells]){
  assert.ok(documento.includes('aria-label="Volver al hub"'));
  assert.ok(documento.includes('class="forja-icono-inicio"'));
  assert.ok(!documento.includes('← Volver al hub'));
}
const jsConjuros=read('assets/spell-lists-simple.js');
assert.ok(jsConjuros.includes("lineas.push('Círculo '+(i+1))"));
assert.ok(jsConjuros.includes("resultado+=' [DRS]'"));
assert.ok(jsConjuros.includes("resultado+=' — '+s.escuela"));
assert.ok(jsConjuros.includes("navigator.clipboard.writeText(texto)"));
// La presentación añade medallones sin modificar el texto plano del DRS.
for(const escuela of ['arcana','divina','nigromancia','elemental','demonologia','naturaleza']){
  const recurso=read('assets/icons/escuela-'+escuela+'.svg');
  assert.match(recurso,/viewBox="0 0 24 24"/,'Medallón uniforme: '+escuela);
  assert.match(recurso,/<circle cx="12" cy="12" r="11"/,'Círculo centrado: '+escuela);
}
assert.ok(jsConjuros.includes('if(icono)li.appendChild(icono);'),
  'Medallón en las listas por Círculos');
assert.ok(jsConjuros.includes('crearIconoEscuela(s.escuela)'),
  'Escuela derivada del DRS');
assert.ok(read('assets/spell-lists-simple.css').includes('.conjuro-seleccionado .icono-escuela'),
  'Icono compacto en la lista agrupada');
assert.ok(read('assets/forja-header.css').includes('margin-inline:auto'));
const api=require('../assets/share-links.js');
const registro={version:1,semilla:'ñá-2026',config:{juego:'nd20',cantidad:1,modo:'rapido'}};
const token=api.codificar('character','nd20',registro);
assert.deepEqual(api.decodificar(token),{version:1,tipo:'character',sistema:'nd20',datos:registro});
assert.throws(()=>api.decodificar('$hola'));
assert.throws(()=>api.codificar('unknown','nd20',registro));
assert.throws(()=>api.codificar('character','Nocturna',registro));
assert.throws(()=>api.codificar('character','nd20',{s:'X'.repeat(13000)}));
// La información de marca y licencias pertenece al pie global, no a las mesas.
const creditos=[portal,characters,spells].map(html=>{
  const inicio=html.indexOf('<footer class="forja-pie"');
  const final=html.indexOf('</footer>',inicio);
  assert.ok(inicio>=0&&final>inicio,'Las tres pantallas incluyen pie de créditos propio');
  assert.ok(inicio>html.indexOf('</main>'),'El pie queda fuera de la mesa y bajo el contenido');
  const pie=html.slice(inicio,final+'</footer>'.length);
  for(const literal of [
    'La Forja es una herramienta para crear personajes, seguidores, antagonistas y gestionar listas de conjuros para Naufragio d20',
    'https://naufragio.net/',
    'assets/icons/CREDITOS-GAME-ICONS.txt',
    'assets/icons/LICENCIA-TABLER.txt'
  ])assert.ok(pie.includes(literal),'Falta en el pie: '+literal);
  return pie;
});
assert.equal(new Set(creditos).size,1,'El pie común es idéntico en las tres pantallas');
assert.ok(!portal.includes('Las propuestas no se publican automáticamente'));
assert.ok(!characters.includes('Las fichas generadas se reúnen aquí'));
assert.ok(!characters.includes('Crea tus propias fichas o incorpora perfiles oficiales'));
assert.ok(!spells.includes('Añadir un Conjuro no concede aprendizaje'));
assert.ok(read('assets/forja-header.css').includes('.forja-pie{'));

assert.match(read('assets/app.js'),/NaufragioEnlaces\.decodificar/);
console.log('OK: portal, rutas y enlaces portátiles');
