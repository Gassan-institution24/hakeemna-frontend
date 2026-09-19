import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Divider, Typography } from '@mui/material';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import PanelCard from 'src/components/panel-card';

import { getLocalizedName } from '../utils';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  finished: 'success',
  processing: 'info',
  arrived: 'info',
  booked: 'warning',
  late: 'warning',
  'not arrived': 'warning',
  canceled: 'error',
};

// ----------------------------------------------------------------------

// The doctor of an appointment lives on the work group's employee list.
const doctorOf = (appointment, curLangAr) => {
  const employees = appointment?.work_group?.employees;
  const employee = Array.isArray(employees) ? employees[0]?.employee?.employee : null;
  return getLocalizedName(employee, curLangAr);
};

function AppointmentRow({ appointment, label, curLangAr, t }) {
  const doctor = doctorOf(appointment, curLangAr);
  const type = getLocalizedName(appointment.appointment_type, curLangAr);

  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
        <Typography variant="body2" fontWeight={600}>
          {fDateTime(appointment.start_time)}
        </Typography>
        {appointment.status && (
          <Label color={STATUS_COLOR[appointment.status] || 'default'} variant="soft">
            {t(appointment.status)}
          </Label>
        )}
        {appointment.emergency && (
          <Label color="error" variant="soft">
            {t('Emergency')}
          </Label>
        )}
      </Stack>

      {[type, doctor].filter(Boolean).length > 0 && (
        <Typography variant="caption" color="text.secondary">
          {[type, doctor].filter(Boolean).join(' · ')}
        </Typography>
      )}

      <Typography variant="caption" color="text.disabled">
        {fToNow(appointment.start_time)}
      </Typography>
    </Stack>
  );
}

AppointmentRow.propTypes = {
  appointment: PropTypes.object,
  label: PropTypes.node,
  curLangAr: PropTypes.bool,
  t: PropTypes.func,
};

// ----------------------------------------------------------------------

// The next booking and the most recent past one.
//
// The endpoint returns past and future together, sorted by start time, and
// there is no "next appointment" route -- so next is simply the first future
// booking that has not been cancelled.
export default function AppointmentCard({ appointments, onNavigate }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { next, previous } = useMemo(() => {
    const rows = Array.isArray(appointments) ? appointments : [];
    const now = Date.now();
    const live = rows.filter((one) => !one?.canceled && one?.start_time);

    return {
      next: live.find((one) => new Date(one.start_time).getTime() > now),
      previous: [...live]
        .reverse()
        .find((one) => new Date(one.start_time).getTime() <= now),
    };
  }, [appointments]);

  if (!next && !previous) return null;

  return (
    <PanelCard
      icon="solar:calendar-bold-duotone"
      title={t('Next Appointment')}
      action={
        <Button size="small" onClick={() => onNavigate?.('appointments')}>
          {t('View all')}
        </Button>
      }
    >
      <Stack spacing={1.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {next ? (
          <AppointmentRow
            appointment={next}
            label={t('Next Appointment')}
            curLangAr={curLangAr}
            t={t}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('No upcoming appointment')}
          </Typography>
        )}

        {previous && (
          <AppointmentRow
            appointment={previous}
            label={t('Last Appointment')}
            curLangAr={curLangAr}
            t={t}
          />
        )}
      </Stack>
    </PanelCard>
  );
}

AppointmentCard.propTypes = {
  appointments: PropTypes.array,
  onNavigate: PropTypes.func,
};
