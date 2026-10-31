# Cierre de auditoría documental — 434 Conjuros

**Fecha:** 30 de octubre de 2026. **Alcance:** Tomo de Magia ordenado alfabéticamente y cotejos documentales del catálogo de Forja. **Estado:** auditoría documental cerrada; integración mecánica en Forja **pendiente**.

## 1. Cobertura comprobada

- **434/434** fichas originales conservadas en los 18 lotes de transcripción literal [69a–69r](69a-conjuros-alfabeticos-001-025.json), previamente cotejadas con su revisión fuente (70b).
- **434/434** fichas con desglose documental en **18 lotes [72a–72r](72a-desglose-revisado-conjuros-001-025.json)**, con advertencias de integración, índices o fragmentos reglamentarios y referencias de origen.
- Auditorías de cada tramo en **[75a–75o](75a-auditoria-desglose-manual-100.json)**: 100 fichas en la primera y los tramos 101–434 en las restantes; errores documentados: **0**.
- [76a — Cobertura consolidada](76a-cobertura-desglose-conjuros-434.json): 434 revisadas, 384 asimismo preclasificadas automáticamente, 0 solo preclasificadas pendientes. Se mantienen los 50 primeros registros sin preíndice léxico porque están ya desglosados.
- Comprobación adicional de integridad realizada en este cierre: 434 identidades consecutivas, nombres y referencias de procedencia cotejados entre los 18 lotes 69 y los 18 lotes 72; **ningún error detectado**. Esto no es una prueba funcional de reglas.

## 2. Geometría y correcciones

- [77a–77c](77c-resumen-geometria-conjuros.md) localizan **65 fichas** y **69 menciones** expresas de superficie o volumen.
- Diez usos de «radio» con unidades de superficie tienen una **redacción editorial corregida** en [78a](78a-correcciones-geometria-conjuros-10.json), sin cambiar áreas, efectos, daño o tiradas. La [auditoría 78b](78b-auditoria-correcciones-geometria.json) verificó las sustituciones.
- Hay **seis erratas adicionales propuestas, no aprobadas**, documentadas en [77d](77d-segunda-pasada-erratas-geométricas.json). No convertir automáticamente áreas en radios o volúmenes.
- Permanecen sin resolver interacciones entre Alcance y superficie de Diluvio universal (108), Tromba de meteoritos (393) y centro del seísmo de Terremoto (409).

## 3. Cuestiones mecánicas que bloquean una automatización fiel

Las decisiones pendientes y los controles detallados están en [76b](76b-conciliaciones-prioritarias-conjuros.md). Entre los ejemplos que requieren un dictamen editorial antes de automatizar:

- **Revelar objeto maravilloso (356):** «Lanzamiento: 1 Intervalo» frente al trance de ocho horas.
- **Sifón de recuerdos (380):** alcance literal en pies y equivalencia textual; no corregir automáticamente escalados.
- **Surcar la tierra (385):** límite de volumen de 4 m³ y ejemplo de excavación que requiere aclaración.
- **Tromba de meteoritos (393):** cuatro Tiradas independientes y un solo impacto por criatura, aunque los centros de impacto puedan solaparse; el Alcance «2km2» no determina distancia.
- **Trocar tamaño (401):** los porcentajes y máximos están definidos, pero falta límite mínimo inequívoco para la reducción.
- **Telequinesis (406):** escalados por grupos de Niveles sin redondeo explícito.
- **Yugo de la muerte viviente (433):** Nivel 12 pertenece literalmente a las bandas «12 o inferior» y «12 o superior»; el solapamiento debe resolverse.
- **Zona onírica (434):** mezcla «m² por Nivel» con «diámetro»; su redacción alternativa continúa en 77d sin aprobación.

## 4. Límites del cierre

**Cerrado:** extracción, desglose documental, cotejo de identidad, índices de párrafo y registro de incidencias de las 434 fichas.

**No cerrado:** resolución de todas las incidencias reglamentarias, aprobación de las seis erratas adicionales, producción de fichas mecánicas ejecutables, pruebas automatizadas y publicación del generador completo.

La revisión documental no acredita que un Conjuro sea implementable automáticamente ni autoriza interpretar una ambigüedad a favor de una regla nueva. En Forja debe conservarse la procedencia, permitir descripción textual cuando falte decisión y comprobar cada efecto con pruebas de éxito/fallo, objetivos, daño, duración, geometría y escalado.

Las transcripciones históricas 69a–69r y los documentos maestros de Google Drive permanecen **sin editar**. Las correcciones aprobadas están en una capa editorial separada. No fusionar esta PR sin revisar el alcance e integrar los controles pertinentes.
