'use strict';
/* Tanda 2 — seguidores DRS y preparación de Conjuros sin inventar progresión. */
const assert=require('node:assert/strict');
const reglas=require('../assets/rules.js');
const poderes=require('../assets/powers.js');
const especies=require('../data/especies.json');
const ocupaciones=require('../data/ocupaciones.json');
const catalogo=require('../data/catalogo-poderes.json');
const progresiones=require('../data/progresiones-oficiales.json');
const datos={especies,ocupaciones};

// Tabla DRS 1.1.12: orden d12, precio, Moral, Salud y disponibilidad.
const tabla=[
 ['Arcanista','20 mo',8,4,'Depende'],
 ['Artesano','1 mo',6,4,'No'],
 ['Cazador','2 mo',9,8,'Sí'],
 ['Escriba','1 mo',6,4,'Depende'],
 ['Escudero','1 mp',7,6,'Sí'],
 ['Guardia','2 mo',9,8,'Sí'],
 ['Ladrón','1 mo',7,4,'Depende'],
 ['Mensajero','5 mo',8,6,'Sí'],
 ['Mercenario','5 mo',9,8,'Sí'],
 ['Portantorchas','8 mc',6,6,'Sí'],
 ['Porteador','7 mp',7,6,'Sí'],
 ['Sacerdote','3 mo',10,4,'No']
];
assert.deepEqual(reglas.seguidoresDRS().map(x=>[
 x.nombre,x.precio,x.moral,x.dado,x.aventura
]),tabla,'Doce filas literales y en orden d12');
for(const [nombre,precio,moral,dado,aventura] of tabla){
 const cfg={tipo:nombre};
 const a=reglas.seguidorNd20(cfg,reglas.aleatorioSemilla('seguidor-drs-'+nombre));
 const b=reglas.seguidorNd20(cfg,reglas.aleatorioSemilla('seguidor-drs-'+nombre));
 assert.deepEqual(a,b,'Seguidor reproducible '+nombre);
 assert.equal(a.nombre,nombre);
 assert.equal(a.juego,'Naufragio d20 · Fantasía');
 assert.equal(a.tipo_ficha,'seguidor_drs');
 assert.equal(a.nivel,null,'El seguidor DRS no hereda Nivel de DH');
 assert.deepEqual(a.atributos.map(x=>x.nombre),['Ataque','Defensa']);
 assert.ok(a.atributos.every(x=>x.valor>=4&&x.valor<=9&&
   x.valor+x.dificultad===20&&!x.favorito),'VA y DA calculados como PJ');
 assert.equal(a.recursos.length,2,'Solo Salud y Moral');
 assert.equal(a.recursos[1][1],moral);
 assert.match(a.recursos[0][1],new RegExp('^([1-9][0-9]*) \\(d'+dado+'\\)$'));
 assert.ok(Number(a.recursos[0][1].split(' ')[0])>=1&&
   Number(a.recursos[0][1].split(' ')[0])<=dado);
 assert.equal(a.riqueza,precio+'/día');
 assert.ok(a.notas.includes('Disponibilidad para aventuras: '+aventura+'.'));
 assert.deepEqual(a.equipo,[]);
 assert.ok(!a.recursos.some(x=>x[0]==='Esfuerzo'),'No tiene Esfuerzo');
 assert.deepEqual(a.capacidades,[],'Ningún talento inventado');
}
assert.throws(()=>reglas.seguidorNd20({tipo:'Diplomático'},
  reglas.aleatorioSemilla('error')),/no está en la tabla/);
for(const seed of ['A','B','C']){
 const a=reglas.seguidorNd20({},reglas.aleatorioSemilla(seed));
 const b=reglas.seguidorNd20({},reglas.aleatorioSemilla(seed));
 assert.deepEqual(a,b,'d12 aleatorio reproducible');
 assert.ok(tabla.some(x=>x[0]===a.nombre));
}
const primera=reglas.seguidoresDRS();
primera[0].precio='alterado';
assert.equal(reglas.seguidoresDRS()[0].precio,'20 mo','La tabla está protegida ante cambios externos');

function personaje(ocupacion,nivel,semilla){
 const rng=reglas.aleatorioSemilla(semilla);
 const base=reglas.crearNd20(datos,{juego:'nd20',ocupacion,
   especie:'Humano común',nivel,aplazarElecciones:true},rng);
 const plan=poderes.planificar({juego:'nd20',nivel,ocupacion,
   especie:'Humano común'},datos,catalogo,progresiones);
 const resultado=poderes.resolver(plan,null,rng);
 return poderes.registrar(base,plan,resultado);
}
const clerigoInicial=personaje('Clérigo',1,'clerigo-1');
assert.equal(poderes.preparacionesRevisables(clerigoInicial).length,0,
  'Un Clérigo de Nivel 1 no dispone de Espacios DRS');
assert.throws(()=>poderes.preparar(clerigoInicial,{}),/carece de Espacios/);
const clerigo=personaje('Clérigo',12,'clerigo-12');
const pasosC=poderes.preparacionesRevisables(clerigo);
assert.ok(pasosC.length>=2,'Clérigo con Círculos documentados');
assert.ok(pasosC.every(p=>!p.dependeGrimorio));
const circuloC=pasosC[0],opcionesC=poderes.disponibles(
 circuloC,clerigo.elecciones_registradas.decisiones);
const conjuroC=opcionesC.find(x=>x.id!=='__vacio');
assert.ok(conjuroC,'Catálogo de Clérigo documentado');
const antesClerigo=JSON.parse(JSON.stringify(clerigo));
const cle=poderes.preparar(clerigo,{[circuloC.id]:
  Array(circuloC.cantidad).fill(conjuroC.id)});
assert.deepEqual(clerigo,antesClerigo,'La edición no muta la ficha original');
assert.equal(cle.elecciones_registradas.decisiones[circuloC.id].length,circuloC.cantidad);
assert.equal(cle.conjuros_preparados.filter(s=>s.includes(conjuroC.nombre)).length,
  circuloC.cantidad,'Se puede preparar el mismo Conjuro varias veces');
assert.deepEqual(cle.poderes,clerigo.poderes,'Los Conjuros del Clérigo no cambian');
const conHueco=poderes.preparar(cle,{[circuloC.id]:
 Array(circuloC.cantidad).fill('__vacio')});
assert.ok(conHueco.conjuros_preparados.length<cle.conjuros_preparados.length);
assert.match(conHueco.notas.join(' '),/Espacio\(s\) de Conjuro sin preparar/);
assert.equal(conHueco.notas.filter(s=>s.includes('Espacio(s) de Conjuro sin preparar.')).length,1,
  'La advertencia de huecos no se duplica');
assert.throws(()=>poderes.preparar(clerigo,{[circuloC.id]:['__vacio']}),
 /Cantidad de Espacios/);
assert.throws(()=>poderes.preparar(clerigo,{'circulo-inexistente':['__vacio']}),
 /No existe esa plaza/);

const mago=personaje('Mago',12,'mago-12');
const pasosM=poderes.preparacionesRevisables(mago);
assert.ok(pasosM.length>=2&&pasosM.every(x=>x.dependeGrimorio));
const pasoM=pasosM.find(x=>x.cantidad>=2);
assert.ok(pasoM,'Progresión de Mago con preparaciones múltiples');
const opcionesM=poderes.disponibles(pasoM,mago.elecciones_registradas.decisiones);
const conjuroM=opcionesM.find(x=>x.id!=='__vacio');
assert.ok(conjuroM);
const copiaM=JSON.parse(JSON.stringify(mago));
copiaM.equipo.push('Objeto posterior que debe conservarse');
copiaM.notas.push('Anotación posterior');
copiaM.saldo_mo=7.35;
const preparado=poderes.preparar(copiaM,{[pasoM.id]:
 Array(pasoM.cantidad).fill(conjuroM.id)});
assert.deepEqual(preparado.equipo,copiaM.equipo,'No borrar equipo posterior');
assert.equal(preparado.saldo_mo,7.35,'No alterar economía');
assert.ok(preparado.notas.includes('Anotación posterior'),'Mantener notas');
assert.deepEqual(preparado.poderes,mago.poderes,'El grimorio no cambia al preparar');
assert.equal(preparado.conjuros_preparados.filter(x=>x.includes(conjuroM.nombre)).length,
  pasoM.cantidad,'Repeticiones de Mago permitidas');
const noConocido=pasoM.opciones.find(x=>!opcionesM.some(y=>y.id===x.id));
if(noConocido)assert.throws(()=>poderes.preparar(preparado,
  {[pasoM.id]:Array(pasoM.cantidad).fill(noConocido.id)}),/fuera del Círculo o grimorio/);
const pasoOtro=pasosM.find(x=>x.id!==pasoM.id);
const ajeno=pasoOtro.opciones.find(x=>!opcionesM.some(y=>y.id===x.id));
if(ajeno)assert.throws(()=>poderes.preparar(preparado,
  {[pasoM.id]:Array(pasoM.cantidad).fill(ajeno.id)}),/fuera del Círculo o grimorio/);

// Cambiar un Conjuro conocido invalida preparaciones que dependían de él,
// pero no las sustituye por otro Conjuro ni altera el precio o la ficha.
const idUsado=conjuroM.id;
const reg=preparado.elecciones_registradas;
const aprendizaje=reg.plan.pasos.find(p=>
 p.tipo==='conjuro_conocido'&&(reg.decisiones[p.id]||[]).includes(idUsado));
assert.ok(aprendizaje,'Se identifica la plaza original de grimorio');
const todosConocidos=new Set(reg.plan.pasos.filter(p=>p.tipo==='conjuro_conocido')
 .flatMap(p=>reg.decisiones[p.id]||[]));
const candidato=aprendizaje.opciones.find(op=>!todosConocidos.has(op.id));
assert.ok(candidato,'Existe un reemplazo válido y distinto');
const nuevaLista=reg.decisiones[aprendizaje.id].map(x=>x===idUsado?candidato.id:x);
const revisado=poderes.revisar(preparado,{[aprendizaje.id]:nuevaLista});
assert.ok(revisado.preparacionesRetiradas>=pasoM.cantidad);
assert.ok(revisado.personaje.elecciones_registradas.decisiones[pasoM.id]
  .every(x=>x==='__vacio'),'Se retiran preparaciones ilegales');
assert.deepEqual(revisado.personaje.equipo,preparado.equipo);
assert.equal(revisado.personaje.saldo_mo,preparado.saldo_mo);
assert.deepEqual(poderes.preparacionesRevisables(
  reglas.seguidorNd20({tipo:'Arcanista'},reglas.aleatorioSemilla('n'))),[]);
console.log('OK · Tanda 2: 12 seguidores DRS, grimorio y preparaciones con conservación de ficha.');
