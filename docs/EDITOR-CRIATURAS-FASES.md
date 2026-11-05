# La Forja — Editor de criaturas Nd20

**Seguimiento:** https://github.com/naufragio-rolero/nd20-character-creator/issues/96  
**Estado:** fase 2 · Importación conservadora y biblioteca local en rama de desarrollo. Sin interfaz visible ni publicación LIVE.

## Principio de producto

La Forja permite crear, editar, importar y exportar **criaturas propias**. El bestiario y las reglas oficiales se consultan en https://naufragiod20.naufragio.net/, y no se copian como catálogo de la Forja. No existe automatización de combate, tiradas, seguimiento de Salud, resolución de encuentros ni mesa virtual.

La hoja de auditoría es **fuente de contraste en modo lectura**: https://docs.google.com/spreadsheets/d/1rI8gk0nmf4rboGHCRtlpyFcf60KohXVp6rBxAqNolfw/edit. No alterar originales ni volcar las 326 fichas al producto.

## Hoja de ruta: cuatro fases

1. **Validación semántica y contrato de datos.** Contrastar cantidades, daños, conectores, referencias a Talentos y casos ambiguos; documentar evidencias y crear un modelo local versionado con pruebas.
2. **Capa de edición e importación.** CRUD de criaturas del usuario, guardado y exportación JSON; motor conservador para interpretar una **ficha completa copiada y pegada** en formato Nd20. Extraer nombre, categoría, puntuaciones, ataques, Talentos/Habilidades especiales y descripción. El contenido no reconocido pasa a fragmentos pendientes sin perder la fuente.
3. **Interfaz del Editor.** Formularios para ataques y Talentos, combinaciones alternativas o simultáneas, descripción y puntuaciones, importación desde área «Pegar criatura», vista previa y revisión manual de los fragmentos dudosos, exportación y accesibilidad móvil.
4. **QA y consolidación.** Regresión del generador actual, casos derivados de la auditoría, importación/exportación reversible, accesibilidad, paquetes DRS, fuentes y publicación solamente mediante flujo de SHA aprobado.

La funcionalidad de **pegar una ficha y descomponerla** es requisito obligatorio de las fases 2, 3 y 4. Nunca se aceptan silenciosamente interpretaciones ambiguas.

## Evidencias y decisiones de fase 1 (05/11/2026)

Lectura de las pestañas [Table] Ataques, [Audit] Ataques y [Table] Criaturas de la copia de auditoría:

| Medida | Resultado |
| --- | ---: |
| Criaturas revisadas | 326 |
| Segmentos de ataque | 576 |
| Conector Inicio | 326 |
| Conector o (alternativa textual) | 172 |
| Conector y (conjunción textual) | 70 |
| Conector coma (interpretación pendiente) | 8 |
| Cantidad de ataques 1 / 2 / 3 / 4 / 5 | 441 / 104 / 27 / 3 / 1 |
| Desglosados | 501 |
| Sin daño numérico indicado | 40 |
| Daño especial | 34 |
| Daño alternativo documentado | 1 |
| Ataques vinculados a un Talento (sin fusionarlos) | 176 |
| Criaturas que mezclan y y o | 21 |

**Reglas de fidelidad editorial:** almacenar la redacción original y cada conector. No interpretar automáticamente la precedencia de «y», «o» y comas: advertir si conviven o hay comas. La cantidad en «2 garras (9)» es dos, pero el daño literal de cada impacto sigue siendo 9; el Editor no multiplica ni resuelve ataques. «Aplastamiento (20 o especial)» mantiene ambas modalidades, aunque 20 se registre como número parcial. Los ataques sin daño documentado tienen daño numérico **nulo**, nunca cero. Un ataque y un Talento son entidades separadas incluso si sus nombres se parecen.

Casos de contraste: «2 garras (4) y mordisco (4) o aliento», «aplastamiento (20 o especial) y mordisco destructor (40)», «mordisco (12), coz (10) y conjuro», «tela de araña» sin daño numérico.

## Contrato implementado

**assets/creatures.js**: módulo puro Node/navegador, sin dependencias, catálogos ni efectos secundarios. Exporta nuevaCriatura, ataque, talento y revisar.

- Cabecera: versión 1, sistema nd20, tipo criatura_usuario, nombre, categoría, subcategoría y subtipo.
- Puntuaciones opcionales: nivel, moral, salud, blindaje, movimiento, tamano; ausencia = null, no cálculo ni valor supuesto.
- Ataques: identificador local, conectorAnterior (Inicio, y, o, coma), cantidad, nombre, danoLiteral, danoNumerico nullable, notas, segmentoOriginal y talentoRelacionado nullable.
- Talentos: nombre, descripcion, textoOriginal, referencia nullable, independientes de ataques.
- Texto libre: descripcion, notas, camposNoInterpretados y origen con tipo y textoOriginal íntegro.
- revisar devuelve errores estructurales y advertencias semánticas sin modificar los datos. No fija límites reglamentarios aún: eso requerirá contrastar fuentes al implementar formularios.

Pruebas: **node tests/criaturas-modelo.js**, ejecutadas también desde **node tests/smoke.js**. Verifican borrador, exportación, cantidades, daño nulo, alternativas, mezcla de conectores, comas, separación ataque/Talento, conservación literal e inmutabilidad.

**Fuera de fase 1:** parser de ficha completa, persistencia, formularios, exportación visible y LIVE. No añadir assets/creatures.js al paquete público DRS hasta que el Editor esté terminado y validado.


## Decisión confirmada: sección Criaturas en la misma Forja

El usuario ha elegido que el Editor de criaturas sea una sección **Criaturas** dentro de La Forja, junto a Personajes y Herramientas. No será otra página ni otro repositorio. La inserción de la pestaña visible, los formularios, la previsualización y el diseño responsive corresponden a la fase 3. No se publicará una pestaña vacía en fase 2.

## Fase 2 — Importación por texto y biblioteca local

### Motor de lectura

Módulo: assets/creatures-import.js. API: NaufragioImportadorCriaturas.descomponerTexto(texto).

Devuelve una propuesta editable con los datos: criatura, valida, errores, advertencias y detectado. Está disponible en Node y navegador mediante el mismo patrón de módulos de la aplicación, sin servidores externos ni carga del bestiario.

La lectura admite fichas compactas del DRS: nombre, «Categoría de Nivel N [Moral M], Salud S», línea de Ataques, habilidades especiales «Nombre: descripción» y narrativa. También admite fichas ampliadas de Ylat con secciones «Descripción», «Orígenes», «Etimología», «Estadísticas», «Mejoras de Nivel» y líneas independientes como «Nivel N — Moral M», «Salud N» o «Reptil neutral Grande (4)».

Los valores de Nivel, Moral, Salud, Blindaje, Movimiento y Tamaño solo se recogen cuando figuran explícitamente. Los que faltan son nulos: no se calculan. El tamaño con categoría compuesta queda advertido para revisión.

Los ataques se dividen por «y», «o» o coma **fuera de paréntesis**; el importador guarda cantidad, nombre, daño literal, daño numérico cuando inequívoco y texto exacto de cada segmento. «20 o especial» conserva ambas posibilidades. Un «1d6» no se reduce a un daño entero. Ningún valor se tira, multiplica ni aplica a un encuentro.

Las líneas de habilidades con nombre y descripción se guardan en la lista de Talentos, independiente de los ataques; no se inventan enlaces entre ambas listas. Una enumeración «Talentos: varios nombres» se conserva para revisión, sin asignar descripciones inexistentes.

Las descripciones narrativas quedan en el campo descripción. Las progresiones, etimologías y continuaciones dudosas se preservan como campos no interpretados con advertencias. El origen conserva **la cadena pegada íntegra**: nada que el parser no entienda se pierde. No se automatiza la aceptación de los datos.

Solo se analiza una criatura por operación: no se transforma el corpus oficial en un catálogo para La Forja.

### Biblioteca de usuario

Módulo: assets/creatures-library.js. API: NaufragioBibliotecaCriaturas.crearBiblioteca(almacenamiento). El almacenamiento del navegador se inyectará desde el panel de la fase 3. Clave prevista: forja-criaturas-usuario-v1, exclusivamente en el dispositivo del usuario.

Operaciones:
- listar(): índice de criaturas guardadas con resumen.
- obtener(id): copia independiente para poder editar sin sobrescribir.
- guardar(ficha, id opcional): crear una criatura propia o editar una existente por su identificador.
- eliminar(id): borrar solo la seleccionada.
- exportarJson(id opcional): exportar una criatura o toda la biblioteca en JSON.
- importarJson(texto, opciones): importa una criatura o biblioteca, añadiendo nuevas fichas por defecto, y solo reemplaza el conjunto si se pide explícitamente con reemplazar verdadero.

El formato de biblioteca es biblioteca_criaturas_nd20 versión 1. Una ficha es criatura_usuario versión 1. Las importaciones validan **todas** las fichas antes de efectuar una sola escritura; nunca silencian errores de versión ni destruyen una biblioteca local corrupta. Los identificadores de importación se reasignan para no sobrescribir fichas del navegador.

Esto es un motor local, sin cuentas, nube, envío de criaturas ni repositorio común de adversarios.

### Pruebas de fase 2

- node tests/criaturas-import.js: fichas DRS y Ylat, falta de Moral, cantidad de ataques, puntuaciones sueltas, daño especial, coma, mezcla «y/o», Talentos, descripciones, notas, progresiones y líneas dudosas.
- node tests/criaturas-biblioteca.js: crear, editar, recuperar, borrar, exportar e importar, sin pérdida ni sobrescritura accidental, incluida validación atómica de JSON corrupto.
- node tests/smoke.js: ejecuta también estas dos suites además de todas las pruebas existentes.

La fase 2 NO incluye todavía la pestaña y formularios visibles de «Criaturas», confirmación de un desglose ni publicación LIVE. Esas partes siguen asignadas a las fases 3 y 4. El bestiario permanece exclusivamente en la documentación oficial.
