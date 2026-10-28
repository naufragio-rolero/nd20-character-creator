/* Generadores puros y deterministas: sin servidor ni dependencias. */
(function (root, factory) {
  var api = factory(typeof module !== 'undefined' && module.exports ?
    require('./equipment.js') : root.NaufragioEquipment,
    typeof module !== 'undefined' && module.exports ?
    require('./sex.js') : root.NaufragioSexo);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (equipoApi, sexoApi) {
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
    var nivel = clamp(Math.floor(Number(config.nivel) || 1), 1, 30);
    var especies = datos.especies, ocupaciones = datos.ocupaciones;
    var fuentes=datos.fuentes||{}, permitidas=Array.isArray(config.fuentes)?config.fuentes:null;
    function permitida(tipo,key){
      return !permitidas||permitidas.indexOf((fuentes[tipo]||{})[key]||'DRS')!==-1;
    }
    var esps=Object.keys(especies).filter(function(key){return permitida('especies',key);});
    var ocs=Object.keys(ocupaciones).filter(function(key){return permitida('ocupaciones',key);});
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
    if ((esp.talentos || []).indexOf('Buen desarrollo') !== -1) {
      var desarrollo = escoger(ATTR_ND, rng);
      at[desarrollo] = clamp(at[desarrollo] + 1, 4, 18);
      detalles.push('Buen desarrollo: +1 en ' + desarrollo + '.');
    }
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
      equipoApi.compraInicial(oc, ocupacion, config.juego, config.catalogoEquipo, presupuesto, rng, nivel) :
      {equipo:[],restante:presupuesto,notas:[
        'El inventario inicial requiere el catálogo de equipo contrastado.'
      ]};
    var equipo = compra.equipo.slice();
    detalles = detalles.concat(compra.notas);
    var recuerdo = escoger(esp.objetos_emocionales || [], rng);
    if (recuerdo) equipo.push(recuerdo + ' (recuerdo personal; sin precio de compra)');
    var tipo = config.juego === 'nd20_cifi' ? 'Naufragio d20 · CiFi' :
      config.juego === 'nd20_nocturna' ? 'Naufragio d20 · Nocturna' : 'Naufragio d20 · Fantasía';
    var capacidades = (esp.talentos || []).concat(oc.talentos || []);
    if (config.aplazarElecciones && config.juego === 'nd20' && ocupacion === 'Guerrero')
      capacidades = capacidades.filter(function(x){return x !== 'Brío musculoso' && x !== 'Sacrificio de escudo';});
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
    if (esp.debilidad) detalles.push('Debilidad de Especie: ' + esp.debilidad);
    var riqueza = esFantasia ? compra.restante+' mo restantes / '+presupuesto+' mo iniciales' :
      esCifi ? compra.restante+' cr restantes / '+presupuesto+' cr iniciales' : '';
    var poolNombres=(config.tesauroYlat && config.juego==='nd20' &&
      config.modoNombre!=='especie') ?
      config.tesauroYlat.entradas.filter(function(item) {
        return item.tipo===(config.modoNombre==='documentado'?'documentado':'combinado');
      }) : [];
    var nombreYlat=escoger(poolNombres,rng);
    var nombreConSexo=sexoFuente&&sexoApi?
      sexoApi.elegirNombre(config,especie,esp.nombres||[],poolNombres,sexo,sexoFuente,rng):null;
    if(nombreConSexo&&nombreConSexo.nota&&nombreConSexo.nota!=='Nombre elegido manualmente.')
      detalles.push(nombreConSexo.nota);
    if(sexoFuente&&coherencia&&sexo==='masculino'&&
      sexoFuente.especies_preferencia_femenino?.[especie])
      detalles.push('Varón excepcional de '+especie+
        ': posibilidad excepcional reconocida por su descripción de Especie.');
    if(sexoFuente&&sexoFuente.ocupaciones_contexto_femenino?.[ocupacion]&&
      sexo==='masculino'&&!coherencia)
      detalles.push('Excepción narrativa elegida: '+ocupacion+
        ' se describe en femenino, pero el manual no declara prohibición mecánica.');
    return {
      juego:tipo, nombre:(nombreConSexo&&nombreConSexo.nombre)||
        config.nombre || (nombreYlat&&nombreYlat.nombre) ||
        escoger(esp.nombres || [],rng) || 'Sin nombre', sexo:sexo,
      descripcion:ocupacion + ' · ' + especie, nivel:nivel,
      concepto:escoger(conceptos, rng) || 'Aventurero',
      atributos:paresAtributos(ATTR_ND.map(function (a) {return at[a];}), ATTR_ND, favorito),
      recursos:[['Salud', salud + ' (d' + dadoSalud + ')'],
        ['Esfuerzo', esfuerzo], ['Movimiento', esp.movimiento]].concat(
          esp.esencia ? [['Esencia', esp.esencia]] : []),
      capacidades:capacidades,
      competencias:(oc.competencias || []).slice(), equipo:equipo, origen:tipo,
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
    var valores = Object.keys(entries).filter(function(k) {
      return !origenes || !origenes.length || origenes.indexOf(Number(entries[k].origin)) !== -1;
    });
    if (!valores.length) throw Error('No hay entradas para los orígenes elegidos');
    return escoger(valores, rng);
  }
  function eleccionDH(datos, config, rng) {
    var origenes = Array.isArray(config.origenes) ? config.origenes.map(Number) : null;
    var clases = datos.classes;
    if(config.ocupacion&&clases[config.ocupacion]&&origenes&&
      origenes.indexOf(Number(clases[config.ocupacion].origin))===-1)
      throw Error('La Clase elegida no pertenece a las procedencias permitidas.');
    var claseKey = config.ocupacion && clases[config.ocupacion] ?
      config.ocupacion : escogerEntradaPorOrigen(clases, origenes, rng);
    var clase = clases[claseKey], nivel = clamp(Math.floor(Number(config.nivel) || 1), 1, 36);
    var favor = escoger(clase.attr, rng);
    var atributos = ATTR_DH.map(function(){return dificultadDH(rng);});
    var tieneRaza = config.conEspecie !== false && !clase.is_race;
    var especie = null;
    if (tieneRaza) {
      var razas = Object.keys(datos.races).filter(function (k) {
        var r = datos.races[k];
        return (!config.especie || k === config.especie) &&
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
  function mazmorra(config,rng) {
    var ancho=clamp(Math.floor(Number(config.ancho)||6),3,20);
    var alto=clamp(Math.floor(Number(config.alto)||6),3,20);
    var tipos=[['tile',75],['col',10],['trap',5],['furn',10]];
    var filas=[];
    for(var y=0;y<alto+2;y++){
      var fila=[];
      for(var x=0;x<ancho+2;x++){
        if(!y||!x||y===alto+1||x===ancho+1) fila.push('wall');
        else {
          var r = Math.floor(rng()*100),tipo='tile';
          for(var i=0;i<tipos.length;i++){r-=tipos[i][1];if(r<0){tipo=tipos[i][0];break;}}
          fila.push(tipo);
        }
      }
      filas.push(fila);
    }
    return filas;
  }
  return {hash:hash, aleatorioSemilla:aleatorioSemilla, dado:dado, crearNd20:crearNd20,
    eleccionDH:eleccionDH, seguidorDH:seguidorDH, matriz:matriz, mazmorra:mazmorra};
});
