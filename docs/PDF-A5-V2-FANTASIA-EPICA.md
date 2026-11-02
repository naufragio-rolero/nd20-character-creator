# Ficha A5 — v2 Fantasía Épica (prototipo local)

Fecha: 2026-11-02. **Sin integración ni despliegue en LIVE.**

## Identidad incorporada

Se ha producido una segunda versión de las plantillas A5 utilizando exactamente el asset gráfico `naufragiod20_faep.svg` de la carpeta `Juegos de Rol/Naufragio d20/Manual básico/Identidad Nd20/Iconografía`. Se mantiene separado el asset `naufragiod20_cifi_1.svg` para un futuro diseño CiFi.

La identidad visual recupera panel de nombre/especie/ocupación, rotulación Fantasía Épica, títulos serif, marcos hexagonales compactos y tinta gris muy tenue. Mantiene 32 campos fijos y zonas dinámicas. **El SVG fuente de marca contiene una imagen PNG embebida; no es geometría vectorial pura.**

## Producción y pruebas locales

Archivos generados fuera de GitHub: `forja-nd20-fantasia-epica-a5-v2.svg/.pdf`, `forja-nd20-continuacion-a5-v2.svg/.pdf`, `campos-ficha-a5-v2.json`, seis muestras PDF y compositor local actualizado. Todos los PDF tienen dimensiones A5. Todos los ejemplos presentan el logotipo.

| Muestra simulada | Páginas | Entradas incluidas / de origen |
| --- | ---: | ---: |
| Nivel 1 | 1 | 8/8 |
| Guerrero con escudo | 1 | 10/10 |
| Arcanista | 1 | 20/20 |
| Nivel 12 | 2 | 38/38 |
| Nivel 30 | 6 | 154/154 |
| Nombre largo y Unicode | 2 | 5/5 |

Se detectaron y corrigieron solapamientos de la cabecera de continuación antes de la entrega.

## Limitación tipográfica explícita

La ficha histórica contiene **subconjuntos incrustados e incompletos** de Source Serif Pro, además de Komikazoom. La grafía Komikazoom está preservada en el logotipo aportado, pero no se dispone de los archivos completos de Source Serif Pro para componer nuevos textos con todos los caracteres Unicode. La v2 **usa Liberation Serif incrustada como aproximación**, no Source Serif Pro exacta. No se comparten archivos de fuentes. Para publicación final, incorporar la fuente completa con derechos verificados.

## Próximo hito

Revisión editorial de la estética, validación tipográfica, integración local con pdf-lib, pruebas E2E y adecuación de la lista blanca del paquete DRS. Esta documentación no implica la incorporación de los binarios de plantilla al repositorio. No fusionar ni promover LIVE sin esos pasos.
