/* Control editorial: estado local y exportación JSON; nunca escribe en GitHub. */
(function(){
  "use strict";
  var control=window.NaufragioControl;
  var CLAVE_ACCESO="forja-revision-token-v1";
  var CLAVE_BORRADOR="forja-revision-cambios-v1";
  var $=function(id){return document.getElementById(id);};
  var inventario=[],porId=new Map(),cambios={},seleccionado="",limite=70,desbloqueado=false;
  var metadatos=null;
  function mensaje(texto,error){
    $("estado-control").textContent=texto;
    $("estado-control").classList.toggle("error",!!error);
  }
  function leerLocal(clave){
    try{return localStorage.getItem(clave);}
    catch(err){throw Error("El navegador impide guardar datos locales. Revisa sus permisos.");}
  }
  function escribirLocal(clave,valor){
    try{localStorage.setItem(clave,valor);}
    catch(err){throw Error("No se pudo guardar la revisión en este navegador.");}
  }
  function quitarLocal(clave){
    try{localStorage.removeItem(clave);}
    catch(err){throw Error("No se pudo restablecer el token local.");}
  }
  function hex(buffer){
    return Array.from(new Uint8Array(buffer)).map(function(n){
      return n.toString(16).padStart(2,"0");
    }).join("");
  }
  function aleatorio(bytes){
    var a=new Uint8Array(bytes);
    crypto.getRandomValues(a);
    return hex(a);
  }
  async function resumenCriptografico(valor){
    return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(valor)));
  }
  function accesoVisible(){
    $("acceso-control").hidden=desbloqueado;
    $("mesa-control").hidden=!desbloqueado;
    var registrado=!!metadatos;
    $("crear-token").hidden=registrado;
    $("reponer-token").hidden=!registrado;
    $("abrir-control").disabled=!registrado;
    $("ayuda-acceso").textContent=registrado?
      "Introduce el token de revisión registrado en este navegador.":
      "No existe un token en este dispositivo. Genera uno nuevo y guárdalo antes de editar.";
  }
  async function generarToken(){
    if(metadatos)throw Error("Este navegador ya tiene un token. Desbloquéalo o restablécelo.");
    var token=aleatorio(20),salt=aleatorio(16);
    metadatos={salt:salt,hash:await resumenCriptografico(salt+":"+token)};
    escribirLocal(CLAVE_ACCESO,JSON.stringify(metadatos));
    $("valor-token").textContent=token;
    $("token-generado").hidden=false;
    $("token-acceso").value="";
    desbloqueado=true;
    accesoVisible();
    renderizar();
    mensaje("Token creado. Guarda la clave mostrada y exporta la revisión antes de borrar datos de este navegador.");
  }
  async function abrir(){
    if(!metadatos)throw Error("Todavía no has generado un token.");
    var token=$("token-acceso").value.trim();
    if(!token)throw Error("Introduce el token de este navegador.");
    var hash=await resumenCriptografico(metadatos.salt+":"+token);
    if(hash!==metadatos.hash)throw Error("Token incorrecto.");
    desbloqueado=true;
    $("token-acceso").value="";
    $("token-generado").hidden=true;
    accesoVisible();
    renderizar();
    mensaje("Revisión local desbloqueada. Ningún cambio se envía a GitHub.");
  }
  function bloquear(){
    desbloqueado=false;seleccionado="";
    $("token-generado").hidden=true;
    $("valor-token").textContent="";
    accesoVisible();
    mensaje("Editor bloqueado. Los cambios siguen guardados en este navegador.");
  }
  function tokenOlvidado(){
    if(!confirm("¿Generar otro token local? La revisión guardada se conservará, pero el token anterior dejará de funcionar."))return;
    quitarLocal(CLAVE_ACCESO);
    metadatos=null;desbloqueado=false;
    $("token-generado").hidden=true;
    $("valor-token").textContent="";
    accesoVisible();
    mensaje("Token restablecido. La revisión permanece guardada en este navegador.");
  }
  function estado(id){
    return control.normalizarCambio(cambios[id]||{});
  }
  function guardarCambios(){
    escribirLocal(CLAVE_BORRADOR,JSON.stringify(cambios));
  }
  function editarSeleccion(){
    if(!seleccionado)return;
    var valor={visible:$("detalle-visible").checked,
      publicado:$("detalle-publicado").value,probado:$("detalle-probado").value,
      notas:$("detalle-notas").value};
    if(control.sinCambios(valor))delete cambios[seleccionado];
    else cambios[seleccionado]=control.normalizarCambio(valor);
    guardarCambios();resumen();lista();
  }
  function elegir(id){
    var item=porId.get(id);
    if(!item)return;
    seleccionado=id;
    var valor=estado(id);
    $("detalle-vacio").hidden=true;$("detalle-editor").hidden=false;
    $("detalle-sistema").textContent=item.sistema;
    $("detalle-nombre").textContent=item.nombre;
    $("detalle-tipo").textContent=item.tipo;
    $("detalle-fuente").textContent="Fuente: "+item.fuente;
    $("detalle-referencia").textContent=item.detalle;
    $("detalle-visible").checked=valor.visible;
    $("detalle-publicado").value=valor.publicado;
    $("detalle-probado").value=valor.probado;
    $("detalle-notas").value=valor.notas;
    lista();
    if(window.matchMedia("(max-width:830px)").matches)
      $("detalle-editor").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function resumen(){
    $("cuenta-total").textContent=inventario.length;
    $("cuenta-cambios").textContent=Object.keys(cambios).length;
    $("cuenta-ocultos").textContent=Object.values(cambios).filter(function(v){return v.visible===false;}).length;
    $("cuenta-sinrevisar").textContent=inventario.filter(function(item){
      var v=estado(item.id);
      return v.publicado==="sin_revisar"&&v.probado==="sin_revisar";
    }).length;
  }
  function filtroEstado(item,filtro){
    var v=estado(item.id);
    if(filtro==="sin_revisar")return v.publicado==="sin_revisar"&&v.probado==="sin_revisar";
    if(filtro==="cambiados")return !!cambios[item.id];
    if(filtro==="ocultos")return !v.visible;
    if(filtro==="no_publicados")return v.publicado==="no";
    if(filtro==="no_probados")return v.probado==="no";
    return true;
  }
  function resultados(){
    var q=$("buscar-control").value.trim().toLocaleLowerCase("es"),
      sistema=$("sistema-control").value,tipo=$("tipo-control").value,
      estadoFiltro=$("estado-filtro").value;
    return inventario.filter(function(item){
      return (!sistema||item.sistema===sistema)&&(!tipo||item.tipo===tipo)&&
        (!q||[item.nombre,item.fuente,item.detalle,item.sistema,item.tipo].join(" ")
          .toLocaleLowerCase("es").includes(q))&&filtroEstado(item,estadoFiltro);
    });
  }
  function lista(){
    var encontrados=resultados(),visibles=encontrados.slice(0,limite);
    $("numero-resultados").textContent="Mostrando "+visibles.length+" de "+
      encontrados.length+" resultados · "+inventario.length+" elementos en el inventario.";
    var fragment=document.createDocumentFragment();
    visibles.forEach(function(item){
      var li=document.createElement("li"),button=document.createElement("button"),
        titulo=document.createElement("span"),meta=document.createElement("span"),flag=document.createElement("strong");
      button.type="button";button.dataset.id=item.id;
      button.setAttribute("aria-current",String(seleccionado===item.id));
      titulo.className="titulo-elemento";titulo.textContent=item.nombre;
      meta.className="meta-elemento";
      var v=estado(item.id);
      flag.textContent=!v.visible?" · Ocultar":(v.publicado==="si"?" · Publicado":(v.publicado==="no"?" · No publicado":" · Sin revisar"));
      meta.textContent=item.sistema+" · "+item.tipo+" · "+item.fuente;
      meta.appendChild(flag);button.appendChild(titulo);button.appendChild(meta);
      li.appendChild(button);fragment.appendChild(li);
    });
    $("lista-inventario").replaceChildren(fragment);
    $("mas-elementos").hidden=encontrados.length<=limite;
  }
  function renderizar(){resumen();lista();}
  function poblarSelect(id,nombres){
    var sel=$(id);
    nombres.sort(function(a,b){return a.localeCompare(b,"es");}).forEach(function(name){
      var opt=document.createElement("option");opt.value=name;opt.textContent=name;sel.appendChild(opt);
    });
  }
  function descargarRevision(){
    var revision=control.crearRevision(inventario,cambios);
    var blob=new Blob([JSON.stringify(revision,null,2)+"\n"],
      {type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="revision-editorial.json";document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1500);
    mensaje("JSON exportado: "+Object.keys(revision.cambios).length+
      " decisiones editoriales de "+revision.total_inventario+" elementos.");
  }
  async function importarRevision(archivo){
    if(!archivo)return;
    var parsed=JSON.parse(await archivo.text());
    var nuevos=control.importarRevision(inventario,parsed);
    if(Object.keys(cambios).length&&!confirm("¿Reemplazar la revisión local por las decisiones del JSON seleccionado?"))return;
    cambios=nuevos;guardarCambios();
    renderizar();
    if(seleccionado)elegir(seleccionado);
    mensaje("Revisión importada: "+Object.keys(cambios).length+" decisiones válidas.");
  }
  function conectar(){
    $("crear-token").addEventListener("click",function(){generarToken().catch(function(e){mensaje(e.message,true);});});
    $("abrir-control").addEventListener("click",function(){abrir().catch(function(e){mensaje(e.message,true);});});
    $("token-acceso").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();$("abrir-control").click();}});
    $("copiar-token").addEventListener("click",function(){
      navigator.clipboard.writeText($("valor-token").textContent).then(function(){
        mensaje("Token copiado. Guárdalo fuera del navegador."); 
      }).catch(function(){mensaje("Selecciona y copia manualmente el token mostrado.",true);});
    });
    $("reponer-token").addEventListener("click",function(){
      try{tokenOlvidado();}catch(e){mensaje(e.message,true);}
    });
    $("bloquear-control").addEventListener("click",bloquear);
    ["buscar-control","sistema-control","tipo-control","estado-filtro"].forEach(function(id){
      $(id).addEventListener(id==="buscar-control"?"input":"change",function(){limite=70;lista();});
    });
    $("mas-elementos").addEventListener("click",function(){limite+=70;lista();});
    $("lista-inventario").addEventListener("click",function(e){
      var button=e.target.closest("button[data-id]");
      if(button)elegir(button.dataset.id);
    });
    ["detalle-visible","detalle-publicado","detalle-probado"].forEach(function(id){
      $(id).addEventListener("change",editarSeleccion);
    });
    $("detalle-notas").addEventListener("input",editarSeleccion);
    $("detalle-editor").addEventListener("submit",function(e){e.preventDefault();});
    $("restablecer-elemento").addEventListener("click",function(){
      if(!seleccionado)return;delete cambios[seleccionado];
      try{guardarCambios();elegir(seleccionado);resumen();mensaje("Elemento devuelto al estado inicial.");}
      catch(e){mensaje(e.message,true);}
    });
    $("exportar-control").addEventListener("click",function(){
      try{descargarRevision();}catch(e){mensaje(e.message,true);}
    });
    $("importar-control").addEventListener("click",function(){$("archivo-revision").click();});
    $("archivo-revision").addEventListener("change",function(e){
      importarRevision(e.target.files[0]).catch(function(err){mensaje("Error de importación: "+err.message,true);});
      e.target.value="";
    });
  }
  async function cargar(){
    if(!window.crypto||!crypto.subtle||!crypto.getRandomValues)
      throw Error("El navegador necesita un contexto HTTPS para el token local.");
    var rutas={
      especies:"data/especies.json",ocupaciones:"data/ocupaciones.json",
      especiesCifi:"data/especies_cifi.json",ocupacionesCifi:"data/ocupaciones_cifi.json",
      ampliado:"data/catalogo-ampliado.json",dungeon:"data/dungeon-hack.json",
      catalogo:"data/catalogo-poderes.json",progresiones:"data/progresiones-oficiales.json"
    };
    var pares=await Promise.all(Object.entries(rutas).map(async function(par){
      var response=await fetch(par[1],{cache:"no-cache"});
      if(!response.ok)throw Error("No se pudo cargar "+par[1]);
      return [par[0],await response.json()];
    }));
    inventario=control.crearInventario(Object.fromEntries(pares));
    porId=new Map(inventario.map(function(x){return [x.id,x];}));
    var token=leerLocal(CLAVE_ACCESO);
    if(token){
      metadatos=JSON.parse(token);
      if(!metadatos.salt||!metadatos.hash)throw Error("El token local está dañado.");
    }
    var borrador=leerLocal(CLAVE_BORRADOR);
    if(borrador){
      cambios=control.importarRevision(inventario,
        {esquema:control.ESQUEMA,cambios:JSON.parse(borrador)});
    }
    poblarSelect("sistema-control",Array.from(new Set(inventario.map(function(x){return x.sistema;}))));
    poblarSelect("tipo-control",Array.from(new Set(inventario.map(function(x){return x.tipo;}))));
    conectar();accesoVisible();
    $("acceso-control").hidden=false;
    mensaje(inventario.length+" elementos cargados. Sin revisar no significa publicado ni probado.");
  }
  cargar().catch(function(e){mensaje("No se pudo iniciar el control editorial: "+e.message,true);});
})();