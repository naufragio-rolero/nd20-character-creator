# Forja · Preparación de plantillas para exportación PDF

**Estado:** especificación de preparación. **No hay exportación PDF implementada.**
**Objetivo:** obtener una ficha **completamente rellenada** con los datos que la Forja ya conoce, lista para imprimir, consultar o compartir. No incorporar automatización de combate, viajes, seguimiento de turnos ni estados de partida.

## Archivos que debe preparar el equipo editorial

1. **`forja-nd20-fantasia-a4.pdf`** — plantilla vacía para personajes Naufragio d20 (DRS); formato A4 vertical (210 × 297 mm).
2. **`forja-dungeon-hack-a4.pdf`** — plantilla vacía independiente para Dungeon Hack; formato A4 vertical, con sus campos y convenciones propios.
3. **`forja-continuacion-a4.pdf`** — página de continuación reutilizable para listas largas (Talentos, Conjuros, Equipo, Competencias, Observaciones), si el diseño principal tiene espacio limitado.

**Preferencia técnica:** PDF vectorial con texto legible y zonas claras para cada campo. Puede incluir **campos de formulario PDF (AcroForm)** con nombres estables; si es un PDF gráfico sin campos, se mapearán coordenadas y dimensiones para superponer texto. Guardar, si existe, un **original editable** (por ejemplo, SVG, InDesign, Scribus o similar), además del PDF exportado. Las fuentes utilizadas deben estar autorizadas para la distribución o sustituidas por fuentes compatibles; no incorporar al repositorio archivos de fuentes de terceros sin autorización.

Los ficheros deben estar **en blanco**, sin datos de personajes reales. Mantener el mismo tamaño de página, margen de impresión de aproximadamente 10 mm y espacio para textos de longitud variable. Si se rasterizan ornamentos, utilizar alrededor de 300 ppp (A4: 2480 × 3508 píxeles), aunque se prefiere conservar texto y líneas vectoriales. No hace falta crear códigos de barras, cuadrículas de combate ni casillas para registrar viajes.

## Mapeo de campos que ya proporciona la Forja

Los valores deben tomarse del **objeto de personaje generado**, no parsearse a partir de la tarjeta HTML ni del archivo TXT.

| Zona de la plantilla | Datos disponibles | Criterio |
|---|---|---|
| Identidad | `nombre`, `juego`, `nivel`, `descripcion`, `sexo`, `concepto` si existe | Mostrar solo información presente; no inventar una biografía |
| Atributos | `atributos[]`: `nombre`, `valor` si procede, `dificultad`, `favorito` | Nd20: VA y DA, favorito; Dungeon Hack: DD según su sistema |
| Recursos | `recursos[]`, con sus valores existentes | Usar nombres reales; no suponer que ambos juegos tienen los mismos Recursos |
| Protección | `protecciones_equipadas`, si existe, y el blindaje consultable por el motor | Distinguir armadura, escudo y protección natural; no convertir el escudo en Blindaje |
| Capacidades | `competencias[]`, `capacidades[]` | Mantener los nombres y registros íntegros |
| Magia y poderes | `poderes[]`, `conjuros_preparados[]` si existen | Separar conocidos y preparados; no ejecutar efectos ni descontar recursos |
| Equipo | `equipo[]` | Conservar nombres, cantidades y anotaciones literales de los paquetes |
| Economía | `riqueza`; `saldo_mo` cuando exista | No deducir monedas donde solo se conoce texto |
| Observaciones | `notas[]` y procedencia de la ficha | No eliminar advertencias que añadan información reglamentaria |

Los detalles de un Talento, Conjuro u objeto que ya se consultan mediante popup **no deberían convertirse automáticamente en una página por entrada**: primero deben caber los datos de la ficha. Como posible segunda fase, se puede incorporar un anexo de referencias documentadas, solo si es útil para crear o consultar el personaje y respeta las fuentes autorizadas.

## Distribución editorial sugerida

- **Primera página:** cabecera e identidad, Atributos, Recursos, protecciones equipadas, Competencias y Talentos/capacidades.
- **Segunda página o continuación:** Conjuros/Poderes conocidos, preparados, Equipo, Riqueza, Observaciones y fuente reglamentaria.
- Si los listados desbordan: **añadir páginas de continuación**, no recortar nombres, omitir información silenciosamente ni reducir la tipografía hasta hacerla ilegible. La cantidad de páginas dependerá del personaje y su Nivel.
- La exportación será, por defecto, **un PDF por personaje**. La exportación simultánea de muchas fichas podrá definirse después sin complicar la primera versión.

## Pruebas de aceptación cuando se implemente

1. Comparar un personaje Nd20 DRS de Nivel bajo y otro de Nivel alto con su ficha PDF.
2. Comprobar personajes con Conjuros preparados y sin ellos, Talentos extensos y Equipo largo.
3. Comprobar armadura equipada, escudo separado y ausencia de armadura.
4. Exportar una ficha Dungeon Hack sin rellenar campos que pertenecen únicamente a Nd20.
5. Comprobar acentos, `ñ`, letras especiales y símbolos de reglas sin sustituciones.
6. Revisar el resultado visual (todas las páginas) a escala de lectura e impresión A4.
7. Confirmar que el botón de exportación no altera el personaje, sus valores ni el inventario.

**No confundir:** preparar los PDF vacíos es trabajo de diseño; automatizar su rellenado será una implementación posterior. La Forja sigue siendo un **creador rápido de personajes**, no una herramienta de gestión de partidas.
