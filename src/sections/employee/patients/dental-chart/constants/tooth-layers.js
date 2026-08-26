// Hakeemna tooth data → upstream SVG layer ids.
//
// This is a pure display adapter. It reads the chart's in-memory tooth object and
// returns the set of artwork layers to switch on. It never touches the API, and
// nothing here is persisted — `constants/conditions.js` remains the source of
// truth for what a condition *is*.
//
// The layer ids come from React-Odontogram-Modul's own registry
// (`src/registry/svgLayers.ts`, `FIXED_CLEAR_LAYERS`) — they are that project's
// documented activation contract and are identical across all four templates.
// The artwork in ../assets/teeth is authored with every one of them OFF, so a
// tooth shows nothing clinical until it appears in the set built below.

// Hakeemna models six surfaces; the artwork has five. Incisal edges are drawn by
// the same layer as the occlusal table on anterior templates.
//
// Note on `lingual`: the facial-view templates carry no `*-lingual` artwork —
// that surface faces away from the viewer and is only drawn in the occlusal
// templates (14_occl / 16_occl), which are not wired up. Lingual ids are still
// emitted (harmless no-ops, and correct if those views are added later); a
// lingual finding remains visible to the clinician through the surface wheel,
// which is unchanged and still covers all six surfaces.
const SURFACE_TO_LAYER = {
  occlusal: 'occlusal',
  incisal: 'occlusal',
  mesial: 'mesial',
  distal: 'distal',
  buccal: 'buccal',
  lingual: 'lingual',
};

// Whole-tooth procedures → their artwork layer(s).
const CONDITION_LAYERS = {
  crown_ceramic: ['emax-crown'],
  crown_zirconia: ['zircon-crown'],
  crown_metal: ['metal-crown'],
  crown_pfm: ['metal-ceramic-crown'],
  veneer: ['emax-veneer'],
  implant: ['implant', 'implant-base'],
  root_canal: ['endo-filling'],
  extraction_planned: ['extraction-plan'],
  orthodontic: ['ortho-bracket'],
  sealant: ['fissure-sealing'],
  // A prepared stump: upstream turns `tooth-base` off and `tooth-crownprep` on.
  crown_prep: ['tooth-crownprep'],
  // A bridge member shows the crown cap plus the saddle connector, matching
  // upstream's own composition for bridge teeth.
  bridge_abutment: ['zircon-crown', 'zircon-bridge-connector'],
  bridge_pontic: ['zircon-crown', 'zircon-bridge-connector'],
};

// Whole-tooth diagnoses → layer(s).
const DIAGNOSIS_LAYERS = {
  missing: ['no-tooth-after-extraction'],
  impacted: ['tooth-under-gum'],
  unerupted: ['tooth-under-gum'],
  periodontal: ['parodontal'],
  fracture: ['tooth-broken-incisal'],
  // Root fragment only: upstream turns `tooth-base` off and `tooth-radix` on.
  retained_root: ['tooth-radix'],
};

// Surface restorations → the per-surface filling layer, by material.
const FILLING_MATERIAL = {
  filling_composite: 'composite',
  filling_amalgam: 'amalgam',
  filling_gic: 'gic',
};

// Conditions that replace the natural crown, so the healthy tooth body and its
// beauty pass must be suppressed underneath them.
// Conditions whose artwork *is* the tooth body, so the natural crown must be
// suppressed underneath — mirroring upstream, which clears `tooth-base` first.
//
// `extraction_planned` is deliberately absent: that tooth is still in the mouth
// and only carries a planning marker over it.
const REPLACES_CROWN = new Set([
  'missing',
  'implant',
  'impacted',
  'unerupted',
  'crown_prep',
  'retained_root',
]);

/**
 * Build the set of layer ids to activate for one tooth.
 *
 * @param {object|null} toothData Hakeemna tooth record
 * @returns {Set<string>}
 */
export default function getActiveLayers(toothData) {
  const layers = new Set();

  const diagnosis = toothData?.whole_diagnosis || null;
  const condition = toothData?.whole_condition || null;
  const surfaces = toothData?.surfaces || {};

  const crownGone = REPLACES_CROWN.has(diagnosis) || REPLACES_CROWN.has(condition);

  // Baseline healthy tooth, unless something replaces it. Mirrors upstream's
  // default state (toothSelection "tooth-base" + healthy pulp).
  if (!crownGone) {
    layers.add('tooth-base');
    layers.add('tooth-healthy-pulp');
    // The beauty pass is upstream's un-restored surface detail; it is dropped
    // once a restoration covers the crown.
    if (!condition) layers.add('tooth-base-beauty');
  }

  if (condition && CONDITION_LAYERS[condition]) {
    CONDITION_LAYERS[condition].forEach((id) => layers.add(id));
  }
  if (diagnosis && DIAGNOSIS_LAYERS[diagnosis]) {
    DIAGNOSIS_LAYERS[diagnosis].forEach((id) => layers.add(id));
  }

  // Per-surface findings and restorations.
  Object.entries(surfaces).forEach(([surfaceKey, surface]) => {
    if (!surface) return;
    const face = SURFACE_TO_LAYER[surfaceKey];
    if (!face) return;

    if (surface.diagnosis === 'caries') layers.add(`caries-${face}`);

    const material = FILLING_MATERIAL[surface.condition];
    if (material) layers.add(`filling-${material}-${face}`);
    if (surface.condition === 'sealant') layers.add('fissure-sealing');
  });

  return layers;
}

/**
 * Every layer this adapter can ever switch on.
 *
 * The renderer drives exactly these ids and nothing else: each is set to '1' or
 * '0' on every update, so clearing a condition removes its artwork instead of
 * leaving it stranded. Layers outside this set keep whatever state the asset was
 * authored with, which is how the base anatomy stays visible.
 */
export const MANAGED_LAYERS = (() => {
  const ids = new Set(['tooth-base', 'tooth-healthy-pulp', 'tooth-base-beauty', 'fissure-sealing']);

  Object.values(CONDITION_LAYERS).forEach((list) => list.forEach((id) => ids.add(id)));
  Object.values(DIAGNOSIS_LAYERS).forEach((list) => list.forEach((id) => ids.add(id)));

  const faces = [...new Set(Object.values(SURFACE_TO_LAYER))];
  faces.forEach((face) => {
    ids.add(`caries-${face}`);
    Object.values(FILLING_MATERIAL).forEach((material) => ids.add(`filling-${material}-${face}`));
  });

  return ids;
})();

/**
 * Layers controlled by chart-level *view* toggles rather than patient data.
 *
 * Deliberately separate from everything above: `getActiveLayers()` translates a
 * patient's record into artwork, and folding display preferences into it would
 * make them look like clinical findings. The renderer applies these *after* the
 * data pass, so turning the pulp off wins over a tooth whose data says healthy.
 *
 * Layer names follow upstream: its Bone toggle (`setShowBase`) switches the
 * `base` group, which carries the bone and gum artwork.
 */
export const VIEW_LAYERS = {
  bone: ['base', 'bone-base', 'gum-base'],
  pulp: ['tooth-healthy-pulp', 'tooth-inflam-pulp'],
};

export { SURFACE_TO_LAYER, CONDITION_LAYERS, DIAGNOSIS_LAYERS, FILLING_MATERIAL };
