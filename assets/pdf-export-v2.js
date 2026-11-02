/* La Forja - compositor PDF A5 de Fantasía (candidato NO integrado).
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
    ['RIQUEZA','riqueza'],
    ['OBSERVACIONES REGLAMENTARIAS','notas']
  ];
  function asText(x){return x==null?'':String(x);}
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function prepararDatos(personaje,consultaBlindaje){
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
    out._blindaje=out._consultaBlindaje&&out._consultaBlindaje.valor!=='Sin armadura'?asText(out._consultaBlindaje.valor):'';
    out._natural=(out.blindaje_natural_fuente&&out.blindaje_natural!=null)?asText(out.blindaje_natural):'';
    out._sections=sectionKeys.map(function(k){
      var v=out[k[1]];
      if(v==null||v==='')return null;
      var items=Array.isArray(v)?v.map(function(x){
        return Array.isArray(x)&&x.length>=2?asText(x[0])+': '+asText(x[1]):asText(x);
      }):[asText(v)];
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
    var p=prepararDatos(personaje,consulta);
    var doc=await api.PDFDocument.load(opts.plantilla);
    doc.registerFontkit(opts.fontkit);
    var font=await doc.embedFont(opts.fontBytes,{subset:true});
    var bold=opts.boldFontBytes?await doc.embedFont(opts.boldFontBytes,{subset:true}):font;
    var cont=await api.PDFDocument.load(opts.continuacion);
    var principal=doc.getPage(0);
    var overflow=[];
    var shade=api.rgb(.13,.13,.13);
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
        if(opts.mapa.campos_fijos.some(function(f){return f.id===id;}))fixed(id,r[1]);
      }
    });
    fixed('armadura_equipada',p._armadura_equ);fixed('escudo_equipado',p._escudo_equ);
    fixed('blindaje',p._blindaje);fixed('blindaje_natural',p._natural);
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
      var titulo=wrapText(label,(width-1)*PT,bold,fs);
      var paso=region<2?3.3:3.8;
      if(y+titulo.length*paso+3.2>bottom){
        await changeRegion();
        fs=region<2?7.1:8.1;
        titulo=wrapText(label,(width-1)*PT,bold,fs);
        paso=region<2?3.3:3.8;
      }
      for(var parte of titulo){
        draw(current,x,y+2.7,parte,fs,true);
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
  return {prepararDatos:prepararDatos,wrapText:wrapText,exportar:exportar};
});
