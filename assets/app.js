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
    var juego = $('juego').value, dh = juego === 'dh';
    refrescarBotonesSistema();
    $('opciones-dh').hidden = !dh;
    $('opciones-fuentes').hidden = dh;
    $('aviso-alcance-drs').hidden = juego!=='nd20';
    $('opciones-nombres-ylat').hidden = juego!=='nd20';
    $('opciones-ambito-nombre').hidden = juego!=='nd20'||
      $('modo-nombre').value!=='combinado';
    $('opciones-riqueza-nivel').hidden=dh||juego==='nd20_nocturna';
    $('modos-creacion').hidden = dh;
    $('opciones-contexto-sexo').hidden=dh;
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
      sexo:$('sexo-pj').value,
      respetarContextoSexo:$('respetar-contexto-sexo').checked,
      modoNombre:$('modo-nombre').value,
      ambitoNombre:$('modo-nombre').value==='combinado'?
        $('ambito-nombre').value:'todos',
      riquezaPorNivel:(juego==='nd20'||juego==='nd20_cifi')&&
        $('riqueza-por-nivel').checked};
  }
  function crearFicha(cfg, rng) {
    if (cfg.juego === 'dh') return reglas.eleccionDH(datos.dh,cfg,rng);
    return reglas.crearNd20(datosJuego(cfg.juego),
      Object.assign({},cfg,{aplazarElecciones:true,tesauroYlat:datos.tesauroYlat,
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
  }
  function cerrarMenuMovil(){
    if(window.matchMedia('(max-width:830px)').matches)alternarMenu(false);
  }
  function sistemaFicha(p){
    return p.juego.includes('CiFi')?'nd20_cifi':
      p.juego.includes('Nocturna')?'nd20_nocturna':
      p.juego.includes('Fantasía')?'nd20':'dh';
  }
  function htmlLista(titulo, valores, grupo, sistema) {
    if (!valores || !valores.length) return '';
    return '<section class="bloque-ficha"><h4>' + esc(titulo) + '</h4><ul>' +
      valores.map(function (v) {
        var item=grupo&&infoUI?infoUI.etiqueta(v,grupo,sistema):esc(v);
        return '<li>' + item + '</li>';
      }).join('') + '</ul></section>';
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
        '<strong>VA ' + esc(a.valor) + '</strong><small>DA ' + esc(a.dificultad) + '+</small>';
      return '<div class="atributo"><span class="nombre-atributo">' + esc(a.nombre) +
        (a.favorito ? ' <span title="Atributo favorito" aria-label="Favorito">★</span>' : '') +
        '</span><span>' + cifra + '</span></div>';
    }).join('');
    return '<article class="tarjeta" data-id="' + id + '" data-nivel="' + esc(personaje.nivel) + '">' +
      '<div class="cabecera-ficha"><div><p class="etiqueta">' + esc(personaje.juego) +
      ' · Nivel ' + esc(personaje.nivel) +
      (personaje.sexo?' · '+esc(personaje.sexo==='femenino'?'Femenino':'Masculino'):'') +
      '</p><h3>' + esc(personaje.nombre) +
      '</h3><p>' + esc(personaje.descripcion) + '</p></div>' +
      '<button class="icon-btn eliminar-ficha" data-id="' + id + '" aria-label="Eliminar esta ficha" title="Eliminar">×</button></div>' +
      (personaje.concepto ? '<p class="concepto"><strong>Concepto:</strong> ' + esc(personaje.concepto) + '</p>' : '') +
      '<div class="atributos">' + attrs + '</div>' + htmlRecursos(personaje.recursos) +
      htmlLista('Talentos y capacidades',personaje.capacidades,'talento',sistemaFicha(personaje)) +
      htmlLista('Conjuros y Poderes conocidos',personaje.poderes,'poder',sistemaFicha(personaje)) +
      htmlLista('Conjuros preparados',personaje.conjuros_preparados,'poder',sistemaFicha(personaje)) +
      htmlLista('Competencias',personaje.competencias) +
      htmlLista('Equipo',personaje.equipo,'equipo',sistemaFicha(personaje)) +
      (personaje.riqueza ? '<p class="riqueza"><strong>Riqueza:</strong> ' + esc(personaje.riqueza) + '</p>' : '') +
      htmlLista('Observaciones',personaje.notas) +
      '<div class="pie-ficha"><small>' + esc(fuentesFicha(personaje)) +
      '</small>' +
      (personaje.juego==='Naufragio d20 · Fantasía'&&Number.isFinite(personaje.saldo_mo)?
        '<button type="button" class="comprar-utiles" data-id="'+id+'">Comprar útiles</button>':'')+
      '<button type="button" class="copiar-ficha" data-id="' + id +
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
  // Compras de útiles: la selección se valida con el motor antes de tocar
  // el inventario. Cada editor se vincula al ID único de una ficha DRS.
  function cerrarCompra(){
    var id=compraBorrador&&compraBorrador.id;
    compraBorrador=null;
    $('editor-compras').hidden=true;
    // El teclado vuelve a la ficha que abrió el editor, si sigue presente.
    if(id!==null&&id!==undefined){
      var retorno=$('fichas').querySelector('.comprar-utiles[data-id="'+id+'"]');
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
    var select=$('compras-articulo');
    select.textContent='';
    var etiquetas={aventura:'Aventura',campamento:'Campamento',
      consumibles:'Consumibles',herramientas:'Herramientas',
      escritura:'Escritura',focos:'Focos de Conjuros'};
    var grupos=Object.entries(datos.equipoInicial.utiles_fantasia||{});
    grupos.push(['focos',datos.equipoInicial.focos_conjuros_con_precio||[]]);
    grupos.forEach(function(par){
      var grupo=document.createElement('optgroup');
      grupo.label=etiquetas[par[0]]||par[0];
      par[1].forEach(function(item){
        var opt=document.createElement('option');
        opt.value=item.id;
        opt.textContent=item.nombre+
          ' · '+(item.precio_por_nivel!==undefined?
            item.precio_por_nivel+' mo/Nivel':item.precio+' mo');
        grupo.appendChild(opt);
      });
      select.appendChild(grupo);
    });
    $('compras-cantidad').value='1';
    $('compras-nivel').value='1';
    $('editor-compras').hidden=false;
    refrescarCompra();
    select.focus({preventScroll:true});
    $('editor-compras').scrollIntoView({behavior:'smooth',block:'start'});
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
    if(!Number.isInteger(cantidad)||cantidad<1||cantidad>99)
      throw Error('La cantidad debe ser un entero entre 1 y 99.');
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
      datos.equipoInicial,entrada.valor.saldo_mo,compraBorrador.seleccion);
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
  function prepararEditor(personaje,plan,rng,origen){
    borrador={personaje:personaje,plan:plan,rng:rng,origen:origen||null};
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
    if(['clasico','ebano','ceruleo','obsidiana'].includes(temaInicial))
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
          var r=createRng(i),semillaPersonaje=null;
          // La elección de Herencia dual modifica un VA antes de subir Niveles.
          // Guardamos la semilla para reconstruir exactamente la misma creación
          // con la alternativa definitiva, sin parchear atributos al final.
          if(c.juego==='nd20' && c.modo==='personalizado'){
            semillaPersonaje=Math.floor(r()*4294967296);
            r=reglas.aleatorioSemilla('forja-herencia:'+semillaPersonaje);
          }
          var configFicha=semillaPersonaje===null?c:
            Object.assign({},c,{herenciaPendiente:true,desarrolloPendiente:true});
          var personaje=crearFicha(configFicha,r);
          if(c.juego==='dh'){items.push(personaje);continue;}
          var partes=personaje.descripcion.split(' · ');
          var opciones=Object.assign({},c,{ocupacion:partes[0],especie:partes.slice(1).join(' · ')});
          var juegoDatos=c.juego==='nd20_cifi'?datos.cifi:
            c.juego==='nd20_nocturna'?datos.nocturna:datos.fantasia;
          var plan=poderes.planificar(opciones,juegoDatos,datos.catalogo,datos.progresiones);
          if(c.modo==='personalizado'&&plan.pasos.some(function(x){return !x.automatico;})){
            cerrarMenuMovil();
            prepararEditor(personaje,plan,r,
              {config:c,semillaPersonaje:semillaPersonaje});return;
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
        agregar('ficha',poderes.aplicar(personaje,borrador.plan,resultado));
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
          entrada.valor.saldo_mo,compraBorrador.seleccion.concat([linea]));
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
          datos.equipoInicial,personaje.saldo_mo,compraBorrador.seleccion);
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
          '.comprar-utiles[data-id="'+idComprador+'"]');
        if(boton)boton.focus({preventScroll:true});
      });
    });
    $('compras-cancelar').addEventListener('click',cerrarCompra);
    $('fichas').addEventListener('click',function(e){
      var comprar=e.target.closest('.comprar-utiles');
      if(comprar){
        conControl(function(){
          var entrada=entradas.find(function(x){return String(x.id)===comprar.dataset.id;});
          if(!entrada)throw Error('Ficha no encontrada para comprar útiles.');
          abrirCompra(entrada);
        });return;
      }
      var del=e.target.closest('.eliminar-ficha');
      if(del){
        if(compraBorrador&&String(compraBorrador.id)===del.dataset.id)
          cerrarCompra();
        entradas=entradas.filter(function(x){return String(x.id)!==del.dataset.id;});
        dibujar();return;
      }
      var copy=e.target.closest('.copiar-ficha');
      if(copy){
        var found=entradas.find(function(x){return String(x.id)===copy.dataset.id;});
        if(found)copiar(obtenerTexto(found));
      }
    });
    $('borrar').addEventListener('click',function(){
      cerrarCompra();entradas=[];dibujar();aviso('Mesa despejada.');
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
      tesauroYlat:'data/tesauro-ylat.json',
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
    datos.alcanceDRS=loaded.alcanceDRS;
    datos.catalogo=loaded.catalogo;
    datos.tesauroYlat=loaded.tesauroYlat;
    datos.nombresHistoricosYlat=loaded.nombresHistoricosYlat;
    datos.sexo=loaded.sexoCatalogo;
    datos.progresiones=loaded.progresiones;
    datos.equipoInicial=loaded.equipoInicial;
    if(infoUI&&window.NaufragioTooltipIndex){
      var indice=window.NaufragioTooltipIndex.indice({
        fantasia:datos.fantasia,cifi:datos.cifi,nocturna:datos.nocturna,
        catalogo:datos.catalogo,equipo:datos.equipoInicial,
        descripciones:loaded.fichasDocumentales,
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
    aviso('Datos listos. Puedes empezar a generar personajes.');
  }
  $('generar').disabled=true;
  aviso('Cargando datos de los sistemas…');
  cargar().catch(function (e) {aviso('Error de carga: '+e.message+
    ' Abre el proyecto mediante GitHub Pages o un servidor HTTP local.',true);});
})();
