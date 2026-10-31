# Forja 1.3 — Talentos del DRS: textos literales y ventanas compactas

**Fuente primaria:** `NaufragioD20DRS.docx`. **Alcance:** 15 relaciones Especie–Talento y 9 relaciones Ocupación–Talento; no se publica ni normaliza ningún Talento suplementario.

## Implementación

- [x] Catálogo `data/talentos-drs-literales.json`: 24 efectos cotejados con referencias a los párrafos del DRS; preserva redacción y erratas de la fuente.
- [x] Claves estables por propietario, grupo y Talento. Dos `Herencia dual` distintos; `Visión en la oscuridad` y `Baja estatura` no pierden el contexto de la Especie.
- [x] Identidad de procedencia desde `personaje.descripcion` en la ficha, sin modificar el motor reglamentario ni los resultados de generación.
- [x] Interfaz rápida: cabecera **Talento** y **Especie/Ocupación · propietario**, campos de Activación, Atributo y Coste solo si figuran expresamente etiquetados en la fuente, efecto original íntegro y procedencia/fuente.
- [x] Detalle documental (párrafos de referencia) exclusivamente con **Mostrar detalles técnicos**. Con este ajuste desactivado no ocupa espacio ni se incluye en el árbol de accesibilidad.
- [x] Catálogo incluido mediante lista blanca en `dist/public-drs` y verificado en pruebas de datos y navegación.
- [x] El talento **Recuperación** mantiene «Pasiva» como activación original, aunque su efecto describa un gasto y una recuperación. No se reinterpreta automáticamente el coste del efecto.
- [x] `Brío musculoso` y `Sacrificio de escudo` siguen siendo elecciones mutuamente excluyentes por las reglas existentes.

## Límites editoriales

Este lote **no normaliza mecánicamente** los Talentos ni automatiza sus efectos. Los Talentos de CiFi, Nocturna y fantasía ampliada permanecen en su estado documental anterior. Las dos formas de `Visión en la oscuridad` difieren en una errata del DRS: se conserva en las fichas literales sin confundirla con una nueva regla.

## Siguientes pasos

- [ ] Cotejar los 24 efectos con decisiones editoriales posteriores al DRS, antes de corregir erratas o publicar una edición no literal.
- [ ] Estudiar activación, costes y condiciones descritos en la prosa como **datos normalizados independientes**, sujetos a aprobación.
- [ ] Revisar la selección y visualización de los Talentos heredados mediante **Herencia dual**, sin cambiar las alternativas.
- [ ] Completar el mismo formato para los Talentos suplementarios solo después de cerrar ESP/OCP y la validación mecánica.
- [ ] Mantener pruebas de determinismo, selector múltiple, popup, accesibilidad y ausencia de DLC en el despliegue público.
