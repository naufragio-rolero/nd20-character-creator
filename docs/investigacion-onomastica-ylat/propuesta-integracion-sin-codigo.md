# Especificación de integración onomástica — propuesta NO aprobada

**Fecha:** 2026-11-02  
**Estado:** diseño editorial/técnico para revisión; **no implementar, publicar ni activar con este documento**.  
**Ámbito:** La Forja del repositorio `naufragio-rolero/nd20-character-creator`.  
**Base:** [censo de 140 PNJ](censo-pnj-historico.md), [clasificación de sus 97 segundos componentes](clasificacion-segundos-componentes.md), [familias acreditadas](familias-acreditadas.md), [catálogo de fuentes](catalogo-provisional.md) y [exclusión de corpus ajeno](../enciclopedia/127-exclusion-corpus-ajeno-ylat.md).

## 1. Estado comprobado del generador (rama principal, lectura 2026-11-02)

- `data/nombres-historicos-ylat.json`: 1428 filas, 1422 formas únicas. La política del propio archivo no identifica sexo, cultura, linaje, especie ni identidad documentada; **no convertir esas formas en apellidos por su apariencia**.
- `data/tesauro-ylat.json`: 52 registros activos, de los cuales 19 son documentados y 33 combinados, delimitados al corpus Isla Tormenta. **Niguace/Niguaze sigue explícitamente excluido**, sin reconsideración.
- `assets/rules.js`, dentro de `crearNd20`, elige primero una entrada del repertorio con `escoger(poolNombres,rng)`, después invoca `sexoApi.elegirNombre(...,rng)` cuando hay catálogo de sexo; finalmente selecciona una forma de nombre como **cadena completa**. El mismo `rng` se utiliza en más pasos de generación.
- `assets/rules.js` expone `hash` y `aleatorioSemilla` basados en una semilla. **Añadir una extracción aleatoria más sobre el RNG compartido puede alterar los resultados posteriores de una misma semilla**; debe evitarse si la identidad va a ampliarse.
- `assets/sex.js` contiene `primerNombre(texto)`, que retira algunos tratamientos y parte por espacios, y `nombresEspecie()` usa listas femeninas para filtrar formas por descarte. **No interpretar esas rutinas como parser acreditado de apellidos ni como fuente de clasificación documental de personajes**.
- `assets/repertorios.js` edita repertorios como arrays de cadenas para las categorías existentes. Una futura ficha de nomenclatura rica en relaciones y fuentes no se debe reducir a ese formato sin preservar metadata.

## 2. Registro de evidencia, separado del repertorio generable

**Propuesta de atributos de investigación, no nuevo canon:**

| Campo lógico | Descripción | Ejemplo o precaución documental |
| --- | --- | --- |
| Identificador interno estable | Identidad del registro independientemente de variantes | `crujidor` en los dos Excel, aunque cambia el nombre visible |
| Forma literal en cada fuente | Transcripción fiel con diacríticos, espacios y ordinales | Vrymmir Borgenrstâg / Vrymmir Borgernstâg |
| Función acreditada | Nombre de pila, apellido familiar, nombre completo, título, alias, apellido individual o función no demostrada | «Violatesoros» está explícitamente descrito como apodo |
| Titular / personaje | Persona o personaje al que corresponde | Jaleba Inversa; apellido «Inversa» explícito **para Jaleba**, no como serie libre |
| Familia / casa de pertenencia | Relación organizativa distinta de llevar el apellido de la casa | Casa Lobeth incluye Mashera Skara |
| Familia nominal heredada | Vínculo acreditado para el apellido del propio personaje, si existe | Lobeth, Iraldsay, Vardamir y otros |
| Realidad / época | Guardar cuando fuente lo declara, sin inferir | Tegku: `Ylat⁴`; numerosos PNJ: `Ylat¹`; Gylran: antiguo |
| Fuente y localizador | URL o documento, sección, campo, ID, página si existe | `dnd_npcs.xlsx`, columna `surname`; biografía individual |
| Autoridad editorial de la fuente | Rectora, ficha específica, artículo publicado, material de campaña, borrador, conversación | Un formulario de campaña no canoniza por sí solo un apellido |
| Conflicto de grafía o canon | No sobrescribir un testimonio con otro | Aerandil Brillante/Refulgente; Dyeld/Eldburg |
| Habilitación para generación | **Valor independiente**, inicialmente `no` para entradas nuevas | Documentar una forma no significa autorizarla como componente aleatorio |

Esta estructura es únicamente propuesta de ingeniería; el vocabulario definitivo puede adaptarse al modelo de datos real cuando se apruebe.

## 3. Propuesta conservadora de comportamiento

**Sin intervención del usuario ni autorización editorial, no añadir un apellido aleatorio.** Mantener el nombre que La Forja genere hoy.

Para una eventual función opcional de nombre y apellido:

1. Tomar como entrada **componentes documentados y tipificados**, no dividir arbitrariamente nombres históricos de varias palabras ni descomponer epítetos.
2. Si se selecciona una **familia específica**, mostrar solo formas cuyo uso en esa relación y época resulte autorizado editorialmente. Un apellido noble o dinástico no debe distribuirse entre personajes no vinculados.
3. Cuando una tradición dependa del **orden de nacimiento**, como en la nota de Erklan, exigir dicho orden y el linaje; el corpus solo documenta tres formas de sufijo, y la de Aerandil tiene variantes en conflicto. **No inventar otros órdenes**.
4. El usuario puede mantener o escribir un **nombre completo manual**; no partirlo para inferir sexo, cultura, linaje o apellido.
5. Si una opción carece de documentación sobre apellido, conservar nombre sin apellido o marcar campo «sin documentación», sin inventar alternativa.
6. Un nombre histórico o un apellido de una casa disuelta puede permanecer consultable como **personaje real del corpus** y, a la vez, estar excluido del repertorio de combinaciones automáticas.
7. Respetar la distinción entre **pertenencia familiar**, **apellido usado** y **alias mostrado**. Un caso de adopción como Alim de Mostaganem no justifica renombrar a Alim Orovecchio.

## 4. Aleatoriedad y compatibilidad

El sistema comparte un generador pseudoaleatorio para nombre y otras características. Para **cualquier futura generación adicional de apellido**, proponer una derivación independiente y etiquetada de la misma semilla (dominio de nombre), en lugar de consumir nuevas extracciones del `rng` compartido. Así se podrá conservar la secuencia de tiradas de atributos, equipo y otros resultados; la forma exacta debe validarse con pruebas antes de escribir código.

La misma semilla y configuración deben reproducir el mismo resultado, sin depender del orden incidental de las fuentes; usar identidades estables y orden de repertorio fijado. Si la semilla de origen no está disponible de modo explícito en el ámbito que recibe el nombre, la integración debe esperar a un diseño compatible. **No hay implementación ni pruebas ejecutadas de esta propuesta**.

## 5. Pruebas que habrá que especificar antes de integrar

- **Fuentes:** ningún nombre ni componente externo excluido se reintroduce, ni siquiera por coincidencia parcial o por estar en una carpeta llamada Ylat.
- **Combinación:** una casa sin vínculo seleccionado no genera su apellido; no concatenar epítetos, ordinales, marcadores ni nombres compuestos sin regla de evidencia.
- **No regresión:** parámetros actuales reproducen exactamente las fichas actuales para semillas conocidas.
- **Variantes:** grafías se mantienen diferenciadas y auditables; no se corrigen por similitud.
- **Identidad:** `crujidor` puede mostrar el alias sin perder Romualdius Walerian.
- **Familia:** Casa Lobeth puede contener a Mashera Skara sin forzar el apellido Lobeth; Stasi Giovanni sigue siendo Stasi Giovanni aunque aparezca como esposa de Hyarion Vardamir.
- **Realidad/época:** no usar ejemplos documentados solo para Ylat⁴ o para Gylran antiguo como norma de Ylat¹ actual.
- **Casos de Erklan:** hermanos con orden de nacimiento documentado; no inventar sufijo para nacimientos no representados.

## 6. Decisiones editoriales pendientes

| Cuestión | Alternativas reales | Propuesta conservadora |
| --- | --- | --- |
| Aerandil del Atardecer | `Brillante` (TXT 2014/2015) / `Refulgente` (fichas y censo) | Mantener Refulgente para mostrar al personaje, conservar Brillante como variante; autor debe decidir |
| Padre de Tuliëlle | `Dyeld` (relatos y Laevinë) / `Eldburg` (ficha individual) | No fusionar. Prioridad de investigación a relatos; sin corregir fuentes |
| Apellidos de familias nobles o disueltas | Consulta histórica / asignación automática / asignación tras declarar vínculo | Consulta sí; asignación automática **no** sin aprobación |
| Periodos y realidades | Nombres actuales / nombres históricos / otros Ylat | Cada contexto con etiqueta de procedencia, sin trasvase automático |
| Nombres compuestos de función desconocida | Mantener completos / dividir | Mantener completos y sin generación automática de partes |

Estas decisiones **no bloquean la continuación de la investigación documental**, pero sí la fase de implementación.

## 7. Alcance expresamente excluido

- No inventar apellidos, etimologías, reglas culturales, genealogías o términos de ambientación.
- No alterar `data/`, `assets/`, interfaces ni LIVE en esta rama.
- No fusionar esta rama con `main` ni abrir una PR de integración antes de revisión editorial.
