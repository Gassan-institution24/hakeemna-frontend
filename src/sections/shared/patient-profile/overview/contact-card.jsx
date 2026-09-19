import PropTypes from 'prop-types';

import { Link, Stack } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import PanelCard, { InfoRow } from 'src/components/panel-card';

import { getLocalizedName } from '../utils';

// ----------------------------------------------------------------------

// How to reach the patient, plus the few administrative facts worth having on
// the first screen.
export default function ContactCard({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const rows = [
    // Phone numbers stay LTR whatever the page direction, or the country code
    // ends up on the wrong side of the number.
    { label: t('Mobile Number'), value: patient?.mobile_num1, dir: 'ltr' },
    { label: t('Secondary Mobile Number'), value: patient?.mobile_num2, dir: 'ltr' },
    { label: t('Email Address'), value: patient?.email, dir: 'ltr', preserveCase: true },
    { label: t('Address'), value: patient?.address },
    { label: t('city'), value: getLocalizedName(patient?.city, curLangAr) },
    { label: t('residence country'), value: getLocalizedName(patient?.country, curLangAr) },
    { label: t('nationality'), value: getLocalizedName(patient?.nationality, curLangAr) },
    {
      label: t('marital status'),
      value: patient?.marital_status && t(patient.marital_status),
    },
    { label: t('Patient since'), value: patient?.created_at && fDate(patient.created_at) },
    {
      label: t('cloud Storage link for patient data'),
      value: patient?.cloud_storage_link && (
        <Link href={patient.cloud_storage_link} target="_blank" rel="noopener">
          {t('View all')}
        </Link>
      ),
    },
  ].filter((row) => row.value !== null && row.value !== undefined && row.value !== '');

  if (!rows.length) return null;

  return (
    <PanelCard icon="solar:phone-bold-duotone" title={t('Contact')}>
      <Stack>
        {rows.map((row) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            dir={row.dir}
            preserveCase={row.preserveCase}
          />
        ))}
      </Stack>
    </PanelCard>
  );
}

ContactCard.propTypes = {
  patient: PropTypes.object,
};
