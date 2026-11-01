# 123 — Ejecución Fases 2–4: interfaz, texto único y aclaraciones

**Fecha:** 2026-11-01 · **Rama:** `feat/fases-talentos-drs-2026-11-01` · **Estado:** cambios candidatos aislados, sujetos a CI/QA de la Fase 5. **No publicable hasta su validación y promoción autorizada.**

## Fase 2 — Hover y fijación

- `assets/tooltip-ui.js`: restaurada la apertura de Talentos con `pointerover` de ratón; el comportamiento ya existente de Poderes se conserva.
- Enlace y popup comparten una ventana de tolerancia al cambio de zona. Mientras el ratón está sobre la tarjeta, se cancela el cierre temporal.
- `click` y `focusin` fijan la tarjeta; hover sobre otras referencias no reemplaza una ficha fijada. `Escape` y el botón Cerrar devuelven el foco al origen; clic fuera cierra. En móvil, la pulsación fija el diálogo.
- Se conserva altura máxima adaptable y `overflow-y:auto`. No se añaden funciones de combate.

## Fase 3 — Categorías oficiales y único efecto

- `data/glosas-talentos-drs.json` pasa a contener **24 clasificaciones** vinculadas a las 24 identidades literales, sin glosas y sin categorías alternativas. Su nombre de archivo es histórico para preservar la lista blanca y la carga de datos existente.
- `assets/tooltips.js` comprueba estrictamente las cinco categorías; exige coincidencia con la línea formal del DRS para las nueve entradas de Ocupación. Para Especie, el estado continúa siendo **propuesta de incorporación al DRS** y la fuente de la categoría es el Excel.
- `assets/tooltip-ui.js` muestra categoría (texto y color), propietario, los campos reglamentarios existentes sin duplicar la misma etiqueta, y **una sola descripción literal**. Se retiran de la vista «En pocas palabras», «Tipo de uso (guía editorial)» y «Leer texto íntegro del DRS».
- `assets/styles.css` define cinco tratamientos visuales de categoría sobre la tarjeta de alto contraste; el nombre escrito es obligatorio y el color no es el único identificador.

## Fase 4 — Aclaraciones fuera de la vista normal

- Las dos aclaraciones aprobadas de `data/aclaraciones-talentos-drs.json` se conservan con fecha/fuente y se muestran **únicamente** si se activa `Configuración avanzada → Mostrar detalles técnicos`, dentro del desplegable «Detalles técnicos».
- Los efectos de `data/talentos-drs-literales.json` son inmutables en esta fase. Se mantienen por separado el texto original, las notas de autoría y las propuestas siguientes.

### Propuesta DRS-A01 — Expulsar muertos vivientes (pendiente de nueva aprobación)

**Lugar previsto:** inmediatamente después de la oración del texto original que señala la Probabilidad 15+ de destrucción, en la entrada del Clérigo (párrafos DOCX 208–212).

**Añadido propuesto, no incorporado al manual:**

> Se realiza una Tirada de Probabilidad 15+ por cada muerto viviente afectado. Si hay muchas criaturas idénticas, puedes agruparlas y resolverlas con una sola Tirada por grupo, aplicando el resultado a todas sus integrantes. Por ejemplo, tres zombis y dos esqueletos pueden resolverse con dos Tiradas, una por tipo. No existe un número mínimo obligatorio para agrupar.

**Alcance:** recoge la aclaración autoral aprobada el 01/11/2026; no cambia alcance de 18 metros, restricción de Nivel, coste de 1 Punto de Esfuerzo, atributo Intuición ni duración de la expulsión. **Pendiente de aprobación de redacción para el DRS**, no es efecto nuevo aprobado para sustituir texto original.

### Propuesta DRS-A02 — ¡Sálvese quien pueda! (pendiente de nueva aprobación)

**Lugar previsto:** tras el efecto original del Mediano amable, párrafo DOCX 141.

**Añadido propuesto, no incorporado al manual:**

> Puedes utilizar este Talento incluso cuando la Parálisis o el Miedo te impidan actuar o te obliguen a huir. El Talento sigue consumiendo la Acción y el Punto de Esfuerzo indicados; no concede una Acción adicional.

**Alcance:** trasladar al DRS la aclaración autoral del 01/11/2026 sin cambiar su efecto original. La clasificación **Reacción** del Excel y el coste **una Acción** del DRS permanecen discrepantes hasta decisión autoral específica. **Pendiente de aprobación de redacción**.

## Control de regresión y límites

- Pruebas documentales: `tests/sincronizacion-talentos.js`, `tests/talentos-drs.js` y `tests/fichas-drs-ux.js`.
- E2E: `tests/browser-compatibilidad.js` (Firefox/WebKit: hover real, recorrido al popup, fijación, Escape, foco, cuatro temas, móvil/tap) y `tests/browser-compras.js` (Chromium: evento pointerover, diálogo y categoría).
- No se modifica `NaufragioD20DRS.docx`, motor de generación, precios/Equipo ni PR #13. Los 121 Talentos externos no entran en el catálogo DRS.
- Los cambios de interfaz no deben publicarse hasta verificar suites, capturas y paquete público. Esta rama constituye un candidato para revisión.
