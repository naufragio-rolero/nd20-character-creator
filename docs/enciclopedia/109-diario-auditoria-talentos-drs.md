# Forja 1.3.1 — Diario de auditoría y decisiones: Talentos DRS

**Fecha de inicio:** 01/11/2026 (Europa/Madrid)  
**Rama:** `fix/forja-1-3-1-auditoria-herencia-drs`  
**Documento de referencia:** `NaufragioD20DRS.docx`, copia facilitada al proyecto.  
**SHA-256 del DOCX auditado:** `2f3447300e58139ce20c8449e12e5b8d3cd3e7435b2995677ed97c6602a23df8`.  
**Alcance:** 15 vínculos Especie–Talento y 9 Ocupación–Talento del DRS, sin cambios a reglas, elección o progresión.

## Diario de acciones verificables

| Nº | Acción | Evidencia / resultado |
|---|---|---|
| A01 | Comprobar despliegue Forja 1.3 anterior | [GitHub Actions 41251649912](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41251649912): `success`. Incluye filtros de DRS, Chrome, Firefox, WebKit y comprobación pública. |
| A02 | Inspeccionar código publicado, ventanas, motor de reglas y tests | Base `main`: `0ffb92e24cb52188a4fad62cdd7017e7bf015b1e`. Se identificó resolución contextual de Talentos por nombre y propietario. |
| A03 | Leer directamente los párrafos de Talentos del DOCX fuente | Efectos de Especies: 15 párrafos de los perfiles DRS. Efectos de Ocupaciones: 9 párrafos. Las 24 longitudes y sumas de caracteres coinciden con los registros ya publicados. |
| A04 | Crear rama específica aislada | `fix/forja-1-3-1-auditoria-herencia-drs`. |
| A05 | Diferenciar procedencia original y vía de adquisición | `assets/app.js`, commit `9215e79c`. Relaciona `Buen desarrollo`, `Linaje feérico`, `Ira interna` con su Especie fuente exclusivamente cuando se obtienen por `Herencia dual`. |
| A06 | Mostrar la vía de adquisición, sin sustituir origen | `assets/tooltip-ui.js`, commit `16eb5d42`. Nuevo dato contextual `data-glosa-adquisicion`, aislado del texto fuente. |
| A07 | Conservar huellas independientes de los 24 párrafos | `docs/enciclopedia/109a-huellas-talentos-drs.json`, commit `d658dfcf`. SHA-256 por cada descripción y de la copia DOCX original. |
| A08 | Escribir cotejador reproducible con biblioteca estándar | `scripts/cotejar-talentos-drs.py`, commit `5ea0d14c`. Compara nombre, párrafo, metadatos expresos y hash del texto, sin reescribir fuentes. |
| A09 | Añadir controles de huellas a la suite Node | `tests/talentos-drs.js`, commit `3d355ef7`. Detecta cambios al texto original frente a instantánea independiente. |
| A10 | Actualizar prueba de integración y estilo contextual | `tests/smoke.js`, `assets/styles.css`, commits `7272d95f` y `ba889c20`. |
| A11 | Crear pruebas de navegador sobre adquisición heredada | `tests/browser-compatibilidad.js`, commit `b463f90b`. Prueba ambos mestizos con generación real DRS. |
| A12 | Ejecutar las cuatro suites de CI y la comprobación pública | Pendiente de registrar al cerrar este lote. |

## Decisiones editoriales

**DEC-01 — Literalidad del DRS.** Los 24 efectos se mantienen exactamente como en el DOCX original. No se corrigen `destruídos`, `alrrededor`, `Puedes en distinguir` u otras erratas de la fuente dentro de un campo declarado «literal». Cualquier redacción depurada exigirá una versión editorial distinta, con aprobación previa.

**DEC-02 — Origen ≠ adquisición.** El Talento `Buen desarrollo` está documentado en **Humano común**, pero puede obtenerse por **Herencia dual** de Semielfo o Semiorco. `Linaje feérico` está documentado en **Elfo agreste** y `Ira interna` en **Orco común**. La ficha mostrará ambos hechos sin atribuir al mestizo un texto fuente inexistente.

**DEC-03 — No reinterpretar reglas.** `Recuperación` sigue etiquetado como `Pasiva` porque eso dice la fuente, aunque el efecto describa gasto de Esfuerzo. `Brío musculoso` y `Sacrificio de escudo` continúan como alternativas exclusivas del Guerrero. Sin automatización nueva.

**DEC-04 — Referencias inequívocas.** Cuando una ficha de personaje conoce exactamente la Especie/Ocupación original, la consulta del popup usa esa procedencia, sin elegir un homónimo por puntuación aproximada.

**DEC-05 — Seguridad de distribución.** Los nuevos artefactos de auditoría permanecen en `docs/` y `scripts/`; el paquete público sigue incluyendo únicamente `data/talentos-drs-literales.json`, con sus filtros DRS. El despliegue LIVE necesita cuatro suites en verde y SHA validado, sin publicar la raíz.

## Criterios de cierre

- [x] Comprobar resultado de Forja 1.3 LIVE.
- [x] Auditoría directa de 24 efectos contra el original proporcionado.
- [x] Registrar hashes independientes del DOCX fuente.
- [x] Implementar diferencia entre origen y adquisición heredada.
- [ ] Demostrar cuatro suites de CI en verde después de los cambios.
- [ ] Confirmar que la edición pública depurada no incorpora contenido adicional.
- [ ] Fusionar PR y publicar solo una revisión previamente validada.

## Límites

Este cotejo **no prueba** que todos los comportamientos de las reglas estén automatizados. La protección SHA-256 demuestra fidelidad a la copia exacta del DOCX utilizada en esta auditoría, no que dicha copia sea necesariamente la última revisión editorial aprobada. Los Talentos suplementarios permanecen fuera del alcance.
