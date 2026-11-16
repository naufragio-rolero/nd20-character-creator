/* Enlaces portátiles: el fragmento lleva los datos, nunca es un ID remoto.
 * El importador de cada módulo valida el contenido antes de usarlo.
 */
(function(root,factory){
  var api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioEnlaces=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  var VERSION=1, MAX_JSON=18000, MAX_CODIFICADO=26000;
  var TIPOS=['characters-nd20','spells','adversaries'];
  var SISTEMAS=['nd20-epica','nd20-cifi','nd20-nocturna','nd20-futura','dungeon-hack'];
  function fallo(m){throw Error('Enlace de La Forja: '+m);}
  function utf8(texto){
    if(typeof TextEncoder==='undefined')fallo('el navegador no admite codificación UTF-8.');
    return new TextEncoder().encode(texto);
  }
  function bytesATexto(bytes){
    if(typeof TextDecoder==='undefined')fallo('el navegador no admite lectura UTF-8.');
    return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  }
  function binario(bytes){
    var trozos=[];
    for(var i=0;i<bytes.length;i+=8192)
      trozos.push(String.fromCharCode.apply(null,bytes.subarray(i,i+8192)));
    return trozos.join('');
  }
  function bytesBinarios(bin){
    var bytes=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    return bytes;
  }
  function codificarBase64(bytes){
    var base=typeof btoa==='function'?btoa(binario(bytes)):
      (typeof Buffer!=='undefined'?Buffer.from(bytes).toString('base64'):fallo('Base64 no disponible.'));
    return base.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decodificarBase64(texto){
    if(!/^[A-Za-z0-9_-]+$/.test(texto)||texto.length>MAX_CODIFICADO||texto.length%4===1)
      fallo('datos de URL demasiado largos o mal formados.');
    var base=texto.replace(/-/g,'+').replace(/_/g,'/');
    base+='='.repeat((4-base.length%4)%4);
    var bin=typeof atob==='function'?atob(base):
      (typeof Buffer!=='undefined'?Buffer.from(base,'base64').toString('binary'):fallo('Base64 no disponible.'));
    return bytesBinarios(bin);
  }
  function validarSobre(sobre,tipo){
    if(!sobre||typeof sobre!=='object'||Array.isArray(sobre)||
      Object.keys(sobre).sort().join('|')!=='contenido|sistema|tipo|version'||
      sobre.version!==VERSION||!TIPOS.includes(sobre.tipo)||
      !SISTEMAS.includes(sobre.sistema)||!sobre.contenido||
      typeof sobre.contenido!=='object'||Array.isArray(sobre.contenido))
      fallo('formato o versión de datos incompatible.');
    if(tipo&&tipo!==sobre.tipo)fallo('el enlace corresponde a otra herramienta.');
    return sobre;
  }
  function codificar(tipo,sistema,contenido){
    var sobre=validarSobre({version:VERSION,tipo,sistema,contenido});
    var json=JSON.stringify(sobre);
    var bytes=utf8(json);
    if(bytes.length>MAX_JSON)fallo('la ficha supera el límite de los enlaces portátiles; utiliza Exportar JSON.');
    return codificarBase64(bytes);
  }
  function decodificar(data,tipo){
    if(typeof data!=='string'||!data||data.length>MAX_CODIFICADO)
      fallo('identificador de datos ausente o demasiado largo.');
    var bytes=decodificarBase64(data);
    if(bytes.length>MAX_JSON)fallo('contenido demasiado grande.');
    var sobre;
    try{sobre=JSON.parse(bytesATexto(bytes));}
    catch(error){fallo('no contiene JSON UTF-8 válido.');}
    return validarSobre(sobre,tipo);
  }
  function leerDesdeHash(hash,tipo){
    if(!hash||hash==='#')return null;
    if(!hash.startsWith('#data='))return null;
    var data=hash.slice(6);
    return decodificar(data,tipo);
  }
  function enlace(base,tipo,sistema,contenido){
    var url=new URL(base);
    url.hash='data='+codificar(tipo,sistema,contenido);
    return url.href;
  }
  return {VERSION,MAX_JSON,TIPOS,SISTEMAS,codificar,decodificar,leerDesdeHash,enlace};
});
