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
    const contexto=await browser.newContext({viewport:{width:1320,height:900},acceptDownloads:true});
    contextos.push(contexto);
    const p=await contexto.newPage();
    p.on('pageerror',e=>errores.push(e.message));
    if(ruta)await p.goto(ruta,{waitUntil:'domcontentloaded'});
    return p;
  }
  async function esperarCabeceraEstable(p){
    // WebKit puede resolver DOMContentLoaded antes de fuentes y logotipo;
    // comparar las dimensiones solamente después de su carga real.
    await p.evaluate(async()=>{
      await document.fonts.ready;
      const img=document.querySelector('.forja-cabecera .marca-logotipo');
      if(img)await img.decode();
    });
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
    assert.equal(await portal.locator('a[href="characters/"]').count(),1);
    assert.equal(await portal.locator('a[href="spells/"]').count(),1);
    assert.equal(await portal.locator('.forja-temas-abrir').count(),1);
    assert.equal(await portal.locator('.forja-temas-opciones').isVisible(),false);
    await portal.locator('.forja-temas-abrir').click();
    assert.equal(await portal.locator('.forja-tema-circulo').count(),5,
      'El menú muestra los cinco temas existentes, no nuevas combinaciones.');
    await portal.locator('[data-tema-opcion="ebano"]').click();
    assert.equal(await portal.locator('html').getAttribute('data-tema'),'ebano');
    assert.equal(await portal.locator('.forja-temas-abrir').getAttribute('aria-expanded'),'false');
    await portal.locator('.forja-temas-abrir').click();
    await portal.keyboard.press('Escape');
    assert.equal(await portal.locator('.forja-temas-opciones').isVisible(),false,
      'Escape cierra la paleta sin alterar el tema.');
    await esperarCabeceraEstable(portal);
    const portada = await portal.locator('.forja-cabecera').boundingBox();
    const logoPortada = await portal.locator('.forja-cabecera .marca-logotipo').boundingBox();
    assert.equal(await portal.locator('.forja-cabecera h1').innerText(),'La Forja');


    // Personajes: la semilla y la configuracion viajan; no se comparte un ID remoto.
    const pj=await pagina(origen+'/characters/');
    await pj.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    assert.equal(await pj.locator('.forja-cabecera h1').innerText(),'La Forja');
    assert.equal(await pj.locator('.forja-volver').getAttribute('href'),'index.html');
    assert.equal(await pj.locator('.forja-volver svg').count(),1,
      'Personajes muestra el icono de casa para volver al Hub.');
    assert.equal(await pj.locator('.forja-volver').getAttribute('aria-label'),'Volver al hub');
    assert.equal(await pj.locator('.enlace-github').count(),0,
      'No queda el botón Código y documentación en la cabecera.');
    await esperarCabeceraEstable(pj);
    const pjHeader=await pj.locator('.forja-cabecera').boundingBox();
    const pjLogo=await pj.locator('.forja-cabecera .marca-logotipo').boundingBox();
    assert.ok(Math.abs(logoPortada.width-pjLogo.width)<2 &&
      Math.abs(portada.x-pjHeader.x)<2,
      'La marca y el eje de cabecera coinciden entre Hub y Personajes.');

    await pj.locator('#generar').click();
    await pj.locator('#fichas .ver-reproduccion').first().click();
    const semilla=await pj.locator('#semilla-resultado').innerText();
    const enlacePJ=await capturarEnlace(pj,'#compartir-reproduccion','/characters/');
    // El enlace histórico se abre con ambos estilos de ruta y conserva #share=.
    for(const [antigua,nueva] of [
      ['/characters-nd20/','/characters/'],
      ['/characters-nd20/index.html','/characters/index.html']
    ]){
      const heredado=await pagina(origen+antigua+'?origen=antiguo'+new URL(enlacePJ).hash);
      await heredado.waitForURL(url=>url.pathname===nueva&&
        url.search==='?origen=antiguo'&&url.hash===new URL(enlacePJ).hash);
      await heredado.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
      await heredado.locator('#fichas .ver-reproduccion').first().waitFor();
      await heredado.locator('#fichas .ver-reproduccion').first().click();
      assert.equal(await heredado.locator('#semilla-resultado').innerText(),semilla,
        'Redirección histórica preserva el personaje y su semilla: '+antigua);
    }
    // Un proxy de ficheros usa explícitamente /characters/index.html.
    const pjExplicito=await pagina(origen+'/characters/index.html');
    await pjExplicito.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await pjExplicito.locator('#generar').click();
    await pjExplicito.locator('#fichas .ver-reproduccion').first().click();
    const enlaceExplicito=await capturarEnlace(
      pjExplicito,'#compartir-reproduccion','/characters/index.html');
    assert.ok(enlaceExplicito.includes('#share='));
    const pjRecibido=await pagina(enlacePJ);
    await pjRecibido.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await pjRecibido.locator('#fichas .ver-reproduccion').first().waitFor();
    await pjRecibido.locator('#fichas .ver-reproduccion').first().click();
    assert.equal(await pjRecibido.locator('#semilla-resultado').innerText(),semilla,
      'La configuracion recibida reproduce la misma semilla.');

    // Dungeon Hack: generar y compartir desde la ruta única, con identidad propia.
    const dh=await pagina(origen+'/characters/');
    await dh.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await dh.locator('#juego').evaluate(el=>{
      el.value='dh';el.dispatchEvent(new Event('change',{bubbles:true}));
    });
    assert.equal(await dh.locator('#juego').inputValue(),'dh');
    await dh.locator('#generar').click();
    await dh.locator('#fichas .tarjeta').first().waitFor();
    assert.match(await dh.locator('#fichas .tarjeta').first().innerText(),/Dungeon Hack/i);
    await dh.locator('#fichas .ver-reproduccion').first().click();
    const semillaDH=await dh.locator('#semilla-resultado').innerText();
    const enlaceDH=await capturarEnlace(dh,'#compartir-reproduccion','/characters/');
    const dhRecibido=await pagina(enlaceDH);
    await dhRecibido.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await dhRecibido.locator('#fichas .ver-reproduccion').first().waitFor();
    await dhRecibido.locator('#fichas .ver-reproduccion').first().click();
    assert.equal(await dhRecibido.locator('#semilla-resultado').innerText(),semillaDH);
    assert.match(await dhRecibido.locator('#fichas .tarjeta').first().innerText(),/Dungeon Hack/i);

    // Conjuros: buscar, añadir y ver una lista por Círculos (sin asociar Ocupación).
    const hechizos=await pagina(origen+'/spells/');
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#lista-circulos .bloque-circulo').count(),0,
      'Una lista nueva empieza vacía.');
    assert.equal(await hechizos.locator('#form-asociacion').count(),0,
      'No hay asociaciones ni progresiones en la pantalla simplificada.');
    const colorInicial=await hechizos.evaluate(()=>
      getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim());
    assert.equal(await hechizos.locator('.forja-cabecera h1').innerText(),'La Forja');
    assert.equal(await hechizos.locator('.forja-volver').getAttribute('href'),'index.html');
    assert.equal(await hechizos.locator('.forja-volver svg').count(),1,
      'Conjuros usa el mismo SVG accesible de Inicio.');
    await esperarCabeceraEstable(hechizos);
    const spellHeader=await hechizos.locator('.forja-cabecera').boundingBox();
    const spellLogo=await hechizos.locator('.forja-cabecera .marca-logotipo').boundingBox();
    assert.ok(Math.abs(logoPortada.width-spellLogo.width)<2 &&
      Math.abs(portada.x-spellHeader.x)<2,
      'Hub y Conjuros tienen la misma cabecera que Personajes: ' +
      JSON.stringify({portadaX:portada.x,conjurosX:spellHeader.x,
        logoPortada:logoPortada.width,logoConjuros:spellLogo.width}));
    await hechizos.locator('.forja-temas-abrir').click();
    await hechizos.locator('[data-tema-opcion="violeta"]').click();
    assert.equal(await hechizos.locator('html').getAttribute('data-tema'),'violeta');
    const colorVioleta=await hechizos.evaluate(()=>
      getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim());
    assert.notEqual(colorVioleta,colorInicial,
      'Cambiar de tema debe modificar realmente las variables de La Forja.');
    await hechizos.reload();
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('.forja-temas-abrir .forja-tema-nombre').innerText(),'Violeta',
      'El tema visible se conserva al recargar.');
    assert.equal(await hechizos.locator('#selector-tema').inputValue(),'violeta',
      'El motor sigue sincronizado con los temas anteriores.');
    const area=await hechizos.locator('#form-herramienta').boundingBox();
    const anchoVentana=await hechizos.evaluate(()=>innerWidth);
    assert.ok(Math.abs(area.x-(anchoVentana-area.width)/2)<2,
      'El escritorio de Conjuros queda centrado horizontalmente.');
    // Fase 7.3: listas DRS disponibles sin listas personales previas.
    // Cada página creada por pagina() tiene su propio localStorage.
    const oficiales=await pagina(origen+'/spells/');
    await oficiales.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    // QA 7.6: acceso por teclado y etiquetas semánticas, sin ratón.
    await oficiales.keyboard.press('Tab');
    assert.equal(await oficiales.evaluate(()=>
      document.activeElement?.classList.contains('saltar-conjuros')),true,
      'La primera tabulación permite saltar al contenido.');
    await oficiales.keyboard.press('Enter');
    await oficiales.waitForURL(url=>
      url.pathname==='/spells/index.html'&&url.hash==='#contenido');
    assert.equal(new URL(oficiales.url()).hash,'#contenido',
      'El salto con teclado permanece dentro del módulo y alcanza el contenido.');
    assert.equal(await oficiales.getByRole('combobox',{name:'Listas disponibles'}).count(),1);
    assert.equal(await oficiales.getByRole('combobox',{name:'Círculo'}).count(),1);
    assert.equal(await oficiales.getByRole('combobox',{name:'Escuela'}).count(),1);
    assert.equal(await oficiales.locator('#panel-guardadas').isVisible(),true,
      'Los presets oficiales están disponibles incluso sin listas personales.');
    assert.deepEqual(await oficiales.locator('#listas-guardadas option').evaluateAll(opciones=>
      opciones.map(o=>o.value)),['','drs:Clérigo','drs:Mago']);
    await oficiales.locator('.progresion-lista summary').click();
    assert.match(await oficiales.locator('#estado-progresion').innerText(),/Sin tabla asignada/);
    await oficiales.locator('#listas-guardadas').selectOption('drs:Mago');
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').count(),30);
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').first().locator('td').first().innerText(),'1');
    assert.equal(await oficiales.locator('#tabla-progreso .espacios-personales').count(),0,
      'La progresión oficial se muestra exclusivamente como texto.');
    assert.equal(await oficiales.getByRole('table').count(),1,
      'La progresión se expone como una tabla semántica.');
    assert.equal(await oficiales.locator('#tabla-progreso th[scope="col"]').count(),9);
    assert.equal(await oficiales.locator('#tabla-progreso th[scope="row"]').count(),30);
    await oficiales.setViewportSize({width:375,height:812});
    const vistaMovil=await oficiales.locator('.tabla-progreso-desplazamiento').evaluate(el=>({
      ancho:el.clientWidth,contenido:el.scrollWidth,tabindex:el.tabIndex
    }));
    assert.equal(vistaMovil.tabindex,0,'La tabla desplazable es accesible con teclado.');
    assert.ok(vistaMovil.contenido>vistaMovil.ancho,
      'La tabla ofrece su propio desplazamiento horizontal en móvil.');
    const desbordamiento=await oficiales.evaluate(()=>
      document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(desbordamiento<=2,'La tabla no desborda la página móvil.');
    await oficiales.setViewportSize({width:1320,height:900});
    assert.equal(await oficiales.locator('#selector-progresion').isVisible(),false);
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),37);
    assert.equal(await oficiales.locator('#titulo-lista').innerText(),
      'Lista de Conjuros del Mago (DRS)');
    assert.match(await oficiales.locator('#nota-lista-oficial').innerText(),
      /repertorio disponible, no el grimorio inicial.*2 Conjuros del Primer Círculo/);
    assert.equal(await oficiales.locator('#lista-dueno').isEditable(),false);
    assert.equal(await oficiales.locator('#guardar-lista').isEnabled(),false);
    assert.equal(await oficiales.locator('#eliminar-lista').isEnabled(),false);
    assert.equal(await oficiales.locator('#compartir-listas').isEnabled(),false);
    assert.equal(await oficiales.locator('#lista-circulos .quitar-conjuro').count(),0);
    assert.equal(await oficiales.locator('#duplicar-oficial').isVisible(),true);
    await oficiales.evaluate(()=>{
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
        writeText:async texto=>{window.__copiaOficial=texto;}
      }});
    });
    await oficiales.locator('#copiar-lista').click();
    const textoMago=await oficiales.evaluate(()=>window.__copiaOficial);
    assert.ok(textoMago.startsWith('Lista de Conjuros del Mago (DRS)'));
    assert.equal(textoMago.split('\n').filter(x=>x.startsWith('- ')).length,37,
      'Copiar referencia oficial produce 37 líneas de Conjuro y solo texto.');
    assert.ok(!textoMago.includes('<img')&&!textoMago.includes('.svg'));
    await oficiales.locator('#filtro-nombre').fill('Dardo ígneo');
    assert.equal(await oficiales.locator('#resultados-busqueda .resultado-conjuro').count(),1);
    assert.equal(await oficiales.locator('#resultados-busqueda .anadir-conjuro').isEnabled(),false,
      'No se permite añadir Conjuros al repertorio oficial.');
    await oficiales.locator('#listas-guardadas').selectOption('drs:Clérigo');
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').count(),30);
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').first().locator('td').first().innerText(),'0',
      'El Clérigo de Nivel 1 no recibe Espacios en su tabla oficial.');
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),34);
    assert.equal(await oficiales.locator('#lista-circulos .quitar-conjuro').count(),0);
    assert.match(await oficiales.locator('#nota-lista-oficial').innerText(),
      /repertorio disponible para el Clérigo/);
    assert.doesNotMatch(await oficiales.locator('#nota-lista-oficial').innerText(),
      /grimorio inicial/);
    await oficiales.locator('#listas-guardadas').selectOption('drs:Mago');
    await oficiales.locator('#duplicar-oficial').focus();
    await oficiales.keyboard.press('Enter');
    // Activación con teclado equivale a pulsar «Duplicar para editar».
    assert.equal(await oficiales.locator('#progresion-modo').inputValue(),'drs:Mago',
      'La copia conserva la tabla oficial solo como referencia.');
    assert.equal(await oficiales.locator('#personalizar-progresion').isVisible(),true);
    await oficiales.locator('#personalizar-progresion').click();
    assert.equal(await oficiales.locator('#progresion-modo').inputValue(),'personal');
    assert.equal(await oficiales.locator('#tabla-progreso .espacios-personales').count(),240,
      'Se puede editar explícitamente una tabla personal de 30 Niveles por ocho Círculos.');
    const espacioUno=oficiales.locator('#tabla-progreso tbody tr').first().locator('input').first();
    assert.equal(await espacioUno.inputValue(),'1',
      'Personalizar una tabla copia los valores anteriores, no los recalcula.');
    await espacioUno.fill('3');
    assert.match(await oficiales.locator('#estado-lista').innerText(),/Cambios sin guardar/);
    assert.equal(await oficiales.locator('#lista-dueno').isEditable(),true);
    assert.equal(await oficiales.locator('#duplicar-oficial').isVisible(),false);
    assert.equal(await oficiales.locator('#guardar-lista').isEnabled(),true);
    assert.equal(await oficiales.locator('#lista-circulos .quitar-conjuro').count(),37);
    const copiaGuardada=await oficiales.evaluate(()=>
      JSON.parse(localStorage.getItem('forja-listas-conjuros-v1')));
    assert.equal(copiaGuardada.listas.length,1);
    assert.equal(copiaGuardada.listas[0].derivadaDe,'drs:Mago',
      'La copia personal conserva la procedencia oficial estructurada.');
    assert.equal(copiaGuardada.listas[0].conjuros.length,37);
    assert.equal(copiaGuardada.listas[0].progresion.tipo,'oficial',
      'La primera copia guardada mantiene la referencia DRS hasta editarla y guardar.');
    const idCopia=copiaGuardada.listas[0].id;
    await oficiales.locator('#lista-circulos .quitar-conjuro').first().click();
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),36);
    await oficiales.locator('#guardar-lista').click();
    await oficiales.locator('#estado-lista').getByText('Lista guardada en este navegador.').waitFor();
    assert.equal(await oficiales.evaluate(()=>
      JSON.parse(localStorage.getItem('forja-listas-conjuros-v1')).listas[0].progresion.niveles[0][0]),3,
      'La tabla personal se guarda junto a esta Lista.');
    await oficiales.locator('#listas-guardadas').selectOption('drs:Mago');
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').first().locator('td').first().innerText(),'1',
      'La tabla oficial conserva su valor y no hereda cambios personales.');
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),37,
      'La copia editable nunca modifica la fuente oficial.');
    await oficiales.locator('#listas-guardadas').selectOption(idCopia);
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),36,
      'La copia editada sigue disponible con su propio ID de usuario.');
    assert.equal(await oficiales.locator('#progresion-modo').inputValue(),'personal');
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').first().locator('input').first().inputValue(),'3');
    assert.equal(await oficiales.locator('#listas-guardadas option').count(),4,
      'La biblioteca muestra Nueva, dos Listas oficiales y una copia personal.');
    await oficiales.reload();
    await oficiales.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await oficiales.locator('#lista-circulos .conjuro-seleccionado').count(),36);
    assert.equal(await oficiales.locator('#tabla-progreso tbody tr').first().locator('input').first().inputValue(),'3',
      'La progresión personal persiste tras recarga.');
    assert.equal(await oficiales.evaluate(()=>
      JSON.parse(localStorage.getItem('forja-listas-conjuros-v1')).listas[0].derivadaDe),
      'drs:Mago','La procedencia sobrevive la recarga.');

    // Fase 7.5: exportación completa transporta las preferencias, la
    // selección activa, el progreso 30x8 y la biblioteca, sin reglas DRS.
    await oficiales.locator('.formato-lista summary').click();
    await oficiales.locator('#mostrar-escuela').check();
    await oficiales.locator('#filtro-escuela').selectOption('Elemental');
    await oficiales.locator('#filtro-circulo').selectOption('1');
    await oficiales.locator('#filtro-nombre').fill('Dardo ígneo');
    await oficiales.locator('#selector-tema').evaluate(el=>{
      el.value='violeta';el.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await oficiales.locator('.mas-opciones summary').click();
    const descargaCompleta=oficiales.waitForEvent('download');
    await oficiales.locator('#exportar-trabajo').focus();
    await oficiales.keyboard.press('Enter');
    const archivoCompleto=await descargaCompleta;
    assert.equal(archivoCompleto.suggestedFilename(),'forja-conjuros-trabajo.json');
    const jsonCompleto=fs.readFileSync(await archivoCompleto.path(),'utf8');
    const trabajo=JSON.parse(jsonCompleto);
    assert.equal(trabajo.esquema,'naufragio.forja-conjuros-trabajo/v1');
    assert.equal(trabajo.biblioteca.listas.length,1);
    assert.equal(trabajo.biblioteca.listas[0].progresion.niveles[0][0],3);
    assert.equal(trabajo.biblioteca.listas[0].derivadaDe,'drs:Mago');
    assert.deepEqual(trabajo.vista.presentacion,{
      escuela:true,origen:false,tema:'violeta'});
    assert.deepEqual(trabajo.vista.filtros,{
      nombre:'Dardo ígneo',circulo:'1',escuela:'Elemental'});
    assert.equal(trabajo.vista.listaActiva,idCopia);
    assert.ok(!jsonCompleto.includes('texto_normativo')&&!jsonCompleto.includes('efectos'),
      'El JSON completo no duplica el texto normativo de los Conjuros.');
    const trabajoImportado=await pagina(origen+'/spells/index.html');
    await trabajoImportado.locator('#estado-datos')
      .getByText('64 Conjuros verificados',{exact:false}).waitFor();
    await trabajoImportado.locator('#importar-archivo').setInputFiles({
      name:'trabajo.json',mimeType:'application/json',
      buffer:Buffer.from(jsonCompleto,'utf8')
    });
    await trabajoImportado.locator('#estado-lista')
      .getByText('Trabajo completo importado correctamente.',{exact:false}).waitFor();
    assert.equal(await trabajoImportado.locator('#lista-circulos .conjuro-seleccionado').count(),36);
    assert.equal(await trabajoImportado.locator('#tabla-progreso tbody tr')
      .first().locator('input').first().inputValue(),'3');
    assert.equal(await trabajoImportado.locator('#mostrar-escuela').isChecked(),true);
    assert.equal(await trabajoImportado.locator('#filtro-nombre').inputValue(),'Dardo ígneo');
    assert.equal(await trabajoImportado.locator('#filtro-circulo').inputValue(),'1');
    assert.equal(await trabajoImportado.locator('#filtro-escuela').inputValue(),'Elemental');
    assert.equal(await trabajoImportado.locator('html').getAttribute('data-tema'),'violeta');
    const copiaAntes=await trabajoImportado.evaluate(()=>
      localStorage.getItem('forja-listas-conjuros-v1'));
    const incompatible=JSON.parse(jsonCompleto);
    incompatible.version_drs='0.0.0';
    await trabajoImportado.locator('#importar-archivo').setInputFiles({
      name:'incompatible.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify(incompatible),'utf8')
    });
    await trabajoImportado.locator('#estado-lista')
      .getByText('Importación rechazada:',{exact:false}).waitFor();
    assert.equal(await trabajoImportado.evaluate(()=>
      localStorage.getItem('forja-listas-conjuros-v1')),copiaAntes,
      'Una importación rechazada no cambia las Listas guardadas.');
    await trabajoImportado.reload();
    await trabajoImportado.locator('#estado-datos')
      .getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await trabajoImportado.locator('#lista-circulos .conjuro-seleccionado').count(),36);
    assert.equal(await trabajoImportado.locator('#tabla-progreso tbody tr')
      .first().locator('input').first().inputValue(),'3');
    assert.equal(await trabajoImportado.locator('#filtro-escuela').inputValue(),'Elemental');
    assert.equal(await trabajoImportado.locator('html').getAttribute('data-tema'),'violeta');

    // Comprobar los 64 Conjuros, las seis Escuelas y los ocho Círculos DRS.
    const fichas=await hechizos.evaluate(async()=>{
      const respuesta=await fetch('data/conjuros-drs-fichas.json');
      if(!respuesta.ok)throw Error('Catálogo DRS inaccesible');
      return (await respuesta.json()).conjuros;
    });
    assert.equal(fichas.length,64);
    assert.equal(new Set(fichas.map(s=>s.id)).size,64);
    const escuelas={Arcana:'arcana',Divina:'divina',Nigromancia:'nigromancia',
      Elemental:'elemental','Demonología':'demonologia',Naturaleza:'naturaleza'};
    for(const [escuela,archivo] of Object.entries(escuelas)){
      const muestra=fichas.find(s=>s.escuela===escuela);
      assert.ok(muestra,'Escuela DRS ausente: '+escuela);
      await hechizos.locator('#filtro-nombre').fill(muestra.nombre);
      const resultados=hechizos.locator('#resultados-busqueda .resultado-conjuro');
      const nombres=await resultados.locator('strong').allTextContents();
      const indice=nombres.indexOf(muestra.nombre);
      assert.ok(indice>=0,'No aparece el Conjuro de '+escuela);
      const fila=resultados.nth(indice);
      assert.equal(await fila.locator('.icono-escuela').getAttribute('src'),
        'assets/icons/escuela-'+archivo+'.svg');
      assert.match(await fila.locator('small').innerText(),new RegExp(escuela));
      assert.equal(await fila.locator('.icono-escuela').evaluate(async img=>{
        await img.decode();return img.naturalWidth>0;
      }),true,'El SVG debe cargar: '+escuela);
    }
    await hechizos.locator('#filtro-nombre').fill('');
    const selectorEscuela=hechizos.locator('#filtro-escuela');
    const selectorCirculo=hechizos.locator('#filtro-circulo');
    const valores=async selector=>selector.locator('option').evaluateAll(opciones=>
      opciones.map(opcion=>opcion.value));
    const escuelasDRS=[...new Set(fichas.map(s=>s.escuela))]
      .sort((a,b)=>a.localeCompare(b,'es'));
    assert.deepEqual(await valores(selectorEscuela),['',...escuelasDRS],
      'Se muestran exactamente las seis Escuelas presentes en el DRS.');
    assert.deepEqual(await valores(selectorCirculo),['','1','2','3','4','5','6','7','8']);
    for(const escuela of escuelasDRS){
      await selectorEscuela.selectOption(escuela);
      const circulosEscuela=[...new Set(fichas.filter(s=>s.escuela===escuela)
        .map(s=>s.circulo))].sort((a,b)=>a-b).map(String);
      assert.deepEqual(await valores(selectorCirculo),['',...circulosEscuela],
        'Círculos restringidos a la Escuela '+escuela);
      assert.equal(await selectorEscuela.inputValue(),escuela,
        'La Escuela seleccionada no debe perderse al recalcular.');
      assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),
        fichas.filter(s=>s.escuela===escuela).length);
      assert.ok((await hechizos.locator('#resultados-busqueda .resultado-conjuro small')
        .allTextContents()).every(t=>t.endsWith(' · '+escuela)));
      await selectorEscuela.selectOption('');
    }
    assert.deepEqual(await valores(selectorCirculo),['','1','2','3','4','5','6','7','8']);
    for(let circulo=1;circulo<=8;circulo++){
      await selectorCirculo.selectOption(String(circulo));
      const escuelasCirculo=[...new Set(fichas.filter(s=>s.circulo===circulo)
        .map(s=>s.escuela))].sort((a,b)=>a.localeCompare(b,'es'));
      assert.deepEqual(await valores(selectorEscuela),['',...escuelasCirculo],
        'Escuelas restringidas al Círculo '+circulo);
      assert.equal(await selectorCirculo.inputValue(),String(circulo));
      const esperados=fichas.filter(s=>s.circulo===circulo).length;
      const resultados=hechizos.locator('#resultados-busqueda .resultado-conjuro');
      assert.equal(await resultados.count(),esperados,
        'Filtro por Círculo '+circulo+' no coincide con las fichas DRS');
      assert.ok((await resultados.locator('small').allTextContents())
        .every(s=>s.includes('Círculo '+circulo+' · ')));
    }
    await selectorCirculo.selectOption('');
    assert.deepEqual(await valores(selectorEscuela),['',...escuelasDRS]);

    // Dos criterios simultáneos, seleccionados en ambos órdenes.
    await selectorEscuela.selectOption('Naturaleza');
    assert.ok(!(await valores(selectorCirculo)).includes('1'),
      'Naturaleza no tiene Conjuros de Primer Círculo en el DRS.');
    await selectorCirculo.selectOption('2');
    assert.equal(await selectorEscuela.inputValue(),'Naturaleza');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),
      fichas.filter(s=>s.escuela==='Naturaleza'&&s.circulo===2).length);
    await hechizos.locator('#filtro-nombre').fill('charco de aceite');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),1,
      'El nombre se combina con Escuela y Círculo.');
    await hechizos.locator('#filtro-nombre').fill('dardo igneo');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),0);
    assert.match(await hechizos.locator('#resultados-busqueda').innerText(),
      /No se han encontrado Conjuros con estos filtros/);
    assert.equal(await selectorEscuela.inputValue(),'Naturaleza',
      'La búsqueda sin resultados no altera los selectores.');
    await hechizos.locator('#filtro-nombre').fill('');
    await selectorCirculo.selectOption('');
    assert.equal(await selectorEscuela.inputValue(),'Naturaleza',
      'Limpiar Círculo mantiene Escuela.');
    await selectorEscuela.selectOption('');
    await selectorCirculo.selectOption('4');
    await selectorEscuela.selectOption('Demonología');
    assert.equal(await selectorCirculo.inputValue(),'4',
      'Seleccionar Escuela después de Círculo conserva el Círculo.');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),
      fichas.filter(s=>s.circulo===4&&s.escuela==='Demonología').length);
    await selectorEscuela.selectOption('');
    assert.equal(await selectorCirculo.inputValue(),'4');
    await selectorCirculo.selectOption('');
    assert.deepEqual(await valores(selectorEscuela),['',...escuelasDRS]);

    await hechizos.locator('#lista-dueno').fill('Ensayo de enlace');
    await hechizos.locator('#filtro-nombre').fill('Dardo ígneo');
    assert.equal(await hechizos.locator('#resultados-busqueda .resultado-conjuro').count(),1);
    const medallonResultado=hechizos.locator('#resultados-busqueda .resultado-titulo .icono-escuela');
    assert.equal(await medallonResultado.count(),1,'Cada resultado DRS tiene medallón de Escuela.');
    assert.equal(await medallonResultado.getAttribute('src'),'assets/icons/escuela-elemental.svg');
    assert.equal(await medallonResultado.getAttribute('alt'),'');
    assert.equal(await medallonResultado.getAttribute('aria-hidden'),'true');
    assert.equal(await medallonResultado.evaluate(async img=>{await img.decode();return img.naturalWidth>0;}),true,
      'El SVG del buscador se carga correctamente con base href="../".');
    await hechizos.locator('#resultados-busqueda .anadir-conjuro').click();
    assert.equal(await hechizos.locator('#titulo-lista').innerText(),
      'Lista de Conjuros de Ensayo de enlace');
    assert.equal(await hechizos.locator('#lista-circulos .bloque-circulo').count(),1);
    assert.match(await hechizos.locator('#lista-circulos').innerText(),/Dardo ígneo/);
    const medallonLista=hechizos.locator('#lista-circulos .conjuro-seleccionado > .icono-escuela');
    assert.equal(await medallonLista.count(),1,'La lista por Círculos tiene medallón decorativo.');
    assert.equal(await medallonLista.getAttribute('src'),'assets/icons/escuela-elemental.svg');
    assert.equal(await medallonLista.getAttribute('alt'),'');
    assert.equal(await medallonLista.getAttribute('aria-hidden'),'true');
    assert.equal(await medallonLista.evaluate(async img=>{await img.decode();return img.naturalWidth>0;}),true,
      'El SVG de la lista se carga desde la carpeta assets.');
    assert.equal(await hechizos.locator('#lista-circulos .conjuro-seleccionado span').count(),1,
      'La lista conserva un único span con el texto original del Conjuro.');
    const borrar=hechizos.locator('#lista-circulos .quitar-conjuro');
    assert.equal(await borrar.count(),1);
    assert.equal(await borrar.getAttribute('aria-label'),'Quitar Dardo ígneo de la lista');
    assert.equal(await borrar.locator('svg.icono-papelera[aria-hidden="true"]').count(),1,
      'La acción Quitar es una papelera accesible sin texto decorativo.');
    assert.equal((await borrar.evaluate(el=>getComputedStyle(el).color)).length>0,true);
    assert.equal(await hechizos.locator('#lista-circulos .conjuro-metadatos').count(),0,
      'La etiqueta secundaria desaparece si no se solicita Escuela ni Origen.');
    // Comprobar caja estable en los cinco temas existentes y sin desbordes en móvil.
    for(const tema of ['clasico','ebano','ceruleo','obsidiana','violeta']){
      await hechizos.setViewportSize({width:1320,height:900});
      await hechizos.locator('.forja-temas-abrir').click();
      await hechizos.locator('[data-tema-opcion="'+tema+'"]').click();
      assert.equal(await hechizos.locator('html').getAttribute('data-tema'),tema);
      for(const ancho of [1320,375]){
        await hechizos.setViewportSize({width:ancho,height:812});
        const caja=await medallonLista.boundingBox();
        assert.ok(caja&&caja.width>=17&&caja.width<=19&&caja.height>=17&&caja.height<=19,
          'Medallón legible y uniforme en '+tema+' con '+ancho+' px.');
        const desborde=await hechizos.evaluate(()=>
          document.documentElement.scrollWidth-document.documentElement.clientWidth);
        assert.ok(desborde<=2,'Sin desbordamiento horizontal en '+tema+' a '+ancho+' px: '+desborde);
      }
    }
    await hechizos.setViewportSize({width:1320,height:900});
    assert.equal(await hechizos.locator('#copiar-lista').isEnabled(),true,
      'Se puede copiar antes de guardar una lista.');
    await hechizos.evaluate(()=>{
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
        writeText:async texto=>{window.__textoListaCopiado=texto;}
      }});
    });
    const tituloCopia='Lista de Conjuros de Ensayo de enlace\n\nCírculo 1\n- ';
    async function copiarYComprobar(sufijo){
      await hechizos.locator('#copiar-lista').click();
      const copiado=await hechizos.evaluate(()=>window.__textoListaCopiado);
      assert.equal(copiado,tituloCopia+sufijo,
        'La copia conserva el orden por Círculos y el formato seleccionado.');
      assert.ok(!copiado.includes('\\n'),'No se copian secuencias de escape literales.');
      assert.ok(!copiado.includes('<img')&&!copiado.includes('escuela-elemental.svg'),
        'El texto copiado no contiene HTML ni rutas a medallones.');
      assert.equal(await hechizos.locator('#lista-circulos .conjuro-seleccionado span').innerText(),
        sufijo,'La presentación visual coincide con el texto copiado.');
    }
    await copiarYComprobar('Dardo ígneo');
    await hechizos.locator('.formato-lista summary').click();
    await hechizos.locator('#mostrar-origen').check();
    await copiarYComprobar('Dardo ígneo [DRS]');
    await hechizos.locator('#mostrar-escuela').check();
    await copiarYComprobar('Dardo ígneo — Elemental [DRS]');
    const metadata=hechizos.locator('#lista-circulos .conjuro-metadatos');
    assert.equal(await metadata.count(),1);
    assert.equal(await metadata.innerText(),' — Elemental [DRS]');
    const pesos=await metadata.evaluate(el=>({meta:parseFloat(getComputedStyle(el).fontSize),
      nombre:parseFloat(getComputedStyle(el.previousElementSibling).fontSize),
      peso:getComputedStyle(el).fontWeight}));
    assert.ok(pesos.meta<pesos.nombre,'Escuela y Origen son más pequeños que el nombre.');
    assert.equal(pesos.peso,'400','Escuela y Origen no usan negrita.');
    await hechizos.locator('#mostrar-origen').uncheck();
    await copiarYComprobar('Dardo ígneo — Elemental');
    await hechizos.reload();
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#mostrar-escuela').isChecked(),true,
      'Se recuerda la preferencia visual aunque no altere el modelo de listas.');
    assert.equal(await hechizos.locator('#mostrar-origen').isChecked(),false);
    // Una recarga antes de guardar no conserva el borrador: el guardado sigue siendo explícito.
    await hechizos.locator('#lista-dueno').fill('Ensayo de enlace');
    await hechizos.locator('#filtro-nombre').fill('Dardo ígneo');
    await hechizos.locator('#resultados-busqueda .anadir-conjuro').click();
    await hechizos.locator('#guardar-lista').click();
    await hechizos.locator('#estado-lista').getByText('guardada en este navegador',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#listas-guardadas option').count(),4,
      'Nueva, las dos oficiales y la lista personal guardada están disponibles.');
    await hechizos.reload();
    await hechizos.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await hechizos.locator('#lista-circulos .conjuro-seleccionado').count(),1,
      'La lista guardada persiste después de recargar.');
    assert.equal(await hechizos.locator('#lista-dueno').inputValue(),'Ensayo de enlace');
    await hechizos.locator('.mas-opciones summary').click();
    const descarga=hechizos.waitForEvent('download');
    await hechizos.locator('#exportar-listas').click();
    const archivo=await descarga;
    assert.equal(archivo.suggestedFilename(),'forja-listas-conjuros.json');
    const exportado=fs.readFileSync(await archivo.path(),'utf8');
    const biblioteca=JSON.parse(exportado);
    assert.equal(biblioteca.listas.length,1);
    assert.equal(biblioteca.listas[0].conjuros.length,1);
    assert.ok(!exportado.includes('Lanzas una púa venenosa'),
      'El JSON de listas no incorpora textos normativos.');
    // Reimportar el JSON en otro contexto y una URL explícita de PREVIEW.
    const importada=await pagina(origen+'/spells/index.html');
    await importada.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    await importada.locator('#importar-archivo').setInputFiles({
      name:'listas-importadas.json',mimeType:'application/json',buffer:Buffer.from(exportado,'utf8')
    });
    await importada.locator('#estado-lista')
      .getByText('Biblioteca importada correctamente.',{exact:false}).waitFor();
    assert.equal(await importada.locator('#lista-circulos .conjuro-seleccionado').count(),1,
      'La importación recupera Conjuros en una sesión independiente.');
    await capturarEnlace(importada,'#compartir-listas','/spells/index.html');
    await importada.reload();
    await importada.locator('#estado-datos').getByText('64 Conjuros verificados',{exact:false}).waitFor();
    assert.equal(await importada.locator('#lista-circulos .conjuro-seleccionado').count(),1,
      'La biblioteca importada persiste en localStorage.');
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
    const adversarios=await pagina(origen+'/characters/');
    await adversarios.locator('#estado').getByText('Datos listos',{exact:false}).waitFor();
    await adversarios.locator('#tab-criaturas').click();
    await adversarios.locator('#criaturas-cargar-drs').click();
    await adversarios.locator('#criaturas-selector-busqueda').fill('Goblin con tirachinas');
    assert.equal(await adversarios.locator('.criaturas-selector-fila').count(),1);
    await adversarios.locator('.criaturas-selector-fila button').click();
    await adversarios.locator('#criaturas-selector-cerrar').click();
    await adversarios.locator('.criaturas-cromo[data-oficial="true"]').click();
    const enlaceAdversario=await capturarEnlace(
      adversarios,'#criaturas-ficha-compartir','/characters/');
    const adversarioAntiguo=await pagina(origen+'/characters-nd20/'+
      '?origen=adversario'+new URL(enlaceAdversario).hash);
    await adversarioAntiguo.waitForURL(url=>url.pathname==='/characters/'&&
      url.search==='?origen=adversario'&&url.hash===new URL(enlaceAdversario).hash);
    await adversarioAntiguo.locator('#criaturas-edicion').waitFor({state:'visible'});
    assert.equal(await adversarioAntiguo.locator('#criaturas-nombre').inputValue(),
      'Goblin con tirachinas','Redirección histórica conserva el adversario compartido.');
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
