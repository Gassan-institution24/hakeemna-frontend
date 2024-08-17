import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Button,
  Select,
  Dialog,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetUSRooms,
  useGeEntrancePrescription,
  useGetOneEntranceManagement,
  useGetEntranceDoctorReports,
  useGetEntranceExaminationReports,
} from 'src/api';

import Image from 'src/components/image';

import next from './images/next.png';

const formatTextWithLineBreaks = (text) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.reduce(
    (formattedText, word, index) =>
      formattedText + word + ((index + 1) % 20 === 0 ? '<br />' : ' '),
    ''
  );
};

export default function Rooms() {
  const [noteContent, setNoteContent] = useState('');
  const [Confirmdroomsdata, setConfirmRoomsdata] = useState('');
  const { fullWidth } = useState(false);
  const { maxWidth } = useState('xs');
  const dialog = useBoolean(false);
  const [selectedValue] = useState('');
  const { t } = useTranslate();
  const { id } = useParams();
  const { Entrance, refetch } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { user } = useAuthContext();
  const router = useRouter();
  const methods = useForm({
    mode: 'onTouched',
  });
  const { roomsData } = useGetUSRooms(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { medicalreportsdata } = useGetEntranceExaminationReports(id);
  const { doctorreportsdata } = useGetEntranceDoctorReports(id);
  const { prescriptionData } = useGeEntrancePrescription(id);

  const medicalReportIds = medicalreportsdata?.map((report) => report._id);
  const doctorReportIds = doctorreportsdata?.map((report) => report._id);
  const prescriptionIds = prescriptionData?.map((report) => report._id);

  const { reset } = methods;

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
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        appointment: Entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
        unit_service_patient: Entrance?.unit_service_patient,
      });
      await axiosInstance.post(`/api/medrecord/`, {
        appointmentId: Entrance?.appointmentId,
        Appointment_date: Entrance?.Appointment_date,
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        service_unit: Entrance?.service_unit,
        patient: Entrance?.patient?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        medical_report: medicalReportIds,
        doctor_report: doctorReportIds,
        Drugs_report: prescriptionIds,
      });
   
      enqueueSnackbar('appointment finished', { variant: 'success' });
      refetch();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      unit_service_patient: Entrance?.unit_service_patient,
      service_unit: Entrance?.service_unit?._id,
      unit_service:
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
          ?._id,
      appointment: Entrance?.appointmentId,
    });
  }, [user, Entrance, reset]);

  return (
    <>
      <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '10px',
          }}
        >
          <DialogTitle>{t('Are you sure')}</DialogTitle>
          <Image
            src={next}
            alt="Processing"
            sx={{
              width: '200px',
              height: '200px',
            }}
          />
        </div>
        <DialogContent>
          <Typography sx={{ mb: 1, fontSize: 15 }}>
            {t('please confirm moving the patient to another room')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            sx={{
              mr: 1,
              border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.48)}`,
            }}
            onClick={() => dialog.onFalse()}
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
              dialog.onFalse();
              processingPage(Confirmdroomsdata);
            }}
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        sx={{
          display: { md: 'flex', xs: 'grid' },
          gridTemplateColumns: '1fr',
          gap: { md: 15, xs: 1 },
        }}
      >
        <Box sx={{ m: 2 }}>
          <Typography variant="h6">{t('Last activity')}</Typography>
          <Typography>{Entrance?.Last_activity_atended?.name_english}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('Doctor Message')}
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{ __html: formatTextWithLineBreaks(Entrance?.note || '') }}
          />
        </Box>

        <Box sx={{ m: 2 }}>
          <Typography variant="h6">{t('Next Activity')}</Typography>
          <Box sx={{ mb: 9 }}>
            <Box>
              <TextField
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t('Add Message')}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Select
                sx={{
                  width: 150,
                  height: 35,
                }}
                value={selectedValue}
                displayEmpty
              >
                <MenuItem value="" disabled sx={{ display: 'none' }}>
                  {t('Choose')}
                </MenuItem>
                {roomsData?.map((rooms, index) => {
                  const employeeNames = Array.isArray(rooms.employee)
                    ? rooms.employee.map((employee) => employee.name_english).join(', ')
                    : '';

                  return (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        if (
                          Entrance?.Current_activity?.name_english !==
                          rooms?.activities?.name_english
                        ) {
                          setConfirmRoomsdata(rooms);
                          dialog.onTrue();
                        }
                      }}
                      variant="contained"
                      sx={{
                        bgcolor:
                          Entrance?.Current_activity?.name_english ===
                          rooms?.activities?.name_english
                            ? ''
                            : 'success.main',
                        m: 2,
                      }}
                      disabled={
                        Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                      }
                    >
                      {Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                        ? `${rooms?.name_english} (Current) ${employeeNames}`
                        : `Go to ${rooms?.name_english} ${employeeNames}`}
                    </MenuItem>
                  );
                })}
              </Select>
              <Button
                onClick={() => handleEndAppointment()}
                variant="contained"
                sx={{ bgcolor: 'error.main', ml: 2 }}
              >
                {t('end appointment')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
}
