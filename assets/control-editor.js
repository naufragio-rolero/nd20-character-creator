/* Inventario editorial puro. No altera las reglas ni los catálogos de juego. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioControl=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  var ESQUEMA="naufragio.revision-editorial/v1";
  var ESTADOS=["sin_revisar","si","no"];
  /* Los lotes reflejan solo publicación confirmada, nunca pruebas. */
  var LOTES=[
    {id:"nd20-drs",nombre:"Naufragio d20 DRS"},
    {id:"nd20-cifi",nombre:"Naufragio d20 CiFi"},
    {id:"dungeon-hack",nombre:"Dungeon Hack · todas las fuentes"}
  ];
  function perteneceALote(item,id){
    if(!item)return false;
    var sistema=item.sistema,fuente=item.fuente;
    if(id==="nd20-drs")return (
      (sistema==="Nd20 Fantasía"&&fuente==="DRS")||
      (sistema==="Nd20 fantasia"&&item.tipo==="Progresión"&&/^NaufragioD20DRS/.test(fuente))||
      (sistema==="Nd20 · Poderes"&&(fuente==="Nd20"||fuente==="Naufragio d20 DRS")));
    if(id==="nd20-cifi")return (
      sistema==="Nd20 CiFi"||sistema==="Nd20 cifi"||
      (sistema==="Nd20 · Poderes"&&fuente==="Naufragio d20 CiFi"));
    if(id==="dungeon-hack")return sistema==="Dungeon Hack";
    return false;
  }
  function loteDe(item){
    return LOTES.find(function(lote){return perteneceALote(item,lote.id);})||null;
  }
  function estadoBase(item){
    return {visible:true,publicado:loteDe(item)?"si":"sin_revisar",
      probado:"sin_revisar",notas:""};
  }
  function estadoEfectivo(item,cambios){
    if(!item)throw Error("Elemento inexistente en el catálogo.");
    return cambios&&Object.prototype.hasOwnProperty.call(cambios,item.id)?
      normalizarCambio(cambios[item.id]):estadoBase(item);
  }
  function lotesConfirmados(inventario){
    return LOTES.map(function(lote){
      return {id:lote.id,nombre:lote.nombre,
        cantidad:inventario.filter(function(x){return perteneceALote(x,lote.id);}).length};
    });
  }
  function coincideBase(item,valor){
    var v=normalizarCambio(valor),base=estadoBase(item);
    return v.visible===base.visible&&v.publicado===base.publicado&&
      v.probado===base.probado&&v.notas===base.notas;
  }
  function aplicarLote(inventario,cambios,ids,accion){
    if(!Array.isArray(ids)||!accion||typeof accion!=="object"||
      Array.isArray(accion)||!Object.keys(accion).length)
      throw Error("Selecciona elementos y alguna acción editorial.");
    Object.keys(accion).forEach(function(campo){
      if(!["visible","publicado","probado"].includes(campo))
        throw Error("Campo editorial no permitido: "+campo);
    });
    var mapa=new Map(inventario.map(function(item){return [item.id,item];}));
    var nuevos=Object.assign({},cambios||{}),afectados=0;
    new Set(ids).forEach(function(id){
      var item=mapa.get(id);
      if(!item)throw Error("Elemento fuera del catálogo: "+id);
      var previo=estadoEfectivo(item,nuevos);
      var siguiente=normalizarCambio(Object.assign({},previo,accion));
      if(JSON.stringify(previo)!==JSON.stringify(siguiente))afectados++;
      if(coincideBase(item,siguiente))delete nuevos[id];
      else nuevos[id]=siguiente;
    });
    return {cambios:nuevos,afectados:afectados};
  }
  function idPara(sistema,tipo,clave){
    return [sistema,tipo,clave].map(encodeURIComponent).join(":");
  }
  function crearInventario(archivos){
    var lista=[],ids=new Set();
    function agregar(sistema,tipo,clave,nombre,fuente,detalle){
      var id=idPara(sistema,tipo,String(clave));
      if(ids.has(id))throw Error("Identificador duplicado: "+id);
      ids.add(id);
      lista.push({id:id,sistema:sistema,tipo:tipo,nombre:nombre,fuente:fuente||"Fuente sin especificar",
        detalle:detalle||""});
    }
    function coleccion(sistema,tipo,base,ampliadas,baseFuente){
      var entradas=Object.assign({},base||{},ampliadas||{});
      Object.keys(entradas).forEach(function(nombre){
        var e=entradas[nombre],am=ampliadas&&ampliadas[nombre];
        var fuente=am?(am.fuente||am.suplemento||baseFuente):baseFuente;
        fuente=String(fuente).replace(" (Google Drive)","");
        if(tipo==="Ocupación"&&am&&am.suplemento)fuente=am.suplemento;
        agregar(sistema,tipo,nombre,nombre,fuente);
        ["talentos","talentos_referencia","talentos_elegir"].forEach(function(campo){
          (e[campo]||[]).forEach(function(talento){
            agregar(sistema,"Talento",tipo+"/"+nombre+"/"+campo+"/"+talento,talento,
              fuente,"De "+tipo.toLowerCase()+" «"+nombre+"» · "+campo);
          });
        });
      });
    }
    var ex=archivos.ampliado||{},p=archivos.catalogo||{},dh=archivos.dungeon||{};
    coleccion("Nd20 Fantasía","Ocupación",archivos.ocupaciones,ex.fantasia?.ocupaciones,"DRS");
    coleccion("Nd20 Fantasía","Especie",archivos.especies,ex.fantasia?.especies,"DRS");
    coleccion("Nd20 CiFi","Ocupación",archivos.ocupacionesCifi,null,"Naufragio d20 CiFi");
    coleccion("Nd20 CiFi","Especie",archivos.especiesCifi,ex.cifi?.especies,"Naufragio d20 CiFi");
    coleccion("Nd20 Nocturna","Ocupación",ex.nocturna?.ocupaciones,null,"Naufragio d20 Nocturna");
    coleccion("Nd20 Nocturna","Especie",ex.nocturna?.especies,null,"Naufragio d20 Nocturna");
    Object.entries(dh.classes||{}).forEach(function(par){
      var e=par[1];agregar("Dungeon Hack","Ocupación",par[0],e.name,
        (dh.origins||[])[e.origin]||"Dungeon Hack");
      (e.skills||[]).forEach(function(t,i){
        agregar("Dungeon Hack","Talento","clase/"+par[0]+"/"+i,t,
          (dh.origins||[])[e.origin]||"Dungeon Hack","De Ocupación «"+e.name+"»");
      });
    });
    Object.entries(dh.races||{}).forEach(function(par){
      var e=par[1];agregar("Dungeon Hack","Especie",par[0],e.name,
        (dh.origins||[])[e.origin]||"Dungeon Hack");
      (e.skills||[]).forEach(function(t,i){
        agregar("Dungeon Hack","Talento","especie/"+par[0]+"/"+i,t,
          (dh.origins||[])[e.origin]||"Dungeon Hack","De Especie «"+e.name+"»");
      });
    });
    var tipos=[
      ["conjuros","Conjuro"],["tecnicas","Técnica"],["poderes_psionicos","Poder Psiónico"],
      ["argucias","Argucia"],["scripts","Script"]
    ];
    tipos.forEach(function(par){
      (p[par[0]]||[]).forEach(function(x,i){
        agregar("Nd20 · Poderes",par[1],x.id||String(i),x.nombre,
          par[0]==="conjuros"?(x.origen||"Origen sin verificar"):(x.fuente||p.fuentes?.tomo),
          [x.categoria,x.circulo?"Círculo "+x.circulo:"",x.requisito].filter(Boolean).join(" · "));
      });
    });
    var especial=p.especiales||{};
    var especialidades=[
      ["ordenes","Orden de batalla"],["flecheria","Flechería arcana"],
      ["privilegios","Privilegio"],["canciones","Canción"],
      ["eidolas","Eidola"],["recetas","Receta de cocina"]
    ];
    especialidades.forEach(function(par){
      (especial[par[0]]||[]).forEach(function(x,i){
        agregar("Nd20 · Poderes",par[1],x.id||String(i),x.nombre,
          x.fuente||especial.fuente||"Naufragio d20 · Ocupaciones",
          [x.categoria,x.requisito,x.min_nivel?"Nivel "+x.min_nivel:""].filter(Boolean).join(" · "));
      });
    });
    Object.entries(especial.vinculos||{}).forEach(function(par){
      par[1].forEach(function(x,i){
        agregar("Nd20 · Poderes","Vínculo sobrenatural",par[0]+"/"+(x.id||i),
          x.nombre,especial.fuente||"Naufragio d20 · Ocupaciones","Ocupación: "+par[0]);
      });
    });
    var progresiones=archivos.progresiones||{};
    ["fantasia","cifi","nocturna"].forEach(function(rama){
      Object.keys(progresiones[rama]||{}).forEach(function(nombre){
        agregar("Nd20 "+rama,"Progresión",nombre,nombre,
          (rama==="fantasia"?progresiones.fuentes?.drs:progresiones.fuentes?.[rama])||
            "Documento de Referencia del Sistema",
          "Tabla de progresión");
      });
    });
    ["fantasia","nocturna"].forEach(function(rama){
      Object.entries(progresiones.ampliadas?.[rama]||{}).forEach(function(par){
        agregar("Nd20 "+rama,"Progresión ampliada",par[0],par[0],
          "Naufragio d20 · Ocupaciones",
          par[1].verificado?"Tabla contrastada en catálogo":"Tabla pendiente de verificación documental");
      });
    });
    return lista.sort(function(a,b){
      return a.sistema.localeCompare(b.sistema,"es")||
        a.tipo.localeCompare(b.tipo,"es")||a.nombre.localeCompare(b.nombre,"es");
    });
  }
  function normalizarCambio(valor){
    if(!valor||typeof valor!=="object"||Array.isArray(valor))throw Error("Entrada editorial incorrecta.");
    var estado=valor.publicado||"sin_revisar",prueba=valor.probado||"sin_revisar";
    if(ESTADOS.indexOf(estado)===-1||ESTADOS.indexOf(prueba)===-1)
      throw Error("Estado editorial desconocido.");
    if(valor.visible!==undefined&&typeof valor.visible!=="boolean")
      throw Error("La visibilidad debe ser booleana.");
    if(valor.notas!==undefined&&typeof valor.notas!=="string")
      throw Error("Las notas deben ser texto.");
    return {visible:valor.visible!==false,publicado:estado,probado:prueba,
      notas:(valor.notas||"").trim().slice(0,2000)};
  }
  function sinCambios(valor){
    var v=normalizarCambio(valor);
    return v.visible&&v.publicado==="sin_revisar"&&v.probado==="sin_revisar"&&!v.notas;
  }
  function crearRevision(inventario,cambios,fecha){
    var mapa=new Map(inventario.map(function(x){return [x.id,x];})),depurados={};
    Object.keys(cambios||{}).sort().forEach(function(id){
      var item=mapa.get(id);
      if(!item)throw Error("Elemento fuera del catálogo: "+id);
      var valor=normalizarCambio(cambios[id]);
      if(!coincideBase(item,valor))depurados[id]=valor;
    });
    return {esquema:ESQUEMA,fecha:fecha||new Date().toISOString(),
      repositorio:"naufragio-rolero/nd20-character-creator",
      total_inventario:inventario.length,
      lotes_base_publicados:lotesConfirmados(inventario),
      cambios:depurados};
  }
  function importarRevision(inventario,revision){
    if(!revision||revision.esquema!==ESQUEMA||!revision.cambios||
      typeof revision.cambios!=="object"||Array.isArray(revision.cambios))
      throw Error("El archivo no utiliza el esquema de revisión editorial v1.");
    var mapa=new Map(inventario.map(function(x){return [x.id,x];})),cambios={};
    Object.entries(revision.cambios).forEach(function(par){
      var item=mapa.get(par[0]);
      if(!item)throw Error("El JSON contiene un elemento desconocido: "+par[0]);
      var valor=normalizarCambio(par[1]);
      if(!coincideBase(item,valor))cambios[par[0]]=valor;
    });
    return cambios;
  }
  return {ESQUEMA:ESQUEMA,crearInventario:crearInventario,crearRevision:crearRevision,
    importarRevision:importarRevision,normalizarCambio:normalizarCambio,sinCambios:sinCambios,
    perteneceALote:perteneceALote,estadoBase:estadoBase,estadoEfectivo:estadoEfectivo,
    coincideBase:coincideBase,lotesConfirmados:lotesConfirmados,aplicarLote:aplicarLote};
});