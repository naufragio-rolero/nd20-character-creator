'use strict';
/* Prueba REAL de pdf-lib: solo se ejecuta después de preparar las dependencias.
 * Node 22+; npm install ...; node scripts/preparar-vendor-pdf-a5.cjs
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {PDFDocument,rgb}=require('pdf-lib');
const fontkit=require('@pdf-lib/fontkit');
const {exportar}=require('../assets/pdf-export-v2.js');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f));
const plantilla=read('assets/pdf-a5/forja-fantasia-epica-a5.pdf');
const continuacion=read('assets/pdf-a5/forja-continuacion-a5.pdf');
const fontBytes=read('assets/pdf-a5/SourceSerif4_400Regular.ttf');
const mapa=JSON.parse(read('assets/pdf-a5/campos-ficha-a5.json').toString('utf8'));
const catalogoEquipo=JSON.parse(read('data/equipo-inicial.json').toString('utf8'));
function fixture(nivel){
  return {
    juego:'Naufragio d20 · Fantasía',
    nombre:'Ínara del Bosque · Personaje de prueba',
    descripcion:'Guerrero · Humano común',nivel,sexo:'femenino',concepto:'',
    atributos:['Fuerza','Agilidad','Resistencia','Mente','Intuición','Presencia'].map(
      (nombre,i)=>({nombre,valor:11+i,dificultad:9-i,favorito:i===0})),
    recursos:[['Salud','25 (d8)'],['Esfuerzo',2],['Movimiento','Cerca'],['Potencia',1]],
    equipo:['Hacha de batalla','Armadura acolchada','Escudo pequeño'],protecciones_equipadas:{armadura:'Armadura acolchada',escudo:'Escudo pequeño'},
    competencias:['Armas'],capacidades:nivel===30?
      Array.from({length:154},(_,i)=>'Talento de prueba '+(i+1)):['Recuperación'],
    poderes:[],conjuros_preparados:[],riqueza:'10 mo',
    notas:['OBSERVACION_PAGINA_DOS: Comprobar ubicación y conservar texto íntegro.']
  };
}
async function revisar(nivel){
  const p=fixture(nivel),original=JSON.stringify(p);
  const r=await exportar(p,{PDFLib:{PDFDocument,rgb},fontkit,fontBytes,
    plantilla,continuacion,mapa,catalogoEquipo,
    consultarBlindaje:()=>({valor:'d4'})});
  assert.equal(JSON.stringify(p),original,'No mutar personaje');
  assert(r.bytes.length>15000);
  const qaDir=path.join(root,'dist','pdf-a5-preimpresion');
  fs.mkdirSync(qaDir,{recursive:true});
  fs.writeFileSync(path.join(qaDir,'nivel-'+nivel+'.pdf'),r.bytes);
  const pdf=await PDFDocument.load(r.bytes);
  assert.equal(pdf.getPageCount(),r.paginas);
  assert(r.paginas>=2,'Las observaciones generan continuación, incluso al Nivel 1');
  for(const page of pdf.getPages()){
    const {width,height}=page.getSize();
    assert(Math.abs(width-419.528)<1,'ancho A5');
    assert(Math.abs(height-595.276)<1,'alto A5');
  }
  console.log('PDF real Nivel '+nivel+': '+r.paginas+' páginas, '+r.bytes.length+' bytes');
}
(async()=>{await revisar(1);await revisar(30);})()
  .catch(error=>{console.error(error);process.exitCode=1;});
