import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Divider, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import PanelCard from 'src/components/panel-card';

// ----------------------------------------------------------------------

const MAX_ROWS = 6;

// ----------------------------------------------------------------------

// What the patient has been prescribed here, newest first.
//
// This reads the clinic's own prescriptions rather than the global "current
// medicines" endpoint, because that one is keyed on the linked patient account
// and so returns nothing at all for a walk-in.
export default function MedicationsCard({ prescriptions, onNavigate }) {
  const { t } = useTranslate();

  const rows = useMemo(() => {
    const all = Array.isArray(prescriptions) ? prescriptions : [];

    return all
      .slice()
      .sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0))
      .flatMap((prescription) =>
        (prescription?.medicines || []).map((item) => ({
          key: `${prescription._id}-${item?._id || item?.medicines?._id}`,
          name: [item?.medicines?.trade_name, item?.medicines?.concentration]
            .filter(Boolean)
            .join(' '),
          frequency: item?.Frequency_per_day,
          start: item?.Start_time,
          end: item?.End_time,
        }))
      )
      .filter((one) => one.name)
      .slice(0, MAX_ROWS);
  }, [prescriptions]);

  if (!rows.length) return null;

  return (
    <PanelCard
      icon="solar:pills-bold-duotone"
      title={t('Active Medications')}
      action={
        <Button size="small" onClick={() => onNavigate?.('prescriptions')}>
          {t('View all')}
        </Button>
      }
    >
      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {rows.map((one) => (
          <Stack key={one.key} spacing={0.25} sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
              {one.name}
            </Typography>

            {one.frequency && (
              <Typography variant="caption" color="text.secondary">
                {`${t('frequently')}: ${one.frequency}`}
              </Typography>
            )}

            {(one.start || one.end) && (
              <Typography variant="caption" color="text.disabled">
                {[one.start && fDate(one.start), one.end && fDate(one.end)]
                  .filter(Boolean)
                  .join(' → ')}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    </PanelCard>
  );
}

MedicationsCard.propTypes = {
  prescriptions: PropTypes.array,
  onNavigate: PropTypes.func,
};
