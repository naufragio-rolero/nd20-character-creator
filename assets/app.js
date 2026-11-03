/* Interfaz estática y progresiva. Toda la generación ocurre en el navegador. */
(function () {
  'use strict';
  var reglas = window.NaufragioRules;
  var poderes = window.NaufragioPoderes;
  var infoUI = window.NaufragioInfoUI;
  var sexoApi = window.NaufragioSexo;
  var datos = {};
  var entradas = [];
  var correlativo = 0;
  var borrador = null;
  var compraBorrador = null;
  var armamentoBorrador = null;
  var gestionBorrador = null;
  var revisionBorrador = null;
  var fuentesGuardadas = {};
  var ultimaReproduccion = null;
  var volverGestionEquipo = null;
  var sistemasVisibles={
    nd20:'Naufragio d20 · Fantasía Épica',
    nd20_nocturna:'Naufragio d20 · Nocturna',
    nd20_cifi:'Naufragio d20 · CiFi',
    dh:'Dungeon Hack'
  };
  function nombreSistema(id){return sistemasVisibles[id]||id;}
  var $ = function (id) {return document.getElementById(id);};
  function aviso(mensaje, esError) {
    $('estado').textContent = mensaje || '';
    $('estado').className = 'estado' + (esError ? ' error' : '');
  }
  function esc(valor) {
    return String(valor === undefined || valor === null ? '' : valor)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function selecciones(id, elementos, mantener) {
    var sel = $(id), previo = mantener ? sel.value : '';
    sel.textContent = '';
    var aleatorio = document.createElement('option');
    aleatorio.value = '';
    aleatorio.textContent = 'Aleatoria';
    sel.appendChild(aleatorio);
    elementos.forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = item.nombre;
      sel.appendChild(opt);
    });
    if (elementos.some(function (x) {return x.key === previo;})) sel.value = previo;
  }
  // El <select> original continúa siendo la fuente de verdad y opción
  // accesible de respaldo; las tarjetas solo cambian su valor.
  var pictogramas={
    ocupacion:{'Clérigo':'ocu-clerigo','Guerrero':'ocu-guerrero',
      'Mago':'ocu-mago','Ladrón':'ocu-ladron'},
    especie:{'Elfo agreste':'esp-elfo','Enano montañés':'esp-enano',
      'Humano común':'esp-humano','Mediano amable':'esp-mediano',
      'Gnomo urbano':'esp-gnomo','Semielfo':'esp-semielfo',
      'Orco común':'esp-orco','Semiorco':'esp-semiorco'}
  };
  // Las mascaras CSS se resuelven desde assets/styles.css. Con rutas relativas
  // a la pagina acababan solicitando assets/assets/icons/*.svg: el navegador
  // dibujaba un hueco transparente sin generar errores JavaScript.
  // Normalizamos la URL desde el documento para cualquier ruta de despliegue.
  function urlIcono(id){
    return 'url('+new URL('assets/icons/'+id+'.svg',document.baseURI).href+')';
  }
  // Selector de una sola opción, estilo rejilla de personajes de lucha.
  // El select nativo conserva el estado de reglas y es respaldo accesible.
  // Varias candidatas permitidas, una sola Especie/Ocupación por personaje.
  // Ninguna marca significa aleatorio entre todas las disponibles.
  var candidatosSelector={ocupacion:[],especie:[]};
  // Al quitar temporalmente todas las fuentes, los selectores se vacían.
  // Conservar la elección anterior para recuperarla al corregir el error.
  var seleccionesPausadas={};
  function refrescarFuentesConPreservacion(){
    var juego=$('juego').value,hayDisponibles=juego==='dh'?
      origenesActivos().length>0:fuentesNd20Activas().length>0;
    if(!hayDisponibles&&!seleccionesPausadas[juego]){
      seleccionesPausadas[juego]={
        ocupacion:candidatosSelector.ocupacion.slice(),
        especie:candidatosSelector.especie.slice(),
        ocupacionDirecta:$('ocupacion').value,
        especieDirecta:$('especie').value
      };
    }
    refrescarSelectores();
    if(hayDisponibles&&seleccionesPausadas[juego]){
      var anterior=seleccionesPausadas[juego];
      ['ocupacion','especie'].forEach(function(tipo){
        var disponibles=Array.from($(tipo).options).map(function(x){return x.value;});
        var valor=anterior[tipo+'Directa'];
        $(tipo).value=disponibles.includes(valor)?valor:'';
        candidatosSelector[tipo]=anterior[tipo].filter(function(x){
          return disponibles.includes(x);
        });
        marcarTarjetasSeleccionadas(tipo);
      });
      delete seleccionesPausadas[juego];
      refrescarResumenCreacion();
    }
  }
  var borradorSelector={ocupacion:[],especie:[]};
  function marcarCeldas(tipo,seleccion){
    $('selector-visual-'+tipo).querySelectorAll('button.opcion-visual')
      .forEach(function(boton){
        var elegido=boton.dataset.valor?
          seleccion.includes(boton.dataset.valor):seleccion.length===0;
        boton.classList.toggle('seleccionada',elegido);
        boton.setAttribute('aria-pressed',String(elegido));
      });
  }
  function refrescarTarjetas(tipo){
    var select=$(tipo),contenedor=$('selector-visual-'+tipo);
    var abrir=$('abrir-selector-'+tipo),visual=!!datos.dh;
    abrir.hidden=!visual;abrir.disabled=select.disabled;
    select.classList.toggle('selector-alternativo',visual);
    if(!visual){contenedor.replaceChildren();return;}
    var disponibles=Array.from(select.options).map(function(x){return x.value;});
    candidatosSelector[tipo]=candidatosSelector[tipo].filter(function(x){
      return disponibles.includes(x);
    });
    contenedor.replaceChildren();
    Array.from(select.options).forEach(function(op){
      var key=pictogramas[tipo][op.value];
      var boton=document.createElement('button');
      boton.type='button';boton.className='opcion-visual';
      boton.dataset.valor=op.value;
      boton.disabled=op.disabled||select.disabled;
      var nombre=op.textContent||'Aleatoria';
      boton.setAttribute('aria-label',tipo+': '+nombre);
      var dibujo;
      if(key){
        dibujo=document.createElement('span');
        dibujo.className='icono-svg icono-eleccion';
        dibujo.style.setProperty('--icono-svg',urlIcono(key));
        dibujo.setAttribute('aria-hidden','true');
      }else{
        dibujo=document.createElement('span');
        dibujo.className='icono-azar';
        dibujo.textContent=op.value?nombre.trim().slice(0,2).toUpperCase():'?';
        dibujo.setAttribute('aria-hidden','true');
      }
      var etiqueta=document.createElement('span');
      etiqueta.className='opcion-nombre';etiqueta.textContent=nombre;
      boton.append(dibujo,etiqueta);
      contenedor.appendChild(boton);
    });
    marcarTarjetasSeleccionadas(tipo);
  }
  function marcarTarjetasSeleccionadas(tipo){
    var pool=candidatosSelector[tipo],select=$(tipo);
    var nombres=pool.map(function(k){
      return Array.from(select.options).find(function(op){return op.value===k;})?.textContent||k;
    });
    $('valor-elegido-'+tipo).textContent=!pool.length?'Aleatoria':
      pool.length===1?nombres[0]:pool.length+' opciones';
    marcarCeldas(tipo,pool);
  }
  function refrescarTarjetasVisibles(){
    refrescarTarjetas('ocupacion');
    refrescarTarjetas('especie');
  }
  // Resumen informativo de los ajustes activos en el diálogo.
  function refrescarResumenCreacion(){
    function poner(id,valor){$(id).textContent=String(valor);}
    var minimo=$('nivel-min').value,maximo=$('nivel-max').value;
    poner('resumen-sistema',nombreSistema($('juego').value));
    poner('resumen-nivel',minimo&&maximo?
      (minimo===maximo?'Nivel '+minimo:'Niveles '+minimo+'–'+maximo):
      'Intervalo sin completar');
    poner('resumen-ocupacion',$('valor-elegido-ocupacion').textContent);
    poner('resumen-especie',$('valor-elegido-especie').textContent);
    poner('resumen-sexo',$('sexo-pj').selectedOptions[0]?.textContent||'Aleatorio');
    poner('resumen-modo',dhModo($('juego').value)==='personalizado'?'Personalizado':'Rápido');
    poner('resumen-cantidad',$('cantidad').value||'1');
  }
  function refrescarGenerarFlotante(){
    var boton=$('generar-flotante'),principal=$('generar');
    var plural=Number($('cantidad').value)>1;
    boton.textContent=plural?'Generar personajes':'Generar personaje';
    principal.textContent=plural?'Generar personajes':'Generar personaje';
    $('generar-dialogo').textContent=principal.textContent;
    boton.disabled=principal.disabled||!!borrador;
    var rect=principal.getBoundingClientRect();
    var principalVisible=!$('panel-personajes').hidden&&
      rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<innerHeight;
    var pie=document.querySelector('.pie').getBoundingClientRect();
    // Retirar el flotante ANTES del pie (también en pantallas pequeñas).
    var pieCerca=pie.top<=innerHeight+80&&pie.bottom>=0;
    // Con la mesa vacía, el CTA es accesible desde el primer momento
    // incluso con el panel móvil cerrado. Después respeta pie y botón principal.
    var mesaVacia=entradas.length===0;
    boton.hidden=$('panel-personajes').hidden||$('dialogo-configuracion').open||
      (!mesaVacia&&(principalVisible||pieCerca));
  }
  function observarGenerarFlotante(){
    var pendiente=false;
    function actualizar(){
      if(pendiente)return;
      pendiente=true;
      requestAnimationFrame(function(){
        pendiente=false;refrescarGenerarFlotante();
      });
    }
    window.addEventListener('scroll',actualizar,{passive:true});
    window.addEventListener('resize',actualizar,{passive:true});
  }
  function origenesActivos() {
    return Array.from(document.querySelectorAll('#origenes input:checked')).map(function (e) {
      return Number(e.value);
    });
  }
  function refrescarBotonesSistema() {
    var juego=$('juego').value;
    document.querySelectorAll('.juegos-compactos [data-juego]').forEach(function(button){
      var activo=button.dataset.juego===juego;
      button.classList.toggle('sistema-activo',activo);
      button.setAttribute('aria-pressed',String(activo));
    });
  }
  function marcarPanel(nombre){
    var tools=nombre==='herramientas';
    $('panel-personajes').hidden=tools;
    $('panel-herramientas').hidden=!tools;
    refrescarGenerarFlotante();
    ['personajes','herramientas'].forEach(function(key){
      var button=$('tab-'+key),selected=key===nombre;
      button.classList.toggle('activa',selected);
      button.setAttribute('aria-selected',String(selected));
      button.tabIndex=selected?0:-1;
    });
  }
  function fuentesNd20Activas(){
    return Array.from(document.querySelectorAll('#fuentes-nd20 input:checked')).map(function(e){
      return e.value;
    });
  }
  function datosJuego(juego){
    return juego==='nd20_cifi' ? datos.cifi : juego==='nd20_nocturna' ? datos.nocturna : datos.fantasia;
  }
  function configurarFuentesNd20(juego,grupo){
    var cont=$('fuentes-nd20');
    if(cont.dataset.juego===juego)return;
    var nombres=Array.from(new Set(Object.values(grupo.fuentes.ocupaciones)
      .concat(Object.values(grupo.fuentes.especies)))).sort(function(a,b){
      if(a==='DRS')return -1;
      if(b==='DRS')return 1;
      return a.localeCompare(b,'es');
    });
    // Forja 1.0: las fuentes de los DLC de Fantasía no están publicadas.
    // No borramos sus datos: el manifiesto podrá habilitarlas en futuras versiones.
    if(juego==='nd20'){
      var publicadas=datos.alcanceDRS?.fuentes_publicadas_fantasia||['DRS'];
      nombres=nombres.filter(function(nombre){return publicadas.includes(nombre);});
    }
    var previas=fuentesGuardadas[juego];
    cont.textContent='';
    nombres.forEach(function(nombre){
      var label=document.createElement('label'),input=document.createElement('input');
      label.className='casilla';
      input.type='checkbox';
      input.value=nombre;
      input.checked=!previas||previas.indexOf(nombre)!==-1;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' '+nombre));
      cont.appendChild(label);
    });
    cont.dataset.juego=juego;
  }
  function refrescarSelectores() {
    if (!datos.dh) return;
    if(!['nd20','dh'].includes($('juego').value))$('juego').value='nd20';
    var juego = $('juego').value, dh = juego === 'dh';
    refrescarBotonesSistema();
    $('opciones-dh').hidden = !dh;
    $('opciones-fuentes').hidden = dh;
    $('aviso-alcance-drs').hidden = juego!=='nd20';
    $('opciones-nombres-ylat').hidden = juego!=='nd20';
    $('opciones-riqueza-nivel').hidden=dh||juego==='nd20_nocturna';
    $('modos-creacion').hidden = dh;
    $('opciones-contexto-sexo').hidden=dh;
    $('generar-seguidor').disabled = !dh;
    ['nivel-min','nivel-max'].forEach(function(id){
      $(id).max=dh?'36':'30';
    });
    $('rango-nivel').textContent = dh ? '1–36' : '1–30';
    $('con-especie').disabled = !dh;
    $('especie').disabled = dh && !$('con-especie').checked;
    if (dh) {
      var orig = origenesActivos();
      var claves = Object.keys(datos.dh.classes).filter(function(key){
        return orig.indexOf(datos.dh.classes[key].origin)!==-1;
      });
      selecciones('ocupacion', claves.map(function(key){
        return {key:key,nombre:datos.dh.classes[key].name+
          ' ('+(datos.dh.origins[datos.dh.classes[key].origin]||'Dungeon Hack')+')'};
      }).sort(ordenar),true);
      selecciones('especie', Object.keys(datos.dh.races).filter(function(key){
        return orig.indexOf(datos.dh.races[key].origin)!==-1;
      }).map(function(key){
        return {key:key,nombre:datos.dh.races[key].name+
          ' ('+(datos.dh.origins[datos.dh.races[key].origin]||'Dungeon Hack')+')'};
      }).sort(ordenar),true);
    } else {
      var d=datosJuego(juego);
      configurarFuentesNd20(juego,d);
      var fuentes=fuentesNd20Activas();
      var sexoElegido=$('sexo-pj').value;
      var respetar=$('respetar-contexto-sexo').checked;
      selecciones('ocupacion',Object.keys(d.ocupaciones).filter(function(key){
        return fuentes.indexOf(d.fuentes.ocupaciones[key])!==-1 &&
          (sexoElegido!=='masculino'||!respetar||!sexoApi||
            sexoApi.ocuparPermitida(key,'masculino',datos.sexo,true));
      }).map(function(key){
        return {key:key,nombre:key+' ('+d.fuentes.ocupaciones[key]+')'};
      }).sort(ordenar),true);
      selecciones('especie',Object.keys(d.especies).filter(function(key){
        return fuentes.indexOf(d.fuentes.especies[key])!==-1;
      }).map(function(key){
        return {key:key,nombre:key+' ('+d.fuentes.especies[key]+')'};
      }).sort(ordenar),true);
    }
    refrescarTarjetasVisibles();
    validarNivelVisible();
    validarFuentesVisibles();
    refrescarResumenCreacion();
    refrescarGenerarFlotante();
  }
  function ordenar(a,b) {return a.nombre.localeCompare(b.nombre, 'es');}
  function dhModo(juego) {
    if(juego==='dh')return 'rapido';
    return document.querySelector('input[name="modo-creacion"]:checked').value;
  }
  function validarNivelVisible(){
    var campos=[$('nivel-min'),$('nivel-max')],maximo=Number(campos[0].max);
    var validos=campos.every(function(c){return c.value.trim()!==''&&
      Number.isInteger(c.valueAsNumber)&&c.valueAsNumber>=1&&c.valueAsNumber<=maximo;});
    var invertido=validos&&campos[0].valueAsNumber>campos[1].valueAsNumber;
    var mensaje=!validos?'Escribe dos Niveles enteros entre 1 y '+maximo+
      ' para el sistema seleccionado.':invertido?
      'El Nivel mínimo no puede superar al máximo.':'';
    $('aviso-nivel').textContent=mensaje;
    campos.forEach(function(c){
      if(mensaje)c.setAttribute('aria-invalid','true');
      else c.removeAttribute('aria-invalid');
    });
    return !mensaje;
  }
  function validarFuentesVisibles(){
    var dh=$('juego').value==='dh';
    var field=$(dh?'opciones-dh':'opciones-fuentes');
    var avisoCampo=$(dh?'aviso-origenes':'aviso-fuentes');
    var validas=dh?origenesActivos():fuentesNd20Activas();
    var mensaje=validas.length?'':dh?
      'Marca al menos una procedencia para Dungeon Hack.':
      'Selecciona al menos una fuente para generar personajes.';
    avisoCampo.textContent=mensaje;
    field.setAttribute('aria-invalid',String(!!mensaje));
    $(dh?'aviso-fuentes':'aviso-origenes').textContent='';
    $(dh?'opciones-fuentes':'opciones-dh').removeAttribute('aria-invalid');
    return !mensaje;
  }
  function config() {
    var juego=$('juego').value, nivelMin=$('nivel-min').valueAsNumber,
      nivelMax=$('nivel-max').valueAsNumber;
    if(!validarNivelVisible())
      throw Error($('aviso-nivel').textContent);
    var cantidad=$('cantidad').valueAsNumber;
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 12)
      throw Error('Puedes generar entre 1 y 12 fichas a la vez.');
    var origenes=origenesActivos(),fuentes=juego==='dh'?null:fuentesNd20Activas();
    if(!validarFuentesVisibles())
      throw Error($(juego==='dh'?'aviso-origenes':'aviso-fuentes').textContent);
    var modo = dhModo(juego);
    if(modo==='personalizado' && cantidad!==1)
      throw Error('El modo Personalizado crea una ficha por vez. Selecciona cantidad 1.');
    return {juego:juego, nivel:nivelMin, nivelMin:nivelMin,nivelMax:nivelMax,
      cantidad:cantidad, modo:modo,
      ocupacion:$('ocupacion').value, especie:$('especie').value,
      ocupacionesPermitidas:candidatosSelector.ocupacion.slice(),
      especiesPermitidas:candidatosSelector.especie.slice(),
      conEspecie:$('con-especie').checked, origenes:origenes, fuentes:fuentes,
      nombre:$('nombre-personaje').value.trim(),
      sexo:$('sexo-pj').value,
      respetarContextoSexo:$('respetar-contexto-sexo').checked,
      modoNombre:$('modo-nombre').value,
      riquezaPorNivel:(juego==='nd20'||juego==='nd20_cifi')&&
        $('riqueza-por-nivel').checked};
  }
  function mostrarErrorConfiguracion(error){
    var texto=error?.message||String(error);
    aviso(texto,true);
    $('aviso-configuracion').textContent=texto;
    var dialogo=$('dialogo-configuracion');
    // Un dialog anidado en el panel móvil no puede ser visible si su
    // antecesor tiene display:none. Mostrar el panel antes del modal.
    if(window.matchMedia('(max-width:830px)').matches)alternarMenu(true);
    if(!dialogo.open)dialogo.showModal();
    var destino=!validarNivelVisible()?$('nivel-min'):
      !validarFuentesVisibles()?
        $(($('juego').value==='dh'?'origenes':'fuentes-nd20'))
          .querySelector('input')||$('titulo-dialogo-configuracion'):
        $('cantidad');
    destino.focus({preventScroll:true});
    destino.scrollIntoView({block:'center',behavior:'auto'});
    refrescarGenerarFlotante();
  }
  function crearFicha(cfg, rng) {
    if (cfg.juego === 'dh') return reglas.eleccionDH(datos.dh,cfg,rng);
    return reglas.crearNd20(datosJuego(cfg.juego),
      Object.assign({},cfg,{aplazarElecciones:true,
        componentesYlat:datos.componentesYlat,
        nombresHistoricosYlat:datos.nombresHistoricosYlat,
        catalogoEquipo:datos.equipoInicial,catalogoSexo:datos.sexo}),rng);
  }
  function fuentesFicha(personaje){
    var ocupacion=personaje.procedenciaOcupacion||personaje.origen||'Sin especificar';
    var especie=personaje.procedenciaEspecie;
    return 'Fuente · Ocupación: '+ocupacion+(especie?' · Especie: '+especie:'');
  }
  function alternarMenu(abierto){
    $('panel-forja').classList.toggle('panel-abierto',abierto);
    $('alternar-menu').setAttribute('aria-expanded',String(abierto));
    $('alternar-menu').setAttribute('aria-label',
      abierto?'Cerrar menú de la forja':'Abrir menú de la forja');
    refrescarGenerarFlotante();
  }
  function cerrarMenuMovil(){
    if(window.matchMedia('(max-width:830px)').matches)alternarMenu(false);
  }
  function sistemaFicha(p){
    return p.juego.includes('CiFi')?'nd20_cifi':
      p.juego.includes('Nocturna')?'nd20_nocturna':
      p.juego.includes('Fantasía')?'nd20':'dh';
  }
  // Procedencia literal frente a adquisición del personaje. Herencia dual
  // no cambia el origen de Buen desarrollo, Linaje feérico ni Ira interna.
  function procedenciaTalentoDRS(personaje,nombre){
    if(!personaje||sistemaFicha(personaje)!=='nd20')
      return {fuente:'',adquisicion:''};
    var partes=personaje.descripcion.split(' · ');
    var ocupacion=partes[0],especie=partes.slice(1).join(' · ');
    var registros=datos.talentosDRS?.registros||[];
    function existe(tipo,propietario){
      return registros.some(function(r){
        return r.tipo_origen===tipo&&r.propietario===propietario&&r.nombre===nombre;
      });
    }
    if(existe('Especie',especie))
      return {fuente:'Especie: '+especie,adquisicion:''};
    if(existe('Ocupación',ocupacion))
      return {fuente:'Ocupación: '+ocupacion,adquisicion:''};
    // Únicamente las alternativas expresas del DRS, nunca parentescos
    // deducidos por el nombre de la Especie.
    var heredados={
      'Semielfo':{'Buen desarrollo':'Humano común','Linaje feérico':'Elfo agreste'},
      'Semiorco':{'Buen desarrollo':'Humano común','Ira interna':'Orco común'}
    };
    var fuente=heredados[especie]?.[nombre];
    if(personaje.herencia_dual===nombre&&fuente&&existe('Especie',fuente))
      return {fuente:'Especie: '+fuente,adquisicion:'Herencia dual · '+especie};
    return {fuente:'',adquisicion:''};
  }
  // La presentación compacta NO modifica el nombre original: se utiliza
  // íntegro para buscar el popup, copiar/exportar y cotejar el catálogo.
  // La máscara conserva currentColor y carga cada icono de forma individual.
  function iconoDecorativo(id,clase){
    return '<span class="icono-svg '+clase+'" aria-hidden="true" '+
      'style="--icono-svg:'+urlIcono(id)+'"></span>';
  }
  function presentarPoder(nombre){
    var tipo=String(nombre).match(/^\[(C|T)\]\s+/);
    if(!tipo)return {texto:nombre,icono:''};
    var texto=String(nombre).replace(/^\[[CT]\]\s+/,'');
    if(tipo[1]==='C'){
      texto=texto.replace(/\s+·\s+Nd20$/,'')
        .replace(/\s+\(C([1-8])\)$/,' ($1)');
    }
    var icono=tipo[1]==='C'?'ico-conjuro':'ico-tecnica';
    return {texto:texto,icono:iconoDecorativo(icono,'icono-poder-lista')};
  }
  // Clasificación solo visual: no altera las propiedades del Equipo DRS.
  function iconoEquipo(nombre){
    var c=datos.equipoInicial||{},n=String(nombre).replace(/\s+×\d+$/,'').trim();
    function contiene(lista){return (lista||[]).some(function(x){return x.nombre===n;});}
    var arma=(c.armas||[]).find(function(x){return x.nombre===n;});
    if(arma)return arma.tipo==='distancia'?'equipo-arco':'equipo-espada';
    if(contiene(c.varitas_defensa))return 'equipo-varita';
    if(contiene(c.armaduras))return 'equipo-armadura';
    if(contiene(c.escudos))return 'equipo-escudo';
    if(contiene(c.municion))return 'equipo-municion';
    if(contiene(c.focos_conjuros_con_precio))return 'equipo-orbe';
    if(contiene(c.utiles_fantasia?.monturas))return 'equipo-caballo';
    var utiles=Object.values(c.utiles_fantasia||{}).flat();
    if(contiene(utiles)){
      if(/^(libro|grimorio|tomo)\b/i.test(n))return 'equipo-libro';
      if(/^(mochila|alforjas|zurrón|saco|baúl|cofre)\b/i.test(n))
        return 'equipo-mochila';
    }
    // Respaldo por nombre, sin inventar categorías ni efectos mecánicos.
    if(/\b(arco|ballesta)\b/i.test(n))return 'equipo-arco';
    if(/\bvarita\b/i.test(n))return 'equipo-varita';
    if(/^(libro|grimorio|tomo)\b/i.test(n))return 'equipo-libro';
    if(/^(mochila|alforjas|zurrón|saco de viaje)\b/i.test(n))
      return 'equipo-mochila';
    return 'equipo-bolsa';
  }
  // Capitalización editorial: la ficha conserva el inventario literal.
  function nombreEquipoVisible(nombre){
    return String(nombre).replace(/^(\s*)([a-záéíóúüñ])/iu,function(_,espacio,letra){
      return espacio+letra.toLocaleUpperCase('es');
    });
  }
  function sexoVisible(personaje){
    var id=personaje.sexo==='masculino'?'sexo-masculino':
      personaje.sexo==='femenino'?'sexo-femenino':'sexo-indeterminado';
    var leyenda=personaje.sexo==='masculino'?'Masculino':
      personaje.sexo==='femenino'?'Femenino':'No indicado';
    return '<span class="sexo-ficha" role="img" aria-label="Sexo: '+leyenda+
      '" title="Sexo: '+leyenda+'">'+iconoDecorativo(id,'')+'</span>';
  }
  function descripcionConSexo(personaje){
    var descripcion=String(personaje.descripcion||'');
    var separacion=descripcion.indexOf(' · ');
    var ocupacion=separacion<0?descripcion:descripcion.slice(0,separacion);
    return esc(ocupacion)+' '+sexoVisible(personaje)+
      (separacion<0?'':esc(descripcion.slice(separacion)));
  }
  function htmlLista(titulo, valores, grupo, sistema, personaje) {
    if (!valores || !valores.length) return '';
    var compacta=grupo==='talento'||grupo==='poder'||grupo==='equipo';
    return '<section class="bloque-ficha"><h4>' + esc(titulo) + '</h4>' +
      (grupo==='talento'?'<p class="pista-talentos">Pulsa un Talento ⓘ para consultar su efecto.</p>':'') +
      '<ul'+(compacta?' class="lista-dos-columnas" role="list"':'')+'>' +
      valores.map(function (v) {
        var procedencia=grupo==='talento'?
          procedenciaTalentoDRS(personaje,v):{fuente:'',adquisicion:''};
        var vista=grupo==='poder'?presentarPoder(v):{texto:v,icono:''};
        if(grupo==='equipo'){
          vista.texto=nombreEquipoVisible(v);
          var simbolo=iconoEquipo(v);
          vista.icono=iconoDecorativo(simbolo,'icono-equipo-lista');
        }
        var item=grupo&&infoUI?
          infoUI.etiqueta(v,grupo,sistema,
            procedencia.fuente,procedencia.adquisicion,vista.texto):esc(vista.texto);
        return '<li>'+(vista.icono?'<span class="linea-poder">':'')+
          vista.icono+item+(vista.icono?'</span>':'')+'</li>';
      }).join('') + '</ul></section>';
  }
  // Las reglas de los Talentos se consultan junto al nombre, no al
  // final de una lista de observaciones. Los textos siguen intactos
  // en el modelo y al copiar/exportar la ficha.
  function organizarObservaciones(personaje){
    var grupos={contexto:[],talentos:[],poderes:[],equipo:[],riqueza:[],otras:[]};
    var sistema=sistemaFicha(personaje);
    (personaje.notas||[]).forEach(function(nota){
      var literal=String(nota);
      var talento=literal.match(/^Talento de (?:Especie|Ocupación) — (.+?): /);
      if(talento){
        var asociado=(personaje.capacidades||[]).includes(talento[1]);
        var procedencia=procedenciaTalentoDRS(personaje,talento[1]);
        var descripcion=infoUI?.consulta(talento[1],'talento',sistema,
          procedencia.fuente)?.descripcion;
        if(asociado&&descripcion)return; // Texto completo disponible en popup.
        grupos.talentos.push(literal); // Nunca ocultar una regla sin ficha.
        return;
      }
      var elegido=literal.match(/^Talento (?:de Guerrero elegido|adicional de (?:Especie|Ocupación) seleccionado): (.+?)\.$/);
      if(elegido&&(personaje.capacidades||[]).includes(elegido[1]))return;
      if(/^Nombre propuesto con elementos de Ylat/.test(literal)||
         /^Envejecimiento de Especie:/.test(literal)){
        grupos.contexto.push(literal);return;
      }
      if(/^Técnica aprendida, pendiente de uso:/.test(literal)){
        grupos.poderes.push(literal);return;
      }
      if(/^Baja estatura: armas y armaduras |^Equipo DRS (?:inicial )?adquirido por|^Compra adicional de (?:útiles|armamento):|^Cambio de equipo inicial:/.test(literal)){
        grupos.equipo.push(literal);return;
      }
      if(/^Riqueza adicional opcional:/.test(literal)){
        // La nota de 0 Niveles no aporta información útil a la ficha.
        if(/^Riqueza adicional opcional: 0 Niveles ×/.test(literal))return;
        grupos.riqueza.push(literal);return;
      }
      grupos.otras.push(literal);
    });
    return grupos;
  }
  function htmlAvisos(titulo,notas,clase){
    if(!notas||!notas.length)return '';
    return '<section class="avisos-ficha '+esc(clase||'')+'"><h4>'+
      esc(titulo)+'</h4><ul>'+notas.map(function(n){
        return '<li>'+esc(n)+'</li>';
      }).join('')+'</ul></section>';
  }
  function htmlContexto(notas){
    if(!notas||!notas.length)return '';
    return '<details class="contexto-ficha"><summary>Contexto del personaje ('+
      notas.length+')</summary><ul>'+notas.map(function(n){
        return '<li>'+esc(n)+'</li>';
      }).join('')+'</ul></details>';
  }
  function htmlOtrosAvisos(notas){
    if(!notas||!notas.length)return '';
    return '<details class="otros-avisos"><summary>Otros avisos ('+
      notas.length+')</summary><ul>'+notas.map(function(n){
        return '<li>'+esc(n)+'</li>';
      }).join('')+'</ul></details>';
  }
  // Recursos visuales: mismo dato original, ahora en rejilla accesible
  // con símbolos SVG locales. No se modifica el resultado de las tiradas.
  var iconosRecursos={Salud:'recurso-salud',Esfuerzo:'recurso-esfuerzo',
    Movimiento:'recurso-movimiento',Potencia:'recurso-potencia',
    Esencia:'recurso-esencia',Blindaje:'recurso-blindaje',Daño:'equipo-espada'};
  function blindajePersonaje(personaje){
    return window.NaufragioEquipment?.blindajeFicha?.(personaje,datos.equipoInicial)||null;
  }
  function danoPersonaje(personaje){
    return window.NaufragioEquipment?.danoFicha?.(personaje,datos.equipoInicial)||
      {valor:'—',arma:null,grupo:null};
  }
  function htmlRecursos(pares,personaje){
    var items=(pares||[]).slice(),blindaje=null,dano=null;
    if(personaje?.juego==='Naufragio d20 · Fantasía'){
      // La fila inferior ordena Daño, Blindaje y Potencia.
      // Ningún recurso ni su valor cambian al reorganizar la vista.
      var potencia=items.filter(function(p){return p[0]==='Potencia';});
      items=items.filter(function(p){return p[0]!=='Potencia';});
      dano=danoPersonaje(personaje);
      items.push(['Daño',dano.valor]);
      blindaje=blindajePersonaje(personaje);
      if(blindaje)items.push(['Blindaje',
        blindaje.valor==='Sin armadura'?'—':blindaje.valor]);
      items.push.apply(items,potencia);
    }
    return '<div class="recursos recursos-rejilla'+(dano?' recursos-con-dano':'')+
      '" aria-label="Recursos del personaje">'+
      items.map(function(p){
        var esDano=p[0]==='Daño'&&dano;
        var icono=esDano&&dano.grupo==='varitas_defensa'?
          'equipo-varita':iconosRecursos[p[0]];
        var simbolo=icono?iconoDecorativo(icono,'icono-recurso'):'';
        return '<div class="recurso-ficha'+(esDano?' recurso-dano':'')+'">'+simbolo+
          '<span class="recurso-texto"><span class="recurso-nombre">'+esc(p[0])+
          '</span><strong>'+esc(p[1])+'</strong>'+
          (esDano?'<small class="recurso-arma">'+esc(dano.arma||'Sin equipar')+'</small>':'')+
          (p[0]==='Blindaje'&&blindaje?.bonoEscudo?
            '<small class="recurso-nota-escudo">Escudo '+esc(blindaje.bonoEscudo)+
            ' solo al bloquear</small>':'')+
          '</span></div>';
      }).join('')+'</div>';
  }
  function htmlProteccionesEquipadas(personaje,id){
    if(personaje.juego!=='Naufragio d20 · Fantasía'||
       !window.NaufragioEquipment?.proteccionesDisponibles)return '';
    var disponibles=window.NaufragioEquipment.proteccionesDisponibles(
      personaje,datos.equipoInicial);
    var actual=personaje.protecciones_equipadas||{};
    function control(tipo,lista,rotulo){
      var idSelect='proteccion-'+tipo+'-'+id;
      var elegido=lista.some(function(x){return x.nombre===actual[tipo];})?
        actual[tipo]:'';
      return '<label for="'+esc(idSelect)+'">'+esc(rotulo)+'</label>'+
        '<select id="'+esc(idSelect)+'" class="seleccionar-proteccion"'+
        ' data-id="'+esc(id)+'" data-tipo="'+esc(tipo)+'"'+
        (lista.length?'':' disabled')+'>'+
        '<option value="">Sin equipar</option>'+
        lista.map(function(x){
          return '<option value="'+esc(x.nombre)+'"'+
            (x.nombre===elegido?' selected':'')+'>'+esc(x.nombre)+'</option>';
        }).join('')+'</select>';
    }
    return '<section class="protecciones-activas" aria-label="Protecciones equipadas">'+
      '<h4>Protecciones equipadas</h4>'+
      '<div class="protecciones-selectores"><div>'+control('armadura',disponibles.armaduras,'Armadura')+
      '</div><div>'+control('escudo',disponibles.escudos,'Escudo')+'</div></div>'+
      '<p>Solo aparecen piezas del inventario. El escudo aporta su bonificación'+
      ' únicamente al bloquear; no a las esquivas.</p></section>';
  }
  function fichaHTML(personaje, id) {
    var notas=organizarObservaciones(personaje);
    var esDungeonHack = personaje.juego.indexOf('Dungeon Hack') === 0;
    // Orden de lectura en la ficha Nd20, independiente del orden del modelo.
    // Dungeon Hack conserva su presentación sin alterar su sistema.
    var ordenAtributos=['Fuerza','Mente','Agilidad','Intuición','Resistencia','Presencia'];
    var atributosVista=esDungeonHack?personaje.atributos:
      personaje.atributos.slice().sort(function(a,b){
        var ia=ordenAtributos.indexOf(a.nombre),ib=ordenAtributos.indexOf(b.nombre);
        return (ia<0?ordenAtributos.length:ia)-
          (ib<0?ordenAtributos.length:ib);
      });
    var attrs = atributosVista.map(function (a) {
      var cifra = esDungeonHack ?
        '<strong>' + esc(a.dificultad) + '</strong><small>DD</small>' :
        '<strong>VA ' + esc(a.valor) + '</strong><small>DA ' + esc(a.dificultad) + '+</small>';
      return '<div class="atributo"><span class="nombre-atributo">' + esc(a.nombre) +
        (a.favorito ? ' <span title="Atributo favorito" aria-label="Favorito">★</span>' : '') +
        '</span><span>' + cifra + '</span></div>';
    }).join('');
    return '<article class="tarjeta" data-id="' + id + '" data-nivel="' + esc(personaje.nivel) + '">' +
      '<div class="cabecera-ficha"><div><p class="etiqueta">' + esc(nombreSistema(sistemaFicha(personaje))) +
      '</p><h3>' + esc(personaje.nombre) +
      '</h3><p class="descripcion-personaje">' + descripcionConSexo(personaje) + '</p></div>' +
      '<div class="acciones-cabecera-ficha"><span class="nivel-ficha" aria-label="Nivel '+
      esc(personaje.nivel)+'">Nivel '+esc(personaje.nivel)+'</span>'+
      '<button class="icon-btn eliminar-ficha" data-id="' + id +
      '" aria-label="Eliminar esta ficha" title="Eliminar">×</button></div></div>' +
      (personaje.concepto ? '<p class="concepto"><strong>Concepto:</strong> ' + esc(personaje.concepto) + '</p>' : '') +
      '<div class="atributos">' + attrs + '</div>' + htmlRecursos(personaje.recursos,personaje) +
      htmlLista('Competencias',personaje.competencias) +
      htmlLista('Talentos y capacidades',personaje.capacidades,'talento',
        sistemaFicha(personaje),personaje) +
      htmlAvisos('Detalles sin ficha emergente',notas.talentos,'avisos-talentos') +
      htmlLista('Conjuros y Poderes conocidos',personaje.poderes,'poder',sistemaFicha(personaje)) +
      htmlLista('Conjuros preparados',personaje.conjuros_preparados,'poder',sistemaFicha(personaje)) +
      htmlAvisos('Condiciones de uso',notas.poderes,'avisos-poderes') +
      htmlLista('Equipo',personaje.equipo,'equipo',sistemaFicha(personaje)) +
      (personaje.riqueza ? '<p class="riqueza"><strong>Riqueza:</strong> ' + esc(personaje.riqueza) + '</p>' : '') +
      htmlAvisos('Riqueza adicional',notas.riqueza,'avisos-riqueza') +
      htmlContexto(notas.contexto) +
      htmlOtrosAvisos(notas.otras) +
      '<div class="pie-ficha"><div class="acciones-pie-ficha" role="group" aria-label="Acciones de la ficha">' +
      (personaje.juego==='Naufragio d20 · Fantasía'&&Number.isFinite(personaje.saldo_mo)?
        '<button type="button" class="gestionar-equipo" data-id="'+id+'" title="Equipar y gestionar el equipo" aria-label="Equipar y gestionar el equipo">Equipo</button>':'')+
      (personaje.juego==='Naufragio d20 · Fantasía'&&personaje.elecciones_registradas?
        '<button type="button" class="revisar-elecciones" data-id="'+id+
        '" title="Revisar Talentos y Poderes elegidos" aria-label="Revisar Talentos y Poderes">Talentos y Poderes</button>':'')+
      (personaje.juego==='Naufragio d20 · Fantasía'?
        '<button type="button" class="exportar-pdf-ficha" data-id="'+id+'" title="Exportar PDF A5" aria-label="Exportar ficha PDF A5">PDF</button>':'')+
      '<button type="button" class="copiar-ficha" data-id="' + id +
      '" title="Copiar ficha" aria-label="Copiar ficha al portapapeles">Copiar</button></div>'+
      '<small class="fuentes-pie-ficha">' + esc(fuentesFicha(personaje)) +
      '</small></div></article>';
  }
  var tiles = {wall:['#172d39','Muro'],tile:['#d9d3bd','Suelo'],col:['#a7af9e','Columna'],
    trap:['#c98369','Trampa'],furn:['#b7a17f','Mobiliario']};
  function mazmorraHTML(filas,id) {
    var html = '<article class="tarjeta tarjeta-mapa" data-id="'+id+'"><div class="cabecera-ficha"><div>' +
      '<p class="etiqueta">Dungeon Hack · Herramienta</p><h3>Mazmorra rápida</h3>' +
      '<p>Distribución aleatoria de salas; no garantiza caminos conectados.</p></div>' +
      '<button class="icon-btn eliminar-ficha" data-id="'+id+'" aria-label="Eliminar esta mazmorra" title="Eliminar">×</button></div>' +
      '<div class="mapa-wrap"><table class="mapa" aria-label="Mazmorra procedural"><tbody>';
    filas.forEach(function (fila) {
      html += '<tr>';
      fila.forEach(function (idTile) {
        var tile=tiles[idTile]||tiles.tile;
        html+='<td class="celda celda-'+esc(idTile)+'" title="'+esc(tile[1])+'"><span class="sr-only">'+esc(tile[1])+'</span></td>';
      });
      html+='</tr>';
    });
    html+='</tbody></table></div><p class="leyenda">Muro · Suelo · Columna · Trampa · Mobiliario</p>' +
      '<div class="pie-ficha"><small>Generador conceptual, no mapa táctico definitivo.</small>' +
      '<button type="button" class="copiar-ficha" data-id="'+id+'">Copiar mapa</button></div></article>';
    return html;
  }
  function fichaTexto(p) {
    var str=[p.nombre,nombreSistema(sistemaFicha(p)),'Nivel: '+p.nivel,p.descripcion];
    if(p.sexo)str.push('Sexo: '+(p.sexo==='femenino'?'Femenino':'Masculino'));
    if(p.concepto)str.push('Concepto: '+p.concepto);
    str.push('', 'Atributos:');
    var esDH = p.juego.indexOf('Dungeon Hack') === 0;
    p.atributos.forEach(function(a){
      str.push('- '+a.nombre+': '+(esDH?'DD '+a.dificultad:a.valor+' (DA '+a.dificultad+'+)')+(a.favorito?' [favorito]':''));
    });
    ['recursos','capacidades','poderes','conjuros_preparados','competencias','equipo','notas'].forEach(function (key) {
      var titulos={recursos:'Recursos',capacidades:'Talentos y capacidades',
        poderes:'Conjuros y Poderes conocidos',conjuros_preparados:'Conjuros preparados',
        competencias:'Competencias',equipo:'Equipo',notas:'Observaciones'};
      if(p[key]&&p[key].length) {
        str.push('',titulos[key]+':');
        p[key].forEach(function(v){str.push('- '+(Array.isArray(v)?v[0]+': '+v[1]:v));});
      }
    });
    if(p.juego==='Naufragio d20 · Fantasía'){
      var defensa=blindajePersonaje(p);
      if(defensa){
        str.push('Blindaje: '+defensa.valor);
        if(defensa.armadura)str.push('Armadura equipada: '+defensa.armadura);
        if(defensa.escudo)str.push('Escudo equipado: '+defensa.escudo+
          ' ('+defensa.bonoEscudo+' solo al bloquear)');
        if(defensa.natural)str.push('Protección natural documentada: '+defensa.natural);
      }
      var dano=danoPersonaje(p);
      str.push('Arma equipada: '+(dano.arma||'Sin equipar')+'; Daño: '+dano.valor);
    }
    if(p.riqueza)str.push('Riqueza: '+p.riqueza);
    str.push(fuentesFicha(p));
    return str.join('\n');
  }
  function mapaTexto(filas) {
    var icons={wall:'#',tile:'.',col:'O',trap:'!',furn:'F'};
    return 'Mazmorra rápida · Dungeon Hack\n'+filas.map(function(f){
      return f.map(function(c){return icons[c]||'?';}).join(' ');
    }).join('\n')+'\nLeyenda: # Muro, . Suelo, O Columna, ! Trampa, F Mobiliario.';
  }
  function obtenerTexto(entrada) {
    return entrada.tipo==='mazmorra'?mapaTexto(entrada.valor):fichaTexto(entrada.valor);
  }
  function dibujar() {
    var fichas=$('fichas');
    fichas.innerHTML='';
    entradas.forEach(function (e) {
      fichas.insertAdjacentHTML('beforeend',e.tipo==='mazmorra' ?
        mazmorraHTML(e.valor,e.id) : fichaHTML(e.valor,e.id));
    });
    $('contador').textContent=entradas.length ?
      entradas.length+' elemento(s) en la mesa.' : 'Todavía no has generado ninguna ficha.';
    $('titulo-resultados').textContent=entradas.length?'Fichas de la mesa':'La mesa está preparada';
    $('borrar').disabled=!entradas.length;
    $('exportar').disabled=!entradas.length;
    $('inicio-movil').hidden=entradas.length>0;
    if(!entradas.length) fichas.innerHTML='<div class="vacio"><span class="emblema" aria-hidden="true">◇</span>'+
      '<p>Aquí aparecerá tu personaje</p><p class="muted">Deja las opciones iniciales o elige Nivel, Ocupación y Especie. Pulsa «Generar personaje» en la Forja: aquí verás el resultado.</p></div>';
    refrescarGenerarFlotante();
  }
  function agregar(tipo,valor) {
    entradas.unshift({tipo:tipo,valor:valor,id:++correlativo});
    dibujar();
  }
  // Edición posterior al azar: solo se intercambia material pagado en
  // la compra inicial, sin reembolsar regalos, paquetes ni compras nuevas.
  function entradaArmamento(){
    var entrada=entradas.find(function(x){return x.id===armamentoBorrador?.id;});
    if(!entrada||entrada.tipo!=='ficha'||
       entrada.valor.juego!=='Naufragio d20 · Fantasía'||
       !Number.isFinite(entrada.valor.saldo_mo))
      throw Error('La ficha DRS editable no está disponible.');
    return entrada;
  }
  function contextoArmamento(personaje){
    var partes=String(personaje.descripcion||'').split(' · ');
    var ocupacion=datos.fantasia.ocupaciones[partes[0]];
    var especie=datos.fantasia.especies[partes[1]];
    if(!ocupacion||!especie)
      throw Error('No se han encontrado las Competencias documentadas del personaje.');
    return {ocupacion:ocupacion,especie:especie,nivel:personaje.nivel};
  }
  function opcionesArmamento(personaje){
    var c=contextoArmamento(personaje);
    return window.NaufragioEquipment.informacionEquipo(
      datos.equipoInicial,c.ocupacion,c.nivel,c.especie);
  }
  function dineroEquipo(valor){return Number(valor).toFixed(2)+' mo';}
  function etiquetaEquipo(item){
    return item.nombre+' · '+dineroEquipo(item.precio)+
      (item.precio_editorial?' ('+item.precio_editorial+')':'')+
      (item.competente?'':' · Sin Competencia');
  }
  function llenarDestinoArmamento(){
    var personaje=entradaArmamento().valor;
    var indice=Number($('armamento-origen').value);
    var slot=(personaje.compras_iniciales_intercambiables||[]).find(function(x){
      return x.indice===indice;
    });
    var select=$('armamento-destino'),previo=select.value;
    select.replaceChildren();
    if(!slot)return;
    var esArma=['armas','varitas_defensa'].includes(slot.grupo);
    opcionesArmamento(personaje).filter(function(x){
      return esArma?['armas','varitas_defensa'].includes(x.grupo):
        x.grupo===slot.grupo;
    }).forEach(function(x){
      var option=document.createElement('option');
      option.value=JSON.stringify([x.grupo,x.nombre]);
      option.textContent=etiquetaEquipo(x);
      select.appendChild(option);
    });
    if(Array.from(select.options).some(function(x){return x.value===previo;}))
      select.value=previo;
    else{
      var actual=Array.from(select.options).find(function(x){
        var item=JSON.parse(x.value);
        return item[0]===slot.grupo&&item[1]===slot.nombre;
      });
      if(actual)select.value=actual.value;
    }
  }
  function llenarCompraArmamento(){
    var select=$('armamento-articulo'),previo=select.value;
    select.replaceChildren();
    opcionesArmamento(entradaArmamento().valor).filter(function(x){
      return x.grupo===$('armamento-grupo').value;
    }).forEach(function(x){
      var option=document.createElement('option');
      option.value=JSON.stringify([x.grupo,x.nombre]);
      option.textContent=etiquetaEquipo(x);
      select.appendChild(option);
    });
    if(Array.from(select.options).some(function(x){return x.value===previo;}))
      select.value=previo;
    refrescarArmamento();
  }
  function refrescarArmamento(){
    var personaje=entradaArmamento().valor;
    var opciones=opcionesArmamento(personaje);
    var cambiar=$('armamento-modo').value==='cambiar';
    $('armamento-cambio').hidden=!cambiar;
    $('armamento-adicional').hidden=cambiar;
    $('armamento-cantidad').disabled=cambiar;
    $('armamento-saldo').textContent='Personaje: '+personaje.nombre+
      ' · Saldo disponible: '+dineroEquipo(personaje.saldo_mo);
    var resultado='',validar=false,advertencia='';
    if(cambiar){
      var indice=Number($('armamento-origen').value);
      var slot=(personaje.compras_iniciales_intercambiables||[]).find(function(x){
        return x.indice===indice;
      });
      var destino=$('armamento-destino').value;
      if(slot&&destino){
        var dato=JSON.parse(destino);
        var item=opciones.find(function(x){
          return x.grupo===dato[0]&&x.nombre===dato[1];
        });
        if(item){
          var coste=Math.round((item.precio-slot.precio)*100)/100;
          var resto=Math.round((personaje.saldo_mo-coste)*100)/100;
          resultado='Recuperas '+dineroEquipo(slot.precio)+' por '+slot.nombre+
            '.\nNueva pieza: '+item.nombre+' · '+dineroEquipo(item.precio)+
            '.\nDiferencia: '+dineroEquipo(coste)+
            ' · Saldo resultante: '+dineroEquipo(resto)+'.';
          validar=resto>=0&&!(slot.nombre===item.nombre&&slot.grupo===item.grupo);
          advertencia=item.advertencia||'';
        }
      }else resultado='No hay piezas iniciales intercambiables.';
    }else{
      var valor=$('armamento-articulo').value;
      var cantidad=Number($('armamento-cantidad').value);
      if(valor){
        var dato=JSON.parse(valor),item=opciones.find(function(x){
          return x.grupo===dato[0]&&x.nombre===dato[1];
        });
        if(item){
          var total=Math.round(item.precio*cantidad*100)/100;
          resultado='Compra adicional: '+item.nombre+' ×'+cantidad+
            ' · '+dineroEquipo(total)+'.\nSaldo tras compra: '+
            dineroEquipo(Math.round((personaje.saldo_mo-total)*100)/100)+'.';
          var cupo=window.NaufragioEquipment.cupoCompraFantasia(
            datos.equipoInicial,personaje.equipo,[],item.grupo,item.nombre);
          $('armamento-cantidad').max=String(cupo);
          $('armamento-limite').textContent='Puedes añadir '+cupo+
            ' unidad(es) de este artículo. Máximo 10 por artículo y '+
            '5 monturas por personaje: límite de La Forja, no del DRS.';
          resultado+='\nCupo restante: '+cupo+' unidad(es).';
          validar=Number.isInteger(cantidad)&&cantidad>=1&&cantidad<=cupo&&
            total<=personaje.saldo_mo+1e-7;
          advertencia=item.advertencia||'';
        }
      }else resultado='No hay artículos disponibles para esta familia.';
    }
    $('armamento-resumen').textContent=resultado+
      (advertencia?'\nAviso DRS: '+advertencia:'')+
      (!validar&&resultado?'\nNo se puede confirmar esta operación.':'');
    $('armamento-confirmar').disabled=!validar;
  }
  function cerrarArmamento(){
    var id=armamentoBorrador?.id;
    armamentoBorrador=null;
    var regresar=volverGestionEquipo===id;
    if(regresar)volverGestionEquipo=null;
    var modal=$('editor-armamento');
    if(modal.open)modal.close();
    modal.hidden=true;
    if(regresar){
      var entrada=entradas.find(function(x){return x.id===id;});
      if(entrada){abrirGestionEquipo(entrada);return;}
    }
    if(id!==undefined){
      var boton=$('fichas').querySelector('.gestionar-equipo[data-id="'+id+'"]');
      if(boton)boton.focus({preventScroll:true});
    }
  }
  function abrirArmamento(entrada){
    if(!window.NaufragioEquipment?.intercambiarEquipoInicial||
       !window.NaufragioEquipment?.comprarArmamentoFantasia)
      throw Error('El motor de armamento DRS no está disponible.');
    armamentoBorrador={id:entrada.id};
    var personaje=entradaArmamento().valor,opciones=opcionesArmamento(personaje);
    var origen=$('armamento-origen');
    origen.replaceChildren();
    (personaje.compras_iniciales_intercambiables||[]).forEach(function(x){
      var op=document.createElement('option');
      op.value=String(x.indice);
      op.textContent=x.nombre+' · reembolso '+dineroEquipo(x.precio);
      origen.appendChild(op);
    });
    var grupo=$('armamento-grupo');
    grupo.replaceChildren();
    var etiquetas={armas:'Armas',armaduras:'Armaduras',escudos:'Escudos',
      varitas_defensa:'Varitas de defensa',municion:'Munición'};
    Array.from(new Set(opciones.map(function(x){return x.grupo;}))).forEach(function(g){
      var op=document.createElement('option');
      op.value=g;op.textContent=etiquetas[g]||g;grupo.appendChild(op);
    });
    $('armamento-modo').value=origen.options.length?'cambiar':'comprar';
    $('armamento-cantidad').value='1';
    llenarDestinoArmamento();
    llenarCompraArmamento();
    refrescarArmamento();
    var modal=$('editor-armamento');
    modal.hidden=false;modal.showModal();
    $('armamento-modo').focus({preventScroll:true});
  }
  // Panel de equipo: una sola entrada por ficha, sin diálogos anidados.
  function entradaGestionEquipo(){
    var entrada=entradas.find(function(x){return x.id===gestionBorrador?.id;});
    if(!entrada||entrada.tipo!=='ficha'||
       entrada.valor.juego!=='Naufragio d20 · Fantasía'||
       !Number.isFinite(entrada.valor.saldo_mo))
      throw Error('No hay una ficha DRS válida para gestionar su equipo.');
    return entrada;
  }
  function refrescarGestionEquipo(){
    var entrada=entradaGestionEquipo(),p=entrada.valor;
    $('gestion-resumen').textContent=p.nombre+' · Saldo '+dineroEquipo(p.saldo_mo);
    var opciones=window.NaufragioEquipment.armasDisponibles(p,datos.equipoInicial);
    var selector=$('gestion-arma');selector.replaceChildren();
    var ninguna=document.createElement('option');
    ninguna.value='';ninguna.textContent='Sin equipar';
    selector.appendChild(ninguna);
    opciones.forEach(function(x){
      var opt=document.createElement('option');
      opt.value=x.nombre;
      opt.textContent=x.nombre+' · Daño '+x.dano;
      selector.appendChild(opt);
    });
    selector.value=opciones.some(function(x){return x.nombre===p.arma_equipada;})?
      p.arma_equipada:'';
    var dano=danoPersonaje(p);
    $('gestion-dano').textContent='Daño: '+dano.valor+
      (dano.arma?' · '+dano.arma:' · Sin arma equipada');
    $('gestion-protecciones').innerHTML=htmlProteccionesEquipadas(p,entrada.id);
    $('gestion-reglas').innerHTML=htmlAvisos(
      'Reglas y compras de equipo',organizarObservaciones(p).equipo,'avisos-equipo');
  }
  function cerrarGestionEquipo(devolverFoco){
    var id=gestionBorrador?.id;
    gestionBorrador=null;
    var dialogo=$('editor-gestion-equipo');
    if(dialogo.open)dialogo.close();
    dialogo.hidden=true;
    if(devolverFoco!==false&&id!==undefined){
      var boton=$('fichas').querySelector('.gestionar-equipo[data-id="'+id+'"]');
      if(boton)boton.focus({preventScroll:true});
    }
  }
  function abrirGestionEquipo(entrada){
    if(entrada?.tipo!=='ficha'||
       entrada.valor.juego!=='Naufragio d20 · Fantasía'||
       !window.NaufragioEquipment?.armasDisponibles)
      throw Error('Solo hay gestión de equipo en fichas DRS de Fantasía.');
    gestionBorrador={id:entrada.id};
    refrescarGestionEquipo();
    var dialogo=$('editor-gestion-equipo');
    dialogo.hidden=false;dialogo.showModal();
    $('gestion-arma').focus({preventScroll:true});
  }
  function abrirCompraDesdeGestion(tipo){
    var entrada=entradaGestionEquipo();
    cerrarGestionEquipo(false);
    volverGestionEquipo=entrada.id;
    if(tipo==='armamento')abrirArmamento(entrada);
    else abrirCompra(entrada);
  }
  // Una segunda oportunidad para elegir las plazas documentadas al generar,
  // con fichas informativas, sin conceder progresión ni preparar Conjuros.
  function entradaRevision(){
    var entrada=entradas.find(function(x){return x.id===revisionBorrador?.id;});
    if(!entrada||entrada.tipo!=='ficha'||
       entrada.valor.juego!=='Naufragio d20 · Fantasía')
      throw Error('Esta ficha no tiene elecciones DRS revisables.');
    return entrada;
  }
  function cerrarRevisionElecciones(){
    var id=revisionBorrador?.id;
    revisionBorrador=null;
    var dialogo=$('editor-revision-elecciones');
    if(dialogo.open)dialogo.close();
    dialogo.hidden=true;
    if(id!==undefined){
      var boton=$('fichas').querySelector('.revisar-elecciones[data-id="'+id+'"]');
      if(boton)boton.focus({preventScroll:true});
    }
  }
  function opcionesRevision(paso,decisiones){
    return poderes.disponibles(paso,decisiones);
  }
  function actualizarConsultaRevision(selector,opciones,paso,nivel){
    var boton=selector.parentElement.querySelector('.consultar-ficha-eleccion');
    if(!boton)return;
    var elegida=opciones.find(function(x){return x.id===selector.value;});
    var grupo=paso.tipo==='talento'?'talento':'poder';
    var porId=elegida&&infoUI?.consultaPorId?.(elegida.id,grupo,'nd20');
    var esConjuro=elegida&&/^conjuro-/.test(elegida.id);
    var encontrada=porId||(esConjuro?null:elegida&&
      infoUI?.consulta(elegida.nombre,grupo,'nd20'));
    boton.hidden=!encontrada;
    if(encontrada){
      boton.dataset.glosaNombre=elegida.nombre;
      boton.dataset.glosaGrupo=grupo;
      boton.dataset.glosaSistema='nd20';
      boton.dataset.glosaNivel=String(nivel);
      if(porId)boton.dataset.glosaId=elegida.id;
      else delete boton.dataset.glosaId;
    }else{
      delete boton.dataset.glosaId;
      delete boton.dataset.glosaNombre;
    }
  }
  function refrescarRevision(){
    var entrada=entradaRevision(),p=entrada.valor;
    var registro=p.elecciones_registradas,decisiones=JSON.parse(
      JSON.stringify(registro.decisiones));
    var pasos=poderes.opcionesRevisables(p);
    var cantidad=0,valido=pasos.length>0;
    pasos.forEach(function(paso){
      var selectors=Array.from($('form-revision-elecciones')
        .querySelectorAll('select[data-revision-paso="'+paso.id+'"]'));
      var usados=new Set(),valores=[];
      selectors.forEach(function(sel){
        var anterior=sel.value;
        var permitidas=opcionesRevision(paso,decisiones).filter(function(x){
          return !usados.has(x.id);
        });
        sel.replaceChildren();
        var vacio=document.createElement('option');
        vacio.value='';vacio.textContent='— Elige una opción —';
        sel.appendChild(vacio);
        permitidas.forEach(function(op){
          var opt=document.createElement('option');
          opt.value=op.id;
          opt.textContent=poderes.nombreEtiquetado(paso.tipo,paso.titulo,op.nombre)+
            (op.circulo?' · C'+op.circulo:'')+
            poderes.origenConjuro(paso.tipo,paso.titulo,op.origen);
          sel.appendChild(opt);
        });
        if(permitidas.some(function(x){return x.id===anterior;})){
          sel.value=anterior;usados.add(anterior);valores.push(anterior);
        }else{
          sel.value='';valido=false;
        }
        actualizarConsultaRevision(sel,permitidas,paso,p.nivel);
      });
      cantidad+=selectors.length;
      decisiones[paso.id]=valores;
      if(valores.length!==paso.cantidad)valido=false;
    });
    $('revision-confirmar').disabled=!valido;
    $('revision-estado').textContent=!pasos.length?
      'No hay elecciones manuales de Talentos ni Poderes conocidos en la progresión DRS de esta ficha.':
      valido?cantidad+' plazas documentadas. Preparar Conjuros es una operación distinta.':
      'Completa las plazas pendientes; no se permiten Conjuros conocidos repetidos.';
  }
  function seleccionesRevision(){
    var p=entradaRevision().valor,resultado={};
    poderes.opcionesRevisables(p).forEach(function(paso){
      resultado[paso.id]=Array.from($('form-revision-elecciones')
        .querySelectorAll('select[data-revision-paso="'+paso.id+'"]'))
        .map(function(sel){return sel.value;});
      if(resultado[paso.id].length!==paso.cantidad||
         resultado[paso.id].some(function(x){return !x;}))
        throw Error('Completa las elecciones de '+paso.titulo+'.');
    });
    return resultado;
  }
  function abrirRevisionElecciones(entrada){
    if(!poderes?.opcionesRevisables||!poderes?.revisar)
      throw Error('El editor de Poderes y Talentos no está cargado.');
    revisionBorrador={id:entrada.id};
    var p=entradaRevision().valor,reg=p.elecciones_registradas;
    var pasos=poderes.opcionesRevisables(p);
    $('revision-resumen').textContent=p.nombre+' · Nivel '+p.nivel;
    var talentos=$('revision-pasos-talentos'),otros=$('revision-pasos-poderes');
    talentos.replaceChildren();otros.replaceChildren();
    $('revision-talentos').hidden=!pasos.some(function(x){return x.tipo==='talento';});
    $('revision-poderes').hidden=!pasos.some(function(x){return x.tipo!=='talento';});
    pasos.forEach(function(paso){
      var field=document.createElement('fieldset');
      field.className='grupo-poderes';
      var leyenda=document.createElement('legend');
      leyenda.textContent=paso.titulo+' ('+paso.cantidad+')';
      field.appendChild(leyenda);
      for(var i=0;i<paso.cantidad;i++){
        var label=document.createElement('label');
        label.className='eleccion-poder';
        label.textContent=(i+1)+'. ';
        var sel=document.createElement('select');
        sel.dataset.revisionPaso=paso.id;sel.dataset.orden=String(i);
        sel.required=true;
        var inicial=(reg.decisiones[paso.id]||[])[i];
        // Se asigna después de construir el conjunto de opciones.
        sel.dataset.inicial=inicial||'';
        label.appendChild(sel);
        var ver=document.createElement('button');
        ver.type='button';ver.className='consultar-ficha-eleccion';
        ver.textContent='Ver ficha';ver.hidden=true;
        ver.setAttribute('aria-label','Consultar la ficha de la opción elegida');
        label.appendChild(ver);field.appendChild(label);
      }
      (paso.tipo==='talento'?talentos:otros).appendChild(field);
    });
    // Primero se crean todas las opciones con las mismas restricciones del
    // editor original, después se recupera cada selección registrada.
    pasos.forEach(function(paso){
      var sels=Array.from($('form-revision-elecciones')
        .querySelectorAll('select[data-revision-paso="'+paso.id+'"]'));
      var usados=new Set();
      sels.forEach(function(sel){
        var pool=opcionesRevision(paso,reg.decisiones).filter(function(op){
          return !usados.has(op.id);
        });
        var inicial=sel.dataset.inicial;
        pool.forEach(function(op){
          var option=document.createElement('option');
          option.value=op.id;option.textContent=op.nombre;sel.appendChild(option);
        });
        if(pool.some(function(op){return op.id===inicial;})){
          sel.value=inicial;usados.add(inicial);
        }else sel.value='';
        delete sel.dataset.inicial;
      });
    });
    refrescarRevision();
    var dialogo=$('editor-revision-elecciones');
    dialogo.hidden=false;dialogo.showModal();
    var primero=dialogo.querySelector('select[data-revision-paso]');
    (primero||$('revision-cerrar')).focus({preventScroll:true});
  }
  // Compras de útiles: la selección se valida con el motor antes de tocar
  // el inventario. Cada editor se vincula al ID único de una ficha DRS.
  function cerrarCompra(){
    var id=compraBorrador&&compraBorrador.id;
    compraBorrador=null;
    var regresar=volverGestionEquipo===id;
    if(regresar)volverGestionEquipo=null;
    var dialogo=$('editor-compras');
    if(dialogo.open)dialogo.close();
    dialogo.hidden=true;
    // Cerrar solamente el submenú; recuperar el panel principal de Equipo.
    if(regresar){
      var entrada=entradas.find(function(x){return x.id===id;});
      if(entrada){abrirGestionEquipo(entrada);return;}
    }
    if(id!==null&&id!==undefined){
      var retorno=$('fichas').querySelector('.gestionar-equipo[data-id="'+id+'"]');
      if(retorno)retorno.focus({preventScroll:true});
    }
  }
  function entradaCompra(){
    if(!compraBorrador)throw Error('No hay una compra de útiles activa.');
    var entrada=entradas.find(function(x){return x.id===compraBorrador.id;});
    if(!entrada||entrada.tipo!=='ficha'||
        entrada.valor.juego!=='Naufragio d20 · Fantasía')
      throw Error('La ficha de compra ya no está disponible.');
    if(!Number.isFinite(entrada.valor.saldo_mo))
      throw Error('La ficha no conserva un saldo numérico verificable.');
    return entrada;
  }
  function abrirCompra(entrada){
    if(!window.NaufragioEquipment?.compraUtilesFantasia)
      throw Error('El motor de compras de útiles no está cargado.');
    if(entrada.tipo!=='ficha'||entrada.valor.juego!=='Naufragio d20 · Fantasía'||
        !Number.isFinite(entrada.valor.saldo_mo))
      throw Error('La compra individual solo está disponible en fichas DRS con saldo.');
    compraBorrador={id:entrada.id,seleccion:[]};
    $('titulo-editor-compras').textContent='Comprar útiles · '+entrada.valor.nombre;
    var familia=$('compras-grupo');
    familia.textContent='';
    gruposCompra().forEach(function(par){
      var opcion=document.createElement('option');
      opcion.value=par[0];opcion.textContent=etiquetaGrupoCompra(par[0]);
      familia.appendChild(opcion);
    });
    familia.selectedIndex=0;
    rellenarArticulosCompra();
    $('compras-cantidad').value='1';
    $('compras-nivel').value='1';
    var dialogo=$('editor-compras');
    dialogo.hidden=false;
    dialogo.showModal();
    refrescarCompra();
    $('compras-articulo').focus({preventScroll:true});
  }
  // La familia reduce el desplegable a un subconjunto documentado
  // (sin añadir artículos ni precios ajenos al DRS).
  function gruposCompra(){
    return Object.entries(datos.equipoInicial.utiles_fantasia||{})
      .map(function(par){
        // Servicios diarios y precios variables son consultables, pero
        // no producen artículos persistentes en el inventario.
        return [par[0],par[1].filter(function(x){
          return !x.servicio_por_dia&&
            (Number.isFinite(x.precio)||x.precio_por_nivel!==undefined);
        })];
      })
      .filter(function(par){return par[1].length>0;})
      .concat([['focos',datos.equipoInicial.focos_conjuros_con_precio||[]]]);
  }
  function etiquetaGrupoCompra(id){
    return ({iluminacion:'Iluminación',aventura:'Aventura',campamento:'Campamento',
      ropa:'Ropa',instrumentos:'Instrumentos',objetos_varios:'Objetos varios',
      monturas:'Monturas',equipo_monturas:'Equipo de monturas',
      vehiculos:'Vagones y diligencias',
      consumibles:'Consumibles',herramientas:'Herramientas',
      escritura:'Escritura',focos:'Focos de Conjuros'})[id]||id;
  }
  // Solo consulta: el artículo de precio variable nunca entra al carrito.
  function refrescarConsultaArmaduraEquina(){
    var panel=$('consulta-armadura-equina');
    panel.hidden=$('compras-grupo').value!=='equipo_monturas';
    if(panel.hidden)return;
    var opciones=window.NaufragioEquipment.consultarPreciosArmaduraEquina(
      datos.equipoInicial);
    var select=$('compras-armadura-equina-base');
    if(select.options.length===1){
      opciones.forEach(function(a){
        var option=document.createElement('option');
        option.value=a.nombre;option.textContent=a.nombre;
        select.appendChild(option);
      });
    }
    var elegida=opciones.find(function(a){return a.nombre===select.value;});
    $('compras-armadura-equina-resultado').textContent=elegida?
      elegida.nombre+': '+elegida.precio_base+' mo × 4 = '+
        elegida.precio_equino+' mo (armadura equina)':
      'Elige una armadura para consultar su precio.';
  }
  function rellenarArticulosCompra(){
    var grupo=gruposCompra().find(function(par){
      return par[0]===$('compras-grupo').value;
    });
    var select=$('compras-articulo'),previo=select.value;
    select.textContent='';
    (grupo?grupo[1]:[]).forEach(function(item){
      var opt=document.createElement('option');
      opt.value=item.id;
      opt.textContent=item.nombre+' · '+
        (item.precio_por_nivel!==undefined?
          item.precio_por_nivel+' mo/Nivel':item.precio+' mo');
      select.appendChild(opt);
    });
    if(Array.from(select.options).some(function(op){return op.value===previo;}))
      select.value=previo;
    refrescarConsultaArmaduraEquina();
    refrescarCompra();
  }
  function articuloCompra(){
    var id=$('compras-articulo').value;
    return Object.values(datos.equipoInicial.utiles_fantasia||{}).flat()
      .concat(datos.equipoInicial.focos_conjuros_con_precio||[])
      .find(function(x){return x.id===id;});
  }
  function lineaCompra(){
    var item=articuloCompra();
    if(!item)throw Error('Elige un artículo documentado del DRS.');
    var cantidad=Number($('compras-cantidad').value);
    var pendientes=compraBorrador.seleccion.map(function(x){
      var existente=window.NaufragioEquipment.consultarUtilFantasia(
        datos.equipoInicial,x.id,x.nivel);
      return {nombre:existente.nombre,grupo:existente.seccion,cantidad:x.cantidad};
    });
    var cupo=window.NaufragioEquipment.cupoCompraFantasia(
      datos.equipoInicial,entradaCompra().valor.equipo,pendientes,
      $('compras-grupo').value,item.nombre);
    if(!Number.isInteger(cantidad)||cantidad<1||cantidad>cupo)
      throw Error('Límite de La Forja: quedan '+cupo+
        ' unidades disponibles de '+item.nombre+'. Máximo 10 por artículo y '+
        '5 monturas por personaje. No es una regla del DRS.');
    var linea={id:item.id,cantidad:cantidad};
    if(item.precio_por_nivel!==undefined){
      var nivel=Number($('compras-nivel').value);
      if(!Number.isInteger(nivel)||nivel<1||nivel>30)
        throw Error('El Nivel de Antídoto o Veneno debe estar entre 1 y 30.');
      linea.nivel=nivel;
    }
    return linea;
  }
  function refrescarCompra(){
    if(!compraBorrador)return;
    var entrada=entradaCompra(),item=articuloCompra();
    var requiereNivel=!!item&&item.precio_por_nivel!==undefined;
    $('compras-campo-nivel').hidden=!requiereNivel;
    $('compras-nivel').required=requiereNivel;
    $('resumen-compras').textContent='Personaje: '+entrada.valor.nombre+
      ' · Saldo disponible: '+entrada.valor.saldo_mo.toFixed(2)+' mo';
    var actual=window.NaufragioEquipment.compraUtilesFantasia(
      datos.equipoInicial,entrada.valor.saldo_mo,
      compraBorrador.seleccion,entrada.valor.equipo);
    var lista=$('compras-lista');
    lista.textContent='';
    actual.detalles.forEach(function(x,indice){
      var li=document.createElement('li');
      var descripcion=document.createElement('span');
      descripcion.textContent=x.nombre+(x.nivel!==null?' (Nivel '+x.nivel+')':'')+
        ' ×'+x.cantidad+' · '+x.subtotal.toFixed(2)+' mo';
      li.appendChild(descripcion);
      var quitar=document.createElement('button');
      quitar.type='button';
      quitar.className='compras-quitar-linea';
      quitar.dataset.indice=String(indice);
      quitar.textContent='Quitar';
      quitar.setAttribute('aria-label','Quitar '+x.nombre+
        ' de la compra (línea '+(indice+1)+')');
      li.appendChild(quitar);
      lista.appendChild(li);
    });
    $('compras-total').textContent='Seleccionados: '+actual.gastado.toFixed(2)+
      ' mo · Saldo tras compra: '+actual.restante.toFixed(2)+' mo';
    $('compras-confirmar').disabled=!compraBorrador.seleccion.length;
    if(item){
      var pendientes=actual.detalles.map(function(x){
        var original=window.NaufragioEquipment.consultarUtilFantasia(
          datos.equipoInicial,x.id,x.nivel);
        return {grupo:original.seccion,nombre:original.nombre,cantidad:x.cantidad};
      });
      var cupo=window.NaufragioEquipment.cupoCompraFantasia(
        datos.equipoInicial,entrada.valor.equipo,pendientes,
        $('compras-grupo').value,item.nombre);
      $('compras-cantidad').max=String(cupo);
      $('compras-limite').textContent='Cupo restante: '+cupo+
        ' unidad(es). Máximo 10 por artículo y 5 monturas en total por '+
        'personaje; límite de La Forja, no del DRS.';
    }
    try{
      var nueva=lineaCompra(),consulta=window.NaufragioEquipment.consultarUtilFantasia(
        datos.equipoInicial,nueva.id,nueva.nivel);
      var subtotal=Math.round(consulta.precio*nueva.cantidad*100)/100;
      $('compras-detalle').textContent=(consulta.detalle?consulta.detalle+' · ':'')+
        (consulta.du?'DU '+consulta.du+' · ':'')+
        'Precio del lote: '+subtotal.toFixed(2)+' mo';
    }catch(error){
      $('compras-detalle').textContent=error.message;
    }
  }
  function conControl(fn) {
    try { fn(); aviso(''); } catch(e) {aviso(e.message || 'No ha sido posible generar el resultado.',true);}
  }
  function semillaGeneracion(){
    var cadena=$('semilla').value.trim();
    if(!cadena){
      if(window.crypto?.getRandomValues){
        var valores=new Uint32Array(4);
        window.crypto.getRandomValues(valores);
        cadena=Array.from(valores).map(function(n){return n.toString(16).padStart(8,'0');}).join('');
      }else cadena='forja-'+Date.now().toString(36)+'-'+performance.now().toString(36);
      $('semilla').value=cadena;
    }
    return cadena;
  }
  function rngUnico(){
    var semilla=semillaGeneracion();
    return function(i){return reglas.aleatorioSemilla(semilla+':'+i);};
  }
  function mostrarReproduccion(semilla,cfg){
    ultimaReproduccion={version:1,semilla:semilla,config:JSON.parse(JSON.stringify(cfg))};
    $('semilla-resultado').textContent=semilla;
    $('reproduccion-resultados').hidden=false;
  }
  function aplicarReproduccion(texto){
    var registro=JSON.parse(texto);
    if(!registro||registro.version!==1||
       typeof registro.semilla!=='string'||!registro.semilla.trim()||
       registro.semilla.length>90||!registro.config)
      throw Error('La configuración de reproducción no tiene un formato válido (versión 1).');
    var c=registro.config;
    if(!['nd20','dh'].includes(c.juego))
      throw Error('Este sistema no está disponible en la versión pública de La Forja.');
    if(!Array.isArray(c.origenes)||!Array.isArray(c.ocupacionesPermitidas)||
       !Array.isArray(c.especiesPermitidas)||
       (c.juego==='nd20'&&!Array.isArray(c.fuentes)))
      throw Error('El registro no conserva todas las opciones necesarias.');
    $('juego').value=c.juego;
    if(c.juego!=='dh')fuentesGuardadas[c.juego]=c.fuentes.slice();
    $('origenes').querySelectorAll('input').forEach(function(e){
      e.checked=c.origenes.map(String).includes(e.value);
    });
    refrescarSelectores();
    if(c.juego!=='dh'){
      var actuales=Array.from($('fuentes-nd20').querySelectorAll('input'));
      if(c.fuentes.some(function(nombre){return !actuales.some(function(e){return e.value===nombre;});}))
        throw Error('La reproducción incluye fuentes no publicadas o no disponibles.');
      actuales.forEach(function(e){e.checked=c.fuentes.includes(e.value);});
    }
    $('nivel-min').value=String(c.nivelMin);
    $('nivel-max').value=String(c.nivelMax);
    $('cantidad').value=String(c.cantidad);
    $('nombre-personaje').value=c.nombre||'';
    $('sexo-pj').value=c.sexo||'aleatorio';
    $('respetar-contexto-sexo').checked=c.respetarContextoSexo!==false;
    $('modo-nombre').value=c.modoNombre||'generico';
    $('con-especie').checked=c.conEspecie!==false;
    $('riqueza-por-nivel').checked=c.riquezaPorNivel===true;
    var modo=document.querySelector('input[name="modo-creacion"][value="'+c.modo+'"]');
    if(!modo)throw Error('Modo de generación no documentado.');
    modo.checked=true;
    $('cantidad').disabled=c.modo==='personalizado';
    refrescarSelectores();
    ['ocupacion','especie'].forEach(function(tipo){
      var value=c[tipo]||'';
      var seleccion=c[tipo==='ocupacion'?'ocupacionesPermitidas':'especiesPermitidas'];
      var disponibles=Array.from($(tipo).options).map(function(op){return op.value;});
      if((value&&!disponibles.includes(value))||
         seleccion.some(function(key){return !disponibles.includes(key);}))
        throw Error('La selección de '+tipo+' no está disponible con las fuentes actuales.');
      candidatosSelector[tipo]=seleccion.slice();
      $(tipo).value=value;
      marcarTarjetasSeleccionadas(tipo);
    });
    $('semilla').value=registro.semilla;
    config();
    refrescarResumenCreacion();
    $('aviso-reproduccion').textContent='Configuración recuperada. Genera para reproducir el resultado.';
  }
  function descargar(nombre,contenido) {
    var blob=new Blob([contenido],{type:'text/plain;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=nombre;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }
  async function copiar(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      aviso('Contenido copiado al portapapeles.');
    } catch(error) {
      aviso('No se pudo copiar automáticamente. Utiliza «Exportar .txt».',true);
    }
  }

  function cerrarEditor(){
    borrador=null;
    $('editor-elecciones').hidden=true;
    $('grupos-elecciones').textContent='';
    refrescarGenerarFlotante();
  }
  function prepararEditor(personaje,plan,rng,origen){
    borrador={personaje:personaje,plan:plan,rng:rng,origen:origen||null};
    $('editor-elecciones').hidden=false;
    refrescarGenerarFlotante();
    $('editor-titulo').textContent='Personalizar · '+personaje.descripcion;
    $('editor-resumen').textContent='Nivel '+personaje.nivel+
      ' · '+plan.pasos.filter(function(x){return !x.automatico;})
        .reduce(function(n,x){return n+x.cantidad;},0)+' elecciones. '+
      (plan.avisos||[]).join(' ');
    var cont=$('grupos-elecciones');
    cont.textContent='';
    plan.pasos.forEach(function(paso){
      var field=document.createElement('fieldset');
      field.className='grupo-poderes';
      var legend=document.createElement('legend');
      legend.textContent=paso.titulo+' ('+paso.cantidad+')';
      field.appendChild(legend);
      if(paso.automatico){
        var txt=document.createElement('p');txt.className='ayuda';
        txt.textContent='Asignación aleatoria obligatoria según tabla d20.';
        field.appendChild(txt);
      }else {
        for(var i=0;i<paso.cantidad;i++){
          var label=document.createElement('label');
          label.className='eleccion-poder';
          label.textContent=(i+1)+'. ';
          var sel=document.createElement('select');
          sel.dataset.paso=paso.id;sel.dataset.orden=String(i);sel.required=true;
          label.appendChild(sel);
          var ver=document.createElement('button');
          ver.type='button';ver.className='consultar-ficha-eleccion';
          ver.textContent='Ver ficha';ver.hidden=true;
          ver.setAttribute('aria-label','Consultar información de la opción seleccionada');
          label.appendChild(ver);field.appendChild(label);
        }
      }
      cont.appendChild(field);
    });
    refrescarOpciones();
    $('editor-elecciones').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function leerElecciones(){
    var result={};
    $('grupos-elecciones').querySelectorAll('select[data-paso]').forEach(function(sel){
      if(!result[sel.dataset.paso])result[sel.dataset.paso]=[];
      if(sel.value)result[sel.dataset.paso].push(sel.value);
    });
    return result;
  }
  function refrescarOpciones(){
    if(!borrador)return;
    var selecciones=leerElecciones();
    $('grupos-elecciones').querySelectorAll('select[data-paso]').forEach(function(sel){
      var paso=borrador.plan.pasos.find(function(p){return p.id===sel.dataset.paso;});
      var anterior=sel.value,disponibles=poderes.disponibles(paso,selecciones);
      if(paso.tipo==='conjuro_conocido'&&!paso.repetibles){
        // En un mismo Nivel del grimorio tampoco se aprende dos veces
        // el mismo Conjuro. Se preserva el primer selector elegido.
        var previos=Array.from($('grupos-elecciones')
          .querySelectorAll('select[data-paso="'+paso.id+'"]'))
          .filter(function(otro){
            return otro!==sel&&Number(otro.dataset.orden)<Number(sel.dataset.orden);
          }).map(function(otro){return otro.value;}).filter(Boolean);
        disponibles=disponibles.filter(function(op){return !previos.includes(op.id);});
      }
      sel.textContent='';
      var option=document.createElement('option');
      option.value='';option.textContent='— Elige una opción —';sel.appendChild(option);
      disponibles.forEach(function(op){
        var item=document.createElement('option');
        item.value=op.id;
        item.textContent=(op.id==='__vacio'?op.nombre:
          poderes.nombreEtiquetado(paso.tipo,paso.titulo,op.nombre))+
          (op.circulo?' · C'+op.circulo:'')+
          (op.id==='__vacio'?'':poderes.origenConjuro(paso.tipo,paso.titulo,op.origen))+
          (op.requisito?' · Requisitos de uso (VA): '+op.requisito:'');
        if(['tecnica','poder_especial'].includes(paso.tipo)&&
          (paso.tipo==='tecnica'||/^Técnicas/i.test(paso.titulo))){
          var uso=poderes.estadoUsoVA(op.requisito,borrador.personaje.atributos);
          if(uso.comprobados.length){
            item.textContent+=uso.faltantes.length?
              ' · Aprendible; VA insuficiente para usar':' · VA suficiente para usar';
          }
        }
        sel.appendChild(item);
      });
      if(disponibles.some(function(op){return op.id===anterior;}))sel.value=anterior;
      var ver=sel.parentElement.querySelector('.consultar-ficha-eleccion');
      if(ver){
        var elegida=disponibles.find(function(op){return op.id===sel.value;});
        var grupo=['talento','talento_ajeno','estilo_gladiatoria'].includes(paso.tipo)?
          'talento':paso.tipo==='competencias_diletante'?'': 'poder';
        var tipo=sistemaFicha(borrador.personaje);
        var porId=elegida&&grupo&&infoUI?.consultaPorId?.(elegida.id,grupo,tipo);
        var esConjuro=elegida&&/^conjuro-/.test(elegida.id||"");
        // Conjuros: nunca elegir otra versión con el mismo nombre si falla su ID.
        var fichaElegida=porId||(esConjuro?null:
          (elegida&&grupo&&infoUI?.consulta(elegida.nombre,grupo,tipo)));
        ver.hidden=!fichaElegida;
        if(!ver.hidden){
          ver.dataset.glosaNombre=elegida.nombre;
          ver.dataset.glosaGrupo=grupo;
          ver.dataset.glosaSistema=tipo;
          ver.dataset.glosaNivel=String(borrador.personaje.nivel);
          if(porId)ver.dataset.glosaId=elegida.id;
          else delete ver.dataset.glosaId;
        }else{
          delete ver.dataset.glosaId;
          delete ver.dataset.glosaNivel;
        }
      }
    });
  }
  function vincular() {
    var configurador=$('dialogo-configuracion'),abrirConfig=$('abrir-configuracion');
    abrirConfig.addEventListener('click',function(){
      configurador.showModal();
      $('nivel-min').focus({preventScroll:true});
      refrescarGenerarFlotante();
    });
    function cerrarConfiguracion(){if(configurador.open)configurador.close();}
    window.addEventListener('resize',function(){
      if(configurador.open&&window.matchMedia('(max-width:830px)').matches)
        alternarMenu(true);
    },{passive:true});
    $('cerrar-configuracion').addEventListener('click',cerrarConfiguracion);
    $('aplicar-configuracion').addEventListener('click',function(){
      try{config();$('aviso-configuracion').textContent='';cerrarConfiguracion();}
      catch(error){mostrarErrorConfiguracion(error);}
    });
    configurador.addEventListener('close',function(){
      refrescarResumenCreacion();
      refrescarGenerarFlotante();
      abrirConfig.focus({preventScroll:true});
    });
    configurador.addEventListener('click',function(e){
      if(e.target!==configurador)return;
      var r=configurador.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||
         e.clientY<r.top||e.clientY>r.bottom)cerrarConfiguracion();
    });
    $('configuracion').addEventListener('input',function(){
      refrescarResumenCreacion();
      validarNivelVisible();
      if(validarFuentesVisibles()&&validarNivelVisible())
        $('aviso-configuracion').textContent='';
    });
    ['nivel-min','nivel-max'].forEach(function(id){
      $(id).addEventListener('input',validarNivelVisible);
      $(id).addEventListener('change',validarNivelVisible);
    });
    // La validación nativa cancela submit antes de que llegue al manejador.
    // Responder dentro del diálogo, incluso desde el botón principal o móvil.
    $('configuracion').addEventListener('invalid',function(event){
      event.preventDefault();
      mostrarErrorConfiguracion(Error('Corrige el campo de configuración señalado.'));
      event.target.focus({preventScroll:true});
      event.target.scrollIntoView({block:'center',behavior:'auto'});
    },true);
    $('configuracion').addEventListener('change',refrescarResumenCreacion);
    ['ocupacion','especie'].forEach(function(tipo){
      var dialogo=$('dialogo-'+tipo),abrir=$('abrir-selector-'+tipo);
      abrir.addEventListener('click',function(){
        if(abrir.disabled)return;
        borradorSelector[tipo]=candidatosSelector[tipo].slice();
        marcarCeldas(tipo,borradorSelector[tipo]);
        dialogo.showModal();
        (dialogo.querySelector('button.opcion-visual.seleccionada')||
         dialogo.querySelector('button.opcion-visual'))?.focus();
      });
      $('selector-visual-'+tipo).addEventListener('click',function(event){
        var boton=event.target.closest('button.opcion-visual');
        if(!boton||boton.disabled)return;
        var valor=boton.dataset.valor;
        if(!valor)borradorSelector[tipo]=[];
        else if(borradorSelector[tipo].includes(valor))
          borradorSelector[tipo]=borradorSelector[tipo].filter(function(x){return x!==valor;});
        else borradorSelector[tipo].push(valor);
        marcarCeldas(tipo,borradorSelector[tipo]);
      });
      dialogo.querySelector('[data-confirmar-selector]').addEventListener('click',function(){
        candidatosSelector[tipo]=borradorSelector[tipo].slice();
        $(tipo).value=candidatosSelector[tipo].length===1?candidatosSelector[tipo][0]:'';
        marcarTarjetasSeleccionadas(tipo);
        refrescarResumenCreacion();
        dialogo.close();abrir.focus();
      });
      dialogo.querySelector('[data-cerrar-selector]').addEventListener('click',function(){
        dialogo.close();abrir.focus();
      });
      dialogo.addEventListener('click',function(event){
        if(event.target===dialogo){dialogo.close();abrir.focus();}
      });
      $(tipo).addEventListener('change',function(){
        candidatosSelector[tipo]=$(tipo).value?[$(tipo).value]:[];
        marcarTarjetasSeleccionadas(tipo);
      });
    });
    $('generar-flotante').addEventListener('click',function(){
      if($('generar-flotante').disabled)return;
      marcarPanel('personajes');
      // Si el campo está oculto en Configuración, abrirlo y señalar el
      // error antes de intentar generar: nunca dejar un clic sin respuesta.
      if(!$('configuracion').checkValidity()){
        if(!configurador.open)configurador.showModal();
        $('configuracion').reportValidity();
        return;
      }
      $('configuracion').requestSubmit($('generar'));
    });
    $('cantidad').addEventListener('input',refrescarGenerarFlotante);
    observarGenerarFlotante();
    var avanzada=$('informacion-avanzada');
    try{avanzada.checked=localStorage.getItem('forja-informacion-avanzada')==='true';}
    catch(error){avanzada.checked=false;}
    infoUI?.configurarAvanzado?.(avanzada.checked);
    avanzada.addEventListener('change',function(){
      infoUI?.configurarAvanzado?.(avanzada.checked);
      try{localStorage.setItem('forja-informacion-avanzada',String(avanzada.checked));}
      catch(error){}
    });
    $('alternar-menu').addEventListener('click',function(){
      alternarMenu(!$('panel-forja').classList.contains('panel-abierto'));
    });
    document.querySelectorAll('.juegos-compactos [data-juego]').forEach(function(button){
      button.addEventListener('click',function(){
        $('juego').value=button.dataset.juego;
        refrescarSelectores();
      });
    });
    $('tab-personajes').addEventListener('click',function(){marcarPanel('personajes');});
    $('tab-herramientas').addEventListener('click',function(){marcarPanel('herramientas');});
    var tema=$('selector-tema');
    var temaInicial=document.documentElement.dataset.tema||'clasico';
    if(['clasico','ebano','ceruleo','obsidiana','violeta'].includes(temaInicial))
      tema.value=temaInicial;
    tema.addEventListener('change',function(){
      document.documentElement.dataset.tema=tema.value;
      try{localStorage.setItem('forja-tema',tema.value);}catch(error){}
    });
    $('juego').addEventListener('change',refrescarSelectores);
    $('modo-nombre').addEventListener('change',refrescarSelectores);
    $('sexo-pj').addEventListener('change',function(){
      try{localStorage.setItem('forja-sexo-pj',$('sexo-pj').value);}catch(error){}
      refrescarSelectores();
    });
    $('respetar-contexto-sexo').addEventListener('change',function(){
      try{localStorage.setItem('forja-respetar-contexto-sexo',
        String($('respetar-contexto-sexo').checked));}catch(error){}
      refrescarSelectores();
    });
    $('con-especie').addEventListener('change',refrescarSelectores);
    $('origenes').addEventListener('change',refrescarFuentesConPreservacion);
    $('fuentes-nd20').addEventListener('change',function(){
      fuentesGuardadas[$('juego').value]=fuentesNd20Activas();
      refrescarFuentesConPreservacion();
    });
    $('ocultar-tutorial').addEventListener('click',function(){
      $('tutorial-inicial').hidden=true;
      try{localStorage.setItem('forja-tutorial-oculto','true');}
      catch(error){/* El cierre de esta sesión sigue activo. */}
    });
    try{$('tutorial-inicial').hidden=localStorage.getItem('forja-tutorial-oculto')==='true';}
    catch(error){/* Sin almacenamiento: permite cerrar durante la sesión. */}
    $('copiar-semilla').addEventListener('click',function(){
      if(ultimaReproduccion)copiar(ultimaReproduccion.semilla);
    });
    $('copiar-reproduccion').addEventListener('click',function(){
      if(ultimaReproduccion)copiar(JSON.stringify(ultimaReproduccion,null,2));
    });
    $('aplicar-reproduccion').addEventListener('click',function(){
      try{
        aplicarReproduccion($('texto-reproduccion').value);
        $('aviso-configuracion').textContent='';
      }catch(error){
        $('aviso-reproduccion').textContent=error.message;
        $('aviso-configuracion').textContent=error.message;
        $('aviso-reproduccion').focus?.();
      }
    });
    $('configuracion').addEventListener('submit',function(e) {
      e.preventDefault();
      var c;
      try{c=config();}
      catch(error){mostrarErrorConfiguracion(error);return;}
      $('aviso-configuracion').textContent='';
      try{
        var createRng=rngUnico(),items=[];
        for(var i=0;i<c.cantidad;i++){
          var r=createRng(i);
          var nivelEfectivo=reglas.nivelAleatorio(c.nivelMin,c.nivelMax,r,c.juego==='dh'?36:30);
          var semillaPersonaje=null;
          // La elección de Herencia dual modifica un VA antes de subir Niveles.
          // Guardamos la semilla para reconstruir exactamente la misma creación
          // con la alternativa definitiva, sin parchear atributos al final.
          if(c.juego==='nd20' && c.modo==='personalizado'){
            semillaPersonaje=Math.floor(r()*4294967296);
            r=reglas.aleatorioSemilla('forja-herencia:'+semillaPersonaje);
          }
          var configFicha=Object.assign({},c,{nivel:nivelEfectivo});
          if(semillaPersonaje!==null)
            Object.assign(configFicha,{herenciaPendiente:true,desarrolloPendiente:true});
          var personaje=crearFicha(configFicha,r);
          if(c.juego==='dh'){items.push(personaje);continue;}
          var partes=personaje.descripcion.split(' · ');
          var opciones=Object.assign({},configFicha,{ocupacion:partes[0],especie:partes.slice(1).join(' · ')});
          var juegoDatos=c.juego==='nd20_cifi'?datos.cifi:
            c.juego==='nd20_nocturna'?datos.nocturna:datos.fantasia;
          var plan=poderes.planificar(opciones,juegoDatos,datos.catalogo,datos.progresiones);
          if(c.modo==='personalizado'&&plan.pasos.some(function(x){return !x.automatico;})){
            cerrarMenuMovil();
            mostrarReproduccion($('semilla').value,c);
            if(configurador.open)cerrarConfiguracion();
            prepararEditor(personaje,plan,r,
              {config:configFicha,semillaPersonaje:semillaPersonaje});return;
          }
          items.push(poderes.registrar(personaje,plan,poderes.resolver(plan,null,r)));
        }
        items.forEach(function(p){agregar('ficha',p);});
        mostrarReproduccion($('semilla').value,c);
        if(configurador.open)cerrarConfiguracion();
        cerrarMenuMovil();
        // En móvil, las fichas están DEBAJO del formulario: mostrar el
        // resultado de la acción sin obligar a buscarlo haciendo scroll.
        if(items.length&&window.matchMedia('(max-width:830px)').matches){
          requestAnimationFrame(function(){
            var titulo=$('titulo-resultados');
            titulo.focus({preventScroll:true});
            titulo.scrollIntoView({behavior:window.matchMedia(
              '(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
              block:'start'});
          });
        }
      }catch(error){mostrarErrorConfiguracion(error);}
    });
    $('form-revision-elecciones').addEventListener('change',function(e){
      if(e.target.matches('select[data-revision-paso]'))refrescarRevision();
    });
    $('form-revision-elecciones').addEventListener('submit',function(e){
      e.preventDefault();
      var mensaje='';
      conControl(function(){
        var entrada=entradaRevision();
        var resultado=poderes.revisar(entrada.valor,seleccionesRevision());
        entrada.valor=resultado.personaje;
        cerrarRevisionElecciones();
        dibujar();
        var boton=$('fichas').querySelector('.revisar-elecciones[data-id="'+entrada.id+'"]');
        if(boton)boton.focus({preventScroll:true});
        mensaje='Talentos y Poderes actualizados.'+
          (resultado.preparacionesRetiradas?
            ' '+resultado.preparacionesRetiradas+' preparación(es) invalidadas retiradas.':'');
      });
      if(mensaje)aviso(mensaje);
    });
    $('revision-cerrar').addEventListener('click',cerrarRevisionElecciones);
    $('revision-cancelar').addEventListener('click',cerrarRevisionElecciones);
    $('editor-revision-elecciones').addEventListener('cancel',function(e){
      e.preventDefault();cerrarRevisionElecciones();
    });
    $('editor-revision-elecciones').addEventListener('click',function(e){
      if(e.target!==this)return;
      var r=this.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||
         e.clientY<r.top||e.clientY>r.bottom)cerrarRevisionElecciones();
    });
    $('form-elecciones').addEventListener('submit',function(event){
      event.preventDefault();
      conControl(function(){
        if(!borrador)throw Error('No existe un personaje pendiente.');
        var e=leerElecciones();
        var resultado=poderes.resolver(borrador.plan,e,borrador.rng);
        var personaje=borrador.personaje;
        var herencia=(e['herencia-dual']||[])[0];
        var desarrolloHumano=(e['buen-desarrollo']||[])[0];
        if(herencia||desarrolloHumano){
          if(!borrador.origen || borrador.origen.semillaPersonaje===null)
            throw Error('No se puede reconstruir la elección de Herencia dual.');
          var partesHerencia=herencia?herencia.split(':'):[];
          var nuevo=crearFicha(Object.assign({},borrador.origen.config,{
            herenciaDual:partesHerencia[0]||null,
            atributoBuenDesarrollo:desarrolloHumano||
              (partesHerencia.length===2?partesHerencia[1]:null)
          }),reglas.aleatorioSemilla('forja-herencia:'+
            borrador.origen.semillaPersonaje));
          if(nuevo.descripcion!==personaje.descripcion || nuevo.sexo!==personaje.sexo)
            throw Error('La reconstrucción alteró la identidad del personaje.');
          personaje=nuevo;
        }
        agregar('ficha',poderes.registrar(personaje,borrador.plan,resultado));
        cerrarEditor();
      });
    });
    $('grupos-elecciones').addEventListener('change',function(event){
      if(event.target.matches('select[data-paso]'))refrescarOpciones();
    });
    $('cancelar-elecciones').addEventListener('click',cerrarEditor);
    document.querySelectorAll('input[name="modo-creacion"]').forEach(function(radio){
      radio.addEventListener('change',function(){
        if(radio.checked && radio.value==='personalizado')$('cantidad').value='1';
        $('cantidad').disabled=radio.checked && radio.value==='personalizado';
      });
    });
    $('generar-seguidor').addEventListener('click',function(){
      conControl(function(){
        var c=config();if(c.juego!=='dh')throw Error('Elige Dungeon Hack para generar seguidores.');
        c.nivel=Math.min(30,c.nivel);
        agregar('ficha',reglas.seguidorDH(datos.dh,c,rngUnico()(correlativo)));
      });
    });
    $('generar-matriz').addEventListener('click',function(){
      conControl(function(){agregar('ficha',reglas.matriz(config(),rngUnico()(correlativo)));});
    });
    $('generar-mazmorra').addEventListener('click',function(){
      conControl(function(){agregar('mazmorra',reglas.mazmorra({ancho:6,alto:6},rngUnico()(correlativo)));});
    });
    $('armamento-modo').addEventListener('change',refrescarArmamento);
    $('armamento-origen').addEventListener('change',function(){
      llenarDestinoArmamento();refrescarArmamento();
    });
    $('armamento-destino').addEventListener('change',refrescarArmamento);
    $('armamento-grupo').addEventListener('change',llenarCompraArmamento);
    $('armamento-articulo').addEventListener('change',refrescarArmamento);
    $('armamento-cantidad').addEventListener('input',refrescarArmamento);
    $('form-armamento').addEventListener('submit',function(event){
      event.preventDefault();
      var mensajeConfirmacion='';
      conControl(function(){
        var entrada=entradaArmamento(),personaje=entrada.valor;
        var contexto=contextoArmamento(personaje);
        var compra=window.NaufragioEquipment;
        var resultado,nota;
        if($('armamento-modo').value==='cambiar'){
          var destino=JSON.parse($('armamento-destino').value||'null');
          if(!Array.isArray(destino)||destino.length!==2)
            throw Error('Selecciona una sustitución válida.');
          resultado=compra.intercambiarEquipoInicial(
            personaje,datos.equipoInicial,contexto.ocupacion,contexto.nivel,
            contexto.especie,{indice:Number($('armamento-origen').value),
              grupo:destino[0],nombre:destino[1]});
          personaje.compras_iniciales_intercambiables=
            resultado.compras_iniciales_intercambiables;
          personaje.equipo=resultado.equipo;
          nota='Cambio de equipo inicial: '+resultado.original+' → '+resultado.nuevo+
            '; recuperadas '+dineroEquipo(resultado.reembolso)+
            '; precio nuevo '+dineroEquipo(resultado.coste)+
            '; saldo '+dineroEquipo(resultado.restante)+'.';
        }else{
          var articulo=JSON.parse($('armamento-articulo').value||'null');
          if(!Array.isArray(articulo)||articulo.length!==2)
            throw Error('Selecciona un artículo válido.');
          resultado=compra.comprarArmamentoFantasia(
            personaje,datos.equipoInicial,contexto.ocupacion,contexto.nivel,
            contexto.especie,[{grupo:articulo[0],nombre:articulo[1],
              cantidad:Number($('armamento-cantidad').value)}]);
          personaje.equipo=resultado.equipo;
          nota='Compra adicional de armamento: '+resultado.adquiridos.join(', ')+
            '; gastadas '+dineroEquipo(resultado.gastado)+
            '; saldo '+dineroEquipo(resultado.restante)+'.';
        }
        personaje.saldo_mo=resultado.restante;
        if(personaje.arma_equipada&&!compra.armasDisponibles(
          personaje,datos.equipoInicial).some(function(x){return x.nombre===personaje.arma_equipada;}))
          personaje.arma_equipada='';
        personaje.riqueza=resultado.restante+' mo restantes / '+
          personaje.capital_inicial_mo+' mo iniciales';
        // Si ya no se posee la protección que estaba equipada, limpiarla.
        var protecciones=compra.proteccionesDisponibles(personaje,datos.equipoInicial);
        if(personaje.protecciones_equipadas){
          ['armadura','escudo'].forEach(function(tipo){
            var disponibles=tipo==='armadura'?protecciones.armaduras:protecciones.escudos;
            var seleccionada=personaje.protecciones_equipadas[tipo];
            if(seleccionada&&!disponibles.some(function(x){return x.nombre===seleccionada;}))
              personaje.protecciones_equipadas[tipo]='';
          });
        }
        if(!Array.isArray(personaje.notas))personaje.notas=[];
        personaje.notas.push(nota);
        cerrarArmamento();dibujar();
        mensajeConfirmacion='Equipo actualizado. '+nota;
      });
      // conControl limpia el aviso al finalizar; mostrar el éxito después.
      if(mensajeConfirmacion)aviso(mensajeConfirmacion);
    });
    $('armamento-cancelar').addEventListener('click',cerrarArmamento);
    $('armamento-cerrar').addEventListener('click',cerrarArmamento);
    $('editor-armamento').addEventListener('cancel',function(e){
      e.preventDefault();cerrarArmamento();
    });
    $('editor-armamento').addEventListener('click',function(e){
      if(e.target!==this)return;
      var r=this.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||
         e.clientY<r.top||e.clientY>r.bottom)cerrarArmamento();
    });
    $('compras-grupo').addEventListener('change',rellenarArticulosCompra);
    $('compras-armadura-equina-base').addEventListener('change',refrescarConsultaArmaduraEquina);
    $('compras-articulo').addEventListener('change',refrescarCompra);
    $('compras-cantidad').addEventListener('input',refrescarCompra);
    $('compras-nivel').addEventListener('input',refrescarCompra);
    // Intro en Cantidad o Nivel añade la línea, nunca confirma el carrito.
    // Dejar el selector Artículo con sus teclas nativas (abrir/seleccionar).
    $('form-compra-utiles').addEventListener('keydown',function(event){
      if(event.key!=='Enter'||!event.target.matches(
        '#compras-cantidad, #compras-nivel'))return;
      event.preventDefault();
      if(!event.repeat)$('compras-anadir').click();
    });
    $('compras-lista').addEventListener('click',function(event){
      var boton=event.target.closest('.compras-quitar-linea');
      if(!boton)return;
      conControl(function(){
        entradaCompra();
        var indice=Number(boton.dataset.indice);
        if(!Number.isInteger(indice)||indice<0||
            indice>=compraBorrador.seleccion.length)
          throw Error('La línea de compra ya no existe.');
        compraBorrador.seleccion.splice(indice,1);
        refrescarCompra();
        // Tras redibujar, mantener el foco en la siguiente línea, si existe.
        var botones=$('compras-lista').querySelectorAll('.compras-quitar-linea');
        if(botones.length)botones[Math.min(indice,botones.length-1)]
          .focus({preventScroll:true});
        else $('compras-articulo').focus({preventScroll:true});
      });
    });
    $('compras-anadir').addEventListener('click',function(){
      conControl(function(){
        var entrada=entradaCompra(),linea=lineaCompra();
        window.NaufragioEquipment.compraUtilesFantasia(datos.equipoInicial,
          entrada.valor.saldo_mo,compraBorrador.seleccion.concat([linea]),
          entrada.valor.equipo);
        compraBorrador.seleccion.push(linea);
        refrescarCompra();
      });
    });
    $('form-compra-utiles').addEventListener('submit',function(e){
      e.preventDefault();
      conControl(function(){
        var entrada=entradaCompra(),personaje=entrada.valor;
        if(!compraBorrador.seleccion.length)
          throw Error('Añade al menos un artículo antes de confirmar la compra.');
        var compra=window.NaufragioEquipment.compraUtilesFantasia(
          datos.equipoInicial,personaje.saldo_mo,
          compraBorrador.seleccion,personaje.equipo);
        // Todas las validaciones se realizan ANTES de modificar la ficha.
        personaje.equipo.push.apply(personaje.equipo,compra.equipo);
        personaje.saldo_mo=compra.restante;
        personaje.riqueza=compra.restante+' mo restantes / '+
          personaje.capital_inicial_mo+' mo iniciales';
        // Conservar el apunte de la compra inicial como histórico: su
        // saldo no debe confundirse con el saldo actual tras comprar útiles.
        personaje.notas=personaje.notas.map(function(n){
          return n.startsWith('Equipo DRS adquirido por ')?
            n.replace('Equipo DRS adquirido por ','Equipo DRS inicial adquirido por ')
              .replace('; saldo ','; saldo tras creación '):n;
        });
        personaje.notas.push('Compra adicional de útiles: '+compra.gastado+
          ' mo; saldo actual '+compra.restante+' mo.');
        var idComprador=entrada.id;
        cerrarCompra();
        dibujar();
        var boton=$('fichas').querySelector(
          '.gestionar-equipo[data-id="'+idComprador+'"]');
        if(boton)boton.focus({preventScroll:true});
      });
    });
    $('compras-cancelar').addEventListener('click',cerrarCompra);
    $('compras-cerrar').addEventListener('click',cerrarCompra);
    $('editor-compras').addEventListener('cancel',function(event){
      event.preventDefault();
      cerrarCompra(); // Escape descarta el borrador y devuelve el foco.
    });
    $('editor-compras').addEventListener('click',function(event){
      if(event.target!==this)return;
      var r=this.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||
         event.clientY<r.top||event.clientY>r.bottom)cerrarCompra();
    });
    $('inicio-movil').querySelector('.empezar-forja').addEventListener('click',function(){
      marcarPanel('personajes');
      if(window.matchMedia('(max-width:830px)').matches)alternarMenu(true);
      $('panel-forja').scrollIntoView({behavior:window.matchMedia(
        '(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      $('abrir-configuracion').focus({preventScroll:true});
      refrescarGenerarFlotante();
    });
    $('editor-gestion-equipo').addEventListener('change',function(event){
      if(event.target.id==='gestion-arma'){
        conControl(function(){
          var entrada=entradaGestionEquipo();
          var opcion=event.target.value;
          var validas=window.NaufragioEquipment.armasDisponibles(
            entrada.valor,datos.equipoInicial);
          if(opcion&&!validas.some(function(x){return x.nombre===opcion;}))
            throw Error('El arma elegida no está en el inventario DRS.');
          entrada.valor.arma_equipada=opcion;
          dibujar();refrescarGestionEquipo();
          $('gestion-arma').focus({preventScroll:true});
        });return;
      }
      var selector=event.target.closest('.seleccionar-proteccion');
      if(!selector)return;
      conControl(function(){
        var entrada=entradas.find(function(x){
          return x.tipo==='ficha'&&String(x.id)===selector.dataset.id;
        });
        if(!entrada||entrada.valor.juego!=='Naufragio d20 · Fantasía')
          throw Error('No existe una ficha DRS válida para equipar protección.');
        var tipo=selector.dataset.tipo;
        if(tipo!=='armadura'&&tipo!=='escudo')
          throw Error('Tipo de protección desconocido.');
        var disponibles=window.NaufragioEquipment.proteccionesDisponibles(
          entrada.valor,datos.equipoInicial)[tipo==='armadura'?'armaduras':'escudos'];
        var nombre=selector.value;
        if(nombre&&!disponibles.some(function(x){return x.nombre===nombre;}))
          throw Error('La protección no consta en el inventario del personaje.');
        if(!entrada.valor.protecciones_equipadas)
          entrada.valor.protecciones_equipadas={armadura:'',escudo:''};
        entrada.valor.protecciones_equipadas[tipo]=nombre;
        var id=entrada.id;
        dibujar();refrescarGestionEquipo();
        var nuevo=$('editor-gestion-equipo').querySelector(
          '.seleccionar-proteccion[data-id="'+id+'"][data-tipo="'+tipo+'"]');
        if(nuevo)nuevo.focus({preventScroll:true});
      });
    });
    $('gestion-cerrar').addEventListener('click',function(){cerrarGestionEquipo();});
    $('gestion-terminar').addEventListener('click',function(){cerrarGestionEquipo();});
    $('gestion-abrir-armamento').addEventListener('click',function(){
      conControl(function(){abrirCompraDesdeGestion('armamento');});
    });
    $('gestion-abrir-utiles').addEventListener('click',function(){
      conControl(function(){abrirCompraDesdeGestion('utiles');});
    });
    $('editor-gestion-equipo').addEventListener('cancel',function(e){
      e.preventDefault();cerrarGestionEquipo();
    });
    $('editor-gestion-equipo').addEventListener('click',function(e){
      if(e.target!==this)return;
      var r=this.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||
         e.clientY<r.top||e.clientY>r.bottom)cerrarGestionEquipo();
    });
    $('fichas').addEventListener('click',function(e){
      var revision=e.target.closest('.revisar-elecciones');
      if(revision){
        conControl(function(){
          var entrada=entradas.find(function(x){
            return x.tipo==='ficha'&&String(x.id)===revision.dataset.id;
          });
          if(!entrada)throw Error('Ficha no encontrada.');
          abrirRevisionElecciones(entrada);
        });return;
      }
      var gestionar=e.target.closest('.gestionar-equipo');
      if(gestionar){
        conControl(function(){
          var entrada=entradas.find(function(x){return String(x.id)===gestionar.dataset.id;});
          if(!entrada)throw Error('Ficha no encontrada para gestionar equipo.');
          abrirGestionEquipo(entrada);
        });return;
      }
      var del=e.target.closest('.eliminar-ficha');
      if(del){
        // La ficha desaparece: no reabrir Equipo después de cancelar su submenú.
        volverGestionEquipo=null;
        if(compraBorrador&&String(compraBorrador.id)===del.dataset.id)
          cerrarCompra();
        if(armamentoBorrador&&String(armamentoBorrador.id)===del.dataset.id)
          cerrarArmamento();
        if(gestionBorrador&&String(gestionBorrador.id)===del.dataset.id)
          cerrarGestionEquipo();
        if(revisionBorrador&&String(revisionBorrador.id)===del.dataset.id)
          cerrarRevisionElecciones();
        entradas=entradas.filter(function(x){return String(x.id)!==del.dataset.id;});
        dibujar();return;
      }
      var pdf=e.target.closest('.exportar-pdf-ficha');
      if(pdf){
        var entradaPdf=entradas.find(function(x){
          return x.tipo==='ficha'&&String(x.id)===pdf.dataset.id;
        });
        if(!entradaPdf||entradaPdf.valor.juego!=='Naufragio d20 · Fantasía'){
          aviso('La ficha solicitada no admite exportación A5.',true);return;
        }
        if(!window.NaufragioPdfBrowser?.exportar){
          aviso('El motor PDF A5 no está disponible.',true);return;
        }
        pdf.disabled=true;
        aviso('Preparando PDF A5 de '+entradaPdf.valor.nombre+'…');
        window.NaufragioPdfBrowser.exportar(
          entradaPdf.valor,blindajePersonaje(entradaPdf.valor),datos.equipoInicial,
          function(nombre){return infoUI?.consulta(nombre,'poder','nd20')||null;}
        ).then(function(paginas){
          aviso('PDF A5 preparado: '+paginas+' página(s).');
        }).catch(function(error){
          aviso(error.message||'No se pudo exportar el PDF A5.',true);
        }).finally(function(){
          if(pdf.isConnected)pdf.disabled=false;
        });
        return;
      }
      var copy=e.target.closest('.copiar-ficha');
      if(copy){
        var found=entradas.find(function(x){return String(x.id)===copy.dataset.id;});
        if(found)copiar(obtenerTexto(found));
      }
    });
    $('borrar').addEventListener('click',function(){
      volverGestionEquipo=null;
      if(compraBorrador)cerrarCompra();
      if(armamentoBorrador)cerrarArmamento();
      if(gestionBorrador)cerrarGestionEquipo();
      entradas=[];dibujar();aviso('Mesa despejada.');
    });
    $('exportar').addEventListener('click',function(){
      descargar('el-naufragio-fichas.txt',entradas.map(obtenerTexto).join('\n\n'+('=').repeat(60)+'\n\n'));
    });
  }
  async function cargar() {
    var archivos={
      especies:'data/especies.json',ocupaciones:'data/ocupaciones.json',
      especiesCifi:'data/especies_cifi.json',ocupacionesCifi:'data/ocupaciones_cifi.json',
      ampliado:'data/catalogo-ampliado.json',
      componentesYlat:'data/componentes-nombres-ylat.json',
      nombresHistoricosYlat:'data/nombres-historicos-ylat.json',
      sexoCatalogo:'data/sexo-personajes.json',
      catalogo:'data/catalogo-poderes.json',
      conjurosUno:'data/conjuros-revisados-001-225.json',
      conjurosDos:'data/conjuros-revisados-226-434.json',
      magnitudes:'data/conjuros-magnitudes-literales.json',
      alcanceDRS:'data/alcance-drs-y-dlc.json',
      danioCompuesto:'data/conjuros-danio-compuesto.json',
      progresiones:'data/progresiones-oficiales.json',
      equipoInicial:'data/equipo-inicial.json',
      fichasDocumentales:'data/fichas-documentales.json',
      talentosDRS:'data/talentos-drs-literales.json',
      tecnicasDRS:'data/tecnicas-drs-literales.json',
      glosasTalentosDRS:'data/glosas-talentos-drs.json',
      glosasEquipoDRS:'data/glosas-equipo-drs.json',
      aclaracionesTalentosDRS:'data/aclaraciones-talentos-drs.json',
      dungeon:'data/dungeon-hack.json'
    };
    var elementos=await Promise.all(Object.entries(archivos).map(async function(par){
      var response=await fetch(par[1],{cache:'no-cache'});
      if(!response.ok)throw Error('No se pudo cargar '+par[1]+' ('+response.status+').');
      return [par[0],await response.json()];
    }));
    var loaded=Object.fromEntries(elementos);
    window.NaufragioI18n?.cargar?.('es').catch(function(){ /* Texto español de respaldo. */ });
    var extra=loaded.ampliado;
    datos.fantasia={
      especies:Object.assign({},loaded.especies,extra.fantasia.especies),
      ocupaciones:Object.assign({},loaded.ocupaciones,extra.fantasia.ocupaciones)
    };
    datos.cifi={
      especies:Object.assign({},loaded.especiesCifi),
      ocupaciones:loaded.ocupacionesCifi
    };
    Object.keys(extra.cifi.especies).forEach(function(key) {
      if(datos.cifi.especies[key])
        datos.cifi.especies[key]=Object.assign({},datos.cifi.especies[key],extra.cifi.especies[key]);
    });
    datos.nocturna=extra.nocturna;
    // Las fuentes se obtienen de los metadatos documentales, no del nombre mostrado.
    datos.fantasia.fuentes={
      especies:Object.fromEntries(Object.keys(datos.fantasia.especies).map(function(key){
        var ficha=extra.fantasia.especies[key];
        return [key,ficha?(ficha.fuente||'NaufragioD20 — Especies').replace(' (Google Drive)',''):'DRS'];
      })),
      ocupaciones:Object.fromEntries(Object.keys(datos.fantasia.ocupaciones).map(function(key){
        var ficha=extra.fantasia.ocupaciones[key];
        return [key,ficha?(ficha.suplemento||'NaufragioD20 — Ocupaciones'):'DRS'];
      }))
    };
    datos.cifi.fuentes={
      especies:Object.fromEntries(Object.keys(datos.cifi.especies).map(function(key){
        return [key,'Naufragio d20 CiFi'];
      })),
      ocupaciones:Object.fromEntries(Object.keys(datos.cifi.ocupaciones).map(function(key){
        return [key,'Naufragio d20 CiFi'];
      }))
    };
    datos.nocturna.fuentes={
      especies:Object.fromEntries(Object.keys(datos.nocturna.especies).map(function(key){
        return [key,'Naufragio d20 Nocturna'];
      })),
      ocupaciones:Object.fromEntries(Object.keys(datos.nocturna.ocupaciones).map(function(key){
        return [key,'Naufragio d20 Nocturna'];
      }))
    };
    datos.fantasiaAmpliadas=extra.fantasia.ocupaciones;
    datos.alcanceDRS=loaded.alcanceDRS;
    datos.catalogo=loaded.catalogo;
    datos.talentosDRS=loaded.talentosDRS;
    datos.aclaracionesTalentosDRS=loaded.aclaracionesTalentosDRS;
    datos.componentesYlat=loaded.componentesYlat;
    datos.nombresHistoricosYlat=loaded.nombresHistoricosYlat;
    datos.sexo=loaded.sexoCatalogo;
    datos.progresiones=loaded.progresiones;
    datos.equipoInicial=loaded.equipoInicial;
    if(infoUI&&window.NaufragioTooltipIndex){
      var indice=window.NaufragioTooltipIndex.indice({
        fantasia:datos.fantasia,cifi:datos.cifi,nocturna:datos.nocturna,
        catalogo:datos.catalogo,equipo:datos.equipoInicial,
        alcanceDRS:datos.alcanceDRS,
        descripciones:loaded.fichasDocumentales,
        talentosDRS:loaded.talentosDRS,
        tecnicasDRS:loaded.tecnicasDRS,
        glosasTalentosDRS:loaded.glosasTalentosDRS,
        glosasEquipoDRS:loaded.glosasEquipoDRS,
        aclaracionesTalentosDRS:loaded.aclaracionesTalentosDRS,
        conjurosRevisados:loaded.conjurosUno.conjuros.concat(loaded.conjurosDos.conjuros),
        magnitudes:loaded.magnitudes,
        danioCompuesto:loaded.danioCompuesto
      });
      infoUI.configurar(indice);
    }
    datos.dh=loaded.dungeon;
    $('origenes').textContent='';
    datos.dh.origins.forEach(function(nombre,index){
      var label=document.createElement('label');
      label.className='casilla';
      var input=document.createElement('input');
      input.type='checkbox';input.value=String(index);input.checked=true;
      label.appendChild(input);label.appendChild(document.createTextNode(' '+nombre));
      $('origenes').appendChild(label);
    });
    try{
      var sexoGuardado=localStorage.getItem('forja-sexo-pj');
      if(['aleatorio','femenino','masculino'].includes(sexoGuardado))
        $('sexo-pj').value=sexoGuardado;
      var contextoGuardado=localStorage.getItem('forja-respetar-contexto-sexo');
      if(contextoGuardado==='true'||contextoGuardado==='false')
        $('respetar-contexto-sexo').checked=contextoGuardado==='true';
    }catch(error){ /* El formulario funciona sin almacenamiento. */ }
    vincular();refrescarSelectores();dibujar();
    $('generar').disabled=false;
    $('generar-dialogo').disabled=false;
    refrescarResumenCreacion();
    refrescarGenerarFlotante();
    aviso('Datos listos. Puedes empezar a generar personajes.');
  }
  $('generar').disabled=true;
  $('generar-dialogo').disabled=true;
  aviso('Cargando datos de los sistemas…');
  cargar().catch(function (e) {aviso('Error de carga: '+e.message+
    ' Abre el proyecto mediante GitHub Pages o un servidor HTTP local.',true);});
})();
