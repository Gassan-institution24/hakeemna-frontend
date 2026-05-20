import PropTypes from 'prop-types';

import { Box, Divider, Stack, Typography } from '@mui/material';

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
  activeCondition,
  selectedTeeth,
  multiSelect,
  lang,
  crownSize,
}) {
  return (
    <Box>
      {isUpper && (
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mb: 0.5, letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
      )}

      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="center"
        sx={{ gap: `${GAP}px`, px: 1 }}
      >
        {teeth.map((fdi, idx) => (
          <Box key={fdi} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <SingleTooth
              fdiNumber={fdi}
              toothData={teethMap[fdi] || null}
              onSurfaceClick={onSurfaceClick}
              onDoubleClick={onDoubleClick}
              isSelected={multiSelect && selectedTeeth.has(fdi)}
              isHighlighted={!multiSelect && selectedTeeth.has(fdi)}
              activeCondition={activeCondition}
              lang={lang}
              crownSize={crownSize}
            />

            {/* Midline divider */}
            {idx === midlineAfterIndex && (
              <Box
                sx={{
                  width: 2,
                  height: 'calc(100% - 4px)',
                  backgroundColor: MIDLINE_COLOR,
                  mx: 0.5,
                  borderRadius: 1,
                  alignSelf: 'stretch',
                }}
              />
            )}
          </Box>
        ))}
      </Stack>

      {!isUpper && (
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
  activeCondition: PropTypes.string,
  selectedTeeth: PropTypes.instanceOf(Set),
  multiSelect: PropTypes.bool,
  lang: PropTypes.string,
  crownSize: PropTypes.number,
};

DentalArch.defaultProps = {
  isUpper: true,
  label: '',
  midlineAfterIndex: 7,
  activeCondition: null,
  selectedTeeth: new Set(),
  multiSelect: false,
  lang: 'en',
  crownSize: 44,
};
