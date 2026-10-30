# Fase 3 — Revisión de propiedades y adquisición de Talentos de Especies

**Fecha de corte:** 2026-10-28  
**Ámbito:** las 115 fichas documentales de 44 Especies de Fantasía (DRS y ampliaciones), CiFi y Nocturna.  
**Estado:** preclasificación mecánica y reglas de acceso identificadas; **NO validación reglamentaria final**. Ningún archivo de ejecución de Forja ha sido modificado.

## 1. Entregables de esta revisión

- [03A · Preclasificación con citas y posiciones](03a-preclasificacion-propiedades-especies.json). **115 fichas**, cada una enlazada a su identificador del repertorio extraído; fragmentos exactos de la fuente con offsets y etiquetas de análisis. Todos los campos mecánicos **normalizados permanecen `null`** hasta ser evaluados y aceptados.
- [03B · Adquisición documentada](03b-adquisicion-talentos-especies.json). **14 Talentos opcionales de Hyrule**: restricciones de Ocupación y procedimiento de sustitución textual; **8 Especies de Nocturna**: Talento fijo y tres alternativas de las que se escoge una, según la introducción del manual.
- [02 · Textos fuente](02-informe-extraccion-especies.md). Se mantienen íntegros, sin cambios editoriales.

### Cobertura de marcadores (no número de propiedades validadas)

| Dimensión buscada | Fichas con al menos una evidencia literal |
|---|---:|
| Gasto o referencia a recursos | 39 |
| Tiempo, duración, descansos o recuperación | 38 |
| Distancia, alcance o área | 27 |
| Nivel, magnitudes o escalado | 28 |
| Elección o adquisición | 25 |
| Condiciones, prohibiciones o restricciones | 77 |
| Tiradas o dados | 64 |

Son búsquedas sobre el **texto exacto**; una cita puede tener varias etiquetas, y no detectar una expresión no significa que la propiedad no exista. Existen 10 fichas sin marcadores de estas categorías, pero **no carecen de efecto**: mantienen su texto completo en el repertorio original. En este paso no se han convertido las expresiones en fórmulas ni se han interpretado las tiradas.

**Verificación técnica:** 115 entradas, 115 identificadores distintos y **cero citas con desplazamientos incorrectos** respecto a los textos extraídos. No son pruebas de equivalencia mecánica.

## 2. Procedimientos de adquisición encontrados

### Hyrule — 14 Talentos opcionales

**Confirmado por fuente:** los 14 indican que puede cambiarse **uno de los Talentos** durante la **Creación de personaje**, con la salvedad de que el sustituido no puede ser el que define la Ocupación. Cada uno restringe la elegibilidad a Guerrero, Ladrón, Clérigo o Mago, o a una **Ocupación derivada** de las mencionadas, según su texto particular.

**Pendiente de validación:** determinar sin suposiciones qué Ocupaciones concretas son «derivadas» y qué Talento concreto es sustituible, antes de programar el selector. Una regla sobre un Talento de Ocupación no puede transformarse automáticamente en sustitución de Talento de Especie.

### Nocturna — 8 Especies

**Confirmado por fuente:** en la sección inicial «Especies», cada perfil tiene **un Talento fijo y un Talento adicional a elegir entre tres opciones**; la fuente lista 8 Talentos fijos y 24 alternativas. **No** se eligen las tres. La Debilidad de cada Especie es una propiedad separada y no se ha confundido con un Talento.

## 3. Hallazgos importantes para conciliación

| Ref. | Prioridad | Evidencia de la fuente | Revisión necesaria |
|---|---|---|---|
| **ESP-01** | Alta | Siete Talentos fijos de Ylat/Hyrule están bajo los perfiles en el documento vivo pero faltan de `data/catalogo-ampliado.json` (véase [inventario](01-inventario.md)). | Determinar la corrección de Forja, sin conceder mecánicas antes de validar. |
| **ESP-02** | Alta | Los 14 opcionales de Hyrule son **sustituciones de Talentos en creación** condicionadas a Ocupaciones específicas o derivadas; no son bonificaciones adicionales universales. | Confirmar equivalencias de Ocupaciones y restricciones de sustitución. |
| **ESP-03** | Alta | **«Baja estatura»**: el DRS de Mediano/Gnomo incluye **+1 a esquivar ataques a distancia**; la versión de Gnomo sylestri/Mediano jóbito de Ylat no incluye esa ventaja. **«Pequeño»** (Deku/Kokiri) sí incluye el +1, pero no la reducción de Movimiento que figura en «Baja estatura». | Mantener variantes contextualizadas; nunca fusionarlas solo por semejanza. |
| **ESP-04** | Alta | **«Herencia dual»** tiene la misma denominación en Semielfo y Semiorco, pero el DRS indica talentos heredables diferentes; Forja usa sufijos contextuales (SE/SO). | Conservar ambos efectos y enlaces de selección por Especie. |
| **ESP-05** | Alta | **«Escudo eléctrico»** habla de radio de **«4m2»** y **«Estallido escupefuego»** de radio de **«2m2»**. La expresión mezcla radio con unidades de área; la fuente permanece tal cual. | Aclarar con el autor si se pretende radio en metros o superficie en m², **sin corregirla unilateralmente**. |
| **ESP-06** | Alta | **«Hálito de energía»** causa **«1d4 de daño por cada 6 de tus Niveles»** sin definir en la frase qué daño corresponde a los Niveles 1–5. | Resolver posible mínimo o convención de escalado antes de parametrizar, sin asumirla. |
| **ESP-07** | Media | **«Vuelo»** (Orni) lleva `Coste: especial`: despegar mediante salto requiere Esfuerzo y mantener el vuelo ofrece Tirada de Resistencia o gasto adicional. **«Fuente de maná»** y **«Vínculo psiónico»** también cambian de efecto/coste según la Ocupación. | Modelar **ramas y condiciones**; un campo simple «coste = 1» sería incorrecto. |
| **ESP-08** | Media | **«Aliados en las sombras»** enlaza con el apartado «Aliado en las sombras»: DAL, Salud vinculada, recuperación y tipos de aliado. Las 32 fichas de Nocturna no están en `fichas-documentales.json`. | Mantener el apartado asociado y preparar las relaciones cruzadas; no resumirlo como una capacidad sin coste. |
| **ESP-09** | Media | En Nocturna, **«Chillido de ultratumba»** indica que las criaturas afectadas deben superar una **Tirada de Resistencia**. | Comprobar su resolución contra PNJ dentro del principio de Tiradas de Atributo realizadas por jugadores, sin crear tiradas del Cronista. |
| **ESP-10** | Media | **«Fuente de maná»** menciona `Conjuro de Nivel 1` y `Conjuros de Nivel más bajo`, mientras el sistema organiza conjuros por Círculos. **«Castigo del Reino Sombrío»** aumenta en `+2` «duración y daño» sin precisar unidad de duración. | Confirmar denominación/operación prevista antes de automatizar. |
| **ESP-11** | Baja | La fuente conserva erratas, por ejemplo en «Ladrón de almas» (`cada Turno que (necesitas`) y «Visión en la oscuridad» (`Puedes en distinguir`). | Mantener transcripción documental; cualquier corrección requiere revisión editorial independiente. |

## 4. Qué se ha comprobado y qué no

**Comprobado:** integridad nominal con el inventario; ubicación contextual por Especie y sistema; referencias a fuentes y revisiones; separación entre Talentos fijos, elegibles y opcionales; presencia textual de condiciones de elección de Hyrule y Nocturna; identificación literal de indicios de coste, tiempo, magnitud, Tiradas y alcance; falsos solapamientos evidentes entre Talentos homónimos.

**No comprobado / no resuelto:** interpretación de todos los costes y propiedades; exhaustividad de los marcadores automáticos; funcionamiento de cada ventaja con las reglas de creación; equivalencia de «Ocupación derivada»; erratas y ambigüedades; balance; atribución de poderes cruzados; conciliación con el código de Forja. Los documentos son **candidatos para validación**, no un catálogo canónico listo para integrar.

## 5. Próximos pasos

1. **Revisión manual de las 115 fichas**, usando las citas de 03A como índice, para convertir únicamente las propiedades inequívocas en campos normalizados; dejar lo no especificado como `null`.
2. Decisiones editoriales puntuales sobre **ESP-05, ESP-06 y ESP-10**, con prioridad antes de generar datos mecánicos consumibles.
3. Conciliar **ESP-01–04** con la implementación actual y registrar por escrito si hay corrección necesaria o variante intencional.
4. Incorporar referencias cruzadas fiables de Talentos/Conjuros/Poderes en las tandas siguientes.
5. Cuando la revisión de Talentos de Especies termine, pasar a **Tanda 2: Talentos de Ocupaciones**. Mantener separadas la fase de documentación, la validación y los cambios de código.

**Regla de calidad:** ningún hallazgo modifica los manuales, `data/`, `assets/` ni las decisiones editoriales existentes. El plan maestro es [PLAN-DE-TRABAJO.md](PLAN-DE-TRABAJO.md).
