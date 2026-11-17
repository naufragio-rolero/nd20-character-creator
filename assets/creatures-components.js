/* Catálogo consultable de componentes de adversarios Nd20.
 * Identidad = fuente + registro de origen + ID documentado.
 * Las relaciones solo proceden de la matriz editorial verificada. */
(function(root,factory){
  var api=factory(typeof module!=='undefined'&&module.exports?
    require('./creatures.js'):root.NaufragioCriaturas);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioComponentesCriaturas=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(modelo){
  'use strict';
  function slug(s){
    return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  }
  function sinAcentos(s){return String(s||'').normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function hash(s){
    var h=2166136261;
    for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return (h>>>0).toString(16).padStart(8,'0');
  }
  function firma(tipo,d){
    if(tipo==='ataques')
      return JSON.stringify([d.nombre,d.cantidad,d.danoLiteral,d.danoNumerico,
        d.notas,d.segmentoOriginal,d.talentoRelacionado]);
    return JSON.stringify([d.nombre,d.descripcion,d.textoOriginal,d.referencia]);
  }
  function crearCatalogo(fuentes,plantillas,relaciones,criaturasPersonales,indiceTalentos){
    fuentes=fuentes||[];
    plantillas=plantillas||{ataques:[],talentos:[]};
    relaciones=relaciones||{version:1,sistema:'nd20',fuenteId:'drs',relaciones:[]};
    if(relaciones.version!==1||relaciones.sistema!=='nd20'||
       relaciones.fuenteId!=='drs'||!Array.isArray(relaciones.relaciones))
      throw Error('La matriz de relaciones documentadas no es compatible.');
    var entradas=[],mapa=new Map(),ataques=new Map(),talentos=new Map(),conexiones=new Map();
    var indice=new Map(),indexados=0;
    if(indiceTalentos!==undefined&&indiceTalentos!==null){
      if(indiceTalentos.version!==1||indiceTalentos.sistema!=='nd20'||
         indiceTalentos.fuenteId!=='drs'||!Array.isArray(indiceTalentos.registros))
        throw Error('Índice de Talentos DRS incompatible.');
      indiceTalentos.registros.forEach(function(r){
        if(!r||typeof r.criaturaId!=='string'||typeof r.nombre!=='string'||
           typeof r.talentoId!=='string'||!r.talentoId.trim())
          throw Error('Identidad documental de Talento incompleta.');
        var k=r.criaturaId+'|'+slug(r.nombre);
        if(indice.has(k))throw Error('Índice con Talento repetido: '+k);
        indice.set(k,r);
      });
    }
    function poner(entrada){
      if(mapa.has(entrada.id))throw Error('Identificador de componente duplicado: '+entrada.id);
      mapa.set(entrada.id,entrada);entradas.push(entrada);
    }
    fuentes.forEach(function(f){
      if(!f||!f.info||!f.info.id||!Array.isArray(f.registros))
        throw Error('Fuente de componentes incompatible.');
      f.registros.forEach(function(r){
        if(!r||!r.id||!r.ficha)throw Error('Ficha de origen incompatible.');
        (r.ficha.ataques||[]).forEach(function(a){
          if(!a.id)throw Error('Ataque oficial sin ID en '+r.id);
          var id=f.info.id+':'+a.id;
          var e={id:id,tipo:'ataques',dato:modelo.ataque(a),fuenteId:f.info.id,
            fuente:f.info.titulo,origen:f.info.origen,criatura:r.nombre,
            criaturaId:r.id,oficial:true};
          poner(e);ataques.set(f.info.id+'|'+r.id+'|'+a.id,e);
        });
        (r.ficha.talentos||[]).forEach(function(t){
          var id=f.info.id+':'+r.id+':talento:'+slug(t.nombre);
          var meta=f.info.id==='drs'?indice.get(r.id+'|'+slug(t.nombre)):null;
          if(indiceTalentos&&f.info.id==='drs'&&(!meta||meta.nombre!==t.nombre))
            throw Error('Talento DRS sin correspondencia editorial: '+id);
          if(meta)indexados++;
          // El ID del catálogo existente permanece intacto: no rompe
          // personajes guardados previamente ni exportaciones JSON v1.
          var e={id:id,tipo:'talentos',dato:modelo.talento(t),fuenteId:f.info.id,
            fuente:f.info.titulo,origen:f.info.origen,criatura:r.nombre,
            criaturaId:r.id,oficial:true,
            talentoFuenteId:meta?meta.talentoId:null,
            categoriaEditorial:meta?meta.categoriaEditorial:null,
            subcategoriaEditorial:meta?meta.subcategoriaEditorial:null};
          poner(e);talentos.set(id,e);
        });
      });
    });
    if(indiceTalentos&&indexados!==indice.size)
      throw Error('El índice DRS incluye Talentos ajenos a las fichas publicadas.');
    ['ataques','talentos'].forEach(function(tipo){
      (plantillas[tipo]||[]).forEach(function(item){
        var dato=tipo==='ataques'?modelo.ataque(item):modelo.talento(item);
        // Los JSON personales antiguos no tienen ID de catálogo. Su huella
        // depende del contenido íntegro, nunca solamente del nombre.
        var id='personal:'+tipo+':'+hash(firma(tipo,dato));
        if(mapa.has(id)){
          if(firma(tipo,mapa.get(id).dato)!==firma(tipo,dato))
            throw Error('Colisión de identificador personal; no se han unido entradas.');
          return;
        }
        poner({id:id,tipo:tipo,dato:dato,fuenteId:'personal',
          fuente:'Creación propia',origen:'Personal',criatura:'',criaturaId:'',
          oficial:false});
      });
    });
    // Las fichas propias ya guardadas también son componentes reutilizables,
    // sin crear una copia de la biblioteca ni modificar sus datos originales.
    (criaturasPersonales||[]).forEach(function(registro){
      if(!registro||!registro.id||!registro.ficha)return;
      ['ataques','talentos'].forEach(function(tipo){
        (registro.ficha[tipo]||[]).forEach(function(item,indice){
          var dato=tipo==='ataques'?modelo.ataque(item):modelo.talento(item);
          if(!dato.nombre.trim())return;
          var id='personal:criatura:'+registro.id+':'+tipo+':'+
            (tipo==='ataques'&&dato.id?slug(dato.id):slug(dato.nombre)+'-'+hash(firma(tipo,dato)));
          // Fichas antiguas podrían contener dos segmentos con el mismo ID.
          if(mapa.has(id))id+='-'+indice;
          poner({id:id,tipo:tipo,dato:dato,fuenteId:'personal',
            fuente:'Bestiario personal',origen:'Personal',
            criatura:registro.ficha.nombre,criaturaId:registro.id,oficial:false});
        });
      });
    });
    var pares=new Set();
    relaciones.relaciones.forEach(function(rel){
      if(!rel||typeof rel.criaturaId!=='string'||
         typeof rel.ataqueId!=='string'||typeof rel.talentoId!=='string'||
         !rel.evidencia||typeof rel.evidencia.valor!=='string')
        throw Error('Relación sin evidencia documental.');
      var a=ataques.get(relaciones.fuenteId+'|'+rel.criaturaId+'|'+rel.ataqueId);
      var t=talentos.get(rel.talentoId);
      if(!a||!t||a.criaturaId!==t.criaturaId||a.fuenteId!==t.fuenteId)
        throw Error('Relación entre componentes inexistentes: '+rel.ataqueId);
      if(indiceTalentos&&rel.talentoFuenteId!==t.talentoFuenteId)
        throw Error('La relación no apunta al ID de Talento verificado: '+rel.ataqueId);
      if((rel.evidencia.campo==='ataques.talentoRelacionado'&&
          a.dato.talentoRelacionado!==rel.evidencia.valor)||
         (rel.evidencia.campo==='talentos.textoOriginal'&&
          t.dato.textoOriginal!==rel.evidencia.valor)||
         !['ataques.talentoRelacionado','talentos.textoOriginal']
          .includes(rel.evidencia.campo))
        throw Error('Evidencia de relación desactualizada: '+rel.ataqueId);
      var par=a.id+'|'+t.id;
      if(pares.has(par))throw Error('Relación editorial duplicada: '+par);
      pares.add(par);
      [ [a.id,t.id], [t.id,a.id] ].forEach(function(v){
        if(!conexiones.has(v[0]))conexiones.set(v[0],[]);
        conexiones.get(v[0]).push(v[1]);
      });
    });
    function relacionados(id){
      return (conexiones.get(id)||[]).map(function(i){return mapa.get(i);});
    }
    function filtrar(tipo,op){
      op=op||{};
      var texto=sinAcentos(op.texto||'').trim();
      return entradas.filter(function(e){
        if(e.tipo!==tipo||op.fuenteId&&e.fuenteId!==op.fuenteId||
           op.origen&&e.origen!==op.origen||
           op.categoriaEditorial&&e.categoriaEditorial!==op.categoriaEditorial||
           op.soloRelacionados&&!relacionados(e.id).length)return false;
        if(!texto)return true;
        var d=e.dato;
        return sinAcentos([d.nombre,d.descripcion,d.notas,d.segmentoOriginal,
          d.textoOriginal,d.danoLiteral,e.criatura,e.fuente,e.origen,
          e.talentoFuenteId,e.categoriaEditorial,e.subcategoriaEditorial]
          .filter(Boolean).join(' ')).includes(texto);
      });
    }
    function preparar(entrada,esPrimero){
      var d=entrada.tipo==='ataques'?modelo.ataque(entrada.dato):
        modelo.talento(entrada.dato);
      if(entrada.tipo==='ataques'){
        d.id='';d.conectorAnterior=esPrimero?'Inicio':
          (['y','o',','].includes(d.conectorAnterior)?d.conectorAnterior:'y');
      }
      d.catalogoId=entrada.id;
      d.fuenteId=entrada.fuenteId;
      return d;
    }
    function yaExiste(entrada,actuales){
      return (actuales||[]).some(function(d){
        if(d.catalogoId&&d.catalogoId===entrada.id)return true;
        if(d.catalogoId&&d.catalogoId!==entrada.id&&
           !(entrada.fuenteId==='personal'&&d.fuenteId==='personal'))return false;
        if(d.fuenteId&&d.fuenteId!==entrada.fuenteId)return false;
        return firma(entrada.tipo,d)===firma(entrada.tipo,entrada.dato);
      });
    }
    return {listar:function(tipo){return entradas.filter(function(e){return e.tipo===tipo;});},
      obtener:function(id){return mapa.get(id)||null;},
      relacionados:relacionados,filtrar:filtrar,preparar:preparar,yaExiste:yaExiste,
      resumen:function(){return {ataques:entradas.filter(function(e){return e.tipo==='ataques';}).length,
        talentos:entradas.filter(function(e){return e.tipo==='talentos';}).length,
        relaciones:pares.size};}};
  }
  return {crearCatalogo:crearCatalogo,slug:slug};
});
