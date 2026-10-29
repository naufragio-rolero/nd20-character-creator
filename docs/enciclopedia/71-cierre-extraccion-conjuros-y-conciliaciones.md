# Tanda 4 — Cierre de extracción literal y auditoría del Tomo de Magia

**Fecha:** 29 de octubre de 2026. **Fuente principal:** [NaufragioD20 — Tomo de Magia, orden alfabético](https://docs.google.com/document/d/19hwP2K85Fo-HfThA9CBLQwCXxrl9ye0krcVLexLs5iM/edit), revisión `AHj4eMSakAdRcSROgewlZQPBtL1DsHjLCh3EMptd-2mmMR4RGtTttzPMCMDUVf5e4d-TM40FEZU85zoScJEE3Q`.

## Trabajo completado

- **434/434 fichas transcritas**, con todos sus párrafos de texto íntegro en 18 archivos JSON [69a–69r](69a-conjuros-alfabeticos-001-025.json) (rango de 25 fichas, último de 9).
- Cada ficha conserva el título y ordinal del Tomo, revisión y párrafos de origen, texto literal y posibles identidades de `data/catalogo-poderes.json`.
- **Verificación literal posterior: 434/434 registros iguales a la fuente Google Docs**, cero diferencias entre el contenido publicado y el texto de esa revisión. [Auditoría](70b-auditoria-conjuros-434.json).
- [Índice de 434 Conjuros](70a-indice-conjuros-434.json) con los campos literales de Círculo, Escuela, Alcance, Duración, Lanzamiento y Requisito, cuando existen. No se han inventado valores donde faltan.
- [Auditoría de etiquetas](70c-etiquetas-conjuros-y-conciliacion.json): 91 fichas con etiquetas independientes explícitas en el Tomo; **23 diferencias** frente a las etiquetas del catálogo, que pueden responder a criterios de fuentes distintos.

### Metadatos

| Campo | Registros |
|---|---:|
| Nombre, Escuela y Alcance literal | 434/434 |
| Círculo literal | 433/434 |
| Círculo ausente en fuente | 1 |
| Diferencias de Escuela o Círculo cuando ambos documentos dan el dato | 0 |

La ausencia de Duración o Lanzamiento en determinadas fichas no se ha interpretado como error: son campos opcionales y se mantienen vacíos si el original no los declara.

## Conciliaciones de identidad y fuente

| ID | Cuestión | Acción segura |
|---|---|---|
| CONJ-01 | El Tomo incluye dos fichas **idénticas** tituladas «Arma elemental» (ambas de Tercer Círculo). El catálogo registra una sola. | Documentar duplicado; no crear dos efectos. |
| CONJ-01 | El catálogo incluye «Ira celestial» en los Círculos **3 y 5**; el Tomo documenta únicamente la ficha de **Quinto Círculo**. | No eliminar ni atribuir el efecto de Quinto al registro de Tercero sin decisión. |
| CONJ-02 | «Contrato de fraternidad» no dice Círculo en el Tomo; el catálogo lo asigna al **Cuarto**. | Conservar `circulo_tomo: null` y señalar Cuarto como dato del catálogo, no de la fuente. |
| CONJ-05 | «Glosolalia mayor» en el Tomo y «Glosolalia mayor †» en el catálogo. | Comparar como candidato de identidad, pero preservar ambos nombres literales. |
| CONJ-06 | **23 diferencias de etiquetas**: 12 menciones a «Magia curativa» solo en el Tomo, «Invocación» de «Alzar esqueleto secuaz» solo en el Tomo, y 10 marcas «Maldición» solo en el catálogo. | No copiar ni borrar automáticamente; preservar la procedencia de cada etiqueta. |

**Distinción importante:** las diferencias de etiquetas no prueban errores. El catálogo puede incorporar clasificación procedente de otras fuentes, y el Tomo contiene marcas explícitas en sus textos.

## Dos Conjuros del manual de Ocupaciones

«Dardo de penumbra» y «Portal sombrío» aparecen también en [43a, fuente Ocupaciones](43a-conjuros-nictomancia-manual-ocupaciones.json), con misma Escuela, Círculo y efecto. En «Portal sombrío» el único contraste detectado es espacio final de párrafo; la redacción sustantiva coincide. **No se suman dos nuevas fichas** a las 434.

**OCP-17, pendiente:** «Portal sombrío» habla de «nictomante» para atravesar y «nigromante» para exención del daño; no se presume equivalencia ni se corrige sin decisión editorial.

## Estado siguiente

La **extracción textual del Tomo está terminada**. Restan el cotejo mecánico específico de efectos (objetivos, modificadores, daños, tiradas, duración condicional, requisitos y etiquetas), conciliaciones editoriales y pruebas de Forja. Por el momento, los 434 registros son **fuente textual**, no reglas ejecutables ni fichas validadas mecánicamente.

**No se ha cambiado la lógica de Forja, no se ha fusionado la PR y las fuentes históricas permanecen intactas.**
