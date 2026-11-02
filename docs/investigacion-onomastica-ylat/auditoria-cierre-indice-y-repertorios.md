# Auditoría final del índice documental y cotejo con los repertorios activos

**Fecha:** 2026-11-02. **Objeto:** validar el [índice maestro de testimonios](indice-maestro-testimonios-v1.md) y la [matriz de identidades y variantes](matriz-identidades-y-variantes-v1.md), **sin modificar datos o código de La Forja**.

## 1. Reproducción y controles del corpus

Los datos se obtuvieron **leyendo los anexos de esta rama** y sus tablas, no reconstruyendo nombres mediante reglas lingüísticas:

| Anexo | Filas de origen examinadas | Regla de extracción |
| --- | ---: | --- |
| [Censo de PNJ](censo-pnj-historico.md) | **140** | Columna `Nombre completo` y número de fuente preservados |
| [Índices de aventuras](auditoria-aventuras-ylat.md) | **154** | Columna `Nombre literal de índice` y número de índice preservados |
| [Isophius y casas](corpus-complementario-isophius.md) | **61** | Columna `Denominación literal` preservada |
| [Monarcas de Malasthar](linajes-historicos-malasthar.md) | **12** | Denominación de monarca **incluido título/epíteto** si figura así |
| [Otros nombres de Malasthar](linajes-historicos-malasthar.md) | **7** | Forma literal de persona/relato |
| [Biografías](biografias-personajes-cotejo.md) | **8** | Denominación de encabezado |
| [Gestas](corpus-gesta-personajes-ylat.md) | **11** | 5 denominaciones de obras publicadas y 6 de borrador |
| [Teonimia](inventario-teonimos-y-epitetos.md) | **18** | Encabezado de entidad deífica, **no** sus 54 epítetos |
| [Enciclopedia](cronologia-y-astroonimia-enciclopedia.md) | **5** | Denominaciones históricas y una denominación política |
| **Subtotal** | **416 testimonios de fila** | **No representan 416 personas distintas** |

- Las **primeras cinco agrupaciones de fuente** C+A+I+M+B corresponden a **382 filas**; por coincidencia literal normalizada **solo en mayúsculas y espacios**, producen **235 formas distintas**. Es un control de cadenas, no de individuos.
- Las **nueve líneas de origen** de la tabla anterior dan **416 filas**. Además se incorporaron formas específicas de [Zonas/Inistia](barrido-final-zonas-inistia.md), [Shadaleen](auditoria-shadaleen-eponimos-y-relatos.md), identidades alternativas explícitas de censo/biografías, variantes internas y la doble clase Vaiel/Santa Verna. Después de agrupar cadenas, el índice consolidado contiene **282 formas exactas**.
- Comprobación ejecutada sobre el documento guardado: **282 filas**, índices correlativos sin saltos, **282 claves de texto distintas**; **ningún enlace interno apunta a un documento ausente** en la carpeta de investigación.
- Conteos de **referencias** en el índice: `C`=141 (las 140 filas y la referencia al nombre civil **Romualdius Walerian**, procedente de `npcs.xlsx`), `A`=154, `I`=61, `M`=19, `B`=9 (ocho biografías y el nombre referido **Amathur**), `G`=11, `D`=20 (18 fichas más **Bajzurm** y **Narga Solarys**), `E`=6 (cinco formas de cronología más el **satélite Vaiel**). `Z` y `H` contienen entradas y referencias de contraste dirigidas. **Las referencias por grupo no suman personas distintas**.

## 2. Cotejo literal con La Forja en `main`

Cotejo por **igualdad de la denominación completa**, sin distinguir mayúsculas, conservando tildes y signos. **No** se han buscado subcadenas ni asignado apellidos al separar palabras.

| Repertorio leído de `main` | Tamaño comprobado | Coincidencias exactas con las 282 formas del índice |
| --- | ---: | --- |
| `data/nombres-historicos-ylat.json` | **1.428 entradas, 1.422 formas únicas declaradas en el archivo** | **1:** Ryn'Acki |
| `data/tesauro-ylat.json` | **52 entradas** (19 documentadas + 33 combinadas en auditoría previa) | **12:** Drakabel, Gorgan Hueso de Sangre, Kalzifer, Kharan Boll, Kutak, Lazare Brice, Nilsea, Noron Cabeza de Oso, Oiam Orbem, Tanto, Vaelar Eldarien, Xandor Tugg |
| `data/sexo-personajes.json` | **55 formas** en nombres generales y listas editoriales de especie, tras deduplicación | **4:** Kalzifer, Kutak, Nilsea, Tanto |

**Advertencias metodológicas:**

1. Son **cadenas coincidentes**, no identidad certificada entre archivos, ni una sugerencia para incorporar las restantes 281 formas al banco o al sorteo.
2. El banco `nombres-historicos-ylat.json` tiene una política propia de **formas propuestas para generación sin asignación de sexo, cultura o linaje**, y contiene **1.422 formas únicas**: **no se han importado las 1.422 filas al índice de testimonios de personajes**, porque su objetivo y evidencia son diferentes. El informe **no afirma** que existan únicamente 282 formas propias de Ylat, ni que se haya revisado manualmente cada entrada del banco.
3. El tesauro incluye **combinaciones que no son personas documentadas**. La igualdad con una denominación del índice no convierte toda la política de combinación en canónica. La auditoría anterior ya detectó **Máthair Felsaer** (montaña) y **Pietro** (oso) introducidos como `documentado`; el riesgo **ONO-13** sigue sin resolver.
4. Los nombres generales de `sexo-personajes.json` son **listas editoriales** y no acreditan el sexo de personajes del corpus por igualdad de nombre.
5. Los **seis** nombres de la Gesta *La siega de los nombres* siguen siendo **borrador** en el índice: no se ha cambiado su autoridad documental.

## 3. Cobertura tipológica: no existe un censo global de personas únicas

Entre las **282 formas** hay **18 deíficos de encabezado**, variantes, alias, monarcas con epítetos, nombres unitarios, nombres de persona con dos o más componentes, un **imperio**, al menos dos **topónimos** y homonimias (como **Vaiel** y **Santa Verna**). Por ello **no es correcto** afirmar «282 personajes» ni calcular cuántos habitantes de Ylat representa sin identificar sus realidades y vínculos documentales.

La [matriz](matriz-identidades-y-variantes-v1.md) establece enlaces explícitos y variantes compatibles **sin fusionar arbitrariamente**:
- **Identidades narrativamente expresas:** Narga Solarys/Ganragán, Amathur/Amadeus, Romualdius Walerian/Crujidor.
- **Variantes compatibles sin normalización:** Bazjurm/Bajzurm, Solaris/Solarys, Quiebrahielo/Quiebrahielos, Belegur con alias reordenado, Vrymmir y otros ONO.
- **Homonimias y suplantaciones:** Vaiel (espíritu/satélite), Santa Verna (patrona/aldea), Varlyna (persona/ciudad), Vaelar usurpado por el poseso de Nidrael y versiones entre realidades.

No se ha encontrado la palabra excluida **Niguace/Niguaze** entre los **282 valores nominales** del índice, sin deducir de ello una prueba de origen por cada caso: la fuente de procedencia individual es el control fundamental.

## 4. Integridad de cambios y límites de esta auditoría

- La comparación de cambios **desde la novena sesión** en GitHub verificó que los archivos añadidos o editados para esta fase son **documentos bajo `docs/investigacion-onomastica-ylat/`**, sin modificación de `data/*.json`, código, tests, interfaces, ni despliegue.
- **Pendiente editorial:** **14 cuestiones ONO-01 a ONO-14**, que no se cierran ni se resuelven por coincidencias estadísticas; ONO-13 sigue siendo de alta prioridad en el uso de nombres de persona.
- **Pendiente de alcance global:** el índice es un **corpus cerrado de trabajo, no inventario exhaustivo del proyecto durante veinte años**. Los documentos que aparezcan fuera del alcance definido se pueden tratar en otra fase.
- **Sin prueba de juego o ejecución:** al no haber cambios funcionales, esta auditoría no declara pruebas automatizadas de la interfaz realizadas.

**Conclusión de control:** la **contabilidad de testimonios y enlaces del índice preliminar es consistente en los puntos auditados**. Es elegible para un **cierre documental de este alcance**, manteniendo el grado de incertidumbre de las identidades y el bloqueo de activación del generador.


## 5. Segunda pasada de control: índice ampliado v2

Tras el contraste final del [catálogo previo](catalogo-provisional.md) se detectaron **15 denominaciones literales** que no estaban en la primera versión, procedentes de [Gylran, Laventia (borrador), Malasthar, Shadaleen/Zonas y una biografía](adenda-fuentes-historicas-y-alias.md). Se creó el [índice maestro **v2 de 297 formas**](indice-maestro-testimonios-v2.md), conservando intacta la **v1 de 282** como primer corte trazable.

**Resultados verificados sobre la v2 guardada:**

| Prueba | Resultado |
| --- | --- |
| Filas numeradas | **297** |
| Claves de denominación no repetidas | **297** |
| Saltos de numeración | **0** |
| Nuevas filas con referencia a adenda `F` | **15** |
| Enlaces internos a archivos inexistentes | **0** |
| Formas de corpus Niguace/Niguaze entre las 297 | **0** |
| Coincidencias exactas con `nombres-historicos-ylat.json` | **1** — Ryn'Acki |
| Coincidencias exactas con `tesauro-ylat.json` | **12** — las mismas ya enumeradas en el §2 |
| Coincidencias exactas con `sexo-personajes.json` | **4** — las mismas ya enumeradas en el §2 |

El cotejo de sexo cubrió listas generales **y** los nombres editoriales por especie, sin deducir de ellas características personales. Las **15 formas añadidas no produjeron nuevos solapamientos exactos** con los tres archivos activos.

### Reservas adicionales

- **Sumaeryn Maren / Sumaeryn de las Mareas**: una denominación de cronología y otra de lista de monarcas en una fuente **[PENDIENTE]**, no dos reinas demostradas.
- **Caelia Fulgentis / Kah-Suran**: identidad expresamente narrada, no dos personajes ni un apellido nuevo.
- **Siete personajes clave de Laventia**: proceden de fuente rotulada **[PENDIENTE]**. Integrados solo en **consulta documental con marca de origen**, nunca en generación automática.
- **14 formas del índice de Ylat³** y la ficha de **Tegku Bagui Fénix / Ylat⁴** se registran en [marcas de realidades](marcas-realidades-ylat.md). Una aparición en distintas aventuras no significa identidad entre realidades.

**Cifra vigente al cierre de la revisión:** **297 formas documentales distintas en el corpus acotado**, **no 297 personajes**. La v1 y sus cifras de auditoría continúan siendo históricamente válidas para aquel primer corte, pero **la v2 es el índice de trabajo preferente**.
