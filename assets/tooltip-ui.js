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
        if(ancla?.dataset.glosaGrupo==="poder"||
           ancla?.dataset.glosaGrupo==="talento"&&
           card?.dataset.talentoDrs==="true")detalles.hidden=!avanzada;
      }
      posicionar();
    }
  }
  function consulta(nombre,grupo,sistema,fuentePreferida){
    return root.NaufragioTooltipIndex?.buscar(glosario,nombre,grupo,sistema,
      fuentePreferida)||null;
  }
  function consultaPorId(id,grupo,sistema){
    return root.NaufragioTooltipIndex?.buscarPorId(glosario,id,grupo,sistema)||null;
  }
  function etiqueta(t,grupo,sistema,fuentePreferida,adquisicion){
    var dato=consulta(t,grupo,sistema,fuentePreferida);
    if(!dato)return esc(t);
    return '<button type="button" class="referencia-glosario" data-glosa-nombre="'+
      esc(t)+'" data-glosa-grupo="'+esc(grupo)+'" data-glosa-sistema="'+
      esc(sistema)+'"'+(fuentePreferida?' data-glosa-fuente="'+esc(fuentePreferida)+'"':'')+
      (adquisicion?' data-glosa-adquisicion="'+esc(adquisicion)+'"':'')+
      ' aria-label="Ver ficha: '+esc(t)+'">'+esc(t)+'</button>';
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
    var margen=12,separacion=9,w=Math.min(fija?520:440,innerWidth-margen*2);
    if(fija){
      // Ficha fijada: diálogo accesible y desplazable, sin perseguir al
      // puntero o quedar atrapado en el pequeño hueco junto al ancla.
      card.style.width=w+"px";
      card.style.maxHeight=Math.max(120,innerHeight-margen*2)+"px";
      var altura=card.offsetHeight;
      card.style.left=Math.max(margen,(innerWidth-w)/2)+"px";
      card.style.top=Math.max(margen,(innerHeight-altura)/2)+"px";
      return;
    }
    card.style.width=w+"px";
    var huecoAbajo=Math.max(0,innerHeight-b.bottom-separacion-margen);
    var huecoArriba=Math.max(0,b.top-separacion-margen);
    // Evitar que un popup alto tape la referencia que lo abrió.
    // Si no cabe entero en ningún lado, reducir su altura y permitir scroll.
    card.style.maxHeight=Math.min(520,innerHeight*.68)+"px";
    var prefiereArriba=card.offsetHeight>huecoAbajo&&huecoArriba>huecoAbajo;
    var hueco=prefiereArriba?huecoArriba:huecoAbajo;
    card.style.maxHeight=Math.max(90,Math.min(520,innerHeight*.68,hueco))+"px";
    var h=card.offsetHeight;
    var x=Math.max(margen,Math.min(b.left,innerWidth-w-margen));
    var y=prefiereArriba?b.top-h-separacion:b.bottom+separacion;
    y=Math.max(margen,Math.min(y,innerHeight-h-margen));
    card.style.left=x+"px";card.style.top=y+"px";
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
        elemento.dataset.glosaSistema,elemento.dataset.glosaFuente);
    if(!info)return;
    limpiarTemporizador();
    if(ancla&&ancla!==elemento)ancla.removeAttribute("aria-describedby");
    ancla=elemento;fija=!!anclado;
    var c=crearElemento();
    c.replaceChildren();
    c.setAttribute('role',fija?'dialog':'tooltip');
    if(fija){
      var cerrarBoton=document.createElement('button');
      cerrarBoton.type='button';
      cerrarBoton.className='info-cerrar';
      cerrarBoton.textContent='Cerrar ×';
      cerrarBoton.setAttribute('aria-label','Cerrar ficha informativa');
      cerrarBoton.addEventListener('click',function(){
        var retorno=ancla;
        cerrar();
        if(retorno&&retorno.isConnected)retorno.focus({preventScroll:true});
      });
      c.appendChild(cerrarBoton);
    }
    if(fija)c.setAttribute('aria-label','Consulta de ficha');
    else c.removeAttribute('aria-label');
    var poder=elemento.dataset.glosaGrupo==="poder"?
      root.NaufragioTooltipIndex?.presentarPoder?.(info):null;
    var talento=elemento.dataset.glosaGrupo==="talento"?
      root.NaufragioTooltipIndex?.presentarTalento?.(info):null;
    var presentacion=poder||talento;
    c.dataset.talentoDrs=String(!!talento);
    var tecnicos=document.createElement('div');
    tecnicos.className='info-avanzada';
    var cabecera=document.createElement('div');
    cabecera.className='info-cabecera';
    var marca=document.createElement("p");marca.className="info-tipo";
    marca.textContent=presentacion?.tipo||info.tipo||"Ficha";
    cabecera.appendChild(marca);
    if(presentacion&&presentacion.clasificacion){
      var clase=document.createElement('p');
      clase.className='info-clasificacion';
      clase.textContent=presentacion.clasificacion;
      cabecera.appendChild(clase);
    }
    var titulo=document.createElement("h3");
    titulo.textContent=presentacion?.nombre||info.nombre;
    c.append(cabecera,titulo);
    // El origen reglamentario del Talento y la vía de adquisición del PJ
    // pueden ser distintos (Herencia dual). No cambiar el texto fuente.
    if(talento&&elemento.dataset.glosaAdquisicion){
      var adquirido=document.createElement('p');
      adquirido.className='info-adquisicion';
      adquirido.textContent='Adquisición: '+elemento.dataset.glosaAdquisicion;
      c.appendChild(adquirido);
    }
    // En Poderes, lo necesario en mesa va siempre antes de la descripción.
    // Conservar las fórmulas literales, sin reemplazarlas por un valor por Nivel.
    if(presentacion&&presentacion.primarios.length){
      var principales=document.createElement('dl');
      principales.className='info-primarios';
      presentacion.primarios.forEach(function(p){
        var dt=document.createElement('dt'),dd=document.createElement('dd');
        dt.textContent=p[0]+':';dd.textContent=p[1];
        principales.append(dt,dd);
      });
      c.appendChild(principales);
    }
    var datosTecnicos=presentacion?presentacion.tecnicos:(info.datos||[]);
    if(datosTecnicos.length){
      var tabla=document.createElement("dl");tabla.className="info-datos";
      datosTecnicos.forEach(function(p){
        var dt=document.createElement("dt"),dd=document.createElement("dd");
        dt.textContent=p[0];dd.textContent=p[1];
        tabla.append(dt,dd);
      });
      tecnicos.appendChild(tabla);
    }
    if(talento&&talento.uso_editorial){
      var uso=document.createElement('p');
      uso.className='info-uso-editorial';
      uso.textContent='Tipo de uso (guía editorial): '+talento.uso_editorial;
      c.appendChild(uso);
    }
    if(talento&&talento.resumen_editorial){
      var resumen=document.createElement('section');
      resumen.className='info-resumen-editorial';
      var nombreResumen=document.createElement('h4');
      nombreResumen.textContent='En pocas palabras';
      var textoResumen=document.createElement('p');
      textoResumen.textContent=talento.resumen_editorial;
      resumen.append(nombreResumen,textoResumen);
      c.appendChild(resumen);
      var literal=document.createElement('details');
      literal.className='info-texto-literal';
      var resumenLiteral=document.createElement('summary');
      resumenLiteral.textContent='Leer texto íntegro del DRS';
      var efectoLiteral=document.createElement('p');
      efectoLiteral.className='info-descripcion';
      efectoLiteral.textContent=info.descripcion||'';
      literal.append(resumenLiteral,efectoLiteral);
      literal.addEventListener('toggle',posicionar);
      c.appendChild(literal);
    }else{
      var d=document.createElement("p");d.className="info-descripcion";
      d.textContent=info.descripcion||
        "No consta una descripción en la fuente seleccionada.";
      c.appendChild(d);
    }
    if(!talento&&info.procedencia_glosa){
      var fuenteGlosa=document.createElement('p');
      fuenteGlosa.className='info-origen-glosa';
      fuenteGlosa.textContent='Descripción: '+info.procedencia_glosa;
      c.appendChild(fuenteGlosa);
    }
    // Apartado independiente: no añadir interpretaciones al efecto literal.
    // Visible siempre para que la aclaración aprobada no quede escondida
    // dentro de los detalles técnicos del popup.
    if(talento&&talento.aclaracion){
      var nota=document.createElement('section');
      nota.className='info-aclaracion-autoral';
      nota.setAttribute('aria-label','Aclaración autoral aprobada');
      var etiqueta=document.createElement('h4');
      etiqueta.textContent='Aclaración autoral aprobada';
      var contenido=document.createElement('p');
      contenido.textContent=talento.aclaracion.texto;
      nota.append(etiqueta,contenido);
      c.appendChild(nota);
    }
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
        // Los Talentos DRS cotejados utilizan la misma lectura rápida.
        // Los suplementos no validados mantienen su presentación anterior.
        if(presentacion)detalles.hidden=!avanzada;
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
    fuente.textContent=presentacion?
      "Origen: "+presentacion.origen+" · Fuente: "+presentacion.fuente:
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
      // Una ficha fijada por clic o teclado no puede ser sustituida
      // accidentalmente por hover de otra referencia.
      if(a&&e.pointerType==="mouse"&&!fija&&!a.contains(e.relatedTarget))
        mostrar(a,false);
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