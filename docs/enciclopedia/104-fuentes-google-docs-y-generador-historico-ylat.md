# Forja 1.0 — Ampliación de fuentes onomásticas de Ylat: Google Docs y generador histórico

**Fecha de consulta:** 31/10/2026. **Estado:** auditoría documental, **no** publicación ni aprobación de nombres nuevos.  
**PR:** [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4), **draft**, sin fusionar ni desplegar.

## 1. Corrección de alcance del informe 103

El [informe 103](103-auditoria-onomastica-biblioteca-ylat.md) inventarió los **tres PDF visibles en la Biblioteca de ChatGPT `/Ylat`**, que suman 133 páginas. **Eso no era un inventario de todas las fuentes de Ylat accesibles en Google Drive**. Por indicación explícita del autor se ha inspeccionado además su **Drive conectado**, donde existe una carpeta independiente [Ylat](https://drive.google.com/drive/folders/1gUMXUshlfY1FKtghLv7BP58w2FyQf3wO) con varios niveles, y documentación de [Crónicas de Ylat](https://drive.google.com/drive/folders/1nMjeWrnilo9lLF9uSgHBauHaxu-lOfu0).

En particular, el subdirectorio [Trasfondo](https://drive.google.com/drive/folders/1BfYKJuhc3xtc2Egnrx2C28uD7qsHlQ_-) contiene **Google Docs de geografía, historia, lenguas y biografías**, así como un generador histórico de nombres. **No confundir la ruta de la Biblioteca `/Ylat` con la carpeta de Drive**, ni afirmar que un inventario de una superficie agota la otra.

## 2. Google Docs comprobados y qué acreditan

| Google Doc consultado (enlace vivo) | Utilidad para onomástica | Límite interpretativo |
|---|---|---|
| [Trasfondo — Zonas de Ylat](https://docs.google.com/document/d/1v6rZIEWMGLvhv6b5WHMNQa0zwCzrPTOdqZEU5t6USFg/edit) | Países, regiones, ciudades, gentilicios, poblaciones y Especies comunes; contextualiza Shadaleen, Malasthar, Murodros, Fanghis, Qelasthavia, etc. | Que una Especie sea «común» en una zona no permite atribuirle allí todos sus nombres, ni convertir la zona en un idioma. |
| [Trasfondo — Lenguas de Ylat](https://docs.google.com/document/d/1FhYWtfZHKoAlr9aQAFLCVej3Uc7s_sVKRp-dMjwsTN4/edit) | **Idiomas, dialectos y alfabetos** documentados; base útil para clasificar testimonios onomásticos. | **No** ofrece automáticamente un listado certificado de nombres propios para cada dialecto. |
| [Trasfondo — Historia de Shadaleen](https://docs.google.com/document/d/15LVdulBcuf62G6OPQKKCTHQWOHrqrGUAZO6DnXZJA2o/edit) | Orígenes de la monarquía y **Siete Familias**: Shadelgast, Bronnhum, Rowes, Alogers, Keefe, Dórilon y Kultstein. | Son **casas/linajes concretos**, no un saco de apellidos de libre asignación sin contexto. |
| [Biografías — Personajes Ylat](https://docs.google.com/document/d/1yOtB8nNvE9_jBDvITuXzFFFFNFAiJI6Z4hr6D_1pxaA/edit) | Ocho biografías con nombres completos, entre ellos Amadeus, Caelia Fulgentis, Naeis Shadelgast, Weeheem Pinnotix, Angus Burbridge, Vrymmir Borgernstâg, Astrid Sombralba y Bram Brasagorda. | Nombres de **personajes documentados**; no deben trasladarse de forma automática al generador de identidades nuevas. |
| [Trasfondo — Enciclopedia de Ylat](https://docs.google.com/document/d/11xNUoTcW7bBE3fq8wwBpmxIJmnfaZZnEeB9t47p1qKg/edit) | Eras, cosmogonía, contextos históricos y de especies; ayuda a evitar anacronismos y atribuciones sin referencia. | Los alcances entre versiones documentales pueden diferir; no forzar concordancia ni cambiar el canon por inferencia. |
| [Crónicas Ylat d20](https://docs.google.com/document/d/1hXKUA226Vwg2_J6L-naNRewebVQ0AzOQfMUWkcs6ZzI/edit) y [Adendo de Ylat](https://docs.google.com/document/d/12k-gF5FuCe4yFR4YV7JEiyqZ4G7ghqrAGBwJSgCmws0/edit) | Documentos nativos adicionales localizados en la carpeta de Crónicas. | **Localizados, pero no examinados en profundidad en este bloque**; no se atribuye ninguna conclusión de texto a estas fuentes. |

### Ejemplos de estructura lingüística real

El Google Doc **«Lenguas de Ylat»** distingue, entre otros:

- **Esserino:** dialectos shadalense central y oriental, ventisco, malasthino rural y metropolitano, arrocerio, neretteo artrexi y regal, éilero.
- **Guráltico:** azarí, ujibo y lumensolí.
- **Silvano:** erklaní, qelastaví, daelí, ghí, vilenní y zeqrí.
- **Lítico:** boca de la montaña (faust-hi, murodrí), boca de la jungla y gnómico.
- **Gramarán, cóbatur y purrense** como lenguas diferenciadas, con distintos hablantes según el texto.

Estos son **idiomas y dialectos publicados en un documento del autor**, no nuevos topónimos ni culturas inventadas. No se deduce una correspondencia nombre–idioma a partir de la mera semejanza fonética.

### Cruce entre «Zonas» y «Lenguas»

El documento de **Zonas** registra un gentilicio como *shadalense* para Shadaleen, *malasthino* para Malasthar, *qelastaví* para Qelasthavia, *murodrí* para Murodros y otros. El documento de **Lenguas** asocia algunos términos a dialectos. **El gentilicio, el territorio, la lengua y la procedencia individual deben almacenarse por separado**. Por ejemplo, «qelastaví» puede designar en textos distintos un gentilicio y una variedad silvana; eso no demuestra que cada elfo celestial del mundo use un único patrón de nombres.

### Precaución sobre cronología y versiones

«Zonas de Ylat» se presenta como información del año **1265 C. E.** y describe tres grandes masas continentales contando una tierra desconocida; «Enciclopedia de Ylat», en el pasaje de la Era del Maná, menciona **dos grandes continentes conocidos, Esseria y Guroalt**. No se deben reconciliar ambas formulaciones eliminando una referencia sin examinar fecha, alcance y versión editorial; pueden estar describiendo criterios distintos.

## 3. Descubrimiento clave: generador histórico de nombres

Dentro de **Trasfondo** está [Generador — Nombres (Principal).xlsx](https://docs.google.com/spreadsheets/d/1ImXMEU0Lb03l7TdRo7vr8E4X2IQrlmmQ/edit), un **archivo Excel guardado en Drive, no un Google Doc nativo**. Su estructura fue leída con el conector de Drive, sin modificarla:

- Se reconoce una columna **`ID.6` / `Nombre.6`** correspondiente al repertorio **Ylat**.
- Contiene **1428 filas con identificador y valor** (`1` a `1428`).
- Al recortar espacios externos hay **1422 valores distintos**, con **seis repeticiones**: **Chator, Crit, Oughios, Enotia, Sulaos y Lyeytia**.
- Ejemplos literales de la tabla: **Quaon, Oyero, Oinao, Blicernys, Aormu, Angck, Taiom, Whed, Burldra, Eman, Rayeh, Arada, Isther, Pysohu, Uado**.
- El mismo archivo alberga material de generadores «Americano», «Ruso», «Árabe» y «Vikingo». No debemos confundir sus otras columnas con un repertorio de Ylat.
- **Pendiente de verificar:** si cada entrada de la columna Ylat es nombre de pila, apellido, palabra reusable, apodo o material no apto para uso aleatorio; si posee atribuciones culturales documentadas y cuál es su canon o estado editorial.

**Consecuencia:** los **149 nombres combinados actuales de Forja** no agotan ni representan todo el material onomástico disponible. **No incorporar automáticamente las 1428 entradas**: primero hay que deduplicarlas con trazabilidad, preservar las formas originales, comprobar su naturaleza, procedencia y restricciones de publicación.

## 4. Modelo de trabajo respaldado por fuentes

**Separar expresamente cinco conceptos:**

1. **Testimonio:** nombre literal, documento/archivo/URL, pasaje o sección de origen, variante ortográfica.
2. **Identidad:** personaje canónico, nombre o apellido testimonial, linaje/casa, propuesta no canónica; no mezclar estas categorías.
3. **Geografía:** nacimiento/origen explícito, residencia, zona donde transcurre la aventura, gentilicio.
4. **Lengua:** idioma y dialecto **solo si está documentado** para el caso, nunca inferido por especie u ortografía aislada.
5. **Uso en Forja:** autorizado para generar personajes nuevos, reservado a personajes documentados, pendiente de cotejo o excluido por implicaciones de linaje.

Las biografías, las áreas geográficas y los idiomas se consultan como fuentes complementarias. **Una entrada de «Niguace» sigue siendo un testimonio encontrado en una obra sobre Niguace, no prueba de identidad cultural niguacense.**

## 5. Consecuencias inmediatas para el repositorio

- **Se mantienen publicados solamente los 149 nombres combinados expresamente aprobados**, sin alterar su corpus de procedencia. Los 51 nombres de personajes documentados continúan fuera del paquete DRS.
- No se incorporan aún las 1428 entradas históricas al catálogo público ni se cambia el comportamiento probado del generador.
- El anterior [informe 103](103-auditoria-onomastica-biblioteca-ylat.md) queda actualizado por esta investigación en Drive y no debe describirse como un inventario completo de **todas** las fuentes de Ylat.
- Antes de ampliar el generador, construir un índice trazable que cruce **Zonas**, **Lenguas**, **Biografías**, **Historia de Shadaleen** y el generador Excel, diferenciando los nombres de personas reales de Ylat de los componentes onomásticos reutilizables.
- **No inventar grafías, atribuciones dialectales o genealogías** hasta poder verificarlas.

## Estado

**Auditoría documental ampliada: completada para las cinco fuentes nativas principales enumeradas, con una primera inspección estructural del generador Excel.** No constituye inventario exhaustivo del Drive ni aprobación para publicar nuevos nombres.

**PR #4 sigue en borrador. No se ha fusionado ni desplegado contenido; las fuentes Google Docs y el Excel no se han modificado.**
