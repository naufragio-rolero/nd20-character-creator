# Forja 1.0 — Pruebas de navegador real para las compras DRS

> **Ampliación de cobertura (31/10/2026):** la prueba E2E incluye eliminación de líneas del carrito, prevención de confirmaciones accidentales por Intro, escritorio real a 1440 px, emulación móvil con editor abierto y capturas PNG descargables desde GitHub Actions. Se ha realizado una inspección visual puntual de las capturas. Véase [informe 98 — revisión visual y navegación del carrito](98-revision-visual-carrito-y-navegacion.md). Las descripciones de alcance y límites previas se conservan como historial.

**Fecha:** 31/10/2026. **Ámbito:** editor de compras individuales de útiles y focos; nombre *Martillo de campamento*.  
**Rama:** `feat/forja-conjuros-fichas-2026-10-30` · **PR #4:** borrador, sin fusionar ni desplegar.  
**Referencia funcional:** [informe 96](96-martillo-campamento-y-compra-utiles.md). Las reglas mecánicas y precios continúan procediendo del DRS o de las decisiones editoriales consignadas en los informes 94–96.

## Necesidad detectada

Los tests de Node verificaban catálogo, compras y existencia de controles, pero **no ejecutaban la página en un navegador**: podían pasarse por alto errores del DOM, la carga inicial de JSON, eventos, portapapeles, exportaciones o presentación móvil.

Se ha incorporado `tests/browser-compras.js`, ejecutado con **Google Chrome/Chromium en modo headless**. Emplea únicamente los módulos incluidos en **Node 24** y el protocolo de depuración **Chrome DevTools Protocol** (CDP), sin npm ni un servicio externo. Abre un servidor HTTP temporal local, carga `index.html` y deja que la aplicación recupere sus archivos JSON de forma normal. **No manipula el estado privado de la aplicación para hacer trampas en las pruebas**: opera mediante los controles visibles, eventos del DOM y el navegador.

Se añadió el flujo independiente `.github/workflows/browser-compras.yml` para ejecutar la prueba sobre cada PR y los cambios de esta rama, junto a los tests generales.

## Recorrido automatizado

1. Esperar que la aplicación anuncie **«Datos listos»** y comprobar que la edición Fantasía muestra **solo 4 Ocupaciones y 8 Especies DRS**, sin mostrar DLC.
2. Generar **dos fichas de Guerrero** con semilla fija y riqueza suficiente. Comprobar que cada ficha ofrece «Comprar útiles» y conserva su riqueza inicial.
3. Abrir las compras de la primera ficha: comprobar **43 opciones** (41 útiles + 2 focos); **Martillo de campamento (2 mo)** aparece y la **Almádena** del armamento no se confunde con la herramienta.
4. Añadir dos Martillos al carrito (**4,00 mo**) y **Cancelar**. Comprobar que la ficha seleccionada y la segunda permanecen byte a byte iguales en su representación DOM, sin saldo descontado.
5. Volver a abrir y añadir **dos Martillos de campamento y tres Tizas**, total **4,03 mo**. Comprobar además la presentación y cálculo de **Antídoto de Nivel 3 = 150 mo** sin añadirlo al carrito.
6. Intentar añadir **99 Catalejos** (una compra que excede el presupuesto). La interfaz debe mostrar el error y **conservar intactas** las dos líneas anteriores del carrito.
7. **Confirmar la compra** y verificar exactamente **4,03 mo** de descuento. Los artículos aparecen en la ficha adquirente y la segunda ficha **no cambia**.
8. Pulsar **Copiar ficha** (portapapeles del navegador controlado durante el test) y **Exportar .txt** (capturando el Blob de descarga): ambos deben contener Martillos, Tizas y el saldo final. El Blob procede de la acción real de exportación.
9. Reabrir el editor: el saldo visible debe ser el **actualizado**. Eliminar la ficha adquirente cierra el editor e impide compras sobre un ID desaparecido.
10. Cambiar el navegador a **390 píxeles de anchura** y comprobar ausencia de desbordamiento horizontal.
11. Verificar que abrir el editor pone el **foco de teclado** en el selector de artículo y que **Cancelar** y **Confirmar** lo devuelven al botón de compras del personaje. Rechazar excepciones JS no capturadas durante la prueba.

## Incidencias corregidas a partir del navegador

**E2E-01 — Arranque con carrera en el botón Generar.** El HTML inicial no incluía `disabled` para «Generar personajes», aunque `app.js` lo deshabilitaba al ejecutarse y lo volvía a habilitar tras cargar los datos. Durante la carga inicial quedaba un instante habilitado. Se ha incorporado `disabled` directamente en `index.html` y el test espera ahora el estado real **«Datos listos»**, no solo que el botón esté habilitado. También se protege el marcado inicial mediante una aserción.

**E2E-02 — Enfoque de teclado del formulario de compras.** Al abrir el editor se veía el panel, pero el foco no se trasladaba al nuevo formulario. Se envía al selector y se devuelve al botón que abrió la compra tras Cancelar o Confirmar. La prueba en Chrome verifica esos tres cambios de foco.

**E2E-03 — Precondición de cantidad en la prueba.** El campo de cantidad mantenía «3» tras comprar tres Tizas; al cambiar a Antídoto el caso de prueba esperaba inicialmente 150 mo cuando estaba calculando tres dosis (450 mo). Se ha corregido el **guion E2E** para fijar «1» antes de comprobar el precio. **No era un error de las reglas ni del motor**.

## Validación y límites

- Los dos flujos de GitHub Actions —`Validar Conjuros y Forja` y `Forja - E2E navegador (compras DRS)`— deben aparecer **verdes** en el commit final del bloque.
- El CI corre contra el estado resultante de la PR, **sin desplegar nada**.
- Se realiza un recorrido completo de comportamiento en Chrome real; el test móvil comprueba un posible desbordamiento, **no equivale a revisión visual humana** ni a una auditoría integral de accesibilidad y compatibilidad Firefox/Safari.
- No existe persistencia de fichas entre sesiones ni se pretende añadirla mediante este test; la compra es local a la mesa actual.
- El motor de combate o ejecución de Talentos y Conjuros queda fuera del alcance.

**Resultado editorial:** el nombre *Martillo de campamento* queda fijado (2 mo y uso como Clava); *Almádena* se reserva al arma a dos manos de 60 mo. No quedan decisiones autorales abiertas por este bloque.
