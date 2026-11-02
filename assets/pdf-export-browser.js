/* Integración aislada de la ficha A5 de Fantasía Épica.
 * Solo recursos del mismo origen. No CDN, cambios de reglas ni acceso a iconografía.
 * Las bibliotecas y la fuente se preparan previamente con scripts/preparar-vendor-pdf-a5.cjs.
 */
(function(root){
  'use strict';
  var biblioteca=null;
  var recursos=null;
  var RUTA='assets/';
  function obtener(url){
    return fetch(url,{cache:'force-cache'}).then(function(response){
      if(!response.ok)throw Error('Recurso PDF A5 no disponible: '+url+' ('+response.status+').');
      return response;
    });
  }
  function cargarScript(url,nombre){
    if(root[nombre])return Promise.resolve(root[nombre]);
    return new Promise(function(resolve,reject){
      var elemento=document.createElement('script');
      elemento.src=url;elemento.async=true;
      elemento.onload=function(){
        if(root[nombre])resolve(root[nombre]);
        else reject(Error('No se ha inicializado '+nombre+'.'));
      };
      elemento.onerror=function(){reject(Error('No se pudo cargar el módulo local '+url+'.'));};
      document.head.appendChild(elemento);
    });
  }
  function bibliotecas(){
    if(!biblioteca){
      biblioteca=cargarScript(RUTA+'vendor/pdf-lib.min.js','PDFLib')
        .then(function(){
          return cargarScript(RUTA+'vendor/fontkit.umd.min.js','fontkit');
        })
        .catch(function(error){biblioteca=null;throw error;});
    }
    return biblioteca;
  }
  function archivos(){
    if(!recursos){
      recursos=Promise.all([
        obtener(RUTA+'pdf-a5/forja-fantasia-epica-a5.pdf').then(function(r){return r.arrayBuffer();}),
        obtener(RUTA+'pdf-a5/forja-continuacion-a5.pdf').then(function(r){return r.arrayBuffer();}),
        obtener(RUTA+'pdf-a5/campos-ficha-a5.json').then(function(r){return r.json();}),
        obtener(RUTA+'pdf-a5/SourceSerif4_400Regular.ttf').then(function(r){return r.arrayBuffer();})
      ]).then(function(a){
        return {plantilla:a[0],continuacion:a[1],mapa:a[2],fontBytes:a[3]};
      }).catch(function(error){recursos=null;throw error;});
    }
    return recursos;
  }
  function filename(personaje){
    var fragmento=String(personaje.nombre||'personaje').normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-')
      .replace(/^-+|-+$/g,'').slice(0,55);
    return 'naufragio-d20-'+(fragmento||'personaje')+'-A5.pdf';
  }
  async function exportar(personaje,consultaBlindaje){
    if(!personaje||personaje.juego!=='Naufragio d20 · Fantasía')
      throw Error('El PDF A5 está disponible solo para personajes de Fantasía.');
    if(!root.NaufragioPdfExport||typeof root.NaufragioPdfExport.exportar!=='function')
      throw Error('No se ha cargado el motor de exportación PDF A5.');
    var recursosDisponibles=await Promise.all([bibliotecas(),archivos()]);
    var opciones=Object.assign({},recursosDisponibles[1],{
      PDFLib:root.PDFLib,fontkit:root.fontkit,
      consultarBlindaje:function(){return consultaBlindaje;}
    });
    var resultado=await root.NaufragioPdfExport.exportar(personaje,opciones);
    if(!(resultado.bytes&&resultado.bytes.length&&resultado.paginas>=1))
      throw Error('La composición PDF no produjo un documento válido.');
    var url=URL.createObjectURL(new Blob([resultado.bytes],{type:'application/pdf'}));
    var enlace=document.createElement('a');
    enlace.href=url;enlace.download=filename(personaje);
    document.body.appendChild(enlace);enlace.click();enlace.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},30000);
    return resultado.paginas;
  }
  root.NaufragioPdfBrowser={exportar:exportar,filename:filename};
})(typeof window!=='undefined'?window:this);
