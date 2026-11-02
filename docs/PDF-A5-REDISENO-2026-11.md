# La Forja · ejecución del rediseño PDF A5

**Estado:** prototipo editorial y técnico, 2026-11-02. **No se ha implementado ni publicado la exportación PDF en LIVE.**

## Decisión

La plantilla histórica `Nd20-FPJ-A5.pdf` se conserva como referencia, pero **no como primera página intocable**. Se rediseñan dos bases A5 verticales: una principal con cabecera, seis Atributos, Recursos y protecciones fijos, y otra de continuación con cabecera y cuerpo dinámico. La ficha futura no puede truncar silenciosamente datos ni atribuir reglas ausentes.

La auditoría de la PR #41 sigue siendo una fuente técnica válida para dimensiones, limitaciones y semántica. Su recomendación de superponer datos sobre el original se considera una alternativa editorial anterior, no el destino del proyecto.

## Activos originales localizados en Drive

Carpeta: `Juegos de Rol/Naufragio d20/Manual básico/`.

- `Fichas/Hoja de PJ/FichaPJ_A5.afpub`: proyecto original editable.
- `Fichas/Hoja de PJ/Nd20-FPJ-A5.pdf`: A5 histórico (419,76 × 595,44 pt, 7.973.386 bytes).
- `Fichas/Hoja de PJ/FichaA5_Personajes_pregen_Nd20.afpub`: maquetación histórica de fichas pregeneradas.
- `Fichas/Hoja de PJ/FichaA5_Personajes_pregen_Nd20_Fantasia.pdf`: 8 páginas apaisadas A4 (no confundir con una plantilla A5).
- `Identidad Nd20/Iconografía/naufragiod20_new_logo.svg` y `Materiales/nd20.svg`: referencias de identidad.
- `Plantillas Nd20/Maqueta/maqueta_nd20.afpub`: referencia del manual.

El proyecto `.afpub` está disponible, pero no se ha abierto con Affinity Publisher en el entorno de diseño. No afirmar que sus capas hayan sido auditadas.

## Correspondencia con el modelo

- `assets/rules.js`: `atributos[]` contiene `nombre,valor,dificultad,favorito`; `recursos[]` son pares `[nombre,valor]` y Salud puede incluir el dado en la misma cadena.
- `assets/app.js`: `descripcion` combina `Ocupación · Especie`; `capacidades[]`, `competencias[]`, `poderes[]`, `conjuros_preparados[]`, `equipo[]`, `riqueza` y `notas[]` se leen tal como existen.
- `assets/equipment.js`: `blindajeFicha()` comprueba la protección realmente equipada; nunca sumar escudo al blindaje permanente ni deducir protección natural sin fuente documental.
- No inferir EXP, monedas, Conjuros, protecciones ni estadísticas ausentes.

## Prototipos locales ya producidos

Se generaron **dos diseños principales A5** (compacto y clásico), **una continuación A5**, SVG editables, dos PDF vacíos vectoriales, mapa JSON de 32 campos fijos y tres zonas dinámicas, y una prueba de composición fuera del navegador. Los artefactos se revisan y entregan por separado antes de incorporarlos al repositorio.

Pruebas locales con **datos simulados compatibles con el esquema**, no exportaciones reales de la Forja:

| Escenario | Páginas | Registros preservados en el compositor |
|---|---:|---:|
| Nivel 1 | 1 | 8 |
| Guerrero con armadura y escudo | 1 | 10 |
| Arcanista, conocidos y preparados | 1 | 20 |
| Nivel 12 extenso | 2 | 38 |
| Nivel 30 extenso | 6 | 154 |
| Nombre largo/Unicode/sin armadura | 2 | 5 |

Se comprobó tamaño físico de todas las páginas, límites de texto, estructura PDF y ausencia de pérdidas según el registro interno del compositor. Los ejemplos fueron inspeccionados mediante renderizado PDF. **Esto no equivale a una prueba del exportador real en navegador.**

## Bloqueos antes de un PR funcional y de LIVE

1. Selección/aprobación editorial del diseño definitivo.
2. Verificar licencias del logotipo y de cualquier tipografía que se vaya a distribuir como activo web; el diseño de prueba no adjunta fuentes originales ni ilustraciones de terceros.
3. Integrar biblioteca PDF local y fuente Unicode; validar en Chromium, Firefox y WebKit.
4. Ejecutar fixtures generados mediante `assets/rules.js` con opciones de Nivel 1, 12 y 30, y confirmar integridad del PDF frente al objeto de salida.
5. Revisar impresión A5 real, peso y accesibilidad.
6. Solo entonces modificar lista blanca del paquete DRS, tests de despliegue y SHAs fijados en LIVE.

**Fuera del alcance:** Dungeon Hack, CiFi, Nocturna, simulación de combate, actualización de reglas, cambios de TXT y despliegue prematuro.
