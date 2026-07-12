import PropTypes from 'prop-types';
import { Fragment, useRef, useState, useCallback, useLayoutEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import SingleTooth from './single-tooth';

const MIDLINE_COLOR = '#E0E0E0';
const GAP = 2; // px between teeth
const BEAM_COLOR = '#B8860B';
const BEAM_EDGE = '#7A5A0A';
const PREVIEW_COLOR = '#1976D2';

export default function DentalArch({
  teeth,
  teethMap,
  isUpper,
  label,
  midlineAfterIndex,
  onSurfaceClick,
  onDoubleClick,
  selectedTeeth,
  multiSelect,
  dimmed,
  leadingGhosts,
  trailingGhosts,
  lang,
  crownSize,
  bridgeMap,
  bridges,
}) {
  const align = isUpper ? 'flex-end' : 'flex-start';

  // ── Connecting lines: measure the real tooth positions so a bridge (or a live
  //    multi-selection) is joined by an unmistakable line across the teeth. ─────
  const wrapRef = useRef(null);
  const cellRefs = useRef({});
  const [beams, setBeams] = useState([]);
  const [preview, setPreview] = useState(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      setBeams([]);
      setPreview(null);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const illustrationH = (crownSize / 40) * 90;
    const wheelH = Math.round(crownSize * 0.82);
    // Vertical position of the connecting line: on the crowns, near the gum.
    const lineY = (cellTop) =>
      isUpper ? cellTop + illustrationH * 0.62 : cellTop + wheelH + 3 + illustrationH * 0.34;

    const spanFor = (fdis) => {
      const rects = fdis
        .map((f) => cellRefs.current[f])
        .filter(Boolean)
        .map((el) => el.getBoundingClientRect());
      if (rects.length < 2) return null;
      const left = Math.min(...rects.map((r) => r.left)) - wrapRect.left;
      const right = Math.max(...rects.map((r) => r.right)) - wrapRect.left;
      const cellTop = Math.min(...rects.map((r) => r.top)) - wrapRect.top;
      const centers = rects.map((r) => (r.left + r.right) / 2 - wrapRect.left);
      return { left, width: right - left, top: lineY(cellTop), centers };
    };

    // Committed bridges
    if (dimmed) {
      setBeams([]);
    } else {
      const bs = [];
      (bridges || []).forEach((b) => {
        const members = (b.teeth || []).filter((f) => teeth.includes(f));
        const s = spanFor(members);
        if (s) bs.push({ id: String(b._id), ...s });
      });
      setBeams(bs);
    }

    // Live multi-selection preview
    if (multiSelect && !dimmed) {
      const sel = teeth.filter((f) => selectedTeeth.has(f));
      setPreview(spanFor(sel));
    } else {
      setPreview(null);
    }
  }, [bridges, teeth, crownSize, isUpper, dimmed, multiSelect, selectedTeeth]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, teethMap]);

  const renderGhost = (fdi) => (
    <SingleTooth
      key={`ghost-${fdi}`}
      fdiNumber={fdi}
      toothData={null}
      onSurfaceClick={onSurfaceClick}
      onDoubleClick={onDoubleClick}
      ghost
      lang={lang}
      crownSize={crownSize}
    />
  );

  // Position via inline `style` (not `sx`) so stylis-plugin-rtl does NOT flip
  // `left` → `right` under the Arabic (RTL) theme. The offsets from measure()
  // are already physical/LTR, so the overlays must stay left-anchored.
  const renderDot = (cx, top, color, edge, key) => (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: cx - 5,
        top: top - 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        border: `1.5px solid ${edge}`,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );

  return (
    <Box>
      {isUpper && label && (
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mb: 0.5, letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
      )}

      <Box ref={wrapRef} sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems={align} justifyContent="center" sx={{ gap: `${GAP}px`, px: 1 }}>
          {leadingGhosts.map(renderGhost)}

          {teeth.map((fdi, idx) => {
            const bridge = bridgeMap[fdi] || null;
            return (
              <Box
                key={fdi}
                ref={(el) => {
                  cellRefs.current[fdi] = el;
                }}
                sx={{ display: 'flex', alignItems: align }}
              >
                <SingleTooth
                  fdiNumber={fdi}
                  toothData={teethMap[fdi] || null}
                  onSurfaceClick={onSurfaceClick}
                  onDoubleClick={onDoubleClick}
                  isSelected={multiSelect && selectedTeeth.has(fdi)}
                  isHighlighted={!multiSelect && selectedTeeth.has(fdi)}
                  ghost={dimmed}
                  lang={lang}
                  crownSize={crownSize}
                  bridgeRole={bridge?.role}
                  bridgeExtendLeft={bridge?.extendLeft}
                  bridgeExtendRight={bridge?.extendRight}
                />

                {/* Midline divider */}
                {idx === midlineAfterIndex && (
                  <Box
                    sx={{
                      width: 2,
                      backgroundColor: MIDLINE_COLOR,
                      mx: 0.5,
                      borderRadius: 1,
                      alignSelf: 'stretch',
                    }}
                  />
                )}
              </Box>
            );
          })}

          {trailingGhosts.map(renderGhost)}
        </Stack>

        {/* Committed bridge connecting lines (inline style → RTL-safe left) */}
        {beams.map((beam) => (
          <Fragment key={beam.id}>
            <div
              style={{
                position: 'absolute',
                left: beam.left,
                top: beam.top,
                width: beam.width,
                height: 6,
                transform: 'translateY(-50%)',
                backgroundColor: BEAM_COLOR,
                borderRadius: 3,
                border: `1px solid ${BEAM_EDGE}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />
            {beam.centers.map((cx, i) =>
              renderDot(cx, beam.top, BEAM_COLOR, BEAM_EDGE, `${beam.id}-${i}`)
            )}
          </Fragment>
        ))}

        {/* Live multi-selection preview line (inline style → RTL-safe left) */}
        {preview && (
          <>
            <div
              style={{
                position: 'absolute',
                left: preview.left,
                top: preview.top,
                width: preview.width,
                height: 0,
                transform: 'translateY(-50%)',
                borderTop: `3px dashed ${PREVIEW_COLOR}`,
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />
            {preview.centers.map((cx, i) =>
              renderDot(cx, preview.top, PREVIEW_COLOR, '#0D47A1', `prev-${i}`)
            )}
          </>
        )}
      </Box>

      {!isUpper && label && (
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 0.5, letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

DentalArch.propTypes = {
  teeth: PropTypes.arrayOf(PropTypes.number).isRequired,
  teethMap: PropTypes.object.isRequired,
  isUpper: PropTypes.bool,
  label: PropTypes.string,
  midlineAfterIndex: PropTypes.number,
  onSurfaceClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  selectedTeeth: PropTypes.instanceOf(Set),
  multiSelect: PropTypes.bool,
  dimmed: PropTypes.bool,
  leadingGhosts: PropTypes.arrayOf(PropTypes.number),
  trailingGhosts: PropTypes.arrayOf(PropTypes.number),
  lang: PropTypes.string,
  crownSize: PropTypes.number,
  bridgeMap: PropTypes.object,
  bridges: PropTypes.array,
};

DentalArch.defaultProps = {
  isUpper: true,
  label: '',
  midlineAfterIndex: 7,
  selectedTeeth: new Set(),
  multiSelect: false,
  dimmed: false,
  leadingGhosts: [],
  trailingGhosts: [],
  lang: 'en',
  crownSize: 44,
  bridgeMap: {},
  bridges: [],
};
