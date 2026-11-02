# Auditoría crítica del tesauro de nombres de Ylat (19 documentados + 33 combinados)

**Corte:** 2026-11-02. **Fuente de producción, solo lectura:** [`data/tesauro-ylat.json`](../../data/tesauro-ylat.json), rama `main`. **Estado:** investigación editorial; **no se han modificado** el JSON ni el generador. Esta revisión no equipara una entrada `documentado` a antropónimo humano, ni considera una entrada `combinado` un personaje canónico.

## 1. Resultado cuantitativo sin exclusiones ocultas

| Bloque | Registros | Diagnóstico |
| --- | ---: | --- |
| `documentado`: nombres de persona o personaje | **17** | Fuente de personaje; no implica que cada componente sea apellido o nombre libre |
| `documentado`: **localización** | **1** | **Máthair Felsaer** es montaña; no antropónimo en la fuente de Ylat consultada |
| `documentado`: **animal** | **1** | **Pietro** es el oso de Drakabel en la narración consultada |
| `combinado`: primer componente procedente de lugar o animal | **4** | Dos usan Máthair y dos Pietro; se debe bloquear si el requisito es nombre de persona |
| `combinado`: topónimo usado como segundo componente sin norma documentada | **3** | Terminan en Felsaer |
| `combinado`: apellido de casa/linaje acreditado sin vínculo del nuevo titular | **7** | **3 Shadelgast**, **4 Boll** |
| `combinado`: otras combinaciones sin norma específica de apellido acreditada | **19** | Potencial creativo, **no personaje ni genealogía documentados** |
| **Total** | **52** | **19 documentados + 33 combinados**. Grupos de combinados excluyentes por prioridad de auditoría |

## 2. Inventario íntegro de 19 registros `documentado`

| ID | Denominación literal | Tipo de entidad acreditado en el corpus contrastado | Evidencia / límite |
| --- | --- | --- | --- |
| `ylat-d033` | Nilsea | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1P5-qBVMOHrWrl3dFzcC3d5S1BLt9pIWg/view): PJ rusalka ribereña, Ylat³. |
| `ylat-d034` | Kalzifer | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1ZaP4l6s13HCU70BaVL9Qt-6eeIK1HHHW/view): PJ enano selvático, Ylat³. |
| `ylat-d035` | Oiam Orbem | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1cHv4UkpRvmzcW8q-4dNzJ0TeFBcrKuy0/view): PJ elfo celestial, Ylat³. |
| `ylat-d036` | Xandor Tugg | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1EhlPuHp6qON6FzcT6kN_f4sv3s2Y2yLz/view): PJ elfo blanco, Ylat³. |
| `ylat-d037` | Noron Cabeza de Oso | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1jeoz127YeB0hA6hzRXuFHi-6mUTLrA8M/view): PJ enano, Ylat³; **Cabeza de Oso** no está demostrado como apellido familiar. |
| `ylat-d038` | Kharan Boll | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1gTNBmn8BE6PB5hF59NFBnwgzALdf0LT0/view): PJ humano shadalense, Ylat³; Casa Boll. |
| `ylat-d039` | Drakabel | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/1df2gHADj7O-g8kZSi39vLG2l-NO7aOIa/view): PJ dracónida, Ylat³; nombre unitario. |
| `ylat-d040` | Tanto | **P (personaje o nombre de personaje)** | [Ficha](https://drive.google.com/file/d/10iqUONbTT-zkZf__Qk-6n10k-PBNMF6j/view): PJ mediano jóbito, Ylat³; nombre unitario. |
| `ylat-d041` | Gorgan Hueso de Sangre | **P (personaje o nombre de personaje)** | [Índice Era Rasa](https://drive.google.com/file/d/12-j5jC9uJOfi91Q0BRpmT9cXEd9s_htM/view), personaje; segundo componente no probado como apellido transferible. |
| `ylat-d042` | Kutak | **P (personaje o nombre de personaje)** | [Índice Era Rasa](https://drive.google.com/file/d/12-j5jC9uJOfi91Q0BRpmT9cXEd9s_htM/view); nombre unitario. |
| `ylat-d043` | Abdul | **P (personaje o nombre de personaje)** | [Índice Era Rasa](https://drive.google.com/file/d/12-j5jC9uJOfi91Q0BRpmT9cXEd9s_htM/view); también Abdul Hassif en fichas, no inferir que Abdul sea apellido. |
| `ylat-d044` | Thingrim | **P (personaje o nombre de personaje)** | [Ficha Thingrim Lockbruck en Ylat³](https://drive.google.com/file/d/1kCt-90s99v1UkArlqI3caOQBvxebTw4F/view); otro Thingrim en Ylat¹. |
| `ylat-d045` | Lazare Brice | **P (personaje o nombre de personaje)** | [Fichas Ylat¹](https://drive.google.com/file/d/1rGblTDtw0DYyY5P79cWbWQJ5MB8jKWnQ/view) y [Ylat³](https://drive.google.com/file/d/1z5R53EpEgWTD7cfauK9Gy_W5_sEZA3Wq/view). |
| `ylat-d046` | Joseph Williams | **P (personaje o nombre de personaje)** | [«Carrera para el fin del mundo»](https://drive.google.com/file/d/14io6IofuStSQOOAIrR7ujeDUoJ_qWikz/view), escena [46]: caballero humano contratado de guardia. |
| `ylat-d047` | Saewig Shadelgast | **P (personaje o nombre de personaje)** | [«El decadente Circo Labrice»](https://drive.google.com/file/d/1R1ukaNGzFJYst3z1TzG7NrhsOZOedr-z/view), Ylat³; discrepancia **Saewig Rowes** en la historia de Shadaleen. |
| `ylat-d048` | Jeremie Alban | **P (personaje o nombre de personaje)** | [Jérémie Alban](https://drive.google.com/file/d/18TudAN1uYy9pyVQ87YGiMbK608RU11lV/view), variante de acento; filiación del apellido sin confirmar. |
| `ylat-d049` | Máthair Felsaer | **L (lugar)** | **LOCALIZACIÓN:** [ficha Máthair Felsaer](https://drive.google.com/file/d/1kTIO-sZcM1-YQMiIsxjB4IwX8WJv3Kha/view), tipo Localización, montaña. [«Carrera para el fin del mundo»](https://drive.google.com/file/d/14io6IofuStSQOOAIrR7ujeDUoJ_qWikz/view) la enumera bajo Lugares. |
| `ylat-d050` | Vaelar Eldarien | **P (personaje o nombre de personaje)** | [Vaelar Ylat¹](https://drive.google.com/file/d/136DT4cAGmNPjqdU-TYzHjpvJpAnGB2HD/view) y [Ylat³](https://drive.google.com/file/d/1KFLLgAEUOOj4N1862IZO9hx9dwaxJniF/view); **ID vaelar en las dos fichas**. |
| `ylat-d051` | Pietro | **Z (animal)** | **ANIMAL:** [«Carrera para el fin del mundo»](https://drive.google.com/file/d/14io6IofuStSQOOAIrR7ujeDUoJ_qWikz/view), segmento [56]: se identifica expresamente como **oso de Drakabel**. |

**Precisión sobre el PDF:** los números de página asociados a estas entradas proceden de la metadata del JSON. En esta auditoría **no se ha vuelto a analizar el PDF visualmente**. El carácter de **montaña** de Máthair Felsaer lo establece directamente la [ficha de Ylat](https://drive.google.com/file/d/1kTIO-sZcM1-YQMiIsxjB4IwX8WJv3Kha/view), que dice `Tipo: Localización` y `Etiquetas: Montaña`, y el índice de **Lugares** de [«Carrera para el fin del mundo»](https://drive.google.com/file/d/14io6IofuStSQOOAIrR7ujeDUoJ_qWikz/view). El carácter de **oso de Drakabel** de Pietro lo establece el relato de esa aventura en el fragmento [56]. La fuente es de Ylat, **pero su clase de entidad no es la esperada para un nombre personal**.

## 3. Inventario íntegro de 33 registros `combinado`

**Categorías de revisión de esta tabla (mutuamente excluyentes):** **E** = primer elemento procede de lugar/animal (4); **T** = topónimo en segundo componente (3); **F** = familia/casa acreditada usada por un titular nuevo (7); **I** = combinación sin regla onomástica familiar acreditada (19). **No son niveles de gravedad de una infracción del reglamento**: son necesidades de evidencia y decisión editorial.

| ID | Combinación que consta en `main` | Componentes originales | Grupo | Revisión necesaria |
| --- | --- | --- | :---: | --- |
| `ylat-c001` | Nilsea Orbem | `Nilsea` + `Orbem` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c006` | Tanto Cabeza de Oso | `Tanto` + `Cabeza de Oso` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c009` | Abdul Boll | `Abdul` + `Boll` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c012` | Saewig Hueso de Sangre | `Saewig` + `Hueso de Sangre` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c015` | Vaelar Brice | `Vaelar` + `Brice` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c018` | Oiam Williams | `Oiam` + `Williams` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c021` | Kharan Shadelgast | `Kharan` + `Shadelgast` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c024` | Kutak Alban | `Kutak` + `Alban` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c026` | Lazare Felsaer | `Lazare` + `Felsaer` | **T** | Segundo componente procede de un **topónimo**, sin evidencia de uso como apellido. |
| `ylat-c029` | Máthair Eldarien | `Máthair` + `Eldarien` | **E** | Primer componente procede de **lugar** o **animal**, no antropónimo de una persona documentada. |
| `ylat-c034` | Noron Tugg | `Noron` + `Tugg` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c039` | Thingrim Boll | `Thingrim` + `Boll` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c044` | Pietro Brice | `Pietro` + `Brice` | **E** | Primer componente procede de **lugar** o **animal**, no antropónimo de una persona documentada. |
| `ylat-c049` | Drakabel Shadelgast | `Drakabel` + `Shadelgast` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c054` | Joseph Felsaer | `Joseph` + `Felsaer` | **T** | Segundo componente procede de un **topónimo**, sin evidencia de uso como apellido. |
| `ylat-c059` | Kalzifer Orbem | `Kalzifer` + `Orbem` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c064` | Gorgan Cabeza de Oso | `Gorgan` + `Cabeza de Oso` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c069` | Jeremie Hueso de Sangre | `Jeremie` + `Hueso de Sangre` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c074` | Xandor Williams | `Xandor` + `Williams` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c079` | Abdul Alban | `Abdul` + `Alban` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c088` | Kharan Tugg | `Kharan` + `Tugg` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c092` | Lazare Boll | `Lazare` + `Boll` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c097` | Nilsea Brice | `Nilsea` + `Brice` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c102` | Tanto Shadelgast | `Tanto` + `Shadelgast` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c107` | Saewig Felsaer | `Saewig` + `Felsaer` | **T** | Segundo componente procede de un **topónimo**, sin evidencia de uso como apellido. |
| `ylat-c116` | Kutak Cabeza de Oso | `Kutak` + `Cabeza de Oso` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c121` | Máthair Hueso de Sangre | `Máthair` + `Hueso de Sangre` | **E** | Primer componente procede de **lugar** o **animal**, no antropónimo de una persona documentada. |
| `ylat-c125` | Noron Williams | `Noron` + `Williams` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c130` | Thingrim Alban | `Thingrim` + `Alban` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c135` | Pietro Eldarien | `Pietro` + `Eldarien` | **E** | Primer componente procede de **lugar** o **animal**, no antropónimo de una persona documentada. |
| `ylat-c139` | Drakabel Tugg | `Drakabel` + `Tugg` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |
| `ylat-c144` | Joseph Boll | `Joseph` + `Boll` | **F** | Combinación atribuye un **apellido de familia/casa acreditada** a un personaje sin vínculo probado. |
| `ylat-c148` | Kalzifer Brice | `Kalzifer` + `Brice` | **I** | Segundo componente de un nombre documentado, pero **sin regla familiar de combinación acreditada**. No significa error del nombre original. |

## 4. Tipificación independiente de los once segundos componentes usados en esas 33 combinaciones

| Segundo componente | Nº de combinaciones | Estado documental | Fuente concreta |
| --- | ---: | --- | --- |
| Boll | 4 | F — casa documentada | [Casa Boll](https://drive.google.com/file/d/1Z6U0pbk9NXdfC4EBDUfZumSSJ0WsxvUr/view), [Kharan Boll](https://drive.google.com/file/d/1gTNBmn8BE6PB5hF59NFBnwgzALdf0LT0/view). No consta que los nuevos portadores pertenezcan a la familia. |
| Shadelgast | 3 | F — linaje dinástico documentado | [Historia de Shadaleen](https://docs.google.com/document/d/15LVdulBcuf62G6OPQKKCTHQWOHrqrGUAZO6DnXZJA2o/edit); sin vínculo documentado de los titulares nuevos. |
| Felsaer | 3 | T — topónimo sin regla antroponímica | [Máthair Felsaer](https://drive.google.com/file/d/1kTIO-sZcM1-YQMiIsxjB4IwX8WJv3Kha/view) es montaña; no se ha documentado el uso independiente Felsaer como apellido familiar. |
| Brice | 4 | I — segundo componente de personaje, herencia no probada | [Lazare Brice](https://drive.google.com/file/d/1z5R53EpEgWTD7cfauK9Gy_W5_sEZA3Wq/view); no familia Brice documentada. |
| Alban | 3 | I — segundo componente y topónimo institucional | [Jérémie Alban](https://drive.google.com/file/d/18TudAN1uYy9pyVQ87YGiMbK608RU11lV/view) y [Cripta de los Alban](https://drive.google.com/file/d/1UPPEaUxiRtfAPwFem3Vw9ysVrqVucY3b/view); no se ha acreditado linaje Alban. |
| Cabeza de Oso | 3 | E — epíteto o segundo componente sin herencia probada | [Noron Cabeza de Oso](https://drive.google.com/file/d/1jeoz127YeB0hA6hzRXuFHi-6mUTLrA8M/view); el clan de Noron no se denomina expresamente «Cabeza de Oso». |
| Hueso de Sangre | 3 | E — segundo componente sin herencia probada | [Gorgan Hueso de Sangre](https://drive.google.com/file/d/12-j5jC9uJOfi91Q0BRpmT9cXEd9s_htM/view) en índice Era Rasa; no se acredita familia del mismo nombre. |
| Orbem | 2 | I — segundo componente personal, herencia no probada | [Oiam Orbem](https://drive.google.com/file/d/1cHv4UkpRvmzcW8q-4dNzJ0TeFBcrKuy0/view). |
| Tugg | 3 | I — segundo componente personal, herencia no probada | [Xandor Tugg](https://drive.google.com/file/d/1EhlPuHp6qON6FzcT6kN_f4sv3s2Y2yLz/view). |
| Eldarien | 2 | I — forma repetida sin parentesco probado | [Vaelar Eldarien](https://drive.google.com/file/d/136DT4cAGmNPjqdU-TYzHjpvJpAnGB2HD/view) y [Nidrael Eldarien](https://drive.google.com/file/d/1Ij6BmpXCTWWDounoB0LQIDMYNY_-mt9e/view); relación narrativa, no parentesco sanguíneo demostrado. |
| Williams | 3 | I — segundo componente personal, herencia no probada | [Joseph Williams](https://drive.google.com/file/d/14io6IofuStSQOOAIrR7ujeDUoJ_qWikz/view) es un caballero humano en el relato [46]. |

## 5. Ejemplos de revisión editorial prioritaria

1. **Fuente real, entidad incorrecta:** `ylat-d049 Máthair Felsaer` aparece como «documentado», pero es montaña; las combinaciones `ylat-c121 Máthair Hueso de Sangre` y `ylat-c029 Máthair Eldarien` emplean **Máthair** como primer componente humanoide sin fuente onomástica personal. **Retener el testimonio documental, pero marcarlo como lugar**. 
2. **Nombre propio de animal:** `ylat-d051 Pietro` se refiere al **oso de Drakabel** en el relato; combinaciones `ylat-c044 Pietro Brice` y `ylat-c135 Pietro Eldarien` no acreditan personaje humano. **No negar que Pietro sea un nombre propio: lo es, pero de un animal**.
3. **Topónimo convertido en apellido sin regla:** `Lazare Felsaer`, `Joseph Felsaer`, `Saewig Felsaer` utilizan un componente del nombre de la montaña como supuesto segundo elemento personal. Su carácter de apellido **no está documentado**.
4. **Apellidos socialmente restringidos:** `Kharan Shadelgast`, `Drakabel Shadelgast`, `Tanto Shadelgast` y las cuatro combinaciones con **Boll** no documentan pertenencia a la casa del titular nuevo. Las etiquetas `combinado` del propio JSON ya indican «No identifica un personaje canónico»; la revisión determina si esas ficciones son **editorialmente deseadas**.
5. **Fórmulas de función incierta:** `Tanto Cabeza de Oso` o `Jeremie Hueso de Sangre` combinan segmentos de nombres documentados sin prueba de que sean apellidos familiares transmisibles. No corregir esas fórmulas como si fueran erratas sin consultar la intención editorial.

## 6. Qué acción queda aprobada hoy

**Solo documentación de problemas y opciones.** No se ha cambiado ninguna de las 52 entradas. Los cambios posibles (retener en consulta, excluir de sorteo de personas, permitir combinaciones creativas sin canon, incorporar vínculos familiares verificados) son **alternativas para aprobación del autor**, no implementaciones. La evaluación del generador deberá conservar el comportamiento reproducible por semilla y no introducir nuevas extracciones del RNG compartido.

**Decisiones editoriales dependientes:** [registro de decisiones](decisiones-editoriales.md) y [matriz de elegibilidad](matriz-elegibilidad-editorial.md). No reintroducir entradas de corpus ajenos excluidos.
