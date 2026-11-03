# Generación de nombres — dos repertorios (03/11/2026)

## Objetivo editorial

Sustituir los anteriores modos separados «Históricos de Ylat», «Variantes de Ylat» y el buscador de 262 nombres por **dos opciones de generación** en la ficha de Naufragio d20. El archivo de investigación y sus decisiones canónicas no se alteran.

### 1. Nombres genéricos

- Fuente: `data/nombres-historicos-ylat.json`, **1422 formas únicas** de las 1428 filas originales.
- Dos elecciones uniformes sin reemplazo de la misma lista: cada forma tiene peso **1** y no puede repetirse en una misma combinación.
- La primera forma se presenta como nombre y la segunda como apellido **ficticio**, sin atribuir a la fuente ninguna clasificación documental.
- Ejemplo formado por entradas del banco: `Ale-skelas Straria`.
- Se consume exactamente **dos** resultados del RNG, reproducibles con la semilla de la ficha.

### 2. Nombres de Ylat

- Archivo derivado `data/componentes-nombres-ylat.json`: **255 nombres iniciales** y **133 segundos componentes**.
- Fuentes de origen: **262 denominaciones documentadas**, **33 combinaciones anteriores de Isla Tormenta** y la auditoría de **97 segundos componentes** del censo de PNJ. Se conservan por separado los originales, identificadores y fuentes.
- Se escogen un nombre inicial y un segundo componente de bancos separados. La extracción de apellidos está ponderada por valores **relativos y estables**, definidos editorialmente en el JSON.
- `Shadelgast`, `Bronnhum`, `Boll` y `Achgate` tienen peso **1**. Otras casas singulares reciben peso **5** y el resto pesos técnicos deterministas entre 10 y 100. No son frecuencias oficiales del mundo.
- Se filtran los resultados idénticos a denominaciones documentadas y a las 33 combinaciones literales anteriores; el generador **propone nombres nuevos**, no clona identidades.
- Se excluyen títulos, ordinales, reglas de apéndices eladrines y apodos confirmados (como `Violatesoros`) del banco de segundos componentes. Se conservan en la fuente documental.
- La coincidencia con un apellido **no acredita parentesco ni pertenencia a una casa**. Un segundo componente catalogado como `I` prueba la grafía, **no su función hereditaria**. No se infiere sexo, Especie, procedencia cultural ni relación entre realidades.
- Las decisiones canónicas de ONO-01 a ONO-14 siguen vigentes; no se renombran personajes ni se reinterpretan parentescos.

### Interfaz, integración y seguridad

El selector público contiene únicamente `generico` y `ylat`. Desaparecen el filtro de Isla Tormenta y el buscador de copia. Se mantiene el campo de nombre manual para reemplazar cualquier propuesta. Dungeon Hack y las reglas de atributos, equipo, combate y PDF A5 no se modifican.

El motor `assets/names.js` usa datos explícitos y no realiza llamadas externas; `assets/rules.js` lo integra con el RNG de la ficha. La lista blanca de publicación distribuye el módulo y su catálogo, mientras las fuentes previas siguen en GitHub para trazabilidad y auditoría.

**Control:** `node tests/nombres-generador.js`, `node tests/smoke.js`, `node scripts/crear-paquete-drs.js`, `node tests/paquete-publico-drs.js` y las pruebas de navegadores con `FORJA_PUBLIC_ROOT`.
