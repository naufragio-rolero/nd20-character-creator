/* La Forja - compositor PDF A5 de Fantasía (edición con iconografía oficial).
 * pdf-lib + fontkit deben suministrarse localmente por el llamador.
 * Sin CDN; no modifica personajes ni gestiona turnos/combate.
 * Copyright El Naufragio. Revisión editorial pendiente.
 */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.NaufragioPdfExport=factory();
})(typeof window!=='undefined'?window:undefined,function(){
  'use strict';
  var PT=72/25.4,HEIGHT=210*PT;
  var sectionKeys=[
    ['COMPETENCIAS','competencias'],
    ['TALENTOS Y CAPACIDADES','capacidades'],
    ['CONJUROS Y PODERES CONOCIDOS','poderes'],
    ['CONJUROS PREPARADOS','conjuros_preparados'],
    ['INVENTARIO Y EQUIPO','equipo'],
    ['RIQUEZA','riqueza']
  ];
  function asText(x){return x==null?'':String(x);}
  function clone(x){return JSON.parse(JSON.stringify(x));}
  // Datos de equipo tomados exclusivamente del catálogo DRS servido a la Forja.
  // No inventar daño, durabilidad ni bonificaciones para objetos ausentes.
  function detalleEquipo(nombre,catalogo){
    var original=asText(nombre),base=original.replace(/\s+×\s*\d+\s*$/,'').trim();
    if(!catalogo||!base)return original;
    var grupos=[['armas','arma'],['varitas_defensa','varita'],
      ['armaduras','armadura'],['escudos','escudo'],['municion','municion']];
    var encontrado=null,tipo='';
    for(var grupo of grupos){
      var registro=(catalogo[grupo[0]]||[]).find(function(x){return x.nombre===base;});
      if(registro){encontrado=registro;tipo=grupo[1];break;}
    }
    if(!encontrado)return original;
    var datos=[];
    if(['arma','varita'].includes(tipo)&&encontrado.dano)datos.push('Daño '+encontrado.dano);
    if(tipo==='municion'&&encontrado.du)datos.push('DU '+encontrado.du);
    if(tipo==='varita'&&encontrado.municion_du)
      datos.push('Munición DU '+encontrado.municion_du);
    if(tipo==='armadura'&&encontrado.blindaje)datos.push('Blindaje '+encontrado.blindaje);
    // El escudo NO añade Blindaje pasivo: su valor solo sirve al bloquear.
    if(tipo==='escudo'&&encontrado.blindaje)datos.push('Bloqueo '+encontrado.blindaje);
    if(encontrado.durabilidad&&encontrado.durabilidad!=='-')
      datos.push('Durab. '+encontrado.durabilidad);
    return datos.length?original+' ('+datos.join(' · ')+')':original;
  }
  // No deducir efectos del nombre ni de las etiquetas: el índice de consulta
  // entrega las descripciones documentadas que ya usa La Forja.
  function descripcionPoderes(personaje,consultarPoder){
    var entradas=(personaje.poderes||[]).concat(personaje.conjuros_preparados||[]);
    var vistos=new Set(),textos=[];
    entradas.forEach(function(raw){
      var nombre=asText(raw).replace(/^\[[^\]]+\]\s*/,'')
        .replace(/\s+\(C[1-8]\)/g,'').replace(/\s+·\s+[^\n]+$/,'').trim();
      if(!nombre)return;
      var clave=nombre.toLocaleLowerCase('es').normalize('NFD')
        .replace(/[\u0300-\u036f]/g,'');
      if(vistos.has(clave))return;
      vistos.add(clave);
      var ficha=typeof consultarPoder==='function'?consultarPoder(raw):null;
      if(ficha&&typeof ficha.descripcion==='string'&&ficha.descripcion.trim()){
        textos.push(nombre+': '+ficha.descripcion.trim());
      }else{
        textos.push(nombre+': Descripción no documentada en el catálogo de La Forja.');
      }
    });
    return textos;
  }
  function prepararDatos(personaje,consultaBlindaje,catalogoEquipo,consultarPoder){
    if(!personaje||personaje.juego!=='Naufragio d20 · Fantasía')
      throw Error('La exportación solo admite fichas de Naufragio d20 Fantasía.');
    var out=clone(personaje), desc=asText(out.descripcion),pos=desc.indexOf(' · ');
    out._ocupacion=pos===-1?'':desc.slice(0,pos);
    out._especie=pos===-1?'':desc.slice(pos+3);
    out._descripcion_sin_dividir=pos===-1?desc:'';
    out._consultaBlindaje=consultaBlindaje?clone(consultaBlindaje):null;
    var owns=function(name){
      return (out.equipo||[]).some(function(e){return e===name||e.indexOf(name+' ×')===0;});
    };
    var prot=out.protecciones_equipadas||{};
    out._armadura_equ=prot.armadura&&owns(prot.armadura)?prot.armadura:'';
    out._escudo_equ=prot.escudo&&owns(prot.escudo)?prot.escudo:'';
    // La elección del arma es informativa; no suma dados ni cambia el combate.
    const armas=[...(catalogoEquipo?.armas||[]),
      ...(catalogoEquipo?.varitas_defensa||[])];
    const elegida=armas.find(function(a){
      return a.nombre===out.arma_equipada&&owns(a.nombre)&&a.dano;
    });
    out._arma_equ=elegida?elegida.nombre:'';
    out._dano_equ=elegida?elegida.dano:'';
    var blindaje=out._consultaBlindaje;
    // El Blindaje figura en el propio nombre de la armadura equipada.
    // Si una futura ficha dispone de Protección natural documentada y no
    // lleva armadura, se presenta en este mismo campo, nunca por duplicado.
    if(out._armadura_equ&&blindaje&&blindaje.valor!=='Sin armadura')
      out._armadura_equ+=' · Blindaje '+asText(blindaje.valor);
    else if(!out._armadura_equ&&blindaje&&blindaje.natural&&
      blindaje.valor!=='Sin armadura')
      out._armadura_equ='Protección natural ('+asText(blindaje.natural)+
        ') · Blindaje '+asText(blindaje.valor);
    out._detallesPoderes=descripcionPoderes(out,consultarPoder);
    out._notas=(Array.isArray(out.notas)?out.notas:
      (out.notas?[out.notas]:[])).map(function(n){
      return Array.isArray(n)&&n.length>=2?asText(n[0])+': '+asText(n[1]):asText(n);
    });
    out._sections=sectionKeys.map(function(k){
      var v=out[k[1]];
      if(v==null||v==='')return null;
      var items=Array.isArray(v)?v.map(function(x){
        return Array.isArray(x)&&x.length>=2?asText(x[0])+': '+asText(x[1]):asText(x);
      }):[asText(v)];
      if(k[1]==='equipo')items=items.map(function(x){
        var base=x.replace(/\\s+×\\s*\\d+\\s*$/,'').trim();
        return detalleEquipo(x,catalogoEquipo)+
          (out._arma_equ&&out._arma_equ===base?' · Arma equipada':'');
      });
      return items.length?{title:k[0],source:k[1],items:items}:null;
    }).filter(Boolean);
    return out;
  }
  function getBox(map,id){
    var found=map.campos_fijos.find(function(f){return f.id===id;});
    if(!found)throw Error('Campo PDF desconocido: '+id);
    return found.mm_superior_izquierda;
  }
  function wrapText(content,widthPt,font,size){
    var output=[];
    asText(content).replace(/\r\n?/g,'\n').split('\n').forEach(function(paragraph){
      if(!paragraph){output.push('');return;}
      var words=paragraph.split(' '),row='';
      words.forEach(function(word){
        var candidate=row?row+' '+word:word;
        if(font.widthOfTextAtSize(candidate,size)<=widthPt){row=candidate;return;}
        if(row){output.push(row);row='';}
        if(font.widthOfTextAtSize(word,size)<=widthPt){row=word;return;}
        var part='';
        Array.from(word).forEach(function(char){
          if(part&&font.widthOfTextAtSize(part+char,size)>widthPt){output.push(part);part=char;}
          else part+=char;
        });
        row=part;
      });
      if(row)output.push(row);
    });
    return output;
  }
  function topToPdf(y){return HEIGHT-y*PT;}
  async function exportar(personaje,options){
    var opts=options||{};
    if(!opts.PDFLib||!opts.fontkit||!opts.fontBytes||!opts.plantilla||!opts.continuacion||!opts.mapa)
      throw Error('Faltan activos locales autorizados: PDFLib, fontkit, fuente Unicode, PDFs o mapa.');
    var api=opts.PDFLib;
    var consulta=opts.consultarBlindaje?opts.consultarBlindaje(personaje):null;
    var p=prepararDatos(personaje,consulta,opts.catalogoEquipo,opts.consultarPoder);
    var doc=await api.PDFDocument.load(opts.plantilla);
    doc.registerFontkit(opts.fontkit);
    var font=await doc.embedFont(opts.fontBytes,{subset:true});
    var bold=opts.boldFontBytes?await doc.embedFont(opts.boldFontBytes,{subset:true}):font;
    var cont=await api.PDFDocument.load(opts.continuacion);
    var principal=doc.getPage(0);
    var overflow=[];
    var shade=api.rgb(.13,.13,.13);
    // Los PNG se producen localmente a partir de los SVG oficiales.
    // No se descargan imágenes externas ni se embeben fuentes SVG remotas.
    var imagenes={};
    if(opts.iconos&&typeof doc.embedPng==='function'){
      for(var id of Object.keys(opts.iconos)){
        imagenes[id]=await doc.embedPng(opts.iconos[id]);
      }
    }
    function icono(page,id,x,y,side){
      if(!imagenes[id]||typeof page.drawImage!=='function')return false;
      page.drawImage(imagenes[id],{x:x*PT,y:topToPdf(y+side),
        width:side*PT,height:side*PT,opacity:.90});
      return true;
    }
    var iconoSeccion={
      'COMPETENCIAS':'ico-tecnica',
      'TALENTOS Y CAPACIDADES':'recurso-potencia',
      'CONJUROS Y PODERES CONOCIDOS':'ico-conjuro',
      'CONJUROS PREPARADOS':'ico-conjuro',
      'INVENTARIO Y EQUIPO':'equipo-bolsa',
      'RIQUEZA':'equipo-bolsa',
      'OBSERVACIONES REGLAMENTARIAS':'ico-configurar',
      'EFECTOS DOCUMENTADOS DE CONJUROS Y PODERES':'ico-conjuro'
    };
    function draw(page,x,y,value,fs,isBold){
      var val=asText(value);if(!val)return;
      page.drawText(val,{x:x*PT,y:topToPdf(y),size:fs,font:isBold?bold:font,color:shade});
    }
    function fixed(id,value){
      if(value===undefined||value===null||value==='')return;
      var bx=getBox(opts.mapa,id),item=opts.mapa.campos_fijos.find(function(f){return f.id===id;});
      var fs=item.tamano_pt_recomendado,val=asText(value),width=(bx.width-.2)*PT;
      while(fs>6.5&&font.widthOfTextAtSize(val,fs)>width)fs-=.3;
      if(font.widthOfTextAtSize(val,fs)>width){overflow.push({id:id,value:val});val='Véase continuación';fs=6.3;}
      var x=bx.x;
      if(item.alineacion==='center')x+=bx.width/2-font.widthOfTextAtSize(val,fs)/PT/2;
      draw(principal,x,bx.y+bx.height*.76,val,fs,false);
    }
    fixed('nombre',p.nombre);fixed('especie',p._especie);fixed('ocupacion',p._ocupacion);
    fixed('nivel',p.nivel);fixed('sexo',p.sexo);fixed('concepto',p.concepto);
    (p.atributos||[]).forEach(function(a){
      var n=asText(a.nombre).toLowerCase(),prefix='atributo_'+n+'_';
      try{
        if(a.valor!=null)fixed(prefix+'va',a.valor);
        if(a.dificultad!=null)fixed(prefix+'da',asText(a.dificultad)+'+');
        if(a.favorito){
          var b=getBox(opts.mapa,prefix+'favorito');
          principal.drawCircle({x:(b.x+b.width/2)*PT,y:topToPdf(b.y+b.height/2),size:.87*PT,color:shade,borderColor:shade});
        }
      }catch(e){if(!/Campo PDF desconocido/.test(e.message))throw e;}
    });
    (p.recursos||[]).forEach(function(r){
      if(Array.isArray(r)&&r.length>1){
        var id='recurso_'+asText(r[0]).toLowerCase();
        if(opts.mapa.campos_fijos.some(function(f){return f.id===id;})){
          fixed(id,r[1]);
          var b=getBox(opts.mapa,id);
          // El hexágono decorativo de cada recurso en la ficha admite un pictograma.
          icono(principal,id,b.x+b.width-1.08,75.0,2.16);
        }
      }
    });
    fixed('armadura_equipada',p._armadura_equ);fixed('escudo_equipado',p._escudo_equ);
    // El PDF de plantilla anterior trae rótulos obsoletos en esta fila.
    // Se cubren sin alterar sus líneas ni el resto del diseño y se dibujan
    // los rótulos vigentes. El SVG editorial queda actualizado también.
    var papel=api.rgb(254/255,254/255,252/255);
    [8,76].forEach(function(x){
      principal.drawRectangle({x:(x-.2)*PT,y:topToPdf(110.1),
        width:61.4*PT,height:3.7*PT,color:papel});
    });
    draw(principal,8,109.1,'ARMA EQUIPADA',6,true);
    draw(principal,76,109.1,'DAÑO',6,true);
    fixed('arma_equipada',p._arma_equ);fixed('dano_equipado',p._dano_equ);
    var current=principal, region=0,x=8,y=124.5,width=63.8,bottom=198.1;
    async function changeRegion(){
      region++;
      if(region===1){x=76.2;y=124.5;width=63.8;bottom=198.1;return;}
      var pages=await doc.copyPages(cont,[0]);
      current=doc.addPage(pages[0]);x=8;y=39;width=132;bottom=198;
      var header=asText(p.nombre);
      if(font.widthOfTextAtSize(header,7)>93*PT)header='Nombre completo en esta hoja';
      draw(current,29,30.7,header,7);
      draw(current,138,30.7,doc.getPageCount(),7);
    }
    async function header(title,continuado){
      var label=continuado?title+' (CONT.)':title;
      var fs=region<2?7.1:8.1;
      var id=iconoSeccion[title],offset=imagenes[id]?4.1:0;
      var titulo=wrapText(label,(width-1-offset)*PT,bold,fs);
      var paso=region<2?3.3:3.8;
      if(y+titulo.length*paso+3.2>bottom){
        await changeRegion();
        fs=region<2?7.1:8.1;
        titulo=wrapText(label,(width-1-offset)*PT,bold,fs);
        paso=region<2?3.3:3.8;
      }
      if(offset)icono(current,id,x,y-.1,2.8);
      for(var parte of titulo){
        draw(current,x+offset,y+2.7,parte,fs,true);
        y+=paso;
      }
      y+=2.0;
    }
    async function section(title,items){
      var count=0,needsTitle=true;
      for(var item of items){
        if(needsTitle){
          await header(title,count>0);
          needsTitle=false;
        }
        var fs=region<2?6.65:7.05;
        var lines=wrapText(item,(width-3.4)*PT,font,fs);
        for(var j=0;j<lines.length;j++){
          if(y+(region<2?3.23:3.56)>bottom){
            await changeRegion();
            await header(title,true);
            fs=region<2?6.65:7.05;
          }
          if(j===0){
            current.drawCircle({x:(x+.7)*PT,y:topToPdf(y+1.1),size:.2*PT,color:shade});
          }
          draw(current,x+2.8,y+2.2,lines[j],fs);
          y+=region<2?3.23:3.56;
        }
        y+=.55;count++;
      }
      y+=1.25;
    }
    for(var s of p._sections)await section(s.title,s.items);
    // Las notas extensas nunca consumen espacio de la primera página.
    // Si el resto de la ficha ya desbordó, siguen en su hoja de continuación.
    if(p._notas.length){
      while(region<2)await changeRegion();
      await section('OBSERVACIONES REGLAMENTARIAS',p._notas);
    }
    // El detalle literal va después de todas las observaciones, nunca
    // intercalado en la lista compacta de Poderes de la primera página.
    if(p._detallesPoderes.length){
      while(region<2)await changeRegion();
      await section('EFECTOS DOCUMENTADOS DE CONJUROS Y PODERES',p._detallesPoderes);
    }
    if(overflow.length||p._descripcion_sin_dividir){
      while(region<2)await changeRegion();
      var extras=overflow.map(function(v){return v.id.toUpperCase()+': '+v.value;});
      if(p._descripcion_sin_dividir)extras.push('DESCRIPCIÓN: '+p._descripcion_sin_dividir);
      await section('DATOS COMPLETOS DE CABECERA',extras);
    }
    if(doc.getPageCount()>opts.maxPaginas&&opts.maxPaginas!=null)
      throw Error('La ficha excede el límite de páginas configurado.');
    var bytes=await doc.save();
    return {bytes:bytes,paginas:doc.getPageCount()};
  }
  return {prepararDatos:prepararDatos,descripcionPoderes:descripcionPoderes,detalleEquipo:detalleEquipo,wrapText:wrapText,exportar:exportar};
});
