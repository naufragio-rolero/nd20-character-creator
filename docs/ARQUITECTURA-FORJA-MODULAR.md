# La Forja — Portal modular y enlaces portátiles
Acuerdos de producto (16 de noviembre de 2026). Esta rama es candidata; no implica publicación LIVE.

## Identidad y navegación
- `index.html` es la portada, inicialmente con **Personajes** (icono de persona) y **Conjuros** (icono de libro), reutilizando los cinco temas, tipografía Exo, estilos e iconos de La Forja.
- `characters-nd20/` aloja el creador existente (incluyendo Seguidores y Adversarios). No reescribir motores ni cambiar reglas.
- `spells/` aloja el editor de Conjuros y Listas. `techs/` (Técnicas) y `songs/` (Canciones) son nombres reservados para herramientas futuras, no implementaciones ficticias.
- Dungeon Hack y Naufragio d20 son sistemas distintos. Épica, Futura, Nocturna y demás suplementos son fuentes con identidad, reglas, estado editorial y versión propias.
- Sin mezclas de catálogos, publicación implícita de suplementos ni modificación del DRS. El Centinela continúa como propuesta no aprobada.

## Compartir sin servidor
- Un ID aleatorio sin base de datos NO reconstruye una ficha arbitraria. Para compartir sin backend el enlace debe portar datos: `#share=<datos base64url>`.
- Para Personajes se puede reutilizar el registro original `{version:1,semilla,config}` de La Forja y generar de manera determinista. No conserva compras, modificaciones, Talentos elegidos ni Conjuros preparados posteriores; en lotes se reproduce el lote.
- Para Listas, compartir IDs de Conjuros y biblioteca personal validada, sin duplicar fichas normativas. Exportación JSON para bibliotecas demasiado grandes.
- Para Adversarios manuales y fichas editadas se comparte una instantánea de la ficha completa, validada al abrir como **borrador no guardado**; el tamaño puede impedir generar URL si incluye ilustraciones grandes. El usuario decide si guardarla en su biblioteca.
- Los enlaces son instantáneas; no sincronización ni edición colaborativa. No incluir secretos en URLs. El fragmento no se envía normalmente al servidor, pero puede filtrarse mediante scripts, copias o capturas.
- Cada enlace debe indicar módulo, sistema/suplemento, formato, versión y payload, con validación de tamaño, referencias y procedencia. Los suplementos no publicados deben seguir excluidos.

## Publicación, seguridad y regresión
- GitHub Pages admite `/directorio/` con `index.html`; no garantiza rutas profundas arbitrarias `/directorio/UUID`. Usar `#share=` en primera fase.
- La publicación LIVE sigue fijada a un SHA y al paquete DRS filtrado por `scripts/crear-paquete-drs.js`. NO cambiar flujo LIVE sin pruebas y validación.
- La nueva portada exige actualizar de forma coordinada los tests y whitelist, preservando el acceso a la herramienta antigua y los catálogos autorizados.
- El almacenamiento local de Adversarios y Listas debe persistir; una URL nunca debe sobrescribirlo sin consentimiento.
- La estética de `spells` debe integrarse en tokens de La Forja, evitando un tema visual independiente.

## Estado
- [x] Decisiones registradas en el repositorio.
- [x] Preparación de portada modular y rutas de herramientas.
- [x] Enlaces compartidos integrados en Personajes, Listas de Conjuros y Adversarios; requieren QA de navegador.
- [ ] Enlaces y permisos comprobados en todos los navegadores.
- [ ] Pruebas de E2E y flujo de publicación actualizadas.
- [ ] Validación y publicación en LIVE.
