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
| ESP-09 | Sustituir la tirada de las criaturas por una Tirada de Probabilidad d20. | **Hecho en documento Nocturna:** se conserva duración 1d4 Turnos; **pendiente:** autor no ha indicado umbral numérico para superar el d20. No se inventa valor. |
| ESP-10 | Sustituir «Nivel de Conjuro» por «Nivel del Círculo»; pide explicación del +2 de «Castigo del Reino Sombrío». | **Nomenclatura corregida** en dos fichas de Fuente de maná del documento Especies y en hoja Talentos. **Pendiente:** el +2 a la duración no indica unidad; daño +2 es plano salvo precisión editorial, pero duración +2 podría ser Turnos, Intervalos o unidad original del Conjuro. No se modifica el Talento sin respuesta. |
| ESP-11 | Corregir erratas. | **Hecho en documentos vivos:** «Puedes en distinguir» → «Puedes distinguir» (3 usos en Especies) y frase interrumpida en «Ladrón de almas» (Nocturna); Visión en la oscuridad corregida también en la hoja Talentos. **Pendiente:** revisión ortográfica completa en otras fuentes (DRS DOCX y extracciones históricas), sin reescribir automáticamente documentos de referencia ni fingir que las erratas ya no existen en el DRS. |

## Precauciones técnicas

- `02a/02b/02c` son **instantáneas históricas de extracción**; no reescribir sin actualizar procedencia y revisión. Los cambios editoriales de esta fecha se documentan aquí. Las fichas de texto vivo deberán **reextraerse** antes de validación final.
- En Forja se han actualizado **solo** las siete referencias `especie.talentos` que faltaban, en la rama del PR; los datos de ejecución no se han fusionado.
- La hoja «Ocupaciones» solo incorpora filas pendientes, **no** establece equivalencias de derivación; la hoja conserva otras filas antiguas incompletas para revisión editorial del autor.
- La regla «Chillido de ultratumba» no puede fijar una Probabilidad concreta hasta disponer de un umbral elegido por el autor.

## Preguntas abiertas

1. ¿Qué umbral debe superar la Tirada de Probabilidad (d20) de «Chillido de ultratumba»?
2. ¿Cómo se aplica el «+2 a duración» de «Castigo del Reino Sombrío»: en unidades de duración que ya usa cada Conjuro, o en una unidad fija?
3. ¿Qué Ocupaciones son derivadas de las cuatro básicas y cuáles de sus Talentos son sustituibles? Completar columna «Deriva de / referencia» en la hoja.
4. Revisar si existen versiones adicionales de textos compartidos que todavía no se han sincronizado con DRS.
