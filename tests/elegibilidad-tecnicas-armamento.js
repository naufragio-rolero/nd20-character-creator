'use strict';
/* Elegibilidad editorial DRS: los requisitos de Ocupación restringen el
 * aprendizaje; VA, equipo y Nivel se exigen al usar una Técnica. */
const assert=require('node:assert/strict');
const poderes=require('../assets/powers.js');
const equipo=require('../assets/equipment.js');
const especies=require('../data/especies.json');
const ocupaciones=require('../data/ocupaciones.json');
const catalogoEquipo=require('../data/equipo-inicial.json');
const catalogoPoderes=require('../data/catalogo-poderes.json');
const progresiones=require('../data/progresiones-oficiales.json');
const datos={especies,ocupaciones};
function tecnicas(ocupacion,nivel,fuentes=['DRS']){
 const plan=poderes.planificar({juego:'nd20',ocupacion,
   especie:'Humano común',nivel,fuentes},datos,catalogoPoderes,progresiones);
 return plan.pasos.find(p=>p.tipo==='tecnica').opciones;
}
// Metadatos estructurados: conservan las glosas literales originales.
const raj= catalogoPoderes.tecnicas.find(x=>x.id==='tecnica-06');
const sorpresa=catalogoPoderes.tecnicas.find(x=>x.id==='tecnica-09');
assert.deepEqual(raj.ocupaciones_permitidas,['Guerrero']);
assert.deepEqual(raj.requisitos_uso,[{tipo:'nivel',minimo:6}]);
assert.equal(raj.requisito,'Guerrero, Nivel 6+');
assert.deepEqual(sorpresa.ocupaciones_permitidas,['Ladrón']);
assert.deepEqual(sorpresa.requisitos_uso,[]);
assert.equal(sorpresa.requisito,'Ladrón');
assert.equal(catalogoPoderes.tecnicas.filter(x=>
 Object.hasOwn(x,'ocupaciones_permitidas')).length,2,
 'Solo las dos Técnicas aprobadas llevan el nuevo esquema');
// Las mismas técnicas llegan al plan de generación con sus metadatos intactos.
const opcionesGuerreroNv1=tecnicas('Guerrero',1);
const rajNv1=opcionesGuerreroNv1.find(x=>x.id==='tecnica-06');
assert.deepEqual(rajNv1.ocupaciones_permitidas,['Guerrero']);
assert.deepEqual(rajNv1.requisitos_uso,[{tipo:'nivel',minimo:6}]);
assert.deepEqual(tecnicas('Ladrón',1).find(x=>x.id==='tecnica-09').requisitos_uso,[]);
assert.ok(rajNv1,'El requisito de uso de Nivel 6 no bloquea aprendizaje en Nivel 1');

// Modificar la elegibilidad declarativa no requiere cambiar el JavaScript.
function conCatalogo(ocupacion,cat){
 const plan=poderes.planificar({juego:'nd20',ocupacion,
   especie:'Humano común',nivel:6,fuentes:['DRS']},datos,cat,progresiones);
 return plan.pasos.find(x=>x.tipo==='tecnica').opciones;
}
const alternativo=JSON.parse(JSON.stringify(catalogoPoderes));
const cambiada=alternativo.tecnicas.find(x=>x.id==='tecnica-09');
cambiada.ocupaciones_permitidas=['Guerrero','Ladrón'];
assert.ok(conCatalogo('Guerrero',alternativo).some(x=>x.id==='tecnica-09'),
 'Una lista de dos Ocupaciones habilita ambas sin modificar el motor');
assert.ok(conCatalogo('Ladrón',alternativo).some(x=>x.id==='tecnica-09'));
cambiada.ocupaciones_permitidas=['Guerrero'];
assert.ok(!conCatalogo('Ladrón',alternativo).some(x=>x.id==='tecnica-09'),
 'El campo estructurado prevalece sobre el texto literal anterior');
const rajAlternativo=alternativo.tecnicas.find(x=>x.id==='tecnica-06');
rajAlternativo.ocupaciones_permitidas=['Ladrón'];
assert.ok(!conCatalogo('Guerrero',alternativo).some(x=>x.id==='tecnica-06'),
 'Rajar ya no es aprendible por Guerrero al cambiar su lista');
assert.ok(!conCatalogo('Ladrón',alternativo).some(x=>x.id==='tecnica-06'),
 'La categoría Fuerza bruta sigue excluida para Ladrón, incluso si figura como autorizado');
rajAlternativo.categoria='Trucos sucios';
assert.ok(conCatalogo('Ladrón',alternativo).some(x=>x.id==='tecnica-06'),
 'Tras ajustar categoría y Ocupación, no se necesitan cambios de código');
rajAlternativo.ocupaciones_permitidas=[];
assert.throws(()=>conCatalogo('Ladrón',alternativo),/Ocupaciones permitidas inválidas/,
 'Un esquema vacío no se interpreta como libre acceso');
rajAlternativo.ocupaciones_permitidas=['Ladrón'];
rajAlternativo.requisitos_uso=[{tipo:'nivel',minimo:0}];
assert.throws(()=>conCatalogo('Ladrón',alternativo),/Requisitos de uso inválidos/,
 'Una condición de Nivel malformada no entra silenciosamente en el catálogo');

for(const nivel of [1,5,6,12,24,30]){
 const guerrero=tecnicas('Guerrero',nivel),ladron=tecnicas('Ladrón',nivel);
 assert.equal(guerrero.length,9);
 assert.equal(ladron.length,6);
 assert.ok(!guerrero.some(t=>t.nombre==='Ataque sorpresa'));
 assert.ok(ladron.some(t=>t.nombre==='Ataque sorpresa'));
 assert.ok(!ladron.some(t=>t.nombre==='Rajar'));
 assert.ok(guerrero.some(t=>t.nombre==='Rajar'),
   'Nivel 6+ de Rajar no impide aprenderlo: es requisito de uso');
 assert.ok(guerrero.some(t=>t.nombre==='Doble ataque'&&
   t.requisito==='Agilidad 8+'),'El VA se exige en el uso');
 assert.ok(ladron.every(t=>['Disciplina','Trucos sucios'].includes(t.categoria)));
}
for(const nombre of ['Guerrero','Ladrón']){
 const opciones=tecnicas(nombre,30,['DRS','Ocupaciones']);
 assert.ok(!opciones.some(x=>['Postura de Gaehr Moradh',
   'Anhelo voluntarioso'].includes(x.nombre)),
   'Técnicas exclusivas Valquiria vedadas sin la Ocupación');
}
const humano=especies['Humano común'];
function tienda(nombre,nivel=1,especie=humano){
 return equipo.opcionesCompraCompetentes(catalogoEquipo,ocupaciones[nombre],nivel,especie);
}
function puede(nombre,nivel,grupo,articulo){
 return tienda(nombre,nivel).some(x=>x.grupo===grupo&&x.nombre===articulo);
}
for(const [nombre,nivel] of [['Clérigo',1],['Clérigo',12],['Guerrero',1],
 ['Mago',1],['Ladrón',5],['Ladrón',6]]){
 const info=equipo.informacionEquipo(catalogoEquipo,ocupaciones[nombre],nivel,humano);
 const solo=tienda(nombre,nivel);
 if(nombre==='Mago')assert.ok(info.some(x=>!x.competente),
   'La consulta informativa del Mago conserva objetos con Desventaja');
 assert.deepEqual(solo,info.filter(x=>x.competente),
   'La tienda solo ofrece Competencias actuales: '+nombre+' Nv '+nivel);
 assert.ok(solo.length>0);
}
assert.ok(puede('Mago',1,'armas','Bastón'));
assert.ok(puede('Mago',1,'varitas_defensa','Varita de cerezo'));
assert.ok(!puede('Mago',1,'armas','Espadón'));
assert.ok(!puede('Mago',1,'armaduras','Armadura completa de placas'));
assert.ok(!puede('Guerrero',1,'varitas_defensa','Varita de cerezo'));
assert.ok(puede('Guerrero',1,'armas','Espadón'));
assert.ok(!puede('Clérigo',11,'armaduras','Armadura completa de placas'));
assert.ok(puede('Clérigo',12,'armaduras','Armadura completa de placas'));
assert.ok(!puede('Clérigo',1,'armas','Espadón'));
assert.ok(!puede('Ladrón',5,'varitas_defensa','Varita de cerezo'));
assert.ok(puede('Ladrón',6,'varitas_defensa','Varita de cerezo'));
assert.ok(!puede('Ladrón',6,'escudos','Escudo pequeño'));
assert.ok(tienda('Guerrero',1,especies['Gnomo urbano'])
 .filter(x=>x.grupo==='escudos').every(x=>x.nombre==='Escudo pequeño'));
const daga=catalogoEquipo.armas.find(x=>x.nombre==='Daga');
const pj=()=>({juego:'Naufragio d20 · Fantasía',
 equipo:['Daga'],saldo_mo:2000,
 compras_iniciales_intercambiables:[{indice:0,nombre:'Daga',
   grupo:'armas',precio:daga.precio,origen:'compra_inicial'}]});
const original=pj();
assert.throws(()=>equipo.comprarArmamentoFantasia(original,catalogoEquipo,
 ocupaciones.Mago,1,humano,[{grupo:'armas',nombre:'Espadón',cantidad:1}]),
 /Artículo no disponible/);
assert.throws(()=>equipo.intercambiarEquipoInicial(original,catalogoEquipo,
 ocupaciones.Mago,1,humano,{indice:0,grupo:'armas',nombre:'Espadón'}),
 /Artículo no disponible/);
assert.deepEqual(original,pj(),'Ninguna compra fallida altera inventario ni dinero');
const compra=equipo.comprarArmamentoFantasia(original,catalogoEquipo,
 ocupaciones.Mago,1,humano,[{grupo:'armas',nombre:'Bastón',cantidad:1}]);
assert.ok(compra.equipo.includes('Bastón')&&compra.gastado>0);
const cambio=equipo.intercambiarEquipoInicial(original,catalogoEquipo,
 ocupaciones.Mago,1,humano,{indice:0,grupo:'armas',nombre:'Bastón'});
assert.equal(cambio.equipo[0],'Bastón');
console.log('OK · Requisitos de Ocupación y compras/intercambios competentes DRS.');
