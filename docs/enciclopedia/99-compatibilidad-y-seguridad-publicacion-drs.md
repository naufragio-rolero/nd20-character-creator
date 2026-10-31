# Forja 1.0 — Compatibilidad de navegadores y bloqueo de publicación insegura

**Fecha:** 31/10/2026 · **PR:** [#4](https://github.com/naufragio-rolero/nd20-character-creator/pull/4), **draft**, sin fusionar ni desplegar.  
**Alcance normativo:** Núcleo Fantasía DRS; no se modifican reglas, precios, Competencias ni progresiones.  
**Antecedentes:** [informe 97](97-pruebas-navegador-compras-drs.md) y [98](98-revision-visual-carrito-y-navegacion.md).

## A. Navegadores: prueba independiente de Chrome

Hasta esta fase existía un recorrido completo en Chrome/Chromium. Esa cobertura no demostraba que el motor de compras funcionase en Firefox o Safari.

Se han creado:

- **`tests/browser-compatibilidad.js`**, un recorrido E2E con **Playwright** que abre realmente **Firefox (Gecko)** y **WebKit**, usando el servidor HTTP local y los mismos archivos de Forja.
- **`.github/workflows/compatibilidad-navegadores.yml`**, un tercer workflow de CI que instala temporalmente Playwright y los dos motores **solo en el entorno de GitHub Actions**. No añade dependencias npm al sitio estático.
- Capturas de pantalla móviles de Firefox/WebKit, adjuntas al workflow como artefactos durante 14 días.

### Cobertura verificable

En cada motor se comprueba:

1. Carga real del HTML y de los JSON, sin errores JavaScript.
2. **Solo cuatro Ocupaciones, ocho Especies y fuente DRS** en Fantasía. Se cambia de sistema a CiFi, Nocturna y Dungeon Hack y se regresa para comprobar que los selectores no incorporan DLC.
3. Creación de personaje Guerrero con riqueza, compra y cancelación sin descuento.
4. Reapertura de carrito, **Intro en Cantidad**, eliminación de una línea, recuperación de su precio, y compra de **dos Martillos de campamento y tres Tizas (4,03 mo)**.
5. **Antídoto Nivel 3 (150 mo)** y rechazo de compras que superan el presupuesto sin alterar el carrito.
6. Confirmación y actualización del equipo y saldo.
7. Editor visible y sin desbordamiento horizontal a 390 px.

**Resultado de las primeras ejecuciones:** Firefox y WebKit han superado el recorrido; el E2E antiguo continúa pasando en Chrome. **Precisión:** el motor WebKit ejecutado en Linux no equivale a probar Safari real en macOS o iOS, ni se pretende haber auditado todas las particularidades de accesibilidad.

## B. Hallazgo de seguridad de publicación: oculto no significa privado

**DRS-PUB-01 — BLOQUEO DE SALIDA A PRODUCCIÓN.**

Las pruebas anteriores detectan correctamente que las opciones suplementarias no aparecen en la **interfaz pública prevista de Fantasía**. Sin embargo:

- `assets/app.js` todavía descarga `data/catalogo-ampliado.json` (incluye **22 Especies y 33 Ocupaciones suplementarias de Fantasía**), incluso cuando su fuente no está habilitada en los selectores.
- `data/catalogo-poderes.json` contiene **433 Conjuros en total**, aunque la edición DRS solo permite **64**. También contiene Técnicas de suplementos y bloques de Poderes adicionales.
- Los dos archivos `data/conjuros-revisados-001-225.json` y `data/conjuros-revisados-226-434.json` contienen fichas del Tomo de Magia ampliado.
- `data/progresiones-oficiales.json` incorpora rutas suplementarias. `data/sexo-personajes.json` incluye nombres clasificados para Especies ajenas al DRS.
- El README recomendaba **GitHub Pages → Deploy from a branch → main → /(root)**. Eso publicaría los JSON de la raíz como **archivos descargables**, al margen de que la interfaz oculte sus registros.

**Conclusión:** publicar la raíz **no cumple** la decisión de entregar primero una Forja Fantasía limitada al DRS. La interfaz puede filtrar correctamente, pero eso **no constituye aislamiento de datos**. No hay evidencia de que esa publicación se haya hecho; el problema afecta al **procedimiento futuro** de despliegue.

### Mitigación incorporada ahora

1. En el README se **retira la instrucción de publicar la raíz** y se muestra una advertencia de bloqueo de publicación de Forja 1.0.
2. Se añade `scripts/comprobar-publicacion-drs.js`, que examina el **directorio físico candidato** a publicación:
   - Detecta Especies y Ocupaciones ampliadas en `catalogo-ampliado.json`.
   - Detecta Conjuros ajenos al DRS y Técnicas del suplemento en `catalogo-poderes.json`.
   - Detecta fichas de Conjuros ajenos a los 64 del DRS en los dos archivos de Tomo de Magia.
   - Detecta progresiones suplementarias de Fantasía y nombres de Especies extra en `sexo-personajes.json`.
   - Señala bloques de Poderes especiales cuya pertenencia al DRS no se ha verificado.
   - **Comprueba todos los archivos obligatorios de arranque** (JS, CSS y JSON): un directorio que solo tenga `index.html` tampoco puede obtener un resultado positivo engañoso.
3. Invocación estricta **`node scripts/comprobar-publicacion-drs.js CARPETA`**: termina con error si detecta riesgos. `--report` imprime la misma auditoría como informe **sin certificar seguridad**.
4. `tests/alcance-drs.js` comprueba que **la raíz actual resulte expresamente rechazada** y que el modo de informe registre las alertas. Así no puede interpretarse un CI verde como permiso de publicación de `main/(root)`.

**Importante:** el guardia detecta las fuentes de exposición conocidas y **no promete una auditoría total de licencias, privacidad ni seguridad**. La solución definitiva **todavía no está implementada**: necesita un paquete público depurado y probado.

## C. Próximo criterio para desbloquear la publicación

1. Construir un directorio final para despliegue, independiente de la raíz del repositorio de trabajo.
2. Decidir y verificar qué recursos necesitan las ediciones CiFi, Nocturna y Dungeon Hack, que no deben sufrir cambios colaterales; filtrar **físicamente** todos los datos de Fantasía ampliada no publicada.
3. Adaptar la carga inicial para que la versión pública **no solicite** JSON de suplementos que no están en el paquete, conservando los archivos originales en la rama de desarrollo.
4. Probar el directorio final con las tres baterías E2E y comprobar que no hay referencias externas rotas, ni catálogos suplementarios accesibles.
5. Ejecutar el guardia en modo estricto sobre **ese directorio final**. Solo después, revisar la autorización editorial del despliegue.

**No se han borrado los DLC ni se ha desplegado nada.** La separación física es **un bloqueo técnico de publicación**, no una petición para inventar nuevas reglas ni un desacuerdo sobre el contenido del DRS.
