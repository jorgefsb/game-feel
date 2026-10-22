# Privacy and licenses

[Español](privacy-license.md) · [English](privacy-license.en.md)

## Data

The adapter stores nothing, reads no cookies, makes no network requests and sends no telemetry. It only writes an `<html>` attribute while mounted.

juice 1.2.0 keeps preferences in the visitor’s own browser `localStorage`:

| Key | Writer | Purpose |
|---|---|---|
| `gamedev_sfx` | `juice.js` | Sound enabled/disabled |
| `jz-level` | `juice.js` | Juega level |
| `jz-menu-seen` | `juice-menu.js` | Avoid repeating invitation frame |
| `jz-hard` | Site achievement module | Hardcore unlocked |

None of that leaves the browser. Clear site data to erase it. Analytics you add to your site needs your own policy, not a claim about juice.

Demo/tests serve everything from `127.0.0.1` and fail on other-origin page requests.

## Licenses

| Material | License | In this repo |
|---|---|---|
| Game Feel code and instructions | MIT, [LICENSE](../LICENSE) | Yes |
| juice 1.2.0 | Source repo declares no license at pinned commit | No, downloaded into ignored `vendor/` |
| Cursor líquido 1.0.1 | MIT, shader adapted from Pavel Dobryakov (MIT) | No, downloaded/built into ignored `vendor/` |
| Mascot artwork | Each brand’s own rights | No; Game Feel uses no mascot |

Details: [NOTICES](../NOTICES). Documentation cover artwork: [asset notice](ASSET-NOTICE.md).

## Brands and mascots

Game Feel is generic; any brand may use its own mascot or none. It grants no rights to another brand’s identity, voice or mascot. Moki belongs to Jorge Suárez’s personal brand and exists only in the `papacito-juice` profile.
