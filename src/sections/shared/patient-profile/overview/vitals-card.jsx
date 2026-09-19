import PropTypes from 'prop-types';

import { Stack } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import PanelCard, { InfoRow } from 'src/components/panel-card';

import { calculateBmi, getLocalizedName } from '../utils';

// ----------------------------------------------------------------------

// Height, weight and the lifestyle answers, plus a derived BMI.
//
// There is no chart here on purpose: the record stores a single height and a
// single weight, not a series, so any trend line would be invented.
export default function VitalsCard({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const bmi = calculateBmi(patient?.height, patient?.weight);
  const diet = getLocalizedName(patient?.eating_diet, curLangAr);

  const rows = [
    { label: t('Height'), value: patient?.height && `${patient.height} ${t('cm')}` },
    { label: t('Weight'), value: patient?.weight && `${patient.weight} ${t('kg')}` },
    { label: t('BMI'), value: bmi },
    { label: t('Blood Type'), value: patient?.blood_type },
    { label: t('Pregnant'), value: patient?.pregnant === true },
    { label: t('Smoking'), value: patient?.smoking && t(patient.smoking) },
    {
      label: t('alcohol consumption'),
      value: patient?.alcohol_consumption && t(patient.alcohol_consumption),
    },
    {
      label: t('Sport Exercises'),
      value: patient?.sport_exercises && t(patient.sport_exercises),
    },
    { label: t('eating diet'), value: diet },
  ].filter((row) => row.value !== null && row.value !== undefined && row.value !== false && row.value !== '');

  if (!rows.length) return null;

  return (
    <PanelCard icon="solar:heart-pulse-bold-duotone" title={t('Vitals & Lifestyle')}>
      <Stack>
        {rows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </Stack>
    </PanelCard>
  );
}

VitalsCard.propTypes = {
  patient: PropTypes.object,
};
