import { useTranslate,useLocales } from 'src/locales';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUnitservice } from 'src/api/unit_services';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useGetQrCodeAppointments } from 'src/api/appointments';
import { useAuthContext } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';
import axiosInstance, { endpoints } from 'src/utils/axios';
import AppointmentCard from './appointmentCard';

export default function ConfirmArrival() {
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const isArabic = currentLang.value === 'ar';
  // Parse query params
  const params = new URLSearchParams(location.search);
  const unitServiceId = params.get('unitServiceId');
  const token = params.get('token');
  const { appointmentsData: appointments, isLoading: appointmentsLoading } = useGetQrCodeAppointments(unitServiceId, user?.patient?._id);
  const { data: unitService, isLoading } = useGetUnitservice(unitServiceId);

  const handleConfirmArrival = async (appointment) => {
    const entranceData = await axiosInstance.post(endpoints.entranceManagement.all, {
      patient: appointment?.patient?._id,
      unit_service_patient: appointment?.unit_service_patient?._id,
      patient_note: appointment?.note,
      start_time: new Date().toISOString(),
      Appointment_date: appointment?.start_time,
      service_unit: appointment?.unit_service?._id,
      appointmentId: appointment?._id,
      work_group: appointment?.work_group?._id,
      Last_activity_atended: appointment?.Last_activity_atended,
      Arrival_time: appointment?.created_at,
    });
    const dataToUpdate = {
      started: true,
      entrance: entranceData?.data?._id,
      arrived: true,
    };

    await axiosInstance.patch(`${endpoints.appointments.one(appointment?._id)}`, dataToUpdate);
    enqueueSnackbar(t('Appointment started successfully'), {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (!unitServiceId || !token) {
      navigate('/dashboard/user/', { replace: true });
    }
  }, [unitServiceId, token, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (unitService?.QrCodeToken !== token) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={3}>
        <Typography variant="h4" color="error" gutterBottom>
          {t('Invalid or expired QR code link')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('The link you used is invalid or has expired. Please request a new QR code or contact the unit of service.')}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard/user/', { replace: true })}>
          {t('Return to Home Page')}
        </Button>
      </Box>
    );
  }

  // Dummy appointments data for structure (replace with real data as needed)
//   const appointments = [
//     {
//       date: '2024-07-10 10:00',
//       doctor: 'Dr. Mario Nan Louka',
//       doctorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//       department: 'Cardiology',
//       status: 'Scheduled',
//       type: 'Consultation',
//       notes: 'Please arrive 10 minutes early.'
//     },
//     {
//       date: '2024-07-10 12:00',
//       doctor: 'Dr. Adel Ayman',
//       doctorAvatar: 'https://randomuser.me/api/portraits/men/33.jpg',
//       department: 'Neurology',
//       status: 'Scheduled',
//       type: 'Follow-up',
//       notes: 'Bring previous reports.'
//     }
//   ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
        {t("Your appointments today at")} {isArabic ? unitService?.name_arabic : unitService?.name_english}
      </Typography>
      
      {appointments && appointments.length > 0 ? (
        <Stack spacing={4} sx={{ width: '100%' }}>
          {appointments.map((appointment, idx) => (
            <AppointmentCard key={idx} appointment={appointment} t={t} handleConfirmArrival={handleConfirmArrival} />
          ))}
        </Stack>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh" gap={3}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t('No appointments found')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            {t('You don\'t have any appointments scheduled for today at this unit of service.')}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/dashboard/user/', { replace: true })}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {t('Return to Home Page')}
          </Button>
        </Box>
      )}
    </Box>
  );
}