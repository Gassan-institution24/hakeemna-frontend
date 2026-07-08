import PropTypes from 'prop-types';
import { memo } from 'react';

import { getCrownTransform, getSurfaceLabel } from '../constants/fdi';
import { getConditionColor } from '../constants/conditions';
import ToothSurface from './tooth-surface';

// ── Wheel geometry (44 × 44, centre 22,22) ────────────────────────────────────
const C = 22;
const R_OUTER = 20;
const R_INNER = 8;
const NEUTRAL = '#F4F2EC';
const RING = '#B9BEC4';

// Point on a circle. 0° = right, 90° = up (SVG y is inverted here).
function pt(r, deg) {
  const t = (deg * Math.PI) / 180;
  return [
    Math.round((C + r * Math.cos(t)) * 100) / 100,
    Math.round((C - r * Math.sin(t)) * 100) / 100,
  ];
}

// Annular sector spanning [a1, a2] (a2 > a1, ≤ 90° here), drawn CCW on the outer
// arc and CW on the inner arc.
function sector(a1, a2) {
  const o1 = pt(R_OUTER, a1);
  const o2 = pt(R_OUTER, a2);
  const i2 = pt(R_INNER, a2);
  const i1 = pt(R_INNER, a1);
  return (
    `M${o1[0]},${o1[1]} A${R_OUTER},${R_OUTER} 0 0 0 ${o2[0]},${o2[1]}` +
    ` L${i2[0]},${i2[1]} A${R_INNER},${R_INNER} 0 0 1 ${i1[0]},${i1[1]} Z`
  );
}

function circlePath(r) {
  return `M${C - r},${C} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;
}

// buccal = top, distal = right, lingual = bottom, mesial = left
const ZONES = {
  buccal: sector(45, 135),
  mesial: sector(135, 225),
  lingual: sector(225, 315),
  distal: sector(315, 405),
  occlusal: circlePath(R_INNER),
};
const ZONE_KEYS = ['buccal', 'mesial', 'lingual', 'distal', 'occlusal'];

function zoneFill(toothData, key) {
  const whole = toothData?.whole_condition;
  // A whole-tooth restoration greys the wheel out (charting happens on the tooth).
  if (whole) return NEUTRAL;
  const cond = toothData?.surfaces?.[key]?.condition;
  return cond ? getConditionColor(cond) : NEUTRAL;
}

/**
 * 5-zone surface wheel used to chart individual tooth surfaces.
 * Mirrors the tooth's quadrant so buccal/lingual/mesial/distal stay correct.
 */
function SurfaceWheel({ fdiNumber, toothData, onSurfaceClick, size, lang }) {
  const transform = getCrownTransform(fdiNumber);

  // Treatment status ring.
  const wholeStatus = toothData?.whole_status;
  const statuses = Object.values(toothData?.surfaces || {})
    .filter((s) => s?.condition)
    .map((s) => s?.status);
  const hasPlanned = wholeStatus === 'planned' || statuses.includes('planned');
  const hasWatch = !hasPlanned && (wholeStatus === 'watch' || statuses.includes('watch'));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{ display: 'block', flexShrink: 0 }}
      role="group"
      aria-label={`Tooth ${fdiNumber} surfaces`}
    >
      <g transform={transform || undefined}>
        {ZONE_KEYS.map((key) => (
          <ToothSurface
            key={key}
            fdiNumber={fdiNumber}
            surfaceKey={key}
            d={ZONES[key]}
            fill={zoneFill(toothData, key)}
            stroke={RING}
            strokeWidth={1}
            ariaLabel={`Tooth ${fdiNumber} ${getSurfaceLabel(key, fdiNumber, lang)} surface`}
            onSurfaceClick={onSurfaceClick}
          />
        ))}
      </g>

      {hasPlanned && (
        <circle cx="22" cy="22" r="21" fill="none" stroke="#1565C0" strokeWidth="1.6" strokeDasharray="4 2.5" style={{ pointerEvents: 'none' }} />
      )}
      {hasWatch && (
        <circle cx="22" cy="22" r="21" fill="none" stroke="#F9A825" strokeWidth="1.6" strokeDasharray="2.5 2" style={{ pointerEvents: 'none' }} />
      )}
    </svg>
  );
}

SurfaceWheel.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  toothData: PropTypes.object,
  onSurfaceClick: PropTypes.func.isRequired,
  size: PropTypes.number,
  lang: PropTypes.string,
};

SurfaceWheel.defaultProps = {
  toothData: null,
  size: 34,
  lang: 'en',
};

export default memo(SurfaceWheel);
