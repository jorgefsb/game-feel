---
name: game-feel
description: "Use when adding game feel to a web page or app: micro-interactions, sound with consent, levels Nada to Hardcore, an optional mascot, ethical return loops and the Cursor líquido pointer trail, for any brand with its own profile."
version: 1.0.1
license: MIT
author: Jorge Suárez
---

# Game Feel

[Español](SKILL.es.md) · [English](SKILL.md)

Make a page answer when people use it: clear, fast, with character, and never in the way. This skill is generic. Anything specific to one brand lives in that brand's profile. A mascot is optional.

Related, separate repositories (intended public homes, check they exist before linking them):

- Cursor líquido, the pointer trail engine: https://github.com/jorgefsb/cursor-liquido
- Game Feel, this method plus the cursor adapter: https://github.com/jorgefsb/game-feel
- Papacito Juice, the personal-brand profile of Jorge Suárez, with Moki: https://github.com/jorgefsb/papacito-juice

## 1. Boundaries

- Each brand keeps its own colours, voice, mascot and code. Never borrow another brand's mascot or identity.
- Ask who owns a site before touching it. Publish only with that owner's approval.
- Preserve content: words, figures, links, navigation, forms and language switch stay as they are. Format changes are not content changes.

## 2. Trigger plus response

A micro-interaction is a trigger (what the person does) plus a response (what the page answers). Ideas from game design: Martin Jonasson and Petri Purho («Juice it or lose it»), Jan Willem Nijman («The art of screenshake»), Renaud Forestié (More Mountains).

1. **Core actions first.** The three things people do most get the best response. Everything else gets little or nothing.
2. **Consistency.** One response language per site: the same class of action gets the same kind of hit.
3. **Proportion.** Small actions answer small, important ones answer big. A click is not a party. Finishing something valuable may be.
4. **Turn it up, then back off.** Exaggerate, watch where people smile, trim.
5. **Test with smiles.** If nobody smiles or repeats the gesture, the response does not work.
6. **Never in the way.** It never covers text or buttons, never delays the task and can always be turned off.

## 3. Layers, cheapest first

Timing (under 100 ms, easing with bounce), anticipation, squash and stretch, particles behind text in brand colours, short flash without glow, short sound, haptics after a gesture, screenshake of the main content (never `body`, Hardcore only), capped permanent debris (Hardcore only), environment reaction (Mucho and Hardcore), small randomness, context. Work in that order.

## 4. Levels «Juega»

| Level | `data-jz-level` | Behaviour | Cursor líquido |
|---|---|---|---|
| Nada | `off` | No motion. Forced by `prefers-reduced-motion`. | `nada`, no effect |
| Poquito | `subtle` | Discreet responses on core actions. Default. | `poquito`, original 7 px dots (brand colour, `#22211F`, `#F4E8D5`) |
| Mucho | `full` | Every layer up to environment reaction | `mucho`, 10 CSS px fluid |
| Hardcore | `hard` | Everything up. Earned with a site achievement. | `hardcore`, 18 CSS px fluid |

There is no fifth stable level. Respect the visitor's stored choice. A page changes its starting level through configuration (`data-jz-default="full"` in juice 1.2.0), never by overwriting the visitor's choice. Hardcore is earned. A site without a mascot defines its own achievement and, once earned, opens it (juice 1.2.0: `data-jz-hard="open"` plus a `jz:unlock-hard` event).

## 5. Sound and haptics with consent

Visible mute control. A muted choice is kept. No audio context before the first click or key. Short sounds (under 150 ms). Exceptions such as an achievement fanfare are listed in the brand profile. Vibration only after a real gesture.

## 6. Ethical return loops

Fill in the Hook questions (Nir Eyal): external trigger, internal trigger, smallest valuable action, variable reward, investment. Proven patterns: daily hide and seek, collection, what is new since your last visit, a random card of real content, a kind streak that only congratulates. Never: fake scarcity, invented counters, guilt, punishment for not returning, personal data. Everything can be turned off or erased.

## 7. Optional mascot

Only approved assets from that brand's library. Never mirror a pose, never invent poses outside the brand rules. Never covers a button or text. Still in Nada. No permanent loops. Speaks the page language in its approved voice.

## 8. Brand profile

Before installing, write the profile: owner and approver, particle colours (`--jz-c1`, `--jz-c2`, `--jz-c3`) and accent, fonts, mascot or «no mascot», response language per core action, sound default and exceptions, starting level, Hardcore achievement, return loop. If something is missing, ask the brand owner. Do not invent it.

## 9. Installing with Cursor líquido

1. Serve everything from the site's own origin. No runtime CDN. Never edit a published file of juice or Cursor líquido. A fix is a new version of that package.
2. juice 1.2.0 generic subset (core, menu, `hardcore/`) from `jorgefsb/game-industry-resources`, folder `juice/1.2.0`, at a pinned commit. Verify every sha256 against that commit's `manifest.json`, in the repo and once served. Read the hashes from the manifest, never from old notes.
3. Cursor líquido 1.0.1 dist. Its renderer travels byte for byte. Check the published golden hash.
4. The Game Feel adapter `src/game-feel-cursor.js` and `src/game-feel-cursor.css`, then `GameFeelCursor.mount({ requireJuice: true })`.
5. One cursor owner. While mounted, the adapter marks `<html data-game-feel-cursor="liquid">` and its CSS hides only the older Hardcore pointer dots (`.jzh-t`). Celebrations, debris, combos and sounds stay. This hides the old trail. It does not stop `hardcore.js` from creating those hidden nodes, so say so honestly. `destroy()` restores the previous attribute value.
6. Never send `off|subtle|full|hard` straight to an older fluid engine. Use the cursor's own `followJuice` mapping.
7. A page without juice can use Cursor líquido alone with a fixed intensity. No visitor prompt.

## 10. QA before publishing

At 375 and 1280 px at least, each language, normal and reduced motion: no console errors, every route responds, `scrollWidth <= innerWidth` at every level, mute kept after reload, Hardcore locked until earned, reduced motion forces Nada with no particles, nothing covers controls or text, particles clean themselves up, served files match the pinned sha256, exactly one visible pointer trail. Browser emulation is not a physical device test. Say which one you ran.

## 11. Continuous improvement

One experiment per site at a time: measure, change, measure again. Record what was tried, what smile or metric it produced and what changes in the profile. «No data» is a valid result. No data, no success claim.

## 12. Writing

Visible text is short and plain, in the page language, with an English version. No long dashes. No internal notes in public text.
