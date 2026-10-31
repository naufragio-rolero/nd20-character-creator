# Integración mecánica controlada — primera tanda y decisiones del autor

**Fecha:** 30/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30`. **Estado:** integración parcial comprobada, sin modificar los originales.

## Qué se ha integrado realmente

Se ha añadido [un catálogo estructurado de 12 Conjuros](../../data/conjuros-magnitudes-literales.json) junto a un [evaluador puro](../../assets/spell-magnitudes.js). Calcula únicamente constantes, multiplicaciones por Nivel y topes explícitos; conserva `1d4`, `1d6` y otras expresiones de dados **sin lanzarlos**. Los resultados se muestran en las fichas emergentes de un personaje generado, identificando el Nivel usado, sin aplicar heridas, Salud, penalizaciones, consumo de Conjuros o Tiradas automáticamente.

| Conjuro | Magnitudes registradas | Límite conservado |
|---|---|---|
| Chispa curativa (64) | 1d4 de Salud | No efectúa curación en una ficha persistente |
| Dardo ígneo (98) | 1d6 de fuego | Exige éxito en Tirada de Conjuro |
| Caída de pluma (61) | Alcance 1 m por Nivel; evita daño por caída | Termina al aterrizar |
| Mano de mago (222) | Hasta 4 kg por Nivel, máximo 40 kg | Objeto inanimado; no lanzar ni utilizar como arma |
| Proyectil mágico (294) | Número de proyectiles = Nivel, 1d6 de fuerza cada uno | Los proyectiles no fallan, se reparten entre objetivos al alcance |
| Valentía (418) | +1 a Tiradas; duración 1d6 Turnos | No se tiran dados automáticamente |
| Vigor de coloso (429) | +2 a Tiradas de Fuerza; duración = Nivel Turnos | No altera el valor de Fuerza |
| Marcha de araña (231) | Movimiento × 0,5; duración = Nivel Turnos | No se inventa redondeo |
| Vigilia de muerte (428) | Salud pasa a 1 al activarse; duración = Nivel Turnos | Se extingue al activarse; tiene excepciones de causa de muerte |
| Arma elemental (26, duplicado literal 29) | 1d6 de daño adicional | Elegir elemento, no sumar dos veces por la duplicidad |
| Muro de fuerza (237) | 6 × 4 × 2 m; Nivel de bloqueo máximo 6 | Concentración y excepción de Proyectiles mágicos |
| Luz (219) | Iluminación 6 m / 1 h; Ceguera 1 Turno | Modalidades excluyentes; la Ceguera exige Tirada de Conjuro |

Estos campos están vinculados mediante el **ID del catálogo** y evidencias textuales de las 434 fichas revisadas. `tests/conjuros.js`, invocado desde `tests/smoke.js`, comprueba fuentes, magnitudes, límites y datos. GitHub Actions ejecuta el conjunto con permisos de lectura y sin despliegue.

**No confundir esta capa con un lanzador automático completo**: no se implementan efectos condicionados, ni gestión de Salud, ni consumo de Espacios, ni tiradas, ni decisiones del Cronista.

## Decisiones de autor prioritarias

**DEC-CONJ-01 — RESUELTA — Yugo de la muerte viviente (433).** Decisión aprobada: destrucción hasta Nivel 12 incluido; daño radiante desde Nivel 13. Redacción confirmada en [82a](82a-correcciones-confirmadas-conjuros.json) y aplicada al texto consultable de Forja. No se alteran los requisitos de Tirada.

**DEC-CONJ-02 — RESUELTA EN SU SECUENCIA — Revelar objeto maravilloso (356).** Tras lanzar durante 1 Intervalo, el arcanista estudia el objeto durante un descanso de ocho horas. La información mágica aparece paulatinamente, y al finalizar se identifica una propiedad. Se ha aplicado la redacción en [82a](82a-correcciones-confirmadas-conjuros.json). No se inventan etapas mecánicas intermedias.

**DEC-CONJ-03 — RESUELTA POR PRIORIDAD DEL DRS — Ira celestial (188).** El DRS confirma **Quinto Círculo**, Escuela Divina y 4d12 radiante. La variante C3 (`conjuro-154`) era una discrepancia de inventario sin respaldo del DRS y se ha retirado del catálogo seleccionable; queda la versión C5 (`conjuro-46`). Ver [82b](82b-conciliacion-drs-ira-celestial-y-surcar-tierra.md).

**DEC-CONJ-04 — RESUELTA — Surcar la tierra (385).** Se conserva el máximo de **4 m³** y se sustituyen los ejemplos incompatibles por un pozo rectangular de **1 × 1 × 4 m** y una cavidad de **2 × 2 × 1 m**. La corrección consta en [82a](82a-correcciones-confirmadas-conjuros.json) y se aplica solo a la ficha revisada.

**DEC-CONJ-05 — RESUELTA PARA CONJUROS — Fracciones por Nivel.** Por decisión del autor se redondea siempre **hacia abajo** en grupos completos de Niveles. La regla ya se emplea en las fichas de Telequinesis, Salmo de protección (respetando su mínimo +1) y Sifón de recuerdos. No se reescriben las excepciones expresas del DRS ajenas a esta integración.

Las seis propuestas espaciales de [77d](77d-segunda-pasada-erratas-geométricas.json) siguen en estado no aprobado, separadas de las diez correcciones aprobadas de 78a.

## Próximas implementaciones tras resolver dependencias

1. Ampliar datos mecánicos solo con fórmulas y condiciones verificables por la fuente; mantener marcas de efecto no automatizable cuando falte decisión.
2. Incorporar selección de modalidades y pruebas de condiciones donde el texto sea inequívoco, sin decidir Tiradas por el jugador.
3. Validar comportamiento de personajes reales, pruebas de regresión y experiencia de interfaz antes de fusionar en `main`.

**Propiedad editorial:** las decisiones 01–06 se han registrado en la capa funcional de Forja con los límites descritos en [84](84-resoluciones-mecanicas-conjuros.md). 04 (excavación) y 05 (redondeo) están aprobadas; la parte clara de 06 (tipos simultáneos, resistencia conjunta y debilidad ×2 única) también. Siguen pendientes las interacciones de resistencia parcial y resistencia + debilidad. Los lotes originales y Drive continúan intactos.
