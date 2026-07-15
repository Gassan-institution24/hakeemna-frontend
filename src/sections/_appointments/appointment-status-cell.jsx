import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { deriveRowDisplay } from './appointment-status';

// ----------------------------------------------------------------------

// Renders a row's lifecycle status: the lifecycle Label + an optional derived
// chip (Late / Not arrived / Expired) + the "is coming" confirmation indicator.
export default function AppointmentStatusCell({ row, align = 'center' }) {
  const { t } = useTranslate();
  const { labelKey, color, chip } = deriveRowDisplay(row);
  const coming = row?.coming;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      justifyContent={align === 'center' ? 'center' : 'flex-start'}
      flexWrap="wrap"
      useFlexGap
    >
      <Label variant="soft" color={color}>
        {t(labelKey)}
      </Label>

      {chip && (
        <Label variant="outlined" color={chip.color}>
          {t(chip.labelKey)}
        </Label>
      )}

      {coming === true && (
        <Iconify
          icon="solar:check-circle-bold"
          width={18}
          sx={{ color: 'success.main' }}
          title={t('coming')}
        />
      )}
      {coming === false && (
        <Iconify
          icon="solar:close-circle-bold"
          width={18}
          sx={{ color: 'error.main' }}
          title={t('not coming')}
        />
      )}
    </Stack>
  );
}

AppointmentStatusCell.propTypes = {
  row: PropTypes.object,
  align: PropTypes.string,
};
