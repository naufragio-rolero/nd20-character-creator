# Integración de la onomástica validada de Ylat en La Forja

**Fecha:** 2026-11-02. **Origen editorial:** [investigación y acta de 14 ONO resueltas](https://github.com/naufragio-rolero/nd20-character-creator/blob/research/onomastica-ylat-2026-11/docs/investigacion-onomastica-ylat/acta-decisiones-autoria-2026-11-02.md). **Rama de implementación:** `feat/forja-onomastica-ylat-validada-20261102`.

## Qué se ha incorporado

1. **Archivo verificable `data/onomastica-ylat.json`:** contiene las **297 formas literales distintas** del índice de investigación, cada una con código, clase documental, identificador de los anexos de origen y advertencia cuando existe. **No son 297 personas ni 297 nombres nuevos para el sorteo público.** Se preservan variantes, homonimias, borradores y títulos tal como figuran en sus testimonios.
2. **Canon de autoría:** conserva las formas preferidas Aerandil del Atardecer Brillante, Vrymmir Borgernstâg, Car'rt Oq'uatee, Eomdyn Noreesh, Leezar Lockbruck, Alim de Mostáganem, Janus II Achgate y Narga Solarys; Saewig **Rowes Ylat¹ / Shadelgast Ylat³**. Registra **Dyeld como padre de Tuliëlle** y a **Leezar y Thingrim Lockbruck como hermanos**. Las grafías anteriores siguen auditables; no se editan biografías publicadas.
3. **ONO-04: ponderación muy baja de apellidos de casa:** `data/tesauro-ylat.json` conserva las **52 entradas**, incluidas las 19 documentadas y las 33 propuestas combinadas. Solo las **siete combinaciones que asignan Boll o Shadelgast sin filiación explícita** reciben `peso_relativo: 1`; las otras 26 combinaciones tienen `peso_relativo: 100`. La elección es **proporcional al peso** dentro del conjunto elegible, no una afirmación de que sea «el 1% de los nombres». Con todos los 33 disponibles, las siete forman **7 de 2607 unidades**, aproximadamente **0,27% agregado**. Los filtros de sexo editorial pueden modificar el denominador.
4. **ONO-05:** en las propuestas de nombres combinados no se añade ningún filtro por cronología o por Ylat¹/Ylat³/Ylat⁴. Las realidades sí permanecen en los testimonios de consulta; no se fusionan personas como resultado de compartir nombre.
5. **ONO-06:** la convención eladrín permanece en los documentos de investigación y **no se usa** para construir sufijos ni reglas nuevas.
6. **ONO-13:** se conservan expresamente **Máthair Felsaer**, montaña, y **Pietro**, oso de una jugadora, y todas las combinaciones del tesauro. No se excluyen por el tipo de entidad ni se reetiquetan como personas canónicas.

## Separación deliberada de consulta y generación

El **archivo de 297 denominaciones es solo documental en esta entrega**: no se añade un selector de personas históricas ni se convierte una ficha de borrador, deidad, topónimo o nombre de lugar en un personaje sorteable. La Forja mantiene sus modos `historico`, `documentado`, `combinado` y `especie`; el **cambio funcional se limita a ponderar las 33 variantes existentes** en `combinado`.

Es una limitación **intencionada** de integración: el empaquetador público DRS únicamente publica las **33 variantes combinadas** del tesauro, no las fichas `documentado` de personajes. El archivo `data/onomastica-ylat.json` **no se añade al paquete público**, para no eludir esa protección ni introducir accidentalmente material de campañas, realidades u obras en borrador. Queda a disposición del repositorio de desarrollo como base trazable para una futura vista de consulta aprobada.

## Implementación y estabilidad

- En `assets/sex.js`, `elegirPonderado` usa el `peso_relativo` cuando existe (100 por defecto) y **consume una sola llamada** al generador aleatorio. La ruta de selección que filtra por sexo editorial utiliza la misma ponderación.
- En `assets/rules.js`, la ruta de `combinado` que selecciona sin sexo editorial también usa `elegirPonderado`.
- El comportamiento con `historico`, `documentado`, `especie` y **nombre manual** permanece sin cambios voluntarios. Las siete propuestas de apellido noble siguen etiquetadas como **combinaciones no canónicas**, nunca como descendientes históricos.
- Se añade `tests/onomastica-ylat.js` y se incorpora al ciclo `tests/smoke.js`: recuento 297, fuentes, ONO, conservación de 19/33, pesos 1:100, determinismo y nombre manual.

## Limitaciones y seguimiento

- La cifra relativa 1:100 es una **elección técnica de implementación** del criterio cualitativo «muy bajo» aprobado por la autoría, no una regla cultural, porcentaje de nacimiento noble, canon ni una nueva tradición de Ylat.
- No se inventan nuevos nombres, relaciones o apellidos; las denominaciones se copian de las fuentes auditadas.
- No hay modificación de poderes, equipo, combate, fichas de especie/ocupación, reglas d20, CiFi o Nocturna.
- El objetivo es **integración controlada**, no cambiar automáticamente los 1422 nombres únicos del banco histórico.
