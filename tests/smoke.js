'use strict';
/* Pruebas locales sin npm: node tests/smoke.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reglas = require('../assets/rules.js');
const leer = (nombre) => JSON.parse(fs.readFileSync(path.join(__dirname,'..','data',nombre),'utf8'));
const fantasia = {especies:leer('especies.json'), ocupaciones:leer('ocupaciones.json')};
const cifi = {especies:leer('especies_cifi.json'), ocupaciones:leer('ocupaciones_cifi.json')};
const dh = leer('dungeon-hack.json');
let total=0;

function comprobar(p, n, tipo) {
  assert.equal(p.nivel,n,tipo+' nivel');
  assert.equal(p.atributos.length,6,tipo+' atributos');
  assert.ok(p.nombre && p.descripcion,tipo+' ficha');
  assert.ok(p.atributos.every((a)=>a.dificultad+a.valor===20),tipo+' VA + DA = 20');
  total++;
}

for(const [tipo, data] of [['nd20',fantasia],['nd20_cifi',cifi]]) {
  for(let n=1;n<=30;n++) {
    const cfg={nivel:n,juego:tipo};
    const a=reglas.crearNd20(data,cfg,reglas.aleatorioSemilla(tipo+'-'+n));
    const b=reglas.crearNd20(data,cfg,reglas.aleatorioSemilla(tipo+'-'+n));
    comprobar(a,n,tipo);
    assert.deepEqual(a,b,'Reproducibilidad con semilla');
    assert.ok(a.atributos.every((x)=>x.valor>=4&&x.valor<=18),'VA válido');
    const es=Number(a.recursos.find((x)=>x[0]==='Esfuerzo')[1]);
    assert.ok(es<=9 && es>=0,'Esfuerzo válido');
    if(tipo==='nd20_cifi') assert.ok(a.notas.some((s)=>s.includes('créditos')),'Sin invención de riqueza');
  }
}

for(let n=1;n<=36;n++) {
  const cfg={nivel:n,juego:'dh',origenes:[0,1,2,3,4],conEspecie:true};
  const a=reglas.eleccionDH(dh,cfg,reglas.aleatorioSemilla('dh-'+n));
  const b=reglas.eleccionDH(dh,cfg,reglas.aleatorioSemilla('dh-'+n));
  comprobar(a,n,'Dungeon Hack');
  assert.deepEqual(a,b,'Reproducibilidad Dungeon Hack');
}
for(let n=1;n<=30;n++) {
  const seg=reglas.seguidorDH(dh,{nivel:n,origenes:[0,1,2,3,4]},reglas.aleatorioSemilla('seg-'+n));
  assert.equal(seg.nivel,n);
  assert.equal(seg.atributos.length,2);
  total++;
}
const matriz = reglas.matriz({juego:'dh'},reglas.aleatorioSemilla('matriz'));
assert.equal(matriz.atributos.length,6);
const mapa = reglas.mazmorra({ancho:6,alto:6},reglas.aleatorioSemilla('mapa'));
assert.equal(mapa.length,8);
assert.ok(mapa.every((f)=>f.length===8));
assert.ok(mapa[0].every((x)=>x==='wall'));
total+=2;
console.log('OK · '+total+' comprobaciones de generación superadas.');


/* Validación de contenido ampliado procedente de la Biblioteca de Naufragio d20. */
const catalogo = leer('catalogo-ampliado.json');
const expandir = (base, nuevos) => ({
  especies: Object.assign({}, base.especies, nuevos.especies),
  ocupaciones: Object.assign({}, base.ocupaciones, nuevos.ocupaciones)
});
const fantasiaExtendida = expandir(fantasia,catalogo.fantasia);
const nocturna = catalogo.nocturna;
const cifiExtendida = {
  especies: Object.assign({},cifi.especies),
  ocupaciones: cifi.ocupaciones
};
for(const [nombre,mod] of Object.entries(catalogo.cifi.especies))
  cifiExtendida.especies[nombre]=Object.assign({},cifiExtendida.especies[nombre],mod);

assert.equal(Object.keys(fantasiaExtendida.ocupaciones).length,37,'Ocupaciones Fantasía');
assert.equal(Object.keys(fantasiaExtendida.especies).length,30,'Especies Fantasía');
assert.equal(Object.keys(nocturna.especies).length,8,'Especies Nocturna');
assert.equal(Object.keys(nocturna.ocupaciones).length,8,'Ocupaciones Nocturna');
assert.equal(cifiExtendida.especies['Humano aumentado'].requisitos.length,2,'Requisitos CiFi');

let ampliadas=0;
for(const [juego,datos] of [['nd20',fantasiaExtendida],['nd20_cifi',cifiExtendida],['nd20_nocturna',nocturna]]) {
  for(const especie of Object.keys(datos.especies)){
    for(const nivel of [1,6,12,30]){
      const personaje=reglas.crearNd20(datos,{juego,nivel,especie},reglas.aleatorioSemilla(juego+especie+nivel));
      assert.ok(personaje.descripcion.includes(especie),'Especie respetada');
      assert.equal(personaje.atributos.length,6);
      assert.ok(personaje.atributos.every(a=>a.valor>=4&&a.valor<=18),'VA entre 4 y 18');
      if(juego==='nd20_nocturna')assert.ok(personaje.recursos.some(a=>a[0]==='Esencia'),'Esencia Nocturna');
      ampliadas++;
    }
  }
  for(const ocupacion of Object.keys(datos.ocupaciones)) {
    const p=reglas.crearNd20(datos,{juego,nivel:1,ocupacion},reglas.aleatorioSemilla(ocupacion));
    assert.ok(p.descripcion.startsWith(ocupacion+' ·'),'Ocupación respetada');
    ampliadas++;
  }
}
const aumentado=reglas.crearNd20(cifiExtendida,
  {juego:'nd20_cifi',nivel:1,especie:'Humano aumentado'},reglas.aleatorioSemilla('aumentado'));
assert.ok(aumentado.atributos.find(a=>a.nombre==='Resistencia').valor>=7);
assert.ok(aumentado.atributos.find(a=>a.nombre==='Presencia').valor>=7);
console.log('OK · '+ampliadas+' fichas adicionales con material documental.');


/* Modos rápido y personalizado: progresiones oficiales y elección validada. */
const poderes=require('../assets/powers.js');
const catalogoPoderes=leer('catalogo-poderes.json');
const progresiones=leer('progresiones-oficiales.json');
assert.equal(catalogoPoderes.conjuros.length,434,'Conjuros extraídos del Tomo');
assert.equal(catalogoPoderes.poderes_psionicos.length,20,'Tabla psiónica d20');
assert.equal(catalogoPoderes.scripts.length,10,'Scripts CiFi');
assert.equal(new Set(catalogoPoderes.tecnicas.map(t=>t.id)).size,catalogoPoderes.tecnicas.length,'IDs únicos de Técnicas');
assert.equal(progresiones.fantasia.Mago.niveles[0][0],1,'Espacios Mago Nv 1');
assert.equal(progresiones.fantasia['Clérigo'].niveles[0][0],0,'Clérigo sin espacio Nv 1');
assert.equal(progresiones.cifi.Psion.niveles[0][0],4,'Ímpetu Psion Nv 1');

let eleccionesValidadas=0;
for(const [juego,grupo] of [
  ['nd20',fantasiaExtendida],['nd20_cifi',cifiExtendida],['nd20_nocturna',nocturna]
]){
  for(const ocupacion of Object.keys(grupo.ocupaciones)){
    for(let nivel=1;nivel<=30;nivel++){
      const rng=reglas.aleatorioSemilla('poderes-'+juego+ocupacion+nivel);
      const pj=reglas.crearNd20(grupo,
        {juego,nivel,ocupacion,aplazarElecciones:true},rng);
      const especie=pj.descripcion.split(' · ').slice(1).join(' · ');
      const plan=poderes.planificar({juego,nivel,ocupacion,especie},grupo,catalogoPoderes,progresiones);
      const rapido=poderes.resolver(plan,null,rng);
      const guiado=poderes.resolver(plan,rapido.decisiones,reglas.aleatorioSemilla('solo-psion'));
      assert.deepEqual(
        guiado.elementos.filter(x=>x.tipo!=='psionico').map(x=>x.id),
        rapido.elementos.filter(x=>x.tipo!=='psionico').map(x=>x.id),
        'Modo Personalizado conserva las elecciones permitidas');
      const terminado=poderes.aplicar(pj,plan,rapido);
      assert.ok(terminado.poderes && terminado.conjuros_preparados);
      eleccionesValidadas++;
    }
  }
}
const poolNoct=poderes.planificar(
  {juego:'nd20_nocturna',nivel:9,ocupacion:'Arcanista',especie:'Humano natural'},
  nocturna,catalogoPoderes,progresiones);
assert.equal(poolNoct.pasos.filter(x=>x.tipo==='talento').length,3,'Talentos de Nocturna');
assert.ok(poolNoct.pasos.some(s=>s.id==='talento-ocupacion-9'));
assert.throws(()=>poderes.resolver(poolNoct,{
  'talento-especie-1':['No existe'],
  'talento-ocupacion-1':['Biblioteca ambulante'],
  'talento-ocupacion-9':['Caos esotérico']
},()=>.2),/fuera de catálogo/i);
console.log('OK · '+eleccionesValidadas+' comprobaciones de progresión y selección.');


/* Edición 2026-10: catálogos ampliados, subopciones y menú compacto. */
const progresoAmpliado=progresiones.ampliadas;
assert.equal(Object.keys(progresoAmpliado.fantasia).length,33,'Tablas de Ocupaciones ampliadas');
assert.equal(Object.keys(progresoAmpliado.nocturna).length,8,'Tablas Nocturna');
assert.equal(Object.values(progresoAmpliado.fantasia).filter(t=>t.verificado).length,30,
  'Solo 30 tablas de Fantasía verificadas íntegramente');
for(const [key,tabla] of Object.entries(progresoAmpliado.nocturna))
  assert.ok(tabla.verificado && tabla.niveles.length===30 && tabla.niveles.every(Array.isArray),
    'Tabla de Nocturna completa: '+key);
const ex=catalogoPoderes.especiales;
assert.equal(ex.ordenes.length,8);
assert.equal(ex.flecheria.length,14);
assert.equal(ex.privilegios.length,6);
assert.equal(ex.canciones.length,24);
assert.equal(ex.eidolas.length,32);
assert.ok(ex.recetas.length>=28);
assert.equal(ex.vinculos.Brujo.length,27);
assert.equal(ex.vinculos.Hechicero.length,8);
assert.equal(ex.vinculos.Oráculo.length,8);
assert.equal(ex.vinculos.Chamán.length,4);

let planificados=0;
for(const [juego,grupo] of [['nd20',fantasiaExtendida],['nd20_cifi',cifiExtendida],['nd20_nocturna',nocturna]]){
  for(const ocupacion of Object.keys(grupo.ocupaciones)){
    for(let nivel=1;nivel<=30;nivel++){
      const rng=reglas.aleatorioSemilla('expansion-'+juego+'-'+ocupacion+'-'+nivel);
      const pj=reglas.crearNd20(grupo,{juego,nivel,ocupacion,aplazarElecciones:true},rng);
      const especie=pj.descripcion.split(' · ').slice(1).join(' · ');
      const plan=poderes.planificar({juego,nivel,ocupacion,especie},grupo,catalogoPoderes,progresiones);
      const resultado=poderes.resolver(plan,null,rng);
      const personal=poderes.resolver(plan,resultado.decisiones,reglas.aleatorioSemilla('guiado'));
      assert.deepEqual(
        resultado.elementos.filter(e=>e.tipo!=='psionico').map(e=>e.id),
        personal.elementos.filter(e=>e.tipo!=='psionico').map(e=>e.id),
        'Los dos modos coinciden salvo la tirada obligatoria del Psion');
      const final=poderes.aplicar(pj,plan,resultado);
      assert.ok(final.capacidades && final.poderes && final.conjuros_preparados);
      planificados++;
    }
  }
}
const planArcano=poderes.planificar({juego:'nd20_nocturna',nivel:1,
  ocupacion:'Arcanista',especie:'Humano natural'},nocturna,catalogoPoderes,progresiones);
const secundaria=planArcano.pasos.find(p=>p.id==='escuela-maestra');
assert.ok(secundaria && secundaria.opciones.length===5,'Segunda Escuela maestra opcional');
const hechicero=poderes.planificar({juego:'nd20',nivel:15,
  ocupacion:'Hechicero',especie:'Humano común'},fantasiaExtendida,catalogoPoderes,progresiones);
assert.ok(hechicero.pasos.some(p=>p.id==='vinculo-arcano'));
assert.ok(hechicero.pasos.some(p=>p.dependeVinculo));
const noVerificado=poderes.planificar({juego:'nd20',nivel:30,ocupacion:'Adalid',
  especie:'Humano común'},fantasiaExtendida,catalogoPoderes,progresiones);
assert.ok(noVerificado.avisos.some(x=>x.includes('verificación manual')),'Adalid no se inventa');
const documento=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
for(const tag of ['data-juego="nd20"','data-juego="nd20_cifi"','data-juego="nd20_nocturna"',
 'data-juego="dh"','tab-herramientas','selector-tema'])
 assert.ok(documento.includes(tag),'Menú contiene '+tag);
const estilos=fs.readFileSync(path.join(__dirname,'..','assets','styles.css'),'utf8');
for(const tema of ['ebano','ceruleo','obsidiana'])
 assert.ok(estilos.includes('data-tema='+tema),'Tema '+tema);
console.log('OK · '+planificados+' pruebas de Poderes adicionales y nuevas interfaces.');


/* Corrección editorial: Talentos visibles, Magia tántrica y tesauro de Ylat. */
const tesauroYlat=leer('tesauro-ylat.json');
assert.equal(tesauroYlat.entradas.length,200,'Tesauro con doscientas entradas');
assert.equal(tesauroYlat.entradas.filter(n=>n.tipo==='documentado').length,51);
assert.equal(tesauroYlat.entradas.filter(n=>n.tipo==='combinado').length,149);
assert.equal(new Set(tesauroYlat.entradas.map(n=>n.nombre.toLocaleLowerCase('es'))).size,200,
  'No hay nombres duplicados');
assert.ok(tesauroYlat.entradas.filter(n=>n.tipo==='documentado').every(n=>
  n.fuente && n.fuente.archivo && n.fuente.pagina>=1),'Procedencia de nombres documentados');

for(const [nivel,artes,blindaje] of [
  [1,1,'d6/d6'],[6,2,'d6/d6'],[12,3,'d8/d6'],[18,4,'d10/d6'],[30,4,'d10/d6']
]){
  const rng=reglas.aleatorioSemilla('huri-'+nivel);
  const pj=reglas.crearNd20(fantasiaExtendida,
    {juego:'nd20',nivel,ocupacion:'Hurí',especie:'Humano común',
     modoNombre:'combinado',tesauroYlat,aplazarElecciones:true},rng);
  assert.ok(pj.capacidades.includes('Encanto'));
  assert.ok(pj.capacidades.includes('Defensa sin armadura'));
  assert.ok(!pj.notas.some(x=>x.includes('Talentos documentados')));
  assert.ok(tesauroYlat.entradas.some(x=>x.nombre===pj.nombre&&x.tipo==='combinado'));
  const plan=poderes.planificar({juego:'nd20',nivel,ocupacion:'Hurí',especie:'Humano común'},
    fantasiaExtendida,catalogoPoderes,progresiones);
  const final=poderes.aplicar(pj,plan,poderes.resolver(plan,null,rng));
  assert.equal(Number(final.recursos.find(x=>x[0]==='Magia tántrica · artes conocidas')[1]),artes);
  assert.equal(final.recursos.find(x=>x[0]==='Blindaje sin armadura')[1],blindaje);
  assert.ok(final.poderes.some(x=>x.startsWith('[Mt] Magia tántrica')));
  assert.ok(final.notas.some(x=>x.includes('no incluye sus nombres ni efectos')));
}
const chamanTalentos=reglas.crearNd20(fantasiaExtendida,
  {juego:'nd20',nivel:1,ocupacion:'Chamán',especie:'Humano común',aplazarElecciones:true},
  reglas.aleatorioSemilla('chaman-talent'));
for(const t of ['Espíritu ancestral','Puntos de Chamanismo','Resonancia salvaje'])
  assert.ok(chamanTalentos.capacidades.includes(t),'Talento visible: '+t);
const nombreOriginal=reglas.crearNd20(fantasiaExtendida,
  {juego:'nd20',nivel:1,ocupacion:'Hurí',especie:'Humano común',modoNombre:'documentado',
    tesauroYlat,aplazarElecciones:true},reglas.aleatorioSemilla('canon'));
assert.ok(tesauroYlat.entradas.some(x=>x.nombre===nombreOriginal.nombre&&x.tipo==='documentado'));
const pag=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.ok(pag.includes('id="modo-nombre"'),'Selector de nombres disponible');
console.log('OK · Talentos, Hurí y tesauro Ylat validados.');

/* Fuentes y navegación responsive: la selección debe afectar al motor, no solo a la interfaz. */
const fantasiaConFuentes=Object.assign({},fantasiaExtendida,{
  fuentes:{
    ocupaciones:Object.fromEntries(Object.keys(fantasiaExtendida.ocupaciones).map(k=>[
      k,catalogo.fantasia.ocupaciones[k]?
        catalogo.fantasia.ocupaciones[k].suplemento:'DRS'
    ])),
    especies:Object.fromEntries(Object.keys(fantasiaExtendida.especies).map(k=>[
      k,catalogo.fantasia.especies[k]?'NaufragioD20 — Especies':'DRS'
    ]))
  }
});
for(let i=0;i<25;i++){
  const p=reglas.crearNd20(fantasiaConFuentes,{juego:'nd20',nivel:1,fuentes:['DRS']},
    reglas.aleatorioSemilla('fuente-drs-'+i));
  assert.equal(p.procedenciaOcupacion,'DRS');
  assert.equal(p.procedenciaEspecie,'DRS');
}
const arlequin=reglas.crearNd20(fantasiaConFuentes,{
  juego:'nd20',nivel:1,fuentes:['DRS','Nuevas Ocupaciones'],
  ocupacion:'Arlequín',especie:'Humano común'
},reglas.aleatorioSemilla('arlequin-fuente'));
assert.equal(arlequin.descripcion,'Arlequín · Humano común');
assert.equal(arlequin.procedenciaOcupacion,'Nuevas Ocupaciones');
assert.equal(arlequin.procedenciaEspecie,'DRS');
assert.throws(()=>reglas.crearNd20(fantasiaConFuentes,{
  juego:'nd20',nivel:1,fuentes:['DRS'],ocupacion:'Arlequín'
},reglas.aleatorioSemilla('excluido')),/fuentes permitidas/i);
assert.throws(()=>reglas.crearNd20(fantasiaConFuentes,{
  juego:'nd20',nivel:1,fuentes:['DRS','Nuevas Ocupaciones'],especie:'Dracónido'
},reglas.aleatorioSemilla('especie-excluida')),/fuentes permitidas/i);
const claseDH=reglas.eleccionDH(dh,{
  juego:'dh',nivel:1,origenes:[0],ocupacion:'cleric',conEspecie:true
},reglas.aleatorioSemilla('dh-fuente-clase'));
assert.equal(claseDH.procedenciaOcupacion,'Dungeon Hack');
assert.equal(claseDH.procedenciaEspecie,'');
assert.throws(()=>reglas.eleccionDH(dh,{
  juego:'dh',nivel:1,origenes:[1],ocupacion:'cleric'
},reglas.aleatorioSemilla('dh-fuente-excluida')),/procedencias permitidas/i);
assert.throws(()=>reglas.eleccionDH(dh,{
  juego:'dh',nivel:1,origenes:[0],ocupacion:'cleric',especie:'dragonborn'
},reglas.aleatorioSemilla('dh-especie-excluida')),/procedencias permitidas/i);
const htmlForja=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.ok(htmlForja.includes('id="alternar-menu"')&&htmlForja.includes('aria-expanded="false"'));
assert.ok(htmlForja.includes('id="opciones-fuentes"')&&htmlForja.includes('id="fuentes-nd20"'));
const jsForja=fs.readFileSync(path.join(__dirname,'..','assets','app.js'),'utf8');
assert.ok(jsForja.includes('esc(personaje.descripcion)')&&!jsForja.includes('descripcionConFuente'));
assert.ok(jsForja.includes('fuentesFicha(personaje)'));
const cssForja=fs.readFileSync(path.join(__dirname,'..','assets','styles.css'),'utf8');
assert.ok(cssForja.includes('.panel:not(.panel-abierto){display:none}'));
console.log('OK · Filtros de fuentes y menú móvil verificados.');

/* Prefijos de tipos: visibles en las elecciones y en las fichas, sin tocar requisitos. */
const prefijos=[
  ['tecnica','Técnicas conocidas','Ataque certero','[T] Ataque certero'],
  ['conjuro_conocido','Aprender Conjuros','Aguijón impío','[C] Aguijón impío'],
  ['conjuro_preparado','Preparar · Círculo 1','Aguijón impío','[C] Aguijón impío'],
  ['psionico','Poderes Psiónicos','Agresión psíquica','[Ps] Agresión psíquica'],
  ['poder_especial','Privilegios','Atemorizar plebeyo','[Pr] Atemorizar plebeyo'],
  ['poder_especial','Órdenes de batalla','¡Aguanta!','[Or] ¡Aguanta!'],
  ['poder_especial','Técnicas de Pugilista','Ataque certero','[T] Ataque certero'],
  ['poder_especial','Conjuros conocidos de Druida','Luz','[C] Luz'],
  ['poder_especial','Canciones','Arrullo pacificador','[Ca] Arrullo pacificador'],
  ['poder_especial','Recetas de cocina','Sopa del Pecado Menor','[Rc] Sopa del Pecado Menor'],
  ['magia_tantrica','Magia tántrica documentada','Magia tántrica','[Mt] Magia tántrica']
];
for(const [tipo,etapa,nombre,esperado] of prefijos)
  assert.equal(poderes.nombreEtiquetado(tipo,etapa,nombre),esperado);
assert.equal(poderes.nombreEtiquetado('talento','Talentos','Encanto'),'Encanto');
const pjEtiqueta=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',nivel:1,ocupacion:'Forense',especie:'Humano común',aplazarElecciones:true
},reglas.aleatorioSemilla('forense-label'));
const planEtiqueta=poderes.planificar({juego:'nd20',nivel:1,ocupacion:'Forense',especie:'Humano común'},
  fantasiaExtendida,catalogoPoderes,progresiones);
const fichaEtiqueta=poderes.aplicar(pjEtiqueta,planEtiqueta,
  poderes.resolver(planEtiqueta,null,reglas.aleatorioSemilla('forense-priv')));
assert.ok(fichaEtiqueta.poderes.some(s=>s.startsWith('[Pr] ')));
console.log('OK · Etiquetado de familias de Poderes verificado.');
