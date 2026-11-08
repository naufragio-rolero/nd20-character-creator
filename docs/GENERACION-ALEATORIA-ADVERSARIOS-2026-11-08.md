# La Forja — generación aleatoria de adversarios (08/11/2026)

## Objetivo autorizado

Combinar **exclusivamente** Acciones y Talentos ya existentes en el catálogo disponible
de la Forja (106 adversarios DRS, plantillas propias y adversarios personales), siguiendo
el modelo de adversarios vigente. Una mezcla extravagante es deliberadamente válida.
No se crean nuevos ataques, efectos, daños ni mecánicas.

## Contrato de entrada

- **Semilla reproducible**: el mismo texto, opciones y catálogo ordenado devuelven
  el mismo borrador. Sin texto, el navegador genera una semilla aleatoria segura,
  la muestra en el formulario y la consigna en las notas del borrador.
- **Nivel**: intervalo inclusivo 0–100 del modelo vigente. Selección uniforme.
- **Categorías posibles**: 1–16 de las oficiales. Se sortea una de las categorías
  seleccionadas que disponga de componentes suficientes para las cantidades elegidas.
- **Cantidad de Acciones y Talentos**: entre 0 y 8 de cada tipo, sin repetir un
  **ID de catálogo** dentro de la misma ficha. Al menos un componente. El límite
  de ocho es **usabilidad de La Forja, no una regla del DRS**.
- **Modo restringido**: solo componentes cuyo adversario de origen pertenezca a la
  categoría sorteada. Las plantillas anónimas sin categoría asociada no son elegibles.
- **Modo libre**: el tipo de adversario no restringe la procedencia: cualquier
  componente disponible puede ser seleccionado. Ambos modos parten **siempre**
  de los componentes que ya existen en el catálogo, no de texto improvisado.
- **Conector**: el usuario decide expresamente entre «o» (alternativas) o «y»
  (simultáneos) para las Acciones mezcladas; «Inicio» se reserva a la primera.
  No se deducen conectores ni daño de la ficción.

## Resultados y límites

- **Nivel**: el extraído dentro del rango.
- **Salud**: la media documentada del DRS, Nivel × 4, con ajuste 0,
  activando el modo automático **solo en el borrador generado**. Una importación
  de ficha jamás activa el cálculo involuntariamente.
- **Moral**: uno de los valores entre 5 y 12 realmente registrados en fichas
  de esa categoría, si hay alguno. Autómata y Muerto viviente no reciben Moral.
  Si no hay dato elegible, queda nula. No se inventa un valor nuevo.
- **Blindaje, Movimiento y Tamaño**: nulos; sin fórmula general documentada
  para generarlos no se estiman.
- **Acciones y Talentos**: se copian sus cantidades, daños literales y numéricos,
  textos completos, identificadores, fuentes y segmentos originales. Las relaciones
  documentadas no se transforman en relaciones ficticias; una referencia literal a
  un Talento puede quedar sin éste después de mezclar y requiere revisión.
- **Nombre**: marcador de borrador con la categoría y semilla. No describe una
  especie canónica ni inventa taxonomía, subcategoría o subtipo.
- **Procedencia**: ficha nueva de usuario, no oficial; los componentes individuales
  siguen señalando sus orígenes. La configuración completa se conserva como notas.

## Seguridad de edición

El generador **no guarda** hasta que el usuario pulse «Guardar adversario» en el
Editor. El resultado se abre como una ficha nueva editable y avisa de cambios
pendientes. Si los filtros dejan insuficientes componentes, se muestra error
antes de alterar el editor o la biblioteca. Los originales DRS son inmutables;
no hay cambios en su JSON ni en su distribución.

## Regresión y publicación

- Prueba Node: semillas, Nivel y Salud, dos modos, categorías, Moral excepcional,
  igualdad de los componentes originales y rechazo de configuraciones inválidas.
- E2E en Chrome, Firefox y WebKit: diálogo, móvil, generación, valores, procedencia
  y ausencia de persistencia automática.
- Paquete DRS: el nuevo módulo JS entra explícitamente en la lista blanca y en
  el detector de integridad. No se agregan fuentes ni reglas ajenas al DRS.
- El merge de la funcionalidad **no implica** publicarla LIVE. El flujo LIVE
  sigue exigiendo verificación CI y un SHA exacto y aprobado.
