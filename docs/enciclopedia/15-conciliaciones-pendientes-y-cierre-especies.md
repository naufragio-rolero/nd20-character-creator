# Cierre de validación documental de Especies y conciliaciones pendientes

**Fecha:** 2026-10-29. **Resultado:** 115/115 relaciones Especie–Talento cotejadas documentalmente en los lotes 1–9. La validación verifica contenido y procedencia, no ejecución de efectos en Forja. No se fusiona la PR ni se altera el generador.

## Resolución documental final

**Aletas del ciclón (Zora):** la aparente discrepancia entre la extracción y Google Docs se debía a una tabla cuyos elementos se devuelven como párrafos separados. Reconstruidas las tres filas de cinco columnas, el texto completo coincide **exactamente** con la extracción histórica. [Evidencia y tabla](14a-validacion-documental-especies-lote-9.json).

## Conciliaciones editoriales que siguen abiertas

1. **Origen de Especies, Ocupaciones y Poderes en Forja.** Definir etiquetas de procedencia y precedencia de fuentes (DRS, CiFi, Nocturna, Ylat, Hyrule y ampliaciones), distinguiendo publicación, variante y dependencia; no inferir la fuente a partir del nombre.
2. **Ocupaciones derivadas en Talentos opcionales de Hyrule.** Aletas del ciclón exige Guerrero/Ladrón o derivadas; Morador de las profundidades exige Clérigo/Mago o derivadas. Falta definir qué cuenta como «derivada» y qué Talento de Ocupación «define» la Ocupación y no puede sustituirse. No bloquear ni permitir opciones por suposición.
3. **Herencia dual por Especie.** Semielfo elige Buen desarrollo o Linaje feérico; Semiorco elige Buen desarrollo o Ira interna. Los dos Talentos homónimos requieren identificadores contextuales y elecciones explícitas, no una ficha global indiferenciada.
4. **Vínculo psiónico de Sylph mindari.** El efecto cambia entre Psion (+2 Ímpetu) y otras Ocupaciones (elegir Poder Psiónico, coste 1 Esfuerzo). La selección debe vincularse al catálogo oficial de Poderes Psiónicos.
5. **Erratas textuales de Visión en la oscuridad y Morador de las profundidades.** En DRS/CiFi hay construcciones «puedes en distinguir» y «alrrededor»; en Ylat «Morador de las profundidades» mantiene «puedes en distinguir». Son erratas de redacción, no cambios mecánicos; requieren autorización antes de corregir fuentes.
6. **Textos vivos frente a instantáneas.** Los 13 registros reextraídos en `05a-fichas-especies-vigentes.json` prevalecen como lectura vigente, pero los archivos `02*` son históricos y deben conservarse. Asegurar que la futura integración use el texto vigente y la revisión documentada.
7. **Alcance de reglas complejas de Nocturna.** Licantropía, Corantropía, Sino de los condenados, Ladrón de almas, Vestigios de Sylestria y Naturaleza mutable tienen múltiples condiciones y recursos. Su cotejo textual está cerrado, pero deben desglosarse en opciones, costes, recursos y efectos antes de afirmar que están implementados.

## Siguiente fase recomendada

Iniciar la extracción y validación de las **163 relaciones Ocupación–Talento** inventariadas, mientras se documenta por separado el esquema de orígenes para Forja. Mantener esta lista de conciliaciones como bloqueante de la implementación de reglas dependientes, no de la documentación.
