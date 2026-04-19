import PropTypes from 'prop-types';
import { useParams } from 'react-router';

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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustable_document';
import {
  useGetPatient,
  useGetMedRecord,
  useGetMyCheckLists,
  useGetUSServiceTypes,
  useGetOneEntranceManagement,
} from 'src/api';

import Iconify from 'src/components/iconify';

import Rooms from './inside-rooms';
import TabsView from './tabs-view';
import CheckList from './check-list';
import ServicesProvided from './servicesProvided';
import Adjustabledocument from './adjustabledocument';

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

  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Stack spacing={3}>
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

      {/* ── Optional: Visits history ── */}
      {medRecord?.length > 0 && (
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
      {CheckListData?.length > 0 && (
        <SectionCard
          icon="octicon:checklist-16"
          color="info"
          title={t('Choose a Check List')}
          theme={theme}
        >
          <CheckList />
        </SectionCard>
      )}

      {/* ── Clinical forms (always shown) ── */}
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

      {/* ── Optional: Adjustable document ── */}
      {adjustabledocument?.length > 0 && (
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
      {serviceTypesData > 0 && (
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
  );
}
