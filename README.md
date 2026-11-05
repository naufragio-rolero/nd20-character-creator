# Forja de personajes · El Naufragio

Generador de personajes para **Naufragio d20** y **Dungeon Hack**. Aplicación estática sin servidor. **CiFi y Nocturna** permanecen en preparación y no se muestran como sistemas disponibles.

**Web:** https://naufragio-rolero.github.io/nd20-character-creator/

## Objetivo y límites del proyecto

**La Forja sirve para crear personajes de forma rápida y fiable**, tanto para Cronistas que preparan personajes como para jugadores que quieren empezar a jugar sin dedicar una sesión entera a rellenar la ficha.

Su alcance es **generar, configurar, consultar y exportar fichas**: Especies, Ocupaciones, Atributos, Recursos, Talentos, Conjuros, Equipo inicial y compras puntuales documentadas. Prioridad para la legibilidad, la rapidez y la fidelidad a las fuentes.

**No es una mesa virtual ni un simulador de partida.** No desarrollaremos automatización de combate, gestión de turnos, viajes, desplazamientos, consumo por intervalos, seguimiento de encuentros o dirección de campañas. Un dato reglamentario puede mostrarse en la ficha sin convertirlo en una mecánica ejecutable.

**Criterio para nuevas funcionalidades:** deben ayudar directamente a **crear o consultar un personaje** y justificar su coste de interfaz y mantenimiento. Ante la duda, preferir una ficha sencilla y una referencia clara antes que añadir una pantalla, un sistema o una automatización. No inventar reglas ausentes del DRS ni trasladar automáticamente contenido de suplementos.

## Desarrollo y pruebas

```sh
python -m http.server 8000
node tests/smoke.js
node scripts/crear-paquete-drs.js
node scripts/comprobar-publicacion-drs.js dist/public-drs
node tests/paquete-publico-drs.js
```

Nunca publicar el directorio raíz: el único paquete público es el DRS depurado, distribuido por `.github/workflows/forja-live.yml` desde una revisión validada.

## Política obligatoria de ramas, PR y publicación

**No acumular solicitudes de cambio abiertas.** Antes de empezar una tarea que necesite rama o PR, consultar las PR abiertas, sus ramas y la versión vigente de `main`. Si existe una PR pendiente del mismo trabajo, **primero revisarla, validar lo que contiene y resolverla** (fusionar tras QA, cerrar por sustitución/integración o dejar constancia del bloqueo). No abrir PR sucesoras ni ramas paralelas para esquivar una revisión pendiente. Una excepción por trabajo paralelo o release aislado requiere decisión expresa y dependencia documentada.

1. **Una tarea, una rama, una PR con destino claro.** Describir alcance, fuentes, archivos afectados, base/head, relación con otras PR, pruebas necesarias y qué queda fuera. Los borradores son para desarrollo activo, no un archivo permanente de tareas terminadas.
2. **Validar antes de continuar.** Inspeccionar el diff real frente al `main` vigente y comprobar que no restaura código antiguo. Ejecutar las pruebas apropiadas: validación Node, compras/consulta en navegadores, PDF/iconos si se tocan, y guardia/paquete público DRS. Si hay UI, comprobar también móvil y accesibilidad. Anotar resultados y bloqueos reales; un CI antiguo en verde no valida una fusión sobre un `main` posterior.
3. **Cerrar el ciclo de cada PR.** Tras fusionar, verificar su estado y el código efectivo en `main`. Si otra rama o un snapshot de release ya incorporó la funcionalidad, comprobar equivalencia o ascendencia antes de **cerrar la PR original sin volver a fusionarla**, y explicar el motivo en un comentario. No borrar ramas con cambios exclusivos sin haberlos recuperado o descartado expresamente.
4. **`main` no es LIVE.** Publicar mediante el workflow protegido, con SHA exacto aprobado, paquete DRS de lista blanca y QA de la revisión a desplegar. Una publicación exitosa **no cierra automáticamente una PR**, ni acredita que sus commits estén integrados en `main`. No promocionar trabajo incompleto, CiFi/Nocturna ni el árbol raíz.
5. **Comprobación de salida.** Antes de abrir otra rama o PR, volver a listar las PR abiertas y consignar para cada una su destino: fusionar, cerrar o bloqueo documentado. Si una sigue bloqueada, resolver su prioridad y obtener autorización explícita antes de añadir trabajo paralelo. Informar de cualquier PR remanente al concluir la tarea.

**Mantenimiento documental puntual:** una corrección exclusivamente de documentación, solicitada expresamente y sin cambios de aplicación, datos ni workflows, puede registrarse directamente en `main` después de revisar el diff. Los cambios funcionales mantienen su revisión por rama/PR. No modificar el workflow LIVE para adelantar una publicación.

Editor de criaturas propias de Naufragio d20: fase 2 técnica disponible en el repositorio (importador y biblioteca local). La sección «Criaturas» se añadirá dentro de La Forja en fase 3; el bestiario oficial continúa en https://naufragiod20.naufragio.net/. Véase `docs/EDITOR-CRIATURAS-FASES.md`. No hay automatización de combate.

## Editar y traducir
- Textos: `locales/es.json` y `index.html`.
- Mensajes generados: `assets/app.js`.
- Internacionalización: `assets/i18n.js` (otros idiomas pendientes).
- Documentación editorial: `docs/enciclopedia/`.
- Tareas de Forja 1.2: `docs/PLAN-FORJA-1-2.md`.
- Hoja de ruta de mejoras, tres tandas (legibilidad, seguidores/conjuros y Atributos): `docs/HOJA-RUTA-FORJA-TANDAS-2026-11.md`.
- Seguidores DRS y preparación de Conjuros (Tanda 2): `docs/SEGUIDORES-Y-CONJUROS-TANDA2.md`.
- Elegibilidad de Técnicas y compra de armamento competente (nueva prioridad; Tanda 3 de Atributos descartada): `docs/ELEGIBILIDAD-TECNICAS-Y-ARMAMENTO.md`.
- Iconografía de Equipo y configurador: `docs/ICONOS-Y-CONFIGURACION-FORJA.md`.
- Semillas, intervalos de Nivel y reproducción de generaciones: `docs/SEMILLAS-RANGOS-REPRODUCCION.md`.
- Requisitos de diseño para exportación futura a PDF: `docs/EXPORTACION-PDF-PLANTILLAS.md` (solo planificación; aún no implementado).

Código GPL-3.0. Los textos originales conservan sus respectivas atribuciones y licencias.
