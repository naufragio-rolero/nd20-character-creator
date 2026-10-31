/* Tarjetas emergentes accesibles para la Forja: hover, foco y pulsación. */
(function(root,factory){
  var api=factory(root);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioInfoUI=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(root){
  "use strict";
  var glosario=null,card=null,ancla=null,fija=false,cierre=null,escuchando=false;
  var avanzada=false;
  function esc(t){
    return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function configurarAvanzado(valor){
    avanzada=!!valor;
    if(card&&!card.hidden){
      var detalles=card.querySelector('.info-detalles');
      if(detalles){
        detalles.open=avanzada;
        if(ancla?.dataset.glosaGrupo==="poder")detalles.hidden=!avanzada;
      }
      posicionar();
    }
  }
  function consulta(nombre,grupo,sistema){
    return root.NaufragioTooltipIndex?.buscar(glosario,nombre,grupo,sistema)||null;
  }
  function consultaPorId(id,grupo,sistema){
    return root.NaufragioTooltipIndex?.buscarPorId(glosario,id,grupo,sistema)||null;
  }
  function etiqueta(t,grupo,sistema){
    var dato=consulta(t,grupo,sistema);
    if(!dato)return esc(t);
    return '<button type="button" class="referencia-glosario" data-glosa-nombre="'+
      esc(t)+'" data-glosa-grupo="'+esc(grupo)+'" data-glosa-sistema="'+
      esc(sistema)+'" aria-label="Ver ficha: '+esc(t)+'">'+esc(t)+'</button>';
  }
  function crearElemento(){
    if(card)return card;
    card=document.createElement("section");
    card.id="ficha-emergente";
    card.className="ficha-emergente";
    card.setAttribute("role","tooltip");
    card.hidden=true;
    card.addEventListener("pointerenter",cancelarCierre);
    card.addEventListener("pointerleave",function(){if(!fija)programarCierre();});
    document.body.appendChild(card);
    return card;
  }
  function posicionar(){
    if(!ancla||!card||card.hidden)return;
    var b=ancla.getBoundingClientRect();
    var w=Math.min(440,innerWidth-24),h=card.offsetHeight;
    var x=Math.max(12,Math.min(b.left,innerWidth-w-12));
    var abajo=b.bottom+9,arriba=b.top-h-9;
    var y=abajo+h>innerHeight-12 && arriba>12?arriba:abajo;
    y=Math.max(12,Math.min(y,innerHeight-h-12));
    card.style.width=w+"px";card.style.left=x+"px";card.style.top=y+"px";
  }
  function limpiarTemporizador(){if(cierre){clearTimeout(cierre);cierre=null;}}
  function cancelarCierre(){limpiarTemporizador();}
  function programarCierre(){
    limpiarTemporizador();
    cierre=setTimeout(function(){
      if(!fija&&card&&!card.matches(":hover")&&(!ancla||!ancla.matches(":hover")))
        cerrar();
    },140);
  }
  function cerrar(){
    limpiarTemporizador();
    if(ancla){ancla.removeAttribute("aria-describedby");ancla.setAttribute("aria-expanded","false");}
    if(card)card.hidden=true;
    ancla=null;fija=false;
  }
  function mostrar(elemento,anclado){
    if(!glosario||!elemento)return;
    var info=elemento.dataset.glosaId?
      consultaPorId(elemento.dataset.glosaId,elemento.dataset.glosaGrupo,
        elemento.dataset.glosaSistema):
      consulta(elemento.dataset.glosaNombre,elemento.dataset.glosaGrupo,
        elemento.dataset.glosaSistema);
    if(!info)return;
    limpiarTemporizador();
    if(ancla&&ancla!==elemento)ancla.removeAttribute("aria-describedby");
    ancla=elemento;fija=!!anclado;
    var c=crearElemento();
    c.replaceChildren();
    c.setAttribute('role',fija?'dialog':'tooltip');
    if(fija)c.setAttribute('aria-label','Consulta de ficha');
    else c.removeAttribute('aria-label');
    var poder=elemento.dataset.glosaGrupo==="poder"?
      root.NaufragioTooltipIndex?.presentarPoder?.(info):null;
    var tecnicos=document.createElement('div');
    tecnicos.className='info-avanzada';
    var cabecera=document.createElement('div');
    cabecera.className='info-cabecera';
    var marca=document.createElement("p");marca.className="info-tipo";
    marca.textContent=info.tipo||"Ficha";
    cabecera.appendChild(marca);
    if(poder&&poder.clasificacion){
      var clase=document.createElement('p');
      clase.className='info-clasificacion';
      clase.textContent=poder.clasificacion;
      cabecera.appendChild(clase);
    }
    var titulo=document.createElement("h3");titulo.textContent=info.nombre;
    c.append(cabecera,titulo);
    // En Poderes, lo necesario en mesa va siempre antes de la descripción.
    // Conservar las fórmulas literales, sin reemplazarlas por un valor por Nivel.
    if(poder&&poder.primarios.length){
      var principales=document.createElement('dl');
      principales.className='info-primarios';
      poder.primarios.forEach(function(p){
        var dt=document.createElement('dt'),dd=document.createElement('dd');
        dt.textContent=p[0]+':';dd.textContent=p[1];
        principales.append(dt,dd);
      });
      c.appendChild(principales);
    }
    var datosTecnicos=poder?poder.tecnicos:(info.datos||[]);
    if(datosTecnicos.length){
      var tabla=document.createElement("dl");tabla.className="info-datos";
      datosTecnicos.forEach(function(p){
        var dt=document.createElement("dt"),dd=document.createElement("dd");
        dt.textContent=p[0];dd.textContent=p[1];
        tabla.append(dt,dd);
      });
      tecnicos.appendChild(tabla);
    }
    var d=document.createElement("p");d.className="info-descripcion";
    d.textContent=info.descripcion||
      "La descripción completa todavía no está incorporada al catálogo digital; consulta el manual.";
    c.appendChild(d);
    /* Las magnitudes se calculan solo cuando conocemos el Nivel del personaje.
     * Las condiciones y las tiradas de dados NO se ejecutan aquí. */
    var nivelTexto=elemento.dataset.glosaNivel||
      elemento.closest(".tarjeta")?.dataset.nivel;
    var nivel=Number(nivelTexto);
    if(info.magnitudes&&Number.isSafeInteger(nivel)&&nivel>=1&&root.NaufragioMagnitudes){
      var calculo=root.NaufragioMagnitudes.evaluar(
        {registros:[info.magnitudes]},info.magnitudes.id_catalogo,nivel);
      if(calculo){
        var subtitulo=document.createElement("h4");
        subtitulo.textContent="Magnitudes literales · Nivel "+nivel;
        tecnicos.appendChild(subtitulo);
        var valores=document.createElement("dl");valores.className="info-datos";
        calculo.magnitudes.forEach(function(m){
          var dt=document.createElement("dt"),dd=document.createElement("dd");
          dt.textContent=m.clave.replace(/_/g," ");
          dd.textContent=String(m.valor)+" "+(m.unidad||"");
          valores.append(dt,dd);
        });
        tecnicos.appendChild(valores);
        var aviso=document.createElement("p");aviso.className="info-descripcion";
        aviso.textContent="Condiciones de aplicación: "+calculo.condiciones_no_automatizadas+
          ". Las Tiradas, objetivos y efectos no se ejecutan automáticamente.";
        tecnicos.appendChild(aviso);
      }
    }
    if(info.danioCompuesto){
      var tipo=document.createElement("p");tipo.className="info-descripcion";
      tipo.textContent="Daño compuesto: un único grupo de dados, tipos "+
        info.danioCompuesto.tipos.join(" e ")+
        " simultáneamente. Resistencia a ambos: una única resistencia. "+
        "Debilidad a cualquiera de los tipos: daño ×2, sin duplicarlo. "+
        "Resistencia parcial o simultánea con debilidad: resolución del Cronista."+
        (info.danioCompuesto.condicion_activacion?
          " Aplicación: "+info.danioCompuesto.condicion_activacion:"");
      tecnicos.appendChild(tipo);
    }
    if(tecnicos.childNodes.length){
      if(['talento','poder'].includes(elemento.dataset.glosaGrupo)){
        var detalles=document.createElement('details');
        detalles.className='info-detalles';
        detalles.open=avanzada;
        // La preferencia global controla si se muestra el bloque técnico
        // de Poderes; Talentos mantienen su interacción anterior.
        if(poder)detalles.hidden=!avanzada;
        var resumen=document.createElement('summary');
        resumen.textContent='Detalles técnicos';
        detalles.append(resumen,tecnicos);
        detalles.addEventListener('toggle',posicionar);
        c.appendChild(detalles);
      }else{
        c.appendChild(tecnicos);
      }
    }
    var fuente=document.createElement("p");fuente.className="info-fuente";
    fuente.textContent=poder?
      "Origen: "+poder.origen+" · Fuente: "+poder.fuente:
      "Fuente: "+(info.fuente_descripcion||info.fuente);
    c.appendChild(fuente);
    c.hidden=false;elemento.setAttribute("aria-describedby",c.id);
    elemento.setAttribute("aria-expanded",String(fija));
    posicionar();
  }
  function getTarget(e){
    return e.target.closest?.(".referencia-glosario, .consultar-ficha-eleccion")||null;
  }
  function configurar(indice){
    glosario=indice;
    if(typeof document==="undefined"||escuchando)return;
    escuchando=true;
    document.addEventListener("pointerover",function(e){
      var a=getTarget(e);
      if(a&&e.pointerType==="mouse"&&!(a.contains(e.relatedTarget))&&
         !(a===ancla&&fija))mostrar(a,false);
    });
    document.addEventListener("pointerout",function(e){
      var a=getTarget(e);
      if(a&&a===ancla&&!a.contains(e.relatedTarget)&&!fija)programarCierre();
    });
    document.addEventListener("focusin",function(e){
      var a=getTarget(e);if(a)mostrar(a,true);
    });
    document.addEventListener("focusout",function(e){
      var a=getTarget(e);if(a&&a===ancla&&!card.contains(e.relatedTarget))cerrar();
    });
    document.addEventListener("click",function(e){
      var a=getTarget(e);
      if(a){
        // El foco llega antes que click, también en pantallas táctiles.
        // Pulsar siempre abre: no cerrar por un falso doble evento.
        mostrar(a,true);
      }else if(card&&!card.contains(e.target))cerrar();
    });
    document.addEventListener("keydown",function(e){if(e.key==="Escape")cerrar();});
    root.addEventListener("resize",posicionar);
    root.addEventListener("scroll",posicionar,{passive:true,capture:true});
  }
  return {configurar:configurar,configurarAvanzado:configurarAvanzado,
    etiqueta:etiqueta,consulta:consulta,
    consultaPorId:consultaPorId,cerrar:cerrar};
});