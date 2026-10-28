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
      avisos.push("Los Conjuros y Poderes sobrenaturales propios de Nocturna requieren progresiones adicionales aún no codificadas.");
      return {pasos:pasos,avisos:avisos,recursos:recursos,fuente:progresiones.fuentes.nocturna};
    }
    if(!p){
      avisos.push("No hay una progresión de Poderes verificada para esta Ocupación. No se asignan Poderes automáticamente.");
      return {pasos:pasos,avisos:avisos,recursos:recursos,fuente:"Pendiente de verificación"};
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
      else if(x.tipo==="conjuro_preparado")personaje.conjuros_preparados.push("C"+x.circulo+" · "+x.nombre);
      else personaje.poderes.push(x.nombre+(x.circulo?" (C"+x.circulo+")":""));
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
  return {planificar:planificar,resolver:resolver,aplicar:aplicar,disponibles:disponibles};
});