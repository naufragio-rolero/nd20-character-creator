# Estado de la integración: 170 Conjuros y esfuerzo pendiente

**Fecha:** 31/10/2026. **Fuente:** rama `feat/forja-conjuros-fichas-2026-10-30`, PR #4 en borrador contra `docs/enciclopedia-inventario-2026-10-28`. **Alcance de estimación:** módulo de Conjuros de Forja, no todo el generador ni todo Naufragio d20.

## Métrica objetiva: Conjuros con datos mecánicos estructurados

- **434** fichas documentales del Tomo de Magia revisadas y consultables; una es duplicada (`Arma elemental`).
- **433** Conjuros únicos seleccionables en `data/catalogo-poderes.json`, tras retirar la variante `Ira celestial` C3 no respaldada por el DRS.
- **170** Conjuros únicos con magnitudes y condicionantes verificables en `data/conjuros-magnitudes-literales.json`. Todas las entradas tienen ID de catálogo, ordinal del Tomo y una evidencia textual cotejada, con pruebas a los Niveles 1, 5, 10 y 30.
- **263** Conjuros únicos pendientes de estructurar: `433 - 170 = 263`.
- **39,26 %** de Conjuros únicos con magnitudes; **60,74 % pendiente** de ese trabajo de estructuración.
- **10** perfiles de un grupo de daño con dos tipos simultáneos. Dos son nuevos: *Lluvia de estrellas* (radiante y psíquico **solo en la rama de éxito**; en fallo causa 5d6 radiante) y *Luz de luna* (1d6 adicional radiante y psíquico).
- **13** correcciones editoriales aprobadas en la capa de consulta, sin alterar los documentos originales.

**Importante:** 170 de 433 no significa que 170 Conjuros se lancen o ejecuten automáticamente. El número mide fichas con **magnitudes declarativas**, no resolución completa de efectos.

## Sexta tanda: +50 Conjuros

Se han incorporado magnitudes verificadas de 50 Conjuros entre *Hablar con las rocas* y *Maldición de pesadumbre*, incluidos *Ira celestial* C5, *Idea devoradora*, *Infundir terror*, *Invocar elemental menor*, *Ídolo guardián de Mulinith*, *Lanza hemática*, *Lluvia de estrellas*, *Luz de luna*, *Muro de fuego* y *Marchitar*.

El motor conserva duraciones, daños en dados, cantidades de criaturas invocables, distancias y umbrales cuando están explícitos. No ejecuta Tiradas ni modifica Salud. Las fichas de modalidad alternativa no suman daño de éxito y fallo. *Lluvia de estrellas* refleja que su daño dual corresponde solo al éxito.

## Estimación de esfuerzo local para terminar el módulo de Conjuros

No existe un porcentaje objetivo de «trabajo local» derivable del número de Conjuros. Las fichas de datos son una parte del desarrollo: faltan **lanzamiento, consumo de recursos, estados, reglas de duración, daño efectivo, interfaz interactiva y revisión en navegador**. Para dar una estimación transparente, se usa esta **ponderación provisional de esfuerzo**, que no representa horas medidas ni una planificación ya aprobada.

| Bloque de trabajo | Peso ilustrativo sobre el módulo completo | Avance estimado | Contribución al avance total |
|---|---:|---:|---:|
| Conciliación documental, catálogo y fuentes | 10 % | 100 % | 10,0 puntos |
| Magnitudes mecánicas verificadas de 433 Conjuros | 20 % | 39,26 % | 7,85 puntos |
| Selección de Conjuros, preparación y consulta de ficha | 15 % | 80 % (provisional: sin revisión visual completa) | 12,0 puntos |
| Motor de resolución de Tiradas y efectos de Conjuros | 30 % | 0 % de ejecución integral | 0,0 puntos |
| Gestión persistente de Salud, condiciones, recursos y duración | 15 % | 0 % de integración completa | 0,0 puntos |
| QA de navegador, aceptación y publicación final | 10 % | 20 % (CI automatizada superada, revisión manual pendiente) | 2,0 puntos |

**Resultado orientativo del modelo:** `10 + 7,852 + 12 + 0 + 0 + 2 ≈ 31,85 %` completado y **≈68,15 % pendiente**, que conviene comunicar como **«aproximadamente el 70 % del trabajo local del módulo sigue pendiente»**, no como precisión factual. Cambiar la ponderación o el alcance del motor cambiaría esa estimación.

Este porcentaje NO indica la deuda de todo el generador de personajes, ni cuánto queda para un despliegue del compendio solo de consulta (que es bastante más cercano), ni un calendario real. Una versión únicamente consultiva requiere mucho menos esfuerzo que un motor completo de lanzamiento.

## Controles y próximos bloques

- Pruebas `tests/conjuros.js`: 434 fuentes, 170 identificadores únicos estructurados, 263 IDs pendientes y diez perfiles duales, más regresiones generales `tests/smoke.js`.
- [Consulta desde el editor](86-visor-conjuros-durante-elecciones-y-120-magnitudes.md): la interfaz consulta por ID exacto y calcula según Nivel, antes o después de confirmar el personaje.
- **Pendiente para cierre real:** completar y cotejar las 263 fichas mecánicas, resolver reglas de lanzamiento no ambiguas (el Cronista no hace Tiradas de d20), interacción de éxito/fallo, aplicación de recursos y estados sin inventar reglas, pruebas visuales en navegador y revisión para fusionar en `main`.
- **Dependencias editoriales todavía abiertas:** daño de dos tipos ante resistencia parcial y ante resistencia combinada con vulnerabilidad; seis propuestas geométricas aún no aprobadas. La ejecución automática de esos casos permanece deshabilitada.
- **Sin publicación:** PR en borrador; sin fusión a `main`, sin desplegar cambios nuevos en GitHub Pages y sin editar Google Drive.

## Verificación

Los porcentajes de cobertura documental y mecánica se basan en recuentos de IDs distintos. Las pruebas imprimen `COBERTURA · 170/433 ... pendientes 263 (60.74 %)` en CI. La estimación del 70 % local es juicio técnico con hipótesis declaradas y debe revisarse cuando se cierre el alcance funcional del módulo.
