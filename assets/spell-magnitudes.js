/* Evaluación pura de magnitudes explícitas; no ejecuta Conjuros ni tira dados. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioMagnitudes=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function calcular(magnitud,nivel){
    if(!magnitud||typeof magnitud.clave!=="string")throw Error("Magnitud inválida");
    var tipo=magnitud.tipo,valor=magnitud.valor;
    if(tipo==="constante"){
      if(typeof valor!=="number"&&typeof valor!=="boolean")throw Error("Constante inválida");
      return valor;
    }
    if(tipo==="dado_literal"){
      if(typeof valor!=="string"||!/^[1-9]\d*d(?:4|6|8|10|12|20|100)$/.test(valor))
        throw Error("Expresión de dado no validada");
      return valor; // Expresión, no resultado ni lanzamiento aleatorio.
    }
    if(tipo==="por_nivel"){
      if(!Number.isFinite(valor)||valor<0)throw Error("Factor inválido");
      return valor*nivel;
    }
    if(tipo==="dados_por_nivel"){
      if(!Array.isArray(valor)||valor.length!==2||
         !Number.isSafeInteger(valor[0])||valor[0]<1||
         ![4,6,8,10,12,20,100].includes(valor[1]))
        throw Error("Dados por Nivel inválidos");
      var cantidad=valor[0]*nivel;
      if(!Number.isSafeInteger(cantidad))throw Error("Demasiados dados");
      return cantidad+"d"+valor[1]; // No tirar dados ni resolver efectos.
    }
    if(tipo==="por_nivel_con_tope"){
      if(!Array.isArray(valor)||valor.length!==2||
         !valor.every(function(n){return Number.isFinite(n)&&n>=0;}))
        throw Error("Factor y tope inválidos");
      return Math.min(valor[0]*nivel,valor[1]);
    }
    if(tipo==="por_cada_n_niveles"){
      if(!Array.isArray(valor)||(valor.length!==2&&valor.length!==3)||
        valor.some(function(x){return !Number.isSafeInteger(x)||x<0;})||
        valor[1]<1)throw Error("Bloques de Niveles inválidos");
      return Math.max(valor[2]||0,Math.floor(nivel/valor[1])*valor[0]);
    }
    if(tipo==="base_mas_por_cada_n_niveles"){
      if(!Array.isArray(valor)||valor.length!==3||
        valor.some(function(x){return !Number.isSafeInteger(x)||x<0;})||
        valor[2]<1)throw Error("Base y bloques de Niveles inválidos");
      return valor[0]+Math.floor(nivel/valor[2])*valor[1];
    }
    throw Error("Operación desconocida: "+tipo);
  }
  function evaluar(catalogo,id,nivel){
    if(!Number.isSafeInteger(nivel)||nivel<1)throw Error("Nivel entero positivo requerido");
    var ficha=(catalogo?.registros||[]).find(function(x){return x.id_catalogo===id;});
    if(!ficha)return null;
    return {
      id_catalogo:ficha.id_catalogo,numero_tomo:ficha.numero_tomo,
      nombre_tomo:ficha.nombre_tomo,nivel:nivel,
      estado:"magnitudes_literales_sin_resolver_tiradas",
      condiciones_no_automatizadas:ficha.disparador_y_limites,
      magnitudes:ficha.magnitudes.map(function(m){
        return {clave:m.clave,valor:calcular(m,nivel),unidad:m.unidad};
      })
    };
  }
  /* Un solo bloque de daño con varios tipos: evitar resistencias y debilidades duplicadas.
   * El motor no presupone cómo se trata la resistencia a un único tipo. */
  function clasificarDanioCompuesto(perfil,resistencias,vulnerabilidades){
    if(!perfil||!Array.isArray(perfil.tipos)||perfil.tipos.length<2||
      new Set(perfil.tipos).size!==perfil.tipos.length)throw Error("Perfil de daño compuesto inválido");
    var tipos=perfil.tipos;
    function filtrados(lista){
      if(!Array.isArray(lista)||lista.some(function(x){return typeof x!=="string";}))
        throw Error("Tipos de defensa inválidos");
      return new Set(lista.filter(function(x){return tipos.includes(x);}));
    }
    var res=filtrados(resistencias||[]),vul=filtrados(vulnerabilidades||[]);
    return {
      tipos:tipos.slice(),
      grupos_de_dados:1,
      resistencia_unica:res.size===tipos.length,
      resistencia_parcial_pendiente:res.size>0&&res.size<tipos.length,
      multiplicador_debilidad:vul.size>0?2:1,
      conflicto_resistencia_debilidad:res.size>0&&vul.size>0,
      aplicacion_automatica_completa:false
    };
  }
  return {calcular:calcular,evaluar:evaluar,clasificarDanioCompuesto:clasificarDanioCompuesto};
});
