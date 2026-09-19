import PropTypes from 'prop-types';

import { Stack, Divider, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import PanelCard from 'src/components/panel-card';

// ----------------------------------------------------------------------

const LEVEL_COLOR = { critical: 'error', high: 'warning', medium: 'info', low: 'default' };

// ----------------------------------------------------------------------

// Every diagnosis still standing, newest first.
//
// `status === 'chronic'` is the only per-patient chronic signal this system
// records, so it is shown as a badge rather than rolled into a patient-level
// "chronic conditions" field that does not exist.
export default function DiagnosesCard({ diagnoses }) {
  const { t } = useTranslate();

  if (!diagnoses?.length) return null;

  return (
    <PanelCard icon="solar:stethoscope-bold-duotone" title={t('Diagnoses')}>
      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {diagnoses.map((one) => {
          const name = one.primary_diagnosis_name || one.secondary_diagnosis_name;
          if (!name) return null;

          return (
            <Stack key={one._id} spacing={0.5} sx={{ py: 1 }}>
              <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
                <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                  {name}
                </Typography>

                {one.level && (
                  <Label color={LEVEL_COLOR[one.level] || 'default'} variant="soft">
                    {t(one.level)}
                  </Label>
                )}

                {one.status === 'chronic' && (
                  <Label color="info" variant="soft">
                    {t('chronic')}
                  </Label>
                )}
              </Stack>

              {one.secondary_diagnosis_name && one.primary_diagnosis_name && (
                <Typography variant="caption" color="text.secondary">
                  {one.secondary_diagnosis_name}
                </Typography>
              )}

              {one.note && (
                <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                  {one.note}
                </Typography>
              )}

              {one.created_at && (
                <Typography variant="caption" color="text.disabled">
                  {fDate(one.created_at)}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    </PanelCard>
  );
}

DiagnosesCard.propTypes = {
  diagnoses: PropTypes.array,
};
