# La Forja de Naufragio d20

**La Forja** es una aplicación web para generar y consultar fichas de **Naufragio d20** y **Dungeon Hack**. Funciona en el navegador, sin instalar programas ni registrarse.

**[Abrir La Forja](https://naufragio-rolero.github.io/nd20-character-creator/)**

## Navegación modular (candidato en desarrollo)

La portada `index.html` da acceso a **Personajes** (`characters-nd20/`) y **Conjuros** (`spells/`). Personajes conserva las pestañas de Seguidores y Adversarios. Los nombres `techs/` y `songs/` están reservados para futuras herramientas, todavía no implementadas. El aspecto comparte Exo y los temas Clásico, Ébano, Cerúleo, Obsidiana y Violeta.

Los enlaces portátiles `#share=` permiten reconstruir la generación original de un personaje a partir de semilla y configuración, consultar una biblioteca compartida de Listas de Conjuros o abrir un adversario como borrador validado. **No equivalen a almacenamiento remoto ni sincronización.** Tampoco guardan las ediciones posteriores al generar personajes. Más detalle en [Arquitectura modular](docs/ARQUITECTURA-FORJA-MODULAR.md).

Esta estructura permanece en una rama candidata hasta superar las pruebas y aprobar su despliegue; la URL pública sigue mostrando únicamente la revisión fijada para LIVE.

## Qué ofrece

- **Personajes:** generación por Nivel, Especie y Ocupación, opciones de personalización documentadas, consulta de Talentos, Poderes y Equipo, y exportación de fichas.
- **Seguidores:** generación de acompañantes conforme a las reglas del sistema elegido.
- **Adversarios:** fichas propias, importación de texto, consulta de perfiles oficiales y colección local exportable.
- **Semillas:** resultados reproducibles escribiendo una semilla en **Configurar creación**. Si el campo se deja vacío, cada generación utiliza azar nuevo.

La versión pública incluye **Naufragio d20 · Fantasía Épica** y **Dungeon Hack**. CiFi y Nocturna están en preparación.

La Forja **no es una mesa virtual ni un simulador de combate**. Las fichas personales de adversarios se guardan en este navegador: conviene exportarlas para conservar una copia externa.

## Desarrollo

Aplicación estática de HTML, CSS y JavaScript. Para probarla localmente:

```sh
python -m http.server 8000
```

Abre `http://localhost:8000`. Prueba básica:

```sh
node tests/smoke.js
```

Las pruebas de navegadores, la construcción del paquete público DRS y la publicación protegida se gestionan con GitHub Actions. Consulta la **[política de desarrollo y publicación](docs/POLITICA-DESARROLLO-PUBLICACION.md)** antes de contribuir.

## Autoría y licencia

Proyecto de **[El Naufragio](https://naufragio.net/)**. Código bajo **[GPL-3.0](LICENSE)**. Los contenidos y los iconos de terceros conservan sus atribuciones y licencias.
