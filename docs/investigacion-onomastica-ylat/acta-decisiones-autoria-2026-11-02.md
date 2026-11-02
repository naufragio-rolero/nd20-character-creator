# Acta editorial de onomástica de Ylat — decisiones expresas de autoría

**Fecha:** 2026-11-02. **Origen:** respuestas directas de la autoría en la conversación que siguió al [dossier editorial](dossier-validacion-editorial-onomastica.md). **Estado:** **14 decisiones de criterio cerradas por autoría (ONO-01 a ONO-14)**. Este documento **recoge decisiones de autoría**, a diferencia de las recomendaciones provisionales de fases anteriores. **No** es un registro de implementación técnica ni modifica automáticamente fuentes históricas.

## 1. Decisiones expresas

| ID | Criterio fijado por la autoría | Aplicación documental / alcance exacto | Estado |
| --- | --- | --- | --- |
| **ONO-01** | **Aerandil del Atardecer Brillante** | Preferencia editorial frente a **Refulgente** de fichas y censo. La respuesta de autoría escribió «Atarceder»; se interpreta como errata mecanográfica por el contexto de los dos TXT originales, que escriben **Atardecer**. Mantener las formas antiguas como testimonios, sin corregir silenciosamente los originales. | **Fijada** |
| **ONO-02** | **Dyeld es el padre canónico de Tuliëlle.** Resolución expresa de autoría posterior a las primeras trece decisiones. | El relato autobiográfico y la ficha de Laevinë identifican a Dyeld. La ficha de Eldburg aporta una versión contradictoria que se conserva **como testimonio histórico, no como parentesco canónico**. No fusionar a Dyeld y Eldburg ni alterar la fuente sin acción editorial distinta. | **Cerrada por autoría** |
| **ONO-03** | **Vrymmir Borgernstâg** | Forma editorial preferida **Borgernstâg**; conservar **Borgenrstâg** en testimonio antiguo. | **Fijada** |
| **ONO-04** | **Permitir apellidos nobiliarios/de casa en la generación con un peso muy bajo** | Se levanta el veto propuesto a su **reutilización creativa**; no se atribuye parentesco canónico al personaje resultante. **«Muy bajo» es criterio cualitativo**: no hay proporción ni peso numérico dado por la autoría; hay que acordar/implementar ponderación futura. | **Criterio fijado; implementación y magnitud pendientes** |
| **ONO-05** | **Mezclar identidades y épocas** en generación | No filtrar nombres por **Ylat¹/Ylat³/Ylat⁴** ni por época al construir un **nombre aleatorio**. Se preservan **fuente, realidad e identidad original** en la consulta histórica, para no convertir actores distintos en una misma ficha canónica ni transformar ficción combinatoria en hechos del mundo. | **Fijada** |
| **ONO-06** | **Conservar la convención eladrín, no utilizarla** | Queda como material de **consulta**; no se implementa la mecánica de apéndices por nacimiento ni se generan denominaciones mediante ella. | **Fijada** |
| **ONO-07** | **Saewig Rowes en Ylat¹; Saewig Shadelgast en Ylat³** | Resolución por **realidad explícita**: dos denominaciones válidas en sus respectivos ámbitos. No reinterpretar ninguna como error genérico ni cambiar genealogías sin evidencia. | **Fijada** |
| **ONO-08** | **Car'rt Oq'uatee** | Forma editorial; conservar **Kaart Oquati** como variante de fuente. El material no autoriza presentar Lenseng/Melora como incompatibles automáticamente. | **Fijada** |
| **ONO-09** | **Eomdyn Noreesh** | Forma editorial; conservar **Emodyn** como variante textual. | **Fijada** |
| **ONO-10** | **Leezar Lockbruck**, **hermano de Thingrim Lockbruck** | La hermandad es **aclaración canónica expresamente comunicada por la autoría en esta conversación**, no parentesco supuesto a partir de que compartan apellido. Conservar **Leezar Theroux** como testimonio previo sin inventar causa del cambio textual. | **Fijada, vínculo familiar confirmado por autoría** |
| **ONO-11** | **Alim de Mostáganem** | La **tilde recae en la primera a de -tá-**: **Mostáganem**, no la grafía provisional **Mostagánem**. Conservar las otras variantes y el carácter **toponímico/de procedencia**, no apellido heredable. | **Fijada** |
| **ONO-12** | **Janus II Achgate** | Forma editorial; el **II** es ordinal del personaje y no parte del apellido familiar; conservar **Janus Achgate II** como forma alternativa de la crónica. | **Fijada** |
| **ONO-13** | **Máthair Felsaer es una montaña; Pietro es el oso de una jugadora. No constituyen un error del mundo de Ylat.** | Mantener sus registros documentales y **no aplicar el filtro de exclusión propuesto** ni eliminar combinaciones por iniciativa del asistente. Se debe conservar la clasificación correcta de **lugar** y **animal**, sin presentar esas entidades como **personas canónicas**. La mención «Felsar» en la respuesta se considera **referencia a la montaña documentada como Felsaer**, no decisión expresa de renombrar el topónimo. | **Criterio fijado; sin eliminación autorizada** |
| **ONO-14** | **Narga Solarys** | Forma editorial; conservar **Narga Solaris** como variante en *Zonas de Ylat*. No desdoblar la identidad **Ganragán**. | **Fijada** |

## 2. Alcance de la decisión ONO-13

La objeción **no era** que existiera una montaña con nombre o que un animal pudiera llamarse Pietro. Ambos son nombres propios documentados válidos. El riesgo técnico/editorial era tratarlos **como prueba de antropónimo de personaje** al generar combinaciones como `Máthair Eldarien` o `Pietro Brice`. La autoría no desea excluir por defecto esos registros: **se conserva lo que hay**, con su tipo documental y sin describir los nombres derivados como genealogías o personas canónicas.

No está aprobada ninguna normalización destructiva de esa fuente. Un nombre compartido por animal y humano **podría ser válido** si existiese testimonio o la herramienta lo propusiese como ficción; no deducir identidad de la homonimia.

## 3. Implementación distinta de decisiones ya fijadas

**Importante: la política de reutilización creativa queda fijada, pero la implementación continúa pendiente.**

- **ONO-04 / peso muy bajo:** en el `main` consultado, `assets/rules.js` usa `escoger(poolNombres,rng)`, una elección **uniforme entre entradas**, sin una tabla de probabilidades nobiliarias. La respuesta de autoría **no asigna un valor numérico**. Para llevar este criterio al código habrá que implementar o adaptar una ponderación que evite alterar arbitrariamente otros pasos del RNG; no inventar `1%`, `0.1`, etc. como canon.
- **ONO-05 / mezcla:** la herramienta podrá combinar los repertorios de nombres de cualquier época/realidad cuando se implemente ese comportamiento; la fuente real de cada personaje documentado sigue intacta para consulta.
- **ONO-06 / no usar:** ningún generador nuevo de apéndices de nacimiento eladrines se deriva de estas fuentes.
- **ONO-13 / no eliminar:** la clasificación de Máthair como montaña y de Pietro como oso se conserva; no se ordena borrar entradas ni combinaciones.
- **Nombre canónico frente a forma archivada:** las grafías elegidas **no obligan a reescribir en masa** textos históricos ya publicados ni fichas originales. Deben figurar como preferencias editoriales en el índice y como variantes en los registros de procedencia.

## 4. Resolución final de la paternidad de Tuliëlle — ONO-02

**La autoría confirma expresamente: «Dyeld es el padre de Tuliëlle».** Se registra esta decisión como **hecho canónico**, y la cuestión **ONO-02 queda cerrada**.

- **Dyeld** es la **paternidad canónica**.
- **Eldburg** permanece como personaje distinto: el testimonio de su ficha que afirma otra paternidad se registra como **contradicción documental anterior** sin valor de corrección canónica vigente.
- No se reconstruyen relaciones no documentadas ni se reescriben la autobiografía, la ficha de Laevinë o la ficha de Eldburg por este acto de registro.
- La resolución es **autoría confirmada**, no un resultado que se haya inferido automáticamente por mayoría de fuentes.

**Estado editorial definitivo del corte:** **14/14 ONO cerradas**. **Estado técnico:** pendiente de implementación del comportamiento aprobado para La Forja, incluida la cuantificación del peso «muy bajo» de apellidos de casas; **ningún cambio funcional ejecutado**.
