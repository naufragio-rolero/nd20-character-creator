# La Forja — límites visibles de Nivel y cantidades de compra

**Fecha:** 03/11/2026. **Origen:** pruebas de LoKoO con Nivel 99, 30 burros y 70 clavas. **Ámbito:** interfaz y economía DRS de Fantasía. **No establece reglas nuevas de Naufragio d20.**

## 1. Nivel de personaje: fallos silenciosos

Los campos de creación tienen un límite propio del sistema: **1–30** para Naufragio d20 y **1–36** para Dungeon Hack. El HTML ya declaraba `max` y `assets/app.js > config` rechazaba valores fuera de rango, pero la validación nativa del formulario se producía **antes** del manejador de generación. Desde el botón de generar, con la configuración cerrada, el error podía no ser visible y parecer que el botón no hacía nada.

La Forja ahora muestra un error próximo al campo de Nivel tan pronto como se introduce un valor inválido, identifica su rango y lo marca mediante `aria-invalid`. Si se intenta generar con Configuración cerrada, el formulario abre el diálogo de configuración, da foco al campo inválido y muestra el mensaje. **No convierte silenciosamente el Nivel 99 en 30 ni genera un personaje con nivel inventado**. Al corregir el valor, desaparece el aviso.

## 2. Compra masiva: límites exclusivos de UX

Los editores de Útiles y de Armamento permitían hasta **99 unidades en una operación**. El motor de Útiles no tenía siquiera un máximo por línea. Se podía repetir la compra mientras hubiera saldo. Esto era una posibilidad de la interfaz, no una concesión reglamentaria.

Por decisión de **UX de La Forja**, establecemos estos límites iniciales:

- **10 unidades por artículo y personaje**, tanto para equipo normal como para herramientas, consumibles, útiles y armamento.
- **5 monturas en total por personaje**, sumando burros, ponis, caballos y otras monturas documentadas, incluso si son de tipos diferentes.

El cálculo tiene en cuenta el inventario existente (incluidas cantidades `×N`), compras anteriores, el carrito pendiente y, cuando se cambia una pieza inicial, la cantidad de objetos que permanece tras retirar el sustituido. Por tanto, 70 Clavas y 30 burros están bloqueados incluso repartidos en compras repetidas. **Las fichas ya creadas que superen estos límites no pierden artículos**: simplemente no pueden adquirir más unidades hasta volver a estar por debajo del cupo.

La interfaz muestra el cupo todavía disponible al cambiar de artículo y desactiva la confirmación de armamento cuando se excede. Las comprobaciones decisivas se ejecutan también en `assets/equipment.js`, así que no se eluden escribiendo un número mayor mediante las herramientas del navegador. No se modifican precios ni Competencias, ni se introduce una regla de carga/capacidad, supervivencia de monturas o compra en campaña.

## 3. Seguridad del carrito

El botón para confirmar Útiles valida el carrito completo con el motor, **independientemente del valor que quede escrito en el selector de la próxima línea**. Eso evita que una cantidad provisional de 30 burros impida confirmar una compra legítima de Tiza. La opción `formnovalidate` del botón solo omite la validación nativa de la *línea nueva*; el motor económico sigue verificando precio, saldo, cantidad y límites del carrito antes de tocar la ficha.

Los intercambios iniciales no se bloquean por un error en el campo de cantidad de compras adicionales.

## 4. QA y publicación

- `tests/limites-compra-ux.js`: 30 burros, 70 Clavas, monturas mixtas, carritos divididos, compras posteriores y artículos con cantidades preexistentes.
- `tests/browser-compras.js`: Nivel 99 con Configuración cerrada, mensaje/foco, rechazo de cantidades extremas y ausencia de mutaciones del inventario.
- Workflows: reglas DRS, Chrome, Firefox/WebKit, PDF A5 y paquete público DRS sin DLC.

Este ajuste sigue el ciclo habitual de **rama → PR → pruebas → fusión en `main`**. **No promocionar LIVE** sin aprobación separada.
