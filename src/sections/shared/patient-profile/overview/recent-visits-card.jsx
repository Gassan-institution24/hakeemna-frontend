import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Divider, Typography, ListItemButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import PanelCard from 'src/components/panel-card';

// ----------------------------------------------------------------------

const RECORD_ICON = {
  sick_leave: 'solar:bed-bold-duotone',
  medical_report: 'solar:document-medicine-bold-duotone',
  prescription: 'solar:pills-bold-duotone',
  appointment: 'solar:calendar-bold-duotone',
  general: 'solar:clipboard-list-bold-duotone',
};

const MAX_ROWS = 5;

// ----------------------------------------------------------------------

// The last few visits, as a jumping-off point into the full history.
//
// A visit record has no diagnosis and no notes field, so there is no "reason
// for visit" to show -- what it does carry is which documents came out of the
// visit, which is what these badges are.
export default function RecentVisitsCard({ history, onNavigate }) {
  const { t } = useTranslate();

  const rows = useMemo(
    () =>
      [...(history || [])]
        .sort(
          (a, b) =>
            new Date(b?.actual_date || b?.created_at || 0) -
            new Date(a?.actual_date || a?.created_at || 0)
        )
        .slice(0, MAX_ROWS),
    [history]
  );

  if (!rows.length) return null;

  return (
    <PanelCard
      icon="solar:clock-circle-bold-duotone"
      title={t('Recent Visits')}
      action={
        <Button size="small" onClick={() => onNavigate?.('history')}>
          {t('View all')}
        </Button>
      }
    >
      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {rows.map((one) => {
          const services = one.servicesSummary || {};

          return (
            <ListItemButton
              key={one._id}
              onClick={() => onNavigate?.('history')}
              sx={{ px: 1, py: 1.25, borderRadius: 1, alignItems: 'flex-start', gap: 1.5 }}
            >
              <Iconify
                icon={RECORD_ICON[one.recordType] || RECORD_ICON.general}
                width={20}
                sx={{ mt: 0.25, color: 'text.disabled', flexShrink: 0 }}
              />

              <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
                  <Typography variant="body2" fontWeight={600}>
                    {fDate(one.actual_date || one.created_at)}
                  </Typography>
                  {services.isEmergency && (
                    <Label color="error" variant="soft">
                      {t('Emergency')}
                    </Label>
                  )}
                </Stack>

                {one.visitLabel && (
                  <Typography variant="caption" color="text.secondary">
                    {one.visitLabel}
                  </Typography>
                )}

                <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap>
                  {services.prescriptions > 0 && (
                    <Label variant="soft">{`${t('Prescriptions')}: ${services.prescriptions}`}</Label>
                  )}
                  {services.medicalReports > 0 && (
                    <Label variant="soft">{`${t('Medical Reports')}: ${services.medicalReports}`}</Label>
                  )}
                  {services.sickLeaves > 0 && (
                    <Label variant="soft">{`${t('Sick Leave')}: ${services.sickLeaves}`}</Label>
                  )}
                </Stack>
              </Stack>
            </ListItemButton>
          );
        })}
      </Stack>
    </PanelCard>
  );
}

RecentVisitsCard.propTypes = {
  history: PropTypes.array,
  onNavigate: PropTypes.func,
};
