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
    assert.equal((await page.locator('#tab-criaturas').innerText()).trim(),'Adversarios');
    assert.equal(await page.locator('#criaturas-edicion').evaluate(x=>x.open),false,
      'La mesa se abre sin mostrar el formulario.');
    await page.locator('#criaturas-ir-importar').click();
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
    await page.locator('#criaturas-texto').fill(texto+'\nLínea añadida después del análisis.');
    assert.equal(await page.locator('#criaturas-vista-previa').isHidden(),true);
    await page.locator('#criaturas-texto').fill(texto);
    await page.locator('#criaturas-analizar').click();
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
    await page.locator('#criaturas-estado').getByText('guardado',{exact:false}).waitFor();
    assert.equal(await page.locator('#criaturas-edicion').evaluate(x=>x.open),false);
    assert.equal(await page.locator('#criaturas-ficha-dialogo').evaluate(x=>x.open),true);
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

    await page.locator('#criaturas-ficha-editar').click();
    await page.locator('.criatura-ataque').first().locator('[data-campo="danoLiteral"]')
      .fill('especial');
    assert.equal(await page.locator('.criatura-ataque').first()
      .locator('[data-campo="danoNumerico"]').inputValue(),'');
    await page.locator('#criaturas-guardar').click();
    const editada=await page.evaluate(()=>JSON.parse(
      localStorage.getItem('forja-criaturas-usuario-v1')).criaturas[0].ficha.ataques[0]);
    assert.equal(editada.danoLiteral,'especial');
    assert.equal(editada.danoNumerico,null);
    await page.locator('#criaturas-ficha-editar').click();
    const bajar=page.waitForEvent('download');
    await page.locator('#criaturas-exportar-ficha').click();
    const descarga=await bajar;
    assert.equal(JSON.parse(fs.readFileSync(await descarga.path(),'utf8')).nombre,'Araña peluda');

    await page.locator('#criaturas-cerrar-editor').click();
    await page.locator('#criaturas-lista .criaturas-cromo').first().click();
    await page.locator('#criaturas-ficha-duplicar').click();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),2);
    assert.match(await page.locator('#criaturas-ficha-titulo').textContent(),/\(copia\)$/);
    // La colección PDF debe funcionar también con más de una ficha y
    // mantener cada adversario diferenciado en la composición.
    if(fs.existsSync(path.join(raiz,'assets/vendor/pdf-lib.min.js'))){
      await page.locator('#criaturas-cerrar-ficha').click();
      const pdfColeccion=page.waitForEvent('download',{timeout:60000});
      await page.locator('#criaturas-exportar-pdf-coleccion').click();
      const bytes=fs.readFileSync(await (await pdfColeccion).path());
      assert.equal(bytes.subarray(0,5).toString('ascii'),'%PDF-',
        nombre+': colección PDF real con dos adversarios');
      await page.locator('#criaturas-lista .criaturas-cromo').last().click();
    }
    page.once('dialog',d=>d.accept());
    await page.locator('#criaturas-ficha-eliminar').click();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);

    const bajarTodo=page.waitForEvent('download');
    await page.locator('#criaturas-exportar-biblioteca').click();
    const backup=JSON.parse(fs.readFileSync(await (await bajarTodo).path(),'utf8'));
    assert.equal(backup.criaturas.length,1);
    await page.locator('#criaturas-archivo-json').setInputFiles({
      name:'roto.json',mimeType:'application/json',buffer:Buffer.from('{json inválido')
    });
    await page.locator('#criaturas-estado').getByText('JSON válido',{exact:false}).waitFor();
    assert.match(await page.locator('#criaturas-estado').textContent(),/JSON válido/);
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);
    const incompatible=structuredClone(backup);
    incompatible.criaturas[0].ficha.campoDesconocido='prohibido perder';
    await page.locator('#criaturas-archivo-json').setInputFiles({
      name:'incompatible.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(incompatible),'utf8')
    });
    await page.locator('#criaturas-estado').getByText('Campo JSON desconocido',{exact:false}).waitFor();
    assert.match(await page.locator('#criaturas-estado').textContent(),/Campo JSON desconocido/);
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);
    page.once('dialog',d=>d.dismiss()); // Una copia duplicada rechazada no cambia la biblioteca.
    await page.locator('#criaturas-archivo-json').setInputFiles({
      name:'duplicado-rechazado.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(backup),'utf8')
    });
    // setInputFiles no espera a los awaits internos del manejador change:
    // aguardar a que se resuelva el primer dialog antes del siguiente listener.
    await page.locator('#criaturas-estado').getByText('Importación cancelada',{exact:false}).waitFor();
    assert.equal(await page.locator('#criaturas-lista .criaturas-lista-item').count(),1);
    page.once('dialog',d=>d.accept()); // Importación duplicada explícitamente aceptada.
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
    await page.locator('#criaturas-lista .criaturas-cromo').first().click();
    await page.locator('#criaturas-ficha-editar').click();
    const nombrePrevio=await page.locator('#criaturas-nombre').inputValue();
    await page.locator('#criaturas-nombre').fill('Sin guardar');
    page.once('dialog',d=>d.accept());
    await page.locator('#criaturas-descartar-cambios').click();
    assert.equal(await page.locator('#criaturas-nombre').inputValue(),nombrePrevio);
    await page.locator('#criaturas-cerrar-editor').click();
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
    // Cargar oficialmente DRS sin contaminar la colección particular.
    const otraContexto=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
    const segunda=await otraContexto.newPage();
    const erroresSegunda=[];
    segunda.on('pageerror',e=>erroresSegunda.push(e.message));
    try{
      await segunda.goto(url,{waitUntil:'domcontentloaded'});
      await segunda.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
      await segunda.locator('#tab-criaturas').click();
      assert.equal(await segunda.locator('.criaturas-cromo').count(),0);
      await segunda.locator('#criaturas-cargar-drs').click();
      assert.equal(await segunda.locator('#criaturas-selector-drs').evaluate(x=>x.open),true);
      assert.equal(await segunda.locator('.criaturas-selector-fila').count(),106);
      assert.equal(await segunda.locator('.criaturas-cromo').count(),0,
        'Abrir el catálogo nunca importa los 106 de golpe.');
      await segunda.locator('#criaturas-selector-busqueda').fill('Goblin con tirachinas');
      assert.equal(await segunda.locator('.criaturas-selector-fila').count(),1);
      await segunda.locator('.criaturas-selector-fila button').click();
      assert.equal(await segunda.locator('.criaturas-cromo[data-oficial="true"]').count(),1,
        'Diagnóstico: '+JSON.stringify(await segunda.evaluate(()=>({
          estado:document.querySelector('#criaturas-estado').textContent,
          lista:document.querySelector('#criaturas-lista').textContent.slice(0,250),
          almacen:localStorage.getItem('forja-adversarios-oficiales-v1'),
          selector:document.querySelector('#criaturas-selector-estado').textContent,
          boton:document.querySelector('.criaturas-selector-fila button')?.outerHTML
        })))+' errores JS: '+JSON.stringify(erroresSegunda));
      await segunda.locator('#criaturas-selector-cerrar').click();
      await segunda.locator('.criaturas-cromo[data-oficial="true"]').click();
      assert.match(await segunda.locator('#criaturas-ficha-titulo').textContent(),
        /Naufragio d20 - Épica/);
      assert.equal(await segunda.locator('.criaturas-metrica').count(),3);
      assert.doesNotMatch(await segunda.locator('#criaturas-ficha-contenido').innerText(),
        /Protección|Habilidad relacionada|chinazo_51/);
      assert.match(await segunda.locator('#criaturas-ficha-contenido').innerText(),
        /Chinazo - 6 de daño/);
      assert.match(await segunda.locator('.criaturas-fuente').innerText(),
        /Fuente: Naufragio d20 DRS/);
      assert.equal(await segunda.locator('.criaturas-icono-apartado').count(),2);
      await segunda.locator('#criaturas-ficha-retirar').click();
      assert.equal(await segunda.locator('.criaturas-cromo').count(),0,
        'Retirar una selección oficial debe vaciar la galería.');
      await segunda.reload({waitUntil:'domcontentloaded'});
      await segunda.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
      await segunda.locator('#tab-criaturas').click();
      assert.equal(await segunda.locator('.criaturas-cromo').count(),0,
        'La retirada debe persistir al recargar.');
      await segunda.locator('#criaturas-cargar-drs').click();
      await segunda.locator('#criaturas-selector-busqueda').fill('Goblin con tirachinas');
      await segunda.locator('.criaturas-selector-fila button').click();
      await segunda.locator('#criaturas-selector-cerrar').click();
      await segunda.locator('.criaturas-cromo[data-oficial="true"]').click();
      await segunda.locator('#criaturas-ficha-editar').click();
      assert.equal(await segunda.locator('#criaturas-edicion').evaluate(x=>x.open),true);
      assert.equal(await segunda.locator('.criaturas-cromo[data-oficial="true"]').count(),1);
      assert.equal(await segunda.locator('.criaturas-cromo').count(),2);
      await segunda.locator('#criaturas-cerrar-editor').click();
      await segunda.locator('#criaturas-nueva-panel').click();
      await segunda.locator('#criaturas-nombre').fill('Ejemplo de ajuste negativo');
      await segunda.locator('#criaturas-categoria').selectOption('Bestia');
      await segunda.locator('#criaturas-nivel').fill('4');
      await segunda.locator('#criaturas-salud-ajuste').fill('-2');
      assert.equal(await segunda.locator('#criaturas-salud').inputValue(),'8');
      await segunda.locator('#criaturas-salud-modo').selectOption('manual');
      await segunda.locator('#criaturas-salud').fill('19');
      await segunda.locator('#criaturas-descripcion').fill('Descripción completa de prueba.');
      await segunda.locator('#criaturas-guardar').click();
      assert.equal(await segunda.locator('#criaturas-ficha-dialogo').evaluate(x=>x.open),true);
      const salud=await segunda.evaluate(()=>{
        const d=JSON.parse(localStorage.getItem('forja-criaturas-usuario-v1'));
        return d.criaturas.find(x=>x.ficha.nombre==='Ejemplo de ajuste negativo').ficha;
      });
      assert.equal(salud.puntuaciones.salud,19);
      assert.equal(salud.saludAjuste,-2);
      assert.equal(salud.saludModo,'manual');
      if(fs.existsSync(path.join(raiz,'assets/vendor/pdf-lib.min.js'))){
        const descargar=segunda.waitForEvent('download',{timeout:60000});
        await segunda.locator('#criaturas-ficha-pdf').click();
        const bytes=fs.readFileSync(await (await descargar).path());
        assert.equal(bytes.subarray(0,5).toString('ascii'),'%PDF-');
      }
    }finally{await otraContexto.close();}
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
