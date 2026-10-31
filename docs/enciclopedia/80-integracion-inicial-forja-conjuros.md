# Integración funcional inicial de Conjuros en Forja

**Fecha:** 30/10/2026. **Rama:** `feat/forja-conjuros-fichas-2026-10-30`. **Base:** auditoría documental de los 434 Conjuros de la rama `docs/enciclopedia-inventario-2026-10-28`.

## Qué funciona

- **434/434 entradas del Tomo de Magia** se publican para consulta en `data/conjuros-revisados-001-225.json` y `data/conjuros-revisados-226-434.json`, derivadas de los lotes literales `69a–69r` y del índice `70a`.
- Las **diez correcciones geométricas aprobadas** de `78a` están aplicadas *solo en las fichas que consulta Forja*; no se modifican transcripciones 69 ni el Google Doc.
- Las fichas emergentes de Conjuros muestran descripción y condiciones completas, **Alcance, Duración, Lanzamiento, Requisito, Círculo y Escuela** cuando la fuente los determina. Muestran «Redacción» (literal o corregida) y **«Automatización: descripción consultable; efecto no automatizado»**.
- La coincidencia se realiza por **ID documental del catálogo**, no por conjeturas de nombres, para distinguir `Glosolalia mayor` de `Glosolalia mayor †`.
- **`Ira celestial`:** el catálogo contiene Círculo 3 y Círculo 5, pero el Tomo solo documenta Círculo 5. El Círculo 3 mantiene una ficha de metadatos **sin importar los efectos del Círculo 5**.
- **`Arma elemental`:** se conservan ambas entradas 26 y 29 del Tomo, pero ambas apuntan a un único registro del catálogo, sin adjudicar un conjuro extra.

## Integridad y pruebas

`tests/conjuros.js` compara cada uno de los 434 textos públicos contra su ficha 69 y el índice 70a, permite exclusivamente las diez sustituciones aprobadas en 78a, verifica las relaciones con el catálogo y prueba las ventanas informativas para duplicados y Círculos diferentes. Está conectado a `node tests/smoke.js`.

`.github/workflows/validar-conjuros.yml` comprueba la sintaxis y lanza el *smoke* en la rama funcional, con permisos de lectura y **sin despliegue de Pages**.

## Trabajo mecánico que todavía falta

Estas fichas informativas **no constituyen un motor de lanzamiento de Conjuros**. La Forja ya implementaba la elección de Conjuros por Círculos, Escuelas, Ocupaciones y Espacios según sus progresiones verificadas; ahora añade acceso al texto revisado sin crear ninguna regla nueva. Permanecen pendientes:

1. Resolver los conflictos editoriales específicos en `76b` y seis erratas propuestas en `77d`.
2. Decidir el esquema de estado reglamentario que Forja realmente necesita (costes, objetivos, alcance, daño, tiradas y efectos, sin extrapolar de las descripciones).
3. Implementar solo mecánicas aprobadas y probar éxito, fallo, acumulaciones, duración, geometría y progresión.
4. Revisar el despliegue, la experiencia de lectura y las pruebas de regresión antes de fusionar o publicar.

**Estado:** primer incremento funcional entregado para revisión; no se debe presentar como generador de efectos automáticos terminado. Google Drive y las fuentes históricas sin cambios.
