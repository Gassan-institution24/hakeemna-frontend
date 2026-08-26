import PropTypes from 'prop-types';
import { memo, useRef, useMemo, useEffect, useCallback } from 'react';

import { getToothShape } from '../constants/tooth-shapes';
import getActiveLayers, { VIEW_LAYERS, MANAGED_LAYERS } from '../constants/tooth-layers';
import { getToothScale, getToothAspect, getToothArtwork } from '../constants/tooth-templates';

// Diagnoses that fade the tooth silhouette.
const FADED_DX = new Set(['missing', 'unerupted', 'impacted']);

const CONNECTOR_COLOR = '#C9962B'; // prosthetic outline for bridge members

/**
 * Anatomical facial-view tooth, drawn with React-Odontogram-Modul artwork
 * (see ../assets/teeth/NOTICE.md).
 *
 * The artwork is a layered clinical illustration: every switchable layer is
 * authored off, and `getActiveLayers()` turns on only what this patient's chart
 * data specifies. Painting, selection and the tooth dialog are unchanged — this
 * component still just reports clicks through `onSurfaceClick`.
 *
 * `ghost` renders the flat grey silhouette from `tooth-shapes.js`, which stays
 * cheap for the out-of-scope teeth flanking a primary arch.
 */
function ToothIllustration({
  fdiNumber,
  toothData,
  size,
  ghost,
  viewOptions,
  onSurfaceClick,
  bridgeRole,
  bridgeExtendLeft,
  bridgeExtendRight,
}) {
  const hostRef = useRef(null);
  const shape = getToothShape(fdiNumber);
  const { crown, roots, viewBox, height, upper } = shape;

  const occlusal = Boolean(viewOptions?.occlusal);
  // Bone defaults off (the chart has always drawn teeth without it); pulp defaults
  // on, matching how the artwork has rendered since the switch to it.
  const showBone = Boolean(viewOptions?.showBone);
  const showPulp = viewOptions?.showPulp !== false;

  const markup = ghost ? null : getToothArtwork(fdiNumber, occlusal);
  const scale = getToothScale(fdiNumber);
  const displaySize = Math.round(size * scale);

  const dx = toothData?.whole_diagnosis;
  const proc = toothData?.whole_condition;
  const isPontic = bridgeRole === 'pontic';

  // Which artwork layers this tooth's data switches on.
  const activeLayers = useMemo(() => getActiveLayers(toothData), [toothData]);

  // The artwork is injected as markup, so layer state is applied to the live DOM
  // rather than through React. Queries are scoped to this instance's root, so the
  // template ids repeated across teeth cannot interfere with each other.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || ghost) return;
    const svg = host.querySelector('svg');
    if (!svg) return;

    // The asset carries no intrinsic size, so it is stretched to the tile here.
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';

    // Every managed layer is written on each pass — not just the active ones —
    // so clearing a condition removes its artwork rather than leaving it behind.
    svg.querySelectorAll('[data-active]').forEach((node) => {
      const { id } = node;
      if (!id || !MANAGED_LAYERS.has(id)) return;
      node.setAttribute('data-active', activeLayers.has(id) ? '1' : '0');
    });

    // View toggles are applied *after* the data pass so they win. They are display
    // preferences, never clinical findings.
    const setLayers = (ids, on) =>
      ids.forEach((id) => {
        const node = svg.querySelector(`[id="${id}"]`);
        if (node) node.setAttribute('data-active', on ? '1' : '0');
      });

    // Bone and gum are not data-driven in Hakeemna, so the toggle owns them.
    setLayers(VIEW_LAYERS.bone, showBone);

    // Pulp *is* data-driven — the record decides healthy vs inflamed. The toggle
    // may therefore only hide it; switching it "on" would light up both variants
    // at once and contradict the tooth's own data.
    if (!showPulp) setLayers(VIEW_LAYERS.pulp, false);
  }, [activeLayers, markup, ghost, showBone, showPulp]);

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

  // Ghost silhouette — flat grey, no interaction. Unchanged from before.
  if (ghost) {
    const displayH = (size / 40) * height;
    return (
      <svg
        width={size}
        height={displayH}
        viewBox={viewBox}
        style={{ display: 'block', opacity: 0.5 }}
        aria-hidden="true"
      >
        <g
          transform={upper ? `scale(1,-1) translate(0,-${height})` : undefined}
          fill="#D6D9DE"
          stroke="#C2C7CE"
          strokeWidth="0.8"
        >
          {roots.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={crown} />
        </g>
      </svg>
    );
  }

  let groupOpacity = 1;
  if (dx === 'missing') groupOpacity = 0.32;
  else if (FADED_DX.has(dx)) groupOpacity = 0.5;

  const label = `Tooth ${fdiNumber}${dx ? ` — ${dx.replace(/_/g, ' ')}` : ''}${
    proc ? ` — ${proc.replace(/_/g, ' ')}` : ''
  }`;

  return (
    <div
      ref={hostRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={activate}
      onKeyDown={onKey}
      style={{
        display: 'block',
        width: displaySize,
        height: Math.round(displaySize * getToothAspect(fdiNumber, occlusal)),
        cursor: 'pointer',
        opacity: groupOpacity,
        // Upper teeth point root-up; pontics float without roots, matching the
        // previous renderer.
        transform: upper ? 'scaleY(-1)' : undefined,
        lineHeight: 0,
        // Bridge members keep the prosthetic outline cue.
        outline: bridgeRole ? `1.5px solid ${CONNECTOR_COLOR}` : 'none',
        outlineOffset: -1,
        clipPath: isPontic ? 'inset(0 0 38% 0)' : undefined,
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markup || '' }}
    />
  );
}

ToothIllustration.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  toothData: PropTypes.object,
  size: PropTypes.number,
  ghost: PropTypes.bool,
  // Chart-level display toggles: { occlusal, showBone, showPulp }.
  viewOptions: PropTypes.object,
  onSurfaceClick: PropTypes.func,
  bridgeRole: PropTypes.oneOf(['abutment', 'pontic']),
  bridgeExtendLeft: PropTypes.bool,
  bridgeExtendRight: PropTypes.bool,
};

ToothIllustration.defaultProps = {
  toothData: null,
  size: 40,
  ghost: false,
  viewOptions: null,
  onSurfaceClick: () => {},
  bridgeRole: null,
  bridgeExtendLeft: false,
  bridgeExtendRight: false,
};

export default memo(ToothIllustration);
