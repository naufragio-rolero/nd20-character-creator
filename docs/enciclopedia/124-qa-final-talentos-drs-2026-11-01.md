# 124 — QA de la Forja DRS: Talentos, hover y clasificación

**Fecha de comprobación:** 2026-11-01  
**Rama:** `feat/fases-talentos-drs-2026-11-01` · **Commit funcional validado:** `affe94444c289c9e43dd9be9c7d5fc241e9e1f52`  
**Estado:** **validación técnica completada, 4/4 suites verdes**. Candidato **sin fusionar ni desplegar**; publicación aún pendiente.

## Evidencias ejecutadas sobre el mismo SHA

| Control | Workflow | Resultado |
|---|---|---|
| Sintaxis, reglas, regresión documental, 22/24 y 24 categorías | [Validar Conjuros y Forja](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640050) | **success** |
| Chromium, compras y consulta DRS (hover/clic/escape) | [Forja E2E Chromium](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640164) | **success** |
| Firefox y WebKit, hover real, fijación, lectura, Escape, scroll, foco, tap, cuatro temas y móvil | [Compatibilidad](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640096) | **success** |
| Paquete de lista blanca, ausencia de suplementos, no regresión DRS y E2E Chrome/Firefox/WebKit **sobre los archivos candidatos** | [Candidato público DRS](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640113) | **success** |

**Capturas revisadas visualmente:** [artefacto E2E del candidato](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640113/artifacts/13099089461). La revisión cubre ventanas fijadas y texto único del Talento *Expulsar muertos vivientes* en Firefox y WebKit para **Clásico, Ébano, Cerúleo, Obsidiana y móvil (390×844)**. Las tarjetas se mantienen dentro de pantalla, el texto es legible y la categoría visible; el color nunca sustituye el nombre de la categoría.

**Paquete generado, NO publicado:** [artefacto de candidato DRS](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41346640113/artifacts/13099184159), con comprobación de lista blanca, sin habilitar automáticamente Talentos de Bitácora, Zelda o Exploración.

## Regresión detectada y resuelta

Las primeras ejecuciones fallaron intermitentemente en WebKit al cambiar de un Talento abierto por clic a otro enlace mediante hover. El origen probable fue el `focusin` de puntero que centraba un diálogo durante `pointerdown`, antes del `click`. Se corrigió preservando el estado del diálogo fijado frente a eventos de hover tardíos y separando la ruta de pulsación de la ruta de teclado: **pointerdown → click fija; Tab → focusin fija**. Se añadió una aserción de visibilidad del diálogo antes de simular hover sobre otra referencia. La ejecución definitiva, sobre commit `affe9444`, superó ambas suites WebKit independientes.

## Criterios para promoción (todavía pendientes)

1. Mantener la PR #17 como candidato aislado y revisar la distinción documental: DRS original, clasificación Excel, aclaraciones aprobadas y propuestas **aún no ratificadas para editar el DRS**.
2. Las clasificaciones de los 15 Talentos de Especie se muestran como provenientes del Excel y **no** como etiquetas formales ya presentes en el DRS.
3. Si se decide publicar, aprobar y fusionar **exclusivamente** la PR #17, fijar el SHA de despliegue y comprobar el sitio LIVE sobre el paquete construido. Este informe **no equivale a una publicación autorizada**.
4. La PR #13 de Equipo y el contenido de otros orígenes continúan fuera de la distribución y no deben fusionarse por derivación.

**Conclusión:** implementación de Fases 1–4 terminada y validada técnicamente; en Fase 5 solo resta la promoción y verificación LIVE cuando se autorice, sin alterar el DRS ni resolver por inferencia las discrepancias autorales.


## Posdata — Promoción validada

El estado de candidato y el apartado de criterios para promoción anteriores describen **la situación cuando se redactó este informe**. Posteriormente, la [PR #17](https://github.com/naufragio-rolero/nd20-character-creator/pull/17) se fusionó con el SHA de contenido `a8371718e97c57bbcc5dc73a819704722284f052`. Se publicó por workflow fijado a dicho SHA y se verificó en la URL de Pages: [LIVE 41349181874 — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874). Consulta el [informe 125](125-publicacion-live-talentos-drs.md) para la cadena definitiva de publicación y decisiones autorales pendientes. **No se ha modificado el DOCX del DRS original.**
