import PropTypes from 'prop-types';

import { Box, Tooltip, Typography } from '@mui/material';

import { getRootConfig, isUpperArch, getSurfaceLabel } from '../constants/fdi';
import ToothCrown from './tooth-crown';
import ToothRoot from './tooth-root';

const TOOTH_WIDTH = 44;

export default function SingleTooth({
  fdiNumber,
  toothData,
  onSurfaceClick,
  onDoubleClick,
  isSelected,
  isHighlighted,
  activeCondition,
  lang,
  crownSize,
}) {
  const upper = isUpperArch(fdiNumber);
  const { count: rootCount, height: rootHeight } = getRootConfig(fdiNumber);
  const wholeCondition = toothData?.whole_condition;

  // Build tooltip: current conditions summary
  const buildTooltip = () => {
    const parts = [];
    if (wholeCondition) parts.push(wholeCondition.replace(/_/g, ' '));
    const surfaces = toothData?.surfaces || {};
    Object.entries(surfaces).forEach(([surface, data]) => {
      if (data?.condition && data.condition !== 'healthy') {
        const surfLabel = getSurfaceLabel(surface, fdiNumber, lang);
        parts.push(`${surfLabel}: ${data.condition.replace(/_/g, ' ')}`);
      }
    });
    return parts.length ? parts.join(' | ') : `Tooth ${fdiNumber}`;
  };

  return (
    <Tooltip title={buildTooltip()} placement="top" arrow enterDelay={600}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: TOOTH_WIDTH,
          cursor: 'pointer',
          '&:hover': { filter: 'brightness(0.95)' },
          userSelect: 'none',
        }}
        onDoubleClick={() => onDoubleClick(fdiNumber)}
      >
        {/* Upper arch: root at TOP, crown at BOTTOM */}
        {upper && (
          <ToothRoot rootCount={rootCount} height={rootHeight} flipUp />
        )}

        {/* Crown with 5 surfaces */}
        <ToothCrown
          fdiNumber={fdiNumber}
          toothData={toothData}
          onSurfaceClick={onSurfaceClick}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          activeCondition={activeCondition}
          size={crownSize || TOOTH_WIDTH}
        />

        {/* Lower arch: root at BOTTOM */}
        {!upper && (
          <ToothRoot rootCount={rootCount} height={rootHeight} flipUp={false} />
        )}
      </Box>
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
  activeCondition: PropTypes.string,
  lang: PropTypes.string,
  crownSize: PropTypes.number,
};

SingleTooth.defaultProps = {
  toothData: null,
  isSelected: false,
  isHighlighted: false,
  activeCondition: null,
  lang: 'en',
  crownSize: 44,
};
