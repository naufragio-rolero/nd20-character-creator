# Forja: iconografía y configuración de creación

## Iconos

Todos los símbolos están en `assets/icons-forja.svg` (`viewBox="0 0 24 24"`), invocados desde `assets/app.js` con `<svg><use href="assets/icons-forja.svg#ID"></use></svg>`. El tamaño y los colores se controlan en `assets/styles.css`.

- Poderes: `ico-conjuro`, `ico-tecnica` (función `presentarPoder()`).
- Recursos: `recurso-salud`, `recurso-esfuerzo`, `recurso-movimiento`, `recurso-potencia`, `recurso-esencia`, `recurso-blindaje`.
- Configuración: `ico-configurar` (engranaje).
- Equipo: `equipo-espada` (armas cuerpo a cuerpo), `equipo-arco` (a distancia), `equipo-varita`, `equipo-bolsa` (genérico), `equipo-mochila` (almacenamiento), `equipo-orbe` (foco), `equipo-libro`, `equipo-armadura`, `equipo-escudo` y `equipo-municion`.

Los trazos son **provisionales** y solo representan categorías visuales. Para crear una familia propia conservad los `id`, `viewBox` y el trazo mediante `currentColor`; no hace falta modificar el programa. Los SVG son decorativos (`aria-hidden="true"`).

## Asociación con Equipo

`iconoEquipo(nombre)` en `assets/app.js` consulta primero los registros literales de `data/equipo-inicial.json`: `armas`, `varitas_defensa`, `armaduras`, `escudos`, `municion`, `focos_conjuros_con_precio` y `utiles_fantasia`. En útiles documentados, reconoce nombres explícitos de libros o almacenamiento. Para textos externos o de Dungeon Hack aplica un respaldo conservador por nombre; lo demás recibe bolsa genérica. No se deduce ninguna regla, competencia ni propiedad mecánica. El nombre original de cada objeto se mantiene para consultar, copiar y exportar.

## Configurar creación

El panel lateral resume los valores activos de **Nivel**, **Ocupación**, **Especie**, **Sexo**, **Modo** y **Fichas**. «Configurar creación», con engranaje, abre el `<dialog id="dialogo-configuracion">` que contiene el mismo formulario `#configuracion`, incluidos los diálogos de selección de Especie y Ocupación. Se puede «Aplicar opciones» sin generar, o «Generar personaje» desde el modal; el botón principal lateral y el flotante siguen enviando el mismo formulario. No hay copias paralelas de los controles.

El botón flotante se ofrece con la mesa vacía incluso en primera visita móvil; cuando la mesa tiene fichas, evita duplicar el principal y no cubre el pie de página. Las opciones no se aplican a los personajes ya creados. El código conserva el modo Personalizado y la validación reglamentaria.

## Pruebas y despliegue

Probar desde `tests/browser-compatibilidad.js` y `tests/browser-compras.js` los diálogos, foco, resumen, creación normal y personalizada, móvil, SVG y fichas emergentes; validar `tests/paquete-publico-drs.js`. El flujo `.github/workflows/forja-live.yml` mantiene una lista blanca con blobs SHA fijados: el paquete público **no debe publicar la raíz del repositorio** ni incluir CiFi/Nocturna no aprobados.
