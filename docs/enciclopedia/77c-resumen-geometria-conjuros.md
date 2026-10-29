# Auditoría transversal de superficie y volumen en los 434 Conjuros

**Fecha:** 30 de octubre de 2026. **Fuente:** los 18 lotes de Conjuros [69a–69r](69a-conjuros-alfabeticos-001-025.json).

Se han identificado **62 fichas** con **65 menciones** explícitas de superficie o volumen expresadas mediante `m2`, `m²`, `km2`, `km²`, «metros cuadrados» o «metros cúbicos». Se ha respetado la notación original. Los datos detallados, con ordinal, archivo, párrafo y contexto literal, están en las auditorías [1–225](77a-auditoria-unidades-001-225.json) y [226–434](77b-auditoria-unidades-226-434.json).

## Ocho casos de «radio» con unidades de superficie

En **8 fichas**, la descripción mezcla la magnitud lineal *radio* con una cantidad expresada como superficie:

| Nº | Conjuro | Expresión original |
|---:|---|---|
| 90 | Cúpula antimagia | «en un radio de 3m2» |
| 131 | Discurso de necios | «en un radio de 10 metros cuadrados» |
| 205 | Invocar vórtice de energía | «en un radio de 4m2» |
| 318 | Purga de maldad | «en un radio de 10m2» |
| 373 | Sello rúnico: Trampa | «en un radio de 3m2» |
| 393 | Tromba de meteoritos | «en un radio de 20m2» |
| 395 | Trampa de enredaderas | «en un radio de 3m2» |
| 409 | Terremoto | «un área con un radio de 2m2» |

**No es posible interpretar literalmente un radio en metros cuadrados.** Para integrarlo en un tablero virtual o calcular objetivos se necesita una convención editorial sobre la forma geométrica y cómo convertir el área en alcance radial, si procede.

Mientras no exista aprobación, **no cambiar** `3m2` por 3 metros ni por un círculo de 3 metros de radio; tampoco transformar las superficies en metros cúbicos. El resultado de esta auditoría es un **índice de revisión, no un cambio reglamentario**.

Los casos restantes que expresan «área de Xm2» u otro alcance superficial no son necesariamente errores, aunque podrían necesitar una forma geométrica para calcular casillas afectadas. No convertirlos automáticamente en radios. El DRS también emplea la notación `m2` para espacios/cuadrículas; su uso editorial es una cuestión transversal.

## Limitaciones y próximo paso

La búsqueda detecta **patrones de unidades escritas**, no la totalidad de descripciones espaciales: no identifica necesariamente todos los conos, líneas, radios en metros, alcance de toque o áreas descritas sin números. No se han modificado los efectos ni el código de Forja.

**Pendiente de decisión editorial:** definir una convención general o corregir cada caso de «radio de Xm2», sin aplicar de manera retrospectiva una decisión específica tomada para otros Talentos (como Mímica o Ridículo) a todos los Conjuros.
