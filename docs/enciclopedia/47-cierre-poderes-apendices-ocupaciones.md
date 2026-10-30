# Tanda 3 — Cierre de extracción de Poderes y apéndices del manual de Ocupaciones

**Fecha:** 29 de octubre de 2026. **Fuente original:** `NaufragioD20 — Ocupaciones.docx`. Todo lo registrado es documental: no implica validación mecánica de Forja.

## Entregables cotejados

| Tipo | Registros | Archivos |
|---|---:|---|
| Flechería arcana del Celador | **14 Poderes literales**, más reglas generales | [Parte 1](38a-flecheria-arcana-parte-1.json), [parte 2](38b-flecheria-arcana-parte-2.json) |
| Privilegios del Forense | **6 Poderes literales** | [Parte 1](39a-privilegios-forense-parte-1.json), [parte 2](39b-privilegios-forense-parte-2.json) |
| Capacidades de los Núcleos de marioneta | **6 efectos literales** | [Núcleos](40a-marionetas-habilidades-nucleos.json) |
| Componentes de marioneta | **18 opciones** en tres tablas Word 41–43 | [Armazones, Extremidades y Núcleos](40b-marionetas-tablas-componentes.json) |
| Bestias del Cazador | **24 ejemplos**, tabla Word 39 ya presente en la rama y verificada | [Bestias](41a-bestias-cazador-tabla-completa.json) |
| Explosivos del Dinamitero | **32 consumibles**, tabla Word 40 y reglas originales | [Parte 1](42a-explosivos-dinamitero-parte-1.json), [parte 2](42b-explosivos-dinamitero-parte-2.json) |
| Conjuros de Nictomancia | **2 Conjuros literales** | [Dardo de penumbra y Portal sombrío](43a-conjuros-nictomancia-manual-ocupaciones.json) |
| Técnicas de batalla adicionales | **10 Técnicas literales** | [Disciplina (4)](44a-tecnicas-ocupaciones-disciplina.json), [Fuerza bruta y Preternatural (6)](44b-tecnicas-ocupaciones-fuerza-preternatural.json) |
| Canciones del Bardo | **24 Canciones literales**, seis por complejidad, más reglas generales | [Sencillas e Intrincadas](45a-canciones-bardo-sencillas-intrincadas.json), [Maestras y Míticas](45b-canciones-bardo-maestras-miticas.json) |
| Eidolas de la Invocadora | **32 invocaciones preindexadas**, ocho por Categoría, tabla Word 44 | [Índice completo](46a-eidolas-indice-32-invocaciones.json) |

**Distinción de estados:** Flechería, Privilegios, Núcleos, Conjuros, Técnicas y Canciones tienen su **efecto textual**; los 32 Eidolas tienen **sólo la tabla de identidad, Categoría, Canalización y elemento**: aún falta transcribir las tres modalidades de efecto de los párrafos 1489–1747. Las 24 Bestias eran ya un inventario presente, verificado ahora, no nuevo trabajo contado doble.

## Dependencias de integración

1. **Celador:** preparar cada proyectil consume 1 Esfuerzo y 1 Intervalo, Tirada de Intuición; su uso depende del Arma de celador y tiene límites por tabla de progreso.
2. **Marionetista:** las seis Habilidades de Núcleo son opciones excluyentes para cada construcción. Distinguir la creación inicial, la mejora posterior y el reemplazo de marionetas destruidas.
3. **Bardo:** el sistema de Canciones usa Presencia, Esfuerzo, mantenimiento por Turno, área alrededor del músico y grado de complejidad; no son Conjuros ni Talentos.
4. **Invocadora:** Encarnar, Canalizar y Materializar son vías distintas; la tabla Word 44 no contiene los efectos completos.
5. **Dinamitero:** explosivos son consumibles con Intensidad, radio, daño y efecto; no son Talentos.
6. **Bestias:** la tabla es expresamente ejemplificativa. El Cronista determina habilidades especiales y puede aprobar otras criaturas del Bestiario.

## Nueva conciliación editorial

**OCP-17 — Portal sombrío.** El conjuro permite viajar a cualquier **nictomante**, pero su cláusula de daño exceptúa a cualquier **nigromante**. No se ha supuesto equivalencia entre ambas categorías. Pendiente decidir quién cruza sin daño o corregir el texto original.

## Siguientes pasos

- **Prioridad alta:** extraer íntegramente las **32 fichas de Eidolas** (Encarnar, Canalizar, Materializar, condiciones y duración) y contrastar con el índice.
- Conciliar **OCP-06/08/09/10/11/12/14/15/16/17** cuando el autor decida; mantener erratas y contradicciones visibles sin cambiar silenciosamente las fuentes.
- Continuar con el inventario de **Equipo** (tablas Word 35–38) y comprobar duplicados de los dos Conjuros contra el Tomo de Magia.
- Revisar los **163 enlaces originales Ocupación–Talento**, restando Poderes reclasificados, y completar las fichas que aún no estén extraídas.
- Probar Forja posteriormente y sólo con aprobación; **esta fase no modifica el código y no fusiona la PR #3**.
