# Forja 1.0 — Banco histórico de nombres de Ylat integrado

**Fecha:** 31/10/2026 · **PR #4:** borrador, sin fusión ni despliegue.  
**Autorización:** el autor aprueba expresamente utilizar el «Generador — Nombres (Principal).xlsx» como fuente de nombres para personajes nuevos en Ylat.  
**Fuentes:** [Excel histórico de nombres](https://docs.google.com/spreadsheets/d/1ImXMEU0Lb03l7TdRo7vr8E4X2IQrlmmQ/edit), [informe 104](104-fuentes-google-docs-y-generador-historico-ylat.md) y [documentación de lenguas](https://docs.google.com/document/d/1FhYWtfZHKoAlr9aQAFLCVej3Uc7s_sVKRp-dMjwsTN4/edit).

## 1. Importación trazable

Se importa exclusivamente la **columna `ID.6` / `Nombre.6`**, identificada como **Ylat** en el Excel histórico. No se mezclan las columnas de nombres de los generadores Americano, Ruso, Árabe ni Vikingo.

- **1428 filas** originales, con identificador consecutivo **1–1428**.
- **1422 formas únicas** después de retirar espacios periféricos.
- Seis formas que aparecen dos veces: **Chator, Crit, Oughios, Enotia, Sulaos y Lyeytia**.
- Archivo de desarrollo `data/nombres-historicos-ylat.json`: conserva **las 1428 filas**, cada una con `id`, `nombre` y `fila_fuente` para auditarla contra el Excel.
- Archivo público con el mismo nombre: conserva **la primera aparición de cada forma** (**1422 registros**) para que las seis repetidas no tengan el doble de probabilidad de salir.

El generador histórico solo avala la **existencia de esas formas en un banco de nombres**. No avala de forma individual una clasificación por sexo, pueblo, dialecto, Especie, casa noble, linaje ni identidad de personaje. Por ello **Forja no atribuye ninguno de esos metadatos** a los nombres importados.

## 2. Interfaz y generación

En Fantasía, la opción predeterminada es:

**«Banco histórico de nombres de Ylat (1422)»**.

Se mantienen las alternativas **«Variantes inspiradas en Ylat (149)»** y **«Repertorio propio de la Especie»**. La opción de **51 personajes documentados** continúa disponible solo en desarrollo para revisión editorial, **no** en la distribución pública.

El selector **«Corpus de referencia de Ylat»** aparece únicamente con las **149 combinaciones**; no se aplica al banco histórico, cuyas 1428 filas **no contienen información contrastada sobre cultura o lugar de origen**.

La creación de una ficha con un nombre histórico:
- elige una de las **1422 formas únicas**, sin sesgo por duplicación;
- admite sexo masculino o femenino de la ficha **sin afirmar que el nombre tenga ese sexo**;
- señala expresamente que el nombre proviene del generador histórico y que **no implica personaje canónico, sexo documental, Especie, cultura ni linaje**;
- respeta el nombre indicado manualmente por encima del generado;
- no modifica Atributos, Ocupaciones, Conjuros ni otras reglas DRS.

Los modos anteriores funcionan igual. CiFi, Nocturna y Dungeon Hack conservan sus propios repertorios.

## 3. Protección y pruebas

- `scripts/crear-paquete-drs.js` incluye el archivo mediante **lista blanca** y elimina únicamente los seis registros duplicados de la distribución; el archivo original queda intacto.
- `scripts/comprobar-publicacion-drs.js` compara las **1422 formas finales con los registros autorizados de desarrollo**, comprueba sus IDs y el recuento y rechaza variaciones silenciosas.
- `tests/alcance-drs.js` valida recuentos, selección y observaciones en fichas de ambos sexos.
- `tests/paquete-publico-drs.js` exige 1422 formas públicas y simula una alteración no autorizada, que debe bloquearse.
- Los tests Chrome/Firefox/WebKit cargan ambos repertorios y generan fichas reales con el nuevo modo histórico.
- Se sigue excluyendo físicamente el DLC Fantasía y las 51 identidades documentadas del tesauro previo.

## 4. Cómo ver la nueva versión, sin desplegar nada

El workflow [Forja — candidato público DRS](https://github.com/naufragio-rolero/nd20-character-creator/actions/workflows/paquete-publico-drs.yml) construye un **paquete estático revisable** en cada commit de la PR y, **solo si todas sus pruebas pasan**, adjunta el artefacto ZIP **`forja-drs-candidato-no-publicado`** durante **7 días**.

1. Abrir la ejecución correspondiente al SHA final y descargar el artefacto, estando autenticado en GitHub.
2. Descomprimir el ZIP en una carpeta vacía.
3. Desde esa carpeta, iniciar un **servidor web local** (la aplicación carga JSON mediante `fetch`, por lo que abrir `index.html` mediante `file://` no es suficiente). Si Python está instalado, ejecutar `py -m http.server 8765` en Windows o `python3 -m http.server 8765` en otros sistemas.
4. Abrir **http://localhost:8765** en el navegador, entrar en Fantasía y seleccionar **«Banco histórico de nombres de Ylat (1422)»**. El modo es predeterminado.

Este procedimiento permite **ver y probar Forja ya**, sin una publicación externa. **No se ha activado GitHub Pages**, ni se ha fusionado la PR. Un futuro enlace de vista previa pública requeriría desplegar explícitamente solo la carpeta filtrada, no el repositorio raíz.

## 5. Límites editoriales pendientes

La aprobación de las 1428 **formas** no atribuye nombres concretos a una cultura o lengua. El estudio de los Google Docs de **Zonas**, **Lenguas**, **Biografías** e **Historia de Shadaleen** sigue siendo el fundamento para una futura clasificación cultural trazable. Tampoco se han mezclado esas formas con nombres de personajes documentados, ni se han inventado apellidos.

**Estado:** banco histórico importado e incorporado a Forja, sujeto a las validaciones CI del commit final. La publicación web externa no está autorizada ni se ha realizado.
