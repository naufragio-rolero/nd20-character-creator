# Forja 1.0 — Herencia dual del DRS: implementación cerrada a nivel de generación

**Fecha:** 31/10/2026. **Fuente:** `NaufragioD20DRS.docx`, Especies: Humano común, Semielfo, Semiorco, Elfo agreste y Orco común.  
**Rama:** `feat/forja-conjuros-fichas-2026-10-30` · **PR #4:** borrador, sin fusionar ni desplegar.

## 1. Reglamento verificado

- **Semielfo:** *Herencia dual* obliga a escoger **Buen desarrollo** (humano) **o Linaje feérico** (elfo).
- **Semiorco:** *Herencia dual* obliga a escoger **Buen desarrollo** (humano) **o Ira interna** (orco).
- **Buen desarrollo:** mejora en **1 punto un Atributo durante la Creación de PJ**. El usuario elige cuál de los seis Atributos mejora en modo Personalizado. En modo Rápido se elige de forma aleatoria y reproducible.
- **Linaje feérico:** inmunidad al estado Parálisis y Ventaja en Tiradas de Intuición para resistir *Dormir* (efecto descriptivo para la ficha; no presupone un motor de combate completo).
- **Ira interna:** gastar **1 Punto de Esfuerzo** al caer a Salud 0 o menos para ajustar Salud a 1 y seguir luchando (efecto descriptivo; su activación en una partida no se ejecuta todavía).

## 2. Implementación

### Datos canónicos
En `data/especies.json`:
- `Semielfo.herencia_dual = ["Buen desarrollo","Linaje feérico"]`.
- `Semiorco.herencia_dual = ["Buen desarrollo","Ira interna"]`.

Es una **opción excluyente** declarada como dato, que comparten el generador y el editor. Se mantiene *Herencia dual (SE/SO)* en el listado de Talentos del perfil para mostrar su procedencia.

### Generación y progreso
En `assets/rules.js`:
- Se valida la opción según la Especie seleccionada y se rechazan las no autorizadas.
- En **Rápido**, se elige una alternativa sin intervención de la persona. Si se obtiene *Buen desarrollo*, el Atributo se determina antes de simular progresión desde Nivel 2 hasta el Nivel solicitado.
- En **Personalizado**, una generación **provisional** puede dejar la elección pendiente; el valor definitivo se calcula antes de todas las subidas de Nivel, no con una suma añadida al final.
- Se documenta en notas la alternativa y la bonificación, y se incluye el Talento realmente adquirido en `capacidades`. Nunca se conceden las dos ramas a la vez.
- La operación de creación mantiene la posibilidad de seleccionar explícitamente `herenciaDual` y `atributoBuenDesarrollo`. Si se solicitan combinaciones inválidas se rechazan.

### Editor Personalizado
En `assets/powers.js` se incorpora un paso **Herencia dual · Nivel 1**, con la alternativa racial directa o seis opciones de *Buen desarrollo*, una por Atributo (siete elecciones válidas en total).

En `assets/app.js` el editor conserva una semilla interna de creación. Al confirmar la elección, **reconstruye el personaje con esa misma semilla** y la alternativa definitiva. Los VA se recalculan antes de aplicar las mejoras de Nivel; después se conceden las restantes elecciones de Conjuros/Técnicas mediante el mismo plan. Se verifica que la identidad (Especie, Ocupación y sexo) no cambie. Se impide aplicar una elección de Herencia dual a una ficha provisional que no haya sido reconstruida.

**Nota sobre reproducibilidad:** la semilla determina el resultado final para la opción elegida. Como la mejora de VA puede cambiar el éxito de futuras tiradas de progresión, algunos resultados derivados pueden variar entre alternativas; son **dos trayectorias válidas de progresión**, no un +1 cosmético posterior. La UI reutiliza la misma semilla base para conservar el mismo punto de partida.

## 3. Verificación automatizada

`tests/alcance-drs.js`, ejecutado desde `tests/smoke.js`, ahora cubre:
- Identidad exacta de dos catálogos de alternativas.
- Plan Personalizado con siete opciones válidas por Especie, y ausencia de paso interactivo adicional en Rápido.
- Las seis opciones de Atributo de *Buen desarrollo* en Nivel 1, con comparación de VA frente a la ficha provisional.
- Exclusividad de alternativas, reproducibilidad, valores VA/DA y recreación completa a Niveles **1, 5, 12 y 30** cruzando las cuatro Ocupaciones DRS.
- Rechazo de Talentos, especies y Atributos no autorizados.
- Protección contra aplicar el resultado sin reconstruir atributos iniciales.
- Comprobaciones estáticas de cableado entre editor y motor.

El CI verde certifica estas pruebas, **no sustituye una prueba de navegador real**, especialmente para accesibilidad y ergonomía de las siete variantes.

## 4. Estado y decisión

**No se necesita decisión editorial adicional**: ambas alternativas y el efecto de Buen desarrollo están establecidos literalmente en el DRS. **Herencia dual queda resuelta para la generación de fichas**; sus efectos narrativos y de combate no se presentan como ejecutables hasta existir el motor de partida correspondiente.

El siguiente tramo de Forja 1.0 es **auditar los demás Talentos de las ocho Especies**: registrar efectos implementables, verificar límites de equipo y Movimiento e identificar cuáles requieren interpretación del Cronista, con pruebas concretas por Talento. No ampliar suplementos todavía.

**Aviso de publicación:** PR #4 sigue en borrador, sin fusionar ni desplegar. Los archivos originales del DRS no se han modificado.
