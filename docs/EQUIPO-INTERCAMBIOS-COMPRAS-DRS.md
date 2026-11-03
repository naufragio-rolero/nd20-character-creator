# Forja — Intercambio de equipo inicial y compras adicionales DRS

**Fecha:** 03/11/2026. **Alcance:** Naufragio d20 Fantasía (DRS). **Rama de desarrollo:** `feat/equipo-intercambio-compras-drs-20261103`, PR #60. No representa una publicación LIVE.

## 1. Decisión autoral: Dardo y moneda fraccionaria

El autor precisa el **03/11/2026** que un **Dardo vale 5 monedas de cobre (mc)**, es decir, **0,05 monedas de oro (mo)**. En el documento `NaufragioD20DRS.docx` consultado, la tabla de armas muestra el precio del Dardo como «—». Por tanto, **5 mc es la rectificación/decisión autoral**, no una transcripción literal de esa celda.

El catálogo `data/equipo-inicial.json` ya contenía las equivalencias `1 mc = 0,01 mo` y `1 mp = 0,1 mo`. Se mantiene un único saldo en **mo**, con precisión de **0,01 mo**, y se muestra «5 mc» junto al precio decimal del Dardo. Esto **no constituye** la implementación completa de una billetera con saldos separados en oro, plata y cobre. La munición «Dardos» sigue siendo una pieza distinta, al precio y Dado de Uso documentados.

## 2. Compra inicial e intercambios

Se mantiene la generación aleatoria ya implantada. Las limitaciones porcentuales de la compra sugerida solo afectan a **esa primera elección automática**, no al cambio manual posterior.

`assets/equipment.js > compraInicial` devuelve una colección `compras_iniciales_intercambiables` de registros de **armas, armaduras, escudos y varitas efectivamente pagados**. Cada registro conserva índice dentro de `personaje.equipo`, grupo de catálogo, nombre, precio pagado, precio inicial y procedencia. `assets/rules.js` incorpora esos datos a la ficha.

Al cambiar un artículo:
- Se identifica **por índice y registro de compra**, nunca solo por el nombre coincidente con un objeto de regalo o paquete.
- Se recupera el precio pagado por la **pieza actualmente registrada en ese mismo hueco** y se descuenta el precio DRS de la elegida. Se actualiza el registro tras la operación; intercambiar repetidas veces no genera dinero.
- El cambio es dentro de la misma familia funcional: arma/varita ↔ arma/varita; armadura ↔ armadura; escudo ↔ escudo. No se cambia un arma por una protección cobrando un reembolso improcedente.
- No se reembolsan municiones iniciales al cambiar de arma, objetos de paquetes, regalos, recuerdos ni adquisiciones posteriores.
- No se equipan automáticamente las nuevas piezas. Si una armadura o escudo deja de estar en el inventario, se limpia la selección equipada.

**No es una regla general de venta ni de recuperación de valor durante la campaña:** únicamente corrige las elecciones sugeridas por el generador en la creación de la ficha.

## 3. Compra adicional

El botón «Armamento» en la ficha abre un editor con operaciones de **Cambiar equipo inicial** y **Comprar equipo adicional**. Se conservan el editor separado de «Útiles», las compras anteriores y la consulta informativa de armadura equina.

La compra adicional permite armas, armaduras, escudos, varitas y munición de los catálogos DRS. Admite cantidades y descuenta el valor íntegro del saldo restante; añade el objeto al inventario sin retirar los anteriores ni equiparlo automáticamente. La munición conserva sus DU para consulta y PDF. Los artículos sin precio verificable no se consideran gratuitos.

Se reutiliza la lógica de Competencias y de restricciones de talla de la propuesta inicial. El DRS (§ Competencias) prevé Desventaja por usar equipo sin Competencia y añade Desventaja en Fuerza, Agilidad y Resistencia al vestir armaduras incompetentes. Se muestran avisos para esos casos. Las prohibiciones expresas de una Ocupación no se transforman en simples avisos. Las Varitas de defensa **requieren siempre** la competencia explícita —Guerrero no la obtiene por «cualquier arma»—; Baja estatura limita los escudos al pequeño, según la decisión de Forja vigente.

## 4. Pantallas, TXT y PDF

La interfaz recalcula inventario, riqueza, observaciones y protecciones tras cada operación. La copia en texto lee el modelo actualizado. El PDF A5 utiliza también el inventario actualizado, y reconoce los valores DRS de varitas y municiones, incluso en lotes `×N`. Los popups usan el mismo nombre base para cantidades adicionales. Sin automatización de combate, carga, comercio futuro ni gasto automático de munición.

## 5. Pruebas y límites de publicación

- `tests/armamento-edicion.js`: intercambio sucesivo, no duplicación de reembolsos, exclusión de paquetes, monedas fraccionarias, presupuesto, Varitas, restricciones DRS, Blinkaje y PDF.
- `tests/browser-compras.js`: apertura/cierre real del editor, foco, catálogo y Dardo con 5 mc.
- `tests/alcance-drs.js` y `tests/paquete-publico-drs.js`: precio corregido y paquete de distribución.
- Workflows de Conjuros/Forja, Chrome, Firefox/WebKit, PDF A5 y paquete público DRS antes de fusionar.

**No publicar LIVE en el curso de esta PR.** La publicación DRS requiere SHA aprobado, paquete filtrado y verificación propia. Quedan fuera CiFi, Nocturna, Dungeon Hack, Objetos mágicos, simulación de combate y un sistema contable con saldos separados de mc/mp/mo.
