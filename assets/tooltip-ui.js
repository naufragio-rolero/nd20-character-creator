/* Tarjetas emergentes accesibles para la Forja: hover, foco y pulsación. */
(function(root,factory){
  var api=factory(root);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioInfoUI=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(root){
  "use strict";
  var glosario=null,card=null,ancla=null,fija=false,cierre=null,escuchando=false;
  function esc(t){
    return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function consulta(nombre,grupo,sistema){
    return root.NaufragioTooltipIndex?.buscar(glosario,nombre,grupo,sistema)||null;
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
    var info=consulta(elemento.dataset.glosaNombre,elemento.dataset.glosaGrupo,
      elemento.dataset.glosaSistema);
    if(!info)return;
    limpiarTemporizador();
    if(ancla&&ancla!==elemento)ancla.removeAttribute("aria-describedby");
    ancla=elemento;fija=!!anclado;
    var c=crearElemento();
    c.replaceChildren();
    var marca=document.createElement("p");marca.className="info-tipo";
    marca.textContent=info.tipo||"Ficha";
    var titulo=document.createElement("h3");titulo.textContent=info.nombre;
    c.append(marca,titulo);
    if(info.datos&&info.datos.length){
      var tabla=document.createElement("dl");tabla.className="info-datos";
      info.datos.forEach(function(p){
        var dt=document.createElement("dt"),dd=document.createElement("dd");
        dt.textContent=p[0];dd.textContent=p[1];
        tabla.append(dt,dd);
      });
      c.appendChild(tabla);
    }
    var d=document.createElement("p");d.className="info-descripcion";
    d.textContent=info.descripcion||
      "La descripción completa todavía no está incorporada al catálogo digital; consulta el manual.";
    c.appendChild(d);
    /* Las magnitudes se calculan solo cuando conocemos el Nivel del personaje.
     * Las condiciones y las tiradas de dados NO se ejecutan aquí. */
    var nivel=Number(elemento.closest(".tarjeta")?.dataset.nivel);
    if(info.magnitudes&&Number.isSafeInteger(nivel)&&nivel>=1&&root.NaufragioMagnitudes){
      var calculo=root.NaufragioMagnitudes.evaluar(
        {registros:[info.magnitudes]},info.magnitudes.id_catalogo,nivel);
      if(calculo){
        var subtitulo=document.createElement("h4");
        subtitulo.textContent="Magnitudes literales · Nivel "+nivel;
        c.appendChild(subtitulo);
        var valores=document.createElement("dl");valores.className="info-datos";
        calculo.magnitudes.forEach(function(m){
          var dt=document.createElement("dt"),dd=document.createElement("dd");
          dt.textContent=m.clave.replace(/_/g," ");
          dd.textContent=String(m.valor)+" "+(m.unidad||"");
          valores.append(dt,dd);
        });
        c.appendChild(valores);
        var aviso=document.createElement("p");aviso.className="info-descripcion";
        aviso.textContent="Condiciones de aplicación: "+calculo.condiciones_no_automatizadas+
          ". Las Tiradas, objetivos y efectos no se ejecutan automáticamente.";
        c.appendChild(aviso);
      }
    }
    var fuente=document.createElement("p");fuente.className="info-fuente";
    fuente.textContent="Fuente: "+(info.fuente_descripcion||info.fuente);
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
  return {configurar:configurar,etiqueta:etiqueta,consulta:consulta,cerrar:cerrar};
});