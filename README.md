# Forja de personajes · El Naufragio

Generador de personajes para **Naufragio d20** y **Dungeon Hack**. Aplicación estática sin servidor. **CiFi y Nocturna** permanecen en preparación y no se muestran como sistemas disponibles.

**Web:** https://naufragio-rolero.github.io/nd20-character-creator/

## Objetivo y límites del proyecto

**La Forja sirve para crear personajes de forma rápida y fiable**, tanto para Cronistas que preparan personajes como para jugadores que quieren empezar a jugar sin dedicar una sesión entera a rellenar la ficha.

Su alcance es **generar, configurar, consultar y exportar fichas**: Especies, Ocupaciones, Atributos, Recursos, Talentos, Conjuros, Equipo inicial y compras puntuales documentadas. Prioridad para la legibilidad, la rapidez y la fidelidad a las fuentes.

**No es una mesa virtual ni un simulador de partida.** No desarrollaremos automatización de combate, gestión de turnos, viajes, desplazamientos, consumo por intervalos, seguimiento de encuentros o dirección de campañas. Un dato reglamentario puede mostrarse en la ficha sin convertirlo en una mecánica ejecutable.

**Criterio para nuevas funcionalidades:** deben ayudar directamente a **crear o consultar un personaje** y justificar su coste de interfaz y mantenimiento. Ante la duda, preferir una ficha sencilla y una referencia clara antes que añadir una pantalla, un sistema o una automatización. No inventar reglas ausentes del DRS ni trasladar automáticamente contenido de suplementos.

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
- Iconografía de Equipo y configurador: `docs/ICONOS-Y-CONFIGURACION-FORJA.md`.

Código GPL-3.0. Los textos originales conservan sus respectivas atribuciones y licencias.
