# Segundo lote mecánico: 41 Conjuros con magnitudes literales

**Fecha:** 31/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30`. **Situación:** desarrollo en PR #4, todavía sin fusionar ni publicar.

## Alcance y evidencias

- El archivo [`data/conjuros-magnitudes-literales.json`](../../data/conjuros-magnitudes-literales.json) incluye ahora **41 Conjuros distintos**, todos vinculados por `id_catalogo` a una ficha revisada del Tomo y con fragmentos de evidencia literales. Son **29 Conjuros más** que el primer lote de 12.
- El módulo [`assets/spell-magnitudes.js`](../../assets/spell-magnitudes.js) admite ahora **`dados_por_nivel`** cuando la fuente dice, sin ambigüedad, «1d8 por Nivel» o «2d12 por Nivel». Devuelve una expresión como `9d8` o `42d12` sin lanzar los dados.
- También se conservan constantes, duraciones, topes y escalados directos por Nivel. Las fichas emergentes muestran estas magnitudes al Nivel del personaje sin gestionar Salud, Tiradas, elección de objetivos, daño real ni estados en la ficha.
- La prueba [`tests/conjuros.js`](../../tests/conjuros.js) verifica las **434 fichas documentales**, las **12 correcciones aprobadas** (10 espaciales + 2 decisiones posteriores), las 41 evidencias exactas y el cálculo de todas las magnitudes en Niveles 1, 5, 10 y 30. El smoke general sigue cubriendo la generación de personajes.

## Segundo lote: Conjuros añadidos

| Familia documental | Conjuros | Tratamiento |
|---|---|---|
| Defensa, protección y duración | Adarga de hielo, Escudo, Resistencia al clima, Lienzo viviente, Fusión pétrea, Silencio | Blindaje, Tiradas, duraciones y distancias; los desencadenantes no se ejecutan solos |
| Restauración, estado y objetos | Aura de restauración, Convertir agua, Despertar de la vegetación, Plumaje de Sylestria, Purga tóxica, Sello rúnico: Vigilante | Valores de área, Salud, carga temporal, recursos o recuperación; no se simulan estados |
| Áreas y daño fijo en dados | Barrera eléctrica, Explosión sónica, Golpe de rayo, Ola salvaje, Rayo hielo, Rociada ardiente, Sangre hirviente, Tentáculos negros, Tridente flamígero, Tempestad vengativa, Trampa de fuego, Tajo carmesí de Nebb, Ventisca | Expresiones de daño sin resolver tiradas, éxito/fallo, reducción o geometría más allá del literal |
| Dados que crecen por Nivel | Destrucción, Hálito de ultratumba, Lanza de sombras, Relámpago | Fórmula de número de dados por Nivel, sin suponer resultado de ataque o clase de objetivo |

Esta clasificación sirve solo a la arquitectura de datos, **no altera las Escuelas o Categorías** del sistema.

## Hallazgo editorial nuevo: doble tipo de daño

**DEC-CONJ-06 — Pendiente de criterio autoral para automatización de resistencias y daño.**

Algunos Conjuros contienen un **único grupo numérico de dados** acompañado de dos tipos de daño, por ejemplo:

- **Aguijón impío (3):** «1d6 de daño por veneno e impío».
- **Hálito de ultratumba (183):** «1d6 de daño por veneno e impío por cada uno de tus Niveles».
- **Tentáculos negros (387):** «3d6 de daño contundente y mágico cada Turno».

En cambio, **Sangre hirviente (366)** declara explícitamente «3d8 ... por fuego **y** 3d8 ... impío», con **dos grupos numéricos distintos**, que se han representado por separado.

La lectura prudente para los primeros es **conservar literalmente un único bloque expresado de dados**, pero **sin decidir** si el daño se considera simultáneamente de ambos tipos, cómo se aplican resistencias o si debe dividirse. Esto **no equivale a aprobar una regla de daño compuesto**. El autor ha de fijar el criterio antes de programar la resolución de daño y resistencias.

## Decisiones que permanecen pendientes

- [DEC-CONJ-04: Surcar la tierra](82b-conciliacion-drs-ira-celestial-y-surcar-tierra.md): límite 4 m³ frente a dos ejemplos volumétricamente incompatibles.
- DEC-CONJ-05: redondeos en expresiones «cada 2/3/6 Niveles» que no declaran redondeo propio.
- DEC-CONJ-06: tipos de daño combinados sobre un grupo de dados.
- Las seis erratas espaciales aún no aprobadas [77d](77d-segunda-pasada-erratas-geométricas.json).

No se han reescrito las fuentes 69a–69r, ni Google Drive, ni se han fusionado cambios a `main`. La PR continúa en borrador.
