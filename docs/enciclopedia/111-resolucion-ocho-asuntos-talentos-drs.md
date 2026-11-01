# Talentos DRS — Resolución de los ocho asuntos mecánicos

**Fecha de revisión:** 01/11/2026 · **Estado:** seis asuntos resolubles por el texto del DRS; **dos decisiones autorales pendientes**.  
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

### ESP-DRS-02 — ¡Sálvese quien pueda! (Mediano amable) · Decisión autoral requerida

**Fuente:** §§140–141; Estado Miedo, §643; Estado Parálisis, §646.  
**Regla:** frente a Miedo o Parálisis, gastar **1 Punto de Esfuerzo y una Acción** permite liberarse sin Tirada.  
**Tensión real:** Miedo obliga a emplear la Acción para alejarse, y Parálisis puede impedir toda actuación ese Turno. El DRS **no especifica** si el Talento permite usar esa Acción ignorando esas restricciones.  
**Propuesta (NO canónica hasta aprobación):** considerar el Talento una excepción específica: el personaje puede dedicar su Acción a liberarse incluso cuando el Estado obliga a huir o impediría actuar; paga 1 Punto de Esfuerzo, se libera sin Tirada y no gana una Acción adicional. Mantener el coste escrito como `Acción + 1 Punto de Esfuerzo`, sin reclasificarlo como Reacción ni Pasiva.

### ESP-DRS-03 — Ánimo (Semielfo) · Resuelto documentalmente

**Fuente:** §§171–172.  
**Regla:** **una vez al día**, un aliado capaz de escuchar al Semielfo recibe **+2 a una Tirada de Atributo**, siempre que el uso se declare **antes** de la tirada.  
**Registro:** frecuencia 1/día, objetivo aliado, condición auditiva, momento anterior a Tirada, bonificación +2. No hay Coste de Esfuerzo, Acción ni Tirada de activación especificados. **No se incorporan costes por omisión.**

### OCP-DRS-01 — Recuperación (Guerrero) · Resuelto documentalmente

**Fuente:** §§284–286.  
**Regla:** la etiqueta formal es **Pasiva**, no Acción. Incluye dos efectos distintos: (a) tras un combate, se puede gastar **1 Punto de Esfuerzo** y dedicar **1 Intervalo** para recuperar **1d8 Puntos de Salud**; (b) Ventaja en Tiradas de Resistencia para regenerar el Esfuerzo gastado.  
**Registro:** mantener `activacion_literal: Pasiva`; registrar el gasto en la parte condicional (a) y la Ventaja persistente (b) por separado. No crear un nuevo Coste formal en la ficha literal ni convertir el Intervalo en Turnos.

### OCP-DRS-02 — Expulsar muertos vivientes (Clérigo) · Decisión autoral requerida

**Fuente:** §§208–212; Tiradas de Probabilidad, §§547–548; definición de Intervalo, §585.  
**Regla expresa:** Activación **Acción**, Atributo **Intuición**, Coste **1 Punto de Esfuerzo**, radio **18 metros**. Los muertos vivientes de Nivel igual o inferior al del Clérigo tienen **Probabilidad 15+** de resultar destruidos. Quienes soportan la expulsión se alejan durante **1 Intervalo o 6 Turnos**, o hasta perder al Clérigo de vista (lo que suceda antes). Probabilidad 15+ significa comparar **1d20 con 15+** según la regla general, sin que el propio Talento indique una Tirada adicional de Intuición.

**Vacíos de procedimiento:** no se aclara de forma literal (a) si se comprueba una Probabilidad por cada objetivo o una sola para todos; (b) a quién corresponde la tirada; (c) si los muertos vivientes de Nivel superior también deben huir aunque no puedan ser destruidos; ni (d) cuándo corresponde elegir Intervalo frente a 6 Turnos.

**Propuesta (NO canónica hasta aprobación):** el **jugador del Clérigo** realiza un 1d20 de Probabilidad 15+ **por cada muerto viviente válido** de Nivel igual o inferior, una vez por activación; los que no son destruidos deben alejarse. Los de Nivel superior quedan fuera del efecto (ni destrucción ni huida). En combate se usan **6 Turnos**; fuera de combate, **1 Intervalo**; la pérdida de vista pone fin antes al efecto. **No** pedir una Tirada adicional de Intuición: el Atributo se conserva como información literal, no como tirada deducida. Esta elección tiene carácter de interpretación autoral, no puede atribuirse al DRS sin ratificación.

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
| ESP-DRS-02 | **Pendiente de aprobación autoral** | Decidir si el Talento excepciona las restricciones de Miedo y Parálisis. |
| ESP-DRS-03 | Resuelto desde fuente | Una vez al día, aliado oye, declarar antes, +2. |
| OCP-DRS-01 | Resuelto desde fuente | Pasiva formal; dos efectos, gasto/Intervalo solo en primero. |
| OCP-DRS-02 | **Pendiente de aprobación autoral** | Fijar tiradas por objetivo/actor, Nivel superior y tiempo. |
| OCP-DRS-03 | Resuelto desde fuente | Escudo normal destruido, mágico Durabilidad 0 e inutilizable. |
| OCP-DRS-04 | Resuelto y con regresiones | Potencia +1 a 10 y 22, máximo 3, solo con Brío. |
| ESP-DRS-04 | Resuelto y con regresiones | Movimiento preajustado; no duplicar; adaptaciones distinguidas. |

## Diario de esta revisión

- **A01:** Lectura de `docs/enciclopedia/110-informe-propiedades-talentos-drs.md`, corpus literal y motor/selección/equipamiento actuales en `main` (SHA `216c967193cb84f534f912a766945eef2d25a804`).
- **A02:** Contraste de los párrafos originales de `NaufragioD20DRS.docx` de los ocho asuntos, más reglas generales de Probabilidad, Estados, Durabilidad, Esfuerzo y Tiempo.
- **A03:** Separación de seis resoluciones ya fundamentadas y dos interpretaciones que requieren ratificación de autoría.
- **A04:** Apertura de rama `docs/talentos-drs-resoluciones-autoriales-20261101` para registrar el análisis sin cambios de motor ni en el producto público.
- **A05:** Redacción de este registro; ninguna propuesta marcada como aprobada sin decisión del autor.

**Criterio de cierre:** una vez ratificadas las dos propuestas, actualizar el estado de ESP-DRS-02 y OCP-DRS-02 con el texto exacto aprobado y preservar en el archivo el contraste entre literal DRS, interpretación y futura implementación. No modificar las reglas ejecutables hasta que exista una tarea técnica con pruebas propias.
