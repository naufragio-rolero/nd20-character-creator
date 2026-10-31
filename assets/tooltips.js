/* Índice de fichas para ventanas informativas. Nunca inventa reglas ni efectos. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioTooltipIndex=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function normalizar(x){
    return String(x||"").toLocaleLowerCase("es").normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g," ");
  }
  function limpiar(t){
    return String(t||"").replace(/^\[[^\]]+\]\s*/,"")
      .replace(/\s+\(C[1-8]\)/g,"")
      .replace(/\s+·\s+[^\n]+$/,"")
      .replace(/\s+\((?:Diletante;|recuerdo personal;|arma filosofal;|Armamento filosofal;|inicial;)[^)]+\)/g,"")
      .replace(/\s+\(DU\s*d\d+\)/g,"")
      .replace(/^Estilo de gladiatoria:\s*/i,"")
      .replace(/^Paquete\s+([^:]+):.*$/i,"$1")
      .replace(/^Paquete\s+/i,"").trim();
  }
  function indice(fuentes){
    var mapa=new Map(),porId=new Map(),total=0;
    function incluir(entry){
      if(!entry||!entry.nombre)return;
      var key=normalizar(entry.nombre);
      if(!key)return;
      if(!mapa.has(key))mapa.set(key,[]);
      var lista=mapa.get(key);
      if(lista.some(function(x){return x.id&&entry.id?x.id===entry.id:
        x.tipo===entry.tipo&&x.sistema===entry.sistema&&x.fuente===entry.fuente;}))return;
      lista.push(entry);total++;
      if(entry.id){
        if(!porId.has(entry.id))porId.set(entry.id,[]);
        porId.get(entry.id).push(entry);
      }
    }
    function anotar(n,tipo,sistema,fuente,datos){
      incluir(Object.assign({nombre:n,tipo:tipo,sistema:sistema,
        fuente:fuente||"Fuente no identificada",datos:[]},datos||{}));
    }
    function especies(grupo,sistema){
      Object.entries(grupo||{}).forEach(function(par){
        var obj=par[1];
        (obj.talentos||[]).forEach(function(n){
          anotar(n,"Talento",sistema,"Especie: "+par[0],{grupo:"talento"});
        });
        (obj.talentos_elegir||[]).forEach(function(n){
          anotar(n,"Talento",sistema,"Especie: "+par[0],{grupo:"talento"});
        });
        (obj.objetos_emocionales||[]).forEach(function(n){
          anotar(n,"Objeto",sistema,"Objeto emocional de "+par[0],{grupo:"equipo",
            datos:[["Procedencia","Recuerdo de Especie"]]});
        });
      });
    }
    function ocupaciones(grupo,sistema){
      Object.entries(grupo||{}).forEach(function(par){
        var obj=par[1],talentos=(obj.talentos||[]).concat(obj.talentos_elegir||[]);
        talentos.concat(obj.talentos_referencia||[]).forEach(function(n){
          anotar(n,"Talento",sistema,"Ocupación: "+par[0],{grupo:"talento"});
        });
        (obj.armas||[]).concat(obj.armaduras||[]).forEach(function(n){
          anotar(n,"Objeto",sistema,"Equipo de Ocupación: "+par[0],
            {grupo:"equipo",datos:[["Fuente","Selección de equipo de Ocupación"]]});
        });
      });
    }
    function elementos(lista,tipo,sistema){
      (lista||[]).forEach(function(x){
        if(typeof x!=="object"||!x.nombre)return;
        var detalles=[];
        if(x.circulo)detalles.push(["Círculo",String(x.circulo)]);
        if(x.escuelas&&x.escuelas.length)detalles.push(["Escuelas",x.escuelas.join(", ")]);
        if(x.categoria)detalles.push(["Categoría",x.categoria]);
        if(x.requisito)detalles.push(["Requisito",x.requisito]);
        if(x.coste)detalles.push(["Coste",x.coste]);
        if(x.min_nivel)detalles.push(["Nivel mínimo",String(x.min_nivel)]);
        if(x.origen)detalles.push(["Origen",x.origen]);
        anotar(x.nombre,tipo,sistema,x.fuente,{id:x.id||null,datos:detalles,
          descripcion:x.descripcion||x.efecto||"",grupo:tipo==="Talento"?"talento":"poder"});
      });
    }
    function equipo(lista,sistema,moneda,fuente,tipo){
      (lista||[]).forEach(function(x){
        var detalles=[];
        if(Number.isFinite(Number(x.precio)))detalles.push(["Precio",x.precio+" "+moneda]);
        if(x.tipo||x.categoria)detalles.push(["Categoría",x.tipo||x.categoria]);
        if(x.du)detalles.push(["Dado de Uso","DU "+x.du]);
        if(x.municion)detalles.push(["Munición",x.municion]);
        if(x.contenido)detalles.push(["Contenido",x.contenido]);
        anotar(x.nombre,tipo||"Objeto",sistema,fuente,{datos:detalles,
          descripcion:x.descripcion||"",grupo:"equipo"});
      });
    }
    especies(fuentes.fantasia?.especies,"nd20");
    ocupaciones(fuentes.fantasia?.ocupaciones,"nd20");
    especies(fuentes.cifi?.especies,"nd20_cifi");
    ocupaciones(fuentes.cifi?.ocupaciones,"nd20_cifi");
    especies(fuentes.nocturna?.especies,"nd20_nocturna");
    ocupaciones(fuentes.nocturna?.ocupaciones,"nd20_nocturna");
    ["Cestus","Dimacaero","Murmillo","Retiario","Secutor","Veles"].forEach(function(n){
      anotar(n,"Estilo de gladiatoria","nd20","NaufragioD20 — Ocupaciones · Gladiador",
        {grupo:"talento",datos:[["Obtención","Nivel 1, 12 o 24"]]});
    });
    var catalogo=fuentes.catalogo||{};
    elementos(catalogo.conjuros,"Conjuro","nd20");
    elementos(catalogo.tecnicas,"Técnica","nd20");
    elementos(catalogo.poderes_psionicos,"Poder psiónico","nd20_cifi");
    elementos(catalogo.argucias,"Argucia","nd20_cifi");
    elementos(catalogo.scripts,"Script","nd20_cifi");
    Object.entries(catalogo.especiales||{}).forEach(function(par){
      var items=par[1];
      if(Array.isArray(items))elementos(items,par[0].replace(/_/g," "),"nd20");
    });
    var eq=fuentes.equipo||{};
    ["armas","municion","armaduras","escudos","paquetes"].forEach(function(k){
      equipo(eq[k],"nd20","mo","Naufragio d20 DRS",k==="paquetes"?"Paquete":"Objeto");
    });
    ["armas","municion","protecciones","ddp","utiles"].forEach(function(k){
      equipo((eq.cifi||{})[k],"nd20_cifi","cr","Naufragio d20 CiFi");
    });
    Object.entries(eq.obsequios_cifi||{}).forEach(function(par){
      (par[1].opciones||[]).forEach(function(n){
        anotar(n,"Objeto","nd20_cifi",par[1].fuente,
          {datos:[["Adquisición","Gratuita mediante Talento de "+par[0]]]});
      });
    });
    Object.entries(fuentes.descripciones||{}).forEach(function(par){
      var key=normalizar(par[0]),entries=mapa.get(key)||[];
      entries.forEach(function(e){
        // Detalles transcritos y contrastados con el manual; nunca conjeturas.
        if(par[1].sistema&&par[1].sistema!==e.sistema)return;
        e.descripcion=par[1].descripcion;
        if(par[1].tipo)e.tipo=par[1].tipo;
        if(par[1].activacion)e.datos.unshift(["Activación",par[1].activacion]);
        if(par[1].atributo)e.datos.push(["Atributo",par[1].atributo]);
        if(par[1].coste)e.datos.push(["Coste",par[1].coste]);
        if(par[1].alcance)e.datos.push(["Alcance",par[1].alcance]);
        e.fuente_descripcion=par[1].fuente;
      });
    });
    /* Integración informativa del Tomo auditado. Nunca ejecuta efectos. */
    var conjurosPorId=new Map((catalogo.conjuros||[]).map(function(x){return [x.id,x];}));
    var magnitudesPorId=new Map((fuentes.magnitudes?.registros||[]).map(function(x){return [x.id_catalogo,x];}));
    var danioPorId=new Map((fuentes.danioCompuesto?.registros||[]).map(function(x){return [x.id_catalogo,x];}));
    var idRevisados=new Set();
    (fuentes.conjurosRevisados||[]).forEach(function(ficha){
      if(!ficha||!ficha.id_catalogo||idRevisados.has(ficha.id_catalogo))return;
      var catalogado=conjurosPorId.get(ficha.id_catalogo);
      if(!catalogado)return;
      var encontrados=mapa.get(normalizar(catalogado.nombre))||[];
      var destino=encontrados.find(function(x){
        return x.id===catalogado.id&&x.tipo==="Conjuro"&&x.sistema==="nd20";
      });
      if(!destino)return;
      if(magnitudesPorId.has(destino.id))destino.magnitudes=magnitudesPorId.get(destino.id);
      if(danioPorId.has(destino.id))destino.danioCompuesto=danioPorId.get(destino.id);
      var cuerpo=(ficha.parrafos||[]).filter(function(parrafo){
        return !/^(?:Primer|Segundo|Tercer|Cuarto|Quinto|Sexto|Séptimo|Octavo) Círculo$/i.test(parrafo)
          && !/^(?:Escuela|Alcance|Duración|Lanzamiento|Requisito):/i.test(parrafo);
      }).join("\n\n");
      if(!cuerpo)return;
      destino.descripcion=cuerpo;
      [["Alcance",ficha.alcance],["Duración",ficha.duracion],
        ["Lanzamiento",ficha.lanzamiento],["Requisito",ficha.requisito]]
        .forEach(function(p){if(p[1])destino.datos.push(p);});
      destino.datos.push(["Ficha del Tomo",String(ficha.numero_tomo)]);
      var corregido=ficha.estado_redaccion==="correccion_editorial_aprobada";
      destino.datos.push(["Redacción",corregido?
        "Corrección editorial aprobada":"Literal cotejado"]);
      destino.datos.push(["Automatización","Descripción consultable; efecto no automatizado"]);
      destino.fuente_descripcion="NaufragioD20 — Tomo de Magia"+
        (corregido?" (corrección editorial aprobada)":" (texto cotejado)");
      idRevisados.add(ficha.id_catalogo);
    });
    return {mapa:mapa,porId:porId,total:total};
  }
  function buscar(ind,nombre,grupo,sistema){
    if(!ind||!nombre)return null;
    var circulo=(String(nombre).match(/\(C([1-8])\)/)||[])[1];
    var limpio=limpiar(nombre),lista=(ind.mapa.get(normalizar(limpio))||[]).slice();
    if(circulo)lista=lista.filter(function(x){
      if(x.tipo!=="Conjuro")return true;
      return x.datos.some(function(d){return d[0]==="Círculo"&&String(d[1])===circulo;});
    });
    if(!lista.length)return null;
    var tipo=grupo==="talento"?"talento":grupo==="equipo"?"equipo":"poder";
    function puntuacion(x){
      var n=x.sistema===sistema?20:0;
      if(tipo===x.grupo)n+=10;
      if(circulo&&x.tipo==="Conjuro"){
        var campo=x.datos.find(function(d){return d[0]==="Círculo";});
        n+=campo&&String(campo[1])===circulo?40:-40;
      }
      if(x.descripcion)n+=2;
      if(x.datos.length)n++;
      // El precio y estadísticas del catálogo oficial prevalecen sobre
      // los simples nombres heredados de la lista de Ocupación.
      if(tipo==="equipo"&&x.datos.some(function(d){return d[0]==="Precio";}))n+=8;
      if(tipo==="equipo"&&/^Equipo de Ocupación:/.test(x.fuente))n-=4;
      return n;
    }
    lista.sort(function(a,b){return puntuacion(b)-puntuacion(a);});
    return lista[0];
  }
  /* La selección de Conjuros usa su ID exacto, no el nombre visible,
   * para evitar fichas cruzadas entre variantes homónimas. */
  function buscarPorId(ind,id,grupo,sistema){
    if(!ind||typeof id!=="string"||!id.trim())return null;
    var lista=(ind.porId?.get(id)||[]).filter(function(x){
      return (!sistema||x.sistema===sistema)&&
        (!grupo||x.grupo===grupo);
    });
    return lista.length===1?lista[0]:null; // No adivinar entre coincidencias.
  }
  return {indice:indice,buscar:buscar,buscarPorId:buscarPorId,
    limpiar:limpiar,normalizar:normalizar};
});