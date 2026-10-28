/* Editor puro de repertorios para la Forja. No publica cambios ni altera documentos fuente. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioRepertorios=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  var SCHEMA="naufragio.repertorios/v1", MAX_ENTRADAS=500, MAX_TEXTO=160;
  function identificador(partes){return partes.map(encodeURIComponent).join(":");}
  function generar(archivos){
    var lista=[],ids=new Set(),ampliado=archivos.ampliado||{},dh=archivos.dungeon||{};
    function sumar(ruta,sistema,categoria,nombre,campo,valores,fuente,editable,ayuda){
      if(!Array.isArray(valores))return;
      var id=identificador(ruta);
      if(ids.has(id))throw Error("Repertorio repetido: "+id);
      ids.add(id);
      lista.push({id:id,ruta:ruta.slice(),sistema:sistema,categoria:categoria,nombre:nombre,
        campo:campo,fuente:fuente||"Sin fuente identificada",editable:editable!==false,
        ayuda:ayuda||"",valores:valores.slice()});
    }
    function grupos(sistema,tipo,raiz,grupo,fuentePredeterminada){
      Object.entries(grupo||{}).forEach(function(par){
        var nombre=par[0],ficha=par[1]||{},fuente=String(
          ficha.suplemento||ficha.fuente||fuentePredeterminada).replace(" (Google Drive)","");
        ["nombres","conceptos"].forEach(function(campo){
          if(Array.isArray(ficha[campo]))
            sumar([raiz,tipo,nombre,campo],sistema,tipo,nombre,campo,
              ficha[campo],fuente,true,
              ficha[campo].length?"Un elemento por línea.":
                "Actualmente vacío en el catálogo. Las entradas nuevas son propuestas.");
        });
      });
    }
    grupos("Nd20 Fantasía","Especie","especies",archivos.especies,"DRS");
    grupos("Nd20 Fantasía","Ocupación","ocupaciones",archivos.ocupaciones,"DRS");
    grupos("Nd20 Fantasía","Especie","catalogo-ampliado/fantasia/especies",
      ampliado.fantasia?.especies,"Suplementos de especies");
    grupos("Nd20 Fantasía","Ocupación","catalogo-ampliado/fantasia/ocupaciones",
      ampliado.fantasia?.ocupaciones,"Suplementos de ocupaciones");
    grupos("Nd20 CiFi","Especie","especies_cifi",archivos.especiesCifi,"Naufragio d20 CiFi");
    grupos("Nd20 CiFi","Ocupación","ocupaciones_cifi",archivos.ocupacionesCifi,"Naufragio d20 CiFi");
    grupos("Nd20 CiFi","Especie","catalogo-ampliado/cifi/especies",
      ampliado.cifi?.especies,"Naufragio d20 CiFi");
    grupos("Nd20 Nocturna","Especie","catalogo-ampliado/nocturna/especies",
      ampliado.nocturna?.especies,"Naufragio d20 Nocturna");
    grupos("Nd20 Nocturna","Ocupación","catalogo-ampliado/nocturna/ocupaciones",
      ampliado.nocturna?.ocupaciones,"Naufragio d20 Nocturna");
    Object.entries(dh.classes||{}).forEach(function(par){
      var ficha=par[1];
      sumar(["dungeon-hack","classes",par[0],"names"],"Dungeon Hack","Ocupación",
        ficha.name,"nombres",ficha.names||[],(dh.origins||[])[ficha.origin]||"Dungeon Hack",true);
    });
    sumar(["dungeon-hack","flw_names"],"Dungeon Hack","Seguidores",
      "Nombres de seguidores","nombres",dh.flw_names||[],
      "Dungeon Hack",true);
    var tesauro=archivos.tesauroYlat||{},entradas=tesauro.entradas||[];
    ["documentado","combinado"].forEach(function(tipo){
      var subset=entradas.filter(function(x){return x.tipo===tipo;});
      sumar(["tesauro-ylat","entradas",tipo],"Nd20 Fantasía","Tesauro Ylat",
        tipo==="documentado"?"Nombres documentados":"Nombres combinados",
        "nombres",subset.map(function(x){return x.nombre;}),
        "Tesauro Ylat",tipo!=="documentado",
        tipo==="documentado"?
          "Referencia documental: estos nombres no se pueden alterar aquí. Consulta el documento original y su página.":
          "Nombres combinados: se pueden ampliar o revisar sin atribuir fuentes documentales.");
    });
    return lista.sort(function(a,b){
      return a.sistema.localeCompare(b.sistema,"es")||
        a.categoria.localeCompare(b.categoria,"es")||
        a.nombre.localeCompare(b.nombre,"es")||
        a.campo.localeCompare(b.campo,"es");
    });
  }
  function textoNormalizado(valor){
    if(typeof valor!=="string")throw Error("Cada nombre o concepto debe ser texto.");
    var s=valor.normalize("NFC").trim().replace(/\s+/g," ");
    if(!s||s.length>MAX_TEXTO||/[\u0000-\u001F\u007F]/.test(s))
      throw Error("Entrada vacía, demasiado larga o con caracteres de control.");
    return s;
  }
  function validarLista(valores){
    if(!Array.isArray(valores)||valores.length>MAX_ENTRADAS)
      throw Error("Máximo "+MAX_ENTRADAS+" entradas por repertorio.");
    var a=valores.map(textoNormalizado);
    var claves=a.map(function(s){return s.toLocaleLowerCase("es");});
    if(new Set(claves).size!==claves.length)
      throw Error("El repertorio contiene entradas duplicadas.");
    return a;
  }
  function sonIguales(a,b){
    return a.length===b.length&&a.every(function(v,i){return v===b[i];});
  }
  function actualizar(repertorios,cambios,id,valores){
    var encontrado=repertorios.find(function(x){return x.id===id;});
    if(!encontrado)throw Error("Repertorio desconocido: "+id);
    if(!encontrado.editable)throw Error("Este repertorio documentado es de solo lectura.");
    var lista=validarLista(valores),copia=Object.assign({},cambios||{});
    if(sonIguales(lista,encontrado.valores))delete copia[id];
    else copia[id]=lista;
    return copia;
  }
  function valorActual(r,cambios){
    return cambios&&Object.prototype.hasOwnProperty.call(cambios,r.id)?
      cambios[r.id]:r.valores;
  }
  function exportar(repertorios,cambios){
    var mapa=new Map(repertorios.map(function(x){return [x.id,x];})),salida={};
    Object.entries(cambios||{}).sort(function(a,b){return a[0].localeCompare(b[0]);})
      .forEach(function(par){
        var id=par[0],r=mapa.get(id);
        if(!r||!r.editable)throw Error("Repertorio desconocido o protegido: "+id);
        var actual=validarLista(par[1]);
        if(!sonIguales(actual,r.valores))
          salida[id]={ruta:r.ruta.slice(),originales:r.valores.slice(),valores:actual};
      });
    return salida;
  }
  function importar(repertorios,data){
    if(data===undefined||data===null)return {};
    if(typeof data!=="object"||Array.isArray(data))throw Error("Bloque de repertorios inválido.");
    var mapa=new Map(repertorios.map(function(x){return [x.id,x];})),salida={};
    Object.entries(data).forEach(function(par){
      var id=par[0],c=par[1],r=mapa.get(id);
      if(!r||!r.editable)throw Error("Repertorio desconocido o protegido: "+id);
      if(!c||typeof c!=="object"||Array.isArray(c)||
        !Array.isArray(c.originales)||!Array.isArray(c.ruta))
        throw Error("Faltan la ruta y los valores de origen: "+id);
      if(JSON.stringify(c.ruta)!==JSON.stringify(r.ruta)||
        !sonIguales(c.originales,r.valores))
        throw Error("El catálogo ha cambiado; revisa el origen antes de importar: "+r.nombre);
      salida=actualizar(repertorios,salida,id,c.valores);
    });
    return salida;
  }
  return {SCHEMA:SCHEMA,generar:generar,validarLista:validarLista,
    actualizar:actualizar,valorActual:valorActual,exportar:exportar,importar:importar};
});