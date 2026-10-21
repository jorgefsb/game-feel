# Game Feel

Metodología genérica para que una página conteste cuando la usas, más un adapter chico que conecta [Cursor líquido](https://github.com/jorgefsb/cursor-liquido) con los niveles de juice («Juega»: Nada, Poquito, Mucho, Hardcore). Sirve para cualquier marca, con su propia mascota o sin mascota.

> Estado: repositorio local listo para publicarse como `https://github.com/jorgefsb/game-feel`. Esa URL, la de Cursor líquido y la de `papacito-juice` son el destino previsto, no enlaces ya verificados. No hay paquete en npm.

## Por qué existe

Una micro-interacción es disparador más respuesta. La persona hace algo y la página contesta clara, rápida y con carácter, sin estorbar. Juice da esas respuestas por nivel. Cursor líquido da la estela del puntero. Faltaba la pieza que los junta sin pelear por el puntero, sin tocar archivos publicados y sin decidir por la persona. Eso es este repo:

- La metodología vive en [docs/design-principles.md](docs/design-principles.md) y en la skill portable [skills/game-feel/SKILL.md](skills/game-feel/SKILL.md).
- El adapter vive en [src/game-feel-cursor.js](src/game-feel-cursor.js) y [src/game-feel-cursor.css](src/game-feel-cursor.css).
- La demo genérica vive en [examples/index.html](examples/index.html). No usa mascota.

El perfil de la marca personal de Jorge Suárez, con Moki, está en el repo hermano `papacito-juice`. Game Feel no lo necesita.

## Arquitectura en una vista

```
juice.js (nivel)  ──escribe──>  <html data-jz-level="off|subtle|full|hard">
                                          │ lee (nunca escribe)
Cursor líquido (LiquidCursor) <──followJuice──┘
        ▲
        │ mount, destroy
GameFeelCursor (este repo) ──marca──> <html data-game-feel-cursor="liquid">
                                          │
game-feel-cursor.css: oculta la estela vieja de Hardcore (.jzh-t) solo mientras hay marca
```

Detalle y razones en [docs/architecture.md](docs/architecture.md).

## Los cuatro niveles

| Juega | `data-jz-level` | Cursor líquido | Qué se ve |
|---|---|---|---|
| Nada | `off` | `nada` | Sin efecto. `prefers-reduced-motion` fuerza este nivel. |
| Poquito | `subtle` | `poquito` | Puntos originales de 7 px (naranja, oscuro y crema), sin WebGL |
| Mucho | `full` | `mucho` | Fluido de 10 px CSS |
| Hardcore | `hard` | `hardcore` | Fluido de 18 px CSS |

No hay quinto nivel estable. «Legendario» es solo una propuesta en [docs/roadmap.md](docs/roadmap.md). El adapter rechaza un build de cursor que mapee distinto y un nivel de juice que no sea uno de estos cuatro.

## Instalar en tu sitio

Todo se sirve desde tu mismo origen. Nada de CDNs en runtime.

1. **juice 1.2.0, subconjunto genérico.** Copia byte por byte de `juice/1.2.0/` en el commit fijado: `juice.css`, `juice.js`, `juice-menu.css`, `juice-menu.js`, `hardcore/hardcore.css`, `hardcore/hardcore.js` y `manifest.json`. Verifica cada sha256 contra la tabla de abajo.
2. **Cursor líquido 1.0.0.** Usa `cursor-liquido.js` y `cursor-liquido.css` del release cuando esté publicado. El renderer va sin cambios dentro del bundle y su sha256 debe ser el dorado.
3. **Este adapter.** Copia `src/game-feel-cursor.js` y `src/game-feel-cursor.css`.
4. **HTML**, en este orden:

```html
<html lang="es" data-jz-sound="on">
<link rel="stylesheet" href="/juice/1.2.0/juice.css">
<link rel="stylesheet" href="/juice/1.2.0/juice-menu.css">
<link rel="stylesheet" href="/juice/1.2.0/hardcore/hardcore.css">
<link rel="stylesheet" href="/vendor/cursor-liquido/cursor-liquido.css">
<link rel="stylesheet" href="/game-feel/game-feel-cursor.css">
…
<button type="button" class="juice-sfx"></button>  <!-- el menú Juega se acomoda junto a este botón -->
…
<script src="/juice/1.2.0/juice.js" defer></script>
<script src="/juice/1.2.0/juice-menu.js" defer></script>
<script src="/juice/1.2.0/hardcore/hardcore.js" defer></script>
<script src="/vendor/cursor-liquido/cursor-liquido.js" defer></script>
<script src="/game-feel/game-feel-cursor.js" defer></script>
<script src="/js/tu-sitio.js" defer></script>   <!-- aquí: GameFeelCursor.mount({ requireJuice: true }) -->
```

Pasos completos, tokens de marca, Hardcore sin mascota y rollback en [docs/integration.md](docs/integration.md).

### Cursor líquido solo, sin este repo

Si tu página no usa juice, no necesitas Game Feel. Cursor líquido funciona solo con una intensidad fija: `LiquidCursor.mount({ intensity: 'poquito' })`. Game Feel sirve cuando el nivel lo decide el menú «Juega».

## API

`GameFeelCursor.mount(options)` devuelve un handle. Volver a llamarlo destruye el anterior: siempre hay un solo cursor.

| Opción | Default | Qué hace |
|---|---|---|
| `cursor` | `window.LiquidCursor` | El global de Cursor líquido a usar. Se valida que mapee los cuatro niveles con 0, 0, 10 y 18 px. |
| `followJuice` | `true` | Sigue `data-jz-level`. Con `false`, pasa `intensity`. |
| `requireJuice` | `false` | Con `true`, falla si `window.JZ` no está cargado. |
| `intensity`, `color`, `touch`, `obstacleSelector`, `container` | los de Cursor líquido | Se pasan tal cual a `LiquidCursor.mount`. `color` cambia solo el primer color de los puntos de Poquito. |

Handle: `handle.cursor` (la instancia de Cursor líquido), `handle.stats` (nivel de juice, intensidad, capa, radio), `handle.destroy()`. También `GameFeelCursor.current`, `.levels`, `.radii`, `.attribute`, `.version`.

`mount` lanza un error claro si falta el cursor, si el mapeo no coincide, si el nivel de juice es desconocido, si `requireJuice` está activo sin juice o si `game-feel-cursor.css` no está cargado. Cuando falla, deja el atributo como estaba.

Lo que el adapter **nunca** hace: escribir `data-jz-level`, cambiar el sonido, abrir Hardcore, tocar `localStorage`, tocar una mascota, parchar juice o el cursor, ni interceptar eventos globales. El puntero nativo y todo el input quedan intactos.

## Probar la demo y los tests

```sh
npm ci
npm run setup -- --cursor-dir ruta/a/cursor-liquido/dist
npm run demo            # abre http://127.0.0.1:<puerto>/examples/
npm test                # unitarios y de contrato (node:test)
npm run test:browser    # Chromium real con Playwright 1.64.1
```

`npm run setup` descarga juice del commit fijado y verifica cada sha256. Cursor líquido sale de `--cursor-dir` (o `CURSOR_LIQUIDO_DIR`): una carpeta `dist` del release, o los insumos aprobados (renderer, adapter y wrapper) más `--cursor-css`. Sin esa opción intenta bajar el release v1.0.0, que todavía puede no existir. `--juice-dir` (o `JUICE_DIR`) usa una copia local de `juice/1.2.0`. Todo queda en `vendor/`, ignorado por Git. `npm run verify` vuelve a hashear `vendor/`. Si `node_modules` no está, `PLAYWRIGHT_MODULE` puede apuntar a una instalación existente de la misma versión.

La suite del navegador corre con Chromium headless y WebGL por SwiftShader. Son viewports emulados, no teléfonos físicos. Las capturas quedan en `qa/` (ignorado) y el resumen en [reports/browser-report.json](reports/browser-report.json).

## Fuentes fijadas

| Pieza | Fuente | Fijación |
|---|---|---|
| juice 1.2.0 | `jorgefsb/game-industry-resources`, rama `feat/juice-1.1.0-moki`, carpeta `juice/1.2.0` | commit `f1b3b9c77a43ffbcbd331bb88420a436614fdbc3` (main todavía no trae 1.2.0) |
| `manifest.json` | mismo commit | `a4da3499b6e171221a11477c839e08fadbbc846fc687266c5007bace6a2c6568` |
| `juice.css` | | `2d02b3e2d968cd5afe9b6174979255b97aa7ad8793c682273a85976f06058981` |
| `juice.js` | | `79ef95b5ee106fcc477f2f79c13bce8dae82401a28a91f328e53f152ac4d9995` |
| `juice-menu.css` | | `1e6d00d4e95c2b6640fd5eb9470552c75eea2744698b8267287c1b80a79edabc` |
| `juice-menu.js` | | `00f0edeb1246003927b1ce8c8ecdc75bfccee46d753a6caac0cf71aa6333b596` |
| `hardcore/hardcore.css` | | `0c727d475e66651f12c5d5a618e1fed365ae1a78195a82f2ca56a07e18f01bcb` |
| `hardcore/hardcore.js` | | `b4671dfaf0b5853d4f5c950c66cc8920da245c95c7b836ec682af15b1c70dd70` |
| Cursor líquido 1.0.0 | `jorgefsb/cursor-liquido` (destino previsto) | renderer dorado `3d478cc836969c216812c7e479724e0e204bbb76a26df24c2414568883021230` |

Los mismos valores viven en [scripts/setup-demo.mjs](scripts/setup-demo.mjs) y se comparan contra el manifest de upstream en cada corrida.

## Límites conocidos

- La estela vieja de Hardcore se **oculta con CSS**, no se apaga. `hardcore.js` sigue creando y animando hasta 29 puntos invisibles, uno cada 38 ms como máximo, mientras el nivel es Hardcore y el puntero es un mouse. juice 1.2.0 no trae un interruptor documentado para esa estela (`JZ_CONFIG` no la cubre). El trabajo extra es acotado, pero existe.
- El candado de Hardcore en `juice-menu.js` 1.2.0 menciona a los Mokis. Una página sin mascota oculta esa nota con su propio CSS y explica su logro, como hace la demo.
- Los acentos del menú Juega vienen fijos en naranja dentro de `juice-menu.css`. Los colores de partículas sí cambian con `--jz-c1`, `--jz-c2` y `--jz-c3`.
- El fluido se mezcla con `screen`: luce sobre fondos oscuros.
- En software (SwiftShader) el motor puede bajar calidad o pausarse por su propio presupuesto de cuadros. Es comportamiento del motor, no del adapter.
- El release v1.0.0 de Cursor líquido aún no está publicado. Hasta entonces usa `--cursor-dir`.

## English quickstart

Game Feel is a brand-neutral method plus a tiny adapter that lets Cursor líquido follow the juice «Juega» level (`off`→`nada`, `subtle`→`poquito` 7 px dots, `full`→`mucho` 10 px fluid, `hard`→`hardcore` 18 px fluid). No mascot required, no fifth level.

```sh
npm ci
npm run setup -- --cursor-dir path/to/cursor-liquido/dist   # juice 1.2.0 is fetched from the pinned commit and hash-checked
npm run demo
npm test && npm run test:browser
```

On your site, serve juice 1.2.0 (core, menu, hardcore), Cursor líquido 1.0.0 and `src/game-feel-cursor.{js,css}` from your own origin, then call `GameFeelCursor.mount({ requireJuice: true })`. The adapter never writes the level, the sound choice, achievements or mascot state. While mounted it sets `<html data-game-feel-cursor="liquid">` so the old Hardcore pointer trail is hidden by CSS. `destroy()` restores the previous attribute value. See [docs/integration.md](docs/integration.md).

## Licencia

El código y las instrucciones de este repo son MIT ([LICENSE](LICENSE)). juice y Cursor líquido se descargan de sus propias fuentes y no se redistribuyen aquí. Ver [NOTICES](NOTICES) y [docs/privacy-license.md](docs/privacy-license.md).
