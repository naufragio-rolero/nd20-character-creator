# Forja de personajes · El Naufragio

Generador estático para **Naufragio d20 (Fantasía y CiFi)** y **Dungeon Hack**, diseñado para publicarse en GitHub Pages sin servidor, base de datos, Python ni compilación.

## Funciones

- **Tres modos:** Nd20 Fantasía, Nd20 CiFi y Dungeon Hack.
- Personajes de Nivel 1–30 para Nd20; Nivel 1–36 para Dungeon Hack.
- Especies, Ocupaciones / clases y atributos aleatorios o seleccionables.
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
- **data/dungeon-hack.json:** exportación de clases, especies, profesiones de seguidores, equipo, nombres y procedencias del [generador original de Dungeon Hack](https://github.com/naufragio-rolero/dungeon-hack-creator).
- **tests/smoke.js:** comprobaciones de funcionamiento del motor.

## Límites y decisiones de diseño

- **Conjuros, Técnicas y otros Poderes:** se muestran las referencias almacenadas, pero sus tablas de progreso y elecciones no están implementadas. No se inventan Poderes.
- **Nd20 CiFi:** la riqueza inicial en créditos queda pendiente de una regla confirmada; se señala en la ficha.
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
