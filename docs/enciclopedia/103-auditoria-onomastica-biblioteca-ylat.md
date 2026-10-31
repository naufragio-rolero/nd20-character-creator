# Forja 1.0 — Auditoría de fuentes de la Biblioteca /Ylat y procedencia real de los nombres

> **Ampliación solicitada (31/10/2026):** este informe solo inventariaba los PDF disponibles en la Biblioteca de ChatGPT `/Ylat`. **No era un inventario de Google Drive.** Ya se ha consultado también el Drive conectado y cinco Google Docs de Ylat —Zonas, Lenguas, Biografías, Historia de Shadaleen y Enciclopedia—, además del generador histórico Excel con **1428 entradas** de Ylat (1422 valores distintos). La documentación y los límites de interpretación figuran en el [informe 104](104-fuentes-google-docs-y-generador-historico-ylat.md). Los 149 nombres públicos permanecen sin cambios hasta cotejar el corpus ampliado.

**Fecha:** 31/10/2026. **Estado:** inventario documental inicial, no canon nuevo. **PR #4:** borrador; sin fusión ni despliegue.

## Decisión de enfoque

El autor pide **usar el directorio /Ylat como corpus de referencia** y no reducir la onomástica de Ylat a elegir entre «Niguace» e «Isla Tormenta». La distribución aprobada de **149 combinaciones** y la exclusión de **51 identidades documentadas** siguen intactas mientras se revisan las fuentes.

Se consultó **el directorio exacto /Ylat de la Biblioteca del usuario**, no una ruta local con el mismo nombre. El inventario disponible el 31/10/2026 contiene **tres PDF**, todos leídos desde la Biblioteca:

| Fuente exacta de la Biblioteca | Extensión | Función en la auditoría |
|---|---:|---|
| `/Ylat/Cronicas de Niguaze  .pdf` | 90 páginas | Historia de la Academia, estudiantes, relaciones, instituciones, procedencias y nombres aparecidos durante las Crónicas |
| `/Ylat/Personages Niguaze.pdf` | 22 páginas | Fichas de personajes, genealogías, territorios de origen y variantes textuales que requieren contrastarse |
| `/Ylat/Hilo Isla Tormenta 2019.pdf` | 21 páginas | Relato de partida y personajes que confluyen en Isla Tormenta desde regiones y especies distintas |
| **Total** | **133 páginas** | Material documental, no un repertorio cerrado de culturas ni licencia para inventar genealogías |

Los nombres antiguos del repositorio `data/tesauro-ylat.json` permiten agrupar **116 combinaciones en Niguace y 33 en Isla Tormenta**, pero esas categorías son **corpus de referencia**, NO poblaciones, lenguas, culturas de nacimiento, clanes ni Especies.

## Hallazgo principal: distinguir lugar narrado de procedencia del personaje

**Niguace** es una Academia de Magia donde coinciden estudiantes de diversas procedencias (Crónicas, páginas 1–2). Eso no convierte los apellidos usados por los alumnos en un único repertorio cultural «niguacense».

Ejemplos documentados:

| Persona o identidad mencionada | Información realmente respaldada | Fuente, páginas |
|---|---|---|
| Carmelo Ratazzi | Ficha del personaje vinculada a la **Casa Ratazzi** del **Reino de Piave**; estudia en Niguace | `Personages Niguaze.pdf`, pp. 4–5 |
| Remigio Ratazzi | Nombre que figura en una redacción anterior dentro del bloque encabezado «Carmelo Ratazzi»; **conflicto textual pendiente**, no presumir segundo personaje independiente | `Personages Niguaze.pdf`, pp. 2–3 |
| Sahib Averroes | Nació en **Qurtuba, capital de Gadir**, y posteriormente acude a la Academia de Niguace | `Personages Niguaze.pdf`, p. 7 |
| Sahure em Wase | Procede de una **gran isla gobernada por una momia**; el texto examinado no le asigna inequívocamente un topónimo local | `Personages Niguaze.pdf`, p. 11 |
| Emberlin Mertordrag | Hija de Fort Mertordrag, vinculado al reino de los Bandar en **Mertoria**; los nombres de casas Balaur y Mertordrag tienen significado genealógico | `Personages Niguaze.pdf`, p. 14 |
| Satomi | Catfolk de **Cattai**, alumna del aquelarre de la Quimera en Niguace | `Cronicas de Niguaze  .pdf`, p. 46 |

**Isla Tormenta** es el escenario de reunión, captura y aventura, no la procedencia común de sus protagonistas:

| Persona | Procedencia documentada | Fuente |
|---|---|---|
| Nilsea | **Pantanos Isophius**; rusalka | `Hilo Isla Tormenta 2019.pdf`, p. 2 |
| Kalzifer | **Fanghis**, en **Malasthar**; enano de la jungla | Mismo PDF, p. 3 |
| Oiam Orbem | **Isla de Qelasthavia**; elfo celestial | Mismo PDF, p. 4 |
| Xandor Tugg | **Submundo**; elfo blanco, con aparición en Ysothia | Mismo PDF, p. 5 |
| Noron Cabeza de Oso | **Cordillera de la Ventisca**; enano de tribus nómadas | Mismo PDF, p. 6 |
| Kharan Boll | **Casa Boll de Aermont** | Mismo PDF, p. 7 |
| Drakabel | **Picos Matanza**, al norte de **Éilerenn**; dracónida | Mismo PDF, p. 8 |
| Tanto | **Zeq'Riel**; mediano | Mismo PDF, p. 9 |

**Conclusión:** no etiquetar «Frida Ratazzi» como cultura de Niguace ni «Nilsea Orbem» como cultura de Isla Tormenta. La primera es una combinación de elementos documentales; la segunda mezcla elementos de protagonistas con procedencias explícitamente diferentes. Una combinación no prueba ni genealogía ni comunidad lingüística.

## Calidad de las fuentes: incidencias que no deben autocorregirse

1. **Carmelo / Remigio Ratazzi:** dentro del mismo `Personages Niguaze.pdf`, pp. 2–3, un bloque titulado «Carmelo Ratazzi» desarrolla la biografía nombrando a **Remigio**; en pp. 4–5 reaparece una versión que nombra a **Carmelo**. La auditoría **no decide cuál versión es canónica** ni crea dos personajes. Señalar para cotejo editorial.
2. **Niguace / Niguaze:** la documentación alterna formas en el título y el texto; guardar el nombre literal del documento y un campo de normalización por resolver, sin modificar el original.
3. **Nombres de casas y linajes:** Ratazzi, Dolcemare, Balaur/Mertordrag y Boll tienen contextos de parentesco o pertenencia. Recombinarlos puede sugerir una filiación que los documentos no confirman. No afirmar nunca que la propuesta pertenece a una casa noble.
4. **Especie y cultura:** una misma Especie puede aparecer en zonas distintas (ejemplo: enanos Fanghis frente a Cordillera de la Ventisca). No utilizar Especie como sustituto de cultura o topónimo.
5. **Fuentes de distinto tipo:** una ficha de personaje, una narración de campaña y un hilo de partida no confirman por sí solos la misma clase de dato ni su grado de canon. Mantener el origen y la página en cada atribución.

## Corrección inmediata en Forja

Para evitar inducir a error, el campo de la interfaz **«Procedencia del nombre de Ylat»** pasa a llamarse **«Corpus de referencia de Ylat»**, con:

- **Todo el corpus (149 combinaciones)** — opción por defecto.
- **Documentos de Niguace (116 combinaciones)**.
- **Relato de Isla Tormenta (33 combinaciones)**.

La ayuda indica expresamente que este filtro identifica **la fuente de los componentes onomásticos**, no el lugar de nacimiento ni la cultura de ningún personaje. El texto de la ficha aclara «corpus de referencia», en lugar de sugerir procedencia cultural.

Se mantienen inalteradas la estructura original `ambito`, las 149 combinaciones y su distribución, el rechazo de las 51 identidades documentadas en el candidato público y las pruebas de publicación del DRS. **No se añaden nombres, linajes, culturas ni reglas inventadas**.

## Modelo documental propuesto para la siguiente fase (aún NO implementado)

Por cada testimonio de nombre:

- `fuente` — ruta exacta de Biblioteca, página y tipo (ficha/crónica/relato de partida);
- `nombre_literal` — cadena exacta, conservando acentos y grafías;
- `referente` — personaje/documento/elemento onomástico, con estado **canon confirmado / no confirmado / propuesta**;
- `nombre_personal`, `apellido`, `casa_o_linaje`, `epiteto` — **solo si el texto permite separarlos**;
- `especie_explicita`, `lugar_origen_explicito`, `lugar_estancia` — **campos independientes y opcionales**;
- `conflictos_fuente` — variantes y contradicciones sin resolver;
- `aptitud_aleatoria` — **por revisar** para nombres de casas, títulos, personajes históricos y otras formas que impliquen pertenencia.

La futura generación cultural debe estar respaldada por testimonios cruzados suficientes. **No inferir una cultura completa a partir de un solo nombre**. Las 149 combinaciones conservan por ahora su condición de propuestas no canónicas, sin nueva atribución cultural.

## Estado y límites

Se ha comprobado el **inventario íntegro visible de la carpeta /Ylat** y se han inspeccionado páginas fuente específicas de los tres PDF. Esta es una **auditoría inicial de procedencias y estructura**, no el vaciado onomástico exhaustivo de las 133 páginas ni un dictamen de canon global.

La siguiente extracción puede registrar sistemáticamente nombres, lugares, linajes y variantes con evidencias de página antes de ampliar el generador. **No requiere elegir entre Niguace e Isla Tormenta como culturas** y no altera el trabajo de DLC.

**PR #4 sigue en borrador, sin fusionar ni desplegar.**
