/* Selector cromático horizontal común a los módulos de La Forja.
   El select nativo invisible mantiene los listeners históricos de app.js/portal.js. */
(function(){
  'use strict';
  var nombres={clasico:'Clásico',ebano:'Ébano',ceruleo:'Cerúleo',obsidiana:'Obsidiana',violeta:'Violeta'};
  var root=document.querySelector('[data-forja-temas]');
  if(!root)return;
  var boton=root.querySelector('.forja-temas-abrir');
  var menu=root.querySelector('.forja-temas-opciones');
  var select=root.querySelector('#selector-tema');
  var opciones=Array.from(root.querySelectorAll('[data-tema-opcion]'));
  if(!boton||!menu||!select||opciones.length!==5)return;
  function temaActual(){
    var valor=document.documentElement.dataset.tema;
    return Object.prototype.hasOwnProperty.call(nombres,valor)?valor:'clasico';
  }
  function sincronizar(){
    var tema=temaActual();
    root.dataset.temaActual=tema;
    select.value=tema;
    boton.querySelector('.forja-tema-nombre').textContent=nombres[tema];
    boton.setAttribute('aria-label','Cambiar tema visual. Actual: '+nombres[tema]);
    opciones.forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.temaOpcion===tema));});
  }
  function abrir(){
    menu.hidden=false;
    boton.setAttribute('aria-expanded','true');
    var actual=opciones.find(function(x){return x.dataset.temaOpcion===temaActual();});
    if(actual)actual.focus();
  }
  function cerrar(recuperarFoco){
    menu.hidden=true;
    boton.setAttribute('aria-expanded','false');
    if(recuperarFoco)boton.focus();
  }
  boton.addEventListener('click',function(){
    if(menu.hidden)abrir();else cerrar(false);
  });
  opciones.forEach(function(opcion){
    opcion.addEventListener('click',function(){
      var tema=opcion.dataset.temaOpcion;
      if(!Object.prototype.hasOwnProperty.call(nombres,tema))return;
      document.documentElement.dataset.tema=tema;
      select.value=tema;
      try{localStorage.setItem('forja-tema',tema);}catch(e){}
      select.dispatchEvent(new Event('change',{bubbles:true}));
      sincronizar();
      cerrar(true);
    });
  });
  select.addEventListener('change',function(){
    if(Object.prototype.hasOwnProperty.call(nombres,select.value)){
      document.documentElement.dataset.tema=select.value;
      try{localStorage.setItem('forja-tema',select.value);}catch(e){}
    }
    sincronizar();
  });
  document.addEventListener('pointerdown',function(event){
    if(!menu.hidden&&!root.contains(event.target))cerrar(false);
  });
  document.addEventListener('keydown',function(event){
    if(menu.hidden)return;
    if(event.key==='Escape'){event.preventDefault();cerrar(true);return;}
    var indice=opciones.indexOf(document.activeElement);
    if(indice>=0&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();
      var nuevo=event.key==='Home'?0:event.key==='End'?opciones.length-1:
        (indice+(event.key==='ArrowRight'?1:-1)+opciones.length)%opciones.length;
      opciones[nuevo].focus();
    }
  });
  document.addEventListener('focusin',function(event){
    if(!menu.hidden&&!root.contains(event.target))cerrar(false);
  });
  sincronizar();
})();
