'use strict';
/* E2E de semillas, configuración, accesibilidad y rangos. Ejemplos:
 * node tests/browser-semillas-rangos.cjs chrome
 * node tests/browser-semillas-rangos.cjs firefox webkit
 * FORJA_PUBLIC_ROOT=dist/public-drs node tests/browser-semillas-rangos.cjs chrome
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const base=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.join(__dirname,'..'));
const browsers={chrome:chromium,firefox,webkit};
const engines=process.argv.slice(2).length?process.argv.slice(2):['chrome'];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css',
  '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  let requested;
  try {requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch(e){res.writeHead(400).end();return;}
  const file=path.resolve(base,'.'+(requested==='/'?'/index.html':requested));
  if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(e,bytes)=>{
    if(e){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||
      'application/octet-stream','Cache-Control':'no-store'});
    res.end(bytes);
  });
});
const check=async(page,selector,expected)=>assert.equal(await page.locator(selector).textContent(),expected);
async function run(name,origin){
  if(!browsers[name])throw Error('Motor desconocido: '+name);
  const launch=name==='chrome'?{channel:'chrome',headless:true,args:['--no-sandbox']}:
    {headless:true};
  const browser=await browsers[name].launch(launch);
  const page=await browser.newPage({viewport:{width:1320,height:920}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const config=page.locator('#dialogo-configuracion');
  const open=async()=>{if(!await config.evaluate(x=>x.open))await page.locator('#abrir-configuracion').click();};
  const close=async()=>{if(await config.evaluate(x=>x.open))await page.locator('#cerrar-configuracion').click();};
  const ready=async()=>await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
  const first=()=>page.locator('#fichas .tarjeta').first();
  const newPage=async()=>{await page.reload();await ready();};
  try{
    await page.goto(origin,{waitUntil:'domcontentloaded'});
    await ready();
    await check(page,'#resumen-sistema','Naufragio d20 · Fantasía Épica');
    await check(page,'#resumen-nivel','Nivel 1');
    await check(page,'#resumen-nombre','Nombres genéricos');
    assert.equal(await page.locator('#generar-mazmorra').count(),0);
    // El tutorial en móvil es distinto al lateral: cerrar uno oculta ambos
    // y persiste incluso al recargar o volver a limpiar la mesa.
    await page.setViewportSize({width:390,height:850});
    assert.equal(await page.locator('#inicio-movil').isVisible(),true);
    const cerrarMovil=page.locator('#ocultar-inicio-movil');
    assert.ok((await cerrarMovil.boundingBox()).width>=44);
    await cerrarMovil.click();
    assert.equal(await page.locator('#inicio-movil').isVisible(),false);
    assert.equal(await page.locator('#tutorial-inicial').isVisible(),false);
    await newPage();
    assert.equal(await page.locator('#inicio-movil').isVisible(),false);
    await page.setViewportSize({width:1320,height:920});
    assert.equal(await page.locator('#tutorial-inicial').isVisible(),false);
    // El cierre del tutorial lateral usa exactamente la misma preferencia.
    await page.evaluate(()=>localStorage.removeItem('forja-tutorial-oculto'));
    await newPage();
    await page.locator('#ocultar-tutorial').click();
    await newPage();
    assert.equal(await page.locator('#tutorial-inicial').isVisible(),false);
    await page.setViewportSize({width:390,height:850});
    assert.equal(await page.locator('#inicio-movil').isVisible(),false);
    await page.setViewportSize({width:1320,height:920});
    assert.equal(await page.locator('#generar').isEnabled(),true);
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'false');
    const botones=await page.locator('#generar, #usar-semilla').evaluateAll(elements=>
      elements.map(x=>({id:x.id,top:x.getBoundingClientRect().top,
        bottom:x.getBoundingClientRect().bottom})));
    assert.deepEqual(botones.map(b=>b.id),['generar','usar-semilla']);
    assert.ok(botones[1].top>=botones[0].bottom,'Usar semilla queda debajo de Generar personaje');
    await page.locator('#selector-tema').selectOption('violeta');
    assert.equal(await page.locator('html').getAttribute('data-tema'),'violeta');
    await newPage();
    assert.equal(await page.locator('html').getAttribute('data-tema'),'violeta',
      'Tema Violeta persiste al recargar');
    await page.locator('#selector-tema').selectOption('clasico');
    await open();
    await page.locator('#modo-nombre').selectOption('ylat');
    await check(page,'#resumen-nombre','Nombres de Ylat');
    await page.locator('#nombre-personaje').fill('Alyra de Ylat');
    await check(page,'#resumen-nombre','Nombre personalizado: Alyra de Ylat');
    await page.locator('#nombre-personaje').fill('');
    await check(page,'#resumen-nombre','Nombres de Ylat');
    await page.locator('#modo-nombre').selectOption('generico');
    await check(page,'#resumen-nombre','Nombres genéricos');
    // Dos columnas escritorio; una columna en móvil.
    const cajas=await page.locator('.fila-identidad>.campo').evaluateAll(nodes=>
      nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width};}));
    assert.equal(cajas.length,2);
    assert.ok(cajas[1].left>cajas[0].left&&Math.abs(cajas[0].top-cajas[1].top)<3);
    await page.setViewportSize({width:390,height:850});
    await page.waitForFunction(()=>innerWidth<=540);
    const apiladas=await page.locator('.fila-identidad>.campo').evaluateAll(nodes=>
      nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,top:r.top};}));
    const mobileCss=await page.locator('.fila-identidad').evaluate(el=>({
      grid:getComputedStyle(el).gridTemplateColumns,
      width:el.getBoundingClientRect().width,viewport:innerWidth
    }));
    assert.ok(apiladas[1].top>apiladas[0].top,
      'Los campos deben apilarse en móvil: '+JSON.stringify({apiladas,mobileCss}));
    await page.setViewportSize({width:1320,height:920});
    // Rango inválido: no recortar, no perder lo escrito y mantener diálogo.
    await page.locator('#nivel-max').fill('2');
    await page.locator('#nivel-min').fill('10');
    await page.locator('#aplicar-configuracion').click();
    assert.equal(await config.evaluate(x=>x.open),true);
    assert.equal(await page.locator('#nivel-min').inputValue(),'10');
    assert.match(await page.locator('#aviso-nivel').textContent(),/mínimo no puede superar/);
    await page.locator('#nivel-min').fill('1.5');
    assert.match(await page.locator('#aviso-nivel').textContent(),/enteros/);
    await page.locator('#nivel-min').fill('');
    assert.match(await page.locator('#aviso-nivel').textContent(),/enteros/);
    await page.locator('#nivel-min').fill('3');
    await page.locator('#nivel-max').fill('10');
    await check(page,'#resumen-nivel','Niveles 3–10');
    // Un origen vacío debe bloquear la generación y mostrar error dentro.
    await page.locator('#nombre-personaje').fill('Persistencia UI');
    await page.locator('#ocupacion').selectOption('Guerrero');
    await page.locator('#especie').selectOption('Humano común');
    await page.locator('#fuentes-nd20 input').first().uncheck();
    assert.match(await page.locator('#aviso-fuentes').textContent(),/Selecciona al menos una fuente/);
    assert.equal(await page.locator('#opciones-fuentes').getAttribute('aria-invalid'),'true');
    await page.locator('#generar-dialogo').click();
    assert.equal(await config.evaluate(x=>x.open),true);
    assert.equal(await first().count(),0);
    await close();
    await page.locator('#generar').click();
    assert.equal(await config.evaluate(x=>x.open),true);
    assert.match(await page.locator('#aviso-fuentes').textContent(),/Selecciona al menos una fuente/);
    assert.equal(await page.locator('#nombre-personaje').inputValue(),'Persistencia UI');
    await close();
    await page.setViewportSize({width:390,height:850});
    await page.locator('#generar-flotante').evaluate(x=>x.click());
    assert.equal(await config.evaluate(x=>x.open),true);
    await page.locator('#fuentes-nd20 input').first().check();
    assert.equal(await page.locator('#ocupacion').inputValue(),'Guerrero',
      'Recuperar fuentes conserva la Ocupación elegida');
    assert.equal(await page.locator('#especie').inputValue(),'Humano común',
      'Recuperar fuentes conserva la Especie elegida');
    assert.equal(await page.locator('#aviso-fuentes').textContent(),'');
    assert.equal(await page.locator('#opciones-fuentes').getAttribute('aria-invalid'),'false');
    await page.setViewportSize({width:1320,height:920});
    // Generación automática (semilla y rango) + copia independiente.
    await page.locator('#nombre-personaje').fill('');
    await page.locator('#cantidad').fill('7');
    await page.locator('#semilla').fill('');
    await page.locator('#generar-dialogo').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    assert.equal(await page.locator('#fichas .tarjeta').count(),7);
    const acciones=await first().locator('.acciones-pie-ficha .accion-icono')
      .evaluateAll(botones=>botones.map(b=>{
        const caja=b.getBoundingClientRect(),icono=b.querySelector('.icono-accion');
        const mascara=icono&&getComputedStyle(icono).maskImage;
        return {width:caja.width,height:caja.height,
          label:b.getAttribute('aria-label'),title:b.getAttribute('title'),
          decorative:icono?.getAttribute('aria-hidden'),mascara};
      }));
    assert.ok(acciones.length>=4,'Equipo, PDF, Semilla y Copiar usan SVG');
    assert.ok(acciones.every(x=>x.width>=44&&x.height>=44&&x.label&&x.title&&
      x.decorative==='true'&&x.mascara?.includes('/assets/icons/accion-')),
      'Todos los iconos de ficha son cuadrados, legibles y accesibles');
    const niveles=await page.locator('#fichas .nivel-ficha').allTextContents();
    assert.ok(niveles.every(t=>/^Nivel (?:[3-9]|10)$/.test(t)));
    assert.equal(await page.locator('#reproduccion-resultados').isVisible(),false,
      'No mostrar un recuadro de semillas encima de las fichas');
    assert.equal(await page.locator('#fichas .ver-reproduccion').count(),7);
    await first().locator('.ver-reproduccion').click();
    assert.equal(await page.locator('#dialogo-reproduccion').evaluate(x=>x.open),true);
    await check(page,'#titulo-dialogo-reproduccion','Semilla y reproducción');
    assert.match(await page.locator('#reproduccion-personaje').innerText(),/Personaje 7 de 7/);
    const semilla=await page.locator('#semilla-resultado').textContent();
    assert.ok(semilla.length>=6);
    assert.equal(await page.locator('#semilla').inputValue(),'',
      'Generar al azar NO debe fijar la semilla en Configuración');
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'false');
    assert.match(await first().locator('.cabecera-ficha .etiqueta').innerText(),
      /Naufragio d20 · Fantasía Épica/i);
    const fichasPrimera=await page.locator('#fichas .tarjeta').allInnerTexts();
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{
      configurable:true,value:{writeText:async text=>{window.__forjaCopiado=text;}}}));
    await page.locator('#copiar-semilla').click();
    assert.equal(await page.evaluate(()=>window.__forjaCopiado),semilla);
    await page.locator('#copiar-reproduccion').click();
    const json=await page.evaluate(()=>window.__forjaCopiado);
    const registro=JSON.parse(json);
    assert.equal(registro.version,1);
    assert.equal(registro.semilla,semilla);
    assert.equal(registro.config.nivelMin,3);
    assert.equal(registro.config.nivelMax,10);
    assert.deepEqual(registro.config.fuentes,['DRS']);
    await page.locator('#cerrar-reproduccion').click();
    assert.equal(await page.locator('#dialogo-reproduccion').evaluate(x=>x.open),false);
    assert.equal(await first().locator('.ver-reproduccion').count(),1,
      'Cada ficha conserva su acceso incluso con el diálogo cerrado');
    // Dos clics consecutivos en Generar producen resultados nuevos sin borrar nada.
    await page.locator('#generar').click();
    assert.equal(await page.locator('#fichas .tarjeta').count(),14);
    await first().locator('.ver-reproduccion').click();
    const semillaDos=await page.locator('#semilla-resultado').textContent();
    assert.notEqual(semillaDos,semilla,'Cada clic normal requiere azar nuevo');
    await page.locator('#cerrar-reproduccion').click();
    // Una ficha de la primera tanda conserva SU semilla tras otras generaciones.
    await page.locator('#fichas .tarjeta').nth(7).locator('.ver-reproduccion').click();
    assert.equal(await page.locator('#semilla-resultado').textContent(),semilla);
    await page.locator('#copiar-reproduccion').click();
    assert.equal(JSON.parse(await page.evaluate(()=>window.__forjaCopiado)).semilla,semilla);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#dialogo-reproduccion').evaluate(x=>x.open),false);
    assert.equal(await page.locator('#semilla').inputValue(),'');
    const fichasDos=(await page.locator('#fichas .tarjeta').allInnerTexts()).slice(0,7);
    assert.notDeepEqual(fichasDos,fichasPrimera,'El segundo lote no repite el primero');
    // El botón optativo reutiliza la semilla del último lote y abre Configuración.
    await page.locator('#usar-semilla').click();
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#semilla').inputValue(),semillaDos);
    assert.equal(await config.evaluate(x=>x.open),true);
    await page.locator('#generar-dialogo').click();
    const fichasTres=(await page.locator('#fichas .tarjeta').allInnerTexts()).slice(0,7);
    assert.deepEqual(fichasTres,fichasDos,'Usar semilla reproduce el último lote');
    await first().locator('.ver-reproduccion').click();
    assert.equal(await page.locator('#semilla-resultado').textContent(),semillaDos);
    await page.locator('#cerrar-reproduccion').click();
    // Desactivar la semilla mantiene el texto para uso futuro, pero NO repite.
    await page.locator('#usar-semilla').click();
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'false');
    await page.locator('#generar').click();
    await first().locator('.ver-reproduccion').click();
    assert.notEqual(await page.locator('#semilla-resultado').textContent(),semillaDos);
    await page.locator('#cerrar-reproduccion').click();
    assert.equal(await page.locator('#semilla').inputValue(),semillaDos);
    await page.locator('#borrar').click();
    await page.setViewportSize({width:390,height:850});
    assert.equal(await page.locator('#inicio-movil').isVisible(),false,
      'Limpiar mesa no vuelve a mostrar el tutorial cerrado');
    await page.setViewportSize({width:1320,height:920});
    await open();
    await page.locator('#nivel-min').fill('1');
    await page.locator('#nivel-max').fill('1');
    await page.locator('#semilla').fill('otra-secuencia');
    await page.locator('#recuperar-reproduccion summary').click();
    await page.locator('#texto-reproduccion').fill(json);
    await page.locator('#aplicar-reproduccion').click();
    assert.equal(await page.locator('#semilla').inputValue(),semilla);
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'true',
      'Importar un JSON activa automáticamente su semilla');
    await page.locator('#generar-dialogo').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    const fichasSegunda=await page.locator('#fichas .tarjeta').allInnerTexts();
    assert.deepEqual(fichasSegunda,fichasPrimera,
      'La misma configuración y semilla recrean los mismos personajes');
    await first().locator('.ver-reproduccion').click();
    assert.equal(await page.locator('#semilla-resultado').textContent(),semilla);
    await page.locator('#copiar-reproduccion').click();
    assert.equal(await page.evaluate(()=>window.__forjaCopiado),json);
    await page.locator('#cerrar-reproduccion').click();
    await page.locator('#borrar').click();
    await open();
    await page.locator('#semilla').fill('otra-secuencia');
    assert.equal(await page.locator('#usar-semilla').getAttribute('aria-pressed'),'true',
      'Escribir una semilla activa el modo reproducible');
    await page.locator('#generar-dialogo').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    assert.notDeepEqual(await page.locator('#fichas .tarjeta').allInnerTexts(),
      fichasPrimera,'Semilla distinta cambia el lote');
    // Al cambiar el sistema nunca se trunca el intervalo heredado.
    await open();
    await page.locator('#juego').evaluate(x=>{x.value='dh';x.dispatchEvent(new Event('change',{bubbles:true}));});
    await check(page,'#resumen-sistema','Dungeon Hack');
    await check(page,'#resumen-nombre','Lista de Dungeon Hack');
    await page.locator('#nivel-max').fill('36');
    await page.locator('#nivel-min').fill('36');
    await page.locator('#cantidad').fill('1');
    await page.locator('#generar-dialogo').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    assert.equal(await first().locator('.nivel-ficha').innerText(),'Nivel 36');
    await first().locator('.ver-reproduccion').click();
    assert.match(await page.locator('#reproduccion-personaje').innerText(),/./);
    await page.locator('#copiar-reproduccion').click();
    assert.equal(JSON.parse(await page.evaluate(()=>window.__forjaCopiado)).config.juego,'dh');
    await page.locator('#cerrar-reproduccion').click();
    await open();
    await page.locator('#juego').evaluate(x=>{x.value='nd20';x.dispatchEvent(new Event('change',{bubbles:true}));});
    assert.equal(await page.locator('#nivel-max').inputValue(),'36');
    assert.match(await page.locator('#aviso-nivel').textContent(),/entre 1 y 30/);
    await page.locator('#nivel-max').fill('30');
    await page.locator('#nivel-min').fill('30');
    await page.locator('#cantidad').fill('1');
    await page.locator('#nombre-personaje').fill('Equipo E2E');
    await page.locator('#generar-dialogo').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    // Solo se cierra el submenú de Equipo, no todo el panel.
    await first().locator('.gestionar-equipo').click();
    assert.equal(await page.locator('#editor-gestion-equipo').evaluate(x=>x.open),true);
    await page.locator('#gestion-abrir-armamento').click();
    assert.equal(await page.locator('#editor-armamento').evaluate(x=>x.open),true);
    await page.locator('#armamento-cancelar').click();
    assert.equal(await page.locator('#editor-gestion-equipo').evaluate(x=>x.open),true);
    await page.locator('#gestion-cerrar').click();
    assert.deepEqual(errors,[],'Sin errores JavaScript');
    console.log('OK: E2E '+name+' '+(process.env.FORJA_PUBLIC_ROOT?'DRS público':'repositorio'));
  }finally{await browser.close();}
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/index.html';
  try{for(const engine of engines)await run(engine,url);}
  finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
