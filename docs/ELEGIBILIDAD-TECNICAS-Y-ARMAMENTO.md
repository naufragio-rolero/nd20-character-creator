# La Forja — Elegibilidad de Técnicas y armamento (DRS)

**Estado:** implementada e integrada en `main` mediante [PR #80](https://github.com/naufragio-rolero/nd20-character-creator/pull/80), con cinco suites de CI superadas. **No publicada en LIVE.**  
**Fuente:** [Naufragio d20 DRS v1.1.12](https://docs.google.com/document/d/1W69x5V_982IGg2AL0TltZ200aSt2khXu_VCa7gMI3zY/edit), apartados «Competencias», «Técnicas de batalla» y las Ocupaciones Guerrero y Ladrón. La hoja de ruta original [Tanda 3](HOJA-RUTA-FORJA-TANDAS-2026-11.md) de redistribución de Atributos queda **descartada por decisión editorial**; esta mejora sustituye esa prioridad, no convierte la redistribución en regla.

## Adquisición de Técnicas

Las categorías permitidas siguen definidas por la Ocupación y su progresión: el Guerrero aprende Técnicas de cualquier categoría; el Ladrón, Disciplina y Trucos sucios. Una **Ocupación nombrada expresamente en el requisito de una Técnica** restringe quién puede **aprenderla**, aunque su categoría fuera accesible de forma general. Los términos de Ocupación se reconocen completos y separados del resto de requisitos; no se infieren clases a partir de nombres parciales.

- **Ataque sorpresa:** requisito DRS «Ladrón». Un Guerrero no puede aprenderla, aunque sea de Trucos sucios.
- **Rajar:** requisito DRS «Guerrero, Nivel 6+». Solo Guerrero puede aprenderla. **Nivel 6+ es requisito de uso**, por lo que no bloquea el aprendizaje antes de alcanzar ese Nivel. No se aplica una progresión ficticia.
- **Doble ataque:** requisito «Agilidad 8+». El requisito **VA** solo se comprueba **al usar** la Técnica; no impide aprenderla. El DRS también exige las condiciones de equipo/posición para usar otras Técnicas, no para adquirirlas.
- Las ampliaciones se siguen filtrando por fuente autorizada y categorías; las Técnicas exclusivas de Valquiria, Cronómaca y otras Ocupaciones no se transfieren a otra ocupación por compartir categoría. CiFi y Nocturna conservan sus políticas de distribución independientes.

**Recuento DRS:** Guerrero tiene nueve Técnicas aprendibles del catálogo base de diez; Ladrón conserva seis. No se alteran las plazas de progresión ni se introducen opciones no documentadas. La UI y el motor usan el mismo plan elegible, también en la revisión posterior de Talentos/Poderes.

## Requisitos estructurados de Técnicas — evolución del catálogo

**Primera migración: `tecnica-06` (Rajar) y `tecnica-09` (Ataque sorpresa).** No se ha cambiado la glosa literal DRS, el coste, la categoría, la fuente o la progresión de ninguna Técnica.

Las dos fichas añaden los campos opcionales `ocupaciones_permitidas` (lista de una o varias Ocupaciones autorizadas para **aprender**) y `requisitos_uso` (lista informativa de condiciones para **usar** la Técnica). En el caso de **Rajar** la segunda lista contiene `{"tipo":"nivel","minimo":6}`; en **Ataque sorpresa** está vacía. El campo `requisito` permanece íntegro como texto visible de fuente, no es sustituido por una regla generada.

- Si existe `ocupaciones_permitidas`, el motor utiliza esa lista para **elegibilidad al aprender**, con prioridad sobre el texto libre. Se admiten varias Ocupaciones y se siguen respetando las **categorías** que cada una puede aprender y las fuentes publicables. Listas vacías, malformadas o duplicadas provocan error: no conceden acceso accidental.
- Cuando una Técnica todavía no tiene el nuevo campo, el motor mantiene la interpretación anterior de los requisitos literales de Ocupación, sin exigir una migración masiva de los suplementos.
- `requisitos_uso` **no se evalúa para aprender** la Técnica ni automatiza el combate. El editor muestra el requisito original; el Cronista comprueba las condiciones de uso durante la partida. El esquema registra el Nivel mínimo de Rajar sin bloquear su aprendizaje en niveles anteriores.
- Para modificar qué Ocupaciones aprenden una Técnica ya migrada, editar la lista en `data/catalogo-poderes.json` y **actualizar también el texto `requisito` cuando cambie el reglamento**: ese texto continúa siendo la descripción visible y nunca debe quedar contradictorio. Para ampliar una nueva categoría u Ocupación deben seguir respetándose sus tablas de progreso y las fuentes autorizadas.
- La copia al paquete `dist/public-drs` conserva los campos de ambas Técnicas sin publicar las Técnicas inéditas de suplementos. El paquete y el motor se verifican mediante pruebas de regresión.

**Ejemplos vigentes:**

```json
{"id":"tecnica-06","nombre":"Rajar","requisito":"Guerrero, Nivel 6+",
 "ocupaciones_permitidas":["Guerrero"],
 "requisitos_uso":[{"tipo":"nivel","minimo":6}]}
{"id":"tecnica-09","nombre":"Ataque sorpresa","requisito":"Ladrón",
 "ocupaciones_permitidas":["Ladrón"],"requisitos_uso":[]}
```

## Compras e intercambios de armamento

El catálogo general `informacionEquipo()` mantiene todas las entradas y las advertencias de **uso sin Competencia**. El DRS no prohíbe adquirir o usar ese equipo: **utilizarlo sin Competencia causa Desventaja** conforme a «Competencias».

Sin embargo, por **usabilidad de La Forja**, los selectores de **Comprar armamento** y **Cambiar equipo inicial** ofrecen solo entradas con Competencia confirmada. El filtro compartido `opcionesCompraCompetentes()` incorpora Ocupación, Nivel y Especie, y se utiliza tanto por la interfaz como por las operaciones de economía `comprarArmamentoFantasia()` e `intercambiarEquipoInicial()`. Una selección manipulada no puede esquivar el motor. La prohibición de compra es exclusivamente una decisión de la aplicación, **no una nueva regla DRS**.

- Clérigo: equipo compatible con Competencias romas y armaduras permitidas; armaduras pesadas solo desde Nivel 12.
- Guerrero: armas convencionales y armaduras; las varitas de defensa requieren Competencia explícita y **no** se conceden por «cualquier arma».
- Mago: bastón, daga, honda, varitas de defensa y protecciones que permita el DRS; no se ofrecen armas y armaduras incompatibles.
- Ladrón: armas y protecciones documentadas, sin escudos; la competencia con varitas comienza en Nivel 6.
- Baja estatura: no elimina la adaptación del equipo ni relaja la restricción de escudos pequeños.

Munición se mantiene como artículo comprable: no se convierte en una Competencia nueva. Las compras legales siguen respetando dinero, unidades máximas, monturas y equipo ya poseído.

## Verificación

`tests/elegibilidad-tecnicas-armamento.js` verifica todos los niveles característicos, la exclusión de Ataque sorpresa del Guerrero, la conservación de Rajar como Técnica aprendible, la ausencia de Técnicas exclusivas del DLC de otras Ocupaciones, el catálogo informativo, la tienda y el rechazo de compras/intercambios sin Competencia mediante llamadas directas al motor.

`tests/alcance-drs.js` protege los recuentos DRS y la frontera entre regla de uso y adquisición; `tests/smoke.js` incorpora las regresiones. Las suites de navegador y paquete público deben completar la validación antes de integrar. **No cambiar el SHA aprobado de LIVE ni ejecutar despliegues** en esta tarea.
