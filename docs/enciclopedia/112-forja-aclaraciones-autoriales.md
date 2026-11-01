# Forja 1.5 — Aclaraciones autorales visibles en Talentos DRS

**Fecha:** 01/11/2026 (Europa/Madrid).  
**Rama:** `feat/forja-1-5-aclaraciones-autoriales-drs`.  
**Fuente literal:** `NaufragioD20DRS.docx` (24 vínculos, huellas protegidas).  
**Resolución editorial:** [111 — Ocho asuntos resueltos](111-resolucion-ocho-asuntos-talentos-drs.md), PR #11 ratificada y fusionada.  
**Catálogo añadido:** `data/aclaraciones-talentos-drs.json` (2 aclaraciones aprobadas, 22 Talentos sin adición).

## Objetivo y alcance

Incorporar al **popup compacto del Talento** las dos aclaraciones ratificadas expresamente por autoría el 01/11/2026:

1. **¡Sálvese quien pueda! (Mediano amable):** superar las restricciones de acción de Parálisis o Miedo mediante la Acción y el Punto de Esfuerzo que ya exige el Talento, sin Tirada ni Acción extra.
2. **Expulsar muertos vivientes (Clérigo):** una Tirada de Probabilidad 15+ por criatura; si hay muchas **criaturas idénticas**, una Tirada común para el grupo. Ejemplo autorizado: **3 zombis + 2 esqueletos = 2 Tiradas**. No se inventa un mínimo obligatorio para agrupar.

Se deja intacta toda regla adicional del texto fuente: límites de Nivel, efectos y duración. **No** se adopta como aclaración nueva la interpretación anterior sobre muertos vivientes de Nivel superior, el reparto Intervalo/Turnos o una tirada adicional de Intuición. El nuevo dato informa; **no ejecuta Tiradas ni afecta a Recursos**.

## Decisiones implementadas

**DEC-112-01 · Separación material.** El efecto literal sigue en `data/talentos-drs-literales.json`, sin correcciones. Las decisiones autorales se guardan en archivo distinto, con fecha, fuente y documento justificativo. Nada se inserta en la descripción original.

**DEC-112-02 · Vinculación por identidad completa.** Una aclaración solo puede adjuntarse cuando coinciden ID único, tipo de propietario, propietario y nombre, sobre un Talento DRS oficial. Un ID o relación inexistente provoca error en la indexación, sin búsqueda por nombre alternativo.

**DEC-112-03 · Presentación visible y etiquetada.** La cabecera «Aclaración autoral aprobada» y el nuevo texto se muestran en un apartado propio justo después del efecto literal. No se ocultan con «Mostrar detalles técnicos». El pie del popup sigue identificando `NaufragioD20DRS.docx` como la procedencia del texto original.

**DEC-112-04 · Solo dos autorizaciones.** La lista blanca de la distribución incluye `data/aclaraciones-talentos-drs.json`, pero las pruebas exigen exactamente los dos IDs aprobados; no se abre la publicación a CiFi, Nocturna ni nuevos Talentos. Los 24 textos literales mantienen sus huellas.

**DEC-112-05 · No simular mesa de juego.** Se conserva sin modificar `assets/rules.js`, `assets/powers.js` y `assets/equipment.js`. El generador no realiza tiradas de expulsión, no consume Acción/Esfuerzo de un combate y no gestiona Estados ni turnos.

## Bitácora verificable de acciones

| Nº | Acción | Evidencia |
|---|---|---|
| A01 | Consultar HEAD de `main` y PR #11; revisar documentación aprobada, popups, catálogo literal, empaquetado y pruebas | Base `9e21ebf95f098c64d4ea5afbb945b788358a0463`; PR #11 fusionada. |
| A02 | Crear rama aislada de Forja 1.5 | `feat/forja-1-5-aclaraciones-autoriales-drs`. |
| A03 | Guardar las dos decisiones autorales en catálogo separado | `data/aclaraciones-talentos-drs.json` · `dc3087d189fa351436d09f99b5f18be8ccb87a3e`. |
| A04 | Resolver las aclaraciones por identidad y agregarlas al modelo de presentación, nunca a los efectos | `assets/tooltips.js` · `e7b246a21e4cf61898594b36aaa39c27eaf6dd03`. |
| A05 | Añadir un bloque independiente y visible en popups de los dos Talentos | `assets/tooltip-ui.js` · `f9900eb2c9e1c673547f08b99bedeedee3de5e91`. |
| A06 | Estilizar el bloque de aclaración de forma distinguible | `assets/styles.css` · `906000ac859243e0d35b123ee106a75c4cb04cbe`. |
| A07 | Cargar catálogo con las demás fuentes documentales de la Forja | `assets/app.js` · `55198808b8451af72db8b513a90c0fb42e6d62d7`. |
| A08 | Extender lista blanca y comprobador de publicación | `scripts/crear-paquete-drs.js` · `16b89dccf0164130db15bdacd511a166de5a63e7`; `scripts/comprobar-publicacion-drs.js` · `028e7ccd80ac626b6d20b5124077f93f05ce26ba`. |
| A09 | Proteger IDs, origen, texto original, ausencia de falsos positivos y paquete filtrado | `tests/talentos-drs.js` · `f4d3fe80ac0db04fcc2651b0970a6251925f028f`; `tests/paquete-publico-drs.js` · `47428d7fa673e0abb843943219c3b95f90635865`. |
| A10 | Probar ambos popups en navegador y controlar homónimos/otros Talentos | `tests/browser-compatibilidad.js` · `e4608e1999d459fce977985cdbd2ff0b89cc56d0`. |
| A11 | Registrar decisiones y plan de entrega | Este documento. |
| A12 | Crear [PR #12](https://github.com/naufragio-rolero/nd20-character-creator/pull/12), analizar primer fallo de CI y corregir únicamente la aserción | La primera ejecución de «Validar Conjuros y Forja» [41298198413](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298198413) falló porque el test exigía las palabras «Punto de Esfuerzo y la Acción» en ese orden, aunque la fuente decía «la Acción y el Punto de Esfuerzo». Se corrigió **solo** `tests/talentos-drs.js`, para verificar ambos gastos sin exigir su orden, commit `25e10008c12f03014d3046f64807e3b744986717`. Ninguna regla ni aclaración fue alterada. |
| A13 | Confirmar **4/4 suites** sobre el último commit de la PR | [Motor y 434 Conjuros](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298257062) · [Chrome E2E](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298256875) · [Firefox/WebKit](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298256930) · [Candidato DRS filtrado](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298256869), todas **success**. |
| A14 | Fusionar versión probada | [PR #12 fusionada](https://github.com/naufragio-rolero/nd20-character-creator/pull/12) por merge commit **`8dea3c9fd53c04c9739022968b551608a3276752`**. |
| A15 | Actualizar pin de publicación LIVE y verificar el sitio público | `forja-live.yml` fijado al merge SHA `8dea3c9fd53c04c9739022968b551608a3276752`. Primera [publicación LIVE 41298471124](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298471124) **success** (commit del workflow `c7c0a3dfdb8cb441d7c53e635e3109aec50df30a`). Refuerzo posterior del workflow: además de HTML, Chrome, Firefox/WebKit y filtrado DRS, descargar y comprobar el JSON con **exactamente los dos IDs** aprobados, commit `9599e46a93f3143ab5d6712cca80341697672658`. [Despliegue y comprobación HTTP final 41298520411](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41298520411): **success**; GitHub confirma `Verificar el sitio público tras el despliegue` completado satisfactoriamente. |

## Criterios de aceptación

- [x] 2 aclaraciones explícitas, únicas, de propietario y Talento correctos.
- [x] Efecto literal original, coste y activación sin cambios.
- [x] UI distingue «Aclaración autoral aprobada» del efecto fuente.
- [x] Otras 22 fichas DRS no presentan aclaraciones.
- [x] CiFi/Nocturna sin nuevos datos ni exposición de suplementos.
- [x] Pruebas añadidas para los dos casos y ausencia de propagación.
- [x] Cuatro suites CI satisfactorias sobre el commit final de la PR.
- [x] Publicación segura y URL pública confirmada: https://naufragio-rolero.github.io/nd20-character-creator/.

**Nota de alcance:** «Normalización documental» significa que la aclaración puede consultarse como dato editorial. No equivale a un sistema de combate automatizado.
