# Fase 2 — Extracción preliminar de Talentos de Especies

**Fecha:** 2026-10-28.  
**Cobertura:** 44 Especies y **115 relaciones Especie–Talento** de Fantasía/DRS, Fantasía ampliada (Ylat/Hyrule), CiFi y Nocturna.  
**Estado:** **texto fuente extraído**, pendiente de desglose completo y **validación editorial**. No se cambia código ni se atribuyen reglas nuevas.

## 1. Archivos de extracción

| Repertorio | Fijos | Elegibles | Opcionales | Total | Procedencia |
|---|---:|---:|---:|---:|---|
| [DRS y CiFi](02a-extraccion-especies-drs-cifi.json) | 25 | 0 | 0 | **25** | `NaufragioD20DRS.docx` (15) y `NaufragioD20CiFi.docx` (10) |
| [Ylat y Hyrule](02b-extraccion-especies-ylat-hyrule.json) | 44 | 0 | 14 | **58** | [Documento vivo de Especies](https://docs.google.com/document/d/1XmjW6AUwt8Yyl3ZpXp7u73DE5j7jxDxf2rcMVRc8V3s/edit), pestañas «Especies de Ylat» y «The Legend of Zelda» |
| [Nocturna](02c-extraccion-especies-nocturna.json) | 8 | 24 | 0 | **32** | [Documento vivo de Nocturna](https://docs.google.com/document/d/15_9raDHK4Cr_LC4YPAmTTYm3K27V06-2-gF8FrmHm28/edit), pestaña «NaufragioD20Nocturna» |
| **Total** | **77** | **24** | **14** | **115** | |

Los documentos vivos incluyen su **ID de revisión** y posición de fuente (`indice_inicio`/`indice_fin`) en cada registro. Para los DOCX se anota el **número de párrafo de origen** contado en el documento, no una página impresa; el número de página no está determinado. Cada registro es contextual: sistema, Especie y Talento. 

## 2. Estructura documental

Cada ficha contiene `id_documental`, `sistema`, `especie`, `talento`, `tipo`, `texto_literal`, `fuente`, `estado` y, cuando la fuente dispone de etiquetas independientes, `activacion_literal`/`coste_literal`/`requisitos_literal`. Se han preservado los textos de efecto, incluidas erratas de la fuente; **los campos `null` indican que no se ha extraído una etiqueta separada, no que no exista coste, condición, activación o escalado en el texto**. El desglose sistemático de restricciones en prosa queda para revisión.

En Nocturna, las tres alternativas por Especie se han separado de su apartado «Talentos a elegir». Se conserva también `linea_fuente_literal`, y en «Aliados en las sombras» se vincula como `texto_ampliacion_literal` el desarrollo reglamentario del apartado posterior «Aliado en las sombras» (incluido el recurso Dado de Aliado).

## 3. Comprobaciones realizadas

- **115 registros extraídos = 115 relaciones del [inventario nominal](01a-talentos-especies.csv)**. Las dos variantes de «Herencia dual» se han emparejado por la Especie porque el DRS utiliza el mismo encabezado para efectos diferentes; los alias contextuales de Forja se conservarán en validación.
- **44 Especies**, **115 identificadores documentales diferentes**, **0 efectos vacíos** y **0 entradas sin correspondencia en el inventario**.
- Los **7 Talentos fijos ausentes de las listas de Forja** están en el repertorio de Ylat/Hyrule, sin incorporarlos a los JSON de ejecución.
- Los **14 Talentos opcionales de Hyrule** tienen ficha separada, sin alterar la adquisición en el generador.
- Los **24 Talentos elegibles de Nocturna** se localizaron bajo sus 8 Especies y se transcribieron individualmente.

## 4. Pendientes reales para la siguiente sesión

1. **Desglose mecánico:** comprobar por separado costes mencionados dentro de la prosa, activación, condiciones/requisitos, Duración, alcance y escalado por Nivel. No inferir propiedades ausentes.
2. **Adquisición:** determinar según la fuente cuándo y cómo se eligen los Talentos opcionales de Hyrule y los elegibles de Nocturna; el tipo ya está catalogado, pero la regla de adquisición no está cerrada.
3. **Homónimos y variantes:** verificar reglas con el mismo título en sistemas distintos (p. ej., «Corpulencia», «Rapidez», «Buen desarrollo») y «Herencia dual» de Semielfo/Semiorco. No deduplicar solo por nombre.
4. **Discrepancias con Forja:** conciliar documentalmente los 7 fijos omitidos y los 14 opcionales no indexados antes de modificar datos de personajes.
5. **Vínculos internos:** inspeccionar referencias a otros Talentos, Poderes y apartados, especialmente «Aliados en las sombras», «Vínculo psiónico», «Fuente de maná» y «Legado del océano».
6. **Fidelidad de fuente:** contrastar posibles revisiones y erratas; los textos se han preservado literalmente y no se corrigen sin una decisión editorial.

## 5. Separación de fases

- **Inventario:** completo (fase anterior).
- **Extracción del texto por Talento:** **completa** para las 115 relaciones; archivos versionados.
- **Extracción de campos mecánicos normalizados:** **pendiente de revisión**; hay etiquetas `Pasiva`, `Acción` y `Coste:` identificadas allí donde son explícitas.
- **Validación y canon:** **no realizada**. El estado de las fichas es `extraido_pendiente_validacion`.
- **Integración y pruebas:** **no iniciadas**.

*No utilizar estos JSON como sustitutos automáticos de los datos oficiales empleados actualmente por Forja.*
