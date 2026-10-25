import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Avatar,
  Divider,
  Container,
  Typography,
  CardActionArea,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useFDateTimeUnit } from 'src/utils/format-time';
import { getLocalizedName } from 'src/utils/get-localized-name';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';
import { useGetUsAppointmentsToday } from 'src/api/appointments';
import { useSubscriptionGuard } from 'src/auth/guard/subscription-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// The dental product's home. Everything here is a door into an existing screen, behind
// the same ACL and subscription rules the sidebar uses for that screen — those screens
// and the API still enforce access themselves, so hiding a card is never the only check.

export default function DentalDashboardView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const checkAcl = useAclGuard();
  const { hasFeature } = useSubscriptionGuard();
  const { isMedLab } = useUSTypeGuard();
  const checkAccess = useCallback(
    (permission, feature) => checkAcl(permission) && hasFeature(feature),
    [checkAcl, hasFeature]
  );

  const unitService =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service;

  const canSeeToday =
    (checkAcl('entrance:appointment') || checkAcl('entrance:rooms') || checkAcl('entrance:finished')) &&
    !isMedLab;

  const actions = useMemo(
    () =>
      [
        {
          show: canSeeToday,
          title: t('Appointments Today'),
          description: t('Patients in the chair and in the waiting room today'),
          icon: 'material-symbols:work-history-rounded',
          path: paths.employee.appointmentsToday,
          color: 'primary',
        },
        {
          show: checkAccess('dental_chart:read', 'dental_chart'),
          title: t('dental chart'),
          description: t('Odontogram, periodontal chart, X-rays and treatment plans'),
          icon: 'mdi:tooth-outline',
          path: paths.unitservice.dental.root,
          color: 'secondary',
        },
        {
          show: checkAccess('appointments:read', 'appointments'),
          title: t('my patients'),
          description: t('Your patients and their records'),
          icon: 'streamline:health-care-2-solid',
          path: paths.employee.patients.all,
          color: 'info',
        },
        {
          show: checkAccess('appointments:read', 'appointments'),
          title: t('my appointments'),
          description: t('Upcoming and past appointments'),
          icon: 'fluent-mdl2:date-time-mirrored',
          path: paths.employee.appointments.root,
          color: 'success',
        },
        {
          show: checkAcl('appointments:update') && !isMedLab,
          title: t('book appointments'),
          description: t('Book a new visit for a patient'),
          icon: 'streamline:waiting-appointments-calendar',
          path: paths.employee.appointments.book,
          color: 'warning',
        },
        {
          show: true,
          title: t('calender'),
          description: t('Your schedule at a glance'),
          icon: 'simple-line-icons:calender',
          path: paths.employee.calender,
          color: 'primary',
        },
      ].filter((action) => action.show),
    [t, canSeeToday, checkAccess, checkAcl, isMedLab]
  );

  const doctorName = getLocalizedName(user?.employee, curLangAr, '');

  return (
    <Container maxWidth="xl">
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          color: 'common.white',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Iconify
          icon="mdi:tooth"
          width={220}
          sx={{
            position: 'absolute',
            insetInlineEnd: -30,
            bottom: -50,
            opacity: 0.12,
          }}
        />
        <Stack spacing={1} sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:tooth-outline" width={22} />
            <Typography variant="overline">{t('Hakeemna 360 Dental')}</Typography>
          </Stack>
          <Typography variant="h4">
            {doctorName ? `${t('Welcome')}, ${doctorName}` : t('Welcome')}
          </Typography>
          {unitService && (
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {getLocalizedName(unitService, curLangAr, '')}
            </Typography>
          )}
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.path}>
            <ActionCard {...action} />
          </Grid>
        ))}
      </Grid>

      {canSeeToday && unitService?._id && (
        <TodayAppointments unitServiceId={unitService._id} curLangAr={curLangAr} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function ActionCard({ title, description, icon, path, color }) {
  return (
    <Card sx={{ height: 1 }}>
      <CardActionArea component={RouterLink} href={path} sx={{ p: 2.5, height: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              color: `${color}.main`,
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
            }}
          >
            <Iconify icon={icon} width={28} />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

ActionCard.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  path: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

// Read-only glance at today's list, from the same endpoint the Appointments Today page
// uses. Acting on a visit (arrival, rooms, processing) stays on that page.
function TodayAppointments({ unitServiceId, curLangAr }) {
  const { t } = useTranslate();
  const { fTimeUnit } = useFDateTimeUnit();
  const { appointmentsData, loading } = useGetUsAppointmentsToday(unitServiceId);

  const rows = useMemo(
    () =>
      [...(Array.isArray(appointmentsData) ? appointmentsData : [])].sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time)
      ),
    [appointmentsData]
  );

  const patientName = (info) => {
    const person =
      info?.patient?.name_english || info?.patient?.name_arabic
        ? info.patient
        : info?.unit_service_patient;
    return getLocalizedName(person, curLangAr, t('Patient'));
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6">{t('Appointments Today')}</Typography>
        <Button
          component={RouterLink}
          href={paths.employee.appointmentsToday}
          endIcon={<Iconify icon={curLangAr ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />}
        >
          {t('view all')}
        </Button>
      </Stack>
      <Divider />

      {!loading && rows.length === 0 && (
        <Typography sx={{ p: 3, color: 'text.secondary', textAlign: 'center' }}>
          {t('No appointments today')}
        </Typography>
      )}

      {rows.slice(0, 8).map((info) => (
        <Stack
          key={info._id}
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ px: 2.5, py: 1.5, borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }}
        >
          <Typography variant="subtitle2" sx={{ width: 72, flexShrink: 0, color: 'primary.main' }}>
            {fTimeUnit(info?.start_time, 'p', true)}
          </Typography>
          <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }} noWrap>
            {patientName(info)}
          </Typography>
          <Label variant="soft" color={info?.arrived ? 'success' : 'default'}>
            {info?.arrived ? t('arrived') : t('not arrived')}
          </Label>
        </Stack>
      ))}
    </Card>
  );
}

TodayAppointments.propTypes = {
  curLangAr: PropTypes.bool,
  unitServiceId: PropTypes.string,
};
