'use strict';
/* Preparar para desarrollo los tres activos A5 de terceros bajo licencias abiertas.
 * No altera iconos, fuentes de reglas, generación ni el paquete LIVE.
 * Requiere: npm install --no-save --no-package-lock --ignore-scripts
 *   pdf-lib@1.17.1 @pdf-lib/fontkit@1.1.1 @expo-google-fonts/source-serif-4@0.4.1
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const targets=[
  {
    source:'node_modules/pdf-lib/dist/pdf-lib.min.js',
    target:'assets/vendor/pdf-lib.min.js',
    license:'MIT · pdf-lib 1.17.1'
  },
  {
    source:'node_modules/@pdf-lib/fontkit/dist/fontkit.umd.min.js',
    target:'assets/vendor/fontkit.umd.min.js',
    license:'MIT · @pdf-lib/fontkit 1.1.1'
  },
  {
    source:'node_modules/@expo-google-fonts/source-serif-4/400Regular/SourceSerif4_400Regular.ttf',
    target:'assets/pdf-a5/SourceSerif4_400Regular.ttf',
    license:'SIL OFL-1.1 · Source Serif 4 · Adobe'
  },
  {
    source:'node_modules/@expo-google-fonts/source-serif-4/LICENSE_FONT',
    target:'assets/pdf-a5/OFL-SourceSerif4.txt',
    license:'SIL OFL-1.1 · Source Serif 4'
  },
  {
    source:'node_modules/pdf-lib/LICENSE.md',
    target:'assets/vendor/LICENSE-pdf-lib.txt',
    license:'MIT · pdf-lib 1.17.1'
  }
];
function valid(src){
  const b=fs.readFileSync(src);
  if(b.length<100)throw Error('Activo vacío o insuficiente: '+src);
  return b;
}
for(const item of targets){
  const from=path.join(root,item.source),to=path.join(root,item.target);
  if(!fs.existsSync(from))throw Error('Falta dependencia instalada: '+item.source);
  const bytes=valid(from);
  if(item.target.endsWith('.ttf') && bytes.toString('ascii',0,4)!=='\x00\x01\x00\x00')
    throw Error('La fuente no es un archivo TrueType válido.');
  fs.mkdirSync(path.dirname(to),{recursive:true});
  fs.writeFileSync(to,bytes);
  console.log(item.target+' · '+bytes.length+' bytes · sha256='+
    crypto.createHash('sha256').update(bytes).digest('hex')+' · '+item.license);
}
console.log('Activos locales PDF A5 preparados; NO desplegados.');
