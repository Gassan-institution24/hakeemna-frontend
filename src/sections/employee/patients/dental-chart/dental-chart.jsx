import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import { Box, Chip, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import ToothSVG, { STATUS_COLORS, UPPER_TEETH, LOWER_TEETH } from './tooth-svg';
import ToothDialog from './tooth-dialog';

// ----------------------------------------------------------------------

const STATUS_LABELS = {
  en: {
    healthy: 'Healthy',
    cavity: 'Cavity',
    filling: 'Filling',
    crown: 'Crown',
    missing: 'Missing',
    root_canal: 'Root Canal',
    extraction_needed: 'Extraction Needed',
  },
  ar: {
    healthy: 'سليم',
    cavity: 'تسوس',
    filling: 'حشو',
    crown: 'تاج',
    missing: 'مفقود',
    root_canal: 'علاج جذر',
    extraction_needed: 'يحتاج خلع',
  },
};

// ----------------------------------------------------------------------

export default function DentalChart({ chartData, patientId, readonly }) {
  const theme = useTheme();
  const { t, i18n } = useTranslate();
  const lang = i18n?.language?.startsWith('ar') ? 'ar' : 'en';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedTooth, setSelectedTooth] = useState(null);

  // Build a quick lookup map from chartData.teeth array
  const teethMap = {};
  if (chartData?.teeth) {
    chartData.teeth.forEach((tooth) => {
      teethMap[tooth.tooth_number] = tooth;
    });
  }

  const getStatus = useCallback(
    (toothNumber) => teethMap[toothNumber]?.status || 'healthy',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartData]
  );

  const getToothData = useCallback(
    (toothNumber) => teethMap[toothNumber] || { tooth_number: toothNumber, status: 'healthy', notes: '', procedures: [] },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartData]
  );

  const handleToothClick = (toothNumber) => {
    if (readonly) return;
    setSelectedTooth(getToothData(toothNumber));
  };

  const handleCloseDialog = () => setSelectedTooth(null);

  const toothSize = isMobile ? 28 : 36;
  const gap = isMobile ? 2 : 4;

  const renderArch = (teeth, label) => (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', mb: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Stack direction="row" justifyContent="center" gap={`${gap}px`} flexWrap="nowrap">
        {teeth.map((num) => (
          <Tooltip
            key={num}
            title={`${t('Tooth')} ${num}: ${STATUS_LABELS[lang][getStatus(num)] || getStatus(num)}`}
            placement="top"
            arrow
          >
            <Box>
              <ToothSVG
                toothNumber={num}
                status={getStatus(num)}
                onClick={handleToothClick}
                size={toothSize}
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box>
      {/* Legend */}
      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" mb={3}>
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <Chip
            key={key}
            label={STATUS_LABELS[lang][key] || key}
            size="small"
            sx={{
              backgroundColor: color,
              border: `1.5px solid ${theme.palette.divider}`,
              fontWeight: 500,
              fontSize: '0.7rem',
              color: ['healthy', 'filling'].includes(key) ? '#212121' : '#fff',
            }}
          />
        ))}
      </Stack>

      {/* Chart container */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8faff 0%, #f0f4f8 100%)',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: { xs: 1.5, sm: 3 },
          overflowX: 'auto',
        }}
      >
        <Box sx={{ minWidth: isMobile ? 520 : 'unset' }}>
          {/* Upper jaw label */}
          <Typography variant="subtitle2" textAlign="center" color="text.secondary" mb={1}>
            {lang === 'ar' ? 'الفك العلوي' : 'Upper Jaw'}
          </Typography>

          {/* Upper arch — right side (teeth 1-8) and left side (9-16) */}
          {renderArch(UPPER_TEETH, '')}

          {/* Center divider */}
          <Box
            sx={{
              my: 0.5,
              height: 1,
              background: `linear-gradient(to right, transparent, ${theme.palette.divider}, transparent)`,
              borderRadius: 1,
            }}
          />

          {/* Lower arch */}
          {renderArch(LOWER_TEETH, '')}

          {/* Lower jaw label */}
          <Typography variant="subtitle2" textAlign="center" color="text.secondary" mt={1}>
            {lang === 'ar' ? 'الفك السفلي' : 'Lower Jaw'}
          </Typography>
        </Box>
      </Box>

      {/* Tooth detail dialog */}
      {selectedTooth && (
        <ToothDialog
          open={Boolean(selectedTooth)}
          toothData={selectedTooth}
          patientId={patientId}
          statusLabels={STATUS_LABELS[lang]}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
}

DentalChart.propTypes = {
  chartData: PropTypes.object,
  patientId: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
};
