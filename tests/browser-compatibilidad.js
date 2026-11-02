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
    async function abrirConfig(){
      if(!await page.locator('#dialogo-configuracion').evaluate(x=>x.open))
        await page.locator('#abrir-configuracion').click();
    }
    async function cerrarConfig(){
      if(await page.locator('#dialogo-configuracion').evaluate(x=>x.open))
        await page.locator('#aplicar-configuracion').click();
    }
    async function generar(){
      if(await page.locator('#dialogo-configuracion').evaluate(x=>x.open))
        await page.locator('#generar-dialogo').click();
      else await page.locator('#generar').click();
    }
    const nativeFill=page.fill.bind(page),nativeSelect=page.selectOption.bind(page);
    page.fill=async function(sel,...args){
      if(['#nivel','#cantidad','#nombre-personaje','#semilla'].includes(sel))
        await abrirConfig();
      return nativeFill(sel,...args);
    };
    page.selectOption=async function(sel,...args){
      if(['#ocupacion','#especie','#sexo-pj','#modo-nombre','#ambito-nombre'].includes(sel))
        await abrirConfig();
      return nativeSelect(sel,...args);
    };
    const fallos=[];
    page.on('pageerror',error=>fallos.push(error.message));
    const response=await page.goto(url,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200,'HTML inicial debe cargar');
    await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    assert.equal(await page.locator('#generar').isEnabled(),true);
    assert.match(await page.locator('.inicio-rapido').innerText(),
      /No hace falta configurar todo/,
      nombre+': explicar el camino sencillo a una persona nueva');
    assert.match(await page.locator('#fichas .vacio').innerText(),
      /Aquí aparecerá tu personaje/,
      nombre+': explicar qué encontrará en Resultados');
    assert.equal(await page.locator('#generar').textContent(),'Generar personaje');
    await page.locator('#selector-tema').selectOption('ebano');
    const contrasteEbano=await page.locator('.inicio-rapido strong').first().evaluate(el=>{
      const fg=getComputedStyle(el).color;
      const bg=getComputedStyle(el.closest('.inicio-rapido')).backgroundColor;
      return {fg,bg};
    });
    assert.notEqual(contrasteEbano.fg,'rgb(255, 240, 200)',
      nombre+': Ébano no usa amarillo pálido ilegible sobre blanco');
    await page.locator('#selector-tema').selectOption('clasico');
    // El botón anima background durante 150 ms: comprobar color final,
    // no un fotograma intermedio tras cambiar desde Ébano.
    await page.waitForFunction(()=>
      getComputedStyle(document.querySelector('#generar')).backgroundColor===
      'rgb(17, 81, 211)');
    // Identidad visual del blog: los colores no dependen de capturas,
    // servidores de fuentes ni del motor de renderizado.
    const marcaBlog=await page.evaluate(()=>{
      const estilo=selector=>getComputedStyle(document.querySelector(selector));
      return {
        fuente:estilo('body').fontFamily,
        modo:getComputedStyle(document.documentElement).colorScheme,
        inicio:estilo('.inicio-rapido').backgroundColor,
        acento:estilo('#generar').backgroundColor,
        colorBoton:estilo('#generar').color,
        bordePanel:estilo('.panel').borderTopColor
      };
    });
    assert.match(marcaBlog.fuente,/Exo/i,nombre+': tipografía editorial Exo');
    assert.equal(marcaBlog.modo,'light',nombre+': Clásico es el tema claro del blog');
    assert.equal(marcaBlog.inicio,'rgb(222, 238, 255)',nombre+': azul de tarjetas del blog');
    assert.equal(marcaBlog.acento,'rgb(17, 81, 211)',nombre+': botón principal azul de marca');
    assert.equal(marcaBlog.colorBoton,'rgb(255, 255, 255)',nombre+': texto blanco legible');
    assert.equal(marcaBlog.bordePanel,'rgb(166, 193, 221)',nombre+': borde de marca');
    assert.equal(await page.locator('#inicio-movil').isHidden(),true,
      nombre+': el paso introductorio móvil no duplica la ayuda del panel en escritorio');
    await page.screenshot({path:path.join(capturas,nombre+'-inicio-escritorio.png')});
    // Primera visita móvil: el panel arranca plegado; «Empezar» debe abrirlo.
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator('#panel-forja').isHidden(),true);
    assert.equal(await page.locator('#inicio-movil').isVisible(),true,
      nombre+': el primer paso debe mostrarse antes de Resultados');
    assert.equal(await page.locator('.empezar-forja').isVisible(),true);
    const primerPaso=await page.locator('.empezar-forja').boundingBox();
    assert.ok(primerPaso&&primerPaso.y+primerPaso.height<=844,
      nombre+': Empezar debe ser visible SIN desplazarse en 390×844');
    assert.equal(await page.locator('#generar-flotante').isVisible(),true,
      nombre+': crear personaje disponible con mesa vacía');
    await page.screenshot({path:path.join(capturas,nombre+'-inicio-movil.png')});
    await page.locator('.empezar-forja').click();
    assert.equal(await page.locator('#panel-forja').isVisible(),true,
      nombre+': Empezar abre la Forja en móvil');
    assert.equal(await page.locator('#alternar-menu').getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('#abrir-configuracion').evaluate(x=>document.activeElement===x),true,
      nombre+': Empezar enfoca la configuración');
    assert.equal(await page.locator('#generar-flotante').isVisible(),true,
      nombre+': con mesa vacía permanece el CTA flotante');
    await page.screenshot({path:path.join(capturas,nombre+'-forja-abierta-movil.png')});
    await page.locator('#alternar-menu').click();
    assert.equal(await page.locator('#generar-flotante').isVisible(),true,
      nombre+': el CTA sigue visible con el panel cerrado');
    await page.setViewportSize({width:1440,height:900});
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
    assert.equal((iconos.contenido.match(/<symbol id=/g)||[]).length,34);
    for(const id of ['masculino','femenino','indeterminado']){
      assert.ok(iconos.contenido.includes('id="sexo-'+id+'"'),
        nombre+': SVG de sexo '+id);
    }
    for(const id of ['espada','arco','varita','bolsa','mochila','orbe','libro',
      'armadura','escudo','municion']){
      assert.ok(iconos.contenido.includes('id="equipo-'+id+'"'),
        nombre+': icono de Equipo '+id);
    }
    assert.ok(iconos.contenido.includes('id="ico-configurar"'));
    for(const id of ['salud','esfuerzo','movimiento','potencia','esencia','blindaje']){
      assert.ok(iconos.contenido.includes('id="recurso-'+id+'"'),
        nombre+': SVG de '+id+' disponible');
    }
    assert.match(iconos.contenido,/<symbol id="ico-conjuro"/,
      nombre+': icono propio de Conjuros');
    assert.match(iconos.contenido,/<symbol id="ico-tecnica"/,
      nombre+': icono propio de Técnicas');
    // Los nombres originales de los paquetes no siempre son entradas del
    // catálogo individual. Deben poder consultarse sin atributos inventados.
    for(const [item,esperado,procedencia] of [
      ['túnica','Túnica',/Especial arcanistas/],
      ['yesquero','Yesquero',/Naufragio d20 DRS/],
      ['antorcha (DU d6)','Antorcha',/Especial arcanistas/]
    ]){
      const enlace=await page.evaluate(nombreObjeto=>
        window.NaufragioInfoUI.etiqueta(nombreObjeto,'equipo','nd20'),
        item);
      assert.match(enlace,/class="referencia-glosario"/,
        nombre+': el objeto de paquete tiene popup: '+item);
      const id='e2e-paquete-'+item.length;
      await page.evaluate(([id,nombreObjeto])=>{
        const cont=document.createElement('div');cont.id=id;
        cont.innerHTML=window.NaufragioInfoUI.etiqueta(nombreObjeto,'equipo','nd20');
        document.body.appendChild(cont);
      },[id,item]);
      await page.locator('#'+id+' .referencia-glosario').click();
      assert.equal(await page.locator('#ficha-emergente h3').textContent(),esperado,
        nombre+': título de popup del paquete '+item);
      assert.match(await page.locator('#ficha-emergente').innerText(),procedencia,
        nombre+': procedencia del popup '+item);
      if(item==='túnica')
        assert.equal(await page.locator('#ficha-emergente .info-primarios dt')
          .allTextContents().then(x=>x.includes('Precio:')),false,
          nombre+': túnica de paquete sin precio inventado');
      await page.locator('#'+id).evaluate(el=>el.remove());
      await page.keyboard.press('Escape');
    }
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
    assert.deepEqual(await popup.locator('.info-escuela').allTextContents(),['Arcana']);
    assert.match(await popup.locator('.info-escuela').getAttribute('class'),
      /info-escuela-arcana/);
    const colorEscuela=await popup.locator('.info-escuela-arcana').evaluate(el=>({
      fondo:getComputedStyle(el).backgroundColor,
      borde:getComputedStyle(el).borderTopColor
    }));
    assert.equal(colorEscuela.fondo,'rgb(135, 206, 250)',
      nombre+': Arcana usa LightSkyBlue del blog');
    assert.equal(colorEscuela.borde,'rgb(0, 191, 255)',
      nombre+': Arcana conserva DeepSkyBlue de contorno');
    const ventanaBlog=await popup.evaluate(el=>({
      fondo:getComputedStyle(el).backgroundColor,
      texto:getComputedStyle(el).color
    }));
    assert.equal(ventanaBlog.fondo,'rgb(247, 251, 255)',
      nombre+': las fichas emergentes también usan la paleta editorial');
    assert.equal(ventanaBlog.texto,'rgb(32, 52, 71)',
      nombre+': las fichas emergentes mantienen texto legible');
    assert.equal(await popup.locator('.info-circulo').getAttribute('aria-label'),'Círculo 1');
    assert.equal(await popup.locator('.info-circulo-valor').textContent(),'I');
    assert.equal(await popup.locator('.info-circulo-rotulo').textContent(),'Círculo');
    assert.equal(await popup.locator('.info-clasificacion').count(),0,
      nombre+': no duplicar el Círculo en un ordinal textual');
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
    await abrirConfig();
    await page.locator('#configuracion-avanzada summary').click();
    await abrirConfig();
    await page.locator('#informacion-avanzada').check();
    await cerrarConfig();
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
    // Las estructuras de los Conjuros proceden de índices documentados:
    // nunca se añade HTML dentro de los textos literales del DRS.
    for(const entrada of [
      ['conjuro-8','Luz',2],
      ['conjuro-18','Ilusión',2],
      ['conjuro-19','Resistir los elementos',2],
      ['conjuro-45','Forja arcana',4],
      ['conjuro-51','Lluvia de estrellas',2],
      ['conjuro-61','Palabra de Poder: Muerte',2]
    ]){
      await page.locator('#e2e-poder').evaluate((el,id)=>{
        el.dataset.glosaId=id;
      },entrada[0]);
      await page.locator('#e2e-poder').click();
      assert.equal(await popup.locator('h3').textContent(),entrada[1]);
      assert.equal(await popup.locator('.info-conjuro-bloques>ul>li').count(),entrada[2],
        nombre+': lista semántica de '+entrada[1]);
      assert.equal(await popup.locator('.info-conjuro-bloques>table').count(),0);
    }
    assert.equal(await popup.locator('.info-conjuro-bloques>p').count(),1,
      nombre+': Palabra de Poder tiene introducción y lista aparte');
    await page.locator('#e2e-poder').evaluate(el=>{
      el.dataset.glosaId='conjuro-14';
    });
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('h3').textContent(),'Calentar metal');
    const tablaConjuro=popup.locator('.info-tabla-conjuro');
    assert.equal(await tablaConjuro.count(),1,nombre+': tabla real de Calentar metal');
    assert.deepEqual(await tablaConjuro.locator('thead th').allTextContents(),
      ['Turno','Temperatura','Daño']);
    assert.equal(await tablaConjuro.locator('tbody tr').count(),5);
    assert.deepEqual(await tablaConjuro.locator('tbody tr').nth(2).locator('td').allTextContents(),
      ['3-4','Ardiente','2d6']);
    assert.equal(await popup.locator('.info-conjuro-bloques>p').count(),2);
    await page.setViewportSize({width:390,height:844});
    const tablaMovil=await tablaConjuro.evaluate(e=>({
      ancho:e.getBoundingClientRect().width,
      ventana:innerWidth,
      desbordamiento:e.scrollWidth-e.clientWidth
    }));
    assert.ok(tablaMovil.ancho<390&&tablaMovil.desbordamiento<3,
      nombre+': tabla DRS legible en móvil sin desbordamiento');
    await page.screenshot({path:path.join(capturas,nombre+'-tabla-calentar-metal-movil.png')});
    await page.setViewportSize({width:1440,height:900});
    // Técnicas y efectos no pertenecientes a Conjuros siguen siendo texto plano.
    await page.locator('#e2e-poder').evaluate(x=>{x.dataset.glosaId='tecnica-02';});
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('.info-tipo').textContent(),'Técnica');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),'Disciplina');
    assert.match(await popup.locator('.info-primarios').textContent(),
      /Coste:\s*1 punto de Esfuerzo/);
    assert.match(await popup.locator('.info-primarios').textContent(),/Requisito:/);
    assert.match(await popup.locator('.info-descripcion').first().textContent(),
      /Recuperas 1d4 Puntos de Salud/,'Baluarte exige su efecto DRS íntegro');
    await page.locator('#e2e-poder').evaluate(x=>{x.dataset.glosaId='tecnica-03';});
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('h3').textContent(),'Disparo aturdidor');
    assert.match(await popup.locator('.info-descripcion').first().textContent(),
      /criatura afectada no se podrá mover durante su próximo Turno/,
      nombre+': Disparo aturdidor debe mostrar su efecto DRS');
    // Regresión de Aguijón impío: alcance duplicado por «20m»/«20 m».
    await page.locator('#e2e-poder').evaluate(x=>{x.dataset.glosaId='conjuro-0';});
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('h3').textContent(),'Aguijón impío');
    assert.deepEqual(await popup.locator('.info-primarios dt').allTextContents(),
      ['Alcance:','Daño:'],nombre+': no repetir Alcance');
    assert.deepEqual(await popup.locator('.info-primarios dd').allTextContents(),
      ['20 m','1d6 (veneno e impío)'],
      nombre+': daño literal mixto visible en consulta rápida');
    assert.match(await popup.locator('.info-descripcion').first().textContent(),
      /1d6 de daño por veneno e impío/);
    await abrirConfig();
    await page.locator('#informacion-avanzada').uncheck();
    await cerrarConfig();
    // Objetos: categoría en pill, precio y descripción de reglas sin
    // mostrar metadatos de creación del catálogo.
    await page.evaluate(()=>{
      const boton=document.createElement('button');
      boton.id='e2e-equipo';boton.type='button';
      boton.className='referencia-glosario';boton.textContent='Consultar objeto';
      boton.dataset.glosaNombre='Varita de cerezo';
      boton.dataset.glosaGrupo='equipo';
      boton.dataset.glosaSistema='nd20';
      document.body.appendChild(boton);
    });
    await page.locator('#e2e-equipo').click();
    assert.equal(await popup.locator('.info-tipo').textContent(),'Objeto');
    assert.equal(await popup.locator('.info-categoria').textContent(),'Varita');
    assert.match(await popup.locator('.info-categoria').getAttribute('class'),
      /info-categoria-objeto-varitas/);
    assert.match(await popup.locator('.info-primarios').innerText(),/Precio:\s*100 mo/);
    const columnasObjeto=()=>popup.locator('.info-primarios-objeto').evaluate(el=>
      getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(await columnasObjeto(),2,nombre+': Objetos en dos columnas');
    assert.equal(await popup.locator('.info-objeto-campo').count(),6,
      nombre+': seis parejas de estadísticas DRS independientes');
    await page.setViewportSize({width:390,height:844});
    assert.equal(await columnasObjeto(),2,nombre+': Objetos mantienen dos columnas en móvil');
    assert.equal(await popup.locator('.info-primarios-objeto').evaluate(el=>
      el.scrollWidth<=el.clientWidth),true,nombre+': los valores de Objetos caben en móvil');
    await page.setViewportSize({width:320,height:720});
    assert.equal(await columnasObjeto(),1,nombre+': Objetos legibles en móvil muy estrecho');
    await page.setViewportSize({width:1440,height:900});
    const varitaCampos=await popup.locator('.info-primarios').evaluate(x=>
      Object.fromEntries(Array.from(x.querySelectorAll('dt')).map(k=>[
        k.textContent.replace(/:$/,''),k.nextElementSibling?.textContent
      ])));
    assert.deepEqual(varitaCampos,{
      Precio:'100 mo',Daño:'1d3',Penetración:'1',Alcance:'12 m',
      Durabilidad:'d4',Munición:'DU d6'},
      nombre+': la varita presenta todas las estadísticas oficiales');
    assert.match(await popup.locator('.info-descripcion').first().innerText(),
      /Tirada de Mente/);
    assert.equal(await popup.locator('.info-origen-glosa').count(),0,
      nombre+': no mostrar procedencia editorial en la ficha');
    assert.doesNotMatch(await popup.innerText(),
      /Descripción contextual|no introduce otras reglas|según el DRS/i);
    for(const item of [['Daga','Arma ligera'],['Armadura de cuero','Armadura ligera'],
      ['Flechas','Munición'],['Escudo grande','Escudo']]){
      await page.locator('#e2e-equipo').evaluate((e,x)=>{
        e.dataset.glosaNombre=x;
      },item[0]);
      await page.locator('#e2e-equipo').click();
      assert.equal(await popup.locator('.info-categoria').textContent(),item[1],
        nombre+': categoría de '+item[0]);
    }
    await page.locator('#e2e-equipo').evaluate(el=>{el.dataset.glosaNombre='Armadura de tela';});
    await page.locator('#e2e-equipo').click();
    assert.match(await popup.locator('.info-primarios').innerText(),/Blindaje:\s*d4/);
    assert.match(await popup.locator('.info-primarios').innerText(),/Durabilidad:\s*—/);
    await page.locator('#e2e-equipo').evaluate(el=>{el.dataset.glosaNombre='Armadura de pieles';});
    await page.locator('#e2e-equipo').click();
    assert.match(await popup.locator('.info-primarios').innerText(),/Blindaje:\s*d6/);
    assert.match(await popup.locator('.info-primarios').innerText(),/Durabilidad:\s*d6/);
    await page.locator('#e2e-poder').click();
    assert.equal(await popup.locator('.info-detalles').isHidden(),true);
    await page.keyboard.press('Escape');
    // Cinco categorías, texto DRS único y transiciones reales del puntero.
    await page.evaluate(()=>{
      const b=document.createElement('button');
      b.id='e2e-talento';b.type='button';b.textContent='Consultar Talento';
      b.className='referencia-glosario';
      b.dataset.glosaId='talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes';
      b.dataset.glosaGrupo='talento';b.dataset.glosaSistema='nd20';
      document.body.appendChild(b);
    });
    await page.locator('#e2e-talento').hover();
    assert.equal(await popup.getAttribute('role'),'tooltip',
      nombre+': hover debe mostrar Talentos sin necesidad de pulsar');
    assert.equal(await popup.isVisible(),true);
    const puente=await popup.boundingBox();
    assert.ok(puente,'Popup en pantalla');
    await page.mouse.move(puente.x+Math.min(50,puente.width/2),
      puente.y+Math.min(35,puente.height/2));
    await page.waitForTimeout(250);
    assert.equal(await popup.isVisible(),true,
      nombre+': mover ratón desde el enlace al popup no lo cierra');
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.getAttribute('role'),'dialog',
      nombre+': clic convierte consulta ligera en diálogo fijado');
    assert.equal(await popup.locator('.info-tipo').textContent(),'Talento');
    assert.equal(await popup.locator('h3').textContent(),'Expulsar muertos vivientes');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Ocupación · Clérigo');
    assert.equal(await popup.locator('.info-categoria').textContent(),'Acción');
    for(const tema of ['clasico','ebano','ceruleo','obsidiana']){
      await page.locator('#selector-tema').selectOption(tema);
      await page.locator('#e2e-talento').click();
      assert.equal(await popup.locator('.info-categoria').textContent(),'Acción',
        nombre+': categoría visible en tema '+tema);
      await page.screenshot({path:path.join(capturas,
        nombre+'-talento-'+tema+'.png')});
    }
    await page.locator('#selector-tema').selectOption('clasico');
    await page.locator('#e2e-talento').click();
    assert.deepEqual(await popup.locator('.info-primarios dt').allTextContents(),
      ['Atributo:','Coste:']);
    assert.deepEqual(await popup.locator('.info-primarios dd').allTextContents(),
      ['Intuición','1 Punto de Esfuerzo']);
    assert.equal(await popup.locator('.info-descripcion').count(),1,
      nombre+': un solo texto original, sin resumen redundante');
    assert.match(await popup.locator('.info-descripcion').textContent(),
      /Todos aquellos que sean de un Nivel igual o inferior al tuyo/);
    assert.equal(await popup.locator('.info-resumen-editorial').count(),0);
    assert.equal(await popup.locator('.info-uso-editorial').count(),0);
    assert.equal(await popup.locator('.info-texto-literal').count(),0);
    assert.match(await popup.locator('.info-fuente').textContent(),
      /Origen: Naufragio d20 DRS · Fuente: NaufragioD20DRS.docx/);
    assert.equal(await popup.locator('.info-detalles').isHidden(),true);
    assert.equal(await popup.locator('.info-aclaracion-autoral').isVisible(),false,
      nombre+': aclaración solo en Detalles técnicos');
    assert.equal(await popup.locator('.info-cerrar').isVisible(),true);
    const popupScroll=await popup.evaluate(x=>({scroll:x.scrollHeight,
      alto:x.clientHeight,alturaVentana:innerHeight}));
    assert.ok(popupScroll.alto<=popupScroll.alturaVentana,
      nombre+': Talento abierto encaja en viewport');
    await popup.evaluate(x=>{x.scrollTop=x.scrollHeight;});
    assert.equal(await popup.isVisible(),true,
      nombre+': el popup fijado permanece visible mientras se desplaza');
    assert.ok(await popup.evaluate(x=>x.scrollTop>=0));
    // Otro vínculo bajo el ratón no sustituye un diálogo ya fijado.
    await page.evaluate(()=>{
      const b=document.createElement('button');
      b.id='e2e-talento-otro';b.type='button';b.textContent='Otro Talento';
      b.className='referencia-glosario';
      b.dataset.glosaId='talento-drs-especie-elfo-agreste-rapidez';
      b.dataset.glosaGrupo='talento';b.dataset.glosaSistema='nd20';
      document.body.appendChild(b);
    });
    await page.locator('#e2e-talento-otro').hover();
    assert.equal(await popup.locator('h3').textContent(),'Expulsar muertos vivientes',
      nombre+': hover no sustituye diálogo fijado');
    await page.locator('#e2e-talento-otro').evaluate(x=>x.remove());

    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-mediano-amable-salvese-quien-pueda';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('h3').textContent(),'¡Sálvese quien pueda!');
    assert.equal(await popup.locator('.info-categoria').textContent(),'Reacción');
    assert.match(await popup.locator('.info-descripcion').textContent(),
      /1 Punto de Esfuerzo y una Acción/);
    assert.equal(await popup.locator('.info-aclaracion-autoral').isVisible(),false);
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-elfo-agreste-rapidez';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-categoria').textContent(),'Mejora');
    assert.match(await popup.locator('.info-descripcion').textContent(),/Movimiento en 1/);
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-elfo-agreste-linaje-feerico';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-categoria').textContent(),'Pasiva');
    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-especie-semielfo-herencia-dual-se';
    });
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('h3').textContent(),'Herencia dual');
    assert.equal(await popup.locator('.info-categoria').textContent(),'Especial');
    assert.equal(await popup.locator('.info-clasificacion').textContent(),
      'Especie · Semielfo');
    assert.match(await popup.locator('.info-descripcion').textContent(),/Linaje feérico/);
    assert.equal(await popup.locator('.info-primarios dt').count(),0,
      nombre+': no inventar activación o coste para Especie');
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
      nombre+': se preserva la errata literal de Gnomo');
    assert.equal(await popup.locator('.info-aclaracion-autoral').count(),0);

    await page.locator('#e2e-talento').evaluate(x=>{
      x.dataset.glosaId='talento-drs-ocupacion-clerigo-expulsar-muertos-vivientes';
    });
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=true;});
    await abrirConfig();
    await page.locator('#informacion-avanzada').check();
    await cerrarConfig();
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-detalles').isVisible(),true);
    assert.match(await popup.locator('.info-detalles').textContent(),
      /Párrafos del DRS/);
    assert.match(await popup.locator('.info-detalles').textContent(),
      /3 zombis y 2 esqueletos/);
    assert.match(await popup.locator('.info-detalles').textContent(),
      /2 Tiradas/);
    assert.equal(await popup.locator('.info-descripcion').count(),1);
    await abrirConfig();
    await page.locator('#informacion-avanzada').uncheck();
    await cerrarConfig();
    await page.locator('#e2e-talento').click();
    assert.equal(await popup.locator('.info-aclaracion-autoral').isVisible(),false);

    await page.setViewportSize({width:390,height:844});
    await page.locator('#e2e-talento').click();
    const modalMovil=await popup.boundingBox();
    assert.ok(modalMovil&&modalMovil.width<=390&&modalMovil.height<=844,
      nombre+': modal de Talentos no desborda el viewport táctil');
    await page.screenshot({path:path.join(capturas,nombre+'-talento-movil.png')});
    await page.setViewportSize({width:1440,height:900});
    await page.keyboard.press('Escape');
    assert.equal(await popup.isHidden(),true,
      nombre+': Escape cierra el diálogo');
    assert.equal(await page.locator('#e2e-talento').evaluate(
      x=>document.activeElement===x),true,
      nombre+': Escape devuelve el foco a la referencia');
    await page.locator('#e2e-talento').evaluate(x=>x.blur());
    await page.locator('#e2e-talento').focus();
    assert.equal(await popup.getAttribute('role'),'dialog',
      nombre+': foco de teclado fija el diálogo');
    await popup.locator('.info-cerrar').click();
    assert.equal(await popup.isHidden(),true,
      nombre+': el botón Cerrar funciona');
    await page.locator('#e2e-talento').evaluate(x=>x.remove());
    await cerrarConfig();
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=false;});
    // Restaurar el estado original para las pruebas de Talentos que siguen.
    await page.locator('#configuracion-avanzada').evaluate(x=>{x.open=false;});
    await page.locator('#e2e-poder').evaluate(x=>x.remove());
    await abrirConfig();
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
    await cerrarConfig();
    // Alternar sistemas no puede recuperar opciones suplementarias ocultas.
    for(const otro of sistemasVisibles){
      await page.locator('.juegos-compactos [data-juego="'+otro+'"]').click();
      assert.equal(await page.locator('#juego').inputValue(),otro,
        nombre+': selector de sistema '+otro);
    }
    // Comprobar generación real de todos los sistemas visibles.
    for(const otro of sistemasVisibles){
      await page.locator('.juegos-compactos [data-juego="'+otro+'"]').click();
      await abrirConfig();
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
      await generar();
      await page.locator('#fichas .tarjeta').first().waitFor();
      const cabeceraOtro=page.locator('#fichas .tarjeta').first();
      assert.equal(await cabeceraOtro.locator('.nivel-ficha').innerText(),'Nivel 1');
      assert.match(await cabeceraOtro.locator('.sexo-ficha use').getAttribute('href'),
        /^assets\/icons-forja\.svg#sexo-(masculino|femenino)$/,
        nombre+': Dungeon Hack respeta el sexo generado sin asignar otros valores');
      assert.ok((await page.locator('#fichas .tarjeta').first().innerText())
        .includes('Comprobación '+otro),
        nombre+': generación de '+otro+' no debe romperse por depurar DLC');
      await page.locator('#borrar').click();
      assert.equal(await page.locator('#fichas .tarjeta').count(),0);
    }
    await cerrarConfig();
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
    assert.equal(combinados.length,33);
    assert.ok(nombresYlat.entradas.every(x=>x.ambito==='Isla Tormenta'),
      nombre+': el corpus de variantes no contiene el ámbito ajeno a Ylat');
    assert.ok(!/niguac|niguaz/i.test(JSON.stringify(nombresYlat)),
      nombre+': no hay datos del corpus excluido');
    if(process.env.FORJA_PUBLIC_ROOT){
      assert.equal(nombresYlat.entradas.length,33,
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
      await abrirConfig();
      await page.selectOption('#sexo-pj',sexoHistorico);
      await page.fill('#nombre-personaje','');
      await page.fill('#nivel','1');
      await page.fill('#semilla','Forja-historica-'+nombre+'-'+sexoHistorico);
      await generar();
      const tarjeta=page.locator('#fichas .tarjeta').first();
      await tarjeta.waitFor();
      assert.equal(await tarjeta.locator('.nivel-ficha').innerText(),'Nivel 1');
      assert.equal(await tarjeta.locator('.sexo-ficha use').getAttribute('href'),
        'assets/icons-forja.svg#sexo-'+sexoHistorico,
        nombre+': icono de sexo visible junto a Ocupación');
      assert.doesNotMatch(await tarjeta.locator('.cabecera-ficha .etiqueta').innerText(),
        /Nivel|Masculino|Femenino/,nombre+': cabecera despejada');
      const elegido=await tarjeta.locator('h3').innerText();
      assert.ok(bancoHistorico.entradas.some(x=>x.nombre===elegido),
        nombre+': nombre histórico no reconocido: '+elegido);
      const textoHistorico=await tarjeta.innerText();
      assert.doesNotMatch(textoHistorico,/Forma del generador histórico/,
        nombre+': sin avisos de procedencia técnica en Contexto');
      assert.doesNotMatch(textoHistorico,/Nombre del banco histórico sin clasificación documental de sexo/,
        nombre+': sin notas repetidas del banco histórico');
      await page.locator('#borrar').click();
    }
    await page.selectOption('#modo-nombre','combinado');
    assert.equal(await page.locator('#opciones-ambito-nombre').isVisible(),true);
    await page.selectOption('#ocupacion','Guerrero');
    await page.selectOption('#especie','Humano común');
    await page.selectOption('#sexo-pj','femenino');
    assert.equal(await page.locator('#ambito-nombre option').count(),2,
      nombre+': solo Todas e Isla Tormenta en el filtro de variantes');
    for(const ambito of ['Isla Tormenta']){
      await page.selectOption('#modo-nombre','combinado');
      await page.selectOption('#ambito-nombre',ambito);
      await page.fill('#nombre-personaje','');
      await page.fill('#semilla','Forja-nombre-'+nombre+'-'+ambito);
      await page.fill('#nivel','1');
      await generar();
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
    await generar();
    const fichaTalentos=page.locator('#fichas .tarjeta').first();
    await fichaTalentos.waitFor();
    const bloquesFicha=await fichaTalentos.locator('.bloque-ficha').evaluateAll(nodos=>
      nodos.map(n=>({titulo:n.querySelector('h4')?.textContent,
        columnas:n.querySelector('ul')?.classList.contains('lista-dos-columnas'),
        computadas:n.querySelector('ul')?.classList.contains('lista-dos-columnas')?
          getComputedStyle(n.querySelector('ul')).gridTemplateColumns.split(' ').length:null
      })));
    const ordenBloques=bloquesFicha.map(b=>b.titulo);
    assert.ok(ordenBloques.indexOf('Competencias')>=0&&
      ordenBloques.indexOf('Competencias')<ordenBloques.indexOf('Talentos y capacidades'),
      nombre+': Competencias debe preceder a Talentos');
    assert.equal(bloquesFicha.find(x=>x.titulo==='Equipo')?.columnas,true,
      nombre+': Equipo usa la misma rejilla compacta que Talentos y Poderes');
    assert.equal(bloquesFicha.find(x=>x.titulo==='Equipo')?.computadas,2,
      nombre+': Equipo utiliza dos columnas en escritorio');
    const recursos=fichaTalentos.locator('.recursos-rejilla');
    assert.equal(await recursos.count(),1,nombre+': recursos en una sola cuadrícula');
    const columnasRecursos=()=>recursos.evaluate(el=>
      getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(await columnasRecursos(),4,nombre+': Recursos muestran cuatro columnas');
    const dimensionesRecursos=()=>recursos.evaluate(el=>{
      const estilo=getComputedStyle(el);
      return {
      ancho:el.clientWidth-parseFloat(estilo.paddingLeft)-parseFloat(estilo.paddingRight),
      ultimo:el.querySelector('.recurso-ficha:last-child').getBoundingClientRect().width,
      primero:el.querySelector('.recurso-ficha:first-child').getBoundingClientRect().width,
      icono:el.querySelector('svg.icono-recurso').getBoundingClientRect().width,
      desborda:el.scrollWidth>el.clientWidth
      };
    });
    assert.ok((await dimensionesRecursos()).icono<=20,
      nombre+': los SVG de Recursos son más pequeños');
    assert.ok(Math.abs((await dimensionesRecursos()).ultimo-
      (await dimensionesRecursos()).primero)<=2,
      nombre+': el quinto recurso tiene el mismo ancho que el primero');
    await page.setViewportSize({width:531,height:844});
    assert.equal(await columnasRecursos(),4,nombre+': cuatro columnas en ficha de 531px');
    assert.equal((await dimensionesRecursos()).desborda,false,
      nombre+': Recursos no desbordan a 531px');
    await page.setViewportSize({width:390,height:844});
    assert.equal(await columnasRecursos(),2,nombre+': dos columnas en móvil estrecho');
    assert.equal((await dimensionesRecursos()).desborda,false,
      nombre+': Recursos no desbordan a 390px');
    await page.setViewportSize({width:1440,height:900});
    const valoresRecursos=await recursos.locator('.recurso-nombre').allTextContents();
    for(const etiqueta of ['Salud','Esfuerzo','Movimiento','Potencia','Blindaje'])
      assert.ok(valoresRecursos.includes(etiqueta),nombre+': recurso '+etiqueta);
    assert.equal(await recursos.locator('svg.icono-recurso use').count(),
      valoresRecursos.length,nombre+': cada recurso posee un SVG');
    const protecciones=fichaTalentos.locator('.protecciones-activas');
    assert.equal(await protecciones.locator('select').count(),2);
    const opcionesArmadura=await protecciones.locator('select[data-tipo="armadura"] option')
      .evaluateAll(xs=>xs.map(x=>x.value).filter(Boolean));
    const blindajeVisible=()=>fichaTalentos.locator('.recurso-ficha')
      .filter({hasText:'Blindaje'}).locator('strong').innerText();
    assert.equal(await blindajeVisible(),'Sin armadura',
      nombre+': ninguna armadura se equipa automáticamente');
    if(opcionesArmadura.length){
      const elegida=opcionesArmadura[0];
      const catalogo=JSON.parse(fs.readFileSync(
        path.join(raiz,'data/equipo-inicial.json'),'utf8'));
      const registro=catalogo.armaduras.find(x=>x.nombre===elegida);
      assert.ok(registro);
      await protecciones.locator('select[data-tipo="armadura"]').selectOption(elegida);
      assert.equal(await blindajeVisible(),String(registro.blindaje),
        nombre+': Blindaje corresponde solo a armadura equipada');
      assert.equal(await protecciones.locator('select[data-tipo="armadura"]').inputValue(),elegida,
        nombre+': mantiene selección tras redibujar ficha');
      await protecciones.locator('select[data-tipo="armadura"]').selectOption('');
      assert.equal(await blindajeVisible(),'Sin armadura');
    }
    const opcionesEscudo=await protecciones.locator('select[data-tipo="escudo"] option')
      .evaluateAll(xs=>xs.map(x=>x.value).filter(Boolean));
    if(opcionesEscudo.length){
      await protecciones.locator('select[data-tipo="escudo"]')
        .selectOption(opcionesEscudo[0]);
      assert.equal(await blindajeVisible(),'Sin armadura',
        nombre+': un escudo no se suma al dado permanente de Blindaje');
      assert.match(await recursos.locator('.recurso-nota-escudo').innerText(),
        /Escudo \+1 solo al bloquear/);
      assert.equal(await recursos.locator('.recurso-ficha .recurso-nota-escudo').count(),0,
        nombre+': la aclaración del escudo no agranda la tarjeta de Blindaje');
      assert.equal(await recursos.locator('.recurso-ficha').count(),5,
        nombre+': las cinco tarjetas conservan tamaño uniforme');
    }
    const rejillaTalentos=fichaTalentos.locator('.bloque-ficha ul.lista-dos-columnas').first();
    assert.equal(await rejillaTalentos.evaluate(el=>getComputedStyle(el).gridTemplateColumns
      .split(' ').length),2,nombre+': Talentos en dos columnas como Atributos');
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
    const recuperacion=fichaTalentos.locator(
      '.referencia-glosario[data-glosa-nombre="Recuperación"]');
    // Regresión: hover sobre otro Talento NO sustituye una ficha fijada.
    assert.equal(await page.locator('#ficha-emergente').getAttribute('role'),'dialog',
      nombre+': una ficha abierta con clic debe permanecer fijada');
    assert.equal(await page.locator('#ficha-emergente').isVisible(),true,
      nombre+': una ficha fijada no debe estar oculta antes del hover rival');
    await recuperacion.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerover',{
      bubbles:true,pointerType:'mouse',relatedTarget:null})));
    const fijo=await page.locator('#ficha-emergente').evaluate(x=>({
      rol:x.getAttribute('role'),titulo:x.querySelector('h3')?.textContent,
      texto:x.querySelector('.info-descripcion')?.textContent,
      visible:!x.hidden}));
    assert.equal(fijo.rol,'dialog',nombre+': hover no debe convertir un diálogo en tooltip '+JSON.stringify(fijo));
    assert.match(fijo.texto||'',/gastar 1 Punto de Esfuerzo y una Acción/,
      nombre+': el hover no reemplaza la ficha fijada mediante clic '+JSON.stringify(fijo));
    await page.keyboard.press('Escape');
    await recuperacion.click();
    assert.match(await page.locator('#ficha-emergente .info-descripcion').innerText(),
      /pasar un Intervalo recuperándote para restaurar 1d8 Puntos de Salud/);
    // Resumen siempre visible, datos técnicos solo mediante disclosure o preferencia.
    const detalles=page.locator('#ficha-emergente .info-detalles');
    assert.equal(await detalles.count(),1,nombre+': Talento debe poder desplegar detalles');
    assert.equal(await detalles.isHidden(),true,
      nombre+': detalles técnicos del Talento DRS ocultos por defecto');
    await page.keyboard.press('Escape');
    await abrirConfig();
    await page.locator('#configuracion-avanzada summary').click();
    await abrirConfig();
    await page.locator('#informacion-avanzada').check();
    await cerrarConfig();
    await recuperacion.click();
    assert.equal(await page.locator('#ficha-emergente .info-detalles').evaluate(e=>e.open),true,
      nombre+': preferencia avanzada despliega los detalles al abrir');
    await page.keyboard.press('Escape');
    await abrirConfig();
    await page.locator('#informacion-avanzada').uncheck();
    await cerrarConfig();
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
      await generar();
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
    await generar();
    await page.locator('#fichas .tarjeta').first().waitFor();
    const ficha=page.locator('#fichas .tarjeta').first();
    assert.equal(await ficha.locator('.nivel-ficha').innerText(),'Nivel 30');
    const cabeceraMedidas=await ficha.locator('.acciones-cabecera-ficha').evaluate(el=>{
      const nivel=el.querySelector('.nivel-ficha').getBoundingClientRect();
      const cerrar=el.querySelector('.eliminar-ficha').getBoundingClientRect();
      return {nivelDerecha:nivel.right,cerrarIzquierda:cerrar.left};
    });
    assert.ok(cabeceraMedidas.nivelDerecha<=cabeceraMedidas.cerrarIzquierda,
      nombre+': el Nivel está inmediatamente a la izquierda de cerrar');
    await page.locator('#selector-tema').selectOption('ceruleo');
    for(const clase of ['.comprar-utiles','.copiar-ficha','.eliminar-ficha']){
      const boton=ficha.locator(clase);
      await boton.hover();
      await page.waitForFunction(selector=>
        getComputedStyle(document.querySelector('#fichas .tarjeta '+selector))
          .backgroundColor==='rgb(197, 239, 255)',clase);
      const colores=await boton.evaluate(el=>({
        fondo:getComputedStyle(el).backgroundColor,
        texto:getComputedStyle(el).color
      }));
      assert.deepEqual(colores,{fondo:'rgb(197, 239, 255)',
        texto:'rgb(7, 20, 72)'},nombre+': Cerúleo mantiene contraste en '+clase);
    }
    await page.locator('#selector-tema').selectOption('clasico');
    const inicial=precio(await ficha.locator('.riqueza').innerText());
    await ficha.locator('.comprar-utiles').click();
    assert.equal(await page.locator('#editor-compras').isVisible(),true);
    assert.equal(await page.locator('#editor-compras').evaluate(el=>el.open),true,
      nombre+': las compras se muestran en un diálogo modal');
    assert.equal(await page.locator('#compras-grupo option').count(),6,
      nombre+': familias originales de útiles DRS');
    assert.ok((await page.locator('#compras-articulo option').count())<43,
      nombre+': artículos agrupados en un desplegable más compacto');
    await page.selectOption('#compras-grupo','campamento');
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
    await page.selectOption('#compras-grupo','campamento');
    await page.selectOption('#compras-articulo','campamento-martillo');
    await page.fill('#compras-cantidad','2');
    await page.locator('#compras-cantidad').press('Enter');
    assert.equal(await page.locator('#editor-compras').isVisible(),true,
      nombre+': Intro no confirma el carrito');
    assert.equal(await page.locator('#compras-lista li').count(),1);
    await page.selectOption('#compras-grupo','aventura');
    await page.selectOption('#compras-articulo','aventura-tiza');
    await page.fill('#compras-cantidad','3');
    await page.locator('#compras-anadir').click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.03 mo/);
    await page.locator('.compras-quitar-linea').last().click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.00 mo/);
    await page.selectOption('#compras-grupo','aventura');
    await page.selectOption('#compras-articulo','aventura-tiza');
    await page.fill('#compras-cantidad','3');
    await page.locator('#compras-anadir').click();
    assert.match(await page.locator('#compras-total').innerText(),/4\.03 mo/);
    await page.selectOption('#compras-grupo','consumibles');
    await page.selectOption('#compras-articulo','consumible-antidoto');
    await page.fill('#compras-cantidad','1');
    await page.fill('#compras-nivel','3');
    assert.match(await page.locator('#compras-detalle').innerText(),/150\.00 mo/,
      nombre+': Antídoto Nivel 3 vale 150 mo');
    await page.selectOption('#compras-grupo','herramientas');
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
    // Regresión de accesibilidad: el flotante no cubre el pie de página.
    await page.locator('.pie').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('#generar-flotante').hidden);
    assert.equal(await page.locator('#generar-flotante').isHidden(),true,
      nombre+': el CTA flotante no debe tapar el pie de página en móvil');
    const enlacePie=page.locator('.pie a').first();
    assert.equal(await enlacePie.isVisible(),true);
    assert.equal(await enlacePie.isEnabled(),true);
    await page.screenshot({path:path.join(capturas,nombre+'-pie-despejado.png')});
    // Fuera del pie sigue disponible, excepto junto al botón del formulario.
    await page.locator('#titulo-resultados').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>!document.querySelector('#generar-flotante').hidden);
    assert.equal(await page.locator('#generar-flotante').isVisible(),true,
      nombre+': el CTA vuelve al alejarse del pie');
    // El menú móvil se cierra tras generar; abrirlo antes de consultar su CTA.
    await page.locator('#alternar-menu').click();
    await page.locator('#generar').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('#generar-flotante').hidden);
    assert.equal(await page.locator('#generar-flotante').isHidden(),true,
      nombre+': no duplicar dos botones Generar simultáneamente');
    // Desde el inicio, el flotante permite generar y muestra el resultado.
    await page.locator('#alternar-menu').click();
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>!document.querySelector('#generar-flotante').hidden);
    const antes=await page.locator('#fichas .tarjeta').count();
    await page.locator('#generar-flotante').click();
    await page.waitForFunction(n=>
      document.querySelectorAll('#fichas .tarjeta').length===n+1,antes);
    assert.equal(await page.locator('#inicio-movil').isHidden(),true,
      nombre+': la guía de primer paso desaparece tras crear fichas');
    await page.waitForFunction(()=>{
      const t=document.querySelector('#titulo-resultados');
      const r=t.getBoundingClientRect();
      return document.activeElement===t&&r.top>=-2&&r.top<innerHeight;
    });
    assert.equal(await page.locator('#fichas .tarjeta').count(),antes+1);
    // Dispositivo táctil: apertura por tap y cierre sin depender de hover.
    const tactil=await browser.newContext({viewport:{width:390,height:844},
      hasTouch:true});
    try{
      const pagTactil=await tactil.newPage();
      await pagTactil.goto(url,{waitUntil:'domcontentloaded'});
      await pagTactil.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
      await pagTactil.evaluate(()=>{
        const b=document.createElement('button');
        b.id='talento-tactil';b.type='button';b.textContent='Talento táctil';
        b.className='referencia-glosario';
        b.dataset.glosaId='talento-drs-especie-elfo-agreste-rapidez';
        b.dataset.glosaGrupo='talento';b.dataset.glosaSistema='nd20';
        document.body.appendChild(b);
      });
      await pagTactil.locator('#talento-tactil').tap();
      assert.equal(await pagTactil.locator('#ficha-emergente').getAttribute('role'),
        'dialog',nombre+': tap fija la consulta');
      assert.equal(await pagTactil.locator('.info-categoria').textContent(),
        'Mejora',nombre+': categoría visible en táctil');
      await pagTactil.locator('.info-cerrar').tap();
      assert.equal(await pagTactil.locator('#ficha-emergente').isHidden(),true);
    }finally{
      await tactil.close();
    }
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
