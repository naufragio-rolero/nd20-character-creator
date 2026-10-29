# Cierre de la extracción documental de Ocupaciones — 29/10/2026

**Estado: 162/162 relaciones canónicas provisionales Ocupación–Talento con texto extraído y trazable. No equivale a integración ni pruebas de Forja.**

## 1. Recuento conciliado

- CSV original: 163 relaciones de 51 Ocupaciones.
- OCP-05, aprobada por el autor: **Estilos de gladiatoria** se clasifica como **Poder**, no Talento.
- Inventario canónico provisional: **162 relaciones**; **162 transcritas**, **0 pendientes de extracción**.
- **Ampliadas 81/81**, **DRS 9/9**, **CiFi 15/15**, **Nocturna 57/57**. Referencia: [auditoría de identidades](57a-auditoria-cierre-162-talentos-ocupaciones.json).
- **Nocturna 57/57:** los textos de efectos coinciden con la fuente viva, con normalización exclusiva de espacios, sin discrepancias. [Validación literal](57b-validacion-literal-nocturna-57.json). Los títulos repetidos en las tablas de progreso no originan Talentos adicionales.

### Extracciones de Talentos incorporadas desde el cierre anterior

- [Druida + Lardeur, fuente viva](49a-druida-lardeur-fuente-viva.json), con tabla *Haute cuisine*.
- [Derviche, fuente viva](49b-derviche-fuente-viva.json), con tabla de Técnicas.
- [DRS 9](50a-talentos-drs-literal.json) y [CiFi 15](50b-talentos-cifi-literal.json).
- Nocturna: [Arcanista](53a-nocturna-arcanista-8-talentos.json), [Cazador de monstruos](53b-nocturna-cazador-monstruos-7-talentos.json), [Delincuente](55a-nocturna-delincuente-7-talentos.json), [Espiritista](55b-nocturna-espiritista-7-talentos.json), [Investigador](56a-nocturna-investigador-7-talentos.json), [Mercenario](56b-nocturna-mercenario-7-talentos.json), [Operador](56c-nocturna-operador-7-talentos.json), [Pícaro](56d-nocturna-picaro-7-talentos.json).

## 2. Poderes, Compañeros y Equipo complementarios

Se han documentado de forma independiente de los Talentos:

| Categoría | Inventario adicional |
|---|---|
| [Flechería arcana del Celador](38a-flecheria-arcana-celador.json) | 14 Poderes |
| [Privilegios del Forense](38b-privilegios-forense.json) | 6 Poderes |
| [Canciones del Bardo](40a-canciones-bardo-24-poderes.json) | 24 Poderes |
| [Marionetas](39a-marionetas-componentes-y-habilidades.json) | 18 componentes y 6 habilidades especiales |
| [Bestias del Cazador](41a-bestias-cazador-tabla-completa.json) | 24 fichas-base |
| [Explosivos del Dinamitero](42a-explosivos-dinamitero-32.json) | 32 equipos consumibles |
| [Nuevos Conjuros](43a-conjuros-nuevos-demonologia.json) | 2 Conjuros de Demonología |
| [Nuevas Técnicas](44a-tecnicas-batalla-nuevas-10.json) | 10 Técnicas |
| [Índice de Eidolas](45a-indice-eidolas-32-y-afinidades.json) | 32 Eidolas |
| [Modalidades de Eidolas](46a-eidolas-categoria-1-parte-1.json), [continuación](46b-eidolas-categoria-1-parte-2.json), [Categoría 2](47a-eidolas-categoria-2-parte-1.json), [continuación](47b-eidolas-categoria-2-parte-2.json) | Encarnar, Canalizar y Materializar de **16 Eidolas**; no incluye todavía narrativa completa ni ofrendas |

Las cifras de categorías son inventarios independientes; no sumarlas como «Talentos» ni asumir que son elementos únicos frente a catálogos previos sin conciliación.

## 3. Hallazgos editoriales nuevos

- **OCP-17:** *Atemorizar plebeyo* (Forense), progresión del Nivel de los PNJ ambiguamente descrita.
- **OCP-18:** *Portal sombrío* permite atravesar a «nictomantes» pero dice «nigromantes» en la exención del daño.
- **OCP-19:** *Danza aérea*, número de ataques depende de una «Tirada de requisito» que no aparece definida con claridad.
- **OCP-20:** *Corte fantasma*, la consecuencia al fallar dice «causas tanto daño físico como tu Nivel», sin destinatario explícito.
- **OCP-21:** **Velunion** (Eidolon) tiene afinidad **Agua** en tabla y **Ninguno** en ficha.
- **OCP-22:** **Maia** (Eidolon) tiene una distancia incompleta: «estén a metros o menos de ti».
- **OCP-23:** Psion denomina recurso «Puntos de Ímpetu (PI)» y después se refiere a «PP».
- **OCP-24:** *Cadena de los hados* y *Destino entrelazado* (Espiritista) emplean «10m2», cuya geometría no está especificada.
- **OCP-25:** La ficha del **Espiritista** conserva dos referencias a «Médium» (posible nombre anterior).
- **OCP-26:** *Homebrew*, *Interacción remota* y *Sabotaje electromagnético* (Operador) emplean «5m2», «20m2» y «10m2». No convertir automáticamente a radios lineales.
- **OCP-27:** *El precio justo* (Pícaro) figura como **Pasiva** y simultáneamente **Coste: 1 Punto de Esfuerzo**.

Las discrepancias anteriores (OCP-06 a OCP-16) se conservan en [seguimiento](32-seguimiento-lotes-5-y-6.md), [nota Diletante](36-incidencia-diletante.md) y [plan maestro](PLAN-DE-TRABAJO.md). **Ninguna corrección se ha impuesto al texto fuente sin decisión editorial.**

## 4. Próxima etapa, sin tocar Forja

1. Conciliar editorialmente las contradicciones que afecten a cálculo de Niveles, recursos, áreas o destinatarios de daños.
2. Completar las **16 Eidolas de Categorías 3 y 4**, y el trasfondo/ofrendas de las 32.
3. Comparar este catálogo suplementario de Poderes/Conjuros/Equipo con los inventarios ya existentes para impedir duplicados; seguir extracción completa de las restantes categorías.
4. Formalizar los modelos de elección condicional y las tablas de progreso de Nocturna; realizar validación mecánica y pruebas de Forja **sólo tras revisión editorial e integración autorizada**.

**Seguridad de la rama:** sin cambios a la lógica de Forja, sin fusión de PR, instantáneas históricas preservadas.
