# Forja 1.0 — Revisión visual y endurecimiento de compras DRS

**Fecha:** 31/10/2026. **PR:** [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4), en borrador.  
**Fuentes de reglas:** tablas de equipo del `NaufragioD20DRS.docx`, decisiones editoriales ya fijadas sobre Dardo, Marca del dador oscuro y Martillo de campamento. No se han alterado precios, Competencias, listas de Conjuros ni progresiones en este bloque.

## Cambios en la interfaz

### UX-COMP-01 — Eliminar una línea del carrito sin cancelar

**Hallazgo:** el editor permitía añadir, confirmar o cancelar la compra completa, pero no retirar solo un artículo añadido por error. Si el carrito tenía varias líneas, había que cancelar y repetir todas.

**Solución:** cada línea tiene ahora el botón **Quitar**, con etiqueta accesible que identifica el artículo y su posición. Al pulsarlo:
- Se retira exclusivamente esa línea del borrador y se recalcula el total.
- El **saldo de la ficha sigue intacto** hasta confirmar la compra.
- La última línea puede eliminarse; «Confirmar compra» vuelve a deshabilitarse si el carrito está vacío.
- El foco de teclado se conserva en otra línea cuando es posible, o regresa al selector de artículos.

No se ha inventado una regla de devolución de objetos ya comprados: **Quitar** solo modifica el **carrito sin confirmar**.

### UX-COMP-02 — Pulsar Intro no debe confirmar accidentalmente

**Hallazgo:** un formulario HTML con botón de envío puede interpretarse como confirmación cuando se pulsa Intro dentro de un campo de número. Si el carrito ya tenía artículos, esto podía finalizar la compra al intentar introducir una cantidad.

**Solución:** Intro en **Cantidad** o **Nivel de Antídoto/Veneno** ejecuta **Añadir a la compra** en lugar de confirmar; la compra final requiere su propio botón. **Se conserva el comportamiento nativo de teclado de Artículo**, un selector HTML `select`, para no bloquear su apertura y selección con Intro. El código ignora la repetición mantenida de la tecla.

El recorrido E2E usa `Input.dispatchKeyEvent` en Chromium para comprobar que Intro añade una línea adicional sin cerrar el editor ni descontar dinero.

## Evidencias de navegador y hallazgo de cobertura

El primer reporte de capturas utilizaba la **anchura predeterminada de Chrome headless (780 px)**; eso activaba un diseño cercano al de tableta y **no representaba fielmente un monitor de escritorio**.

Se ha ampliado `tests/browser-compras.js` para:
- Forzar **1440 × 900 px** en las pruebas y capturas de escritorio y comprobar que se presenta la barra lateral y que el editor dispone de ancho suficiente.
- Verificar de nuevo el editor **abierto a 390 × 844 px** en emulación móvil, no únicamente el ancho del documento con el editor cerrado.
- Guardar dos **PNG reales del navegador**: `compras-escritorio.png` y `compras-movil.png`, adjuntos durante 14 días al workflow `Forja - E2E navegador (compras DRS)`.
- Ajustar el desplazamiento de las capturas para mostrar el editor, y comprobar que no hay desbordamiento horizontal en ambos tamaños.
- Seguir validando compra de 4,03 mo, dos fichas aisladas, cancelación, eliminación de una línea, sobrepresupuesto, Antídoto por Nivel, copia, exportación y foco de teclado.

**Inspección visual de las capturas recuperadas:** se ha comprobado que el editor móvil tiene controles y textos legibles, que no rebasa la anchura y que las líneas y botones se distinguen. La revisión de escritorio confirma el diseño de dos columnas y la colocación correcta del botón Quitar, el total y Confirmar. Esto complementa el E2E, pero **no sustituye una revisión manual interactiva en otros navegadores**, dispositivos o herramientas de accesibilidad.

## Validación

`tests/browser-compras.js` cubre ahora tanto los casos originales del [informe 97](97-pruebas-navegador-compras-drs.md) como el borrado de líneas y la navegación con Intro. `assets/styles.css` hace que las líneas de compra y sus botones puedan ajustarse en pantallas estrechas. `.github/workflows/browser-compras.yml` guarda las capturas como artefactos de GitHub Actions aunque el test falle, si se pudieron producir.

**Límites deliberados:**
- No se ha ensayado todavía con un navegador Firefox o Safari real.
- La revisión es **visual puntual**, no una auditoría completa WCAG ni una evaluación manual integral con lector de pantalla.
- La PR sigue **draft**, sin fusión ni despliegue, por lo que ninguna de estas modificaciones es pública todavía.

**Decisiones editoriales:** **ninguna pendiente** derivada de este bloque. *Martillo de campamento* es un útil de 2 mo y *Almádena* sigue siendo el arma de 60 mo.
