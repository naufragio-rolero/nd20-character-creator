'use strict';
const assert = require('node:assert/strict');
const c = require('../assets/creatures.js');
const vacia = c.nuevaCriatura();
assert.equal(vacia.version,1);
assert.equal(vacia.sistema,'nd20');
assert.equal(vacia.tipo,'criatura_usuario');
assert.equal(vacia.puntuaciones.nivel,null);
assert.equal(vacia.saludModo,'manual','La Salud no se infiere sin decisión expresa.');
assert.equal(c.nuevaCriatura({nombre:'Sin Salud documentada',puntuaciones:{nivel:8}}).puntuaciones.salud,null);
assert.equal(c.nuevaCriatura({nombre:'Sin Salud documentada',puntuaciones:{nivel:8}}).saludModo,'manual');
assert.equal(c.nuevaCriatura({nombre:'Cálculo solicitado',saludModo:'automatico'}).saludModo,'automatico');
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
const metadatos=c.nuevaCriatura({nombre:'JSON con campos de otra versión'});
metadatos.reglaInventada='ninguna';
assert.ok(c.revisar(metadatos,{paraExportar:true}).errores.some(x=>x.campo==='reglaInventada'));
delete metadatos.reglaInventada;
metadatos.puntuaciones.nivel=Number.MAX_SAFE_INTEGER+1;
assert.equal(c.revisar(metadatos).valida,false);
metadatos.puntuaciones.nivel=0;
metadatos.ataques=[c.ataque({nombre:'golpe',cantidad:1})];
metadatos.ataques[0].propiedadExtra='no perder';
assert.ok(c.revisar(metadatos).errores.some(x=>x.campo==='ataques[0].propiedadExtra'));
delete metadatos.ataques[0].propiedadExtra;
metadatos.talentos=[c.talento({nombre:'Prueba'})];
metadatos.talentos[0].incompatible=true;
assert.ok(c.revisar(metadatos).errores.some(x=>x.campo==='talentos[0].incompatible'));
delete metadatos.talentos[0].incompatible;
metadatos.origen.sesion='desconocida';
assert.ok(c.revisar(metadatos).errores.some(x=>x.campo==='origen.sesion'));
const antes=JSON.stringify(ficha);
c.revisar(ficha);
assert.equal(JSON.stringify(ficha),antes,'La validación no debe modificar fichas.');
assert.equal(c.CATEGORIAS.length,16);
assert.equal(c.CATEGORIAS.includes('Muerto viviente'),true);
for(const [nivel,ajuste,esperada] of [[4,0,16],[4,1,20],[4,-1,12],[4,2,24],[4,-2,8]])
  assert.equal(c.saludMedia(nivel,ajuste),esperada,'Salud media documentada');
assert.throws(()=>c.saludMedia(101,0),/Nivel o ajuste/);
const saludPersonalizada=c.nuevaCriatura({nombre:'Documentada',
  puntuaciones:{nivel:4,salud:37},saludModo:'manual',saludAjuste:-2});
assert.equal(saludPersonalizada.puntuaciones.salud,37,
  'La Salud documentada no puede ser reemplazada por una media');
assert.equal(c.revisar(saludPersonalizada).valida,true);
const ampliacion=JSON.parse(JSON.stringify(saludPersonalizada));
ampliacion.saludAjuste='-2';
assert.equal(c.revisar(ampliacion).valida,false,'No admitir ajustes sin validar');
const versionAnterior=JSON.parse(JSON.stringify(saludPersonalizada));
delete versionAnterior.saludModo;delete versionAnterior.saludAjuste;
assert.equal(c.revisar(versionAnterior).valida,true,
  'Los JSON v1 anteriores siguen siendo válidos');
// Ilustraciones opcionales en fichas personales, no fuentes ni reglas.
const ilustrada=c.nuevaCriatura({nombre:'Ilustrada',
  imagen:'data:image/png;base64,aGVsbG8='});
assert.equal(c.revisar(ilustrada,{paraExportar:true}).valida,true);
assert.equal(c.nuevaCriatura(ilustrada).imagen,ilustrada.imagen);
for(const nociva of ['https://example.com/imagen.png',
  'data:image/svg+xml;base64,PHN2Zz4=', 'data:text/html;base64,PHA+',
  'data:image/png;base64,'+'a'.repeat(280010)]){
  const sospechosa=c.nuevaCriatura({nombre:'Ilustración inválida',imagen:nociva});
  assert.ok(c.revisar(sospechosa).errores.some(x=>x.campo==='imagen'));
}
const sinImagen=JSON.parse(JSON.stringify(ilustrada));
delete sinImagen.imagen;
assert.equal(c.revisar(sinImagen,{paraExportar:true}).valida,true,
  'Las fichas de versiones anteriores carecen de imagen sin perder validez.');
console.log('OK · Modelo de criaturas Nd20 (fase 1).');
