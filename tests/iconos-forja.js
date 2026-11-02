'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const raiz=path.resolve(__dirname,'..'),dir=path.join(raiz,'assets','icons');
const ids=[
  "esp-elfo",
  "esp-enano",
  "esp-humano",
  "esp-mediano",
  "esp-gnomo",
  "esp-semielfo",
  "esp-orco",
  "esp-semiorco",
  "ocu-clerigo",
  "ocu-guerrero",
  "ocu-mago",
  "ocu-ladron",
  "ico-conjuro",
  "ico-tecnica",
  "recurso-salud",
  "recurso-esfuerzo",
  "recurso-movimiento",
  "recurso-potencia",
  "recurso-esencia",
  "recurso-blindaje",
  "equipo-espada",
  "equipo-arco",
  "equipo-varita",
  "equipo-bolsa",
  "equipo-caballo",
  "equipo-mochila",
  "equipo-orbe",
  "equipo-libro",
  "equipo-armadura",
  "equipo-escudo",
  "equipo-municion",
  "ico-configurar",
  "sexo-masculino",
  "sexo-femenino",
  "sexo-indeterminado"
];
assert.deepEqual(
  fs.readdirSync(dir).filter(x=>x.endsWith('.svg')).sort(),
  ids.map(x=>x+'.svg').sort(),'35 archivos autónomos sin iconos ajenos');
for(const id of ids){
  const svg=fs.readFileSync(path.join(dir,id+'.svg'),'utf8');
  assert.match(svg,/<svg[^>]+viewBox="0 0 24 24"/,id+': cuadrado 1:1');
  assert.ok(svg.includes('id="'+id+'"'),id+': identificador');
  assert.ok(svg.includes('<g transform="translate('),id+': centrado proporcional');
  assert.ok(!/<symbol\b|<image\b|<use\b|<script\b/i.test(svg),
    id+': SVG independiente sin recursos remotos');
}
for(const archivo of ['assets/app.js','index.html'])
  assert.ok(!fs.readFileSync(path.join(raiz,archivo),'utf8').includes('icons-forja.svg'),
    archivo+': no referencia el sprite');
assert.equal(fs.existsSync(path.join(raiz,'assets','icons-forja.svg')),false);
const css=fs.readFileSync(path.join(raiz,'assets','styles.css'),'utf8');
assert.ok(css.includes('.icono-svg{')&&css.includes('mask:var(--icono-svg)'));
console.log('OK · 35 iconos autónomos SVG 1:1 y estilos compatibles con temas.');
