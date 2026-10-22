# Architecture

[Español](architecture.md) · [English](architecture.en.md)

## Components and ownership

| Component | Owns | Never touches |
|---|---|---|
| `juice.js` 1.2.0 | Level (`data-jz-level`), sound, response presets | Cursor |
| `juice-menu.js` 1.2.0 | Juega menu and Hardcore lock | Cursor |
| `hardcore/hardcore.js` 1.2.0 | Magnet, squash, sparks, combos, debris, old `.jzh-t` trail | Level |
| Cursor líquido 1.0.1 | Poquito dots and Mucho/Hardcore fluid | Level, sound, mascot |
| `GameFeelCursor` (this repo) | One cursor and `data-game-feel-cursor` marker | Everything else |
| Page | Core actions, achievements, identity | Published juice/cursor files |

Each responsibility has one owner; the adapter does not make decisions already owned elsewhere.

## Flow

1. `juice.js` sets `<html data-jz-level>` from the saved visitor choice, page `data-jz-default` or `prefers-reduced-motion`.
2. The page calls `GameFeelCursor.mount()`.
3. The adapter validates that `LiquidCursor` maps `off, subtle, full, hard` to `nada, poquito, mucho, hardcore` with radii 0, 0, 10 and 18 px. If `window.JZ` exists its level must be one of those four.
4. It sets `<html data-game-feel-cursor="liquid">` and uses a probe element to check that `game-feel-cursor.css` hides `.jzh-t`. Otherwise it rolls back the marker and fails.
5. It calls `LiquidCursor.mount({ followJuice: true, … })`. The cursor reads `data-jz-level` through `MutationObserver` and changes only its layer.
6. `destroy()` destroys the cursor and restores the previous attribute. If another component changed that attribute meanwhile, it leaves the new value intact.

## One pointer owner

Hardcore paints its own dots (`i.jzh-t` in `.jzh-layer`) on mouse `pointermove`, at most once every 38 ms, up to 29 live nodes lasting 480 ms each. Cursor líquido paints 18 px fluid. Both would mean two trails.

juice 1.2.0 has no documented switch for that trail. `JZ_CONFIG` and `data-jz-off` cover core effects (press, flash, ripple, etc.), not the `hardcore.js` trail. Rejected approaches:

- Patch `hardcore.js`: breaks the published SHA-256 and immutable-version rule.
- Intercept global `pointermove`: changes input for the whole page.
- Lower the level: takes away the visitor’s choice.

The solution is narrowly scoped, lifecycle-bound page CSS:

```css
html[data-game-feel-cursor="liquid"] .jzh-t { display: none !important; }
```

It applies only while mounted. It does not hide `.jzh-p`, `.jzh-b`, `.jzh-ring` or `.jzh-pop`; celebrations, debris, combos and sounds remain. Browser tests check both directions: no visible `.jzh-t` and visible celebration particles when mounted; the old trail returns after `destroy()`.

**Residual work:** CSS hides the trail without stopping it. `hardcore.js` still creates, animates and removes those invisible nodes in Hardcore. Work is bounded (up to 29 nodes). A real switch requires a new juice version.

## Idempotence and lifecycle

- Repeated `mount` calls leave one cursor: the previous instance is destroyed first. Cursor líquido also replaces its own instance at each mount.
- The prior attribute value is captured before the first marker and preserved through repeated mounts.
- Repeated `destroy` calls are safe.
- Reduced motion: juice forces Nada; Cursor líquido disables its layers at load and on live preference changes.

## What it is not

- Not a new engine or engine fork; the renderer is unchanged inside Cursor líquido.
- Not a mascot selector; Game Feel knows no mascot.
- Not a fifth level.
