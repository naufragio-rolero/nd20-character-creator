# Forja — Precio de armadura equina y consulta voluntaria del Equipo DRS

**Fecha:** 01/11/2026 · **Decisión autoral explícita:** «Para la armadura del caballo: se elige una de las armaduras disponibles comunes para personas, y se aplica su precio x4». **PR:** [#13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13), abierta en borrador y sin publicar.

## 1. Contraste de la fuente

Fuente: `NaufragioD20DRS.docx` adjunto al proyecto. La tabla Word de índice **28** recoge la fila **«Armadura equina»**, el detalle literal **«Protección corporal —» Precio x4»** y la columna de precio **«*»**. La tabla Word de índice **15** contiene las **14 armaduras corrientes para personas** del DRS, todas con precio expresado en mo o mp. Se contrastó su correspondencia con `data/equipo-inicial.json > armaduras`.

**Decisión autoral que resuelve la ambigüedad:** el usuario escoge libremente **una de las 14 armaduras comunes humanas DRS**, y el precio final de la armadura equina es **precio de la armadura elegida × 4**. No hay un importe fijo único. El asterisco y el texto literal del manual se preservan como origen. La aclaración es editorial, identificada como tal; el cálculo no se atribuye falsamente a una frase explicativa que no figure en el DRS.

### Ejemplos cotejados

| Armadura común | Precio humano | Precio equino ×4 |
|---|---:|---:|
| Pechera de algodón | 0,5 mo (5 mp) | 2 mo |
| Armadura de tela | 1 mo | 4 mo |
| Armadura de cuero | 10 mo | 40 mo |
| Coraza | 100 mo | 400 mo |
| Armadura completa de placas | 1000 mo | 4000 mo |

El índice usa exactamente **los 14 nombres y precios originales**: no crea entradas duplicadas ni atribuye nuevas propiedades de protección al animal. En particular, el multiplicador **solo está aprobado para calcular precio**; no se multiplican Blindaje, Durabilidad, nivel, peso, requisitos o Movimiento.

## 2. Cambios técnicos

- `data/equipo-consulta-drs.json`, versión **4**: en Armadura equina, `regla_precio_autoral` registra fuente, fecha, texto y **multiplicador 4**. `precio_variable_literal: "Precio x4"` y `precio_literal: "*"` permanecen sin reescribir.
- `assets/tooltips.js`: construye las **14 opciones** leyendo exclusivamente `data/equipo-inicial.json > armaduras`, valida identidades y precios y multiplica en céntimos, sin depender de redondeos binarios. El modelo de presentación comunica las opciones; no realiza compras ni cambia la ficha.
- `assets/tooltip-ui.js`: la ficha emergente **Armadura equina** incluye un selector con etiqueta y resultado en vivo. Inicialmente **no elige ninguna protección**; después muestra «Armadura humana ×4 = precio equino». Incluye aviso de alcance y procedencia autoral.
- `assets/styles.css`: panel de consulta accesible, adaptado a móvil, con contraste y foco de teclado.
- `index.html` y `assets/app.js`: **consulta voluntaria del catálogo DRS** desde la página, en desplegable independiente del editor de compras. Agrupa **37 fichas extraídas de tablas del DRS y cinco útiles comunes con descripción editorial = 42 artículos**, sin incluir Establos, alojamiento ni otros servicios.
- `tests/equipo-popups.js`: asegura 14/14 opciones, varios precios concretos y rechazo de un multiplicador no autorizado.
- `tests/browser-compatibilidad.js`: consulta de Armadura equina desde el catálogo público, selección de Pechera de algodón, Armadura de cuero y Armadura completa de placas, validación del resultado y ausencia de nuevas fichas/personajes.
- `tests/paquete-publico-drs.js` y `scripts/comprobar-publicacion-drs.js`: cotejan el paquete físicamente distribuido, el origen humano del precio y la regla editorial en el JSON incluido en la lista blanca.

## 3. No automatizar el combate ni las compras

La nueva interfaz **no es un carrito** y **no añade al personaje ninguna armadura equina**. No se modifica el precio de compra de las catorce armaduras humanas, las **43 opciones originales de útiles y focos**, los cinco paquetes iniciales, las reglas de Competencias, el Movimiento ni el motor del juego. El resultado se ofrece exclusivamente como **consulta del coste**, útil para el Cronista.

Los objetos mágicos no se cargan ni publican; CiFi y Nocturna siguen fuera de los selectores públicos. La consulta de catálogo recibe exclusivamente `data/equipo-consulta-drs.json`, que ya estaba autorizado para el paquete candidato, sin ampliación de lista blanca. No reutiliza ni muestra los servicios excluidos.

## 4. QA y estado

- La prueba de índice verifica las **14 armaduras DRS**, con validación de 0,5 mo→2 mo, 10 mo→40 mo y 1000 mo→4000 mo.
- Las pruebas de interfaz verifican el desplegable de catálogo, ausencia de servicio Establos, 42 artículos, cambio de base, aviso de solo consulta y sin fichas nuevas.
- La guardia de publicación exige la **versión 4**, el origen `armaduras`, el **multiplicador 4** y la igualdad completa del catálogo público con la fuente del repositorio.
- Las cuatro suites de GitHub Actions deberán figurar como **satisfactorias para el último SHA**, no para una revisión anterior. Las pruebas de navegador son evidencia funcional automatizada; la inspección visual humana continúa pendiente.
- **No se fusiona ni despliega la PR #13** sin aprobación explícita.

## 5. Próximo paso

1. Verificar las cuatro suites finales sobre la última revisión, incluir enlaces en la PR y documentar cualquier fallo de compatibilidad si lo hubiese.
2. Inspeccionar editorialmente las capturas del catálogo desplegable y del popup de armadura equina en móvil, comprobando legibilidad y control del foco; corregir si procede.
3. Tramitar la aprobación de **fusión** de la PR #13 y, por separado, la promoción controlada del paquete público DRS. Mantener servicios, CiFi, Nocturna y magia aislados.
4. Después, revisión editorial de los **28 Objetos mágicos y el ejemplo** para un catálogo independiente con su propia autorización de publicación.

**Documentos anteriores:** [113](113-forja-equipo-objetos-magicos-consulta.md), [114](114-cierre-componentes-paquetes-drs.md), [115](115-cinco-utiles-corrientes-paquetes-drs.md) y [116](116-ampliacion-catalogo-equipo-drs-y-qa-movil.md). Este documento reemplaza exclusivamente el antiguo estado de «precio equino pendiente de base» y el «acceso al catálogo por diseñar»; no modifica sus registros históricos.
