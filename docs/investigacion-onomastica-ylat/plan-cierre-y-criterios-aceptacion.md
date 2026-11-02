# Plan de cierre auditable — investigación onomástica de Ylat

**Fecha:** 2026-11-02. **Objeto:** establecer una **línea de llegada verificable** que evite ampliar indefinidamente la investigación al encontrar cualquier texto antiguo o nuevo. **Estado:** planificación; la investigación **todavía no está cerrada**. Rama de estudio: `research/onomastica-ylat-2026-11`. **El cierre de la investigación no equivale a habilitar nombres nuevos en La Forja**.

## 1. Qué está estudiado ya

| Grupo de evidencias | Cobertura comprobada | Límite |
| --- | --- | --- |
| PNJ históricos | **140 registros** de `dnd_npcs.xlsx`, más el contraste con **66 registros** de `npcs.xlsx`; fichas asociadas examinadas | Censo **histórico**, anterior a la campaña de Isophius; no incluye necesariamente campañas posteriores |
| Componentes dudosos | **66/66** componentes pendientes con lectura dirigida de su testimonio; **97** segundos componentes clasificados en total | «Revisado» no implica «aprobado»; existen **60** formas sin prueba familiar positiva en el lote de 66 |
| Aventura y campaña | **154 denominaciones** de índices de cuatro aventuras, auditadas por su fuente; Isophius **61 formas** en unión documentada de campaña/casas; Malasthar **19**; Biografías **8** | Los **88** registros Isophius/Malasthar/Biografías son *formas*, no 88 personajes distintos. No sumar sin deduplicar ni confundir Ylat¹/³/⁴ |
| Teonimia | **18 fichas** y **54 títulos/epítetos** de *Espíritus Deíficos* | Los 54 son designaciones, no apellidos; otros nombres interiores pueden requerir cotejo |
| Cronología y geografía | Cotejo dirigido de *Enciclopedia*, *Historia de Shadaleen* y *Zonas de Ylat*, con eponimias y variantes | No afirmamos haber barrido exhaustivamente todo `Zonas` (~113 k caracteres) ni todas las fuentes históricas |
| Gestas adicionales | **2 publicadas en 2025**, **1 borrador de 2026**, **11 denominaciones personales o cultuales** | La condición de **borrador** impide tratarlas como material publicado |
| Repertorios actuales | Leídos `nombres-historicos-ylat.json`, `tesauro-ylat.json`, `sexo-personajes.json` y otros archivos pertinentes | Cotejos literales no son equivalencia de identidad; **no se ha modificado** producción |

**Total de documentos de investigación al redactar este plan:** 24, incluido el nuevo análisis de Shadaleen pero antes de sumar este plan. Cifras de **corpus no acumulables** porque se solapan y representan clases diferentes.

## 2. Alcance elegido para un cierre razonable

### Incluido

1. **Fuentes rectoras de Ylat ya identificadas:** historia de Shadaleen, zonas, cronología/enciclopedia, lenguas, espíritus, historia de Gylran y biografías; distinguir origen, testimonio, clase de entidad, ámbito histórico o realidad y versión contradictoria cuando consten.
2. **Fuentes documentales de campaña concretas ya identificadas:** censo de 140, fichas individuales de los 66 componentes, índices de cuatro aventuras, campaña y casas de Isophius, Malasthar y las tres Gestas auditadas.
3. **Repertorios actuales de La Forja:** revisión de coincidencias y riesgos tipológicos, sin editar ni normalizar datos.
4. **Resultado final:** un índice consolidado de **testimonios** que preserve fuente y grafía, con registro diferenciado de **identidades** solo cuando la prueba soporte la unión; matriz de elegibilidad con `documentado`, `no_acreditado`, `conflicto` y `pendiente_de_autorizacion` como **etiquetas de análisis**, no campos ya presentes en la aplicación.

### Excluido del requisito de cierre

- Lectura de **toda** la Biblioteca, todas las campañas jugadas en veinte años, todos los borradores, todas las páginas publicadas de El Naufragio y toda fuente potencial aún desconocida.
- Universos **Niguace/Niguaze** y demás material declarado ajeno a Ylat.
- Inferir reglas de apellido para especies, lenguas, naciones, sexos o realidades sin evidencia textual y aval editorial.
- Implementación de código, migración de datos y activación de generación; requieren fase propia.

**Regla contra el barrido infinito:** un hallazgo fuera del conjunto incluido se registra como «fuente futura» o incidencia concreta y **no reinicia automáticamente el alcance**, salvo que refute un criterio crítico ya aplicado o descubra un error sustancial de procedencia.

## 3. Tres bloques pendientes de investigación documental

### Bloque A — Último barrido dirigido de rectoras y variantes

- [ ] Terminar la comprobación dirigida de **antropónimos** y **denominaciones de casas** que puedan quedar dentro de *Zonas de Ylat*, sin extraer indiscriminadamente todos los topónimos.
- [ ] Revisar los testimonios de *Historia de Shadaleen* y de los principales textos rectores para asegurar que las variantes detectadas estén completas y con **sección** citada. Conservar versiones rivales, en especial **«La Primera Huella»**.
- [ ] Reexaminar hallazgos con alta probabilidad de confusión: **Narga Solarys/Solaris → Ganragán**; **Bazjurm/Bajzurm**; **Vaiel** deífico/satélite; **Shadelgast** como linaje o imposición narrativa; **An’ael Yuvann/Ananolis**; personas que dan nombre a lugares y viceversa.
- [ ] Registrar explícitamente qué partes de cada documento rector fueron revisadas y cuáles no.

**Se considera terminado cuando:** cada caso crítico tiene **fuente + localizador + forma literal + clasificación + estado de confianza**, y la cobertura de las rectoras incluidas queda especificada sin proclamar exhaustividad indebida.

### Bloque B — Índice maestro único, sin duplicar identidades

- [ ] Preparar **índice consolidado** de denominaciones de persona, linaje, alias, tratamiento religioso, animal, lugar, astro, título y teónimo **según su uso documentado**.
- [ ] Distinguir **testimonio nominal** de **identidad de individuo**; consolidar solo equivalencias justificadas. No deduplicar solo por similitud o igualdad de letras: **Vaiel** y **Santa Verna** requieren varias clases de entidad.
- [ ] Conservar por registro **literal**, **fuente**, **sección o enlace**, **estado publicado/borrador/histórico**, **realidad** cuando la obra la identifica, y si existe prueba concreta de parentesco o apellido.
- [ ] Mostrar recuentos **por clase, fuente y solapamiento**, **sin sumar 140+154+61+19+8+18+11 como personas**.

**Se considera terminado cuando:** se puede responder **qué nombres están realmente documentados**, dónde, y por qué pueden o no clasificarse como apellidos, sin reconstrucciones arbitrarias.

### Bloque C — Auditoría final y acta de cierre documental

- [ ] Revisar el índice frente al **censo**, **matriz**, **bitácora** y **repertorios** de producción.
- [ ] Generar un resumen de **observaciones resueltas por evidencia**, **variantes abiertas** y **decisiones sujetas al autor**. No ocultar incertidumbres.
- [ ] Verificar mediante comparación GitHub que **solo hay cambios documentales** en la rama, no código/JSON/producción ni PR de integración.
- [ ] Publicar **acta de cierre de fase documental** con fecha, criterios cumplidos, fuentes revisadas, fuentes excluidas y límites conocidos.

**Se considera terminado cuando:** la investigación puede consultarse y auditarse como corpus cerrado con **incidencias editoriales expresas**, aunque no todas estén decididas.

## 4. Decisiones editoriales y fase de integración: dos cierres distintos

Actualmente hay **14 asuntos ONO-01 a ONO-14** recogidos en [decisiones-editoriales.md](decisiones-editoriales.md). Son decisiones **del autor**, no fallos de investigación. Por ejemplo:

- **Grafías y fuentes rivales:** ONO-01, ONO-02, ONO-03, ONO-07 a ONO-12, **ONO-14**. El acta documental puede consignar variantes y dejar la preferida pendiente.
- **Criterios de generación y universo:** ONO-04, ONO-05, ONO-06 y ONO-13; afectan directamente a qué nombres pueden reutilizarse y a cómo segmentarlos.
- **Riesgo inmediato existente en el tesauro:** **ONO-13** (un **oso** y una **montaña** etiquetados como `documentado`, utilizados por combinaciones). Debe resolverse antes de autorizar un generador de nombres de persona que los sortee.

**Cierre documental** = corpus trazable, criterios metodológicos y asuntos abiertos visibles. **Cierre editorial** = autor confirma criterios y grafías. **Integración en La Forja** = fase posterior y separada con pruebas, sin autorización implícita por terminar la investigación.

## 5. Estimación relativa y dependencias

Tras ocho sesiones documentadas y con los grandes censos y muestras específicos ya auditados, **la mayor parte del trabajo de exploración del núcleo conocido está realizada**. Quedan **tres bloques acotados** (A, B y C); como orden de magnitud de esfuerzo, **dos a cuatro rondas de trabajo comparables** dependiendo de la complejidad de la deduplicación y variantes. **No es una fecha prometida ni un porcentaje matemático**: este cálculo presupone respetar el **alcance del §2** y no incorporar todas las campañas inéditas o futuras.

**No hace falta activar el modo Investigación externa** para esta fase: las pruebas son **documentos propios de Google Drive, Biblioteca y GitHub**, actualmente accesibles mediante conectores. El modo Investigación podría ayudar con comparación pública externa, pero **no decide el canon** ni reemplaza el registro cuidadoso de testimonios privados. El factor limitante del cierre editorial es **validación del autor**, no la búsqueda web.

## 6. Estado actualizado en esta sesión

- [x] Nuevo análisis de **Siete Familias y relato alternativo «La Primera Huella»**: [auditoria-shadaleen-eponimos-y-relatos.md](auditoria-shadaleen-eponimos-y-relatos.md).
- [x] Variante **Narga Solaris/Solarys** registrada como **ONO-14**, sin corregir las fuentes.
- [x] Alcance y criterios de cierre documentados.
- [ ] Bloques A, B y C **pendientes**.
- [ ] Validación editorial y cambios de producto **no realizados**.
