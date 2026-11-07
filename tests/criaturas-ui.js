'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=p=>fs.readFileSync(path.join(raiz,p),'utf8');
const html=leer('index.html');
const ui=leer('assets/creatures-ui.js');
const app=leer('assets/app.js');
const css=leer('assets/styles.css');
const drs=leer('scripts/crear-paquete-drs.js');
const mod=require('../assets/creatures-ui.js');
assert.equal(mod.aEntero('','Salud'),null);
assert.equal(mod.aEntero('0','Salud'),0);
assert.equal(mod.aEntero('30','Nivel'),30);
assert.throws(()=>mod.aEntero('1.5','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('-5','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('Infinity','Nivel'),/entero/);
assert.throws(()=>mod.aEntero('9999999999999999999','Nivel'),/entero/);
for(const file of ['creatures.js','creatures-import.js','creatures-library.js',
  'adversarios-formato.js','creatures-ui.js','adversarios-pdf.js']){
  assert.ok(html.includes('defer src="assets/'+file+'"'),'Script UI: '+file);
  assert.ok(drs.includes("'assets/"+file+"'"),'Paquete público: '+file);
}
for(const id of ['tab-criaturas','panel-criaturas','editor-criaturas','resultados-personajes',
  'criaturas-texto','criaturas-analizar','criaturas-vista-previa',
  'criaturas-aplicar-previa','criaturas-ataques','criaturas-talentos',
  'criaturas-formulario','criaturas-biblioteca','criaturas-lista',
  'criaturas-original','criaturas-archivo-json','criaturas-guardar']){
  assert.ok(html.includes('id="'+id+'"'),'Controles UI: '+id);
}
assert.match(app,/\['personajes','herramientas','criaturas'\]/);
assert.match(css,/#editor-criaturas\[hidden\]/);
assert.match(html,/<section id="editor-criaturas"[^>]+hidden>/);
assert.match(html,/<textarea id="criaturas-original"[^>]+readonly/);
assert.match(ui,/importador\.descomponerTexto/);
assert.match(ui,/biblioteca\.importarJson/);
assert.match(ui,/biblioteca\.guardar/);
assert.match(ui,/El texto ha cambiado/);
assert.match(ui,/criaturas-texto'\)\.addEventListener\('input'/);
assert.match(ui,/criaturas ya presentes/);
assert.match(ui,/textoOriginal/);
assert.doesNotMatch(ui,/Math\.random|crearNd20|eleccionDH|tirarDados/);
const formato=require('../assets/adversarios-formato.js');
assert.equal(formato.ataque({nombre:'chinazo',cantidad:1,danoLiteral:'6'},0),
  'Chinazo - 6 de daño');
assert.equal(formato.ataque({nombre:'mordisco',cantidad:2,danoLiteral:'1d6'},1),
  '2 × Mordisco - 1d6 de daño');
assert.equal(formato.ataque({nombre:'mirada',cantidad:1,danoLiteral:'especial'},0),
  'Mirada - especial');
assert.equal(formato.ataque({nombre:'vuelo',cantidad:1},0),'Vuelo');
assert.deepEqual(formato.lineasAtaque([
  {nombre:'garra',cantidad:1,danoLiteral:'7',conectorAnterior:'Inicio'},
  {nombre:'patada',cantidad:1,danoLiteral:'3',conectorAnterior:'o'}
]).map(x=>x.texto),['Garra - 7 de daño','Patada - 3 de daño'],
  'Los ataques alternativos ocupan dos opciones, sin «o» al principio.');
assert.deepEqual(formato.lineasAtaque([
  {nombre:'garra',cantidad:1,danoLiteral:'3',conectorAnterior:'Inicio'},
  {nombre:'beso',cantidad:1,danoLiteral:'3',conectorAnterior:'y'}
]).map(x=>x.texto),['Garra - 3 de daño y Beso - 3 de daño'],
  'Los ataques simultáneos forman una sola opción.');
assert.deepEqual(formato.lineasAtaque([
  {nombre:'garra',cantidad:1,danoLiteral:'3',conectorAnterior:'Inicio'},
  {nombre:'beso',cantidad:1,danoLiteral:'3',conectorAnterior:'y'},
  {nombre:'mirada',cantidad:1,danoLiteral:'especial',conectorAnterior:'o'}
]).map(x=>x.texto),[
  'Garra - 3 de daño y Beso - 3 de daño',
  'Mirada - especial'
],'Las combinaciones mantienen las alternativas y la simultaneidad.');
assert.deepEqual(formato.lineasAtaque([
  {nombre:'garra',cantidad:1,conectorAnterior:'Inicio',notas:'Agarra al objetivo'},
  {nombre:'mordisco',cantidad:1,conectorAnterior:',',notas:'Veneno documentado'}
])[0].notas.map(x=>x.texto),['Agarra al objetivo','Veneno documentado'],
  'Las notas originales siguen asociadas a los ataques agrupados.');
// La vista HTML obtiene fragmentos estructurados para resaltar SOLO
// el nombre; el texto reglamentario que comparten UI y PDF no cambia.
const combinados=formato.lineasAtaque([
  {nombre:'garra',cantidad:2,danoLiteral:'1d6',conectorAnterior:'Inicio'},
  {nombre:'mordisco',cantidad:1,danoLiteral:'especial',conectorAnterior:'y'},
  {nombre:'mirada',cantidad:1,danoLiteral:'5',conectorAnterior:'o'}
]);
assert.deepEqual(combinados[0].partes,[
  {separador:'',cantidad:'2 × ',nombre:'Garra',detalle:' - 1d6 de daño'},
  {separador:' y ',cantidad:'',nombre:'Mordisco',detalle:' - especial'}
]);
assert.deepEqual(combinados[1].partes,[
  {separador:'',cantidad:'',nombre:'Mirada',detalle:' - 5 de daño'}
]);
assert.deepEqual(combinados.map(linea=>linea.partes.map(p=>
  p.separador+p.cantidad+p.nombre+p.detalle).join('')),combinados.map(x=>x.texto));
assert.match(ui,/ele\('strong','criaturas-nombre-ataque',parte\.nombre\)/);
assert.equal(formato.taxonomia({
  categoria:'Monstruo',subcategoria:'Bestias mitológicas',subtipo:'Pétreo'
}),'Monstruo - Bestias mitológicas (Pétreo)');
assert.equal(formato.taxonomia({
  categoria:'Monstruo',subcategoria:'Bestias mitológicas'
}),'Monstruo - Bestias mitológicas');
const manifest=JSON.parse(leer('assets/adversarios-iconos.json'));
assert.equal(manifest.version,1);
assert.ok(manifest.iconos&&!Array.isArray(manifest.iconos));
assert.match(ui,/cargarIconosGaleria/);
assert.match(ui,/criaturas-metrica-icono/);
assert.match(ui,/lineasAtaque\(dato\.ataques\)/);
assert.match(ui,/\$\('criaturas-ficha-titulo'\)\.textContent=dato\.nombre/);
assert.match(css,/\.criaturas-cromo \.criaturas-emblema/);
assert.match(css,/background:#0b0b0b/);
assert.match(css,/recurso-potencia|criaturas-metrica-icono/);

assert.doesNotMatch(ui,/Habilidad relacionada: /);
assert.match(ui,/forja-adversarios-oficiales-v1/);
for(const id of ['criaturas-selector-drs','criaturas-selector-busqueda',
  'criaturas-selector-categoria','criaturas-selector-lista','criaturas-ficha-retirar']){
  assert.ok(html.includes('id="'+id+'"'),'Selector DRS: '+id);
}
assert.ok(html.indexOf('id="configurar-seguidores"')>
  html.indexOf('id="resumen-seguidores"'));
assert.ok(html.indexOf('id="configurar-seguidores"')<
  html.indexOf('id="generar-seguidor"'));
assert.ok(css.includes('equipo-espada.svg')&&css.includes('equipo-libro.svg'));
const indiceFuentes=JSON.parse(leer('data/adversarios-fuentes.json'));
assert.equal(indiceFuentes.version,1);
assert.deepEqual(indiceFuentes.fuentes.map(x=>x.id),['drs']);
assert.equal(indiceFuentes.fuentes[0].total,106);
assert.ok(drs.includes("'data/adversarios-fuentes.json'"));
assert.ok(html.indexOf('id="selector-sistema-global"')<
  html.indexOf('class="pestanas-panel"'));
assert.ok(!html.includes('id="criaturas-ir-biblioteca"'));
assert.match(html,/id="criaturas-cargar-drs"[^>]*>[\s\S]*Perfiles oficiales<\/button>/);
for(const id of ['criaturas-selector-subcategoria','criaturas-selector-nivel-min',
  'criaturas-selector-nivel-max','criaturas-selector-fuente',
  'criaturas-selector-origen','criaturas-selector-limpiar',
  'criaturas-imagen-archivo','criaturas-imagen-previa','criaturas-imagen-quitar']){
  assert.ok(html.includes('id="'+id+'"'),'UX adversarios: '+id);
}
assert.match(ui,/convertirIlustracion/);
assert.match(ui,/registrosOficiales/);
assert.match(css,/aspect-ratio:16\/9/);
// El pie de consulta utiliza los mismos iconos SVG accesibles que las
// acciones de Personajes: cinco botones visibles, nunca una fila principal.
const actions=html.match(/<div class="criaturas-acciones criaturas-ficha-acciones"[\s\S]*?<\/div>/);
assert.ok(actions,'Existe la barra de consulta de adversarios.');
for(const id of ['editar','duplicar','json','pdf','eliminar','retirar']){
  assert.match(actions[0],new RegExp('id="criaturas-ficha-'+id+'"[^>]*class="accion-icono'));
}
assert.match(actions[0],/role="group" aria-label="Acciones de la ficha de adversario"/);
assert.match(actions[0],/class="icono-accion accion-pdf"/);
assert.doesNotMatch(actions[0],/class="principal"|>Editar<\/button>|>Exportar JSON<\/button>/);
assert.match(css,/\.dialogo-ficha-adversario \.criaturas-ficha-acciones button\[hidden\]\{display:none!important\}/);
assert.match(css,/\.criaturas-ficha-acciones\{[\s\S]*?flex-wrap:nowrap/);
assert.match(ui,/setAttribute\('aria-label',tituloEdicion\)/);
// La reorganización es puramente visual: conservamos todos los campos e IDs.
for(const id of ['criaturas-imagen-ajuste','criaturas-imagen-lienzo',
  'criaturas-imagen-rellenar','criaturas-imagen-encajar',
  'criaturas-imagen-zoom','criaturas-imagen-restablecer',
  'criaturas-imagen-confirmar','criaturas-imagen-cancelar',
  'criaturas-ficha-anterior','criaturas-ficha-siguiente','criaturas-ficha-posicion']){
  assert.ok(html.includes('id="'+id+'"'),'Encuadre y navegación: '+id);
}
assert.match(html,/class="criaturas-editor-seccion criaturas-editor-identidad"/);
assert.match(html,/class="criaturas-acciones criaturas-guardar" role="group"/);
assert.match(html,/id="criaturas-guardar" class="principal accion-icono"/);
assert.match(ui,/function pintarIlustracion\(/);
assert.match(ui,/function rasterizarEncuadre\(/);
assert.match(ui,/function finalizarEncuadre\(/);
assert.match(ui,/function navegarFicha\(/);
assert.match(ui,/event\.key==='ArrowLeft'/);
assert.match(ui,/event\.target\.closest\('input,textarea,select,\[contenteditable\]'\)/);
assert.match(css,/\.dialogo-adversario \.criaturas-guardar button\.accion-icono/);
assert.match(css,/#criaturas-imagen-lienzo/);
console.log('OK · UI criaturas: panel, controles y lista blanca DRS.');
