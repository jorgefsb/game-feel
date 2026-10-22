# Integración

[Español](integration.md) · [English](integration.en.md)

Guía para poner Game Feel con Cursor líquido en una página de cualquier marca. La demo [../examples/index.html](../examples/index.html) sigue estos mismos pasos.

## 1. Archivos en tu mismo origen

```
/juice/1.2.0/juice.css
/juice/1.2.0/juice.js
/juice/1.2.0/juice-menu.css
/juice/1.2.0/juice-menu.js
/juice/1.2.0/hardcore/hardcore.css
/juice/1.2.0/hardcore/hardcore.js
/juice/1.2.0/manifest.json
/vendor/cursor-liquido/cursor-liquido.js
/vendor/cursor-liquido/cursor-liquido.css
/game-feel/game-feel-cursor.js
/game-feel/game-feel-cursor.css
```

Las rutas son ejemplo. Lo que importa es que todo salga de tu dominio, sin CDNs en runtime, y que nada de juice ni del cursor se edite.

`node scripts/setup-demo.mjs` hace esa descarga y verificación para la demo. Para un sitio real puedes copiar desde `vendor/` después de correrlo, o descargar a mano y comprobar:

```sh
sha256sum juice/1.2.0/*.js juice/1.2.0/*.css juice/1.2.0/hardcore/*
```

Compara contra los pins de [setup-demo.mjs](../scripts/setup-demo.mjs) y contra `manifest.json`. Repite la comprobación ya servido, desde la URL pública.

## 2. HTML

- `<html lang="es" data-jz-sound="on">` si tu perfil quiere sonido prendido de inicio. La persona lo puede apagar y juice respeta esa elección.
- `data-jz-default="full"` solo si tu perfil arranca en Mucho. Sin ese atributo arranca en Poquito.
- Un `<button type="button" class="juice-sfx"></button>` donde quieras el menú. `juice-menu.js` pone ahí el dock de «Juega». El panel abre hacia la izquierda del dock, así que conviene dejarlo en el borde derecho del header.
- CSS en el `<head>`: tokens de tu marca, CSS del sitio, `juice.css`, `juice-menu.css`, `hardcore.css`, `cursor-liquido.css`, `game-feel-cursor.css`.
- Scripts al final con `defer`, en este orden: `juice.js`, `juice-menu.js`, `hardcore.js`, `cursor-liquido.js`, `game-feel-cursor.js` y el script de tu sitio.

## 3. Montar

En el script de tu sitio (también con `defer`, después de los anteriores):

```js
const cursor = GameFeelCursor.mount({ requireJuice: true });
```

Para quitarlo (rollback en vivo o cambio de página en una SPA):

```js
cursor.destroy();
```

`mount` falla con un mensaje claro si falta algo. No lo envuelvas en un `try` que lo esconda: un error aquí significa que la instalación está incompleta.

## 4. Marca

```css
:root {
  --jz-c1: #6ea8fe;  /* partículas de juice y Hardcore */
  --jz-c2: #c9d1d9;
  --jz-c3: #f2f4f7;
  --liquid-cursor-color: #6ea8fe;  /* primer color de los puntos de Poquito */
}
```

Los puntos de Poquito usan tres colores: el color de la marca, `#22211F` y `#F4E8D5`. Los dos últimos vienen fijos en el wrapper aprobado de Cursor líquido. El fluido de Mucho y Hardcore usa su propia paleta multicolor del renderer y se mezcla con `screen`, por eso luce sobre fondos oscuros.

Marca con `data-liquid-obstacle` los bloques que el fluido debe tratar como pared.

## 5. Hardcore sin mascota

juice 1.2.0 abre Hardcore con `localStorage["jz-hard"]="1"` (lo escribe un módulo de logro, como el de una mascota) o con `<html data-jz-hard="open">`. En un sitio sin mascota:

1. Define un logro real del sitio (la demo pide tres acciones núcleo).
2. Cuando la persona lo cumple, pon `data-jz-hard="open"` y avisa al menú:

```js
document.documentElement.setAttribute('data-jz-hard', 'open');
document.dispatchEvent(new CustomEvent('jz:unlock-hard'));
```

No pongas `data-jz-hard="open"` fijo en el HTML de producción si tu perfil dice que Hardcore se gana. La nota del candado de `juice-menu.js` 1.2.0 habla de Mokis. Si tu sitio no tiene mascota, ocúltala con `.jz-hard__lock { display: none !important; }` y explica tu logro en la página.

## 6. Lo que no se toca

- Ningún archivo de juice ni de Cursor líquido. Un arreglo es una versión nueva de ese paquete.
- El nivel, el sonido y el candado. Son de la persona y de juice.
- Los eventos globales. El adapter no intercepta nada.

## 7. Rollback

1. Quita el `<script>` de `game-feel-cursor.js` y su CSS, o llama `destroy()`.
2. Con eso vuelve la estela original de Hardcore y desaparecen las capas del cursor.
3. juice sigue igual: el adapter nunca cambió su estado.

## 8. Verificar

Corre la QA de [design-principles.md](design-principles.md#8-qa-antes-de-publicar) y, en este repo, `npm test` y `npm run test:browser`.
