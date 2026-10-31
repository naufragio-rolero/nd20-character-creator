# Conciliación de fuentes vivas — Talentos de Especies

**Fecha:** 2026-10-28. **Estado:** verificación textual parcial, no validación mecánica del repertorio.

## Comprobación y resultado

- Se cotejaron los **58 registros de Ylat/Hyrule** de `02b` y los **32 de Nocturna** de `02c` con las versiones vivas respectivas, en las pestañas originales de los documentos.
- **13 fichas requieren versión actualizada**, que se ha reextraído literalmente en [05a-fichas-especies-vigentes.json](05a-fichas-especies-vigentes.json), con ID original y revisión de procedencia. **11 corresponden a Ylat/Hyrule y 2 a Nocturna.**
- De las otras 77 fichas, **76 conservan sus párrafos textuales** en el contraste y «Aletas del ciclón» arroja una diferencia de serialización de las celdas de tabla; se ha revisado la tabla (alcance, daño, penetración y durabilidad) y no se ha encontrado una modificación reglamentaria.
- Este cotejo **no cubre las otras 25 fichas del DRS/CiFi** ni sustituye la validación manual de las 115 relaciones.
- `02a`, `02b` y `02c` permanecen como instantáneas históricas, **sin alteraciones**. Las entradas de 05a son textos vigentes de referencia, aún sin normalizar ni implementar.

## Fichas reextraídas

| Fuente | Talento | Especie | Motivo |
|---|---|---|---|
| Ylat/Hyrule | Hálito de energía | Dracónido | Escalado explícito desde Niveles 1–5. |
| Ylat/Hyrule | Visión en la oscuridad | Elfo blanco, Pelaje silvestre, Rusalka costero | Errata corregida (3 fichas). |
| Ylat/Hyrule | Fuente de maná | Elfo celestial, Gnomo sylestri | Se incorpora «Nivel del Círculo» (2 fichas). |
| Ylat/Hyrule | Baja estatura | Gnomo sylestri, Mediano jóbito | +1 a esquivar ataques a distancia (2 fichas). |
| Ylat/Hyrule | Escudo eléctrico | Zora | Radio de 4 metros. |
| Ylat/Hyrule | Estallido escupefuego | Zora (linaje olardiente) | Radio de 2 metros desde el impacto. |
| Ylat/Hyrule | Castigo del Reino Sombrío | Gerudo | +2 al daño de Demonología y Nigromancia, +2 Turnos solo si «Duración: X Turnos»; pérdida de 1 Salud por cada Conjuro lanzado. |
| Nocturna | Ladrón de almas | Jiangshi | Errata corregida en la frase del daño y consumo de almas. |
| Nocturna | Chillido de ultratumba | Jiangshi | Probabilidad 11+; conserva coste, radio y duración. |

## Doble verificación de las decisiones ESP-09/ESP-10

- **ESP-09:** [Nocturna](https://docs.google.com/document/d/15_9raDHK4Cr_LC4YPAmTTYm3K27V06-2-gF8FrmHm28/edit) presenta exactamente la regla aprobada «Tienes una Probabilidad 11+ de que queden paralizadas durante 1d4 Turnos», junto a su radio de 10 m y coste de 1 Punto de Esfuerzo.
- **ESP-10:** [Especies Ylat/Hyrule](https://docs.google.com/document/d/1XmjW6AUwt8Yyl3ZpXp7u73DE5j7jxDxf2rcMVRc8V3s/edit) y [Talentos!H138](https://docs.google.com/spreadsheets/d/1LLFbp7HO8EkC3M1zOEW1is0qvMz-D4n9AulIK2FIEgQ/edit) recogen la condición de duración y contrapartida. No extender la bonificación a Intervalos, horas, efectos permanentes u otras expresiones que no encajen literalmente.

## Asuntos que permanecen abiertos

1. **ESP-02 / Ocupaciones derivadas:** el autor debe clasificar las equivalencias de Ocupaciones en la hoja y determinar los Talentos sustituibles. No inferirlo por similitud.
2. **Validación de 115 efectos:** se mantienen pendientes la normalización completa, la comprobación cruzada de los Talentos homónimos y la revisión mecánica ficha a ficha. Los 13 textos reextraídos **no equivalen a 13 mecánicas aprobadas para ejecución**.
3. **ESP-11 / Errata adicional:** en el documento vivo de Hyrule, «Morador de las profundidades» aún conserva «puedes en distinguir»; corregir editorialmente en origen cuando proceda. No tocar por ello la instantánea.
4. **DRS y suplementos:** posible falta de sincronización de versiones compartidas, pendiente de comparación específica. No asumir que una diferencia con Ylat es una variante deliberada.

**Criterio de cierre:** el plan maestro [PLAN-DE-TRABAJO.md](PLAN-DE-TRABAJO.md) gobierna el estado de tareas. No fusionar PR #3 ni alterar la lógica del generador hasta validar documentación.
