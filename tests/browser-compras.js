'use strict';
/* Prueba E2E del editor de compras con Chrome/Chromium real, sin npm.
 * Node.js 22+ (WebSocket nativo). Ejecutar: node tests/browser-compras.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const raiz=path.resolve(__dirname,'..');
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
    chrome=spawn(navegador,['--headless=new','--no-sandbox','--disable-gpu',
      '--disable-dev-shm-usage','--no-first-run','--no-default-browser-check',
      '--remote-allow-origins=*','--remote-debugging-port=0',
      '--user-data-dir='+perfil,'about:blank'],{stdio:'ignore'});
    const puertoArchivo=path.join(perfil,'DevToolsActivePort');
    let puerto=0;
    for(let i=0;i<120;i++){
      if(chrome.exitCode!==null)throw Error('Chrome terminó prematuramente: '+chrome.exitCode);
      if(fs.existsSync(puertoArchivo)){
        puerto=Number(fs.readFileSync(puertoArchivo,'utf8').split('\n')[0]);break;
      }
      await dormir(100);
    }
    if(!puerto)throw Error('Chrome no inició su puerto de depuración.');
    cdp=await abrirCDP(puerto);
    const base='http://127.0.0.1:'+server.address().port+'/index.html';
    await cdp.enviar('Page.navigate',{url:base});
    await cdp.esperar("document.querySelector('#generar')?.disabled===false",
      'carga inicial de JSON y controles de Forja');
    const fuentes=await cdp.evalJS("Array.from(document.querySelectorAll('#ocupacion option')).map(x=>x.value).filter(Boolean)");
    assert.deepEqual(fuentes.sort(),['Clérigo','Guerrero','Ladrón','Mago'].sort(),
      'La interfaz DRS no debe mostrar Ocupaciones DLC');
    const especies=await cdp.evalJS("Array.from(document.querySelectorAll('#especie option')).map(x=>x.value).filter(Boolean)");
    assert.equal(especies.length,8,'Solo ocho Especies DRS publicadas');
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
    await cdp.evalJS("document.querySelector('#compras-cancelar').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').hidden"),true);
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
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "s.value='consumible-antidoto';s.dispatchEvent(new Event('change',{bubbles:true}));"+
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
