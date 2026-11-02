# Auditoría de la ficha original A5 de Naufragio d20

**Fecha:** 2026-11-02  
**Repositorio / base examinada:** `naufragio-rolero/nd20-character-creator`, `main` en `e35d8a0fe0e18f1c3f9c94d25d8dc7f0035f8a61`.  
**Procedencia del documento:** `Nd20-FPJ-A5.pdf`, Drive `1MNxxOk96e0sFKuFFbfuhkVHb8HnzPKfo`, aportado para la auditoría. **No se añade el PDF al repositorio.**

## 1. Inspección comprobada del fichero

- PDF 1.7, título interno `FichaPJ_A5`, autor **Maurick Starkvind**, exportado mediante **Serif Affinity Publisher 1.10.6** (agosto de 2023).
- **Una página** vertical; `MediaBox` / tamaño real: **419,76 × 595,44 puntos**, aproximadamente **148,08 × 210,06 mm** (A5). Rotación 0.
- Tamaño de archivo: **7.973.386 bytes**. No cifrado, sin JavaScript ni anotaciones de formulario.
- `Form: none` y **0 widgets** de página: **no hay campos AcroForm**. Cualquier implementación que intente `getTextField('nombre')` sobre la plantilla actual fallará.
- Contiene texto seleccionable (etiquetas) y composición vectorial junto a imágenes. En el análisis técnico se detectaron **30 recursos de imagen** y **289 trazados de dibujo** en la página.
- Fuentes presentes: `SourceSerifPro-Regular`, `SourceSerifPro-Bold` y `Komikazoom`. Las fuentes están incrustadas (alguna como subconjunto). No se puede suponer que la licencia de incrustación de fuentes autorice automáticamente redistribuir sus archivos individuales.

## 2. Zonas existentes y capacidad visible

| Zona | Etiquetas / elementos reales | Capacidad de referencia |
|---|---|---|
| Cabecera, esquina superior izquierda | NOMBRE, ESPECIE, OCUPACIÓN, NIVEL y EXP | Una línea de altura por campo, sin sexo ni concepto |
| Atributos | FUERZA, AGILIDAD, RESISTENCIA, MENTE, INTUICIÓN y PRESENCIA; grupo de figuras por atributo | Seis grupos; **falta confirmar visualmente qué figura representa VA, DA y favorito** |
| Recursos | SALUD, ESFUERZO, MOVIMIENTO | Solo esos tres rótulos, espacio pequeño |
| Equipo | Cuatro líneas con pictogramas de arma y protecciones, **sin rótulos literales** | Cuatro registros; semántica exacta pendiente de conformidad editorial |
| Competencias | COMPETENCIAS | Tres líneas |
| Talentos | TALENTOS | Cinco líneas |
| Poderes | PODERES | Seis espacios en dos columnas |
| Inventario | INVENTARIO | Catorce espacios, dos columnas |
| Riqueza | COBRE, BRONCE, PLATA, ORO, GEMAS | Cinco casillas numéricas |
| Pie | Referencia a Naufragio d20 y naufragio.net | Preservar |

Las capacidades son **espacios visuales**, no límites de juego: los nombres largos pueden ocupar varias líneas y las fuentes reglamentarias no necesariamente son cadenas cortas. El PDF por sí solo no tiene capacidad garantizada para toda la ficha de un personaje de Nivel alto.

## 3. Compatibilidad con el generador actual

- En `assets/rules.js`, `crearNd20` construye un objeto con `nombre`, `sexo`, `descripcion`, `nivel`, `concepto`, seis registros de `atributos`, `recursos`, `capacidades`, `competencias`, `equipo`, `riqueza` y `notas`. Para Fantasía mantiene `saldo_mo` y `capital_inicial_mo`.
- En el editor de `assets/app.js` se muestran cuando existen `poderes[]` y `conjuros_preparados[]`. **No deben confundirse conocidos y preparados**.
- En `assets/equipment.js`, `blindajeFicha(personaje,catalogo)` coteja `protecciones_equipadas` contra el inventario real; separa armadura/escudo y trata el blindaje natural solo con `blindaje_natural_fuente`. No debe calcularse un Blindaje nuevo en el exportador.
- `assets/app.js` ya dispone de `fichaTexto`, `obtenerTexto`, `descargar` y exportación TXT en el botón `#exportar`. Un motor PDF debe consumir el objeto `entrada.valor`; no leer HTML renderizado.
- `index.html` ya incluye selector `nd20` / `dh`, y la barra de acciones con botón `#exportar`. No ofrecer PDF de Dungeon Hack hasta tener plantilla propia.
- `scripts/crear-paquete-drs.js` publica únicamente una lista explícita de archivos, y `.github/workflows/forja-live.yml` superpone versiones concretas por SHA. Es indispensable ampliar ambos controles con recursos autorizados, no copiar indiscriminadamente carpetas.

## 4. Dificultades comprobadas

**Identidad:** una línea para NOMBRE, ESPECIE y OCUPACIÓN es estrecha para entradas largas. Un `nombre` de hasta 90 caracteres (límite del formulario web) no cabe en una línea A5 sin volverse ilegible. Debe preservarse íntegro en continuación, y establecer una representación legible de la cabecera sin cortar silenciosamente.

**Recursos:** el generador también ofrece Potencia, mientras que la ficha original solo identifica Salud, Esfuerzo y Movimiento. La Salud del modelo puede incluir dado en una cadena como `25 (d8)`; no inferir ni borrar este detalle.

**Talentos y magia:** cinco líneas para Talentos y seis casillas de Poderes son insuficientes para muchas combinaciones. No existe espacio identificado para Conjuros preparados.

**Protecciones:** hay cuatro pictogramas, pero el PDF no anota qué valores o piezas deben imprimirse en cada uno. Evitar aplicar el valor de Escudo como Blindaje de la armadura. Mostrar un desglose inequívoco en continuación.

**Riqueza:** no crear equivalencias de plata, cobre, bronce o gemas a partir del saldo `mo`. `EXP` no se genera actualmente: dejar vacío.

**Observaciones y fuentes:** la hoja original no dispone de zona de notas; los datos pueden incluir información reglamentaria necesaria. No omitirla ni silenciar su procedencia.

**Continuación:** si se requiere un detalle que **no tiene zona** en la página 1, añadir página 2 aunque las listas visibles sean cortas. Las páginas 3+ se crearán solo por desbordamiento real. Debe mantenerse el formato exacto A5.

## 5. Viabilidad técnica

- Estrategia recomendada: `PDFDocument.load(plantillaBytes)`, `getPage(0)`, `page.drawText()` con coordenadas calibradas sobre el contenido original; `addPage([419.76,595.44])` para páginas anexas, generación en cliente y descarga mediante Blob.
- `pdf-lib` permite este trabajo y soporta navegador; **no hacen falta AcroForms**. Valorar `@pdf-lib/fontkit` solo si la prueba de caracteres supera las codificaciones de las fuentes estándar. Para garantizar caracteres Unicode arbitrarios, incrustar una fuente verificada y registrar su licencia.
- No encoger el texto hasta que quepa: medir anchura, permitir ajustes moderados dentro de un umbral editorial, y enviar los registros que no encajen a la continuación. Conservar los originales completos para comparar contra el objeto.
- El PDF pesa aproximadamente 8 MB: medir latencia, memoria, salida y rendimiento móvil real. No degradar tipografía o artes vectoriales por una optimización precipitada.
- Crear pruebas de correspondencia de datos (incluyendo orden, cantidades literales, `×`, `ñ`, tildes y cadenas largas), paginación sin pérdida y rasterización comparada página a página.

## 6. Derechos y publicación

La documentación DRS declara **CC BY-SA 4.0** para el documento de referencia e identifica la hoja A5 como trabajo de **Adrián Diego (@starkvind)**. El archivo autónomo se ofrece en Drive en modo lectura pública y declara **Maurick Starkvind** como autor. Estos indicios son coherentes, pero **no constituyen por sí mismos una constancia escrita de que el PDF autónomo, sus gráficos y fuentes se puedan incorporar al artefacto público de GitHub Pages**.

Antes de añadir el PDF a `dist/public-drs`, registrar: licencia del fichero autónomo, alcance de permiso para distribución y generación de copias, atribución adecuada, titularidad de ornamentos/ilustraciones, y licencias de las tres fuentes incrustadas. `Source Serif` tiene disponibilidad de código abierto; `Komikazoom` aparece como gratuita comercialmente en catálogos, pero debe confirmarse su archivo de licencia real. Hasta entonces: **no publicar plantilla ni modificar SHA LIVE**.

## 7. Recomendación

**Usar esta ficha como página principal, no sustituirla.** La acompañaría de una **plantilla de continuación A5** creada específicamente para la Forja, compatible en estética y con campos de extensión variable. Un segundo documento A5 será mucho más útil que comprimir diez años de aventura en los recuadros de una única hoja. No crear otra ficha principal desde cero antes de probar y aprobar esta solución editorial.

**Estado de esta rama:** solo análisis y adaptación de la especificación A4→A5; ninguna dependencia ni PDF añadido, ninguna modificación de reglas, de `main` o de LIVE.
