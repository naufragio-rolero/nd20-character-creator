# Forja de personajes · El Naufragio

Generador de personajes para **Naufragio d20** y **Dungeon Hack**. Aplicación estática sin servidor. **CiFi y Nocturna** permanecen en preparación y no se muestran como sistemas disponibles.

**Web:** https://naufragio-rolero.github.io/nd20-character-creator/

## Desarrollo y pruebas

```sh
python -m http.server 8000
node tests/smoke.js
node scripts/crear-paquete-drs.js
node scripts/comprobar-publicacion-drs.js dist/public-drs
node tests/paquete-publico-drs.js
```

Nunca publicar el directorio raíz: el único paquete público es el DRS depurado, distribuido por `.github/workflows/forja-live.yml` desde una revisión validada.

## Editar y traducir
- Textos: `locales/es.json` y `index.html`.
- Mensajes generados: `assets/app.js`.
- Internacionalización: `assets/i18n.js` (otros idiomas pendientes).
- Documentación editorial: `docs/enciclopedia/`.
- Tareas de Forja 1.2: `docs/PLAN-FORJA-1-2.md`.

Código GPL-3.0. Los textos originales conservan sus respectivas atribuciones y licencias.
