import { memo } from 'react';
import PropTypes from 'prop-types';

import ToothSurface from './tooth-surface';
import { getSurfaceLabel, getCrownTransform } from '../constants/fdi';
import { getCondition, getConditionColor, getConditionStroke } from '../constants/conditions';

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

// Used when a diagnosis is not in any loaded catalogue (e.g. the table has not loaded yet), so a
// diagnosed part is still visibly marked instead of falling back to white/grey.
const DIAGNOSIS_FALLBACK = '#0288D1';

const hexToRgba = (hex, alpha) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`; // eslint-disable-line no-bitwise
};

// Strong colour of a part's diagnosis — the catalogue stroke, which stays visible at chart size
// where many diagnosis fills (e.g. the ICD table's pale blue) do not.
const diagnosisStroke = (id) => (getCondition(id) ? getConditionStroke(id) : DIAGNOSIS_FALLBACK);

// Every part shows its own state, even when the whole tooth also carries a diagnosis or a
// restoration — a diagnosed part must never be greyed out. A restoration fills the part with its
// colour; a diagnosis-only part is tinted with the diagnosis colour.
function zoneFill(toothData, key) {
  const surf = toothData?.surfaces?.[key];
  if (surf?.condition) return getConditionColor(surf.condition);
  if (surf?.diagnosis) return hexToRgba(diagnosisStroke(surf.diagnosis), 0.45);
  return NEUTRAL;
}

/**
 * 5-zone surface wheel used to chart individual tooth surfaces.
 * Mirrors the tooth's quadrant so buccal/lingual/mesial/distal stay correct.
 */
function SurfaceWheel({
  fdiNumber,
  toothData,
  onSurfaceClick,
  size,
  lang,
  selected,
  edited,
}) {
  const transform = getCrownTransform(fdiNumber);

  // Treatment status ring. 'watch' is no longer a treatment status — only the
  // "Watch" *diagnosis* still draws the dotted amber ring.
  const wholeStatus = toothData?.whole_status;
  const surfaceVals = Object.values(toothData?.surfaces || {}).filter(
    (s) => s?.condition || s?.diagnosis
  );
  const statuses = surfaceVals.map((s) => s?.status);
  const hasWatchDx =
    surfaceVals.some((s) => s?.diagnosis === 'watch') || toothData?.whole_diagnosis === 'watch';
  const hasPlanned = wholeStatus === 'planned' || statuses.includes('planned');
  const hasCompleted =
    !hasPlanned && (wholeStatus === 'completed' || statuses.includes('completed'));
  const hasWatch = !hasPlanned && !hasCompleted && hasWatchDx;

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

        {/* Diagnosed parts get an outline in the diagnosis colour, so the finding stays visible
            even under a restoration's fill. */}
        {ZONE_KEYS.filter((key) => toothData?.surfaces?.[key]?.diagnosis).map((key) => (
          <path
            key={`dx-${key}`}
            d={ZONES[key]}
            fill="none"
            stroke={diagnosisStroke(toothData.surfaces[key].diagnosis)}
            strokeWidth="2"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {/* Tooth dialog only: parts changed but not saved yet, then the part being edited. */}
        {(edited || []).map((key) => (
          <path
            key={`edited-${key}`}
            d={ZONES[key]}
            fill="none"
            stroke="#F57C00"
            strokeWidth="1.6"
            strokeDasharray="2 1.4"
            style={{ pointerEvents: 'none' }}
          />
        ))}
        {selected && ZONES[selected] && (
          <path
            d={ZONES[selected]}
            fill="rgba(25,118,210,0.12)"
            stroke="#1976D2"
            strokeWidth="1.8"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </g>

      {hasPlanned && (
        <circle
          cx="22"
          cy="22"
          r="21"
          fill="none"
          stroke="#1565C0"
          strokeWidth="1.6"
          strokeDasharray="4 2.5"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {hasCompleted && (
        <circle
          cx="22"
          cy="22"
          r="21"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="1.6"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {hasWatch && (
        <circle
          cx="22"
          cy="22"
          r="21"
          fill="none"
          stroke="#F9A825"
          strokeWidth="1.6"
          strokeDasharray="2.5 2"
          style={{ pointerEvents: 'none' }}
        />
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
  selected: PropTypes.string,
  edited: PropTypes.arrayOf(PropTypes.string),
};

SurfaceWheel.defaultProps = {
  toothData: null,
  size: 34,
  lang: 'en',
  selected: null,
  edited: null,
};

export default memo(SurfaceWheel);
