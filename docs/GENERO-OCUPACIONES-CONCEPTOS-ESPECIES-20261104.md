# La Forja — Concordancia editorial y compactación de seguidores (04-11-2026)

## Presentación de seguidores

Solo las fichas de tipo `seguidor_drs` utilizan cuatro columnas compactas para Salud, Moral, Daño y Blindaje en escritorio. En móviles de hasta 440 px el diseño vuelve a dos columnas, con textos que admiten varias líneas. Se mantiene la comprobación existente: Daño y Blindaje solo se muestran cuando el equipo correspondiente consta como equipado.

«Precio recomendado» y «Aventuras: Sí/No» mantienen el formato existente, pero su separación vertical es menor. No cambia ningún valor ni se altera Dungeon Hack.

## Concordancia sin alterar reglas ni tiradas

El catálogo `data/sexo-personajes.json` incorpora tres mapas **editoriales**, no reglamentarios:

- `ocupaciones_formas_genero`: formas masculinas/femeninas para **51 Ocupaciones distintas** del conjunto de catálogos del repositorio.
- `especies_formas_genero`: formas para **43 Especies distintas**. Se incluyen, entre otras, «Elfo agreste / Elfa agreste», «Enano montañés / Enana montañesa» y «Hombre lobo / Mujer loba». Los nombres de especie invariables mantienen su forma.
- `conceptos_formas_genero`: formas del Concepto original cuando el género produce una diferencia. El universo de origen contiene **927 Conceptos únicos**, de los que 687 requieren al menos una variante declarada. Los restantes mantienen su texto original.

Las listas originales de `data/ocupaciones.json`, `data/especies.json`, `data/ocupaciones_cifi.json`, `data/especies_cifi.json` y `data/catalogo-ampliado.json` conservan exactamente las cadenas canónicas, sus pesos y sus reglas. Las variantes se declaran en los mapas editoriales, igual que las de las doce profesiones de Seguidores: no se aplican heurísticas lingüísticas de sufijos durante la ejecución.

Las claves originales permanecen en `personaje.descripcion` y `personaje.concepto`. Se añaden `descripcion_mostrada` y `concepto_mostrado`, calculadas **después de finalizar las tiradas**, para no consumir RNG ni alterar los resultados de las semillas. En la interfaz, el selector de Ocupaciones/Especies utiliza las variantes cuando se elige explícitamente un sexo, pero `option.value` sigue siendo el identificador reglamentario original. La ficha, copia de texto y PDF A5 muestran las formas adaptadas.

Se respeta la coherencia contextual ya disponible para Ocupaciones de trasfondo femenino; las formas no implican nuevas restricciones ni posibilidades mecánicas. La configuración «Aleatorio» conserva las etiquetas originales hasta que se resuelve el sexo real del personaje.

## Seguridad de publicación

El paquete público DRS **filtra** las tres familias de mapas editoriales según las Ocupaciones, Especies y Conceptos efectivamente admitidos. Los nombres de Fantasía ampliada no se publican antes de su aprobación; CiFi y Nocturna conservan el mismo tratamiento de publicación preexistente. Se añaden pruebas de integridad de esos datos y de la representación en el PDF y el navegador.

No se modifica el workflow protegido de LIVE desde esta PR. Su promoción requiere las cinco baterías de CI verdes y una PR de release con SHA fijado.
