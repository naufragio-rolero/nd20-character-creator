/* Compras iniciales basadas en precios y competencias documentadas.
 * CiFi: capital 4d10 × 100 cr aprobado por el autor, aún pendiente de DRS. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioEquipment=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function normal(s){return String(s||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
  function compraCifi(nombre,catalogo,presupuesto,rng){
    var cifi=catalogo.cifi,perfil=cifi&&cifi.competencias[nombre];
    if(!perfil)throw Error("No existe una tabla de Competencias CiFi para "+nombre);
    // El capital 4d10 × 100 cr puede incorporar el bono opcional
    // de 4d10 cr por cada Nivel posterior al primero.
    if(!Number.isInteger(presupuesto)||presupuesto<400)
      throw Error("Capital CiFi incorrecto: se requiere al menos la riqueza inicial de creación.");
    var eq=[],notas=[],gastado=0;
    function comprar(opciones,porcentaje){
      var disponibles=opciones.filter(function(x){
        return x.precio<=presupuesto-gastado&&x.precio<=Math.round(presupuesto*porcentaje);
      });
      if(!disponibles.length)return null;
      var elegido=disponibles[Math.floor(rng()*disponibles.length)];
      gastado+=elegido.precio;eq.push(elegido.nombre);
      return elegido;
    }
    function permitidos(tipo){
      var nombres=new Set(perfil[tipo]||[]);
      return (cifi[tipo]||[]).filter(function(x){return nombres.has(x.nombre);});
    }
    var obsequio=catalogo.obsequios_cifi?.[nombre];
    if(obsequio&&obsequio.opciones?.length){
      var regalo=obsequio.opciones[Math.floor(rng()*obsequio.opciones.length)];
      eq.push(regalo+" (Armamento filosofal; gratuito)");
    }
    if(nombre==="Tecnópata")eq.push("Implante de Ordenador neuronal (inicial; gratuito)");
    var arma=comprar(permitidos("armas"),0.3);
    if(arma&&arma.municion){
      var mun=cifi.municion.find(function(x){return x.nombre===arma.municion;});
      if(mun&&mun.precio<=presupuesto-gastado){
        gastado+=mun.precio;eq.push(mun.nombre+" (DU "+mun.du+")");
      }else notas.push("Arma a distancia sin munición comprada: comprobar suministro.");
    }
    comprar(permitidos("protecciones"),0.24);
    comprar(permitidos("ddp"),0.1);
    // Sugerencias de compra, no lotes gratuitos ni equipo obligatorio del manual.
    ["Paquete de alimento","Morfesaco","Botiquín","Batería"].forEach(function(n){
      var x=cifi.utiles.find(function(y){return y.nombre===n;});
      if(x&&gastado+x.precio<=presupuesto){gastado+=x.precio;eq.push(x.nombre+(x.du?" (DU "+x.du+")":""));}
    });
    if(perfil.nota)notas.push(perfil.nota);
    if(!arma&&!obsequio)notas.push("Sin arma sugerida de compra: revisar Competencias y precios.");
    var restante=presupuesto-gastado;
    if(restante<0)throw Error("La propuesta CiFi supera el capital inicial.");
    notas.push("Compra CiFi propuesta: "+gastado+" cr de "+presupuesto+" cr; saldo "+restante+" cr.");
    notas.push("Capital inicial CiFi: 4d10 × 100 cr, decisión editorial pendiente de incorporarse al DRS.");
    return {equipo:eq,gastado:gastado,restante:restante,notas:notas};
  }
  // Una única fuente de Competencias para generación y edición posterior.
  function opcionesCompetencia(ocupacion,catalogo,nivel,perfilEspecie){
    // Competencias desbloqueadas en niveles futuros NO habilitan compras iniciales.
    nivel=Number(nivel)||1;
    var notas=[];
    var bajaEstatura=!!(perfilEspecie&&(perfilEspecie.talentos||[]).includes('Baja estatura'));
    var comp=(ocupacion.competencias||[]).filter(function(regla){
      var m=normal(regla).match(/a partir de nivel\s*(\d+)/);
      return !m||nivel>=Number(m[1]);
    });
    var armasPermitidas=[],armadurasPermitidas=[],escudosPermitidos=[];
    var explicitas=(ocupacion.armas||[]).map(normal);
    if(explicitas.length){
      armasPermitidas=catalogo.armas.filter(function(x){return explicitas.includes(normal(x.nombre));});
    }else{
      var a=normal(comp.slice(0,2).filter(function(v){return !/^no puedes/i.test(v);}).join(" "));
      var cualquier=/cualquier (tipo de )?arma(?!dura)/.test(a);
      var cuerpo=/cualquier arma cuerpo a cuerpo/.test(a);
      var una=/cualquier arma (cuerpo a cuerpo )?de una mano/.test(a);
      var ligera=/cualquier arma ligera|armas ligeras|arma ligera/.test(a);
      var distancia=/cualquier arma a distancia/.test(a);
      armasPermitidas=catalogo.armas.filter(function(w){
        var n=normal(w.nombre);
        if(/madera|hueso/.test(a) &&
          /cualquier arma/.test(a))return ["baston","clava","gran clava"].includes(n);
        if(cualquier||cuerpo&&(w.tipo!=="distancia")||
          una&&["ligera","una_mano"].includes(w.tipo)||
          ligera&&w.tipo==="ligera"||distancia&&w.tipo==="distancia")return true;
        if(w.tipo==="distancia"&&/arcos cortos|arco corto/.test(a)&&n==="arco corto")return true;
        if(w.tipo==="distancia"&&/arcos largos|arco largo/.test(a)&&n==="arco largo")return true;
        if(w.tipo==="distancia"&&/ballestas ligeras/.test(a)&&n==="ballesta ligera")return true;
        if(w.tipo==="distancia"&&/ballestas de mano/.test(a)&&n==="ballesta de mano")return true;
        if((w.tipo==="distancia")&&/cerbatanas|hondas/.test(a)&&
          (n==="cerbatana"&&/cerbatanas/.test(a)||n==="honda"&&/hondas/.test(a)))return true;
        var plurales={
          "daga":/dagas/,"clava":/clavas/,"baston":/bastones/,
          "lanza":/lanzas/,"espada corta":/espadas cortas/,
          "espada larga":/espadas largas|espadas(?! cortas)/,
          "espada ropera":/espadas roperas|floretes|estoques/,
          "maza":/mazas/,"martillo ligero":/martillos ligeros/,
          "guadana":/guadanas/,"latigo":/latigos/,"guantelete armado":/guanteletes armados/,
          "tridente":/tridentes/,"cimitarra":/cimitarras/,"gran clava":/grandes clavas/
        };
        return plurales[n]&&plurales[n].test(a);
      });
    }
    // Varitas de defensa: el DRS las considera una excepción explícita
    // incluso para quien es competente con cualquier arma (Guerrero).
    // Solo se ofrecen si la Ocupación declara la competencia, como el Mago,
    // o la desbloquea a partir de Nivel 6, como el Ladrón.
    var varitasHabilitadas=comp.some(function(regla){
      return /varitas/i.test(regla)&&
        !/no puedes|no puede|no es competente/i.test(regla);
    });
    if(varitasHabilitadas){
      armasPermitidas=armasPermitidas.concat(catalogo.varitas_defensa||[]);
    }
    var armadurasExplicitas=(ocupacion.armaduras||[]).map(normal);
    if(armadurasExplicitas.length){
      armadurasPermitidas=catalogo.armaduras.filter(function(x){return armadurasExplicitas.includes(normal(x.nombre));});
    }else{
      var pro=normal(comp.filter(function(v){return /armadura|proteccion|ropa|tunica/i.test(v) && !/no puedes equipar|no puedes usar|no puede equipar/i.test(v);}).join(" "));
      var todas=/cualquier (tipo de )?armadura/.test(pro);
      var tela=/tela|ropa|tunica/.test(pro);
      var lig=/ligera/.test(pro);
      var inter=/intermedia|media/.test(pro);
      var pes=/pesada/.test(pro);
      armadurasPermitidas=catalogo.armaduras.filter(function(x){
        return (todas||x.tipo==="tela"&&tela||x.tipo==="ligera"&&lig||
          x.tipo==="intermedia"&&inter||x.tipo==="pesada"&&pes) &&
          (!/no sean de metal|hechas de cuero|hechas de madera|hechas de hueso/.test(pro)||
            !/mallas|cota|coraza/.test(normal(x.nombre)));
      });
      if(!armadurasPermitidas.length&&lig)armadurasPermitidas=catalogo.armaduras.filter(x=>x.tipo==="ligera");
    }
    // Algunas Ocupaciones base usan una lista inicial y desbloquean
    // protecciones adicionales por Nivel (Clérigo: pesadas a Nivel 12).
    // Se amplía la lista solo cuando una Competencia documentada ya está activa.
    var armorProgreso=normal(comp.filter(function(v){
      return /armadura/i.test(v)&&!/no puedes equipar|no puedes usar|no puede equipar/i.test(v);
    }).join(" "));
    if(/armaduras pesadas/.test(armorProgreso)){
      catalogo.armaduras.filter(function(x){return x.tipo==="pesada";}).forEach(function(x){
        if(!armadurasPermitidas.some(function(y){return y.nombre===x.nombre;}))
          armadurasPermitidas.push(x);
      });
    }
    var escudo=normal(comp.filter(function(v){return /escudo/i.test(v)&&!/no puedes|no puede|no puedes usar/i.test(v);}).join(" "));
    if(escudo){
      escudosPermitidos=catalogo.escudos.filter(function(x){
        var n=normal(x.nombre);
        return /cualquier (tipo de )?escudo/.test(escudo)||
          n==="escudo pequeño"&&/pequen/.test(escudo)||
          n==="escudo mediano"&&/median/.test(escudo)||
          n==="escudo grande"&&/grand/.test(escudo);
      });
    }
    // DRS / Baja estatura: decisión editorial de Forja (31/10/2026).
    // Las armas y armaduras del catálogo se ofrecen adaptadas a medianos y
    // gnomos sin modificar precio ni características. Siguen vigentes las
    // Competencias de Ocupación y la restricción de escudos pequeños.
    if(bajaEstatura){
      escudosPermitidos=escudosPermitidos.filter(function(x){
        return normal(x.nombre)==='escudo pequeno';
      });
      notas.push('Baja estatura: armas y armaduras del catálogo en versión adaptada al tamaño, sin modificar precio ni características; únicamente escudos pequeños; +1 a Tiradas de Esquiva contra ataques a distancia.');
    }
    return {armasPermitidas:armasPermitidas,armadurasPermitidas:armadurasPermitidas,
      escudosPermitidos:escudosPermitidos,varitasHabilitadas:varitasHabilitadas,
      bajaEstatura:bajaEstatura,notas:notas};
  }
  function compraInicial(ocupacion,nombre,juego,catalogo,presupuesto,rng,nivel,perfilEspecie){
    rng=rng||Math.random;
    var eq=[],notas=[],gasto=0;
    if(juego==="nd20_cifi")return compraCifi(nombre,catalogo,presupuesto,rng);
    if(juego!=="nd20")return {equipo:[],gastado:0,restante:null,
      notas:["Nocturna: no se genera equipo ni riqueza, por decisión editorial."]};
    if(!catalogo||!Number.isInteger(presupuesto)||presupuesto<0)
      throw Error("Falta la tabla DRS o el presupuesto inicial documentado.");
    var permitidas=opcionesCompetencia(ocupacion,catalogo,nivel,perfilEspecie);
    var armasPermitidas=permitidas.armasPermitidas,
      armadurasPermitidas=permitidas.armadurasPermitidas,
      escudosPermitidos=permitidas.escudosPermitidos,
      varitasHabilitadas=permitidas.varitasHabilitadas;
    notas.push.apply(notas,permitidas.notas);
    var comprasCambiables=[];
    function extraer(pool,limite,grupo){
      var viable=pool.filter(function(x){return x.precio<=presupuesto-gasto+1e-7&&x.precio<=limite;});
      if(!viable.length)return null;
      var elegido=viable[Math.floor(rng()*viable.length)];
      gasto=Math.round((gasto+elegido.precio)*100)/100;
      if(grupo)comprasCambiables.push({indice:eq.length,nombre:elegido.nombre,
        grupo:grupo==='armas'&&elegido.tipo==='varita'?'varitas_defensa':grupo,
        precio:elegido.precio,precio_inicial:elegido.precio,origen:'compra_inicial'});
      eq.push(elegido.nombre);
      return elegido;
    }
    // La propuesta automática para armas ordinarias mantenía un tope de
    // 60 mo. Las varitas oficiales cuestan 100 mo o más, así que cuando
    // estén autorizadas se amplía ese tope sin saltarse el 40% del capital.
    var arma=extraer(armasPermitidas,
      Math.min(presupuesto*.4,varitasHabilitadas?presupuesto:60),'armas');
    if(arma&&arma.tipo==="varita")
      notas.push("Varita de defensa: "+arma.nombre+
        " (Munición: DU "+arma.municion_du+
        "). Los ataques requieren una Tirada de Mente.");
    extraer(armadurasPermitidas,Math.min(presupuesto*.35,100),'armaduras');
    if(arma&&arma.municion){
      var municion=catalogo.municion.find(function(x){return x.nombre===arma.municion;});
      if(!municion||!extraer([municion],presupuesto-gasto))
        notas.push("Arma a distancia sin munición comprada: "+arma.nombre+
          " requiere "+arma.municion+". Comprobar suministro antes de utilizarla.");
    }
    extraer(escudosPermitidos,Math.min(presupuesto*.2,15),'escudos');
    var etiqueta=nombre==="Clérigo"?"Especial devotos":
      nombre==="Mago"?"Especial arcanistas":
      nombre==="Ladrón"?"Especial criminales":
      /Cazador|Celador|Druida|Bárbaro/.test(nombre)?"Especial exploración":"Especial mazmorras";
    var paquete=catalogo.paquetes.find(function(x){return x.nombre===etiqueta;});
    if(paquete&&paquete.precio<=presupuesto-gasto){
      // Una compra, un único precio; la ficha recibe cada objeto por separado.
      gasto=Math.round((gasto+paquete.precio)*100)/100;
      paquete.contenido.split(';').map(function(x){return x.trim();})
        .filter(Boolean).forEach(function(objeto){eq.push(objeto);});
    }
    if(!arma)notas.push("No se ha asignado arma: no hay una opción inequívocamente competente y asequible en el catálogo DRS.");
    if(!armadurasPermitidas.length)
      notas.push("No se ha elegido armadura: competencia de protección ausente o no contrastada.");
    var restante=Math.round((presupuesto-gasto)*100)/100;
    if(restante<0)throw Error("La compra inicial supera la riqueza.");
    notas.push("Equipo DRS adquirido por "+gasto+" mo; presupuesto "+presupuesto+" mo; saldo "+restante+" mo.");
    return {equipo:eq,gastado:gasto,restante:restante,notas:notas,
      compras_iniciales_intercambiables:comprasCambiables};
  }
  // Economía DRS: se opera en centésimas de moneda de oro (1 mc).
  // El catálogo puede mostrar "5 mc", pero nunca se pierde en redondeos.
  function centimos(precio){
    var n=precio;
    if(typeof n!=='number'||!Number.isFinite(n)||n<0||
       !Number.isSafeInteger(Math.round(n*100))||
       Math.abs(n*100-Math.round(n*100))>1e-7)
      throw Error('Precio no documentado o inferior a una moneda de cobre.');
    return Math.round(n*100);
  }
  function informacionEquipo(catalogo,ocupacion,nivel,especie){
    if(!catalogo||!ocupacion)throw Error('Faltan las Competencias DRS.');
    var posibles=opcionesCompetencia(ocupacion,catalogo,nivel,especie);
    var grupos=['armas','armaduras','escudos','varitas_defensa','municion'];
    var listas={armas:posibles.armasPermitidas,armaduras:posibles.armadurasPermitidas,
      escudos:posibles.escudosPermitidos,
      varitas_defensa:posibles.varitasHabilitadas?(catalogo.varitas_defensa||[]):[],
      municion:catalogo.municion||[]};
    var permitidos={};
    grupos.forEach(function(g){
      permitidos[g]=new Set(listas[g].map(function(x){return x.nombre;}));
    });
    // Distinguir uso sin Competencia y prohibiciones expresas del DRS.
    var prohibiciones=(ocupacion.competencias||[]).map(normal).filter(function(t){
      return /no puedes|no puede/.test(t);
    });
    var prohibeEscudo=prohibiciones.some(function(t){
      return /escudo/.test(t);
    });
    var prohibeDistancia=prohibiciones.some(function(t){
      return /armas a distancia|arma a distancia/.test(t);
    });
    var prohibeArrojadizas=prohibiciones.some(function(t){
      return /arrojadiz/.test(t);
    });
    var prohibeFilo=prohibiciones.some(function(t){
      return /con filo/.test(t);
    });
    var armadurasUnicamente=(ocupacion.competencias||[]).map(normal)
      .some(function(t){return /unicamente/.test(t)&&/armaduras/.test(t);});
    return grupos.flatMap(function(grupo){
      return (catalogo[grupo]||[]).filter(function(x){
        if(grupo==='escudos'&&prohibeEscudo)return false;
        if(grupo==='armaduras'&&armadurasUnicamente&&
           !permitidos.armaduras.has(x.nombre))return false;
        if(grupo==='armas'&&prohibeDistancia&&x.tipo==='distancia')return false;
        if(grupo==='armas'&&prohibeArrojadizas&&x.arrojadiza_alcance)return false;
        // El catálogo no etiqueta las armas con filo. Para una prohibición
        // expresa, acudir exclusivamente a la lista competente documentada.
        if(grupo==='armas'&&prohibeFilo&&!permitidos.armas.has(x.nombre))
          return false;
        // Baja estatura: únicamente escudos pequeños.
        return grupo!=='escudos'||!posibles.bajaEstatura||
          normal(x.nombre)==='escudo pequeno';
      }).filter(function(x){
        // Las varitas son una excepción: no se canalizan sin Competencia.
        return grupo!=='varitas_defensa'||permitidos[grupo].has(x.nombre);
      }).map(function(x){
        var competente=permitidos[grupo].has(x.nombre);
        var advertencia=competente||grupo==='municion'?null:
          grupo==='armaduras'?
          'Sin Competencia: Desventaja al utilizarla y en Tiradas de Fuerza, Agilidad y Resistencia mientras esté puesta.':
          'Sin Competencia: Desventaja en las Tiradas relacionadas con su uso.';
        return {grupo:grupo,nombre:x.nombre,precio:x.precio,
          precio_editorial:x.precio_editorial||null,
          competente:competente||grupo==='municion',advertencia:advertencia,
          municion:x.municion||null,du:x.du||x.municion_du||null};
      });
    });
  }
  function encontrarOpcion(opciones,grupo,nombre){
    var x=opciones.filter(function(o){return o.grupo===grupo&&o.nombre===nombre;});
    if(x.length!==1)throw Error('Artículo no disponible en el catálogo DRS: '+nombre);
    centimos(x[0].precio);
    return x[0];
  }
  function intercambiarEquipoInicial(personaje,catalogo,ocupacion,nivel,especie,seleccion){
    if(personaje?.juego!=='Naufragio d20 · Fantasía'||
       !Array.isArray(personaje.equipo)||!Array.isArray(personaje.compras_iniciales_intercambiables))
      throw Error('Solo puede intercambiarse equipo inicial registrado de Fantasía DRS.');
    var indice=seleccion?.indice;
    if(!Number.isInteger(indice)||indice<0)throw Error('Selecciona una pieza inicial válida.');
    var registros=personaje.compras_iniciales_intercambiables;
    var actuales=registros.filter(function(r){return r.indice===indice;});
    if(actuales.length!==1)throw Error('El objeto no procede de una compra inicial intercambiable.');
    var origen=actuales[0];
    if(origen.origen!=='compra_inicial'||personaje.equipo[indice]!==origen.nombre||
       !['armas','armaduras','escudos','varitas_defensa'].includes(origen.grupo))
      throw Error('El equipo original no coincide con la compra inicial.');
    var original=(catalogo[origen.grupo]||[]).filter(function(x){
      return x.nombre===origen.nombre;
    });
    if(original.length!==1||centimos(original[0].precio)!==centimos(origen.precio))
      throw Error('El valor reembolsable no coincide con el catálogo documentado.');
    var opciones=informacionEquipo(catalogo,ocupacion,nivel,especie);
    var nuevo=encontrarOpcion(opciones,seleccion.grupo,seleccion.nombre);
    var claseOrigen=['armas','varitas_defensa'].includes(origen.grupo)?'arma':origen.grupo;
    var claseNueva=['armas','varitas_defensa'].includes(nuevo.grupo)?'arma':nuevo.grupo;
    if(claseOrigen!==claseNueva)
      throw Error('Un intercambio debe mantener la clase de equipo original.');
    var saldo=centimos(personaje.saldo_mo),reembolso=centimos(origen.precio),
      coste=centimos(nuevo.precio);
    if(saldo+reembolso<coste)
      throw Error('Saldo insuficiente para intercambiar esta pieza inicial.');
    var inventario=personaje.equipo.slice();
    inventario[indice]=nuevo.nombre;
    var nuevosRegistros=registros.map(function(r){
      return r.indice!==indice?Object.assign({},r):Object.assign({},r,{
        nombre:nuevo.nombre,grupo:nuevo.grupo,precio:nuevo.precio
      });
    });
    return {equipo:inventario,compras_iniciales_intercambiables:nuevosRegistros,
      restante:(saldo+reembolso-coste)/100,reembolso:reembolso/100,
      coste:coste/100,diferencia:(coste-reembolso)/100,
      original:origen.nombre,nuevo:nuevo.nombre,advertencia:nuevo.advertencia};
  }
  function comprarArmamentoFantasia(personaje,catalogo,ocupacion,nivel,especie,seleccion){
    if(personaje?.juego!=='Naufragio d20 · Fantasía'||
       !Array.isArray(personaje.equipo)||!Array.isArray(seleccion))
      throw Error('Compra adicional solo disponible en Fantasía DRS.');
    var opciones=informacionEquipo(catalogo,ocupacion,nivel,especie),
      disponible=centimos(personaje.saldo_mo),total=0,objetos=[],detalles=[];
    seleccion.forEach(function(s){
      var cantidad=s.cantidad===undefined?1:s.cantidad;
      if(!Number.isInteger(cantidad)||cantidad<1||cantidad>99)
        throw Error('La cantidad debe estar entre 1 y 99.');
      var item=encontrarOpcion(opciones,s.grupo,s.nombre),
        importe=centimos(item.precio)*cantidad;
      if(importe>disponible-total)
        throw Error('La compra de armamento supera el saldo disponible.');
      total+=importe;
      objetos.push(item.nombre+(cantidad>1?' ×'+cantidad:''));
      detalles.push({nombre:item.nombre,grupo:item.grupo,cantidad:cantidad,
        precio_unitario:item.precio,subtotal:importe/100,advertencia:item.advertencia});
    });
    return {equipo:personaje.equipo.concat(objetos),gastado:total/100,
      restante:(disponible-total)/100,adquiridos:objetos,detalles:detalles};
  }
  // Consulta exacta del inventario de útiles del DRS, sin alterar la
  // compra automática existente ni conceder Objetos de forma gratuita.
  function consultarUtilFantasia(catalogo,id,nivel){
    if(!catalogo||!catalogo.utiles_fantasia||!id)
      throw Error("Falta el catálogo de útiles del DRS o el identificador de artículo.");
    var listas=Object.entries(catalogo.utiles_fantasia);
    listas.push(["focos",(catalogo.focos_conjuros_con_precio||[])]);
    var encontrados=[];
    listas.forEach(function(grupo){
      (grupo[1]||[]).forEach(function(x){
        if(x.id===id)encontrados.push({seccion:grupo[0],item:x});
      });
    });
    if(encontrados.length!==1)
      throw Error(encontrados.length?"Identificador duplicado de útil: "+id:
        "Útil no documentado en el DRS: "+id);
    var resultado=encontrados[0],x=resultado.item,precio=x.precio;
    if(x.servicio_por_dia)
      throw Error("El servicio "+x.nombre+" no es un objeto de inventario comprable.");
    if(x.precio_variable)
      throw Error("El artículo "+x.nombre+" requiere precio variable documentado: "+x.precio_variable);
    if(x.precio_por_nivel!==undefined){
      if(!Number.isInteger(nivel)||nivel<1)
        throw Error("El artículo "+x.nombre+" requiere un Nivel positivo para calcular su precio.");
      precio=x.precio_por_nivel*nivel;
    }
    if(!Number.isFinite(precio)||precio<0)
      throw Error("Precio no verificable para el útil "+x.nombre);
    return {id:x.id,nombre:x.nombre,seccion:resultado.seccion,
      precio:Math.round(precio*100)/100,
      nivel:x.precio_por_nivel===undefined?null:nivel,
      du:x.du||null,detalle:x.detalle||""};
  }
  function compraUtilesFantasia(catalogo,presupuesto,seleccion){
    if(!Number.isFinite(presupuesto)||presupuesto<0||!Array.isArray(seleccion))
      throw Error("Presupuesto o selección de útiles incorrectos.");
    var gastado=0,equipo=[],detalles=[];
    seleccion.forEach(function(s){
      var cantidad=s.cantidad===undefined?1:s.cantidad;
      if(!Number.isInteger(cantidad)||cantidad<1)
        throw Error("Cantidad incorrecta para un artículo del DRS.");
      var item=consultarUtilFantasia(catalogo,s.id,s.nivel);
      var subtotal=Math.round(item.precio*cantidad*100)/100;
      if(Math.round((gastado+subtotal)*100)/100>presupuesto+1e-7)
        throw Error("Compra de útiles supera el presupuesto disponible.");
      gastado=Math.round((gastado+subtotal)*100)/100;
      equipo.push(item.nombre+(item.nivel!==null?" (Nivel "+item.nivel+")":"")+
        (cantidad>1?" ×"+cantidad:""));
      detalles.push({id:item.id,nombre:item.nombre,nivel:item.nivel,
        cantidad:cantidad,precio_unitario:item.precio,subtotal:subtotal});
    });
    return {equipo:equipo,detalles:detalles,gastado:gastado,
      restante:Math.round((presupuesto-gastado)*100)/100};
  }
  // Daño visible: solo armas y varitas poseídas, con valor literal DRS.
  // Equipar selecciona una referencia; no ejecuta ataques ni consume munición.
  function armasDisponibles(personaje,catalogo){
    var inventario=Array.isArray(personaje?.equipo)?personaje.equipo:[];
    var referencias=new Set(inventario.map(function(v){
      return String(v).replace(/\s+×\d+$/,'').trim();
    }));
    var nombres=new Set();
    return [['armas',catalogo?.armas],['varitas_defensa',catalogo?.varitas_defensa]]
      .flatMap(function(g){
        return (g[1]||[]).filter(function(item){
          if(!referencias.has(item.nombre)||!item.dano||nombres.has(item.nombre))
            return false;
          nombres.add(item.nombre);
          return true;
        }).map(function(item){
          return {nombre:item.nombre,dano:item.dano,grupo:g[0],
            tipo:item.tipo,municion:item.municion||item.municion_du||null};
        });
      });
  }
  function danoFicha(personaje,catalogo){
    var nombre=String(personaje?.arma_equipada||'');
    var arma=armasDisponibles(personaje,catalogo).find(function(x){
      return x.nombre===nombre;
    });
    return arma?{valor:arma.dano,arma:arma.nombre,grupo:arma.grupo}:
      {valor:'—',arma:null,grupo:null};
  }
  // Solo inventario ya adquirido: poseer una protección no equivale
  // a llevarla puesta. No se equipan piezas de manera automática.
  function proteccionesDisponibles(personaje,catalogo){
    var nombres=Array.isArray(personaje?.equipo)?personaje.equipo:[];
    function propias(lista){
      return (lista||[]).filter(function(item){
        return nombres.some(function(n){
          // Los útiles pueden incorporar cantidad. Nunca tomar una
          // coincidencia parcial ni un recuerdo por una pieza comprada.
          return n===item.nombre||n.startsWith(item.nombre+' ×');
        });
      });
    }
    return {armaduras:propias(catalogo?.armaduras),
      escudos:propias(catalogo?.escudos)};
  }
  // Solo se muestra el dado de la armadura explícitamente equipada.
  // Los escudos NO se suman al Blindaje permanente: +1 solo al bloquear
  // según la regla DRS. Una protección natural requiere fuente documental
  // explícita y no se infiere a partir de Especies o Talentos.
  function blindajeFicha(personaje,catalogo){
    var disponibles=proteccionesDisponibles(personaje,catalogo);
    var activas=personaje?.protecciones_equipadas||{};
    var armadura=disponibles.armaduras.find(function(x){return x.nombre===activas.armadura;})||null;
    var escudo=disponibles.escudos.find(function(x){return x.nombre===activas.escudo;})||null;
    var natural=personaje?.blindaje_natural_fuente&&
      personaje.blindaje_natural!==undefined&&personaje.blindaje_natural!==null?
      String(personaje.blindaje_natural):null;
    return {valor:armadura&&armadura.blindaje!=null?String(armadura.blindaje):
        natural||'Sin armadura',
      armadura:armadura?armadura.nombre:null,
      escudo:escudo?escudo.nombre:null,
      bonoEscudo:escudo&&escudo.blindaje!=null?String(escudo.blindaje):null,
      natural:natural?personaje.blindaje_natural_fuente:null};
  }
  // Consulta autoral de la armadura equina: precio humano ×4.
  // No habilita compras ni altera Inventario, Blindaje o Movimiento.
  function consultarPreciosArmaduraEquina(catalogo){
    var equina=catalogo?.utiles_fantasia?.equipo_monturas?.find(function(x){
      return x.id==='montura-armadura-equina';
    });
    var regla=equina?.regla_precio_autoral;
    if(!regla||regla.estado!=='aprobacion_autoral'||
       regla.catalogo_base!=='data/equipo-inicial.json · armaduras'||
       regla.multiplicador!==4||equina.precio!==undefined)
      throw Error('No hay regla autoral válida de precio de armadura equina.');
    var armaduras=catalogo.armaduras;
    if(!Array.isArray(armaduras)||armaduras.length!==14)
      throw Error('El catálogo DRS debe contener catorce armaduras humanas.');
    var nombres=new Set();
    return armaduras.map(function(a){
      var nombre=String(a.nombre||'').trim();
      var centimos=Number(a.precio)*100;
      if(!nombre||nombres.has(nombre)||!Number.isFinite(centimos)||
         centimos<0||Math.abs(centimos-Math.round(centimos))>1e-7)
        throw Error('Armadura humana sin precio DRS válido: '+nombre);
      nombres.add(nombre);
      return {nombre:nombre,precio_base:a.precio,
        precio_equino:Math.round(centimos)*regla.multiplicador/100};
    });
  }
  return {compraInicial:compraInicial,consultarUtilFantasia:consultarUtilFantasia,
    compraUtilesFantasia:compraUtilesFantasia,
    informacionEquipo:informacionEquipo,
    intercambiarEquipoInicial:intercambiarEquipoInicial,
    comprarArmamentoFantasia:comprarArmamentoFantasia,
    consultarPreciosArmaduraEquina:consultarPreciosArmaduraEquina,
    armasDisponibles:armasDisponibles,danoFicha:danoFicha,
    proteccionesDisponibles:proteccionesDisponibles,blindajeFicha:blindajeFicha};
});