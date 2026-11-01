# Informe 119 — Fichas completas DRS y accesibilidad de la Forja

**Fecha:** 01/11/2026 · **Origen:** incidencias documentadas mediante cinco capturas de la Forja publicada · **PR:** [#15](https://github.com/naufragio-rolero/nd20-character-creator/pull/15).

## 1. Diagnóstico desde el DRS, no por conjetura

### Técnicas de batalla

En `NaufragioD20DRS.docx`, sección **Poderes → Técnicas de batalla**, los párrafos 794–855 documentan **diez Técnicas básicas** y sus efectos completos: Ataque certero, Baluarte, Disparo aturdidor, Doble ataque, Impacto poderoso, Rajar, Matamagia, Reflejo mágico, Ataque sorpresa y Golpe de escudo.

**Incidencia:** `data/catalogo-poderes.json` almacenaba nombres, categorías, requisitos y costes, pero no los efectos íntegros de varias Técnicas. El popup anunciaba que había que consultar el manual aun existiendo texto transcrito. Se corrige añadiendo `data/tecnicas-drs-literales.json` (10/10), enlazado por nombre y fuente DRS. Ejemplo: **Disparo aturdidor** indica que una criatura herida por el ataque a distancia no podrá moverse durante su próximo Turno. No se modifican sus requisitos ni sus costes.

### Talentos de Especie

Las **15 relaciones de Talentos de Especie DRS** no disponen de una etiqueta independiente de activación o pasiva. El propio efecto sí puede describir una condición, un gasto de Esfuerzo, una elección al crear PJ o una mejora constante. Por el contrario, los Talentos de Ocupación suelen disponer de una línea formal «Acción», «Pasiva» o «Reacción».

**Decisión editorial autorizada en esta petición:** `data/glosas-talentos-drs.json` clasifica **24/24 Talentos DRS** por ID completo (15 de Especie, 9 de Ocupación) y proporciona una explicación breve. Las clasificaciones de Especie se etiquetan visiblemente como **guía editorial** y no sustituyen ni falsifican el texto DRS. Ejemplos: **Ira interna** = activación condicionada si Salud llega a cero o menos; **Saña primitiva** = pasiva; **Herencia dual** = elección en creación. No se añade una Acción o un coste que el efecto no especifique.

### Equipo

Las tablas DRS de armas, armaduras y otros artículos ofrecen principalmente propiedades, categorías y precios, sin una descripción narrativa universal. El generador, además, no incorporaba las fichas de los útiles iniciales a la consulta.

Se introduce `data/glosas-equipo-drs.json` con **111/111 entradas**:
- 38 armas, 14 armaduras, 3 escudos y 4 tipos de munición.
- 5 paquetes de inicio.
- 41 útiles, herramientas, consumibles y objetos de escritura.
- 2 focos con precio y 4 varitas de defensa.

**Procedencia diferenciada:** los detalles presentes en el DRS se conservan en las fichas de útiles; las descripciones físicas de armas y armaduras se identifican como **texto editorial**, sin alterar Daño, Penetración, Blindaje, Durabilidad, costes, Competencias, alcance ni otras reglas. El catálogo sigue limitado al DRS publicado.

## 2. Experiencia de lectura

- Un Talento muestra **«En pocas palabras»** y su **tipo de uso** diferenciado como orientación editorial.
- El **texto literal DRS** continúa disponible: inmediatamente en los efectos breves y mediante «Leer texto íntegro del DRS» cuando el efecto es extenso.
- Los popups abiertos por clic/teclado se presentan como **diálogos desplazables**, centrados, con altura limitada al viewport, botón «Cerrar» y salida mediante Escape o clic fuera. El hover también permite desplazarse hasta la tarjeta sin perderla inmediatamente.
- La **aclaración autoral** de Expulsar muertos vivientes continúa aparte del efecto original, visible sin abrir los detalles técnicos.
- En el **tema Ébano**, el texto resaltado de las instrucciones de primer uso pasa a un tono oscuro legible sobre el fondo claro. El resto de temas conserva sus colores.

## 3. Seguridad y pruebas

La lista blanca del paquete público DRS incluye **exclusivamente tres nuevos archivos JSON** de consulta. Los scripts `crear-paquete-drs.js` y `comprobar-publicacion-drs.js` conservan las exclusiones de sistemas CiFi y Nocturna, de material suplementario y de identidades no publicables. No se modifica el motor de generación ni las compras.

Las pruebas protegen cobertura 10/24/111, coincidencia física de los catálogos publicados, procedencia por Especie/Ocupación, y una prueba de navegador de Disparo aturdidor, Expulsar muertos vivientes, altura y lectura, y contraste Ébano. La inspección ocular de capturas es independiente del resultado de CI.

## 4. Criterios de aceptación y próximo paso

- [x] 10 Técnicas DRS con texto completo.
- [x] 24 Talentos DRS con glosa y **15 de Especie** clasificados editorialmente.
- [x] 111 artículos del Equipo actual con descripción.
- [x] Diálogos de Talento desplazables, con cierre y texto fuente accesible.
- [x] Corrección de contraste de Ébano.
- [ ] Registrar **4/4 suites CI verdes** del último commit y examinar capturas reales del candidato.
- [ ] Reconciliar con [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) si se pretende incorporar también los **37 artículos adicionales DRS**; su catálogo separado sigue en revisión y no se añade por accidente a esta entrega.
- [ ] Tras cierre técnico/editorial, fusionar y publicar **solo el paquete DRS depurado** mediante SHA fijado, con verificación HTTP posterior.

Este informe no autoriza publicar el material de la PR #13 ni suplementos de otros sistemas.
