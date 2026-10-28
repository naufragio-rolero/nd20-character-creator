/* Interfaz estática y progresiva. Toda la generación ocurre en el navegador. */
(function () {
  'use strict';
  var reglas = window.NaufragioRules;
  var poderes = window.NaufragioPoderes;
  var datos = {};
  var entradas = [];
  var correlativo = 0;
  var borrador = null;
  var fuentesGuardadas = {};
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
    var juego = $('juego').value, dh = juego === 'dh';
    refrescarBotonesSistema();
    $('opciones-dh').hidden = !dh;
    $('opciones-fuentes').hidden = dh;
    $('opciones-nombres-ylat').hidden = juego!=='nd20';
    $('modos-creacion').hidden = dh;
    $('generar-seguidor').disabled = !dh;
    $('nivel').max = dh ? '36' : '30';
    $('rango-nivel').textContent = dh ? '1–36' : '1–30';
    if (Number($('nivel').value) > Number($('nivel').max)) $('nivel').value = $('nivel').max;
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
      selecciones('ocupacion',Object.keys(d.ocupaciones).filter(function(key){
        return fuentes.indexOf(d.fuentes.ocupaciones[key])!==-1;
      }).map(function(key){
        return {key:key,nombre:key+' ('+d.fuentes.ocupaciones[key]+')'};
      }).sort(ordenar),true);
      selecciones('especie',Object.keys(d.especies).filter(function(key){
        return fuentes.indexOf(d.fuentes.especies[key])!==-1;
      }).map(function(key){
        return {key:key,nombre:key+' ('+d.fuentes.especies[key]+')'};
      }).sort(ordenar),true);
    }
  }
  function ordenar(a,b) {return a.nombre.localeCompare(b.nombre, 'es');}
  function dhModo(juego) {
    if(juego==='dh')return 'rapido';
    return document.querySelector('input[name="modo-creacion"]:checked').value;
  }
  function config() {
    var juego=$('juego').value, nivel=Number($('nivel').value);
    var cantidad=Number($('cantidad').value);
    if (!Number.isInteger(nivel) || nivel < 1 || nivel > (juego === 'dh' ? 36 : 30))
      throw Error('Indica un Nivel válido para el sistema elegido.');
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 12)
      throw Error('Puedes generar entre 1 y 12 fichas a la vez.');
    var origenes=origenesActivos();
    if (juego==='dh' && !origenes.length)
      throw Error('Marca al menos una procedencia para Dungeon Hack.');
    var fuentes=juego==='dh'?null:fuentesNd20Activas();
    if(juego!=='dh'&&!fuentes.length)
      throw Error('Marca al menos una fuente de Naufragio d20.');
    var modo = dhModo(juego);
    if(modo==='personalizado' && cantidad!==1)
      throw Error('El modo Personalizado crea una ficha por vez. Selecciona cantidad 1.');
    return {juego:juego, nivel:nivel, cantidad:cantidad, modo:modo,
      ocupacion:$('ocupacion').value, especie:$('especie').value,
      conEspecie:$('con-especie').checked, origenes:origenes, fuentes:fuentes,
      nombre:$('nombre-personaje').value.trim(),
      modoNombre:$('modo-nombre').value};
  }
  function crearFicha(cfg, rng) {
    if (cfg.juego === 'dh') return reglas.eleccionDH(datos.dh,cfg,rng);
    return reglas.crearNd20(datosJuego(cfg.juego),
      Object.assign({},cfg,{aplazarElecciones:true,tesauroYlat:datos.tesauroYlat,
        catalogoEquipo:datos.equipoInicial}),rng);
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
  }
  function cerrarMenuMovil(){
    if(window.matchMedia('(max-width:830px)').matches)alternarMenu(false);
  }
  function htmlLista(titulo, valores) {
    if (!valores || !valores.length) return '';
    return '<section class="bloque-ficha"><h4>' + esc(titulo) + '</h4><ul>' +
      valores.map(function (v) {return '<li>' + esc(v) + '</li>';}).join('') + '</ul></section>';
  }
  function htmlRecursos(pares) {
    return '<div class="recursos">' + (pares || []).map(function (p) {
      return '<div><span>' + esc(p[0]) + '</span><strong>' + esc(p[1]) + '</strong></div>';
    }).join('') + '</div>';
  }
  function fichaHTML(personaje, id) {
    var esDungeonHack = personaje.juego.indexOf('Dungeon Hack') === 0;
    var attrs = personaje.atributos.map(function (a) {
      var cifra = esDungeonHack ?
        '<strong>' + esc(a.dificultad) + '</strong><small>DD</small>' :
        '<strong>' + esc(a.valor) + '</strong><small>DA ' + esc(a.dificultad) + '+</small>';
      return '<div class="atributo"><span class="nombre-atributo">' + esc(a.nombre) +
        (a.favorito ? ' <span title="Atributo favorito" aria-label="Favorito">★</span>' : '') +
        '</span><span>' + cifra + '</span></div>';
    }).join('');
    return '<article class="tarjeta" data-id="' + id + '">' +
      '<div class="cabecera-ficha"><div><p class="etiqueta">' + esc(personaje.juego) +
      ' · Nivel ' + esc(personaje.nivel) + '</p><h3>' + esc(personaje.nombre) +
      '</h3><p>' + esc(personaje.descripcion) + '</p></div>' +
      '<button class="icon-btn eliminar-ficha" data-id="' + id + '" aria-label="Eliminar esta ficha" title="Eliminar">×</button></div>' +
      (personaje.concepto ? '<p class="concepto"><strong>Concepto:</strong> ' + esc(personaje.concepto) + '</p>' : '') +
      '<div class="atributos">' + attrs + '</div>' + htmlRecursos(personaje.recursos) +
      htmlLista('Talentos y capacidades',personaje.capacidades) +
      htmlLista('Conjuros y Poderes conocidos',personaje.poderes) +
      htmlLista('Conjuros preparados',personaje.conjuros_preparados) +
      htmlLista('Competencias',personaje.competencias) +
      htmlLista('Equipo',personaje.equipo) +
      (personaje.riqueza ? '<p class="riqueza"><strong>Riqueza:</strong> ' + esc(personaje.riqueza) + '</p>' : '') +
      htmlLista('Observaciones',personaje.notas) +
      '<div class="pie-ficha"><small>' + esc(fuentesFicha(personaje)) +
      '</small><button type="button" class="copiar-ficha" data-id="' + id +
      '">Copiar ficha</button></div></article>';
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
    var str=[p.nombre,p.juego,'Nivel: '+p.nivel,p.descripcion];
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
    if(!entradas.length) fichas.innerHTML='<div class="vacio"><span class="emblema" aria-hidden="true">◇</span>'+
      '<p>Una historia espera a su protagonista.</p><p class="muted">Elige un sistema y genera tu primera ficha.</p></div>';
  }
  function agregar(tipo,valor) {
    entradas.unshift({tipo:tipo,valor:valor,id:++correlativo});
    dibujar();
  }
  function conControl(fn) {
    try { fn(); aviso(''); } catch(e) {aviso(e.message || 'No ha sido posible generar el resultado.',true);}
  }
  function rngUnico() {
    var cadena=$('semilla').value.trim();
    if(!cadena) cadena=String(Date.now())+':'+String(Math.random());
    return function (i) {return reglas.aleatorioSemilla(cadena+':'+i);};
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
  }
  function prepararEditor(personaje,plan,rng){
    borrador={personaje:personaje,plan:plan,rng:rng};
    $('editor-elecciones').hidden=false;
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
          label.appendChild(sel);field.appendChild(label);
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
          (op.requisito?' · Requisitos de uso: '+op.requisito:'');
        sel.appendChild(item);
      });
      if(disponibles.some(function(op){return op.id===anterior;}))sel.value=anterior;
    });
  }
  function vincular() {
    $('alternar-menu').addEventListener('click',function(){
      alternarMenu(!$('panel-forja').classList.contains('panel-abierto'));
    });
    document.querySelectorAll('.juegos-compactos [data-juego]').forEach(function(button){
      button.addEventListener('click',function(){
        $('juego').value=button.dataset.juego;
        refrescarSelectores();
        marcarPanel('personajes');
      });
    });
    $('tab-personajes').addEventListener('click',function(){marcarPanel('personajes');});
    $('tab-herramientas').addEventListener('click',function(){marcarPanel('herramientas');});
    var tema=$('selector-tema');
    try {
      var saved=localStorage.getItem('forja-tema');
      if(['clasico','ebano','ceruleo','obsidiana'].indexOf(saved)!==-1)tema.value=saved;
    }catch(error){ /* Navegación privada / almacenamiento bloqueado. */ }
    document.body.dataset.tema=tema.value;
    tema.addEventListener('change',function(){
      document.body.dataset.tema=tema.value;
      try{localStorage.setItem('forja-tema',tema.value);}catch(error){}
    });
    $('juego').addEventListener('change',refrescarSelectores);
    $('con-especie').addEventListener('change',refrescarSelectores);
    $('origenes').addEventListener('change',refrescarSelectores);
    $('fuentes-nd20').addEventListener('change',function(){
      fuentesGuardadas[$('juego').value]=fuentesNd20Activas();
      refrescarSelectores();
    });
    $('configuracion').addEventListener('submit',function(e) {
      e.preventDefault();
      conControl(function () {
        var c=config(),createRng=rngUnico(),items=[];
        for(var i=0;i<c.cantidad;i++){
          var r=createRng(i),personaje=crearFicha(c,r);
          if(c.juego==='dh'){items.push(personaje);continue;}
          var partes=personaje.descripcion.split(' · ');
          var opciones=Object.assign({},c,{ocupacion:partes[0],especie:partes.slice(1).join(' · ')});
          var juegoDatos=c.juego==='nd20_cifi'?datos.cifi:
            c.juego==='nd20_nocturna'?datos.nocturna:datos.fantasia;
          var plan=poderes.planificar(opciones,juegoDatos,datos.catalogo,datos.progresiones);
          if(c.modo==='personalizado'&&plan.pasos.some(function(x){return !x.automatico;})){
            cerrarMenuMovil();
            prepararEditor(personaje,plan,r);return;
          }
          items.push(poderes.aplicar(personaje,plan,poderes.resolver(plan,null,r)));
        }
        items.forEach(function(p){agregar('ficha',p);});
        cerrarMenuMovil();
      });
    });
    $('form-elecciones').addEventListener('submit',function(event){
      event.preventDefault();
      conControl(function(){
        if(!borrador)throw Error('No existe un personaje pendiente.');
        var e=leerElecciones();
        var resultado=poderes.resolver(borrador.plan,e,borrador.rng);
        agregar('ficha',poderes.aplicar(borrador.personaje,borrador.plan,resultado));
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
    $('fichas').addEventListener('click',function(e){
      var del=e.target.closest('.eliminar-ficha');
      if(del){
        entradas=entradas.filter(function(x){return String(x.id)!==del.dataset.id;});
        dibujar();return;
      }
      var copy=e.target.closest('.copiar-ficha');
      if(copy){
        var found=entradas.find(function(x){return String(x.id)===copy.dataset.id;});
        if(found)copiar(obtenerTexto(found));
      }
    });
    $('borrar').addEventListener('click',function(){entradas=[];dibujar();aviso('Mesa despejada.');});
    $('exportar').addEventListener('click',function(){
      descargar('el-naufragio-fichas.txt',entradas.map(obtenerTexto).join('\n\n'+('=').repeat(60)+'\n\n'));
    });
  }
  async function cargar() {
    var archivos={
      especies:'data/especies.json',ocupaciones:'data/ocupaciones.json',
      especiesCifi:'data/especies_cifi.json',ocupacionesCifi:'data/ocupaciones_cifi.json',
      ampliado:'data/catalogo-ampliado.json',
      tesauroYlat:'data/tesauro-ylat.json',
      catalogo:'data/catalogo-poderes.json',
      progresiones:'data/progresiones-oficiales.json',
      equipoInicial:'data/equipo-inicial.json',
      dungeon:'data/dungeon-hack.json'
    };
    var elementos=await Promise.all(Object.entries(archivos).map(async function(par){
      var response=await fetch(par[1],{cache:'no-cache'});
      if(!response.ok)throw Error('No se pudo cargar '+par[1]+' ('+response.status+').');
      return [par[0],await response.json()];
    }));
    var loaded=Object.fromEntries(elementos);
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
    datos.catalogo=loaded.catalogo;
    datos.tesauroYlat=loaded.tesauroYlat;
    datos.progresiones=loaded.progresiones;
    datos.equipoInicial=loaded.equipoInicial;
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
    vincular();refrescarSelectores();dibujar();
    $('generar').disabled=false;
    aviso('Datos listos. Puedes empezar a generar personajes.');
  }
  $('generar').disabled=true;
  aviso('Cargando datos de los sistemas…');
  cargar().catch(function (e) {aviso('Error de carga: '+e.message+
    ' Abre el proyecto mediante GitHub Pages o un servidor HTTP local.',true);});
})();
