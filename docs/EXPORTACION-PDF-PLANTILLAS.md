# Forja · Exportación PDF — fichas A5

**Estado:** auditoría técnica de la plantilla A5 realizada el 02/11/2026. **No hay exportación PDF implementada ni autorización cerrada para redistribuir el archivo.** La implementación queda pendiente de resolver las limitaciones de composición y la distribución del activo. Véase [auditoría detallada](EXPORTACION-PDF-A5-AUDITORIA.md).

## Decisión de diseño

1. **Usar como primera página el PDF original** `Nd20-FPJ-A5.pdf` (una página, A5 vertical, 419,76 × 595,44 puntos; sin AcroForm). Mantener intactos sus gráficos, texto, fuentes y medidas, sin recrearlo desde cero.
2. **Proyectar sobre el original mediante coordenadas** los datos del objeto de personaje. No leer la tarjeta HTML ni reinterpretar reglas del sistema.
3. **Diseñar una continuación independiente en A5**, de la misma familia editorial, con campos identificados para todo lo que no cabe: identidad extensa, Talentos, Competencias, Poderes conocidos, Conjuros preparados, Equipo, economía y observaciones. Incorporar únicamente las páginas necesarias, según contenido real, sin truncamientos.
4. **Separar estrictamente** `Naufragio d20 · Fantasía` de Dungeon Hack, CiFi y Nocturna. No publicar un PDF de Dungeon Hack con campos Nd20.
5. **No incorporar la plantilla al paquete DRS ni al workflow LIVE** hasta disponer de decisión editorial sobre su distribución, permisos de gráficos y fuentes, y revisión de legibilidad. El PDF de Drive es de lectura pública, pero eso por sí solo no documenta una licencia de redistribución aplicable al fichero autónomo.

## Activos entregados / pendientes

- **Recibido y auditado:** `Nd20-FPJ-A5.pdf` de Google Drive, creado en Affinity Publisher, 7.973.386 bytes, PDF 1.7, una sola página, sin campos editables ni cifrado.
- **Pendiente de distribución autorizada:** ejemplar PDF original que se empaquetará como plantilla local, tras verificación de derechos.
- **Pendiente de diseño:** patrón de páginas de continuación A5 que respete el estilo original.
- **Pendiente de desarrollo:** motor PDF local y pruebas; no añadir bibliotecas sin requerimiento probado ni abrir Dungeon Hack.

## Mapeo del modelo actual

| Información | Objeto de personaje / fuente existente | Destino |
|---|---|---|
| Identidad | `nombre`, `descripcion` (Ocupación · Especie), `nivel` | Cabecera; nombres largos también en continuación sin pérdida |
| Sexo y concepto | `sexo`, `concepto` | Continuación A5: no hay casillas en la original |
| EXP | No consta en el objeto actual | Dejar casilla original vacía |
| Atributos | `atributos[]`: `nombre`, `valor`, `dificultad`, `favorito` | Seis grupos originales; asignación exacta de figuras a VA, DA y favorito requiere validación del diseño |
| Salud, Esfuerzo, Movimiento | `recursos[]` | Áreas originales; si el valor literal no cabe, registrar el dato íntegro en continuación |
| Potencia u otros Recursos | `recursos[]` | Continuación; no existe casilla propia |
| Competencias | `competencias[]` | Hasta tres líneas según ajuste verificado, resto en continuación |
| Talentos | `capacidades[]` | Hasta cinco líneas según ajuste verificado, resto en continuación |
| Conjuros/Poderes conocidos | `poderes[]` | Hasta seis celdas según ajuste verificado, resto en continuación |
| Conjuros preparados | `conjuros_preparados[]`, si existe | Continuación, listado separado |
| Equipo | `equipo[]` con sus textos y cantidades originales | Inventario (14 espacios), con continuación cuando proceda |
| Protección equipada | `protecciones_equipadas`, validado con `NaufragioEquipment.blindajeFicha(personaje, catalogo)` | Zona Equipo solo después de validar iconos; detalle inequívoco en continuación |
| Blindaje natural | `blindaje_natural` solo si tiene `blindaje_natural_fuente` | Continuación con procedencia explícita |
| Riqueza | `riqueza`, `saldo_mo`, `capital_inicial_mo` cuando existan | Oro/saldo verificable; conservar riqueza literal y presupuesto en continuación; cobre, bronce, plata, gemas vacíos si no documentados |
| Observaciones | `notas[]` y procedencias `procedenciaOcupacion`, `procedenciaEspecie` | Continuación, sin suprimir información reglamentaria |

**Importante:** `NaufragioEquipment.blindajeFicha` distingue armadura realmente equipada, escudo equipado y Protección natural documentada; el escudo no suma Blindaje permanente. No inferir equipamiento ni otros valores.

## Criterios de aceptación

- Un PDF A5 con la página original íntegra y una o más continuaciones A5 **solo cuando haya datos que la primera página no contiene o no admite**.
- Registros fieles al modelo: ni valores inventados, ni conversiones monetarias implícitas, ni información omitida o silenciosamente truncada.
- Las listas conservan orden, nombres, multiplicadores y cantidades de la fuente original. Las cadenas de 90 caracteres, tildes y ñ son legibles sin sustituir símbolos por interrogaciones.
- Priorizar un umbral tipográfico mínimo legible y el salto a continuación antes que disminuir indiscriminadamente cuerpos de letra.
- `Exportar PDF` se integra junto a `Exportar .txt` sin alterar su función; exportación únicamente para personajes Nd20 Fantasía.
- Generación **en el navegador** desde `entrada.valor` / objeto del personaje, sin servicios de impresión en servidor ni envío de nombres o datos del personaje a terceros.
- Comprobar una batería de personajes iniciales, intermedios y de Nivel alto, con/sin armadura, con/sin magia, cantidad de inventario y textos extremos; renderizar y revisar cada página.
- Validación Node y E2E Chromium, Firefox, WebKit, preservando las defensas de la lista blanca y SHA del paquete DRS.
- **No fusionar ni desplegar** sin autorización del activo, tests funcionales, revisión visual y nueva fijación explícita de los SHA en LIVE.

## Plan de implementación

1. Confirmar nombres y semántica de las figuras de VA/DA y los cuatro iconos de «Equipo» con el diseño original.
2. Validar permiso documental de redistribución de la ficha autónoma y licencias de las fuentes/ornamentos. Registrar titular, alcance, atribución y licencia del PDF.
3. Cerrar diseño de continuación A5 y umbrales legibles; probar con ejemplares extremos.
4. Implementar `pdf-lib` cargado de modo local, sin automatización de combate. Verificar soporte de caracteres: las fuentes PDF estándar admiten parte del texto español, pero para Unicode arbitrario puede hacer falta una fuente con licencia y `@pdf-lib/fontkit`. No eliminar caracteres sin avisar.
5. Registrar plantilla, biblioteca y recursos autorizados en el script de empaquetado y en las listas SHA del LIVE; añadir controles negativos para evitar archivos CiFi/Nocturna/Dungeon Hack.
6. Conservar `Exportar .txt`; incorporar botón PDF con opción por tarjeta o selección explícita de fichas, sin intentar exportar mapas, matrices ni PNJ no admitidos.
7. Probar al menos Niveles 1, 12 y 30; comprobar integridad de datos y diseños renderizados en A5, y los tres motores de navegador.
8. Abrir PR funcional independiente; fusionar únicamente con checks y revisión editorial aprobados. Verificar LIVE después del pin SHA.

**Este documento sustituye el antiguo requisito A4**. La ficha Dungeon Hack tendrá una plantilla específica más adelante; no preparar un A4 de Dungeon Hack dentro de este trabajo.
