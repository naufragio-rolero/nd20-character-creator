# Investigación onomástica de Ylat — bitácora

**Inicio:** 2026-11-02  
**Estado:** Fases I–III en investigación; sin cambios de aplicación.  
**Rama:** `research/onomastica-ylat-2026-11`  
**Regla de exclusión:** no utilizar material de Niguace/Niguaze ni de otros universos sin procedencia acreditada. Ver `docs/enciclopedia/127-exclusion-corpus-ajeno-ylat.md` y PR #22.

## Alcance y reglas de trabajo

- Solo se incorporarán testimonios con procedencia verificable de Ylat.
- Se diferenciarán nombre de pila, apellido, nombre completo, casa/linaje, epíteto y forma indeterminada.
- No se dividirán cadenas por espacios ni se deducirá sexo, especie o cultura por apariencia.
- No se modificarán `data/`, `assets/` ni LIVE durante la investigación.
- Este archivo registra hallazgos preliminares, no decisiones editoriales aprobadas.

## Registro de actividades

### 2026-11-02 — Auditoría inicial

- Contrastados `data/nombres-historicos-ylat.json`, `data/tesauro-ylat.json`, `data/especies.json`, `data/sexo-personajes.json`, `assets/rules.js`, `assets/sex.js` y `assets/repertorios.js`.
- Banco histórico: 1428 registros, 1422 formas distintas. El tesauro vigente: 52 registros (19 documentados, 33 combinados). Las cantidades **no** equivalen a nombres de pila y apellidos validados.
- Verificada la PR #22, que retiró 148 entradas de un corpus ajeno. Revisar por separado posibles coincidencias léxicas residuales en `sexo-personajes.json`; una coincidencia no demuestra procedencia exclusiva.
- Localizado en la Biblioteca el «Índice maestro de Ylat»; establece como fuentes rectoras Enciclopedia, Zonas, Lenguas, Espíritus Deíficos, Historia de Shadaleen, Historia de Gylran y Biografías. Las antiguas fichas separadas Reino de Gylran, Iblisios y Dracónidos están sustituidas por Historia de Gylran.
- Inspeccionada la carpeta raíz de Drive [Ylat](https://drive.google.com/drive/u/3/folders/1gUMXUshlfY1FKtghLv7BP58w2FyQf3wO) y subcarpetas de Trasfondo, Proyectos y otras áreas. La ubicación en la carpeta no prueba pertenencia al canon.
- Documentos narrativos revisados: [Biografías](https://docs.google.com/document/d/1yOtB8nNvE9_jBDvITuXzFFFFNFAiJI6Z4hr6D_1pxaA/edit), [Historia de Shadaleen](https://docs.google.com/document/d/15LVdulBcuf62G6OPQKKCTHQWOHrqrGUAZO6DnXZJA2o/edit), [Susurros en Isophius](https://docs.google.com/document/d/1E7AMmSFvZestqgVVDnm4vHKKu4G5_NeXIUWlzlChEYM/edit) e [Historia de Malasthar](https://docs.google.com/document/d/1fyLSppENaYx2w8tvVzdzdfTAZ46_epq-nFS1S0yPWKE/edit) (borrador).
- Pendiente: lectura completa de todas las fuentes Word/PDF/Docs y extracción de «Apellidos eladrines en Erklan.txt» y «Linajes eladrines.txt», cuyo contenido no se pudo decodificar.

## Hallazgos documentales iniciales

| Forma | Tipo provisional | Testimonio | Observaciones |
| --- | --- | --- | --- |
| Caelia Fulgentis | Nombre completo | Biografías, apartado Caelia | Fulgentis se identifica como familia de alfareros de Beslitz. |
| Naeis Shadelgast | Nombre completo y vínculo dinástico | Biografías, apartado Naeis | Shadelgast también se documenta como familia dinástica en Historia de Shadaleen. |
| Fabrizio Orovecchio | Nombre completo | Susurros en Isophius, inicio | Tadeo y Joan Orovecchio aparecen con relaciones familiares explícitas. |
| Redvers Kultstein | Nombre completo | Historia de Shadaleen | Vinculado a la familia Kultstein. |
| Bram Brasagorda | Nombre + sobrenombre | Biografías, apartado Bram | El texto explica que Brasagorda era un mote y que su apellido real se desconoce. No tratar como apellido. |
| Iralde Terrana | Nombre completo y linaje | Historia de Malasthar, Tres Lises | Borrador; no equiparar automáticamente linaje sacro y apellido libre. |
| Shadelgast, Bronnhum, Rowes, Alogers, Keefe, Dórilon, Kultstein | Familias | Historia de Shadaleen, Siete Familias | Cada una requiere validación independiente de usos como apellido. |

### Cuestiones por conciliar

- Saewig Shadelgast (tesauro) frente a Saewig Rowes (Historia de Shadaleen): comprobar identidad, cronología y versiones.
- William / Whilliam Gull: grafías diferentes en biografía.
- Vrymmir Borgernstâg: preservar diacríticos y contrastar variantes.
- No clasificar automáticamente «Cabeza de Oso» ni «Hueso de Sangre» como apellidos transferibles.
- El generador histórico original mezcla formas sin tipología onomástica acreditada.

## Próximos hitos

1. Completar inventario de archivos con estado: leído / extracción parcial / inaccesible / obsoleto / procedencia no acreditada.
2. Recuperar fuentes sobre apellidos y linajes eladrines.
3. Extraer registros con citas localizables y categoría de evidencia.
4. Conciliar cada registro con catálogos actuales, variantes y duplicados.
5. Preparar propuesta editorial de combinación; **sin implementar** hasta validación.

## Política de actualización

Añadir una entrada fechada por sesión, enlaces a fuentes y distinción entre hechos comprobados e hipótesis. No usar esta rama para cambios de producción.


### 2026-11-02 — Segunda sesión: contraste histórico, regional y documental

- Leída en Biblioteca «Trasfondo - Historia de Gylran.md», documento canónico que sustituye tres fuentes antiguas. Extraídos **Lathandos Snave, Käbrius Festus, Belril Sierpercana y Caefyn Verdimbre**; no se prueba vigencia contemporánea de los segundos componentes.
- Revisados «Historia de Shadaleen», «Zonas de Ylat», «Susurros en Isophius», «Historia de Malasthar», «Historia de Nulsärax» y «El Imperio de Laventia»; consolidados ejemplos con sus condiciones en [catalogo-provisional.md](catalogo-provisional.md).
- Documentado el carácter de familias de los **Orovecchio** y los **Gull**; diferenciados los linajes sacros **Terrana/Maren/Caelis** (historia de Malasthar, provisional) y los apellidos cuya función sigue sin certificar.
- Verificadas las formas **Saewig Rowes** (Historia de Shadaleen) frente a **Saewig Shadelgast** (tesauro): no fusionar automáticamente. Hallada divergencia histórica entre el relato genealógico shadalense y la versión interna «La Primera Huella» sobre la denominación Shadelgast.
- Búsqueda literal en los cuatro JSON de nombres existentes: 24 términos de interés nuevos no aparecen; la ausencia **no** acredita su inclusión automática.
- Revisados mediante extracción local 16 documentos DOCX de reglas y ambientación asociados al proyecto; se detectaron principalmente usos mecánicos de «linaje», sin un sistema general de apellidos equiparable a las fuentes de historia. No se han alterado.
- La lectura directa de «Apellidos eladrines en Erklan.txt» y «Linajes eladrines.txt» falla por codificación en el conector; ambas fuentes continúan marcadas como **no leídas**.
- **Hallazgo de recuperación:** encontrada una copia Markdown de la antigua wiki de [Apellidos eladrines en Erklan](https://drive.google.com/file/d/1brBjcXrRFz2slCSSEuw7m78Y8pBLT5v6/view). Expone la estructura de apellidos ligada a fenómenos atmosféricos y orden de nacimiento; documentada en sección H del catálogo.
- Contrastadas fichas antiguas: [Aerandil del Atardecer Refulgente](https://drive.google.com/file/d/1q2AGQap3uCdFgwyS6CwGf_FiLB5Xbrur/view), [Anasthore del Atardecer Luciente](https://drive.google.com/file/d/1rV6rEjO_Sy2kiollOgJtvKfYbSlTRTZG/view) y [Casa Adorasol](https://drive.google.com/file/d/1I_g1ni_qIrJXGcEteIfs2xQchUCgKlDd/view). **Discrepancia:** en la nota antigua Aerandil aparece como «del Atardecer Brillante», mientras en dos fichas aparece «del Atardecer Refulgente».
- La ficha de Galeshra Adorasol documenta **migración de la familia desde Qelasthavia a Erklan**, por lo que su apellido no puede atribuirse como originario de Erklan sin matices.
- Ningún JSON ni archivo ejecutable de la aplicación ha sido modificado. No se ha abierto PR ni desplegado LIVE.

**Documentos de trabajo:** [catálogo provisional](catalogo-provisional.md).  
**Decisiones pendientes:** nombre canónico de Aerandil; utilización de apellidos históricos y de casas nobles; validez actual de la convención eladrín; función de membresía en Casa Adorasol.


### 2026-11-02 — Inventario y revisión de la Casa Gull

- Registradas carpetas y estado de lectura en [inventario-fuentes.md](inventario-fuentes.md).
- Revisado el documento `Sir William White Gull.docx`: existen formas William y Whilliam para el mismo personaje, y una discrepancia John William / John Gull para su padre. El término White solo está en el título del archivo, no en el texto.
- Detalles y referencias en [catalogo-provisional.md](catalogo-provisional.md), sección I.
- Persisten bloqueos de lectura en dos TXT eladrines. Se mantienen las decisiones editoriales pendientes.
- Sin modificaciones de datos, código, despliegues o PR.


### 2026-11-02 — Tercera sesión: censos de PNJ, linajes acreditados y recuperación de los TXT

1. **Recuperación de censo:** leídos [`dnd_npcs.xlsx`](https://drive.google.com/file/d/1B2YnVslAK7Sjd5ELYR9kteHB9Q-L4AWp/view) (140 PNJ en dos pestañas) y [`npcs.xlsx`](https://drive.google.com/file/d/1g-y0abx5rnOJpiSv8vJsE_iv6V-fOLVR/view) (66 identidades con datos, 99 posiciones totales). La comparación por identificador interno conserva las 66 identidades; 65 formas visibles coinciden y una cambia de nombre.
2. **Hallazgo de alias:** el mismo personaje `url=crujidor` consta como **Romualdius Walerian** en la hoja más antigua y como **Crujidor** en la nueva. La biografía lo acredita como apodo. Se corrige así la falsa apariencia de personaje perdido.
3. **Clasificación:** los 140 PNJ tienen 126 campos `surname` no vacíos y 97 valores distintos, pero hay ordinales, alias, apodos y marcadores: no alimentar el generador directamente. Publicado el [censo de 140 PNJ](censo-pnj-historico.md) con procedencia y marcas de revisión.
4. **Genealogía:** documentados parentescos en once núcleos familiares y pertenencia familiar sin relaciones completas en Alogers/Shadelgast. Creado [familias-acreditadas.md](familias-acreditadas.md).
5. **Discrepancia Skara:** el padre de Tuliëlle es **Dyeld** según su propio relato, «Tuliëlle Skara I» y la biografía de Laevinë, pero **Eldburg** según la ficha individual homónima. No unificar ni corregir sin decisión.
6. **Banco histórico:** comparación normalizada de las 1422 formas únicas del banco de nombres contra los 140 PNJ: 16 coincidencias con nombres de pila y 2 con valores de segundo componente (Iraldsay y Beld). El solapamiento muestra usos distintos, no da reglas automáticas de clasificación.
7. **Fuentes eladrines desbloqueadas:** descargados los originales [`Apellidos eladrines en Erklan.txt`](https://drive.google.com/file/d/1YVanaM-4ThS94W-qY3NFShmNE6Klbmj7/view) y [`Linajes eladrines.txt`](https://drive.google.com/file/d/1J1uHzpl9DqyLVrsoes73N3_u6sclPCXB/view), ambos codificados en **Windows-1252**. Leídos íntegramente, contrastados por líneas y huellas SHA-256; [cotejo documentado](fuentes-eladrines-cotejo.md). Ambos dan **Brillante** para Aerandil, frente a **Refulgente** en su ficha y en el censo; los valores CD de las notas están intercambiados entre versiones (no convertir a reglas d20).
8. **Isophius:** examinados [`DocumentacionIsophius.odt`](https://drive.google.com/file/d/1js4SQFdk7xry3Q6OsGn2rWfD7t37nmc4/view), [`DatosIsophius.ods`](https://drive.google.com/file/d/1phFBXkKkmBA_0u7wIGDGD7LM3gyxMzep/view) y las respuestas del formulario de creación, limitándose a nombres ficticios, **sin datos personales**. Se corrobora la Casa Orovecchio en Piedrahundida; en materiales de campaña aparecen **Drake Orovecchio**, **Gerad Orovecchio** y el hijo adoptivo **Alim de Mostaganem**. Se documentó en [isophius-fuentes-campana.md](isophius-fuentes-campana.md).
9. **Repositorios:** revisados y actualizados [inventario-fuentes.md](inventario-fuentes.md), [catalogo-provisional.md](catalogo-provisional.md), y ampliado [familias-acreditadas.md](familias-acreditadas.md). La documentación antigua de archivos TXT «inaccesibles» queda supersedida por las entradas fechadas de hoy.

**Cambios técnicos:** solo documentación en `docs/investigacion-onomastica-ylat/`. Sin edición de JSON de producción, código, pruebas de la aplicación, PR ni LIVE.

**Pendiente de decisión editorial:** Aerandil Brillante/Refulgente; Dyeld/Eldburg Skara; incorporación o no de genealogías de campañas antiguas frente al canon actual; reglas restrictivas de casas nobles, adopción y nombres históricos.


### 2026-11-02 — Cuarta sesión: clasificación de formas, casas y reconciliación técnica

- **Auditoría completa de los 97 valores literales distintos de la columna `surname`** del censo de 140 PNJ. Se han agrupado por evidencia: **17 apellidos o familias acreditados**, **1 apellido individual explícito**, **1 apodo probado**, **2 fórmulas eladrines dependientes de nacimiento**, **1 ordinal**, **1 tratamiento**, **3 fórmulas de epíteto**, **4 compuestos de función pendiente**, **1 grafía en conflicto** y **66 componentes de función no acreditada**. No equivale a repertorio listo para generación. Archivo: [clasificacion-segundos-componentes.md](clasificacion-segundos-componentes.md).
- **Kultstein:** el artículo publicado [«La condena de Viktor Kultstein»](https://drive.google.com/file/d/1GDzOljZierUkG3i6PrkcxuAqsBXWG487/view) presenta a Viktor como uno de los escasos supervivientes de la Purga. [Casa Kultstein](https://drive.google.com/file/d/10uRTnEtrADwxdhIIanseoQ8Z9SpKI7ey/view) figura disuelta, con Viktor y Morgarath. **Rectificación de supuesto absoluto de extinción; no nueva autorización de generación.**
- **Grafía Vrymmir:** `Borgenrstâg` (censo y ficha anterior) frente a `Borgernstâg` (artículo publicado en 2019, modificado 2024, y biografía del documento rector). Se preservan ambas; preferencia editorial propuesta, no aplicada.
- **Función literal del segundo componente:** «Inversa» es **apellido explícito** según la biografía de Jaleba; «Violatesoros» es **apodo** según la biografía de Baryn; «sin Apellido» es el tratamiento solicitado por Neyney. No clasificar por apariencia.
- **Casas:** [Casa Lobeth](https://drive.google.com/file/d/161zJJ4kXnUehxGDrEl2HXWydwUiD6ZUp/view) incluye a Mashera **Skara**; [Casa Adorasol](https://drive.google.com/file/d/1I_g1ni_qIrJXGcEteIfs2xQchUCgKlDd/view) incluye a Aerandil/Anasthore «del Atardecer»; [Casa Iraldsay](https://drive.google.com/file/d/114RcJbWOKxUIAPc_8rbd2kRLCDQuA137/view) enumera solo tres miembros de un hogar con cinco personas documentadas. **Pertenencia a una casa, apellido y exhaustividad del catálogo son dimensiones distintas.** [familias-acreditadas.md](familias-acreditadas.md).
- **Ámbito de realidad:** [Tegku Bagui Fénix](https://drive.google.com/file/d/1hs2TLs0ePQoza_zFTYIdMJj-57FggSEt/view) figura como `Ylat⁴` en su ficha, mientras muchos PNJ del censo figuran como `Ylat¹`; no extrapolar sus nombres de una realidad a otra.
- **Fase III:** comparación de 140 PNJ con tesauro de 52 entradas, banco de 1422 formas, repertorios de especie y catálogo editorial de sexo. Resultados: **4 nombres completos coincidentes con tesauro** (Jérémie Alban ~ Jeremie Alban con normalización de diacríticos), **16 primeros nombres** y **2 segundos componentes** coincidentes con banco, **1 primer nombre** con nombres de especies y **5 primeros nombres** con catálogo editorial de sexo. Véase [auditoria-solapamientos.md](auditoria-solapamientos.md).
- **Integración aún no autorizada:** revisados `assets/rules.js`, `assets/sex.js` y `assets/repertorios.js` en `main`, documentada la dependencia del RNG compartido y el riesgo de segmentar cadenas. [propuesta-integracion-sin-codigo.md](propuesta-integracion-sin-codigo.md).
- **Cambios GitHub:** solo archivos Markdown de investigación. Sin modificación de `data/`, `assets/`, pruebas de La Forja, PR ni LIVE.

**Decisiones editoriales bloqueantes solamente para integración, no para investigar:** forma canónica Aerandil Brillante/Refulgente; Dyeld/Eldburg Skara; si los apellidos históricos/nobiliarios pueden generarse o solo consultarse; cómo preservar restricciones por tiempo/realidad.

**Cierre de esta revisión:** creado [decisiones-editoriales.md](decisiones-editoriales.md) con seis cuestiones identificadas y sin atribuir decisiones al autor. El documento distingue tres discrepancias de identidad/grafía de otras tres cuestiones sobre ámbito de generación y linaje. La investigación sigue abierta.


### 2026-11-02 — Quinta sesión: cierre del barrido de 66 componentes y ampliación por crónicas

- Completada la primera lectura y contraste individual de los **66 valores del campo `surname` que originalmente carecían de prueba familiar**. Sin duplicaciones ni exclusiones en ese grupo; los resultados no equivalen a una revisión exhaustiva de todo el corpus de Ylat.
- **Cinco** formas promovidas a familia acreditada: **Asheishi, Kinistis, Sigvald, Neulenthris y Veredron**. **Una** forma, `Oq'uatee`, trasladada a variantes en conflicto debido al cotejo Car'rt Oq'uatee / Kaart Oquati y Melora / Lenseng. **60** siguen sin función familiar positivamente acreditada pese a haber sido revisadas. Distribución actual de los 97 valores: **22 F, 1 A, 1 P, 2 N, 1 O, 1 M, 3 E, 4 C, 2 V, 60 I**. [Clasificación](clasificacion-segundos-componentes.md).
- [Revisión de las 66 biografías y realidades](revision-biografica-y-realidades.md) contiene primero 23 y después 43 fichas consultadas y enlazadas. Detectadas variantes **Eomdyn/Emodyn**; relación de acogida de Damien Holdt por Lazare Brice sin adoptar su apellido; **Samdaw** y **Tasano** son nombres de organizaciones, no casas probadas.
- Contraste de realidades: **Lazare Brice** tiene versiones distintas Ylat¹/Ylat³; **Branwen Sigvald «Discordia»** también. `Saewig Rowes` en Historia de Shadaleen frente a `Saewig Shadelgast` en una aventura Ylat³/Mundos alternos: el cambio de realidad podría explicar la divergencia, pero **no la resuelve canónicamente**.
- Ampliado el corpus más allá de las 140 filas del Excel con relatos publicados del foro, [capítulo 1x06 «Reposo de Gaaladar»](https://drive.google.com/file/d/1qYR74sOdmTDUkPIuwkFJfD3kuXu_OIIi/view) y [capítulo 1x04 «Templo de Ylathia»](https://drive.google.com/file/d/1c1_VxotPJvwjUsL65oL4OxpxlYcGZj1_/view), más fichas de campaña.
- **Hallazgos fuera del censo:** los apellidos/casas Orovecchio, Buelhorn, Leone, Forneustone, Grimaldi, Achgate y la Casa Rizzo. **Casa Rizzo** es una familia registrada cuya lista de miembros contiene **Martoni**: no atribuir el apellido Rizzo a los tres miembros por pertenencia a la casa. [Ampliación narrativa](ampliacion-cronicas-isophius.md).
- El capítulo 1x06 declara a **Lalo Achgate** primo segundo del **emperador Janus Achgate II**; las fichas usan también `Janus II Achgate`. [Tadeo Orovecchio](https://drive.google.com/file/d/1O4pno2voYSo9sAS6gfcZ9z3HyitOx7ai/view) es padre de Fabrizio, Draconio y Gerad. **Draconio «Drake» Orovecchio** tiene nombre/apodo explícitos. La crónica usa expresamente «apellido Orovecchio».
- **Alim de Mostagánem** figura en intervenciones reales del foro y como hijo adoptivo de Fabrizio, no solo en preparación. Su ficha publicada dice que procede de la **ciudad de Mostagánem**; también consta `Mostaganem` y `Mostáganem`. **Leezar Theroux**, de la hoja preparatoria y descripción de Casa Forneustone, contrasta con **Leezar Lockbruck**, de ficha publicada y misma lista de miembros. Ningún cambio ha sido corregido silenciosamente.
- Registro de decisiones ampliado a **12 cuestiones abiertas**, con criterio editorial propuesto sin atribuir aprobación al autor: [decisiones-editoriales.md](decisiones-editoriales.md).
- **Solo documentación.** Ninguna modificación de `data/`, `assets/`, pruebas de aplicación, PR o LIVE. La clasificación no autoriza generación libre de apellidos.

**Siguiente prioridad:** ampliar el censo fuera de las hojas Excel de forma estructurada, incluyendo nombres completos y vínculos familiares de relatos de campañas y biografías con su realidad/época; después preparar propuesta editorial restringida y resolver decisiones antes de implementar.


### 2026-11-02 — Sexta sesión: tres subcorpus reconciliados, sin cambios en La Forja

- Revisada la ficha de campaña [«Susurros en Isophius»](https://drive.google.com/file/d/18UIbCTckiCU8B2l3-eIIIy4gho9Q1cSd/view), con **46 entradas** de la sección «Personajes»; **2** coincidían exactamente con los 140 PNJ (**Elisia Jacenty** y **Stasi Giovanni**), **44** no; de estas últimas una es el descriptor **«Hijo de Pamela»** y otra figura como **demonio** (`Mogg'Shattoth`), por lo que no todos los registros son nombres de persona utilizables.
- Contrastadas las listas de **15 casas** y sus **50 relaciones de membresía** para **43 personas distintas**. Combinando los dos listados, se obtienen **61 denominaciones literales únicas**; **15** ya constan idénticas en el censo de 140, **46** son externas (incluido el descriptor), y las dos externas a Isophius aportadas solo por casas son **Morgarath Kultstein** y **Kharan Boll**. Ver [corpus-complementario-isophius.md](corpus-complementario-isophius.md).
- Hallazgo de **Martoni** como familia individual documentada: [Maurice](https://drive.google.com/file/d/1SKFsVDWORznA_I8QHh2dC_3VGqCd21ts/view) y [Francesca Martoni](https://drive.google.com/file/d/1bEjT5jhMDnsd_BNB1wFmbmknrDsTNrXj/view) son progenitores de [Mario Martoni](https://drive.google.com/file/d/1CELaYbxVija5vyNYEbLKsR5eezh2eleD/view). Los tres constan en **Casa Rizzo**; no se acredita que «Rizzo» sea apellido que utilice uno de ellos. **Tayana Pamphilos** pertenecía a **Casa Methodius antes del matrimonio**, prueba específica contra la extrapolación de una regla universal de apellidos matrimoniales.
- **Kharan Boll** figura en el tesauro de la Forja como nombre **documentado** `ylat-d038` de la colección Isla Tormenta, mientras su [ficha](https://drive.google.com/file/d/1gTNBmn8BE6PB5hF59NFBnwgzALdf0LT0/view) declara **Ylat³**. No inferir la misma realidad para la [Casa Gull](https://drive.google.com/file/d/16K7PxxqSRXnGD-g-9VDaSgMKlw8owpp0/view) ni para William Gull, cuya ficha indica Ylat¹. La comprobación del PDF Isla Tormenta se ha hecho **a través de la metadata del JSON**, sin nueva lectura visual de su página 7.
- Reconciliación con `main`: **0/61 coincidencias completas con el banco histórico de 1428 filas**; **1/61 con tesauro de 52 entradas**, Kharan Boll; no se han derivado apellidos de las 49 formas editoriales del catálogo de sexo.
- Nueva lectura guiada de [«Historia del Imperio de Malasthar»](https://docs.google.com/document/d/1fyLSppENaYx2w8tvVzdzdfTAZ46_epq-nFS1S0yPWKE/edit): **tres linajes sacros, Lys Terrana, Lys Maren y Lys Caelis**; extracción verificable de **12 gobernantes** históricos más **7 denominaciones adicionales** (total **19**), conservando partículas y epítetos originales. **Varlyna** funciona a la vez como persona y nombre de ciudad. `Quamara Rowes` aparece como arcanista shadalense dentro de un texto sobre Malasthar, por lo que no se le adjudica cultura malasthina. Ver [linajes-historicos-malasthar.md](linajes-historicos-malasthar.md).
- Contrastadas las **8 biografías** de [«Biografías de personajes: Ylat»](https://docs.google.com/document/d/1yOtB8nNvE9_jBDvITuXzFFFFNFAiJI6Z4hr6D_1pxaA/edit) con los 140 PNJ. Solo **Caelia Fulgentis** coincide idénticamente; `Vrymmir Borgernstâg` difiere de `Borgenrstâg` en el censo, sin prueba de dos personas. **Amadeus** es nombre adoptado por un azurino denominado **Amathur** en la narración, natural de Nebulazuris; **Astrid Sombralba** llega de otra realidad; **Bram Brasagorda** es apodo explícito. Ver [biografias-personajes-cotejo.md](biografias-personajes-cotejo.md).
- **Balance de tres subcorpus**: 61 + 19 + 8 = **88 denominaciones literales únicas** entre esos tres documentos; **16** aparecen idénticas en el censo de 140 y **72** no. **No son 72 personajes inéditos ni 72 nombres generables**: existen alias, grafías alternativas, epítetos, identidades extraterrestres, topónimos y un descriptor sin nombre. Todos los enlaces y recuentos se reflejan en [catalogo-provisional.md](catalogo-provisional.md).
- Ampliada la [propuesta de integración sin código](propuesta-integracion-sin-codigo.md) para preservar por separado la entidad, su denominación documental, el alias, la realidad/época, el linaje/casa, la relación de membresía y el permiso editorial de generación.
- **No se ha implementado nada**: sin cambios en `data/`, `assets/`, interfaces, pruebas de la aplicación, PR de integración o LIVE. Los avances siguen exclusivamente en la rama `research/onomastica-ylat-2026-11`.

**Decisiones:** no hay bloqueo para seguir inventariando. Se mantienen las **12 decisiones ya abiertas**, sin aprobación implícita por parte del autor. Se documentan además variantes internas de epíteto en Branneth y Tharn; no se altera ninguna fuente.

**Próximos trabajos en la rama:** ampliar el registro de nombres fuera del censo con otros textos narrativos, comprobar variantes documentadas antes de proponer fusiones, y ordenar una matriz de elegibilidad editorial. No modificar repertorios productivos antes de validar las restricciones.


### 2026-11-02 — Séptima sesión: cronología de Isophius y fuentes rectoras de teonimia

- **Aclaración de autoría:** *Susurros en Isophius* se jugó **después** del periodo cubierto por el censo histórico de 140 PNJ y sus datos **nunca se incorporaron** al Excel. La omisión del registro histórico es esperable por cronología de recopilación, **no evidencia contra el carácter jugado de la campaña**. Actualizados [corpus](corpus-complementario-isophius.md) y [ampliación por crónicas](ampliacion-cronicas-isophius.md) sin alterar sus recuentos.
- **Nuevas lecturas dirigidas de fuentes rectoras:** [Enciclopedia de Ylat](https://docs.google.com/document/d/11xNUoTcW7bBE3fq8wwBpmxIJmnfaZZnEeB9t47p1qKg/edit), [Espíritus Deíficos](https://docs.google.com/document/d/1O4u4k0sQKFZ-H5SYr38zS0dHkRWMxequQNiUMN5GkNw/edit) y [Lenguas de Ylat](https://docs.google.com/document/d/1FhYWtfZHKoAlr9aQAFLCVej3Uc7s_sVKRp-dMjwsTN4/edit). Documentados en [auditoría de teonimia y designaciones](auditoria-fuentes-rectoras-teonimia.md); la revisión de Enciclopedia y Espíritus sigue siendo **dirigida, no exhaustiva**.
- **Hallazgo de identidad explícita:** **Narga Solarys** y **Ganragán** son denominaciones de **la misma entidad** antes y después del destierro. **Cacique de las Hordas**, **Último Rey Vetusto** y **Déspota Salvaje** son títulos/epítetos, no apellidos; *Solarys* tampoco está acreditado como apellido familiar libre.
- **Segundo caso de denominación otorgada:** **Valujna** fue un lobo según su leyenda y recibió ese nombre de los entes que lo salvaron. **Ornuth Aium** es una denominación deífica de dos palabras, no prueba de nombre+apellido. Revisadas también las designaciones de Hstet, Ylathia y Z’Thur.
- **Lenguas no equivalen a culturas personales inferidas:** la ficha *Cóbatur* confirma a Narga como creador de la lengua; se mantienen las restricciones de atribución cultural y de combinabilidad.
- **Cotejo con los repertorios existentes:** búsqueda literal (insensible a mayúsculas) de Narga, Solarys, Ganragán, Valujna, Ornuth Aium, Hstet, Ylathia, Z’Thur, Norluth y Alleinn Nuj en `data/nombres-historicos-ylat.json`, `data/tesauro-ylat.json` y `data/sexo-personajes.json` de `main`: **sin coincidencias literales**. No implica autorización de incorporación; ver [auditoría](auditoria-fuentes-rectoras-teonimia.md).
- **Matriz y propuesta técnica actualizadas:** consulta literal y relación de identidad sí; nuevas asignaciones automáticas **no**. Las decisiones **ONO-01 a ONO-13 permanecen abiertas**; no se han añadido nuevas cuestiones sin necesidad ni cambiado el estado de ninguna.
- **Cambios GitHub:** exclusivamente documentación de investigación en `docs/investigacion-onomastica-ylat/`. **20 documentos**, ninguno de `data/`, `assets/` ni LIVE modificado. Sin PR de integración ni sincronización de rama con `main`.

**Próximos trabajos:** completar los barridos sistemáticos de las fuentes rectoras y cruzar entidades deíficas y cambios de nombre con el catálogo de aventuras, sin sumarlos prematuramente a los 88 registros del corte anterior.


### 2026-11-02 — Octava sesión: 18 espíritus, cronología histórica y tres Gestas

- **Espíritus Deíficos:** completado barrido de **18 fichas** con sus **54 epítetos/títulos** de la línea anterior a «Ideograma». Creado [inventario sistemático](inventario-teonimos-y-epitetos.md). No son nombres humanos generables ni «54 apellidos». **Bazjurm** aparece como **Bajzurm** en secciones internas de su misma ficha: variante preservada, sin corrección editorial. La introducción de la [Enciclopedia](https://docs.google.com/document/d/11xNUoTcW7bBE3fq8wwBpmxIJmnfaZZnEeB9t47p1qKg/edit) menciona **dieciséis leyendas**, mientras el documento de Espíritus Deíficos presenta **dieciocho fichas**: posible discrepancia de versionado, causa **no acreditada**.
- **Cambios de identidad y parentesco mítico:** corroborado **Narga Solarys → Ganragán** como una sola identidad antes/después del destierro. **Pulkros** se describe como descendiente del **Espíritu del Submundo** y la **Quimera del Crepúsculo**, epítetos vinculados en el documento a **Ornuth Aium** y **Vaiel**; **no extrapolar** genealogías humanas ni apellidos. **Valujna** es lobo bautizado en la leyenda; **Mushuki**, figura felina de desenlace mortal.
- **Enciclopedia:** creado [registro de cronología y nombres astrales](cronologia-y-astroonimia-enciclopedia.md). Se separaron **Norluth** (dragón de acero), **Narelmayl** (dirigente del imperio), **Shadel** (individuo nombrado sin apellido), **Alleinn Nuj** (imperio) y **Thelne Saeras** (ciudadela). Nombres de **Kaeduin** (estrella), cinco planetas y **Vaiel** (satélite). **Vaiel** aparece también como entidad deífica: dos usos del mismo nombre, sin equiparación ontológica automática.
- **Cotejo de repertorios:** contrastadas **24 cadenas** (18 teónimos, Bajzurm, Narelmayl, Norluth, Narga Solarys, Alleinn Nuj y Shadel) en los tres archivos de producción de nombres de `main` y en el censo de 140 PNJ: **0 coincidencias literales por archivo** con límites de palabra y sin distinciones de mayúsculas. No son 24 identidades nuevas ni se ha hecho matching fonético.
- **Tres Gestas de Ylat:** se revisaron las versiones archivadas de [*La Peregrinación de Arloth*](https://naufragio.net/naufragio-d20-la-peregrinacion-de-arloth/) (publicada 2025-07-04), [*La Campana de Santa Verna*](https://naufragio.net/naufragio-d20-la-campana-de-santa-verna/) (publicada 2025-11-07) y [*La siega de los nombres*](https://drive.google.com/file/d/1xVmxqnQeKCKHw0XW195Qz759pWDdAXYM/view) (borrador 2026-10-09). Creado [corpus de gestas](corpus-gesta-personajes-ylat.md) con **11 denominaciones personales documentadas**, cinco de obras publicadas y seis de un **borrador pendiente de publicación**.
- **Personajes de las Gestas:** Arloth, Zarkon, Tomás Belardo, Ilythia, Santa Verna; Naira Vell, Aldo Reme, Liria, Miro, Berno y Joren (estos seis últimos **no publicados**). **Santa Verna** es tanto la patrona del lugar como una **aldea**; no segmentar como nombre «Santa» y apellido «Verna». En las fuentes **no** se acredita heredabilidad general de Belardo, Vell o Reme. Ninguna de las once cadenas coincide literalmente con censo de 140, catálogo provisional previo, auditoría de aventuras o los tres repertorios actuales en `main`.
- **Documentación y control:** ahora **23 documentos** en la rama de investigación, incluyendo los tres nuevos inventarios de esta sesión. Se han actualizado inventario de fuentes, catálogo provisional, matriz de elegibilidad, propuesta técnica y auditoría anterior. Se conserva el corte anterior de **88 denominaciones en Isophius/Malasthar/Biografías** sin sumar automáticamente categorías heterogéneas.
- **Estado editorial:** **ONO-01 a ONO-13 abiertas**; ninguna aprobación atribuida al autor. **No se han incorporado nuevos nombres a la generación de La Forja**. Se ha evitado el despliegue, la sincronización con `main` y la modificación de código o JSON de producción.

**Trabajo todavía pendiente:** ampliar otros relatos publicados de Ylat, hacer un recuento global de identidades en lugar de sumar denominaciones, y pasar cada caso por la matriz de elegibilidad solo cuando se disponga de permiso editorial específico. La investigación documental no está cerrada.


### 2026-11-02 — Novena sesión: relatos históricos y plan de cierre

- Relectura dirigida de *Historia de Shadaleen* y *Zonas de Ylat*: se documentan las **Siete Familias** y la versión rival **«La Primera Huella»**, atribuida a Aneris de Cálama. El segundo relato cuestiona el origen de Shadel, Shadelgast y Ananolis, sin ofrecer una resolución editorial definitiva.
- Se cotejan **Narga Solarys / Narga Solaris**, **Mirethia del Atardecer Coral**, **Iskadar el Segundo**, Rowes, Skara, Boll, Gull, Alogers y el topónimo Omudax. [Auditoría específica](auditoria-shadaleen-eponimos-y-relatos.md); nueva decisión **ONO-14**.
- Examen dirigido del texto extenso *Crónicas de Ylat d20*: la búsqueda por «nombre», «apellido», «familia» y «linaje» no encontró una regla formal de apellidos en los pasajes recuperados; no equivale a una lectura total del manual.
- [Plan de cierre](plan-cierre-y-criterios-aceptacion.md) creado: **tres bloques documentales pendientes** y **14 decisiones editoriales**, que no impiden necesariamente cerrar el informe de investigación con incertidumbres explícitas. No se modifican código, JSON ni `main`.


### 2026-11-02 — Décima sesión: consolidación, segunda pasada y acta documental

- Se extrajeron directamente los **416 testimonios tabulados** de las nueve agrupaciones de fuente de este corte (censo 140, aventuras 154, Isophius/casas 61, Malasthar 19, biografías 8, Gestas 11, teonimia 18 y Enciclopedia 5). La unión de los **382** registros de los cinco grupos C/A/I/M/B produjo **235 formas textuales** distintas, sin deducir un número de personajes.
- El [índice maestro **v1**](indice-maestro-testimonios-v1.md) registró **282 formas** al incorporar Gestas, teonimia y denominaciones dirigidas de Zonas/Shadaleen/cronología. Se contrastaron nombres con los archivos actuales de `main`; coincidencias literales: **1** con banco histórico, **12** con tesauro, **4** con listas de sexo.
- Una segunda revisión detectó **15 denominaciones** adicionales en [fuentes históricas y de borrador](adenda-fuentes-historicas-y-alias.md), incluida **Sumaeryn Maren** (variante de la monarca), **Robin Ranley**, los siete personajes clave del borrador **[PENDIENTE]** de Laventia y **Kah-Suran**, nombre adoptado por Caelia Fulgentis. Se guardó [**índice v2 de 297 formas**](indice-maestro-testimonios-v2.md).
- La [matriz de identidades y variantes](matriz-identidades-y-variantes-v1.md) documenta nombres adquiridos, alias, homonimias, suplantación y realidades. El [anexo de realidades](marcas-realidades-ylat.md) enumera **14 formas** del índice de Ylat³ y verifica `Realidad: Ylat⁴` en la ficha de Tegku.
- La [auditoría v2](auditoria-cierre-indice-y-repertorios.md) comprobó **297 filas, 297 cadenas únicas, numeración consecutiva, sin enlaces internos rotos**, y los mismos solapamientos literales con los tres repertorios actuales. La v1 se conserva como corte histórico; la v2 es el índice vigente del trabajo.
- Se creó el [**acta de cierre del corpus documental acotado**](acta-cierre-documental-corte-2026-11-02.md), con criterios A/B/C cumplidos en el alcance definido. **No** se proclama censo exhaustivo de todo Ylat, **no** se resuelven **ONO-01 a ONO-14**, **no** se habilitan apellidos ni se modifican datos/producto.


### 2026-11-02 — Undécima sesión: fase de validación editorial preparada (sin decisiones del autor)

- El **cierre documental** anterior se mantiene: [acta del corpus acotado](acta-cierre-documental-corte-2026-11-02.md), [índice maestro v2 de 297 formas](indice-maestro-testimonios-v2.md), 14 cuestiones pendientes. No se ha reabierto el alcance de fuentes ni autorizado nombres aleatorios nuevos.
- Se cotejó nuevamente [`data/tesauro-ylat.json`](../../data/tesauro-ylat.json) con el [inventario de componentes](auditoria-tesauro-componentes.md): **19 documentados** (17 personajes, 1 montaña, 1 oso) y **33 combinados** (4 con primer componente de lugar/animal, 3 con topónimo Felsaer como segundo componente, 7 con casa Boll/Shadelgast sin nuevo parentesco acreditado y 19 sin regla familiar específica). Son **registros almacenados**, no evidencias de cuántos personajes han sido generados.
- Inspección **solo de lectura** de `assets/rules.js` y `assets/sex.js`: el generador usa un RNG compartido; `primerNombre` no es parser de apellidos ni clasificador de entidades. En `tests/smoke.js` y `tests/alcance-drs.js` se comprueban tamaños **19/33/52** y comportamiento reproducible; **no se ejecutaron ni editaron tests**.
- Se preparó el [**dossier de validación editorial**](dossier-validacion-editorial-onomastica.md): identifica prioridades **P0 ONO-13 y ONO-04**, P1 ONO-05 y ONO-06, y mantiene las diez restantes como variantes/relaciones pendientes. No contiene votos ni aprobación atribuida a la autoría.
- Se documentó un [**plan de pruebas editoriales y de regresión**](plan-pruebas-editoriales-regresion-sin-codigo.md), sin escribir código, con identidad, eponimia, apodos, casas, realidades, determinismo de semillas y límites de publicación.
- En [la propuesta de integración](propuesta-integracion-sin-codigo.md) se corrigió la numeración duplicada de secciones 9 y se enlazaron los nuevos entregables, manteniendo explícitamente el estado **NO APROBADO**.
- No se alteraron datos/código de producción, la rama `main`, ni se abrió una PR funcional.
