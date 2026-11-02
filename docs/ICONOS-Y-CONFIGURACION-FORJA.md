# Forja: iconografía y configuración de creación

## Iconos

Todos los símbolos están en `assets/icons-forja.svg` (`viewBox="0 0 24 24"`), invocados desde `assets/app.js` con `<svg><use href="assets/icons-forja.svg#ID"></use></svg>`. El tamaño y los colores se controlan en `assets/styles.css`.

- Poderes: `ico-conjuro`, `ico-tecnica` (función `presentarPoder()`).
- Recursos: `recurso-salud`, `recurso-esfuerzo`, `recurso-movimiento`, `recurso-potencia`, `recurso-esencia`, `recurso-blindaje`.
- Cabecera de personaje: `sexo-masculino`, `sexo-femenino`, `sexo-indeterminado` (este último significa dato no indicado, no una clasificación añadida).
- Configuración: `ico-configurar` (engranaje).
- Equipo: `equipo-espada` (armas cuerpo a cuerpo), `equipo-arco` (a distancia), `equipo-varita`, `equipo-bolsa` (genérico), `equipo-mochila` (almacenamiento), `equipo-orbe` (foco), `equipo-libro`, `equipo-armadura`, `equipo-escudo`, `equipo-municion` y `equipo-caballo` (monturas de cuerpo entero).

Los trazos son **provisionales** y solo representan categorías visuales. Para crear una familia propia conservad los `id`, `viewBox` y el trazo mediante `currentColor`; no hace falta modificar el programa. Los SVG son decorativos (`aria-hidden="true"`).

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
