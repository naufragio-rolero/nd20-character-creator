'use strict';
/* Las mesas explican la actividad sin mensajes vacios ni cabeceras repetidas. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const leer=x=>fs.readFileSync(path.join(raiz,x),'utf8');
const html=leer('index.html'),app=leer('assets/app.js'),uiAdversarios=leer('assets/creatures-ui.js');
const estilos=leer('assets/styles.css');
assert.match(html,/<h2 id="titulo-resultados" tabindex="-1">Personajes y seguidores<\/h2>/);
assert.match(html,/<h2 id="titulo-editor-criaturas" tabindex="-1">Adversarios<\/h2>/);
assert.match(html,/<h3 id="criaturas-titulo-biblioteca">Colección<\/h3>/);
assert.match(html,/Las fichas generadas se reúnen aquí para consultarlas y exportarlas\./);
assert.match(html,/Crea tus propias fichas o incorpora perfiles oficiales a tu colección\./);
assert.doesNotMatch(html,/EDITOR DEL CRONISTA|<p class="sobrelinea">RESULTADOS<\/p>|BESTIARIO PERSONAL|Tu bestiario personal/);
assert.doesNotMatch(html,/Todavía no has generado ninguna ficha/);
assert.doesNotMatch(app,/\$\('titulo-resultados'\)\.textContent/);
assert.doesNotMatch(app,/Todavía no has generado ninguna ficha|Mesa despejada\./);
assert.match(app,/\$\('contador'\)\.hidden=entradas\.length===0/);
assert.match(app,/Genera un personaje o un seguidor para añadir la primera ficha/);
assert.match(estilos,/#editor-criaturas>#criaturas-estado:empty\{display:none\}/);
for(const id of ['estado','criaturas-estado','borrar','exportar','criaturas-exportar-biblioteca',
  'criaturas-exportar-pdf-coleccion','criaturas-cantidad']){
 assert.ok(html.includes('id="'+id+'"'),id+' conserva su control o estado');
}
assert.match(html,/<h3 id="titulo-resumen-creacion">Opciones actuales<\/h3>/);
assert.match(html,/<h4 id="titulo-resumen-seguidores">Opciones actuales<\/h4>/);
assert.match(html,/<h3 id="titulo-resumen-adversarios">Colección actual<\/h3>/);
assert.match(html,/id="criaturas-nueva-panel" class="configurar-creacion principal"[\s\S]*?aria-controls="criaturas-crear-dialogo">Generar adversario<\/button>/);
assert.match(html,/id="criaturas-crear-dialogo"[\s\S]*?id="criaturas-crear-manual"/);
assert.match(html,/id="criaturas-crear-aleatorio"/);
assert.match(html,/id="generar-seguidor" type="button" class="principal">Generar seguidor<\/button>/);
assert.match(html,/id="criaturas-ir-importar">Importar desde texto<\/button>/);
assert.match(html,/id="criaturas-exportar-biblioteca" disabled>Exportar fichas propias \(JSON\)<\/button>/);
assert.match(estilos,/\.pestanas-panel\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(estilos,/\.resumen-creacion :is\(h3,h4\)/);
assert.match(estilos,/\.barra-resultados h2,\.criaturas-cabecera h2\{/);
assert.doesNotMatch(html,/id="(?:abrir|cerrar|generar|dialogo|vista)-matriz"/);
assert.doesNotMatch(html,/id="usar-semilla"|id="estado-uso-semilla"/);
assert.match(html,/<label for="semilla">Semilla de reproducción<\/label>/);
assert.match(app,/return \$\('semilla'\)\.value\.trim\(\)\|\|nuevaSemilla\(\)/);
assert.doesNotMatch(uiAdversarios,/Guardar criatura/);
assert.doesNotMatch(html,/Seguidores preparados|Bestiario preparado|Creación preparada|Pegar ficha de adversario/);
console.log('OK: encabezados, nomenclatura y acciones coherentes en las tres secciones.');
