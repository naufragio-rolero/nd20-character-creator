/* Selección de Talentos y Poderes conforme a catálogos y tablas documentales.
 * API pura, determinista, sin dependencias. No concede progresiones no verificadas. */
(function(root,factory){
  var api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioPoderes=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function rango(n,min,max){return Math.max(min,Math.min(max,n));}
  function opcionesConjuros(catalogo,lista,circulo){
    var nombres=(lista||[]).reduce(function(a,x){return a.concat(x);},[]);
    return catalogo.conjuros.filter(function(s){
      return s.origen==="Nd20" && s.circulo<=circulo &&
        nombres.indexOf(s.nombre)!==-1;
    }).map(function(x){return {id:x.id,nombre:x.nombre,circulo:x.circulo,escuelas:x.escuelas,origen:x.origen};});
  }
  function habilidadesNocturna(arr,especie){
    var tipos=["Strigoi","Jiangshi","Hombre lobo","Hombre cuervo","Sidhe","Ceniciento"];
    return (arr||[]).filter(function(name){
      if(name==="Aceptación")return ["Strigoi","Jiangshi","Hombre lobo","Hombre cuervo"].indexOf(especie)!==-1;
      if(name==="Diletante místico")return ["Humano arcano","Strigoi","Hombre lobo","Hombre cuervo","Sidhe"].indexOf(especie)!==-1;
      return true;
    }).map(function(name){return {id:name,nombre:name};});
  }
  /* Prefijos editoriales: solo identifican el tipo, nunca alteran las reglas. */
  function codigoPoder(tipo,etapa){
    if(tipo==="tecnica")return "T";
    if(tipo==="conjuro_conocido"||tipo==="conjuro_preparado")return "C";
    if(tipo==="psionico")return "Ps";
    if(tipo==="argucia")return "Ar";
    if(tipo==="script")return "Sc";
    if(tipo==="magia_tantrica")return "Mt";
    if(tipo==="vinculo")return "V";
    if(tipo==="escuela")return "Es";
    if(tipo==="poder_especial"){
      if(/^Técnicas/i.test(etapa))return "T";
      if(/^Conjuros/i.test(etapa))return "C";
      if(/^Privilegios/i.test(etapa))return "Pr";
      if(/^Órdenes de batalla/i.test(etapa))return "Or";
      if(/^Flechería arcana/i.test(etapa))return "Fa";
      if(/^Canciones/i.test(etapa))return "Ca";
      if(/^Eidolas/i.test(etapa))return "Ei";
      if(/^Recetas de cocina/i.test(etapa))return "Rc";
    }
    return "";
  }
  function nombreEtiquetado(tipo,etapa,nombre){
    var codigo=codigoPoder(tipo,etapa);
    return (codigo?"["+codigo+"] ":"")+nombre;
  }
  function origenConjuro(tipo,etapa,origen){
    var esConjuro=tipo==="conjuro_conocido"||tipo==="conjuro_preparado"||
      (tipo==="poder_especial"&&/^Conjuros/i.test(etapa));
    return esConjuro?" · "+(origen||"Origen sin verificar"):"";
  }
  function nuevo(id,titulo,tipo,cantidad,opciones,adicional){
    return Object.assign({id:id,titulo:titulo,tipo:tipo,cantidad:cantidad,opciones:opciones||[],
      repetibles:false,automatico:false},adicional||{});
  }
  function fila(p,n){return p&&p.niveles&&p.niveles[rango(n,1,30)-1]||[];}
  function estadoUsoVA(requisito,atributos){
    // Los requisitos de Técnicas expresan Valor de Atributo (VA),
    // no Dificultad de Atributo (DA). Se comprueban para USAR, no aprender.
    var actual=Object.fromEntries((atributos||[]).map(function(a){
      return [a.nombre,Number(a.valor)];
    }));
    var patron=/(Fuerza|Agilidad|Resistencia|Mente|Intuición|Presencia)\s+(\d+)\+/gi;
    var coincidente,comprobados=[],faltantes=[];
    while((coincidente=patron.exec(requisito||''))!==null){
      var nombre=coincidente[1].toLocaleLowerCase('es');
      var canon=['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia']
        .find(function(x){return x.toLocaleLowerCase('es')===nombre;});
      var objetivo=Number(coincidente[2]),va=actual[canon];
      var dato={atributo:canon,requerido:objetivo,va:Number.isFinite(va)?va:null};
      comprobados.push(dato);
      if(dato.va!==null&&dato.va<objetivo)faltantes.push(dato);
    }
    return {comprobados:comprobados,faltantes:faltantes};
  }
  function tecnicas(catalogo,categorias,juego,ocupacion,fuentes){
    // Sin categorías restrictivas declaradas: todas las Técnicas del sistema.
    var habilitadas=Array.isArray(categorias)&&categorias.length?categorias:null;
    // Sin selección expresa, las cuatro Ocupaciones DRS solo acceden al
    // catálogo DRS; las ampliaciones conservan sus propias Técnicas para
    // pruebas y futuros DLC. En la web Forja 1.0 envía fuentes:['DRS'].
    var basicas=['Clérigo','Guerrero','Mago','Ladrón'];
    var habilitarAmpliacion=Array.isArray(fuentes)?
      fuentes.some(function(f){return f!=='DRS';}):
      !basicas.includes(ocupacion);
    return catalogo.tecnicas.filter(function(t){
      if(habilitadas&&habilitadas.indexOf(t.categoria)<0)return false;
      // Un suplemento no debe entrar por compartir categoría con el DRS;
      // las Ocupaciones ampliadas sí lo necesitan en sus propias pruebas.
      if(juego==="nd20" && t.fuente!=="Naufragio d20 DRS" &&
          !(habilitarAmpliacion&&t.fuente==="Naufragio d20 Ocupaciones"))
        return false;
      if(juego==="nd20_cifi" && /Ocupaciones$/.test(t.fuente))return false;
      // Los requisitos de Atributo y equipo son para el uso; una Ocupación específica sí restringe.
      var req=t.requisito||"";
      var exclusivas=["Valquiria","Guerrero","Derviche","Cronómaca","Celador","Pugilista"];
      if(exclusivas.some(function(nombre){return req.indexOf(nombre)!==-1&&ocupacion!==nombre;}))return false;
      return true;
    }).map(function(t){return {id:t.id,nombre:t.nombre,categoria:t.categoria,requisito:t.requisito};});
  }

  function columna(tabla,fila,patron) {
    if(!tabla||!fila)return null;
    var index=tabla.columnas.findIndex(function(c){
      return patron.test(String(c).replace(/\s+/g," ").trim());
    });
    return index<0?null:fila[index];
  }
  function numero(valor){return /^\d+$/.test(String(valor||""))?Number(valor):0;}
  function disponibilidadCatalogo(items,nivel){
    return (items||[]).filter(function(v){return Number(v.min_nivel||v.nivel||1)<=nivel;})
      .map(function(v){return {id:v.id,nombre:v.nombre,requisito:v.requisito||"",circulo:v.circulo||null};});
  }
  function magiaPorEscuela(catalogo,escuelas,maximo) {
    if(!maximo||!escuelas.length)return [];
    return catalogo.conjuros.filter(function(v){
      return v.circulo<=maximo && v.escuelas.some(function(e){return escuelas.indexOf(e)!==-1;});
    }).map(function(v){return {id:v.id,nombre:v.nombre,circulo:v.circulo,escuelas:v.escuelas,origen:v.origen};});
  }
  function extraerOpciones(plan,paso,opciones,cantidad,avisos) {
    if(!cantidad)return;
    if(!opciones.length){
      avisos.push("Sin catálogo compatible verificado para "+paso+".");
      return;
    }
    if(opciones.length<cantidad){
      avisos.push("En "+paso+" hay "+cantidad+" plazas pero solo "+opciones.length+
        " opciones documentadas: no se inventan las restantes.");
      cantidad=opciones.length;
    }
    plan.push(nuevo("extra-"+paso.replace(/[^\w]/g,"-").toLowerCase(),
      paso,"poder_especial",cantidad,opciones));
  }
  function agregarProgresoAmpliado(config,catalogo,progresiones,pasos,avisos,recursos) {
    var sector=config.juego==="nd20"?"fantasia":"nocturna";
    var tabla=progresiones.ampliadas && progresiones.ampliadas[sector] &&
      progresiones.ampliadas[sector][config.ocupacion];
    if(!tabla){
      avisos.push("Progresión específica aún no incorporada para esta Ocupación.");
      return;
    }
    if(!tabla.verificado){
      avisos.push("La tabla de "+config.ocupacion+" requiere verificación manual. "+
        "Se conserva como referencia sin asignar capacidades dudosas.");
      return;
    }
    var nivel=config.nivel, fila=tabla.niveles[nivel-1]||[];
    var nombre=config.ocupacion, cols=tabla.columnas;
    if(nombre==="Hurí"){
      var artes=numero(columna(tabla,fila,/^Magia tántrica$/i));
      var defensa=columna(tabla,fila,/^Defensa sin armadura$/i);
      if(artes){
        recursos.push(["Magia tántrica · artes conocidas",artes]);
        pasos.push(nuevo("magia-tantrica","Magia tántrica documentada","magia_tantrica",1,
          [{id:"magia-tantrica",nombre:"Magia tántrica: "+artes+
            (artes===1?" arte conocida":" artes conocidas")+" (efectos sin catalogar)"}],
          {automatico:true}));
        avisos.push("El suplemento indica la cantidad de artes tántricas por Nivel, "+
          "pero no incluye sus nombres ni efectos. Deben acordarse con el Cronista; "+
          "el generador no los inventa.");
      }
      if(defensa!==null)recursos.push(["Blindaje sin armadura",defensa]);
    }
    var tecnica=numero(columna(tabla,fila,/^Técnicas(?: de combate)?(?: \(si procede\))?$/i));
    if(tecnica && nombre!=="Diletante"){
      var categorias=nombre==="Adalid"?
        ["Disciplina","Fuerza bruta","Preternatural"]:tabla.categorias||[];
      var pool=tecnicas(catalogo,categorias,config.juego,nombre,config.fuentes);
      if(nombre==="Pugilista")
        pool=pool.filter(function(t){return !/arma\s+(?:a distancia|cuerpo a cuerpo)|escudo|arrojadiza/i.test(t.requisito||"");});
      if(nombre==="Celador")
        pool=pool.filter(function(t){return !/arma cuerpo a cuerpo|espada|escudo/i.test(t.requisito||"");});
      extraerOpciones(pasos,"Técnicas de "+nombre,pool,tecnica,avisos);
      var ultimo=pasos[pasos.length-1];
      if(nombre==="Adalid"&&ultimo&&ultimo.titulo==="Técnicas de Adalid")
        ultimo.dependeCompromiso=true;
    }else if(tecnica&&nombre==="Diletante"){
      avisos.push("Diletante: las Técnicas dependen de las Competencias y Poderes de la lista seleccionada.");
    }
    var maximo=numero(columna(tabla,fila,/^(?:Círculo máximo de Conjuros|Círculo máximo|Círculo de Conjuro|Nivel de Conjuro)$/i));
    var conocidos=numero(columna(tabla,fila,/^Conjuros(?: conocidos)?$/i));
    var diarios=numero(columna(tabla,fila,/^Conjuros diarios$/i));
    if(nombre==="Nictomante"){
      var maxN=numero(columna(tabla,fila,/Círculo.*máximo/i));
      var lista=(catalogo.especiales?.lista_nictomancia)||[];
      var poolN=catalogo.conjuros.filter(function(x){return lista.indexOf(x.nombre)!==-1&&x.circulo<=maxN;})
        .map(function(x){return {id:x.id,nombre:x.nombre,circulo:x.circulo,origen:x.origen};});
      if(conocidos)extraerOpciones(pasos,"Conjuros de Nictomancia",poolN,conocidos,avisos);
      var pn=columna(tabla,fila,/Puntos de Nictalgia/i);
      if(pn!==null)recursos.push(["Nictalgia",pn]);
    }else if(nombre==="Arcanista"&&sector==="nocturna"){
      pasos.push(nuevo("escuela-maestra","Segunda Escuela maestra","escuela",1,
        ["Elemental","Nigromancia","Demonología","Divina","Naturaleza"].map(function(x){return {id:x,nombre:x};})));
      var nm=numero(columna(tabla,fila,/Círculo máximo de Conjuros/i));
      var nc=numero(columna(tabla,fila,/Conjuros conocidos/i));
      if(nc)extraerOpciones(pasos,"Conjuros del Arcanista",
        magiaPorEscuela(catalogo,["Arcana","Elemental","Nigromancia","Demonología","Divina","Naturaleza"],nm),
        nc,avisos);
      var last=pasos[pasos.length-1];if(last&&last.titulo==="Conjuros del Arcanista")
        last.dependeEscuela=true;
    }else if(nombre==="Espiritista"){
      var pd=columna(tabla,fila,/Puntos de.*Destino/i);
      if(pd!==null)recursos.push(["Destino",pd]);
      if(conocidos)extraerOpciones(pasos,"Conjuros del Espiritista",
        magiaPorEscuela(catalogo,["Divina","Nigromancia"],maximo),conocidos,avisos);
    }else if(nombre==="Epicúreo"){
      avisos.push("Los Conjuros del Epicúreo deben beneficiar al grupo: no se asignan hasta etiquetar sus efectos.");
    }else if(nombre==="Cronómaca"){
      avisos.push("Los Conjuros de Cronurgia requieren etiquetas contrastadas antes de permitir su elección.");
    }else if(nombre==="Adalid"){
      // La lista documental de Conjuros está disponible; su asignación por
      // Escuela/Compromiso requiere conciliar los Círculos con el catálogo.
      avisos.push("Los Conjuros del Adalid dependen del Compromiso. Su tabla está " +
        "reconstruida, pero la correspondencia de Escuelas y Círculos con el catálogo " +
        "de conjuros sigue pendiente de validar; no se asignan hechizos dudosos.");
      for(var cAd=1;cAd<=4;cAd++){
        var nAd=numero(columna(tabla,fila,new RegExp("^"+cAd+"$")));
        if(nAd)avisos.push("Adalid: "+nAd+" Espacio(s) del Círculo "+cAd+
          " si eliges un Compromiso que conceda Conjuros.");
      }
    }else if(nombre==="Brujo"||nombre==="Chamán"||nombre==="Hechicero"||nombre==="Oráculo"){
      var vinculos=catalogo.especiales?.vinculos?.[nombre]||[];
      if(vinculos.length){
        pasos.push(nuevo("vinculo-arcano",
          ({Brujo:"Patrón",Chamán:"Tradición ancestral",Hechicero:"Estirpe arcana",
            Oráculo:"Llama divina"})[nombre],"vinculo",1,vinculos));
        if(conocidos){
          var todas=["Arcana","Demonología","Divina","Nigromancia","Elemental","Naturaleza"];
          var poolV=magiaPorEscuela(catalogo,todas,maximo);
          extraerOpciones(pasos,"Conjuros de "+nombre,poolV,conocidos,avisos);
          var pasoV=pasos[pasos.length-1];
          if(pasoV&&pasoV.titulo==="Conjuros de "+nombre){
            pasoV.dependeVinculo=true;pasoV.vinculos=vinculos;
          }
        }
      }else avisos.push("No hay origen sobrenatural documental para "+nombre+".");
      var recurso=nombre==="Brujo"?["Brujería",columna(tabla,fila,/Puntos de Brujería/i)]:
        nombre==="Chamán"?["Chamanismo",columna(tabla,fila,/Puntos de Chamanismo/i)]:
        nombre==="Hechicero"?["Dado de Hechicería",columna(tabla,fila,/Dado de Hechicería/i)]:
        ["Dado de Prodigios",columna(tabla,fila,/Dado de Hechicería/i)];
      if(recurso[1]!==null)recursos.push(recurso);
    }else if(nombre==="Truhán"||nombre==="Astrólogo"){
      avisos.push("La tabla de "+nombre+" aún requiere verificación por Círculo.");
    }else{
      if(conocidos){
        var escuela=tabla.escuelas||[];
        extraerOpciones(pasos,"Conjuros conocidos de "+nombre,
          magiaPorEscuela(catalogo,escuela,maximo),conocidos,avisos);
      }
      if(diarios && tabla.escuelas.length)
        extraerOpciones(pasos,"Conjuros diarios de "+nombre,
          magiaPorEscuela(catalogo,tabla.escuelas,maximo),diarios,avisos);
      // Tablas de Espacios de Conjuro por Círculo.
      if(cols.some(function(x){return /^[1-8]$/.test(x);}) && nombre==="Druida"){
        for(var ci=1;ci<=8;ci++){
          var espacios=numero(columna(tabla,fila,new RegExp("^"+ci+"$")));
          if(!espacios)continue;
          var lista=magiaPorEscuela(catalogo,tabla.escuelas,ci).filter(function(x){return x.circulo===ci;});
          if(lista.length)pasos.push(nuevo("ampliado-preparado-"+ci,"Preparar Círculo "+ci+
            " · "+nombre,"conjuro_preparado",espacios,lista,{circulo:ci,repetibles:true}));
        }
      }
    }
    var especiales=catalogo.especiales||{};
    if((tabla.especialidades||[]).includes("privilegios"))
      extraerOpciones(pasos,"Privilegios",disponibilidadCatalogo(especiales.privilegios,nivel),
        numero(columna(tabla,fila,/Privilegios/i)),avisos);
    if((tabla.especialidades||[]).includes("ordenes"))
      extraerOpciones(pasos,"Órdenes de batalla",disponibilidadCatalogo(especiales.ordenes,nivel),
        numero(columna(tabla,fila,/Órdenes de batalla/i)),avisos);
    if((tabla.especialidades||[]).includes("flecheria")){
      extraerOpciones(pasos,"Flechería arcana",disponibilidadCatalogo(especiales.flecheria,nivel),
        numero(columna(tabla,fila,/^Recetas$/i)),avisos);
      var proyectiles=columna(tabla,fila,/^Proyectiles$/i);
      if(proyectiles!==null)recursos.push(["Proyectiles arcanos",proyectiles]);
    }
    if((tabla.especialidades||[]).includes("canciones")){
      var cnt=numero(columna(tabla,fila,/^Canciones$/i));
      var comp=String(columna(tabla,fila,/Complejidad Canciones/i)||"");
      var max=comp.includes("Míticas")?4:comp.includes("Maestras")?3:
        comp.includes("Intrincadas")?2:1;
      var poolC=(especiales.canciones||[]).filter(function(x){return x.complejidad<=max;});
      extraerOpciones(pasos,"Canciones",disponibilidadCatalogo(poolC,nivel),cnt,avisos);
    }
    if((tabla.especialidades||[]).includes("eidolas")){
      var count=numero(columna(tabla,fila,/Diagramas astrales/i));
      var categoria=numero(columna(tabla,fila,/Categoría Eidolon/i));
      var poolE=(especiales.eidolas||[]).filter(function(x){return x.categoria<=categoria;});
      extraerOpciones(pasos,"Eidolas",disponibilidadCatalogo(poolE,nivel),count,avisos);
    }
    if((tabla.especialidades||[]).includes("recetas")){
      var poolR=disponibilidadCatalogo(especiales.recetas,nivel);
      extraerOpciones(pasos,"Recetas de cocina",poolR,2,avisos);
      avisos.push("El Lardeur puede aprender más Recetas durante la aventura; no existe un máximo por Nivel.");
    }
    // Tablas documentadas con mejoras pasivas no elegibles.
    if(nombre==="Diletante")avisos.push("Los Talentos aprendidos mediante Diletante que conceden Poderes requieren aplicar el factor de Nivel 1/5 indicado en el manual.");
    if(nombre==="Adalid")avisos.push("Las Técnicas del Adalid se restringen automáticamente por Compromiso.");
  }


  // El manual de Ocupaciones: Gladiador 1/12/24, Diletante 1/6/12 y 1/9.
  var ESTILOS_GLADIADOR=["Cestus","Dimacaero","Murmillo","Retiario","Secutor","Veles"];
  var COMPETENCIAS_DILETANTE=[
    {id:"armas-varias",nombre:"Armas variadas y dos tipos de armaduras",
      requisito:"Elegir 4 armas entre armas de una mano, dos manos, arrojadizas o a distancia; elegir 2 tipos de armadura en orden ascendente."},
    {id:"armas-escudo",nombre:"Tres armas, tres tipos de armadura y escudo mediano",
      requisito:"Elegir 3 armas entre armas de una mano o a distancia; elegir 3 tipos de armadura en orden ascendente; competencia con escudos medianos."},
    {id:"protecciones",nombre:"Cuatro tipos de armadura y cualquier escudo",
      requisito:"Elegir 4 tipos de armadura en orden ascendente; competencia con cualquier escudo."}
  ];
  function talentosDiletante(datos){
    var prohibidos=["Diletante","Marginado"],condicionados=[
      "Compromiso del adalid","Estilos de gladiatoria","Aprendiz de todo",
      "Competencias y poderes"];
    return Object.entries(datos.ocupaciones||{}).filter(function(par){
      return prohibidos.indexOf(par[0])<0&&
        (!par[1].talentos_documentacion||par[1].talentos_documentacion.verificado!==false);
    }).flatMap(function(par){
      return (par[1].talentos||[]).filter(function(t){
        return !condicionados.includes(t);
      }).map(function(t){
        return {id:par[0]+": "+t,nombre:t,requisito:"Ocupación de origen: "+par[0]};
      });
    });
  }

  function planificar(config,datos,catalogo,progresiones){
    var juego=config.juego,ocupacion=config.ocupacion,especie=config.especie;
    var nivel=rango(Number(config.nivel)||1,1,30),pasos=[],avisos=[],recursos=[];
    var rama=juego==="nd20"?"fantasia":juego==="nd20_cifi"?"cifi":"nocturna";
    var p=(progresiones[rama]||{})[ocupacion];
    if(juego==="nd20"){
      // La generación rápida resuelve Herencia dual en las reglas; en el
      // editor cada alternativa de Buen desarrollo especifica su Atributo,
      // para recalcular la progresión completa desde Nivel 1.
      var perfilEspecie=datos.especies[especie]||{};
      var alternativas=Array.isArray(perfilEspecie.herencia_dual)?
        perfilEspecie.herencia_dual:null;
      var herenciaAlternativa=alternativas?
        alternativas.find(function(t){return t!=="Buen desarrollo";}):null;
      if(especie==="Humano común" && config.modo==="personalizado"){
        pasos.push(nuevo("buen-desarrollo","Buen desarrollo · Nivel 1",
          "buen_desarrollo",1,
          ["Fuerza","Agilidad","Resistencia","Mente","Intuición","Presencia"]
            .map(function(attr){return {id:attr,nombre:"+1 VA en "+attr};})));
      }
      if(herenciaAlternativa && config.modo==="personalizado"){
        var opcionesHerencia=[{id:herenciaAlternativa,nombre:herenciaAlternativa}];
        ["Fuerza","Agilidad","Resistencia","Mente","Intuición","Presencia"]
          .forEach(function(attr){
            opcionesHerencia.push({id:"Buen desarrollo:"+attr,
              nombre:"Buen desarrollo (+1 VA en "+attr+")"});
          });
        pasos.push(nuevo("herencia-dual","Herencia dual · Nivel 1",
          "herencia_dual",1,opcionesHerencia));
      }
      var perfil=datos.ocupaciones[ocupacion]||{};
      if((perfil.talentos_elegir||[]).length){
        pasos.push(nuevo("talento-ocupacion-inicial",
          "Talento de "+ocupacion+" · Nivel 1","talento",1,
          perfil.talentos_elegir.map(function(t){return {id:t,nombre:t};})));
      }
      if(ocupacion==="Adalid"&&(perfil.compromisos||[]).length){
        pasos.push(nuevo("compromiso-adalid","Compromiso del Adalid · Nivel 1",
          "compromiso",1,perfil.compromisos.map(function(v){
            return {id:v.nombre,nombre:v.nombre};
          })));
        avisos.push("Los Conjuros del Adalid no se atribuyen automáticamente hasta conciliar las listas por Escuela y Círculo.");
      }
      if(ocupacion==="Diletante"){
        var poolD=talentosDiletante(datos);
        for(var nivD of [1,6,12])if(nivel>=nivD)
          pasos.push(nuevo("talento-diletante-"+nivD,
            "Talento de otra Ocupación · Nivel "+nivD,"talento_ajeno",1,
            poolD,{grupo:"talentos-diletante"}));
        for(var compD of [1,9])if(nivel>=compD)
          pasos.push(nuevo("competencias-diletante-"+compD,
            "Lista de competencias · Nivel "+compD,"competencias_diletante",1,
            COMPETENCIAS_DILETANTE,{grupo:"competencias-diletante"}));
      }
      if(ocupacion==="Gladiador"){
        for(var estiloNivel of [1,12,24])if(nivel>=estiloNivel)
          pasos.push(nuevo("estilo-gladiador-"+estiloNivel,
            "Estilo de gladiatoria · Nivel "+estiloNivel,"estilo_gladiatoria",1,
            ESTILOS_GLADIADOR.map(function(t){return {id:t,nombre:t};}),
            {grupo:"estilos-gladiador"}));
        avisos.push("El Gladiador solo puede tener activo un Estilo y no cambiarlo durante el Combate.");
      }
    }
    if(juego==="nd20_nocturna"){
      var es=datos.especies[especie],oc=datos.ocupaciones[ocupacion];
      if(es&&(es.talentos_elegir||[]).length)
        pasos.push(nuevo("talento-especie-1","Talento de Especie · Nivel 1","talento",1,
          habilidadesNocturna(es.talentos_elegir,especie)));
      if(oc&&(oc.talentos_elegir||[]).length){
        for(var n of [1,9])if(nivel>=n)
          pasos.push(nuevo("talento-ocupacion-"+n,"Talento de Ocupación · Nivel "+n,"talento",1,
            habilidadesNocturna(oc.talentos_elegir,especie),{grupo:"talentos-ocupacion"}));
      }
      agregarProgresoAmpliado(config,catalogo,progresiones,pasos,avisos,recursos);
      avisos.push("Los Poderes específicos de Especie (Vampirismo, etc.) que carecen de tabla verificable siguen pendientes.");
      return {pasos:pasos,avisos:avisos,recursos:recursos,fuente:progresiones.fuentes.nocturna};
    }
    if(!p){
      agregarProgresoAmpliado(config,catalogo,progresiones,pasos,avisos,recursos);
      return {pasos:pasos,avisos:avisos,recursos:recursos,fuente:"Naufragio d20 · Suplementos"};
    }
    var f=fila(p,nivel);
    var conjurosAutomaticos=[];
    if(juego==="nd20"&&ocupacion==="Clérigo"){
      // El DRS concede automáticamente todos los Conjuros del Círculo
      // desbloqueado al Clérigo, aunque prepare solamente sus Espacios.
      for(var cCl=1;cCl<=8;cCl++){
        if(!f[cCl-1])continue;
        conjurosAutomaticos=conjurosAutomaticos.concat(
          opcionesConjuros(catalogo,
            [catalogo.listas_drs["Clérigo"]?.[cCl]||[]],cCl)
            .filter(function(x){return x.circulo===cCl;})
        );
      }
      // Contradicción del DRS: lista clerical, C4; descripción propia, C5.
      // No adscribir Marca del dador oscuro a un Círculo por inferencia.
      if(nivel>=8)avisos.push(
        "DRS: Marca del dador oscuro aparece en Círculo 4 en la lista del Clérigo,"+
        " pero su descripción lo declara de Quinto Círculo."+
        " Pendiente de decisión editorial; no se aprende automáticamente.");
    }
    if(juego==="nd20"&&ocupacion==="Guerrero"){
      pasos.push(nuevo("talento-guerrero","Talento de Guerrero · Nivel 1","talento",1,
        [{id:"Brío musculoso",nombre:"Brío musculoso"},{id:"Sacrificio de escudo",nombre:"Sacrificio de escudo"}]));
    }
    if(p.tipo==="grimorio_y_preparados"){
      for(var n=1;n<=nivel;n++){
        var accesos=fila(p,n),maxCirculo=accesos.reduce(function(m,v,i){return Number(v)>0?i+1:m;},0);
        var pool=opcionesConjuros(catalogo,Object.keys(catalogo.listas_drs.Mago).filter(function(k){return Number(k)<=maxCirculo;}).map(function(k){return catalogo.listas_drs.Mago[k];}),maxCirculo);
        pasos.push(nuevo("grimorio-"+n,"Aprender Conjuros · Nivel "+n,"conjuro_conocido",n===1?2:1,pool,{grupo:"grimorio"}));
      }
    }
    if(p.tipo==="conjuros_preparados"||p.tipo==="grimorio_y_preparados"){
      for(var c=1;c<=8;c++){
        if(!f[c-1])continue;
        var pool=opcionesConjuros(catalogo,[catalogo.listas_drs[ocupacion]?.[c]||[]],c);
        pasos.push(nuevo("preparados-"+c,"Preparar · Círculo "+c,"conjuro_preparado",Number(f[c-1]),pool,
          {circulo:c,repetibles:true,dependeGrimorio:ocupacion==="Mago"}));
      }
    }
    if(p.tipo==="tecnicas"||p.tipo==="argucias_y_tecnicas"||p.tipo==="scripts_y_tecnicas"){
      var count=p.tipo==="tecnicas"?(ocupacion==="Eudemonista"?Number(f[2]):Number(f[0])):Number(f[0]);
      if(count>0){
        var poolTec=tecnicas(catalogo,p.categorias,juego,ocupacion,config.fuentes);
        if(count>poolTec.length)avisos.push(
          "La progresión permite "+count+" Técnicas, pero el catálogo compatible contiene "+
          poolTec.length+". Faltan "+(count-poolTec.length)+" opciones; no se inventan.");
        if(poolTec.length)pasos.push(nuevo("tecnicas","Técnicas conocidas","tecnica",
          Math.min(count,poolTec.length),poolTec));
      }
    }
    if(p.tipo==="argucias_y_tecnicas")
      pasos.push(nuevo("argucias","Argucias conocidas","argucia",Number(f[1]),catalogo.argucias));
    if(p.tipo==="scripts_y_tecnicas")
      pasos.push(nuevo("scripts","Scripts conocidos","script",Number(f[1]),catalogo.scripts));
    if(p.tipo==="poderes_psionicos"){
      recursos.push(["Ímpetu",f[0]]);
      pasos.push(nuevo("psionicos","Poderes Psiónicos · tabla d20","psionico",Number(f[1]),
        catalogo.poderes_psionicos,{automatico:true}));
      avisos.push("Psion: el manual exige aprender mediante 1d20. El modo Personalizado respeta esta tirada.");
    }
    if(p.tipo==="sequito")avisos.push("Diplomático: sus Asistentes y Guardaespaldas siguen la tabla de progreso; no son Poderes seleccionables.");
    return {pasos:pasos,avisos:avisos,recursos:recursos,
      fuente:progresiones.fuentes[rama],
      conjuros_automaticos:conjurosAutomaticos,
      talentos_ocupacion: juego==="nd20" ?
        (datos.ocupaciones[ocupacion]?.talentos_descripcion||{}) : {}};
  }
  function disponibles(paso,selecciones){
    var lista=paso.opciones||[];
    if(paso.dependeVinculo){
      var elegido=(selecciones["vinculo-arcano"]||[])[0];
      var vic=(paso.vinculos||[]).find(function(x){return x.id===elegido;});
      if(!vic)lista=[];
      else lista=lista.filter(function(op){
        return (op.escuelas||[]).some(function(e){return vic.escuelas.includes(e);});
      });
    }
    if(paso.dependeEscuela){
      var elegida=(selecciones["escuela-maestra"]||[])[0];
      lista=lista.filter(function(op){
        // Pool de escuelas originales; consultar el catálogo fuente para cada Conjuro.
        var info=(paso.opciones||[]).find(function(x){return x.id===op.id;});
        return info && ((info.escuelas||[]).includes("Arcana")||
          (info.escuelas||[]).includes(elegida));
      });
    }
    if(paso.dependeGrimorio){
      var conocidos=new Set();
      Object.keys(selecciones||{}).filter(function(k){return k.startsWith("grimorio-");}).forEach(function(k){
        (selecciones[k]||[]).forEach(function(id){conocidos.add(id);});
      });
      lista=lista.filter(function(op){return conocidos.has(op.id);});
    }
    if(paso.dependeCompromiso){
      var compromiso=(selecciones["compromiso-adalid"]||[])[0];
      var categorias=["Disciplina"];
      if(compromiso==="Guardián leal")categorias.push("Fuerza bruta");
      if(compromiso==="Endecha de los condenados")categorias.push("Preternatural");
      lista=lista.filter(function(x){return categorias.includes(x.categoria);});
    }
    if(["talentos-diletante","competencias-diletante","estilos-gladiador"].includes(paso.grupo)){
      var idsUsados=new Set();
      Object.keys(selecciones||{}).forEach(function(k){
        if(k===paso.id)return;
        var mismo=paso.grupo==="talentos-diletante"?k.startsWith("talento-diletante-"):
          paso.grupo==="competencias-diletante"?k.startsWith("competencias-diletante-"):
          k.startsWith("estilo-gladiador-");
        if(mismo)(selecciones[k]||[]).forEach(function(id){idsUsados.add(id);});
      });
      lista=lista.filter(function(x){return !idsUsados.has(x.id);});
    }
    if(paso.grupo==="talentos-ocupacion"){
      var usados=new Set();
      Object.keys(selecciones||{}).filter(function(k){return k.startsWith("talento-ocupacion-")&&k!==paso.id;}).forEach(function(k){
        (selecciones[k]||[]).forEach(function(id){usados.add(id);});
      });
      lista=lista.filter(function(op){return !usados.has(op.id);});
    }
    if(paso.tipo==="conjuro_preparado")
      return [{id:"__vacio",nombre:"Sin preparar"}].concat(lista);
    return lista;
  }
  function resolver(plan,elecciones,rng){
    rng=rng||Math.random;
    var decisiones={},objetos=[],auto=(elecciones===null||elecciones===undefined);
    var learnedIds=new Set(),psionicoIds=new Set();
    for(const paso of plan.pasos){
      var picks=[],pool=disponibles(paso,decisiones);
      if(paso.automatico){
        for(var i=0;i<paso.cantidad;i++){
          var first=pool[Math.floor(rng()*pool.length)];
          if(!first)throw Error("Tabla psiónica vacía");
          if(psionicoIds.has(first.id)){
            var second=pool[Math.floor(rng()*pool.length)];
            first=!psionicoIds.has(second.id)?second:null;
            if(!first){
              // Segunda tirada duplicada: elegir el más cercano anterior o siguiente disponible.
              var cercanos=pool.filter(function(x){return !psionicoIds.has(x.id);})
                .sort(function(a,b){
                  return Math.abs(a.numero-second.numero)-Math.abs(b.numero-second.numero);
                });
              if(!cercanos.length)throw Error("Poderes Psiónicos insuficientes");
              first=cercanos[0];
            }
          }
          psionicoIds.add(first.id);picks.push(first.id);
        }
      }else if(auto){
        for(var j=0;j<paso.cantidad;j++){
          var candidatos=pool.filter(function(x){
            return (paso.repetibles||picks.indexOf(x.id)<0) &&
              (paso.tipo!=="conjuro_conocido"||!learnedIds.has(x.id));
          });
          if(!candidatos.length)throw Error("No quedan opciones válidas para "+paso.titulo);
          var validos=candidatos.filter(function(x){return x.id!=="__vacio";});
          var chosen=validos.length?validos[Math.floor(rng()*validos.length)]:
            candidatos[Math.floor(rng()*candidatos.length)];
          picks.push(chosen.id);
          if(paso.tipo==="conjuro_conocido")learnedIds.add(chosen.id);
        }
      }else{
        picks=(elecciones[paso.id]||[]).slice();
        if(picks.length!==paso.cantidad)throw Error("Elige "+paso.cantidad+" opción(es) en "+paso.titulo);
        if(picks.some(function(id){return !pool.some(function(op){return op.id===id;});}))
          throw Error("Opción fuera de catálogo o no disponible: "+paso.titulo);
        if(!paso.repetibles&&new Set(picks).size!==picks.length)
          throw Error("No repitas opciones en "+paso.titulo);
        if(paso.tipo==="conjuro_conocido"){
          if(picks.some(function(id){return learnedIds.has(id);}))throw Error("Conjuro ya aprendido: "+paso.titulo);
          picks.forEach(function(id){learnedIds.add(id);});
        }
      }
      decisiones[paso.id]=picks;
      picks.forEach(function(id){
        if(id==="__vacio")return;
        var val=(paso.opciones||[]).find(function(x){return x.id===id;});
        objetos.push({id:id,nombre:val.nombre,tipo:paso.tipo,etapa:paso.titulo,info:val.requisito||"",
          circulo:val.circulo||paso.circulo||null,origen:val.origen||null});
      });
    }
    return {decisiones:decisiones,elementos:objetos};
  }
  function aplicar(personaje,plan,resultado){
    personaje.capacidades=personaje.capacidades||[];
    personaje.notas=personaje.notas||[];
    personaje.poderes=(plan.conjuros_automaticos||[]).map(function(x){
      return nombreEtiquetado("conjuro_conocido","Conjuros del Clérigo",x.nombre)+
        " (C"+x.circulo+")"+origenConjuro("conjuro_conocido",
          "Conjuros del Clérigo",x.origen);
    });
    personaje.conjuros_preparados=[];
    resultado.elementos.forEach(function(x){
      var esTecnica=x.tipo==="tecnica"||
        (x.tipo==="poder_especial"&&/^Técnicas/i.test(x.etapa));
      if(esTecnica){
        var estado=estadoUsoVA(x.info,personaje.atributos);
        if(estado.faltantes.length)
          personaje.notas.push("Técnica aprendida, pendiente de uso: "+x.nombre+
            ". Requiere "+estado.faltantes.map(function(a){
              return a.atributo+" VA "+a.requerido+"+ (actual VA "+a.va+")";
            }).join("; ")+".");
      }
      if(x.tipo==="buen_desarrollo"){
        if(personaje.atributo_buen_desarrollo!==x.id)
          throw Error("Buen desarrollo: se debe reconstruir la ficha desde Nivel 1 antes de aplicar Poderes.");
      }else if(x.tipo==="herencia_dual"){
        var parte=x.id.split(":");
        var talento=parte[0],atributo=parte.length===2?parte[1]:null;
        if(personaje.herencia_dual!==talento ||
            (talento==="Buen desarrollo"&&personaje.atributo_buen_desarrollo!==atributo))
          throw Error("Herencia dual: se debe reconstruir la ficha desde Nivel 1 antes de aplicar Poderes.");
        // El motor de creación ya ha incluido el Talento y la mejora de VA.
      }else if(x.tipo==="talento"){
        if(!personaje.capacidades.includes(x.nombre))personaje.capacidades.push(x.nombre);
      }else if(x.tipo==="talento_ajeno"){
        personaje.capacidades.push(x.nombre+" (Diletante; "+x.info+")");
      }else if(x.tipo==="competencias_diletante"){
        personaje.competencias=personaje.competencias||[];
        personaje.competencias.push("Diletante · "+x.nombre+": "+x.info);
      }else if(x.tipo==="estilo_gladiatoria"){
        personaje.capacidades.push("Estilo de gladiatoria: "+x.nombre);
      }else if(x.tipo==="compromiso"){
        personaje.capacidades.push("Compromiso del adalid: "+x.nombre);
        if(x.nombre==="Guardián leal")personaje.capacidades.push("Desafío honorable");
        if(x.nombre==="Juramento sagrado")personaje.capacidades.push("Imposición de manos");
        if(x.nombre==="Guardián leal")
          personaje.competencias.push("Técnicas de batalla: Disciplina y Fuerza bruta");
        if(x.nombre==="Endecha de los condenados")
          personaje.competencias.push("Técnicas de batalla: Disciplina y Preternatural");
        if(x.nombre==="Juramento sagrado")
          personaje.competencias.push("Conjuros: Escuela Divina hasta Círculo 4");
        if(x.nombre==="Endecha de los condenados")
          personaje.competencias.push("Conjuros: Arcana, Demonología y Nigromancia hasta Círculo 4");
      }
      else if(x.tipo==="conjuro_preparado")
        personaje.conjuros_preparados.push(nombreEtiquetado(x.tipo,x.etapa,x.nombre)+
          " (C"+x.circulo+")"+origenConjuro(x.tipo,x.etapa,x.origen));
      else personaje.poderes.push(nombreEtiquetado(x.tipo,x.etapa,x.nombre)+
        (x.circulo?" (C"+x.circulo+")":"")+origenConjuro(x.tipo,x.etapa,x.origen));
    });
    // Los Talentos concedidos después de la creación provisional también
    // necesitan una descripción documental, no solo su nombre en la ficha.
    if(personaje.juego==="Naufragio d20 · Fantasía"&&plan.talentos_ocupacion){
      Object.keys(plan.talentos_ocupacion).forEach(function(talento){
        var encabezado='Talento de Ocupación — '+talento+': ';
        if(personaje.capacidades.includes(talento)&&
            !personaje.notas.some(function(n){return n.startsWith(encabezado);}))
          personaje.notas.push(encabezado+plan.talentos_ocupacion[talento]);
      });
    }
    // El editor aplica la elección del Guerrero después de crear la ficha.
    // Recalcular Potencia con el Talento efectivamente escogido; no conceder
    // la mejora de Brío musculoso a quien elige Sacrificio de escudo.
    if(personaje.juego==="Naufragio d20 · Fantasía" &&
        personaje.descripcion.startsWith("Guerrero · ")){
      var n=Number(personaje.nivel)||1;
      var brio=personaje.capacidades.includes("Brío musculoso");
      var potencia=1+(brio?(n>=10?1:0)+(n>=22?1:0):0);
      var idxPotencia=personaje.recursos.findIndex(function(x){return x[0]==="Potencia";});
      if(idxPotencia>=0)personaje.recursos[idxPotencia]=["Potencia",potencia];
      else personaje.recursos.push(["Potencia",potencia]);
    }
    (plan.recursos||[]).forEach(function(r){
      var idx=personaje.recursos.findIndex(function(v){return v[0]===r[0];});
      if(idx>=0)personaje.recursos[idx]=r;else personaje.recursos.push(r);
    });
    personaje.notas=personaje.notas.filter(function(x){return !/El generador no asigna Conjuros ni Técnicas por Nivel/.test(x);});
    personaje.notas=personaje.notas.concat(plan.avisos||[]);
    var vacios=Object.values(resultado.decisiones).reduce(function(sum,a){
      return sum+a.filter(function(x){return x==="__vacio";}).length;
    },0);
    if(vacios)personaje.notas.push(vacios+" Espacio(s) de Conjuro sin preparar.");
    return personaje;
  }
  return {planificar:planificar,resolver:resolver,aplicar:aplicar,disponibles:disponibles,
    codigoPoder:codigoPoder,nombreEtiquetado:nombreEtiquetado,
    origenConjuro:origenConjuro,estadoUsoVA:estadoUsoVA};
});