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
      .replace(/\s+\(DU\s*d\d+(?:\s+cada una)?\)/gi,"")
      .replace(/\s+×\d+$/,"")
      .replace(/^Estilo de gladiatoria:\s*/i,"")
      .replace(/^Paquete\s+([^:]+):.*$/i,"$1")
      .replace(/^Paquete\s+/i,"").trim();
  }
  // Alias explícitos de artículos DRS documentados; solo consulta.
  // Las cantidades de los paquetes se conservan intactas en el inventario.
  function claveEquipoDRS(nombre){
    var clave=normalizar(limpiar(nombre));
    var sinonimos={
      "racion":"racion de alimento",
      "raciones":"racion de alimento",
      "racion de alimentos":"racion de alimento",
      "dos raciones de alimento":"racion de alimento",
      "dos raciones de alimentos":"racion de alimento",
      "tres raciones":"racion de alimento",
      "tres raciones de alimento":"racion de alimento",
      "tres raciones de alimentos":"racion de alimento",
      "libro de conjuros en blanco":"libro de conjuros",
      "libro de conjuros (en blanco)":"libro de conjuros"
    };
    return sinonimos[clave]||clave;
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
          anotar(n,"Talento",sistema,"Especie: "+par[0],
            {grupo:"talento",descripcion:obj.talentos_descripcion?.[n]||""});
        });
        (obj.talentos_elegir||[]).forEach(function(n){
          anotar(n,"Talento",sistema,"Especie: "+par[0],
            {grupo:"talento",descripcion:obj.talentos_descripcion?.[n]||""});
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
          anotar(n,"Talento",sistema,"Ocupación: "+par[0],
            {grupo:"talento",descripcion:obj.talentos_descripcion?.[n]||""});
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
        if(x.categoria)detalles.push(["Categoría",String(x.categoria)]);
        if(x.impetu!=null)detalles.push(["Ímpetu",String(x.impetu)]);
        if(x.atributo)detalles.push(["Atributo",String(x.atributo)]);
        if(x.complejidad!=null)detalles.push(["Complejidad",String(x.complejidad)]);
        if(x.nivel!=null)detalles.push(["Nivel",String(x.nivel)]);
        if(x.requisito)detalles.push(["Requisito",x.requisito]);
        if(x.coste)detalles.push(["Coste",x.coste]);
        if(x.min_nivel)detalles.push(["Nivel mínimo",String(x.min_nivel)]);
        if(x.origen)detalles.push(["Origen",x.origen]);
        anotar(x.nombre,tipo,sistema,x.fuente,{id:x.id||null,datos:detalles,
          descripcion:x.descripcion||x.efecto||"",grupo:tipo==="Talento"?"talento":"poder",
          drs_publico:(tipo==="Conjuro"&&fuentes.alcanceDRS?.drs?.conjuros?.some(function(y){
            return y.id===x.id;
          }))||x.fuente==="Naufragio d20 DRS"});
      });
    }
    function equipo(lista,sistema,moneda,fuente,tipo,categoriaGrupo){
      (lista||[]).forEach(function(x){
        var detalles=[];
        if(Number.isFinite(Number(x.precio)))
          detalles.push([x.servicio_por_dia?"Precio por día":"Precio",x.precio+" "+moneda]);
        if(x.precio_variable)detalles.push(["Precio variable",x.precio_variable]);
        if(x.precio_editorial)detalles.push(["Precio autoral",x.precio_editorial]);
        if(x.movimiento)detalles.push(["Movimiento",String(x.movimiento)]);
        // El grupo procede de la tabla del catálogo. Tipo y grupo se presentan
        // juntos cuando «ligera», por ejemplo, sería ambiguo fuera de contexto.
        var clases={una_mano:"de una mano",dos_manos:"de dos manos",
          distancia:"a distancia",ligera:"ligera",tela:"de tela",
          intermedia:"intermedia",pesada:"pesada",varita:"Varita"};
        var base=x.tipo||x.categoria||"";
        var categoriaObjeto=base?(base==="varita"?"Varita":
          categoriaGrupo==="armas"?"Arma "+(clases[base]||base):
          categoriaGrupo==="armaduras"?"Armadura "+(clases[base]||base):
          clases[base]||base):categoriaGrupo||"";
        if(categoriaObjeto)detalles.push(["Categoría",categoriaObjeto]);
        // Transcripción directa de las tablas de Equipo del DRS:
        // presentar atributos solo cuando la fuente declara el campo.
        // Cero en Penetración y «-» en Durabilidad son valores válidos.
        if(x.dano!=null)detalles.push(["Daño",String(x.dano)]);
        if(x.blindaje!=null)detalles.push(["Blindaje",String(x.blindaje)]);
        if(x.penetracion!=null)detalles.push(["Penetración",String(x.penetracion)]);
        if(x.alcance)detalles.push(["Alcance",String(x.alcance)]);
        if(x.arrojadiza_alcance)detalles.push(["Alcance arrojadizo",String(x.arrojadiza_alcance)]);
        if(Object.prototype.hasOwnProperty.call(x,"durabilidad"))
          detalles.push(["Durabilidad",x.durabilidad==null||x.durabilidad==="-"?"—":String(x.durabilidad)]);
        if(x.du)detalles.push(["Dado de Uso","DU "+x.du]);
        if(x.municion_du)detalles.push(["Munición","DU "+x.municion_du]);
        else if(x.municion)detalles.push(["Munición",x.municion]);
        if(x.contenido)detalles.push(["Contenido",x.contenido]);
        anotar(x.nombre,tipo||"Objeto",sistema,fuente,{datos:detalles,
          descripcion:x.descripcion||x.detalle||"",grupo:"equipo",
          categoria_objeto:categoriaObjeto||null,
          familia_objeto:categoriaGrupo||"otro"});
      });
    }
    especies(fuentes.fantasia?.especies,"nd20");
    ocupaciones(fuentes.fantasia?.ocupaciones,"nd20");
    especies(fuentes.cifi?.especies,"nd20_cifi");
    ocupaciones(fuentes.cifi?.ocupaciones,"nd20_cifi");
    especies(fuentes.nocturna?.especies,"nd20_nocturna");
    ocupaciones(fuentes.nocturna?.ocupaciones,"nd20_nocturna");
    // Los Estilos de gladiatoria pertenecen a un suplemento: no incluir
    // ni sus fichas emergentes cuando el catálogo público solo contiene DRS.
    if(fuentes.fantasia?.ocupaciones?.Gladiador){
      ["Cestus","Dimacaero","Murmillo","Retiario","Secutor","Veles"].forEach(function(n){
        anotar(n,"Estilo de gladiatoria","nd20","NaufragioD20 — Ocupaciones · Gladiador",
          {grupo:"talento",datos:[["Obtención","Nivel 1, 12 o 24"]]});
      });
    }
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
    var familias={armas:"Arma",municion:"Munición",armaduras:"Armadura",
      escudos:"Escudo",paquetes:"Paquete"};
    ["armas","municion","armaduras","escudos","paquetes"].forEach(function(k){
      equipo(eq[k],"nd20","mo","Naufragio d20 DRS",
        k==="paquetes"?"Paquete":"Objeto",k==="armas"||k==="armaduras"?k:familias[k]);
    });
    var gruposUtiles={iluminacion:"Iluminación",aventura:"Útil de aventura",campamento:"Campamento",
      ropa:"Ropa",instrumentos:"Instrumentos",objetos_varios:"Objetos varios",
      monturas:"Monturas",equipo_monturas:"Equipo de monturas",
      vehiculos:"Vagones y diligencias",
      consumibles:"Consumible",herramientas:"Herramienta",escritura:"Escritura"};
    Object.entries(eq.utiles_fantasia||{}).forEach(function(par){
      var tipo=par[0]==="monturas"?"Montura":
        par[0]==="vehiculos"?"Vehículo":"Objeto";
      equipo(par[1],"nd20","mo","Naufragio d20 DRS · Herramientas",
        tipo,gruposUtiles[par[0]]||null);
    });
    equipo(eq.focos_conjuros_con_precio,"nd20","mo",
      "Naufragio d20 DRS · Focos","Objeto","Foco de conjuro");
    equipo(eq.varitas_defensa,"nd20","mo",
      "Naufragio d20 DRS · Varitas","Objeto","varitas");
    // Los lotes DRS contienen objetos por nombre libre. Donde el catálogo
    // no dispone de una ficha individual, registrar solo su procedencia;
    // jamás atribuir precio, mecánica o descripción al objeto suelto.
    var porObjetoPaquete=new Map();
    // Solo cinco glosas editoriales autorizadas para componentes que ya
    // existen en los paquetes DRS; nunca constituyen artículos de venta.
    var glosasPaquete=new Map();
    (eq.componentes_paquetes_editoriales||[]).forEach(function(x){
      var key=normalizar(x.nombre);
      if(!key||glosasPaquete.has(key)||!x.descripcion_editorial||
         Object.hasOwn(x,'precio'))
        throw Error('Glosa de paquete no válida: '+x.nombre);
      glosasPaquete.set(key,x);
    });
    (eq.paquetes||[]).forEach(function(paquete){
      String(paquete.contenido||"").split(";").map(function(x){return limpiar(x.trim());})
        .filter(Boolean).forEach(function(item){
          var key=normalizar(item);
          if(!porObjetoPaquete.has(key))
            porObjetoPaquete.set(key,{nombre:item,paquetes:[]});
          var registro=porObjetoPaquete.get(key);
          if(!registro.paquetes.includes(paquete.nombre))
            registro.paquetes.push(paquete.nombre);
        });
    });
    var glosasAplicadas=new Set();
    porObjetoPaquete.forEach(function(item,key){
      if(mapa.has(claveEquipoDRS(item.nombre)))return; // Preferir ficha DRS real.
      var titulo=item.nombre.replace(/^./,function(x){return x.toLocaleUpperCase("es");});
      var glosa=glosasPaquete.get(key);
      var datos=[["Incluido en",item.paquetes.join(", ")]];
      if(glosa){
        glosasAplicadas.add(key);
        if(glosa.du)datos.push(["Dado de Uso","DU "+glosa.du]);
      }
      anotar(titulo,"Objeto","nd20","Naufragio d20 DRS · Paquetes de equipo",
        {grupo:"equipo",datos:datos,
          descripcion:glosa?.descripcion_editorial||"",
          categoria_objeto:glosa?"Útiles · Viaje y almacenaje":null,
          familia_objeto:glosa?"utiles":"otro",
          procedencia_glosa:glosa?.origen_descripcion||null});
    });
    if(glosasAplicadas.size!==glosasPaquete.size)
      throw Error("Glosas editoriales sin componente original en paquetes DRS");
    // 10 Técnicas de batalla: sus efectos literales están en el DRS,
    // no en la tabla nominal que alimenta las elecciones del generador.
    var tecnicas=fuentes.tecnicasDRS?.registros||[];
    if(fuentes.tecnicasDRS&&tecnicas.length!==10)throw Error("Se requieren exactamente 10 Técnicas DRS literales");
    tecnicas.forEach(function(ficha){
      var destino=(mapa.get(normalizar(ficha.nombre))||[]).find(function(x){
        return x.tipo==="Técnica"&&x.sistema==="nd20"&&x.fuente==="Naufragio d20 DRS";
      });
      if(!destino||!ficha.efecto_literal)
        throw Error("Técnica DRS sin efecto literal único: "+ficha.nombre);
      destino.descripcion=ficha.efecto_literal;
      destino.fuente_descripcion="NaufragioD20DRS.docx · Técnicas de batalla (literal cotejado)";
    });
    // Glosas del equipo solo amplían la descripción, no sus reglas.
    var glosasEquipo=fuentes.glosasEquipoDRS?.registros||[];
    if(fuentes.glosasEquipoDRS&&glosasEquipo.length!==111)throw Error("Catálogo de glosas de Equipo DRS incompleto");
    glosasEquipo.forEach(function(g){
      var destino=(mapa.get(normalizar(g.nombre))||[]).find(function(x){
        return x.grupo==="equipo"&&x.sistema==="nd20"&&
          /^Naufragio d20 DRS/.test(x.fuente);
      });
      if(!destino)throw Error("Equipo DRS sin ficha nominal: "+g.nombre);
      destino.descripcion=g.descripcion_editorial;
      destino.procedencia_glosa=g.procedencia;
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
        // Los campos talentos_descripcion proceden del perfil de Especie
        // u Ocupación y son más completos que algunas glosas abreviadas.
        // No sustituir el texto original si ya existe.
        if(!e.descripcion)e.descripcion=par[1].descripcion;
        if(par[1].tipo)e.tipo=par[1].tipo;
        if(par[1].activacion)e.datos.unshift(["Activación",par[1].activacion]);
        if(par[1].atributo)e.datos.push(["Atributo",par[1].atributo]);
        if(par[1].coste)e.datos.push(["Coste",par[1].coste]);
        if(par[1].alcance)e.datos.push(["Alcance",par[1].alcance]);
        if(!e.fuente_descripcion&&!e.fuente.startsWith("Especie: ")&&
           !e.fuente.startsWith("Ocupación: "))
          e.fuente_descripcion=par[1].fuente;
      });
    });
    /* Representación semántica de las 64 fichas DRS, sin cambiar un solo
     * carácter de los párrafos fuente ni calcular efectos. Por defecto
     * cada párrafo es un <p>; las seis enumeraciones cotejadas y la única
     * tabla del DRS disponen de agrupación explícita por ID e índice.
     * Si cambia la cantidad de párrafos, la presentación especial
     * se desactiva y recupera los párrafos sin perder texto. */
    var enumeracionesDRS={
      'conjuro-8':{cantidad:3,inicio:1,fin:2},   // Luz
      'conjuro-18':{cantidad:3,inicio:1,fin:2},  // Ilusión
      'conjuro-19':{cantidad:3,inicio:1,fin:2},  // Resistir los elementos
      'conjuro-45':{cantidad:6,inicio:1,fin:4},  // Forja arcana
      'conjuro-51':{cantidad:4,inicio:2,fin:3},  // Lluvia de estrellas
      'conjuro-61':{cantidad:3,inicio:1,fin:2}   // Palabra de Poder: Muerte
    };
    function bloquesConjuroDRS(ficha){
      var cuerpo=(ficha.parrafos||[]).filter(function(p){
        return !/^(?:Primer|Segundo|Tercer|Cuarto|Quinto|Sexto|Séptimo|Octavo) Círculo$/i.test(p)
          && !/^(?:Escuela|Alcance|Duración|Lanzamiento|Requisito):/i.test(p);
      });
      if(!cuerpo.length)return [];
      var bloques=[],enumeracion=enumeracionesDRS[ficha.id_catalogo];
      var tabla=ficha.id_catalogo==='conjuro-14'&&cuerpo.length===20&&
        cuerpo[2]==='Turno'&&cuerpo[3]==='Temperatura'&&cuerpo[4]==='Daño';
      for(var i=0;i<cuerpo.length;){
        if(tabla&&i===2){
          var filas=[];
          for(var fila=5;fila<20;fila+=3)filas.push(cuerpo.slice(fila,fila+3));
          bloques.push({tipo:'tabla',cabeceras:cuerpo.slice(2,5),filas:filas});
          i=20;
        }else if(enumeracion&&cuerpo.length===enumeracion.cantidad&&
                 i===enumeracion.inicio){
          bloques.push({tipo:'lista',elementos:cuerpo.slice(i,enumeracion.fin+1)});
          i=enumeracion.fin+1;
        }else{
          bloques.push({tipo:'parrafo',texto:cuerpo[i]});
          i++;
        }
      }
      return bloques;
    }
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
      destino.bloques_conjuro=bloquesConjuroDRS(ficha);
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
    // Solo los 24 vínculos base cotejados con NaufragioD20DRS.docx.
    // Se reemplaza la glosa resumida, no se altera el motor de juego.
    // Propietario imprescindible: dos Especies pueden compartir nombre.
    (fuentes.talentosDRS?.registros||[]).forEach(function(ficha){
      var fuente=ficha.tipo_origen+': '+ficha.propietario;
      var coincidentes=(mapa.get(normalizar(ficha.nombre))||[]).filter(function(x){
        return x.grupo==='talento'&&x.sistema==='nd20'&&x.fuente===fuente;
      });
      if(coincidentes.length!==1)
        throw Error('Talento DRS sin identidad inequívoca: '+fuente+' / '+ficha.nombre);
      var destino=coincidentes[0];
      destino.id=ficha.id;
      destino.titulo_literal=ficha.titulo||ficha.nombre;
      destino.descripcion=ficha.efecto_literal;
      destino.datos=[];
      if(ficha.activacion_literal)destino.datos.push(['Activación',ficha.activacion_literal]);
      if(ficha.atributo_literal)destino.datos.push(['Atributo',
        ficha.atributo_literal.replace(/^Atributo:\s*/,'')]);
      if(ficha.coste_literal)destino.datos.push(['Coste',
        ficha.coste_literal.replace(/^Coste:\s*/,'')]);
      destino.talento_drs_publico=true;
      destino.procedencia_tipo=ficha.tipo_origen;
      destino.procedencia_nombre=ficha.propietario;
      destino.referencia_documental=ficha.parrafos_documento.slice();
      destino.fuente_descripcion='NaufragioD20DRS.docx · '+
        ficha.tipo_origen+' '+ficha.propietario+' (texto cotejado)';
      if(!porId.has(ficha.id))porId.set(ficha.id,[]);
      porId.get(ficha.id).push(destino);
    });
    // Una categoría es un dato de clasificación, no una transcripción del efecto.
    // Solo se acepta la taxonomía de cinco valores de la hoja de trabajo;
    // los nueve Talentos de Ocupación deben coincidir con su etiqueta DRS.
    var categorias=["Acción","Especial","Mejora","Pasiva","Reacción"];
    var clasificaciones=fuentes.glosasTalentosDRS?.registros||[];
    if(fuentes.glosasTalentosDRS&&clasificaciones.length!==24)
      throw Error("Se requieren 24 clasificaciones DRS");
    clasificaciones.forEach(function(g){
      var x=(porId.get(g.id_talento)||[]).find(function(e){
        return e.talento_drs_publico&&e.nombre===g.nombre&&
          e.procedencia_tipo===g.tipo_origen&&
          e.procedencia_nombre===g.propietario;
      });
      if(!x||!categorias.includes(g.categoria)||!g.fuente_categoria)
        throw Error("Clasificación DRS inválida o sin procedencia: "+g.id_talento);
      var literal=(x.datos||[]).find(function(p){return p[0]==="Activación";});
      if(x.procedencia_tipo==="Ocupación"&&(!literal||literal[1]!==g.categoria))
        throw Error("Categoría de Ocupación contradice el DRS: "+g.id_talento);
      if(x.procedencia_tipo==="Especie"&&g.estado_categoria!=="propuesta_para_edicion_DRS")
        throw Error("No atribuir al DRS una etiqueta de Especie: "+g.id_talento);
      x.categoria_talento=g.categoria;
      x.fuente_categoria=g.fuente_categoria;
      x.estado_categoria=g.estado_categoria;
    });
    // Las aclaraciones son otra fuente editorial. Nunca reemplazar el efecto
    // literal del DRS, y nunca aplicarlas por nombre ni por homónimos.
    (fuentes.aclaracionesTalentosDRS?.registros||[]).forEach(function(a){
      var referencias=porId.get(a.id_talento)||[];
      var destino=referencias.find(function(x){
        return x.talento_drs_publico&&x.sistema==='nd20'&&
          x.procedencia_tipo===a.tipo_origen&&
          x.procedencia_nombre===a.propietario&&x.nombre===a.nombre;
      });
      if(referencias.length!==1||!destino||destino.aclaracion_autoral)
        throw Error('Aclaración autoral DRS sin Talento único: '+a.id_talento);
      if(!a.texto||!a.texto.trim()||
         fuentes.aclaracionesTalentosDRS.estado!=='aprobacion_autoral')
        throw Error('Aclaración autoral DRS sin aprobación: '+a.id_talento);
      destino.aclaracion_autoral={
        texto:a.texto,fecha:fuentes.aclaracionesTalentosDRS.fecha_aprobacion,
        fuente:fuentes.aclaracionesTalentosDRS.fuente
      };
    });
    return {mapa:mapa,porId:porId,total:total};
  }
  /* Presentación editorial de Poderes. Nunca deduce Tiradas ni asigna
   * DRS a todo Nd20: las fichas y el manifiesto autorizan cada dato.
   * Mantener las cadenas originales de Alcance/Duración sin reemplazarlas
   * por magnitudes de un Nivel concreto. */
  /* Talentos DRS: datos explícitos arriba y texto fuente íntegro.
   * Las palabras de los efectos no se interpretan como campos mecánicos. */
  function presentarTalento(info){
    if(!info||info.grupo!=='talento'||!info.talento_drs_publico)return null;
    var campos=(info.datos||[]).filter(function(par){
      return ['Activación','Atributo','Coste','Requisito','Nivel'].includes(par[0])&&
        !(par[0]==='Activación'&&par[1]===info.categoria_talento);
    });
    var procedencia=info.procedencia_tipo+' · '+info.procedencia_nombre;
    var referencia=info.referencia_documental||[];
    return {tipo:'Talento',nombre:info.titulo_literal||info.nombre,
      clasificacion:procedencia,categoria:info.categoria_talento||null,
      fuente_categoria:info.fuente_categoria||null,
      primarios:campos,tecnicos:referencia.length?
        [['Párrafos del DRS',referencia.join('–')]]:[],
      origen:'Naufragio d20 DRS',
      fuente:info.fuente_descripcion||info.fuente,
      aclaracion:info.aclaracion_autoral||null};
  }
  /* Equipamiento: categoría tomada del tipo de la tabla o del grupo
   * documentado. No implica una propiedad mecánica adicional. */
  function presentarEquipo(info){
    if(!info||info.grupo!=="equipo")return null;
    var datos=info.datos||[];
    var categoria=info.categoria_objeto||
      (datos.find(function(p){return p[0]==="Categoría";})||[])[1]||null;
    var primarios=datos.filter(function(p){return p[0]!=="Categoría";});
    return {tipo:info.tipo,nombre:info.nombre,categoria:categoria,
      familia:info.familia_objeto||"otro",primarios:primarios,tecnicos:[],
      origen:info.sistema==="nd20"?"Naufragio d20 DRS":info.sistema,
      fuente:info.fuente};
  }
  function presentarPoder(info){
    if(!info||info.grupo!=="poder")return null;
    var entradas=(info.datos||[]).map(function(p){return [String(p[0]),String(p[1])];});
    var clavesVistas=new Set();
    var campos=entradas.filter(function(p){
      // Para magnitudes de cabecera la primera procedencia documentada
      // prevalece: el DRS puede escribir «20 m» y el Tomo «20m».
      var exclusivo=["Alcance","Duración","Lanzamiento","Requisito"].includes(p[0]);
      var clave=exclusivo?p[0]:p[0]+"\u0000"+p[1];
      if(clavesVistas.has(clave))return false;
      clavesVistas.add(clave);return true;
    });
    function valor(nombre){
      var par=campos.find(function(p){return p[0]===nombre;});
      return par?par[1]:"";
    }
    var detallesCabecera=[];
    var escuelas=[],circulo=null;
    if(info.tipo==="Conjuro"){
      // Círculo y Escuelas ya proceden del catálogo; no se infieren del texto.
      escuelas=valor("Escuelas")?valor("Escuelas").split(/,\s*/).filter(Boolean):[];
      var numeroCirculo=Number(valor("Círculo"));
      if(Number.isInteger(numeroCirculo)&&numeroCirculo>=1&&numeroCirculo<=8)
        circulo=numeroCirculo;
    }else{
      if(valor("Categoría"))detallesCabecera.push(valor("Categoría"));
      if(valor("Ímpetu"))detallesCabecera.push("Ímpetu "+valor("Ímpetu"));
      if(valor("Complejidad"))detallesCabecera.push("Complejidad "+valor("Complejidad"));
    }
    var destacados=["Alcance","Duración","Tirada","Lanzamiento","Atributo",
      "Activación","Coste","Requisito","Nivel mínimo","Nivel"];
    var primarios=campos.filter(function(p){return destacados.includes(p[0]);});
    // Mostrar el dado de daño documentado en la consulta rápida.
    // No se tira ni se calcula daño; se respeta el único grupo de dados.
    if(info.tipo==="Conjuro"&&info.danioCompuesto?.dados_base){
      var literal=String(info.danioCompuesto.dados_base);
      var tipos=info.danioCompuesto.tipos||[];
      if(tipos.length)literal+=" ("+tipos.join(" e ")+")";
      if(!primarios.some(function(p){return p[0]==="Daño";}))
        primarios.push(["Daño",literal]);
    }
    var usados=new Set(["Círculo","Escuelas","Categoría","Ímpetu","Complejidad",
      "Origen"].concat(destacados));
    var tecnicos=campos.filter(function(p){return !usados.has(p[0]);});
    var origen=info.sistema==="nd20"?
      (info.drs_publico?"Naufragio d20 DRS":"Naufragio d20"):
      info.sistema==="nd20_cifi"?"Naufragio d20 CiFi":
      info.sistema==="nd20_nocturna"?"Naufragio d20 Nocturna":
      info.sistema==="dh"?"Dungeon Hack":
      valor("Origen")||info.sistema||"Origen no documentado";
    return {tipo:info.tipo,nombre:info.nombre,clasificacion:detallesCabecera.join(" · "),
      escuelas:escuelas,circulo:circulo,
      primarios:primarios,tecnicos:tecnicos,origen:origen,
      fuente:info.fuente_descripcion||info.fuente};
  }
  function buscar(ind,nombre,grupo,sistema,fuentePreferida){
    if(!ind||!nombre)return null;
    var circulo=(String(nombre).match(/\(C([1-8])\)/)||[])[1];
    var limpio=limpiar(nombre),clave=normalizar(limpio);
    var claveReal=grupo==="equipo"?claveEquipoDRS(limpio):clave;
    var lista=(ind.mapa.get(claveReal)||ind.mapa.get(clave)||[]).slice();
    if(circulo)lista=lista.filter(function(x){
      if(x.tipo!=="Conjuro")return true;
      return x.datos.some(function(d){return d[0]==="Círculo"&&String(d[1])===circulo;});
    });
    if(fuentePreferida){
      // Una procedencia explícita nunca se resuelve con otro homónimo.
      lista=lista.filter(function(x){return x.fuente===fuentePreferida;});
    }
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
    presentarPoder:presentarPoder,presentarTalento:presentarTalento,
    presentarEquipo:presentarEquipo,
    limpiar:limpiar,normalizar:normalizar};
});