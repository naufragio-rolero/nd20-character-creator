'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const portal=read('index.html'),characters=read('characters-nd20/index.html'),spells=read('spells/index.html');
assert.match(portal,/href="characters-nd20\/"/);
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
  const pie=html.match(/<footer class="forja-pie"[\\s\\S]*?<\\/footer>/);
  assert.ok(pie,'Las tres pantallas incluyen pie de créditos propio');
  assert.ok(html.indexOf('class="forja-pie"')>html.indexOf('</main>'),
    'El pie queda fuera de la mesa y bajo el contenido');
  assert.match(pie[0],/La Forja es una herramienta para crear personajes, seguidores, antagonistas y gestionar listas de conjuros para Naufragio d20/);
  assert.match(pie[0],/assets\\/icons\\/CREDITOS-GAME-ICONS\\.txt/);
  assert.match(pie[0],/assets\\/icons\\/LICENCIA-TABLER\\.txt/);
  assert.match(pie[0],/https:\\/\\/naufragio\\.net\\//);
  return pie[0];
});
assert.equal(new Set(creditos).size,1,'El pie común es idéntico en las tres pantallas');
assert.doesNotMatch(portal,/Las propuestas no se publican automáticamente/);
assert.doesNotMatch(characters,/Las fichas generadas se reúnen aquí|Crea tus propias fichas o incorpora perfiles oficiales/);
assert.doesNotMatch(spells,/Añadir un Conjuro no concede aprendizaje/);
assert.match(read('assets/forja-header.css'),/\\.forja-pie\\{/);

assert.match(read('assets/app.js'),/NaufragioEnlaces\.decodificar/);
console.log('OK: portal, rutas y enlaces portátiles');
