# Fase 1 — Inventario documental

**Corte:** 2026-10-28. **Líneas:** Fantasía (DRS y ampliaciones), CiFi, Nocturna. **Solo documentación; sin cambios mecánicos.**

## 1. Procedencia

**JSON de Forja:** `data/especies.json`, `data/ocupaciones.json`, `data/especies_cifi.json`, `data/ocupaciones_cifi.json`, `data/catalogo-ampliado.json`, `data/catalogo-poderes.json`, `data/equipo-inicial.json`, `data/fichas-documentales.json` y `data/progresiones-oficiales.json`.

**Manuales y documentos:** `NaufragioD20DRS.docx`; `NaufragioD20CiFi.docx`; [Especies de Ylat/Hyrule](https://docs.google.com/document/d/1XmjW6AUwt8Yyl3ZpXp7u73DE5j7jxDxf2rcMVRc8V3s/edit); [Ocupaciones](https://docs.google.com/document/d/1Zx60pJI_ETuyXvoiATUQk__E2-WUAjAnMbVBzsocIrc/edit); [Nocturna](https://docs.google.com/document/d/15_9raDHK4Cr_LC4YPAmTTYm3K27V06-2-gF8FrmHm28/edit); [Lista Poderes Nd20](https://docs.google.com/spreadsheets/d/1OvQyxuk7TVDNrGRPJg8YYwXWfc8dmPEDyz9lEDbUtc/edit); `NaufragioD20 — Tomo de Magia [Orden alfabético].docx`; `NaufragioD20 — Objetos mágicos.docx`.

Se consultaron los documentos vivos y los DOCX disponibles. **Revisión distinta detectada:** «Elfo nerai» aparece en el Google Doc vivo y en Forja, pero no en el DOCX de Especies adjunto. El inventario trata la versión viva como fuente consultada, sin editar versiones anteriores.

## 2. Talentos de Especies y Ocupaciones

| Línea | Especies | Relaciones de Especie en JSON | Solo en fuente | Ocupaciones | Relaciones de Ocupación consolidadas |
|---|---:|---:|---:|---:|---:|
| DRS | 8 | 15 | 0 | 4 | 9 |
| Ampliadas | 22 | 37 | 21 | 33 | 82 |
| CiFi | 6 | 10 | 0 | 6 | 15 |
| Nocturna | 8 | 32 | 0 | 8 | 57 |

**Totales:** **44 Especies**, **51 Ocupaciones**, **115 relaciones de Especie–Talento**, y **163 relaciones Ocupación–Talento** consolidadas desde **234 referencias** de los campos `talentos`, `talentos_referencia` y `talentos_elegir`. Relaciones no equivalen a Talentos distintos; los nombres se repiten entre Especies, Ocupaciones y sistemas.

De los 115 vínculos de Especie, **94** están representados en el JSON y **21 solo en la fuente**: **7 Talentos fijos** y **14 Talentos opcionales de Hyrule**. Estas diferencias NO autorizan conceder nuevas capacidades al personaje automáticamente.

### 2.1 Siete Talentos fijos ausentes del JSON de Especies

| Especie | Talento literal presente en el documento vivo |
|---|---|
| Elfo celestial | Fuente de maná |
| Enano selvático | Hambre caníbal |
| Gnomo sylestri | Fuente de maná |
| Humano malasthino | Adaptación |
| Mediano jóbito | Baja estatura |
| Deku | Pequeño |
| Kokiri | Pequeño |

### 2.2 Catorce Talentos opcionales de Hyrule sin registro equivalente

- **Deku**: Bombardero deku; Tirano del bosque; Semilladora.
- **Goron**: Aplomo goron; Reposo del héroe; Perdición del dodongo.
- **Zora**: Aletas del ciclón; Morador de las profundidades.
- **Kokiri**: Sabiduría de las hadas; Tácticas de las hadas.
- **Orni**: Afinidad aérea; Surcavientos.
- **Gerudo**: Castigo del Reino Sombrío; Entereza del desierto.

Son apartados explícitos «Talentos opcionales...» en el documento vivo. **Pendiente** documentar el procedimiento, requisitos y Niveles de elección antes de incorporarlos a Forja.

### 2.3 Otras observaciones

- El DRS titula **«Herencia dual»** en Semielfo y Semiorco; Forja distingue `Herencia dual (SE)` y `Herencia dual (SO)`. Son identificadores contextuales: no homogeneizar sus reglas por coincidencia nominal.
- Nocturna cuenta con **8 Especies**: un Talento fijo y tres elegibles por Especie, **32 vínculos**. Los nombres se encuentran en la sección Especies del Google Doc, pero sus efectos carecen de ficha descriptiva equivalente en `fichas-documentales.json`.
- El archivo de fichas contiene **32 entradas nominales** (28 Nd20 y 4 CiFi); mezcla Talentos, Técnicas, estilos, Conjuros y otros conceptos. La mera coincidencia nominal no acredita efectos completos.
- `data/progresiones-oficiales.json` mantiene **31 progresiones ampliadas de Fantasía marcadas verificadas**, pero **Truhán y Astrólogo** figuran pendientes. Ese estado se refiere a las progresiones, no a toda la mecánica de sus Talentos.

## 3. Poderes y Conjuros (inventario de registros)

| Categoría | Registros en `catalogo-poderes.json` | Estado descriptivo |
|---|---:|---|
| Conjuros | **434** (433 nombres) | Sin efectos íntegros |
| Técnicas | 24 | No hay descripciones en este catálogo |
| Poderes psiónicos | 20 | Atributo/ímpetu, sin efecto íntegro |
| Argucias | 6 | Sin efecto íntegro |
| Scripts | 10 | Con descripciones breves |
| Órdenes de batalla | 8 | Repertorio especial |
| Flechería arcana | 14 | Repertorio especial |
| Privilegios | 6 | Repertorio especial |
| Canciones | 24 | Repertorio especial |
| Eidolas | 32 | Repertorio especial |
| Recetas | 34 | Repertorio especial |

Adicionalmente existen una lista de referencia de 11 Conjuros de nictomancia y opciones de vínculos: Brujo (27), Chamán (4), Hechicero (8) y Oráculo (8); no contarlas como conjuros nuevos.

**CONJ-01:** «Ira celestial» aparece dos veces en Forja (Círculos 3 y 5); la ficha de Círculo 3 no tiene Origen. El Tomo alfabético presenta dos encabezados «Arma elemental». Ambos casos quedan **pendientes de conciliación editorial**, sin borrar ni fusionar registros. El archivo de 434 entradas no equivale a 434 Conjuros únicos.

## 4. Equipo

| Categoría | Fantasía | CiFi |
|---|---:|---:|
| Armas | 27 | 12 |
| Munición | 4 | 3 |
| Armaduras/protecciones | 9 | 7 |
| Escudos | 3 | — |
| Paquetes | 5 | — |
| Dispositivos DDP | — | 3 |
| Útiles | — | 8 |
| **Total en `equipo-inicial.json`** | **48** | **33** |

Hay 5 opciones identificadas de Armamento filosofal del Eudemonista (no sumarlas sin comprobar solapamientos). **Este es equipo inicial del generador, no la totalidad del equipo publicado**. Equipo general de Nocturna y objetos mágicos no tienen repertorio estructurado equivalente en este JSON. Las fórmulas de riqueza adoptadas editorialmente por Forja se documentan aparte en `docs/decisiones-editoriales.md`.

## 5. Objetos mágicos

El DOCX `NaufragioD20 — Objetos mágicos.docx` tiene **28 encabezados de objetos en el bloque principal** y **1 ejemplo en el apéndice** («Elixir de esfuerzo»); todavía no existe un catálogo JSON de objetos mágicos para la Enciclopedia.

**Objetos principales:** «Manto de Vagryen»; «Peto refulgente de maná»; «Sello de guarda arcana»; «Susurro de marfil gramarán»; «Arnés de caída semi-segura»; «Caña argenta de atracción»; «Escarpines levitantes»; «Espadón avaricioso»; «Trabuco sanguíneo»; «Mono de protección termal»; «Portaviandas soberbio»; «Remedio infalible de Morrotinto»; «Ajorca de empatía disminuida»; «Broquel de flotabilidad»; «Brújula de Siempreterna»; «Cañón de mano malasthino»; «Capa de Iring Thrië»; «Capisayo popular de Ugnak»; «Celada del rompecráneos»; «Higa de la serenidad»; «Hilo de brillo dorado»; «Mantón del clérigo decepcionado»; «Uña de Mogg-Shattoth»; «Virotes ávidos de carne»; «Arqueta de roble efímero»; «Baúl seguro de Feanaro»; «Gema cristalina onírica»; «Joyero de nogal grabado».

Los apartados de rareza, tipologías, lanzas y garras no se contaron como fichas de objetos. Pendiente comprobar objetos mencionados solo en prosa y sus propiedades completas.

## 6. Trabajo siguiente

1. **Extraer Talentos de Especies**, con texto literal, activación, costes y requisitos; resolver los 7 fijos y los 14 opcionales sin asignarlos arbitrariamente.
2. Extraer **Talentos de Ocupaciones** conservando la relación entre Talento inicial, referencia y elección.
3. Extraer Técnicas/Poderes y sus repertorios, dejando separadas las elecciones de los efectos.
4. Conciliar las duplicidades de Conjuros contra sus fuentes; después extraer 433 nombres con efectos documentados.
5. Ampliar el inventario de equipo desde los manuales y documentar Nocturna.
6. Extraer las fichas de los 28 objetos mágicos principales y del ejemplo del apéndice.

**Cierre de Fase 1:** inventarios nominales creados; **extracción literal, validación, implementación y pruebas siguen pendientes**. No se corrige el JSON actual ni se presenta la existencia de un nombre como verificación de su mecánica.
