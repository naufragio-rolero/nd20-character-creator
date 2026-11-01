# Forja 1.4 — Índice editorial de propiedades literales DRS

**Fecha:** 01/11/2026 · **Rama:** `docs/forja-1-4-propiedades-drs-20261101`  
**Fuente:** `NaufragioD20DRS.docx` · SHA-256 `2f3447300e58139ce20c8449e12e5b8d3cd3e7435b2995677ed97c6602a23df8`  
**Corpus publicado de consulta:** `data/talentos-drs-literales.json`  
**Índice documental:** [110a-propiedades-literales-drs.json](110a-propiedades-literales-drs.json)  
**Comprobación automatizada:** `node scripts/verificar-propiedades-talentos-drs.js`.

## Resultado y límites

Se han indexado **24 relaciones** (15 Especie–Talento y 9 Ocupación–Talento), con **79 fragmentos literales verificables** agrupados por **24 categorías de lectura**. La categoría es una pista para revisar prosa, **no una propiedad ejecutable del motor**. Un fragmento no etiquetado **no** implica la inexistencia de su regla. Esta fase no modifica `assets/rules.js`, los JSON de fichas, las progresiones ni `dist/public-drs`.

La prueba automática exige que **cada cita sea una subcadena exacta** del efecto cotejado, que cada identidad corresponda al DRS y que las 24 huellas SHA-256 continúen siendo idénticas al cotejo del documento fuente. No se admiten supuestos o cifras deducidas en la ficha de indicios.

## Decisiones registradas

**DEC-110-01 — Separar evidencia, clasificación e implementación.** Guardar `tipo` y `fragmento_literal` es una operación documental. No traducir las categorías a costes, variables de combate, Tiradas ni activaciones sin aprobación expresa de reglas y pruebas dedicadas.

**DEC-110-02 — Respetar el campo formal de activación.** `Recuperación` tiene activación **Pasiva** en el DRS, aunque describa gastar 1 Punto de Esfuerzo y dedicar un Intervalo. `Corpulencia` y `Meditación` también incluyen gasto en prosa. No incorporar un `Coste` formal donde la fuente no lo declara como encabezado independiente.

**DEC-110-03 — No aplicar dos veces modificadores ya calculados.** `Rapidez`, `Corpulencia` y ambas `Baja estatura` dicen «(ya calculado)» para el Movimiento. El índice conserva esa advertencia: la revisión del motor deberá demostrar que no se duplica.

**DEC-110-04 — Conservar excepciones y límites.** `Sacrificio de escudo` distingue escudo normal destruido y escudo mágico con Durabilidad 0; `Brío musculoso` aumenta Potencia en Niveles 10/22 y limita a Potencia 3 de forma natural. Ninguno se sustituye por un único número descontextualizado.

**DEC-110-05 — Identidad y literalidad.** `Baja estatura` se mantiene vinculada a Mediano y Gnomo; `Visión en la oscuridad` conserva las dos redacciones históricas, incluida la errata de Gnomo. `Herencia dual` conserva las alternativas propias de Semielfo y Semiorco y no se aplana a un único Talento.

**DEC-110-06 — Alcance estrictamente DRS.** Ni estas citas ni sus metadatos se añaden a los archivos públicos. CiFi, Nocturna, Ylat y ampliaciones permanecen fuera de la fase. El catalogador se ejecuta exclusivamente en repositorio de desarrollo.

## Asuntos que necesitan conciliación editorial antes de automatizar

| Referencia | Pregunta concreta | Estado |
|---|---|---|
| **ESP-DRS-01** · Corpulencia | ¿La repetición de Blindaje constituye alguna categoría de activación o requisito adicional no rotulada en su texto? | No inferir; se conserva únicamente la cita condicional y el gasto explícito. |
| **ESP-DRS-02** · ¡Sálvese quien pueda! | ¿Cómo expresaremos el consumo simultáneo de Acción y Esfuerzo para automatizarlo, sin volver a interpretar el texto? | Sin automatización. |
| **ESP-DRS-03** · Ánimo | ¿Cómo representar la limitación «Una vez al día», la audición y la declaración previa a la Tirada? | Frecuencia y condiciones conservadas literalmente. |
| **OCP-DRS-01** · Recuperación | ¿Cómo registrar la activación formal `Pasiva` junto al gasto condicional, sin cambiarla por `Acción`? | Etiqueta formal intacta; gasto solo en prosa. |
| **OCP-DRS-02** · Expulsar muertos vivientes | ¿Cómo modelar Probabilidad 15+, límite de Nivel y los dos criterios de fin del efecto, sin atribuir una tirada adicional al Cronista? | Ningún nuevo procedimiento de tirada. |
| **OCP-DRS-03** · Sacrificio de escudo | ¿Qué necesita el inventario para conservar la diferencia entre destrucción normal y Durabilidad 0 del mágico? | No tocar inventario. |
| **OCP-DRS-04** · Brío musculoso | ¿Está evitada cualquier segunda aplicación del aumento de Potencia a Niveles 10/22? | Ya se aplica desde el motor previo; mantener prueba de regresión. |
| **ESP-DRS-04** · Baja estatura y Rapidez | ¿Coinciden los ajustes «ya calculado» con los perfiles sin suma adicional en el generador? | Mantener revisión sin alterar fórmula. |

Estos asuntos son una lista de verificaciones; **no** se presentan como errores existentes demostrados ni como autorizaciones para cambiar la mecánica.

## Bitácora de acciones — cada modificación de esta tanda

| Paso | Acción | Evidencia |
|---|---|---|
| A01 | Comprobar `main` y planes anteriores, además del estado de Forja 1.3.1 | Base `9c5d56e370035acf9fd51c92121b8dfef6cbb3ce`. |
| A02 | Leer directamente los 24 párrafos del `NaufragioD20DRS.docx` del proyecto y cotejar sus índices | Documento fuente con SHA-256 anterior; 15 Especies y 9 Ocupaciones. |
| A03 | Crear una rama específica sin alterar `main` | `docs/forja-1-4-propiedades-drs-20261101`. |
| A04 | Extraer 79 citas literales, sin resumir ni reinterpretar, y agruparlas en 24 etiquetas descriptivas | `docs/enciclopedia/110a-propiedades-literales-drs.json`, commit `03767c1d76d437cbd80b8cc1ea0e55777490b602`. |
| A05 | Construir verificador de 24 identidades, 24 huellas SHA, 79 citas y protección de publicación | `scripts/verificar-propiedades-talentos-drs.js`, commit `b6fd747b11cd8e4ef1492b410d52594df05bbf72`. |
| A06 | Incluir la verificación editorial dentro de las pruebas de la Forja | `tests/smoke.js`, commit `d9066e456dd70d5663ab9c0226795ca80944427f`. |
| A07 | Registrar informe, decisiones, asuntos pendientes y plan de comprobación | Este documento. |
| A08 | Ejecutar las suites CI y registrar resultados por su enlace | Pendiente hasta disponer de ejecución comprobada. |
| A09 | Fusionar únicamente tras CI satisfactorio; preservar el despliegue LIVE de 1.3.1 | Pendiente de decisión de integración. |

## Comprobación de seguridad editorial

- [x] 24/24 identidades del DRS.
- [x] 79 fragmentos coincidentes con la transcripción literaria cotejada.
- [x] Ningún valor numérico deducido ni propiedad mecánica añadida a datos de ejecución.
- [x] Ninguna exposición del índice en la lista blanca del producto público.
- [ ] Prueba CI del validador y regresión del generador.
- [ ] Comprobación CI del paquete público.
- [ ] Registro de PR/merge al cerrar.

**Continuación prevista:** revisión mecánica dirigida de los ocho asuntos anteriores, empezando por duplicaciones de Movimiento y el uso de Esfuerzo. Las decisiones nuevas requieren respaldo reglamentario concreto antes de incorporarse al motor.
