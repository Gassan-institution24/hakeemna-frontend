import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Alert,
  Paper,
  Avatar,
  Button,
  Divider,
  Collapse,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useLocales } from 'src/locales';
import { useGetUSServiceTypes } from 'src/api/service_types';
import { useGetPatient, useGetOneEntranceManagement } from 'src/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();

// Refs arrive populated or as a raw ObjectId depending on the endpoint's populate.
const nameOf = (value, isAr) => {
  if (!value || typeof value === 'string') return null;
  const name = isAr
    ? value.name_arabic || value.name_english
    : value.name_english || value.name_arabic;
  return name || null;
};

const idOf = (value) => {
  if (!value) return null;
  return String(value._id || value);
};

// `Price_per_unit` is a String on service_types and may be blank or non-numeric.
const priceOf = (service) => {
  const raw = Number(service?.Price_per_unit);
  return Number.isFinite(raw) ? raw : 0;
};

// A duration stored as a Date offset from the epoch, which is how process_time
// is written. Rendered as hours and minutes rather than a meaningless 1970 date.
const asDuration = (value) => {
  if (!value) return null;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms) || ms <= 0) return null;
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const age = (birthDate) => {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;
  const diff = Date.now() - born.getTime();
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return years >= 0 && years < 150 ? years : null;
};

// ----------------------------------------------------------------------

function SectionCard({ icon, color, title, action, children }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${alpha(theme.palette.divider, 0.16)}`,
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ height: 4, bgcolor: `${color}.main`, opacity: 0.7 }} />
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.12),
              }}
            >
              <Iconify icon={icon} width={18} sx={{ color: `${color}.main` }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
          </Stack>
          {action}
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
  action: PropTypes.node,
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

// A label/value pair. Renders nothing at all when there is no value, so a sparse
// record shows a short clean card instead of a column of dashes.
function InfoRow({ label, value, icon }) {
  if (value === null || value === undefined || value === '' || value === false) return null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      gap={2}
      sx={{ py: 0.85 }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
        {icon && <Iconify icon={icon} width={15} sx={{ color: 'text.disabled' }} />}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ textAlign: 'end', wordBreak: 'break-word' }}
      >
        {value === true ? '✓' : value}
      </Typography>
    </Stack>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  icon: PropTypes.string,
};

// ----------------------------------------------------------------------

function StatTile({ icon, color, label, value }) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: '1 1 150px',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        borderColor: alpha(theme.palette.divider, 0.16),
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.12),
          }}
        >
          <Iconify icon={icon} width={19} sx={{ color: `${color}.main` }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

StatTile.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
};

// ----------------------------------------------------------------------

// The visit as it actually unfolded: arrival, the rooms the patient passed
// through, where they are now, and when it ended.
function VisitTimeline({ steps }) {
  const theme = useTheme();

  if (steps.length === 0) return null;

  return (
    <Stack>
      {steps.map((step, index) => (
        <Stack key={`${step.label}-${index}`} direction="row" gap={1.5}>
          {/* Rail */}
          <Stack alignItems="center" sx={{ flexShrink: 0 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                mt: 0.6,
                borderRadius: '50%',
                bgcolor: step.active ? `${step.color}.main` : 'transparent',
                border: '2px solid',
                borderColor: `${step.color}.main`,
                boxShadow: step.active
                  ? `0 0 0 4px ${alpha(theme.palette[step.color]?.main || theme.palette.primary.main, 0.16)}`
                  : 'none',
              }}
            />
            {index < steps.length - 1 && (
              <Box
                sx={{
                  width: 2,
                  flex: 1,
                  minHeight: 26,
                  my: 0.5,
                  bgcolor: alpha(theme.palette.divider, 0.5),
                }}
              />
            )}
          </Stack>

          {/* Content */}
          <Box sx={{ pb: index < steps.length - 1 ? 1.5 : 0, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600}>
              {step.label}
            </Typography>
            {step.value && (
              <Typography variant="caption" color="text.secondary">
                {step.value}
              </Typography>
            )}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

VisitTimeline.propTypes = {
  steps: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function ViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { currentLang } = useLocales();
  const isAr = currentLang?.value === 'ar';

  const [showMeta, setShowMeta] = useState(false);

  const { Entrance, loading } = useGetOneEntranceManagement(id, { populate: 'all' });

  // The entrance carries only the patient's name and picture; the full record has
  // the demographics worth showing on a visit summary.
  const { data: patient } = useGetPatient(Entrance?.patient?._id);

  // Billed services are stored as bare ids, so they are resolved against the
  // clinic's catalogue here rather than by widening the shared entrance populate,
  // which other screens rely on returning raw refs.
  const { serviceTypesData } = useGetUSServiceTypes(Entrance?.service_unit?._id);

  const billed = useMemo(() => {
    const catalogue = new Map(
      (Array.isArray(serviceTypesData) ? serviceTypesData : []).map((s) => [String(s._id), s])
    );
    // One row per entry, never deduplicated: the same service performed twice in
    // a visit is two billed lines, and that is what the invoice charges for.
    const rows = (Entrance?.Service_types || []).map((entry, index) => {
      const serviceId = idOf(entry);
      const service = (typeof entry === 'object' && entry?.name_english ? entry : null)
        || catalogue.get(serviceId);
      return {
        key: `${serviceId}-${index}`,
        name: nameOf(service, isAr) || (isAr ? 'خدمة' : 'Service'),
        price: priceOf(service),
        known: Boolean(service),
      };
    });
    return { rows, total: rows.reduce((sum, row) => sum + row.price, 0) };
  }, [Entrance?.Service_types, serviceTypesData, isAr]);

  const patientName =
    nameOf(Entrance?.patient, isAr) || nameOf(patient, isAr) || (isAr ? 'مريض' : 'Patient');

  const timeline = useMemo(() => {
    if (!Entrance) return [];
    const steps = [];

    if (Entrance.Arrival_time) {
      steps.push({
        label: isAr ? 'الوصول' : 'Arrived',
        value: fDateTime(Entrance.Arrival_time),
        color: 'info',
        active: true,
      });
    }
    if (Entrance.start_time) {
      steps.push({
        label: isAr ? 'بدأ الموعد' : 'Visit started',
        value: fDateTime(Entrance.start_time),
        color: 'primary',
        active: true,
      });
    }

    (Entrance.activity_happened || []).forEach((activity) => {
      const label = nameOf(activity, isAr);
      if (label) {
        steps.push({ label, value: isAr ? 'تمت' : 'Completed', color: 'success', active: true });
      }
    });

    const current = nameOf(Entrance.Current_activity, isAr);
    if (current) {
      steps.push({
        label: current,
        value: isAr ? 'النشاط الحالي' : 'Current activity',
        color: 'warning',
        active: true,
      });
    }

    const next = nameOf(Entrance.Next_activity, isAr);
    if (next) {
      steps.push({
        label: next,
        value: isAr ? 'التالي' : 'Up next',
        color: 'warning',
        active: false,
      });
    }

    const ended = Entrance.end_attended_Time || Entrance.end_time;
    if (ended) {
      steps.push({
        label: isAr ? 'انتهى الموعد' : 'Visit ended',
        value: fDateTime(ended),
        color: 'success',
        active: true,
      });
    }

    return steps;
  }, [Entrance, isAr]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!Entrance?._id) {
    return (
      <Stack gap={2}>
        <Alert severity="warning">
          {isAr ? 'لم يتم العثور على هذه الزيارة.' : 'This visit could not be found.'}
        </Alert>
        <Box>
          <Button
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-back-fill" width={18} />}
            onClick={() => router.push(paths.employee.appointmentsToday)}
          >
            {isAr ? 'رجوع' : 'Back'}
          </Button>
        </Box>
      </Stack>
    );
  }

  const attended = Boolean(Entrance.Patient_attended);
  const attendedLabel = isAr ? 'تمت المعاينة' : 'Attended';
  const inProgressLabel = isAr ? 'قيد المعاينة' : 'In progress';
  const onlineLabel = isAr ? 'حجز إلكتروني' : 'Booked online';
  const manualLabel = isAr ? 'حجز يدوي' : 'Booked manually';
  const hideLabel = isAr ? 'إخفاء' : 'Hide';
  const showLabel = isAr ? 'عرض' : 'Show';
  const patientAge = age(patient?.birth_date);
  const processTime = asDuration(Entrance.process_time);

  return (
    <Stack spacing={3}>
      {/* ── Back ── */}
      <Box>
        <Button
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-back-fill" width={18} />}
          onClick={() => router.push(paths.employee.appointmentsToday)}
        >
          {isAr ? 'رجوع' : 'Back'}
        </Button>
      </Box>

      {/* ── Header ── */}
      <Card
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.16)}`,
          borderRadius: 2.5,
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: 76,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
              theme.palette.info.main,
              0.1
            )} 100%)`,
          }}
        />
        <CardContent sx={{ p: 2.5, pt: 0 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            gap={2}
            sx={{ mt: -5 }}
          >
            <Avatar
              src={Entrance.patient?.profile_picture || undefined}
              sx={{
                width: 84,
                height: 84,
                fontSize: '1.6rem',
                fontWeight: 700,
                border: `3px solid ${theme.palette.background.paper}`,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              {initials(patientName)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0, pb: 0.5 }}>
              <Typography variant="h5" fontWeight={700} noWrap>
                {patientName}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  color={attended ? 'success' : 'warning'}
                  variant="soft"
                  icon={
                    <Iconify
                      icon={attended ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'}
                      width={15}
                    />
                  }
                  label={attended ? attendedLabel : inProgressLabel}
                />
                {Entrance.Appointment_sequence_number && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${isAr ? 'رقم الموعد' : 'Appt'} #${Entrance.Appointment_sequence_number}`}
                  />
                )}
                {Entrance.bookWay && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={Entrance.bookWay === 'online' ? onlineLabel : manualLabel}
                  />
                )}
                {Entrance.Is_it_Transfer && (
                  <Chip
                    size="small"
                    color="info"
                    variant="soft"
                    label={isAr ? 'محوّل' : 'Transferred in'}
                  />
                )}
                {Entrance.invoiced && (
                  <Chip
                    size="small"
                    color="success"
                    variant="soft"
                    label={isAr ? 'مفوتر' : 'Invoiced'}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ── At a glance ── */}
      <Stack direction="row" flexWrap="wrap" gap={2}>
        <StatTile
          icon="solar:calendar-bold"
          color="primary"
          label={isAr ? 'تاريخ الزيارة' : 'Visit date'}
          value={fDate(Entrance.Appointment_date || Entrance.created_at, 'dd MMM yyyy')}
        />
        <StatTile
          icon="solar:routing-2-bold"
          color="info"
          label={isAr ? 'الأنشطة' : 'Activities'}
          value={Entrance.Number_activities ?? (Entrance.activity_happened || []).length}
        />
        <StatTile
          icon="solar:clock-circle-bold"
          color="warning"
          label={isAr ? 'مدة المعاينة' : 'Time spent'}
          value={Entrance.time_avareg || Entrance.Time_spent_attention || processTime || '—'}
        />
        <StatTile
          icon="solar:wallet-money-bold"
          color="success"
          label={isAr ? 'إجمالي الخدمات' : 'Billed total'}
          value={billed.total > 0 ? `${billed.total} JOD` : '—'}
        />
      </Stack>

      <Grid container spacing={3}>
        {/* ── Visit journey ── */}
        <Grid item xs={12} md={6}>
          <SectionCard
            icon="solar:map-arrow-square-bold"
            color="primary"
            title={isAr ? 'مسار الزيارة' : 'Visit journey'}
          >
            {timeline.length > 0 ? (
              <VisitTimeline steps={timeline} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {isAr ? 'لا توجد أنشطة مسجلة.' : 'No activity recorded for this visit.'}
              </Typography>
            )}

            {(Entrance.rooms || processTime) && <Divider sx={{ my: 2 }} />}
            <InfoRow
              icon="solar:home-2-bold"
              label={isAr ? 'الغرفة' : 'Room'}
              value={nameOf(Entrance.rooms, isAr)}
            />
            <InfoRow
              icon="solar:stopwatch-bold"
              label={isAr ? 'زمن المعالجة' : 'Process time'}
              value={processTime}
            />
            <InfoRow
              icon="solar:sort-by-time-bold"
              label={isAr ? 'ترتيب الوصول' : 'Arrival sequence'}
              value={Entrance.Arrival_sequence}
            />
            <InfoRow
              icon="solar:check-read-bold"
              label={isAr ? 'وصل في الموعد' : 'Arrived on time'}
              value={Entrance.Arrived_on_time}
            />
          </SectionCard>
        </Grid>

        {/* ── Appointment ── */}
        <Grid item xs={12} md={6}>
          <SectionCard
            icon="solar:calendar-mark-bold"
            color="info"
            title={isAr ? 'تفاصيل الموعد' : 'Appointment details'}
          >
            <InfoRow
              icon="solar:hospital-bold"
              label={isAr ? 'العيادة' : 'Clinic'}
              value={nameOf(Entrance.service_unit, isAr)}
            />
            <InfoRow
              icon="solar:calendar-bold"
              label={isAr ? 'موعد الزيارة' : 'Scheduled'}
              value={Entrance.Appointment_date ? fDateTime(Entrance.Appointment_date) : null}
            />
            <InfoRow
              icon="solar:login-3-bold"
              label={isAr ? 'وقت الوصول' : 'Arrival time'}
              value={Entrance.Arrival_time ? fDateTime(Entrance.Arrival_time) : null}
            />
            <InfoRow
              icon="solar:play-circle-bold"
              label={isAr ? 'وقت البدء' : 'Start time'}
              value={Entrance.start_time ? fDateTime(Entrance.start_time) : null}
            />
            <InfoRow
              icon="solar:stop-circle-bold"
              label={isAr ? 'وقت الانتهاء' : 'End time'}
              value={
                Entrance.end_attended_Time || Entrance.end_time
                  ? fDateTime(Entrance.end_attended_Time || Entrance.end_time)
                  : null
              }
            />
            <InfoRow
              icon="solar:tag-bold"
              label={isAr ? 'نوع الموعد' : 'Appointment type'}
              value={nameOf(Entrance.Appoint_Type, isAr)}
            />
            <InfoRow
              icon="solar:users-group-rounded-bold"
              label={isAr ? 'مجموعة العمل' : 'Work group'}
              value={nameOf(Entrance.work_group, isAr)}
            />
            <InfoRow
              icon="solar:clock-square-bold"
              label={isAr ? 'وردية العمل' : 'Work shift'}
              value={nameOf(Entrance.work_shift, isAr)}
            />
            <InfoRow
              icon="solar:course-up-bold"
              label={isAr ? 'موعد نشط' : 'Active appointment'}
              value={Entrance.Active_appointment}
            />
          </SectionCard>
        </Grid>

        {/* ── Patient ── */}
        <Grid item xs={12} md={6}>
          <SectionCard
            icon="solar:user-id-bold"
            color="secondary"
            title={isAr ? 'بيانات المريض' : 'Patient details'}
          >
            <InfoRow
              icon="solar:user-bold"
              label={isAr ? 'الاسم' : 'Name'}
              value={patientName}
            />
            <InfoRow
              icon="solar:card-bold"
              label={isAr ? 'رقم الهوية' : 'ID number'}
              value={patient?.identification_num}
            />
            <InfoRow
              icon="solar:users-group-two-rounded-bold"
              label={isAr ? 'الجنس' : 'Gender'}
              value={patient?.gender}
            />
            <InfoRow
              icon="solar:calendar-date-bold"
              label={isAr ? 'تاريخ الميلاد' : 'Date of birth'}
              value={
                patient?.birth_date
                  ? `${fDate(patient.birth_date, 'dd MMM yyyy')}${
                      patientAge !== null ? ` · ${patientAge} ${isAr ? 'سنة' : 'yrs'}` : ''
                    }`
                  : null
              }
            />
            <InfoRow
              icon="solar:test-tube-bold"
              label={isAr ? 'فصيلة الدم' : 'Blood type'}
              value={patient?.blood_type}
            />
            <InfoRow
              icon="solar:ruler-bold"
              label={isAr ? 'الطول / الوزن' : 'Height / Weight'}
              value={
                patient?.height || patient?.weight
                  ? `${patient?.height || '—'} / ${patient?.weight || '—'}`
                  : null
              }
            />
            <InfoRow
              icon="solar:phone-bold"
              label={isAr ? 'رقم الهاتف' : 'Phone'}
              value={patient?.mobile_num1}
            />
            <InfoRow
              icon="solar:phone-rounded-bold"
              label={isAr ? 'رقم هاتف آخر' : 'Alternate phone'}
              value={patient?.mobile_num2}
            />
            <InfoRow
              icon="solar:letter-bold"
              label={isAr ? 'البريد الإلكتروني' : 'Email'}
              value={patient?.email}
            />
            <InfoRow
              icon="solar:map-point-bold"
              label={isAr ? 'العنوان' : 'Address'}
              value={patient?.address}
            />
          </SectionCard>
        </Grid>

        {/* ── Billed services ── */}
        <Grid item xs={12} md={6}>
          <SectionCard
            icon="solar:bill-list-bold"
            color="success"
            title={isAr ? 'الخدمات المقدمة' : 'Services provided'}
            action={
              billed.rows.length > 0 ? (
                <Chip
                  size="small"
                  color="success"
                  variant="soft"
                  label={`${billed.total} JOD`}
                />
              ) : null
            }
          >
            {billed.rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {isAr
                  ? 'لم تُسجَّل خدمات لهذه الزيارة.'
                  : 'No services recorded for this visit yet.'}
              </Typography>
            ) : (
              <Stack divider={<Divider flexItem />}>
                {billed.rows.map((row) => (
                  <Stack
                    key={row.key}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                    sx={{ py: 1 }}
                  >
                    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
                      <Iconify
                        icon="solar:medical-kit-bold"
                        width={16}
                        sx={{ color: row.known ? 'success.main' : 'text.disabled', flexShrink: 0 }}
                      />
                      <Typography variant="body2" noWrap>
                        {row.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                      {row.price > 0 ? `${row.price} JOD` : '—'}
                    </Typography>
                  </Stack>
                ))}

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ pt: 1.5 }}
                >
                  <Typography variant="subtitle2">{isAr ? 'الإجمالي' : 'Total'}</Typography>
                  <Typography variant="subtitle2" color="success.main">
                    {billed.total} JOD
                  </Typography>
                </Stack>
              </Stack>
            )}
          </SectionCard>
        </Grid>

        {/* ── Notes ── */}
        {(Entrance.patient_note || Entrance.note || Entrance.Transfer_comment) && (
          <Grid item xs={12} md={6}>
            <SectionCard
              icon="solar:notes-bold"
              color="warning"
              title={isAr ? 'الملاحظات' : 'Notes'}
            >
              <Stack gap={2}>
                {Entrance.patient_note && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {isAr ? 'ملاحظة المريض' : 'Patient note'}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {Entrance.patient_note}
                    </Typography>
                  </Box>
                )}
                {Entrance.note && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {isAr ? 'ملاحظة الموعد' : 'Appointment note'}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {Entrance.note}
                    </Typography>
                  </Box>
                )}
                {Entrance.Transfer_comment && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {isAr ? 'ملاحظة التحويل' : 'Transfer comment'}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {Entrance.Transfer_comment}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </SectionCard>
          </Grid>
        )}

        {/* ── Reports & transfers ── */}
        <Grid item xs={12} md={6}>
          <SectionCard
            icon="solar:clipboard-heart-bold"
            color="error"
            title={isAr ? 'التقارير والتحويلات' : 'Reports & transfers'}
          >
            <InfoRow
              icon="solar:document-medicine-bold"
              label={isAr ? 'حالة تقرير الأدوية' : 'Drugs report'}
              value={Entrance.Drugs_report_status}
            />
            <InfoRow
              icon="solar:document-text-bold"
              label={isAr ? 'حالة التقرير الطبي' : 'Medical report'}
              value={Entrance.medical_report_status}
            />
            <InfoRow
              icon="solar:hospital-bold"
              label={isAr ? 'تحويل إلى مستشفى' : 'Transfer to hospital'}
              value={Entrance.Transfer_to_hospital}
            />
            <InfoRow
              icon="solar:test-tube-bold"
              label={isAr ? 'تحويل إلى مختبر' : 'Transfer to laboratory'}
              value={Entrance.Transfer_to_laboratory}
            />
            <InfoRow
              icon="solar:stethoscope-bold"
              label={isAr ? 'تحويل إلى طبيب' : 'Transfer to doctor'}
              value={Entrance.Transfer_to_doctor}
            />
            <InfoRow
              icon="solar:import-bold"
              label={isAr ? 'محوّل من' : 'Transferred from'}
              value={nameOf(Entrance.From_US, isAr) || nameOf(Entrance.From_Employ, isAr)}
            />
            {!Entrance.Drugs_report_status &&
              !Entrance.medical_report_status &&
              !Entrance.Transfer_to_hospital &&
              !Entrance.Transfer_to_laboratory &&
              !Entrance.Transfer_to_doctor && (
                <Typography variant="body2" color="text.secondary">
                  {isAr ? 'لا توجد تقارير أو تحويلات.' : 'No reports or transfers on this visit.'}
                </Typography>
              )}
          </SectionCard>
        </Grid>

        {/* ── Record details ── */}
        <Grid item xs={12}>
          <SectionCard
            icon="solar:info-circle-bold"
            color="info"
            title={isAr ? 'بيانات السجل' : 'Record details'}
            action={
              <Button
                size="small"
                color="inherit"
                onClick={() => setShowMeta((prev) => !prev)}
                endIcon={
                  <Iconify
                    icon={showMeta ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                    width={16}
                  />
                }
              >
                {showMeta ? hideLabel : showLabel}
              </Button>
            }
          >
            <Collapse in={showMeta}>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <InfoRow label={isAr ? 'رمز السجل' : 'Record code'} value={Entrance.code} />
                  <InfoRow
                    label={isAr ? 'تاريخ الإنشاء' : 'Created'}
                    value={Entrance.created_at ? fDateTime(Entrance.created_at) : null}
                  />
                  <InfoRow
                    label={isAr ? 'آخر تعديل' : 'Last modified'}
                    value={Entrance.updated_at ? fDateTime(Entrance.updated_at) : null}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    label={isAr ? 'عدد التعديلات' : 'Modifications'}
                    value={Entrance.modifications_nums ?? Entrance.Number_modifications}
                  />
                  <InfoRow
                    label={isAr ? 'متاح إلكترونياً' : 'Online available'}
                    value={Entrance.online_available}
                  />
                  <InfoRow
                    label={isAr ? 'سجل أصلي' : 'Original register'}
                    value={Entrance.Originality_register}
                  />
                </Grid>
              </Grid>
            </Collapse>

            {!showMeta && (
              <Typography variant="body2" color="text.secondary">
                {isAr
                  ? 'بيانات الإنشاء والتعديل والتتبع.'
                  : 'Creation, modification and tracking data.'}
              </Typography>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
