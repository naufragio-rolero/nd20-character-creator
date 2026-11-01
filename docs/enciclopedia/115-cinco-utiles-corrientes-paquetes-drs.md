# Forja — Cinco útiles corrientes de los paquetes DRS

**Fecha:** 01/11/2026 · **Decisión:** autorización autoral expresa para registrar como objetos normales y redactar descripciones de los cinco objetos mencionados en los paquetes iniciales sin descripción individual. **Rama:** `feat/forja-consulta-equipo-objetos-2026-11-01` · [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) en borrador.

## 1. Alcance exacto de la decisión

El [informe 114](114-cierre-componentes-paquetes-drs.md) cerró la primera auditoría con 44/44 componentes consultables, de los cuales **32 apariciones** tenían descripciones procedentes de fichas documentadas y **12 apariciones** correspondían a cinco nombres incluidos únicamente en los paquetes.

El autor ha indicado: **«Simplemente añádelos como objetos normales. Si no tienen descripción, créale una»**. Esta decisión **sustituye la prohibición provisional de redactar descripciones** formulada en el informe 114. Se aplica a la **presentación y descripción narrativa** de cinco artículos; no autoriza inventar precios individuales, masa, capacidad, efecto, bonificaciones, DU adicionales, protección ni consumo automático.

Los nombres y la presencia del **odre de agua (DU d6)** se cotejaron con el `NaufragioD20DRS.docx`, párrafos **481** (Arcanistas), **484** (Criminales), **487** (Devotos), **490** (Exploración) y **493** (Mazmorras). El dato de DU d6 pertenece al DRS; **las cinco descripciones siguientes son texto editorial nuevo**, no una transcripción del manual.

## 2. Cinco fichas incorporadas

| Nombre DRS | Descripción editorial incorporada | Procedencia reglamentaria |
|---|---|---|
| **Mochila** | Bolsa resistente con correas para llevarla a la espalda. Permite guardar y transportar las pertenencias durante un viaje. | Arcanistas; Devotos; Exploración; Mazmorras |
| **Bolsa de cuero** | Bolsa flexible confeccionada en cuero, con un cierre sencillo. Sirve para reunir monedas, utensilios pequeños y otros enseres. | Criminales |
| **Odre de agua** | Recipiente de piel curtida destinado a transportar agua. Su abertura se cierra para evitar que se derrame durante el camino. | Criminales; Devotos; Exploración; Mazmorras. **DU d6** literal |
| **Estuche de pergaminos vacío** | Estuche alargado con tapa, pensado para guardar hojas de pergamino enrolladas y protegerlas durante el transporte. Se entrega vacío. | Arcanistas |
| **Ropa de viaje** | Conjunto de prendas sencillas y resistentes, adecuado para el camino y el desgaste de las jornadas de viaje. | Exploración; Mazmorras |

**Criterio editorial:** dos frases como máximo, físicas y legibles; sin reglas ni afirmaciones de rendimiento. Se evita afirmar capacidades cuantitativas, pesos, precios o ventajas mecánicas. No hay falsa literalidad: cada registro contiene `descripcion_editorial` y `origen_descripcion` para distinguirlo de `detalle_literal` de las tablas DRS.

## 3. Integración

- **`data/equipo-consulta-drs.json`**, versión **2**: se sustituye `componentes_exclusivos_paquete` por `objetos_comunes_sin_precio`. Cinco fichas, descripciones editoriales y nota de alcance. Se mantienen las **10 tablas de Iluminación/Ropa** y las **cinco equivalencias documentadas**.
- **`assets/tooltips.js`**: estos nombres se indexan como **`clase_equipo: "util"`** y categoría **«Útiles · Viaje y almacenaje»**. Se presentan descripción, paquetes de procedencia y, solo en el odre, el DU d6. Una línea técnica y la fuente visible identifican la redacción editorial.
- **`assets/tooltip-ui.js`**: los útiles siguen el mismo esquema compacto que el resto del Equipo, sin tratamiento especial de «componente de paquete».
- **`tests/equipo-popups.js`**: 44/44 componentes con texto, cinco clases `util`, trazabilidad editorial y ausencia de precios no documentados.
- **`tests/browser-compatibilidad.js`**: apertura real de la ficha de Mochila en Firefox y WebKit; título de Equipo, categoría, descripción y fuente editorial.
- **`tests/paquete-publico-drs.js`** y **`scripts/comprobar-publicacion-drs.js`**: versión y cinco descripciones verificadas dentro de la misma lista blanca DRS, sin magia ni otros sistemas.

No se modifica `data/equipo-inicial.json`, el inventario `personaje.equipo`, `assets/equipment.js`, `assets/rules.js` ni el catálogo de compra. **Los artículos ya figuran en los paquetes iniciales**; ahora también tienen ficha de útil normal al consultarlos individualmente.

## 4. Alcance y límites económicos

**Los cinco artículos son objetos corrientes, pero el DRS cotejado no les asigna un precio individual.** Por tanto, aparecen en el inventario y sus popups como cualquier otro útil, **sin introducirse en el selector de compras independientes**: hacerlo gratis o imputar un coste numérico sin decisión editorial produciría una regla económica nueva.

Las **43 opciones** actuales de compra documentada (41 útiles y dos focos) permanecen sin cambios. No se atribuye un valor al artículo que venga incluido en un paquete ni se recalcula el precio de este. La clasificación como `util` no concede efecto ni Competencia.

## 5. Verificación y resultado

- Comprobación de índice sobre JSON y código real de la PR: **44/44** componentes de paquete con descripción y **0** precios individuales inventados en las cinco fichas nuevas.
- Cinco fuentes editoriales separadas del DRS; el odre mantiene el **DU d6** literal.
- CI exigida: pruebas Node, compras Chrome, compatibilidad Firefox/WebKit y paquete físico público DRS. **El cierre requiere consultar las ejecuciones sobre el último SHA; los tests verdes de un commit previo no certifican uno posterior.**
- La PR **permanece en borrador**, sin fusión ni despliegue.

## 6. Próximo paso en el plan

1. **Revisión visual editorial** de las cinco fichas de útiles en navegador real (tamaño de descripción, fuente y procedencia), además de los popups existentes de armas, ropa, talentos, recuerdos y magia aislada.
2. **Cierre de PR #13** una vez aceptada su revisión; fusión y despliegue requieren autorización separada.
3. **Siguiente lote DRS:** tablas de instrumentos, objetos varios, monturas, equipo para monturas y transportes, diferenciando objetos comprables de servicios o vehículos y sin crear precios faltantes.
4. **Magia:** revisar las 28 fichas y el ejemplo con política de publicación propia; no activar su carga dentro del JSON público DRS.

**Precedencia documental:** este informe prevalece sobre las declaraciones de «no crear descripciones» de los informes [113](113-forja-equipo-objetos-magicos-consulta.md) y [114](114-cierre-componentes-paquetes-drs.md) **únicamente** respecto a estos cinco útiles y su prosa editorial autorizada.
