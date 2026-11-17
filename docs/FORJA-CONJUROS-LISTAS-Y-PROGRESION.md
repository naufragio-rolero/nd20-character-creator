# La Forja — Conjuros: listas, filtros, progresiones y exportación

**Registro de trabajo:** [issue #145](https://github.com/naufragio-rolero/nd20-character-creator/issues/145).  
**Base:** PR #144 — rama `feat/escuelas-medallones-characters`, revisión `b6092bb9`.  
**Desarrollo aislado:** `feat/forja-conjuros-presets-progresion`.  
**Política:** no fusionar ni publicar PREVIEW/LIVE hasta autorización expresa. Las fichas y reglas del DRS son inmutables.

## Propósito

Convertir el editor sencillo de Conjuros en una herramienta reutilizable para diseñar **Listas de Conjuros asociables a Ocupaciones** y sus tablas de progreso, sin atribuir a Naufragio d20 reglas inventadas.

### Fuentes y componentes existentes (revisados)

- `data/conjuros-drs-fichas.json` contiene las 64 fichas oficiales del DRS de Fantasía; sus nombres, Escuelas y Círculos no deben cambiar.
- `data/catalogo-poderes.json` ya contiene `listas_drs.Mago` y `listas_drs.Clérigo`, agrupadas por Círculo. **No crear un segundo catálogo oficial.**
- `data/progresiones-oficiales.json` ya contiene `fantasia.Mago.niveles` y `fantasia.Clérigo.niveles` (30 filas, ocho Círculos). Mantenerlas como referencias inmutables.
- `assets/spell-lists.js` ya ofrece `listasDisponibles`, `duplicarLista`, `vincular`, `resolver`, `exportar` e `importar`; usa el esquema `naufragio.listas-conjuros/v1`. **Reutilizarlo, no rehacerlo.**
- `assets/spell-lists-simple.js` y `spells/index.html` son la pantalla pública vigente. La copia en texto plano depende de `presentarConjuro()` y `listaEnTexto()`. El formato visual no debe modificar esas funciones.
- `docs/LISTAS-DE-CONJUROS.md` recoge la historia del editor editorial anterior y sus restricciones; las propuestas de suplementos no se incorporan por defecto al DRS.

## Fases y criterios de aceptación

### 7.1 — Ajustes visuales **[completada en rama de desarrollo]**

1. **Nigromancia:** trasladar el dibujo de la calavera **0,8 unidades SVG hacia arriba**, manteniendo círculo, color y tamaño exterior. Motivo: el centro de masa blanco del símbolo estaba aproximadamente en `y=12,77`.
2. **Naturaleza:** trasladar el dibujo de la hoja **0,55 unidades SVG a la izquierda** para llevar su centro de masa blanco (`x≈12,55`) al centro del medallón; círculo y color sin cambios.
3. **Lista por Círculos:** mostrar nombre de Conjuro en primer término y datos opcionales de Escuela y Origen en tipografía secundaria, **`0.76rem` / peso `400`**. Conservar exactamente las cadenas que `presentarConjuro()` genera, incluidas las que se copian.
4. **Quitar:** reemplazar el rótulo visual por un **SVG original de papelera** en botón rojo suave; conservar `type=button`, `data-id`, evento, nombre accesible `aria-label`, `title` y foco visible. Rojo derivado de `--peligro` y superficies del tema, no un color fijo que falle en temas oscuros.
5. Regresión: un único `span` de texto por Conjuro, iconos decorativos, copia literal antes/después de marcar Escuela y Origen, controles de teclado, cinco temas, móvil, sin tocar el catálogo ni `#share=`.

**Archivos:** `assets/icons/escuela-nigromancia.svg`, `assets/icons/escuela-naturaleza.svg`, `assets/spell-lists-simple.js`, `assets/spell-lists-simple.css`, pruebas estáticas y E2E.

### 7.2 — Filtros dependientes **[completada en rama de desarrollo]**

- Añadir `Escuela` al buscador existente. El conjunto de resultados será la intersección de nombre, Círculo y Escuela.
- El selector de Círculo muestra solamente los Círculos con Conjuros de la Escuela seleccionada, y el de Escuela solamente las Escuelas presentes en el Círculo seleccionado.
- Aclarar explícitamente en la interfaz cuándo no hay coincidencias, y recalcular opciones sin bucles entre cambios de ambos selectores. La búsqueda textual sigue operando sobre el subconjunto.
- Probar las 64 fichas y todas las combinaciones no vacías y vacías, escritorio/móvil.

**Implementación 7.2 (17 de noviembre de 2026):**

- Se ha añadido un selector de **Escuela**, con los valores tomados exclusivamente de las 64 fichas DRS. No se introduce una taxonomía paralela ni se cambia el modelo de Conjuros.
- `filtrarConjuros(fichas, nombre, circulo, escuela)` devuelve la intersección de los tres criterios. La búsqueda textual no distingue mayúsculas ni tildes, igual que antes.
- `facetasConjuros(fichas, circulo, escuela)` calcula **qué Círculos existen en la Escuela seleccionada** y **qué Escuelas existen en el Círculo seleccionado**. Cada conjunto ignora únicamente su propia selección. El texto del nombre **no condiciona las opciones** de los selectores; se aplica exclusivamente a los resultados. Esto evita que una búsqueda temporal esconda opciones de progreso reales.
- Las opciones `Todos` y `Todas` permiten levantar cualquiera de las restricciones. Los valores seleccionados se conservan al actualizar opciones. Se reconstruye el `select` solo si su conjunto cambia, sin emitir eventos sintéticos ni alterar el estado de listas guardadas.
- Búsqueda sin criterios: permanece el mensaje de ayuda original ampliado a Escuela. Búsqueda sin coincidencias: mensaje específico de filtros incompatibles con el nombre escrito. Un único criterio de Escuela ya muestra resultados sin obligar a seleccionar un Círculo.
- Diseño: tres columnas en escritorio; nombre en fila completa y filtros en dos columnas en tablet; una columna en móvil. Los dos selectores cuentan con etiquetas y una ayuda compartida mediante `aria-describedby`.
- Pruebas: matriz de facetas/filtrado de las **64 fichas DRS**, comprobaciones E2E de valores realmente disponibles, combinaciones Escuela/Círculo en ambos sentidos, consulta textual con y sin coincidencias, y regresión de listas guardadas, `#share=`, temas y móviles.

**No se ha publicado PREVIEW ni LIVE.** Este bloque no modifica fichas DRS, progresiones, listas oficiales ni las funciones de copia.

### 7.3 — Listas oficiales de solo lectura **[completada en rama de desarrollo]**

- Incorporar a la pantalla pública **Mago — DRS** y **Clérigo — DRS**, resueltas directamente de `catalogo-poderes.json`, bloqueadas para edición/eliminación, y con **Duplicar para editar**.
- La lista del Mago es **un repertorio de Conjuros disponibles**, NO un grimorio inicial: el DRS indica que empieza con dos Conjuros de Primer Círculo elegidos por el jugador.
- Las copias personales mantienen referencias de procedencia; no se permite guardar una modificación bajo un ID oficial.
- **Verificar contra la fuente canónica** la clasificación de cada Conjuro y las diferencias entre fuentes históricas antes de promover listas oficiales a la pantalla. No completar automáticamente discrepancias.

**Implementación 7.3 (17 de noviembre de 2026):**

- El editor público presenta permanentemente `Clérigo — DRS (solo lectura)` y `Mago — DRS (solo lectura)` en el selector «Listas disponibles», incluso cuando no existen listas locales. Proceden de `catalogo.oficiales`, construido y reconciliado por `assets/spell-lists.js` a partir de `data/catalogo-poderes.json` y las 64 fichas DRS. **Clérigo tiene 34 Conjuros; Mago tiene 37.** No se ha creado ningún catálogo alternativo ni se ha modificado una ficha.
- Al seleccionar una Lista oficial se bloquean el nombre, Guardar, Eliminar, Compartir y Añadir; no aparecen papeleras en la lista. Se permite **Copiar lista** como texto plano y consultar sus ocho Círculos.
- Un aviso identifica el repertorio oficial y aclara específicamente que el **Mago empieza con dos Conjuros de Primer Círculo elegidos**, según `data/progresiones-oficiales.json > fantasia.Mago.aprendizaje.inicio`; sus 37 entradas **no** se conceden automáticamente como grimorio inicial.
- «Duplicar para editar» usa `api.duplicarLista()`, asigna un nuevo ID `usuario:…`, guarda una copia independiente en `localStorage` y selecciona esa copia. Desde entonces se puede editar y eliminar sin afectar al original. Ni los originales ni sus IDs pasan a la biblioteca personal como registros editables.
- **Procedencia retrocompatible:** en bibliotecas `naufragio.listas-conjuros/v1` se admite un campo **opcional `derivadaDe`**, estrictamente validado contra las dos listas oficiales del catálogo. Al duplicar una oficial, al editarla, importarla/exportarla o duplicar otra copia se preserva ese identificador. Las listas v1 antiguas sin ese campo mantienen exactamente el mismo formato.
- Compartir la lista oficial está inhabilitado porque `#share=` serializa solo la biblioteca personal; primero se debe duplicar para compartir una versión editable. El botón de exportación sigue respaldando solamente listas personales. La **exportación completa y las tablas** siguen pendientes para 7.4 y 7.5.
- Pruebas: comparación exacta de las 34 y 37 referencias, protección de IDs oficiales, roundtrip de procedencia, recorrido real de las dos vistas oficiales, copia de texto, duplicación, edición sin alterar originales, persistencia tras recarga y continuidad de los cinco temas. Sin cambios en PREVIEW ni LIVE.

### 7.4 — Tabla de progreso por Lista **[completada en rama de desarrollo]**

- Mostrar las tablas oficiales de Mago y Clérigo **de solo lectura** desde `data/progresiones-oficiales.json`.
- Cada Lista editable podrá referenciar una tabla oficial o **una tabla personalizada declarada expresamente**, con filas 1–30 y Círculos 1–8.
- Editar y validar la tabla personalizada sin inferir Espacios desde la Lista; un Conjuro disponible no implica automáticamente Espacios o aprendizaje.
- Extender el modelo existente donde sea necesario, dejando explícito qué es regla oficial y qué es diseño personal.

**Implementación 7.4 (17 de noviembre de 2026):**

- La nueva sección **«Tabla de progreso por Nivel»** presenta los 30 Niveles por ocho Círculos, en una tabla desplazable con encabezados semánticos, controles etiquetados y diseño compatible con móvil y cinco temas.
- Las listas oficiales `drs:Mago` y `drs:Clérigo` muestran sus progresiones de **solo lectura** tomadas literalmente de `data/progresiones-oficiales.json > fantasia.Mago/Clérigo.niveles`. Se comprueban treinta filas, ocho columnas y números enteros dentro de los límites que ya usa `validarProgresion()`. No se altera `data/progresiones-oficiales.json`.
- En cada lista personal el editor permite **Sin tabla**, **Mago — DRS**, **Clérigo — DRS** o **Tabla personalizada**. Una tabla personalizada comienza explícitamente con **cero Espacios en todas las celdas**; solo el usuario modifica cantidades. Una referencia oficial se puede **Copiar tabla para editar**, convirtiendo sus valores en una tabla personal independiente sin modificar el DRS.
- La progresión se asocia a la **Lista**, no a cada Conjuro: nuevo campo opcional `progresion` en el modelo `naufragio.listas-conjuros/v1`: `{tipo:"oficial",id:"drs:Mago"|"drs:Clérigo"}` o `{tipo:"personal",niveles:[[8 enteros],…]}` (30 filas). Sin este campo significa **sin Espacios definidos**. El modelo no calcula ni infiere una progresión a partir del Círculo máximo, Conjuros disponibles o Nivel.
- Se reutiliza la validación estricta ya existente para 30×8: enteros en el intervalo 0–30, sin aceptar celdas vacías, fracciones ni números negativos. Los cambios en la tabla forman parte de **«Cambios sin guardar»**, del control de descarte, de la duplicación y de Guardar/recargar. El documento JSON actual ya preserva el campo opcional en la importación/exportación sin requerirlo en bibliotecas anteriores. La **exportación completa** con asociaciones, configuraciones y otras herramientas sigue siendo el objetivo de la Fase 7.5.
- Duplicar una lista oficial asocia su tabla **por referencia `drs:`**, mientras que duplicar una lista personal hace una **copia defensiva** de su tabla privada. La presentación de una tabla oficial no modifica el documento fuente.
- Se añade `tests/fase7-progresion.js` a CI y E2E en Chromium, Firefox y WebKit para tablas oficiales, personalización, edición, guardado, recarga e integridad del DRS. La pantalla mantiene el comportamiento de `Copiar lista` como texto plano **sin insertar tablas**.
- **Sin publicación** de PREVIEW/LIVE ni fusión de PR. Se preservan las funciones ya existentes que asocian listas a Ocupaciones; la nueva opción por Lista no confiere lanzamientos automáticamente a una Ocupación ajena.

### 7.5 — Exportación/importación completas **[pendiente]**

- Conservar `Copiar lista` como texto plano.
- Exportar un documento JSON versionado con las Listas y sus IDs de Conjuros, referencias de catálogo/DRS, asociaciones a Ocupaciones, tablas personalizadas, origen de duplicación, configuración de presentación y datos de trabajo pertinentes.
- Importar con validación estricta de versión, IDs, cardinalidades y referencias. Mantener compatibilidad de lectura para bibliotecas actuales `naufragio.listas-conjuros/v1`; **no romper `#share=`**.
- No añadir textos normativos completos al JSON: se resuelven por ID en el catálogo oficial. No exportar datos ajenos al editor ni insertar automáticamente nuevo canon.

### 7.6 — QA y PREVIEW **[pendiente]**

- Suite Node + navegación real Chromium, Firefox y WebKit; temas Clásico, Ébano, Cerúleo, Obsidiana y Violeta; tamaños móvil y escritorio; teclado, accesibilidad, regresión de persistencia y comparaciones DRS.
- Revisar frontera del paquete público y publicar solo una PREVIEW filtrada cuando se autorice; **LIVE y las PR anteriores permanecen sin modificar**.

## Registro de decisiones

| Área | Decisión | Razón |
|---|---|---|
| Motor | Ampliar `assets/spell-lists.js` cuando haga falta | Ya hay listas oficiales, duplicación y progresiones |
| 7.1 | Iconos ajustados dentro del mismo medallón de 24×24 | Consistencia con otras Escuelas |
| 7.1 | Tipografía visual secundaria, copia literal idéntica | Diferencia información de lectura de datos estructurados |
| 7.1 | Papelera accesible con icono SVG original | Evita un botón de texto que domina cada línea |
| Oficial/personal | No editar IDs oficiales directamente | Proteger DRS y trazabilidad |
| Mago | Repertorio oficial ≠ grimorio inicial | Evitar atribuir al DRS una selección automática inexistente |
| Progressión | No derivar Espacios automáticamente desde una Lista | Respetar los datos de progresión documentados |
| Exportación | Esquema versionado, referencias y procedencia | Reutilización en nuevas Ocupaciones sin duplicar textos normativos |

## Estado de publicación

Las fases 7.1, 7.2 y 7.3 se desarrollan **solo en rama y PR de borrador**. Esta tarea no modifica `forja-preview-pr142`, GitHub Pages, `main` ni la rama de PR #144.
