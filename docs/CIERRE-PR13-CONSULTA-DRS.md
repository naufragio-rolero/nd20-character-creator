# Conciliación de PR #13 — Glosas de paquetes y precio de armadura equina

**Fecha:** 2026-11-03. **Base de integración:** `main` actual, no la rama antigua de la [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13). Esta conciliación recoge exclusivamente las dos decisiones autorales indicadas; **no fusiona** ni publica el catálogo paralelo de aquella PR.

## 1. Cinco componentes de paquetes

El DRS incluye en los cinco paquetes iniciales **Mochila, Bolsa de cuero, Odre de agua, Estuche de pergaminos vacío y Ropa de viaje**, sin precio individual documentado. Se recuperan exactamente las cinco **descripciones editoriales autorizadas el 01/11/2026** (informe 115 y datos de la PR #13).

Las glosas se incorporan a `data/equipo-inicial.json > componentes_paquetes_editoriales` y solo enriquecen las fichas de los componentes que ya aparecen al desglosar los paquetes. `assets/tooltips.js` mantiene «Incluido en» y conserva **DU d6 únicamente para Odre de agua**. Cada descripción guarda su procedencia editorial; **no se atribuyen precios, masa, capacidades mecánicas, bonificaciones ni efectos**. Los cinco componentes no pasan al catálogo de compra individual.

## 2. Consulta del precio de Armadura equina

Decisión autoral de **01/11/2026** (informe 117): escoger cualquiera de las **14 armaduras comunes para personas** existentes en `data/equipo-inicial.json > armaduras`; el coste de la armadura equina se calcula como **precio humano ×4**.

El cálculo se documenta en `regla_precio_autoral` del artículo «Armadura equina» y se valida en `assets/equipment.js > consultarPreciosArmaduraEquina` (14 identidades únicas, importes verificables y multiplicador aprobado). En la interfaz de «Útiles», familia «Equipo de monturas», hay un desplegable de **consulta exclusivamente informativa**. No se introduce en el carrito, no se equipa, no modifica saldo, Durabilidad, Blindaje ni Movimiento. `consultarUtilFantasia` mantiene el rechazo a la compra directa por precio variable.

## 3. Qué no se recupera

- No se importa `data/equipo-consulta-drs.json` ni se crea un navegador independiente: las referencias DRS de las tablas de aquella rama ya figuran en `data/equipo-inicial.json > utiles_fantasia` y se consultan mediante la Forja actual.
- No se reemplazan archivos de interfaz ni los 111 textos de `data/glosas-equipo-drs.json` con versiones antiguas.
- No se incorporan Objetos mágicos, CiFi, Nocturna, servicios diarios como inventario, automatización de combate o nuevas reglas.
- No se altera la publicación LIVE: requiere promoción y aprobación separadas con SHA fijado y el paquete DRS filtrado.

## 4. Verificaciones exigidas para cerrar la PR antigua

- Validación Node (incluidas `tests/alcance-drs.js` y `tests/fichas-drs-ux.js`).
- Chrome E2E: selector equino con ejemplos 10 mo → 40 mo y 1000 mo → 4000 mo, sin cambios del carrito.
- Paquete público DRS: cinco glosas y regla equina presentes, precios individuales ausentes, y suplementos excluidos.
- Compatibilidad Firefox/WebKit y revisión de controles en móvil; no interpretar pruebas antiguas de la PR #13 como certificación de esta integración.
- Fusionar la PR de conciliación únicamente con QA actual satisfactorio, comprobar integración en `main` y **cerrar #13 sin fusionar la rama antigua**.
