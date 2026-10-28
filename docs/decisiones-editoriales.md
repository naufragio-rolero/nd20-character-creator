# Decisiones editoriales del generador · Nd20 CiFi

## DEC-2026-10-28-01 · Capital inicial de CiFi

**Estado: APROBADA por el autor el 28 de octubre de 2026.**

- **Regla adoptada:** riqueza inicial = **4d10 × 100 Créditos** (400–4000 cr).
- **Justificación:** el DRS de Fantasía establece 4d10 × 10 monedas de oro y el
  DRS CiFi dice que 1 Crédito equivale a 1 moneda de plata; 1 mo = 10 mp.
- **Aplicación:** la Forja tira 4d10, calcula el presupuesto en Créditos,
  permite obtener equipo documentado mediante compras sin superar el presupuesto
  y refleja el saldo restante en la ficha.
- **Naturaleza:** decisión nueva del autor; **no aparece todavía redactada
  como regla de riqueza inicial** en `NaufragioD20CiFi.docx`.
- **Pendiente editorial:** actualizar la sección **Equipo → Dinero y riqueza**
  del DRS CiFi publicado e incrementar su versión, manteniendo coherencia con
  su ejemplo de creación y sin modificar la fuente documental original
  hasta preparar una revisión expresa.

### Reglas conexas que no se alteran

- El **Armamento filosofal** del Eudemonista se obtiene gratuitamente.
- El **Ordenador neuronal** del Tecnópata es equipo inicial documentado.
- Las compras automáticas son **propuestas** del generador, no equipamiento
  obligatorio ni regalos adicionales de la Ocupación.
- No se atribuye a los 4d10 × 100 cr la condición de regla original del manual
  CiFi v1.0.3.

### Decisiones pendientes

1. ¿La compra inicial será solo automática, personalizada o híbrida?
2. ¿Qué equipo debe venir garantizado, si lo hay, para todas las Ocupaciones?
3. ¿Cómo clasificar de forma exhaustiva las armas de fuego sencillas y militares
   del Forajido? El DRS no las etiqueta individualmente en la lista actual.
4. ¿Qué hacer con las listas heredadas de equipo de CiFi que usan nombres no
   coincidentes con las tablas oficiales (p. ej. «Pistola de plasma»)?
5. ¿Cómo completar las elecciones de Compromiso del Adalid, Diletante y
   Gladiador, y el resto de progresiones especiales de Fantasía?
6. ¿Qué capital inicial y paquetes específicos tendrá Nocturna?


## DEC-2026-10-28-02 · Riqueza adicional por Nivel

**Aprobada como opción de la Forja.** El capital inicial permanece inalterado:
Fantasía 4d10 × 10 mo; CiFi 4d10 × 100 cr.

Si se activa la opción «Riqueza adicional», se tira **4d10 por cada
Nivel posterior al 1** y se suma el resultado en **monedas de oro para
Fantasía** o **Créditos para CiFi**. No se aplica a Nocturna ni Dungeon
Hack. Es una regla editorial opcional, **no** una regla del DRS publicado.
El equipo se compra aleatoriamente dentro del presupuesto resultante.

## DEC-2026-10-28-03 · Otras decisiones del autor

- **Equipo: aleatorio**, tanto en modo Rápido como Personalizado; la
  configuración Personalizada afecta a Talentos y Poderes, no a compras.
- **Denominaciones de armas:** usar únicamente nombres que aparezcan en el
  manual de cada ambientación; reemplazar las listas heredadas de CiFi.
- **Talentos:** completar las elecciones de Gladiador, Adalid y Diletante
  conforme a las reglas y restricciones del manual de Ocupaciones.
- **Equipo básico gratuito:** **NO**. Solo hay material comprado y objetos
  explícitamente concedidos por Especie o Talento. Los paquetes del DRS
  se compran, nunca se regalan.
- **Nocturna:** **NO** habilitar compras, paquetes ni riqueza de equipo
  por analogía con Fantasía o CiFi.


### Estado de implementación de las elecciones (Forja)

- **Gladiador:** estilos Cestus, Dimacaero, Murmillo, Retiario, Secutor
  y Veles, seleccionados a Niveles 1, 12 y 24 sin repeticiones.
  Categorías de Técnicas del manual: Disciplina, Fuerza bruta y Trucos sucios.
- **Adalid:** compromiso entre Guardián leal, Juramento sagrado y
  Endecha de los condenados. Las Técnicas se restringen por rama.
  Se reconstruyó la tabla Nivel 1–30 y la lista de Conjuros del manual.
  **Pendiente:** conciliar por Escuela y Círculo todos los Conjuros
  del Adalid con el catálogo, que contiene discrepancias de nombres y
  Círculos. No otorgar conjuros fuera de una lista verificada.
- **Diletante:** Talentos procedentes de otra Ocupación a Niveles 1,
  6 y 12, y elección de listas de Competencias a 1 y 9; quedan
  indicadas las opciones individuales de armas y tipos de armadura
  que requieren confirmación, así como la aplicación del Nivel 1/5
  si el Talento concede Poderes especiales.


## DEC-2026-10-28-04 · Categorías de Técnicas y fichas emergentes

- Cuando una Ocupación tenga una tabla de Técnicas pero el apartado
  Poderes no indique categorías, podrá aprender **todas las categorías
  compatibles del sistema**, respetando las exclusividades y requisitos.
- La frase «sin categoría en el JSON» NO significa «sin restricción en el
  manual». Se han recuperado las categorías expresas:
  **Dinamitero** (Fuerza bruta y Trucos sucios);
  **Vikingo** (Fuerza bruta y Preternatural);
  **Verdugo** (Disciplina y Fuerza bruta);
  **Arlequín** (Trucos sucios).
  **Gladiador** (Disciplina, Fuerza bruta y Trucos sucios).
  **Marginado** no indica categorías, por lo que aplica la nueva decisión.
  El **Diletante** depende de las elecciones de Competencias y Poderes:
  no recibe por defecto todas las Técnicas.
- Habilitar fichas emergentes al hover, foco de teclado y pulsación para
  Talentos, Poderes y Objetos. Mostrar solo datos documentados del catálogo
  y descripciones verificadas; marcar las descripciones que falten.


## DEC-2026-10-28-05 · Sexo del personaje y coherencia narrativa

Se incorpora selector editable **Aleatorio / Femenino / Masculino**, persistido
en la configuración local, aplicado a personajes de Fantasía, CiFi, Nocturna
y Dungeon Hack. La ficha y su exportación incluyen el sexo resultante.

La casilla **«Respetar el trasfondo femenino de ciertas Ocupaciones»**
está activada inicialmente y es desactivable. El documento
\`NaufragioD20 — Ocupaciones\` describe en femenino a **Doncella de la
Espada**, **Valquiria** e **Invocadora**. Sus bloques de Competencias y
Poderes no declaran una prohibición mecánica de sexo: por tanto, se aplica
solo una restricción narrativa configurable en el generador.

La Especie **Gerudo**, según \`NaufragioD20 — Especies\`, es casi
exclusivamente femenina, pero admite excepcionales varones. El modo
Aleatorio escogerá femenina; una elección explícita masculina se respeta
y se marca como excepcional.

Los nombres se filtran desde repertorios existentes siempre que haya
clasificación editorial; los nombres proporcionados manualmente nunca
se corrigen. Cuando faltan nombres de mujer para «Enano montañés» se
usan unas pocas **propuestas editoriales**, expresamente etiquetadas
y distintas del canon. Si falta un nombre apropiado, se deja «Sin nombre»
y se pide rellenar el campo: no se atribuye identidad inventada al manual.

Las listas de Dungeon Hack están estructuradas con nombres femeninos
y masculinos por bloques; el selector mantiene esa organización.
