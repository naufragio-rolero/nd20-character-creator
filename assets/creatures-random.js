/* Generación combinatoria de adversarios con componentes existentes.
 * No inventa Ataques, Talentos, daños, asociaciones ni fichas de origen.
 * Las restricciones son opciones editoriales, NO reglas nuevas del DRS. */
(function(root,factory){
  var api=factory(
    typeof module!=='undefined'&&module.exports?require('./creatures.js'):root.NaufragioCriaturas,
    typeof module!=='undefined'&&module.exports?require('./rules.js'):root.NaufragioRules);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioGeneradorAdversarios=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(modelo,reglas){
  'use strict';
  if(!modelo||!reglas||typeof reglas.aleatorioSemilla!=='function')
    throw Error('Faltan el modelo o el generador de semillas de La Forja.');
  var MODOS=['restringido','libre'];
  var CONECTORES=['o','y'];
  function validarOpciones(op){
    if(!op||typeof op!=='object')throw Error('Indica la configuración del adversario.');
    if(!Number.isSafeInteger(op.nivelMin)||!Number.isSafeInteger(op.nivelMax)||
       op.nivelMin<0||op.nivelMax>100||op.nivelMin>op.nivelMax)
      throw Error('El rango de Nivel debe estar entre 0 y 100, en orden.');
    if(!Array.isArray(op.categorias)||!op.categorias.length||
       op.categorias.some(function(c){return !modelo.CATEGORIAS.includes(c);})||
       new Set(op.categorias).size!==op.categorias.length)
      throw Error('Selecciona al menos una categoría oficial sin duplicados.');
    if(!MODOS.includes(op.modo))throw Error('Modo de mezcla no admitido.');
    if(!CONECTORES.includes(op.conector))
      throw Error('Elige si las Acciones se combinan con «o» o «y».');
    if(!Number.isSafeInteger(op.acciones)||op.acciones<0||op.acciones>8||
       !Number.isSafeInteger(op.talentos)||op.talentos<0||op.talentos>8||
       op.acciones+op.talentos===0)
      throw Error('Elige entre 0 y 8 Acciones y Talentos (al menos uno).');
    if(typeof op.semilla!=='string'||!op.semilla.trim()||op.semilla.length>128)
      throw Error('La semilla debe tener entre 1 y 128 caracteres.');
  }
  function extraerFuentes(fuentes,personales){
    var categorias=new Map(),morales=new Map();
    function registrar(id,categoria,moral){
      if(!modelo.CATEGORIAS.includes(categoria))return;
      categorias.set(id,categoria);
      if(Number.isSafeInteger(moral)&&moral>=5&&moral<=12){
        if(!morales.has(categoria))morales.set(categoria,[]);
        morales.get(categoria).push(moral);
      }
    }
    (fuentes||[]).forEach(function(f){
      if(!f||!f.info||!Array.isArray(f.registros))return;
      f.registros.forEach(function(r){
        if(r&&r.ficha)registrar(f.info.id+'|'+r.id,r.ficha.categoria,
          r.ficha.puntuaciones&&r.ficha.puntuaciones.moral);
      });
    });
    (personales||[]).forEach(function(r){
      if(r&&r.ficha)registrar('personal|'+r.id,r.ficha.categoria,
        r.ficha.puntuaciones&&r.ficha.puntuaciones.moral);
    });
    return {categorias:categorias,morales:morales};
  }
  function elegir(lista,rng){return lista[Math.floor(rng()*lista.length)];}
  function muestrear(lista,n,rng){
    if(n>lista.length)throw Error('No hay suficientes componentes únicos en el catálogo.');
    var pendientes=lista.slice(),salida=[];
    for(var i=0;i<n;i++){
      var indice=Math.floor(rng()*pendientes.length);
      salida.push(pendientes.splice(indice,1)[0]);
    }
    return salida;
  }
  function generar(catalogo,fuentes,personales,op){
    validarOpciones(op);
    if(!catalogo||typeof catalogo.listar!=='function'||
       typeof catalogo.preparar!=='function')
      throw Error('La biblioteca de componentes no está preparada.');
    var referencias=extraerFuentes(fuentes,personales);
    var listados={ataques:catalogo.listar('ataques'),talentos:catalogo.listar('talentos')};
    var elegibles=op.categorias.map(function(categoria){
      var porTipo={};
      ['ataques','talentos'].forEach(function(tipo){
        porTipo[tipo]=op.modo==='libre'?listados[tipo]:listados[tipo].filter(function(e){
          return referencias.categorias.get(e.fuenteId+'|'+e.criaturaId)===categoria;
        });
      });
      return {categoria:categoria,pools:porTipo};
    }).filter(function(c){
      return c.pools.ataques.length>=op.acciones&&c.pools.talentos.length>=op.talentos;
    });
    if(!elegibles.length)
      throw Error('No hay suficientes Acciones y Talentos de las categorías elegidas. '+
        'Reduce las cantidades, amplía las categorías o usa mezcla libre.');
    var rng=reglas.aleatorioSemilla(op.semilla);
    var seleccion=elegir(elegibles,rng);
    var categoria=seleccion.categoria;
    var nivel=op.nivelMin+Math.floor(rng()*(op.nivelMax-op.nivelMin+1));
    var morales=referencias.morales.get(categoria)||[];
    // La Moral no se inventa: se toma de registros de la misma categoría.
    // El DRS excluye de Moral a autómatas y muertos vivientes.
    var moral=categoria==='Autómata'||categoria==='Muerto viviente'||!morales.length?
      null:elegir(morales,rng);
    var selecciones={};
    ['ataques','talentos'].forEach(function(tipo){
      selecciones[tipo]=muestrear(seleccion.pools[tipo],
        tipo==='ataques'?op.acciones:op.talentos,rng);
    });
    var ataques=selecciones.ataques.map(function(e,i){
      var a=catalogo.preparar(e,i===0);
      a.id='ataque-generado-'+(i+1);
      a.conectorAnterior=i===0?'Inicio':op.conector;
      return a;
    });
    var talentos=selecciones.talentos.map(function(e){
      return catalogo.preparar(e,false);
    });
    var nota='Generado en La Forja · semilla: '+op.semilla+
      ' · Nivel: '+op.nivelMin+'–'+op.nivelMax+
      ' · Categorías: '+op.categorias.join(', ')+
      ' · modo: '+op.modo+' · Acciones: '+op.acciones+
      ' · Talentos: '+op.talentos+' · conector: '+op.conector+
      '. Combinación editorial; no es una ficha oficial.';
    var ficha=modelo.nuevaCriatura({
      nombre:categoria+' aleatorio · '+op.semilla.slice(0,18),
      categoria:categoria,
      puntuaciones:{nivel:nivel,salud:modelo.saludMedia(nivel,0),moral:moral},
      saludModo:'automatico',saludAjuste:0,
      ataques:ataques,talentos:talentos,notas:nota,
      origen:{tipo:'usuario',textoOriginal:''}
    });
    var revision=modelo.revisar(ficha,{paraExportar:true});
    if(!revision.valida)
      throw Error('El borrador generado no supera el modelo: '+
        revision.errores.map(function(e){return e.campo;}).join(', '));
    return {ficha:ficha,semilla:op.semilla,
      componentes:{ataques:selecciones.ataques.map(function(e){return e.id;}),
        talentos:selecciones.talentos.map(function(e){return e.id;})},
      categoriasDisponibles:elegibles.map(function(c){return c.categoria;}),
      advertencias:revision.advertencias};
  }
  return {generar:generar,validarOpciones:validarOpciones,MODOS:MODOS.slice()};
});
