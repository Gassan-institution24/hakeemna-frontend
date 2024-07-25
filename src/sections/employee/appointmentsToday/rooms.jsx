import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

// import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import {
  useGetUSRooms,
  useGeEntrancePrescription,
  useGetOneEntranceManagement,
  useGetEntranceDoctorReports,
  useGetEntranceExaminationReports,
} from 'src/api';

// ----------------------------------------------------------------------

export default function Rooms() {
  // const { t } = useTranslate();
  const [noteContent, setNoteContent] = useState('');
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

  console.log(medicalReportIds);

  const { reset } = methods;

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
      unit_service: Entrance?.service_unit?._id,
      appointment: Entrance?.appointmentId,
    });
  }, [user, Entrance, reset]);

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
      console.log(error.message);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };
  const handleEndAppointment = async () => {
    try {
      await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
        Patient_attended: true,
      });
      await axiosInstance.patch(`/api/appointments/${Entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      await axiosInstance.post('/api/feedback', {
        unit_service: Entrance?.service_unit?._id,
        appointment: Entrance?.appointmentId,
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
      });
      await axiosInstance.post(`/api/medrecord/`, {
        appointmentId: Entrance?.appointmentId,
        Appointment_date: Entrance?.Appointment_date,
        service_unit: Entrance?.service_unit,
        patient: Entrance?.patient?._id,
        medical_report: medicalReportIds,
        doctor_report: doctorReportIds,
        Drugs_report: prescriptionIds,
        // sick_leave: prescriptionIds,
      });

      // await axiosInstance.patch(`/api/rooms/${receptionActivity?._id}`, {
      //   patient: null,
      //   entranceMangament: null,
      // });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      refetch();
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('something went wrong', { variant: 'error' });
    }
  };
  return (
    <Card sx={{ display: 'flex', gap: 20 }}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6">Last Activity</Typography>
        <Typography>{Entrance?.Last_activity_atended?.name_english}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Doctor Message
        </Typography>
        <Typography>{Entrance?.note}</Typography>
      </Box>

      <Box sx={{ m: 2 }}>
        <Typography variant="h6">Next Activity</Typography>
        <Box sx={{ m: 2, display: 'grid', gridTemplateColumns: '1fr 1fr ' }}>
          <TextField
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add comment"
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2, display: 'inline' }}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {roomsData?.map((rooms, index) => (
              <Button
                key={index}
                onClick={() => {
                  if (
                    Entrance?.Current_activity?.name_english !== rooms?.activities?.name_english
                  ) {
                    processingPage(rooms);
                  }
                }}
                variant="contained"
                sx={{
                  bgcolor:
                    Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                      ? 'green'
                      : 'success.main',
                  m: 2,
                }}
                disabled={
                  Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                }
              >
                {Entrance?.Current_activity?.name_english === rooms?.activities?.name_english
                  ? `${rooms?.activities?.name_english} (Current)`
                  : `Go to ${rooms?.activities?.name_english} Room`}
              </Button>
            ))}
            <Button
              onClick={() => handleEndAppointment()}
              variant="contained"
              sx={{ bgcolor: 'error.main', ml: 2 }}
            >
              end appointment
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
