# Forja de personajes · El Naufragio

Generador estático para **Naufragio d20 (Fantasía, CiFi y Nocturna)** y **Dungeon Hack**, diseñado para publicarse en GitHub Pages sin servidor, base de datos, Python ni compilación.

## Modos de creación de Talentos y Poderes

- **Rápido:** el generador completa de forma determinista las elecciones permitidas a partir de una semilla, atendiendo al Nivel y a la progresión oficial.
- **Personalizado:** primero genera los Atributos y el perfil, luego permite elegir Talentos, Técnicas, Argucias, Scripts, Conjuros conocidos y Conjuros preparados. Valida las listas de cada clase, los Círculos desbloqueados, la cantidad de elecciones y la repetición indebida. Requiere **una ficha por operación**.
- **Psion:** sigue asignando los Poderes mediante la tabla d20 (no son de libre elección, tampoco en Personalizado).
- **Mago:** separa el aprendizaje de Conjuros por Nivel (2 en Nivel 1 y 1 adicional por Nivel) de su preparación diaria; permite dejar Espacios sin preparar.
- **Clérigo:** conoce automáticamente su lista del DRS cuando desbloquea cada Círculo; elige los Conjuros preparados según los Espacios disponibles.
- **Guerrero:** elige Brío musculoso o Sacrificio de escudo, sin conceder ambos a la vez.
- **Nocturna:** elige 1 Talento de Especie y otro de Ocupación en Nivel 1, y un segundo Talento de Ocupación en Nivel 9.
- **CiFi:** se aplican las tablas de Técnicas, Argucias, Scripts, Poderes Psiónicos e Ímpetu documentadas, además de respetar el nivel requerido para desbloquear nuevas elecciones.

### Catálogos y progresiones

- `data/catalogo-poderes.json`: **434 entradas singulares de Conjuros** extraídas del Tomo de Magia consultado, 24 Técnicas, 20 Poderes Psiónicos, 6 Argucias y 10 Scripts. Incluye Círculos, Escuelas y categorías relevantes. El número 434 representa las entradas extraídas de esta versión del documento; debe cotejarse con el inventario editorial maestro antes de considerarse el total canónico cerrado.
- `data/progresiones-oficiales.json`: tablas por Nivel **1–30** del Clérigo, Guerrero, Mago y Ladrón; Diplomático, Eudemonista, Forajido, Psion, Soldado y Tecnópata. Todas están referenciadas a los documentos DRS/CiFi consultados.
- **Alcance actual:** los Conjuros efectivamente ofrecidos como opciones automáticas al Mago y Clérigo son los de sus **listas expresas del DRS**. El Tomo completo queda estructurado, pero otros Conjuros deben habilitarse por Escuelas, Ocupaciones y progresiones específicas antes de automatizar su asignación.
- Las otras **33 Ocupaciones ampliadas** de Fantasía aún no tienen sus progresiones especiales codificadas. Sus Talentos siguen como referencias, sin concederse automáticamente.
- **Nocturna:** sus Talentos seleccionables están operativos; la adquisición de Conjuros, Vampirismo, poderes de otras Especies y progresiones de sus Ocupaciones aún requiere un motor especializado. Sus recursos y Debilidades ya se muestran.
- Si un Nivel permite más Técnicas que las opciones compatibles documentadas en el catálogo, el generador **no inventa ni duplica Técnicas** y advierte del déficit.
- Los requisitos de Atributo y equipo de muchas Técnicas se refieren a **usarlas**, no a aprenderlas; se muestran al seleccionarlas y deben comprobarse durante la partida.

## Funciones

- **Cuatro modos:** Nd20 Fantasía, Nd20 CiFi, Nd20 Nocturna y Dungeon Hack.
- Personajes de Nivel 1–30 para Nd20; Nivel 1–36 para Dungeon Hack.
- Especies, Ocupaciones / clases y atributos aleatorios o seleccionables.
- **Fantasía:** 30 especies y 37 ocupaciones (DRS y ampliaciones documentadas de Ylat y Zelda).
- **Nocturna:** 8 especies y 8 ocupaciones, con Debilidades, Esencia, Talentos fijos y una elección inicial de Talento adicional.
- **CiFi:** 6 especies y 6 ocupaciones; las especies incorporan sus Dados de Esencia y los requisitos de varios Atributos.
- Campo de nombre manual para especies sin repertorio de nombres publicado.
- En **Dungeon Hack** cada Atributo muestra solo la **DD**. En Nd20 se muestran VA y DA.
- Progreso automático de Atributos y Salud, con dados y reglas propias de cada juego.
- **Dungeon Hack:** elegir las procedencias del contenido, activar/desactivar especies, generar seguidores (máximo Nivel 30).
- Herramientas de mesa: matrices de Atributos y mazmorras de casillas.
- Varias tarjetas simultáneas, copia al portapapeles y exportación general a texto.
- Semilla opcional reproducible.

## Publicar en GitHub Pages

1. Integra la rama de la web en la rama principal (**main**).
2. Abre **Settings → Pages** en GitHub.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona **main** y la carpeta **/(root)** y guarda.

Dirección prevista tras habilitar Pages:
https://naufragio-rolero.github.io/nd20-character-creator/

El punto de entrada es **index.html** en la raíz del repositorio. Los recursos se solicitan con rutas relativas, por lo que también funciona bajo el subdirectorio de Pages.

### Probar en local

No abras index.html directamente desde file://, porque muchos navegadores bloquean la lectura de JSON en ese modo. Levanta un servidor estático:

    python -m http.server 8000

Y visita http://localhost:8000/. No necesitas instalar las dependencias de Flask para la web nueva.

### Comprobar el generador

Con Node.js instalado, ejecuta:

    node tests/smoke.js

No hay dependencias de npm ni flujos de GitHub Actions asociados a estas pruebas.

## Archivos

- **assets/rules.js:** motor de generación independiente del navegador, con semilla determinista.
- **assets/app.js:** interfaz, selección de datos y exportación.
- **assets/styles.css:** presentación adaptable a móvil.
- **data/especies.json**, **data/ocupaciones.json:** contenido original de Nd20 Fantasía.
- **data/especies_cifi.json**, **data/ocupaciones_cifi.json:** contenido original de Nd20 CiFi.
- **data/catalogo-ampliado.json:** perfiles mecánicos contrastados contra los documentos de la Biblioteca «Naufragio d20» (Ocupaciones, Especies, CiFi y Nocturna); origen indicado por entrada.
- **data/dungeon-hack.json:** exportación de clases, especies, profesiones de seguidores, equipo, nombres y procedencias del [generador original de Dungeon Hack](https://github.com/naufragio-rolero/dungeon-hack-creator).
- **tests/smoke.js:** comprobaciones de funcionamiento del motor.

## Límites y decisiones de diseño

- **Conjuros, Técnicas y otros Poderes:** se muestran las referencias almacenadas, pero sus tablas de progreso y elecciones no están implementadas. No se inventan Poderes.
- **Nd20 CiFi:** la riqueza inicial en créditos queda pendiente de una regla confirmada; se señala en la ficha.
- **Nd20 Nocturna:** el manual consultado está en versión de trabajo. Se generan sus ocho especies y ocho ocupaciones efectivamente desarrolladas, sin inventar las dos restantes mencionadas en el texto introductorio. Solo se aplica automáticamente la elección de Talento inicial; otras elecciones por Nivel y Poderes deben consultarse en el documento.
- **Ampliación Fantasía:** los Talentos enumerados se ofrecen como referencias documentales, no todos como concesiones automáticas de Nivel 1. Sus requisitos, tiempos y tablas de progreso deben comprobarse en el manual. No se inventan nombres culturales, equipamiento inicial ni Poderes para las entradas nuevas.
- **Nd20:** el DRS define Atributos VA 4–18; Atributo favorito con +1; mejora de dos Atributos por Nivel; Esfuerzo +1 en los Niveles 6/12/18/24/30 (máximo 9); Salud inicial máxima y aumento por tiradas hasta Nivel 11, luego tabla fija. La especie «Buen desarrollo» se aplica cuando corresponde.
- **Dungeon Hack:** se conservan sus datos originales. La versión nueva separa la lógica del HTML, genera 2d6 reales para las comprobaciones de Moral y usa probabilidades normales para los elementos de la mazmorra, por lo que pueden aparecer pequeñas diferencias frente a la implementación antigua.
- **Mazmorra rápida:** distribuye casillas por tipo y no comprueba conectividad de salas. Es una ayuda improvisada, no un plano listo para explorar.
- La selección aleatoria de especies de Dungeon Hack respeta requisitos de Atributo cuando puede; si los valores generados no cumplen ninguna, el personaje se genera sin especie explícita.
- Los datos de equipo de Nd20 proceden de los archivos JSON originales y se muestran como selección ilustrativa, no como compra verificada con el presupuesto.
- No se almacenan fichas ni semillas en servidores: los resultados viven en la pestaña abierta. Usa «Exportar .txt» para conservarlos.

## Código heredado

**app.py**, **create_char.py**, **templates/**, **static/** y **requirements.txt** se conservan temporalmente para no destruir la aplicación Flask anterior. **GitHub Pages no los ejecuta:** el nuevo index.html es completamente independiente. Una limpieza futura puede trasladarlos a una rama de archivo.

## Autoría y licencias

El repositorio original incorpora una licencia **GPL-3.0** para el código. El documento de referencia de **Naufragio d20** se publica bajo **CC BY-SA 4.0**; sus términos y atribuciones se mantienen al reutilizar el contenido. Los datos importados de Dungeon Hack proceden del generador mencionado arriba y conservan la autoría y derechos que les correspondan. La presencia de una licencia del software no supone una relicencia automática de los textos de los juegos.
