# La Forja · Adversarios — decisiones de implementación

## Alcance

La interfaz pública utiliza **Personajes, Seguidores y Adversarios**. Se mantienen los
identificadores internos heredados de «Herramientas» y «Criaturas» para no romper
controladores, JSON v1 ni pruebas y referencias existentes.

El panel de Seguidores conserva sus cálculos y el cuadro modal de configuración;
el acceso muestra una rueda dentada local junto al texto «Configurar seguidores».
La Matriz de Atributos utiliza el generador existente y se abre desde Personajes.

## Biblioteca personal y DRS

La mesa de Adversarios comienza vacía. Los cromos personales se recuperan de la
clave local `forja-criaturas-usuario-v1`; la importación no reemplaza registros
existentes ni hace cargas remotas de datos personales.

«Cargar adversarios del DRS» consulta `data/adversarios-drs.json`. El archivo se
ha compuesto cruzando las **106 fichas** del DRS original con los **182 segmentos
de ataque** pertenecientes a ese mismo origen en la auditoría de 326 criaturas;
no se incorporan los registros ajenos al núcleo de reglas. Los nombres, daños y
variantes de ataques se mantienen vinculados al adversario de origen. Las
capacidades y descripciones se obtienen de sus entradas originales del DRS.
Las fichas oficiales no se pueden modificar: «Crear copia editable» las almacena
como una nueva entrada del usuario.

La carga es en memoria y se realiza solo al solicitarla; repetirla no duplica
registros oficiales ni modifica la biblioteca personal.

## Ajustes de Salud y procedencia

El DRS documenta la fórmula Salud media = Nivel × 4 + ajuste × 4. El modo manual
conserva el valor exacto de la ficha aunque no coincida con la media.

La auditoría presenta el caso **Catoblepas** con ajuste **−6** en la columna
«Blindaje» y Salud documentada **52**. La carga del DRS traslada el valor negativo
a `saludAjuste`, considera el Blindaje no documentado y preserva la Salud de 52.
El archivo fuente mantiene la transcripción auditada; el paquete público genera
una copia normalizada. Los adversarios no utilizan el Blindaje de los PJ.

## Formato, persistencia y seguridad

La estructura de ficha `criatura_usuario` y la colección
`biblioteca_criaturas_nd20` continúan en la versión 1. Los campos opcionales
`saludModo`, `saludAjuste` y `catalogoPersonalizado` amplían el modelo sin
invalidar los JSON anteriores. La importación rechaza propiedades incompatibles
antes de escribir y conserva `origen.textoOriginal` y los fragmentos sin
interpretar. Los ataques o Talentos creados manualmente forman parte de la
exportación JSON.

El DRS oficial es únicamente consultable; no se publican bestiarios de Ylat,
CiFi ni otros suplementos. La lista blanca de `dist/public-drs` admite solo
`data/adversarios-drs.json` y el compositor PDF específico de este apartado.
No hay automatización de combate.

## PDF y regresión

`assets/adversarios-pdf.js` reutiliza `pdf-lib`, `fontkit` y las tipografías
locales para componer fichas A5 individuales y colecciones con paginación.
Las pruebas de catálogo, fórmula, integridad JSON, navegadores y paquete público
forman parte del control de aceptación. Las pruebas y la promoción a LIVE se
mantienen separadas: fusionar `main` no implica publicar.
