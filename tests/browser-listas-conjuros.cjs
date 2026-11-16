'use strict';
/* E2E en rama de trabajo: el editor NO forma parte del paquete público. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {firefox,webkit}=require('playwright');
const raiz=path.resolve(__dirname,'..');
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch(e){res.writeHead(400).end();return;}
  const archivo=path.resolve(raiz,'.'+pathname);
  if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(archivo,(error,bytes)=>{
    if(error){res.writeHead(404).end('No encontrado');return;}
    res.writeHead(200,{'Content-Type':(tipos[path.extname(archivo)]||'application/octet-stream')+'; charset=utf-8',
      'Cache-Control':'no-store'});res.end(bytes);
  });
});
async function probar(nombre,motor,url){
  const browser=await motor.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1280,height:800},acceptDownloads:true});
  try{
    const page=await context.newPage(),errores=[];
    page.on('pageerror',e=>errores.push(e.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.match(await page.locator('#estado-datos').innerText(),/DRS 1\.1\.12/);
    assert.equal(await page.locator('#listas button').count(),3,'Dos listas oficiales y borrador v5');
    assert.equal(await page.locator('#lista-nombre').isEditable(),false,'DRS protegido');
    assert.equal(await page.locator('#guardar-lista').isDisabled(),true);
    await page.locator('#duplicar-lista').click();
    assert.equal(await page.locator('#lista-nombre').isEditable(),true);
    await page.locator('#lista-nombre').fill('Ensayo personal');
    await page.locator('#lista-maximo').selectOption('4');
    // Los Conjuros superiores quedan marcados en la copia original. Retirarlos para respetar el tope.
    const lista=page.locator('#grupos-conjuros input[type=checkbox]');
    const indices=await lista.count();
    assert.equal(indices,64,'El catálogo se presenta completo');
    for(let c=5;c<=8;c++){
      const bloque=page.locator('.grupo').filter({has:page.locator('summary', {hasText:'Círculo '+c})});
      while(await bloque.locator('input:checked').count())
        await bloque.locator('input:checked').first().click();
    }
    await page.locator('#filtro-escuela').selectOption('Divina');
    assert.ok((await page.locator('.conjuro').count())>0,'Filtro por Escuela');
    await page.locator('#filtro-escuela').selectOption('');
    await page.locator('#filtro-origen').selectOption('Mago');
    assert.ok((await page.locator('.conjuro').count())>0,'Filtro por lista de origen');
    await page.locator('#filtro-origen').selectOption('');
    await page.locator('#filtro-nombre').fill('Silencio');
    assert.equal(await page.locator('.conjuro').count(),1);
    await page.locator('#filtro-nombre').fill('');
    await page.locator('#guardar-lista').click();
    await page.locator('#estado-lista').getByText('guardada localmente',{exact:false}).waitFor();
    assert.equal(await page.locator('#lista-maximo').inputValue(),'4');
    await page.reload();
    await page.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await page.locator('#listas button').count(),4,'La lista sobrevive a la recarga');
    await page.locator('#listas button').filter({hasText:'Ensayo personal'}).click();
    assert.equal(await page.locator('#lista-nombre').inputValue(),'Ensayo personal');
    // Asociación no oficial: Profeta con lista personal y sin tabla no inventa Espacios.
    await page.locator('#asoc-ocupacion').fill('Profeta');
    await page.locator('#asoc-lista').selectOption({label:'Ensayo personal · personal'});
    await page.locator('#asoc-progresion').selectOption('');
    await page.locator('#form-asociacion button[type=submit]').click();
    assert.match(await page.locator('#vista-asociacion').innerText(),/Sin tabla de progresión/);
    await page.locator('#asoc-ocupacion').fill('Centinela');
    await page.locator('#asoc-lista').selectOption('propuesta:centinela-v5');
    await page.locator('#asoc-progresion').selectOption('propuesta:centinela-v5');
    await page.locator('#asoc-nivel').fill('7');
    await page.locator('#form-asociacion button[type=submit]').click();
    assert.match(await page.locator('#vista-asociacion').innerText(),/Círculo 4: 1 Espacios/);
    // Exportar la biblioteca sin textos oficiales; reimportar y mantener las asociaciones.
    const descarga=page.waitForEvent('download');
    await page.locator('#exportar-listas').click();
    const archivo=await descarga;assert.match(archivo.suggestedFilename(),/listas-conjuros/);
    const datos=fs.readFileSync(await archivo.path(),'utf8');
    assert.equal(JSON.parse(datos).listas.length,1);
    assert.equal(JSON.parse(datos).asociaciones.length,2);
    assert.ok(!datos.includes('Generas una grieta'),'No exportar descripciones oficiales');
    await page.locator('#importar-archivo').setInputFiles({
      name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"esquema":"incorrecto"}')});
    assert.match(await page.locator('#estado-datos').innerText(),/No se importó nada/);
    assert.equal(await page.locator('#asociaciones-guardadas li').count(),2);
    await page.setViewportSize({width:375,height:812});
    assert.equal(await page.locator('#crear-lista').isVisible(),true);
    const desbordamiento=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(desbordamiento<=2,'No debe haber desbordamiento horizontal móvil: '+desbordamiento);
    assert.deepEqual(errores,[],nombre+': sin excepciones JavaScript.');
    console.log('OK · '+nombre+': 64 fichas, lectura DRS, filtros, copia, local, export/import, asociación, móvil y protección.');
  }finally{await context.close();await browser.close();}
}
(async()=>{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  try{
    const url='http://127.0.0.1:'+server.address().port+'/listas-de-conjuros.html';
    for(const [nombre,motor] of [['firefox',firefox],['webkit',webkit]])
      await probar(nombre,motor,url);
  }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error('FALLO E2E LISTAS DE CONJUROS:',e.stack||e);process.exitCode=1;});
