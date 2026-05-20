// FDI World Dental Federation numbering system

// ── Adult arch display order (left → right in chart) ─────────────────────────
// Patient's right is on viewer's LEFT
export const ADULT_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const ADULT_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// ── Child arch display order ──────────────────────────────────────────────────
export const CHILD_UPPER = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
export const CHILD_LOWER = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

// ── Quadrant identification ───────────────────────────────────────────────────
export const getQuadrant = (fdi) => Math.floor(fdi / 10);

export const isUpperArch = (fdi) => {
  const q = getQuadrant(fdi);
  return [1, 2, 5, 6].includes(q);
};

// Right quadrants: Q1 (upper right), Q4 (lower right), Q5 (child upper right), Q8 (child lower right)
export const isRightQuadrant = (fdi) => {
  const q = getQuadrant(fdi);
  return [1, 4, 5, 8].includes(q);
};

// ── Tooth morphology ──────────────────────────────────────────────────────────
export const getToothPosition = (fdi) => fdi % 10; // 1–8 (adult) or 1–5 (child)

export const getToothType = (fdi) => {
  const pos = getToothPosition(fdi);
  if (pos <= 2) return 'incisor';
  if (pos === 3) return 'canine';
  if (pos <= 5) return 'premolar';
  return 'molar';
};

export const isAnterior = (fdi) => getToothPosition(fdi) <= 3;

// ── SVG crown surface transform per quadrant ──────────────────────────────────
// The crown SVG is defined with buccal at TOP, mesial at LEFT.
// Q2 (upper left): no transform needed
// Q1 (upper right): flip mesial/distal → horizontal mirror
// Q3 (lower left): flip buccal/lingual → vertical mirror
// Q4 (lower right): flip both
export const getCrownTransform = (fdi) => {
  const upper = isUpperArch(fdi);
  const right = isRightQuadrant(fdi);

  if (upper && right) return 'scale(-1,1) translate(-44,0)';
  if (!upper && !right) return 'scale(1,-1) translate(0,-44)';
  if (!upper && right) return 'scale(-1,-1) translate(-44,-44)';
  return ''; // upper left (Q2/Q6) — default
};

// ── Root configuration ────────────────────────────────────────────────────────
// Returns { count, height }
export const getRootConfig = (fdi) => {
  const type = getToothType(fdi);
  const q = getQuadrant(fdi);
  const upper = isUpperArch(fdi);

  switch (type) {
    case 'incisor':
      return { count: 1, height: 28 };
    case 'canine':
      return { count: 1, height: 32 };
    case 'premolar':
      // Upper premolars can have 2 roots; lower usually 1
      return { count: upper ? 2 : 1, height: 26 };
    case 'molar':
      // Upper molars: 3 roots; lower: 2; wisdom teeth: variable
      return { count: upper ? 3 : 2, height: 30 };
    default:
      return { count: 1, height: 26 };
  }
};

// ── Surface display labels (anatomically correct by tooth type) ───────────────
export const getSurfaceLabel = (surfaceKey, fdi, lang = 'en') => {
  const anterior = isAnterior(fdi);
  const upper = isUpperArch(fdi);

  const LABELS = {
    en: {
      occlusal: anterior ? 'Incisal' : 'Occlusal',
      buccal: anterior ? 'Labial' : 'Buccal',
      lingual: upper && anterior ? 'Palatal' : 'Lingual',
      mesial: 'Mesial',
      distal: 'Distal',
    },
    ar: {
      occlusal: anterior ? 'إنسيزال' : 'أوكلوزال',
      buccal: anterior ? 'شفهي' : 'بوكال',
      lingual: upper && anterior ? 'حنكي' : 'لساني',
      mesial: 'ميزيال',
      distal: 'ديستال',
    },
  };

  return (LABELS[lang] || LABELS.en)[surfaceKey] || surfaceKey;
};
