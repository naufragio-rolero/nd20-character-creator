# Conjuros: cuestiones editoriales antes de integrar efectos en Forja

**Fecha:** 30 de octubre de 2026. **Estado:** observaciones documentales, no correcciones aprobadas. **Fuentes:** Tomo de Magia alfabético (lotes [69a](69a-conjuros-alfabeticos-001-025.json), [69b](69b-conjuros-alfabeticos-026-050.json), [69c](69c-conjuros-alfabeticos-051-075.json) y [69d](69d-conjuros-alfabeticos-076-100.json)), y sus [desgloses revisados 72a–72d](72a-desglose-revisado-conjuros-001-025.json). Las transcripciones históricas permanecen intactas.

## A. Decisiones que alteran un resultado reglamentario

| ID | Conjuro (ordinal) | Texto fuente o contraste | Qué falta decidir |
|---|---|---|---|
| **CONJ-M01** | **Convergencia vital de Olphegor (96)** | La Salud **actual del objetivo** se iguala a la Salud **máxima del lanzador**; si el cambio aumenta la Salud, el lanzador sufre daño impío igual a la diferencia. La última frase dice que **si el objetivo tiene menos Salud que el lanzador, este no sufre daño**. | En algunos estados de Salud, las dos condiciones dan resultados contradictorios. Determinar la condición correcta de daño sin reescribir la transcripción. |
| **CONJ-M02** | **Cataclismo tenebroso (84)** | Tras la Tirada de Conjuro que causa **20d10 de daño impío** (o la mitad al fallarla), el texto exige una **Tirada de Resistencia a los PJ afectados**. | Definir qué cambia si superan o fallan esa Tirada; no añadir otra reducción de daño o muerte automática sin fuente. |
| **CONJ-M03** | **Cúpula antimagia (90)** y otros 9 Conjuros | «radio de **3m2** a tu alrededor», a la vez que especifica que permanece **fija**, aunque el Alcance del Conjuro figure como «personal». [La auditoría transversal](77c-resumen-geometria-conjuros.md) encuentra **10 Conjuros** que usan «radio» con unidades de superficie. | Aclarar superficie, radio y geometría en estos casos, sin inventar dimensiones. |
| **CONJ-M04** | **Escalado por Niveles**: Curación (70), Corona de Ylathia (65), Corromper conjuro elemental (67), Controlar los vientos (62), Arca de éter (28), Alzar esqueleto secuaz (13) | «por cada 5 Niveles», «por cada 3 de tus Niveles», «la mitad de tu Nivel» y «3 personas por cada 5 de tus Niveles» sin indicar redondeo; en algunos casos falta mínimo explícito. | Decidir redondeo y mínimo cuando la regla general del DRS no resuelva cada operación. No asumir **cero dados** en los Niveles iniciales. |
| **CONJ-M05** | **Cadena de relámpagos (59)** | Después de causar 1d8 de daño por Nivel al objetivo principal, salta a 1d4 objetivos y causa «la mitad de daño **en cada salto**». | Determinar si cada salto causa la mitad del daño inicial o la mitad del salto anterior. |
| **CONJ-M06** | **Aura de resguardo (40)** | El afectado obtiene «un **+2 a las Tiradas para evitar ataques y Blindaje**». | Aclarar si +2 aumenta la Tirada de Blindaje, el valor de Blindaje o si hay otra lectura. |
| **CONJ-M07** | **Aro de llamas abrasadoras (33)** | Describe un círculo de llamas «**entre 6 y 18 metros de radio**». | Aclarar quién elige el radio y cuándo. Por ahora se conserva el intervalo literal. |

## B. Controles que ya pueden aplicarse sin nueva regla

- **Calentar metal (68):** la tabla distingue **Turno 1 sin daño; Turno 2: 1d6; Turnos 3–4: 2d6; Turno 5: 1d6; Turno 6 sin daño**; sólo si el objetivo mantiene las piezas metálicas. No convertirla en daño plano por Turno.
- **Bola de fuego (53):** el texto prevé **mitad del daño si se falla la Tirada de Conjuro**; no equipararlo al Dardo ígneo (98), que sólo indica daño en éxito.
- **Aliento de Lenseng (8):** respirar bajo el agua impide respirar aire con normalidad durante el efecto.
- **Ancla sombría (22):** el daño se inflige **en el primer Turno**, no continuamente.
- **Carcajadas infames de Hstet (93):** la Tirada de Conjuro inicial y las de mantenimiento tienen momentos distintos; hay Desventaja en el mantenimiento provocado por recibir daño.
- **Bomba escarlata (55):** la exclusión de objetivos designados se refiere al **disparador** de la bomba, pero no concede expresamente inmunidad al daño.
- **Bendición (49):** sus **PB** son Puntos de Bendición, distintos de los Puntos de Brujería usados por el Brujo. Etiquetar el recurso con el Conjuro de procedencia al estructurarlo.
- **Resistencia elemental (32, 48, 80):** el texto no ofrece aquí un valor numérico de reducción; no codificar mitad del daño sin cotejar una regla general aplicable del DRS.
- **Áreas expresadas en m²** (24, 51, 58, 60, 69, 74, 78, 82, 83, 85, 94): conservar unidades originales, sin convertirlas en radios o metros cúbicos.

## C. Pendientes anteriores, sin resolver

Se mantienen **CONJ-01 a CONJ-06** del [cierre anterior](71-cierre-extraccion-conjuros-y-conciliaciones.md): duplicados de Arma elemental e Ira celestial entre fuentes, Círculo omitido en Contrato de fraternidad, signo † de Glosolalia mayor y diferencias de etiquetas. Las diferencias entre distintas fuentes **no deben resolverse suprimiendo filas del catálogo automáticamente**.

## D. Estado de verificación

- **434/434** Conjuros transcritos y cotejados contra Google Docs, sin diferencias literales.
- **100/434** Conjuros desglosados manualmente con fragmentos reglamentarios y advertencias, [auditoría de 333 fragmentos](75a-auditoria-desglose-manual-100.json).
- **334** Conjuros aún pendientes de desglose manual, pero ya preclasificados en [ocho lotes 73a–73h](73a-preindice-mecanico-051-100.json), [auditados](74a-auditoria-preindice-051-250.json) por referencias y marcas literales.
- [Cobertura consolidada](76a-cobertura-desglose-conjuros-434.json). La preclasificación por palabras **no** convierte esos 334 en fichas mecánicamente verificadas.

**Se puede continuar con 101–125 sin resolver estas cuestiones.** La implementación y sus pruebas en Forja siguen fuera del alcance de esta PR hasta aprobación.

**Nota de control:** el recuento espacial de la auditoría inicial se corrigió tras detectar que el superíndice ² quedaba fuera del patrón de búsqueda. La [auditoría vigente](77c-resumen-geometria-conjuros.md) registra 65 fichas con magnitudes espaciales y 10 mezclas de radio y superficie.
