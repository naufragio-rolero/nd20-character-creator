const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {exportar}=require('./pdf-export.js');
const map=require('../templates/campos-ficha-a5.json');
class MockPage{
  constructor(){this.draws=[];}
  drawText(value,opts){
    assert(Number.isFinite(opts.x)&&Number.isFinite(opts.y));
    assert(opts.x>=0&&opts.y>=0);
    this.draws.push({text:value,...opts});
  }
  drawCircle(){}
}
class MockDocument{
  constructor(){this.pages=[new MockPage()];}
  getPage(i){return this.pages[i];}
  registerFontkit(){}
  async embedFont(){return {widthOfTextAtSize:(s,n)=>Array.from(s).length*n*.53};}
  async copyPages(){return [new MockPage()];}
  addPage(page){this.pages.push(page);return page;}
  getPageCount(){return this.pages.length;}
  async save(){return Buffer.from(this.pages.map(p=>p.draws.map(x=>x.text).join('\n')).join('\n'),'utf8');}
}
const PDFLib={PDFDocument:{load:async()=>new MockDocument()},rgb:(r,g,b)=>({r,g,b})};
async function run(name){
  const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../samples',name+'.json'),'utf8'));
  const initial=JSON.stringify(fixture);
  const obj=await exportar(fixture,{PDFLib,fontkit:{},fontBytes:Buffer.from('mock'),
    plantilla:Buffer.from('main'),continuacion:Buffer.from('cont'),mapa:map});
  assert.equal(initial,JSON.stringify(fixture));
  assert(obj.paginas>=1);
  const text=Buffer.from(obj.bytes).toString('utf8');
  assert(text.includes('NAUFRAGIO')===false); // the template background is not re-rendered by the mock.
  if(name==='nivel30_extenso'){
    assert(obj.paginas>=3);
    for(let i=1;i<=29;i++)assert(text.includes('Talento de prueba '+String(i).padStart(2,'0')));
    for(let i=1;i<=48;i++)assert(text.includes('Artículo de inventario de prueba '+String(i).padStart(2,'0')));
  }
  console.log('Mock JS',name,obj.paginas,'páginas');
}
(async()=>{await run('nivel1');await run('nivel30_extenso');await run('nombre_largo_unicode_sin_armadura');})().catch(e=>{console.error(e);process.exitCode=1;});
