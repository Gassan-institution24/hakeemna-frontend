// Dental condition definitions — color, labels, scope, overlays.
//
// `kind` splits the catalogue into two clinical axes that can coexist on the
// same tooth/surface:
//   • 'diagnosis'  — a clinical finding (caries, fracture, missing, …)
//   • 'procedure'  — a restoration / treatment (filling, crown, implant, …)
// `toothLevel: true`  → applies to the whole tooth; false → a single surface.
export const CONDITIONS = [
  // ── Special: eraser ─────────────────────────────────────────────────────────
  {
    id: 'healthy',
    label: 'Healthy',
    labelAr: 'سليم',
    color: '#FFFFFF',
    stroke: '#BDBDBD',
    toothLevel: false,
    kind: 'diagnosis',
    group: 'diagnosis',
    eraser: true,
  },

  // ── Diagnoses (clinical findings) ───────────────────────────────────────────
  {
    id: 'caries',
    label: 'Caries',
    labelAr: 'تسوس',
    color: '#EF5350',
    stroke: '#C62828',
    toothLevel: false,
    kind: 'diagnosis',
    group: 'diagnosis',
  },
  {
    id: 'fracture',
    label: 'Fracture',
    labelAr: 'كسر',
    color: '#FFCDD2',
    stroke: '#B71C1C',
    toothLevel: false,
    kind: 'diagnosis',
    group: 'diagnosis',
    overlay: 'fracture',
  },
  {
    id: 'periodontal',
    label: 'Periodontal',
    labelAr: 'أمراض لثة',
    color: '#FFF3E0',
    stroke: '#E65100',
    toothLevel: false,
    kind: 'diagnosis',
    group: 'diagnosis',
  },
  {
    id: 'watch',
    label: 'Watch',
    labelAr: 'مراقبة',
    color: '#FFFDE7',
    stroke: '#F9A825',
    toothLevel: false,
    kind: 'diagnosis',
    group: 'diagnosis',
  },
  {
    id: 'missing',
    label: 'Missing',
    labelAr: 'مفقود',
    color: '#F5F5F5',
    stroke: '#9E9E9E',
    toothLevel: true,
    kind: 'diagnosis',
    group: 'diagnosis',
    overlay: 'X',
  },
  {
    id: 'unerupted',
    label: 'Unerupted',
    labelAr: 'لم يبزغ',
    color: '#E8EAF6',
    stroke: '#3949AB',
    toothLevel: true,
    kind: 'diagnosis',
    group: 'diagnosis',
  },
  {
    id: 'impacted',
    label: 'Impacted',
    labelAr: 'مطمور',
    color: '#FCE4EC',
    stroke: '#C62828',
    toothLevel: true,
    kind: 'diagnosis',
    group: 'diagnosis',
  },

  // ── Procedures — Restorative ────────────────────────────────────────────────
  {
    id: 'filling_composite',
    label: 'Composite',
    labelAr: 'حشو كمبوزيت',
    color: '#42A5F5',
    stroke: '#1565C0',
    toothLevel: false,
    kind: 'procedure',
    group: 'restorative',
  },
  {
    id: 'filling_amalgam',
    label: 'Amalgam',
    labelAr: 'حشو أملغم',
    color: '#78909C',
    stroke: '#37474F',
    toothLevel: false,
    kind: 'procedure',
    group: 'restorative',
  },
  {
    id: 'filling_gic',
    label: 'GIC',
    labelAr: 'حشو GIC',
    color: '#A5D6A7',
    stroke: '#2E7D32',
    toothLevel: false,
    kind: 'procedure',
    group: 'restorative',
  },
  {
    id: 'sealant',
    label: 'Sealant',
    labelAr: 'حاجب تشققات',
    color: '#B2DFDB',
    stroke: '#00695C',
    toothLevel: false,
    kind: 'procedure',
    group: 'restorative',
  },

  // ── Procedures — Prosthetic ─────────────────────────────────────────────────
  {
    id: 'crown_ceramic',
    label: 'Ceramic Crown',
    labelAr: 'تاج خزفي',
    color: '#FFF9C4',
    stroke: '#F9A825',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
  },
  {
    id: 'crown_metal',
    label: 'Metal Crown',
    labelAr: 'تاج معدني',
    color: '#CFD8DC',
    stroke: '#455A64',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
  },
  {
    id: 'crown_pfm',
    label: 'PFM Crown',
    labelAr: 'تاج خزف معدني',
    color: '#FFD54F',
    stroke: '#F57F17',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
  },
  {
    id: 'crown_zirconia',
    label: 'Zirconia',
    labelAr: 'زيركونيا',
    color: '#E1F5FE',
    stroke: '#0288D1',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
  },
  {
    id: 'veneer',
    label: 'Veneer',
    labelAr: 'قشرة',
    color: '#F3E5F5',
    stroke: '#7B1FA2',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
  },
  {
    id: 'bridge_abutment',
    label: 'Bridge Abutment',
    labelAr: 'دعامة جسر',
    color: '#FFF3E0',
    stroke: '#F57C00',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
    overlay: 'bridge',
  },
  {
    id: 'bridge_pontic',
    label: 'Bridge Pontic',
    labelAr: 'حامل جسر',
    color: '#FFF3E0',
    stroke: '#F57C00',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
    overlay: 'bridge',
  },
  {
    id: 'implant',
    label: 'Implant',
    labelAr: 'زراعة',
    color: '#E8F5E9',
    stroke: '#2E7D32',
    toothLevel: true,
    kind: 'procedure',
    group: 'prosthetic',
    overlay: 'implant',
  },

  // ── Procedures — Endodontic ─────────────────────────────────────────────────
  {
    id: 'root_canal',
    label: 'Root Canal',
    labelAr: 'علاج عصب',
    color: '#FFE0B2',
    stroke: '#E65100',
    toothLevel: true,
    kind: 'procedure',
    group: 'endodontic',
    overlay: 'root_canal',
  },

  // ── Procedures — Surgical / Ortho ───────────────────────────────────────────
  {
    id: 'extraction_planned',
    label: 'Extraction',
    labelAr: 'مقرر خلعه',
    color: '#FFEBEE',
    stroke: '#C62828',
    toothLevel: true,
    kind: 'procedure',
    group: 'surgical',
    overlay: 'X_planned',
  },
  {
    id: 'orthodontic',
    label: 'Orthodontic',
    labelAr: 'تقويم',
    color: '#E8F5E9',
    stroke: '#1B5E20',
    toothLevel: true,
    kind: 'procedure',
    group: 'surgical',
  },
];

// Groups shown within the Procedures column (diagnoses are a single flat list).
export const CONDITION_GROUPS = [
  { id: 'restorative', label: 'Restorative', labelAr: 'ترميمي' },
  { id: 'prosthetic', label: 'Prosthetic', labelAr: 'تعويضي' },
  { id: 'endodontic', label: 'Endodontic', labelAr: 'قناة جذر' },
  { id: 'surgical', label: 'Surgical / Ortho', labelAr: 'جراحي / تقويم' },
];

// ── Lookups ────────────────────────────────────────────────────────────────────
export const getCondition = (id) => CONDITIONS.find((c) => c.id === id) || null;

export const getConditionColor = (id) => getCondition(id)?.color || '#FFFFFF';
export const getConditionStroke = (id) => getCondition(id)?.stroke || '#BDBDBD';
export const getConditionLabel = (id, lang = 'en') =>
  lang === 'ar' ? (getCondition(id)?.labelAr || id) : (getCondition(id)?.label || id);

export const getConditionKind = (id) => getCondition(id)?.kind || null;

// Convenience filters used by the palette / modal.
export const DIAGNOSES = CONDITIONS.filter((c) => c.kind === 'diagnosis' && !c.eraser);
export const PROCEDURES = CONDITIONS.filter((c) => c.kind === 'procedure');

export const getConditionsByKind = (kind, { toothLevel } = {}) =>
  CONDITIONS.filter(
    (c) =>
      c.kind === kind &&
      !c.eraser &&
      (toothLevel === undefined || c.toothLevel === toothLevel)
  );
