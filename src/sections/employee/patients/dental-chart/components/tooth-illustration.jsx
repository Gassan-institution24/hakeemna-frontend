import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';

import { getToothShape } from '../constants/tooth-shapes';
import { getConditionColor, getConditionStroke } from '../constants/conditions';

// Procedures that replace / hollow the natural crown rather than tint it.
const PROC_NON_CROWN = new Set(['extraction_planned', 'implant', 'root_canal', 'orthodontic']);
// Whole-tooth procedures drawn with a bold prosthetic outline.
const BOLD_OUTLINE = new Set([
  'crown_ceramic', 'crown_metal', 'crown_pfm', 'crown_zirconia',
  'bridge_abutment', 'bridge_pontic',
]);
// Diagnoses that fade / dim the tooth silhouette.
const FADED_DX = new Set(['missing', 'unerupted', 'impacted']);

const CONNECTOR_COLOR = '#C9962B'; // prosthetic outline for bridge members

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
 * Realistic facial-view tooth. Procedures colour / outline / cross out the crown,
 * diagnoses dim or mark it, and surface restorations tint the crown (the wheel
 * carries the per-surface detail). `ghost` renders a flat grey silhouette.
 *
 * Bridge members draw a gold connective bar; pontics float (no roots).
 */
function ToothIllustration({ fdiNumber, toothData, size, ghost, onSurfaceClick, bridgeRole, bridgeExtendLeft, bridgeExtendRight }) {
  const shape = getToothShape(fdiNumber);
  const { crown, roots, viewBox, height, naturalHeight, upper, yCervix } = shape;
  const displayH = (size / 40) * height;

  const dx = toothData?.whole_diagnosis;
  const proc = toothData?.whole_condition;
  const isPontic = bridgeRole === 'pontic';
  const isGone = dx === 'missing';
  const isFaded = FADED_DX.has(dx);
  const bold = (proc && BOLD_OUTLINE.has(proc)) || !!bridgeRole;

  // Crown fill: a restoration / prosthetic procedure colours the crown.
  const crownFilled = proc && !PROC_NON_CROWN.has(proc);

  // First surface restoration → subtle crown tint (detail lives in the wheel).
  const surfaceTintDef = (() => {
    if (crownFilled) return null;
    const s = toothData?.surfaces || {};
    const found = Object.values(s).find((v) => v?.condition);
    return found ? found.condition : null;
  })();
  // Surface caries → soft red hint on the crown.
  const hasCaries = Object.values(toothData?.surfaces || {}).some((v) => v?.diagnosis === 'caries');

  const enamelId = `il-enamel-${fdiNumber}`;
  const dentinId = `il-dentin-${fdiNumber}`;
  const shineId = `il-shine-${fdiNumber}`;
  const crownFill = crownFilled ? getConditionColor(proc) : `url(#${enamelId})`;
  let crownStroke = '#B7A98C';
  if (bold) crownStroke = bridgeRole ? CONNECTOR_COLOR : '#37474F';
  const crownStrokeW = bold ? 1.8 : 0.9;

  let groupOpacity = 1;
  if (isGone) groupOpacity = 0.32;
  else if (isFaded) groupOpacity = 0.5;

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

  // The continuous bridge beam is drawn as a DOM overlay in <DentalArch> (so it
  // spans teeth without SVG-clipping seams). Here we only float pontics and use
  // the prosthetic outline; bridgeExtend* are accepted for API compatibility.

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
      style={{ display: 'block', overflow: 'visible' }}
      role="button"
      tabIndex={0}
      aria-label={`Tooth ${fdiNumber}${dx ? ` — ${dx.replace(/_/g, ' ')}` : ''}${proc ? ` — ${proc.replace(/_/g, ' ')}` : ''}`}
      onClick={activate}
      onKeyDown={onKey}
    >
      <defs>
        <linearGradient id={enamelId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FBF6EC" />
          <stop offset="82%" stopColor="#ECE0C8" />
          <stop offset="100%" stopColor="#DDCBA8" />
        </linearGradient>
        <linearGradient id={dentinId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1E6CF" />
          <stop offset="55%" stopColor="#E4D0AC" />
          <stop offset="100%" stopColor="#CBB183" />
        </linearGradient>
        {/* Soft specular highlight on the crown */}
        <radialGradient id={shineId} cx="0.38" cy="0.28" r="0.75">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        transform={upper ? `scale(1,-1) translate(0,-${height})` : undefined}
        opacity={groupOpacity}
        style={{ cursor: 'pointer' }}
      >
        {/* Roots (suppressed for pontics — they float on the bridge) */}
        {!isPontic && roots.map((d) => (
          <g key={d}>
            <path d={d} fill={`url(#${dentinId})`} stroke="#C4A882" strokeWidth="0.8" />
            {/* subtle central shading for depth */}
            <path d={d} fill="none" stroke="#B99C6E" strokeWidth="0.35" opacity="0.4" />
          </g>
        ))}

        {/* Cervical shadow just under the crown for a rounded look */}
        {!crownFilled && (
          <path d={crown} fill="none" stroke="#C9B78F" strokeWidth="2.4" opacity="0.25" />
        )}

        {/* Crown */}
        <path d={crown} fill={crownFill} stroke={crownStroke} strokeWidth={crownStrokeW} />

        {/* Enamel shine (only on natural / lightly tinted crowns) */}
        {!crownFilled && <path d={crown} fill={`url(#${shineId})`} pointerEvents="none" />}

        {/* Surface-restoration tint */}
        {surfaceTintDef && (
          <path
            d={crown}
            fill={getConditionColor(surfaceTintDef)}
            opacity="0.5"
            stroke={getConditionStroke(surfaceTintDef)}
            strokeWidth="0.6"
          />
        )}

        {/* Caries hint */}
        {hasCaries && !crownFilled && (
          <circle cx="20" cy={yCervix - 8} r="3.2" fill="#C62828" opacity="0.5" />
        )}

        {/* Whole-tooth procedure glyphs (root canal, implant, extraction, veneer) */}
        {proc && <Overlay condition={proc} height={naturalHeight} />}
        {/* Whole-tooth diagnosis glyphs (missing X) */}
        {dx === 'missing' && <Overlay condition="missing" height={naturalHeight} />}
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
  bridgeRole: PropTypes.oneOf(['abutment', 'pontic']),
  bridgeExtendLeft: PropTypes.bool,
  bridgeExtendRight: PropTypes.bool,
};

ToothIllustration.defaultProps = {
  toothData: null,
  size: 40,
  ghost: false,
  onSurfaceClick: () => {},
  bridgeRole: null,
  bridgeExtendLeft: false,
  bridgeExtendRight: false,
};

export default memo(ToothIllustration);
