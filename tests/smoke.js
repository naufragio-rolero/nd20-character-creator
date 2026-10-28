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
    if(tipo==='nd20_cifi') assert.ok(/^\d+ cr restantes \/ \d+ cr iniciales$/.test(a.riqueza),'Créditos iniciales aprobados');
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
assert.equal(Object.values(progresoAmpliado.fantasia).filter(t=>t.verificado).length,31,
  '31 tablas de Fantasía verificadas; Adalid contrastado con el manual');
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
const adalidVerificado=poderes.planificar({juego:'nd20',nivel:30,ocupacion:'Adalid',
  especie:'Humano común'},fantasiaExtendida,catalogoPoderes,progresiones);
assert.ok(adalidVerificado.avisos.some(x=>x.includes('correspondencia de Escuelas')),
  'Adalid: tabla verificada, Conjuros ambiguos no inventados');
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
  ['vinculo','Patrón','Ananke','[V] Ananke'],
  ['escuela','Segunda Escuela maestra','Elemental','[Es] Elemental'],
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

/* Control editorial: inventario completo, estados no inferidos e intercambio seguro por JSON. */
const controlEditorial=require('../assets/control-editor.js');
const inventarioEditorial=controlEditorial.crearInventario({
  especies:fantasia.especies,ocupaciones:fantasia.ocupaciones,
  especiesCifi:cifi.especies,ocupacionesCifi:cifi.ocupaciones,
  ampliado:catalogo,dungeon:dh,catalogo:catalogoPoderes,progresiones:progresiones
});
assert.ok(inventarioEditorial.length>750,'Inventario editorial amplio');
assert.equal(inventarioEditorial.length,new Set(inventarioEditorial.map(e=>e.id)).size,
  'IDs únicos de revisión editorial');
function elementoEditor(sistema,tipo,nombre){
  const item=inventarioEditorial.find(x=>x.sistema===sistema&&x.tipo===tipo&&x.nombre===nombre);
  assert.ok(item,'Elemento existente: '+sistema+'/'+tipo+'/'+nombre);
  return item;
}
const huriEditor=elementoEditor('Nd20 Fantasía','Ocupación','Hurí');
elementoEditor('Nd20 Fantasía','Especie','Humano común');
elementoEditor('Nd20 · Poderes','Privilegio','Atemorizar plebeyo');
elementoEditor('Nd20 · Poderes','Técnica','Ataque certero');
elementoEditor('Dungeon Hack','Especie','Dracónido');
const cambioEditor={[huriEditor.id]:{
  visible:false,publicado:'no',probado:'sin_revisar',notas:'Pendiente de revisión'
}};
const exportado=controlEditorial.crearRevision(inventarioEditorial,cambioEditor,'2026-10-28T00:00:00Z');
assert.equal(exportado.esquema,'naufragio.revision-editorial/v1');
assert.equal(Object.keys(exportado.cambios).length,1);
assert.deepEqual(controlEditorial.importarRevision(inventarioEditorial,exportado),cambioEditor,
  'JSON editable y reversible sin modificar los catálogos');
assert.throws(()=>controlEditorial.crearRevision(inventarioEditorial,{'inventado':{visible:false}}),
  /fuera del catálogo/i,'Rechazar registros inventados');
assert.throws(()=>controlEditorial.importarRevision(inventarioEditorial,{
  esquema:controlEditorial.ESQUEMA,cambios:{[huriEditor.id]:{publicado:'confirmado'}}
}),/desconocido/i,'Rechazar estados arbitrarios');
assert.ok(!Object.prototype.hasOwnProperty.call(catalogo.fantasia.ocupaciones.Hurí,'publicado'),
  'No se infiere estado publicado por estar documentado');
const controlHtml=fs.readFileSync(path.join(__dirname,'..','control.html'),'utf8');
for(const expected of ['control-editor.js','control-ui.js','id="crear-token"',
  'id="detalle-publicado"','id="detalle-probado"','id="detalle-visible"','id="exportar-control"'])
  assert.ok(controlHtml.includes(expected),'Acción de control editorial: '+expected);
console.log('OK · Inventario editorial ('+inventarioEditorial.length+
  ' elementos), revisión JSON y acceso local validados.');

/* Procedencia documental de los Conjuros: conciliación con Lista Poderes Nd20.xlsx. */
const origenesConjuros={
  'Nd20':64,
  'Tomo de Magia':50,
  'Slat-Deanaich':101,
  'Grimorio de Tuliëlle':142,
  'Pergaminos de Excelsus':64,
  'Sangromancia':12
};
for(const [origen,cantidad] of Object.entries(origenesConjuros))
  assert.equal(catalogoPoderes.conjuros.filter(x=>x.origen===origen).length,cantidad,
    'Origen documentado: '+origen);
const pendientesOrigen=catalogoPoderes.conjuros.filter(x=>!x.origen);
assert.equal(pendientesOrigen.length,1,'Única discrepancia sin atribuir falsamente');
assert.equal(pendientesOrigen[0].nombre,'Ira celestial');
assert.equal(pendientesOrigen[0].circulo,3);
assert.equal(catalogoPoderes.conjuros.find(x=>x.nombre==='Ira celestial'&&x.circulo===5).origen,
  'Nd20','Atribución contrastada de Ira celestial del Círculo 5');
assert.equal(poderes.origenConjuro('conjuro_conocido','Aprender Conjuros','Nd20'),
  ' · Nd20');
assert.equal(poderes.origenConjuro('poder_especial','Conjuros de Nictomante',null),
  ' · Origen sin verificar');
assert.equal(poderes.origenConjuro('tecnica','Técnicas conocidas','Nd20'),'',
  'No se etiquetan otras familias con procedencia de Conjuros');
const planOrigen=poderes.planificar(
  {juego:'nd20',nivel:1,ocupacion:'Mago',especie:'Humano común'},
  fantasiaExtendida,catalogoPoderes,progresiones);
const conjuroOrigen=planOrigen.pasos.find(p=>p.tipo==='conjuro_conocido'&&p.opciones.length);
assert.ok(conjuroOrigen,'El Mago ofrece Conjuros');
assert.ok(conjuroOrigen.opciones.every(x=>Object.hasOwn(x,'origen')),
  'Origen propagado al selector Personalizado');
const decididoOrigen=poderes.resolver(planOrigen,null,reglas.aleatorioSemilla('origen-conjuros'));
assert.ok(decididoOrigen.elementos.filter(x=>x.tipo==='conjuro_conocido').every(x=>x.origen),
  'Origen propagado a resultados');
const baseOrigen=reglas.crearNd20(fantasiaExtendida,
  {juego:'nd20',nivel:1,ocupacion:'Mago',especie:'Humano común',aplazarElecciones:true},
  reglas.aleatorioSemilla('base-origen'));
const fichaOrigen=poderes.aplicar(baseOrigen,planOrigen,decididoOrigen);
assert.ok(fichaOrigen.poderes.some(x=>x.includes(' · Nd20')),
  'Origen visible en ficha generada');
const controlConjuro=inventarioEditorial.find(x=>x.tipo==='Conjuro'&&x.nombre==='Aguijón impío');
assert.equal(controlConjuro.fuente,'Nd20','Origen correcto en control editorial');
const controlPendiente=inventarioEditorial.find(x=>x.tipo==='Conjuro'&&
  x.nombre==='Ira celestial'&&x.detalle.includes('Círculo 3'));
assert.equal(controlPendiente.fuente,'Origen sin verificar');
console.log('OK · 433 orígenes de Conjuros documentados y una discrepancia identificada.');


/* Revisión por lotes confirmados: publicación sí, pruebas independientes. */
const lotesEditoriales=controlEditorial.lotesConfirmados(inventarioEditorial);
assert.deepEqual(lotesEditoriales.map(x=>x.id),['nd20-drs','nd20-cifi','dungeon-hack']);
assert.ok(lotesEditoriales.every(x=>x.cantidad>0),'Los tres lotes tienen material');
const sumarLotes=lotesEditoriales.reduce((n,l)=>n+l.cantidad,0);
const idsPorLote=inventarioEditorial.filter(e=>
  lotesEditoriales.some(l=>controlEditorial.perteneceALote(e,l.id)));
assert.equal(idsPorLote.length,sumarLotes,'Los lotes no se solapan');
assert.equal(controlEditorial.estadoBase(elementoEditor('Nd20 Fantasía','Especie','Humano común')).publicado,
  'si','Especie DRS publicada');
assert.equal(controlEditorial.estadoBase(elementoEditor('Nd20 Fantasía','Ocupación','Mago')).publicado,
  'si','Ocupación DRS publicada');
assert.equal(controlEditorial.estadoBase(elementoEditor('Nd20 CiFi','Ocupación','Psion')).publicado,
  'si','Ocupación CiFi publicada');
assert.equal(controlEditorial.estadoBase(elementoEditor('Dungeon Hack','Especie','Dracónido')).publicado,
  'si','Todas las procedencias de Dungeon Hack publicadas');
assert.equal(controlEditorial.estadoBase(controlConjuro).publicado,'si',
  'Conjuros con origen Nd20 se agrupan en DRS');
assert.equal(controlEditorial.estadoBase(
  elementoEditor('Nd20 · Poderes','Poder Psiónico','Agresión psíquica')).publicado,
  'si','Los Poderes CiFi están en el lote');
assert.equal(controlEditorial.estadoBase(huriEditor).publicado,'sin_revisar',
  'No presuponer publicado material de nuevas Ocupaciones');
assert.equal(controlEditorial.estadoBase(controlPendiente).publicado,'sin_revisar',
  'No presuponer publicado un Conjuro de origen desconocido');
const conjuroTomo=inventarioEditorial.find(e=>e.tipo==='Conjuro'&&e.fuente==='Tomo de Magia');
assert.equal(controlEditorial.estadoBase(conjuroTomo).publicado,'sin_revisar',
  'Tomo de Magia es independiente del DRS');
assert.ok(idsPorLote.every(e=>controlEditorial.estadoBase(e).probado==='sin_revisar'),
  'Publicado NO implica probado');
const manualDH=elementoEditor('Dungeon Hack','Especie','Dracónido');
const siguiente=controlEditorial.aplicarLote(inventarioEditorial,{},
  [manualDH.id,huriEditor.id],{publicado:'no'});
assert.equal(siguiente.afectados,2);
assert.equal(controlEditorial.estadoEfectivo(manualDH,siguiente.cambios).publicado,'no',
  'Un cambio individual prevalece sobre publicación base');
assert.equal(controlEditorial.estadoEfectivo(huriEditor,siguiente.cambios).publicado,'no');
assert.equal(controlEditorial.estadoEfectivo(manualDH,siguiente.cambios).probado,'sin_revisar',
  'La decisión masiva no altera la prueba');
const otra=controlEditorial.aplicarLote(inventarioEditorial,siguiente.cambios,
  [manualDH.id],{publicado:'si'});
assert.ok(!Object.hasOwn(otra.cambios,manualDH.id),
  'Al restaurar publicación base se elimina la excepción');
const loteDePruebas=controlEditorial.aplicarLote(inventarioEditorial,
  {[manualDH.id]:{visible:true,publicado:'si',probado:'sin_revisar',notas:'Nota privada de revisión'}},
  [manualDH.id],{probado:'si'});
assert.equal(loteDePruebas.cambios[manualDH.id].notas,'Nota privada de revisión',
  'No sobrescribir notas');
assert.equal(loteDePruebas.cambios[manualDH.id].publicado,'si',
  'No sobrescribir publicación');
assert.throws(()=>controlEditorial.aplicarLote(inventarioEditorial,{},['id-inexistente'],
  {visible:false}),/fuera del catálogo/);
assert.throws(()=>controlEditorial.aplicarLote(inventarioEditorial,{},[manualDH.id],
  {editor:true}),/no permitido/);
const loteSerializado=controlEditorial.crearRevision(inventarioEditorial,otra.cambios,
  '2026-10-28T00:00:00Z');
assert.equal(loteSerializado.lotes_base_publicados.length,3,
  'La revisión JSON declara los lotes base');
assert.equal(loteSerializado.cambios[huriEditor.id].publicado,'no');
const sinCambio=controlEditorial.crearRevision(inventarioEditorial,
  {[manualDH.id]:controlEditorial.estadoBase(manualDH)});
assert.equal(Object.keys(sinCambio.cambios).length,0,
  'No se exportan miles de registros equivalentes al estado base');
assert.deepEqual(controlEditorial.importarRevision(inventarioEditorial,
  {esquema:controlEditorial.ESQUEMA,cambios:otra.cambios}),otra.cambios,
  'Revisión v1 anterior compatible');
for(const ref of ['id="fuente-control"','id="lote-publicado"','id="lote-probado"',
  'id="lote-visible"','id="aplicar-lote"','id="lotes-publicados"'])
  assert.ok(controlHtml.includes(ref),'Acciones masivas disponibles: '+ref);
console.log('OK · '+sumarLotes+' entradas de tres lotes publicados; pruebas pendientes y edición por lotes validadas.');


/* Repertorios: Fuente => edición propuesta -> JSON reversible, sin alterar catálogos. */
const catalogoRepertorios=require('../assets/repertorios.js');
const repertoriosPrueba=catalogoRepertorios.generar({
  especies:fantasia.especies,ocupaciones:fantasia.ocupaciones,
  especiesCifi:cifi.especies,ocupacionesCifi:cifi.ocupaciones,
  ampliado:catalogo,dungeon:dh,tesauroYlat
});
assert.ok(repertoriosPrueba.length>150,'Nombres y conceptos de todas las líneas');
assert.equal(new Set(repertoriosPrueba.map(x=>x.id)).size,repertoriosPrueba.length,
  'IDs estables de repertorio sin duplicados');
function localizarRep(sistema,categoria,nombre,campo){
  const v=repertoriosPrueba.find(x=>x.sistema===sistema&&x.categoria===categoria&&
    x.nombre===nombre&&x.campo===campo);
  assert.ok(v,'Existe el repertorio: '+[sistema,categoria,nombre,campo].join('/'));
  return v;
}
const nombresHumanos=localizarRep('Nd20 Fantasía','Especie','Humano común','nombres');
assert.equal(nombresHumanos.valores.length,20,'Nombres base documentados');
const conceptosMago=localizarRep('Nd20 Fantasía','Ocupación','Mago','conceptos');
assert.equal(conceptosMago.valores.length,10,'Conceptos de ocupación');
const cifiNombres=localizarRep('Nd20 CiFi','Especie','Humano natural','nombres');
assert.equal(cifiNombres.valores.length,20,'Nombres de CiFi');
const conceptosHuri=localizarRep('Nd20 Fantasía','Ocupación','Hurí','conceptos');
assert.equal(conceptosHuri.valores.length,10,'Propuestas editoriales de Hurí disponibles');
const nombresDh=localizarRep('Dungeon Hack','Ocupación','Clérigo','nombres');
assert.ok(nombresDh.valores.length>=10,'Nombres originales de Dungeon Hack');
const nombresSeguidores=localizarRep('Dungeon Hack','Seguidores','Nombres de seguidores','nombres');
assert.ok(nombresSeguidores.valores.length>0,'Nombres de seguidores');
const ylatDocumentados=localizarRep('Nd20 Fantasía','Tesauro Ylat','Nombres documentados','nombres');
const ylatCombinados=localizarRep('Nd20 Fantasía','Tesauro Ylat','Nombres combinados','nombres');
assert.equal(ylatDocumentados.valores.length,51,'Conservar nombres documentados');
assert.equal(ylatCombinados.valores.length,149,'Nombres combinados ampliables');
assert.equal(ylatDocumentados.editable,false,'Referencias documentadas protegidas');
assert.equal(ylatCombinados.editable,true,'Creaciones combinadas editables');
assert.throws(()=>catalogoRepertorios.actualizar(repertoriosPrueba,{},
  ylatDocumentados.id,['Nombre inventado']),/solo lectura/i,
  'No inventar nombres documentados');
const inventarioOriginal=JSON.stringify(fantasia.especies);
const actualizacionRep=catalogoRepertorios.actualizar(repertoriosPrueba,{},
  nombresHumanos.id,nombresHumanos.valores.concat('Personaje de prueba editorial'));
const ampliacionRep=catalogoRepertorios.actualizar(repertoriosPrueba,actualizacionRep,
  conceptosHuri.id,conceptosHuri.valores.concat('Concepto editorial de prueba'));
assert.equal(catalogoRepertorios.valorActual(nombresHumanos,ampliacionRep).length,21);
assert.equal(catalogoRepertorios.valorActual(conceptosHuri,ampliacionRep).length,11);
assert.equal(JSON.stringify(fantasia.especies),inventarioOriginal,'No mutar fuentes en memoria');
assert.throws(()=>catalogoRepertorios.actualizar(repertoriosPrueba,{},nombresHumanos.id,
  ['Repetido','repetido']),/duplicadas/i,'Rechazar entradas repetidas');
assert.throws(()=>catalogoRepertorios.actualizar(repertoriosPrueba,{},nombresHumanos.id,
  ['x'.repeat(161)]),/demasiado larga/i);
const exportadoRep=catalogoRepertorios.exportar(repertoriosPrueba,ampliacionRep);
assert.equal(Object.keys(exportadoRep).length,2,'Solo repertorios modificados');
const reimportadoRep=catalogoRepertorios.importar(repertoriosPrueba,exportadoRep);
assert.deepEqual(reimportadoRep,ampliacionRep,'Exportación e importación sin pérdidas');
assert.deepEqual(catalogoRepertorios.importar(repertoriosPrueba,undefined),{},
  'Compatible con JSON previos sin repertorios');
assert.throws(()=>catalogoRepertorios.importar(repertoriosPrueba,
  {[nombresHumanos.id]:{ruta:nombresHumanos.ruta,
    originales:['Fuente cambiada'],valores:['Falso']}}),/ha cambiado/i,
  'Detectar cambios en el catálogo original');
assert.throws(()=>catalogoRepertorios.importar(repertoriosPrueba,
  {[ylatDocumentados.id]:{ruta:ylatDocumentados.ruta,
    originales:ylatDocumentados.valores,valores:['Falso']}}),/protegido/i);
const htmlControl=fs.readFileSync(path.join(__dirname,'..','control.html'),'utf8');
for(const ref of ['assets/repertorios.js','id="panel-repertorios-editor"',
  'id="repertorio-valores"','id="guardar-repertorio"','id="restaurar-repertorio"',
  'id="tab-repertorios"','id="exportar-repertorios"'])
  assert.ok(htmlControl.includes(ref),'Editor de repertorios conectado: '+ref);
const jsControl=fs.readFileSync(path.join(__dirname,'..','assets','control-ui.js'),'utf8');
assert.ok(jsControl.includes('revision.repertorios=repertorios.exportar'),
  'Los repertorios se incluyen en el JSON editorial unificado');
assert.ok(jsControl.includes('repertorios.importar(repertoriosCatalogo,parsed.repertorios)'),
  'JSON importable con repertorios');
console.log('OK · '+repertoriosPrueba.length+
  ' repertorios de nombres y conceptos, tesauro protegido y JSON validado.');


/* Talentos iniciales y equipo: verificación de 37 Ocupaciones × 4 niveles. */
const equipoDRS=leer('equipo-inicial.json');
const equipoApi=require('../assets/equipment.js');
assert.ok(equipoDRS.armas.some(x=>x.nombre==='Martillo de guerra'&&x.precio===15));
assert.ok(equipoDRS.paquetes.some(x=>x.nombre==='Especial devotos'&&x.precio===10));
let pruebasEquipo=0;
for(const [nombre,ocupacion] of Object.entries(fantasiaExtendida.ocupaciones)){
  for(const nivel of [1,6,12,30]){
    const cfg={juego:'nd20',ocupacion:nombre,especie:'Humano común',nivel,
      aplazarElecciones:true,catalogoEquipo:equipoDRS};
    const uno=reglas.crearNd20(fantasiaExtendida,cfg,reglas.aleatorioSemilla('equipo-'+nombre+'-'+nivel));
    const otro=reglas.crearNd20(fantasiaExtendida,cfg,reglas.aleatorioSemilla('equipo-'+nombre+'-'+nivel));
    assert.deepEqual(uno,otro,'Equipo determinista: '+nombre+'/'+nivel);
    assert.ok(!uno.capacidades.some(x=>x.includes('(consulta Nivel y condiciones del manual)')),
      'Sin Talentos de referencia no verificados: '+nombre);
    const presupuesto=Number(uno.riqueza.match(/\/ (\d+) mo iniciales/)[1]);
    const saldo=Number(uno.riqueza.match(/^(\d+(?:\.\d+)?) mo restantes/)[1]);
    const nota=uno.notas.find(x=>x.startsWith('Equipo DRS adquirido por '));
    assert.ok(nota,'Compra DRS para '+nombre);
    const gasto=Number(nota.match(/por ([\d.]+) mo/)[1]);
    assert.ok(gasto>=0&&saldo>=0&&Math.abs((gasto+saldo)-presupuesto)<0.001,
      'Presupuesto sin rebasar: '+nombre+'/'+nivel);
    assert.ok(uno.equipo.some(x=>x.startsWith('Paquete ')),'Provisiones básicas: '+nombre+'/'+nivel);
    pruebasEquipo++;
  }
}
const forenseTalentos=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',ocupacion:'Forense',especie:'Humano común',nivel:1,
  aplazarElecciones:true,catalogoEquipo:equipoDRS},
  reglas.aleatorioSemilla('forense-inicial'));
assert.ok(forenseTalentos.capacidades.includes('Hallar la verdad')&&
  forenseTalentos.capacidades.includes('Olfato deductivo'));
const barbaroTalentos=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',ocupacion:'Bárbaro',especie:'Humano común',nivel:1,
  aplazarElecciones:true,catalogoEquipo:equipoDRS},
  reglas.aleatorioSemilla('barbaro-inicial'));
assert.ok(barbaroTalentos.capacidades.includes('Brutalidad')&&
  barbaroTalentos.capacidades.includes('Cólera'));
assert.ok(!barbaroTalentos.capacidades.includes('Energúmeno')&&
  !barbaroTalentos.capacidades.includes('Receloso'));
const planBar=poderes.planificar({juego:'nd20',ocupacion:'Bárbaro',
  especie:'Humano común',nivel:1},fantasiaExtendida,catalogoPoderes,progresiones);
assert.deepEqual(planBar.pasos.find(x=>x.id==='talento-ocupacion-inicial')
  .opciones.map(x=>x.nombre),['Energúmeno','Receloso']);
const barAuto=poderes.resolver(planBar,null,reglas.aleatorioSemilla('barbaro-autofill'));
const resultadoBar=poderes.resolver(planBar,
  Object.assign({},barAuto.decisiones,{'talento-ocupacion-inicial':['Receloso']}),
  reglas.aleatorioSemilla('barbaro-seleccion'));
const finalBar=poderes.aplicar(barbaroTalentos,planBar,resultadoBar);
assert.ok(finalBar.capacidades.includes('Receloso')&&!finalBar.capacidades.includes('Energúmeno'));
const adalidTalentos=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',ocupacion:'Adalid',especie:'Humano común',nivel:1,
  aplazarElecciones:true,catalogoEquipo:equipoDRS},
  reglas.aleatorioSemilla('adalid-inicial'));
assert.ok(adalidTalentos.capacidades.includes('Poderío del caballero'));
assert.ok(!adalidTalentos.capacidades.includes('Desafío honorable'));
const planAdalid=poderes.planificar({juego:'nd20',ocupacion:'Adalid',
  especie:'Humano común',nivel:1},fantasiaExtendida,catalogoPoderes,progresiones);
assert.equal(planAdalid.pasos.find(x=>x.id==='compromiso-adalid').opciones.length,3);
const adalidAuto=poderes.resolver(planAdalid,null,reglas.aleatorioSemilla('adalid-autofill'));
const resultadoAdalid=poderes.resolver(planAdalid,
  Object.assign({},adalidAuto.decisiones,{'compromiso-adalid':['Juramento sagrado']}),
  reglas.aleatorioSemilla('adalid-elegido'));
const finalAdalid=poderes.aplicar(adalidTalentos,planAdalid,resultadoAdalid);
assert.ok(finalAdalid.capacidades.includes('Imposición de manos')&&
  !finalAdalid.capacidades.includes('Desafío honorable'));
for(const nombre of ['Druida','Lardeur','Derviche']){
  const perfil=fantasiaExtendida.ocupaciones[nombre];
  assert.equal(perfil.talentos_documentacion.verificado,false);
  assert.equal(perfil.talentos.length,0);
}
const cifiEudemonista=reglas.crearNd20(cifiExtendida,{
  juego:'nd20_cifi',ocupacion:'Eudemonista',especie:'Humano natural',nivel:1,
  aplazarElecciones:true,catalogoEquipo:equipoDRS},
  reglas.aleatorioSemilla('eudemonista-gratis'));
assert.ok(cifiEudemonista.equipo.some(x=>x.includes('Armamento filosofal; gratuito')));
assert.ok(/^\d+ cr restantes \/ \d+ cr iniciales$/.test(cifiEudemonista.riqueza),
  'CiFi: capital inicial aprobado por el autor');
const cifiDiplomatico=reglas.crearNd20(cifiExtendida,{
  juego:'nd20_cifi',ocupacion:'Diplomático',especie:'Humano natural',nivel:1,
  aplazarElecciones:true,catalogoEquipo:equipoDRS},
  reglas.aleatorioSemilla('diplomatico-compras'));
assert.ok(!cifiDiplomatico.equipo.some(x=>x.includes('filosofal')));
const bloqueo=equipoApi.compraInicial({
  armas:[],armaduras:[],competencias:['Puedes equipar bastones.',
    'A partir de Nivel 6, puedes equipar armaduras ligeras.']},
  'Ocupación de prueba','nd20',equipoDRS,100,reglas.aleatorioSemilla('bloqueo'),1);
assert.ok(!bloqueo.equipo.some(x=>x==='Armadura acolchada'||x==='Armadura de cuero'),
  'No se adquiere armadura antes del Nivel 6');
console.log('OK · '+pruebasEquipo+' compras iniciales y elecciones de Talentos contrastadas.');


/* Decisión CiFi 28-10-2026: 4d10 × 100 cr, compras con precios del manual. */
assert.equal(equipoDRS.cifi.capital_inicial.formula,'4d10 × 100 cr');
assert.equal(equipoDRS.cifi.capital_inicial.minimo,400);
assert.equal(equipoDRS.cifi.capital_inicial.maximo,4000);
assert.ok(equipoDRS.cifi.capital_inicial.naturaleza.includes('decisión editorial'));
assert.equal(equipoDRS.cifi.armas.find(x=>x.nombre==='Pistola láser').precio,80);
assert.equal(equipoDRS.cifi.protecciones.find(x=>x.nombre==='Coraza de asalto').precio,350);
assert.equal(equipoDRS.cifi.ddp.find(x=>x.nombre==='Escudo portátil').precio,50);
let cifiValidados=0;
for(const nombre of Object.keys(cifiExtendida.ocupaciones)){
  for(const nivel of [1,6,12,30]){
    const opciones={juego:'nd20_cifi',ocupacion:nombre,especie:'Humano natural',
      nivel,aplazarElecciones:true,catalogoEquipo:equipoDRS};
    const rng=reglas.aleatorioSemilla('creditos-'+nombre+'-'+nivel);
    const personaje=reglas.crearNd20(cifiExtendida,opciones,rng);
    const repetido=reglas.crearNd20(cifiExtendida,opciones,
      reglas.aleatorioSemilla('creditos-'+nombre+'-'+nivel));
    assert.deepEqual(personaje,repetido,'Compras CiFi reproducibles '+nombre);
    const partes=personaje.riqueza.match(/^(\d+) cr restantes \/ (\d+) cr iniciales$/);
    assert.ok(partes,'Saldo cr visible: '+nombre);
    const saldo=Number(partes[1]),presupuesto=Number(partes[2]);
    assert.ok(presupuesto>=400 && presupuesto<=4000 && presupuesto%100===0);
    const nota=personaje.notas.find(x=>x.startsWith('Compra CiFi propuesta: '));
    assert.ok(nota,'Compra de equipo documentada '+nombre);
    const gastado=Number(nota.match(/propuesta: (\d+) cr/)[1]);
    assert.equal(gastado+saldo,presupuesto,'Contabilidad exacta sin sobrecostes '+nombre);
    assert.ok(personaje.notas.some(x=>x.includes('decisión editorial pendiente')),
      'Distinguir decisión del autor de regla original');
    if(nombre==='Eudemonista'){
      assert.ok(personaje.equipo.some(x=>x.includes('Armamento filosofal; gratuito')));
      assert.ok(!personaje.equipo.some(x=>x.includes('Escudo portátil')));
    }else if(nombre==='Tecnópata'){
      assert.ok(personaje.equipo.some(x=>x.includes('Implante de Ordenador neuronal')));
    }else {
      assert.ok(!personaje.equipo.some(x=>x.includes('Armamento filosofal; gratuito')));
      assert.ok(!personaje.equipo.some(x=>x.includes('Implante de Ordenador neuronal')));
    }
    if(nombre==='Psion')
      assert.ok(!personaje.equipo.some(x=>equipoDRS.cifi.protecciones.some(v=>x===v.nombre)),
        'Psion no puede usar protección corporal');
    cifiValidados++;
  }
}
const cifiSinCatalogo=reglas.crearNd20(cifiExtendida,
  {juego:'nd20_cifi',ocupacion:'Soldado',especie:'Humano natural',nivel:1},
  reglas.aleatorioSemilla('capital-sin-catalogo'));
assert.ok(/^\d+ cr restantes \/ \d+ cr iniciales$/.test(cifiSinCatalogo.riqueza),
  'Riqueza calculada también sin módulo de compras');
assert.ok(cifiSinCatalogo.notas.some(x=>x.includes('requiere el catálogo')));
assert.ok(fs.existsSync(path.join(__dirname,'..','docs','decisiones-editoriales.md')),
  'La decisión consta por escrito para actualizar el DRS');
console.log('OK · '+cifiValidados+
  ' compras CiFi comprobadas: 4d10 × 100 cr, precios, regalos y saldo.');


/* Decisiones editoriales: riqueza adicional, exclusión de Nocturna, estilos y Diletante. */
const fuentesCifiOficiales=leer('ocupaciones_cifi.json');
const nombresCifi=new Set(equipoDRS.cifi.armas.map(x=>x.nombre)
  .concat(['Anillo de defensa','Cordón de luz','Vara sónica',
    'Martillo meteórico','Lanzamisiles','Fusil de plasma']));
for(const [ocupacion,ficha] of Object.entries(fuentesCifiOficiales)){
  for(const arma of ficha.armas)
    assert.ok(nombresCifi.has(arma),'Arma CiFi no oficial: '+ocupacion+' / '+arma);
  for(const armadura of ficha.armaduras)
    assert.ok(equipoDRS.cifi.protecciones.some(x=>x.nombre===armadura),
      'Protección CiFi no oficial: '+ocupacion+' / '+armadura);
}
for(const juego of ['nd20','nd20_cifi']){
  const grupo=juego==='nd20'?fantasiaExtendida:cifiExtendida;
  const oc=juego==='nd20'?'Guerrero':'Soldado';
  for(const nivel of [1,2,6,12,30]){
    const clave='extra-'+juego+'-'+nivel;
    const base=reglas.crearNd20(grupo,{
      juego,nivel,ocupacion:oc,especie:juego==='nd20'?'Humano común':'Humano natural',
      catalogoEquipo:equipoDRS},reglas.aleatorioSemilla(clave));
    const bonus=reglas.crearNd20(grupo,{
      juego,nivel,ocupacion:oc,especie:juego==='nd20'?'Humano común':'Humano natural',
      riquezaPorNivel:true,catalogoEquipo:equipoDRS},reglas.aleatorioSemilla(clave));
    const symbol=juego==='nd20'?'mo':'cr';
    const inicialBase=Number(base.riqueza.match(new RegExp('/ (\\d+) '+symbol+' iniciales'))[1]);
    const inicialBonus=Number(bonus.riqueza.match(new RegExp('/ (\\d+) '+symbol+' iniciales'))[1]);
    const nota=bonus.notas.find(x=>x.startsWith('Riqueza adicional opcional: '));
    assert.ok(nota,'Se documenta evolución por nivel: '+juego);
    const extra=Number(nota.match(/= (\d+) (?:mo|cr)/)[1]);
    assert.ok(extra>=(nivel-1)*4&&extra<=(nivel-1)*40);
    assert.equal(inicialBonus-inicialBase,extra,
      'Se conserva capital inicial y se suma 4d10 por Nivel adicional');
    if(nivel===1)assert.equal(extra,0);
  }
}
const nocturnaSinEquipo=reglas.crearNd20(nocturna,{
  juego:'nd20_nocturna',ocupacion:'Arcanista',especie:'Humano natural',
  nivel:30,catalogoEquipo:equipoDRS,riquezaPorNivel:true},
  reglas.aleatorioSemilla('nocturna-sin-equipo'));
assert.equal(nocturnaSinEquipo.riqueza,'','Nocturna sin dinero');
assert.ok(!nocturnaSinEquipo.equipo.some(x=>x.startsWith('Paquete ')),
  'Nocturna sin paquetes del DRS');
const estilosComprobados=[1,12,24].map(n=>poderes.planificar({
  juego:'nd20',ocupacion:'Gladiador',especie:'Humano común',nivel:n},
  fantasiaExtendida,catalogoPoderes,progresiones));
assert.deepEqual(estilosComprobados.map(p=>p.pasos.filter(x=>x.tipo==='estilo_gladiatoria').length),
  [1,2,3],'Se desbloquea un Estilo de gladiatoria en 1, 12 y 24');
const fullEstilos=poderes.resolver(estilosComprobados[2],null,reglas.aleatorioSemilla('estilos-random'));
const elegidosEstilos=fullEstilos.elementos.filter(x=>x.tipo==='estilo_gladiatoria');
assert.equal(new Set(elegidosEstilos.map(x=>x.nombre)).size,3,'Estilos no repetidos');
for(const [nivel,nt,nc] of [[1,1,1],[6,2,1],[9,2,2],[12,3,2]]){
  const p=poderes.planificar({juego:'nd20',ocupacion:'Diletante',
    especie:'Humano común',nivel},fantasiaExtendida,catalogoPoderes,progresiones);
  assert.equal(p.pasos.filter(x=>x.tipo==='talento_ajeno').length,nt);
  assert.equal(p.pasos.filter(x=>x.tipo==='competencias_diletante').length,nc);
  const result=poderes.resolver(p,null,reglas.aleatorioSemilla('dil-'+nivel));
  assert.equal(new Set(result.elementos.filter(x=>x.tipo==='talento_ajeno')
    .map(x=>x.id)).size,nt,'Talentos ajenos sin repetir');
}
const pA=poderes.planificar({juego:'nd20',ocupacion:'Adalid',especie:'Humano común',
  nivel:30},fantasiaExtendida,catalogoPoderes,progresiones);
const tecnicasAd=pA.pasos.find(x=>x.titulo==='Técnicas de Adalid');
assert.ok(tecnicasAd&&tecnicasAd.dependeCompromiso,'Técnicas filtradas por compromiso');
const picks={ 'compromiso-adalid':['Juramento sagrado'] };
const disponiblesJur=poderes.disponibles(tecnicasAd,picks);
assert.ok(disponiblesJur.every(x=>x.categoria==='Disciplina'),
  'Juramento solo Técnicas de Disciplina');
assert.ok(poderes.disponibles(tecnicasAd,{
  'compromiso-adalid':['Guardián leal']}).every(x=>['Disciplina','Fuerza bruta'].includes(x.categoria)));
assert.equal(progresoAmpliado.fantasia.Adalid.niveles[29][0],'6');
assert.equal(progresoAmpliado.fantasia.Adalid.niveles[29][4],'4');
assert.equal(progresoAmpliado.fantasia.Adalid.lista_conjuros[1][0],'Bendición');
console.log('OK · riqueza adicional opcional, equipo aleatorio, CiFi oficial y elecciones 1–30.');


/* Reglas por categoría y fichas emergentes verificadas. */
const categoriasManuales={
  Dinamitero:['Fuerza bruta','Trucos sucios'],
  Vikingo:['Fuerza bruta','Preternatural'],
  Verdugo:['Disciplina','Fuerza bruta'],
  Arlequín:['Trucos sucios'],
  Gladiador:['Disciplina','Fuerza bruta','Trucos sucios']
};
for(const [nombre,categorias] of Object.entries(categoriasManuales)){
  assert.deepEqual(progresoAmpliado.fantasia[nombre].categorias,categorias,
    'Respetar las categorías explícitas del manual: '+nombre);
  const plan=poderes.planificar({juego:'nd20',nivel:30,
    ocupacion:nombre,especie:'Humano común'},
    fantasiaExtendida,catalogoPoderes,progresiones);
  const tecnica=plan.pasos.find(x=>x.titulo==='Técnicas de '+nombre);
  assert.ok(tecnica,'Técnicas generadas para '+nombre);
  assert.ok(tecnica.opciones.every(x=>categorias.includes(x.categoria)),
    'Solo categorías expresas: '+nombre);
  assert.ok(!plan.avisos.some(x=>x.includes('no está verificada la categoría')),
    'No mostrar aviso obsoleto de categoría');
}
const marginado=poderes.planificar({juego:'nd20',nivel:30,ocupacion:'Marginado',
  especie:'Humano común'},fantasiaExtendida,catalogoPoderes,progresiones);
const tecnicoMarginado=marginado.pasos.find(x=>x.titulo==='Técnicas de Marginado');
assert.ok(tecnicoMarginado,'Marginado recibe Técnicas cuando la progresión las permite');
assert.ok(new Set(tecnicoMarginado.opciones.map(x=>x.categoria)).size>1,
  'Sin categorías expresas: todas las categorías compatibles del sistema');
assert.ok(!marginado.avisos.some(x=>x.includes('no está verificada la categoría')));
const diletanteTecnicas=poderes.planificar({juego:'nd20',nivel:30,
  ocupacion:'Diletante',especie:'Humano común'},
  fantasiaExtendida,catalogoPoderes,progresiones);
assert.ok(!diletanteTecnicas.pasos.some(x=>x.titulo==='Técnicas de Diletante'),
  'Diletante no recibe Técnicas sin lista previa');
assert.ok(diletanteTecnicas.avisos.some(x=>x.includes('dependen de las Competencias')),
  'Diletante conserva restricción especial');

const tooltipApi=require('../assets/tooltips.js');
const uiApi=require('../assets/tooltip-ui.js');
const detallesDoc=leer('fichas-documentales.json');
const indiceFichas=tooltipApi.indice({
  fantasia:fantasiaExtendida,cifi:cifiExtendida,nocturna,
  catalogo:catalogoPoderes,equipo:equipoDRS,descripciones:detallesDoc
});
assert.ok(indiceFichas.total>=500,'Índice amplio para Talentos/Poderes/Objetos');
function tooltipBuscar(nombre,grupo,sistema){
  const resultado=tooltipApi.buscar(indiceFichas,nombre,grupo,sistema);
  assert.ok(resultado,'Ficha indexada: '+nombre);
  return resultado;
}
assert.ok(tooltipBuscar('Hallar la verdad','talento','nd20')
  .descripcion.includes('PNJ'),'Efecto del Talento desde manual');
assert.ok(tooltipBuscar('Decapitación','talento','nd20')
  .descripcion.includes('hacha'),'Condiciones específicas del Verdugo');
assert.ok(tooltipBuscar('Tiempo bala','talento','nd20_cifi')
  .descripcion.includes('Turno'),'Talento CiFi contrastado');
assert.ok(tooltipBuscar('Estilo de gladiatoria: Cestus','talento','nd20')
  .descripcion.includes('guanteletes'),'El estilo del personaje consulta su ficha');
assert.ok(tooltipBuscar('Cestus','talento','nd20')
  .datos.some(x=>x[0]==='Obtención'),'Estilo de gladiatoria');
assert.ok(tooltipBuscar('[T] Baluarte','poder','nd20')
  .datos.some(x=>x[0]==='Requisito'),'Requisito de Técnica');
assert.ok(tooltipBuscar('[C] Aguijón impío (C1) · Nd20','poder','nd20')
  .datos.some(x=>x[0]==='Escuelas'),'Escuela del Conjuro');
assert.ok(tooltipBuscar('Paquete Especial arcanistas: mochila; túnica','equipo','nd20')
  .datos.some(x=>x[0]==='Precio'),'Paquete de equipo y su precio');
assert.ok(tooltipBuscar('Pistola láser','equipo','nd20_cifi')
  .datos.some(x=>x[1]==='80 cr'),'Precio oficial CiFi');
assert.ok(tooltipBuscar('Armadura de cuero','equipo','nd20')
  .datos.some(x=>x[1]==='10 mo'),'Precio oficial Fantasía');
assert.ok(!tooltipApi.buscar(indiceFichas,'Talento inexistente','talento','nd20'),
  'No inventar contenido que no existe');
uiApi.configurar(indiceFichas);
assert.ok(uiApi.etiqueta('Hallar la verdad','talento','nd20').includes('data-glosa-nombre'));
assert.ok(!uiApi.etiqueta('Dato inexistente','talento','nd20').includes('button'));
assert.ok(!uiApi.etiqueta('<img src=x onerror=alert(1)>','poder','nd20').includes('<img'),
  'Escapar HTML no confiable');
const htmlTooltips=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const appTooltips=fs.readFileSync(path.join(__dirname,'..','assets','app.js'),'utf8');
const stylesTooltips=fs.readFileSync(path.join(__dirname,'..','assets','styles.css'),'utf8');
for(const token of ['assets/tooltips.js','assets/tooltip-ui.js'])
  assert.ok(htmlTooltips.includes(token),'Dependencia cargada '+token);
assert.ok(appTooltips.includes('data/fichas-documentales.json'));
assert.ok(appTooltips.includes('infoUI.configurar(indice)'));
assert.ok(appTooltips.includes('infoUI.etiqueta(v,grupo,sistema)'));
assert.ok(appTooltips.includes('consultar-ficha-eleccion'));
assert.ok(stylesTooltips.includes('.ficha-emergente'));
assert.ok(stylesTooltips.includes(':focus-visible'));
console.log('OK · categorías de Técnicas verificadas y fichas emergentes con fuentes reales.');


/* Regresión: tema sin FOUC, sistema visible en Herramientas, requisitos VA. */
const htmlTemas=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const cssTemas=fs.readFileSync(path.join(__dirname,'..','assets','styles.css'),'utf8');
const appTemas=fs.readFileSync(path.join(__dirname,'..','assets','app.js'),'utf8');
assert.ok(htmlTemas.includes('<html lang="es" data-tema="clasico">'),
  'Tema por defecto definido en raíz desde el parser');
const preCSS=htmlTemas.indexOf("localStorage.getItem('forja-tema')");
const stylesheet=htmlTemas.indexOf('href="assets/styles.css"');
assert.ok(preCSS>0 && preCSS<stylesheet,
  'Tema se lee antes de cargar CSS y de la primera pintura');
assert.ok(!htmlTemas.includes('<body data-tema="clasico">'),
  'El cuerpo no debe forzar el tema Clásico al entrar');
assert.ok(cssTemas.includes('html[data-tema=ebano]'));
assert.ok(cssTemas.includes('html[data-tema=ceruleo]'));
assert.ok(cssTemas.includes('html[data-tema=obsidiana]'));
assert.ok(cssTemas.includes('html[data-tema]:not([data-tema=clasico]) body'),
  'El fondo usa el tema inicial en body sin destello');
assert.ok(!cssTemas.includes('body[data-tema=ebano]'),
  'Las variables deben residir en html, no esperar al body');
assert.ok(appTemas.includes('document.documentElement.dataset.tema=tema.value'),
  'El selector modifica el mismo atributo que el script temprano');
const tab=htmlTemas.indexOf('id="tab-herramientas"');
const system=htmlTemas.indexOf('id="etiqueta-sistema"');
const panel=htmlTemas.indexOf('id="panel-personajes"');
const tools=htmlTemas.indexOf('id="panel-herramientas"');
assert.ok(tab>=0&&tab<system&&system<panel&&panel<tools,
  'Sistema queda visible en ambas pestañas del menú');
assert.ok(appTemas.includes("marcarPanel('herramientas')"));
assert.ok(!/refrescarSelectores\(\);\s*marcarPanel\('personajes'\)/.test(appTemas),
  'Cambiar sistema no debe expulsar al usuario de Herramientas');
assert.ok(appTemas.includes("'generar-seguidor').disabled = !dh"),
  'Generar seguidor deshabilitado fuera de Dungeon Hack');
const favicon=fs.readFileSync(path.join(__dirname,'..','assets','favicon.svg'),'utf8');
assert.ok(htmlTemas.includes('rel="icon" type="image/svg+xml" href="assets/favicon.svg"'));
assert.ok(favicon.includes('viewBox="0 0 64 64"')&&favicon.includes('D20'),
  'Favicon local derivado del emblema d20');

const requisitosVA='arma a distancia, Intuición 8+';
const int13=[{nombre:'Intuición',valor:13,dificultad:7}];
const int7=[{nombre:'Intuición',valor:7,dificultad:13}];
const apto=poderes.estadoUsoVA(requisitosVA,int13);
assert.equal(apto.comprobados[0].requerido,8);
assert.equal(apto.comprobados[0].va,13);
assert.equal(apto.faltantes.length,0,
  'DA 7 equivale a VA 13: puede USAR Disparo aturdidor con VA 8+');
const pendiente=poderes.estadoUsoVA(requisitosVA,int7);
assert.equal(pendiente.faltantes.length,1,
  'VA 7 (DA 13) puede aprender pero no utilizar Disparo aturdidor');
const fuerzaInt=poderes.estadoUsoVA('Fuerza 10+, Intuición 9+',
  [{nombre:'Fuerza',valor:8,dificultad:12},{nombre:'Intuición',valor:11,dificultad:9}]);
assert.deepEqual(fuerzaInt.faltantes.map(x=>x.atributo),['Fuerza'],
  'Requisitos de varios Atributos se contrastan independientemente');
assert.equal(poderes.estadoUsoVA('escudo grande equipado',int7).faltantes.length,0,
  'No interpretar requisitos de equipo como mínimos de VA');

const muestraPlan={recursos:[],avisos:[]},ejemploRes={
  decisiones:{tecnicas:['tecnica-03']},
  elementos:[{id:'tecnica-03',nombre:'Disparo aturdidor',tipo:'tecnica',
    etapa:'Técnicas conocidas',info:requisitosVA,origen:null,circulo:null}]
};
const pjAntes=reglas.crearNd20(fantasiaExtendida,
  {juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Humano común'},
  reglas.aleatorioSemilla('va-requisito'));
pjAntes.atributos.find(x=>x.nombre==='Intuición').valor=7;
pjAntes.atributos.find(x=>x.nombre==='Intuición').dificultad=13;
const pjPendiente=poderes.aplicar(pjAntes,muestraPlan,ejemploRes);
assert.ok(pjPendiente.poderes.some(x=>x.includes('Disparo aturdidor')),
  'Una Técnica se puede aprender aunque VA sea insuficiente para usarla');
assert.ok(pjPendiente.notas.some(x=>x.includes('pendiente de uso: Disparo aturdidor')&&
  x.includes('actual VA 7')),'Se marca la Técnica aprendida como no utilizable');
const pjApto=reglas.crearNd20(fantasiaExtendida,
  {juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Humano común'},
  reglas.aleatorioSemilla('va-requisito-apto'));
pjApto.atributos.find(x=>x.nombre==='Intuición').valor=13;
pjApto.atributos.find(x=>x.nombre==='Intuición').dificultad=7;
const pjValido=poderes.aplicar(pjApto,muestraPlan,ejemploRes);
assert.ok(!pjValido.notas.some(x=>x.includes('pendiente de uso: Disparo aturdidor')));
assert.ok(appTemas.includes('Requisitos de uso (VA)'),
  'El editor etiqueta explícitamente VA, no DA');
assert.ok(appTemas.includes("'<strong>VA '"),
  'La ficha separa claramente Valor y Dificultad de Atributo');
console.log('OK · tema previo al CSS, favicon, selector global y Técnica VA 8+ validados.');


/* Sexo configurable y contexto narrativo sin inventar restricciones mecánicas. */
const catSexo=leer('sexo-personajes.json');
const sexoMotor=require('../assets/sex.js');
const chicas=['Doncella de la Espada','Valquiria','Invocadora'];
for(const clase of chicas){
  assert.ok(catSexo.ocupaciones_contexto_femenino[clase]&&
    catSexo.ocupaciones_contexto_femenino[clase].fuente.includes('Ocupaciones'));
  assert.equal(sexoMotor.preferenciaOcupacion(clase,catSexo),'femenino');
  assert.equal(sexoMotor.ocuparPermitida(clase,'masculino',catSexo,true),false);
  assert.equal(sexoMotor.ocuparPermitida(clase,'masculino',catSexo,false),true);
  const opt={juego:'nd20',nivel:1,ocupacion:clase,especie:'Humano común',
    sexo:'aleatorio',respetarContextoSexo:true,catalogoSexo:catSexo,
    tesauroYlat,modoNombre:'documentado'};
  for(const semilla of ['uno','dos','tres','cuatro']){
    const ficha=reglas.crearNd20(fantasiaExtendida,opt,
      reglas.aleatorioSemilla('sexo-'+clase+'-'+semilla));
    assert.equal(ficha.sexo,'femenino','Ocupación con descripción femenina: '+clase);
    assert.ok(ficha.nombre!=='Joseph Williams','No repetir el caso Joseph Doncella');
    assert.ok(catSexo.nombres_generales_femeninos.includes(ficha.nombre.split(' ')[0])||
      ficha.nombre==='Sin nombre','Nombre seleccionado del repertorio femenino');
    assert.deepEqual(ficha,reglas.crearNd20(fantasiaExtendida,opt,
      reglas.aleatorioSemilla('sexo-'+clase+'-'+semilla)),
      'La semilla reproduce sexo y nombre');
  }
  assert.throws(()=>reglas.crearNd20(fantasiaExtendida,
    {...opt,sexo:'masculino'},reglas.aleatorioSemilla('incompatible')),
    /se describe en femenino|Respetar trasfondo/,'Bloqueo narrativo configurable');
  const excepcion=reglas.crearNd20(fantasiaExtendida,{
    ...opt,sexo:'masculino',respetarContextoSexo:false,
    nombre:'Joseph Williams'},reglas.aleatorioSemilla('excepcion'));
  assert.equal(excepcion.sexo,'masculino');
  assert.equal(excepcion.nombre,'Joseph Williams','Nombre manual siempre editable');
  assert.ok(excepcion.notas.some(x=>x.includes('Excepción narrativa elegida')),
    'Aviso de desviación de trasfondo, no rechazo mecánico');
}
for(const semilla of Array.from({length:90},(_,i)=>i)){
  const p=reglas.crearNd20(fantasiaExtendida,{
    juego:'nd20',nivel:1,sexo:'masculino',respetarContextoSexo:true,
    catalogoSexo:catSexo,especie:'Humano común'},
    reglas.aleatorioSemilla('ocupacion-m-'+semilla));
  assert.equal(p.sexo,'masculino');
  assert.ok(!chicas.some(x=>p.descripcion.startsWith(x+' · ')),
    'Ocupación aleatoria no contradice la configuración');
}
for(const sexo of ['femenino','masculino']){
  const p=reglas.crearNd20(fantasiaExtendida,{
    juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Humano común',
    sexo,catalogoSexo:catSexo,modoNombre:'especie'},
    reglas.aleatorioSemilla('humano-'+sexo));
  assert.equal(p.sexo,sexo);
  assert.ok(catSexo.femeninos_por_especie['Humano común'].includes(p.nombre)===
    (sexo==='femenino'),'Nombres comunes clasificados por sexo');
}
const enana=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',nivel:1,ocupacion:'Doncella de la Espada',especie:'Enano montañés',
  sexo:'aleatorio',catalogoSexo:catSexo,modoNombre:'especie'},
  reglas.aleatorioSemilla('enana-doncella'));
assert.equal(enana.sexo,'femenino');
assert.ok(catSexo.nombres_editoriales['Enano montañés'].femenino.includes(enana.nombre),
  'El repertorio masculino del enano no se usa para una Doncella');
assert.ok(enana.notas.some(x=>x.includes('Nombre propuesto editorialmente')),
  'La propuesta onomástica se señala, sin presentarla como canon');
const gerudo=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Gerudo',
  sexo:'aleatorio',catalogoSexo:catSexo,modoNombre:'especie'},
  reglas.aleatorioSemilla('gerudo'));
assert.equal(gerudo.sexo,'femenino','Gerudo femenina por defecto');
const gerudoRaro=reglas.crearNd20(fantasiaExtendida,{
  juego:'nd20',nivel:1,ocupacion:'Guerrero',especie:'Gerudo',
  sexo:'masculino',catalogoSexo:catSexo,modoNombre:'especie'},
  reglas.aleatorioSemilla('gerudo-excepcional'));
assert.equal(gerudoRaro.sexo,'masculino','Varón Gerudo es posible según manual');
assert.ok(gerudoRaro.notas.some(x=>x.includes('Varón excepcional')));
assert.equal(gerudoRaro.nombre,'Sin nombre','No inventar nombres masculinos gerudo sin fuente');
const cifiMujer=reglas.crearNd20(cifiExtendida,{
  juego:'nd20_cifi',nivel:1,ocupacion:'Tecnópata',especie:'Humano natural',
  sexo:'femenino',catalogoSexo:catSexo,modoNombre:'especie'},
  reglas.aleatorioSemilla('mujer-cifi'));
assert.equal(cifiMujer.sexo,'femenino');
assert.ok(catSexo.femeninos_por_especie['Humano natural'].includes(cifiMujer.nombre));
const noctVaron=reglas.crearNd20(nocturna,{
  juego:'nd20_nocturna',nivel:1,ocupacion:'Mercenario',
  especie:'Humano natural',sexo:'masculino',catalogoSexo:catSexo,
  modoNombre:'especie'},reglas.aleatorioSemilla('hombre-nocturna'));
assert.equal(noctVaron.sexo,'masculino');
assert.ok(!catSexo.femeninos_por_especie['Humano natural'].includes(noctVaron.nombre));
for(const sexo of ['femenino','masculino']){
  const ficha=reglas.eleccionDH(datosDH,{
    juego:'dh',nivel:1,ocupacion:'dwarf_class',
    origenes:[0,1,2,3,4],sexo,conEspecie:false},
    reglas.aleatorioSemilla('dwarf-'+sexo));
  assert.equal(ficha.sexo,sexo,'Dungeon Hack también admite sexo explícito');
  assert.ok(sexoMotor.nombresDH(datosDH.classes.dwarf_class.names,sexo).includes(ficha.nombre));
}
const indexSexo=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const appSexo=fs.readFileSync(path.join(__dirname,'..','assets','app.js'),'utf8');
for(const token of ['id="sexo-pj"','value="aleatorio"','value="femenino"',
  'value="masculino"','id="respetar-contexto-sexo"','assets/sex.js'])
  assert.ok(indexSexo.includes(token),'Control sexo: '+token);
assert.ok(appSexo.includes("sexo:$('sexo-pj').value"),'Sexo en configuración');
assert.ok(appSexo.includes('catalogoSexo:datos.sexo'), 'Catálogo disponible en reglas');
assert.ok(appSexo.includes("data/sexo-personajes.json"),'Datos de sexo cargados');
assert.ok(appSexo.includes('forja-sexo-pj')&&appSexo.includes('forja-respetar-contexto-sexo'),
  'Configuración de sexo persistente y modificable');
assert.ok(appSexo.includes('sexoApi.ocuparPermitida'),'Filtrado de Ocupaciones según ajuste');
assert.ok(appSexo.includes('Sexo:'),'Sexo incluido en ficha exportada');
console.log('OK · sexo y nombres de personajes, excepciones y configuración editable.');
