import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Chip,
  Grid,
  Stack,
  Paper,
  Tabs,
  Avatar,
  Button,
  Select,
  Dialog,
  Divider,
  MenuItem,
  Tooltip,
  Container,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFDateTimeUnit } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGetEntranceManagement,
  useGetUsAppointmentsToday,
  useGetfinishedAppointments,
} from 'src/api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import WaitingRoom from 'src/sections/employee/appointmentsToday/rooms';

import NewAppointmentDialog from './new-patient/new-patient';

// ─── Helper ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
}

// ─── Avatar colour palette (cycles by index) ─────────────────────────────────

const AVATAR_COLORS = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AppointmentsToday() {
  const checkAcl = useAclGuard();
  const { fTimeUnit } = useFDateTimeUnit();
  const [currentTab, setCurrentTab] = useState('one');

  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();

  const [selectedTitles, setSelectedTitles] = useState({});
  const [pateintInfo, setPatientInfo] = useState('');
  const addingId = '';
  const dialog = useBoolean(false);
  const [newDialog, setNewDialog] = useState(false);

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { appointmentsData, refetch } = useGetUsAppointmentsToday(unitServiceId);
  const { entrance, refetch2 } = useGetEntranceManagement(unitServiceId);
  const { roomsData } = useGetUSRooms(unitServiceId);
  const { finishedAppointmentsData, refetch3 } = useGetfinishedAppointments(unitServiceId);

  const receptionActivity = roomsData.find((activity) => activity?.name_english === 'Reception');
  const roomsEntranceOnly = entrance?.filter(
    (e) => e?.Next_activity && e?.Next_activity !== receptionActivity?.activities?._id
  );

  const TABS = [
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'appointment' }) && {
      value: 'one',
      label: t('Appointments Today'),
      color: 'info',
      count: appointmentsData?.length,
      data: appointmentsData,
    },
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'rooms' }) && {
      value: 'two',
      label: t('Rooms'),
      color: 'warning',
      count: roomsEntranceOnly?.length,
      data: entrance,
    },
    checkAcl({ category: 'unit_service', subcategory: 'entrance', acl: 'finished' }) && {
      value: 'three',
      label: t('Finished'),
      color: 'success',
      count: finishedAppointmentsData?.length,
      data: finishedAppointmentsData,
    },
  ].filter(Boolean);

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);
  const currentTabData = TABS.find((tab) => tab.value === currentTab);

  const canAccessRooms = checkAcl({
    category: 'unit_service',
    subcategory: 'entrance',
    acl: 'rooms',
  });

  // ─── Business logic (unchanged) ────────────────────────────────────────────

  const getPatientName = (info) => {
    if (info?.patient?.name_english) {
      return curLangAr ? info.patient.name_arabic : info.patient.name_english;
    }
    if (info?.unit_service_patient?.name_english) {
      return curLangAr
        ? info.unit_service_patient.name_arabic
        : info.unit_service_patient.name_english;
    }
    return t('Patient');
  };

  const startAppointment = async (info) => {
    try {
      const entranceData = await axiosInstance.post(endpoints.entranceManagement.all, {
        patient: info?.patient?._id,
        unit_service_patient: info?.unit_service_patient?._id,
        patient_note: info?.note,
        start_time: new Date().toISOString(),
        Appointment_date: info?.start_time,
        service_unit: info?.unit_service?._id,
        appointmentId: info?._id,
        work_group: info?.work_group?._id,
        Last_activity_atended: info?.Last_activity_atended,
        Arrival_time: info?.created_at,
      });
      const historyRes = await axiosInstance.post(endpoints.history.all, {
        appointmentId: info?._id,
        patient: info?.patient?._id,
        unit_service_patient: info?.unit_service_patient?._id,
        work_group: info?.work_group?._id,
        entrance: info?.entrance,
        actual_date: info?.created_at,
        service_unit: info?.unit_service?._id,
        appointment: true,
        activity_id: receptionActivity?._id,
        start_time: new Date().toISOString(),
      });

      const historyId = historyRes.data?._id;
      if (historyId) {
        localStorage.setItem(`historyId${info._id}`, historyId);
      }
      const dataToUpdate = {
        started: true,
        entrance: entranceData?.data?._id,
        arrived: true,
      };
      if (addingId) {
        dataToUpdate.identification_num = addingId;
      }
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, dataToUpdate);
      refetch();
      enqueueSnackbar(t('Appointment started'), { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error updating status'), { variant: 'error' });
    }
  };

  const StatusFunction = async (info, status, alert) => {
    try {
      const updateField = alert === 'coming' ? { coming: status } : { arrived: status };
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, updateField);
      refetch();
      enqueueSnackbar(`${getPatientName(info)} ${t(alert)}`, { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error updating status'), { variant: 'error' });
    }
  };

  const dialogOnTrue = (info) => {
    dialog.onTrue();
    setPatientInfo(info);
  };

  const updateAppointmentactivity = async (activityId, info) => {
    try {
      const savedHistoryId = localStorage.getItem(`historyId${info._id}`);
      if (!info?.entrance) {
        enqueueSnackbar(t('Appointment must be started first before selecting next activity'), {
          variant: 'error',
        });
        return;
      }
      await axiosInstance.patch(`${endpoints.entranceManagement.one(info?.entrance)}`, {
        Next_activity: activityId,
      });
      await axiosInstance.patch(`${endpoints.appointments.one(info?._id)}`, {
        activityhappend: true,
      });
      await axiosInstance.patch(endpoints.history.one(savedHistoryId), {
        activity_id: activityId,
        end_time: new Date().toISOString(),
        start_time: new Date().toISOString(),
      });
      refetch();
      refetch2();
      if (canAccessRooms) {
        setCurrentTab('two');
      }
      enqueueSnackbar(t('Appointment started'), { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error starting appointment'), { variant: 'error' });
    }
  };

  const handlePatientClick = (info) => {
    router.push(`/dashboard/mypatients/${info?.unit_service_patient?._id}`);
  };

  const handleEndAppointment = async (appointmentdata) => {
    try {
      const savedHistoryId = localStorage.getItem(`historyId${appointmentdata._id}`);
      await axiosInstance.patch(`/api/entrance/${appointmentdata?.entrance}`, {
        Patient_attended: true,
      });
      await axiosInstance.patch(`/api/appointments/${appointmentdata?._id}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: appointmentdata?.unit_service?._id,
        appointment: appointmentdata?._id,
        patient: appointmentdata?.patient?._id,
        unit_service_patient: appointmentdata?.unit_service_patient?._id,
      });
      await axiosInstance.patch(`/api/history/${savedHistoryId}`, {
        end_date: new Date().toISOString(),
      });
      localStorage.removeItem(`historyId${appointmentdata._id}`);
      enqueueSnackbar(t('appointment finished'), { variant: 'success' });
      refetch();
      refetch2();
      refetch3();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('something went wrong'), { variant: 'error' });
    }
  };

  const getCurrentRoomName = (info) => {
    if (!info?.entrance || !entrance?.length) return t('Reception');
    const entranceRecord = entrance.find((e) => e._id === info.entrance);
    if (!entranceRecord?.Next_activity) return t('Reception');
    const room = roomsData.find((r) => r.activities?._id === entranceRecord.Next_activity);
    return curLangAr ? room?.name_arabic : room?.name_english;
  };

  const isInReception = (info) => {
    const entranceRecord = entrance.find((e) => e._id === info.entrance);
    if (!entranceRecord) return true;
    return (
      !entranceRecord.Next_activity ||
      entranceRecord.Next_activity === receptionActivity?.activities?._id
    );
  };

  useEffect(() => {
    setCurrentTab(TABS[0].value);
    // eslint-disable-next-line
  }, []);

  // ─── UI helpers ────────────────────────────────────────────────────────────

  const getStatusChip = (info) => {
    if (info?.arrived)
      return (
        <Chip
          size="small"
          label={t('Arrived')}
          color="success"
          icon={<Iconify icon="solar:check-circle-bold" width={14} />}
          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
        />
      );
    if (info?.coming === true)
      return (
        <Chip
          size="small"
          label={t('Coming')}
          color="info"
          icon={<Iconify icon="solar:walking-bold" width={14} />}
          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
        />
      );
    if (info?.coming === false)
      return (
        <Chip
          size="small"
          label={t('Not Coming')}
          color="error"
          icon={<Iconify icon="solar:close-circle-bold" width={14} />}
          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
        />
      );
    return (
      <Chip
        size="small"
        label={t('Pending')}
        color="warning"
        variant="outlined"
        icon={<Iconify icon="solar:clock-circle-outline" width={14} />}
        sx={{ fontWeight: 700, fontSize: '0.68rem' }}
      />
    );
  };

  // ─── Card renderer ─────────────────────────────────────────────────────────

  const renderAppointmentCard = (info, index) => {
    const patientName = getPatientName(info);
    const isFinishedTab = currentTab === 'three';
    const canShowRoomSelect = isInReception(info);
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
      <Grid item xs={12} sm={6} md={4} xl={3} key={info._id || index}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
            borderRadius: 2.5,
            boxShadow: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 32px ${alpha(theme.palette.grey[500], 0.2)}`,
            },
          }}
        >
          {/* Coloured top accent bar */}
          <Box
            sx={{
              height: 4,
              borderRadius: '10px 10px 0 0',
              bgcolor: `${avatarColor}.main`,
              opacity: 0.7,
            }}
          />

          <CardContent sx={{ p: 2.5, pb: '20px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* ── Header ── */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
              <Stack direction="row" spacing={1.5} alignItems="center" flex={1} minWidth={0}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: alpha(theme.palette[avatarColor]?.main || theme.palette.primary.main, 0.12),
                    color: `${avatarColor}.main`,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(patientName)}
                </Avatar>

                <Box minWidth={0} flex={1}>
                  <Tooltip title={t("Click to view patient file")} placement="top" arrow>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      noWrap
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() => handlePatientClick(info)}
                    >
                      {patientName}
                    </Typography>
                  </Tooltip>

                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                    <Iconify icon="solar:clock-circle-outline" width={13} sx={{ color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled" fontWeight={500}>
                      {fTimeUnit(info?.start_time, 'p', true)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {!isFinishedTab && getStatusChip(info)}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* ── Body ── */}
            <Box flex={1}>
              {isFinishedTab ? (
                // ── Finished tab ──
                <Stack spacing={1}>
                  <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    color="info"
                    startIcon={<Iconify icon="solar:eye-bold" width={15} />}
                    onClick={() =>
                      router.push(`${paths.unitservice.departments.viewgPage}/${info?._id}`)
                    }
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {t('View')}
                  </Button>

                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="solar:bill-list-bold" width={15} />}
                    onClick={() =>
                      router.push(
                        `${paths.unitservice.accounting.economicmovements.add}?appointment=${info?.appointmentId}&&entrance=${info?._id}`
                      )
                    }
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {t('make an invoice')}
                  </Button>
                </Stack>
              ) : (
                <>
                  {/* ── Coming / Arrived status row ── */}
                  <Stack direction="row" spacing={2} mb={2}>
                    {/* Coming */}
                    <Box flex={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{
                          display: 'block',
                          mb: 0.75,
                          textTransform: 'uppercase',
                          letterSpacing: 0.6,
                          fontSize: '0.62rem',
                        }}
                      >
                        {t('Coming')}
                      </Typography>

                      {info?.coming !== undefined ? (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon={info.coming ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                            width={18}
                            sx={{ color: info.coming ? 'success.main' : 'error.main' }}
                          />
                          <Typography
                            variant="caption"
                            color={info.coming ? 'success.main' : 'error.main'}
                            fontWeight={700}
                          >
                            {info.coming ? t('Yes') : t('No')}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={0.5}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => StatusFunction(info, true, 'coming')}
                            sx={{ minWidth: 0, px: 1.5, py: 0.4, fontSize: '0.7rem', lineHeight: 1.5 }}
                          >
                            {t('Yes')}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => StatusFunction(info, false, 'coming')}
                            sx={{ minWidth: 0, px: 1.5, py: 0.4, fontSize: '0.7rem', lineHeight: 1.5 }}
                          >
                            {t('No')}
                          </Button>
                        </Stack>
                      )}
                    </Box>

                    {/* Arrived */}
                    <Box flex={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{
                          display: 'block',
                          mb: 0.75,
                          textTransform: 'uppercase',
                          letterSpacing: 0.6,
                          fontSize: '0.62rem',
                        }}
                      >
                        {t('Arrived')}
                      </Typography>

                      {info?.arrived !== undefined ? (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon={info.arrived ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                            width={18}
                            sx={{ color: info.arrived ? 'success.main' : 'error.main' }}
                          />
                          <Typography
                            variant="caption"
                            color={info.arrived ? 'success.main' : 'error.main'}
                            fontWeight={700}
                          >
                            {info.arrived ? t('Yes') : t('No')}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={0.5}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => startAppointment(info)}
                            sx={{ minWidth: 0, px: 1.5, py: 0.4, fontSize: '0.7rem', lineHeight: 1.5 }}
                          >
                            {t('Yes')}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => StatusFunction(info, false, 'arrived')}
                            sx={{ minWidth: 0, px: 1.5, py: 0.4, fontSize: '0.7rem', lineHeight: 1.5 }}
                          >
                            {t('No')}
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  </Stack>

                  {/* ── Room / End appointment ── */}
                  {info?.arrived ? (
                    <Stack spacing={1}>
                      {canShowRoomSelect ? (
                        <Select
                          size="small"
                          fullWidth
                          value={selectedTitles[info._id] || ''}
                          displayEmpty
                          onChange={(e) => {
                            setSelectedTitles((prev) => ({ ...prev, [info._id]: e.target.value }));
                            updateAppointmentactivity(e.target.value, info);
                          }}
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <MenuItem value="" disabled sx={{ display: 'none' }}>
                            {t('Next activity')}
                          </MenuItem>
                          {roomsData.map(
                            (activity) =>
                              activity?.activities?.name_english !==
                                receptionActivity?.activities?.name_english && (
                                <MenuItem key={activity._id} value={activity?.activities?._id}>
                                  {curLangAr ? activity?.name_arabic : activity?.name_english}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      ) : (
                        <Chip
                          size="small"
                          color="info"
                          icon={<Iconify icon="solar:door-open-bold" width={14} />}
                          label={getCurrentRoomName(info)}
                          sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                        />
                      )}

                      {isInReception(info) && (
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<Iconify icon="solar:close-circle-bold" width={16} />}
                          onClick={() => handleEndAppointment(info)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {t('end appointment')}
                        </Button>
                      )}
                    </Stack>
                  ) : (
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<Iconify icon="material-symbols:call" width={16} />}
                      onClick={() => dialogOnTrue(info?.patient)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {t('Contact')}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // ─── Empty state ───────────────────────────────────────────────────────────

  const renderEmptyState = () => (
    <Box
      sx={{
        py: 10,
        textAlign: 'center',
        borderRadius: 3,
        border: `1.5px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
        bgcolor: alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Iconify
        icon="solar:calendar-search-bold-duotone"
        width={72}
        sx={{ color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {t('No appointments found')}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {t('There are no appointments scheduled for today')}
      </Typography>
    </Box>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Contact Patient Dialog ── */}
      <Dialog open={dialog.value} maxWidth="xs" onClose={dialog.onFalse} fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.success.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Iconify icon="material-symbols:call" sx={{ color: 'success.main' }} width={22} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('Contact patient')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('Thoos are some data the pateint provide to contact')}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: '8px !important' }}>
          <Stack spacing={1.5}>
            {[pateintInfo?.mobile_num1, pateintInfo?.mobile_num2]
              .filter(Boolean)
              .map((num, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    bgcolor: alpha(theme.palette.success.main, 0.04),
                  }}
                >
                  <Iconify icon="material-symbols:call" sx={{ color: 'success.main' }} width={20} />
                  <Typography variant="body1" fontWeight={600}>
                    {num}
                  </Typography>
                </Paper>
              ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pt: 2 }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              dialog.onFalse();
              setPatientInfo('');
            }}
          >
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Page ── */}
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Appointments Today')}
          links={[{ name: curLangAr ? user.employee?.name_arabic : user.employee?.name_english }]}
          action={
            checkAcl({
              category: 'work_group',
              subcategory: 'appointments',
              acl: 'create',
            }) && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  href={paths.employee.appointments.book}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('book appointment')}
                </Button>

                <Button
                  onClick={() => setNewDialog(true)}
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('create & book appointment')}
                </Button>

                <Button
                  component={RouterLink}
                  href={paths.employee.qrCode}
                  target="_blank"
                  rel="noopener"
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="eva:qr-code-fill" />}
                >
                  {t('Confirm Arrival')}
                </Button>
              </Stack>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* ── Tabs ── */}
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 2.5,
            mb: 3,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab, idx) => (
            <Tab
              key={idx}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={<Label color={tab.color}>{tab.count}</Label>}
            />
          ))}
        </Tabs>

        {/* ── Tab content ── */}
        {currentTab === 'two' ? (
          <WaitingRoom />
        ) : (
          <>
            {!currentTabData?.data?.length ? (
              renderEmptyState()
            ) : (
              <Grid container spacing={2.5}>
                {currentTabData?.data?.map((info, index) => renderAppointmentCard(info, index))}
              </Grid>
            )}
          </>
        )}
      </Container>

      <NewAppointmentDialog refetch={refetch} open={newDialog} close={() => setNewDialog(false)} />
    </>
  );
}
