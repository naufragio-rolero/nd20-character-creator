'use strict';
/* Prueba E2E del editor de compras con Chrome/Chromium real, sin npm.
 * Node.js 22+ (WebSocket nativo). Ejecutar: node tests/browser-compras.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const raiz=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.resolve(__dirname,'..'));
const dormir=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
function comandoChrome(){
  const candidatos=[process.env.CHROME_BIN,'chromium','chromium-browser',
    'google-chrome','google-chrome-stable'].filter(Boolean);
  for(const c of candidatos){
    const r=spawnSync(c,['--version'],{encoding:'utf8',timeout:3000});
    if(!r.error&&r.status===0)return c;
  }
  throw Error('No hay Chrome/Chromium instalado. Definir CHROME_BIN o instalar Chromium; no se omite la prueba.');
}
function servidorEstatico(){
  const tipos={'.html':'text/html','.js':'text/javascript','.css':'text/css',
    '.json':'application/json','.svg':'image/svg+xml','.txt':'text/plain'};
  return http.createServer((req,res)=>{
    let url;
    try{url=new URL(req.url,'http://localhost');}catch(e){res.writeHead(400);res.end();return;}
    const pedido=decodeURIComponent(url.pathname);
    const archivo=path.resolve(raiz,'.'+pedido);
    if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(archivo,(err,bytes)=>{
      if(err){res.writeHead(404);res.end('Archivo inexistente');return;}
      res.writeHead(200,{'Content-Type':(tipos[path.extname(archivo)]||'application/octet-stream')+'; charset=utf-8',
        'Cache-Control':'no-store'});
      res.end(bytes);
    });
  });
}
async function abrirCDP(port){
  let target;
  for(let n=0;n<50;n++){
    try{
      const resp=await fetch('http://127.0.0.1:'+port+'/json/list');
      const items=await resp.json();
      target=items.find(x=>x.type==='page');
      if(target)break;
    }catch(e){}
    await dormir(100);
  }
  if(!target)throw Error('Chrome no expuso ninguna pestaña de navegación.');
  const socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
  });
  let i=0;
  const pendientes=new Map(),errores=[];
  socket.addEventListener('message',ev=>{
    const m=JSON.parse(ev.data);
    if(m.method==='Runtime.exceptionThrown')
      errores.push(m.params.exceptionDetails.text||'Excepción JS del navegador');
    if(m.id&&pendientes.has(m.id)){
      const op=pendientes.get(m.id);pendientes.delete(m.id);
      if(m.error)op.reject(Error(m.error.message));
      else op.resolve(m.result);
    }
  });
  function enviar(method,params={}){
    const id=++i;
    return new Promise((resolve,reject)=>{
      pendientes.set(id,{resolve,reject});
      socket.send(JSON.stringify({id,method,params}));
    });
  }
  async function evalJS(source){
    const ans=await enviar('Runtime.evaluate',{
      expression:source,returnByValue:true,awaitPromise:true});
    if(ans.exceptionDetails)throw Error(
      'JS navegador: '+(ans.exceptionDetails.exception?.description||
        ans.exceptionDetails.text||'Excepción desconocida'));
    return ans.result?.value;
  }
  async function esperar(source,mensaje){
    for(let k=0;k<150;k++){
      if(await evalJS('Boolean('+source+')'))return;
      await dormir(100);
    }
    throw Error('Tiempo de espera agotado: '+mensaje+'; estado='+
      await evalJS("document.querySelector('#estado')?.textContent"));
  }
  await enviar('Runtime.enable');
  await enviar('Page.enable');
  return {socket,enviar,evalJS,esperar,errores};
}
async function main(){
  const navegador=comandoChrome();
  const perfil=fs.mkdtempSync(path.join(os.tmpdir(),'forja-chrome-'));
  const server=servidorEstatico();
  let chrome,cdp;
  try{
    await new Promise((resolve,reject)=>{
      server.once('error',reject);
      server.listen(0,'127.0.0.1',resolve);
    });
    // Los runners compartidos pueden sufrir fallos transitorios al abrir
    // Chrome. Reintentar SOLO el arranque, nunca repetir una aserción fallida.
    let puerto=0,diagnosticos=[];
    for(let intento=1;intento<=2&&!puerto;intento++){
      const perfilIntento=path.join(perfil,'sesion-'+intento);
      fs.mkdirSync(perfilIntento,{recursive:true});
      chrome=spawn(navegador,['--headless=new','--no-sandbox','--disable-gpu',
        '--disable-background-networking','--disable-dev-shm-usage',
        '--no-first-run','--no-default-browser-check',
        '--remote-allow-origins=*','--remote-debugging-port=0',
        '--user-data-dir='+perfilIntento,'about:blank'],
        {stdio:['ignore','ignore','pipe']});
      let erroresChrome='';
      chrome.stderr.on('data',bloque=>{
        erroresChrome=(erroresChrome+bloque.toString()).slice(-3500);
      });
      const puertoArchivo=path.join(perfilIntento,'DevToolsActivePort');
      for(let i=0;i<150;i++){
        if(chrome.exitCode!==null||chrome.signalCode!==null)break;
        if(fs.existsSync(puertoArchivo)){
          puerto=Number(fs.readFileSync(puertoArchivo,'utf8').split('\n')[0]);
          if(puerto)break;
        }
        await dormir(100);
      }
      if(!puerto){
        diagnosticos.push('Intento '+intento+
          ', salida='+chrome.exitCode+', señal='+chrome.signalCode+
          ', stderr='+erroresChrome);
        chrome.kill('SIGKILL');
        await dormir(300);
      }
    }
    if(!puerto)throw Error('Chrome no inició su puerto de depuración tras dos arranques. '+
      diagnosticos.join(' / '));
    cdp=await abrirCDP(puerto);
    // Capturar y probar de verdad el escritorio, no el tamaño por defecto
    // de Chrome headless (780 px, que activa el menú de tableta).
    await cdp.enviar('Emulation.setDeviceMetricsOverride',{
      width:1440,height:900,deviceScaleFactor:1,mobile:false});
    const base='http://127.0.0.1:'+server.address().port+'/index.html';
    await cdp.enviar('Page.navigate',{url:base});
    // La aplicación solo habilita Generar al terminar de cargar los datos.
    // Esperar el mensaje real de carga evita carreras en la comprobación.
    await cdp.esperar("document.querySelector('#estado')?.textContent.includes('Datos listos')"+
      " && document.querySelector('#generar')?.disabled===false"+
      " && document.querySelectorAll('#fuentes-nd20 input:checked').length===1",
      'carga inicial de JSON y controles de Forja');
    const fuentes=await cdp.evalJS("Array.from(document.querySelectorAll('#ocupacion option')).map(x=>x.value).filter(Boolean)");
    assert.deepEqual(fuentes.sort(),['Clérigo','Guerrero','Ladrón','Mago'].sort(),
      'La interfaz DRS no debe mostrar Ocupaciones DLC');
    const especies=await cdp.evalJS("Array.from(document.querySelectorAll('#especie option')).map(x=>x.value).filter(Boolean)");
    assert.equal(especies.length,8,'Solo ocho Especies DRS publicadas');
    assert.equal(await cdp.evalJS("document.querySelector('#modo-nombre').value"),
      'historico','Por defecto se ofrece el banco histórico de 1422 formas Ylat');
    assert.equal(await cdp.evalJS("document.querySelector('#ambito-nombre').value"),
      'todos','Sin procedencia restringida de forma implícita');
    const tesauroPagina=await cdp.evalJS("(async()=>{"+
      "let r=await fetch('data/tesauro-ylat.json');return await r.json()})()");
    assert.equal(tesauroPagina.entradas.filter(x=>x.tipo==='combinado').length,149);
    const bancoHistorico=await cdp.evalJS("(async()=>{"+
      "let r=await fetch('data/nombres-historicos-ylat.json');return await r.json()})()");
    assert.equal(bancoHistorico.total_filas_fuente,1428);
    assert.equal(new Set(bancoHistorico.entradas.map(x=>x.nombre)).size,1422);
    assert.equal(bancoHistorico.entradas.length,
      process.env.FORJA_PUBLIC_ROOT?1422:1428);
    if(process.env.FORJA_PUBLIC_ROOT){
      assert.equal(tesauroPagina.entradas.length,149,
        'Los nombres de 51 PNJ documentados no aparecen en la distribución');
      assert.equal(await cdp.evalJS(
        "document.querySelector('#modo-nombre option[value=documentado]')===null"),
        true,'La opción de PNJ documentados se oculta en la versión pública');
    }
    await cdp.evalJS("(()=>{"+
      "document.querySelector('#ocupacion').value='Guerrero';"+
      "document.querySelector('#especie').value='Humano común';"+
      "document.querySelector('#nivel').value='30';"+
      "document.querySelector('#riqueza-por-nivel').checked=true;"+
      "document.querySelector('#cantidad').value='2';"+
      "document.querySelector('#nombre-personaje').value='Control E2E';"+
      "document.querySelector('#semilla').value='E2E-compras-saldos';"+
      "document.querySelector('#configuracion').requestSubmit();"+
      "})()");
    await cdp.esperar("document.querySelectorAll('#fichas .tarjeta').length===2",
      'generación de dos fichas');
    let estado=await cdp.evalJS("Array.from(document.querySelectorAll('#fichas .tarjeta')).map(x=>({"+
      "id:x.dataset.id,html:x.innerHTML,riqueza:x.querySelector('.riqueza')?.textContent}))");
    const primera=estado[0],segunda=estado[1];
    assert.ok(primera.riqueza&&segunda.riqueza);
    assert.equal(await cdp.evalJS("document.querySelectorAll('.comprar-utiles').length"),2);
    await cdp.evalJS("document.querySelectorAll('.comprar-utiles')[0].click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),false);
    assert.equal(await cdp.evalJS("document.activeElement.id"),'compras-articulo',
      'Abrir compras debe situar el foco en el selector de artículos');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-articulo option').length"),43);
    const nombres=await cdp.evalJS("Array.from(document.querySelectorAll('#compras-articulo option')).map(x=>x.textContent)");
    assert.ok(nombres.some(x=>x.startsWith('Martillo de campamento · 2 mo')));
    assert.ok(!nombres.some(x=>x.startsWith('Almádena ·')),
      'El arma Almádena no se mezcla con la herramienta renombrada');
    // Carrito temporal: cancelar no debe cambiar ninguna de las fichas.
    await cdp.evalJS("(()=>{var sel=document.querySelector('#compras-articulo');"+
      "sel.value='campamento-martillo';sel.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var n=document.querySelector('#compras-cantidad');n.value='2';"+
      "n.dispatchEvent(new Event('input',{bubbles:true}));"+
      "document.querySelector('#compras-anadir').click();})()");
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('4.00 mo'));
    // Pulsar Intro en cantidad no debe confirmar una compra con carrito
    // pendiente. Su efecto es añadir esa línea, como el botón Añadir.
    await cdp.evalJS("document.querySelector('#compras-cantidad').focus()");
    await cdp.enviar('Input.dispatchKeyEvent',{
      type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    await cdp.enviar('Input.dispatchKeyEvent',{
      type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),false,
      'Intro en cantidad no confirma accidentalmente el carrito');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2,
      'Intro en cantidad añade otra línea al carrito');
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('8.00 mo'));
    await cdp.evalJS("document.querySelector('#compras-cancelar').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),true);
    assert.equal(await cdp.evalJS("document.activeElement.classList.contains('comprar-utiles')"),true,
      'Cancelar devuelve el foco al botón de compras del personaje');
    estado=await cdp.evalJS("Array.from(document.querySelectorAll('#fichas .tarjeta')).map(x=>x.innerHTML)");
    assert.equal(estado[0],primera.html,'Cancelar no modifica la primera ficha');
    assert.equal(estado[1],segunda.html,'Cancelar no modifica la ficha ajena');
    // Compra confirmada: 2 martillos + 3 tizas = 4,03 mo.
    await cdp.evalJS("document.querySelectorAll('.comprar-utiles')[0].click()");
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),0);
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "s.value='campamento-martillo';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='2';"+
      "document.querySelector('#compras-anadir').click();"+
      "s.value='aventura-tiza';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='3';"+
      "document.querySelector('#compras-anadir').click();})()");
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2);
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('4.03 mo'));
    // Quitar una línea no debe borrar la compra ni tocar la ficha.
    await cdp.evalJS("document.querySelectorAll('.compras-quitar-linea')[1].click()");
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),1);
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('4.00 mo'));
    assert.equal(await cdp.evalJS("document.activeElement.classList.contains('compras-quitar-linea')"),true,
      'Quitar una línea mantiene el foco dentro del carrito');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#fichas .tarjeta')[0].innerHTML"),
      primera.html,'Editar el carrito no altera la ficha antes de confirmar');
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "s.value='aventura-tiza';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='3';"+
      "document.querySelector('#compras-anadir').click();})()");
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2);
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('4.03 mo'));
    // Evidencia visual reproducible: escritorio con carrito abierto.
    const capturas=path.join(raiz,'tests','capturas-e2e');
    fs.mkdirSync(capturas,{recursive:true});
    await cdp.evalJS("(async()=>{"+
      "document.documentElement.style.scrollBehavior='auto';"+
      "var panel=document.querySelector('#editor-compras');"+
      "window.scrollTo({top:Math.max(0,panel.getBoundingClientRect().top+window.scrollY-160),"+
      "behavior:'instant'});"+
      "await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));"+
      "})()");
    const vistaDesktop=await cdp.evalJS("({ancho:window.innerWidth,"+
      "editor:document.querySelector('#editor-compras').getBoundingClientRect().width,"+
      "panel:document.querySelector('#panel-forja').getBoundingClientRect().width,"+
      "scroll:document.documentElement.scrollWidth})");
    assert.equal(vistaDesktop.ancho,1440,'La prueba de escritorio utiliza 1440 px reales');
    assert.ok(vistaDesktop.panel>200,'El panel lateral de escritorio está visible');
    assert.ok(vistaDesktop.editor>500,'El editor de escritorio tiene anchura usable');
    assert.ok(vistaDesktop.scroll<=1442,'No hay desbordamiento en escritorio');
    const imagenDesktop=await cdp.enviar('Page.captureScreenshot',{
      format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(capturas,'compras-escritorio.png'),
      Buffer.from(imagenDesktop.data,'base64'));
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "s.value='consumible-antidoto';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='1';"+
      "document.querySelector('#compras-cantidad').dispatchEvent(new Event('input',{bubbles:true}));"+
      "document.querySelector('#compras-nivel').value='3';"+
      "document.querySelector('#compras-nivel').dispatchEvent(new Event('input',{bubbles:true}));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#compras-campo-nivel').hidden"),false);
    assert.ok((await cdp.evalJS("document.querySelector('#compras-detalle').textContent"))
      .includes('150.00 mo'),'Antídoto Nivel 3 = 150 mo');
    // Un intento de añadir una compra imposible no modifica el carrito.
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "s.value='herramienta-catalejo';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='99';"+
      "document.querySelector('#compras-anadir').click();})()");
    assert.equal(await cdp.evalJS("document.querySelector('#estado').classList.contains('error')"),true);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2);
    await cdp.evalJS("document.querySelector('#form-compra-utiles').requestSubmit()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),true);
    assert.equal(await cdp.evalJS("document.activeElement.classList.contains('comprar-utiles')"),true,
      'Confirmar la compra devuelve el foco a la ficha actualizada');
    estado=await cdp.evalJS("Array.from(document.querySelectorAll('#fichas .tarjeta')).map(x=>({"+
      "html:x.innerHTML,riqueza:x.querySelector('.riqueza')?.textContent}))");
    assert.ok(estado[0].html.includes('Martillo de campamento ×2'));
    assert.ok(estado[0].html.includes('Tiza ×3'));
    assert.equal(estado[1].html,segunda.html,'La segunda ficha permanece intacta');
    const dinero=(x)=>Number(x.match(/(\d+(?:\.\d+)?) mo restantes/)?.[1]);
    assert.ok(Math.abs(dinero(primera.riqueza)-dinero(estado[0].riqueza)-4.03)<.001,
      'Se descuentan exactamente 4,03 mo al confirmar');
    // Copiar y exportar deben reflejar el inventario y saldo actualizado.
    await cdp.evalJS("(()=>{window.__textoCopiado='';"+
      "Object.defineProperty(navigator,'clipboard',{configurable:true,"+
      "value:{writeText:async function(t){window.__textoCopiado=t;}}});"+
      "document.querySelectorAll('.copiar-ficha')[0].click();})()");
    await cdp.esperar("window.__textoCopiado.includes('Martillo de campamento ×2')",
      'contenido actualizado en portapapeles');
    const copiado=await cdp.evalJS("window.__textoCopiado");
    assert.ok(copiado.includes('Tiza ×3'));
    assert.ok(copiado.includes(String(dinero(estado[0].riqueza))+' mo restantes'));
    const exportado=await cdp.evalJS("(async()=>{"+
      "const original=URL.createObjectURL;"+
      "let capturado;URL.createObjectURL=function(blob){capturado=blob;return original.call(this,blob);};"+
      "try{document.querySelector('#exportar').click();"+
      "return capturado?await capturado.text():null;}finally{URL.createObjectURL=original;}})()");
    assert.ok(exportado.includes('Martillo de campamento ×2'));
    assert.ok(exportado.includes('Tiza ×3'));
    assert.ok(exportado.includes('4.03 mo'));
    // Reabrir tras comprar debe reflejar el saldo actualizado, no el original.
    await cdp.evalJS("document.querySelectorAll('.comprar-utiles')[0].click()");
    assert.ok((await cdp.evalJS("document.querySelector('#resumen-compras').textContent"))
      .includes(dinero(estado[0].riqueza).toFixed(2)+' mo'));
    await cdp.evalJS("document.querySelector('#fichas .tarjeta .eliminar-ficha').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),true);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#fichas .tarjeta').length"),1);
    // El formulario de compras debe mantener su jerarquía sin desbordarse en móvil.
    await cdp.enviar('Emulation.setDeviceMetricsOverride',{
      width:390,height:844,deviceScaleFactor:1,mobile:true});
    const movil=await cdp.evalJS("({ancho:document.documentElement.scrollWidth,"+
      "ventana:window.innerWidth,botones:document.querySelectorAll('.comprar-utiles').length})");
    assert.ok(movil.ancho<=movil.ventana+2,'La página no debe desbordar horizontalmente en móvil');
    assert.equal(movil.botones,1);
    await cdp.evalJS("document.querySelector('.comprar-utiles').click()");
    const movilEditor=await cdp.evalJS("({ancho:document.documentElement.scrollWidth,"+
      "ventana:window.innerWidth,visible:!document.querySelector('#editor-compras').hidden,"+
      "campo:document.querySelector('#compras-articulo').getBoundingClientRect().width})");
    assert.ok(movilEditor.visible,'El editor puede abrirse en móvil');
    assert.ok(movilEditor.ancho<=movilEditor.ventana+2,
      'El editor abierto tampoco debe desbordarse horizontalmente');
    assert.ok(movilEditor.campo>100,'El selector de útiles conserva anchura usable');
    await cdp.evalJS("(async()=>{"+
      "document.documentElement.style.scrollBehavior='auto';"+
      "var panel=document.querySelector('#editor-compras');"+
      "window.scrollTo({top:Math.max(0,panel.getBoundingClientRect().top+window.scrollY-16),"+
      "behavior:'instant'});"+
      "await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));"+
      "})()");
    const imagenMovil=await cdp.enviar('Page.captureScreenshot',{
      format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(capturas,'compras-movil.png'),
      Buffer.from(imagenMovil.data,'base64'));
    await cdp.evalJS("document.querySelector('#compras-cancelar').click()");
    assert.deepEqual(cdp.errores,[],'El navegador no debe lanzar errores JS');
    console.log('OK · Chromium real: datos DRS, dos fichas, cancelar, importe 4,03 mo,'+
      ' Antídoto por Nivel, sobrepresupuesto, copiar, exportar, borrar y móvil.');
  }finally{
    if(cdp){try{cdp.socket.close();}catch(e){}}
    if(chrome){try{chrome.kill('SIGKILL');}catch(e){}}
    await new Promise(resolve=>server.close(resolve));
    fs.rmSync(perfil,{recursive:true,force:true});
  }
}
main().catch(error=>{console.error('FALLO E2E Chromium:',error.stack||error);process.exitCode=1;});
