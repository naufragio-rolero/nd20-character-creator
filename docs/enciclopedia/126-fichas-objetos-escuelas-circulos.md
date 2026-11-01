# 126 — Fichas editoriales de Objetos y Conjuros: categoría, Escuela y Círculo

**Fecha:** 2026-11-01 · **Alcance:** presentación de la Forja DRS, sin nuevas reglas.

## Petición y fuente

Las fichas de Equipo mostraban al usuario una anotación interna como «Descripción contextual basada en la sección Varitas de defensa del DRS; no introduce otras reglas»; la anotación no es una regla ni una descripción del objeto. La Forja debe mostrar el texto descriptivo y los datos para jugar, no justificar frente al lector la procedencia o novedad de esa prosa.

Fuente normativa: `NaufragioD20DRS.docx`, apartados **Varitas de defensa**, **Núcleos de varitas** y **Escuelas de magia y los Círculos**. El texto del DRS establece para las varitas munición de esencia, restauración diaria, competencia con el arma y Tirada de Mente; el núcleo determina el elemento del daño y no puede cambiarse después de crearla. La redacción de las cuatro fichas es una **adaptación descriptiva sin reglas añadidas**: la distinción se conserva solo en los datos internos de trazabilidad, no en el popup.

## Presentación de Equipo

Las 111 entradas de `data/glosas-equipo-drs.json` siguen enlazadas por nombre a la entrada reglamentaria del catálogo; el precio, DU y otros campos existentes permanecen iguales. El popup usa ahora **pill de Categoría**, en vez de repetir «Categoría» dentro de la tabla de detalles. El dato proviene del campo `tipo` de la fila, cuando existe, o del encabezado/grupo documentado del catálogo, sin deducir propiedades nuevas.

Ejemplos: **Varita**, **Arma ligera**, **Arma de una mano**, **Armadura ligera**, **Escudo**, **Munición**, **Paquete**, **Foco de conjuro**, **Consumible**. Las etiquetas combinadas se limitan a clarificar si «ligera» designa arma o armadura. Los grupos sin un subtipo individual se nombran con la agrupación de origen.

La propiedad interna `procedencia_glosa` sigue disponible para auditar los 111 textos, pero ya no aparece como una nota «Descripción: [procedencia]». El pie de fuente sigue visible para que quede clara la procedencia del contenido.

## Presentación de Poderes

Cuando el Poder es un **Conjuro**, cada escuela acreditada por el catálogo se presenta en un pill propio, con seis colores estables para las seis escuelas explícitas del DRS: **Arcana, Demonología, Divina, Elemental, Naturaleza y Nigromancia**. Si hay varias escuelas, se muestran todas, sin escoger una preferente. El texto identifica la escuela incluso sin color.

El Círculo se presenta en una **insignia de anillo con número romano I–VIII** y la etiqueta **Círculo**. `aria-label` conserva el número arábigo para accesibilidad y comprobaciones. La numeración procede exclusivamente de `data/catalogo-poderes.json`; no se generan círculos por inferencia ni se añaden escuelas a otros Poderes.

Permanecen intactos alcance, duración, requisito, coste, efectos literales, orígenes y detalles técnicos. No se crea automatización de combate.

## Validación y límites

Pruebas automatizadas añadidas: las **111 fichas** de Equipo tienen categoría visible, las cuatro varitas no mencionan «según el DRS» ni introducen efectos, las **433 entradas de Conjuro indexadas** conservan escuelas y números de Círculo y la cobertura cromática corresponde a las seis Escuelas del manual. E2E confirma el popup de Dormir, Arcana, Círculo I, varias categorías de objetos, su precio y ausencia de metadatos editoriales en pantalla.

Esta entrega **no** integra ni publica la PR #13 de Equipo, ni modifica el DRS original. Los colores y números romanos son exclusivamente diseño de interfaz.

## Publicación verificada — 2026-11-01

- **PR #18:** https://github.com/naufragio-rolero/nd20-character-creator/pull/18 — fusionada.
- **SHA de producto:** `ba163f5144ec8e5f55073dea4b0cedcfbe72a78f`, fijado explícitamente en `.github/workflows/forja-live.yml`.
- **Forja LIVE:** https://naufragio-rolero.github.io/nd20-character-creator/
- **Ejecución definitiva:** https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41352889340 — **success**, incluida la verificación HTTP real tras publicación.
- **QA de la PR:** 4/4 suites **success** sobre `810a74599032ac97c90eae5eb742a540e80bda94`, incluida la paquetización DRS y Chrome, Firefox y WebKit.

**Incidencias controladas en el release:** la primera comprobación LIVE todavía exigía una expresión antigua del popup de Talentos; la segunda contenía una verificación redundante de JSON antes de descargarlo. Ambas pertenecían exclusivamente al workflow de verificación y fueron corregidas, sin alterar la lógica de la Forja; la ejecución final fue satisfactoria y comprobó el contenido servido: 111 objetos, cuatro varitas sin metatexto, seis estilos de Escuela y Círculos visuales. **La PR #13 permanece abierta en borrador sin integrar**, y no se ha alterado el `NaufragioD20DRS.docx`.

**No hay decisiones autorales bloqueantes:** esta entrega ha modificado únicamente la presentación y la prosa contextual autorizada de las varitas, sin introducir reglas.
