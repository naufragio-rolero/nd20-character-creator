/* Preparación pura para la ficha PDF A5 de Fantasía Épica.
 * No calcula reglas ni modifica el personaje de la Forja.
 * El motor gráfico y las fuentes se integran por separado.
 */
(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.NaufragioPdfModelo=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  var FANTASIA='Naufragio d20 · Fantasía';
  var COLUMNAS=[
    ['Competencias','competencias'],
    ['Talentos y capacidades','capacidades'],
    ['Poderes conocidos','poderes'],
    ['Conjuros preparados','conjuros_preparados'],
    ['Inventario y Equipo','equipo'],
    ['Riqueza','riqueza'],
    ['Observaciones reglamentarias','notas']
  ];
  function texto(valor){
    if(valor==null)return '';
    if(typeof valor==='object')return JSON.stringify(valor);
    return String(valor);
  }
  function listado(valor){
    if(valor==null||valor==='')return [];
    return (Array.isArray(valor)?valor:[valor]).map(function(v){
      return Array.isArray(v)&&v.length===2?texto(v[0])+': '+texto(v[1]):texto(v);
    });
  }
  function preparar(personaje,defensa){
    if(!personaje||personaje.juego!==FANTASIA)
      throw Error('La exportación PDF A5 solo admite fichas de Naufragio d20 Fantasía.');
    // La copia preserva el original incluso si cambia posteriormente el exportador.
    var p=JSON.parse(JSON.stringify(personaje));
    var descripcion=texto(p.descripcion);
    var separador=descripcion.indexOf(' · ');
    var ocupacion=separador>=0?descripcion.slice(0,separador):'';
    var especie=separador>=0?descripcion.slice(separador+3):'';
    var inventario=listado(p.equipo);
    var equipadas=p.protecciones_equipadas||{};
    function consta(nombre){
      var v=texto(nombre);
      return !!v&&inventario.some(function(item){
        return item===v||item.indexOf(v+' ×')===0;
      });
    }
    var armadura=consta(equipadas.armadura)?equipadas.armadura:'';
    var escudo=consta(equipadas.escudo)?equipadas.escudo:'';
    var consulta=defensa&&typeof defensa==='object'?defensa:{};
    var blindaje=consulta.valor&&consulta.valor!=='Sin armadura'?texto(consulta.valor):'';
    // El escudo solo bloquea cuando lo indique la regla; nunca sumar su bono al Blindaje.
    var bonificacionEscudo=escudo&&consulta.bonoEscudo!=null?texto(consulta.bonoEscudo):'';
    var proteccionNatural=consulta.natural!=null?texto(consulta.natural):'';
    var secciones=COLUMNAS.map(function(par){
      var items=listado(p[par[1]]);
      return items.length?{titulo:par[0],origen:par[1],items:items}:null;
    }).filter(Boolean);
    var atributos=Array.isArray(p.atributos)?p.atributos.map(function(a){
      return {nombre:texto(a.nombre),valor:a.valor,dificultad:a.dificultad,
        favorito:a.favorito===true};
    }):[];
    var recursos=Array.isArray(p.recursos)?p.recursos.map(function(r){
      return Array.isArray(r)&&r.length>=2?{nombre:texto(r[0]),valor:texto(r[1])}:null;
    }).filter(Boolean):[];
    return {
      juego:p.juego,nombre:texto(p.nombre),nivel:p.nivel,sexo:texto(p.sexo),
      concepto:texto(p.concepto),descripcion_completa:descripcion,
      ocupacion:ocupacion,especie:especie,
      atributos:atributos,recursos:recursos,
      protecciones:{armadura:armadura,escudo:escudo,blindaje:blindaje,
        bono_escudo_al_bloquear:bonificacionEscudo,natural:proteccionNatural},
      secciones:secciones
    };
  }
  return {preparar:preparar,listado:listado};
});
