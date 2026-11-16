/* Pantalla publica sencilla. El modelo DRS, las listas y los vinculos previos no se alteran. */
(function(){
'use strict';
var api=window.NaufragioListasConjuros;
var enlaces=window.NaufragioEnlaces;
var KEY='forja-listas-conjuros-v1';
var PREFIJO='Lista de Conjuros de ';
var $=function(id){return document.getElementById(id);};
var catalogo,borradores,lib,actualId=null,maximo=8,descripcion='',conjuros=new Set();
var ultimoGuardado='',cargaCompleta=false;
function decir(texto,fallo){
  $('estado-lista').textContent=texto;
  $('estado-lista').classList.toggle('error',!!fallo);
}
function mensajeCarga(texto,fallo){
  $('estado-datos').textContent=texto;
  $('estado-datos').classList.toggle('error',!!fallo);
}
function crear(tipo,clase,texto){
  var el=document.createElement(tipo);
  if(clase)el.className=clase;
  if(texto!==undefined)el.textContent=texto;
  return el;
}
function normalizar(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function nombre(){return PREFIJO+$('lista-dueno').value.trim();}
function idNuevo(){
  if(!crypto||!crypto.getRandomValues)throw Error('Para guardar se necesita HTTPS o localhost.');
  var b=new Uint8Array(16);crypto.getRandomValues(b);
  return 'usuario:'+Array.from(b,function(x){return x.toString(16).padStart(2,'0');}).join('');
}
function candidato(){
  return {id:actualId||'usuario:pendiente0000',nombre:nombre(),descripcion:descripcion,
    maxCirculo:maximo,conjuros:Array.from(conjuros)};
}
function firma(){var c=candidato();return JSON.stringify([c.nombre,c.descripcion,c.maxCirculo,c.conjuros.slice().sort()]);}
function hayCambios(){return firma()!==ultimoGuardado;}
function aceptarDescarte(){
  return !hayCambios()||window.confirm('Tienes cambios sin guardar en esta lista. ¿Descartarlos?');
}
function nombresGuardados(){
  var select=$('listas-guardadas');
  var anterior=actualId||'';
  select.replaceChildren();
  var opcion=crear('option','', 'Nueva lista');
  opcion.value='';select.appendChild(opcion);
  lib.listas.forEach(function(l){
    var opt=crear('option','',l.nombre);opt.value=l.id;select.appendChild(opt);
  });
  select.value=anterior;
  $('panel-guardadas').hidden=lib.listas.length===0;
  $('eliminar-lista').disabled=!actualId;
}
function refrescarCabecera(){
  $('titulo-lista').textContent=$('lista-dueno').value.trim()?nombre():'Lista de Conjuros de…';
  $('cuenta-lista').textContent=conjuros.size+' Conjuros';
  $('eliminar-lista').disabled=!actualId;
}
function editar(){
  if(!cargaCompleta)return;
  refrescarCabecera();
  if(hayCambios())decir('Cambios sin guardar. Pulsa Guardar lista.');
  else decir('Lista guardada en este navegador.');
}
function pintarLista(){
  var cont=$('lista-circulos');
  var frag=document.createDocumentFragment();
  var grupos=Array.from({length:8},function(){return [];});
  conjuros.forEach(function(id){
    var s=catalogo.porId.get(id);
    if(s)grupos[s.circulo-1].push(s);
  });
  var total=0;
  grupos.forEach(function(grupo,i){
    if(!grupo.length)return;
    total+=grupo.length;
    grupo.sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es');});
    var seccion=crear('section','bloque-circulo');
    seccion.setAttribute('aria-label','Círculo '+(i+1));
    var titulo=crear('h3','', 'Círculo '+(i+1));
    seccion.appendChild(titulo);
    var ul=crear('ul','conjuros-seleccionados');
    grupo.forEach(function(s){
      var li=crear('li','conjuro-seleccionado');
      li.appendChild(crear('span','',s.nombre));
      var boton=crear('button','quitar-conjuro','Quitar');
      boton.type='button';boton.dataset.id=s.id;
      boton.setAttribute('aria-label','Quitar '+s.nombre+' de la lista');
      boton.addEventListener('click',function(){
        conjuros.delete(s.id);pintarLista();pintarResultados();editar();
      });
      li.appendChild(boton);ul.appendChild(li);
    });
    seccion.appendChild(ul);frag.appendChild(seccion);
  });
  if(!total){
    var vacio=crear('p','lista-vacia','Todavía no has añadido Conjuros. Búscalos arriba y pulsa Añadir.');
    frag.appendChild(vacio);
  }
  cont.replaceChildren(frag);
  refrescarCabecera();
}
function pintarResultados(){
  if(!catalogo)return;
  var f=normalizar($('filtro-nombre').value.trim());
  var circulo=Number($('filtro-circulo').value)||0;
  if(!f&&!circulo){
    $('cuenta-busqueda').textContent=catalogo.conjuros.length+' Conjuros disponibles';
    $('resultados-busqueda').replaceChildren(crear('p','lista-vacia',
      'Escribe el nombre de un Conjuro o elige un Círculo para empezar.'));
    return;
  }
  var resultados=catalogo.conjuros.filter(function(s){
    return (!circulo||s.circulo===circulo)&&(!f||normalizar(s.nombre).includes(f));
  }).sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es');});
  var limite=18;
  $('cuenta-busqueda').textContent=resultados.length+' encontrados'+
    (resultados.length>limite?' · mostrando '+limite:'');
  var frag=document.createDocumentFragment();
  resultados.slice(0,limite).forEach(function(s){
    var fila=crear('article','resultado-conjuro');
    var texto=crear('div','resultado-descripcion');
    texto.appendChild(crear('strong','',s.nombre));
    texto.appendChild(crear('small','', 'Círculo '+s.circulo+' · '+s.escuela));
    var detalle=crear('details','conjuro-detalle');
    detalle.appendChild(crear('summary','', 'Leer descripción'));
    detalle.appendChild(crear('p','',s.texto_normativo));
    texto.appendChild(detalle);
    fila.appendChild(texto);
    var incluido=conjuros.has(s.id);
    var btn=crear('button','anadir-conjuro',incluido?'Añadido':'Añadir');
    btn.type='button';btn.disabled=incluido;btn.dataset.id=s.id;
    btn.setAttribute('aria-label',(incluido?'Conjuro ya añadido: ':'Añadir Conjuro: ')+s.nombre);
    btn.addEventListener('click',function(){
      if(!conjuros.has(s.id)){
        conjuros.add(s.id);maximo=Math.max(maximo,s.circulo);
        pintarLista();pintarResultados();editar();
      }
    });
    fila.appendChild(btn);frag.appendChild(fila);
  });
  if(!resultados.length)frag.appendChild(crear('p','lista-vacia','No se han encontrado Conjuros con ese nombre.'));
  $('resultados-busqueda').replaceChildren(frag);
}
function abrirNueva(){
  actualId=null;maximo=8;descripcion='';conjuros=new Set();
  $('lista-dueno').value='';
  ultimoGuardado=JSON.stringify([PREFIJO,'',8,[]]);
  nombresGuardados();pintarLista();pintarResultados();
  decir('Escribe un nombre, añade Conjuros y guarda tu lista.');
}
function seleccionar(id){
  var l=lib.listas.find(function(x){return x.id===id;});
  if(!l){abrirNueva();return;}
  actualId=l.id;maximo=l.maxCirculo;descripcion=l.descripcion;
  conjuros=new Set(l.conjuros);
  $('lista-dueno').value=l.nombre.startsWith(PREFIJO)?l.nombre.slice(PREFIJO.length):l.nombre;
  ultimoGuardado=firma();
  nombresGuardados();pintarLista();pintarResultados();
  decir('Lista guardada en este navegador.');
}
function guardar(){
  try{
    var dueno=$('lista-dueno').value.trim();
    if(!dueno)throw Error('Escribe para quién es esta Lista de Conjuros.');
    if(nombre().length>120)throw Error('El nombre de la lista es demasiado largo.');
    var data=candidato();
    data.id=actualId||idNuevo();
    var nueva=api.guardarLista(lib,data,catalogo,borradores);
    var serial=api.exportar(nueva,catalogo,borradores);
    localStorage.setItem(KEY,serial);
    lib=nueva;actualId=data.id;
    ultimoGuardado=firma();
    nombresGuardados();refrescarCabecera();
    decir('Lista guardada en este navegador.');
  }catch(e){decir('No se pudo guardar: '+e.message,true);}
}
function eliminar(){
  if(!actualId)return;
  if(!window.confirm('¿Eliminar esta lista personal del navegador?'))return;
  try{
    var nueva=api.eliminarLista(lib,actualId,catalogo,borradores);
    localStorage.setItem(KEY,api.exportar(nueva,catalogo,borradores));
    lib=nueva;abrirNueva();decir('Lista eliminada.');
  }catch(e){decir('No se pudo eliminar: '+e.message,true);}
}
function descargar(){
  try{
    var valor=api.exportar(lib,catalogo,borradores);
    var url=URL.createObjectURL(new Blob([valor],{type:'application/json;charset=utf-8'}));
    var a=crear('a');a.href=url;a.download='forja-listas-conjuros.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
    decir('Biblioteca exportada: puedes conservar una copia JSON.');
  }catch(e){decir(e.message,true);}
}
async function importar(archivo){
  if(!archivo)return;
  try{
    if(archivo.size>1024*1024)throw Error('El archivo supera 1 MB.');
    var nueva=api.importar(await archivo.text(),catalogo,borradores);
    if(!aceptarDescarte())return;
    if((lib.listas.length||lib.asociaciones.length)&&
      !window.confirm('La importación reemplazará tus listas y asociaciones personales de este navegador. ¿Continuar?'))return;
    localStorage.setItem(KEY,api.exportar(nueva,catalogo,borradores));
    lib=nueva;
    if(lib.listas.length)seleccionar(lib.listas[lib.listas.length-1].id);else abrirNueva();
    decir('Biblioteca importada correctamente.');
  }catch(e){decir('Importación rechazada: '+e.message,true);}
}
async function compartir(){
  try{
    if(hayCambios())throw Error('Guarda antes los cambios de tu lista para compartirlos.');
    var token=enlaces.codificar('spell-list','nd20',lib);
    // En la PREVIEW el servidor externo requiere /spells/index.html;
    // Pages admite /spells/. No cambiar la URL usada por LIVE.
    var ruta=location.pathname.endsWith('/index.html')?'spells/index.html':'spells/';
    var url=enlaces.crearUrl(ruta,token);
    if(!navigator.clipboard||!navigator.clipboard.writeText){
      window.prompt('Copia el enlace de tu biblioteca:',url);
      decir('Enlace listo para copiar. No sincroniza futuras ediciones.');
      return;
    }
    await navigator.clipboard.writeText(url);
    decir('Enlace copiado. Comparte una instantánea de tus listas guardadas.');
  }catch(e){decir('No se pudo compartir: '+e.message,true);}
}
function conectar(){
  $('crear-lista').addEventListener('click',function(){if(aceptarDescarte())abrirNueva();});
  $('listas-guardadas').addEventListener('change',function(){
    var destino=this.value;
    if(!aceptarDescarte()){this.value=actualId||'';return;}
    if(destino)seleccionar(destino);else abrirNueva();
  });
  $('lista-dueno').addEventListener('input',editar);
  $('filtro-nombre').addEventListener('input',pintarResultados);
  $('filtro-circulo').addEventListener('change',pintarResultados);
  $('guardar-lista').addEventListener('click',guardar);
  $('eliminar-lista').addEventListener('click',eliminar);
  $('exportar-listas').addEventListener('click',descargar);
  $('importar-archivo').addEventListener('change',function(){
    importar(this.files[0]);this.value='';
  });
  $('compartir-listas').addEventListener('click',compartir);
}
async function cargar(){
  try{
    var rutas=['data/conjuros-drs-fichas.json','data/catalogo-poderes.json',
      'data/listas-conjuros-borradores.json'];
    var datos=await Promise.all(rutas.map(async function(ruta){
      var respuesta=await fetch(ruta,{cache:'no-cache'});
      if(!respuesta.ok)throw Error('No se pudo cargar '+ruta);
      return respuesta.json();
    }));
    catalogo=api.crearCatalogo(datos[0],datos[1]);
    borradores=api.leerBorradores(datos[2],catalogo);
    var token=enlaces.fragmento();
    if(token){
      var enlace=enlaces.decodificar(token);
      if(enlace.tipo!=='spell-list'||enlace.sistema!=='nd20')
        throw Error('Este enlace no contiene Listas de Conjuros de Nd20.');
      var recibida=api.importar(JSON.stringify(enlace.datos),catalogo,borradores);
      if(!localStorage.getItem(KEY)||window.confirm('¿Importar las Listas del enlace? Reemplazará tu biblioteca actual.')){
        localStorage.setItem(KEY,api.exportar(recibida,catalogo,borradores));
      }
      history.replaceState(null,'',location.pathname+location.search);
    }
    var guardado=localStorage.getItem(KEY);
    lib=guardado?api.importar(guardado,catalogo,borradores):api.vacia(catalogo);
    var circulos=$('filtro-circulo');
    for(var c=1;c<=8;c++){var opt=crear('option','', 'Círculo '+c);opt.value=String(c);circulos.appendChild(opt);}
    cargaCompleta=true;conectar();
    if(lib.listas.length)seleccionar(lib.listas[lib.listas.length-1].id);
    else abrirNueva();
    mensajeCarga('DRS '+catalogo.versionDRS+' · '+catalogo.conjuros.length+' Conjuros verificados.');
  }catch(e){
    mensajeCarga('No se pudo abrir Conjuros: '+e.message,true);
    $('form-herramienta').hidden=true;
  }
}
cargar();
})();
