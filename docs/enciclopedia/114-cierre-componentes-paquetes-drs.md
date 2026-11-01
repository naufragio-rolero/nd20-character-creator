# Forja — Cierre de consulta de los paquetes iniciales DRS

**Fecha:** 01/11/2026 · **PR:** [#13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) (borrador) · **Ámbito:** solo equipo del `NaufragioD20DRS.docx`. **No desplegar ni fusionar sin revisión editorial.**

## 1. Auditoría inicial verificable

Se contrastaron los **cinco paquetes** de `data/equipo-inicial.json` con el índice real de `assets/tooltips.js` (PR #13, antes de esta ampliación). El motor de compras introduce el contenido de cada paquete por separado, conservando los nombres del JSON sin estructura adicional. Resultado:

| Indicador | Antes de esta ampliación | Ahora |
|---|---:|---:|
| Apariciones de componentes en los cinco paquetes | 44 | 44 (sin alterar) |
| Nombres normalizados diferentes | 29 | 29 (sin alterar) |
| Componentes con ficha resoluble | **26/44** | **44/44** |
| Componentes con descripción documentada | No se cubrían todos | **32/44** |
| Apariciones de componentes solo mencionados en paquetes | Sin ficha propia | **12/44** (5 nombres distintos) |
| Opciones de compra de útiles y focos | 43 | 43 (sin alterar) |

**Causa:** el catálogo digital ya disponía de 41 útiles y dos focos de las primeras tablas DRS, pero omitía **Iluminación (tabla Word 21)** y **Ropa (tabla Word 25)**. La representación del inventario también conservaba variantes de los nombres de objetos incluidos en paquetes, que no se resolvían al artículo individual equivalente.

## 2. Extracción manual y cotejo con el DOCX original

La consulta se ha cotejado con las tablas **21** y **25** del `NaufragioD20DRS.docx` adjunto en el proyecto y los párrafos **478–493** de *Paquetes de equipo*. Se han añadido **10 entradas de consulta** a `data/equipo-consulta-drs.json`, separadas del catálogo de compras:

| Tabla original | Artículos añadidos | Precio individual literal |
|---|---|---|
| Iluminación, tabla Word 21 | Antorcha; Lámpara de aceite; Linterna; Vela | 10 mc; 20 mp; 10 mo; 1 mc |
| Ropa, tabla Word 25 | Abrigo de piel; Atuendo de noble; Chaqueta de cuero; Disfraz; Traje elegante; Túnica | 20 mo; 30 mo; 10 mo; 5 mo; 15 mo; 1 mo |

Se preserva el **detalle literal de la tabla**, sin modificar el texto o los precios del fichero original de compras. Los DU de Antorcha, Lámpara, Linterna y Vela proceden de sus celdas, y no se consumen automáticamente en la Forja.

### Correspondencias documentales, no equiparaciones inferidas

Se han permitido únicamente **cinco variantes explícitamente respaldadas** por los paquetes y las tablas del DRS:

- «dos raciones de alimento (DU d6 cada una)», «tres raciones (DU d6)» y «ración (DU d6)» consultan la ficha individual de **Ración de alimento** (tabla 17).
- «libro de conjuros en blanco» consulta **Libro de conjuros** (tabla 20).
- «sello de orden sagrada» consulta **Sello** (tabla 20).

El prefijo o la cantidad original **siguen intactos en el inventario**. El precio de la ficha equivalente se presenta como **precio unitario**, no como coste del contenido completo del paquete, que el DRS ya ofrece con descuento. No se calcula ningún importe nuevo, no se cobran artículos otra vez y no se reinterpretan reglas de Esfuerzo, Blindaje ni Dado de Uso.

### Componentes identificados exclusivamente en los paquetes

La búsqueda textual del DOCX no ha encontrado una ficha individual con precio para estos cinco nombres, aunque sí constan expresamente en los paquetes:

| Nombre | Evidencia | Comportamiento |
|---|---|---|
| Mochila | Especial arcanistas, devotos, exploración y mazmorras | Procedencia de los cuatro paquetes, sin precio ni descripción inventados |
| Bolsa de cuero | Especial criminales | Procedencia del paquete, sin precio |
| Odre de agua | Criminales, devotos, exploración y mazmorras | DU d6 documentado en los paquetes; sin precio individual |
| Estuche de pergaminos vacío | Especial arcanistas | Procedencia, sin inventar capacidad ni material |
| Ropa de viaje | Especial exploración y mazmorras | Procedencia, sin equipararla a Túnica ni a otro atuendo |

El popup muestra **«Incluido en»** con la referencia a los paquetes. No presenta una descripción genérica que sustituya a la procedencia realmente disponible. **12** de las 44 apariciones pertenecen a este grupo.

## 3. Decisiones de modelo y compatibilidad

- `personaje.equipo` continúa siendo **un array de cadenas**. No hay cambios en generación, compra inicial, economía, edición de carrito, exportación ni combate.
- `data/equipo-consulta-drs.json` es un **catálogo solo de consulta**: tablas 21/25, correspondencias explicitadas y componentes exclusivos de paquetes. No se añaden sus diez entradas al selector de compras (conserva 41 útiles y dos focos).
- `assets/tooltips.js` incorpora el catálogo en el índice y **rechaza correspondencias** cuyo nombre fuente no figure en ningún paquete o cuyo destino no tenga una identidad única.
- `assets/tooltip-ui.js` mantiene el formato compacto; los cinco objetos solo de paquete no reciben un placeholder vacío, sino procedencia y los datos literales que existan.
- Los **recuerdos** mantienen la clase `narrativo` y los **objetos mágicos** permanecen en su preparación independiente, sin cargar fichas mágicas en la aplicación pública.

## 4. Publicación segura

Se ha añadido expresamente **un solo JSON DRS** a la lista blanca `scripts/crear-paquete-drs.js` porque `assets/app.js` debe solicitarlo para mostrar el equipo de la ficha. La nueva dependencia también se comprueba como **recurso obligatorio** por `scripts/comprobar-publicacion-drs.js`; se compara el contenido físico final con el JSON original y se exigen **10 entradas, cinco correspondencias y cinco componentes exclusivos**.

`tests/paquete-publico-drs.js` comprueba la igualdad integral del catálogo distribuido, su pertenencia al DRS y la exclusión de magia suplementaria. **No se ha abierto el acceso a CiFi/Nocturna ni a contenido de Fantasía no autorizado**. No se publica la raíz: se mantiene `dist/public-drs` como candidato separado, con el procedimiento de aprobación existente.

## 5. Archivos cambiados en esta ampliación

- **Nuevo:** `data/equipo-consulta-drs.json`.
- **Interfaz/índice:** `assets/app.js`, `assets/tooltips.js`, `assets/tooltip-ui.js`.
- **Paquete y guardia:** `scripts/crear-paquete-drs.js`, `scripts/comprobar-publicacion-drs.js`.
- **Pruebas:** `tests/equipo-popups.js`, `tests/browser-compatibilidad.js`, `tests/paquete-publico-drs.js`.
- **Documentación:** este informe y `docs/enciclopedia/PLAN-DE-TRABAJO.md`.

**Sin cambios** en `assets/rules.js`, `assets/equipment.js`, `data/equipo-inicial.json`, `data/ocupaciones.json`, `data/especies.json` ni los catálogos mágicos. El informe anterior [113](113-forja-equipo-objetos-magicos-consulta.md) mantiene el historial de la PR.

## 6. Comprobaciones y criterios de aceptación

- Consulta del índice sobre los datos reales: **44/44 componentes encontrados**, **32/44 con descripción**, **12/44 con procedencia de paquete y sin descripción individual**. Comprobados Antorcha, Vela, Raciones, Sello, Libro de conjuros, Odre y Mochila.
- `node tests/alcance-drs.js` ejecuta `tests/equipo-popups.js` y verifica las diez fichas y las cinco equivalencias, además de un alias inválido que debe rechazarse.
- `node tests/browser-compatibilidad.js`: revisa en Firefox y WebKit Antorcha, Mochila y Ración en una ficha generada y comprueba origen, precio correcto, DU y ausencia de descripción inventada.
- `node scripts/crear-paquete-drs.js`, `node scripts/comprobar-publicacion-drs.js dist/public-drs`, `node tests/paquete-publico-drs.js`: deben confirmar que solo se distribuye equipo DRS autorizado.

**Estado inicial del QA de este informe:** pendientes los resultados definitivos de CI para el último commit; no se atribuye una ejecución exitosa hasta consultarlos. La revisión visual final de capturas y la aceptación editorial siguen siendo trámites diferenciados de las pruebas automatizadas.

## 7. Hallazgos y siguiente fase

1. **DRS-EQ-CONS-01:** los cinco nombres exclusivamente de paquete carecen de precio y detalle individuales en el documento cotejado. **No completar por analogía ni asignar capacidad o número de usos**. Para convertirlos en objetos de compra independientes hace falta una nueva fuente o decisión autoral expresa.
2. **DRS-EQ-CONS-02:** los renglones de iluminación, ropa y componentes se referencian, pero no son compras nuevas; no se debe confundir **precio individual** con el coste ya aplicado de un paquete.
3. Los capítulos DRS de **Instrumentos (tabla 22), Objetos varios (tabla 26), monturas, equipo para monturas y transportes (27–29)** quedan fuera de esta tanda porque no aparecen entre los paquetes iniciales. Son el siguiente bloque natural de **ampliación de consulta DRS**, con distinción entre artículos, servicios, animales y vehículos. No abrir compras nuevas sin pedido explícito.
4. Tras aprobación de los popups y cierre de la PR, mantener **Objetos mágicos** en catálogo separado: revisión editorial de los 28 objetos y el ejemplo, efectos literales y condiciones de publicación sin contaminación del paquete DRS.

**Siguiente decisión de publicación:** revisar visualmente la PR #13, autorizar o posponer su fusión y, de forma separada, decidir el despliegue del nuevo candidato público. No se automatiza ese paso.
