# Forja — Corrección de UX: primer uso y botón flotante

**Fecha:** 01/11/2026 · **Origen:** comentarios de una usuaria que recibió la herramienta. **PR:** [#14](https://github.com/naufragio-rolero/nd20-character-creator/pull/14) (borrador independiente, sobre `main`). **Estado de publicación:** no fusionado ni desplegado.

## 1. Problemas reportados

La usuaria señaló **dos dificultades reales**: el botón fijo de generación tapaba el pie de página, y el funcionamiento básico no se explicaba suficientemente. No se dispone de grabación de sesión, captura ni dispositivo exacto; por tanto, se presenta el caso como retroalimentación cualitativa y **no** se afirma haber reproducido las condiciones exactas de su equipo.

### Causa técnica comprobada

- `assets/styles.css`: `.generar-flotante` utiliza `position:fixed` y `bottom` permanente, y se extiende casi al ancho de la pantalla móvil.
- `assets/app.js`: `refrescarGenerarFlotante()` antes solo comprobaba si estaba seleccionado el panel de Personajes y si el formulario estaba disponible. **No comprobaba la posición del pie ni si el botón principal ya era visible.**
- `index.html`: la pantalla ofrece numerosos controles —Nivel, Ocupación, Especie, Sexo, Nombres, modo de creación— y una leyenda narrativa en la zona vacía, pero **no explica que los valores iniciales son suficientes** ni dónde verá el resultado. **Hallazgo adicional en móvil:** el panel está oculto por defecto bajo el botón genérico «Menú», por lo que colocar la ayuda solo dentro del panel no resolvería la primera visita.

## 2. Modificaciones de experiencia de uso

1. **Ayuda visible al principio del panel de Personajes.** El bloque «Crea tu primer personaje» explica que se puede dejar Nivel 1 y los demás valores iniciales, pulsar «Generar personaje» y consultar la ficha en Resultados. Distingue el modo Personalizado y sus elecciones de Talentos/Poderes.
2. **Primera pantalla móvil realmente orientadora.** Las capturas originales mostraban que «Empezar» estaba por debajo de la primera pantalla, mientras el flotante «Generar personaje» se imponía. Se ha trasladado **«Empezar» a una tarjeta previa a Resultados**: el usuario puede verlo y pulsarlo sin scroll a 390 × 844. En escritorio, esa tarjeta permanece oculta porque el panel de generación ya está abierto y contiene su propia explicación. El estado vacío de Resultados indica dónde aparecerá el personaje sin duplicar el botón.
3. **Botón flotante contextual.** Se recalcula con scroll, cambio de tamaño y apertura/cierre de Menú. Se oculta **antes del pie**, cuando el botón principal está visible, **en la primera visita móvil antes de pulsar «Empezar»**, y **mientras la explicación inicial del formulario siga visible**. Así se evita un segundo solapamiento identificado al inspeccionar el formulario móvil abierto. Vuelve a aparecer al avanzar por la configuración y sigue invocando `requestSubmit`, sin alterar la generación.
4. **Texto coherente.** «Generar personaje» en singular para una ficha y «Generar personajes» para varias, tanto en el botón principal como en el flotante.
5. **Resultado visible tras generar en móvil.** Solo con pantallas de anchura hasta 830 px, al finalizar la creación rápida se lleva la vista a Resultados y se enfoca su encabezado para navegación asistida. Se respeta `prefers-reduced-motion`. En modo Personalizado se mantiene el flujo existente hacia su propio editor de elecciones.

## 3. Cobertura de pruebas

La ampliación de `tests/browser-compatibilidad.js` para Firefox y WebKit comprueba:

- Presencia de la ayuda inicial, del mensaje de Resultados vacío y de la **tarjeta «Empezar» anterior a Resultados**, dentro de la primera pantalla de 390 × 844; en móvil comprueba que el panel oculto se abre, recibe foco en Nivel, y **no se superpone el flotante al texto de ayuda**. Capturas de **primera visita móvil** y **formulario abierto**; captura adicional de bienvenida de escritorio.
- Pie de página visible con el botón flotante **oculto** y enlace accesible; captura del **pie despejado**.
- Reaparición del botón cuando el usuario abandona el pie; ocultación cuando el botón principal es visible.
- Al pulsar el flotante, generación efectiva de una ficha adicional y desplazamiento/foco en Resultados con viewport móvil **390 × 844**.
- Ausencia de errores JavaScript, sin modificar compras, reglas ni catálogos.

**QA final verificada para el último commit funcional `4811dd7b`: 4/4 baterías verdes.** Incluyen tarjeta visible sin scroll, lectura de ayuda sin flotante, menú móvil, pie despejado, generación, foco y capturas de escritorio/móvil:

| Control | Evidencia de GitHub Actions |
|---|---|
| Generador y reglas DRS | [Validar Conjuros y Forja — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537090) |
| Compras DRS en Chrome | [E2E navegador — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537140) |
| Inicio, pie y creación en Firefox/WebKit | [Compatibilidad — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537139) |
| Lista blanca, candidato público y multibrowser | [Paquete DRS — success](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537094) |

### Auditoría visual de las capturas de CI

Se descargó el artefacto [forja-compatibilidad-firefox-webkit, run 41326537139](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537139), con seis capturas de 390 × 844, y se inspeccionaron los grupos **inicio** y **pie** de Firefox y WebKit. **Hallazgo real:** «Empezar» aparecía por debajo del primer viewport, mientras el botón flotante ocupaba la base de la pantalla. La comprobación geométrica previa aseguraba que el botón funcionase, **pero no su ubicación de entrada**.

Después se inspeccionaron nuevas capturas de la revisión [276f91e6, run 41326066602](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326066602): el botón «Empezar» se ve completo por encima de Resultados en ambos motores, el flotante no aparece durante la primera visita y el pie se puede leer y accionar. El artefacto de [run 41326288362](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326288362) añadió **cuatro imágenes** (dos de escritorio y dos del formulario móvil abierto). **Segundo hallazgo:** en el formulario móvil abierto, el flotante cubría líneas de la ayuda inicial; el último cambio funcional lo oculta mientras esa ayuda sea visible. **El último ajuste ha sido comprobado:** se descargó el artefacto [run 41326537139](https://github.com/naufragio-rolero/nd20-character-creator/actions/runs/41326537139), que incluye **diez capturas** en Firefox/WebKit (escritorio, primera visita móvil, formulario móvil abierto, compra móvil y pie despejado). La inspección ocular confirma que la explicación inicial abierta está completa sin el flotante superpuesto en ambos motores. **Cierre visual técnico de capturas: satisfactorio.** Sigue pendiente la aprobación editorial para fusión y la comprobación en la web publicada.

**Límites:** esta inspección visual se ha hecho sobre **capturas de CI**, no sobre el dispositivo real de la usuaria. No equivale a validación personal de su experiencia ni autoriza fusión o despliegue.

## 4. Separación de entregas

Este cambio parte directamente de `main` para poder corregir el problema de la **Forja publicada** sin fusionar previamente la extensa [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) de enciclopedia de Equipo. La PR #13 sigue sin fusionar, con magia y otras ambientaciones excluidas.

**No se ha realizado ningún cambio en** `assets/rules.js`, `assets/equipment.js`, catálogos, DRS, nombres de Especies, Talentos o precios. El cambio afecta exclusivamente al flujo de la interfaz y a sus pruebas.

## 5. Próximo paso

1. Confirmar 4/4 suites sobre el **último cambio funcional**; cotejar las capturas de escritorio, móvil cerrado y móvil abierto, especialmente que el flotante no tape el texto de bienvenida.
2. Aprobar la **fusión de la PR #14** y, por separado, la promoción del candidato público; comprobar pie, ayuda y resultado en la web real.
3. Después retomar la **PR #13**: integrar la misma corrección UX antes de publicarla, sin perder los avances de su rama.
4. Recoger comentarios tras la publicación: si todavía existen dudas, valorar una prueba de tarea («genera tu primera ficha sin instrucciones»), evitando un tutorial intrusivo por defecto.
