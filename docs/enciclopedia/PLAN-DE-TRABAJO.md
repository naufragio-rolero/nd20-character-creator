# Enciclopedia de Talentos, Poderes y Objetos — Plan de trabajo

> **Actualización de entrega:** [PR #17 fusionada](https://github.com/naufragio-rolero/nd20-character-creator/pull/17), [LIVE 41349181874 correcta](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874); cinco fases cerradas para el DRS público, **sin cambios en el DOCX original**. La PR #13 continúa separada. [Registro 125](125-publicacion-live-talentos-drs.md).

> **Estado vigente (01/11/2026):** Forja **DRS pública y utilizable** en https://naufragio-rolero.github.io/nd20-character-creator/, con las dos aclaraciones autorales de la edición 1.5 ([informe 112](112-forja-aclaraciones-autoriales.md)) y las **mejoras UX de la PR #14 ya fusionadas y desplegadas** ([informe 118](118-forja-ux-primer-uso-boton-flotante.md); [LIVE 41328185657](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41328185657), success). **La PR #15 (fichas y accesibilidad) está fusionada y publicada** ([LIVE 41334432188](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41334432188), success). **La PR #13 de enciclopedia DRS permanece abierta, en borrador y no publicada.** La preclasificación documental de Talentos 1.4 no introduce reglas nuevas.

**Proyecto:** Forja de personajes · Naufragio d20 (Fantasía, CiFi y Nocturna).  
**Última actualización:** 2026-11-01.  
**Estado global:** Talentos de Especies: **115/115 relaciones cotejadas documentalmente**; Talentos de Ocupaciones: **162/162 transcritos** (CSV histórico de 163 conservado; «Estilos de gladiatoria» reclasificado como Poder). Nocturna: **57/57 textos de Talentos cotejados literalmente**. Eidolas: **32/32 fichas vigentes, 96 modalidades de efecto**. Quedan discrepancias editoriales, progresiones, normalización mecánica e integración. **PR abierta, sin fusionar; Forja sin cambios de lógica.**  
**Rama de trabajo:** `docs/enciclopedia-inventario-2026-10-28` · [PR #3](https://github.com/naufragio-rolero/nd20-character-creator/pull/3) **abierta, sin fusionar** al crear este documento.

Este archivo es el **punto único de seguimiento** del proyecto. Las casillas se marcarán cuando exista un entregable comprobable, no por una estimación de avance. El informe de cada tanda conservará las fuentes, discrepancias y decisiones pendientes. **No modificar reglas ni datos de ejecución por completar tareas documentales.**

## Nueva etapa — Fuentes, consolidación y consulta rápida (01/11/2026)

**Documentación creada (sin cambios funcionales):** [120 — Procedencia, consolidación y confirmación de Talentos](120-procedencia-consolidacion-confirmacion-talentos.md) y [121 — Plan de cinco fases](121-plan-cinco-fases-sincronizacion-talentos.md).

**Decisión del autor:** solo cinco categorías de Talento: **Acción, Especial, Mejora, Pasiva y Reacción**. **`NaufragioD20DRS.docx` es el documento original y normativo del núcleo**; `Lista Talentos Nd20.xlsx` es el índice editorial de trabajo. Se incorporarán documentos de **otros orígenes** de manera progresiva, conservando procedencia y aprobación específica.

**Auditoría de fuentes (confirmada, no implementación):** hoja Talentos de la lista: **143 entradas** (22 Nd20, 89 Bitácora, 29 Zelda, tres Exploración). En el núcleo DRS: **22 Talentos únicos / 24 asignaciones** (15 de Especie sin etiqueta formal autónoma en el original y nueve de Ocupación ya etiquetados). El Excel clasifica todos esos Talentos; ello **no autoriza reemplazar** efectos ni costes del DRS.

**Plan de cinco fases: Fases 1–5 completadas para la edición DRS pública de Talentos. [PR #17 fusionada](https://github.com/naufragio-rolero/nd20-character-creator/pull/17), [LIVE 41349181874 verificada](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874).**

- [x] **Fase 1 — Procedencia y sincronización:** cotejar los 22 Talentos Nd20/24 relaciones DRS, formalizar propuestas de las 15 etiquetas de Especie y registrar las discrepancias (*¡Sálvese quien pueda!*, *Corpulencia*, *Recuperación*), sin editar silenciosamente el manual.
- [x] **Fase 2 — Consulta inmediata:** recuperar hover, mantener clic para fijar, scroll, Escape, teclado y táctil sin popups que desaparezcan o cambien de referencia.
- [x] **Fase 3 — Ficha compacta y fiel:** una descripción DRS y una de las cinco categorías; eliminar los resúmenes y glosas redundantes; conservar fidelidad y contraste visual.
- [x] **Fase 4 — Aclaraciones autorales:** reservar las no integradas al DRS para **Opciones avanzadas → Detalles técnicos** y preparar nuevas redacciones del documento original para aprobación expresa.
- [x] **Fase 5 — QA y publicación controlada (4/4 y LIVE verificadas):** verificar 24/24 relaciones, 22/22 Talentos DRS, cinco categorías, procedencia, hover, lectura, contrastes, CI y paquete público sin suplementos; desplegar solo tras validación.

**Límites:** la Forja publicada y los 111 artículos de Equipo permanecen inalterados por esta documentación; los **121 Talentos de otros orígenes no se publican por estar en el Excel**. La [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) sigue independiente.

### Seguimiento de ejecución posterior a PR #16 — 01/11/2026

**Rama ya fusionada:** `feat/fases-talentos-drs-2026-11-01` mediante [PR #17](https://github.com/naufragio-rolero/nd20-character-creator/pull/17), commit `a8371718e97c57bbcc5dc73a819704722284f052`, y [Forja LIVE 41349181874](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874) **success**. **[Informe 122](122-sincronizacion-talentos-drs-excel.md) y [matriz 122a](122a-matriz-talentos-drs-excel.json)**: Fase 1 completada con 22/22 entradas del Excel, 24/24 asignaciones DRS, 15 propuestas de etiqueta de Especie, nueve categorías DRS formales y siete diferencias literales en seis entradas únicas. **[Informe 123](123-ejecucion-hover-categorias-aclaraciones.md)**: Fases 2–4 implementadas en candidato (hover, fijación, categoría oficial, descripción única, aclaraciones solo técnicas) y dos propuestas DRS pendientes. **Fase 5 completada:** cuatro suites verdes, capturas y paquete DRS; [publicación LIVE 41349181874](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874) **success**, con verificación HTTP de cinco categorías y textos literales. [Informe de entrega 125](125-publicacion-live-talentos-drs.md). Las decisiones sobre **nuevas redacciones del manual original** siguen siendo externas a la publicación.

## Revisión de fichas DRS y accesibilidad — PR #15 (01/11/2026)

**Origen:** incidencias reales de uso y cinco capturas. [Informe 119](119-fichas-drs-completas-accesibilidad.md) · [PR #15](https://github.com/naufragio-rolero/nd20-character-creator/pull/15) **fusionada**; [Forja LIVE](https://naufragio-rolero.github.io/nd20-character-creator/) **publicada y verificada**.

- [x] Cotejar directamente las diez Técnicas básicas del DRS, párrafos 794–855: **10/10 efectos literales completos** y sin Técnicas de suplementos.
- [x] Confirmar que los **15 Talentos de Especie** carecen de etiqueta literal independiente «Acción» o «Pasiva»; añadir **24/24 glosas editoriales** de uso y resumen sin alterar los efectos originales ni las aclaraciones autorales.
- [x] Completar **111/111 descripciones de artículos DRS** (38 armas, 14 armaduras, 3 escudos, 4 municiones, 5 paquetes, 41 útiles, 2 focos y 4 varitas), distinguiendo descripción editorial y detalle DRS.
- [x] Preparar fichas de Talento con resumen inmediato y texto fuente íntegro (desplegable si es largo); cierre visible, desplazamiento de diálogo y permanencia al perder foco.
- [x] Corregir la combinación de texto amarillo pálido sobre fondo claro en el tema Ébano.
- [x] Limitar los tres catálogos nuevos al paquete público filtrado y proteger cobertura 10/24/111 mediante tests Node y E2E.
- [x] **4/4 suites CI verdes** en SHA funcional `a80b9249`: validación general, Chrome, Firefox/WebKit y paquete DRS. [Evidencias y límites de capturas en informe 119](119-fichas-drs-completas-accesibilidad.md). Se probaron diálogo desplazable y contraste de Ébano en navegador.
- [x] Fusionar exclusivamente la PR #15, commit `9293efb8`, fijar SHA en el workflow LIVE y verificar sitio público: [Actions 41334432188](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41334432188) **success**, con controles HTTP de catálogos 10/24/111 y exclusión de suplementos.
- [ ] Recoger validación de uso en el dispositivo real de la usuaria, distinta de la QA de navegadores.
- [ ] Reconciliar cambios con la [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) si se amplía también el catálogo adicional de Equipo, conservando su estado separado.

## Corrección UX de primera visita y botón flotante — PR #14 (01/11/2026)

**Fuente:** comentarios directos de una usuaria, sin captura ni dispositivo concreto. **Informe:** [118 — Primer uso y botón flotante](118-forja-ux-primer-uso-boton-flotante.md) · [PR #14](https://github.com/naufragio-rolero/nd20-character-creator/pull/14) **fusionada y publicada** · [Forja LIVE](https://naufragio-rolero.github.io/nd20-character-creator/).

- [x] Analizar la causa del solapamiento: CTA `fixed` sin comprobación de pie de página ni visibilidad de la acción principal.
- [x] Añadir ayuda inicial clara y mensaje de Resultados vacío que explique el mínimo necesario para generar una primera ficha.
- [x] Resolver el hallazgo de **panel Menú oculto al entrar desde móvil**: tarjeta «Empezar» **antes de Resultados, visible sin scroll a 390 × 844**, que abre el formulario y enfoca Nivel.
- [x] Auditoría visual de capturas Firefox/WebKit: detectar que el primer botón «Empezar» estaba bajo el pliegue y que el flotante tapaba ayuda al abrir Menú; corregir ambos sin alterar las reglas.
- [x] Ocultar el CTA flotante junto al pie y cuando el botón del formulario está visible; permitir reaparición durante el desplazamiento.
- [x] Igualar el texto singular/plural del botón principal y flotante.
- [x] Guiar a Resultados después de generar en móvil (y devolver foco al título), respetando movimiento reducido.
- [x] Incorporar pruebas E2E de primer uso, pie accesible, CTA contextual y resultado móvil en Firefox/WebKit, con capturas de primera visita y pie despejado.
- [x] **4/4 suites CI verdes en el último cambio funcional `4811dd7b`**: Node, compras en Chrome, Firefox/WebKit, candidato público DRS. [Informe 118](118-forja-ux-primer-uso-boton-flotante.md), evidencias y capturas del [run 41326537139](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537139).
- [x] Inspección visual técnica de **diez capturas** de escritorio, primera visita, formulario abierto, compras y pie en Firefox/WebKit; ayuda inicial **sin superposición** tras el último cambio. Queda pendiente validar en el dispositivo real de la usuaria.
- [x] Inspeccionar capturas de **primera visita**, **pie**, **escritorio** y **formulario móvil abierto** en Firefox/WebKit; los dos hallazgos de solapamiento y el CTA bajo el pliegue están corregidos y comprobados en CI.
- [x] Completar revisión técnica/visual de las capturas y **fusionar** [PR #14](https://github.com/naufragio-rolero/nd20-character-creator/pull/14) en commit **`deac628f`**.
- [x] Promover **exclusivamente** el commit `deac628f` con el workflow LIVE anclado a SHA, excluyendo CiFi, Nocturna y la PR #13; despliegue y prueba HTTP [41328185657](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41328185657) **success**.
- [x] Verificar públicamente entrada «Empezar», comportamiento del flotante, popup fijado, 8 Especies DRS y 2 aclaraciones; enlace https://naufragio-rolero.github.io/nd20-character-creator/.
- [ ] Confirmar la experiencia **en el dispositivo real** de la usuaria; no se atribuye a la CI una validación presencial.
- [x] Auditar solapamientos entre PR #14 y PR #13: **seis ficheros compartidos** (`index.html`, `assets/app.js`, `assets/styles.css`, `assets/tooltip-ui.js`, `tests/browser-compatibilidad.js`, `docs/enciclopedia/PLAN-DE-TRABAJO.md`). Proteger el catálogo DRS, el inicio guiado y los popups fijados.
- [x] Corregir popup que podía ser **reemplazado por hover mientras estaba fijado**; prueba de regresión en Firefox/WebKit, tras detectar fallo intermitente del [run 41326829106](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326829106). [Informe 118](118-forja-ux-primer-uso-boton-flotante.md).
- [x] **4/4 suites verdes sobre el último cambio funcional `f3e4d945`** (validación general, compras Chrome, Firefox/WebKit y candidato público), con prueba de hover sobre un Talento diferente mientras el popup está fijado. Evidencias en [informe 118](118-forja-ux-primer-uso-boton-flotante.md).
- [ ] **Próxima fase:** reconciliar los **seis ficheros compartidos** con [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13), revalidar 4/4 suites y someter el catálogo de Equipo a aprobación editorial independiente, sin reintroducir problemas del flotante ni publicar DLC.

## Forja 1.5 — Aclaraciones autorales en popups DRS (01/11/2026)

- [x] Separar las dos aclaraciones ratificadas de los 24 efectos literales.
- [x] Mostrar `¡Sálvese quien pueda!` y `Expulsar muertos vivientes` con su aclaración aprobada, sin reescribir el DRS.
- [x] Incorporar fuente, identidad y comprobaciones de seguridad de distribución.
- [x] Fusionar la [PR #12](https://github.com/naufragio-rolero/nd20-character-creator/pull/12) tras 4/4 suites CI satisfactorias (SHA de merge `8dea3c9fd53c04c9739022968b551608a3276752`).
- [x] Promocionar a LIVE el SHA de merge `8dea3c9fd53c04c9739022968b551608a3276752` y comprobar la publicación: [Actions 41298520411](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298520411) **success**, incluidas las dos aclaraciones desde Pages.
- [x] Verificar nueva distribución pública, incluidas las dos aclaraciones, y [cerrar el diario de acciones](112-forja-aclaraciones-autoriales.md).

**Registro de acciones y decisiones:** [Informe 112 — Forja 1.5](112-forja-aclaraciones-autoriales.md). No se introduce motor de combate, tiradas automáticas ni cambios de coste.

## Conciliación de los ocho asuntos DRS — Cerrada editorialmente (01/11/2026)

- [x] Seis asuntos resueltos directamente por el DRS o las pruebas existentes.
- [x] `¡Sálvese quien pueda!`: aclaración autoral aprobada; su Acción y Punto de Esfuerzo permiten superar las restricciones de Miedo o Parálisis sin Tirada adicional.
- [x] `Expulsar muertos vivientes`: tirada por criatura; cuando resulte práctico, una sola tirada por grupo de criaturas **idénticas** (3 zombis + 2 esqueletos = 2 tiradas).
- [x] Mantener separadas las decisiones autorales del texto literal del DRS.
- [ ] Implementación automática en un futuro sistema de combate, si procede; **no forma parte de esta conciliación**.

**Cierre documentado:** [Informe 111 — Resolución de los ocho asuntos](111-resolucion-ocho-asuntos-talentos-drs.md). Las dudas históricas del informe 110 quedan reemplazadas por esta resolución.

## Tanda actual — Propiedades literales DRS (Forja 1.4)

- [x] Indexar los 24 Talentos DRS por propietario y texto fuente.
- [x] Registrar 79 fragmentos literales mediante 24 categorías editoriales, sin inventar reglas.
- [x] Incorporar pruebas de fidelidad literal y ausencia de exposición pública.
- [x] Confirmar las cuatro suites de CI y fusionar el índice documental mediante [PR #10](https://github.com/naufragio-rolero/nd20-character-creator/pull/10).
- [ ] Aprobar específicamente cada normalización mecánica antes de modificar el generador.

**Detalle:** [Informe y diario de acciones](110-informe-propiedades-talentos-drs.md) · [repertorio literal](110a-propiedades-literales-drs.json).

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

## 2B. Procedencia editorial y orígenes — auditoría inicial de Talentos, alcance general pendiente

- [ ] Identificar y documentar los orígenes de **Especies, Ocupaciones y Poderes** en Forja, diferenciando fuente editorial, ambientación y disponibilidad efectiva. No inferir orígenes ausentes ni cambiar filtros de Forja sin validación.\n\n## 3. Integración y pruebas — bloqueadas hasta validación

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
| 2026-11-01 | **Plan de Talentos en cinco fases y política de fuentes** | [Informe 120](120-procedencia-consolidacion-confirmacion-talentos.md) y [plan 121](121-plan-cinco-fases-sincronizacion-talentos.md): DRS como documento original; Excel como clasificación de trabajo; 143 Talentos en cuatro orígenes, 22 Nd20/24 asignaciones DRS; categorías Acción/Especial/Mejora/Pasiva/Reacción; **sin modificaciones de reglas ni de Forja**. |
| 2026-11-01 | **Forja DRS con fichas completas, nueva versión publicada** | [PR #15 fusionada](https://github.com/naufragio-rolero/nd20-character-creator/pull/15) en `9293efb8`; [LIVE 41334432188](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41334432188) **success**. Efectos de 10 Técnicas DRS, 24 Talentos explicativos y 111 Equipos descritos; lector fijado y Ébano corregidos. PR #13 sigue separada y sin desplegar. |
| 2026-11-01 | Fichas DRS, Equipo y accesibilidad (nueva fase) | [Informe 119](119-fichas-drs-completas-accesibilidad.md), [PR #15](https://github.com/naufragio-rolero/nd20-character-creator/pull/15): 10 Técnicas literales, 24 Talentos explicativos, 15 clasificaciones de Especie y 111 artículos descritos; popup fijo desplazable y contraste Ébano. En QA, sin fusión ni despliegue. |
| 2026-11-01 | **Forja UX publicada, versión utilizable** | [PR #14 fusionada](https://github.com/naufragio-rolero/nd20-character-creator/pull/14) en `deac628f`; [publicación LIVE y verificación HTTP](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41328185657) **success**. URL https://naufragio-rolero.github.io/nd20-character-creator/. Inicio visible, botón flotante no solapa el pie/ayuda y popups fijados estables. PR #13 continúa separada, sin desplegar. |
| 2026-11-01 | Revisión visual real de UX móvil de Forja | Capturas de GitHub Actions analizadas: «Empezar» bajo el pliegue y flotante que cubría texto tras abrir Menú; tarjeta de primer paso ahora visible sin scroll en 390×844 y CTA oculto mientras se lee la ayuda. [Informe 118](118-forja-ux-primer-uso-boton-flotante.md), PR #14 en borrador y separada de PR #13. |
| 2026-11-01 | Feedback de usabilidad: primer uso y pie de página | [Informe 118](118-forja-ux-primer-uso-boton-flotante.md), [PR #14](https://github.com/naufragio-rolero/nd20-character-creator/pull/14). CTA flotante contextual, guía inicial, salida visible en móvil y pruebas; rama independiente de PR #13. Aún sin fusión/despliegue. |
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
