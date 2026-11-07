'use strict';
/* Las mesas explican la actividad sin mensajes vacios ni cabeceras repetidas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=x=>fs.readFileSync(path.join(raiz,x),'utf8');
const html=leer('index.html'),app=leer('assets/app.js');
const estilos=leer('assets/styles.css');
assert.match(html,/<h2 id="titulo-resultados" tabindex="-1">Personajes y seguidores<\/h2>/);
assert.match(html,/<h2 id="titulo-editor-criaturas" tabindex="-1">Adversarios<\/h2>/);
assert.match(html,/<h3 id="criaturas-titulo-biblioteca">Colección<\/h3>/);
assert.match(html,/Las fichas generadas se reúnen aquí para consultarlas y exportarlas\./);
assert.match(html,/Crea tus propias fichas o incorpora perfiles oficiales a tu colección\./);
assert.doesNotMatch(html,/EDITOR DEL CRONISTA|<p class="sobrelinea">RESULTADOS<\/p>|BESTIARIO PERSONAL|Tu bestiario personal/);
assert.doesNotMatch(html,/Todavía no has generado ninguna ficha/);
assert.doesNotMatch(app,/\$('titulo-resultados'\)\.textContent/);
assert.doesNotMatch(app,/Todavía no has generado ninguna ficha|Mesa despejada\./);
assert.match(app,/\$('contador'\)\.hidden=entradas\.length===0/);
assert.match(app,/Genera un personaje o un seguidor para añadir la primera ficha/);
assert.match(estilos,/#editor-criaturas>#criaturas-estado:empty\{display:none\}/);
for(const id of ['estado','criaturas-estado','borrar','exportar','criaturas-exportar-biblioteca',
  'criaturas-exportar-pdf-coleccion','criaturas-cantidad']){
 assert.ok(html.includes('id="'+id+'"'),id+' conserva su control o estado');
}
console.log('OK: encabezados normalizados sin perder contadores, avisos ni controles.');
