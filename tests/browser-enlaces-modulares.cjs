'use strict';
/* E2E real de enlaces portatiles: sin servidor de estado y en contextos nuevos.
 * Ejemplos:
 *   node tests/browser-enlaces-modulares.cjs chrome
 *   node tests/browser-enlaces-modulares.cjs firefox webkit
 *   FORJA_PUBLIC_ROOT=dist/public-drs node tests/browser-enlaces-modulares.cjs chrome
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');

const raiz=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.join(__dirname,'..'));
const tipos={'.html':'text/html','.css':'text/css','.js':'text/javascript',
  '.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  let ruta;
  try{ruta=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch(e){res.writeHead(400).end();return;}
  // GitHub Pages sirve index.html en las rutas modulares terminadas en /.
  const archivo=path.resolve(raiz,'.'+(ruta.endsWith('/')?ruta+'index.html':ruta));
  if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(archivo,(error,bytes)=>{
    if(error){res.writeHead(404).end('No encontrado');return;}
    res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream',
      'Cache-Control':'no-store'});res.end(bytes);
  });
});

async function probar(nombre,motor,origen){
  const browser=await motor.launch(nombre==='chrome'?
    {channel:'chrome',headless:true,args:['--no-sandbox']}:{headless:true});
  const contextos=[];
  const errores=[];
  async function pagina(ruta){
    const contexto=await browser.newContext({viewport:{width:1320,height:900}});
    contextos.push(contexto);
    const p=await contexto.newPage();
    p.on('pageerror',e=>errores.push(e.message));
    if(ruta)await p.goto(ruta,{waitUntil:'domcontentloaded'});
    return p;
  }
  async function capturarEnlace(p,selector,sufijo){
    // El portapapeles no debe depender de permisos distintos por navegador.
    await p.evaluate(()=>{
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
        writeText:async function(enlace){window.__enlaceCopiado=enlace;}
      }});
    });
    await p.locator(selector).click();
    await p.waitForFunction(()=>typeof window.__enlaceCopiado==='string');
    const enlace=await p.evaluate(()=>window.__enlaceCopiado);
    const destino=new URL(enlace);
    assert.equal(destino.origin,origen,'El enlace conserva el origen de La Forja.');
    assert.equal(destino.pathname,sufijo,'La URL conduce al modulo correcto.');
    assert.match(destino.hash,/^#share=[A-Za-z0-9_-]+$/);
    return enlace;
  }
  try{
    const portal=await pagina(origen+'/');
    assert.equal(await portal.locator('.portal-tarjeta').count(),2);
    assert.equal(await portal.locator('a[href="characters-nd20/"]').count(),1);
    assert.equal(await portal.locator('a[href="spells/"]').count(),1);

    // Personajes: la semilla y la configuracion viajan; no se comparte un ID remoto.
    const pj=await pagina(origen+'/characters-nd20/');
    await pj.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await pj.locator('#generar').click();
    await pj.locator('#fichas .ver-reproduccion').first().click();
    const semilla=await pj.locator('#semilla-resultado').innerText();
    const enlacePJ=await capturarEnlace(pj,'#compartir-reproduccion','/characters-nd20/');
    const pjRecibido=await pagina(enlacePJ);
    await pjRecibido.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await pjRecibido.locator('#fichas .ver-reproduccion').first().waitFor();
    await pjRecibido.locator('#fichas .ver-reproduccion').first().click();
    assert.equal(await pjRecibido.locator('#semilla-resultado').innerText(),semilla,
      'La configuracion recibida reproduce la misma semilla.');

    // Conjuros: buscar, añadir y ver una lista por Círculos (sin asociar Ocupación).
    const hechizos=await pagina(origen+'/spells/');
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#lista-circulos .bloque-circulo').count(),0,
      'Una lista nueva empieza vacía.');
    assert.equal(await hechizos.locator('#form-asociacion').count(),0,
      'No hay asociaciones ni progresiones en la pantalla simplificada.');
    const colorInicial=await hechizos.evaluate(()=>
      getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim());
    await hechizos.locator('#selector-tema').selectOption('violeta');
    assert.equal(await hechizos.locator('html').getAttribute('data-tema'),'violeta');
    const colorVioleta=await hechizos.evaluate(()=>
      getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim());
    assert.notEqual(colorVioleta,colorInicial,
      'Cambiar de tema debe modificar realmente las variables de La Forja.');
    await hechizos.reload();
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#selector-tema').inputValue(),'violeta',
      'El tema se conserva al recargar.');
    await hechizos.locator('#lista-dueno').fill('Ensayo de enlace');
    await hechizos.locator('#filtro-nombre').fill('Silencio');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),1);
    await hechizos.locator('#resultados-busqueda .anadir-conjuro').click();
    assert.equal(await hechizos.locator('#titulo-lista').innerText(),
      'Lista de Conjuros de Ensayo de enlace');
    assert.equal(await hechizos.locator('#lista-circulos .bloque-circulo').count(),1);
    assert.match(await hechizos.locator('#lista-circulos').innerText(),/Silencio/);
    await hechizos.locator('#guardar-lista').click();
    await hechizos.locator('#estado-lista').getByText('guardada en este navegador',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#listas-guardadas option').count(),2,
      'La lista personal se guarda y queda disponible en el selector.');
    const enlaceListas=await capturarEnlace(hechizos,'#compartir-listas','/spells/');
    const hechizosRecibidos=await pagina(enlaceListas);
    await hechizosRecibidos.locator('#estado-datos')
      .getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizosRecibidos.locator('#lista-dueno').inputValue(),
      'Ensayo de enlace');
    assert.equal(await hechizosRecibidos.locator('#lista-circulos .conjuro-seleccionado').count(),1,
      'El enlace transporta las referencias DRS guardadas, no los textos de fichas.');
    await hechizosRecibidos.setViewportSize({width:375,height:812});
    const horizontal=await hechizosRecibidos.evaluate(()=>
      document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(horizontal<=2,'Conjuros: sin scroll horizontal móvil ('+horizontal+'px).');

    // Adversarios: ficha oficial inalterada, enlace a una instantanea no guardada.
    const adversarios=await pagina(origen+'/characters-nd20/');
    await adversarios.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await adversarios.locator('#tab-criaturas').click();
    await adversarios.locator('#criaturas-cargar-drs').click();
    await adversarios.locator('#criaturas-selector-busqueda').fill('Goblin con tirachinas');
    assert.equal(await adversarios.locator('.criaturas-selector-fila').count(),1);
    await adversarios.locator('.criaturas-selector-fila button').click();
    await adversarios.locator('#criaturas-selector-cerrar').click();
    await adversarios.locator('.criaturas-cromo[data-oficial="true"]').click();
    const enlaceAdversario=await capturarEnlace(
      adversarios,'#criaturas-ficha-compartir','/characters-nd20/');
    const adversarioRecibido=await pagina(enlaceAdversario);
    // El estado general queda oculto cuando el enlace abre la pestaña Adversarios.
    // La prueba espera el editor realmente visible, no un panel de otra pestaña.
    await adversarioRecibido.locator('#criaturas-edicion').waitFor({state:'visible'});
    assert.equal(await adversarioRecibido.locator('#criaturas-nombre').inputValue(),
      'Goblin con tirachinas');
    assert.equal(await adversarioRecibido.locator('.criaturas-cromo').count(),0,
      'Abrir el enlace no guarda automaticamente fichas en la biblioteca.');
    assert.deepEqual(errores,[],nombre+': sin errores JavaScript.');
    console.log('OK · '+nombre+': portal, personajes, listas DRS y adversarios por enlace sin servidor.');
  }finally{
    for(const c of contextos.reverse())await c.close();
    await browser.close();
  }
}
(async()=>{
  await new Promise((resolve,reject)=>{
    server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  try{
    const origen='http://127.0.0.1:'+server.address().port;
    const nombres=process.argv.slice(2).length?process.argv.slice(2):['chrome'];
    const motores={chrome:chromium,firefox,webkit};
    for(const n of nombres){
      if(!motores[n])throw Error('Motor desconocido: '+n);
      await probar(n,motores[n],origen);
    }
  }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error('FALLO E2E ENLACES MODULARES:',e.stack||e);process.exitCode=1;});
