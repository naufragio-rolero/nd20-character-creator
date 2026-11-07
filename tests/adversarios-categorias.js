'use strict';
/* Contrato visual: 16 categorias oficiales, 12 imagenes compartidas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const visual=require('../assets/adversarios-categorias.js');
const reglas=require('../assets/creatures.js');
const mapping={
  'Aberrante':'aberrante',
  'Alimaña':'bestia','Autómata':'automata','Bestia':'bestia',
  'Celestial':'celestial','Demonio':'demonio','Dragón':'dragon',
  'Elemental':'elemental','Fata':'fata','Gigante':'humanoide',
  'Humanoide':'humanoide','Monstruo':'monstruo',
  'Muerto viviente':'muerto-viviente','Limo':'monstruo',
  'Reptil':'bestia','Vegetal':'vegetal'
};
assert.equal(reglas.CATEGORIAS.length,16,'El DRS conserva las dieciseis categorias.');
assert.deepEqual(new Set(reglas.CATEGORIAS),new Set(Object.keys(mapping)));
assert.equal(Object.keys(visual.grupos).length,12,'Solo doce iconos editoriales.');
for(const [categoria,familia] of Object.entries(mapping)){
  const icono=visual.obtener(categoria);
  assert.ok(icono,'Sin emblema: '+categoria);
  assert.equal(icono.familia,familia,categoria+' comparte el icono correcto.');
  assert.match(icono.tinta,/^#[0-9a-f]{6}$/i);
  assert.match(icono.brillo,/^#[0-9a-f]{6}$/i);
  const ruta=path.join(raiz,'assets','adversarios','iconos',icono.archivo);
  const svg=fs.readFileSync(ruta,'utf8');
  assert.match(svg,/<svg[^>]*viewBox="0 0 512 512"/,categoria);
  assert.match(svg,/Game Icons.*CC BY 3.0/,categoria);
  assert.doesNotMatch(svg,/<path d="M0 0h512v512H0z"\s*\/>/,
    categoria+': sin el fondo negro original.');
}
assert.equal(visual.obtener('Alimana').familia,'bestia');
assert.equal(visual.obtener('MUERTO   VIVIENTE').familia,'muerto-viviente');
assert.equal(visual.obtener('Clase desconocida'),null,'No inferir categorias.');
const css=fs.readFileSync(path.join(raiz,'assets/styles.css'),'utf8');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const ui=fs.readFileSync(path.join(raiz,'assets/creatures-ui.js'),'utf8');
const pack=fs.readFileSync(path.join(raiz,'scripts/crear-paquete-drs.js'),'utf8');
const credits=fs.readFileSync(path.join(raiz,'assets/icons/CREDITOS-GAME-ICONS.txt'),'utf8');
assert.match(html,/defer src="assets\/adversarios-categorias.js"/);
assert.match(ui,/iconoCategoria\(registro\.categoria,'criaturas-icono-portada'\)/);
assert.match(ui,/iconoCategoria\(registro\.categoria,'criaturas-icono-nombre'\)/);
assert.match(ui,/iconoCategoria\(dato\.categoria,'criaturas-icono-titulo'\)/);
assert.match(ui,/iconoCategoria\(dato\.categoria,'criaturas-icono-taxonomia'\)/);
assert.match(ui,/iconoCategoria\(registro\.ficha\.categoria,'criaturas-icono-lista'\)/);
assert.match(css,/mask:var\(--criaturas-svg-categoria\)/);
assert.match(pack,/iconosCategoriasAdversarios/);
for(const [familia,datos] of Object.entries(visual.grupos)){
  assert.ok(credits.includes(datos.archivo+' — '),familia+': credito y licencia publicados.');
}
console.log('OK: 16 categorias, 12 SVG originales acreditados y vistas coherentes.');
