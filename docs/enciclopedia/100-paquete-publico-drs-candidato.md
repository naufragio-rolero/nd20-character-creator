# Forja 1.0 — Primer paquete estático candidato DRS, separado de los DLC

> **Revisión cerrada (31/10/2026):** la [auditoría literal del informe 101](101-fidelidad-literal-64-conjuros-drs.md) ya ha cotejado las **64 fichas** con el DOCX original. Se restaura «Forja arcana» al texto DRS, se unifica un duplicado idéntico de «Arma elemental» y se verifican 64 huellas SHA-256 por ficha. El contenido anterior que habla de cotejo de Conjuros «pendiente» refleja el estado histórico previo y queda sustituido por esta comprobación.

**Fecha:** 31/10/2026. **PR #4:** borrador; **sin fusionar ni desplegar**.  
**Reglas:** `NaufragioD20DRS.docx` y decisiones editoriales ya documentadas sobre Dardo, Marca del dador oscuro, Ladrón y Martillo de campamento.  
**Ámbito:** solo **Fantasía DRS** se depura; **CiFi, Nocturna y Dungeon Hack** se conservan. No se han creado reglas nuevas.

## Problema de publicación resuelto a nivel de candidato

Hasta ahora `index.html` obtenía los datos desde el repositorio de trabajo. Una interfaz que ocultase DLC seguía **sirviendo sus JSON completos** en GitHub Pages si se publicaba desde `main/(root)` (véase [informe 99](99-compatibilidad-y-seguridad-publicacion-drs.md)). Solo filtrar el selector no era aislamiento de datos.

**Implementación:** `scripts/crear-paquete-drs.js` crea `dist/public-drs/` mediante una **lista blanca de archivos de arranque**. Nunca copia automáticamente el árbol completo de desarrollo. La salida se limita por código a una subcarpeta de **`dist/`**, para impedir que un error de ruta pueda borrar `assets/`, `data/` o el repositorio. Los datos fuente se conservan y pueden seguir usándose para revisar DLC.

Para reproducir:

```sh
node scripts/crear-paquete-drs.js
node scripts/comprobar-publicacion-drs.js dist/public-drs
node tests/paquete-publico-drs.js
```

**Ninguno de estos comandos despliega la web.** Una ejecución verde crea únicamente un **candidato a revisar**.

## Qué cambia dentro del paquete

| Archivo o grupo | Política de publicación DRS |
|---|---|
| `data/especies.json`, `data/ocupaciones.json` | **8 Especies y 4 Ocupaciones** intactas |
| `data/catalogo-ampliado.json` | Vacía solo `fantasia.especies` y `fantasia.ocupaciones`; **preserva CiFi y Nocturna** |
| `data/catalogo-poderes.json` | Conserva **64 Conjuros de origen Nd20**, **10 Técnicas DRS** y **4 Técnicas CiFi**; mantiene poderes psiónicos, argucias y scripts de CiFi; elimina grupos especiales de Ocupaciones fantásticas suplementarias |
| `data/conjuros-revisados-*.json` | Conserva únicamente las fichas cuyos identificadores pertenecen a los **64 Conjuros DRS** |
| `data/conjuros-magnitudes-literales.json`, `data/conjuros-danio-compuesto.json` | Elimina registros que no corresponden a los identificadores de los **64 Conjuros DRS** |
| `data/progresiones-oficiales.json` | Conserva 4 progresiones DRS + las de CiFi y Nocturna; vacía solo `ampliadas.fantasia` |
| `data/sexo-personajes.json` | Retiene nombres y convenciones para Especies DRS, CiFi y Nocturna; elimina las referencias específicas a Especies/Ocupaciones futuras de Fantasía |
| `data/fichas-documentales.json` | Solo fichas documentales de Fantasía **DRS** y de los demás sistemas; sin Talentos de Ocupaciones fantásticas suplementarias |
| `data/alcance-drs-y-dlc.json` | Mantiene el manifiesto DRS; elimina la relación interna de DLC posteriores |
| `data/tesauro-ylat.json` | Conserva la estructura, pero **no incluye los nombres de PNJ procedentes de documentos de ambientación ajenos al DRS** |
| `data/equipo-inicial.json`, datos CiFi y Dungeon Hack | Inalterados |

El HTML candidato también elimina referencias de ayuda a Ocupaciones/especies suplementarias y configura el nombre por **repertorio propio de la Especie**, sin prometer los 200 nombres documentales de Ylat. No se borra el tesauro original: sigue en la rama de desarrollo. **La exclusión de nombres documentales de Ylat es una decisión técnica conservadora de separación de fuentes**; si se desean en la primera publicación, deberán tratarse expresamente como contenido adicional autorizado. La creación mediante nombres de Especie o nombre manual sigue disponible.

**Precisión:** las fichas revisadas que sobreviven son las **asociadas a los 64 Conjuros DRS**; el origen del texto revisado es el Tomo de Magia. Que tengan la misma identidad que los Conjuros DRS **no certifica que toda su redacción coincida literalmente** con la entrada de la ficha del DRS; es una comprobación editorial adicional recomendable antes de hacer público el candidato.

## Pruebas añadidas

- `tests/paquete-publico-drs.js` abre **los JSON físicos de `dist/public-drs`** y confirma la correspondencia literal de los 64 Conjuros, las 8 Especies y 4 Ocupaciones DRS, además de preservar sin cambios los datos de CiFi, Nocturna y Dungeon Hack; también compara la progresión oficial y Comprueba Dardo gratis, Marca Círculo 5 y Martillo de campamento.
- El test confirma que `dist/public-drs/data/` **solo contiene los 17 JSON expresamente autorizados**; no se copian otros archivos de trabajo.
- Ejecuta el generador con destinos erróneos `assets/`, `data/` y la raíz, y exige que los rechace **sin tocar los originales**.
- `scripts/comprobar-publicacion-drs.js` ahora revisa también Magnitudes, Daños compuestos, nombres Ylat, fichas documentales, Sexo y archivos obligatorios. La raíz de desarrollo debe seguir siendo rechazada; `dist/public-drs/` debe pasar el guardia estricto.
- Ambos recorridos anteriores de navegador admiten `FORJA_PUBLIC_ROOT=dist/public-drs`, para ejecutar **la misma aplicación candidata** en Chrome, Firefox (Gecko) y WebKit, no el repositorio de trabajo.

## Automatización de la entrega revisable

Nuevo workflow `.github/workflows/paquete-publico-drs.yml`:

1. Construye el candidato y ejecuta el guardia en modo estricto.
2. Compara el contenido y las reglas efectivamente distribuidas con los datos originales.
3. Abre **el candidato DRS** en Chrome, Firefox y WebKit para probar los sistemas y las compras.
4. Si supera las comprobaciones, lo adjunta como artefacto GitHub Actions **`forja-drs-candidato-no-publicado`**, disponible durante siete días. **No configura ni modifica GitHub Pages**, no fusiona ramas ni publica contenido.

## Lo que todavía no se ha aprobado

La distribución es un **candidato** y no una autorización de lanzamiento. Queda revisar si las **fichas de los 64 Conjuros procedentes del Tomo de Magia** deben sustituirse por descripciones estrictamente literales del DRS antes de publicar, y si se desea **autorizar los nombres documentales de Ylat** dentro del núcleo inicial. No se ha optado por introducir ambos contenidos de forma implícita.

El resto de decisiones sobre Dardo, Marca, Ladrón y Almádena/Martillo siguen cerradas e implementadas. La PR continúa en borrador, sin desplegar.
