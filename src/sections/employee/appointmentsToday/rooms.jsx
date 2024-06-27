import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import { Button, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetOneEntranceManagement } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function Rooms() {
  const { t } = useTranslate();
  const [showAlert, setShowAlert] = useState(false);

  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });

  const { reset } = methods;
  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
    });
  }, [user, Entrance, reset]);
  const handleEndAppointment = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Patient_attended: true,
        wating: false,
      });
      await axiosInstance.patch(`/api/appointments/${entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: Entrance?.unit_service?._id,
        appointment: Entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
      });
      await axiosInstance.post(`/api/medrecord/`, {
        appointmentId: entrance?.appointmentId,
        Appointment_date: Entrance?.Appointment_date,
        service_unit: Entrance?.service_unit?._id,
        patient: Entrance?.patient?._id,
      });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('no', { variant: 'error' });
    }
  };
  return (
    <>
      {showAlert && (
        <Grow in={showAlert} timeout={600}>
          <Alert
            severity="info"
            variant="filled"
            sx={{ width: '100%', mb: 2 }}
            action={
              <>
                <Button
                  color="inherit"
                  size="small"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.48)}`,
                  }}
                  onClick={() => setShowAlert(false)}
                >
                  {t('Cancel')}
                </Button>

                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  sx={{
                    bgcolor: 'info.dark',
                  }}
                  onClick={() => {
                    setShowAlert(false);
                    handleEndAppointment(Entrance);
                  }}
                >
                  {t('Confirm')}
                </Button>
              </>
            }
          >
            {t('Please confirm the delettion of ')}
          </Alert>
        </Grow>
      )}
      <>
        last activity <br />
        Dr message:
        <Typography>the patient need a surgery now</Typography>
      </>
      <Divider sx={{ height: 10, mb: 1 }} />
      Next activity <br />
      <Button
        onClick={() => alert('test')}
        variant="contained"
        sx={{ bgcolor: 'success.main', mr: 1, mt: 1 }}
      >
        wating
      </Button>
      <Button
        onClick={() => alert('test')}
        variant="contained"
        disabled
        sx={{ bgcolor: 'success.main', mr: 1, mt: 1 }}
      >
        surgery
      </Button>
      <Button
        onClick={() => setShowAlert(true)}
        variant="contained"
        sx={{ bgcolor: 'error.main', mt: 1 }}
      >
        end appointment
      </Button>
    </>
  );
}
