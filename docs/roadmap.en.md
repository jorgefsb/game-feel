# Roadmap

[Español](roadmap.md) · [English](roadmap.en.md)

The stable version has four levels: Nada, Poquito, Mucho and Hardcore. The following is a proposal, not implemented and not a fifth level in this version.

## Proposal: “Legendario”

**Idea.** The environment responds to useful actions. When a person completes something valuable (submits a form, completes a collection, finds what they need), that area gives a short visual response and context-sensitive celebration.

**Would include**

- Short responses tied to useful actions, not every pointer movement.
- Contextual celebration proportional to achievement.
- A mascot only if the brand has and approves one. Game Feel adds none.

**Unchanged**

- Cursor radius does not grow: Hardcore remains the maximum, 18 px.
- Renderer algorithm/GPU work stay unchanged; approved Cursor líquido renderer remains byte-identical.
- Reduced motion disables effects as today.
- Nothing blocks navigation, clicks, scroll or keyboard.

**Conditions for implementation**

1. A requesting brand profile, its achievement and metric.
2. Human tests: no smiles or repeated gesture, no feature.
3. New juice version without patching published versions.
4. Automated proof of non-obstruction, reduced-motion support and bounded work.

## Known gaps

- A documented juice switch to disable the old Hardcore trail rather than CSS-hiding it.
- Brand-configurable Hardcore lock wording in `juice-menu.js`.
- Publish Cursor líquido v1.0.1 so setup does not require `--cursor-dir`.

## Status of this documentation review

The list above preserves the starting point’s gaps; it does not verify current remote release availability. This review publishes nothing. If a download fails, use verified local paths from the integration guide without changing pins.
