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

## Entorno PREVIEW aislado (16 de noviembre de 2026)
- **Limitación deliberada de LIVE:** GitHub Pages presenta un único sitio para este repositorio. Un segundo `deploy-pages` podría reemplazar el despliegue público existente. El workflow LIVE permanece en `main` y fija expresamente un SHA autorizado; **PREVIEW no invoca `deploy-pages`, no cambia Pages ni fusiona ninguna PR**.
- `.github/workflows/forja-preview.yml` se ejecuta tras cambios en `feat/forja-modular-enlaces`; genera `dist/public-drs`, pasa el guardia DRS, valida el paquete filtrado y ejecuta un E2E de enlaces portátiles con Chromium.
- Solo el contenido generado de la **lista blanca DRS** pasa a la rama huérfana `forja-preview-pr142`. No se copian `.github`, `control.html`, `scripts/`, huellas internas ni propuestas de Listas de Conjuros: `listas` y `progresiones` editoriales quedan vacías. Nunca se sirve el árbol de desarrollo.
- La URL de prueba es [La Forja PREVIEW](https://raw.githack.com/naufragio-rolero/nd20-character-creator/forja-preview-pr142/index.html). Se utiliza el proxy estático **externo** raw.githack únicamente para pruebas de bajo tráfico; no es un segundo GitHub Pages, ni un entorno de producción, ni ofrece garantías de disponibilidad. En su primera visita puede pedir confirmación de seguridad.
- El proxy no resuelve `/carpeta/` como Pages: **solo la copia PREVIEW** enlaza explícitamente `characters-nd20/index.html` y `spells/index.html`. Se añaden una marca visible de PREVIEW y metaetiquetas `noindex`; el código y las rutas de LIVE no cambian.
- El CI prueba por HTTP los recursos remotos y comprueba que `PREVIEW.txt` corresponde al commit que ha generado el paquete. Conserva también un artefacto descargable durante siete días. Si la prueba remota falla, no declarar validada la URL aunque exista la rama.
- **Privacidad:** el proxy es un dominio ajeno compartido entre distintos repositorios y esta PREVIEW es pública. Usar exclusivamente fichas y datos ficticios de prueba; no introducir secretos ni información personal real. Las bibliotecas y fichas se almacenan solo en el navegador.
- La promoción a LIVE continúa requiriendo autorización expresa, QA y el procedimiento de SHA aprobado de `.github/workflows/forja-live.yml`.

## Estado
- [x] Decisiones registradas en el repositorio.
- [x] Preparación de portada modular y rutas de herramientas.
- [x] Enlaces compartidos integrados en Personajes, Listas de Conjuros y Adversarios.
- [x] E2E de enlaces en sesiones nuevas: Chromium sobre `dist/public-drs`, Firefox y WebKit sobre la rama editorial (`tests/browser-enlaces-modulares.cjs`).
- [x] Pruebas de E2E y workflows del paquete candidato actualizados, sin desplegar.
- [ ] Revisión manual de permisos reales del portapapeles y navegadores móviles físicos. Los E2E interceptan la escritura para no depender de permisos de CI.
- [ ] Aprobación editorial, fusión coordinada de la PR #140 y posterior validación/publicación en LIVE.
