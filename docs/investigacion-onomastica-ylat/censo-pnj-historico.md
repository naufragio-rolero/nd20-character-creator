# Censo de PNJ de Ylat — extracción documental (140 registros)

**Fecha:** 2026-11-02  
**Estado:** registro de testimonios de una fuente histórica, no repertorio aprobado del generador.

## Fuente y trazabilidad

- Archivo fuente: [`dnd_npcs.xlsx` en Google Drive](https://drive.google.com/file/d/1B2YnVslAK7Sjd5ELYR9kteHB9Q-L4AWp/view). Contiene dos pestañas con **140 registros de personaje** cada una; la segunda aporta `name`, `surname`, `full_name`, `url`, `Especie`, `campaign` y `origin`. Los valores se han conservado.
- Archivo de contraste: [`npcs.xlsx` en Google Drive](https://drive.google.com/file/d/1g-y0abx5rnOJpiSv8vJsE_iv6V-fOLVR/view), 66 personajes identificables en 99 posiciones de la primera pestaña.
- **No deducción canónica:** la columna `surname` mezcla apellidos, epítetos, ordinales y marcadores. Las 140 filas **no** representan 140 nombres de pila y apellidos libres para generar. `origin=101` es un código sin glosa interpretativa acreditada; los testimonios se analizan por su pertenencia concreta a las campañas de Ylat.
- La columna `Campaña` se ha tomado de la primera pestaña de `dnd_npcs.xlsx` porque incluye `Pasado` para dos registros que están vacíos en la segunda; no se ha inventado el valor.

## Resultados de la extracción

- **140 personajes**, todos con `url` interno distinto y sin nombres completos duplicados en la pestaña estructurada.
- **126** con `surname` no vacío; **14** sin segundo componente.
- **97** valores de `surname` no vacíos distintos, contados literalmente; **NO equivalen a 97 apellidos confirmados**.
- Campañas según primera pestaña: **76 Era Rasa**, **50 Casus Belli** y **14 Pasado**.
- Fuentes **no** contienen las cadenas literales `Niguace` o `Niguaze`; no basta para certificar individualmente que todos los nombres sean aptos para el repertorio.
- Contraste de identificadores internos con `npcs.xlsx`: **66/66 identidades conservadas**, **65 formas de presentación idénticas**, **1 identidad renombrada** (véase más abajo).

## Caso excepcional: nombre civil frente a alias

La identidad `url=crujidor` figura como **Romualdius Walerian** en el `npcs.xlsx` antiguo, pero como **Crujidor** (sin campo apellido) en `dnd_npcs.xlsx`. Ambas versiones conservan la misma biografía, que explica expresamente que Crujidor es un apodo ganado posteriormente.

**Registro recomendado, todavía sin aprobar:** nombre civil `Romualdius`; apellido de nombre civil `Walerian`; alias de uso `Crujidor`; identificador `crujidor`. No sustituir una identidad por otra ni deducir que `Crujidor` es un nombre de pila.

Otros ejemplos que impiden la importación literal a un generador de apellidos:

- `Galibard Shadelgast II`: numeral dinástico incorporado al campo `surname`.
- `Adhat la Tuerta` y `Hiyael el Huérfano`: formas de epíteto en el campo `surname`.
- `Neyney sin Apellido`: marcador literal, **no apellido**.
- `Aerandil del Atardecer Refulgente` y `Anasthore del Atardecer Luciente`: convención eladrín vinculada a filiación y nacimiento; consultar [catálogo provisional](catalogo-provisional.md).
- `Tegku Bagui Fénix`, `Ybardonydd Acomanydd Unerrannor` y `Gorgan Hueso de Sangre`: fórmulas pluriverbales que requieren contexto; no segmentar automáticamente.

## Extracción íntegra

Los campos de nombre y apellido que siguen proceden **textualmente** del archivo. La observación de revisión es una marca técnica de prudencia, no una clasificación cultural ni una corrección del texto.

| N.º fuente | Nombre completo | Nombre (campo) | Segundo componente (campo surname) | Especie | Campaña | Referencia interna | Observación |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 40 | Abdul Hassif | Abdul | Hassif | Humano | Era Rasa | `abdul` | Por verificar |
| 39 | Acathia Masticadedos | Acathia | Masticadedos | Semiorca | Era Rasa | `acathia` | Por verificar |
| 84 | Adaldust Alogers | Adaldust | Alogers | Humano | Era Rasa | `adaldust` | Por verificar |
| 11 | Addare Skara | Addare | Skara | Humano | Pasado | `addare` | Por verificar |
| 31 | Adhat la Tuerta | Adhat | la Tuerta | Humano | Era Rasa | `adhat` | Posible epíteto: revisar |
| 107 | Aerandil del Atardecer Refulgente | Aerandil | del Atardecer Refulgente | Eladrín | Era Rasa | `aerandil` | Fórmula compuesta: revisar |
| 104 | Akestu Fiercespada | Akestu | Fiercespada | Dracónido | Era Rasa | `akestu` | Por verificar |
| 97 | Albert Lobeth | Albert | Lobeth | Humano | Era Rasa | `albert_lobeth` | Por verificar |
| 105 | Anasthore del Atardecer Luciente | Anasthore | del Atardecer Luciente | Eladrín | Era Rasa | `anasthore` | Fórmula compuesta: revisar |
| 131 | Anfingrem Sigvald | Anfingrem | Sigvald | Tiflin | Pasado | `anfingrem` | Por verificar |
| 139 | Aradale Iraldsay | Aradale | Iraldsay | Humano | Casus Belli | `aradale` | Por verificar |
| 28 | Asharod Nerese | Asharod | Nerese | Humano | Casus Belli | `asharod` | Por verificar |
| 33 | Aurelius Ryszard | Aurelius | Ryszard | Enano | Era Rasa | `aurelius` | Por verificar |
| 121 | Awara Tonunt | Awara | Tonunt | Humano | Era Rasa | `awara` | Por verificar |
| 136 | Azael | Azael | — | Demonio | Era Rasa | `azael` | Sin componente |
| 71 | Balthyr Maplewilde | Balthyr | Maplewilde | Semielfo | Casus Belli | `maplewilde` | Por verificar |
| 55 | Banelm Samdaw | Banelm | Samdaw | Humano | Casus Belli | `banelm` | Por verificar |
| 20 | Bankingar Sonascama | Bankingar | Sonascama | Kóbold | Era Rasa | `bankingar` | Por verificar |
| 19 | Baryn Violatesoros | Baryn | Violatesoros | Humano | Era Rasa | `baryn` | Por verificar |
| 30 | Besyl Noccerado | Besyl | Noccerado | Humano | Era Rasa | `besyl` | Por verificar |
| 134 | Cabal Sireg | Cabal | Sireg | Humano | Casus Belli | `cabal` | Por verificar |
| 82 | Caelia Fulgentis | Caelia | Fulgentis | Humano | Era Rasa | `caelia` | Por verificar |
| 99 | Caeloen Leahein | Caeloen | Leahein | Humano | Casus Belli | `caeloen` | Por verificar |
| 51 | Caisadi Fuegosombrío | Caisadi | Fuegosombrío | Tiflin | Era Rasa | `caisadi` | Por verificar |
| 100 | Car'rt Oq'uatee | Car'rt | Oq'uatee | Humano | Casus Belli | `carrt` | Por verificar |
| 45 | Caramierda | Caramierda | — | Goblin | Era Rasa | `caramierda` | Sin componente |
| 27 | Celebriän Brisaolvidada | Celebriän | Brisaolvidada | Elfo | Casus Belli | `celebrian` | Por verificar |
| 37 | Chrachack Fiercespada | Chrachack | Fiercespada | Dracónido | Era Rasa | `chrachack` | Por verificar |
| 130 | Chred Nichols | Chred | Nichols | Humano | Casus Belli | `chred` | Por verificar |
| 6 | Ciale Iraldsay | Ciale | Iraldsay | Humano | Casus Belli | `ciale` | Por verificar |
| 108 | Cromust Fiercespada | Cromust | Fiercespada | Dracónido | Era Rasa | `cromust` | Por verificar |
| 77 | Crujidor | Crujidor | — | Humano | Era Rasa | `crujidor` | Sin componente |
| 106 | Daeron Vardamir | Daeron | Vardamir | Semielfo | Pasado | `daeron` | Por verificar |
| 1 | Damien Holdt | Damien | Holdt | Humano | Era Rasa | `damien` | Por verificar |
| 120 | Dan | Dan | — | Humano | Era Rasa | `dan` | Sin componente |
| 10 | Daniel Alswick | Daniel | Alswick | Humano | Casus Belli | `alswick` | Por verificar |
| 128 | Darelon Thrathal | Darelon | Thrathal | Enano | Casus Belli | `darelon` | Por verificar |
| 22 | Delril Torgal | Delril | Torgal | Enano | Casus Belli | `delril` | Por verificar |
| 5 | Denhat Lobeth | Denhat | Lobeth | Humano | Casus Belli | `denhat` | Por verificar |
| 86 | Dianne Smoth | Dianne | Smoth | Humano | Era Rasa | `dianne` | Por verificar |
| 60 | Drazoath | Drazoath | — | Enano blanco | Pasado | `drazoath` | Sin componente |
| 74 | Drother Tasano | Drother | Tasano | Humano | Casus Belli | `drother` | Por verificar |
| 113 | Drut'Jaal | Drut'Jaal | — | Dracónido | Casus Belli | `drutjaal` | Sin componente |
| 57 | Eilinn Brillonuevo | Eilinn | Brillonuevo | Humano | Pasado | `eilinn` | Por verificar |
| 50 | Eld'mose Kinistis | Eld'mose | Kinistis | Mediano | Casus Belli | `eldmose` | Por verificar |
| 96 | Eldburg Skara | Eldburg | Skara | Semielfo | Era Rasa | `eldburg` | Por verificar |
| 32 | Elisia Jacenty | Elisia | Jacenty | Humano | Era Rasa | `elisia` | Por verificar |
| 114 | Elrohir Vardamir | Elrohir | Vardamir | Semielfo | Casus Belli | `elrohir` | Por verificar |
| 41 | Eman Iraldsay | Eman | Iraldsay | Humano | Casus Belli | `eman` | Por verificar |
| 3 | Engaw Brosul | Engaw | Brosul | Tiflin | Era Rasa | `engaw` | Por verificar |
| 43 | Eomdyn Noreesh | Eomdyn | Noreesh | Eladrín | Casus Belli | `eomdyn` | Por verificar |
| 8 | Essaetia Neulenthris | Essaetia | Neulenthris | Eladrín | Era Rasa | `essaetia` | Por verificar |
| 118 | Eurip Shadelgast | Eurip | Shadelgast | Humano | Era Rasa | `eurip` | Por verificar |
| 49 | Findorian Alcanzarríos | Findorian | Alcanzarríos | Elfo | Casus Belli | `findorian` | Por verificar |
| 119 | Fredián Alogers | Fredián | Alogers | Humano | Casus Belli | `fredian` | Por verificar |
| 124 | Galeshra Adorasol | Galeshra | Adorasol | Eladrín | Era Rasa | `galeshra` | Por verificar |
| 79 | Galibard Shadelgast | Galibard | Shadelgast | Humano | Pasado | `galibard1` | Por verificar |
| 80 | Galibard Shadelgast II | Galibard | Shadelgast II | Humano | Era Rasa | `galibard2` | Incluye ordinal: separar tratamiento |
| 68 | Gerad Silversea | Gerad | Silversea | Humano | Casus Belli | `gerad` | Por verificar |
| 109 | Gilraen Vardamir | Gilraen | Vardamir | Semielfo | Pasado | `gilraen` | Por verificar |
| 65 | Godogene Alogers | Godogene | Alogers | Humano | Era Rasa | `godogene` | Por verificar |
| 29 | Gorgan Hueso de Sangre | Gorgan | Hueso de Sangre | Hobgoblin | Era Rasa | `gorgan` | Componente pluriverbal: revisar |
| 62 | Góvan Gomelera | Góvan | Gomelera | Humano | Era Rasa | `govan` | Por verificar |
| 72 | Grogtk | Grogtk | — | Humano | Era Rasa | `grogtk` | Sin componente |
| 9 | Gulfrik | Gulfrik | — | Humano | Pasado | `gulfrik` | Sin componente |
| 85 | Gwilherm Smoth | Gwilherm | Smoth | Humano | Era Rasa | `gwilherm` | Por verificar |
| 95 | Hadewig Rocene | Hadewig | Rocene | Humano | Casus Belli | `hadewig` | Por verificar |
| 13 | Halor Pelocobre | Halor | Pelocobre | Enano | Casus Belli | `halor` | Por verificar |
| 36 | Hansus Bronnhum | Hansus | Bronnhum | Humano | Era Rasa | `hansus` | Por verificar |
| 44 | Hassad Fadel | Hassad | Fadel | Humano | Era Rasa | `hassad` | Por verificar |
| 34 | Havindrin Mantodorado | Havindrin | Mantodorado | Eladrín | Era Rasa | `havindrin` | Por verificar |
| 81 | Hermilda Shadelgast | Hermilda | Shadelgast | Humano | Era Rasa | `hermilda` | Por verificar |
| 140 | Hiller Iraldsay | Hiller | Iraldsay | Humano | Casus Belli | `hiller` | Por verificar |
| 112 | Hiyael el Huérfano | Hiyael | el Huérfano | Humano | Casus Belli | `hiyael` | Posible epíteto: revisar |
| 115 | Hyarion Vardamir | Hyarion | Vardamir | Elfo | Pasado | `hyarion` | Por verificar |
| 94 | Idfaseya Ysheasa | Idfaseya | Ysheasa | Humano | Casus Belli | `idfaseya` | Por verificar |
| 58 | Inether Lowees | Inether | Lowees | Humano | Era Rasa | `inether` | Por verificar |
| 47 | Isandra Bronnhum | Isandra | Bronnhum | Humano | Casus Belli | `isandra` | Por verificar |
| 12 | Isspol Tonunt | Isspol | Tonunt | Humano | Era Rasa | `isspol` | Por verificar |
| 63 | Jaleba Inversa | Jaleba | Inversa | Semielfo | Era Rasa | `jaleba` | Por verificar |
| 15 | Jérémie Alban | Jérémie | Alban | Humano | Pasado | `jeremie` | Por verificar |
| 127 | Jkoor Hiervescarcha | Jkoor | Hiervescarcha | Dracónido | Era Rasa | `jkoor` | Por verificar |
| 25 | Kineyie Gudrün | Kineyie | Gudrün | Humano | Era Rasa | `kineyie` | Por verificar |
| 123 | Kranthrom Hiendeacero | Kranthrom | Hiendeacero | Enano | Casus Belli | `kranthrom` | Por verificar |
| 116 | Kurzak Sendero Severo | Kurzak | Sendero Severo | Enano | Era Rasa | `kurzak` | Componente pluriverbal: revisar |
| 53 | Kutak | Kutak | — | Hobgoblin | Era Rasa | `kutak` | Sin componente |
| 52 | Laevinë Skara | Laevinë | Skara | Elfo | Pasado | `laevine` | Por verificar |
| 66 | Lazare Brice | Lazare | Brice | Humano | Era Rasa | `lazare` | Por verificar |
| 23 | Lorif Samasi | Lorif | Samasi | Mediano | Era Rasa | `lorif` | Por verificar |
| 2 | Loroohck Asheishi | Loroohck | Asheishi | Mediano | Casus Belli | `loroohck` | Por verificar |
| 54 | Lorss Duthmor | Lorss | Duthmor | Humano | Casus Belli | `lorss` | Por verificar |
| 102 | Luresse Gomelera | Luresse | Gomelera | Humano | Era Rasa | `luresse` | Por verificar |
| 76 | Mark Maxley | Mark | Maxley | Humano | Era Rasa | `mark` | Por verificar |
| 87 | Marlak Fuegosombrío | Marlak | Fuegosombrío | Tiflin | Era Rasa | `marlak` | Por verificar |
| 88 | Marten Lobeth | Marten | Lobeth | Humano | Era Rasa | `marten` | Por verificar |
| 91 | Martius Smoth | Martius | Smoth | Humano | Era Rasa | `martius` | Por verificar |
| 129 | Mashera Skara | Mashera | Skara | Semielfo | Era Rasa | `mashera` | Por verificar |
| 67 | Maverae Adorasol | Maverae | Adorasol | Eladrín | Era Rasa | `maverae` | Por verificar |
| 122 | Morgendärr | Morgendärr | — | Humano | Era Rasa | `morgendarr` | Sin componente |
| 38 | Muhammad Sossei | Muhammad | Sossei | Humano | Casus Belli | `muhammad` | Por verificar |
| 14 | Nabeel Ungesavia | Nabeel | Ungesavia | Humano | Era Rasa | `nabeel` | Por verificar |
| 138 | Naleale Iraldsay | Naleale | Iraldsay | Humano | Casus Belli | `naleale` | Por verificar |
| 18 | Nesaweyn Feebil | Nesaweyn | Feebil | Humano | Casus Belli | `nesaweyn` | Por verificar |
| 73 | Neyney sin Apellido | Neyney | sin Apellido | Mediano | Era Rasa | `neyney` | Literal «sin Apellido»: no es apellido |
| 125 | Nimara Vuelumbrío | Nimara | Vuelumbrío | Elfo | Era Rasa | `nimara` | Por verificar |
| 4 | Notorius Anverso | Notorius | Anverso | Gólem | Casus Belli | `notorius` | Por verificar |
| 117 | Nulsärax | Nulsärax | — | Dragón | Pasado | `nulsarax` | Sin componente |
| 89 | Oelmi Beld | Oelmi | Beld | Enano | Era Rasa | `oelmi` | Por verificar |
| 48 | Oenogs Roerraíces | Oenogs | Roerraíces | Semitrol | Era Rasa | `oenogs` | Por verificar |
| 75 | Ophilia Morcrick | Ophilia | Morcrick | Humano | Casus Belli | `ophilia` | Por verificar |
| 111 | Ork | Ork | — | Semiorco | Era Rasa | `ork` | Sin componente |
| 26 | Quaon Arianhrod | Quaon | Arianhrod | Humano | Era Rasa | `quaon` | Por verificar |
| 78 | Radinel Soplotenue | Radinel | Soplotenue | Elfo | Era Rasa | `radinel` | Por verificar |
| 132 | Rargar Ecala | Rargar | Ecala | Humano | Era Rasa | `rargar` | Por verificar |
| 35 | Roluj Buenacerveza | Roluj | Buenacerveza | Enano | Era Rasa | `roluj` | Por verificar |
| 61 | Ryn'Acki | Ryn'Acki | — | Dracónido | Era Rasa | `rynacki` | Sin componente |
| 101 | Sadyiya Falaz | Sadyiya | Falaz | Humano | Casus Belli | `sadyiya` | Por verificar |
| 90 | Sarata Lobeth | Sarata | Lobeth | Humano | Era Rasa | `sarata` | Por verificar |
| 110 | Sashka Norvvind | Sashka | Norvvind | Humano | Pasado | `sashka` | Por verificar |
| 137 | Señor Calcetines | Señor Calcetines | — | Gato | Era Rasa | `sr_calcetines` | Sin componente |
| 46 | Seruon el Esmeralda | Seruon | el Esmeralda | Mediano | Casus Belli | `seruon` | Posible epíteto: revisar |
| 103 | Sodyd Gomelera | Sodyd | Gomelera | Humano | Era Rasa | `sodyd` | Por verificar |
| 16 | Stasi Giovanni | Stasi | Giovanni | Redivivo | Era Rasa | `stasi` | Por verificar |
| 24 | Syssbel Valanthis | Syssbel | Valanthis | Eladrín | Casus Belli | `syssbel` | Por verificar |
| 69 | Tegku Bagui Fénix | Tegku | Bagui Fénix | Gatónido | Casus Belli | `tegku` | Componente pluriverbal: revisar |
| 42 | Ternus Arper | Ternus | Arper | Humano | Casus Belli | `ternus` | Por verificar |
| 126 | Thergan Ulvbane | Thergan | Ulvbane | Enano | Casus Belli | `thergan` | Por verificar |
| 98 | Treban Tepoel | Treban | Tepoel | Humano | Casus Belli | `treban` | Por verificar |
| 21 | Tyvoz Fluyeflauta | Tyvoz | Fluyeflauta | Humano | Era Rasa | `tyvoz` | Por verificar |
| 92 | Ubale Keefe | Ubale | Keefe | Humano | Casus Belli | `ubale` | Por verificar |
| 83 | Viktor Kultstein | Viktor | Kultstein | Humano | Era Rasa | `viktor` | Por verificar |
| 59 | Vrymmir Borgenrstâg | Vrymmir | Borgenrstâg | Enano | Era Rasa | `vrymmir` | Por verificar |
| 133 | Vysoben Veredron | Vysoben | Veredron | Humano | Casus Belli | `vysoben` | Por verificar |
| 7 | Warsam Nyser | Warsam | Nyser | Humano | Casus Belli | `warsam` | Por verificar |
| 64 | Werhilda Forjaplata | Werhilda | Forjaplata | Enano | Casus Belli | `werhilda` | Por verificar |
| 70 | Ybardonydd Acomanydd Unerrannor | Ybardonydd | Acomanydd Unerrannor | Humano | Casus Belli | `ybardonydd` | Componente pluriverbal: revisar |
| 93 | Yuno Lobeth | Yuno | Lobeth | Humano | Pasado | `yuno` | Por verificar |
| 135 | Zack Lobeth | Zack | Lobeth | Humano | Era Rasa | `zack` | Por verificar |
| 56 | Zarzik Ceñóseo | Zarzik | Ceñóseo | Semielfo | Casus Belli | `zarzik` | Por verificar |
| 17 | Zekogs Quiebrahielo | Zekogs | Quiebrahielo | Semitrol | Era Rasa | `zekogs` | Por verificar |

## Uso permitido de este anexo

- Evidenciar que un personaje y su denominación están documentados en el antiguo censo; cotejar con biografías, crónicas y otras fuentes rectoras.
- Identificar familias repetidas como posibles objetos de investigación, **no adjudicar parentesco por coincidencia nominal sin fuente**.
- Conservar grafías y apóstrofes, y registrar alias y variantes.
- No alimentar los JSON productivos de La Forja ni generar apellidos al azar a partir de `surname` sin aprobación.
