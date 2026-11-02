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
const originalesPropios=new Set(["esp-humano","esp-elfo","esp-orco","esp-semielfo","ico-configurar","recurso-salud","recurso-potencia","recurso-esfuerzo","recurso-blindaje","recurso-movimiento","recurso-esencia"]);
assert.equal(originalesPropios.size,11,'11 iconos propios aprobados');
for(const id of ids){
  const svg=fs.readFileSync(path.join(dir,id+'.svg'),'utf8');
  assert.match(svg,/<svg[^>]+viewBox="0 0 24 24"/,id+': cuadrado 1:1');
  assert.ok(svg.includes('id="'+id+'"'),id+': identificador');
  if(originalesPropios.has(id)){
    assert.match(svg,/Icono original de Naufragio d20 aprobado/,
      id+': diseño original aprobado, no derivado de Game-icons');
    assert.ok(!svg.includes('Game-icons.net'),id+': sin atribucion ajena');
  }else{
    assert.ok(svg.includes('<g transform="translate('),id+': original Game-icons escalado');
    assert.match(svg,/Game-icons.net/,id+': atribucion de derivado');
  }
  assert.ok(!/<symbol\b|<image\b|<use\b|<script\b/i.test(svg),
    id+': SVG independiente sin recursos remotos');
}
for(const archivo of ['assets/app.js','index.html'])
  assert.ok(!fs.readFileSync(path.join(raiz,archivo),'utf8').includes('icons-forja.svg'),
    archivo+': no referencia el sprite');
assert.equal(fs.existsSync(path.join(raiz,'assets','icons-forja.svg')),false);
const css=fs.readFileSync(path.join(raiz,'assets','styles.css'),'utf8');
assert.ok(css.includes('.icono-svg{')&&css.includes('mask:var(--icono-svg)'));
assert.ok(css.includes('url(icons/ico-configurar.svg)'),
  'El boton de configurar resuelve el SVG desde la hoja assets/styles.css');
const appJs=fs.readFileSync(path.join(raiz,'assets','app.js'),'utf8');
assert.ok(appJs.includes("new URL('assets/icons/'+id+'.svg',document.baseURI)"),
  'Las mascaras dinamicas generan URL absoluta sin duplicar assets');
assert.ok(!appJs.includes("'url(assets/icons/"),
  'No quedan mascaras dinamicas de rutas relativas ambiguas');

const rutaOrigen=path.join(raiz,'docs','iconografia','originales','game-icons');
const originales=fs.readdirSync(rutaOrigen).flatMap(autor=>
  fs.readdirSync(path.join(rutaOrigen,autor)).filter(x=>x.endsWith('.svg')));
assert.equal(originales.length,35,'35 SVG originales, incluido Goblin head reservado');
assert.ok(fs.existsSync(path.join(rutaOrigen,'delapouite','goblin-head.svg')),
  'El original de goblin queda en reserva, no asignado al semiorco');
const semiorco=fs.readFileSync(path.join(dir,'esp-semiorco.svg'),'utf8');
assert.match(semiorco,/mitad-orco/,'El semiorco combina dos fuentes');
assert.match(semiorco,/mitad-humano/,'El semiorco tiene mitad humana');
for(const id of ids){
  const svg=fs.readFileSync(path.join(dir,id+'.svg'),'utf8');
  assert.ok(!svg.includes('M0 0h512v512H0z'),'Sin fondo opaco original');
}
const creditos=fs.readFileSync(path.join(dir,'CREDITOS-GAME-ICONS.txt'),'utf8');
for(const id of ids) assert.ok(creditos.includes(id+'.svg'),'Crédito '+id);
assert.equal(creditos.split('\n').filter(line=>line.includes(' — https://game-icons.net/1x1/')).length,24,
  '24 iconos derivados con sus enlaces originales');
for(const id of originalesPropios) assert.ok(creditos.includes(id+'.svg — diseño original propio'),
  'Atribucion como diseño propio '+id);
assert.ok(fs.readFileSync(path.join(raiz,'index.html'),'utf8')
  .includes('assets/icons/CREDITOS-GAME-ICONS.txt'),'Créditos enlazados desde la Forja');

console.log('OK · 35 SVG 1:1 (11 originales aprobados + 24 derivados), créditos y originales archivados.');
