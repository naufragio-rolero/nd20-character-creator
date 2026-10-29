# Enciclopedia de Talentos, Poderes y Objetos — Plan de trabajo

**Proyecto:** Forja de personajes · Naufragio d20 (Fantasía, CiFi y Nocturna).  
**Última actualización:** 2026-10-29.  
**Estado global:** Talentos de Especies: **115/115 relaciones cotejadas documentalmente**; Talentos de Ocupaciones: **162/162 transcritos** (CSV histórico de 163 conservado; «Estilos de gladiatoria» reclasificado como Poder). Nocturna: **57/57 textos de Talentos cotejados literalmente**. Eidolas: **32/32 fichas vigentes, 96 modalidades de efecto**. Quedan discrepancias editoriales, progresiones, normalización mecánica e integración. **PR abierta, sin fusionar; Forja sin cambios de lógica.**  
**Rama de trabajo:** `docs/enciclopedia-inventario-2026-10-28` · [PR #3](https://github.com/naufragio-rolero/nd20-character-creator/pull/3) **abierta, sin fusionar** al crear este documento.

Este archivo es el **punto único de seguimiento** del proyecto. Las casillas se marcarán cuando exista un entregable comprobable, no por una estimación de avance. El informe de cada tanda conservará las fuentes, discrepancias y decisiones pendientes. **No modificar reglas ni datos de ejecución por completar tareas documentales.**

## 1. Hitos generales

- [x] **Auditoría inicial:** inspección de arquitectura, fuentes, índices, fichas emergentes y límites de accesibilidad.
- [x] **Inventario inicial:** recuento de los catálogos digitales, contraste preliminar con fuentes, anomalías y dos registros CSV.
- [ ] **Extracción:** volcar literalmente los efectos y propiedades reglamentarias por cada una de las seis tandas.
- [ ] **Validación:** conciliar fuentes, duplicados, homónimos, requisitos, estados y exactitud de cada ficha.
- [ ] **Implementación:** integrar datos estructurados y fichas emergentes en Forja, sin alterar sus reglas de juego.
- [ ] **Pruebas:** pruebas de datos, regresión de creación de personajes, interacción táctil, teclado, foco y lectores de pantalla.
- [ ] **Cierre:** documentación actualizada, PR revisadas y cambios incorporados en la rama principal.

## 2. Tandas documentales

### Tanda 1 — Talentos de Especies · **Validación documental terminada (115/115); integración pendiente**
- [x] Inventario nominal de las 44 Especies, con **115 relaciones Especie–Talento** (94 recogidas en JSON y 21 detectadas solo en fuentes).
- [x] Registrar los **7 Talentos fijos omitidos** y los **14 Talentos opcionales de Hyrule**.
- [x] Extraer el texto literal completo de los 115 bloques de Talentos de Especies, con sistema, Especie, tipo y fuente (tres JSON documentales).
- [x] Identificar las etiquetas independientes de activación/coste/requisitos cuando aparecen literalmente en el texto.
- [x] Identificar por fragmentos literales las expresiones de gastos/recursos, duración, alcance, niveles, elección, restricciones y Tiradas en las 115 fichas ([preclasificación](03a-preclasificacion-propiedades-especies.json)).
- [ ] Revisar manualmente y **normalizar** costes, requisitos, duraciones, activaciones y escalados descritos en la prosa; las etiquetas automáticas no suponen validación ni ausencia de reglas.
- [x] Diferenciar documentalmente 77 Talentos fijos, 24 elegibles y 14 opcionales (relaciones, no nombres únicos).
- [x] Documentar adquisición de los 14 Talentos opcionales de Hyrule (sustitución de Talento en creación y restricciones de Ocupación) y de los 24 elegibles de Nocturna (uno entre tres por Especie); ver [adquisición](03b-adquisicion-talentos-especies.json).
- [ ] Resolver qué Ocupaciones cuentan como «derivadas» y qué Talentos pueden sustituirse sin perder la capacidad que define la Ocupación.
- [x] Registrar [11 hallazgos de contraste y validación](03-informe-propiedades-especies.md), incluidas diferencias de reglas homónimas, fórmulas ambiguas y fuentes cruzadas.
- [ ] Resolver los hallazgos y **validar manualmente** cada efecto, su contexto y la identidad de los Talentos homónimos.
- [x] Publicar repertorio preliminar de 115 registros extraídos, más informe de cobertura y pendientes ([fase 2](02-informe-extraccion-especies.md)).
- [ ] Entregar repertorio **validado** tras conciliación editorial y revisión mecánica.

- [x] Validar documentalmente los **6 primeros vínculos Especie–Talento** de efectos explícitos: 2 Baja estatura, 2 Pequeño, Hambre caníbal y Adaptación ([lote 1](06-validacion-documental-especies-lote-1.md), [registros](06a-validacion-documental-especies-lote-1.json)). Comprobada además la diferencia contextual entre las dos «Herencia dual», **sin contarlas todavía como fichas validadas**.
- [x] Validar **8 relaciones adicionales** del DRS contra sus párrafos originales ([lote 2](07-validacion-documental-especies-lote-2.md), [registros](07a-validacion-documental-especies-lote-2.json)). Acumulado **14/115**.\n- [x] Validar **14 relaciones adicionales** del DRS y CiFi ([lote 3](08-validacion-documental-especies-lote-3.md), [registros](08a-validacion-documental-especies-lote-3.json)). Acumulado **28/115**.\n- [x] Validar **3 relaciones contextuales**: Herencia dual (Semielfo/Semiorco) y Vínculo psiónico (Sylph mindari), [lote 4](09-validacion-documental-especies-lote-4.md), [registros](09a-validacion-documental-especies-lote-4.json). **25/25 DRS/CiFi** cubiertas.\n- [x] Validar **14 relaciones adicionales de Nocturna** contra fuente viva ([lote 5](10-validacion-documental-especies-lote-5.md), [registros](10a-validacion-documental-especies-lote-5.json)). Acumulado **45/115**.\n- [x] Validar **16 relaciones de Ylat/Hyrule** contra fuente viva ([lote 6](11-validacion-documental-especies-lote-6.md), [registros](11a-validacion-documental-especies-lote-6.json)). Acumulado **61/115**.\n- [x] Validar **21 relaciones adicionales** de Ylat/Hyrule y Nocturna ([lote 7](12-validacion-documental-especies-lote-7.md), [registros](12a-validacion-documental-especies-lote-7.json)). Acumulado **82/115**.\n- [x] Validar documentalmente las **33 relaciones Especie–Talento restantes** ([lote 8](13-validacion-documental-especies-lote-8.md), [lote 9](14-validacion-documental-especies-lote-9.md)). **115/115 cotejadas**.\n- [ ] Resolver [conciliaciones editoriales y de integración](15-conciliaciones-pendientes-y-cierre-especies.md) antes de implementar efectos condicionados.

### Tanda 2 — Talentos de Ocupaciones · **Extracción terminada: 162/162; integración pendiente**
- [x] Inventario histórico nominal de **163 relaciones** desde 234 referencias JSON y 51 Ocupaciones; se preserva el CSV original. Por OCP-05, «Estilos de gladiatoria» se clasifica como Poder, por lo que quedan **162 relaciones canónicas provisionales de Talentos**.
- [x] Transcribir el texto de los **162/162 Talentos**, con trazabilidad por Ocupación y fuente; [auditoría final](57a-auditoria-cierre-162-talentos-ocupaciones.json). Cobertura: Ampliadas 81, DRS 9, CiFi 15, Nocturna 57. [Cotejo literal 57/57 Nocturna](57b-validacion-literal-nocturna-57.json). Tres Ocupaciones nuevas de Ampliadas se extrajeron del Google Docs vigente, no de la copia DOCX.
- [ ] Normalizar y validar mecánicamente niveles de adquisición, elecciones, efectos condicionales, costes y recursos de los Talentos; **no equiparar la transcripción documental con una validación ejecutable**.
- [ ] Cotejar todas las tablas de progresión con las fuentes y resolver OCP-06 a OCP-27 que afecten al modelo; OCP-01 de Valquiria está aprobada pero aún pendiente de actualizar en el manual fuente. Ya constan tablas de lotes anteriores y elecciones específicas de Nocturna.
- [ ] Entregar repertorio de datos mecánicamente validado y superar pruebas de regresión antes de integrar en Forja. [Informe de extracción y hallazgos](58-cierre-documental-ocupaciones-y-hallazgos.md).

### Tanda 3 — Técnicas y Poderes especiales
- [x] Localizar categorías y recuentos: Técnicas (24), Psiónica (20), Argucias (6), Scripts (10), Órdenes (8), Flechería (14), Privilegios (6), Canciones (24), Eidolas (32) y Recetas (34).
- [ ] Extraer efectos, costes, requisitos y fuentes literales; distinguir repertorios y elecciones de efectos.
- [ ] Conciliar referencias cruzadas con Ocupaciones y comprobar cobertura descriptiva.
- [ ] Entregar repertorio estructurado validado.

### Tanda 4 — Conjuros
- [x] Inventario digital: **434 registros, 433 nombres normalizados distintos**.
- [ ] Comparar íntegramente con la hoja maestra y ambos tomos de magia.
- [ ] Documentar y resolver **«Ira celestial»** en dos Círculos y el doble encabezado **«Arma elemental»**, sin fusionar automáticamente.
- [ ] Extraer descripción literal, Escuela, Círculo, alcance, duración, lanzamiento, efectos y procedencia cuando estén documentados.
- [ ] Entregar repertorio estructurado validado.

### Tanda 5 — Equipo
- [x] Inventario de equipo inicial en Forja: **48 registros de Fantasía** y **33 de CiFi**; identificar las 5 opciones de Armamento filosofal.
- [ ] Confrontar estos registros con las **listas completas de equipo** de los manuales.
- [ ] Inventariar el equipo de **Nocturna** en su fuente, sin importar compras o riqueza de otras ambientaciones.
- [ ] Extraer literalmente precios, categorías, propiedades y competencias; separar decisiones editoriales de reglas del manual.
- [ ] Entregar catálogo estructurado validado.

### Tanda 6 — Objetos mágicos
- [x] Localizar **28 fichas de objeto en bloques principales y 1 ejemplo de apéndice** en el documento de Objetos mágicos.
- [ ] Comprobar menciones adicionales no representadas por encabezados propios.
- [ ] Extraer efectos, rareza, naturaleza, requisitos y procedencia literal, si la fuente los indica.
- [ ] Separar los objetos mágicos reglamentarios de los objetos narrativos o emocionales de Forja.
- [ ] Entregar catálogo estructurado validado.

## 2A. Acuerdos y correcciones del autor (2026-10-28)

- [x] Incorporar a `data/catalogo-ampliado.json` (rama PR) los **7 Talentos fijos** ausentes de Ylat/Hyrule.
- [x] Corregir «Baja estatura» de Ylat según el DRS y preservar «Pequeño» como versión sin penalizador de Movimiento.
- [x] Conservar «Herencia dual» en Semielfo/Semiorco como dos Talentos diferentes.
- [x] Corregir «Escudo eléctrico» (radio de 4 m) y «Estallido escupefuego» (radio de 2 m) en documento vivo y hoja Talentos.
- [x] Fijar «Hálito de energía» en 1d4 para Niveles 1–5 y progresión posterior en fuente viva y hoja Talentos.
- [x] Documentar el funcionamiento condicional de «Vuelo», «Fuente de maná» y «Vínculo psiónico»; sin alterar el código.
- [x] Vincular documentalmente «Aliados en las sombras» con su desarrollo completo; integración UI pendiente.
- [x] Sustituir la Tirada de Resistencia de «Chillido de ultratumba» por Tirada de Probabilidad (d20) en el documento vivo.
- [x] Uniformar «Nivel del Círculo» en «Fuente de maná» en el documento vivo y hoja Talentos.
- [x] Corregir erratas concretas de «Visión en la oscuridad» y «Ladrón de almas» en documentos vivos.
- [x] Añadir **15 filas** a la hoja «Ocupaciones» de «Lista Talentos Nd20» con columna «Deriva de / referencia» pendiente de clasificación (incluye «Psion» CiFi como registro diferenciado).
- [x] Fijar **Probabilidad 11+** para «Chillido de ultratumba» (documento vivo y [texto aprobado](04b-talentos-especies-aprobados.json)).
- [x] Fijar **+2 Turnos** a la Duración de «Castigo del Reino Sombrío», **solo** cuando el Conjuro tenga «Duración: X Turnos» (documento vivo, hoja Talentos y [texto aprobado](04b-talentos-especies-aprobados.json)).
- [ ] Clasificar Ocupaciones derivadas y las sustituciones compatibles en Hyrule.
- [x] Reextraer las **13 fichas modificadas** en Ylat/Hyrule y Nocturna, preservando las instantáneas históricas ([textos vigentes](05a-fichas-especies-vigentes.json), [conciliación](05-conciliacion-fuentes-vivas-especies.md)).
- [ ] Reextraer y **validar mecánicamente** el repertorio completo de 115 fichas; comprobar además las versiones DRS/CiFi y restantes discrepancias documentales.

**Registro detallado:** [acuerdos editoriales](04-acuerdos-editoriales-especies.md), [textos canónicos aprobados](04b-talentos-especies-aprobados.json) y [vínculo de Talentos ampliados](04a-vinculos-talentos-especies.json). Los archivos `02*` conservan la captura original de sus respectivas fuentes.

## 2B. Procedencia editorial y orígenes — pendiente de auditoría\n\n- [ ] Identificar y documentar los orígenes de **Especies, Ocupaciones y Poderes** en Forja, diferenciando fuente editorial, ambientación y disponibilidad efectiva. No inferir orígenes ausentes ni cambiar filtros de Forja sin validación.\n\n## 3. Integración y pruebas — bloqueadas hasta validación

- [ ] Definir identificadores estables por sistema/categoría/fuente y reglas de relación para homónimos.
- [ ] Preparar el esquema de datos común, conservando valores ausentes como **no documentados**, no como reglas negativas.
- [ ] Integrar catálogos sin sustituir automáticamente los JSON usados para crear personajes.
- [ ] Revisar las fichas emergentes, la interacción táctil y el comportamiento accesible con teclado y lector de pantalla.
- [ ] Pasar pruebas automáticas y comprobaciones en navegador; revisar regresiones de creación de personajes.
- [ ] Publicar solo después de revisión y aceptación de cambios.

## 4. Entregables existentes

- [Inventario transversal](01-inventario.md) — panorama y discrepancias.
- [Registro de Talentos de Especies](01a-talentos-especies.csv) — datos nominales y fuente.
- [Registro de Talentos de Ocupaciones](01b-talentos-ocupaciones.csv) — datos nominales y fuente.
- [Extracción preliminar de Talentos de Especies](02-informe-extraccion-especies.md) — informe de QA y enlaces a 3 repertorios literales.
- [Preclasificación y hallazgos de Talentos de Especies](03-informe-propiedades-especies.md) — evidencias de propiedades, adquisición documentada y 11 asuntos de revisión.
- [Decisiones editoriales actuales](../decisiones-editoriales.md) — mantener independientes del contenido oficial.

## 5. Registro de avances

| Fecha | Acción | Evidencia / estado |
|---|---|---|
| 2026-10-28 | Auditoría inicial del repositorio | Finalizada; sin cambios de código. |
| 2026-10-28 | Inventario inicial transversal y dos CSV | Documentado en esta rama, PR #3 abierta. |
| 2026-10-28 | Creación de este plan de trabajo | Punto de control para las siguientes tandas. |
| 2026-10-28 | Extracción literal de 115 vínculos Especie–Talento | [Informe y repertorios](02-informe-extraccion-especies.md); 115/115 con texto, 44 Especies y 0 fichas vacías. Pendiente validación. |
| 2026-10-28 | Preclasificación de propiedades y acceso | [Revisión y hallazgos](03-informe-propiedades-especies.md): 115 fichas con citas localizables, 14 sustituciones Hyrule, 8 elecciones Nocturna y 11 hallazgos. **Normalización y validación pendientes.** |

| 2026-10-28 | Aplicación de acuerdos ESP-01 a ESP-11 | [Acuerdos](04-acuerdos-editoriales-especies.md); 7 Talentos fijos en rama PR, documentos vivos y hoja maestra corregidos, 15 Ocupaciones añadidas. Quedan 3 decisiones y revalidación. |

| 2026-10-28 | Resolución definitiva de ESP-09 y ESP-10 | Probabilidad 11+ para Chillido de ultratumba y +2 Turnos a Castigo del Reino Sombrío cuando el Conjuro indique «Duración: X Turnos». [Textos aprobados](04b-talentos-especies-aprobados.json); fuentes vivas y hoja corregidas. |

| 2026-10-28 | Conciliación con fuentes vivas y reextracción selectiva | [Informe](05-conciliacion-fuentes-vivas-especies.md) y [13 fichas vigentes](05a-fichas-especies-vigentes.json): 58 Ylat/Hyrule + 32 Nocturna contrastadas, 13 diferencias textuales incorporadas sin alterar `02*`. «Aletas del ciclón» es una diferencia de serialización de tabla, no de regla. DRS/CiFi (25) y validación mecánica (115) pendientes; errata adicional en «Morador de las profundidades». |

| 2026-10-28 | Validación manual inicial de efectos de Especies | [Lote 1](06-validacion-documental-especies-lote-1.md): 6/115 relaciones con mecánicas explícitas contrastadas; 109 pendientes. Herencia dual diferenciada por Especie, sin contar como validación completa. Sin cambios al generador. |

**Norma de actualización:** al cerrar una sesión, marcar únicamente casillas demostradas, añadir la fecha y el enlace al entregable o PR en el registro; mantener abiertas las discrepancias no resueltas. Cuando cambie el estado de una PR, actualizar también su referencia. No equiparar «inventariado» con «extraído» ni «extraído» con «validado».

| 2026-10-29 | Validación documental DRS, lote 2 | [8 relaciones](07-validacion-documental-especies-lote-2.md) cotejadas con DOCX original. **14/115 validadas; 101 pendientes.** Registrada auditoría futura de orígenes editoriales de Especies, Ocupaciones y Poderes. |

| 2026-10-29 | Validación documental DRS/CiFi, lote 3 | [14 relaciones](08-validacion-documental-especies-lote-3.md) contrastadas con DOCX originales; erratas de Visión en la oscuridad registradas sin corregir fuente. **28/115 validadas; 87 pendientes.** |

| 2026-10-29 | Validación documental DRS/CiFi, lote 4 | [3 relaciones](09-validacion-documental-especies-lote-4.md) contextuales validadas; DRS/CiFi **25/25** cubiertas. Acumulado **31/115**, 84 pendientes. No se ha alterado Forja. |

| 2026-10-29 | Validación Nocturna, lote 5 | [14 relaciones](10-validacion-documental-especies-lote-5.md) cotejadas literalmente con el documento vivo. **45/115 validadas, 70 pendientes.** |

| 2026-10-29 | Validación Ylat/Hyrule, lote 6 | [16 relaciones](11-validacion-documental-especies-lote-6.md) cotejadas con texto íntegro de fuente viva. **61/115 validadas, 54 pendientes.** |

| 2026-10-29 | Validación Ylat/Hyrule y Nocturna, lote 7 | [21 relaciones](12-validacion-documental-especies-lote-7.md) cotejadas con fuente viva. **82/115 validadas, 33 pendientes.** |

| 2026-10-29 | Cierre documental de Especies | [32 relaciones](13-validacion-documental-especies-lote-8.md) y [1 relación con tabla](14-validacion-documental-especies-lote-9.md). **115/115 validadas documentalmente; 0 pendientes de cotejo.** Conciliaciones editoriales [abiertas](15-conciliaciones-pendientes-y-cierre-especies.md). |

| 2026-10-29 | Inicio de Tanda 2, Ocupaciones | [9 Talentos de 4 Ocupaciones](16-preextraccion-ocupaciones-lote-1.md) preextraídos del manual de ampliaciones. Pendientes textos íntegros y tablas; detectadas particularidades de Truhán y Astrólogo. |

| 2026-10-29 | Tanda 2, extracción literal | [9 Talentos](17-extraccion-literal-ocupaciones-lote-1.md) transcritos de Forense, Truhán, Acróbata y Astrólogo, con fuente por párrafos. Pendientes tablas de progreso y resto del inventario. |

| 2026-10-29 | Tanda 2, tablas de progresión | [4 tablas originales](18-validacion-progresiones-ocupaciones-lote-1.md) de Forense, Truhán, Acróbata y Astrólogo cotejadas y transcritas (4+21+8+30 filas). Sin decisiones editoriales bloqueantes en este lote. |

| 2026-10-29 | Tanda 2, lote 2 | [11 Talentos de 5 Ocupaciones y 5 tablas](19-extraccion-ocupaciones-lote-2.md). **20/163 extraídos; 143 pendientes.** OCP-01: contradicción entre texto y tabla de «Poderío de la Reina» (decisión del autor). OCP-02: errata «estabsa». |

| 2026-10-29 | OCP-01 resuelto por el autor | [Poderío de la Reina](20-ocp-01-resolucion-valquiria.md): prevalece el texto, mejoras en Niveles 6, 12, 18, 24 y 30. [Tabla canónica de 30 niveles](20a-ocp-01-valquiria-progresion-aprobada.json). Original histórico y Técnicas preservados; pendiente actualizar manual fuente. |

| 2026-10-29 | Tanda 2, lote 3 y OCP-02 | [12 Talentos preindexados](21-preextraccion-ocupaciones-lote-3.md) de Marionetista, Vikingo, Verdugo, Gladiador y Arlequín. Errata «estabsa» corregida en copia DOCX renderizada; fuente histórica preservada. Alertas OCP-03 a OCP-05 abiertas para cotejo. |

| 2026-10-29 | Tanda 2, continuación lote 3 | [OCP-03 a OCP-05 conciliados](22-conciliaciones-lote-3.md). [8 Talentos literales adicionales](23a-extraccion-literal-ocupaciones-lote-3-parcial.json) de Marionetista, Vikingo, Gladiador y Arlequín. **28 Talentos transcritos**; Verdugo (3) pendiente; Estilos de gladiatoria reclasificado como Poder, pendiente ajustar denominador canónico de 163. |

| 2026-10-29 | Lote 3 completado y lote 4 iniciado | [Tres Talentos literales de Verdugo y cinco tablas originales](24a-verdugo-y-progresiones-lote-3.json); [10 Talentos literales de cinco Ocupaciones](25a-extraccion-literal-ocupaciones-lote-4.json) y [Juego de piernas más tablas de control](25b-pugilista-y-tablas-lote-4.json). Acumulado **42 registros transcritos** antes de descontar posibles reclasificaciones; la cifra canónica necesita conciliar Estilos de gladiatoria (Poder). Tablas 15–18 sólo muestreadas, no validadas íntegramente. |

| 2026-10-29 | Lote 4, tablas completas y Adalid | [Tablas Word 15–18 completas](27a-tablas-completas-ocupaciones-lote-4.json) (22+24+12+15 filas de datos). [4 Talentos del Adalid](26a-adalid-talentos-y-compromisos.json) con elección condicional de Compromiso, [informe](27-cierre-lote-4-e-inicio-adalid.md). **46 registros de Talentos transcritos** en lotes documentados, sujeto a conciliación de la clasificación y denominador del inventario. Pendiente tabla 19 y Conjuros del Adalid. |

| 2026-10-29 | Tanda 2, lotes 5 y 6 y Adalid completado | [Informe de seguimiento](32-seguimiento-lotes-5-y-6.md): [Adalid, 30 niveles y 26 Conjuros](28a-adalid-tabla-y-lista-de-conjuros.json); [14 Talentos](29a-extraccion-literal-ocupaciones-lote-5.json) y [complemento](29b-extraccion-literal-brujo-cazador.json) del lote 5; [5 tablas completas](30a-tablas-completas-ocupaciones-lote-5.json); [5 Talentos y 2 tablas](31a-celador-chaman-talentos-y-tablas.json) del lote 6; [24 Patrones, 3 Aquelarres y 4 Tradiciones](32a-opciones-patrones-aquelarres-tradiciones.json). **65 registros de Talentos transcritos** en total (46 previos + 19 nuevos); **OCP-06 a OCP-11** registrados sin alteración de fuente. La referencia inicial de 163 relaciones está pendiente de recalcular por la reclasificación de Estilos de gladiatoria. Sin validación mecánica de Forja. |

| 2026-10-29 | Tanda 2, Diletante/Hechicero/Oráculo | [7 Talentos cotejados](33-diletante-hechicero-oraculo.md) y transcritos [Diletante](33b-diletante-literal.md), [Hechicero](33c-hechicero-literal.md), [Oráculo](33d-oraculo-extraccion.md). [Tablas Word 30, 31 y 33 completas](34a-progresiones-diletante-hechicero-oraculo.json), [8 Estirpes indexadas](35a-estirpes-indice.json). **72 registros de Talentos** acumulados (65+7); resta validar concordancia con relaciones canónicas y excluir los Poderes reclasificados. OCP-12 errata Oráculo y [OCP-14 ambigüedad Diletante](36-incidencia-diletante.md) documentadas; faltan algunas opciones de Llamas divinas y siguiente tanda de Poderes. |

| 2026-10-29 | Belisario, Ordenes de batalla | [8 Ordenes de batalla documentadas como Poderes](37-ordenes-batalla-belisario.md), no Talentos. **OCP-15:** «¡Ataca!» dice +1 inicial y +1 en Niveles 6/12/18/24 pero máximo +4 (aritmética daría +5). **OCP-16:** «¡Vuelve en ti!» repite el mismo patrón. Requieren criterio editorial. |

| 2026-10-29 | **Cierre documental de Talentos de Ocupaciones (Fase Tanda 2)** | [Informe de cierre y hallazgos](58-cierre-documental-ocupaciones-y-hallazgos.md). **162/162 relaciones canónicas provisionales con texto transcrito, 0 por extraer**: Ampliadas **81/81**, DRS **9/9**, CiFi **15/15** y Nocturna **57/57**. [Auditoría de identidades](57a-auditoria-cierre-162-talentos-ocupaciones.json); [comparación literal Nocturna 57/57](57b-validacion-literal-nocturna-57.json). CSV histórico 163 preservado; «Estilos de gladiatoria» es Poder por OCP-05. Clasificaciones complementarias: 14 Flechería, 6 Privilegios, 24 Canciones, 10 Técnicas, 32 explosivos, 24 bestias, 32 Eidolas (16 con 3 modalidades extraídas), marionetas y 2 Conjuros adicionales. OCP-17 a OCP-27 pendientes de conciliación sin corrección automática. **No equivale a validación mecánica ni a despliegue en Forja.** |

| 2026-10-29 | Tanda 3, Poderes, Técnicas, Canciones y Eidolas | [Cierre de apéndices](47-cierre-poderes-apendices-ocupaciones.md) y [control de calidad](50-control-calidad-estado-eidolas.md). **14 Flechería arcana, 6 Privilegios, 6 Habilidades de Núcleo, 18 componentes de marionetas, 32 Explosivos, 2 Conjuros Nictomancia, 10 Técnicas, 24 Canciones** transcritos; tabla de **24 Bestias** existente y cotejada. **32 Eidolas indexados y 16/32 con tres modalidades literales** ([Categoría 1](48a-eidolas-categoria-1-parte-1.json), [continuación](48b-eidolas-categoria-1-parte-2.json), [Categoría 2](49a-eidolas-categoria-2-parte-1.json), [Talisa/Varlyna](49b-eidolas-categoria-2-talisa-varlyna.json), [Warnok/Xalanth](49c-eidolas-categoria-2-warnok-xalanth.json)). Pendientes 16 Eidolas de Categoría 3/4 y contexto de Categoría 2. **OCP-17/18/19** pendientes; Forja sin modificar. |

| 2026-10-29 | Fichas completas de Eidolas (fuente viva) | [Categoría 1](59c-eidolas-categoria-1-fichas-vigentes-completas.json), [2](59d-eidolas-categoria-2-fichas-vigentes-completas.json), [3](59a-eidolas-categoria-3-modalidades-y-lore.json) y [4](59b-eidolas-categoria-4-modalidades-y-lore.json): **32/32 Eidolas con narrativa original y 3 modalidades de efecto (96/96)**. [Cotejo de afinidades](60a-auditoria-eidolas-32-modalidades-96.json): 31 coinciden; OCP-21 **Velunion Agua vs Ninguno**, pendiente. OCP-22 **Maia sin cifra de distancia** pendiente. Falta desglosar ofrendas y validar mecánicamente los efectos; sin cambios a Forja. |

| 2026-10-29 | Cierre de Eidolas, Equipo y Objetos mágicos | [Informe de cierre](67-cierre-ofrendas-equipo-objetos-magicos.md). **32/32 Eidolas, 96/96 modalidades**, 27 menciones narrativas de ofrendas/pruebas/compromisos, 5 sin mención explícita ([auditoría](63a-auditoria-eidolas-ofrendas-32.json)); no inferir bloqueo de invocación. **22/22 registros de Equipo** de las tablas Word 35–38: [12 armas](62a-equipo-armas-ocupaciones.json) y [10 objetos/herramientas](62b-equipo-herramientas-ocupaciones.json), [0 duplicados nominales](63b-auditoria-equipo-22.json) frente a equipo inicial y catálogo ampliado. **28/28 objetos mágicos principales + 1 ejemplo** transcritos desde DOCX local ([índice](64a-indice-objetos-magicos-28-y-apendice.json), [auditoría literal 29/29](66a-auditoria-literal-objetos-magicos-29.json)). OCP-MAG-01/02 y OCP-EQ-01/02 pendientes; OCP-21/22 siguen abiertos. Forja sin modificar. |

| 2026-10-29 | Tanda 4, cierre de Conjuros del Tomo alfabético y Elixir | **434/434 fichas literales** extraídas en [18 lotes 69a–69r](69a-conjuros-alfabeticos-001-025.json), [índice de 434](70a-indice-conjuros-434.json) y [auditoría con cotejo literal 434/434, sin diferencias](70b-auditoria-conjuros-434.json); 433 nombres, Escuela/Alcance 434, Círculo 433. [Etiquetas: 23 diferencias de clasificación](70c-etiquetas-conjuros-y-conciliacion.json). [Conciliación e incidencias](71-cierre-extraccion-conjuros-y-conciliaciones.md): Arma elemental duplicada en Tomo, Ira celestial C3/C5 sólo en catálogo, Contrato de fraternidad sin Círculo en fuente, Glosolalia mayor †. Dardo de penumbra y Portal sombrío del manual de Ocupaciones **ya están en el Tomo**, no son Conjuros extra. [Elixir de esfuerzo aprobado: +1 Esfuerzo, no energía](68-resolucion-elixir-esfuerzo.md), fuente histórica conservada. Extracción no equivale a validación mecánica de Conjuros ni modifica Forja. |

| 2026-10-30 | Tanda 5, desglose mecánico documental del Tomo | **100/434 Conjuros revisados a mano** en [72a](72a-desglose-revisado-conjuros-001-025.json), [72b](72b-desglose-revisado-conjuros-026-050.json), [72c](72c-desglose-revisado-conjuros-051-075.json), [72d](72d-desglose-revisado-conjuros-076-100.json), **333 fragmentos cotejados sin errores** ([auditoría](75a-auditoria-desglose-manual-100.json)). **384 fichas preindexadas** con marcadores literales en [73a–73h](73a-preindice-mecanico-051-100.json), 50 de ellas también revisadas manualmente; **334 sólo preindexadas y pendientes de revisión manual**. [Cobertura completa sin huecos](76a-cobertura-desglose-conjuros-434.json), [2 auditorías lexicales sin errores](74a-auditoria-preindice-051-250.json). [Conciliaciones CONJ-M01 a M07](76b-conciliaciones-prioritarias-conjuros.md). [Auditoría de superficies y volumen](77c-resumen-geometria-conjuros.md): **65 fichas**, 69 menciones, **10 radios expresados con unidades de superficie** (corrige detección de ²); sin reinterpretarlos. Próximo lote manual: **101–125**, priorizando Dardo de penumbra y otros con varios disparadores. Fuentes, archivos de ejecución de Forja e instantáneas sin modificar; PR abierta y sin fusionar. |

| 2026-10-30 | Tanda 5, ampliación a 125 Conjuros | [25 fichas adicionales 101–125 desglosadas manualmente](72e-desglose-revisado-conjuros-101-125.json) y [68 referencias a párrafos cotejadas sin errores](75b-auditoria-desglose-manual-101-125.json). **125/434 revisadas a mano**; **309 restantes solo preclasificadas** con marcadores lexicográficos ([cobertura verificada](76a-cobertura-desglose-conjuros-434.json)). [Incidencias CONJ-M08 a M11](76b-conciliaciones-prioritarias-conjuros.md), sin corrección automática. La [auditoría de geometría](77c-resumen-geometria-conjuros.md) se corrigió de 8 a **10 radios con superficie**, en **65 fichas / 69 menciones** tras detectar un fallo en la búsqueda de superíndices ². Próximo bloque de revisión manual: Conjuros 126–150. PR no fusionada y Forja no modificado. |
