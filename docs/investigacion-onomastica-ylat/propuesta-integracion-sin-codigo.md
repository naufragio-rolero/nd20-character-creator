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
| Identificador **de fuente/registro** estable | Identifica el testimonio de una ficha, independientemente del nombre/alias; **no** dar por único globalmente el campo `ID` heredado | `crujidor` identifica el mismo enlace en los dos Excel, pero **Vaelar Eldarien en Ylat¹ y Ylat³** comparte literal `ID: vaelar` en fichas diferentes |
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


## 8. Extensión de la propuesta tras el contraste con otros tres corpus

**Documentación nueva (2026-11-02):** [corpus complementario de Isophius](corpus-complementario-isophius.md) (61 denominaciones), [linajes históricos de Malasthar](linajes-historicos-malasthar.md) (19 nombres), [biografías contrastadas](biografias-personajes-cotejo.md) (8 biografías). **Son testimonios, no componentes generables**. En su unión literal hay **88 denominaciones**, **16** idénticas a entradas del censo de 140, **72** externas por coincidencia literal; incluyen alias, títulos, referencias a otros mundos y un descriptor sin nombre propio, así que no equivalen a 72 PNJ nuevos.

### Entidades y relaciones que no deben confluir

| Unidad documental | Ejemplo comprobado | Qué no hacer |
| --- | --- | --- |
| Personaje narrativo | `Kharan Boll` tiene [ficha en Ylat³](https://drive.google.com/file/d/1gTNBmn8BE6PB5hF59NFBnwgzALdf0LT0/view) | Suponer que todos los miembros de Casa Gull, o William Gull (cuya ficha sí indica Ylat¹), están en la realidad Ylat³ de Kharan |
| Nombre nominal de personaje | `Richerento`, nombre unitario de una [ficha](https://drive.google.com/file/d/1XDQfQd6Eyv5oMW5L2UC8nwnVSAPB6LS0/view) | Completar «Richerento» con apellido inventado |
| Alias individual | `Draconio «Drake» Orovecchio`, [ficha](https://drive.google.com/file/d/18bkKd4-ZE_dQNDWvFWxua6MZkie6_1YE/view) | Usar «Drake» como segundo componente familiar |
| Denominación de cobertura | `Amadeus`, nombre adoptado en Ylat por el extraterrestre que la [biografía](https://docs.google.com/document/d/1yOtB8nNvE9_jBDvITuXzFFFFNFAiJI6Z4hr6D_1pxaA/edit) denomina Amathur | Clasificar «Amadeus» como nombre tradicional de humanos ylathinos |
| Apodo explícito | `Bram Brasagorda`; el verdadero apellido consta como desconocido | Transmitir «Brasagorda» como apellido hereditario |
| Linaje histórico | `Lys Terrana / Lys Maren / Lys Caelis`, fuente [Historia de Malasthar](https://docs.google.com/document/d/1fyLSppENaYx2w8tvVzdzdfTAZ46_epq-nFS1S0yPWKE/edit) | Crear nombres «Lys X» o añadir Terrana a todos los monarcas por defecto |
| Epíteto individual | `Varlyna, la Fundadora`, `Iralde Terrana, la del Arado Rojo` | Convertir epítetos y partículas en apellidos de familia |
| Topónimo | `Varlyna` también designa la ciudad fundada por la gobernante | Fusionar el nombre de persona con la entidad geográfica |
| Casa y membresía | [Casa Rizzo](https://drive.google.com/file/d/1sFZVDqN7UzYAhAk2WpD0-_gdY4onDWJ6/view) enumera **Maurice, Francesca y Mario Martoni** | Sustituir automáticamente Martoni por Rizzo |
| Relación biológica | [Maurice](https://drive.google.com/file/d/1SKFsVDWORznA_I8QHh2dC_3VGqCd21ts/view) y [Francesca](https://drive.google.com/file/d/1bEjT5jhMDnsd_BNB1wFmbmknrDsTNrXj/view) son padre y madre de Mario | Inventar que «Casa Rizzo» se llama realmente «Martoni» |
| Matrimonio y apellido de presentación | [Tayana Pamphilos](https://drive.google.com/file/d/1nbcb_02oY35gZAqbDlC3IZBPCWE9un5z/view) era Methodius antes de casarse; [Stasi Giovanni](https://drive.google.com/file/d/1ozRYZsVyx215chp5qLK5SVspCjhtOky-/view) mantiene otro apellido | Aplicar una regla universal de cambio o permanencia de apellido por matrimonio |
| Descriptor sin nombre | `Hijo de Pamela` aparece como personaje en el índice de Isophius | Añadirlo al repertorio de nombres propios |
| Denominación de entidad no humana | [`Mogg'Shattoth`](https://drive.google.com/file/d/10bH7dXTJoqX8V_luTdTWFApxbru5sUHG/view) está clasificado como demonio | Mezclarlo con repertorio ordinario de nombre humano |

**Propuesta para la eventual estructura de consulta:** conservar `nombre_literal` por fuente, `tipo_de_denominacion` solo si hay evidencia, `persona/entidad`, `realidad`, `época`, `fuente`, `casa`, `relación`, `alias`, `epíteto` y un indicador editorial **independiente** de `aprobado_para_generacion`. Esta tabla es una **especificación conceptual**, no un esquema de datos aprobado.

### Pruebas de regresión adicionales futuras, sin ejecutarlas aún

- `Kharan Boll` está documentado en el tesauro de Isla Tormenta, pero **`Kharan Shadelgast`** es una combinación no canónica en ese tesauro.
- La unión del censo y del corpus complementario no puede registrar dos veces `Caelia Fulgentis` por coincidencia literal.
- `Vrymmir Borgernstâg` y `Vrymmir Borgenrstâg` deben poder apuntar a una **relación de variante propuesta**, no a dos individuos automáticos.
- `Hijo de Pamela` nunca se convierte en nombre aleatorio.
- `Amadeus` y `Amathur` conservan su contexto de nombre de cobertura y narrativo; no contaminan nombres humanos ordinarios.
- `Rizzo` no debe ser asignado automáticamente a `Maurice Martoni` por pertenencia a Casa Rizzo.
- La combinación de **linaje histórico y epíteto** en las Tres Lises debe conservar el nombre literal tal como figura en cada testimonio; no derivar una fórmula general.

**La integración continúa sin autorización** y no se ha escrito código, modificado JSON, abierto PR de integración ni desplegado LIVE.


## 9. Actualización por las cuatro aventuras y la auditoría del tesauro

La [auditoría de cuatro aventuras](auditoria-aventuras-ylat.md) analiza **182 referencias** a personajes y **154 denominaciones literales distintas**, de las cuales **24** no aparecen idénticas ni en el censo de 140 PNJ ni en el corpus Isophius (algunas ya estaban registradas en biografías y archivos separados). Hay una **colisión concreta de ID heredado**: [Vaelar Ylat¹](https://drive.google.com/file/d/136DT4cAGmNPjqdU-TYzHjpvJpAnGB2HD/view) y [Vaelar Ylat³](https://drive.google.com/file/d/1KFLLgAEUOOj4N1862IZO9hx9dwaxJniF/view) conservan el mismo `ID: vaelar`. Por tanto, el eventual diseño **no debe asumir que el campo `ID` es una clave única global**, aunque siga siendo útil para enlaces históricos.

La [auditoría de 52 entradas del tesauro](auditoria-tesauro-componentes.md) identifica dos registros `documentado` que **no son nombres personales según las fuentes cotejadas**: **Máthair Felsaer es una montaña** y **Pietro es el oso de Drakabel**. Entre las 33 entradas `combinado`, cuatro utilizan Máthair/Pietro como primer elemento, tres usan el topónimo Felsaer como segundo y siete proponen apellidos de casas **Shadelgast/Boll** sin vinculación familiar documentada. Las 19 restantes siguen siendo combinaciones ficticias sin norma hereditaria probada.

### Requisitos añadidos a una eventual implementación — aún no autorizada

- No basta comprobar `origen=Ylat`: una fuente puede identificar un **lugar, animal o nombre de persona**. La clase de entidad será verificada **antes** de incluirla en el sorteo de personajes.
- Para nombres de casas, **pertenencia** no equivale a apellido ni a parentesco: ejemplo **Casa Rizzo** y los Martoni, o **Casa Shadelgast** y Modestia Jof.
- Para identidades entre realidades, conservar **ID de documento de fuente** (o referencia estable verificable), **realidad declarada**, **ID heredado**, **nombre literal**, **versión** y **relaciones narrativas** como campos distintos.
- Si la Forja conserva un **modo de combinación creativa no canónica**, sus resultados deberán etiquetarse de forma que no se confundan con personajes documentados; la selección y los límites requieren aprobación editorial.
- La versión futura deberá ser capaz de exponer las **52 entradas activas y sus justificaciones**, permitir auditar cambios editoriales y respetar la **reproducibilidad** de semillas anteriores.

La [matriz editorial](matriz-elegibilidad-editorial.md) recoge las clases y los controles sugeridos; [ONO-13](decisiones-editoriales.md) registra la decisión pendiente de separar nombres de persona de topónimos/animales. **Ninguna de estas propuestas cambia los JSON ni la aplicación en la rama de investigación**.


## 9. Nueva comprobación de identidades transformadas (2026-11-02)

Las fuentes rectoras documentan una relación con **identidad inequívoca y nombres distintos**: **Narga Solarys**, Rey Vetusto de Sylestria, fue privado de su nombre y bautizado **Ganragán** por sus creaciones tras el destierro. Véase [auditoría de teonimia](auditoria-fuentes-rectoras-teonimia.md). También **Valujna** recibió su nombre después de ser un lobo sin nombre consignado en la leyenda.

**Consecuencia para el modelo propuesto, sin implementar:** representar los nombres como **testimonios cronológicos y de función**, relacionados con una entidad, y guardar títulos de culto y epítetos en relaciones distintas. Un cambio explícito de nombre puede justificar vínculo entre denominaciones; la coincidencia en cadena literal o en segundo componente, por sí sola, no. No extraer **Solarys** como apellido familiar sin prueba ni añadir nombres de deidades al sorteo de personas. Esta extensión no modifica las trece cuestiones editoriales abiertas ni los recuentos de los tres subcorpus anteriores.

**Desfase del censo de Isophius:** la autoría confirma que la campaña se **jugó más tarde** y no se consolidó en las hojas de 140 PNJ. No tratar la ausencia del Excel como invalidez del registro: distinguir siempre **fecha/cobertura de censo**, **participación narrativa acreditada** y **permiso de reutilización**.
