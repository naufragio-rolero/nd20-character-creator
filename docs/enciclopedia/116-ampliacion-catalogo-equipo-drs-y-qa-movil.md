# Forja — Ampliación documental DRS: instrumentos, varios, monturas y transportes

**Fecha:** 01/11/2026 · **Ámbito:** catálogo de **consulta** DRS · **PR:** [#13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) en borrador, sin fusionar ni publicar.

## 1. Fuentes y método

Fuente original cotejada: `NaufragioD20DRS.docx` disponible en el proyecto. Inspección de las tablas de equipo del DOCX y contraste con el índice real en `data/equipo-inicial.json`. **La propiedad JSON `tabla_word` conserva el índice de tabla con base cero usado históricamente**: por ejemplo, `tabla_word: 22` señala la **tabla 23** contando las tablas desde la primera. No representa un epígrafe numerado por el autor ni la página física del manual. Esta precisión también se aplica a las referencias previas `21` (Iluminación) y `25` (Ropa). No se cambian fuentes ni se asigna una paginación imaginaria.

En las nuevas tablas, se copian **nombres, detalles, precios y movimiento** literalmente cuando constan. Se mantienen campos técnicos de catálogo independientes de la generación de personaje. **El Cronista sigue resolviendo cualquier consecuencia de juego**: nada aquí automatiza Movimiento, penalizaciones, monturas, necesidades de transporte ni costes variables.

## 2. Nuevos registros (27)

| Categoría | Índice de tabla DOCX | Registros | Datos cotejados |
|---|---:|---:|---|
| Instrumentos | 22 | 4 | Arpa 40 mo; Flauta 2 mo; Laúd 35 mo; Tambor 6 mo, con detalles literales |
| Objetos varios | 26 | 8 | Ábaco, Balanza, Baraja de cartas, Dados, Escalera de mano, Pipa de tabaco, Reloj de arena, Tabaco; precios y detalles literales, incluida pipa DU d4 |
| Monturas y animales | 27 | 6 | Burro o mula, Caballo de guerra, Caballo de monta, Escarabajo gigante, Mastín, Pony; Movimiento y precio por fila |
| Equipo para monturas (artículos) | 28 | 5 | Alforjas, Armadura equina, Bridas, Comida, Silla; sin el servicio Establos |
| Transportes | 29 | 4 | Carro, Carro de guerra, Carruaje, Diligencia; precio y monturas necesarias según la celda original |
| **Total** | | **27** | Solo índice de consulta |

El catálogo `data/equipo-consulta-drs.json` alcanza la **versión 3**. Con las diez entradas adicionales de Iluminación y Ropa de la fase anterior, contiene **37 referencias de consulta de las tablas** que no fueron añadidas al módulo de compras; el archivo también conserva cinco útiles con descripción editorial (véase [115](115-cinco-utiles-corrientes-paquetes-drs.md)).

## 3. Separaciones y anomalías relevantes

### Servicios no equipables

El renglón **Establos** (alojamiento de caballos por un día, 6 mp) comparte tabla con el equipo para monturas, pero **no es un objeto**. Se conserva su literalidad y su exclusión en `servicios_excluidos_del_equipo`. Se identifican asimismo como servicios diferenciados la tabla de **alojamiento** (índice 23; seis opciones) y la de **comida/bebida por día** (índice 24; cuatro modalidades). **No** se han convertido en útiles ni en entradas de inventario.

### Precio variable de Armadura equina

El DRS presenta **«Protección corporal —» Precio x4»** y un asterisco **«*»** en la columna de precio. Se guardan ambos literales: `precio_variable_literal` y `precio_literal`. El popup muestra **«Precio variable: Precio x4»**, con el asterisco en detalles técnicos. **No se ha fijado un precio base ni se ha calculado el coste**, porque eso requeriría identificar la armadura de referencia.

### Denominaciones y exactitud

- **«Burro o mula»** es **una fila** con Movimiento 12 metros y precio 8 mo; no se desdobla en dos registros.
- **«Silla»** conserva su denominación literal aunque la tabla sea «Equipo para monturas»; no se renombra a «Silla de montar».
- **«Baraja de cartas»** conserva literalmente «52 cartas, 4 palos con 12 figuras»; no se corrige ni se interpreta.
- **Movimiento 18 metros** de Caballo de monta o de guerra pertenece a la **montura**, nunca se aplica al personaje por tener la ficha abierta.
- Las cantidades y monedas se preservan sin simular compras. Las descripciones editoriales del informe 115 siguen diferenciadas de estos textos del DRS.

## 4. Integración y archivos

- `data/equipo-consulta-drs.json`: grupos `monturas`, `equipo_para_monturas` y `transportes` separados de `tablas`; las cuatro familias anteriores de `tablas` incluyen ahora Instrumentos y Objetos varios. Tres clases de servicios no equipables documentadas.
- `assets/tooltips.js`: tipos específicos de presentación **Montura**, **Equipo de montura**, **Transporte**; Movimiento por ficha y precio variable literal. Los artículos de instrumentos y variados se comportan como equipo corriente.
- `scripts/comprobar-publicacion-drs.js` y `tests/paquete-publico-drs.js`: verifican conteos y contenido físico del JSON distribuido, incluyendo estrella de armadura y separación de Establos.
- `tests/equipo-popups.js`: identifica las 27 fichas por nombre y clase, datos literales, ausencia de competencia inferida, precio variable y servicios excluidos.
- `tests/browser-compatibilidad.js`: amplía la comprobación visual del popup de Mochila en **390 × 844** a Firefox/WebKit: ubicación sin desbordes, fuente editorial, acceso a texto completo, teclado Escape, `aria-expanded` y captura de pantalla.
- La aplicación sigue cargando `data/equipo-consulta-drs.json` como **una sola fuente autorizada**, no las extracciones de Objetos mágicos ni ampliaciones CiFi/Nocturna.
- **Sin cambios en** `assets/rules.js`, `assets/equipment.js`, `data/equipo-inicial.json`, moneda inicial, paquetes, objetos del personaje o lista de compras.

**Alcance funcional honesto:** estas 27 referencias están **indexadas y comprobadas**, pero no figuran como objetos de los personajes iniciales ni existe todavía un navegador público independiente que permita consultarlas todas desde un menú. Incluirlas en la fuente **no equivale a poner a la venta monturas o vehículos**. El próximo trabajo de producto debe diseñar ese acceso si se desea.

## 5. Validación

- Cotejo de tablas fuente completas: **4 + 8 + 6 + 5 + 4 = 27** registros de consulta y **3 categorías de servicios excluidos**.
- Tests automáticos: `tests/equipo-popups.js` (llamado desde `tests/alcance-drs.js`), guardia de publicación y pruebas de distribución física; Playwright con controles en Chrome, Firefox y WebKit.
- Las capturas de móvil generadas por CI son **evidencia automatizada**, no prueba de revisión ocular independiente. Se mantiene pendiente la aceptación editorial de estética visual y textos, sin declarar desplegada la web.
- **QA definitivo en el commit `274aa738`**: las cuatro suites han concluido satisfactoriamente, después de corregir dos expectativas de versión 2→3 en tests documentales (no fueron errores de reglas ni del catálogo).
  - [Validación general, Equipo y Conjuros — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41316782397).
  - [Compras DRS Chrome — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41316782403).
  - [Firefox/WebKit, popup móvil a 390 × 844 y capturas — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41316782383).
  - [Paquete público DRS, guardia y E2E multibrowser — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41316782436).
- Las pruebas móviles confirman geometría, texto accesible por scroll, fuente, Escape y `aria-expanded`. **No se ha realizado inspección ocular de las capturas por esta vía**; la revisión estética editorial y el despliegue siguen pendientes.

## 6. Próximo paso

1. Cerrar la **auditoría visual y accesible** de los popups mediante las capturas generadas en CI y, si fuera necesario, correcciones de foco, fuente o diseño.
2. Presentar la PR #13 para **aprobación editorial de fusión**; **no fusionar ni desplegar automáticamente**.
3. Diseñar una **consulta voluntaria de catálogo** para acceder a las 27 referencias que no están en el inventario inicial, sin alterar la lista de compra de 43 útiles/focos.
4. Mantener las reglas de **servicios** y el cálculo de **precio variable** fuera del inventario hasta decisiones expresas.
5. Objetos mágicos: revisión editorial de 28 fichas y ejemplo, y autorización separada de distribución.

**Histórico:** [Informe 113](113-forja-equipo-objetos-magicos-consulta.md) · [114](114-cierre-componentes-paquetes-drs.md) · [115](115-cinco-utiles-corrientes-paquetes-drs.md).
