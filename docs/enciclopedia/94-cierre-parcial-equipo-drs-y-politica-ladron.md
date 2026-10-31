# Forja 1.0 — Equipo contrastado con tablas DRS y decisión del Ladrón

**Fecha:** 31/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30` · **PR #4:** borrador, **no fusionar ni desplegar**.  
**Fuente:** `NaufragioD20DRS.docx`, secciones *Ocupaciones*, *Equipo*, *Listas de equipo* (tablas *Armas cuerpo a cuerpo*, *Armas a distancia*, *Varitas de defensa*, *Escudos* y *Protecciones corporales*). El DRS es la fuente normativa; las decisiones editoriales sobre Forja se identifican aparte.

## A. Decisión editorial del Ladrón: cerrada

El autor ha determinado que **el Ladrón mantiene su tabla de progresión sin cambios** (hasta ocho Técnicas, a Nivel 29), pero en la edición básica solo aprenderá las **seis Técnicas distintas** que el DRS documenta en las categorías permitidas (*Disciplina* y *Trucos sucios*).

- **Niveles 1–24:** se conceden hasta seis Técnicas según tabla y selección.
- **Niveles 25–28:** puede aprender siete, pero por ahora solo existen seis opciones DRS; **queda una plaza sin completar** y se muestra un aviso.
- **Niveles 29–30:** puede aprender ocho, pero por ahora solo existen seis; **quedan dos plazas sin completar** y se muestra un aviso.
- **Futuros DLC gratuitos:** cuando su fuente esté habilitada, nuevas Técnicas compatibles podrán completar esas plazas, sin modificar la tabla original del Ladrón. Se prohíbe importarlas en el DRS antes de publicarse.
- **Pruebas automatizadas:** se compara el mismo Ladrón a Niveles 24, 25, 28, 29 y 30 con `fuentes:['DRS']` frente a `fuentes:['DRS','Ocupaciones']`. El segundo contexto demuestra que puede completar su número de Técnicas sin duplicarlas ni contaminar la edición básica.

**Esta decisión ya no queda pendiente**. Se conserva como hallazgo histórico en el [informe 93](93-auditoria-ocupaciones-drs-progresiones-y-poderes.md).

## B. Catálogo de equipo: comparación con tablas del DRS

La tabla oficial de armas incluye **38 nombres**: 28 armas cuerpo a cuerpo y 10 armas a distancia. **Dardo** tiene un guion en el campo Precio, por lo que no se le asigna un valor numérico inventado. El catálogo de compras automáticas incluye ahora las **37 armas con precio explícito**.

### Registros completados

En `data/equipo-inicial.json` se han añadido **10 armas** con precio, categoría, Daño, Penetración y Durabilidad cotejados: **Jabalina, Lucero del alba, Alabarda, Almádena, Gran hacha, Guja, Lanza de caballería, Ballesta de repetición, Ballesta pesada y Yumi**. Sus particularidades documentadas incluyen, cuando corresponden, alcance, ataque arrojadizo y limitación para moverse y disparar.

También se han añadido las **cinco protecciones** ausentes: **Pechera de algodón** (0,5 mo), **Cota de escamas**, **Armadura de bandas**, **Armadura parcial de placas** y **Armadura completa de placas**. El catálogo suma ahora las **14 armaduras del DRS**.

Se han transcrito las **cuatro Varitas de defensa** con los valores de **Alcance, Daño, Penetración, Durabilidad, Munición DU y Precio** del DRS: **Varita de cerezo, Rama de cristal, Cetro de dracólita y Esceptro de sangreluna**. Se distinguen de las armas ordinarias mediante `varitas_defensa`.

### Regla de Competencia: varitas de defensa

El DRS indica expresamente que **tener competencia con todas las armas NO concede competencia con Varitas de defensa**. Una Ocupación debe mencionar las varitas:

- **Mago:** puede utilizarlas y la compra inicial puede ofrecerlas si el presupuesto lo permite.
- **Ladrón:** puede utilizarlas **a partir de Nivel 6** (como Mago de cinco Niveles menos), por la capacidad específica de su Ocupación. Antes de ese Nivel, no se ofrecen.
- **Guerrero:** no recibe varitas pese a su competencia general con armas.
- **Clérigo:** lanzar Conjuros divinos no le concede automáticamente competencia con varitas.

La compra es una **propuesta aleatoria y no una concesión gratuita**. Para estas Ocupaciones con competencia en varitas se mantiene el límite de **40 % del presupuesto** en la compra del arma; se permite superar el tope antiguo de 60 mo porque la Varita de cerezo cuesta 100 mo. Se anota la Munición DU de la varita y que los ataques con ella se realizan mediante Tirada de Mente. No se ejecutan por ahora los dados de ataque/munición.

### Correcciones de catálogos de Ocupación

En `data/ocupaciones.json` se han actualizado las listas concretas para que reflejen las categorías oficiales:

- **Clérigo:** también puede equipar **Martillo de guerra** y **Almádena** como armas cuerpo a cuerpo romas. Siguen prohibidas las armas con filo, arrojadizas y a distancia.
- **Guerrero:** también puede equipar **Almádena**. Su lista concreta cubre **todas las 37 armas DRS con precio**, excepto las Varitas de defensa por restricción explícita de competencia.
- **Ladrón:** puede equipar **Cuero tachonado**, armadura **Ligera** según la tabla DRS, aunque faltase en el listado anterior. No obtiene competencia con armaduras intermedias/pesadas.
- **Mago:** conserva las armaduras de **Tela** y sus competencias con Bastón, Daga, Honda y Varitas de defensa.

La regla de talla editorial fijada para Medianos y Gnomos anteriormente sigue vigente: artículos adaptados sin sobreprecio ni cambios de características; **solo Escudo pequeño** si la Ocupación tiene competencia.

## C. Verificaciones

`tests/alcance-drs.js` confirma:
1. Recuento y valores de **37 armas con precio, 14 armaduras y 4 varitas**; *Dardo* no se compra al no tener precio normativo.
2. Categorías, precios, Daño/Penetración/Durabilidad de las nuevas armas y protecciones; lista y Munición DU de las varitas.
3. Competencia exclusiva de Mago y Ladrón desde Nivel 6 con varitas; exclusión de Guerrero/Clérigo y nota de Tirada de Mente.
4. Compra respetando presupuesto y sin valores negativos; restricciones reales de las cuatro Ocupaciones, incluidos martillos romos y Cuero tachonado.
5. Plazas del Ladrón: seis Técnicas en DRS y hasta ocho tras activar explícitamente una fuente suplementaria.

## D. Límites que no se han ocultado

- **Dardo carece de precio en el DRS**. No se inventa uno ni se trata un precio vacío como cero. El Cronista puede determinar su disponibilidad, pero el sistema no lo compra automáticamente. Una futura valoración oficial permitiría incorporarlo.
- El catálogo de **útiles, herramientas y provisiones individuales** todavía no es exhaustivo, aunque existen paquetes de compra. El cierre de estas tablas de armas, armaduras y varitas **no equivale** al cierre de todas las opciones de equipo.
- Las **varitas de defensa** son armas mágicas, distintas de los objetos infundidos con Conjuros de *Infusión mágica*. No se ha implantado un sistema de elaboración, lanzamiento, desgaste de munición ni recarga.
- `data/ocupaciones.json` conserva algunas denominaciones de armamento que **no aparecen con precio en este catálogo** (por ejemplo Porra, Garrote y Dardo); no se han introducido precios nuevos sin cotejo.
- Persiste la **decisión editorial pendiente DRS-MAG-01**: *Marca del dador oscuro*, Círculo 4 en la lista clerical o Quinto Círculo en la descripción individual. No se resuelve por inferencia.
- Pendientes las pruebas visuales del navegador, ejecución de estados y Talentos durante partida y separación física del núcleo DRS respecto de los DLC.

**Resultado técnico:** datos y compras cotejados en la PR; no se ha realizado fusión ni despliegue.
