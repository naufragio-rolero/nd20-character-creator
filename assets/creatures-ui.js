/* Editor de criaturas Nd20 integrado en La Forja.
 * Los borradores y las operaciones de biblioteca no se conectan al generador
 * de personajes ni consultan el bestiario oficial. */
(function(root, factory) {
  var api = factory(root,
    typeof module !== 'undefined' && module.exports ? require('./creatures.js') : root.NaufragioCriaturas,
    typeof module !== 'undefined' && module.exports ? require('./creatures-import.js') : root.NaufragioImportadorCriaturas,
    typeof module !== 'undefined' && module.exports ? require('./creatures-library.js') : root.NaufragioBibliotecaCriaturas);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioCriaturasUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root, modelo, importador, apiBiblioteca) {
  'use strict';
  if (!modelo || !importador || !apiBiblioteca) throw Error('Faltan módulos del Editor de criaturas Nd20.');
  var iniciado = false, biblioteca = null, idActual = null, idConsulta = null, ficha = null;
  var pendiente = null, cambios = false, secuenciaAtaques = 0;
  var catalogoDRS = null, fuentesOficiales = null, cargaFuentes = null;
  var oficialesSeleccionados = new Set(), tipoPropio = null;
  var imagenProcesando = false, tokenImagen = 0;
  var CLAVE_OFICIALES = 'forja-adversarios-oficiales-v1';
  // El manifiesto solo contiene nombres de archivos SVG públicos.
  // Ningún icono forma parte de la ficha reglamentaria o del JSON personal.
  var iconosGaleria = {};
  var d = null;
  function $(id) { return d.getElementById(id); }
  function ele(nodo,clase,texto) {
    var e=d.createElement(nodo);
    if(clase) e.className=clase;
    if(texto!==undefined) e.textContent=String(texto);
    return e;
  }
  function mostrarEstado(texto,error) {
    var e=$('criaturas-estado');
    e.textContent=texto||'';
    e.className='estado'+(error?' error':'');
  }
  function avisosEn(contenedor,errores,advertencias) {
    var destino=$(contenedor);
    destino.textContent='';
    var total=(errores||[]).length+(advertencias||[]).length;
    if(!total) return;
    var titulo=ele('p','',((errores||[]).length?
      (errores.length+' errores y '):'')+(advertencias||[]).length+' avisos para revisar:');
    destino.appendChild(titulo);
    var lista=ele('ul');
    (errores||[]).forEach(function(x){
      lista.appendChild(ele('li','error',(x.campo?x.campo+': ':'')+x.mensaje));
    });
    (advertencias||[]).forEach(function(x){
      lista.appendChild(ele('li','',(x.linea?'Línea '+x.linea+': ':'')+
        (x.campo?x.campo+': ':'')+x.mensaje));
    });
    destino.appendChild(lista);
  }
  function permitirDescartar() {
    return !cambios || (typeof root.confirm === 'function' &&
      root.confirm('Hay cambios de esta criatura sin guardar. ¿Quieres descartarlos?'));
  }
  function aEntero(texto,campo) {
    var valor=String(texto==null?'':texto).trim();
    if(!valor) return null;
    if(!/^\d+$/.test(valor) || !Number.isSafeInteger(Number(valor)))
      throw Error(campo+' debe ser un entero no negativo o quedar vacío.');
    return Number(valor);
  }
  function aEnteroConSigno(texto,campo) {
    var valor=String(texto==null?'':texto).trim();
    if(!/^-?\d+$/.test(valor)||!Number.isSafeInteger(Number(valor)))
      throw Error(campo+' debe ser un entero, positivo, cero o negativo.');
    return Number(valor);
  }
  function actualizarSalud() {
    var modo=$('criaturas-salud-modo').value;
    var nivel=Number($('criaturas-nivel').value);
    var ajuste=Number($('criaturas-salud-ajuste').value);
    var valido=$('criaturas-nivel').value.trim()!=='' &&
      /^-?\d+$/.test($('criaturas-salud-ajuste').value) &&
      Number.isSafeInteger(nivel)&&nivel>=0&&nivel<=100&&Number.isSafeInteger(ajuste);
    var calculada=valido?modelo.saludMedia(nivel,ajuste):null;
    var desglose=$('criaturas-salud-desglose');
    desglose.textContent=valido?
      '('+nivel+' × 4) + ('+ajuste+' × 4) = '+calculada+' puntos de Salud.':
      'Indica Nivel y ajuste para calcular la media de Salud.';
    $('criaturas-salud').readOnly=modo==='automatico';
    if(modo==='automatico') {
      $('criaturas-salud').value=calculada!==null&&calculada>=0?String(calculada):'';
      if(calculada!==null&&calculada<0)
        desglose.textContent+=' El resultado negativo no se puede usar como Salud.';
    }
  }
  function mostrarImagenEditor(){
    var contenedor=$('criaturas-imagen-previa');
    contenedor.textContent='';
    var url=ficha&&ficha.imagen||'';
    if(url){
      var imagen=ele('img');
      imagen.src=url;
      imagen.alt='';
      contenedor.appendChild(imagen);
      contenedor.setAttribute('aria-label','Ilustración añadida');
    }else{
      contenedor.textContent='Sin ilustración';
      contenedor.setAttribute('aria-label','Sin ilustración');
    }
    $('criaturas-imagen-quitar').disabled=!url;
  }
  // Rasterización local: recorte centrado 16:9, sin subir archivos a servidores.
  // El lienzo elimina metadatos de la foto antes de incrustarla en el JSON.
  function convertirIlustracion(archivo){
    return new Promise(function(resolve,reject){
      if(!archivo||!['image/jpeg','image/png','image/webp'].includes(archivo.type)){
        reject(Error('Elige una imagen JPG, PNG o WebP.'));return;
      }
      if(archivo.size>5*1024*1024){
        reject(Error('El archivo supera los 5 MB.'));return;
      }
      var lector=new root.FileReader();
      lector.onerror=function(){reject(Error('No se pudo leer la imagen.'));};
      lector.onload=function(){
        var imagen=new root.Image();
        imagen.onerror=function(){reject(Error('El archivo no es una imagen legible.'));};
        imagen.onload=function(){
          try{
            var ancho=imagen.naturalWidth,alto=imagen.naturalHeight;
            if(!ancho||!alto||ancho*alto>40000000)
              throw Error('La imagen tiene dimensiones no compatibles.');
            var propor=16/9,recAncho=ancho,recAlto=alto;
            if(ancho/alto>propor)recAncho=alto*propor;
            else recAlto=ancho/propor;
            var lienzo=d.createElement('canvas');
            var contexto=lienzo.getContext('2d');
            if(!contexto)throw Error('Tu navegador no admite el procesamiento de imágenes.');
            var resultado='';
            [960,800,640,480].some(function(max){
              lienzo.width=Math.min(max,ancho);
              lienzo.height=Math.max(1,Math.round(lienzo.width*9/16));
              contexto.clearRect(0,0,lienzo.width,lienzo.height);
              contexto.drawImage(imagen,(ancho-recAncho)/2,(alto-recAlto)/2,
                recAncho,recAlto,0,0,lienzo.width,lienzo.height);
              return [0.82,0.7,0.58].some(function(calidad){
                var dato=lienzo.toDataURL('image/webp',calidad);
                if(!dato.startsWith('data:image/webp;base64,'))
                  dato=lienzo.toDataURL('image/jpeg',calidad);
                if(dato.length<=280000){resultado=dato;return true;}
                return false;
              });
            });
            if(!resultado)throw Error('No se pudo reducir la imagen al tamaño permitido.');
            resolve(resultado);
          }catch(error){reject(error);}
        };
        imagen.src=String(lector.result);
      };
      lector.readAsDataURL(archivo);
    });
  }
  async function subirIlustracion(event){
    var archivo=event.target.files&&event.target.files[0];
    if(!archivo)return;
    var token=++tokenImagen;
    imagenProcesando=true;
    $('criaturas-guardar').disabled=true;
    mostrarEstado('Preparando ilustración en formato 16:9…');
    try{
      var url=await convertirIlustracion(archivo);
      if(token!==tokenImagen)return;
      ficha.imagen=url;
      cambios=true;
      mostrarImagenEditor();
      avisarRevision();
      mostrarEstado('Ilustración preparada. Guarda el adversario para conservarla.');
    }catch(error){
      if(token===tokenImagen)mostrarEstado('No se pudo añadir la ilustración: '+error.message,true);
    }finally{
      event.target.value='';
      if(token===tokenImagen){
        imagenProcesando=false;
        $('criaturas-guardar').disabled=false;
      }
    }
  }
  function datosFormulario() {
    var base=modelo.nuevaCriatura(ficha);
    ['nombre','categoria','subcategoria','subtipo','descripcion','notas'].forEach(function(c){
      base[c] = $('criaturas-'+c).value.trim();
    });
    modelo.PUNTUACIONES.forEach(function(c){
      base.puntuaciones[c]=aEntero($('criaturas-'+c).value,c);
    });
    base.saludModo=$('criaturas-salud-modo').value;
    base.saludAjuste=aEnteroConSigno($('criaturas-salud-ajuste').value,'Ajuste de Salud');
    base.camposNoInterpretados=$('criaturas-pendientes').value.split(/\r?\n/)
      .filter(function(x){return x.trim().length>0;});
    base.ataques=Array.from($('criaturas-ataques').children).map(function(fila,indice){
      var v=function(c){return fila.querySelector('[data-campo="'+c+'"]').value;};
      var nombre=v('nombre').trim();
      if(!nombre) throw Error('Falta el nombre del ataque '+(indice+1)+'.');
      return modelo.ataque({
        id:fila.dataset.ataqueId || 'ataque-'+(indice+1),
        conectorAnterior:indice===0?'Inicio':v('conector'),
        cantidad:aEntero(v('cantidad'),'Cantidad de ataque '+(indice+1)),
        nombre:nombre,
        danoLiteral:v('danoLiteral').trim(),
        danoNumerico:aEntero(v('danoNumerico'),'Daño numérico de ataque '+(indice+1)),
        notas:v('notas').trim(),
        segmentoOriginal:fila.dataset.segmentoOriginal||'',
        talentoRelacionado:v('talentoRelacionado').trim()||null
      });
    });
    base.talentos=Array.from($('criaturas-talentos').children).map(function(fila,indice){
      var v=function(c){return fila.querySelector('[data-campo="'+c+'"]').value;};
      if(!v('nombre').trim()) throw Error('Falta el nombre del Talento '+(indice+1)+'.');
      return modelo.talento({
        nombre:v('nombre').trim(),
        descripcion:v('descripcion').trim(),
        textoOriginal:fila.dataset.textoOriginal||'',
        referencia:v('referencia').trim()||null
      });
    });
    return base;
  }
  function avisarRevision() {
    try {
      var val=modelo.revisar(datosFormulario(),{paraExportar:true});
      avisosEn('criaturas-advertencias-formulario',val.errores,val.advertencias);
      return val;
    } catch(error) {
      avisosEn('criaturas-advertencias-formulario',[{campo:'',mensaje:error.message}],[]);
      return {valida:false,errores:[{mensaje:error.message}],advertencias:[]};
    }
  }
  function plantillaAtaque() {
    return '<div class="criaturas-repetido-cabecera"><strong class="criaturas-fila-titulo"></strong>'+
      '<button type="button" data-accion="quitar-ataque">Quitar ataque</button></div>'+
      '<div class="criaturas-repetido-campos">'+
      '<label>Conector<select data-campo="conector"><option value="Inicio">Inicio</option>'+
      '<option value="y">y · simultáneo</option><option value="o">o · alternativa</option>'+
      '<option value=",">, · revisar agrupación</option></select></label>'+
      '<label>Cantidad<input data-campo="cantidad" type="number" min="1" step="1" required></label>'+
      '<label class="criaturas-ancho">Nombre del ataque<input data-campo="nombre" type="text" maxlength="200" required></label>'+
      '<label>Daño literal<input data-campo="danoLiteral" type="text" maxlength="180" placeholder="6, especial, 20 o especial…"></label>'+
      '<label>Daño numérico (opcional)<input data-campo="danoNumerico" type="number" min="0" step="1"></label>'+
      '<label>Talento relacionado (opcional)<input data-campo="talentoRelacionado" type="text" maxlength="200"></label>'+
      '<label class="criaturas-ancho">Notas<input data-campo="notas" type="text" maxlength="500"></label>'+
      '</div><small class="criaturas-texto-original"></small>';
  }
  function plantillaTalento() {
    return '<div class="criaturas-repetido-cabecera"><strong class="criaturas-fila-titulo"></strong>'+
      '<button type="button" data-accion="quitar-talento">Quitar Talento</button></div>'+
      '<div class="criaturas-repetido-campos">'+
      '<label class="criaturas-ancho">Nombre del Talento<input data-campo="nombre" type="text" maxlength="200" required></label>'+
      '<label>Referencia (opcional)<input data-campo="referencia" type="text" maxlength="250"></label>'+
      '<label class="criaturas-ancho">Descripción<textarea data-campo="descripcion" rows="3"></textarea></label>'+
      '</div><small class="criaturas-texto-original"></small>';
  }
  function reajustarAtaques() {
    Array.from($('criaturas-ataques').children).forEach(function(fila,i){
      fila.querySelector('.criaturas-fila-titulo').textContent='Ataque '+(i+1);
      var con=fila.querySelector('[data-campo="conector"]');
      var inicio=con.querySelector('option[value="Inicio"]');
      inicio.disabled=i!==0;
      if(i===0){con.value='Inicio';con.disabled=true;}
      else {
        con.disabled=false;
        if(con.value==='Inicio') con.value='y';
      }
    });
  }
  function agregarAtaque(datos) {
    var a=modelo.ataque(datos||{});
    var fila=ele('div','criaturas-repetido criatura-ataque');
    fila.innerHTML=plantillaAtaque(); // Estructura HTML estática, sin interpolar contenido pegado.
    secuenciaAtaques++;
    fila.dataset.ataqueId=a.id || 'ataque-ui-'+secuenciaAtaques;
    fila.dataset.segmentoOriginal=a.segmentoOriginal;
    var poner=function(c,valor){fila.querySelector('[data-campo="'+c+'"]').value=
      valor===null||valor===undefined?'':String(valor);};
    poner('conector',a.conectorAnterior);
    poner('cantidad',a.cantidad);
    poner('nombre',a.nombre);
    poner('danoLiteral',a.danoLiteral);
    poner('danoNumerico',a.danoNumerico);
    poner('notas',a.notas);
    poner('talentoRelacionado',a.talentoRelacionado);
    fila.querySelector('.criaturas-texto-original').textContent=a.segmentoOriginal?
      'Segmento original: '+a.segmentoOriginal:'';
    $('criaturas-ataques').appendChild(fila);
    reajustarAtaques();
    return fila;
  }
  function agregarTalento(datos) {
    var t=modelo.talento(datos||{});
    var fila=ele('div','criaturas-repetido criatura-talento');
    fila.innerHTML=plantillaTalento(); // Solo plantilla propia.
    fila.dataset.textoOriginal=t.textoOriginal;
    var poner=function(c,valor){fila.querySelector('[data-campo="'+c+'"]').value=
      valor==null?'':String(valor);};
    poner('nombre',t.nombre);poner('descripcion',t.descripcion);poner('referencia',t.referencia);
    fila.querySelector('.criaturas-fila-titulo').textContent=
      'Talento '+($('criaturas-talentos').children.length+1);
    fila.querySelector('.criaturas-texto-original').textContent=t.textoOriginal?
      'Línea original: '+t.textoOriginal:'';
    $('criaturas-talentos').appendChild(fila);
    return fila;
  }
  function renderizarFicha(datos,id) {
    ficha=modelo.nuevaCriatura(datos||{});
    tokenImagen++;
    imagenProcesando=false;
    if($('criaturas-guardar'))$('criaturas-guardar').disabled=false;
    mostrarImagenEditor();
    idActual=id||null;
    secuenciaAtaques=0;
    ['nombre','categoria','subcategoria','subtipo','descripcion','notas'].forEach(function(c){
      var control=$('criaturas-'+c);
      if(c==='categoria' && ficha[c] &&
        !Array.from(control.options).some(function(o){return o.value===ficha[c];})){
        // JSON v1 preexistente: conservar categoría no reconocida mientras se revisa.
        var heredada=ele('option','',ficha[c]+' (importada, revisar)');
        heredada.value=ficha[c];
        heredada.dataset.heredada='true';
        control.appendChild(heredada);
      }
      control.value=ficha[c];
    });
    modelo.PUNTUACIONES.forEach(function(c) {
      $('criaturas-'+c).value=ficha.puntuaciones[c]===null?'':String(ficha.puntuaciones[c]);
    });
    $('criaturas-salud-modo').value=ficha.saludModo;
    $('criaturas-salud-ajuste').value=String(ficha.saludAjuste);
    $('criaturas-descripcion').required=true;
    actualizarSalud();
    $('criaturas-pendientes').value=ficha.camposNoInterpretados.join('\n');
    $('criaturas-original').value=ficha.origen.textoOriginal;
    $('criaturas-ataques').textContent='';
    $('criaturas-talentos').textContent='';
    ficha.ataques.forEach(agregarAtaque);
    ficha.talentos.forEach(agregarTalento);
    $('criaturas-titulo-edicion').textContent=idActual?
      'Editar · '+(ficha.nombre||'Adversario'):'Nuevo adversario';
    $('criaturas-edicion-nota').textContent=idActual?
      'Guardada en tu biblioteca. Los cambios no se aplican hasta pulsar «Guardar criatura».':
      'Borrador no guardado. Los campos desconocidos pueden quedar sin indicar.';
    cambios=false;
    avisarRevision();
  }
  function abrirEditor() {
    if(!$('criaturas-edicion').open)$('criaturas-edicion').showModal();
    $('criaturas-nombre').focus({preventScroll:true});
  }
  function cerrarEditor() {
    if(!permitirDescartar())return;
    cambios=false;
    if($('criaturas-edicion').open)$('criaturas-edicion').close();
  }
  function nueva() {
    if(!permitirDescartar()) return;
    renderizarFicha(modelo.nuevaCriatura(),null);
    mostrarEstado('Nuevo borrador preparado. Aún no hay nada guardado.');
    abrirEditor();
  }
  function cargarSeleccionOficial() {
    try {
      var raw=root.localStorage.getItem(CLAVE_OFICIALES);
      var ids=raw?JSON.parse(raw):[];
      if(!Array.isArray(ids)||ids.some(function(id){return typeof id!=='string';}))
        throw Error('La selección guardada no es válida.');
      oficialesSeleccionados=new Set(ids);
    } catch(error) {
      oficialesSeleccionados=new Set();
      mostrarEstado('No se pudo recuperar la selección oficial: '+error.message,true);
    }
  }
  function actualizarSeleccionOficial(id,anadir) {
    var nueva=new Set(oficialesSeleccionados);
    if(anadir)nueva.add(id);else nueva.delete(id);
    // Escritura atómica: si falla el almacenamiento, no cambiar la mesa.
    root.localStorage.setItem(CLAVE_OFICIALES,JSON.stringify(Array.from(nueva)));
    oficialesSeleccionados=nueva;
    dibujarBiblioteca();
    $('criaturas-selector-estado').textContent=oficialesSeleccionados.size+
      ' perfiles oficiales añadidos a tu mesa';
  }
  // Manifiesto editorial de fuentes: solo ficheros JSON locales enumerados.
  // Cada fuente incorpora su procedencia y tiene identificadores estables.
  function registrosOficiales() {
    var salida=[];
    (fuentesOficiales||[]).forEach(function(fuente){
      fuente.registros.forEach(function(registro){
        salida.push({id:fuente.info.id+'-'+registro.id,nombre:registro.nombre,
          ficha:registro.ficha,fuente:fuente.info});
      });
    });
    return salida;
  }
  function registroOficial(id) {
    return registrosOficiales().find(function(r){return r.id===id;})||null;
  }
  function esFichaOficial(id) {
    return !!registroOficial(String(id||''));
  }
  function obtenerFichaConsulta(id){
    var oficial=registroOficial(String(id));
    return oficial?modelo.nuevaCriatura(oficial.ficha):
      biblioteca?biblioteca.obtener(id):null;
  }
  async function asegurarCatalogoDRS(){
    if(catalogoDRS && fuentesOficiales)return catalogoDRS;
    if(cargaFuentes)return cargaFuentes;
    cargaFuentes=(async function(){
      var respuesta=await root.fetch('data/adversarios-fuentes.json',{cache:'no-store'});
      if(!respuesta.ok)throw Error('No se pudo consultar el índice de fuentes oficiales.');
      var manifiesto=await respuesta.json();
      if(!manifiesto||manifiesto.version!==1||manifiesto.sistema!=='nd20'||
         !Array.isArray(manifiesto.fuentes)||!manifiesto.fuentes.length)
        throw Error('El manifiesto de fuentes oficiales no es compatible.');
      var ids=new Set(), archivos=new Set();
      manifiesto.fuentes.forEach(function(f){
        if(!f||typeof f.id!=='string'||!/^[a-z0-9-]+$/.test(f.id)||
           typeof f.titulo!=='string'||!f.titulo.trim()||
           typeof f.origen!=='string'||!f.origen.trim()||
           typeof f.fuente!=='string'||!f.fuente.trim()||
           typeof f.archivo!=='string'||
           !/^adversarios-[a-z0-9-]+\.json$/.test(f.archivo)||
           !Number.isSafeInteger(f.total)||f.total<1||ids.has(f.id)||
           archivos.has(f.archivo))
          throw Error('Entrada incompatible o repetida en el índice de fuentes.');
        ids.add(f.id);archivos.add(f.archivo);
      });
      var fuentes=await Promise.all(manifiesto.fuentes.map(async function(info){
        var res=await root.fetch('data/'+info.archivo,{cache:'no-store'});
        if(!res.ok)throw Error('No se pudo consultar la fuente '+info.titulo+'.');
        var datos=await res.json();
        if(!datos||datos.sistema!=='nd20'||datos.fuente!==info.fuente||
           !Array.isArray(datos.registros)||datos.registros.length!==info.total)
          throw Error('La fuente '+info.titulo+' no coincide con su manifiesto.');
        if(info.id==='drs')datos.registros=datos.registros.map(modelo.normalizarFuenteDRS);
        var registroIds=new Set();
        datos.registros.forEach(function(r){
          if(!r||typeof r.id!=='string'||!/^[a-z0-9_-]+$/.test(r.id)||
             registroIds.has(r.id)||r.fuente!==info.fuente||
             !r.ficha||!modelo.revisar(r.ficha,{paraExportar:true}).valida)
            throw Error('Ficha o ID incompatible en la fuente '+info.titulo+'.');
          registroIds.add(r.id);
        });
        return {info:info,registros:datos.registros,datos:datos};
      }));
      var drs=fuentes.find(function(f){return f.info.id==='drs';});
      if(!drs||drs.registros.length!==106||
         drs.info.fuente!=='Naufragio d20 DRS')
        throw Error('Los 106 adversarios originales del DRS deben permanecer disponibles.');
      fuentesOficiales=fuentes;
      catalogoDRS=drs.datos;
      if($('criaturas-buscar-ataque').value)sugerirEntradas('ataques');
      if($('criaturas-buscar-talento').value)sugerirEntradas('talentos');
      var subcategorias=Array.from(new Set(registrosOficiales().map(function(r){
        return r.ficha.subcategoria;
      }).filter(Boolean))).sort(function(a,b){return a.localeCompare(b,'es');});
      var sugerencias=$('criaturas-subcategorias');
      sugerencias.textContent='';
      subcategorias.forEach(function(nombre){
        var op=ele('option');op.value=nombre;sugerencias.appendChild(op);
      });
      return catalogoDRS;
    })().catch(function(error){cargaFuentes=null;throw error;});
    return cargaFuentes;
  }
  function opcionesFiltro(id,valores,todas){
    var control=$(id),anterior=control.value;
    control.textContent='';
    var primera=ele('option','',todas||'Todas');primera.value='';
    control.appendChild(primera);
    Array.from(new Set(valores.filter(Boolean)))
      .sort(function(a,b){return a.localeCompare(b,'es');})
      .forEach(function(valor){
        var opcion=ele('option','',valor);opcion.value=valor;
        control.appendChild(opcion);
      });
    control.value=Array.from(control.options).some(function(o){
      return o.value===anterior;
    })?anterior:'';
  }
  function prepararFiltrosOficiales(){
    var todos=registrosOficiales();
    opcionesFiltro('criaturas-selector-categoria',
      todos.map(function(r){return r.ficha.categoria;}),'Todas');
    opcionesFiltro('criaturas-selector-fuente',
      todos.map(function(r){return r.fuente.titulo;}),'Todas');
    opcionesFiltro('criaturas-selector-origen',
      todos.map(function(r){return r.fuente.origen;}),'Todos');
  }
  function actualizarSelectorDRS(){
    if(!fuentesOficiales)return;
    var busqueda=$('criaturas-selector-busqueda').value.trim().toLocaleLowerCase('es');
    var categoria=$('criaturas-selector-categoria').value;
    var fuente=$('criaturas-selector-fuente').value;
    var origen=$('criaturas-selector-origen').value;
    var minTexto=$('criaturas-selector-nivel-min').value.trim();
    var maxTexto=$('criaturas-selector-nivel-max').value.trim();
    var nivelMin=minTexto===''?null:Number(minTexto);
    var nivelMax=maxTexto===''?null:Number(maxTexto);
    var base=registrosOficiales().filter(function(r){
      return (!categoria||r.ficha.categoria===categoria)&&
        (!fuente||r.fuente.titulo===fuente)&&
        (!origen||r.fuente.origen===origen);
    });
    opcionesFiltro('criaturas-selector-subcategoria',
      base.map(function(r){return r.ficha.subcategoria;}),'Todas');
    var subcategoria=$('criaturas-selector-subcategoria').value;
    var registros=base.filter(function(r){
      var nivel=r.ficha.puntuaciones.nivel;
      return (!subcategoria||r.ficha.subcategoria===subcategoria)&&
        (nivelMin===null||(nivel!==null&&nivel>=nivelMin))&&
        (nivelMax===null||(nivel!==null&&nivel<=nivelMax))&&
        (!busqueda||[r.nombre,r.ficha.categoria,r.ficha.subcategoria,
          r.ficha.subtipo,r.fuente.titulo,r.fuente.origen]
          .filter(Boolean).join(' ').toLocaleLowerCase('es').includes(busqueda));
    });
    var lista=$('criaturas-selector-lista');
    lista.textContent='';
    $('criaturas-selector-estado').textContent=registros.length+
      ' resultados de '+registrosOficiales().length+
      ' perfiles · '+oficialesSeleccionados.size+' añadidos a tu mesa';
    if(!registros.length){
      lista.appendChild(ele('p','muted','No hay perfiles que cumplan estos filtros.'));
      return;
    }
    registros.forEach(function(registro){
      var id=registro.id;
      var seleccionado=oficialesSeleccionados.has(id);
      var fila=ele('div','criaturas-selector-fila');
      var titulo=ele('div','criaturas-selector-identidad');
      titulo.appendChild(ele('strong','',registro.nombre));
      titulo.appendChild(ele('small','muted',
        (registro.ficha.categoria||'Sin categoría')+
        (registro.ficha.subcategoria?' / '+registro.ficha.subcategoria:'')+
        ' · Nivel '+(registro.ficha.puntuaciones.nivel==null?
          'no indicado':registro.ficha.puntuaciones.nivel)+
        ' · '+registro.fuente.titulo));
      var boton=ele('button','',seleccionado?'Quitar':'Añadir');
      boton.type='button';
      boton.dataset.id=id;
      boton.dataset.seleccionado=String(seleccionado);
      boton.setAttribute('aria-label',(seleccionado?'Quitar ':'Añadir ')+registro.nombre);
      boton.addEventListener('click',function(){
        try{
          var anadir=boton.dataset.seleccionado!=='true';
          actualizarSeleccionOficial(id,anadir);
          boton.dataset.seleccionado=String(anadir);
          boton.textContent=anadir?'Quitar':'Añadir';
          boton.setAttribute('aria-label',(anadir?'Quitar ':'Añadir ')+registro.nombre);
          mostrarEstado((anadir?'Añadido a':'Retirado de')+
            ' tu mesa. El catálogo original no se modifica.');
        }catch(error){
          mostrarEstado('No se pudo guardar la selección: '+error.message,true);
        }
      });
      fila.append(titulo,boton);
      lista.appendChild(fila);
    });
  }
  async function cargarAdversariosDRS(){
    try {
      await asegurarCatalogoDRS();
      prepararFiltrosOficiales();
      actualizarSelectorDRS();
      $('criaturas-selector-drs').showModal();
    }catch(error){mostrarEstado('No se pudo abrir el catálogo: '+error.message,true);}
  }
  function catalogoEntradas(tipo) {
    var salida=[];
    registrosOficiales().forEach(function(r){
      (r.ficha[tipo]||[]).forEach(function(v){
        salida.push({dato:v,fuente:r.nombre+' · '+r.fuente.titulo});
      });
    });
    if(biblioteca&&biblioteca.catalogoPersonal){
      biblioteca.catalogoPersonal()[tipo].forEach(function(v){
        salida.push({dato:v,fuente:'Creación propia'});
      });
    }
    return salida;
  }
  function sugerirEntradas(tipo) {
    var nombre=tipo==='ataques'?'ataque':'talento';
    var term=$('criaturas-buscar-'+nombre).value.trim().toLocaleLowerCase('es');
    var salida=$('criaturas-coincidencias-'+tipo);
    salida.textContent='';
    if(term.length<2)return;
    var resultados=catalogoEntradas(tipo).filter(function(e){
      return e.dato.nombre.toLocaleLowerCase('es').includes(term);
    }).slice(0,16);
    if(!resultados.length){
      salida.appendChild(ele('p','muted','No hay coincidencias documentadas. Puedes crear una entrada propia.'));
      return;
    }
    resultados.forEach(function(entrada) {
      var boton=ele('button','criaturas-coincidencia');
      boton.type='button';
      var dato=entrada.dato;
      boton.appendChild(ele('strong','',dato.nombre+
        (tipo==='ataques'&&dato.danoLiteral?' · '+dato.danoLiteral+' daño':'')));
      if(tipo==='talentos'&&dato.descripcion)
        boton.appendChild(ele('span','',dato.descripcion));
      boton.appendChild(ele('small','muted',entrada.fuente));
      boton.addEventListener('click',function(){
        if(tipo==='ataques'){
          var a=modelo.ataque(dato);
          a.id='';
          a.conectorAnterior=$('criaturas-ataques').children.length?'y':'Inicio';
          agregarAtaque(a);
        }else agregarTalento(modelo.talento(dato));
        cambios=true;
        avisarRevision();
        $('criaturas-buscar-'+nombre).value='';
        salida.textContent='';
      });
      salida.appendChild(boton);
    });
  }
  function abrirElementoPropio(tipo) {
    tipoPropio=tipo;
    $('criaturas-elemento-titulo').textContent=tipo==='ataques'?'Crear ataque propio':
      'Crear Talento o habilidad especial';
    $('criaturas-elemento-campos-ataque').hidden=tipo!=='ataques';
    $('criaturas-elemento-form').reset();
    $('criaturas-elemento-error').textContent='';
    $('criaturas-elemento-propio').showModal();
    $('criaturas-elemento-nombre').focus();
  }
  function guardarElementoPropio(event) {
    event.preventDefault();
    try{
      if(!biblioteca)throw Error('No está disponible el almacenamiento local.');
      var nombre=$('criaturas-elemento-nombre').value.trim();
      if(!nombre)throw Error('La entrada necesita un nombre.');
      var descripcion=$('criaturas-elemento-descripcion').value.trim();
      var plantilla;
      if(tipoPropio==='ataques'){
        plantilla=biblioteca.guardarPlantilla('ataques',{
          nombre:nombre,conectorAnterior:'Inicio',
          cantidad:aEntero($('criaturas-elemento-cantidad').value,'Cantidad'),
          danoLiteral:$('criaturas-elemento-dano').value.trim(),
          notas:descripcion
        });
        plantilla.conectorAnterior=$('criaturas-ataques').children.length?'y':'Inicio';
        agregarAtaque(plantilla);
      }else if(tipoPropio==='talentos'){
        plantilla=biblioteca.guardarPlantilla('talentos',{
          nombre:nombre,descripcion:descripcion,referencia:'Creación propia'
        });
        agregarTalento(plantilla);
      }else throw Error('Tipo de entrada desconocido.');
      $('criaturas-elemento-propio').close();
      cambios=true;avisarRevision();
      mostrarEstado('Entrada propia incorporada al borrador y disponible para reutilizarse.');
    }catch(error){$('criaturas-elemento-error').textContent=error.message;}
  }
  function filtrarCategorias(){
    var select=$('criaturas-categoria');
    var actual=select.value;
    var filtro=$('criaturas-filtrar-categoria').value.trim()
      .toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(!select.dataset.originalOptions){
      select.dataset.originalOptions=JSON.stringify(Array.from(select.options).map(
        function(o){return [o.value,o.textContent];}));
    }
    var opciones=JSON.parse(select.dataset.originalOptions);
    // Los valores heredados de JSON antiguos no desaparecen del desplegable.
    Array.from(select.options).filter(function(o){return o.dataset.heredada;})
      .forEach(function(o){
        if(!opciones.some(function(x){return x[0]===o.value;}))
          opciones.push([o.value,o.textContent]);
      });
    select.textContent='';
    opciones.filter(function(par){return !filtro||!par[0]||
      par[1].toLocaleLowerCase('es').normalize('NFD')
        .replace(/[\u0300-\u036f]/g,'').includes(filtro)||par[0]===actual;
    }).forEach(function(par){
      var o=ele('option','',par[1]);o.value=par[0];select.appendChild(o);
    });
    select.value=actual;
  }
  function slugIcono(nombre) {
    return String(nombre||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLocaleLowerCase('es').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  function rutaIcono(registro) {
    var nombre='nombre-'+slugIcono(registro.nombre);
    var archivo=iconosGaleria[registro.id]||iconosGaleria[nombre];
    if(typeof archivo!=='string'||!/^[a-z0-9][a-z0-9_-]*\.svg$/.test(archivo))
      return null;
    return 'assets/adversarios/iconos/'+archivo;
  }
  function cargarIconosGaleria() {
    return root.fetch('assets/adversarios-iconos.json',{cache:'no-store'})
      .then(function(respuesta){
        if(!respuesta.ok)throw Error('No hay manifiesto SVG.');
        return respuesta.json();
      }).then(function(datos){
        if(!datos||datos.version!==1||!datos.iconos||
            Array.isArray(datos.iconos)||typeof datos.iconos!=='object')
          throw Error('Manifiesto SVG incompatible.');
        iconosGaleria=datos.iconos;
        dibujarBiblioteca();
      }).catch(function(){
        // Un icono opcional jamás impide utilizar el bestiario.
        iconosGaleria={};
      });
  }
  function dibujarBiblioteca() {
    var lista=$('criaturas-lista');
    lista.textContent='';
    if(!biblioteca) {
      lista.appendChild(ele('p','muted vacio-adversarios',
        'La biblioteca local no está disponible. Puedes crear y exportar un JSON sin guardarlo.'));
      return;
    }
    try {
      var propios=biblioteca.listar();
      var oficiales=registrosOficiales().filter(function(r){
          return oficialesSeleccionados.has(r.id);
        }).map(function(r){
          return {id:r.id,nombre:r.nombre,categoria:r.ficha.categoria,
            nivel:r.ficha.puntuaciones.nivel,oficial:true,fuente:r.fuente.titulo};
        });
      var registros=propios.concat(oficiales);
      $('criaturas-contador-menu').textContent=String(registros.length);
      $('criaturas-cantidad').textContent=propios.length+' propios · '+
        oficiales.length+' perfiles oficiales';
      $('criaturas-exportar-biblioteca').disabled=propios.length===0;
      $('criaturas-exportar-pdf-coleccion').disabled=registros.length===0;
      if(!registros.length) {
        lista.appendChild(ele('p','muted vacio-adversarios',
          'Tu mesa está vacía. Crea un adversario o elige uno desde «Perfiles oficiales».'));
        return;
      }
      registros.forEach(function(registro) {
        var item=ele('button','criaturas-cromo criaturas-lista-item');
        item.type='button';
        item.dataset.accion='ver';
        item.dataset.id=registro.id;
        item.dataset.categoria=(registro.categoria||'').toLocaleLowerCase('es')
          .normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-');
        item.setAttribute('aria-label','Consultar '+registro.nombre+
          ', '+(registro.nivel==null?'Nivel sin indicar':'Nivel '+registro.nivel)+
          (registro.oficial?', Naufragio d20 - Épica':''));
        if(registro.oficial)item.dataset.oficial='true';
        var emblema=ele('span','criaturas-emblema');
        emblema.setAttribute('aria-hidden','true');
        var ruta=rutaIcono(registro);
        var imagenPersonal=registro.imagen||'';
        item.dataset.icono=imagenPersonal?'imagen':ruta?'svg':'placeholder';
        if(imagenPersonal||ruta){
          var imagen=ele('img','criaturas-icono-svg');
          imagen.alt='';
          imagen.loading='lazy';
          imagen.decoding='async';
          imagen.src=imagenPersonal||ruta;
          imagen.addEventListener('error',function(){
            imagen.remove();
            item.dataset.icono='placeholder';
          });
          emblema.appendChild(imagen);
        }
        item.appendChild(emblema);
        item.appendChild(ele('span','criaturas-nombre',registro.nombre));
        item.appendChild(ele('span','criaturas-nivel',
          (registro.oficial?'Épica · ':'')+
          (registro.nivel==null?'Nivel —':'Nivel '+registro.nivel)));
        lista.appendChild(item);
      });
    } catch(error) {
      lista.appendChild(ele('p','error','No se pudo leer la biblioteca: '+error.message));
    }
  }
  function mostrarFichaCompleta(id) {
    var dato=obtenerFichaConsulta(id);
    if(!dato){mostrarEstado('Este adversario ya no existe.',true);return;}
    idConsulta=id;
    var cont=$('criaturas-ficha-contenido');
    cont.textContent='';
    var articulo=ele('article','criaturas-ficha-completa');
    if(dato.imagen){
      var portada=ele('img','criaturas-ficha-imagen');
      portada.src=dato.imagen;
      portada.alt='Ilustración de '+dato.nombre;
      articulo.appendChild(portada);
    }
    var metricas=ele('div','criaturas-metricas');
    [['Nivel','recurso-potencia',dato.puntuaciones.nivel],
      ['Salud','recurso-salud',dato.puntuaciones.salud],
      ['Moral','recurso-esfuerzo',dato.puntuaciones.moral],
      ['Movimiento','recurso-movimiento',dato.puntuaciones.movimiento],
      ['Tamaño',null,dato.puntuaciones.tamano]]
      .forEach(function(par) {
        if(par[2]==null)return;
        var caja=ele('div','criaturas-metrica');
        if(par[1]){
          var simbolo=ele('span','icono-svg criaturas-metrica-icono');
          simbolo.setAttribute('aria-hidden','true');
          simbolo.style.setProperty('--icono-svg','url(icons/'+par[1]+'.svg)');
          caja.appendChild(simbolo);
        }
        var detalle=ele('span','criaturas-metrica-detalle');
        detalle.appendChild(ele('small','',par[0]));
        detalle.appendChild(ele('strong','',par[2]));
        caja.appendChild(detalle);
        metricas.appendChild(caja);
      });
    articulo.appendChild(metricas);
    articulo.appendChild(ele('p','criaturas-taxonomia',
      root.NaufragioFormatoAdversarios.taxonomia(dato)||'Sin categoría documentada'));
    function encabezadoApartado(nombre,icono){
      var h=ele('h4','criaturas-titulo-apartado');
      var simbolo=ele('span','criaturas-icono-apartado '+icono);
      simbolo.setAttribute('aria-hidden','true');
      h.appendChild(simbolo);
      h.appendChild(d.createTextNode(nombre));
      articulo.appendChild(h);
    }
    if(dato.ataques.length){
      encabezadoApartado('Ataques','criaturas-icono-ataque');
      var lista=ele('ol','criaturas-ataques-consulta');
      root.NaufragioFormatoAdversarios.lineasAtaque(dato.ataques)
        .forEach(function(linea){
          var item=ele('li','',linea.texto);
          linea.notas.forEach(function(nota){
            item.appendChild(ele('p','muted',nota.nombre+': '+nota.texto));
          });
          lista.appendChild(item);
        });
      articulo.appendChild(lista);
    }
    if(dato.talentos.length){
      encabezadoApartado('Talentos y habilidades especiales','criaturas-icono-talento');
      dato.talentos.forEach(function(t){
        var bloque=ele('section','criaturas-habilidad');
        bloque.appendChild(ele('strong','',t.nombre));
        if(t.descripcion)bloque.appendChild(ele('p','',t.descripcion));
        articulo.appendChild(bloque);
      });
    }
    if(dato.descripcion){
      articulo.appendChild(ele('h4','','Descripción'));
      articulo.appendChild(ele('p','',dato.descripcion));
    }
    if(dato.notas){
      articulo.appendChild(ele('h4','','Notas'));
      articulo.appendChild(ele('p','',dato.notas));
    }
    if(dato.camposNoInterpretados.length){
      articulo.appendChild(ele('h4','','Fragmentos conservados'));
      articulo.appendChild(ele('p','',dato.camposNoInterpretados.join('\n')));
    }
    var procedencia=registroOficial(String(id));
    if(procedencia){
      articulo.appendChild(ele('p','criaturas-fuente',
        'Fuente: '+procedencia.fuente.titulo+' · '+procedencia.fuente.origen));
    }else if(dato.origen && ['drs_oficial','drs_copia_personal'].includes(dato.origen.tipo)){
      articulo.appendChild(ele('p','criaturas-fuente',
        'Fuente: Naufragio d20 - Épica · DRS (copia personal)'));
    }
    cont.appendChild(articulo);
    $('criaturas-ficha-titulo').textContent=dato.nombre;
    $('criaturas-ficha-editar').textContent=esFichaOficial(id)?
      'Crear copia editable':'Editar';
    $('criaturas-ficha-eliminar').hidden=esFichaOficial(id);
    $('criaturas-ficha-retirar').hidden=!esFichaOficial(id);
    $('criaturas-ficha-dialogo').showModal();
  }
  function irA(id) {
    if(id==='criaturas-edicion'){abrirEditor();return;}
    var elemento=$(id);
    if(id==='criaturas-importacion')elemento.hidden=false;
    elemento.scrollIntoView({block:'start',behavior:'auto'});
    var titulo=elemento.querySelector('h3');
    if(titulo){titulo.tabIndex=-1;titulo.focus({preventScroll:true});}
  }
  function guardar(event) {
    if(event) event.preventDefault();
    if(imagenProcesando){
      mostrarEstado('La ilustración aún se está preparando.',true);return;
    }
    try {
      if(!$('criaturas-formulario').checkValidity()){
        $('criaturas-formulario').reportValidity();
        mostrarEstado('Revisa los campos incompletos o incorrectos.',true);
        return;
      }
      var datos=datosFormulario();
      var revision=modelo.revisar(datos,{paraExportar:true});
      avisosEn('criaturas-advertencias-formulario',revision.errores,revision.advertencias);
      if(!revision.valida) {
        mostrarEstado('La ficha tiene errores que impiden guardarla.',true);
        return;
      }
      if(!biblioteca) throw Error('No hay almacenamiento local disponible. Exporta esta ficha JSON para conservarla.');
      var id=biblioteca.guardar(datos,idActual);
      renderizarFicha(datos,id);
      dibujarBiblioteca();
      $('criaturas-edicion').close();
      mostrarEstado('Adversario guardado en este navegador'+
        (revision.advertencias.length?' con '+revision.advertencias.length+' avisos para revisar.':'.'));
      mostrarFichaCompleta(id);
    } catch(error) { mostrarEstado('No se pudo guardar: '+error.message,true); }
  }
  function descargar(nombre,texto) {
    var enlace=d.createElement('a');
    var blob=new root.Blob([texto],{type:'application/json;charset=utf-8'});
    var url=root.URL.createObjectURL(blob);
    enlace.href=url;enlace.download=nombre;enlace.hidden=true;
    d.body.appendChild(enlace);enlace.click();enlace.remove();
    root.setTimeout(function(){root.URL.revokeObjectURL(url);},1500);
  }
  function exportarFicha() {
    if(imagenProcesando){
      mostrarEstado('La ilustración aún se está preparando.',true);return;
    }
    try {
      var datos=datosFormulario();
      var revision=modelo.revisar(datos,{paraExportar:true});
      avisosEn('criaturas-advertencias-formulario',revision.errores,revision.advertencias);
      if(!revision.valida) throw Error('Corrige los errores de la ficha antes de exportarla.');
      var nombre=datos.nombre.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/g,'-').slice(0,70) || 'criatura';
      descargar('criatura-'+nombre+'.json',JSON.stringify(datos,null,2));
      mostrarEstado('Ficha JSON exportada. La descarga no guarda los cambios en la biblioteca.');
    } catch(error) {mostrarEstado('No se pudo exportar: '+error.message,true);}
  }
  function exportarBiblioteca() {
    try {
      if(!biblioteca)throw Error('No hay almacenamiento local disponible.');
      descargar('forja-biblioteca-criaturas.json',biblioteca.exportarJson());
      mostrarEstado('Biblioteca exportada como JSON.');
    } catch(error){mostrarEstado('No se pudo exportar: '+error.message,true);}
  }
  async function exportarPdfIndividual(){
    try{
      var ficha=obtenerFichaConsulta(idConsulta);
      if(!ficha)throw Error('No se encuentra la ficha solicitada.');
      var paginas=await root.NaufragioPdfAdversarios.descargar([ficha],
        'adversario-'+root.NaufragioPdfAdversarios.slug(ficha.nombre)+'.pdf');
      mostrarEstado('PDF individual preparado ('+paginas+' páginas).');
    }catch(error){mostrarEstado('No se pudo exportar el PDF: '+error.message,true);}
  }
  async function exportarPdfColeccion(){
    try{
      var fichas=biblioteca?biblioteca.listar().map(function(x){
        return biblioteca.obtener(x.id);
      }):[];
      fichas=fichas.concat(registrosOficiales().filter(function(r){
        return oficialesSeleccionados.has(r.id);
      }).map(function(r){
        return modelo.nuevaCriatura(r.ficha);
      }));
      if(!fichas.length)throw Error('La mesa de adversarios está vacía.');
      var paginas=await root.NaufragioPdfAdversarios.descargar(fichas,
        'naufragio-d20-coleccion-adversarios.pdf');
      mostrarEstado('Colección PDF preparada: '+fichas.length+
        ' adversarios en '+paginas+' páginas.');
    }catch(error){mostrarEstado('No se pudo exportar la colección PDF: '+error.message,true);}
  }
  function vistaPrevia() {
    try {
      var analisis=importador.descomponerTexto($('criaturas-texto').value);
      pendiente=analisis;
      var c=analisis.criatura;
      var campos=modelo.PUNTUACIONES.filter(function(p){return c.puntuaciones[p]!==null;})
        .map(function(p){return p+': '+c.puntuaciones[p];});
      var ataques=c.ataques.map(function(a,i) {
        return (i>0?a.conectorAnterior+' ':'')+(a.cantidad>1?a.cantidad+' ':'')+a.nombre+
          (a.danoLiteral?' ('+a.danoLiteral+')':'');
      });
      var talentos=c.talentos.map(function(t){return t.nombre+': '+t.descripcion;});
      $('criaturas-resumen-previa').textContent=[
        'Nombre: '+(c.nombre||'Sin reconocer'),
        'Categoría: '+(c.categoria||'Sin reconocer'),
        'Puntuaciones: '+(campos.join(' · ')||'Sin reconocer'),
        'Ataques ('+ataques.length+'): '+(ataques.join(' | ')||'Sin reconocer'),
        'Talentos ('+talentos.length+'): '+(talentos.join(' | ')||'Sin reconocer'),
        'Descripción: '+(c.descripcion||'No detectada'),
        'Fragmentos pendientes ('+c.camposNoInterpretados.length+'): '+
          (c.camposNoInterpretados.join(' | ')||'Ninguno')
      ].join('\n');
      avisosEn('criaturas-advertencias-previa',analisis.errores,analisis.advertencias);
      $('criaturas-vista-previa').hidden=false;
      mostrarEstado('Desglose preparado. Revísalo antes de pasarlo al formulario.');
      $('criaturas-vista-previa').scrollIntoView({block:'start',behavior:'auto'});
    }catch(error){
      pendiente=null;$('criaturas-vista-previa').hidden=true;
      mostrarEstado('No se pudo analizar: '+error.message,true);
    }
  }
  function aplicarPrevia() {
    if(!pendiente)return;
    if(pendiente.criatura.origen.textoOriginal!==$('criaturas-texto').value){
      pendiente=null;
      $('criaturas-vista-previa').hidden=true;
      mostrarEstado('El texto ha cambiado. Analízalo de nuevo antes de aplicarlo.',true);
      return;
    }
    if(!permitirDescartar())return;
    var resultado=pendiente;
    renderizarFicha(resultado.criatura,null);
    cambios=true;
    $('criaturas-vista-previa').hidden=true;
    pendiente=null;
    avisosEn('criaturas-advertencias-formulario',resultado.errores,resultado.advertencias);
    mostrarEstado('Ficha trasladada al editor. Revisa los campos y pulsa «Guardar criatura» cuando esté lista.');
    irA('criaturas-edicion');
  }
  function recuperar(id) {
    if(!biblioteca || !permitirDescartar()) return;
    try{
      var oficial=esFichaOficial(id);
      var datos=obtenerFichaConsulta(id);
      if(!datos)throw Error('La ficha ya no existe.');
      if(oficial){
        datos.origen.tipo='drs_copia_personal';
        id=biblioteca.guardar(datos);
        dibujarBiblioteca();
      }
      renderizarFicha(datos,id);
      irA('criaturas-edicion');
      mostrarEstado('Adversario recuperado de la biblioteca.');
    }catch(error){mostrarEstado('No se pudo abrir: '+error.message,true);}
  }
  function duplicar(id) {
    if(!biblioteca || !permitirDescartar())return;
    try {
      var datos=obtenerFichaConsulta(id);
      if(!datos)throw Error('La ficha ya no existe.');
      datos.nombre+=' (copia)';
      var nuevoId=biblioteca.guardar(datos);
      dibujarBiblioteca();
      renderizarFicha(datos,nuevoId);
      mostrarFichaCompleta(nuevoId);
      mostrarEstado('Copia creada y guardada de forma independiente.');
    }catch(error){mostrarEstado('No se pudo duplicar: '+error.message,true);}
  }
  function eliminar(id) {
    if(idActual===id && !permitirDescartar())return;
    if(!biblioteca || typeof root.confirm!=='function' ||
      !root.confirm('¿Eliminar esta criatura de tu biblioteca local? Esta acción no se puede deshacer.'))return;
    try {
      if(!biblioteca.eliminar(id))throw Error('La ficha ya no existe.');
      if(idActual===id)renderizarFicha(modelo.nuevaCriatura(),null);
      dibujarBiblioteca();
      mostrarEstado('Criatura eliminada de esta biblioteca.');
    }catch(error){mostrarEstado('No se pudo eliminar: '+error.message,true);}
  }
  function gestionarLista(event) {
    var boton=event.target.closest('button[data-accion]');
    if(!boton)return;
    var id=boton.dataset.id;
    if(boton.dataset.accion==='ver')mostrarFichaCompleta(id);
    if(boton.dataset.accion==='editar')recuperar(id);
    if(boton.dataset.accion==='duplicar')duplicar(id);
    if(boton.dataset.accion==='eliminar')eliminar(id);
    if(boton.dataset.accion==='exportar') {
      try {
        var fichaExportable=biblioteca.obtener(id);
        if(!fichaExportable)throw Error('La ficha ya no existe.');
        descargar('criatura-'+id+'.json',JSON.stringify(fichaExportable,null,2));
        mostrarEstado('Criatura exportada en JSON.');
      }catch(error){mostrarEstado('No se pudo exportar: '+error.message,true);}
    }
  }
  async function importarJson(event) {
    var archivo=event.target.files&&event.target.files[0];
    if(!archivo)return;
    try{
      if(!biblioteca)throw Error('No se dispone de almacenamiento local.');
      if(archivo.size>5000000)throw Error('El JSON supera el límite de 5 MB.');
      var contenido=await archivo.text();
      // Las copias idénticas son legítimas, pero nunca deben añadirse sin aviso.
      var importado;
      try { importado=JSON.parse(contenido); } catch(error) { importado=null; }
      var fichas=importado && importado.tipo===apiBiblioteca.TIPO ?
        importado.criaturas : importado && importado.tipo==='criatura_usuario' ?
        [{ficha:importado}] : [];
      var existentes=new Set(biblioteca.listar().map(function(r){
        return JSON.stringify(modelo.nuevaCriatura(biblioteca.obtener(r.id)));
      }));
      var importados=new Set(), duplicados=0;
      fichas.forEach(function(r){
        if(!r || !r.ficha ||
            !modelo.revisar(r.ficha,{paraExportar:true}).valida)return;
        var huella=JSON.stringify(modelo.nuevaCriatura(r.ficha));
        if(existentes.has(huella)||importados.has(huella))duplicados++;
        importados.add(huella);
      });
      if(duplicados && (typeof root.confirm!=='function' ||
          !root.confirm('El archivo contiene '+duplicados+' criaturas ya presentes. '+
            '¿Quieres importar otras copias?'))) {
        mostrarEstado('Importación cancelada: no se han modificado las criaturas.');
        return;
      }
      var ids=biblioteca.importarJson(contenido); // Añade: nunca reemplaza sin autorización.
      dibujarBiblioteca();
      mostrarEstado('Importación completada: '+ids.length+' adversarios añadidos.');
      if($('criaturas-buscar-ataque').value)sugerirEntradas('ataques');
      if($('criaturas-buscar-talento').value)sugerirEntradas('talentos');
    }catch(error){mostrarEstado('No se pudo importar el JSON: '+error.message,true);}
    finally{event.target.value='';}
  }
  function manejarEliminacion(event,contenedor,accion) {
    var boton=event.target.closest('button[data-accion="'+accion+'"]');
    if(!boton)return;
    boton.closest('.criaturas-repetido').remove();
    if(accion==='quitar-ataque')reajustarAtaques();
    else Array.from($(contenedor).children).forEach(function(fila,i){
      fila.querySelector('.criaturas-fila-titulo').textContent='Talento '+(i+1);
    });
    cambios=true;avisarRevision();
  }
  function descartarCambios() {
    if(!permitirDescartar())return;
    if(idActual && biblioteca) {
      try {
        var guardado=biblioteca.obtener(idActual);
        if(guardado){renderizarFicha(guardado,idActual);mostrarEstado('Cambios descartados.');return;}
      }catch(error){mostrarEstado('No se pudo recuperar la ficha: '+error.message,true);return;}
    }
    renderizarFicha(modelo.nuevaCriatura(),null);
    mostrarEstado('Borrador descartado.');
  }
  function iniciar() {
    if(iniciado) return;
    d=root.document;
    if(!d || !$('editor-criaturas'))return;
    iniciado=true;
    try {
      biblioteca=apiBiblioteca.crearBiblioteca(root.localStorage);
      biblioteca.listar(); // Detectar aquí una base dañada sin modificarla.
    }catch(error) {
      biblioteca=null;
      mostrarEstado('La biblioteca no está disponible: '+error.message+
        ' Puedes editar y exportar fichas individuales.',true);
    }
    $('criaturas-nueva').addEventListener('click',nueva);
    $('criaturas-imagen-archivo').addEventListener('change',subirIlustracion);
    $('criaturas-imagen-quitar').addEventListener('click',function(){
      tokenImagen++;
      imagenProcesando=false;
      $('criaturas-guardar').disabled=false;
      if(!ficha||!ficha.imagen)return;
      ficha.imagen='';
      mostrarImagenEditor();
      cambios=true;
      avisarRevision();
      mostrarEstado('Ilustración retirada del borrador. Guarda para confirmar.');
    });
    $('criaturas-filtrar-categoria').addEventListener('input',filtrarCategorias);
    $('criaturas-nueva-panel').addEventListener('click',nueva);
    $('criaturas-ir-importar').addEventListener('click',function(){irA('criaturas-importacion');$('criaturas-texto').focus();});
    $('criaturas-cerrar-importacion').addEventListener('click',function(){
      $('criaturas-importacion').hidden=true;
    });
    $('criaturas-cerrar-editor').addEventListener('click',cerrarEditor);
    $('criaturas-edicion').addEventListener('cancel',function(event){
      event.preventDefault();cerrarEditor();
    });
    $('criaturas-cerrar-ficha').addEventListener('click',function(){
      $('criaturas-ficha-dialogo').close();
    });
    $('criaturas-ficha-editar').addEventListener('click',function(){
      $('criaturas-ficha-dialogo').close();recuperar(idConsulta);
    });
    $('criaturas-ficha-duplicar').addEventListener('click',function(){
      $('criaturas-ficha-dialogo').close();duplicar(idConsulta);
    });
    $('criaturas-ficha-eliminar').addEventListener('click',function(){
      var id=idConsulta;
      eliminar(id);
      if(!biblioteca.obtener(id))$('criaturas-ficha-dialogo').close();
    });
    $('criaturas-ficha-json').addEventListener('click',function(){
      try{
        var dato=obtenerFichaConsulta(idConsulta);
        descargar('adversario-'+idConsulta+'.json',JSON.stringify(dato,null,2));
        mostrarEstado('Ficha exportada como JSON.');
      }catch(error){mostrarEstado(error.message,true);}
    });

    ['ataques','talentos'].forEach(function(tipo){
      var nombre=tipo==='ataques'?'ataque':'talento';
      $('criaturas-buscar-'+nombre).addEventListener('input',function(){
        sugerirEntradas(tipo);
      });
      $('criaturas-crear-'+nombre).addEventListener('click',function(){
        abrirElementoPropio(tipo);
      });
    });
    $('criaturas-elemento-form').addEventListener('submit',guardarElementoPropio);
    $('criaturas-elemento-cerrar').addEventListener('click',function(){
      $('criaturas-elemento-propio').close();
    });
    $('criaturas-cargar-drs').addEventListener('click',cargarAdversariosDRS);
    $('criaturas-selector-cerrar').addEventListener('click',function(){
      $('criaturas-selector-drs').close();
    });
    // El campo de búsqueda se actualiza solo con 'input'. Escuchar también
    // 'change' reconstruye los botones al perder el foco (mousedown/blur)
    // y destruye el botón antes del click en Firefox/WebKit.
    $('criaturas-selector-busqueda').addEventListener('input',actualizarSelectorDRS);
    ['categoria','subcategoria','fuente','origen'].forEach(function(campo){
      $('criaturas-selector-'+campo).addEventListener('change',actualizarSelectorDRS);
    });
    ['nivel-min','nivel-max'].forEach(function(campo){
      $('criaturas-selector-'+campo).addEventListener('input',actualizarSelectorDRS);
    });
    $('criaturas-selector-limpiar').addEventListener('click',function(){
      ['busqueda','categoria','subcategoria','nivel-min','nivel-max','fuente','origen']
        .forEach(function(campo){$('criaturas-selector-'+campo).value='';});
      actualizarSelectorDRS();
    });

    $('criaturas-ficha-retirar').addEventListener('click',function(){
      try{
        actualizarSeleccionOficial(idConsulta,false);
        $('criaturas-ficha-dialogo').close();
        mostrarEstado('Perfil retirado de tu mesa. Puedes volver a añadirlo.');
      }catch(error){mostrarEstado(error.message,true);}
    });
    // Cargar solo referencias en memoria: la mesa sigue vacía hasta que se solicite el DRS.
    asegurarCatalogoDRS().catch(function(){
      // La biblioteca local sigue siendo utilizable sin el catálogo de referencia.
    });
    $('criaturas-analizar').addEventListener('click',vistaPrevia);
    $('criaturas-texto').addEventListener('input',function(){
      if(!pendiente)return;
      pendiente=null;
      $('criaturas-vista-previa').hidden=true;
      mostrarEstado('El texto pegado ha cambiado. Analízalo de nuevo.');
    });
    $('criaturas-aplicar-previa').addEventListener('click',aplicarPrevia);
    $('criaturas-descartar-previa').addEventListener('click',function(){
      pendiente=null;$('criaturas-vista-previa').hidden=true;
      mostrarEstado('Vista previa descartada. No se ha guardado nada.');
    });
    $('criaturas-anadir-ataque').addEventListener('click',function(){
      agregarAtaque({conectorAnterior:$('criaturas-ataques').children.length?'y':'Inicio'});
      cambios=true;avisarRevision();
    });
    $('criaturas-anadir-talento').addEventListener('click',function(){
      agregarTalento();
      cambios=true;avisarRevision();
    });
    $('criaturas-ataques').addEventListener('click',function(e){
      manejarEliminacion(e,'criaturas-ataques','quitar-ataque');
    });
    $('criaturas-talentos').addEventListener('click',function(e){
      manejarEliminacion(e,'criaturas-talentos','quitar-talento');
    });
    ['criaturas-nivel','criaturas-salud-ajuste','criaturas-salud-modo'].forEach(function(id){
      $(id).addEventListener('input',actualizarSalud);
      $(id).addEventListener('change',actualizarSalud);
    });
    $('criaturas-salud').addEventListener('input',function(){
      if($('criaturas-salud-modo').value==='automatico')
        $('criaturas-salud-modo').value='manual';
    });
    $('criaturas-formulario').addEventListener('input',function(event){
      if(event.target.matches('[data-campo="danoLiteral"]')) {
        var num=event.target.closest('.criaturas-repetido')
          .querySelector('[data-campo="danoNumerico"]');
        var valor=event.target.value.trim();
        num.value=/^\d+$/.test(valor)?valor:'';
      }
      cambios=true;
      avisarRevision();
    });
    $('criaturas-formulario').addEventListener('change',function(){cambios=true;avisarRevision();});
    $('criaturas-formulario').addEventListener('submit',guardar);
    $('criaturas-exportar-ficha').addEventListener('click',exportarFicha);
    $('criaturas-exportar-biblioteca').addEventListener('click',exportarBiblioteca);
    $('criaturas-exportar-pdf-coleccion').addEventListener('click',exportarPdfColeccion);
    $('criaturas-ficha-pdf').addEventListener('click',exportarPdfIndividual);
    $('criaturas-archivo-json').addEventListener('change',importarJson);
    $('criaturas-lista').addEventListener('click',gestionarLista);
    $('criaturas-descartar-cambios').addEventListener('click',descartarCambios);
    root.addEventListener('beforeunload',function(event) {
      if(!cambios) return;
      event.preventDefault();
      event.returnValue='';
    });
    cargarSeleccionOficial();
    renderizarFicha(modelo.nuevaCriatura(),null);
    dibujarBiblioteca();
    cargarIconosGaleria();
    // No llenar la galería automáticamente: solo leer el catálogo para búsquedas
    // y recuperar los adversarios previamente seleccionados.
    asegurarCatalogoDRS().then(dibujarBiblioteca).catch(function(){});
  }
  return {iniciar:iniciar,aEntero:aEntero};
});
