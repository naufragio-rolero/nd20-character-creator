# 121 — Plan de ejecución en cinco fases: DRS, Talentos y Forja

**Fecha:** 01/11/2026. **Estado:** **plan documentado; ninguna fase implementada por este trabajo**. **Política de fuentes y registro de confirmaciones:** [120](120-procedencia-consolidacion-confirmacion-talentos.md). **Seguimiento central:** [PLAN-DE-TRABAJO](PLAN-DE-TRABAJO.md).

## Objetivo y condiciones generales

Convertir el DRS, **documento original**, y la lista de Talentos, **documento de trabajo**, en una consulta de Forja concisa, inmediata y fiel a sus fuentes. Preparar el mismo método para **otros documentos que se añadirán después**, sin mezclar sus reglas, propietarios ni estados de publicación.

**Los únicos cinco valores de categoría son `Acción`, `Especial`, `Mejora`, `Pasiva` y `Reacción`.** La lista Excel sirve como referencia editorial de estas categorías. Las reglas del DRS no se sustituyen por glosas, y las clasificaciones de Especie que todavía no aparecen formalmente en el manual deben conservar su procedencia hasta que se incorporen documentalmente.

**Fuera de alcance:** inventar tiempos de activación, alterar costes o efectos, automatizar combate, reescribir silenciosamente el DRS, importar suplementos al DRS público, fusionar la [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) por dependencia casual o modificar las 111 descripciones de Equipo sin necesidad. La Forja publicada permanecerá funcional durante el desarrollo aislado.

## Fase 1 — Procedencia y sincronización DRS ↔ lista de Talentos

**Entrada:** `NaufragioD20DRS.docx` como **original**, `Lista Talentos Nd20.xlsx` como **clasificación de trabajo** y los catálogos actuales de la Forja. La auditoría previa [120](120-procedencia-consolidacion-confirmacion-talentos.md) es punto de partida, no sustituto de la ejecución.

**Tareas:**
1. Establecer las claves por **origen, ID, propietario y variante**; no relacionar Talentos solo por nombre.
2. Cotejar **22 entradas Nd20** del Excel con las **24 asignaciones DRS** (15 de Especie, nueve de Ocupación). Preservar los dos talentos compartidos y las dos variantes de *Herencia dual*.
3. Mantener las nueve etiquetas de Ocupación **ya presentes en el DRS**; preparar la incorporación de las 15 categorías de Especie **provenientes del Excel**.
4. Registrar sin resolver automáticamente los casos de **¡Sálvese quien pueda!** (`Reacción` en el Excel y coste de `una Acción` en el efecto original), *Corpulencia* y *Recuperación*. Distinguir las diferencias de redacción de los efectos.
5. Crear un registro de decisión para cada etiqueta propuesta: fuente, estado de cotejo, decisión autoral y ubicación prevista en una futura edición del DRS.
6. Conservar los **121 Talentos de otros orígenes** fuera del DRS público: 89 Bitácora, 29 Zelda, tres Exploración, pendientes de cotejo individual.

**Entregable:** matriz de trazabilidad y propuesta **de edición documental** del DRS, sin aplicar modificaciones al original sin aprobación.

**Criterio de cierre:** 22/22 entradas DRS con identidad y categoría del Excel, 24/24 relaciones mapeadas, nueve etiquetas originales reconocidas y 15 propuestas identificadas como propuestas; conflictos señalados, **ninguna regla mecánica modificada**.

## Fase 2 — Recuperar los popups de consulta inmediata

**Objetivo:** que la Forja vuelva a utilizar el **hover** como vista rápida de la regla, sin perder la posibilidad de leer un texto largo.

**Tareas:**
1. Recuperar la aparición al pasar el puntero sobre el vínculo, también para Talentos; evitar que el texto desaparezca cuando el usuario mueve el puntero del vínculo a la tarjeta.
2. Mantener **clic para fijar** la tarjeta y poder desplazarse sin cierre accidental. Escape, botón Cerrar y clic externo deben comportarse de forma predecible.
3. Preservar apertura por **foco de teclado**, navegación y cierre accesible, además de interacción táctil sin dependencia exclusiva del hover.
4. Establecer límites adaptables al viewport en escritorio y móvil, control de desplazamiento y retorno del foco cuando corresponda.
5. No reintroducir el problema histórico de popup sustituido por hover sobre otra referencia mientras uno está fijado.

**Entregable:** componente único de consulta rápida/fijada y pruebas de transición entre vínculo y popup.

**Criterio de cierre:** hover funcional, clic fijo desplazable, Escape y cierre verificables, teclado y táctil accesibles; popups largos legibles en Chrome, Firefox y WebKit **sin alterar el contenido**.

## Fase 3 — Volver al texto único del DRS y a sus cinco categorías

**Tareas:**
1. En la vista normal, mostrar: **nombre, propietario, categoría (una de las cinco), campos reglamentarios existentes y una única descripción**. Usar el texto DRS; no resumirlo por sistema si ya está redactado para consulta rápida.
2. Retirar la repetición automática de **«En pocas palabras»**, **«Tipo de uso (guía editorial)»**, **«Leer texto íntegro del DRS»** y otras copias del mismo efecto cuando no aportan información nueva.
3. Mostrar **Acción, Especial, Mejora, Pasiva o Reacción** usando las categorías verificadas en el Excel, manteniendo una marca de procedencia interna en los casos de Especie aún no incorporados formalmente al DRS.
4. Recuperar el lenguaje visual de las **cinco categorías**, respetando los nombres y el contraste legible en Clásico, Ébano, Cerúleo y Obsidiana. No usar el color como único identificador.
5. No inventar campos ni aplicar efectos del generador a partir de estas categorías; **clasificación no equivale a automatización de reglas**.

**Entregable:** nueva presentación compacta de los 24 Talentos DRS, con textos de origen íntegros y sin redundancias.

**Criterio de cierre:** cada popup presenta **una** descripción reglamentaria en vista normal y una de las cinco categorías; la lectura rápida es más breve en estructura, sin omitir ni cambiar el efecto.

## Fase 4 — Aclaraciones autorales y revisión del documento original

**Tareas:**
1. Trasladar aclaraciones que no estén incorporadas al DRS original a **Opciones avanzadas → Detalles técnicos**, fuera del popup ordinario.
2. Para **Expulsar muertos vivientes**, preparar una **propuesta de redacción del DRS** que pueda integrar las tiradas agrupadas para criaturas idénticas; conservar intactos alcance, Niveles, Probabilidad, costes y duración.
3. Examinar las otras aclaraciones autorales de la Forja con el mismo criterio: texto vigente original, comentario aprobado, nueva redacción propuesta y estado de aprobación.
4. Incorporar al DRS **solo** textos que hayan recibido confirmación autoral específica; entonces eliminar la aclaración duplicada de la interfaz y actualizar la transcripción con referencia de revisión.
5. Conservar el histórico anterior para auditar qué cambió, cuándo y por decisión de quién.

**Entregable:** propuestas de modificación del DRS y registro de aclaraciones vigentes/trasladadas/integradas; ningún cambio silencioso del manual.

**Criterio de cierre:** popup ordinario sin aclaraciones redundantes; todas las aclaraciones no integradas accesibles solo desde Detalles técnicos; redacciones nuevas identificadas como **pendientes de aprobación** hasta decidirse.

## Fase 5 — Pruebas, confirmación y promoción controlada

**Tareas:**
1. Verificar **24/24 asignaciones DRS**, **22/22 entradas únicas** y las cinco etiquetas contra el inventario; no confundir 143 entradas totales con contenido DRS aprobado.
2. Comparar **texto literal DRS** con cada popup; probar cinco categorías, homónimos, propietarios, *Herencia dual (SE/SO)* y los tres casos editoriales señalados.
3. Ejecutar E2E de hover/fijación/scroll/cierre/foco en **Chrome, Firefox y WebKit**, con capturas en móvil/escritorio y los cuatro temas visuales.
4. Verificar el paquete público estricto y la lista blanca: **ningún Talento de Bitácora, Zelda o Exploración** se incorpora automáticamente por estar en el Excel; no filtrar contenido CiFi, Nocturna u otros suplementos no autorizados.
5. Exigir las **cuatro suites CI verdes**, revisión de capturas, aprobación de las decisiones editoriales pendientes y promoción por **SHA fijado**. Comprobar desde la web pública el contenido y la ausencia de regresiones; mantener posibilidad de volver al commit anterior.

**Entregable:** informe de regresión, matriz de coincidencia DRS/Forja y candidato de publicación controlada.

**Criterio de cierre:** controles y aprobación satisfechos, trazabilidad intacta y ningún cambio mecánico no autorizado; la versión pública no se actualiza antes de este control.

## Orden, dependencias y control del alcance

| Paso | Depende de | Decisión necesaria | Estado |
|---|---|---|---|
| **1. Fuente y clasificación** | DRS + Excel y auditoría [120](120-procedencia-consolidacion-confirmacion-talentos.md) | Confirmar discrepancias y propuesta documental | **Pendiente de ejecución** |
| **2. Hover y fijación** | Contrato de consulta claro, sin cambios de reglas | Aceptar comportamiento de UI descrito | **Pendiente de ejecución** |
| **3. Vista compacta** | Datos identificados y clasificación de cinco valores | Validar que no hay glosas redundantes | **Pendiente de ejecución** |
| **4. Aclaraciones** | DRS original y registro de aprobaciones | Aprobar **redacción nueva**, no solo clasificación | **Pendiente de ejecución** |
| **5. QA y lanzamiento** | Fases 1–4 y candidato aislado | Autorizar publicación y controlar la web | **Pendiente de ejecución** |

Se documentarán los resultados de cada paso y solo se marcará `[x]` cuando exista evidencia. **Las fases no están ejecutadas por crear este plan.** La [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) continúa independiente: sus fichas adicionales de Equipo no se fusionarán automáticamente con esta tarea.

## Extensión futura del sistema documental

Cuando lleguen nuevas fuentes, se abrirá **una ficha de origen por documento** y se registrarán sus Talentos y relaciones con el DRS. La hoja común puede dar una visión global, pero **no borrar el origen de cada regla**. El DRS seguirá siendo el documento de arranque y la autoridad normativa sobre su propia edición; las futuras publicaciones serán ampliaciones trazables y autorizadas por ámbito.
