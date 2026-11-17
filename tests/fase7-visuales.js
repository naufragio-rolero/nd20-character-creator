'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const raiz=path.resolve(__dirname,'..');
const leer=r=>fs.readFileSync(path.join(raiz,r),'utf8');
const js=leer('assets/spell-lists-simple.js');
const css=leer('assets/spell-lists-simple.css');
for(const [ruta,movimiento] of [
  ['assets/icons/escuela-nigromancia.svg','translate(0 -0.8)'],
  ['assets/icons/escuela-naturaleza.svg','translate(-0.55 0)']
]){
  const svg=leer(ruta);
  assert.match(svg,/viewBox="0 0 24 24"/);
  assert.ok(svg.includes(movimiento),'Desplazamiento pendiente en '+ruta);
  assert.doesNotMatch(svg,/<script\b|<foreignObject\b|\bon[a-z]+\s*=|\bhref\s*=/i);
}
assert.ok(js.includes("lineas.push('- '+presentarConjuro(s))"),
  'La copia literal no debe sustituirse por HTML');
assert.ok(js.includes('var metadatos=presentarConjuro(s).slice(s.nombre.length)'),
  'La cadena completa se compone exactamente como antes');
assert.ok(js.includes("texto.appendChild(crear('strong','',s.nombre))"));
assert.ok(js.includes("texto.appendChild(crear('small','conjuro-metadatos',metadatos))"));
assert.ok(js.includes('boton.appendChild(crearIconoPapelera())'));
assert.ok(js.includes("boton.setAttribute('aria-label','Quitar '+s.nombre+' de la lista')"));
assert.ok(js.includes("boton.type='button';boton.dataset.id=s.id;"));
assert.ok(css.includes('.conjuro-texto strong{font-weight:650}'));
assert.ok(css.includes('color:var(--secundario);font-size:.76rem;font-weight:400'));
assert.ok(css.includes('.quitar-conjuro:focus-visible'));
assert.ok(css.includes('color-mix(in srgb,var(--peligro) 10%,var(--fondo2))'));
console.log('OK · Fase 7.1: SVG centrados, metadatos secundarios y papelera accesible.');
