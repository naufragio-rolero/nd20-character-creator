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
    // Forja 1.1: selector visual DRS y fallback nativo sincronizados.
    assert.equal(await page.locator('#selector-visual-especie button').count(),9,
      nombre+': 8 Especies con pictograma + aleatoria');
    assert.equal(await page.locator('#selector-visual-ocupacion button').count(),5,
      nombre+': 4 Ocupaciones con pictograma + aleatoria');
    assert.equal(await page.locator('#selector-visual-especie svg use').count(),8);
    assert.equal(await page.locator('#selector-visual-ocupacion svg use').count(),4);
    const iconos=await page.evaluate(async()=>{
      const r=await fetch('assets/icons-forja.svg');
      return {status:r.status,contenido:await r.text()};
    });
    assert.equal(iconos.status,200);
    assert.equal((iconos.contenido.match(/<symbol id=/g)||[]).length,12);
    // Consultar Equipo DRS desde el propio navegador público, sin comprar.
    const consultaDrs=page.locator('#consulta-catalogo-drs');
    assert.equal(await consultaDrs.isHidden(),false,
      nombre+': catálogo de consulta accesible');
    await consultaDrs.locator('summary').click();
    const catalogo=page.locator('#consulta-catalogo-articulo');
    assert.equal(await catalogo.locator('option').count(),43,
      nombre+': 37 referencias DRS + cinco útiles editoriales + placeholder');
    assert.equal(await catalogo.locator('option').filter({hasText:'Establos'}).count(),0);
    assert.equal(await page.locator('#consulta-catalogo-ver').isDisabled(),true);
    await catalogo.selectOption('Armadura equina');
    await page.locator('#consulta-catalogo-ver').click();
    const precio=page.locator('#ficha-emergente');
    assert.equal(await precio.locator('h3').innerText(),'Armadura equina');
    assert.equal(await precio.locator('.info-tipo').innerText(),'Equipo de montura');
    assert.equal(await precio.locator('#consulta-armadura-base option').count(),15,
      nombre+': catálogo completo de 14 armaduras humanas');
    assert.equal(await precio.locator('.info-armadura-resultado').innerText(),
      'Selecciona una armadura para consultar su precio.');
    await precio.locator('#consulta-armadura-base').selectOption('Pechera de algodón');
    assert.match(await precio.locator('.info-armadura-resultado').innerText(),
      /0\.5 mo × 4 = 2 mo/);
    await precio.locator('#consulta-armadura-base').selectOption('Armadura de cuero');
    assert.match(await precio.locator('.info-armadura-resultado').innerText(),
      /10 mo × 4 = 40 mo/);
    await precio.locator('#consulta-armadura-base').selectOption('Armadura completa de placas');
    assert.match(await precio.locator('.info-armadura-resultado').innerText(),
      /1000 mo × 4 = 4000 mo/);
    assert.match(await precio.locator('.info-armadura-aviso').innerText(),
      /No se compra ni se equipa automáticamente/);
    assert.match(await precio.locator('.info-fuente').innerText(),/Tabla 28/);
    await page.keyboard.press('Escape');
    assert.equal(await precio.isHidden(),true);
    assert.equal(await page.locator('#fichas .tarjeta').count(),0,
      nombre+': consulta de catálogo no genera objetos o fichas');
    // Popup de Poderes: uso inmediato de Dormir según el Tomo cotejado,
    // opción avanzada y comprobación de otra familia (Técnicas). No depende
    // de que la ficha aleatoria haya aprendido un Conjuro concreto.
    await page.evaluate(()=>{
      const b=document.createElement('button');
      b.id='e2e-poder';b.type='button';b.textContent='Consultar Poder';
      b.className='referencia-glosario';
      b.dataset.glosaId='conjuro-7';
      b.dataset.glosaGrupo='poder';
      b.dataset.glosaSistema='nd20';
      b.dataset.glosaNivel='1';
      document.body.appendChild(b);
    });
    await page.locator('#e2e-poder').click();
    const popup=page.locator('#ficha-emergente');
    assert.equal(await popup.locator('.info-tipo').textContent(),'Conjuro');
    assert.equal(await popup.locator('h3').textContent(),'Dormir');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Arcana · 1.er Círculo');
    assert.deepEqual(await popup.locator('.info-primarios dt').allTextContents(),
      ['Alcance:','Duración:']);
    assert.deepEqual(await popup.locator('.info-primarios dd').allTextContents(),
      ['10m + 2m por Nivel','1d6 Intervalos']);
    assert.match(await popup.locator('.info-descripcion').first().textContent(),
      /reserva de 5d10 Puntos Oníricos/);
    assert.match(await popup.locator('.info-fuente').textContent(),
      /Origen: Naufragio d20 DRS · Fuente: NaufragioD20 — Tomo de Magia/);
    const detallesPoder=popup.locator('.info-detalles');
    assert.equal(await detallesPoder.isHidden(),true,
      nombre+': magnitudes no visibles en lectura rápida');
    await page.locator('#configuracion-avanzada summary').click();
    await page.locator('#informacion-avanzada').check();
    // El popup se cierra al salir de él para cambiar ajustes; al
    // reabrirlo debe respetar inmediatamente la opción avanzada.
    await page.locator('#e2e-poder').click();
    assert.equal(await detallesPoder.isVisible(),true,
      nombre+': la preferencia muestra datos técnicos al reabrir el Poder');
    assert.equal(await detallesPoder.evaluate(x=>x.open),true);
    assert.match(await detallesPoder.innerText(),/Ficha del Tomo\s+101/);
    assert.match(await detallesPoder.innerText(),/Magnitudes literales · Nivel 1/);
    assert.match(await detallesPoder.innerText(),/12 metros/);
    assert.match(await detallesPoder.innerText(),/1d6 Intervalos/);
    await page.locator('#e2e-poder').evaluate(x=>{x.dataset.glosaId='tecnica-02';});
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('.info-tipo').textContent(),'Técnica');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),'Disciplina');
    assert.match(await popup.locator('.info-primarios').textContent(),
      /Coste:\s*1 punto de Esfuerzo/);
    assert.match(await popup.locator('.info-primarios').textContent(),/Requisito:/);
    await page.locator('#informacion-avanzada').uncheck();
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('.info-detalles').isHidden(),true);
    await page.keyboard.press('Escape');
    // Talentos del DRS: texto íntegro, activación literal, fuente y homónimos.
    await page.evaluate(()=>{
      const b=document.createElement('button');
      b.id='e2e-talento';b.type='button';b.textContent='Consultar Talento';
      b.className='referencia-glosario';
      b.dataset.glosaId='talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes';
      b.dataset.glosaGrupo='talento';b.dataset.glosaSistema='nd20';
      document.body.appendChild(b);
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-tipo').textContent(),'Talento');
    assert.equal(await popup.locator('h3').textContent(),'Expulsar muertos vivientes');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Ocupación · Clérigo');
    assert.deepEqual(await popup.locator('.info-primarios dt').allTextContents(),
      ['Activación:','Atributo:','Coste:']);
    assert.deepEqual(await popup.locator('.info-primarios dd').allTextContents(),
      ['Acción','Intuición','1 Punto de Esfuerzo']);
    assert.match(await popup.locator('.info-descripcion').textContent(),
      /Todos aquellos que sean de un Nivel igual o inferior al tuyo/);
    assert.match(await popup.locator('.info-fuente').textContent(),
      /Origen: Naufragio d20 DRS · Fuente: NaufragioD20DRS.docx/);
    assert.equal(await popup.locator('.info-detalles').isHidden(),true);
    const aclaracion=popup.locator('.info-aclaracion-autoral');
    assert.equal(await aclaracion.count(),1);
    assert.equal(await aclaracion.locator('h4').textContent(),
      'Aclaración autoral aprobada');
    assert.match(await aclaracion.textContent(),/3 zombis y 2 esqueletos/);
    assert.match(await aclaracion.textContent(),/2 Tiradas/);
    assert.match(await aclaracion.textContent(),/criaturas idénticas/);
    assert.equal(await aclaracion.isVisible(),true,
      nombre+': aclaración aprobada visible sin activar detalles técnicos');
    assert.doesNotMatch(await popup.locator('.info-descripcion').first().textContent(),
      /3 zombis y 2 esqueletos/,
      nombre+': el texto literal no debe absorber la aclaración editorial');
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-mediano-amable-salvese-quien-pueda';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('h3').textContent(),'¡Sálvese quien pueda!');
    assert.match(await popup.locator('.info-aclaracion-autoral').textContent(),
      /Parálisis o Miedo/);
    assert.match(await popup.locator('.info-aclaracion-autoral').textContent(),
      /aunque|incluso cuando/);
    assert.match(await popup.locator('.info-descripcion').first().textContent(),
      /sin necesidad de tirada/);
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes';
    });
    await page.locator('#e2e-talento').click();
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=true;});
    await page.locator('#informacion-avanzada').check();
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-detalles').isVisible(),true);
    assert.match(await popup.locator('.info-detalles').textContent(),
      /Párrafos del DRS/);
    await page.locator('#informacion-avanzada').uncheck();
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-semielfo-herencia-dual-se';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('h3').textContent(),'Herencia dual');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Especie · Semielfo');
    assert.match(await popup.locator('.info-descripcion').textContent(),/Linaje feérico/);
    assert.equal(await popup.locator('.info-primarios dt').count(),0,
      'No inventar activación o coste para los Talentos de Especie');
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-semiorco-herencia-dual-so';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Especie · Semiorco');
    assert.match(await popup.locator('.info-descripcion').textContent(),/Ira interna/);
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-gnomo-urbano-vision-en-la-oscuridad';
    });
    await page.locator('#e2e-talento').click();
    assert.match(await popup.locator('.info-descripcion').textContent(),/alrrededor/,
      'El texto cotejado de Gnomo conserva incluso la errata de la fuente');
    assert.equal(await popup.locator('.info-aclaracion-autoral').count(),0,
      nombre+': no trasladar una aclaración a Talentos ajenos');
    await page.keyboard.press('Escape');
    await page.locator('#e2e-talento').evaluate(x=>x.remove());
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=false;});
    // Restaurar el estado original para las pruebas de Talentos que siguen.
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=false;});
    await page.locator('#e2e-poder').evaluate(x=>x.remove());
    await page.locator('#abrir-selector-ocupacion').click();
    assert.equal(await page.locator('#dialogo-ocupacion').evaluate(x=>x.open),true);
    const opcionMago=page.locator('#selector-visual-ocupacion button[data-valor="Mago"]');
    await opcionMago.click();
    assert.equal(await opcionMago.getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#dialogo-ocupacion').evaluate(x=>x.open),true,
      nombre+': una casilla marcada no cierra el multiselector');
    await page.locator('[data-confirmar-selector="ocupacion"]').click();
    assert.equal(await page.locator('#ocupacion').inputValue(),'Mago');
    assert.equal(await page.locator('#valor-elegido-ocupacion').textContent(),'Mago (DRS)');
    assert.equal(await page.locator('#dialogo-ocupacion').evaluate(x=>x.open),false);
    await page.locator('#abrir-selector-especie').click();
    const opcionElfo=page.locator('#selector-visual-especie button[data-valor="Elfo agreste"]');
    await opcionElfo.focus();await page.keyboard.press('Enter');
    await page.locator('#selector-visual-especie button[data-valor="Mediano amable"]').click();
    assert.equal(await page.locator('#selector-visual-especie button[data-valor="Mediano amable"]').getAttribute('aria-pressed'),'true');
    await page.locator('[data-confirmar-selector="especie"]').click();
    assert.equal(await page.locator('#especie').inputValue(),'');
    assert.equal(await page.locator('#valor-elegido-especie').textContent(),'2 opciones');
    assert.equal(await page.locator('#abrir-selector-especie').evaluate(x=>document.activeElement===x),true,
      nombre+': foco devuelto después de confirmar multiselección');
    await page.locator('#abrir-selector-especie').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#dialogo-especie').evaluate(x=>x.open),false);
    await page.locator('#abrir-selector-especie').click();
    await page.locator('#selector-visual-especie button[data-valor=""]').click();
    await page.locator('[data-confirmar-selector="especie"]').click();
    await page.selectOption('#ocupacion','');
    assert.equal(await page.locator('#selector-visual-especie button[data-valor=""]').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#generar-flotante').isEnabled(),true);
    assert.equal(await page.locator('#informacion-avanzada').isChecked(),false);
    const fuentes=await page.locator('#fuentes-nd20 input').evaluateAll(
      nodes=>nodes.map(x=>({nombre:x.value,checked:x.checked})));
    assert.deepEqual(fuentes,[{nombre:'DRS',checked:true}],
      nombre+': no ofrecer suplementos ocultos en versión DRS');
    // La distribución pública muestra solo Fantasía DRS y Dungeon Hack.
    // Los otros motores permanecen comprobables en desarrollo.
    const sistemasVisibles=['dh'];
    const idsVisibles=await page.locator('.juegos-compactos [data-juego]')
      .evaluateAll(nodes=>nodes.map(n=>n.dataset.juego));
    assert.deepEqual(idsVisibles,['nd20',...sistemasVisibles],
      nombre+': solo se muestran sistemas aprobados en el selector');
    const opcionesSistema=await page.locator('#juego option')
      .evaluateAll(nodes=>nodes.map(n=>n.value));
    assert.deepEqual(opcionesSistema,['nd20',...sistemasVisibles],
      nombre+': el selector nativo tampoco contiene CiFi/Nocturna públicos');
    // Alternar sistemas no puede recuperar opciones suplementarias ocultas.
    for(const otro of sistemasVisibles){
      await page.locator('.juegos-compactos [data-juego="'+otro+'"]').click();
      assert.equal(await page.locator('#juego').inputValue(),otro,
        nombre+': selector de sistema '+otro);
    }
    // Comprobar generación real de todos los sistemas visibles.
    for(const otro of sistemasVisibles){
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
      assert.match(await tarjeta.locator('.contexto-ficha').textContent(),
        /Forma del generador histórico/);
      assert.match(await tarjeta.locator('.contexto-ficha').textContent(),
        /sin clasificación documental de sexo/);
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
      assert.match(await tarjeta.locator('.contexto-ficha').textContent(),
        /No identifica un personaje canónico/);
      await page.locator('#borrar').click();
    }
    // Caso observado por el autor: Mediano amable + Guerrero.
    // Los efectos de Talentos deben abrirse JUNTO a su nombre; no quedarse
    // escondidos entre compras, envejecimiento y avisos al final.
    await page.selectOption('#modo-nombre','especie');
    await page.selectOption('#ocupacion','Guerrero');
    await page.selectOption('#especie','Mediano amable');
    await page.fill('#nombre-personaje','Prueba de Talentos');
    await page.fill('#nivel','1');
    await page.fill('#semilla','Forja-popup-talentos-'+nombre);
    await page.locator('#generar').click();
    const fichaTalentos=page.locator('#fichas .tarjeta').first();
    await fichaTalentos.waitFor();
    const baja=fichaTalentos.locator('.referencia-glosario[data-glosa-nombre="Baja estatura"]');
    assert.equal(await baja.count(),1,nombre+': Baja estatura debe ser consultable');
    await baja.click();
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /No puedes usar armas o armaduras que no estén adaptadas a ti/);
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /\+1 a las Tiradas de esquiva de ataques a distancia/);
    await page.keyboard.press('Escape');
    const salvese=fichaTalentos.locator(
      '.referencia-glosario[data-glosa-nombre="¡Sálvese quien pueda!"]');
    await salvese.click();
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /gastar 1 Punto de Esfuerzo y una Acción/);
    await page.keyboard.press('Escape');
    const recuperacion=fichaTalentos.locator(
      '.referencia-glosario[data-glosa-nombre="Recuperación"]');
    await recuperacion.click();
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /pasar un Intervalo recuperándote para restaurar 1d8 Puntos de Salud/);
    // Resumen siempre visible, datos técnicos solo mediante disclosure o preferencia.
    const detalles=page.locator('#ficha-emergente .info-detalles');
    assert.equal(await detalles.count(),1,nombre+': Talento debe poder desplegar detalles');
    assert.equal(await detalles.isHidden(),true,
      nombre+': detalles técnicos del Talento DRS ocultos por defecto');
    await page.keyboard.press('Escape');
    await page.locator('#configuracion-avanzada summary').click();
    await page.locator('#informacion-avanzada').check();
    await recuperacion.click();
    assert.equal(await page.locator('#ficha-emergente .info-detalles').evaluate(e=>e.open),true,
      nombre+': preferencia avanzada despliega los detalles al abrir');
    await page.keyboard.press('Escape');
    await page.locator('#informacion-avanzada').uncheck();
    assert.equal(await fichaTalentos.locator('.bloque-ficha').filter({hasText:'Observaciones'}).count(),0,
      nombre+': no duplicar descripciones completas al final en Observaciones');
    assert.equal(await fichaTalentos.locator('.avisos-talentos').count(),0,
      nombre+': el DRS sí tiene todos esos textos en sus popups');
    assert.ok(await fichaTalentos.locator('.avisos-equipo').count()>=1,
      nombre+': la regla de equipo de Baja estatura se conserva junto al equipo');
    await page.locator('#borrar').click();
    // Una vía de adquisición no sustituye el origen literal del Talento.
    // Probar ambos mestizos con el modo rápido y semilla reproducible.
    await page.locator('input[name="modo-creacion"][value="rapido"]').check();
    for(const especie of ['Semielfo','Semiorco']){
      await page.selectOption('#ocupacion','Mago');
      await page.selectOption('#especie',especie);
      await page.fill('#nivel','1');
      await page.fill('#nombre-personaje','Herencia '+especie);
      await page.fill('#semilla','forja-adquisicion-'+especie);
      await page.locator('#generar').click();
      const fichaHeredada=page.locator('#fichas .tarjeta').first();
      await fichaHeredada.waitFor();
      const alternativas=especie==='Semielfo'?
        {'Buen desarrollo':'Humano común','Linaje feérico':'Elfo agreste'}:
        {'Buen desarrollo':'Humano común','Ira interna':'Orco común'};
      const marcadas=[];
      for(const [talento,fuente] of Object.entries(alternativas)){
        const referencia=fichaHeredada.locator('.referencia-glosario')
          .filter({hasText:talento});
        if(await referencia.count()!==1)continue;
        marcadas.push(talento);
        assert.equal(await referencia.getAttribute('data-glosa-fuente'),
          'Especie: '+fuente,nombre+': origen literal de '+talento);
        assert.equal(await referencia.getAttribute('data-glosa-adquisicion'),
          'Herencia dual · '+especie,nombre+': adquisición de '+talento);
        await referencia.click();
        assert.equal(await page.locator('#ficha-emergente .info-clasificacion').textContent(),
          'Especie · '+fuente);
        assert.equal(await page.locator('#ficha-emergente .info-adquisicion').textContent(),
          'Adquisición: Herencia dual · '+especie);
        await page.keyboard.press('Escape');
      }
      assert.equal(marcadas.length,1,
        nombre+': debe seleccionarse una sola herencia, '+especie);
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
    // Recuerdo personal: popup descriptivo, sin precio ni estadísticas de arma.
    const recuerdo=ficha.locator('.referencia-glosario[data-glosa-grupo="equipo"]')
      .filter({hasText:'Recuerdo:'}).first();
    assert.equal(await recuerdo.count(),1,nombre+': recuerdo en el inventario');
    await recuerdo.click();
    const infoRecuerdo=page.locator('#ficha-emergente');
    assert.equal(await infoRecuerdo.locator('.info-tipo').textContent(),'Recuerdo personal');
    assert.equal(await infoRecuerdo.locator('.info-primarios dt').count(),0);
    assert.ok((await infoRecuerdo.locator('.info-fuente').textContent())
      .includes('data/especies.json'));
    await page.keyboard.press('Escape');
    // Equipo incluido en el paquete: referencias DRS, no compras adicionales.
    const antorcha=ficha.locator('.referencia-glosario[data-glosa-grupo="equipo"]')
      .filter({hasText:'antorcha (DU d6)'}).first();
    assert.equal(await antorcha.count(),1,nombre+': luz de paquete consultable');
    await antorcha.click();
    const luz=page.locator('#ficha-emergente');
    assert.equal(await luz.locator('.info-clasificacion').textContent(),'Iluminación');
    assert.match(await luz.locator('.info-descripcion').textContent(),/Ilumina 6 metros/);
    assert.deepEqual(await luz.locator('.info-primarios dd').allTextContents(),
      ['10 mc','DU d6']);
    assert.ok((await luz.locator('.info-fuente').textContent()).includes('Tabla 21'));
    await page.keyboard.press('Escape');
    const mochila=ficha.locator('.referencia-glosario[data-glosa-grupo="equipo"]')
      .filter({hasText:'Mochila'}).first();
    await mochila.click();
    const componente=page.locator('#ficha-emergente');
    assert.equal(await componente.locator('.info-clasificacion').textContent(),
      'Útiles · Viaje y almacenaje');
    assert.deepEqual(await componente.locator('.info-primarios dt').allTextContents(),
      ['Incluido en:']);
    assert.match(await componente.locator('.info-primarios dd').textContent(),
      /Especial mazmorras/);
    assert.match(await componente.locator('.info-descripcion').textContent(),
      /Bolsa resistente con correas para llevarla a la espalda/);
    assert.equal((await componente.locator('.info-primarios').textContent())
      .includes('Precio'),false,'No asignar precio ficticio a la mochila');
    assert.match(await componente.locator('.info-fuente').textContent(),
      /Paquetes de equipo.*Descripción editorial/);
    assert.equal(await componente.locator('.info-tipo').textContent(),'Equipo');
    await page.keyboard.press('Escape');
    const racion=ficha.locator('.referencia-glosario[data-glosa-grupo="equipo"]')
      .filter({hasText:'ración (DU d6)'}).first();
    assert.equal(await racion.count(),1,nombre+': referencia textual de ración');
    await racion.click();
    assert.match(await page.locator('#ficha-emergente .info-primarios').textContent(),
      /Precio unitario/);
    assert.match(await page.locator('#ficha-emergente .info-descripcion').textContent(),
      /Carne o fruta seca/);
    await page.keyboard.press('Escape');
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
    // El equipo adquirido debe ofrecer información real y fuente DRS.
    const martillo=ficha.locator('.referencia-glosario[data-glosa-grupo="equipo"]')
      .filter({hasText:'Martillo de campamento ×2'}).first();
    assert.equal(await martillo.count(),1,nombre+': artículo comprado consultable');
    await martillo.click();
    const infoEquipo=page.locator('#ficha-emergente');
    assert.equal(await infoEquipo.locator('.info-tipo').textContent(),'Equipo');
    assert.deepEqual(await infoEquipo.locator('.info-primarios dt').allTextContents(),
      ['Precio unitario:']);
    assert.deepEqual(await infoEquipo.locator('.info-primarios dd').allTextContents(),
      ['2 mo']);
    assert.match(await infoEquipo.locator('.info-descripcion').textContent(),
      /puede utilizarse como Clava/);
    assert.ok((await infoEquipo.locator('.info-fuente').textContent())
      .includes('NaufragioD20DRS.docx'));
    assert.equal(await infoEquipo.locator('.info-detalles').isHidden(),true);
    await page.keyboard.press('Escape');
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
    // QA de ficha DRS real en móvil, no solo del editor de compras.
    // Verificar legibilidad, encaje visual, origen editorial y Escape.
    await mochila.scrollIntoViewIfNeeded();
    await mochila.click();
    assert.equal(await page.locator('#ficha-emergente').getAttribute('role'),'dialog');
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /Bolsa resistente con correas para llevarla a la espalda/);
    const geometria=await page.locator('#ficha-emergente').evaluate(card=>{
      const rect=card.getBoundingClientRect();
      return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,
        width:rect.width,scrollWidth:card.scrollWidth,clientWidth:card.clientWidth,
        height:rect.height,viewportWidth:innerWidth,viewportHeight:innerHeight};
    });
    assert.ok(geometria.left>=-2&&geometria.right<=geometria.viewportWidth+2&&
      geometria.top>=-2&&geometria.bottom<=geometria.viewportHeight+2,
      nombre+': popup dentro de la pantalla móvil '+JSON.stringify(geometria));
    assert.ok(geometria.scrollWidth<=geometria.clientWidth+2,
      nombre+': sin scroll horizontal en popup de útil');
    assert.ok(geometria.height>=90,nombre+': altura móvil legible');
    await page.locator('#ficha-emergente .info-fuente').scrollIntoViewIfNeeded();
    assert.match(await page.locator('#ficha-emergente .info-fuente').innerText(),
      /Descripción editorial/);
    await page.screenshot({path:path.join(capturas,nombre+'-ficha-util-movil.png')});
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#ficha-emergente').isHidden(),true,
      nombre+': Escape cierra el popup móvil');
    assert.equal(await mochila.getAttribute('aria-expanded'),'false');
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
