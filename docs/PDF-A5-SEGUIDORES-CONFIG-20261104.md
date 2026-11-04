# La Forja — Seguidores configurables y ajuste PDF A5 (04-11-2026)

## PDF A5

El encabezado de cada sección usa la misma reserva horizontal y el mismo tamaño de icono; evita desplazar Talentos y Poderes según el dibujo del SVG. Las listas compactas de Competencias, Talentos, Poderes conocidos y preparados utilizan letra regular.

Los **títulos de efectos** se conservan separados, detrás del bloque **OBSERVACIONES REGLAMENTARIAS**:

1. **EFECTOS DE TALENTOS** reúne las descripciones de Talentos documentadas en la ficha (notas de Talento de Especie/Ocupación, si siguen vigentes) y, cuando falta nota, las descripciones del índice de consulta ya existente. Cada entrada presenta el nombre en negrita seguido de la descripción regular.
2. **EFECTOS DE PODERES** mantiene una única entrada por Poder, conocido o preparado, y aplica el mismo formato de nombre/descripcion.
3. **OBSERVACIONES REGLAMENTARIAS** conserva las observaciones útiles y, cuando aparecen pares `nombre: descripción`, destaca el prefijo en negrita.

Se eliminan **solo de la exportación PDF** las notas de auditoría que comienzan por «Revisión de Conjuros conocidos:» y «Cambio de equipo inicial:». Los registros del personaje continúan intactos en el generador. No se oculta ni se deduce ninguna regla.

## Seguidores de Naufragio d20

Se conserva sin cambios la tabla de los doce oficios, su orden d12, precio diario, Moral, dado de Salud y valor original de disponibilidad para aventuras del DRS. Dungeon Hack continúa usando su motor de seguidores propio.

La pestaña **Herramientas del Cronista** muestra un resumen de las opciones vigentes. **Generar seguidor** (o **Generar seguidores** para un lote) genera directamente sin abrir el diálogo. **Configurar seguidores** abre el formulario con los valores vigentes: **Aplicar opciones** los guarda para las siguientes generaciones; **Generar seguidores** dentro del formulario aplica los cambios y genera en el acto; **Cancelar** descarta los cambios aún no aplicados. La configuración modal de seguidores permite seleccionar un oficio concreto o aleatorio; en la rejilla los doce comparten el pictograma genérico `ico-configurar.svg`. Configura rango de **Nivel 1–30**, género, repertorio de nombres genéricos de Nd20 o de Ylat, cantidad (1–12) y resolución de **Aventuras** cuando la tabla original dice «Depende».

La ficha contiene **Ataque y Defensa** (VA = 3 + d6, DA = 20 − VA) como únicos Atributos; a Niveles 4, 8, 12, etc. cada uno obtiene una oportunidad de mejora mediante tirada de d20 superior al VA y límite VA 18. La **Salud** emplea el dado de oficio con primer dado completo, tirada adicional por Nivel 2–11 y bonificación fija por Nivel desde el 12, igual que la progresión de Salud del PJ. No concede Esfuerzo, Talentos, Poderes ni Conjuros.

**Aventuras** se presenta con «Sí» o «No» debajo de **Precio recomendado**, con su mismo estilo; deja de ser un KPI. La rejilla de seguidores incorpora **Daño** y **Blindaje** únicamente cuando disponen de un arma o varita y una armadura realmente equipadas, respectivamente. El inventario por profesión registra expresamente las piezas activas; no se añade Blindaje pasivo de escudos ni se muestra «—» por equipo inexistente.

El JSON `data/sexo-personajes.json` incorpora el mapa editorial `seguidores_profesiones_drs`: las doce profesiones cuentan con sus formas masculina y femenina, sin modificar sus identificadores reglamentarios ni los costes. La ficha, el selector y el resumen de configuración utilizan la forma elegida: «Seguidora · Mensajera», «Seguidora · Mercenaria», «Seguidora · Sacerdotisa», etc. Los nombres de género invariable, como «Escriba» y «Arcanista», conservan su grafía. La selección de nombre propio permanece independiente de la flexión de la profesión.

**Aventuras** Los valores fijos del DRS permanecen fijos; los tres oficios marcados «Depende» se pueden resolver expresamente o por azar determinista. No se presenta esta resolución como valor literal del DRS.

El equipo inicial se escoge de propuestas asociadas a la profesión, validadas por nombre contra `data/equipo-inicial.json`. El generador no compra ni modifica dinero por estas propuestas, no concede Competencias ni utiliza listas de suplementos. Todos los nombres se obtienen de los catálogos existentes. La especie no interviene en la generación de seguidores.

El paquete público continúa limitado a `dist/public-drs`. Sigue excluido de seguidores el PDF A5 específico para PJ de seis Atributos.
