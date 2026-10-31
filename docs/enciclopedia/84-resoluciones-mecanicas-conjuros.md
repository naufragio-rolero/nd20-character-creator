# Resoluciones de Conjuros aprobadas e integradas en Forja

**Fecha:** 31 de octubre de 2026. **Estado:** decisiones de autor incorporadas en la PR #4; pruebas automatizadas realizadas; sin desplegar ni fusionar.

## DEC-CONJ-04 — Surcar la tierra: máximo 4 m³

El texto original (Conjuro 385, lote 69p) declara una excavación máxima de **4 metros cúbicos**, pero describe ejemplos de tamaño superior. El autor ha autorizado elegir la solución más coherente. Se **conserva el máximo 4 m³** y solo se cambian los ejemplos en la ficha consultable:

- **Pozo rectangular:** 1 m ancho × 1 m largo × 4 m profundidad = **4 m³**.
- **Cavidad superficial rectangular:** 2 m ancho × 2 m largo × 1 m profundidad = **4 m³**.

No se modifica el Alcance (10 metros), el material manipulable (tierra, barro o arena), el veto a la roca sólida ni la disposición de tierra excavada. El cambio literal está en [82a](82a-correcciones-confirmadas-conjuros.json); la fuente 69p y Google Drive quedan intactos. La ficha estructurada incluye volumen máximo y ambos ejemplos.

## DEC-CONJ-05 — Redondeos hacia abajo

**Regla autoral:** las divisiones y escalados «por cada N Niveles» de estos Conjuros se redondean **siempre hacia abajo**, es decir, se usa la cantidad de bloques completos `Math.floor(Nivel/N)`. Los mínimos explícitos siguen vigentes. Se añade el motor de operadores `por_cada_n_niveles` y `base_mas_por_cada_n_niveles`, sin tocar tiradas ni dados.

Ejemplos cotejados y cubiertos por las pruebas:

| Conjuro | Nivel | Resultado |
|---|---:|---|
| **Telequinesis**: 1 objeto/2 Niveles | 5 | **2 objetos** |
| **Telequinesis**: 100 kg/4 Niveles | 7 | **100 kg** |
| **Telequinesis**: 100 kg/4 Niveles | 8 | **200 kg** |
| **Sifón de recuerdos**: Turno inicial +1/3 Niveles | 8 | **3 Turnos** |
| **Salmo de protección**: +1 Blindaje/6 Niveles (mínimo +1) | 5 | **+1 Blindaje** |
| **Salmo de protección**: +1 Blindaje/6 Niveles (mínimo +1) | 12 | **+2 Blindaje** |

**Alcance:** esta implementación aplica la decisión a las expresiones de Conjuros. El DRS tiene algunas fórmulas ajenas a estos Conjuros que dicen explícitamente «redondeando hacia arriba»; no se han alterado silenciosamente esos apartados del manual. Si la convención se extendiera a todo el juego, habría que reconciliar esas excepciones por separado.

## DEC-CONJ-06 — Daño de doble tipo, una sola reserva de dados

**Regla autoral aprobada:** cuando una sola expresión de dados dice «daño de X e Y», el mismo resultado inflige **ambos tipos simultáneamente**, no dos daños independientes. Si la víctima resiste **ambos tipos**, cuenta como **una única resistencia**. Si sufre el doble por una debilidad, el resultado se multiplica **solo por 2**, incluso si es débil a ambos tipos.

La capa [`data/conjuros-danio-compuesto.json`](../../data/conjuros-danio-compuesto.json) registra y coteja:
- *Aguijón impío* (3), 1d6 veneno **e** impío.
- *Hálito de ultratumba* (183), 1d6 por Nivel veneno **e** impío.
- *Tentáculos negros* (387), 3d6 contundente **y** mágico por Turno.

**No confundir** estos perfiles con *Sangre hirviente* (366), que dice expresamente **3d8 de fuego y 3d8 de impío**, es decir, dos grupos de dados distintos que se resuelven por separado.

El evaluador [`assets/spell-magnitudes.js`](../../assets/spell-magnitudes.js) distingue `resistencia_unica`, `multiplicador_debilidad`, `resistencia_parcial_pendiente` y `conflicto_resistencia_debilidad`. No asume cuánto reduce una resistencia en términos de Salud, ni decide por su cuenta qué ocurre cuando se resiste solo uno de los dos elementos o cuando coexisten resistencia y debilidad. Se muestra una advertencia en las fichas para esos casos.

## Cobertura y comprobaciones

- **434/434** fichas del Tomo disponibles para consulta.
- **45 Conjuros** con magnitudes declarativas verificadas por la fuente, incluidos ahora *Surcar la tierra*, *Salmo de protección*, *Sifón de recuerdos* y *Telequinesis*.
- **3 perfiles** de daño compuesto en bloque único, además de los 45 registros de magnitudes (dos se solapan: *Hálito de ultratumba* y *Tentáculos negros*).
- **13 modificaciones textuales aprobadas** en las fichas de consulta (10 correcciones geométricas previas, 2 decisiones de lanzamiento/umbral y esta resolución de excavación). Los originales siguen intactos.
- Pruebas en [`tests/conjuros.js`](../../tests/conjuros.js) para casos límite de redondeo, 4 m³ exactos, resistencias dobles no acumuladas y vulnerabilidades ×2 y no ×4; ejecución vía `node tests/smoke.js` en GitHub Actions.

**Fuera del alcance:** lanzamientos reales de Conjuros, restas de Salud, decisiones del Cronista, edición de maestros en Drive, publicación en GitHub Pages o fusión de la PR. Se preserva la integridad de las fuentes originales.
