'use strict';
/* Fase 7.5: todo el trabajo propio sin duplicar reglas ni romper v1. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const api=require('../assets/spell-lists.js');
const c=api.crearCatalogo(read('data/conjuros-drs-fichas.json'),read('data/catalogo-poderes.json'));
const b=api.leerBorradores(read('data/listas-conjuros-borradores.json'),c);
let lib=api.duplicarLista(api.vacia(c),'drs:Mago','usuario:exportmage123',
  'Mago para nueva Ocupación',c,b);
const tabla=Array.from({length:30},()=>Array(8).fill(0));
tabla[0][0]=3;tabla[4][1]=2;
lib=api.guardarLista(lib,{...lib.listas[0],progresion:{tipo:'personal',niveles:tabla}},c,b);
lib=api.vincular(lib,'Mi nueva Ocupación',lib.listas[0].id,'drs:Mago',c,b);
const vista={
  presentacion:{escuela:true,origen:false,tema:'violeta'},
  filtros:{nombre:'dardo',circulo:'1',escuela:'Elemental'},
  listaActiva:lib.listas[0].id
};
const json=api.exportarTrabajo(lib,vista,c,b);
const completo=JSON.parse(json);
assert.equal(completo.esquema,api.ESQUEMA_TRABAJO);
assert.equal(completo.version_drs,c.versionDRS);
assert.equal(completo.biblioteca.esquema,api.ESQUEMA);
assert.equal(completo.biblioteca.asociaciones[0].ocupacion,'Mi nueva Ocupación');
assert.equal(completo.biblioteca.listas[0].progresion.niveles[0][0],3);
assert.equal(completo.biblioteca.listas[0].derivadaDe,'drs:Mago');
assert.deepEqual(completo.vista,vista);
assert.ok(!json.includes('texto_normativo')&&!json.includes('efectos')&&
  !json.includes('Lanzas una púa venenosa'),'No incrustar los textos del DRS.');
const round=api.importarTrabajo(json,c,b);
assert.equal(round.formato,'trabajo-v1');
assert.deepEqual(round.biblioteca,lib);
assert.deepEqual(round.vista,vista);
assert.deepEqual(api.exportarTrabajo(round.biblioteca,round.vista,c,b),json);
const simple=api.exportar(lib,c,b);
const antiguo=api.importarTrabajo(simple,c,b);
assert.equal(antiguo.formato,'biblioteca-v1');
assert.equal(antiguo.vista,null);
assert.deepEqual(antiguo.biblioteca,lib);
assert.deepEqual(api.importar(simple,c,b),lib);
const original=JSON.stringify(c.oficiales);
for(const mutar of [
  x=>{x.esquema='naufragio.forja-conjuros-trabajo/v2';},
  x=>{x.version_drs='0.0.0';},
  x=>{x.biblioteca.version_drs='0.0.0';},
  x=>{x.biblioteca.listas[0].id='drs:Mago';},
  x=>{x.biblioteca.listas[0].conjuros=['intruso'];},
  x=>{x.biblioteca.listas[0].progresion.niveles[0][0]=-1;},
  x=>{x.biblioteca.listas[0].derivadaDe='drs:Inventado';},
  x=>{x.biblioteca.asociaciones[0].listaId='usuario:desconocido';},
  x=>{x.vista.presentacion.tema='desconocido';},
  x=>{x.vista.presentacion.escuela='sí';},
  x=>{x.vista.filtros.circulo='9';},
  x=>{x.vista.filtros.escuela='Inventada';},
  x=>{x.vista.filtros.escuela='Naturaleza';},
  x=>{x.vista.listaActiva='usuario:desconocido';},
  x=>{x.vista.filtros.nombre='X'.repeat(121);}
]){
  const mal=JSON.parse(json);mutar(mal);
  assert.throws(()=>api.importarTrabajo(JSON.stringify(mal),c,b),
    /incompatib|versi[oó]n|inv[aá]lid|incorrect|proteg|progresi[oó]n|procedencia|desconocid|inexistente|no existe|ajeno|m[aá]ximo/i);
}
assert.throws(()=>api.importarTrabajo('no json',c,b),SyntaxError);
assert.throws(()=>api.importarTrabajo(' '.repeat(1024*1024+1),c,b),/grande/);
assert.deepEqual(c.oficiales,JSON.parse(original),'No se han mutado fuentes oficiales.');
const legacy=api.vacia(c);
const vistaNueva={
  presentacion:{escuela:false,origen:true,tema:'clasico'},
  filtros:{nombre:'',circulo:'',escuela:''},listaActiva:'drs:Clérigo'
};
assert.deepEqual(api.importarTrabajo(api.exportarTrabajo(legacy,vistaNueva,c,b),c,b).vista,
  vistaNueva,'Una vista oficial se transporta sin incorporar sus Conjuros al JSON.');
console.log('OK · Fase 7.5: espacio completo, listas, tablas, asociaciones, tema, filtros, v1 y 15 rechazos.');
