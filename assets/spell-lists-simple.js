/* Pantalla publica sencilla. El modelo DRS, las listas y los vinculos previos no se alteran. */
(function(){
'use strict';
var api=window.NaufragioListasConjuros;
var enlaces=window.NaufragioEnlaces;
var KEY='forja-listas-conjuros-v1';
var PREFIJO='Lista de Conjuros de ';
var $=function(id){return document.getElementById(id);};
var catalogo,borradores,lib,actualId=null,oficialId=null,derivadaDe=null,maximo=8,descripcion='',conjuros=new Set();
var ultimoGuardado='',cargaCompleta=false;
var KEY_FORMATO='forja-listas-conjuros-formato-v1';
function mostrarEscuela(){return $('mostrar-escuela').checked;}
function mostrarOrigen(){return $('mostrar-origen').checked;}
function presentarConjuro(s){
  var resultado=s.nombre;
  if(mostrarEscuela()&&s.escuela)resultado+=' — '+s.escuela;
  // No inferir la procedencia: la etiqueta se basa en la ficha DRS validada.
  if(mostrarOrigen()&&typeof s.fuente==='string'&&/\bDRS\b/i.test(s.fuente))
    resultado+=' [DRS]';
  return resultado;
}
function gruposOrdenados(){
  var grupos=Array.from({length:8},function(){return [];});
  conjuros.forEach(function(id){
    var s=catalogo.porId.get(id);
    if(s)grupos[s.circulo-1].push(s);
  });
  grupos.forEach(function(grupo){
    grupo.sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es');});
  });
  return grupos;
}
function listaEnTexto(){
  var lineas=[$('lista-dueno').value.trim()?
    (modoOficial()?tituloOficial():nombre()):'Lista de Conjuros',''];
  gruposOrdenados().forEach(function(grupo,i){
    if(!grupo.length)return;
    lineas.push('Círculo '+(i+1));
    grupo.forEach(function(s){lineas.push('- '+presentarConjuro(s));});
    lineas.push('');
  });
  return lineas.join('\n').trim();
}
function guardarFormato(){
  try{localStorage.setItem(KEY_FORMATO,JSON.stringify({
    escuela:mostrarEscuela(),origen:mostrarOrigen()
  }));}catch(e){}
}
function recuperarFormato(){
  try{
    var f=JSON.parse(localStorage.getItem(KEY_FORMATO)||'{}');
    $('mostrar-escuela').checked=f.escuela===true;
    $('mostrar-origen').checked=f.origen===true;
  }catch(e){}
}
async function copiarLista(){
  if(!conjuros.size){decir('Añade algún Conjuro antes de copiar la lista.',true);return;}
  var texto=listaEnTexto();
  try{
    if(!navigator.clipboard||typeof navigator.clipboard.writeText!=='function')
      throw Error('Portapapeles no disponible');
    await navigator.clipboard.writeText(texto);
    decir('Lista copiada al portapapeles.');
  }catch(e){
    // Permisos de portapapeles bloqueados: permitir selección manual.
    var respuesta=window.prompt('Copia el texto de tu lista:',texto);
    decir(respuesta===null?
      'Copia cancelada; no se ha modificado la lista.':
      'Texto preparado para copiar manualmente.');
  }
}

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
// Correspondencias cerradas con los nombres oficiales de Escuela del DRS.
// Los SVG son decorativos: el nombre y la Escuela permanecen en texto.
var ICONOS_ESCUELA=Object.freeze({
  'Arcana':'escuela-arcana.svg',
  'Divina':'escuela-divina.svg',
  'Nigromancia':'escuela-nigromancia.svg',
  'Elemental':'escuela-elemental.svg',
  'Demonología':'escuela-demonologia.svg',
  'Naturaleza':'escuela-naturaleza.svg'
});
function crearIconoEscuela(escuela){
  if(!Object.prototype.hasOwnProperty.call(ICONOS_ESCUELA,escuela))return null;
  var imagen=crear('img','icono-escuela');
  imagen.src='assets/icons/'+ICONOS_ESCUELA[escuela];
  imagen.alt='';
  imagen.setAttribute('aria-hidden','true');
  imagen.width=24;imagen.height=24;
  imagen.decoding='async';
  return imagen;
}
// Papelera original en SVG; se crea mediante DOM para evitar HTML inyectado.
function crearIconoPapelera(){
  var ns='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('class','icono-papelera');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  var trazos=document.createElementNS(ns,'path');
  trazos.setAttribute('d','M4.5 7h15 M9 7V4.8h6V7 M5.6 7l.9 13h11l.9-13 M10 10.5v6.2 M14 10.5v6.2');
  svg.appendChild(trazos);
  return svg;
}
function nombre(){return PREFIJO+$('lista-dueno').value.trim();}
function modoOficial(){return !!oficialId;}
function tituloOficial(){return 'Lista de Conjuros del '+oficialId.slice(4)+' (DRS)';}
function idNuevo(){
  if(!crypto||!crypto.getRandomValues)throw Error('Para guardar se necesita HTTPS o localhost.');
  var b=new Uint8Array(16);crypto.getRandomValues(b);
  return 'usuario:'+Array.from(b,function(x){return x.toString(16).padStart(2,'0');}).join('');
}
function candidato(){
  var datos={id:actualId||'usuario:pendiente0000',nombre:nombre(),descripcion:descripcion,
    maxCirculo:maximo,conjuros:Array.from(conjuros)};
  if(derivadaDe)datos.derivadaDe=derivadaDe;
  return datos;
}
function firma(){var c=candidato();return JSON.stringify([c.nombre,c.descripcion,c.maxCirculo,c.conjuros.slice().sort()]);}
function hayCambios(){return firma()!==ultimoGuardado;}
function aceptarDescarte(){
  return !hayCambios()||window.confirm('Tienes cambios sin guardar en esta lista. ¿Descartarlos?');
}
function nombresGuardados(){
  var select=$('listas-guardadas');
  var anterior=oficialId||actualId||'';
  select.replaceChildren();
  var opcion=crear('option','', 'Nueva lista');
  opcion.value='';select.appendChild(opcion);
  var oficiales=crear('optgroup');
  oficiales.label='Listas oficiales DRS — solo lectura';
  catalogo.oficiales.forEach(function(l){
    var nombreOcupacion=l.id.slice(4);
    var opt=crear('option','',nombreOcupacion+' — DRS (solo lectura)');
    opt.value=l.id;oficiales.appendChild(opt);
  });
  select.appendChild(oficiales);
  if(lib.listas.length){
    var personales=crear('optgroup');
    personales.label='Mis listas guardadas';
    lib.listas.forEach(function(l){
      var opt=crear('option','',l.nombre);
      opt.value=l.id;personales.appendChild(opt);
    });
    select.appendChild(personales);
  }
  select.value=anterior;
  $('panel-guardadas').hidden=false;
}
function refrescarCabecera(){
  $('titulo-lista').textContent=modoOficial()?tituloOficial():
    ($('lista-dueno').value.trim()?nombre():'Lista de Conjuros de…');
  $('cuenta-lista').textContent=conjuros.size+' Conjuros';
  $('copiar-lista').disabled=conjuros.size===0;
  $('guardar-lista').disabled=modoOficial();
  $('eliminar-lista').disabled=modoOficial()||!actualId;
  $('compartir-listas').disabled=modoOficial();
  $('duplicar-oficial').hidden=!modoOficial();
  var aviso=$('nota-lista-oficial');
  aviso.hidden=!modoOficial();
  if(modoOficial())aviso.textContent='Lista oficial del DRS: solo lectura. '+
    (oficialId==='drs:Mago'?
      'Este es el repertorio disponible, no el grimorio inicial: el Mago comienza con 2 Conjuros del Primer Círculo a elegir. ':
      'Este es el repertorio disponible para el Clérigo. ')+
    'Puedes copiar su texto o pulsar «Duplicar para editar» y trabajar en una copia personal.';
}
function editar(){
  if(!cargaCompleta||modoOficial())return;
  refrescarCabecera();
  if(hayCambios())decir('Cambios sin guardar. Pulsa Guardar lista.');
  else decir('Lista guardada en este navegador.');
}
function pintarLista(){
  var cont=$('lista-circulos');
  var frag=document.createDocumentFragment();
  var grupos=gruposOrdenados();
  var total=0;
  grupos.forEach(function(grupo,i){
    if(!grupo.length)return;
    total+=grupo.length;
    var seccion=crear('section','bloque-circulo');
    seccion.setAttribute('aria-label','Círculo '+(i+1));
    var titulo=crear('h3','', 'Círculo '+(i+1));
    seccion.appendChild(titulo);
    var ul=crear('ul','conjuros-seleccionados');
    grupo.forEach(function(s){
      var li=crear('li','conjuro-seleccionado');
      // El medallón es decorativo y no altera el texto de la lista ni su copia.
      var icono=crearIconoEscuela(s.escuela);
      if(icono)li.appendChild(icono);
      // Misma cadena visible y copiable que antes; solo se separa visualmente
      // el nombre de los metadatos para rebajar su peso tipográfico.
      var texto=crear('span','conjuro-texto');
      texto.appendChild(crear('strong','',s.nombre));
      var metadatos=presentarConjuro(s).slice(s.nombre.length);
      if(metadatos)texto.appendChild(crear('small','conjuro-metadatos',metadatos));
      li.appendChild(texto);
      if(!modoOficial()){
        var boton=crear('button','quitar-conjuro');
        boton.type='button';boton.dataset.id=s.id;
        boton.setAttribute('aria-label','Quitar '+s.nombre+' de la lista');
        boton.title='Quitar '+s.nombre+' de la lista';
        boton.appendChild(crearIconoPapelera());
        boton.addEventListener('click',function(){
          conjuros.delete(s.id);pintarLista();pintarResultados();editar();
        });
        li.appendChild(boton);
      }
      ul.appendChild(li);
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
// Las facetas se calculan sobre el DRS: cada selector depende del OTRO,
// no del suyo ni de la consulta de nombre, evitando estados imposibles.
function facetasConjuros(fichas,circulo,escuela){
  var circulos=Array.from(new Set(fichas.filter(function(s){
    return !escuela||s.escuela===escuela;
  }).map(function(s){return s.circulo;}))).sort(function(a,b){return a-b;});
  var escuelas=Array.from(new Set(fichas.filter(function(s){
    return !circulo||s.circulo===circulo;
  }).map(function(s){return s.escuela;}))).sort(function(a,b){
    return a.localeCompare(b,'es');
  });
  return {circulos:circulos,escuelas:escuelas};
}
function filtrarConjuros(fichas,nombre,circulo,escuela){
  var buscar=normalizar(nombre.trim());
  return fichas.filter(function(s){
    return (!circulo||s.circulo===circulo)&&
      (!escuela||s.escuela===escuela)&&
      (!buscar||normalizar(s.nombre).includes(buscar));
  });
}
function actualizarOpcionesFiltros(){
  if(!catalogo)return;
  var seleccionCirculo=$('filtro-circulo').value;
  var seleccionEscuela=$('filtro-escuela').value;
  var facetas=facetasConjuros(catalogo.conjuros,
    Number(seleccionCirculo)||0,seleccionEscuela);
  function opciones(selector,valores,etiquetaTodos,etiqueta){
    var anterior=selector.value;
    var siguientes=[''].concat(valores.map(String));
    var existentes=Array.from(selector.options,function(o){return o.value;});
    // Si no cambia el conjunto disponible, no reconstruir un <select> abierto.
    if(existentes.length===siguientes.length&&
      existentes.every(function(v,i){return v===siguientes[i];}))return;
    var fragmento=document.createDocumentFragment();
    var todos=crear('option','',etiquetaTodos);todos.value='';
    fragmento.appendChild(todos);
    valores.forEach(function(valor){
      var opcion=crear('option','',etiqueta?etiqueta+valor:valor);
      opcion.value=String(valor);fragmento.appendChild(opcion);
    });
    selector.replaceChildren(fragmento);
    selector.value=siguientes.includes(anterior)?anterior:'';
  }
  opciones($('filtro-circulo'),facetas.circulos,'Todos','Círculo ');
  opciones($('filtro-escuela'),facetas.escuelas,'Todas','');
}
function pintarResultados(){
  if(!catalogo)return;
  var nombre=$('filtro-nombre').value.trim();
  var circulo=Number($('filtro-circulo').value)||0;
  var escuela=$('filtro-escuela').value;
  if(!nombre&&!circulo&&!escuela){
    $('cuenta-busqueda').textContent=catalogo.conjuros.length+' Conjuros disponibles';
    $('resultados-busqueda').replaceChildren(crear('p','lista-vacia',
      'Escribe el nombre de un Conjuro, elige un Círculo o selecciona una Escuela.'));
    return;
  }
  var resultados=filtrarConjuros(catalogo.conjuros,nombre,circulo,escuela)
    .sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es');});
  var limite=18;
  $('cuenta-busqueda').textContent=resultados.length+' encontrados'+
    (resultados.length>limite?' · mostrando '+limite:'');
  var frag=document.createDocumentFragment();
  resultados.slice(0,limite).forEach(function(s){
    var fila=crear('article','resultado-conjuro');
    var texto=crear('div','resultado-descripcion');
    var titulo=crear('div','resultado-titulo');
    var icono=crearIconoEscuela(s.escuela);
    if(icono)titulo.appendChild(icono);
    titulo.appendChild(crear('strong','',s.nombre));
    texto.appendChild(titulo);
    texto.appendChild(crear('small','', 'Círculo '+s.circulo+' · '+s.escuela));
    var detalle=crear('details','conjuro-detalle');
    detalle.appendChild(crear('summary','', 'Leer descripción'));
    detalle.appendChild(crear('p','',s.texto_normativo));
    texto.appendChild(detalle);
    fila.appendChild(texto);
    var incluido=conjuros.has(s.id),bloqueado=modoOficial();
    var btn=crear('button','anadir-conjuro',bloqueado?'Solo lectura':(incluido?'Añadido':'Añadir'));
    btn.type='button';btn.disabled=bloqueado||incluido;btn.dataset.id=s.id;
    btn.setAttribute('aria-label',bloqueado?
      'Lista oficial de solo lectura; duplica para añadir '+s.nombre:
      (incluido?'Conjuro ya añadido: ':'Añadir Conjuro: ')+s.nombre);
    btn.addEventListener('click',function(){
      if(!modoOficial()&&!conjuros.has(s.id)){
        conjuros.add(s.id);maximo=Math.max(maximo,s.circulo);
        pintarLista();pintarResultados();editar();
      }
    });
    fila.appendChild(btn);frag.appendChild(fila);
  });
  if(!resultados.length)frag.appendChild(crear('p','lista-vacia',
    'No se han encontrado Conjuros con estos filtros. Cambia el nombre, Círculo o Escuela.'));
  $('resultados-busqueda').replaceChildren(frag);
}
function abrirNueva(){
  actualId=null;oficialId=null;derivadaDe=null;maximo=8;descripcion='';conjuros=new Set();
  $('lista-dueno').readOnly=false;
  $('lista-dueno').value='';
  ultimoGuardado=JSON.stringify([PREFIJO,'',8,[]]);
  nombresGuardados();pintarLista();pintarResultados();
  decir('Escribe un nombre, añade Conjuros y guarda tu lista.');
}
function seleccionarOficial(id){
  var l=catalogo.oficiales.find(function(x){return x.id===id;});
  if(!l){abrirNueva();return;}
  actualId=null;oficialId=l.id;derivadaDe=null;
  maximo=l.maxCirculo;descripcion=l.descripcion;conjuros=new Set(l.conjuros);
  $('lista-dueno').value=l.id.slice(4);
  $('lista-dueno').readOnly=true;
  ultimoGuardado=firma();
  nombresGuardados();pintarLista();pintarResultados();
  decir('Referencia oficial del DRS. Puedes consultarla y copiarla, pero no modificarla.');
}
function seleccionar(id){
  if(catalogo.oficiales.some(function(l){return l.id===id;})){
    seleccionarOficial(id);return;
  }
  var l=lib.listas.find(function(x){return x.id===id;});
  if(!l){abrirNueva();return;}
  actualId=l.id;oficialId=null;derivadaDe=l.derivadaDe||null;
  maximo=l.maxCirculo;descripcion=l.descripcion;
  conjuros=new Set(l.conjuros);
  $('lista-dueno').readOnly=false;
  $('lista-dueno').value=l.nombre.startsWith(PREFIJO)?l.nombre.slice(PREFIJO.length):l.nombre;
  ultimoGuardado=firma();
  nombresGuardados();pintarLista();pintarResultados();
  decir('Lista guardada en este navegador.');
}
function duplicarOficial(){
  if(!modoOficial())return;
  try{
    var idOriginal=oficialId;
    var id=idNuevo();
    var nombreCopia=PREFIJO+idOriginal.slice(4)+' (copia)';
    var nueva=api.duplicarLista(lib,idOriginal,id,nombreCopia,catalogo,borradores);
    localStorage.setItem(KEY,api.exportar(nueva,catalogo,borradores));
    lib=nueva;seleccionar(id);
    decir('Copia personal creada y guardada: ahora puedes editarla.');
  }catch(e){decir('No se pudo duplicar: '+e.message,true);}
}
function guardar(){
  if(modoOficial()){decir('No se pueden modificar las Listas oficiales del DRS.',true);return;}
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
  if(modoOficial()||!actualId)return;
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
    if(modoOficial())throw Error('Duplica primero la Lista oficial para compartir tu copia personal.');
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
  $('duplicar-oficial').addEventListener('click',duplicarOficial);
  $('listas-guardadas').addEventListener('change',function(){
    var destino=this.value;
    if(!aceptarDescarte()){this.value=oficialId||actualId||'';return;}
    if(destino)seleccionar(destino);else abrirNueva();
  });
  $('lista-dueno').addEventListener('input',editar);
  $('filtro-nombre').addEventListener('input',pintarResultados);
  ['filtro-circulo','filtro-escuela'].forEach(function(id){
    $(id).addEventListener('change',function(){
      actualizarOpcionesFiltros();
      pintarResultados();
    });
  });
  $('guardar-lista').addEventListener('click',guardar);
  $('copiar-lista').addEventListener('click',copiarLista);
  ['mostrar-escuela','mostrar-origen'].forEach(function(id){
    $(id).addEventListener('change',function(){
      guardarFormato();pintarLista();
    });
  });
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
    actualizarOpcionesFiltros();
    recuperarFormato();
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
