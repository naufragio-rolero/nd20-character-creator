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
  return {ataque:ataque,capitalizar:capitalizar};
});
