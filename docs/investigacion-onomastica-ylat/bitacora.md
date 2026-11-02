# Investigación onomástica de Ylat — bitácora

**Inicio:** 2026-11-02  
**Estado:** Fases I–III en investigación; sin cambios de aplicación.  
**Rama:** `research/onomastica-ylat-2026-11`  
**Regla de exclusión:** no utilizar material de Niguace/Niguaze ni de otros universos sin procedencia acreditada. Ver `docs/enciclopedia/127-exclusion-corpus-ajeno-ylat.md` y PR #22.

## Alcance y reglas de trabajo

- Solo se incorporarán testimonios con procedencia verificable de Ylat.
- Se diferenciarán nombre de pila, apellido, nombre completo, casa/linaje, epíteto y forma indeterminada.
- No se dividirán cadenas por espacios ni se deducirá sexo, especie o cultura por apariencia.
- No se modificarán `data/`, `assets/` ni LIVE durante la investigación.
- Este archivo registra hallazgos preliminares, no decisiones editoriales aprobadas.

## Registro de actividades

### 2026-11-02 — Auditoría inicial

- Contrastados `data/nombres-historicos-ylat.json`, `data/tesauro-ylat.json`, `data/especies.json`, `data/sexo-personajes.json`, `assets/rules.js`, `assets/sex.js` y `assets/repertorios.js`.
- Banco histórico: 1428 registros, 1422 formas distintas. El tesauro vigente: 52 registros (19 documentados, 33 combinados). Las cantidades **no** equivalen a nombres de pila y apellidos validados.
- Verificada la PR #22, que retiró 148 entradas de un corpus ajeno. Revisar por separado posibles coincidencias léxicas residuales en `sexo-personajes.json`; una coincidencia no demuestra procedencia exclusiva.
- Localizado en la Biblioteca el «Índice maestro de Ylat»; establece como fuentes rectoras Enciclopedia, Zonas, Lenguas, Espíritus Deíficos, Historia de Shadaleen, Historia de Gylran y Biografías. Las antiguas fichas separadas Reino de Gylran, Iblisios y Dracónidos están sustituidas por Historia de Gylran.
- Inspeccionada la carpeta raíz de Drive [Ylat](https://drive.google.com/drive/u/3/folders/1gUMXUshlfY1FKtghLv7BP58w2FyQf3wO) y subcarpetas de Trasfondo, Proyectos y otras áreas. La ubicación en la carpeta no prueba pertenencia al canon.
- Documentos narrativos revisados: [Biografías](https://docs.google.com/document/d/1yOtB8nNvE9_jBDvITuXzFFFFNFAiJI6Z4hr6D_1pxaA/edit), [Historia de Shadaleen](https://docs.google.com/document/d/15LVdulBcuf62G6OPQKKCTHQWOHrqrGUAZO6DnXZJA2o/edit), [Susurros en Isophius](https://docs.google.com/document/d/1E7AMmSFvZestqgVVDnm4vHKKu4G5_NeXIUWlzlChEYM/edit) e [Historia de Malasthar](https://docs.google.com/document/d/1fyLSppENaYx2w8tvVzdzdfTAZ46_epq-nFS1S0yPWKE/edit) (borrador).
- Pendiente: lectura completa de todas las fuentes Word/PDF/Docs y extracción de «Apellidos eladrines en Erklan.txt» y «Linajes eladrines.txt», cuyo contenido no se pudo decodificar.

## Hallazgos documentales iniciales

| Forma | Tipo provisional | Testimonio | Observaciones |
| --- | --- | --- | --- |
| Caelia Fulgentis | Nombre completo | Biografías, apartado Caelia | Fulgentis se identifica como familia de alfareros de Beslitz. |
| Naeis Shadelgast | Nombre completo y vínculo dinástico | Biografías, apartado Naeis | Shadelgast también se documenta como familia dinástica en Historia de Shadaleen. |
| Fabrizio Orovecchio | Nombre completo | Susurros en Isophius, inicio | Tadeo y Joan Orovecchio aparecen con relaciones familiares explícitas. |
| Redvers Kultstein | Nombre completo | Historia de Shadaleen | Vinculado a la familia Kultstein. |
| Bram Brasagorda | Nombre + sobrenombre | Biografías, apartado Bram | El texto explica que Brasagorda era un mote y que su apellido real se desconoce. No tratar como apellido. |
| Iralde Terrana | Nombre completo y linaje | Historia de Malasthar, Tres Lises | Borrador; no equiparar automáticamente linaje sacro y apellido libre. |
| Shadelgast, Bronnhum, Rowes, Alogers, Keefe, Dórilon, Kultstein | Familias | Historia de Shadaleen, Siete Familias | Cada una requiere validación independiente de usos como apellido. |

### Cuestiones por conciliar

- Saewig Shadelgast (tesauro) frente a Saewig Rowes (Historia de Shadaleen): comprobar identidad, cronología y versiones.
- William / Whilliam Gull: grafías diferentes en biografía.
- Vrymmir Borgernstâg: preservar diacríticos y contrastar variantes.
- No clasificar automáticamente «Cabeza de Oso» ni «Hueso de Sangre» como apellidos transferibles.
- El generador histórico original mezcla formas sin tipología onomástica acreditada.

## Próximos hitos

1. Completar inventario de archivos con estado: leído / extracción parcial / inaccesible / obsoleto / procedencia no acreditada.
2. Recuperar fuentes sobre apellidos y linajes eladrines.
3. Extraer registros con citas localizables y categoría de evidencia.
4. Conciliar cada registro con catálogos actuales, variantes y duplicados.
5. Preparar propuesta editorial de combinación; **sin implementar** hasta validación.

## Política de actualización

Añadir una entrada fechada por sesión, enlaces a fuentes y distinción entre hechos comprobados e hipótesis. No usar esta rama para cambios de producción.


### 2026-11-02 — Segunda sesión: contraste histórico, regional y documental

- Leída en Biblioteca «Trasfondo - Historia de Gylran.md», documento canónico que sustituye tres fuentes antiguas. Extraídos **Lathandos Snave, Käbrius Festus, Belril Sierpercana y Caefyn Verdimbre**; no se prueba vigencia contemporánea de los segundos componentes.
- Revisados «Historia de Shadaleen», «Zonas de Ylat», «Susurros en Isophius», «Historia de Malasthar», «Historia de Nulsärax» y «El Imperio de Laventia»; consolidados ejemplos con sus condiciones en [catalogo-provisional.md](catalogo-provisional.md).
- Documentado el carácter de familias de los **Orovecchio** y los **Gull**; diferenciados los linajes sacros **Terrana/Maren/Caelis** (historia de Malasthar, provisional) y los apellidos cuya función sigue sin certificar.
- Verificadas las formas **Saewig Rowes** (Historia de Shadaleen) frente a **Saewig Shadelgast** (tesauro): no fusionar automáticamente. Hallada divergencia histórica entre el relato genealógico shadalense y la versión interna «La Primera Huella» sobre la denominación Shadelgast.
- Búsqueda literal en los cuatro JSON de nombres existentes: 24 términos de interés nuevos no aparecen; la ausencia **no** acredita su inclusión automática.
- Revisados mediante extracción local 16 documentos DOCX de reglas y ambientación asociados al proyecto; se detectaron principalmente usos mecánicos de «linaje», sin un sistema general de apellidos equiparable a las fuentes de historia. No se han alterado.
- La lectura directa de «Apellidos eladrines en Erklan.txt» y «Linajes eladrines.txt» falla por codificación en el conector; ambas fuentes continúan marcadas como **no leídas**.
- **Hallazgo de recuperación:** encontrada una copia Markdown de la antigua wiki de [Apellidos eladrines en Erklan](https://drive.google.com/file/d/1brBjcXrRFz2slCSSEuw7m78Y8pBLT5v6/view). Expone la estructura de apellidos ligada a fenómenos atmosféricos y orden de nacimiento; documentada en sección H del catálogo.
- Contrastadas fichas antiguas: [Aerandil del Atardecer Refulgente](https://drive.google.com/file/d/1q2AGQap3uCdFgwyS6CwGf_FiLB5Xbrur/view), [Anasthore del Atardecer Luciente](https://drive.google.com/file/d/1rV6rEjO_Sy2kiollOgJtvKfYbSlTRTZG/view) y [Casa Adorasol](https://drive.google.com/file/d/1I_g1ni_qIrJXGcEteIfs2xQchUCgKlDd/view). **Discrepancia:** en la nota antigua Aerandil aparece como «del Atardecer Brillante», mientras en dos fichas aparece «del Atardecer Refulgente».
- La ficha de Galeshra Adorasol documenta **migración de la familia desde Qelasthavia a Erklan**, por lo que su apellido no puede atribuirse como originario de Erklan sin matices.
- Ningún JSON ni archivo ejecutable de la aplicación ha sido modificado. No se ha abierto PR ni desplegado LIVE.

**Documentos de trabajo:** [catálogo provisional](catalogo-provisional.md).  
**Decisiones pendientes:** nombre canónico de Aerandil; utilización de apellidos históricos y de casas nobles; validez actual de la convención eladrín; función de membresía en Casa Adorasol.


### 2026-11-02 — Inventario y revisión de la Casa Gull

- Registradas carpetas y estado de lectura en [inventario-fuentes.md](inventario-fuentes.md).
- Revisado el documento `Sir William White Gull.docx`: existen formas William y Whilliam para el mismo personaje, y una discrepancia John William / John Gull para su padre. El término White solo está en el título del archivo, no en el texto.
- Detalles y referencias en [catalogo-provisional.md](catalogo-provisional.md), sección I.
- Persisten bloqueos de lectura en dos TXT eladrines. Se mantienen las decisiones editoriales pendientes.
- Sin modificaciones de datos, código, despliegues o PR.


### 2026-11-02 — Tercera sesión: censos de PNJ, linajes acreditados y recuperación de los TXT

1. **Recuperación de censo:** leídos [`dnd_npcs.xlsx`](https://drive.google.com/file/d/1B2YnVslAK7Sjd5ELYR9kteHB9Q-L4AWp/view) (140 PNJ en dos pestañas) y [`npcs.xlsx`](https://drive.google.com/file/d/1g-y0abx5rnOJpiSv8vJsE_iv6V-fOLVR/view) (66 identidades con datos, 99 posiciones totales). La comparación por identificador interno conserva las 66 identidades; 65 formas visibles coinciden y una cambia de nombre.
2. **Hallazgo de alias:** el mismo personaje `url=crujidor` consta como **Romualdius Walerian** en la hoja más antigua y como **Crujidor** en la nueva. La biografía lo acredita como apodo. Se corrige así la falsa apariencia de personaje perdido.
3. **Clasificación:** los 140 PNJ tienen 126 campos `surname` no vacíos y 97 valores distintos, pero hay ordinales, alias, apodos y marcadores: no alimentar el generador directamente. Publicado el [censo de 140 PNJ](censo-pnj-historico.md) con procedencia y marcas de revisión.
4. **Genealogía:** documentados parentescos en once núcleos familiares y pertenencia familiar sin relaciones completas en Alogers/Shadelgast. Creado [familias-acreditadas.md](familias-acreditadas.md).
5. **Discrepancia Skara:** el padre de Tuliëlle es **Dyeld** según su propio relato, «Tuliëlle Skara I» y la biografía de Laevinë, pero **Eldburg** según la ficha individual homónima. No unificar ni corregir sin decisión.
6. **Banco histórico:** comparación normalizada de las 1422 formas únicas del banco de nombres contra los 140 PNJ: 16 coincidencias con nombres de pila y 2 con valores de segundo componente (Iraldsay y Beld). El solapamiento muestra usos distintos, no da reglas automáticas de clasificación.
7. **Fuentes eladrines desbloqueadas:** descargados los originales [`Apellidos eladrines en Erklan.txt`](https://drive.google.com/file/d/1YVanaM-4ThS94W-qY3NFShmNE6Klbmj7/view) y [`Linajes eladrines.txt`](https://drive.google.com/file/d/1J1uHzpl9DqyLVrsoes73N3_u6sclPCXB/view), ambos codificados en **Windows-1252**. Leídos íntegramente, contrastados por líneas y huellas SHA-256; [cotejo documentado](fuentes-eladrines-cotejo.md). Ambos dan **Brillante** para Aerandil, frente a **Refulgente** en su ficha y en el censo; los valores CD de las notas están intercambiados entre versiones (no convertir a reglas d20).
8. **Isophius:** examinados [`DocumentacionIsophius.odt`](https://drive.google.com/file/d/1js4SQFdk7xry3Q6OsGn2rWfD7t37nmc4/view), [`DatosIsophius.ods`](https://drive.google.com/file/d/1phFBXkKkmBA_0u7wIGDGD7LM3gyxMzep/view) y las respuestas del formulario de creación, limitándose a nombres ficticios, **sin datos personales**. Se corrobora la Casa Orovecchio en Piedrahundida; en materiales de campaña aparecen **Drake Orovecchio**, **Gerad Orovecchio** y el hijo adoptivo **Alim de Mostaganem**. Se documentó en [isophius-fuentes-campana.md](isophius-fuentes-campana.md).
9. **Repositorios:** revisados y actualizados [inventario-fuentes.md](inventario-fuentes.md), [catalogo-provisional.md](catalogo-provisional.md), y ampliado [familias-acreditadas.md](familias-acreditadas.md). La documentación antigua de archivos TXT «inaccesibles» queda supersedida por las entradas fechadas de hoy.

**Cambios técnicos:** solo documentación en `docs/investigacion-onomastica-ylat/`. Sin edición de JSON de producción, código, pruebas de la aplicación, PR ni LIVE.

**Pendiente de decisión editorial:** Aerandil Brillante/Refulgente; Dyeld/Eldburg Skara; incorporación o no de genealogías de campañas antiguas frente al canon actual; reglas restrictivas de casas nobles, adopción y nombres históricos.
