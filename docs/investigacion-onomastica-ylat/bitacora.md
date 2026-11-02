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
