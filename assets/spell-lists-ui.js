/* Editor de Listas de Conjuros: capa UI sobre datos DRS inmutables y biblioteca local. */
(function(){
"use strict";
var api=window.NaufragioListasConjuros,KEY="forja-listas-conjuros-v1";
var $=function(id){return document.getElementById(id);};
var catalogo,borradores,progresiones,ocupaciones,lib,seleccionado="",borrador=null,ultimoGuardado="";
function estado(msg,err){$("estado-datos").textContent=msg;$("estado-datos").classList.toggle("error",!!err);}
function mensaje(msg){$("estado-lista").textContent=msg;}
function elemento(tipo,clase,texto){var e=document.createElement(tipo);if(clase)e.className=clase;if(texto!==undefined)e.textContent=texto;return e;}
function opciones(select,arr){select.replaceChildren();arr.forEach(function(par){var opt=document.createElement("option");opt.value=par[0];opt.textContent=par[1];select.appendChild(opt);});}
function nuevoId(){
  if(!window.crypto||!crypto.getRandomValues)throw Error("El generador de IDs requiere un contexto seguro (HTTPS o localhost).");
  var bytes=crypto.getRandomValues(new Uint8Array(16));
  return "usuario:"+Array.from(bytes).map(function(b){return b.toString(16).padStart(2,"0");}).join("");
}
function todas(){return api.listasDisponibles(catalogo,borradores,lib);}
function actual(){return todas().find(function(x){return x.id===seleccionado;})||null;}
function esPersonal(id){return typeof id==="string"&&id.indexOf("usuario:")===0;}
function persistir(n){
  var serial=api.exportar(n,catalogo,borradores);
  try{localStorage.setItem(KEY,serial);}catch(e){throw Error("No se puede guardar localmente. Exporta los datos en otro navegador: "+e.message);}
  lib=n;
}
function sucio(){
  return borrador&&JSON.stringify(borrador)!==ultimoGuardado;
}
function confirmarDescarte(){return !sucio()||window.confirm("Hay cambios sin guardar. ¿Descartarlos?");}
function pintarBiblioteca(){
  var lista=$("listas"),frag=document.createDocumentFragment();
  todas().forEach(function(l){
    var li=document.createElement("li"),btn=elemento("button","",l.nombre),tag=elemento("span","etiqueta",l.tipo==="oficial"?"DRS":l.tipo==="propuesta"?"En revisión":"Personal");
    btn.type="button";btn.dataset.id=l.id;btn.setAttribute("aria-current",String(l.id===seleccionado));
    btn.appendChild(tag);btn.addEventListener("click",function(){seleccionar(l.id);});
    li.appendChild(btn);frag.appendChild(li);
  });
  lista.replaceChildren(frag);
  $("duplicar-lista").disabled=!actual()&&!borrador;
  $("eliminar-lista").disabled=!esPersonal(seleccionado)||!actual();
}
function seleccionar(id,forzar){
  if(!forzar&&!confirmarDescarte())return;
  var l=todas().find(function(x){return x.id===id;});if(!l)return;
  seleccionado=id;borrador={id:l.id,nombre:l.nombre,descripcion:l.descripcion,
    maxCirculo:l.maxCirculo,conjuros:l.conjuros.slice()};
  ultimoGuardado=JSON.stringify(borrador);
  $("lista-nombre").value=l.nombre;$("lista-descripcion").value=l.descripcion;
  $("lista-maximo").value=String(l.maxCirculo);
  var editable=esPersonal(id);
  $("lista-nombre").readOnly=!editable;$("lista-descripcion").readOnly=!editable;
  $("lista-maximo").disabled=!editable;
  $("guardar-lista").disabled=!editable;
  $("lista-origen").textContent=l.tipo==="oficial"?
    "Lista oficial de solo lectura. Para personalizarla, crea una copia.":l.tipo==="propuesta"?
    "Propuesta editorial NO aprobada. Esta ficha solo sirve para revisión y pruebas; duplica para editar.":
    "Lista personal del navegador. Sus cambios no se aplican al juego oficial.";
  mensaje("");pintarBiblioteca();pintarConjuros();
  $("asoc-lista").value=id;
}
function crearNueva(){
  if(!confirmarDescarte())return;
  seleccionado=nuevoId();borrador={id:seleccionado,nombre:"Nueva lista",descripcion:"",maxCirculo:8,conjuros:[]};
  ultimoGuardado="";$("lista-nombre").value=borrador.nombre;$("lista-descripcion").value="";
  $("lista-maximo").value="8";$("lista-maximo").disabled=false;$("lista-nombre").readOnly=false;
  $("lista-descripcion").readOnly=false;$("guardar-lista").disabled=false;
  $("lista-origen").textContent="Nueva lista personal. No se guarda hasta pulsar Guardar.";
  mensaje("");pintarBiblioteca();pintarConjuros();$("lista-nombre").focus();
}
function filtros(){
  return {texto:$("filtro-nombre").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),
  circulo:$("filtro-circulo").value,escuela:$("filtro-escuela").value,origen:$("filtro-origen").value};
}
function pintarConjuros(){
  if(!borrador)return;
  var f=filtros(),vistos=0,frag=document.createDocumentFragment(),seleccion=new Set(borrador.conjuros);
  for(var c=1;c<=8;c++){
    if(f.circulo&&Number(f.circulo)!==c)continue;
    var elegibles=catalogo.conjuros.filter(function(s){
      if(s.circulo!==c)return false;
      if(f.escuela&&s.escuela!==f.escuela)return false;
      if(f.origen==="ambas"&&s.listas_oficiales.length!==2)return false;
      if((f.origen==="Mago"||f.origen==="Clérigo")&&!s.listas_oficiales.includes(f.origen))return false;
      return !f.texto||s.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(f.texto);
    });
    if(!elegibles.length)continue;vistos+=elegibles.length;
    var details=elemento("details","grupo"),sum=elemento("summary","", "Círculo "+c+" · "+elegibles.length+" Conjuros");
    details.open=true;details.appendChild(sum);
    elegibles.forEach(function(s){
      var div=elemento("div","conjuro"),label=document.createElement("label"),cb=document.createElement("input");
      cb.type="checkbox";cb.checked=seleccion.has(s.id);
      cb.disabled=!esPersonal(seleccionado)||(!cb.checked&&s.circulo>borrador.maxCirculo);
      cb.setAttribute("aria-label","Incluir "+s.nombre);cb.addEventListener("change",function(){
        var set=new Set(borrador.conjuros);if(cb.checked)set.add(s.id);else set.delete(s.id);
        borrador.conjuros=Array.from(set);pintarConjuros();mensaje("Cambios pendientes de guardar.");
      });
      label.append(cb,document.createTextNode(s.nombre+" · "+s.escuela));
      div.appendChild(label);
      var notas=elemento("small","",s.listas_oficiales.join(" / ")||"Sin lista oficial");
      div.appendChild(notas);
      var ficha=elemento("details",""),resumen=elemento("summary","","Leer descripción normativa");
      var pre=elemento("pre","",s.texto_normativo);
      ficha.append(resumen,pre);div.appendChild(ficha);details.appendChild(div);
    });frag.appendChild(details);
  }
  $("grupos-conjuros").replaceChildren(frag);
  $("cuenta-conjuros").textContent=borrador.conjuros.length+" seleccionados · "+vistos+" visibles";
}
function actualizarBorrador(){
  if(!borrador||!esPersonal(seleccionado))return;
  borrador.nombre=$("lista-nombre").value;borrador.descripcion=$("lista-descripcion").value;
  borrador.maxCirculo=Number($("lista-maximo").value);
  pintarConjuros();mensaje("Cambios pendientes de guardar.");
}
function guardar(e){
  e.preventDefault();try{
    if(!borrador||!esPersonal(seleccionado))throw Error("Las listas oficiales y propuestas están protegidas.");
    actualizarBorrador();
    var nueva=api.guardarLista(lib,borrador,catalogo,borradores);
    persistir(nueva);seleccionar(borrador.id,true);mensaje("Lista guardada localmente.");
    poblarAsociaciones();estado("Cambios personales guardados en este navegador.");
  }catch(err){mensaje("Error: "+err.message);}
}
function duplicar(){
  try{
    var l=actual()||borrador;if(!l)throw Error("Selecciona primero una lista.");
    if(!confirmarDescarte())return;
    var id=nuevoId(),nombre=l.nombre+" (copia)";
    persistir(api.duplicarLista(lib,l.id,id,nombre,catalogo,borradores));
    poblarAsociaciones();seleccionar(id,true);mensaje("Copia creada; los Conjuros mantienen sus referencias DRS.");
  }catch(err){mensaje(err.message);}
}
function eliminar(){
  try{
    if(!esPersonal(seleccionado)||!actual())throw Error("Solo puedes eliminar listas personales guardadas.");
    if(!window.confirm("¿Eliminar esta lista personal? No se pueden recuperar cambios sin una exportación."))return;
    persistir(api.eliminarLista(lib,seleccionado,catalogo,borradores));
    poblarAsociaciones();seleccionar(catalogo.oficiales[0].id,true);mensaje("Lista personal eliminada.");
  }catch(err){mensaje(err.message);}
}
function descargar(nombre,texto){
  var url=URL.createObjectURL(new Blob([texto],{type:"application/json;charset=utf-8"}));
  var a=document.createElement("a");a.href=url;a.download=nombre;document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(function(){URL.revokeObjectURL(url);},1000);
}
function exportar(){
  try{descargar("forja-listas-conjuros.json",api.exportar(lib,catalogo,borradores));
    estado("Biblioteca exportada. Contiene solo listas personales y asociaciones, no copias de los Conjuros oficiales.");
  }catch(e){estado(e.message,true);}
}
async function importar(file){
  if(!file)return;
  try{
    if(file.size>1024*1024)throw Error("El JSON excede el tamaño permitido.");
    var nueva=api.importar(await file.text(),catalogo,borradores);
    if(!confirmarDescarte())return;
    if((lib.listas.length||lib.asociaciones.length)&&!window.confirm("Importar reemplazará la biblioteca personal local actual. ¿Continuar?"))return;
    persistir(nueva);poblarAsociaciones();seleccionar(catalogo.oficiales[0].id,true);
    estado("Biblioteca importada y validada. Los datos oficiales permanecen intactos.");
  }catch(e){estado("No se importó nada: "+e.message,true);}
}
function poblarAsociaciones(){
  var idActual=$("asoc-lista").value,progActual=$("asoc-progresion").value;
  opciones($("asoc-lista"),todas().map(function(l){return [l.id,l.nombre+(l.tipo==="oficial"?" · DRS":l.tipo==="propuesta"?" · borrador":" · personal")];}));
  if(todas().some(function(l){return l.id===idActual;}))$("asoc-lista").value=idActual;
  opciones($("asoc-progresion"),[["","Sin progresión documentada"],
    ["drs:Mago","Mago · tabla DRS"],["drs:Clérigo","Clérigo · tabla DRS"]]
    .concat(borradores.progresiones.map(function(x){return [x.id,x.nombre];})));
  $("asoc-progresion").value=progActual;
  var ul=$("asociaciones-guardadas"),frag=document.createDocumentFragment();
  lib.asociaciones.forEach(function(a){
    var li=document.createElement("li"),button=elemento("button","",a.ocupacion);
    button.type="button";button.addEventListener("click",function(){
      $("asoc-ocupacion").value=a.ocupacion;$("asoc-lista").value=a.listaId;
      $("asoc-progresion").value=a.progresionId||"";vistaPrevia();
      $("form-asociacion").scrollIntoView({block:"center"});
    });
    li.append(button,document.createTextNode(" · "+(todas().find(function(l){return l.id===a.listaId;})?.nombre||a.listaId)));
    frag.appendChild(li);
  });ul.replaceChildren(frag);
}
function vistaPrevia(){
  var out=$("vista-asociacion");out.replaceChildren();
  var ocupacion=$("asoc-ocupacion").value.trim(),listaId=$("asoc-lista").value,progresionId=$("asoc-progresion").value||null;
  if(!ocupacion||!listaId){out.textContent="Escribe una Ocupación y elige su Lista para consultar sus Conjuros.";return;}
  var nivel=Number($("asoc-nivel").value);
  try{
    var mock={asociaciones:[{ocupacion,listaId,progresionId}],listas:lib.listas};
    var r=api.resolver(mock,ocupacion,nivel,catalogo,borradores,progresiones);
    out.appendChild(elemento("h3","",r.lista.nombre+" · Nivel "+nivel));
    out.appendChild(elemento("p","","Repertorio: "+r.repertorio.length+" Conjuros. Disponibles al Nivel indicado: "+
      (r.espacios?r.disponibles.length:"no calculables sin una progresión")+"."));
    if(r.advertencia)out.appendChild(elemento("p","alerta",r.advertencia));
    if(r.espacios){
      var div=elemento("div","circulos");
      r.espacios.forEach(function(esp,i){if(esp>0)div.appendChild(elemento("span","","Círculo "+(i+1)+": "+esp+" Espacios"));});
      out.appendChild(div);
    }
    if(r.disponibles.length)out.appendChild(elemento("p","",r.disponibles.map(function(x){return x.nombre;}).join(" · ")));
  }catch(e){out.appendChild(elemento("p","alerta",e.message));}
}
function guardarAsociacion(e){
  e.preventDefault();
  try{
    var o=$("asoc-ocupacion").value,lista=$("asoc-lista").value,prog=$("asoc-progresion").value||null;
    persistir(api.vincular(lib,o,lista,prog,catalogo,borradores));
    poblarAsociaciones();vistaPrevia();estado("Asociación guardada localmente. No altera la generación oficial.");
  }catch(err){estado(err.message,true);}
}
function quitarAsociacion(){
  try{
    var o=$("asoc-ocupacion").value;if(!o.trim())throw Error("Escribe la Ocupación que quieres desvincular.");
    persistir(api.desvincular(lib,o,catalogo,borradores));
    poblarAsociaciones();vistaPrevia();estado("Ocupación desvinculada.");
  }catch(e){estado(e.message,true);}
}
function conectar(){
  $("crear-lista").addEventListener("click",crearNueva);
  $("duplicar-lista").addEventListener("click",duplicar);
  $("eliminar-lista").addEventListener("click",eliminar);
  $("form-lista").addEventListener("submit",guardar);
  ["lista-nombre","lista-descripcion","lista-maximo"].forEach(function(id){
    $(id).addEventListener("input",actualizarBorrador);$(id).addEventListener("change",actualizarBorrador);
  });
  ["filtro-nombre","filtro-circulo","filtro-escuela","filtro-origen"].forEach(function(id){
    $(id).addEventListener("input",pintarConjuros);$(id).addEventListener("change",pintarConjuros);
  });
  $("exportar-listas").addEventListener("click",exportar);
  $("importar-archivo").addEventListener("change",function(){
    importar(this.files[0]);this.value="";
  });
  $("form-asociacion").addEventListener("submit",guardarAsociacion);
  $("borrar-asociacion").addEventListener("click",quitarAsociacion);
  ["asoc-ocupacion","asoc-lista","asoc-progresion","asoc-nivel"].forEach(function(id){
    $(id).addEventListener("input",vistaPrevia);$(id).addEventListener("change",vistaPrevia);
  });
  $("asoc-ocupacion").addEventListener("change",function(){
    var a=lib.asociaciones.find(function(x){return x.ocupacion===this.value.trim();});
    if(a){$("asoc-lista").value=a.listaId;$("asoc-progresion").value=a.progresionId||"";vistaPrevia();}
  });
}
async function cargar(){
  try{
    var rutas=["data/conjuros-drs-fichas.json","data/catalogo-poderes.json",
      "data/listas-conjuros-borradores.json","data/progresiones-oficiales.json","data/ocupaciones.json"];
    var data=await Promise.all(rutas.map(async function(url){
      var r=await fetch(url,{cache:"no-cache"});if(!r.ok)throw Error("No se pudo obtener "+url);
      return r.json();
    }));
    catalogo=api.crearCatalogo(data[0],data[1]);
    borradores=api.leerBorradores(data[2],catalogo);progresiones=data[3];ocupaciones=data[4];
    var guardado=localStorage.getItem(KEY);
    lib=guardado?api.importar(guardado,catalogo,borradores):api.vacia(catalogo);
    var circulos=Array.from({length:8},function(_,i){return [String(i+1),"Círculo "+(i+1)];});
    opciones($("lista-maximo"),circulos);
    opciones($("filtro-circulo"),[["","Todos"]].concat(circulos));
    opciones($("filtro-escuela"),[["","Todas"]].concat(
      Array.from(new Set(catalogo.conjuros.map(function(s){return s.escuela;}))).sort()
        .map(function(s){return [s,s];})));
    var sugeridas=Object.keys(ocupaciones).concat(["Centinela","Profeta"]);
    opciones($("ocupaciones-sugeridas"),sugeridas.map(function(s){return [s,s];}));
    conectar();poblarAsociaciones();seleccionar(catalogo.oficiales[0].id,true);
    $("asoc-ocupacion").value="Centinela";
    $("asoc-lista").value="propuesta:centinela-v5";
    $("asoc-progresion").value="propuesta:centinela-v5";vistaPrevia();
    estado("DRS "+catalogo.versionDRS+" · "+catalogo.conjuros.length+" Conjuros verificados · "+
      lib.listas.length+" listas personales guardadas. Centinela es una propuesta editorial.");
  }catch(e){
    estado("No se pudo abrir el editor: "+e.message,true);
    $("form-lista").hidden=true;$("form-asociacion").hidden=true;
  }
}
cargar();
})();
