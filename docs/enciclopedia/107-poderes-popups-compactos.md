# Forja 1.1 — Popups de Poderes: lectura rápida y datos técnicos

**Fecha:** 31/10/2026 · **PR #6:** `feat/forja-poderes-popup-compacto` sobre `feat/ux-accesibilidad-forja-1-1`.  
**Decisión del autor:** cambiar **solo los Poderes** ahora; abordar los Talentos en un sprint posterior.

## Principio editorial

La ficha emergente debe servir para jugar: **tipo y clasificación, nombre, los datos necesarios para aplicar el Poder, efecto literal y origen/fuente**. Los datos de auditoría, magnitudes y límites de automatización no se eliminan, pero solo aparecen al activar **Configuración avanzada → Mostrar detalles técnicos**.

No resumir ni modificar las descripciones oficiales para hacerlas caber. La descripción principal sigue siendo el texto transcrito/cotejado; la información técnica avanzada sigue siendo un dato informativo y no activa tiradas ni efectos.

## Orden visual

1. **Cabecera:** tipo a la izquierda, escuela y Círculo a la derecha si es Conjuro, o categoría/Ímpetu/Complejidad cuando la ficha documenta esas propiedades.
2. **Nombre** del Poder.
3. **Datos útiles para jugar** (solo los que existan): Alcance, Duración, Tirada explícita, Lanzamiento, Atributo, Activación, Coste, Requisito, Nivel mínimo o Nivel.
4. **Descripción literal**.
5. **Detalles técnicos** (solo con preferencia avanzada): campos restantes —como número de ficha, redacción o automatización—, magnitudes literales calculadas para el Nivel visible, condiciones no automatizadas y advertencias especiales de daño compuesto. El bloque es plegable.
6. **Pie:** origen **correctamente contrastado** y fuente específica.

### Ejemplo documentado: Dormir

De `data/conjuros-revisados-001-225.json` (registro `conjuro-7`, Tomo n.º 101), confrontado con `data/catalogo-poderes.json`, `data/alcance-drs-y-dlc.json` y `data/conjuros-magnitudes-literales.json`:

- **Conjuro** · **Arcana · 1.er Círculo**
- **Dormir**
- **Alcance:** `10m + 2m por Nivel`
- **Duración:** `1d6 Intervalos`
- **Tirada:** **no se muestra** porque la ficha cotejada de Dormir no define un campo de Tirada explícito (tampoco debe confundirse con `Lanzamiento`, que indica un tiempo cuando procede).
- **Texto:** se conserva literalmente el efecto de la reserva de `5d10 Puntos Oníricos`.
- **Detalles técnicos avanzados:** Ficha del Tomo 101; redacción literal cotejada; automatización no ejecutada; magnitudes a Nivel 1 como `5d10 Puntos Oníricos`, `12 metros` y `1d6 Intervalos`, con las condiciones originales. **El valor de 12 m no reemplaza la fórmula del campo principal.**
- **Pie:** `Origen: Naufragio d20 DRS · Fuente: NaufragioD20 — Tomo de Magia (texto cotejado)`.

## Tratamiento según tipo

| Tipo indexado | Cabecera | Campos en lectura rápida |
|---|---|---|
| Conjuro | Escuelas y Círculo documentados | Alcance, Duración, Tirada solo si constara, Lanzamiento o Requisito |
| Técnica | Categoría (p. ej., Disciplina) | Coste, Requisito, Activación, Atributo cuando se documente |
| Poder psiónico | Ímpetu documentado | Atributo, Coste, Requisito u otros datos realmente presentes |
| Argucia, Script | Tipo nominal; categoría solo si está documentada | Únicamente campos disponibles; no inventar Escuelas o Círculos |
| Órdenes, Flechería, Privilegios, Canciones, Eidolas, Recetas | Tipo derivado del propio catálogo; Categoría/Complejidad cuando exista | Requisito, Nivel mínimo, Nivel u otros valores documentados |

Los vínculos y listas auxiliares no se confunden con Poderes individuales si el índice actual no los presenta como fichas. Los documentos faltantes nunca se suplen inventando Tiradas, duraciones o Especies.

## Origen y fuente

**No confundir `Nd20` con DRS.** Un Conjuro aparece como «Naufragio d20 DRS» solo si su ID pertenece a la lista de 64 Conjuros aprobados del manifiesto `data/alcance-drs-y-dlc.json`. Las Técnicas que declaran explícitamente `Naufragio d20 DRS` también reciben esa etiqueta. El resto recibe «Naufragio d20», «Naufragio d20 CiFi» o «Naufragio d20 Nocturna» según la fuente/sistema documentado, **sin atribución DRS ficticia**.

La fuente completa del tomo, si consta, tiene prioridad sobre una referencia genérica. Los datos de cabecera pasan de `info.datos` a un objeto de presentación producido por `presentarPoder` sin modificar el registro ni las reglas de juego.

## UX y accesibilidad

El ajuste de interfaz pasa a llamarse **«Mostrar detalles técnicos»** y mantiene su clave de almacenamiento `forja-informacion-avanzada`, de manera que no se pierda la preferencia del usuario.

Con la preferencia desactivada, el bloque `info-detalles` de Poderes lleva `hidden` y no ocupa espacio ni aparece en el árbol de accesibilidad; con ella activada aparece abierto y puede plegarse. Cambiar el ajuste fuera del popup lo cierra por el comportamiento normal de pulsar fuera: al abrir un nuevo Poder se aplica el nuevo estado. **Talentos mantienen sus popups existentes** hasta el siguiente sprint.

La vista respeta escritorio/móvil, ajuste de anchura, HTML semántico `dl/dt/dd`, `details/summary`, Escape y etiqueta ARIA. Los campos condicionales no generan filas vacías.

## Comprobaciones y lanzamiento

- `tests/alcance-drs.js`: los 64 Conjuros DRS conservan su Círculo y origen; comprobaciones de Dormir, Técnica Baluarte, Poder psiónico, Script, Canto y Conjuro suplementario no DRS.
- `tests/browser-compatibilidad.js`: apertura real de Dormir y Baluarte, fórmula literal, ausencia de Tirada inventada, magnitudes solo en modo avanzado, origen/fuente y texto de efecto.
- `tests/browser-compras.js`: conserva regresiones de Talentos y generación.
- `tests/paquete-publico-drs.js`: mantiene protección de DRS y exclusión de suplementos.

La publicación LIVE seguirá **únicamente tras cuatro validaciones exitosas** y mediante promoción del SHA a `.github/workflows/forja-live.yml` en `main`, que despliega `dist/public-drs`. No fusionar PR #6 para realizar la promoción ni publicar el repositorio raíz.
