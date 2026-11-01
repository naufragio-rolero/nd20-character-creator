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
      .replace(/\s+\(Nivel\s+\d+\)/gi,"")
      .replace(/\s+×\d+$/,"")
      .replace(/^Recuerdo:\s*/i,"")
      .replace(/^Objeto mágico:\s*/i,"")
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
          anotar(n,"Talento",sistema,"Especie: "+par[0],
            {grupo:"talento",descripcion:obj.talentos_descripcion?.[n]||""});
        });
        (obj.talentos_elegir||[]).forEach(function(n){
          anotar(n,"Talento",sistema,"Especie: "+par[0],
            {grupo:"talento",descripcion:obj.talentos_descripcion?.[n]||""});
        });
        (obj.objetos_emocionales||[]).forEach(function(n){
          anotar(n,"Recuerdo personal",sistema,"Especie: "+par[0],{
            grupo:"equipo",clase_equipo:"narrativo",
            categoria_equipo:"Recuerdo de Especie",descripcion:"",
            fuente_descripcion:"data/especies.json · Recuerdos de "+par[0]
          });
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
    // Datos DRS de consulta: la compra y el inventario permanecen intactos.
    // No convertir una Competencia de Ocupación en requisito de un artículo.
    function equipo(lista,sistema,moneda,fuente,clase,categoria){
      (lista||[]).forEach(function(x){
        var datos=[];
        function campo(etiqueta,valor){
          if(valor!==undefined&&valor!==null&&valor!=="")
            datos.push([etiqueta,String(valor)]);
        }
        if(x.precio!==undefined&&x.precio!==null)
          campo("Precio",x.precio+" "+moneda);
        if(x.precio_por_nivel!==undefined)
          campo("Precio",x.precio_por_nivel+" "+moneda+" × Nivel");
        campo("Daño",x.dano);
        campo("Penetración",x.penetracion);
        campo("Blindaje",x.blindaje);
        campo("Alcance",x.alcance);
        campo("Durabilidad",x.durabilidad);
        if(x.du)campo("Dado de Uso","DU "+x.du);
        campo("Munición",x.municion);
        if(x.municion_du)campo("DU de munición","DU "+x.municion_du);
        campo("Proyectiles por Turno",x.proyectiles_por_turno);
        if(x.no_mover_y_disparar)campo("Restricción","No moverse y disparar");
        if(x.escuelas?.length)campo("Escuelas",x.escuelas.join(", "));
        campo("Requisito",x.requisito);
        if(x.contenido)campo("Contenido",x.contenido);
        var tecnicos=[];
        if(x.id)tecnicos.push(["Identificador DRS",x.id]);
        if(x.nombre_original_drs)
          tecnicos.push(["Nombre en el DRS",x.nombre_original_drs]);
        if(x.nombre==="Dardo"&&sistema==="nd20"&&clase==="arma")
          tecnicos.push(["Precio 0 mo","Decisión autoral 31/10/2026; no precio literal del DRS"]);
        anotar(x.nombre,clase==="magico"?"Objeto mágico":
          clase==="arma"?"Arma":clase==="proteccion"?"Protección":
          clase==="escudo"?"Escudo":clase==="municion"?"Munición":
          clase==="foco"?"Foco de conjuros":clase==="paquete"?"Paquete":
          "Equipo",sistema,fuente,{
            id:x.id||null,grupo:"equipo",clase_equipo:clase,
            categoria_equipo:[categoria,x.tipo?.replace(/_/g," ")||x.categoria]
              .filter(Boolean).join(" · "),
            datos:datos,tecnicos_equipo:tecnicos,
            precio_por_nivel:x.precio_por_nivel,
            descripcion:x.descripcion||x.detalle||"",
            fuente_descripcion:x.nombre==="Dardo"&&sistema==="nd20"&&clase==="arma"?
              fuente+" · Precio 0 mo: decisión autoral del 31/10/2026":
              x.nombre_original_drs?
                fuente+" · Nombre visible: decisión editorial del 31/10/2026":
                fuente
          });
      });
    }
    // Las fichas mágicas proceden de extracciones literales 65a–65e.
    // Inyectarlas NO las publica: app.js no carga estos borradores.
    function indexarObjetosMagicos(documentos){
      (documentos||[]).forEach(function(doc){
        function agregar(ficha,ejemplo){
          if(!ficha||!ficha.nombre||!Array.isArray(ficha.texto_original))return;
          var tipo=String(ficha.tipo_literal||"").replace(/^Tipo:\s*/,"");
          var rareza=String(ficha.rareza_literal||"").replace(/^Rareza:\s*/,"");
          var texto=ejemplo&&ficha.correccion_editorial_aprobada?.efecto_vigente_literal||
            ficha.texto_original.join("\n\n").trim();
          anotar(ficha.nombre,"Objeto mágico","nd20",
            "NaufragioD20 — Objetos mágicos.docx · "+(ejemplo?"Ejemplo de apéndice":doc.seccion),{
              grupo:"equipo",clase_equipo:"magico",categoria_equipo:tipo,
              rareza_equipo:rareza,descripcion:texto,datos:[],
              tecnicos_equipo:[["Párrafos de la fuente",
                (ficha.parrafos_fuente||[]).join("–")],
                ...(ejemplo?[["Naturaleza","Ejemplo del apéndice; no forma parte de los 28 objetos principales"]]:[])],
              fuente_descripcion:"NaufragioD20 — Objetos mágicos.docx · "+
                (ejemplo?"Ejemplo del apéndice":doc.seccion)
            });
        }
        (doc.registros||[]).forEach(function(f){agregar(f,false);});
        if(doc.ejemplo_apendice)agregar(doc.ejemplo_apendice,true);
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
    [["armas","arma","Armas"],["municion","municion","Munición"],
      ["armaduras","proteccion","Armaduras"],["escudos","escudo","Escudos"],
      ["varitas_defensa","arma","Varitas de defensa"],
      ["paquetes","paquete","Paquetes"]].forEach(function(p){
      equipo(eq[p[0]],"nd20","mo","NaufragioD20DRS.docx · Equipo · "+p[2],
        p[1],p[2]);
    });
    Object.entries(eq.utiles_fantasia||{}).forEach(function(par){
      equipo(par[1],"nd20","mo","NaufragioD20DRS.docx · Equipo · "+
        par[0],"util","Útiles · "+par[0]);
    });
    equipo(eq.focos_conjuros_con_precio,"nd20","mo",
      "NaufragioD20DRS.docx · Equipo · Focos de conjuros",
      "foco","Focos de conjuros");
    ["armas","municion","protecciones","ddp","utiles"].forEach(function(k){
      equipo((eq.cifi||{})[k],"nd20_cifi","cr",
        "NaufragioD20CiFi.docx · Equipo · "+k,"comun",k);
    });
    indexarObjetosMagicos(fuentes.objetosMagicos);
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
      return ['Activación','Atributo','Coste','Requisito','Nivel'].includes(par[0]);
    });
    var procedencia=info.procedencia_tipo+' · '+info.procedencia_nombre;
    var referencia=info.referencia_documental||[];
    return {tipo:'Talento',nombre:info.titulo_literal||info.nombre,
      clasificacion:procedencia,primarios:campos,tecnicos:referencia.length?
        [['Párrafos del DRS',referencia.join('–')]]:[],
      origen:'Naufragio d20 DRS',
      fuente:info.fuente_descripcion||info.fuente,
      aclaracion:info.aclaracion_autoral||null};
  }
  function presentarPoder(info){
    if(!info||info.grupo!=="poder")return null;
    var entradas=(info.datos||[]).map(function(p){return [String(p[0]),String(p[1])];});
    var clavesVistas=new Set();
    var campos=entradas.filter(function(p){
      var clave=p[0]+"\u0000"+p[1];
      if(clavesVistas.has(clave))return false;
      clavesVistas.add(clave);return true;
    });
    function valor(nombre){
      var par=campos.find(function(p){return p[0]===nombre;});
      return par?par[1]:"";
    }
    var detallesCabecera=[];
    if(info.tipo==="Conjuro"){
      if(valor("Escuelas"))detallesCabecera.push(valor("Escuelas"));
      var circulo=valor("Círculo");
      if(circulo){
        var ordinal=(circulo==="1"||circulo==="3")?circulo+".er":circulo+".º";
        detallesCabecera.push(ordinal+" Círculo");
      }
    }else{
      if(valor("Categoría"))detallesCabecera.push(valor("Categoría"));
      if(valor("Ímpetu"))detallesCabecera.push("Ímpetu "+valor("Ímpetu"));
      if(valor("Complejidad"))detallesCabecera.push("Complejidad "+valor("Complejidad"));
    }
    var destacados=["Alcance","Duración","Tirada","Lanzamiento","Atributo",
      "Activación","Coste","Requisito","Nivel mínimo","Nivel"];
    var primarios=campos.filter(function(p){return destacados.includes(p[0]);});
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
      primarios:primarios,tecnicos:tecnicos,origen:origen,
      fuente:info.fuente_descripcion||info.fuente};
  }
  // Presentación de consulta, sin inferencias de Competencia ni uso automático.
  function presentarEquipo(info,nombreInventario){
    if(!info||info.grupo!=="equipo")return null;
    var clase=info.clase_equipo||"comun";
    var esRecuerdo=clase==="narrativo";
    var tipo=esRecuerdo?"Recuerdo personal":clase==="magico"?"Objeto mágico":
      info.tipo||"Equipo";
    var principales=(info.datos||[]).filter(function(p){
      return !["Contenido"].includes(p[0]);
    }).map(function(p){return [String(p[0]),String(p[1])];});
    var nivel=String(nombreInventario||"").match(/\(Nivel\s+(\d+)\)/i);
    if(nivel&&info.precio_por_nivel!==undefined&&Number(nivel[1])>=1){
      principales=principales.map(function(p){
        return p[0]==="Precio"?["Precio",
          (Number(info.precio_por_nivel)*Number(nivel[1]))+" mo (Nivel "+nivel[1]+")"]:p;
      });
    }
    var tecnicos=(info.tecnicos_equipo||[]).concat(
      (info.datos||[]).filter(function(p){return p[0]==="Contenido";}));
    var categoria=esRecuerdo?"Recuerdo de Especie":
      [info.categoria_equipo,info.rareza_equipo].filter(Boolean).join(" · ");
    return {tipo:tipo,nombre:info.nombre,clasificacion:categoria,
      primarios:esRecuerdo?[]:principales,
      tecnicos:esRecuerdo?[]:tecnicos,
      origen:esRecuerdo?"Personaje · Recuerdo personal":
        info.sistema==="nd20"?(clase==="magico"?
          "Naufragio d20 · Objetos mágicos (borrador no publicado)":
          "Naufragio d20 DRS"):
        info.sistema==="nd20_cifi"?"Naufragio d20 CiFi":
        info.sistema||"No documentado",
      fuente:info.fuente_descripcion||info.fuente};
  }
  function buscar(ind,nombre,grupo,sistema,fuentePreferida){
    if(!ind||!nombre)return null;
    var circulo=(String(nombre).match(/\(C([1-8])\)/)||[])[1];
    var limpio=limpiar(nombre),lista=(ind.mapa.get(normalizar(limpio))||[]).slice();
    if(circulo)lista=lista.filter(function(x){
      if(x.tipo!=="Conjuro")return true;
      return x.datos.some(function(d){return d[0]==="Círculo"&&String(d[1])===circulo;});
    });
    if(fuentePreferida){
      // Una procedencia explícita nunca se resuelve con otro homónimo.
      lista=lista.filter(function(x){return x.fuente===fuentePreferida;});
    }
    if(grupo==="equipo"){
      var esRecuerdo=/^Recuerdo:\s*/i.test(String(nombre));
      var esMagico=/^Objeto mágico:\s*/i.test(String(nombre));
      if(esRecuerdo)lista=lista.filter(function(x){return x.clase_equipo==="narrativo";});
      else if(esMagico)lista=lista.filter(function(x){return x.clase_equipo==="magico";});
      else lista=lista.filter(function(x){return x.clase_equipo!=="narrativo";});
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
      if(tipo==="equipo"&&x.clase_equipo==="magico")n+=4;
      if(tipo==="equipo"&&x.clase_equipo==="narrativo")n-=15;
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