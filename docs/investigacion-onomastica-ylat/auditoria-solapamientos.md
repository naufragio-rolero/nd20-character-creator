# Conciliación de repertorios: 140 PNJ frente a los catálogos vigentes

**Fecha:** 2026-11-02. **Estado:** auditoría de lectura; no se modifican datos de producción.

## Fuentes comparadas

- [`dnd_npcs.xlsx`](https://drive.google.com/file/d/1B2YnVslAK7Sjd5ELYR9kteHB9Q-L4AWp/view): 140 nombres completos; 139 primeros componentes distintos.
- [`data/tesauro-ylat.json`](../../data/tesauro-ylat.json): 52 registros del ámbito Isla Tormenta, **19 documentados y 33 combinados**.
- [`data/nombres-historicos-ylat.json`](../../data/nombres-historicos-ylat.json): 1428 filas / 1422 formas únicas.
- [`data/especies.json`](../../data/especies.json): ocho fichas con **160 nombres de especie** (145 formas distintas al normalizar mayúsculas y diacríticos).
- [`data/sexo-personajes.json`](../../data/sexo-personajes.json): 49 nombres de referencia general en las dos listas de sexo. Su etiquetado es **editorial, no canon biográfico**.

La comparación aplica normalización para búsquedas (mayúsculas, espacios periféricos y diacríticos Unicode); **no** corrige, sustituye ni une las grafías originales. Las formas homónimas no prueban identidad.

## Resultado cuantitativo

| Repertorio | Coincidencias con los 140 PNJ | Lectura |
| --- | --- | --- |
| Tesauro vigente, 52 entradas | **4 nombres completos**, tras normalizar diacríticos | Todas las cuatro coincidencias son entradas tipo `documentado`. No implica cobertura completa de las biografías |
| Banco histórico, 1422 formas distintas | **16** nombres de pila + **2** segundos componentes distintos | El campo histórico mezcla funciones onomásticas en uso; sin categoría sistemática |
| Nombres de especies, 160 entradas / 145 distintas | **1** coincidencia con primer componente (**Daniel**); **0** nombres completos | No demuestra que los PNJ deban compartir nombre con repertorio de especie |
| Listas generales de sexo, 49 formas | **5** coincidencias con primer componente (**Jérémie, Gorgan, Abdul, Kutak, Lazare**) y **1** con nombre completo (**Kutak**) | No son pruebas de sexo ni etiquetas biográficas canónicas |

### Coincidencias concretas con el tesauro documentado

| Personaje en censo | Nombre en el tesauro | Tipo | ID en tesauro | Observación |
| --- | --- | --- | --- | --- |
| Gorgan Hueso de Sangre | Gorgan Hueso de Sangre | Documentado | `ylat-d041` | Nombre completo; «Hueso de Sangre» no es apellido familiar demostrado |
| Kutak | Kutak | Documentado | `ylat-d042` | Nombre único; no inferir cultura por forma |
| Lazare Brice | Lazare Brice | Documentado | `ylat-d045` | Nombre completo |
| Jérémie Alban | **Jeremie Alban** | Documentado | `ylat-d048` | **Variante de acento** entre el censo y el tesauro; coincidencia solo tras normalización, conservar ambas grafías |

Las cuatro entradas documentadas proceden en el tesauro de `Hilo Isla Tormenta 2019.pdf`; en esta sesión se ha comparado la metadata del JSON y los registros del Excel, **no se ha vuelto a revisar visualmente cada página del PDF**.

### Coincidencias con el banco histórico

Nombres de pila del censo (16): **Ciale, Essaetia, Bankingar, Tyvoz, Quaon, Roluj, Eman, Eld'mose, Inether, Ryn'Acki, Jaleba, Radinel, Adaldust, Oelmi, Naleale, Hiller**.

Segundos componentes del censo (2): **Iraldsay** y **Beld**.

**Conclusión:** la existencia de `Iraldsay` o `Beld` entre las formas históricas no autoriza tratar todo `Nombre.6` como una lista exclusiva de nombres de pila; tampoco prueba que cualquier entrada del banco sea apellido.

## Riesgos técnicos relacionados con nombres

- `assets/rules.js` usa `escoger(poolNombres,rng)`, después `sexoApi.elegirNombre(...,rng)` y otras operaciones de generación con un RNG compartido. Un sorteo adicional de apellidos puede cambiar otros resultados de una ficha para la misma semilla. **No tocar RNG ni código antes de diseñar prueba de regresión.**
- `assets/sex.js` usa `primerNombre(texto)` con segmentación en el primer espacio. Esto no puede usarse para reconstruir apellidos, ordinales o tradiciones como `del Atardecer Luciente`.
- Las 49 formas del catálogo de sexo son convenciones editoriales; no inferir sexo a partir de terminaciones o apellidos ni tratar estas coincidencias como validación canónica.
- La prohibición de reintroducir Niguace/Niguaze sigue rigiendo; ver [exclusión de corpus ajeno](../enciclopedia/127-exclusion-corpus-ajeno-ylat.md).

## Estado

**Fase III (reconciliación):** cubierta la comparación literal/normalizada de los 140 PNJ con cuatro catálogos y examinados los puntos de entrada de nombres en `assets/rules.js` y `assets/sex.js`. **No es auditoría exhaustiva de cada fuente de nombres existente en todas las expansiones**.

**Acción editorial propuesta:** mantener nomenclatura, genealogía, contexto y procedencia separados de los repertorios de generación hasta que se aprueben categorías y restricciones. [Propuesta sin código](propuesta-integracion-sin-codigo.md).
