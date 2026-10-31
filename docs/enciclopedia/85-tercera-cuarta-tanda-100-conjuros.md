# Integración de Conjuros en Forja — 100 fichas mecánicas declarativas

**Fecha de actualización:** 31/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30` (PR #4, todavía en borrador). Este documento registra implementación y controles, **no una ampliación de reglas**.

## Estado comprobable

| Capa | Registros | Alcance |
|---|---:|---|
| Fichas literales y editoriales consultables | **434** | Textos cotejados con los 18 lotes originales; 13 cambios editoriales aprobados en capa separada |
| Conjuros únicos del catálogo seleccionable | **433** | `Arma elemental` aparece dos veces en el Tomo; `Ira celestial` C3 carecía de respaldo DRS y se retiró |
| Conjuros con magnitudes estructuradas | **100** | 12 iniciales +29 +4 +35 +20 |
| Perfiles de daño simultáneo de dos tipos | **5** | `Aguijón impío`, `Aliento de agonía`, `Erupción`, `Hálito de ultratumba` y `Tentáculos negros` |

El catálogo mecánico es [`data/conjuros-magnitudes-literales.json`](../../data/conjuros-magnitudes-literales.json); sus referencias `id_catalogo`, `numero_tomo` y `evidencia_literal` deben mantenerse alineadas con las [fichas del Tomo](../../data/conjuros-revisados-001-225.json). Las 35 entradas nuevas del tercer lote incluyen Acelerar, Aguijón impío, Albor de la vida, Aliento de agonía, varias invocaciones, Ancla sombría, Apagallamas, Bola de fuego, Bravura, Cadena de relámpagos, Controlar los vientos y Cúpula antimagia, entre otras.

El siguiente lote de 20 añade Cañón aural, Disipar magia, Disco celeste de Excelsus, Detectar lo invisible, Descarga de debilidad, Detectar la mentira, Doble ilusorio, Detectar trampas, Eclipse del artefacto, Estrépito, Ecos de decadencia, Enjambre voraz, Esfera corrosiva, Encandilamiento, Esfera vital, Eternidad arcana, Explosión arcana, Erupción, Endeblez y Embozo de sombras.

## Criterios aplicados

- **Dados:** se conservan expresiones `NdX`, incluidos los dados que aumentan por Nivel, sin tiradas ni simulación de resultados.
- **Niveles y redondeos:** se aplican multiplicaciones, topes y grupos completos redondeados hacia abajo según decisión del autor; sin inventar una duración mínima cuando la fuente no la define.
- **Modalidades o condiciones:** `Esfera corrosiva` guarda por separado `3d12` si la Tirada tiene éxito y `3d6` si falla, **sin sumarlos**; `Bola de fuego` contiene `1d6` de fuego por Nivel y la condición literal de mitad de daño al fallar, sin determinar objetivos ni resolver daños.
- **Magnitudes no exactas:** `Disco celeste de Excelsus` dice «unos 300 kg»; se almacena como **carga aproximada**, no como límite estricto universal.
- **Daño de dos tipos:** `Erupción` dice `2d6` de daño contundente **y** por fuego por Nivel. Se representa con **un único grupo** que afecta con los dos tipos al mismo tiempo; se aplica solo una resistencia cuando se resisten ambos y la debilidad duplica el daño una vez. Los cruces no definidos de defensas siguen siendo decisión del Cronista.
- **Invocaciones:** las cantidades máximas de criaturas activas se conservan sin crear criaturas, consumir Espacios de Conjuro ni gestionar su Salud.
- **Áreas y volúmenes:** se respeta la unidad exacta de la fuente. Por ejemplo, Disipar magia indica `6m cúbicos` y Explosión arcana indica `6m2`; no se convierten en radios supuestos.

## Pruebas y límites

[`tests/conjuros.js`](../../tests/conjuros.js) coteja las 434 fichas, verifica la capa de 13 cambios editoriales, conecta los Conjuros con los IDs de catálogo y prueba cada registro mecánico en los Niveles 1, 5, 10 y 30. Incluye pruebas específicas para fórmulas, daños diferenciados de éxito y fallo, redondeos, topes, geometrías, duplicados de procedencia y daño dual con resistencia única y debilidad no acumulable.

Los cambios se validan en GitHub Actions mediante `node tests/smoke.js`; este informe no sustituye a un resultado de CI del commit actual.

**No está terminado un motor que lance los 433 Conjuros:** no se automatizan aún las Tiradas, impacto, daño efectivo, resistencias parciales, estados, invocaciones, límites de objetivos, consumo de recursos, concentración, duración activa o interacción con el tablero. Los efectos no claros siguen sin interpretación mecánica.

**Fuentes originales intactas:** ningún documento maestro de Drive ni lote de transcripción 69a–69r ha sido modificado, y la PR #4 no está fusionada en `main`.
