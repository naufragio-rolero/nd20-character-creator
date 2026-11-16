/* Presentación de ataques de Adversarios: no modifica reglas ni datos. */
(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.NaufragioFormatoAdversarios=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function capitalizar(nombre){
    var t=String(nombre||'').trim();
    return t?t[0].toLocaleUpperCase('es')+t.slice(1):'Ataque sin nombre';
  }
  function ataque(a,indice){
    a=a||{};
    var cantidad=Number.isSafeInteger(a.cantidad)&&a.cantidad>1?a.cantidad+' × ':'';
    var nombre=cantidad+capitalizar(a.nombre);
    var dano=String(a.danoLiteral==null?'':a.danoLiteral).trim();
    if(!dano&&Number.isSafeInteger(a.danoNumerico))dano=String(a.danoNumerico);
    var sufijo='';
    if(dano){
      // No atribuir daños numéricos a expresiones no numéricas.
      sufijo=' - '+dano+(/^(?:\d+|\d+d\d+(?:[+-]\d+)?)$/i.test(dano)?
        ' de daño':'');
    }
    var conector=indice>0&&['y','o',','].includes(a.conectorAnterior)?
      (a.conectorAnterior===','?', ':' '+a.conectorAnterior+' '):'';
    return conector+nombre+sufijo;
  }
  // Los conectores describen la relación entre ataques, no prefijos de lista:
  // «o» significa otra opción; «y» indica acciones de una misma opción.
  // Las comas se conservan como puntuación, sin deducir mecánicas nuevas.
  function lineasAtaque(ataques){
    var lineas=[];
    (Array.isArray(ataques)?ataques:[]).forEach(function(a,indice){
      var conector=indice===0?'Inicio':String(a&&a.conectorAnterior||'Inicio');
      var unir=lineas.length>0&&(conector==='y'||conector===',');
      var texto=ataque(a,0);
      var nombre=capitalizar(a&&a.nombre);
      var cantidad=Number.isSafeInteger(a&&a.cantidad)&&a.cantidad>1?
        a.cantidad+' × ':'';
      var separador=unir?(conector===','?', ':' y '):'';
      // Fragmentos de presentación: permiten destacar el nombre sin
      // analizar cadenas ni introducir HTML en textos del usuario.
      var parte={separador:separador,cantidad:cantidad,nombre:nombre,
        detalle:texto.slice(cantidad.length+nombre.length)};
      if(!unir)lineas.push({texto:texto,notas:[],partes:[parte]});
      else{
        lineas[lineas.length-1].texto+=separador+texto;
        lineas[lineas.length-1].partes.push(parte);
      }
      if(a&&a.notas){
        lineas[lineas.length-1].notas.push({
          nombre:capitalizar(a.nombre),texto:String(a.notas)
        });
      }
    });
    return lineas;
  }
  function taxonomia(ficha){
    var datos=ficha||{};
    var principal=[datos.categoria,datos.subcategoria].filter(Boolean).join(' - ');
    var subtipo=String(datos.subtipo||'').trim();
    return principal+(subtipo?(principal?' ':'')+'('+subtipo+')':'');
  }
  return {ataque:ataque,capitalizar:capitalizar,
    lineasAtaque:lineasAtaque,taxonomia:taxonomia};
});
