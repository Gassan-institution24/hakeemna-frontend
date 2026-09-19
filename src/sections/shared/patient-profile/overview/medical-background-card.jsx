import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import PanelCard from 'src/components/panel-card';

// ----------------------------------------------------------------------

// Catalogs disagree about their columns, so each list says how to read itself.
// Medicines (which drug allergies reference) carry no Arabic at all -- they are
// trade names -- and diseases use `Name` with an ICD code beside it.
const asMedicineName = (one) =>
  [one?.trade_name || one?.scientific_name, one?.concentration].filter(Boolean).join(' ');

const asDiseaseName = (one) =>
  [one?.Name, one?.ICD_code && `(${one.ICD_code})`].filter(Boolean).join(' ');

// ----------------------------------------------------------------------

function ChipList({ title, items, color }) {
  if (!items.length) return null;

  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
        {items.map((label, index) => (
          // Catalog rows have no stable key once reduced to a label.
          // eslint-disable-next-line react/no-array-index-key
          <Label key={index} color={color} variant="soft">
            {label}
          </Label>
        ))}
      </Stack>
    </Stack>
  );
}

ChipList.propTypes = {
  title: PropTypes.node,
  items: PropTypes.array,
  color: PropTypes.string,
};

// ----------------------------------------------------------------------

// Allergies, conditions, operations and home medicines.
//
// Refs come back populated or as raw ObjectId strings depending on what the
// endpoint was asked for, so anything that does not resolve to a name is
// dropped: showing an id would be worse than showing nothing. If none of the
// four lists resolves, the card removes itself.
export default function MedicalBackgroundCard({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const toList = (value, mapper) =>
    (Array.isArray(value) ? value : [])
      .map((one) => (one && typeof one === 'object' ? mapper(one) : null))
      .filter(Boolean);

  const allergies = toList(patient?.drug_allergies, asMedicineName);
  const diseases = toList(patient?.diseases, asDiseaseName);
  const surgeries = toList(patient?.surgeries, (one) =>
    curLangAr
      ? one.name_arabic || one.name_english
      : one.name_english || one.name_arabic
  );
  const medicines = toList(patient?.medicines, (one) => {
    const name = asMedicineName(one.medicine);
    if (!name) return null;
    return [name, one.dose, one.frequently].filter(Boolean).join(' · ');
  });

  if (!allergies.length && !diseases.length && !surgeries.length && !medicines.length) {
    return null;
  }

  return (
    <PanelCard icon="solar:clipboard-heart-bold-duotone" title={t('Medical Background')}>
      <Stack spacing={2}>
        <ChipList title={t('Drug Allergies')} items={allergies} color="error" />
        <ChipList title={t('Diseases')} items={diseases} color="warning" />
        <ChipList title={t('Surgeries')} items={surgeries} color="info" />
        <ChipList title={t('Home Medications')} items={medicines} color="default" />
        <Box />
      </Stack>
    </PanelCard>
  );
}

MedicalBackgroundCard.propTypes = {
  patient: PropTypes.object,
};
