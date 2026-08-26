# Tooth artwork — third-party notice

The `.svg` files in this folder are **not** original Hakeemna work.

| | |
|---|---|
| Source | [React-Odontogram-Modul](https://github.com/ZoliQua/React-Odontogram-Modul) |
| Author | Zoltán Dul ([@ZoliQua](https://github.com/ZoliQua)) |
| Licence | MIT — full text in `UPSTREAM-LICENSE` |
| Upstream path | `src/assets/teeth-svgs/` |
| Commit | `934a9119a640a6941429cbd9ea42e26220b7c55d` (2026-08-19) |

Each SVG also carries the author's own attribution comment in its header; do not strip it.

## Templates

Four facial views and two occlusal views. Hakeemna maps a tooth to a template through
`getToothType()` in `../../constants/fdi.js`:

The markup lives in `artwork.js` (generated); the `.svg` originals are not kept, since that file
contains them verbatim.

| Template | Archetype | Used for |
|---|---|---|
| `11` | upper central incisor | `incisor` |
| `13` | canine | `canine` |
| `14` | upper first premolar | `premolar` |
| `16` | upper first molar | `molar` (incl. primary molars) |
| `14_occl`, `16_occl` | occlusal views | premolars/molars when occlusal view is on |

Upstream ships **no occlusal artwork for incisors or canines** — anterior teeth keep their facial
drawing in occlusal view.

## Local modification — important

These files are **not** byte-identical to upstream. They were transformed once by
`prune-teeth.js` (kept with the integration notes, not in this repo), which does two things:

1. **Inverts the default layer state.** Upstream authors the artwork with nearly every layer
   `data-active="1"` and switches layers *off* at runtime via `allClearLayers()` in
   `src/registry/svgLayers.ts`. Used as-shipped, a single healthy tooth would display caries, every
   filling material, orthodontic brackets and an extraction marker at once. Every id in upstream's
   `FIXED_CLEAR_LAYERS` (144 ids, parsed from their registry rather than guessed) is therefore
   authored `data-active="0"` here, and `tooth-illustration.jsx` activates only what the patient's
   chart data specifies.
2. **Drops unusable pathology.** The `cysta`, `granuloma`, `abscess`, `mobility` and `inflammation`
   groups are removed — Hakeemna's schema has no field to drive them, and removing them cuts DOM
   weight (~475 → ~463 elements per tooth, inlined ~32× per chart).

   `bone-base` and `gum-base` are **kept**. An earlier pass dropped them and had to be redone:
   upstream's Bone toggle (`setShowBase`) switches the `base` group those layers live in, so removing
   them removes the feature. Do not add them back to the drop list.

Consequence: **do not overwrite these files with a fresh upstream copy.** Re-run the prune script
against the new version instead, or the chart will render every clinical state simultaneously.

## Layer contract

Layer ids are upstream's activation contract and are identical across templates
(see their `tools/toothgen/README.md`). The mapping from Hakeemna conditions to these ids lives in
`../../constants/tooth-layers.js`.
