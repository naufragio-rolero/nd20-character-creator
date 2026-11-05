'use strict';
/* E2E del Editor Nd20 en Firefox y WebKit, también sobre el paquete DRS. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {firefox,webkit}=require('playwright');
const raiz=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.resolve(__dirname,'..'));
const tipos={'.html':'text/html','.css':'text/css','.js':'text/javascript',
  '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch(e){res.writeHead(400).end();return;}
  const archivo=path.resolve(raiz,'.'+pathname);
  if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(archivo,(error,bytes)=>{
    if(error){res.writeHead(404).end('Archivo inexistente');return;}
    res.writeHead(200,{'Content-Type':(tipos[path.extname(archivo)]||
      'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});
    res.end(bytes);
  });
});
async function probar(nombre,tipo,url){
  const browser=await tipo.launch({headless:true});
  let contexto;
  try{
    contexto=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
    const page=await contexto.newPage();
    const errores=[];
    page.on('pageerror',e=>errores.push(e.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await page.locator('#tab-criaturas').click();
    assert.equal(await page.locator('#editor-criaturas').isVisible(),true);
    assert.equal(await page.locator('#resultados-personajes').isHidden(),true);
    assert.equal(await page.locator('#selector-sistema-global').isHidden(),true);
    assert.equal(await page.locator('#panel-criaturas').isVisible(),true);
    assert.equal(await page.locator('#tab-criaturas').getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),0);
    const texto=[
      'Araña peluda',
      'Alimaña de Nivel 2 [Moral 8], Salud 12',
      'Ataques: mordisco (4) y tela de araña',
      'Tela de araña: tiene un alcance de 6m.',
      'Un arácnido del tamaño de un perro grande.'
    ].join('\n');
    await page.locator('#criaturas-texto').fill(texto);
    await page.locator('#criaturas-analizar').click();
    assert.equal(await page.locator('#criaturas-vista-previa').isVisible(),true);
    assert.match(await page.locator('#criaturas-resumen-previa').textContent(),/Ataques \(2\)/);
    assert.match(await page.locator('#criaturas-resumen-previa').textContent(),/Talentos \(1\)/);
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),0,
      'El pegado no guarda ni importa automáticamente.');
    await page.locator('#criaturas-aplicar-previa').click();
    assert.equal(await page.locator('#criaturas-nombre').inputValue(),'Araña peluda');
    assert.equal(await page.locator('#criaturas-nivel').inputValue(),'2');
    assert.equal(await page.locator('#criaturas-moral').inputValue(),'8');
    assert.equal(await page.locator('.criatura-ataque').count(),2);
    assert.equal(await page.locator('.criatura-talento').count(),1);
    assert.equal(await page.locator('#criaturas-original').inputValue(),texto);
    await page.locator('#criaturas-subcategoria').fill('Animales');
    await page.locator('#criaturas-subtipo').fill('Arácnido');
    await page.locator('#criaturas-guardar').click();
    await page.locator('#criaturas-estado').getByText('guardada',{exact:false}).waitFor();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);
    const ficha=await page.evaluate(()=>{
      return JSON.parse(localStorage.getItem('forja-criaturas-usuario-v1')).criaturas[0].ficha;
    });
    assert.equal(ficha.subcategoria,'Animales');
    assert.equal(ficha.subtipo,'Arácnido');
    assert.equal(ficha.puntuaciones.moral,8);
    assert.equal(ficha.ataques[1].danoNumerico,null);
    assert.equal(ficha.talentos[0].nombre,'Tela de araña');
    assert.equal(ficha.origen.textoOriginal,texto);

    await page.locator('.criatura-ataque').first().locator('[data-campo="danoLiteral"]')
      .fill('especial');
    assert.equal(await page.locator('.criatura-ataque').first()
      .locator('[data-campo="danoNumerico"]').inputValue(),'');
    await page.locator('#criaturas-guardar').click();
    const editada=await page.evaluate(()=>JSON.parse(
      localStorage.getItem('forja-criaturas-usuario-v1')).criaturas[0].ficha.ataques[0]);
    assert.equal(editada.danoLiteral,'especial');
    assert.equal(editada.danoNumerico,null);
    const bajar=page.waitForEvent('download');
    await page.locator('#criaturas-exportar-ficha').click();
    const descarga=await bajar;
    assert.equal(JSON.parse(fs.readFileSync(await descarga.path(),'utf8')).nombre,'Araña peluda');

    await page.locator('#criaturas-lista [data-accion="duplicar"]').first().click();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),2);
    assert.match(await page.locator('#criaturas-nombre').inputValue(),/\(copia\)$/);
    page.once('dialog',d=>d.accept());
    await page.locator('#criaturas-lista [data-accion="eliminar"]').last().click();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);

    const bajarTodo=page.waitForEvent('download');
    await page.locator('#criaturas-exportar-biblioteca').click();
    const backup=JSON.parse(fs.readFileSync(await (await bajarTodo).path(),'utf8'));
    assert.equal(backup.criaturas.length,1);
    await page.locator('#criaturas-archivo-json').setInputFiles({
      name:'respaldo.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(backup),'utf8')
    });
    await page.locator('#criaturas-estado').getByText('Importación completada',{exact:false}).waitFor();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),2);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await page.locator('#tab-criaturas').click();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),2);
    await page.locator('#criaturas-lista [data-accion="editar"]').first().click();
    const nombrePrevio=await page.locator('#criaturas-nombre').inputValue();
    await page.locator('#criaturas-nombre').fill('Sin guardar');
    page.once('dialog',d=>d.accept());
    await page.locator('#criaturas-descartar-cambios').click();
    assert.equal(await page.locator('#criaturas-nombre').inputValue(),nombrePrevio);
    await page.locator('#tab-personajes').click();
    assert.equal(await page.locator('#editor-criaturas').isHidden(),true);
    assert.equal(await page.locator('#resultados-personajes').isVisible(),true);
    assert.equal(await page.locator('#generar').isEnabled(),true);
    await page.setViewportSize({width:390,height:844});
    await page.locator('#alternar-menu').click();
    await page.locator('#tab-criaturas').click();
    assert.equal(await page.locator('#editor-criaturas').isVisible(),true);
    assert.equal(await page.evaluate(()=>
      document.documentElement.scrollWidth>innerWidth+3),false,
      nombre+': no debe haber desplazamiento horizontal en móvil.');
    assert.deepEqual(errores,[],nombre+': sin errores JS.');
    console.log('OK · '+nombre+': editor, pegado, CRUD, JSON, recarga y móvil.');
  }finally{
    if(contexto)await contexto.close();
    await browser.close();
  }
}
async function main(){
  await new Promise((resolve,reject)=>{
    server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  try{
    const url='http://127.0.0.1:'+server.address().port+'/index.html';
    for(const [nombre,tipo] of [['firefox',firefox],['webkit',webkit]])
      await probar(nombre,tipo,url);
  }finally{
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error('FALLO E2E CRIATURAS:',e.stack||e);process.exitCode=1;});
