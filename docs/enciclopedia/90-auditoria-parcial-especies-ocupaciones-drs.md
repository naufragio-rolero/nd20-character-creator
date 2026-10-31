# Forja 1.0 — Primera auditoría mecánica del núcleo DRS

> **Actualizaciones posteriores (31/10/2026):** la incidencia DRS-ESP-02 se ha **resuelto en la generación de fichas**; consultar [informe 91 — Herencia dual](91-herencia-dual-drs-cierre-implementacion.md). La [auditoría 92 — Talentos de Especies](92-auditoria-talentos-especies-drs.md) resuelve el Atributo elegido del Humano y documenta Talentos y envejecimiento. Tras una **decisión editorial posterior del 31/10/2026**, el equipamiento del catálogo se ofrece a Medianos y Gnomos en versiones adaptadas **sin alterar precios ni características**, manteniendo **solo escudos pequeños**: ya no quedan bloqueadas sus compras por falta de marcas de adaptación. Los apartados anteriores conservan su estado histórico. **Sigue pendiente ejecutar efectos durante una partida y completar otros huecos del catálogo general.**

> **Actualización de Ocupaciones (31/10/2026):** se han contrastado las **120 filas** del Clérigo, Guerrero, Mago y Ladrón; corregido el cálculo de Potencia y la selección exclusiva DRS de Técnicas; documentados los nueve Talentos y concedidos los Conjuros conocidos del Clérigo. Consulte el [informe 93 — auditoría de Ocupaciones](93-auditoria-ocupaciones-drs-progresiones-y-poderes.md), que registra además las discrepancias *Marca del dador oscuro* (Círculo 4/5) y plazas de Técnica del Ladrón en altos Niveles.

**Fecha:** 31/10/2026. **Ámbito:** Naufragio d20 Fantasía, edición básica de Forja.  
**Fuente normativa:** `NaufragioD20DRS.docx`, secciones *Especies*, *Ocupaciones*, *Creación de personaje* y *Equipo*.  
**Rama:** `feat/forja-conjuros-fichas-2026-10-30`; **PR:** [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4), todavía en borrador. **No fusionar ni desplegar.**

## 1. Qué significa «terminado» y qué hemos comprobado

| Área | Avance acreditado | Pendiente para declarar conformidad con el DRS |
|---|---|---|
| 8 Especies | 8 perfiles cotejados en **Dado de Salud, Movimiento y requisitos mínimos de VA**, con aserciones individuales | Efectos, restricciones y elecciones de todos los Talentos; envejecimiento e interacciones con equipo |
| 4 Ocupaciones | 4 perfiles cotejados en **Atributo favorito, modificador del Dado de Salud y Esfuerzo**; competencias literales añadidas a la ficha | Auditoría de cada competencia contextual, Talentos, progresión completa 1–30, Poderes y concesiones por Nivel |
| Equipo básico | Acceso a escudos en Clérigo y Guerrero; armaduras pesadas del Clérigo a partir de Nivel 12; pruebas de elegibilidad | Completar catálogo de armas, varitas y equipo; probar restricciones de todas las clases y compras en presupuestos extremos |
| 64 Conjuros | 64/64 con magnitudes documentales; véase [89](89-cierre-magnitudes-64-conjuros-drs.md) | Lanzamiento, preparación, consumo, efectos sobre Salud/estados, decisiones del Cronista y pruebas de integración |
| Publicación DRS/DLC | Selector funcional filtrado a DRS; manifiesto y 96 combinaciones de fichas anteriores | Separación física de DLC, revisión de navegador y regresión de publicación |

**Nota importante:** la nueva auditoría de perfiles no equivale a declarar **8/8 Especies y 4/4 Ocupaciones terminadas mecánicamente**. Hay Talentos que solo aparecen como texto, sin ejecución.

## 2. Correcciones efectivamente aplicadas

### DRS-ESP-01 — Gnomo urbano: requisito compuesto

- **DRS:** `Requisito: Mente 7+, Intuición 7+` en el perfil *Gnomo urbano*.
- **Antes:** `data/especies.json` solo exigía `Intuición 7+`; se podía generar un Gnomo urbano con Mente insuficiente.
- **Ahora:** el requisito adicional se declara en `requisitos`, y `assets/rules.js` ya evalúa ambos antes de elegir Ocupación. La comprobación precede a la mejora del Atributo favorito, como requiere el orden de creación.
- **Regresión:** se comprueba un caso que debe rechazarse (Mente insuficiente) y otro admisible (ambos VA 7+).

### DRS-OCP-01 — Guerrero: elección exclusiva

- **DRS:** *Recuperación* siempre; después, «Elige uno de los siguientes»: *Brío musculoso* **o** *Sacrificio de escudo*.
- **Antes:** la API directa `crearNd20` podía conceder **los dos** al generar un Guerrero sin elecciones aplazadas. El flujo web con elecciones aplazadas ya contemplaba la elección única.
- **Ahora:** la API directa selecciona exactamente uno con su generador determinista; si la web aplaza la decisión, no concede ninguno hasta que la resuelva `assets/powers.js`.
- **Regresión:** Niveles 1, 12 y 30, tanto con decisión inmediata como aplazada.

### DRS-OCP-02 — Competencias y equipo por Nivel

- **DRS:** las cuatro Ocupaciones expresan competencias de armamento, protecciones y herramientas; el Clérigo puede llevar armaduras pesadas **desde Nivel 12**; Clérigo y Guerrero pueden equipar escudos, Mago y Ladrón no.
- **Antes:** los cuatro registros base carecían del campo `competencias`. La compra inicial no proponía escudos a Clérigo y Guerrero porque ese permiso se leía del campo ausente. Las protecciones expresas del Clérigo no ampliaban el catálogo al alcanzar Nivel 12.
- **Ahora:** `data/ocupaciones.json` incluye las competencias literalmente documentadas; `assets/equipment.js` tiene en cuenta el desbloqueo por Nivel para ampliar armaduras y ofrece escudos permitidos (solo si caben en la propuesta de compra).
- **Regresión:** visualización de competencias en las cuatro fichas, compras de Clérigo a Niveles 11 y 12, escudos para Clérigo/Guerrero y prohibición de escudos para Mago/Ladrón.
- **Límite:** es una **propuesta aleatoria de compra**, no un motor exhaustivo de equipamiento. El catálogo de muestra no incluye todas las armas ni varitas del DRS; la competencia del Mago con varitas ya está **documentada en su ficha**, pero no equivale a oferta de compra completa.

### DRS-ESP-02 — Herencia dual: advertencia honesta, NO resolución

- **DRS, Semielfo:** elegir *Buen desarrollo* **o** *Linaje feérico*.
- **DRS, Semiorco:** elegir *Buen desarrollo* **o** *Ira interna*.
- **Situación real:** `data/especies.json` presenta el Talento *Herencia dual (SE/SO)* como referencia, pero **ningún flujo ha aplicado aún la elección efectiva**. Las fichas ahora incorporan una advertencia mediante `assets/powers.js`.
- **Pendiente prioritario:** diseñar elección para modos Rápido y Personalizado, asignando `Buen desarrollo` a un Atributo elegido **en la fase correcta de creación**, antes de calcular su progresión posterior. No implementar simplemente `+1` al final de la ficha de Nivel alto: puede producir una evolución diferente. Conservar *Linaje feérico* e *Ira interna* como alternativas excluyentes.

## 3. Qué validan las pruebas nuevas

`tests/alcance-drs.js` pasa de limitarse a identidades, conteos y 96 generaciones a comprobar también:

- Salud, Movimiento y mínimos de VA **por nombre de las ocho Especies**.
- Atributo favorito, modificador de Salud y Esfuerzo **por nombre de las cuatro Ocupaciones**.
- Rechazo del Gnomo urbano que no cumpla **ambos** requisitos y aceptación del que sí los cumple.
- Exclusividad de Talentos del Guerrero, con y sin elecciones aplazadas.
- Existencia y exposición de competencias en todas las Ocupaciones DRS.
- Escudos y armaduras por Nivel en compra inicial, más avisos de Herencia dual no resuelta.

Las pruebas de inventario de Conjuros y de los otros sistemas permanecen conectadas a `tests/smoke.js`. **Un CI verde verifica estas aserciones, no la fidelidad de todas las reglas del juego ni la interfaz real en navegador.**

## 4. Riesgos técnicos que siguen abiertos

1. **Talentos DRS:** revisar uno a uno los efectos de las ocho Especies y cuatro Ocupaciones: pasivos, acciones, reacciones, coste de Esfuerzo, inmunidades, excepciones y habilidades electivas.
2. **Herencia dual:** dos Especies siguen sin resolución de elección. El texto está señalizado para no hacer pasar una ficha incompleta por terminada.
3. **Equipo/competencias:** la lista de compra inicial es reducida y no constituye el equipo completo del DRS. Hacen falta más cotejos de aptitud, categorías y restricciones, además de compras en todos los Niveles significativos.
4. **Progresiones:** las cuatro tablas tienen 30 filas, pero la comprobación actual no verifica todos sus valores contra cada celda original ni todos los casos reales de aplicación.
5. **Magia:** las magnitudes se consultan, pero los Conjuros no se ejecutan completamente. El motor debe respetar que el **jugador realiza las Tiradas de Atributo**, mientras el Cronista no realiza d20 salvo excepciones reglamentarias.
6. **DRS versus DLC:** el filtro de fuente no implica que los JSON de ampliaciones dejen de descargarse. Revisar el paquete entregable antes de publicar.
7. **Cadena de PR:** la #4 apunta a la rama de la **PR #3**, que apunta a `main`; ambas siguen sin fusionar. La #4 contiene código y datos históricos de suplementos que no deben tratarse como alcance publicado del DRS.
8. **Edición de fuente:** el archivo DRS usado muestra encabezado «v1.1.11» y una entrada «1.1.12» en el control de cambios. Conservar esta distinción documental hasta fijar una referencia editorial definitiva.

## 5. Orden de ejecución propuesto para cerrar Forja 1.0

1. **Cierre de Especies:** resolver Herencia dual en los dos modos y probar efectos de todos los Talentos de las ocho especies, sin modificar el DRS.
2. **Cierre de Ocupaciones:** cotejar y probar Talentos, competencias, Poderes, equipo y progresiones por Nivel de las cuatro básicas.
3. **Motor de Conjuros:** separar preparación/lanzamiento/resolución; automatizar únicamente resultados autorizados y dejar explícitas las decisiones del Cronista.
4. **Distribución:** separar realmente el paquete DRS de los DLC conservados, y probar que la edición básica no depende de ellos.
5. **Control final:** regresión completa en CI, prueba manual de escritorio/móvil, validación editorial y revisión de la cadena de PR antes de fusionar o publicar.

**Estado de entrega:** avances guardados en la rama de trabajo, **sin fusión ni despliegue**. Este informe acompaña al cierre de Conjuros [89](89-cierre-magnitudes-64-conjuros-drs.md); no lo sustituye.
