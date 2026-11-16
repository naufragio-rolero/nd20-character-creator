/* Capa de traducciones progresiva. El contenido reglamentario no se traduce automáticamente. */
(function(root){
  'use strict';
  var catalogos={},idiomaActual='es';
  function registrar(id,textos){
    if(!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(id)||!textos||typeof textos!=='object')
      throw Error('Catálogo de traducción incorrecto.');
    catalogos[id]=textos;
  }
  function t(clave,respaldo){return catalogos[idiomaActual]?.[clave]||respaldo||clave;}
  function aplicar(){
    if(typeof document==='undefined')return;
    document.documentElement.lang=idiomaActual;
    document.querySelectorAll('[data-i18n]').forEach(function(elemento){
      var cadena=catalogos[idiomaActual]?.[elemento.dataset.i18n];
      if(typeof cadena==='string')elemento.textContent=cadena;
    });
  }
  async function cargar(id){
    if(!catalogos[id]){
      if(!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(id))throw Error('Idioma incorrecto');
      var respuesta=await fetch('locales/'+id+'.json');
      if(!respuesta.ok)throw Error('Catálogo no disponible: '+id);
      registrar(id,await respuesta.json());
    }
    idiomaActual=id;aplicar();
  }
  root.NaufragioI18n={registrar:registrar,t:t,aplicar:aplicar,cargar:cargar,
    idioma:function(){return idiomaActual;}};
})(typeof globalThis!=='undefined'?globalThis:this);
