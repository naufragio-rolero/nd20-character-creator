# Integración funcional de Conjuros — consulta durante elecciones y 120 magnitudes

**Fecha:** 31/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30` · PR #4 en borrador. **Prioridad editorial:** el DRS y los textos originales del Tomo; no inventar efectos.

## Corrección funcional: «Ver ficha» antes de confirmar

El editor de elecciones mostraba «Ver ficha» para Conjuros pero sus magnitudes **no podían calcularse con el Nivel del personaje**, porque el visor solo buscaba `data-nivel` dentro de las tarjetas finales `.tarjeta`. Por ello, el personaje aún en preparación no obtenía los cálculos adaptados a su Nivel.

Ahora `assets/app.js` entrega al botón **el Nivel del borrador** mediante `data-glosa-nivel`. `assets/tooltip-ui.js` utiliza ese Nivel o, para fichas generadas, el de la tarjeta. La consulta sigue siendo informativa: no tira dados ni aplica daños.

Además, antes el selector buscaba por **nombre**, con posibilidad de tomar otra ficha homónima. El índice de `assets/tooltips.js` tiene ahora una búsqueda por **ID exacto**, `buscarPorId(indice,id,grupo,sistema)`, que solo devuelve una coincidencia cuando existe una identidad unívoca en el sistema y grupo pedidos. El botón guarda `data-glosa-id` de la opción seleccionada; para Conjuros no usa una alternativa por nombre si falla el ID. Se preserva el método por nombre para otras elecciones y para textos ya etiquetados de fichas generadas.

Pruebas nuevas: consulta exacta de *Mano de mago* a Nivel 7 (28 kg), ausencia de *Ira celestial* C3, origen e ID documental de *Glosolalia mayor †*, y negativa explícita si grupo, sistema o identificador no coinciden.

## Quinto lote: 100 → 120 Conjuros calculables

Añadidos **20 Conjuros**: Dormir, Dardo de penumbra, Detonación cadavérica, Destello aural, Deseo, Destello de Kaeduin, Descarga ardiente, Detención temporal, Espejo de sombras, Espía de la Urdimbre, Estallido de escarcha, Exhalación de la tumba, Fantasmas aullantes, Floración cinérea, Fuego feérico, Fuego lunar, Fuego purificador, Garra vampírica, Glosolalia mayor y Glosolalia menor.

Cada registro conserva `numero_tomo`, `id_catalogo`, una **evidencia literal cotejada** contra el Tomo, límites de aplicación y magnitudes que el motor puede calcular sin realizar Tiradas.

### Expresiones de dados

El motor ahora admite **d2, d3** y dados con bono entero como `1d6+1` o `1d4+2` cuando figuran en la fuente. El nuevo operador `dados_por_bloques` aplica `Math.floor(Nivel / tamaño_bloque)`, según decisión autoral de redondear hacia abajo, y devuelve una expresión como `3d6` para *Destello aural* a Nivel 7, o `2d8` para *Descarga ardiente* a Nivel 9.

**Importante:** si el Nivel queda por debajo del primer bloque y no se declara mínimo, el evaluador puede devolver `0d6`, una indicación de **cero dados del bloque**; no equivale a lanzar un dado de cero caras ni a imponer una curación o daño mínimo inventado. Todo sigue siendo informativo.

### Daño simultáneo

Se han añadido tres perfiles documentados de **un solo grupo de dados con dos tipos**: *Detonación cadavérica* (contundente e impío), *Exhalación de la tumba* (veneno y ácido) y *Fantasmas aullantes* (psíquico y contundente). Son ahora **ocho** perfiles en total. Resistir ambos tipos aplica una resistencia; dos debilidades no multiplican el daño por cuatro. La resistencia parcial y el cruce de vulnerabilidad con resistencia siguen sin ejecutarse sin reglas expresas.

## Estado verificable

| Categoría | Cobertura |
|---|---:|
| Fichas documentales consultables del Tomo | **434 / 434** |
| Conjuros únicos del catálogo (duplicado histórico `Arma elemental`) | **433** |
| Conjuros con magnitudes literales evaluables | **120** |
| Perfiles de daño simultáneo de dos tipos | **8** |
| Correcciones textuales aprobadas aplicadas solo en la capa de consulta | **13** |

La prueba [`tests/conjuros.js`](../../tests/conjuros.js) valida los 434 textos frente a sus fuentes originales, las 13 modificaciones editoriales autorizadas, las 120 correspondencias documentales, los resultados en Niveles 1, 5, 10 y 30, las operaciones especiales y los ocho daños mixtos. El CI ejecuta `node tests/smoke.js` y comprueba sintaxis.

**No implementado todavía:** simulación o lanzamiento real de los 433 Conjuros, resolución de Tiradas, consumo de Espacios, reparto de daño, cambios de Salud, invocaciones activas, resistencias ambiguas o automatización de efectos narrativos.

**Fuentes preservadas:** no se ha editado el documento maestro de Drive, las transcripciones históricas 69a–69r ni se ha fusionado la PR a `main`. La comprobación final de GitHub Actions se indica en la PR.
