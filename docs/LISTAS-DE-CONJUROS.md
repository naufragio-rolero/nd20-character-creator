# La Forja — Editor de Listas de Conjuros (candidato editorial)

**Estado:** rama de desarrollo, accesible en PREVIEW aislada; no incorporado a la generación oficial de personajes, no publicado en LIVE, no altera el DRS.  
**Fuente normativa exclusiva:** [Naufragio d20 DRS v1.1.12](https://docs.google.com/document/d/1W69x5V_982IGg2AL0TltZ200aSt2khXu_VCa7gMI3zY/edit).  
**Caso de prueba no aprobado:** [Centinela v5](https://github.com/naufragio-rolero/naufragio-d20/blob/main/suplementos/zelda/ocupaciones/centinela.md) y su [Lista provisional](https://github.com/naufragio-rolero/naufragio-d20/blob/main/suplementos/zelda/listas-de-conjuros/centinela.md).

## Auditoría y reutilización

- \`data/catalogo-poderes.json\` contiene los IDs estables de los 64 Conjuros identificados como \`origen: Nd20\`, las listas \`listas_drs.Mago\` y \`listas_drs.Clérigo\`, además de 369 Conjuros ajenos al DRS básico. **No alterar esta estructura ni convertir los 433 Conjuros totales en DRS.**
- \`data/progresiones-oficiales.json\` almacena separadamente las tablas de Clérigo y Mago (\`fantasia.[Ocupación].niveles\`, índices 0–29, columnas Círculos 1–8).
- \`assets/powers.js\` y \`assets/app.js\` ya resuelven Conjuros conocidos y preparación reglamentaria. Esta entrega no los reescribe ni cambia por defecto.
- \`assets/repertorios.js\` y \`control.html\` muestran el precedente de edición local y exportación de propuestas, pero nombres/conceptos no son relaciones de Conjuros. El nuevo módulo aplica las mismas fronteras entre oficial/personal, sin adaptar las reglas de un repertorio de nombres.
- \`scripts/crear-paquete-drs.js\` es una lista blanca: no incluye \`listas-de-conjuros.html\`, los dos módulos nuevos ni el borrador del Centinela. **No añadirlos al paquete público hasta validar el contenido editorial y su experiencia de uso.** La página está disponible para ensayo en el árbol de desarrollo desde \`control.html\`.

## Contrato de datos

1. \`data/conjuros-drs-fichas.json\`: 64 fichas tomadas del documento DRS vinculado, con el ID preexistente, nombre, Círculo, Escuela, campos opcionales, efectos y texto normativo original. Su uso se limita a la vista de referencia; la Lista de Conjuros nunca contiene ese texto.
2. \`assets/spell-lists.js\`: módulo puro UMD compatible con Node y navegador. Une el catálogo documental de 64 entradas con las listas oficiales que ya existen; valida correspondencia de ID, nombre, Círculo y Escuela. Expone funciones de crear, editar, duplicar, eliminar, vincular, importar, exportar y resolver vista por Nivel. No ejecuta Conjuros ni inventa espacios.
3. \`data/listas-conjuros-borradores.json\`: **exclusivamente** propuesta Centinela v5, nueve IDs preexistentes y tabla Nivel 1–30 de ocho columnas (Círculos 5–8 siempre a cero). Tanto la Lista como la tabla se marcan "propuesta no aprobada".
4. Biblioteca del usuario: esquema \`naufragio.listas-conjuros/v1\`; los registros \`listas\` tienen IDs \`usuario:...\`, nombre, descripción, \`maxCirculo\` y \`conjuros: [id]\`; \`asociaciones\` tiene \`ocupacion\`, \`listaId\`, \`progresionId\`. La versión del DRS es obligatoria para importar.
5. \`assets/spell-lists-ui.js\`, \`assets/spell-lists.css\`, \`listas-de-conjuros.html\`: editor de listas personales, filtros por nombre/Círculo/Escuela/lista oficial, grupos por Círculo, lectura íntegra del texto normativo, guardado local, duplicación incluso desde oficial y exportación/importación JSON. Un panel permite asociar cualquier nombre de Ocupación a una lista y una progresión **documentada**; sin progresión, no aparecen Espacios.
6. Se comparte el catálogo y las tablas originales mediante referencias; **no** se crean copias de cada Conjuro en las listas. El borrador del Centinela es la única entrada de otro documento, expresamente de prueba editorial.

## Funcionamiento y límites

- El editor **no altera** el aprendizaje ni la preparación de los PJ existentes; no sustituye las listas oficiales de Mago/Clérigo. Las asociaciones son decisiones locales de diseño, no reglas publicadas.
- Una tabla de progresión independiente fija los Espacios. El editor muestra los Círculos abiertos a un Nivel según esa tabla y los Conjuros incluidos en la Lista; no concede automáticamente aprendizaje, Libro de conjuros, preparación ni Meditación.
- Se rechazan Conjuros huérfanos o ajenos al DRS, ID repetidos, Círculos fuera del máximo, listas de usuario que intenten usar IDs protegidos, asociaciones a listas inexistentes, progresiones desconocidas e importaciones de versión diferente.
- Los datos se guardan en \`localStorage\` con clave \`forja-listas-conjuros-v1\`, separada de la biblioteca de adversarios y de las revisiones editoriales. No hay servidor ni sincronización entre dispositivos. Exportar JSON es la copia de seguridad.
- Las fichas oficiales y la propuesta v5 permanecen de solo lectura. Las listas personalizadas se pueden eliminar únicamente tras desvincularlas de las Ocupaciones asociadas.
- Los textos normativos se muestran como texto plano, sin HTML suministrado por datos importados. Interfaz adaptativa, etiquetas asociadas y avisos accesibles. La comprobación dinámica en navegadores reales está sujeta al QA de la PR.

## Incidencias y decisiones editoriales

- El DRS en Drive muestra **v1.1.12**. La cabecera de la copia DOCX disponible en la colección local es anterior: prevalece el documento identificado por su ID en el encargo.
- En el DRS, **Contrato de fraternidad** figura bajo \`Círculo 4\`, pero su ficha omite el marcador inicial “Cuarto Círculo”. La extracción utiliza la posición de la sección y deja constancia, sin modificar el original.
- La selección de nueve Conjuros, el tope del Cuarto Círculo y los 4 Espacios máximos del Centinela son **editoriales, no aprobados**. Revisión especial de **Polimorfia**.
- Si una futura Ocupación como el **Profeta** define su propio progreso, se añade como **dato documentado**; no se codifica una excepción en el módulo. No se permite inventar una tabla a partir de la Lista.
- Pendiente decisión antes de integración posterior: cómo opta un personaje generado por una Lista personal y su Ocupación, qué ocurre al importar personajes antiguos, qué datos editoriales pueden promocionarse al catálogo oficial y si merece la pena permitir importar tablas de progresión personales. Estas decisiones no quedan implícitamente aprobadas por este PR.

## Comprobación

- \`node tests/listas-conjuros.js\`
- \`node tests/smoke.js\` (incorpora la nueva batería)
- \`node scripts/crear-paquete-drs.js\`
- \`node scripts/comprobar-publicacion-drs.js dist/public-drs\`
- \`node tests/paquete-publico-drs.js\`
- Validación de la interfaz en Chrome, Firefox y WebKit, también con pantalla móvil y teclado, antes de proponer la publicación.

**No tocar** \`.github/workflows/forja-live.yml\` ni el documento DRS. La rama/PR es solo una propuesta revisable.
