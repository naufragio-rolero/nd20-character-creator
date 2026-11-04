# La Forja — Claridad de semillas, edición y PDF A5 (04-11-2026)

## Semillas

El registro de semilla permite reconstruir **la generación original** con las mismas opciones y catálogos. No es una partida guardada: no incorpora cambios posteriores de Talentos, Poderes conocidos, preparaciones, inventario, compras ni Equipo. Se explicita este límite en Configuración y en el diálogo de reproducción de la ficha; no se modifica el generador determinista.

## Revisión de Talentos y Poderes

La barra inferior presenta tres acciones a la misma altura cuando existen Espacios de Conjuro preparables: **Guardar elecciones**, **Guardar y preparar** y **Cancelar**. En móvil se apilan para evitar desbordamientos. La acción combinada valida y aplica las elecciones documentadas con el motor existente antes de abrir la preparación, que consulta el repertorio actualizado. **Guardar elecciones** mantiene el recorrido anterior. El Clérigo puede acceder a preparación aunque no tenga elecciones manuales. No se agregan plazas ni se alteran reglas.

## PDF A5

Las piezas equipadas se describen de forma consolidada según `data/equipo-inicial.json`: armas con daño, penetración y durabilidad; armaduras con Blindaje y Durabilidad; escudos con Bloqueo, Durabilidad y daño cuando están documentados. Los objetos sin catálogo no reciben propiedades inventadas. La fila de arma pasa a ocupar el ancho disponible; no se repite el campo Daño separado. La plantilla PDF histórica se corrige visualmente durante la composición sin editar sus bytes; el SVG de referencia y el mapa JSON se adaptan.

Los encabezados se simplifican a **PODERES CONOCIDOS** y **EFECTOS DE PODERES**. Los nombres de competencias, Talentos y Poderes, cuando existen en secciones dinámicas, se representan en **negrita real** mediante Source Serif 4 Bold (SIL OFL), con el resto de texto en la tipografía normal; esa fuente se incorpora al paquete DRS desde el mismo paquete de fuentes abierto que ya usa la exportación.

## Alcance y publicación

Solo presentación y continuidad de flujo. No se modifica la economía ni el sistema de selección/aprendizaje. CiFi y Nocturna permanecen excluidos de LIVE. Esta rama no cambia el SHA aprobado del despliegue protegido; la promoción requiere pruebas verdes y PR de publicación independiente.
