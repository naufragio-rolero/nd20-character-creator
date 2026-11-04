/* Generadores puros y deterministas: sin servidor ni dependencias. */
(function (root, factory) {
  var api = factory(typeof module !== 'undefined' && module.exports ?
    require('./equipment.js') : root.NaufragioEquipment,
    typeof module !== 'undefined' && module.exports ?
    require('./sex.js') : root.NaufragioSexo,
    typeof module !== 'undefined' && module.exports ?
    require('./names.js') : root.NaufragioNombres);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (equipoApi, sexoApi, nombresApi) {
  'use strict';
  var ATTR_ND = ['Fuerza', 'Agilidad', 'Resistencia', 'Mente', 'Intuición', 'Presencia'];
  var ATTR_DH = ['Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma'];
  var DADOS = [4, 6, 8, 10, 12, 20];
  var SALUD_ALTA = {4:1, 6:1, 8:2, 10:2, 12:3, 20:3};
  function hash(texto) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < String(texto).length; i++) {
      h ^= String(texto).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function aleatorioSemilla(semilla) {
    var a = hash(semilla || '0');
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function nivelAleatorio(minimo,maximo,rng,limite) {
    limite=limite===undefined?36:limite;
    if(!Number.isInteger(minimo)||!Number.isInteger(maximo)||
       minimo<1||maximo>limite||minimo>maximo)
      throw Error('El intervalo de Niveles no es válido (1–'+limite+').');
    if(typeof rng!=='function')throw Error('Falta el generador determinista de Niveles.');
    return minimo===maximo?minimo:minimo+Math.floor(rng()*(maximo-minimo+1));
  }
  function nivelExacto(config,maximo){
    var nivel=config.nivel===undefined?1:config.nivel;
    if(!Number.isInteger(nivel)||nivel<1||nivel>maximo)
      throw Error('Nivel no válido: debe ser un entero entre 1 y '+maximo+'.');
    return nivel;
  }
  function dado(caras, rng) { return 1 + Math.floor(rng() * caras); }
  function escoger(arr, rng) {
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr[Math.floor(rng() * arr.length)];
  }
  function suma(n, caras, rng) {
    var resultado = 0;
    for (var i = 0; i < n; i++) resultado += dado(caras, rng);
    return resultado;
  }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function paresAtributos(valores, nombres, favorito) {
    return nombres.map(function (nombre, i) {
      return {nombre:nombre, valor:valores[i], dificultad:20 - valores[i], favorito:nombre === favorito};
    });
  }
  function requisitoCumplido(especie, valores) {
    var attr = especie.atributo_requisito;
    var antiguo = !attr || (valores[attr] || 0) >= (especie.atributo_valor || 0);
    return antiguo && (especie.requisitos || []).every(function(req) {
      return (valores[req.atributo] || 0) >= req.minimo;
    });
  }
  function crearNd20(datos, config, rng) {
    rng = rng || Math.random;
    config = config || {};
    var nivel = nivelExacto(config,30);
    var especies = datos.especies, ocupaciones = datos.ocupaciones;
    var fuentes=datos.fuentes||{}, permitidas=Array.isArray(config.fuentes)?config.fuentes:null;
    if(permitidas&&!permitidas.length)
      throw Error('Selecciona al menos una fuente para generar personajes.');
    function permitida(tipo,key){
      return !permitidas||permitidas.indexOf((fuentes[tipo]||{})[key]||'DRS')!==-1;
    }
    var poolEsp=Array.isArray(config.especiesPermitidas)?config.especiesPermitidas:[];
    var poolOc=Array.isArray(config.ocupacionesPermitidas)?config.ocupacionesPermitidas:[];
    var esps=Object.keys(especies).filter(function(key){
      return permitida('especies',key)&&(!poolEsp.length||poolEsp.includes(key));
    });
    var ocs=Object.keys(ocupaciones).filter(function(key){
      return permitida('ocupaciones',key)&&(!poolOc.length||poolOc.includes(key));
    });
    if (!esps.length || !ocs.length)
      throw Error('No hay Ocupaciones o Especies disponibles con las fuentes seleccionadas.');
    if(config.especie&&esps.indexOf(config.especie)===-1)
      throw Error('La Especie elegida no pertenece a las fuentes permitidas.');
    if(config.ocupacion&&ocs.indexOf(config.ocupacion)===-1)
      throw Error('La Ocupación elegida no pertenece a las fuentes permitidas.');
    var elegido = (config.especie && especies[config.especie]) ? config.especie : '';
    var at = {}, especie = null, intentos = 0;
    do {
      ATTR_ND.forEach(function (a) { at[a] = 3 + dado(6, rng); });
      var validas = esps.filter(function (e) { return requisitoCumplido(especies[e], at); });
      if (elegido && validas.indexOf(elegido) !== -1) especie = elegido;
      if (!elegido && validas.length) especie = escoger(validas, rng);
      intentos++;
    } while (!especie && intentos < 500);
    if (!especie) throw Error('No se cumplen los requisitos de la especie seleccionada');
    var sexoFuente=config.catalogoSexo||null;
    var coherencia=config.respetarContextoSexo!==false;
    var sexo;
    if(sexoApi&&sexoFuente){
      var solicitud=sexoApi.forma(config.sexo);
      var forzada=config.ocupacion&&sexoApi.preferenciaOcupacion(config.ocupacion,sexoFuente);
      // Una Ocupación escogida cuya tradición es femenina resuelve la
      // elección automática antes de filtrar el resto de las Ocupaciones.
      sexo=sexoApi.resolverSexo(solicitud,config.ocupacion||null,especie,
        sexoFuente,coherencia,rng);
      if(coherencia){
        ocs=ocs.filter(function(n){return sexoApi.ocuparPermitida(n,sexo,sexoFuente,true);});
        if(!ocs.length)throw Error('No quedan Ocupaciones compatibles con el sexo elegido.');
      }
    }else{
      sexo=config.sexo==='femenino'||config.sexo==='masculino'?
        config.sexo:(rng()<.5?'femenino':'masculino');
    }
    var ocupacion = (config.ocupacion && ocupaciones[config.ocupacion]) ?
      config.ocupacion : escoger(ocs, rng);
    var esp = especies[especie], oc = ocupaciones[ocupacion];
    var favorito = escoger(oc.atributo_favorito, rng);
    if (!favorito || ATTR_ND.indexOf(favorito) === -1) throw Error('Ocupación sin Atributo favorito válido');
    at[favorito] = clamp(at[favorito] + 1, 4, 18);
    var detalles = [];
    // DRS: Herencia dual es una elección exclusiva de Nivel 1. Reservamos
    // siempre las dos extracciones aleatorias para que la misma semilla
    // reconstruya una ficha personalizada antes de aplicar las subidas.
    var alternativas = config.juego === 'nd20' &&
      Array.isArray(esp.herencia_dual) ? esp.herencia_dual : null;
    var desarrolloHumano = (esp.talentos || []).includes('Buen desarrollo');
    var herenciaAleatoria = alternativas ? escoger(alternativas, rng) : null;
    // Reservar la tirada de Atributo incluso si el humano deja la decisión
    // pendiente: así el mismo RNG conserva todas las tiradas posteriores.
    var atributoAleatorio = alternativas || desarrolloHumano ?
      escoger(ATTR_ND, rng) : null;
    if (config.herenciaDual && (!alternativas ||
        alternativas.indexOf(config.herenciaDual) === -1))
      throw Error('Herencia dual ajena a la Especie o no admitida por el DRS.');
    var herenciaDual = alternativas ?
      (config.herenciaDual || (config.herenciaPendiente === true ? null : herenciaAleatoria)) : null;
    var desarrollo = null;
    var tieneDesarrollo = desarrolloHumano || herenciaDual === 'Buen desarrollo';
    // El humano también debe poder escoger el Atributo en modo Personalizado.
    // La ficha provisional espera la elección sin falsear mejoras de Nivel.
    if (desarrolloHumano && config.desarrolloPendiente === true)
      tieneDesarrollo = false;
    if (config.atributoBuenDesarrollo &&
        (!tieneDesarrollo || ATTR_ND.indexOf(config.atributoBuenDesarrollo) === -1))
      throw Error('Atributo no válido para Buen desarrollo.');
    if (tieneDesarrollo) {
      desarrollo = config.atributoBuenDesarrollo || atributoAleatorio;
      at[desarrollo] = clamp(at[desarrollo] + 1, 4, 18);
      detalles.push('Buen desarrollo: +1 VA en ' + desarrollo + ' durante la creación.');
    }
    if (herenciaDual)
      detalles.push('Herencia dual: ' + herenciaDual + '.');
    for (var n = 2; n <= nivel; n++) {
      var candidatos = ATTR_ND.concat([favorito, favorito]);
      var primero = escoger(candidatos, rng);
      var segundo = escoger(candidatos.filter(function (v) { return v !== primero; }), rng);
      [primero, segundo].forEach(function (nombre) {
        if (at[nombre] >= 18) return;
        var tirada = dado(20, rng);
        if (tirada > at[nombre] || (nombre === favorito && dado(20, rng) > at[nombre])) {
          at[nombre] = Math.min(18, at[nombre] + 1);
        }
      });
    }
    var dadoBase = parseInt(String(esp.salud || 'd6').replace('d',''), 10);
    var indice = DADOS.indexOf(dadoBase);
    if (indice < 0) throw Error('Dado de Salud desconocido: ' + esp.salud);
    var mod = Number(oc.salud) || 0;
    var dadoSalud = DADOS[clamp(indice + mod, 0, DADOS.length - 1)];
    var salud = dadoSalud;
    for (var sn = 2; sn <= nivel; sn++) {
      salud += sn < 12 ? dado(dadoSalud, rng) : SALUD_ALTA[dadoSalud];
    }
    var esfuerzo = clamp((Number(oc.esfuerzo) || 0) + Math.floor(nivel / 6), 0, 9);
    var conceptos = (oc.conceptos || []).concat(esp.conceptos || []);
    var esFantasia = config.juego === 'nd20';
    var esCifi = config.juego === 'nd20_cifi';
    var presupuestoBase = esFantasia ? suma(4, 10, rng) * 10 :
      esCifi ? suma(4, 10, rng) * 100 : null;
    var riquezaAdicional=0;
    if((esFantasia||esCifi)&&config.riquezaPorNivel===true){
      // Cada Nivel ganado después del primero aporta 4d10 mo/cr adicionales.
      for(var extraNivel=2;extraNivel<=nivel;extraNivel++)
        riquezaAdicional+=suma(4,10,rng);
      detalles.push('Riqueza adicional opcional: '+(nivel-1)+
        ' Niveles × 4d10 = '+riquezaAdicional+' '+(esFantasia?'mo':'cr')+'.');
    }
    var presupuesto=presupuestoBase===null?null:presupuestoBase+riquezaAdicional;
    var compra = equipoApi && config.catalogoEquipo ?
      equipoApi.compraInicial(oc, ocupacion, config.juego, config.catalogoEquipo, presupuesto, rng, nivel, esp) :
      {equipo:[],restante:presupuesto,notas:[
        'El inventario inicial requiere el catálogo de equipo contrastado.'
      ]};
    var equipo = compra.equipo.slice();
    // La compra inicial no concede equipo gratis: solo activar la pieza que ya
    // figura en inventario, comprobada por los lectores de Equipo DRS.
    var armaInicial='',armaduraInicial='';
    if(esFantasia&&equipoApi&&config.catalogoEquipo){
      var cambiables=compra.compras_iniciales_intercambiables||[];
      var candidataArma=cambiables.find(function(x){
        return x.grupo==='armas'||x.grupo==='varitas_defensa';
      });
      var candidataArmadura=cambiables.find(function(x){return x.grupo==='armaduras';});
      var inventarioInicial={equipo:equipo};
      if(candidataArma&&equipoApi.armasDisponibles(inventarioInicial,config.catalogoEquipo)
         .some(function(x){return x.nombre===candidataArma.nombre;}))
        armaInicial=candidataArma.nombre;
      if(candidataArmadura&&equipoApi.proteccionesDisponibles(inventarioInicial,config.catalogoEquipo)
         .armaduras.some(function(x){return x.nombre===candidataArmadura.nombre;}))
        armaduraInicial=candidataArmadura.nombre;
    }
    detalles = detalles.concat(compra.notas);
    var recuerdo = escoger(esp.objetos_emocionales || [], rng);
    if (recuerdo) equipo.push('Recuerdo: '+recuerdo);
    var tipo = config.juego === 'nd20_cifi' ? 'Naufragio d20 · CiFi' :
      config.juego === 'nd20_nocturna' ? 'Naufragio d20 · Nocturna' : 'Naufragio d20 · Fantasía';
    var capacidades = (esp.talentos || []).concat(oc.talentos || []);
    if (desarrolloHumano && config.desarrolloPendiente === true)
      capacidades = capacidades.filter(function(x){return x !== 'Buen desarrollo';});
    if (herenciaDual && !capacidades.includes(herenciaDual))
      capacidades.push(herenciaDual);
    if (config.juego === 'nd20' && ocupacion === 'Guerrero') {
      // El DRS concede Recuperación y obliga a ELEGIR uno de los otros dos Talentos.
      // En la web la elección se aplaza al editor; la API directa elige uno con su RNG.
      capacidades = capacidades.filter(function(x){
        return x !== 'Brío musculoso' && x !== 'Sacrificio de escudo';
      });
      if (!config.aplazarElecciones) {
        var talentoGuerrero = escoger(['Brío musculoso', 'Sacrificio de escudo'], rng);
        capacidades.push(talentoGuerrero);
        detalles.push('Talento de Guerrero elegido: ' + talentoGuerrero + '.');
      }
    }
    if (!config.aplazarElecciones && (esp.talentos_elegir || []).length) {
      var eleccionEspecie = escoger(esp.talentos_elegir, rng);
      capacidades.push(eleccionEspecie);
      detalles.push('Talento adicional de Especie seleccionado: ' + eleccionEspecie + '.');
    }
    if (!config.aplazarElecciones && (oc.talentos_elegir || []).length) {
      var eleccionOcupacion = escoger(oc.talentos_elegir, rng);
      capacidades.push(eleccionOcupacion);
      detalles.push('Talento adicional de Ocupación seleccionado: ' + eleccionOcupacion + '.');
    }
    // La ficha debe describir los efectos raciales, incluso cuando no existe
    // un motor de combate/estados que pueda ejecutarlos en una partida.
    if (config.juego === 'nd20' && esp.talentos_descripcion) {
      Object.keys(esp.talentos_descripcion).forEach(function(talento){
        if(capacidades.includes(talento))
          detalles.push('Talento de Especie — '+talento+': '+esp.talentos_descripcion[talento]);
      });
    }
    if (config.juego === 'nd20' && oc.talentos_descripcion) {
      Object.keys(oc.talentos_descripcion).forEach(function(talento){
        if(capacidades.includes(talento))
          detalles.push('Talento de Ocupación — '+talento+': '+oc.talentos_descripcion[talento]);
      });
    }
    // Los Talentos oficiales de inicio figuran en oc.talentos, contrastados
    // con el apartado Talentos del manual; no se conceden referencias sueltas.
    var referencias=(oc.talentos_referencia||[]).filter(function(t){
      return capacidades.indexOf(t)<0 &&
        (oc.talentos_elegir||[]).indexOf(t)<0 &&
        !(ocupacion==='Adalid'&&['Desafío honorable','Imposición de manos'].includes(t));
    });
    if(referencias.length)
      detalles.push('Talentos pendientes de verificación o elección: '+referencias.join(', ')+'.');
    if(oc.talentos_documentacion&&oc.talentos_documentacion.condiciones)
      detalles.push(oc.talentos_documentacion.condiciones+'.');
    if (config.juego === 'nd20' && esp.envejecimiento)
      detalles.push('Envejecimiento de Especie: ' + esp.envejecimiento + '.');
    if (esp.debilidad) detalles.push('Debilidad de Especie: ' + esp.debilidad);
    // El DRS define Potencia 1 para todos los PJ. Brío musculoso es una
    // elección exclusiva del Guerrero y eleva su valor en Nv 10 y Nv 22.
    var potenciaDRS = esFantasia ?
      1 + (ocupacion === 'Guerrero' && capacidades.includes('Brío musculoso') ?
        (nivel >= 10 ? 1 : 0) + (nivel >= 22 ? 1 : 0) : 0) : null;
    var riqueza = esFantasia ? compra.restante+' mo restantes / '+presupuesto+' mo iniciales' :
      esCifi ? compra.restante+' cr restantes / '+presupuesto+' cr iniciales' : '';
    // El ámbito es una referencia documental, nunca una cultura ni Especie.
    // Solo se permite filtrar por la colección vigente de Isla Tormenta.
    var ambitoNombres=config.modoNombre==='combinado'&&
      config.ambitoNombre==='Isla Tormenta'?
      config.ambitoNombre:null;
    var poolNombres=[];
    if(config.juego==='nd20'&&config.modoNombre==='historico'){
      // 1428 testimonios de la fuente original, seis repeticiones;
      // el azar elige entre 1422 FORMAS únicas para no sesgar la frecuencia.
      var vistosHistoricos=new Set();
      poolNombres=((config.nombresHistoricosYlat||{}).entradas||[])
        .filter(function(item){
          if(vistosHistoricos.has(item.nombre))return false;
          vistosHistoricos.add(item.nombre);
          return true;
        }).map(function(item){
          return {id:item.id,nombre:item.nombre,tipo:'historico'};
        });
    }else if(config.juego==='nd20'&&
             !['generico','ylat','especie'].includes(config.modoNombre)&&
             config.tesauroYlat){
      poolNombres=config.tesauroYlat.entradas.filter(function(item){
        return item.tipo===(config.modoNombre==='documentado'?'documentado':'combinado')&&
          (!ambitoNombres||item.ambito===ambitoNombres);
      });
    }
    var nombreYlat=config.modoNombre==='combinado'&&sexoApi&&
      sexoApi.elegirPonderado?sexoApi.elegirPonderado(poolNombres,rng):
      escoger(poolNombres,rng);
    var nuevoModo=config.modoNombre==='generico'||config.modoNombre==='ylat';
    var nombrePropuesto=!config.nombre&&config.juego==='nd20'&&nombresApi?
      (config.modoNombre==='generico'?nombresApi.generico(config.nombresHistoricosYlat,rng):
       config.modoNombre==='ylat'?nombresApi.ylat(config.componentesYlat,rng):null):null;
    var nombreConSexo=!nuevoModo&&sexoFuente&&sexoApi?
      sexoApi.elegirNombre(config,especie,esp.nombres||[],poolNombres,sexo,sexoFuente,rng):null;
    if(nombreConSexo&&nombreConSexo.nota&&nombreConSexo.nota!=='Nombre elegido manualmente.')
      detalles.push(nombreConSexo.nota);
    var nombreDefinitivo=(nombreConSexo&&nombreConSexo.nombre)||
      config.nombre || nombrePropuesto || (nombreYlat&&nombreYlat.nombre) ||
      escoger(esp.nombres || [],rng) || 'Sin nombre';
    var registroNombre=!config.nombre&&poolNombres.find(function(item){
      return item.nombre===nombreDefinitivo;
    });
    if(registroNombre&&registroNombre.tipo==='combinado')
      detalles.push('Nombre propuesto con elementos de Ylat (corpus de referencia: '+
        registroNombre.ambito+'). No identifica un personaje canónico.');
    // El banco histórico conserva sus cautelas en el JSON de origen.
    // No se duplican como observaciones de cada personaje generado.
    if(sexoFuente&&coherencia&&sexo==='masculino'&&
      sexoFuente.especies_preferencia_femenino?.[especie])
      detalles.push('Varón excepcional de '+especie+
        ': posibilidad excepcional reconocida por su descripción de Especie.');
    if(sexoFuente&&sexoFuente.ocupaciones_contexto_femenino?.[ocupacion]&&
      sexo==='masculino'&&!coherencia)
      detalles.push('Excepción narrativa elegida: '+ocupacion+
        ' se describe en femenino, pero el manual no declara prohibición mecánica.');
    return {
      juego:tipo, nombre:nombreDefinitivo, sexo:sexo,
      descripcion:ocupacion + ' · ' + especie, nivel:nivel,
      concepto:escoger(conceptos, rng) || 'Aventurero',
      ...((alternativas||desarrolloHumano) ? {
        herencia_dual: herenciaDual,
        atributo_buen_desarrollo: desarrollo
      } : {}),
      atributos:paresAtributos(ATTR_ND.map(function (a) {return at[a];}), ATTR_ND, favorito),
      recursos:[['Salud', salud + ' (d' + dadoSalud + ')'],
        ['Esfuerzo', esfuerzo], ['Movimiento', esp.movimiento]].concat(
          esFantasia ? [['Potencia', potenciaDRS]] : [],
          esp.esencia ? [['Esencia', esp.esencia]] : []),
      capacidades:capacidades,
      competencias:(oc.competencias || []).slice(), equipo:equipo, origen:tipo,
      ...(esFantasia?{saldo_mo:Number(compra.restante),
        capital_inicial_mo:presupuesto,
        arma_equipada:armaInicial,
        protecciones_equipadas:{armadura:armaduraInicial,escudo:''},
        // Solo compra inicial documentada; regalos y paquetes nunca se reembolsan.
        compras_iniciales_intercambiables:
          (compra.compras_iniciales_intercambiables||[]).map(function(x){
            return Object.assign({},x);
          })}:{}),
      procedenciaOcupacion:(fuentes.ocupaciones||{})[ocupacion]||tipo,
      procedenciaEspecie:(fuentes.especies||{})[especie]||tipo,
      riqueza:riqueza,
      notas:detalles.concat((oc.poderes || []).length ? ['Poderes declarados: ' + oc.poderes.join(', ') + '.'] : [],
        config.aplazarElecciones ? [] : ['El generador no asigna Conjuros ni Técnicas por Nivel.'])
    };
  }
  function dificultadDH(rng) {
    var tres = [dado(6, rng), dado(6, rng), dado(6, rng)].sort(function(a,b){return a-b;});
    return 10 + tres[1];
  }
  function subirDH(valor, veces, rng) {
    for (var i = 0; i < veces; i++) if (dado(20, rng) <= valor) valor = Math.max(4, valor - 1);
    return valor;
  }
  function saludDH(dadoSalud, nivel, rng) {
    var salud = dadoSalud;
    for (var n = 2; n <= nivel; n++) {
      salud += n <= 9 ? dado(dadoSalud, rng) : Math.floor(dadoSalud / 4);
    }
    return salud;
  }
  function escogerEntradaPorOrigen(entries, origenes, rng) {
    if(origenes&&!origenes.length)
      throw Error('Marca al menos una procedencia para Dungeon Hack.');
    var valores = Object.keys(entries).filter(function(k) {
      return !origenes || !origenes.length || origenes.indexOf(Number(entries[k].origin)) !== -1;
    });
    if (!valores.length) throw Error('No hay entradas para los orígenes elegidos');
    return escoger(valores, rng);
  }
  function eleccionDH(datos, config, rng) {
    var origenes = Array.isArray(config.origenes) ? config.origenes.map(Number) : null;
    if(origenes&&!origenes.length)
      throw Error('Marca al menos una procedencia para Dungeon Hack.');
    var clases = datos.classes;
    if(config.ocupacion&&clases[config.ocupacion]&&origenes&&
      origenes.indexOf(Number(clases[config.ocupacion].origin))===-1)
      throw Error('La Clase elegida no pertenece a las procedencias permitidas.');
    var poolOc=Array.isArray(config.ocupacionesPermitidas)?config.ocupacionesPermitidas:[];
    var candidatas=Object.fromEntries(Object.entries(clases).filter(function(par){
      return !poolOc.length||poolOc.includes(par[0]);
    }));
    var claseKey = config.ocupacion && clases[config.ocupacion] ?
      config.ocupacion : escogerEntradaPorOrigen(candidatas, origenes, rng);
    var clase = clases[claseKey], nivel = nivelExacto(config,36);
    var favor = escoger(clase.attr, rng);
    var atributos = ATTR_DH.map(function(){return dificultadDH(rng);});
    var tieneRaza = config.conEspecie !== false && !clase.is_race;
    var especie = null;
    if (tieneRaza) {
      var razas = Object.keys(datos.races).filter(function (k) {
        var r = datos.races[k];
        var permitidas=Array.isArray(config.especiesPermitidas)?config.especiesPermitidas:[];
        return (!config.especie || k === config.especie) &&
          (!permitidas.length||permitidas.includes(k)) &&
          (!origenes||origenes.indexOf(Number(r.origin))!==-1) &&
          (r.req || []).every(function (x) { return atributos[x[0]] <= x[1]; });
      });
      if(config.especie&&origenes&&datos.races[config.especie]&&
        origenes.indexOf(Number(datos.races[config.especie].origin))===-1)
        throw Error('La Especie elegida no pertenece a las procedencias permitidas.');
      if (razas.length) especie = datos.races[escoger(razas, rng)];
    }
    if (Number.isInteger(favor) && favor >= 0 && favor < atributos.length)
      atributos[favor] = Math.max(4, atributos[favor] - 1);
    if (especie && (especie.skills || []).indexOf('Buen desarrollo') !== -1)
      atributos[Math.floor(rng() * atributos.length)]--;
    for (var step = 2; step <= nivel; step++) {
      var a = Math.floor(rng() * atributos.length);
      var b = Math.floor(rng() * (atributos.length - 1));
      if (b >= a) b++;
      atributos[a] = subirDH(atributos[a], a === favor ? 2 : 1, rng);
      atributos[b] = subirDH(atributos[b], b === favor ? 2 : 1, rng);
    }
    var dinero = 0;
    for (var d = 0; d < nivel; d++) dinero += (2 + Math.floor(rng() * 23)) * 10;
    var inicial = dinero;
    function comprar(packs, ids) {
      var disponibles = (ids || []).map(function (id) {return packs[id];}).filter(function (p) {
        return Array.isArray(p) && Number(p[0]) <= dinero;
      });
      if (!disponibles.length) return null;
      var elegido = escoger(disponibles, rng);
      dinero -= Number(elegido[0]);
      return elegido;
    }
    var herramientas = comprar(datos.tool_packs, clase.tools);
    var paquete = comprar(datos.equip_packs, clase.equip);
    var sexoDH=config.sexo==='femenino'||config.sexo==='masculino'?
      config.sexo:(rng()<.5?'femenino':'masculino');
    var candidatosDH=sexoApi?sexoApi.nombresDH(clase.names||[],sexoDH):clase.names||[];
    var nombre=config.nombre || escoger(candidatosDH,rng) || 'Sin nombre';
    var capacidades = (clase.skills || []).concat(especie ? (especie.skills || []) : []);
    var notas = (clase.adv || []).slice();
    if (especie && especie.old) notas.push('Vejez: ' + especie.old);
    return {
      juego:'Dungeon Hack', nombre:nombre, sexo:sexoDH,
      descripcion:(especie ? especie.name + ' · ' : '') + clase.name,
      nivel:nivel, concepto:'', origen:datos.origins[clase.origin] || 'Dungeon Hack',
      procedenciaOcupacion:datos.origins[clase.origin]||'Dungeon Hack',
      procedenciaEspecie:especie?(datos.origins[especie.origin]||'Dungeon Hack'):'',
      atributos:ATTR_DH.map(function (nombre, i) {
        return {nombre:nombre, valor:20-atributos[i], dificultad:atributos[i], favorito:i === favor};
      }),
      recursos:[['Salud', saludDH(Number(clase.hp) || 4, nivel, rng) + ' (d' + clase.hp + ')'],
        ['Energía', (Number(clase.en) || 0) + (nivel > 9 ? 1 : 0)],
        ['Alineamiento', escoger(datos.aligns, rng)]],
      capacidades:capacidades,
      competencias:clase.prof ? [clase.prof] : [],
      equipo:[herramientas, paquete].filter(Boolean).reduce(function (acc,p) {
        return acc.concat([p[1]]).concat(p[2] || []);
      }, []),
      riqueza:dinero + ' mc restantes / ' + inicial + ' mc iniciales',
      notas:notas
    };
  }
  // Tabla literal Seguidores del DRS v1.1.12: d12, precio diario,
  // Moral, dado de Salud y disponibilidad para acompañar aventuras.
  // No comparte Nivel, progresión ni equipo con los seguidores de Dungeon Hack.
  var SEGUIDORES_DRS=[
    {nombre:'Arcanista',precio:'20 mo',moral:8,dado:4,aventura:'Depende'},
    {nombre:'Artesano',precio:'1 mo',moral:6,dado:4,aventura:'No'},
    {nombre:'Cazador',precio:'2 mo',moral:9,dado:8,aventura:'Sí'},
    {nombre:'Escriba',precio:'1 mo',moral:6,dado:4,aventura:'Depende'},
    {nombre:'Escudero',precio:'1 mp',moral:7,dado:6,aventura:'Sí'},
    {nombre:'Guardia',precio:'2 mo',moral:9,dado:8,aventura:'Sí'},
    {nombre:'Ladrón',precio:'1 mo',moral:7,dado:4,aventura:'Depende'},
    {nombre:'Mensajero',precio:'5 mo',moral:8,dado:6,aventura:'Sí'},
    {nombre:'Mercenario',precio:'5 mo',moral:9,dado:8,aventura:'Sí'},
    {nombre:'Portantorchas',precio:'8 mc',moral:6,dado:6,aventura:'Sí'},
    {nombre:'Porteador',precio:'7 mp',moral:7,dado:6,aventura:'Sí'},
    {nombre:'Sacerdote',precio:'3 mo',moral:10,dado:4,aventura:'No'}
  ];
  function seguidoresDRS(){return SEGUIDORES_DRS.map(function(x){return Object.assign({},x);});}
  // Propuestas de equipo del generador, no adquisiciones automáticas ni
  // obligaciones reglamentarias. Se validan contra el catálogo DRS cargado.
  var EQUIPO_POR_OFICIO_DRS={
    Arcanista:{arma:['Varita de cerezo','Varita de roble'],fijos:['Libro de conjuros','Tinta y pluma']},
    Artesano:{fijos:['Martillo de campamento','Piedra de afilar','Bolsa de cuero']},
    Cazador:{arma:['Arco corto','Arco largo'],armadura:['Armadura de cuero','Armadura de pieles'],
      fijos:['Flechas','Cuerda','Ración de alimento']},
    Escriba:{fijos:['Pergamino','Tinta y pluma','Estuche de pergaminos vacío']},
    Escudero:{arma:['Espada corta','Maza'],armadura:['Armadura acolchada','Armadura de cuero'],
      escudo:['Escudo pequeño'],fijos:['Ropa de viaje']},
    Guardia:{arma:['Lanza','Maza','Espada corta'],armadura:['Armadura acolchada','Armadura de cuero'],
      escudo:['Escudo pequeño']},
    Ladrón:{arma:['Daga','Espada corta'],armadura:['Armadura de cuero'],
      fijos:['Ganzúas','Cuerda','Bolsa de cuero']},
    Mensajero:{fijos:['Ropa de viaje','Bolsa de cuero','Odre de agua']},
    Mercenario:{arma:['Espada larga','Hacha de batalla','Maza'],armadura:['Armadura de cuero','Armadura de bandas'],
      fijos:['Ración de alimento']},
    Portantorchas:{fijos:['Antorcha','Yesquero','Odre de agua']},
    Porteador:{fijos:['Mochila','Cuerda','Manta','Odre de agua']},
    Sacerdote:{arma:['Maza','Martillo ligero'],fijos:['Símbolo sagrado','Túnica','Libro']}
  };
  function equipoSeguidor(oficio,catalogo,rng){
    var perfil=EQUIPO_POR_OFICIO_DRS[oficio]||{},resultado=[];
    if(!catalogo)return resultado;
    function buscar(nombre){
      var colecciones=['armas','varitas_defensa','armaduras','escudos','municion',
        'componentes_paquetes_editoriales'];
      var lista=colecciones.flatMap(function(k){return catalogo[k]||[];});
      Object.keys(catalogo.utiles_fantasia||{}).forEach(function(k){
        lista.push.apply(lista,catalogo.utiles_fantasia[k]||[]);
      });
      return lista.find(function(x){return x.nombre===nombre;});
    }
    function agregar(nombre){
      var obj=buscar(nombre);
      if(!obj)return;
      var representacion=nombre+(obj.du?' (DU '+obj.du+')':'');
      if(!resultado.includes(representacion))resultado.push(representacion);
    }
    ['arma','armadura','escudo'].forEach(function(tipo){
      if(perfil[tipo]&&perfil[tipo].length)
        agregar(escoger(perfil[tipo],rng));
    });
    (perfil.fijos||[]).forEach(agregar);
    return resultado;
  }
  function seguidorNd20(config,rng){
    config=config||{};rng=rng||Math.random;
    var tipo=config.tipo||'';
    var oficio=tipo?SEGUIDORES_DRS.find(function(x){return x.nombre===tipo;}):
      SEGUIDORES_DRS[Math.floor(rng()*SEGUIDORES_DRS.length)];
    if(!oficio)throw Error('El tipo de seguidor no está en la tabla DRS.');
    var nivel=config.nivel!==undefined?nivelExacto(config,30):
      nivelAleatorio(config.nivelMin===undefined?1:config.nivelMin,
        config.nivelMax===undefined?1:config.nivelMax,rng,30);
    var genero=sexoApi?sexoApi.forma(config.sexo):
      (config.sexo==='masculino'||config.sexo==='femenino'?config.sexo:'aleatorio');
    if(genero==='aleatorio')genero=rng()<.5?'femenino':'masculino';
    var modoNombre=config.modoNombre||'generico';
    if(!['generico','ylat'].includes(modoNombre))
      throw Error('Lista de nombres de seguidor no válida.');
    var nombre=modoNombre==='ylat'?
      nombresApi?.ylat(config.componentesYlat,rng):
      nombresApi?.generico(config.nombresHistoricosYlat,rng);
    // Los nombres genéricos no tienen género inferido: el género se
    // determina por separado y nunca se inventan etimologías.
    if(!nombre)nombre='Seguidor';
    var atributos=['Ataque','Defensa'].map(function(nombre){
      var va=3+dado(6,rng);
      return {nombre:nombre,valor:va,dificultad:20-va,favorito:false};
    });
    // Adaptación solicitada para La Forja: una oportunidad de mejora de
    // ambos Atributos simplificados al alcanzar Niveles 4, 8, 12...
    // Se conserva la tirada contra VA y el tope 18 del avance de PJ.
    for(var hito=4;hito<=nivel;hito+=4){
      atributos.forEach(function(a){
        if(a.valor<18&&dado(20,rng)>a.valor){
          a.valor++;a.dificultad=20-a.valor;
        }
      });
    }
    // Mismo tratamiento de Salud por Nivel que el PJ: primer dado al
    // máximo, dados posteriores y aumento fijo documentado desde Nivel 12.
    var salud=oficio.dado;
    for(var n=2;n<=nivel;n++)
      salud+=n<12?dado(oficio.dado,rng):SALUD_ALTA[oficio.dado];
    var aventura=oficio.aventura;
    if(aventura==='Depende'){
      if(config.aventuras==='si')aventura='Sí';
      else if(config.aventuras==='no')aventura='No';
      else if(config.aventuras===undefined||config.aventuras==='aleatorio')
        aventura=rng()<.5?'Sí':'No';
      else throw Error('La disponibilidad para aventuras no es válida.');
    }
    // La tabla DRS mantiene claves estables (Mercenario, Mensajero...);
    // el JSON editorial recoge únicamente sus formas de presentación.
    var formas=config.catalogoSexo?.seguidores_profesiones_drs?.[oficio.nombre];
    var profesionVisible=formas?.[genero]||oficio.nombre;
    // El equipo propuesto es también el equipo en uso al generar la ficha.
    // Las funciones de consulta vuelven a verificar su posesión al pintar KPI.
    var inventario=equipoSeguidor(oficio.nombre,config.catalogoEquipo,rng);
    function equipadoEn(grupos){
      for(var grupo of grupos){
        var encontrado=(config.catalogoEquipo?.[grupo]||[]).find(function(item){
          return inventario.includes(item.nombre);
        });
        if(encontrado)return encontrado.nombre;
      }
      return '';
    }
    var armaduraEquipada=equipadoEn(['armaduras']);
    var escudoEquipado=equipadoEn(['escudos']);
    return {
      tipo_ficha:'seguidor_drs',juego:'Naufragio d20 · Fantasía',
      nombre:nombre,sexo:genero,profesion:oficio.nombre,
      profesion_mostrada:profesionVisible,
      descripcion:(genero==='femenino'?'Seguidora':'Seguidor')+' · '+profesionVisible,
      nivel:nivel,concepto:'',
      origen:'NaufragioD20DRS v1.1.12',atributos:atributos,
      recursos:[['Salud',salud+' (d'+oficio.dado+')'],['Moral',oficio.moral]],
      aventuras:aventura,
      competencias:[],capacidades:[],poderes:[],conjuros_preparados:[],
      equipo:inventario,arma_equipada:equipadoEn(['armas','varitas_defensa']),
      protecciones_equipadas:{armadura:armaduraEquipada,escudo:escudoEquipado},
      riqueza:oficio.precio+'/día',notas:[]
    };
  }
  function seguidorDH(datos, config, rng) {
    var nivel = clamp(Math.floor(Number(config.nivel) || 1), 1, 30);
    var origenes = Array.isArray(config.origenes) ? config.origenes.map(Number) : null;
    var key = config.ocupacion && datos.flw_classes[config.ocupacion] ?
      config.ocupacion : escogerEntradaPorOrigen(datos.flw_classes, origenes, rng);
    var prof = datos.flw_classes[key];
    var atributos = [dificultadDH(rng), dificultadDH(rng)];
    for (var i=0; i<2; i++) atributos[i] = clamp(atributos[i] - (Number(prof.attr[i]) || 0), 4, 19);
    for (var n=2; n<=nivel; n++) {
      var id = Math.floor(rng()*2);
      atributos[id] = subirDH(atributos[id], 1, rng);
    }
    var moral = Number(prof.mo) || 0;
    for (var m=2; m<=nivel; m++) if (dado(6,rng)+dado(6,rng)>moral) moral = Math.min(10,moral+1);
    return {
      juego:'Dungeon Hack · Seguidor',
      nombre:escoger(datos.flw_names || [],rng) || 'Seguidor',
      descripcion:prof.name, nivel:nivel, concepto:'',
      origen:datos.origins[prof.origin] || 'Dungeon Hack',
      atributos:['Ataque','Defensa'].map(function (n,i) {
        return {nombre:n,valor:20-atributos[i],dificultad:atributos[i],favorito:false};
      }),
      recursos:[['Salud',saludDH(Number(prof.hp)||4,nivel,rng)],
        ['Moral',moral],['Alineamiento',escoger(datos.aligns,rng)]],
      competencias:[], capacidades:prof.skills || [],
      equipo:(prof.equip || []).slice(),
      riqueza:(Number(prof.cost)||0) * Math.max(1,Math.floor(nivel/5)) + ' mc/día',
      notas:prof.outs ? [] : ['No acepta encargos fuera de zonas civilizadas.']
    };
  }
  function matriz(config,rng) {
    var juego=config.juego==='dh'?'Dungeon Hack':'Naufragio d20';
    var nombres=config.juego==='dh'?ATTR_DH:ATTR_ND;
    return {juego:juego+' · Matriz', nombre:'Matriz de Atributos',
      descripcion:'Seis valores iniciales', nivel:1, concepto:'', origen:juego,
      atributos:nombres.map(function(n) {
        var d = config.juego==='dh'?dificultadDH(rng):10+dado(6,rng);
        return {nombre:n,valor:20-d,dificultad:d,favorito:false};
      }),
      recursos:[], capacidades:[], competencias:[], equipo:[], notas:[], riqueza:''};
  }
  return {hash:hash, aleatorioSemilla:aleatorioSemilla, nivelAleatorio:nivelAleatorio,
    dado:dado, crearNd20:crearNd20,
    eleccionDH:eleccionDH, seguidorDH:seguidorDH,
    seguidorNd20:seguidorNd20,seguidoresDRS:seguidoresDRS,matriz:matriz};
});
