'use strict';
/* Pruebas de integración informativa del Tomo. No evalúan resultados de combate. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.join(__dirname,'..');
const leer=(p)=>JSON.parse(fs.readFileSync(path.join(raiz,p),'utf8'));
const indice=leer('docs/enciclopedia/70a-indice-conjuros-434.json');
const cambios=leer('docs/enciclopedia/78a-correcciones-geometria-conjuros-10.json');
const decisiones=leer('docs/enciclopedia/82a-correcciones-confirmadas-conjuros.json');
const catalogo=leer('data/catalogo-poderes.json');
const fuentes=Array.from({length:18},(_,i)=>{
  const ini=String(i*25+1).padStart(3,'0');
  const fin=String(Math.min(434,(i+1)*25)).padStart(3,'0');
  return leer('docs/enciclopedia/69'+ 'abcdefghijklmnopqr'[i]+
    '-conjuros-alfabeticos-'+ini+'-'+fin+'.json');
}).flatMap(x=>x.registros);
const revisados=[
  ...leer('data/conjuros-revisados-001-225.json').conjuros,
  ...leer('data/conjuros-revisados-226-434.json').conjuros
];
const porCambio=new Map([...cambios.registros,...decisiones.registros]
  .map(x=>[x.numero_tomo,x]));
assert.equal(fuentes.length,434,'434 fuentes originales');
assert.equal(indice.registros.length,434,'434 entradas de índice');
assert.equal(revisados.length,434,'434 textos publicados');
assert.equal(porCambio.size,12,'10 ajustes geométricos y 2 decisiones editoriales aprobadas');
let correcciones=0;
const ids=new Map(catalogo.conjuros.map(x=>[x.id,x]));
for(let i=0;i<434;i++){
  const original=fuentes[i],editado=revisados[i],meta=indice.registros[i],n=i+1;
  assert.equal(original.numero_tomo,n,'ordinal original');
  assert.equal(editado.numero_tomo,n,'ordinal publicado');
  assert.equal(editado.nombre_tomo,original.nombre_literal,'nombre de origen '+n);
  assert.equal(editado.circulo_tomo,meta.circulo_tomo,'círculo fuente '+n);
  assert.equal(editado.escuela_tomo,meta.escuela_literal,'escuela fuente '+n);
  assert.equal(editado.alcance,meta.alcance_literal,'alcance fuente '+n);
  assert.equal(editado.duracion,meta.duracion_literal,'duración fuente '+n);
  assert.equal(editado.lanzamiento,meta.lanzamiento_literal,'lanzamiento fuente '+n);
  assert.equal(editado.requisito,meta.requisito_literal,'requisito fuente '+n);
  assert.ok(ids.has(editado.id_catalogo),'conexión al catálogo en '+n);
  assert.ok(meta.identidades_posibles_catalogo.some(x=>x.id===editado.id_catalogo),
    'identidad de origen no inventada '+n);
  const correccion=porCambio.get(n);
  const esperado=original.parrafos_literal.slice();
  if(correccion){
    assert.equal(esperado[correccion.parrafo_editado],correccion.texto_original,
      'texto a corregir cotejado '+n);
    esperado[correccion.parrafo_editado]=correccion.texto_corregido;
    assert.equal(editado.estado_redaccion,'correccion_editorial_aprobada');
    correcciones++;
  }else{
    assert.equal(editado.estado_redaccion,'literal_cotejado');
  }
  assert.deepEqual(editado.parrafos,esperado,'ningún cambio no autorizado en '+n);
}
assert.equal(correcciones,12);
assert.ok(!catalogo.conjuros.some(x=>x.id==='conjuro-154'),
  'Ira celestial C3 excluida: DRS y Tomo solo la documentan en C5');
assert.equal(catalogo.conjuros.length,433);
assert.equal(new Set(revisados.map(x=>x.id_catalogo)).size,433,
  'Arma elemental está duplicada literalmente en el Tomo');
assert.equal(revisados[25].id_catalogo,revisados[28].id_catalogo);
assert.deepEqual(revisados[25].parrafos,revisados[28].parrafos);
assert.equal(revisados[187].id_catalogo,'conjuro-46',
  'Ira celestial documentada solo para Círculo 5');
assert.equal(revisados[172].id_catalogo,'conjuro-292',
  'Glosolalia mayor del Tomo corresponde a la variante † del catálogo');

const tooltip=require('../assets/tooltips.js');
const glosario=tooltip.indice({catalogo,conjurosRevisados:revisados});
const buscar=(nombre)=>tooltip.buscar(glosario,nombre,'poder','nd20');
const cupula=buscar('[C] Cúpula antimagia (C6) · Nd20');
assert.ok(cupula.descripcion.includes('superficie circular de 3 m²'));
assert.ok(!cupula.descripcion.includes('radio de 3m2'));
assert.ok(cupula.datos.some(x=>x[0]==='Redacción'&&x[1].includes('aprobada')));
assert.ok(cupula.datos.some(x=>x[0]==='Automatización'&&x[1].includes('no automatizado')));
assert.ok(buscar('[C] Tromba de meteoritos (C8) · Nd20').descripcion
  .includes('superficie circular de 20 m²'));
assert.ok(buscar('[C] Glosolalia mayor † (C5) · Grimorio de Tuliëlle').descripcion.length>40);
const iraC5=buscar('[C] Ira celestial (C5) · Nd20');
const iraC3=buscar('[C] Ira celestial (C3) · Nd20');
assert.ok(iraC5.descripcion.includes('4d12'),'Círculo 5 usa la ficha del Tomo');
assert.equal(iraC3,null,'No ofrecer el círculo 3 ausente del DRS');
assert.equal(revisados[432].parrafos[4].includes('Nivel 13 o superior'),true,
  'Yugo: daño solo desde nivel 13');
assert.ok(revisados[355].parrafos[5].includes('A lo largo del descanso, la magia va revelando poco a poco'),
  'Revelar: lanzamiento y estudio progresivo');
assert.ok(iraC5.datos.some(x=>x[0]==='Círculo'&&x[1]==='5'));
assert.ok(buscar('[C] Mano de mago (C1) · Nd20').descripcion.length>50);
console.log('OK · 434 fichas cotejadas; 12 cambios aprobados y catálogo DRS validado.');


/* Pruebas del primer subconjunto de magnitudes mecánicas literales. */
const motorMagnitudes=require('../assets/spell-magnitudes.js');
const literales=leer('data/conjuros-magnitudes-literales.json');
assert.equal(literales.registros.length,41,'41 fichas de magnitudes registradas');
assert.equal(new Set(literales.registros.map(x=>x.id_catalogo)).size,41,
  'No repetir IDs entre los 41 Conjuros modelados');
for(const entrada of literales.registros){
  // Cada magnitud debe conservar evidencia textual y funcionar en varios niveles.
  assert.equal(new Set(entrada.magnitudes.map(x=>x.clave)).size,entrada.magnitudes.length,
    'Magnitudes sin claves repetidas: '+entrada.nombre_tomo);
  for(const nivelPrueba of [1,5,10,30]){
    const salida=motorMagnitudes.evaluar(literales,entrada.id_catalogo,nivelPrueba);
    assert.equal(salida.numero_tomo,entrada.numero_tomo);
    assert.equal(salida.magnitudes.length,entrada.magnitudes.length);
    for(const campo of salida.magnitudes){
      assert.ok(typeof campo.valor==='boolean'||
        (typeof campo.valor==='number'&&Number.isFinite(campo.valor))||
        (typeof campo.valor==='string'&&/^\\d+d(?:4|6|8|10|12|20|100)$/.test(campo.valor)),
        'Resultado puramente declarativo: '+entrada.nombre_tomo+'/'+campo.clave);
    }
  }
  const ficha=revisados.find(x=>x.numero_tomo===entrada.numero_tomo);
  assert.ok(ficha,'Ficha de Conjuro original '+entrada.numero_tomo);
  assert.equal(entrada.id_catalogo,ficha.id_catalogo,'ID literal '+entrada.nombre_tomo);
  assert.equal(entrada.nombre_tomo,ficha.nombre_tomo,'Nombre literal '+entrada.numero_tomo);
  assert.ok(ficha.parrafos.join('\n').includes(entrada.evidencia_literal),
    'Evidencia original exacta de '+entrada.nombre_tomo);
  assert.equal(entrada.estado,'magnitudes_literales_verificadas_no_ejecucion_completa');
  assert.ok(entrada.magnitudes.length,'Magnitudes presentes');
}
function magnitudes(nombre,nivel){
  const ficha=literales.registros.find(x=>x.nombre_tomo===nombre);
  assert.ok(ficha,'Conjuro estructurado: '+nombre);
  return motorMagnitudes.evaluar(literales,ficha.id_catalogo,nivel);
}
function valor(obj,clave){
  const campo=obj.magnitudes.find(x=>x.clave===clave);
  assert.ok(campo,'Magnitud de '+obj.nombre_tomo+': '+clave);
  return campo.valor;
}
assert.equal(valor(magnitudes('Mano de mago',1),'carga_maxima_kg'),4);
assert.equal(valor(magnitudes('Mano de mago',7),'carga_maxima_kg'),28);
assert.equal(valor(magnitudes('Mano de mago',10),'carga_maxima_kg'),40);
assert.equal(valor(magnitudes('Mano de mago',30),'carga_maxima_kg'),40);
assert.equal(valor(magnitudes('Proyectil mágico',1),'numero_proyectiles'),1);
assert.equal(valor(magnitudes('Proyectil mágico',18),'numero_proyectiles'),18);
assert.equal(valor(magnitudes('Proyectil mágico',18),'danio_por_proyectil'),'1d6');
assert.equal(valor(magnitudes('Vigor de coloso',14),'bono_fuerza'),2);
assert.equal(valor(magnitudes('Vigor de coloso',14),'duracion_turnos'),14);
assert.equal(valor(magnitudes('Valentía',8),'duracion_turnos'),'1d6',
  'Dado sin lanzar ni suponer resultados');
assert.equal(valor(magnitudes('Marcha de araña',8),'factor_movimiento'),0.5,
  'No redondear Movimiento en el motor');
assert.equal(valor(magnitudes('Vigilia de muerte',8),'salud_tras_activacion'),1);
assert.equal(valor(magnitudes('Muro de fuerza',8),'nivel_bloqueado_maximo'),6);
assert.equal(valor(magnitudes('Caída de pluma',7),'alcance_m'),7);
assert.equal(valor(magnitudes('Arma elemental',7),'danio_adicional'),'1d6');
assert.equal(valor(magnitudes('Luz',7),'duracion_ceguera_turnos'),1);
assert.equal(valor(magnitudes('Dardo ígneo',7),'danio_fuego'),'1d6');
assert.equal(valor(magnitudes('Chispa curativa',7),'curacion'),'1d4');
assert.equal(motorMagnitudes.evaluar(literales,'conjuro-no-existe',7),null);
assert.throws(()=>magnitudes('Mano de mago',0),/Nivel entero positivo/);
assert.throws(()=>magnitudes('Mano de mago',1.5),/Nivel entero positivo/);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'por_nivel_con_tope',valor:[4]},2),/Factor y tope/);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dinero',valor:4},2),/desconocida/);
const copia=JSON.stringify(literales);
magnitudes('Proyectil mágico',9);
assert.equal(JSON.stringify(literales),copia,'El evaluador no modifica el catálogo');
const glosarioMagnitudes=tooltip.indice({
  catalogo,conjurosRevisados:revisados,magnitudes:literales
});
assert.ok(tooltip.buscar(glosarioMagnitudes,'[C] Mano de mago (C1) · Nd20','poder','nd20')
  .magnitudes,'Magnitudes integradas en fichas emergentes');
assert.equal(tooltip.buscar(glosarioMagnitudes,'[C] Ira celestial (C3) · Nd20','poder','nd20'),null,
  'Círculo no documentado no se ofrece');
const htmlIntegracion=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const appIntegracion=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
const uiIntegracion=fs.readFileSync(path.join(raiz,'assets/tooltip-ui.js'),'utf8');
assert.ok(htmlIntegracion.includes('assets/spell-magnitudes.js'));
assert.ok(appIntegracion.includes('data/conjuros-magnitudes-literales.json'));
assert.ok(appIntegracion.includes('data-nivel='));
assert.ok(uiIntegracion.includes('NaufragioMagnitudes.evaluar'));
/* Segundo lote: dado multiplicado por Nivel, formas de área y efectos condicionados. */
assert.equal(valor(magnitudes('Destrucción',1),'danio_magico'),'2d12');
assert.equal(valor(magnitudes('Destrucción',21),'danio_magico'),'42d12');
assert.equal(valor(magnitudes('Hálito de ultratumba',7),'danio_mixto'),'7d6');
assert.equal(valor(magnitudes('Hálito de ultratumba',7),'superficie_cono_m2'),6);
assert.equal(valor(magnitudes('Lanza de sombras',9),'danio_impio'),'9d8');
assert.equal(valor(magnitudes('Relámpago',13),'danio_relampago'),'13d8');
assert.equal(valor(magnitudes('Adarga de hielo',4),'duracion_turnos'),8);
assert.equal(valor(magnitudes('Adarga de hielo',4),'bono_bloqueo'),2);
assert.equal(valor(magnitudes('Barrera eléctrica',4),'danio_relampago'),'2d6');
assert.equal(valor(magnitudes('Aura de restauración',4),'salud_por_aliado_y_turno'),2);
assert.equal(valor(magnitudes('Convertir agua',8),'volumen_maximo_l'),8);
assert.equal(valor(magnitudes('Despertar de la vegetación',8),'area_maxima_m2'),48);
assert.equal(valor(magnitudes('Escudo',8),'duracion_turnos_combate'),6);
assert.equal(valor(magnitudes('Explosión sónica',8),'radio_m'),4);
assert.equal(valor(magnitudes('Golpe de rayo',8),'anchura_m'),2);
assert.equal(valor(magnitudes('Golpe de rayo',8),'longitud_m'),20);
assert.equal(valor(magnitudes('Lienzo viviente',8),'multiplicador_danio_recibido'),3);
assert.equal(valor(magnitudes('Ola salvaje',8),'penalizacion_movimiento_empapado'),-2);
assert.equal(valor(magnitudes('Plumaje de Sylestria',8),'plumas_creadas'),'1d4');
assert.equal(valor(magnitudes('Purga tóxica',8),'ventana_resurreccion_turnos'),3);
assert.equal(valor(magnitudes('Resistencia al clima',8),'duracion_horas'),24);
assert.equal(valor(magnitudes('Sangre hirviente',8),'danio_fuego'),'3d8');
assert.equal(valor(magnitudes('Sangre hirviente',8),'danio_impio'),'3d8');
assert.equal(valor(magnitudes('Sello rúnico: Vigilante',8),'duracion_desde_activacion_intervalos'),8);
assert.equal(valor(magnitudes('Silencio',8),'diametro_m'),6);
assert.equal(valor(magnitudes('Silencio',8),'duracion_turnos'),16);
assert.equal(valor(magnitudes('Tentáculos negros',8),'duracion_turnos'),'2d4');
assert.equal(valor(magnitudes('Tridente flamígero',8),'numero_rayos'),3);
assert.equal(valor(magnitudes('Tempestad vengativa',8),'superficie_m2'),20);
assert.equal(valor(magnitudes('Trampa de fuego',8),'danio_contundente'),8);
assert.equal(valor(magnitudes('Tajo carmesí de Nebb',8),'danio_lanzador_impio'),'1d8');
assert.equal(valor(magnitudes('Ventisca',8),'lanzamiento_turnos'),2);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dados_por_nivel',valor:[0,6]},3),
  /Dados por Nivel inválidos/);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dados_por_nivel',valor:[1,3]},3),
  /Dados por Nivel inválidos/);
assert.throws(()=>magnitudes('Lanza de sombras',0),/Nivel entero positivo/);
assert.equal(motorMagnitudes.calcular({clave:'dados',tipo:'dados_por_nivel',valor:[2,12]},5),'10d12');
console.log('OK · 41 Conjuros con magnitudes literales calculadas; sin ejecutar daño ni Tiradas.');
