/* Selector de tema de la portada; comparte la misma clave con las herramientas. */
(function(){'use strict';
var selector=document.getElementById('selector-tema');
if(!selector)return;
var temas=['clasico','ebano','ceruleo','obsidiana','violeta'];
selector.value=temas.includes(document.documentElement.dataset.tema)?document.documentElement.dataset.tema:'clasico';
selector.addEventListener('change',function(){
  if(!temas.includes(selector.value))return;
  document.documentElement.dataset.tema=selector.value;
  try{localStorage.setItem('forja-tema',selector.value);}catch(error){}
});
})();
