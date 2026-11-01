# Forja — Corrección de UX: primer uso y botón flotante

**Fecha:** 01/11/2026 · **Origen:** comentarios de una usuaria que recibió la herramienta. **PR:** [#14](https://github.com/naufragio-rolero/nd20-character-creator/pull/14) (borrador independiente, sobre `main`). **Estado de publicación:** no fusionado ni desplegado.

## 1. Problemas reportados

La usuaria señaló **dos dificultades reales**: el botón fijo de generación tapaba el pie de página, y el funcionamiento básico no se explicaba suficientemente. No se dispone de grabación de sesión, captura ni dispositivo exacto; por tanto, se presenta el caso como retroalimentación cualitativa y **no** se afirma haber reproducido las condiciones exactas de su equipo.

### Causa técnica comprobada

- `assets/styles.css`: `.generar-flotante` utiliza `position:fixed` y `bottom` permanente, y se extiende casi al ancho de la pantalla móvil.
- `assets/app.js`: `refrescarGenerarFlotante()` antes solo comprobaba si estaba seleccionado el panel de Personajes y si el formulario estaba disponible. **No comprobaba la posición del pie ni si el botón principal ya era visible.**
- `index.html`: la pantalla ofrece numerosos controles —Nivel, Ocupación, Especie, Sexo, Nombres, modo de creación— y una leyenda narrativa en la zona vacía, pero **no explica que los valores iniciales son suficientes** ni dónde verá el resultado.

## 2. Modificaciones de experiencia de uso

1. **Ayuda visible al principio del panel de Personajes.** El bloque «Crea tu primer personaje» explica que se puede dejar Nivel 1 y los demás valores iniciales, pulsar «Generar personaje» y consultar la ficha en Resultados. Distingue el modo Personalizado y sus elecciones de Talentos/Poderes.
2. **Estado vacío orientador.** Se sustituye la frase ambiental por «Aquí aparecerá tu personaje» y una indicación directa para utilizar La forja. Se actualiza tanto el HTML inicial como el render dinámico.
3. **Botón flotante contextual.** Se recalcula con scroll y cambio de tamaño: aparece cuando el formulario está disponible y el botón ordinario no está en pantalla, pero desaparece **antes de que el pie entre en la zona de cobertura**. También se oculta si el botón principal está a la vista. No se duplican llamadas ni se cambia el formulario; sigue invocando `requestSubmit`.
4. **Texto coherente.** «Generar personaje» en singular para una ficha y «Generar personajes» para varias, tanto en el botón principal como en el flotante.
5. **Resultado visible tras generar en móvil.** Solo con pantallas de anchura hasta 830 px, al finalizar la creación rápida se lleva la vista a Resultados y se enfoca su encabezado para navegación asistida. Se respeta `prefers-reduced-motion`. En modo Personalizado se mantiene el flujo existente hacia su propio editor de elecciones.

## 3. Cobertura de pruebas

La ampliación de `tests/browser-compatibilidad.js` para Firefox y WebKit comprueba:

- Presencia de la ayuda inicial y del mensaje de Resultados vacío.
- Pie de página visible con el botón flotante **oculto** y enlace accesible.
- Reaparición del botón cuando el usuario abandona el pie; ocultación cuando el botón principal es visible.
- Al pulsar el flotante, generación efectiva de una ficha adicional y desplazamiento/foco en Resultados con viewport móvil **390 × 844**.
- Ausencia de errores JavaScript, sin modificar compras, reglas ni catálogos.

**QA definitiva:** registrar los enlaces de cuatro flujos de CI cuando hayan concluido para el último commit de la PR. Las pruebas verifican lógica y geometría básica, **no sustituyen la inspección visual humana** del resultado.

## 4. Separación de entregas

Este cambio parte directamente de `main` para poder corregir el problema de la **Forja publicada** sin fusionar previamente la extensa [PR #13](https://github.com/naufragio-rolero/nd20-character-creator/pull/13) de enciclopedia de Equipo. La PR #13 sigue sin fusionar, con magia y otras ambientaciones excluidas.

**No se ha realizado ningún cambio en** `assets/rules.js`, `assets/equipment.js`, catálogos, DRS, nombres de Especies, Talentos o precios. El cambio afecta exclusivamente al flujo de la interfaz y a sus pruebas.

## 5. Próximo paso

1. Cerrar los cuatro flujos de CI en la PR #14 y revisar la experiencia de primera visita en escritorio y móvil.
2. Aprobar la **fusión de la PR #14** y, por separado, la promoción del candidato público; comprobar pie, ayuda y resultado en la web real.
3. Después retomar la **PR #13**: integrar la misma corrección UX antes de publicarla, sin perder los avances de su rama.
4. Recoger comentarios tras la publicación: si todavía existen dudas, valorar una prueba de tarea («genera tu primera ficha sin instrucciones»), evitando un tutorial intrusivo por defecto.
