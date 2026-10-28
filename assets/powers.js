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
      return s.circulo<=circulo && nombres.indexOf(s.nombre)!==-1;
    }).map(function(x){return {id:x.id,nombre:x.nombre,circulo:x.circulo,escuelas:x.escuelas};});
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
  function nuevo(id,titulo,tipo,cantidad,opciones,adicional){
    return Object.assign({id:id,titulo:titulo,tipo:tipo,cantidad:cantidad,opciones:opciones||[],
      repetibles:false,automatico:false},adicional||{});
  }
  function fila(p,n){return p&&p.niveles&&p.niveles[rango(n,1,30)-1]||[];}
  function tecnicas(catalogo,categorias,juego,ocupacion){
    return catalogo.tecnicas.filter(function(t){
      if(categorias.indexOf(t.categoria)<0)return false;
      if(juego==="nd20" && /CiFi$/.test(t.fuente))return false;
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
    }).map(function(v){return {id:v.id,nombre:v.nombre,circulo:v.circulo,escuelas:v.escuelas};});
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
    var tecnica=numero(columna(tabla,fila,/^Técnicas(?: de combate)?$/i));
    if(tecnica && tabla.categorias.length){
      var pool=tecnicas(catalogo,tabla.categorias,config.juego,nombre);
      if(nombre==="Pugilista")
        pool=pool.filter(function(t){return !/arma\s+(?:a distancia|cuerpo a cuerpo)|escudo|arrojadiza/i.test(t.requisito||"");});
      if(nombre==="Celador")
        pool=pool.filter(function(t){return !/arma cuerpo a cuerpo|espada|escudo/i.test(t.requisito||"");});
      extraerOpciones(pasos,"Técnicas de "+nombre,pool,tecnica,avisos);
    }else if(tecnica)avisos.push("La tabla indica "+tecnica+" Técnicas, pero no está verificada la categoría habilitada para "+nombre+".");
    var maximo=numero(columna(tabla,fila,/^(?:Círculo máximo de Conjuros|Círculo máximo|Círculo de Conjuro|Nivel de Conjuro)$/i));
    var conocidos=numero(columna(tabla,fila,/^Conjuros(?: conocidos)?$/i));
    var diarios=numero(columna(tabla,fila,/^Conjuros diarios$/i));
    if(nombre==="Nictomante"){
      var maxN=numero(columna(tabla,fila,/Círculo.*máximo/i));
      var lista=(catalogo.especiales?.lista_nictomancia)||[];
      var poolN=catalogo.conjuros.filter(function(x){return lista.indexOf(x.nombre)!==-1&&x.circulo<=maxN;})
        .map(function(x){return {id:x.id,nombre:x.nombre,circulo:x.circulo};});
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
      avisos.push("Los Conjuros del Adalid dependen del Compromiso elegido.");
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
    if(nombre==="Diletante")avisos.push("Los Talentos tomados de otras Ocupaciones necesitan elegir su origen y verificar compatibilidades.");
    if(nombre==="Adalid")avisos.push("Debes definir el Compromiso del Adalid antes de adquirir sus Técnicas especiales.");
  }

  function planificar(config,datos,catalogo,progresiones){
    var juego=config.juego,ocupacion=config.ocupacion,especie=config.especie;
    var nivel=rango(Number(config.nivel)||1,1,30),pasos=[],avisos=[],recursos=[];
    var rama=juego==="nd20"?"fantasia":juego==="nd20_cifi"?"cifi":"nocturna";
    var p=(progresiones[rama]||{})[ocupacion];
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
        var poolTec=tecnicas(catalogo,p.categorias,juego,ocupacion);
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
    return {pasos:pasos,avisos:avisos,recursos:recursos,fuente:progresiones.fuentes[rama]};
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
          circulo:val.circulo||paso.circulo||null});
      });
    }
    return {decisiones:decisiones,elementos:objetos};
  }
  function aplicar(personaje,plan,resultado){
    personaje.capacidades=personaje.capacidades||[];
    personaje.notas=personaje.notas||[];
    personaje.poderes=[];
    personaje.conjuros_preparados=[];
    resultado.elementos.forEach(function(x){
      if(x.tipo==="talento")personaje.capacidades.push(x.nombre);
      else if(x.tipo==="conjuro_preparado")
        personaje.conjuros_preparados.push(nombreEtiquetado(x.tipo,x.etapa,x.nombre)+" (C"+x.circulo+")");
      else personaje.poderes.push(nombreEtiquetado(x.tipo,x.etapa,x.nombre)+
        (x.circulo?" (C"+x.circulo+")":""));
    });
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
    codigoPoder:codigoPoder,nombreEtiquetado:nombreEtiquetado};
});