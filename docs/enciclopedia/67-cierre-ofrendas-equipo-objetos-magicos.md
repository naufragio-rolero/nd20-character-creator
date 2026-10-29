# Cierre documental de Eidolas, Equipo y Objetos mágicos — 29/10/2026

**Alcance:** documentación y control cruzado de fuentes; no integración, corrección silenciosa de reglas ni cambios en el generador Forja.

## Eidolas

Las **32 fichas** de Eidolas y sus **96 modalidades** ya se encontraban completas en la fuente viva, según [auditoría previa](60a-auditoria-eidolas-32-modalidades-96.json). En esta sesión se separaron las menciones de ofrenda, gesto, prueba o compromiso de la propia narración:

- [Categorías 1 y 2, 16 registros](61a-ofrendas-eidolas-categorias-1-2.json).
- [Categorías 3 y 4, 16 registros](61b-ofrendas-eidolas-categorias-3-4.json).
- [Auditoría cruzada](63a-auditoria-eidolas-ofrendas-32.json): **32/32**, 96/96 modalidades, 27 menciones narrativas documentadas y cinco sin condición explícita: **Cath Palug, Nerevion, Velghor, Faustargon y Valkhar**; **0 errores** en referencias y pasajes.

**Criterio fundamental:** que un Eidolon solicite comida, un ritual, una prueba o una promesa en su historia no determina automáticamente un coste mecánico ni impide invocarlo. No se ha modelado una condición bloqueante sin regla explícita.

Siguen abiertas **OCP-21** (Velunion: Agua en la tabla y Ninguno en la ficha) y **OCP-22** (Maia: ausencia de cifra de alcance en Materializar). No se han alterado los textos.

## Equipo del manual de Ocupaciones

Extracción completa de las **tablas Word 35–38 del DOCX adjunto**, conservando estadísticas, datos de precio, notas de pie y descripciones:

- [12 armas](62a-equipo-armas-ocupaciones.json): seis armas de puño y seis arrojadizas, con alcance si procede, daño, Penetración, Durabilidad, precio y notas específicas.
- [10 objetos y herramientas](62b-equipo-herramientas-ocupaciones.json): uno de Equipo de aventuras y nueve Herramientas. Las tres filas vacías de la tabla 37 no son elementos.
- [Auditoría](63b-auditoria-equipo-22.json): 22/22 sin fallos de estructura; **0 coincidencias de nombre normalizado** con las entradas de `data/equipo-inicial.json` y `data/catalogo-ampliado.json`. Esto **no** prueba ausencia de equivalencias semánticas en otros manuales.

Incidencias literales menores sin alterar el original: **OCP-EQ-01**, Microscopio («Compleja herramientas»), y **OCP-EQ-02**, Cometa («gastando 1 de Esfuerzo»).

## Objetos mágicos

El documento adjunto `NaufragioD20 — Objetos mágicos.docx` contiene 28 fichas principales y un ejemplo adicional en el apéndice. **Se han transcrito íntegramente los 29**, separando el ejemplo de los objetos canónicos:

| Bloque | Fichas | Documento |
|---|---:|---|
| Carreta de los Salvadores de Nasbel | 4 | [65a](65a-objetos-magicos-nasbel-4.json) |
| Artificios Morrotinto | 8 | [65b](65b-objetos-magicos-morrotinto-8.json) |
| Alijo de contrabando dupoviano | 12 | [65c](65c-objetos-magicos-dupovia-1.json) + [65d](65d-objetos-magicos-dupovia-2.json) |
| Emporio de cajas de Feanaro & Furia | 4 | [65e](65e-objetos-magicos-cajas-y-ejemplo.json) |
| Apéndice: Elixir de esfuerzo | 1 (ejemplo) | [65e](65e-objetos-magicos-cajas-y-ejemplo.json) |

El [índice](64a-indice-objetos-magicos-28-y-apendice.json) preserva nombres, tipos, rarezas, grupos y rangos de párrafos.

**[Auditoría de literalidad](66a-auditoria-literal-objetos-magicos-29.json): 29/29 fichas cotejadas contra el DOCX original**, sin diferencias sustantivas (normalización exclusiva de blancos extremos); también coinciden las cinco reglas generales de las cajas. Se han comprobado además tipo, rareza y localización.

**Dos dudas del texto fuente que requieren revisión futura**, sin autorizar cambios automáticos:

- **OCP-MAG-01:** Arqueta, Baúl y Joyero expresan capacidad como `8m2`, `18m2` y `2m2`. No convertir a metros cúbicos por inferencia.
- **OCP-MAG-02:** el Elixir de esfuerzo indica que recupera «un punto de energía». No sustituir por Esfuerzo sin verificar terminología.

El `Hilo de brillo dorado` presenta una maldición narrativa: no se ha convertido en penalización mecánica por cuenta propia. Las reglas generales de cajas solo deben aplicarse a las cajas, no a la Gema cristalina onírica, aunque esté en la misma sección.

## Estado de la PR y próximo trabajo

Se mantienen los hitos documentales preexistentes: **115/115 relaciones Especie–Talento cotejadas**, **162/162 relaciones canónicas provisionales Ocupación–Talento transcritas**, **32/32 Eidolas y 96/96 modalidades**. En esta sesión se añade **27/32 menciones narrativas documentadas**, **22/22 registros de equipo adicional** y **28/28 objetos mágicos más un ejemplo con efecto completo**.

**Próxima prioridad propuesta:** cotejar los 2 Conjuros de Nictomancia/Demonología contra Tomo de Magia y empezar la extracción íntegra de los Conjuros inventariados (434 registros/433 nombres), evitando duplicados y manteniendo separadas las variantes por Círculo y Escuela. Quedan igualmente pendientes efectos completos de Técnicas, otros Poderes, Equipo de Nocturna e integración mecánica con pruebas.

**No se ha modificado ningún archivo de ejecución de Forja. No se ha fusionado la PR #3.**
