# 125 — Publicación LIVE de la Forja DRS: Talentos y consulta rápida

**Fecha:** 2026-11-01 · **Estado:** **PUBLICADA Y VERIFICADA**.
**URL:** https://naufragio-rolero.github.io/nd20-character-creator/

## Cadena de promoción reproducible

| Elemento | Identificación y estado |
|---|---|
| PR de aplicación | [#17](https://github.com/naufragio-rolero/nd20-character-creator/pull/17), **fusionada** |
| Commit integrado / contenido servido | `a8371718e97c57bbcc5dc73a819704722284f052` |
| Workflow de despliegue | `.github/workflows/forja-live.yml`, `actions/checkout` fijado al SHA anterior |
| Commit de corrección del workflow | `b4ff6b83fcb14dd31d1129f51fa871fe3a39aab5` |
| Ejecución de publicación definitiva | [Forja LIVE 41349181874](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874), **success** |
| QA del candidato antes de la fusión | [Informe 124](124-qa-final-talentos-drs-2026-11-01.md): **4/4 suites verdes**, además de suites verdes en el último SHA de la PR |

La primera ejecución de LIVE llegó a publicar GitHub Pages, pero su **verificación adicional** falló porque el control Node intentó leer `/tmp/glosas-talentos-drs.json` antes de descargarlo. No hubo fallo del producto. El workflow fue corregido añadiendo la descarga antes de esa comprobación; la nueva ejecución de LIVE finalizó **completamente en verde**.

## Comprobaciones de la web pública

El propio workflow desplegó **solo** `dist/public-drs`, después de ejecutar la guardia de archivos, la comparación de los repertorios originales y las pruebas E2E en Chrome, Firefox y WebKit. Tras la publicación descargó los recursos **desde la URL de GitHub Pages** y comprobó:

- 24 registros de Talento: 15 relaciones de Especie, nueve de Ocupación; cinco categorías `Acción`, `Especial`, `Mejora`, `Pasiva`, `Reacción` y fuente documentada por fila.
- Código público con hover de Talentos, fijación mediante clic, ficha única, categoría rotulada y aclaraciones añadidas exclusivamente a `Detalles técnicos`.
- Ausencia de los bloques «En pocas palabras», «Tipo de uso (guía editorial)» y «Leer texto íntegro del DRS» en el nuevo componente.
- 10 Técnicas DRS, 111 descripciones de Equipo, ocho Especies, doce SVG y las dos aclaraciones autorales aprobadas.
- Exclusión de los selectores CiFi y Nocturna y guardia de la lista blanca para evitar distribución accidental de suplementos. **La PR #13 no se ha fusionado**.

**Resultado:** el producto DRS público de esta entrega está terminado y funcional. El control HTTP final está confirmado en [LIVE 41349181874](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41349181874).

## Hallazgos y decisiones editoriales **no bloqueantes**

1. **¡Sálvese quien pueda!**: `Reacción` en la hoja Excel, pero el efecto DRS exige **una Acción** y 1 Punto de Esfuerzo. Se conservan ambas fuentes; no hay modificación de mecánica. Requiere pronunciamiento autoral **solo si se desea reconciliar clasificación y texto**.
2. **Corpulencia**: categoría Excel `Mejora`, con uso condicionado de Esfuerzo en el DRS. **Recuperación**: etiqueta formal DRS `Pasiva`, con Esfuerzo e Intervalo en el efecto. No reinterpretar sin decisión.
3. **Siete relaciones del DRS** tienen diferencias textuales respecto de la columna `Efecto` del Excel, correspondientes a seis entradas únicas. Están identificadas en [matriz 122a](122a-matriz-talentos-drs-excel.json). El DRS sigue teniendo prioridad.
4. La incorporación de las **15 categorías de Especie al DOCX original** y las propuestas de redacción para **Expulsar muertos vivientes** y **¡Sálvese quien pueda!** están listas en [123](123-ejecucion-hover-categorias-aclaraciones.md), **pendientes de aprobación específica para editar el manual**. La publicación de la interfaz **no modifica ni ratifica una nueva redacción del DRS**.
5. Las 121 entradas de Bitácora/Zelda/Exploración quedan en inventario y pendientes de cotejo específico, **sin publicar**. La PR #13 permanece como borrador independiente.

**Cierre:** las cinco fases se han completado para **esta entrega pública de la Forja DRS**. No existe intervención editorial necesaria para su funcionamiento o publicación. Las decisiones pendientes corresponden a una futura revisión del **manual original**, no a bloqueos de esta entrega.

## Recuperación

La versión anterior permanece identificada por SHA `9293efb82bec97350a52fc57b657f564b3feabf3`. El punto de publicación se controla mediante `.github/workflows/forja-live.yml` y puede volver a fijarse a ese commit mediante un cambio revisado del workflow y nueva ejecución de sus guardias. No sustituir el SHA publicado por `main` dinámico.
