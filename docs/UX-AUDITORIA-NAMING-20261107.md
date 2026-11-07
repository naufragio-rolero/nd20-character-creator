# La Forja · Auditoría UX y naming · 2026-11-07

## Punto de partida y límites

- `main`: `cd6fb35cb1830fe175a499607e4546b800d04b5f`. PR abiertas al comenzar: ninguna.
- LIVE: workflow protegido `.github/workflows/forja-live.yml` con snapshot DRS fijado en `a172ccb01d68b4ba0052e00431958eb8c10ccb3a`. La rama de mejoras no se publica automáticamente.
- Se conservan **Personajes y seguidores** y **Adversarios**, los encabezados normalizados, los IDs internos históricos `herramientas`/`criaturas`, los JSON, la generación, la economía, los datos, las fichas y los exportadores.

## Auditoría inicial: problemas objetivos

| Problema | Evidencia | Solución |
| --- | --- | --- |
| CSS redundante de pestañas | Declaración de dos columnas sobrescrita al final por tres. **No había fallo activo en el diseño final.** | Una sola regla de tres columnas. |
| Resúmenes desiguales | «Creación preparada», «Seguidores preparados», «Bestiario preparado» y reglas tipográficas distintas para h3/h4. | Nombres funcionales y regla común. |
| CTA desigual | La generación de Seguidores carecía de estilo principal; crear adversarios usaba icono de configuración. | Destacar Generar y Crear con el estilo existente, retirar icono equívoco. |
| Contradicción de texto | El editor sugería «Guardar criatura» pero el botón anunciaba «Guardar adversario». | Mismo nombre para ambos. |
| Mesa frente a colección | El estado vacío de Adversarios decía «Tu mesa»; el JSON de colección exporta solo fichas propias mientras que el PDF incorpora las presentes. | Vacío referido a Colección; diferenciar descarga JSON/PDF. |
| Repeticiones | Dos párrafos introductorios; avisos reiterados en creación, importación y previsualización. | Reducir microcopy manteniendo advertencias sobre persistencia. |
| Espacio desaprovechado | Mínimos de 390px para mesa vacía y 380px para colección, relleno de 4rem. | Compresión razonable y reglas móviles. |
| Controles pequeños | Cierres de 38px e iconos de 40–42px frente a las acciones de 44px de Personajes. | Unificar objetivos táctiles de 44px. |
| Controles de búsqueda | El tema no aplicaba de forma global el mismo fondo a inputs de búsqueda. | Incorporar search a las reglas de inputs por tema. |

## Preferencias de diseño, no defectos objetivos

Conservar Exo, identidad cromática y temas actuales, cromos 16:9, iconos aprobados y semántica de los botones. El menor espacio vacío y el menor texto explicativo son decisiones editoriales, sujetas a contraste en pantalla pequeña.

## Tabla de naming: Antes / Después / Motivo

| Antes | Después | Motivo |
| --- | --- | --- |
| Creación preparada | Opciones actuales | Es una configuración resumida. |
| Seguidores preparados | Opciones actuales | Igual función que Personajes. |
| Bestiario preparado | Colección actual | Resume el número y ubicación. |
| Añadir adversario | Crear adversario | Abre un editor, no añade de inmediato. |
| Pegar ficha de adversario / Pegar una ficha | Importar desde texto | Misma tarea, misma etiqueta. |
| Vista previa del desglose | Revisar desglose | Acción de revisión. |
| Exportar colección JSON | Exportar fichas propias (JSON) | Distinguir qué se exporta. |
| Exportar colección PDF | Exportar colección (PDF) | Diferenciar la exportación completa. |
| Guardar criatura | Guardar adversario | Coincide con la etiqueta accesible real. |
| Tu mesa está vacía (en Adversarios) | Crea un adversario o elige un perfil oficial para empezar la colección | Mesa solo para resultados generados. |
| Nuevo borrador preparado | Sin mensaje persistente | El diálogo abierto ya lo comunica. |

**Léxico:** Generar = obtener fichas aleatorias; Crear = abrir nueva ficha editable; Configurar = preparar opciones; Editar = modificar ficha existente; Mesa = resultados de personajes y seguidores; Colección = adversarios; Ficha = registro individual; Guardar = persistencia; Exportar = descarga. No renombrar identificadores internos.

## Verificación y publicación

- `tests/encabezados-mesas.js`: regresión de cabeceras, nomenclatura y jerarquías.
- `tests/browser-compatibilidad.js`: Firefox/WebKit en escritorio y móvil; comprobación de pestañas y acciones.
- También deben ejecutarse `tests/smoke.js`, `tests/browser-compras.js`, `tests/browser-criaturas.cjs`, guardas DRS, paquete público y tests PDF ya existentes, más comprobación visual de temas y focos.
- La publicación exige PR fusionada, revisión exacta SHA, ejecución verde del workflow protegido, despliegue DRS (no árbol raíz) y comprobación remota. Las pruebas pendientes o fallidas impiden declarar LIVE actualizado.

No se atribuyen resultados de QA hasta consultar las ejecuciones efectivas.