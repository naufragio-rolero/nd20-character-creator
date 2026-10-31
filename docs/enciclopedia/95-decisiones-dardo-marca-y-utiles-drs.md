# Forja 1.0 — Decisiones autorales sobre Dardo y Marca del dador oscuro; cierre de datos de útiles DRS

**Fecha:** 31/10/2026. **Ámbito:** núcleo de Fantasía del Documento de Referencia del Sistema (DRS).  
**Fuente cotejada:** `NaufragioD20DRS.docx`, lista de Conjuros del Clérigo, ficha individual de *Marca del dador oscuro* y tablas de Equipo (armas a distancia; aventura, campamento, consumibles, herramientas, escritura y focos).  
**Rama:** `feat/forja-conjuros-fichas-2026-10-30`. **PR #4:** borrador; **sin fusionar ni desplegar**.

## 1. Decisiones del autor (cerradas)

### DRS-EQP-01 — Dardo gratuito

El DRS incluye **Dardo** entre las armas a distancia y deja el Precio como «—». El autor fija explícitamente la interpretación para Forja: **Dardo cuesta 0 mo**.

- Registro de `data/equipo-inicial.json`: **Dardo**, **0 mo**, **alcance 9 metros**, **Daño 1d4**, **Penetración 0**, **Durabilidad d4**, **munición Dardos**, tipo **distancia**.
- El Dardo está permitido por las listas documentadas de **Guerrero y Ladrón**. No se otorga al Clérigo ni al Mago.
- **La munición no se vuelve gratuita:** `Dardos (Cerbatana)` figura en la tabla de Munición con **DU d4** y **2 mp = 0,2 mo**. Forja mantiene ese precio; la compra automática no puede gastar más del presupuesto.
- Se registran ambas procedencias por separado: los valores mecánicos proceden del **DRS**; únicamente **Precio 0** es una **decisión editorial de 31/10/2026**.
- El catálogo de armas contiene ahora **38 de 38 armas** listadas, incluyendo el Dardo. No queda un precio ficticio pendiente en este apartado.

### DRS-MAG-01 — Marca del dador oscuro: Quinto Círculo

El DRS sitúa *Marca del dador oscuro* en el **Círculo 4 de la lista del Clérigo**, pero su **ficha individual** dice **Quinto Círculo**.

**Decisión inequívoca del autor:** prevalece la ficha individual. El Conjuro fue añadido posteriormente, y la inclusión en el índice clerical bajo Círculo 4 probablemente fue una errata editorial.

- `data/catalogo-poderes.json` conserva el Conjuro **`conjuro-47`**, **Círculo 5**, origen **Nd20**.
- `listas_drs.Clérigo["5"]` ahora **incluye** `Marca del dador oscuro`; no aparece en Círculo 4. No se ha cambiado su Escuela ni magnitudes.
- El Clérigo aprende el Conjuro automáticamente **a partir de Nivel 10**, cuando se abre su **Quinto Círculo**, no en Nivel 8, que abre el Cuarto.
- El repertorio clerical completo verificable ahora tiene **34 Conjuros** hasta Círculo 8, frente a los 33 anteriores. Los **Conjuros conocidos** continúan separados de los **preparados**.
- Se ha retirado la advertencia de discrepancia pendiente de las fichas. **Ya no se requiere decisión editorial adicional.**

## 2. Hallazgo de homonimia: dos Almádenas, dos precios

El mismo nombre figura en **dos tablas distintas del DRS**, con reglas y precios diferentes:

| Tabla oficial | Artículo | Precio | Uso |
|---|---|---:|---|
| Armas cuerpo a cuerpo | Almádena | **60 mo** | Arma a dos manos, Daño 1d10, Penetración 3, Durabilidad d8 |
| Equipo de campamento | Almádena | **2 mo** | Herramienta; se puede utilizar como Clava |

No deben fusionarse por nombre. El sistema conserva el arma en `armas[]` y registra la herramienta bajo **`campamento-almadena`** en `utiles_fantasia.campamento`. El precio se consulta por **identificador**, nunca a través del nombre solamente.

**No requiere decisión nueva:** se preservan ambas entradas tal como figuran en sus respectivas tablas.

## 3. 41 útiles DRS y dos focos con precio

En `data/equipo-inicial.json` se han transcrito **las cinco tablas de útiles** del DRS en `utiles_fantasia`, expresando todos los precios fijos en **mo**:

| Grupo | Registros | Fuente |
|---|---:|---|
| Aventura | 10 | Tabla de equipo de aventuras |
| Campamento | 6 | Tabla de equipo de campamento |
| Consumibles | 7 | Tabla de consumibles |
| Herramientas | 12 | Tabla de herramientas |
| Escritura | 6 | Tabla de escritura |
| **Total** | **41** | **DRS** |

Se conserva el Dado de Uso de los artículos que lo tienen y una descripción abreviada de su función, sin implementar automáticamente su efecto en partida.

**Precios que dependen del Nivel, no del objeto a secas:**
- **Antídoto:** `precio_por_nivel: 50` mo × Nivel elegido.
- **Veneno:** `precio_por_nivel: 100` mo × Nivel elegido.

Estos artículos **no tienen un Precio plano**: al consultarlos para comprarlos, hay que proporcionar un Nivel entero positivo.

Además, se incorporan a `focos_conjuros_con_precio` **Tótem (25 mo)** y **Orbe de cristal (75 mo)**, con las Escuelas asociadas documentadas. Los demás focos cuyos precios remiten a otras tablas no se duplican artificialmente.

## 4. Motor de consultas y compras complementarias

`assets/equipment.js` expone dos nuevas operaciones puras, preparadas para el futuro selector visual:

- **`consultarUtilFantasia(catalogo, id, nivel?)`**: distingue artículos homónimos por ID, devuelve precio en mo, sección, detalles, DU y Nivel cuando procede. Rechaza IDs desconocidos o un Antídoto/Veneno sin Nivel válido.
- **`compraUtilesFantasia(catalogo, presupuesto, seleccion)`**: calcula coste, unidades, saldo y detalle por línea para compras solicitadas expresamente. Rechaza cantidades inválidas y operaciones que superen el presupuesto.

No altera el funcionamiento de `compraInicial`, que sigue proponiendo armas, protección, escudos y paquetes documentados. **Los 41 útiles no se conceden automáticamente ni existe aún un panel visual para comprarlos uno a uno.** No se ha creado ninguna competencia o descuento nuevo.

## 5. Pruebas y límites

`tests/alcance-drs.js` ahora comprueba:

- Inclusión de **Dardo como arma gratuita** con seis datos mecánicos del DRS; su compra con 0 mo y las Competencias de Guerrero/Ladrón, sin regalar munición.
- Catálogo clerical C4/C5 corregido, la ficha de `conjuro-47`, el aprendizaje automático en **Nivel 10**, repertorio de **34** Conjuros y ausencia de advertencias ya resueltas.
- Identidad y precios de los **41 útiles** organizados en cinco grupos, y dos focos documentados.
- **Antídoto y Veneno** con Precio dependiente del Nivel; rechazo de precios no verificables y Niveles ausentes.
- **Las dos Almádenas** independientes, con **2 mo / 60 mo**.
- Ejemplo de compra simultánea, cantidades, saldos exactos, costes en moneda fraccionaria, exceso de presupuesto y solicitudes inválidas.

**No equivale aún a certificar toda Forja 1.0**: siguen pendientes la interfaz de compra de útiles, revisión manual de navegador, ejecución en partida de Talentos/Conjuros y revisión de separación física DRS/DLC. No se fusiona ni despliega esta PR.
