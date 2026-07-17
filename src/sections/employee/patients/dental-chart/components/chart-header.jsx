import PropTypes from 'prop-types';

import {
  Box,
  Stack,
  Select,
  Tooltip,
  MenuItem,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import { NUMBERING_SYSTEMS } from '../constants/numbering';

// ----------------------------------------------------------------------

const toggleGroupSx = {
  backgroundColor: 'background.neutral',
  borderRadius: 1,
  p: 0.4,
  gap: 0.4,
  '& .MuiToggleButton-root': {
    border: 0,
    px: 1.8,
    py: 0.5,
    borderRadius: '6px !important',
    textTransform: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'text.secondary',
    '&.Mui-selected': {
      color: 'common.white',
      backgroundColor: 'primary.main',
      '&:hover': { backgroundColor: 'primary.dark' },
    },
  },
};

// ----------------------------------------------------------------------

export default function ChartHeader({
  chartType,
  onChartTypeChange,
  numbering,
  onNumberingChange,
  isFullscreen,
  onToggleFullscreen,
  lang,
}) {
  const isAr = lang === 'ar';

  // The chart model only stores adult|child, so dentition and age group are two
  // views of the same value: permanent teeth = adult, primary teeth = child.
  const handleChartType = (_e, value) => {
    if (value) onChartTypeChange(value);
  };

  let fullscreenLabel;
  if (isAr) {
    fullscreenLabel = isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة';
  } else {
    fullscreenLabel = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
  }

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
        <Iconify icon="mdi:tooth-outline" width={18} sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={700}>
          {isAr ? 'مخطط الأسنان' : 'Dental chart'}
        </Typography>
        <Iconify icon="mdi:tooth-outline" width={18} sx={{ color: 'primary.main' }} />
        <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ px: 2, pb: 1.5 }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={chartType}
          onChange={handleChartType}
          sx={toggleGroupSx}
        >
          <ToggleButton value="adult">{isAr ? 'دائمة' : 'Permanent'}</ToggleButton>
          <ToggleButton value="child">{isAr ? 'لبنية' : 'Primary'}</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={chartType}
          onChange={handleChartType}
          sx={toggleGroupSx}
        >
          <ToggleButton value="adult">{isAr ? 'بالغ' : 'Adult'}</ToggleButton>
          <ToggleButton value="child">{isAr ? 'طفل' : 'Child'}</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {isAr ? 'ترقيم الأسنان:' : 'Tooth Numbering:'}
          </Typography>
          <Select
            size="small"
            value={numbering}
            onChange={(e) => onNumberingChange(e.target.value)}
            sx={{ minWidth: 110, '& .MuiSelect-select': { py: 0.6, fontSize: '0.8rem' } }}
          >
            {NUMBERING_SYSTEMS.map((system) => (
              <MenuItem key={system.value} value={system.value}>
                {system.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Tooltip title={fullscreenLabel}>
          <IconButton
            size="small"
            onClick={onToggleFullscreen}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Iconify
              width={18}
              icon={isFullscreen ? 'eva:collapse-outline' : 'eva:expand-outline'}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

ChartHeader.propTypes = {
  chartType: PropTypes.string,
  onChartTypeChange: PropTypes.func.isRequired,
  numbering: PropTypes.string,
  onNumberingChange: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool,
  onToggleFullscreen: PropTypes.func.isRequired,
  lang: PropTypes.string,
};
