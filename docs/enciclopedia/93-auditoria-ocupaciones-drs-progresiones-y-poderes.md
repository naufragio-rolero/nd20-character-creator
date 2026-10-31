# Forja 1.0 — Auditoría de las cuatro Ocupaciones DRS: progresión y Poderes

> **ACTUALIZACIÓN DEFINITIVA DEL AUTOR (31/10/2026):** **Dardo es gratuito (0 mo)** y **Marca del dador oscuro pertenece al Quinto Círculo** porque prevalece su ficha individual. Forja ya permite aprenderlo al Clérigo desde **Nivel 10** y registra **34 Conjuros clericales**. Además se han incluido las **41 entradas de útiles del DRS** y dos focos con precio. Véase [informe 95 — decisiones y equipo](95-decisiones-dardo-marca-y-utiles-drs.md). Los pasajes anteriores que describían Dardo como no disponible, Marca como discrepancia pendiente o el catálogo individual como incompleto **son históricos y quedan sustituidos por esta decisión y sus implementaciones**.

> **Actualización posterior (31/10/2026):** la decisión de plazas de Técnica del Ladrón ha quedado **cerrada por el autor**: mantiene su progresión original y podrá cubrir las plazas restantes con futuros suplementos gratuitos, sin importarlos en el DRS básico. Además, las tablas de armas, protecciones y varitas han recibido una auditoría y ampliación contrastada con el manual: véase [informe 94 — equipo y política del Ladrón](94-cierre-parcial-equipo-drs-y-politica-ladron.md). **Sigue pendiente el Círculo canónico de Marca del dador oscuro.**

**Fecha:** 31/10/2026. **Fuente normativa:** `NaufragioD20DRS.docx`, apartados *Clérigo, Guerrero, Mago, Ladrón*, tablas de progreso, *Potencia*, competencias y lista de Conjuros del Clérigo.  
**Estado:** PR [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4), rama `feat/forja-conjuros-fichas-2026-10-30`, **borrador sin fusionar ni desplegar**. La fuente DRS no ha sido modificada.

## Qué se ha contrastado

**Las cuatro tablas del DRS se cotejaron por completo (30 Niveles × 4 Ocupaciones = 120 filas)**, no solo en valores de arranque y Niveles 12/30.

| Ocupación | Tabla DRS | Comparación de las 30 filas |
|---|---|---|
| Clérigo | Ocho Círculos, espacios y apertura desde Nivel 2 cada dos Niveles, máximo 7 espacios por Círculo | Coincide con `data/progresiones-oficiales.json` |
| Guerrero | Técnicas de 1 a 10 (una más cada 3 Niveles); Potencia de *Brío musculoso* 1 / 2 desde Nivel 10 / 3 desde Nivel 22 | Coincide con la tabla; **faltaba reflejar Potencia en las fichas** |
| Mago | Ocho Círculos, aperturas desde Nivel 1 cada dos Niveles, espacios hasta 9 en Círculo 1; dos Conjuros iniciales y uno aprendido por nuevo Nivel | Coincide con la tabla; se conserva la elección del grimorio |
| Ladrón | Técnicas de 1 a 8 (una más cada cuatro Niveles) | Coincide con la tabla; **el catálogo DRS solo ofrece seis Técnicas compatibles diferentes** |

### DRS-OCP-03 — Potencia y Brío musculoso

**DRS:** todo PJ comienza con **Potencia 1**. El Guerrero que **elige Brío musculoso** incrementa este recurso a **2 en Nivel 10** y **3 en Nivel 22**. El Guerrero que elige *Sacrificio de escudo* **no obtiene la mejora**.

**Corrección:** `assets/rules.js` incorpora Potencia a los recursos de todas las fichas de Fantasía del DRS y calcula sus incrementos únicamente si el Guerrero ha recibido *Brío musculoso*. `assets/powers.js` recalcula Potencia al confirmar el Talento del Guerrero en el editor; no inventa una mejora para *Sacrificio de escudo*. Regresión en Niveles **1, 9, 10, 21, 22 y 30**, ambas ramas y API de creación directa.

### DRS-OCP-04 — Descripciones de los nueve Talentos

Se han incorporado glosas contrastadas con el DRS en `data/ocupaciones.json`:

- **Clérigo:** *Expulsar muertos vivientes* y *Fortaleza piadosa*.
- **Guerrero:** *Recuperación*, *Brío musculoso* y *Sacrificio de escudo*.
- **Mago:** *Bagaje de arcanista* y *Meditación*.
- **Ladrón:** *Preparación* y *Sutileza*.

`assets/rules.js` documenta en las observaciones las capacidades efectivamente concedidas. `assets/powers.js` incorpora la glosa de la **alternativa elegida** al cerrar el editor, sin conceder ni describir la alternativa descartada. **Un Talento documentado no equivale a un Talento ejecutable**: no existe aún motor completo para iniciar acciones, gastar Esfuerzo, tirar Iniciativa, resistir estados o romper escudos.

### DRS-OCP-05 — Técnicas suplementarias infiltradas en la edición básica

**Antes:** el selector `tecnicas()` solo excluía Técnicas CiFi en Fantasía. Por tanto, Guerrero y Ladrón podían recibir Técnicas de `Naufragio d20 Ocupaciones` (DLC), contrario al núcleo DRS exclusivo.

**Ahora:** para las cuatro Ocupaciones básicas, la selección por defecto y con `fuentes:['DRS']` **solo permite las diez Técnicas de `Naufragio d20 DRS`**. Las Ocupaciones ampliadas no pierden sus Técnicas en las pruebas internas; sus contenidos siguen fuera de la distribución pública de Fantasía, a la espera del DLC. Los Conjuros preparados y elegidos mediante las listas DRS verifican también `origen:'Nd20'`.

#### Limitación de catálogo de Ladrón

En el DRS hay **cuatro Técnicas de Disciplina y dos de Trucos sucios**, las dos categorías permitidas al Ladrón. Son **seis Técnicas distintas** en total.

La tabla de progreso del Ladrón exige:
- **Niveles 1–24:** hasta 6 Técnicas, cubiertas por el catálogo.
- **Niveles 25–28:** 7 Técnicas, pero solo 6 opciones distintas compatibles: **falta 1**.
- **Niveles 29–30:** 8 Técnicas, pero solo 6: **faltan 2**.

La implementación **no importa contenido de suplementos** para rellenar los huecos ni permite repeticiones no autorizadas: concede las seis opciones verificadas y añade un aviso de insuficiencia.

**Decisión editorial aceptada (31/10/2026):** **mantener la progresión de 7 y 8 Técnicas del Ladrón sin cambios**. En la edición básica DRS aprenderá únicamente las seis Técnicas distintas disponibles en sus categorías; las restantes plazas se podrán ocupar **cuando se publiquen nuevos suplementos gratuitos con Técnicas compatibles**. El generador conserva el aviso, pero no inventa, repite ni concede Técnicas de un suplemento que no esté activado. Se han añadido pruebas de la misma Ocupación con `fuentes:['DRS']` frente a `fuentes:['DRS','Ocupaciones']` para verificar la ampliación futura.

### DRS-OCP-06 — Conjuros conocidos del Clérigo

**DRS:** al abrir un Círculo, el Clérigo **aprende todos los Conjuros de ese Círculo**. La ficha de Forja antes mostraba solo los Conjuros **preparados**, que son otra cosa.

**Corrección:** `assets/powers.js` añade los Conjuros **conocidos automáticos**, todos de origen DRS, al abrir sus Círculos. El generador conserva los Espacios preparados y sus elecciones de forma separada. Pruebas de Niveles 1, 2, 4, 6, 8, 10, 12, 14, 16 y 30; la lista clerical actualmente verificable aporta **33 entradas** hasta Círculo 8, sin duplicados.

#### Discrepancia DRS-MAG-01 — Marca del dador oscuro

**El propio DRS contiene una contradicción interna:**

- En **Lista de Conjuros del Clérigo**, *Marca del dador oscuro* figura bajo **Círculo 4**.
- En la **descripción individual del Conjuro**, *Marca del dador oscuro* figura expresamente como de **Quinto Círculo**.
- `data/catalogo-poderes.json` lo tiene como **Círculo 5**, pero `listas_drs.Clérigo[4]` no lo incluye. La lista clerical en Forja tiene por ahora cuatro Conjuros en Círculo 4 frente a cinco en el índice del DRS.

**No se ha resuelto artificialmente:** Forja **no incorpora automáticamente** el Conjuro discutido al repertorio del Clérigo. A partir del Nivel 8, cuando la tabla abre el Círculo 4, la ficha muestra una advertencia específica. **Se requiere una decisión editorial sobre si pertenece al Círculo 4 o al 5** y sobre su inclusión en la lista clerical. No modificar silenciosamente el catálogo ni el DRS.

Otros Conjuros DRS, como *Contrato de fraternidad* y *Orbe elemental*, existen en el repertorio general del DRS pero no en las listas del Clérigo o Mago; **no se les ha concedido a estas Ocupaciones** sin una autorización reglamentaria.

## Pruebas y CI

En `tests/alcance-drs.js` se han incorporado aserciones para:
- Las **120 filas** numéricas de las cuatro tablas DRS, con fórmulas de referencia independientes de los registros JSON.
- Los nueve Talentos iniciales, las glosas y la exclusividad de elecciones del Guerrero.
- Potencia inicial 1, subida condicional en Nivel 10 y 22 y los dos modos de selección.
- Bloqueo de Técnicas de suplementos en Guerrero y Ladrón; preservación de las rutas suplementarias en los tests generales.
- Advertencia y máximo de seis Técnicas compatibles del Ladrón en altos Niveles.
- Conjuros del Clérigo aprendidos automáticamente, distintos de preparados, con sus Círculos, exclusión de la discrepancia *Marca del dador oscuro* y aviso al llegar al Nivel 8.

**El CI verde no acredita aún pruebas visuales ni la ejecución real de Talentos, Técnicas y Conjuros.** Sigue pendiente el equipamiento completo, la revisión en navegador y la separación física del material DRS/DLC.

## Siguientes decisiones y pasos

1. **Editorial:** fijar el Círculo canónico de *Marca del dador oscuro* y su presencia en el repertorio clerical.
2. **Resuelto editorialmente:** las plazas adicionales de Técnica de Ladrón se cubrirán con suplementos futuros, cuando sus fuentes se habiliten. **No bloquea la versión DRS básica.**
3. **Técnico:** profundizar en competencias de equipo, restricciones y progresión de Técnicas y Conjuros; probar compra completa y navegador.
4. **Edición 1.0:** mantener el filtro DRS, no fusionar ni desplegar PR #4 hasta que los criterios de publicación se cumplan.
