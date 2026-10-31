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
  function compraInicial(ocupacion,nombre,juego,catalogo,presupuesto,rng,nivel,perfilEspecie){
    rng=rng||Math.random;
    var eq=[],notas=[],gasto=0;
    if(juego==="nd20_cifi")return compraCifi(nombre,catalogo,presupuesto,rng);
    if(juego!=="nd20")return {equipo:[],gastado:0,restante:null,
      notas:["Nocturna: no se genera equipo ni riqueza, por decisión editorial."]};
    if(!catalogo||!Number.isInteger(presupuesto)||presupuesto<0)
      throw Error("Falta la tabla DRS o el presupuesto inicial documentado.");
    // Competencias desbloqueadas en niveles futuros NO habilitan compras iniciales.
    nivel=Number(nivel)||1;
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
    function extraer(pool,limite){
      var viable=pool.filter(function(x){return x.precio<=presupuesto-gasto+1e-7&&x.precio<=limite;});
      if(!viable.length)return null;
      var elegido=viable[Math.floor(rng()*viable.length)];
      gasto=Math.round((gasto+elegido.precio)*100)/100;
      eq.push(elegido.nombre);
      return elegido;
    }
    var arma=extraer(armasPermitidas,Math.min(presupuesto*.4,60));
    extraer(armadurasPermitidas,Math.min(presupuesto*.35,100));
    if(arma&&arma.municion){
      var municion=catalogo.municion.find(function(x){return x.nombre===arma.municion;});
      if(municion)extraer([municion],presupuesto-gasto);
    }
    extraer(escudosPermitidos,Math.min(presupuesto*.2,15));
    var etiqueta=nombre==="Clérigo"?"Especial devotos":
      nombre==="Mago"?"Especial arcanistas":
      nombre==="Ladrón"?"Especial criminales":
      /Cazador|Celador|Druida|Bárbaro/.test(nombre)?"Especial exploración":"Especial mazmorras";
    var paquete=catalogo.paquetes.find(function(x){return x.nombre===etiqueta;});
    if(paquete&&paquete.precio<=presupuesto-gasto){
      extraer([paquete],presupuesto-gasto);
      eq[eq.length-1]="Paquete "+paquete.nombre+": "+paquete.contenido;
    }
    if(!arma)notas.push("No se ha asignado arma: no hay una opción inequívocamente competente y asequible en el catálogo DRS.");
    if(!armadurasPermitidas.length)
      notas.push("No se ha elegido armadura: competencia de protección ausente o no contrastada.");
    var restante=Math.round((presupuesto-gasto)*100)/100;
    if(restante<0)throw Error("La compra inicial supera la riqueza.");
    notas.push("Equipo DRS adquirido por "+gasto+" mo; presupuesto "+presupuesto+" mo; saldo "+restante+" mo.");
    return {equipo:eq,gastado:gasto,restante:restante,notas:notas};
  }
  return {compraInicial:compraInicial};
});