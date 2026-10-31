/* Coherencia narrativa de sexo y nombres de personajes.
 * Los nombres etiquetados y suplencias son una convención editorial, NO canon. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioSexo=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function forma(valor){
    return valor==="masculino"||valor==="femenino"?valor:"aleatorio";
  }
  function normal(nombre){
    return String(nombre||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .toLocaleLowerCase("es").trim();
  }
  function preferenciaOcupacion(ocupacion,datos){
    return datos?.ocupaciones_contexto_femenino?.[ocupacion]?"femenino":null;
  }
  function ocuparPermitida(ocupacion,sexo,datos,respetar){
    return respetar===false||!preferenciaOcupacion(ocupacion,datos)||
      sexo!=="masculino";
  }
  function resolverSexo(solicitud,ocupacion,especie,datos,respetar,rng){
    rng=rng||Math.random;
    solicitud=forma(solicitud);
    var determinado=solicitud!=="aleatorio";
    var contexto=respetar!==false;
    if(determinado && contexto && !ocuparPermitida(ocupacion,solicitud,datos,true))
      throw Error("La Ocupación "+ocupacion+" se describe en femenino. "+
        "Elige sexo femenino o desactiva «Respetar trasfondo» en la configuración.");
    if(determinado)return solicitud;
    if(contexto && (preferenciaOcupacion(ocupacion,datos)||
       datos?.especies_preferencia_femenino?.[especie]))
      return "femenino";
    return rng()<0.5?"femenino":"masculino";
  }
  function primerNombre(texto){
    var s=String(texto||"").trim();
    return s.replace(/^(Sor|Sra|Dña)\s+/i,"").split(/\s+/)[0];
  }
  function nombresDocumentados(entradas,sexo,datos,admitirSinClasificar){
    var fem=new Set((datos?.nombres_generales_femeninos||[]).map(normal));
    var masc=new Set((datos?.nombres_generales_masculinos||[]).map(normal));
    return (entradas||[]).filter(function(e){
      var n=normal(primerNombre(e.nombre));
      // Una propuesta sin clasificación documental de sexo puede usarse,
      // pero nunca se etiqueta automáticamente como masculina o femenina.
      if(admitirSinClasificar&&!fem.has(n)&&!masc.has(n))return true;
      return sexo==="femenino"?fem.has(n):masc.has(n);
    });
  }
  function nombresEspecie(nombres,especie,sexo,datos){
    var lista=Array.isArray(nombres)?nombres.slice():[];
    var femeninos=new Set((datos?.femeninos_por_especie?.[especie]||[]).map(normal));
    var adicionales=datos?.nombres_editoriales?.[especie]?.[sexo]||[];
    var neutral=(datos?.sexo_por_especie_neutral||[]).includes(especie);
    if(neutral)return {opciones:lista,editorial:false,neutral:true};
    var filtered=lista.filter(function(n){
      return sexo==="femenino"?femeninos.has(normal(n)):
        !femeninos.has(normal(n));
    });
    if(!filtered.length&&adicionales.length){
      return {opciones:adicionales.slice(),editorial:true,neutral:false};
    }
    return {opciones:filtered,editorial:false,neutral:false};
  }
  function elegirNombre(config,especie,nombres,entradas,sexo,datos,rng){
    if(config.nombre)return {nombre:config.nombre,nota:"Nombre elegido manualmente."};
    rng=rng||Math.random;
    var ylat=(entradas||[]).filter(function(e){
      return e.tipo===(config.modoNombre==="documentado"?"documentado":"combinado");
    });
    if(config.modoNombre!=="especie"&&config.juego==="nd20"){
      var filtrados=nombresDocumentados(ylat,sexo,datos,
        config.modoNombre==="combinado");
      if(filtrados.length){
        var elegido=filtrados[Math.floor(rng()*filtrados.length)];
        var sinClasificar=!datos?.nombres_generales_femeninos?.some(function(n){
          return normal(n)===normal(primerNombre(elegido.nombre));
        })&&!datos?.nombres_generales_masculinos?.some(function(n){
          return normal(n)===normal(primerNombre(elegido.nombre));
        });
        return {nombre:elegido.nombre,
          nota:sinClasificar?'Nombre combinado sin clasificación documental de sexo; no se le atribuye una.':''};
      }
    }
    var es=nombresEspecie(nombres,especie,sexo,datos);
    if(es.opciones.length){
      return {nombre:es.opciones[Math.floor(rng()*es.opciones.length)],
        nota:es.editorial?"Nombre propuesto editorialmente para completar el repertorio femenino de "+especie+".":
          es.neutral?"El repertorio de "+especie+" contiene nombres sin sexo asignado.":""};
    }
    return {nombre:"Sin nombre",nota:"No hay nombres contrastados para "+sexo+
      " de "+especie+". Introduce uno manualmente."};
  }
  function nombresDH(nombres,sexo){
    var list=Array.isArray(nombres)?nombres:[];
    var frontera=Math.ceil(list.length/2);
    return sexo==="femenino"?list.slice(0,frontera):list.slice(frontera);
  }
  return {forma:forma,preferenciaOcupacion:preferenciaOcupacion,
    ocuparPermitida:ocuparPermitida,resolverSexo:resolverSexo,primerNombre:primerNombre,
    nombresEspecie:nombresEspecie,nombresDocumentados:nombresDocumentados,
    elegirNombre:elegirNombre,nombresDH:nombresDH};
});