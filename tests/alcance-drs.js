'use strict';
/* Comprobaciones del producto base. No supone que toda su mecánica esté finalizada. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const reglas=require('../assets/rules.js');
const raiz=path.join(__dirname,'..');
const leer=(nombre)=>JSON.parse(fs.readFileSync(path.join(raiz,'data',nombre),'utf8'));
const manifest=leer('alcance-drs-y-dlc.json');
const especies=leer('especies.json');
const ocupaciones=leer('ocupaciones.json');
const ampliado=leer('catalogo-ampliado.json');
const catalogo=leer('catalogo-poderes.json');
const magnitudes=leer('conjuros-magnitudes-literales.json');
const progresiones=leer('progresiones-oficiales.json');

assert.deepEqual(manifest.fuentes_publicadas_fantasia,['DRS'],
  'DRS única fuente publicada para Fantasía en esta fase');
assert.equal(manifest.estado,'desarrollo_y_auditoria_pendientes_no_publicado');
assert.deepEqual(manifest.drs.especies,Object.keys(especies),
  'Las 8 Especies del DRS se conservan en el núcleo');
assert.deepEqual(manifest.drs.ocupaciones,Object.keys(ocupaciones),
  'Las 4 Ocupaciones del DRS se conservan en el núcleo');
assert.equal(manifest.drs.especies.length,8);
assert.equal(manifest.drs.ocupaciones.length,4);
assert.equal(new Set(manifest.drs.especies).size,8);
assert.equal(new Set(manifest.drs.ocupaciones).size,4);
assert.equal(Object.keys(ampliado.fantasia.especies).length,22);
assert.equal(Object.keys(ampliado.fantasia.ocupaciones).length,33);
for(const nombre of manifest.drs.especies)
  assert.ok(!Object.hasOwn(ampliado.fantasia.especies,nombre),
    'No sobreescribir Especie base con DLC: '+nombre);
for(const nombre of manifest.drs.ocupaciones)
  assert.ok(!Object.hasOwn(ampliado.fantasia.ocupaciones,nombre),
    'No sobreescribir Ocupación base con DLC: '+nombre);
const drs=catalogo.conjuros.filter(x=>x.origen==='Nd20');
assert.equal(drs.length,64,'64 Conjuros del DRS como punto de partida');
assert.equal(manifest.drs.conjuros.length,64);
assert.deepEqual(manifest.drs.conjuros,
  drs.map(x=>({id:x.id,nombre:x.nombre,circulo:x.circulo})),
  'Identidades y Círculos del núcleo DRS no alterados por suplementos');
assert.equal(new Set(manifest.drs.conjuros.map(x=>x.id)).size,64);
const magIds=new Set(magnitudes.registros.map(x=>x.id_catalogo));
const drsCotejados=drs.filter(x=>magIds.has(x.id));
assert.equal(drsCotejados.length,manifest.drs.recuentos.conjuros_magnitudes_verificadas);
assert.equal(drsCotejados.length,32,'La cobertura es parcial y no implica ejecución');
assert.equal(drs.length-drsCotejados.length,32,'Quedan 32 con magnitudes pendientes');

for(const nombre of manifest.drs.ocupaciones){
  const tabla=progresiones.fantasia[nombre];
  assert.ok(tabla,'Progresión DRS incluida: '+nombre);
  assert.equal(tabla.niveles.length,30,'Una fila por Nivel 1–30: '+nombre);
  assert.ok(tabla.niveles.every(x=>Array.isArray(x)&&x.every(Number.isFinite)),
    'Filas numéricas verificables: '+nombre);
}
const origenes={
  especies:Object.fromEntries(Object.keys(especies).map(x=>[x,'DRS'])),
  ocupaciones:Object.fromEntries(Object.keys(ocupaciones).map(x=>[x,'DRS']))
};
const fuenteBase={especies,ocupaciones,fuentes:origenes};
for(const ocupacion of manifest.drs.ocupaciones){
  for(const especie of manifest.drs.especies){
    for(const nivel of [1,12,30]){
      const cfg={juego:'nd20',ocupacion,especie,nivel,fuentes:['DRS']};
      const personaje=reglas.crearNd20(fuenteBase,cfg,
        reglas.aleatorioSemilla('DRS/'+ocupacion+'/'+especie+'/'+nivel));
      assert.equal(personaje.descripcion,ocupacion+' · '+especie);
      assert.equal(personaje.procedenciaOcupacion,'DRS');
      assert.equal(personaje.procedenciaEspecie,'DRS');
      assert.equal(personaje.nivel,nivel);
    }
  }
}
for(const paquete of manifest.paquetes_posteriores){
  assert.equal(paquete.precio,'gratuito');
  assert.equal(paquete.estado,'pendiente_de_auditoria_y_publicacion');
}
assert.equal(manifest.paquetes_posteriores.find(x=>x.id==='magia_ampliada')
  .registros_unicos_catalogo,369);
assert.equal(manifest.paquetes_posteriores.find(x=>x.id==='especies_fantasia')
  .registros_disponibles,22);
assert.equal(manifest.paquetes_posteriores.find(x=>x.id==='ocupaciones_fantasia')
  .registros_disponibles,33);
const app=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
assert.ok(app.includes("alcanceDRS:'data/alcance-drs-y-dlc.json'"));
assert.ok(app.includes("nombres=nombres.filter(function(nombre){return publicadas.includes(nombre);});"),
  'El navegador solo ofrece las fuentes de Fantasía publicadas');
assert.ok(app.includes("if(juego==='nd20')"),
  'Otras líneas de juego conservan sus selector de fuentes actual');
console.log('OK · Núcleo DRS: 8 Especies, 4 Ocupaciones, 64 Conjuros; 96 generaciones combinadas; DLC separados.');
