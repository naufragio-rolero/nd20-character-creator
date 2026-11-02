# Comparación documental: apellidos y linajes eladrines de Erklan

**Estado:** fuentes recuperadas, lectura íntegra y cotejo binario finalizados el 2026-11-02.  
**Objetivo:** determinar lo documentado y mantener explícitas las contradicciones; **no trasladar reglas de edición antigua a Naufragio d20**.

## Archivos originales comprobados

| Documento | Enlace original | Fecha de modificación informada por Drive | Tamaño | Codificación | SHA-256 |
| --- | --- | --- | ---: | --- | --- |
| `Linajes eladrines.txt` | [Drive](https://drive.google.com/file/d/1J1uHzpl9DqyLVrsoes73N3_u6sclPCXB/view) | 2014-07-30 | 993 bytes | Windows-1252 | `eeeeafd5c9875faa2e11b73eabe40b88d27cc7809242cd871a03b95bbced1680` |
| `Apellidos eladrines en Erklan.txt` | [Drive](https://drive.google.com/file/d/1YVanaM-4ThS94W-qY3NFShmNE6Klbmj7/view) | 2015-05-12 | 1104 bytes | Windows-1252 | `2a46888cc985285c210d13b6e6db13c76d86801ecb278daf023d802ace0b667b` |
| Wiki antigua, copia `.md` | [Drive](https://drive.google.com/file/d/1brBjcXrRFz2slCSSEuw7m78Y8pBLT5v6/view) | Copia archivada en 2026 | 1482 bytes | Texto del espejo accesible | No se ha calculado SHA-256 del binario |

**Incidencia técnica resuelta:** la lectura textual normal del conector de Google Drive falló porque trataba estos TXT como UTF-8. Los archivos se recuperaron mediante descarga de bytes y se interpretaron usando Windows-1252. Esta operación fue solo de lectura; no se modificaron fuentes.

## Lo que confirman ambos TXT

1. El sistema pertenece a **las familias del linaje de Aerandil y Anasthore**, hermanos oriundos de Erklan; el texto contrasta explícitamente su costumbre con la de **los Adorasol**. **No es una regla demostrada para todos los eladrines**.
2. La denominación familiar toma fenómenos de luz, momentos del día/noche y fenómenos atmosféricos. La nota menciona `Alba`, `Aurora`, `Ocaso` y `Atardecer`.
3. Un apéndice marca el **orden de nacimiento**. Se documentan los siguientes casos:

   | Nombre/formulación | Función en la nota | Evidencia |
   | --- | --- | --- |
   | Aerandil del Atardecer **Brillante** | Hermano primogénito | Ejemplo de personaje en **ambos** originales |
   | Anasthore del Atardecer **Luciente** | Segunda descendiente | Ejemplo de personaje en **ambos** originales |
   | del Atardecer **Resplandeciente** | Fórmula del tercer descendiente | Ejemplo hipotético sin nombre de personaje |
   | `Pepito de la Aurora Brillante` | Explicación ficticia de primogenitura | **Nombre de ejemplo, no PNJ real** |
   | `Mengana del Alba Luciente` | Explicación ficticia de segunda descendiente | **Nombre de ejemplo, no PNJ real** |

4. Según la nota, esa distinción de nacimiento conlleva obligaciones familiares y herencias. **No se describe un listado exhaustivo ni universal de apéndices para el cuarto hijo o sucesivos**.

## Diferencias textuales entre los originales

Un contraste de líneas de los originales revela:

- `Apellidos eladrines en Erklan.txt` (2015) añade una frase introductoria sobre la batería y unas líneas informales «Clink / Los deberes».
- Las últimas dos cifras de dificultad aparecen **invertidas**:

  | Dato | `Linajes eladrines.txt` (2014) | `Apellidos eladrines...` (2015) |
  | --- | ---: | ---: |
  | Reconocimiento de la convención/linaje, según la frase inmediatamente anterior | CD 25 | CD 30 |
  | Conocimiento de los deberes asociados | CD 30 | CD 25 |

- Los nombres **Brillante** y **Luciente** coinciden en ambos textos.
- No existe equivalencia binaria entre ambos ficheros; su coincidencia en la descripción onomástica sí está documentada.

Estas CD se citan **solo para mostrar la contradicción histórica**. No reutilizarlas en el sistema de Naufragio d20: este trabajo es onomástico, no una conversión de reglas.

## Contradicción con las fichas de PNJ

- La [ficha de Aerandil](https://drive.google.com/file/d/1q2AGQap3uCdFgwyS6CwGf_FiLB5Xbrur/view) le da el nombre **Aerandil del Atardecer Refulgente**.
- La [ficha de Anasthore](https://drive.google.com/file/d/1rV6rEjO_Sy2kiollOgJtvKfYbSlTRTZG/view) identifica a su hermano mayor como **Aerandil del Atardecer Refulgente**.
- Ambos TXT originales (2014 y 2015) utilizan **Aerandil del Atardecer Brillante**.
- `dnd_npcs.xlsx` conserva **Aerandil del Atardecer Refulgente** y **Anasthore del Atardecer Luciente**.
- [Casa Adorasol](https://drive.google.com/file/d/1I_g1ni_qIrJXGcEteIfs2xQchUCgKlDd/view) enumera a los dos hermanos entre sus miembros, aunque la nota antigua distingue sus apellidos de los Adorasol. El sentido de esa pertenencia sigue indeterminado.

**Decisión editorial pendiente:** forma canónica de Aerandil, *Brillante* o *Refulgente*. Recomendación operativa provisional: usar **Refulgente** para referirse al PNJ actual por la concordancia entre su ficha, la ficha de la hermana y el censo, manteniendo **Brillante** como variante documental histórica. No reescribir fuentes ni cargar una selección automática hasta aprobación.

## Implicaciones limitadas para La Forja

Un generador que represente este linaje correctamente necesitaría al menos información sobre **pertenencia al linaje, fenómeno patronímico y orden de nacimiento**; además, el conjunto de sufijos documentados es incompleto. No hay base para implementar un combinador libre con palabras sueltas, ni para extender esta regla a los Adorasol u otros eladrines.

**Estado de decisión:** sin aprobación editorial. **Estado de implementación:** sin cambios en datos ni código.
