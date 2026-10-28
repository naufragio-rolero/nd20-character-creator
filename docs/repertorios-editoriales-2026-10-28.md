# Repertorios editoriales para la Forja · 28 de octubre de 2026

> **Estado: propuesta editorial pendiente de revisión.** No constituye canon ni
> atribuye hechos nuevos a las ambientaciones.

## Alcance

Partiendo de la revisión de `main` del 28/10/2026 y del inventario
`nd20_repertorios_pendientes(2).json`, se completaron **101 repertorios que
estaban presentes y vacíos** en `data/catalogo-ampliado.json`:

| Línea | Nombres | Conceptos | Repertorios |
| --- | ---: | ---: | ---: |
| Fantasía · 22 Especies | 440 | 220 | 44 |
| Fantasía · 33 Ocupaciones | — | 330 | 33 |
| Nocturna · 8 Especies | 160 | 80 | 16 |
| Nocturna · 8 Ocupaciones | — | 80 | 8 |
| **Total** | **600** | **710** | **101** |

Los repertorios preexistentes de CiFi, Fantasía DRS, Dungeon Hack y el
tesauro de Ylat no se alteran. Tampoco se crean campos de nombres
para Ocupaciones ni se modifican reglas, Talentos, Competencias o fichas
mecánicas.

## Procedencia y niveles de revisión

- **72 repertorios con descripción documental localizada**: 21 Especies
  (42 repertorios) en `NaufragioD20 — Especies.docx` y 30 Ocupaciones
  (30 repertorios) en `NaufragioD20 — Ocupaciones.docx`. Las siete
  adaptaciones de Zelda se basan en las descripciones de ese documento,
  sin adjudicar al material creado rango de canon de otra franquicia.
- **5 repertorios que exigen cotejo adicional**: el documento de Especies
  no incluye apartado propio de **Elfo nerai** (nombres y conceptos); el
  documento de Ocupaciones no contiene apartados propios de **Druida**,
  **Lardeur** y **Derviche** (conceptos). En estos casos, la propuesta
  se limita a la información presente en la ficha JSON (Talentos,
  competencias y demás descriptores ya existentes).
- **24 repertorios de Nocturna sin el documento original adjunto**:
  el JSON indica `NaufragioD20Nocturna`, pero ese DOCX no figura
  en las fuentes disponibles. Estos nombres y conceptos se infieren
  exclusivamente de las fichas JSON; **no deben aprobarse como
  cultural o históricamente contrastados** hasta consultar el documento.

Ninguna propuesta intenta fijar un idioma, tradición onomástica,
institución o geografía nuevos. Los conceptos son semillas narrativas, no
Trasfondos con beneficios.

## Verificación ejecutada

El 28/10/2026 se ejecutó realmente en **GitHub Actions** (Node.js 22) el
comando `node tests/smoke.js` sobre la rama editorial, junto a
`node --check` para el script de pruebas y los principales módulos JavaScript.
**Resultado: todas las etapas de validación concluyeron correctamente.**

Evidencia:
https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/40688687329

La validación de software no reemplaza el cotejo editorial con las fuentes que
faltan; los repertorios mantienen el carácter de propuesta no canónica.

## Validación automática aplicada al catálogo

- Los 101 repertorios anteriormente vacíos tienen 20 nombres por Especie
  y 10 conceptos por Especie u Ocupación, según corresponda.
- Los 600 nombres nuevos no presentan duplicados, incluso comparados
  sin tildes, y no coinciden con los anteriores del catálogo.
- Los 710 conceptos nuevos tienen de 2 a 7 palabras, y todas las
  entradas nuevas respetan el máximo de 160 caracteres.
- No queda ningún repertorio previamente vacío y no se ha alterado
  ninguna lista que ya estuviera poblada en `main`.
- Se adapta la prueba del editor que esperaba un repertorio vacío
  de Hurí; ahora comprueba su lista completa y la edición incremental.

**Pendiente para aprobación editorial del contenido:** revisar estilo,
coherencia con la ambientación, originalidad y, especialmente, las 29 listas
con fuente no localizada o insuficiente. La incorporación técnica del catálogo
no convierte las propuestas en canon; su estado se mantiene hasta su revisión.
