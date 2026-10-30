# Enciclopedia documental · Forja

Documentación de Talentos, Poderes, Conjuros y Objetos de **Naufragio d20**. Este directorio no cambia las reglas ni el funcionamiento del generador.

- **[Plan de trabajo y seguimiento](PLAN-DE-TRABAJO.md)**: fases, tareas pendientes, evidencias y registro de avances.
- [01 — Inventario transversal](01-inventario.md): recuentos, fuentes, lagunas y prioridades.
- [01A — Talentos de Especies](01a-talentos-especies.csv): **115** relaciones nominales, incluidas ausencias frente al JSON.
- [01B — Talentos de Ocupaciones](01b-talentos-ocupaciones.csv): **163** relaciones nominales únicas por Ocupación; conserva el campo JSON de procedencia.
- [02 — Extracción de Talentos de Especies](02-informe-extraccion-especies.md): **115 fichas literales** en tres JSON (DRS/CiFi, Ylat/Hyrule, Nocturna), pendientes de validación.
- [03 — Preclasificación y hallazgos de Talentos de Especies](03-informe-propiedades-especies.md): indicios mecánicos localizables, reglas de adquisición de Hyrule/Nocturna y **11 hallazgos** pendientes de resolución.
- [04 — Acuerdos editoriales de Talentos de Especies](04-acuerdos-editoriales-especies.md): decisiones del autor, estado de aplicación y preguntas abiertas.
- [04B — Textos aprobados de Jiangshi y Gerudo](04b-talentos-especies-aprobados.json): versiones vigentes, posteriores a las extracciones históricas 02*.

**Convenciones:** estar en el JSON ≠ disponer de efecto completo; coincidir con `fichas-documentales.json` por nombre ≠ verificación de identidad mecánica; verificado en una progresión ≠ reglamento completamente extraído. Las diferencias se registran sin corregirlas automáticamente. Los Talentos homónimos deben mantenerse vinculados a su sistema y Especie/Ocupación. La fuente prevalece para la extracción literal, siempre señalando si se trata de DRS, suplemento, documento vivo o decisión editorial.

**Estado actual (2026-10-30):** 115/115 relaciones Especie–Talento cotejadas, 162/162 relaciones provisionales Ocupación–Talento documentadas y 434/434 Conjuros transcritos literalmente. **125 Conjuros con desglose manual**, **309 pendientes de él**, todos preindexados para revisión. Las decisiones editoriales e integración/pruebas de Forja siguen pendientes. **Fuera de alcance:** Dungeon Hack y objetos puramente narrativos.

## Avances posteriores al inventario

- [58 — Cierre documental de Ocupaciones](58-cierre-documental-ocupaciones-y-hallazgos.md): 162/162 relaciones canónicas provisionales; no equivale a prueba de Forja.
- [67 — Eidolas, Equipo y Objetos mágicos](67-cierre-ofrendas-equipo-objetos-magicos.md): 32 Eidolas y 96 modalidades; 22 piezas de Equipo; 28 objetos principales y un ejemplo.
- [68 — Resolución del Elixir de esfuerzo](68-resolucion-elixir-esfuerzo.md): el Elixir **recupera 1 punto de Esfuerzo**, aprobado por el autor.
- [71 — Cierre de extracción literal del Tomo](71-cierre-extraccion-conjuros-y-conciliaciones.md): 434/434 Conjuros cotejados, con incidencias de duplicidad y etiquetas.
- [72a–72e — Desglose manual](72a-desglose-revisado-conjuros-001-025.json): **125/434 fichas**, con [333 fragmentos cotejados](75a-auditoria-desglose-manual-100.json) y [68 referencias adicionales verificadas](75b-auditoria-desglose-manual-101-125.json).
- [73a–73h — Preclasificación de efectos](73a-preindice-mecanico-051-100.json): marcadores y referencias de párrafo para 384 fichas; 75 ya tienen revisión manual. [Control de cobertura 434/434](76a-cobertura-desglose-conjuros-434.json).
- [76b — Discrepancias mecánicas prioritarias](76b-conciliaciones-prioritarias-conjuros.md): incluye incidencias del desglose 101–125, sin correcciones de origen.
- [77c — Geometría y superficies](77c-resumen-geometria-conjuros.md): 65 fichas con cantidades espaciales de superficie/volumen, 10 expresiones de «radio» con unidades de superficie.

**Criterio editorial:** transcripción literal, preclasificación lexical, desglose manual e integración mecánica **son estados diferentes**. No interpretar un marcador textual como una regla ejecutable ni fusionar la PR hasta recibir aprobación.

