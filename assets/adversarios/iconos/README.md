# Iconos de adversarios — La Forja

La Forja conserva las **16 categorias reglamentarias** del DRS y emplea **12 siluetas SVG compartidas** en la representacion visual, sin cambiar el JSON ni los Talentos.

El archivo `assets/adversarios-categorias.js` define una correspondencia por categoria, el icono aprobado y sus dos colores (tinta para superficies claras y brillo para fondos oscuros). Los 12 archivos `categoria-*.svg` se distribuyen siempre en el paquete publico y se muestran como mascaras CSS 1:1, sin la capa negra del SVG original.

## Prioridad visual

1. Ilustracion personal de la ficha, si existe.
2. Icono especifico por ID o nombre del adversario, si se registra en el manifiesto.
3. Icono compartido de la categoria.
4. Recuadro neutro solo para categorias desconocidas y sin icono propio.

Las ilustraciones oficiales asociadas al navegador tienen prioridad sobre los SVG. Si falta un SVG individual, se recupera automaticamente el icono de categoria.

## Iconos por ficha opcionales

`assets/adversarios-iconos.json` admite asignaciones especiales:

```json
{
  "version": 1,
  "iconos": {
    "drs-necrototamo": "necrototamo.svg",
    "nombre-monstruo-personal": "monstruo-personal.svg"
  }
}
```

Las claves por ID tienen prioridad sobre las de nombre. El manifiesto sigue siendo opcional y no controla los 12 SVG de categoria.

Las fuentes Game Icons tienen licencia CC BY 3.0; su origen y autor constan en `assets/icons/CREDITOS-GAME-ICONS.txt`, publicado y accesible desde la web. Los SVG originales se preservan en `docs/iconografia/originales/game-icons/`.
