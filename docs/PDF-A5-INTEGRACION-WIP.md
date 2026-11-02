# Integración PDF A5 Fantasía Épica en la Forja

**Estado:** rama de desarrollo independiente `feat/pdf-a5-browser-integration`, no publicada en LIVE. La plantilla y sus originales viven en PR #43; esta integración se propone por PR apilada sobre esa rama.

## Alcance y límites

- Se introduce **Exportar PDF A5** en el pie de cada personaje de `Naufragio d20 · Fantasía`.
- **No** se toca `assets/icons-forja.svg`, `assets/favicon.svg` ni los iconos de Especie/Ocupación. Otro trabajo de iconografía puede continuar por separado.
- No se modifica `assets/rules.js`, `assets/powers.js`, `assets/equipment.js`, inventario, generación ni exportación TXT.
- La protección se calcula mediante `blindajePersonaje(personaje)` existente y el bonus de escudo no se incorpora al Blindaje.
- PDFs solo desde el mismo origen de Forja, sin CDN ni servicios externos. No se hacen llamadas durante la composición, más allá de cargar dependencias y plantillas locales.

## Archivos y carga

1. `index.html` carga `assets/pdf-export-v2.js` y `assets/pdf-export-browser.js` antes de `assets/app.js`.
2. `assets/app.js` añade un botón por personaje de Fantasía, vinculado al ID de la ficha. El resto de sistemas no lo muestran.
3. `assets/pdf-export-browser.js` carga **bajo demanda** los recursos locales y guarda el resultado como `application/pdf`, sin modificar la ficha.
4. `assets/pdf-export-v2.js` superpone campos sobre las plantillas, desplaza texto extenso a continuaciones y copia páginas A5 según necesidad.
5. Los SVG/PDF principales y la continuación, mapa de coordenadas y emblema `naufragiod20_faep.svg` se conservan como activos específicos de esta funcionalidad.

## Preparación reproducible de activos (solo desarrollo)

En la raíz del repositorio, con Node 22+:

```sh
npm install --no-save --no-package-lock --ignore-scripts \
  pdf-lib@1.17.1 @pdf-lib/fontkit@1.1.1 \
  @expo-google-fonts/source-serif-4@0.4.1
node scripts/preparar-vendor-pdf-a5.cjs
node tests/pdf-export-model.js
node tests/pdf-export-adaptador.js
node tests/pdf-export-compositor-mock.js
node tests/pdf-a5-etiquetas.js
node tests/pdf-a5-integracion.js
node tests/pdf-a5-real.cjs
```

Esto prepara:

- `assets/vendor/pdf-lib.min.js` (MIT)
- `assets/vendor/fontkit.umd.min.js` (MIT)
- `assets/pdf-a5/SourceSerif4_400Regular.ttf` (SIL OFL 1.1, distribución autorizada conforme a su licencia)

**No se incluyen fuentes originales extraídas de Affinity ni del PDF histórico.** Source Serif **4** es una alternativa libre compatible con el estilo de Source Serif Pro, pero no es exactamente la misma fuente. El logotipo de Fantasía Épica permanece intacto.

El script de preparación genera archivos locales que requieren auditoría y empaquetado; no equivale a publicar ni a desplegar el sitio.

## Criterios antes de LIVE

1. CI de la rama superada con `pdf-lib` y `fontkit` **reales**, no solo mocks.
2. Pruebas end-to-end en navegador con fichas realmente generadas, incluyendo compra de útiles, protecciones equipadas y Nivel 30.
3. Validar visualmente el PDF y la impresión A5.
4. Añadir todos los activos autorizados al empaquetador DRS; **el paquete público no puede depender de recursos ausentes en el servidor**.
5. Mantener separado cualquier cambio contemporáneo de iconografía mediante actualización/rebase de `main` antes de fusionar.
6. Actualizar el flujo de promoción fijado por SHA, sin alterar su seguridad ni publicar DRS ajeno.
7. Confirmar atribuciones y licencias de tipografía, bibliotecas y emblema.

**No fusionar esta PR ni activar la exportación en LIVE hasta completar los puntos anteriores.**
