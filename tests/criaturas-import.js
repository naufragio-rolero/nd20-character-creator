'use strict';
const assert = require('node:assert/strict');
const modelo = require('../assets/creatures.js');
const parser = require('../assets/creatures-import.js');

const original = [
  'Araña peluda',
  'Alimaña de Nivel 2 [Moral 8], Salud 12',
  'Ataques: mordisco (4) y tela de araña',
  'Tela de araña: tiene un alcance de 6m; un objetivo, Tirada de Agilidad o queda Agarrado.',
  'Un arácnido del tamaño de un perro grande.'
].join('\n');
const ara = parser.descomponerTexto(original);
assert.equal(ara.valida,true);
assert.equal(ara.criatura.nombre,'Araña peluda');
assert.equal(ara.criatura.categoria,'Alimaña');
assert.deepEqual([ara.criatura.puntuaciones.nivel,ara.criatura.puntuaciones.moral,
  ara.criatura.puntuaciones.salud],[2,8,12]);
assert.equal(ara.criatura.puntuaciones.blindaje,null);
assert.equal(ara.criatura.ataques.length,2);
assert.equal(ara.criatura.ataques[1].danoNumerico,null);
assert.equal(ara.criatura.ataques[1].conectorAnterior,'y');
assert.equal(ara.criatura.talentos[0].nombre,'Tela de araña');
assert.ok(ara.criatura.descripcion.startsWith('Un arácnido'));
assert.equal(ara.criatura.origen.textoOriginal,original);

const vegetal = parser.descomponerTexto(
  'Árbol pugilista\nVegetal de Nivel 4, Salud 28\n' +
  'Ataques: 2 ramalazos (6)\nPlanta: no tiene Moral.\nInmóvil: no puede moverse.\nFornido sauce.');
assert.equal(vegetal.criatura.puntuaciones.moral,null);
assert.equal(vegetal.criatura.ataques[0].cantidad,2);
assert.equal(vegetal.criatura.talentos.length,2);

const ylat = parser.descomponerTexto([
 'Dragodrilo', 'Descripción', 'Un depredador reptiliano.',
 'Etimología', 'Dragón y cocodrilo.', 'Estadísticas',
 'Reptil neutral Grande (4)', 'Nivel 7 — Moral 7',
 'Ataques: 2 Garras (4), Mordisco (8) y Coletazo (4) o Hálito tóxico',
 'Salud 43', 'Golpe de cola: derriba al adversario.',
 'Gases nocivos: efecto de aliento.',
 'Mejoras de Nivel', '+5 Salud cada Nivel'
].join('\n'));
assert.equal(ylat.valida,true);
assert.equal(ylat.criatura.puntuaciones.nivel,7);
assert.equal(ylat.criatura.puntuaciones.moral,7);
assert.equal(ylat.criatura.puntuaciones.salud,43);
assert.equal(ylat.criatura.puntuaciones.tamano,4);
assert.deepEqual(ylat.criatura.ataques.map(a=>a.conectorAnterior),['Inicio',',','y','o']);
assert.deepEqual(ylat.criatura.ataques.map(a=>a.cantidad),[2,1,1,1]);
assert.equal(ylat.criatura.talentos.length,2);
assert.ok(ylat.criatura.descripcion.includes('depredador'));
assert.ok(ylat.criatura.camposNoInterpretados.some(x=>x.includes('Salud cada Nivel')));
assert.ok(ylat.advertencias.some(x=>x.codigo==='categoria_compuesta'));
assert.ok(ylat.advertencias.some(x=>x.codigo==='coma_por_revisar'));
assert.ok(ylat.advertencias.some(x=>x.codigo==='agrupacion_por_revisar'));

const individual = parser.descomponerTexto(
  '# Criatura propia\nCategoría: Humanoide\nNivel: 5\nMoral: 7\nSalud: 30\n' +
  'Blindaje: 2\nMovimiento: 6\nAtaques: puño (4)\n' +
  'Notas: Camina por el puente.\nDescripción: Vive junto al río.');
assert.equal(individual.criatura.nombre,'Criatura propia');
assert.equal(individual.criatura.puntuaciones.blindaje,2);
assert.equal(individual.criatura.puntuaciones.movimiento,6);
assert.equal(individual.criatura.notas,'Camina por el puente.');
assert.equal(individual.criatura.descripcion,'Vive junto al río.');

const especial = parser.descomponerTexto(
  'Gashadokuro\nMuerto viviente de Nivel 8, Salud 60\n' +
  'Ataques: aplastamiento (20 o especial) y mordisco destructor (40)');
assert.equal(especial.criatura.ataques[0].danoLiteral,'20 o especial');
assert.equal(especial.criatura.ataques[0].danoNumerico,20);
assert.ok(especial.advertencias.some(x=>x.codigo==='dano_alternativo'));

const habilidades = parser.descomponerTexto(
  'Criatura propia\nCategoría: Aberrante\nNivel: 3\nSalud: 12\n' +
  'Habilidades especiales:\nIntangible: atraviesa obstáculos.');
assert.equal(habilidades.criatura.talentos[0].nombre,'Intangible');
assert.ok(habilidades.advertencias.some(x=>x.codigo==='sin_ataques'));

const ambiguo = parser.descomponerTexto('Criatura propia\n' +
  'Bestia de Nivel 3, Salud 12\nAtaques: mordisco (1d6) o aliento\n' +
  'Talentos: mordisco, aliento');
assert.equal(ambiguo.criatura.ataques[0].danoLiteral,'1d6');
assert.equal(ambiguo.criatura.ataques[0].danoNumerico,null);
assert.equal(ambiguo.criatura.talentos.length,0);
assert.ok(ambiguo.criatura.camposNoInterpretados.includes('Talentos: mordisco, aliento'));
assert.ok(ambiguo.advertencias.some(x=>x.codigo==='talentos_en_linea'));

const seg = parser.descomponerTexto(
  'Criatura propia\nBestia de Nivel 3, Salud 12\nAtaques: zarpazo (3)\n' +
  'Maldición: afecta al objetivo.\nSi el aventurero falla, sufrirá daño.\n' +
  'Una criatura de cavernas.');
assert.equal(seg.criatura.camposNoInterpretados.length,1);
assert.equal(seg.criatura.descripcion,'Una criatura de cavernas.');
assert.ok(seg.advertencias.some(x=>x.codigo==='continuacion_dudosa'));
assert.throws(()=>parser.descomponerTexto(''),/Pega el texto/);
assert.throws(()=>parser.descomponerTexto('x'.repeat(120001)),/demasiado largo/);
const sinSalud=parser.descomponerTexto(
  'Adversario sin Salud documentada\nHumanoide de Nivel 4 [Moral 7]\nAtaques: mordisco (6)');
assert.equal(sinSalud.criatura.saludModo,'manual');
assert.equal(sinSalud.criatura.puntuaciones.salud,null);
assert.equal(sinSalud.criatura.puntuaciones.nivel,4);
assert.equal(sinSalud.criatura.descripcion,'');
assert.equal(modelo.revisar(ylat.criatura).valida,true);
assert.equal(parser.separarAtaques('aplastamiento (20 o especial) y mordisco (40)')
  .trozos.length,2);
const brote = parser.descomponerTexto(
  'Brote de rosa negra\nVegetal de Nivel 2, Salud 8\n' +
  'Ataques: estallido de espinas (4) – Trampa: cuando una criatura pisa o se acerca demasiado, ' +
  'el brote libera una ráfaga de espinas afiladas (Alcance 2 m, un solo uso).');
assert.equal(brote.criatura.ataques.length,1);
assert.equal(brote.criatura.ataques[0].nombre,'estallido de espinas');
assert.equal(brote.criatura.ataques[0].danoNumerico,4);
assert.equal(brote.criatura.talentos.length,1);
assert.equal(brote.criatura.talentos[0].nombre,'Trampa');
assert.ok(brote.criatura.talentos[0].descripcion.includes('criatura pisa'));
assert.ok(brote.advertencias.some(x=>x.codigo==='habilidad_inline_en_ataques'));

const puntuacionAnotada = parser.descomponerTexto(
  'Criatura propia\nBestia de Nivel 4, Salud 16\n' +
  'Ataques: 2 látigos de vid (6 cada uno, Alcance 8 m).');
assert.equal(puntuacionAnotada.criatura.ataques[0].nombre,'látigos de vid');
assert.equal(puntuacionAnotada.criatura.ataques[0].cantidad,2);
assert.equal(puntuacionAnotada.criatura.ataques[0].danoLiteral,
  '6 cada uno, Alcance 8 m');
assert.equal(puntuacionAnotada.criatura.ataques[0].danoNumerico,6);
assert.equal(puntuacionAnotada.criatura.ataques[0].notas,'cada uno, Alcance 8 m');

const fragmentos = parser.descomponerTexto(
  'Criatura propia\nBestia de Nivel 4, Salud 16\n' +
  'Ataques: golpe descomunal (48) o lluvia de fragmentos (30 * 3)');
assert.equal(fragmentos.criatura.ataques[1].danoNumerico,30);
assert.equal(fragmentos.criatura.ataques[1].danoLiteral,'30 * 3');
assert.equal(fragmentos.criatura.ataques[1].notas,'* 3');

console.log('OK · Importación Nd20 DRS/Ylat, casos especiales y texto pendiente.');
