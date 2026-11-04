'use strict';
/* Contrato de integración: deliberadamente independiente de los iconos SVG y de LIVE.
 * Ejecutar: node tests/pdf-a5-integracion.js
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const app=read('assets/app.js');
const browser=read('assets/pdf-export-browser.js');
const engine=read('assets/pdf-export-v2.js');
const map=JSON.parse(read('assets/pdf-a5/campos-ficha-a5.json'));
const svg=read('assets/pdf-a5/forja-fantasia-epica-a5.svg');
assert(html.indexOf('src="assets/pdf-export-v2.js"')>0);
assert(html.indexOf('src="assets/pdf-export-browser.js"')>0);
assert(html.indexOf('src="assets/pdf-export-browser.js"')<
  html.indexOf('src="assets/app.js"'));
assert(app.includes("personaje.juego==='Naufragio d20 · Fantasía'&&!personaje.tipo_ficha?"),
  'El PDF A5 conserva el formato de PJ y excluye las fichas compactas de seguidor');
assert(app.includes('exportar-pdf-ficha'));
assert(app.includes('NaufragioPdfBrowser.exportar('));
assert(app.includes('el-naufragio-fichas.txt'),
  'La exportación TXT permanece independiente');
assert(browser.includes('assets/'));
assert(browser.includes('SourceSerif4_400Regular.ttf'));
assert(!/https?:\/\//.test(browser),'Ninguna dependencia se descarga desde CDN');
assert(engine.includes("doc.copyPages(cont,[0])"));
assert(engine.includes("await header(title,true)"),'Secciones extensas paginadas');
assert(svg.includes('>ARMA EQUIPADA</text>'));
assert(svg.includes('>DAÑO</text>'));
assert(!svg.includes('>BLINDAJE</text>'));
assert(!svg.includes('>PROTECCIÓN NATURAL</text>'));
const ids=map.campos_fijos.map(x=>x.id);
assert(ids.includes('arma_equipada')&&ids.includes('dano_equipado'));
assert(!ids.includes('blindaje')&&!ids.includes('blindaje_natural'));
assert(engine.includes("await section('EFECTOS DOCUMENTADOS DE CONJUROS Y PODERES'"),
  'Los Poderes se documentan después de las observaciones.');
assert.equal(map.campos_fijos.length,32);
const required=[
  'assets/pdf-a5/forja-fantasia-epica-a5.pdf',
  'assets/pdf-a5/forja-continuacion-a5.pdf',
  'assets/pdf-a5/campos-ficha-a5.json',
  'assets/pdf-a5/naufragiod20_faep.svg'
];
for(const file of required)assert(fs.statSync(path.join(root,file)).size>100);
console.log('OK: interfaz A5 aislada, datos íntegros, A5/identidad y TXT intacto.');
