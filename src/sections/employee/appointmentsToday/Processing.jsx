import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { lazy, useMemo, Suspense, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Stack,
  Avatar,
  Button,
  Divider,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import Rooms from './inside-rooms';
import TabsView from './tabs-view';
import CheckList from './check-list';
import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import Iconify from '../../../components/iconify';
import ServicesProvided from './servicesProvided';
import { useAuthContext } from '../../../auth/hooks';
import Adjustabledocument from './adjustabledocument';
import ProcessingCustomizer from './ProcessingCustomizer';
import { useAclGuard } from '../../../auth/guard/acl-guard';
import { useLocales, useTranslate } from '../../../locales';
import useSpecialityGuard from '../../../auth/guard/speciality-guard';
import { SECTION_KEYS, useProcessingLayout } from './use-processing-layout';
import { useSubscriptionGuard } from '../../../auth/guard/subscription-guard';
import { useGetEmployeeAdjustabledocument } from '../../../api/adjustable_document';
import {
  useGetPatient,
  useGetMedRecord,
  useGetMyCheckLists,
  useGetUSServiceTypes,
  useGetOneEntranceManagement,
} from '../../../api';

// Lazy, so the odontogram and its condition tables never reach the bundle a
// non-dental encounter downloads.
const PatientDentalChart = lazy(() => import('../patients/dental-chart/patient-dental-chart'));

// ─── Helper ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ icon, color, title, children, theme }) {
  return (
    <Card
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
        borderRadius: 2.5,
        boxShadow: 'none',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          height: 4,
          borderRadius: '10px 10px 0 0',
          bgcolor: `${color}.main`,
          opacity: 0.7,
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={icon} sx={{ color: `${color}.main` }} width={20} />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
        </Stack>

        {children}
      </CardContent>
    </Card>
  );
}

SectionCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  theme: PropTypes.object,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Processing() {
  const params = useParams();
  const { user } = useAuthContext();
  const { id } = params;
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const theme = useTheme();
  const router = useRouter();

  const { Entrance, refetch: refetchEntrance } = useGetOneEntranceManagement(id, {
    populate: 'all',
  });
  const { medRecord } = useGetMedRecord(
    Entrance?.service_unit?._id,
    Entrance?.patient?._id,
    Entrance?.unit_service_patient
  );
  const { data } = useGetPatient(Entrance?.patient?._id);
  const { CheckListData } = useGetMyCheckLists(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );
  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);
  const { serviceTypesData } = useGetUSServiceTypes(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { sections, toggle, reset, isVisible } = useProcessingLayout(user?._id);

  // ─── Dental chart (dentists only) ──────────────────────────────────────────
  // A dentist charts the patient they are treating without leaving the encounter.
  // Every other specialty sees this page exactly as before.
  const { isDentist } = useSpecialityGuard();
  const checkAcl = useAclGuard();
  const { hasFeature } = useSubscriptionGuard();

  // The entrance already carries both ids the chart needs — the populated patient
  // and the raw unit_service_patient — so no extra fetch is required.
  // Note `Entrance` is `[]` before it loads, which is truthy: gate on the id.
  const dentalPatient = useMemo(
    () =>
      Entrance?.patient?._id
        ? { _id: Entrance.unit_service_patient, patient: Entrance.patient }
        : null,
    [Entrance?.patient, Entrance?.unit_service_patient]
  );

  const showDentalChart =
    isDentist && !!dentalPatient && checkAcl('dental_chart:read') && hasFeature('dental_chart');

  // Identifies this appointment to the chart, so every treatment line added now
  // is stamped with the same visit and the same date and reads as one plan.
  const dentalVisit = useMemo(
    () =>
      Entrance?._id
        ? {
            id: Entrance._id,
            appointmentId: Entrance.appointmentId || null,
            date: Entrance.Appointment_date || Entrance.start_time || null,
          }
        : null,
    [Entrance?._id, Entrance?.appointmentId, Entrance?.Appointment_date, Entrance?.start_time]
  );

  // Billing reuses the path the Services-provided card already uses: the
  // entrance's Service_types is what the invoice form reads its line items and
  // prices from, so a priced treatment simply joins that list.
  const handleBillService = useCallback(
    async (serviceTypeId) => {
      if (!serviceTypeId || !Entrance?._id) return;
      // Appended server-side with $push rather than read-modify-written here:
      // two treatments added in quick succession would otherwise both write the
      // array they each read, and the second would erase the first.
      // Repeats are intentional — the same service done twice is two billed lines.
      await axiosInstance.patch(`/api/entrance/${Entrance._id}/service-types`, {
        service_types: [String(serviceTypeId)],
      });
      await refetchEntrance();
    },
    [Entrance?._id, refetchEntrance]
  );

  const patientName = curLangAr
    ? Entrance?.patient?.name_arabic || Entrance?.patient?.name_english
    : Entrance?.patient?.name_english || Entrance?.patient?.name_arabic;

  const currentRoomName = curLangAr
    ? Entrance?.Current_activity?.name_arabic || Entrance?.Current_activity?.name_english
    : Entrance?.Current_activity?.name_english;

  const firstSequenceNumber = medRecord?.length > 0 ? medRecord[0].sequence_number : null;

  const handleBackClick = () => {
    router.push(paths.employee.recored(id));
  };

  // The dashboard nav is hidden on this route (see HIDDEN_NAV_ROUTES), so the
  // encounter needs its own way back to the appointments board.
  const handleBackToAppointments = () => {
    router.push(paths.employee.appointmentsToday);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Stack spacing={3}>
        {/* ── Back — the nav is hidden on this route, so this is the way out ── */}
        <Box>
          <Button
            color="inherit"
            onClick={handleBackToAppointments}
            startIcon={<Iconify icon="eva:arrow-back-fill" width={18} />}
          >
            {t('back')}
          </Button>
        </Box>

        {/* ── Patient header card ── */}
        <Card
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
            borderRadius: 2.5,
            boxShadow: 'none',
          }}
        >
          <Box
            sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'primary.main', opacity: 0.8 }}
          />
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {getInitials(patientName)}
              </Avatar>

              <Box flex={1}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {patientName || t('Patient')}
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {Entrance?.Appointment_date && (
                    <Chip
                      size="small"
                      label={firstSequenceNumber ? `${t('Visit')} #${firstSequenceNumber}` : t('First visit')}
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: '0.72rem' }}
                    />
                  )}
                  {currentRoomName && (
                    <Chip
                      size="small"
                      icon={<Iconify icon="solar:map-point-bold" width={14} />}
                      label={currentRoomName}
                      color="info"
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  )}
                  {Entrance?.Appointment_date && (
                    <Chip
                      size="small"
                      icon={<Iconify icon="solar:calendar-bold" width={14} />}
                      label={new Date(Entrance.Appointment_date).toLocaleDateString()}
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: '0.72rem' }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* ── Dental chart — dentists only; brings its own card and header ── */}
        {showDentalChart && (
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            }
          >
            <PatientDentalChart
              patient={dentalPatient}
              visit={dentalVisit}
              onBillService={handleBillService}
            />
          </Suspense>
        )}

        {/* ── Optional: Visits history ── */}
        {isVisible(SECTION_KEYS.VISITS_HISTORY) && medRecord?.length > 0 && (
          <SectionCard
            icon="healthicons:medical-records-outline"
            color="success"
            title={t('Visits history')}
            theme={theme}
          >
            <Box
              sx={{
                borderRadius: 1.5,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                bgcolor: alpha(theme.palette.success.main, 0.04),
                overflow: 'hidden',
              }}
            >
              <Button
                fullWidth
                variant="text"
                color="success"
                startIcon={<Iconify icon="solar:eye-bold" width={18} />}
                onClick={handleBackClick}
                sx={{
                  py: 1.5,
                  justifyContent: 'flex-start',
                  fontWeight: 600,
                  borderRadius: 0,
                }}
              >
                {curLangAr
                  ? `اضغط لعرض تاريخ الزيارة ل ${Entrance?.patient?.name_arabic}`
                  : `View all visits for ${patientName}`}
              </Button>
            </Box>
          </SectionCard>
        )}

        {/* ── Optional: Checklist ── */}
        {isVisible(SECTION_KEYS.CHECK_LIST) && CheckListData?.length > 0 && (
          <SectionCard
            icon="octicon:checklist-16"
            color="info"
            title={t('Choose a Check List')}
            theme={theme}
          >
            <CheckList />
          </SectionCard>
        )}

        {/* ── Clinical forms ── */}
        {isVisible(SECTION_KEYS.UPLOAD_FILES) && (
          <SectionCard
            icon="mingcute:folders-fill"
            color="primary"
            title={t('Upload files')}
            theme={theme}
          >
            <TabsView
              patient={data}
              unit_service_patient={Entrance?.unit_service_patient}
              service_unit={Entrance?.service_unit?._id}
            />
          </SectionCard>
        )}

        {/* ── Optional: Adjustable document ── */}
        {isVisible(SECTION_KEYS.ADJUSTABLE_DOCUMENT) && adjustabledocument?.length > 0 && (
          <SectionCard
            icon="mingcute:document-fill"
            color="warning"
            title={`${t('Adjustable document')} (${t('optional')})`}
            theme={theme}
          >
            <Adjustabledocument
              patient={data}
              unit_service_patient={Entrance?.unit_service_patient}
            />
          </SectionCard>
        )}

        {/* ── Optional: Services provided ── */}
        {isVisible(SECTION_KEYS.SERVICES_PROVIDED) && serviceTypesData > 0 && (
          <SectionCard
            icon="hugeicons:give-pill"
            color="error"
            title={t('Services provided')}
            theme={theme}
          >
            <ServicesProvided patient={data} />
          </SectionCard>
        )}

        {/* ── Room navigation + End appointment ── */}
        <Box>
          <Divider sx={{ mb: 3 }}>
            <Chip
              icon={<Iconify icon="solar:arrow-right-up-bold-duotone" width={16} />}
              label={t('Patient handoff')}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, px: 1 }}
            />
          </Divider>
          <Rooms />
        </Box>
      </Stack>

      {/* ── Floating customizer ── */}
      <ProcessingCustomizer sections={sections} onToggle={toggle} onReset={reset} />
    </>
  );
}
