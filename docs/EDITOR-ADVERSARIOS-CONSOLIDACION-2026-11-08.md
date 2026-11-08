# La Forja — Consolidación del Editor de Adversarios (08/11/2026)

## Base y alcance

- Rama: `feat/editor-adversarios-consolidacion-2026-11-08`, creada desde `main` en `17483df3feb80898571dc142f3fcd563e759d6d1`.
- Fuentes de trabajo: `docs/EDITOR-CRIATURAS-FASES.md`, `docs/ADVERSARIOS-DISENO.md`, `docs/auditoria-adversarios-drs-106-2026-11-06.md` y `docs/FUENTES-CANONICAS.md`.
- Se respetan las cuatro fases anteriores, la auditoría de **106 perfiles oficiales / 182 ataques / 188 capacidades** y las **16 categorías / 12 SVG**. No se modifica `data/adversarios-drs.json` ni un solo registro del DRS, sus ilustraciones oficiales o la lista blanca de publicación.
- Los registros oficiales son de lectura; editar uno crea una copia personal. La colección propia y los identificadores oficiales seleccionados permanecen separados.

## Incidencias verificadas y correcciones

1. **La importación podía inferir Salud ausente.** `nuevaCriatura` elegía `saludModo: automatico` cuando la ficha no incluía Salud. El formulario calculaba `Nivel × 4 + ajuste × 4` al abrirla, aunque la fuente solo declarase Nivel. **Corregido:** el modo predeterminado es manual, sin modificar la Salud `null`; el cálculo requiere elegirlo expresamente. La función de cálculo documentada sigue disponible como herramienta de diseño y no se ha cambiado su fórmula.
2. **Biblioteca JSON v1 con propiedades ajenas al contrato.** El importador aceptaba metadatos desconocidos al nivel de biblioteca, catálogo personal y registro. Al importar, la librería reconstruye los identificadores y estructuras, por lo que podía descartar campos no representables. **Corregido:** rechazo previo de propiedades desconocidas; importación atómica sin tocar el almacenamiento. Se mantiene la versión JSON 1 y la validación estricta ya existente para las fichas individuales.
3. **Descripción obligatoria sin base en el modelo.** La interfaz imponía texto narrativo para guardar, aunque el contrato v1 lo permite vacío. **Corregido:** descripción opcional, sin añadir información ficticia.

## Mejoras de experiencia incorporadas

- **Colección:** búsqueda insensible a acentos y mayúsculas por nombre, categoría y fuente; filtro de procedencia (propias / oficiales); resultado visible y estado vacío específico. Los controles de navegación entre fichas respetan el subconjunto filtrado.
- **Edición:** explicación de Categoría, Familia/Subcategoría y Subtipo, sin inferencias ni conversiones. Los campos auxiliares de un ataque (daño numérico y vínculo técnico con Talento) se agrupan en un detalle opcional; nombre, cantidad, conector, daño literal y notas siguen visibles.
- **Importación por texto:** desglose de cuatro bloques (datos reconocidos, interpretaciones dudosas, fragmentos pendientes y datos propuestos para el editor). Los avisos por línea, la cadena original íntegra y el doble paso «analizar → pasar al editor → guardar» siguen existiendo.
- **Accesibilidad:** etiquetas explícitas, controles nativos de búsqueda/select y detalles abiertos con teclado, estado de resultados anunciado mediante `role=status`; se mantiene la navegación con flechas fuera de los campos de entrada. Las pruebas E2E abarcan escritorio y móvil mediante los flujos ya existentes.

## Generación de adversarios — estudio separado, NO implementada

El apartado «Creación de oponentes» del DRS 1.1.11 documenta una **secuencia guiada**, no un generador aleatorio de adversarios completos:

- Elegir qué amenaza supone el adversario y su Nivel (límite documentado: 100).
- Definir Moral (el DRS menciona 5–12 y advierte que autómatas y muertos vivientes carecen de Moral).
- Diseñar Salud con tantos d8 como Nivel, o usar la media 4 × Nivel. Como ajuste de diseño, 1–9 puntos de protección equivalen a 4 puntos de Salud adicionales cada uno; no es Blindaje para absorber daño.
- Elegir un daño entre Nivel y Nivel × 5, considerando los ataques múltiples.
- Decidir sus habilidades especiales en función de la ficción.

**No se documenta** una distribución aleatoria para categorías, Talentos, tipos o cantidades de ataque, selección de Moral, habilidades especiales ni combinaciones y reglas de progresión universales. El texto pide decisiones del Cronista y admite valores narrativos excepcionales.

**Propuesta técnica delimitada, no autorizada para implementar:** un asistente de *creación manual* que cite las opciones y límites del DRS, reciba las elecciones del Cronista y muestre un borrador con campos explícitamente vacíos, sin seleccionar ni inventar valores. Para cualquier aleatorización habría que aprobar antes tablas de probabilidad, exclusiones de Moral, escala de daño, combinatoria de ataques y catálogo elegible de habilidades, con fuentes y casos de prueba.

## Regresiones añadidas

- `tests/criaturas-modelo.js`: Salud ausente y decisión expresa de cálculo.
- `tests/criaturas-import.js`: fuente con Nivel pero sin Salud ni descripción.
- `tests/criaturas-biblioteca.js`: JSON desconocido rechazado antes de escribir y exportación estable.
- `tests/criaturas-ui.js`: contratos de los controles y modo de Salud.
- `tests/browser-criaturas.cjs`: flujo de importación sin Salud, cuatro bloques, campos opcionales y filtros con y sin acentos, manteniendo la E2E de imágenes, PDF y navegación existente.

### Criterios de aceptación antes de LIVE

1. Ejecutar suites Node y E2E Chrome, Firefox y WebKit del **candidato público**; revisar todos los checks de la PR.
2. Verificar `scripts/crear-paquete-drs.js`, `scripts/comprobar-publicacion-drs.js`, `tests/paquete-publico-drs.js` y las listas blancas: nada de suplementos no autorizados.
3. Comprobar que el diff **no toca** los registros originales de las 106 fichas DRS ni la iconografía aprobada.
4. Fusionar por PR conforme a la política existente; obtener el **SHA final exacto aprobado** y promoverlo exclusivamente mediante `.github/workflows/forja-live.yml` con checkout y validación del SHA protegido.
5. Confirmar la ejecución de LIVE y el smoke real del paquete desplegado. Una PR funcional o su merge en `main` **no equivalen a publicación**.

**Estado inicial de este documento:** cambios propuestos en la rama; no se declara verificada la batería completa ni publicado LIVE hasta contrastar los resultados efectivos de CI y promoción.
