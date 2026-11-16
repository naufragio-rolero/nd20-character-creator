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

### 7.2 — Filtros dependientes **[pendiente]**

- Añadir `Escuela` al buscador existente. El conjunto de resultados será la intersección de nombre, Círculo y Escuela.
- El selector de Círculo muestra solamente los Círculos con Conjuros de la Escuela seleccionada, y el de Escuela solamente las Escuelas presentes en el Círculo seleccionado.
- Aclarar explícitamente en la interfaz cuándo no hay coincidencias, y recalcular opciones sin bucles entre cambios de ambos selectores. La búsqueda textual sigue operando sobre el subconjunto.
- Probar las 64 fichas y todas las combinaciones no vacías y vacías, escritorio/móvil.

### 7.3 — Listas oficiales de solo lectura **[pendiente]**

- Incorporar a la pantalla pública **Mago — DRS** y **Clérigo — DRS**, resueltas directamente de `catalogo-poderes.json`, bloqueadas para edición/eliminación, y con **Duplicar para editar**.
- La lista del Mago es **un repertorio de Conjuros disponibles**, NO un grimorio inicial: el DRS indica que empieza con dos Conjuros de Primer Círculo elegidos por el jugador.
- Las copias personales mantienen referencias de procedencia; no se permite guardar una modificación bajo un ID oficial.
- **Verificar contra la fuente canónica** la clasificación de cada Conjuro y las diferencias entre fuentes históricas antes de promover listas oficiales a la pantalla. No completar automáticamente discrepancias.

### 7.4 — Tabla de progreso por Lista **[pendiente]**

- Mostrar las tablas oficiales de Mago y Clérigo **de solo lectura** desde `data/progresiones-oficiales.json`.
- Cada Lista editable podrá referenciar una tabla oficial o **una tabla personalizada declarada expresamente**, con filas 1–30 y Círculos 1–8.
- Editar y validar la tabla personalizada sin inferir Espacios desde la Lista; un Conjuro disponible no implica automáticamente Espacios o aprendizaje.
- Extender el modelo existente donde sea necesario, dejando explícito qué es regla oficial y qué es diseño personal.

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

La fase 7.1 se desarrolla **solo en rama y PR de borrador**. Esta tarea no modifica `forja-preview-pr142`, GitHub Pages, `main` ni la rama de PR #144.
