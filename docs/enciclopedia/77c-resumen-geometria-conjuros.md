# Auditoría transversal de superficie y volumen en los 434 Conjuros

**Fecha:** 30 de octubre de 2026. **Fuente:** los 18 lotes [69a–69r](69a-conjuros-alfabeticos-001-025.json). **Versión de auditoría: 2**, tras corregir un error del detector que omitía algunas unidades con superíndice **²**.

Se han identificado **65 fichas** con **69 menciones** explícitas de superficie o volumen expresadas mediante `m2`, `m²`, `km2`, `km²`, «metros cuadrados» o «metros cúbicos». Se ha respetado la notación original. Los datos detallados, con ordinal, archivo, párrafo y contexto literal, están en las auditorías [1–225](77a-auditoria-unidades-001-225.json) y [226–434](77b-auditoria-unidades-226-434.json).

## Diez casos de «radio» con unidades de superficie

En **10 fichas**, la descripción mezcla la magnitud lineal *radio* con una cantidad expresada como superficie:

| Nº | Conjuro | Expresión original |
|---:|---|---|
| 90 | Cúpula antimagia | «en un radio de 3m2» |
| 108 | Diluvio universal | «en un radio de 10 km²» |
| 131 | Discurso de necios | «en un radio de 10 metros cuadrados» |
| 205 | Invocar vórtice de energía | «en un radio de 4m2» |
| 217 | Luna carmesí | «en un radio de 20 km²» |
| 318 | Purga de maldad | «en un radio de 10m2» |
| 373 | Sello rúnico: Trampa | «en un radio de 3m2» |
| 393 | Tromba de meteoritos | «en un radio de 20m2» |
| 395 | Trampa de enredaderas | «en un radio de 3m2» |
| 409 | Terremoto | «un área con un radio de 2m2» |

**No es posible interpretar literalmente un radio en metros cuadrados o kilómetros cuadrados.** Para integrarlo en Forja o calcular objetivos se necesita una convención editorial sobre la forma geométrica y cómo traducir la superficie a distancia radial, si procede.

Mientras no exista aprobación, **no cambiar** `3m2` por 3 metros ni por un círculo de 3 metros de radio; tampoco transformar las superficies en metros cúbicos. El resultado de esta auditoría es un **índice de revisión, no un cambio reglamentario**.

Los casos restantes que expresan «área de Xm2» u otro alcance superficial no son necesariamente errores, aunque podrían necesitar una forma geométrica para calcular casillas afectadas. No convertirlos automáticamente en radios.

## Limitaciones y próximo paso

La búsqueda detecta **patrones de unidades expresadas textualmente**, no todas las descripciones espaciales: no es una auditoría exhaustiva de conos, líneas, radios en metros, alcances de toque o áreas descritas sin números. El recuento anterior (62 fichas, 65 menciones, ocho casos) se reemplaza por **65 fichas, 69 menciones, 10 casos**, al corregir la detección de `m²` y `km²`. La fuente y sus fichas originales nunca estuvieron afectadas.

**Pendiente de decisión editorial:** definir una convención general o corregir cada caso de «radio de superficie»; no trasladar automáticamente decisiones específicas de Talentos (como Mímica o Ridículo) a todo el Tomo.
