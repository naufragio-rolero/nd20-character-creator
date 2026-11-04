'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {exportar}=require('../assets/pdf-export-v2.js');
const map=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/pdf-a5/campos-ficha-a5.json'),'utf8'));
class MockPage{
  constructor(){this.draws=[];this.trazos=[];}
  drawText(text,opts){
    assert(Number.isFinite(opts.x)&&Number.isFinite(opts.y));
    assert(opts.x>=0&&opts.y>=0);
    this.draws.push(String(text));
    this.trazos.push({text:String(text),fuente:opts.font?.etiqueta||'normal'});
  }
  drawCircle(){}
  drawRectangle(){}
}
const documentos=[];
class MockDocument{
  constructor(){this.pages=[new MockPage()];documentos.push(this);}
  getPage(i){return this.pages[i];}
  registerFontkit(){}
  async embedFont(bytes){return {etiqueta:String(bytes).includes('bold')?'negrita':'normal',
    widthOfTextAtSize:(s,n)=>Array.from(s).length*n*.53};}
  async copyPages(){return [new MockPage()];}
  addPage(page){this.pages.push(page);return page;}
  getPageCount(){return this.pages.length;}
  async save(){return Buffer.from(this.pages.flatMap(p=>p.draws).join('\n'));}
}
const PDFLib={PDFDocument:{load:async()=>new MockDocument()},rgb:(r,g,b)=>({r,g,b})};
const attrs=['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia'].map((nombre,i)=>({
  nombre,valor:10+i,dificultad:10-i,favorito:i===2
}));
function ficha(nivel){
  return {
    juego:'Naufragio d20 · Fantasía',nombre:'Personaje de pruebas',
    descripcion:'Guerrero · Humano común',nivel,
    atributos:attrs,
    recursos:[['Salud','25 (d8)'],['Esfuerzo',2],['Movimiento',6],['Potencia',1]],
    equipo:['Espada','Escudo pequeño'],notas:['Observación de prueba'],
    competencias:['Armas'],capacidades:nivel===30?
      Array.from({length:154},(_,i)=>'Talento de prueba '+String(i+1).padStart(3,'0')):['Recuperación'],
    poderes:['[T] Ataque certero'],conjuros_preparados:['[T] Ataque certero']
  };
}
async function run(){
  for(const nivel of [1,30]){
    const p=ficha(nivel),before=JSON.stringify(p),primero=documentos.length;
    const out=await exportar(p,{PDFLib,fontkit:{},fontBytes:Buffer.from('mock'),
      boldFontBytes:Buffer.from('bold'),
      plantilla:Buffer.from('main'),continuacion:Buffer.from('cont'),mapa:map,
      consultarPoder:()=>({descripcion:'Obtienes +2 a la Tirada de Ataque y -2 a la Tirada de Daño.'}),
      consultarTalento:()=>({descripcion:'Recupera Salud durante un Intervalo.'})});
    assert.equal(JSON.stringify(p),before,'No debe mutar la ficha');
    assert(out.paginas>=1);
    const text=Buffer.from(out.bytes).toString('utf8');
    const dibujos=documentos[primero].pages.flatMap(p=>p.trazos);
    assert(dibujos.some(d=>d.fuente==='normal'&&d.text.includes('Armas')),
      'Los nombres de Competencias deben ser regulares');
    assert(dibujos.some(d=>d.fuente==='normal'&&d.text.includes(
      nivel===30?'Talento de prueba':'Recuperación')),
      'Los nombres compactos de Talentos deben ser regulares');
    if(nivel===1)assert(dibujos.some(d=>d.fuente==='negrita'&&d.text.includes('Recuperación:')),
      'El nombre del Talento solo se destaca en EFECTOS DE TALENTOS');
    assert(dibujos.some(d=>d.fuente==='negrita'&&d.text.includes('Ataque certero:')),
      'El nombre del Poder se destaca en EFECTOS DE PODERES');
    if(nivel===1)assert(dibujos.some(d=>d.fuente==='normal'&&d.text.includes('Recupera Salud')),
      'La explicación del Talento permanece regular');
    assert(text.includes('Personaje de pruebas'));
    const observaciones=text.indexOf('OBSERVACIONES REGLAMENTARIAS');
    const talento=text.indexOf('EFECTOS DE TALENTOS');
    const detalle=text.indexOf('EFECTOS DE PODERES');
    assert(text.includes('PODERES CONOCIDOS'),'Título de poderes generalizado');
    assert(!text.includes('EFECTOS DE TALENTOS') || text.indexOf('EFECTOS DE TALENTOS')>observaciones);
    assert(observaciones>=0&&(nivel!==1||talento>observaciones)&&
      detalle>observaciones,
      'El efecto de los Poderes aparece después de las Observaciones.');
    assert(text.includes('Ataque certero:'));
    assert(!text.includes('EFECTOS DOCUMENTADOS DE CONJUROS Y PODERES'));
    assert(!text.includes('CONJUROS Y PODERES CONOCIDOS'));
    assert.equal(text.split('Ataque certero:').length-1,1,
      'El mismo Poder conocido y preparado solo se describe una vez.');
    if(nivel===30){
      assert(out.paginas>=2);
      for(let i=1;i<=154;i++)
        assert(text.includes('Talento de prueba '+String(i).padStart(3,'0')),i);
    }
    console.log('OK: compositor simulado Nivel '+nivel+' ('+out.paginas+' páginas)');
  }
}
run().catch(e=>{console.error(e);process.exitCode=1;});
