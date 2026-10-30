# Conjuros: cuestiones editoriales antes de integrar efectos en Forja

**Fecha:** 30 de octubre de 2026. **Estado:** observaciones documentales; la corrección geométrica CONJ-M03 ha sido aprobada en su redacción y registrada en 78a. **Fuentes:** Tomo de Magia alfabético (lotes [69a](69a-conjuros-alfabeticos-001-025.json), [69b](69b-conjuros-alfabeticos-026-050.json), [69c](69c-conjuros-alfabeticos-051-075.json) y [69d](69d-conjuros-alfabeticos-076-100.json)), y sus [desgloses revisados 72a–72d](72a-desglose-revisado-conjuros-001-025.json). Las transcripciones históricas permanecen intactas.

## A. Decisiones que alteran un resultado reglamentario

| ID | Conjuro (ordinal) | Texto fuente o contraste | Qué falta decidir |
|---|---|---|---|
| **CONJ-M01** | **Convergencia vital de Olphegor (96)** | La Salud **actual del objetivo** se iguala a la Salud **máxima del lanzador**; si el cambio aumenta la Salud, el lanzador sufre daño impío igual a la diferencia. La última frase dice que **si el objetivo tiene menos Salud que el lanzador, este no sufre daño**. | En algunos estados de Salud, las dos condiciones dan resultados contradictorios. Determinar la condición correcta de daño sin reescribir la transcripción. |
| **CONJ-M02** | **Cataclismo tenebroso (84)** | Tras la Tirada de Conjuro que causa **20d10 de daño impío** (o la mitad al fallarla), el texto exige una **Tirada de Resistencia a los PJ afectados**. | Definir qué cambia si superan o fallan esa Tirada; no añadir otra reducción de daño o muerte automática sin fuente. |
| **CONJ-M03 — redacción resuelta** | **Cúpula antimagia (90)** y otros 9 Conjuros | [Auditoría transversal](77c-resumen-geometria-conjuros.md) de 10 mezclas de «radio» y unidades de superficie. | [Diez fichas corregidas (78a)](78a-correcciones-geometria-conjuros-10.json): superficies circulares sin convertir m²/km² en distancias. Persisten incidencias específicas de Alcance o centro para Diluvio, Tromba y Terremoto. |
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
- **275/434** Conjuros desglosados manualmente con fragmentos reglamentarios y advertencias, en [72a–72k](72k-desglose-revisado-conjuros-251-275.json), cotejados en [75a](75a-auditoria-desglose-manual-100.json), [75b](75b-auditoria-desglose-manual-101-125.json) [75c](75c-auditoria-desglose-manual-126-150.json) [75d](75d-auditoria-desglose-manual-151-175.json) [75e](75e-auditoria-desglose-manual-176-200.json) [75f](75f-auditoria-desglose-manual-201-225.json), [75g](75g-auditoria-desglose-manual-226-250.json) y [75h](75h-auditoria-desglose-manual-251-275.json).
- **159** Conjuros aún pendientes de desglose manual, pero ya preclasificados en [ocho lotes 73a–73h](73a-preindice-mecanico-051-100.json), [auditados](74a-auditoria-preindice-051-250.json) por referencias y marcas literales.
- [Cobertura consolidada](76a-cobertura-desglose-conjuros-434.json). La preclasificación por palabras **no** convierte esos 159 en fichas mecánicamente verificadas.

**Se puede continuar con 276–300 sin resolver estas cuestiones.** La implementación y sus pruebas en Forja siguen fuera del alcance de esta PR hasta aprobación.

**Nota de control:** el recuento espacial de la auditoría inicial se corrigió tras detectar que el superíndice ² quedaba fuera del patrón de búsqueda. La [auditoría vigente](77c-resumen-geometria-conjuros.md) registra 65 fichas con magnitudes espaciales y 10 mezclas de radio y superficie.

## E. Hallazgos del desglose 101–125

- **CONJ-M08 — Diluvio universal (108):** declara `Alcance: 10 kilómetros alrededor del lanzador` y luego un «radio de 10 km²»; la discrepancia geométrica se añade a [CONJ-M03](77c-resumen-geometria-conjuros.md). Además exige perder **1d4 Espacios de Conjuro** o «un valor equivalente si no los tienes», sin indicar esa equivalencia. No elegir recurso ni conversión sin decisión editorial.
- **CONJ-M09 — Destello aural (106):** describe una descarga que ciega, pero sólo cuantifica daño y no define duración de Ceguera. No establecer una duración por inferencia.
- **CONJ-M10 — Descarga sombría (103):** conserva literalmente `Nivelesa` en «2d4 de daño impío por cada 2 de tus Nivelesa». Se trata de una errata aparente; no se corrige el texto fuente ni se fija redondeo hasta revisión.
- **CONJ-M11 — Descarga de caos (124):** dispone de una tabla **d8** con resultados separados de éxito/fallo, incluida la expresión literal **3d3**. Se registra como tabla, no como una lista libre de seis efectos a escoger.
- **Dormir (101):** sus **5d10 Puntos Oníricos** son un presupuesto de comparación con Salud actual para causar el Estado Dormida; la ficha no dice que los Puntos Oníricos inflijan daño. No necesita una regla nueva para conservar esta diferencia.

[Fichas 101–125 revisadas](72e-desglose-revisado-conjuros-101-125.json) y [auditoría de 68 referencias a párrafos](75b-auditoria-desglose-manual-101-125.json). Ninguna de estas observaciones autoriza cambios automáticos a Forja.

## F. Hallazgos del desglose 126–150

- **CONJ-M12 — Estrépito (134):** aplica una Probabilidad 12+ de Derribo y Ensordecimiento a objetivo y adyacentes, pero no fija duración explícita para Ensordecimiento. No crearla.
- **CONJ-M13 — Encandilamiento magno (142):** remite a Encandilamiento (140), con su límite explícito de Nivel 3 o inferior. Queda por decidir si ese requisito se mantiene en la versión magna; no retirarlo por inferencia.
- **Geométricos sin radio:** Detectar trampas (129) define una franja de 15 × 3 metros; Deformar madera (130) afecta hasta 1 m³; Esfera vital (141) sí declara un radio lineal de 3–6 metros; Explosión arcana (147) y Erupción (148) expresan superficies de 6 m² y 12 m² sin declarar su forma. No convertirlos automáticamente a círculos.
- **Condiciones claras que deben preservarse:** Desvanecer escritura (128) borra la escritura mágica incluso al fallar, pero activa su efecto; Esfera corrosiva (137) causa 3d12 al acertar y 3d6 al fallar; Encandilamiento (140) requiere pruebas nuevas ante peticiones contrarias a intereses y maltrato.

[Desglose manual 126–150](72f-desglose-revisado-conjuros-126-150.json) y [auditoría de 46 referencias a párrafos](75c-auditoria-desglose-manual-126-150.json). Las transcripciones históricas siguen intactas. No se ha implementado ninguna regla en Forja.

## G. Hallazgos del desglose 151–175

- **CONJ-M14 — Estallido de escarcha (157):** el alcance dice literalmente «un cono de 20», sin unidad. No asignar metros por suposición.
- **CONJ-M15 — Forja arcana (164):** «Cualquier aliado puede gastar **1 arma** imbuyendo un arma...». La unidad de gasto no es operativa. No sustituirla por acción, hora o punto sin decisión editorial.
- **CONJ-M16 — Galerna (170):** la frase «impede a todos aquellos ubicados en el área de efecto» está truncada y no especifica qué impide. No generar una penalización adicional.
- **CONJ-M17 — Glorioso orbe protector de Excelsus (172):** se declara daño acumulativo, mitad del daño si se falla la Tirada de Conjuro y una Probabilidad 14+ de fallar el ataque, pero no se define inequívocamente cuándo efectuar esa Tirada de Conjuro.
- **Estrella divina (158):** tamaño de aparición de 2 m² y radio de daño de 2 metros son magnitudes diferentes que deben coexistir; no se trata necesariamente de contradicción.
- **Nueva pasada de superficies:** se han localizado **seis erratas adicionales** fuera de los diez casos ya reparados editorialmente, registradas como **propuestas no aprobadas** en [77d](77d-segunda-pasada-erratas-geométricas.json). No se han alterado los textos fuente.

[Desglose manual 151–175](72g-desglose-revisado-conjuros-151-175.json) y [auditoría de 50 referencias](75d-auditoria-desglose-manual-151-175.json).

## H. Hallazgos del desglose 176–200

- **CONJ-M18 — Guardián fantasmal (177)**: espíritu protector que ataca, pero no dispone de ficha de Salud, daño ni reglas de ataque. No inventar estadísticas.
- **CONJ-M19 — Intercambio de almas (189)**: conserva explícitamente Mente, Intuición y Presencia; la frase posterior dice que «sus Atributos» cambian con el cuerpo. Debe precisarse esa excepción antes de implementar el intercambio de hojas.
- **CONJ-M20 — Invocar elemental menor (195)**: cuatro variedades, orden e Iniciativa definidos, pero falta una ficha de criatura o referencia inequívoca para las estadísticas. No improvisarlas.
- **CONJ-M21 — Invisibilidad magna (200)**: excepciona la cancelación por acciones violentas o hablar, pero no especifica si también excepciona la cancelación por uso de un Poder de Invisibilidad (199). Conservar esta distinción sin suponer inmunidad.
- **Hálito de ultratumba (183)**: cono expresado como superficie de 6 m², sin dimensiones lineales; **Hambre de Nastala (184)**: alcance en 50 m² sin forma geométrica. No convertir estos números en radios.
- **Hoja rugiente (185)**: inflige 1d6 adicional incluso si falla el ataque de arma. **Hablar con los muertos (182)**: máximo tres preguntas, excluidos muertos vivientes.

[Desglose 176–200](72h-desglose-revisado-conjuros-176-200.json), [auditoría de 40 referencias](75e-auditoria-desglose-manual-176-200.json). Fuentes literales y funcionamiento de Forja sin modificar.

## I. Hallazgos del desglose 201–225

- **CONJ-M22 — Invocar ejército ilusorio (202)**: las copias soportan `Nivel / 10` impactos, con redondeo no declarado; su daño se deshace al descubrir la ilusión. No atribuirles Salud.
- **CONJ-M23 — Legado de poder (209)**: préstamo de Conjuros a terceros y bloqueo de Espacios mientras permanezcan sin usar; faltan detalles para representar la reversión al consumirlos.
- **CONJ-M24 — Invocar elemental mayor (204) y Llamada del lobo espectral (215)**: no ofrecen bloques de estadísticas; no implementar criaturas inventadas. Las restricciones de cantidad e Iniciativa están explícitas.
- **CONJ-M25 — Marca del dador oscuro (225)**: transfiere como máximo un cuarto del daño recibido en el Turno anterior, sin redondeo especificado.
- **Aplicación editorial existente:** Invocar vórtice de energía (205) y Luna carmesí (217) ya cuentan con geometría corregida en [78a](78a-correcciones-geometria-conjuros-10.json). Las transcripciones 69i permanecen literales.
- **Lluvia de estrellas (216)**: 12 m² sin forma determinada y resultados distintos en éxito/fallo. **Ídolo guardián de Mulinith (201)**: reducción de 4 por golpe físico y vulnerabilidad doble a efectos de área.

[Desglose 201–225](72i-desglose-revisado-conjuros-201-225.json) y [auditoría de 44 referencias](75f-auditoria-desglose-manual-201-225.json). Sin cambios en las reglas ejecutables de Forja.

## J. Hallazgos del desglose 226–250

- **CONJ-M26 — Maldición de vínculo mortal (227):** no está claro cómo se ordena la aplicación de Blindaje y resistencias ni qué significa «de la primera» cuando la criatura herida puede ser cualquiera de las vinculadas.
- **CONJ-M27 — Manto del inquebrantable (243):** la descripción precisa proyectiles no mágicos, pero termina hablando de inmunidad a los «ataques mundanos». No extender o restringir esa inmunidad sin decisión.
- **CONJ-M28 — Muro de huesos (248):** se declara `Nivel × 10` Puntos de Golpe, pero dice que fuego o luz «lo reduce al doble de velocidad» sin una operación mecánica definida.
- **Geometría declarada:** Muro de fuego (226) tiene altura y longitud, y Muro de fuerza (237) declara las tres dimensiones. Muralla de hielo (239) y Muro de piedra (242) expresan 300 m², pero no grosor.
- **Mundo onírico (250):** el coma, la permanencia al romper contacto y las Tiradas para entrar y evitar escapar son condiciones distintas; no confundirlas.

[Desglose 226–250](72j-desglose-revisado-conjuros-226-250.json); [auditoría de 38 referencias](75g-auditoria-desglose-manual-226-250.json).

## K. Hallazgos del desglose 251–275

- **CONJ-M29 — Niebla (256):** frase de la descripción truncada, aunque los tres efectos siguientes están explícitos. No introducir una regla supletoria.
- **CONJ-M30 — Orbe elemental (270):** la zona dañina incluye el interior del orbe y 2 metros a su alrededor, pero la fuente no establece el diámetro del propio orbe; no inferir radio total.
- **CONJ-M31 — Palabras de Custodia: Corrupción (272), Loriga (273) y Rectitud (274):** bonificaciones fraccionarias por Nivel y sin criterio de redondeo explícito en la ficha.
- **Geometría ya señalada en 77d:** Niebla carmesí (257), «m² de diámetro», y Nube de aniquilación (259), «m² de radio», permanecen pendientes de aprobación editorial; no alterarlas en la transcripción.
- **Ojo de la tormenta (262):** expresa 5 km² de alcance, hasta 1 km² por manifestación liberada y 10 m² por impacto de rayo; son cantidades distintas, sin geometría única autorizada.

[Desglose 251–275](72k-desglose-revisado-conjuros-251-275.json); [auditoría de 50 referencias](75h-auditoria-desglose-manual-251-275.json). Fuentes originales y código ejecutable sin modificaciones.
