# La Forja — Iconos de Escuelas de Conjuros (diseño aprobado)

## Alcance
Primera de seis etapas de [la tarea #143](https://github.com/naufragio-rolero/nd20-character-creator/issues/143).
Seis **medallones SVG originales** diseñados para la interfaz de `spells/`; son recursos visuales, **no canon ni reglas de Naufragio d20**.
Se han preparado aislados de la PR #142. Su integración, el empaquetado público, los tests de navegador y PREVIEW pertenecen a los pasos posteriores.

## Especificación
- Lienzo fijo **24×24**; círculo de fondo centrado en **(12, 12)**, radio 11, con contorno interior discreto.
- Glifos blancos sobre fondos sólidos. Cada Escuela tiene **símbolo + color + nombre accesible** cuando se incorpore a la interfaz. No depender exclusivamente del color.
- Símbolos simplificados; sin sombras, tipografías, recursos remotos ni JavaScript en los SVG.
- **Elemental** tiene el motivo centrado mediante `translate(12 12)` y contorno de llama simétrico alrededor del eje vertical, sin el desplazamiento derecho del boceto.
- Futuro CSS: medallón junto al nombre, dimensiones estables y `flex-shrink:0`; ajustar lectura en los cinco temas (Clásico, Ébano, Cerúleo, Obsidiana y Violeta).
- Los iconos NO se incorporarán al JSON de Conjuros ni a la función de texto plano de «Copiar lista».

| Escuela | Recurso | Motivo | Fondo | Contraste glifo blanco (calculado) |
|---|---|---|---|---|
| Arcana | `assets/icons/escuela-arcana.svg` | estrella de cuatro puntas | `#2672AD` | 5.13:1 |
| Divina | `assets/icons/escuela-divina.svg` | disco solar | `#947000` | 4.59:1 |
| Nigromancia | `assets/icons/escuela-nigromancia.svg` | cráneo | `#7655AD` | 5.72:1 |
| Elemental | `assets/icons/escuela-elemental.svg` | llama simétrica | `#B24779` | 5.16:1 |
| Demonologia | `assets/icons/escuela-demonologia.svg` | máscara cornuda | `#A84F36` | 5.47:1 |
| Naturaleza | `assets/icons/escuela-naturaleza.svg` | hoja con nervio | `#317E49` | 4.99:1 |

## Procedencia y licencia
Los seis SVG son **dibujos originales de El Naufragio para La Forja**, realizados para esta tarea. No derivan de Game-icons.net; no se añaden autores externos ni se modifican las atribuciones de los SVG preexistentes.

## Validaciones pendientes
La estructura y los contrastes numéricos pueden comprobarse sin navegador, pero falta la **verificación visual real** en 16, 20 y 24 px, pantallas móviles, cinco temas y Chromium/Firefox/WebKit. También faltan las pruebas de interacción y empaquetado, que se abordarán en los pasos 2, 3, 5 y 6.
