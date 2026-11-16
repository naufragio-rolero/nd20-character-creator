/* Iconografia editorial de Adversarios: 16 categorias reglamentarias, 12 simbolos.
 * No modifica ni infiere reglas, especies, subtipos ni fichas exportadas. */
(function(root,factory){
  var api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.NaufragioCategoriasAdversarios=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  var grupos=Object.freeze({
    aberrante:{archivo:'categoria-aberrante.svg',tinta:'#7a328f',brillo:'#dda3f2'},
    automata:{archivo:'categoria-automata.svg',tinta:'#186883',brillo:'#88d8ed'},
    bestia:{archivo:'categoria-bestia.svg',tinta:'#477326',brillo:'#b5d783'},
    celestial:{archivo:'categoria-celestial.svg',tinta:'#8b641b',brillo:'#ffe0a0'},
    demonio:{archivo:'categoria-demonio.svg',tinta:'#a12f46',brillo:'#ff8fa1'},
    dragon:{archivo:'categoria-dragon.svg',tinta:'#9b4d1c',brillo:'#f9b079'},
    elemental:{archivo:'categoria-elemental.svg',tinta:'#176e7e',brillo:'#8bdee5'},
    fata:{archivo:'categoria-fata.svg',tinta:'#9b477f',brillo:'#efb5e0'},
    humanoide:{archivo:'categoria-humanoide.svg',tinta:'#70563f',brillo:'#e5cfac'},
    monstruo:{archivo:'categoria-monstruo.svg',tinta:'#60479f',brillo:'#bdaaf5'},
    'muerto-viviente':{archivo:'categoria-muerto-viviente.svg',tinta:'#4c567e',brillo:'#c1c9e9'},
    vegetal:{archivo:'categoria-vegetal.svg',tinta:'#287347',brillo:'#8bd9a6'}
  });
  var familias=Object.freeze({
    aberrante:'aberrante',
    alimana:'bestia',bestia:'bestia',reptil:'bestia',
    automata:'automata',celestial:'celestial',demonio:'demonio',
    dragon:'dragon',elemental:'elemental',fata:'fata',
    gigante:'humanoide',humanoide:'humanoide',
    limo:'monstruo',monstruo:'monstruo',
    'muerto viviente':'muerto-viviente',vegetal:'vegetal'
  });
  function normalizar(categoria){
    return String(categoria||'').trim().normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
  }
  function obtener(categoria){
    var familia=familias[normalizar(categoria)];
    if(!familia)return null;
    var grupo=grupos[familia];
    return {familia:familia,archivo:grupo.archivo,tinta:grupo.tinta,brillo:grupo.brillo};
  }
  return {obtener:obtener,familias:familias,grupos:grupos};
});
