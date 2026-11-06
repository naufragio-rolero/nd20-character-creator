'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=p=>fs.readFileSync(path.join(raiz,p),'utf8');
const html=leer('index.html');
const ui=leer('assets/creatures-ui.js');
const app=leer('assets/app.js');
const css=leer('assets/styles.css');
const drs=leer('scripts/crear-paquete-drs.js');
const mod=require('../assets/creatures-ui.js');
assert.equal(mod.aEntero('','Salud'),null);
assert.equal(mod.aEntero('0','Salud'),0);
assert.equal(mod.aEntero('30','Nivel'),30);
assert.throws(()=>mod.aEntero('1.5','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('-5','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('Infinity','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('9999999999999999999','Nivel'),/entero/);
for(const file of ['creatures.js','creatures-import.js','creatures-library.js',
  'adversarios-formato.js','creatures-ui.js','adversarios-pdf.js']){
  assert.ok(html.includes('defer src="assets/'+file+'"'),'Script UI: '+file);
  assert.ok(drs.includes("'assets/"+file+"'"),'Paquete público: '+file);
}
for(const id of ['tab-criaturas','panel-criaturas','editor-criaturas','resultados-personajes',
  'criaturas-texto','criaturas-analizar','criaturas-vista-previa',
  'criaturas-aplicar-previa','criaturas-ataques','criaturas-talentos',
  'criaturas-formulario','criaturas-biblioteca','criaturas-lista',
  'criaturas-original','criaturas-archivo-json','criaturas-guardar']){
  assert.ok(html.includes('id="'+id+'"'),'Controles UI: '+id);
}
assert.match(app,/\['personajes','herramientas','criaturas'\]/);
assert.match(css,/#editor-criaturas\[hidden\]/);
assert.match(html,/<section id="editor-criaturas"[^>]+hidden>/);
assert.match(html,/<textarea id="criaturas-original"[^>]+readonly/);
assert.match(ui,/importador\.descomponerTexto/);
assert.match(ui,/biblioteca\.importarJson/);
assert.match(ui,/biblioteca\.guardar/);
assert.match(ui,/El texto ha cambiado/);
assert.match(ui,/criaturas-texto'\)\.addEventListener\('input'/);
assert.match(ui,/criaturas ya presentes/);
assert.match(ui,/textoOriginal/);
assert.doesNotMatch(ui,/Math\.random|crearNd20|eleccionDH|tirarDados/);
const formato=require('../assets/adversarios-formato.js');
assert.equal(formato.ataque({nombre:'chinazo',cantidad:1,danoLiteral:'6'},0),
  'Chinazo - 6 de daño');
assert.equal(formato.ataque({nombre:'mordisco',cantidad:2,danoLiteral:'1d6'},1),
  '2 × Mordisco - 1d6 de daño');
assert.equal(formato.ataque({nombre:'mirada',cantidad:1,danoLiteral:'especial'},0),
  'Mirada - especial');
assert.equal(formato.ataque({nombre:'vuelo',cantidad:1},0),'Vuelo');
assert.doesNotMatch(ui,/Habilidad relacionada: /);
assert.match(ui,/forja-adversarios-oficiales-v1/);
for(const id of ['criaturas-selector-drs','criaturas-selector-busqueda',
  'criaturas-selector-categoria','criaturas-selector-lista','criaturas-ficha-retirar']){
  assert.ok(html.includes('id="'+id+'"'),'Selector DRS: '+id);
}
assert.ok(html.indexOf('id="configurar-seguidores"')>
  html.indexOf('id="resumen-seguidores"'));
assert.ok(html.indexOf('id="configurar-seguidores"')<
  html.indexOf('id="generar-seguidor"'));
assert.ok(css.includes('equipo-espada.svg')&&css.includes('equipo-libro.svg'));
console.log('OK · UI criaturas: panel, controles y lista blanca DRS.');
