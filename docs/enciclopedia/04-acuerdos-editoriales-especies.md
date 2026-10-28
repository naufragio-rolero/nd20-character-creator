# Acuerdos editoriales — revisión de Talentos de Especies

**Fecha:** 2026-10-28. **Autoridad:** instrucciones explícitas del autor en la conversación. Se distingue entre fuente histórica, documento vivo, hoja maestra y datos de Forja. Las decisiones no confirmadas quedan abiertas.

| Hallazgo | Decisión del autor | Estado y actuación |
|---|---|---|
| ESP-01 | Añadir los siete Talentos fijos omitidos desde el documento de Especies. | **Hecho en la rama PR #3:** `data/catalogo-ampliado.json`; no fusionado. Elfo celestial/Fuente de maná, Enano selvático/Hambre caníbal, Gnomo sylestri/Fuente de maná, Humano malasthino/Adaptación, Mediano jóbito/Baja estatura, Deku/Pequeño, Kokiri/Pequeño. |
| ESP-02 | Consultar «Lista Talentos Nd20» → Ocupaciones; añadir ausentes. | **Hecho en hoja original:** añadidas 15 filas (Derviche, 6 CiFi, 8 Nocturna), incluida una fila propia «Psion» CiFi para distinguirla de la anterior. Columna «Deriva de / referencia», vacía de decisiones y marcada «Pendiente de clasificar». **No se deduce** derivación a partir de categorías como «Combatiente». |
| ESP-03 | «Baja estatura» igual a DRS para todos; «Pequeño» ofrece igual beneficio sin penalización de Movimiento. | **Hecho:** dos perfiles «Baja estatura» en documento de Especies actualizados con +1 a esquiva a distancia; ficha de «Baja estatura» de la hoja maestra corregida. «Pequeño» se mantiene como talento separado, sin reducción de Movimiento. |
| ESP-04 | «Herencia dual» de Semielfo y Semiorco son dos talentos distintos aunque compartan denominación. | **Documentado:** preservar IDs distintos por Especie y alias contextuales (SE/SO). Ya hay dos fichas independientes en Forja y en la extracción. |
| ESP-05 | «Escudo eléctrico» usa 4 metros de radio alrededor; «Estallido escupefuego», 2 metros de radio desde el impacto. | **Hecho:** corregido documento de Especies y hoja Talentos. |
| ESP-06 | «Hálito de energía» causa 1d4 de daño en Niveles 1–5. | **Hecho:** documento de Especies y hoja Talentos; se explicitan tramos progresivos (1d4, 2d4 desde N6, 3d4 desde N12, etc., siguiendo la fórmula original). |
| ESP-07 | Solicita explicación de costes y efectos según condición. | **Explicado, sin modificaciones:** Vuelo: despegar desde altura/corriente sin coste explícito, salto con 1 Esfuerzo; mantenimiento requiere Tirada de Resistencia o 1 Esfuerzo. Fuente de maná: si lanzas Conjuros, recuperas el recurso/Conjuro mediante meditación y descanso; si no, eliges un Conjuro y lo lanzas una vez al día. Vínculo psiónico: un Psion obtiene 2 Ímpetus adicionales; otras Ocupaciones eligen un poder lanzable por 1 Esfuerzo. Un solo campo «Coste» por talento sería insuficiente. |
| ESP-08 | Vincular «Aliados en las sombras» a sus reglas ampliadas. | **Documentado** en `04a-vinculos-talentos-especies.json`: enlace de la ficha a apartado «Aliado en las sombras», con Salud del aliado, DAL, descansos y tres tipos; sin cambio todavía en UI. |
| ESP-09 | «Chillido de ultratumba»: **«Tienes una Probabilidad 11+ de que queden paralizadas durante 1d4 Turnos»**. | **Cerrado por el autor:** documento vivo de Nocturna actualizado (Probabilidad 11+, radio de 10m, 1 Esfuerzo y duración 1d4 Turnos conservados). Sin tiradas del Cronista. |
| ESP-10 | «Nivel del Círculo» para «Fuente de maná». «Castigo del Reino Sombrío»: **+2 al daño; +2 Turnos a la Duración solo para Conjuros con «Duración: X Turnos»**. | **Cerrado por el autor:** corregidos documento vivo de Especies y hoja «Talentos» (H138); no se aplica ese +2 a duraciones expresadas en Intervalos u otras unidades. Se conserva la pérdida de 1 Salud por lanzamiento. |
| ESP-11 | Corregir erratas. | **Hecho en documentos vivos:** «Puedes en distinguir» → «Puedes distinguir» (3 usos en Especies) y frase interrumpida en «Ladrón de almas» (Nocturna); Visión en la oscuridad corregida también en la hoja Talentos. **Pendiente:** revisión ortográfica completa en otras fuentes (DRS DOCX y extracciones históricas), sin reescribir automáticamente documentos de referencia ni fingir que las erratas ya no existen en el DRS. |

## Precauciones técnicas

- `02a/02b/02c` son **instantáneas históricas de extracción**; no reescribir sin actualizar procedencia y revisión. Los cambios editoriales de esta fecha se documentan aquí. Las fichas de texto vivo deberán **reextraerse** antes de validación final.
- En Forja se han actualizado **solo** las siete referencias `especie.talentos` que faltaban, en la rama del PR; los datos de ejecución no se han fusionado.
- La hoja «Ocupaciones» solo incorpora filas pendientes, **no** establece equivalencias de derivación; la hoja conserva otras filas antiguas incompletas para revisión editorial del autor.
- «Chillido de ultratumba» ya tiene Probabilidad **11+** aprobada; «Castigo del Reino Sombrío» solo recibe **+2 Turnos** cuando su duración se expresa en Turnos. Ambas decisiones se han aplicado a las fuentes vivas.

## Preguntas abiertas

1. ¿Qué Ocupaciones son derivadas de las cuatro básicas y cuáles de sus Talentos son sustituibles? Completar columna «Deriva de / referencia» en la hoja.
2. Revisar si existen versiones adicionales de textos compartidos que todavía no se han sincronizado con DRS.

## Cierre de las decisiones ESP-09 y ESP-10

El 2026-10-28 el autor fijó literalmente estas dos reglas:

- **Chillido de ultratumba (Jiangshi):** «Tienes una Probabilidad 11+ de que queden paralizadas durante 1d4 Turnos». Se mantienen el radio de 10m y el coste de 1 Punto de Esfuerzo. Actualizado [Nocturna](https://docs.google.com/document/d/15_9raDHK4Cr_LC4YPAmTTYm3K27V06-2-gF8FrmHm28/edit).
- **Castigo del Reino Sombrío (Gerudo):** +2 al daño; si el Conjuro tiene «Duración: X Turnos», aumenta **2 Turnos** su Duración; no se aplica a duraciones medidas en Intervalos. Se mantiene la pérdida de 1 Punto de Salud por lanzamiento. Actualizado [Especies](https://docs.google.com/document/d/1XmjW6AUwt8Yyl3ZpXp7u73DE5j7jxDxf2rcMVRc8V3s/edit) y [Lista Talentos Nd20 · Talentos!H138](https://docs.google.com/spreadsheets/d/1LLFbp7HO8EkC3M1zOEW1is0qvMz-D4n9AulIK2FIEgQ/edit).

Se conserva el estado histórico de los JSON `02*`, por lo que no se debe usar su texto previo para reemplazar las versiones vivas actualizadas. Para el siguiente paso de integración, consultar `04b-talentos-especies-aprobados.json`.

## Verificación posterior de sincronización — 2026-10-28

Se han contrastado los 90 registros históricos de Ylat/Hyrule y Nocturna contra sus documentos vivos. **ESP-09 y ESP-10 están sincronizados** con el registro canónico `04b` y, en el caso de Castigo, con `Talentos!H138`. Se identificaron **13 fichas con diferencias**; sus textos vigentes se conservaron en [05a-fichas-especies-vigentes.json](05a-fichas-especies-vigentes.json), con revisión y procedencia. Véase [informe de conciliación](05-conciliacion-fuentes-vivas-especies.md). Las instantáneas `02*` no se han modificado. Se detectó además una errata aún presente en «Morador de las profundidades» («puedes en distinguir»); **ESP-11 no está cerrado por completo**.
