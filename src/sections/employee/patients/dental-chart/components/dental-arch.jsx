import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

import SingleTooth from './single-tooth';

const MIDLINE_COLOR = '#E0E0E0';
const GAP = 2; // px between teeth

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
}) {
  const align = isUpper ? 'flex-end' : 'flex-start';

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

      <Stack direction="row" alignItems={align} justifyContent="center" sx={{ gap: `${GAP}px`, px: 1 }}>
        {leadingGhosts.map(renderGhost)}

        {teeth.map((fdi, idx) => (
          <Box key={fdi} sx={{ display: 'flex', alignItems: align }}>
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
        ))}

        {trailingGhosts.map(renderGhost)}
      </Stack>

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
};
