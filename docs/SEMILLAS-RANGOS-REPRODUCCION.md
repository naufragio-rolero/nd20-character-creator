# La Forja — Semillas, intervalos de Nivel y reproducción

## Ámbito y edición pública

Esta mejora reutiliza el generador de números seudoaleatorios `NaufragioRules.aleatorioSemilla` sin introducir reglas reglamentarias. Los identificadores de sistema existentes (`nd20`, `dh`, `nd20_cifi`, `nd20_nocturna`) no cambian. **CiFi y Nocturna siguen excluidos de LIVE.** La interfaz pública muestra «Naufragio d20 · Fantasía Épica» y «Dungeon Hack», sin alterar las cadenas históricas del modelo con las que trabajan Equipo y PDF.

## Semilla y configuración

- **Generar personaje** usa por defecto una semilla **nueva en cada pulsación**, creada mediante `crypto.getRandomValues` cuando está disponible. No la escribe automáticamente en el campo de configuración: se presenta en resultados y se puede copiar, junto con el JSON de reproducción.
- Justo debajo de **Generar personaje** aparece el botón **Usar semilla**, desactivado por defecto y con estado accesible `aria-pressed`. Al activarlo abre Configuración, muestra la semilla y la mantiene fija para sucesivas generaciones. Si no hay texto, recupera la última semilla generada (o crea una cuando aún no existen resultados); pulsarlo de nuevo desactiva el modo fijo sin borrar el valor escrito.
- Escribir o pegar una semilla en Configuración activa el modo fijo; vaciar el campo devuelve la generación aleatoria. **Importar un JSON de reproducción también activa la semilla**. Si el modo está desactivado, cualquier texto que permanezca en el campo se ignora: cada generación vuelve a ser diferente.
- Cada ficha `i` de un lote recibe su propio flujo determinista `aleatorioSemilla(semilla + ':' + i)`, empezando en `i = 0`. Elegir el Nivel consume ese flujo **antes** de construir la ficha. La misma semilla y las mismas opciones producen las mismas fichas en el mismo orden y los mismos Niveles.
- **Copiar semilla** solo copia la cadena utilizada.
- **Copiar configuración de reproducción** copia un JSON local `{version:1, semilla, config}`, que contiene sistema, fuentes, procedencias, Nivel mínimo/máximo, número de fichas, modo, Ocupación/Clase, Especie, subconjuntos permitidos, sexo, coherencia narrativa, nombres y riqueza opcional.
- **Recuperar configuración de reproducción** permite pegar el JSON y aplicar esas opciones desde el navegador. No se envía a servidores ni se incorpora ningún servicio externo.
- La reproducción cubre el **resultado original de la generación**. No incorpora cambios posteriores al inventario, compras, Equipo ni otras ediciones de ficha. Tampoco serializa modificaciones hechas al personaje después de generarlo.
- El modo **Personalizado** conserva la semilla para crear la identidad y las tiradas iniciales, pero las elecciones manuales de Talentos/Poderes deben repetirse para reconstruir el resultado final; no se inventa un selector automático equivalente.
- La reproducción presupone **el mismo código y catálogos de datos**. Cambios editoriales futuros en las fuentes publicadas pueden modificar resultados pese a coincidir semilla y opciones; la versión 1 del JSON no congela los catálogos.

## Intervalos

Los dos campos son obligatorios y no admiten decimales, valores vacíos o valores invertidos. Los límites de ficha son **1–30** en Naufragio d20 y **1–36** en Dungeon Hack, los que ya definía el generador. No se sustituyen valores inválidos de forma silenciosa. Para un intervalo [a,b], el motor determina cada Nivel mediante una selección discreta uniforme inclusiva. El Nivel efectivo se pasa al generador reglamentario antes de calcular Salud, Atributos, progresión, riqueza y demás valores asociados.

## Validaciones y usabilidad

No se puede generar sin al menos una fuente ND20 válida o sin procedencia de Dungeon Hack. El campo se señala con `aria-invalid` y un mensaje persistente; el error mantiene o abre Configuración y dirige el foco al grupo. Cerrar el tutorial conserva una preferencia en `localStorage`, cuando existe, sin eliminar controles. Se incorpora el tema **Violeta** respetando los otros cuatro; Ocupación/Especie y ambos Niveles se muestran en dos columnas cuando hay espacio y se apilan en dispositivos estrechos.

La gestión de Equipo recupera su panel principal al cerrar un submenú de armamento o útiles, sin alterar las operaciones económicas ni las reglas.

## Pruebas y publicación

- `node tests/semillas-rangos.js`: semillas iguales/diferentes, lotes reproducibles, rangos, límites, error de fuentes/procedencias y ausencia de azar externo a una semilla pasada al motor.
- `node tests/browser-semillas-rangos.cjs chrome` y `node tests/browser-semillas-rangos.cjs firefox webkit`: E2E de UI, botón «Usar semilla», azar distinto en generaciones consecutivas, reproducción deliberada, fuentes, Nivel, sistema, tutorial persistente, copia/restauración y navegación de Equipo. En CI se ejecutan asimismo sobre `FORJA_PUBLIC_ROOT=dist/public-drs`.
- Permanecen las pruebas de compras, talentos, Poderes, paquete DRS, PDF y compatibilidad, además de las verificaciones editoriales del paquete.

**main no equivale a LIVE.** Los cambios se integran por rama y PR tras superar las pruebas. La publicación en GitHub Pages solo se hace por el flujo protegido de SHA aprobado y artefacto `dist/public-drs`; no se publica el árbol raíz ni se alteran las exclusiones.
