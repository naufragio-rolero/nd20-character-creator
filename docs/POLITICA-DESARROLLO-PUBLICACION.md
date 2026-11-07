# Política de desarrollo y publicación de La Forja

Estas normas se conservan fuera de la portada del repositorio para evitar que el README se convierta en un documento técnico extenso.

## Política obligatoria de ramas, PR y publicación

**No acumular solicitudes de cambio abiertas.** Antes de empezar una tarea que necesite rama o PR, consultar las PR abiertas, sus ramas y la versión vigente de `main`. Si existe una PR pendiente del mismo trabajo, **primero revisarla, validar lo que contiene y resolverla** (fusionar tras QA, cerrar por sustitución/integración o dejar constancia del bloqueo). No abrir PR sucesoras ni ramas paralelas para esquivar una revisión pendiente. Una excepción por trabajo paralelo o release aislado requiere decisión expresa y dependencia documentada.

1. **Una tarea, una rama, una PR con destino claro.** Describir alcance, fuentes, archivos afectados, base/head, relación con otras PR, pruebas necesarias y qué queda fuera. Los borradores son para desarrollo activo, no un archivo permanente de tareas terminadas.
2. **Validar antes de continuar.** Inspeccionar el diff real frente al `main` vigente y comprobar que no restaura código antiguo. Ejecutar las pruebas apropiadas: validación Node, compras/consulta en navegadores, PDF/iconos si se tocan, y guardia/paquete público DRS. Si hay UI, comprobar también móvil y accesibilidad. Anotar resultados y bloqueos reales; un CI antiguo en verde no valida una fusión sobre un `main` posterior.
3. **Cerrar el ciclo de cada PR.** Tras fusionar, verificar su estado y el código efectivo en `main`. Si otra rama o un snapshot de release ya incorporó la funcionalidad, comprobar equivalencia o ascendencia antes de **cerrar la PR original sin volver a fusionarla**, y explicar el motivo en un comentario. No borrar ramas con cambios exclusivos sin haberlos recuperado o descartado expresamente.
4. **`main` no es LIVE.** Publicar mediante el workflow protegido, con SHA exacto aprobado, paquete DRS de lista blanca y QA de la revisión a desplegar. Una publicación exitosa **no cierra automáticamente una PR**, ni acredita que sus commits estén integrados en `main`. No promocionar trabajo incompleto, CiFi/Nocturna ni el árbol raíz.
5. **Comprobación de salida.** Antes de abrir otra rama o PR, volver a listar las PR abiertas y consignar para cada una su destino: fusionar, cerrar o bloqueo documentado. Si una sigue bloqueada, resolver su prioridad y obtener autorización explícita antes de añadir trabajo paralelo. Informar de cualquier PR remanente al concluir la tarea.

**Mantenimiento documental puntual:** una corrección exclusivamente de documentación, solicitada expresamente y sin cambios de aplicación, datos ni workflows, puede registrarse directamente en `main` después de revisar el diff. Los cambios funcionales mantienen su revisión por rama/PR. No modificar el workflow LIVE para adelantar una publicación.

## Validaciones del paquete público

```sh
node tests/smoke.js
node scripts/crear-paquete-drs.js
node scripts/comprobar-publicacion-drs.js dist/public-drs
node tests/paquete-publico-drs.js
```

**Solo** se despliega `dist/public-drs` mediante el workflow protegido `.github/workflows/forja-live.yml`, con SHA fijado y validado. Nunca se publica el árbol raíz ni el contenido de CiFi, Nocturna o suplementos no aprobados.
