# Forja 1.0 — Martillo de campamento y editor de compras de útiles DRS

**Fecha:** 31/10/2026 · **PR:** [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4) · **Estado:** en borrador, sin fusionar ni desplegar.  
**Fuentes:** decisión editorial del autor (31/10/2026) y tablas de campamento y armas del `NaufragioD20DRS.docx`, inventariadas en el [informe 95](95-decisiones-dardo-marca-y-utiles-drs.md).

## Decisión editorial: Almádena, nombre reservado al armamento

El DRS emplea «Almádena» tanto para una herramienta de campamento de **2 mo** que puede usarse como Clava como para un arma a dos manos de **60 mo**. El autor establece un **renombrado editorial en Forja** para que un personaje no confunda ambos objetos:

| Contexto | Nombre visible Forja | Precio | Referencia original DRS |
|---|---|---:|---|
| Equipo de campamento | **Martillo de campamento** | **2 mo** | Almádena |
| Armamento de dos manos | **Almádena** | **60 mo** | Almádena |

La herramienta mantiene su utilidad como Clava. **No cambian costes, Competencias, Daño ni estadísticas del arma.**

En `data/equipo-inicial.json` el útil ahora tiene ID **`campamento-martillo`**, nombre **`Martillo de campamento`**, `nombre_original_drs: "Almádena"` y descripción con su equivalencia. El arma permanece intacta en `armas[]`, y el catálogo registra explícitamente la decisión en `decisiones_editoriales.martillo_campamento`.

**Compatibilidad:** se ha sustituido el identificador anterior `campamento-almadena` (no formaba parte de un selector público de compras). No se migran compras persistentes porque Forja todavía no guarda fichas de personajes en servidor ni existía una interfaz de carrito publicada.

## Editor de compras individuales de útiles

**Antes:** `assets/equipment.js` exponía `consultarUtilFantasia()` y `compraUtilesFantasia()`, que permitían calcular compras por ID y presupuesto pero no tenían una pantalla de uso.

**Ahora:** `index.html`, `assets/app.js` y `assets/styles.css` incorporan el editor bajo la zona de resultados de Forja, con estas operaciones:

1. Una ficha de **Naufragio d20 · Fantasía** muestra el botón **Comprar útiles**. No se ofrece a Dungeon Hack, CiFi ni Nocturna.
2. El editor identifica al personaje y su **saldo disponible en mo**, obtenido de `saldo_mo`, un **número** generado desde `assets/rules.js`. No intenta interpretar el texto libre de «Riqueza».
3. Un selector de grupos contiene las **41 entradas de útiles del DRS** y los dos focos con precio, identificados por ID aunque puedan compartir nombres históricos. Los grupos son Aventura, Campamento, Consumibles, Herramientas, Escritura y Focos.
4. Se elige **cantidad (1–99)**; para **Antídoto y Veneno** aparece el campo **Nivel (1–30)** y se aplica el Precio por Nivel documentado. El editor enseña una descripción abreviada, DU si procede y precio del lote.
5. **Añadir a la compra** comprueba la suma acumulada contra el saldo y construye un carrito sin tocar la ficha.
6. **Confirmar compra** vuelve a validar la transacción, incorpora artículos al equipo del personaje, actualiza `saldo_mo`, modifica la representación «Riqueza» y añade una nota con el gasto. Así se reflejan los datos al exportar/copiar la ficha.
7. **Cancelar** cierra el editor sin cambio; eliminar la ficha destinataria o limpiar la mesa también cancela su carrito.

**Propósito:** compras puntuales complementarias al equipo inicial; no generan obsequios ni modifican el catálogo o las Competencias del DRS. Una ficha puede realizar compras sucesivas con su saldo actualizado.

## Decisiones técnicas

- La selección y los precios son fuente de verdad en `assets/equipment.js`; el navegador no calcula ni descuenta dinero por duplicado.
- No hay reserva ni descuento previo: la compra es **transaccional** y solo se aplica al pulsar **Confirmar compra**.
- La entrada de carrito está asociada al ID único de la ficha de esa sesión. Ante desaparición de la ficha, el editor no puede confirmar una compra sobre otro personaje.
- `saldo_mo` y `capital_inicial_mo` son números en la ficha Fantasía. No se añaden a Dungeon Hack, CiFi ni Nocturna.
- Los resultados siguen siendo una **propuesta de creación de personaje**, no un registro de transacciones persistente entre sesiones.

## Pruebas

`tests/alcance-drs.js` comprueba que:

- La herramienta se llame «Martillo de campamento», valga **2 mo**, conserve su nombre DRS y no altere el arma «Almádena» de **60 mo**.
- Un personaje conserve `saldo_mo` y `capital_inicial_mo` numéricos coherentes con la riqueza inicial.
- La previsualización de un carrito con martillos y tiza no muta el personaje; los costes fraccionarios y el saldo posterior son exactos.
- Los artículos de un carrito rechazado no modifican la selección existente; el motor continúa comprobando presupuesto y Nivel de Antídoto/Veneno.
- `index.html` declara el editor, sus controles y botones; `assets/app.js` los conecta al motor y actualiza la ficha; los estilos contemplan pantallas estrechas.

**Estado de validación:** pruebas automáticas de Node y comprobación de sintaxis en GitHub Actions. **Pendiente:** prueba real y visual en navegador (interacción con DOM, estilos y accesibilidad por teclado) antes de considerar cerrada la interfaz o publicar la PR.

## Siguientes tareas

- Realizar la prueba de navegador del flujo completo: creación de ficha DRS, comprar 2 martillos, calcular Antídoto por Nivel, confirmar, copiar y exportar, intentar sobrepasar presupuesto, cancelar y eliminar personaje.
- Continuar con la auditoría de materiales más allá del equipamiento básico y asegurar que ninguna ruta de Fantasía publique DLC sin revisión previa.
- Mantener **PR #4 como borrador**, sin fusionar ni desplegar mientras siga pendiente esa verificación.
