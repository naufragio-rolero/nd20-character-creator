# La Forja — Tanda 2: seguidores DRS y preparación de Conjuros

**Fuente reglamentaria:** [Naufragio d20 DRS v1.1.12](https://docs.google.com/document/d/1W69x5V_982IGg2AL0TltZ200aSt2khXu_VCa7gMI3zY/edit), apartados «Seguidores» y «Uso de los Conjuros», y `data/progresiones-oficiales.json` cotejado previamente con las tablas de Clérigo y Mago. Esta mejora no altera las reglas, la economía de PJ ni el sistema de combate.

## Seguidores de Naufragio d20

En **Herramientas del Cronista**, con **Naufragio d20** seleccionado, el botón «Generar seguidor» permite escoger un oficio o dejar que se resuelva la tabla d12. **Dungeon Hack conserva su propio generador y sus reglas de seguidor** sin compartir las progresiones ni los costes.

| d12 | Tipo | Precio/día | Moral | Salud | Aventura |
|---:|---|---:|---:|---:|---|
| 1 | Arcanista | 20 mo | 8 | d4 | Depende |
| 2 | Artesano | 1 mo | 6 | d4 | No |
| 3 | Cazador | 2 mo | 9 | d8 | Sí |
| 4 | Escriba | 1 mo | 6 | d4 | Depende |
| 5 | Escudero | 1 mp | 7 | d6 | Sí |
| 6 | Guardia | 2 mo | 9 | d8 | Sí |
| 7 | Ladrón | 1 mo | 7 | d4 | Depende |
| 8 | Mensajero | 5 mo | 8 | d6 | Sí |
| 9 | Mercenario | 5 mo | 9 | d8 | Sí |
| 10 | Portantorchas | 8 mc | 6 | d6 | Sí |
| 11 | Porteador | 7 mp | 7 | d6 | Sí |
| 12 | Sacerdote | 3 mo | 10 | d4 | No |

**Ficha DRS:** dos únicos Atributos, **Ataque** (ataques, lanzamiento; Fuerza, Agilidad y Mente) y **Defensa** (esquivas, salvaciones; Resistencia, Intuición y Presencia), calculados como Atributos de PJ: VA = 3 + d6 y DA = 20 − VA. La Salud se obtiene lanzando el dado del oficio (d4, d6 o d8); la Moral es la puntuación de la tabla. La ficha muestra los precios recomendados y la disponibilidad para aventuras.

No se atribuye **Nivel**, **Esfuerzo**, progresión, Competencias, equipo, Conjuros conocidos o poderes a seguidores que el DRS no describa individualmente. «Arcanista» y «Sacerdote» son oficios de la tabla, no licencias para inventar sus hechizos. Los seguidores se incluyen en **Copiar ficha** y **Exportar .txt**, pero no usan el PDF A5 específico para PJ de seis Atributos.

## Preparación de Conjuros en PJ

Desde el pictograma **Talentos y Poderes** del pie de una ficha mágica DRS se abre el editor de elecciones; su botón **Preparar Conjuros** conduce a un segundo diálogo, separado del aprendizaje y de la edición de Talentos.

- Se muestran exclusivamente las plazas por **Círculo** registradas en la Tabla de Progreso correspondiente al Nivel de creación. No hay plazas adicionales por abrir el editor.
- **Mago:** solo puede elegir Conjuros **ya aprendidos en su libro** y de Círculo permitido. Su preparación requiere **dos Intervalos de estudio**, conforme al DRS.
- **Clérigo:** escoge entre los Conjuros de su lista DRS de Círculo disponible. La preparación exige **un Intervalo por la mañana**.
- Cada plaza permite preparar un Conjuro permitido, **repetir el mismo** en varias plazas o marcar **«Sin preparar»**. No se ejecutan turnos, intervalos ni lanzamientos; es una edición de ficha.
- Guardar cambia únicamente `conjuros_preparados`, las decisiones de preparación y la advertencia de plazas vacías. Mantiene Conjuros conocidos, Talentos, competencias, dinero, inventario, recursos y notas posteriores.
- Cuando se cambia un **Conjuro conocido** desde su editor, las preparaciones que ya no existen en el grimorio se invalidan y quedan vacías; nunca se sustituyen automáticamente por Conjuros inventados.

Las elecciones posteriores no forman parte del **JSON de semilla de generación**, que sigue reproduciendo el personaje original, no las modificaciones manuales. Las exportaciones de la ficha sí reflejan el estado actual.

## Pruebas y publicación

- `tests/tanda2.js`: coincidencia literal de las 12 filas y de sus dados/monedas, semilla determinista, exclusión de reglas ajenas y validaciones de preparación de Clérigo y Mago, incluida la preservación del equipo posterior.
- `tests/browser-semillas-rangos.cjs`: generación de seguidores DRS/Dungeon Hack y apertura, uso, cierre y persistencia del diálogo de preparación en navegador, además de comprobaciones móviles.
- `tests/smoke.js`, suite de compras, Firefox/WebKit, PDF A5 y paquete DRS se conservan como controles obligatorios.
- **No se publica LIVE en esta tanda.** El workflow `.github/workflows/forja-live.yml` sigue fijado al SHA previamente aprobado. Una eventual publicación requiere una revisión explícita y empaquetar exclusivamente `dist/public-drs`, con CiFi, Nocturna y DLC de Fantasía excluidos.
