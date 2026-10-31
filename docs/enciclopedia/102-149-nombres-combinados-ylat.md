# Forja 1.0 — 149 nombres combinados de Ylat autorizados para la distribución DRS

> **Corrección de interpretación documental (31/10/2026):** tras consultar los tres PDF de la Biblioteca exacta **/Ylat**, se confirma que «Niguace» e «Isla Tormenta» son **corpus narrativos de referencia, no procedencias culturales**. Sus personajes vienen de Piave, Gadir, Qelasthavia, Fanghis, Aermont, etc. El selector se ha renombrado **«Corpus de referencia de Ylat»** sin cambiar los 149 nombres. Véase [informe 103](103-auditoria-onomastica-biblioteca-ylat.md). Las expresiones anteriores de «procedencia» describen el estado histórico y no deben interpretarse como cultura u origen del personaje.

**Fecha:** 31/10/2026 · **PR #4:** borrador, sin fusionar ni desplegar.  
**Decisión del autor:** incorporar **149 nombres combinados** y **no incluir los 51 nombres documentados de personajes** como opciones de generación en el paquete público.  
**Fuente:** `data/tesauro-ylat.json` del repositorio de trabajo, elaborado a partir de documentos seleccionados de Ylat. Véanse [informe 100](100-paquete-publico-drs-candidato.md) e [informe 101](101-fidelidad-literal-64-conjuros-drs.md).

## 1. Distinción canónica

El tesauro editorial conserva **200 registros originales**:

| Tipo | Cantidad | Destino |
|---|---:|---|
| Nombres de **personajes documentados** (tipo `documentado`) | **51** | **Solo desarrollo/editorial**. Su denominación y atribución documental no pasan al paquete público. |
| **Combinaciones nuevas** (tipo `combinado`) | **149** | **Paquete público DRS**. No designan personajes canónicos ni se atribuyen a una Especie. |

**Los 149 nombres y sus metadatos se copian sin modificar del tesauro**, no se inventa un corpus nuevo ni se modifican las 51 identidades. Se conservan los elementos empleados en cada combinación (`semillas`), el ámbito y la indicación de carácter no canónico (`nota`).

Distribución por ámbito **registrado, no supuesto**:
- **Niguace: 116** combinaciones.
- **Isla Tormenta: 33** combinaciones.

El ámbito refleja dónde se documentaron los elementos onomásticos empleados; **no se afirma que una Especie concreta deba pertenecer a Niguace o a Isla Tormenta**. Forja permite filtrar por ámbito, no impone una relación cultural no documentada.

Ejemplos que ya constan en el tesauro: **Frida Ratazzi** y **Minara Dolcemare** (Niguace), **Nilsea Orbem** y **Tanto Cabeza de Oso** (Isla Tormenta). Todos son **combinaciones propuestas**.

## 2. Elección visible en Forja

En Fantasía, el selector **Nombres de Ylat** ofrece, en la distribución pública:

1. **Variantes inspiradas en Ylat (149)**, opción predeterminada.
2. **Repertorio propio de la Especie**.

La opción de **Personajes documentados (51)** se elimina **solo del HTML candidato**. Permanece en la interfaz de desarrollo para tareas editoriales, donde los 200 registros siguen disponibles.

Se incorpora **Procedencia del nombre de Ylat**, visible solamente cuando se usan combinaciones de Fantasía:

- Todas las procedencias (149).
- Niguace (116).
- Isla Tormenta (33).

La selección no restringe el conjunto de Especies ni modifica las reglas mecánicas del DRS. Las ediciones **CiFi, Nocturna y Dungeon Hack** mantienen sus sistemas de nombres. El **nombre manual tiene prioridad** sobre el generado.

Las fichas creadas con nombres combinados incorporan una observación informativa: **propuesta creada a partir de elementos de Ylat**, su ámbito y **ausencia de carácter canónico**.

## 3. Sexo: 27 nombres sin clasificación documental

El inventario original permite distinguir **78 nombres combinados clasificados como masculinos**, **44 clasificados como femeninos** y **27 cuyo nombre de pila no aparece en las listas documentales de clasificación de sexo**. La ausencia de clasificación **no demuestra que esos nombres sean neutros**.

Para evitar tanto inventar una clasificación como ofrecer una opción muerta, las 27 combinaciones sin clasificación **pueden seleccionarse con cualquiera de los sexos configurados**, acompañadas de una observación explícita de que **no se les ha atribuido clasificación documental de sexo**.

Cuando existe clasificación masculina o femenina, Forja continúa respetándola. El nombre manual y el repertorio de cada Especie mantienen sus propias reglas. Esta solución no declara un nuevo canon ni cambia la identidad de personajes de Ylat.

## 4. Separación física y protección de publicación

`scripts/crear-paquete-drs.js` filtra `data/tesauro-ylat.json` por `tipo: "combinado"` y exige **149 nombres e identificadores únicos**, sin borrar ni editar la fuente. El JSON servido por el paquete DRS contiene únicamente esas 149 entradas.

`scripts/comprobar-publicacion-drs.js` bloquea una distribución si:

- Falta o sobra cualquiera de las **149 combinaciones**, o hay nombres o IDs duplicados.
- Aparece una entrada de tipo **`documentado`** o de otro tipo no autorizado.
- El ámbito no corresponde a Niguace o Isla Tormenta, o cambian los recuentos **116/33**.
- El conjunto de entradas difiere de las **149 combinaciones originales autorizadas** del repositorio editorial.

La guardia anterior que rechazaba **cualquier** nombre de Ylat se sustituye por estas verificaciones, porque el autor ha autorizado expresamente los combinados.

`tests/paquete-publico-drs.js` compara los 149 registros de salida con la fuente original **entrada por entrada** y mantiene la ausencia de los 51 nombres documentados. También inyecta en una copia temporal un personaje documental y un nombre inventado para comprobar que el guardia los rechaza.

`tests/alcance-drs.js` valida los **200 registros conservados en desarrollo**, la distribución geográfica, las **27 propuestas sin clasificación de sexo**, los filtros de generación y la marca informativa de no canon. Las pruebas de navegador de **Chrome, Firefox y WebKit** comprueban el tesauro servido y las opciones públicas; Firefox/WebKit generan personajes con cada ámbito y verifican el nombre y la observación resultantes.

## 5. Estado

- **Aprobación editorial de los 149 nombres: cerrada.**
- **51 nombres documentados: excluidos del paquete público y conservados en desarrollo.**
- **No se han creado nombres nuevos ni atribuciones a Especies.**
- **No se modifica el DRS ni se concede ningún beneficio mecánico.**
- El paquete estático sigue siendo **candidato**, no un lanzamiento autorizado.
- PR #4 sigue **draft**, sin merge ni despliegue.

El siguiente criterio de salida es superar los **cuatro workflows** sobre el commit final: validación general, Chrome, Firefox/WebKit y paquete público físicamente depurado probado en los tres motores.
