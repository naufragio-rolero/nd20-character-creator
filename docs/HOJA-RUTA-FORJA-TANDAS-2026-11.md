# Hoja de ruta — mejoras de La Forja (noviembre de 2026)

**Estado:** Tanda 1 implementada y verificada en `main` mediante [PR #78](https://github.com/naufragio-rolero/nd20-character-creator/pull/78) (cinco suites CI en verde); **NO publicada en LIVE**. Tanda 2 implementada e integrada en `main` mediante [PR #79](https://github.com/naufragio-rolero/nd20-character-creator/pull/79), con cinco suites de CI superadas y **sin publicar en LIVE**. La Tanda 3 de Atributos se descarta sin cambios, por decisión editorial; prioridad siguiente: elegibilidad de Técnicas y equipo.  
**Ámbito público:** Naufragio d20 Fantasía DRS v1.1.12 y Dungeon Hack. CiFi, Nocturna y los suplementos no publicados siguen fuera de LIVE.  
**Fuente reglamentaria:** `NaufragioD20DRS` / [DRS 1.1.12](https://docs.google.com/document/d/1W69x5V_982IGg2AL0TltZ200aSt2khXu_VCa7gMI3zY/edit). Las decisiones de UX no son reglas.

## Tanda 1 — legibilidad y limpieza, **completada en desarrollo (no LIVE)**

1. **Iconos del pie de ficha.** Reemplazar las cinco etiquetas visibles «Equipo», «Talentos y Poderes», «PDF», «Semilla» y «Copiar» por botones SVG monocromáticos y homogéneos (celda de al menos 44 × 44 px). Mantener `aria-label`, `title`, foco y accesibilidad táctil; respetar botones condicionales por sistema y ficha. Origen: Tabler Icons v3.50.0, licencia MIT; conservar la licencia y usar archivos locales en el paquete depurado.
2. **Equipo inicial equipado.** En Naufragio d20 Fantasía DRS, el arma y la armadura que se **hayan comprado realmente** durante la creación se marcan como equipadas, usando `arma_equipada` y `protecciones_equipadas.armadura` ya existentes. Nunca inventar un arma/armadura gratuita ni equipar una pieza no disponible; un escudo sigue siendo una selección aparte. Recalcular Daño/Blindaje mediante los lectores existentes; respetar intercambio de equipo y edición manual posterior. En Dungeon Hack no se aplica la compra inicial de Fantasía.
3. **Eliminar «Mazmorra rápida».** Retirar botón, generación, representación y tests de esta herramienta legacy. No eliminar «Generar seguidor» de Dungeon Hack ni «Matriz de Atributos».
4. **Tutorial cerrable en móvil.** Unificar el cierre y la preferencia persistente `forja-tutorial-oculto` de `#tutorial-inicial` y `#inicio-movil`. No reaparecer tras generar o limpiar la mesa, tampoco en recargas. Mantener acceso a «Empezar», configuración y generación.
5. **Nombres en «Creación preparada».** Incluir «Nombre» con `Nombre personalizado: …` si se ha escrito uno; en caso contrario, indicar «Nombres genéricos», «Nombres de Ylat» o «Lista de Dungeon Hack» según el sistema y su generador real. Actualizar al cambiar el sistema, el tipo de nombres o el texto.

**Criterios para cerrar Tanda 1:** pruebas Node de equipo/reglas/iconos, navegación Chrome/Firefox/WebKit (incluido móvil y temas), recursos SVG 1:1 y licencia, y empaquetado `dist/public-drs` con auditoría sin DLC. El commit puede integrarse en desarrollo; **no cambiar el SHA aprobado de `.github/workflows/forja-live.yml` ni desplegar LIVE** sin un pedido posterior.

## Tanda 2 — reglas y utilidades de personaje, **completada en desarrollo (no LIVE)**

6. **Generar seguidores de Naufragio d20 DRS.** Reutilizar componentes de ficha y organización de herramientas, pero introducir generador reglamentario independiente de `seguidorDH`. El DRS especifica doce profesiones con precio/día, Moral, disponibilidad para aventuras y dados de Salud propios: **d4**, **d6** o **d8** según la tabla, **no d6 para todos**. Sus únicos Atributos son **Ataque y Defensa**: Ataque (ataques y lanzamientos; Fuerza/Agilidad/Mente) y Defensa (esquivas, salvaciones; Resistencia/Intuición/Presencia). Sin Esfuerzo ni seis Atributos ni progresión por Niveles de Dungeon Hack trasplantada. No atribuir capacidades, equipo, costes o bonificaciones ausentes en el DRS.
7. **Modificar los Conjuros preparados.** Un editor distinto de «Talentos y Poderes»: mostrar las plazas y Círculos documentados, permitir preparaciones repetidas cuando la progresión lo admita y limitar al grimorio conocido del Mago; conservar la distinción entre conocer/aprender y preparar. DRS: el Clérigo elige tras un Intervalo matinal; el Mago prepara tras dos Intervalos de estudio. Mostrar estas condiciones sin automatizar tiempo o combate; comprobar que cambiar un conocido no deje preparados ilegales. Añadir pruebas de regeneración y de conservación de compras y elecciones posteriores.

**Criterios:** pruebas de regla y de UI separadas por sistema, coste/moral/dado según el DRS, validación de Círculos y listas, PDF/exportación sin datos inventados, QA del paquete DRS.

## Tanda 3 — personalización de Atributos, **descartada (sin cambios)**

**Decisión editorial — 4 de noviembre de 2026:** no implementar redistribución, intercambio retroactivo ni editor libre de Atributos. La complejidad y los efectos sobre requisitos y progresión superan el beneficio previsto. Los puntos siguientes se mantienen únicamente como registro de propuestas **descartadas**, no como tareas pendientes.

8. **Intercambio reglamentario.** El DRS permite **intercambiar la DA y el VA de dos Atributos durante la creación**, no transferir puntos libremente. Implementar intercambio de pares completos respetando `VA + DA = 20`, requisitos de Especie y efectos de Atributo favorito; no recalcular retroactivamente progresión de Niveles como si fuera una regla nueva.
9. **Ajuste manual de puntos (opcional; no DRS).** La propuesta de transferir un punto (por ejemplo VA 7 → 8 restando uno a otro) **no consta en el DRS**. Requiere aprobación editorial expresa como modificación manual fuera de reglas, etiquetado permanente y validaciones de límites/coherencia. Definir antes de implementar si se permite a Niveles altos, si se recalculan otros efectos y qué sucede con requisitos de Especie.
10. **Integridad de la reproducción.** La semilla y el JSON guardan el personaje generado **antes** de intervenciones manuales. Nunca afirmar que el modo reproducible reconstruye intercambios, reasignaciones o adquisiciones posteriores; exportación y PDF deben reflejar el estado editado de la ficha, distinguiendo su origen del ajuste.

**Criterios:** aprobaciones reglamentarias documentadas, operaciones reversibles, no pérdida de tiradas/semillas ni datos derivados; E2E y control de manualizaciones.

## Nueva prioridad — elegibilidad de Técnicas y compras de armamento

Sustituye la prioridad de la Tanda 3. Es una mejora independiente y estrictamente limitada al DRS, descrita en [Elegibilidad de Técnicas y armamento](ELEGIBILIDAD-TECNICAS-Y-ARMAMENTO.md).

1. Técnicas: una Ocupación expresamente exigida en el Requisito limita **quién aprende** la Técnica (por ejemplo, Ataque sorpresa exige Ladrón). Los requisitos de VA, Nivel y equipo documentados siguen rigiendo **su uso**, sin introducir prohibiciones de aprendizaje nuevas.
2. Armamento: en compras e intercambios, ofrecer exclusivamente artículos para los que existe Competencia de Ocupación y Nivel, respetando excepciones de Varitas de defensa y Baja estatura. Mantener el catálogo consultable completo y el DRS sin alterar: utilizar un objeto sin Competencia sigue causando Desventaja.
3. Rechazar también en el motor cualquier compra o intercambio no competente, sin depender del selector. Verificar DRS, DLC excluidos, moneda, equipo inicial, pruebas de UI y seguridad del paquete público.

**Entrega:** desarrollo mediante PR con CI completo; sin publicación LIVE, y sin modificar el workflow protegido.

## Límites comunes

- Reutilizar arquitectura y estados actuales; no introducir simulación de combate.
- Respetar el catálogo económico y las condiciones de Competencia, las exclusiones DRS y la reproducibilidad del estado original.
- Nunca publicar el directorio raíz ni activar LIVE por fusionar una tanda: solo promoción posterior de un **SHA aprobado** a `dist/public-drs`, con auditoría y verificación posterior de GitHub Pages.
