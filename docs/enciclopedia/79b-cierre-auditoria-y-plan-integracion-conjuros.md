# Cierre del desglose documental de los 434 Conjuros y preparación de integración en Forja

**Fecha:** 30 de octubre de 2026. **Rama:** `docs/enciclopedia-inventario-2026-10-28`. **Estado:** auditoría documental cerrada; integración de efectos pendiente.

## 1. Cobertura cerrada

- **434/434 fichas** del Tomo de Magia cotejadas y desglosadas manualmente.
- **18 transcripciones literales** en [69a–69r](69a-conjuros-alfabeticos-001-025.json), preservadas sin modificaciones.
- **18 desgloses editoriales** en [72a–72r](72a-desglose-revisado-conjuros-001-025.json).
- **333 fragmentos de texto** de las primeras 100 fichas verificados dentro de sus originales y **619 índices de párrafos** de las restantes 334 fichas comprobados; ninguna discrepancia estructural en [79a](79a-auditoria-transversal-desglose-conjuros-434.json).
- **10 correcciones geométricas aprobadas** en [78a](78a-correcciones-geometria-conjuros-10.json) con prueba de integridad [78b](78b-auditoria-correcciones-geometria.json); **seis propuestas adicionales** aún no aprobadas en [77d](77d-segunda-pasada-erratas-geométricas.json).

La revisión confirma la procedencia y permite estudiar los efectos por Conjuro. **No certifica que todas las reglas sean inequívocas ni que estén implementadas en Forja.**

## 2. Cuestiones que bloquean una integración automática sin interpretación

- **Identidad de registros:** los dos `Arma elemental` literales y los dos `Ira celestial` del catálogo no deben fusionarse por coincidencia de nombre; hay una ficha de `Contrato de fraternidad` sin Círculo explícito en el Tomo. [71](71-cierre-extraccion-conjuros-y-conciliaciones.md).
- **Geometría y Alcances:** contrastar [77c](77c-resumen-geometria-conjuros.md) y [77d](77d-segunda-pasada-erratas-geométricas.json). No calcular radios desde superficies sin decisión.
- **Fórmulas y recursos:** redondeos por Nivel, consumo alternativo de recursos, cantidades de daño o Blindaje omitidas y términos incompletos deben seguir señalados, no completarse con reglas inventadas.
- **Estados, disparadores y excepciones:** Tirada de Conjuro por objetivo, al inicio del Turno o por impacto no son equivalentes. Conservamos las condiciones textuales de éxito, fallo y mantenimiento.
- **Invocaciones y criaturas:** no generar bloques de estadísticas inexistentes ni prometer resolución automática.
- **Casos de arbitrio del Cronista:** no sustituir decisiones narrativas ni excepciones declaradas por operaciones automáticas.

El registro de incidencias y ejemplos concretos permanece en [76b](76b-conciliaciones-prioritarias-conjuros.md).

## 3. Secuencia propuesta para integrar en el generador

1. **Conciliar identidades y decisiones editoriales:** elaborar un conjunto aprobado de excepciones; mantener las fichas originales y la procedencia.
2. **Definir fichas de presentación por identificador estable:** vincular los registros del Tomo a `data/catalogo-poderes.json` sin depender solo de los nombres ni sobrescribir los identificadores ya usados en Forja.
3. **Incorporar la descripción aprobada a la interfaz:** mostrar Círculo, Escuela, Alcance, Duración, requisitos, etiquetas y efecto literal/revisado, distinguiendo información documental de reglas automáticas.
4. **Automatizar solo operaciones inequívocas:** selección y límites de Conjuros conocidos/preparados, requisitos por Círculo/Escuela y demás capacidades que el generador ya soporte. Las mecánicas no resueltas quedan explicadas, no simuladas.
5. **Probar:** cobertura de 434 fichas, correspondencia de identidad, coexistencia de homónimos, condiciones de adquisición y preparación, texto y procedencia de la ficha mostrada, casos de geometría y regresiones de Fantasía/CiFi/Nocturna/Dungeon Hack.

## 4. Restricciones de ejecución

Forja es un **generador estático compatible con GitHub Pages**, según el README del repositorio. La fase de auditoría no modificó el motor, los datos publicados del generador ni los documentos maestros de Google Drive.

**Próximo trabajo técnico:** convertir este material revisado en fichas que se puedan consultar en Forja, primero sin inventar mecánicas, y abordar la ejecución automática solo tras aprobar las decisiones editoriales pertinentes.
