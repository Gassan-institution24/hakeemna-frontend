import PropTypes from 'prop-types';

import { Stack } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import PanelCard from 'src/components/panel-card';

import { getLocalizedName } from '../utils';

// ----------------------------------------------------------------------

// The insurance companies attached to this patient at this clinic.
export default function InsuranceCard({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const companies = (Array.isArray(patient?.insurance) ? patient.insurance : [])
    .map((one) => getLocalizedName(one, curLangAr))
    .filter(Boolean);

  if (!companies.length) return null;

  return (
    <PanelCard icon="solar:shield-check-bold-duotone" title={t('Patient Insurance')}>
      <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
        {companies.map((name) => (
          <Label key={name} color="info" variant="soft">
            {name}
          </Label>
        ))}
      </Stack>
    </PanelCard>
  );
}

InsuranceCard.propTypes = {
  patient: PropTypes.object,
};
