import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

// Highlight colour for a statistic: warning from `warnAt`, error from `alertAt`.
const toneFor = (value, warnAt, alertAt) => {
  if (value === null || value === undefined) return null;
  if (value >= alertAt) return 'error';
  if (value >= warnAt) return 'warning';
  return null;
};

// Derived statistics for the exam on screen. Nothing here is stored — it is
// recomputed from the measurements every render (perio-math.computePerioSummary).
export default function PerioSummary({ summary }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const fmt = (value, suffix = '') => (value === null || value === undefined ? '—' : `${value}${suffix}`);

  const tiles = [
    { label: t('Charted sites'), value: fmt(summary.chartedSites) },
    {
      label: t('Bleeding on Probing'),
      value: fmt(summary.bopPercent, '%'),
      sub: `${summary.bleedingSites} ${t('sites')}`,
      tone: toneFor(summary.bopPercent, 10, 30),
    },
    { label: t('Max PD'), value: fmt(summary.maxPd, ' mm'), tone: toneFor(summary.maxPd, 4, 6) },
    { label: t('Average PD'), value: fmt(summary.avgPd, ' mm') },
    { label: t('Max CAL'), value: fmt(summary.maxCal, ' mm'), tone: toneFor(summary.maxCal, 3, 5) },
    { label: t('Average CAL'), value: fmt(summary.avgCal, ' mm') },
    { label: t('Sites PD ≥ 4 mm'), value: fmt(summary.sitesPd4), tone: toneFor(summary.sitesPd4, 1, Infinity) },
    { label: t('Sites PD ≥ 5 mm'), value: fmt(summary.sitesPd5), tone: toneFor(summary.sitesPd5, 1, Infinity) },
    { label: t('Sites PD ≥ 6 mm'), value: fmt(summary.sitesPd6), tone: toneFor(summary.sitesPd6, Infinity, 1) },
    { label: t('Suppuration'), value: fmt(summary.suppurationSites), sub: t('sites') },
    { label: t('Plaque'), value: fmt(summary.plaquePercent, '%'), sub: t('of teeth') },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))',
        gap: 1,
      }}
    >
      {tiles.map((tile) => {
        const color = tile.tone ? theme.palette[tile.tone].main : null;
        return (
          <Stack
            key={tile.label}
            sx={{
              px: 1.25,
              py: 0.9,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: color ? alpha(color, 0.5) : 'divider',
              backgroundColor: color ? alpha(color, 0.07) : 'background.paper',
            }}
          >
            <Typography variant="caption" color="text.secondary" noWrap>
              {tile.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: color || 'text.primary', lineHeight: 1.3 }}>
              {tile.value}
            </Typography>
            {tile.sub && (
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
                {tile.sub}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Box>
  );
}

PerioSummary.propTypes = {
  summary: PropTypes.object.isRequired,
};
