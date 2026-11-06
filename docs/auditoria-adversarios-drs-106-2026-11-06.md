# Auditoría DRS — 106 adversarios (2026-11-06)

## Alcance y fuentes
- Fuente normativa: `NaufragioD20DRS.docx`, sección «Adversarios», 106 fichas. Versión publicada en documento: 1.1.11.
- Base de datos importada: `data/adversarios-drs.json`.
- Hoja maestra: «Lista Criaturas Nd20 — Auditoría y normalización de Talentos»; pestañas `[Table] Criaturas`, `[Table] Talentos`, `[Table] Bridge Criaturas Talentos`, `[Table] Ataques`.
- Distinguir reglas literales de la fuente frente a taxonomías y cálculos auxiliares de la hoja.
- No introducir reglas nuevas. No publicar otros suplementos.

## Resultados verificables
- Exactamente **106/106** fichas cotejadas por nombre con el DRS.
- **182** segmentos de ataque: mismo orden, cantidad, conector `y`/`o` y daño literal que las líneas `Ataques` de los originales. Comparación con `[Table] Ataques`: sin discrepancias estructurales.
- De **179** capacidades catalogadas a **188**, con **9** capacidades expresas recuperadas.
- Las 106 fichas preservan sus encabezados de Nivel, Salud y Moral, así como el contenido completo de las líneas originales.
- La auditoría NO asigna una Moral cuando el DRS no la proporciona. El campo es `null`, nunca una Moral implícita de 12.

## Incidencias: omisiones de importación, verificadas
| ID | Capacidad recuperada | Referencia de la hoja | Resolución |
|---|---|---|---|
| `cara_miseria` | Inmunidad ígnea | `inmunidad_ignea_92` | Descripción → Talento |
| `cara_miseria` | Vómito ácido | `vomito_acido_187` | Descripción → Talento |
| `guiverna_manto_azur` | Inmunidad tóxica | `inmunidad_toxica_93` | Descripción → Talento |
| `guiverna_manto_azur` | Veneno (Nivel 8, dardos) | `veneno_184` | Descripción → Talento |
| `guiverna_ala_bronce` | Inmunidad tóxica | `inmunidad_toxica_93` | Descripción → Talento |
| `guiverna_ala_bronce` | Veneno (Nivel 12, aguijón) | `veneno_183` | Descripción → Talento |
| `tirano_espliego` | Muerto viviente | `muerto_viviente_128` | Descripción → Talento |
| `tirano_espliego` | Lívido | `livido_101` | Descripción → Talento |
| `tirano_espliego` | Relicario (1d4 horas; 1 semana) | `relicario_165` | Descripción → Talento |

**Caso especial:** en `tirano_espliego`, los cuatro resultados de la tabla 1d4 de `Llamada de condenación` estaban en `descripcion`. Se han incorporado a ese Talento literalmente y retirado de la descripción, sin reescribir la tabla.

## Incidencias: clasificación
| ID | DRS literal | Hoja / JSON previo | Resolución |
|---|---|---|---|
| `culebra_rastrera` | Alimaña | Reptil | Categoría `Alimaña` en JSON y hoja |
| `ave_monstruosa` | Monstruo | Bestia | Categoría `Monstruo` en JSON y hoja |

Las subcategorías de ambas provienen de la taxonomía de la hoja; el DRS no incorpora esas subcategorías en la cabecera. Se conservan, **no se atribuyen al DRS**.

## Discrepancias del original frente al catálogo de trabajo
Se habían cambiado las grafías `destruído` → `destruido` en cuatro textos de `origen.textoOriginal`:
- `opresor_sahumado`: Relicario.
- `avatar_elemental`: Espíritu de los elementos.
- `tirano_espliego`: Relicario.
- `catoblepas`: Carga.

Se restaura la grafía literal antigua en el registro fuente y en la capacidad asociada. Es una **modernización ortográfica de la importación**, no una corrección de reglas del DRS. El modelo conserva cualquier otro contenido sin cambios.

## Incidencias propias de Google Sheets
- 29 entradas del DRS carecen de Moral explícita, pero la hoja mostraba el valor auxiliar **12**. Se han vaciado los 29 valores de la columna M de `[Table] Criaturas`, conservando Nivel y Salud.
- La relación `llamada_condenacion_200` + `tirano_espliego` en `[Table] Bridge Criaturas Talentos` duplica semánticamente la variante completa `llamada_condenacion_103`. No confundir «capacidades» con el número de vínculos: la variante `_103` conserva los cuatro resultados. **Pendiente confirmar la eliminación efectiva en la hoja**, pues algunas peticiones de limpieza devolvieron éxito sin cambiar la celda.

## Regresión y criterios de liberación
- `tests/adversarios-drs.js` ahora exige 106 fichas, 182 ataques y 188 Talentos; coteja encabezados, cantidades/conectores y el contenido de cada línea documental.
- Prueba específica de las cuatro fichas reparadas y de la tabla de invocaciones.
- **Antes de LIVE:** ejecutar las pruebas de catálogo, PDF, navegador y paquete público; verificar CI de la PR y generar paquete DRS sin DLC; comprobar el SHA que realmente usa la publicación. `forja-live.yml` utiliza un checkout de SHA fijado, por lo que merge a `main` NO publica esta revisión automáticamente.
- Hasta cumplir esos puntos, **LIVE no debe anunciarse actualizado**.
