import { memo } from 'react';
import PropTypes from 'prop-types';

import { Box, Tooltip, useTheme } from '@mui/material';

import SurfaceWheel from './surface-wheel';
import ToothIllustration from './tooth-illustration';
import { isUpperArch, getSurfaceLabel } from '../constants/fdi';
import { toothTileSx, getOdontogramPalette } from '../constants/odontogram-theme';

// Grey placeholder wheel for out-of-scope / dimmed teeth.
function GhostWheel({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{ display: 'block', opacity: 0.5 }}
      aria-hidden="true"
    >
      <circle cx="22" cy="22" r="20" fill="#EDEFF2" stroke="#C2C7CE" strokeWidth="1" />
      <circle cx="22" cy="22" r="8" fill="none" stroke="#C2C7CE" strokeWidth="1" />
      <line x1="7.5" y1="7.5" x2="16.3" y2="16.3" stroke="#C2C7CE" strokeWidth="1" />
      <line x1="36.5" y1="7.5" x2="27.7" y2="16.3" stroke="#C2C7CE" strokeWidth="1" />
      <line x1="7.5" y1="36.5" x2="16.3" y2="27.7" stroke="#C2C7CE" strokeWidth="1" />
      <line x1="36.5" y1="36.5" x2="27.7" y2="27.7" stroke="#C2C7CE" strokeWidth="1" />
    </svg>
  );
}
GhostWheel.propTypes = { size: PropTypes.number.isRequired };

function SingleTooth({
  fdiNumber,
  toothData,
  onSurfaceClick,
  onDoubleClick,
  isSelected,
  isHighlighted,
  ghost,
  hidden,
  viewOptions,
  lang,
  crownSize,
  bridgeRole,
  bridgeExtendLeft,
  bridgeExtendRight,
}) {
  const theme = useTheme();
  const palette = getOdontogramPalette(theme.palette.mode);
  const upper = isUpperArch(fdiNumber);
  const wheelSize = Math.round(crownSize * 0.82);
  const wholeCondition = toothData?.whole_condition;
  const wholeDiagnosis = toothData?.whole_diagnosis;

  const buildTooltip = () => {
    const parts = [];
    if (wholeDiagnosis) parts.push(wholeDiagnosis.replace(/_/g, ' '));
    if (wholeCondition) parts.push(wholeCondition.replace(/_/g, ' '));
    const surfaces = toothData?.surfaces || {};
    Object.entries(surfaces).forEach(([surface, data]) => {
      const id = data?.condition || data?.diagnosis;
      if (id && id !== 'healthy') {
        parts.push(`${getSurfaceLabel(surface, fdiNumber, lang)}: ${id.replace(/_/g, ' ')}`);
      }
    });
    return parts.length ? parts.join(' | ') : `Tooth ${fdiNumber}`;
  };

  let selectionOutline = 'none';
  if (isSelected) selectionOutline = `2px solid ${palette.accent}`;
  else if (isHighlighted) selectionOutline = `2px dashed ${palette.accent}`;

  const illustration = (
    <ToothIllustration
      fdiNumber={fdiNumber}
      toothData={toothData}
      size={crownSize}
      ghost={ghost}
      viewOptions={viewOptions}
      onSurfaceClick={onSurfaceClick}
      bridgeRole={bridgeRole}
      bridgeExtendLeft={bridgeExtendLeft}
      bridgeExtendRight={bridgeExtendRight}
    />
  );
  const wheel = ghost ? (
    <GhostWheel size={wheelSize} />
  ) : (
    <SurfaceWheel
      fdiNumber={fdiNumber}
      toothData={toothData}
      onSurfaceClick={onSurfaceClick}
      size={wheelSize}
      lang={lang}
    />
  );

  const content = (
    <Box
      role="group"
      aria-label={`Tooth ${fdiNumber}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        width: crownSize,
        // The tile's padding/border must grow the box rather than eat into the
        // crown width, otherwise the illustration is clipped at its own size.
        boxSizing: 'content-box',
        cursor: ghost ? 'default' : 'pointer',
        userSelect: 'none',
        // Odontogram-Modul tile treatment; ghosts stay flat and non-interactive.
        ...toothTileSx(palette, { interactive: !ghost }),
        ...(ghost && { backgroundColor: 'transparent', borderColor: 'transparent' }),
        // Wisdom teeth hidden by the view toggle: the tile keeps its slot so the
        // arch never re-centres and bridge spans stay aligned, but the tooth
        // itself goes invisible and unclickable (upstream's .wisdom-hidden).
        ...(hidden && {
          opacity: 0.45,
          pointerEvents: 'none',
          '& svg': { opacity: 0 },
        }),
        outline: selectionOutline,
        outlineOffset: 2,
      }}
      onDoubleClick={ghost ? undefined : () => onDoubleClick(fdiNumber)}
    >
      {/* Upper: tooth on top (root up), wheel toward midline below.
          Lower: wheel toward midline on top, tooth below (root down). */}
      {upper ? (
        <>
          {illustration}
          {wheel}
        </>
      ) : (
        <>
          {wheel}
          {illustration}
        </>
      )}
    </Box>
  );

  if (ghost) return content;

  return (
    <Tooltip title={buildTooltip()} placement="top" arrow enterDelay={600}>
      {content}
    </Tooltip>
  );
}

SingleTooth.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  toothData: PropTypes.object,
  onSurfaceClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  ghost: PropTypes.bool,
  hidden: PropTypes.bool,
  viewOptions: PropTypes.object,
  lang: PropTypes.string,
  crownSize: PropTypes.number,
  bridgeRole: PropTypes.oneOf(['abutment', 'pontic']),
  bridgeExtendLeft: PropTypes.bool,
  bridgeExtendRight: PropTypes.bool,
};

SingleTooth.defaultProps = {
  toothData: null,
  isSelected: false,
  isHighlighted: false,
  ghost: false,
  hidden: false,
  viewOptions: null,
  lang: 'en',
  crownSize: 44,
  bridgeRole: null,
  bridgeExtendLeft: false,
  bridgeExtendRight: false,
};

export default memo(SingleTooth);
