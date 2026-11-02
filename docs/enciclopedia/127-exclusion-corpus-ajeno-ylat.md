# Rectificación editorial — Exclusión del corpus de Niguace de Ylat

**Fecha:** 02/11/2026  
**Estado:** Decisión expresa del autor; sustituye la autorización anterior sobre el tesauro de nombres.

## Corrección de universo

**Niguace no forma parte de Ylat.** La incorporación de dos documentos con nombres de Niguace a la colección documental usada como fuente para Ylat fue un error de clasificación de materiales, no una incorporación canónica. Su presencia en una carpeta denominada `/Ylat` no los transforma en material de Ylat.

## Modificación del catálogo

- Se han eliminado del archivo `data/tesauro-ylat.json` los **32 nombres documentados** y las **116 variantes combinadas** etiquetadas como Niguace.
- Quedan **52 registros** del ámbito Isla Tormenta: **19 nombres documentados** para referencia editorial y **33 variantes combinadas** para generación pública.
- Las 1428 filas y 1422 formas distintas del banco independiente `data/nombres-historicos-ylat.json` permanecen intactas: no contienen referencias textuales a Niguace ni nombres completos coincidentes con los 148 registros excluidos. **Eso no supone atribuir de forma nueva ninguna procedencia a los nombres históricos.**
- Se retira Niguace del selector HTML y del filtro de ámbito del generador. No se alteran Especies, Ocupaciones, reglas DRS ni contenidos ajenos al tesauro.
- Las pruebas de generación y la guardia de publicación rechazan la reintroducción del corpus excluido.

## Trazabilidad

Los informes 102, 103 y 104 registraban la decisión anterior. **Se mantienen como histórico del proceso editorial**, pero sus referencias a la autorización de 149 combinaciones y 51 nombres documentados ya no describen el catálogo válido. Se han señalado con una advertencia de revocación al comienzo.

Los documentos originales del otro proyecto no se modifican ni se trasladan al lore de Ylat. La exclusión afecta a los datos y a la interfaz de la Forja.
