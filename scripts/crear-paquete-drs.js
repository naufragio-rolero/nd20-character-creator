'use strict';
/* Construye un directorio estático FÍSICAMENTE depurado para Fantasía DRS.
 * Preserva las ediciones CiFi, Nocturna y Dungeon Hack. El repositorio de
 * desarrollo jamás se modifica. No realiza despliegues.
 *
 * Uso: node scripts/crear-paquete-drs.js [directorio-de-salida]
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const raiz=path.resolve(__dirname,'..');
const carpetaDist=path.join(raiz,'dist');
const destino=path.resolve(process.argv[2]||path.join(carpetaDist,'public-drs'));
// Seguridad: el borrado recursivo NUNCA debe admitir assets/, data/, raíz,
// otra carpeta del repositorio, ni archivos del equipo fuera de dist/.
if(!destino.startsWith(carpetaDist+path.sep)||
   raiz.startsWith(destino+path.sep))
  throw Error('La salida debe ser exclusivamente una subcarpeta de dist/. No se toca el origen.');
const baseEspecies=JSON.parse(fs.readFileSync(path.join(raiz,'data/especies.json')));
const especiesCifi=JSON.parse(fs.readFileSync(path.join(raiz,'data/especies_cifi.json')));
const ampliado=JSON.parse(fs.readFileSync(path.join(raiz,'data/catalogo-ampliado.json')));
const baseOcupaciones=JSON.parse(fs.readFileSync(path.join(raiz,'data/ocupaciones.json')));
const poderes=JSON.parse(fs.readFileSync(path.join(raiz,'data/catalogo-poderes.json')));
const drsPoderes=poderes.conjuros.filter(x=>x.origen==='Nd20');
if(drsPoderes.length!==64||new Set(drsPoderes.map(x=>x.id)).size!==64||
   Object.keys(baseEspecies).length!==8||Object.keys(baseOcupaciones).length!==4)
  throw Error('Los recuentos y las identidades del DRS ya no coinciden: detener la distribución.');
const idsDRS=new Set(drsPoderes.map(x=>x.id));
const huellas=JSON.parse(fs.readFileSync(
  path.join(raiz,'data/huellas-conjuros-drs.json'),'utf8')).huellas;
if(Object.keys(huellas).length!==64||
   [...idsDRS].some(id=>!Object.hasOwn(huellas,id)))
  throw Error('Las 64 huellas de Conjuros DRS no cubren el catálogo íntegro.');
const conjurosCotejados=new Map();
function revisarLiteralConjuro(ficha){
  // La única diferencia sustantiva detectada entre el Tomo de trabajo
  // y el DRS es «ese objeto mundano obtiene» en Forja arcana.
  // El paquete básico respeta la frase original del DRS.
  if(ficha.id_catalogo==='conjuro-45'){
    const coincidencias=ficha.parrafos.filter(x=>
      x.includes('ese objeto mundano obtiene:'));
    if(coincidencias.length!==1)
      throw Error('Forja arcana: versión del Tomo distinta de la auditada.');
    ficha.parrafos=ficha.parrafos.map(x=>
      x.replace('ese objeto mundano obtiene:','ese objeto obtiene:'));
  }
  ficha.parrafos=ficha.parrafos.map(x=>x.trim());
  const valor=crypto.createHash('sha256')
    .update(JSON.stringify(ficha.parrafos),'utf8').digest('hex');
  if(valor!==huellas[ficha.id_catalogo])
    throw Error('El texto de '+ficha.nombre_tomo+' ('+ficha.id_catalogo+
      ') difiere de la ficha literal del DRS. Publicación interrumpida.');
  const anterior=conjurosCotejados.get(ficha.id_catalogo);
  if(anterior){
    if(JSON.stringify(anterior.parrafos)!==JSON.stringify(ficha.parrafos)||
       anterior.nombre_tomo!==ficha.nombre_tomo||
       anterior.circulo_tomo!==ficha.circulo_tomo)
      throw Error('Duplicado contradictorio de '+ficha.id_catalogo+
        ': requiere decisión editorial.');
    // «Arma elemental» aparece dos veces en el Tomo original (26 y 29),
    // pero representa un solo Conjuro y una ficha literal del DRS.
    return null;
  }
  conjurosCotejados.set(ficha.id_catalogo,ficha);
  return ficha;
}
const especiesAdmitidas=new Set([
  ...Object.keys(baseEspecies),
  ...Object.keys(especiesCifi),
  ...Object.keys(ampliado.nocturna.especies||{})
]);
const ocupacionesCifi=JSON.parse(fs.readFileSync(path.join(raiz,'data/ocupaciones_cifi.json')));
const ocupacionesAdmitidas=new Set([
  ...Object.keys(baseOcupaciones),
  ...Object.keys(ocupacionesCifi),
  ...Object.keys(ampliado.nocturna.ocupaciones||{})
]);
// Las formas editoriales tampoco deben revelar los Conceptos de suplementos
// no publicados. Se obtiene el conjunto solo de las fichas que viajan.
const conceptosAdmitidos=new Set([
  ...Object.values(baseOcupaciones),...Object.values(baseEspecies),
  ...Object.values(ocupacionesCifi),...Object.values(especiesCifi),
  ...Object.values(ampliado.nocturna.ocupaciones||{}),
  ...Object.values(ampliado.nocturna.especies||{})
].flatMap(x=>x.conceptos||[]));
const iconosForja=[
  'esp-elfo', 'esp-enano', 'esp-humano', 'esp-mediano', 'esp-gnomo',
  'esp-semielfo', 'esp-orco', 'esp-semiorco', 'ocu-clerigo', 'ocu-guerrero',
  'ocu-mago', 'ocu-ladron', 'ico-conjuro', 'ico-tecnica', 'recurso-salud',
  'recurso-esfuerzo', 'recurso-movimiento', 'recurso-potencia', 'recurso-esencia', 'recurso-blindaje',
  'equipo-espada', 'equipo-arco', 'equipo-varita', 'equipo-bolsa', 'equipo-caballo',
  'equipo-mochila', 'equipo-orbe', 'equipo-libro', 'equipo-armadura', 'equipo-escudo',
  'equipo-municion', 'ico-configurar', 'sexo-masculino', 'sexo-femenino', 'sexo-indeterminado',
  'accion-equipo', 'accion-talentos', 'accion-pdf', 'accion-semilla', 'accion-copiar',
];
const especificas=[
  'index.html',
  'assets/styles.css','assets/favicon.svg',
  'assets/icons/sistema-nd20-faep.webp','assets/icons/sistema-dh.webp',
  ...iconosForja.map(id=>'assets/icons/'+id+'.svg'),
  'assets/icons/CREDITOS-GAME-ICONS.txt','assets/icons/LICENCIA-TABLER.txt',
  'assets/equipment.js','assets/sex.js',
  'assets/rules.js','assets/names.js','assets/powers.js','assets/spell-magnitudes.js',
  'assets/tooltips.js','assets/tooltip-ui.js','assets/app.js','assets/i18n.js',
  'assets/creatures.js','assets/creatures-import.js',
  'assets/creatures-library.js','assets/creatures-ui.js',
  // PDF A5 Fantasía: solo plantillas reglamentarias y bibliotecas de terceros autorizadas.
  'assets/pdf-export-v2.js','assets/pdf-export-browser.js',
  'assets/pdf-a5/forja-fantasia-epica-a5.pdf',
  'assets/pdf-a5/forja-continuacion-a5.pdf',
  'assets/pdf-a5/campos-ficha-a5.json',
  'assets/pdf-a5/SourceSerif4_400Regular.ttf',
  'assets/pdf-a5/SourceSerif4_700Bold.ttf',
  'assets/pdf-a5/OFL-SourceSerif4.txt',
  'assets/vendor/pdf-lib.min.js',
  'assets/vendor/fontkit.umd.min.js',
  'assets/vendor/LICENSE-pdf-lib.txt',
  'assets/vendor/LICENSE-fontkit.txt',
  'locales/es.json',
  'data/especies.json','data/ocupaciones.json','data/especies_cifi.json',
  'data/ocupaciones_cifi.json','data/catalogo-ampliado.json',
  'data/tesauro-ylat.json','data/nombres-historicos-ylat.json',
  'data/componentes-nombres-ylat.json',
  'data/sexo-personajes.json',
  'data/catalogo-poderes.json','data/conjuros-revisados-001-225.json',
  'data/conjuros-revisados-226-434.json',
  'data/conjuros-magnitudes-literales.json','data/alcance-drs-y-dlc.json',
  'data/conjuros-danio-compuesto.json','data/progresiones-oficiales.json',
  'data/equipo-inicial.json','data/fichas-documentales.json',
  'data/talentos-drs-literales.json','data/aclaraciones-talentos-drs.json',
  'data/tecnicas-drs-literales.json','data/glosas-talentos-drs.json',
  'data/glosas-equipo-drs.json',
  'data/dungeon-hack.json'
];
const transformaciones={
  'data/catalogo-ampliado.json'(d){
    d.fantasia={especies:{},ocupaciones:{}};
    return d; // CiFi y Nocturna conservan sus fuentes originales.
  },
  'data/catalogo-poderes.json'(d){
    d.conjuros=drsPoderes;
    d.tecnicas=d.tecnicas.filter(x=>
      x.fuente==='Naufragio d20 DRS'||x.fuente==='Naufragio d20 CiFi');
    d.especiales={version:d.especiales.version};
    d.fuentes={
      tecnicas:'NaufragioD20DRS y NaufragioD20CiFi',
      licencia:d.fuentes.licencia
    };
    return d;
  },
  'data/conjuros-revisados-001-225.json'(d){
    d.conjuros=d.conjuros.filter(x=>idsDRS.has(x.id_catalogo))
      .map(revisarLiteralConjuro).filter(Boolean);
    d.criterio='Texto cotejado contra las 64 fichas literales del DRS, incluidos los valores de la tabla Calentar metal.';
    return d;
  },
  'data/conjuros-revisados-226-434.json'(d){
    d.conjuros=d.conjuros.filter(x=>idsDRS.has(x.id_catalogo))
      .map(revisarLiteralConjuro).filter(Boolean);
    d.criterio='Texto cotejado contra las 64 fichas literales del DRS, incluidos los valores de la tabla Calentar metal.';
    return d;
  },
  'data/conjuros-magnitudes-literales.json'(d){
    d.registros=d.registros.filter(x=>idsDRS.has(x.id_catalogo));
    d.alcance='Núcleo de los 64 Conjuros DRS: magnitudes previamente verificadas.';
    return d;
  },
  'data/conjuros-danio-compuesto.json'(d){
    d.registros=d.registros.filter(x=>idsDRS.has(x.id_catalogo));
    return d;
  },
  'data/progresiones-oficiales.json'(d){
    d.ampliadas={fantasia:{},nocturna:d.ampliadas.nocturna};
    return d;
  },
  'data/sexo-personajes.json'(d){
    d.ocupaciones_contexto_femenino={};
    d.especies_preferencia_femenino={};
    d.femeninos_por_especie=Object.fromEntries(Object.entries(d.femeninos_por_especie)
      .filter(([nombre])=>especiesAdmitidas.has(nombre)));
    d.nombres_editoriales=Object.fromEntries(Object.entries(d.nombres_editoriales)
      .filter(([nombre])=>especiesAdmitidas.has(nombre)));
    d.sexo_por_especie_neutral=(d.sexo_por_especie_neutral||[])
      .filter(nombre=>especiesAdmitidas.has(nombre));
    // El catálogo completo del proyecto también documenta las variantes
    // de DLC. A LIVE solo llegan las formas de las fuentes autorizadas.
    d.ocupaciones_formas_genero=Object.fromEntries(
      Object.entries(d.ocupaciones_formas_genero||{})
        .filter(([nombre])=>ocupacionesAdmitidas.has(nombre)));
    d.especies_formas_genero=Object.fromEntries(
      Object.entries(d.especies_formas_genero||{})
        .filter(([nombre])=>especiesAdmitidas.has(nombre)));
    d.conceptos_formas_genero=Object.fromEntries(
      Object.entries(d.conceptos_formas_genero||{})
        .filter(([nombre])=>conceptosAdmitidos.has(nombre)));
    return d;
  },
  'data/fichas-documentales.json'(d){
    return Object.fromEntries(Object.entries(d).filter(([nombre,ficha])=>
      (ficha.sistema==='nd20' &&
       (ficha.fuente||'').includes('NaufragioD20DRS')) ||
      ficha.sistema==='nd20_cifi' ||
      ficha.sistema==='nd20_nocturna'
    ));
  },
  'data/tesauro-ylat.json'(d){
    // Publicar los nombres documentados de Ylat ya auditados por autoría,
    // sin importar todo el índice (que también incluye lugares y deidades).
    const combinados=d.entradas.filter(x=>x.tipo==='combinado');
    const documentados=d.entradas.filter(x=>x.tipo==='documentado');
    if(combinados.length!==33||documentados.length!==262||
       new Set(d.entradas.map(x=>x.nombre)).size!==d.entradas.length)
      throw Error('Cambió el repertorio onomástico de Ylat: revisar antes de publicar.');
    if(d.entradas.some(x=>!/^(combinado|documentado)$/.test(x.tipo)))
      throw Error('Tipo onomástico no admitido en el paquete público.');
    d.contexto='33 variantes combinadas y 262 denominaciones de figuras documentadas de Ylat; no se atribuye identidad al nuevo personaje.';
    d.politica='Nombres libres para inspiración: los documentados pertenecen a figuras atestiguadas; las combinaciones no acreditan parentesco. Se excluyen topónimos, entidades deíficas, variantes y borradores del archivo de investigación.';
    return d;
  },
  'data/nombres-historicos-ylat.json'(d){
    // El autor ha autorizado el generador antiguo como fuente. Preservar
    // todas sus filas en desarrollo, usar una vez cada forma en el público
    // para que los seis duplicados no tengan el doble de probabilidad.
    if(d.entradas.length!==1428||d.total_filas_fuente!==1428||
       new Set(d.entradas.map(x=>x.id)).size!==1428)
      throw Error('El generador de Ylat ha cambiado: auditar sus 1428 registros.');
    const vistos=new Set();
    d.entradas=d.entradas.filter(x=>{
      if(vistos.has(x.nombre))return false;
      vistos.add(x.nombre);
      return true;
    });
    if(d.entradas.length!==1422||vistos.size!==1422)
      throw Error('El generador histórico debe aportar 1422 formas únicas.');
    d.politica='1422 formas únicas autorizadas por el autor. No implican personajes canónicos ni adscripción documentada de sexo, Especie, cultura o linaje.';
    return d;
  },
  'data/alcance-drs-y-dlc.json'(d){
    delete d.paquetes_posteriores;
    d.estado='paquete_publico_drs_generado_no_desplegado';
    return d;
  }
};
function escribir(ruta,contenido){
  const p=path.join(destino,ruta);
  fs.mkdirSync(path.dirname(p),{recursive:true});
  fs.writeFileSync(p,contenido);
}
fs.rmSync(destino,{recursive:true,force:true});
for(const ruta of especificas){
  const origen=path.join(raiz,ruta);
  if(!fs.existsSync(origen))throw Error('Falta recurso requerido: '+ruta);
  if(ruta.endsWith('.json')){
    let dato=JSON.parse(fs.readFileSync(origen,'utf8'));
    if(transformaciones[ruta])dato=transformaciones[ruta](dato);
    escribir(ruta,JSON.stringify(dato,null,2)+'\n');
  }else if(ruta==='index.html'){
    let html=fs.readFileSync(origen,'utf8');
    // Los sistemas pendientes no deben figurar ni en el HTML original.
    if(/data-juego="nd20_(?:cifi|nocturna)"|<option value="nd20_(?:cifi|nocturna)">/.test(html))
      throw Error('Los selectores contienen CiFi/Nocturna no publicados.');
    if(!html.includes('class="juegos-compactos"'))
      throw Error('No se encuentra el selector visual de sistemas.');
    html=html.replace('class="juegos-compactos"','class="juegos-compactos juegos-publicos"');
    // Consulta documental permitida; el selector de sorteo queda sin esa opción.
    if(/<option value="documentado"(?:\\s[^>]*)?>/.test(html))
      throw Error('El sorteo no debe ofrecer personajes documentados.');
    escribir(ruta,html);
  }else{
    fs.mkdirSync(path.dirname(path.join(destino,ruta)),{recursive:true});
    fs.copyFileSync(origen,path.join(destino,ruta));
  }
}
const listaResultante=[];
for(const ruta of especificas){
  const p=path.join(destino,ruta);
  listaResultante.push([ruta,fs.statSync(p).size]);
}
const revisados=['data/conjuros-revisados-001-225.json',
  'data/conjuros-revisados-226-434.json']
  .flatMap(ruta=>JSON.parse(fs.readFileSync(path.join(destino,ruta))).conjuros);
if(revisados.length!==64||conjurosCotejados.size!==64||
   revisados.some(x=>!idsDRS.has(x.id_catalogo)))
  throw Error('Se requieren 64 fichas DRS únicas, literales y sin extras.');
const visibles=JSON.parse(fs.readFileSync(path.join(destino,'data/catalogo-poderes.json')));
if(visibles.conjuros.length!==64||visibles.tecnicas.length!==14)
  throw Error('Filtrado de Conjuros/Técnicas inesperado.');
// Un paquete generado jamás se considera aprobado para publicar solo por
// ejecutar este script. La siguiente etapa debe pasar auditoría y E2E.
console.log('PAQUETE DRS CANDIDATO — SIN DESPLIEGUE');
console.log('Directorio: '+destino);
console.log('Archivos incluidos por lista blanca: '+listaResultante.length);
console.log('Conjuros DRS: '+visibles.conjuros.length+
  ' · Técnicas DRS/CiFi: '+visibles.tecnicas.length+
  ' · Fichas del Tomo limitadas a identificadores DRS: '+revisados.length);
console.log('Datos originales del repositorio de trabajo: intactos.');
