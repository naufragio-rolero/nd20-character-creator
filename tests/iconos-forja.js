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
const acciones={
  'accion-equipo':'backpack',
  'accion-talentos':'sparkles',
  'accion-pdf':'file-type-pdf',
  'accion-semilla':'fingerprint',
  'accion-copiar':'copy'
};
assert.deepEqual(
  fs.readdirSync(dir).filter(x=>x.endsWith('.svg')).sort(),
  ids.concat(Object.keys(acciones)).map(x=>x+'.svg').sort(),
  '40 SVG autónomos: 35 aprobados + 5 acciones MIT');
const originalesPropios=new Set(["ico-configurar","recurso-salud","recurso-esfuerzo","recurso-movimiento","recurso-potencia","recurso-esencia","recurso-blindaje"]);
assert.equal(originalesPropios.size,7,'7 iconos originales propios en el catálogo');
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
for(const [id,original] of Object.entries(acciones)){
  const svg=fs.readFileSync(path.join(dir,id+'.svg'),'utf8');
  assert.match(svg,/viewBox="0 0 24 24"/,id+': lienzo cuadrado 1:1');
  assert.ok(svg.includes('stroke="currentColor"'),id+': trazo monocromático');
  assert.ok(svg.includes('width="24"')&&svg.includes('height="24"'));
  assert.ok(!/<script\b|<image\b|<use\b|<foreignObject\b/i.test(svg),
    id+': sin scripts, dependencias ni recursos remotos');
  assert.ok(svg.includes('</svg>'),id+': fuente SVG local integra');
  assert.ok(original,'Icono Tabler documentado');
}
const licencia=fs.readFileSync(path.join(dir,'LICENCIA-TABLER.txt'),'utf8');
assert.match(licencia,/Tabler Icons v3\.50\.0/);
assert.match(licencia,/MIT License/);
assert.match(licencia,/Copyright \(c\) 2020-2026 Paweł Kuna/);
for(const nombre of Object.values(acciones))assert.ok(licencia.includes(nombre),
  nombre+': fuente upstream registrada');
for(const archivo of ['assets/app.js','index.html'])
  assert.ok(!fs.readFileSync(path.join(raiz,archivo),'utf8').includes('icons-forja.svg'),
    archivo+': no referencia el sprite');
assert.equal(fs.existsSync(path.join(raiz,'assets','icons-forja.svg')),false);
const css=fs.readFileSync(path.join(raiz,'assets','styles.css'),'utf8');
assert.ok(css.includes('.icono-svg{')&&css.includes('mask:var(--icono-svg)'));
for(const id of Object.keys(acciones))
  assert.ok(css.includes('url(icons/'+id+'.svg)'),id+': máscara local en CSS');
assert.ok(css.includes('button.accion-icono')&&css.includes('width:44px'),
  'Los botones de acciones usan zona táctil de 44px');
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
assert.equal(originales.length,51,'40 SVG históricos mas 11 nuevas fuentes de categorias; Goblin en reserva');
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
assert.equal(creditos.split('\n').filter(line=>line.includes(' — https://game-icons.net/1x1/')&&!line.startsWith('categoria-')).length,28,
  '28 iconos derivados con sus enlaces originales');
for(const id of originalesPropios) assert.ok(creditos.includes(id+'.svg — diseño original propio'),
  'Atribucion como diseño propio '+id);

const fuentesDecididas=[
  ["esp-humano","person","Delapouite"],
  ["esp-elfo","elf-helmet","Kier Heyl"],
  ["esp-orco","orc-head","Delapouite"],
  ["esp-semielfo","elf-ear","Delapouite"],
  ["esp-mediano","baby-face","Delapouite"],
  ["esp-gnomo","big-gear","DarkZaitzev"],
  ["ocu-mago","pointy-hat","Lorc"],
  ["ocu-guerrero","axe-sword","Delapouite"],
  ["ocu-ladron","robin-hood-hat","Delapouite"],
  ["ocu-clerigo","pope-crown","Delapouite"],
];
for(const [id,icono,autor] of fuentesDecididas){
  const svg=fs.readFileSync(path.join(dir,id+'.svg'),'utf8');
  assert.ok(svg.includes('de "'+icono+'"'),id+': origen esperado '+icono);
  assert.ok(svg.includes('por '+autor),id+': autor del diseño');
  assert.ok(creditos.includes(id+'.svg — '+icono+' — '+autor),id+': credito actualizado');
}
assert.ok(creditos.includes('esp-mediano.svg — baby-face'),
  'Los medianos ya no tienen puerta de hobbit');
assert.ok(!fs.readFileSync(path.join(dir,'esp-gnomo.svg'),'utf8').includes('pointy-hat'),
  'El gnomo ya no comparte el sombrero del Mago');
assert.ok(fs.readFileSync(path.join(dir,'ocu-mago.svg'),'utf8').includes('pointy-hat'),
  'El Mago conserva el sombrero puntiagudo');
assert.ok(fs.existsSync(path.join(rutaOrigen,'darkzaitzev','big-gear.svg')),
  'El SVG original big-gear se conserva como fuente');

const index=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
assert.ok(index.includes('assets/icons/CREDITOS-GAME-ICONS.txt'),
  'Créditos Game-icons enlazados desde La Forja');
assert.ok(index.includes('assets/icons/LICENCIA-TABLER.txt'),
  'Licencia MIT Tabler enlazada desde La Forja');
for(const nombre of Object.keys(acciones))
  assert.ok(appJs.includes('icono-accion '+nombre),nombre+': pie de ficha con pictograma');

console.log('OK · 40 SVG 1:1 (35 anteriores + 5 Tabler MIT), licencias y máscaras CSS.');
