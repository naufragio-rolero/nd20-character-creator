# Forja LIVE — PDF A5 + iconografía consolidada

## Procedencia del paquete
- **Código de base:** snapshot LIVE PDF A5 `609fd08946bb1d42d67dfcd4f08a14291c2f2e55`, previamente protegido por SHA.
- **Iconografía:** los **35 SVG independientes** de `assets/icons/` copiados de `main` después de la PR #50, commit `4f0249472e666a9717289459e40a3cf1ddcff651`.
- **Licencia y atribuciones:** `assets/icons/CREDITOS-GAME-ICONS.txt` (7 originales de El Naufragio y 28 derivados CC BY 3.0).
- **Fuentes SVG históricas:** archivo `docs/iconografia/` de `main`, solo para pruebas y trazabilidad, **no publicado**.
- **Prueba de iconos:** `tests/iconos-forja.js` de `main`.
- **Verificación de publicación:** `.github/workflows/forja-live.yml` en `main`; únicamente publica `dist/public-drs/`.

## Alcance
Se conservan el exportador PDF A5, los recursos locales (pdf-lib, fontkit, plantilla y tipografía), la generación de personajes, el DRS y sus verificaciones originales. **No se traen `index.html`, `assets/app.js` ni los scripts de paquete desde `main`**, porque el snapshot LIVE contiene el exportador PDF A5 que no se encuentra en esos archivos de `main`.

Se comprueban los 35 iconos servidos tras el despliegue: 7 originales y 28 derivados. Se comprueba que Gnomo utiliza **big-gear** de DarkZaitzev, Mago **pointy-hat** de Lorc y Mediano **baby-face** de Delapouite. La lista blanca DRS y la prohibición de CiFi/Nocturna se mantienen sin cambios.

La rama de lanzamiento permite recuperar exactamente la versión enviada a GitHub Pages. No contiene ninguna nueva regla de Naufragio d20.
