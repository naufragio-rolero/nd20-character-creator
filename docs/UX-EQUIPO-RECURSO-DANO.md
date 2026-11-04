# Forja — Ficha legible y configuración de equipo en diálogo

**Fecha:** 03/11/2026. **Base:** Naufragio d20 Fantasía DRS, sin cambiar el sistema ni las operaciones económicas de la PR #60. **Estado:** desarrollo; no supone publicación LIVE.

## Problema observado

La ficha mostraba «Contexto del personaje» antes de los Atributos, dos selectores de protección debajo del inventario, avisos de compras en el cuerpo y botones de «Armamento»/«Útiles» separados. La cuadrícula de Equipo y Conjuros ya tenía dos columnas, pero mezclaba las viñetas del elemento `li`, iconos alineados a la línea base y textos desiguales.

## Presentación

- `Contexto del personaje` pasa al final, por encima de «Otros avisos» y antes del pie.
- Las listas compactas de Talentos, Conjuros conocidos/preparados y Equipo conservan `ul/li` semánticos, pero se presentan **sin viñetas**, con dos columnas, celdas de altura mínima, separadores suaves y iconos alineados verticalmente por cuadrícula CSS. En móviles estrechos se usa una columna.
- El pie muestra un solo botón «Equipo» junto a PDF y Copiar. La elección de arma, armadura, escudo y el histórico de reglas/compras se consultan desde un **diálogo modal central**. Desde ese diálogo se accede a los editores ya validados de «Armas y protecciones» y «Útiles y objetos», cerrando el diálogo central antes de abrir el especializado para impedir modales anidados.
- Escape, cerrar y «Volver a la ficha» devuelven el foco al botón «Equipo». Los cambios de protecciones y arma se aplican a la ficha inmediatamente.

## Daño literal documentado

`assets/equipment.js > armasDisponibles` devuelve únicamente armas y Varitas de defensa **efectivamente presentes en el inventario**, tanto piezas individuales como cantidades `×N`; no considera los regalos de nombre compuesto una coincidencia. `danoFicha` identifica por nombre exacto la elección `arma_equipada` y devuelve el campo `dano` de `data/equipo-inicial.json`.

El Recurso «Daño» se muestra en la rejilla superior: **dados de daño del arma adaptados a la Potencia del PJ y nombre del arma activa**. El daño base del catálogo se conserva (Espada larga 1d8; Potencia 2 → 2d8; Potencia 3 → 3d8). También se actualizan los daños ofrecidos en el selector de armas del diálogo, la copia de ficha y el PDF A5 (campo de arma equipada e inventario, este último con indicación explícita de Potencia). Los seguidores y los Poderes no adquieren este multiplicador. Las conversiones de Potencia 0 o negativa siguen literalmente la tabla del DRS y no se deducen equivalencias no documentadas.

Antes, el Recurso «Daño» mostraba el **dado literal y nombre del arma activa**. Sin selección o sin posesión muestra «— / Sin equipar». El cambio y el intercambio de equipo invalidan una elección si la pieza ya no se posee. No se ejecutan ataques, no se aplican modificaciones de Atributo o Nivel, no se consumen recursos y no se inventa daño por uso sin armas. El PDF A5 identifica la pieza activa dentro del inventario, sin cambiar reglas ni plantilla de combate.

## Verificación

- Regresión Node: inventario exacto, dado de Daga y Varita, ausencia de daño sin selección, no conservar equipamiento perdido y anotación PDF.
- Chrome: acceso por botón único, selecciones y compras completas, Dardo 5 mc, carrito y foco.
- Firefox/WebKit: recursos en tres columnas en escritorio/dos en móvil, celdas sin viñetas, iconos alineados, modal, selección de arma/protección y popups de Talentos sin interferencia.
- Mantener intactas las comprobaciones de empaquetado DRS, 35 SVG, PDF A5, exclusión de CiFi y Nocturna.

**Publicación:** integrar en `main` únicamente tras CI actual satisfactoria; LIVE es independiente, con SHA expresamente aprobado.
