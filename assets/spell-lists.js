/* Listas de Conjuros de La Forja: modelo puro sobre el catálogo DRS existente. */
(function(root,factory){
  var api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NaufragioListasConjuros=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  var ESQUEMA="naufragio.listas-conjuros/v1", PREFIJO="usuario:";
  function error(s){throw Error(s);}
  function texto(s,limite,etiqueta){
    if(typeof s!=="string")error(etiqueta+" debe ser texto.");
    s=s.normalize("NFC").trim();
    if(!s||s.length>limite||/[\u0000-\u001F\u007F]/.test(s))
      error(etiqueta+" vacío, excesivo o con caracteres de control.");
    return s;
  }
  function objeto(x){return !!x&&typeof x==="object"&&!Array.isArray(x);}
  function idPersonal(x){return typeof x==="string"&&/^usuario:[a-zA-Z0-9_-]{8,80}$/.test(x);}
  function crearCatalogo(drs,legacy){
    if(!objeto(drs)||drs.esquema!=="naufragio.conjuros-drs/v1"||!Array.isArray(drs.conjuros))
      error("Catálogo documental DRS inválido.");
    if(!objeto(legacy)||!Array.isArray(legacy.conjuros)||!objeto(legacy.listas_drs))
      error("Falta el catálogo base de La Forja.");
    var existentes=new Map(legacy.conjuros.filter(function(s){return s.origen==="Nd20";}).map(function(s){return [s.id,s];}));
    var nombres=new Map(),ids=new Set();
    var spells=drs.conjuros.map(function(s){
      var antes=existentes.get(s.id);
      if(!antes||antes.nombre!==s.nombre||antes.circulo!==s.circulo||
        !antes.escuelas.includes(s.escuela)||ids.has(s.id)||nombres.has(s.nombre))
        error("Conjuro DRS no reconciliado con el catálogo existente: "+s.nombre);
      if(!Number.isInteger(s.circulo)||s.circulo<1||s.circulo>8||!s.texto_normativo||!s.efectos)
        error("Ficha DRS incompleta: "+s.nombre);
      ids.add(s.id);nombres.set(s.nombre,s);
      return Object.assign({},s,{listas_oficiales:[]});
    });
    if(spells.length!==existentes.size||spells.length!==64)
      error("Cobertura DRS incompleta respecto al catálogo existente.");
    var porNombre=new Map(spells.map(function(s){return [s.nombre,s];})),oficiales=[];
    ["Clérigo","Mago"].forEach(function(nombre){
      var fuente=legacy.listas_drs[nombre];
      if(!objeto(fuente))error("Falta la lista DRS "+nombre);
      var referencias=[];
      Object.entries(fuente).forEach(function(par){
        var circulo=Number(par[0]);
        if(!Number.isInteger(circulo)||!Array.isArray(par[1]))error("Lista DRS inválida.");
        par[1].forEach(function(s){
          var hechizo=porNombre.get(s);
          if(!hechizo||hechizo.circulo!==circulo||referencias.includes(hechizo.id))
            error("Lista oficial desincronizada: "+nombre+" / "+s);
          referencias.push(hechizo.id);
          hechizo.listas_oficiales.push(nombre);
        });
      });
      oficiales.push({id:"drs:"+nombre,nombre:"Lista del "+nombre,
        descripcion:"Lista oficial del "+nombre+" del DRS.",conjuros:referencias,
        maxCirculo:8,tipo:"oficial",estado:"aprobado",fuente:drs.documento});
    });
    return {versionDRS:drs.version_drs,conjuros:spells,
      porId:new Map(spells.map(function(s){return [s.id,s];})),
      oficiales:oficiales};
  }
  function leerBorradores(data,catalogo){
    if(!objeto(data)||!Array.isArray(data.listas)||!Array.isArray(data.progresiones))
      error("Borradores editoriales inválidos.");
    var propuestas=data.listas.map(function(b){
      if(!/^propuesta:[a-z0-9-]+$/.test(b.id))error("Identificador de propuesta incorrecto.");
      var copia=validarLista(b,catalogo,{propuesta:true});
      return Object.assign({},copia,{tipo:"propuesta",estado:b.estado,fuente:b.fuente});
    });
    var progresiones=data.progresiones.map(function(p){
      return Object.assign({},validarProgresion(p),{tipo:"propuesta",fuente:p.fuente,estado:p.estado});
    });
    return {listas:propuestas,progresiones:progresiones};
  }
  function validarLista(d,catalogo,opts){
    opts=opts||{};
    if(!objeto(d))error("Lista incorrecta.");
    if(!opts.propuesta&&!idPersonal(d.id))error("Identificador personal inválido.");
    var nombre=texto(d.nombre,120,"Nombre"),descripcion=typeof d.descripcion==="string"?
      d.descripcion.normalize("NFC").trim():"";
    if(descripcion.length>2000||/[\u0000-\u0008\u000B-\u001F\u007F]/.test(descripcion))
      error("Descripción excesiva o incorrecta.");
    var max=d.maxCirculo===null||d.maxCirculo===undefined?8:Number(d.maxCirculo);
    if(!Number.isInteger(max)||max<1||max>8)error("Círculo máximo inválido.");
    if(!Array.isArray(d.conjuros)||d.conjuros.length>catalogo.conjuros.length)
      error("Número de Conjuros inválido.");
    var ids=new Set();
    d.conjuros.forEach(function(id){
      var s=catalogo.porId.get(id);
      if(!s)error("Conjuro desconocido o ajeno al DRS: "+id);
      if(s.circulo>max)error("Conjuro por encima del Círculo máximo: "+s.nombre);
      if(ids.has(id))error("Conjuro repetido: "+s.nombre);
      ids.add(id);
    });
    var resultado={id:d.id,nombre,descripcion,maxCirculo:max,conjuros:Array.from(ids)};
    // Campo opcional y retrocompatible con bibliotecas v1 preexistentes.
    // Únicamente puede identificar una Lista oficial que exista en el catálogo DRS.
    if(!opts.propuesta&&d.derivadaDe!==undefined){
      if(typeof d.derivadaDe!=="string"||
        !catalogo.oficiales.some(function(l){return l.id===d.derivadaDe;}))
        error("La procedencia debe señalar una Lista oficial del DRS.");
      resultado.derivadaDe=d.derivadaDe;
    }
    if(!opts.propuesta&&d.progresion!==undefined)
      resultado.progresion=validarTablaDeLista(d.progresion);
    return resultado;
  }
  function validarProgresion(p){
    if(!objeto(p)||typeof p.id!=="string"||!Array.isArray(p.niveles)||
      p.niveles.length!==30)error("Progresión incompleta: se requieren 30 Niveles.");
    var filas=p.niveles.map(function(f){
      if(!Array.isArray(f)||f.length!==8||f.some(function(x){return !Number.isInteger(x)||x<0||x>30;}))
        error("Progresión inválida: ocho Círculos y números enteros por Nivel.");
      return f.slice();
    });
    return {id:p.id,nombre:texto(p.nombre,120,"Progresión"),niveles:filas};
  }
  // Una tabla de Lista es independiente de las asociaciones de Ocupación.
  // No conceder Espacios sin selección explícita. Las tablas personales
  // reutilizan el validador existente de 30 Niveles y ocho Círculos.
  function validarTablaDeLista(p){
    if(!objeto(p)||typeof p.tipo!=="string")
      error("Formato de progresión de Lista inválido.");
    if(p.tipo==="oficial"){
      if(!["drs:Mago","drs:Clérigo"].includes(p.id))
        error("Progresión oficial desconocida.");
      return {tipo:"oficial",id:p.id};
    }
    if(p.tipo==="personal"){
      var validada=validarProgresion({id:"usuario:tabla",nombre:"Tabla personal",
        niveles:p.niveles});
      return {tipo:"personal",niveles:validada.niveles};
    }
    error("Tipo de progresión de Lista desconocido.");
  }
  function tablasDRS(data){
    if(!objeto(data)||!objeto(data.fantasia))
      error("Faltan las tablas oficiales de progreso del DRS.");
    var tablas={};
    ["Mago","Clérigo"].forEach(function(nombre){
      var origen=data.fantasia[nombre];
      if(!objeto(origen)||!Array.isArray(origen.columnas)||
        origen.columnas.join(",")!=="1,2,3,4,5,6,7,8")
        error("Tabla DRS sin los ocho Círculos: "+nombre);
      tablas["drs:"+nombre]=validarProgresion({
        id:"drs:"+nombre,nombre:"Progreso del "+nombre,
        niveles:origen.niveles
      });
    });
    return tablas;
  }
  function tablaDeLista(lista,tablas){
    if(!objeto(lista))error("Lista inexistente.");
    var seleccion=lista.tipo==="oficial"?
      {tipo:"oficial",id:lista.id}:lista.progresion;
    if(!seleccion)return null;
    var valida=validarTablaDeLista(seleccion);
    if(valida.tipo==="oficial"){
      if(!tablas||!tablas[valida.id])error("Tabla oficial no disponible.");
      return {tipo:"oficial",id:valida.id,
        niveles:tablas[valida.id].niveles.map(function(f){return f.slice();})};
    }
    return valida;
  }
  function listasDisponibles(catalogo,borradores,biblioteca){
    return catalogo.oficiales.concat(borradores.listas,biblioteca.listas);
  }
  function validarBiblioteca(data,catalogo,borradores,progresiones){
    if(!objeto(data)||data.esquema!==ESQUEMA||data.version_drs!==catalogo.versionDRS||
      !Array.isArray(data.listas)||!Array.isArray(data.asociaciones))
      error("Archivo incompatible, o con versión del DRS distinta. No se han cambiado datos.");
    if(data.listas.length>200||data.asociaciones.length>200)error("Biblioteca demasiado grande.");
    var ocupadas=new Set(catalogo.oficiales.concat(borradores.listas).map(function(x){return x.id;})),listas=[];
    data.listas.forEach(function(p){
      var l=validarLista(p,catalogo);
      if(ocupadas.has(l.id))error("Lista duplicada o protegida: "+l.id);
      ocupadas.add(l.id);listas.push(l);
    });
    var progId=new Set(["drs:Mago","drs:Clérigo"].concat(borradores.progresiones.map(function(x){return x.id;})));
    var ocupaciones=new Set(),asociaciones=data.asociaciones.map(function(a){
      if(!objeto(a))error("Asociación incorrecta.");
      var ocupacion=texto(a.ocupacion,120,"Ocupación"),clave=ocupacion.toLocaleLowerCase("es");
      if(ocupaciones.has(clave))error("Ocupación asociada más de una vez.");
      if(!ocupadas.has(a.listaId))error("La Ocupación referencia una Lista inexistente.");
      if(a.progresionId!==null&&!progId.has(a.progresionId))
        error("Progresión no documentada: "+a.progresionId);
      ocupaciones.add(clave);
      return {ocupacion,listaId:a.listaId,progresionId:a.progresionId};
    });
    return {esquema:ESQUEMA,version_drs:catalogo.versionDRS,listas,asociaciones};
  }
  function vacia(catalogo){return {esquema:ESQUEMA,version_drs:catalogo.versionDRS,listas:[],asociaciones:[]};}
  function guardarLista(lib,d,catalogo,borradores){
    var l=validarLista(d,catalogo),n=validarBiblioteca(lib,catalogo,borradores);
    var a=n.listas.findIndex(function(x){return x.id===l.id;});
    if(a<0)n.listas.push(l);else n.listas[a]=l;
    return validarBiblioteca(n,catalogo,borradores);
  }
  function duplicarLista(lib,origen,id,nombre,catalogo,borradores){
    var obj=listasDisponibles(catalogo,borradores,lib).find(function(l){return l.id===origen;});
    if(!obj)error("Lista de origen inexistente.");
    var datos={id,nombre:nombre||obj.nombre+" (copia)",descripcion:obj.descripcion,
      conjuros:obj.conjuros.slice(),maxCirculo:obj.maxCirculo};
    // La copia siempre es personal. Conservar la procedencia oficial al clonarla.
    var procedencia=obj.tipo==="oficial"?obj.id:obj.derivadaDe;
    if(procedencia)datos.derivadaDe=procedencia;
    // Duplicar una Lista oficial conserva su tabla por referencia, y una
    // copia personal conserva su progresión sin vincularla a otros objetos.
    if(obj.tipo==="oficial")datos.progresion={tipo:"oficial",id:obj.id};
    else if(obj.progresion)datos.progresion=validarTablaDeLista(obj.progresion);
    return guardarLista(lib,datos,catalogo,borradores);
  }
  function eliminarLista(lib,id,catalogo,borradores){
    var n=validarBiblioteca(lib,catalogo,borradores);
    if(!n.listas.some(function(x){return x.id===id;}))error("Solo puedes eliminar listas personales.");
    if(n.asociaciones.some(function(a){return a.listaId===id;}))
      error("Desvincula primero las Ocupaciones que utilizan esta Lista.");
    n.listas=n.listas.filter(function(x){return x.id!==id;});return n;
  }
  function vincular(lib,ocupacion,listaId,progresionId,catalogo,borradores){
    var n=validarBiblioteca(lib,catalogo,borradores);
    ocupacion=texto(ocupacion,120,"Ocupación");progresionId=progresionId||null;
    n.asociaciones=n.asociaciones.filter(function(a){return a.ocupacion.toLocaleLowerCase("es")!==ocupacion.toLocaleLowerCase("es");});
    n.asociaciones.push({ocupacion,listaId,progresionId});
    return validarBiblioteca(n,catalogo,borradores);
  }
  function desvincular(lib,ocupacion,catalogo,borradores){
    var n=validarBiblioteca(lib,catalogo,borradores);
    n.asociaciones=n.asociaciones.filter(function(a){return a.ocupacion!==ocupacion;});
    return n;
  }
  function resolver(lib,ocupacion,nivel,catalogo,borradores,progresiones){
    var asoc=lib.asociaciones.find(function(x){return x.ocupacion===ocupacion;});
    if(!asoc)return null;
    var l=listasDisponibles(catalogo,borradores,lib).find(function(x){return x.id===asoc.listaId;});
    if(!l)error("Lista de Ocupación inexistente.");
    var tabla=null;
    if(asoc.progresionId&&asoc.progresionId.indexOf("drs:")===0)
      tabla=progresiones.fantasia[asoc.progresionId.slice(4)]?.niveles;
    else if(asoc.progresionId)
      tabla=borradores.progresiones.find(function(x){return x.id===asoc.progresionId;})?.niveles;
    if(!Number.isInteger(nivel)||nivel<1||nivel>30)error("Nivel fuera del rango documentado.");
    var fila=tabla?tabla[nivel-1]:null;
    var autorizados=l.conjuros.map(function(id){return catalogo.porId.get(id);});
    var disponibles=fila?autorizados.filter(function(s){return fila[s.circulo-1]>0;}):[];
    return {lista:l,ocupacion,nivel,espacios:fila?fila.slice():null,
      repertorio:autorizados,disponibles,
      advertencia:!fila?"Sin tabla de progresión: no se conceden Espacios ni lanzamientos.":
        fila.some(function(n,i){return n>0&&i+1>l.maxCirculo;})?
          "La progresión tiene Espacios para Círculos fuera de esta Lista; no amplían su repertorio.":""};
  }
  function exportar(lib,catalogo,borradores){
    return JSON.stringify(validarBiblioteca(lib,catalogo,borradores),null,2)+"\n";
  }
  function importar(textoJson,catalogo,borradores){
    if(typeof textoJson!=="string"||textoJson.length>1024*1024)error("Archivo de importación demasiado grande.");
    return validarBiblioteca(JSON.parse(textoJson),catalogo,borradores);
  }
  return {ESQUEMA,crearCatalogo,leerBorradores,validarLista,validarBiblioteca,
    vacia,guardarLista,duplicarLista,eliminarLista,vincular,desvincular,resolver,
    listasDisponibles,validarTablaDeLista,tablasDRS,tablaDeLista,exportar,importar};
});
