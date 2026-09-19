import PropTypes from 'prop-types';

import { Box, Alert, Stack, AlertTitle, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

// Severities a doctor should see before they start reading anything else.
const ALERT_LEVELS = ['critical', 'high'];

const SEVERITY = { critical: 'error', high: 'warning' };

// ----------------------------------------------------------------------

// The high-severity diagnoses, raised above the rest of the overview.
//
// This is the only thing on the page that claims urgency, so it is driven
// strictly by a clinician-set `level` on a diagnosis record. Nothing is
// inferred, and when there is nothing to raise the strip disappears entirely
// rather than reporting the patient as clear.
export default function ClinicalAlerts({ diagnoses }) {
  const { t } = useTranslate();

  const alerts = (diagnoses || []).filter((one) => ALERT_LEVELS.includes(one?.level));

  if (!alerts.length) return null;

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      {alerts.map((one) => {
        const name = one.primary_diagnosis_name || one.secondary_diagnosis_name;

        return (
          <Alert
            key={one._id}
            severity={SEVERITY[one.level] || 'warning'}
            variant="outlined"
            sx={{ alignItems: 'flex-start' }}
          >
            <AlertTitle sx={{ mb: one.note ? 0.5 : 0 }}>
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Box component="span">{name || t('Clinical Alerts')}</Box>
                <Label color={one.level === 'critical' ? 'error' : 'warning'} variant="soft">
                  {t(one.level)}
                </Label>
                {one.status === 'chronic' && (
                  <Label color="info" variant="soft">
                    {t('chronic')}
                  </Label>
                )}
              </Stack>
            </AlertTitle>

            {one.note && (
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {one.note}
              </Typography>
            )}

            {one.created_at && (
              <Typography variant="caption" color="text.secondary">
                {fDate(one.created_at)}
              </Typography>
            )}
          </Alert>
        );
      })}
    </Stack>
  );
}

ClinicalAlerts.propTypes = {
  diagnoses: PropTypes.array,
};
