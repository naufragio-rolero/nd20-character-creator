# ADR — La Forja modular, multijuego y enlaces portátiles

**Estado:** decisión de diseño aceptada para desarrollo, pendiente de QA y aprobación para LIVE. **Fecha:** 2026-11-16.

## Registro de decisiones de la conversación

1. La Forja pasa de una pantalla única a una **portada** (`index.html`) con bloques de herramientas. En el primer diseño destacan **Personajes** (icono de persona) y **Conjuros** (icono de libro). Los otros módulos pueden incorporarse progresivamente. La herramienta actual conserva sus funcionalidades: Personajes, Seguidores y Adversarios.
2. Cada módulo es autónomo y usa **la misma identidad de La Forja** (Exo, variables de colores y cinco temas Clásico, Ébano, Cerúleo, Obsidiana, Violeta, logotipo, SVG en proporción 1:1, accesibilidad y adaptación móvil). No crear una interfaz oscura ajena ni rediseñar las reglas.
3. Rutas coherentes en inglés: `/characters-nd20/` inicialmente, `/spells/` para Conjuros, `/techs/` para Técnicas, `/songs/` para Canciones. Adversarios es `/adversaries/`. `techs` y `songs` son **rutas reservadas**, no módulos implementados. La navegación no sustituye arbitrariamente los slugs establecidos.
4. Diseñar siempre con **sistemas y fuentes separados**. Además de Naufragio d20 Épica, se contemplan **Dungeon Hack**, los suplementos o variantes **Futura**, **Nocturna**, etc. Ninguno se publica ni se da por oficial por aparecer en un identificador o menú. Claves de sistema/fuente y sus versiones deben registrarse; el runtime valida disponibilidad real, sin inventar tablas ni reglas.
5. Separación entre catálogo normativo (DRS), bibliotecas locales, propuestas editoriales y datos compartidos. La selección de una Lista de Conjuros no crea Espacios ni modifica una tabla de progresión. Centinela v5 continúa como **caso de revisión no aprobado**. Preservar la PR #140 y el motor existente; no duplicar motores de personaje, conjuro o adversario.
6. **Compartir sin cuentas ni base de datos, primera etapa**: enlaces que **transportan** una instantánea versionada de los datos en el fragmento `#data=...`. El receptor la valida y puede reproducirla/importarla de forma local. No es un identificador aleatorio recuperable desde un servidor; un UUID/semilla aislado no recupera cambios arbitrarios. El fragmento no sale en solicitudes HTTP normales, pero **cualquiera que conozca el enlace conoce sus datos**. Evitar información privada. No hay sincronización ni ediciones remotas.
7. **Reproducción de personajes**: semilla + configuración + versión reproducen una generación original con el motor actual; no recuperan las modificaciones posteriores de Talentos, Conjuros preparados, compras, equipo, etc. Los lotes se reproducen como lotes. Para ficha final exacta se requiere otro contrato (instantánea validada), que no se fingirá implementado. Diferenciar claramente «Compartir generación» de «Compartir ficha».
8. **Listas de Conjuros**: compartir solo datos personales mínimos (nombre, Círculo máximo y IDs de Conjuros del DRS, no copiar las fichas normativas), importar como creación personal tras validación. No permitir que un enlace ascienda una propuesta a oficial.
9. **Adversarios**: compartir una ficha normalizada y validada (incluidos ataques, Talentos y datos manuales), **sin modificar el catálogo DRS**. Imágenes personales grandes requerirán otra vía (JSON/archivo) si el enlace supera el límite.
10. Enlaces cortos arbitrarios `/modulo/UUID` necesitan almacenamiento o un índice remoto; se evaluarán en el futuro, no se prometen en esta fase. Para GitHub Pages, preferir rutas reales con `index.html` de cada módulo y fragmentos estáticos, sin dependencia de reescritura de rutas.
11. Publicación protegida: **no** cambiar `.github/workflows/forja-live.yml` ni el SHA fijado, ni desplegar LIVE por el mero hecho de crear un commit. El paquete público se controla mediante lista blanca DRS y QA, con validación autoral y promoción explícita posterior. Probar antes de proponer el despliegue.

## Etapas de implementación

- A. Documentar el contrato y aislar la portada del editor histórico mediante rutas reales. Mantener archivos y cargas de datos existentes con rutas relativas a la base.
- B. Unificar el editor de Conjuros con los estilos de La Forja y conectar los iconos de la portada.
- C. Implementar enlaces portátiles versionados y acotados con importación segura: primero generación de personajes y listas, después instantáneas de Adversarios; cada vía solo se declara terminada cuando tiene pruebas.
- D. Corregir pruebas, empaquetado público y regresiones; solicitar aprobación antes de cualquier publicación LIVE.

## Garantías de compatibilidad

- Las rutas dentro de GitHub Pages deben funcionar también bajo un prefijo de proyecto (no usar rutas absolutas del dominio).
- No escribir la biblioteca local al abrir un enlace sin consentimiento o una acción de importación explícita.
- No ejecutar HTML importado, ni confiar en el tipo de sistema incluido en el enlace.
- Mantener las URL históricas documentadas y diseñar redirecciones controladas al publicar la portada, evitando romper enlaces compartidos.
- Las reglas de **Dungeon Hack** y de cada suplemento de Nd20 deben permanecer segregadas y comprobadas con el material verdaderamente disponible.

## Límites y tareas pendientes

El editor de Conjuros reside en la PR #140, todavía no publicada. El refactor de la portada depende de esa base, por lo que su incorporación a main debe preservar el orden de revisión. Los enlaces portátiles no proporcionan almacenamiento persistente centralizado, sincronización entre jugadores ni IDs remotos breves. El contrato de instantáneas completas de Personajes necesita una auditoría específica para no perder cambios posgeneración.

**Fuentes de código consultadas:** `index.html`, `assets/app.js`, `assets/creatures-library.js`, `assets/creatures-ui.js`, `assets/spell-lists.js`, `assets/spell-lists-ui.js`, `assets/styles.css`, `assets/spell-lists.css`, `scripts/crear-paquete-drs.js`, `.github/workflows/forja-live.yml`.
