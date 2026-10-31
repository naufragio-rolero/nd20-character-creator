# Forja 1.2 · Plan de trabajo

**Fecha:** 31/10/2026 · **Rama:** `feat/forja-1-2-rejilla-equipo-i18n`

## Implementación de este lote
- [x] Ocultar en el selector Nd20 CiFi y Nd20 Nocturna, conservando sus documentos y datos.
- [x] Reemplazar las tarjetas gigantes por un botón compacto y un diálogo de selección con rejilla, inspirado en los selectores de personajes de Soul Calibur.
- [x] Multiselección de candidatas en la rejilla: el generador elige una Especie y una Ocupación entre las marcadas. Sin marcas, todas. No combina Especies ni Ocupaciones en una misma ficha.
- [x] Desglosar los paquetes de equipo en objetos de inventario sin duplicar su coste.
- [x] Reducir los recuerdos personales a nombres descriptivos extraídos de las listas de Especies.
- [x] Reducir rótulos y ayudas largas del formulario y README.
- [x] Preparar internacionalización mediante `assets/i18n.js` y `locales/es.json`.

## Edición de textos
- `locales/es.json`: textos de ayuda y etiquetas listos para traducirse. Punto preferente para afinar el tono.
- `index.html`: rótulos y textos iniciales que se ven sin cargar traducciones.
- `assets/app.js`: avisos, mensajes dinámicos y textos construidos durante la generación.
- `assets/rules.js`: textos que emite el motor; no cambiar las reglas al retocar su redacción.
- `data/especies.json`: listas existentes de `objetos_emocionales`.

## Auditoría editorial
El trabajo documental está registrado en `docs/enciclopedia/` y se conserva en main. El inventario documenta 115/115 relaciones Especie–Talento cotejadas, 162/162 Talentos de Ocupación transcritos y 434/434 Conjuros indexados y contrastados documentalmente. Los 64 Conjuros básicos DRS están protegidos mediante huellas literales y pruebas. **Estos datos no prueban que toda la integración mecánica esté cerrada.** Véanse asuntos ESP/OCP y las casillas pendientes en `docs/enciclopedia/PLAN-DE-TRABAJO.md`.

## Siguientes pasos
- [ ] Revisar los popups de Talentos, su procedencia y los homónimos.
- [ ] Resolver discrepancias editoriales y progresiones pendientes, sin inventar efectos.
- [ ] Internacionalizar sistemáticamente todos los mensajes dinámicos; incorporar otros idiomas con traducción revisada, sin traducir automáticamente términos reglamentarios.
- [ ] Validar y autorizar el estreno de CiFi/Nocturna antes de hacerlos visibles.
- [ ] Mantener exclusivamente el despliegue DRS filtrado y comprobado en navegador.
