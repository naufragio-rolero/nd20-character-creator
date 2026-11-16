/* Combinadores puros de nombres. Sin inferir parentescos, culturas ni sexo. */
(function(root,factory){
  var api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioNombres=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function indice(longitud,rng){
    return Math.min(longitud-1,Math.floor(rng()*longitud));
  }
  function unico(lista){
    return [...new Set((lista||[]).map(function(x){
      return typeof x==='string'?x:x&&x.nombre;
    }).filter(function(x){return typeof x==='string'&&x.trim();}))];
  }
  // Dos extracciones uniformes sin reemplazo: cada forma tiene peso 1.
  function generico(banco,rng){
    rng=rng||Math.random;
    var formas=unico(banco&&banco.entradas);
    if(formas.length<2)return null;
    var primero=indice(formas.length,rng);
    var segundo=indice(formas.length-1,rng);
    if(segundo>=primero)segundo++;
    return formas[primero]+' '+formas[segundo];
  }
  function ponderado(lista,rng){
    if(!lista||!lista.length)return null;
    var total=lista.reduce(function(s,e){
      return s+e.peso_relativo;
    },0);
    if(!(total>0))return null;
    var punto=rng()*total;
    for(var i=0;i<lista.length;i++){
      punto-=lista[i].peso_relativo;
      if(punto<0)return lista[i];
    }
    return lista[lista.length-1];
  }
  // Ambos componentes están atestiguados; la combinación NO acredita identidad.
  function ylat(catalogo,rng){
    rng=rng||Math.random;
    if(!catalogo||!Array.isArray(catalogo.nombres)||
      !Array.isArray(catalogo.apellidos)||!catalogo.nombres.length)return null;
    var inicio=catalogo.nombres[indice(catalogo.nombres.length,rng)].nombre;
    var ocupados=new Set((catalogo.identidades_documentadas||[])
      .concat(catalogo.combinaciones_previas||[]));
    var disponibles=catalogo.apellidos.filter(function(e){
      return e.nombre!==inicio&&!ocupados.has(inicio+' '+e.nombre)&&
        Number.isFinite(e.peso_relativo)&&e.peso_relativo>0;
    });
    var apellido=ponderado(disponibles,rng);
    return apellido?inicio+' '+apellido.nombre:null;
  }
  return {generico:generico,ylat:ylat,ponderado:ponderado};
});
