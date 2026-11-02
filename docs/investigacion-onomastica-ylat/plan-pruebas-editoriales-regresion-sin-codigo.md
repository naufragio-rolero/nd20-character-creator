# Plan de pruebas y criterios de aceptación — onomástica de La Forja

**Fecha:** 2026-11-02. **Estado:** ESPECIFICACIÓN DE PRUEBAS FUTURAS, **sin implementación y sin aprobación editorial**. Este documento no crea tests ni modifica archivos de producción. Complementa el [dossier de decisiones](dossier-validacion-editorial-onomastica.md) y el [acta de investigación](acta-cierre-documental-corte-2026-11-02.md).

## 1. Estado técnico verificado antes de proponer pruebas

En la rama `main` se consultaron:
- [`assets/rules.js`](../../assets/rules.js): `crearNd20` construye `poolNombres` según `config.modoNombre`, elige `nombreYlat=escoger(poolNombres,rng)`, puede llamar a `sexoApi.elegirNombre(...,rng)` y después resuelve `nombreDefinitivo` con el resultado del modo/manual/especie. `aleatorioSemilla` proporciona el generador reproducible usado también en otros pasos.
- [`assets/sex.js`](../../assets/sex.js): `primerNombre` extrae la **primera palabra** tras eliminar algunos tratamientos. Esto **no es un analizador de apellidos**. `nombresDocumentados` filtra por las listas editoriales de sexo cuando corresponde; para combinados puede admitir formas sin clasificación. **Ninguna de estas funciones clasifica la fuente como persona/animal/lugar**.
- [`data/tesauro-ylat.json`](../../data/tesauro-ylat.json): **19** entradas `documentado`, **33** `combinado`; hay una montaña y un oso documentados con nombre, y combinaciones derivadas.
- [`tests/smoke.js`](../../tests/smoke.js) y [`tests/alcance-drs.js`](../../tests/alcance-drs.js): tests existentes de tesauro y comportamiento; se comprueba la **reproducibilidad por semilla**, y hay expectativas del tamaño histórico **19/33/52**. **No se han ejecutado tests en esta sesión ni se ha alterado su código**.

**Riesgo central:** filtrar nombres sin analizar cómo se utiliza el **RNG compartido** podría alterar la generación de una ficha completa para una semilla existente; y modificar el tesauro sin reexaminar los tests de cantidad podría ocultar problemas de datos o alterar expectativas antiguas.

## 2. Casos de prueba propuestos tras aprobación de ONO-13

| Caso | Entrada/condición | Resultado esperado **si se aprueba generación solo de personas** | Qué debe comprobarse |
| --- | --- | --- | --- |
| **TIPO-01** | `ylat-d049`: **Máthair Felsaer**, fuente tipo montaña | Consultable con la clasificación `lugar`; **no elegible** como persona aleatoria por su ficha | Evidencia de procedencia conservada |
| **TIPO-02** | `ylat-d051`: **Pietro**, oso de Drakabel | Consultable como `animal`; **no elegible** como nombre documentado de personaje **por esta fuente** | No declarar inexistente todo humano llamado Pietro en Ylat |
| **TIPO-03** | Combinaciones **Máthair Eldarien** y **Máthair Hueso de Sangre** | No elegibles en un repertorio de **antropónimos acreditados** | Preservar las cadenas en archivo de evidencia histórica |
| **TIPO-04** | **Pietro Brice** y **Pietro Eldarien** | No elegibles en un repertorio de antropónimos acreditados | No confundir `animal` con `nombre de personaje humano` |
| **TIPO-05** | **Lazare Felsaer**, **Joseph Felsaer**, **Saewig Felsaer** | No derivar `Felsaer` como apellido **solo por ser parte de Máthair Felsaer** | Requerir testimonio independiente si se pretende apellido |
| **TIPO-06** | Formas de persona **Nilsea**, **Kalzifer**, **Tanto** | Seguir consultables; solo elegibles bajo las reglas de ámbito aprobadas | No eliminar nombres legítimos por filtrar tipos ajenos |
| **TIPO-07** | Modo `historico` | Su **banco de formas** permanece separado; no reinterpretar sus entradas como genealogías | Separación de políticas entre banco histórico y tesauro |

**Nota importante:** estas pruebas están expresadas **condicionalmente a ONO-13**. No permiten decidir que toda reutilización creativa de un nombre animal sea incorrecta: solo evitan atribuir **procedencia de antropónimo** a una prueba que dice «oso».

## 3. Casos condicionados a ONO-04, ONO-05 y ONO-06

| Caso | Situación documentada | Comportamiento que NO se debe introducir sin autorización |
| --- | --- | --- |
| **CASA-01** | Siete combinados con **Boll** o **Shadelgast** como segundo elemento | Declarar sus titulares miembros de esas casas o convertir esas combinaciones en PNJ canónicos |
| **CASA-02** | **Mashera Skara** aparece en la Casa Lobeth | Renombrarla **Mashera Lobeth** por pertenencia a la casa |
| **CASA-03** | Casa Kultstein disuelta, supervivientes documentados | Tratar el apellido como extinguido universalmente o libre para cualquiera |
| **CASA-04** | **Alim de Mostagánem**, hijo adoptivo de Fabrizio Orovecchio | Convertirlo en **Alim Orovecchio** sin aparición documental |
| **REAL-01** | **Vaelar Eldarien** en fuentes Ylat¹, Ylat³ y en historia de suplantación | Unir identidades transreales o atribuir hechos del diablo al Vaelar verdadero |
| **REAL-02** | **Tegku Bagui Fénix** en ficha **Ylat⁴** | Reetiquetarlo Ylat¹ porque aparece en la narración o en censo general |
| **ELAD-01** | Apéndices familiares **Brillante**, **Luciente** y **Resplandeciente** | Inventar y generar cuarto, quinto o posteriores sufijos, ni extrapolar a todos los eladrines |
| **ELAD-02** | **Aerandil** Brillante/Refulgente | Normalizar un original sin conservar variante y procedencia |

La **opción de combinaciones creativas no canónicas** para CASA-01 solo será testeable si se aprueba explícitamente, con etiqueta visible para distinguir **propuesta** de **filiación acreditada**.

## 4. Testigos de identidad y denominación

| Caso | Entrada y relación de fuente | Comprobación editorial futura |
| --- | --- | --- |
| **ID-01** | Romualdius Walerian / Crujidor | Misma ficha de personaje, **nombre civil y alias** diferenciados |
| **ID-02** | Amathur / Amadeus | Forma anterior y adoptada, **sin duplicar persona** |
| **ID-03** | Caelia Fulgentis / Kah-Suran | Nombre adquirido en biografía, no apellido nuevo |
| **ID-04** | Narga Solarys / Ganragán | Vínculo expreso, dos momentos; **Solaris** permanece variante textual pendiente |
| **ID-05** | Vaiel (espíritu/satélite) | **Dos referentes de tipo diferente**, no confluir por igualdad de letras |
| **ID-06** | Santa Verna (patrona/aldea) | Figura cultual y lugar, ambos con la misma denominación |
| **ID-07** | Varlyna (monarca/ciudad) | Eponimia explícita, **dos entidades** enlazables |
| **ID-08** | Zekogs Quiebrahielo/Quiebrahielos y Belegur con «Furia» en posición distinta | Conservar ambas **formas testimoniadas** y su vínculo compatible |
| **ID-09** | Leezar Theroux/Lockbruck, Dyeld/Eldburg | Mantener contradicciones abiertas **sin afirmar cambio de apellido ni parentesco** |

## 5. Pruebas de regresión técnica propuestas antes del despliegue

1. **Determinismo por semilla:** para configuración idéntica, crear dos veces la ficha con una misma semilla y verificar reproducibilidad completa. Comparar además **una batería guardada de semillas anteriores** para detectar cualquier cambio colateral en atributos, equipo, riqueza, etc. La decisión de aceptar o rechazar diferencias deliberadas requiere revisión explícita; no prometer identidad binaria entre versiones si cambia voluntariamente el algoritmo.
2. **Nombres manuales:** un nombre introducido manualmente debe conservarse, sin parser que cambie mayúsculas, acentos, apellidos, alias u ordinales; ninguna clasificación nueva debe invadir esa opción.
3. **Modos de nombre:** comprobar por separado `especie`, `documentado`, `combinado` e `historico`, y sus fallbacks, incluidas colecciones vacías. Los tests deben probar **el comportamiento aprobado**, no solamente cantidades de filas.
4. **Selección y sexo editorial:** conservar la distinción entre etiquetas de nombres y sexo del personaje; los nombres sin clasificación no deben recibirla por analogía ni por el nombre de una especie. Revisar la función `primerNombre` en fórmulas **de varias palabras**.
5. **Trazabilidad visible:** cuando la ficha muestra un nombre documental, distinguir `documentado como persona` de `combinación propuesta`; una entidad de tipo lugar/animal no debe etiquetarse como PNJ documentado en un modo restringido a personajes.
6. **Ámbitos y realidades:** si se aprobase filtrado por realidad, comprobar las etiquetas exactas Ylat¹/Ylat³/Ylat⁴ y la separación entre atributos de **procedencia** y permisos de **reutilización creativa**.
7. **Pruebas de empaquetado y publicación:** continuar usando los comandos documentados en [README](../../README.md) (`node tests/smoke.js`, `node scripts/crear-paquete-drs.js`, `node scripts/comprobar-publicacion-drs.js dist/public-drs`, `node tests/paquete-publico-drs.js`) y la protección de publicación que impide desplegar el directorio raíz. **No ejecutar o cambiar publicación sin plan técnico aprobado**.
8. **Expectativas históricas:** el código actual de tests afirma **19/33/52**. Solo modificar esos valores si cambia de verdad y por decisión editorial la composición del repertorio; no eliminar aserciones para que pasen tests.
9. **Exclusión corpus ajeno:** ningún `Niguace/Niguaze` debe aparecer en los catálogos de Ylat o empaquetados por accidente.
10. **Conservación de fuente:** todo registro que deje de ser generable debe seguir trazable por el documento original y la razón de exclusión; evitar borrados destructivos del patrimonio onomástico.

## 6. Punto de parada

La investigación [cerró su corte documental](acta-cierre-documental-corte-2026-11-02.md), pero el desarrollo **permanece bloqueado** por decisiones editoriales y por no existir aprobación de pruebas/alcance.

Este plan **no afirma que las pruebas anteriores estén implantadas, ni que La Forja las supere hoy**. Su función es establecer **cómo comprobar un cambio futuro antes de tocar el código**.
