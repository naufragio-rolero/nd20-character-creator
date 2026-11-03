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
    // Chromium: los Talentos DRS también abren en hover, con texto único.
    const talentoChrome=await cdp.evalJS("(()=>{"+
      "const b=document.createElement('button');b.type='button';"+
      "b.className='referencia-glosario';b.dataset.glosaGrupo='talento';"+
      "b.dataset.glosaSistema='nd20';"+
      "b.dataset.glosaId='talento-drs-especie-elfo-agreste-rapidez';"+
      "document.body.appendChild(b);"+
      "b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse'}));"+
      "const c=document.querySelector('#ficha-emergente');"+
      "const previo={visible:!c.hidden,role:c.getAttribute('role'),"+
      "categoria:c.querySelector('.info-categoria')?.textContent,"+
      "descripciones:c.querySelectorAll('.info-descripcion').length,"+
      "sinGlosas:c.querySelectorAll('.info-resumen-editorial,.info-uso-editorial').length};"+
      "b.click();const fijado=c.getAttribute('role');"+
      "document.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'Escape'}));"+
      "const cerrado=c.hidden;b.remove();return {...previo,fijado,cerrado};"+
      "})()");
    assert.deepEqual(talentoChrome,{visible:true,role:'tooltip',categoria:'Mejora',
      descripciones:1,sinGlosas:0,fijado:'dialog',cerrado:true},
      'Chromium: hover y clic fijado conservan categoría oficial y texto DRS único');
    const fuentes=await cdp.evalJS("Array.from(document.querySelectorAll('#ocupacion option')).map(x=>x.value).filter(Boolean)");
    assert.deepEqual(fuentes.sort(),['Clérigo','Guerrero','Ladrón','Mago'].sort(),
      'La interfaz DRS no debe mostrar Ocupaciones DLC');
    const especies=await cdp.evalJS("Array.from(document.querySelectorAll('#especie option')).map(x=>x.value).filter(Boolean)");
    assert.equal(especies.length,8,'Solo ocho Especies DRS publicadas');
    const controlesVisuales=await cdp.evalJS("({"+
      "especies:document.querySelectorAll('#selector-visual-especie button').length,"+
      "ocupaciones:document.querySelectorAll('#selector-visual-ocupacion button').length,"+
      "iconos:document.querySelectorAll('.selector-visual .icono-svg').length,"+
      "flotante:!document.querySelector('#generar-flotante').disabled,"+
      "avanzada:document.querySelector('#informacion-avanzada').checked"+
      "})");
    assert.deepEqual(controlesVisuales,{
      especies:9,ocupaciones:5,iconos:12,flotante:true,avanzada:false
    },'12 SVG, opciones aleatorias, flotante y vista compacta predeterminada');
    assert.equal(await cdp.evalJS("document.querySelector('#modo-nombre').value"),
      'generico','El generador genérico compone dos formas distintas por defecto');
    assert.equal(await cdp.evalJS(
      "document.querySelectorAll('#modo-nombre option').length"),2,
      'Solo dos generadores visibles');
    assert.equal(await cdp.evalJS(
      "document.querySelector('#buscar-nombre-ylat')===null"),true,
      'La lista documental ya no ocupa espacio en el generador');
    const tesauroPagina=await cdp.evalJS("(async()=>{"+
      "let r=await fetch('data/tesauro-ylat.json');return await r.json()})()");
    assert.equal(tesauroPagina.entradas.filter(x=>x.tipo==='combinado').length,33);
    assert.ok(!/niguac|niguaz/i.test(JSON.stringify(tesauroPagina)),
      'El tesauro obtenido por el navegador no incluye el corpus excluido');
    const bancoHistorico=await cdp.evalJS("(async()=>{"+
      "let r=await fetch('data/nombres-historicos-ylat.json');return await r.json()})()");
    assert.equal(bancoHistorico.total_filas_fuente,1428);
    assert.equal(new Set(bancoHistorico.entradas.map(x=>x.nombre)).size,1422);
    assert.equal(bancoHistorico.entradas.length,
      process.env.FORJA_PUBLIC_ROOT?1422:1428);
    if(process.env.FORJA_PUBLIC_ROOT){
      assert.equal(tesauroPagina.entradas.length,295,
        'El archivo documental se conserva íntegro, aunque no exista listado visible');
      assert.equal(await cdp.evalJS(
        "document.querySelector('#modo-nombre option[value=documentado]')===null"),
        true,'La opción documentada no participa en el sorteo público');
    }
    const componentes=await cdp.evalJS("(async()=>{"+
      "let r=await fetch('data/componentes-nombres-ylat.json');return await r.json()})()");
    assert.equal(componentes.nombres.length,255);
    assert.equal(componentes.apellidos.length,133);
    await cdp.evalJS("(()=>{"+
      "document.querySelector('#ocupacion').value='Guerrero';"+
      "document.querySelector('#especie').value='Humano común';"+
      "document.querySelector('#nivel-min').value='30';document.querySelector('#nivel-max').value='30';"+
      "document.querySelector('#riqueza-por-nivel').checked=true;"+
      "document.querySelector('#cantidad').value='2';"+
      "document.querySelector('#nombre-personaje').value='Control E2E';"+
      "document.querySelector('#semilla').value='E2E-compras-saldos';"+
      "document.querySelector('#generar-flotante').click();"+
      "})()");
    await cdp.esperar("document.querySelectorAll('#fichas .tarjeta').length===2",
      'generación de dos fichas');
    // Informe de LoKoO: Nivel 99 no debe provocar un clic silencioso.
    await cdp.evalJS("(()=>{let n=document.querySelector('#nivel-min');n.value='99';"+
      "n.dispatchEvent(new Event('input',{bubbles:true}));"+
      "document.querySelector('#configuracion').requestSubmit(document.querySelector('#generar'));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#nivel-min').value"),'99',
      'No se cambia silenciosamente el Nivel del usuario');
    assert.match(await cdp.evalJS("document.querySelector('#aviso-nivel').textContent"),
      /entre 1 y 30/,'La Forja explica el rango permitido');
    assert.equal(await cdp.evalJS("document.querySelector('#dialogo-configuracion').open"),
      true,'La configuración se abre al intentar generar fuera de rango');
    assert.equal(await cdp.evalJS("document.querySelector('#nivel-min').getAttribute('aria-invalid')"),
      'true');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#fichas .tarjeta').length"),2,
      'Nivel 99 no genera personajes');
    await cdp.evalJS("(()=>{let n=document.querySelector('#nivel-min');n.value='30';"+
      "n.dispatchEvent(new Event('input',{bubbles:true}));"+
      "document.querySelector('#cerrar-configuracion').click();})()");
    assert.equal(await cdp.evalJS("document.querySelector('#aviso-nivel').textContent"),'');
    assert.equal(await cdp.evalJS("document.querySelector('#dialogo-configuracion').open"),false);
    // Confirmar el caso de uso principal: popup visible con el efecto
    // completo de Recuperación, no solo la etiqueta del Talento.
    const infoRecuperacion=await cdp.evalJS("(()=>{"+
      "let b=document.querySelector('#fichas .tarjeta .referencia-glosario[data-glosa-nombre=\"Recuperación\"]');"+
      "if(!b)return {enlace:false};b.click();"+
      "let c=document.querySelector('#ficha-emergente');"+
      "return {enlace:true,visible:!!c&&!c.hidden,texto:c?.querySelector('.info-descripcion')?.textContent||''}"+
      "})()");
    assert.equal(infoRecuperacion.enlace,true,
      'El Talento Recuperación debe ser una referencia consultable');
    assert.equal(infoRecuperacion.visible,true,
      'El popup del Talento debe abrirse con pulsación');
    assert.match(infoRecuperacion.texto,/pasar un Intervalo recuperándote para restaurar 1d8 Puntos de Salud/);
    assert.equal(await cdp.evalJS(
      "document.querySelector('#ficha-emergente .info-detalles')?.open"),false,
      'Los detalles técnicos deben permanecer cerrados inicialmente');
    await cdp.evalJS("(()=>{"+
      "document.querySelector('#configuracion-avanzada').open=true;"+
      "let c=document.querySelector('#informacion-avanzada');c.checked=true;"+
      "c.dispatchEvent(new Event('change',{bubbles:true}));"+
      "})()");
    assert.equal(await cdp.evalJS(
      "document.querySelector('#ficha-emergente .info-detalles')?.open"),true,
      'La configuración avanzada también actualiza el popup abierto');
    assert.ok(await cdp.evalJS(
      "document.querySelector('#fichas .tarjeta .otros-avisos')?.textContent?.includes('Talento de Ocupación — Recuperación:')!==true"),
      'La ficha no duplica el efecto de Recuperación al final');
    await cdp.evalJS("window.NaufragioInfoUI.cerrar()");
    // La ficha terminada permite revisar una plaza real de Talento.
    assert.equal(await cdp.evalJS(
      "document.querySelectorAll('#fichas .revisar-elecciones').length"),2);
    await cdp.evalJS("document.querySelectorAll('.revisar-elecciones')[0].click()");
    const revisionAbierta=await cdp.evalJS("({abierta:document.querySelector('#editor-revision-elecciones').open,"+
      "estado:document.querySelector('#estado').textContent,grupos:document.querySelectorAll('#revision-pasos-talentos select').length})");
    assert.equal(revisionAbierta.abierta,true,
      'La revisión debe abrirse: '+JSON.stringify(revisionAbierta));
    assert.equal(await cdp.evalJS(
      "document.querySelector('#revision-pasos-talentos select').dataset.revisionPaso"),
      'talento-guerrero');
    assert.equal(await cdp.evalJS(
      "document.querySelector('#revision-poderes').hidden === "+
      "(document.querySelectorAll('#revision-pasos-poderes select').length===0)"),true,
      'La sección de Poderes aparece si el Guerrero tiene elecciones adicionales documentadas');
    assert.equal(await cdp.evalJS(
      "document.querySelector('#revision-pasos-talentos .consultar-ficha-eleccion').hidden"),
      false,'Una elección de Talento documentada tiene su popup');
    await cdp.evalJS("document.querySelector('#revision-pasos-talentos .consultar-ficha-eleccion').click()");
    const vistaPopup=await cdp.evalJS("(()=>{var c=document.querySelector('#ficha-emergente');"+
      "if(!c)return null;var r=c.getBoundingClientRect();"+
      "var x=document.elementFromPoint(r.left+r.width/2,r.top+Math.min(18,r.height/2));"+
      "return {visible:!c.hidden,contenedor:c.parentElement.id,"+
      "accesible:c.contains(x),texto:c.textContent};})()");
    assert.ok(vistaPopup?.visible&&vistaPopup.contenedor==='editor-revision-elecciones',
      'Ver ficha debe mostrarse delante del editor modal');
    assert.equal(vistaPopup.accesible,true,
      'La ventana de glosa es interactiva y no queda detrás del diálogo');
    await cdp.evalJS("window.NaufragioInfoUI.cerrar()");
    const talentoAntes=await cdp.evalJS(
      "document.querySelector('#revision-pasos-talentos select').value");
    await cdp.evalJS("(()=>{var s=document.querySelector('#revision-pasos-talentos select');"+
      "s.value=Array.from(s.options).find(o=>o.value&&o.value!==s.value).value;"+
      "s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    const talentoDespues=await cdp.evalJS(
      "document.querySelector('#revision-pasos-talentos select').value");
    assert.notEqual(talentoAntes,talentoDespues);
    assert.equal(await cdp.evalJS(
      "document.querySelector('#revision-confirmar').disabled"),false);
    await cdp.evalJS("document.querySelector('#form-revision-elecciones').requestSubmit()");
    assert.equal(await cdp.evalJS(
      "document.querySelector('#editor-revision-elecciones').open"),false);
    assert.match(await cdp.evalJS("document.querySelector('#estado').textContent"),
      /Talentos y Poderes actualizados/);
    assert.equal(await cdp.evalJS(
      "document.activeElement.classList.contains('revisar-elecciones')"),true);
    const habilidades=await cdp.evalJS(
      "document.querySelector('#fichas .tarjeta').textContent");
    const nombreTalento=talentoDespues;
    assert.ok(habilidades.includes(nombreTalento),
      'La ficha refleja el Talento elegido después de crear el personaje');

    let estado=await cdp.evalJS("Array.from(document.querySelectorAll('#fichas .tarjeta')).map(x=>({"+
      "id:x.dataset.id,html:x.innerHTML,riqueza:x.querySelector('.riqueza')?.textContent}))");
    const primera=estado[0],segunda=estado[1];
    assert.ok(primera.riqueza&&segunda.riqueza);
    assert.equal(await cdp.evalJS("document.querySelectorAll('.gestionar-equipo').length"),2);
    // El nuevo editor de armamento es independiente de comprar Útiles.
    assert.equal(await cdp.evalJS("document.querySelectorAll('.gestionar-equipo').length"),2);
    await cdp.evalJS("document.querySelectorAll('.gestionar-equipo')[0].click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-gestion-equipo').open"),true);
    assert.equal(await cdp.evalJS("document.querySelector('#fichas .protecciones-activas')===null"),true);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#gestion-protecciones select').length"),2);
    assert.ok(await cdp.evalJS("document.querySelector('#gestion-arma option')!==null"));
    await cdp.evalJS("document.querySelector('#gestion-abrir-armamento').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-gestion-equipo').open"),false);
    assert.equal(await cdp.evalJS("document.querySelector('#editor-armamento').open"),true);
    assert.ok(await cdp.evalJS("document.querySelector('#armamento-origen option')!==null"),
      'La propuesta inicial identifica piezas con precio recuperable');
    await cdp.evalJS("(()=>{var m=document.querySelector('#armamento-modo');"+
      "m.value='comprar';m.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var g=document.querySelector('#armamento-grupo');g.value='armas';"+
      "g.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var s=document.querySelector('#armamento-articulo');"+
      "s.value=JSON.stringify(['armas','Dardo']);"+
      "s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    assert.match(await cdp.evalJS("document.querySelector('#armamento-resumen').textContent"),
      /0\.05 mo/,'Dardo de 5 mc debe mostrarse como 0,05 mo');
    assert.equal(await cdp.evalJS("document.querySelector('#armamento-confirmar').disabled"),false);
    await cdp.evalJS("(()=>{var s=document.querySelector('#armamento-articulo');"+
      "s.value=JSON.stringify(['armas','Clava']);s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var n=document.querySelector('#armamento-cantidad');n.value='70';"+
      "n.dispatchEvent(new Event('input',{bubbles:true}));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#armamento-cantidad').max"),
      '10','La compra de Clavas solo ofrece diez unidades');
    assert.equal(await cdp.evalJS("document.querySelector('#armamento-confirmar').disabled"),
      true,'No se pueden confirmar 70 Clavas');
    assert.match(await cdp.evalJS("document.querySelector('#armamento-resumen').textContent"),
      /Cupo restante: 10/);
    await cdp.evalJS("document.querySelector('#armamento-cancelar').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-armamento').open"),false);
    assert.ok(await cdp.evalJS("document.activeElement.classList.contains('gestionar-equipo')"),
      'Cancelar devuelve el foco al botón de Armamento');
    await cdp.evalJS("(()=>{document.querySelectorAll('.gestionar-equipo')[0].click();document.querySelector('#gestion-abrir-utiles').click()})()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),true,
      'Comprar útiles abre un diálogo nativo y modal');
    assert.equal(await cdp.evalJS("document.activeElement.id"),'compras-articulo',
      'Abrir compras debe situar el foco en el selector de artículos');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-grupo option').length"),13,
      'Doce familias DRS y Focos, sin grupos ajenos al catálogo');
    assert.ok((await cdp.evalJS("document.querySelectorAll('#compras-articulo option').length"))<43,
      'El selector de artículos muestra solo una familia compacta');
    assert.equal(await cdp.evalJS(
      "Array.from(document.querySelectorAll('#compras-grupo option')).some(x=>x.value==='ropa'&&x.textContent==='Ropa')"),true);
    await cdp.evalJS("(()=>{var g=document.querySelector('#compras-grupo');"+
      "g.value='equipo_monturas';g.dispatchEvent(new Event('change',{bubbles:true}));})()");
    const compraMonturas=await cdp.evalJS(
      "Array.from(document.querySelectorAll('#compras-articulo option')).map(x=>x.textContent)");
    assert.ok(compraMonturas.some(x=>x.startsWith('Alforjas · 2.5 mo')));
    assert.ok(!compraMonturas.some(x=>/Armadura equina|Establos/.test(x)),
      'Las tarifas variables o diarias se consultan sin crear inventario persistente');
    // Consultar Armadura equina en el mismo editor, sin añadir una venta.
    // El otro caso de LoKoO: treinta burros no son una compra válida.
    await cdp.evalJS("(()=>{var g=document.querySelector('#compras-grupo');"+
      "g.value='monturas';g.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var s=document.querySelector('#compras-articulo');s.value='montura-burro-mula';"+
      "s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var n=document.querySelector('#compras-cantidad');n.value='30';"+
      "n.dispatchEvent(new Event('input',{bubbles:true}));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#compras-cantidad').max"),'5');
    await cdp.evalJS("document.querySelector('#compras-anadir').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#estado').classList.contains('error')"),
      true,'Treinta burros deben rechazarse con mensaje visible');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),0);
    await cdp.evalJS("(()=>{var g=document.querySelector('#compras-grupo');"+
      "g.value='equipo_monturas';g.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='1';})()");
    assert.equal(await cdp.evalJS("document.querySelector('#consulta-armadura-equina').hidden"),false);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-armadura-equina-base option').length"),15,
      'Catorce armaduras DRS + opción vacía');
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-armadura-equina-base');"+
      "s.value='Armadura de cuero';s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    assert.match(await cdp.evalJS("document.querySelector('#compras-armadura-equina-resultado').textContent"),
      /10 mo × 4 = 40 mo/);
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-armadura-equina-base');"+
      "s.value='Armadura completa de placas';s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    assert.match(await cdp.evalJS("document.querySelector('#compras-armadura-equina-resultado').textContent"),
      /1000 mo × 4 = 4000 mo/);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),0,
      'La consulta equina no añade artículos al carrito');
    await cdp.evalJS("(()=>{var g=document.querySelector('#compras-grupo');"+
      "g.value='campamento';g.dispatchEvent(new Event('change',{bubbles:true}));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#consulta-armadura-equina').hidden"),true);
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
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),true,
      'Intro en cantidad no confirma accidentalmente el carrito');
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2,
      'Intro en cantidad añade otra línea al carrito');
    assert.ok((await cdp.evalJS("document.querySelector('#compras-total').textContent"))
      .includes('8.00 mo'));
    await cdp.evalJS("document.querySelector('#compras-cancelar').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),false);
    assert.equal(await cdp.evalJS("document.activeElement.classList.contains('gestionar-equipo')"),true,
      'Cancelar devuelve el foco al botón de compras del personaje');
    // Escape también cancela: no confirma, y el foco vuelve a la ficha.
    await cdp.evalJS("(()=>{document.querySelectorAll('.gestionar-equipo')[0].click();document.querySelector('#gestion-abrir-utiles').click()})()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),true);
    await cdp.enviar('Input.dispatchKeyEvent',{
      type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await cdp.enviar('Input.dispatchKeyEvent',{
      type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await cdp.esperar("document.querySelector('#editor-compras').open===false",
      'Escape descarta el modal sin confirmar el carrito');
    estado=await cdp.evalJS("Array.from(document.querySelectorAll('#fichas .tarjeta')).map(x=>x.innerHTML)");
    assert.equal(estado[0],primera.html,'Cancelar no modifica la primera ficha');
    assert.equal(estado[1],segunda.html,'Cancelar no modifica la ficha ajena');
    // Compra confirmada: 2 martillos + 3 tizas = 4,03 mo.
    await cdp.evalJS("(()=>{document.querySelectorAll('.gestionar-equipo')[0].click();document.querySelector('#gestion-abrir-utiles').click()})()");
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),0);
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "document.querySelector('#compras-grupo').value='campamento';document.querySelector('#compras-grupo').dispatchEvent(new Event('change',{bubbles:true}));s.value='campamento-martillo';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='2';"+
      "document.querySelector('#compras-anadir').click();"+
      "document.querySelector('#compras-grupo').value='aventura';document.querySelector('#compras-grupo').dispatchEvent(new Event('change',{bubbles:true}));s.value='aventura-tiza';s.dispatchEvent(new Event('change',{bubbles:true}));"+
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
      "document.querySelector('#compras-grupo').value='aventura';document.querySelector('#compras-grupo').dispatchEvent(new Event('change',{bubbles:true}));s.value='aventura-tiza';s.dispatchEvent(new Event('change',{bubbles:true}));"+
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
    assert.ok(vistaDesktop.editor>500,'El modal de escritorio tiene anchura usable');
    assert.ok(vistaDesktop.scroll<=1442,'No hay desbordamiento en escritorio');
    const imagenDesktop=await cdp.enviar('Page.captureScreenshot',{
      format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(capturas,'compras-escritorio.png'),
      Buffer.from(imagenDesktop.data,'base64'));
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "document.querySelector('#compras-grupo').value='consumibles';document.querySelector('#compras-grupo').dispatchEvent(new Event('change',{bubbles:true}));s.value='consumible-antidoto';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='1';"+
      "document.querySelector('#compras-cantidad').dispatchEvent(new Event('input',{bubbles:true}));"+
      "document.querySelector('#compras-nivel').value='3';"+
      "document.querySelector('#compras-nivel').dispatchEvent(new Event('input',{bubbles:true}));})()");
    assert.equal(await cdp.evalJS("document.querySelector('#compras-campo-nivel').hidden"),false);
    assert.ok((await cdp.evalJS("document.querySelector('#compras-detalle').textContent"))
      .includes('150.00 mo'),'Antídoto Nivel 3 = 150 mo');
    // Un intento de añadir una compra imposible no modifica el carrito.
    await cdp.evalJS("(()=>{var s=document.querySelector('#compras-articulo');"+
      "document.querySelector('#compras-grupo').value='herramientas';document.querySelector('#compras-grupo').dispatchEvent(new Event('change',{bubbles:true}));s.value='herramienta-catalejo';s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#compras-cantidad').value='99';"+
      "document.querySelector('#compras-anadir').click();})()");
    assert.equal(await cdp.evalJS("document.querySelector('#estado').classList.contains('error')"),true);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#compras-lista li').length"),2);
    await cdp.evalJS("document.querySelector('#compras-confirmar').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),false);
    assert.equal(await cdp.evalJS("document.activeElement.classList.contains('gestionar-equipo')"),true,
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
    await cdp.evalJS("(()=>{document.querySelectorAll('.gestionar-equipo')[0].click();document.querySelector('#gestion-abrir-utiles').click()})()");
    assert.ok((await cdp.evalJS("document.querySelector('#resumen-compras').textContent"))
      .includes(dinero(estado[0].riqueza).toFixed(2)+' mo'));
    await cdp.evalJS("document.querySelector('#fichas .tarjeta .eliminar-ficha').click()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-compras').open"),false);
    assert.equal(await cdp.evalJS("document.querySelectorAll('#fichas .tarjeta').length"),1);
    // El formulario de compras debe mantener su jerarquía sin desbordarse en móvil.
    await cdp.enviar('Emulation.setDeviceMetricsOverride',{
      width:390,height:844,deviceScaleFactor:1,mobile:true});
    const movil=await cdp.evalJS("({ancho:document.documentElement.scrollWidth,"+
      "ventana:window.innerWidth,botones:document.querySelectorAll('.gestionar-equipo').length})");
    assert.ok(movil.ancho<=movil.ventana+2,'La página no debe desbordar horizontalmente en móvil');
    assert.equal(movil.botones,1);
    await cdp.evalJS("(()=>{document.querySelector('.gestionar-equipo').click();document.querySelector('#gestion-abrir-utiles').click()})()");
    const movilEditor=await cdp.evalJS("({ancho:document.documentElement.scrollWidth,"+
      "ventana:window.innerWidth,visible:document.querySelector('#editor-compras').open,"+
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
    // Compra confirmada en móvil: la ficha y el saldo reflejan exactamente 5 mc.
    const saldoArmasAntes=await cdp.evalJS(
      "Number(document.querySelector('#fichas .tarjeta .riqueza').textContent.match(/([0-9.]+) mo restantes/)[1])");
    await cdp.evalJS("(()=>{document.querySelector('.gestionar-equipo').click();document.querySelector('#gestion-abrir-armamento').click()})()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-armamento').open"),true);
    const anchoArmamento=await cdp.evalJS(
      "document.querySelector('#editor-armamento').getBoundingClientRect().width");
    assert.ok(anchoArmamento<=390,'El modal de armamento cabe en móvil');
    await cdp.evalJS("(()=>{var m=document.querySelector('#armamento-modo');"+
      "m.value='comprar';m.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var g=document.querySelector('#armamento-grupo');g.value='armas';"+
      "g.dispatchEvent(new Event('change',{bubbles:true}));"+
      "var s=document.querySelector('#armamento-articulo');"+
      "s.value=JSON.stringify(['armas','Dardo']);"+
      "s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "document.querySelector('#form-armamento').requestSubmit();})()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-armamento').open"),false);
    const saldoArmasDespues=await cdp.evalJS(
      "Number(document.querySelector('#fichas .tarjeta .riqueza').textContent.match(/([0-9.]+) mo restantes/)[1])");
    assert.equal(Math.round((saldoArmasAntes-saldoArmasDespues)*100),5,
      'Comprar Dardo consume 5 mc sin redondeo a cero ni doble cargo');
    assert.equal(await cdp.evalJS("document.querySelector('#estado').textContent.includes('Compra adicional de armamento')"),true);
    // Cambiar de verdad una pieza inicial sin tocar los útiles ni el inventario restante.
    await cdp.evalJS("(()=>{document.querySelector('.gestionar-equipo').click();document.querySelector('#gestion-abrir-armamento').click()})()");
    const tienePieza=await cdp.evalJS(
      "document.querySelector('#armamento-origen').options.length>0");
    assert.ok(tienePieza,'La generación conserva registros de compra inicial');
    const elegida=await cdp.evalJS("(()=>{"+
      "var s=document.querySelector('#armamento-destino'),c=document.querySelector('#armamento-confirmar');"+
      "for(var o of Array.from(s.options)){"+
      "if(o.value===s.value)continue;"+
      "s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}));"+
      "if(!c.disabled)return o.value;"+
      "}return null;})()");
    assert.ok(elegida,'Debe existir al menos una sustitución inicial asequible');
    await cdp.evalJS("document.querySelector('#form-armamento').requestSubmit()");
    assert.equal(await cdp.evalJS("document.querySelector('#editor-armamento').open"),false);
    assert.equal(await cdp.evalJS("document.querySelector('#estado').textContent.includes('Cambio de equipo inicial')"),true);
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
