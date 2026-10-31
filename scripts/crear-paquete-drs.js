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
const especificas=[
  'index.html',
  'assets/styles.css','assets/favicon.svg','assets/equipment.js','assets/sex.js',
  'assets/rules.js','assets/powers.js','assets/spell-magnitudes.js',
  'assets/tooltips.js','assets/tooltip-ui.js','assets/app.js',
  'data/especies.json','data/ocupaciones.json','data/especies_cifi.json',
  'data/ocupaciones_cifi.json','data/catalogo-ampliado.json',
  'data/tesauro-ylat.json','data/nombres-historicos-ylat.json',
  'data/sexo-personajes.json',
  'data/catalogo-poderes.json','data/conjuros-revisados-001-225.json',
  'data/conjuros-revisados-226-434.json',
  'data/conjuros-magnitudes-literales.json','data/alcance-drs-y-dlc.json',
  'data/conjuros-danio-compuesto.json','data/progresiones-oficiales.json',
  'data/equipo-inicial.json','data/fichas-documentales.json',
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
    // Aprobación del autor (31/10/2026): publicar exclusivamente las 149
    // COMBINACIONES, no las 51 identidades de PNJ documentados.
    // Mantener los ámbitos ya atribuidos por el tesauro; nunca inventar
    // una correspondencia ámbito <-> Especie.
    const combinados=d.entradas.filter(x=>x.tipo==='combinado');
    if(combinados.length!==149||
       new Set(combinados.map(x=>x.id)).size!==149||
       new Set(combinados.map(x=>x.nombre)).size!==149)
      throw Error('El tesauro publicado exige exactamente 149 combinaciones únicas.');
    d.entradas=combinados;
    d.contexto='Variantes onomásticas creadas a partir de elementos documentales de Ylat.';
    d.politica='149 nombres combinados: propuestas para nuevos personajes, no personajes canónicos. Los 51 nombres documentados permanecen solo en desarrollo.';
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
    // Evitar referencias narrativas al contenido Fantasía suplementario
    // que no entra en la distribución física.
    html=html.replace(
      'Activado: Doncella de la Espada, Valquiria e Invocadora se generan en femenino.\n'+
      '          Desactívalo para permitir personajes excepcionales. No es una prohibición mecánica del DRS.\n'+
      '          Los varones Gerudo son posibles, aunque excepcionales.',
      'La opción se aplica a las Ocupaciones publicadas de cada sistema.');
    // CiFi y Nocturna permanecen disponibles y probables en desarrollo,
    // pero se retiran (no se ocultan con CSS) de la navegación pública
    // hasta completar la revisión editorial de ambas ediciones.
    const botonesNoPublicados=[
      '            <button type="button" data-juego="nd20_cifi" aria-pressed="false" title="Naufragio d20 CiFi"><span aria-hidden="true">✦</span><strong>Nd20C</strong></button>',
      '            <button type="button" data-juego="nd20_nocturna" aria-pressed="false" title="Naufragio d20 Nocturna"><span aria-hidden="true">☾</span><strong>Nd20N</strong></button>'
    ];
    const opcionesNoPublicadas=[
      '            <option value="nd20_cifi">Naufragio d20 · CiFi</option>',
      '            <option value="nd20_nocturna">Naufragio d20 · Nocturna</option>'
    ];
    for(const fragmento of botonesNoPublicados.concat(opcionesNoPublicadas)){
      if(!html.includes(fragmento))
        throw Error('La selección pública ha cambiado: revisar ocultación de CiFi y Nocturna.');
      html=html.replace(fragmento,'');
    }
    if(!html.includes('class="juegos-compactos"'))
      throw Error('No se encuentra el selector visual de sistemas.');
    html=html.replace('class="juegos-compactos"','class="juegos-compactos juegos-publicos"');
    // El formulario de desarrollo conserva 51 registros documentados
    // para consulta interna. Solo la distribución pública retira su opción.
    const opcionDocumentada='<option value="documentado">Personajes documentados (51)</option>';
    if(!html.includes(opcionDocumentada))
      throw Error('El selector documental ha cambiado: revisar su exclusión.');
    html=html.replace(opcionDocumentada,'');
    const ayudaVieja='Banco histórico autorizado: 1428 registros originales, 1422 formas únicas tras eliminar el sesgo de seis duplicados. Son propuestas sin atribución documental de sexo, Especie, cultura ni linaje. Hay también 149 combinaciones inspiradas en Ylat; las 51 identidades de personajes documentados se reservan a revisión editorial.';
    if(!html.includes(ayudaVieja))
      throw Error('La ayuda de nombres de Ylat ha cambiado.');
    html=html.replace(ayudaVieja,
      '1422 formas únicas del generador histórico autorizado y 149 combinaciones inspiradas en Ylat (116 del corpus de Niguace y 33 de Isla Tormenta). No atribuyen sexo, cultura, Especie ni linaje; no identifican personajes canónicos. Se excluyen las 51 identidades documentadas.');

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
