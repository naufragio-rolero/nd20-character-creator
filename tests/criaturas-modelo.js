'use strict';
const assert = require('node:assert/strict');
const c = require('../assets/creatures.js');
const vacia = c.nuevaCriatura();
assert.equal(vacia.version,1);
assert.equal(vacia.sistema,'nd20');
assert.equal(vacia.tipo,'criatura_usuario');
assert.equal(vacia.puntuaciones.nivel,null);
assert.deepEqual(vacia.ataques,[]);
assert.deepEqual(vacia.talentos,[]);
assert.equal(c.revisar(vacia).valida,true);
assert.equal(c.revisar(vacia,{paraExportar:true}).valida,false);

const original='Criatura de prueba\nCategoría de Nivel 4 [Moral 8], Salud 24\n' +
  'Ataques: 2 garras (4) y mordisco (8) o aliento\n' +
  'Aliento: efecto especial.\nDescripción de la criatura.';
const ficha=c.nuevaCriatura({
  nombre:'Criatura de prueba',
  categoria:'Categoría',
  puntuaciones:{nivel:4,moral:8,salud:24},
  ataques:[
    {id:'a1',cantidad:2,nombre:'garras',danoLiteral:'4',
      danoNumerico:4,segmentoOriginal:'2 garras (4)'},
    {id:'a2',conectorAnterior:'y',nombre:'mordisco',
      danoLiteral:'8',danoNumerico:8,segmentoOriginal:'mordisco (8)'},
    {id:'a3',conectorAnterior:'o',nombre:'aliento',
      segmentoOriginal:'aliento'}
  ],
  talentos:[{nombre:'Aliento',descripcion:'efecto especial.',
    textoOriginal:'Aliento: efecto especial.'}],
  descripcion:'Descripción de la criatura.',
  origen:{tipo:'texto_pegado',textoOriginal:original}
});
const validacion=c.revisar(ficha,{paraExportar:true});
assert.equal(validacion.valida,true,JSON.stringify(validacion.errores));
assert.ok(validacion.advertencias.some(x=>x.codigo==='agrupacion_por_revisar'));
assert.ok(validacion.advertencias.some(x=>x.codigo==='dano_no_numerico'));
assert.equal(ficha.ataques[0].cantidad,2);
assert.equal(ficha.ataques[2].danoNumerico,null);
assert.equal(ficha.origen.textoOriginal,original);
assert.equal(ficha.talentos.length,1);
assert.equal(ficha.ataques.length,3);

const alternativa=c.nuevaCriatura({nombre:'Alternativa documentada',
  ataques:[{nombre:'aplastamiento',danoLiteral:'20 o especial',danoNumerico:20},
    {conectorAnterior:'y',nombre:'mordisco',danoLiteral:'40',danoNumerico:40}]});
assert.ok(c.revisar(alternativa).advertencias.some(x=>x.codigo==='dano_alternativo'));
assert.equal(alternativa.ataques[0].danoLiteral,'20 o especial');
const conComa=c.nuevaCriatura({nombre:'Con coma',
  ataques:[{nombre:'mordisco',danoLiteral:'12',danoNumerico:12},
    {conectorAnterior:',',nombre:'coz',danoLiteral:'10',danoNumerico:10},
    {conectorAnterior:'y',nombre:'conjuro'}]});
assert.ok(c.revisar(conComa).advertencias.some(x=>x.codigo==='coma_por_revisar'));
const resto=c.nuevaCriatura({nombre:'Con texto pendiente',
  camposNoInterpretados:['Escudo variable: consultar la fuente'],
  origen:{tipo:'texto_pegado',textoOriginal:'Texto íntegro de origen.'}});
assert.equal(resto.camposNoInterpretados.length,1);
assert.ok(c.revisar(resto).advertencias.some(x=>x.codigo==='contenido_pendiente'));
assert.ok(c.revisar(c.nuevaCriatura({nombre:'Error',
  ataques:[{nombre:'mordisco',cantidad:0}]})).errores
  .some(x=>x.campo==='ataques[0].cantidad'));
assert.ok(c.revisar(c.nuevaCriatura({nombre:'Error',
  ataques:[{nombre:'primero'}, {nombre:'segundo',conectorAnterior:'Inicio'}]})).errores
  .some(x=>x.campo==='ataques[1].conectorAnterior'));
const antes=JSON.stringify(ficha);
c.revisar(ficha);
assert.equal(JSON.stringify(ficha),antes,'La validación no debe modificar fichas.');
console.log('OK · Modelo de criaturas Nd20 (fase 1).');
