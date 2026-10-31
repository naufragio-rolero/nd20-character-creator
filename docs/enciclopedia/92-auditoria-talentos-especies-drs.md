# Forja 1.0 — Auditoría de Talentos de las ocho Especies del DRS

**Fecha:** 31/10/2026. **Norma de referencia:** `NaufragioD20DRS.docx`, sección *Especies* (desde *Elfo agreste* hasta *Semiorco*).  
**Alcance:** Forja 1.0, solo los ocho perfiles DRS; ningún suplemento publicado. **PR #4:** borrador, sin fusión ni despliegue.

## Resumen de resultados

Se han cotejado las ocho Especies con sus Talentos, requisitos de VA, Dado de Salud, Movimiento, envejecimiento y la elección racial de *Herencia dual* resuelta en el [informe 91](91-herencia-dual-drs-cierre-implementacion.md).

Los **11 Talentos raciales diferentes** disponen ahora de una glosa de reglas en `data/especies.json` (`talentos_descripcion`). La ficha muestra la glosa del Talento realmente adquirido en **Observaciones**, y no solo su nombre. Las glosas son **síntesis fieles del DRS**, no sustituyen al texto completo del manual.

| Especie | Talentos del DRS | Tratamiento en Forja 1.0 |
|---|---|---|
| Elfo agreste | Linaje feérico; Rapidez | Movimiento 7 ya calculado. La inmunidad a Parálisis y Ventaja ante *Dormir* se documentan; no se ejecutan en combate. |
| Enano montañés | Corpulencia; Visión en la oscuridad | Movimiento 5 ya calculado. Repetición de Blindaje con 1 Esfuerzo y visión de 30 m documentadas; no se ejecutan en partida. |
| Humano común | Buen desarrollo | **+1 VA** durante creación, antes de progresar por Niveles. En modo Personalizado se elige uno de los seis Atributos. |
| Mediano amable | Baja estatura; ¡Sálvese quien pueda! | Movimiento 5 y limitación de talla en compra automática; solo escudos pequeños. +1 Esquiva a distancia y liberación de estados con Esfuerzo/Acción documentados, sin ejecución en partida. |
| Gnomo urbano | Baja estatura; Visión en la oscuridad | Movimiento 5; Mente e Intuición 7+ verificadas; restricción de talla igual que Mediano. Visión de 30 m documentada. |
| Semielfo | Ánimo; Herencia dual | Ánimo documentado (+2 a la Tirada de Atributo de un aliado que pueda escucharle una vez al día). Herencia dual selecciona **Buen desarrollo o Linaje feérico**, exclusivamente. |
| Orco común | Ira interna; Saña primitiva | Ambos efectos documentados (Esfuerzo/Salud y +1 a daño cuerpo a cuerpo), sin automatizar durante partida. |
| Semiorco | Sed de sangre; Herencia dual | Ataque -2 / Penetración +1 documentados. Herencia dual selecciona **Buen desarrollo o Ira interna**, exclusivamente. |

## Hallazgo DRS-ESP-03 — Baja estatura: equipo inválido por talla

**Texto normativo:** Mediano amable y Gnomo urbano **no pueden utilizar armas ni armaduras que no estén adaptadas a su tamaño**; solo pueden llevar escudos pequeños; tienen **+1 a Tiradas de Esquiva contra ataques a distancia**. El Movimiento -1 ya figura en el valor racial y **no debe aplicarse otra vez**.

**Situación anterior:** `assets/equipment.js` filtraba equipamiento principalmente por las Competencias de Ocupación. Podía proponer a un Mediano o Gnomo equipo que no acreditase adaptación, e incluso escudos medianos o grandes en Ocupaciones autorizadas a usarlos. El catálogo `data/equipo-inicial.json` **no contiene metadatos de adaptación** en armas o armaduras; el DRS no proporciona en esa sección una tabla exhaustiva de piezas adaptadas.

**Decisión editorial posterior (31/10/2026):** El autor establece que **todas las armas y armaduras del catálogo de Forja se ofrecen en versiones adaptadas al tamaño de medianos y gnomos, sin variar sus precios ni características**. Esta decisión operativa no reescribe el DRS; resuelve cómo interpretar la oferta de compras para personajes con *Baja estatura*. La etapa anterior de bloqueo preventivo queda **sustituida**.

**Comportamiento definitivo de la compra automática:**

1. `assets/equipment.js` detecta *Baja estatura* en los perfiles de Mediano amable y Gnomo urbano.
2. Las armas y armaduras del catálogo mantienen su elegibilidad por **Competencias de Ocupación, Nivel y presupuesto**; ya no necesitan el campo `adaptada_baja_estatura: true`. Sus precios y características permanecen intactos: se consideran versiones adaptadas para la Especie que las compra.
3. Los escudos se restringen **exclusivamente al Escudo pequeño**, incluso si la Ocupación permite escudos medianos o grandes. La Ocupación debe seguir teniendo competencia con escudos.
4. La ficha explica la política de adaptación y recuerda el **+1 a la Tirada de Esquiva contra ataques a distancia**, sin sumar otra vez la penalización de Movimiento ya incluida.
5. `data/equipo-inicial.json` declara la decisión en `politica_talla`, para distinguir la norma original del DRS de esta interpretación editorial aplicada a Forja.

**Consecuencia:** se elimina la necesidad de catalogar manualmente las adaptaciones para los objetos ya ofrecidos. El catálogo puede seguir incompleto por otras causas (armas, varitas, etc.), pero *Baja estatura* ya **no bloquea las compras automáticas**.

## Hallazgo DRS-ESP-04 — Buen desarrollo del Humano común

**DRS:** mejora uno de los seis Atributos en **1 VA durante la creación**, por elección del PJ. El sistema ya concedía una bonificación aleatoria al Humano común, pero **el modo Personalizado no permitía elegir el Atributo**, a diferencia del arreglo previo de Herencia dual.

**Solución aplicada:**

- `assets/powers.js`: paso `buen-desarrollo` con las seis opciones de Atributo, exclusivo del **Humano común** en modo Personalizado.
- `assets/rules.js`: la ficha provisional difiere *Buen desarrollo*, reservando la extracción de RNG correspondiente; no declara recibido el Talento sin aplicar la mejora. La versión definitiva aplica **+1 antes de la progresión**; deja constancia del Atributo.
- `assets/app.js`: el editor reconstruye la ficha desde la misma semilla al confirmar la elección, conserva identidad y aplica posteriormente las restantes decisiones de preparación y aprendizaje. En Rápido, se conserva la elección automática reproducible.
- El motor de aplicación rechaza confirmar una ficha provisional sin reconstruirla.

## Hallazgo DRS-ESP-05 — Envejecimiento ausente de la ficha

En `data/especies.json` se han incorporado las ocho pautas del DRS: Elfo agreste **nunca envejece**; Enano montañés desde **280 años**; Humano común **50**; Mediano amable **70**; Gnomo urbano **350**; Semielfo **100**; Orco común **35**; Semiorco **45**. La ficha muestra esa referencia en **Observaciones**; no se ha inventado una edad inicial para un personaje ni aplicado penalizaciones inexistentes.

## Pruebas automáticas y límites

`tests/alcance-drs.js` verifica:

- Identidad exacta de los Talentos iniciales de las ocho Especies y cobertura de sus glosas.
- Que las Observaciones reflejen las capacidades realmente concedidas, incluida solo la rama escogida de *Herencia dual*.
- Que Movimiento conserve el valor **ya corregido por los Talentos** sin sumas o restas duplicadas.
- En Mediano y Gnomo: compra de armas y armaduras equivalentes a las de un personaje de talla normal, con las **mismas Competencias, Nivel y precios**, considerando los objetos adaptados por decisión editorial; prohibición de escudo mediano/grande; autorización del pequeño solo si la Ocupación permite escudos.
- En Humano: seis variantes de *Buen desarrollo*, ficha provisional, aplicación exclusiva desde Nivel 1, determinismo, Niveles 1/5/12/30 y coherencia del editor.
- En las ocho Especies: envejecimiento cotejado y presente en la ficha.

**Importante:** las pruebas de Node/CI **no sustituyen** una prueba manual de navegador. Tampoco existe hoy un motor de combate que consuma Puntos de Esfuerzo, aplique estados, tiradas de Esquiva, inmunidades, visibilidad, daño o Penetración para todas las capacidades raciales. Que un efecto esté **documentado** en ficha **no significa que se ejecute automáticamente**. No anunciar «Especies 8/8 ejecutables» ni Forja 1.0 cerrada.

## Próxima prioridad

Las ocho Especies ya tienen perfiles y Talentos documentados, elecciones iniciales y restricciones de compra contrastadas **hasta el límite del catálogo disponible**. La adaptación de armas y armaduras de Medianos y Gnomos está resuelta por decisión editorial, sin tarifas ni reglas nuevas. Para la publicación base quedan: validar la UX en navegador, completar otros huecos del catálogo y auditar íntegramente las **cuatro Ocupaciones DRS** (Talentos, Competencias, Progresiones 1–30 y Poderes).

**PR #4 permanece en borrador, sin fusionar ni desplegar.**
