# Forja — Auditoría y mejora de consultas de Equipo y Objetos mágicos

**Fecha:** 01/11/2026 · **Rama:** `feat/forja-consulta-equipo-objetos-2026-11-01` · **Estado:** candidato de revisión, **no publicado ni fusionado**.

## 1. Auditoría del estado inicial

**Recorrido actual:** `assets/rules.js` añade al inventario las compras de `assets/equipment.js`, desglosa el contenido de paquetes y añade un `Recuerdo: …` seleccionado de `objetos_emocionales` de la Especie. `assets/app.js` lo representa como una lista y usa `assets/tooltip-ui.js` + `assets/tooltips.js` para convertir nombres indexados en botones. El popup compartido muestra descripción y algunos campos; cuando `descripcion` es vacía, recurría a «La descripción completa todavía no está incorporada al catálogo digital; consulta el manual».

**Causa concreta:** `assets/tooltips.js` indexaba del DRS únicamente `armas`, `municion`, `armaduras`, `escudos` y `paquetes`, y solo recogía Precio, tipo/categoría, DU, Munición y Contenido. **No indexaba** las cuatro `varitas_defensa`, los **41** artículos de `utiles_fantasia` (10 aventura, 6 campamento, 7 consumibles, 12 herramientas, 6 escritura), ni los **dos** focos con precio. Los datos de Daño, Penetración, Alcance, Blindaje y Durabilidad ya estaban en el JSON en numerosas fichas, pero no se mostraban en el popup. Los `detalles` de los útiles tampoco llegaban al índice. No hay que inventar descripciones: el dato se estaba desaprovechando.

**Fuentes y campos existentes:**
- `data/equipo-inicial.json`: `nombre`, `precio` o `precio_por_nivel`, `tipo`, `dano`, `penetracion`, `durabilidad`, `alcance`, `blindaje`, `municion`, `du`, `municion_du`, `proyectiles_por_turno`, `no_mover_y_disparar`, `id`, `detalle`, `escuelas`, `contenido`; **solo cuando constan**. No son campos universales ni se completan por inferencia.
- `data/fichas-documentales.json`: glosas y datos de algunos Talentos/Poderes; no es un catálogo exhaustivo de Equipo.
- `data/especies.json`: `objetos_emocionales`, que se incorporan a la ficha como `Recuerdo: …` y no son adquisiciones reglamentarias.
- `data/ocupaciones.json` y ampliaciones: listas de armas/armaduras por Ocupación; indexar el mero nombre no acredita una descripción o efecto específico.
- `docs/enciclopedia/62a`, `62b`, `63b`: **22** entradas complementarias (12 armas y 10 objetos/herramientas) auditadas, pero no autorizadas para introducirlas sin más en el DRS.
- `docs/enciclopedia/64a`, `65a`–`65e`, `66a`, `67`, `68`: **28 objetos mágicos principales y un ejemplo** del apéndice, con textos literales ya cotejados. Son **otra fuente**, no una ampliación implícita del equipo DRS. El ejemplo del Elixir tiene una corrección **expresamente aprobada** en `65e`.

**Incidencias iniciales identificadas:** las entradas DRS con datos mecánicos pero sin `descripcion` caían en el mensaje genérico; las varitas y los útiles DRS carecían de ficha indexada; los recuerdos estaban indexados solo por nombre y se intentaban resolver sin tratar el prefijo `Recuerdo:` como identidad documental. La búsqueda por nombre podía favorecer entradas reglamentarias frente a otro elemento homónimo. Este informe no presupone que todo nombre libre de inventario tenga una ficha normativa.

## 2. Separación adoptada

1. **Equipo reglamentario (`clase_equipo` arma, protección, escudo, munición, útil, foco, paquete):** solo consulta de precios y propiedades registradas; no altera compra, riqueza, Salud, efectos ni Tiradas. El subtipo se conserva en la clasificación. Identificador estable de útiles cuando existe.
2. **Objeto mágico (`clase_equipo=magico`):** registro separado con `Tipo`, `Rareza`, párrafos y descripción literal transcrita. No se asignan precio, daño, usos, competencias ni requisito por interpretación. Su indexación requiere **inyección explícita** de las extracciones 65a–65e: `app.js` **NO las solicita** y **NO están en el paquete público**. Por ahora solo se ejercita el visor y el índice con fuentes de trabajo en QA. Ninguna selección de personaje genera estos objetos.
3. **Recuerdo personal (`clase_equipo=narrativo`):** se resuelve `Recuerdo: nombre` a la Especie de origen, sin Precio, estadísticas ni detalles reglamentarios; cuando no existe descripción adicional, se omite el párrafo de relleno. La misma palabra sin prefijo sigue pudiendo designar un arma real del catálogo.

Se preserva `personaje.equipo` como array de cadenas y `data/equipo-inicial.json` sin modificación: **compatibilidad total del modelo de ficha y la exportación**. `limpiar` interpreta sufijos de cantidad `×N` y `(Nivel N)` para localizar la ficha, pero **no modifica** el texto original. Antídoto y Veneno usan exclusivamente el precio por Nivel ya documentado. **Dardo 0 mo** y el nombre visible **Martillo de campamento** se distinguen como decisiones editoriales de 31/10/2026, sin atribuirlas como valores literales originales.

## 3. Popups implementados

El Equipo utiliza la misma jerarquía que Talentos/Poderes: cabecera con tipo y clasificación, nombre, datos primarios documentados, descripción (si existe), detalles avanzados plegables y pie de **Origen · Fuente**. Se incluyen de forma condicional Precio, Daño, Penetración, Blindaje, Alcance, Durabilidad, Dado de Uso, Munición, DU de munición, proyectiles por Turno, Restricción, Escuelas y Requisito **si está etiquetado explícitamente**. El contenido de paquetes y los IDs editoriales permanecen en detalles técnicos. No se deducen Competencias de la Ocupación ni se automatizan efectos.

Si faltase el texto descriptivo, se muestra «No hay descripción adicional documentada para este artículo», **después** de los datos verificables, no un mensaje que remite a ciegas al manual. En los recuerdos no se imprime ni siquiera esta advertencia, para mantener la lectura ligera. Los popups de Poderes y Talentos siguen con su esquema original.

**Objetos mágicos:** `indexarObjetosMagicos` y `presentarEquipo` soportan los 28+1 textos del trabajo documental con su procedencia y rareza. **No están disponibles todavía en el inventario público**, porque no se ha aprobado su distribución. La prueba no equivale a publicación ni a una aprobación editorial del conjunto.

## 4. Archivos modificados

- `assets/tooltips.js`: modelo de consulta por clase, extracción completa de propiedades DRS existentes, soporte de útil/foco/varita, recuerdos con prefijo, indexación opt-in de fichas mágicas desde documentos de trabajo y presentador compacto.
- `assets/tooltip-ui.js`: presentación de Equipo en el mismo componente compacto y detalles avanzados ocultos; texto ausente tratado sin inventar contenido.
- `tests/equipo-popups.js` (**nuevo**): verificación documental de Equipo DRS, 41 útiles, dos focos, homónimos narrativos, 28 mágicos y ejemplo sin publicación.
- `tests/alcance-drs.js`: invoca la nueva batería en los controles del DRS.
- `tests/browser-compatibilidad.js`: consulta real del Recuerdo y del Martillo de campamento comprado en Firefox y WebKit.
- `docs/enciclopedia/113-forja-equipo-objetos-magicos-consulta.md` (**nuevo**): presente informe.

**Archivos intencionadamente NO modificados:** `assets/rules.js`, `assets/equipment.js`, `assets/app.js`, `data/equipo-inicial.json`, `scripts/crear-paquete-drs.js` y `scripts/comprobar-publicacion-drs.js`. No se altera ninguna lista blanca ni se añade un JSON mágico distribuible. El empaquetador sigue copiando exclusivamente sus recursos aprobados. **La raíz del repositorio no es apta para despliegue público.**

## 5. QA y pruebas

- **Ejecutado en el evaluador JavaScript de esta revisión:** carga real de `assets/tooltips.js` desde la rama con los JSON originales y comprobación de **175 registros**, sin errores: armas/protecciones/escudos/munición/varitas, 41 útiles + 2 focos, 28 fichas mágicas + ejemplo corregido y recuerdos de Especie. Se han inspeccionado expresamente Martillo de campamento (2 mo), Almádena arma (60 mo), Antídoto Nivel 3 (150 mo), Dardo (0 mo), Recuerdo y Manto de Vagryen. Esta comprobación **no reemplaza** los tests Node ni de navegador.
- **Tests Node añadidos:** `node tests/equipo-popups.js`, invocado asimismo por `node tests/alcance-drs.js`.
- **E2E ampliado:** `node tests/browser-compatibilidad.js` (Firefox/WebKit).
- **Seguridad que debe verificarse en CI:** `node scripts/crear-paquete-drs.js`, `node scripts/comprobar-publicacion-drs.js dist/public-drs`, `node tests/paquete-publico-drs.js` y E2E con `FORJA_PUBLIC_ROOT=dist/public-drs`.

**Ejecución Node/Playwright y verificación física del candidato:** pendiente del resultado de CI de la PR al redactar este informe. **No afirmar que se hayan superado antes de disponer de ejecución verificable**.

## 6. Pendientes y siguientes pasos

1. Auditar contra el DRS las descripciones que aún no están transcritas como `detalle` o `descripcion`. Añadir texto solo si se localiza en la fuente; conservar fielmente los precios y campos normativos existentes.
2. Conciliar singular/plural de componentes desglosados de paquetes («dos raciones», «antorcha», «odre») **solo con equivalencias avaladas por el DRS**. No distribuir el precio del paquete entre componentes ni inferir propiedades por nombre.
3. Revisión editorial de las **22** entradas complementarias 62a/62b antes de integrarlas en una fuente diferente de DRS.
4. Para magia, consensuar aprobación de las **28 fichas + ejemplo**, sus reglas generales (cajas solo a cajas) y las anomalías textuales documentadas; después preparar una fuente de distribución **separada** con nueva política explícita de autorización y pruebas de aislamiento. No introducir mágicos en el catálogo DRS por defecto.
5. Mantener los recuerdos como objetos propios del personaje sin reglas ni precio asignado automáticamente; no crear una interfaz de activación, combate ni simulación.
6. Validación de CI y revisión visual; hasta entonces no fusionar ni desplegar. CiFi y Nocturna siguen fuera de los selectores públicos.

**Conclusión:** la consulta de Equipo DRS queda significativamente mejorada con los datos que YA existían y sin cambiar las reglas. Los objetos mágicos están preparados para el mismo visor de forma aislada, pero **no publicados**, según la prioridad DRS.
