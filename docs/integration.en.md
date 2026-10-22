# Integration

[Español](integration.md) · [English](integration.en.md)

Install Game Feel with Cursor líquido on a page of any brand. [The demo](../examples/index.html) follows these steps.

## 1. Same-origin files

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

Paths are examples. Serve everything from your own domain without runtime CDNs; never edit juice or cursor files.

`node scripts/setup-demo.mjs` downloads and verifies files for the demo. For a real site, copy from `vendor/` after setup or download and check manually:

```sh
sha256sum juice/1.2.0/*.js juice/1.2.0/*.css juice/1.2.0/hardcore/*
```

Compare with [setup-demo.mjs pins](../scripts/setup-demo.mjs) and `manifest.json`. Recheck the served files from their public URLs.

## 2. HTML

- `<html lang="es" data-jz-sound="on">` if your profile starts with sound enabled. Visitors can disable it and juice respects that choice.
- `data-jz-default="full"` only for a profile starting in Mucho; otherwise Poquito is the default.
- Place `<button type="button" class="juice-sfx"></button>` for the menu. `juice-menu.js` inserts Juega there. Its panel opens to the left, so the header’s right edge is appropriate.
- CSS in `<head>`: brand tokens, site CSS, `juice.css`, `juice-menu.css`, `hardcore.css`, `cursor-liquido.css`, `game-feel-cursor.css`.
- Deferred scripts in this order: `juice.js`, `juice-menu.js`, `hardcore.js`, `cursor-liquido.js`, `game-feel-cursor.js`, site script.

## 3. Mount

In your site script, deferred after the dependencies:

```js
const cursor = GameFeelCursor.mount({ requireJuice: true });
```

To remove it, for live rollback or SPA navigation:

```js
cursor.destroy();
```

`mount` fails with a clear error when something is missing. Do not hide that error in a `try`: it means installation is incomplete.

## 4. Brand

```css
:root {
  --jz-c1: #6ea8fe;  /* juice and Hardcore particles */
  --jz-c2: #c9d1d9;
  --jz-c3: #f2f4f7;
  --liquid-cursor-color: #6ea8fe;  /* first Poquito dot color */
}
```

Poquito dots use three colors: the brand color, `#22211F` and `#F4E8D5`. The last two are fixed by the approved Cursor líquido wrapper. Mucho/Hardcore fluid uses the renderer’s own multicolor palette and `screen` blending, so it looks best on dark backgrounds.

Mark blocks with `data-liquid-obstacle` to make them fluid walls.

## 5. Hardcore without a mascot

juice 1.2.0 unlocks Hardcore using `localStorage["jz-hard"]="1"` (written by an achievement module, for example a mascot module) or `<html data-jz-hard="open">`. Without a mascot:

1. Define a real achievement (the demo asks for three core actions).
2. When completed, set `data-jz-hard="open"` and notify the menu:

```js
document.documentElement.setAttribute('data-jz-hard', 'open');
document.dispatchEvent(new CustomEvent('jz:unlock-hard'));
```

Do not hard-code `data-jz-hard="open"` in production HTML if your profile says Hardcore is earned. The `juice-menu.js` 1.2.0 lock note mentions Mokis. On a mascot-free site hide it with `.jz-hard__lock { display: none !important; }` and explain your own achievement on the page.

## 6. Do not change

- Any juice or Cursor líquido file. A fix means a new version of that package.
- Level, sound or lock: these belong to the visitor and juice.
- Global events: the adapter does not intercept them.

## 7. Rollback

1. Remove `game-feel-cursor.js` and its CSS, or call `destroy()`.
2. The old Hardcore trail returns and the cursor layers disappear.
3. juice remains unchanged; the adapter never modified its state.

## 8. Verify

Run [the design QA](design-principles.en.md#8-qa-before-publication) and, in this repository, `npm test` and `npm run test:browser`.
