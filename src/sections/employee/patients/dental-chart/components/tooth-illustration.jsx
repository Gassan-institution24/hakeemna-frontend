import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';

import { getToothShape } from '../constants/tooth-shapes';
import { getCondition, getConditionColor, getConditionStroke } from '../constants/conditions';

// Conditions that remove / replace the natural crown rather than restore it.
const NON_CROWN_FILL = new Set(['missing', 'extraction_planned', 'implant', 'root_canal', 'orthodontic', 'unerupted', 'impacted']);
// Whole-tooth conditions drawn with a bold prosthetic outline.
const BOLD_OUTLINE = new Set(['crown_ceramic', 'crown_metal', 'crown_pfm', 'crown_zirconia', 'bridge_abutment', 'bridge_pontic']);

// ── Whole-tooth glyph overlays (drawn in tooth-local coords) ──────────────────
function Overlay({ condition, height }) {
  const midRoot = height * 0.68;
  switch (condition) {
    case 'root_canal':
      return <line x1="20" y1="34" x2="20" y2={height - 6} stroke="#E65100" strokeWidth="2" strokeLinecap="round" />;
    case 'implant':
      return (
        <g stroke="#2E7D32" strokeWidth="1.6" strokeLinecap="round">
          <line x1="14" y1={midRoot - 10} x2="26" y2={midRoot - 10} />
          <line x1="15" y1={midRoot - 4} x2="25" y2={midRoot - 4} />
          <line x1="16" y1={midRoot + 2} x2="24" y2={midRoot + 2} />
          <line x1="17" y1={midRoot + 8} x2="23" y2={midRoot + 8} />
        </g>
      );
    case 'veneer':
      return <rect x="10" y="8" width="20" height="22" rx="5" fill="none" stroke="#7B1FA2" strokeWidth="1.8" />;
    case 'missing':
    case 'extraction_planned': {
      const col = condition === 'missing' ? '#9E9E9E' : '#C62828';
      return (
        <g stroke={col} strokeWidth="2.6" strokeLinecap="round">
          <line x1="9" y1="10" x2="31" y2="34" />
          <line x1="31" y1="10" x2="9" y2="34" />
        </g>
      );
    }
    default:
      return null;
  }
}

Overlay.propTypes = { condition: PropTypes.string, height: PropTypes.number };

/**
 * Realistic facial-view tooth. Whole-tooth conditions colour / outline / cross
 * out the crown; surface restorations tint the crown (the wheel carries detail).
 * `ghost` renders a flat, non-interactive grey silhouette.
 */
function ToothIllustration({ fdiNumber, toothData, size, ghost, onSurfaceClick }) {
  const shape = getToothShape(fdiNumber);
  const { crown, roots, viewBox, height, naturalHeight, upper } = shape;
  const displayH = (size / 40) * height;

  const whole = toothData?.whole_condition;
  const wholeDef = whole ? getCondition(whole) : null;
  const isMissing = whole === 'missing' || whole === 'extraction_planned';
  const bold = whole && BOLD_OUTLINE.has(whole);

  // Crown fill: prosthetic/restorative whole condition colours the crown.
  const crownFilled = whole && !NON_CROWN_FILL.has(whole);

  // First surface restoration → subtle crown tint (detail lives in the wheel).
  const surfaceTint = (() => {
    if (crownFilled) return null;
    const s = toothData?.surfaces || {};
    const found = Object.values(s).find((v) => v?.condition && v.condition !== 'healthy');
    return found ? getConditionColor(found.condition) : null;
  })();

  const enamelId = `il-enamel-${fdiNumber}`;
  const dentinId = `il-dentin-${fdiNumber}`;
  const crownFill = crownFilled ? getConditionColor(whole) : `url(#${enamelId})`;
  const crownStroke = bold ? '#37474F' : '#B7A98C';
  const crownStrokeW = bold ? 1.8 : 0.9;

  const activate = useCallback(
    (e) => {
      e.stopPropagation();
      onSurfaceClick(fdiNumber, 'whole');
    },
    [fdiNumber, onSurfaceClick]
  );
  const onKey = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(e);
      }
    },
    [activate]
  );

  // Ghost silhouette — flat grey, no interaction.
  if (ghost) {
    return (
      <svg width={size} height={displayH} viewBox={viewBox} style={{ display: 'block', opacity: 0.5 }} aria-hidden="true">
        <g transform={upper ? `scale(1,-1) translate(0,-${height})` : undefined} fill="#D6D9DE" stroke="#C2C7CE" strokeWidth="0.8">
          {roots.map((d) => <path key={d} d={d} />)}
          <path d={crown} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={displayH}
      viewBox={viewBox}
      style={{ display: 'block' }}
      role="button"
      tabIndex={0}
      aria-label={`Tooth ${fdiNumber}${whole ? ` — ${whole.replace(/_/g, ' ')}` : ''}`}
      onClick={activate}
      onKeyDown={onKey}
    >
      <defs>
        <linearGradient id={enamelId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FBF6EC" />
          <stop offset="100%" stopColor="#EDE3CF" />
        </linearGradient>
        <linearGradient id={dentinId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1E6CF" />
          <stop offset="100%" stopColor="#D8C4A0" />
        </linearGradient>
      </defs>

      <g
        transform={upper ? `scale(1,-1) translate(0,-${height})` : undefined}
        opacity={isMissing ? 0.4 : 1}
        style={{ cursor: 'pointer' }}
      >
        {/* Roots */}
        {roots.map((d) => (
          <path key={d} d={d} fill={`url(#${dentinId})`} stroke="#C4A882" strokeWidth="0.8" />
        ))}
        {/* Crown */}
        <path d={crown} fill={crownFill} stroke={crownStroke} strokeWidth={crownStrokeW} />
        {/* Surface-restoration tint */}
        {surfaceTint && <path d={crown} fill={surfaceTint} opacity="0.5" stroke={getConditionStroke(Object.values(toothData?.surfaces || {}).find((v) => v?.condition)?.condition)} strokeWidth="0.6" />}
        {/* Whole-tooth glyphs */}
        {whole && <Overlay condition={whole} height={naturalHeight} />}
      </g>
    </svg>
  );
}

ToothIllustration.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  toothData: PropTypes.object,
  size: PropTypes.number,
  ghost: PropTypes.bool,
  onSurfaceClick: PropTypes.func,
};

ToothIllustration.defaultProps = {
  toothData: null,
  size: 40,
  ghost: false,
  onSurfaceClick: () => {},
};

export default memo(ToothIllustration);
