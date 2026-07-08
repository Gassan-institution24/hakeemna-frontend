import PropTypes from 'prop-types';
import { memo } from 'react';

import { Box, Tooltip } from '@mui/material';

import { isUpperArch, getSurfaceLabel } from '../constants/fdi';
import ToothIllustration from './tooth-illustration';
import SurfaceWheel from './surface-wheel';

// Grey placeholder wheel for out-of-scope / dimmed teeth.
function GhostWheel({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" style={{ display: 'block', opacity: 0.5 }} aria-hidden="true">
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
  lang,
  crownSize,
}) {
  const upper = isUpperArch(fdiNumber);
  const wheelSize = Math.round(crownSize * 0.82);
  const wholeCondition = toothData?.whole_condition;

  const buildTooltip = () => {
    const parts = [];
    if (wholeCondition) parts.push(wholeCondition.replace(/_/g, ' '));
    const surfaces = toothData?.surfaces || {};
    Object.entries(surfaces).forEach(([surface, data]) => {
      if (data?.condition && data.condition !== 'healthy') {
        parts.push(`${getSurfaceLabel(surface, fdiNumber, lang)}: ${data.condition.replace(/_/g, ' ')}`);
      }
    });
    return parts.length ? parts.join(' | ') : `Tooth ${fdiNumber}`;
  };

  let selectionOutline = 'none';
  if (isSelected) selectionOutline = '2px solid #1976D2';
  else if (isHighlighted) selectionOutline = '2px dashed #1976D2';

  const illustration = (
    <ToothIllustration
      fdiNumber={fdiNumber}
      toothData={toothData}
      size={crownSize}
      ghost={ghost}
      onSurfaceClick={onSurfaceClick}
    />
  );
  const wheel = ghost ? (
    <GhostWheel size={wheelSize} />
  ) : (
    <SurfaceWheel fdiNumber={fdiNumber} toothData={toothData} onSurfaceClick={onSurfaceClick} size={wheelSize} lang={lang} />
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
        cursor: ghost ? 'default' : 'pointer',
        userSelect: 'none',
        borderRadius: 1,
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
  lang: PropTypes.string,
  crownSize: PropTypes.number,
};

SingleTooth.defaultProps = {
  toothData: null,
  isSelected: false,
  isHighlighted: false,
  ghost: false,
  lang: 'en',
  crownSize: 44,
};

export default memo(SingleTooth);
