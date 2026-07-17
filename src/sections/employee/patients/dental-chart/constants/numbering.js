// Tooth-numbering systems. The chart stores FDI everywhere; these convert an
// FDI number to whatever notation the user picked for display only.

import { isPrimary, ADULT_UPPER, ADULT_LOWER, CHILD_UPPER, CHILD_LOWER, getQuadrant, getToothPosition } from './fdi';

export const NUMBERING_SYSTEMS = [
  { value: 'fdi', label: 'FDI' },
  { value: 'universal', label: 'Universal' },
  { value: 'palmer', label: 'Palmer' },
];

// ── Universal ────────────────────────────────────────────────────────────────
// Permanent: 1–32 starting at the upper-right third molar, running across the
// upper arch, then back along the lower arch from the lower-left third molar.
const UNIVERSAL_PERMANENT_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const UNIVERSAL_PERMANENT_LOWER = [38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48];

// Primary: A–J across the upper arch, K–T back along the lower arch.
const UNIVERSAL_PRIMARY_UPPER = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const UNIVERSAL_PRIMARY_LOWER = [75, 74, 73, 72, 71, 81, 82, 83, 84, 85];
const PRIMARY_LETTERS = 'ABCDEFGHIJKLMNOPQRST';

const universalMap = (() => {
  const map = {};
  UNIVERSAL_PERMANENT_UPPER.forEach((fdi, i) => {
    map[fdi] = String(i + 1);
  });
  UNIVERSAL_PERMANENT_LOWER.forEach((fdi, i) => {
    map[fdi] = String(i + 17);
  });
  [...UNIVERSAL_PRIMARY_UPPER, ...UNIVERSAL_PRIMARY_LOWER].forEach((fdi, i) => {
    map[fdi] = PRIMARY_LETTERS[i];
  });
  return map;
})();

// ── Palmer ───────────────────────────────────────────────────────────────────
// Position number (or letter for primary) plus a bracket marking the quadrant.
const PALMER_BRACKETS = {
  1: (s) => `${s}┘`, // upper right
  2: (s) => `└${s}`, // upper left
  3: (s) => `┌${s}`, // lower left
  4: (s) => `${s}┐`, // lower right
  5: (s) => `${s}┘`, // primary upper right
  6: (s) => `└${s}`, // primary upper left
  7: (s) => `┌${s}`, // primary lower left
  8: (s) => `${s}┐`, // primary lower right
};

export function toNotation(fdi, system) {
  if (system === 'universal') return universalMap[fdi] ?? String(fdi);

  if (system === 'palmer') {
    const quadrant = getQuadrant(fdi);
    const position = getToothPosition(fdi);
    const symbol = isPrimary(fdi) ? PRIMARY_LETTERS[position - 1] : String(position);
    const bracket = PALMER_BRACKETS[quadrant];
    return bracket ? bracket(symbol) : String(fdi);
  }

  return String(fdi);
}

// Every tooth the chart can show, for callers that need the full set.
export const ALL_TEETH = [...ADULT_UPPER, ...ADULT_LOWER, ...CHILD_UPPER, ...CHILD_LOWER];
