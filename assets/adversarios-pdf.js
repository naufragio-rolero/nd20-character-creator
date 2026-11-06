/* Compositor A5 propio de Adversarios Nd20. Sin automatización de combate,
 * dependencias externas ni omisión silenciosa de textos largos. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.NaufragioPdfAdversarios=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var W=419.53,H=595.28,M=34,ancho=W-2*M;
  var AZUL={r:.09,g:.18,b:.24},ORO={r:.68,g:.52,b:.28},GRIS={r:.28,g:.35,b:.39};
  function texto(v){return v==null?'':String(v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');}
  function slug(v){return texto(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,56).replace(/^-|-$/g,'')||'adversario';}
  function lineas(text,font,size,maxWidth){
    var salida=[];
    texto(text).split(/\r?\n/).forEach(function(parrafo){
      if(!parrafo.trim()){salida.push('');return;}
      var linea='';
      parrafo.split(/\s+/).forEach(function(palabra){
        var prueba=linea?linea+' '+palabra:palabra;
        if(font.widthOfTextAtSize(prueba,size)<=maxWidth){linea=prueba;return;}
        if(linea){salida.push(linea);linea='';}
        while(palabra&&font.widthOfTextAtSize(palabra,size)>maxWidth){
          var n=1;
          while(n<palabra.length&&font.widthOfTextAtSize(palabra.slice(0,n+1),size)<=maxWidth)n++;
          salida.push(palabra.slice(0,n));palabra=palabra.slice(n);
        }
        linea=palabra;
      });
      if(linea)salida.push(linea);
    });
    return salida;
  }
  function cargarScript(url,global){
    if(root[global])return Promise.resolve();
    return new Promise(function(resolve,reject){
      var el=root.document.createElement('script');el.src=url;el.async=true;
      el.onload=function(){root[global]?resolve():reject(Error('No se inició '+global));};
      el.onerror=function(){reject(Error('No pudo cargarse '+url));};
      root.document.head.appendChild(el);
    });
  }
  async function dependencias(){
    await cargarScript('assets/vendor/pdf-lib.min.js','PDFLib');
    await cargarScript('assets/vendor/fontkit.umd.min.js','fontkit');
    var archivos=await Promise.all([
      root.fetch('assets/pdf-a5/SourceSerif4_400Regular.ttf'),
      root.fetch('assets/pdf-a5/SourceSerif4_700Bold.ttf')
    ]);
    if(archivos.some(function(r){return !r.ok;}))
      throw Error('No están disponibles las fuentes PDF locales.');
    return Promise.all(archivos.map(function(r){return r.arrayBuffer();}));
  }
  async function componer(entradas){
    if(!Array.isArray(entradas)||!entradas.length)
      throw Error('La colección de adversarios está vacía.');
    entradas.forEach(function(f){
      if(!f||!f.nombre||!f.puntuaciones||!Array.isArray(f.ataques)||
         !Array.isArray(f.talentos))throw Error('Ficha de adversario no válida.');
    });
    if(!root.NaufragioFormatoAdversarios)
      throw Error('Falta el módulo de formato de ataques.');
    var archivos=await dependencias();
    var PDF=root.PDFLib,pdf=await PDF.PDFDocument.create();
    pdf.registerFontkit(root.fontkit);
    var regular=await pdf.embedFont(archivos[0],{subset:true});
    var negrita=await pdf.embedFont(archivos[1],{subset:true});
    var page=null,y=0;
    function color(c){return PDF.rgb(c.r,c.g,c.b);}
    function paginaNueva(){
      page=pdf.addPage([W,H]);y=H-M;
      page.drawText('EL NAUFRAGIO   /   ADVERSARIOS D20',{
        x:M,y:y,font:negrita,size:8,color:color(ORO)});
      y-=14;
      page.drawLine({start:{x:M,y:y},end:{x:W-M,y:y},
        color:color(ORO),thickness:.8});
      y-=20;
    }
    function asegurar(altura){if(!page||y-altura<M+25)paginaNueva();}
    function bloque(titulo,contenido){
      if(contenido==null||!texto(contenido).trim())return;
      var size=9.4,alto=13.1;
      var lista=lineas(contenido,regular,size,ancho);
      asegurar(26+Math.min(2,lista.length)*alto);
      page.drawText(titulo,{x:M,y:y,font:negrita,size:11,color:color(AZUL)});
      y-=16;
      lista.forEach(function(linea){
        asegurar(alto);
        if(linea)page.drawText(linea,{x:M,y:y,font:regular,size:size,color:color(AZUL)});
        y-=alto;
      });
      y-=8;
    }
    function encabezado(ficha){
      asegurar(90);
      var nombres=lineas(ficha.nombre,negrita,18,ancho);
      nombres.forEach(function(n){
        asegurar(23);page.drawText(n,{x:M,y:y,font:negrita,size:18,color:color(AZUL)});y-=23;
      });
      var taxonomia=[ficha.categoria,ficha.subcategoria,ficha.subtipo].filter(Boolean).join('  ·  ');
      if(taxonomia){page.drawText(taxonomia,{x:M,y:y,font:regular,size:9,color:color(GRIS)});y-=19;}
      var p=ficha.puntuaciones;
      var datos=[['Nivel',p.nivel],['Salud',p.salud],['Moral',p.moral],
        ['Movimiento',p.movimiento],['Tamaño',p.tamano]]
        .filter(function(par){return par[1]!==null&&par[1]!==undefined;});
      for(var i=0;i<datos.length;i+=3){
        asegurar(32);
        datos.slice(i,i+3).forEach(function(par,j){
          var x=M+j*(ancho/3),w=ancho/3-5;
          page.drawRectangle({x:x,y:y-17,width:w,height:28,
            borderColor:color(ORO),borderWidth:.5});
          page.drawText(par[0],{x:x+6,y:y+1,font:regular,size:7.6,color:color(GRIS)});
          page.drawText(texto(par[1]),{x:x+6,y:y-12,font:negrita,size:10,color:color(AZUL)});
        });
        y-=37;
      }
      y-=5;
    }
    function ficha(f){
      paginaNueva();
      encabezado(f);
      if(f.ataques.length){
        var ataques=f.ataques.map(function(a,i){
          return root.NaufragioFormatoAdversarios.ataque(a,i)+
            (a.notas?' — '+a.notas:'');
        }).join('\n');
        bloque('Ataques',ataques);
      }
      if(f.talentos.length)bloque('Talentos y habilidades especiales',
        f.talentos.map(function(t){return t.nombre+': '+t.descripcion;}).join('\n\n'));
      bloque('Descripción',f.descripcion);
      bloque('Notas',f.notas);
      if(f.camposNoInterpretados&&f.camposNoInterpretados.length)
        bloque('Fragmentos no interpretados',f.camposNoInterpretados.join('\n'));
      // La transcripción permanece en JSON, no ocupa varias páginas del PDF.
      if(f.origen&&['drs_oficial','drs_copia_personal'].includes(f.origen.tipo)){
        asegurar(24);
        y-=7;
        page.drawText('Fuente: Naufragio d20 DRS',{
          x:M,y:y,font:regular,size:7.8,color:color(GRIS)});
        y-=11;
      }
    }
    entradas.slice().sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es');})
      .forEach(ficha);
    var paginas=pdf.getPages();
    paginas.forEach(function(p,i){
      p.drawLine({start:{x:M,y:28},end:{x:W-M,y:28},
        color:color(ORO),thickness:.5});
      p.drawText('Naufragio d20 · Documento de consulta',{
        x:M,y:15,font:regular,size:7,color:color(GRIS)});
      var num='Página '+(i+1)+' / '+paginas.length;
      p.drawText(num,{x:W-M-regular.widthOfTextAtSize(num,7),y:15,
        font:regular,size:7,color:color(GRIS)});
    });
    return {bytes:await pdf.save(),paginas:paginas.length};
  }
  async function descargar(entradas,nombre){
    var r=await componer(entradas);
    var url=root.URL.createObjectURL(new root.Blob([r.bytes],{type:'application/pdf'}));
    var a=root.document.createElement('a');a.href=url;
    a.download=nombre||('adversarios-nd20-'+slug(entradas[0].nombre)+'.pdf');
    root.document.body.appendChild(a);a.click();a.remove();
    root.setTimeout(function(){root.URL.revokeObjectURL(url);},30000);
    return r.paginas;
  }
  return {componer:componer,descargar:descargar,slug:slug,lineas:lineas};
});
