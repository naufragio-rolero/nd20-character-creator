# Forja 1.0: núcleo DRS antes de ampliar el juego

**Decisión editorial:** 31/10/2026. **Ámbito:** Naufragio d20 Fantasía. **Fuente normativa:** `NaufragioD20DRS.docx`, por encima de los suplementos. **Estado:** objetivo adoptado, **no equivale a funcionalidad ya terminada**.

## 1. Producto básico del DRS

El primer objetivo de publicación son **las reglas íntegramente verificadas** de las tres familias del DRS:

| Familia | Entradas del DRS cotejadas con el documento | Incorporadas como datos base | Qué falta para afirmar «100 % terminado» |
|---|---:|---:|---|
| **Especies** | **8** | **8/8** nombres y perfiles en `data/especies.json` | Auditoría exhaustiva de requisitos, Salud, Movimiento, Talentos, restricciones y resultados reales en ficha |
| **Ocupaciones** | **4** | **4/4** nombres y perfiles en `data/ocupaciones.json`; cuatro progresiones con **30 Niveles** cada una | Validación de todas las elecciones, Talentos, competencias, equipo, progresiones, Conjuros y recursos, no solo presencia de la tabla |
| **Conjuros** | **64** con origen `Nd20` en `data/catalogo-poderes.json` | **64/64** consultables y **64/64** con magnitudes estructuradas (100 % de cobertura documental de magnitudes) | Cerrada la etapa de magnitudes; verificar preparación, lanzamiento y resolución de efectos permitidos por el DRS |

**La presencia en un catálogo NO es un indicador de cobertura mecánica completa.** No debe comunicarse que Especies u Ocupaciones están «al 100 %» solo porque sus ocho y cuatro registros existen. Del mismo modo, las 64 fichas de magnitudes de Conjuros no equivalen a 64 Conjuros lanzables automáticamente.

El DRS es la autoridad para Alcances, Círculos, listas de Ocupación y reglas conflictivas. Solo cuando sea silencioso se utiliza material documental suplementario, **sin convertirlo automáticamente en regla básica**.

## 2. Puerta de publicación

No se dará por finalizado el núcleo hasta cumplir simultáneamente:

1. **Especies:** 8/8 cotejadas contra el DRS, con pruebas de condiciones de acceso y efectos mecánicos que dependan de la Especie.
2. **Ocupaciones:** 4/4 cotejadas, incluyendo progresiones de Nivel 1 a 30, elecciones y concesiones correctas, recursos, competencias y equipo.
3. **Conjuros:** los 64 Conjuros DRS documentados, sus magnitudes verificadas y una decisión explícita sobre qué efectos se automatizan y cuáles quedan para el Cronista; nunca simular reglas ausentes.
4. **Integración:** modos Rápido y Personalizado, selección/preparación del Mago y Clérigo, copia/exportación y generación reproducible sin introducir contenido suplementario por error.
5. **Calidad:** pruebas automatizadas sin fallos, revisión manual del navegador en escritorio y móvil, reconciliación de datos y revisión editorial final. **Fusión y despliegue únicamente tras validación.**

Los tests [`tests/alcance-drs.js`](../../tests/alcance-drs.js) ya verifican la identidad de los 8+4+64, que las cuatro tablas tienen 30 filas y la generación de las **32 combinaciones Especie/Ocupación en los Niveles 1, 12 y 30** (**96 generaciones**). Son **pruebas de integridad**, no sustituyen la revisión normativa completa.

## 3. Alcance activo en la interfaz

La versión de Fantasía comienza con una única fuente habilitada: **DRS**. [`data/alcance-drs-y-dlc.json`](../../data/alcance-drs-y-dlc.json) fija la lista de fuentes autorizadas; `assets/app.js` solo muestra esas fuentes en el selector de Fantasía y la interfaz informa de los DLC posteriores.

Los contenidos extraídos y revisados en las ramas de desarrollo se **conservan** para no repetir el trabajo, pero **no entran en la selección de la edición básica**. Los demás sistemas ya presentes (CiFi, Nocturna y Dungeon Hack) conservan su funcionamiento de desarrollo: no se les atribuye, por ello, la certificación de la versión básica del DRS.

**Limitación de empaquetado:** el repositorio de desarrollo todavía incluye archivos JSON de ampliaciones y el navegador puede descargarlos para mantener los otros sistemas o el visor de consulta. El filtro de fuentes es un **control funcional de selección, no una separación física de paquetes publicados**. Antes de liberar una edición DRS autónoma hay que separar el contenido enviado a Pages del que pertenecerá a futuros DLC si se desea que estos se distribuyan de forma realmente independiente.

## 4. DLC gratuitos posteriores

Se prepararán pequeñas incorporaciones verificadas, versionadas y reversibles por procedencia, sin reescribir el DRS:

| Familia de ampliación | Material ya almacenado en la rama | Situación |
|---|---:|---|
| Nuevas Especies de Fantasía | **22** perfiles | Conservados; no publicados en el núcleo |
| Nuevas Ocupaciones de Fantasía | **33** perfiles, de «Nuevas Ocupaciones» y Ylat | Conservados; no publicados en el núcleo |
| Conjuros de suplementos | **369** entradas únicas adicionales a las 64 del DRS | Conservados en el catálogo; parte de sus magnitudes ya está trabajada |

Cada DLC debe tener identificación de fuente, pruebas independientes de compatibilidad, versión y documentación de cambios. **Siempre gratuito**, sin necesidad de cobrar, cuentas, licencias nuevas o compras dentro de Forja. El modo DRS debe seguir siendo utilizable sin ampliaciones.

No se ha fijado número de entregas ni fechas: saldrán cuando estén revisadas y listas. Los contenidos de CiFi y Nocturna tienen identidad propia como variantes del sistema; su futura política de publicación no se decide automáticamente al reorganizar Fantasía.

## 5. Qué ha cambiado y qué queda

**Actualización de cierre:** las 32 fichas mecánicas del DRS antes pendientes se han incorporado; los **64 Conjuros básicos** tienen ahora magnitudes documentales verificadas. La etapa de magnitudes está cerrada, pero la de lanzamiento y resolución íntegra sigue abierta. Véase [89](89-cierre-magnitudes-64-conjuros-drs.md).


- Manifiesto versionable en `data/alcance-drs-y-dlc.json`, con **8 Especies + 4 Ocupaciones + 64 Conjuros**.
- Selección de Fantasía filtrada a DRS, incluidos resultados aleatorios; la generación desde la interfaz no ofrece fuentes de DLC.
- CI con prueba de integridad de la base y 96 combinaciones de personajes.
- La **PR #4 permanece en borrador** y conserva los avances suplementarios para una posterior separación de entregables. **No fusionar como lanzamiento 1.0 en su estado actual**.
- Siguientes labores prioritarias: auditar mecánicas de Especies 8/8 y Ocupaciones 4/4, abordar por separado la ejecución de Conjuros y conciliar los archivos estáticos de publicación.

**Regla editorial:** no volver a aumentar la cantidad de Conjuros, Especies u Ocupaciones de suplementos durante el cierre del núcleo DRS. Los datos existentes no se destruyen y serán reutilizables cuando se aprueben DLC gratuitos.
