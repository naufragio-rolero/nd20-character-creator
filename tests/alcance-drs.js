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
assert.equal(magnitud(44,11,'numero_maximo_muertos_vivientes'),11);
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


/* Auditoría normativa de Especies del DRS v1.1.12: no basta comprobar su presencia. */
const perfilesEspecieDRS={
  'Elfo agreste':{salud:'d8',movimiento:7,requisitos:{Agilidad:7}},
  'Enano montañés':{salud:'d10',movimiento:5,requisitos:{Resistencia:7}},
  'Humano común':{salud:'d6',movimiento:6,requisitos:{}},
  'Mediano amable':{salud:'d4',movimiento:5,requisitos:{Presencia:7}},
  'Gnomo urbano':{salud:'d4',movimiento:5,requisitos:{Mente:7,Intuición:7}},
  'Semielfo':{salud:'d6',movimiento:6,requisitos:{}},
  'Orco común':{salud:'d10',movimiento:6,requisitos:{Fuerza:7}},
  'Semiorco':{salud:'d8',movimiento:6,requisitos:{}}
};
for(const [nombre,esperado] of Object.entries(perfilesEspecieDRS)){
  const perfil=especies[nombre];
  assert.ok(perfil,'Especie DRS: '+nombre);
  assert.equal(perfil.salud,esperado.salud,'Dado Salud DRS: '+nombre);
  assert.equal(perfil.movimiento,esperado.movimiento,'Movimiento DRS: '+nombre);
  const requisitos={};
  if(perfil.atributo_requisito)
    requisitos[perfil.atributo_requisito]=perfil.atributo_valor;
  for(const req of perfil.requisitos||[]){
    assert.ok(!Object.hasOwn(requisitos,req.atributo),
      'Requisito duplicado en '+nombre+': '+req.atributo);
    requisitos[req.atributo]=req.minimo;
  }
  assert.deepEqual(requisitos,esperado.requisitos,'Requisitos VA del DRS: '+nombre);
}
const ocupacionesDRSNormativas={
  'Clérigo':{favoritos:['Intuición'],salud:0,esfuerzo:3},
  'Guerrero':{favoritos:['Fuerza','Agilidad','Resistencia'],salud:1,esfuerzo:4},
  'Mago':{favoritos:['Mente'],salud:-1,esfuerzo:2},
  'Ladrón':{favoritos:['Agilidad'],salud:-1,esfuerzo:4}
};
for(const [nombre,esperado] of Object.entries(ocupacionesDRSNormativas)){
  const perfil=ocupaciones[nombre];
  assert.ok(perfil,'Ocupación DRS: '+nombre);
  assert.deepEqual(perfil.atributo_favorito,esperado.favoritos,'Favoritos DRS: '+nombre);
  assert.equal(perfil.salud,esperado.salud,'Modificador Salud DRS: '+nombre);
  assert.equal(perfil.esfuerzo,esperado.esfuerzo,'Esfuerzo DRS: '+nombre);
}
// La selección de Especie precede al Atributo favorito de Ocupación.
// Un Gnomo con Intuición suficiente pero Mente insuficiente no es elegible.
const rngAtributos=(valores)=>{let i=0;return ()=>valores[(i++)%valores.length];};
assert.throws(()=>reglas.crearNd20(fuenteBase,
  {juego:'nd20',nivel:1,especie:'Gnomo urbano',ocupacion:'Mago'},
  rngAtributos([0,0,0,0,0.6,0])),/No se cumplen los requisitos/,
  'El Mago no puede habilitar Mente 7+ con su +1 favorito después de elegir la Especie');
const gnomoValido=reglas.crearNd20(fuenteBase,
  {juego:'nd20',nivel:1,especie:'Gnomo urbano',ocupacion:'Mago'},
  rngAtributos([0,0,0,0.6,0.6,0]));
assert.ok(['Mente','Intuición'].every(nombre=>
  gnomoValido.atributos.find(x=>x.nombre===nombre).valor>=7),
  'El Gnomo urbano respeta los dos requisitos VA');
for(const nivel of [1,12,30]){
  const pj=reglas.crearNd20(fuenteBase,
    {juego:'nd20',nivel,especie:'Humano común',ocupacion:'Guerrero'},
    reglas.aleatorioSemilla('Guerrero DRS/'+nivel));
  assert.ok(pj.capacidades.includes('Recuperación'),'Recuperación es un Talento fijo');
  assert.equal(['Brío musculoso','Sacrificio de escudo'].filter(t=>
    pj.capacidades.includes(t)).length,1,
    'Guerrero debe elegir EXACTAMENTE un Talento opcional (API directa)');
  const sinElegir=reglas.crearNd20(fuenteBase,
    {juego:'nd20',nivel,especie:'Humano común',ocupacion:'Guerrero',
      aplazarElecciones:true},
    reglas.aleatorioSemilla('Guerrero DRS/'+nivel));
  assert.equal(['Brío musculoso','Sacrificio de escudo'].filter(t=>
    sinElegir.capacidades.includes(t)).length,0,
    'La web debe reservar esa elección para el editor');
}
const planificadorDRS=require('../assets/powers.js');
// Herencia dual: dos opciones excluyentes; Buen desarrollo permite elegir
// cualquiera de los seis Atributos y se aplica ANTES de subir de Nivel.
for(const [especie,alternativa] of [
  ['Semielfo','Linaje feérico'],
  ['Semiorco','Ira interna']
]){
  assert.deepEqual(especies[especie].herencia_dual,['Buen desarrollo',alternativa],
    'La fuente mecánica de Herencia dual es el catálogo DRS');
  const planPersonal=planificadorDRS.planificar(
    {juego:'nd20',modo:'personalizado',nivel:1,ocupacion:'Mago',especie},
    fuenteBase,catalogo,progresiones);
  const paso=planPersonal.pasos.find(x=>x.id==='herencia-dual');
  assert.ok(paso,'Elección explícita de Herencia dual: '+especie);
  assert.equal(paso.tipo,'herencia_dual');
  assert.deepEqual(paso.opciones.map(x=>x.id),[
    alternativa,
    ...['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia']
      .map(x=>'Buen desarrollo:'+x)
  ],'Alternativa DRS + seis Atributos posibles: '+especie);
  const planRapido=planificadorDRS.planificar(
    {juego:'nd20',modo:'rapido',nivel:1,ocupacion:'Mago',especie},
    fuenteBase,catalogo,progresiones);
  assert.ok(!planRapido.pasos.some(x=>x.id==='herencia-dual'),
    'En Rápido la elección se resuelve durante la creación: '+especie);

  // Las dos ramas comparten toda la creación previa a la elección.
  const base=reglas.crearNd20(fuenteBase,{
    juego:'nd20',nivel:1,ocupacion:'Mago',especie,
    aplazarElecciones:true,herenciaPendiente:true
  },reglas.aleatorioSemilla('Herencia DRS/'+especie+'/1'));
  assert.equal(base.herencia_dual,null,'Editor pendiente de elección');
  assert.ok(!base.capacidades.includes(alternativa)&&
    !base.capacidades.includes('Buen desarrollo'));
  for(const atributo of ['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia']){
    const elegido=reglas.crearNd20(fuenteBase,{
      juego:'nd20',nivel:1,ocupacion:'Mago',especie,
      aplazarElecciones:true,herenciaDual:'Buen desarrollo',
      atributoBuenDesarrollo:atributo
    },reglas.aleatorioSemilla('Herencia DRS/'+especie+'/1'));
    assert.equal(elegido.herencia_dual,'Buen desarrollo');
    assert.equal(elegido.atributo_buen_desarrollo,atributo);
    assert.ok(elegido.capacidades.includes('Buen desarrollo'));
    assert.ok(!elegido.capacidades.includes(alternativa));
    for(const actual of elegido.atributos)
      assert.equal(actual.valor-base.atributos.find(x=>x.nombre===actual.nombre).valor,
        actual.nombre===atributo?1:0,
        'Buen desarrollo modifica solo su VA elegido antes de progresión: '+especie);
    assert.equal(elegido.nombre,base.nombre,'No modificar identidad al elegir');
  }
  for(const nivel of [1,5,12,30]){
    for(const ocupacion of ['Clérigo','Guerrero','Mago','Ladrón']){
      const semilla='Herencia DRS/'+especie+'/'+ocupacion+'/'+nivel;
      const config={juego:'nd20',nivel,ocupacion,especie,aplazarElecciones:true};
      const pendiente=reglas.crearNd20(fuenteBase,{
        ...config,herenciaPendiente:true
      },reglas.aleatorioSemilla(semilla));
      for(const [eleccion,atributo] of [[alternativa,null],['Buen desarrollo','Mente']]){
        const cfg={...config,herenciaDual:eleccion,atributoBuenDesarrollo:atributo};
        const personaje=reglas.crearNd20(fuenteBase,cfg,reglas.aleatorioSemilla(semilla));
        const repetido=reglas.crearNd20(fuenteBase,cfg,reglas.aleatorioSemilla(semilla));
        assert.deepEqual(personaje,repetido,'Semilla estable '+semilla);
        assert.equal(personaje.descripcion,pendiente.descripcion,'Especie/Ocupación intactas');
        assert.equal(personaje.herencia_dual,eleccion);
        assert.ok(personaje.capacidades.includes(eleccion));
        assert.ok(!personaje.capacidades.includes(
          eleccion==='Buen desarrollo'?alternativa:'Buen desarrollo'),
          'No se deben conceder ambas alternativas de Herencia dual');
        assert.equal(personaje.atributo_buen_desarrollo,atributo);
        assert.ok(personaje.atributos.every(x=>x.valor>=4&&x.valor<=18&&x.valor+x.dificultad===20));
      }
    }
  }
  const sinResolver=reglas.crearNd20(fuenteBase,{
    juego:'nd20',nivel:1,ocupacion:'Mago',especie,
    aplazarElecciones:true,herenciaPendiente:true
  },reglas.aleatorioSemilla('Herencia DRS/'+especie+'/1'));
  const elegido=planPersonal.pasos.find(x=>x.id==='herencia-dual');
  const seleccion={};
  for(const paso of planPersonal.pasos){
    seleccion[paso.id]=[];
    for(let i=0;i<paso.cantidad;i++)
      seleccion[paso.id].push(paso.opciones[i%paso.opciones.length].id);
  }
  seleccion[elegido.id]=['Buen desarrollo:Mente'];
  // Usar solo un paso en este test evita mezclar Conjuros ya documentados.
  const planSolo={pasos:[elegido],avisos:[],recursos:[]};
  const resultado=planificadorDRS.resolver(planSolo,{
    'herencia-dual':['Buen desarrollo:Mente']},reglas.aleatorioSemilla('resultado'));
  assert.throws(()=>planificadorDRS.aplicar(sinResolver,planSolo,resultado),
    /reconstruir la ficha desde Nivel 1/,
    'Impedir ajustes falsos de VA al final de la ficha');
  const reconstruido=reglas.crearNd20(fuenteBase,{
    juego:'nd20',nivel:1,ocupacion:'Mago',especie,
    aplazarElecciones:true,herenciaDual:'Buen desarrollo',
    atributoBuenDesarrollo:'Mente'
  },reglas.aleatorioSemilla('Herencia DRS/'+especie+'/1'));
  assert.ok(planificadorDRS.aplicar(reconstruido,planSolo,resultado)
    .capacidades.includes('Buen desarrollo'));
  assert.throws(()=>planificadorDRS.resolver(planSolo,{
    'herencia-dual':['Buen desarrollo:Carisma']},()=>0.3),/fuera de catálogo/,
    'No inventar Atributos');
  assert.throws(()=>reglas.crearNd20(fuenteBase,{
    juego:'nd20',especie,ocupacion:'Mago',herenciaDual:'Saña primitiva'
  },reglas.aleatorioSemilla('error')),/Herencia dual ajena/,
  'Solo alternativas autorizadas por el DRS');
}
const appHerencia=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
assert.ok(appHerencia.includes("herenciaPendiente:true"),
  'El modo Personalizado crea un estado provisional explícito');
assert.ok(appHerencia.includes("herenciaDual:partesHerencia[0]"),
  'El editor comunica la alternativa elegida al motor de creación');
assert.ok(appHerencia.includes("reglas.aleatorioSemilla('forja-herencia:'"),
  'El modo Personalizado regenera la ficha desde la misma semilla');
assert.ok(appHerencia.includes("nuevo.descripcion!==personaje.descripcion"),
  'No cambiar Especie u Ocupación durante la regeneración');
for(const especie of ['Semielfo','Semiorco']){
  const cfg={juego:'nd20',nivel:30,ocupacion:'Mago',especie,aplazarElecciones:true};
  const rapido=reglas.crearNd20(fuenteBase,cfg,reglas.aleatorioSemilla('rapido/'+especie));
  assert.ok(especies[especie].herencia_dual.includes(rapido.herencia_dual));
  assert.ok(rapido.capacidades.includes(rapido.herencia_dual),
    'Rápido resuelve Herencia dual antes de subir 29 Niveles');
  assert.equal(rapido.atributo_buen_desarrollo===null,rapido.herencia_dual!=='Buen desarrollo');
}
console.log('OK · Herencia dual: dos Especies, ambos modos, seis Atributos, cuatro Ocupaciones, Niveles 1/5/12/30.');
console.log('OK · Auditoría normativa DRS: 8 perfiles de Especie, 4 Ocupaciones y regresiones de elecciones.');


/* Compras por Competencia del DRS: escudos y armadura pesada del Clérigo. */
const equipamientoDRS=require('../assets/equipment.js');
const catalogoEquipamiento=leer('equipo-inicial.json');
for(const ocupacion of manifest.drs.ocupaciones){
  assert.ok(Array.isArray(ocupaciones[ocupacion].competencias)&&
    ocupaciones[ocupacion].competencias.length>0,
    'Las Competencias deben constar literalmente en ficha: '+ocupacion);
  const pj=reglas.crearNd20(fuenteBase,{
    juego:'nd20',nivel:1,ocupacion,especie:'Humano común',
    aplazarElecciones:true},reglas.aleatorioSemilla('Competencias/'+ocupacion));
  assert.deepEqual(pj.competencias,ocupaciones[ocupacion].competencias,
    'Las Competencias se exponen en ficha: '+ocupacion);
}
const comprarDRS=(ocupacion,nivel)=>equipamientoDRS.compraInicial(
  ocupaciones[ocupacion],ocupacion,'nd20',catalogoEquipamiento,1000,()=>0.999,nivel).equipo;
const clérigoNv11=comprarDRS('Clérigo',11);
const clérigoNv12=comprarDRS('Clérigo',12);
assert.ok(!clérigoNv11.includes('Cota de mallas'),
  'No comprar armadura pesada antes del Nivel 12');
assert.ok(clérigoNv12.includes('Cota de mallas'),
  'Clérigo desbloquea las armaduras pesadas desde Nivel 12');
for(const ocupacion of ['Clérigo','Guerrero'])
  assert.ok(comprarDRS(ocupacion,12).some(x=>/^Escudo /.test(x)),
    'Competencia con escudos del DRS: '+ocupacion);
for(const ocupacion of ['Mago','Ladrón'])
  assert.ok(!comprarDRS(ocupacion,12).some(x=>/^Escudo /.test(x)),
    'Mago y Ladrón no pueden equipar escudos: '+ocupacion);
console.log('OK · Compra inicial DRS: competencias de 4 Ocupaciones, escudos y protección por Nivel.');

/* Auditoría DRS por Talento: efecto en ficha, selección y límites de tamaño. */
const envejecimientoDRS={
  'Elfo agreste':'nunca envejecen',
  'Enano montañés':'desde los 280 años',
  'Humano común':'desde los 50 años',
  'Mediano amable':'desde los 70 años',
  'Gnomo urbano':'desde los 350 años',
  'Semielfo':'desde los 100 años',
  'Orco común':'desde los 35 años',
  'Semiorco':'desde los 45 años'
};
for(const [especie,edad] of Object.entries(envejecimientoDRS))
  assert.equal(especies[especie].envejecimiento,edad,
    'Edad de envejecimiento acreditada DRS: '+especie);
const talentosFijosDRS={
  'Elfo agreste':['Linaje feérico','Rapidez'],
  'Enano montañés':['Corpulencia','Visión en la oscuridad'],
  'Humano común':['Buen desarrollo'],
  'Mediano amable':['Baja estatura','¡Sálvese quien pueda!'],
  'Gnomo urbano':['Baja estatura','Visión en la oscuridad'],
  'Semielfo':['Ánimo','Herencia dual (SE)'],
  'Orco común':['Ira interna','Saña primitiva'],
  'Semiorco':['Sed de sangre','Herencia dual (SO)']
};
for(const [especie,fijos] of Object.entries(talentosFijosDRS)){
  assert.deepEqual(especies[especie].talentos,fijos,
    'Talentos raciales exactos según DRS: '+especie);
  const perfil=especies[especie];
  const cubiertos=fijos.filter(x=>!x.startsWith('Herencia dual')).concat(perfil.herencia_dual||[]);
  assert.deepEqual(Object.keys(perfil.talentos_descripcion).sort(),cubiertos.sort(),
    'Ningún Talento DRS sin descripción en la ficha: '+especie);
  const personaje=reglas.crearNd20(fuenteBase,{
    juego:'nd20',especie,ocupacion:'Guerrero',nivel:1,aplazarElecciones:true,
    catalogoEquipo:catalogoEquipamiento
  },reglas.aleatorioSemilla('Talentos-especie/'+especie));
  for(const talento of fijos.filter(x=>!x.startsWith('Herencia dual')))
    assert.ok(personaje.notas.some(n=>n.includes('Talento de Especie — '+talento+': ')),
      'La ficha exportada documenta '+talento+' ('+especie+')');
  for(const nombre of perfil.herencia_dual||[])
    assert.equal(personaje.notas.some(n=>n.includes('Talento de Especie — '+nombre+': ')),
      personaje.herencia_dual===nombre,'Solo describir rama elegida: '+especie);
  assert.equal(personaje.recursos.find(x=>x[0]==='Movimiento')[1],
    perfil.movimiento,'El Movimiento corregido por Talento no se aplica dos veces: '+especie);
  assert.ok(personaje.notas.includes('Envejecimiento de Especie: '+
    envejecimientoDRS[especie]+'.'),'El envejecimiento figura en la ficha');
}
for(const especie of ['Mediano amable','Gnomo urbano']){
  const cfg={juego:'nd20',nivel:1,ocupacion:'Guerrero',especie,aplazarElecciones:true,
    catalogoEquipo:catalogoEquipamiento};
  const ficha=reglas.crearNd20(fuenteBase,cfg,
    reglas.aleatorioSemilla('Baja estatura/'+especie));
  assert.ok(ficha.notas.some(x=>x.includes('versión adaptada al tamaño')),
    'La ficha debe aclarar la adaptación editorial del equipo');
  assert.ok(!ficha.notas.some(x=>x.includes('adaptación confirmada')),
    'No deben permanecer avisos de falta de adaptación');
  for(const ocupacion of ['Clérigo','Guerrero','Mago','Ladrón']){
    for(const nivel of [1,12,30]){
      // Con las mismas tiradas y la misma Ocupación, Baja estatura no debe
      // restringir las armas/armaduras del catálogo, solo los escudos.
      const semilla='Adaptacion/'+ocupacion+'/'+nivel;
      const origen=equipamientoDRS.compraInicial(ocupaciones[ocupacion],ocupacion,
        'nd20',catalogoEquipamiento,1000,
        reglas.aleatorioSemilla(semilla),nivel,especies['Humano común']);
      const adaptado=equipamientoDRS.compraInicial(ocupaciones[ocupacion],ocupacion,
        'nd20',catalogoEquipamiento,1000,
        reglas.aleatorioSemilla(semilla),nivel,especies[especie]);
      const armasYArmaduras=new Set([
        ...catalogoEquipamiento.armas,...catalogoEquipamiento.armaduras
      ].map(x=>x.nombre));
      assert.deepEqual(
        adaptado.equipo.filter(x=>armasYArmaduras.has(x)),
        origen.equipo.filter(x=>armasYArmaduras.has(x)),
        'Mismas armas y armaduras con igual RNG, Ocupación y presupuesto: '+
        especie+'/'+ocupacion+'/'+nivel);
      assert.ok(!adaptado.equipo.some(x=>
        x==='Escudo mediano'||x==='Escudo grande'),
        'Baja estatura no permite escudos medianos/grandes: '+
        especie+'/'+ocupacion+'/'+nivel);
      if(['Mago','Ladrón'].includes(ocupacion))
        assert.ok(!adaptado.equipo.some(x=>x.startsWith('Escudo ')),
          'No conceder competencia de escudo a '+ocupacion);
      assert.equal(adaptado.gastado,
        adaptado.equipo.filter(x=>!x.startsWith('Paquete ')).reduce((n,x)=>{
          const todos=[...catalogoEquipamiento.armas,
            ...catalogoEquipamiento.armaduras,...catalogoEquipamiento.escudos,
            ...catalogoEquipamiento.municion];
          const objeto=todos.find(y=>y.nombre===x);
          return n+(objeto?objeto.precio:0);
        },0)+adaptado.equipo.filter(x=>x.startsWith('Paquete ')).reduce((n,x)=>{
          const paquete=catalogoEquipamiento.paquetes.find(y=>
            x.startsWith('Paquete '+y.nombre+':'));
          return n+(paquete?paquete.precio:0);
        },0),'Sin sobreprecio de adaptación: '+especie+'/'+ocupacion);
    }
  }
  // El Guerrero tiene competencia con todos los escudos, pero solo puede
  // recibir el pequeño; en el catálogo no hay marcas de adaptación.
  const compra=equipamientoDRS.compraInicial(ocupaciones.Guerrero,'Guerrero',
    'nd20',catalogoEquipamiento,1000,()=>0.999,30,especies[especie]);
  assert.ok(compra.equipo.includes('Escudo pequeño'),
    'Escudo pequeño disponible para un Guerrero de Baja estatura');
  assert.ok(!compra.equipo.some(x=>['Escudo mediano','Escudo grande'].includes(x)));
  const primera=equipamientoDRS.compraInicial(ocupaciones.Guerrero,'Guerrero',
    'nd20',catalogoEquipamiento,1000,()=>0,1,especies[especie]);
  assert.ok(primera.equipo.some(x=>catalogoEquipamiento.armas.some(y=>y.nombre===x)),
    'Baja estatura no bloquea armas disponibles en catálogo');
  assert.ok(primera.equipo.some(x=>catalogoEquipamiento.armaduras.some(y=>y.nombre===x)),
    'Baja estatura no bloquea armaduras disponibles en catálogo');
}
{
  const modo={juego:'nd20',especie:'Humano común',ocupacion:'Mago',nivel:1,
    aplazarElecciones:true};
  const plan=planificadorDRS.planificar({...modo,modo:'personalizado'},
    fuenteBase,catalogo,progresiones);
  const paso=plan.pasos.find(x=>x.id==='buen-desarrollo');
  const seis=['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia'];
  assert.deepEqual(paso.opciones.map(x=>x.id),seis,
    'El Humano elige uno de los seis Atributos, no una opción automática');
  const rapido=planificadorDRS.planificar({...modo,modo:'rapido'},
    fuenteBase,catalogo,progresiones);
  assert.ok(!rapido.pasos.some(x=>x.id==='buen-desarrollo'));
  const pendiente=reglas.crearNd20(fuenteBase,{...modo,desarrolloPendiente:true},
    reglas.aleatorioSemilla('Humano desarrollo'));
  assert.equal(pendiente.atributo_buen_desarrollo,null);
  assert.ok(!pendiente.capacidades.includes('Buen desarrollo'),
    'No conceder beneficio antes de elegir');
  const decision=planificadorDRS.resolver({pasos:[paso],avisos:[],recursos:[]},
    {'buen-desarrollo':['Resistencia']},()=>0.2);
  assert.throws(()=>planificadorDRS.aplicar(pendiente,
    {pasos:[paso],avisos:[],recursos:[]},decision),/reconstruir la ficha desde Nivel 1/);
  for(const atributo of seis){
    const final=reglas.crearNd20(fuenteBase,{...modo,atributoBuenDesarrollo:atributo},
      reglas.aleatorioSemilla('Humano desarrollo'));
    assert.equal(final.atributo_buen_desarrollo,atributo);
    assert.ok(final.capacidades.includes('Buen desarrollo'));
    assert.equal(final.nombre,pendiente.nombre,'La semilla conserva identidad');
    for(const x of final.atributos)
      assert.equal(x.valor-pendiente.atributos.find(y=>y.nombre===x.nombre).valor,
        x.nombre===atributo?1:0,'Aplicación inicial, sin modificar otro VA');
  }
  for(const nivel of [5,12,30])
    for(const atributo of seis){
      const conf={...modo,nivel,atributoBuenDesarrollo:atributo};
      const pj=reglas.crearNd20(fuenteBase,conf,
        reglas.aleatorioSemilla('Humano '+nivel+' '+atributo));
      assert.equal(pj.atributo_buen_desarrollo,atributo);
      assert.ok(pj.atributos.every(x=>x.valor>=4&&x.valor<=18));
    }
  const app=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
  assert.ok(app.includes('desarrolloPendiente:true'));
  assert.ok(app.includes("e['buen-desarrollo']"));
  assert.ok(app.includes('desarrolloHumano||'));
}
console.log('OK · Talentos de las 8 Especies, talla de 2 Especies y Buen desarrollo del Humano en ambos modos.');

/* Auditoría integral de las cuatro tablas de Ocupación DRS.
 * Fórmulas tomadas de las tablas originales, comprobadas en 30 filas
 * para cada Ocupación y NO derivadas del JSON bajo prueba. */
const tablaClerigo=(n,c)=>n<2*c?0:Math.min(7,
  1+(n>2*c?1:0)+Math.floor(Math.max(0,n-(2*c+1))/4));
const tablaMago=(n,c)=>n<2*c-1?0:Math.min(9,
  1+(n>=2*c?1:0)+Math.floor(Math.max(0,n-2*c)/4));
for(let nivel=1;nivel<=30;nivel++){
  assert.deepEqual(progresiones.fantasia['Clérigo'].niveles[nivel-1],
    Array.from({length:8},(_,i)=>tablaClerigo(nivel,i+1)),
    'Tabla oficial de espacios del Clérigo al Nivel '+nivel);
  assert.deepEqual(progresiones.fantasia.Mago.niveles[nivel-1],
    Array.from({length:8},(_,i)=>tablaMago(nivel,i+1)),
    'Tabla oficial de espacios del Mago al Nivel '+nivel);
  assert.deepEqual(progresiones.fantasia.Guerrero.niveles[nivel-1],[
    Math.min(10,1+Math.floor((nivel-1)/3)),
    1+(nivel>=10?1:0)+(nivel>=22?1:0)
  ],'Técnicas y Potencia de Brío musculoso en Nivel '+nivel);
  assert.deepEqual(progresiones.fantasia['Ladrón'].niveles[nivel-1],[
    Math.min(8,1+Math.floor((nivel-1)/4))
  ],'Tabla oficial de Técnicas del Ladrón al Nivel '+nivel);
}
const talentosOcupacionDRS={
  'Clérigo':['Expulsar muertos vivientes','Fortaleza piadosa'],
  'Guerrero':['Recuperación','Brío musculoso','Sacrificio de escudo'],
  'Mago':['Bagaje de arcanista','Meditación'],
  'Ladrón':['Preparación','Sutileza']
};
for(const [ocupacion,talentos] of Object.entries(talentosOcupacionDRS)){
  assert.deepEqual(ocupaciones[ocupacion].talentos,talentos,
    'Talentos DRS exactos de '+ocupacion);
  assert.deepEqual(Object.keys(ocupaciones[ocupacion].talentos_descripcion),talentos,
    'Todos los Talentos de '+ocupacion+' tienen una glosa normativa');
  for(const nivel of [1,6,10,12,22,30]){
    const pj=reglas.crearNd20(fuenteBase,{
      juego:'nd20',ocupacion,especie:'Humano común',nivel
    },reglas.aleatorioSemilla('Auditoria-ocupacion/'+ocupacion+'/'+nivel));
    const potencia=pj.recursos.find(x=>x[0]==='Potencia');
    assert.ok(potencia,'El DRS exige Potencia inicial en todas las fichas');
    const llevaBrio=ocupacion==='Guerrero'&&pj.capacidades.includes('Brío musculoso');
    const esperada=1+(llevaBrio?(nivel>=10?1:0)+(nivel>=22?1:0):0);
    assert.equal(potencia[1],esperada,'Potencia condicional DRS: '+ocupacion+'/'+nivel);
    for(const talento of talentos.filter(x=>pj.capacidades.includes(x)))
      assert.ok(pj.notas.some(n=>n.startsWith('Talento de Ocupación — '+talento+': ')),
        'Talento documentado '+talento+'/'+nivel);
    if(ocupacion==='Guerrero'){
      const alternativas=['Brío musculoso','Sacrificio de escudo'];
      assert.equal(alternativas.filter(x=>pj.capacidades.includes(x)).length,1);
      assert.ok(!pj.notas.some(n=>alternativas.some(t=>
        !pj.capacidades.includes(t)&&n.startsWith('Talento de Ocupación — '+t+': '))),
        'No documentar el Talento no adquirido');
    }
  }
}
// La selección del Guerrero se difiere en la UI. El motor de Poderes
// debe actualizar la Potencia según la alternativa elegida.
for(const nivel of [1,9,10,21,22,30]){
  const config={juego:'nd20',ocupacion:'Guerrero',especie:'Humano común',nivel,
    aplazarElecciones:true};
  const plan=planificadorDRS.planificar(config,fuenteBase,catalogo,progresiones);
  assert.deepEqual(Object.keys(plan.talentos_ocupacion),
    talentosOcupacionDRS.Guerrero,
    'El editor puede documentar la alternativa escogida');
  const paso=plan.pasos.find(x=>x.id==='talento-guerrero');
  assert.ok(paso);
  for(const talento of ['Brío musculoso','Sacrificio de escudo']){
    const ficha=reglas.crearNd20(fuenteBase,config,
      reglas.aleatorioSemilla('Eleccion-brio/'+nivel));
    assert.equal(ficha.recursos.find(x=>x[0]==='Potencia')[1],1,
      'Ficha provisional sin elección de Guerrero');
    const simplificado={pasos:[paso],avisos:[],recursos:[],
      talentos_ocupacion:plan.talentos_ocupacion};
    const resuelto=planificadorDRS.resolver(simplificado,{
      'talento-guerrero':[talento]
    },reglas.aleatorioSemilla('Eleccion-brio/seleccion'));
    const terminado=planificadorDRS.aplicar(ficha,simplificado,resuelto);
    const esperado=talento==='Brío musculoso' ?
      1+(nivel>=10?1:0)+(nivel>=22?1:0) : 1;
    assert.equal(terminado.recursos.find(x=>x[0]==='Potencia')[1],esperado,
      'Potencia después de elegir '+talento+' en Nv '+nivel);
    assert.ok(terminado.notas.some(x=>
      x.startsWith('Talento de Ocupación — '+talento+': ')));
    assert.ok(!terminado.notas.some(x=>
      x.startsWith('Talento de Ocupación — '+
      (talento==='Brío musculoso'?'Sacrificio de escudo':'Brío musculoso')+': ')));
  }
}
// Forja 1.0 no puede importar Técnicas de Ocupaciones/DLC al núcleo DRS.
const drsTecnicas=new Set(catalogo.tecnicas.filter(x=>
  x.fuente==='Naufragio d20 DRS').map(x=>x.id));
const drsConjuros=new Set(catalogo.conjuros.filter(x=>
  x.origen==='Nd20').map(x=>x.id));
assert.equal(drsTecnicas.size,10);
assert.equal(drsConjuros.size,64);
for(const ocupacion of ['Clérigo','Guerrero','Mago','Ladrón']){
  for(const nivel of [1,12,24,25,29,30]){
    const plan=planificadorDRS.planificar({
      juego:'nd20',ocupacion,especie:'Humano común',nivel,fuentes:['DRS']
    },fuenteBase,catalogo,progresiones);
    for(const paso of plan.pasos){
      for(const opcion of paso.opciones){
        if(paso.tipo==='tecnica')
          assert.ok(drsTecnicas.has(opcion.id),
            'No filtrar DLC por categoría: '+ocupacion+'/'+nivel+'/'+opcion.id);
        if(paso.tipo==='conjuro_conocido'||paso.tipo==='conjuro_preparado')
          assert.ok(drsConjuros.has(opcion.id),
            'Los Conjuros elegibles son únicamente del DRS');
      }
    }
    const tecnicas=plan.pasos.find(x=>x.id==='tecnicas');
    if(ocupacion==='Ladrón'){
      assert.equal(tecnicas.opciones.length,6,
        'El DRS tiene seis Técnicas distintas de Disciplina y Trucos sucios');
      assert.equal(tecnicas.cantidad,Math.min(
        progresiones.fantasia['Ladrón'].niveles[nivel-1][0],6));
      if(nivel>=25)assert.ok(plan.avisos.some(x=>
        x.includes('Faltan '+(nivel>=29?2:1)+' opciones')),
        'Aviso honesto de técnicas insuficientes en el DRS: Nivel '+nivel);
    }
    if(ocupacion==='Guerrero')assert.equal(tecnicas.opciones.length,10,
      'El Guerrero accede a las diez Técnicas oficiales sin añadir DLC');
  }
}
console.log('OK · 120 filas de progresión DRS cotejadas; Potencia y 9 Talentos de Ocupación; Técnica DRS estricta.');
