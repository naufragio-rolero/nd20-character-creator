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
assert.equal(porCambio.size,13,'10 ajustes geométricos y 3 decisiones editoriales aprobadas');
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
assert.equal(correcciones,13);
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
console.log('OK · 434 fichas cotejadas; 13 cambios aprobados y catálogo DRS validado.');


/* Pruebas del primer subconjunto de magnitudes mecánicas literales. */
const motorMagnitudes=require('../assets/spell-magnitudes.js');
const literales=leer('data/conjuros-magnitudes-literales.json');
assert.equal(literales.registros.length,170,'170 fichas de magnitudes registradas');
assert.equal(new Set(literales.registros.map(x=>x.id_catalogo)).size,170,
  'No repetir IDs entre los 170 Conjuros modelados');
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
        (typeof campo.valor==='string'&&/^\d+d(?:2|3|4|6|8|10|12|20|100)(?:[+]\d+)?$/.test(campo.valor)),
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
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dados_por_nivel',valor:[1,7]},3),
  /Dados por Nivel inválidos/);
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dados_por_nivel',valor:[1,3]},3),'3d3');
assert.throws(()=>magnitudes('Lanza de sombras',0),/Nivel entero positivo/);
assert.equal(motorMagnitudes.calcular({clave:'dados',tipo:'dados_por_nivel',valor:[2,12]},5),'10d12');
console.log('OK · 170 Conjuros con magnitudes verificadas en 4 Niveles; sin ejecutar efectos.');

/* Resoluciones editoriales: 4 m³, redondeo inferior y un solo daño de doble tipo. */
const surcar=revisados.find(x=>x.numero_tomo===385);
assert.ok(surcar.parrafos[3].includes('hasta 4 metros cúbicos'));
assert.ok(surcar.parrafos[3].includes('1 metro de ancho por 1 metro de largo y 4 metros de profundidad'));
assert.ok(surcar.parrafos[3].includes('2 metros de ancho por 2 metros de largo y 1 metro de profundidad'));
assert.ok(!surcar.parrafos[3].includes('12 metros de profundidad'));
assert.equal(1*1*4,4);
assert.equal(2*2*1,4);
assert.equal(valor(magnitudes('Surcar la tierra',8),'volumen_excavacion_max_m3'),4);
assert.equal(valor(magnitudes('Salmo de protección',1),'bono_blindaje'),1);
assert.equal(valor(magnitudes('Salmo de protección',5),'bono_blindaje'),1);
assert.equal(valor(magnitudes('Salmo de protección',6),'bono_blindaje'),1);
assert.equal(valor(magnitudes('Salmo de protección',11),'bono_blindaje'),1);
assert.equal(valor(magnitudes('Salmo de protección',12),'bono_blindaje'),2);
assert.equal(valor(magnitudes('Sifón de recuerdos',1),'turnos_de_memoria'),1);
assert.equal(valor(magnitudes('Sifón de recuerdos',2),'turnos_de_memoria'),1);
assert.equal(valor(magnitudes('Sifón de recuerdos',3),'turnos_de_memoria'),2);
assert.equal(valor(magnitudes('Sifón de recuerdos',8),'turnos_de_memoria'),3);
assert.equal(valor(magnitudes('Telequinesis',5),'objetos_maximos'),2);
assert.equal(valor(magnitudes('Telequinesis',5),'masa_maxima_kg'),100);
assert.equal(valor(magnitudes('Telequinesis',7),'masa_maxima_kg'),100);
assert.equal(valor(magnitudes('Telequinesis',8),'masa_maxima_kg'),200);
assert.equal(valor(magnitudes('Telequinesis',12),'objetos_maximos'),6);
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'por_cada_n_niveles',valor:[2,3]},5),2);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'por_cada_n_niveles',valor:[1,0]},5),/inválidos/);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'base_mas_por_cada_n_niveles',valor:[1,1,0]},5),/inválidos/);

const dobles=leer('data/conjuros-danio-compuesto.json');
assert.equal(dobles.registros.length,10);
assert.deepEqual(dobles.registros.map(x=>x.numero_tomo),[3,7,104,148,159,160,183,216,220,387]);
for(const p of dobles.registros){
  const ficha=revisados.find(x=>x.numero_tomo===p.numero_tomo);
  assert.ok(ficha);
  assert.equal(ficha.id_catalogo,p.id_catalogo);
  assert.ok(ficha.parrafos.join(' ').includes(p.evidencia_literal));
  assert.equal(p.grupos_de_dados,1);
  assert.equal(p.tipos.length,2);
  const sinDefensas=motorMagnitudes.clasificarDanioCompuesto(p,[],[]);
  assert.equal(sinDefensas.grupos_de_dados,1);
  assert.equal(sinDefensas.multiplicador_debilidad,1);
  assert.equal(sinDefensas.resistencia_unica,false);
  const ambosResisten=motorMagnitudes.clasificarDanioCompuesto(p,p.tipos,[]);
  assert.equal(ambosResisten.resistencia_unica,true);
  assert.equal(ambosResisten.grupos_de_dados,1);
  const soloUnoResiste=motorMagnitudes.clasificarDanioCompuesto(p,[p.tipos[0]],[]);
  assert.equal(soloUnoResiste.resistencia_parcial_pendiente,true);
  const unaDebilidad=motorMagnitudes.clasificarDanioCompuesto(p,[],[p.tipos[0]]);
  const dosDebilidades=motorMagnitudes.clasificarDanioCompuesto(p,[],p.tipos);
  assert.equal(unaDebilidad.multiplicador_debilidad,2);
  assert.equal(dosDebilidades.multiplicador_debilidad,2,'doble tipo no cuadruplica daño');
  assert.equal(dosDebilidades.aplicacion_automatica_completa,false);
  assert.equal(motorMagnitudes.clasificarDanioCompuesto(p,p.tipos,p.tipos)
    .conflicto_resistencia_debilidad,true);
}
const glosarioDoble=tooltip.indice({catalogo,conjurosRevisados:revisados,danioCompuesto:dobles});
assert.ok(tooltip.buscar(glosarioDoble,'[C] Aguijón impío (C1) · Nd20','poder','nd20')
  .danioCompuesto,'Aguijón con daño compuesto consultable');
assert.ok(tooltip.buscar(glosarioDoble,'[C] Tentáculos negros (C4) · Nd20','poder','nd20')
  .danioCompuesto,'Tentáculos con daño compuesto consultable');
assert.equal(tooltip.buscar(glosarioDoble,'[C] Sangre hirviente (C5) · Nd20','poder','nd20')
  .danioCompuesto,undefined,'Sangre hirviente tiene dos grupos de dados distintos');
const appMecanica=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
const uiMecanica=fs.readFileSync(path.join(raiz,'assets/tooltip-ui.js'),'utf8');
assert.ok(appMecanica.includes('data/conjuros-danio-compuesto.json'));
assert.ok(uiMecanica.includes('info.danioCompuesto'));
console.log('OK · 4 m³, redondeo inferior por bloques y 8 perfiles de daño doble aprobados.');


/* Tercera tanda: 35 Conjuros adicionales, todos referenciados por sus fichas. */
assert.equal(valor(magnitudes('Acelerar',5),'duracion_turnos'),2);
assert.equal(valor(magnitudes('Acelerar',6),'duracion_turnos'),3);
assert.equal(valor(magnitudes('Acelerar',6),'acciones_extra_turno'),1);
assert.equal(valor(magnitudes('Aguijón impío',7),'danio_veneno_impio'),'1d6');
assert.equal(valor(magnitudes('Albor de la vida',7),'lanzamiento_turnos'),4);
assert.equal(valor(magnitudes('Aliento de agonía',7),'danio_frio_impio'),'2d6');
assert.equal(valor(magnitudes('Aliento de Lenseng',7),'duracion_turnos'),70);
assert.equal(valor(magnitudes('Alivio pasajero',7),'duracion_horas'),'1d8');
assert.equal(valor(magnitudes('Alzar brezo espinoso',8),'maximo_brezos'),1);
assert.equal(valor(magnitudes('Alzar esqueleto secuaz',1),'maximo_esqueletos'),1);
assert.equal(valor(magnitudes('Alzar esqueleto secuaz',7),'maximo_esqueletos'),3);
assert.equal(valor(magnitudes('Alzar esqueleto secuaz',8),'maximo_esqueletos'),4);
assert.equal(valor(magnitudes('Alzar goblin de lodo',8),'maximo_goblins'),1);
assert.equal(valor(magnitudes('Alzar gólem de carne',8),'danio_explosion'),'8d10');
assert.equal(valor(magnitudes('Alzar gólem de carne',8),'esfuerzo_explosion'),1);
assert.equal(valor(magnitudes('Alzar gólem de sangre',8),'duracion_intervalos'),8);
assert.equal(valor(magnitudes('Alzar hombre corrupto',8),'duracion_intervalos'),'1d4');
assert.equal(valor(magnitudes('Alzar maldito',8),'maximo_malditos'),1);
assert.equal(valor(magnitudes('Alzar treante',8),'treantes_convocados'),'1d4');
assert.equal(valor(magnitudes('Alzar treante',8),'maximo_treantes'),4);
assert.equal(valor(magnitudes('Amistad animal',8),'duracion_intervalos'),'1d4');
assert.equal(valor(magnitudes('Ancla sombría',8),'danio_impio'),'8d8');
assert.equal(valor(magnitudes('Apagallamas',8),'area_m2'),15);
assert.equal(valor(magnitudes('Armadura de maná',8),'bono_blindaje'),'1d4');
assert.equal(valor(magnitudes('Armadura ígnea',8),'danio_reflejado_fuego'),8);
assert.equal(valor(magnitudes('Atormentar',8),'duracion_turnos'),'1d6');
assert.equal(valor(magnitudes('Aura de espinas',8),'bono_danio_cac'),1);
assert.equal(valor(magnitudes('Aura de pestilencia',8),'adyacencia_max_m'),2);
assert.equal(valor(magnitudes('Bendecir el cuerpo',8),'curacion_extra'),'1d6');
assert.equal(valor(magnitudes('Bola de fuego',8),'danio_fuego'),'8d6');
assert.equal(valor(magnitudes('Bomba ácida',8),'radio_m'),6);
assert.equal(valor(magnitudes('Bravura',8),'salud_maxima_extra'),'1d6');
assert.equal(valor(magnitudes('Bravura',8),'curacion_misma_tirada'),'1d6');
assert.ok(magnitudes('Bravura',8).condiciones_no_automatizadas.includes('misma cantidad'),
  'El mismo d6 se usa para curar y aumentar Salud, sin duplicar la tirada');
assert.equal(valor(magnitudes('Burla cruel',8),'danio_psiquico'),'1d6');
assert.equal(valor(magnitudes('Cabaña acogedora de Tuliëlle',8),'superficie_m2'),10);
assert.equal(valor(magnitudes('Cadena de relámpagos',8),'objetivos_adicionales'),'1d4');
assert.equal(valor(magnitudes('Controlar los vientos',2),'intensidad_cambio'),0);
assert.equal(valor(magnitudes('Controlar los vientos',8),'intensidad_cambio'),2);
assert.equal(valor(magnitudes('Cimitarra arcana',8),'critico_natural_desde'),19);
assert.equal(valor(magnitudes('Coraza',8),'bono_blindaje'),1);
assert.equal(valor(magnitudes('Caminar de los vientos',8),'bono_movimiento'),1);
assert.equal(valor(magnitudes('Calma silvestre',8),'nivel_bestia_auto'),3);
assert.equal(valor(magnitudes('Cúpula antimagia',8),'superficie_m2'),3);
assert.equal(valor(magnitudes('Cúpula antimagia',8),'duracion_intervalos'),8);
const dobleFrio=dobles.registros.find(x=>x.numero_tomo===7);
assert.deepEqual(dobleFrio.tipos,['frío','impío']);
assert.equal(motorMagnitudes.clasificarDanioCompuesto(dobleFrio,['frío','impío'],[])
  .resistencia_unica,true);
assert.equal(motorMagnitudes.clasificarDanioCompuesto(dobleFrio,[],['frío','impío'])
  .multiplicador_debilidad,2);
assert.equal(tooltip.buscar(glosarioDoble,'[C] Aliento de agonía (C2) · Slat-Deanaich',
  'poder','nd20')?.danioCompuesto?.numero_tomo,7);
console.log('OK · tercer lote de 35 Conjuros adicionales y cuarto daño dual validado.');

/* Cuarta tanda: centenar de Conjuros, duración, magnitudes y condiciones separadas. */
assert.equal(valor(magnitudes('Cañón aural',10),'danio_magico'),'15d10');
assert.equal(valor(magnitudes('Cañón aural',10),'anchura_linea_m'),2);
assert.equal(valor(magnitudes('Disipar magia',10),'volumen_afectado_m3'),6);
assert.equal(valor(magnitudes('Disco celeste de Excelsus',10),'carga_maxima_aproximada_kg'),300);
assert.ok(magnitudes('Disco celeste de Excelsus',10).condiciones_no_automatizadas.includes('aproximación'));
assert.equal(valor(magnitudes('Detectar lo invisible',9),'duracion_turnos'),45);
assert.equal(valor(magnitudes('Detectar lo invisible',9),'alcance_m'),18);
assert.equal(valor(magnitudes('Descarga de debilidad',9),'factor_danio_cuerpo_a_cuerpo'),0.5);
assert.equal(valor(magnitudes('Detectar la mentira',9),'ventana_declaraciones_min'),60);
assert.equal(valor(magnitudes('Doble ilusorio',9),'alcance_m'),27);
assert.equal(valor(magnitudes('Detectar trampas',9),'duracion_minutos'),90);
assert.equal(valor(magnitudes('Eclipse del artefacto',9),'invocacion_regreso_turnos'),3);
assert.equal(valor(magnitudes('Estrépito',9),'danio_sonico'),'2d6');
assert.equal(valor(magnitudes('Ecos de decadencia',9),'duracion_turnos'),9);
assert.equal(valor(magnitudes('Enjambre voraz',9),'danio_adicional_veneno'),'1d8');
assert.equal(valor(magnitudes('Esfera corrosiva',9),'danio_acido_exito'),'3d12');
assert.equal(valor(magnitudes('Esfera corrosiva',9),'danio_acido_fallo'),'3d6');
assert.ok(magnitudes('Esfera corrosiva',9).condiciones_no_automatizadas.includes('mutuamente excluyentes'));
assert.equal(valor(magnitudes('Encandilamiento',9),'nivel_objetivo_maximo'),3);
assert.equal(valor(magnitudes('Esfera vital',9),'radio_minimo_m'),3);
assert.equal(valor(magnitudes('Esfera vital',9),'radio_maximo_m'),6);
assert.equal(valor(magnitudes('Eternidad arcana',9),'envejecimiento_costo'),'1d4');
assert.equal(valor(magnitudes('Explosión arcana',9),'danio_fuerza'),'9d10');
assert.equal(valor(magnitudes('Explosión arcana',9),'area_m2'),6);
assert.equal(valor(magnitudes('Erupción',9),'danio_contundente_fuego'),'18d6');
assert.equal(valor(magnitudes('Erupción',9),'area_m2'),12);
assert.equal(valor(magnitudes('Endeblez',9),'penalizacion_danio'),-1);
assert.equal(valor(magnitudes('Embozo de sombras',1),'duracion_turnos'),2);
assert.equal(valor(magnitudes('Embozo de sombras',9),'duracion_turnos'),10);
assert.equal(valor(magnitudes('Embozo de sombras',9),'blindaje_extra'),'1d4');
const dobleErupcion=dobles.registros.find(x=>x.numero_tomo===148);
assert.deepEqual(dobleErupcion.tipos,['contundente','fuego']);
assert.equal(dobleErupcion.grupos_de_dados,1);
assert.equal(motorMagnitudes.clasificarDanioCompuesto(dobleErupcion,
  ['contundente','fuego'],[]).resistencia_unica,true);
assert.equal(motorMagnitudes.clasificarDanioCompuesto(dobleErupcion,[],
  ['contundente','fuego']).multiplicador_debilidad,2);
console.log('OK · 170 Conjuros y diez perfiles de daño dual verificados por fuente.');

/* La consulta previa a confirmar una elección usa ID y Nivel del personaje. */
const indiceCompleto=tooltip.indice({
  catalogo,conjurosRevisados:revisados,magnitudes:literales,danioCompuesto:dobles
});
const manoId=revisados.find(x=>x.numero_tomo===222).id_catalogo;
const manoExacta=tooltip.buscarPorId(indiceCompleto,manoId,'poder','nd20');
assert.equal(manoExacta.nombre,'Mano de mago');
assert.equal(manoExacta.id,manoId);
assert.equal(manoExacta.magnitudes.numero_tomo,222);
assert.equal(motorMagnitudes.evaluar(literales,manoExacta.id,7)
  .magnitudes.find(x=>x.clave==='carga_maxima_kg').valor,28);
assert.equal(tooltip.buscarPorId(indiceCompleto,manoId,'equipo','nd20'),null);
assert.equal(tooltip.buscarPorId(indiceCompleto,'conjuro-no-existe','poder','nd20'),null);
assert.equal(tooltip.buscarPorId(indiceCompleto,'conjuro-154','poder','nd20'),null,
  'No resucitar Ira celestial de Círculo 3, ausente del DRS');
const glosolaliaId=revisados.find(x=>x.numero_tomo===173).id_catalogo;
assert.equal(tooltip.buscarPorId(indiceCompleto,glosolaliaId,'poder','nd20').id,glosolaliaId);
const Ui=require('../assets/tooltip-ui.js');
Ui.configurar(indiceCompleto);
assert.equal(Ui.consultaPorId(manoId,'poder','nd20').id,manoId);
assert.equal(Ui.consultaPorId(manoId,'equipo','nd20'),null);
assert.equal(Ui.consultaPorId('conjuro-154','poder','nd20'),null);
const appConjuros=fs.readFileSync(path.join(raiz,'assets/app.js'),'utf8');
const interfazConjuros=fs.readFileSync(path.join(raiz,'assets/tooltip-ui.js'),'utf8');
assert.ok(appConjuros.includes('infoUI?.consultaPorId?.(elegida.id,grupo,tipo)'),
  'El selector usa el ID exacto de la opción elegida');
assert.ok(appConjuros.includes('ver.dataset.glosaNivel=String(borrador.personaje.nivel)'),
  'Nivel del personaje disponible antes de confirmar su generación');
assert.ok(appConjuros.includes('esConjuro?null:'),
  'No seleccionar variantes distintas por la coincidencia de nombre');
assert.ok(interfazConjuros.includes('elemento.dataset.glosaId?'));
assert.ok(interfazConjuros.includes('elemento.dataset.glosaNivel||'));
console.log('OK · Consulta de Conjuros por ID exacto y Nivel en el editor de elecciones.');
/* Dados especiales documentados: no se lanzan ni se inventan mínimos. */
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dado_literal',valor:'1d2'},8),'1d2');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dado_literal',valor:'1d3'},8),'1d3');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dado_literal',valor:'1d6+1'},8),'1d6+1');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dado_literal',valor:'1d4+2'},8),'1d4+2');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dados_por_bloques',valor:[1,6,2]},7),'3d6');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dados_por_bloques',valor:[1,8,4]},8),'2d8');
assert.equal(motorMagnitudes.calcular({clave:'x',tipo:'dados_por_bloques',valor:[1,8,4]},3),'0d8');
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dados_por_bloques',valor:[1,8,0]},8),
  /Dados por bloques de Nivel inválidos/);
assert.throws(()=>motorMagnitudes.calcular({clave:'x',tipo:'dado_literal',valor:'2d7'},8),
  /Expresión de dado no validada/);


/* Quinto lote: 20 Conjuros y dados de bloques de Nivel con redondeo inferior. */
assert.equal(valor(magnitudes('Dormir',5),'puntos_oniricos'),'5d10');
assert.equal(valor(magnitudes('Dormir',5),'alcance_m'),20);
assert.equal(valor(magnitudes('Dardo de penumbra',5),'duracion_ceguera_turnos'),'1d2');
assert.equal(valor(magnitudes('Detonación cadavérica',5),'danio_contundente_impio'),'5d4');
assert.equal(valor(magnitudes('Destello aural',7),'danio_magico'),'3d6');
assert.equal(valor(magnitudes('Destello aural',1),'danio_magico'),'0d6');
assert.equal(valor(magnitudes('Deseo',5),'lanzamiento_intervalos'),'2d6');
assert.equal(valor(magnitudes('Destello de Kaeduin',7),'duracion_ceguera_turnos'),'1d6+1');
assert.equal(valor(magnitudes('Descarga ardiente',9),'danio_fuego'),'2d8');
assert.equal(valor(magnitudes('Detención temporal',7),'duracion_turnos'),'1d4+2');
assert.equal(valor(magnitudes('Espejo de sombras',7),'umbral_inicial'),11);
assert.equal(valor(magnitudes('Espía de la Urdimbre',7),'vision_oscuridad_m'),20);
assert.equal(valor(magnitudes('Estallido de escarcha',7),'danio_frio'),'4d10');
assert.equal(valor(magnitudes('Exhalación de la tumba',7),'danio_veneno_acido'),'2d6');
assert.equal(valor(magnitudes('Fantasmas aullantes',5),'danio_psiquico_contundente'),'2d4');
assert.equal(valor(magnitudes('Floración cinérea',7),'danio_objetivo'),'30d6');
assert.equal(valor(magnitudes('Floración cinérea',7),'danio_cercanos'),'10d6');
assert.equal(valor(magnitudes('Fuego feérico',7),'maximo_criaturas'),7);
assert.equal(valor(magnitudes('Fuego lunar',7),'danio_normal'),'1d8');
assert.equal(valor(magnitudes('Fuego lunar',7),'danio_noche'),'2d6');
assert.equal(valor(magnitudes('Fuego purificador',7),'danio_fuego'),'2d8');
assert.equal(valor(magnitudes('Garra vampírica',7),'danio_impio'),'14d6');
assert.ok(magnitudes('Garra vampírica',7).condiciones_no_automatizadas.includes('daño efectivo'));
assert.equal(valor(magnitudes('Glosolalia mayor',7),'duracion_intervalos'),14);
assert.equal(valor(magnitudes('Glosolalia menor',7),'duracion_intervalos'),7);
for(const id of [104,159,160]){
  const perfil=dobles.registros.find(x=>x.numero_tomo===id);
  assert.ok(perfil,'Daño dual cotejado '+id);
  assert.equal(perfil.grupos_de_dados,1);
  assert.equal(motorMagnitudes.clasificarDanioCompuesto(perfil,perfil.tipos,[])
    .resistencia_unica,true);
  assert.equal(motorMagnitudes.clasificarDanioCompuesto(perfil,[],perfil.tipos)
    .multiplicador_debilidad,2);
}
console.log('OK · 170 Conjuros con dados especiales y diez daños duales sin ejecutar Tiradas.');

/* Sexto lote: 50 nuevas fichas cotejadas con la fuente y por ID. */
const nuevas=[180,181,182,184,185,186,187,188,189,190,191,192,193,194,
 195,196,197,198,199,200,201,202,203,204,205,207,208,209,210,211,212,
 214,215,216,218,220,221,223,224,225,226,227,228,229,230,232,233,234,235,236];
assert.equal(nuevas.length,50);
for(const num of nuevas){
  const original=revisados.find(x=>x.numero_tomo===num);
  const dato=literales.registros.find(x=>x.numero_tomo===num);
  assert.ok(original&&dato,'Nueva ficha '+num);
  assert.equal(dato.id_catalogo,original.id_catalogo);
  assert.ok(original.parrafos.join(' ').includes(dato.evidencia_literal));
}
assert.equal(valor(magnitudes('Ira celestial',8),'danio_radiante'),'4d12');
assert.equal(valor(magnitudes('Idea devoradora',7),'duracion_turnos'),3);
assert.equal(valor(magnitudes('Ilusión',8),'alcance_ilusion_sonora_m'),42);
assert.equal(valor(magnitudes('Invocar elemental menor',8),'duracion_turnos'),24);
assert.equal(valor(magnitudes('Ídolo guardián de Mulinith',8),'reduccion_impacto_fisico'),4);
assert.equal(valor(magnitudes('Ídolo guardián de Mulinith',8),'factor_danio_area'),2);
assert.equal(valor(magnitudes('Invocar ejército ilusorio',8),'impactos_soportados'),0,
  'Nivel inferior a 10 sin mínimo inventado');
assert.equal(valor(magnitudes('Invocar ejército ilusorio',25),'impactos_soportados'),2);
assert.equal(valor(magnitudes('Lanza hemática',9),'danio_impio'),'9d3');
assert.equal(valor(magnitudes('Llamada de auxilio',9),'maximo_receptores'),9);
assert.equal(valor(magnitudes('Lluvia de estrellas',9),'danio_exito_radiante_psiquico'),'10d8');
assert.equal(valor(magnitudes('Lluvia de estrellas',9),'danio_fallo_radiante'),'5d6');
assert.equal(valor(magnitudes('Muro de fuego',9),'longitud_m'),'1d8+2');
assert.equal(valor(magnitudes('Marchitar',9),'danio_impio_a_planta'),9);
assert.equal(valor(magnitudes('Maldición de pesadumbre',9),'danio_adicional_recibido'),'2d6');
const dobleLluvia=dobles.registros.find(x=>x.numero_tomo===216);
const dobleLuna=dobles.registros.find(x=>x.numero_tomo===220);
assert.ok(dobleLluvia&&dobleLuna);
assert.deepEqual(dobleLluvia.tipos,['radiante','psíquico']);
assert.equal(dobleLluvia.rama,'exito');
assert.ok(dobleLluvia.condicion_activacion.includes('5d6 radiante'),
  'La rama de fallo no tiene daño psíquico');
assert.equal(dobleLuna.rama,'siempre');
for(const perfil of [dobleLluvia,dobleLuna]){
  assert.equal(perfil.grupos_de_dados,1);
  assert.equal(motorMagnitudes.clasificarDanioCompuesto(perfil,perfil.tipos,[])
    .resistencia_unica,true);
  assert.equal(motorMagnitudes.clasificarDanioCompuesto(perfil,[],perfil.tipos)
    .multiplicador_debilidad,2);
}
const visorCondicional=tooltip.indice({catalogo,conjurosRevisados:revisados,
  magnitudes:literales,danioCompuesto:dobles});
const fichaLluvia=tooltip.buscarPorId(visorCondicional,dobleLluvia.id_catalogo,'poder','nd20');
assert.ok(fichaLluvia?.danioCompuesto?.condicion_activacion.includes('Solo la rama'));
assert.equal(fichaLluvia?.magnitudes?.numero_tomo,216);
assert.ok(fs.readFileSync(path.join(raiz,'assets/tooltip-ui.js'),'utf8')
  .includes('info.danioCompuesto.condicion_activacion'));
console.log('OK · sexto lote de 50 Conjuros: 170 magnitudes y 10 daños duales cotejados.');
