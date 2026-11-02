# Forja: iconografía y configuración de creación

**Plan editorial de rediseño:** [PLAN-MAESTRO-ICONOGRAFIA.md](PLAN-MAESTRO-ICONOGRAFIA.md). Las familias humana, élfica y orca se usan como matrices; semielfos y semiorcos se derivan de ellas. Hasta aprobar los nuevos diseños, los iconos de Game-icons y sus créditos permanecen vigentes.

## Iconos SVG individuales y lienzo cuadrado

Los 35 pictogramas son archivos autónomos en `assets/icons/ID.svg`.
Todos tienen `viewBox="0 0 24 24"`, anchura y altura idénticas,
figura centrada y una huella máxima de 19,5 unidades dentro del cuadrado.
La normalización es **proporcional**: no deforma iconos alargados o estrechos.

**Para reemplazar uno:** editar únicamente `assets/icons/ID.svg`, sin
renombrar el archivo, con lienzo 1:1 y el dibujo dentro de sus límites.
No es necesario mantener el `id` interno ni regenerar ningún sprite.
Las máscaras CSS hacen que cualquier SVG de sustitución utilice el color
correspondiente al tema activo mediante `currentColor`.

La función `iconoDecorativo(id,clase)` en `assets/app.js` inserta una
máscara con `--icono-svg:url(URL-ABSOLUTA/assets/icons/ID.svg)`.
La URL se construye con `new URL('assets/icons/'+id+'.svg',document.baseURI)`
para evitar que el CSS interprete rutas relativas desde `assets/styles.css`
como `assets/assets/icons/ID.svg`, dejando los pictogramas invisibles sin
error de consola. El selector visual
usa exactamente el mismo mecanismo. Los pictogramas son decorativos y
se mantienen las etiquetas accesibles.

- Especies: `esp-elfo`, `esp-enano`, `esp-humano`, `esp-mediano`, `esp-gnomo`, `esp-semielfo`, `esp-orco`, `esp-semiorco`.
- Ocupaciones: `ocu-clerigo`, `ocu-guerrero`, `ocu-mago`, `ocu-ladron`.
- Poderes y ajustes: `ico-conjuro`, `ico-tecnica`, `ico-configurar`.
- Recursos: `recurso-salud`, `recurso-esfuerzo`, `recurso-movimiento`, `recurso-potencia`, `recurso-esencia`, `recurso-blindaje`.
- Equipo: `equipo-espada`, `equipo-arco`, `equipo-varita`, `equipo-bolsa`, `equipo-caballo`, `equipo-mochila`, `equipo-orbe`, `equipo-libro`, `equipo-armadura`, `equipo-escudo`, `equipo-municion`.
- Sexo: `sexo-masculino`, `sexo-femenino`, `sexo-indeterminado`.

**Publicación DRS:** las listas blancas de construcción y auditoría
incluyen los 35 SVG, sin el sprite antiguo. La entrega LIVE conserva
la revisión fijada por SHA; integrar esta mejora no despliega DLC ni
altera automáticamente el sitio publicado.

## Nueva iconografía Game-icons.net (atribución y adaptación)

Los 35 SVG visibles de `assets/icons/` proceden de [Game-icons.net](https://game-icons.net/), bajo [Creative Commons Atribución 3.0](https://creativecommons.org/licenses/by/3.0/). Sus autores originales son Delapouite, Lorc, Kier Heyl, DarkZaitzev y sbed. **Cada icono tiene su entrada con autor, título y vínculo a la obra original** en `assets/icons/CREDITOS-GAME-ICONS.txt`, accesible mediante el pie de página de la Forja. Es obligatorio mantener esta atribución en cualquier publicación que incluya los iconos.

Los SVG originales se guardan, con su estructura original 512×512 y sin publicarlos en el paquete DRS, en `docs/iconografia/originales/game-icons/<autor>/<icono>.svg`. Los 35 adaptados emplean fondo transparente, `viewBox="0 0 24 24"`, relleno monocromo y un único marco proporcional 19,5/512 dentro del lienzo 24×24. Las máscaras CSS conservan el color del tema.

`esp-semiorco.svg` es una composición modificada de **orc-head** y **monk-face**, ambos de Delapouite, divididos longitudinalmente para representar herencia humana y orca; no utiliza `goblin-head`. El icono original `goblin-head.svg` está reservado en `docs/iconografia/originales/game-icons/delapouite/` para una posible futura especie Goblin, pero no está incluido en la aplicación pública ni se añade especie alguna al DRS.

No se alteran reglas, categorías ni nombres de especies. La sustitución de archivos individuales se hace sin regenerar sprites. El despliegue LIVE requiere aprobación separada porque el workflow de producción está fijado por revisión y hashes.

## Asociación con Equipo

`iconoEquipo(nombre)` en `assets/app.js` consulta primero los registros literales de `data/equipo-inicial.json`: `armas`, `varitas_defensa`, `armaduras`, `escudos`, `municion`, `focos_conjuros_con_precio` y `utiles_fantasia`. En útiles documentados, reconoce nombres explícitos de libros o almacenamiento. Para textos externos o de Dungeon Hack aplica un respaldo conservador por nombre; lo demás recibe bolsa genérica. No se deduce ninguna regla, competencia ni propiedad mecánica. El nombre original de cada objeto se mantiene para consultar, copiar y exportar.

## Icono y categoría de monturas

Las seis monturas documentadas en `utiles_fantasia.monturas` emplean
`equipo-caballo`, un caballo completo de perfil (SVG 24×24, `currentColor`).
El símbolo se decide por **pertenencia al catálogo de Monturas**, no por
palabras sueltas en el nombre: no aparece en Alforjas, Armadura equina,
Establos o vehículos. El popup identifica **Montura** como tipo y **Monturas**
como categoría, en vez del genérico «Objeto». Los vehículos indican
**Vehículo** como tipo, manteniendo su categoría «Vagones y diligencias».
No se modifican mecánicas ni propiedades.

## Atributos e Iluminación DRS

La ficha de Naufragio d20 presenta los Atributos en tres filas: **Fuerza · Mente**, **Agilidad · Intuición** y **Resistencia · Presencia**. Es una ordenación de la vista: los seis objetos originales de `personaje.atributos` conservan su orden y valores para cálculos y exportaciones. Dungeon Hack conserva su orden sin reordenación automática.

El grupo de compra **Iluminación** incluye las cuatro entradas literales de la tabla del DRS: Antorcha (0,10 mo; DU d6; luz a 6 m), Lámpara de aceite (2 mo; DU d6 de aceite; 4 m), Linterna (10 mo; DU d6 de aceite; 8 m) y Vela (0,01 mo; DU d4; 2 m). Los precios usan las equivalencias de moneda ya establecidas en `equipo-inicial.json`; la regla general del DRS es tirar el DU por Intervalo de uso.

Cuando el inventario de un paquete especial incluye, por ejemplo, `antorcha (DU d6)` o `vela (DU d4)`, la normalización del índice de consulta elimina **solo para buscar** el sufijo de DU y resuelve la ficha concreta del catálogo. El texto original del paquete, la compra y las exportaciones no cambian. Las demás piezas de paquete sin ficha siguen mostrando únicamente la procedencia; las 111 glosas editoriales anteriores no se alteran.

## Ropa y correspondencias documentadas de los paquetes

La categoría **Ropa** recoge seis prendas de la tabla literal del DRS: Abrigo de piel (20 mo), Atuendo de noble (30 mo), Chaqueta de cuero (10 mo), Disfraz (5 mo), Traje elegante (15 mo) y Túnica (1 mo). Los detalles se transcriben de la tabla, sin añadir efectos a los objetos.

Los paquetes conservan su inventario y las cantidades originales. El índice de consulta resuelve las expresiones «ración (DU d6)», «dos raciones de alimento (DU d6 cada una)» y «tres raciones (DU d6)» como la ficha **Ración de alimento**, que ya existía en Campamento. Este alias afecta únicamente a la consulta: no se cobra otra vez, no añade equipo y no modifica el nombre al exportar.

**Ropa de viaje** sí aparece en los paquetes Especial exploración y Especial mazmorras, pero **no tiene entrada individual** en la tabla Ropa ni precio descrito en el DRS. Mantiene la ficha de procedencia, sin heredar precio o efecto de Túnica, Traje elegante u otra prenda. Lo mismo ocurre con Mochila, Bolsa de cuero y Odre de agua, para los que tampoco existe ficha individual en las tablas verificadas. Las 111 glosas anteriores permanecen intactas; las seis prendas nuevas emplean exclusivamente detalles del DRS.

## Instrumentos, objetos varios y monturas del DRS

Se incorporan **28 filas documentadas** a cinco secciones del catálogo DRS:
**Instrumentos** (4), **Objetos varios** (8), **Monturas** (6),
**Equipo y cuidado de las monturas** (6) y **Vagones y diligencias** (4).
Los precios fijos se expresan en mo según las equivalencias existentes.
En Monturas se muestra el **Movimiento literal** del DRS; los vehículos
conservan la descripción de sus caballos o monturas requeridos sin ejecutar
viajes ni asignar cargas no documentadas.

El editor de compras ofrece los artículos con **precio fijo**, reutilizando
la transacción, el presupuesto y el inventario ya existentes. La ficha
**Armadura equina** conserva el coste variable «precio de la protección
corporal ×4», por lo que no se ofrece como compra de precio fijo; el
servicio **Establos** muestra su tarifa de 6 mp **por día**, pero tampoco se
convierte en un objeto permanente del inventario. Ambos quedan consultables.
No se calcula el coste de una armadura equina sin especificar previamente
la protección. En Objetos varios, la Pipa conserva «DU d4 (tabaco)».

**Libro de conjuros en blanco** (y «Libro de conjuros (en blanco)») resuelven,
solo para consulta, la ficha ya existente **Libro de conjuros** (50 mo).
No se cambia el nombre conservado del objeto del paquete ni se duplica
su registro, igual que ocurre con las raciones.

## Cabecera, lotes y contraste

El encabezado muestra el sistema en la primera línea, el nombre debajo y el símbolo de sexo **junto a la Ocupación** (antes de la Especie). El Nivel queda en un distintivo separado, justo a la izquierda de cerrar. La ficha de Dungeon Hack sin sexo declarado muestra un símbolo neutro con texto accesible «Sexo: No indicado»; no se modifica ni se presupone el sexo del personaje.

Los nombres del Equipo se capitalizan **solo para mostrarlos**: «yesquero» pasa a «Yesquero», pero el texto original se conserva en el modelo, las consultas, la exportación y la copia. Las entradas sueltas de los paquetes del DRS se registran en el índice de información: si hay ficha de catálogo se utiliza esa, y si no la hay se ofrece exclusivamente la procedencia del paquete, sin inventar precio ni efecto. No se transforma el contenido reglamentario del paquete.

En Cerúleo, los botones de ficha iluminan el fondo al pasar el ratón y mantienen el texto oscuro contrastado; se evita que el hover genérico oscuro se aplique a botones que utilizan texto oscuro en las tarjetas claras.

## Configurar creación

El panel lateral resume los valores activos de **Nivel**, **Ocupación**, **Especie**, **Sexo**, **Modo** y **Fichas**. «Configurar creación», con engranaje, abre el `<dialog id="dialogo-configuracion">` que contiene el mismo formulario `#configuracion`, incluidos los diálogos de selección de Especie y Ocupación. Se puede «Aplicar opciones» sin generar, o «Generar personaje» desde el modal; el botón principal lateral y el flotante siguen enviando el mismo formulario. No hay copias paralelas de los controles.

El botón flotante se ofrece con la mesa vacía incluso en primera visita móvil; cuando la mesa tiene fichas, evita duplicar el principal y no cubre el pie de página. Las opciones no se aplican a los personajes ya creados. El código conserva el modo Personalizado y la validación reglamentaria.

## Pruebas y despliegue

Probar desde `tests/browser-compatibilidad.js` y `tests/browser-compras.js` los diálogos, foco, resumen, creación normal y personalizada, móvil, SVG y fichas emergentes; validar `tests/paquete-publico-drs.js`. El flujo `.github/workflows/forja-live.yml` mantiene una lista blanca con blobs SHA fijados: el paquete público **no debe publicar la raíz del repositorio** ni incluir CiFi/Nocturna no aprobados.
