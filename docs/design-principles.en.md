# Design principles

[Español](design-principles.md) · [English](design-principles.en.md)

Game feel makes an interface feel like a good game: it responds to touch, has character and invites a return. This guide is generic. Brand-specific differences belong in a brand profile.

## 1. Trigger plus response

A microinteraction has two parts: the person acts (trigger), the page replies (response). The response should be clear, fast and distinctive. References from game design: Martin Jonasson and Petri Purho (“Juice it or lose it”), Jan Willem Nijman (“The art of screenshake”), and Renaud Forestié’s work at More Mountains.

1. **Core actions first.** The three most frequent actions (primary button, form submission, section change) get the best feedback. Others get little or none.
2. **Consistency.** One response language per site: the same action class gets the same kind of impact.
3. **Proportion.** Small actions get small responses; significant achievements get large ones. A click does not deserve a party; completing something valuable may.
4. **Turn it up, then down.** Exaggerate, watch for smiles, then trim.
5. **Test for smiles.** If nobody smiles or repeats the gesture, the response does not work.
6. **Never obstruct.** Do not cover text or controls, delay the task or remove the off switch.

## 2. Layers, cheapest to most expensive

| Layer | Meaning | Where |
|---|---|---|
| Timing | Under 100 ms response, bounce easing | Everywhere |
| Anticipation | Shrinks slightly before release | Buttons, cards |
| Squash and stretch | Deforms on impact | Tapped objects |
| Particles | Brand-color sparks behind text | Success |
| Flash | Brief accent border, no glow | Confirmations |
| Sound | Under 150 ms, quiet | Core actions |
| Haptics | Short vibration after a gesture | Mobile |
| Screenshake | Moves main content, never `body` | Hardcore only |
| Persistence | Bounded debris | Hardcore only |
| Environment response | Tilting cards, impact entrances | Mucho and Hardcore |
| Randomness | Slight variation in pitch, angle, phrase | Repeated actions |
| Context | Response depends on place/time | Achievements, combos |

Work order: timing, consistency, visuals, sound/haptics, secondary reactions, shake, randomness, context.

## 3. Juega levels

| Level | Behavior |
|---|---|
| Nada | Zero movement, forced by `prefers-reduced-motion` |
| Poquito | Discreet core-action feedback, default start |
| Mucho | All layers through environmental response |
| Hardcore | Maximum, earned through a site achievement |

The visitor’s choice is respected and saved in their browser. Configure a page’s starting level rather than rewriting that choice. Each site defines its real achievement (core actions, collection, finding a mascot); the lock explains it in one line.

## 4. Sound and haptics with consent

- Visible mute control; respect the browser’s saved choice.
- No sound before the first click or keypress.
- Short sounds; document exceptions (achievement fanfare, mascot voice) in the brand profile.
- Vibration follows a real gesture and respects the level.

## 5. Ethical return loops

Juice makes it feel good; a useful loop makes returning worthwhile. Every proposal answers these questions (Nir Eyal’s Hook model):

| Stage | Question |
|---|---|
| External trigger | What brings the person back? |
| Internal trigger | What feeling reminds them of the site? |
| Action | What is the smallest valuable gesture? |
| Variable reward | What unexpected thing do they discover? |
| Investment | What do they leave that improves the next visit? |

Patterns: daily hide-and-seek, collections, new-since-last-visit, random real-content card, a kind streak that only congratulates.

Limits: no false scarcity, invented counters, guilt, punishment for absence or personal data. Everything can be disabled or erased. Does it genuinely help the person?

## 6. Optional mascot

A brand may have a mascot or none. If it does:

- Use only approved art from that brand’s library. Never mirror or invent poses without its brandkit rules.
- Never cover text or buttons; remain still in Nada; no permanent loops.
- Speak the page language with the approved voice.

Never use another brand’s mascot.

## 7. Brand profile

Before installation document: owner/approver; particle colors (`--jz-c1`, `--jz-c2`, `--jz-c3`) and accent; fonts; mascot or none; responses to core actions; default sound and exceptions; initial level and Hardcore achievement; chosen return loop. Ask the brand owner for missing decisions; do not invent them.

## 8. QA before publication

At 375 and 1280 px minimum, in each language, normal and reduced motion:

1. No console errors; all routes respond.
2. `scrollWidth <= innerWidth` at every level, including Hardcore.
3. Mute persists after reload.
4. Hardcore remains locked until achievement.
5. Reduced motion forces Nada and creates no particles.
6. No control/text obstruction.
7. Particles clean themselves up; debris respects its cap.
8. Served files match pinned SHA-256.
9. One pointer owner.
