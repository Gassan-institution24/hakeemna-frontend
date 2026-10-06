import { useState } from 'react';
import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';
import { Box, Stack, Switch, Divider, Typography, ButtonBase, FormControlLabel } from '@mui/material';

import { useTranslate } from 'src/locales';

import { CHILD_TEETH, ADULT_TEETH } from './lab-request-options';

// ----------------------------------------------------------------------

// FDI tooth picker. A click toggles a tooth in `teeth`; with `allowPontics`, a
// second click marks it as a pontic and a third clears it.
export default function TeethPicker({ teeth, pontics, onChange, allowPontics }) {
  const { t } = useTranslate();
  const [child, setChild] = useState(() => teeth.some((one) => one >= 51));

  const chart = child ? CHILD_TEETH : ADULT_TEETH;

  const toggle = (fdi) => {
    const selected = teeth.includes(fdi);
    const pontic = pontics.includes(fdi);

    if (!selected) {
      onChange({ teeth: [...teeth, fdi].sort((a, b) => a - b), pontics });
    } else if (allowPontics && !pontic) {
      onChange({ teeth, pontics: [...pontics, fdi].sort((a, b) => a - b) });
    } else {
      onChange({
        teeth: teeth.filter((one) => one !== fdi),
        pontics: pontics.filter((one) => one !== fdi),
      });
    }
  };

  const renderTooth = (fdi) => {
    const selected = teeth.includes(fdi);
    const pontic = pontics.includes(fdi);
    return (
      <ButtonBase
        key={fdi}
        onClick={() => toggle(fdi)}
        sx={(theme) => ({
          width: 34,
          height: 34,
          borderRadius: 1,
          fontSize: 12,
          fontWeight: 600,
          border: `1px solid ${theme.palette.divider}`,
          color: 'text.secondary',
          ...(selected && {
            color: 'common.white',
            bgcolor: 'primary.main',
            borderColor: 'primary.main',
          }),
          ...(pontic && {
            color: 'warning.darker',
            bgcolor: alpha(theme.palette.warning.main, 0.24),
            borderColor: 'warning.main',
            borderStyle: 'dashed',
          }),
        })}
      >
        {fdi}
      </ButtonBase>
    );
  };

  const renderRow = (row) => {
    const half = row.length / 2;
    return (
      <Stack direction="row" spacing={0.5} justifyContent="center">
        {row.slice(0, half).map(renderTooth)}
        <Divider orientation="vertical" flexItem sx={{ mx: 0.75 }} />
        {row.slice(half).map(renderTooth)}
      </Stack>
    );
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {allowPontics
            ? t('Click a tooth to select it, click again to mark it as a pontic.')
            : t('Click a tooth to select it.')}
        </Typography>
        <FormControlLabel
          control={<Switch size="small" checked={child} onChange={(e) => setChild(e.target.checked)} />}
          label={<Typography variant="caption">{t('Primary teeth')}</Typography>}
        />
      </Stack>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Stack spacing={0.75} sx={{ minWidth: 'fit-content' }}>
          {renderRow(chart.upper)}
          <Divider />
          {renderRow(chart.lower)}
        </Stack>
      </Box>
    </Box>
  );
}

TeethPicker.propTypes = {
  teeth: PropTypes.array,
  pontics: PropTypes.array,
  onChange: PropTypes.func,
  allowPontics: PropTypes.bool,
};
