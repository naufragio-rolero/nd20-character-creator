# Iconos de Adversarios — La Forja

Este directorio admite ilustraciones SVG **cuadradas (1:1)** para los cromos de la galería. Hasta que se asigne una imagen, el cromo muestra un **cuadrado negro** sin iniciales.

## Incorporar un icono

1. Guarda aquí un archivo SVG propio, p. ej. `necrototamo.svg`, preferentemente con `viewBox="0 0 64 64"` y sin referencias externas.
2. Registra su nombre en `assets/adversarios-iconos.json` (sin rutas):

```json
{
  "version": 1,
  "iconos": {
    "drs-necrototamo": "necrototamo.svg",
    "nombre-monstruo-personal": "monstruo-personal.svg"
  }
}
```

Las claves `drs-<id_del_adversario>` apuntan a los IDs de `data/adversarios-drs.json`; `nombre-<slug>` sirve para fichas personales o imágenes compartidas por nombre, en minúsculas, sin tildes y con guiones. La clave por ID tiene prioridad. No hace falta crear el icono para todos los adversarios. Solo se copian al paquete público los SVG **referenciados por el manifiesto** y validados.

Los SVG se presentan como `<img>` (sin inyectar su código en la página); los archivos inexistentes o no registrados dejan visible el cuadrado negro. Las ilustraciones no afectan al JSON de las fichas, reglas ni exportación de personajes.
