'use strict';
/* Compatibilidad entre motores: Firefox (Gecko) y WebKit.
 * Playwright se instala solo en el entorno de CI; no es dependencia de la app.
 * `node tests/browser-compatibilidad.js` */
const {firefox,webkit}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');

const raiz=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.resolve(__dirname,'..'));
const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css',
  '.json':'application/json','.svg':'image/svg+xml','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch(error){res.writeHead(400).end();return;}
  const file=path.resolve(raiz,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,bytes)=>{
    if(err){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':(tipos[path.extname(file)]||
      'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});
    res.end(bytes);
  });
});
const capturas=path.join(raiz,'tests','capturas-compatibilidad');
fs.mkdirSync(capturas,{recursive:true});
function precio(texto){
  const match=texto.match(/([\d.]+) mo restantes/);
  if(!match)throw Error('Falta saldo de riqueza: '+texto);
  return Number(match[1]);
}
async function probar(nombre,tipo,url){
  const browser=await tipo.launch({headless:true});
  let context;
  try{
    context=await browser.newContext({viewport:{width:1440,height:900},
      acceptDownloads:true});
    const page=await context.newPage();
    const fallos=[];
    page.on('pageerror',error=>fallos.push(error.message));
    const response=await page.goto(url,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200,'HTML inicial debe cargar');
    await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    assert.equal(await page.locator('#generar').isEnabled(),true);
    const ocupaciones=await page.locator('#ocupacion option').evaluateAll(
      nodes=>nodes.map(x=>x.value).filter(Boolean).sort());
    assert.deepEqual(ocupaciones,['Clérigo','Guerrero','Ladrón','Mago'].sort(),
      nombre+': la edición Fantasía solo publica Ocupaciones DRS');
    assert.equal(await page.locator('#especie option').count(),9,
      nombre+': 8 Especies DRS más selección aleatoria');
    const fuentes=await page.locator('#fuentes-nd20 input').evaluateAll(
      nodes=>nodes.map(x=>({nombre:x.value,checked:x.checked})));
    assert.deepEqual(fuentes,[{nombre:'DRS',checked:true}],
      nombre+': no ofrecer suplementos ocultos en versión DRS');
    // Alternar sistemas no puede recuperar opciones suplementarias ocultas
    // ni dejar un filtro antiguo activo sobre Fantasía.
    for(const otro of ['nd20_cifi','nd20_nocturna','dh']){
      await page.locator('.juegos-compactos [data-juego="'+otro+'"]').click();
      assert.equal(await page.locator('#juego').inputValue(),otro,
        nombre+': selector de sistema '+otro);
    }
    // Comprobar GENERACIÓN, no solo selección, de los tres sistemas que
    // el empaquetado DRS se ha comprometido a preservar sin modificaciones.
    for(const otro of ['nd20_cifi','nd20_nocturna','dh']){
      await page.locator('.juegos-compactos [data-juego="'+otro+'"]').click();
      const opciones=await page.locator('#ocupacion option').evaluateAll(
        nodes=>nodes.map(x=>x.value).filter(Boolean));
      assert.ok(opciones.length>0,nombre+': Ocupaciones disponibles en '+otro);
      await page.selectOption('#ocupacion',opciones[0]);
      const razas=await page.locator('#especie option').evaluateAll(
        nodes=>nodes.map(x=>x.value).filter(Boolean));
      if(razas.length)await page.selectOption('#especie',razas[0]);
      await page.fill('#nombre-personaje','Comprobación '+otro);
      await page.fill('#nivel','1');
      await page.fill('#cantidad','1');
      await page.locator('#generar').click();
      await page.locator('#fichas .tarjeta').first().waitFor();
      assert.ok((await page.locator('#fichas .tarjeta').first().innerText())
        .includes('Comprobación '+otro),
        nombre+': generación de '+otro+' no debe romperse por depurar DLC');
      await page.locator('#borrar').click();
      assert.equal(await page.locator('#fichas .tarjeta').count(),0);
    }
    await page.locator('.juegos-compactos [data-juego="nd20"]').click();
    assert.equal(await page.locator('#juego').inputValue(),'nd20');
    assert.deepEqual(await page.locator('#fuentes-nd20 input').evaluateAll(
      nodes=>nodes.map(x=>({nombre:x.value,checked:x.checked}))),
      [{nombre:'DRS',checked:true}],
      nombre+': volver a Fantasía solo permite DRS');
    assert.deepEqual(await page.locator('#ocupacion option').evaluateAll(
      nodes=>nodes.map(x=>x.value).filter(Boolean).sort()),
      ['Clérigo','Guerrero','Ladrón','Mago'].sort(),
      nombre+': el cambio de sistema no filtra Ocupaciones DLC');
    // Probar los nombres de Ylat sobre la distribución física: la opción
    // de personajes documentados solo existe en la rama de desarrollo.
    const nombresYlat=await page.evaluate(async()=>{
      const respuesta=await fetch('data/tesauro-ylat.json');
      if(!respuesta.ok)throw Error('No se ha podido cargar el tesauro');
      return respuesta.json();
    });
    const combinados=nombresYlat.entradas.filter(x=>x.tipo==='combinado');
    assert.equal(combinados.length,149);
    if(process.env.FORJA_PUBLIC_ROOT){
      assert.equal(nombresYlat.entradas.length,149,
        nombre+': distribución sin PNJ documentados');
      assert.equal(await page.locator('#modo-nombre option[value="documentado"]').count(),0);
    }
    assert.equal(await page.locator('#modo-nombre').inputValue(),'historico');
    assert.equal(await page.locator('#opciones-ambito-nombre').isHidden(),true);
    const bancoHistorico=await page.evaluate(async()=>{
      const respuesta=await fetch('data/nombres-historicos-ylat.json');
      if(!respuesta.ok)throw Error('Banco de nombres de Ylat inaccesible');
      return respuesta.json();
    });
    assert.equal(bancoHistorico.total_filas_fuente,1428);
    assert.equal(new Set(bancoHistorico.entradas.map(x=>x.nombre)).size,1422);
    assert.equal(bancoHistorico.entradas.length,
      process.env.FORJA_PUBLIC_ROOT?1422:1428);
    await page.selectOption('#ocupacion','Guerrero');
    await page.selectOption('#especie','Humano común');
    for(const sexoHistorico of ['masculino','femenino']){
      await page.selectOption('#sexo-pj',sexoHistorico);
      await page.fill('#nombre-personaje','');
      await page.fill('#nivel','1');
      await page.fill('#semilla','Forja-historica-'+nombre+'-'+sexoHistorico);
      await page.locator('#generar').click();
      const tarjeta=page.locator('#fichas .tarjeta').first();
      await tarjeta.waitFor();
      const elegido=await tarjeta.locator('h3').innerText();
      assert.ok(bancoHistorico.entradas.some(x=>x.nombre===elegido),
        nombre+': nombre histórico no reconocido: '+elegido);
      assert.match(await tarjeta.innerText(),/Forma del generador histórico/);
      assert.match(await tarjeta.innerText(),/sin clasificación documental de sexo/);
      await page.locator('#borrar').click();
    }
    await page.selectOption('#modo-nombre','combinado');
    assert.equal(await page.locator('#opciones-ambito-nombre').isVisible(),true);
    await page.selectOption('#ocupacion','Guerrero');
    await page.selectOption('#especie','Humano común');
    await page.selectOption('#sexo-pj','femenino');
    for(const ambito of ['Niguace','Isla Tormenta']){
      await page.selectOption('#modo-nombre','combinado');
      await page.selectOption('#ambito-nombre',ambito);
      await page.fill('#nombre-personaje','');
      await page.fill('#semilla','Forja-nombre-'+nombre+'-'+ambito);
      await page.fill('#nivel','1');
      await page.locator('#generar').click();
      const tarjeta=page.locator('#fichas .tarjeta').first();
      await tarjeta.waitFor();
      const nombreGenerado=await tarjeta.locator('h3').innerText();
      assert.ok(combinados.some(x=>x.ambito===ambito&&x.nombre===nombreGenerado),
        nombre+': el nombre '+nombreGenerado+' debe proceder solo de '+ambito);
      assert.match(await tarjeta.innerText(),/No identifica un personaje canónico/);
      await page.locator('#borrar').click();
    }
    await page.selectOption('#modo-nombre','especie');
    assert.equal(await page.locator('#opciones-ambito-nombre').isHidden(),true);
    await page.selectOption('#modo-nombre','combinado');
    assert.equal(await page.locator('#opciones-ambito-nombre').isVisible(),true);
    await page.selectOption('#ambito-nombre','todos');
    await page.selectOption('#sexo-pj','aleatorio');
    await page.selectOption('#ocupacion','Guerrero');
    await page.selectOption('#especie','Humano común');
    await page.fill('#nombre-personaje','Compatibilidad '+nombre);
    await page.fill('#semilla','Forja-compatibilidad-'+nombre);
    await page.fill('#nivel','30');
    await page.locator('#riqueza-por-nivel').check();
    await page.locator('#generar').click();
    await page.locator('#fichas .tarjeta').first().waitFor();
    const ficha=page.locator('#fichas .tarjeta').first();
    const inicial=precio(await ficha.locator('.riqueza').innerText());
    await ficha.locator('.comprar-utiles').click();
    assert.equal(await page.locator('#editor-compras').isVisible(),true);
    assert.equal(await page.locator('#compras-articulo option').count(),43,
      nombre+': 41 útiles DRS + dos focos documentados');
    await page.selectOption('#compras-articulo','campamento-martillo');
    await page.fill('#compras-cantidad','2');
    await page.locator('#compras-anadir').click();
    assert.equal(await page.locator('#compras-lista li').count(),1);
    assert.match(await page.locator('#compras-total').innerText(),/4\.00 mo/);
    await page.locator('#compras-cancelar').click();
    assert.equal(precio(await ficha.locator('.riqueza').innerText()),inicial,
      nombre+': cancelar no puede descontar dinero');
    assert.equal(await page.locator('#editor-compras').isHidden(),true);

    // Volver a abrir: el carrito se vacía y se puede editar por línea.
    await ficha.locator('.comprar-utiles').click();
    assert.equal(await page.locator('#compras-lista li').count(),0);
    await page.selectOption('#compras-articulo','campamento-martillo');
    await page.fill('#compras-cantidad','2');
    await page.locator('#compras-cantidad').press('Enter');
    assert.equal(await page.locator('#editor-compras').isVisible(),true,
      nombre+': Intro no confirma el carrito');
    assert.equal(await page.locator('#compras-lista li').count(),1);
    await page.selectOption('#compras-articulo','aventura-tiza');
    await page.fill('#compras-cantidad','3');
    await page.locator('#compras-anadir').click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.03 mo/);
    await page.locator('.compras-quitar-linea').last().click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.00 mo/);
    await page.selectOption('#compras-articulo','aventura-tiza');
    await page.fill('#compras-cantidad','3');
    await page.locator('#compras-anadir').click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.03 mo/);
    await page.selectOption('#compras-articulo','consumible-antidoto');
    await page.fill('#compras-cantidad','1');
    await page.fill('#compras-nivel','3');
    assert.match(await page.locator('#compras-detalle').innerText(),/150\.00 mo/,
      nombre+': Antídoto Nivel 3 vale 150 mo');
    await page.selectOption('#compras-articulo','herramienta-catalejo');
    await page.fill('#compras-cantidad','99');
    await page.locator('#compras-anadir').click();
    assert.match(await page.locator('#estado').innerText(),/presupuesto/i);
    assert.equal(await page.locator('#compras-lista li').count(),2,
      nombre+': sobrepresupuesto deja carrito intacto');
    await page.locator('#compras-confirmar').click();
    assert.equal(await page.locator('#editor-compras').isHidden(),true);
    assert.ok((await ficha.innerText()).includes('Martillo de campamento ×2'));
    assert.ok((await ficha.innerText()).includes('Tiza ×3'));
    const despues=precio(await ficha.locator('.riqueza').innerText());
    assert.ok(Math.abs(inicial-despues-4.03)<.001,
      nombre+': descontar exactamente 4,03 mo al confirmar');
    await ficha.locator('.comprar-utiles').click();
    assert.match(await page.locator('#resumen-compras').innerText(),
      new RegExp(despues.toFixed(2)+' mo'),'Saldo actualizado al reabrir');
    await page.setViewportSize({width:390,height:844});
    const medidas=await page.evaluate(()=>({
      pagina:document.documentElement.scrollWidth,
      ventana:window.innerWidth,
      campo:document.querySelector('#compras-articulo').getBoundingClientRect().width
    }));
    assert.ok(medidas.pagina<=medidas.ventana+2,
      nombre+': el editor abierto no desborda en móvil');
    assert.ok(medidas.campo>100,'Selector móvil utilizable');
    await page.locator('#editor-compras').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(capturas,nombre+'-movil.png')});
    await page.locator('#compras-cancelar').click();
    assert.deepEqual(fallos,[],nombre+': no debe haber excepciones no capturadas');
    console.log('OK · '+nombre+': 4 Ocupaciones, 8 Especies, compras, Intro, cancelar,'+
      ' precio por Nivel, quitar, presupuesto, móvil y cero excepciones.');
  }finally{
    if(context)await context.close();
    await browser.close();
  }
}
async function main(){
  await new Promise((resolve,reject)=>{
    server.once('error',reject);
    server.listen(0,'127.0.0.1',resolve);
  });
  try{
    const url='http://127.0.0.1:'+server.address().port+'/index.html';
    for(const [nombre,tipo] of [['firefox',firefox],['webkit',webkit]])
      await probar(nombre,tipo,url);
  }finally{
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{
  console.error('FALLO DE COMPATIBILIDAD:',error.stack||error);
  process.exitCode=1;
});
