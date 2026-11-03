# La Forja · Revisión de Talentos y Poderes tras crear un personaje

**Fecha:** 03/11/2026. **Ámbito:** Fantasía DRS; excluidos suplementos CiFi y Nocturna. No implica despliegue LIVE.

## Objetivo y alcance

Un personaje generado (tanto en modo Rápido como Personalizado) conserva las decisiones documentadas de su creación. El botón **«Talentos y Poderes»** de la ficha abre un diálogo con dos secciones: **Talentos** y **Conjuros y Poderes conocidos**. Cada selector representa una de las plazas originales de elección de su progresión, incluidas las de los diferentes Niveles hasta el Nivel generado.

La selección no añade plazas, Niveles ni Poderes nuevos. El personaje solo puede reemplazar una opción por otra del mismo grupo y del catálogo permitido al crear la ficha. Los Talentos fijos, las herencias con modificaciones de Atributos y los Conjuros automáticos del Clérigo no se ofrecen para sustituirlos. El diálogo muestra las mismas fichas emergentes documentales («Ver ficha») que el editor de creación.

## Conjuros conocidos frente a preparados

**Aprender** un Conjuro y **prepararlo** son operaciones distintas. El grimorio de un Mago no ofrece Conjuros ya aprendidos en etapas anteriores: el selector oculta su ID y el motor rechaza la duplicación, incluso si se intenta introducir directamente. Las preparaciones siguen pudiendo repetirse cuando la regla del DRS lo permite; esta mejora **no incorpora un editor de preparación**.

Si al reemplazar un Conjuro conocido dejase de ser válido alguno que estaba preparado, el motor retira **solo la preparación inválida** (deja la plaza sin preparar), añade una observación informativa y confirma cuántas preparaciones se han retirado. No elige automáticamente un sustituto.

## Datos y garantías

`assets/powers.js` guarda un registro de las plazas de origen, las decisiones y una instantánea previa a aplicarlas. Al revisar, reconstruye las capacidades derivadas de ambas versiones mediante el mismo motor `resolver`/`aplicar`, y preserva modificaciones ajenas a esas decisiones: compras de equipo y útiles, saldo, notas posteriores y equipo equipado. Recalcula, cuando procede, los Recursos determinados por los Talentos (ejemplo documentado: Potencia de Guerrero con Brío musculoso).

La ficha nunca incorpora Conjuros de suplementos ajenos a la lista DRS ni inventa Talentos o progresiones. Una ficha sin registro fiable de sus elecciones **no puede recibir plazas arbitrarias**; en ese caso no aparece el botón.

## Pruebas

- `tests/elecciones-poscreacion.js`: grimorio sin duplicados, reglas de preparación intactas, revisión conservadora de Conjuros y Talentos, Potencia, compras y saldos.
- `tests/browser-compras.js`: apertura, edición y confirmación posterior de un Talento de Guerrero, interfaz y foco.
- CI: reglas/Conjuros, Chrome, Firefox/WebKit, PDF A5 y paquete público DRS.

La PR de esta mejora se integra solo tras pruebas completas. LIVE permanece anclado a su propio SHA hasta autorización de promoción.
