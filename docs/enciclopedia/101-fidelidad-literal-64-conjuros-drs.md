# Forja 1.0 — Auditoría literal de los 64 Conjuros del DRS y correcciones del paquete público

**Fecha:** 31/10/2026 · **PR #4:** borrador, sin fusionar ni desplegar.  
**Fuente principal inspeccionada:** archivo de proyecto `NaufragioD20DRS.docx`, apartado **Conjuros (Círculos 1–8)**, párrafos 877–1320 y tabla oficial de «Calentar metal».  
**Fuente contrastada:** los dos JSON `data/conjuros-revisados-001-225.json` y `data/conjuros-revisados-226-434.json`, originados en el *Tomo de Magia* y presentes en el candidato de distribución del [informe 100](100-paquete-publico-drs-candidato.md).

## 1. Resultado de la comparación

Se han emparejado mediante su denominación los **64 Conjuros** del catálogo base con sus fichas individuales del documento DRS y con las fichas del Tomo revisado. La comparación abarca **Círculo, Escuela, Alcance, Duración, Lanzamiento, Requisito y todo el texto descriptivo**; se ignoran únicamente los espacios sobrantes al inicio o final de cada párrafo.

**Resultado:**
- **63 Conjuros** coinciden literalmente con el DRS cuando se normalizan espacios. Entre ellos figura **Calentar metal**, cuya tabla no aparece como párrafo en el DOCX, sino como una tabla de Word independiente.
- **1 Conjuro presenta una adición no literal:** **Forja arcana** (ID `conjuro-45`). El Tomo de Magia dice «ese objeto **mundano** obtiene» donde la ficha original del DRS dice «ese objeto obtiene». El propio DRS indica, más adelante, que el efecto **puede aplicarse sobre objetos mágicos**, por lo que se evita introducir la palabra «mundano» en la distribución básica.
- **Un duplicado en el Tomo revisado:** **Arma elemental** (`conjuro-23`) figura en las posiciones **26 y 29**, con el **mismo contenido**. Es una duplicación de una ficha de datos, no un segundo Conjuro ni una variante. Se publica **una sola ficha**.
- El Tomo revisado suministraba por ello **65 registros asociados a 64 identificadores DRS**. El paquete filtrado debe contener **exactamente 64 fichas distintas**.

## 2. Caso especial: «Calentar metal»

La tabla del DRS aparece en un bloque de tabla de Word, no entre los párrafos consecutivos del Conjuro:

| Turno | Temperatura | Daño |
|---|---|---|
| 1 | Templada | — |
| 2 | Caliente | 1d6 |
| 3–4 | Ardiente | 2d6 |
| 5 | Caliente | 1d6 |
| 6 | Templada | — |

El Tomo revisado conserva las **18 celdas** de la tabla en el orden por filas. No representan material suplementario ni se eliminan del paquete público. Las huellas literales incluyen esas celdas, para que ningún cambio futuro borre el efecto progresivo del Conjuro.

## 3. Solución técnica: fidelidad DRS demostrable sin copiar el DOCX

Se incorpora `data/huellas-conjuros-drs.json`: **64 hashes SHA-256** generados directamente a partir del bloque de párrafos del documento DRS, uno por cada ID `conjuro-0` a `conjuro-63`. El cálculo es SHA-256 del UTF-8 de `JSON.stringify(parrafos.map(p => p.trim()))`, añadiendo las 18 celdas oficiales de «Calentar metal» al final de su ficha.

**Importante:** las huellas **no sustituyen el documento original**; documentan el resultado de cotejarlo. La colección completa del *Tomo de Magia* sigue intacta en el repositorio de desarrollo y no se modifica silenciosamente.

`scripts/crear-paquete-drs.js` aplica solo al **candidato público** la restauración literal de Forja arcana: elimina la palabra «mundano» de la frase discrepante y exige que exista una única coincidencia del texto original auditado. Luego coteja la huella completa de **cada ficha DRS** contra el registro extraído del DOCX.

Si cualquier párrafo, atributo textual, tabla o Círculo cambiase respecto del DRS, **la construcción del paquete se interrumpe con un error que identifica el Conjuro afectado**. Los cambios nuevos en el Tomo no llegan silenciosamente al producto básico.

Para `conjuro-23` (**Arma elemental**), el generador detecta los registros repetidos: solo elimina una copia si nombre, Círculo y párrafos coinciden. En caso de encontrar dos variantes contradictorias, **detiene la construcción** para revisión. Suprime así el duplicado sin inventar una regla de elección.

`tests/paquete-publico-drs.js` comprueba:
- El catálogo base conserva exactamente **64 Conjuros DRS**.
- Existen **64 fichas públicas únicas**, una por cada ID, todas con **hash literal coincidente con el DOCX DRS**.
- «Forja arcana» no incluye la restricción «mundano» en el paquete, pero el original de desarrollo permanece intacto.
- «Calentar metal» conserva las **18 celdas originales**.
- La separación física de DLC y la integridad de CiFi, Nocturna y Dungeon Hack siguen verificándose como antes.

## 4. Conclusión y límites

La **revisión de fidelidad literal de los textos de los 64 Conjuros DRS queda cerrada para este DOCX**, sin cambios en la mecánica del juego. El trabajo no certifica automáticamente el contenido de futuras versiones del DRS: cualquier edición del documento fuente necesitará un nuevo cotejo y actualización expresa de huellas.

El paquete sigue siendo **candidato, no publicación aprobada**. Los 200 nombres documentales de Ylat siguen fuera por prudencia hasta que se decida su inclusión, mientras que la versión de desarrollo y los futuros suplementos permanecen intactos.

**Sin fusión ni despliegue.**
