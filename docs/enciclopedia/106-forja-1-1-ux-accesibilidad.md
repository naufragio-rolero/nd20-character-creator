# Forja 1.1 — Experiencia visual minimalista y accesibilidad

**Fecha:** 31/10/2026. **Decisión del autor:** iconos completamente minimalistas, selección visual, recuperación de la acción flotante de generación y lectura compacta de Talentos y Poderes.  
**Rama:** `feat/ux-accesibilidad-forja-1-1`  
**PR:** [#5 — Forja 1.1](https://github.com/naufragio-rolero/nd20-character-creator/pull/5) (borrador), **base: `feat/forja-conjuros-fichas-2026-10-30`**.

## 1. Selección visual sin alterar la generación

En Naufragio d20 **Fantasía DRS** el formulario muestra dos rejillas de tarjetas:

- **Especies:** las ocho publicadas en `data/especies.json`: Elfo agreste, Enano montañés, Humano común, Mediano amable, Gnomo urbano, Semielfo, Orco común y Semiorco, más «Aleatoria».
- **Ocupaciones:** Clérigo, Guerrero, Mago y Ladrón, más «Aleatoria».

Cada opción tiene un **icono original SVG monocromo** de trazos geométricos sencillos y un botón con `aria-pressed` y nombre accesible. Los **12 símbolos** están en `assets/icons-forja.svg`, sin fuentes de terceros, imágenes rasterizadas ni dependencia de CDNs. Heredan el color del tema de Forja; usan el mismo sistema de caja de 24 × 24.

Los `<select>` originales siguen siendo la **fuente de verdad** (valor y eventos `change`) y el respaldo para elegir desde lista, visible de forma secundaria. Las tarjetas actualizan esos valores y se sincronizan cuando cambia el selector o el sistema. Al pulsar o elegir con Intro, la tarjeta no se reconstruye: **el foco permanece donde estaba**. Al cambiar los filtros o volver desde otro sistema se recalcula la rejilla y el elemento elegido.

**Límites:** CiFi y Nocturna siguen disponibles en desarrollo sin alterar sus datos ni crearles iconos ficticios. Dungeon Hack mantiene sus selectores propios. La **distribución pública** sigue ofreciendo exclusivamente Fantasía DRS y Dungeon Hack; los botones y opciones CiFi/Nocturna se eliminan físicamente del HTML candidato mediante los controles de la PR #4.

## 2. Generación rápida desde cualquier punto

`#generar-flotante` es una segunda vía de entrada a **la misma validación y al mismo envío del formulario**:

- Botón fijo abajo a la derecha en escritorio; barra inferior de anchura disponible en móvil, respetando áreas seguras.
- Solo aparece en la pestaña **Personajes**, no en **Herramientas**.
- Desactivado hasta completar la carga; desactivado mientras se resuelven elecciones del modo Personalizado.
- Adapta su etiqueta al número de fichas; llama a `requestSubmit()` sobre `#configuracion` con el botón principal, **sin crear otro motor ni saltarse sus comprobaciones**.
- El botón principal del formulario permanece disponible.

No se añade ninguna regla ni se cambia el resultado del personaje por usar el botón flotante.

## 3. Popups de Talentos y Poderes: dos niveles de lectura

**Lectura rápida (predeterminada):** tipo, nombre, descripción completa documentada y fuente.

**Detalles técnicos (opcionales):** los metadatos disponibles, magnitudes calculadas a partir de tablas literales de Conjuros y condiciones de aplicación no automatizadas, y las explicaciones de daño compuesto. Se presentan en `<details class="info-detalles">`, dentro de la misma tarjeta emergente, con `<summary>Detalles técnicos</summary>`.

Se incorpora en **Configuración avanzada** la preferencia:

> **Mostrar información avanzada de Poderes y Talentos**

- Desactivada por defecto.
- Si se activa, los nuevos popups presentan el desplegable técnico abierto; también actualiza el popup que esté visible.
- Si se desactiva, siguen disponibles los datos técnicos bajo el resumen del popup, sin borrarse ni falsificarse.
- Se guarda en `localStorage` como `forja-informacion-avanzada`, cuando el navegador permite almacenamiento; si no, la aplicación sigue funcionando.

Los Talentos y Poderes usan **la misma estructura**, con sus efectos ya conectados a `talentos_descripcion` y las descripciones contrastadas existentes. El popup no inventa información que falte en el catálogo.

## 4. Diseño accesible y verificación

- HTML semántico y `aria-labelledby` para grupos de selección, botones con `aria-pressed` que reflejan el estado.
- Soporte de teclado, `:focus-visible`, áreas de pulsación amplias, tipografía legible, versiones de escritorio y móvil.
- Menos movimientos cuando el sistema indica `prefers-reduced-motion: reduce`.
- Iconos decorativos ocultos a lectores de pantalla; se anuncia el texto de la opción.
- Los controles no se duplican en el algoritmo de generación; quedan enlazados al formulario original.

**Pruebas añadidas:**
- `tests/browser-compatibilidad.js`: 9 tarjetas de Especie, 5 de Ocupación, 12 SVG, archivo externo disponible, selección por ratón e Intro sin perder el foco, sincronización de `<select>`, botón flotante y preferencia avanzada abierta/cerrada en Firefox y WebKit.
- `tests/browser-compras.js`: estado predeterminado, 12 iconos, generación efectiva con botón flotante, popup de Talento resumido y apertura global de detalles en Chrome.
- `tests/paquete-publico-drs.js`: presencia física del sprite SVG y los controles nuevos en la distribución depurada.
- `scripts/crear-paquete-drs.js` y `scripts/comprobar-publicacion-drs.js`: lista blanca y guardia incluyen obligatoriamente el sprite.

## 5. Ramas: inventario sin borrar trabajo

Consultado el repositorio al iniciar este sprint:

| Rama existente | Tratamiento |
|---|---|
| `main` | Rama principal; **sin cambios de Forja 1.1**. |
| `docs/enciclopedia-inventario-2026-10-28` | Base editorial de PR #4; **conservar** mientras dependa de ella. |
| `editorial/repertorios-fantasia-2026-10-28` | Trabajo editorial separado; **sin eliminación ni fusión**. |
| `feat/forja-conjuros-fichas-2026-10-30` | Base de la PR #4, DRS y candidato de Pages; **conservar**. |
| `feat/github-pages-multisistema` | Historial experimental de publicación multisistema; **no publicar ni fusionar** sin auditoría propia. |
| **`feat/ux-accesibilidad-forja-1-1`** | **Nueva rama**, PR #5 sobre la base de Forja 1.0. |

No se recomienda borrar ramas de forma automática. La limpieza definitiva queda condicionada a que el código de producción, el histórico de PR y el despliegue filtrado estén consolidados.

## 6. Estado de publicación

**La UX 1.1 está implementada en PR #5, no fusionada ni desplegada.** Se prueba de forma independiente mediante el workflow de candidato DRS. No modifica las configuraciones del entorno `github-pages` ni resuelve por sí sola los permisos que bloquearon el despliegue de la versión anterior. No utilizar la raíz del repositorio como directorio publicado.
