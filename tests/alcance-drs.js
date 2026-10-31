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
assert.equal(manifest.estado,'datos_de_conjuros_drs_integrados_revision_de_mecanicas_pendiente_no_publicado');
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
assert.equal(drsCotejados.length,64,'Todos los DRS estructurados, no ejecutables');
assert.equal(drs.length-drsCotejados.length,0,'No quedan magnitudes DRS pendientes');
assert.equal(manifest.drs.recuentos.conjuros_magnitudes_pendientes,0);

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
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
assert.ok(html.includes('id="aviso-alcance-drs"'));
assert.ok(html.includes('DLC gratuitos'));
assert.ok(app.includes("$('aviso-alcance-drs').hidden = juego!=='nd20'"));
console.log('OK · Núcleo DRS: 8 Especies, 4 Ocupaciones, 64 Conjuros; 96 generaciones combinadas; DLC separados.');


/* Certificar trazabilidad del DRS, sin declarar completado el motor de lanzamiento. */
const fichas=leer('conjuros-revisados-001-225.json').conjuros.concat(
  leer('conjuros-revisados-226-434.json').conjuros);
const byId=new Map(fichas.map(x=>[x.id_catalogo,x]));
const byMagnitud=new Map(magnitudes.registros.map(x=>[x.id_catalogo,x]));
const drsNumeros=new Set();
const motor=require('../assets/spell-magnitudes.js');
for(const conjuro of drs){
  const fuente=byId.get(conjuro.id);
  const registro=byMagnitud.get(conjuro.id);
  assert.ok(fuente,'Texto cotejado del DRS: '+conjuro.nombre);
  assert.ok(registro,'Magnitudes del DRS: '+conjuro.nombre);
  assert.ok(fuente.parrafos.join(' ').includes(registro.evidencia_literal),
    'Evidencia literal vigente '+conjuro.nombre);
  assert.equal(fuente.id_catalogo,conjuro.id);
  assert.equal(fuente.numero_tomo,registro.numero_tomo);
  assert.ok(registro.magnitudes.length>=1,'Magnitud de '+conjuro.nombre);
  drsNumeros.add(registro.numero_tomo);
  for(const nivel of [1,5,10,30]){
    const evaluado=motor.evaluar(magnitudes,conjuro.id,nivel);
    assert.equal(evaluado.id_catalogo,conjuro.id);
    assert.equal(evaluado.magnitudes.length,registro.magnitudes.length);
    assert.equal(evaluado.estado,'magnitudes_literales_sin_resolver_tiradas');
  }
}
assert.equal(drsNumeros.size,64,'Un registro documental por Conjuro DRS');
assert.equal(magnitudes.cobertura_drs.conjuros_con_magnitudes,64);
assert.equal(magnitudes.cobertura_drs.conjuros_totales,64);
const drsNuevos=[
  1,5,13,14,15,16,19,21,29,31,32,35,37,38,39,41,
  43,44,45,48,49,52,53,54,55,57,58,59,60,61,62,63
];
assert.equal(drsNuevos.length,32);
for(const id of drsNuevos)assert.ok(byMagnitud.has('conjuro-'+id),
  'Debe estar incorporado el Conjuro DRS '+id);
const magnitud=(id,n,clave)=>motor.evaluar(magnitudes,'conjuro-'+id,n)
  .magnitudes.find(x=>x.clave===clave)?.valor;
assert.equal(magnitud(1,9,'duracion_intervalos'),9);
assert.equal(magnitud(5,9,'alcance_m'),20);
assert.equal(magnitud(13,9,'nivel_cerradura_apertura_automatica'),9);
assert.equal(magnitud(14,9,'danio_turnos_3_y_4'),'2d6');
assert.equal(magnitud(15,9,'duracion_turnos'),'1d6+1');
assert.equal(magnitud(16,4,'curacion_salud'),'0d6');
assert.equal(magnitud(16,5,'curacion_salud'),'2d6');
assert.equal(magnitud(16,14,'curacion_salud'),'4d6');
assert.equal(magnitud(16,15,'curacion_salud'),'6d6');
assert.equal(magnitud(19,9,'factor_blindaje_frente_elemento'),2);
assert.equal(magnitud(21,9,'danio_exito_relampago'),'2d8');
assert.equal(magnitud(21,9,'danio_fallo_fuerza'),'1d6');
assert.equal(magnitud(29,11,'alcance_m'),14);
assert.equal(magnitud(31,11,'nivel_maximo_maldicion'),11);
assert.equal(magnitud(32,11,'danio_ruptura_cada_uno'),'2d10');
assert.equal(magnitud(35,11,'duracion_turnos'),11);
assert.equal(magnitud(37,11,'blindaje_sin_armadura'),'1d6');
assert.equal(magnitud(37,11,'bono_con_armadura'),2);
assert.equal(magnitud(38,11,'duracion_intervalos'),11);
assert.equal(magnitud(38,11,'nivel_maximo_forma'),undefined,
  'Polimorfia depende del Nivel de objetivo, no de lanzador');
assert.equal(magnitud(39,11,'duracion_turnos'),22);
assert.equal(magnitud(41,11,'danio_magico_cortante'),'1d8');
assert.equal(magnitud(43,11,'factor_profundidad'),3);
assert.equal(magnitud(44,11,'maximo_niveles_total_muertos_vivientes'),11);
assert.equal(magnitud(45,11,'duracion_objeto_turnos'),'3d6');
assert.equal(magnitud(48,11,'danio_elemental'),'11d8');
assert.equal(magnitud(49,11,'ventana_danio_previo_minutos'),60);
assert.equal(magnitud(52,11,'lanzamiento_turnos'),2);
assert.equal(magnitud(53,11,'duracion_turnos'),33);
assert.equal(magnitud(54,11,'danio_fuego'),'5d6');
assert.equal(magnitud(54,11,'danio_radiante'),'5d6');
assert.equal(magnitud(55,11,'fraccion_salud_maxima'),0.5);
assert.equal(magnitud(57,11,'area_km2'),1);
assert.equal(magnitud(58,11,'fraccion_curacion_lanzador'),0.5);
assert.equal(magnitud(59,11,'maximo_segadores_activos'),1);
assert.equal(magnitud(60,11,'variacion_masa_maxima_porcentaje'),30);
assert.equal(magnitud(61,11,'alcance_m'),11);
assert.equal(magnitud(62,11,'antiguedad_cadaver_max_horas'),48);
assert.equal(magnitud(63,11,'acompanantes_maximos'),4);
const dual=leer('conjuros-danio-compuesto.json').registros;
const tormenta=dual.find(x=>x.id_catalogo==='conjuro-41');
assert.deepEqual(tormenta.tipos,['mágico','cortante']);
assert.equal(tormenta.grupos_de_dados,1);
assert.ok(tormenta.condicion_activacion.includes('si falla, mitad'));
assert.equal(motor.clasificarDanioCompuesto(tormenta,[],tormenta.tipos)
  .multiplicador_debilidad,2);
assert.ok(!dual.some(x=>x.id_catalogo==='conjuro-54'),
  'Rayo solar son dos grupos 5d6, no daño dual de un solo grupo');
console.log('OK · 64/64 Conjuros DRS: magnitudes cotejadas y calculadas sin Tiradas.');
