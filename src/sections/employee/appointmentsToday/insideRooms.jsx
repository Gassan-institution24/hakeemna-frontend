import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGeEntrancePrescription,
  useGetOneEntranceManagement,
  useGetEntranceDoctorReports,
  useGetEntranceExaminationReports,
} from 'src/api';

import Iconify from 'src/components/iconify';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTextWithLineBreaks = (text) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.reduce(
    (formattedText, word, index) =>
      formattedText + word + ((index + 1) % 20 === 0 ? '<br />' : ' '),
    ''
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Rooms() {
  const [noteContent, setNoteContent] = useState('');
  const [confirmRoomsdata, setConfirmRoomsdata] = useState(null);
  const dialog = useBoolean(false);
  const endDialog = useBoolean(false);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const theme = useTheme();

  const { Entrance, refetch } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { user } = useAuthContext();
  const router = useRouter();

  const methods = useForm({ mode: 'all' });
  const { reset } = methods;

  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { medicalreportsdata } = useGetEntranceExaminationReports(id);
  const { doctorreportsdata } = useGetEntranceDoctorReports(id);
  const { prescriptionData } = useGeEntrancePrescription(id);

  const medicalReportIds = medicalreportsdata?.map((report) => report._id);
  const doctorReportIds = doctorreportsdata?.map((report) => report._id);
  const prescriptionIds = prescriptionData?.map((report) => report._id);

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      unit_service_patient: Entrance?.unit_service_patient,
      service_unit: Entrance?.service_unit?._id,
      unit_service:
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
      appointment: Entrance?.appointmentId,
    });
  }, [user, Entrance, reset]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const processingPage = async (rooms) => {
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Last_activity_atended: Entrance?.Next_activity,
        Next_activity: rooms?.activities?._id,
        note: noteContent,
        rooms: rooms?._id,
      });
      await axiosInstance.patch(`/api/rooms/${rooms?._id}`, {
        patient: null,
        entranceMangament: null,
      });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleEndAppointment = async () => {
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Patient_attended: true,
        note: noteContent,
      });
      await axiosInstance.patch(`/api/appointments/${Entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
        appointment: Entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
        unit_service_patient: Entrance?.unit_service_patient,
      });
      await axiosInstance.post('/api/medrecord/', {
        appointmentId: Entrance?.appointmentId,
        Appointment_date: Entrance?.Appointment_date,
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
        service_unit: Entrance?.service_unit,
        patient: Entrance?.patient?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        medical_report: medicalReportIds,
        doctor_report: doctorReportIds,
        Drugs_report: prescriptionIds,
      });

      const historyId = localStorage.getItem(`historyId${Entrance?.appointmentId}`);
      await axiosInstance.patch(endpoints.history.end_appointment(historyId), {
        end_time: new Date(),
      });

      localStorage.removeItem(`historyId${Entrance?.appointmentId}`);
      enqueueSnackbar(t('appointment finished'), { variant: 'success' });
      refetch();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };

  // ─── Derived ──────────────────────────────────────────────────────────────

  const currentActivityName = curLangAr
    ? Entrance?.Current_activity?.name_arabic || Entrance?.Current_activity?.name_english
    : Entrance?.Current_activity?.name_english;

  const lastActivityName = curLangAr
    ? Entrance?.Last_activity_atended?.name_arabic || Entrance?.Last_activity_atended?.name_english
    : Entrance?.Last_activity_atended?.name_english;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Move to room confirmation dialog ── */}
      <Dialog open={dialog.value} maxWidth="xs" onClose={dialog.onFalse} fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.info.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Iconify icon="solar:transfer-horizontal-bold-duotone" sx={{ color: 'info.main' }} width={22} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('Are you sure')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('please confirm moving the patient to ')}{' '}
                <strong>
                  {curLangAr ? confirmRoomsdata?.name_arabic : confirmRoomsdata?.name_english}
                </strong>
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: '8px !important' }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.06),
              border: `1px solid ${alpha(theme.palette.info.main, 0.18)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Iconify icon="solar:door-open-bold" sx={{ color: 'info.main' }} width={24} />
            <Typography variant="body2" fontWeight={600}>
              {curLangAr ? confirmRoomsdata?.name_arabic : confirmRoomsdata?.name_english}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2 }}>
          <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
            onClick={() => {
              dialog.onFalse();
              processingPage(confirmRoomsdata);
            }}
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── End appointment confirmation dialog ── */}
      <Dialog open={endDialog.value} maxWidth="xs" onClose={endDialog.onFalse} fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.error.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Iconify icon="solar:check-circle-bold-duotone" sx={{ color: 'error.main' }} width={22} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('End Appointment')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('This will finalize the appointment')}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: '8px !important' }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.error.main, 0.06),
              border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
            }}
          >
            <Typography variant="body2" color="error.dark">
              {t('Are you sure you want to end this appointment? This action cannot be undone.')}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2 }}>
          <Button variant="outlined" color="inherit" onClick={endDialog.onFalse}>
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="solar:check-circle-bold" width={16} />}
            onClick={() => {
              endDialog.onFalse();
              handleEndAppointment();
            }}
          >
            {t('end appointment')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Page body ── */}
      <Grid container spacing={3}>

        {/* ── Left panel: Activity info ── */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2.5} height="100%">

            {/* Current room card */}
            <Card
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
                borderRadius: 2.5,
                boxShadow: 'none',
              }}
            >
              {/* top accent */}
              <Box sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'info.main', opacity: 0.7 }} />
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Iconify icon="solar:map-point-bold-duotone" sx={{ color: 'info.main' }} width={22} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('Current Location')}
                  </Typography>
                </Stack>
                <Chip
                  icon={<Iconify icon="solar:door-open-bold" width={16} />}
                  label={currentActivityName || t('Reception')}
                  color="info"
                  sx={{ fontWeight: 700, fontSize: '0.8rem', px: 0.5 }}
                />
              </CardContent>
            </Card>

            {/* Last activity card */}
            <Card
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
                borderRadius: 2.5,
                boxShadow: 'none',
              }}
            >
              <Box sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'warning.main', opacity: 0.7 }} />
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="solar:history-bold-duotone" sx={{ color: 'warning.main' }} width={22} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('Last activity')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {lastActivityName || '—'}
                </Typography>
              </CardContent>
            </Card>

            {/* Doctor message card */}
            <Card
              sx={{
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
                borderRadius: 2.5,
                boxShadow: 'none',
              }}
            >
              <Box sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'secondary.main', opacity: 0.7 }} />
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="solar:stethoscope-bold-duotone" sx={{ color: 'secondary.main' }} width={22} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('Doctor Message')}
                  </Typography>
                </Stack>

                {Entrance?.note ? (
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={{ __html: formatTextWithLineBreaks(Entrance.note) }}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled" fontStyle="italic">
                    {t('No message')}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ── Right panel: Next activity actions ── */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              height: '100%',
              border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
              borderRadius: 2.5,
              boxShadow: 'none',
            }}
          >
            <Box sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'primary.main', opacity: 0.7 }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                <Iconify icon="solar:arrow-right-up-bold-duotone" sx={{ color: 'primary.main' }} width={22} />
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('Next Activity')}
                </Typography>
              </Stack>

              {/* Note field */}
              <TextField
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t('Add Message')}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />

              <Divider sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.65rem' }}>
                  {t('Choose next room')}
                </Typography>
              </Divider>

              {/* Room buttons grid */}
              <Grid container spacing={1.5} mb={3}>
                {roomsData?.map((rooms, index) => {
                  const isCurrent =
                    Entrance?.Current_activity?.name_english === rooms?.activities?.name_english;

                  const employeeNames = Array.isArray(rooms.employee)
                    ? rooms.employee.map((emp) => emp.name_english).filter(Boolean).join(', ')
                    : '';

                  const roomLabel = curLangAr ? rooms?.name_arabic : rooms?.name_english;

                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        fullWidth
                        variant={isCurrent ? 'outlined' : 'contained'}
                        color={isCurrent ? 'inherit' : 'primary'}
                        disabled={isCurrent}
                        startIcon={
                          <Iconify
                            icon={isCurrent ? 'solar:map-point-bold' : 'solar:door-open-bold'}
                            width={18}
                          />
                        }
                        onClick={() => {
                          if (!isCurrent) {
                            setConfirmRoomsdata(rooms);
                            dialog.onTrue();
                          }
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          px: 2,
                          py: 1.25,
                          borderRadius: 1.5,
                          textAlign: 'left',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 0.25,
                          height: 'auto',
                          ...(isCurrent && {
                            borderColor: alpha(theme.palette.grey[500], 0.32),
                            bgcolor: alpha(theme.palette.grey[500], 0.06),
                            color: 'text.disabled',
                          }),
                        }}
                      >
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {isCurrent ? `${roomLabel} (${t('Current')})` : roomLabel}
                        </Typography>
                        {employeeNames && (
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.75,
                              fontSize: '0.65rem',
                              whiteSpace: 'normal',
                              lineHeight: 1.3,
                            }}
                          >
                            {employeeNames}
                          </Typography>
                        )}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>

              <Divider sx={{ mb: 2.5 }} />

              {/* End appointment */}
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
                onClick={endDialog.onTrue}
                sx={{ borderRadius: 1.5, py: 1.5, fontSize: '0.9rem' }}
              >
                {t('end appointment')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
