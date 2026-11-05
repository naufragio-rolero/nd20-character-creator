/* Biblioteca local de criaturas del usuario para La Forja.
 * El almacenamiento se inyecta: no hay servidor, sincronización ni bestiario. */
(function (root, factory) {
  var api = factory(typeof module !== 'undefined' && module.exports ?
    require('./creatures.js') : root.NaufragioCriaturas);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioBibliotecaCriaturas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (modelo) {
  'use strict';
  if (!modelo) throw Error('Falta el contrato de criaturas.');
  var CLAVE = 'forja-criaturas-usuario-v1';
  var TIPO = 'biblioteca_criaturas_nd20';
  function copia(objeto) { return JSON.parse(JSON.stringify(objeto)); }
  function inicial() { return {version:1, tipo:TIPO, siguienteId:1,
    criaturas:[], catalogoPersonalizado:{ataques:[],talentos:[]}}; }
  function validarFicha(ficha) {
    var resultado = modelo.revisar(ficha, {paraExportar:true});
    if (!resultado.valida)
      throw Error('La criatura no es válida: ' +
        resultado.errores.map(function (e) {return e.campo+': '+e.mensaje;}).join('; '));
    return copia(ficha);
  }
  function validarBiblioteca(datos) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos) ||
        datos.version !== 1 || datos.tipo !== TIPO ||
        !Number.isSafeInteger(datos.siguienteId) || datos.siguienteId < 1 ||
        !Array.isArray(datos.criaturas))
      throw Error('El formato de biblioteca de criaturas no es válido o no está soportado.');
    var ids = new Set();
    if(datos.catalogoPersonalizado!==undefined){
      var cat=datos.catalogoPersonalizado;
      if(!cat||!Array.isArray(cat.ataques)||!Array.isArray(cat.talentos))
        throw Error('El catálogo personal del JSON es incompatible.');
      cat.ataques.forEach(function(a) {
        if(!a||typeof a.nombre!=='string'||!a.nombre.trim()||
            !modelo.revisar(modelo.nuevaCriatura({nombre:'Validación',
              ataques:[modelo.ataque(a)]}),{paraExportar:true}).valida)
          throw Error('Plantilla de ataque no válida.');
      });
      cat.talentos.forEach(function(t){
        if(!t||typeof t.nombre!=='string'||!t.nombre.trim()||
            !modelo.revisar(modelo.nuevaCriatura({nombre:'Validación',
              talentos:[modelo.talento(t)]}),{paraExportar:true}).valida)
          throw Error('Plantilla de Talento no válida.');
      });
    }
    datos.criaturas.forEach(function (registro) {
      if (!registro || typeof registro !== 'object' || typeof registro.id !== 'string' ||
          !/^criatura-\d+$/.test(registro.id) || ids.has(registro.id))
        throw Error('Hay identificadores repetidos o incorrectos en la biblioteca.');
      ids.add(registro.id);
      validarFicha(registro.ficha);
    });
    return datos;
  }
  function crearBiblioteca(almacenamiento, clave) {
    if (!almacenamiento || typeof almacenamiento.getItem !== 'function' ||
        typeof almacenamiento.setItem !== 'function' ||
        typeof almacenamiento.removeItem !== 'function')
      throw Error('Necesitas un almacenamiento local compatible.');
    var llave = clave || CLAVE;
    function leer() {
      var raw;
      try { raw = almacenamiento.getItem(llave); }
      catch (e) { throw Error('No se puede consultar la biblioteca local de criaturas.'); }
      if (raw === null || raw === undefined || raw === '') return inicial();
      var parsed;
      try { parsed = JSON.parse(raw); }
      catch (e) { throw Error('La biblioteca local está dañada; no se ha sobrescrito.'); }
      return validarBiblioteca(parsed);
    }
    function escribir(datos) {
      var contenido = JSON.stringify(validarBiblioteca(datos));
      try { almacenamiento.setItem(llave, contenido); }
      catch (e) { throw Error('No se pudo guardar en este navegador. Revisa el espacio disponible.'); }
    }
    function nuevoId(datos) {
      var identificadores = new Set(datos.criaturas.map(function (c) {return c.id;}));
      var id;
      do {
        id = 'criatura-' + datos.siguienteId++;
      } while (identificadores.has(id));
      return id;
    }
    function listar() {
      return leer().criaturas.map(function (registro) {
        var ficha = registro.ficha;
        return {id:registro.id, nombre:ficha.nombre, categoria:ficha.categoria,
          nivel:ficha.puntuaciones.nivel, ataques:ficha.ataques.length,
          talentos:ficha.talentos.length};
      });
    }
    function obtener(id) {
      var registro = leer().criaturas.find(function (x) {return x.id === id;});
      return registro ? copia(registro.ficha) : null;
    }
    function guardar(ficha, id) {
      var valida = validarFicha(ficha);
      var datos = leer();
      var actual = id === undefined || id === null ? null :
        datos.criaturas.find(function (x) {return x.id === id;});
      if (id !== undefined && id !== null && !actual)
        throw Error('La criatura que intentas editar ya no existe.');
      if (actual) actual.ficha = valida;
      else {
        id = nuevoId(datos);
        datos.criaturas.push({id:id, ficha:valida});
      }
      escribir(datos);
      return id;
    }
    function eliminar(id) {
      var datos = leer();
      var indice = datos.criaturas.findIndex(function (x) {return x.id === id;});
      if (indice === -1) return false;
      datos.criaturas.splice(indice, 1);
      escribir(datos);
      return true;
    }
    function catalogoPersonal(){
      var c=leer().catalogoPersonalizado||{ataques:[],talentos:[]};
      return copia(c);
    }
    function guardarPlantilla(tipo,plantilla){
      if(tipo!=='ataques'&&tipo!=='talentos')
        throw Error('Tipo de catálogo personal no admitido.');
      var normalizada=tipo==='ataques'?modelo.ataque(plantilla):modelo.talento(plantilla);
      var ensayo=modelo.nuevaCriatura({nombre:'Validación'});
      ensayo[tipo]=[normalizada];
      var revision=modelo.revisar(ensayo,{paraExportar:true});
      if(!normalizada.nombre.trim()||!revision.valida)
        throw Error('La plantilla personalizada no es válida.');
      var datos=leer();
      if(!datos.catalogoPersonalizado)datos.catalogoPersonalizado={ataques:[],talentos:[]};
      var lista=datos.catalogoPersonalizado[tipo];
      if(!lista.some(function(x){return JSON.stringify(x)===JSON.stringify(normalizada);}))
        lista.push(normalizada);
      escribir(datos);
      return copia(normalizada);
    }
    function exportarJson(id) {
      if (id === undefined || id === null)
        return JSON.stringify(leer(), null, 2);
      var ficha = obtener(id);
      if (!ficha) throw Error('No existe la criatura que quieres exportar.');
      return JSON.stringify(ficha, null, 2);
    }
    function importarJson(texto, opciones) {
      opciones = opciones || {};
      if (typeof texto !== 'string' || !texto.trim())
        throw Error('Pega un JSON de criatura o biblioteca.');
      if (texto.length > 5000000)
        throw Error('El archivo de criaturas es demasiado grande.');
      var entrada;
      try { entrada = JSON.parse(texto); }
      catch (e) { throw Error('El texto no contiene JSON válido.'); }
      var fichas;
      if (entrada && entrada.tipo === TIPO) {
        validarBiblioteca(entrada);
        fichas = entrada.criaturas.map(function (r) {return r.ficha;});
      } else if (entrada && entrada.tipo === 'criatura_usuario') {
        fichas = [entrada];
      } else {
        throw Error('El JSON no es una criatura o biblioteca Nd20 compatible.');
      }
      fichas = fichas.map(validarFicha);
      // Todas las fichas se comprueban antes de escribir: importación atómica.
      var datos = opciones.reemplazar === true ? inicial() : leer();
      if(entrada && entrada.tipo===TIPO&&entrada.catalogoPersonalizado){
        if(!datos.catalogoPersonalizado)datos.catalogoPersonalizado={ataques:[],talentos:[]};
        ['ataques','talentos'].forEach(function(tipo){
          entrada.catalogoPersonalizado[tipo].forEach(function(valor){
            var actual=datos.catalogoPersonalizado[tipo];
            if(!actual.some(function(x){return JSON.stringify(x)===JSON.stringify(valor);}))
              actual.push(copia(valor));
          });
        });
      }
      var ids = fichas.map(function (ficha) {
        var id = nuevoId(datos);
        datos.criaturas.push({id:id, ficha:ficha});
        return id;
      });
      if (fichas.length || opciones.reemplazar === true||
          !!(entrada&&entrada.catalogoPersonalizado)) escribir(datos);
      return ids;
    }
    return {listar:listar, obtener:obtener, guardar:guardar, eliminar:eliminar,
      catalogoPersonal:catalogoPersonal,guardarPlantilla:guardarPlantilla,
      exportarJson:exportarJson, importarJson:importarJson};
  }
  return {CLAVE:CLAVE, TIPO:TIPO, crearBiblioteca:crearBiblioteca};
});
