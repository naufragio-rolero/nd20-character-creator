# 122 — Ejecución Fase 1: sincronización DRS ↔ lista Talentos

**Fecha:** 2026-11-01 · **Estado:** matriz ejecutada, sin modificación del DRS original ni de efectos.

Se ha contrastado el subconjunto `Origen=Nd20` de la hoja nativa [Lista Talentos Nd20](https://docs.google.com/spreadsheets/d/1LLFbp7HO8EkC3M1zOEW1is0qvMz-D4n9AulIK2FIEgQ/edit) con las 24 transcripciones cotejadas de `NaufragioD20DRS.docx`, archivo SHA-256 `2f3447300e58139ce20c8449e12e5b8d3cd3e7435b2995677ed97c6602a23df8`. Resultados reproducibles y detalle individual en [122a — matriz JSON](122a-matriz-talentos-drs-excel.json).

- **22/22 identidades del Excel**, **24/24 relaciones del DRS** (15 Especie, 9 Ocupación); 13 talentos únicos de Especie, con **Baja estatura** y **Visión en la oscuridad** compartidos por dos propietarios. **Herencia dual (SE/SO)** separadas.
- **9/9 etiquetas de Ocupación** presentes en el original y coincidentes; **15/15 propuestas de Especie**, provenientes del Excel, no incorporadas al DRS. Las categorías siguen siendo Acción, Especial, Mejora, Pasiva y Reacción.
- **7/24 relaciones** contienen diferencia de redacción Excel/DRS, equivalentes a **6/22 entradas únicas** del Excel. El campo `coincidencia_efecto` señala cada una; **nunca se utiliza el efecto Excel como sustituto**. Las diferencias pueden ser erratas, abreviaciones o cambios sustantivos: no se corrigen en bloque.
- Las 121 entradas de otros orígenes se excluyen: Bitácora (89), Zelda (29) y Exploración (3).

## Propuesta de modificación del documento original (sin aplicar)

En la próxima edición del DRS, insertar **una línea de categoría inmediatamente después del título de cada Talento de Especie**, usando `categoria_excel` de las quince filas con `estado_categoria=propuesta_para_edicion_DRS`. No alterar texto, costes, requisitos ni efectos. Cada fila conserva fuente, ID, propietario y posición de párrafo. Las nueve etiquetas de Ocupación permanecen intactas.

## Incidencias editoriales sin resolver automáticamente

- **¡Sálvese quien pueda!**: categoría Excel **Reacción**; el efecto DRS conserva explícitamente **una Acción y 1 Punto de Esfuerzo**. No se deduce exención del coste de Acción.
- **Corpulencia**: Excel **Mejora**; el DRS conserva repetición de Blindaje mediante gasto condicionado de Esfuerzo.
- **Recuperación**: Excel/DRS **Pasiva**; el DRS menciona un Intervalo y Esfuerzo sin una etiqueta de Coste independiente.
- Los registros `efecto_excel` y `efecto_literal_drs` permiten una posterior revisión autoral por fila, sin cambiar la mecánica.

**Confirmación:** se ha verificado la clasificación en el documento de trabajo. **No existe aprobación expresa para una redacción nueva ni para modificar el DOCX**. Las categorías de Especie pueden figurar en la interfaz con procedencia Excel, nunca como etiqueta literal del DRS original.
