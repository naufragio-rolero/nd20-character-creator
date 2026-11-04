'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {prepararDatos,descripcionPoderes,detalleEquipo}=require('../assets/pdf-export-v2.js');
const root=path.join(__dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/equipo-inicial.json'),'utf8'));
const arma=catalog.armas.find(x=>x.nombre==='Hacha de batalla');
assert.equal(arma.dano,'1d8');
assert.equal(arma.durabilidad,'d10');
assert.equal(detalleEquipo('Hacha de batalla',catalog),
  'Hacha de batalla (Daño 1d8 · Durab. d10)');
assert.equal(detalleEquipo('Hacha de batalla ×2',catalog),
  'Hacha de batalla ×2 (Daño 1d8 · Durab. d10)');
assert.equal(detalleEquipo('Escudo pequeño',catalog),
  'Escudo pequeño (Bloqueo +1 · Durab. d6)');
assert.equal(detalleEquipo('Armadura acolchada',catalog),
  'Armadura acolchada (Blindaje d4 · Durab. d4)');
assert.equal(detalleEquipo('Objeto inventado',catalog),'Objeto inventado',
  'No documentar mecánicas inventadas.');
const p={
  juego:'Naufragio d20 · Fantasía',descripcion:'Guerrero · Humano común',
  equipo:['Hacha de batalla','Armadura acolchada','Escudo pequeño','Objeto inventado'],
  arma_equipada:'Hacha de batalla',
  protecciones_equipadas:{armadura:'Armadura acolchada',escudo:'Escudo pequeño'},
  poderes:['[T] Ataque certero'],conjuros_preparados:['[T] Ataque certero'],
  notas:['Observación extensa que debe ir a continuación'],recursos:[],
  competencias:['Armas'],riqueza:'234 mo restantes / 260 mo iniciales'
};
const consultarPoder=function(nombre){
  return nombre.includes('Ataque certero')?
    {descripcion:'Obtienes +2 a la Tirada de Ataque y -2 a la Tirada de Daño (mínimo 1).'}:null;
};
const before=JSON.stringify(p),out=prepararDatos(p,{valor:'d4'},catalog,consultarPoder);
assert.equal(JSON.stringify(p),before,'Ninguna mutación de la ficha');
assert.equal(out._notas.length,1);
assert.deepEqual(out._detallesTalentos,[]);
assert.equal(out._arma_equ,'Hacha de batalla (1d8) · Penetración +1 · Durabilidad d10');
assert.equal(out._dano_equ,'1d8');
assert.equal(out._armadura_equ,'Armadura acolchada (Blindaje d4 · Durabilidad d4)');
assert.equal(out._escudo_equ,'Escudo pequeño (Bloqueo +1 · Durabilidad d6) · Daño d3');
assert.equal(out._detallesPoderes.length,1,'No repetir Poderes preparados y conocidos');
assert(out._detallesPoderes[0].includes('Obtienes +2 a la Tirada de Ataque'));
assert(out._sections.some(x=>x.title==='PODERES CONOCIDOS'));
assert(!out._sections.some(x=>x.title==='CONJUROS Y PODERES CONOCIDOS'));
const sinCatalogo=prepararDatos(p,{valor:'d4'},null,consultarPoder);
assert.equal(sinCatalogo._arma_equ,'','No inventar datos de un arma sin catálogo');
assert.deepEqual(descripcionPoderes({poderes:['[T] Ataque certero','Poder no registrado']},
  consultarPoder),[
    'Ataque certero: Obtienes +2 a la Tirada de Ataque y -2 a la Tirada de Daño (mínimo 1).',
    'Poder no registrado: Descripción no documentada en el catálogo de La Forja.'
  ]);
const efectos=prepararDatos({...p,capacidades:['Meditación'],notas:[
  'Envejecimiento de Especie: desde los 70 años.',
  'Talento de Ocupación — Meditación: Recuperas un Conjuro que hayas lanzado.',
  'Revisión de Conjuros conocidos: 1 preparación(es) retiradas.',
  'Cambio de equipo inicial: Espada por Daga.'
]},null,catalog,consultarPoder);
assert.deepEqual(efectos._notas,['Envejecimiento de Especie: desde los 70 años.']);
assert.deepEqual(efectos._detallesTalentos,
  ['Meditación: Recuperas un Conjuro que hayas lanzado.']);
const natural=prepararDatos(Object.assign({},p,{protecciones_equipadas:{}}),
  {valor:'d6',natural:'Linaje documentado'},catalog);
assert.equal(natural._armadura_equ,'Protección natural (Linaje documentado) · Blindaje d6');
assert(!out._sections.some(x=>x.source==='notas'),
  'Las observaciones nunca entran en los bloques de la primera página.');
assert.equal(out._sections.find(x=>x.source==='equipo').items[0],
  'Hacha de batalla (Daño 1d8 · Durab. d10)');
const html=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/styles.css'),'utf8');
const bridge=fs.readFileSync(path.join(root,'assets/pdf-export-browser.js'),'utf8');
assert(html.includes('acciones-pie-ficha'));
assert(html.includes('class="exportar-pdf-ficha accion-icono"'));
assert(html.includes('class="gestionar-equipo accion-icono"'));
assert(html.includes('aria-label="Equipar y gestionar el equipo"'));
assert(!html.includes('>Útiles</button>'));
assert(html.includes('class="copiar-ficha accion-icono"'));
assert(html.indexOf('acciones-pie-ficha')<html.indexOf('fuentes-pie-ficha'));
assert(html.includes('blindajePersonaje(entradaPdf.valor),datos.equipoInicial'));
assert(html.includes("p[0]==='Blindaje'&&blindaje?.bonoEscudo"),
  'La nota de bloqueo aparece dentro del bloque Blindaje.');
const kpi=html.slice(html.indexOf('function htmlRecursos('),
  html.indexOf('function htmlProteccionesEquipadas('));
assert(kpi.indexOf("items.push(['Daño',dano.valor])")<
  kpi.indexOf("items.push(['Blindaje'"));
assert(kpi.indexOf("items.push(['Blindaje'")<
  kpi.indexOf("items.push.apply(items,potencia)"),
  'La segunda fila debe ser Daño, Blindaje y Potencia.');
assert(css.includes('.recurso-texto>.recurso-nota-escudo'));
assert(bridge.includes('consultarPoder:consultarPoder'));
assert(css.includes('.acciones-pie-ficha'));
assert(bridge.includes("RUTA+'icons/'+id+'.svg"));
assert(bridge.includes('canvas.toBlob'));
console.log('OK: botones arriba, notas separadas, armas/escudo DRS e iconos SVG oficiales.');
