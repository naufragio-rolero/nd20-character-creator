# 120 — Procedencia, consolidación y confirmación de Talentos

**Fecha de auditoría:** 2026-11-01. **Estado:** decisión documental de organización y clasificación; **sin cambios de reglas, interfaz, manual ni distribución pública**. **Plan de ejecución:** [121](121-plan-cinco-fases-sincronizacion-talentos.md). **Seguimiento:** [PLAN-DE-TRABAJO](PLAN-DE-TRABAJO.md).

## 1. Principio rector: el DRS es el documento original

**`NaufragioD20DRS.docx` es la fuente original y normativa del núcleo de Naufragio d20.** Los textos, requisitos, costes, condiciones y efectos de sus reglas no se reemplazan silenciosamente con contenido de una hoja de cálculo ni con glosas de la Forja.

A partir del DRS se incorporarán **otros documentos, de distintos orígenes** (ampliaciones, artículos de Bitácora, ambientaciones, hojas de trabajo y revisiones autorales). Cada aportación conservará la fuente exacta y su ámbito. Una ampliación no se convierte automáticamente en regla del DRS ni en contenido publicable del generador. Tampoco se supone que todos los documentos futuros tengan la misma autoridad, cronología o grado de aprobación.

Se distinguirán permanentemente **origen documental**, **transcripción**, **clasificación**, **consolidación editorial**, **confirmación autoral**, **implementación** y **publicación**. Son estados diferentes y no intercambiables.

### Registro inicial de fuentes

| Clave | Fuente | Naturaleza y autoridad | Estado / uso permitido |
|---|---|---|---|
| SRC-DRS | `NaufragioD20DRS.docx` | **Original normativo** del núcleo DRS | Autoridad sobre texto y mecánicas originales; base de cualquier cotejo |
| SRC-LISTA | `Lista Talentos Nd20.xlsx` (documento de trabajo compartido) | **Índice editorial transversal**, con cinco categorías y orígenes marcados por fila | Clasificación aceptada como vocabulario de trabajo, **no sustitución automática** del efecto literal del DRS |
| SRC-BITACORA | Filas del Excel con `Origen=Bitácora` | Referencias de contenido de Bitácora, aún sin enlace/artículo individual cotejado | Inventario; no publicar ni atribuir reglas a un artículo concreto sin localizarlo |
| SRC-ZELDA | Filas con `Origen=Zelda` | Agrupación de origen declarada en el Excel; documento fuente preciso por identificar | Inventario no DRS, pendiente de trazabilidad individual |
| SRC-EXPLORACION | Filas con `Origen=Exploración` | Agrupación de origen declarada en el Excel; documento fuente preciso por identificar | Inventario no DRS, pendiente de trazabilidad individual |
| REP-LITERAL | `data/talentos-drs-literales.json` | Transcripción y referencias de efectos del DRS | Derivado verificable del original; no debe gobernar contra él |
| REP-GLOSAS | `data/glosas-talentos-drs.json` | Resúmenes y etiquetas editoriales incorporados a la Forja | **Implementación vigente**, pendiente de simplificación; no tiene rango de fuente normativa |
| REP-ACLARACIONES | `data/aclaraciones-talentos-drs.json` | Aclaraciones autorales ya documentadas por separado | Conservar procedencia/aprobación; no integrarlas en la literalidad hasta aprobar nueva redacción del DRS |

El nombre de un origen en la hoja (`Nd20`, `Bitácora`, `Zelda`, `Exploración`) **no prueba por sí solo** la publicación de una regla, su vigencia, ni el documento individual exacto. Para futuras fuentes se añadirá una ficha de procedencia antes de consolidarlas.

**Huellas de los archivos efectivamente auditados:** DRS SHA-256 `2f3447300e58139ce20c8449e12e5b8d3cd3e7435b2995677ed97c6602a23df8`; lista Excel SHA-256 `b6f4b748f3f37d0e3fd96b5120e70e6ad4690cbf25dd62882539a07d4bfb0feb`. Identifican las copias revisadas el 01/11/2026, **no garantizan que una versión posterior siga siendo idéntica**.

## 2. Resultado de la auditoría del libro de trabajo

Hojas observadas: **Talentos** (`A1:K144`), **Especies**, **Ocupaciones**, **Sendas** y **Etiquetas Talentos**. Las cuentas siguientes se obtienen de las filas no vacías de la hoja Talentos.

| Origen en columna `Origen` | Entradas | Admisión en el núcleo DRS |
|---|---:|---|
| Nd20 | **22** | Identificadas con el núcleo original, pendientes de completar la formalización de etiquetas de Especie en el DRS |
| Bitácora | **89** | No: revisar cada documento individual y su ámbito |
| Zelda | **29** | No: origen diferente, sin integración implícita |
| Exploración | **3** | No: origen diferente, sin integración implícita |
| **Total** | **143** | La presencia en el Excel **no** equivale a autorización de publicación |

Distribución de las **143 entradas** por `Categoría`: **63 Pasiva, 37 Acción, 24 Reacción, 16 Especial y 3 Mejora**. Las únicas categorías admitidas para Talentos son **Acción, Especial, Mejora, Pasiva y Reacción**; no se introducen categorías alternativas como «mixta», «condicionada» o «creación de PJ». Esas expresiones, cuando aparezcan en notas explicativas, no serán valores del campo categoría.

La hoja **Etiquetas Talentos** contiene **19 etiquetas temáticas**, que constituyen otro campo (`Etiquetas`) y no una sexta categoría. Ejemplo pendiente de limpieza: en **Haute cuisine** (origen Exploración, ID 143) figura `Visión`, mientras la lista de etiquetas define `Vista`. No se corrige sin aprobación.

### El subconjunto del DRS: 22 entradas, 24 asignaciones

La hoja Talentos contiene **22 entradas `Origen=Nd20`**, de las que **13** tienen `Tipo=Especie` y **9** tienen `Tipo=Ocupación`. Al cotejarlas con las Especies originales, el DRS presenta **15 asignaciones de Talento a Especie** porque *Baja estatura* pertenece a Mediano amable y Gnomo urbano y *Visión en la oscuridad* pertenece a Enano montañés y Gnomo urbano. **13 entradas únicas de Especie + dos asignaciones compartidas = 15 relaciones de Especie; + nueve de Ocupación = 24 relaciones DRS**.

Las categorías siguientes proceden **literalmente de la columna `Categoría` del Excel**. El último campo indica si el DRS contiene una etiqueta explícita autónoma para el Talento, **no** si su efecto permite deducir cómo se utiliza:

| ID Excel | Talento (propietario en `Original`) | Categoría Excel | Etiqueta formal en DRS |
|---:|---|---|---|
| 1 | Linaje feérico — Elfo agreste | Pasiva | **No** |
| 2 | Rapidez — Elfo agreste | Mejora | **No** |
| 3 | Corpulencia — Enano montañés | Mejora | **No** |
| 4 | Visión en la oscuridad — Enano montañés | Pasiva | **No** |
| 5 | Buen desarrollo — Humano común | Mejora | **No** |
| 6 | Baja estatura — Mediano amable | Pasiva | **No** |
| 7 | ¡Sálvese quien pueda! — Mediano amable | Reacción | **No** |
| 8 | Ánimo — Semielfo | Acción | **No** |
| 9 | Herencia dual (SE) — Semielfo | Especial | **No** |
| 10 | Expulsar muertos vivientes — Clérigo | Acción | **Sí: Acción** |
| 11 | Fortaleza piadosa — Clérigo | Pasiva | **Sí: Pasiva** |
| 12 | Recuperación — Guerrero | Pasiva | **Sí: Pasiva** |
| 13 | Brío musculoso — Guerrero | Pasiva | **Sí: Pasiva** |
| 14 | Sacrificio de escudo — Guerrero | Reacción | **Sí: Reacción** |
| 15 | Bagaje de arcanista — Mago | Pasiva | **Sí: Pasiva** |
| 16 | Meditación — Mago | Acción | **Sí: Acción** |
| 17 | Preparación — Ladrón | Pasiva | **Sí: Pasiva** |
| 18 | Sutileza — Ladrón | Pasiva | **Sí: Pasiva** |
| 41 | Ira interna — Orco común | Reacción | **No** |
| 42 | Saña primitiva — Orco común | Pasiva | **No** |
| 43 | Sed de sangre — Semiorco | Reacción | **No** |
| 44 | Herencia dual (SO) — Semiorco | Especial | **No** |

**Confirmación de auditoría:** los **nueve Talentos de Ocupación DRS** ya tienen etiqueta expresa en el documento original, y en estos nueve casos coincide con la categoría de la hoja. Las **15 asignaciones de Especie DRS** carecen de esa línea formal en el manual. **No se afirma** que el DRS carezca de condiciones de activación dentro del texto del efecto.

Se preservará la identidad de **Herencia dual (SE)** y **Herencia dual (SO)** por Especie, aunque el DRS titule ambas entradas *Herencia dual*. También se preservarán por propietario los textos originales de *Baja estatura* y *Visión en la oscuridad*, sin forzar la igualdad literal entre versiones.

## 3. Consolidación: campos y precedencias

Cada Talento consolidado deberá poder rastrearse como mínimo con:

- **Identidad:** `origen_documental`, `identificador_en_origen`, `nombre_original`, `tipo_propietario`, `propietario`, `variante` cuando corresponda.
- **Trazabilidad:** `archivo_fuente`, `seccion_o_localizacion`, `revision_fuente`, `estado_cotejo`.
- **Contenido:** `efecto_literal` y, si existe en el documento, `categoria_literal`, `activacion_literal`, `atributo_literal`, `coste_literal`; nunca reconstruir esos campos usando solo una glosa.
- **Consolidación editorial:** `categoria_propuesta` (una de las cinco), `fuente_categoria`, `estado_confirmacion`, `decision_autoral`, `fecha_decision`, `observaciones`.
- **Disponibilidad:** `ambito`, `publicable_en_drs`, `estado_integracion_forja`, `version_de_publicacion`; **consolidado ≠ publicado**.

**Precedencia de trabajo:** DRS para reglas del núcleo → fe de erratas o **revisión autoral aprobada** y documentada para sustituir la redacción original → otras fuentes incorporadas con su propio ámbito y permiso → catálogo derivado de Forja para mostrar la regla, nunca para redefinirla. La hoja Excel determina **la taxonomía de trabajo**; para escribir una nueva etiqueta formal en el DRS hace falta una modificación documental identificada, no un cambio silencioso del efecto.

El emparejamiento debe hacerse por **origen + identificador fuente + propietario/variante**, no únicamente por nombre: hay talentos compartidos, versiones homónimas y documentos de varios orígenes. Los IDs numéricos del Excel no se presuponen estables en futuras revisiones ni globales para todos los documentos.

## 4. Registro de confirmaciones y decisiones pendientes

| Estado | Decisión / hallazgo | Alcance |
|---|---|---|
| **Confirmado en esta conversación** | La clasificación de Talentos admite **solo cinco valores:** Acción, Especial, Mejora, Pasiva, Reacción | Vocabulario común para futuras fuentes, sin asignar automáticamente tiempos/costes |
| **Verificado contra el Excel** | 143 entradas; 22 Nd20, 89 Bitácora, 29 Zelda y 3 Exploración | Inventario de la copia auditada |
| **Verificado contra el DRS** | 9 Talentos de Ocupación con etiqueta expresa y 15 asignaciones de Especie sin etiqueta formal | No inventar etiquetas como si fueran frases del manual |
| **Consolidación editorial pendiente de incorporar al manual** | Las 15 categorías de Especie tomadas del Excel | Conservar procedencia «Lista Talentos Nd20» hasta la revisión del DRS |
| **Pendiente de decisión autoral** | *¡Sálvese quien pueda!* es **Reacción** en el Excel, pero su efecto DRS indica gasto de **una Acción** y Esfuerzo | No cambiar el coste ni inferir una regla sobre Reacciones |
| **Observación sin reclasificación automática** | *Corpulencia* es **Mejora** y permite un gasto condicionado de Esfuerzo; *Recuperación* es **Pasiva** aunque su uso consume Esfuerzo e Intervalo | Conservar categoría de la hoja y efecto original mientras se revisa coherencia |
| **Pendiente de cotejo exhaustivo** | Posibles diferencias de redacción entre columna `Efecto` del Excel y la transcripción DRS por propietario | No importar el efecto del Excel como reemplazo masivo |
| **Pendiente de trazabilidad externa** | Fuente documental exacta de las 121 entradas Bitácora/Zelda/Exploración | No integrarlas por simple coincidencia nominal |
| **Pendiente de aprobación de redacción** | Incorporar aclaraciones autorales —p. ej., agrupación de Tiradas en *Expulsar muertos vivientes*— al texto del DRS | Hasta entonces, solo Detalles técnicos de la Forja |

**Confirmación** requiere registro inequívoco de qué se aprueba: *clasificación*, *nuevo texto*, *corrección de una regla*, *integración* o *publicación*. Aprobar una categoría no aprueba automáticamente modificar el tiempo de activación ni una reedición íntegra del efecto.

## 5. Política para fuentes futuras

1. Incorporar cada archivo como **fuente identificable**, con nombre, fecha/revisión, ámbito y autorización de uso.
2. Conservar **texto original** y **copia/índice normalizado** sin sobrescritura destructiva.
3. Anotar qué regla **añade**, **complementa**, **interpreta**, **contradice** o **sustituye expresamente** a otra. Sin decisión autoral, una contradicción permanece abierta.
4. Consolidar por origen y propietario; mostrar conflictos y variantes, no mezclarlos automáticamente.
5. Habilitar su consulta en la Forja **solo tras aprobación y pruebas del ámbito correspondiente**. El paquete público DRS no admite contenido de otros orígenes por el mero hecho de existir en el Excel.

**Regla editorial final:** el DRS es el **punto de partida**, no el único documento que existirá. La fidelidad se consigue preservando todas las fuentes y sus relaciones, no borrando su procedencia durante la consolidación.
