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
for(const file of ['creatures.js','creatures-import.js','creatures-library.js','creatures-ui.js']){
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
console.log('OK · UI criaturas: panel, controles y lista blanca DRS.');
