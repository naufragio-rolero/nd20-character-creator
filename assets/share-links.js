/* Enlaces portátiles de La Forja, sin almacenamiento remoto. */
(function(root,factory){var a=factory();if(typeof module==='object'&&module.exports)module.exports=a;root.NaufragioEnlaces=a;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
var LIMIT=12000,KINDS=['character','spell-list','adversary','tech','song'];
function validar(a){if(!a||Array.isArray(a)||a.version!==1||!KINDS.includes(a.tipo)||typeof a.sistema!=='string'||!/^[a-z0-9_-]{1,45}$/.test(a.sistema)||!a.datos||typeof a.datos!=='object'||Array.isArray(a.datos))throw Error('Enlace incompatible o sin datos.');return a;}
function codificar(tipo,sistema,datos){var raw=JSON.stringify(validar({version:1,tipo,sistema,datos}));var bytes=new TextEncoder().encode(raw);if(bytes.length>LIMIT)throw Error('El enlace supera el tamaño admitido. Utiliza Exportar JSON.');var s='';for(var i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decodificar(texto){if(typeof texto!=='string'||texto.length>LIMIT*2||! /^[a-zA-Z0-9_-]+$/.test(texto))throw Error('Código no válido.');var s=atob(texto.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-texto.length%4)%4));if(s.length>LIMIT)throw Error('Enlace demasiado grande.');var array=Uint8Array.from(s,function(x){return x.charCodeAt(0)});return validar(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(array)));}
function fragmento(){var m=location.hash.match(/^#share=([a-zA-Z0-9_-]+)$/);return m?m[1]:null;}
function crearUrl(ruta,token){var u=new URL(ruta,new URL(document.baseURI));u.hash='share='+token;return u.href;}
return {codificar,decodificar,fragmento,crearUrl};
});
