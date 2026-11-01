# Talentos DRS — Resolución de los ocho asuntos mecánicos

**Fecha de revisión y ratificación:** 01/11/2026 · **Estado:** **ocho asuntos conciliados**: seis se resuelven desde el DRS o pruebas existentes y dos quedan cerrados mediante aclaración expresa de autoría.  
**Fuente primaria:** `NaufragioD20DRS.docx`, párrafos del documento indicados en cada entrada.  
**Documentos previos:** [informe 110](110-informe-propiedades-talentos-drs.md), [transcripción literal](../../data/talentos-drs-literales.json), [índice de evidencias](110a-propiedades-literales-drs.json).

## Principio editorial

Separar tres planos: **regla literal** (lo escrito), **registro estructurado** (cómo señalarla sin cambiarla) y **automatización** (solo cuando hay procedimiento suficientemente especificado). Se mantienen las etiquetas del DRS aunque parezcan atípicas. No se crea ninguna nueva tirada, activación, frecuencia ni coste.

## Asuntos y acuerdos documentales

### ESP-DRS-01 — Corpulencia (Enano montañés) · Resuelto documentalmente

**Fuente:** §§119–120 y regla de Tirada de Blindaje, §616. Movimiento 5 ya calculado (§117).  
**Regla:** al realizar una Tirada de Blindaje destinada a reducir daño físico, se puede gastar **1 Punto de Esfuerzo para repetirla**. No se establece coste de Acción, ni categoría formal de activación, ni límite de repeticiones en la descripción.  
**Registro:** `condicion: Tirada de Blindaje para reducir daño físico`, `gasto: 1 Punto de Esfuerzo`, `efecto: repetir la tirada`. Las etiquetas son descriptivas; no se añade una tirada distinta de Blindaje.  
**Implementación:** la Forja mantiene la descripción y el valor de Movimiento; una futura interfaz de combate tendrá que detectar la tirada que ya existe, no crear otra. No se fija «una vez por turno» ni «una vez por ataque» porque el DRS no lo dice.

### ESP-DRS-02 — ¡Sálvese quien pueda! (Mediano amable) · Aclaración autoral aprobada

**Fuente:** §§140–141; Estado Miedo, §643; Estado Parálisis, §646.  
**Regla:** frente a Miedo o Parálisis, gastar **1 Punto de Esfuerzo y una Acción** permite liberarse sin Tirada.  
**Tensión real:** Miedo obliga a emplear la Acción para alejarse, y Parálisis puede impedir toda actuación ese Turno. El DRS **no especifica** si el Talento permite usar esa Acción ignorando esas restricciones.  
**Decisión autoral aprobada (01/11/2026):** el propósito específico del Talento es poder librarse de estos Estados lesivos incluso cuando normalmente sería muy difícil o imposible hacerlo. Por tanto, el Mediano **puede emplear una Acción y gastar 1 Punto de Esfuerzo** para liberarse de Parálisis o Miedo, aunque las restricciones del Estado le impidieran actuar o le obligaran a huir. No necesita Tirada, no recibe una Acción adicional y el Talento no se reclasifica como Reacción ni como Pasiva. Esta interpretación se distingue expresamente de la prosa literal del DRS.

### ESP-DRS-03 — Ánimo (Semielfo) · Resuelto documentalmente

**Fuente:** §§171–172.  
**Regla:** **una vez al día**, un aliado capaz de escuchar al Semielfo recibe **+2 a una Tirada de Atributo**, siempre que el uso se declare **antes** de la tirada.  
**Registro:** frecuencia 1/día, objetivo aliado, condición auditiva, momento anterior a Tirada, bonificación +2. No hay Coste de Esfuerzo, Acción ni Tirada de activación especificados. **No se incorporan costes por omisión.**

### OCP-DRS-01 — Recuperación (Guerrero) · Resuelto documentalmente

**Fuente:** §§284–286.  
**Regla:** la etiqueta formal es **Pasiva**, no Acción. Incluye dos efectos distintos: (a) tras un combate, se puede gastar **1 Punto de Esfuerzo** y dedicar **1 Intervalo** para recuperar **1d8 Puntos de Salud**; (b) Ventaja en Tiradas de Resistencia para regenerar el Esfuerzo gastado.  
**Registro:** mantener `activacion_literal: Pasiva`; registrar el gasto en la parte condicional (a) y la Ventaja persistente (b) por separado. No crear un nuevo Coste formal en la ficha literal ni convertir el Intervalo en Turnos.

### OCP-DRS-02 — Expulsar muertos vivientes (Clérigo) · Aclaración autoral aprobada

**Fuente:** §§208–212; Tiradas de Probabilidad, §§547–548; definición de Intervalo, §585.  
**Regla expresa:** Activación **Acción**, Atributo **Intuición**, Coste **1 Punto de Esfuerzo**, radio **18 metros**. Los muertos vivientes de Nivel igual o inferior al del Clérigo tienen **Probabilidad 15+** de resultar destruidos. Quienes soportan la expulsión se alejan durante **1 Intervalo o 6 Turnos**, o hasta perder al Clérigo de vista (lo que suceda antes). Probabilidad 15+ significa comparar **1d20 con 15+** según la regla general, sin que el propio Talento indique una Tirada adicional de Intuición.

**Vacíos de procedimiento:** no se aclara de forma literal (a) si se comprueba una Probabilidad por cada objetivo o una sola para todos; (b) a quién corresponde la tirada; (c) si los muertos vivientes de Nivel superior también deben huir aunque no puedan ser destruidos; ni (d) cuándo corresponde elegir Intervalo frente a 6 Turnos.

**Decisión autoral aprobada (01/11/2026):** como regla general, el **jugador del Clérigo** efectúa **una Tirada de Probabilidad 15+ por cada muerto viviente afectado**. Cuando haya varios enemigos idénticos y resulte práctico agruparlos, **puede efectuarse una sola Tirada por grupo de criaturas idénticas**, aplicando el mismo resultado a todos sus miembros. **Ejemplo aprobado:** tres zombis y dos esqueletos se resuelven mediante **dos Tiradas**, una para los tres zombis y otra para los dos esqueletos. No se introduce ningún umbral numérico obligatorio a partir del cual haya que agrupar. No se agrupan criaturas distintas entre sí.

**Resto del procedimiento, conservado de la propuesta anterior:** el Talento distingue los enemigos de Nivel igual o inferior al Clérigo; no se extiende por deducción a los de Nivel superior. Los supervivientes de la expulsión se alejan. Se conserva la equivalencia textual **1 Intervalo o 6 Turnos** y la terminación anticipada al perder de vista al Clérigo; usar Turnos en combate e Intervalo fuera es un criterio operativo de lectura, **no una nueva duración textual**. **No se añade una Tirada separada de Intuición:** `Atributo: Intuición` permanece como metadato original de la ficha y la comprobación exigida expresamente es de Probabilidad 15+. La regla de agrupación y la excepción de ¡Sálvese quien pueda! son aclaraciones autorales; los detalles no citados de forma expresa se presentan como criterios de aplicación, sin atribuir frases nuevas al DRS.

### OCP-DRS-03 — Sacrificio de escudo (Guerrero) · Resuelto documentalmente

**Fuente:** §§292–294, Durabilidad §§421–423 y evitar ataques §§699–702.  
**Regla:** Reacción frente al fallo de Bloqueo o Esquiva, requiere un escudo equipado y sustituye la Tirada de Blindaje por la anulación de todo el daño. El escudo **normal se destruye**; el **mágico queda con Durabilidad 0**.  
**Registro de equipo futuro:** deben poder distinguirse `destruido` (normal) e `inutilizable/pendiente de reparación` (mágico); el DRS explica que los objetos mágicos sin Durabilidad quedan inutilizables hasta repararse (§423). No se borra un objeto mágico ni se declara una Tirada de Blindaje adicional. El inventario actual no es un sistema de combate; **no se modifica** en esta revisión.

### OCP-DRS-04 — Brío musculoso (Guerrero) · Resuelto y probado

**Fuente:** §§288–290.  
**Regla:** Ventaja en Fuerza para derribar puertas/barricadas/obstáculos similares; +1 a Potencia en Nivel 10 y otro +1 en Nivel 22, con máximo natural **3**.  
**Código:** `assets/rules.js` calcula Potencia inicial; `assets/powers.js` ajusta la elección definitiva del Guerrero, evitando aplicar Brío si se eligió Sacrificio. Hay pruebas de regresión de valores por Nivel en `tests/alcance-drs.js`. No debe agregarse un segundo bonificador desde la interfaz del Talento.

### ESP-DRS-04 — Baja estatura y Rapidez · Resuelto y probado

**Fuente:** Elfo agreste §§106, 110–111; Enano montañés §§117, 119–120; Mediano amable §§136, 138–139; Gnomo urbano §§148, 150–151.  
**Regla:** Movimiento ya calculado: **Elfo 7**, **Enano 5**, **Mediano 5**, **Gnomo 5**; referencia humana **6**. No sumar/restar de nuevo. Baja estatura limita escudos a pequeños y exige armas/armaduras adaptadas al tamaño.  
**Código:** los perfiles `data/especies.json` ya incorporan Movimiento. El motor toma directamente `esp.movimiento`; `assets/equipment.js` limita los escudos para Baja estatura. El tratamiento de adaptaciones sin cambios de precio o características proviene de una **decisión editorial previa de Forja**, no de una tarifa expresamente fijada por el DRS. No introducir nuevas tarifas ni duplicar ajustes.

## Resumen de estado

| Referencia | Estado | Consecuencia |
|---|---|---|
| ESP-DRS-01 | Resuelto desde fuente | Registrar repetición de Blindaje condicionada y gasto de Esfuerzo. |
| ESP-DRS-02 | **Cerrado con aclaración autoral** | Una Acción + 1 Punto de Esfuerzo: liberarse de Miedo o Parálisis aunque impidan actuar o exijan huir, sin Tirada ni Acción extra. |
| ESP-DRS-03 | Resuelto desde fuente | Una vez al día, aliado oye, declarar antes, +2. |
| OCP-DRS-01 | Resuelto desde fuente | Pasiva formal; dos efectos, gasto/Intervalo solo en primero. |
| OCP-DRS-02 | **Cerrado con aclaración autoral** | Una Tirada 15+ por criatura; agrupación opcional de enemigos idénticos (3 zombis + 2 esqueletos = 2 Tiradas). |
| OCP-DRS-03 | Resuelto desde fuente | Escudo normal destruido, mágico Durabilidad 0 e inutilizable. |
| OCP-DRS-04 | Resuelto y con regresiones | Potencia +1 a 10 y 22, máximo 3, solo con Brío. |
| ESP-DRS-04 | Resuelto y con regresiones | Movimiento preajustado; no duplicar; adaptaciones distinguidas. |

## Diario de esta revisión

- **A01:** Lectura de `docs/enciclopedia/110-informe-propiedades-talentos-drs.md`, corpus literal y motor/selección/equipamiento actuales en `main` (SHA `216c967193cb84f534f912a766945eef2d25a804`).
- **A02:** Contraste de los párrafos originales de `NaufragioD20DRS.docx` de los ocho asuntos, más reglas generales de Probabilidad, Estados, Durabilidad, Esfuerzo y Tiempo.
- **A03:** Separación de seis resoluciones ya fundamentadas y dos interpretaciones que requieren ratificación de autoría.
- **A04:** Apertura de rama `docs/talentos-drs-resoluciones-autoriales-20261101` para registrar el análisis sin cambios de motor ni en el producto público.
- **A05:** Redacción inicial de este registro con dos propuestas señaladas correctamente como no canónicas antes de la decisión autoral.
- **A06:** Recepción de la aclaración expresa de autoría (01/11/2026): agrupación opcional de criaturas idénticas en Expulsar muertos vivientes y excepción funcional de ¡Sálvese quien pueda! frente a los Estados lesivos.
- **A07:** Sustitución de las dos propuestas por decisiones aprobadas en este documento, manteniendo las ocho trazabilidades y distinguiendo DRS literal de aclaración autoral. Sin cambios de motor, inventario ni texto fuente.

**Criterio de cierre alcanzado:** las dos aclaraciones han sido ratificadas y los ocho asuntos quedan conciliados documentalmente. Ningún texto de `data/talentos-drs-literales.json` se modifica. **La automatización de estas capacidades en una interfaz de combate sigue siendo una tarea técnica diferente**, no un asunto editorial abierto.
