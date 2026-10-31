# Forja de personajes · El Naufragio

Generador estático para **Naufragio d20 (Fantasía, CiFi y Nocturna)** y **Dungeon Hack**, diseñado para publicarse en GitHub Pages sin servidor, base de datos, Python ni compilación.

## Tesauro de nombres Ylat y Talentos documentados

- `data/tesauro-ylat.json` contiene **200 nombres únicos** obtenidos exclusivamente a partir de tres documentos seleccionados de la Biblioteca `/Ylat`: *Personages Niguaze.pdf*, *Cronicas de Niguaze  .pdf* y *Hilo Isla Tormenta 2019.pdf*.
- **51 nombres documentados** indican el archivo y la página en que aparecen; son nombres de personajes existentes en esos textos.
- **149 nombres combinados** reutilizan nombres y apellidos documentados para sugerir personajes nuevos. **No son personajes canónicos ni atribuciones de culturas o especies**.
- En la **rama de desarrollo**, Nd20 Fantasía permite elegir **variantes inspiradas** (por defecto), **nombres documentados** (para revisión interna) o el **repertorio de la Especie**. En el **paquete candidato público** solo aparecen las **149 variantes combinadas** y el repertorio de Especie; los 51 nombres documentados no se sirven ni se pueden seleccionar. Un segundo selector filtra las variantes por **Niguace (116)** o **Isla Tormenta (33)**, sin relacionarlas artificialmente con Especies. El nombre manual sigue teniendo prioridad; los demás sistemas conservan sus repertorios. **27 nombres de pila combinados carecen de clasificación documental de sexo**: se permiten sin atribuirles ninguna y se señala en la ficha.
- Los Talentos documentados de las ocupaciones ampliadas se muestran ahora en **Talentos y capacidades** en vez de Observaciones. Si la adquisición depende del Nivel o de una elección todavía no automatizada, aparece indicado para evitar otorgar capacidades indebidamente.
- **Hurí:** Encanto y Defensa sin armadura aparecen como Talentos; la progresión de Magia tántrica se representa por cantidad de artes conocidas (1 en niveles 1–5, 2 en 6–11, 3 en 12–17 y 4 desde 18), junto con su Blindaje sin armadura. El documento de Ocupaciones **no proporciona nombres ni efectos de las artes tántricas**; el generador las identifica como pendientes, sin inventarlas.

## Menú, procedencia y temas

La barra lateral tiene un selector de sistema compacto (**Nd20F**, **Nd20C**, **Nd20N** y **DH**), un panel independiente para **Herramientas del Cronista / DJ** y una pestaña principal de **Personajes**.

Las Ocupaciones muestran entre paréntesis su origen en el selector y en la ficha: **DRS**, **Nuevas Ocupaciones**, **Ylat**, **CiFi**, **Nocturna**; para Dungeon Hack se usa el origen de la clase declarado en `data/dungeon-hack.json`, sin cambiar su identificador interno.

Se ofrecen cuatro temas sin dependencias externas: **Clásico** (el original), **Ébano** (blanco y gris), **Cerúleo** (azul/cian inspirado en los tokens `assets/css/hg-tokens.css` del repositorio `starkvind/heavens-gate`) y **Obsidiana** (negro y blanco). La elección se recuerda en el almacenamiento local del navegador cuando está disponible.

## Ampliación de progresiones

En `data/progresiones-oficiales.json` se recogen **33 perfiles de Ocupaciones de Fantasía**: 30 tablas están extraídas íntegramente, mientras **Truhán, Astrólogo y Adalid** conservan un aviso y **no se automatizan** hasta contrastar las celdas vacías de sus tablas originales. También se incluyen las **8 tablas de Nocturna** completas.

Catálogos adicionales de `data/catalogo-poderes.json`:
- 8 Órdenes de batalla, 6 Privilegios, 14 recetas de Flechería arcana.
- 24 Canciones, 32 Eidolas y recetas del Lardeur identificadas en el documento de ocupaciones.
- Selecciones de Patrón del Brujo (27), Tradición del Chamán (4), Estirpe del Hechicero (8) y Llama divina del Oráculo (8), con escuelas filtradas según la opción elegida.

Los modos **Rápido** y **Personalizado** aplican las nuevas progresiones cuando la fuente define el número y tipo de Poderes. El motor permite escoger Conjuros según Escuelas/Círculos de origen, canciones por complejidad, Eidolas por Categoría, Flechería por requisito de Nivel, Privilegios, Técnicas por categorías y Órdenes por progreso.

**Límites deliberados:** los requisitos situacionales para usar Técnicas y los beneficios de Talentos deben consultarse en sus manuales. La selección de Conjuros beneficiosos del Epicúreo, Cronurgia del Cronómaca, Compromisos del Adalid y algunos Poderes de Especie de Nocturna todavía necesitan información adicional o etiquetado antes de convertirse en opciones automáticas verificadas. El generador no debe confundirse con una validación exhaustiva de reglas: las progresiones se han contrastado parcialmente de forma automatizada y requieren revisión editorial.

## Modos de creación de Talentos y Poderes

- **Rápido:** el generador completa de forma determinista las elecciones permitidas a partir de una semilla, atendiendo al Nivel y a la progresión oficial.
- **Personalizado:** primero genera los Atributos y el perfil, luego permite elegir Talentos, Técnicas, Argucias, Scripts, Conjuros conocidos y Conjuros preparados. Valida las listas de cada clase, los Círculos desbloqueados, la cantidad de elecciones y la repetición indebida. Requiere **una ficha por operación**.
- **Psion:** sigue asignando los Poderes mediante la tabla d20 (no son de libre elección, tampoco en Personalizado).
- **Mago:** separa el aprendizaje de Conjuros por Nivel (2 en Nivel 1 y 1 adicional por Nivel) de su preparación diaria; permite dejar Espacios sin preparar.
- **Clérigo:** conoce automáticamente su lista del DRS cuando desbloquea cada Círculo; elige los Conjuros preparados según los Espacios disponibles.
- **Guerrero:** elige Brío musculoso o Sacrificio de escudo, sin conceder ambos a la vez.
- **Nocturna:** elige 1 Talento de Especie y otro de Ocupación en Nivel 1, y un segundo Talento de Ocupación en Nivel 9.
- **CiFi:** se aplican las tablas de Técnicas, Argucias, Scripts, Poderes Psiónicos e Ímpetu documentadas, además de respetar el nivel requerido para desbloquear nuevas elecciones.

### Catálogos y progresiones

- `data/catalogo-poderes.json`: **434 entradas singulares de Conjuros** extraídas del Tomo de Magia consultado, 24 Técnicas, 20 Poderes Psiónicos, 6 Argucias y 10 Scripts. Incluye Círculos, Escuelas y categorías relevantes. El número 434 representa las entradas extraídas de esta versión del documento; debe cotejarse con el inventario editorial maestro antes de considerarse el total canónico cerrado.
- `data/progresiones-oficiales.json`: tablas por Nivel **1–30** del Clérigo, Guerrero, Mago y Ladrón; Diplomático, Eudemonista, Forajido, Psion, Soldado y Tecnópata. Todas están referenciadas a los documentos DRS/CiFi consultados.
- **Alcance actual:** los Conjuros efectivamente ofrecidos como opciones automáticas al Mago y Clérigo son los de sus **listas expresas del DRS**. El Tomo completo queda estructurado, pero otros Conjuros deben habilitarse por Escuelas, Ocupaciones y progresiones específicas antes de automatizar su asignación.
- Las otras **33 Ocupaciones ampliadas** de Fantasía aún no tienen sus progresiones especiales codificadas. Sus Talentos siguen como referencias, sin concederse automáticamente.
- **Nocturna:** sus Talentos seleccionables están operativos; la adquisición de Conjuros, Vampirismo, poderes de otras Especies y progresiones de sus Ocupaciones aún requiere un motor especializado. Sus recursos y Debilidades ya se muestran.
- Si un Nivel permite más Técnicas que las opciones compatibles documentadas en el catálogo, el generador **no inventa ni duplica Técnicas** y advierte del déficit.
- Los requisitos de Atributo y equipo de muchas Técnicas se refieren a **usarlas**, no a aprenderlas; se muestran al seleccionarlas y deben comprobarse durante la partida.

## Funciones

- **Cuatro modos:** Nd20 Fantasía, Nd20 CiFi, Nd20 Nocturna y Dungeon Hack.
- Personajes de Nivel 1–30 para Nd20; Nivel 1–36 para Dungeon Hack.
- Especies, Ocupaciones / clases y atributos aleatorios o seleccionables.
- **Fantasía:** 30 especies y 37 ocupaciones (DRS y ampliaciones documentadas de Ylat y Zelda).
- **Nocturna:** 8 especies y 8 ocupaciones, con Debilidades, Esencia, Talentos fijos y una elección inicial de Talento adicional.
- **CiFi:** 6 especies y 6 ocupaciones; las especies incorporan sus Dados de Esencia y los requisitos de varios Atributos.
- Campo de nombre manual para especies sin repertorio de nombres publicado.
- En **Dungeon Hack** cada Atributo muestra solo la **DD**. En Nd20 se muestran VA y DA.
- Progreso automático de Atributos y Salud, con dados y reglas propias de cada juego.
- **Dungeon Hack:** elegir las procedencias del contenido, activar/desactivar especies, generar seguidores (máximo Nivel 30).
- Herramientas de mesa: matrices de Atributos y mazmorras de casillas.
- Varias tarjetas simultáneas, copia al portapapeles y exportación general a texto.
- Semilla opcional reproducible.

## Publicar en GitHub Pages — BLOQUEADO para la edición DRS 1.0

**No actives todavía «Deploy from a branch → main → /(root)».** La
rama de desarrollo contiene los catálogos de los futuros suplementos de
Fantasía. Aunque los selectores de Forja 1.0 solo muestran el DRS,
`index.html` solicita hoy archivos JSON que **incluyen registros de DLC**.
En GitHub Pages, un JSON servido es descargable aunque su contenido esté
oculto en los formularios. Publicar la raíz filtraría estos datos.

**Control de seguridad** (tiene que terminar sin errores **sobre el paquete
final que se vaya a desplegar**, no sobre el repositorio de trabajo):

    node scripts/comprobar-publicacion-drs.js CARPETA_PUBLICA

En la raíz actual este comando **debe fallar** y explicar los catálogos
expuestos. Se puede ejecutar con `--report` para inventariar las alertas
sin bloquear otras pruebas; eso **no certifica** que la carpeta sea publicable.

Ya existe un **primer paquete candidato**, generado mediante una lista
blanca sin eliminar nada del repositorio de trabajo:

    node scripts/crear-paquete-drs.js
    node scripts/comprobar-publicacion-drs.js dist/public-drs
    node tests/paquete-publico-drs.js

La salida se guarda en `dist/public-drs/`; **no es un despliegue** ni
una autorización para habilitar Pages. El workflow
`paquete-publico-drs.yml` prueba exactamente esos archivos en **Chrome,
Firefox y WebKit** y adjunta el paquete candidato como artefacto de
GitHub Actions durante siete días cuando supera las pruebas.

**Decisión editorial (31/10/2026):** el candidato público incluye los
**149 nombres combinados de Ylat**, y excluye físicamente las **51
identidades de personajes documentados** (conservadas solo en el repositorio
de trabajo). Las combinaciones se presentan como propuestas no canónicas,
con filtro por sus ámbitos existentes: Niguace (116), Isla Tormenta (33)
o ambos. **27 combinaciones carecen de clasificación de sexo**; pueden
seleccionarse sin inventarla y la ficha lo advierte. La clasificación por
ámbito no equivale a una pertenencia a una Especie. El nombre manual y
los repertorios por Especie permanecen intactos. Ver
`docs/enciclopedia/102-149-nombres-combinados-ylat.md`.
Las fichas de los **64 Conjuros del DRS** han sido **cotejadas
literalmente con el DOCX original**, incluidos los datos de la tabla
de Calentar metal. El paquete básico elimina el duplicado de Arma
elemental y restituye la redacción DRS de Forja arcana, **sin modificar
el Tomo de Magia de desarrollo**. Un registro de 64 huellas SHA-256
bloquea cualquier divergencia textual futura durante la construcción
y al validar el paquete. Véase
`docs/enciclopedia/101-fidelidad-literal-64-conjuros-drs.md`.

**No se ha desplegado ni habilitado Pages.** Véase
`docs/enciclopedia/100-paquete-publico-drs-candidato.md`.

Dirección prevista cuando se autorice la publicación:
https://naufragio-rolero.github.io/nd20-character-creator/

Los recursos usan rutas relativas, por lo que una futura distribución
depurada podrá funcionar bajo el subdirectorio de Pages.

### Probar en local

No abras index.html directamente desde file://, porque muchos navegadores bloquean la lectura de JSON en ese modo. Levanta un servidor estático:

    python -m http.server 8000

Y visita http://localhost:8000/. No necesitas instalar las dependencias de Flask para la web nueva.

### Comprobar el generador

Con Node.js instalado, ejecuta:

    node tests/smoke.js

No hay dependencias de npm ni flujos de GitHub Actions asociados a estas pruebas.

## Archivos

- **assets/rules.js:** motor de generación independiente del navegador, con semilla determinista.
- **assets/app.js:** interfaz, selección de datos y exportación.
- **assets/styles.css:** presentación adaptable a móvil.
- **data/especies.json**, **data/ocupaciones.json:** contenido original de Nd20 Fantasía.
- **data/especies_cifi.json**, **data/ocupaciones_cifi.json:** contenido original de Nd20 CiFi.
- **data/catalogo-ampliado.json:** perfiles mecánicos contrastados contra los documentos de la Biblioteca «Naufragio d20» (Ocupaciones, Especies, CiFi y Nocturna); origen indicado por entrada.
- **data/dungeon-hack.json:** exportación de clases, especies, profesiones de seguidores, equipo, nombres y procedencias del [generador original de Dungeon Hack](https://github.com/naufragio-rolero/dungeon-hack-creator).
- **tests/smoke.js:** comprobaciones de funcionamiento del motor.

## Límites y decisiones de diseño

- **Conjuros, Técnicas y otros Poderes:** se muestran las referencias almacenadas, pero sus tablas de progreso y elecciones no están implementadas. No se inventan Poderes.
- **Nd20 CiFi:** la riqueza inicial en créditos queda pendiente de una regla confirmada; se señala en la ficha.
- **Nd20 Nocturna:** el manual consultado está en versión de trabajo. Se generan sus ocho especies y ocho ocupaciones efectivamente desarrolladas, sin inventar las dos restantes mencionadas en el texto introductorio. Solo se aplica automáticamente la elección de Talento inicial; otras elecciones por Nivel y Poderes deben consultarse en el documento.
- **Ampliación Fantasía:** los Talentos enumerados se ofrecen como referencias documentales, no todos como concesiones automáticas de Nivel 1. Sus requisitos, tiempos y tablas de progreso deben comprobarse en el manual. No se inventan nombres culturales, equipamiento inicial ni Poderes para las entradas nuevas.
- **Nd20:** el DRS define Atributos VA 4–18; Atributo favorito con +1; mejora de dos Atributos por Nivel; Esfuerzo +1 en los Niveles 6/12/18/24/30 (máximo 9); Salud inicial máxima y aumento por tiradas hasta Nivel 11, luego tabla fija. La especie «Buen desarrollo» se aplica cuando corresponde.
- **Dungeon Hack:** se conservan sus datos originales. La versión nueva separa la lógica del HTML, genera 2d6 reales para las comprobaciones de Moral y usa probabilidades normales para los elementos de la mazmorra, por lo que pueden aparecer pequeñas diferencias frente a la implementación antigua.
- **Mazmorra rápida:** distribuye casillas por tipo y no comprueba conectividad de salas. Es una ayuda improvisada, no un plano listo para explorar.
- La selección aleatoria de especies de Dungeon Hack respeta requisitos de Atributo cuando puede; si los valores generados no cumplen ninguna, el personaje se genera sin especie explícita.
- Los datos de equipo de Nd20 proceden de los archivos JSON originales y se muestran como selección ilustrativa, no como compra verificada con el presupuesto.
- No se almacenan fichas ni semillas en servidores: los resultados viven en la pestaña abierta. Usa «Exportar .txt» para conservarlos.

## Código heredado

**app.py**, **create_char.py**, **templates/**, **static/** y **requirements.txt** se conservan temporalmente para no destruir la aplicación Flask anterior. **GitHub Pages no los ejecuta:** el nuevo index.html es completamente independiente. Una limpieza futura puede trasladarlos a una rama de archivo.

## Autoría y licencias

El repositorio original incorpora una licencia **GPL-3.0** para el código. El documento de referencia de **Naufragio d20** se publica bajo **CC BY-SA 4.0**; sus términos y atribuciones se mantienen al reutilizar el contenido. Los datos importados de Dungeon Hack proceden del generador mencionado arriba y conservan la autoría y derechos que les correspondan. La presencia de una licencia del software no supone una relicencia automática de los textos de los juegos.


## Control editorial local

La herramienta de revisión está en [control.html](control.html) (al publicar:
\`https://naufragio-rolero.github.io/nd20-character-creator/control.html\`).

- Genera un token local en el navegador; guárdalo. El hash y las decisiones se guardan
  en el almacenamiento **local** del dispositivo. Recuperar o restablecer el token
  no concede acceso de escritura al repositorio.
- Filtra el inventario de Ocupaciones, Especies, Talentos, Poderes y progresiones.
  Para cada registro puedes proponer visibilidad, indicar si está publicado/probado
  y dejar notas. **Sin revisar** es el estado inicial de publicación y prueba.
- Exporta \`revision-editorial.json\`. El fichero solo contiene cambios respecto
  al estado de partida, con identificadores estables y validación de estados.
  Puedes importarlo de nuevo desde el editor y usarlo como propuesta de modificación
  del catálogo por una persona con permisos en GitHub.
- El formulario no modifica los catálogos de juego, ni oculta contenido a visitantes,
  ni publica cambios en GitHub. Las reglas y la selección de la Forja solo se
  modificarán cuando esa revisión se incorpore expresamente al repositorio.

**Seguridad:** GitHub Pages es estático. El token local solo bloquea la interfaz
de edición de ese navegador. No es una contraseña de acceso real ni una
barrera contra otros visitantes o personas con acceso al almacenamiento local.
La página sigue siendo pública; no introduzcas credenciales de GitHub aquí.


### Lotes de publicación confirmada y edición masiva

La revisión editorial da por publicados, por confirmación del autor, los
bloques **Naufragio d20 DRS**, **Naufragio d20 CiFi** y **Dungeon Hack
completo**, sin asignar el estado *probado*.

- **DRS:** Ocupaciones, Especies y Talentos base de Fantasía; sus cuatro
  progresiones documentales; Técnicas con fuente «Naufragio d20 DRS»;
  Conjuros cuyo origen específico es «Nd20» en la lista contrastada.
- **CiFi:** Especies, Ocupaciones y Talentos de CiFi; sus progresiones;
  Técnicas, Scripts, Argucias y Poderes Psiónicos cuya fuente es CiFi.
- **Dungeon Hack:** todas sus Ocupaciones, Especies y Talentos, con independencia
  de que su fuente sea Dungeon Hack, Ylat, El Naufragio u otra procedencia
  recogida en su catálogo.

Los demás suplementos, incluidos Tomo de Magia, nuevas Ocupaciones y
Especies ampliadas, no se dan por publicados sin confirmación. Los estados
predefinidos son editoriales: no cambian el contenido del generador.
El panel permite filtrar por fuente, sistema, tipo, texto y estado; aplicar
**publicado**, **probado** o **visible** a todas las coincidencias (con
confirmación) y corregir elementos individuales. El JSON v1 exportado
incluye lotes_base_publicados con los recuentos y cambios solo con las
excepciones; los JSON v1 anteriores se pueden seguir importando.


### Editor de nombres y conceptos

Dentro de control.html, la pestaña **Nombres y conceptos** expone los repertorios
que ya utiliza la Forja:

- Fantasía, CiFi y Nocturna: listas de nombres y conceptos por Especie u
  Ocupación, incluidas las casillas vacías de suplementos.
- Dungeon Hack: listas de nombres por Ocupación y nombres de seguidores.
  No hay conceptos de Dungeon Hack en las fuentes, así que no se inventan.
- Ylat: 51 nombres documentados **solo lectura** (conservan su procedencia)
  y 149 nombres combinados editables.

Se edita un repertorio a la vez, con una entrada por línea. Se validan longitud,
duplicados y estructura; se pueden añadir, retirar y reordenar entradas y
restaurar el original. Las propuestas se guardan en localStorage, separado
de los estados editoriales. Exportar produce un único revision-editorial.json
con el bloque opcional repertorios, y cada repertorio editado lleva su
ruta, valores originales y valores propuestos para detectar conflictos si
el repositorio cambia. Los JSON antiguos sin repertorios siguen admitidos.

**No se aplica nada al generador en el navegador:** la revisión enviada debe
validarse e incorporarse explícitamente al código y a los ficheros de datos.


### Primera fase: Talentos iniciales y equipo

Se han contrastado 30 de las 33 Ocupaciones de Fantasía ampliada con
NaufragioD20 — Ocupaciones. Los Talentos iniciales fijos se muestran sin el
aviso de consulta del manual. Druida, Lardeur y Derviche mantienen sus Talentos
sin conceder hasta localizar la fuente completa.

El Bárbaro elige exactamente uno entre Energúmeno y Receloso. El Adalid elige
un Compromiso y recibe el Talento exclusivo de la rama si corresponde.
Quedan pendientes los Poderes adicionales del Compromiso, los Talentos de otras
Ocupaciones del Diletante y el estilo inicial del Gladiador.

En Fantasía, la Forja tira 4d10 × 10 mo y compra armamento, armadura y
paquete de equipo dentro del presupuesto, usando los precios del DRS y
las competencias permitidas al Nivel solicitado. El saldo y el coste quedan
reflejados en la ficha. Se conserva el recuerdo personal de la Especie sin
imputarle un precio de compra.

CiFi no tiene riqueza inicial documentada: por ahora no se simulan compras,
salvo el arma filosofal gratuita del Eudemonista. Nocturna tampoco recibe
riqueza DRS hasta obtener la fuente económica propia. El catálogo
es una primera selección contrastada y no incluye aún toda la armería.


### Decisión aprobada: dinero inicial de CiFi (28-10-2026)

El autor ha aprobado **4d10 × 100 Créditos** como capital inicial.
Es la traslación de los 4d10 × 10 mo de Fantasía al valor de la moneda
CiFi (1 cr = 1 mp; 1 mo = 10 mp). **No figura aún como texto normativo en
el DRS de CiFi v1.0.3**, que deberá actualizarse: véase
docs/decisiones-editoriales.md.

En la Forja, los personajes de CiFi tienen saldo en Créditos y una
**propuesta de compra** con precios de las tablas oficiales. El regalo
documentado del Eudemonista no se cobra y el Tecnópata comienza con su
Ordenador neuronal. Las armas automáticas y protecciones solo se sugieren
entre las competencias inequívocas; casos ambiguos, incluidos ciertos
nombres de equipo heredados, quedan como asuntos de revisión editorial.


### Decisiones editoriales confirmadas (28-10-2026)

La compra de equipo es aleatoria en ambos modos; no se garantiza material
básico gratuito. La riqueza adicional es optativa y añade 4d10 por cada
Nivel posterior al primero, en mo (Fantasía) o cr (CiFi), manteniendo
la riqueza de Nivel 1. El equipo de Nocturna sigue desactivado.
Los nombres de armas de CiFi proceden de las tablas del manual.
Las decisiones se documentan en docs/decisiones-editoriales.md.


La generación de Nocturna **no incluye compras ni capital inicial**
por decisión expresa del autor; no debe deducirse que estén pendientes
de incorporarse por analogía con otros sistemas.


### Compras individuales del DRS y prueba real en navegador

Las fichas de **Naufragio d20 Fantasía** con capital disponible
permiten comprar individualmente los **41 útiles y 2 focos** del DRS.
El editor muestra el precio unitario, la cantidad, el Nivel de
Antídoto/Veneno, el importe del carrito y el saldo restante.
**Cancelar no modifica la ficha**; **Confirmar** comprueba el
presupuesto y actualiza el inventario, el saldo, la copia de la
ficha y su exportación. Cada línea dispone del botón **Quitar**
para corregir el carrito sin rehacerlo. Pulsar Intro en Cantidad o
Nivel añade el artículo, sin confirmar accidentalmente la compra.

Por decisión editorial, el útil «Almádena» de 2 mo se presenta como
**Martillo de campamento** y conserva su uso como Clava. La
**Almádena** de 60 mo sigue siendo el arma a dos manos.

El flujo se verifica automáticamente en **Google Chrome real**, mediante
`node tests/browser-compras.js`, además de las pruebas unitarias de
Node. La ejecución en GitHub Actions comprueba generación, compra y
cancelación, protección frente a sobrepresupuestos, independencia de
fichas, copia/exportación, foco del teclado y ancho móvil. También se
prueban **Firefox (Gecko)** y **WebKit** mediante
`tests/browser-compatibilidad.js`: Playwright solo se instala en el
entorno de CI, no en la aplicación. WebKit no equivale a probar Safari
directamente en macOS o iOS. Estas pruebas no sustituyen una auditoría
completa de accesibilidad.

Véanse `docs/enciclopedia/97-pruebas-navegador-compras-drs.md` y
`docs/enciclopedia/99-compatibilidad-y-seguridad-publicacion-drs.md`.
**Los tres motores funcionando no autoriza a publicar la raíz**: consultar
el bloqueo de seguridad de la sección «Publicar en GitHub Pages».

### Fichas emergentes (Talentos, Poderes y Objetos)

Los nombres consultables aparecen subrayados en las fichas. Al situar el
puntero, enfocar con teclado o pulsar, se abre una tarjeta con los datos del
catálogo: tipo, Categoría, Círculo, Escuelas, Requisitos, Coste, precio o DU
cuando existen. En el editor Personalizado, el botón «Ver ficha» permite
consultar la opción seleccionada (los elementos de un selector nativo no
ofrecen hover fiable en todos los navegadores).

Se incorpora el archivo data/fichas-documentales.json con una primera
selección de descripciones contrastadas en los manuales del proyecto.
Cuando falte una descripción, se indica expresamente y no se improvisan
efectos. El índice se genera en assets/tooltips.js y la interfaz se controla
en assets/tooltip-ui.js. Ninguna ficha requiere una consulta a red externa.


### Sexo y coherencia narrativa del personaje

La configuración permite elegir **sexo Aleatorio, Femenino o Masculino** y
activar o desactivar la **coherencia narrativa de Ocupaciones**.
Con ella activa, las descripciones femeninas de Doncella de la Espada,
Valquiria e Invocadora se respetan sin presentarse como restricciones
mecánicas. Los varones Gerudo, explícitamente muy excepcionales en el
manual, pueden seleccionarse manualmente. Se filtran los nombres que
cuentan con clasificación editorial, y el campo de nombre introducido
manualmente siempre prevalece. El ajuste queda guardado localmente.
El catálogo y sus fuentes están en \`data/sexo-personajes.json\`.
