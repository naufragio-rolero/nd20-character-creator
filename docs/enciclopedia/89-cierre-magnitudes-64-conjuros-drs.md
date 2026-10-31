# Cierre de la cobertura de magnitudes de los 64 Conjuros del DRS

**Fecha:** 31 de octubre de 2026. **Alcance:** Forja 1.0, Naufragio d20 Fantasía, DRS. **Estado:** fase de documentación y magnitudes estructuradas **completa**; lanzamiento y resolución efectiva **no completados**. Rama `feat/forja-conjuros-fichas-2026-10-30`, PR #4 en borrador.

## Resultado y fuentes

Se ha contrastado el catálogo con `NaufragioD20DRS.docx`, usado como autoridad normativa. Los textos de consulta siguen en los dos JSON de fichas revisadas del Tomo, cotejados con el DRS. Los archivos de procedencia y el propio DRS **no se han alterado**.

| Métrica | Resultado |
|---|---:|
| Conjuros básicos del DRS | **64** |
| Ya estructurados antes de esta tanda | **32** |
| Nuevas fichas de magnitudes DRS | **32** |
| **Cobertura final del núcleo DRS** | **64/64 — 100 %** |
| Conjuros DRS pendientes de esta fase | **0** |
| Conjuros con magnitudes en todo el repositorio (incluidos suplementos preservados) | **202** |
| Perfiles de daño simultáneo de dos tipos en todo el repositorio | **11** |

Los 64 registros tienen `id_catalogo`, `numero_tomo`, nombre, `evidencia_literal` cotejada y una o varias magnitudes que el evaluador puede presentar sin lanzar dados. **100 % de magnitudes estructuradas no significa 100 % de funcionalidad mágica.**

## 32 Conjuros incorporados por Círculo

- **Primer Círculo (2):** Atraer muertos vivientes, Detectar magia.
- **Segundo Círculo (6):** Apertura arcana, Calentar metal, Charco de aceite, Curación, Resistir los elementos, Toque eléctrico.
- **Tercer Círculo (2):** Poza hedionda, Quitar maldición.
- **Cuarto Círculo (6):** Contrato de fraternidad, Hablar con las plantas, Piel de piedra, Polimorfia, Prelación, Tormenta de espadas.
- **Quinto Círculo (5):** Atravesar paredes, Crear muertos vivientes, Forja arcana, Orbe elemental, Transfusión de dolor.
- **Sexto Círculo (4):** Petrificar, Protección contra la muerte, Rayo solar, Recuperación divina.
- **Séptimo Círculo (3):** Control climático, Niebla carmesí, Sino del Segador.
- **Octavo Círculo (4):** Alterar el ser, Palabra de Poder: Muerte, Resurrección, Viaje espaciotemporal.

## Criterios verificados para no inventar reglas

**Daño, curación y redondeo.** *Curación* declara 2d6 por cada 5 Niveles: el evaluador aplica el redondeo inferior aprobado, sin inventar un mínimo. Por ello devuelve `0d6` por debajo de Nivel 5; **eso es la representación de cero bloques completos, no una tirada de daño o Salud**. *Toque eléctrico* tiene resultados distintos según éxito (2d8 de relámpago) o fallo (1d6 de fuerza); no se suman. *Rayo solar* tiene **dos grupos de dados**: 5d6 fuego y 5d6 radiante. *Recuperación divina* suma 1d12 y la mitad de la Salud máxima del objetivo: la mitad se registra como factor porque exige conocer la ficha afectada.

**Daño de doble tipo.** *Tormenta de espadas* expresa **un grupo de 1d8 mágico y cortante**, pleno al superar la Tirada de Conjuro y la mitad al fallarla. Se suma al registro de perfiles duales y respeta la decisión autoral de una sola resistencia si se resisten ambos tipos, y un solo ×2 en vulnerabilidad. **No se trata como dos tiradas separadas**, a diferencia de Rayo solar.

**Objetivos y requisitos.** *Polimorfia* escala su duración con el Nivel del **lanzador**, pero el límite del Nivel de la nueva forma depende del **objetivo**: no se calcula el segundo usando erróneamente el Nivel del lanzador. *Crear muertos vivientes* distingue el máximo de criaturas igual al Nivel y la reserva de Niveles repartibles, sin generar estadísticas inventadas. *Resurrección* exige cadáver fallecido como máximo 48 horas antes, lanzamiento de 4 horas, regeneración `1d6` semanas y pérdida de un Nivel; no modifica automáticamente al personaje. *Viaje espaciotemporal* admite 4 acompañantes adicionales como máximo y requiere el acuerdo narrativo de la mesa para su utilización.

**Ambigüedades fuente.** El «cono, de 10m2 de diámetro» de *Niebla carmesí* mezcla unidades dimensionales: no se transforma arbitrariamente en radio o superficie. La profundidad de *Atravesar paredes* se conserva como `1d4 × 3`, separando el dado y el factor sin tirar dados. Las erratas no aprobadas permanecen en la capa documental y fuera de automatizaciones nuevas.

**Conjuros cualitativos.** *Detectar magia*, *Atraer muertos vivientes*, *Petrificar*, *Alterar el ser*, *Transfusión de dolor* y otros Conjuros incluyen magnitudes declarativas de alcance, duración, lanzamiento o límites, pero **no simulan sus efectos narrativos**. No se falsea la aplicación automática de muerte, resurrección, alteraciones de Especie, movimiento, invocaciones, magia o estados.

## Verificación e integridad

- [`data/conjuros-magnitudes-literales.json`](../../data/conjuros-magnitudes-literales.json): **202** registros, 64 identificados como DRS y sin repeticiones de `id_catalogo`.
- [`data/alcance-drs-y-dlc.json`](../../data/alcance-drs-y-dlc.json): manifiesto con **64/64** Conjuros básicos con magnitudes y **0** pendientes en esta fase.
- [`tests/alcance-drs.js`](../../tests/alcance-drs.js): controla las 32 fichas nuevas y la trazabilidad de **cada uno de los 64 Conjuros** con el texto revisado; evalúa todos en Niveles 1, 5, 10 y 30, además de casos límite concretos.
- [`tests/conjuros.js`](../../tests/conjuros.js): revisa la integridad de las 202 magnitudes, los 11 perfiles de daño compuesto, las correcciones editoriales aprobadas y los 433 IDs únicos del catálogo.
- GitHub Actions ejecuta `node tests/smoke.js`, incluidas las pruebas DRS; el estado de validación se consulta en la PR.

## Lo siguiente en Forja 1.0

Falta verificar las reglas completas de las **8 Especies** y **4 Ocupaciones** del DRS, y abordar como trabajo distinto la ejecución de lanzamiento, consumo y preparación de Conjuros, las Tiradas que corresponden a jugadores, la aplicación de Salud y estados, y pruebas visuales en navegador. La fase de **magnitudes de los 64 Conjuros** sí se considera completada.

**No se han fusionado cambios ni publicado la nueva versión.** Se preservan los Conjuros suplementarios existentes para DLC gratuitos posteriores.
