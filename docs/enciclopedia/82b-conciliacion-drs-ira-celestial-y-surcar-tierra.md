# Conciliación de autoridad: Ira celestial y contradicción geométrica

**Fecha:** 30 de octubre de 2026. **Regla editorial confirmada por los autores:** el DRS prevalece sobre los inventarios secundarios para determinar el Círculo y la versión reglamentaria de los Conjuros.

## Ira celestial — resuelto

La fuente «NaufragioD20DRS.docx», sección de Conjuros, incluye **Ira celestial** entre los Conjuros de **Círculo 5** del Clérigo y contiene su ficha «**Quinto Círculo**», Escuela **Divina**, Alcance **20 m**, requisito **muerto viviente o ser de las sombras**, daño **4d12 radiante**. La versión del «Tomo de Magia [Orden alfabético]», ordinal 188 (lote 69h), coincide.

**Error catalogado:** `data/catalogo-poderes.json` contenía dos entradas con el mismo nombre: `conjuro-46` (C5, Nd20) y `conjuro-154` (C3, origen no verificado). El DRS no documenta esa segunda versión.

**Resolución aplicada en rama de integración:** se elimina `conjuro-154` de los Conjuros seleccionables; se mantiene `conjuro-46` como única versión canónica. El catálogo queda en **433 entradas únicas**; el Tomo mantiene **434 fichas documentales**, porque «Arma elemental» está transcrito dos veces. Los lotes históricos 69 y los maestros de Drive no se reescriben. Las pruebas de Forja protegen la ausencia de Ira celestial C3.

## Surcar la tierra — resolución aprobada y aplicada en Forja

Texto del Tomo, ordinal 385: «Remueves o excavas hasta **4 metros cúbicos** de tierra, barro o arena», pero proporciona ejemplos con profundidades y anchuras que exceden ese límite.

Para verificar el orden de magnitud, **si se interpretan como excavaciones cilíndricas**:
- **2 m de diámetro × 12 m de profundidad**: volumen `π × 1² × 12 = 12π ≈ 37,70 m³`, unas **9,4 veces** el máximo.
- **Casi 4 m de diámetro × 2 m de profundidad**: para diámetro de 4 m, `π × 2² × 2 = 8π ≈ 25,13 m³`, unas **6,3 veces** el máximo. Con «casi 4 m» la cifra real sería algo menor, pero muy superior a 4 m³.

La fuente dice «2 metros de ancho» para el primer ejemplo; tomarlo como diámetro de pozo circular es una **hipótesis geométrica explicativa**, no una precisión explícita del reglamento.

**Resolución editorial aprobada el 31/10/2026:** conservar el límite de **4 m³** y sustituir los dos ejemplos incompatibles por un pozo de **1 × 1 × 4 m** y una cavidad de **2 × 2 × 1 m**. Ambos volúmenes son exactamente **4 m³**. Se ha aplicado únicamente al texto de consulta de Forja. Véase [82a](82a-correcciones-confirmadas-conjuros.json).

## Dos resoluciones adicionales aprobadas

La [capa editorial 82a](82a-correcciones-confirmadas-conjuros.json) contiene la decisión de **Yugo de la muerte viviente** (destrucción Nivel 12 o inferior; daño desde Nivel 13) y la distinción **lanzamiento de 1 Intervalo / estudio de ocho horas** con revelación paulatina de *Revelar objeto maravilloso*. Estas correcciones se aplican a los datos consultables por Forja, pero no sustituyen transcripciones históricas ni inventan etapas temporales precisas.
