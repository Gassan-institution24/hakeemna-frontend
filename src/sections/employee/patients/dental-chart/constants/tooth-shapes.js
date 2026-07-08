/**
 * Realistic facial-view tooth silhouettes (crown + roots), generated
 * parametrically per tooth family so we cover all 52 teeth without hand-drawing
 * each one. Original artwork — no copyrighted assets.
 *
 * Canonical orientation is CROWN-UP / ROOT-DOWN (a lower tooth). The renderer
 * flips it vertically for the upper arch so roots point away from the midline,
 * exactly like a paper odontogram. Left/right silhouettes are near-symmetric, so
 * no horizontal mirror is needed for the illustration (the surface wheel handles
 * mesial/distal orientation separately).
 *
 * Coordinate space: width 40, centre x = 20, crown starts at y = 6.
 *
 * @see ./dental-types.js for data shapes, ./fdi.js for tooth-type helpers
 */

import { getToothType, getRootConfig, isPrimary, isUpperArch } from './fdi';

const W = 40;
const CX = W / 2;
const Y_TOP = 6;
// Shared canvas height so every tooth renders at the same overall height and the
// surface wheels line up on one row (crown stays anchored at Y_TOP; shorter roots
// simply leave space at the apex end). Kept just above the tallest tooth to
// minimise empty space around the arch.
const CANVAS_H = 90;

const r2 = (n) => Math.round(n * 100) / 100;

// ── Per-family crown/root parameters (permanent) ──────────────────────────────
// woc  = half-width at the occlusal/incisal edge
// wcv  = half-width at the cervix (crown–root junction)
// crownH = crown height ; rootLen = root length
const PARAMS = {
  incisor: { woc: 12, wcv: 8.5, crownH: 30, rootLen: 42 },
  canine: { woc: 11, wcv: 8, crownH: 33, rootLen: 46 },
  premolar: { woc: 12.5, wcv: 10, crownH: 25, rootLen: 45 },
  molar: { woc: 16, wcv: 14, crownH: 24, rootLen: 46 },
};

// Lower anterior teeth are notably narrower than upper.
const LOWER_ANTERIOR_SCALE = { incisor: 0.72, canine: 0.9 };

// ── Occlusal / incisal edge, drawn left-corner → right-corner ─────────────────
function edgePath(type, woc, yTop) {
  const l = CX - woc;
  const r = CX + woc;
  switch (type) {
    case 'canine':
      // Single pointed cusp.
      return (
        `Q${r2(CX - woc * 0.35)},${r2(yTop - 3)} ${CX},${r2(yTop - 5.5)}` +
        ` Q${r2(CX + woc * 0.35)},${r2(yTop - 3)} ${r},${r2(yTop)}`
      );
    case 'premolar':
      // Two cusps with a central groove dip.
      return (
        `Q${r2(CX - woc * 0.5)},${r2(yTop - 3.5)} ${r2(CX - woc * 0.14)},${r2(yTop - 0.5)}` +
        ` Q${CX},${r2(yTop + 1.5)} ${r2(CX + woc * 0.14)},${r2(yTop - 0.5)}` +
        ` Q${r2(CX + woc * 0.5)},${r2(yTop - 3.5)} ${r},${r2(yTop)}`
      );
    case 'molar':
      // Three rounded cusps.
      return (
        `Q${r2(CX - woc * 0.6)},${r2(yTop - 3)} ${r2(CX - woc * 0.34)},${r2(yTop - 0.2)}` +
        ` Q${r2(CX - woc * 0.16)},${r2(yTop + 1.5)} ${r2(CX - woc * 0.05)},${r2(yTop - 2.4)}` +
        ` Q${CX},${r2(yTop - 3.6)} ${r2(CX + woc * 0.05)},${r2(yTop - 2.4)}` +
        ` Q${r2(CX + woc * 0.16)},${r2(yTop + 1.5)} ${r2(CX + woc * 0.34)},${r2(yTop - 0.2)}` +
        ` Q${r2(CX + woc * 0.6)},${r2(yTop - 3)} ${r},${r2(yTop)}`
      );
    case 'incisor':
    default:
      // Nearly straight incisal edge with a soft convexity.
      return `Q${CX},${r2(yTop - 1.5)} ${r},${r2(yTop)}`;
  }
}

// ── One tapered root prong ────────────────────────────────────────────────────
function prong(cxTop, wTop, wTip, yStart, yEnd, curve) {
  const mid = yStart + (yEnd - yStart) * 0.45;
  const near = yStart + (yEnd - yStart) * 0.85;
  return (
    `M${r2(cxTop - wTop)},${r2(yStart)}` +
    ` C${r2(cxTop - wTop - 0.4)},${r2(mid)} ${r2(cxTop - wTip + curve)},${r2(near)} ${r2(cxTop + curve)},${r2(yEnd)}` +
    ` C${r2(cxTop + wTip + curve)},${r2(near)} ${r2(cxTop + wTop + 0.4)},${r2(mid)} ${r2(cxTop + wTop)},${r2(yStart)} Z`
  );
}

// ── Build a full facial tooth ─────────────────────────────────────────────────
function buildFacial(type, { upper, primary, rootCount }) {
  let { woc, wcv, crownH, rootLen } = PARAMS[type] || PARAMS.molar;

  // Lower anteriors are narrower.
  if (!upper && LOWER_ANTERIOR_SCALE[type]) {
    woc *= LOWER_ANTERIOR_SCALE[type];
    wcv *= LOWER_ANTERIOR_SCALE[type];
  }
  // Primary teeth: shorter, more bulbous crowns and shorter, splayed roots.
  if (primary) {
    woc *= 1.02;
    wcv *= 1.14;
    crownH *= 0.82;
    rootLen *= 0.72;
  }

  const yCervix = Y_TOP + crownH;
  const overlap = 3; // roots start slightly inside the crown

  const crown =
    `M${r2(CX - wcv)},${r2(yCervix)}` +
    ` Q${r2(CX - woc - 1.6)},${r2(Y_TOP + crownH * 0.5)} ${r2(CX - woc)},${r2(Y_TOP)}` +
    ` ${edgePath(type, woc, Y_TOP)}` +
    ` Q${r2(CX + woc + 1.6)},${r2(Y_TOP + crownH * 0.5)} ${r2(CX + wcv)},${r2(yCervix)}` +
    ` Q${CX},${r2(yCervix + 2.6)} ${r2(CX - wcv)},${r2(yCervix)} Z`;

  const yStart = yCervix - overlap;
  const roots = [];
  const splay = primary ? 1.8 : 1; // primary roots splay outward more

  if (rootCount >= 3) {
    const d = wcv * 0.62;
    const outerLen = rootLen * 0.88;
    roots.push(prong(CX - d, wcv * 0.42, 1, yStart, yStart + outerLen, -3 * splay));
    roots.push(prong(CX, wcv * 0.46, 1.1, yStart, yStart + rootLen, 0));
    roots.push(prong(CX + d, wcv * 0.42, 1, yStart, yStart + outerLen, 3 * splay));
  } else if (rootCount === 2) {
    const d = wcv * 0.58;
    roots.push(prong(CX - d, wcv * 0.5, 1, yStart, yStart + rootLen * 0.96, -2.4 * splay));
    roots.push(prong(CX + d, wcv * 0.5, 1, yStart, yStart + rootLen * 0.96, 2.4 * splay));
  } else {
    roots.push(prong(CX, wcv * 0.72, 1.3, yStart, yStart + rootLen, 0));
  }

  const naturalHeight = yStart + rootLen + Y_TOP;
  return {
    crown,
    roots,
    yCervix,
    naturalHeight: r2(naturalHeight),
    viewBox: `0 0 ${W} ${CANVAS_H}`,
    height: CANVAS_H,
  };
}

// ── Cache: shape depends only on (type, upper, primary, rootCount) ────────────
const CACHE = {};

/**
 * Facial silhouette for a tooth.
 * @param {number} fdi
 * @returns {{crown:string, roots:string[], yCervix:number, viewBox:string, height:number, upper:boolean}}
 */
export function getToothShape(fdi) {
  const type = getToothType(fdi);
  const upper = isUpperArch(fdi);
  const primary = isPrimary(fdi);
  const { count: rootCount } = getRootConfig(fdi);
  const key = `${type}-${upper ? 'u' : 'l'}-${primary ? 'p' : 'a'}-${rootCount}`;
  if (!CACHE[key]) CACHE[key] = { ...buildFacial(type, { upper, primary, rootCount }), upper };
  return CACHE[key];
}
