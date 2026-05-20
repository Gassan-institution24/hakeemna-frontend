import PropTypes from 'prop-types';
import { useState } from 'react';

import { getCrownTransform, getSurfaceLabel, isAnterior, isUpperArch } from '../constants/fdi';
import { getConditionColor, getConditionStroke } from '../constants/conditions';

// ── Crown geometry (44 × 44 viewBox, 10px inset) ────────────────────────────
// Buccal at TOP, Lingual at BOTTOM, Mesial at LEFT, Distal at RIGHT
const SURFACE_POINTS = {
  buccal: '0,0 44,0 34,10 10,10',
  lingual: '10,34 34,34 44,44 0,44',
  mesial: '0,0 10,10 10,34 0,44',
  distal: '44,0 34,10 34,34 44,44',
  occlusal: '10,10 34,10 34,34 10,34',
};

const SURFACE_KEYS = ['buccal', 'lingual', 'mesial', 'distal', 'occlusal'];

// ── Color helpers ─────────────────────────────────────────────────────────────
function getSurfaceFill(toothData, surfaceKey) {
  const whole = toothData?.whole_condition;
  if (whole) return getConditionColor(whole);
  const cond = toothData?.surfaces?.[surfaceKey]?.condition;
  return cond ? getConditionColor(cond) : '#FFFFFF';
}

function getSurfaceStroke(toothData, surfaceKey) {
  const whole = toothData?.whole_condition;
  if (whole) return getConditionStroke(whole);
  const cond = toothData?.surfaces?.[surfaceKey]?.condition;
  return cond ? getConditionStroke(cond) : '#BDBDBD';
}

// ── Overlay rendering ─────────────────────────────────────────────────────────
function ConditionOverlay({ condition }) {
  if (condition === 'missing') {
    return (
      <>
        <line x1="8" y1="8" x2="36" y2="36" stroke="#9E9E9E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="8" x2="8" y2="36" stroke="#9E9E9E" strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }
  if (condition === 'extraction_planned') {
    return (
      <>
        <line x1="8" y1="8" x2="36" y2="36" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="8" x2="8" y2="36" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }
  if (condition === 'root_canal') {
    return (
      <circle cx="22" cy="22" r="6" fill="none" stroke="#E65100" strokeWidth="2" strokeDasharray="3 2" />
    );
  }
  if (condition === 'implant') {
    return (
      <polygon
        points="22,10 30,32 14,32"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    );
  }
  if (condition === 'bridge_abutment' || condition === 'bridge_pontic') {
    return (
      <>
        <line x1="0" y1="22" x2="44" y2="22" stroke="#F57C00" strokeWidth="2.5" />
        <line x1="0" y1="20" x2="44" y2="20" stroke="#F57C00" strokeWidth="1" />
        <line x1="0" y1="24" x2="44" y2="24" stroke="#F57C00" strokeWidth="1" />
      </>
    );
  }
  if (condition === 'orthodontic') {
    return (
      <rect x="8" y="18" width="28" height="8" rx="4" fill="none" stroke="#1B5E20" strokeWidth="2" />
    );
  }
  return null;
}

ConditionOverlay.propTypes = { condition: PropTypes.string };

// ── Main tooth crown ──────────────────────────────────────────────────────────
export default function ToothCrown({
  fdiNumber,
  toothData,
  onSurfaceClick,
  isSelected,
  isHighlighted,
  activeCondition,
  size,
}) {
  const [hoveredSurface, setHoveredSurface] = useState(null);

  const transform = getCrownTransform(fdiNumber);
  const anterior = isAnterior(fdiNumber);
  const upper = isUpperArch(fdiNumber);
  const wholeCondition = toothData?.whole_condition;
  const isMissing = wholeCondition === 'missing';

  const scale = size / 44;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{ display: 'block', cursor: 'pointer', flexShrink: 0 }}
      aria-label={`Tooth ${fdiNumber}`}
    >
      {/* ── Surfaces group (quadrant-oriented) ── */}
      <g transform={transform || undefined} opacity={isMissing ? 0.45 : 1}>
        {SURFACE_KEYS.map((key) => {
          const isOcclusal = key === 'occlusal';
          const fill = getSurfaceFill(toothData, key);
          const stroke = getSurfaceStroke(toothData, key);
          const isHovered = hoveredSurface === key;

          return (
            <g key={key}>
              <polygon
                points={SURFACE_POINTS[key]}
                fill={fill}
                stroke="#888"
                strokeWidth="0.4"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSurface(key)}
                onMouseLeave={() => setHoveredSurface(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSurfaceClick(fdiNumber, key);
                }}
              />
              {/* Hover highlight (pointer-events none so it doesn't capture clicks) */}
              {isHovered && (
                <polygon
                  points={SURFACE_POINTS[key]}
                  fill="rgba(255,255,255,0.35)"
                  stroke="none"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </g>
          );
        })}
      </g>

      {/* ── Whole-tooth overlays (not transformed — always centered) ── */}
      {wholeCondition && (
        <g style={{ pointerEvents: 'none' }}>
          <ConditionOverlay condition={wholeCondition} />
        </g>
      )}

      {/* ── Outer border ── */}
      <rect
        x="0.5"
        y="0.5"
        width="43"
        height="43"
        rx="3"
        ry="3"
        fill="none"
        stroke="#757575"
        strokeWidth="0.8"
        style={{ pointerEvents: 'none' }}
      />

      {/* ── Selection ring ── */}
      {isSelected && (
        <rect
          x="0"
          y="0"
          width="44"
          height="44"
          rx="3"
          ry="3"
          fill="none"
          stroke="#1976D2"
          strokeWidth="2.5"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* ── Bulk-select highlight ── */}
      {isHighlighted && !isSelected && (
        <rect
          x="0"
          y="0"
          width="44"
          height="44"
          rx="3"
          ry="3"
          fill="rgba(25,118,210,0.12)"
          stroke="#1976D2"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* ── Active condition preview dot (occlusal center) ── */}
      {activeCondition && activeCondition !== 'healthy' && hoveredSurface && (
        <circle
          cx="22"
          cy="22"
          r="3"
          fill={getConditionColor(activeCondition)}
          stroke={getConditionStroke(activeCondition)}
          strokeWidth="1"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </svg>
  );
}

ToothCrown.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  toothData: PropTypes.object,
  onSurfaceClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  activeCondition: PropTypes.string,
  size: PropTypes.number,
};

ToothCrown.defaultProps = {
  size: 44,
  isSelected: false,
  isHighlighted: false,
  activeCondition: null,
  toothData: null,
};
